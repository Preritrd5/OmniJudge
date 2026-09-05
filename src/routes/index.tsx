import { createFileRoute, Link } from "@tanstack/react-router";
import ChromeScene from "@/components/ChromeScene";
import { ThemeToggle } from "@/components/ThemeToggle";
import Footer from "@/components/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ideathon 2026 — Submission & Evaluation Platform" },
      { name: "description", content: "The official platform for Ideathon 2026. Teams submit ideas; admins manage teams and review evaluations." },
      { property: "og:title", content: "Ideathon 2026" },
      { property: "og:description", content: "Official submission and evaluation portal." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#08070f] text-slate-100">
      {/* Ambient gradient field */}
      <div className="pointer-events-none absolute inset-0 -z-20">
        <div className="absolute -top-40 left-1/2 h-[640px] w-[640px] -translate-x-1/2 rounded-full bg-[#a78bfa]/25 blur-[140px]" />
        <div className="absolute -bottom-20 left-0 h-[440px] w-[440px] rounded-full bg-[#67e8f9]/20 blur-[140px]" />
        <div className="absolute -bottom-10 right-0 h-[420px] w-[420px] rounded-full bg-[#f5d0fe]/15 blur-[140px]" />
      </div>
      <div className="pointer-events-none absolute inset-0 -z-20 opacity-[0.05]" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

      {/* 3D hero canvas */}
      <ChromeScene className="pointer-events-none absolute inset-x-0 top-0 -z-10 mx-auto h-[88vh] w-full max-w-[1400px]" />

      <header className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-amber-300/40 via-cyan-400/40 to-purple-500/40 opacity-75 blur-md group-hover:opacity-100 transition duration-300" />
            <img
              src="/logo.png"
              alt="INNOVEDGE Logo"
              className="relative h-11 w-11 object-contain rounded-xl drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)] transform group-hover:scale-105 transition"
            />
          </div>
          <div>
            <p className="font-serif text-xl tracking-tight font-bold">
              Ideathon<span className="chrome-text">.</span>2026
            </p>
            <span className="text-[9px] uppercase tracking-[0.25em] text-amber-300 font-bold block -mt-0.5">INNOVEDGE CLUB</span>
          </div>
        </div>
        <nav className="flex items-center gap-2">
          <Link to="/team" className="rounded-full border border-amber-300/40 bg-amber-300/10 px-4 py-2 text-xs uppercase tracking-[0.15em] font-bold text-amber-300 hover:bg-amber-300/20">
            Team Portal
          </Link>
          {/* <Link to="/auth" className="rounded-full chrome-glass px-4 py-2 text-xs uppercase tracking-[0.2em] text-slate-100 transition hover:bg-white/10 btn-3d">
            Admin
          </Link> */}
          <ThemeToggle />
        </nav>
      </header>

      <main className="relative mx-auto max-w-6xl px-6 pb-24 pt-12 sm:pt-20">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full chrome-glass px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#a5f3fc] shadow-[0_0_8px_#a5f3fc]" />
            Live · Official INNOVEDGE Platform
          </div>
          <h1 className="mt-5 font-serif text-[2.8rem] leading-[1.02] tracking-tight sm:text-7xl lg:text-[5.4rem]">
            Big ideas,
            <br />
            <span className="chrome-text italic">judged fairly.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base text-slate-300/90 sm:text-lg leading-relaxed">
            Teams submit a pitch PDF. An AI panel scores it against a transparent
            ten-criterion rubric — every mark backed by evidence, every deduction explained.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/team"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-300 via-amber-200 to-amber-400 px-7 py-3.5 text-sm font-bold text-[#0b0a14] btn-3d shadow-[0_10px_35px_-5px_rgba(251,191,36,0.6)]"
            >
              Submit your idea
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
            {/* <Link
              to="/auth"
              className="inline-flex items-center gap-2 rounded-full chrome-glass px-6 py-3.5 text-sm text-slate-100 transition hover:bg-white/10 card-3d card-3d-hover"
            >
              Open admin panel
            </Link> */}
          </div>
        </div>

        {/* Stats 3D glass strip */}
        <div className="mt-16 grid grid-cols-3 overflow-hidden rounded-2xl chrome-glass text-center card-3d shadow-[0_20px_50px_-15px_rgba(0,0,0,0.7),_inset_0_1px_1px_rgba(255,255,255,0.2)]">
          {[
            ["10", "Criteria"],
            ["100", "Total marks"],
            ["F1–F10", "Rubric bands"],
          ].map(([n, l], i) => (
            <div
              key={l}
              className={`px-4 py-6 ${i < 2 ? "border-r border-white/10" : ""}`}
            >
              <div className="font-serif text-3xl sm:text-4xl chrome-text font-black">{n}</div>
              <div className="mt-1 text-[10px] uppercase tracking-[0.25em] text-slate-400 font-semibold">{l}</div>
            </div>
          ))}
        </div>

        {/* Big 3D tilt cards */}
        <div className="mt-14 grid gap-5 lg:grid-cols-2">
          <PortalCard
            to="/team"
            tag="For Teams"
            title="Submit your idea"
            blurb="Choose your team, select track, verify leader email, and attach pitch PDF for instant AI scoring."
            tone="cyan"
          />
          <PortalCard
            to="/auth"
            tag="For Admins"
            title="Run the panel"
            blurb="Manage teams, review evaluations, generate 1-page/2-page PDFs, and declare winners on podium."
            tone="violet"
          />
        </div>

        {/* Marquee of capabilities */}
        <div className="mt-16 overflow-hidden rounded-2xl chrome-glass card-3d">
          <div className="flex animate-[scroll_30s_linear_infinite] gap-10 whitespace-nowrap py-4 text-xs uppercase tracking-[0.3em] text-slate-300 font-medium">
            {Array.from({ length: 2 }).flatMap((_, k) =>
              ["INNOVEDGE Club", "3D Evaluation Engine", "Evidence-backed scores", "1-Page & 2-Page PDFs", "Partwise Results", "Grand Podium", "Instant AI Rubric"].map((s, i) => (
                <span key={`${k}-${i}`} className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-300 shadow-[0_0_8px_#fbbf24]" />
                  {s}
                </span>
              )),
            )}
          </div>
        </div>

        {/* Rubric */}
        <section className="mt-24">
          <div className="flex items-baseline justify-between">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold">The 10-Criterion Rubric</h2>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-sky-500/15 border border-sky-500/30 px-2.5 py-0.5 text-[10px] font-bold text-sky-300">
                🤖 80 Marks AI
              </span>
              <span className="rounded-full bg-purple-500/15 border border-purple-500/30 px-2.5 py-0.5 text-[10px] font-bold text-purple-300">
                ✍️ 20 Marks Jury (F7 & F8)
              </span>
            </div>
          </div>
          <ol className="mt-8 grid gap-3.5 sm:grid-cols-2">
            {[
              ["F1", "Innovation & Creativity", "Novelty of idea & creative problem-solving", "ai"],
              ["F2", "Technical Feasibility", "Complexity, feasibility, and scalability", "ai"],
              ["F3", "User Experience & Design", "UI/UX, accessibility, and inclusivity", "ai"],
              ["F4", "Impact & Usefulness", "Problem-solution fit, potential impact, and multiple use cases", "ai"],
              ["F5", "Technical Execution", "Prototype, code quality, and technology stack", "ai"],
              ["F6", "Sustainability & Future Scope", "Long-term viability & eco-friendly practices", "ai"],
              ["F7", "Presentation & Communication", "Clarity, pitch delivery, and Q&A handling (Live In-Person)", "manual"],
              ["F8", "Collaboration & Teamwork", "Team dynamics, cross-functional synergy & problem-solving", "manual"],
              ["F9", "Business Viability (if applicable)", "Market potential, revenue model, and affordability", "ai"],
              ["F10", "Security & Privacy", "Data protection & compliance with privacy regulations", "ai"],
            ].map(([id, t, d, mode]) => {
              const isManual = mode === "manual";
              return (
                <li key={id} className={`group relative overflow-hidden rounded-2xl chrome-glass p-5 card-3d card-3d-hover ${isManual ? "border-purple-500/30" : ""}`}>
                  <div className="flex items-baseline justify-between gap-3">
                    <div className="flex items-baseline gap-3 min-w-0">
                      <span className="font-serif text-3xl chrome-text font-black">{id}</span>
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-semibold text-slate-100">{t}</h3>
                        {isManual ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-purple-300 bg-purple-500/15 border border-purple-500/30 px-2 py-0.5 rounded mt-0.5">
                            ✍️ Manual Jury Evaluation
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-sky-300 bg-sky-500/15 border border-sky-500/30 px-2 py-0.5 rounded mt-0.5">
                            🤖 AI Evaluated
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="shrink-0 text-[10px] uppercase tracking-wider text-amber-300 font-bold">10 marks</span>
                  </div>
                  <p className="mt-2.5 text-xs leading-relaxed text-slate-300/90">{d}</p>
                  <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/5 border border-white/10">
                    <div className={`h-full ${isManual ? "bg-gradient-to-r from-purple-400 to-amber-300" : "chrome-bar"}`} style={{ width: "100%" }} />
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        <Footer className="mt-24" />
      </main>

      <style>{`
        @keyframes scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

function PortalCard({
  to,
  tag,
  title,
  blurb,
  tone,
}: {
  to: "/team" | "/auth";
  tag: string;
  title: string;
  blurb: string;
  tone: "cyan" | "violet";
}) {
  const glow =
    tone === "cyan"
      ? "from-[#67e8f9]/25 via-white/[0.02] to-transparent"
      : "from-[#fbbf24]/20 via-white/[0.02] to-transparent";
  const blob =
    tone === "cyan" ? "bg-[#67e8f9]/30" : "bg-[#fbbf24]/30";
  return (
    <Link
      to={to}
      className={`group relative overflow-hidden rounded-3xl chrome-glass p-8 card-3d card-3d-hover bg-gradient-to-br ${glow}`}
    >
      <div className={`pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full blur-3xl ${blob}`} />
      <div className="relative flex items-start justify-between">
        <span className="text-[10px] uppercase tracking-[0.3em] text-slate-300 font-bold">{tag}</span>
        <span className="text-2xl chrome-text transition-transform group-hover:translate-x-1.5">→</span>
      </div>
      <h3 className="relative mt-8 font-serif text-4xl sm:text-5xl font-bold">{title}</h3>
      <p className="relative mt-3 max-w-md text-sm text-slate-300/90 leading-relaxed">{blurb}</p>
    </Link>
  );
}
