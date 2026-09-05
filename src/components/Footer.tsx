import React from "react";

interface FooterProps {
  className?: string;
  showLogo?: boolean;
}

export function Footer({ className = "", showLogo = true }: FooterProps) {
  return (
    <footer
      className={`mt-24 border-t border-white/10 pt-12 pb-14 flex flex-col items-center gap-6 text-center ${className}`}
    >
      {showLogo && (
        <div className="relative group cursor-pointer">
          {/* 3D ambient backdrop glow */}
          <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-[#67e8f9]/30 via-[#fbbf24]/30 to-[#c4b5fd]/30 opacity-70 blur-xl transition duration-500 group-hover:opacity-100 group-hover:scale-110" />
          
          <div className="relative rounded-2xl p-1 bg-gradient-to-br from-white/20 via-white/5 to-black/40 shadow-[0_15px_35px_-5px_rgba(0,0,0,0.6),_inset_0_1px_1px_rgba(255,255,255,0.3)] transition-transform duration-300 group-hover:-translate-y-1.5 group-hover:scale-105">
            <img
              src="/logo.png"
              alt="INNOVEDGE Club Logo"
              className="h-24 w-24 object-contain rounded-xl drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
              loading="eager"
            />
          </div>
        </div>
      )}

      {/* 3D Mentors & Builders Highlight Card */}
      <div className="relative max-w-xl mx-auto px-6 py-5 rounded-2xl chrome-glass border border-white/15 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5),_inset_0_1px_0_rgba(255,255,255,0.2)] transform hover:-translate-y-1 transition duration-300">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-amber-300 font-bold shadow-[0_0_15px_rgba(251,191,36,0.2)]">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-300 animate-pulse" />
            Distinguished Faculty Mentors
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 shadow-[0_4px_15px_rgba(0,0,0,0.2)] hover:border-amber-300/40 hover:bg-white/[0.08] transition">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-amber-300/20 text-amber-300 text-xs font-bold font-serif shadow-inner">
                D
              </span>
              <div className="text-left">
                <div className="text-xs font-bold text-slate-100">Denny Sir</div>
                <div className="text-[9px] text-slate-400 uppercase tracking-wider">Faculty Mentor &amp; Judge</div>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 shadow-[0_4px_15px_rgba(0,0,0,0.2)] hover:border-amber-300/40 hover:bg-white/[0.08] transition">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-amber-300/20 text-amber-300 text-xs font-bold font-serif shadow-inner">
                B
              </span>
              <div className="text-left">
                <div className="text-xs font-bold text-slate-100">Bhavya Mam</div>
                <div className="text-[9px] text-slate-400 uppercase tracking-wider">Faculty Mentor &amp; Judge</div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-white/5">
            <p className="text-xs sm:text-sm font-medium text-slate-200">
              🚀 Platform Architected by <span className="chrome-text font-bold">Team SNPSU-Nexus</span> 💻
            </p>
          </div>
        </div>
      </div>

      {/* Copyright Line */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-x-3 gap-y-1 text-xs text-slate-400 pt-1">
        <span className="font-semibold text-slate-300">
          © 2026 Ideathon · INNOVEDGE Club. All rights reserved.
        </span>
        <span className="hidden sm:inline text-slate-600">·</span>
        <span className="text-[11px] text-slate-500 uppercase tracking-widest">
          Innovation &amp; Entrepreneurship Development Portal
        </span>
      </div>
    </footer>
  );
}

export default Footer;
