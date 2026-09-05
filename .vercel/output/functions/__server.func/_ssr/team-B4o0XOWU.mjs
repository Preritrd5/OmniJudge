import { i as __toESM } from "../_runtime.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_react, i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { g as useServerFn, h as updateTeamRequirements, l as registerTeamLeader, o as getTeamDashboard, s as getTopics } from "./admin.functions-CAvNtq9P.mjs";
import { t as supabase } from "./client-B868cuT8.mjs";
import { t as ChromeScene } from "./ChromeScene-CItl2LoK.mjs";
import { n as ThemeToggle, t as Footer } from "./Footer-BkcUUiWU.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/team-B4o0XOWU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function TeamPortal() {
	const registerLeaderFn = useServerFn(registerTeamLeader);
	const updateReqsFn = useServerFn(updateTeamRequirements);
	const getDashboardFn = useServerFn(getTeamDashboard);
	const getTopicsFn = useServerFn(getTopics);
	const [authMode, setAuthMode] = (0, import_react.useState)("register");
	const [sessionEmail, setSessionEmail] = (0, import_react.useState)(null);
	const [sessionLeaderName, setSessionLeaderName] = (0, import_react.useState)("");
	const [regName, setRegName] = (0, import_react.useState)("");
	const [regTeam, setRegTeam] = (0, import_react.useState)("");
	const [regEmail, setRegEmail] = (0, import_react.useState)("");
	const [regPassword, setRegPassword] = (0, import_react.useState)("");
	const [regConfirmPassword, setRegConfirmPassword] = (0, import_react.useState)("");
	const [regPhone, setRegPhone] = (0, import_react.useState)("");
	const [regLoading, setRegLoading] = (0, import_react.useState)(false);
	const [regError, setRegError] = (0, import_react.useState)(null);
	const [loginEmail, setLoginEmail] = (0, import_react.useState)("");
	const [loginPassword, setLoginPassword] = (0, import_react.useState)("");
	const [loginLoading, setLoginLoading] = (0, import_react.useState)(false);
	const [loginError, setLoginError] = (0, import_react.useState)(null);
	const [teamData, setTeamData] = (0, import_react.useState)(null);
	const [dashboardLoading, setDashboardLoading] = (0, import_react.useState)(false);
	const [selectedTopic, setSelectedTopic] = (0, import_react.useState)("");
	const [projectTitle, setProjectTitle] = (0, import_react.useState)("");
	const [projectDescription, setProjectDescription] = (0, import_react.useState)("");
	const [leaderPhone, setLeaderPhone] = (0, import_react.useState)("");
	const [members, setMembers] = (0, import_react.useState)([]);
	const [newMemberName, setNewMemberName] = (0, import_react.useState)("");
	const [newMemberRole, setNewMemberRole] = (0, import_react.useState)("");
	const [reqSaveLoading, setReqSaveLoading] = (0, import_react.useState)(false);
	const [reqSaveSuccess, setReqSaveSuccess] = (0, import_react.useState)(false);
	const [topics, setTopics] = (0, import_react.useState)([]);
	const inputRef = (0, import_react.useRef)(null);
	const [file, setFile] = (0, import_react.useState)(null);
	const [dragOver, setDragOver] = (0, import_react.useState)(false);
	const [uploadLoading, setUploadLoading] = (0, import_react.useState)(false);
	const [uploadDone, setUploadDone] = (0, import_react.useState)(null);
	const [uploadError, setUploadError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		getTopicsFn().then((res) => setTopics(res.topics || [])).catch(() => {});
		const savedEmail = localStorage.getItem("ideathon_leader_email");
		const savedName = localStorage.getItem("ideathon_leader_name");
		if (savedEmail) {
			setSessionEmail(savedEmail);
			if (savedName) setSessionLeaderName(savedName);
			loadDashboard(savedEmail);
		} else supabase.auth.getUser().then(({ data }) => {
			if (data.user?.email) {
				setSessionEmail(data.user.email);
				const metaName = data.user.user_metadata?.leader_name || "";
				if (metaName) setSessionLeaderName(metaName);
				loadDashboard(data.user.email);
			}
		});
	}, []);
	const loadDashboard = async (email) => {
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
				if (Array.isArray(p.members)) setMembers(p.members.map((m, idx) => {
					if (typeof m === "string") {
						const parts = m.split(" - ");
						return {
							id: String(idx),
							name: parts[0] || m,
							role: parts[1] || "Core Member"
						};
					}
					return {
						id: String(idx),
						name: m.name || "",
						role: m.role || "Core Member"
					};
				}));
			}
		} catch (e) {
			console.error("Dashboard error:", e);
		} finally {
			setDashboardLoading(false);
		}
	};
	const handleRegister = async (e) => {
		e.preventDefault();
		setRegError(null);
		if (regPassword !== regConfirmPassword) {
			setRegError("Passwords do not match.");
			return;
		}
		setRegLoading(true);
		try {
			const res = await registerLeaderFn({ data: {
				leaderName: regName.trim(),
				teamName: regTeam.trim(),
				email: regEmail.trim(),
				password: regPassword,
				phone: regPhone.trim() || void 0
			} });
			try {
				const { data: currentAuth } = await supabase.auth.getUser();
				if (currentAuth?.user?.email !== "admin@admin.com") await supabase.auth.signInWithPassword({
					email: regEmail.trim(),
					password: regPassword
				});
			} catch {}
			localStorage.setItem("ideathon_leader_email", res.leaderEmail);
			localStorage.setItem("ideathon_leader_name", res.leaderName);
			setSessionEmail(res.leaderEmail);
			setSessionLeaderName(res.leaderName);
			setLeaderPhone(regPhone.trim());
			await loadDashboard(res.leaderEmail);
		} catch (e) {
			setRegError(e?.message || "Registration failed. Please try again.");
		} finally {
			setRegLoading(false);
		}
	};
	const handleSignIn = async (e) => {
		e.preventDefault();
		setLoginError(null);
		setLoginLoading(true);
		try {
			const { data: currentAuth } = await supabase.auth.getUser();
			if (currentAuth?.user?.email !== "admin@admin.com") await supabase.auth.signInWithPassword({
				email: loginEmail.trim(),
				password: loginPassword
			});
			const email = loginEmail.trim();
			const res = await getDashboardFn({ data: { email } });
			if (!res.found) throw new Error("No registered team found for this email address. Please register as a team leader.");
			localStorage.setItem("ideathon_leader_email", email);
			if (res.team?.profile?.leaderName) {
				localStorage.setItem("ideathon_leader_name", res.team.profile.leaderName);
				setSessionLeaderName(res.team.profile.leaderName);
			}
			setSessionEmail(email);
			setTeamData(res.team);
			await loadDashboard(email);
		} catch (e) {
			setLoginError(e?.message || "Sign in failed. Check your email and password.");
		} finally {
			setLoginLoading(false);
		}
	};
	const handleSignOut = async () => {
		localStorage.removeItem("ideathon_leader_email");
		localStorage.removeItem("ideathon_leader_name");
		const { data: currentAuth } = await supabase.auth.getUser();
		if (currentAuth?.user?.email !== "admin@admin.com") await supabase.auth.signOut();
		setSessionEmail(null);
		setTeamData(null);
		setUploadDone(null);
		setFile(null);
	};
	const handleSaveRequirements = async (e) => {
		e.preventDefault();
		if (!teamData?.id || !sessionEmail) return;
		setReqSaveLoading(true);
		setReqSaveSuccess(false);
		try {
			const memberStrings = members.map((m) => `${m.name.trim()} - ${m.role.trim()}`);
			await updateReqsFn({ data: {
				teamId: teamData.id,
				leaderEmail: sessionEmail,
				category: selectedTopic,
				projectTitle: projectTitle.trim(),
				projectDescription: projectDescription.trim(),
				leaderPhone: leaderPhone.trim(),
				members: memberStrings
			} });
			setReqSaveSuccess(true);
			setTimeout(() => setReqSaveSuccess(false), 3e3);
			loadDashboard(sessionEmail);
		} catch (e) {
			alert(e?.message || "Failed to save requirements.");
		} finally {
			setReqSaveLoading(false);
		}
	};
	const addMember = () => {
		if (!newMemberName.trim()) return;
		setMembers((prev) => [...prev, {
			id: String(Date.now()),
			name: newMemberName.trim(),
			role: newMemberRole.trim() || "Core Member"
		}]);
		setNewMemberName("");
		setNewMemberRole("");
	};
	const removeMember = (id) => {
		setMembers((prev) => prev.filter((m) => m.id !== id));
	};
	const onPick = (f) => {
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
			const res = await fetch("/api/public/submit", {
				method: "POST",
				body: fd
			});
			const j = await res.json();
			if (!res.ok) throw new Error(j?.error || `Submission failed (${res.status})`);
			setUploadDone({
				ok: true,
				message: "Your proposal PDF has been submitted and queued for evaluation!"
			});
			setFile(null);
			if (sessionEmail) loadDashboard(sessionEmail);
		} catch (e) {
			setUploadError(e?.message || "Submission failed");
		} finally {
			setUploadLoading(false);
		}
	};
	const latestSub = teamData?.submissions?.[0] || null;
	const resultData = latestSub?.result || null;
	const criteriaList = Array.isArray(resultData?.criteria) ? resultData.criteria : [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative min-h-screen overflow-hidden bg-[#08070f] text-slate-100",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pointer-events-none absolute inset-0 -z-20",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-32 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[#a78bfa]/25 blur-[120px]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute bottom-0 right-0 h-[360px] w-[360px] rounded-full bg-[#67e8f9]/15 blur-[110px]" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChromeScene, {
				intensity: "ambient",
				className: "pointer-events-none absolute right-[-10%] top-[-5%] -z-10 h-[80vh] w-[80vw] opacity-70"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none absolute inset-0 -z-20 opacity-[0.035]",
				style: {
					backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
					backgroundSize: "28px 28px"
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "mx-auto flex max-w-5xl items-center justify-between px-6 py-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "flex items-center gap-3 group",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -inset-1 rounded-xl bg-amber-300/30 opacity-70 blur group-hover:opacity-100 transition" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: "/logo.png",
							alt: "INNOVEDGE Logo",
							className: "relative h-10 w-10 object-contain rounded-xl drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] transform group-hover:scale-105 transition"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-serif text-lg font-bold tracking-tight text-slate-100 group-hover:text-amber-300 transition",
						children: "Ideathon 2026"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[10px] uppercase tracking-widest text-slate-400",
						children: "Team Leader Portal"
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeToggle, {}), sessionEmail && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: handleSignOut,
						className: "rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/10 transition",
						children: "Sign Out"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-4xl px-4 py-8 sm:px-6",
				children: [
					!sessionEmail && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto max-w-md",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex rounded-xl border border-white/10 bg-white/[0.03] p-1 mb-6 backdrop-blur",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => {
										setAuthMode("register");
										setRegError(null);
									},
									className: `flex-1 rounded-lg py-2 text-xs font-semibold transition ${authMode === "register" ? "bg-amber-300 text-black shadow-md" : "text-slate-400 hover:text-white"}`,
									children: "👑 Register Team (Leader)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => {
										setAuthMode("signin");
										setLoginError(null);
									},
									className: `flex-1 rounded-lg py-2 text-xs font-semibold transition ${authMode === "signin" ? "bg-amber-300 text-black shadow-md" : "text-slate-400 hover:text-white"}`,
									children: "🔑 Leader Sign In"
								})]
							}),
							authMode === "register" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-white/10 bg-[#0e0d1a]/80 p-6 backdrop-blur-xl shadow-2xl",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "rounded bg-amber-300/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-300 border border-amber-300/20",
											children: "Leader Registration Only"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
											className: "font-serif text-2xl font-bold text-slate-100 mt-2",
											children: "Register Your Team"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-slate-400 mt-1",
											children: "Only the team leader registers with their name, email, and password. You will then access your team's private workspace."
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
									onSubmit: handleRegister,
									className: "space-y-3.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "text-[11px] font-medium uppercase tracking-wider text-slate-400",
											children: "Team Leader Name *"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											required: true,
											placeholder: "e.g. Jane Doe",
											value: regName,
											onChange: (e) => setRegName(e.target.value),
											className: "mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-slate-100 outline-none focus:border-amber-300/60"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "text-[11px] font-medium uppercase tracking-wider text-slate-400",
											children: "Team Name *"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											required: true,
											placeholder: "e.g. QuantumInnovators",
											value: regTeam,
											onChange: (e) => setRegTeam(e.target.value),
											className: "mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-slate-100 outline-none focus:border-amber-300/60"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "text-[11px] font-medium uppercase tracking-wider text-slate-400",
											children: "Leader Email ID *"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "email",
											required: true,
											placeholder: "leader@gmail.com",
											value: regEmail,
											onChange: (e) => setRegEmail(e.target.value),
											className: "mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-slate-100 outline-none focus:border-amber-300/60"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid grid-cols-2 gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "text-[11px] font-medium uppercase tracking-wider text-slate-400",
												children: "Password *"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "password",
												required: true,
												minLength: 6,
												placeholder: "••••••••",
												value: regPassword,
												onChange: (e) => setRegPassword(e.target.value),
												className: "mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-slate-100 outline-none focus:border-amber-300/60"
											})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "text-[11px] font-medium uppercase tracking-wider text-slate-400",
												children: "Confirm *"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "password",
												required: true,
												minLength: 6,
												placeholder: "••••••••",
												value: regConfirmPassword,
												onChange: (e) => setRegConfirmPassword(e.target.value),
												className: "mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-slate-100 outline-none focus:border-amber-300/60"
											})] })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "text-[11px] font-medium uppercase tracking-wider text-slate-400",
											children: "Phone Number (Optional)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "tel",
											placeholder: "+91 98765 43210",
											value: regPhone,
											onChange: (e) => setRegPhone(e.target.value),
											className: "mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-slate-100 outline-none focus:border-amber-300/60"
										})] }),
										regError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "rounded-lg border border-rose-500/30 bg-rose-500/10 p-2.5 text-xs text-rose-300",
											children: regError
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "submit",
											disabled: regLoading,
											className: "w-full rounded-lg bg-amber-300 py-2.5 text-sm font-bold text-black hover:bg-amber-200 transition shadow-[0_0_20px_rgba(251,191,36,0.3)] disabled:opacity-50",
											children: regLoading ? "Registering Team…" : "Register Team & Open Workspace →"
										})
									]
								})]
							}),
							authMode === "signin" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-white/10 bg-[#0e0d1a]/80 p-6 backdrop-blur-xl shadow-2xl",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
										className: "font-serif text-2xl font-bold text-slate-100",
										children: "Leader Sign In"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-slate-400 mt-1",
										children: "Sign in with your registered email and password to access your team requirements and proposal status."
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
									onSubmit: handleSignIn,
									className: "space-y-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "text-[11px] font-medium uppercase tracking-wider text-slate-400",
											children: "Leader Email ID"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "email",
											required: true,
											placeholder: "leader@gmail.com",
											value: loginEmail,
											onChange: (e) => setLoginEmail(e.target.value),
											className: "mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-slate-100 outline-none focus:border-amber-300/60"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "text-[11px] font-medium uppercase tracking-wider text-slate-400",
											children: "Password"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "password",
											required: true,
											placeholder: "••••••••",
											value: loginPassword,
											onChange: (e) => setLoginPassword(e.target.value),
											className: "mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-slate-100 outline-none focus:border-amber-300/60"
										})] }),
										loginError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "rounded-lg border border-rose-500/30 bg-rose-500/10 p-2.5 text-xs text-rose-300",
											children: loginError
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "submit",
											disabled: loginLoading,
											className: "w-full rounded-lg bg-amber-300 py-2.5 text-sm font-bold text-black hover:bg-amber-200 transition shadow-[0_0_20px_rgba(251,191,36,0.3)] disabled:opacity-50",
											children: loginLoading ? "Signing In…" : "Sign In to Workspace →"
										})
									]
								})]
							})
						]
					}),
					sessionEmail && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-8",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur flex flex-wrap items-center justify-between gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "rounded bg-amber-300/15 px-2 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-300/30",
											children: "👑 Team Leader Workspace"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs text-emerald-400 font-medium",
											children: "● Active Session"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
										className: "font-serif text-2xl font-bold text-slate-100 mt-1",
										children: teamData?.name || "Your Team"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-slate-400",
										children: [
											"Leader: ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-slate-200 font-semibold",
												children: sessionLeaderName || teamData?.profile?.leaderName || "Team Leader"
											}),
											" (",
											sessionEmail,
											")"
										]
									})
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => loadDashboard(sessionEmail),
										className: "rounded-lg border border-white/15 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/10",
										children: "🔄 Refresh Status"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: handleSignOut,
										className: "rounded-lg border border-rose-400/30 px-3 py-1.5 text-xs text-rose-300 hover:bg-rose-500/10",
										children: "Log Out"
									})]
								})]
							}),
							dashboardLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-center text-xs text-slate-400",
								children: "Loading your workspace…"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
								className: "rounded-2xl border border-white/10 bg-[#0e0d1a]/90 p-6 backdrop-blur-xl shadow-xl space-y-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "font-serif text-xl font-bold text-slate-100",
										children: "Step 1: Team & Project Requirements"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-slate-400 uppercase tracking-widest font-semibold",
										children: "Leader Managed • Sent to Admin"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-slate-400 mt-0.5",
									children: "Specify your innovation track, project summary, and team members. All details are saved and provided directly to the judging panel."
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
									onSubmit: handleSaveRequirements,
									className: "space-y-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid gap-4 sm:grid-cols-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "text-[11px] font-medium uppercase tracking-wider text-slate-400",
												children: "Category / Innovation Track *"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												value: selectedTopic,
												onChange: (e) => setSelectedTopic(e.target.value),
												required: true,
												className: "mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-slate-200 outline-none focus:border-amber-300/60",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "",
													children: "Select track…"
												}), topics.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: t.name,
													children: t.name
												}, t.id))]
											})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "text-[11px] font-medium uppercase tracking-wider text-slate-400",
												children: "Leader Phone / Contact"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "tel",
												value: leaderPhone,
												onChange: (e) => setLeaderPhone(e.target.value),
												placeholder: "+91 98765 43210",
												className: "mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-slate-100 outline-none focus:border-amber-300/60"
											})] })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "text-[11px] font-medium uppercase tracking-wider text-slate-400",
											children: "Project / Solution Title *"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											required: true,
											value: projectTitle,
											onChange: (e) => setProjectTitle(e.target.value),
											placeholder: "e.g. Next-Gen Autonomous Precision Agriculture System",
											className: "mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-slate-100 outline-none focus:border-amber-300/60"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "text-[11px] font-medium uppercase tracking-wider text-slate-400",
											children: "Brief Problem Statement & Solution Overview"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
											rows: 3,
											value: projectDescription,
											onChange: (e) => setProjectDescription(e.target.value),
											placeholder: "Describe the real-world problem you are addressing and the core technical architecture of your solution...",
											className: "mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-xs text-slate-200 outline-none focus:border-amber-300/60 resize-none"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-3",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center justify-between",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-xs font-bold uppercase tracking-wider text-amber-300",
														children: "Team Members"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-[11px] text-slate-400",
														children: "List each member of your team (excluding leader):"
													})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "text-xs text-slate-400",
														children: [
															members.length + 1,
															" Total (Leader + ",
															members.length,
															")"
														]
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center justify-between rounded-lg border border-amber-300/20 bg-amber-300/5 px-3 py-2 text-xs",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "font-semibold text-amber-200",
														children: ["👑 ", sessionLeaderName || teamData?.profile?.leaderName || "Team Leader"]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-[10px] text-amber-300/80 uppercase tracking-wider",
														children: "Team Leader"
													})]
												}),
												members.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center justify-between rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-xs",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-medium text-slate-200",
														children: m.name
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "ml-2 text-slate-500",
														children: ["• ", m.role]
													})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														onClick: () => removeMember(m.id),
														className: "text-xs text-rose-400 hover:text-rose-300",
														children: "Remove"
													})]
												}, m.id)),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-2 pt-2",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
															type: "text",
															placeholder: "Member Name",
															value: newMemberName,
															onChange: (e) => setNewMemberName(e.target.value),
															className: "flex-1 rounded-lg border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-amber-300/60"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
															type: "text",
															placeholder: "Role (e.g. AI / Frontend)",
															value: newMemberRole,
															onChange: (e) => setNewMemberRole(e.target.value),
															className: "w-40 rounded-lg border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-amber-300/60"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															type: "button",
															onClick: addMember,
															className: "rounded-lg border border-amber-300/30 bg-amber-300/10 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-300/20",
															children: "+ Add"
														})
													]
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between pt-2",
											children: [reqSaveSuccess ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs text-emerald-400 font-semibold",
												children: "✓ Requirements saved successfully!"
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[11px] text-slate-500",
												children: "Remember to save before submitting proposal."
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "submit",
												disabled: reqSaveLoading,
												className: "rounded-lg bg-amber-300 px-5 py-2 text-xs font-bold text-black hover:bg-amber-200 transition disabled:opacity-50 shadow-[0_0_15px_rgba(251,191,36,0.3)]",
												children: reqSaveLoading ? "Saving…" : "Save Team Requirements"
											})]
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
								className: "rounded-2xl border border-white/10 bg-[#0e0d1a]/90 p-6 backdrop-blur-xl shadow-xl space-y-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "font-serif text-xl font-bold text-slate-100",
										children: "Step 2: Upload Proposal PDF"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-slate-400 mt-0.5",
										children: "Upload your submission deck / proposal in PDF format (max 15 MB). Criteria F1–F6, F9, and F10 will be analyzed by AI; F7 & F8 are evaluated live by judges."
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										onDragOver: (e) => {
											e.preventDefault();
											setDragOver(true);
										},
										onDragLeave: () => setDragOver(false),
										onDrop: (e) => {
											e.preventDefault();
											setDragOver(false);
											const dropped = e.dataTransfer.files[0];
											if (dropped) onPick(dropped);
										},
										onClick: () => inputRef.current?.click(),
										className: `flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 cursor-pointer transition ${dragOver ? "border-amber-300 bg-amber-300/10" : file ? "border-emerald-400/50 bg-emerald-400/5" : "border-white/15 bg-white/[0.02] hover:border-amber-300/40 hover:bg-white/[0.04]"}`,
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												ref: inputRef,
												type: "file",
												accept: "application/pdf",
												className: "hidden",
												onChange: (e) => onPick(e.target.files?.[0] || null)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-3xl mb-2",
												children: file ? "📄" : "📁"
											}),
											file ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-center",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-semibold text-emerald-300 text-sm",
													children: file.name
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-xs text-slate-400 mt-1",
													children: [(file.size / (1024 * 1024)).toFixed(2), " MB • Click to change file"]
												})]
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-center",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-sm font-semibold text-slate-200",
													children: "Click to browse or drag and drop proposal PDF"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs text-slate-500 mt-1",
													children: "Single PDF file up to 15 MB"
												})]
											})
										]
									}),
									uploadError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300",
										children: uploadError
									}),
									uploadDone && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300",
										children: ["✓ ", uploadDone.message]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex justify-end",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: handleSubmitProposal,
											disabled: !file || uploadLoading,
											className: "rounded-lg bg-gradient-to-r from-amber-400 to-amber-300 px-6 py-2.5 text-xs font-bold text-black hover:opacity-90 transition shadow-[0_0_20px_rgba(251,191,36,0.35)] disabled:opacity-40",
											children: uploadLoading ? "Submitting & Evaluating…" : "Submit Proposal for Evaluation →"
										})
									})
								]
							}),
							latestSub && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
								className: "rounded-2xl border border-white/10 bg-[#0e0d1a]/90 p-6 backdrop-blur-xl shadow-xl space-y-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] uppercase font-bold tracking-widest text-slate-500",
											children: "Latest Submission"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "font-serif text-xl font-bold text-slate-100",
											children: latestSub.file_name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-xs text-slate-400",
											children: ["Submitted on: ", new Date(latestSub.created_at).toLocaleString()]
										})
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `rounded-full px-3 py-1 text-xs font-semibold ${latestSub.status === "done" ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30" : latestSub.status === "evaluating" ? "bg-sky-500/15 text-sky-300 border border-sky-500/30 animate-pulse" : "bg-amber-500/15 text-amber-300 border border-amber-500/30"}`,
											children: latestSub.status === "done" ? "Evaluated" : latestSub.status === "evaluating" ? "AI Evaluating…" : "Pending Evaluation"
										}), latestSub.score != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-right",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-2xl font-bold text-amber-300",
												children: [latestSub.score, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-sm text-slate-400",
													children: "/100"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-[10px] uppercase tracking-wider text-slate-400",
												children: resultData?.overallRating || ""
											})]
										})]
									})]
								}), criteriaList.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: "font-serif text-base font-bold text-slate-200",
										children: "Criteria Breakdown (AI & Live Jury Hybrid)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid gap-3 sm:grid-cols-2",
										children: criteriaList.map((c) => {
											const isManual = c.type === "manual" || c.id === "F7" || c.id === "F8";
											return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: `rounded-xl border p-3.5 space-y-2 ${isManual ? "border-amber-300/30 bg-amber-300/[0.03]" : "border-white/10 bg-white/[0.02]"}`,
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center justify-between",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex items-center gap-2",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-bold text-amber-300",
																children: c.id
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "text-xs font-semibold text-slate-200",
																children: c.name
															})]
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "text-xs font-bold text-amber-300",
															children: [
																c.score,
																"/",
																c.maxScore ?? 10
															]
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center gap-2",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: `rounded px-1.5 py-0.5 text-[9px] font-bold tracking-wider uppercase ${isManual ? "bg-amber-400/20 text-amber-200 border border-amber-400/30" : "bg-cyan-400/20 text-cyan-200 border border-cyan-400/30"}`,
															children: isManual ? "✍️ Live Jury Evaluation" : "🤖 AI Evaluated"
														}), isManual && !c.isManuallyGraded && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-[10px] text-amber-300/70",
															children: "(Pending live presentation)"
														})]
													}),
													c.evidence && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
														className: "text-[11px] text-slate-400 leading-relaxed",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
																className: "text-slate-300",
																children: "Evidence:"
															}),
															" ",
															c.evidence
														]
													}),
													c.strengths && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
														className: "text-[11px] text-emerald-300/90",
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
														className: "text-[11px] text-rose-300/90",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
																className: "text-rose-200",
																children: "Suggestions:"
															}),
															" ",
															c.weaknesses
														]
													})
												]
											}, c.id);
										})
									})]
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, { className: "mt-16 border-t border-white/5 pt-6" })
				]
			})
		]
	});
}
//#endregion
export { TeamPortal as component };
