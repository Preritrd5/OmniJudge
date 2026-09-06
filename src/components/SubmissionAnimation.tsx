import React, { useState, useEffect, useRef } from "react";

export type PipelineStage = "uploaded" | "submitted" | "processing" | "evaluating" | "completed" | "failed";

interface SubmissionAnimationProps {
  stage?: PipelineStage | string;
  statusText?: string;
  fileName?: string;
  submittedAt?: string;
  className?: string;
}

const STAGES: { id: PipelineStage; label: string; icon: string; desc: string; detail: string }[] = [
  {
    id: "uploaded",
    label: "Uploaded",
    icon: "📄",
    desc: "Proposal deck stored",
    detail: "PDF document securely received and verified",
  },
  {
    id: "submitted",
    label: "Submitted",
    icon: "📥",
    desc: "Registered in queue",
    detail: "Proposal registered in panel evaluation queue",
  },
  {
    id: "processing",
    label: "Processing",
    icon: "⚙️",
    desc: "Structure & text parse",
    detail: "Parsing document layout, problem statement & figures",
  },
  {
    id: "evaluating",
    label: "Evaluating",
    icon: "🤖",
    desc: "Criteria review active",
    detail: "AI reviewing innovation, methodology & feasibility rubrics",
  },
  {
    id: "completed",
    label: "Completed",
    icon: "✅",
    desc: "Evaluation finalized",
    detail: "All evaluation criteria assessed and finalized",
  },
];

const EVAL_HINTS = [
  "Parsing problem statement & architectural viability...",
  "Running Gemini AI multi-modal criteria review...",
  "Assessing innovation, scalability & technical feasibility...",
  "Benchmarking proposal depth against track guidelines...",
  "Synthesizing qualitative strengths & committee feedback...",
];

function getStageIndex(stage?: string): number {
  switch (stage) {
    case "uploaded":
      return 0;
    case "submitted":
    case "pending":
      return 1;
    case "processing":
      return 2;
    case "evaluating":
      return 3;
    case "completed":
    case "done":
      return 4;
    case "failed":
      return -1;
    default:
      return 1;
  }
}

export default function SubmissionAnimation({
  stage = "submitted",
  statusText,
  fileName,
  submittedAt,
  className = "",
}: SubmissionAnimationProps) {
  const targetIndex = getStageIndex(stage);
  const isFailed = stage === "failed";

  // Progressive animation state: advances sequentially from 0 up to targetIndex
  const [animatedIndex, setAnimatedIndex] = useState<number>(0);
  const [evalHintIndex, setEvalHintIndex] = useState<number>(0);
  const timerRef = useRef<any>(null);

  // Progressive sequential playback up to targetIndex
  useEffect(() => {
    if (isFailed) {
      setAnimatedIndex(-1);
      return;
    }

    // Advance step-by-step every 750ms so user clearly sees stages 1 -> 2 -> 3 -> 4
    timerRef.current = setInterval(() => {
      setAnimatedIndex((prev) => {
        if (prev < targetIndex) {
          return prev + 1;
        }
        return prev;
      });
    }, 750);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [targetIndex, isFailed]);

  // Rotate evaluation live status hints every 2.8s during active evaluation
  useEffect(() => {
    if (animatedIndex === 3 || targetIndex === 3) {
      const hintInterval = setInterval(() => {
        setEvalHintIndex((prev) => (prev + 1) % EVAL_HINTS.length);
      }, 2800);
      return () => clearInterval(hintInterval);
    }
  }, [animatedIndex, targetIndex]);

  const currentIndex = isFailed ? -1 : animatedIndex;
  const activeStageObj = STAGES[Math.max(0, Math.min(currentIndex, STAGES.length - 1))];
  const progressPercent = isFailed
    ? 100
    : Math.max(10, Math.min(100, ((currentIndex + (currentIndex >= 4 ? 1 : 0.5)) / STAGES.length) * 100));

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-5 sm:p-6 backdrop-blur-xl ${className}`}>
      {/* Dynamic ambient background glow */}
      <div
        className={`pointer-events-none absolute -top-24 left-1/2 -z-10 h-48 w-96 -translate-x-1/2 rounded-full blur-3xl transition-all duration-700 ${
          isFailed
            ? "bg-rose-500/15"
            : currentIndex >= 4
            ? "bg-emerald-500/15"
            : "bg-amber-400/15"
        }`}
      />

      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300">
              Live Submission Pipeline
            </span>
            <span className="flex h-2 w-2 relative">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isFailed ? "bg-rose-400" : currentIndex >= 4 ? "bg-emerald-400" : "bg-amber-400"
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  isFailed ? "bg-rose-500" : currentIndex >= 4 ? "bg-emerald-500" : "bg-amber-400"
                }`}
              />
            </span>
          </div>
          {fileName && (
            <h3 className="font-serif text-lg font-bold text-slate-100 mt-1 truncate max-w-md">
              {fileName}
            </h3>
          )}
          {submittedAt && (
            <p className="text-[11px] text-slate-400">
              Submitted: {new Date(submittedAt).toLocaleString()}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-semibold backdrop-blur-md shadow-sm border transition-all ${
              isFailed
                ? "border-rose-500/30 bg-rose-500/15 text-rose-300"
                : currentIndex >= 4
                ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-300"
                : "border-amber-400/30 bg-amber-400/15 text-amber-200"
            }`}
          >
            {currentIndex < 4 && !isFailed ? (
              <div className="h-3 w-3 animate-spin rounded-full border-2 border-amber-300 border-t-transparent shrink-0" />
            ) : (
              <span className="text-xs">
                {isFailed ? "❌" : "✅"}
              </span>
            )}
            {statusText || (isFailed ? "Processing Alert" : activeStageObj?.label || "In Progress")}
          </span>
        </div>
      </div>

      {/* Pipeline Stepper Container */}
      <div className="mt-6 space-y-4">
        {/* Progress Bar & Live Status Bar */}
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5 backdrop-blur-md space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold">
            <span className="text-slate-300 flex items-center gap-2">
              <span className="text-amber-300 font-bold uppercase tracking-wider text-[10px] bg-amber-300/10 px-2 py-0.5 rounded border border-amber-300/20">
                Stage {Math.max(1, Math.min(currentIndex + 1, STAGES.length))} of {STAGES.length}
              </span>
              <span className="text-slate-100 font-bold text-sm">
                {isFailed ? "Evaluation Alert" : activeStageObj?.label || "Processing"}
              </span>
            </span>

            <span className="text-amber-300 font-mono text-xs font-bold">
              {Math.round(progressPercent)}% Processed
            </span>
          </div>

          {/* Glowing Animated Progress Bar */}
          <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-white/10 border border-white/5 p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out shadow-lg ${
                isFailed
                  ? "bg-rose-500"
                  : "bg-gradient-to-r from-amber-400 via-amber-300 to-emerald-400 shadow-[0_0_15px_rgba(251,191,36,0.5)]"
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Dynamic Live Sub-Status Hint with Loading Roller Spinner */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-white/5 text-[11px]">
            <div className="flex items-center gap-2 text-slate-400 min-w-0">
              {currentIndex < 4 && !isFailed ? (
                <div className="flex h-3.5 w-3.5 shrink-0 items-center justify-center">
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-amber-300 border-t-transparent" />
                </div>
              ) : (
                <span className="h-2 w-2 rounded-full bg-emerald-400 shrink-0" />
              )}
              <span className="italic text-slate-300 truncate">
                {currentIndex === 3
                  ? EVAL_HINTS[evalHintIndex]
                  : activeStageObj?.detail || "Processing proposal deck..."}
              </span>
            </div>

            {currentIndex === 3 && (
              <span className="shrink-0 text-[10px] text-amber-300 font-mono bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20 flex items-center gap-1.5">
                <div className="h-2 w-2 animate-spin rounded-full border border-amber-300 border-t-transparent" />
                <span>AI Evaluating (~15–30s)</span>
              </span>
            )}
          </div>
        </div>

        {/* 5 Stage Cards Grid with Animated Sequential Reveal */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
          {STAGES.map((s, idx) => {
            const isCompleted = currentIndex > idx;
            const isCurrent = currentIndex === idx;
            const isUpcoming = currentIndex < idx;

            return (
              <div
                key={s.id}
                className={`relative flex flex-col items-center text-center p-3.5 rounded-xl transition-all duration-500 ${
                  isCurrent
                    ? "bg-amber-300/10 border-2 border-amber-300/70 shadow-[0_0_25px_rgba(251,191,36,0.22)] scale-[1.02]"
                    : isCompleted
                    ? "bg-emerald-500/[0.04] border border-emerald-500/30"
                    : "bg-white/[0.01] border border-white/5 opacity-40"
                }`}
              >
                {/* Step badge */}
                <div className="flex items-center justify-between w-full mb-1.5">
                  <span
                    className={`text-[9px] font-mono font-bold tracking-wider uppercase ${
                      isCurrent
                        ? "text-amber-300"
                        : isCompleted
                        ? "text-emerald-400"
                        : "text-slate-500"
                    }`}
                  >
                    0{idx + 1}
                  </span>
                  {isCompleted ? (
                    <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded">
                      ✓ Done
                    </span>
                  ) : isCurrent ? (
                    <div className="h-2 w-2 animate-spin rounded-full border border-amber-300 border-t-transparent" />
                  ) : (
                    <span className="text-[9px] text-slate-600">Pending</span>
                  )}
                </div>

                {/* Node icon circle with spinning dashed loading roller on active */}
                <div className="relative">
                  {isCurrent && (
                    <div className="absolute -inset-1.5 rounded-2xl border-2 border-dashed border-amber-300/70 animate-[spin_4s_linear_infinite]" />
                  )}
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl text-lg font-bold transition-all duration-500 ${
                      isCurrent
                        ? "bg-amber-300 text-black shadow-[0_0_20px_rgba(251,191,36,0.6)] scale-105"
                        : isCompleted
                        ? "bg-emerald-500/20 border border-emerald-500/50 text-emerald-300"
                        : "bg-white/5 border border-white/10 text-slate-500"
                    }`}
                  >
                    {isCompleted ? "✓" : s.icon}
                  </div>
                </div>

                {/* Label & Description */}
                <div className="mt-2.5 w-full">
                  <div
                    className={`text-xs font-bold transition-colors duration-300 ${
                      isCurrent
                        ? "text-amber-300"
                        : isCompleted
                        ? "text-emerald-300"
                        : "text-slate-400"
                    }`}
                  >
                    {s.label}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 leading-tight line-clamp-2">
                    {s.desc}
                  </div>
                </div>

                {/* Status Indicator Pill */}
                <div className="mt-2.5">
                  {isCurrent && (
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/20 px-2 py-0.5 text-[9px] font-bold text-amber-200 border border-amber-400/30">
                      <div className="h-2 w-2 animate-spin rounded-full border border-amber-300 border-t-transparent" />
                      <span>Active Stage</span>
                    </div>
                  )}
                  {isCompleted && (
                    <div className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-emerald-400/90">
                      <span>Verified ✓</span>
                    </div>
                  )}
                  {isUpcoming && (
                    <div className="text-[9px] font-medium text-slate-600">
                      Queued
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
