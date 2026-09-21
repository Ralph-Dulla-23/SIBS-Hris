import React, { useState, useMemo } from "react";
import { 
  Clock, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Plus, 
  Edit2, 
  Trash2, 
  Check, 
  X, 
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  Upload,
  RefreshCw,
  SlidersHorizontal,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import CentralizedFilters from "./CentralizedFilters";

interface AttendanceRecord {
  id: string;
  sibsId: string;
  employeeName: string;
  department: string;
  account: string;
  site: string;
  trackerDate: string; // YYYY-MM-DD
  loginTime: string; // HH:MM AM/PM
  logoutTime: string; // HH:MM AM/PM
  startBreak: string; // HH:MM AM/PM
  endBreak: string; // HH:MM AM/PM
  isLate: boolean;
  isEarlyOut: boolean;
  status: "Approved" | "Pending" | "Rejected";
}

// Helper to convert time string (HH:MM AM/PM) to minutes from midnight
function timeToMinutes(timeStr: string): number {
  if (!timeStr || timeStr === "—" || timeStr === "") return 0;
  const match = timeStr.match(/^(\d+):(\d+)\s*(AM|PM)$/i);
  if (!match) return 0;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const ampm = match[3].toUpperCase();
  
  if (ampm === "PM" && hours < 12) hours += 12;
  if (ampm === "AM" && hours === 12) hours = 0;
  
  return hours * 60 + minutes;
}

// Helper to format minutes from midnight to HH:MM AM/PM
function minutesToTimeStr(minutes: number): string {
  if (minutes < 0) minutes = 0;
  let hours = Math.floor(minutes / 60) % 24;
  const mins = Math.floor(minutes % 60);
  const ampm = hours >= 12 ? "PM" : "AM";
  
  let dispHours = hours % 12;
  if (dispHours === 0) dispHours = 12;
  
  const minPad = mins.toString().padStart(2, "0");
  return `${dispHours}:${minPad} ${ampm}`;
}

// Initial high-fidelity attendance records
const INITIAL_ATTENDANCE_RECORDS: AttendanceRecord[] = [
  {
    id: "att-1",
    sibsId: "6496",
    employeeName: "CANITAN, CRISTER ALBERCA",
    department: "IT (Information and Communications Technology)",
    account: "Software Management",
    site: "Davao",
    trackerDate: "2026-07-20",
    loginTime: "11:10 AM",
    startBreak: "01:00 PM",
    endBreak: "02:00 PM",
    logoutTime: "08:10 PM",
    isLate: true,
    isEarlyOut: false,
    status: "Pending"
  },
  {
    id: "att-2",
    sibsId: "6099",
    employeeName: "LABUS, ROLAND JAMES DIAGBEL",
    department: "Management Team",
    account: "Managers",
    site: "Davao",
    trackerDate: "2026-07-20",
    loginTime: "11:04 AM",
    startBreak: "01:00 PM",
    endBreak: "02:00 PM",
    logoutTime: "08:04 PM",
    isLate: true,
    isEarlyOut: false,
    status: "Pending"
  },
  {
    id: "att-3",
    sibsId: "6495",
    employeeName: "ANG, KRISTIAN ALLEN BAQUERFO",
    department: "IT (Information and Communications Technology)",
    account: "Software Management",
    site: "Davao",
    trackerDate: "2026-07-20",
    loginTime: "11:04 AM",
    startBreak: "01:00 PM",
    endBreak: "02:00 PM",
    logoutTime: "08:04 PM",
    isLate: true,
    isEarlyOut: false,
    status: "Pending"
  },
  {
    id: "att-4",
    sibsId: "4830",
    employeeName: "PAJAR, Dorothy Faith Eliza Lubo",
    department: "Call Center Operations",
    account: "Yomdel Property",
    site: "Tagum",
    trackerDate: "2026-07-20",
    loginTime: "11:00 AM",
    startBreak: "01:00 PM",
    endBreak: "02:00 PM",
    logoutTime: "08:00 PM",
    isLate: true,
    isEarlyOut: false,
    status: "Pending"
  },
  {
    id: "att-5",
    sibsId: "25-0026",
    employeeName: "HURTADO, LUIS FERNANDO",
    department: "Call Center Operations",
    account: "Physicians Footcare",
    site: "Tagum",
    trackerDate: "2026-07-20",
    loginTime: "10:53 AM",
    startBreak: "01:00 PM",
    endBreak: "02:00 PM",
    logoutTime: "07:53 PM",
    isLate: true,
    isEarlyOut: false,
    status: "Pending"
  },
  {
    id: "att-6",
    sibsId: "1245",
    employeeName: "BATACAN, ALENA MENDOZA",
    department: "Management Team",
    account: "Managers",
    site: "Hybrid",
    trackerDate: "2026-07-20",
    loginTime: "09:00 AM",
    startBreak: "12:00 PM",
    endBreak: "01:00 PM",
    logoutTime: "06:00 PM",
    isLate: false,
    isEarlyOut: false,
    status: "Approved"
  },
  {
    id: "att-7",
    sibsId: "3311",
    employeeName: "DULLA, RALPH VINCENT",
    department: "IT (Information and Communications Technology)",
    account: "Software Management",
    site: "Davao",
    trackerDate: "2026-07-20",
    loginTime: "08:45 AM",
    startBreak: "12:00 PM",
    endBreak: "01:00 PM",
    logoutTime: "06:15 PM",
    isLate: false,
    isEarlyOut: false,
    status: "Approved"
  },
  {
    id: "att-8",
    sibsId: "5112",
    employeeName: "ESPINOSA, MARIA CARMELA",
    department: "Call Center Operations",
    account: "Yomdel Property",
    site: "Tagum",
    trackerDate: "2026-07-19",
    loginTime: "09:15 AM",
    startBreak: "01:00 PM",
    endBreak: "02:00 PM",
    logoutTime: "06:15 PM",
    isLate: true,
    isEarlyOut: false,
    status: "Approved"
  },
  {
    id: "att-9",
    sibsId: "4401",
    employeeName: "DE LOS REYES, JONATHAN",
    department: "IT (Information and Communications Technology)",
    account: "Software Management",
    site: "Hybrid",
    trackerDate: "2026-07-19",
    loginTime: "08:58 AM",
    startBreak: "12:00 PM",
    endBreak: "01:00 PM",
    logoutTime: "05:30 PM",
    isLate: false,
    isEarlyOut: true,
    status: "Rejected"
  },
  {
    id: "att-10",
    sibsId: "2987",
    employeeName: "SALVADOR, KEVIN ROY",
    department: "Call Center Operations",
    account: "Physicians Footcare",
    site: "Davao",
    trackerDate: "2026-07-19",
    loginTime: "09:02 AM",
    startBreak: "12:00 PM",
    endBreak: "01:00 PM",
    logoutTime: "07:30 PM",
    isLate: false,
    isEarlyOut: false,
    status: "Approved"
  }
];

export default function TimeAndAttendance() {
  const [records, setRecords] = useState<AttendanceRecord[]>(INITIAL_ATTENDANCE_RECORDS);
  
  // Filters state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
  const [selectedAccount, setSelectedAccount] = useState("All Accounts");
  const [fromDate, setFromDate] = useState("2026-07-19");
  const [toDate, setToDate] = useState("2026-07-21");

  // Selection state for batch approvals
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);

  // Modal states for adding/editing record
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null);

  // Form states for add/edit modal
  const [formSibsId, setFormSibsId] = useState("");
  const [formEmployeeName, setFormEmployeeName] = useState("");
  const [formDepartment, setFormDepartment] = useState("IT (Information and Communications Technology)");
  const [formAccount, setFormAccount] = useState("Software Management");
  const [formSite, setFormSite] = useState("Davao");
  const [formTrackerDate, setFormTrackerDate] = useState("2026-07-20");
  const [formLogin, setFormLogin] = useState("09:00 AM");
  const [formStartBreak, setFormStartBreak] = useState("12:00 PM");
  const [formEndBreak, setFormEndBreak] = useState("01:00 PM");
  const [formLogout, setFormLogout] = useState("06:00 PM");
  const [formStatus, setFormStatus] = useState<"Approved" | "Pending" | "Rejected">("Pending");

  // Options for dropdowns based on actual dataset and company settings
  const departmentsList = [
    "All Departments",
    "IT (Information and Communications Technology)",
    "Management Team",
    "Call Center Operations"
  ];

  const accountsList = [
    "All Accounts",
    "Software Management",
    "Managers",
    "Yomdel Property",
    "Physicians Footcare"
  ];

  const sitesList = ["Davao", "Tagum", "Hybrid"];

  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedDepartment("All Departments");
    setSelectedAccount("All Accounts");
    setFromDate("2026-07-19");
    setToDate("2026-07-21");
  };

  // Helper to compute individual row metrics
  const computeRowMetrics = (record: AttendanceRecord) => {
    const loginMin = timeToMinutes(record.loginTime);
    const logoutMin = timeToMinutes(record.logoutTime);
    const breakStartMin = timeToMinutes(record.startBreak);
    const breakEndMin = timeToMinutes(record.endBreak);

    // Break hours
    let bh = 0;
    if (breakEndMin > breakStartMin && breakStartMin > 0) {
      bh = (breakEndMin - breakStartMin) / 60;
    } else {
      bh = 1.0; // standard 1 hour break default
    }

    // Total hours between login and logout
    let rawTotalMin = 0;
    if (logoutMin > loginMin) {
      rawTotalMin = logoutMin - loginMin;
    } else if (logoutMin < loginMin && logoutMin > 0) {
      // Overnight shift
      rawTotalMin = (24 * 60 - loginMin) + logoutMin;
    }

    const rawTotalHours = rawTotalMin / 60;
    
    // Net hours (less break)
    const netHours = Math.max(0, rawTotalHours - bh);
    
    // Work Hours (WH) capped at 8.0
    const wh = Math.min(8.0, netHours);
    
    // Overtime Hours (OT)
    const ot = netHours > 8.0 ? parseFloat((netHours - 8.0).toFixed(2)) : 0;
    
    // Approved Total Hours (ATH) - only positive if Approved
    const ath = record.status === "Approved" ? parseFloat((wh + ot).toFixed(2)) : 0;

    return {
      wh: parseFloat(wh.toFixed(2)),
      bh: parseFloat(bh.toFixed(2)),
      ot,
      ath
    };
  };

  // Filtered attendance list
  const filteredRecords = useMemo(() => {
    return records.filter(rec => {
      // Search
      const matchesSearch = 
        rec.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.sibsId.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Department
      const matchesDept = 
        selectedDepartment === "All Departments" || 
        rec.department === selectedDepartment;
      
      // Account
      const matchesAccount = 
        selectedAccount === "All Accounts" || 
        rec.account === selectedAccount;

      // Dates
      const recDate = new Date(rec.trackerDate);
      const start = fromDate ? new Date(fromDate) : null;
      const end = toDate ? new Date(toDate) : null;

      let matchesDate = true;
      if (start) {
        recDate.setHours(0,0,0,0);
        start.setHours(0,0,0,0);
        if (recDate < start) matchesDate = false;
      }
      if (end) {
        recDate.setHours(0,0,0,0);
        end.setHours(0,0,0,0);
        if (recDate > end) matchesDate = false;
      }

      return matchesSearch && matchesDept && matchesAccount && matchesDate;
    });
  }, [records, searchTerm, selectedDepartment, selectedAccount, fromDate, toDate]);

  // Overall Statistics (Dynamic based on filtered dataset)
  const stats = useMemo(() => {
    const loadedCount = filteredRecords.length;
    const approvedCount = filteredRecords.filter(r => r.status === "Approved").length;
    const pendingCount = filteredRecords.filter(r => r.status === "Pending").length;
    
    // Sum of Work Hours for the filtered page
    let totalPageWh = 0;
    filteredRecords.forEach(r => {
      const metrics = computeRowMetrics(r);
      totalPageWh += metrics.wh;
    });

    return {
      loaded: loadedCount,
      approved: approvedCount,
      pending: pendingCount,
      pageWh: parseFloat(totalPageWh.toFixed(1))
    };
  }, [filteredRecords]);

  // Quick Action triggers
  const handleQuickStatusChange = (id: string, newStatus: "Approved" | "Pending" | "Rejected") => {
    setRecords(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
  };

  // Bulk Actions
  const handleBulkStatusChange = (newStatus: "Approved" | "Pending" | "Rejected") => {
    if (selectedRowIds.length === 0) return;
    setRecords(prev => prev.map(r => selectedRowIds.includes(r.id) ? { ...r, status: newStatus } : r));
    setSelectedRowIds([]);
  };

  // Delete Action
  const handleDeleteRecord = (id: string) => {
    if (confirm("Are you sure you want to delete this attendance record?")) {
      setRecords(prev => prev.filter(r => r.id !== id));
      setSelectedRowIds(prev => prev.filter(rowId => rowId !== id));
    }
  };

  // Select / Unselect Rows
  const toggleRowSelection = (id: string) => {
    setSelectedRowIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
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
    setFormDepartment("IT (Information and Communications Technology)");
    setFormAccount("Software Management");
    setFormSite("Davao");
    setFormTrackerDate("2026-07-20");
    setFormLogin("09:00 AM");
    setFormStartBreak("12:00 PM");
    setFormEndBreak("01:00 PM");
    setFormLogout("06:00 PM");
    setFormStatus("Pending");
    setIsAddEditModalOpen(true);
  };

  // Open Form to Edit
  const openEditModal = (record: AttendanceRecord) => {
    setEditingRecord(record);
    setFormSibsId(record.sibsId);
    setFormEmployeeName(record.employeeName);
    setFormDepartment(record.department);
    setFormAccount(record.account);
    setFormSite(record.site);
    setFormTrackerDate(record.trackerDate);
    setFormLogin(record.loginTime);
    setFormStartBreak(record.startBreak);
    setFormEndBreak(record.endBreak);
    setFormLogout(record.logoutTime);
    setFormStatus(record.status);
    setIsAddEditModalOpen(true);
  };

  // Handle submit Add/Edit
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formSibsId || !formEmployeeName) {
      alert("Please specify both SiBS ID and Employee Name");
      return;
    }

    // Determine if late (shift starts at 9:00 AM)
    const loginMin = timeToMinutes(formLogin);
    const startShiftMin = 9 * 60; // 9:00 AM
    const isLate = loginMin > startShiftMin;

    // Determine if early out (shift ends at 6:00 PM)
    const logoutMin = timeToMinutes(formLogout);
    const endShiftMin = 18 * 60; // 6:00 PM
    const isEarlyOut = logoutMin < endShiftMin;

    if (editingRecord) {
      // Edit existing
      setRecords(prev => prev.map(r => r.id === editingRecord.id ? {
        ...r,
        sibsId: formSibsId,
        employeeName: formEmployeeName.toUpperCase(),
        department: formDepartment,
        account: formAccount,
        site: formSite,
        trackerDate: formTrackerDate,
        loginTime: formLogin,
        startBreak: formStartBreak,
        endBreak: formEndBreak,
        logoutTime: formLogout,
        isLate,
        isEarlyOut,
        status: formStatus
      } : r));
    } else {
      // Add new
      const newRec: AttendanceRecord = {
        id: "att-" + Date.now(),
        sibsId: formSibsId,
        employeeName: formEmployeeName.toUpperCase(),
        department: formDepartment,
        account: formAccount,
        site: formSite,
        trackerDate: formTrackerDate,
        loginTime: formLogin,
        startBreak: formStartBreak,
        endBreak: formEndBreak,
        logoutTime: formLogout,
        isLate,
        isEarlyOut,
        status: formStatus
      };
      setRecords(prev => [newRec, ...prev]);
    }

    setIsAddEditModalOpen(false);
    setEditingRecord(null);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen pb-12 select-none" id="attendance-module-container">
      {/* ==================== PAGE HEADER ==================== */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] bg-[#FF5C28]/10 text-[#FF5C28] px-2.5 py-0.5 rounded-full font-bold border border-[#FF5C28]/20 uppercase tracking-wider flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Time & Attendance
            </span>
          </div>
          <h1 className="text-2xl font-black text-[#042C51] tracking-tight">Enterprise Time Tracker</h1>
          <p className="text-xs text-[#667085] leading-normal">
            Monitor clock-in/out, audit late entries, calculate work hours, and approve timesheets.
          </p>
        </div>

        {/* Create manual record button */}
        <button
          onClick={openAddModal}
          className="bg-[#FF5C28] hover:bg-[#e04b1a] text-white text-xs font-black px-4 py-2.5 rounded-xl shadow-md shadow-[#ff5c28]/15 flex items-center gap-2 transition-all duration-150 transform active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Attendance Record</span>
        </button>
      </div>

      {/* ==================== 1. OVERVIEW SUMMARY (Filtered Statistics) ==================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6" id="attendance-summary-cards">
        {/* Loaded Attendance Card */}
        <div className="bg-white p-3.5 rounded-xl border border-[#E6ECF2] shadow-sm flex flex-col justify-between relative overflow-hidden h-[115px] transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">LOADED ATTENDANCE</span>
            <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <Calendar className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-1.5">
            <div className="text-xl font-extrabold text-[#042C51] tracking-tight">{stats.loaded}</div>
            <div className="text-[9px] text-slate-400 font-bold mt-1 uppercase tracking-wide">Records matching filters</div>
          </div>
        </div>

        {/* Approved Card */}
        <div className="bg-white p-3.5 rounded-xl border border-[#E6ECF2] shadow-sm flex flex-col justify-between relative overflow-hidden h-[115px] transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">APPROVED</span>
            <div className="w-7 h-7 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CheckCircle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-1.5">
            <div className="text-xl font-extrabold text-emerald-600 tracking-tight">{stats.approved}</div>
            <div className="text-[9px] text-emerald-600/80 font-bold mt-1 uppercase tracking-wide">Ready for payroll dispatch</div>
          </div>
        </div>

        {/* Pending Card */}
        <div className="bg-white p-3.5 rounded-xl border border-[#E6ECF2] shadow-sm flex flex-col justify-between relative overflow-hidden h-[115px] transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">PENDING REVIEW</span>
            <div className="w-7 h-7 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
              <AlertCircle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-1.5">
            <div className="text-xl font-extrabold text-amber-500 tracking-tight">{stats.pending}</div>
            <div className="text-[9px] text-amber-500/80 font-bold mt-1 uppercase tracking-wide">Awaiting supervisor sign-off</div>
          </div>
        </div>

        {/* Page WH Card */}
        <div className="bg-white p-3.5 rounded-xl border border-[#E6ECF2] shadow-sm flex flex-col justify-between relative overflow-hidden h-[115px] transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">COMPUTED WORK HOURS</span>
            <div className="w-7 h-7 rounded-full bg-[#FF5C28]/5 flex items-center justify-center text-[#FF5C28]">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-1.5">
            <div className="text-xl font-extrabold text-[#FF5C28] tracking-tight">{stats.pageWh} hrs</div>
            <div className="text-[9px] text-slate-400 font-bold mt-1 uppercase tracking-wide">Total Page Work Hours (WH)</div>
          </div>
        </div>
      </div>

      {/* ==================== 2. FILTERS & CONTROLS ==================== */}
      <CentralizedFilters
        title="Refine Filters"
        onReset={handleResetFilters}
        search={{
          label: "Search Employee",
          placeholder: "Name or SiBS ID...",
          value: searchTerm,
          onChange: setSearchTerm,
        }}
        selects={[
          {
            label: "Department",
            value: selectedDepartment,
            onChange: setSelectedDepartment,
            options: departmentsList,
          },
          {
            label: "Account",
            value: selectedAccount,
            onChange: setSelectedAccount,
            options: accountsList,
          }
        ]}
        dateFrom={{
          label: "From Date",
          value: fromDate,
          onChange: setFromDate,
        }}
        dateTo={{
          label: "To Date",
          value: toDate,
          onChange: setToDate,
        }}
      />

      {/* ==================== 3. ATTENDANCE RECORDS (Table & Batch Actions) ==================== */}
      <div className="bg-white rounded-2xl border border-[#E6ECF2] shadow-sm overflow-hidden" id="attendance-table-panel">
        
        {/* Bulk action toolbar if row(s) selected */}
        <AnimatePresence>
          {selectedRowIds.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-[#042C51] text-white px-5 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-blue-900"
            >
              <div className="flex items-center gap-2 text-xs font-bold">
                <span className="flex items-center justify-center bg-[#FF5C28] text-white text-[10px] w-5 h-5 rounded-full font-black">
                  {selectedRowIds.length}
                </span>
                <span>Timesheets Selected for Batch Action</span>
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

        {/* Table content */}
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
                <th className="py-4 px-4 w-24">SiBS ID</th>
                <th className="py-4 px-4 min-w-[180px]">Employee Name</th>
                <th className="py-4 px-4 min-w-[150px]">Department</th>
                <th className="py-4 px-4 min-w-[130px]">Account</th>
                <th className="py-4 px-4 w-24">Site</th>
                <th className="py-4 px-4 w-28">Tracker Date</th>
                <th className="py-4 px-4 min-w-[120px]">Login (In)</th>
                <th className="py-4 px-4 w-24">Start Break</th>
                <th className="py-4 px-4 w-24">End Break</th>
                <th className="py-4 px-4 min-w-[120px]">Logout (Out)</th>
                <th className="py-4 px-3 text-center w-14">WH</th>
                <th className="py-4 px-3 text-center w-14">BH</th>
                <th className="py-4 px-3 text-center w-14">OT</th>
                <th className="py-4 px-3 text-center w-16">ATH</th>
                <th className="py-4 px-4 text-center w-28">Status</th>
                <th className="py-4 px-4 text-center w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9] text-xs font-medium text-[#042C51]">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={17} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Clock className="w-10 h-10 text-slate-300 stroke-[1.5]" />
                      <p className="font-bold text-sm">No Attendance Records Found</p>
                      <p className="text-xs">Adjust your search input or date range filters.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec) => {
                  const isSelected = selectedRowIds.includes(rec.id);
                  const metrics = computeRowMetrics(rec);

                  return (
                    <tr 
                      key={rec.id}
                      className={`hover:bg-[#F8FAFC] transition-colors ${
                        isSelected ? "bg-[#E9F0FC]/40" : ""
                      }`}
                    >
                      {/* Checkbox selector */}
                      <td className="py-3 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleRowSelection(rec.id)}
                          className="rounded text-[#FF5C28] focus:ring-[#FF5C28]"
                        />
                      </td>

                      {/* SiBS ID */}
                      <td className="py-3 px-4 font-mono font-bold text-slate-500">
                        {rec.sibsId}
                      </td>

                      {/* Employee Name */}
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {rec.employeeName}
                      </td>

                      {/* Department */}
                      <td className="py-3 px-4 text-slate-600 truncate max-w-[180px]" title={rec.department}>
                        {rec.department}
                      </td>

                      {/* Account */}
                      <td className="py-3 px-4 text-slate-600 font-bold truncate max-w-[140px]" title={rec.account}>
                        {rec.account}
                      </td>

                      {/* Site */}
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                          rec.site === "Davao" 
                            ? "bg-purple-50 text-purple-700 border border-purple-100" 
                            : rec.site === "Tagum"
                              ? "bg-blue-50 text-blue-700 border border-blue-100"
                              : "bg-teal-50 text-teal-700 border border-teal-100"
                        }`}>
                          {rec.site}
                        </span>
                      </td>

                      {/* Tracker Date */}
                      <td className="py-3 px-4 font-bold text-slate-600">
                        {new Date(rec.trackerDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })}
                      </td>

                      {/* Login timestamp */}
                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          <span className="font-mono font-bold">{rec.loginTime}</span>
                          {rec.isLate ? (
                            <span className="text-[9px] text-rose-500 font-bold flex items-center gap-0.5 mt-0.5 animate-pulse">
                              <span className="w-1 h-1 rounded-full bg-rose-500"></span>
                              Late clock-in
                            </span>
                          ) : (
                            <span className="text-[9px] text-emerald-500 font-bold flex items-center gap-0.5 mt-0.5">
                              <span className="w-1 h-1 rounded-full bg-emerald-500"></span>
                              On-Time
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Start Break */}
                      <td className="py-3 px-4 font-mono font-bold text-slate-500">
                        {rec.startBreak || "—"}
                      </td>

                      {/* End Break */}
                      <td className="py-3 px-4 font-mono font-bold text-slate-500">
                        {rec.endBreak || "—"}
                      </td>

                      {/* Logout timestamp */}
                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          <span className="font-mono font-bold">{rec.logoutTime || "—"}</span>
                          {rec.isEarlyOut ? (
                            <span className="text-[9px] text-amber-500 font-bold flex items-center gap-0.5 mt-0.5">
                              <span className="w-1 h-1 rounded-full bg-amber-500"></span>
                              Early logout
                            </span>
                          ) : rec.logoutTime && !rec.isEarlyOut ? (
                            <span className="text-[9px] text-emerald-500 font-bold flex items-center gap-0.5 mt-0.5">
                              <span className="w-1 h-1 rounded-full bg-emerald-500"></span>
                              Full Shift
                            </span>
                          ) : null}
                        </div>
                      </td>

                      {/* WH (Work Hours) */}
                      <td className="py-3 px-3 text-center font-mono font-bold text-slate-900 bg-slate-50/50">
                        {metrics.wh.toFixed(1)}
                      </td>

                      {/* BH (Break Hours) */}
                      <td className="py-3 px-3 text-center font-mono text-slate-500">
                        {metrics.bh.toFixed(1)}
                      </td>

                      {/* OT (Overtime Hours) */}
                      <td className="py-3 px-3 text-center font-mono font-bold text-blue-600 bg-blue-50/20">
                        {metrics.ot > 0 ? `+${metrics.ot.toFixed(1)}` : "—"}
                      </td>

                      {/* ATH (Approved Total Hours) */}
                      <td className="py-3 px-3 text-center font-mono font-bold text-[#FF5C28] bg-orange-50/10">
                        {rec.status === "Approved" ? metrics.ath.toFixed(1) : "—"}
                      </td>

                      {/* Status badge */}
                      <td className="py-3 px-4 text-center">
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

                      {/* Action buttons */}
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Approve/Reject Toggle */}
                          {rec.status !== "Approved" && (
                            <button
                              onClick={() => handleQuickStatusChange(rec.id, "Approved")}
                              title="Approve Timesheet"
                              className="p-1 text-emerald-600 hover:bg-emerald-50 rounded transition-colors cursor-pointer"
                            >
                              <CheckCircle className="w-4 h-4 stroke-[2.5]" />
                            </button>
                          )}
                          {rec.status !== "Rejected" && (
                            <button
                              onClick={() => handleQuickStatusChange(rec.id, "Rejected")}
                              title="Reject Timesheet"
                              className="p-1 text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                            >
                              <XCircle className="w-4 h-4 stroke-[2.5]" />
                            </button>
                          )}
                          
                          {/* Edit Details */}
                          <button
                            onClick={() => openEditModal(rec)}
                            title="Edit Record"
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => handleDeleteRecord(rec.id)}
                            title="Delete Record"
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
        
        {/* Simple Page Footer */}
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

      {/* ==================== ADD / EDIT ATTENDANCE RECORD MODAL ==================== */}
      <AnimatePresence>
        {isAddEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl border border-[#E6ECF2] shadow-2xl max-w-lg w-full overflow-hidden"
            >
              {/* Modal header */}
              <div className="bg-[#042C51] text-white p-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#FF5C28]" />
                  <h3 className="font-black text-sm">
                    {editingRecord ? "Edit Attendance Entry" : "Create Attendance Record"}
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

              {/* Modal form body */}
              <form onSubmit={handleSaveForm} className="p-6 space-y-4">
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

                <div className="grid grid-cols-3 gap-4">
                  {/* Department */}
                  <div className="col-span-2 flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Department</label>
                    <select
                      value={formDepartment}
                      onChange={e => setFormDepartment(e.target.value)}
                      className="bg-[#F8FAFC] border border-[#E6ECF2] rounded-xl px-3 py-2 text-xs font-bold text-[#042C51] focus:outline-none"
                    >
                      {departmentsList.slice(1).map((dept, idx) => (
                        <option key={idx} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>

                  {/* Site */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Site</label>
                    <select
                      value={formSite}
                      onChange={e => setFormSite(e.target.value)}
                      className="bg-[#F8FAFC] border border-[#E6ECF2] rounded-xl px-3 py-2 text-xs font-bold text-[#042C51] focus:outline-none"
                    >
                      {sitesList.map((site, idx) => (
                        <option key={idx} value={site}>{site}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Account */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Account</label>
                    <select
                      value={formAccount}
                      onChange={e => setFormAccount(e.target.value)}
                      className="bg-[#F8FAFC] border border-[#E6ECF2] rounded-xl px-3 py-2 text-xs font-bold text-[#042C51] focus:outline-none"
                    >
                      {accountsList.slice(1).map((acc, idx) => (
                        <option key={idx} value={acc}>{acc}</option>
                      ))}
                    </select>
                  </div>

                  {/* Tracker Date */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Shift Date</label>
                    <input
                      type="date"
                      value={formTrackerDate}
                      onChange={e => setFormTrackerDate(e.target.value)}
                      className="bg-[#F8FAFC] border border-[#E6ECF2] rounded-xl px-3 py-2 text-xs font-bold text-[#042C51] focus:outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Timestamps Grid */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-[#E6ECF2] space-y-3">
                  <span className="text-[10px] font-extrabold text-[#042C51] uppercase tracking-wide block border-b pb-1.5">
                    Shift Timestamps (Format: HH:MM AM/PM)
                  </span>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {/* Login */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Login Time (In)</label>
                      <input
                        type="text"
                        value={formLogin}
                        onChange={e => setFormLogin(e.target.value)}
                        placeholder="e.g. 09:00 AM"
                        className="bg-white border border-[#E6ECF2] rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold text-[#042C51]"
                        required
                      />
                    </div>

                    {/* Logout */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Logout Time (Out)</label>
                      <input
                        type="text"
                        value={formLogout}
                        onChange={e => setFormLogout(e.target.value)}
                        placeholder="e.g. 06:00 PM"
                        className="bg-white border border-[#E6ECF2] rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold text-[#042C51]"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Break Start */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Start Break</label>
                      <input
                        type="text"
                        value={formStartBreak}
                        onChange={e => setFormStartBreak(e.target.value)}
                        placeholder="e.g. 12:00 PM"
                        className="bg-white border border-[#E6ECF2] rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold text-[#042C51]"
                      />
                    </div>

                    {/* Break End */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">End Break</label>
                      <input
                        type="text"
                        value={formEndBreak}
                        onChange={e => setFormEndBreak(e.target.value)}
                        placeholder="e.g. 01:00 PM"
                        className="bg-white border border-[#E6ECF2] rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold text-[#042C51]"
                      />
                    </div>
                  </div>
                </div>

                {/* Status selection */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Timesheet Approval Status</label>
                  <div className="flex gap-2">
                    {["Pending", "Approved", "Rejected"].map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setFormStatus(st as any)}
                        className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                          formStatus === st
                            ? st === "Approved"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                              : st === "Rejected"
                                ? "bg-rose-50 text-rose-700 border-rose-300"
                                : "bg-amber-50 text-amber-700 border-amber-300"
                            : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Form Footer buttons */}
                <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#F1F5F9] mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddEditModalOpen(false);
                      setEditingRecord(null);
                    }}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black px-4 py-2.5 rounded-xl cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#FF5C28] hover:bg-[#e04b1a] text-white text-xs font-black px-5 py-2.5 rounded-xl shadow-md cursor-pointer transition-colors"
                  >
                    {editingRecord ? "Save Changes" : "Submit Entry"}
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
