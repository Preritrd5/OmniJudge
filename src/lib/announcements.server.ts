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
const STORAGE_BUCKET = "app_state";
const STORAGE_KEY = "announcements.json";

export const DEFAULT_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "ann_welcome_2026",
    title: "Welcome to SIH Premier 2026!",
    content: "Welcome teams! Please upload your pitch deck proposal in PDF format (less than 3 MB) before the submission deadline. Automated and jury evaluations will follow.",
    author: "SIH Premier 2026 Organizing Committee",
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
    author: "SIH Premier 2026 Organizing Committee",
    targetAudience: "all",
    priority: "urgent",
    pinned: false,
    isPublished: true,
    published: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// In-memory cache for fast sub-millisecond reads
let _cachedAnnouncements: Announcement[] | null = null;
let _lastFetchedAt = 0;
const CACHE_TTL_MS = 2000;

function normalizeAnnouncement(a: any): Announcement {
  const isPub = a.published !== undefined ? Boolean(a.published) : Boolean(a.isPublished);
  return {
    id: String(a.id),
    title: String(a.title || ""),
    content: String(a.content || ""),
    author: String(a.author || "SIH Premier Committee"),
    targetAudience: a.targetAudience === "students" ? "students" : "all",
    targetTeams: Array.isArray(a.targetTeams) ? a.targetTeams : undefined,
    priority: a.priority === "urgent" || a.priority === "low" ? a.priority : "normal",
    pinned: Boolean(a.pinned),
    isPublished: isPub,
    published: isPub,
    createdAt: a.createdAt || new Date().toISOString(),
    updatedAt: a.updatedAt || a.createdAt || new Date().toISOString(),
  };
}

async function getSupabaseAdmin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

export async function readAnnouncementsStore(forceFresh = false): Promise<Announcement[]> {
  const now = Date.now();
  if (!forceFresh && _cachedAnnouncements !== null && now - _lastFetchedAt < CACHE_TTL_MS) {
    return _cachedAnnouncements;
  }

  try {
    const supabase = await getSupabaseAdmin();
    const { data: blob, error } = await supabase.storage.from(STORAGE_BUCKET).download(STORAGE_KEY);

    if (!error && blob) {
      const text = await blob.text();
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) {
        _cachedAnnouncements = parsed.map(normalizeAnnouncement);
        _lastFetchedAt = now;
        // Best effort sync to local file
        try {
          fs.writeFileSync(ANNOUNCEMENTS_STORE_PATH, JSON.stringify(_cachedAnnouncements, null, 2), "utf-8");
        } catch {}
        return _cachedAnnouncements;
      }
    }

    // If file does not exist in storage yet, seed initial default announcements
    const isNotFound = error && (
      error.message?.toLowerCase().includes("not found") ||
      (error as any).status === 400 ||
      (error as any).status === 404
    );

    if (isNotFound) {
      console.log("[announcements.server] Initializing announcements in cloud storage...");
      _cachedAnnouncements = DEFAULT_ANNOUNCEMENTS.map(normalizeAnnouncement);
      _lastFetchedAt = now;
      await writeAnnouncementsStore(_cachedAnnouncements);
      return _cachedAnnouncements;
    }

    if (error) {
      console.warn("[announcements.server] Storage read warning:", error.message);
    }
  } catch (err) {
    console.error("[announcements.server] Failed to read from cloud storage, falling back:", err);
  }

  // Fallback 1: in-memory cache if available
  if (_cachedAnnouncements !== null) {
    return _cachedAnnouncements;
  }

  // Fallback 2: local filesystem cache
  try {
    if (fs.existsSync(ANNOUNCEMENTS_STORE_PATH)) {
      const fileData = JSON.parse(fs.readFileSync(ANNOUNCEMENTS_STORE_PATH, "utf-8"));
      if (Array.isArray(fileData)) {
        _cachedAnnouncements = fileData.map(normalizeAnnouncement);
        _lastFetchedAt = now;
        return _cachedAnnouncements;
      }
    }
  } catch {}

  // Fallback 3: default announcements
  _cachedAnnouncements = DEFAULT_ANNOUNCEMENTS.map(normalizeAnnouncement);
  _lastFetchedAt = now;
  return _cachedAnnouncements;
}

export async function writeAnnouncementsStore(items: Announcement[]): Promise<void> {
  const normalized = items.map(normalizeAnnouncement);
  _cachedAnnouncements = normalized;
  _lastFetchedAt = Date.now();

  // 1. Cloud storage persistence (Source of truth)
  try {
    const supabase = await getSupabaseAdmin();
    const payload = JSON.stringify(normalized, null, 2);
    const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(STORAGE_KEY, payload, {
      contentType: "application/json",
      upsert: true,
    });
    if (error) {
      console.error("[announcements.server] Failed to upload announcements to cloud storage:", error.message);
    }
  } catch (err) {
    console.error("[announcements.server] Cloud storage upload error:", err);
  }

  // 2. Local filesystem sync (best effort)
  try {
    fs.writeFileSync(ANNOUNCEMENTS_STORE_PATH, JSON.stringify(normalized, null, 2), "utf-8");
  } catch {}
}

async function notifyAnnouncement(title: string, message: string) {
  try {
    const notifModule = await import("./notifications.server.ts").catch(
      () => import("./notifications.server") as any
    );
    if (typeof notifModule.createNotification === "function") {
      await notifModule.createNotification({
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

export async function getAllAnnouncements(onlyPublished = false): Promise<Announcement[]> {
  const all = await readAnnouncementsStore();
  if (onlyPublished) {
    return all.filter((a) => a.isPublished || a.published);
  }
  return all;
}

export async function getPublishedAnnouncements(): Promise<Announcement[]> {
  const all = await readAnnouncementsStore();
  return all
    .filter((a) => a.isPublished || a.published)
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
}

export async function createAnnouncement(params: {
  title: string;
  content: string;
  author?: string;
  targetAudience?: "all" | "students";
  targetTeams?: string[];
  priority?: "low" | "normal" | "urgent";
  pinned?: boolean;
  publishImmediately?: boolean;
}): Promise<Announcement> {
  const all = await readAnnouncementsStore(true);
  const now = new Date().toISOString();
  const isPublished = params.publishImmediately ?? true;

  const item: Announcement = {
    id: `ann_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    title: params.title.trim(),
    content: params.content.trim(),
    author: params.author?.trim() || "SIH Premier 2026 Admin",
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
  await writeAnnouncementsStore(all);

  if (isPublished) {
    await notifyAnnouncement(
      `📢 Announcement: ${item.title}`,
      item.content.length > 120 ? `${item.content.slice(0, 117)}...` : item.content
    );
  }

  return item;
}

export async function togglePublishAnnouncement(id: string, published?: boolean): Promise<Announcement | null> {
  const all = await readAnnouncementsStore(true);
  const item = all.find((a) => a.id === id);
  if (!item) return null;

  item.isPublished = published !== undefined ? published : !item.isPublished;
  item.published = item.isPublished;
  item.updatedAt = new Date().toISOString();
  await writeAnnouncementsStore(all);

  if (item.isPublished) {
    await notifyAnnouncement(
      `📢 Announcement: ${item.title}`,
      item.content.length > 120 ? `${item.content.slice(0, 117)}...` : item.content
    );
  }

  return item;
}

export const toggleAnnouncementPublish = togglePublishAnnouncement;

export async function deleteAnnouncement(id: string): Promise<boolean> {
  const all = await readAnnouncementsStore(true);
  const next = all.filter((a) => a.id !== id);
  if (next.length !== all.length) {
    await writeAnnouncementsStore(next);
    return true;
  }
  return false;
}
