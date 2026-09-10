/**
 * Tab-Scoped Team Session Manager
 *
 * Strictly uses window.sessionStorage to guarantee complete session isolation
 * across multiple browser tabs and windows.
 *
 * Each browser tab retains its own independent session. Tabs do NOT overwrite
 * or synchronize team sessions with each other.
 */

export interface TeamSessionData {
  email: string;
  teamName: string;
  leaderName?: string;
  sessionToken: string;
  teamId?: string;
}

const TAB_SESSION_KEY = "sih_team_tab_session_v1";

const LEGACY_LOCAL_STORAGE_KEYS = [
  "sih_leader_email",
  "ideathon_leader_email",
  "sih_team_name",
  "sih_leader_name",
  "ideathon_leader_name",
  "sih_auth_sync_ping",
];

/**
 * Retrieve the active team session for the current browser tab.
 * Returns null if not logged in or in SSR environment.
 */
export function getTeamTabSession(): TeamSessionData | null {
  if (typeof window === "undefined" || !("sessionStorage" in window)) {
    return null;
  }

  try {
    const raw = window.sessionStorage.getItem(TAB_SESSION_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;

    if (!parsed.email || typeof parsed.email !== "string" || !parsed.sessionToken) {
      return null;
    }

    return {
      email: parsed.email.trim().toLowerCase(),
      teamName: (parsed.teamName || "").trim(),
      leaderName: (parsed.leaderName || "").trim(),
      sessionToken: parsed.sessionToken.trim(),
      teamId: parsed.teamId ? parsed.teamId.trim() : undefined,
    };
  } catch (e) {
    console.warn("[TeamSession] Failed to read from sessionStorage:", e);
    return null;
  }
}

/**
 * Store the active team session strictly in this tab's sessionStorage.
 */
export function setTeamTabSession(session: TeamSessionData): void {
  if (typeof window === "undefined" || !("sessionStorage" in window)) {
    return;
  }

  try {
    const data: TeamSessionData = {
      email: session.email.trim().toLowerCase(),
      teamName: session.teamName.trim(),
      leaderName: session.leaderName ? session.leaderName.trim() : "",
      sessionToken: session.sessionToken.trim(),
      teamId: session.teamId ? session.teamId.trim() : undefined,
    };
    window.sessionStorage.setItem(TAB_SESSION_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn("[TeamSession] Failed to write to sessionStorage:", e);
  }
}

/**
 * Clear the team session only from this tab's sessionStorage.
 * Other open browser tabs are completely unaffected.
 */
export function clearTeamTabSession(): void {
  if (typeof window === "undefined" || !("sessionStorage" in window)) {
    return;
  }

  try {
    window.sessionStorage.removeItem(TAB_SESSION_KEY);
  } catch (e) {
    console.warn("[TeamSession] Failed to clear sessionStorage:", e);
  }
}

/**
 * Safe cleanup of legacy shared localStorage keys so stale cross-tab data
 * does not pollute the session environment.
 */
export function purgeLegacyLocalStorage(): void {
  if (typeof window === "undefined" || !("localStorage" in window)) {
    return;
  }

  try {
    for (const key of LEGACY_LOCAL_STORAGE_KEYS) {
      window.localStorage.removeItem(key);
    }
  } catch {}
}
