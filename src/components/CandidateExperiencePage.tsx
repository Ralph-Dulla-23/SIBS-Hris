import React, { useState, useMemo, useEffect } from "react";
import {
  Users,
  Sparkles,
  Star,
  Search,
  Filter,
  Plus,
  X,
  FileText,
  CheckCircle2,
  AlertCircle,
  TrendingDown,
  TrendingUp,
  MessageSquare,
  Building2,
  Briefcase,
  ChevronRight,
  ArrowUpRight,
  Clock,
  UserCheck,
  UserX,
  RefreshCw,
  Download,
  Info,
  Calendar,
  Tag,
  Mail,
  User,
  ExternalLink,
  ChevronDown,
  Send,
  Copy
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import SendSurveyModal from "./SendSurveyModal";

export interface CandidateExperienceRecord {
  id: string;
  candidateCode: string;
  candidateName: string;
  candidateEmail: string;
  role: string;
  account: string;
  eventType: 
    | "Pipeline Drop-off" 
    | "Offer Declined" 
    | "Pre-start Withdrawal" 
    | "No Show" 
    | "Candidate Feedback" 
    | "Process Completed"
    | "Accepted Other Offer";
  status: "Drop-off" | "Completed";
  exitStage: "Sourced" | "Screened" | "Interviewed" | "Offered" | "Accepted" | "Hired";
  reasonCategory: 
    | "Compensation"
    | "Schedule"
    | "Process Delay"
    | "No Response"
    | "Failed Assessment"
    | "Failed Interview"
    | "Accepted Other Offer"
    | "Location Issue"
    | "Personal Reason"
    | "Incomplete Requirements"
    | "Process Satisfactory";
  reasonDescription: string;
  qualitativeFeedback: string;
  rating: number; // 1 to 5
  feedbackTag: string;
  dateRecorded: string;
  taOwner: string;
  stagesPassed: { stage: string; status: "Completed" | "Dropped" | "Pending"; timestamp: string }[];
}

interface CandidateExperiencePageProps {
  userEmail?: string;
  onSwitchModule?: (module: string) => void;
}

const INITIAL_EXPERIENCE_RECORDS: CandidateExperienceRecord[] = [
  {
    id: "EXP-801",
    candidateCode: "CAND-9102",
    candidateName: "Juan Dela Cruz",
    candidateEmail: "juan.delacruz@email.com",
    role: "Customer Service Representative",
    account: "Chevron Support",
    eventType: "Offer Declined",
    status: "Drop-off",
    exitStage: "Offered",
    reasonCategory: "Compensation",
    reasonDescription: "Offered base salary was 15% below candidate's current asking price and external offer.",
    qualitativeFeedback: "The interview process was very smooth and professional, but the financial package did not align with my expected ₱35,000 monthly target.",
    rating: 3,
    feedbackTag: "Compensation Concern",
    dateRecorded: "2026-08-04",
    taOwner: "Alena Batacan",
    stagesPassed: [
      { stage: "Sourced", status: "Completed", timestamp: "Jul 20, 2026" },
      { stage: "Screened", status: "Completed", timestamp: "Jul 22, 2026" },
      { stage: "Interviewed", status: "Completed", timestamp: "Jul 28, 2026" },
      { stage: "Offered", status: "Dropped", timestamp: "Aug 04, 2026" }
    ]
  },
  {
    id: "EXP-802",
    candidateCode: "CAND-9108",
    candidateName: "Maria Santos",
    candidateEmail: "maria.santos@gmail.com",
    role: "Healthcare Support Specialist",
    account: "Elevance Health",
    eventType: "Pipeline Drop-off",
    status: "Drop-off",
    exitStage: "Interviewed",
    reasonCategory: "Process Delay",
    reasonDescription: "Candidate withdrew due to 12-day waiting period between initial screening and hiring manager interview.",
    qualitativeFeedback: "I accepted another offer because I didn't hear back for over a week after my technical assessment.",
    rating: 2,
    feedbackTag: "Process Delay",
    dateRecorded: "2026-08-03",
    taOwner: "Carlos Ramos",
    stagesPassed: [
      { stage: "Sourced", status: "Completed", timestamp: "Jul 15, 2026" },
      { stage: "Screened", status: "Completed", timestamp: "Jul 18, 2026" },
      { stage: "Interviewed", status: "Dropped", timestamp: "Aug 03, 2026" }
    ]
  },
  {
    id: "EXP-803",
    candidateCode: "CAND-9115",
    candidateName: "Ramon Rodriguez",
    candidateEmail: "r.rodriguez@techmail.com",
    role: "Technical Support Associate",
    account: "Comcast Technical",
    eventType: "Process Completed",
    status: "Completed",
    exitStage: "Hired",
    reasonCategory: "Process Satisfactory",
    reasonDescription: "Candidate successfully onboarded with zero bottlenecks.",
    qualitativeFeedback: "Excellent recruitment team! Fast turnaround time from assessment to job offer. Excited to start at Mandaluyong HQ.",
    rating: 5,
    feedbackTag: "High Satisfaction",
    dateRecorded: "2026-08-02",
    taOwner: "Alena Batacan",
    stagesPassed: [
      { stage: "Sourced", status: "Completed", timestamp: "Jul 10, 2026" },
      { stage: "Screened", status: "Completed", timestamp: "Jul 12, 2026" },
      { stage: "Interviewed", status: "Completed", timestamp: "Jul 18, 2026" },
      { stage: "Offered", status: "Completed", timestamp: "Jul 25, 2026" },
      { stage: "Accepted", status: "Completed", timestamp: "Jul 27, 2026" },
      { stage: "Hired", status: "Completed", timestamp: "Aug 02, 2026" }
    ]
  },
  {
    id: "EXP-804",
    candidateCode: "CAND-9122",
    candidateName: "Beatriz Tan",
    candidateEmail: "bea.tan@outlook.com",
    role: "Team Leader - BPO Operations",
    account: "Citi Global",
    eventType: "Accepted Other Offer",
    status: "Drop-off",
    exitStage: "Interviewed",
    reasonCategory: "Accepted Other Offer",
    reasonDescription: "Received a competing TL offer from a hybrid financial account.",
    qualitativeFeedback: "Recruiters were respectful and thorough. Chosen competitor offered 100% remote work setup.",
    rating: 4,
    feedbackTag: "Work Setup Preference",
    dateRecorded: "2026-08-01",
    taOwner: "Patricia Gomez",
    stagesPassed: [
      { stage: "Sourced", status: "Completed", timestamp: "Jul 14, 2026" },
      { stage: "Screened", status: "Completed", timestamp: "Jul 17, 2026" },
      { stage: "Interviewed", status: "Dropped", timestamp: "Aug 01, 2026" }
    ]
  },
  {
    id: "EXP-805",
    candidateCode: "CAND-9130",
    candidateName: "Joshua Reyes",
    candidateEmail: "jreyes.works@gmail.com",
    role: "Customer Service Representative",
    account: "Chevron Support",
    eventType: "Pre-start Withdrawal",
    status: "Drop-off",
    exitStage: "Accepted",
    reasonCategory: "Schedule",
    reasonDescription: "Assigned rotational night shift clashed with family commitments.",
    qualitativeFeedback: "I requested a day shift slot during intake but was assigned a 10 PM start time upon medical clearance.",
    rating: 2,
    feedbackTag: "Schedule Mismatch",
    dateRecorded: "2026-07-30",
    taOwner: "Carlos Ramos",
    stagesPassed: [
      { stage: "Sourced", status: "Completed", timestamp: "Jul 05, 2026" },
      { stage: "Screened", status: "Completed", timestamp: "Jul 08, 2026" },
      { stage: "Interviewed", status: "Completed", timestamp: "Jul 15, 2026" },
      { stage: "Offered", status: "Completed", timestamp: "Jul 22, 2026" },
      { stage: "Accepted", status: "Dropped", timestamp: "Jul 30, 2026" }
    ]
  },
  {
    id: "EXP-806",
    candidateCode: "CAND-9138",
    candidateName: "Angela Mercado",
    candidateEmail: "angela.m@yahoo.com",
    role: "Healthcare Support Specialist",
    account: "Elevance Health",
    eventType: "Process Completed",
    status: "Completed",
    exitStage: "Hired",
    reasonCategory: "Process Satisfactory",
    reasonDescription: "Seamless candidate experience and friendly onboarding specialists.",
    qualitativeFeedback: "Very polite interviewers and clear instructions for medical requirements. Top notch recruitment!",
    rating: 5,
    feedbackTag: "Seamless Experience",
    dateRecorded: "2026-07-28",
    taOwner: "Alena Batacan",
    stagesPassed: [
      { stage: "Sourced", status: "Completed", timestamp: "Jul 01, 2026" },
      { stage: "Screened", status: "Completed", timestamp: "Jul 04, 2026" },
      { stage: "Interviewed", status: "Completed", timestamp: "Jul 10, 2026" },
      { stage: "Offered", status: "Completed", timestamp: "Jul 18, 2026" },
      { stage: "Accepted", status: "Completed", timestamp: "Jul 20, 2026" },
      { stage: "Hired", status: "Completed", timestamp: "Jul 28, 2026" }
    ]
  },
  {
    id: "EXP-807",
    candidateCode: "CAND-9145",
    candidateName: "Gabriel Navarro",
    candidateEmail: "g.navarro@gmail.com",
    role: "Financial Services Associate",
    account: "Chase Credit",
    eventType: "Pipeline Drop-off",
    status: "Drop-off",
    exitStage: "Screened",
    reasonCategory: "Location Issue",
    reasonDescription: "Commute distance to Mandaluyong site exceeded candidate limits.",
    qualitativeFeedback: "Site location is too far from my residence in Laguna. Would prefer satellite branch or wfh.",
    rating: 3,
    feedbackTag: "Location Distance",
    dateRecorded: "2026-07-27",
    taOwner: "Patricia Gomez",
    stagesPassed: [
      { stage: "Sourced", status: "Completed", timestamp: "Jul 22, 2026" },
      { stage: "Screened", status: "Dropped", timestamp: "Jul 27, 2026" }
    ]
  },
  {
    id: "EXP-808",
    candidateCode: "CAND-9152",
    candidateName: "Samantha Cruz",
    candidateEmail: "sam.cruz@outlook.com",
    role: "Technical Support Associate",
    account: "Comcast Technical",
    eventType: "No Show",
    status: "Drop-off",
    exitStage: "Interviewed",
    reasonCategory: "No Response",
    reasonDescription: "Candidate did not show up for final client interview panel and failed to respond to follow-ups.",
    qualitativeFeedback: "No feedback provided by candidate (Unreachable via call & email).",
    rating: 1,
    feedbackTag: "No Show / Unreachable",
    dateRecorded: "2026-07-25",
    taOwner: "Carlos Ramos",
    stagesPassed: [
      { stage: "Sourced", status: "Completed", timestamp: "Jul 10, 2026" },
      { stage: "Screened", status: "Completed", timestamp: "Jul 14, 2026" },
      { stage: "Interviewed", status: "Dropped", timestamp: "Jul 25, 2026" }
    ]
  }
];

export default function CandidateExperiencePage({
  userEmail = "alena.batacan@thesiblingssolutions.com",
  onSwitchModule
}: CandidateExperiencePageProps) {

  // State Management & LocalStorage Sync
  const [records, setRecords] = useState<CandidateExperienceRecord[]>(() => {
    try {
      const stored = localStorage.getItem("sibs_candidate_experience_records");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Error parsing stored experience records", e);
    }
    return INITIAL_EXPERIENCE_RECORDS;
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStage, setSelectedStage] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedRating, setSelectedRating] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedRecordForView, setSelectedRecordForView] = useState<CandidateExperienceRecord | null>(null);
  
  // Send Survey Modal States
  const [isSendSurveyModalOpen, setIsSendSurveyModalOpen] = useState(false);
  const [selectedRecordForSurvey, setSelectedRecordForSurvey] = useState<CandidateExperienceRecord | null>(null);

  // Sync to localStorage and listen to public survey submissions in real-time
  useEffect(() => {
    try {
      localStorage.setItem("sibs_candidate_experience_records", JSON.stringify(records));
    } catch (e) {
      console.error("Failed to save experience records to localStorage", e);
    }
  }, [records]);

  useEffect(() => {
    const handlePublicSurveySubmission = (event: Event) => {
      const customEvent = event as CustomEvent<CandidateExperienceRecord>;
      if (customEvent.detail) {
        const newRecord = customEvent.detail;
        setRecords((prev) => [newRecord, ...prev.filter((r) => r.id !== newRecord.id)]);
        triggerToast(`New Public Candidate Survey response received from ${newRecord.candidateName}!`);
      }
    };

    window.addEventListener("candidate_survey_submitted", handlePublicSurveySubmission);
    return () => {
      window.removeEventListener("candidate_survey_submitted", handlePublicSurveySubmission);
    };
  }, []);

  // New Record Form State
  const [newForm, setNewForm] = useState({
    candidateName: "",
    candidateEmail: "",
    role: "Customer Service Representative",
    account: "Chevron Support",
    eventType: "Offer Declined" as CandidateExperienceRecord["eventType"],
    status: "Drop-off" as CandidateExperienceRecord["status"],
    exitStage: "Offered" as CandidateExperienceRecord["exitStage"],
    reasonCategory: "Compensation" as CandidateExperienceRecord["reasonCategory"],
    reasonDescription: "",
    qualitativeFeedback: "",
    rating: 3,
    feedbackTag: "Compensation Concern",
    taOwner: "Alena Batacan"
  });

  // Filtered Records
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        r.candidateName.toLowerCase().includes(q) ||
        r.candidateEmail.toLowerCase().includes(q) ||
        r.candidateCode.toLowerCase().includes(q) ||
        r.role.toLowerCase().includes(q) ||
        r.account.toLowerCase().includes(q) ||
        r.feedbackTag.toLowerCase().includes(q) ||
        r.taOwner.toLowerCase().includes(q);

      const matchesStage = selectedStage === "All" || r.exitStage === selectedStage;
      const matchesCategory = selectedCategory === "All" || r.reasonCategory === selectedCategory;
      const matchesRating = selectedRating === "All" || r.rating.toString() === selectedRating;
      const matchesStatus = selectedStatus === "All" || r.status === selectedStatus;

      return matchesSearch && matchesStage && matchesCategory && matchesRating && matchesStatus;
    });
  }, [records, searchQuery, selectedStage, selectedCategory, selectedRating, selectedStatus]);

  // Metric Calculation
  const metrics = useMemo(() => {
    const total = records.length;
    const dropOffs = records.filter((r) => r.status === "Drop-off").length;
    const completed = records.filter((r) => r.status === "Completed").length;
    const avgRating = total > 0 ? (records.reduce((acc, r) => acc + r.rating, 0) / total).toFixed(1) : "0.0";
    const positiveRatings = records.filter((r) => r.rating >= 4).length;
    const lowRatings = records.filter((r) => r.rating <= 2).length;

    return { total, dropOffs, completed, avgRating, positiveRatings, lowRatings };
  }, [records]);

  // Stage Breakdown Data
  const stageBreakdown = useMemo(() => {
    const stages = ["Sourced", "Screened", "Interviewed", "Offered", "Accepted", "Hired"] as const;
    const counts: Record<string, number> = {
      Sourced: 0,
      Screened: 0,
      Interviewed: 0,
      Offered: 0,
      Accepted: 0,
      Hired: 0
    };

    records.forEach((r) => {
      if (r.status === "Drop-off" && counts[r.exitStage] !== undefined) {
        counts[r.exitStage] += 1;
      }
    });

    const maxCount = Math.max(...Object.values(counts), 1);
    return stages.map((s) => ({ stage: s, count: counts[s], percentage: Math.round((counts[s] / maxCount) * 100) }));
  }, [records]);

  // Reason Category Breakdown Data
  const reasonBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    records.forEach((r) => {
      if (r.status === "Drop-off") {
        counts[r.reasonCategory] = (counts[r.reasonCategory] || 0) + 1;
      }
    });

    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const maxVal = Math.max(...Object.values(counts), 1);

    return sorted.map(([category, count]) => ({
      category,
      count,
      percentage: Math.round((count / maxVal) * 100)
    }));
  }, [records]);

  // Top Bottleneck Insights
  const topBottleneck = useMemo(() => {
    const topStage = [...stageBreakdown].sort((a, b) => b.count - a.count)[0];
    const topReason = reasonBreakdown.length > 0 ? reasonBreakdown[0] : { category: "None", count: 0 };
    return {
      stage: topStage ? topStage.stage : "Interviewed",
      stageCount: topStage ? topStage.count : 0,
      reason: topReason.category,
      reasonCount: topReason.count
    };
  }, [stageBreakdown, reasonBreakdown]);

  // Handle Adding Record
  const handleAddRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newForm.candidateName.trim() || !newForm.candidateEmail.trim()) {
      triggerToast("Please provide Candidate Name and Email!");
      return;
    }

    const newRec: CandidateExperienceRecord = {
      id: `EXP-${Math.floor(800 + Math.random() * 200)}`,
      candidateCode: `CAND-${Math.floor(9000 + Math.random() * 999)}`,
      candidateName: newForm.candidateName.trim(),
      candidateEmail: newForm.candidateEmail.trim(),
      role: newForm.role,
      account: newForm.account,
      eventType: newForm.eventType,
      status: newForm.status,
      exitStage: newForm.exitStage,
      reasonCategory: newForm.reasonCategory,
      reasonDescription: newForm.reasonDescription.trim() || "No detailed description provided.",
      qualitativeFeedback: newForm.qualitativeFeedback.trim() || "No qualitative feedback recorded.",
      rating: newForm.rating,
      feedbackTag: newForm.feedbackTag.trim() || "General Entry",
      dateRecorded: new Date().toISOString().split("T")[0],
      taOwner: newForm.taOwner,
      stagesPassed: [
        { stage: "Sourced", status: "Completed", timestamp: "Jul 25, 2026" },
        { stage: "Screened", status: "Completed", timestamp: "Jul 28, 2026" },
        { stage: newForm.exitStage, status: newForm.status === "Drop-off" ? "Dropped" : "Completed", timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }
      ]
    };

    setRecords([newRec, ...records]);
    setIsAddModalOpen(false);
    triggerToast(`Added Candidate Experience Record for ${newRec.candidateName}!`);

    // Reset Form
    setNewForm({
      candidateName: "",
      candidateEmail: "",
      role: "Customer Service Representative",
      account: "Chevron Support",
      eventType: "Offer Declined",
      status: "Drop-off",
      exitStage: "Offered",
      reasonCategory: "Compensation",
      reasonDescription: "",
      qualitativeFeedback: "",
      rating: 3,
      feedbackTag: "Compensation Concern",
      taOwner: "Alena Batacan"
    });
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedStage("All");
    setSelectedCategory("All");
    setSelectedRating("All");
    setSelectedStatus("All");
    triggerToast("Filters reset to default view.");
  };

  return (
    <div className="flex-1 flex flex-col space-y-6 select-none relative" id="candidate-experience-root">
      
      {/* Toast Feedback */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 right-6 bg-[#042C51] border-l-4 border-[#FF5C28] text-white px-5 py-3 rounded-r-xl shadow-2xl z-50 flex items-center gap-3 text-xs font-semibold"
          >
            <CheckCircle2 className="w-4.5 h-4.5 text-[#FF5C28]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================== PAGE HEADER & ACTIONS ==================== */}
      <section className="bg-white p-5 rounded-2xl border border-[#E6ECF2] shadow-xs flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-[#E9F0FC] text-[#042C51] px-2.5 py-0.5 rounded font-black border border-blue-100 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#FF5C28]" />
              Recruitment Intelligence
            </span>
            <span className="text-[10px] bg-[#FFF0EB] text-[#FF5C28] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
              Voice of Candidate (VoC)
            </span>
          </div>
          <h1 className="text-xl font-black text-[#042C51] tracking-tight">
            Candidate Experience &amp; Exit Analytics
          </h1>
          <p className="text-xs text-[#667085] leading-normal max-w-4xl">
            Centralized hub in SiBS HRIS for monitoring candidate feedback, exit analytics, drop-offs, offer declines, withdrawals, and satisfaction ratings.
          </p>
        </div>

        {/* Action Group */}
        <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto">
          <button
            type="button"
            onClick={() => triggerToast("Re-running background experience analytics checks...")}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-[#042C51] text-xs font-bold rounded-lg border border-slate-200 transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-600" />
            <span>Refresh Data</span>
          </button>
          <button
            type="button"
            onClick={() => triggerToast("VoC Data exported to CSV successfully.")}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-[#042C51] text-xs font-bold rounded-lg border border-slate-200 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Export VoC Data</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedRecordForSurvey(null);
              setIsSendSurveyModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#FFF0EB] hover:bg-[#FFE0D5] text-[#FF5C28] text-xs font-bold rounded-lg border border-[#FFE0D5] transition-all cursor-pointer"
          >
            <Mail className="w-3.5 h-3.5 text-[#FF5C28]" />
            <span>Send Survey Email</span>
          </button>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#042C51] hover:bg-[#FF5C28] text-white text-xs font-black rounded-lg transition-all cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4 text-[#FF5C28]" />
            <span>Add Experience Record</span>
          </button>
        </div>
      </section>

      {/* ==================== TOP METRIC SUMMARY CARDS (6 CARDS) ==================== */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        
        {/* Card 1: Total Records */}
        <div className="bg-white p-4 rounded-xl border border-[#E6ECF2] shadow-xs flex flex-col justify-between space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total Records</span>
            <Users className="w-4 h-4 text-[#042C51]" />
          </div>
          <div className="text-2xl font-black font-mono text-[#042C51]">{metrics.total}</div>
          <p className="text-[10px] text-[#667085] font-medium">Logged VoC Entries</p>
        </div>

        {/* Card 2: Drop-offs */}
        <div className="bg-white p-4 rounded-xl border border-rose-200/80 bg-rose-50/20 shadow-xs flex flex-col justify-between space-y-1">
          <div className="flex items-center justify-between text-rose-700">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700">Drop-offs</span>
            <UserX className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black font-mono text-rose-700">{metrics.dropOffs}</div>
          <p className="text-[10px] text-rose-600 font-medium">Exited Funnel Early</p>
        </div>

        {/* Card 3: Completed / Hired */}
        <div className="bg-white p-4 rounded-xl border border-emerald-200/80 bg-emerald-50/20 shadow-xs flex flex-col justify-between space-y-1">
          <div className="flex items-center justify-between text-emerald-700">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Completed</span>
            <UserCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black font-mono text-emerald-700">{metrics.completed}</div>
          <p className="text-[10px] text-emerald-600 font-medium">Hired / Full Process</p>
        </div>

        {/* Card 4: Avg Rating */}
        <div className="bg-white p-4 rounded-xl border border-amber-200/80 bg-amber-50/20 shadow-xs flex flex-col justify-between space-y-1">
          <div className="flex items-center justify-between text-amber-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">Avg. Rating</span>
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="text-2xl font-black font-mono text-amber-900 flex items-center gap-1">
            {metrics.avgRating}
            <span className="text-xs font-normal text-slate-500">/ 5.0</span>
          </div>
          <p className="text-[10px] text-amber-700 font-medium">Overall Satisfaction</p>
        </div>

        {/* Card 5: Positive Ratings */}
        <div className="bg-white p-4 rounded-xl border border-[#E6ECF2] shadow-xs flex flex-col justify-between space-y-1">
          <div className="flex items-center justify-between text-emerald-700">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">4–5★ Ratings</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black font-mono text-emerald-700">{metrics.positiveRatings}</div>
          <p className="text-[10px] text-[#667085] font-medium">Satisfied Applicants</p>
        </div>

        {/* Card 6: Low Ratings */}
        <div className="bg-white p-4 rounded-xl border border-[#E6ECF2] shadow-xs flex flex-col justify-between space-y-1">
          <div className="flex items-center justify-between text-rose-700">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">1–2★ Ratings</span>
            <AlertCircle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black font-mono text-rose-700">{metrics.lowRatings}</div>
          <p className="text-[10px] text-[#667085] font-medium">Needs TA Intervention</p>
        </div>

      </div>

      {/* ==================== ANALYTICS CHARTS & INSIGHTS SECTION ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Chart 1: Drop-offs by Pipeline Stage */}
        <section className="bg-white p-5 rounded-2xl border border-[#E6ECF2] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#E6ECF2]">
            <div>
              <h2 className="text-xs font-black text-[#042C51] uppercase tracking-wider flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-rose-600" />
                Drop-offs by Pipeline Stage
              </h2>
              <p className="text-[11px] text-[#667085]">Candidate loss volume per recruitment stage.</p>
            </div>
            <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              Exit Volume
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {stageBreakdown.map((item) => (
              <div key={item.stage} className="space-y-1">
                <div className="flex justify-between items-center text-xs font-bold text-[#042C51]">
                  <span>{item.stage}</span>
                  <span className="font-mono text-slate-600">{item.count} Drop-offs</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#042C51] h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(item.percentage, item.count > 0 ? 8 : 0)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Chart 2: Drop-offs by Reason Category */}
        <section className="bg-white p-5 rounded-2xl border border-[#E6ECF2] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#E6ECF2]">
            <div>
              <h2 className="text-xs font-black text-[#042C51] uppercase tracking-wider flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#FF5C28]" />
                Top Drop-off Exit Reasons
              </h2>
              <p className="text-[11px] text-[#667085]">Root cause category analysis.</p>
            </div>
            <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              Root Cause
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {reasonBreakdown.length > 0 ? (
              reasonBreakdown.slice(0, 5).map((item) => (
                <div key={item.category} className="space-y-1">
                  <div className="flex justify-between items-center text-xs font-bold text-[#042C51]">
                    <span className="truncate">{item.category}</span>
                    <span className="font-mono text-slate-600">{item.count} Records</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#FF5C28] h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(item.percentage, 8)}%` }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-6 text-center">No drop-off categories recorded.</p>
            )}
          </div>
        </section>

        {/* Card 3: Candidate Experience Insight Card */}
        <section className="bg-[#042C51] p-5 rounded-2xl text-white shadow-xs space-y-4 flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-3 relative z-10">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-[#FF5C28] text-white rounded-lg shadow-xs">
                <Sparkles className="w-4 h-4" />
              </span>
              <h2 className="text-xs font-black uppercase tracking-wider text-[#FF5C28]">
                Candidate Experience Insights
              </h2>
            </div>

            <div className="p-3.5 bg-white/10 rounded-xl border border-white/15 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-300">
                Primary Recruitment Bottleneck
              </span>
              <p className="text-xs text-slate-100 leading-relaxed">
                Most candidate losses currently occur at the <strong className="text-amber-400 font-black">{topBottleneck.stage}</strong> stage ({topBottleneck.stageCount} exits).
              </p>
              <div className="pt-2 border-t border-white/10 text-xs text-slate-200">
                Top recorded cause: <strong className="text-[#FF5C28] font-bold">{topBottleneck.reason}</strong>.
              </div>
            </div>

            <p className="text-[11px] text-slate-300 leading-normal">
              <strong>TA Recommendation:</strong> Review compensation parity against current market rates for high-demand roles and conduct SLA audits on interview schedule turnarounds to prevent drop-offs.
            </p>
          </div>

          <div className="pt-2 relative z-10">
            <button
              type="button"
              onClick={() => onSwitchModule && onSwitchModule("Action Items")}
              className="w-full py-2 bg-white hover:bg-slate-100 text-[#042C51] font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              Open TA Action Items
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </section>

      </div>

      {/* ==================== SEARCH & FILTERS BAR ==================== */}
      <section className="bg-white p-4 rounded-2xl border border-[#E6ECF2] shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Keyword Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Candidate ID, Name, Email, Role, Account, TA Owner, or Feedback Tag..."
              className="w-full bg-[#F8FAFC] border border-[#E6ECF2] rounded-xl pl-10 pr-4 py-2 text-xs font-bold text-[#042C51] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#042C51]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Stage Filter */}
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className="bg-[#F8FAFC] border border-[#E6ECF2] rounded-xl px-3 py-2 text-xs font-bold text-[#042C51] focus:outline-none focus:ring-2 focus:ring-[#042C51]"
            >
              <option value="All">All Exit Stages</option>
              <option value="Sourced">Sourced</option>
              <option value="Screened">Screened</option>
              <option value="Interviewed">Interviewed</option>
              <option value="Offered">Offered</option>
              <option value="Accepted">Accepted</option>
              <option value="Hired">Hired</option>
            </select>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[#F8FAFC] border border-[#E6ECF2] rounded-xl px-3 py-2 text-xs font-bold text-[#042C51] focus:outline-none focus:ring-2 focus:ring-[#042C51]"
            >
              <option value="All">All Reason Categories</option>
              <option value="Compensation">Compensation</option>
              <option value="Schedule">Schedule</option>
              <option value="Process Delay">Process Delay</option>
              <option value="No Response">No Response</option>
              <option value="Failed Assessment">Failed Assessment</option>
              <option value="Failed Interview">Failed Interview</option>
              <option value="Accepted Other Offer">Accepted Other Offer</option>
              <option value="Location Issue">Location Issue</option>
              <option value="Personal Reason">Personal Reason</option>
            </select>

            {/* Rating Filter */}
            <select
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value)}
              className="bg-[#F8FAFC] border border-[#E6ECF2] rounded-xl px-3 py-2 text-xs font-bold text-[#042C51] focus:outline-none focus:ring-2 focus:ring-[#042C51]"
            >
              <option value="All">All Ratings (1-5★)</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-[#F8FAFC] border border-[#E6ECF2] rounded-xl px-3 py-2 text-xs font-bold text-[#042C51] focus:outline-none focus:ring-2 focus:ring-[#042C51]"
            >
              <option value="All">All Statuses</option>
              <option value="Drop-off">Drop-off</option>
              <option value="Completed">Completed</option>
            </select>

            {/* Clear Button */}
            {(searchQuery || selectedStage !== "All" || selectedCategory !== "All" || selectedRating !== "All" || selectedStatus !== "All") && (
              <button
                onClick={handleResetFilters}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-[#042C51] text-xs font-bold rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset
              </button>
            )}
          </div>

        </div>
      </section>

      {/* ==================== DATA TABLE & MOBILE CARDS ==================== */}
      <section className="bg-white p-5 rounded-2xl border border-[#E6ECF2] shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E6ECF2]">
          <h2 className="text-xs font-black text-[#042C51] uppercase tracking-wider flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#FF5C28]" />
            Candidate Experience &amp; Exit Feedback Log
          </h2>
          <span className="text-[10px] font-mono font-bold bg-[#E9F0FC] text-[#042C51] px-2.5 py-1 rounded-full border border-blue-200">
            {filteredRecords.length} Records Shown
          </span>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto border border-[#E6ECF2] rounded-xl">
          <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
            <thead>
              <tr className="border-b border-[#CBD5E1] bg-[#F8FAFC] text-[10px] uppercase text-[#042C51] font-black tracking-wider">
                <th className="px-3.5 py-2.5">Candidate Details</th>
                <th className="px-3.5 py-2.5">Role / Account</th>
                <th className="px-3.5 py-2.5">Event Type</th>
                <th className="px-3.5 py-2.5">Status</th>
                <th className="px-3.5 py-2.5">Exit Stage</th>
                <th className="px-3.5 py-2.5">Reason Category</th>
                <th className="px-3.5 py-2.5">Rating</th>
                <th className="px-3.5 py-2.5">Feedback Tag</th>
                <th className="px-3.5 py-2.5">Date</th>
                <th className="px-3.5 py-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6ECF2] bg-white text-slate-700">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-[#F8FAFC] transition-colors">
                    
                    {/* Candidate */}
                    <td className="px-3.5 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#042C51] text-white flex items-center justify-center font-bold text-xs shrink-0">
                          {r.candidateName.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <strong className="text-[#042C51] font-bold block">{r.candidateName}</strong>
                          <span className="text-[10px] font-mono text-slate-400">{r.candidateEmail}</span>
                        </div>
                      </div>
                    </td>

                    {/* Role / Account */}
                    <td className="px-3.5 py-3">
                      <strong className="text-[#042C51] font-bold block">{r.role}</strong>
                      <span className="text-[10px] text-slate-500">{r.account}</span>
                    </td>

                    {/* Event Type */}
                    <td className="px-3.5 py-3 font-semibold text-slate-700">
                      {r.eventType}
                    </td>

                    {/* Status Badge */}
                    <td className="px-3.5 py-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        r.status === "Drop-off" 
                          ? "bg-[#FFE0D5] text-[#FF5C28] border border-[#FFE0D5]" 
                          : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      }`}>
                        {r.status}
                      </span>
                    </td>

                    {/* Exit Stage */}
                    <td className="px-3.5 py-3 font-mono text-xs font-bold text-[#042C51]">
                      {r.exitStage}
                    </td>

                    {/* Reason Category */}
                    <td className="px-3.5 py-3">
                      <span className="px-2 py-0.5 bg-slate-100 text-[#042C51] rounded font-bold text-[11px] border border-slate-200">
                        {r.reasonCategory}
                      </span>
                    </td>

                    {/* Rating */}
                    <td className="px-3.5 py-3">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3.5 h-3.5 ${
                              star <= r.rating 
                                ? "text-amber-400 fill-amber-400" 
                                : "text-slate-200"
                            }`}
                          />
                        ))}
                      </div>
                    </td>

                    {/* Feedback Tag */}
                    <td className="px-3.5 py-3">
                      <span className="px-2 py-0.5 bg-[#E9F0FC] text-[#042C51] rounded text-[10px] font-bold border border-blue-200">
                        {r.feedbackTag}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-3.5 py-3 font-mono text-slate-500 text-[11px]">
                      {r.dateRecorded}
                    </td>

                    {/* Action */}
                    <td className="px-3.5 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedRecordForSurvey(r);
                            setIsSendSurveyModalOpen(true);
                          }}
                          className="px-2 py-1 bg-[#FFF0EB] hover:bg-[#FFE0D5] text-[#FF5C28] font-bold text-[11px] rounded-lg transition-colors cursor-pointer flex items-center gap-1 border border-[#FFE0D5]"
                          title="Send Candidate Survey Email"
                        >
                          <Mail className="w-3 h-3 text-[#FF5C28]" />
                          <span>Send Email</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const surveyUrl = `${window.location.origin}?surveyToken=TOK-CAND-${r.id}`;
                            navigator.clipboard.writeText(surveyUrl);
                            triggerToast(`NHO Survey Link for ${r.candidateName} copied to clipboard!`);
                          }}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] rounded-lg transition-colors cursor-pointer flex items-center gap-1 border border-slate-200"
                          title="Copy Public NHO Survey Link"
                        >
                          <Copy className="w-3 h-3 text-slate-600" />
                          <span>Copy Link</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedRecordForView(r)}
                          className="px-3 py-1 bg-[#F1F5F9] hover:bg-[#042C51] hover:text-white text-[#042C51] font-bold text-[11px] rounded-lg transition-colors cursor-pointer"
                        >
                          View Details
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="px-4 py-8 text-center text-slate-400">
                    No candidate experience records found matching your active search/filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards View */}
        <div className="md:hidden space-y-3">
          {filteredRecords.length > 0 ? (
            filteredRecords.map((r) => (
              <div key={r.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <strong className="text-[#042C51] text-sm font-bold block">{r.candidateName}</strong>
                    <span className="text-[10px] font-mono text-slate-500">{r.candidateEmail}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                    r.status === "Drop-off" ? "bg-[#FFE0D5] text-[#FF5C28]" : "bg-emerald-100 text-emerald-800"
                  }`}>
                    {r.status}
                  </span>
                </div>

                <div className="text-xs text-slate-700">
                  <span className="font-semibold text-[#042C51]">{r.role}</span> &bull; <span className="text-slate-500">{r.account}</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={`w-3 h-3 ${s <= r.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"}`} />
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedRecordForView(r)}
                    className="px-2.5 py-1 bg-[#042C51] text-white font-bold text-[10px] rounded-lg cursor-pointer"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-400 py-6 text-center">No records matching active search.</p>
          )}
        </div>

      </section>

      {/* ==================== MODALS ==================== */}

      {/* 1. ADD EXPERIENCE RECORD MODAL */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-[#042C51]/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden my-8"
            >
              <div className="px-6 py-4 bg-[#042C51] text-white flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#FF5C28]" />
                  <h3 className="text-sm font-black uppercase tracking-wider">Log Candidate Experience Record</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddRecord} className="p-6 space-y-4">
                
                {/* Candidate Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Candidate Full Name *</label>
                    <input
                      type="text"
                      required
                      value={newForm.candidateName}
                      onChange={(e) => setNewForm({ ...newForm, candidateName: e.target.value })}
                      placeholder="e.g. Juan Dela Cruz"
                      className="w-full bg-[#F8FAFC] border border-[#E6ECF2] rounded-xl px-3 py-2 text-xs font-semibold text-[#042C51] focus:outline-none focus:ring-2 focus:ring-[#042C51]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Candidate Email *</label>
                    <input
                      type="email"
                      required
                      value={newForm.candidateEmail}
                      onChange={(e) => setNewForm({ ...newForm, candidateEmail: e.target.value })}
                      placeholder="e.g. juan.delacruz@email.com"
                      className="w-full bg-[#F8FAFC] border border-[#E6ECF2] rounded-xl px-3 py-2 text-xs font-semibold text-[#042C51] focus:outline-none focus:ring-2 focus:ring-[#042C51]"
                    />
                  </div>
                </div>

                {/* Role & Account */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Target Position / Role</label>
                    <input
                      type="text"
                      value={newForm.role}
                      onChange={(e) => setNewForm({ ...newForm, role: e.target.value })}
                      className="w-full bg-[#F8FAFC] border border-[#E6ECF2] rounded-xl px-3 py-2 text-xs font-semibold text-[#042C51]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Target Account</label>
                    <input
                      type="text"
                      value={newForm.account}
                      onChange={(e) => setNewForm({ ...newForm, account: e.target.value })}
                      className="w-full bg-[#F8FAFC] border border-[#E6ECF2] rounded-xl px-3 py-2 text-xs font-semibold text-[#042C51]"
                    />
                  </div>
                </div>

                {/* Event Type & Status & Exit Stage */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Event Classification</label>
                    <select
                      value={newForm.eventType}
                      onChange={(e) => setNewForm({ ...newForm, eventType: e.target.value as CandidateExperienceRecord["eventType"] })}
                      className="w-full bg-[#F8FAFC] border border-[#E6ECF2] rounded-xl px-3 py-2 text-xs font-semibold text-[#042C51]"
                    >
                      <option value="Pipeline Drop-off">Pipeline Drop-off</option>
                      <option value="Offer Declined">Offer Declined</option>
                      <option value="Pre-start Withdrawal">Pre-start Withdrawal</option>
                      <option value="No Show">No Show</option>
                      <option value="Candidate Feedback">Candidate Feedback</option>
                      <option value="Process Completed">Process Completed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Final Status</label>
                    <select
                      value={newForm.status}
                      onChange={(e) => setNewForm({ ...newForm, status: e.target.value as CandidateExperienceRecord["status"] })}
                      className="w-full bg-[#F8FAFC] border border-[#E6ECF2] rounded-xl px-3 py-2 text-xs font-semibold text-[#042C51]"
                    >
                      <option value="Drop-off">Drop-off</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Exit Stage</label>
                    <select
                      value={newForm.exitStage}
                      onChange={(e) => setNewForm({ ...newForm, exitStage: e.target.value as CandidateExperienceRecord["exitStage"] })}
                      className="w-full bg-[#F8FAFC] border border-[#E6ECF2] rounded-xl px-3 py-2 text-xs font-semibold text-[#042C51]"
                    >
                      <option value="Sourced">Sourced</option>
                      <option value="Screened">Screened</option>
                      <option value="Interviewed">Interviewed</option>
                      <option value="Offered">Offered</option>
                      <option value="Accepted">Accepted</option>
                      <option value="Hired">Hired</option>
                    </select>
                  </div>
                </div>

                {/* Reason Category & Feedback Tag */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Reason Category</label>
                    <select
                      value={newForm.reasonCategory}
                      onChange={(e) => setNewForm({ ...newForm, reasonCategory: e.target.value as CandidateExperienceRecord["reasonCategory"] })}
                      className="w-full bg-[#F8FAFC] border border-[#E6ECF2] rounded-xl px-3 py-2 text-xs font-semibold text-[#042C51]"
                    >
                      <option value="Compensation">Compensation</option>
                      <option value="Schedule">Schedule</option>
                      <option value="Process Delay">Process Delay</option>
                      <option value="No Response">No Response</option>
                      <option value="Failed Assessment">Failed Assessment</option>
                      <option value="Failed Interview">Failed Interview</option>
                      <option value="Accepted Other Offer">Accepted Other Offer</option>
                      <option value="Location Issue">Location Issue</option>
                      <option value="Personal Reason">Personal Reason</option>
                      <option value="Process Satisfactory">Process Satisfactory</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Feedback Tag</label>
                    <input
                      type="text"
                      value={newForm.feedbackTag}
                      onChange={(e) => setNewForm({ ...newForm, feedbackTag: e.target.value })}
                      placeholder="e.g. Compensation Concern"
                      className="w-full bg-[#F8FAFC] border border-[#E6ECF2] rounded-xl px-3 py-2 text-xs font-semibold text-[#042C51]"
                    />
                  </div>
                </div>

                {/* Rating & TA Owner */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Candidate Rating (1–5 Stars)</label>
                    <div className="flex items-center gap-2 pt-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setNewForm({ ...newForm, rating: s })}
                          className="p-1 cursor-pointer focus:outline-none"
                        >
                          <Star className={`w-6 h-6 ${s <= newForm.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"}`} />
                        </button>
                      ))}
                      <span className="text-xs font-bold text-slate-600 font-mono">({newForm.rating} Stars)</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">TA Owner</label>
                    <input
                      type="text"
                      value={newForm.taOwner}
                      onChange={(e) => setNewForm({ ...newForm, taOwner: e.target.value })}
                      className="w-full bg-[#F8FAFC] border border-[#E6ECF2] rounded-xl px-3 py-2 text-xs font-semibold text-[#042C51]"
                    />
                  </div>
                </div>

                {/* Description & Qualitative Feedback Textareas */}
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Drop-off Reason / Description</label>
                  <textarea
                    rows={2}
                    value={newForm.reasonDescription}
                    onChange={(e) => setNewForm({ ...newForm, reasonDescription: e.target.value })}
                    placeholder="Provide root-cause description..."
                    className="w-full bg-[#F8FAFC] border border-[#E6ECF2] rounded-xl px-3 py-2 text-xs font-semibold text-[#042C51] focus:outline-none"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Qualitative Candidate Feedback (VoC)</label>
                  <textarea
                    rows={2}
                    value={newForm.qualitativeFeedback}
                    onChange={(e) => setNewForm({ ...newForm, qualitativeFeedback: e.target.value })}
                    placeholder="Direct quotes or candidate comments..."
                    className="w-full bg-[#F8FAFC] border border-[#E6ECF2] rounded-xl px-3 py-2 text-xs font-semibold text-[#042C51] focus:outline-none"
                  ></textarea>
                </div>

                {/* Form Buttons */}
                <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#FF5C28] hover:bg-[#E04B1D] text-white font-black text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    Save Record
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. VIEW CANDIDATE EXPERIENCE MODAL */}
      <AnimatePresence>
        {selectedRecordForView && (
          <div className="fixed inset-0 bg-[#042C51]/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden my-8"
            >
              {/* Header Banner */}
              <div className="px-6 py-5 bg-[#042C51] text-white flex justify-between items-start">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-mono font-bold bg-white/10 px-2 py-0.5 rounded text-slate-200 border border-white/10">
                      Record ID: {selectedRecordForView.id} ({selectedRecordForView.candidateCode})
                    </span>
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase ${
                      selectedRecordForView.status === "Drop-off" ? "bg-[#FF5C28] text-white" : "bg-emerald-500 text-white"
                    }`}>
                      {selectedRecordForView.status}
                    </span>
                    <span className="text-[10px] font-mono text-slate-300 bg-white/5 px-2 py-0.5 rounded">
                      Recorded: {selectedRecordForView.dateRecorded}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-white tracking-tight">{selectedRecordForView.candidateName}</h3>
                  
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 font-medium">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      {selectedRecordForView.candidateEmail}
                    </span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1 text-slate-200">
                      <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                      {selectedRecordForView.role}
                    </span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1 text-slate-200">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      {selectedRecordForView.account}
                    </span>
                  </div>

                  {/* Rating Stars Banner */}
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[10px] font-bold uppercase text-slate-300">Overall Rating:</span>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= selectedRecordForView.rating ? "text-amber-400 fill-amber-400" : "text-slate-600"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-amber-300 font-mono">({selectedRecordForView.rating}.0 / 5.0)</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedRecordForView(null)}
                  className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-5">
                
                {/* Event & Exit Overview Grid (5 Required Fields) */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Event &amp; Exit Overview</span>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs bg-[#F8FAFC] p-3.5 rounded-xl border border-[#E6ECF2]">
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 block uppercase">Event Type</span>
                      <strong className="text-[#042C51] text-[11px] block mt-0.5">{selectedRecordForView.eventType}</strong>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 block uppercase">Final Status</span>
                      <strong className={`text-[11px] block mt-0.5 font-black uppercase ${
                        selectedRecordForView.status === "Drop-off" ? "text-[#FF5C28]" : "text-emerald-600"
                      }`}>
                        {selectedRecordForView.status}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 block uppercase">Exit Stage</span>
                      <strong className="text-[#042C51] text-[11px] block mt-0.5 font-mono">{selectedRecordForView.exitStage}</strong>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 block uppercase">Reason Category</span>
                      <strong className="text-[#042C51] text-[11px] block mt-0.5">{selectedRecordForView.reasonCategory}</strong>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 block uppercase">Feedback Tag</span>
                      <span className="inline-block px-1.5 py-0.5 bg-blue-100 text-[#042C51] text-[10px] font-bold rounded border border-blue-200 mt-0.5">
                        {selectedRecordForView.feedbackTag}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Candidate Feedback Quote Box */}
                <div className="p-4 bg-[#FFF0EB] rounded-xl border border-[#FFE0D5] space-y-2 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#FF5C28] flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-[#FF5C28]" />
                      Candidate Qualitative Feedback (Voice of Candidate)
                    </span>
                    <span className="text-[10px] font-bold text-[#FF5C28]/80 font-mono">Direct Raw Quote</span>
                  </div>
                  <blockquote className="text-xs text-[#042C51] italic leading-relaxed pt-1 pl-3 border-l-2 border-[#FF5C28] font-medium">
                    "{selectedRecordForView.qualitativeFeedback}"
                  </blockquote>
                  <p className="text-[11px] text-slate-600 pt-1 font-normal bg-white/60 p-2 rounded-lg border border-[#FFE0D5]/60">
                    <strong className="font-bold text-[#042C51]">Root Cause Description:</strong> {selectedRecordForView.reasonDescription}
                  </p>
                </div>

                {/* Stage Timeline Cascade */}
                <div className="space-y-2">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Stage Timeline Cascade (Candidate Journey)</span>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="relative pl-6 space-y-3.5 before:absolute before:left-2.5 before:top-2.5 before:bottom-2.5 before:w-0.5 before:bg-slate-300">
                      {selectedRecordForView.stagesPassed.map((st, idx) => (
                        <div key={idx} className="relative flex items-center justify-between text-xs">
                          <span className={`absolute -left-6 w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs ${
                            st.status === "Completed" ? "bg-emerald-500" : "bg-[#FF5C28]"
                          }`}></span>
                          <div>
                            <strong className="text-[#042C51] font-bold text-xs">{st.stage}</strong>
                            <span className="text-[10px] text-slate-400 ml-2 font-mono">({st.timestamp})</span>
                          </div>
                          <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase ${
                            st.status === "Completed" ? "bg-emerald-100 text-emerald-800" : "bg-[#FFE0D5] text-[#FF5C28]"
                          }`}>
                            {st.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* TA Ownership & System Metadata */}
                <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E6ECF2] flex items-center justify-between text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[#042C51]" />
                    <span>Assigned TA Recruiter: <strong className="text-[#042C51] font-bold">{selectedRecordForView.taOwner}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 font-mono text-[11px]">
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    <span>System Record ID: <strong className="text-slate-700">{selectedRecordForView.id}</strong></span>
                  </div>
                </div>

                {/* Modal Footer Buttons */}
                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setSelectedRecordForView(null)}
                    className="px-5 py-2 bg-[#042C51] hover:bg-[#FF5C28] text-white font-black text-xs rounded-xl cursor-pointer transition-colors shadow-xs"
                  >
                    Close Experience Record
                  </button>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. SEND SURVEY EMAIL MODAL */}
      <SendSurveyModal
        isOpen={isSendSurveyModalOpen}
        onClose={() => {
          setIsSendSurveyModalOpen(false);
          setSelectedRecordForSurvey(null);
        }}
        candidateRecord={selectedRecordForSurvey}
        onSurveySent={(recordId, surveyToken, triggerType) => {
          triggerToast(`Survey email sent successfully! Token: ${surveyToken} (${triggerType})`);
        }}
      />

    </div>
  );
}
