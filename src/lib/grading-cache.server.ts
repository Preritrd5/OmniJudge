import * as crypto from "crypto";
import * as fs from "fs";
import * as path from "path";
import type { EvaluationResult } from "./evaluation.server";

// ─── Version Constants ────────────────────────────────────────────────────────
export const GRADING_PROMPT_VERSION = "v1";
export const GRADING_CONFIG_VERSION = "v1";
export const GRADING_SEED = 42;

// ─── Cache Directory ─────────────────────────────────────────────────────────
const CACHE_DIR = path.resolve(process.cwd(), ".cache", "grading");

try {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }
} catch (e) {
  console.warn("[grading-cache] Could not initialize local cache dir:", e);
}

// ─── Cryptographic PDF Hashing ───────────────────────────────────────────────
export function computePdfHash(pdfBuffer: Buffer | Uint8Array | string): string {
  let buf: Buffer;
  if (typeof pdfBuffer === "string") {
    // If base64 string
    buf = Buffer.from(pdfBuffer, "base64");
  } else if (Buffer.isBuffer(pdfBuffer)) {
    buf = pdfBuffer;
  } else {
    buf = Buffer.from(pdfBuffer);
  }
  return crypto.createHash("sha256").update(buf).digest("hex");
}

// ─── Rubric Canonical Fingerprint ─────────────────────────────────────────────
const CRITERIA_PATH = path.resolve(process.cwd(), "criteria-config.json");

export function getRubricFingerprint(): { version: string; hash: string } {
  let rawCriteria: any[] = [];
  let configVersion = "v1";

  try {
    if (fs.existsSync(CRITERIA_PATH)) {
      const parsed = JSON.parse(fs.readFileSync(CRITERIA_PATH, "utf-8"));
      if (parsed.version != null) {
        configVersion = `v${parsed.version}`;
      }
      if (Array.isArray(parsed.criteria)) {
        rawCriteria = parsed.criteria;
      }
    }
  } catch (e) {
    console.warn("[grading-cache] Error reading criteria-config for rubric fingerprint:", e);
  }

  // Canonicalize criteria: sorted by ID, normalized keys
  const sorted = [...rawCriteria].sort((a, b) => String(a.id || "").localeCompare(String(b.id || "")));
  const canonical = JSON.stringify(
    sorted.map((c) => ({
      id: String(c.id || ""),
      name: String(c.name || ""),
      maxScore: Number(c.maxScore ?? 10),
      description: String(c.description || ""),
      type: String(c.type || "manual"),
      evalMode: String(c.evalMode || c.type || "manual"),
    }))
  );

  const hash = crypto.createHash("sha256").update(canonical).digest("hex").slice(0, 16);
  return { version: configVersion, hash };
}

// ─── Canonical Grading Fingerprint ───────────────────────────────────────────
export interface GradingFingerprintInputs {
  pdfHash: string;
  category?: string;
  promptVersion?: string;
  rubricVersion?: string;
  modelVersion?: string;
  gradingConfigVersion?: string;
}

export function computeGradingFingerprint(inputs: GradingFingerprintInputs): string {
  const normalizedCategory = (inputs.category || "").trim().toLowerCase();
  const promptVer = inputs.promptVersion || GRADING_PROMPT_VERSION;
  const rubricVer = inputs.rubricVersion || getRubricFingerprint().hash;
  const modelVer = inputs.modelVersion || (process.env.AI_MODEL || "gemini-3.6-flash");
  const configVer = inputs.gradingConfigVersion || GRADING_CONFIG_VERSION;

  const raw = [
    inputs.pdfHash,
    normalizedCategory,
    promptVer,
    rubricVer,
    modelVer,
    configVer,
  ].join("::");

  return crypto.createHash("sha256").update(raw).digest("hex");
}

// ─── In-Flight Lock & Deduplication Map ───────────────────────────────────────
const inFlightGrading = new Map<string, Promise<EvaluationResult>>();

// ─── In-Memory Cache ──────────────────────────────────────────────────────────
const memoryCache = new Map<string, EvaluationResult>();

// ─── Metrics for Observability & Testing ──────────────────────────────────────
export const gradingMetrics = {
  totalEvaluations: 0,
  cacheHits: 0,
  cacheMisses: 0,
  inFlightDedupHits: 0,
  geminiApiCalls: 0,
  reset() {
    this.totalEvaluations = 0;
    this.cacheHits = 0;
    this.cacheMisses = 0;
    this.inFlightDedupHits = 0;
    this.geminiApiCalls = 0;
  },
};

// ─── Cache Access Functions ───────────────────────────────────────────────────

export function getCachedGrading(fingerprint: string): EvaluationResult | null {
  // 1. Check memory cache
  if (memoryCache.has(fingerprint)) {
    gradingMetrics.cacheHits++;
    const res = memoryCache.get(fingerprint)!;
    return {
      ...res,
      audit: res.audit ? { ...res.audit, isCachedResult: true } : undefined,
    };
  }

  // 2. Check local disk cache
  const diskPath = path.join(CACHE_DIR, `${fingerprint}.json`);
  if (fs.existsSync(diskPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(diskPath, "utf-8")) as EvaluationResult;
      if (data && Array.isArray(data.criteria) && data.totalScore != null) {
        memoryCache.set(fingerprint, data);
        gradingMetrics.cacheHits++;
        return {
          ...data,
          audit: data.audit ? { ...data.audit, isCachedResult: true } : undefined,
        };
      }
    } catch (e) {
      console.warn("[grading-cache] Corrupted disk cache file ignored:", diskPath);
    }
  }

  return null;
}

export async function setCachedGrading(fingerprint: string, result: EvaluationResult): Promise<void> {
  // Only cache valid evaluations with criteria
  if (!result || !Array.isArray(result.criteria) || result.criteria.length === 0) {
    return;
  }

  // 1. Set in-memory cache
  memoryCache.set(fingerprint, result);

  // 2. Persist to local disk
  try {
    const diskPath = path.join(CACHE_DIR, `${fingerprint}.json`);
    fs.writeFileSync(diskPath, JSON.stringify(result, null, 2), "utf-8");
  } catch (e) {
    console.warn("[grading-cache] Failed to persist cache to disk:", e);
  }

  // 3. Persist to Supabase storage app_state asynchronously (non-blocking)
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const buffer = Buffer.from(JSON.stringify(result), "utf-8");
    supabaseAdmin.storage
      .from("app_state")
      .upload(`grading-cache/${fingerprint}.json`, buffer, {
        contentType: "application/json",
        upsert: true,
      })
      .then(({ error }) => {
        if (error) console.warn("[grading-cache] Supabase storage upload notice:", error.message);
      })
      .catch(() => {});
  } catch {}
}

export function clearGradingCache(): void {
  memoryCache.clear();
  try {
    if (fs.existsSync(CACHE_DIR)) {
      const files = fs.readdirSync(CACHE_DIR);
      for (const f of files) {
        if (f.endsWith(".json")) {
          fs.unlinkSync(path.join(CACHE_DIR, f));
        }
      }
    }
  } catch (e) {
    console.warn("[grading-cache] Error clearing disk cache:", e);
  }
}

// ─── Deduplicated Execution Wrapper ──────────────────────────────────────────
export async function runWithGradingDeduplication(
  fingerprint: string,
  executeFn: () => Promise<EvaluationResult>
): Promise<EvaluationResult> {
  // Check in-flight promise first to prevent concurrent parallel Gemini calls
  const inFlight = inFlightGrading.get(fingerprint);
  if (inFlight) {
    gradingMetrics.inFlightDedupHits++;
    gradingMetrics.cacheHits++;
    const res = await inFlight;
    return {
      ...res,
      audit: res.audit ? { ...res.audit, isCachedResult: true } : undefined,
    };
  }

  // Create new in-flight execution promise
  const promise = (async () => {
    try {
      const result = await executeFn();
      // Ensure result is cached
      await setCachedGrading(fingerprint, result);
      return result;
    } finally {
      inFlightGrading.delete(fingerprint);
    }
  })();

  inFlightGrading.set(fingerprint, promise);
  return await promise;
}
