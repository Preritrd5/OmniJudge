//#region node_modules/.nitro/vite/services/ssr/assets/__23tanstack-start-server-fn-resolver-CyZZYKRg.js
var manifest = {
	"14180fb22018b0e2bcc143d3ead143db1cfd818483ca1d5d1a3a3fbc875e11a0": {
		functionName: "updateTeamLeaderEmail_createServerFn_handler",
		importer: () => import("./_ssr/admin.functions-z0rBwYCW.mjs")
	},
	"2b0430cf9f0261355972bb550d3aa29b32c8dadbaac8628a01a7abdaf04a2293": {
		functionName: "saveTopics_createServerFn_handler",
		importer: () => import("./_ssr/admin.functions-z0rBwYCW.mjs")
	},
	"32b775cbd6c12201e82580bc8d2d057dde8ba79058629763059a3eb76a1e3b11": {
		functionName: "addTeam_createServerFn_handler",
		importer: () => import("./_ssr/admin.functions-z0rBwYCW.mjs")
	},
	"3e0815ab86894bebb31a5cd4c354cc4f1ff8f2807beb0cec7dc0036ccb6ea126": {
		functionName: "getPdfUrl_createServerFn_handler",
		importer: () => import("./_ssr/admin.functions-z0rBwYCW.mjs")
	},
	"522b0c4988fce8fa7a269dec7eb3169cb1d11b27085e4f785c07d05249f0e332": {
		functionName: "buildFeedbackEmail_createServerFn_handler",
		importer: () => import("./_ssr/admin.functions-z0rBwYCW.mjs")
	},
	"6c01f614f012d98555e8daace040efaad1856e1ce14c370cd025c6f4653b2d06": {
		functionName: "listPublicTeams_createServerFn_handler",
		importer: () => import("./_ssr/admin.functions-z0rBwYCW.mjs")
	},
	"70b4dc0e477ee09691f8c1b9fdf74d4042c13061737c89b33596d00e4db2bc48": {
		functionName: "updateTeamRequirements_createServerFn_handler",
		importer: () => import("./_ssr/admin.functions-z0rBwYCW.mjs")
	},
	"7ad1a8c9b4759d7b2a2362dbde9568531fd386e179b272a7e4daca399eafbc69": {
		functionName: "deleteSubmission_createServerFn_handler",
		importer: () => import("./_ssr/admin.functions-z0rBwYCW.mjs")
	},
	"80193088eb40ee647bea86fdb4927ee5efefbadc8dd8aac75229f100d0a000b1": {
		functionName: "verifyTeamLeaderEmail_createServerFn_handler",
		importer: () => import("./_ssr/admin.functions-z0rBwYCW.mjs")
	},
	"86dd3631aa55c881ebde3d48cb6b78c9c6e3672adcbf2df9e8e333f0dc40625f": {
		functionName: "getCriteria_createServerFn_handler",
		importer: () => import("./_ssr/admin.functions-z0rBwYCW.mjs")
	},
	"881a13c8a641a8077e4ff958495ed4b1b47325f1b907a97209810ed84dd26356": {
		functionName: "getTopics_createServerFn_handler",
		importer: () => import("./_ssr/admin.functions-z0rBwYCW.mjs")
	},
	"981fe48a12fb358facca176469fa52ef6c4c8aa38fc53f112b100ea24a962e62": {
		functionName: "renameTeam_createServerFn_handler",
		importer: () => import("./_ssr/admin.functions-z0rBwYCW.mjs")
	},
	"98a6d64f9cd5f7feec4f5390a1d88971764e2c1ebd2cafdf00e90316e614e42f": {
		functionName: "listTeams_createServerFn_handler",
		importer: () => import("./_ssr/admin.functions-z0rBwYCW.mjs")
	},
	"b60e562d815ddec0b75abec54be50724bbf085e1d44b7a31e13aaf1ffd1d69b5": {
		functionName: "registerTeamLeader_createServerFn_handler",
		importer: () => import("./_ssr/admin.functions-z0rBwYCW.mjs")
	},
	"cd3ee2d386812a0918428c31aa875c5469096e42e3a730c69bbd1f81dd0e2e73": {
		functionName: "saveCriteria_createServerFn_handler",
		importer: () => import("./_ssr/admin.functions-z0rBwYCW.mjs")
	},
	"f0bf82407482287fef4f90ac471d5f2fd0eb7dbc8b6c0d88788e09b1ecea6aef": {
		functionName: "getTeamDashboard_createServerFn_handler",
		importer: () => import("./_ssr/admin.functions-z0rBwYCW.mjs")
	},
	"f4abb2f516d17413a27910aaa96a88f6d894953a022ba168d70621e59210c2bf": {
		functionName: "deleteTeam_createServerFn_handler",
		importer: () => import("./_ssr/admin.functions-z0rBwYCW.mjs")
	},
	"f99e29b40e590fa12cdd87cbff2b6557bb198055a52f672ff93683541ae8f62e": {
		functionName: "saveManualScores_createServerFn_handler",
		importer: () => import("./_ssr/admin.functions-z0rBwYCW.mjs")
	}
};
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ?? await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
//#endregion
export { getServerFnById as t };
