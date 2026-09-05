import { _t as objectType, gt as numberType, mt as booleanType, pt as arrayType, yt as stringType } from "../_libs/@ai-sdk/gateway+[...].mjs";
import { t as generateText } from "../_libs/ai.mjs";
import { t as createOpenAICompatible } from "../_libs/ai-sdk__openai-compatible.mjs";
import * as fs from "fs";
import * as path from "path";
//#region node_modules/.nitro/vite/services/ssr/assets/evaluation.server-B4owh2gr.js
/**
* Creates an OpenAI-compatible AI provider pointing to the configured gateway.
* Set AI_GATEWAY_BASE_URL and AI_GATEWAY_API_KEY in your .env to override defaults.
*/
function createAiGatewayProvider(apiKey) {
	return createOpenAICompatible({
		name: "ai-gateway",
		baseURL: process.env.AI_GATEWAY_BASE_URL || "https://ai.gateway.lovable.dev/v1",
		headers: {
			Authorization: `Bearer ${apiKey}`,
			"x-api-key": apiKey
		}
	});
}
var CRITERIA_PATH = path.resolve(process.cwd(), "criteria-config.json");
function readCriteriaConfig() {
	try {
		if (fs.existsSync(CRITERIA_PATH)) {
			const raw = JSON.parse(fs.readFileSync(CRITERIA_PATH, "utf-8"));
			if (Array.isArray(raw?.criteria) && raw.criteria.length > 0) return raw.criteria.map((c) => ({
				...c,
				type: c.type || (c.id === "F7" || c.id === "F8" ? "manual" : "ai"),
				evalMode: c.evalMode || c.type || (c.id === "F7" || c.id === "F8" ? "manual" : "ai")
			}));
		}
	} catch {}
	return [
		{
			id: "F1",
			name: "Innovation & Creativity",
			maxScore: 10,
			description: "Novelty of idea & creative problem-solving",
			type: "ai",
			evalMode: "ai"
		},
		{
			id: "F2",
			name: "Technical Feasibility",
			maxScore: 10,
			description: "Complexity, feasibility, and scalability",
			type: "ai",
			evalMode: "ai"
		},
		{
			id: "F3",
			name: "User Experience & Design",
			maxScore: 10,
			description: "UI/UX, accessibility, and inclusivity",
			type: "ai",
			evalMode: "ai"
		},
		{
			id: "F4",
			name: "Impact & Usefulness",
			maxScore: 10,
			description: "Problem-solution fit, potential impact, and multiple use cases",
			type: "ai",
			evalMode: "ai"
		},
		{
			id: "F5",
			name: "Technical Execution",
			maxScore: 10,
			description: "Prototype, code quality, and technology stack",
			type: "ai",
			evalMode: "ai"
		},
		{
			id: "F6",
			name: "Sustainability & Future Scope",
			maxScore: 10,
			description: "Long-term viability & eco-friendly practices",
			type: "ai",
			evalMode: "ai"
		},
		{
			id: "F7",
			name: "Presentation & Communication",
			maxScore: 10,
			description: "Clarity, pitch effectiveness, and Q&A handling (Evaluated manually by jury)",
			type: "manual",
			evalMode: "manual"
		},
		{
			id: "F8",
			name: "Collaboration & Teamwork",
			maxScore: 10,
			description: "Team dynamics & problem-solving approach (Evaluated manually by jury)",
			type: "manual",
			evalMode: "manual"
		},
		{
			id: "F9",
			name: "Business Viability (if applicable)",
			maxScore: 10,
			description: "Market potential, revenue model, and affordability",
			type: "ai",
			evalMode: "ai"
		},
		{
			id: "F10",
			name: "Security & Privacy",
			maxScore: 10,
			description: "Data protection & compliance with privacy regulations",
			type: "ai",
			evalMode: "ai"
		}
	];
}
var CriterionSchema = objectType({
	id: stringType(),
	name: stringType(),
	score: numberType(),
	evidence: stringType(),
	strengths: stringType(),
	weaknesses: stringType(),
	deductions: stringType(),
	type: stringType().optional(),
	evalMode: stringType().optional(),
	isManuallyGraded: booleanType().optional()
});
var ResultSchema = objectType({
	executiveSummary: stringType(),
	problemStatement: stringType(),
	solution: stringType(),
	criteria: arrayType(CriterionSchema),
	strengths: arrayType(stringType()),
	weaknesses: arrayType(stringType()),
	risks: arrayType(stringType()),
	suggestions: arrayType(stringType()),
	totalScore: numberType(),
	overallRating: stringType()
});
function buildSystemPrompt(category) {
	const criteriaList = readCriteriaConfig();
	const maxTotal = criteriaList.reduce((s, c) => s + c.maxScore, 0);
	const aiCriteria = criteriaList.filter((c) => c.type !== "manual" && c.id !== "F7" && c.id !== "F8");
	const manualCriteria = criteriaList.filter((c) => c.type === "manual" || c.id === "F7" || c.id === "F8");
	const criteriaText = criteriaList.map((c) => {
		const isManual = c.type === "manual" || c.id === "F7" || c.id === "F8";
		return `${c.id}. ${c.name} (${c.maxScore} pts) [${isManual ? "MANUAL EVALUATION BY JURY" : "AI EVALUATION FROM PDF"}] — ${c.description}`;
	}).join("\n");
	const count = criteriaList.length;
	return `You are the Official Evaluation Engine for Ideathon 2026.
${category ? `The team has selected the following topic/category: "${category}". Please evaluate their submission within the context of this category.` : ""}

IMPORTANT EVALUATION PROTOCOL (AI vs MANUAL CRITERIA):
1. [AI EVALUATION FROM PDF]: (${aiCriteria.map((c) => c.id).join(", ")})
   Read the entire submission PDF. Score strictly using concrete evidence, quotes, or paraphrased details from the document.
   Bands per criterion (0-maxScore): 9-10 outstanding, 7-8 strong, 5-6 average, 3-4 weak, 0-2 missing.
   Never score based on buzzwords. Every awarded mark must cite evidence; every deduction must be justified.

2. [MANUAL EVALUATION BY JURY]: (${manualCriteria.map((c) => `${c.id} - ${c.name}`).join(", ")})
   These criteria represent in-person presentation, live pitch delivery, Q&A defense, and team dynamics.
   They CANNOT and MUST NOT be graded from the uploaded PDF proposal. They will be scored MANUALLY in person by human judges during the live pitch.
   For these manual criteria:
   - score: MUST be exactly 0 (they will be filled in manually by the judging panel).
   - evidence: MUST state "Pending manual evaluation: To be evaluated by judges during live presentation & Q&A."
   - strengths: MUST state "To be evaluated during live pitch."
   - weaknesses: MUST state "To be evaluated during live pitch."
   - deductions: MUST state "None (Evaluated manually)"

Criteria List (${count} total, max potential total = ${maxTotal}):
${criteriaText}

Return all ${count} criteria in order.
totalScore = sum of criterion scores (which will be the sum of the AI-evaluated criteria, max 80 for standard 10-point rubric).
Overall rating scale: Excellent 85-100; Strong 70-84; Promising with gaps 61-69; Major gaps 41-60; Weak/incomplete 0-40.

Respond with ONLY a single JSON object (no markdown, no prose, no code fences) matching this TypeScript type:
{
  executiveSummary: string;
  problemStatement: string;
  solution: string;
  criteria: { id: string; name: string; score: number; evidence: string; strengths: string; weaknesses: string; deductions: string }[];
  strengths: string[];
  weaknesses: string[];
  risks: string[];
  suggestions: string[];
  totalScore: number;
  overallRating: string;
}`;
}
function extractJson(text) {
	let s = text.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
	const start = s.search(/[\{\[]/);
	const closeCh = s[start] === "[" ? "]" : "}";
	const end = s.lastIndexOf(closeCh);
	if (start === -1 || end === -1) throw new Error("No JSON found in model response");
	s = s.substring(start, end + 1);
	try {
		return JSON.parse(s);
	} catch {
		s = s.replace(/,\s*}/g, "}").replace(/,\s*]/g, "]").replace(/[\x00-\x1F\x7F]/g, " ");
		return JSON.parse(s);
	}
}
function standardizeResult(result) {
	const criteriaConfig = readCriteriaConfig();
	const configMap = new Map(criteriaConfig.map((c) => [c.id, c]));
	result.criteria = result.criteria.map((c) => {
		const isManual = configMap.get(c.id)?.type === "manual" || c.id === "F7" || c.id === "F8";
		return {
			...c,
			score: isManual ? c.isManuallyGraded ? c.score : 0 : c.score,
			type: isManual ? "manual" : "ai",
			evalMode: isManual ? "manual" : "ai",
			isManuallyGraded: Boolean(c.isManuallyGraded)
		};
	});
	result.totalScore = result.criteria.reduce((sum, c) => sum + (c.score || 0), 0);
	return result;
}
async function evaluatePdf(base64Pdf, fileName, category) {
	const key = process.env.OPENAI_API_KEY;
	if (!key) throw new Error("Missing OPENAI_API_KEY environment variable");
	const isDirectGemini = (process.env.AI_GATEWAY_BASE_URL || "").includes("googleapis.com");
	const SYSTEM = buildSystemPrompt(category);
	const modelsToTry = isDirectGemini ? [
		process.env.AI_MODEL || "gemini-3.7-flash",
		"gemini-3.6-flash",
		"gemini-flash-latest",
		"gemini-2.5-pro"
	] : [process.env.AI_MODEL || "google/gemini-3-pro-preview"];
	let lastError;
	for (const model of modelsToTry) try {
		if (isDirectGemini) {
			const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					contents: [{ parts: [{ text: `${SYSTEM}\n\nEvaluate the attached submission PDF (${fileName}) per the rubric. Read every page. Cite concrete evidence (quote or paraphrase with page reference) for each criterion. Do not infer features that are not explicitly stated. Return ONLY the JSON object described in the system message.` }, { inlineData: {
						mimeType: "application/pdf",
						data: base64Pdf
					} }] }],
					generationConfig: {
						temperature: 0,
						responseMimeType: "application/json"
					}
				})
			});
			if (!res.ok) {
				const errText = await res.text();
				throw new Error(`Gemini API error (${res.status}): ${errText}`);
			}
			const text = (await res.json()).candidates?.[0]?.content?.parts?.[0]?.text;
			if (!text) throw new Error("Empty response from Gemini API");
			return standardizeResult(ResultSchema.parse(extractJson(text)));
		} else {
			const { text } = await generateText({
				model: createAiGatewayProvider(key)(model),
				temperature: 0,
				system: SYSTEM,
				messages: [{
					role: "user",
					content: [{
						type: "text",
						text: `Evaluate the attached submission PDF (${fileName}) per the rubric. Read every page. Cite concrete evidence (quote or paraphrase with page reference) for each criterion. Do not infer features that are not explicitly stated. Return ONLY the JSON object described in the system message.`
					}, {
						type: "file",
						mediaType: "application/pdf",
						data: base64Pdf
					}]
				}]
			});
			return standardizeResult(ResultSchema.parse(extractJson(text)));
		}
	} catch (e) {
		console.error(`[evaluatePdf] model ${model} failed:`, e?.message || e);
		lastError = e;
	}
	throw lastError || /* @__PURE__ */ new Error("Failed to evaluate PDF with all available AI models.");
}
//#endregion
export { evaluatePdf };
