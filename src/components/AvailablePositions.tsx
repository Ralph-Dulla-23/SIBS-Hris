import React, { useState, useMemo } from "react";
import {
  Briefcase,
  Search,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter,
  CheckCircle,
  XCircle,
  X,
  Edit3,
  FileText,
  Building2,
  MapPin,
  ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import PositionDetailsModal, {
  AvailablePositionRecord,
  SAMPLE_APPROVED_JDS
} from "./PositionDetailsModal";

interface AvailablePositionsProps {
  userEmail?: string;
  onSwitchModule?: (module: string) => void;
}

// Initial Seed Data aligned directly with screenshot specifications
export const INITIAL_AVAILABLE_POSITIONS: AvailablePositionRecord[] = [
  {
    id: "POS-002",
    title: "FST TRAINER",
    department: "Training Management",
    account: "Foundation Skills Training",
    accountGhlName: "FST-Training-Davao",
    jdId: "JD-012",
    jdCode: "JD-012",
    jdRoleTitle: "FOUNDATIONAL SKILLS TRAINER",
    documentTitle: "JD_Foundational_Skills_Trainer_v2.0.pdf",
    isLinkedToJd: true,
    location: "Davao Site",
    status: "Active",
    approvalStatus: "Approved",
    skills: ["Training Delivery", "Curriculum Design", "Foundational Communication", "LMS Navigation"],
    description: "Conduct foundational skills training for new hire onboarding batches, measuring baseline communication and typing standards.",
    lastUpdated: "August 19, 2026",
    updatedBy: "6496"
  },
  {
    id: "POS-005",
    title: "SOFTWARE MANAGEMENT – FULL STACK DEVELOPER",
    department: "IT (Information and Communications Technology)",
    account: "Software Management",
    accountGhlName: "SIBS-DevOps-Davao",
    isLinkedToJd: false,
    location: "Davao Site",
    status: "Active",
    approvalStatus: "For Approval",
    skills: ["React", "TypeScript", "Node.js", "Cloud Run", "PostgreSQL"],
    description: "Full-stack software engineering position supporting internal HR and operational tool ecosystems.",
    lastUpdated: "August 19, 2026",
    updatedBy: "6496"
  },
  {
    id: "POS-001",
    title: "FULL STACK DEVELOPER",
    department: "IT (Information and Communications Technology)",
    account: "Software Management",
    accountGhlName: "SIBS-Core-IT",
    isLinkedToJd: false,
    location: "Davao Site",
    status: "Active",
    approvalStatus: "Approved",
    skills: ["React", "Tailwind CSS", "API Architecture", "Docker"],
    description: "Responsible for core frontend architecture, user experience design, and backend REST APIs.",
    lastUpdated: "August 19, 2026",
    updatedBy: "6496"
  },
  {
    id: "POS-003",
    title: "FRAUD & DISPUTES SPECIALIST",
    department: "Financial Services Group",
    account: "Chase Credit",
    accountGhlName: "Chase-Financial-Tagum",
    jdId: "JD-FIN-01",
    jdCode: "JD-FIN-FRD-01",
    jdRoleTitle: "FRAUD INVESTIGATOR & DISPUTES ANALYST",
    documentTitle: "Chase_Consumer_Protection_Standard_v1.0.pdf",
    isLinkedToJd: true,
    location: "Tagum Site",
    status: "Active",
    approvalStatus: "Approved",
    skills: ["Chargeback Resolution", "Risk Analytics", "KYC / AML Compliance"],
    description: "Investigate contested credit card charges and execute standard operating chargeback procedures.",
    lastUpdated: "August 18, 2026",
    updatedBy: "6496"
  },
  {
    id: "POS-004",
    title: "HEALTHCARE VERIFICATION AGENT",
    department: "Healthcare & Insurance",
    account: "UnitedHealth VIP",
    accountGhlName: "UHP-VIP-Care",
    jdId: "JD-2026-004",
    jdCode: "JD-HC-CLM-03",
    jdRoleTitle: "HEALTHCARE BILLING REPRESENTATIVE",
    documentTitle: "JD_Healthcare_Billing_Agent_v1.4.pdf",
    isLinkedToJd: true,
    location: "Tagum Site",
    status: "Active",
    approvalStatus: "Approved",
    skills: ["HIPAA Standards", "Medical Verification", "Prior Authorization"],
    description: "Verify patient insurance benefits and reconcile billing claims with insurance providers.",
    lastUpdated: "August 17, 2026",
    updatedBy: "6496"
  },
  {
    id: "POS-006",
    title: "TECHNICAL SUPPORT REPRESENTATIVE (CSR)",
    department: "Telecom & Tech Support",
    account: "Comcast Technical",
    accountGhlName: "Comcast-Voice-Davao",
    jdId: "JD-2026-001",
    jdCode: "JD-CSR-TEL-04",
    jdRoleTitle: "CUSTOMER SUPPORT SPECIALIST",
    documentTitle: "Comcast_Tier1_CSR_Guideline_v2.1.pdf",
    isLinkedToJd: true,
    location: "Davao Site",
    status: "Active",
    approvalStatus: "Approved",
    skills: ["Troubleshooting", "Active Listening", "Zendesk CRM", "FCR Optimization"],
    description: "Provide tier-1 voice and chat technical assistance for broadband internet, modem, and TV cable inquiries.",
    lastUpdated: "August 16, 2026",
    updatedBy: "6496"
  }
];

type NavTabType =
  | "ALL POSITIONS"
  | "FOR APPROVAL"
  | "ACTIVE"
  | "INACTIVE"
  | "APPROVED"
  | "REJECTED"
  | "ARCHIVED"
  | "UNLINKED FROM JOB DESCRIPTIONS";

export default function AvailablePositions({ userEmail, onSwitchModule }: AvailablePositionsProps) {
  // State
  const [positions, setPositions] = useState<AvailablePositionRecord[]>(INITIAL_AVAILABLE_POSITIONS);
  const [activeTab, setActiveTab] = useState<NavTabType>("ALL POSITIONS");

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [departmentFilter, setDepartmentFilter] = useState("All Departments");
  const [accountFilter, setAccountFilter] = useState("All Accounts");
  const [locationFilter, setLocationFilter] = useState("All Locations");

  // Modal State
  const [selectedPosition, setSelectedPosition] = useState<AvailablePositionRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Compute Badge Counts for Tabs
  const forApprovalCount = useMemo(
    () => positions.filter((p) => p.approvalStatus === "For Approval").length,
    [positions]
  );

  const unlinkedCount = useMemo(
    () => positions.filter((p) => !p.isLinkedToJd).length,
    [positions]
  );

  // Synchronize Tab selection with Status Filter dropdown
  const handleTabChange = (tab: NavTabType) => {
    setActiveTab(tab);
    if (tab === "ALL POSITIONS") {
      setStatusFilter("All Statuses");
    } else if (tab === "FOR APPROVAL") {
      setStatusFilter("For Approval");
    } else if (tab === "ACTIVE") {
      setStatusFilter("Active");
    } else if (tab === "INACTIVE") {
      setStatusFilter("Inactive");
    } else if (tab === "APPROVED") {
      setStatusFilter("Approved");
    } else if (tab === "REJECTED") {
      setStatusFilter("Rejected");
    } else if (tab === "ARCHIVED") {
      setStatusFilter("Archived");
    } else if (tab === "UNLINKED FROM JOB DESCRIPTIONS") {
      setStatusFilter("Unlinked from JD");
    }
  };

  // Synchronize Dropdown change with Tab
  const handleStatusFilterChange = (val: string) => {
    setStatusFilter(val);
    if (val === "All Statuses") setActiveTab("ALL POSITIONS");
    else if (val === "For Approval") setActiveTab("FOR APPROVAL");
    else if (val === "Active") setActiveTab("ACTIVE");
    else if (val === "Inactive") setActiveTab("INACTIVE");
    else if (val === "Approved") setActiveTab("APPROVED");
    else if (val === "Rejected") setActiveTab("REJECTED");
    else if (val === "Archived") setActiveTab("ARCHIVED");
    else if (val === "Unlinked from JD") setActiveTab("UNLINKED FROM JOB DESCRIPTIONS");
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("All Statuses");
    setDepartmentFilter("All Departments");
    setAccountFilter("All Accounts");
    setLocationFilter("All Locations");
    setActiveTab("ALL POSITIONS");
    triggerToast("All directory filters have been reset.");
  };

  // Extract unique departments and accounts for dropdowns
  const uniqueDepartments = useMemo(() => {
    const set = new Set(positions.map((p) => p.department));
    return Array.from(set);
  }, [positions]);

  const uniqueAccounts = useMemo(() => {
    const set = new Set(positions.map((p) => p.account));
    return Array.from(set);
  }, [positions]);

  const uniqueLocations = useMemo(() => {
    const set = new Set(positions.map((p) => p.location));
    return Array.from(set);
  }, [positions]);

  // Filter logic
  const filteredPositions = useMemo(() => {
    return positions.filter((pos) => {
      // Search matching
      const q = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !q ||
        pos.id.toLowerCase().includes(q) ||
        pos.title.toLowerCase().includes(q) ||
        pos.department.toLowerCase().includes(q) ||
        pos.account.toLowerCase().includes(q) ||
        (pos.jdCode && pos.jdCode.toLowerCase().includes(q)) ||
        (pos.jdRoleTitle && pos.jdRoleTitle.toLowerCase().includes(q)) ||
        pos.skills.some((s) => s.toLowerCase().includes(q));

      // Tab / Status filter matching
      let matchesStatus = true;
      if (activeTab === "FOR APPROVAL" || statusFilter === "For Approval") {
        matchesStatus = pos.approvalStatus === "For Approval";
      } else if (activeTab === "ACTIVE" || statusFilter === "Active") {
        matchesStatus = pos.status === "Active";
      } else if (activeTab === "INACTIVE" || statusFilter === "Inactive") {
        matchesStatus = pos.status === "Inactive";
      } else if (activeTab === "APPROVED" || statusFilter === "Approved") {
        matchesStatus = pos.approvalStatus === "Approved";
      } else if (activeTab === "REJECTED" || statusFilter === "Rejected") {
        matchesStatus = pos.approvalStatus === "Rejected";
      } else if (activeTab === "ARCHIVED" || statusFilter === "Archived") {
        matchesStatus = pos.approvalStatus === "Archived";
      } else if (activeTab === "UNLINKED FROM JOB DESCRIPTIONS" || statusFilter === "Unlinked from JD") {
        matchesStatus = !pos.isLinkedToJd;
      }

      // Department filter
      const matchesDept = departmentFilter === "All Departments" || pos.department === departmentFilter;

      // Account filter
      const matchesAccount = accountFilter === "All Accounts" || pos.account === accountFilter;

      // Location filter
      const matchesLocation = locationFilter === "All Locations" || pos.location === locationFilter;

      return matchesSearch && matchesStatus && matchesDept && matchesAccount && matchesLocation;
    });
  }, [positions, searchTerm, activeTab, statusFilter, departmentFilter, accountFilter, locationFilter]);

  // Modal Handlers
  const handleRowClick = (pos: AvailablePositionRecord) => {
    setSelectedPosition(pos);
    setIsModalOpen(true);
  };

  const handleApprovePosition = (pos: AvailablePositionRecord) => {
    const updated = positions.map((p) =>
      p.id === pos.id
        ? { ...p, approvalStatus: "Approved" as const, lastUpdated: "August 19, 2026", updatedBy: "6496" }
        : p
    );
    setPositions(updated);
    if (selectedPosition && selectedPosition.id === pos.id) {
      setSelectedPosition({ ...selectedPosition, approvalStatus: "Approved" });
    }
    triggerToast(`Position "${pos.title}" (${pos.id}) has been Approved.`);
  };

  const handleRejectPosition = (pos: AvailablePositionRecord) => {
    const updated = positions.map((p) =>
      p.id === pos.id
        ? { ...p, approvalStatus: "Rejected" as const, lastUpdated: "August 19, 2026", updatedBy: "6496" }
        : p
    );
    setPositions(updated);
    if (selectedPosition && selectedPosition.id === pos.id) {
      setSelectedPosition({ ...selectedPosition, approvalStatus: "Rejected" });
    }
    triggerToast(`Position "${pos.title}" (${pos.id}) has been Rejected.`);
  };

  const handleSavePosition = (updatedPos: AvailablePositionRecord) => {
    const updated = positions.map((p) => (p.id === updatedPos.id ? updatedPos : p));
    setPositions(updated);
    setSelectedPosition(updatedPos);
    triggerToast(`Position "${updatedPos.title}" (${updatedPos.id}) saved successfully.`);
  };

  return (
    <div className="flex-1 flex flex-col space-y-4 select-none pb-12" id="available-positions-view">
      {/* Dynamic Toast feedback */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 right-6 bg-[#042C51] border-l-4 border-[#FF5C28] text-white px-5 py-3 rounded-r-xl shadow-2xl z-50 flex items-center gap-3 text-xs font-semibold"
          >
            <CheckCircle2 className="w-4 h-4 text-[#FF5C28]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtitle / Prompt description */}
      <p className="text-xs text-slate-500 font-medium pl-1">
        Search and filter positions by title, department, account, status, and site.
      </p>

      {/* ==================== 1. FILTER BAR (Matches Images 1, 2, 3) ==================== */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          {/* Search */}
          <div className="md:col-span-4 space-y-1">
            <label className="block text-xs font-bold text-slate-800">Search</label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search position, JD, department, account, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50/60 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-[#042C51] focus:ring-2 focus:ring-[#042C51]/10 outline-none transition-all"
              />
            </div>
          </div>

          {/* Status Dropdown */}
          <div className="md:col-span-2 space-y-1">
            <label className="block text-xs font-bold text-slate-800">Status</label>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => handleStatusFilterChange(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50/60 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:border-[#042C51] outline-none transition-all appearance-none cursor-pointer pr-8"
              >
                <option value="All Statuses">All Statuses</option>
                <option value="For Approval">For Approval</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="Archived">Archived</option>
                <option value="Unlinked from JD">Unlinked from JD</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
            </div>
          </div>

          {/* Department Dropdown */}
          <div className="md:col-span-2 space-y-1">
            <label className="block text-xs font-bold text-slate-800">Department</label>
            <div className="relative">
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50/60 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:border-[#042C51] outline-none transition-all appearance-none cursor-pointer pr-8"
              >
                <option value="All Departments">All Departments</option>
                {uniqueDepartments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
            </div>
          </div>

          {/* Account Dropdown */}
          <div className="md:col-span-2 space-y-1">
            <label className="block text-xs font-bold text-slate-800">Account</label>
            <div className="relative">
              <select
                value={accountFilter}
                onChange={(e) => setAccountFilter(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50/60 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:border-[#042C51] outline-none transition-all appearance-none cursor-pointer pr-8"
              >
                <option value="All Accounts">All Accounts</option>
                {uniqueAccounts.map((acc) => (
                  <option key={acc} value={acc}>
                    {acc}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
            </div>
          </div>

          {/* Location Dropdown */}
          <div className="md:col-span-2 space-y-1 flex items-end gap-2">
            <div className="flex-1 space-y-1">
              <label className="block text-xs font-bold text-slate-800">Location</label>
              <div className="relative">
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50/60 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:border-[#042C51] outline-none transition-all appearance-none cursor-pointer pr-8"
                >
                  <option value="All Locations">All Locations</option>
                  {uniqueLocations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
              </div>
            </div>

            {/* Clear Button */}
            <button
              type="button"
              onClick={handleClearFilters}
              className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 shadow-2xs"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        </div>
      </div>

      {/* ==================== 2. MAIN TABLE CONTAINER WITH STATUS TABS ==================== */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        {/* Navigation Tabs (Images 1, 2, 3) */}
        <div className="px-4 pt-3 border-b border-slate-200 overflow-x-auto flex items-center gap-1 sm:gap-2 no-scrollbar bg-slate-50/40">
          {/* ALL POSITIONS */}
          <button
            type="button"
            onClick={() => handleTabChange("ALL POSITIONS")}
            className={`px-4 py-2.5 text-xs font-black tracking-wide uppercase transition-all relative whitespace-nowrap cursor-pointer ${
              activeTab === "ALL POSITIONS"
                ? "text-[#042C51] bg-white rounded-t-xl border-t border-x border-slate-200 -mb-px font-black shadow-2xs"
                : "text-slate-500 hover:text-slate-800 font-bold"
            }`}
          >
            <span>ALL POSITIONS</span>
            {activeTab === "ALL POSITIONS" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF5C28]" />
            )}
          </button>

          {/* FOR APPROVAL */}
          <button
            type="button"
            onClick={() => handleTabChange("FOR APPROVAL")}
            className={`px-4 py-2.5 text-xs font-black tracking-wide uppercase transition-all relative whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === "FOR APPROVAL"
                ? "text-[#042C51] bg-white rounded-t-xl border-t border-x border-slate-200 -mb-px font-black shadow-2xs"
                : "text-slate-500 hover:text-slate-800 font-bold"
            }`}
          >
            <span>FOR APPROVAL</span>
            {forApprovalCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-black flex items-center justify-center">
                {forApprovalCount}
              </span>
            )}
            {activeTab === "FOR APPROVAL" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF5C28]" />
            )}
          </button>

          {/* ACTIVE */}
          <button
            type="button"
            onClick={() => handleTabChange("ACTIVE")}
            className={`px-4 py-2.5 text-xs font-black tracking-wide uppercase transition-all relative whitespace-nowrap cursor-pointer ${
              activeTab === "ACTIVE"
                ? "text-[#042C51] bg-white rounded-t-xl border-t border-x border-slate-200 -mb-px font-black shadow-2xs"
                : "text-slate-500 hover:text-slate-800 font-bold"
            }`}
          >
            <span>ACTIVE</span>
            {activeTab === "ACTIVE" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF5C28]" />
            )}
          </button>

          {/* INACTIVE */}
          <button
            type="button"
            onClick={() => handleTabChange("INACTIVE")}
            className={`px-4 py-2.5 text-xs font-black tracking-wide uppercase transition-all relative whitespace-nowrap cursor-pointer ${
              activeTab === "INACTIVE"
                ? "text-[#042C51] bg-white rounded-t-xl border-t border-x border-slate-200 -mb-px font-black shadow-2xs"
                : "text-slate-500 hover:text-slate-800 font-bold"
            }`}
          >
            <span>INACTIVE</span>
            {activeTab === "INACTIVE" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF5C28]" />
            )}
          </button>

          {/* APPROVED */}
          <button
            type="button"
            onClick={() => handleTabChange("APPROVED")}
            className={`px-4 py-2.5 text-xs font-black tracking-wide uppercase transition-all relative whitespace-nowrap cursor-pointer ${
              activeTab === "APPROVED"
                ? "text-[#042C51] bg-white rounded-t-xl border-t border-x border-slate-200 -mb-px font-black shadow-2xs"
                : "text-slate-500 hover:text-slate-800 font-bold"
            }`}
          >
            <span>APPROVED</span>
            {activeTab === "APPROVED" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF5C28]" />
            )}
          </button>

          {/* REJECTED */}
          <button
            type="button"
            onClick={() => handleTabChange("REJECTED")}
            className={`px-4 py-2.5 text-xs font-black tracking-wide uppercase transition-all relative whitespace-nowrap cursor-pointer ${
              activeTab === "REJECTED"
                ? "text-[#042C51] bg-white rounded-t-xl border-t border-x border-slate-200 -mb-px font-black shadow-2xs"
                : "text-slate-500 hover:text-slate-800 font-bold"
            }`}
          >
            <span>REJECTED</span>
            {activeTab === "REJECTED" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF5C28]" />
            )}
          </button>

          {/* ARCHIVED */}
          <button
            type="button"
            onClick={() => handleTabChange("ARCHIVED")}
            className={`px-4 py-2.5 text-xs font-black tracking-wide uppercase transition-all relative whitespace-nowrap cursor-pointer ${
              activeTab === "ARCHIVED"
                ? "text-[#042C51] bg-white rounded-t-xl border-t border-x border-slate-200 -mb-px font-black shadow-2xs"
                : "text-slate-500 hover:text-slate-800 font-bold"
            }`}
          >
            <span>ARCHIVED</span>
            {activeTab === "ARCHIVED" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF5C28]" />
            )}
          </button>

          {/* UNLINKED FROM JOB DESCRIPTIONS */}
          <button
            type="button"
            onClick={() => handleTabChange("UNLINKED FROM JOB DESCRIPTIONS")}
            className={`px-4 py-2.5 text-xs font-black tracking-wide uppercase transition-all relative whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === "UNLINKED FROM JOB DESCRIPTIONS"
                ? "text-[#042C51] bg-white rounded-t-xl border-t border-x border-slate-200 -mb-px font-black shadow-2xs"
                : "text-slate-500 hover:text-slate-800 font-bold"
            }`}
          >
            <span>UNLINKED FROM JOB DESCRIPTIONS</span>
            {unlinkedCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-black flex items-center justify-center">
                {unlinkedCount}
              </span>
            )}
            {activeTab === "UNLINKED FROM JOB DESCRIPTIONS" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF5C28]" />
            )}
          </button>
        </div>

        {/* Data Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/60 text-[11px] font-black text-slate-700 uppercase tracking-wider">
                <th className="py-3 px-4">POSITION ID</th>
                <th className="py-3 px-4">POSITION & MAPPING</th>
                <th className="py-3 px-4">LINKED JD MANUAL</th>
                <th className="py-3 px-4">LOCATION</th>
                <th className="py-3 px-4 text-center">STATUS</th>
                <th className="py-3 px-4 text-center">APPROVAL STATUS</th>
                <th className="py-3 px-4 text-center">JD LINK STATUS</th>
                <th className="py-3 px-4">LAST UPDATED</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPositions.length > 0 ? (
                filteredPositions.map((pos) => (
                  <tr
                    key={pos.id}
                    onClick={() => handleRowClick(pos)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    {/* 1. POSITION ID */}
                    <td className="py-4 px-4 font-mono">
                      <span className="px-2.5 py-1 bg-slate-100 group-hover:bg-blue-50 group-hover:text-blue-700 group-hover:border-blue-200 border border-slate-200 rounded-lg text-xs font-black text-[#042C51] transition-colors">
                        {pos.id}
                      </span>
                    </td>

                    {/* 2. POSITION & MAPPING */}
                    <td className="py-4 px-4">
                      <div className="space-y-0.5">
                        <div className="text-xs font-black text-[#042C51] group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                          {pos.title}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {pos.department}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {pos.account}
                        </div>
                      </div>
                    </td>

                    {/* 3. LINKED JD MANUAL */}
                    <td className="py-4 px-4">
                      {pos.isLinkedToJd ? (
                        <div className="space-y-0.5">
                          <div className="text-xs font-black text-[#042C51] uppercase tracking-tight">
                            {pos.jdRoleTitle || pos.title}
                          </div>
                          <div className="text-[10px] font-mono text-slate-400">
                            {pos.jdCode || pos.jdId}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-0.5 text-slate-400 font-bold">
                          <div>—</div>
                          <div className="text-[10px] font-mono">—</div>
                        </div>
                      )}
                    </td>

                    {/* 4. LOCATION */}
                    <td className="py-4 px-4 text-xs font-medium text-slate-700">
                      {pos.location}
                    </td>

                    {/* 5. STATUS */}
                    <td className="py-4 px-4 text-center">
                      <span
                        className={`inline-block px-3 py-0.5 rounded-full text-xs font-bold ${
                          pos.status === "Active"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-300"
                            : "bg-slate-100 text-slate-600 border border-slate-300"
                        }`}
                      >
                        {pos.status}
                      </span>
                    </td>

                    {/* 6. APPROVAL STATUS */}
                    <td className="py-4 px-4 text-center">
                      <span
                        className={`inline-block px-3 py-0.5 rounded-full text-xs font-bold ${
                          pos.approvalStatus === "Approved"
                            ? "bg-emerald-50/60 text-emerald-700 border border-emerald-300"
                            : pos.approvalStatus === "For Approval"
                            ? "bg-amber-50/80 text-amber-700 border border-amber-300"
                            : pos.approvalStatus === "Rejected"
                            ? "bg-red-50 text-red-700 border border-red-300"
                            : "bg-slate-100 text-slate-700 border border-slate-300"
                        }`}
                      >
                        {pos.approvalStatus}
                      </span>
                    </td>

                    {/* 7. JD LINK STATUS */}
                    <td className="py-4 px-4 text-center">
                      {pos.isLinkedToJd ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-300">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Linked</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                          <span>Unlinked from JD</span>
                        </span>
                      )}
                    </td>

                    {/* 8. LAST UPDATED */}
                    <td className="py-4 px-4">
                      <div className="text-xs font-bold text-slate-800">
                        {pos.lastUpdated}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        By: {pos.updatedBy}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 px-4 text-center text-slate-400">
                    <div className="max-w-md mx-auto space-y-2">
                      <Briefcase className="w-8 h-8 text-slate-300 mx-auto" />
                      <p className="text-sm font-bold text-slate-600">
                        No positions found in this tab
                      </p>
                      <p className="text-xs text-slate-400">
                        Try resetting your search query or adjusting your status filters.
                      </p>
                      <button
                        type="button"
                        onClick={handleClearFilters}
                        className="mt-2 px-3 py-1.5 bg-[#042C51] text-white rounded-lg text-xs font-bold cursor-pointer"
                      >
                        Reset Filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ==================== 3. PAGINATION FOOTER (Images 1, 2, 3) ==================== */}
        <div className="bg-white border-t border-slate-200 px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div>
            Showing <strong className="text-[#042C51]">{filteredPositions.length}</strong> loaded position{filteredPositions.length === 1 ? "" : "s"} out of <strong className="text-[#042C51]">{filteredPositions.length}</strong>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled
              className="px-3 py-1.5 bg-white text-slate-400 border border-slate-200 rounded-xl text-xs font-bold cursor-not-allowed flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            <button
              type="button"
              className="w-8 h-8 rounded-xl bg-[#FF5C28] text-white font-black text-xs flex items-center justify-center shadow-2xs"
            >
              1
            </button>

            <button
              type="button"
              disabled
              className="px-3 py-1.5 bg-white text-slate-400 border border-slate-200 rounded-xl text-xs font-bold cursor-not-allowed flex items-center gap-1"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ==================== 4. DETAILS / VIEW / EDIT MODAL ==================== */}
      <PositionDetailsModal
        isOpen={isModalOpen}
        position={selectedPosition}
        onClose={() => setIsModalOpen(false)}
        onApprove={handleApprovePosition}
        onReject={handleRejectPosition}
        onSave={handleSavePosition}
      />
    </div>
  );
}
