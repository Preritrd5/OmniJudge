import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ThemeToggle } from "@/components/ThemeToggle";
import Footer from "@/components/Footer";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Admin Login — Ideathon 2026" },
      { name: "description", content: "Sign in to the Ideathon 2026 admin portal to manage teams and review evaluations." },
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

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email === "admin@admin.com") {
        navigate({ to: "/admin" });
      }
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });
      if (error) throw error;
      navigate({ to: "/admin" });
    } catch (e: any) {
      setErr(e?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a14] text-slate-100 flex flex-col items-center justify-between px-4 py-8">
      <div className="w-full max-w-md my-auto">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xs uppercase tracking-[0.3em] text-amber-300/80 hover:text-amber-200">
            ← Ideathon 2026
          </Link>
          <ThemeToggle />
        </div>
        <h1 className="mt-4 font-serif text-4xl tracking-tight">Admin Portal</h1>
        <p className="mt-2 text-sm text-slate-400">Sign in to manage teams and evaluations.</p>

        <form onSubmit={submit} className="mt-8 space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur">
          <div>
            <label className="text-xs uppercase tracking-wider text-slate-400">Email</label>
            <input
              type="email"
              required
              value={email}
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
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2.5 pr-16 text-sm outline-none focus:border-amber-300/60"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-amber-300 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {err && <div className="rounded-md border border-rose-500/40 bg-rose-500/10 p-3 text-xs text-rose-200">{err}</div>}

          <button
            disabled={loading}
            className="w-full rounded-lg bg-amber-300 py-2.5 text-sm font-semibold text-black transition hover:bg-amber-200 disabled:opacity-60 cursor-pointer"
          >
            {loading ? "Please wait…" : "Sign in"}
          </button>
        </form>

        <div className="mt-4 flex items-center justify-between rounded-xl border border-amber-300/20 bg-amber-300/5 p-3 text-xs text-slate-300">
          <div>
            <span className="font-semibold text-amber-300">Default Admin Account:</span>
            <p className="font-mono text-[11px] text-slate-400">admin@admin.com</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setEmail("admin@admin.com");
              setPassword("Ideathon!2026#Judge");
            }}
            className="rounded-lg border border-amber-300/30 bg-amber-300/10 px-2.5 py-1 text-[11px] font-semibold text-amber-300 hover:bg-amber-300/20 transition cursor-pointer"
          >
            Autofill Credentials
          </button>
        </div>

        <p className="mt-4 text-center text-xs text-slate-500">
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