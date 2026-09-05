import { i as TSS_SERVER_FUNCTION, l as createServerFn } from "./esm-9EjmF9OT.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-DDumpU6D.mjs";
import { _t as objectType, gt as numberType, ht as enumType, pt as arrayType, vt as recordType, yt as stringType } from "../_libs/@ai-sdk/gateway+[...].mjs";
import * as fs from "fs";
import * as path from "path";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.functions-z0rBwYCW.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var CRITERIA_PATH = path.resolve(process.cwd(), "criteria-config.json");
var TOPICS_PATH = path.resolve(process.cwd(), "topics-config.json");
var DEFAULT_CRITERIA = [
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
function readCriteriaFile() {
	try {
		if (fs.existsSync(CRITERIA_PATH)) {
			const parsed = JSON.parse(fs.readFileSync(CRITERIA_PATH, "utf-8"));
			if (Array.isArray(parsed.criteria)) parsed.criteria = parsed.criteria.map((c) => ({
				...c,
				type: c.type || (c.id === "F7" || c.id === "F8" ? "manual" : "ai"),
				evalMode: c.evalMode || c.type || (c.id === "F7" || c.id === "F8" ? "manual" : "ai")
			}));
			return parsed;
		}
	} catch {}
	return {
		version: 2,
		criteria: DEFAULT_CRITERIA
	};
}
var CriterionSchema = objectType({
	id: stringType().min(1).max(10),
	name: stringType().min(2).max(80),
	maxScore: numberType().int().min(1).max(100),
	description: stringType().max(300),
	type: enumType(["ai", "manual"]).default("ai"),
	evalMode: enumType(["ai", "manual"]).default("ai").optional()
});
var getCriteria_createServerFn_handler = createServerRpc({
	id: "86dd3631aa55c881ebde3d48cb6b78c9c6e3672adcbf2df9e8e333f0dc40625f",
	name: "getCriteria",
	filename: "src/lib/admin.functions.ts"
}, (opts) => getCriteria.__executeServer(opts));
var getCriteria = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(getCriteria_createServerFn_handler, async ({ context }) => {
	await assertAdmin(context.userId);
	const config = readCriteriaFile();
	return {
		criteria: config.criteria,
		updatedAt: config.updatedAt
	};
});
var saveCriteria_createServerFn_handler = createServerRpc({
	id: "cd3ee2d386812a0918428c31aa875c5469096e42e3a730c69bbd1f81dd0e2e73",
	name: "saveCriteria",
	filename: "src/lib/admin.functions.ts"
}, (opts) => saveCriteria.__executeServer(opts));
var saveCriteria = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ criteria: arrayType(CriterionSchema).min(1).max(20) }).parse(d)).handler(saveCriteria_createServerFn_handler, async ({ data, context }) => {
	await assertAdmin(context.userId);
	const config = {
		version: 2,
		updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
		criteria: data.criteria
	};
	fs.writeFileSync(CRITERIA_PATH, JSON.stringify(config, null, 2), "utf-8");
	return { ok: true };
});
var DEFAULT_TOPICS = [
	{
		id: "T1",
		name: "AI & Machine Learning"
	},
	{
		id: "T2",
		name: "FinTech & Web3"
	},
	{
		id: "T3",
		name: "EdTech & Learning"
	},
	{
		id: "T4",
		name: "Healthcare & MedTech"
	},
	{
		id: "T5",
		name: "Sustainability & GreenTech"
	}
];
function readTopicsFile() {
	try {
		if (fs.existsSync(TOPICS_PATH)) return JSON.parse(fs.readFileSync(TOPICS_PATH, "utf-8"));
	} catch {}
	return {
		version: 1,
		topics: DEFAULT_TOPICS
	};
}
var TopicSchema = objectType({
	id: stringType().min(1).max(10),
	name: stringType().min(2).max(100)
});
var getTopics_createServerFn_handler = createServerRpc({
	id: "881a13c8a641a8077e4ff958495ed4b1b47325f1b907a97209810ed84dd26356",
	name: "getTopics",
	filename: "src/lib/admin.functions.ts"
}, (opts) => getTopics.__executeServer(opts));
var getTopics = createServerFn({ method: "GET" }).handler(getTopics_createServerFn_handler, async () => {
	const config = readTopicsFile();
	return {
		topics: config.topics,
		updatedAt: config.updatedAt
	};
});
var saveTopics_createServerFn_handler = createServerRpc({
	id: "2b0430cf9f0261355972bb550d3aa29b32c8dadbaac8628a01a7abdaf04a2293",
	name: "saveTopics",
	filename: "src/lib/admin.functions.ts"
}, (opts) => saveTopics.__executeServer(opts));
var saveTopics = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ topics: arrayType(TopicSchema).min(1).max(20) }).parse(d)).handler(saveTopics_createServerFn_handler, async ({ data, context }) => {
	await assertAdmin(context.userId);
	const config = {
		version: 1,
		updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
		topics: data.topics
	};
	fs.writeFileSync(TOPICS_PATH, JSON.stringify(config, null, 2), "utf-8");
	return { ok: true };
});
var buildFeedbackEmail_createServerFn_handler = createServerRpc({
	id: "522b0c4988fce8fa7a269dec7eb3169cb1d11b27085e4f785c07d05249f0e332",
	name: "buildFeedbackEmail",
	filename: "src/lib/admin.functions.ts"
}, (opts) => buildFeedbackEmail.__executeServer(opts));
var buildFeedbackEmail = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ teamId: stringType().uuid() }).parse(d)).handler(buildFeedbackEmail_createServerFn_handler, async ({ data, context }) => {
	await assertAdmin(context.userId);
	const { supabaseAdmin } = await import("./client.server-B8Fh2fyG.mjs");
	const { fetchLeaderEmail } = await import("./team-leader-email-helper.server-TY3dFjYR.mjs");
	const { data: team } = await supabaseAdmin.from("teams").select("id, name").eq("id", data.teamId).maybeSingle();
	if (!team) throw new Error("Team not found");
	const { data: subs } = await supabaseAdmin.from("submissions").select("score, result, file_name, created_at").eq("team_id", data.teamId).eq("status", "done").order("score", { ascending: false }).limit(1);
	const email = await fetchLeaderEmail(team.id, team.name);
	const best = subs?.[0];
	if (!best?.result) return {
		to: email,
		subject: `Ideathon 2026 — Feedback for ${team.name}`,
		body: `Dear ${team.name} Team Leader,\n\nThank you for submitting to Ideathon 2026. Your submission is still being evaluated or no results are available yet. We will follow up soon.\n\nBest regards,\nIdeathon 2026 Admin`
	};
	const r = best.result;
	const criteria = r.criteria || [];
	const weakCriteria = criteria.filter((c) => (c.score ?? 0) < 7).sort((a, b) => a.score - b.score);
	let criteriaLines = "";
	for (const c of criteria) {
		const bar = c.score >= 8 ? "✅" : c.score >= 5 ? "⚠️" : "❌";
		criteriaLines += `  ${bar} ${c.id}. ${c.name}: ${c.score}/${c.maxScore ?? 10}\n`;
		if (c.weaknesses) criteriaLines += `      Issues: ${c.weaknesses}\n`;
	}
	let improvementLines = "";
	for (const c of weakCriteria.slice(0, 5)) {
		improvementLines += `• ${c.name} (scored ${c.score}/10):\n`;
		if (c.weaknesses) improvementLines += `  Problem: ${c.weaknesses}\n`;
		if (c.deductions) improvementLines += `  Deductions: ${c.deductions}\n`;
		improvementLines += "\n";
	}
	const suggestions = (r.suggestions || []).map((s, i) => `${i + 1}. ${s}`).join("\n");
	const weaknesses = (r.weaknesses || []).map((s) => `• ${s}`).join("\n");
	const body = [
		`Dear ${team.name} Team Leader,`,
		``,
		`Thank you for participating in Ideathon 2026. Below is a detailed evaluation report for your submission "${best.file_name}".`,
		``,
		`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
		`OVERALL SCORE: ${best.score}/100`,
		`Rating: ${r.overallRating || ""}`,
		`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
		``,
		`CRITERIA BREAKDOWN`,
		criteriaLines,
		weaknesses ? `AREAS THAT NEED IMPROVEMENT\n${weaknesses}` : "",
		``,
		improvementLines ? `HOW TO IMPROVE\n${improvementLines}` : "",
		suggestions ? `SUGGESTIONS FROM EVALUATORS\n${suggestions}` : "",
		``,
		`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
		`We encourage you to review these points and apply them in future innovations.`,
		``,
		`Best regards,`,
		`Ideathon 2026 Admin Team`
	].filter((l) => l !== void 0).join("\n");
	return {
		to: email,
		subject: `Ideathon 2026 — Evaluation Feedback for ${team.name} (Score: ${best.score}/100)`,
		body
	};
});
async function assertAdmin(userId) {
	const { supabaseAdmin } = await import("./client.server-B8Fh2fyG.mjs");
	const { data } = await supabaseAdmin.from("user_roles").select("id").eq("user_id", userId).eq("role", "admin").maybeSingle();
	if (data) return;
	const { data: userRes } = await supabaseAdmin.auth.admin.getUserById(userId);
	if (userRes?.user?.email === "admin@admin.com") {
		try {
			await supabaseAdmin.from("user_roles").upsert({
				user_id: userId,
				role: "admin"
			}, { onConflict: "user_id,role" });
		} catch {}
		return;
	}
	const email = userRes?.user?.email || "non-admin user";
	throw new Error(`Forbidden: Signed in as ${email}. Please sign in with the Admin account (admin@admin.com) to access the Admin Control Center.`);
}
var listTeams_createServerFn_handler = createServerRpc({
	id: "98a6d64f9cd5f7feec4f5390a1d88971764e2c1ebd2cafdf00e90316e614e42f",
	name: "listTeams",
	filename: "src/lib/admin.functions.ts"
}, (opts) => listTeams.__executeServer(opts));
var listTeams = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(listTeams_createServerFn_handler, async ({ context }) => {
	await assertAdmin(context.userId);
	const { supabaseAdmin } = await import("./client.server-B8Fh2fyG.mjs");
	const { fetchLeaderEmail } = await import("./team-leader-email-helper.server-TY3dFjYR.mjs");
	const { getTeamProfile, findTeamProfileByEmail } = await import("./team-store.server-CLLCpTmY.mjs");
	const { data: teams, error } = await supabaseAdmin.from("teams").select("id, name, created_at").order("created_at", { ascending: false });
	if (error) throw error;
	const { data: subs, error: sErr } = await supabaseAdmin.from("submissions").select("id, team_id, file_name, pdf_path, status, score, result, error, created_at, category").order("created_at", { ascending: false });
	if (sErr) throw sErr;
	return Promise.all((teams || []).map(async (t) => {
		const email = await fetchLeaderEmail(t.id, t.name);
		const profile = getTeamProfile(t.id) || findTeamProfileByEmail(email);
		const teamSubs = (subs || []).filter((s) => s.team_id === t.id);
		const latest = teamSubs[0] || null;
		const best = teamSubs.reduce((acc, s) => s.score != null && (acc == null || s.score > acc) ? s.score : acc, null);
		return {
			...t,
			leader_email: email,
			leader_name: profile?.leaderName || t.leader_name || null,
			leader_phone: profile?.leaderPhone || null,
			members: profile?.members || [],
			project_title: profile?.projectTitle || null,
			project_description: profile?.projectDescription || null,
			submissions: teamSubs,
			latest,
			bestScore: best
		};
	}));
});
var listPublicTeams_createServerFn_handler = createServerRpc({
	id: "6c01f614f012d98555e8daace040efaad1856e1ce14c370cd025c6f4653b2d06",
	name: "listPublicTeams",
	filename: "src/lib/admin.functions.ts"
}, (opts) => listPublicTeams.__executeServer(opts));
var listPublicTeams = createServerFn({ method: "GET" }).handler(listPublicTeams_createServerFn_handler, async () => {
	const { supabaseAdmin } = await import("./client.server-B8Fh2fyG.mjs");
	const { fetchLeaderEmail } = await import("./team-leader-email-helper.server-TY3dFjYR.mjs");
	const { data: teams, error } = await supabaseAdmin.from("teams").select("id, name").order("name");
	if (error) throw error;
	return Promise.all((teams || []).map(async (t) => {
		const [local, domain] = (await fetchLeaderEmail(t.id, t.name)).split("@");
		let maskedLocal = local;
		if (local.length > 3) maskedLocal = local.slice(0, 2) + "*".repeat(local.length - 4) + local.slice(-2);
		else maskedLocal = local[0] + "*".repeat(local.length - 1);
		const maskedEmail = `${maskedLocal}@${domain}`;
		return {
			id: t.id,
			name: t.name,
			emailHint: maskedEmail
		};
	}));
});
var addTeam_createServerFn_handler = createServerRpc({
	id: "32b775cbd6c12201e82580bc8d2d057dde8ba79058629763059a3eb76a1e3b11",
	name: "addTeam",
	filename: "src/lib/admin.functions.ts"
}, (opts) => addTeam.__executeServer(opts));
var addTeam = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	name: stringType().trim().min(2).max(80),
	email: stringType().trim().email().optional()
}).parse(d)).handler(addTeam_createServerFn_handler, async ({ data, context }) => {
	await assertAdmin(context.userId);
	const { supabaseAdmin } = await import("./client.server-B8Fh2fyG.mjs");
	const { updateLeaderEmail } = await import("./team-leader-email-helper.server-TY3dFjYR.mjs");
	const { data: row, error } = await supabaseAdmin.from("teams").insert({
		name: data.name,
		leader_email: data.email || null
	}).select("id, name, created_at").single();
	if (error) throw new Error(error.message);
	if (data.email) await updateLeaderEmail(row.id, data.email);
	return row;
});
var updateTeamLeaderEmail_createServerFn_handler = createServerRpc({
	id: "14180fb22018b0e2bcc143d3ead143db1cfd818483ca1d5d1a3a3fbc875e11a0",
	name: "updateTeamLeaderEmail",
	filename: "src/lib/admin.functions.ts"
}, (opts) => updateTeamLeaderEmail.__executeServer(opts));
var updateTeamLeaderEmail = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	id: stringType().uuid(),
	email: stringType().trim().email()
}).parse(d)).handler(updateTeamLeaderEmail_createServerFn_handler, async ({ data, context }) => {
	await assertAdmin(context.userId);
	const { updateLeaderEmail } = await import("./team-leader-email-helper.server-TY3dFjYR.mjs");
	await updateLeaderEmail(data.id, data.email);
	return { ok: true };
});
var verifyTeamLeaderEmail_createServerFn_handler = createServerRpc({
	id: "80193088eb40ee647bea86fdb4927ee5efefbadc8dd8aac75229f100d0a000b1",
	name: "verifyTeamLeaderEmail",
	filename: "src/lib/admin.functions.ts"
}, (opts) => verifyTeamLeaderEmail.__executeServer(opts));
var verifyTeamLeaderEmail = createServerFn({ method: "POST" }).inputValidator((d) => objectType({
	teamId: stringType().uuid(),
	email: stringType().trim().email()
}).parse(d)).handler(verifyTeamLeaderEmail_createServerFn_handler, async ({ data }) => {
	const { fetchLeaderEmail } = await import("./team-leader-email-helper.server-TY3dFjYR.mjs");
	const { supabaseAdmin } = await import("./client.server-B8Fh2fyG.mjs");
	const { data: team } = await supabaseAdmin.from("teams").select("name").eq("id", data.teamId).maybeSingle();
	if (!team) return {
		verified: false,
		error: "Team not found"
	};
	return { verified: (await fetchLeaderEmail(data.teamId, team.name)).toLowerCase() === data.email.toLowerCase() };
});
var deleteTeam_createServerFn_handler = createServerRpc({
	id: "f4abb2f516d17413a27910aaa96a88f6d894953a022ba168d70621e59210c2bf",
	name: "deleteTeam",
	filename: "src/lib/admin.functions.ts"
}, (opts) => deleteTeam.__executeServer(opts));
var deleteTeam = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(deleteTeam_createServerFn_handler, async ({ data, context }) => {
	await assertAdmin(context.userId);
	const { supabaseAdmin } = await import("./client.server-B8Fh2fyG.mjs");
	const { data: subs } = await supabaseAdmin.from("submissions").select("pdf_path").eq("team_id", data.id);
	if (subs && subs.length) await supabaseAdmin.storage.from("submissions").remove(subs.map((s) => s.pdf_path));
	const { error } = await supabaseAdmin.from("teams").delete().eq("id", data.id);
	if (error) throw error;
	return { ok: true };
});
var getPdfUrl_createServerFn_handler = createServerRpc({
	id: "3e0815ab86894bebb31a5cd4c354cc4f1ff8f2807beb0cec7dc0036ccb6ea126",
	name: "getPdfUrl",
	filename: "src/lib/admin.functions.ts"
}, (opts) => getPdfUrl.__executeServer(opts));
var getPdfUrl = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ path: stringType() }).parse(d)).handler(getPdfUrl_createServerFn_handler, async ({ data, context }) => {
	await assertAdmin(context.userId);
	const { supabaseAdmin } = await import("./client.server-B8Fh2fyG.mjs");
	const { data: signed, error } = await supabaseAdmin.storage.from("submissions").createSignedUrl(data.path, 600);
	if (error) throw error;
	return { url: signed.signedUrl };
});
var deleteSubmission_createServerFn_handler = createServerRpc({
	id: "7ad1a8c9b4759d7b2a2362dbde9568531fd386e179b272a7e4daca399eafbc69",
	name: "deleteSubmission",
	filename: "src/lib/admin.functions.ts"
}, (opts) => deleteSubmission.__executeServer(opts));
var deleteSubmission = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(deleteSubmission_createServerFn_handler, async ({ data, context }) => {
	await assertAdmin(context.userId);
	const { supabaseAdmin } = await import("./client.server-B8Fh2fyG.mjs");
	const { data: sub } = await supabaseAdmin.from("submissions").select("pdf_path").eq("id", data.id).maybeSingle();
	if (sub?.pdf_path) await supabaseAdmin.storage.from("submissions").remove([sub.pdf_path]);
	const { error } = await supabaseAdmin.from("submissions").delete().eq("id", data.id);
	if (error) throw error;
	return { ok: true };
});
var renameTeam_createServerFn_handler = createServerRpc({
	id: "981fe48a12fb358facca176469fa52ef6c4c8aa38fc53f112b100ea24a962e62",
	name: "renameTeam",
	filename: "src/lib/admin.functions.ts"
}, (opts) => renameTeam.__executeServer(opts));
var renameTeam = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	id: stringType().uuid(),
	name: stringType().trim().min(2).max(80)
}).parse(d)).handler(renameTeam_createServerFn_handler, async ({ data, context }) => {
	await assertAdmin(context.userId);
	const { supabaseAdmin } = await import("./client.server-B8Fh2fyG.mjs");
	const { data: row, error } = await supabaseAdmin.from("teams").update({ name: data.name }).eq("id", data.id).select("id, name, created_at").single();
	if (error) throw new Error(error.message);
	return row;
});
var saveManualScores_createServerFn_handler = createServerRpc({
	id: "f99e29b40e590fa12cdd87cbff2b6557bb198055a52f672ff93683541ae8f62e",
	name: "saveManualScores",
	filename: "src/lib/admin.functions.ts"
}, (opts) => saveManualScores.__executeServer(opts));
var saveManualScores = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	submissionId: stringType().uuid(),
	scores: recordType(stringType(), objectType({
		score: numberType().min(0).max(100),
		evidence: stringType().optional(),
		strengths: stringType().optional(),
		weaknesses: stringType().optional(),
		deductions: stringType().optional()
	}))
}).parse(d)).handler(saveManualScores_createServerFn_handler, async ({ data, context }) => {
	await assertAdmin(context.userId);
	const { supabaseAdmin } = await import("./client.server-B8Fh2fyG.mjs");
	const { data: sub, error } = await supabaseAdmin.from("submissions").select("id, score, result").eq("id", data.submissionId).single();
	if (error || !sub) throw new Error("Submission not found");
	const r = sub.result || {};
	const criteria = Array.isArray(r.criteria) ? [...r.criteria] : [];
	let newTotal = 0;
	for (const c of criteria) {
		if (data.scores[c.id]) {
			const update = data.scores[c.id];
			c.score = update.score;
			if (update.evidence !== void 0) c.evidence = update.evidence;
			if (update.strengths !== void 0) c.strengths = update.strengths;
			if (update.weaknesses !== void 0) c.weaknesses = update.weaknesses;
			if (update.deductions !== void 0) c.deductions = update.deductions;
			c.isManuallyGraded = true;
		}
		newTotal += Number(c.score) || 0;
	}
	let rating = "Weak/incomplete";
	if (newTotal >= 85) rating = "Excellent";
	else if (newTotal >= 70) rating = "Strong";
	else if (newTotal >= 61) rating = "Promising with gaps";
	else if (newTotal >= 41) rating = "Major gaps";
	r.criteria = criteria;
	r.totalScore = newTotal;
	r.overallRating = rating;
	const { error: upErr } = await supabaseAdmin.from("submissions").update({
		score: newTotal,
		result: r
	}).eq("id", data.submissionId);
	if (upErr) throw new Error(`Failed to update scores: ${upErr.message}`);
	return {
		ok: true,
		totalScore: newTotal,
		overallRating: rating,
		criteria
	};
});
var registerTeamLeader_createServerFn_handler = createServerRpc({
	id: "b60e562d815ddec0b75abec54be50724bbf085e1d44b7a31e13aaf1ffd1d69b5",
	name: "registerTeamLeader",
	filename: "src/lib/admin.functions.ts"
}, (opts) => registerTeamLeader.__executeServer(opts));
var registerTeamLeader = createServerFn({ method: "POST" }).inputValidator((d) => objectType({
	leaderName: stringType().trim().min(2, "Leader name must be at least 2 characters").max(80),
	teamName: stringType().trim().min(2, "Team name must be at least 2 characters").max(80),
	email: stringType().trim().email("Invalid email address"),
	password: stringType().min(6, "Password must be at least 6 characters"),
	phone: stringType().trim().optional()
}).parse(d)).handler(registerTeamLeader_createServerFn_handler, async ({ data }) => {
	const { supabaseAdmin } = await import("./client.server-B8Fh2fyG.mjs");
	const { saveTeamProfile } = await import("./team-store.server-CLLCpTmY.mjs");
	const { updateLeaderEmail } = await import("./team-leader-email-helper.server-TY3dFjYR.mjs");
	const { data: existingTeam } = await supabaseAdmin.from("teams").select("id, name").ilike("name", data.teamName).maybeSingle();
	if (existingTeam) throw new Error(`Team name "${data.teamName}" is already registered. Please choose a different team name.`);
	const { data: existingEmailTeam } = await supabaseAdmin.from("teams").select("id, name").ilike("leader_email", data.email).maybeSingle();
	if (existingEmailTeam) throw new Error(`An account with email "${data.email}" is already registered for team "${existingEmailTeam.name}". Please sign in.`);
	try {
		const { data: userRes, error: userErr } = await supabaseAdmin.auth.admin.createUser({
			email: data.email,
			password: data.password,
			email_confirm: true,
			user_metadata: {
				leader_name: data.leaderName,
				team_name: data.teamName,
				phone: data.phone || "",
				role: "team_leader"
			}
		});
		if (userErr && !userErr.message.toLowerCase().includes("already registered")) console.warn("[registerTeamLeader] Auth user creation note:", userErr.message);
	} catch (authE) {
		console.warn("[registerTeamLeader] Auth note:", authE?.message);
	}
	const { data: teamRow, error: teamErr } = await supabaseAdmin.from("teams").insert({
		name: data.teamName,
		leader_email: data.email
	}).select("id, name, created_at").single();
	if (teamErr) throw new Error(teamErr.message);
	saveTeamProfile({
		teamId: teamRow.id,
		teamName: teamRow.name,
		leaderName: data.leaderName,
		leaderEmail: data.email,
		leaderPhone: data.phone,
		members: [],
		createdAt: (/* @__PURE__ */ new Date()).toISOString()
	});
	await updateLeaderEmail(teamRow.id, data.email);
	return {
		ok: true,
		teamId: teamRow.id,
		teamName: teamRow.name,
		leaderName: data.leaderName,
		leaderEmail: data.email
	};
});
var updateTeamRequirements_createServerFn_handler = createServerRpc({
	id: "70b4dc0e477ee09691f8c1b9fdf74d4042c13061737c89b33596d00e4db2bc48",
	name: "updateTeamRequirements",
	filename: "src/lib/admin.functions.ts"
}, (opts) => updateTeamRequirements.__executeServer(opts));
var updateTeamRequirements = createServerFn({ method: "POST" }).inputValidator((d) => objectType({
	teamId: stringType().uuid(),
	leaderEmail: stringType().trim().email(),
	category: stringType().optional(),
	projectTitle: stringType().optional(),
	projectDescription: stringType().optional(),
	leaderPhone: stringType().optional(),
	members: arrayType(stringType()).optional()
}).parse(d)).handler(updateTeamRequirements_createServerFn_handler, async ({ data }) => {
	const { getTeamProfile, saveTeamProfile } = await import("./team-store.server-CLLCpTmY.mjs");
	const current = getTeamProfile(data.teamId);
	saveTeamProfile({
		teamId: data.teamId,
		teamName: current?.teamName || "",
		leaderName: current?.leaderName || "",
		leaderEmail: data.leaderEmail,
		leaderPhone: data.leaderPhone !== void 0 ? data.leaderPhone : current?.leaderPhone,
		category: data.category !== void 0 ? data.category : current?.category,
		projectTitle: data.projectTitle !== void 0 ? data.projectTitle : current?.projectTitle,
		projectDescription: data.projectDescription !== void 0 ? data.projectDescription : current?.projectDescription,
		members: data.members !== void 0 ? data.members : current?.members,
		createdAt: current?.createdAt || (/* @__PURE__ */ new Date()).toISOString()
	});
	return { ok: true };
});
var getTeamDashboard_createServerFn_handler = createServerRpc({
	id: "f0bf82407482287fef4f90ac471d5f2fd0eb7dbc8b6c0d88788e09b1ecea6aef",
	name: "getTeamDashboard",
	filename: "src/lib/admin.functions.ts"
}, (opts) => getTeamDashboard.__executeServer(opts));
var getTeamDashboard = createServerFn({ method: "POST" }).inputValidator((d) => objectType({ email: stringType().trim().email() }).parse(d)).handler(getTeamDashboard_createServerFn_handler, async ({ data }) => {
	const { supabaseAdmin } = await import("./client.server-B8Fh2fyG.mjs");
	const { findTeamProfileByEmail, getTeamProfile } = await import("./team-store.server-CLLCpTmY.mjs");
	const { data: team } = await supabaseAdmin.from("teams").select("id, name, created_at, leader_email").ilike("leader_email", data.email).maybeSingle();
	let teamRecord = team;
	let profile = team ? getTeamProfile(team.id) : null;
	if (!teamRecord) {
		const fallback = findTeamProfileByEmail(data.email);
		if (fallback) {
			profile = fallback;
			const { data: t } = await supabaseAdmin.from("teams").select("id, name, created_at, leader_email").eq("id", fallback.teamId).maybeSingle();
			teamRecord = t;
		}
	}
	if (!teamRecord) return {
		found: false,
		team: null
	};
	const { data: subs } = await supabaseAdmin.from("submissions").select("id, file_name, status, score, result, error, category, created_at").eq("team_id", teamRecord.id).order("created_at", { ascending: false });
	return {
		found: true,
		team: {
			...teamRecord,
			profile: profile || {
				teamId: teamRecord.id,
				teamName: teamRecord.name,
				leaderName: "Team Leader",
				leaderEmail: teamRecord.leader_email || data.email,
				createdAt: teamRecord.created_at
			},
			submissions: subs || []
		}
	};
});
//#endregion
export { addTeam_createServerFn_handler, buildFeedbackEmail_createServerFn_handler, deleteSubmission_createServerFn_handler, deleteTeam_createServerFn_handler, getCriteria_createServerFn_handler, getPdfUrl_createServerFn_handler, getTeamDashboard_createServerFn_handler, getTopics_createServerFn_handler, listPublicTeams_createServerFn_handler, listTeams_createServerFn_handler, registerTeamLeader_createServerFn_handler, renameTeam_createServerFn_handler, saveCriteria_createServerFn_handler, saveManualScores_createServerFn_handler, saveTopics_createServerFn_handler, updateTeamLeaderEmail_createServerFn_handler, updateTeamRequirements_createServerFn_handler, verifyTeamLeaderEmail_createServerFn_handler };
