import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import * as fs from "fs";
import * as path from "path";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// ─── Criteria Config ────────────────────────────────────────────────────────

const CRITERIA_PATH = path.resolve(process.cwd(), "criteria-config.json");
const TOPICS_PATH = path.resolve(process.cwd(), "topics-config.json");

const DEFAULT_CRITERIA = [
  { id: "F1",  name: "Innovation & Creativity",          maxScore: 10, description: "Novelty of idea & creative problem-solving", type: "ai" as const, evalMode: "ai" as const },
  { id: "F2",  name: "Technical Feasibility",             maxScore: 10, description: "Complexity, feasibility, and scalability", type: "ai" as const, evalMode: "ai" as const },
  { id: "F3",  name: "User Experience & Design",          maxScore: 10, description: "UI/UX, accessibility, and inclusivity", type: "ai" as const, evalMode: "ai" as const },
  { id: "F4",  name: "Impact & Usefulness",               maxScore: 10, description: "Problem-solution fit, potential impact, and multiple use cases", type: "ai" as const, evalMode: "ai" as const },
  { id: "F5",  name: "Technical Execution",               maxScore: 10, description: "Prototype, code quality, and technology stack", type: "ai" as const, evalMode: "ai" as const },
  { id: "F6",  name: "Sustainability & Future Scope",     maxScore: 10, description: "Long-term viability & eco-friendly practices", type: "ai" as const, evalMode: "ai" as const },
  { id: "F7",  name: "Presentation & Communication",      maxScore: 10, description: "Clarity, pitch effectiveness, and Q&A handling (Evaluated manually by jury)", type: "manual" as const, evalMode: "manual" as const },
  { id: "F8",  name: "Collaboration & Teamwork",          maxScore: 10, description: "Team dynamics & problem-solving approach (Evaluated manually by jury)", type: "manual" as const, evalMode: "manual" as const },
  { id: "F9",  name: "Business Viability (if applicable)", maxScore: 10, description: "Market potential, revenue model, and affordability", type: "ai" as const, evalMode: "ai" as const },
  { id: "F10", name: "Security & Privacy",                maxScore: 10, description: "Data protection & compliance with privacy regulations", type: "ai" as const, evalMode: "ai" as const },
];

function readCriteriaFile() {
  try {
    if (fs.existsSync(CRITERIA_PATH)) {
      const parsed = JSON.parse(fs.readFileSync(CRITERIA_PATH, "utf-8"));
      if (Array.isArray(parsed.criteria)) {
        parsed.criteria = parsed.criteria.map((c: any) => ({
          ...c,
          type: c.type || (c.id === "F7" || c.id === "F8" ? "manual" : "ai"),
          evalMode: c.evalMode || c.type || (c.id === "F7" || c.id === "F8" ? "manual" : "ai"),
        }));
      }
      return parsed;
    }
  } catch {}
  return { version: 2, criteria: DEFAULT_CRITERIA };
}

export const CriterionSchema = z.object({
  id:          z.string().min(1).max(10),
  name:        z.string().min(2).max(80),
  maxScore:    z.number().int().min(1).max(100),
  description: z.string().max(300),
  type:        z.enum(["ai", "manual"]).default("ai"),
  evalMode:    z.enum(["ai", "manual"]).default("ai").optional(),
});

export const getCriteria = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const config = readCriteriaFile();
    return { criteria: config.criteria as z.infer<typeof CriterionSchema>[], updatedAt: config.updatedAt as string | undefined };
  });

export const saveCriteria = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ criteria: z.array(CriterionSchema).min(1).max(20) }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const config = { version: 2, updatedAt: new Date().toISOString(), criteria: data.criteria };
    fs.writeFileSync(CRITERIA_PATH, JSON.stringify(config, null, 2), "utf-8");
    return { ok: true };
  });

// ─── Topics Config ────────────────────────────────────────────────────────

const DEFAULT_TOPICS = [
  { id: "T1", name: "AI & Machine Learning" },
  { id: "T2", name: "FinTech & Web3" },
  { id: "T3", name: "EdTech & Learning" },
  { id: "T4", name: "Healthcare & MedTech" },
  { id: "T5", name: "Sustainability & GreenTech" },
];

function readTopicsFile() {
  try {
    if (fs.existsSync(TOPICS_PATH)) {
      return JSON.parse(fs.readFileSync(TOPICS_PATH, "utf-8"));
    }
  } catch {}
  return { version: 1, topics: DEFAULT_TOPICS };
}

export const TopicSchema = z.object({
  id: z.string().min(1).max(10),
  name: z.string().min(2).max(100),
});

export const getTopics = createServerFn({ method: "GET" })
  .handler(async () => {
    // Making it public so team portal can load them
    const config = readTopicsFile();
    return { topics: config.topics as z.infer<typeof TopicSchema>[], updatedAt: config.updatedAt as string | undefined };
  });

export const saveTopics = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ topics: z.array(TopicSchema).min(1).max(20) }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const config = { version: 1, updatedAt: new Date().toISOString(), topics: data.topics };
    fs.writeFileSync(TOPICS_PATH, JSON.stringify(config, null, 2), "utf-8");
    return { ok: true };
  });

export const buildFeedbackEmail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ teamId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { fetchLeaderEmail } = await import("@/lib/team-leader-email-helper.server");

    const { data: team } = await supabaseAdmin.from("teams").select("id, name").eq("id", data.teamId).maybeSingle();
    if (!team) throw new Error("Team not found");

    const { data: subs } = await supabaseAdmin
      .from("submissions")
      .select("score, result, file_name, created_at")
      .eq("team_id", data.teamId)
      .eq("status", "done")
      .order("score", { ascending: false })
      .limit(1);

    const email = await fetchLeaderEmail(team.id, team.name);
    const best = subs?.[0];

    if (!best?.result) {
      return {
        to: email,
        subject: `Ideathon 2026 — Feedback for ${team.name}`,
        body: `Dear ${team.name} Team Leader,\n\nThank you for submitting to Ideathon 2026. Your submission is still being evaluated or no results are available yet. We will follow up soon.\n\nBest regards,\nIdeathon 2026 Admin`,
      };
    }

    const r: any = best.result;
    const criteria: any[] = r.criteria || [];
    const weakCriteria = criteria.filter((c: any) => (c.score ?? 0) < 7).sort((a: any, b: any) => a.score - b.score);

    let criteriaLines = "";
    for (const c of criteria) {
      const bar = c.score >= 8 ? "✅" : c.score >= 5 ? "⚠️" : "❌";
      criteriaLines += `  ${bar} ${c.id}. ${c.name}: ${c.score}/${c.maxScore ?? 10}\n`;
      if (c.weaknesses) criteriaLines += `      Issues: ${c.weaknesses}\n`;
    }

    let improvementLines = "";
    for (const c of weakCriteria.slice(0, 5)) {
      improvementLines += `• ${c.name} (scored ${c.score}/10):\n`;
      if (c.weaknesses) improvementLines += `  Problem: ${c.weaknesses}\n`;
      if (c.deductions) improvementLines += `  Deductions: ${c.deductions}\n`;
      improvementLines += "\n";
    }

    const suggestions = (r.suggestions || []).map((s: string, i: number) => `${i + 1}. ${s}`).join("\n");
    const weaknesses  = (r.weaknesses  || []).map((s: string) => `• ${s}`).join("\n");

    const body = [
      `Dear ${team.name} Team Leader,`,
      ``,
      `Thank you for participating in Ideathon 2026. Below is a detailed evaluation report for your submission "${best.file_name}".`,
      ``,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `OVERALL SCORE: ${best.score}/100`,
      `Rating: ${r.overallRating || ""}`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      ``,
      `CRITERIA BREAKDOWN`,
      criteriaLines,
      weaknesses ? `AREAS THAT NEED IMPROVEMENT\n${weaknesses}` : "",
      ``,
      improvementLines ? `HOW TO IMPROVE\n${improvementLines}` : "",
      suggestions ? `SUGGESTIONS FROM EVALUATORS\n${suggestions}` : "",
      ``,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `We encourage you to review these points and apply them in future innovations.`,
      ``,
      `Best regards,`,
      `Ideathon 2026 Admin Team`,
    ].filter((l) => l !== undefined).join("\n");

    return {
      to: email,
      subject: `Ideathon 2026 — Evaluation Feedback for ${team.name} (Score: ${best.score}/100)`,
      body,
    };
  });

async function assertAdmin(userId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin
    .from("user_roles")
    .select("id")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (data) return;

  // Fallback: check if user account is admin@admin.com
  const { data: userRes } = await supabaseAdmin.auth.admin.getUserById(userId);
  if (userRes?.user?.email === "admin@admin.com") {
    try {
      await supabaseAdmin.from("user_roles").upsert(
        { user_id: userId, role: "admin" },
        { onConflict: "user_id,role" }
      );
    } catch {}
    return;
  }

  const email = userRes?.user?.email || "non-admin user";
  throw new Error(`Forbidden: Signed in as ${email}. Please sign in with the Admin account (admin@admin.com) to access the Admin Control Center.`);
}

export const listTeams = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { fetchLeaderEmail } = await import("@/lib/team-leader-email-helper.server");
    const { getTeamProfile, findTeamProfileByEmail } = await import("@/lib/team-store.server");
    const { data: teams, error } = await supabaseAdmin
      .from("teams")
      .select("id, name, created_at")
      .order("created_at", { ascending: false });
    if (error) throw error;
    const { data: subs, error: sErr } = await supabaseAdmin
      .from("submissions")
      .select("id, team_id, file_name, pdf_path, status, score, result, error, created_at, category")
      .order("created_at", { ascending: false });
    if (sErr) throw sErr;
    
    return Promise.all(
      (teams || []).map(async (t) => {
        const email = await fetchLeaderEmail(t.id, t.name);
        const profile = getTeamProfile(t.id) || findTeamProfileByEmail(email);
        const teamSubs = (subs || []).filter((s) => s.team_id === t.id);
        const latest = teamSubs[0] || null;
        const best = teamSubs.reduce<number | null>(
          (acc, s) => (s.score != null && (acc == null || s.score > acc) ? s.score : acc),
          null,
        );
        return {
          ...t,
          leader_email: email,
          leader_name: profile?.leaderName || (t as any).leader_name || null,
          leader_phone: profile?.leaderPhone || null,
          members: profile?.members || [],
          project_title: profile?.projectTitle || null,
          project_description: profile?.projectDescription || null,
          submissions: teamSubs,
          latest,
          bestScore: best,
        };
      })
    );
  });

export const listPublicTeams = createServerFn({ method: "GET" })
  .handler(async () => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { fetchLeaderEmail } = await import("@/lib/team-leader-email-helper.server");
    const { data: teams, error } = await supabaseAdmin
      .from("teams")
      .select("id, name")
      .order("name");
    if (error) throw error;
    
    return Promise.all(
      (teams || []).map(async (t) => {
        const email = await fetchLeaderEmail(t.id, t.name);
        const [local, domain] = email.split("@");
        let maskedLocal = local;
        if (local.length > 3) {
          maskedLocal = local.slice(0, 2) + "*".repeat(local.length - 4) + local.slice(-2);
        } else {
          maskedLocal = local[0] + "*".repeat(local.length - 1);
        }
        const maskedEmail = `${maskedLocal}@${domain}`;
        return { id: t.id, name: t.name, emailHint: maskedEmail };
      })
    );
  });

export const addTeam = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ name: z.string().trim().min(2).max(80), email: z.string().trim().email().optional() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { updateLeaderEmail } = await import("@/lib/team-leader-email-helper.server");
    const { data: row, error } = await supabaseAdmin
      .from("teams")
      .insert({ name: data.name, leader_email: data.email || null } as any)
      .select("id, name, created_at")
      .single();
    if (error) throw new Error(error.message);
    if (data.email) {
      await updateLeaderEmail(row.id, data.email);
    }
    return row;
  });

export const updateTeamLeaderEmail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z.object({ id: z.string().uuid(), email: z.string().trim().email() }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { updateLeaderEmail } = await import("@/lib/team-leader-email-helper.server");
    await updateLeaderEmail(data.id, data.email);
    return { ok: true };
  });

export const verifyTeamLeaderEmail = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z.object({ teamId: z.string().uuid(), email: z.string().trim().email() }).parse(d),
  )
  .handler(async ({ data }) => {
    const { fetchLeaderEmail } = await import("@/lib/team-leader-email-helper.server");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: team } = await supabaseAdmin
      .from("teams")
      .select("name")
      .eq("id", data.teamId)
      .maybeSingle();
    if (!team) return { verified: false, error: "Team not found" };
    
    const correctEmail = await fetchLeaderEmail(data.teamId, team.name);
    const isCorrect = correctEmail.toLowerCase() === data.email.toLowerCase();
    return { verified: isCorrect };
  });

export const deleteTeam = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // Also delete storage files
    const { data: subs } = await supabaseAdmin
      .from("submissions")
      .select("pdf_path")
      .eq("team_id", data.id);
    if (subs && subs.length) {
      await supabaseAdmin.storage.from("submissions").remove(subs.map((s) => s.pdf_path));
    }
    const { error } = await supabaseAdmin.from("teams").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

export const getPdfUrl = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ path: z.string() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: signed, error } = await supabaseAdmin.storage
      .from("submissions")
      .createSignedUrl(data.path, 60 * 10);
    if (error) throw error;
    return { url: signed.signedUrl };
  });

export const deleteSubmission = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: sub } = await supabaseAdmin
      .from("submissions")
      .select("pdf_path")
      .eq("id", data.id)
      .maybeSingle();
    if (sub?.pdf_path) {
      await supabaseAdmin.storage.from("submissions").remove([sub.pdf_path]);
    }
    const { error } = await supabaseAdmin.from("submissions").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

export const renameTeam = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z.object({ id: z.string().uuid(), name: z.string().trim().min(2).max(80) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("teams")
      .update({ name: data.name })
      .eq("id", data.id)
      .select("id, name, created_at")
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

// ─── Manual Scores Saving ──────────────────────────────────────────────────

export const saveManualScores = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z.object({
      submissionId: z.string().uuid(),
      scores: z.record(
        z.string(),
        z.object({
          score: z.number().min(0).max(100),
          evidence: z.string().optional(),
          strengths: z.string().optional(),
          weaknesses: z.string().optional(),
          deductions: z.string().optional(),
        })
      ),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: sub, error } = await supabaseAdmin
      .from("submissions")
      .select("id, score, result")
      .eq("id", data.submissionId)
      .single();

    if (error || !sub) throw new Error("Submission not found");

    const r: any = sub.result || {};
    const criteria: any[] = Array.isArray(r.criteria) ? [...r.criteria] : [];
    let newTotal = 0;

    for (const c of criteria) {
      if (data.scores[c.id]) {
        const update = data.scores[c.id];
        c.score = update.score;
        if (update.evidence !== undefined) c.evidence = update.evidence;
        if (update.strengths !== undefined) c.strengths = update.strengths;
        if (update.weaknesses !== undefined) c.weaknesses = update.weaknesses;
        if (update.deductions !== undefined) c.deductions = update.deductions;
        c.isManuallyGraded = true;
      }
      newTotal += Number(c.score) || 0;
    }

    let rating = "Weak/incomplete";
    if (newTotal >= 85) rating = "Excellent";
    else if (newTotal >= 70) rating = "Strong";
    else if (newTotal >= 61) rating = "Promising with gaps";
    else if (newTotal >= 41) rating = "Major gaps";

    r.criteria = criteria;
    r.totalScore = newTotal;
    r.overallRating = rating;

    const { error: upErr } = await supabaseAdmin
      .from("submissions")
      .update({ score: newTotal, result: r })
      .eq("id", data.submissionId);

    if (upErr) throw new Error(`Failed to update scores: ${upErr.message}`);
    return { ok: true, totalScore: newTotal, overallRating: rating, criteria };
  });

// ─── Team Leader Registration & Portal Functions ─────────────────────────────

export const registerTeamLeader = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z.object({
      leaderName: z.string().trim().min(2, "Leader name must be at least 2 characters").max(80),
      teamName: z.string().trim().min(2, "Team name must be at least 2 characters").max(80),
      email: z.string().trim().email("Invalid email address"),
      password: z.string().min(6, "Password must be at least 6 characters"),
      phone: z.string().trim().optional(),
    }).parse(d),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { saveTeamProfile } = await import("@/lib/team-store.server");
    const { updateLeaderEmail } = await import("@/lib/team-leader-email-helper.server");

    // Check if team name already exists
    const { data: existingTeam } = await supabaseAdmin
      .from("teams")
      .select("id, name")
      .ilike("name", data.teamName)
      .maybeSingle();

    if (existingTeam) {
      throw new Error(`Team name "${data.teamName}" is already registered. Please choose a different team name.`);
    }

    // Check if team with this email already exists
    const { data: existingEmailTeam } = await supabaseAdmin
      .from("teams")
      .select("id, name")
      .ilike("leader_email", data.email)
      .maybeSingle();

    if (existingEmailTeam) {
      throw new Error(`An account with email "${data.email}" is already registered for team "${existingEmailTeam.name}". Please sign in.`);
    }

    // Register user in Supabase Auth
    try {
      const { data: userRes, error: userErr } = await supabaseAdmin.auth.admin.createUser({
        email: data.email,
        password: data.password,
        email_confirm: true,
        user_metadata: {
          leader_name: data.leaderName,
          team_name: data.teamName,
          phone: data.phone || "",
          role: "team_leader",
        },
      });

      if (userErr && !userErr.message.toLowerCase().includes("already registered")) {
        console.warn("[registerTeamLeader] Auth user creation note:", userErr.message);
      }
    } catch (authE: any) {
      console.warn("[registerTeamLeader] Auth note:", authE?.message);
    }

    // Insert into teams table
    const { data: teamRow, error: teamErr } = await supabaseAdmin
      .from("teams")
      .insert({
        name: data.teamName,
        leader_email: data.email,
      } as any)
      .select("id, name, created_at")
      .single();

    if (teamErr) throw new Error(teamErr.message);

    // Persist full profile
    saveTeamProfile({
      teamId: teamRow.id,
      teamName: teamRow.name,
      leaderName: data.leaderName,
      leaderEmail: data.email,
      leaderPhone: data.phone,
      members: [],
      createdAt: new Date().toISOString(),
    });
    await updateLeaderEmail(teamRow.id, data.email);

    return {
      ok: true,
      teamId: teamRow.id,
      teamName: teamRow.name,
      leaderName: data.leaderName,
      leaderEmail: data.email,
    };
  });

export const updateTeamRequirements = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z.object({
      teamId: z.string().uuid(),
      leaderEmail: z.string().trim().email(),
      category: z.string().optional(),
      projectTitle: z.string().optional(),
      projectDescription: z.string().optional(),
      leaderPhone: z.string().optional(),
      members: z.array(z.string()).optional(),
    }).parse(d),
  )
  .handler(async ({ data }) => {
    const { getTeamProfile, saveTeamProfile } = await import("@/lib/team-store.server");
    const current = getTeamProfile(data.teamId);

    saveTeamProfile({
      teamId: data.teamId,
      teamName: current?.teamName || "",
      leaderName: current?.leaderName || "",
      leaderEmail: data.leaderEmail,
      leaderPhone: data.leaderPhone !== undefined ? data.leaderPhone : current?.leaderPhone,
      category: data.category !== undefined ? data.category : current?.category,
      projectTitle: data.projectTitle !== undefined ? data.projectTitle : current?.projectTitle,
      projectDescription: data.projectDescription !== undefined ? data.projectDescription : current?.projectDescription,
      members: data.members !== undefined ? data.members : current?.members,
      createdAt: current?.createdAt || new Date().toISOString(),
    });

    return { ok: true };
  });

export const getTeamDashboard = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z.object({
      email: z.string().trim().email(),
    }).parse(d),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { findTeamProfileByEmail, getTeamProfile } = await import("@/lib/team-store.server");

    const { data: team } = await supabaseAdmin
      .from("teams")
      .select("id, name, created_at, leader_email")
      .ilike("leader_email", data.email)
      .maybeSingle();

    let teamRecord = team;
    let profile = team ? getTeamProfile(team.id) : null;

    if (!teamRecord) {
      const fallback = findTeamProfileByEmail(data.email);
      if (fallback) {
        profile = fallback;
        const { data: t } = await supabaseAdmin
          .from("teams")
          .select("id, name, created_at, leader_email")
          .eq("id", fallback.teamId)
          .maybeSingle();
        teamRecord = t;
      }
    }

    if (!teamRecord) {
      return { found: false, team: null };
    }

    const { data: subs } = await supabaseAdmin
      .from("submissions")
      .select("id, file_name, status, score, result, error, category, created_at")
      .eq("team_id", teamRecord.id)
      .order("created_at", { ascending: false });

    return {
      found: true,
      team: {
        ...teamRecord,
        profile: profile || {
          teamId: teamRecord.id,
          teamName: teamRecord.name,
          leaderName: "Team Leader",
          leaderEmail: teamRecord.leader_email || data.email,
          createdAt: teamRecord.created_at,
        },
        submissions: subs || [],
      },
    };
  });