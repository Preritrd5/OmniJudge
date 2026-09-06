import { createFileRoute } from "@tanstack/react-router";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...CORS },
  });
}

export const Route = createFileRoute("/api/public/submit")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: CORS }),
      POST: async ({ request }) => {
        try {
          const form = await request.formData();
          const rawName = form.get("teamName");
          const rawCategory = form.get("category");
          const file = form.get("file");
          const teamName = typeof rawName === "string" ? rawName.trim() : "";
          const category = typeof rawCategory === "string" ? rawCategory.trim() : "";

          if (!teamName || teamName.length < 2 || teamName.length > 80) {
            return json({ error: "Team name must be 2-80 characters." }, 400);
          }
          if (!(file instanceof File)) {
            return json({ error: "PDF file is required." }, 400);
          }
          if (file.size > 15 * 1024 * 1024) {
            return json({ error: "PDF must be 15MB or smaller." }, 400);
          }

          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

          // Only allow submissions for teams registered.
          const { data: existing } = await supabaseAdmin
            .from("teams")
            .select("id, name, leader_email")
            .eq("name", teamName)
            .maybeSingle();
          if (!existing?.id) {
            return json({ error: "Team not registered. Please register your team first." }, 400);
          }
          const teamId = existing.id;

          // Save / update rich team requirements
          try {
            const { getTeamProfile, saveTeamProfile } = await import("@/lib/team-store.server");
            const current = getTeamProfile(teamId);
            const rawMembers = form.get("members");
            let membersList = current?.members || [];
            if (typeof rawMembers === "string") {
              try { membersList = JSON.parse(rawMembers); } catch {}
            }
            saveTeamProfile({
              teamId,
              teamName,
              leaderName: current?.leaderName || (typeof form.get("leaderName") === "string" ? String(form.get("leaderName")).trim() : "Team Leader"),
              leaderEmail: current?.leaderEmail || existing.leader_email || (typeof form.get("leaderEmail") === "string" ? String(form.get("leaderEmail")).trim() : ""),
              leaderPhone: typeof form.get("phone") === "string" ? String(form.get("phone")).trim() : current?.leaderPhone,
              category: category || current?.category,
              projectTitle: typeof form.get("projectTitle") === "string" ? String(form.get("projectTitle")).trim() : current?.projectTitle,
              projectDescription: typeof form.get("projectDescription") === "string" ? String(form.get("projectDescription")).trim() : current?.projectDescription,
              members: membersList,
              createdAt: current?.createdAt || new Date().toISOString(),
            });
          } catch (profileErr) {
            console.warn("[submit] Failed to update profile store:", profileErr);
          }

          const { emitNotification } = await import("@/lib/notifications.server");

          // Upload PDF
          const safeName = file.name.replace(/[^\w.\-]+/g, "_").slice(0, 120);
          const path = `${teamId}/${Date.now()}-${safeName}`;
          const buf = new Uint8Array(await file.arrayBuffer());
          const { error: upErr } = await supabaseAdmin.storage
            .from("submissions")
            .upload(path, buf, { contentType: "application/pdf", upsert: false });
          if (upErr) throw new Error(`Upload failed: ${upErr.message}`);

          // Emit upload success notification
          try {
            emitNotification({
              teamId,
              type: "PDF_UPLOAD_SUCCESS",
              title: "Proposal PDF Uploaded",
              message: `Proposal deck "${file.name}" uploaded successfully and verified.`,
            });
          } catch {}

          // Create submission row
          const { data: sub, error: subErr } = await supabaseAdmin
            .from("submissions")
            .insert({ team_id: teamId, file_name: file.name, pdf_path: path, status: "pending", category })
            .select("id")
            .single();
          if (subErr) throw subErr;

          // Emit submission received notification
          try {
            emitNotification({
              teamId,
              type: "SUBMISSION_RECEIVED",
              title: "Submission Received",
              message: `Proposal received for team "${teamName}". Queued for evaluation.`,
            });
          } catch {}

          // Evaluate in the background asynchronously
          const base64 = Buffer.from(buf).toString("base64");
          
          (async () => {
            try {
              // Update status to 'evaluating'
              await supabaseAdmin
                .from("submissions")
                .update({ status: "evaluating" })
                .eq("id", sub.id);

              try {
                emitNotification({
                  teamId,
                  type: "EVALUATION_STARTED",
                  title: "Evaluation In Progress",
                  message: `Automated assessment started for "${file.name}".`,
                });
              } catch {}

              const { evaluatePdf } = await import("@/lib/evaluation.server");
              const rawResult = await evaluatePdf(base64, file.name, category);
              
              // Fetch latest submission row to preserve any existing teacher marks
              const { data: latestSubRow } = await supabaseAdmin
                .from("submissions")
                .select("result")
                .eq("id", sub.id)
                .maybeSingle();

              const existingResult: any = latestSubRow?.result || {};
              const existingTeacherEval = existingResult.teacher_evaluation || null;

              // Separate AI evaluation (criteria other than F7 & F8)
              const aiCriteria = (rawResult.criteria || []).filter(
                (c: any) => c.id !== "F7" && c.id !== "F8" && c.type !== "manual" && c.evalMode !== "manual"
              );
              const aiScore = aiCriteria.reduce((sum: number, c: any) => sum + (Number(c.score) || 0), 0);

              // Separate Teacher evaluation (preserve existing or initialize clean)
              const f7Score = existingTeacherEval?.f7?.score ?? 0;
              const f8Score = existingTeacherEval?.f8?.score ?? 0;
              const teacherScore = existingTeacherEval?.score ?? (f7Score + f8Score);

              // Single authoritative formula: Final Score = AI Marks (80 max) + Teacher Marks (20 max)
              const combinedScore = Math.min(100, Math.max(0, aiScore + teacherScore));

              let rating = "Weak/incomplete";
              if (combinedScore >= 85) rating = "Excellent";
              else if (combinedScore >= 70) rating = "Strong";
              else if (combinedScore >= 61) rating = "Promising with gaps";
              else if (combinedScore >= 41) rating = "Major gaps";

              const enrichedResult: any = {
                ...rawResult,
                ai_evaluation: {
                  score: aiScore,
                  maxScore: 80,
                  status: "completed",
                  timestamp: new Date().toISOString(),
                  criteria: aiCriteria,
                },
                teacher_evaluation: existingTeacherEval || {
                  score: 0,
                  maxScore: 20,
                  status: "pending",
                  evaluator: null,
                  timestamp: null,
                  f7: { score: 0, maxScore: 10, name: "Presentation & Communication", remarks: "" },
                  f8: { score: 0, maxScore: 10, name: "Collaboration & Teamwork", remarks: "" },
                },
                combined_calculation: {
                  score: combinedScore,
                  maxScore: 100,
                  ai_component: aiScore,
                  teacher_component: teacherScore,
                  formula: "AI Marks (80) + Teacher Marks (20) = Final Combined Score (100)",
                  status: existingTeacherEval ? "completed" : "pending_teacher",
                  timestamp: new Date().toISOString(),
                  overallRating: rating,
                },
                totalScore: combinedScore,
                overallRating: rating,
              };

              await supabaseAdmin
                .from("submissions")
                .update({ status: "done", score: combinedScore, result: enrichedResult })
                .eq("id", sub.id);

              try {
                emitNotification({
                  teamId,
                  type: "AI_EVALUATION_COMPLETED",
                  title: "AI Evaluation Finished",
                  message: `AI criteria assessment completed for "${file.name}".`,
                });
              } catch {}
            } catch (evalErr: any) {
              const msg = evalErr?.message || "Evaluation failed";
              console.error("[background-eval]", evalErr);
              await supabaseAdmin
                .from("submissions")
                .update({ status: "failed", error: msg })
                .eq("id", sub.id);
            }
          })();

          return json({ ok: true, submissionId: sub.id, message: "Your submission has been queued and is being evaluated by the panel." });
        } catch (e: any) {
          console.error("[/api/submit]", e);
          return json({ error: e?.message || "Submission failed" }, 500);
        }
      },
    },
  },
});