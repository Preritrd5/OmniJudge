import * as fs from "fs";
import * as path from "path";

export interface AppNotification {
  id: string;
  recipientTeamId: string; // Team ID or "all"
  title: string;
  message: string;
  type:
    | "PDF_UPLOAD_SUCCESS"
    | "SUBMISSION_RECEIVED"
    | "EVALUATION_STARTED"
    | "AI_EVALUATION_COMPLETED"
    | "TEACHER_EVALUATION_UPDATED"
    | "F7_UPDATED"
    | "F8_UPDATED"
    | "COMBINED_RESULT_UPDATED"
    | "ADMIN_ANNOUNCEMENT_PUBLISHED"
    | "GENERAL_UPDATE";
  isRead: boolean;
  read?: boolean;
  createdAt: string;
}

const NOTIFICATIONS_STORE_PATH = path.resolve(process.cwd(), "notifications-store.json");

function readNotificationsStore(): AppNotification[] {
  try {
    if (fs.existsSync(NOTIFICATIONS_STORE_PATH)) {
      const data = JSON.parse(fs.readFileSync(NOTIFICATIONS_STORE_PATH, "utf-8"));
      if (Array.isArray(data)) {
        return data.map((n) => ({
          ...n,
          read: n.read !== undefined ? n.read : n.isRead,
          isRead: n.isRead !== undefined ? n.isRead : n.read,
        }));
      }
    }
  } catch (e) {
    console.error("[notifications.server] Failed to read notifications store:", e);
  }
  return [];
}

function writeNotificationsStore(notifs: AppNotification[]): void {
  try {
    fs.writeFileSync(NOTIFICATIONS_STORE_PATH, JSON.stringify(notifs, null, 2), "utf-8");
  } catch (e) {
    console.error("[notifications.server] Failed to write notifications store:", e);
  }
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

export function createNotification(params: {
  recipientTeamId: string;
  title: string;
  message: string;
  type: AppNotification["type"];
}): AppNotification {
  const all = readNotificationsStore();
  
  // Prevent excessive duplicate notifications within 30 seconds
  const now = new Date();
  const recentDuplicate = all.find(
    (n) =>
      n.recipientTeamId === params.recipientTeamId &&
      n.type === params.type &&
      Math.abs(now.getTime() - new Date(n.createdAt).getTime()) < 30000
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
    createdAt: now.toISOString(),
  };

  all.unshift(newNotif);
  // Keep last 500 notifications
  if (all.length > 500) all.length = 500;
  writeNotificationsStore(all);

  return newNotif;
}

export function emitNotification(params: {
  teamId: string;
  title: string;
  message: string;
  type: AppNotification["type"];
}): AppNotification {
  return createNotification({
    recipientTeamId: params.teamId,
    title: params.title,
    message: params.message,
    type: params.type,
  });
}

export function getNotificationsForTeam(teamId: string): AppNotification[] {
  const all = readNotificationsStore();
  return all.filter(
    (n) => n.recipientTeamId === teamId || n.recipientTeamId === "all"
  );
}

export function markNotificationAsRead(id: string, teamId?: string): boolean {
  const all = readNotificationsStore();
  const target = all.find(
    (n) => n.id === id && (!teamId || n.recipientTeamId === teamId || n.recipientTeamId === "all")
  );
  if (target) {
    target.isRead = true;
    writeNotificationsStore(all);
    return true;
  }
  return false;
}

export function markAllNotificationsAsRead(teamId: string): void {
  const all = readNotificationsStore();
  let changed = false;
  for (const n of all) {
    if ((n.recipientTeamId === teamId || n.recipientTeamId === "all") && !n.isRead) {
      n.isRead = true;
      changed = true;
    }
  }
  if (changed) {
    writeNotificationsStore(all);
  }
}
