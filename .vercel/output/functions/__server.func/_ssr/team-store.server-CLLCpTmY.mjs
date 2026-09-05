import * as fs from "fs";
import * as path from "path";
//#region node_modules/.nitro/vite/services/ssr/assets/team-store.server-CLLCpTmY.js
var DETAILS_STORE_PATH = path.resolve(process.cwd(), "team-details-store.json");
function getAllTeamProfiles() {
	try {
		if (fs.existsSync(DETAILS_STORE_PATH)) return JSON.parse(fs.readFileSync(DETAILS_STORE_PATH, "utf-8"));
	} catch (e) {
		console.error("Failed to read team-details-store.json:", e);
	}
	return {};
}
function getTeamProfile(teamId) {
	return getAllTeamProfiles()[teamId] || null;
}
function findTeamProfileByEmail(email) {
	const store = getAllTeamProfiles();
	const lower = email.toLowerCase().trim();
	for (const t of Object.values(store)) if (t.leaderEmail.toLowerCase().trim() === lower) return t;
	return null;
}
function saveTeamProfile(profile) {
	try {
		const store = getAllTeamProfiles();
		store[profile.teamId] = {
			...store[profile.teamId],
			...profile,
			updatedAt: (/* @__PURE__ */ new Date()).toISOString()
		};
		fs.writeFileSync(DETAILS_STORE_PATH, JSON.stringify(store, null, 2), "utf-8");
	} catch (e) {
		console.error("Failed to save team profile:", e);
	}
}
//#endregion
export { findTeamProfileByEmail, getTeamProfile, saveTeamProfile };
