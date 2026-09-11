import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ThemeToggle } from "@/components/ThemeToggle";
import Footer from "@/components/Footer";
import {
  broadcastAdminAuthChange,
  subscribeAuthSync,
} from "@/lib/auth-sync";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Admin Login — SIH Premier 2026" },
      { name: "description", content: "Sign in to the SIH Premier 2026 admin portal to manage teams and review evaluations." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const checkAndRedirect = useCallback(
    async (user: any) => {
      if (!user) return;
      if (user.email === "admin@admin.com") {
        navigate({ to: "/admin" });
        return;
      }
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();
      if (roleData) {
        navigate({ to: "/admin" });
      }
    },
    [navigate]
  );

  useEffect(() => {
    // Check initial cached session on mount (instant from memory/localStorage)
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        checkAndRedirect(data.session.user);
      }
    });

    // Listen for live auth events in this or child frames
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if ((event === "SIGNED_IN" || event === "TOKEN_REFRESHED") && session?.user) {
        checkAndRedirect(session.user);
      }
    });

    // Listen for cross-tab auth events via BroadcastChannel/storage
    const unsubscribeSync = subscribeAuthSync((event) => {
      if (event.type === "ADMIN_AUTH_CHANGED" && event.event === "SIGNED_IN") {
        supabase.auth.getSession().then(({ data }) => {
          if (data.session?.user) {
            checkAndRedirect(data.session.user);
          }
        });
      }
    });

    // Check on tab focus / visibility (instant from memory/localStorage)
    const handleFocus = () => {
      if (document.visibilityState === "visible") {
        supabase.auth.getSession().then(({ data }) => {
          if (data.session?.user) {
            checkAndRedirect(data.session.user);
          }
        });
      }
    };

    document.addEventListener("visibilitychange", handleFocus);
    window.addEventListener("focus", handleFocus);

    return () => {
      subscription.unsubscribe();
      unsubscribeSync();
      document.removeEventListener("visibilitychange", handleFocus);
      window.removeEventListener("focus", handleFocus);
    };
  }, [checkAndRedirect]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      let cleanEmail = email.trim().toLowerCase();
      // Auto-correct common variations of admin email
      if (
        cleanEmail === "admin" ||
        cleanEmail === "admin@" ||
        cleanEmail === "admin@admin" ||
        cleanEmail === "admin@admin." ||
        cleanEmail === "admin@admin.co"
      ) {
        cleanEmail = "admin@admin.com";
        setEmail("admin@admin.com");
      }

      if (!cleanEmail.includes("@") || !cleanEmail.includes(".")) {
        throw new Error("Please enter a valid email address with a domain (e.g. admin@admin.com).");
      }

      const cleanPassword = password.trim();

      // 30-second timeout to allow international Supabase Cloud TLS + bcrypt hashing
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("Authentication request timed out after 30 seconds. Please check your internet connection or try again.")),
          30000
        )
      );

      const signInPromise = supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPassword,
      });

      const { data, error } = (await Promise.race([signInPromise, timeoutPromise])) as any;
      if (error) throw error;

      if (data.user?.email !== "admin@admin.com") {
        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", data.user.id)
          .eq("role", "admin")
          .maybeSingle();
        if (!roleData) {
          await supabase.auth.signOut();
          throw new Error("Access Denied: This account does not have admin permissions. If you are a student or team leader, please sign in via the Team Portal.");
        }
      }

      // Notify all open tabs of successful admin sign-in
      broadcastAdminAuthChange({
        event: "SIGNED_IN",
        userId: data.user.id,
        email: data.user.email ?? null,
      });

      navigate({ to: "/admin" });
    } catch (e: any) {
      setErr(e?.message || "Invalid credentials. Please check your email and password.");
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemoAdmin = () => {
    setEmail("admin@admin.com");
    setPassword("Ideathon!2026#Judge");
    setErr(null);
  };

  return (
    <div className="min-h-screen bg-[#0a0a14] text-slate-100 flex flex-col items-center justify-between px-4 py-8">
      <div className="w-full max-w-md my-auto space-y-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xs uppercase tracking-[0.3em] text-amber-300/80 hover:text-amber-200">
            ← SIH Premier 2026
          </Link>
          <ThemeToggle />
        </div>

        <div>
          <h1 className="font-serif text-4xl tracking-tight">Admin Sign In</h1>
          <p className="mt-2 text-sm text-slate-400">
            Authorized administrative access for judges and organizing committee.
          </p>
        </div>

        {/* Quick Admin Credential Helper */}
        <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-3.5 text-xs text-slate-300 backdrop-blur">
          <div className="flex items-center justify-between gap-2">
            <div className="space-y-0.5">
              <div className="font-semibold text-amber-300 flex items-center gap-1.5">
                <span>👑</span> Official Admin Credentials
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                admin@admin.com
              </div>
            </div>
            <button
              type="button"
              onClick={handleFillDemoAdmin}
              className="rounded-lg border border-amber-300/40 bg-amber-300/15 px-3 py-1.5 text-[11px] font-bold text-amber-300 hover:bg-amber-300/25 transition cursor-pointer shadow-sm"
            >
              Auto-fill Credentials
            </button>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur">
          <div>
            <label className="text-xs uppercase tracking-wider text-slate-400">Email</label>
            <input
              type="email"
              required
              value={email}
              placeholder="admin@admin.com"
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2.5 text-sm outline-none focus:border-amber-300/60"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-slate-400">Password</label>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                placeholder="••••••••••••"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2.5 pr-16 text-sm outline-none focus:border-amber-300/60"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-amber-300 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 cursor-pointer"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {err && (
            <div className="rounded-md border border-rose-500/40 bg-rose-500/10 p-3 text-xs text-rose-200">
              {err}
            </div>
          )}

          <button
            disabled={loading}
            className="w-full rounded-lg bg-amber-300 py-2.5 text-sm font-semibold text-black transition hover:bg-amber-200 disabled:opacity-60 cursor-pointer shadow-[0_0_15px_rgba(251,191,36,0.25)]"
          >
            {loading ? "Signing In…" : "Sign In →"}
          </button>
        </form>

        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3.5 text-center text-xs text-slate-400 space-y-1">
          <p>
            Are you a student or Team Leader? Access your submission dashboard on the{" "}
            <Link to="/team" className="font-semibold text-amber-300 underline hover:text-amber-200">
              Team Portal →
            </Link>
          </p>
        </div>
      </div>

      <Footer className="mt-8 border-t-0 pt-0 pb-0" showLogo={false} />
    </div>
  );
}