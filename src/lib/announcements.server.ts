import * as fs from "fs";
import * as path from "path";

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  targetAudience?: "all" | "students";
  targetTeams?: string[];
  priority?: "low" | "normal" | "urgent";
  pinned?: boolean;
  isPublished: boolean;
  published?: boolean;
  createdAt: string;
  updatedAt: string;
}

const ANNOUNCEMENTS_STORE_PATH = path.resolve(process.cwd(), "announcements-store.json");

const DEFAULT_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "ann_welcome_2026",
    title: "Welcome to Ideathon 2026!",
    content: "Welcome teams! Please upload your pitch deck proposal in PDF format (up to 15MB) before the submission deadline. Automated and jury evaluations will follow.",
    author: "Ideathon 2026 Organizing Committee",
    targetAudience: "all",
    priority: "normal",
    pinned: true,
    isPublished: true,
    published: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "ann_jury_eval",
    title: "Live Pitch & Jury Presentation Protocol",
    content: "Live presentations (F7: Presentation & Communication, F8: Collaboration & Teamwork) will be scored in real time by the jury panel during in-person presentations.",
    author: "Ideathon 2026 Organizing Committee",
    targetAudience: "all",
    priority: "urgent",
    pinned: false,
    isPublished: true,
    published: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

function readAnnouncementsStore(): Announcement[] {
  try {
    if (fs.existsSync(ANNOUNCEMENTS_STORE_PATH)) {
      const data = JSON.parse(fs.readFileSync(ANNOUNCEMENTS_STORE_PATH, "utf-8"));
      if (Array.isArray(data) && data.length > 0) {
        return data.map((a) => ({
          ...a,
          published: a.published !== undefined ? a.published : a.isPublished,
          isPublished: a.isPublished !== undefined ? a.isPublished : a.published,
        }));
      }
    }
  } catch (e) {
    console.error("[announcements.server] Failed to read announcements store:", e);
  }
  return DEFAULT_ANNOUNCEMENTS;
}

function writeAnnouncementsStore(items: Announcement[]): void {
  try {
    fs.writeFileSync(ANNOUNCEMENTS_STORE_PATH, JSON.stringify(items, null, 2), "utf-8");
  } catch (e) {
    console.error("[announcements.server] Failed to write announcements store:", e);
  }
}

async function notifyAnnouncement(title: string, message: string) {
  try {
    const notifModule = await import("./notifications.server.ts").catch(
      () => import("./notifications.server") as any
    );
    if (typeof notifModule.createNotification === "function") {
      notifModule.createNotification({
        recipientTeamId: "all",
        title,
        message,
        type: "ADMIN_ANNOUNCEMENT_PUBLISHED",
      });
    }
  } catch (e) {
    console.warn("[announcements.server] Note: could not emit notification:", e);
  }
}

export function getAllAnnouncements(onlyPublished = false): Announcement[] {
  const all = readAnnouncementsStore();
  if (onlyPublished) {
    return all.filter((a) => a.isPublished || a.published);
  }
  return all;
}

export function getPublishedAnnouncements(): Announcement[] {
  const all = readAnnouncementsStore();
  return all
    .filter((a) => a.isPublished || a.published)
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
}

export function createAnnouncement(params: {
  title: string;
  content: string;
  author?: string;
  targetAudience?: "all" | "students";
  targetTeams?: string[];
  priority?: "low" | "normal" | "urgent";
  pinned?: boolean;
  publishImmediately?: boolean;
}): Announcement {
  const all = readAnnouncementsStore();
  const now = new Date().toISOString();
  const isPublished = params.publishImmediately ?? true;

  const item: Announcement = {
    id: `ann_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    title: params.title.trim(),
    content: params.content.trim(),
    author: params.author?.trim() || "Ideathon 2026 Admin",
    targetAudience: params.targetAudience || "all",
    targetTeams: params.targetTeams,
    priority: params.priority || "normal",
    pinned: Boolean(params.pinned),
    isPublished,
    published: isPublished,
    createdAt: now,
    updatedAt: now,
  };

  all.unshift(item);
  writeAnnouncementsStore(all);

  if (isPublished) {
    notifyAnnouncement(
      `📢 Announcement: ${item.title}`,
      item.content.length > 120 ? `${item.content.slice(0, 117)}...` : item.content
    );
  }

  return item;
}

export function togglePublishAnnouncement(id: string, published?: boolean): Announcement | null {
  const all = readAnnouncementsStore();
  const item = all.find((a) => a.id === id);
  if (!item) return null;

  item.isPublished = published !== undefined ? published : !item.isPublished;
  item.published = item.isPublished;
  item.updatedAt = new Date().toISOString();
  writeAnnouncementsStore(all);

  if (item.isPublished) {
    notifyAnnouncement(
      `📢 Announcement: ${item.title}`,
      item.content.length > 120 ? `${item.content.slice(0, 117)}...` : item.content
    );
  }

  return item;
}

export const toggleAnnouncementPublish = togglePublishAnnouncement;

export function deleteAnnouncement(id: string): boolean {
  const all = readAnnouncementsStore();
  const next = all.filter((a) => a.id !== id);
  if (next.length !== all.length) {
    writeAnnouncementsStore(next);
    return true;
  }
  return false;
}
