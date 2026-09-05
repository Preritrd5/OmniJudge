import { i as __toESM } from "../_runtime.mjs";
import { g as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_react, i as require_jsx_runtime, n as useQuery, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { a as getPdfUrl, c as listTeams, d as saveCriteria, f as saveManualScores, g as useServerFn, i as getCriteria, m as updateTeamLeaderEmail, n as deleteSubmission, p as saveTopics, r as deleteTeam, s as getTopics, t as buildFeedbackEmail, u as renameTeam } from "./admin.functions-CAvNtq9P.mjs";
import { t as supabase } from "./client-B868cuT8.mjs";
import { t as ChromeScene } from "./ChromeScene-CItl2LoK.mjs";
import { n as ThemeToggle, t as Footer } from "./Footer-BkcUUiWU.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-CzkGyJ1N.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var COMMON_CSS = `
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
    width: 320px;
    height: 320px;
    opacity: 0.045;
    pointer-events: none;
    z-index: 0;
    object-fit: contain;
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
    body {
      background: #ffffff;
      padding: 0;
    }
    .sheet {
      box-shadow: none;
      max-width: 100%;
      margin: 0;
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
function getFormattedDate() {
	return (/* @__PURE__ */ new Date()).toLocaleDateString("en-IN", {
		day: "numeric",
		month: "short",
		year: "numeric"
	});
}
function renderHeader(title, subtitle, category) {
	return `
    <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #0f172a;padding-bottom:10px;margin-bottom:12px;">
      <div style="display:flex;align-items:center;gap:12px;">
        <img src="/logo.png" alt="Logo" style="height:44px;width:44px;border-radius:50%;object-fit:cover;border:1px solid #cbd5e1;" onerror="this.style.display='none'" />
        <div>
          <div style="font-size:9px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:#d97706;" class="heading-font">IDEATHON 2026</div>
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
function renderFooter(pageLabel = "Page 1 of 1") {
	return `
    <div class="report-footer">
      <div>
        <span style="font-weight:700;color:#0f172a;">© 2026 Ideathon.</span> All rights reserved. · Built by <b>Team SNPSU-Nexus</b>
      </div>
      <div style="text-align:center;color:#475569;font-size:9px;">
        Guided by <b>Denny Sir</b> & <b>Bhavya Mam</b>
      </div>
      <div style="font-weight:600;color:#64748b;">
        ${pageLabel}
      </div>
    </div>
  `;
}
function generateTeamReport1Page(team) {
	const best = team.submissions.find((s) => s.score === team.bestScore) || team.submissions[0];
	const r = best?.result || {};
	const score = team.bestScore ?? best?.score ?? 0;
	const category = best?.category || team.latest?.category || "General";
	const rating = r.overallRating || (score >= 80 ? "Outstanding" : score >= 65 ? "Proficient" : "Needs Improvement");
	const criteriaRows = (r.criteria || []).slice(0, 10).map((c) => {
		const max = c.maxScore ?? 10;
		const pct = Math.round(c.score / max * 100);
		const color = pct >= 80 ? "#059669" : pct >= 55 ? "#d97706" : "#dc2626";
		const badge = c.evalMode === "manual" || c.type === "manual" || c.id === "F7" || c.id === "F8" ? `<span style="font-size:8px;padding:1px 4px;border-radius:3px;font-weight:700;margin-left:4px;background:#f3e8ff;color:#7e22ce;border:1px solid #d8b4fe;">JURY</span>` : `<span style="font-size:8px;padding:1px 4px;border-radius:3px;font-weight:700;margin-left:4px;background:#e0f2fe;color:#0284c7;border:1px solid #bae6fd;">AI</span>`;
		return `
      <tr>
        <td style="font-weight:700;color:#1e293b;width:34px;">${c.id}</td>
        <td style="color:#334155;font-weight:500;">${c.name} ${badge}</td>
        <td style="width:90px;">
          <div class="bar-container">
            <div class="bar-fill" style="width:${pct}%;background:${color};"></div>
          </div>
        </td>
        <td style="text-align:right;font-weight:800;color:${color};width:45px;">${c.score}/${max}</td>
      </tr>
    `;
	}).join("");
	const strengths = (r.strengths || []).slice(0, 3).map((s) => `<li style="margin-bottom:3px;">${s}</li>`).join("");
	const weaknesses = (r.weaknesses || []).slice(0, 3).map((w) => `<li style="margin-bottom:3px;">${w}</li>`).join("");
	const suggestions = (r.suggestions || []).slice(0, 3).map((s) => `<li style="margin-bottom:3px;">${s}</li>`).join("");
	return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>Ideathon 2026 — Scorecard: ${team.name}</title>
      <style>${COMMON_CSS}</style>
    </head>
    <body>
      <div class="sheet">
        <div class="sheet-page">
          <img src="/logo.png" class="watermark" alt="" onerror="this.style.display='none'" />
          
          <div class="content-relative">
            ${renderHeader(`Executive Scorecard: ${team.name}`, `Leader: ${team.leader_email || "Not specified"}`, category)}
            
            <!-- Hero Score Banner -->
            <div style="display:grid;grid-template-columns:1fr auto;gap:16px;background:linear-gradient(135deg, #0f172a, #1e293b);color:#f8fafc;padding:12px 18px;border-radius:8px;margin-bottom:12px;align-items:center;">
              <div>
                <div style="font-size:9.5px;text-transform:uppercase;letter-spacing:1.5px;color:#94a3b8;">Official AI Rubric Evaluation</div>
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

            <!-- Summary Box -->
            ${r.executiveSummary ? `
              <div style="background:#f8fafc;border:1px solid #e2e8f0;border-left:3px solid #d97706;padding:8px 12px;border-radius:4px;margin-bottom:12px;font-size:10.5px;color:#334155;">
                <b style="color:#0f172a;">Executive Overview:</b> ${r.executiveSummary}
              </div>
            ` : ""}

            <!-- Criteria Breakdown Table -->
            <div style="margin-bottom:12px;">
              <div style="font-size:10.5px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:#0f172a;margin-bottom:5px;" class="heading-font">
                📊 Rubric Evaluation Breakdown (10 Criteria)
              </div>
              <table class="criteria-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Rubric Criterion</th>
                    <th>Performance Gauge</th>
                    <th style="text-align:right;">Marks</th>
                  </tr>
                </thead>
                <tbody>
                  ${criteriaRows || `<tr><td colspan="4" style="text-align:center;color:#64748b;padding:12px;">Rubric breakdown evaluated out of 100 marks.</td></tr>`}
                </tbody>
              </table>
            </div>

            <!-- Insights 3-column Grid -->
            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:12px;">
              <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;padding:8px 10px;">
                <div style="font-size:10px;font-weight:800;color:#166534;text-transform:uppercase;margin-bottom:4px;">✅ Key Strengths</div>
                <ul style="margin:0;padding-left:14px;font-size:9.5px;color:#14532d;line-height:1.35;">${strengths || "<li>Clear alignment with problem statement</li>"}</ul>
              </div>
              <div style="background:#fff1f2;border:1px solid #fecdd3;border-radius:6px;padding:8px 10px;">
                <div style="font-size:10px;font-weight:800;color:#9f1239;text-transform:uppercase;margin-bottom:4px;">⚠️ Areas to Improve</div>
                <ul style="margin:0;padding-left:14px;font-size:9.5px;color:#881337;line-height:1.35;">${weaknesses || "<li>Further validate financial models</li>"}</ul>
              </div>
              <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:6px;padding:8px 10px;">
                <div style="font-size:10px;font-weight:800;color:#1e40af;text-transform:uppercase;margin-bottom:4px;">💡 Suggestions</div>
                <ul style="margin:0;padding-left:14px;font-size:9.5px;color:#1e3a8a;line-height:1.35;">${suggestions || "<li>Include live pilot metric roadmap</li>"}</ul>
              </div>
            </div>

            <!-- Evaluator Signatures -->
            <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-top:10px;padding:6px 12px;background:#f8fafc;border-radius:6px;border:1px solid #e2e8f0;">
              <div>
                <div style="font-size:9.5px;font-weight:700;color:#0f172a;">Ideathon 2026 Evaluation Committee</div>
                <div style="font-size:8.5px;color:#64748b;">Official validation and grading certificate</div>
              </div>
              <div style="display:flex;gap:24px;">
                <div class="sign-box">
                  <div style="font-weight:700;color:#0f172a;">Denny Sir</div>
                  <div style="font-size:8.5px;color:#64748b;">Faculty Advisor & Judge</div>
                </div>
                <div class="sign-box">
                  <div style="font-weight:700;color:#0f172a;">Bhavya Mam</div>
                  <div style="font-size:8.5px;color:#64748b;">Faculty Advisor & Judge</div>
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
function generateTeamReport2Page(team) {
	const best = team.submissions.find((s) => s.score === team.bestScore) || team.submissions[0];
	const r = best?.result || {};
	const score = team.bestScore ?? best?.score ?? 0;
	const category = best?.category || team.latest?.category || "General";
	const rating = r.overallRating || (score >= 80 ? "Outstanding" : score >= 65 ? "Proficient" : "Needs Improvement");
	const criteriaRows = (r.criteria || []).map((c) => {
		const max = c.maxScore ?? 10;
		const pct = Math.round(c.score / max * 100);
		const color = pct >= 80 ? "#059669" : pct >= 55 ? "#d97706" : "#dc2626";
		const badge = c.evalMode === "manual" || c.type === "manual" || c.id === "F7" || c.id === "F8" ? `<span style="font-size:8px;padding:1px 5px;border-radius:3px;font-weight:700;margin-left:5px;background:#f3e8ff;color:#7e22ce;border:1px solid #d8b4fe;">✍️ LIVE JURY</span>` : `<span style="font-size:8px;padding:1px 5px;border-radius:3px;font-weight:700;margin-left:5px;background:#e0f2fe;color:#0284c7;border:1px solid #bae6fd;">🤖 AI EVALUATED</span>`;
		return `
      <tr style="border-bottom:1px solid #e2e8f0;">
        <td style="font-weight:800;color:#0f172a;padding:7px 8px;vertical-align:top;width:38px;">${c.id}</td>
        <td style="padding:7px 8px;vertical-align:top;">
          <div style="font-weight:700;color:#0f172a;font-size:11.5px;">${c.name} ${badge}</div>
          <div style="font-size:10px;color:#475569;margin-top:2px;"><b>Evidence:</b> ${c.evidence || "Evaluated based on submitted deck."}</div>
          ${c.deductions ? `<div style="font-size:9.5px;color:#b91c1c;margin-top:1px;"><b>Deductions:</b> ${c.deductions}</div>` : ""}
        </td>
        <td style="padding:7px 8px;width:80px;vertical-align:top;">
          <div class="bar-container" style="margin-top:4px;">
            <div class="bar-fill" style="width:${pct}%;background:${color};"></div>
          </div>
        </td>
        <td style="text-align:right;font-weight:900;color:${color};font-size:12px;padding:7px 8px;vertical-align:top;width:45px;">
          ${c.score}/${max}
        </td>
      </tr>
    `;
	}).join("");
	const strengths = (r.strengths || []).map((s) => `<li style="margin-bottom:4px;">${s}</li>`).join("");
	const weaknesses = (r.weaknesses || []).map((w) => `<li style="margin-bottom:4px;">${w}</li>`).join("");
	const suggestions = (r.suggestions || []).map((s) => `<li style="margin-bottom:4px;">${s}</li>`).join("");
	const risks = (r.risks || []).map((rk) => `<li style="margin-bottom:4px;">${rk}</li>`).join("");
	return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>Ideathon 2026 — Detailed Evaluation Dossier: ${team.name}</title>
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
            <div style="display:grid;grid-template-columns:1fr auto;gap:16px;background:linear-gradient(135deg, #0f172a, #1e293b);color:#f8fafc;padding:16px 20px;border-radius:10px;margin-bottom:14px;align-items:center;">
              <div>
                <div style="font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#94a3b8;">Comprehensive AI Evaluation Report</div>
                <div style="font-size:24px;font-weight:900;color:#ffffff;" class="heading-font">${team.name}</div>
                <div style="font-size:11px;color:#cbd5e1;margin-top:4px;">
                  Track: <b>${category}</b> · Total Submissions: <b>${team.submissions.length}</b> · Date: <b>${getFormattedDate()}</b>
                </div>
              </div>
              <div style="text-align:center;background:rgba(255,255,255,0.08);padding:10px 18px;border-radius:8px;border:1px solid rgba(255,255,255,0.15);">
                <div style="font-size:36px;font-weight:900;color:#fbbf24;line-height:1;" class="heading-font">${score}<span style="font-size:15px;color:#94a3b8;">/100</span></div>
                <div style="font-size:10px;color:#fde68a;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;margin-top:4px;">${rating}</div>
              </div>
            </div>

            <!-- Executive Summary -->
            <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:12px 16px;margin-bottom:14px;">
              <div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:#0f172a;margin-bottom:4px;" class="heading-font">
                📝 Executive Summary
              </div>
              <p style="margin:0;font-size:11px;color:#334155;line-height:1.5;">
                ${r.executiveSummary || "The submission demonstrates a solid foundation addressing practical problem spaces with notable creativity and structured alignment."}
              </p>
            </div>

            <!-- Problem & Solution Analysis -->
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;">
              <div style="background:#ffffff;border:1px solid #e2e8f0;border-left:3px solid #0284c7;border-radius:6px;padding:10px 14px;">
                <div style="font-size:10.5px;font-weight:800;color:#0369a1;text-transform:uppercase;margin-bottom:4px;">🎯 Problem Statement</div>
                <p style="margin:0;font-size:10.5px;color:#334155;line-height:1.45;">
                  ${r.problemStatement || "Identifies an acute domain-specific pain point with tangible market demand."}
                </p>
              </div>
              <div style="background:#ffffff;border:1px solid #e2e8f0;border-left:3px solid #059669;border-radius:6px;padding:10px 14px;">
                <div style="font-size:10.5px;font-weight:800;color:#047857;text-transform:uppercase;margin-bottom:4px;">💡 Proposed Solution</div>
                <p style="margin:0;font-size:10.5px;color:#334155;line-height:1.45;">
                  ${r.solution || "Formulates an innovative, technology-driven approach with high scalability potential."}
                </p>
              </div>
            </div>

            <!-- Strengths & Weaknesses Detailed Cards -->
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;">
              <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:12px 14px;">
                <div style="font-size:11px;font-weight:800;color:#166534;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px;">
                  ✅ Validated Strengths
                </div>
                <ul style="margin:0;padding-left:16px;font-size:10.5px;color:#14532d;line-height:1.45;">
                  ${strengths || "<li>High technical ingenuity and user-centric architecture</li><li>Comprehensive domain understanding</li>"}
                </ul>
              </div>
              <div style="background:#fff1f2;border:1px solid #fecdd3;border-radius:8px;padding:12px 14px;">
                <div style="font-size:11px;font-weight:800;color:#9f1239;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px;">
                  ⚠️ Areas for Development & Risk
                </div>
                <ul style="margin:0;padding-left:16px;font-size:10.5px;color:#881337;line-height:1.45;">
                  ${weaknesses || "<li>Further detail customer acquisition economics and pilot milestones</li>"}
                </ul>
              </div>
            </div>

            <div style="background:#f1f5f9;border-radius:6px;padding:8px 12px;font-size:10px;color:#64748b;text-align:center;">
              Turn to Page 2 for complete criterion-by-criterion scoring, evidence trail, and jury signatures.
            </div>

          </div>

          ${renderFooter("Page 1 of 2 — Executive Overview")}
        </div>

        <!-- ═══════════ PAGE 2: DETAILED CRITERIA & RECOMMENDATIONS ═══════════ -->
        <div class="sheet-page">
          <img src="/logo.png" class="watermark" alt="" onerror="this.style.display='none'" />
          
          <div class="content-relative">
            ${renderHeader(`Criterion Breakdown: ${team.name}`, `Full Rubric Analysis & Strategic Recommendations`, category)}

            <!-- Criteria Detail Table -->
            <div style="margin-bottom:12px;">
              <div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:#0f172a;margin-bottom:6px;" class="heading-font">
                📋 Detailed 10-Criterion Score Matrix
              </div>
              <table class="criteria-table" style="font-size:10.5px;">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Rubric Criterion & Evidence Log</th>
                    <th>Bar</th>
                    <th style="text-align:right;">Score</th>
                  </tr>
                </thead>
                <tbody>
                  ${criteriaRows || `<tr><td colspan="4" style="text-align:center;padding:15px;color:#64748b;">Detailed criteria evaluated.</td></tr>`}
                </tbody>
              </table>
            </div>

            <!-- Strategic Actionable Suggestions & Risks -->
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px;">
              <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:6px;padding:10px 12px;">
                <div style="font-size:10.5px;font-weight:800;color:#1e40af;text-transform:uppercase;margin-bottom:4px;">💡 Strategic Recommendations</div>
                <ul style="margin:0;padding-left:14px;font-size:10px;color:#1e3a8a;line-height:1.4;">
                  ${suggestions || "<li>Prototype key AI pipeline components for live user testing.</li><li>Formulate early pilot partnerships.</li>"}
                </ul>
              </div>
              <div style="background:#faf5ff;border:1px solid #e9d5ff;border-radius:6px;padding:10px 12px;">
                <div style="font-size:10.5px;font-weight:800;color:#6b21a8;text-transform:uppercase;margin-bottom:4px;">🛡️ Ethical & Feasibility Safeguards</div>
                <ul style="margin:0;padding-left:14px;font-size:10px;color:#581c87;line-height:1.4;">
                  ${risks || "<li>Ensure data compliance, privacy sandboxing, and ethical guardrails.</li>"}
                </ul>
              </div>
            </div>

            <!-- Official Signatures & Declaration -->
            <div style="display:flex;justify-content:space-between;align-items:flex-end;padding:8px 14px;background:#f8fafc;border-radius:6px;border:1px solid #e2e8f0;margin-top:10px;">
              <div>
                <div style="font-size:10px;font-weight:800;color:#0f172a;" class="heading-font">IDEATHON 2026 JURY PANEL</div>
                <div style="font-size:9px;color:#64748b;">Evaluated via verified transparent AI & Faculty review</div>
              </div>
              <div style="display:flex;gap:30px;">
                <div class="sign-box">
                  <div style="font-weight:700;color:#0f172a;">Denny Sir</div>
                  <div style="font-size:8.5px;color:#64748b;">Faculty Advisor</div>
                </div>
                <div class="sign-box">
                  <div style="font-weight:700;color:#0f172a;">Bhavya Mam</div>
                  <div style="font-size:8.5px;color:#64748b;">Faculty Advisor</div>
                </div>
              </div>
            </div>

          </div>

          ${renderFooter("Page 2 of 2 — Evaluation Matrix & Sign-off")}
        </div>

      </div>

      <button onclick="window.print()" class="floating-print-btn no-print">
        🖨️ Print / Save as PDF
      </button>
    </body>
    </html>
  `;
}
function generatePartwiseResultsReport(teams, categoryFilter) {
	const isAll = !categoryFilter || categoryFilter === "All";
	const sorted = [...isAll ? teams.filter((t) => t.bestScore != null) : teams.filter((t) => t.bestScore != null && (t.latest?.category === categoryFilter || t.submissions.some((s) => s.category === categoryFilter)))].sort((a, b) => (b.bestScore ?? 0) - (a.bestScore ?? 0));
	const tableRows = sorted.map((t, idx) => {
		const medal = idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `${idx + 1}`;
		const cat = t.submissions.find((s) => s.score === t.bestScore)?.category || t.latest?.category || "—";
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
      <title>Ideathon 2026 — Partwise Results: ${categoryFilter || "All Parts"}</title>
      <style>${COMMON_CSS}</style>
    </head>
    <body>
      <div class="sheet">
        <div class="sheet-page">
          <img src="/logo.png" class="watermark" alt="" onerror="this.style.display='none'" />
          
          <div class="content-relative">
            ${renderHeader(`Official Results: ${isAll ? "All Categories" : categoryFilter}`, `Total scored teams: ${sorted.length}`, isAll ? void 0 : categoryFilter)}

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
                <div style="font-size:8.5px;color:#64748b;">Certified by the Ideathon 2026 Organizing Committee</div>
              </div>
              <div style="display:flex;gap:24px;">
                <div class="sign-box">
                  <div style="font-weight:700;color:#0f172a;">Denny Sir</div>
                  <div style="font-size:8.5px;color:#64748b;">Faculty Advisor</div>
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
function generateAnnouncementReport(teams, topics = []) {
	const sorted = [...teams].filter((t) => t.bestScore != null).sort((a, b) => (b.bestScore ?? 0) - (a.bestScore ?? 0));
	const firstPlace = sorted[0];
	const secondPlace = sorted[1];
	const thirdPlace = sorted[2];
	const categoryWinners = [];
	for (const topic of topics) {
		const inTopic = sorted.filter((t) => t.latest?.category === topic.name || t.submissions.some((s) => s.category === topic.name));
		if (inTopic.length > 0) categoryWinners.push({
			category: topic.name,
			team: inTopic[0]
		});
	}
	return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>Ideathon 2026 — Official Declaration of Winners</title>
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
              <div style="font-size:10px;font-weight:800;letter-spacing:3px;text-transform:uppercase;color:#d97706;" class="heading-font">IDEATHON 2026</div>
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
                <div style="font-size:10px;font-weight:800;color:#0f172a;" class="heading-font">IDEATHON 2026 ORGANIZING BOARD</div>
                <div style="font-size:8.5px;color:#64748b;">Official announcement & declaration of awards</div>
              </div>
              <div style="display:flex;gap:24px;">
                <div class="sign-box">
                  <div style="font-weight:700;color:#0f172a;">Denny Sir</div>
                  <div style="font-size:8.5px;color:#64748b;">Faculty Advisor & Judge</div>
                </div>
                <div class="sign-box">
                  <div style="font-weight:700;color:#0f172a;">Bhavya Mam</div>
                  <div style="font-size:8.5px;color:#64748b;">Faculty Advisor & Judge</div>
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
function openPdfWindow(html) {
	const w = window.open("", "_blank");
	if (w) {
		w.document.open();
		w.document.write(html);
		w.document.close();
	}
}
function slug(s) {
	return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "team";
}
function downloadJson(filename, data) {
	const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	a.remove();
	setTimeout(() => URL.revokeObjectURL(url), 1e3);
}
function downloadCSV(filename, teams) {
	const rows = [[
		"Team",
		"Email",
		"Category",
		"Best Score",
		"Submissions",
		"Evaluated",
		"Overall Rating",
		"Strengths",
		"Weaknesses",
		"Suggestions"
	].join(",")];
	for (const t of teams) {
		const best = t.submissions.find((s) => s.score === t.bestScore);
		const r = best?.result || {};
		const cat = best?.category || t.latest?.category || "";
		const esc = (v) => `"${String(v ?? "").replace(/"/g, "\"\"")}"`;
		rows.push([
			esc(t.name),
			esc(t.leader_email),
			esc(cat),
			t.bestScore ?? "",
			t.submissions.length,
			t.submissions.filter((s) => s.status === "done").length,
			esc(r.overallRating),
			esc((r.strengths || []).join("; ")),
			esc((r.weaknesses || []).join("; ")),
			esc((r.suggestions || []).join("; "))
		].join(","));
	}
	const blob = new Blob([rows.join("\n")], { type: "text/csv" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	a.remove();
	setTimeout(() => URL.revokeObjectURL(url), 1e3);
}
function AdminDashboard() {
	const navigate = useNavigate();
	const listFn = useServerFn(listTeams);
	const delTeamFn = useServerFn(deleteTeam);
	const delSubFn = useServerFn(deleteSubmission);
	const renameFn = useServerFn(renameTeam);
	const updateEmailFn = useServerFn(updateTeamLeaderEmail);
	const getCriteriaFn = useServerFn(getCriteria);
	const saveCriteriaFn = useServerFn(saveCriteria);
	const getTopicsFn = useServerFn(getTopics);
	const saveTopicsFn = useServerFn(saveTopics);
	const buildFeedbackFn = useServerFn(buildFeedbackEmail);
	const saveManualScoresFn = useServerFn(saveManualScores);
	const [currentUser, setCurrentUser] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		supabase.auth.getUser().then(({ data }) => {
			setCurrentUser(data.user || null);
		});
	}, []);
	const teamsQ = useQuery({
		queryKey: ["admin", "teams"],
		queryFn: () => listFn(),
		refetchInterval: (query) => {
			return query.state.data?.some((t) => t.submissions?.some((s) => s.status === "pending" || s.status === "evaluating")) ? 2e3 : 1e4;
		},
		retry: 1
	});
	const criteriaQ = useQuery({
		queryKey: ["admin", "criteria"],
		queryFn: () => getCriteriaFn()
	});
	const topicsQ = useQuery({
		queryKey: ["admin", "topics"],
		queryFn: () => getTopicsFn()
	});
	const [openTeam, setOpenTeam] = (0, import_react.useState)(null);
	const [selectedSub, setSelectedSub] = (0, import_react.useState)(null);
	const [editingTeam, setEditingTeam] = (0, import_react.useState)(null);
	const [editName, setEditName] = (0, import_react.useState)("");
	const [editEmail, setEditEmail] = (0, import_react.useState)("");
	const [saveState, setSaveState] = (0, import_react.useState)("idle");
	const [confirmDelete, setConfirmDelete] = (0, import_react.useState)(null);
	const [activeTab, setActiveTab] = (0, import_react.useState)("teams");
	const [categoryFilter, setCategoryFilter] = (0, import_react.useState)("All");
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [reportModalOpen, setReportModalOpen] = (0, import_react.useState)(false);
	const [localCriteria, setLocalCriteria] = (0, import_react.useState)([]);
	const [critSaveState, setCritSaveState] = (0, import_react.useState)("idle");
	const [localTopics, setLocalTopics] = (0, import_react.useState)([]);
	const [topicSaveState, setTopicSaveState] = (0, import_react.useState)("idle");
	const [feedbackModal, setFeedbackModal] = (0, import_react.useState)(null);
	const [feedbackLoading, setFeedbackLoading] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (criteriaQ.data?.criteria && localCriteria.length === 0) setLocalCriteria(criteriaQ.data.criteria);
	}, [criteriaQ.data]);
	(0, import_react.useEffect)(() => {
		if (topicsQ.data?.topics && localTopics.length === 0) setLocalTopics(topicsQ.data.topics);
	}, [topicsQ.data]);
	const delTeamMut = useMutation({
		mutationFn: (id) => delTeamFn({ data: { id } }),
		onSuccess: () => teamsQ.refetch()
	});
	const delSubMut = useMutation({
		mutationFn: (id) => delSubFn({ data: { id } }),
		onSuccess: () => {
			setSelectedSub(null);
			teamsQ.refetch();
		}
	});
	const saveCriteriaMut = useMutation({
		mutationFn: (criteria) => saveCriteriaFn({ data: { criteria } }),
		onSuccess: () => {
			setCritSaveState("saved");
			criteriaQ.refetch();
			setTimeout(() => setCritSaveState("idle"), 2e3);
		},
		onError: () => setCritSaveState("error")
	});
	const saveTopicsMut = useMutation({
		mutationFn: (topics) => saveTopicsFn({ data: { topics } }),
		onSuccess: () => {
			setTopicSaveState("saved");
			topicsQ.refetch();
			setTimeout(() => setTopicSaveState("idle"), 2e3);
		},
		onError: () => setTopicSaveState("error")
	});
	(0, import_react.useEffect)(() => {
		if (!editingTeam) return;
		const team = (teamsQ.data || []).find((x) => x.id === editingTeam);
		if (!team) return;
		const next = editName.trim();
		if (!next || next === team.name || next.length < 2) {
			setSaveState("idle");
			return;
		}
		setSaveState("saving");
		const handle = setTimeout(async () => {
			try {
				await renameFn({ data: {
					id: team.id,
					name: next
				} });
				setSaveState("saved");
				teamsQ.refetch();
				setTimeout(() => setSaveState((s) => s === "saved" ? "idle" : s), 1200);
			} catch {
				setSaveState("error");
			}
		}, 600);
		return () => clearTimeout(handle);
	}, [editName, editingTeam]);
	(0, import_react.useEffect)(() => {
		if (!editingTeam) return;
		const team = (teamsQ.data || []).find((x) => x.id === editingTeam);
		if (!team) return;
		const next = editEmail.trim();
		if (!next || next === team.leader_email || !next.includes("@")) {
			setSaveState("idle");
			return;
		}
		setSaveState("saving");
		const handle = setTimeout(async () => {
			try {
				await updateEmailFn({ data: {
					id: team.id,
					email: next
				} });
				setSaveState("saved");
				teamsQ.refetch();
				setTimeout(() => setSaveState((s) => s === "saved" ? "idle" : s), 1200);
			} catch {
				setSaveState("error");
			}
		}, 600);
		return () => clearTimeout(handle);
	}, [editEmail, editingTeam]);
	const handleSaveTeam = async (teamId) => {
		const nextName = editName.trim();
		const nextEmail = editEmail.trim();
		if (!nextName || nextName.length < 2) return;
		setSaveState("saving");
		try {
			await renameFn({ data: {
				id: teamId,
				name: nextName
			} });
			if (nextEmail && nextEmail.includes("@")) await updateEmailFn({ data: {
				id: teamId,
				email: nextEmail
			} });
			setSaveState("saved");
			teamsQ.refetch();
			setTimeout(() => {
				setEditingTeam(null);
				setSaveState("idle");
			}, 600);
		} catch {
			setSaveState("error");
		}
	};
	const signOut = async () => {
		await supabase.auth.signOut();
		navigate({ to: "/auth" });
	};
	const teams = teamsQ.data || [];
	const filteredTeams = (0, import_react.useMemo)(() => {
		return teams.filter((t) => {
			const matchCat = categoryFilter === "All" || t.latest?.category === categoryFilter || t.submissions.some((s) => s.category === categoryFilter);
			const matchSearch = !searchQuery.trim() || t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.leader_email && t.leader_email.toLowerCase().includes(searchQuery.toLowerCase());
			return matchCat && matchSearch;
		});
	}, [
		teams,
		categoryFilter,
		searchQuery
	]);
	const leaderboard = (0, import_react.useMemo)(() => {
		return [...filteredTeams].filter((t) => t.bestScore != null).sort((a, b) => (b.bestScore ?? 0) - (a.bestScore ?? 0));
	}, [filteredTeams]);
	const partwiseGrouped = (0, import_react.useMemo)(() => {
		const topicsList = localTopics.length > 0 ? localTopics.map((t) => t.name) : ["General"];
		const groups = [];
		for (const cat of topicsList) {
			const catTeams = teams.filter((t) => t.latest?.category === cat || t.submissions.some((s) => s.category === cat));
			const scored = catTeams.filter((t) => t.bestScore != null).sort((a, b) => (b.bestScore ?? 0) - (a.bestScore ?? 0));
			const top = scored[0] || null;
			const avg = scored.length ? Math.round(scored.reduce((sum, t) => sum + (t.bestScore ?? 0), 0) / scored.length) : 0;
			groups.push({
				category: cat,
				teams: catTeams,
				topTeam: top,
				avgScore: avg
			});
		}
		return groups;
	}, [teams, localTopics]);
	const exportAll = () => downloadJson(`ideathon-2026-all-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.json`, {
		exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
		teams
	});
	const exportTeam = (t) => downloadJson(`team-${slug(t.name)}.json`, {
		exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
		team: t
	});
	const exportSubmission = (t, s) => downloadJson(`team-${slug(t.name)}-${s.id.slice(0, 8)}.json`, {
		exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
		team: {
			id: t.id,
			name: t.name
		},
		submission: s
	});
	const handleSendFeedback = async (teamId) => {
		setFeedbackLoading(teamId);
		try {
			setFeedbackModal(await buildFeedbackFn({ data: { teamId } }));
		} catch (e) {
			alert("Failed to build feedback: " + (e?.message || "unknown error"));
		} finally {
			setFeedbackLoading(null);
		}
	};
	const updateCriterion = (i, field, value) => {
		setLocalCriteria((prev) => prev.map((c, idx) => idx === i ? {
			...c,
			[field]: value
		} : c));
	};
	const addCriterion = () => {
		const next = localCriteria.length + 1;
		setLocalCriteria((prev) => [...prev, {
			id: `F${next}`,
			name: "New Criterion",
			maxScore: 10,
			description: "",
			type: "ai",
			evalMode: "ai"
		}]);
	};
	const removeCriterion = (i) => {
		setLocalCriteria((prev) => prev.filter((_, idx) => idx !== i));
	};
	const resetCriteria = () => {
		if (criteriaQ.data?.criteria) setLocalCriteria(criteriaQ.data.criteria);
	};
	const updateTopic = (i, field, value) => {
		setLocalTopics((prev) => prev.map((t, idx) => idx === i ? {
			...t,
			[field]: value
		} : t));
	};
	const addTopic = () => {
		const next = localTopics.length + 1;
		setLocalTopics((prev) => [...prev, {
			id: `T${next}`,
			name: "New Track"
		}]);
	};
	const removeTopic = (i) => {
		setLocalTopics((prev) => prev.filter((_, idx) => idx !== i));
	};
	const resetTopics = () => {
		if (topicsQ.data?.topics) setLocalTopics(topicsQ.data.topics);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative min-h-screen overflow-hidden bg-[#08070f] text-slate-100 flex flex-col justify-between",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pointer-events-none absolute inset-0 -z-20",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-40 left-1/3 h-[460px] w-[460px] rounded-full bg-[#a78bfa]/15 blur-[120px]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-40 right-0 h-[400px] w-[400px] rounded-full bg-[#67e8f9]/12 blur-[120px]" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChromeScene, {
				intensity: "ambient",
				className: "pointer-events-none absolute right-[-15%] top-[-8%] -z-10 h-[60vh] w-[60vw] opacity-50"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "relative border-b border-white/5 backdrop-blur-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative group",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -inset-1 rounded-xl bg-gradient-to-r from-amber-300/40 via-cyan-400/40 to-purple-500/40 opacity-75 blur-md group-hover:opacity-100 transition duration-300" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: "/logo.png",
								alt: "INNOVEDGE Logo",
								className: "relative h-11 w-11 object-contain rounded-xl drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)] transform group-hover:scale-105 transition"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] uppercase tracking-[0.3em] text-amber-300 font-bold",
								children: "Ideathon 2026 · INNOVEDGE CLUB"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "mt-0.5 truncate font-serif text-xl sm:text-2xl font-bold",
								children: "Admin Control Center"
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeToggle, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setReportModalOpen(true),
								className: "inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-300 to-amber-400 px-4 py-2 text-xs font-bold text-black btn-3d shadow-[0_0_20px_rgba(251,191,36,0.3)]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "📑" }), " Print Reports & PDFs"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => downloadCSV(`ideathon-2026-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`, teams),
								disabled: !teams.length,
								className: "rounded-xl border border-emerald-400/40 bg-emerald-400/10 px-3.5 py-2 text-xs font-semibold text-emerald-200 hover:bg-emerald-400/20 disabled:opacity-40 btn-3d",
								children: "📊 CSV Export"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: exportAll,
								disabled: !teams.length,
								className: "rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-white/10 disabled:opacity-40",
								children: "JSON"
							}),
							currentUser && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "hidden sm:flex items-center gap-1.5 rounded-xl border border-amber-300/20 bg-amber-300/5 px-3 py-1.5 text-xs text-amber-200",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "👑" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-[11px]",
									children: currentUser.email
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: signOut,
								className: "rounded-xl border border-white/15 px-3.5 py-2 text-xs text-slate-200 hover:bg-white/10",
								children: "Sign out"
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "relative mx-auto w-full max-w-6xl space-y-8 px-4 py-8 sm:px-6",
				children: [
					currentUser && currentUser.email !== "admin@admin.com" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-amber-400/40 bg-amber-400/10 p-5 text-xs text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg backdrop-blur-md",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-bold text-amber-300 text-sm flex items-center gap-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "⚠️" }),
								" Signed in as Team Leader (",
								currentUser.email,
								")"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-slate-300 text-xs mt-1",
							children: "The Admin Control Center requires administrator credentials to view all registered teams and review evaluations. Switch to the Admin account to unlock all features."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: async () => {
								await supabase.auth.signOut();
								const { error } = await supabase.auth.signInWithPassword({
									email: "admin@admin.com",
									password: "Ideathon!2026#Judge"
								});
								if (!error) window.location.reload();
							},
							className: "shrink-0 rounded-xl bg-gradient-to-r from-amber-300 to-amber-400 px-5 py-2.5 text-xs font-bold text-black btn-3d shadow-[0_0_20px_rgba(251,191,36,0.3)] cursor-pointer",
							children: "👑 Switch to Admin (admin@admin.com)"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "grid grid-cols-2 gap-3.5 sm:grid-cols-4",
						children: [
							{
								l: "Total Teams",
								v: teams.length,
								icon: "👥"
							},
							{
								l: "Submissions",
								v: teams.reduce((a, t) => a + t.submissions.length, 0),
								icon: "📄"
							},
							{
								l: "Evaluated",
								v: teams.reduce((a, t) => a + t.submissions.filter((s) => s.status === "done").length, 0),
								icon: "✅"
							},
							{
								l: "Top Score",
								v: leaderboard[0]?.bestScore != null ? `${leaderboard[0].bestScore}/100` : "—",
								icon: "🏆"
							}
						].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-white/10 bg-white/[0.03] p-5 card-3d card-3d-hover",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold",
									children: s.l
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-base",
									children: s.icon
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 font-serif text-3xl sm:text-4xl font-black text-amber-300",
								children: s.v
							})]
						}, s.l))
					}),
					teamsQ.isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-slate-400 animate-pulse",
						children: "Loading platform records…"
					}),
					teamsQ.error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-rose-500/40 bg-rose-500/10 p-5 text-sm text-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-bold text-rose-300 text-sm",
							children: "⚠️ Unable to load registered teams"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-slate-300 mt-1",
							children: teamsQ.error.message
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: async () => {
								await supabase.auth.signOut();
								await supabase.auth.signInWithPassword({
									email: "admin@admin.com",
									password: "Ideathon!2026#Judge"
								});
								window.location.reload();
							},
							className: "shrink-0 rounded-xl bg-gradient-to-r from-amber-300 to-amber-400 px-4 py-2.5 text-xs font-bold text-black btn-3d shadow-[0_0_20px_rgba(251,191,36,0.3)] cursor-pointer whitespace-nowrap",
							children: "👑 Sign in as Admin (admin@admin.com)"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-1.5 rounded-2xl border border-white/10 bg-white/[0.02] p-1.5 w-full sm:w-fit backdrop-blur-md",
						children: [
							{
								id: "teams",
								label: "👥 Teams & Submissions"
							},
							{
								id: "results",
								label: "📊 Results (Partwise)"
							},
							{
								id: "announcements",
								label: "📢 Announce List & Podium"
							},
							{
								id: "topics",
								label: "🏷️ Tracks / Topics"
							},
							{
								id: "criteria",
								label: "⚙️ Rubric Criteria"
							}
						].map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setActiveTab(tab.id),
							className: `rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all ${activeTab === tab.id ? "bg-amber-300 text-black shadow-[0_0_15px_rgba(251,191,36,0.3)]" : "text-slate-400 hover:text-slate-100 hover:bg-white/5"}`,
							children: tab.label
						}, tab.id))
					}),
					activeTab === "teams" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "space-y-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center justify-between gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-serif text-2xl",
									children: "Registered Teams"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-slate-400 mt-0.5",
									children: "Manage registered teams, verify submissions, generate 1-page/2-page PDFs, and dispatch feedback."
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											placeholder: "Search team or email…",
											value: searchQuery,
											onChange: (e) => setSearchQuery(e.target.value),
											className: "rounded-lg border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 outline-none focus:border-amber-300/60"
										}),
										localTopics.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											value: categoryFilter,
											onChange: (e) => setCategoryFilter(e.target.value),
											className: "rounded-lg border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-amber-300/60",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "All",
												children: "All Categories"
											}), localTopics.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: t.name,
												children: t.name
											}, t.id))]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => teamsQ.refetch(),
											disabled: teamsQ.isFetching,
											className: "rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-1.5 text-xs text-slate-300 transition flex items-center gap-1.5 cursor-pointer",
											title: "Refresh registered teams",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: teamsQ.isFetching ? "animate-spin" : "",
												children: "🔄"
											}), teamsQ.isFetching ? "Refreshing…" : "Refresh"]
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl border border-amber-300/20 bg-amber-300/[0.04] p-4 text-xs backdrop-blur-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-300/10 text-lg border border-amber-300/20",
										children: "👥"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-semibold text-slate-100 text-sm",
										children: "Leader Self-Registration Active"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-slate-400 text-xs mt-0.5",
										children: "Team leaders register their team name, leader credentials, requirements, and submission PDF independently via the Team Portal. All registered teams appear below automatically for evaluation and live jury grading."
									})] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "/team",
									target: "_blank",
									rel: "noreferrer",
									className: "inline-flex items-center gap-1.5 rounded-xl border border-amber-300/30 bg-amber-300/10 px-3.5 py-2 text-xs font-bold text-amber-300 hover:bg-amber-300/20 transition whitespace-nowrap",
									children: "Open Team Portal ↗"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
								children: [filteredTeams.length === 0 && !teamsQ.isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "col-span-full py-8 text-center text-sm text-slate-500",
									children: "No matching teams found."
								}), filteredTeams.map((t) => {
									const open = openTeam === t.id;
									const isEditing = editingTeam === t.id;
									const evaluated = t.submissions.filter((s) => s.status === "done").length;
									const pct = Math.max(0, Math.min(100, t.bestScore ?? 0));
									const hasDone = t.submissions.some((s) => s.status === "done");
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] transition hover:border-amber-300/30 hover:shadow-[0_10px_40px_-10px_rgba(251,191,36,0.2)]",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "absolute right-3 top-3 flex items-center gap-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: `h-2 w-2 rounded-full ${t.submissions.length ? "bg-emerald-400" : "bg-slate-500"}`,
													"aria-hidden": "true"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[10px] uppercase tracking-wider text-slate-500",
													children: t.submissions.length ? "Active" : "Idle"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "p-5 pb-3",
												children: [isEditing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "space-y-2",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
															className: "mb-0.5 block text-[9px] uppercase tracking-wider text-slate-500",
															children: "Team Name"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
															autoFocus: true,
															value: editName,
															onChange: (e) => setEditName(e.target.value),
															className: "w-full rounded-md border border-amber-300/20 bg-black/40 px-2 py-1 text-xs text-slate-100 outline-none focus:border-amber-300"
														})] }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
															className: "mb-0.5 block text-[9px] uppercase tracking-wider text-slate-500",
															children: "Leader Email"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
															value: editEmail,
															onChange: (e) => setEditEmail(e.target.value),
															className: "w-full rounded-md border border-amber-300/20 bg-black/40 px-2 py-1 text-xs text-slate-100 outline-none focus:border-amber-300"
														})] }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "mt-2.5 flex items-center justify-between",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																className: "text-[9px] uppercase tracking-wider",
																children: [
																	saveState === "saving" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																		className: "animate-pulse text-amber-300",
																		children: "Saving…"
																	}),
																	saveState === "saved" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																		className: "text-emerald-300",
																		children: "✓ Saved"
																	}),
																	saveState === "error" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																		className: "text-rose-300",
																		children: "Error saving"
																	})
																]
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "flex items-center gap-1.5",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																	type: "button",
																	onClick: () => handleSaveTeam(t.id),
																	disabled: saveState === "saving" || !editName.trim(),
																	className: "rounded bg-amber-300 px-2.5 py-1 text-[10px] font-semibold text-black hover:bg-amber-200 disabled:opacity-50",
																	children: "Save"
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																	type: "button",
																	onClick: () => setEditingTeam(null),
																	className: "rounded border border-white/15 px-2 py-1 text-[10px] text-slate-300 hover:bg-white/10",
																	children: "Cancel"
																})]
															})]
														})
													]
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
													className: "truncate pr-16 font-serif text-2xl leading-tight text-slate-100",
													children: t.name
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "mt-2 space-y-1",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
															className: "flex items-center gap-1.5 truncate text-xs text-slate-300",
															children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "text-amber-400 font-semibold",
																	children: "👤 Leader:"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "font-medium text-slate-200",
																	children: t.leader_name || "Registered Leader"
																}),
																t.leader_phone && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																	className: "text-slate-400 font-mono",
																	children: ["· 📞 ", t.leader_phone]
																})
															]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
															className: "flex items-center gap-1.5 truncate text-xs text-slate-400",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "text-slate-500",
																children: "📧"
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t.leader_email || "No email set" })]
														}),
														t.project_title && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
															className: "truncate text-xs font-medium text-amber-200/90",
															children: [
																"💡 ",
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "text-slate-400 font-normal",
																	children: "Project:"
																}),
																" ",
																t.project_title
															]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex flex-wrap items-center gap-1.5 pt-1.5",
															children: [
																t.latest?.category && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																	className: "rounded bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 text-[10px] font-semibold text-amber-300",
																	children: ["📌 ", t.latest.category]
																}),
																t.members && t.members.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																	className: "rounded bg-white/5 border border-white/10 px-2 py-0.5 text-[10px] text-slate-300",
																	children: [
																		"👥 ",
																		t.members.length,
																		" Member",
																		t.members.length === 1 ? "" : "s"
																	]
																}),
																hasDone && (() => {
																	return ((t.submissions.find((s) => s.status === "done")?.result)?.criteria || []).some((c) => (c.evalMode === "manual" || c.id === "F7" || c.id === "F8") && !c.isManuallyGraded && (!c.score || c.score === 0)) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																		className: "rounded bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[10px] font-semibold text-amber-300",
																		children: "✍️ F7 & F8 Pending Jury"
																	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																		className: "rounded bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-semibold text-emerald-300",
																		children: "✅ Fully Graded (AI + Jury)"
																	});
																})()
															]
														})
													]
												})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "mt-2 text-[10px] text-slate-500",
													children: ["Added ", t.created_at ? new Date(t.created_at).toLocaleDateString() : "Recently"]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "px-5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-baseline justify-between",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-[10px] uppercase tracking-wider text-slate-500",
														children: "Best score"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "font-serif text-2xl text-amber-300",
														children: [t.bestScore ?? "—", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-xs text-slate-500",
															children: "/100"
														})]
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													role: "progressbar",
													"aria-valuenow": Math.round(pct),
													"aria-valuemin": 0,
													"aria-valuemax": 100,
													className: "mt-2 h-2 w-full overflow-hidden rounded-full border border-white/10 bg-white/5",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-200",
														style: { width: `${pct}%` }
													})
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-4 grid grid-cols-2 gap-px border-t border-white/5 bg-white/5 text-center",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "bg-[#0a0a14] px-2 py-2.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "font-serif text-base text-slate-100",
														children: t.submissions.length
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-[9px] uppercase tracking-wider text-slate-500",
														children: "Submissions"
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "bg-[#0a0a14] px-2 py-2.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "font-serif text-base text-emerald-300",
														children: evaluated
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-[9px] uppercase tracking-wider text-slate-500",
														children: "Evaluated"
													})]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-wrap gap-1.5 border-t border-white/5 p-3",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
														onClick: () => setOpenTeam(open ? null : t.id),
														className: "flex-1 rounded-md border border-white/15 bg-white/5 px-2.5 py-1.5 text-xs text-slate-100 hover:bg-white/10",
														children: [open ? "Hide" : "View", " Submissions"]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														onClick: () => {
															setEditingTeam(t.id);
															setEditName(t.name);
															setEditEmail(t.leader_email || "");
														},
														className: "rounded-md border border-white/15 px-2 py-1.5 text-xs text-slate-200 hover:bg-white/10",
														children: "Edit"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														onClick: () => exportTeam(t),
														disabled: !t.submissions.length,
														className: "rounded-md border border-white/15 px-2 py-1.5 text-xs text-slate-200 hover:bg-white/10 disabled:opacity-40",
														children: "JSON"
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-wrap gap-1.5 border-t border-white/5 px-3 pb-3",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														onClick: () => openPdfWindow(generateTeamReport1Page(t)),
														disabled: !hasDone,
														className: "flex-1 rounded-md border border-amber-300/40 bg-amber-300/10 px-2 py-1.5 text-xs font-medium text-amber-200 hover:bg-amber-300/20 disabled:opacity-40",
														title: "Generate compact 1-page executive scorecard with background watermark logo",
														children: "📄 1-Page PDF"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														onClick: () => openPdfWindow(generateTeamReport2Page(t)),
														disabled: !hasDone,
														className: "flex-1 rounded-md border border-violet-400/40 bg-violet-400/10 px-2 py-1.5 text-xs font-medium text-violet-200 hover:bg-violet-400/20 disabled:opacity-40",
														title: "Generate comprehensive 2-page detailed evaluation dossier",
														children: "📑 2-Page PDF"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														onClick: () => handleSendFeedback(t.id),
														disabled: feedbackLoading === t.id || !hasDone,
														className: "rounded-md border border-sky-400/30 bg-sky-400/5 px-2 py-1.5 text-xs text-sky-300 hover:bg-sky-400/15 disabled:opacity-40",
														children: feedbackLoading === t.id ? "…" : "📧"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														onClick: () => setConfirmDelete(t),
														className: "rounded-md border border-rose-400/40 px-2 py-1.5 text-xs text-rose-200 hover:bg-rose-500/15",
														children: "×"
													})
												]
											}),
											open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												id: `team-${t.id}-panel`,
												className: "space-y-2 border-t border-white/5 bg-black/30 p-3",
												children: [t.submissions.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs text-slate-400",
													children: "No submissions for this team yet."
												}), t.submissions.map((s) => {
													const hasManualPending = (s.result?.criteria || []).some((c) => (c.evalMode === "manual" || c.id === "F7" || c.id === "F8") && !c.isManuallyGraded && (!c.score || c.score === 0));
													return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex flex-wrap items-center justify-between gap-2 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "min-w-0 flex-1",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
																	className: "truncate text-sm text-slate-100",
																	children: s.file_name
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
																	className: "text-[11px] text-slate-400 flex flex-wrap items-center gap-2",
																	children: [
																		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
																			new Date(s.created_at).toLocaleString(),
																			" · ",
																			s.status
																		] }),
																		s.error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																			className: "text-rose-400",
																			children: ["· ", s.error]
																		}),
																		s.status === "done" && (hasManualPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																			className: "rounded bg-amber-400/20 text-amber-300 px-1.5 py-0.5 text-[10px] font-bold",
																			children: "✍️ F7/F8 Pending"
																		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																			className: "rounded bg-emerald-400/20 text-emerald-300 px-1.5 py-0.5 text-[10px] font-bold",
																			children: "✅ Fully Graded"
																		}))
																	]
																})]
															}),
															s.score != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																className: "shrink-0 text-sm font-semibold text-amber-300",
																children: [s.score, "/100"]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																onClick: () => setSelectedSub(s),
																disabled: s.status !== "done",
																className: "rounded-md border border-amber-300/40 bg-amber-300/10 px-2.5 py-1 text-xs font-medium text-amber-200 hover:bg-amber-300/20 disabled:opacity-40",
																children: hasManualPending ? "✍️ Grade & View" : "View"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																onClick: () => exportSubmission(t, s),
																disabled: s.status !== "done",
																className: "rounded-md border border-white/15 px-2.5 py-1 text-xs text-slate-200 hover:bg-white/10 disabled:opacity-40",
																children: "JSON"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																onClick: () => {
																	if (confirm("Delete this submission?")) delSubMut.mutate(s.id);
																},
																className: "rounded-md border border-rose-400/40 px-2.5 py-1 text-xs text-rose-200 hover:bg-rose-500/15",
																children: "×"
															})
														]
													}, s.id);
												})]
											})
										]
									}, t.id);
								})]
							})
						]
					}),
					activeTab === "results" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "space-y-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center justify-between gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-serif text-2xl",
									children: "Results List (Partwise / Category Breakdown)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-slate-400 mt-0.5",
									children: "Track-wise standings, rubric scores, and instant category-filtered PDF export."
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => openPdfWindow(generatePartwiseResultsReport(teams, categoryFilter)),
										className: "inline-flex items-center gap-1.5 rounded-lg bg-amber-300 px-4 py-2 text-xs font-semibold text-black hover:bg-amber-200 shadow-[0_0_15px_rgba(251,191,36,0.3)]",
										children: "📄 Export Partwise Results PDF"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => downloadCSV(`ideathon-2026-partwise-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`, filteredTeams),
										className: "rounded-lg border border-white/15 px-3 py-2 text-xs text-slate-200 hover:bg-white/10",
										children: "📊 Export CSV"
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setCategoryFilter("All"),
									className: `rounded-full px-4 py-1.5 text-xs font-semibold transition ${categoryFilter === "All" ? "bg-amber-300 text-black shadow-[0_0_12px_rgba(251,191,36,0.3)]" : "border border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/10"}`,
									children: [
										"All Parts (",
										leaderboard.length,
										")"
									]
								}), localTopics.map((topic) => {
									const count = teams.filter((t) => t.bestScore != null && (t.latest?.category === topic.name || t.submissions.some((s) => s.category === topic.name))).length;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => setCategoryFilter(topic.name),
										className: `rounded-full px-4 py-1.5 text-xs font-semibold transition ${categoryFilter === topic.name ? "bg-amber-300 text-black shadow-[0_0_12px_rgba(251,191,36,0.3)]" : "border border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/10"}`,
										children: [
											topic.name,
											" (",
											count,
											")"
										]
									}, topic.id);
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
								children: partwiseGrouped.map((group) => {
									if (categoryFilter !== "All" && group.category !== categoryFilter) return null;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-2xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-sm space-y-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "rounded bg-amber-300/10 px-2 py-0.5 text-[10px] font-semibold text-amber-300 border border-amber-300/20",
													children: group.category
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-xs text-slate-400",
													children: [group.teams.length, " Teams"]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-[10px] uppercase tracking-wider text-slate-500",
												children: "Track Champion"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-base font-bold text-slate-100 truncate",
												children: group.topTeam ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "flex items-center gap-1.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "🏆" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: group.topTeam.name })]
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-slate-500 font-normal",
													children: "No evaluated teams yet"
												})
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "grid grid-cols-2 gap-2 border-t border-white/5 pt-3",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-[9px] uppercase text-slate-500",
													children: "Top Score"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-lg font-bold text-amber-300",
													children: group.topTeam?.bestScore != null ? `${group.topTeam.bestScore}/100` : "—"
												})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-[9px] uppercase text-slate-500",
													children: "Part Average"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-lg font-bold text-sky-400",
													children: group.avgScore ? `${group.avgScore}/100` : "—"
												})] })]
											})
										]
									}, group.category);
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.02]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
									className: "w-full min-w-[750px] text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
										className: "bg-white/[0.03] text-xs uppercase tracking-wider text-slate-400",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3.5 text-left",
												children: "#"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3.5 text-left",
												children: "Team & Project"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3.5 text-left",
												children: "Leader & Contact"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3.5 text-left",
												children: "Part / Track"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3.5 text-left",
												children: "Evaluation Mode"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3.5 text-left",
												children: "Score Gauge"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3.5 text-right",
												children: "Score"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3.5 text-right",
												children: "Reports"
											})
										] })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [leaderboard.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										colSpan: 8,
										className: "px-4 py-8 text-center text-slate-500",
										children: "No evaluated teams in this category yet."
									}) }), leaderboard.map((t, i) => {
										const medal = [
											"🥇",
											"🥈",
											"🥉"
										][i];
										const pct = Math.max(0, Math.min(100, t.bestScore ?? 0));
										const pendingManual = (((t.submissions.find((s) => s.score === t.bestScore) || t.submissions.find((s) => s.status === "done"))?.result)?.criteria || []).some((c) => (c.evalMode === "manual" || c.id === "F7" || c.id === "F8") && !c.isManuallyGraded && (!c.score || c.score === 0));
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
											className: "border-t border-white/5 hover:bg-white/[0.02]",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-3.5 text-slate-400 font-bold",
													children: medal ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-lg",
														children: medal
													}) : i + 1
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
													className: "px-4 py-3.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "font-semibold text-slate-100",
														children: t.name
													}), t.project_title && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "text-xs text-amber-200/80 truncate max-w-[180px]",
														children: ["💡 ", t.project_title]
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
													className: "px-4 py-3.5 text-xs text-slate-300",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "font-medium text-slate-200",
															children: t.leader_name || "Leader Registered"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "text-slate-400",
															children: t.leader_email || "—"
														}),
														t.leader_phone && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "text-slate-500 font-mono",
															children: ["📞 ", t.leader_phone]
														})
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-3.5 text-xs",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "rounded bg-amber-300/10 px-2 py-0.5 text-[10px] font-medium text-amber-300 border border-amber-300/20",
														children: t.latest?.category || "General"
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-3.5 text-xs",
													children: pendingManual ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "inline-flex items-center gap-1 rounded bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[10px] font-semibold text-amber-300",
														children: "✍️ F7/F8 Pending"
													}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "inline-flex items-center gap-1 rounded bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-semibold text-emerald-300",
														children: "✅ Fully Graded"
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-3.5",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														role: "progressbar",
														"aria-valuenow": Math.round(pct),
														"aria-valuemin": 0,
														"aria-valuemax": 100,
														className: "h-2 w-full min-w-[90px] overflow-hidden rounded-full border border-white/10 bg-white/5",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-200",
															style: { width: `${pct}%` }
														})
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
													className: "px-4 py-3.5 text-right font-serif text-lg font-bold text-amber-300",
													children: [t.bestScore, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-xs text-slate-500 font-sans",
														children: "/100"
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-3.5 text-right",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex justify-end gap-1.5",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															onClick: () => openPdfWindow(generateTeamReport1Page(t)),
															className: "rounded border border-amber-300/30 px-2 py-1 text-[10px] font-medium text-amber-300 hover:bg-amber-300/10",
															children: "1-Page PDF"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															onClick: () => openPdfWindow(generateTeamReport2Page(t)),
															className: "rounded border border-violet-400/30 px-2 py-1 text-[10px] font-medium text-violet-300 hover:bg-violet-400/10",
															children: "2-Page PDF"
														})]
													})
												})
											]
										}, t.id);
									})] })]
								})
							})
						]
					}),
					activeTab === "announcements" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "space-y-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center justify-between gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-serif text-2xl",
									children: "Official Announcement List & Podium"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-slate-400 mt-0.5",
									children: "Grand championship winners, track champions, and 1-click official declaration PDF."
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex flex-wrap items-center gap-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => openPdfWindow(generateAnnouncementReport(teams, localTopics)),
										className: "inline-flex items-center gap-2 rounded-xl bg-amber-300 px-5 py-2.5 text-xs font-bold text-black hover:bg-amber-200 shadow-[0_0_20px_rgba(251,191,36,0.35)]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "🏆" }), " Print 1-Page Official Announcement PDF"]
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-6 backdrop-blur-md",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-center mb-6",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] uppercase tracking-[0.3em] text-amber-300 font-bold",
										children: "Official Declaration"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-serif text-2xl sm:text-3xl mt-1",
										children: "Grand Championship Winners"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-4 sm:grid-cols-3 items-end max-w-4xl mx-auto",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-2xl border border-slate-700 bg-white/[0.02] p-5 text-center order-2 sm:order-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-4xl",
													children: "🥈"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "mt-2 text-[10px] uppercase tracking-wider text-slate-400 font-bold",
													children: "1st Runner-Up"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "mt-1 font-serif text-xl font-bold text-slate-100",
													children: leaderboard[1]?.name || "To Be Announced"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-xs text-amber-300/80 mt-1",
													children: leaderboard[1]?.latest?.category || "—"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "mt-3 font-serif text-2xl font-black text-sky-400",
													children: [leaderboard[1]?.bestScore ?? "—", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-xs text-slate-500",
														children: "/100"
													})]
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-2xl border-2 border-amber-300/70 bg-gradient-to-b from-amber-300/15 to-transparent p-6 text-center order-1 sm:order-2 shadow-[0_0_40px_rgba(251,191,36,0.2)]",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-5xl",
													children: "🏆"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "mt-2 text-[11px] uppercase tracking-[0.2em] text-amber-300 font-black",
													children: "Grand Champion (1st Place)"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "mt-1 font-serif text-2xl sm:text-3xl font-black text-white",
													children: leaderboard[0]?.name || "To Be Announced"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-xs text-amber-200 mt-1 font-semibold",
													children: leaderboard[0]?.latest?.category || "Top Track Winner"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "mt-3 font-serif text-3xl sm:text-4xl font-black text-amber-300",
													children: [leaderboard[0]?.bestScore ?? "—", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-sm text-amber-300/60",
														children: "/100"
													})]
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-2xl border border-slate-700 bg-white/[0.02] p-5 text-center order-3",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-4xl",
													children: "🥉"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "mt-2 text-[10px] uppercase tracking-wider text-slate-400 font-bold",
													children: "2nd Runner-Up"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "mt-1 font-serif text-xl font-bold text-slate-100",
													children: leaderboard[2]?.name || "To Be Announced"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-xs text-amber-300/80 mt-1",
													children: leaderboard[2]?.latest?.category || "—"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "mt-3 font-serif text-2xl font-black text-sky-400",
													children: [leaderboard[2]?.bestScore ?? "—", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-xs text-slate-500",
														children: "/100"
													})]
												})
											]
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-serif text-xl",
									children: "🎖️ Partwise Track Champions"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
									children: partwiseGrouped.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] font-bold text-amber-300 uppercase",
												children: g.category
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-semibold text-slate-100 text-sm mt-0.5",
												children: g.topTeam?.name || "Pending Evaluation"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-[11px] text-slate-400",
												children: g.topTeam?.leader_email || ""
											})
										] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-right",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-serif text-lg font-bold text-amber-300",
												children: g.topTeam?.bestScore != null ? `${g.topTeam.bestScore}/100` : "—"
											})
										})]
									}, g.category))
								})]
							})
						]
					}),
					activeTab === "topics" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "space-y-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center justify-between gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-serif text-xl",
									children: "Submission Tracks & Categories"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-slate-500 mt-0.5",
									children: ["Categories that teams choose during submission.", topicsQ.data?.updatedAt && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [" Last saved: ", new Date(topicsQ.data.updatedAt).toLocaleString()] })]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: resetTopics,
											className: "rounded-md border border-white/15 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/10",
											children: "Reset"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: addTopic,
											disabled: localTopics.length >= 20,
											className: "rounded-md border border-amber-300/40 bg-amber-300/10 px-3 py-1.5 text-xs font-medium text-amber-200 hover:bg-amber-300/20 disabled:opacity-40",
											children: "+ Add Track"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => {
												setTopicSaveState("saving");
												saveTopicsMut.mutate(localTopics);
											},
											disabled: saveTopicsMut.isPending || localTopics.length === 0,
											className: "rounded-md bg-amber-300 px-4 py-1.5 text-xs font-semibold text-black hover:bg-amber-200 disabled:opacity-60",
											children: saveTopicsMut.isPending ? "Saving…" : topicSaveState === "saved" ? "✓ Saved!" : "Save Tracks"
										})
									]
								})]
							}),
							topicsQ.isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-slate-400",
								children: "Loading tracks…"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
								children: localTopics.map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "group flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] p-3 transition hover:border-amber-300/20",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											value: t.id,
											onChange: (e) => updateTopic(i, "id", e.target.value),
											maxLength: 10,
											className: "w-12 shrink-0 rounded-md bg-amber-300/15 px-1.5 py-1 text-center text-xs font-bold text-amber-300 outline-none focus:ring-1 focus:ring-amber-300 border border-transparent focus:border-amber-300/60",
											"aria-label": "Track ID"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											value: t.name,
											onChange: (e) => updateTopic(i, "name", e.target.value),
											placeholder: "Track Name",
											className: "flex-1 min-w-0 rounded-md border border-white/10 bg-black/30 px-2.5 py-1.5 text-sm font-medium text-slate-100 placeholder:text-slate-600 outline-none focus:border-amber-300/60",
											"aria-label": "Track Name"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => removeTopic(i),
											disabled: localTopics.length <= 1,
											"aria-label": `Remove track ${t.id}`,
											className: "shrink-0 rounded-md border border-rose-400/30 px-1.5 py-1 text-xs text-rose-300 opacity-0 group-hover:opacity-100 hover:bg-rose-500/10 transition disabled:pointer-events-none",
											children: "×"
										})
									]
								}, i))
							}),
							topicSaveState === "error" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-rose-300",
								children: "Failed to save tracks. Please try again."
							})
						]
					}),
					activeTab === "criteria" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "space-y-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center justify-between gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-serif text-xl",
									children: "Evaluation Criteria (10 Rubric Bands)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-slate-500 mt-0.5",
									children: ["Criteria sent to the AI panel for scoring every submitted proposal.", criteriaQ.data?.updatedAt && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [" Last saved: ", new Date(criteriaQ.data.updatedAt).toLocaleString()] })]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: resetCriteria,
											className: "rounded-md border border-white/15 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/10",
											children: "Reset"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: addCriterion,
											disabled: localCriteria.length >= 20,
											className: "rounded-md border border-amber-300/40 bg-amber-300/10 px-3 py-1.5 text-xs font-medium text-amber-200 hover:bg-amber-300/20 disabled:opacity-40",
											children: "+ Add Criterion"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => {
												setCritSaveState("saving");
												saveCriteriaMut.mutate(localCriteria);
											},
											disabled: saveCriteriaMut.isPending || localCriteria.length === 0,
											className: "rounded-md bg-amber-300 px-4 py-1.5 text-xs font-semibold text-black hover:bg-amber-200 disabled:opacity-60",
											children: saveCriteriaMut.isPending ? "Saving…" : critSaveState === "saved" ? "✓ Saved!" : "Save Criteria"
										})
									]
								})]
							}),
							criteriaQ.isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-slate-400",
								children: "Loading criteria…"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid gap-3 sm:grid-cols-2",
								children: localCriteria.map((c, i) => {
									const totalMax = localCriteria.reduce((s, x) => s + x.maxScore, 0);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "group rounded-xl border border-white/10 bg-white/[0.02] p-4 transition hover:border-amber-300/20",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-start gap-3",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														value: c.id,
														onChange: (e) => updateCriterion(i, "id", e.target.value),
														maxLength: 10,
														className: "w-14 shrink-0 rounded-md bg-amber-300/15 px-2 py-1 text-center text-xs font-bold text-amber-300 outline-none focus:ring-1 focus:ring-amber-300 border border-transparent focus:border-amber-300/60",
														"aria-label": "Criterion ID"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex-1 min-w-0 space-y-2",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
															value: c.name,
															onChange: (e) => updateCriterion(i, "name", e.target.value),
															placeholder: "Criterion name",
															className: "w-full rounded-md border border-white/10 bg-black/30 px-2.5 py-1.5 text-sm font-medium text-slate-100 placeholder:text-slate-600 outline-none focus:border-amber-300/60",
															"aria-label": "Criterion name"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
															value: c.description,
															onChange: (e) => updateCriterion(i, "description", e.target.value),
															placeholder: "Description (sent to AI evaluator)",
															rows: 2,
															className: "w-full rounded-md border border-white/10 bg-black/30 px-2.5 py-1.5 text-xs text-slate-400 placeholder:text-slate-600 outline-none focus:border-amber-300/60 resize-none",
															"aria-label": "Criterion description"
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex shrink-0 flex-col items-center gap-1",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
																className: "text-[9px] uppercase text-slate-600",
																children: "Max"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
																type: "number",
																min: 1,
																max: 100,
																value: c.maxScore,
																onChange: (e) => updateCriterion(i, "maxScore", parseInt(e.target.value) || 10),
																className: "w-14 rounded-md border border-white/10 bg-black/30 px-2 py-1 text-center text-sm font-bold text-amber-300 outline-none focus:border-amber-300/60",
																"aria-label": "Max score"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "text-[9px] text-slate-600",
																children: "pts"
															})
														]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														onClick: () => removeCriterion(i),
														disabled: localCriteria.length <= 1,
														"aria-label": `Remove criterion ${c.id}`,
														className: "shrink-0 rounded-md border border-rose-400/30 px-1.5 py-1 text-xs text-rose-300 opacity-0 group-hover:opacity-100 hover:bg-rose-500/10 transition disabled:pointer-events-none",
														children: "×"
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-white/5 pt-2.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-[10px] uppercase tracking-wider text-slate-400 font-semibold",
														children: "Mode:"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
														value: c.evalMode || c.type || (c.id === "F7" || c.id === "F8" ? "manual" : "ai"),
														onChange: (e) => {
															const mode = e.target.value;
															updateCriterion(i, "evalMode", mode);
															updateCriterion(i, "type", mode);
														},
														className: `rounded-md border px-2 py-1 text-xs font-semibold outline-none transition ${(c.evalMode || c.type || (c.id === "F7" || c.id === "F8" ? "manual" : "ai")) === "manual" ? "border-purple-400/40 bg-purple-500/15 text-purple-200" : "border-sky-400/40 bg-sky-500/15 text-sky-200"}`,
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
															value: "ai",
															className: "bg-[#0a0a14] text-slate-200",
															children: "🤖 AI Evaluated (Gemini)"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
															value: "manual",
															className: "bg-[#0a0a14] text-slate-200",
															children: "✍️ Manual Evaluation (Live Jury)"
														})]
													})]
												}), c.evalMode === "manual" || c.type === "manual" || c.id === "F7" || c.id === "F8" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "rounded bg-purple-400/10 border border-purple-400/20 px-2 py-0.5 text-[10px] font-semibold text-purple-300",
													children: "Live Pitch Evaluation"
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "rounded bg-sky-400/10 border border-sky-400/20 px-2 py-0.5 text-[10px] font-semibold text-sky-300",
													children: "Automated AI Grading"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-3 flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "h-full rounded-full bg-amber-400/60",
														style: { width: `${Math.round(c.maxScore / Math.max(totalMax, 1) * 100)}%` }
													})
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-[10px] text-slate-600",
													children: [Math.round(c.maxScore / Math.max(totalMax, 1) * 100), "% weight"]
												})]
											})
										]
									}, i);
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-5 py-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm text-slate-400",
									children: "Total max score"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-serif text-2xl text-amber-300",
									children: [localCriteria.reduce((s, c) => s + c.maxScore, 0), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm text-slate-500",
										children: " pts"
									})]
								})]
							}),
							critSaveState === "error" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-rose-300",
								children: "Failed to save criteria. Please try again."
							})
						]
					})
				]
			}),
			reportModalOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportPickerModal, {
				teams,
				topics: localTopics,
				onClose: () => setReportModalOpen(false)
			}),
			selectedSub && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubmissionModal, {
				submission: selectedSub,
				team: (teamsQ.data || []).find((t) => t.id === selectedSub.team_id) || null,
				saveManualScoresFn,
				onScoreSaved: () => teamsQ.refetch(),
				onClose: () => setSelectedSub(null),
				onExport: () => downloadJson(`submission-${selectedSub.id.slice(0, 8)}.json`, {
					exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
					submission: selectedSub
				})
			}),
			confirmDelete && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
				title: "Delete team?",
				message: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					"You're about to permanently delete",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-semibold text-slate-100",
						children: [
							"\"",
							confirmDelete.name,
							"\""
						]
					}),
					" and",
					" ",
					confirmDelete.submissions.length === 0 ? "no submissions." : `all ${confirmDelete.submissions.length} submission${confirmDelete.submissions.length === 1 ? "" : "s"} attached to it.`,
					" ",
					"This cannot be undone."
				] }),
				confirmLabel: delTeamMut.isPending ? "Deleting…" : "Delete team",
				busy: delTeamMut.isPending,
				onCancel: () => setConfirmDelete(null),
				onConfirm: () => {
					const id = confirmDelete.id;
					delTeamMut.mutate(id, { onSettled: () => setConfirmDelete(null) });
				}
			}),
			feedbackModal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeedbackModal, {
				feedback: feedbackModal,
				onClose: () => setFeedbackModal(null)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, { className: "mt-20 border-t border-white/5 pt-8" })
		]
	});
}
function ReportPickerModal({ teams, topics, onClose }) {
	const [selectedTeamId, setSelectedTeamId] = (0, import_react.useState)(teams[0]?.id || "");
	const [selectedCategory, setSelectedCategory] = (0, import_react.useState)("All");
	const selectedTeam = teams.find((t) => t.id === selectedTeamId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		role: "dialog",
		"aria-modal": "true",
		className: "fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md",
		onClick: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			onClick: (e) => e.stopPropagation(),
			className: "w-full max-w-xl rounded-3xl border border-white/15 bg-[#0a0a14] p-6 text-slate-100 shadow-[0_20px_70px_rgba(0,0,0,0.7)] space-y-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[10px] uppercase tracking-[0.2em] text-amber-300 font-bold",
					children: "Official Document Center"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-serif text-2xl mt-0.5",
					children: "Generate & Print PDF Reports"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onClose,
					className: "rounded-full border border-white/15 p-1.5 text-xs text-slate-400 hover:text-white",
					children: "✕"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-white/10 bg-white/[0.02] p-4 hover:border-amber-300/30 transition",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center justify-between",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-bold text-slate-100 text-sm",
								children: "📄 1-Page Executive Scorecard (Single Team)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-slate-400 mt-0.5",
								children: "Fitted for exactly 1 page with score gauge, 10 rubric criteria, strengths, and background logo watermark."
							})] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								value: selectedTeamId,
								onChange: (e) => setSelectedTeamId(e.target.value),
								className: "flex-1 rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-xs text-slate-200 outline-none",
								children: teams.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
									value: t.id,
									children: [
										t.name,
										" ",
										t.bestScore != null ? `(${t.bestScore}/100)` : "(Unscored)"
									]
								}, t.id))
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								disabled: !selectedTeam || selectedTeam.bestScore == null,
								onClick: () => {
									if (selectedTeam) openPdfWindow(generateTeamReport1Page(selectedTeam));
								},
								className: "rounded-lg bg-amber-300 px-4 py-2 text-xs font-bold text-black hover:bg-amber-200 disabled:opacity-40",
								children: "Print 1-Page"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-white/10 bg-white/[0.02] p-4 hover:border-violet-400/30 transition",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center justify-between",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-bold text-slate-100 text-sm",
								children: "📑 2-Page Detailed Evaluation Dossier"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-slate-400 mt-0.5",
								children: "Page 1: Executive Overview & Strengths. Page 2: 10-criteria rubric matrix, deductions, and jury signatures."
							})] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								value: selectedTeamId,
								onChange: (e) => setSelectedTeamId(e.target.value),
								className: "flex-1 rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-xs text-slate-200 outline-none",
								children: teams.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
									value: t.id,
									children: [
										t.name,
										" ",
										t.bestScore != null ? `(${t.bestScore}/100)` : "(Unscored)"
									]
								}, t.id))
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								disabled: !selectedTeam || selectedTeam.bestScore == null,
								onClick: () => {
									if (selectedTeam) openPdfWindow(generateTeamReport2Page(selectedTeam));
								},
								className: "rounded-lg bg-violet-400 px-4 py-2 text-xs font-bold text-black hover:bg-violet-300 disabled:opacity-40",
								children: "Print 2-Page"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-white/10 bg-white/[0.02] p-4 hover:border-sky-400/30 transition",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-bold text-slate-100 text-sm",
							children: "📊 Partwise Results List PDF"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-slate-400 mt-0.5",
							children: "Consolidated results table filtered by track/category with score bars and logo watermark."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: selectedCategory,
								onChange: (e) => setSelectedCategory(e.target.value),
								className: "flex-1 rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-xs text-slate-200 outline-none",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "All",
									children: "All Categories"
								}), topics.map((tp) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: tp.name,
									children: tp.name
								}, tp.id))]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => openPdfWindow(generatePartwiseResultsReport(teams, selectedCategory)),
								className: "rounded-lg bg-sky-400 px-4 py-2 text-xs font-bold text-black hover:bg-sky-300",
								children: "Print Results"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-2xl border border-white/10 bg-white/[0.02] p-4 hover:border-emerald-400/30 transition",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-bold text-slate-100 text-sm",
								children: "🏆 Official Declaration of Winners (1 Page)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-slate-400 mt-0.5",
								children: "Grand championship podium (1st, 2nd, 3rd), track champions, faculty signatures, and seal."
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => openPdfWindow(generateAnnouncementReport(teams, topics)),
								className: "rounded-lg bg-emerald-400 px-4 py-2 text-xs font-bold text-black hover:bg-emerald-300",
								children: "Print Announcement"
							})]
						})
					})
				]
			})]
		})
	});
}
function ConfirmDialog({ title, message, confirmLabel, busy, onCancel, onConfirm }) {
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			if (e.key === "Escape") onCancel();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [onCancel]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		role: "dialog",
		"aria-modal": "true",
		"aria-labelledby": "confirm-title",
		className: "fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm",
		onClick: onCancel,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			onClick: (e) => e.stopPropagation(),
			className: "w-full max-w-md rounded-2xl border border-rose-400/30 bg-[#0a0a14] p-6 text-slate-100 shadow-[0_20px_60px_-20px_rgba(244,63,94,0.4)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid h-10 w-10 shrink-0 place-items-center rounded-full bg-rose-500/15 text-rose-300",
					"aria-hidden": "true",
					children: "!"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					id: "confirm-title",
					className: "font-serif text-xl",
					children: title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-slate-300",
					children: message
				})] })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex justify-end gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					autoFocus: true,
					onClick: onCancel,
					className: "rounded-md border border-white/15 px-4 py-2 text-sm text-slate-200 hover:bg-white/10",
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onConfirm,
					disabled: busy,
					className: "rounded-md bg-rose-500 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-400 disabled:opacity-60",
					children: confirmLabel
				})]
			})]
		})
	});
}
function FeedbackModal({ feedback, onClose }) {
	const [copied, setCopied] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [onClose]);
	const copyBody = async () => {
		await navigator.clipboard.writeText(feedback.body);
		setCopied(true);
		setTimeout(() => setCopied(false), 2e3);
	};
	const mailtoHref = `mailto:${encodeURIComponent(feedback.to)}?subject=${encodeURIComponent(feedback.subject)}&body=${encodeURIComponent(feedback.body)}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		role: "dialog",
		"aria-modal": "true",
		"aria-labelledby": "feedback-title",
		className: "fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm",
		onClick: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			onClick: (e) => e.stopPropagation(),
			className: "my-8 w-full max-w-2xl rounded-2xl border border-sky-400/30 bg-[#0a0a14] p-5 text-slate-100 shadow-[0_20px_60px_-20px_rgba(56,189,248,0.3)] sm:p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-3 mb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								id: "feedback-title",
								className: "font-serif text-xl text-sky-300",
								children: "📧 Feedback Email"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-slate-400 truncate",
								children: ["To: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-slate-200",
									children: feedback.to
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-slate-400 truncate",
								children: ["Subject: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-slate-200",
									children: feedback.subject
								})]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						className: "shrink-0 rounded-md border border-white/15 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/10",
						children: "✕ Close"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-lg border border-white/10 bg-black/40 p-4 max-h-80 overflow-y-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
						className: "whitespace-pre-wrap text-xs text-slate-300 font-mono leading-relaxed",
						children: feedback.body
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: mailtoHref,
						className: "flex-1 rounded-md bg-sky-500 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-sky-400",
						children: "✉️ Open in Email Client"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: copyBody,
						className: "rounded-md border border-white/15 px-4 py-2.5 text-sm text-slate-200 hover:bg-white/10",
						children: copied ? "✓ Copied!" : "📋 Copy Body"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-[11px] text-slate-600 leading-relaxed",
					children: "Clicking \"Open in Email Client\" will open your default mail app with this email pre-filled."
				})
			]
		})
	});
}
function SubmissionModal({ submission, team, onClose, onExport, saveManualScoresFn, onScoreSaved }) {
	const pdfFn = useServerFn(getPdfUrl);
	const [pdfUrl, setPdfUrl] = (0, import_react.useState)(null);
	const initialResult = submission.result || {};
	const [currentScore, setCurrentScore] = (0, import_react.useState)(submission.score);
	const [currentResult, setCurrentResult] = (0, import_react.useState)(initialResult);
	const [editScores, setEditScores] = (0, import_react.useState)(() => {
		const init = {};
		(submission.result?.criteria || []).forEach((c) => {
			init[c.id] = {
				score: Number(c.score) || 0,
				evidence: c.evidence || ""
			};
		});
		return init;
	});
	const [isSaving, setIsSaving] = (0, import_react.useState)(false);
	const [saveSuccess, setSaveSuccess] = (0, import_react.useState)(false);
	const [saveError, setSaveError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		pdfFn({ data: { path: submission.pdf_path } }).then((res) => setPdfUrl(res.url)).catch(() => setPdfUrl(null));
	}, [submission.pdf_path]);
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [onClose]);
	const r = currentResult;
	const criteriaList = r.criteria || [];
	const handleSaveJuryScores = async () => {
		if (!saveManualScoresFn) return;
		setIsSaving(true);
		setSaveError(null);
		try {
			const res = await saveManualScoresFn({ data: {
				submissionId: submission.id,
				scores: editScores
			} });
			if (res?.totalScore != null) setCurrentScore(res.totalScore);
			if (res?.result) setCurrentResult(res.result);
			setSaveSuccess(true);
			onScoreSaved?.();
			setTimeout(() => setSaveSuccess(false), 3e3);
		} catch (e) {
			setSaveError(e?.message || "Failed to save jury scores");
		} finally {
			setIsSaving(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		role: "dialog",
		"aria-modal": "true",
		"aria-labelledby": "eval-title",
		className: "fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/75 p-3 sm:p-4 backdrop-blur-sm",
		onClick: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			onClick: (e) => e.stopPropagation(),
			className: "my-6 w-full max-w-4xl rounded-2xl border border-white/10 bg-[#0a0a14] p-5 text-slate-100 shadow-2xl sm:p-7 space-y-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2 mb-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded bg-white/5 border border-white/10 px-2 py-0.5 text-[10px] text-slate-400 font-mono",
									children: submission.file_name
								}), (submission.category || team?.latest?.category) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "rounded bg-amber-400/10 border border-amber-400/25 px-2 py-0.5 text-[10px] font-semibold text-amber-300",
									children: ["📌 ", submission.category || team?.latest?.category]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								id: "eval-title",
								className: "font-serif text-3xl font-bold text-slate-100",
								children: team?.name || "Proposal Evaluation"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-slate-400 mt-1",
								children: [
									"Hybrid Scoring: ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "AI Evaluation (F1–F6, F9, F10)" }),
									" + ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Live Jury Evaluation (F7 & F8)" })
								]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-end",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-4xl font-bold text-amber-300 font-serif",
							children: [currentScore ?? "—", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-base text-slate-500 font-sans",
								children: "/100"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs uppercase tracking-wider text-amber-200/80 font-semibold mt-0.5",
							children: r.overallRating || "Pending Evaluation"
						})]
					})]
				}),
				team && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] uppercase tracking-wider text-slate-400 font-bold",
								children: "Team Profile & Leader Details"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs text-slate-400",
								children: ["Created: ", new Date(team.created_at || "").toLocaleDateString()]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-slate-500 block text-[10px] uppercase",
									children: "Leader Name"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-slate-200",
									children: team.leader_name || "Leader Registered"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-slate-500 block text-[10px] uppercase",
									children: "Leader Contact"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-slate-300",
									children: [
										"📧 ",
										team.leader_email || "—",
										" ",
										team.leader_phone ? `· 📞 ${team.leader_phone}` : ""
									]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-slate-500 block text-[10px] uppercase",
									children: "Registered Members"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-slate-200",
									children: team.members && team.members.length > 0 ? `${team.members.length} Members` : "No extra members listed"
								})] })
							]
						}),
						team.project_title && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border-t border-white/5 pt-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-slate-500 block text-[10px] uppercase",
									children: "Project Title"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-medium text-amber-200",
									children: team.project_title
								}),
								team.project_description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-slate-300 mt-1 leading-relaxed",
									children: team.project_description
								})
							]
						}),
						team.members && team.members.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border-t border-white/5 pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-slate-500 block text-[10px] uppercase mb-1",
								children: "Members List"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-1.5",
								children: team.members.map((m, idx) => {
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "rounded bg-white/5 border border-white/10 px-2 py-0.5 text-[11px] text-slate-300",
										children: ["👤 ", typeof m === "string" ? m : m.name ? `${m.name}${m.role ? ` (${m.role})` : ""}` : `Member ${idx + 1}`]
									}, idx);
								})
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [pdfUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: pdfUrl,
							target: "_blank",
							rel: "noreferrer",
							className: "rounded-md border border-white/15 px-3 py-1.5 text-xs text-slate-200 hover:bg-white/10",
							children: "Open Submitted PDF ↗"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: onExport,
							className: "rounded-md border border-white/15 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-white/10",
							children: "Export JSON"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [
							saveSuccess && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-bold text-emerald-400",
								children: "✓ Jury Scores Saved!"
							}),
							saveError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-bold text-rose-400",
								children: saveError
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								disabled: isSaving,
								onClick: handleSaveJuryScores,
								className: "rounded-lg bg-amber-300 px-4 py-1.5 text-xs font-bold text-black hover:bg-amber-200 shadow-[0_0_15px_rgba(251,191,36,0.3)] disabled:opacity-50",
								children: isSaving ? "Saving…" : "💾 Save Jury Scores & Recalculate Total"
							})
						]
					})]
				}),
				r.executiveSummary && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-white/10 bg-white/[0.02] p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1",
						children: "Executive AI Summary"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-slate-300 leading-relaxed",
						children: r.executiveSummary
					})]
				}),
				r.problemStatement && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-white/10 bg-white/[0.02] p-3.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "text-[10px] uppercase tracking-wider text-slate-400 font-bold",
							children: "Problem Statement"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-slate-200 leading-relaxed",
							children: r.problemStatement
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-white/10 bg-white/[0.02] p-3.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "text-[10px] uppercase tracking-wider text-slate-400 font-bold",
							children: "Proposed Solution"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-slate-200 leading-relaxed",
							children: r.solution
						})]
					})]
				}),
				criteriaList.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
							className: "font-serif text-lg font-bold text-slate-100",
							children: [
								"Rubric Criteria Evaluation (",
								criteriaList.length,
								" Bands)"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-slate-400",
							children: "F7 & F8 are evaluated manually by jury; F1–F6, F9, F10 are AI scored."
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-3.5 sm:grid-cols-2",
						children: criteriaList.map((c) => {
							const isManual = c.evalMode === "manual" || c.type === "manual" || c.id === "F7" || c.id === "F8";
							const max = c.maxScore ?? 10;
							const scoreValue = editScores[c.id]?.score ?? (Number(c.score) || 0);
							const pct = Math.round(scoreValue / max * 100);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `rounded-xl border p-4 transition ${isManual ? "border-purple-400/30 bg-purple-950/15 shadow-[0_0_20px_rgba(168,85,247,0.08)]" : "border-white/10 bg-white/[0.02]"}`,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start justify-between gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5 flex-wrap",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: `rounded px-1.5 py-0.5 text-[10px] font-bold ${isManual ? "bg-purple-400/20 text-purple-300 border border-purple-400/30" : "bg-amber-300/15 text-amber-300"}`,
													children: c.id
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-xs font-semibold text-slate-100",
													children: c.name
												}),
												isManual ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "rounded bg-purple-500/20 text-purple-200 border border-purple-500/40 px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-wider",
													children: "✍️ Manual Jury"
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "rounded bg-sky-500/20 text-sky-300 border border-sky-500/30 px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-wider",
													children: "🤖 AI Evaluated"
												})
											]
										}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-sm font-bold text-amber-300 shrink-0",
											children: [
												scoreValue,
												"/",
												max
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										role: "progressbar",
										"aria-valuenow": scoreValue,
										"aria-valuemin": 0,
										"aria-valuemax": max,
										className: "mt-2 h-2 w-full overflow-hidden rounded-full border border-white/10 bg-white/5",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: `h-full rounded-full transition-all duration-300 ${isManual ? "bg-gradient-to-r from-purple-400 to-amber-300" : "bg-gradient-to-r from-amber-400 to-amber-200"}`,
											style: { width: `${Math.max(0, Math.min(100, pct))}%` }
										})
									}),
									isManual ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-3 space-y-2 rounded-lg border border-purple-400/25 bg-black/40 p-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between gap-3",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
													className: "text-[11px] font-semibold text-purple-200",
													children: [
														"Jury Score (0–",
														max,
														"):"
													]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														type: "number",
														min: 0,
														max,
														value: scoreValue,
														onChange: (e) => {
															const val = Math.max(0, Math.min(max, parseInt(e.target.value) || 0));
															setEditScores((prev) => ({
																...prev,
																[c.id]: {
																	score: val,
																	evidence: prev[c.id]?.evidence || ""
																}
															}));
														},
														className: "w-16 rounded border border-purple-400/40 bg-black px-2 py-1 text-center font-serif text-base font-bold text-amber-300 outline-none focus:border-amber-300"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "text-xs text-slate-500 font-bold",
														children: ["/ ", max]
													})]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "text-[10px] uppercase tracking-wider text-purple-300/80 block mb-1 font-semibold",
												children: "Jury Evaluation Remarks & Pitch Notes:"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
												rows: 2,
												value: editScores[c.id]?.evidence || "",
												onChange: (e) => {
													const val = e.target.value;
													setEditScores((prev) => ({
														...prev,
														[c.id]: {
															score: prev[c.id]?.score ?? scoreValue,
															evidence: val
														}
													}));
												},
												placeholder: "Enter notes on pitch delivery, confidence, clarity, teamwork during Q&A...",
												className: "w-full rounded border border-white/10 bg-black/60 p-2 text-xs text-slate-200 placeholder:text-slate-600 outline-none focus:border-purple-400/60 resize-none"
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between text-[10px] text-slate-400 pt-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: c.isManuallyGraded || scoreValue > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-emerald-400 font-semibold",
													children: "✓ Graded by Jury"
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-amber-400 font-semibold",
													children: "⏳ Awaiting In-Person Marks"
												}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-slate-500",
													children: "Live Evaluation"
												})]
											})
										]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-2 space-y-1 text-xs text-slate-300",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-xs leading-relaxed",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
														className: "text-slate-100",
														children: "Evidence:"
													}),
													" ",
													c.evidence || "Scored based on proposal deck analysis."
												]
											}),
											c.strengths && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-xs text-emerald-300/90",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
														className: "text-emerald-200",
														children: "Strengths:"
													}),
													" ",
													c.strengths
												]
											}),
											c.weaknesses && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-xs text-amber-300/90",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
														className: "text-amber-200",
														children: "Weaknesses:"
													}),
													" ",
													c.weaknesses
												]
											}),
											c.deductions && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-xs text-rose-300",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
														className: "text-rose-200",
														children: "Deductions:"
													}),
													" ",
													c.deductions
												]
											})
										]
									})
								]
							}, c.id);
						})
					})]
				}),
				(r.strengths || r.weaknesses || r.risks || r.suggestions) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-3 sm:grid-cols-2",
					children: [
						{
							t: "Key Strengths",
							items: r.strengths,
							color: "text-emerald-400"
						},
						{
							t: "Areas for Improvement",
							items: r.weaknesses,
							color: "text-amber-400"
						},
						{
							t: "Execution Risks",
							items: r.risks,
							color: "text-rose-400"
						},
						{
							t: "Jury & AI Suggestions",
							items: r.suggestions,
							color: "text-sky-400"
						}
					].map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-white/10 bg-white/[0.02] p-3.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: `text-[10px] uppercase tracking-wider font-bold ${b.color}`,
							children: b.t
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-1.5 list-disc space-y-0.5 pl-4 text-xs text-slate-300",
							children: b.items?.map((x, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: x }, i))
						})]
					}, b.t))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xs text-slate-400",
						children: [
							"Click ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "\"Save Jury Scores\"" }),
							" to apply F7 & F8 marks and refresh the leaderboard rankings."
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [
							saveSuccess && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-semibold text-emerald-400",
								children: "✓ Scores Saved!"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								disabled: isSaving,
								onClick: handleSaveJuryScores,
								className: "rounded-lg bg-amber-300 px-5 py-2 text-xs font-bold text-black hover:bg-amber-200 shadow-[0_0_15px_rgba(251,191,36,0.3)] disabled:opacity-50",
								children: isSaving ? "Saving Scores…" : "💾 Save Jury Scores & Recalculate"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: onClose,
								className: "rounded-md border border-white/15 px-4 py-2 text-xs text-slate-200 hover:bg-white/10",
								children: "Close"
							})
						]
					})]
				})
			]
		})
	});
}
//#endregion
export { AdminDashboard as component };
