import * as fs from "fs";
import * as path from "path";

export interface AppNotification {
  id: string;
  recipientTeamId: string; // Team ID or "all"
  title: string;
  message: string;
  type:
    | "ADMIN_ANNOUNCEMENT_PUBLISHED"
    | "ADMIN_BROADCAST"
    | "GENERAL_UPDATE"
    | "RESULTS_DECLARED"
    | string;
  isRead: boolean;
  read?: boolean;
  readByTeamIds?: string[];
  createdAt: string;
}

// Only official updates & announcements created by admin are displayed as notifications
export const ALLOWED_ADMIN_NOTIFICATION_TYPES = new Set([
  "ADMIN_ANNOUNCEMENT_PUBLISHED",
  "ADMIN_BROADCAST",
  "GENERAL_UPDATE",
  "RESULTS_DECLARED",
]);

const NOTIFICATIONS_STORE_PATH = path.resolve(process.cwd(), "notifications-store.json");
const STORAGE_BUCKET = "app_state";
const STORAGE_KEY = "notifications.json";

// In-memory cache for fast sub-millisecond reads
let _cachedNotifications: AppNotification[] | null = null;
let _lastNotifFetchAt = 0;
const CACHE_TTL_MS = 2000;

function normalizeNotification(n: any): AppNotification {
  const isRead = Boolean(n.isRead || n.read);
  return {
    id: String(n.id),
    recipientTeamId: String(n.recipientTeamId || "all"),
    title: String(n.title || ""),
    message: String(n.message || ""),
    type: n.type || "GENERAL_UPDATE",
    isRead,
    read: isRead,
    readByTeamIds: Array.isArray(n.readByTeamIds) ? n.readByTeamIds : [],
    createdAt: n.createdAt || new Date().toISOString(),
  };
}

async function getSupabaseAdmin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

export async function readNotificationsStore(forceFresh = false): Promise<AppNotification[]> {
  const now = Date.now();
  if (!forceFresh && _cachedNotifications !== null && now - _lastNotifFetchAt < CACHE_TTL_MS) {
    return _cachedNotifications;
  }

  try {
    const supabase = await getSupabaseAdmin();
    const { data: blob, error } = await supabase.storage.from(STORAGE_BUCKET).download(STORAGE_KEY);

    if (!error && blob) {
      const text = await blob.text();
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) {
        _cachedNotifications = parsed.map(normalizeNotification);
        _lastNotifFetchAt = now;
        try {
          fs.writeFileSync(NOTIFICATIONS_STORE_PATH, JSON.stringify(_cachedNotifications, null, 2), "utf-8");
        } catch {}
        return _cachedNotifications;
      }
    }

    const isNotFound = error && (
      error.message?.toLowerCase().includes("not found") ||
      (error as any).status === 400 ||
      (error as any).status === 404
    );

    if (isNotFound) {
      _cachedNotifications = [];
      _lastNotifFetchAt = now;
      await writeNotificationsStore([]);
      return [];
    }

    if (error) {
      console.warn("[notifications.server] Storage read warning:", error.message);
    }
  } catch (err) {
    console.error("[notifications.server] Failed to read from cloud storage, falling back:", err);
  }

  if (_cachedNotifications !== null) {
    return _cachedNotifications;
  }

  try {
    if (fs.existsSync(NOTIFICATIONS_STORE_PATH)) {
      const fileData = JSON.parse(fs.readFileSync(NOTIFICATIONS_STORE_PATH, "utf-8"));
      if (Array.isArray(fileData)) {
        _cachedNotifications = fileData.map(normalizeNotification);
        _lastNotifFetchAt = now;
        return _cachedNotifications;
      }
    }
  } catch {}

  _cachedNotifications = [];
  _lastNotifFetchAt = now;
  return [];
}

export async function writeNotificationsStore(notifs: AppNotification[]): Promise<void> {
  const trimmed = notifs.slice(0, 500).map(normalizeNotification);
  _cachedNotifications = trimmed;
  _lastNotifFetchAt = Date.now();

  try {
    const supabase = await getSupabaseAdmin();
    const payload = JSON.stringify(trimmed, null, 2);
    const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(STORAGE_KEY, payload, {
      contentType: "application/json",
      upsert: true,
    });
    if (error) {
      console.error("[notifications.server] Failed to upload notifications to cloud storage:", error.message);
    }
  } catch (err) {
    console.error("[notifications.server] Cloud storage upload error:", err);
  }

  try {
    fs.writeFileSync(NOTIFICATIONS_STORE_PATH, JSON.stringify(trimmed, null, 2), "utf-8");
  } catch {}
}

export function sanitizeNotificationMessage(message: string): string {
  return message
    .replace(/(?:score|marks|grade|result)\s*(?:is|of|:)?\s*\d+(\.\d+)?(?:\/\d+(\.\d+)?)?%?/gi, "evaluation status verified")
    .replace(/\b\d+(\.\d+)?\s*(?:\/|\s*out of\s*)\s*\d+(\.\d+)?\b/gi, "[reviewed]")
    .replace(/\b\d+(\.\d+)?\s*(?:points|pts|marks|percent|%)\b/gi, "[criteria assessed]")
    .replace(/\b\d+(\.\d+)?\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export async function createNotification(params: {
  recipientTeamId: string;
  title: string;
  message: string;
  type: AppNotification["type"];
}): Promise<AppNotification | null> {
  // Only official announcements & updates created by admin are allowed
  if (!ALLOWED_ADMIN_NOTIFICATION_TYPES.has(params.type)) {
    return null;
  }

  const all = await readNotificationsStore(true);
  
  // Prevent duplicate notifications within 15 seconds
  const now = new Date();
  const recentDuplicate = all.find(
    (n) =>
      n.recipientTeamId === params.recipientTeamId &&
      n.type === params.type &&
      n.title === params.title.trim() &&
      Math.abs(now.getTime() - new Date(n.createdAt).getTime()) < 15000
  );

  if (recentDuplicate) {
    return recentDuplicate;
  }

  const newNotif: AppNotification = {
    id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    recipientTeamId: params.recipientTeamId,
    title: params.title.trim(),
    message: sanitizeNotificationMessage(params.message.trim()),
    type: params.type,
    isRead: false,
    read: false,
    readByTeamIds: [],
    createdAt: now.toISOString(),
  };

  all.unshift(newNotif);
  await writeNotificationsStore(all);

  return newNotif;
}

export async function emitNotification(params: {
  teamId: string;
  title: string;
  message: string;
  type: AppNotification["type"];
}): Promise<AppNotification | null> {
  try {
    return await createNotification({
      recipientTeamId: params.teamId,
      title: params.title,
      message: params.message,
      type: params.type,
    });
  } catch (err) {
    console.warn("[notifications.server] emitNotification warning:", err);
    return null;
  }
}

export async function getNotificationsForTeam(teamId: string): Promise<AppNotification[]> {
  const all = await readNotificationsStore();
  // Filter strictly for admin announcements and official broadcasts (no automated PDF/evaluation spam)
  return all
    .filter(
      (n) =>
        (n.recipientTeamId === teamId || n.recipientTeamId === "all") &&
        ALLOWED_ADMIN_NOTIFICATION_TYPES.has(n.type)
    )
    .map((n) => {
      // If notification is broadcast to all teams, check if this specific team has read it
      let isRead = false;
      if (n.recipientTeamId === "all") {
        isRead = Boolean(n.readByTeamIds?.includes(teamId));
      } else {
        isRead = Boolean(n.isRead || n.read);
      }
      return {
        ...n,
        isRead,
        read: isRead,
      };
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function markNotificationAsRead(id: string, teamId?: string): Promise<boolean> {
  const all = await readNotificationsStore(true);
  const target = all.find((n) => n.id === id);
  if (!target) return false;

  if (target.recipientTeamId === "all" && teamId) {
    target.readByTeamIds = target.readByTeamIds || [];
    if (!target.readByTeamIds.includes(teamId)) {
      target.readByTeamIds.push(teamId);
    }
  } else {
    target.isRead = true;
    target.read = true;
  }

  await writeNotificationsStore(all);
  return true;
}

export async function markAllNotificationsAsRead(teamId: string): Promise<number> {
  const all = await readNotificationsStore(true);
  let changedCount = 0;

  for (const n of all) {
    if (n.recipientTeamId === "all") {
      n.readByTeamIds = n.readByTeamIds || [];
      if (!n.readByTeamIds.includes(teamId)) {
        n.readByTeamIds.push(teamId);
        changedCount++;
      }
    } else if (n.recipientTeamId === teamId) {
      if (!n.isRead || !n.read) {
        n.isRead = true;
        n.read = true;
        changedCount++;
      }
    }
  }

  if (changedCount > 0) {
    await writeNotificationsStore(all);
  }

  return changedCount;
}
