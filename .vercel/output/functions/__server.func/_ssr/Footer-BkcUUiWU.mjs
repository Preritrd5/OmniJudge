import { i as __toESM } from "../_runtime.mjs";
import { a as require_react, i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/Footer-BkcUUiWU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function useTheme() {
	const [theme, setTheme] = (0, import_react.useState)(() => {
		if (typeof window === "undefined") return "dark";
		return localStorage.getItem("theme") ?? "dark";
	});
	(0, import_react.useEffect)(() => {
		const root = document.documentElement;
		if (theme === "dark") {
			root.classList.add("dark");
			root.classList.remove("light-mode");
		} else {
			root.classList.remove("dark");
			root.classList.add("light-mode");
		}
		localStorage.setItem("theme", theme);
	}, [theme]);
	const toggle = () => setTheme((t) => t === "dark" ? "light" : "dark");
	return {
		theme,
		toggle
	};
}
function ThemeToggle() {
	const { theme, toggle } = useTheme();
	const isDark = theme === "dark";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		onClick: toggle,
		"aria-label": isDark ? "Switch to light mode" : "Switch to dark mode",
		title: isDark ? "Light mode" : "Dark mode",
		className: `
        relative inline-flex h-8 w-14 shrink-0 cursor-pointer items-center rounded-full border transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300
        ${isDark ? "border-white/20 bg-white/10" : "border-amber-400/80 bg-amber-200/50"}
      `,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "pointer-events-none absolute left-1.5 text-[10px]",
				"aria-hidden": "true",
				children: "🌙"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "pointer-events-none absolute right-1.5 text-[10px]",
				"aria-hidden": "true",
				children: "☀️"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `
          absolute h-6 w-6 rounded-full shadow-md transition-all duration-300
          ${isDark ? "left-0.5 bg-slate-300" : "left-[calc(100%-1.75rem)] bg-amber-500"}
        ` })
		]
	});
}
function Footer({ className = "", showLogo = true }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
		className: `mt-24 border-t border-white/10 pt-12 pb-14 flex flex-col items-center gap-6 text-center ${className}`,
		children: [
			showLogo && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative group cursor-pointer",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -inset-2 rounded-2xl bg-gradient-to-r from-[#67e8f9]/30 via-[#fbbf24]/30 to-[#c4b5fd]/30 opacity-70 blur-xl transition duration-500 group-hover:opacity-100 group-hover:scale-110" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative rounded-2xl p-1 bg-gradient-to-br from-white/20 via-white/5 to-black/40 shadow-[0_15px_35px_-5px_rgba(0,0,0,0.6),_inset_0_1px_1px_rgba(255,255,255,0.3)] transition-transform duration-300 group-hover:-translate-y-1.5 group-hover:scale-105",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/logo.png",
						alt: "INNOVEDGE Club Logo",
						className: "h-24 w-24 object-contain rounded-xl drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]",
						loading: "eager"
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative max-w-xl mx-auto px-6 py-5 rounded-2xl chrome-glass border border-white/15 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5),_inset_0_1px_0_rgba(255,255,255,0.2)] transform hover:-translate-y-1 transition duration-300",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-amber-300 font-bold shadow-[0_0_15px_rgba(251,191,36,0.2)]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-amber-300 animate-pulse" }), "Distinguished Faculty Mentors"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-center gap-3 pt-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 shadow-[0_4px_15px_rgba(0,0,0,0.2)] hover:border-amber-300/40 hover:bg-white/[0.08] transition",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid h-7 w-7 place-items-center rounded-lg bg-amber-300/20 text-amber-300 text-xs font-bold font-serif shadow-inner",
									children: "D"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-left",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs font-bold text-slate-100",
										children: "Denny Sir"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[9px] text-slate-400 uppercase tracking-wider",
										children: "Faculty Mentor & Judge"
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 shadow-[0_4px_15px_rgba(0,0,0,0.2)] hover:border-amber-300/40 hover:bg-white/[0.08] transition",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid h-7 w-7 place-items-center rounded-lg bg-amber-300/20 text-amber-300 text-xs font-bold font-serif shadow-inner",
									children: "B"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-left",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs font-bold text-slate-100",
										children: "Bhavya Mam"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[9px] text-slate-400 uppercase tracking-wider",
										children: "Faculty Mentor & Judge"
									})]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "pt-2 border-t border-white/5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs sm:text-sm font-medium text-slate-200",
								children: [
									"🚀 Platform Architected by ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "chrome-text font-bold",
										children: "Team SNPSU-Nexus"
									}),
									" 💻"
								]
							})
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row items-center justify-center gap-x-3 gap-y-1 text-xs text-slate-400 pt-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold text-slate-300",
						children: "© 2026 Ideathon · INNOVEDGE Club. All rights reserved."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "hidden sm:inline text-slate-600",
						children: "·"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[11px] text-slate-500 uppercase tracking-widest",
						children: "Innovation & Entrepreneurship Development Portal"
					})
				]
			})
		]
	});
}
//#endregion
export { ThemeToggle as n, Footer as t };
