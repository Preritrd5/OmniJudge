import * as fs from "fs";
import * as path from "path";
//#region node_modules/.nitro/vite/services/ssr/assets/team-leader-email-helper.server-TY3dFjYR.js
var STORE_PATH = path.resolve(process.cwd(), "team-leaders-store.json");
function getStore() {
	try {
		if (fs.existsSync(STORE_PATH)) return JSON.parse(fs.readFileSync(STORE_PATH, "utf-8"));
	} catch (e) {
		console.error("Failed to read team-leaders-store.json:", e);
	}
	return {};
}
function saveStore(store) {
	try {
		fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), "utf-8");
	} catch (e) {
		console.error("Failed to write team-leaders-store.json:", e);
	}
}
function getFallbackEmail(teamName) {
	return `leader.${teamName.toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 15) || "team"}@gmail.com`;
}
async function fetchLeaderEmail(teamId, teamName) {
	const { supabaseAdmin } = await import("./client.server-B8Fh2fyG.mjs");
	try {
		const { data, error } = await supabaseAdmin.from("teams").select("leader_email").eq("id", teamId).maybeSingle();
		if (!error && data && "leader_email" in data && data.leader_email) return data.leader_email;
	} catch (e) {}
	const store = getStore();
	if (store[teamId]) return store[teamId];
	return getFallbackEmail(teamName);
}
async function updateLeaderEmail(teamId, email) {
	const { supabaseAdmin } = await import("./client.server-B8Fh2fyG.mjs");
	let dbSuccess = false;
	try {
		const { error } = await supabaseAdmin.from("teams").update({ leader_email: email }).eq("id", teamId);
		if (!error) dbSuccess = true;
	} catch (e) {}
	const store = getStore();
	store[teamId] = email;
	saveStore(store);
	return dbSuccess;
}
//#endregion
export { fetchLeaderEmail, updateLeaderEmail };
