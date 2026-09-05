import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import ChromeScene from "@/components/ChromeScene";
import { ThemeToggle } from "@/components/ThemeToggle";
import Footer from "@/components/Footer";
import {
  registerTeamLeader,
  updateTeamRequirements,
  getTeamDashboard,
  getTopics,
} from "@/lib/admin.functions";

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title: "Team Portal — Ideathon 2026" },
      { name: "description", content: "Team Leader portal: Register team, specify requirements, and submit proposal PDF for AI and live jury evaluation." },
    ],
  }),
  component: TeamPortal,
});

interface MemberItem {
  id: string;
  name: string;
  role: string;
}

function TeamPortal() {
  const registerLeaderFn = useServerFn(registerTeamLeader);
  const updateReqsFn = useServerFn(updateTeamRequirements);
  const getDashboardFn = useServerFn(getTeamDashboard);
  const getTopicsFn = useServerFn(getTopics);

  const [authMode, setAuthMode] = useState<"register" | "signin">("register");
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [sessionLeaderName, setSessionLeaderName] = useState<string>("");

  // Registration Form State
  const [regName, setRegName] = useState("");
  const [regTeam, setRegTeam] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);

  // Sign In Form State
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Team Dashboard State
  const [teamData, setTeamData] = useState<any>(null);
  const [dashboardLoading, setDashboardLoading] = useState(false);

  // Requirements Form State
  const [selectedTopic, setSelectedTopic] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [leaderPhone, setLeaderPhone] = useState("");
  const [members, setMembers] = useState<MemberItem[]>([]);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("");
  const [reqSaveLoading, setReqSaveLoading] = useState(false);
  const [reqSaveSuccess, setReqSaveSuccess] = useState(false);

  // Topics list
  const [topics, setTopics] = useState<{ id: string; name: string }[]>([]);

  // PDF Upload State
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadDone, setUploadDone] = useState<{ ok: boolean; message: string } | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    getTopicsFn()
      .then((res) => setTopics(res.topics || []))
      .catch(() => {});

    const savedEmail = localStorage.getItem("ideathon_leader_email");
    const savedName = localStorage.getItem("ideathon_leader_name");
    if (savedEmail) {
      setSessionEmail(savedEmail);
      if (savedName) setSessionLeaderName(savedName);
      loadDashboard(savedEmail);
    } else {
      supabase.auth.getUser().then(({ data }) => {
        if (data.user?.email) {
          setSessionEmail(data.user.email);
          const metaName = (data.user.user_metadata as any)?.leader_name || "";
          if (metaName) setSessionLeaderName(metaName);
          loadDashboard(data.user.email);
        }
      });
    }
  }, []);

  const loadDashboard = async (email: string) => {
    setDashboardLoading(true);
    try {
      const res = await getDashboardFn({ data: { email } });
      if (res.found && res.team) {
        setTeamData(res.team);
        const p = res.team.profile || {};
        if (p.leaderName) setSessionLeaderName(p.leaderName);
        if (p.category) setSelectedTopic(p.category);
        if (p.projectTitle) setProjectTitle(p.projectTitle);
        if (p.projectDescription) setProjectDescription(p.projectDescription);
        if (p.leaderPhone) setLeaderPhone(p.leaderPhone);
        if (Array.isArray(p.members)) {
          setMembers(
            p.members.map((m: any, idx: number) => {
              if (typeof m === "string") {
                const parts = m.split(" - ");
                return { id: String(idx), name: parts[0] || m, role: parts[1] || "Core Member" };
              }
              return { id: String(idx), name: m.name || "", role: m.role || "Core Member" };
            })
          );
        }
      }
    } catch (e: any) {
      console.error("Dashboard error:", e);
    } finally {
      setDashboardLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    if (regPassword !== regConfirmPassword) {
      setRegError("Passwords do not match.");
      return;
    }

    setRegLoading(true);
    try {
      const res = await registerLeaderFn({
        data: {
          leaderName: regName.trim(),
          teamName: regTeam.trim(),
          email: regEmail.trim(),
          password: regPassword,
          phone: regPhone.trim() || undefined,
        },
      });

      try {
        const { data: currentAuth } = await supabase.auth.getUser();
        if (currentAuth?.user?.email !== "admin@admin.com") {
          await supabase.auth.signInWithPassword({
            email: regEmail.trim(),
            password: regPassword,
          });
        }
      } catch {}

      localStorage.setItem("ideathon_leader_email", res.leaderEmail);
      localStorage.setItem("ideathon_leader_name", res.leaderName);
      setSessionEmail(res.leaderEmail);
      setSessionLeaderName(res.leaderName);
      setLeaderPhone(regPhone.trim());
      await loadDashboard(res.leaderEmail);
    } catch (e: any) {
      setRegError(e?.message || "Registration failed. Please try again.");
    } finally {
      setRegLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);

    try {
      const { data: currentAuth } = await supabase.auth.getUser();
      if (currentAuth?.user?.email !== "admin@admin.com") {
        await supabase.auth.signInWithPassword({
          email: loginEmail.trim(),
          password: loginPassword,
        });
      }

      const email = loginEmail.trim();
      const res = await getDashboardFn({ data: { email } });
      if (!res.found) {
        throw new Error("No registered team found for this email address. Please register as a team leader.");
      }

      localStorage.setItem("ideathon_leader_email", email);
      if (res.team?.profile?.leaderName) {
        localStorage.setItem("ideathon_leader_name", res.team.profile.leaderName);
        setSessionLeaderName(res.team.profile.leaderName);
      }
      setSessionEmail(email);
      setTeamData(res.team);
      await loadDashboard(email);
    } catch (e: any) {
      setLoginError(e?.message || "Sign in failed. Check your email and password.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSignOut = async () => {
    localStorage.removeItem("ideathon_leader_email");
    localStorage.removeItem("ideathon_leader_name");
    const { data: currentAuth } = await supabase.auth.getUser();
    if (currentAuth?.user?.email !== "admin@admin.com") {
      await supabase.auth.signOut();
    }
    setSessionEmail(null);
    setTeamData(null);
    setUploadDone(null);
    setFile(null);
  };

  const handleSaveRequirements = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamData?.id || !sessionEmail) return;
    setReqSaveLoading(true);
    setReqSaveSuccess(false);

    try {
      const memberStrings = members.map((m) => `${m.name.trim()} - ${m.role.trim()}`);
      await updateReqsFn({
        data: {
          teamId: teamData.id,
          leaderEmail: sessionEmail,
          category: selectedTopic,
          projectTitle: projectTitle.trim(),
          projectDescription: projectDescription.trim(),
          leaderPhone: leaderPhone.trim(),
          members: memberStrings,
        },
      });
      setReqSaveSuccess(true);
      setTimeout(() => setReqSaveSuccess(false), 3000);
      loadDashboard(sessionEmail);
    } catch (e: any) {
      alert(e?.message || "Failed to save requirements.");
    } finally {
      setReqSaveLoading(false);
    }
  };

  const addMember = () => {
    if (!newMemberName.trim()) return;
    setMembers((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        name: newMemberName.trim(),
        role: newMemberRole.trim() || "Core Member",
      },
    ]);
    setNewMemberName("");
    setNewMemberRole("");
  };

  const removeMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const onPick = (f: File | null) => {
    if (!f) return;
    if (f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf")) {
      setUploadError("Please upload a PDF file only.");
      return;
    }
    setUploadError(null);
    setFile(f);
  };

  const handleSubmitProposal = async () => {
    if (!teamData?.name || !file) return;
    setUploadLoading(true);
    setUploadError(null);
    setUploadDone(null);

    try {
      const memberStrings = members.map((m) => `${m.name.trim()} - ${m.role.trim()}`);
      const fd = new FormData();
      fd.append("teamName", teamData.name);
      fd.append("category", selectedTopic);
      fd.append("leaderName", sessionLeaderName || teamData.profile?.leaderName || "Team Leader");
      fd.append("leaderEmail", sessionEmail || "");
      fd.append("phone", leaderPhone);
      fd.append("projectTitle", projectTitle);
      fd.append("projectDescription", projectDescription);
      fd.append("members", JSON.stringify(memberStrings));
      fd.append("file", file, file.name);

      const res = await fetch("/api/public/submit", { method: "POST", body: fd });
      const j = await res.json();
      if (!res.ok) throw new Error(j?.error || `Submission failed (${res.status})`);

      setUploadDone({
        ok: true,
        message: "Your proposal PDF has been submitted and queued for evaluation!",
      });
      setFile(null);
      if (sessionEmail) loadDashboard(sessionEmail);
    } catch (e: any) {
      setUploadError(e?.message || "Submission failed");
    } finally {
      setUploadLoading(false);
    }
  };

  const latestSub = teamData?.submissions?.[0] || null;
  const resultData = latestSub?.result || null;
  const criteriaList = Array.isArray(resultData?.criteria) ? resultData.criteria : [];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#08070f] text-slate-100">
      <div className="pointer-events-none absolute inset-0 -z-20">
        <div className="absolute -top-32 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[#a78bfa]/25 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[360px] w-[360px] rounded-full bg-[#67e8f9]/15 blur-[110px]" />
      </div>
      <ChromeScene intensity="ambient" className="pointer-events-none absolute right-[-10%] top-[-5%] -z-10 h-[80vh] w-[80vw] opacity-70" />
      <div className="pointer-events-none absolute inset-0 -z-20 opacity-[0.035]" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
      
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute -inset-1 rounded-xl bg-amber-300/30 opacity-70 blur group-hover:opacity-100 transition" />
            <img
              src="/logo.png"
              alt="INNOVEDGE Logo"
              className="relative h-10 w-10 object-contain rounded-xl drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] transform group-hover:scale-105 transition"
            />
          </div>
          <div>
            <div className="font-serif text-lg font-bold tracking-tight text-slate-100 group-hover:text-amber-300 transition">
              Ideathon 2026
            </div>
            <div className="text-[10px] uppercase tracking-widest text-slate-400">Team Leader Portal</div>
          </div>
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {sessionEmail && (
            <button
              onClick={handleSignOut}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/10 transition"
            >
              Sign Out
            </button>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        {!sessionEmail && (
          <div className="mx-auto max-w-md">
            <div className="flex rounded-xl border border-white/10 bg-white/[0.03] p-1 mb-6 backdrop-blur">
              <button
                type="button"
                onClick={() => {
                  setAuthMode("register");
                  setRegError(null);
                }}
                className={`flex-1 rounded-lg py-2 text-xs font-semibold transition ${
                  authMode === "register"
                    ? "bg-amber-300 text-black shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                👑 Register Team (Leader)
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode("signin");
                  setLoginError(null);
                }}
                className={`flex-1 rounded-lg py-2 text-xs font-semibold transition ${
                  authMode === "signin"
                    ? "bg-amber-300 text-black shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                🔑 Leader Sign In
              </button>
            </div>

            {authMode === "register" && (
              <div className="rounded-2xl border border-white/10 bg-[#0e0d1a]/80 p-6 backdrop-blur-xl shadow-2xl">
                <div className="mb-4">
                  <span className="rounded bg-amber-300/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-300 border border-amber-300/20">
                    Leader Registration Only
                  </span>
                  <h1 className="font-serif text-2xl font-bold text-slate-100 mt-2">
                    Register Your Team
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Only the team leader registers with their name, email, and password. You will then access your team's private workspace.
                  </p>
                </div>

                <form onSubmit={handleRegister} className="space-y-3.5">
                  <div>
                    <label className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                      Team Leader Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jane Doe"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-slate-100 outline-none focus:border-amber-300/60"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                      Team Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. QuantumInnovators"
                      value={regTeam}
                      onChange={(e) => setRegTeam(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-slate-100 outline-none focus:border-amber-300/60"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                      Leader Email ID *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="leader@gmail.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-slate-100 outline-none focus:border-amber-300/60"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                        Password *
                      </label>
                      <input
                        type="password"
                        required
                        minLength={6}
                        placeholder="••••••••"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-slate-100 outline-none focus:border-amber-300/60"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                        Confirm *
                      </label>
                      <input
                        type="password"
                        required
                        minLength={6}
                        placeholder="••••••••"
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-slate-100 outline-none focus:border-amber-300/60"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-slate-100 outline-none focus:border-amber-300/60"
                    />
                  </div>

                  {regError && (
                    <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-2.5 text-xs text-rose-300">
                      {regError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={regLoading}
                    className="w-full rounded-lg bg-amber-300 py-2.5 text-sm font-bold text-black hover:bg-amber-200 transition shadow-[0_0_20px_rgba(251,191,36,0.3)] disabled:opacity-50"
                  >
                    {regLoading ? "Registering Team…" : "Register Team & Open Workspace →"}
                  </button>
                </form>
              </div>
            )}

            {authMode === "signin" && (
              <div className="rounded-2xl border border-white/10 bg-[#0e0d1a]/80 p-6 backdrop-blur-xl shadow-2xl">
                <div className="mb-4">
                  <h1 className="font-serif text-2xl font-bold text-slate-100">
                    Leader Sign In
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Sign in with your registered email and password to access your team requirements and proposal status.
                  </p>
                </div>

                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <label className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                      Leader Email ID
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="leader@gmail.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-slate-100 outline-none focus:border-amber-300/60"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-slate-100 outline-none focus:border-amber-300/60"
                    />
                  </div>

                  {loginError && (
                    <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-2.5 text-xs text-rose-300">
                      {loginError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loginLoading}
                    className="w-full rounded-lg bg-amber-300 py-2.5 text-sm font-bold text-black hover:bg-amber-200 transition shadow-[0_0_20px_rgba(251,191,36,0.3)] disabled:opacity-50"
                  >
                    {loginLoading ? "Signing In…" : "Sign In to Workspace →"}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        {sessionEmail && (
          <div className="space-y-8">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-amber-300/15 px-2 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-300/30">
                    👑 Team Leader Workspace
                  </span>
                  <span className="text-xs text-emerald-400 font-medium">● Active Session</span>
                </div>
                <h1 className="font-serif text-2xl font-bold text-slate-100 mt-1">
                  {teamData?.name || "Your Team"}
                </h1>
                <p className="text-xs text-slate-400">
                  Leader: <span className="text-slate-200 font-semibold">{sessionLeaderName || teamData?.profile?.leaderName || "Team Leader"}</span> ({sessionEmail})
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => loadDashboard(sessionEmail)}
                  className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/10"
                >
                  🔄 Refresh Status
                </button>
                <button
                  onClick={handleSignOut}
                  className="rounded-lg border border-rose-400/30 px-3 py-1.5 text-xs text-rose-300 hover:bg-rose-500/10"
                >
                  Log Out
                </button>
              </div>
            </div>

            {dashboardLoading && (
              <p className="text-center text-xs text-slate-400">Loading your workspace…</p>
            )}

            {/* SECTION A: TEAM REQUIREMENTS */}
            <section className="rounded-2xl border border-white/10 bg-[#0e0d1a]/90 p-6 backdrop-blur-xl shadow-xl space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="font-serif text-xl font-bold text-slate-100">
                    Step 1: Team &amp; Project Requirements
                  </h2>
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
                    Leader Managed • Sent to Admin
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Specify your innovation track, project summary, and team members. All details are saved and provided directly to the judging panel.
                </p>
              </div>

              <form onSubmit={handleSaveRequirements} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                      Category / Innovation Track *
                    </label>
                    <select
                      value={selectedTopic}
                      onChange={(e) => setSelectedTopic(e.target.value)}
                      required
                      className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-slate-200 outline-none focus:border-amber-300/60"
                    >
                      <option value="">Select track…</option>
                      {topics.map((t) => (
                        <option key={t.id} value={t.name}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                      Leader Phone / Contact
                    </label>
                    <input
                      type="tel"
                      value={leaderPhone}
                      onChange={(e) => setLeaderPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-slate-100 outline-none focus:border-amber-300/60"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                    Project / Solution Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    placeholder="e.g. Next-Gen Autonomous Precision Agriculture System"
                    className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-slate-100 outline-none focus:border-amber-300/60"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                    Brief Problem Statement &amp; Solution Overview
                  </label>
                  <textarea
                    rows={3}
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    placeholder="Describe the real-world problem you are addressing and the core technical architecture of your solution..."
                    className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-xs text-slate-200 outline-none focus:border-amber-300/60 resize-none"
                  />
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                        Team Members
                      </span>
                      <p className="text-[11px] text-slate-400">
                        List each member of your team (excluding leader):
                      </p>
                    </div>
                    <span className="text-xs text-slate-400">{members.length + 1} Total (Leader + {members.length})</span>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-amber-300/20 bg-amber-300/5 px-3 py-2 text-xs">
                    <span className="font-semibold text-amber-200">
                      👑 {sessionLeaderName || teamData?.profile?.leaderName || "Team Leader"}
                    </span>
                    <span className="text-[10px] text-amber-300/80 uppercase tracking-wider">Team Leader</span>
                  </div>

                  {members.map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center justify-between rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-xs"
                    >
                      <div>
                        <span className="font-medium text-slate-200">{m.name}</span>
                        <span className="ml-2 text-slate-500">• {m.role}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeMember(m.id)}
                        className="text-xs text-rose-400 hover:text-rose-300"
                      >
                        Remove
                      </button>
                    </div>
                  ))}

                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="text"
                      placeholder="Member Name"
                      value={newMemberName}
                      onChange={(e) => setNewMemberName(e.target.value)}
                      className="flex-1 rounded-lg border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-amber-300/60"
                    />
                    <input
                      type="text"
                      placeholder="Role (e.g. AI / Frontend)"
                      value={newMemberRole}
                      onChange={(e) => setNewMemberRole(e.target.value)}
                      className="w-40 rounded-lg border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-amber-300/60"
                    />
                    <button
                      type="button"
                      onClick={addMember}
                      className="rounded-lg border border-amber-300/30 bg-amber-300/10 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-300/20"
                    >
                      + Add
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  {reqSaveSuccess ? (
                    <span className="text-xs text-emerald-400 font-semibold">
                      ✓ Requirements saved successfully!
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-500">
                      Remember to save before submitting proposal.
                    </span>
                  )}

                  <button
                    type="submit"
                    disabled={reqSaveLoading}
                    className="rounded-lg bg-amber-300 px-5 py-2 text-xs font-bold text-black hover:bg-amber-200 transition disabled:opacity-50 shadow-[0_0_15px_rgba(251,191,36,0.3)]"
                  >
                    {reqSaveLoading ? "Saving…" : "Save Team Requirements"}
                  </button>
                </div>
              </form>
            </section>

            {/* SECTION B: UPLOAD PDF */}
            <section className="rounded-2xl border border-white/10 bg-[#0e0d1a]/90 p-6 backdrop-blur-xl shadow-xl space-y-4">
              <div>
                <h2 className="font-serif text-xl font-bold text-slate-100">
                  Step 2: Upload Proposal PDF
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Upload your submission deck / proposal in PDF format (max 15 MB). Criteria F1–F6, F9, and F10 will be analyzed by AI; F7 &amp; F8 are evaluated live by judges.
                </p>
              </div>

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  const dropped = e.dataTransfer.files[0];
                  if (dropped) onPick(dropped);
                }}
                onClick={() => inputRef.current?.click()}
                className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 cursor-pointer transition ${
                  dragOver
                    ? "border-amber-300 bg-amber-300/10"
                    : file
                    ? "border-emerald-400/50 bg-emerald-400/5"
                    : "border-white/15 bg-white/[0.02] hover:border-amber-300/40 hover:bg-white/[0.04]"
                }`}
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={(e) => onPick(e.target.files?.[0] || null)}
                />
                <span className="text-3xl mb-2">{file ? "📄" : "📁"}</span>
                {file ? (
                  <div className="text-center">
                    <span className="font-semibold text-emerald-300 text-sm">{file.name}</span>
                    <p className="text-xs text-slate-400 mt-1">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB • Click to change file
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <span className="text-sm font-semibold text-slate-200">
                      Click to browse or drag and drop proposal PDF
                    </span>
                    <p className="text-xs text-slate-500 mt-1">Single PDF file up to 15 MB</p>
                  </div>
                )}
              </div>

              {uploadError && (
                <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
                  {uploadError}
                </div>
              )}

              {uploadDone && (
                <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300">
                  ✓ {uploadDone.message}
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSubmitProposal}
                  disabled={!file || uploadLoading}
                  className="rounded-lg bg-gradient-to-r from-amber-400 to-amber-300 px-6 py-2.5 text-xs font-bold text-black hover:opacity-90 transition shadow-[0_0_20px_rgba(251,191,36,0.35)] disabled:opacity-40"
                >
                  {uploadLoading ? "Submitting & Evaluating…" : "Submit Proposal for Evaluation →"}
                </button>
              </div>
            </section>

            {/* SECTION C: SUBMISSION STATUS */}
            {latestSub && (
              <section className="rounded-2xl border border-white/10 bg-[#0e0d1a]/90 p-6 backdrop-blur-xl shadow-xl space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">
                      Latest Submission
                    </span>
                    <h3 className="font-serif text-xl font-bold text-slate-100">
                      {latestSub.file_name}
                    </h3>
                    <span className="text-xs text-slate-400">
                      Submitted on: {new Date(latestSub.created_at).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        latestSub.status === "done"
                          ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                          : latestSub.status === "evaluating"
                          ? "bg-sky-500/15 text-sky-300 border border-sky-500/30 animate-pulse"
                          : "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                      }`}
                    >
                      {latestSub.status === "done"
                        ? "Evaluated"
                        : latestSub.status === "evaluating"
                        ? "AI Evaluating…"
                        : "Pending Evaluation"}
                    </span>

                    {latestSub.score != null && (
                      <div className="text-right">
                        <div className="text-2xl font-bold text-amber-300">
                          {latestSub.score}
                          <span className="text-sm text-slate-400">/100</span>
                        </div>
                        <div className="text-[10px] uppercase tracking-wider text-slate-400">
                          {resultData?.overallRating || ""}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {criteriaList.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-serif text-base font-bold text-slate-200">
                      Criteria Breakdown (AI &amp; Live Jury Hybrid)
                    </h4>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {criteriaList.map((c: any) => {
                        const isManual = c.type === "manual" || c.id === "F7" || c.id === "F8";

                        return (
                          <div
                            key={c.id}
                            className={`rounded-xl border p-3.5 space-y-2 ${
                              isManual
                                ? "border-amber-300/30 bg-amber-300/[0.03]"
                                : "border-white/10 bg-white/[0.02]"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-bold text-amber-300">
                                  {c.id}
                                </span>
                                <span className="text-xs font-semibold text-slate-200">{c.name}</span>
                              </div>
                              <span className="text-xs font-bold text-amber-300">
                                {c.score}/{c.maxScore ?? 10}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <span
                                className={`rounded px-1.5 py-0.5 text-[9px] font-bold tracking-wider uppercase ${
                                  isManual
                                    ? "bg-amber-400/20 text-amber-200 border border-amber-400/30"
                                    : "bg-cyan-400/20 text-cyan-200 border border-cyan-400/30"
                                }`}
                              >
                                {isManual ? "✍️ Live Jury Evaluation" : "🤖 AI Evaluated"}
                              </span>
                              {isManual && !c.isManuallyGraded && (
                                <span className="text-[10px] text-amber-300/70">
                                  (Pending live presentation)
                                </span>
                              )}
                            </div>

                            {c.evidence && (
                              <p className="text-[11px] text-slate-400 leading-relaxed">
                                <b className="text-slate-300">Evidence:</b> {c.evidence}
                              </p>
                            )}
                            {c.strengths && (
                              <p className="text-[11px] text-emerald-300/90">
                                <b className="text-emerald-200">Strengths:</b> {c.strengths}
                              </p>
                            )}
                            {c.weaknesses && (
                              <p className="text-[11px] text-rose-300/90">
                                <b className="text-rose-200">Suggestions:</b> {c.weaknesses}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </section>
            )}
          </div>
        )}

        <Footer className="mt-16 border-t border-white/5 pt-6" />
      </main>
    </div>
  );
}