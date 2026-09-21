import React, { useState, useMemo } from "react";
import CentralizedFilters from "./CentralizedFilters";
import {
  Users,
  User,
  UserX,
  Calendar,
  Briefcase,
  Clock,
  Search,
  SlidersHorizontal,
  X,
  ChevronRight,
  Info,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Plus,
  RefreshCw,
  FileText,
  Check,
  Trash2,
  Paperclip,
  ShieldAlert,
  Eye,
  Edit2,
  XCircle,
  CheckCircle2,
  Filter
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ResignationManagementModal from "./ResignationManagementModal";
import ResignationModal from "./ResignationModal";
import { ResignationRecord, ResignationStatus } from "../types";

interface ResignationManagementProps {
  userEmail?: string;
  resignations: ResignationRecord[];
  onAddResignation: (record: Partial<ResignationRecord>) => void;
  onUpdateResignation: (id: string, updatedRecord: Partial<ResignationRecord>) => void;
  onSwitchModule?: (module: string) => void;
}

export default function ResignationManagement({
  userEmail = "dulla13ralph@gmail.com",
  resignations,
  onAddResignation,
  onUpdateResignation,
  onSwitchModule
}: ResignationManagementProps) {
  // --- STATE ---
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  
  // Selected resignation for HR / Manager action modal
  const [selectedResignation, setSelectedResignation] = useState<ResignationRecord | null>(null);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);

  // File on behalf modal
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Role simulation toggle
  const [roleContext, setRoleContext] = useState<"HR Admin" | "Operations Manager" | "Team Leader">("HR Admin");

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // KPI Metrics
  const summaryMetrics = useMemo(() => {
    const total = resignations.length;
    const pending = resignations.filter(r => r.status === "Pending Approval").length;
    const notice = resignations.filter(r => r.status === "Notice Period").length;
    const completed = resignations.filter(r => r.status === "Completed").length;
    const declined = resignations.filter(r => r.status === "Declined" || r.status === "Retracted").length;

    return { total, pending, notice, completed, declined };
  }, [resignations]);

  // Search & Filtered List
  const filteredResignations = useMemo(() => {
    return resignations.filter(res => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        res.employeeName.toLowerCase().includes(q) ||
        res.sibsId.toLowerCase().includes(q) ||
        res.department.toLowerCase().includes(q) ||
        res.account.toLowerCase().includes(q) ||
        (typeof res.reason === "string" && res.reason.toLowerCase().includes(q)) ||
        res.id.toLowerCase().includes(q);

      const matchesStatus = statusFilter === "All" || res.status === statusFilter;
      const matchesType = typeFilter === "All" || res.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [resignations, searchTerm, statusFilter, typeFilter]);

  // Action Handlers
  const handleViewAction = (rec: ResignationRecord) => {
    setSelectedResignation(rec);
    setIsActionModalOpen(true);
  };

  const handleApprove = (recordId: string, updatedLastWorkingDate?: string, hrNotes?: string) => {
    onUpdateResignation(recordId, {
      status: "Notice Period",
      ...(updatedLastWorkingDate && { lastWorkingDate: updatedLastWorkingDate }),
      ...(hrNotes && { hrNotes: hrNotes })
    });
    triggerToast(`Resignation ${recordId} approved! Transferred to Notice Period.`);
  };

  const handleDecline = (recordId: string, rejectionReason: string) => {
    onUpdateResignation(recordId, {
      status: "Declined",
      rejectionReason: rejectionReason
    });
    triggerToast(`Resignation ${recordId} declined.`);
  };

  const handleUpdateDate = (recordId: string, newLastWorkingDate: string, hrNotes?: string) => {
    onUpdateResignation(recordId, {
      lastWorkingDate: newLastWorkingDate,
      ...(hrNotes && { hrNotes: hrNotes })
    });
    triggerToast(`Last working date for ${recordId} updated to ${newLastWorkingDate}.`);
  };

  const handleFileOnBehalfSubmit = (payload: Partial<ResignationRecord>) => {
    onAddResignation(payload);
    triggerToast("Resignation successfully filed on behalf of employee!");
  };

  return (
    <div className="space-y-6 pb-12 select-none">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 bg-[#042C51] text-white px-4 py-3 rounded-xl shadow-2xl border border-teal-400 flex items-center gap-3 text-xs font-bold"
          >
            <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER SECTION */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] bg-[#E9F0FC] text-[#042C51] px-2.5 py-0.5 rounded font-black border border-blue-100 uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5C28] inline-block"></span>
              Core HR & Operations
            </span>
          </div>
          <h1 className="text-xl font-black text-[#042C51] tracking-tight">
            Resignation Management Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage employee resignation submissions, review formal vs immediate notices, approve last working dates, and handle exit clearances.
          </p>
        </div>

        {/* Role Context & Actions */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Role Simulation Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700">
            <span className="text-[10px] text-slate-400 uppercase tracking-wide px-1">Role:</span>
            {(["HR Admin", "Operations Manager", "Team Leader"] as const).map(role => (
              <button
                key={role}
                onClick={() => setRoleContext(role)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  roleContext === role
                    ? "bg-[#042C51] text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-200"
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsFileModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[#FF5C28] hover:bg-[#e04b1a] text-white text-xs font-bold shadow-md shadow-orange-500/20 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>File on Behalf</span>
          </button>
        </div>
      </div>

      {/* SUMMARY KPI CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Total Requests</span>
          <div className="text-2xl font-black text-[#042C51] font-mono">{summaryMetrics.total}</div>
          <p className="text-[10px] text-slate-400">All filed separations</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wide">Pending Approval</span>
          <div className="text-2xl font-black text-amber-600 font-mono">{summaryMetrics.pending}</div>
          <p className="text-[10px] text-amber-700 font-semibold">Requires HR / Mgr review</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-teal-600 uppercase tracking-wide">Notice Period</span>
          <div className="text-2xl font-black text-teal-600 font-mono">{summaryMetrics.notice}</div>
          <p className="text-[10px] text-teal-700 font-semibold">Active exit countdown</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide">Completed</span>
          <div className="text-2xl font-black text-emerald-600 font-mono">{summaryMetrics.completed}</div>
          <p className="text-[10px] text-slate-400">Clearance finalized</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-red-600 uppercase tracking-wide">Declined / Retracted</span>
          <div className="text-2xl font-black text-red-600 font-mono">{summaryMetrics.declined}</div>
          <p className="text-[10px] text-slate-400">Not proceeded</p>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search employee, SIBS ID, account, reason..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#042C51] focus:outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <div className="flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[10px] font-bold text-slate-400 uppercase">Status:</span>
          </div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Pending Approval">Pending Approval</option>
            <option value="Notice Period">Notice Period</option>
            <option value="Completed">Completed</option>
            <option value="Declined">Declined</option>
          </select>

          <div className="flex items-center gap-1 ml-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Type:</span>
          </div>
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="All">All Types</option>
            <option value="Formal">Formal (30 Days)</option>
            <option value="Immediate">Immediate (&lt; 30 Days)</option>
          </select>
        </div>
      </div>

      {/* MANAGEMENT TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase font-extrabold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Employee</th>
                <th className="py-3.5 px-4">Department / Account</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Filed Date</th>
                <th className="py-3.5 px-4">Last Working Date</th>
                <th className="py-3.5 px-4">Reason</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredResignations.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 text-xs">
                    No resignation requests matched your search filters.
                  </td>
                </tr>
              ) : (
                filteredResignations.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#042C51] text-white flex items-center justify-center font-bold text-xs shrink-0">
                          {rec.employeeName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-black text-[#042C51]">{rec.employeeName}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{rec.sibsId} • {rec.position}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-bold text-slate-800">{rec.department}</p>
                      <p className="text-[10px] text-slate-500 font-medium">{rec.account}</p>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          rec.type === "Formal"
                            ? "bg-teal-50 text-teal-800 border border-teal-200"
                            : "bg-amber-50 text-amber-800 border border-amber-200"
                        }`}
                      >
                        {rec.type}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-mono text-slate-600">{rec.submissionDate}</td>
                    <td className="py-4 px-4 font-mono font-bold text-[#042C51]">{rec.lastWorkingDate}</td>
                    <td className="py-4 px-4 max-w-[180px]">
                      <span className="font-medium text-slate-800 truncate block">{rec.reason}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-block ${
                          rec.status === "Pending Approval"
                            ? "bg-amber-100 text-amber-900"
                            : rec.status === "Notice Period" || rec.status === "Approved"
                            ? "bg-teal-100 text-teal-900"
                            : rec.status === "Completed"
                            ? "bg-emerald-100 text-emerald-900"
                            : "bg-red-100 text-red-900"
                        }`}
                      >
                        {rec.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => handleViewAction(rec)}
                        className="px-3 py-1.5 bg-[#042C51] hover:bg-[#031d36] text-white rounded-lg text-[11px] font-bold shadow-xs flex items-center gap-1.5 ml-auto transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View / Action</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* HR / MANAGER ACTION MODAL */}
      <ResignationManagementModal
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        record={selectedResignation}
        onApprove={handleApprove}
        onDecline={handleDecline}
        onUpdateDate={handleUpdateDate}
      />

      {/* FILE ON BEHALF MODAL */}
      <ResignationModal
        isOpen={isFileModalOpen}
        onClose={() => setIsFileModalOpen(false)}
        onSubmit={handleFileOnBehalfSubmit}
        mode="create"
        employeeProfile={{
          sibsId: "SIBS-7711",
          employeeName: "Jefferson Pierce",
          position: "Tier 1 Support Agent",
          department: "Retail & E-Commerce",
          account: "Amazon Care",
          cluster: "Retail & E-Commerce"
        }}
      />
    </div>
  );
}
