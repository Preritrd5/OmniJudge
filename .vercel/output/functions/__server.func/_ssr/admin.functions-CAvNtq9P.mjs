import { i as __toESM } from "../_runtime.mjs";
import { D as isRedirect, _ as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as TSS_SERVER_FUNCTION, l as createServerFn } from "./esm-9EjmF9OT.mjs";
import { t as getServerFnById } from "../__23tanstack-start-server-fn-resolver-CyZZYKRg.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-DDumpU6D.mjs";
import { a as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { _t as objectType, gt as numberType, ht as enumType, pt as arrayType, vt as recordType, yt as stringType } from "../_libs/@ai-sdk/gateway+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.functions-CAvNtq9P.js
var import_react = /* @__PURE__ */ __toESM(require_react());
function useServerFn(serverFn) {
	const router = useRouter();
	return import_react.useCallback(async (...args) => {
		try {
			const res = await serverFn(...args);
			if (isRedirect(res)) throw res;
			return res;
		} catch (err) {
			if (isRedirect(err)) {
				err.options._fromLocation = router.stores.location.get();
				return router.navigate(router.resolveRedirect(err).options);
			}
			throw err;
		}
	}, [router, serverFn]);
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var CriterionSchema = objectType({
	id: stringType().min(1).max(10),
	name: stringType().min(2).max(80),
	maxScore: numberType().int().min(1).max(100),
	description: stringType().max(300),
	type: enumType(["ai", "manual"]).default("ai"),
	evalMode: enumType(["ai", "manual"]).default("ai").optional()
});
var getCriteria = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("86dd3631aa55c881ebde3d48cb6b78c9c6e3672adcbf2df9e8e333f0dc40625f"));
var saveCriteria = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ criteria: arrayType(CriterionSchema).min(1).max(20) }).parse(d)).handler(createSsrRpc("cd3ee2d386812a0918428c31aa875c5469096e42e3a730c69bbd1f81dd0e2e73"));
var TopicSchema = objectType({
	id: stringType().min(1).max(10),
	name: stringType().min(2).max(100)
});
var getTopics = createServerFn({ method: "GET" }).handler(createSsrRpc("881a13c8a641a8077e4ff958495ed4b1b47325f1b907a97209810ed84dd26356"));
var saveTopics = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ topics: arrayType(TopicSchema).min(1).max(20) }).parse(d)).handler(createSsrRpc("2b0430cf9f0261355972bb550d3aa29b32c8dadbaac8628a01a7abdaf04a2293"));
var buildFeedbackEmail = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ teamId: stringType().uuid() }).parse(d)).handler(createSsrRpc("522b0c4988fce8fa7a269dec7eb3169cb1d11b27085e4f785c07d05249f0e332"));
var listTeams = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("98a6d64f9cd5f7feec4f5390a1d88971764e2c1ebd2cafdf00e90316e614e42f"));
createServerFn({ method: "GET" }).handler(createSsrRpc("6c01f614f012d98555e8daace040efaad1856e1ce14c370cd025c6f4653b2d06"));
createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	name: stringType().trim().min(2).max(80),
	email: stringType().trim().email().optional()
}).parse(d)).handler(createSsrRpc("32b775cbd6c12201e82580bc8d2d057dde8ba79058629763059a3eb76a1e3b11"));
var updateTeamLeaderEmail = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	id: stringType().uuid(),
	email: stringType().trim().email()
}).parse(d)).handler(createSsrRpc("14180fb22018b0e2bcc143d3ead143db1cfd818483ca1d5d1a3a3fbc875e11a0"));
createServerFn({ method: "POST" }).inputValidator((d) => objectType({
	teamId: stringType().uuid(),
	email: stringType().trim().email()
}).parse(d)).handler(createSsrRpc("80193088eb40ee647bea86fdb4927ee5efefbadc8dd8aac75229f100d0a000b1"));
var deleteTeam = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(createSsrRpc("f4abb2f516d17413a27910aaa96a88f6d894953a022ba168d70621e59210c2bf"));
var getPdfUrl = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ path: stringType() }).parse(d)).handler(createSsrRpc("3e0815ab86894bebb31a5cd4c354cc4f1ff8f2807beb0cec7dc0036ccb6ea126"));
var deleteSubmission = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(createSsrRpc("7ad1a8c9b4759d7b2a2362dbde9568531fd386e179b272a7e4daca399eafbc69"));
var renameTeam = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	id: stringType().uuid(),
	name: stringType().trim().min(2).max(80)
}).parse(d)).handler(createSsrRpc("981fe48a12fb358facca176469fa52ef6c4c8aa38fc53f112b100ea24a962e62"));
var saveManualScores = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	submissionId: stringType().uuid(),
	scores: recordType(stringType(), objectType({
		score: numberType().min(0).max(100),
		evidence: stringType().optional(),
		strengths: stringType().optional(),
		weaknesses: stringType().optional(),
		deductions: stringType().optional()
	}))
}).parse(d)).handler(createSsrRpc("f99e29b40e590fa12cdd87cbff2b6557bb198055a52f672ff93683541ae8f62e"));
var registerTeamLeader = createServerFn({ method: "POST" }).inputValidator((d) => objectType({
	leaderName: stringType().trim().min(2, "Leader name must be at least 2 characters").max(80),
	teamName: stringType().trim().min(2, "Team name must be at least 2 characters").max(80),
	email: stringType().trim().email("Invalid email address"),
	password: stringType().min(6, "Password must be at least 6 characters"),
	phone: stringType().trim().optional()
}).parse(d)).handler(createSsrRpc("b60e562d815ddec0b75abec54be50724bbf085e1d44b7a31e13aaf1ffd1d69b5"));
var updateTeamRequirements = createServerFn({ method: "POST" }).inputValidator((d) => objectType({
	teamId: stringType().uuid(),
	leaderEmail: stringType().trim().email(),
	category: stringType().optional(),
	projectTitle: stringType().optional(),
	projectDescription: stringType().optional(),
	leaderPhone: stringType().optional(),
	members: arrayType(stringType()).optional()
}).parse(d)).handler(createSsrRpc("70b4dc0e477ee09691f8c1b9fdf74d4042c13061737c89b33596d00e4db2bc48"));
var getTeamDashboard = createServerFn({ method: "POST" }).inputValidator((d) => objectType({ email: stringType().trim().email() }).parse(d)).handler(createSsrRpc("f0bf82407482287fef4f90ac471d5f2fd0eb7dbc8b6c0d88788e09b1ecea6aef"));
//#endregion
export { getPdfUrl as a, listTeams as c, saveCriteria as d, saveManualScores as f, useServerFn as g, updateTeamRequirements as h, getCriteria as i, registerTeamLeader as l, updateTeamLeaderEmail as m, deleteSubmission as n, getTeamDashboard as o, saveTopics as p, deleteTeam as r, getTopics as s, buildFeedbackEmail as t, renameTeam as u };
