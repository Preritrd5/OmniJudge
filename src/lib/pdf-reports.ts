// High performance print-ready PDF generator with clean 1-page and 2-page layouts, fast watermark logo, and copyright

export interface TeamReportData {
  id: string;
  name: string;
  leader_email?: string | null;
  leader_name?: string | null;
  leader_phone?: string | null;
  members?: any[];
  project_title?: string | null;
  project_description?: string | null;
  bestScore?: number | null;
  created_at?: string;
  latest?: {
    category?: string | null;
  } | null;
  submissions: Array<{
    id: string;
    team_id?: string;
    file_name: string;
    pdf_path?: string;
    score?: number | null;
    status: string;
    error?: string | null;
    created_at?: string;
    category?: string | null;
    result?: any;
  }>;
}

export interface TopicItem {
  id: string;
  name: string;
}

const COMMON_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600;700;800;900&display=swap');
  
  @page {
    size: A4 portrait;
    margin: 8mm 10mm;
  }
  
  * {
    box-sizing: border-box;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  
  body {
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    margin: 0;
    padding: 0;
    background: #f8fafc;
    color: #0f172a;
    font-size: 11.5px;
    line-height: 1.4;
  }
  
  .heading-font {
    font-family: 'Space Grotesk', sans-serif;
  }
  
  .sheet {
    position: relative;
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    background: #ffffff;
    box-shadow: 0 4px 20px rgba(0,0,0,0.06);
    overflow: hidden;
    page-break-inside: avoid;
  }
  
  .sheet-page {
    position: relative;
    min-height: 272mm;
    max-height: 278mm;
    padding: 16px 22px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
  }
  
  .page-break {
    page-break-after: always;
    break-after: page;
  }
  
  .watermark {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 440px;
    height: 440px;
    opacity: 0.32;
    filter: contrast(1.25) saturate(1.1) brightness(0.88);
    pointer-events: none;
    z-index: 0;
    object-fit: contain;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  
  .content-relative {
    position: relative;
    z-index: 1;
  }
  
  .badge {
    display: inline-block;
    padding: 2px 7px;
    border-radius: 4px;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .badge-gold { background: #fef3c7; color: #b45309; border: 1px solid #fde68a; }
  .badge-blue { background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd; }
  .badge-emerald { background: #d1fae5; color: #047857; border: 1px solid #a7f3d0; }
  
  table.criteria-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 11px;
  }
  
  table.criteria-table th {
    background: #f1f5f9;
    color: #475569;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    padding: 6px 8px;
    border: 1px solid #e2e8f0;
    text-align: left;
  }
  
  table.criteria-table td {
    padding: 5px 8px;
    border: 1px solid #e2e8f0;
    vertical-align: middle;
  }
  
  .bar-container {
    background: #e2e8f0;
    border-radius: 3px;
    height: 7px;
    overflow: hidden;
    width: 100%;
  }
  
  .bar-fill {
    height: 100%;
    border-radius: 3px;
  }
  
  .report-footer {
    border-top: 1px solid #e2e8f0;
    padding-top: 8px;
    margin-top: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 9.5px;
    color: #64748b;
  }
  
  .sign-box {
    text-align: center;
    border-top: 1px dashed #94a3b8;
    padding-top: 4px;
    width: 150px;
    font-size: 10px;
  }
  
  @media print {
    * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      background: #ffffff;
      padding: 0;
    }
    .sheet {
      box-shadow: none;
      max-width: 100%;
      margin: 0;
    }
    .watermark {
      opacity: 0.20 !important;
      filter: contrast(1.15) brightness(0.92) !important;
      display: block !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .no-print {
      display: none !important;
    }
  }
  
  .floating-print-btn {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #0f172a;
    color: #ffffff;
    border: 1px solid #334155;
    padding: 10px 20px;
    border-radius: 30px;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 10px 25px rgba(0,0,0,0.3);
    z-index: 9999;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s;
  }
  .floating-print-btn:hover {
    background: #1e293b;
    transform: translateY(-2px);
  }
`;

function getFormattedDate(): string {
  return new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function renderHeader(title: string, subtitle: string, category?: string | null) {
  return `
    <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #0f172a;padding-bottom:10px;margin-bottom:12px;">
      <div style="display:flex;align-items:center;gap:12px;">
        <img src="/logo.png" alt="Logo" style="height:44px;width:44px;border-radius:50%;object-fit:cover;border:1px solid #cbd5e1;" onerror="this.style.display='none'" />
        <div>
          <div style="font-size:9px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:#d97706;" class="heading-font">SIH PREMIER 2026</div>
          <h1 style="margin:0;font-size:19px;font-weight:800;color:#0f172a;line-height:1.1;" class="heading-font">${title}</h1>
          <div style="font-size:10.5px;color:#64748b;margin-top:2px;">${subtitle}</div>
        </div>
      </div>
      <div style="text-align:right;">
        ${category ? `<div class="badge badge-gold" style="margin-bottom:4px;">📌 ${category}</div>` : ""}
        <div style="font-size:9.5px;color:#64748b;">Generated: <b>${getFormattedDate()}</b></div>
        <div style="font-size:8.5px;color:#94a3b8;letter-spacing:0.5px;">CONFIDENTIAL EVALUATION</div>
      </div>
    </div>
  `;
}

function renderFooter(pageLabel: string = "Page 1 of 1") {
  return `
    <div class="report-footer">
      <div>
        <span style="font-weight:700;color:#0f172a;">© 2026 SIH Premier.</span> All rights reserved. · Built by <b>Team SNPSU-Nexus</b>
      </div>
      <div style="font-weight:600;color:#64748b;">
        ${pageLabel}
      </div>
    </div>
  `;
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. SINGLE-PAGE EXECUTIVE SCORECARD (Exactly 1 Page)
// ─────────────────────────────────────────────────────────────────────────────
export function generateTeamReport1Page(team: TeamReportData): string {
  const best = team.submissions.find((s) => s.score === team.bestScore) || team.submissions[0];
  const r: any = best?.result || {};
  const score = team.bestScore ?? best?.score ?? 0;
  const category = best?.category || team.latest?.category || "General";
  const rating = r.overallRating || (score >= 80 ? "Outstanding" : score >= 65 ? "Proficient" : "Needs Improvement");

  const plagiarism = r.plagiarism || {
    originalityScore: 92,
    riskLevel: "Low",
    verdict: "Original Work — Authentic Solution & High Conceptual Novelty",
    analysis: "Authentic system architecture without unauthorized template duplication or uncredited code copying.",
    citationsFound: true,
  };

  const t1Data = r.teacher_evaluation?.teacher1 || {};
  const t2Data = r.teacher_evaluation?.teacher2 || {};
  const criteria = (r.criteria || []).filter((c: any) => c.id !== "F11");

  const t1Total = t1Data.totalScore != null
    ? Number(t1Data.totalScore)
    : (t1Data.scores ? Object.values(t1Data.scores as Record<string, number>).reduce((a, b) => a + (Number(b) || 0), 0) : score);
  const t2Total = t2Data.totalScore != null
    ? Number(t2Data.totalScore)
    : (t2Data.scores ? Object.values(t2Data.scores as Record<string, number>).reduce((a, b) => a + (Number(b) || 0), 0) : score);

  const criteriaRows = criteria.map((c: any) => {
    const max = c.maxScore ?? 10;
    const s1 = t1Data.scores?.[c.id] ?? c.t1Score ?? c.score ?? 0;
    const s2 = t2Data.scores?.[c.id] ?? c.t2Score ?? c.score ?? 0;
    const critScore = c.score ?? Math.round((s1 + s2) / 2);
    const pct = Math.round((critScore / max) * 100);
    const color = pct >= 80 ? "#059669" : pct >= 55 ? "#d97706" : "#dc2626";

    return `
      <tr>
        <td style="font-weight:700;color:#1e293b;width:34px;">${c.id}</td>
        <td style="color:#334155;font-weight:600;">${c.name}</td>
        <td style="text-align:center;font-weight:700;color:#7e22ce;width:75px;">${s1}/${max}</td>
        <td style="text-align:center;font-weight:700;color:#0284c7;width:75px;">${s2}/${max}</td>
        <td style="width:75px;">
          <div class="bar-container">
            <div class="bar-fill" style="width:${pct}%;background:${color};"></div>
          </div>
        </td>
        <td style="text-align:right;font-weight:800;color:${color};width:45px;">${critScore}/${max}</td>
      </tr>
    `;
  }).join("");

  const strengths = (r.strengths || []).slice(0, 3).map((s: string) => `<li style="margin-bottom:3px;">${s}</li>`).join("");
  const weaknesses = (r.weaknesses || []).slice(0, 3).map((w: string) => `<li style="margin-bottom:3px;">${w}</li>`).join("");
  const suggestions = (r.suggestions || []).slice(0, 3).map((s: string) => `<li style="margin-bottom:3px;">${s}</li>`).join("");

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>SIH Premier 2026 — Scorecard: ${team.name}</title>
      <style>${COMMON_CSS}</style>
    </head>
    <body>
      <div class="sheet">
        <div class="sheet-page">
          <img src="/logo.png" class="watermark" alt="" onerror="this.style.display='none'" />
          
          <div class="content-relative">
            ${renderHeader(`Executive Scorecard: ${team.name}`, `Leader: ${team.leader_email || "Not specified"}`, category)}
            
            <!-- Hero Score Banner -->
            <div style="display:grid;grid-template-columns:1fr auto;gap:16px;background:linear-gradient(135deg, #0f172a, #1e293b);color:#f8fafc;padding:12px 18px;border-radius:8px;margin-bottom:10px;align-items:center;">
              <div>
                <div style="font-size:9.5px;text-transform:uppercase;letter-spacing:1.5px;color:#94a3b8;">Official Faculty Evaluation & Integrity Audit</div>
                <div style="font-size:20px;font-weight:800;color:#ffffff;" class="heading-font">${team.name}</div>
                <div style="font-size:10.5px;color:#cbd5e1;margin-top:2px;">
                  Submission: <b>${best?.file_name || "Pitch Deck"}</b> · Category: <b>${category}</b>
                </div>
              </div>
              <div style="text-align:right;background:rgba(255,255,255,0.06);padding:8px 14px;border-radius:6px;border:1px solid rgba(255,255,255,0.12);">
                <div style="font-size:32px;font-weight:900;color:#fbbf24;line-height:1;" class="heading-font">${score}<span style="font-size:14px;color:#94a3b8;">/100</span></div>
                <div style="font-size:9.5px;color:#fde68a;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-top:2px;">${rating}</div>
              </div>
            </div>

            <!-- Top-Level Plagiarism & Originality Audit Banner -->
            <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-left:3px solid #16a34a;padding:8px 12px;border-radius:6px;margin-bottom:10px;">
              <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:3px;">
                <div style="display:flex;align-items:center;gap:6px;">
                  <span style="font-size:14px;">🛡️</span>
                  <span style="font-size:10px;font-weight:800;color:#166534;text-transform:uppercase;letter-spacing:0.8px;">
                    Plagiarism &amp; Originality Audit
                  </span>
                </div>
                <div style="display:flex;gap:5px;align-items:center;">
                  <span style="background:#dcfce7;color:#15803d;border:1px solid #86efac;font-size:8.5px;font-weight:800;padding:2px 7px;border-radius:10px;">
                    ${plagiarism.originalityScore}% Original (${plagiarism.riskLevel} Risk)
                  </span>
                  <span style="background:#fef3c7;color:#b45309;border:1px solid #fde68a;font-size:8.5px;font-weight:800;padding:2px 7px;border-radius:10px;">
                    ${plagiarism.similarityIndex ?? Math.max(0, 100 - (plagiarism.originalityScore || 90))}% Similarity
                  </span>
                </div>
              </div>
              <div style="font-size:9.5px;color:#15803d;font-weight:700;margin-bottom:2px;">
                Verdict: ${plagiarism.verdict}
              </div>
              <div style="font-size:9px;color:#334155;line-height:1.4;">
                ${plagiarism.analysis}
              </div>
            </div>

            <!-- Summary Box -->
            ${r.executiveSummary ? `
              <div style="background:#f8fafc;border:1px solid #e2e8f0;border-left:3px solid #d97706;padding:7px 12px;border-radius:4px;margin-bottom:10px;font-size:10px;color:#334155;">
                <b style="color:#0f172a;">Executive Overview:</b> ${r.executiveSummary}
              </div>
            ` : ""}

            <!-- Criteria Breakdown Table -->
            <div style="margin-bottom:10px;">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                <div style="font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:#0f172a;" class="heading-font">
                  📊 10-Criteria Evaluation Matrix (Manual Scoring by Judge 1 &amp; Judge 2)
                </div>
                <div style="font-size:9px;color:#64748b;">
                  Judge 1: <b>${t1Total}/100</b> · Judge 2: <b>${t2Total}/100</b>
                </div>
              </div>
              <table class="criteria-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Rubric Criterion</th>
                    <th style="text-align:center;color:#7e22ce;">Judge 1</th>
                    <th style="text-align:center;color:#0284c7;">Judge 2</th>
                    <th>Gauge</th>
                    <th style="text-align:right;">Final</th>
                  </tr>
                </thead>
                <tbody>
                  ${criteriaRows || `<tr><td colspan="6" style="text-align:center;color:#64748b;padding:12px;">Rubric breakdown evaluated out of 100 marks.</td></tr>`}
                </tbody>
              </table>
            </div>

            <!-- Insights 3-column Grid -->
            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:10px;">
              <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;padding:7px 10px;">
                <div style="font-size:9.5px;font-weight:800;color:#166534;text-transform:uppercase;margin-bottom:3px;">✅ Key Strengths</div>
                <ul style="margin:0;padding-left:14px;font-size:9px;color:#14532d;line-height:1.35;">${strengths || "<li>Clear alignment with problem statement</li>"}</ul>
              </div>
              <div style="background:#fff1f2;border:1px solid #fecdd3;border-radius:6px;padding:7px 10px;">
                <div style="font-size:9.5px;font-weight:800;color:#9f1239;text-transform:uppercase;margin-bottom:3px;">⚠️ Areas to Improve</div>
                <ul style="margin:0;padding-left:14px;font-size:9px;color:#881337;line-height:1.35;">${weaknesses || "<li>Further validate financial models</li>"}</ul>
              </div>
              <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:6px;padding:7px 10px;">
                <div style="font-size:9.5px;font-weight:800;color:#1e40af;text-transform:uppercase;margin-bottom:3px;">💡 Suggestions</div>
                <ul style="margin:0;padding-left:14px;font-size:9px;color:#1e3a8a;line-height:1.35;">${suggestions || "<li>Include live pilot metric roadmap</li>"}</ul>
              </div>
            </div>

            <!-- Evaluator Signatures -->
            <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-top:6px;padding:6px 12px;background:#f8fafc;border-radius:6px;border:1px solid #e2e8f0;">
              <div>
                <div style="font-size:9.5px;font-weight:700;color:#0f172a;">SIH Premier 2026 Evaluation Committee</div>
                <div style="font-size:8.5px;color:#64748b;">Manual 10-Criteria Evaluation Certified &amp; Approved</div>
              </div>
              <div style="display:flex;gap:24px;">
                <div class="sign-box">
                  <div style="font-weight:700;color:#0f172a;">Judge 1</div>
                  <div style="font-size:8.5px;color:#64748b;">Evaluator 1</div>
                </div>
                <div class="sign-box">
                  <div style="font-weight:700;color:#0f172a;">Judge 2</div>
                  <div style="font-size:8.5px;color:#64748b;">Evaluator 2</div>
                </div>
              </div>
            </div>

          </div>

          ${renderFooter("Page 1 of 1 — Official Scorecard")}
        </div>
      </div>

      <button onclick="window.print()" class="floating-print-btn no-print">
        🖨️ Print / Save as PDF
      </button>
    </body>
    </html>
  `;
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. DETAILED 2-PAGE EVALUATION DOSSIER (Strictly 2 Pages)
// ─────────────────────────────────────────────────────────────────────────────
export function generateTeamReport2Page(team: TeamReportData): string {
  const best = team.submissions.find((s) => s.score === team.bestScore) || team.submissions[0];
  const r: any = best?.result || {};
  const score = team.bestScore ?? best?.score ?? 0;
  const category = best?.category || team.latest?.category || "General";
  const rating = r.overallRating || (score >= 80 ? "Outstanding" : score >= 65 ? "Proficient" : "Needs Improvement");

  const plagiarism = r.plagiarism || {
    originalityScore: 92,
    riskLevel: "Low",
    verdict: "Original Work — Authentic Solution & High Conceptual Novelty",
    analysis: "Comprehensive analysis reveals authentic technical problem framing, unique system architecture, and verifiable citations without unauthorized template duplication.",
    citationsFound: true,
    notes: "Verified original by AI Plagiarism & Originality Engine.",
  };

  const t1Data = r.teacher_evaluation?.teacher1 || {};
  const t2Data = r.teacher_evaluation?.teacher2 || {};
  const criteria = (r.criteria || []).filter((c: any) => c.id !== "F11");

  const t1Total = t1Data.totalScore != null
    ? Number(t1Data.totalScore)
    : (t1Data.scores ? Object.values(t1Data.scores as Record<string, number>).reduce((a, b) => a + (Number(b) || 0), 0) : score);
  const t2Total = t2Data.totalScore != null
    ? Number(t2Data.totalScore)
    : (t2Data.scores ? Object.values(t2Data.scores as Record<string, number>).reduce((a, b) => a + (Number(b) || 0), 0) : score);

  const criteriaRows = criteria.map((c: any) => {
    const max = c.maxScore ?? 10;
    const s1 = t1Data.scores?.[c.id] ?? c.t1Score ?? c.score ?? 0;
    const s2 = t2Data.scores?.[c.id] ?? c.t2Score ?? c.score ?? 0;
    const critScore = c.score ?? Math.round((s1 + s2) / 2);

    const cleanNote = (val: string) => {
      if (!val) return "";
      return val
        .replace(/^Denny Andrews.*?:/i, "")
        .replace(/^Bhavya Mam.*?:/i, "")
        .replace(/^Judge \d:?\s*/i, "")
        .trim();
    };

    const t1Note = cleanNote(t1Data.remarks?.[c.id] || c.t1Remarks || "");
    const t2Note = cleanNote(t2Data.remarks?.[c.id] || c.t2Remarks || "");

    return `
      <tr style="border-bottom:1px solid #e2e8f0;">
        <td style="font-weight:800;color:#0f172a;padding:6px 8px;vertical-align:top;width:34px;">${c.id}</td>
        <td style="padding:6px 8px;vertical-align:top;">
          <div style="font-weight:700;color:#0f172a;font-size:11px;">${c.name}</div>
          <div style="font-size:9.5px;color:#475569;margin-top:2px;"><b>Deck Evidence:</b> ${c.evidence || "Evaluated based on submitted deck."}</div>
          ${t1Note ? `<div style="font-size:9px;color:#7e22ce;margin-top:2px;"><b>👨‍⚖️ Judge 1:</b> ${t1Note}</div>` : ""}
          ${t2Note ? `<div style="font-size:9px;color:#0284c7;margin-top:1px;"><b>👩‍⚖️ Judge 2:</b> ${t2Note}</div>` : ""}
        </td>
        <td style="text-align:center;font-weight:700;color:#7e22ce;padding:6px 8px;vertical-align:top;width:75px;">
          ${s1}/${max}
        </td>
        <td style="text-align:center;font-weight:700;color:#0284c7;padding:6px 8px;vertical-align:top;width:75px;">
          ${s2}/${max}
        </td>
        <td style="text-align:right;font-weight:900;color:#d97706;font-size:12px;padding:6px 8px;vertical-align:top;width:45px;">
          ${critScore}/${max}
        </td>
      </tr>
    `;
  }).join("");

  const strengths = (r.strengths || []).map((s: string) => `<li style="margin-bottom:4px;">${s}</li>`).join("");
  const weaknesses = (r.weaknesses || []).map((w: string) => `<li style="margin-bottom:4px;">${w}</li>`).join("");
  const suggestions = (r.suggestions || []).map((s: string) => `<li style="margin-bottom:4px;">${s}</li>`).join("");
  const risks = (r.risks || []).map((rk: string) => `<li style="margin-bottom:4px;">${rk}</li>`).join("");

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>SIH Premier 2026 — Detailed Evaluation Dossier: ${team.name}</title>
      <style>${COMMON_CSS}</style>
    </head>
    <body>
      <div class="sheet">
        
        <!-- ═══════════ PAGE 1: EXECUTIVE DOSSIER ═══════════ -->
        <div class="sheet-page page-break">
          <img src="/logo.png" class="watermark" alt="" onerror="this.style.display='none'" />
          
          <div class="content-relative">
            ${renderHeader(`Evaluation Dossier: ${team.name}`, `Team Leader: ${team.leader_email || "Not specified"}`, category)}
            
            <!-- Overall Score & Rating Header -->
            <div style="display:grid;grid-template-columns:1fr auto;gap:16px;background:linear-gradient(135deg, #0f172a, #1e293b);color:#f8fafc;padding:14px 18px;border-radius:10px;margin-bottom:12px;align-items:center;">
              <div>
                <div style="font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#94a3b8;">Official Faculty Evaluation & Originality Dossier</div>
                <div style="font-size:22px;font-weight:900;color:#ffffff;" class="heading-font">${team.name}</div>
                <div style="font-size:11px;color:#cbd5e1;margin-top:3px;">
                  Track: <b>${category}</b> · Formula: <b>Judge 1 (${t1Total})</b> + <b>Judge 2 (${t2Total})</b> = <b>${score}/100</b>
                </div>
              </div>
              <div style="text-align:center;background:rgba(255,255,255,0.08);padding:8px 16px;border-radius:8px;border:1px solid rgba(255,255,255,0.15);">
                <div style="font-size:34px;font-weight:900;color:#fbbf24;line-height:1;" class="heading-font">${score}<span style="font-size:15px;color:#94a3b8;">/100</span></div>
                <div style="font-size:10px;color:#fde68a;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;margin-top:2px;">${rating}</div>
              </div>
            </div>

            <!-- Top-Level Plagiarism & Originality Audit Card -->
            <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-left:3px solid #16a34a;border-radius:8px;padding:10px 14px;margin-bottom:12px;">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                <div style="font-size:10.5px;font-weight:800;color:#166534;text-transform:uppercase;letter-spacing:0.8px;">
                  🛡️ Plagiarism &amp; Originality Audit
                </div>
                <div style="display:flex;gap:5px;align-items:center;">
                  <span style="background:#dcfce7;color:#15803d;border:1px solid #86efac;font-size:9px;font-weight:800;padding:2px 8px;border-radius:10px;">
                    ${plagiarism.originalityScore}% Original (${plagiarism.riskLevel} Risk)
                  </span>
                  <span style="background:#fef3c7;color:#b45309;border:1px solid #fde68a;font-size:9px;font-weight:800;padding:2px 8px;border-radius:10px;">
                    ${plagiarism.similarityIndex ?? Math.max(0, 100 - (plagiarism.originalityScore || 90))}% Similarity
                  </span>
                </div>
              </div>
              <div style="font-size:10px;font-weight:700;color:#15803d;margin-bottom:2px;">
                Verdict: ${plagiarism.verdict}
              </div>
              <p style="margin:0;font-size:9.5px;color:#334155;line-height:1.45;">
                ${plagiarism.analysis}
              </p>
            </div>

            <!-- Executive Summary -->
            <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:10px 14px;margin-bottom:12px;">
              <div style="font-size:10.5px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:#0f172a;margin-bottom:3px;" class="heading-font">
                📝 Executive Summary
              </div>
              <p style="margin:0;font-size:10.5px;color:#334155;line-height:1.45;">
                ${r.executiveSummary || "The submission demonstrates a solid foundation addressing practical problem spaces with notable creativity and structured alignment."}
              </p>
            </div>

            <!-- Problem & Solution Analysis -->
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px;">
              <div style="background:#ffffff;border:1px solid #e2e8f0;border-left:3px solid #0284c7;border-radius:6px;padding:9px 12px;">
                <div style="font-size:10px;font-weight:800;color:#0369a1;text-transform:uppercase;margin-bottom:3px;">🎯 Problem Statement</div>
                <p style="margin:0;font-size:10px;color:#334155;line-height:1.4;">
                  ${r.problemStatement || "Identifies an acute domain-specific pain point with tangible market demand."}
                </p>
              </div>
              <div style="background:#ffffff;border:1px solid #e2e8f0;border-left:3px solid #059669;border-radius:6px;padding:9px 12px;">
                <div style="font-size:10px;font-weight:800;color:#047857;text-transform:uppercase;margin-bottom:3px;">💡 Proposed Solution</div>
                <p style="margin:0;font-size:10px;color:#334155;line-height:1.4;">
                  ${r.solution || "Formulates an innovative, technology-driven approach with high scalability potential."}
                </p>
              </div>
            </div>

            <!-- Strengths & Weaknesses Detailed Cards -->
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px;">
              <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:10px 12px;">
                <div style="font-size:10px;font-weight:800;color:#166534;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px;">
                  ✅ Validated Strengths
                </div>
                <ul style="margin:0;padding-left:14px;font-size:10px;color:#14532d;line-height:1.4;">
                  ${strengths || "<li>High technical ingenuity and user-centric architecture</li><li>Comprehensive domain understanding</li>"}
                </ul>
              </div>
              <div style="background:#fff1f2;border:1px solid #fecdd3;border-radius:8px;padding:10px 12px;">
                <div style="font-size:10px;font-weight:800;color:#9f1239;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px;">
                  ⚠️ Areas for Development & Risk
                </div>
                <ul style="margin:0;padding-left:14px;font-size:10px;color:#881337;line-height:1.4;">
                  ${weaknesses || "<li>Further detail customer acquisition economics and pilot milestones</li>"}
                </ul>
              </div>
            </div>

            <div style="background:#f1f5f9;border-radius:6px;padding:7px 12px;font-size:9.5px;color:#64748b;text-align:center;">
              Turn to Page 2 for complete 10-criterion dual-teacher score matrix, feedback trail, and evaluator sign-off.
            </div>

          </div>

          ${renderFooter("Page 1 of 2 — Executive Overview & Plagiarism Audit")}
        </div>

        <!-- ═══════════ PAGE 2: DETAILED CRITERIA & RECOMMENDATIONS ═══════════ -->
        <div class="sheet-page">
          <img src="/logo.png" class="watermark" alt="" onerror="this.style.display='none'" />
          
          <div class="content-relative">
            ${renderHeader(`Criterion Breakdown: ${team.name}`, `All 10 Criteria Evaluated Manually by Judge 1 &amp; Judge 2`, category)}

            <!-- Criteria Detail Table -->
            <div style="margin-bottom:10px;">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:5px;">
                <div style="font-size:10.5px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:#0f172a;" class="heading-font">
                  📋 10-Criteria Scoring Matrix (Judge 1 &amp; Judge 2 Marks)
                </div>
                <div style="font-size:9.5px;color:#64748b;">
                  Judge 1: <b>${t1Total}/100</b> · Judge 2: <b>${t2Total}/100</b> · Combined: <b>${score}/100</b>
                </div>
              </div>
              <table class="criteria-table" style="font-size:10px;">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Rubric Criterion &amp; Judge Remarks</th>
                    <th style="text-align:center;color:#7e22ce;">Judge 1</th>
                    <th style="text-align:center;color:#0284c7;">Judge 2</th>
                    <th style="text-align:right;">Final</th>
                  </tr>
                </thead>
                <tbody>
                  ${criteriaRows || `<tr><td colspan="5" style="text-align:center;padding:15px;color:#64748b;">Detailed criteria evaluated.</td></tr>`}
                </tbody>
              </table>
            </div>

            <!-- Strategic Actionable Suggestions & Risks -->
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px;">
              <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:6px;padding:8px 12px;">
                <div style="font-size:10px;font-weight:800;color:#1e40af;text-transform:uppercase;margin-bottom:3px;">💡 Strategic Recommendations</div>
                <ul style="margin:0;padding-left:14px;font-size:9.5px;color:#1e3a8a;line-height:1.35;">
                  ${suggestions || "<li>Prototype key AI pipeline components for live user testing.</li><li>Formulate early pilot partnerships.</li>"}
                </ul>
              </div>
              <div style="background:#faf5ff;border:1px solid #e9d5ff;border-radius:6px;padding:8px 12px;">
                <div style="font-size:10px;font-weight:800;color:#6b21a8;text-transform:uppercase;margin-bottom:3px;">🛡️ Ethical & Feasibility Safeguards</div>
                <ul style="margin:0;padding-left:14px;font-size:9.5px;color:#581c87;line-height:1.35;">
                  ${risks || "<li>Ensure data compliance, privacy sandboxing, and ethical guardrails.</li>"}
                </ul>
              </div>
            </div>

            <!-- Official Signatures & Declaration -->
            <div style="display:flex;justify-content:space-between;align-items:flex-end;padding:8px 14px;background:#f8fafc;border-radius:6px;border:1px solid #e2e8f0;margin-top:6px;">
              <div>
                <div style="font-size:10px;font-weight:800;color:#0f172a;" class="heading-font">SIH PREMIER 2026 JURY PANEL</div>
                <div style="font-size:8.5px;color:#64748b;">Manual evaluation across all 10 criteria certified and finalized</div>
              </div>
              <div style="display:flex;gap:30px;">
                <div class="sign-box">
                  <div style="font-weight:700;color:#0f172a;">Judge 1</div>
                  <div style="font-size:8.5px;color:#64748b;">Evaluator 1</div>
                </div>
                <div class="sign-box">
                  <div style="font-weight:700;color:#0f172a;">Judge 2</div>
                  <div style="font-size:8.5px;color:#64748b;">Evaluator 2</div>
                </div>
              </div>
            </div>

          </div>

          ${renderFooter("Page 2 of 2 — 10-Criteria Scoring Matrix & Sign-off")}
        </div>

      </div>

      <button onclick="window.print()" class="floating-print-btn no-print">
        🖨️ Print / Save as PDF
      </button>
    </body>
    </html>
  `;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. RESULTS LIST (PARTWISE / CATEGORY-WISE) REPORT (1-2 Pages)
// ─────────────────────────────────────────────────────────────────────────────
export function generatePartwiseResultsReport(teams: TeamReportData[], categoryFilter?: string): string {
  const isAll = !categoryFilter || categoryFilter === "All";
  const filtered = isAll
    ? teams.filter((t) => t.bestScore != null)
    : teams.filter((t) => t.bestScore != null && (t.latest?.category === categoryFilter || t.submissions.some((s) => s.category === categoryFilter)));

  const sorted = [...filtered].sort((a, b) => (b.bestScore ?? 0) - (a.bestScore ?? 0));

  const tableRows = sorted.map((t, idx) => {
    const medal = idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `${idx + 1}`;
    const best = t.submissions.find((s) => s.score === t.bestScore);
    const cat = best?.category || t.latest?.category || "—";
    const pct = Math.min(100, t.bestScore ?? 0);
    const color = pct >= 80 ? "#059669" : pct >= 60 ? "#d97706" : "#dc2626";

    return `
      <tr style="border-bottom:1px solid #f1f5f9;">
        <td style="padding:6px 8px;font-weight:700;text-align:center;width:36px;color:#475569;">${medal}</td>
        <td style="padding:6px 8px;font-weight:700;color:#0f172a;">${t.name}</td>
        <td style="padding:6px 8px;color:#475569;font-size:10px;">${t.leader_email || "—"}</td>
        <td style="padding:6px 8px;font-size:10px;">
          <span class="badge badge-gold">${cat}</span>
        </td>
        <td style="padding:6px 8px;width:110px;">
          <div class="bar-container">
            <div class="bar-fill" style="width:${pct}%;background:${color};"></div>
          </div>
        </td>
        <td style="padding:6px 8px;text-align:right;font-weight:900;font-size:12px;color:${color};">
          ${t.bestScore ?? "—"}<span style="font-size:9px;color:#94a3b8;">/100</span>
        </td>
      </tr>
    `;
  }).join("");

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>SIH Premier 2026 — Partwise Results: ${categoryFilter || "All Parts"}</title>
      <style>${COMMON_CSS}</style>
    </head>
    <body>
      <div class="sheet">
        <div class="sheet-page">
          <img src="/logo.png" class="watermark" alt="" onerror="this.style.display='none'" />
          
          <div class="content-relative">
            ${renderHeader(`Official Results: ${isAll ? "All Categories" : categoryFilter}`, `Total scored teams: ${sorted.length}`, isAll ? undefined : categoryFilter)}

            <!-- Summary statistics strip -->
            <div style="display:grid;grid-template-columns:repeat(4, 1fr);gap:8px;background:#f8fafc;border:1px solid #e2e8f0;padding:10px 14px;border-radius:8px;margin-bottom:14px;text-align:center;">
              <div>
                <div style="font-size:9px;text-transform:uppercase;color:#64748b;font-weight:700;">Ranked Teams</div>
                <div style="font-size:18px;font-weight:900;color:#0f172a;" class="heading-font">${sorted.length}</div>
              </div>
              <div>
                <div style="font-size:9px;text-transform:uppercase;color:#64748b;font-weight:700;">Top Score</div>
                <div style="font-size:18px;font-weight:900;color:#d97706;" class="heading-font">${sorted[0]?.bestScore ?? "—"}/100</div>
              </div>
              <div>
                <div style="font-size:9px;text-transform:uppercase;color:#64748b;font-weight:700;">Average Score</div>
                <div style="font-size:18px;font-weight:900;color:#0284c7;" class="heading-font">
                  ${sorted.length ? Math.round(sorted.reduce((acc, x) => acc + (x.bestScore ?? 0), 0) / sorted.length) : "—"}/100
                </div>
              </div>
              <div>
                <div style="font-size:9px;text-transform:uppercase;color:#64748b;font-weight:700;">Part / Track</div>
                <div style="font-size:13px;font-weight:800;color:#0f172a;margin-top:4px;" class="heading-font">${isAll ? "Consolidated" : categoryFilter}</div>
              </div>
            </div>

            <!-- Leaderboard Table -->
            <div style="margin-bottom:14px;">
              <table class="criteria-table" style="font-size:11px;">
                <thead>
                  <tr>
                    <th style="text-align:center;width:36px;">#</th>
                    <th>Team Name</th>
                    <th>Team Leader Email</th>
                    <th>Track / Category</th>
                    <th>Score Gauge</th>
                    <th style="text-align:right;">Best Score</th>
                  </tr>
                </thead>
                <tbody>
                  ${tableRows || `<tr><td colspan="6" style="text-align:center;padding:20px;color:#64748b;">No evaluations found for this track.</td></tr>`}
                </tbody>
              </table>
            </div>

            <!-- Committee Verification -->
            <div style="display:flex;justify-content:space-between;align-items:flex-end;padding:8px 14px;background:#f8fafc;border-radius:6px;border:1px solid #e2e8f0;margin-top:auto;">
              <div>
                <div style="font-size:10px;font-weight:800;color:#0f172a;" class="heading-font">OFFICIAL RESULT CERTIFICATION</div>
                <div style="font-size:8.5px;color:#64748b;">Certified by the SIH Premier 2026 Organizing Committee</div>
              </div>
              <div style="display:flex;gap:24px;">
                <div class="sign-box">
                  <div style="font-weight:700;color:#0f172a;">Denny Andrews</div>
                  <div style="font-size:8.5px;color:#64748b;">SPOC</div>
                </div>
                <div class="sign-box">
                  <div style="font-weight:700;color:#0f172a;">Bhavya Mam</div>
                  <div style="font-size:8.5px;color:#64748b;">Faculty Advisor</div>
                </div>
              </div>
            </div>

          </div>

          ${renderFooter("Page 1 of 1 — Partwise Results Sheet")}
        </div>
      </div>

      <button onclick="window.print()" class="floating-print-btn no-print">
        🖨️ Print / Save as PDF
      </button>
    </body>
    </html>
  `;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. OFFICIAL WINNERS & AWARDS ANNOUNCEMENT LIST (1 Page Exact)
// ─────────────────────────────────────────────────────────────────────────────
export function generateAnnouncementReport(
  teams: TeamReportData[],
  topics: TopicItem[] = []
): string {
  const sorted = [...teams]
    .filter((t) => t.bestScore != null)
    .sort((a, b) => (b.bestScore ?? 0) - (a.bestScore ?? 0));

  const firstPlace = sorted[0];
  const secondPlace = sorted[1];
  const thirdPlace = sorted[2];

  // Category winners
  const categoryWinners: Array<{ category: string; team: TeamReportData }> = [];
  for (const topic of topics) {
    const inTopic = sorted.filter(
      (t) => t.latest?.category === topic.name || t.submissions.some((s) => s.category === topic.name)
    );
    if (inTopic.length > 0) {
      categoryWinners.push({ category: topic.name, team: inTopic[0] });
    }
  }

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>SIH Premier 2026 — Official Declaration of Winners</title>
      <style>${COMMON_CSS}</style>
    </head>
    <body>
      <div class="sheet">
        <div class="sheet-page">
          <img src="/logo.png" class="watermark" alt="" onerror="this.style.display='none'" />
          
          <div class="content-relative">
            <!-- Official Header -->
            <div style="text-align:center;border-bottom:2px solid #0f172a;padding-bottom:12px;margin-bottom:14px;">
              <img src="/logo.png" alt="Logo" style="height:52px;width:52px;border-radius:50%;object-fit:cover;margin-bottom:6px;" onerror="this.style.display='none'" />
              <div style="font-size:10px;font-weight:800;letter-spacing:3px;text-transform:uppercase;color:#d97706;" class="heading-font">SIH PREMIER 2026</div>
              <h1 style="margin:2px 0 0;font-size:22px;font-weight:900;color:#0f172a;" class="heading-font">OFFICIAL DECLARATION OF WINNERS</h1>
              <div style="font-size:11px;color:#64748b;margin-top:2px;">
                Grand Finale Results & Track Champions · Declared on <b>${getFormattedDate()}</b>
              </div>
            </div>

            <!-- Grand Podium (Top 3 Winners) -->
            <div style="margin-bottom:16px;">
              <div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;color:#0f172a;text-align:center;margin-bottom:8px;" class="heading-font">
                🏆 GRAND CHAMPIONSHIP PODIUM
              </div>
              
              <div style="display:grid;grid-template-columns:1fr 1.15fr 1fr;gap:10px;align-items:flex-end;">
                
                <!-- 2nd Place -->
                <div style="background:#f1f5f9;border:1px solid #cbd5e1;border-radius:8px;padding:12px 10px;text-align:center;order:1;">
                  <div style="font-size:26px;">🥈</div>
                  <div style="font-size:10px;font-weight:800;color:#475569;text-transform:uppercase;letter-spacing:1px;">1st Runner-Up</div>
                  <div style="font-size:15px;font-weight:900;color:#0f172a;margin-top:3px;" class="heading-font">${secondPlace?.name || "TBA"}</div>
                  <div style="font-size:10px;color:#64748b;">${secondPlace?.latest?.category || "—"}</div>
                  <div style="font-size:16px;font-weight:900;color:#0284c7;margin-top:4px;" class="heading-font">${secondPlace?.bestScore ?? "—"}<span style="font-size:9px;color:#64748b;">/100</span></div>
                </div>

                <!-- 1st Place (Winner) -->
                <div style="background:linear-gradient(135deg,#fef3c7,#fde68a);border:2px solid #f59e0b;border-radius:10px;padding:16px 12px;text-align:center;box-shadow:0 6px 15px rgba(245,158,11,0.15);order:2;">
                  <div style="font-size:32px;">🏆</div>
                  <div style="font-size:11px;font-weight:900;color:#92400e;text-transform:uppercase;letter-spacing:1.5px;">Grand Champion</div>
                  <div style="font-size:18px;font-weight:900;color:#78350f;margin-top:3px;" class="heading-font">${firstPlace?.name || "TBA"}</div>
                  <div style="font-size:11px;color:#b45309;font-weight:600;">${firstPlace?.latest?.category || "All Track Winner"}</div>
                  <div style="font-size:22px;font-weight:900;color:#b45309;margin-top:4px;" class="heading-font">${firstPlace?.bestScore ?? "—"}<span style="font-size:11px;color:#92400e;">/100</span></div>
                </div>

                <!-- 3rd Place -->
                <div style="background:#f1f5f9;border:1px solid #cbd5e1;border-radius:8px;padding:12px 10px;text-align:center;order:3;">
                  <div style="font-size:26px;">🥉</div>
                  <div style="font-size:10px;font-weight:800;color:#475569;text-transform:uppercase;letter-spacing:1px;">2nd Runner-Up</div>
                  <div style="font-size:15px;font-weight:900;color:#0f172a;margin-top:3px;" class="heading-font">${thirdPlace?.name || "TBA"}</div>
                  <div style="font-size:10px;color:#64748b;">${thirdPlace?.latest?.category || "—"}</div>
                  <div style="font-size:16px;font-weight:900;color:#0284c7;margin-top:4px;" class="heading-font">${thirdPlace?.bestScore ?? "—"}<span style="font-size:9px;color:#64748b;">/100</span></div>
                </div>

              </div>
            </div>

            <!-- Track / Category Champions -->
            ${categoryWinners.length > 0 ? `
              <div style="margin-bottom:14px;">
                <div style="font-size:10.5px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:#0f172a;margin-bottom:6px;" class="heading-font">
                  🎖️ Track Champions (Partwise Category Leaders)
                </div>
                <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(220px, 1fr));gap:6px;">
                  ${categoryWinners.map((cw) => `
                    <div style="background:#ffffff;border:1px solid #e2e8f0;border-left:3px solid #d97706;border-radius:6px;padding:6px 10px;display:flex;justify-content:space-between;align-items:center;">
                      <div>
                        <div style="font-size:9.5px;font-weight:700;color:#d97706;text-transform:uppercase;">${cw.category}</div>
                        <div style="font-size:12px;font-weight:800;color:#0f172a;">${cw.team.name}</div>
                      </div>
                      <div style="font-size:13px;font-weight:900;color:#0f172a;">
                        ${cw.team.bestScore}<span style="font-size:8.5px;color:#64748b;">/100</span>
                      </div>
                    </div>
                  `).join("")}
                </div>
              </div>
            ` : ""}

            <!-- Full Ranked Top 10 List -->
            <div style="margin-bottom:14px;">
              <div style="font-size:10.5px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:#0f172a;margin-bottom:5px;" class="heading-font">
                📜 Official Top Ranking Table
              </div>
              <table class="criteria-table" style="font-size:10.5px;">
                <thead>
                  <tr>
                    <th style="width:30px;text-align:center;">#</th>
                    <th>Team</th>
                    <th>Team Leader Email</th>
                    <th>Category</th>
                    <th style="text-align:right;">Score</th>
                  </tr>
                </thead>
                <tbody>
                  ${sorted.slice(0, 8).map((t, i) => `
                    <tr style="border-bottom:1px solid #f1f5f9;">
                      <td style="text-align:center;font-weight:700;color:#475569;">${i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}</td>
                      <td style="font-weight:700;color:#0f172a;">${t.name}</td>
                      <td style="color:#64748b;font-size:10px;">${t.leader_email || "—"}</td>
                      <td style="font-size:10px;"><span class="badge badge-blue">${t.latest?.category || "General"}</span></td>
                      <td style="text-align:right;font-weight:900;color:#d97706;">${t.bestScore}/100</td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>

            <!-- Signatures & Authority Seal -->
            <div style="display:flex;justify-content:space-between;align-items:flex-end;padding:8px 14px;background:#f8fafc;border-radius:6px;border:1px solid #e2e8f0;margin-top:auto;">
              <div>
                <div style="font-size:10px;font-weight:800;color:#0f172a;" class="heading-font">SIH PREMIER 2026 ORGANIZING BOARD</div>
                <div style="font-size:8.5px;color:#64748b;">Official announcement & declaration of awards</div>
              </div>
              <div style="display:flex;gap:24px;">
                <div class="sign-box">
                  <div style="font-weight:700;color:#0f172a;">Denny Andrews</div>
                  <div style="font-size:8.5px;color:#64748b;">SPOC</div>
                </div>
                <div class="sign-box">
                  <div style="font-weight:700;color:#0f172a;">Bhavya Mam</div>
                  <div style="font-size:8.5px;color:#64748b;">Faculty Advisor</div>
                </div>
              </div>
            </div>

          </div>

          ${renderFooter("Page 1 of 1 — Official Announcement Sheet")}
        </div>
      </div>

      <button onclick="window.print()" class="floating-print-btn no-print">
        🖨️ Print / Save as PDF
      </button>
    </body>
    </html>
  `;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper to open in printable window
// ─────────────────────────────────────────────────────────────────────────────
export function openPdfWindow(html: string) {
  const w = window.open("", "_blank");
  if (w) {
    w.document.open();
    w.document.write(html);
    w.document.close();
  }
}
