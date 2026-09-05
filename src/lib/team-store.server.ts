import * as fs from "fs";
import * as path from "path";

export interface TeamProfile {
  teamId: string;
  teamName: string;
  leaderName: string;
  leaderEmail: string;
  leaderPhone?: string;
  members?: string[];
  projectTitle?: string;
  projectDescription?: string;
  category?: string;
  createdAt: string;
  updatedAt?: string;
}

const DETAILS_STORE_PATH = path.resolve(process.cwd(), "team-details-store.json");

export function getAllTeamProfiles(): Record<string, TeamProfile> {
  try {
    if (fs.existsSync(DETAILS_STORE_PATH)) {
      return JSON.parse(fs.readFileSync(DETAILS_STORE_PATH, "utf-8"));
    }
  } catch (e) {
    console.error("Failed to read team-details-store.json:", e);
  }
  return {};
}

export function getTeamProfile(teamId: string): TeamProfile | null {
  const store = getAllTeamProfiles();
  return store[teamId] || null;
}

export function findTeamProfileByEmail(email: string): TeamProfile | null {
  const store = getAllTeamProfiles();
  const lower = email.toLowerCase().trim();
  for (const t of Object.values(store)) {
    if (t.leaderEmail.toLowerCase().trim() === lower) {
      return t;
    }
  }
  return null;
}

export function saveTeamProfile(profile: TeamProfile): void {
  try {
    const store = getAllTeamProfiles();
    store[profile.teamId] = {
      ...store[profile.teamId],
      ...profile,
      updatedAt: new Date().toISOString(),
    };
    fs.writeFileSync(DETAILS_STORE_PATH, JSON.stringify(store, null, 2), "utf-8");
  } catch (e) {
    console.error("Failed to save team profile:", e);
  }
}
