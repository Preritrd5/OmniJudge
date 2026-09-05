import { i as __toESM } from "../_runtime.mjs";
import { A as redirect, _ as useRouter, c as HeadContent, d as Outlet, f as lazyRouteComponent, h as Link, m as createRootRouteWithContext, p as createFileRoute, s as Scripts, u as createRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_react, i as require_jsx_runtime, r as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { t as supabase } from "./client-B868cuT8.mjs";
import { n as QueryClient } from "../_libs/tanstack__query-core.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-OH66H35D.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-seGL8op-.css";
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		console.error("[ErrorBoundary]", error);
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$6 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Ideathon 2026 — Submission & Evaluation Platform" },
			{
				name: "description",
				content: "Official submission and evaluation portal for Ideathon 2026."
			},
			{
				name: "author",
				content: "Ideathon 2026"
			},
			{
				property: "og:title",
				content: "Ideathon 2026"
			},
			{
				property: "og:description",
				content: "Official submission and evaluation portal for Ideathon 2026."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary"
			}
		],
		links: [{
			rel: "stylesheet",
			href: styles_default
		}]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("head", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", { dangerouslySetInnerHTML: { __html: `(function(){var t=localStorage.getItem('theme')||'dark';document.documentElement.classList.toggle('light-mode',t==='light');document.documentElement.classList.toggle('dark',t==='dark');})();` } })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$6.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
	});
}
var $$splitComponentImporter$4 = () => import("./team-B4o0XOWU.mjs");
var Route$5 = createFileRoute("/team")({
	head: () => ({ meta: [{ title: "Team Portal — Ideathon 2026" }, {
		name: "description",
		content: "Team Leader portal: Register team, specify requirements, and submit proposal PDF for AI and live jury evaluation."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./auth-DZVswtO9.mjs");
var Route$4 = createFileRoute("/auth")({
	head: () => ({ meta: [{ title: "Admin Login — Ideathon 2026" }, {
		name: "description",
		content: "Sign in to the Ideathon 2026 admin portal to manage teams and review evaluations."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./route-Di7iQBCH.mjs");
var Route$3 = createFileRoute("/_authenticated")({
	ssr: false,
	beforeLoad: async () => {
		const { data, error } = await supabase.auth.getUser();
		if (error || !data.user) throw redirect({ to: "/auth" });
		return { user: data.user };
	},
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./routes-I4mWual6.mjs");
var Route$2 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "Ideathon 2026 — Submission & Evaluation Platform" },
		{
			name: "description",
			content: "The official platform for Ideathon 2026. Teams submit ideas; admins manage teams and review evaluations."
		},
		{
			property: "og:title",
			content: "Ideathon 2026"
		},
		{
			property: "og:description",
			content: "Official submission and evaluation portal."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./admin-CzkGyJ1N.mjs");
var Route$1 = createFileRoute("/_authenticated/admin")({
	head: () => ({ meta: [{ title: "Admin Dashboard — Ideathon 2026" }, {
		name: "description",
		content: "Manage Ideathon 2026 teams, partwise results, and evaluation reports."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var CORS = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "POST, OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type"
};
function json(body, status = 200) {
	return new Response(JSON.stringify(body), {
		status,
		headers: {
			"Content-Type": "application/json",
			...CORS
		}
	});
}
var Route = createFileRoute("/api/public/submit")({ server: { handlers: {
	OPTIONS: async () => new Response(null, {
		status: 204,
		headers: CORS
	}),
	POST: async ({ request }) => {
		try {
			const form = await request.formData();
			const rawName = form.get("teamName");
			const rawCategory = form.get("category");
			const file = form.get("file");
			const teamName = typeof rawName === "string" ? rawName.trim() : "";
			const category = typeof rawCategory === "string" ? rawCategory.trim() : "";
			if (!teamName || teamName.length < 2 || teamName.length > 80) return json({ error: "Team name must be 2-80 characters." }, 400);
			if (!(file instanceof File)) return json({ error: "PDF file is required." }, 400);
			if (file.size > 15 * 1024 * 1024) return json({ error: "PDF must be 15MB or smaller." }, 400);
			const { supabaseAdmin } = await import("./client.server-B8Fh2fyG.mjs");
			const { data: existing } = await supabaseAdmin.from("teams").select("id, name, leader_email").eq("name", teamName).maybeSingle();
			if (!existing?.id) return json({ error: "Team not registered. Please register your team first." }, 400);
			const teamId = existing.id;
			try {
				const { getTeamProfile, saveTeamProfile } = await import("./team-store.server-CLLCpTmY.mjs");
				const current = getTeamProfile(teamId);
				const rawMembers = form.get("members");
				let membersList = current?.members || [];
				if (typeof rawMembers === "string") try {
					membersList = JSON.parse(rawMembers);
				} catch {}
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
					createdAt: current?.createdAt || (/* @__PURE__ */ new Date()).toISOString()
				});
			} catch (profileErr) {
				console.warn("[submit] Failed to update profile store:", profileErr);
			}
			const safeName = file.name.replace(/[^\w.\-]+/g, "_").slice(0, 120);
			const path = `${teamId}/${Date.now()}-${safeName}`;
			const buf = new Uint8Array(await file.arrayBuffer());
			const { error: upErr } = await supabaseAdmin.storage.from("submissions").upload(path, buf, {
				contentType: "application/pdf",
				upsert: false
			});
			if (upErr) throw new Error(`Upload failed: ${upErr.message}`);
			const { data: sub, error: subErr } = await supabaseAdmin.from("submissions").insert({
				team_id: teamId,
				file_name: file.name,
				pdf_path: path,
				status: "pending",
				category
			}).select("id").single();
			if (subErr) throw subErr;
			const base64 = Buffer.from(buf).toString("base64");
			(async () => {
				try {
					await supabaseAdmin.from("submissions").update({ status: "evaluating" }).eq("id", sub.id);
					const { evaluatePdf } = await import("./evaluation.server-B4owh2gr.mjs");
					const result = await evaluatePdf(base64, file.name, category);
					await supabaseAdmin.from("submissions").update({
						status: "done",
						score: result.totalScore,
						result
					}).eq("id", sub.id);
				} catch (evalErr) {
					const msg = evalErr?.message || "Evaluation failed";
					console.error("[background-eval]", evalErr);
					await supabaseAdmin.from("submissions").update({
						status: "failed",
						error: msg
					}).eq("id", sub.id);
				}
			})();
			return json({
				ok: true,
				submissionId: sub.id,
				message: "Your submission has been queued and is being evaluated by the panel."
			});
		} catch (e) {
			console.error("[/api/submit]", e);
			return json({ error: e?.message || "Submission failed" }, 500);
		}
	}
} } });
var TeamRoute = Route$5.update({
	id: "/team",
	path: "/team",
	getParentRoute: () => Route$6
});
var AuthRoute = Route$4.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$6
});
var AuthenticatedRouteRoute = Route$3.update({
	id: "/_authenticated",
	getParentRoute: () => Route$6
});
var IndexRoute = Route$2.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$6
});
var AuthenticatedAdminRoute = Route$1.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => AuthenticatedRouteRoute
});
var ApiPublicSubmitRoute = Route.update({
	id: "/api/public/submit",
	path: "/api/public/submit",
	getParentRoute: () => Route$6
});
var AuthenticatedRouteRouteChildren = { AuthenticatedAdminRoute };
var rootRouteChildren = {
	IndexRoute,
	AuthenticatedRouteRoute: AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren),
	AuthRoute,
	TeamRoute,
	ApiPublicSubmitRoute
};
var routeTree = Route$6._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
