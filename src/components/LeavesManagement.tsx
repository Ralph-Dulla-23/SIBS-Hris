import React, { useState, useMemo } from "react";
import CentralizedFilters from "./CentralizedFilters";
import {
  Calendar,
  Search,
  SlidersHorizontal,
  RefreshCw,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Check,
  X,
  FileText,
  User,
  Plus,
  Trash2,
  Edit2,
  Paperclip,
  TrendingDown,
  Sparkles,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface LeaveRecord {
  id: string;
  sibsId: string;
  employeeName: string;
  account: string;
  leaveType: "Vacation" | "Sick" | "Maternal" | "Paternal" | "Emergency" | "Bereavement";
  filedDate: string; // YYYY-MM-DD HH:MM
  dateFrom: string; // YYYY-MM-DD
  dateTo: string; // YYYY-MM-DD
  days: number;
  credits: number; // Approved Credits
  plotted: number; // Plotted leaves
  remaining: number; // Remaining Balance
  status: "Approved" | "Pending" | "Rejected";
  
  // View Modal specific details
  paidLeave: boolean;
  reason: string;
  remarks: string;
  
  // Ledger Details
  availableFrom: string;
  availableTo: string;
  justification: string;
  
  // Approval Context
  approverId: string;
  approverName: string;
  dateApproved: string; // YYYY-MM-DD HH:MM
  attachmentName: string;
}

const INITIAL_LEAVE_RECORDS: LeaveRecord[] = [
  {
    id: "LV-2026-001",
    sibsId: "6496",
    employeeName: "CANITAN, CRISTER ALBERCA",
    account: "Software Management",
    leaveType: "Vacation",
    filedDate: "2026-07-18 09:30 AM",
    dateFrom: "2026-07-22",
    dateTo: "2026-07-24",
    days: 3,
    credits: 15,
    plotted: 5,
    remaining: 7,
    status: "Pending",
    paidLeave: true,
    reason: "Family out-of-town trip to Samal Island.",
    remarks: "Pending review by technical lead.",
    availableFrom: "2026-01-01",
    availableTo: "2026-12-31",
    justification: "Annual performance credit allocation.",
    approverId: "1245",
    approverName: "BATACAN, ALENA MENDOZA",
    dateApproved: "—",
    attachmentName: "itinerary_samal.pdf"
  },
  {
    id: "LV-2026-002",
    sibsId: "6099",
    employeeName: "LABUS, ROLAND JAMES DIAGBEL",
    account: "Managers",
    leaveType: "Sick",
    filedDate: "2026-07-19 07:15 AM",
    dateFrom: "2026-07-19",
    dateTo: "2026-07-20",
    days: 2,
    credits: 12,
    plotted: 3,
    remaining: 7,
    status: "Pending",
    paidLeave: true,
    reason: "Sudden onset of high fever and flu-like symptoms.",
    remarks: "Medical certificate requested.",
    availableFrom: "2026-01-01",
    availableTo: "2026-12-31",
    justification: "Standard wellness credit allocation.",
    approverId: "1245",
    approverName: "BATACAN, ALENA MENDOZA",
    dateApproved: "—",
    attachmentName: "med_cert_draft.pdf"
  },
  {
    id: "LV-2026-003",
    sibsId: "6495",
    employeeName: "ANG, KRISTIAN ALLEN BAQUERFO",
    account: "Software Management",
    leaveType: "Emergency",
    filedDate: "2026-07-17 04:45 PM",
    dateFrom: "2026-07-18",
    dateTo: "2026-07-18",
    days: 1,
    credits: 5,
    plotted: 2,
    remaining: 2,
    status: "Approved",
    paidLeave: true,
    reason: "Urgent household repairs due to water main leak.",
    remarks: "Approved as emergency leave under local parameters.",
    availableFrom: "2026-01-01",
    availableTo: "2026-12-31",
    justification: "Emergency statutory buffer.",
    approverId: "1245",
    approverName: "BATACAN, ALENA MENDOZA",
    dateApproved: "2026-07-17 05:15 PM",
    attachmentName: "plumber_receipt.jpg"
  },
  {
    id: "LV-2026-004",
    sibsId: "4830",
    employeeName: "PAJAR, DOROTHY FAITH ELIZA LUBO",
    account: "Yomdel Property",
    leaveType: "Vacation",
    filedDate: "2026-07-15 11:20 AM",
    dateFrom: "2026-07-27",
    dateTo: "2026-07-31",
    days: 5,
    credits: 15,
    plotted: 0,
    remaining: 10,
    status: "Approved",
    paidLeave: true,
    reason: "Personal wellness break and board exam preparation.",
    remarks: "Pre-approved by program manager; coverage secured.",
    availableFrom: "2026-01-01",
    availableTo: "2026-12-31",
    justification: "Earned career development leave credits.",
    approverId: "1245",
    approverName: "BATACAN, ALENA MENDOZA",
    dateApproved: "2026-07-16 09:00 AM",
    attachmentName: "wellness_request.pdf"
  },
  {
    id: "LV-2026-005",
    sibsId: "25-0026",
    employeeName: "HURTADO, LUIS FERNANDO",
    account: "Physicians Footcare",
    leaveType: "Bereavement",
    filedDate: "2026-07-14 02:10 PM",
    dateFrom: "2026-07-15",
    dateTo: "2026-07-17",
    days: 3,
    credits: 3,
    plotted: 0,
    remaining: 0,
    status: "Approved",
    paidLeave: true,
    reason: "Demise of immediate family member (grandmother).",
    remarks: "Compassionate leave approved without delays.",
    availableFrom: "2026-01-01",
    availableTo: "2026-12-31",
    justification: "Bereavement standard allowance.",
    approverId: "1245",
    approverName: "BATACAN, ALENA MENDOZA",
    dateApproved: "2026-07-14 02:40 PM",
    attachmentName: "death_certificate_copy.pdf"
  },
  {
    id: "LV-2026-006",
    sibsId: "3311",
    employeeName: "DULLA, RALPH VINCENT",
    account: "Software Management",
    leaveType: "Paternal",
    filedDate: "2026-07-10 10:00 AM",
    dateFrom: "2026-07-28",
    dateTo: "2026-08-04",
    days: 7,
    credits: 7,
    plotted: 0,
    remaining: 0,
    status: "Approved",
    paidLeave: true,
    reason: "Birth of first child. Scheduled caesarean delivery.",
    remarks: "Allocated statutory paternal leave.",
    availableFrom: "2026-01-01",
    availableTo: "2026-12-31",
    justification: "Statutory Republic Act 8187 allocation.",
    approverId: "1245",
    approverName: "BATACAN, ALENA MENDOZA",
    dateApproved: "2026-07-11 11:30 AM",
    attachmentName: "sched_delivery_hospital.pdf"
  },
  {
    id: "LV-2026-007",
    sibsId: "1245",
    employeeName: "BATACAN, ALENA MENDOZA",
    account: "Managers",
    leaveType: "Vacation",
    filedDate: "2026-07-05 04:00 PM",
    dateFrom: "2026-08-10",
    dateTo: "2026-08-14",
    days: 5,
    credits: 20,
    plotted: 5,
    remaining: 10,
    status: "Approved",
    paidLeave: true,
    reason: "Mid-year restorative family vacation.",
    remarks: "Cover designated to deputy supervisor.",
    availableFrom: "2026-01-01",
    availableTo: "2026-12-31",
    justification: "Tenure-based premium credits.",
    approverId: "9999",
    approverName: "CHUA, JONATHAN (HR DIRECTOR)",
    dateApproved: "2026-07-06 01:45 PM",
    attachmentName: "flight_itinerary.pdf"
  },
  {
    id: "LV-2026-008",
    sibsId: "6496",
    employeeName: "CANITAN, CRISTER ALBERCA",
    account: "Software Management",
    leaveType: "Sick",
    filedDate: "2026-07-01 08:00 AM",
    dateFrom: "2026-07-01",
    dateTo: "2026-07-02",
    days: 2,
    credits: 15,
    plotted: 3,
    remaining: 10,
    status: "Approved",
    paidLeave: true,
    reason: "Severe dental surgery recovery.",
    remarks: "Approved on submitting clinic receipt.",
    availableFrom: "2026-01-01",
    availableTo: "2026-12-31",
    justification: "Performance wellness pool.",
    approverId: "1245",
    approverName: "BATACAN, ALENA MENDOZA",
    dateApproved: "2026-07-02 09:15 AM",
    attachmentName: "dental_excuse_slip.pdf"
  }
];

export default function LeavesManagement() {
  const [records, setRecords] = useState<LeaveRecord[]>(INITIAL_LEAVE_RECORDS);

  // Filters State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("All Accounts");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [fromDate, setFromDate] = useState("2026-07-01");
  const [toDate, setToDate] = useState("2026-08-15");

  // Selection
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);

  // Modals state
  const [activeModalRecord, setActiveModalRecord] = useState<LeaveRecord | null>(null);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<LeaveRecord | null>(null);

  // Form states for Add/Edit Form
  const [formSibsId, setFormSibsId] = useState("");
  const [formEmployeeName, setFormEmployeeName] = useState("");
  const [formAccount, setFormAccount] = useState("Software Management");
  const [formLeaveType, setFormLeaveType] = useState<"Vacation" | "Sick" | "Maternal" | "Paternal" | "Emergency" | "Bereavement">("Vacation");
  const [formDateFrom, setFormDateFrom] = useState("2026-07-20");
  const [formDateTo, setFormDateTo] = useState("2026-07-22");
  const [formDays, setFormDays] = useState(3);
  const [formCredits, setFormCredits] = useState(15);
  const [formPlotted, setFormPlotted] = useState(2);
  const [formRemaining, setFormRemaining] = useState(10);
  const [formPaidLeave, setFormPaidLeave] = useState(true);
  const [formReason, setFormReason] = useState("");
  const [formRemarks, setFormRemarks] = useState("");
  const [formAttachment, setFormAttachment] = useState("");

  const accountsList = [
    "All Accounts",
    "Software Management",
    "Managers",
    "Yomdel Property",
    "Physicians Footcare"
  ];

  const statusList = [
    "All Status",
    "Approved",
    "Pending",
    "Rejected"
  ];

  const leaveTypesList = [
    "Vacation",
    "Sick",
    "Maternal",
    "Paternal",
    "Emergency",
    "Bereavement"
  ];

  // Reset Filters
  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedAccount("All Accounts");
    setSelectedStatus("All Status");
    setFromDate("2026-07-01");
    setToDate("2026-08-15");
  };

  // Filtered dataset
  const filteredRecords = useMemo(() => {
    return records.filter(rec => {
      const matchesSearch = 
        rec.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.sibsId.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesAccount = 
        selectedAccount === "All Accounts" || 
        rec.account === selectedAccount;

      const matchesStatus = 
        selectedStatus === "All Status" || 
        rec.status === selectedStatus;

      // Date window check
      const recFrom = new Date(rec.dateFrom);
      const recTo = new Date(rec.dateTo);
      const filterFrom = fromDate ? new Date(fromDate) : null;
      const filterTo = toDate ? new Date(toDate) : null;

      let matchesDate = true;
      if (filterFrom) {
        filterFrom.setHours(0,0,0,0);
        recTo.setHours(0,0,0,0);
        if (recTo < filterFrom) matchesDate = false;
      }
      if (filterTo) {
        filterTo.setHours(0,0,0,0);
        recFrom.setHours(0,0,0,0);
        if (recFrom > filterTo) matchesDate = false;
      }

      return matchesSearch && matchesAccount && matchesStatus && matchesDate;
    });
  }, [records, searchTerm, selectedAccount, selectedStatus, fromDate, toDate]);

  // Bulk status change
  const handleBulkStatusChange = (newStatus: "Approved" | "Pending" | "Rejected") => {
    if (selectedRowIds.length === 0) return;
    const nowStr = new Date().toISOString().replace("T", " ").substring(0, 16);
    setRecords(prev => prev.map(r => {
      if (selectedRowIds.includes(r.id)) {
        return {
          ...r,
          status: newStatus,
          dateApproved: newStatus !== "Pending" ? nowStr : "—",
          approverName: newStatus !== "Pending" ? "BATACAN, ALENA MENDOZA" : "—"
        };
      }
      return r;
    }));
    setSelectedRowIds([]);
  };

  // Individual quick change
  const handleQuickStatus = (id: string, newStatus: "Approved" | "Pending" | "Rejected") => {
    const nowStr = new Date().toISOString().replace("T", " ").substring(0, 16);
    setRecords(prev => prev.map(r => {
      if (r.id === id) {
        return {
          ...r,
          status: newStatus,
          dateApproved: newStatus !== "Pending" ? nowStr : "—",
          approverName: newStatus !== "Pending" ? "BATACAN, ALENA MENDOZA" : "—"
        };
      }
      return r;
    }));
  };

  const handleDeleteRecord = (id: string) => {
    if (confirm("Are you sure you want to delete this leave request?")) {
      setRecords(prev => prev.filter(r => r.id !== id));
      setSelectedRowIds(prev => prev.filter(rowId => rowId !== id));
    }
  };

  // Row selection helpers
  const toggleRowSelection = (id: string) => {
    setSelectedRowIds(prev => 
      prev.includes(id) ? prev.filter(rId => rId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedRowIds.length === filteredRecords.length) {
      setSelectedRowIds([]);
    } else {
      setSelectedRowIds(filteredRecords.map(r => r.id));
    }
  };

  // Open Form to Add
  const openAddModal = () => {
    setEditingRecord(null);
    setFormSibsId("");
    setFormEmployeeName("");
    setFormAccount("Software Management");
    setFormLeaveType("Vacation");
    setFormDateFrom("2026-07-20");
    setFormDateTo("2026-07-22");
    setFormDays(3);
    setFormCredits(15);
    setFormPlotted(2);
    setFormRemaining(10);
    setFormPaidLeave(true);
    setFormReason("");
    setFormRemarks("");
    setFormAttachment("");
    setIsAddEditModalOpen(true);
  };

  // Open Form to Edit
  const openEditModal = (record: LeaveRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingRecord(record);
    setFormSibsId(record.sibsId);
    setFormEmployeeName(record.employeeName);
    setFormAccount(record.account);
    setFormLeaveType(record.leaveType);
    setFormDateFrom(record.dateFrom);
    setFormDateTo(record.dateTo);
    setFormDays(record.days);
    setFormCredits(record.credits);
    setFormPlotted(record.plotted);
    setFormRemaining(record.remaining);
    setFormPaidLeave(record.paidLeave);
    setFormReason(record.reason);
    setFormRemarks(record.remarks);
    setFormAttachment(record.attachmentName);
    setIsAddEditModalOpen(true);
  };

  // Save Add/Edit
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formSibsId || !formEmployeeName) {
      alert("SiBS ID and Employee Name are required.");
      return;
    }

    const fileDateStr = new Date().toISOString().replace("T", " ").substring(0, 16);

    if (editingRecord) {
      // update
      setRecords(prev => prev.map(r => r.id === editingRecord.id ? {
        ...r,
        sibsId: formSibsId,
        employeeName: formEmployeeName.toUpperCase(),
        account: formAccount,
        leaveType: formLeaveType,
        dateFrom: formDateFrom,
        dateTo: formDateTo,
        days: formDays,
        credits: formCredits,
        plotted: formPlotted,
        remaining: formRemaining,
        paidLeave: formPaidLeave,
        reason: formReason,
        remarks: formRemarks,
        attachmentName: formAttachment || "uploaded_attachment.pdf"
      } : r));
    } else {
      // create new
      const newLeave: LeaveRecord = {
        id: `LV-2026-${Math.floor(100 + Math.random() * 900)}`,
        sibsId: formSibsId,
        employeeName: formEmployeeName.toUpperCase(),
        account: formAccount,
        leaveType: formLeaveType,
        filedDate: fileDateStr,
        dateFrom: formDateFrom,
        dateTo: formDateTo,
        days: formDays,
        credits: formCredits,
        plotted: formPlotted,
        remaining: formRemaining,
        status: "Pending",
        paidLeave: formPaidLeave,
        reason: formReason,
        remarks: formRemarks,
        availableFrom: "2026-01-01",
        availableTo: "2026-12-31",
        justification: "Standard wellness credit allocation.",
        approverId: "1245",
        approverName: "—",
        dateApproved: "—",
        attachmentName: formAttachment || "unspecified_file.pdf"
      };
      setRecords(prev => [newLeave, ...prev]);
    }

    setIsAddEditModalOpen(false);
    setEditingRecord(null);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen pb-12 select-none" id="leaves-module-container">
      {/* ==================== PAGE HEADER ==================== */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] bg-amber-500/10 text-amber-600 px-2.5 py-0.5 rounded-full font-bold border border-amber-500/20 uppercase tracking-wider flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Leaves & Time Off
            </span>
          </div>
          <h1 className="text-2xl font-black text-[#042C51] tracking-tight">Leaves Management Portal</h1>
          <p className="text-xs text-[#667085] leading-normal">
            Track employee leave requests, view detailed credit ledgers, and execute fast multi-tier approvals.
          </p>
        </div>

        {/* Add leave request button */}
        <button
          onClick={openAddModal}
          className="bg-[#FF5C28] hover:bg-[#e04b1a] text-white text-xs font-black px-4 py-2.5 rounded-xl shadow-md shadow-[#ff5c28]/15 flex items-center gap-2 transition-all duration-150 transform active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Submit Leave Request</span>
        </button>
      </div>

      {/* ==================== 1. FILTERS & CONTROLS ==================== */}
      <CentralizedFilters
        title="Filter Records"
        resetLabel="Reset filters"
        onReset={handleResetFilters}
        search={{
          label: "Search Employee",
          placeholder: "Name or SiBS ID...",
          value: searchTerm,
          onChange: setSearchTerm,
        }}
        selects={[
          {
            label: "Account",
            value: selectedAccount,
            onChange: setSelectedAccount,
            options: accountsList,
          },
          {
            label: "Request Status",
            value: selectedStatus,
            onChange: setSelectedStatus,
            options: statusList,
          }
        ]}
        dateFrom={{
          label: "Date From",
          value: fromDate,
          onChange: setFromDate,
        }}
        dateTo={{
          label: "Date To",
          value: toDate,
          onChange: setToDate,
        }}
      />

      {/* ==================== 2. LEAVES RECORDS TABLE ==================== */}
      <div className="bg-white rounded-2xl border border-[#E6ECF2] shadow-sm overflow-hidden" id="leaves-table-panel">
        
        {/* Bulk Action Toolbar */}
        <AnimatePresence>
          {selectedRowIds.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-[#042C51] text-white px-5 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-blue-900"
            >
              <div className="flex items-center gap-2 text-xs font-bold">
                <span className="flex items-center justify-center bg-amber-500 text-slate-900 text-[10px] w-5 h-5 rounded-full font-black">
                  {selectedRowIds.length}
                </span>
                <span>Leave Requests Selected for Bulk Action</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleBulkStatusChange("Approved")}
                  className="bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Bulk Approve</span>
                </button>
                <button
                  onClick={() => handleBulkStatusChange("Rejected")}
                  className="bg-rose-600 hover:bg-rose-500 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Bulk Reject</span>
                </button>
                <button
                  onClick={() => setSelectedRowIds([])}
                  className="bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                >
                  Clear selection
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E6ECF2] text-[10px] font-black text-slate-400 uppercase tracking-wider select-none">
                <th className="py-4 px-4 text-center w-10">
                  <input
                    type="checkbox"
                    checked={filteredRecords.length > 0 && selectedRowIds.length === filteredRecords.length}
                    onChange={toggleSelectAll}
                    className="rounded text-[#FF5C28] focus:ring-[#FF5C28]"
                  />
                </th>
                <th className="py-4 px-4 min-w-[180px]">Employee Name</th>
                <th className="py-4 px-4 w-24">SiBS ID</th>
                <th className="py-4 px-4 w-28">Leave Type</th>
                <th className="py-4 px-4 w-32">Filed Date</th>
                <th className="py-4 px-4 w-28">Date From</th>
                <th className="py-4 px-4 w-28">Date To</th>
                <th className="py-4 px-3 text-center w-14">Days</th>
                <th className="py-4 px-3 text-center w-16">Credits</th>
                <th className="py-4 px-3 text-center w-16">Plotted</th>
                <th className="py-4 px-3 text-center w-20">Remaining</th>
                <th className="py-4 px-4 text-center w-28">Status</th>
                <th className="py-4 px-4 text-center w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9] text-xs font-medium text-[#042C51]">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={13} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Calendar className="w-10 h-10 text-slate-300 stroke-[1.5]" />
                      <p className="font-bold text-sm">No Leave Requests Found</p>
                      <p className="text-xs">Adjust your search input, status, or date range filters.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec) => {
                  const isSelected = selectedRowIds.includes(rec.id);
                  return (
                    <tr
                      key={rec.id}
                      onClick={() => setActiveModalRecord(rec)}
                      className={`hover:bg-[#F8FAFC] transition-colors cursor-pointer ${
                        isSelected ? "bg-[#E9F0FC]/40" : ""
                      }`}
                    >
                      {/* Checkbox selector */}
                      <td className="py-3.5 px-4 text-center" onClick={e => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleRowSelection(rec.id)}
                          className="rounded text-[#FF5C28] focus:ring-[#FF5C28]"
                        />
                      </td>

                      {/* Name */}
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {rec.employeeName}
                      </td>

                      {/* SiBS ID */}
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-500">
                        {rec.sibsId}
                      </td>

                      {/* Leave Type */}
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                          rec.leaveType === "Vacation"
                            ? "bg-blue-50 text-blue-700 border-blue-100"
                            : rec.leaveType === "Sick"
                              ? "bg-rose-50 text-rose-700 border-rose-100"
                              : rec.leaveType === "Emergency"
                                ? "bg-amber-50 text-amber-700 border-amber-100"
                                : rec.leaveType === "Bereavement"
                                  ? "bg-purple-50 text-purple-700 border-purple-100"
                                  : "bg-teal-50 text-teal-700 border-teal-100"
                        }`}>
                          {rec.leaveType}
                        </span>
                      </td>

                      {/* Filed Date */}
                      <td className="py-3.5 px-4 text-slate-500">
                        {rec.filedDate}
                      </td>

                      {/* Date From */}
                      <td className="py-3.5 px-4 font-bold text-slate-600">
                        {rec.dateFrom}
                      </td>

                      {/* Date To */}
                      <td className="py-3.5 px-4 font-bold text-slate-600">
                        {rec.dateTo}
                      </td>

                      {/* Days requested */}
                      <td className="py-3.5 px-3 text-center font-bold text-slate-900 bg-slate-50/50">
                        {rec.days} {rec.days === 1 ? "day" : "days"}
                      </td>

                      {/* Approved Credits */}
                      <td className="py-3.5 px-3 text-center font-bold text-slate-500">
                        {rec.credits}
                      </td>

                      {/* Plotted */}
                      <td className="py-3.5 px-3 text-center font-bold text-slate-500">
                        {rec.plotted}
                      </td>

                      {/* Remaining Leave Balance */}
                      <td className={`py-3.5 px-3 text-center font-black bg-slate-50/30 ${
                        rec.remaining > 5 ? "text-[#FF5C28]" : "text-amber-600"
                      }`}>
                        {rec.remaining}
                      </td>

                      {/* Request Status */}
                      <td className="py-3.5 px-4 text-center" onClick={e => e.stopPropagation()}>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 w-full border ${
                          rec.status === "Approved"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : rec.status === "Rejected"
                              ? "bg-rose-50 text-rose-700 border-rose-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            rec.status === "Approved"
                              ? "bg-emerald-500"
                              : rec.status === "Rejected"
                                ? "bg-rose-500"
                                : "bg-amber-500"
                          }`} />
                          <span>{rec.status}</span>
                        </span>
                      </td>

                      {/* Quick Actions */}
                      <td className="py-3.5 px-4" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1">
                          {rec.status === "Pending" && (
                            <>
                              <button
                                onClick={() => handleQuickStatus(rec.id, "Approved")}
                                title="Approve Leave"
                                className="p-1 text-emerald-600 hover:bg-emerald-50 rounded transition-colors cursor-pointer"
                              >
                                <CheckCircle className="w-4 h-4 stroke-[2.5]" />
                              </button>
                              <button
                                onClick={() => handleQuickStatus(rec.id, "Rejected")}
                                title="Reject Leave"
                                className="p-1 text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                              >
                                <XCircle className="w-4 h-4 stroke-[2.5]" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={(e) => openEditModal(rec, e)}
                            title="Edit details"
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteRecord(rec.id)}
                            title="Delete Request"
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="bg-[#F8FAFC] border-t border-[#E6ECF2] px-6 py-3 flex items-center justify-between text-[11px] text-slate-500 font-bold select-none">
          <span>Showing {filteredRecords.length} of {records.length} total entries</span>
          <div className="flex items-center gap-1">
            <button className="p-1 px-2 border border-[#E6ECF2] bg-white rounded hover:bg-slate-50 cursor-not-allowed text-slate-300">
              Prev
            </button>
            <span className="px-2 font-black text-[#042C51]">Page 1</span>
            <button className="p-1 px-2 border border-[#E6ECF2] bg-white rounded hover:bg-slate-50 cursor-not-allowed text-slate-300">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* ==================== 3. LEAVE DETAILS VIEW MODAL ==================== */}
      <AnimatePresence>
        {activeModalRecord && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl border border-[#E6ECF2] shadow-2xl max-w-2xl w-full overflow-hidden my-8"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-[#042C51] text-white p-5 flex items-center justify-between border-b border-[#083a69]">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-amber-500" />
                  <h3 className="font-black text-sm uppercase tracking-wider">Leave Request & Ledger audit</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveModalRecord(null)}
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto scrollbar-thin">
                
                {/* 1. EMPLOYEE CONTEXT */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-[#E6ECF2] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#042C51] text-white flex items-center justify-center font-black text-xs">
                      {activeModalRecord.employeeName.substring(0, 2)}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#042C51] text-sm">{activeModalRecord.employeeName}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">User Code (SiBS ID):</span>
                        <span className="text-[10px] font-mono font-bold text-slate-600 bg-slate-200/50 px-1.5 py-0.5 rounded">{activeModalRecord.sibsId}</span>
                      </div>
                    </div>
                  </div>

                  {/* Badges & Prominent remaining balance */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <span className="text-[8px] font-bold text-slate-400 uppercase block">Remaining Balance</span>
                      <span className="text-lg font-black text-[#FF5C28]">{activeModalRecord.remaining} Days</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className={`px-2 py-0.5 text-center rounded text-[9px] font-bold uppercase border ${
                        activeModalRecord.leaveType === "Vacation" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-rose-50 text-rose-700 border-rose-200"
                      }`}>
                        {activeModalRecord.leaveType}
                      </span>
                      <span className={`px-2 py-0.5 text-center rounded text-[9px] font-black uppercase border ${
                        activeModalRecord.status === "Approved" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : activeModalRecord.status === "Rejected" ? "bg-rose-50 text-rose-700 border-rose-200" : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}>
                        {activeModalRecord.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. LEAVE REQUEST INFORMATION */}
                <div>
                  <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 border-b pb-1">
                    Leave Request Information
                  </h5>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 font-bold block text-[10px] uppercase">Leave ID</span>
                      <span className="font-mono font-bold text-slate-800">{activeModalRecord.id}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold block text-[10px] uppercase">Filed Date</span>
                      <span className="text-slate-800 font-bold">{activeModalRecord.filedDate}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold block text-[10px] uppercase">Paid status</span>
                      <span className="text-slate-800 font-bold flex items-center gap-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${activeModalRecord.paidLeave ? "bg-emerald-500" : "bg-slate-400"}`} />
                        {activeModalRecord.paidLeave ? "Paid Leave" : "Unpaid Leave"}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold block text-[10px] uppercase">Total Days</span>
                      <span className="text-slate-800 font-bold">{activeModalRecord.days} {activeModalRecord.days === 1 ? "Day" : "Days"}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold block text-[10px] uppercase">Date From</span>
                      <span className="text-slate-800 font-bold">{activeModalRecord.dateFrom}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold block text-[10px] uppercase">Date To</span>
                      <span className="text-slate-800 font-bold">{activeModalRecord.dateTo}</span>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 font-bold block text-[10px] uppercase">Reason</span>
                      <p className="text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100 font-medium">
                        {activeModalRecord.reason || "No specification provided."}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold block text-[10px] uppercase">Supervisor Remarks</span>
                      <p className="text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100 font-medium">
                        {activeModalRecord.remarks || "No comments filed."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3. LEAVE BALANCE LEDGER */}
                <div>
                  <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 border-b pb-1">
                    Leave Balance Ledger
                  </h5>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs mb-3">
                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 text-center">
                      <span className="text-[8px] text-slate-400 font-bold block uppercase">Approved Credits</span>
                      <span className="font-bold text-slate-700 text-sm">{activeModalRecord.credits}</span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 text-center">
                      <span className="text-[8px] text-slate-400 font-bold block uppercase">Plotted Leaves</span>
                      <span className="font-bold text-slate-700 text-sm">{activeModalRecord.plotted}</span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 text-center">
                      <span className="text-[8px] text-slate-400 font-bold block uppercase">Remaining Leaves</span>
                      <span className="font-black text-[#FF5C28] text-sm">{activeModalRecord.remaining}</span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 text-center col-span-2">
                      <span className="text-[8px] text-slate-400 font-bold block uppercase">Validity Window</span>
                      <span className="font-bold text-slate-500 text-[10px]">{activeModalRecord.availableFrom} — {activeModalRecord.availableTo}</span>
                    </div>
                  </div>

                  <div className="text-xs">
                    <span className="text-slate-400 font-bold block text-[10px] uppercase">Balance Justification</span>
                    <p className="text-slate-600 italic bg-slate-50 p-2 px-3 rounded-lg border border-slate-100 mt-1">
                      "{activeModalRecord.justification || "Annual tenure adjustment credits."}"
                    </p>
                  </div>
                </div>

                {/* 4. APPROVAL INFORMATION */}
                <div>
                  <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 border-b pb-1">
                    Approval Context & Security
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-2">
                      <div>
                        <span className="text-slate-400 font-bold block text-[10px] uppercase">Approver Name</span>
                        <span className="font-bold text-[#042C51]">{activeModalRecord.approverName || "—"}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-bold block text-[10px] uppercase">Date approved / processed</span>
                        <span className="font-bold text-slate-600">{activeModalRecord.dateApproved || "—"}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <span className="text-slate-400 font-bold block text-[10px] uppercase">Attachment file</span>
                        {activeModalRecord.attachmentName ? (
                          <div className="flex items-center gap-1.5 mt-1 bg-blue-50/50 border border-blue-100 p-2 rounded-xl text-[10px] font-bold text-blue-700">
                            <Paperclip className="w-3.5 h-3.5" />
                            <span className="truncate flex-1">{activeModalRecord.attachmentName}</span>
                            <span className="text-[8px] text-blue-500 hover:underline cursor-pointer">Download</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">No attachments provided.</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Manual action triggers */}
                {activeModalRecord.status === "Pending" && (
                  <div className="bg-amber-500/5 border border-amber-500/20 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                      <div>
                        <span className="text-[10px] font-extrabold text-[#042C51] uppercase tracking-wide block">Pending Approval Action</span>
                        <p className="text-[9px] text-slate-500">Sign off or reject this request with administrative rights.</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => {
                          handleQuickStatus(activeModalRecord.id, "Approved");
                          setActiveModalRecord(null);
                        }}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] uppercase tracking-wider px-3.5 py-2 rounded-xl shadow-md flex items-center justify-center gap-1 w-full sm:w-auto cursor-pointer"
                      >
                        <Check className="w-3 h-3 stroke-[3]" />
                        <span>Approve Request</span>
                      </button>
                      <button
                        onClick={() => {
                          handleQuickStatus(activeModalRecord.id, "Rejected");
                          setActiveModalRecord(null);
                        }}
                        className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-[10px] uppercase tracking-wider px-3.5 py-2 rounded-xl shadow-md flex items-center justify-center gap-1 w-full sm:w-auto cursor-pointer"
                      >
                        <X className="w-3 h-3 stroke-[3]" />
                        <span>Reject Request</span>
                      </button>
                    </div>
                  </div>
                )}

              </div>

              {/* Close footer */}
              <div className="bg-slate-50 p-4 flex items-center justify-end border-t border-[#E6ECF2]">
                <button
                  type="button"
                  onClick={() => setActiveModalRecord(null)}
                  className="bg-[#042C51] hover:bg-[#021f3a] text-white text-[10px] font-extrabold uppercase tracking-widest px-5 py-2.5 rounded-xl cursor-pointer"
                >
                  Close panel
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================== ADD / EDIT LEAVE FORM MODAL ==================== */}
      <AnimatePresence>
        {isAddEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl border border-[#E6ECF2] shadow-2xl max-w-lg w-full overflow-hidden"
            >
              <div className="bg-[#042C51] text-white p-5 flex items-center justify-between border-b border-[#083a69]">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-amber-500" />
                  <h3 className="font-black text-sm">
                    {editingRecord ? "Edit Leave Request details" : "Submit New Leave Request"}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddEditModalOpen(false);
                    setEditingRecord(null);
                  }}
                  className="text-slate-300 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveForm} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  {/* SiBS ID */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">SiBS ID</label>
                    <input
                      type="text"
                      placeholder="e.g. 6496"
                      value={formSibsId}
                      onChange={e => setFormSibsId(e.target.value)}
                      className="bg-[#F8FAFC] border border-[#E6ECF2] rounded-xl px-3 py-2 text-xs font-bold text-[#042C51] focus:outline-none focus:ring-2 focus:ring-[#FF5C28]/20"
                      required
                    />
                  </div>

                  {/* Employee Name */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Employee Name</label>
                    <input
                      type="text"
                      placeholder="e.g. CANITAN, CRISTER"
                      value={formEmployeeName}
                      onChange={e => setFormEmployeeName(e.target.value)}
                      className="bg-[#F8FAFC] border border-[#E6ECF2] rounded-xl px-3 py-2 text-xs font-bold text-[#042C51] focus:outline-none focus:ring-2 focus:ring-[#FF5C28]/20"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Account */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Account</label>
                    <select
                      value={formAccount}
                      onChange={e => setFormAccount(e.target.value)}
                      className="bg-[#F8FAFC] border border-[#E6ECF2] rounded-xl px-3 py-2 text-xs font-bold text-[#042C51] focus:outline-none focus:ring-2 focus:ring-[#FF5C28]/20"
                    >
                      {accountsList.slice(1).map((acc, idx) => (
                        <option key={idx} value={acc}>{acc}</option>
                      ))}
                    </select>
                  </div>

                  {/* Leave Type */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Leave Type</label>
                    <select
                      value={formLeaveType}
                      onChange={e => setFormLeaveType(e.target.value as any)}
                      className="bg-[#F8FAFC] border border-[#E6ECF2] rounded-xl px-3 py-2 text-xs font-bold text-[#042C51] focus:outline-none focus:ring-2 focus:ring-[#FF5C28]/20"
                    >
                      {leaveTypesList.map((tp, idx) => (
                        <option key={idx} value={tp}>{tp}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Date From */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date From</label>
                    <input
                      type="date"
                      value={formDateFrom}
                      onChange={e => setFormDateFrom(e.target.value)}
                      className="bg-[#F8FAFC] border border-[#E6ECF2] rounded-xl px-3 py-2 text-xs font-bold text-[#042C51]"
                      required
                    />
                  </div>

                  {/* Date To */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date To</label>
                    <input
                      type="date"
                      value={formDateTo}
                      onChange={e => setFormDateTo(e.target.value)}
                      className="bg-[#F8FAFC] border border-[#E6ECF2] rounded-xl px-3 py-2 text-xs font-bold text-[#042C51]"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-3">
                  {/* Days */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Days count</label>
                    <input
                      type="number"
                      value={formDays}
                      onChange={e => setFormDays(parseInt(e.target.value) || 1)}
                      className="bg-[#F8FAFC] border border-[#E6ECF2] rounded-xl px-2 py-2 text-xs font-bold text-[#042C51]"
                      required
                    />
                  </div>

                  {/* Approved Credits */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Credits Pool</label>
                    <input
                      type="number"
                      value={formCredits}
                      onChange={e => setFormCredits(parseInt(e.target.value) || 15)}
                      className="bg-[#F8FAFC] border border-[#E6ECF2] rounded-xl px-2 py-2 text-xs font-bold text-[#042C51]"
                    />
                  </div>

                  {/* Plotted */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Plotted</label>
                    <input
                      type="number"
                      value={formPlotted}
                      onChange={e => setFormPlotted(parseInt(e.target.value) || 0)}
                      className="bg-[#F8FAFC] border border-[#E6ECF2] rounded-xl px-2 py-2 text-xs font-bold text-[#042C51]"
                    />
                  </div>

                  {/* Remaining */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Remaining</label>
                    <input
                      type="number"
                      value={formRemaining}
                      onChange={e => setFormRemaining(parseInt(e.target.value) || 10)}
                      className="bg-[#F8FAFC] border border-[#E6ECF2] rounded-xl px-2 py-2 text-xs font-bold text-[#042C51]"
                    />
                  </div>
                </div>

                {/* Paid Leave and attachment */}
                <div className="grid grid-cols-2 gap-4 items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="formPaidCheck"
                      checked={formPaidLeave}
                      onChange={e => setFormPaidLeave(e.target.checked)}
                      className="rounded text-[#FF5C28] focus:ring-[#FF5C28]"
                    />
                    <label htmlFor="formPaidCheck" className="text-xs font-bold text-[#042C51] cursor-pointer">
                      Paid Leave
                    </label>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Filename attachment</label>
                    <input
                      type="text"
                      placeholder="e.g. cert.pdf"
                      value={formAttachment}
                      onChange={e => setFormAttachment(e.target.value)}
                      className="bg-white border border-[#E6ECF2] rounded-lg px-2 py-1 text-xs font-mono"
                    />
                  </div>
                </div>

                {/* Reason */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Reason for absence</label>
                  <textarea
                    placeholder="Provide a clear description of the reason for taking leave..."
                    value={formReason}
                    onChange={e => setFormReason(e.target.value)}
                    className="bg-[#F8FAFC] border border-[#E6ECF2] rounded-xl px-3 py-2 text-xs font-medium text-[#042C51] h-16 focus:outline-none"
                    required
                  />
                </div>

                {/* Remarks */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Internal remarks</label>
                  <input
                    type="text"
                    placeholder="Administrative comments or approval justifications..."
                    value={formRemarks}
                    onChange={e => setFormRemarks(e.target.value)}
                    className="bg-[#F8FAFC] border border-[#E6ECF2] rounded-xl px-3 py-2 text-xs font-medium text-[#042C51]"
                  />
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#F1F5F9]">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddEditModalOpen(false);
                      setEditingRecord(null);
                    }}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#FF5C28] hover:bg-[#e04b1a] text-white rounded-xl text-xs font-black cursor-pointer shadow-md shadow-[#ff5c28]/15"
                  >
                    Save request
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
