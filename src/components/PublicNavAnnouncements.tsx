import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getStudentAnnouncements, getPublicResultsData } from "@/lib/admin.functions";
import { generateAnnouncementReport, openPdfWindow } from "@/lib/pdf-reports";

export function PublicNavAnnouncements() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"results" | "announcements">("results");
  const [searchQuery, setSearchQuery] = useState("");

  const getAnnouncementsFn = useServerFn(getStudentAnnouncements);
  const getResultsFn = useServerFn(getPublicResultsData);

  const announcementsQ = useQuery({
    queryKey: ["public", "announcements"],
    queryFn: () => getAnnouncementsFn(),
    refetchInterval: 12000,
  });

  const resultsQ = useQuery({
    queryKey: ["public", "results_declaration"],
    queryFn: () => getResultsFn(),
    refetchInterval: 15000,
  });

  const announcements = announcementsQ.data?.announcements || [];
  const resultsData = resultsQ.data;
  const rawQualifiedTeams = resultsData?.qualifiedTeams || resultsData?.curatedTeams || [];
  const topics = resultsData?.topics || [];
  const hasResults = Boolean(rawQualifiedTeams.length > 0);

  const qualifiedTeams = useMemo(() => {
    if (!searchQuery.trim()) return rawQualifiedTeams;
    const q = searchQuery.toLowerCase().trim();
    return rawQualifiedTeams.filter((t: any) =>
      t.name?.toLowerCase().includes(q) ||
      t.leader_name?.toLowerCase().includes(q) ||
      t.category?.toLowerCase().includes(q)
    );
  }, [rawQualifiedTeams, searchQuery]);

  const totalNotices = announcements.length + (hasResults ? 1 : 0);

  const handlePrintPdf = () => {
    if (!rawQualifiedTeams.length) return;
    const reportData = rawQualifiedTeams.map((t: any) => ({
      ...t,
      leader_name: t.leader_name || "Team Leader",
      leader_email: t.leader_email || "",
      submissions: [],
      latest: { category: t.category },
      bestScore: t.bestScore,
    }));
    const html = generateAnnouncementReport(reportData as any, topics);
    openPdfWindow(html);
  };

  return (
    <>
      {/* Navbar Notification Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20 hover:border-emerald-400/60 transition shadow-[0_0_15px_rgba(16,185,129,0.15)] cursor-pointer"
        title="View Official Qualified Teams & Announcements"
      >
        <span className="text-sm">🔔</span>
        <span className="hidden sm:inline">Qualified Teams &amp; Notices</span>
        <span className="sm:hidden">Qualified Teams</span>
        {totalNotices > 0 && (
          <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-400 px-1 text-[10px] font-black text-black">
            {totalNotices}
          </span>
        )}
      </button>

      {/* Slide-over Drawer / Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="fixed inset-0"
            onClick={() => setIsOpen(false)}
          />

          <div className="relative z-10 flex h-full w-full max-w-xl flex-col border-l border-white/10 bg-[#0c0b16] text-slate-100 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 bg-white/[0.02]">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-400/15 border border-emerald-400/30 text-base">
                  📜
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-slate-100">
                    Official Qualified Teams &amp; Notices
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    SIH Premier 2026 Shortlisted &amp; Qualified Teams
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg border border-white/10 bg-white/5 p-1.5 text-xs text-slate-400 hover:text-white transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-white/10 px-5 bg-black/30">
              <button
                onClick={() => setActiveTab("results")}
                className={`flex items-center gap-1.5 border-b-2 px-4 py-2.5 text-xs font-bold transition cursor-pointer ${
                  activeTab === "results"
                    ? "border-emerald-400 text-emerald-300"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <span>📜</span>
                <span>Qualified Teams</span>
                {hasResults && (
                  <span className="rounded bg-emerald-400/20 px-1.5 py-0.2 text-[9px] text-emerald-300 font-bold">
                    {rawQualifiedTeams.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab("announcements")}
                className={`flex items-center gap-1.5 border-b-2 px-4 py-2.5 text-xs font-bold transition cursor-pointer ${
                  activeTab === "announcements"
                    ? "border-emerald-400 text-emerald-300"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <span>📢</span>
                <span>Bulletins &amp; Notices</span>
                <span className="rounded bg-white/10 px-1.5 py-0.2 text-[9px] text-slate-300 font-bold">
                  {announcements.length}
                </span>
              </button>
            </div>

            {/* Tab 1: Qualified Teams */}
            {activeTab === "results" && (
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {/* 1-Click PDF Download Button Banner */}
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-400/30 bg-gradient-to-r from-emerald-500/10 via-emerald-400/5 to-transparent p-4 shadow-[0_0_25px_rgba(16,185,129,0.1)]">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 block">
                      Official Shortlist Declaration
                    </span>
                    <h4 className="text-sm font-bold text-slate-100 mt-0.5">
                      1-Page Qualified Teams PDF
                    </h4>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      Official list of qualified teams with team names, leader names, and organizing authority seal.
                    </p>
                  </div>
                  <button
                    onClick={handlePrintPdf}
                    disabled={!rawQualifiedTeams.length}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-400 px-4 py-2 text-xs font-bold text-black hover:bg-emerald-300 transition shadow-[0_0_15px_rgba(16,185,129,0.3)] disabled:opacity-40 cursor-pointer"
                  >
                    <span>🖨️</span> Print / Save PDF
                  </button>
                </div>

                {/* Search Bar & Counter */}
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-2.5 text-xs text-slate-500">🔍</span>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search qualified teams, leaders, tracks…"
                      className="w-full rounded-xl border border-white/10 bg-white/5 py-2 pl-9 pr-3 text-xs text-slate-200 placeholder-slate-500 focus:border-emerald-400/50 focus:outline-none focus:ring-1 focus:ring-emerald-400/50"
                    />
                  </div>
                  <span className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[11px] font-semibold text-slate-300 shrink-0">
                    {qualifiedTeams.length} / {rawQualifiedTeams.length}
                  </span>
                </div>

                {/* Qualified Teams List */}
                {qualifiedTeams.length === 0 ? (
                  <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center text-slate-400">
                    <span className="text-3xl block mb-2">📜</span>
                    <p className="text-xs font-medium">
                      {rawQualifiedTeams.length === 0
                        ? "No qualified teams announced yet. Please check back shortly."
                        : "No teams matched your search."}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {qualifiedTeams.map((team: any, idx: number) => (
                      <div
                        key={team.id}
                        className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5 hover:border-emerald-400/30 hover:bg-emerald-500/[0.02] transition"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="flex h-5 w-5 items-center justify-center rounded-md bg-white/5 text-[10px] font-mono font-bold text-slate-400">
                                {idx + 1}
                              </span>
                              <h5 className="text-sm font-bold text-slate-100 truncate">
                                {team.name}
                              </h5>
                            </div>
                            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                              <span className="text-amber-300 font-semibold flex items-center gap-1">
                                👤 Leader: {team.leader_name || "Team Leader"}
                              </span>
                              <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                                🏷️ {team.category || "General Track"}
                              </span>
                            </div>
                          </div>

                          <span className="rounded-md border border-emerald-400/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-300 shrink-0">
                            ✓ Qualified
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Bulletins & Notices */}
            {activeTab === "announcements" && (
              <div className="flex-1 overflow-y-auto p-5 space-y-3">
                {announcements.length === 0 ? (
                  <div className="py-16 text-center text-slate-500">
                    <span className="text-3xl block mb-2">📢</span>
                    <p className="text-xs">No active notices at this time.</p>
                  </div>
                ) : (
                  announcements.map((ann: any) => (
                    <div
                      key={ann.id}
                      className={`rounded-xl border p-4 transition ${
                        ann.pinned
                          ? "border-amber-300/40 bg-amber-400/[0.04] shadow-[0_0_15px_rgba(251,191,36,0.05)]"
                          : ann.priority === "urgent"
                          ? "border-rose-500/40 bg-rose-500/[0.04]"
                          : "border-white/10 bg-white/[0.02]"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        {ann.pinned && (
                          <span className="rounded bg-amber-400/20 border border-amber-400/30 px-1.5 py-0.2 text-[9px] font-bold text-amber-300 uppercase">
                            📌 Pinned
                          </span>
                        )}
                        {ann.priority === "urgent" && (
                          <span className="rounded bg-rose-500/20 border border-rose-500/30 px-1.5 py-0.2 text-[9px] font-bold text-rose-300 uppercase">
                            ⚠️ Urgent
                          </span>
                        )}
                        <h4 className="text-xs font-bold text-slate-100">{ann.title}</h4>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                        {ann.content}
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2.5 pt-2 border-t border-white/5">
                        <span>{new Date(ann.createdAt).toLocaleDateString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                        <span>{ann.author}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
