/**
 * Cross-Tab Authentication & Session Synchronization Manager
 *
 * NOTE ON SESSION ISOLATION:
 * Team portal sessions are strictly tab-isolated using window.sessionStorage.
 * Cross-tab broadcasting is explicitly disabled for team leaders so that
 * different team accounts can be used concurrently in separate tabs without collision.
 *
 * Admin sessions (Supabase auth) continue to use synchronized state across tabs.
 */

import {
  getTeamTabSession,
  setTeamTabSession,
  clearTeamTabSession,
  TeamSessionData,
  purgeLegacyLocalStorage,
} from "./team-session";

export interface TeamSession {
  email: string;
  teamName: string;
  leaderName: string;
}

export type AdminAuthSyncEvent = {
  type: "ADMIN_AUTH_CHANGED";
  event: "SIGNED_IN" | "SIGNED_OUT" | "USER_UPDATED" | "TOKEN_REFRESHED";
  userId: string | null;
  email: string | null;
  timestamp: number;
};

export type TeamAuthSyncEvent = {
  type: "TEAM_AUTH_CHANGED";
  email: string | null;
  teamName?: string | null;
  leaderName?: string | null;
  reason: "login" | "logout" | "storage_sync";
  timestamp: number;
};

export type AuthSyncEvent = TeamAuthSyncEvent | AdminAuthSyncEvent;

const CHANNEL_NAME = "sih_auth_sync_channel";

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
 * Retrieve current team session details strictly from tab sessionStorage.
 */
export function getTeamSessionFromStorage(): TeamSession | null {
  const tab = getTeamTabSession();
  if (!tab) return null;
  return {
    email: tab.email,
    teamName: tab.teamName,
    leaderName: tab.leaderName || "",
  };
}

/**
 * Remove team session from current tab's sessionStorage.
 */
export function clearTeamSessionStorage(): void {
  clearTeamTabSession();
  purgeLegacyLocalStorage();
}

/**
 * Save team session to current tab's sessionStorage.
 */
export function setTeamSessionStorage(session: TeamSession & { sessionToken?: string; teamId?: string }): void {
  setTeamTabSession({
    email: session.email,
    teamName: session.teamName,
    leaderName: session.leaderName,
    sessionToken: session.sessionToken || "legacy-compat",
    teamId: session.teamId,
  });
  purgeLegacyLocalStorage();
}

/**
 * Broadcast an administrative authentication event to all other open tabs/windows.
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

  try {
    localStorage.setItem("sih_admin_auth_ping", `${event.type}:${Date.now()}`);
  } catch {}
}

/**
 * NO-OP: Team auth broadcasting is disabled by design to ensure complete
 * multi-tab isolation between different team leader sessions.
 */
export function broadcastTeamAuthChange(_payload: {
  email: string | null;
  teamName?: string | null;
  leaderName?: string | null;
  reason: "login" | "logout" | "storage_sync";
}): void {
  // Deliberately no-op: team accounts are strictly tab-isolated.
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
 * Subscribe to cross-tab auth synchronization events for Admin users.
 */
export function subscribeAuthSync(handler: (event: AuthSyncEvent) => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  // 1. BroadcastChannel listener
  const channel = getBroadcastChannel();
  const handleBroadcastMessage = (e: MessageEvent) => {
    // Only forward admin auth events across tabs
    if (e.data && e.data.type === "ADMIN_AUTH_CHANGED") {
      handler(e.data as AuthSyncEvent);
    }
  };

  if (channel) {
    channel.addEventListener("message", handleBroadcastMessage);
  }

  // 2. Storage event listener (handles direct cross-tab Supabase localStorage mutations)
  const handleStorageEvent = (e: StorageEvent) => {
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
