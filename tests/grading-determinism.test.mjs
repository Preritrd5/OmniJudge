import fs from "fs";
import path from "path";
import crypto from "crypto";

// Load environment variables
const envPath = path.resolve(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      let v = match[2] || "";
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        v = v.slice(1, -1);
      }
      process.env[match[1]] = v.trim();
    }
  }
}

// Dynamic imports of server modules
const {
  evaluatePdf,
  standardizeResult,
  extractJson,
} = await import("../src/lib/evaluation.server.ts");

const {
  computePdfHash,
  computeGradingFingerprint,
  getRubricFingerprint,
  getCachedGrading,
  setCachedGrading,
  clearGradingCache,
  gradingMetrics,
  GRADING_PROMPT_VERSION,
} = await import("../src/lib/grading-cache.server.ts");

console.log("===============================================================");
console.log("   DETERMINISTIC GRADING PIPELINE — 8-TEST VERIFICATION SUITE   ");
console.log("===============================================================\n");

let passedCount = 0;
let failedCount = 0;

function assert(condition, message) {
  if (!condition) {
    console.error(`  ❌ FAILED: ${message}`);
    failedCount++;
    throw new Error(`Assertion failed: ${message}`);
  }
}

function pass(testName, details) {
  console.log(`  ✅ ${testName}: PASSED`);
  if (details) console.log(`     -> ${details}`);
  passedCount++;
}

// Prepare sample PDF
const samplePdfPath = path.resolve(
  "C:/Users/Ananya/.gemini/antigravity/brain/3aff6e1b-fff4-47c5-b518-a578aa5d948d/scratch/test_ml.pdf"
);
let pdfBuffer;
if (fs.existsSync(samplePdfPath)) {
  pdfBuffer = fs.readFileSync(samplePdfPath);
} else {
  // Minimal valid PDF structure
  pdfBuffer = Buffer.from(
    "%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Count 1/Kids[3 0 R]>>endobj\n3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Resources<<>>>>endobj\nxref\n0 4\n0000000000 65535 f \n0000000009 00000 n \n0000000052 00000 n \n0000000101 00000 n \ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n178\n%%EOF\n"
  );
}

const base64Pdf = pdfBuffer.toString("base64");
const pdfHash = computePdfHash(pdfBuffer);
console.log(`Test PDF ready. Size: ${pdfBuffer.length} bytes, SHA256 Hash: ${pdfHash}\n`);

// ─────────────────────────────────────────────────────────────────────────────
// TEST 1: Same PDF submitted twice sequentially
// ─────────────────────────────────────────────────────────────────────────────
try {
  console.log("[TEST 1] Sequential Identical Submissions...");
  clearGradingCache();
  gradingMetrics.reset();

  const res1 = await evaluatePdf(base64Pdf, "submission_1.pdf", "AI & ML");
  const apiCallsAfterFirst = gradingMetrics.geminiApiCalls;

  const res2 = await evaluatePdf(base64Pdf, "submission_1_copy.pdf", "AI & ML");
  const apiCallsAfterSecond = gradingMetrics.geminiApiCalls;

  assert(res1.totalScore != null, "Result 1 has valid totalScore");
  assert(res2.totalScore != null, "Result 2 has valid totalScore");
  assert(res1.totalScore === res2.totalScore, `Scores must match: ${res1.totalScore} vs ${res2.totalScore}`);
  assert(res1.audit.pdfHash === res2.audit.pdfHash, "pdfHash matches");
  assert(res1.audit.gradingFingerprint === res2.audit.gradingFingerprint, "gradingFingerprint matches");
  assert(res2.audit.isCachedResult === true, "Result 2 was served from cache");
  assert(
    apiCallsAfterSecond === apiCallsAfterFirst,
    `Zero additional Gemini calls on second submission (${apiCallsAfterFirst} -> ${apiCallsAfterSecond})`
  );

  // Compare criterion scores
  for (let i = 0; i < res1.criteria.length; i++) {
    const c1 = res1.criteria[i];
    const c2 = res2.criteria[i];
    assert(c1.id === c2.id && c1.score === c2.score, `Criterion ${c1.id} score matches: ${c1.score} vs ${c2.score}`);
  }

  pass(
    "Test 1",
    `Identical score (${res1.totalScore}/100), identical fingerprint (${res1.audit.gradingFingerprint.slice(0, 12)}), exactly ${apiCallsAfterFirst} Gemini call`
  );
} catch (e) {
  console.error("Test 1 error:", e.message);
}

// ─────────────────────────────────────────────────────────────────────────────
// TEST 2: Same PDF submitted 5 times
// ─────────────────────────────────────────────────────────────────────────────
try {
  console.log("\n[TEST 2] Same PDF submitted 5 times...");
  const scores = [];
  for (let i = 1; i <= 5; i++) {
    const res = await evaluatePdf(base64Pdf, `same_deck_run_${i}.pdf`, "AI & ML");
    scores.push(res.totalScore);
  }

  const allIdentical = scores.every((s) => s === scores[0]);
  assert(allIdentical, `All 5 scores must be identical: [${scores.join(", ")}]`);
  pass("Test 2", `All 5 runs produced identical score: ${scores[0]}/100 with zero variance`);
} catch (e) {
  console.error("Test 2 error:", e.message);
}

// ─────────────────────────────────────────────────────────────────────────────
// TEST 3: Rubric change triggers new evaluation with different fingerprint
// ─────────────────────────────────────────────────────────────────────────────
try {
  console.log("\n[TEST 3] Rubric Invalidation...");
  const currentRubric = getRubricFingerprint();
  const fpOriginal = computeGradingFingerprint({
    pdfHash,
    category: "AI & ML",
    rubricVersion: currentRubric.hash,
  });

  const modifiedRubricHash = "modified_rubric_hash_999";
  const fpNewRubric = computeGradingFingerprint({
    pdfHash,
    category: "AI & ML",
    rubricVersion: modifiedRubricHash,
  });

  assert(fpOriginal !== fpNewRubric, "Fingerprint changes when rubric changes");
  assert(getCachedGrading(fpNewRubric) === null, "Modified rubric has no stale cache");

  pass(
    "Test 3",
    `Rubric change invalidates fingerprint (${fpOriginal.slice(0, 10)}... -> ${fpNewRubric.slice(0, 10)}...)`
  );
} catch (e) {
  console.error("Test 3 error:", e.message);
}

// ─────────────────────────────────────────────────────────────────────────────
// TEST 4: Prompt version change triggers new evaluation with different fingerprint
// ─────────────────────────────────────────────────────────────────────────────
try {
  console.log("\n[TEST 4] Prompt Version Invalidation...");
  const fpV1 = computeGradingFingerprint({
    pdfHash,
    category: "AI & ML",
    promptVersion: "v1",
  });

  const fpV2 = computeGradingFingerprint({
    pdfHash,
    category: "AI & ML",
    promptVersion: "v2",
  });

  assert(fpV1 !== fpV2, "Fingerprint changes when promptVersion changes");
  assert(getCachedGrading(fpV2) === null, "Prompt v2 has no stale cache");

  pass("Test 4", `Prompt v1 -> v2 creates distinct fingerprint (${fpV1.slice(0, 10)} -> ${fpV2.slice(0, 10)})`);
} catch (e) {
  console.error("Test 4 error:", e.message);
}

// ─────────────────────────────────────────────────────────────────────────────
// TEST 5: Different PDF gets different hash and different fingerprint
// ─────────────────────────────────────────────────────────────────────────────
try {
  console.log("\n[TEST 5] Different PDF Differentiation...");
  // Create a distinctly different PDF buffer
  const diffPdfBuffer = Buffer.concat([pdfBuffer, Buffer.from("\n% Extra unique content for doc 2\n")]);
  const diffHash = computePdfHash(diffPdfBuffer);
  const diffFingerprint = computeGradingFingerprint({
    pdfHash: diffHash,
    category: "AI & ML",
  });
  const origFingerprint = computeGradingFingerprint({
    pdfHash,
    category: "AI & ML",
  });

  assert(diffHash !== pdfHash, "Different PDF bytes yield different SHA-256");
  assert(diffFingerprint !== origFingerprint, "Different PDF yields different grading fingerprint");

  pass(
    "Test 5",
    `Hash 1: ${pdfHash.slice(0, 12)}... vs Hash 2: ${diffHash.slice(0, 12)}... (Fingerprints isolated)`
  );
} catch (e) {
  console.error("Test 5 error:", e.message);
}

// ─────────────────────────────────────────────────────────────────────────────
// TEST 6: Concurrent duplicate submissions -> single Gemini call, identical results
// ─────────────────────────────────────────────────────────────────────────────
try {
  console.log("\n[TEST 6] Concurrent Duplicate Requests (In-flight deduplication)...");
  // Create a brand new unique PDF buffer that has not been cached
  const concurrentBuffer = Buffer.from(
    `%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n% Concurrent Test ${Date.now()}\n%%EOF`
  );
  const concurrentBase64 = concurrentBuffer.toString("base64");
  const concurrentHash = computePdfHash(concurrentBuffer);

  gradingMetrics.reset();
  const initialApiCalls = gradingMetrics.geminiApiCalls;

  // Fire 3 simultaneous evaluation promises for the exact same PDF
  const [cRes1, cRes2, cRes3] = await Promise.all([
    evaluatePdf(concurrentBase64, "concurrent_1.pdf", "Cybersecurity", { pdfHash: concurrentHash }),
    evaluatePdf(concurrentBase64, "concurrent_2.pdf", "Cybersecurity", { pdfHash: concurrentHash }),
    evaluatePdf(concurrentBase64, "concurrent_3.pdf", "Cybersecurity", { pdfHash: concurrentHash }),
  ]);

  assert(cRes1.totalScore === cRes2.totalScore, "Concurrent res1 and res2 scores match");
  assert(cRes2.totalScore === cRes3.totalScore, "Concurrent res2 and res3 scores match");
  assert(cRes1.audit.gradingFingerprint === cRes2.audit.gradingFingerprint, "Fingerprints match");
  assert(gradingMetrics.inFlightDedupHits >= 1, "In-flight deduplication caught concurrent calls");

  pass(
    "Test 6",
    `3 concurrent calls resolved to identical score (${cRes1.totalScore}/100) with in-flight deduplication (${gradingMetrics.inFlightDedupHits} dedup hits)`
  );
} catch (e) {
  console.error("Test 6 error:", e.message);
}

// ─────────────────────────────────────────────────────────────────────────────
// TEST 7: Malformed / partial Gemini response handling
// ─────────────────────────────────────────────────────────────────────────────
try {
  console.log("\n[TEST 7] Malformed / Partial Gemini Response Handling...");
  let parseThrew = false;
  try {
    extractJson("Here is the partial response: ```json {\"criteria\": [ { \"id\": \"F1\", \"score\": 5");
  } catch (err) {
    parseThrew = true;
  }
  assert(parseThrew, "extractJson throws on truncated/malformed JSON");

  // Verify setCachedGrading rejects empty/invalid criteria results
  const badFingerprint = "corrupted_test_fingerprint_000";
  await setCachedGrading(badFingerprint, { criteria: [] });
  assert(getCachedGrading(badFingerprint) === null, "Corrupted/empty result was rejected and not cached");

  pass("Test 7", "Malformed LLM outputs rejected gracefully without polluting cache");
} catch (e) {
  console.error("Test 7 error:", e.message);
}

// ─────────────────────────────────────────────────────────────────────────────
// TEST 8: LLM arithmetic discrepancy -> code authoritative calculation always wins
// ─────────────────────────────────────────────────────────────────────────────
try {
  console.log("\n[TEST 8] LLM Arithmetic Discrepancy (Code Authoritative Calculation)...");
  // Simulate Gemini hallucinating totalScore: 56 when criteria scores actually sum to 63
  const mockCriteria = [
    { id: "F1",  name: "Innovation & Creativity",      score: 7, maxScore: 10, evidence: "e", strengths: "s", weaknesses: "w", deductions: "d" },
    { id: "F2",  name: "Technical Feasibility",         score: 6, maxScore: 10, evidence: "e", strengths: "s", weaknesses: "w", deductions: "d" },
    { id: "F3",  name: "User Experience & Design",      score: 6, maxScore: 10, evidence: "e", strengths: "s", weaknesses: "w", deductions: "d" },
    { id: "F4",  name: "Impact & Usefulness",           score: 7, maxScore: 10, evidence: "e", strengths: "s", weaknesses: "w", deductions: "d" },
    { id: "F5",  name: "Technical Execution",           score: 6, maxScore: 10, evidence: "e", strengths: "s", weaknesses: "w", deductions: "d" },
    { id: "F6",  name: "Sustainability & Future Scope", score: 6, maxScore: 10, evidence: "e", strengths: "s", weaknesses: "w", deductions: "d" },
    { id: "F7",  name: "Presentation & Communication",  score: 7, maxScore: 10, evidence: "e", strengths: "s", weaknesses: "w", deductions: "d" },
    { id: "F8",  name: "Collaboration & Teamwork",      score: 5, maxScore: 10, evidence: "e", strengths: "s", weaknesses: "w", deductions: "d" },
    { id: "F9",  name: "Business Viability",            score: 6, maxScore: 10, evidence: "e", strengths: "s", weaknesses: "w", deductions: "d" },
    { id: "F10", name: "Security & Privacy",            score: 7, maxScore: 10, evidence: "e", strengths: "s", weaknesses: "w", deductions: "d" },
  ];
  // 7+6+6+7+6+6+7+5+6+7 = 63

  const mockGeminiOutput = {
    executiveSummary: "Summary",
    problemStatement: "Problem",
    solution: "Solution",
    criteria: mockCriteria,
    strengths: ["Strong novelty"],
    weaknesses: ["Pending presentation"],
    risks: [],
    suggestions: ["Refine pitch"],
    totalScore: 56, // Hallucinated by LLM!
    overallRating: "Major gaps",
  };

  const standardized = standardizeResult(mockGeminiOutput);
  assert(
    standardized.totalScore === 63,
    `Code calculated score must be exactly 63, got: ${standardized.totalScore}`
  );
  assert(
    standardized.overallRating === "Promising with gaps",
    `Overall rating must be updated to Promising with gaps, got: ${standardized.overallRating}`
  );

  pass(
    "Test 8",
    `LLM hallucinated totalScore (56) overridden by code authoritative calculation (63) and rating (Promising with gaps)`
  );
} catch (e) {
  console.error("Test 8 error:", e.message);
}

// ─────────────────────────────────────────────────────────────────────────────
// Summary Report
// ─────────────────────────────────────────────────────────────────────────────
console.log("\n===============================================================");
console.log(`TOTAL TESTS: 8 | PASSED: ${passedCount} | FAILED: ${failedCount}`);
console.log("===============================================================");

if (failedCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
