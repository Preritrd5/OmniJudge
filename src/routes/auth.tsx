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
    // Check initial session on mount
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        checkAndRedirect(data.user);
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
        supabase.auth.getUser().then(({ data }) => {
          if (data.user) {
            checkAndRedirect(data.user);
          }
        });
      }
    });

    // Check on tab focus / visibility
    const handleFocus = () => {
      if (document.visibilityState === "visible") {
        supabase.auth.getUser().then(({ data }) => {
          if (data.user) {
            checkAndRedirect(data.user);
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
      await supabase.auth.signOut();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });
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
          throw new Error("Access Denied: This account does not have admin permissions.");
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

        <p className="text-center text-xs text-slate-500">
          Admin access only. Team Leaders can access their dashboard on the{" "}
          <Link to="/team" className="text-amber-300 underline hover:text-amber-200">
            Team Portal
          </Link>
          .
        </p>
      </div>

      <Footer className="mt-8 border-t-0 pt-0 pb-0" showLogo={false} />
    </div>
  );
}