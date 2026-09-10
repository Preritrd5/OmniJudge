/**
 * Cross-Tab Authentication & Session Synchronization Manager
 *
 * Uses BroadcastChannel (with window storage event fallback) to coordinate
 * session state across multiple open tabs/windows in real time.
 */

export interface TeamSession {
  email: string;
  teamName: string;
  leaderName: string;
}

export type TeamAuthSyncEvent = {
  type: "TEAM_AUTH_CHANGED";
  email: string | null;
  teamName?: string | null;
  leaderName?: string | null;
  reason: "login" | "logout" | "storage_sync";
  timestamp: number;
};

export type AdminAuthSyncEvent = {
  type: "ADMIN_AUTH_CHANGED";
  event: "SIGNED_IN" | "SIGNED_OUT" | "USER_UPDATED" | "TOKEN_REFRESHED";
  userId: string | null;
  email: string | null;
  timestamp: number;
};

export type AuthSyncEvent = TeamAuthSyncEvent | AdminAuthSyncEvent;

const CHANNEL_NAME = "sih_auth_sync_channel";
const TEAM_EMAIL_KEYS = ["sih_leader_email", "ideathon_leader_email"];
const TEAM_NAME_KEYS = ["sih_team_name"];
const TEAM_LEADER_NAME_KEYS = ["sih_leader_name", "ideathon_leader_name"];

// Singleton BroadcastChannel instance on the client
let broadcastChannel: BroadcastChannel | null = null;

function getBroadcastChannel(): BroadcastChannel | null {
  if (typeof window === "undefined" || !("BroadcastChannel" in window)) {
    return null;
  }
  if (!broadcastChannel) {
    try {
      broadcastChannel = new BroadcastChannel(CHANNEL_NAME);
    } catch (e) {
      console.warn("[AuthSync] BroadcastChannel initialization failed, using storage event fallback:", e);
      broadcastChannel = null;
    }
  }
  return broadcastChannel;
}

/**
 * Safely retrieve current team session details from localStorage.
 */
export function getTeamSessionFromStorage(): TeamSession | null {
  if (typeof window === "undefined") return null;

  const email =
    localStorage.getItem("sih_leader_email") ||
    localStorage.getItem("ideathon_leader_email");

  if (!email || !email.trim()) return null;

  const teamName = localStorage.getItem("sih_team_name") || "";
  const leaderName =
    localStorage.getItem("sih_leader_name") ||
    localStorage.getItem("ideathon_leader_name") ||
    "";

  return {
    email: email.trim().toLowerCase(),
    teamName: teamName.trim(),
    leaderName: leaderName.trim(),
  };
}

/**
 * Cleanly remove all team-related authentication keys from localStorage.
 */
export function clearTeamSessionStorage(): void {
  if (typeof window === "undefined") return;

  for (const k of [...TEAM_EMAIL_KEYS, ...TEAM_NAME_KEYS, ...TEAM_LEADER_NAME_KEYS]) {
    localStorage.removeItem(k);
  }
}

/**
 * Save team session keys to localStorage.
 */
export function setTeamSessionStorage(session: TeamSession): void {
  if (typeof window === "undefined") return;

  localStorage.setItem("sih_leader_email", session.email.trim().toLowerCase());
  localStorage.setItem("sih_team_name", session.teamName.trim());
  if (session.leaderName) {
    localStorage.setItem("sih_leader_name", session.leaderName.trim());
  }
}

/**
 * Broadcast an authentication event to all other open tabs/windows.
 */
function broadcast(event: AuthSyncEvent): void {
  if (typeof window === "undefined") return;

  const channel = getBroadcastChannel();
  if (channel) {
    try {
      channel.postMessage(event);
    } catch (e) {
      console.warn("[AuthSync] Failed to post message to BroadcastChannel:", e);
    }
  }

  // Also update an internal heartbeat storage key to trigger storage event
  // in browsers where BroadcastChannel might be isolated (or fallback)
  try {
    localStorage.setItem("sih_auth_sync_ping", `${event.type}:${Date.now()}`);
  } catch {}
}

/**
 * Notify other tabs that team portal auth has changed (login or logout).
 */
export function broadcastTeamAuthChange(payload: {
  email: string | null;
  teamName?: string | null;
  leaderName?: string | null;
  reason: "login" | "logout" | "storage_sync";
}): void {
  broadcast({
    type: "TEAM_AUTH_CHANGED",
    email: payload.email,
    teamName: payload.teamName,
    leaderName: payload.leaderName,
    reason: payload.reason,
    timestamp: Date.now(),
  });
}

/**
 * Notify other tabs that admin Supabase auth has changed.
 */
export function broadcastAdminAuthChange(payload: {
  event: "SIGNED_IN" | "SIGNED_OUT" | "USER_UPDATED" | "TOKEN_REFRESHED";
  userId: string | null;
  email: string | null;
}): void {
  broadcast({
    type: "ADMIN_AUTH_CHANGED",
    event: payload.event,
    userId: payload.userId,
    email: payload.email,
    timestamp: Date.now(),
  });
}

/**
 * Subscribe to cross-tab auth synchronization events.
 * Listens on both BroadcastChannel and window "storage" events.
 *
 * Returns an unsubscribe function.
 */
export function subscribeAuthSync(handler: (event: AuthSyncEvent) => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  // 1. BroadcastChannel listener
  const channel = getBroadcastChannel();
  const handleBroadcastMessage = (e: MessageEvent) => {
    if (e.data && (e.data.type === "TEAM_AUTH_CHANGED" || e.data.type === "ADMIN_AUTH_CHANGED")) {
      handler(e.data as AuthSyncEvent);
    }
  };

  if (channel) {
    channel.addEventListener("message", handleBroadcastMessage);
  }

  // 2. Storage event listener (handles direct cross-tab localStorage mutations)
  const handleStorageEvent = (e: StorageEvent) => {
    // If the key is team-related:
    if (e.key === "sih_leader_email" || e.key === "ideathon_leader_email") {
      const newEmail = e.newValue ? e.newValue.trim().toLowerCase() : null;
      const teamSession = getTeamSessionFromStorage();
      handler({
        type: "TEAM_AUTH_CHANGED",
        email: newEmail,
        teamName: teamSession?.teamName || null,
        leaderName: teamSession?.leaderName || null,
        reason: newEmail ? "login" : "logout",
        timestamp: Date.now(),
      });
    }

    // If Supabase auth storage key changed:
    if (e.key && e.key.startsWith("sb-") && e.key.endsWith("-auth-token")) {
      if (!e.newValue) {
        // Token was removed -> sign out occurred in another tab
        handler({
          type: "ADMIN_AUTH_CHANGED",
          event: "SIGNED_OUT",
          userId: null,
          email: null,
          timestamp: Date.now(),
        });
      } else {
        try {
          const parsed = JSON.parse(e.newValue);
          const user = parsed?.user;
          handler({
            type: "ADMIN_AUTH_CHANGED",
            event: "SIGNED_IN",
            userId: user?.id || null,
            email: user?.email || null,
            timestamp: Date.now(),
          });
        } catch {}
      }
    }
  };

  window.addEventListener("storage", handleStorageEvent);

  return () => {
    if (channel) {
      channel.removeEventListener("message", handleBroadcastMessage);
    }
    window.removeEventListener("storage", handleStorageEvent);
  };
}
