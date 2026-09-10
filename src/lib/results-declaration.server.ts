import * as fs from "fs";
import * as path from "path";

export interface ResultsDeclarationConfig {
  qualifiedTeamIds?: string[];
  excludedTeamIds: string[];
  published: boolean;
  publishedAt?: string;
  customNote?: string;
  updatedAt?: string;
}

const STORAGE_BUCKET = "app_state";
const STORAGE_KEY = "results_declaration.json";
const LOCAL_STORE_PATH = path.resolve(process.cwd(), "results-declaration-store.json");

const DEFAULT_TOPICS = [
  { id: "T1", name: "Agriculture, FoodTech & Rural Development" },
  { id: "T2", name: "Blockchain & Cybersecurity" },
  { id: "T3", name: "Clean & Green Technology" },
  { id: "T4", name: "Disaster Management" },
  { id: "T5", name: "Fitness & Sports" },
  { id: "T6", name: "Heritage & Culture" },
  { id: "T7", name: "MedTech / BioTech / HealthTech" },
  { id: "T8", name: "Miscellaneous" },
  { id: "T9", name: "Renewable / Sustainable Energy" },
  { id: "T10", name: "Robotics and Drones" },
  { id: "T11", name: "Smart Automation" },
  { id: "T12", name: "Smart Education" },
  { id: "T13", name: "Smart Vehicles" },
  { id: "T14", name: "Space Technology" },
  { id: "T15", name: "Toys & Games" },
  { id: "T16", name: "Transportation & Logistics" },
  { id: "T17", name: "Travel & Tourism" },
  { id: "T18", name: "Others" },
];

let _cachedConfig: ResultsDeclarationConfig | null = null;
let _lastFetchedAt = 0;
const CACHE_TTL_MS = 2000;

async function getSupabaseAdmin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

function normalizeConfig(raw: any): ResultsDeclarationConfig {
  return {
    qualifiedTeamIds: Array.isArray(raw?.qualifiedTeamIds)
      ? raw.qualifiedTeamIds.map(String)
      : undefined,
    excludedTeamIds: Array.isArray(raw?.excludedTeamIds)
      ? raw.excludedTeamIds.map(String)
      : [],
    published: Boolean(raw?.published),
    publishedAt: raw?.publishedAt || undefined,
    customNote: typeof raw?.customNote === "string" ? raw.customNote : undefined,
    updatedAt: raw?.updatedAt || new Date().toISOString(),
  };
}

export async function getResultsDeclaration(forceFresh = false): Promise<ResultsDeclarationConfig> {
  const now = Date.now();
  if (!forceFresh && _cachedConfig !== null && now - _lastFetchedAt < CACHE_TTL_MS) {
    return _cachedConfig;
  }

  try {
    const supabase = await getSupabaseAdmin();
    const { data: blob, error } = await supabase.storage.from(STORAGE_BUCKET).download(STORAGE_KEY);

    if (!error && blob) {
      const text = await blob.text();
      const parsed = JSON.parse(text);
      _cachedConfig = normalizeConfig(parsed);
      _lastFetchedAt = now;
      try {
        fs.writeFileSync(LOCAL_STORE_PATH, JSON.stringify(_cachedConfig, null, 2), "utf-8");
      } catch {}
      return _cachedConfig;
    }

    const isNotFound = error && (
      error.message?.toLowerCase().includes("not found") ||
      (error as any).status === 400 ||
      (error as any).status === 404
    );

    if (isNotFound) {
      const initial: ResultsDeclarationConfig = {
        excludedTeamIds: [],
        published: true,
        publishedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      _cachedConfig = initial;
      _lastFetchedAt = now;
      await saveResultsDeclaration(initial);
      return initial;
    }
  } catch (err) {
    console.warn("[results-declaration.server] Failed to fetch from cloud storage:", err);
  }

  if (_cachedConfig !== null) {
    return _cachedConfig;
  }

  try {
    if (fs.existsSync(LOCAL_STORE_PATH)) {
      const parsed = JSON.parse(fs.readFileSync(LOCAL_STORE_PATH, "utf-8"));
      _cachedConfig = normalizeConfig(parsed);
      _lastFetchedAt = now;
      return _cachedConfig;
    }
  } catch {}

  const fallback: ResultsDeclarationConfig = {
    excludedTeamIds: [],
    published: true,
    updatedAt: new Date().toISOString(),
  };
  _cachedConfig = fallback;
  _lastFetchedAt = now;
  return fallback;
}

export async function saveResultsDeclaration(
  config: Partial<ResultsDeclarationConfig>
): Promise<ResultsDeclarationConfig> {
  const existing = await getResultsDeclaration();
  const updated: ResultsDeclarationConfig = {
    ...existing,
    ...config,
    qualifiedTeamIds: Array.isArray(config.qualifiedTeamIds)
      ? config.qualifiedTeamIds.map(String)
      : existing.qualifiedTeamIds,
    excludedTeamIds: Array.isArray(config.excludedTeamIds)
      ? config.excludedTeamIds.map(String)
      : existing.excludedTeamIds,
    updatedAt: new Date().toISOString(),
  };

  _cachedConfig = updated;
  _lastFetchedAt = Date.now();

  try {
    const supabase = await getSupabaseAdmin();
    await supabase.storage.from(STORAGE_BUCKET).upload(STORAGE_KEY, JSON.stringify(updated, null, 2), {
      contentType: "application/json",
      upsert: true,
    });
  } catch (err) {
    console.error("[results-declaration.server] Failed to upload declaration to storage:", err);
  }

  try {
    fs.writeFileSync(LOCAL_STORE_PATH, JSON.stringify(updated, null, 2), "utf-8");
  } catch {}

  return updated;
}

export async function fetchPublicResultsData() {
  const supabase = await getSupabaseAdmin();
  const declaration = await getResultsDeclaration();
  
  let topics = DEFAULT_TOPICS;
  try {
    const TOPICS_PATH = path.resolve(process.cwd(), "topics-config.json");
    if (fs.existsSync(TOPICS_PATH)) {
      const parsed = JSON.parse(fs.readFileSync(TOPICS_PATH, "utf-8"));
      if (Array.isArray(parsed.topics)) topics = parsed.topics;
    }
  } catch {}

  const { getAllTeamProfiles } = await import("./team-store.server");
  const profiles = getAllTeamProfiles();

  const [teamsRes, subsRes] = await Promise.all([
    supabase.from("teams").select("id, name"),
    supabase
      .from("submissions")
      .select("id, team_id, score, category, status")
      .order("created_at", { ascending: false }),
  ]);

  const hasExplicitQualified = Array.isArray(declaration.qualifiedTeamIds);
  const qualifiedSet = hasExplicitQualified
    ? new Set(declaration.qualifiedTeamIds)
    : null;
  const excludedSet = new Set(declaration.excludedTeamIds || []);

  const qualifiedTeams = (teamsRes.data || [])
    .map((t) => {
      const prof = profiles[t.id];
      let leaderName = prof?.leaderName;
      if (!leaderName) {
        for (const p of Object.values(profiles)) {
          if (p.teamName?.toLowerCase().trim() === t.name?.toLowerCase().trim()) {
            leaderName = p.leaderName;
            break;
          }
        }
      }
      leaderName = leaderName || (t as any).leader_name || "Team Leader";

      const teamSubs = (subsRes.data || []).filter((s) => s.team_id === t.id);
      const best = teamSubs.reduce<number | null>(
        (acc, s) => (s.score != null && (acc == null || s.score > acc) ? s.score : acc),
        null,
      );
      const category = teamSubs.find((s) => s.category)?.category || "General Track";
      return {
        id: t.id,
        name: t.name,
        leader_name: leaderName,
        leader_email: prof?.leaderEmail || "",
        bestScore: best,
        category,
      };
    })
    .filter((t) => {
      if (hasExplicitQualified) {
        return qualifiedSet!.has(t.id);
      }
      return t.bestScore != null && !excludedSet.has(t.id);
    })
    .sort((a, b) => (b.bestScore ?? 0) - (a.bestScore ?? 0));

  // Public sanitization: ONLY return team names, leader names, and categories (NO SCORES / NO MARKS)
  const sanitizedPublicTeams = qualifiedTeams.map((t) => ({
    id: t.id,
    name: t.name,
    leader_name: t.leader_name,
    category: t.category,
  }));

  return {
    ok: true,
    declaration,
    qualifiedTeams: sanitizedPublicTeams,
    curatedTeams: sanitizedPublicTeams, // alias for backwards compatibility
    podium: {
      firstPlace: null,
      secondPlace: null,
      thirdPlace: null,
    },
    categoryWinners: [],
    topics,
  };
}
