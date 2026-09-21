import React, { useState } from "react";
import { X, Printer, ArrowLeft, Edit3, CheckCircle2, AlertCircle, FileText, History, Clock, User, Tag, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { JobDescriptionRecord } from "./JobDescriptionPage";

interface JobDescriptionPreviewModalProps {
  isOpen: boolean;
  jd: JobDescriptionRecord | null;
  onClose: () => void;
  onFlagForRevision?: (jd: JobDescriptionRecord) => void;
}

export default function JobDescriptionPreviewModal({
  isOpen,
  jd,
  onClose,
  onFlagForRevision
}: JobDescriptionPreviewModalProps) {
  const [activeTab, setActiveTab] = useState<"details" | "revision">("details");

  if (!isOpen || !jd) return null;

  const handlePrint = () => {
    window.print();
  };

  // Status badge color formatting
  const getBadgeStyle = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Existing":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "For Revision":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "For Approval":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "New Job Description":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex flex-col bg-[#F0F4F8] text-[#101828] overflow-hidden">
        {/* ==================== TOP NAVIGATION HEADER ==================== */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0 shadow-xs">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
              JOB DESCRIPTION OVERVIEW
            </span>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl font-black text-[#042C51] tracking-tight">
                {jd.id} • {jd.roleTitle.toUpperCase()}
              </h1>
              <span className={`text-xs font-bold px-3 py-0.5 rounded-full border ${getBadgeStyle(jd.status)}`}>
                {jd.status}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {jd.department} • {jd.account}
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-6 self-start sm:self-end border-b sm:border-b-0 border-slate-200 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setActiveTab("details")}
              className={`pb-2 sm:pb-0 text-xs font-bold transition-all relative cursor-pointer ${
                activeTab === "details"
                  ? "text-[#042C51] border-b-2 border-[#042C51] font-black"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              Details
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("revision")}
              className={`pb-2 sm:pb-0 text-xs font-bold transition-all relative cursor-pointer ${
                activeTab === "revision"
                  ? "text-[#042C51] border-b-2 border-[#042C51] font-black"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              Revision History
            </button>
          </div>
        </div>

        {/* ==================== MAIN CONTENT AREA ==================== */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center items-start">
          {activeTab === "details" ? (
            /* ==================== DOCUMENT PAPER SHEET ==================== */
            <div className="bg-white border-2 border-slate-300 shadow-xl max-w-4xl w-full p-6 sm:p-10 relative my-2 min-h-[800px] text-black font-sans">
              {/* Floating Print Button */}
              <button
                type="button"
                onClick={handlePrint}
                className="absolute top-6 right-6 bg-white border border-slate-300 shadow-md hover:bg-slate-50 text-slate-700 px-3 py-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer z-10"
                title="Print Job Description Document"
              >
                <Printer className="w-4 h-4 text-[#042C51]" />
                <span>Print</span>
              </button>

              {/* OFFICIAL SIBS HEADER GRID TABLE */}
              <div className="border-2 border-black text-black font-sans mb-8">
                <div className="grid grid-cols-12 divide-x-2 divide-black">
                  {/* LEFT BOX: LOGO & ISSUANCE */}
                  <div className="col-span-12 sm:col-span-3 p-4 flex flex-col justify-between items-center sm:items-start text-center sm:text-left min-h-[140px] bg-white">
                    <div>
                      <div className="text-3xl font-black tracking-tight text-[#042C51]">SiBS</div>
                      <div className="text-[9px] font-semibold text-slate-600 tracking-tight mt-0.5">
                        Practice. Purpose. Philosophy.
                      </div>
                    </div>
                    <div className="text-[11px] font-bold text-black mt-4">
                      Manual Issuance #1
                    </div>
                  </div>

                  {/* MIDDLE COLUMN */}
                  <div className="col-span-12 sm:col-span-6 flex flex-col divide-y-2 divide-black">
                    {/* MANUAL TITLE */}
                    <div className="p-2.5 px-3">
                      <div className="text-[9px] font-bold text-black uppercase tracking-wider">
                        MANUAL TITLE:
                      </div>
                      <div className="text-sm font-black text-black uppercase tracking-tight mt-0.5">
                        MASTER OPERATING MANUAL
                      </div>
                    </div>

                    {/* DOCUMENT TITLE */}
                    <div className="p-2.5 px-3 flex-1 flex flex-col justify-center">
                      <div className="text-[9px] font-bold text-black uppercase tracking-wider">
                        DOCUMENT TITLE:
                      </div>
                      <div className="text-base font-black text-black uppercase tracking-tight mt-0.5">
                        {jd.roleTitle}
                      </div>
                    </div>

                    {/* BOTTOM 4 SUB-COLUMNS */}
                    <div className="grid grid-cols-4 divide-x-2 divide-black text-[9px] font-bold text-black">
                      <div className="p-2 space-y-0.5">
                        <div className="text-slate-600">PREPARED FOR:</div>
                        <div className="font-extrabold uppercase text-[10px] truncate">{jd.account || jd.department}</div>
                      </div>
                      <div className="p-2 space-y-0.5">
                        <div className="text-slate-600">PREPARED BY:</div>
                        <div className="font-extrabold uppercase text-[10px] leading-tight">2435 - BATACAN, ALENA MENDOZA</div>
                      </div>
                      <div className="p-2 space-y-0.5">
                        <div className="text-slate-600">REVIEWED BY:</div>
                        <div className="font-extrabold uppercase text-[10px] leading-tight">2435 - BATACAN, ALENA MENDOZA</div>
                      </div>
                      <div className="p-2 space-y-0.5">
                        <div className="text-slate-600">APPROVED BY:</div>
                        <div className="font-extrabold uppercase text-[10px]">2435</div>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT COLUMN (META FIELDS) */}
                  <div className="col-span-12 sm:col-span-3 flex flex-col divide-y-2 divide-black text-[9px] font-bold text-black">
                    <div className="p-2 flex items-center justify-between">
                      <span className="text-slate-600 uppercase">DOCUMENT CODE</span>
                      <span className="font-extrabold text-xs">{jd.id}</span>
                    </div>
                    <div className="p-2 flex items-center justify-between">
                      <span className="text-slate-600 uppercase">REVISION NUMBER</span>
                      <span className="font-extrabold text-xs">001</span>
                    </div>
                    <div className="p-2 flex items-center justify-between">
                      <span className="text-slate-600 uppercase">EFFECTIVITY DATE</span>
                      <span className="font-extrabold text-[10px] uppercase">{jd.dateRequested || "JULY 3, 2026"}</span>
                    </div>
                    <div className="p-2 flex items-center justify-between">
                      <span className="text-slate-600 uppercase">DATE OF LAST REVIEW</span>
                      <span className="font-extrabold text-[10px] uppercase">{jd.dateRequested || "JULY 3, 2026"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* DOCUMENT BODY SECTIONS */}
              <div className="space-y-6 text-sm text-slate-800 leading-relaxed font-sans">
                {/* 1. POSITION OVERVIEW */}
                <section>
                  <h3 className="text-sm font-black text-black uppercase tracking-wider mb-2">
                    1. POSITION OVERVIEW
                  </h3>
                  <p className="text-xs text-slate-700 leading-relaxed text-justify">
                    The {jd.roleTitle} is responsible for serving as a core contributor within the {jd.department} department ({jd.account}). This position focuses on executing key operational workflows, maintaining SLA compliance, ensuring high quality deliverables, and adhering to organizational benchmarks established in the Master Operating Manual.
                  </p>
                </section>

                {/* 2. DUTIES & RESPONSIBILITIES */}
                <section>
                  <h3 className="text-sm font-black text-black uppercase tracking-wider mb-2">
                    2. DUTIES & RESPONSIBILITIES
                  </h3>
                  <div className="text-xs text-slate-700 leading-relaxed space-y-1.5">
                    {jd.responsibilities && jd.responsibilities.length > 0 ? (
                      <ul className="list-disc pl-5 space-y-1.5">
                        {jd.responsibilities.map((resp, i) => (
                          <li key={i}>{resp}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-justify">
                        Execute primary role responsibilities, handle customer inquiries, diagnose technical incidents, document ticket interactions in the CRM software, and meet defined key performance indicators including AHT and FCR benchmarks.
                      </p>
                    )}
                  </div>
                </section>

                {/* 3. QUALIFICATIONS & CHARACTERISTICS */}
                <section>
                  <h3 className="text-sm font-black text-black uppercase tracking-wider mb-2">
                    3. QUALIFICATIONS & CHARACTERISTICS
                  </h3>
                  <ul className="list-disc pl-5 text-xs text-slate-700 space-y-1.5">
                    <li>Minimum 1-2 years of proven operational experience in {jd.department} or related industry.</li>
                    <li>Strong communication, problem-solving, and critical thinking capabilities.</li>
                    <li>Supervisory Capability: {jd.supervisoryLevel || "Individual Contributor"}.</li>
                    <li>Target Personality Profile: {jd.targetPersonality || "Adaptable, detail-oriented, resilient"}.</li>
                  </ul>
                </section>

                {/* 4. DESIRED COMPETENCIES */}
                <section>
                  <h3 className="text-sm font-black text-black uppercase tracking-wider mb-2">
                    4. DESIRED COMPETENCIES
                  </h3>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {jd.competencies && jd.competencies.length > 0 ? (
                      jd.competencies.map((comp, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-slate-100 border border-slate-300 text-black font-bold text-xs rounded-md flex items-center gap-1.5"
                        >
                          <Tag className="w-3 h-3 text-[#FF5C28]" />
                          {comp}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-500 italic">No competencies specified.</span>
                    )}
                  </div>
                </section>
              </div>
            </div>
          ) : (
            /* ==================== REVISION HISTORY TAB ==================== */
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm max-w-4xl w-full p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-black text-[#042C51] uppercase tracking-wider flex items-center gap-2">
                  <History className="w-4 h-4 text-[#FF5C28]" />
                  Revision History & Audit Log
                </h3>
                <span className="text-xs font-bold text-slate-400">
                  Total Entries: {jd.revisionHistory?.length || 0}
                </span>
              </div>

              <div className="space-y-3">
                {jd.revisionHistory && jd.revisionHistory.length > 0 ? (
                  jd.revisionHistory.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 hover:bg-slate-100/60 transition-colors"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[#042C51] flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-[#FF5C28]" />
                          {rev.author} ({rev.version})
                        </span>
                        <span className="text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {rev.date}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed pl-5 border-l-2 border-[#042C51]/20">
                        {rev.remarks}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-slate-400 text-xs italic">
                    No revision logs recorded for this job description document.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ==================== BOTTOM FOOTER ==================== */}
        <div className="bg-white border-t border-slate-200 px-6 py-3 flex items-center justify-between shrink-0 shadow-xs">
          <div>
            {onFlagForRevision && (
              <button
                type="button"
                onClick={() => onFlagForRevision(jd)}
                className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border border-amber-200"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Flag for Revision</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        </div>
      </div>
    </AnimatePresence>
  );
}
