import React, { useState, useMemo } from "react";
import CentralizedFilters from "./CentralizedFilters";
import AddJobDescriptionModal from "./AddJobDescriptionModal";
import JobDescriptionPreviewModal from "./JobDescriptionPreviewModal";
import {
  FileText,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ClipboardList,
  Eye,
  Edit3,
  RefreshCw,
  X,
  ChevronRight,
  Sparkles,
  Building2,
  UserCheck,
  Tag,
  Clock,
  Layers,
  Send,
  AlertCircle,
  FileCheck,
  HelpCircle,
  History,
  ShieldCheck,
  Award,
  Users
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Types
export type JDStatus =
  | "Existing"
  | "For Revision"
  | "New Job Description"
  | "For Approval"
  | "Approved"
  | "Rejected";

export interface RevisionLog {
  id: string;
  date: string;
  author: string;
  version: string;
  remarks: string;
}

export interface JobDescriptionRecord {
  id: string;
  documentTitle: string;
  roleTitle: string;
  department: string;
  account: string;
  linkedHiringNeed: string;
  supervisoryLevel: string;
  status: JDStatus;
  dateRequested: string;
  versionNo: string;
  competencies: string[];
  responsibilities: string[];
  targetPersonality: string;
  revisionHistory: RevisionLog[];
}

interface JobDescriptionPageProps {
  onSwitchModule?: (module: string) => void;
}

// Mock Initial Data
const INITIAL_JOB_DESCRIPTIONS: JobDescriptionRecord[] = [
  {
    id: "JD-2026-001",
    documentTitle: "JD_Customer_Support_Specialist_v2.1.pdf",
    roleTitle: "Customer Support Specialist",
    department: "Technical Support",
    account: "Verizon Tech",
    linkedHiringNeed: "REQ-2026-089 (Ramp - 40 Agents)",
    supervisoryLevel: "Individual Contributor",
    status: "Existing",
    dateRequested: "2026-06-12",
    versionNo: "v2.1",
    competencies: ["B2+ English Fluency", "Inbound Call Handling", "Zendesk CRM", "Technical Troubleshooting"],
    responsibilities: [
      "Handle inbound customer inquiries via voice and chat channels.",
      "Troubleshoot tier-1 broadband and router connection issues.",
      "Maintain a minimum 92% First Contact Resolution (FCR) score.",
      "Log detailed customer interactions in Zendesk ticket queue."
    ],
    targetPersonality: "Empathetic, patient under pressure, detail-oriented communicator",
    revisionHistory: [
      {
        id: "REV-101",
        date: "2026-06-12",
        author: "Alena Batacan (HR Admin)",
        version: "v2.1",
        remarks: "Updated competency benchmark to B2+ CEFR English standards."
      }
    ]
  },
  {
    id: "JD-2026-002",
    documentTitle: "JD_Technical_Support_Lead_v1.0.pdf",
    roleTitle: "Technical Support Team Lead",
    department: "Operations",
    account: "Comcast Support",
    linkedHiringNeed: "REQ-2026-094 (Leadership Replacement)",
    supervisoryLevel: "Team Lead",
    status: "For Revision",
    dateRequested: "2026-07-02",
    versionNo: "v1.0",
    competencies: ["Team Coaching", "Queue Escalation Management", "SLA Monitoring", "Avaya / Cisco Telephony"],
    responsibilities: [
      "Manage real-time queue performance for a team of 15-20 agents.",
      "Conduct weekly 1-on-1 coaching sessions and KPI scorecards.",
      "Handle tier-2 escalated customer complaints and manager call-backs.",
      "Coordinate with WFM on floor adherence and staffing coverage."
    ],
    targetPersonality: "Assertive, highly organized leader with strong analytical acumen",
    revisionHistory: [
      {
        id: "REV-102",
        date: "2026-07-18",
        author: "Marcus Vance (TA Lead)",
        version: "v1.0",
        remarks: "Requested revision to add mandatory weekend shift supervisory experience."
      }
    ]
  },
  {
    id: "JD-2026-003",
    documentTitle: "JD_DevOps_Cloud_Architect_v0.9.pdf",
    roleTitle: "DevOps & Cloud Architect",
    department: "Executive Tech",
    account: "Internal HR Ops",
    linkedHiringNeed: "REQ-2026-102 (Core Engineering)",
    supervisoryLevel: "Manager",
    status: "New Job Description",
    dateRequested: "2026-07-15",
    versionNo: "v0.9 Draft",
    competencies: ["AWS Cloud Infra", "Docker & Kubernetes", "CI/CD Pipelines", "Terraform Infrastructure"],
    responsibilities: [
      "Architect and deploy secure containerized Cloud Run microservices.",
      "Maintain zero-downtime CI/CD release pipelines with GitHub Actions.",
      "Implement SOC2 compliant audit log infrastructure and database rules.",
      "Monitor system latency and resource optimization across environments."
    ],
    targetPersonality: "Proactive problem solver, systematic, security-focused engineering mindset",
    revisionHistory: []
  },
  {
    id: "JD-2026-004",
    documentTitle: "JD_Healthcare_Billing_Agent_v1.4.pdf",
    roleTitle: "Healthcare Billing Representative",
    department: "Healthcare Ops",
    account: "Aetna Health",
    linkedHiringNeed: "REQ-2026-071 (Quarterly Expansion)",
    supervisoryLevel: "Individual Contributor",
    status: "Existing",
    dateRequested: "2026-05-20",
    versionNo: "v1.4",
    competencies: ["HIPAA Compliance", "Medical Claims Processing", "ICD-10 Coding Knowledge", "Active Listening"],
    responsibilities: [
      "Verify patient insurance coverage and process prior authorizations.",
      "Adhere strictly to HIPAA data privacy and confidentiality rules.",
      "Reconcile insurance claim discrepancies and dispute rejections.",
      "Maintain 98%+ accuracy in data entry and claims documentation."
    ],
    targetPersonality: "Meticulous, ethical, quiet focus with high procedural compliance",
    revisionHistory: [
      {
        id: "REV-103",
        date: "2026-05-20",
        author: "Samantha Reed (Finance)",
        version: "v1.4",
        remarks: "Approved annual SLA alignment update for ICD-10 coding standards."
      }
    ]
  },
  {
    id: "JD-2026-005",
    documentTitle: "JD_Talent_Acquisition_Sourcer_v1.0.pdf",
    roleTitle: "Talent Acquisition Specialist",
    department: "Talent Acquisition",
    account: "Internal HR Ops",
    linkedHiringNeed: "REQ-2026-110 (TA Internal Backfill)",
    supervisoryLevel: "Individual Contributor",
    status: "For Approval",
    dateRequested: "2026-07-19",
    versionNo: "v1.0",
    competencies: ["Boolean Search Sourcing", "LinkedIn Recruiter", "Candidate Interviewing", "ATS Pipeline Tracking"],
    responsibilities: [
      "Source qualified candidates across LinkedIn, JobStreet, and internal talent pools.",
      "Conduct initial HR screening interviews and behavioral assessments.",
      "Manage end-to-end interview scheduling with operations managers.",
      "Maintain candidate pipeline records with 100% daily log hygiene."
    ],
    targetPersonality: "Outgoing, persistent networker, relationship-driven recruiter",
    revisionHistory: []
  },
  {
    id: "JD-2026-006",
    documentTitle: "JD_WFM_Realtime_Analyst_v2.0.pdf",
    roleTitle: "WFM Real-Time Analyst",
    department: "Workforce Management",
    account: "Global WFM",
    linkedHiringNeed: "REQ-2026-065 (24/7 Desk Coverage)",
    supervisoryLevel: "Individual Contributor",
    status: "Approved",
    dateRequested: "2026-06-01",
    versionNo: "v2.0",
    competencies: ["Verint / Aspect WFM", "Interval Adherence Tracking", "Call Volume Forecasting", "Excel Data Modeling"],
    responsibilities: [
      "Monitor intra-day service levels and floor adherence across 5 accounts.",
      "Adjust agent schedule states in real-time to mitigate queue spikes.",
      "Publish daily timecard variance reports to HR and Operations heads.",
      "Analyze historical call volume trends for weekly scheduling runs."
    ],
    targetPersonality: "Analytical, calm under pressure, data-obsessed communicator",
    revisionHistory: [
      {
        id: "REV-104",
        date: "2026-06-01",
        author: "Ralph Dulla (Super Admin)",
        version: "v2.0",
        remarks: "Approved final version for all global operations accounts."
      }
    ]
  }
];

export default function JobDescriptionPage({ onSwitchModule }: JobDescriptionPageProps) {
  const [jobDescriptions, setJobDescriptions] = useState<JobDescriptionRecord[]>(INITIAL_JOB_DESCRIPTIONS);
  const [selectedStatusTab, setSelectedStatusTab] = useState<string>("All");

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All Departments");
  const [accountFilter, setAccountFilter] = useState("All Accounts");
  const [supervisoryFilter, setSupervisoryFilter] = useState("All Levels");

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingJD, setViewingJD] = useState<JobDescriptionRecord | null>(null);
  const [revisingJD, setRevisingJD] = useState<JobDescriptionRecord | null>(null);
  const [editingJD, setEditingJD] = useState<JobDescriptionRecord | null>(null);

  // Status Modal (Feedback Overlay) State
  const [statusModal, setStatusModal] = useState<{
    isOpen: boolean;
    type: "success" | "error" | "info";
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: "success",
    title: "",
    message: ""
  });

  const triggerStatusModal = (type: "success" | "error" | "info", title: string, message: string) => {
    setStatusModal({ isOpen: true, type, title, message });
  };

  // Form State for Adding New Job Description
  const [newJdForm, setNewJdForm] = useState({
    documentTitle: "",
    roleTitle: "",
    department: "Technical Support",
    account: "Verizon Tech",
    linkedHiringNeed: "REQ-2026-NEW (General Intake)",
    supervisoryLevel: "Individual Contributor",
    competenciesText: "B2+ English Fluency, Customer Service, Problem Solving",
    responsibilitiesText: "Handle inbound inquiries.\nMaintain high CSAT scores.\nDocument logs in ticket queue.",
    targetPersonality: "Empathetic, structured, resilient under call volume"
  });

  // Form State for Revising
  const [revisionRemarks, setRevisionRemarks] = useState("");
  const [updatedCompetenciesText, setUpdatedCompetenciesText] = useState("");
  const [updatedResponsibilitiesText, setUpdatedResponsibilitiesText] = useState("");

  // Stat Counters
  const stats = useMemo(() => {
    const total = jobDescriptions.length;
    const existing = jobDescriptions.filter((j) => j.status === "Existing" || j.status === "Approved").length;
    const revision = jobDescriptions.filter((j) => j.status === "For Revision").length;
    const newJd = jobDescriptions.filter((j) => j.status === "New Job Description" || j.status === "For Approval").length;
    return { total, existing, revision, newJd };
  }, [jobDescriptions]);

  // Filtered Job Descriptions List
  const filteredJDs = useMemo(() => {
    return jobDescriptions.filter((jd) => {
      // Tab Status filter
      if (selectedStatusTab !== "All") {
        if (selectedStatusTab === "Existing") {
          if (jd.status !== "Existing" && jd.status !== "Approved") return false;
        } else if (selectedStatusTab === "New Job Description") {
          if (jd.status !== "New Job Description" && jd.status !== "For Approval") return false;
        } else if (jd.status !== selectedStatusTab) {
          return false;
        }
      }

      // Search Query
      const matchesSearch =
        jd.roleTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        jd.documentTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        jd.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        jd.account.toLowerCase().includes(searchTerm.toLowerCase()) ||
        jd.linkedHiringNeed.toLowerCase().includes(searchTerm.toLowerCase());

      // Dropdown Selects
      const matchesDept = departmentFilter === "All Departments" || jd.department === departmentFilter;
      const matchesAcc = accountFilter === "All Accounts" || jd.account === accountFilter;
      const matchesSuper = supervisoryFilter === "All Levels" || jd.supervisoryLevel === supervisoryFilter;

      return matchesSearch && matchesDept && matchesAcc && matchesSuper;
    });
  }, [jobDescriptions, selectedStatusTab, searchTerm, departmentFilter, accountFilter, supervisoryFilter]);

  // Handle Add Job Description Submission
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJdForm.roleTitle || !newJdForm.documentTitle) {
      triggerStatusModal("error", "Creation Failed", "Please provide a valid Role Title and Document Title.");
      return;
    }

    const comps = newJdForm.competenciesText
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);

    const resps = newJdForm.responsibilitiesText
      .split("\n")
      .map((r) => r.trim())
      .filter(Boolean);

    const newRecord: JobDescriptionRecord = {
      id: `JD-2026-00${jobDescriptions.length + 1}`,
      documentTitle: newJdForm.documentTitle.endsWith(".pdf")
        ? newJdForm.documentTitle
        : `${newJdForm.documentTitle}.pdf`,
      roleTitle: newJdForm.roleTitle,
      department: newJdForm.department,
      account: newJdForm.account,
      linkedHiringNeed: newJdForm.linkedHiringNeed,
      supervisoryLevel: newJdForm.supervisoryLevel,
      status: "New Job Description",
      dateRequested: new Date().toISOString().split("T")[0],
      versionNo: "v1.0",
      competencies: comps.length ? comps : ["Communication", "Domain Knowledge"],
      responsibilities: resps.length ? resps : ["Execute assigned core responsibilities."],
      targetPersonality: newJdForm.targetPersonality || "Adaptable, professional team player",
      revisionHistory: []
    };

    setJobDescriptions((prev) => [newRecord, ...prev]);
    setIsAddModalOpen(false);

    // Reset Form
    setNewJdForm({
      documentTitle: "",
      roleTitle: "",
      department: "Technical Support",
      account: "Verizon Tech",
      linkedHiringNeed: "REQ-2026-NEW (General Intake)",
      supervisoryLevel: "Individual Contributor",
      competenciesText: "B2+ English Fluency, Customer Service, Problem Solving",
      responsibilitiesText: "Handle inbound inquiries.\nMaintain high CSAT scores.\nDocument logs in ticket queue.",
      targetPersonality: "Empathetic, structured, resilient under call volume"
    });

    triggerStatusModal(
      "success",
      "Job Description Created",
      `New JD for "${newRecord.roleTitle}" (${newRecord.versionNo}) was created and queued in New Job Description records.`
    );
  };

  // Handle Revision Submission
  const handleRevisionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revisingJD) return;
    if (!revisionRemarks) {
      triggerStatusModal("error", "Revision Failed", "Please enter valid revision remarks before submitting.");
      return;
    }

    const nextVer = `v${(parseFloat(revisingJD.versionNo.replace(/[^0-9.]/g, "")) + 0.1).toFixed(1)}`;

    const newRevLog: RevisionLog = {
      id: `REV-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toISOString().split("T")[0],
      author: "Super Admin / HR Reviewer",
      version: nextVer,
      remarks: revisionRemarks
    };

    const updatedComps = updatedCompetenciesText
      ? updatedCompetenciesText.split(",").map((c) => c.trim()).filter(Boolean)
      : revisingJD.competencies;

    const updatedResps = updatedResponsibilitiesText
      ? updatedResponsibilitiesText.split("\n").map((r) => r.trim()).filter(Boolean)
      : revisingJD.responsibilities;

    const updatedJD: JobDescriptionRecord = {
      ...revisingJD,
      status: "For Revision",
      versionNo: nextVer,
      competencies: updatedComps,
      responsibilities: updatedResps,
      revisionHistory: [newRevLog, ...revisingJD.revisionHistory]
    };

    setJobDescriptions((prev) => prev.map((j) => (j.id === revisingJD.id ? updatedJD : j)));

    if (viewingJD && viewingJD.id === revisingJD.id) {
      setViewingJD(updatedJD);
    }

    setRevisingJD(null);
    setRevisionRemarks("");
    setUpdatedCompetenciesText("");
    setUpdatedResponsibilitiesText("");

    triggerStatusModal(
      "success",
      "Revision Remarks Saved",
      `Job Description "${updatedJD.roleTitle}" has been flagged as "For Revision" (${updatedJD.versionNo}) with your notes saved.`
    );
  };

  // Status Badge Styling Helper
  const renderStatusBadge = (status: JDStatus) => {
    switch (status) {
      case "Approved":
      case "Existing":
        return (
          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            {status}
          </span>
        );
      case "For Revision":
        return (
          <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1 border border-amber-200">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            For Revision
          </span>
        );
      case "New Job Description":
      case "For Approval":
        return (
          <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1 border border-blue-200">
            <Clock className="w-3 h-3 text-blue-600" />
            {status}
          </span>
        );
      case "Rejected":
        return (
          <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1 border border-red-200">
            <AlertCircle className="w-3 h-3 text-red-600" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2.5 py-1 rounded-full">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="w-full text-[#101828] select-none space-y-6 pb-12">
      {/* ==================== 1. HEADER & TOP ACTION BAR ==================== */}
      <div className="bg-white p-6 rounded-2xl border border-[#E6ECF2] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-[#042C51] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                <FileText className="w-3.5 h-3.5 text-[#FF5C28]" />
                Recruitment • Job Description
              </span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                JD Readiness Center
              </span>
            </div>
            <h1 className="text-2xl font-black text-[#042C51] tracking-tight">
              Job Description
            </h1>
            <p className="text-xs text-[#667085] leading-relaxed max-w-2xl">
              Manage JD readiness for Existing, For Revision, and New Job Description requirements.
            </p>
          </div>

          {/* Primary Action Button */}
          <div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2.5 bg-[#FF5C28] hover:bg-[#e04f20] text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Job Description</span>
            </button>
          </div>
        </div>
      </div>

      {/* ==================== 2. JOB DESCRIPTION SUMMARY (STAT CARDS) ==================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat Card 1: Total JD */}
        <div className="bg-white p-5 rounded-2xl border border-[#E6ECF2] shadow-sm hover:border-[#042C51]/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-[#667085] uppercase tracking-wider">
              Total JD
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#042C51] flex items-center justify-center">
              <ClipboardList className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-black text-[#042C51]">{stats.total}</span>
            <span className="text-[10px] font-bold text-slate-400">All Master JDs</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">All job descriptions in database</p>
        </div>

        {/* Stat Card 2: Existing */}
        <div className="bg-white p-5 rounded-2xl border border-[#E6ECF2] shadow-sm hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-[#667085] uppercase tracking-wider">
              Existing
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-black text-[#042C51]">{stats.existing}</span>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
              Ready / Approved
            </span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Ready or already available</p>
        </div>

        {/* Stat Card 3: For Revision */}
        <div className="bg-white p-5 rounded-2xl border border-[#E6ECF2] shadow-sm hover:border-amber-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-[#667085] uppercase tracking-wider">
              For Revision
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-black text-[#042C51]">{stats.revision}</span>
            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
              Action Required
            </span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Needs spec update or remarks</p>
        </div>

        {/* Stat Card 4: New Job Description */}
        <div className="bg-white p-5 rounded-2xl border border-[#E6ECF2] shadow-sm hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-[#667085] uppercase tracking-wider">
              New Job Description
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-black text-[#042C51]">{stats.newJd}</span>
            <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
              In Draft / Approval
            </span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">New or unlinked JD intake</p>
        </div>
      </div>

      {/* ==================== 3. CENTRALIZED FILTERS & SEARCH ==================== */}
      <CentralizedFilters
        title="Filter Job Description Records"
        resetLabel="Reset Filters"
        onReset={() => {
          setSearchTerm("");
          setDepartmentFilter("All Departments");
          setAccountFilter("All Accounts");
          setSupervisoryFilter("All Levels");
          setSelectedStatusTab("All");
        }}
        search={{
          label: "Search Job Descriptions",
          placeholder: "Search role title, doc title, department, or hiring need...",
          value: searchTerm,
          onChange: setSearchTerm
        }}
        selects={[
          {
            label: "Department",
            value: departmentFilter,
            onChange: setDepartmentFilter,
            options: [
              "All Departments",
              "Technical Support",
              "Operations",
              "Executive Tech",
              "Healthcare Ops",
              "Talent Acquisition",
              "Workforce Management"
            ]
          },
          {
            label: "Account",
            value: accountFilter,
            onChange: setAccountFilter,
            options: [
              "All Accounts",
              "Verizon Tech",
              "Comcast Support",
              "Internal HR Ops",
              "Aetna Health",
              "Global WFM"
            ]
          },
          {
            label: "Supervisory Level",
            value: supervisoryFilter,
            onChange: setSupervisoryFilter,
            options: ["All Levels", "Individual Contributor", "Team Lead", "Manager"]
          }
        ]}
      />

      {/* ==================== 4. STATUS TAB NAVIGATION & DATA TABLE ==================== */}
      <div className="bg-white rounded-2xl border border-[#E6ECF2] shadow-sm overflow-hidden">
        {/* Status Filter Tabs */}
        <div className="flex border-b border-[#E6ECF2] bg-[#F8FAFC] px-4 pt-3 overflow-x-auto">
          {[
            { key: "All", label: "All JDs", count: jobDescriptions.length },
            { key: "Existing", label: "Existing / Ready", count: stats.existing },
            { key: "For Revision", label: "For Revision", count: stats.revision },
            { key: "New Job Description", label: "New Job Description", count: stats.newJd },
            {
              key: "For Approval",
              label: "For Approval",
              count: jobDescriptions.filter((j) => j.status === "For Approval").length
            },
            {
              key: "Rejected",
              label: "Rejected",
              count: jobDescriptions.filter((j) => j.status === "Rejected").length
            }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedStatusTab(tab.key)}
              className={`px-4 py-3 text-xs font-black uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                selectedStatusTab === tab.key
                  ? "border-[#FF5C28] text-[#042C51] bg-white rounded-t-xl"
                  : "border-transparent text-slate-500 hover:text-[#042C51]"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  selectedStatusTab === tab.key
                    ? "bg-[#042C51] text-white"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* TABLE VIEW (DESKTOP) */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-[#E6ECF2] text-[10px] font-black text-[#667085] uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Role & Document Title</th>
                <th className="py-3.5 px-4">Department / Account</th>
                <th className="py-3.5 px-4">Linked Hiring Need</th>
                <th className="py-3.5 px-4">Supervisory Level</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Date & Version</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6ECF2] font-medium text-[#042C51]">
              {filteredJDs.map((jd) => (
                <tr key={jd.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-black text-xs text-[#042C51] flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-[#FF5C28]" />
                      <span>{jd.roleTitle}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      {jd.documentTitle}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-xs">{jd.department}</div>
                    <div className="text-[10px] text-slate-500">{jd.account}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-1 rounded-md">
                      {jd.linkedHiringNeed}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 text-xs font-semibold">
                    {jd.supervisoryLevel}
                  </td>
                  <td className="py-3.5 px-4">{renderStatusBadge(jd.status)}</td>
                  <td className="py-3.5 px-4">
                    <div className="text-xs font-bold text-[#042C51]">{jd.versionNo}</div>
                    <div className="text-[10px] text-slate-400">{jd.dateRequested}</div>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setViewingJD(jd)}
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-[#042C51] hover:text-white text-[#042C51] rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                        title="View Details"
                      >
                        <Eye className="w-3 h-3" />
                        <span>View</span>
                      </button>

                      <button
                        onClick={() => {
                          setRevisingJD(jd);
                          setUpdatedCompetenciesText(jd.competencies.join(", "));
                          setUpdatedResponsibilitiesText(jd.responsibilities.join("\n"));
                        }}
                        className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-600 hover:text-white text-amber-800 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                        title="Revise JD"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Revise</span>
                      </button>

                      <button
                        onClick={() => setEditingJD(jd)}
                        className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-800 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                        title="Edit Spec"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* CARD VIEW (MOBILE / TABLET) */}
        <div className="block lg:hidden p-4 space-y-3">
          {filteredJDs.map((jd) => (
            <div
              key={jd.id}
              className="p-4 rounded-xl border border-[#E6ECF2] bg-white space-y-3 shadow-2xs hover:border-[#FF5C28]/40 transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-black text-xs text-[#042C51] flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#FF5C28]" />
                    <span>{jd.roleTitle}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    {jd.documentTitle}
                  </div>
                </div>
                {renderStatusBadge(jd.status)}
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">Dept & Account</span>
                  <span className="font-bold text-[#042C51]">{jd.department}</span>
                  <span className="text-[#667085] block text-[10px]">{jd.account}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">Version & Date</span>
                  <span className="font-bold text-[#042C51]">{jd.versionNo}</span>
                  <span className="text-[#667085] block text-[10px]">{jd.dateRequested}</span>
                </div>
              </div>

              <div className="text-[10px] text-slate-600 font-medium">
                <span className="font-bold text-[#042C51]">Linked Req:</span> {jd.linkedHiringNeed}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setViewingJD(jd)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-[#042C51] hover:text-white text-[#042C51] rounded-lg text-xs font-bold cursor-pointer flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View
                </button>
                <button
                  onClick={() => {
                    setRevisingJD(jd);
                    setUpdatedCompetenciesText(jd.competencies.join(", "));
                    setUpdatedResponsibilitiesText(jd.responsibilities.join("\n"));
                  }}
                  className="px-3 py-1.5 bg-amber-50 text-amber-800 hover:bg-amber-600 hover:text-white rounded-lg text-xs font-bold cursor-pointer flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Revise
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredJDs.length === 0 && (
          <div className="p-12 text-center bg-slate-50">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-black text-[#042C51]">No Job Descriptions Found</p>
            <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
              No matching records found for search filter criteria or selected status tab.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedStatusTab("All");
                setDepartmentFilter("All Departments");
                setAccountFilter("All Accounts");
                setSupervisoryFilter("All Levels");
              }}
              className="mt-4 px-4 py-2 bg-[#042C51] text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              Reset Search & Filters
            </button>
          </div>
        )}
      </div>

      {/* ==================== 5. MODAL 1: ADD JOB DESCRIPTION MODAL ==================== */}
      <AddJobDescriptionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={(newRecord) => {
          setJobDescriptions((prev) => [newRecord, ...prev]);
        }}
        existingTemplates={jobDescriptions}
        triggerStatusModal={triggerStatusModal}
      />

      {/* ==================== 6. MODAL 2: VIEW JOB DESCRIPTION DETAILS / OFFICIAL PREVIEW MODAL ==================== */}
      <JobDescriptionPreviewModal
        isOpen={!!viewingJD}
        jd={viewingJD}
        onClose={() => setViewingJD(null)}
        onFlagForRevision={(jdToRevise) => {
          setViewingJD(null);
          setRevisingJD(jdToRevise);
          setUpdatedCompetenciesText(jdToRevise.competencies.join(", "));
          setUpdatedResponsibilitiesText(jdToRevise.responsibilities.join("\n"));
        }}
      />

      {/* ==================== 7. MODAL 3: REVISE JOB DESCRIPTION MODAL ==================== */}
      <AnimatePresence>
        {revisingJD && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#042C51]/80 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-[#E6ECF2] my-8 overflow-hidden text-[#101828]"
            >
              <div className="bg-[#042C51] text-white p-4 sm:p-5 flex items-center justify-between border-b border-[#063866]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 text-[#FF5C28] flex items-center justify-center shrink-0">
                    <Edit3 className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-white tracking-tight">Revise Job Description</h3>
                    <p className="text-[11px] text-slate-300 font-medium">
                      Submit requested revisions and updated specifications for {revisingJD.roleTitle}.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setRevisingJD(null)}
                  className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleRevisionSubmit} className="flex flex-col">
                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 font-medium">
                    Currently revising version <strong>{revisingJD.versionNo}</strong> for{" "}
                    <strong>{revisingJD.department}</strong> ({revisingJD.account}).
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#042C51] mb-1 uppercase tracking-wider">
                      Revision Remarks / Requested Changes <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Describe what needs to be updated (e.g. Added mandatory weekend shift supervision and B2+ English benchmark)..."
                      value={revisionRemarks}
                      onChange={(e) => setRevisionRemarks(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-[#042C51] outline-hidden resize-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#042C51] mb-1 uppercase tracking-wider">
                      Updated Competencies (Comma Separated)
                    </label>
                    <input
                      type="text"
                      value={updatedCompetenciesText}
                      onChange={(e) => setUpdatedCompetenciesText(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-[#042C51] outline-hidden transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#042C51] mb-1 uppercase tracking-wider">
                      Updated Core Responsibilities (One Per Line)
                    </label>
                    <textarea
                      rows={4}
                      value={updatedResponsibilitiesText}
                      onChange={(e) => setUpdatedResponsibilitiesText(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-[#042C51] outline-hidden resize-none transition-all"
                    />
                  </div>
                </div>

                <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setRevisingJD(null)}
                    className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#FF5C28] hover:bg-[#e04f20] text-white rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Submit Revision Request
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================== 8. MODAL 4: STATUS MODAL (GLOBAL FEEDBACK OVERLAY) ==================== */}
      <AnimatePresence>
        {statusModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#042C51]/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-[#E6ECF2] text-center space-y-4"
            >
              <div
                className={`w-12 h-12 rounded-2xl mx-auto flex items-center justify-center ${
                  statusModal.type === "success"
                    ? "bg-emerald-100 text-emerald-700"
                    : statusModal.type === "error"
                    ? "bg-red-100 text-red-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {statusModal.type === "success" && <CheckCircle2 className="w-6 h-6" />}
                {statusModal.type === "error" && <AlertCircle className="w-6 h-6" />}
                {statusModal.type === "info" && <Sparkles className="w-6 h-6" />}
              </div>

              <div>
                <h3 className="text-base font-black text-[#042C51]">{statusModal.title}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{statusModal.message}</p>
              </div>

              <button
                type="button"
                onClick={() => setStatusModal({ ...statusModal, isOpen: false })}
                className="w-full py-2.5 bg-[#042C51] hover:bg-[#FF5C28] text-white rounded-xl text-xs font-black cursor-pointer transition-all shadow-xs"
              >
                Acknowledge & Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================== EDIT SPEC MODAL (AUXILIARY) ==================== */}
      <AnimatePresence>
        {editingJD && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#042C51]/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-[#E6ECF2] overflow-hidden text-[#101828]"
            >
              <div className="bg-[#042C51] text-white p-4 sm:p-5 flex items-center justify-between border-b border-[#063866]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 text-[#FF5C28] flex items-center justify-center shrink-0">
                    <Edit3 className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-white tracking-tight">Edit Job Description Details</h3>
                    <p className="text-[11px] text-slate-300 font-medium">Update status, supervisory level, and target personality</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingJD(null)}
                  className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#042C51] mb-1 uppercase tracking-wider">Status</label>
                  <select
                    value={editingJD.status}
                    onChange={(e) => setEditingJD({ ...editingJD, status: e.target.value as JDStatus })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-[#042C51] outline-hidden transition-all"
                  >
                    <option value="Existing">Existing</option>
                    <option value="For Revision">For Revision</option>
                    <option value="New Job Description">New Job Description</option>
                    <option value="For Approval">For Approval</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#042C51] mb-1 uppercase tracking-wider">Supervisory Level</label>
                  <select
                    value={editingJD.supervisoryLevel}
                    onChange={(e) => setEditingJD({ ...editingJD, supervisoryLevel: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-[#042C51] outline-hidden transition-all"
                  >
                    <option value="Individual Contributor">Individual Contributor</option>
                    <option value="Team Lead">Team Lead</option>
                    <option value="Manager">Manager</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#042C51] mb-1 uppercase tracking-wider">Target Personality</label>
                  <input
                    type="text"
                    value={editingJD.targetPersonality}
                    onChange={(e) => setEditingJD({ ...editingJD, targetPersonality: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-[#042C51] outline-hidden transition-all"
                  />
                </div>
              </div>

              <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setEditingJD(null)}
                  className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setJobDescriptions((prev) =>
                      prev.map((j) => (j.id === editingJD.id ? editingJD : j))
                    );
                    setEditingJD(null);
                    triggerStatusModal(
                      "success",
                      "Job Description Updated",
                      `Updated settings and status for "${editingJD.roleTitle}".`
                    );
                  }}
                  className="px-5 py-2 bg-[#042C51] hover:bg-[#FF5C28] text-white rounded-xl text-xs font-black transition-all cursor-pointer shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
