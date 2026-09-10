import { createFileRoute, Link } from "@tanstack/react-router";
import ChromeScene from "@/components/ChromeScene";
import { ThemeToggle } from "@/components/ThemeToggle";
import Footer from "@/components/Footer";
import { PublicNavAnnouncements } from "@/components/PublicNavAnnouncements";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SIH Premier 2026 — Submission & Evaluation Platform" },
      { name: "description", content: "The official platform for SIH Premier 2026. Teams submit ideas; admins manage teams and review evaluations." },
      { property: "og:title", content: "SIH Premier 2026" },
      { property: "og:description", content: "Official submission and evaluation portal for SIH Premier 2026." },
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
              SIH Premier<span className="chrome-text">.</span>2026
            </p>
            <span className="text-[9px] uppercase tracking-[0.25em] text-amber-300 font-bold block -mt-0.5">INNOVEDGE CLUB</span>
          </div>
        </div>
        <nav className="flex items-center gap-2.5">
          <PublicNavAnnouncements />
          <Link
            to="/team"
            className="rounded-full border border-amber-300/50 bg-amber-400/15 px-4 py-2 text-xs uppercase tracking-[0.15em] font-bold text-amber-300 hover:bg-amber-400/25 transition shadow-[0_0_15px_rgba(251,191,36,0.2)]"
          >
            Sign In
          </Link>
          <Link
            to="/auth"
            className="rounded-full border border-purple-400/30 bg-purple-950/40 px-3.5 py-2 text-xs uppercase tracking-[0.15em] font-bold text-purple-200 hover:bg-purple-900/50 transition hidden md:inline-flex items-center gap-1"
          >
            <span>👑</span> Admin
          </Link>
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
            Teams submit a pitch PDF. An AI engine evaluates innovation and originality (including plagiarism check), combined with manual evaluation by 2 teachers — every mark backed by evidence.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/team"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-300 via-amber-200 to-amber-400 px-7 py-3.5 text-sm font-bold text-[#0b0a14] btn-3d shadow-[0_10px_35px_-5px_rgba(251,191,36,0.6)]"
            >
              Sign In to Submit
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
            {/* <Link
              to="/auth"
              className="inline-flex items-center gap-2 rounded-full chrome-glass border border-purple-400/30 bg-purple-950/20 px-6 py-3.5 text-sm font-semibold text-purple-200 transition hover:bg-purple-900/30 card-3d card-3d-hover"
            >
              👑 Admin Login
            </Link> */}
          </div>
        </div>

        {/* Stats 3D glass strip */}
        <div className="mt-16 grid grid-cols-3 overflow-hidden rounded-2xl chrome-glass text-center card-3d shadow-[0_20px_50px_-15px_rgba(0,0,0,0.7),_inset_0_1px_1px_rgba(255,255,255,0.2)]">
          {[
            ["18", "Innovation Themes"],
            ["< 3 MB", "Pitch Deck Limit"],
            ["Dual-Jury", "Official Evaluation"],
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
            tag="For Student Teams"
            title="Team Sign In"
            blurb="Sign in with your team leader credentials, register members, select your track, and upload your pitch PDF under 3 MB."
            tone="cyan"
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

        {/* Competition Guidelines & Submission Process (Replaces internal criteria rubric) */}
        <section className="mt-24">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-300 block">
                Official Competition Roadmap
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold mt-1">
                SIH Premier 2026 Guidelines &amp; Journey
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                🛡️ AI Plagiarism &amp; Originality Audit
              </span>
              <span className="rounded-full bg-purple-500/15 border border-purple-500/30 px-3 py-1 text-xs font-bold text-purple-300 flex items-center gap-1.5">
                👨‍⚖️ Dual Faculty Jury Panel
              </span>
            </div>
          </div>

          {/* Top-Level Plagiarism Banner */}
          <div className="mt-6 rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/40 via-[#0a0a14] to-black/80 p-5 card-3d shadow-[0_0_30px_rgba(16,185,129,0.08)]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3.5">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-xl">
                  🛡️
                </span>
                <div>
                  <div className="text-[10px] uppercase font-black tracking-widest text-emerald-300">
                    High Integrity Standard
                  </div>
                  <h3 className="font-serif text-lg font-bold text-slate-100">
                    Authentic Student Innovation &amp; Originality
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5 max-w-2xl">
                    Every uploaded proposal deck undergoes deep authenticity verification checking technical uniqueness, architecture originality, and proper literature citations.
                  </p>
                </div>
              </div>
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/40 px-4 py-2 text-center">
                <span className="text-[9px] uppercase font-bold text-emerald-300 block">Originality Check</span>
                <span className="font-serif text-base font-black text-emerald-200">100% Verified</span>
              </div>
            </div>
          </div>

          {/* 6 Step Roadmap Lines for Participants */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                step: "01",
                icon: "💡",
                title: "Theme Selection & Formulation",
                desc: "Choose from the 18 official SIH 2026 innovation tracks. Identify an acute domain pain point and design a tech-driven problem-solving model.",
                badge: "18 Approved Themes",
              },
              {
                step: "02",
                icon: "👥",
                title: "Team Registration & Leadership",
                desc: "The designated team leader signs in to the portal, configures project details, and registers all active student team contributors.",
                badge: "Leader Managed",
              },
              {
                step: "03",
                icon: "📄",
                title: "Pitch Deck Submission",
                desc: "Upload your structured presentation PDF (less than 3 MB) covering problem definition, technical architecture, workflow, and feasibility.",
                badge: "PDF < 3 MB",
              },
              {
                step: "04",
                icon: "⚡",
                title: "AI Integrity & Originality Check",
                desc: "Instant automated screening for technical originality, ensuring your solution represents authentic engineering without code or deck plagiarism.",
                badge: "Automated Screening",
              },
              {
                step: "05",
                icon: "👨‍⚖️",
                title: "Live Defense & Dual-Judge Evaluation",
                desc: "Pitch live before Judge 1 and Judge 2. Present proof of concept, answer domain Q&A, and demonstrate implementation viability.",
                badge: "Judge 1 & Judge 2",
              },
              {
                step: "06",
                icon: "🏆",
                title: "Grand Podium & Certified Results",
                desc: "Official scores calculated and published. Top teams receive executive dossiers, organizing committee certification, and grand awards.",
                badge: "Final Certification",
              },
            ].map((card) => (
              <div
                key={card.step}
                className="group relative overflow-hidden rounded-2xl chrome-glass p-5 card-3d card-3d-hover border border-white/10 hover:border-amber-300/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="font-serif text-2xl font-black chrome-text">
                      {card.step}
                    </span>
                    <span className="text-[10px] font-bold text-amber-300 bg-amber-400/10 border border-amber-400/20 px-2.5 py-0.5 rounded-full">
                      {card.badge}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{card.icon}</span>
                    <h3 className="font-serif text-base font-bold text-slate-100 group-hover:text-amber-300 transition">
                      {card.title}
                    </h3>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-300/85">
                    {card.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400">
                  <span>SIH Premier 2026 Protocol</span>
                  <span className="text-amber-300 font-semibold group-hover:translate-x-1 transition-transform inline-block">
                    Explore track →
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* 4 Feature Highlights Grid */}
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-center">
              <span className="text-2xl mb-1 block">🎯</span>
              <h4 className="text-xs font-bold text-slate-200">18 Innovation Themes</h4>
              <p className="text-[11px] text-slate-400 mt-1">Smart Automation, Clean Energy, MedTech, Robotics, and more.</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-center">
              <span className="text-2xl mb-1 block">🛡️</span>
              <h4 className="text-xs font-bold text-slate-200">Zero-Plagiarism Standard</h4>
              <p className="text-[11px] text-slate-400 mt-1">Deep inspection verifying genuine technical formulations.</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-center">
              <span className="text-2xl mb-1 block">⚖️</span>
              <h4 className="text-xs font-bold text-slate-200">Dual Faculty Jury</h4>
              <p className="text-[11px] text-slate-400 mt-1">Independent evaluation by Judge 1 and Judge 2 for complete fairness.</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-center">
              <span className="text-2xl mb-1 block">📑</span>
              <h4 className="text-xs font-bold text-slate-200">Executive PDF Dossiers</h4>
              <p className="text-[11px] text-slate-400 mt-1">Official certification signed by the Organizing Committee.</p>
            </div>
          </div>
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
