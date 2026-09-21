import React, { useState, useEffect } from "react";
import {
  X,
  RotateCcw,
  Save,
  Info,
  Plus,
  Trash2,
  Bold,
  Italic,
  List,
  ListOrdered,
  Sparkles,
  CheckCircle2,
  FileText,
  Building2,
  Users,
  Briefcase,
  Calendar,
  UserCheck,
  Tag,
  ShieldAlert,
  ChevronDown,
  Layers,
  Award
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { JobDescriptionRecord, JDStatus } from "./JobDescriptionPage";

export interface CompetencyRow {
  id: string;
  title: string;
  description: string;
  proficiency: "Average" | "Proficient" | "Excellent";
}

interface AddJobDescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newJd: JobDescriptionRecord) => void;
  existingTemplates?: JobDescriptionRecord[];
  triggerStatusModal?: (type: "success" | "error" | "info", title: string, message: string) => void;
}

const ALL_MBTI_TYPES = [
  "INTJ", "ENTJ", "INFJ", "ENFP",
  "ESTJ", "ISTJ", "ENTP", "ENFJ",
  "ISFP", "ESFP", "ESFJ", "ISTP",
  "ISFJ", "INTP", "INFP", "ESTP"
];

const DEFAULT_COMPETENCIES: CompetencyRow[] = [
  {
    id: "comp-1",
    title: "B2+ CEFR English Fluency",
    description: "Ability to articulate complex solutions clearly via voice and chat without accent strain or grammatical errors.",
    proficiency: "Excellent"
  },
  {
    id: "comp-2",
    title: "Technical Troubleshooting & CRM Navigation",
    description: "Proficiency in diagnosing tier-1 network/software incidents using internal knowledge bases and Zendesk/Salesforce.",
    proficiency: "Proficient"
  },
  {
    id: "comp-3",
    title: "Empathy & Active Listening",
    description: "De-escalate frustrated users with warmth, patience, and professional composure during call spikes.",
    proficiency: "Proficient"
  }
];

export default function AddJobDescriptionModal({
  isOpen,
  onClose,
  onSave,
  existingTemplates = [],
  triggerStatusModal
}: AddJobDescriptionModalProps) {
  // --- STATE DECLARATIONS ---
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("NEW");
  
  // Section 1 State
  const [documentTitle, setDocumentTitle] = useState<string>("");
  const [roleTitle, setRoleTitle] = useState<string>("");
  const [account, setAccount] = useState<string>("Verizon Tech");
  const [department, setDepartment] = useState<string>("Technical Support");
  const [dateRequested, setDateRequested] = useState<string>(new Date().toISOString().split("T")[0]);
  const [requestedBy, setRequestedBy] = useState<string>("Alena Batacan (Operations Lead)");
  const [statusBadge, setStatusBadge] = useState<JDStatus>("New Job Description");

  // Section 2 State: Competencies
  const [competencies, setCompetencies] = useState<CompetencyRow[]>(DEFAULT_COMPETENCIES);

  // Section 3 State: Content & Details
  const [reportsTo, setReportsTo] = useState<string>("Operations Manager");
  const [isSupervisory, setIsSupervisory] = useState<boolean>(false);
  const [positionOverview, setPositionOverview] = useState<string>(
    "The Customer Support Representative is responsible for serving as the front-line contact for inbound user inquiries, maintaining high FCR and CSAT metrics while upholding SLA commitments."
  );
  const [dutiesResponsibilities, setDutiesResponsibilities] = useState<string>(
    "• Respond promptly and professionally to inbound customer calls and live chats.\n• Diagnose customer inquiries, troubleshoot network connectivity issues, and escalate complex tickets.\n• Maintain precise documentation in the CRM ticketing software for every interaction.\n• Meet or exceed weekly KPIs including Average Handling Time (AHT) and First Contact Resolution (FCR)."
  );
  const [qualificationsCharacteristics, setQualificationsCharacteristics] = useState<string>(
    "• Minimum 1 year of BPO or customer support experience in technical or telecom domains.\n• High school diploma or equivalent bachelor's degree.\n• Strong problem-solving aptitude with ability to multi-task across multiple monitor screens.\n• Flexible to work rotational night shifts, weekends, and holiday schedules."
  );
  const [selectedPersonalityTypes, setSelectedPersonalityTypes] = useState<string[]>(["ENFP", "ESTJ", "INFJ"]);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Auto-fill template values when selectedTemplateId changes
  useEffect(() => {
    if (selectedTemplateId === "NEW") {
      setStatusBadge("New Job Description");
    } else {
      const found = existingTemplates.find((t) => t.id === selectedTemplateId);
      if (found) {
        setRoleTitle(found.roleTitle);
        setDocumentTitle(found.documentTitle);
        setAccount(found.account);
        setDepartment(found.department);
        setStatusBadge("Existing");
        
        // Convert string competencies to rows
        if (found.competencies && found.competencies.length > 0) {
          setCompetencies(
            found.competencies.map((c, i) => ({
              id: `tmpl-comp-${i}`,
              title: c,
              description: `Key expectation for ${c} as mandated in ${found.roleTitle} specification.`,
              proficiency: i === 0 ? "Excellent" : "Proficient"
            }))
          );
        }

        if (found.responsibilities && found.responsibilities.length > 0) {
          setDutiesResponsibilities(found.responsibilities.map((r) => `• ${r}`).join("\n"));
        }

        if (found.targetPersonality) {
          setPositionOverview(`Master template for ${found.roleTitle}. Focus on candidate readiness and standard operational standards.`);
        }
      }
    }
  }, [selectedTemplateId, existingTemplates]);

  // RESET ALL FIELDS
  const handleReset = () => {
    setSelectedTemplateId("NEW");
    setDocumentTitle("");
    setRoleTitle("");
    setAccount("Verizon Tech");
    setDepartment("Technical Support");
    setDateRequested(new Date().toISOString().split("T")[0]);
    setRequestedBy("Alena Batacan (Operations Lead)");
    setStatusBadge("New Job Description");
    setCompetencies(DEFAULT_COMPETENCIES);
    setReportsTo("Operations Manager");
    setIsSupervisory(false);
    setPositionOverview(
      "The Customer Support Representative is responsible for serving as the front-line contact for inbound user inquiries, maintaining high FCR and CSAT metrics while upholding SLA commitments."
    );
    setDutiesResponsibilities(
      "• Respond promptly and professionally to inbound customer calls and live chats.\n• Diagnose customer inquiries, troubleshoot network connectivity issues, and escalate complex tickets.\n• Maintain precise documentation in the CRM ticketing software for every interaction.\n• Meet or exceed weekly KPIs including Average Handling Time (AHT) and First Contact Resolution (FCR)."
    );
    setQualificationsCharacteristics(
      "• Minimum 1 year of BPO or customer support experience in technical or telecom domains.\n• High school diploma or equivalent bachelor's degree.\n• Strong problem-solving aptitude with ability to multi-task across multiple monitor screens.\n• Flexible to work rotational night shifts, weekends, and holiday schedules."
    );
    setSelectedPersonalityTypes(["ENFP", "ESTJ", "INFJ"]);
  };

  // ADD COMPETENCY ROW
  const handleAddCompetencyRow = () => {
    const newRow: CompetencyRow = {
      id: `comp-${Date.now()}`,
      title: "",
      description: "",
      proficiency: "Proficient"
    };
    setCompetencies((prev) => [...prev, newRow]);
  };

  // DELETE COMPETENCY ROW
  const handleDeleteCompetencyRow = (id: string) => {
    setCompetencies((prev) => prev.filter((c) => c.id !== id));
  };

  // UPDATE COMPETENCY FIELD
  const handleUpdateCompetency = (id: string, field: keyof CompetencyRow, value: string) => {
    setCompetencies((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  // TOGGLE PERSONALITY TYPE
  const handleTogglePersonality = (mbti: string) => {
    setSelectedPersonalityTypes((prev) =>
      prev.includes(mbti) ? prev.filter((p) => p !== mbti) : [...prev, mbti]
    );
  };

  // SUBMIT HANDLER WITH BACKEND API / API PROXY CALL
  const handleSaveJobDescription = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!roleTitle.trim()) {
      if (triggerStatusModal) {
        triggerStatusModal("error", "Validation Error", "Please provide a valid Role Title for the job description.");
      }
      return;
    }

    if (!documentTitle.trim()) {
      if (triggerStatusModal) {
        triggerStatusModal("error", "Validation Error", "Please specify a Document Title filename (e.g. JD_Role_Name.pdf).");
      }
      return;
    }

    setIsSubmitting(true);

    const formattedDocumentTitle = documentTitle.endsWith(".pdf")
      ? documentTitle
      : `${documentTitle.trim().replace(/\s+/g, "_")}.pdf`;

    const competencyTitles = competencies
      .map((c) => c.title.trim())
      .filter(Boolean);

    const responsibilityLines = dutiesResponsibilities
      .split("\n")
      .map((line) => line.replace(/^[•\-\*\s]+/, "").trim())
      .filter(Boolean);

    const newRecord: JobDescriptionRecord = {
      id: `JD-2026-${Math.floor(100 + Math.random() * 900)}`,
      documentTitle: formattedDocumentTitle,
      roleTitle: roleTitle.trim(),
      department,
      account,
      linkedHiringNeed: selectedTemplateId !== "NEW" 
        ? `Linked Template: ${selectedTemplateId}` 
        : `REQ-2026-INTAKE (${department})`,
      supervisoryLevel: isSupervisory ? "Manager / Supervisor" : "Individual Contributor",
      status: selectedTemplateId !== "NEW" ? "Existing" : "New Job Description",
      dateRequested: dateRequested || new Date().toISOString().split("T")[0],
      versionNo: "v1.0",
      competencies: competencyTitles.length > 0 
        ? competencyTitles 
        : ["Communication", "Domain Knowledge", "Customer Service"],
      responsibilities: responsibilityLines.length > 0 
        ? responsibilityLines 
        : ["Execute primary role responsibilities per SLA benchmarks."],
      targetPersonality: selectedPersonalityTypes.length > 0 
        ? selectedPersonalityTypes.join(", ") 
        : "Adaptable, resilient, professional team player",
      revisionHistory: [
        {
          id: `REV-${Date.now()}`,
          date: new Date().toISOString().split("T")[0],
          author: requestedBy || "Operations / HR Administrator",
          version: "v1.0",
          remarks: `Initial creation via Add Job Description Modal. Reports to: ${reportsTo}.`
        }
      ]
    };

    try {
      // Simulate/Attempt Backend API Call to /api/recruitment/job-descriptions
      const response = await fetch("/api/recruitment/job-descriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRecord)
      }).catch(() => null);

      if (response && response.ok) {
        console.log("Job Description successfully posted to backend API");
      }
    } catch (err) {
      console.warn("Backend API endpoint not available; utilizing client store fallback.", err);
    } finally {
      setIsSubmitting(false);
      onSave(newRecord);
      if (triggerStatusModal) {
        triggerStatusModal(
          "success",
          "Job Description Saved",
          `The job description record for "${newRecord.roleTitle}" (${newRecord.documentTitle}) has been submitted and registered.`
        );
      }
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#042C51]/80 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-[#E6ECF2] my-6 flex flex-col max-h-[92vh] overflow-hidden text-[#101828]"
        >
          {/* ==================== 1. MODAL HEADER ==================== */}
          <div className="bg-[#042C51] text-white p-5 px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#063a6b] shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 text-[#FF5C28] flex items-center justify-center shadow-inner shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                  <span>Add Job Description</span>
                  <span className="text-[10px] bg-[#FF5C28] text-white font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Specification
                  </span>
                </h2>
                <p className="text-xs text-slate-300 leading-snug">
                  Create or update job description specifications for hiring requirements.
                </p>
              </div>
            </div>

            {/* Modal Header Actions */}
            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                type="button"
                onClick={handleReset}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-white/10"
                title="Reset all form fields to initial clean state"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-300" />
                <span>Reset</span>
              </button>

              <button
                type="button"
                onClick={handleSaveJobDescription}
                disabled={isSubmitting}
                className="px-4 py-1.5 bg-[#FF5C28] hover:bg-[#e04f20] active:scale-98 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer border border-orange-400/30 disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSubmitting ? "Saving..." : "Save Job Description"}</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-all cursor-pointer ml-1"
                title="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* SCROLLABLE MODAL BODY */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50/50">
            {/* ==================== 2. INFORMATION BANNER ==================== */}
            <div className="bg-gradient-to-r from-blue-50 via-indigo-50/40 to-slate-50 p-4 rounded-xl border border-blue-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <Info className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-black text-[#042C51] flex items-center gap-2">
                    <span>Contextual Specification Guide</span>
                    {selectedTemplateId === "NEW" ? (
                      <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-200">
                        New Spec Mode
                      </span>
                    ) : (
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                        Template Linked Mode
                      </span>
                    )}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {selectedTemplateId === "NEW"
                      ? "You are creating a new Job Description specification. Define competency standards, supervisory level, and core responsibilities for upcoming recruitment intake."
                      : "Linking to an existing Job Description template auto-populates approved operational benchmarks. Custom modifications will be stored as a new version."}
                  </p>
                </div>
              </div>

              <div className="shrink-0 self-end sm:self-center">
                {statusBadge === "Existing" || statusBadge === "Approved" ? (
                  <span className="bg-emerald-500 text-white text-[11px] font-black px-3 py-1 rounded-full inline-flex items-center gap-1.5 shadow-sm">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {statusBadge} Template
                  </span>
                ) : (
                  <span className="bg-[#042C51] text-white text-[11px] font-black px-3 py-1 rounded-full inline-flex items-center gap-1.5 shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 text-[#FF5C28]" />
                    {statusBadge}
                  </span>
                )}
              </div>
            </div>

            <form onSubmit={handleSaveJobDescription} className="space-y-6">
              {/* ==================== 3. SECTION 1: HIRING REQUIREMENT LINK ==================== */}
              <div className="bg-white p-5 rounded-2xl border border-[#E6ECF2] shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-xs font-black text-[#042C51] uppercase tracking-wider flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-[#FF5C28]" />
                    Section 1: Hiring Requirement & Template Link
                  </h3>
                  <span className="text-[10px] font-bold text-slate-400">Metadata & Linking</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Existing Job Description Dropdown */}
                  <div className="sm:col-span-2 lg:col-span-3">
                    <label className="block text-xs font-bold text-[#042C51] mb-1.5 flex items-center justify-between">
                      <span>Existing Job Description Template</span>
                      <span className="text-[10px] text-slate-400 font-normal">Select template or create new</span>
                    </label>
                    <select
                      value={selectedTemplateId}
                      onChange={(e) => setSelectedTemplateId(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-[#042C51] focus:ring-2 focus:ring-[#042C51]/10 outline-hidden transition-all cursor-pointer"
                    >
                      <option value="NEW">No Existing Job Description — New Job Description</option>
                      {existingTemplates.map((tmpl) => (
                        <option key={tmpl.id} value={tmpl.id}>
                          {tmpl.id} — {tmpl.roleTitle} ({tmpl.department} • {tmpl.account})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Document Title */}
                  <div>
                    <label className="block text-xs font-bold text-[#042C51] mb-1">
                      Document Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. JD_Senior_Support_v1.0.pdf"
                      value={documentTitle}
                      onChange={(e) => setDocumentTitle(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-[#042C51] outline-hidden transition-all"
                    />
                  </div>

                  {/* Role Title */}
                  <div>
                    <label className="block text-xs font-bold text-[#042C51] mb-1">
                      Role Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Senior Customer Support Representative"
                      value={roleTitle}
                      onChange={(e) => setRoleTitle(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-[#042C51] outline-hidden transition-all"
                    />
                  </div>

                  {/* Account / Client */}
                  <div>
                    <label className="block text-xs font-bold text-[#042C51] mb-1">Account / Client</label>
                    <select
                      value={account}
                      onChange={(e) => setAccount(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-[#042C51] outline-hidden cursor-pointer"
                    >
                      <option value="Verizon Tech">Verizon Tech</option>
                      <option value="Comcast Support">Comcast Support</option>
                      <option value="Aetna Health">Aetna Health</option>
                      <option value="Internal HR Ops">Internal HR Ops</option>
                      <option value="Global WFM">Global WFM</option>
                      <option value="Healthcare Solutions">Healthcare Solutions</option>
                      <option value="Financial Services">Financial Services</option>
                    </select>
                  </div>

                  {/* Department */}
                  <div>
                    <label className="block text-xs font-bold text-[#042C51] mb-1">Department</label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-[#042C51] outline-hidden cursor-pointer"
                    >
                      <option value="Technical Support">Technical Support</option>
                      <option value="Operations">Operations</option>
                      <option value="Executive Tech">Executive Tech</option>
                      <option value="Healthcare Ops">Healthcare Ops</option>
                      <option value="Talent Acquisition">Talent Acquisition</option>
                      <option value="Workforce Management">Workforce Management</option>
                      <option value="Finance & Billing">Finance & Billing</option>
                    </select>
                  </div>

                  {/* Date Requested */}
                  <div>
                    <label className="block text-xs font-bold text-[#042C51] mb-1">Date Requested</label>
                    <input
                      type="date"
                      value={dateRequested}
                      onChange={(e) => setDateRequested(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-[#042C51] outline-hidden"
                    />
                  </div>

                  {/* Prepared By / Requested By */}
                  <div>
                    <label className="block text-xs font-bold text-[#042C51] mb-1">Prepared By / Requested By</label>
                    <select
                      value={requestedBy}
                      onChange={(e) => setRequestedBy(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-[#042C51] outline-hidden cursor-pointer"
                    >
                      <option value="Alena Batacan (Operations Lead)">Alena Batacan (Operations Lead)</option>
                      <option value="Ralph Dulla (Super Admin)">Ralph Dulla (Super Admin)</option>
                      <option value="Sarah Jenkins (TA Lead)">Sarah Jenkins (TA Lead)</option>
                      <option value="Michael Chang (WFM Director)">Michael Chang (WFM Director)</option>
                      <option value="Department Operations Manager">Department Operations Manager</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* ==================== 4. SECTION 2: DESIRED COMPETENCIES TABLE ==================== */}
              <div className="bg-white p-5 rounded-2xl border border-[#E6ECF2] shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-xs font-black text-[#042C51] uppercase tracking-wider flex items-center gap-2">
                      <Award className="w-4 h-4 text-[#FF5C28]" />
                      Section 2: Desired Competencies & Capability Matrix
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Define required competencies, expectations, and benchmark proficiency levels.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddCompetencyRow}
                    className="px-3 py-1.5 bg-[#042C51] hover:bg-[#063866] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#FF5C28]" />
                    <span>Add Competency Row</span>
                  </button>
                </div>

                {/* Table Container */}
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left border-collapse min-w-[650px]">
                    <thead>
                      <tr className="bg-slate-100/80 text-[#042C51] text-[11px] font-black uppercase tracking-wider border-b border-slate-200">
                        <th className="p-3 w-1/3">Competency Title</th>
                        <th className="p-3 w-5/12">Description & Expectation</th>
                        <th className="p-3 w-1/5">Proficiency Level</th>
                        <th className="p-3 w-12 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {competencies.map((row) => (
                        <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-2.5">
                            <input
                              type="text"
                              placeholder="e.g. B2+ English Fluency"
                              value={row.title}
                              onChange={(e) => handleUpdateCompetency(row.id, "title", e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold focus:bg-white focus:border-[#042C51] outline-hidden"
                            />
                          </td>
                          <td className="p-2.5">
                            <input
                              type="text"
                              placeholder="e.g. Ability to articulate solutions clearly via phone..."
                              value={row.description}
                              onChange={(e) => handleUpdateCompetency(row.id, "description", e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:bg-white focus:border-[#042C51] outline-hidden"
                            />
                          </td>
                          <td className="p-2.5">
                            <select
                              value={row.proficiency}
                              onChange={(e) =>
                                handleUpdateCompetency(
                                  row.id,
                                  "proficiency",
                                  e.target.value as "Average" | "Proficient" | "Excellent"
                                )
                              }
                              className={`w-full px-2.5 py-1.5 border rounded-lg text-xs font-bold outline-hidden cursor-pointer ${
                                row.proficiency === "Excellent"
                                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                  : row.proficiency === "Proficient"
                                  ? "bg-blue-50 text-blue-800 border-blue-200"
                                  : "bg-slate-50 text-slate-700 border-slate-200"
                              }`}
                            >
                              <option value="Average">Average</option>
                              <option value="Proficient">Proficient</option>
                              <option value="Excellent">Excellent</option>
                            </select>
                          </td>
                          <td className="p-2.5 text-center">
                            <button
                              type="button"
                              onClick={() => handleDeleteCompetencyRow(row.id)}
                              className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                              title="Delete row"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}

                      {competencies.length === 0 && (
                        <tr>
                          <td colSpan={4} className="p-6 text-center text-slate-400 text-xs italic">
                            No competencies defined. Click "Add Competency Row" above to specify required skills.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ==================== 5. SECTION 3: JOB DESCRIPTION CONTENT ==================== */}
              <div className="bg-white p-5 rounded-2xl border border-[#E6ECF2] shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-xs font-black text-[#042C51] uppercase tracking-wider flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#FF5C28]" />
                    Section 3: Job Description Content & Specifications
                  </h3>
                  <span className="text-[10px] font-bold text-slate-400">Reporting & Content</span>
                </div>

                {/* Reporting Line & Supervisory Toggle */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/80 p-4 rounded-xl border border-slate-200">
                  {/* Reports To */}
                  <div>
                    <label className="block text-xs font-bold text-[#042C51] mb-1">
                      Reports To (Direct Reporting Line)
                    </label>
                    <select
                      value={reportsTo}
                      onChange={(e) => setReportsTo(e.target.value)}
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-[#042C51] focus:border-[#042C51] outline-hidden cursor-pointer"
                    >
                      <option value="Team Supervisor">Team Supervisor</option>
                      <option value="Operations Manager">Operations Manager</option>
                      <option value="Senior Operations Manager">Senior Operations Manager</option>
                      <option value="Department Head">Department Head</option>
                      <option value="HR Manager">HR Manager</option>
                    </select>
                  </div>

                  {/* Supervisory Switch Toggle */}
                  <div>
                    <label className="block text-xs font-bold text-[#042C51] mb-1">
                      Supervisory Role Responsibilities
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="inline-flex p-1 bg-slate-200/70 rounded-xl border border-slate-300 w-full sm:w-48">
                        <button
                          type="button"
                          onClick={() => setIsSupervisory(false)}
                          className={`flex-1 py-1.5 text-xs font-black rounded-lg transition-all cursor-pointer text-center ${
                            !isSupervisory
                              ? "bg-[#042C51] text-white shadow-xs"
                              : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          No (IC)
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsSupervisory(true)}
                          className={`flex-1 py-1.5 text-xs font-black rounded-lg transition-all cursor-pointer text-center ${
                            isSupervisory
                              ? "bg-[#FF5C28] text-white shadow-xs"
                              : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          Yes (Supervisor)
                        </button>
                      </div>
                      <span className="text-xs text-slate-500 font-medium">
                        {isSupervisory ? "Manages team members" : "Individual Contributor"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Position Overview (Rich Text Editor Mock) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-[#042C51]">Position Overview</label>
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-[#042C51]">
                      <button type="button" className="p-1 hover:bg-slate-200 rounded text-slate-700" title="Bold">
                        <Bold className="w-3 h-3" />
                      </button>
                      <button type="button" className="p-1 hover:bg-slate-200 rounded text-slate-700" title="Italic">
                        <Italic className="w-3 h-3" />
                      </button>
                      <button type="button" className="p-1 hover:bg-slate-200 rounded text-slate-700" title="Bullet List">
                        <List className="w-3 h-3" />
                      </button>
                      <button type="button" className="p-1 hover:bg-slate-200 rounded text-slate-700" title="Numbered List">
                        <ListOrdered className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <textarea
                    rows={3}
                    placeholder="Provide standard summary of overall position purpose and objective..."
                    value={positionOverview}
                    onChange={(e) => setPositionOverview(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-[#042C51] outline-hidden leading-relaxed resize-y"
                  />
                </div>

                {/* Duties & Responsibilities (Rich Text Editor Mock) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-[#042C51]">Duties & Responsibilities</label>
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-[#042C51]">
                      <button type="button" className="p-1 hover:bg-slate-200 rounded text-slate-700" title="Bold">
                        <Bold className="w-3 h-3" />
                      </button>
                      <button type="button" className="p-1 hover:bg-slate-200 rounded text-slate-700" title="Italic">
                        <Italic className="w-3 h-3" />
                      </button>
                      <button type="button" className="p-1 hover:bg-slate-200 rounded text-slate-700" title="Bullet List">
                        <List className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <textarea
                    rows={4}
                    placeholder="Enter key bullet points for responsibilities..."
                    value={dutiesResponsibilities}
                    onChange={(e) => setDutiesResponsibilities(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-[#042C51] outline-hidden leading-relaxed resize-y font-mono"
                  />
                </div>

                {/* Qualifications & Characteristics (Rich Text Editor Mock) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-[#042C51]">Qualifications & Characteristics</label>
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-[#042C51]">
                      <button type="button" className="p-1 hover:bg-slate-200 rounded text-slate-700" title="Bold">
                        <Bold className="w-3 h-3" />
                      </button>
                      <button type="button" className="p-1 hover:bg-slate-200 rounded text-slate-700" title="Italic">
                        <Italic className="w-3 h-3" />
                      </button>
                      <button type="button" className="p-1 hover:bg-slate-200 rounded text-slate-700" title="Bullet List">
                        <List className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <textarea
                    rows={4}
                    placeholder="Enter required experience, education, and soft skill qualifications..."
                    value={qualificationsCharacteristics}
                    onChange={(e) => setQualificationsCharacteristics(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-[#042C51] outline-hidden leading-relaxed resize-y font-mono"
                  />
                </div>

                {/* Preferred Personality Type (MBTI Selection Pills) */}
                <div>
                  <label className="block text-xs font-bold text-[#042C51] mb-1.5 flex items-center justify-between">
                    <span>Preferred Personality Type (MBTI Multi-Select)</span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      Selected: {selectedPersonalityTypes.join(", ") || "None"}
                    </span>
                  </label>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-wrap gap-1.5">
                    {ALL_MBTI_TYPES.map((mbti) => {
                      const isSelected = selectedPersonalityTypes.includes(mbti);
                      return (
                        <button
                          key={mbti}
                          type="button"
                          onClick={() => handleTogglePersonality(mbti)}
                          className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                            isSelected
                              ? "bg-[#042C51] text-white shadow-xs border border-[#042C51]"
                              : "bg-white text-slate-600 border border-slate-200 hover:border-[#042C51]/40 hover:bg-slate-100"
                          }`}
                        >
                          {mbti}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* MODAL FOOTER */}
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-[11px] text-slate-400">
                  Clicking <strong>Save Job Description</strong> registers the specification and queues it for operational recruitment intake.
                </p>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Reset Form
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 bg-[#FF5C28] hover:bg-[#e04f20] text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSubmitting ? "Saving Record..." : "Save Job Description"}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
