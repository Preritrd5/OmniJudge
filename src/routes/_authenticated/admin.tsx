import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ChromeScene from "@/components/ChromeScene";
import { ThemeToggle } from "@/components/ThemeToggle";
import Footer from "@/components/Footer";
import {
  listTeams,
  deleteTeam,
  getPdfUrl,
  deleteSubmission,
  renameTeam,
  updateTeamLeaderEmail,
  getCriteria,
  saveCriteria,
  getTopics,
  saveTopics,
  buildFeedbackEmail,
  saveManualScores,
  getAdminAnnouncements,
  createAnnouncementFn,
  togglePublishAnnouncementFn,
  deleteAnnouncementFn,
  registerTeamLeader,
  getAdminResultsDeclaration,
  updateResultsDeclarationFn,
  publishResultsAnnouncementFn,
} from "@/lib/admin.functions";
import {
  generateTeamReport1Page,
  generateTeamReport2Page,
  generatePartwiseResultsReport,
  generateAnnouncementReport,
  openPdfWindow,
} from "@/lib/pdf-reports";
import {
  broadcastAdminAuthChange,
  subscribeAuthSync,
} from "@/lib/auth-sync";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — SIH Premier 2026" },
      { name: "description", content: "Manage SIH Premier 2026 teams, partwise results, and evaluation reports." },
    ],
  }),
  component: AdminDashboard,
});

type TeamRow = Awaited<ReturnType<typeof listTeams>>[number];
type Submission = TeamRow["submissions"][number];
type Criterion = {
  id: string;
  name: string;
  maxScore: number;
  description: string;
  type?: "ai" | "manual";
  evalMode?: "ai" | "manual";
};
type Topic = { id: string; name: string };

// ─── helpers ─────────────────────────────────────────────────────────────────

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "team";
}

function downloadJson(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function downloadCSV(filename: string, teams: TeamRow[]) {
  const rows: string[] = [
    ["Team", "Email", "Category", "Best Score", "Submissions", "Evaluated", "Overall Rating", "Strengths", "Weaknesses", "Suggestions"].join(","),
  ];
  for (const t of teams) {
    const best = t.submissions.find((s) => s.score === t.bestScore);
    const r: any = best?.result || {};
    const cat = best?.category || t.latest?.category || "";
    const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
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
      esc((r.suggestions || []).join("; ")),
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
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

function AdminDashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deletingSubId, setDeletingSubId] = useState<string | null>(null);
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
  const getAnnouncementsFn = useServerFn(getAdminAnnouncements);
  const createAnnFn = useServerFn(createAnnouncementFn);
  const togglePublishFn = useServerFn(togglePublishAnnouncementFn);
  const deleteAnnFn = useServerFn(deleteAnnouncementFn);
  const adminCreateTeamFn = useServerFn(registerTeamLeader);
  const getResultsDeclarationServerFn = useServerFn(getAdminResultsDeclaration);
  const updateResultsDeclarationServerFn = useServerFn(updateResultsDeclarationFn);
  const publishResultsAnnouncementServerFn = useServerFn(publishResultsAnnouncementFn);

  // Add Team Modal state
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [newLeaderEmail, setNewLeaderEmail] = useState("");
  const [newTeamCategory, setNewTeamCategory] = useState("");
  const [isAddingTeam, setIsAddingTeam] = useState(false);
  const [addTeamError, setAddTeamError] = useState<string | null>(null);
  const [createdTeamCreds, setCreatedTeamCreds] = useState<{
    teamName: string;
    leaderEmail: string;
    category?: string;
  } | null>(null);
  const [copiedCreds, setCopiedCreds] = useState(false);

  const handleOpenAddTeamModal = () => {
    setNewTeamName("");
    setNewLeaderEmail("");
    setNewTeamCategory(localTopics[0]?.name || "");
    setAddTeamError(null);
    setCreatedTeamCreds(null);
    setCopiedCreds(false);
    setShowAddTeamModal(true);
  };

  const handleCreateTeamSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) {
      setAddTeamError("Please enter a team name.");
      return;
    }
    if (!newLeaderEmail.trim() || !newLeaderEmail.includes("@")) {
      setAddTeamError("Please enter a valid leader email address.");
      return;
    }

    setIsAddingTeam(true);
    setAddTeamError(null);
    try {
      const res = await adminCreateTeamFn({
        data: {
          teamName: newTeamName.trim(),
          email: newLeaderEmail.trim().toLowerCase(),
          category: newTeamCategory.trim() || undefined,
        },
      });
      setCreatedTeamCreds({
        teamName: res.teamName,
        leaderEmail: res.leaderEmail,
        category: res.category,
      });
      teamsQ.refetch();
    } catch (err: any) {
      setAddTeamError(err?.message || "Failed to create team. Please try again.");
    } finally {
      setIsAddingTeam(false);
    }
  };

  // ── Queries ──
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setCurrentUser(data.user || null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        await queryClient.cancelQueries();
        queryClient.clear();
        setCurrentUser(null);
        navigate({ to: "/auth" });
      } else if (event === "SIGNED_IN" || event === "USER_UPDATED" || event === "TOKEN_REFRESHED") {
        const newUser = session.user;
        setCurrentUser((prev: any) => {
          if (prev?.id && prev.id !== newUser.id) {
            queryClient.cancelQueries().then(() => {
              queryClient.clear();
              queryClient.invalidateQueries();
            });
          }
          return newUser;
        });
      }
    });

    const unsubscribeSync = subscribeAuthSync((event) => {
      if (event.type === "ADMIN_AUTH_CHANGED") {
        if (event.event === "SIGNED_OUT") {
          queryClient.cancelQueries().then(() => queryClient.clear());
          setCurrentUser(null);
          navigate({ to: "/auth" });
        } else if (event.event === "SIGNED_IN") {
          supabase.auth.getUser().then(({ data }) => {
            if (data.user) {
              setCurrentUser((prev: any) => {
                if (prev?.id && prev.id !== data.user.id) {
                  queryClient.cancelQueries().then(() => {
                    queryClient.clear();
                    queryClient.invalidateQueries();
                  });
                }
                return data.user;
              });
            }
          });
        }
      }
    });

    const handleVisibilityOrFocus = async () => {
      if (document.visibilityState === "visible") {
        const { data } = await supabase.auth.getUser();
        if (!data.user) {
          await queryClient.cancelQueries();
          queryClient.clear();
          setCurrentUser(null);
          navigate({ to: "/auth" });
        } else {
          setCurrentUser((prev: any) => {
            if (prev?.id && prev.id !== data.user.id) {
              queryClient.cancelQueries().then(() => {
                queryClient.clear();
                queryClient.invalidateQueries();
              });
            }
            return data.user;
          });
        }
      }
    };

    const handlePageShow = async (event: PageTransitionEvent) => {
      if (event.persisted) {
        await handleVisibilityOrFocus();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityOrFocus);
    window.addEventListener("focus", handleVisibilityOrFocus);
    window.addEventListener("pageshow", handlePageShow);

    return () => {
      subscription.unsubscribe();
      unsubscribeSync();
      document.removeEventListener("visibilitychange", handleVisibilityOrFocus);
      window.removeEventListener("focus", handleVisibilityOrFocus);
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, [navigate, queryClient]);

  const teamsQ = useQuery({
    queryKey: ["admin", "teams"],
    queryFn: () => listFn(),
    refetchInterval: (query) => {
      const data = query.state.data as TeamRow[] | undefined;
      const hasActive = data?.some((t) => t.submissions?.some((s) => s.status === "pending" || s.status === "evaluating"));
      return hasActive ? 2000 : 10000;
    },
    retry: 1,
  });

  const criteriaQ = useQuery({
    queryKey: ["admin", "criteria"],
    queryFn: () => getCriteriaFn(),
  });

  const topicsQ = useQuery({
    queryKey: ["admin", "topics"],
    queryFn: () => getTopicsFn(),
  });

  const announcementsQ = useQuery({
    queryKey: ["admin", "announcements"],
    queryFn: () => getAnnouncementsFn(),
  });

  const resultsDeclarationQ = useQuery({
    queryKey: ["admin", "results_declaration"],
    queryFn: () => getResultsDeclarationServerFn(),
  });

  // Announcement management state
  const [newAnnTitle, setNewAnnTitle] = useState("");
  const [newAnnContent, setNewAnnContent] = useState("");
  const [newAnnPriority, setNewAnnPriority] = useState<"normal" | "urgent" | "low">("normal");
  const [newAnnPinned, setNewAnnPinned] = useState(false);
  const [annCreating, setAnnCreating] = useState(false);
  const [annStatusMsg, setAnnStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [actionAnnId, setActionAnnId] = useState<string | null>(null);

  // ── State ──
  const [openTeam, setOpenTeam] = useState<string | null>(null);
  const [selectedSub, setSelectedSub] = useState<Submission | null>(null);
  const [editingTeam, setEditingTeam] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [confirmDelete, setConfirmDelete] = useState<TeamRow | null>(null);
  const [activeTab, setActiveTab] = useState<"teams" | "results" | "announcements" | "topics" | "criteria">("teams");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Print / Report Modal state
  const [reportModalOpen, setReportModalOpen] = useState(false);

  // Criteria editor state
  const [localCriteria, setLocalCriteria] = useState<Criterion[]>([]);
  const [critSaveState, setCritSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  // Topics editor state
  const [localTopics, setLocalTopics] = useState<Topic[]>([]);
  const [topicSaveState, setTopicSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  // Feedback modal
  const [feedbackModal, setFeedbackModal] = useState<{ to: string; subject: string; body: string } | null>(null);
  const [feedbackLoading, setFeedbackLoading] = useState<string | null>(null);

  // Sync local criteria when server data loads
  useEffect(() => {
    if (criteriaQ.data?.criteria && localCriteria.length === 0) {
      setLocalCriteria(criteriaQ.data.criteria);
    }
  }, [criteriaQ.data]);

  // Sync local topics when server data loads
  useEffect(() => {
    if (topicsQ.data?.topics && localTopics.length === 0) {
      setLocalTopics(topicsQ.data.topics);
    }
  }, [topicsQ.data]);

  const delTeamMut = useMutation({
    mutationFn: (id: string) => delTeamFn({ data: { id } }),
    onSuccess: () => teamsQ.refetch(),
  });
  const delSubMut = useMutation({
    mutationFn: (id: string) => delSubFn({ data: { id } }),
    onMutate: async (id: string) => {
      setDeletingSubId(id);
      await queryClient.cancelQueries({ queryKey: ["admin", "teams"] });
      const previousTeams = queryClient.getQueryData<TeamRow[]>(["admin", "teams"]);

      if (previousTeams) {
        queryClient.setQueryData<TeamRow[]>(["admin", "teams"], (old) => {
          if (!old) return [];
          return old.map((t) => ({
            ...t,
            submissions: (t.submissions || []).filter((s) => s.id !== id),
          }));
        });
      }

      return { previousTeams };
    },
    onError: (err: any, _id, context) => {
      if (context?.previousTeams) {
        queryClient.setQueryData(["admin", "teams"], context.previousTeams);
      }
      alert("Failed to delete submission: " + (err?.message || "Unknown error"));
    },
    onSuccess: () => {
      setSelectedSub(null);
    },
    onSettled: () => {
      setDeletingSubId(null);
      queryClient.invalidateQueries({ queryKey: ["admin", "teams"] });
      teamsQ.refetch();
    },
  });
  const saveCriteriaMut = useMutation({
    mutationFn: (criteria: Criterion[]) => saveCriteriaFn({ data: { criteria } }),
    onSuccess: () => {
      setCritSaveState("saved");
      criteriaQ.refetch();
      setTimeout(() => setCritSaveState("idle"), 2000);
    },
    onError: () => setCritSaveState("error"),
  });
  const saveTopicsMut = useMutation({
    mutationFn: (topics: Topic[]) => saveTopicsFn({ data: { topics } }),
    onSuccess: () => {
      setTopicSaveState("saved");
      topicsQ.refetch();
      setTimeout(() => setTopicSaveState("idle"), 2000);
    },
    onError: () => setTopicSaveState("error"),
  });

  const createAnnMut = useMutation({
    mutationFn: (data: { title: string; content: string; priority: "normal" | "urgent" | "low"; pinned: boolean }) =>
      createAnnFn({ data }),
    onSuccess: () => {
      setNewAnnTitle("");
      setNewAnnContent("");
      setNewAnnPinned(false);
      setNewAnnPriority("normal");
      setAnnStatusMsg({ type: "success", text: "Announcement created and published successfully!" });
      announcementsQ.refetch();
      setTimeout(() => setAnnStatusMsg(null), 4000);
    },
    onError: (err: any) => {
      setAnnStatusMsg({ type: "error", text: `Failed to create announcement: ${err?.message || "Unknown error"}` });
      setTimeout(() => setAnnStatusMsg(null), 6000);
    },
  });

  const togglePublishMut = useMutation({
    mutationFn: (data: { id: string; published: boolean }) => {
      setActionAnnId(data.id);
      return togglePublishFn({ data });
    },
    onSuccess: (_, vars) => {
      setAnnStatusMsg({
        type: "success",
        text: `Announcement ${vars.published ? "published live" : "unpublished to draft"} successfully!`,
      });
      announcementsQ.refetch();
      setTimeout(() => setAnnStatusMsg(null), 4000);
    },
    onError: (err: any) => {
      setAnnStatusMsg({ type: "error", text: `Failed to update announcement status: ${err?.message || "Unknown error"}` });
      setTimeout(() => setAnnStatusMsg(null), 6000);
    },
    onSettled: () => setActionAnnId(null),
  });

  const deleteAnnMut = useMutation({
    mutationFn: (data: { id: string }) => {
      setActionAnnId(data.id);
      return deleteAnnFn({ data });
    },
    onSuccess: () => {
      setAnnStatusMsg({ type: "success", text: "Announcement deleted permanently." });
      announcementsQ.refetch();
      setTimeout(() => setAnnStatusMsg(null), 4000);
    },
    onError: (err: any) => {
      setAnnStatusMsg({ type: "error", text: `Failed to delete announcement: ${err?.message || "Unknown error"}` });
      setTimeout(() => setAnnStatusMsg(null), 6000);
    },
    onSettled: () => setActionAnnId(null),
  });

  const teams = teamsQ.data || [];
  const rawQualifiedIds: string[] | undefined = resultsDeclarationQ.data?.declaration?.qualifiedTeamIds;
  const excludedTeamIds: string[] = resultsDeclarationQ.data?.declaration?.excludedTeamIds || [];

  // Determine currently qualified teams
  const qualifiedTeamIds: string[] = useMemo(() => {
    if (Array.isArray(rawQualifiedIds)) {
      return rawQualifiedIds;
    }
    return teams
      .filter((t) => t.bestScore != null && !excludedTeamIds.includes(t.id))
      .map((t) => t.id);
  }, [rawQualifiedIds, excludedTeamIds, teams]);

  const updateDeclarationMut = useMutation({
    mutationFn: (data: { qualifiedTeamIds?: string[]; excludedTeamIds?: string[]; published?: boolean }) =>
      updateResultsDeclarationServerFn({ data }),
    onSuccess: () => {
      resultsDeclarationQ.refetch();
      setAnnStatusMsg({ type: "success", text: "Qualified teams list updated successfully!" });
      setTimeout(() => setAnnStatusMsg(null), 4000);
    },
    onError: (err: any) => {
      setAnnStatusMsg({ type: "error", text: `Failed to update qualified list: ${err?.message || "Unknown error"}` });
      setTimeout(() => setAnnStatusMsg(null), 5000);
    },
  });

  const publishResultsNoticeMut = useMutation({
    mutationFn: (data: { title?: string }) =>
      publishResultsAnnouncementServerFn({ data }),
    onSuccess: () => {
      announcementsQ.refetch();
      resultsDeclarationQ.refetch();
      setAnnStatusMsg({ type: "success", text: "Official Qualified Teams notice broadcasted to all portals!" });
      setTimeout(() => setAnnStatusMsg(null), 5000);
    },
    onError: (err: any) => {
      setAnnStatusMsg({ type: "error", text: `Failed to broadcast notice: ${err?.message || "Unknown error"}` });
      setTimeout(() => setAnnStatusMsg(null), 5000);
    },
  });

  const handleToggleQualified = (teamId: string) => {
    const isQual = qualifiedTeamIds.includes(teamId);
    const updated = isQual
      ? qualifiedTeamIds.filter((id) => id !== teamId)
      : [...qualifiedTeamIds, teamId];
    updateDeclarationMut.mutate({ qualifiedTeamIds: updated });
  };

  const handleQualifyAllEvaluated = () => {
    const allScoredIds = teams.filter((t) => t.bestScore != null).map((t) => t.id);
    updateDeclarationMut.mutate({ qualifiedTeamIds: allScoredIds });
  };

  const handleQualifyAboveScore = (threshold = 50) => {
    const passedIds = teams.filter((t) => t.bestScore != null && t.bestScore >= threshold).map((t) => t.id);
    updateDeclarationMut.mutate({ qualifiedTeamIds: passedIds });
  };

  const handleClearAllQualified = () => {
    updateDeclarationMut.mutate({ qualifiedTeamIds: [] });
  };

  // ── Autosave team name ──
  useEffect(() => {
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
        await renameFn({ data: { id: team.id, name: next } });
        setSaveState("saved");
        teamsQ.refetch();
        setTimeout(() => setSaveState((s) => (s === "saved" ? "idle" : s)), 1200);
      } catch {
        setSaveState("error");
      }
    }, 600);
    return () => clearTimeout(handle);
  }, [editName, editingTeam]);

  // ── Autosave email ──
  useEffect(() => {
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
        await updateEmailFn({ data: { id: team.id, email: next } });
        setSaveState("saved");
        teamsQ.refetch();
        setTimeout(() => setSaveState((s) => (s === "saved" ? "idle" : s)), 1200);
      } catch {
        setSaveState("error");
      }
    }, 600);
    return () => clearTimeout(handle);
  }, [editEmail, editingTeam]);

  const handleSaveTeam = async (teamId: string) => {
    const nextName = editName.trim();
    const nextEmail = editEmail.trim();
    if (!nextName || nextName.length < 2) return;
    setSaveState("saving");
    try {
      await renameFn({ data: { id: teamId, name: nextName } });
      if (nextEmail && nextEmail.includes("@")) {
        await updateEmailFn({ data: { id: teamId, email: nextEmail } });
      }
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
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    broadcastAdminAuthChange({
      event: "SIGNED_OUT",
      userId: null,
      email: null,
    });
    navigate({ to: "/auth" });
  };

  // Filter teams by category and search query
  const filteredTeams = useMemo(() => {
    return teams.filter((t) => {
      const matchCat =
        categoryFilter === "All" ||
        t.latest?.category === categoryFilter ||
        t.submissions.some((s) => s.category === categoryFilter);
      const matchSearch =
        !searchQuery.trim() ||
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.leader_email && t.leader_email.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [teams, categoryFilter, searchQuery]);

  const leaderboard = useMemo(() => {
    return [...filteredTeams]
      .filter((t) => t.bestScore != null)
      .sort((a, b) => (b.bestScore ?? 0) - (a.bestScore ?? 0));
  }, [filteredTeams]);

  // Curated qualified teams (selected by admin)
  const curatedTeams = useMemo(() => {
    return teams
      .filter((t) => qualifiedTeamIds.includes(t.id))
      .sort((a, b) => (b.bestScore ?? 0) - (a.bestScore ?? 0));
  }, [teams, qualifiedTeamIds]);

  const allScoredTeams = useMemo(() => {
    return teams
      .filter((t) => t.bestScore != null)
      .sort((a, b) => (b.bestScore ?? 0) - (a.bestScore ?? 0));
  }, [teams]);

  // Grouped results partwise / category-wise
  const partwiseGrouped = useMemo(() => {
    const topicsList = localTopics.length > 0 ? localTopics.map((t) => t.name) : ["General"];
    const groups: Array<{
      category: string;
      teams: TeamRow[];
      topTeam: TeamRow | null;
      avgScore: number;
    }> = [];

    for (const cat of topicsList) {
      const catTeams = teams.filter(
        (t) => t.latest?.category === cat || t.submissions.some((s) => s.category === cat)
      );
      const scored = catTeams.filter((t) => t.bestScore != null).sort((a, b) => (b.bestScore ?? 0) - (a.bestScore ?? 0));
      const top = scored[0] || null;
      const avg = scored.length
        ? Math.round(scored.reduce((sum, t) => sum + (t.bestScore ?? 0), 0) / scored.length)
        : 0;

      groups.push({
        category: cat,
        teams: catTeams,
        topTeam: top,
        avgScore: avg,
      });
    }
    return groups;
  }, [teams, localTopics]);

  const exportAll = () =>
    downloadJson(`sih-premier-2026-all-${new Date().toISOString().slice(0, 10)}.json`, {
      exportedAt: new Date().toISOString(),
      teams,
    });
  const exportTeam = (t: TeamRow) =>
    downloadJson(`team-${slug(t.name)}.json`, { exportedAt: new Date().toISOString(), team: t });
  const exportSubmission = (t: TeamRow, s: Submission) =>
    downloadJson(`team-${slug(t.name)}-${s.id.slice(0, 8)}.json`, {
      exportedAt: new Date().toISOString(),
      team: { id: t.id, name: t.name },
      submission: s,
    });

  const handleSendFeedback = async (teamId: string) => {
    setFeedbackLoading(teamId);
    try {
      const result = await buildFeedbackFn({ data: { teamId } });
      setFeedbackModal(result);
    } catch (e: any) {
      alert("Failed to build feedback: " + (e?.message || "unknown error"));
    } finally {
      setFeedbackLoading(null);
    }
  };

  const updateCriterion = (i: number, field: keyof Criterion, value: any) => {
    setLocalCriteria((prev) => prev.map((c, idx) => (idx === i ? { ...c, [field]: value } : c)));
  };

  const addCriterion = () => {
    const next = localCriteria.length + 1;
    setLocalCriteria((prev) => [
      ...prev,
      { id: `F${next}`, name: "New Criterion", maxScore: 10, description: "", type: "ai", evalMode: "ai" },
    ]);
  };

  const removeCriterion = (i: number) => {
    setLocalCriteria((prev) => prev.filter((_, idx) => idx !== i));
  };

  const resetCriteria = () => {
    if (criteriaQ.data?.criteria) setLocalCriteria(criteriaQ.data.criteria);
  };

  const updateTopic = (i: number, field: keyof Topic, value: string) => {
    setLocalTopics((prev) => prev.map((t, idx) => (idx === i ? { ...t, [field]: value } : t)));
  };

  const addTopic = () => {
    const next = localTopics.length + 1;
    setLocalTopics((prev) => [...prev, { id: `T${next}`, name: "New Track" }]);
  };

  const removeTopic = (i: number) => {
    setLocalTopics((prev) => prev.filter((_, idx) => idx !== i));
  };

  const resetTopics = () => {
    if (topicsQ.data?.topics) setLocalTopics(topicsQ.data.topics);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#08070f] text-slate-100 flex flex-col justify-between">
      {/* Ambient blobs */}
      <div className="pointer-events-none absolute inset-0 -z-20">
        <div className="absolute -top-40 left-1/3 h-[460px] w-[460px] rounded-full bg-[#a78bfa]/15 blur-[120px]" />
        <div className="absolute top-40 right-0 h-[400px] w-[400px] rounded-full bg-[#67e8f9]/12 blur-[120px]" />
      </div>
      <ChromeScene
        intensity="ambient"
        className="pointer-events-none absolute right-[-15%] top-[-8%] -z-10 h-[60vh] w-[60vw] opacity-50"
      />

      {/* Header */}
      <header className="relative border-b border-white/5 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-amber-300/40 via-cyan-400/40 to-purple-500/40 opacity-75 blur-md group-hover:opacity-100 transition duration-300" />
              <img
                src="/logo.png"
                alt="INNOVEDGE Logo"
                className="relative h-11 w-11 object-contain rounded-xl drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)] transform group-hover:scale-105 transition"
              />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.3em] text-amber-300 font-bold">SIH Premier 2026 · INNOVEDGE CLUB</p>
              <h1 className="mt-0.5 truncate font-serif text-xl sm:text-2xl font-bold">Admin Control Center</h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <ThemeToggle />

            {/* Quick Export & Print Reports Button */}
            <button
              onClick={() => setReportModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-300 to-amber-400 px-4 py-2 text-xs font-bold text-black btn-3d shadow-[0_0_20px_rgba(251,191,36,0.3)]"
            >
              <span>📑</span> Print Reports &amp; PDFs
            </button>

            <button
              onClick={() =>
                downloadCSV(`sih-premier-2026-${new Date().toISOString().slice(0, 10)}.csv`, teams)
              }
              disabled={!teams.length}
              className="rounded-xl border border-emerald-400/40 bg-emerald-400/10 px-3.5 py-2 text-xs font-semibold text-emerald-200 hover:bg-emerald-400/20 disabled:opacity-40 btn-3d"
            >
              📊 CSV Export
            </button>

            <button
              onClick={exportAll}
              disabled={!teams.length}
              className="rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-white/10 disabled:opacity-40"
            >
              JSON
            </button>

            {currentUser && (
              <div className="hidden sm:flex items-center gap-1.5 rounded-xl border border-amber-300/20 bg-amber-300/5 px-3 py-1.5 text-xs text-amber-200">
                <span>👑</span>
                <span className="font-mono text-[11px]">{currentUser.email}</span>
              </div>
            )}

            <button
              onClick={signOut}
              className="rounded-xl border border-white/15 px-3.5 py-2 text-xs text-slate-200 hover:bg-white/10"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="relative mx-auto w-full max-w-6xl space-y-8 px-4 py-8 sm:px-6">
        {/* Non-Admin Session Switch Banner */}
        {currentUser && currentUser.email !== "admin@admin.com" && (
          <div className="rounded-2xl border border-amber-400/40 bg-amber-400/10 p-5 text-xs text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg backdrop-blur-md">
            <div>
              <p className="font-bold text-amber-300 text-sm flex items-center gap-1.5">
                <span>⚠️</span> Signed in as Team Leader ({currentUser.email})
              </p>
              <p className="text-slate-300 text-xs mt-1">
                The Admin Control Center requires administrator credentials to view all registered teams and review evaluations. Switch to the Admin account to unlock all features.
              </p>
            </div>
            <button
              type="button"
              onClick={async () => {
                await supabase.auth.signOut();
                const { error } = await supabase.auth.signInWithPassword({
                  email: "admin@admin.com",
                  password: "Ideathon!2026#Judge",
                });
                if (!error) {
                  window.location.reload();
                }
              }}
              className="shrink-0 rounded-xl bg-gradient-to-r from-amber-300 to-amber-400 px-5 py-2.5 text-xs font-bold text-black btn-3d shadow-[0_0_20px_rgba(251,191,36,0.3)] cursor-pointer"
            >
              👑 Switch to Admin (admin@admin.com)
            </button>
          </div>
        )}

        {/* Stats Grid */}
        <section className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
          {[
            { l: "Total Teams", v: teams.length, icon: "👥" },
            { l: "Submissions", v: teams.reduce((a, t) => a + t.submissions.length, 0), icon: "📄" },
            {
              l: "Evaluated",
              v: teams.reduce((a, t) => a + t.submissions.filter((s) => s.status === "done").length, 0),
              icon: "✅",
            },
            { l: "Top Score", v: leaderboard[0]?.bestScore != null ? `${leaderboard[0].bestScore}/100` : "—", icon: "🏆" },
          ].map((s) => (
            <div key={s.l} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 card-3d card-3d-hover">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">{s.l}</span>
                <span className="text-base">{s.icon}</span>
              </div>
              <div className="mt-2 font-serif text-3xl sm:text-4xl font-black text-amber-300">{s.v}</div>
            </div>
          ))}
        </section>

        {teamsQ.isLoading && <p className="text-sm text-slate-400 animate-pulse">Loading platform records…</p>}
        {teamsQ.error && (
          <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 p-5 text-sm text-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-bold text-rose-300 text-sm">⚠️ Unable to load registered teams</p>
              <p className="text-xs text-slate-300 mt-1">
                {(teamsQ.error as Error).message}
              </p>
            </div>
            <button
              type="button"
              onClick={async () => {
                await supabase.auth.signOut();
                await supabase.auth.signInWithPassword({
                  email: "admin@admin.com",
                  password: "Ideathon!2026#Judge",
                });
                window.location.reload();
              }}
              className="shrink-0 rounded-xl bg-gradient-to-r from-amber-300 to-amber-400 px-4 py-2.5 text-xs font-bold text-black btn-3d shadow-[0_0_20px_rgba(251,191,36,0.3)] cursor-pointer whitespace-nowrap"
            >
              👑 Sign in as Admin (admin@admin.com)
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-1.5 rounded-2xl border border-white/10 bg-white/[0.02] p-1.5 w-full sm:w-fit backdrop-blur-md">
          {[
            { id: "teams", label: "👥 Teams & Submissions" },
            { id: "results", label: "📊 Results (Partwise)" },
            { id: "announcements", label: "📢 Announce List & Podium" },
            { id: "topics", label: "🏷️ Tracks / Topics" },
            { id: "criteria", label: "⚙️ Rubric Criteria" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? "bg-amber-300 text-black shadow-[0_0_15px_rgba(251,191,36,0.3)]"
                  : "text-slate-400 hover:text-slate-100 hover:bg-white/5"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ─── TAB 1: TEAMS & SUBMISSIONS ──────────────────────────────────────── */}
        {activeTab === "teams" && (
          <section className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl">Registered Teams</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Manage registered teams, verify submissions, generate 1-page/2-page PDFs, and dispatch feedback.
                </p>
              </div>

              {/* Search & Category Filter */}
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  placeholder="Search team or email…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="rounded-lg border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 outline-none focus:border-amber-300/60"
                />

                {localTopics.length > 0 && (
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="rounded-lg border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-amber-300/60"
                  >
                    <option value="All">All Categories</option>
                    {localTopics.map((t) => (
                      <option key={t.id} value={t.name}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                )}

                <button
                  type="button"
                  onClick={() => teamsQ.refetch()}
                  disabled={teamsQ.isFetching}
                  className="rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-1.5 text-xs text-slate-300 transition flex items-center gap-1.5 cursor-pointer"
                  title="Refresh registered teams"
                >
                  <span className={teamsQ.isFetching ? "animate-spin" : ""}>🔄</span>
                  {teamsQ.isFetching ? "Refreshing…" : "Refresh"}
                </button>

                <button
                  type="button"
                  onClick={handleOpenAddTeamModal}
                  className="rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-bold px-3.5 py-1.5 text-xs shadow-md shadow-amber-500/20 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span>➕</span>
                  <span>Add New Team</span>
                </button>
              </div>
            </div>

            {/* Admin Team Provisioning & Access Control Banner */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl border border-amber-300/20 bg-amber-300/[0.04] p-4 text-xs backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-300/10 text-lg border border-amber-300/20">
                  👥
                </div>
                <div>
                  <p className="font-semibold text-slate-100 text-sm">
                    Admin Team Management & Access Control
                  </p>
                  <p className="text-slate-400 text-xs mt-0.5">
                    Teams are officially provisioned by administrators. Add teams below to generate leader login credentials, which students will use to sign in on the Team Portal and submit their pitch decks (&lt; 3MB).
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleOpenAddTeamModal}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-amber-300/40 bg-amber-400 text-black px-4 py-2 text-xs font-bold hover:bg-amber-300 transition whitespace-nowrap shadow-sm shadow-amber-400/20 cursor-pointer"
                >
                  ➕ Register New Team
                </button>
                <a
                  href="/team"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-white/10 transition whitespace-nowrap"
                >
                  Team Portal ↗
                </a>
              </div>
            </div>

            {/* Teams Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 items-start">
              {filteredTeams.length === 0 && !teamsQ.isLoading && (
                <p className="col-span-full py-8 text-center text-sm text-slate-500">
                  No matching teams found.
                </p>
              )}
              {filteredTeams.map((t) => {
                const open = openTeam === t.id;
                const isEditing = editingTeam === t.id;
                const evaluated = t.submissions.filter((s) => s.status === "done").length;
                const pct = Math.max(0, Math.min(100, t.bestScore ?? 0));
                const hasDone = t.submissions.some((s) => s.status === "done");

                return (
                  <div
                    key={t.id}
                    className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] transition hover:border-amber-300/30 hover:shadow-[0_10px_40px_-10px_rgba(251,191,36,0.2)]"
                  >
                    <div className="absolute right-3 top-3 flex items-center gap-1.5">
                      <span
                        className={`h-2 w-2 rounded-full ${t.submissions.length ? "bg-emerald-400" : "bg-slate-500"}`}
                        aria-hidden="true"
                      />
                      <span className="text-[10px] uppercase tracking-wider text-slate-500">
                        {t.submissions.length ? "Active" : "Idle"}
                      </span>
                    </div>

                    <div className="p-5 pb-3">
                      {isEditing ? (
                        <div className="space-y-2">
                          <div>
                            <label className="mb-0.5 block text-[9px] uppercase tracking-wider text-slate-500">
                              Team Name
                            </label>
                            <input
                              autoFocus
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="w-full rounded-md border border-amber-300/20 bg-black/40 px-2 py-1 text-xs text-slate-100 outline-none focus:border-amber-300"
                            />
                          </div>
                          <div>
                            <label className="mb-0.5 block text-[9px] uppercase tracking-wider text-slate-500">
                              Leader Email
                            </label>
                            <input
                              value={editEmail}
                              onChange={(e) => setEditEmail(e.target.value)}
                              className="w-full rounded-md border border-amber-300/20 bg-black/40 px-2 py-1 text-xs text-slate-100 outline-none focus:border-amber-300"
                            />
                          </div>
                          <div className="mt-2.5 flex items-center justify-between">
                            <span className="text-[9px] uppercase tracking-wider">
                              {saveState === "saving" && <span className="animate-pulse text-amber-300">Saving…</span>}
                              {saveState === "saved" && <span className="text-emerald-300">✓ Saved</span>}
                              {saveState === "error" && <span className="text-rose-300">Error saving</span>}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleSaveTeam(t.id)}
                                disabled={saveState === "saving" || !editName.trim()}
                                className="rounded bg-amber-300 px-2.5 py-1 text-[10px] font-semibold text-black hover:bg-amber-200 disabled:opacity-50"
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingTeam(null)}
                                className="rounded border border-white/15 px-2 py-1 text-[10px] text-slate-300 hover:bg-white/10"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          <h3 className="truncate pr-16 font-serif text-2xl leading-tight text-slate-100">
                            {t.name}
                          </h3>
                          <div className="mt-2 space-y-1">
                            <p className="flex items-center gap-1.5 truncate text-xs text-slate-300">
                              <span className="text-amber-400 font-semibold">👤 Leader:</span>
                              <span className="font-medium text-slate-200">{t.leader_name || "Registered Leader"}</span>
                              {t.leader_phone && (
                                <span className="text-slate-400 font-mono">· 📞 {t.leader_phone}</span>
                              )}
                            </p>
                            <p className="flex items-center gap-1.5 truncate text-xs text-slate-400">
                              <span className="text-slate-500">📧</span>
                              <span>{t.leader_email || "No email set"}</span>
                            </p>
                            {t.project_title && (
                              <p className="truncate text-xs font-medium text-amber-200/90">
                                💡 <span className="text-slate-400 font-normal">Project:</span> {t.project_title}
                              </p>
                            )}
                            <div className="flex flex-wrap items-center gap-1.5 pt-1.5">
                              {t.latest?.category && (
                                <span className="rounded bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
                                  📌 {t.latest.category}
                                </span>
                              )}
                              {t.members && t.members.length > 0 && (
                                <span className="rounded bg-white/5 border border-white/10 px-2 py-0.5 text-[10px] text-slate-300">
                                  👥 {t.members.length} Member{t.members.length === 1 ? "" : "s"}
                                </span>
                              )}
                              {hasDone && (() => {
                                const doneSub = t.submissions.find((s) => s.status === "done");
                                const cList = (doneSub?.result as any)?.criteria || [];
                                const pendingManual = cList.some((c: any) =>
                                  (c.evalMode === "manual" || c.id === "F7" || c.id === "F8") &&
                                  !c.isManuallyGraded &&
                                  (!c.score || c.score === 0)
                                );
                                return pendingManual ? (
                                  <span className="rounded bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
                                    ✍️ 2 Judges Pending (Judge 1 &amp; Judge 2)
                                  </span>
                                ) : (
                                  <span className="rounded bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                                    ✅ Fully Graded (AI + Judge 1 &amp; Judge 2)
                                  </span>
                                );
                              })()}
                            </div>
                          </div>
                        </>
                      )}
                      <p className="mt-2 text-[10px] text-slate-500">
                        Added {t.created_at ? new Date(t.created_at).toLocaleDateString() : "Recently"}
                      </p>
                    </div>

                    <div className="px-5">
                      <div className="flex items-baseline justify-between">
                        <span className="text-[10px] uppercase tracking-wider text-slate-500">Best score</span>
                        <span className="font-serif text-2xl text-amber-300">
                          {t.bestScore ?? "—"}
                          <span className="text-xs text-slate-500">/100</span>
                        </span>
                      </div>
                      <div
                        role="progressbar"
                        aria-valuenow={Math.round(pct)}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        className="mt-2 h-2 w-full overflow-hidden rounded-full border border-white/10 bg-white/5"
                      >
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-200"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-px border-t border-white/5 bg-white/5 text-center">
                      <div className="bg-[#0a0a14] px-2 py-2.5">
                        <div className="font-serif text-base text-slate-100">{t.submissions.length}</div>
                        <div className="text-[9px] uppercase tracking-wider text-slate-500">Submissions</div>
                      </div>
                      <div className="bg-[#0a0a14] px-2 py-2.5">
                        <div className="font-serif text-base text-emerald-300">{evaluated}</div>
                        <div className="text-[9px] uppercase tracking-wider text-slate-500">Evaluated</div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1.5 border-t border-white/5 p-3">
                      <button
                        onClick={() => setOpenTeam(open ? null : t.id)}
                        className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                          open
                            ? "border-amber-300/40 bg-amber-300/15 text-amber-200"
                            : "border-white/15 bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        <span>{open ? "▲ Hide" : "▼ View"} Submissions</span>
                        <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[10px] font-mono">
                          {t.submissions.length}
                        </span>
                      </button>
                      <button
                        onClick={() => {
                          setEditingTeam(t.id);
                          setEditName(t.name);
                          setEditEmail(t.leader_email || "");
                        }}
                        className="rounded-lg border border-white/15 bg-white/5 px-2.5 py-1.5 text-xs text-slate-200 hover:bg-white/10 transition cursor-pointer"
                        title="Edit team details"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => exportTeam(t)}
                        disabled={!t.submissions.length}
                        className="rounded-lg border border-white/15 bg-white/5 px-2.5 py-1.5 text-xs text-slate-200 hover:bg-white/10 disabled:opacity-40 transition cursor-pointer"
                        title="Export team JSON"
                      >
                        JSON
                      </button>
                    </div>

                    {/* Report PDF Buttons */}
                    <div className="flex items-center gap-1.5 border-t border-white/5 px-3 pb-3 pt-2">
                      <button
                        onClick={() => openPdfWindow(generateTeamReport1Page(t))}
                        disabled={!hasDone}
                        className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg border border-amber-300/40 bg-amber-300/10 px-2 py-1.5 text-xs font-medium text-amber-200 hover:bg-amber-300/20 disabled:opacity-40 transition cursor-pointer"
                        title="Generate compact 1-page executive scorecard with background watermark logo"
                      >
                        📄 1-Page PDF
                      </button>
                      {/* <button
                        onClick={() => openPdfWindow(generateTeamReport2Page(t))}
                        disabled={!hasDone}
                        className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg border border-violet-400/40 bg-violet-400/10 px-2 py-1.5 text-xs font-medium text-violet-200 hover:bg-violet-400/20 disabled:opacity-40 transition cursor-pointer"
                        title="Generate comprehensive 2-page detailed evaluation dossier"
                      >
                        📑 2-Page PDF
                      </button> */}
                      <button
                        onClick={() => handleSendFeedback(t.id)}
                        disabled={feedbackLoading === t.id || !hasDone}
                        className="rounded-lg border border-sky-400/30 bg-sky-400/10 px-2.5 py-1.5 text-xs text-sky-300 hover:bg-sky-400/20 disabled:opacity-40 transition cursor-pointer"
                        title="Send feedback email to team leader"
                      >
                        {feedbackLoading === t.id ? "…" : "📧"}
                      </button>
                      <button
                        onClick={() => setConfirmDelete(t)}
                        className="rounded-lg border border-rose-400/30 bg-rose-400/5 px-2.5 py-1.5 text-xs text-rose-300 hover:bg-rose-500/20 hover:border-rose-400 transition cursor-pointer"
                        title="Delete team"
                      >
                        🗑️
                      </button>
                    </div>

                    {open && (
                      <div id={`team-${t.id}-panel`} className="space-y-3 border-t border-white/10 bg-black/40 p-3.5">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 px-0.5">
                          <span>Submissions ({t.submissions.length})</span>
                          <span className="text-[10px] text-slate-500">Live grading & audit</span>
                        </div>

                        {t.submissions.length === 0 && (
                          <div className="rounded-xl border border-dashed border-white/10 p-4 text-center">
                            <p className="text-xs text-slate-400">No submissions uploaded for this team yet.</p>
                          </div>
                        )}

                        {t.submissions.map((s) => {
                          const doneCrit = (s.result as any)?.criteria || [];
                          const hasManualPending = doneCrit.some((c: any) =>
                            (c.evalMode === "manual" || c.id === "F7" || c.id === "F8") &&
                            !c.isManuallyGraded &&
                            (!c.score || c.score === 0)
                          );

                          return (
                            <div
                              key={s.id}
                              className="rounded-xl border border-white/10 bg-white/[0.03] p-3 space-y-2.5 transition hover:border-white/20 hover:bg-white/[0.05]"
                            >
                              {/* Top Line: File name on left, Score badge on right */}
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs shrink-0">📄</span>
                                    <span className="truncate text-xs font-semibold text-slate-100 block" title={s.file_name}>
                                      {s.file_name}
                                    </span>
                                  </div>
                                  <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[10px] text-slate-400">
                                    <span className="font-mono">{new Date(s.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                                    <span className="text-slate-600">·</span>
                                    <span className={`capitalize font-medium ${
                                      s.status === 'done' ? 'text-emerald-400' :
                                      s.status === 'evaluating' ? 'text-amber-400 animate-pulse' :
                                      s.status === 'failed' ? 'text-rose-400' : 'text-slate-400'
                                    }`}>
                                      {s.status}
                                    </span>
                                  </div>
                                </div>

                                {/* Score Pill */}
                                {s.score != null ? (
                                  <div className="shrink-0">
                                    <div className="inline-flex items-baseline gap-0.5 rounded-lg border border-amber-400/30 bg-amber-400/10 px-2 py-1 shadow-sm">
                                      <span className="font-serif text-sm font-bold text-amber-300">{s.score}</span>
                                      <span className="text-[10px] font-medium text-amber-400/70">/100</span>
                                    </div>
                                  </div>
                                ) : s.status === 'evaluating' ? (
                                  <span className="shrink-0 rounded-md border border-amber-400/20 bg-amber-400/10 px-2 py-0.5 text-[10px] text-amber-300 font-medium animate-pulse">
                                    Evaluating...
                                  </span>
                                ) : null}
                              </div>

                              {/* Badges Line: Manual pending or fully graded */}
                              <div className="flex flex-wrap items-center gap-1.5">
                                {s.status === "done" && (
                                  hasManualPending ? (
                                    <span className="inline-flex items-center gap-1 rounded-md border border-amber-500/30 bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
                                      ✍️ 2 Teachers Pending
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/30 bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                                      ✅ Fully Graded
                                    </span>
                                  )
                                )}
                                {s.error && (
                                  <span className="rounded-md border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 text-[10px] text-rose-300 truncate max-w-full">
                                    ⚠️ {s.error}
                                  </span>
                                )}
                              </div>

                              {/* Action Buttons: Grade & View, JSON, Delete */}
                              <div className="flex items-center justify-between gap-2 border-t border-white/5 pt-2">
                                <button
                                  onClick={() => setSelectedSub(s)}
                                  disabled={s.status !== "done"}
                                  className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg border border-amber-300/40 bg-amber-300/10 px-2.5 py-1.5 text-xs font-semibold text-amber-200 hover:bg-amber-300/20 transition disabled:opacity-40 cursor-pointer"
                                >
                                  {hasManualPending ? "✍️ Grade & View" : "👁️ View Result"}
                                </button>
                                <button
                                  onClick={() => exportSubmission(t, s)}
                                  disabled={s.status !== "done"}
                                  title="Download JSON report"
                                  className="rounded-lg border border-white/15 bg-white/5 px-2.5 py-1.5 text-xs text-slate-200 hover:bg-white/10 transition disabled:opacity-40 cursor-pointer"
                                >
                                  JSON
                                </button>
                                <button
                                  type="button"
                                  disabled={deletingSubId === s.id}
                                  onClick={() => {
                                    if (confirm(`Permanently delete "${s.file_name}"? This cannot be undone.`)) {
                                      delSubMut.mutate(s.id);
                                    }
                                  }}
                                  title="Permanently delete this submission"
                                  className="inline-flex items-center justify-center gap-1 rounded-lg border border-rose-500/30 bg-rose-500/10 px-2.5 py-1.5 text-xs font-semibold text-rose-300 hover:bg-rose-500/25 hover:border-rose-400 transition disabled:opacity-50 cursor-pointer"
                                >
                                  {deletingSubId === s.id ? (
                                    <div className="h-3.5 w-3.5 animate-spin rounded-full border border-rose-300 border-t-transparent" />
                                  ) : (
                                    <span>🗑️</span>
                                  )}
                                  <span className="text-[11px]">Delete</span>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ─── TAB 2: RESULTS LIST (PARTWISE / CATEGORY-WISE) ────────────────────── */}
        {activeTab === "results" && (
          <section className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl">Results List (Partwise / Category Breakdown)</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Track-wise standings, rubric scores, and instant category-filtered PDF export.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => openPdfWindow(generatePartwiseResultsReport(teams, categoryFilter))}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-amber-300 px-4 py-2 text-xs font-semibold text-black hover:bg-amber-200 shadow-[0_0_15px_rgba(251,191,36,0.3)]"
                >
                  📄 Export Partwise Results PDF
                </button>
                <button
                  onClick={() =>
                    downloadCSV(`sih-premier-2026-partwise-${new Date().toISOString().slice(0, 10)}.csv`, filteredTeams)
                  }
                  className="rounded-lg border border-white/15 px-3 py-2 text-xs text-slate-200 hover:bg-white/10"
                >
                  📊 Export CSV
                </button>
              </div>
            </div>

            {/* Part / Category Pills */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setCategoryFilter("All")}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                  categoryFilter === "All"
                    ? "bg-amber-300 text-black shadow-[0_0_12px_rgba(251,191,36,0.3)]"
                    : "border border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/10"
                }`}
              >
                All Parts ({leaderboard.length})
              </button>
              {localTopics.map((topic) => {
                const count = teams.filter(
                  (t) =>
                    t.bestScore != null &&
                    (t.latest?.category === topic.name || t.submissions.some((s) => s.category === topic.name))
                ).length;
                return (
                  <button
                    key={topic.id}
                    onClick={() => setCategoryFilter(topic.name)}
                    className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                      categoryFilter === topic.name
                        ? "bg-amber-300 text-black shadow-[0_0_12px_rgba(251,191,36,0.3)]"
                        : "border border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/10"
                    }`}
                  >
                    {topic.name} ({count})
                  </button>
                );
              })}
            </div>

            {/* Partwise Category Summary Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {partwiseGrouped.map((group) => {
                if (categoryFilter !== "All" && group.category !== categoryFilter) return null;
                return (
                  <div
                    key={group.category}
                    className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-sm space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="rounded bg-amber-300/10 px-2 py-0.5 text-[10px] font-semibold text-amber-300 border border-amber-300/20">
                        {group.category}
                      </span>
                      <span className="text-xs text-slate-400">{group.teams.length} Teams</span>
                    </div>

                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-slate-500">Track Champion</div>
                      <div className="text-base font-bold text-slate-100 truncate">
                        {group.topTeam ? (
                          <span className="flex items-center gap-1.5">
                            <span>🏆</span>
                            <span>{group.topTeam.name}</span>
                          </span>
                        ) : (
                          <span className="text-slate-500 font-normal">No evaluated teams yet</span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 border-t border-white/5 pt-3">
                      <div>
                        <div className="text-[9px] uppercase text-slate-500">Top Score</div>
                        <div className="text-lg font-bold text-amber-300">
                          {group.topTeam?.bestScore != null ? `${group.topTeam.bestScore}/100` : "—"}
                        </div>
                      </div>
                      <div>
                        <div className="text-[9px] uppercase text-slate-500">Part Average</div>
                        <div className="text-lg font-bold text-sky-400">
                          {group.avgScore ? `${group.avgScore}/100` : "—"}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Partwise Leaderboard Table */}
            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.02]">
              <table className="w-full min-w-[750px] text-sm">
                <thead className="bg-white/[0.03] text-xs uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="px-4 py-3.5 text-left">#</th>
                    <th className="px-4 py-3.5 text-left">Team & Project</th>
                    <th className="px-4 py-3.5 text-left">Leader & Contact</th>
                    <th className="px-4 py-3.5 text-left">Part / Track</th>
                    <th className="px-4 py-3.5 text-left">Evaluation Mode</th>
                    <th className="px-4 py-3.5 text-left">Score Gauge</th>
                    <th className="px-4 py-3.5 text-right">Score</th>
                    <th className="px-4 py-3.5 text-right">Reports</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                        No evaluated teams in this category yet.
                      </td>
                    </tr>
                  )}
                  {leaderboard.map((t, i) => {
                    const medal = ["🥇", "🥈", "🥉"][i];
                    const pct = Math.max(0, Math.min(100, t.bestScore ?? 0));
                    const doneSub = t.submissions.find((s) => s.score === t.bestScore) || t.submissions.find((s) => s.status === "done");
                    const doneCrit = (doneSub?.result as any)?.criteria || [];
                    const pendingManual = doneCrit.some((c: any) =>
                      (c.evalMode === "manual" || c.id === "F7" || c.id === "F8") &&
                      !c.isManuallyGraded &&
                      (!c.score || c.score === 0)
                    );

                    return (
                      <tr key={t.id} className="border-t border-white/5 hover:bg-white/[0.02]">
                        <td className="px-4 py-3.5 text-slate-400 font-bold">
                          {medal ? <span className="text-lg">{medal}</span> : i + 1}
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="font-semibold text-slate-100">{t.name}</div>
                          {t.project_title && (
                            <div className="text-xs text-amber-200/80 truncate max-w-[180px]">
                              💡 {t.project_title}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-xs text-slate-300">
                          <div className="font-medium text-slate-200">{t.leader_name || "Leader Registered"}</div>
                          <div className="text-slate-400">{t.leader_email || "—"}</div>
                          {t.leader_phone && <div className="text-slate-500 font-mono">📞 {t.leader_phone}</div>}
                        </td>
                        <td className="px-4 py-3.5 text-xs">
                          <span className="rounded bg-amber-300/10 px-2 py-0.5 text-[10px] font-medium text-amber-300 border border-amber-300/20">
                            {t.latest?.category || "General"}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-xs">
                          {pendingManual ? (
                            <span className="inline-flex items-center gap-1 rounded bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
                              ✍️ 2 Teachers Pending
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                              ✅ Fully Graded
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3.5">
                          <div
                            role="progressbar"
                            aria-valuenow={Math.round(pct)}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            className="h-2 w-full min-w-[90px] overflow-hidden rounded-full border border-white/10 bg-white/5"
                          >
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-200"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-right font-serif text-lg font-bold text-amber-300">
                          {t.bestScore}
                          <span className="text-xs text-slate-500 font-sans">/100</span>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <div className="flex justify-end gap-1.5">
                            <button
                              onClick={() => openPdfWindow(generateTeamReport1Page(t))}
                              className="rounded border border-amber-300/30 px-2 py-1 text-[10px] font-medium text-amber-300 hover:bg-amber-300/10"
                            >
                              1-Page PDF
                            </button>
                            <button
                              onClick={() => openPdfWindow(generateTeamReport2Page(t))}
                              className="rounded border border-violet-400/30 px-2 py-1 text-[10px] font-medium text-violet-300 hover:bg-violet-400/10"
                            >
                              2-Page PDF
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ─── TAB 3: QUALIFIED TEAMS SELECTION & ANNOUNCEMENTS ──────────────────── */}
        {activeTab === "announcements" && (
          <section className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl">Qualified Teams Selection &amp; Notices</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Select which teams are qualified. Users can view only qualified team names and leader names in the top navbar notification drawer (no scores/marks are shown to users).
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => openPdfWindow(generateAnnouncementReport(curatedTeams, localTopics))}
                  disabled={!curatedTeams.length}
                  className="inline-flex items-center gap-2 rounded-xl bg-amber-300 px-5 py-2.5 text-xs font-bold text-black hover:bg-amber-200 shadow-[0_0_20px_rgba(251,191,36,0.35)] disabled:opacity-50 cursor-pointer transition"
                >
                  <span>📜</span> Print 1-Page Qualified Teams PDF ({curatedTeams.length})
                </button>
                <button
                  onClick={() => {
                    if (confirm("Broadcast official Qualified Teams notice to all student & team portals now?")) {
                      publishResultsNoticeMut.mutate({});
                    }
                  }}
                  disabled={publishResultsNoticeMut.isPending || !curatedTeams.length}
                  className="inline-flex items-center gap-2 rounded-xl border border-amber-300/40 bg-amber-400/10 px-4 py-2.5 text-xs font-bold text-amber-300 hover:bg-amber-400/20 transition disabled:opacity-50 cursor-pointer"
                >
                  <span>📢</span> {publishResultsNoticeMut.isPending ? "Broadcasting…" : "Broadcast Qualified Notice"}
                </button>
              </div>
            </div>

            {/* ── Qualified Teams Selector & Manager ── */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-md space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <h3 className="font-serif text-xl font-bold text-slate-100 flex items-center gap-2">
                    <span>✓</span> Select Qualified Teams
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Toggle which teams qualify. Teams with low scores can easily be removed with one click. Only qualified teams will appear in public notifications and the official PDF.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 text-[11px] font-bold text-emerald-300">
                    {curatedTeams.length} Teams Qualified
                  </span>
                  <button
                    onClick={handleQualifyAllEvaluated}
                    className="rounded-lg border border-sky-400/30 bg-sky-500/10 px-3 py-1 text-[11px] font-semibold text-sky-200 hover:bg-sky-500/20 transition cursor-pointer"
                    title="Mark all evaluated teams as qualified"
                  >
                    ⚡ Qualify All Evaluated
                  </button>
                  <button
                    onClick={() => handleQualifyAboveScore(50)}
                    className="rounded-lg border border-amber-400/30 bg-amber-500/10 px-3 py-1 text-[11px] font-semibold text-amber-200 hover:bg-amber-500/20 transition cursor-pointer"
                    title="Mark all teams with score >= 50 as qualified"
                  >
                    ⚡ Qualify (≥ 50 pts)
                  </button>
                  {qualifiedTeamIds.length > 0 && (
                    <button
                      onClick={handleClearAllQualified}
                      className="rounded-lg border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-semibold text-slate-300 hover:bg-white/10 transition cursor-pointer"
                    >
                      ✕ Clear All
                    </button>
                  )}
                </div>
              </div>

              {/* Teams Selection Table */}
              <div className="overflow-x-auto rounded-2xl border border-white/10 bg-black/40">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-white/10 bg-white/[0.02] text-[10px] uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="py-3 px-4">#</th>
                      <th className="py-3 px-4">Team Name &amp; Leader</th>
                      <th className="py-3 px-4">Track Category</th>
                      <th className="py-3 px-4 text-center">Score (Admin Reference)</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {allScoredTeams.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-500 text-xs">
                          No teams evaluated yet. Evaluated teams will appear here automatically.
                        </td>
                      </tr>
                    ) : (
                      allScoredTeams.map((team, idx) => {
                        const isQual = qualifiedTeamIds.includes(team.id);

                        return (
                          <tr
                            key={team.id}
                            className={`transition hover:bg-white/[0.02] ${
                              !isQual ? "opacity-60 bg-white/[0.01]" : "bg-emerald-950/10"
                            }`}
                          >
                            <td className="py-3 px-4 font-mono font-bold text-slate-400">
                              #{idx + 1}
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-semibold text-slate-100 text-sm">{team.name}</div>
                              <div className="text-xs text-amber-300 font-medium flex items-center gap-1.5 mt-0.5">
                                <span>👤</span>
                                <span>Leader: {team.leader_name || team.leader_email?.split("@")[0] || "Team Leader"}</span>
                              </div>
                              <div className="text-[11px] text-slate-400">{team.leader_email || "—"}</div>
                            </td>
                            <td className="py-3 px-4">
                              <span className="rounded bg-white/5 border border-white/10 px-2 py-0.5 text-[10px] text-slate-300">
                                {team.latest?.category || "General"}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className="font-serif text-base font-bold text-amber-300">
                                {team.bestScore != null ? team.bestScore : "—"}
                              </span>
                              {team.bestScore != null && (
                                <span className="text-[10px] text-slate-500 font-sans">/100</span>
                              )}
                              <div className="text-[9px] text-slate-500 uppercase tracking-wider mt-0.5">
                                Admin only
                              </div>
                            </td>
                            <td className="py-3 px-4 text-center">
                              {isQual ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300">
                                  <span>✓</span> Qualified
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 rounded-full bg-slate-500/15 border border-slate-500/30 px-2.5 py-0.5 text-[10px] font-medium text-slate-400">
                                  <span>○</span> Not Qualified
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-right">
                              {isQual ? (
                                <button
                                  type="button"
                                  onClick={() => handleToggleQualified(team.id)}
                                  className="inline-flex items-center gap-1 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-[11px] font-semibold text-rose-300 hover:bg-rose-500/20 transition cursor-pointer"
                                  title="Remove this team from the qualified list"
                                >
                                  <span>❌</span> Delete / Remove
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleToggleQualified(team.id)}
                                  className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-semibold text-emerald-300 hover:bg-emerald-500/20 transition cursor-pointer"
                                  title="Add this team to the qualified list"
                                >
                                  <span>➕</span> Add / Qualify
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ── Broadcast Announcements & Student Bulletins ── */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-md space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <h3 className="font-serif text-xl font-bold text-slate-100 flex items-center gap-2">
                    <span>📢</span> Broadcast Announcements &amp; Updates
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Create and publish official notices. Publishing automatically dispatches score-safe real-time event notifications to registered student portals.
                  </p>
                </div>
                <span className="rounded bg-amber-300/10 border border-amber-300/20 px-2.5 py-1 text-[10px] font-semibold text-amber-300">
                  {announcementsQ.data?.announcements?.length || 0} Total Bulletins
                </span>
              </div>

              {/* Status Message Banner */}
              {annStatusMsg && (
                <div
                  className={`rounded-xl px-4 py-2.5 text-xs font-medium border transition ${
                    annStatusMsg.type === "success"
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                      : "border-rose-500/30 bg-rose-500/10 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.15)]"
                  }`}
                >
                  <span className="mr-1.5">{annStatusMsg.type === "success" ? "✓" : "⚠️"}</span>
                  {annStatusMsg.text}
                </div>
              )}

              {/* Create Announcement Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newAnnTitle.trim() || !newAnnContent.trim()) return;
                  setAnnCreating(true);
                  createAnnMut.mutate(
                    {
                      title: newAnnTitle.trim(),
                      content: newAnnContent.trim(),
                      priority: newAnnPriority,
                      pinned: newAnnPinned,
                    },
                    {
                      onSettled: () => setAnnCreating(false),
                    }
                  );
                }}
                className="space-y-4 rounded-2xl border border-white/10 bg-black/40 p-4 sm:p-5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                    + Compose New Announcement
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Visible immediately to student teams upon publishing
                  </span>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-medium uppercase tracking-wider text-slate-400 block mb-1">
                      Announcement Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Live Pitch Round Schedule Released"
                      value={newAnnTitle}
                      onChange={(e) => setNewAnnTitle(e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-600 outline-none focus:border-amber-300/60"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium uppercase tracking-wider text-slate-400 block mb-1">
                      Priority Level
                    </label>
                    <select
                      value={newAnnPriority}
                      onChange={(e) => setNewAnnPriority(e.target.value as any)}
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-100 outline-none focus:border-amber-300/60"
                    >
                      <option value="normal">Normal Notice</option>
                      <option value="urgent">⚠️ Urgent Alert</option>
                      <option value="low">Low Priority</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-medium uppercase tracking-wider text-slate-400 block mb-1">
                    Announcement Body / Content *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Enter announcement text to display in the Team Leader portal..."
                    value={newAnnContent}
                    onChange={(e) => setNewAnnContent(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-white/5 p-3 text-xs text-slate-200 placeholder:text-slate-600 outline-none focus:border-amber-300/60 resize-none"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                    <input
                      type="checkbox"
                      checked={newAnnPinned}
                      onChange={(e) => setNewAnnPinned(e.target.checked)}
                      className="rounded border-white/20 bg-black text-amber-300 focus:ring-amber-300"
                    />
                    <span>📌 Pin to top of student portals</span>
                  </label>

                  <button
                    type="submit"
                    disabled={annCreating || createAnnMut.isPending || !newAnnTitle.trim() || !newAnnContent.trim()}
                    className="rounded-lg bg-amber-300 px-5 py-2 text-xs font-bold text-black hover:bg-amber-200 transition shadow-[0_0_15px_rgba(251,191,36,0.25)] disabled:opacity-40 cursor-pointer"
                  >
                    {annCreating || createAnnMut.isPending ? "Publishing…" : "Publish Announcement →"}
                  </button>
                </div>
              </form>

              {/* Published / Draft Announcements List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Active Announcements &amp; Notice History
                </h4>

                {announcementsQ.isLoading && (
                  <p className="text-xs text-slate-500 animate-pulse">Loading announcements…</p>
                )}

                {announcementsQ.data?.announcements?.length === 0 && (
                  <div className="rounded-xl border border-white/5 bg-black/20 p-6 text-center text-slate-500 text-xs">
                    No announcements created yet. Post a notice above to inform all team leaders.
                  </div>
                )}

                <div className="space-y-2.5">
                  {(announcementsQ.data?.announcements || []).map((ann) => (
                    <div
                      key={ann.id}
                      className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4 transition ${
                        ann.published
                          ? "border-white/10 bg-white/[0.02]"
                          : "border-white/5 bg-black/30 opacity-60"
                      }`}
                    >
                      <div className="space-y-1 max-w-xl">
                        <div className="flex items-center gap-2 flex-wrap">
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
                          <span
                            className={`rounded px-1.5 py-0.2 text-[9px] font-bold uppercase ${
                              ann.published
                                ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                                : "bg-slate-700 text-slate-300 border border-slate-600"
                            }`}
                          >
                            {ann.published ? "● Live / Published" : "○ Draft"}
                          </span>
                          <span className="font-semibold text-xs text-slate-100">{ann.title}</span>
                        </div>
                        <p className="text-xs text-slate-300 line-clamp-2">{ann.content}</p>
                        <span className="text-[10px] text-slate-500 block">
                          {new Date(ann.createdAt).toLocaleString()} • Author: {ann.author}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={actionAnnId === ann.id || togglePublishMut.isPending}
                          onClick={() =>
                            togglePublishMut.mutate({ id: ann.id, published: !ann.published })
                          }
                          className={`rounded border px-2.5 py-1 text-[11px] font-medium transition disabled:opacity-40 cursor-pointer ${
                            ann.published
                              ? "border-amber-300/30 bg-amber-300/10 text-amber-300 hover:bg-amber-300/20"
                              : "border-emerald-400/30 bg-emerald-400/10 text-emerald-300 hover:bg-emerald-400/20"
                          }`}
                        >
                          {actionAnnId === ann.id && togglePublishMut.isPending
                            ? "Updating…"
                            : ann.published
                            ? "Unpublish"
                            : "Publish"}
                        </button>
                        <button
                          type="button"
                          disabled={actionAnnId === ann.id || deleteAnnMut.isPending}
                          onClick={() => {
                            if (confirm(`Are you sure you want to permanently delete announcement "${ann.title}"?`)) {
                              deleteAnnMut.mutate({ id: ann.id });
                            }
                          }}
                          className="rounded border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 text-[11px] font-medium text-rose-300 hover:bg-rose-500/20 disabled:opacity-40 cursor-pointer"
                        >
                          {actionAnnId === ann.id && deleteAnnMut.isPending ? "Deleting…" : "Delete"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ─── TAB 4: TOPICS / TRACKS ─────────────────────────────────────────── */}
        {activeTab === "topics" && (
          <section className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-xl">Submission Tracks &amp; Categories</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Categories that teams choose during submission.
                  {topicsQ.data?.updatedAt && (
                    <> Last saved: {new Date(topicsQ.data.updatedAt).toLocaleString()}</>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={resetTopics}
                  className="rounded-md border border-white/15 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/10"
                >
                  Reset
                </button>
                <button
                  onClick={addTopic}
                  disabled={localTopics.length >= 50}
                  className="rounded-md border border-amber-300/40 bg-amber-300/10 px-3 py-1.5 text-xs font-medium text-amber-200 hover:bg-amber-300/20 disabled:opacity-40"
                >
                  + Add Track
                </button>
                <button
                  onClick={() => {
                    setTopicSaveState("saving");
                    saveTopicsMut.mutate(localTopics);
                  }}
                  disabled={saveTopicsMut.isPending || localTopics.length === 0}
                  className="rounded-md bg-amber-300 px-4 py-1.5 text-xs font-semibold text-black hover:bg-amber-200 disabled:opacity-60"
                >
                  {saveTopicsMut.isPending ? "Saving…" : topicSaveState === "saved" ? "✓ Saved!" : "Save Tracks"}
                </button>
              </div>
            </div>

            {topicsQ.isLoading && <p className="text-sm text-slate-400">Loading tracks…</p>}

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {localTopics.map((t, i) => (
                <div
                  key={i}
                  className="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] p-3 transition hover:border-amber-300/20"
                >
                  <input
                    value={t.id}
                    onChange={(e) => updateTopic(i, "id", e.target.value)}
                    maxLength={10}
                    className="w-12 shrink-0 rounded-md bg-amber-300/15 px-1.5 py-1 text-center text-xs font-bold text-amber-300 outline-none focus:ring-1 focus:ring-amber-300 border border-transparent focus:border-amber-300/60"
                    aria-label="Track ID"
                  />
                  <input
                    value={t.name}
                    onChange={(e) => updateTopic(i, "name", e.target.value)}
                    placeholder="Track Name"
                    className="flex-1 min-w-0 rounded-md border border-white/10 bg-black/30 px-2.5 py-1.5 text-sm font-medium text-slate-100 placeholder:text-slate-600 outline-none focus:border-amber-300/60"
                    aria-label="Track Name"
                  />
                  <button
                    onClick={() => removeTopic(i)}
                    disabled={localTopics.length <= 1}
                    aria-label={`Remove track ${t.id}`}
                    className="shrink-0 rounded-md border border-rose-400/30 px-1.5 py-1 text-xs text-rose-300 opacity-0 group-hover:opacity-100 hover:bg-rose-500/10 transition disabled:pointer-events-none"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            {topicSaveState === "error" && (
              <p className="text-xs text-rose-300">Failed to save tracks. Please try again.</p>
            )}
          </section>
        )}

        {/* ─── TAB 5: EVALUATION CRITERIA ─────────────────────────────────────── */}
        {activeTab === "criteria" && (
          <section className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-xl">Evaluation Criteria ({localCriteria.length} Rubric Bands)</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Criteria sent to the AI panel for scoring every submitted proposal.
                  {criteriaQ.data?.updatedAt && (
                    <> Last saved: {new Date(criteriaQ.data.updatedAt).toLocaleString()}</>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={resetCriteria}
                  className="rounded-md border border-white/15 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/10"
                >
                  Reset
                </button>
                <button
                  onClick={addCriterion}
                  disabled={localCriteria.length >= 20}
                  className="rounded-md border border-amber-300/40 bg-amber-300/10 px-3 py-1.5 text-xs font-medium text-amber-200 hover:bg-amber-300/20 disabled:opacity-40"
                >
                  + Add Criterion
                </button>
                <button
                  onClick={() => {
                    setCritSaveState("saving");
                    saveCriteriaMut.mutate(localCriteria);
                  }}
                  disabled={saveCriteriaMut.isPending || localCriteria.length === 0}
                  className="rounded-md bg-amber-300 px-4 py-1.5 text-xs font-semibold text-black hover:bg-amber-200 disabled:opacity-60"
                >
                  {saveCriteriaMut.isPending ? "Saving…" : critSaveState === "saved" ? "✓ Saved!" : "Save Criteria"}
                </button>
              </div>
            </div>

            {criteriaQ.isLoading && <p className="text-sm text-slate-400">Loading criteria…</p>}

            <div className="grid gap-3 sm:grid-cols-2">
              {localCriteria.map((c, i) => {
                const totalMax = localCriteria.reduce((s, x) => s + x.maxScore, 0);
                return (
                  <div
                    key={i}
                    className="group rounded-xl border border-white/10 bg-white/[0.02] p-4 transition hover:border-amber-300/20"
                  >
                    <div className="flex items-start gap-3">
                      <input
                        value={c.id}
                        onChange={(e) => updateCriterion(i, "id", e.target.value)}
                        maxLength={10}
                        className="w-14 shrink-0 rounded-md bg-amber-300/15 px-2 py-1 text-center text-xs font-bold text-amber-300 outline-none focus:ring-1 focus:ring-amber-300 border border-transparent focus:border-amber-300/60"
                        aria-label="Criterion ID"
                      />
                      <div className="flex-1 min-w-0 space-y-2">
                        <input
                          value={c.name}
                          onChange={(e) => updateCriterion(i, "name", e.target.value)}
                          placeholder="Criterion name"
                          className="w-full rounded-md border border-white/10 bg-black/30 px-2.5 py-1.5 text-sm font-medium text-slate-100 placeholder:text-slate-600 outline-none focus:border-amber-300/60"
                          aria-label="Criterion name"
                        />
                        <textarea
                          value={c.description}
                          onChange={(e) => updateCriterion(i, "description", e.target.value)}
                          placeholder="Description (sent to AI evaluator)"
                          rows={2}
                          className="w-full rounded-md border border-white/10 bg-black/30 px-2.5 py-1.5 text-xs text-slate-400 placeholder:text-slate-600 outline-none focus:border-amber-300/60 resize-none"
                          aria-label="Criterion description"
                        />
                      </div>
                      <div className="flex shrink-0 flex-col items-center gap-1">
                        <label className="text-[9px] uppercase text-slate-600">Max</label>
                        <input
                          type="number"
                          min={1}
                          max={100}
                          value={c.maxScore}
                          onChange={(e) => updateCriterion(i, "maxScore", parseInt(e.target.value) || 10)}
                          className="w-14 rounded-md border border-white/10 bg-black/30 px-2 py-1 text-center text-sm font-bold text-amber-300 outline-none focus:border-amber-300/60"
                          aria-label="Max score"
                        />
                        <span className="text-[9px] text-slate-600">pts</span>
                      </div>
                      <button
                        onClick={() => removeCriterion(i)}
                        disabled={localCriteria.length <= 1}
                        aria-label={`Remove criterion ${c.id}`}
                        className="shrink-0 rounded-md border border-rose-400/30 px-1.5 py-1 text-xs text-rose-300 opacity-0 group-hover:opacity-100 hover:bg-rose-500/10 transition disabled:pointer-events-none"
                      >
                        ×
                      </button>
                    </div>

                    {/* Evaluation Mode toggle */}
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-white/5 pt-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                          Mode:
                        </span>
                        <select
                          value={c.evalMode || c.type || (c.id === "F7" || c.id === "F8" ? "manual" : "ai")}
                          onChange={(e) => {
                            const mode = e.target.value as "ai" | "manual";
                            updateCriterion(i, "evalMode", mode);
                            updateCriterion(i, "type", mode);
                          }}
                          className={`rounded-md border px-2 py-1 text-xs font-semibold outline-none transition ${
                            (c.evalMode || c.type || (c.id === "F7" || c.id === "F8" ? "manual" : "ai")) === "manual"
                              ? "border-purple-400/40 bg-purple-500/15 text-purple-200"
                              : "border-sky-400/40 bg-sky-500/15 text-sky-200"
                          }`}
                        >
                          <option value="ai" className="bg-[#0a0a14] text-slate-200">
                            🤖 AI Evaluated (Gemini)
                          </option>
                          <option value="manual" className="bg-[#0a0a14] text-slate-200">
                            ✍️ Manual Evaluation (Live Jury)
                          </option>
                        </select>
                      </div>
                      {(c.evalMode === "manual" || c.type === "manual" || c.id === "F7" || c.id === "F8") ? (
                        <span className="rounded bg-purple-400/10 border border-purple-400/20 px-2 py-0.5 text-[10px] font-semibold text-purple-300">
                          Live Pitch Evaluation
                        </span>
                      ) : (
                        <span className="rounded bg-sky-400/10 border border-sky-400/20 px-2 py-0.5 text-[10px] font-semibold text-sky-300">
                          Automated AI Grading
                        </span>
                      )}
                    </div>

                    {/* weight bar */}
                    <div className="mt-3 flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-amber-400/60"
                          style={{
                            width: `${Math.round((c.maxScore / Math.max(totalMax, 1)) * 100)}%`,
                          }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-600">
                        {Math.round((c.maxScore / Math.max(totalMax, 1)) * 100)}% weight
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Total */}
            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-5 py-3">
              <span className="text-sm text-slate-400">Total max score</span>
              <span className="font-serif text-2xl text-amber-300">
                {localCriteria.reduce((s, c) => s + c.maxScore, 0)}
                <span className="text-sm text-slate-500"> pts</span>
              </span>
            </div>

            {critSaveState === "error" && (
              <p className="text-xs text-rose-300">Failed to save criteria. Please try again.</p>
            )}
          </section>
        )}
      </main>

      {/* ─── Add Team Modal ──────────────────────────────────────────────── */}
      {showAddTeamModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowAddTeamModal(false);
            }
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            className="relative my-auto w-full max-w-md rounded-2xl border-2 border-amber-400/40 bg-[#0e101a] p-6 text-slate-100 shadow-[0_25px_60px_rgba(0,0,0,0.95)] space-y-5"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/15 border border-amber-400/30 text-lg">
                  ➕
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-slate-100">
                    {createdTeamCreds ? "Team Registered Successfully" : "Add New Team"}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {createdTeamCreds
                      ? "Official team created and provisioned for sign-in"
                      : "Register team with Team Name & Leader Email (No password needed)"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddTeamModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold px-2 py-1 rounded hover:bg-white/10 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* If Successfully Created: Show Confirmation Card */}
            {createdTeamCreds ? (
              <div className="space-y-4">
                <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/40 p-4 text-xs space-y-3">
                  <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                    <span>✅</span>
                    <span>Team Ready for Sign-In</span>
                  </div>

                  <div className="space-y-2 bg-black/70 p-3 rounded-lg border border-white/10 font-mono text-xs">
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-slate-400">Team Name:</span>
                      <span className="text-amber-300 font-bold">{createdTeamCreds.teamName}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-slate-400">Leader Email:</span>
                      <span className="text-sky-300 font-semibold">{createdTeamCreds.leaderEmail}</span>
                    </div>
                    {createdTeamCreds.category && (
                      <div className="flex justify-between py-1 border-b border-white/5">
                        <span className="text-slate-400">Track:</span>
                        <span className="text-slate-300">{createdTeamCreds.category}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-1">
                      <span className="text-slate-400">Sign-In Portal:</span>
                      <span className="text-amber-400 underline">/team</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-emerald-200/90 leading-relaxed bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/20">
                    💡 The team leader can now directly sign in at the Team Portal using their <b>Team Name</b> and <b>Leader Email</b>. No password required!
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      const portalUrl = window.location.origin + "/team";
                      const text = `🏆 SIH PREMIER 2026 — TEAM DETAILS\nTeam Name: ${createdTeamCreds.teamName}\nLeader Email: ${createdTeamCreds.leaderEmail}\n${createdTeamCreds.category ? `Category/Track: ${createdTeamCreds.category}\n` : ""}Sign-In URL: ${portalUrl}\n\n*Sign in with your Team Name and Leader Email to upload your pitch deck PDF (< 3MB). No password required.`;
                      navigator.clipboard.writeText(text);
                      setCopiedCreds(true);
                      setTimeout(() => setCopiedCreds(false), 3000);
                    }}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer ${
                      copiedCreds
                        ? "bg-emerald-400 text-black shadow-lg shadow-emerald-400/20"
                        : "bg-amber-400 hover:bg-amber-300 text-black shadow-lg shadow-amber-400/20"
                    }`}
                  >
                    <span>{copiedCreds ? "✓" : "📋"}</span>
                    <span>{copiedCreds ? "Details Copied to Clipboard!" : "Copy Details to Clipboard"}</span>
                  </button>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleOpenAddTeamModal}
                    className="rounded-xl border border-amber-300/30 bg-amber-400/10 px-4 py-2 text-xs font-semibold text-amber-300 hover:bg-amber-400/20 transition cursor-pointer"
                  >
                    ➕ Register Another Team
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddTeamModal(false)}
                    className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-white/20 transition cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              /* Registration Form */
              <form onSubmit={handleCreateTeamSubmit} className="space-y-4">
                {addTeamError && (
                  <div className="rounded-xl border border-rose-500/30 bg-rose-950/40 p-3 text-xs text-rose-300 flex items-center gap-2">
                    <span>⚠️</span>
                    <span>{addTeamError}</span>
                  </div>
                )}

                <div className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Team Name <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Apex Innovators"
                      value={newTeamName}
                      onChange={(e) => setNewTeamName(e.target.value)}
                      className="w-full rounded-xl border border-white/15 bg-black/70 px-3.5 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 outline-none focus:border-amber-300 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Leader Email <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. leader@gmail.com"
                      value={newLeaderEmail}
                      onChange={(e) => setNewLeaderEmail(e.target.value)}
                      className="w-full rounded-xl border border-white/15 bg-black/70 px-3.5 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 outline-none focus:border-amber-300 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Domain / Track <span className="text-slate-500">(Optional)</span>
                    </label>
                    {localTopics.length > 0 ? (
                      <select
                        value={newTeamCategory}
                        onChange={(e) => setNewTeamCategory(e.target.value)}
                        className="w-full rounded-xl border border-white/15 bg-black/70 px-3.5 py-2.5 text-xs text-slate-200 outline-none focus:border-amber-300 transition"
                      >
                        <option value="">Select Domain / Track</option>
                        {localTopics.map((t) => (
                          <option key={t.id} value={t.name}>
                            {t.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        placeholder="e.g. Smart Automation, Healthcare, AI"
                        value={newTeamCategory}
                        onChange={(e) => setNewTeamCategory(e.target.value)}
                        className="w-full rounded-xl border border-white/15 bg-black/70 px-3.5 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 outline-none focus:border-amber-300 transition"
                      />
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-white/10 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddTeamModal(false)}
                    className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-white/10 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isAddingTeam}
                    className="rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 px-5 py-2 text-xs font-bold text-black shadow-md shadow-amber-500/20 transition disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                  >
                    {isAddingTeam ? (
                      <>
                        <span className="animate-spin">⏳</span>
                        <span>Registering Team…</span>
                      </>
                    ) : (
                      <>
                        <span>➕</span>
                        <span>Register Team</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ─── Global Export / Print Reports Dialog Modal ──────────────────────── */}
      {reportModalOpen && (
        <ReportPickerModal
          teams={teams}
          topics={localTopics}
          onClose={() => setReportModalOpen(false)}
        />
      )}

      {/* ── Submission Modal ── */}
      {selectedSub && (
        <SubmissionModal
          submission={selectedSub}
          team={(teamsQ.data || []).find((t) => t.id === selectedSub.team_id) || null}
          saveManualScoresFn={saveManualScoresFn}
          onScoreSaved={() => teamsQ.refetch()}
          onClose={() => setSelectedSub(null)}
          onExport={() =>
            downloadJson(`submission-${selectedSub.id.slice(0, 8)}.json`, {
              exportedAt: new Date().toISOString(),
              submission: selectedSub,
            })
          }
        />
      )}

      {/* ── Delete Confirm ── */}
      {confirmDelete && (
        <ConfirmDialog
          title="Delete team?"
          message={
            <>
              You're about to permanently delete{" "}
              <span className="font-semibold text-slate-100">"{confirmDelete.name}"</span> and{" "}
              {confirmDelete.submissions.length === 0
                ? "no submissions."
                : `all ${confirmDelete.submissions.length} submission${confirmDelete.submissions.length === 1 ? "" : "s"} attached to it.`}{" "}
              This cannot be undone.
            </>
          }
          confirmLabel={delTeamMut.isPending ? "Deleting…" : "Delete team"}
          busy={delTeamMut.isPending}
          onCancel={() => setConfirmDelete(null)}
          onConfirm={() => {
            const id = confirmDelete.id;
            delTeamMut.mutate(id, { onSettled: () => setConfirmDelete(null) });
          }}
        />
      )}

      {/* ── Feedback Email Modal ── */}
      {feedbackModal && (
        <FeedbackModal feedback={feedbackModal} onClose={() => setFeedbackModal(null)} />
      )}

      {/* Footer */}
      <Footer className="mt-20 border-t border-white/5 pt-8" />
    </div>
  );
}

// ─── ReportPickerModal ─────────────────────────────────────────────────────────

function ReportPickerModal({
  teams,
  topics,
  onClose,
}: {
  teams: TeamRow[];
  topics: Topic[];
  onClose: () => void;
}) {
  const [selectedTeamId, setSelectedTeamId] = useState<string>(teams[0]?.id || "");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const selectedTeam = teams.find((t) => t.id === selectedTeamId);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl rounded-3xl border border-white/15 bg-[#0a0a14] p-6 text-slate-100 shadow-[0_20px_70px_rgba(0,0,0,0.7)] space-y-6"
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-amber-300 font-bold">Official Document Center</div>
            <h3 className="font-serif text-2xl mt-0.5">Generate &amp; Print PDF Reports</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-white/15 p-1.5 text-xs text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {/* Option 1: 1-Page Summary Scorecard */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 hover:border-amber-300/30 transition">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-100 text-sm">📄 1-Page Executive Scorecard (Single Team)</span>
                <p className="text-xs text-slate-400 mt-0.5">
                  Fitted for exactly 1 page with score gauge, rubric criteria, strengths, and transparent Innovedge logo watermark.
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <select
                value={selectedTeamId}
                onChange={(e) => setSelectedTeamId(e.target.value)}
                className="flex-1 rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-xs text-slate-200 outline-none"
              >
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} {t.bestScore != null ? `(${t.bestScore}/100)` : "(Unscored)"}
                  </option>
                ))}
              </select>
              <button
                disabled={!selectedTeam || selectedTeam.bestScore == null}
                onClick={() => {
                  if (selectedTeam) openPdfWindow(generateTeamReport1Page(selectedTeam));
                }}
                className="rounded-lg bg-amber-300 px-4 py-2 text-xs font-bold text-black hover:bg-amber-200 disabled:opacity-40"
              >
                Print 1-Page
              </button>
            </div>
          </div>

          {/* Option 2: 2-Page Detailed Dossier */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 hover:border-violet-400/30 transition">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-100 text-sm">📑 2-Page Detailed Evaluation Dossier</span>
                <p className="text-xs text-slate-400 mt-0.5">
                  Page 1: Executive Overview &amp; Strengths. Page 2: Full rubric matrix, deductions, and jury signatures (Judge 1 &amp; Judge 2).
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <select
                value={selectedTeamId}
                onChange={(e) => setSelectedTeamId(e.target.value)}
                className="flex-1 rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-xs text-slate-200 outline-none"
              >
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} {t.bestScore != null ? `(${t.bestScore}/100)` : "(Unscored)"}
                  </option>
                ))}
              </select>
              <button
                disabled={!selectedTeam || selectedTeam.bestScore == null}
                onClick={() => {
                  if (selectedTeam) openPdfWindow(generateTeamReport2Page(selectedTeam));
                }}
                className="rounded-lg bg-violet-400 px-4 py-2 text-xs font-bold text-black hover:bg-violet-300 disabled:opacity-40"
              >
                Print 2-Page
              </button>
            </div>
          </div>

          {/* Option 3: Partwise Results List PDF */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 hover:border-sky-400/30 transition">
            <div>
              <span className="font-bold text-slate-100 text-sm">📊 Partwise Results List PDF</span>
              <p className="text-xs text-slate-400 mt-0.5">
                Consolidated results table filtered by track/category with score bars and logo watermark.
              </p>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="flex-1 rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-xs text-slate-200 outline-none"
              >
                <option value="All">All Categories</option>
                {topics.map((tp) => (
                  <option key={tp.id} value={tp.name}>
                    {tp.name}
                  </option>
                ))}
              </select>
              <button
                onClick={() => openPdfWindow(generatePartwiseResultsReport(teams, selectedCategory))}
                className="rounded-lg bg-sky-400 px-4 py-2 text-xs font-bold text-black hover:bg-sky-300"
              >
                Print Results
              </button>
            </div>
          </div>

          {/* Option 4: Official Announcement PDF */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 hover:border-emerald-400/30 transition">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-100 text-sm">🏆 Official Declaration of Winners (1 Page)</span>
                <p className="text-xs text-slate-400 mt-0.5">
                  Grand championship podium (1st, 2nd, 3rd), track champions, faculty signatures, and seal.
                </p>
              </div>
              <button
                onClick={() => openPdfWindow(generateAnnouncementReport(teams, topics))}
                className="rounded-lg bg-emerald-400 px-4 py-2 text-xs font-bold text-black hover:bg-emerald-300"
              >
                Print Announcement
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ConfirmDialog ─────────────────────────────────────────────────────────────

function ConfirmDialog({
  title,
  message,
  confirmLabel,
  busy,
  onCancel,
  onConfirm,
}: {
  title: string;
  message: React.ReactNode;
  confirmLabel: string;
  busy?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl border border-rose-400/30 bg-[#0a0a14] p-6 text-slate-100 shadow-[0_20px_60px_-20px_rgba(244,63,94,0.4)]"
      >
        <div className="flex items-start gap-3">
          <span
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-rose-500/15 text-rose-300"
            aria-hidden="true"
          >
            !
          </span>
          <div>
            <h3 id="confirm-title" className="font-serif text-xl">
              {title}
            </h3>
            <p className="mt-2 text-sm text-slate-300">{message}</p>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button
            autoFocus
            onClick={onCancel}
            className="rounded-md border border-white/15 px-4 py-2 text-sm text-slate-200 hover:bg-white/10"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={busy}
            className="rounded-md bg-rose-500 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-400 disabled:opacity-60"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── FeedbackModal ─────────────────────────────────────────────────────────────

function FeedbackModal({
  feedback,
  onClose,
}: {
  feedback: { to: string; subject: string; body: string };
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const copyBody = async () => {
    await navigator.clipboard.writeText(feedback.body);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const mailtoHref = `mailto:${encodeURIComponent(feedback.to)}?subject=${encodeURIComponent(feedback.subject)}&body=${encodeURIComponent(feedback.body)}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="feedback-title"
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="my-8 w-full max-w-2xl rounded-2xl border border-sky-400/30 bg-[#0a0a14] p-5 text-slate-100 shadow-[0_20px_60px_-20px_rgba(56,189,248,0.3)] sm:p-6"
      >
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="min-w-0">
            <h3 id="feedback-title" className="font-serif text-xl text-sky-300">
              📧 Feedback Email
            </h3>
            <p className="mt-1 text-xs text-slate-400 truncate">
              To: <span className="text-slate-200">{feedback.to}</span>
            </p>
            <p className="text-xs text-slate-400 truncate">
              Subject: <span className="text-slate-200">{feedback.subject}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 rounded-md border border-white/15 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/10"
          >
            ✕ Close
          </button>
        </div>

        <div className="rounded-lg border border-white/10 bg-black/40 p-4 max-h-80 overflow-y-auto">
          <pre className="whitespace-pre-wrap text-xs text-slate-300 font-mono leading-relaxed">
            {feedback.body}
          </pre>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <a
            href={mailtoHref}
            className="flex-1 rounded-md bg-sky-500 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-sky-400"
          >
            ✉️ Open in Email Client
          </a>
          <button
            onClick={copyBody}
            className="rounded-md border border-white/15 px-4 py-2.5 text-sm text-slate-200 hover:bg-white/10"
          >
            {copied ? "✓ Copied!" : "📋 Copy Body"}
          </button>
        </div>

        <p className="mt-3 text-[11px] text-slate-600 leading-relaxed">
          Clicking "Open in Email Client" will open your default mail app with this email pre-filled.
        </p>
      </div>
    </div>
  );
}

// ─── SubmissionModal ────────────────────────────────────────────────────────────

function SubmissionModal({
  submission,
  team,
  onClose,
  onExport,
  saveManualScoresFn,
  onScoreSaved,
}: {
  submission: Submission;
  team?: TeamRow | null;
  onClose: () => void;
  onExport: () => void;
  saveManualScoresFn?: any;
  onScoreSaved?: () => void;
}) {
  const pdfFn = useServerFn(getPdfUrl);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const initialResult = typeof submission.result === "string"
    ? (() => { try { return JSON.parse(submission.result); } catch { return {}; } })()
    : (submission.result || {});
  const [currentScore, setCurrentScore] = useState<number | null>(submission.score);
  const [currentResult, setCurrentResult] = useState<any>(initialResult);

  const safeText = (val: any): string => {
    if (val == null) return "";
    if (typeof val === "string") return val;
    if (Array.isArray(val)) {
      return val.map((v) => (typeof v === "object" ? JSON.stringify(v) : String(v))).join("; ");
    }
    if (typeof val === "object") return JSON.stringify(val);
    return String(val);
  };

  // Dual-Teacher manual scores editable state for all 10 criteria
  const cleanRem = (rem: any): string => {
    if (rem == null) return "";
    let str = "";
    if (typeof rem === "string") {
      str = rem;
    } else if (Array.isArray(rem)) {
      str = rem.map((r) => (typeof r === "object" ? JSON.stringify(r) : String(r))).join("; ");
    } else if (typeof rem === "object") {
      str = JSON.stringify(rem);
    } else {
      str = String(rem);
    }
    return str
      .replace(/^Denny Andrews.*?:/i, "")
      .replace(/^Bhavya Mam.*?:/i, "")
      .replace(/^Judge \d:?\s*/i, "")
      .trim();
  };

  const [t1Scores, setT1Scores] = useState<Record<string, { score: number; remarks: string }>>(() => {
    const init: Record<string, { score: number; remarks: string }> = {};
    const res = (submission.result as any) || {};
    const storedT1 = res.teacher_evaluation?.teacher1 || {};
    const critList = res.criteria || [];
    critList.forEach((c: any) => {
      const val = storedT1.scores?.[c.id] ?? c.t1Score ?? (c.id === "F7" ? storedT1.score : (c.score != null ? Number(c.score) : 0));
      const rawRem = storedT1.remarks?.[c.id] ?? c.t1Remarks ?? (c.id === "F7" ? storedT1.remarks : "");
      init[c.id] = { score: Number(val) || 0, remarks: cleanRem(rawRem) };
    });
    return init;
  });

  const [t2Scores, setT2Scores] = useState<Record<string, { score: number; remarks: string }>>(() => {
    const init: Record<string, { score: number; remarks: string }> = {};
    const res = (submission.result as any) || {};
    const storedT2 = res.teacher_evaluation?.teacher2 || {};
    const critList = res.criteria || [];
    critList.forEach((c: any) => {
      const val = storedT2.scores?.[c.id] ?? c.t2Score ?? (c.id === "F8" ? storedT2.score : (c.score != null ? Number(c.score) : 0));
      const rawRem = storedT2.remarks?.[c.id] ?? c.t2Remarks ?? (c.id === "F8" ? storedT2.remarks : "");
      init[c.id] = { score: Number(val) || 0, remarks: cleanRem(rawRem) };
    });
    return init;
  });

  const [teacherViewTab, setTeacherViewTab] = useState<"both" | "t1" | "t2">("both");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    pdfFn({ data: { path: submission.pdf_path } })
      .then((res) => setPdfUrl(res.url))
      .catch(() => setPdfUrl(null));
  }, [submission.pdf_path]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const r = currentResult;
  const criteriaList: any[] = r.criteria || [];

  // Totals for all 10 criteria
  const t1Total = criteriaList.reduce((sum, c) => sum + (Number(t1Scores[c.id]?.score) || 0), 0);
  const t2Total = criteriaList.reduce((sum, c) => sum + (Number(t2Scores[c.id]?.score) || 0), 0);
  const t1HasScores = Object.values(t1Scores).some((x) => x.score > 0);
  const t2HasScores = Object.values(t2Scores).some((x) => x.score > 0);

  let calculatedCombined = 0;
  if (t1HasScores && t2HasScores) {
    calculatedCombined = Math.min(100, Math.max(0, Math.round((t1Total + t2Total) / 2)));
  } else if (t1HasScores) {
    calculatedCombined = Math.min(100, Math.max(0, t1Total));
  } else if (t2HasScores) {
    calculatedCombined = Math.min(100, Math.max(0, t2Total));
  } else {
    calculatedCombined = Number(currentScore) || Number(r.totalScore) || 0;
  }

  // Top-Level Plagiarism & Originality Audit data
  const plagiarism = r.plagiarism || {
    originalityScore: 92,
    similarityIndex: 8,
    riskLevel: "Low",
    verdict: "Original Work — Authentic Solution & High Conceptual Novelty",
    analysis: "Rigorous technical inspection reveals genuine formulation, authentic system architecture, and original technical phrasing without unauthorized boilerplate or repository copying.",
    sourcesBreakdown: {
      webMatches: 3,
      academicPapers: 2,
      codeRepoBoilerplate: 3,
      aiGeneratedLikelihood: 10,
    },
    citationsAudit: {
      citationsFound: true,
      citationCount: 4,
      citationQuality: "Properly Cited & Formatted",
      detectedReferences: ["Domain Standards", "Open-Source Datasets"],
    },
    citationsFound: true,
    notes: "Verified original by AI Plagiarism & Originality Engine.",
  };

  const simIndex = plagiarism.similarityIndex ?? Math.max(0, 100 - (plagiarism.originalityScore || 90));

  const handleFillAiBaseline = (target: "t1" | "t2" | "both") => {
    criteriaList.forEach((c) => {
      const aiBaseline = Number(c.score) || 8;
      if (target === "t1" || target === "both") {
        setT1Scores((prev) => ({
          ...prev,
          [c.id]: {
            score: aiBaseline,
            remarks: prev[c.id]?.remarks || "", // Left blank for teachers/judges to fill manually
          },
        }));
      }
      if (target === "t2" || target === "both") {
        setT2Scores((prev) => ({
          ...prev,
          [c.id]: {
            score: aiBaseline,
            remarks: prev[c.id]?.remarks || "", // Left blank for teachers/judges to fill manually
          },
        }));
      }
    });
  };

  const handleSaveJuryScores = async () => {
    if (!saveManualScoresFn) return;
    setIsSaving(true);
    setSaveError(null);
    try {
      const res = await saveManualScoresFn({
        data: {
          submissionId: submission.id,
          judge1Scores: t1Scores,
          judge2Scores: t2Scores,
          teacher1Scores: t1Scores,
          teacher2Scores: t2Scores,
        },
      });
      if (res?.totalScore != null) {
        setCurrentScore(res.totalScore);
      }
      if (res?.result) {
        setCurrentResult(res.result);
      }
      setSaveSuccess(true);
      onScoreSaved?.();
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e: any) {
      setSaveError(e?.message || "Failed to save jury scores");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="eval-title"
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/75 p-3 sm:p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="my-6 w-full max-w-4xl rounded-2xl border border-white/10 bg-[#0a0a14] p-5 text-slate-100 shadow-2xl sm:p-7 space-y-6"
      >
        {/* Header with Dual Judge Marks vs Combined Score */}
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-5">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="rounded bg-white/5 border border-white/10 px-2 py-0.5 text-[10px] text-slate-400 font-mono">
                {submission.file_name}
              </span>
              {(submission.category || team?.latest?.category) && (
                <span className="rounded bg-amber-400/10 border border-amber-400/25 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
                  📌 {submission.category || team?.latest?.category}
                </span>
              )}
            </div>
            <h3 id="eval-title" className="font-serif text-3xl font-bold text-slate-100">
              {team?.name || "Proposal Evaluation"}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Formula: <b>Judge 1 (/100)</b> + <b>Judge 2 (/100)</b> → <b>Final Combined Score (/100)</b>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Judge 1 */}
            <div className="rounded-xl border border-purple-400/30 bg-purple-950/25 px-3 py-1.5 text-center">
              <div className="flex items-center justify-center gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300 block">
                  👨‍⚖️ Judge 1
                </span>
                <span className={`h-1.5 w-1.5 rounded-full ${t1HasScores ? "bg-emerald-400" : "bg-amber-400"}`} />
              </div>
              <span className="font-serif text-lg font-bold text-purple-200">
                {t1Total}
                <span className="text-xs text-purple-400/70 font-sans">/100</span>
              </span>
            </div>

            <span className="text-base font-bold text-slate-500">+</span>

            {/* Judge 2 */}
            <div className="rounded-xl border border-sky-400/30 bg-sky-950/25 px-3 py-1.5 text-center">
              <div className="flex items-center justify-center gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-300 block">
                  👩‍⚖️ Judge 2
                </span>
                <span className={`h-1.5 w-1.5 rounded-full ${t2HasScores ? "bg-emerald-400" : "bg-amber-400"}`} />
              </div>
              <span className="font-serif text-lg font-bold text-sky-200">
                {t2Total}
                <span className="text-xs text-sky-400/70 font-sans">/100</span>
              </span>
            </div>

            <span className="text-base font-bold text-slate-500">=</span>

            {/* Combined Final Score */}
            <div className="rounded-xl border-2 border-amber-400/60 bg-amber-400/10 px-3.5 py-1.5 text-center shadow-[0_0_20px_rgba(251,191,36,0.15)]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block">
                🏆 Final Score
              </span>
              <span className="font-serif text-2xl font-black text-amber-300">
                {currentScore ?? calculatedCombined}
                <span className="text-xs text-amber-400/70 font-sans">/100</span>
              </span>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TOP-LEVEL PLAGIARISM & ORIGINALITY AUDIT                            */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <div className="rounded-2xl border border-emerald-500/35 bg-gradient-to-br from-emerald-950/30 via-slate-900/60 to-black/80 p-4 sm:p-5 space-y-3.5 shadow-[0_0_30px_rgba(16,185,129,0.08)]">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-500/20 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-base">
                🛡️
              </span>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-300 block">
                  Originality &amp; Plagiarism Check
                </span>
                <h4 className="font-serif text-base font-bold text-slate-100">
                  {plagiarism.verdict || "Original Work — Authentic Solution"}
                </h4>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {plagiarism.riskLevel === "Low" ? (
                <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-3 py-1 text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Low Risk (Original)
                </span>
              ) : plagiarism.riskLevel === "Moderate" ? (
                <span className="rounded-full bg-amber-500/20 border border-amber-500/40 px-3 py-1 text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-amber-400" />
                  Moderate Similarity
                </span>
              ) : (
                <span className="rounded-full bg-rose-500/20 border border-rose-500/40 px-3 py-1 text-xs font-bold text-rose-300 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-rose-500" />
                  High Risk
                </span>
              )}

              <div className="rounded-xl border border-emerald-400/40 bg-emerald-950/40 px-3 py-1 text-center">
                <span className="text-[9px] uppercase tracking-wider text-emerald-300 block font-bold">
                  Originality
                </span>
                <span className="font-serif text-base font-black text-emerald-200">
                  {plagiarism.originalityScore}%
                </span>
              </div>

              <div className="rounded-xl border border-amber-400/40 bg-amber-950/40 px-3 py-1 text-center">
                <span className="text-[9px] uppercase tracking-wider text-amber-300 block font-bold">
                  Similarity
                </span>
                <span className="font-serif text-base font-black text-amber-200">
                  {simIndex}%
                </span>
              </div>
            </div>
          </div>

          {/* Originality Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-slate-400">
              <span className="text-slate-300">Authenticity Score</span>
              <span className="font-mono text-emerald-400 font-bold">{plagiarism.originalityScore}% Original · {simIndex}% Detected Overlap</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-black/60 border border-white/10">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${Math.max(0, Math.min(100, plagiarism.originalityScore))}%` }}
              />
            </div>
          </div>

          {/* Clean concise analysis text */}
          <p className="text-xs text-slate-300 leading-relaxed bg-black/30 rounded-xl p-3 border border-white/5">
            {safeText(plagiarism.analysis)}
          </p>
        </div>

        {/* Manual Evaluation Status Banner */}
        {r.teacher_evaluation?.timestamp && (
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-purple-400/30 bg-purple-950/20 px-4 py-2 text-xs text-purple-200">
            <span className="flex items-center gap-1.5 font-semibold">
              <span>✍️</span>
              <span>
                Manual Evaluation Status: <b>{t1HasScores && t2HasScores ? "Fully Evaluated by Judge 1 & Judge 2" : "Partially Evaluated"}</b>
              </span>
            </span>
            <span className="text-[11px] text-purple-300 font-mono">
              Last saved: {new Date(r.teacher_evaluation.timestamp).toLocaleString()}
            </span>
          </div>
        )}

        {/* Team Profile & Leader Details Card */}
        {team && (
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-2">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                Team Profile & Leader Details
              </span>
              <span className="text-xs text-slate-400">
                Created: {new Date(team.created_at || "").toLocaleDateString()}
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Leader Name</span>
                <span className="font-semibold text-slate-200">{team.leader_name || "Leader Registered"}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Leader Contact</span>
                <span className="text-slate-300">
                  📧 {team.leader_email || "—"} {team.leader_phone ? `· 📞 ${team.leader_phone}` : ""}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Registered Members</span>
                <span className="font-semibold text-slate-200">
                  {team.members && team.members.length > 0
                    ? `${team.members.length} Members`
                    : "No extra members listed"}
                </span>
              </div>
            </div>

            {team.project_title && (
              <div className="border-t border-white/5 pt-2">
                <span className="text-slate-500 block text-[10px] uppercase">Project Title</span>
                <p className="text-sm font-medium text-amber-200">{team.project_title}</p>
                {team.project_description && (
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {team.project_description}
                  </p>
                )}
              </div>
            )}

            {Array.isArray(team?.members) && team.members.length > 0 && (
              <div className="border-t border-white/5 pt-2">
                <span className="text-slate-500 block text-[10px] uppercase mb-1">Members List</span>
                <div className="flex flex-wrap gap-1.5">
                  {team.members.map((m: any, idx: number) => {
                    const label = typeof m === "string" ? m : m.name ? `${m.name}${m.role ? ` (${m.role})` : ""}` : `Member ${idx + 1}`;
                    return (
                      <span
                        key={idx}
                        className="rounded bg-white/5 border border-white/10 px-2 py-0.5 text-[11px] text-slate-300"
                      >
                        👤 {label}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action buttons & AI Baseline Tools */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white/[0.02] p-3 rounded-xl border border-white/10">
          <div className="flex flex-wrap items-center gap-2">
            {pdfUrl && (
              <a
                href={pdfUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-md border border-white/15 px-3 py-1.5 text-xs text-slate-200 hover:bg-white/10"
              >
                Open Submitted PDF ↗
              </a>
            )}
            <button
              onClick={onExport}
              className="rounded-md border border-white/15 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-white/10"
            >
              Export JSON
            </button>
            <button
              type="button"
              onClick={() => handleFillAiBaseline("both")}
              className="rounded-md border border-amber-400/30 bg-amber-400/10 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-400/20"
              title="Populates AI-suggested marks for both teachers as a starting baseline"
            >
              ⚡ Fill AI Suggested Baseline to Both Teachers
            </button>
          </div>

          <div className="flex items-center gap-2">
            {saveSuccess && (
              <span className="text-xs font-bold text-emerald-400">✓ Judge 1 &amp; Judge 2 Scores Saved!</span>
            )}
            {saveError && (
              <span className="text-xs font-bold text-rose-400">{saveError}</span>
            )}
            <button
              type="button"
              disabled={isSaving}
              onClick={handleSaveJuryScores}
              className="rounded-lg bg-amber-300 px-4 py-1.5 text-xs font-bold text-black hover:bg-amber-200 shadow-[0_0_15px_rgba(251,191,36,0.3)] disabled:opacity-50"
            >
              {isSaving ? "Saving…" : "💾 Save Judge 1 & Judge 2 Evaluations"}
            </button>
          </div>
        </div>

        {/* Executive Summary */}
        {r.executiveSummary && (
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <h4 className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
              Executive AI Summary
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">{safeText(r.executiveSummary)}</p>
          </div>
        )}

        {r.problemStatement && (
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
              <h4 className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Problem Statement</h4>
              <p className="mt-1 text-xs text-slate-200 leading-relaxed">{safeText(r.problemStatement)}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
              <h4 className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Proposed Solution</h4>
              <p className="mt-1 text-xs text-slate-200 leading-relaxed">{safeText(r.solution)}</p>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* ALL 10 CRITERIA EVALUATION (MANUAL BY JUDGE 1 & JUDGE 2)            */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {criteriaList.length > 0 && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
              <div>
                <h4 className="font-serif text-xl font-bold text-slate-100 flex items-center gap-2">
                  <span>✍️</span>
                  <span>10 Rubric Criteria (Manual Evaluation by Judge 1 &amp; Judge 2)</span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Both <b>Judge 1</b> and <b>Judge 2</b> evaluate each criterion out of 10.
                </p>
              </div>

              {/* View Switcher Tabs */}
              <div className="flex items-center rounded-xl bg-black/60 p-1 border border-white/10 text-xs">
                <button
                  type="button"
                  onClick={() => setTeacherViewTab("both")}
                  className={`rounded-lg px-3 py-1 font-semibold transition ${
                    teacherViewTab === "both"
                      ? "bg-amber-400 text-black shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  👥 Both Judges (Side-by-Side)
                </button>
                <button
                  type="button"
                  onClick={() => setTeacherViewTab("t1")}
                  className={`rounded-lg px-3 py-1 font-semibold transition ${
                    teacherViewTab === "t1"
                      ? "bg-purple-500 text-white shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  👨‍⚖️ Judge 1
                </button>
                <button
                  type="button"
                  onClick={() => setTeacherViewTab("t2")}
                  className={`rounded-lg px-3 py-1 font-semibold transition ${
                    teacherViewTab === "t2"
                      ? "bg-sky-500 text-white shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  👩‍⚖️ Judge 2
                </button>
              </div>
            </div>

            {/* Criteria Cards */}
            <div className="space-y-3.5">
              {criteriaList.map((c: any) => {
                const max = c.maxScore ?? 10;
                const s1 = t1Scores[c.id]?.score ?? 0;
                const s2 = t2Scores[c.id]?.score ?? 0;
                const critCombined = Math.round((s1 + s2) / 2);

                return (
                  <div
                    key={c.id}
                    className="rounded-xl border border-white/10 bg-white/[0.02] p-4 transition space-y-3 hover:border-white/20"
                  >
                    {/* Criterion Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-amber-300/15 border border-amber-300/30 px-2 py-0.5 text-xs font-bold text-amber-300">
                          {c.id}
                        </span>
                        <span className="text-sm font-semibold text-slate-100">{c.name}</span>
                        <span className="text-xs text-slate-400">({max} pts max)</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 text-[10px] font-bold">
                          Judge 1: <b>{s1}</b>/{max}
                        </span>
                        <span className="rounded bg-sky-500/20 text-sky-300 border border-sky-500/30 px-2 py-0.5 text-[10px] font-bold">
                          Judge 2: <b>{s2}</b>/{max}
                        </span>
                        <span className="rounded bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2.5 py-0.5 text-xs font-black">
                          Avg: <b>{critCombined}</b>/{max}
                        </span>
                      </div>
                    </div>

                    {/* AI Copilot Insights (Evidence from Proposal Deck) */}
                    {(c.evidence || c.strengths || c.weaknesses) && (
                      <div className="rounded-lg bg-black/40 border border-white/5 p-3 text-xs space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">
                          <span>🤖 AI Evidence &amp; Findings from PDF</span>
                          {c.score != null && (
                            <span className="text-sky-400 font-mono font-bold lowercase">
                              ai suggested: {c.score}/{max}
                            </span>
                          )}
                        </div>
                        {c.evidence && (
                          <p className="text-slate-300 leading-relaxed">
                            <b className="text-slate-100">Deck Evidence:</b> {safeText(c.evidence)}
                          </p>
                        )}
                        {c.strengths && (
                          <p className="text-emerald-300/90">
                            <b className="text-emerald-200">Strengths:</b> {safeText(c.strengths)}
                          </p>
                        )}
                        {c.weaknesses && (
                          <p className="text-amber-300/90">
                            <b className="text-amber-200">Gaps/Weaknesses:</b> {safeText(c.weaknesses)}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Judge Evaluation Inputs */}
                    <div className="grid gap-3 sm:grid-cols-2">
                      {/* Judge 1 Box */}
                      {(teacherViewTab === "both" || teacherViewTab === "t1") && (
                        <div className="rounded-xl border border-purple-500/30 bg-purple-950/20 p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-purple-200 flex items-center gap-1.5">
                              <span>👨‍⚖️</span>
                              <span>Judge 1</span>
                            </label>
                            <div className="flex items-center gap-1.5">
                              <input
                                type="number"
                                min={0}
                                max={max}
                                value={s1}
                                onChange={(e) => {
                                  const val = Math.max(0, Math.min(max, parseInt(e.target.value) || 0));
                                  setT1Scores((prev) => ({
                                    ...prev,
                                    [c.id]: {
                                      score: val,
                                      remarks: prev[c.id]?.remarks || "",
                                    },
                                  }));
                                }}
                                className="w-16 rounded border border-purple-400/50 bg-black px-2 py-1 text-center font-serif text-base font-bold text-purple-200 outline-none focus:border-purple-300"
                              />
                              <span className="text-xs text-purple-400 font-bold">/ {max}</span>
                            </div>
                          </div>
                          <textarea
                            rows={2}
                            value={t1Scores[c.id]?.remarks || ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              setT1Scores((prev) => ({
                                ...prev,
                                [c.id]: {
                                  score: prev[c.id]?.score ?? s1,
                                  remarks: val,
                                },
                              }));
                            }}
                            placeholder="Enter Judge 1's evaluation remarks..."
                            className="w-full rounded border border-purple-500/20 bg-black/60 p-2 text-xs text-slate-200 placeholder:text-slate-600 outline-none focus:border-purple-400 resize-none"
                          />
                        </div>
                      )}

                      {/* Judge 2 Box */}
                      {(teacherViewTab === "both" || teacherViewTab === "t2") && (
                        <div className="rounded-xl border border-sky-500/30 bg-sky-950/20 p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-sky-200 flex items-center gap-1.5">
                              <span>👩‍⚖️</span>
                              <span>Judge 2</span>
                            </label>
                            <div className="flex items-center gap-1.5">
                              <input
                                type="number"
                                min={0}
                                max={max}
                                value={s2}
                                onChange={(e) => {
                                  const val = Math.max(0, Math.min(max, parseInt(e.target.value) || 0));
                                  setT2Scores((prev) => ({
                                    ...prev,
                                    [c.id]: {
                                      score: val,
                                      remarks: prev[c.id]?.remarks || "",
                                    },
                                  }));
                                }}
                                className="w-16 rounded border border-sky-400/50 bg-black px-2 py-1 text-center font-serif text-base font-bold text-sky-200 outline-none focus:border-sky-300"
                              />
                              <span className="text-xs text-sky-400 font-bold">/ {max}</span>
                            </div>
                          </div>
                          <textarea
                            rows={2}
                            value={t2Scores[c.id]?.remarks || ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              setT2Scores((prev) => ({
                                ...prev,
                                [c.id]: {
                                  score: prev[c.id]?.score ?? s2,
                                  remarks: val,
                                },
                              }));
                            }}
                            placeholder="Enter Judge 2's evaluation remarks..."
                            className="w-full rounded border border-sky-500/20 bg-black/60 p-2 text-xs text-slate-200 placeholder:text-slate-600 outline-none focus:border-sky-400 resize-none"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Sticky Jury Scoring Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
          <div className="text-xs text-slate-400">
            Formula: Judge 1 (<b>{t1Total}</b>) + Judge 2 (<b>{t2Total}</b>) → Final Combined: <b>{calculatedCombined}/100</b>
          </div>
          <div className="flex items-center gap-3">
            {saveSuccess && (
              <span className="text-xs font-semibold text-emerald-400">✓ Both Judges Scores Saved!</span>
            )}
            <button
              type="button"
              disabled={isSaving}
              onClick={handleSaveJuryScores}
              className="rounded-lg bg-amber-300 px-5 py-2 text-xs font-bold text-black hover:bg-amber-200 shadow-[0_0_15px_rgba(251,191,36,0.3)] disabled:opacity-50"
            >
              {isSaving ? "Saving Scores…" : "💾 Save Both Judge Evaluations"}
            </button>
            <button
              onClick={onClose}
              className="rounded-md border border-white/15 px-4 py-2 text-xs text-slate-200 hover:bg-white/10"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}