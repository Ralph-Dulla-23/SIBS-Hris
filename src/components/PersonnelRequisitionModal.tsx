import React, { useState } from "react";
import {
  Briefcase,
  Users,
  ShieldCheck,
  RotateCcw,
  Save,
  X,
  Search,
  ChevronDown,
  Calendar,
  Clock,
  Check,
  FileText
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { INITIAL_AVAILABLE_POSITIONS } from "./AvailablePositions";

export interface RequisitionFormData {
  positionTitle: string;
  departmentAccount: string;
  requestType: "Requisition" | "Downsize";
  headcount: number | "";
  reason: string;
  assignment: string;
  location: string;
  dateNeeded: string;
  managerId: string;
  hiringManager: string;
  approvalStatus: string;
}

interface PersonnelRequisitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess?: (data: RequisitionFormData) => void;
  initialRequestType?: "Requisition" | "Downsize";
}

export default function PersonnelRequisitionModal({
  isOpen,
  onClose,
  onSubmitSuccess,
  initialRequestType = "Requisition"
}: PersonnelRequisitionModalProps) {
  // Form State
  const [requestType, setRequestType] = useState<"Requisition" | "Downsize">(initialRequestType);
  const [isRequestTypeDropdownOpen, setIsRequestTypeDropdownOpen] = useState(false);
  const [selectedPositionTitle, setSelectedPositionTitle] = useState("");
  const [departmentAccount, setDepartmentAccount] = useState("");
  const [headcount, setHeadcount] = useState<number | "">("");
  const [reason, setReason] = useState("");
  const [assignment, setAssignment] = useState("Probationary");
  const [location, setLocation] = useState("Davao Site");
  const [dateNeeded, setDateNeeded] = useState("");
  const [managerId] = useState("6496");
  const [hiringManager] = useState("CANITAN, CRISTER ALBERCA");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);

  // Position select handler
  const handleSelectPosition = (posTitle: string) => {
    setSelectedPositionTitle(posTitle);
    const found = INITIAL_AVAILABLE_POSITIONS.find(p => p.title === posTitle);
    if (found) {
      setDepartmentAccount(`${found.department} • ${found.account}`);
      if (found.location) {
        setLocation(found.location);
      }
    } else {
      setDepartmentAccount(posTitle ? "Operations / Active Campaign" : "");
    }
  };

  // Reset form to defaults
  const handleReset = () => {
    setRequestType("Requisition");
    setSelectedPositionTitle("");
    setDepartmentAccount("");
    setHeadcount("");
    setReason("");
    setAssignment("Probationary");
    setLocation("Davao Site");
    setDateNeeded("");
    setIsRequestTypeDropdownOpen(false);
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const submissionData: RequisitionFormData = {
      positionTitle: selectedPositionTitle || "Customer Service Representative",
      departmentAccount: departmentAccount || "Operations Support",
      requestType,
      headcount: headcount || 1,
      reason: reason || "Ramp-up",
      assignment,
      location,
      dateNeeded: dateNeeded || new Date().toISOString().split("T")[0],
      managerId,
      hiringManager,
      approvalStatus: "For Approval"
    };

    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccessBanner(true);
      if (onSubmitSuccess) {
        onSubmitSuccess(submissionData);
      }
      setTimeout(() => {
        setShowSuccessBanner(false);
        onClose();
      }, 1200);
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#042C51]/80 backdrop-blur-xs flex items-center justify-center z-50 p-3 sm:p-5 overflow-y-auto">
      <motion.div
        initial={{ scale: 0.96, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.96, opacity: 0, y: 15 }}
        transition={{ duration: 0.2 }}
        className="bg-[#F8FAFC] rounded-2xl shadow-2xl border border-slate-200/90 w-full max-w-4xl overflow-hidden flex flex-col my-auto max-h-[94vh]"
      >
        {/* ==================== MODAL TOP HEADER BAR (Matching Image 2 1:1) ==================== */}
        <div className="bg-[#042C51] text-white px-5 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white shrink-0">
              <FileText className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black tracking-tight text-white">
                  New Personnel Requisition
                </h2>
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wider ${
                  requestType === "Requisition"
                    ? "bg-[#FF5C28] text-white"
                    : "bg-rose-600 text-white"
                }`}>
                  {requestType}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium">
                Create a Requisition or Downsize request and route it for approval.
              </p>
            </div>
          </div>

          {/* Action Buttons: Reset, Submit for Approval, Close */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white text-xs font-bold transition-all cursor-pointer border border-white/10"
              title="Reset Form"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#FF5C28] hover:bg-[#e04b1c] text-white text-xs font-black transition-all shadow-sm cursor-pointer disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSubmitting ? "Submitting..." : "Submit for Approval"}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors ml-1 cursor-pointer"
              title="Close Dialog"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        {/* Success Alert Banner */}
        <AnimatePresence>
          {showSuccessBanner && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-emerald-600 text-white text-xs font-bold px-5 py-2.5 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Personnel Requisition successfully submitted and routed for approval!</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ==================== FORM BODY WITH 3 PRISTINE CARDS (Matching Image 2 1:1) ==================== */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
          {/* ========== CARD 1: REQUEST TYPE & POSITION ========== */}
          <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3.5">
            <div className="flex items-start gap-2.5">
              <div className="mt-0.5 text-orange-600">
                <Briefcase className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-xs font-black text-[#042C51] tracking-tight">
                  Request Type & Position
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  Link the request to an active Talent Pool position and retain its current JD, department, account, and site references.
                </p>
              </div>
            </div>

            {/* Department / Account */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                DEPARTMENT / ACCOUNT <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                readOnly
                value={departmentAccount || "Auto-populated after selecting position"}
                className="w-full px-3.5 py-2 rounded-lg bg-slate-100/90 border border-slate-200 text-xs font-medium text-slate-600 cursor-not-allowed select-none focus:outline-none"
              />
            </div>

            {/* Position Title & Request Type Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Position Title with Search Icon */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                  POSITION TITLE <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <select
                    value={selectedPositionTitle}
                    onChange={(e) => handleSelectPosition(e.target.value)}
                    className="w-full pl-8.5 pr-8 py-2 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#FF5C28] focus:ring-1 focus:ring-[#FF5C28] transition-colors appearance-none cursor-pointer"
                  >
                    <option value="">Select Position Title</option>
                    {INITIAL_AVAILABLE_POSITIONS.map((pos) => (
                      <option key={pos.id} value={pos.title}>
                        {pos.title} ({pos.location})
                      </option>
                    ))}
                    <option value="Customer Service Representative">Customer Service Representative (CSR)</option>
                    <option value="Technical Support Specialist">Technical Support Specialist</option>
                    <option value="Team Leader / Floor Supervisor">Team Leader / Floor Supervisor</option>
                    <option value="Quality Assurance Analyst">Quality Assurance Analyst</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Request Type Custom Dropdown matching Image 1 & 2 */}
              <div className="space-y-1 relative">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                  REQUEST TYPE <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsRequestTypeDropdownOpen((prev) => !prev)}
                  className="w-full px-3.5 py-2 rounded-lg bg-white border border-orange-500 ring-1 ring-orange-500 text-xs font-extrabold text-slate-800 flex items-center justify-between transition-all cursor-pointer shadow-2xs text-left"
                >
                  <span>{requestType}</span>
                  <ChevronDown className={`w-4 h-4 text-orange-600 transition-transform ${isRequestTypeDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Dropdown Menu matching Image 1 */}
                <AnimatePresence>
                  {isRequestTypeDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-30 overflow-hidden py-1"
                    >
                      <div className="px-3 py-1.5 text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-100">
                        Select Request Type
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setRequestType("Requisition");
                          setIsRequestTypeDropdownOpen(false);
                        }}
                        className={`w-full px-3 py-2 text-xs font-bold flex items-center justify-between text-left transition-colors cursor-pointer ${
                          requestType === "Requisition"
                            ? "bg-orange-50 text-orange-700"
                            : "text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <span>Requisition</span>
                        {requestType === "Requisition" && <Check className="w-3.5 h-3.5 text-orange-600" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setRequestType("Downsize");
                          setIsRequestTypeDropdownOpen(false);
                        }}
                        className={`w-full px-3 py-2 text-xs font-bold flex items-center justify-between text-left transition-colors cursor-pointer ${
                          requestType === "Downsize"
                            ? "bg-rose-50 text-rose-700"
                            : "text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <span>Downsize</span>
                        {requestType === "Downsize" && <Check className="w-3.5 h-3.5 text-rose-600" />}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* ========== CARD 2: PERSONNEL REQUIREMENT (Matching Image 2 1:1) ========== */}
          <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3.5">
            <div className="flex items-start gap-2.5">
              <div className="mt-0.5 text-orange-600">
                <Users className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-xs font-black text-[#042C51] tracking-tight">
                  Personnel Requirement
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  Define the requested slots, business reason, assignment, site, and target date.
                </p>
              </div>
            </div>

            {/* Row 1: Headcount, Reason for Hiring, Assignment */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Headcount */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                  HEADCOUNT <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min={1}
                  max={200}
                  placeholder="Enter requested headcount"
                  value={headcount}
                  onChange={(e) => setHeadcount(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#FF5C28] focus:ring-1 focus:ring-[#FF5C28] transition-colors"
                />
              </div>

              {/* Reason for Hiring */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                  REASON FOR HIRING <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#FF5C28] focus:ring-1 focus:ring-[#FF5C28] transition-colors appearance-none cursor-pointer"
                  >
                    <option value="">Select Reason</option>
                    <option value="Ramp-up">Ramp-up</option>
                    <option value="Backfill">Backfill</option>
                    <option value="New Position">New Position</option>
                    <option value="Forecasted Growth">Forecasted Growth</option>
                    <option value="Seasonal Expansion">Seasonal Expansion</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Assignment */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                  ASSIGNMENT <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={assignment}
                    onChange={(e) => setAssignment(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#FF5C28] focus:ring-1 focus:ring-[#FF5C28] transition-colors appearance-none cursor-pointer"
                  >
                    <option value="Probationary">Probationary</option>
                    <option value="Regular">Regular</option>
                    <option value="Project-Based">Project-Based</option>
                    <option value="Fixed Term">Fixed Term</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Row 2: Location / Site, Date Needed */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Location / Site */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                  LOCATION / SITE <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#FF5C28] focus:ring-1 focus:ring-[#FF5C28] transition-colors appearance-none cursor-pointer"
                  >
                    <option value="Davao Site">Davao Site</option>
                    <option value="Tagum HQ">Tagum HQ</option>
                    <option value="Mabini Campus">Mabini Campus</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Date Needed */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                  DATE NEEDED <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="date"
                    value={dateNeeded}
                    onChange={(e) => setDateNeeded(e.target.value)}
                    className="w-full pl-8.5 pr-3.5 py-2 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#FF5C28] focus:ring-1 focus:ring-[#FF5C28] transition-colors cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ========== CARD 3: REQUEST OWNERSHIP & APPROVAL (Matching Image 2 1:1) ========== */}
          <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3.5">
            <div className="flex items-start gap-2.5">
              <div className="mt-0.5 text-orange-600">
                <ShieldCheck className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-xs font-black text-[#042C51] tracking-tight">
                  Request Ownership & Approval
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  The request owner is derived from the logged-in user and the record will be routed for approval.
                </p>
              </div>
            </div>

            {/* SIBS ID Manager and Hiring Manager */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                  SIBS ID MANAGER <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  readOnly
                  value={managerId}
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-100/90 border border-slate-200 text-xs font-bold text-slate-700 cursor-not-allowed select-none focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                  HIRING MANAGER <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  readOnly
                  value={hiringManager}
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-100/90 border border-slate-200 text-xs font-bold text-slate-700 cursor-not-allowed select-none focus:outline-none"
                />
              </div>
            </div>

            {/* Approval Status Banner matching Image 2 */}
            <div className="space-y-1 pt-1">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                APPROVAL STATUS
              </label>
              <div className="bg-amber-50/70 border border-amber-300/80 rounded-xl p-3 flex items-center justify-between text-amber-900">
                <div>
                  <div className="text-xs font-black text-amber-800">
                    For Approval
                  </div>
                  <div className="text-[11px] text-amber-700 font-medium mt-0.5">
                    Submission routes this request through the configured approval workflow.
                  </div>
                </div>
                <Clock className="w-4.5 h-4.5 text-amber-600 shrink-0 ml-2" />
              </div>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
