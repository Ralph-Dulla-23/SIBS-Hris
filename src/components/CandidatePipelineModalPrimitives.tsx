import React, { useEffect } from "react";
import { X, ArrowRight, User, Sparkles, History, Clock, Check, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// ==================== CANDIDATE PIPELINE MODAL PRIMITIVES ====================

export interface CandidateModalShellProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  kicker?: string;
  candidateInfo?: {
    name: string;
    email?: string;
    contactNumber?: string;
    candidateId?: string;
    currentStage?: string;
    prfStatus?: string;
    roleTitle?: string;
    account?: string;
  };
  maxWidth?: string; // e.g. "max-w-6xl", "max-w-xl", "max-w-md"
  headerAction?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  isSubmitting?: boolean;
}

export function CandidatePipelineModalShell({
  isOpen,
  onClose,
  title,
  kicker = "Candidate Pipeline Record",
  candidateInfo,
  maxWidth = "max-w-6xl",
  headerAction,
  children,
  footer,
  isSubmitting = false,
}: CandidateModalShellProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#042C51]/80 backdrop-blur-xs overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.15 }}
          className={`bg-white rounded-2xl w-full ${maxWidth} shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[88vh]`}
        >
          {/* Navy Operational Header */}
          <div className="bg-[#042C51] text-white p-4 sm:p-5 flex items-center justify-between border-b border-[#083a69] shrink-0 gap-3">
            <div className="flex items-center gap-3.5 min-w-0">
              {candidateInfo ? (
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#FF5C28] text-white font-black flex items-center justify-center text-sm sm:text-base shadow-md shrink-0">
                  {candidateInfo.name
                    .split(" ")
                    .map((n) => n[0])
                    .filter(Boolean)
                    .slice(0, 2)
                    .join("")
                    .toUpperCase() || "CAN"}
                </div>
              ) : null}
              <div className="min-w-0 space-y-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] bg-blue-900/60 text-blue-200 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-blue-700/50">
                    {kicker}
                  </span>
                  {candidateInfo?.currentStage && (
                    <span className="text-[10px] bg-[#FF5C28] text-white font-black px-2.5 py-0.5 rounded-full uppercase shadow-2xs">
                      {candidateInfo.currentStage}
                    </span>
                  )}
                  {candidateInfo?.prfStatus && (
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                      candidateInfo.prfStatus === "Matched"
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/30"
                        : candidateInfo.prfStatus === "Not Matched"
                        ? "bg-rose-500/20 text-rose-300 border-rose-400/30"
                        : "bg-amber-500/20 text-amber-300 border-amber-400/30"
                    }`}>
                      PRF: {candidateInfo.prfStatus}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-black text-white truncate leading-tight">
                    {candidateInfo ? candidateInfo.name : title}
                  </h3>
                </div>

                {candidateInfo && (
                  <p className="text-[11px] text-slate-300 font-mono truncate">
                    {[
                      candidateInfo.roleTitle,
                      candidateInfo.account,
                      candidateInfo.candidateId ? `ID: ${candidateInfo.candidateId}` : null,
                      candidateInfo.email
                    ].filter(Boolean).join(" • ")}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {headerAction}
              <button
                type="button"
                disabled={isSubmitting}
                onClick={onClose}
                className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-all cursor-pointer shrink-0 disabled:opacity-50"
                title="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Internally Scrollable Body */}
          <div className="p-4 sm:p-6 space-y-6 overflow-y-auto flex-1 bg-slate-50/40 text-xs text-[#101828]">
            {children}
          </div>

          {/* Optional Fixed Footer */}
          {footer && (
            <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
              {footer}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

// ==================== SHOPEE-STYLE MOVEMENT HISTORY SIDEBAR ====================

export interface MovementHistorySidebarProps {
  candidateName: string;
  currentStage: string;
  timeline: Array<{
    id: string;
    stage: string;
    date: string;
    updatedBy: string;
    reason: string;
  }>;
  onClose: () => void;
}

export function MovementHistorySidebar({
  candidateName,
  currentStage,
  timeline,
  onClose,
}: MovementHistorySidebarProps) {
  return (
    <motion.aside
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="bg-white rounded-2xl border border-slate-200/90 shadow-lg overflow-hidden flex flex-col h-full sticky top-0"
    >
      {/* Shopee-style Sidebar Header */}
      <div className="bg-[#042C51] text-white p-3.5 sm:p-4 flex items-center justify-between border-b border-[#083a69] shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-2 bg-[#FF5C28] text-white rounded-xl shadow-2xs shrink-0">
            <History className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-black uppercase text-white tracking-wider truncate">
              Movement History
            </h4>
            <p className="text-[10px] text-slate-300 font-medium truncate">
              Shopee-style Pipeline Audit Trail
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-all cursor-pointer shrink-0"
          title="Close Movement History Sidebar"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Current Stage Live Tracking Banner */}
      <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs shrink-0">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="font-extrabold text-[#042C51] text-[11px] uppercase tracking-wide">
            Live Status
          </span>
        </div>
        <span className="px-2.5 py-0.5 bg-[#FF5C28] text-white font-black text-[10px] rounded-full uppercase shadow-2xs">
          {currentStage}
        </span>
      </div>

      {/* Shopee Tracking Vertical Timeline */}
      <div className="p-4 overflow-y-auto space-y-4 flex-1 text-xs">
        <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2.5 before:bottom-2.5 before:w-0.5 before:bg-slate-200">
          {timeline.map((item, index) => {
            const isLatest = index === 0;
            return (
              <div key={item.id} className="relative group">
                {/* Node Icon */}
                <div
                  className={`absolute -left-6 top-1 w-5 h-5 rounded-full flex items-center justify-center border-2 transition-all ${
                    isLatest
                      ? "bg-[#FF5C28] border-white text-white ring-4 ring-[#FF5C28]/20 shadow-2xs"
                      : "bg-[#042C51] border-white text-white"
                  }`}
                >
                  {isLatest ? (
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  ) : (
                    <Check className="w-3 h-3 text-white" />
                  )}
                </div>

                {/* Event Card Container */}
                <div
                  className={`p-3 rounded-xl border transition-all ${
                    isLatest
                      ? "bg-orange-50/50 border-orange-200/90 shadow-2xs"
                      : "bg-[#F8FAFC] border-slate-200/80"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1.5 mb-1">
                    <span className="font-black text-[#042C51] text-xs">
                      {item.stage}
                    </span>
                    {isLatest && (
                      <span className="px-1.5 py-0.5 bg-[#FF5C28] text-white font-black text-[8px] rounded uppercase tracking-wider">
                        Latest
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-1.5">
                    <span>By: <strong className="text-slate-700">{item.updatedBy}</strong></span>
                    <span>{item.date}</span>
                  </div>

                  {item.reason && (
                    <div className="p-2 bg-white rounded-lg border border-slate-200/70 text-slate-700 font-medium text-[11px] leading-snug">
                      {item.reason}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Audit Counter */}
      <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-center text-[10px] text-slate-500 font-medium shrink-0">
        Total <strong className="text-[#042C51] font-bold">{timeline.length}</strong> stage movement{timeline.length !== 1 ? "s" : ""} recorded
      </div>
    </motion.aside>
  );
}

// ==================== CANDIDATE MODAL SUMMARY ====================

export interface CandidateModalSummaryProps {
  candidate: {
    name: string;
    email?: string;
    contactNumber?: string;
    candidateId?: string;
    currentStage?: string;
    prfStatus?: string;
    roleTitle?: string;
    account?: string;
  };
  actionButton?: React.ReactNode;
}

export function CandidateModalSummary({ candidate, actionButton }: CandidateModalSummaryProps) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-[#042C51] text-white font-black flex items-center justify-center text-sm shrink-0 shadow-2xs">
          {candidate.name
            .split(" ")
            .map((n) => n[0])
            .filter(Boolean)
            .slice(0, 2)
            .join("")
            .toUpperCase() || "CAN"}
        </div>
        <div className="min-w-0 space-y-0.5">
          <div className="flex items-center gap-2">
            <h4 className="font-black text-[#042C51] text-xs uppercase truncate">{candidate.name}</h4>
            {candidate.candidateId && (
              <span className="text-[10px] text-slate-400 font-mono font-bold">({candidate.candidateId})</span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 font-medium truncate">
            {[candidate.roleTitle, candidate.account].filter(Boolean).join(" • ") || "Candidate Application"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {candidate.currentStage && (
          <span className="px-2.5 py-1 bg-blue-50 text-[#042C51] border border-blue-100 text-[10px] font-black rounded-full uppercase">
            {candidate.currentStage}
          </span>
        )}
        {actionButton}
      </div>
    </div>
  );
}

// ==================== CANDIDATE MODAL SECTION ====================

export interface CandidateModalSectionProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  headerAction?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function CandidateModalSection({
  title,
  subtitle,
  icon,
  headerAction,
  children,
  className = "",
}: CandidateModalSectionProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-2">
        <div className="flex items-center gap-2">
          {icon || <Sparkles className="w-4 h-4 text-[#FF5C28]" />}
          <div>
            <h4 className="font-black text-[#042C51] text-xs uppercase tracking-wider">{title}</h4>
            {subtitle && <p className="text-[11px] text-slate-500 font-medium">{subtitle}</p>}
          </div>
        </div>
        {headerAction && <div className="shrink-0">{headerAction}</div>}
      </div>

      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        {children}
      </div>
    </div>
  );
}

// ==================== BUTTON PRIMITIVES ====================

export interface CandidateModalPrimaryButtonProps {
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  variant?: "orange" | "red" | "navy" | "emerald";
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function CandidateModalPrimaryButton({
  onClick,
  type = "button",
  disabled = false,
  variant = "orange",
  icon = <ArrowRight className="w-3.5 h-3.5" />,
  children,
  className = "",
}: CandidateModalPrimaryButtonProps) {
  const variantStyles = {
    orange: "bg-[#FF5C28] hover:bg-[#e04b1a] text-white focus:ring-[#FF5C28]",
    red: "bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-500",
    navy: "bg-[#042C51] hover:bg-[#063a6b] text-white focus:ring-[#042C51]",
    emerald: "bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-500",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`px-5 py-2.5 font-black rounded-xl text-xs shadow-2xs transition-all cursor-pointer flex items-center justify-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${className}`}
    >
      <span>{children}</span>
      {icon}
    </button>
  );
}

export interface CandidateModalSecondaryButtonProps {
  onClick?: () => void;
  type?: "button";
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function CandidateModalSecondaryButton({
  onClick,
  type = "button",
  disabled = false,
  children,
  className = "",
}: CandidateModalSecondaryButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-xs transition-all border border-slate-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
}
