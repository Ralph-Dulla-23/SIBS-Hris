import React, { useState, useMemo } from "react";
import CentralizedFilters from "./CentralizedFilters";
import {
  ShieldCheck,
  Users,
  Activity,
  Layers,
  Clock,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Plus,
  UserPlus,
  CheckSquare,
  PieChart,
  Settings,
  Briefcase,
  FileText,
  Search,
  Filter,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Building2,
  DollarSign,
  UserCheck,
  UserX,
  FileCheck,
  SlidersHorizontal,
  Lock,
  Eye,
  Download,
  X,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SuperAdminDashboardProps {
  userEmail?: string;
  onSwitchModule?: (module: string) => void;
}

// 7 Grounded Access Levels
export type AdminAccessLevel =
  | "1 - TA"
  | "2 - HR"
  | "3 - HR Admin"
  | "4 - Finance"
  | "5 - Manager"
  | "6 - Executive"
  | "7 - Super Admin";

interface AdminAccount {
  id: string;
  name: string;
  email: string;
  accessLevel: AdminAccessLevel;
  department: string;
  accountGroup: string;
  lastActive: string;
  status: "Active" | "Pending Mapping" | "Locked";
  hasAccessMismatch?: boolean;
}

interface RiskException {
  id: string;
  category:
    | "Unmapped User"
    | "Pending Resignation"
    | "Pending Leave"
    | "Attendance Flag"
    | "Recruitment Action"
    | "Stuck Approval";
  title: string;
  description: string;
  severity: "High" | "Medium" | "Low";
  moduleTarget: string;
  assignedTo: string;
  daysPending: number;
}

interface ActivityLog {
  id: string;
  timestamp: string;
  actor: string;
  accessLevel: string;
  module: string;
  action: string;
  details: string;
  status: "Success" | "Flagged" | "Info";
}

export default function SuperAdminDashboard({
  userEmail = "dulla13ralph@gmail.com",
  onSwitchModule
}: SuperAdminDashboardProps) {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<
    "overview" | "exceptions" | "access_roles" | "ops_snapshot" | "activity_logs"
  >("overview");

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAccessLevel, setSelectedAccessLevel] = useState("All Access Levels");
  const [selectedModule, setSelectedModule] = useState("All Modules");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [selectedAccount, setSelectedAccount] = useState("All Accounts");

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Add Admin Modal State
  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false);
  const [newAdminName, setNewAdminName] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminLevel, setNewAdminLevel] = useState<AdminAccessLevel>("3 - HR Admin");
  const [newAdminDepartment, setNewAdminDepartment] = useState("Human Resources");
  const [newAdminAccount, setNewAdminAccount] = useState("Internal HR Ops");

  // Admin User Database (Grounded 7 Access Levels)
  const [adminUsers, setAdminUsers] = useState<AdminAccount[]>([
    {
      id: "ADM-001",
      name: "Ralph Dulla",
      email: "dulla13ralph@gmail.com",
      accessLevel: "7 - Super Admin",
      department: "Executive Tech",
      accountGroup: "Internal HR Ops",
      lastActive: "Today at 01:05",
      status: "Active"
    },
    {
      id: "ADM-002",
      name: "Alena Batacan",
      email: "alena.batacan@thesiblingssolutions.com",
      accessLevel: "3 - HR Admin",
      department: "People Operations",
      accountGroup: "Verizon Tech",
      lastActive: "Today at 00:45",
      status: "Active"
    },
    {
      id: "ADM-003",
      name: "Marcus Vance",
      email: "marcus.vance@thesiblingssolutions.com",
      accessLevel: "1 - TA",
      department: "Talent Acquisition",
      accountGroup: "Comcast Support",
      lastActive: "Yesterday at 18:20",
      status: "Active"
    },
    {
      id: "ADM-004",
      name: "Samantha Reed",
      email: "s.reed@thesiblingssolutions.com",
      accessLevel: "4 - Finance",
      department: "Finance & Payroll",
      accountGroup: "Aetna Health",
      lastActive: "Yesterday at 16:10",
      status: "Active"
    },
    {
      id: "ADM-005",
      name: "David Chen",
      email: "david.c@thesiblingssolutions.com",
      accessLevel: "6 - Executive",
      department: "Executive Leadership",
      accountGroup: "Internal HR Ops",
      lastActive: "3 days ago",
      status: "Active"
    },
    {
      id: "ADM-006",
      name: "Patricia Miller",
      email: "p.miller@thesiblingssolutions.com",
      accessLevel: "5 - Manager",
      department: "Technical Support",
      accountGroup: "Verizon Tech",
      lastActive: "Today at 00:12",
      status: "Active"
    },
    {
      id: "ADM-007",
      name: "Robert Taylor",
      email: "r.taylor@thesiblingssolutions.com",
      accessLevel: "2 - HR",
      department: "Employee Relations",
      accountGroup: "Global WFM",
      lastActive: "4 days ago",
      status: "Pending Mapping",
      hasAccessMismatch: true
    }
  ]);

  // Risk & Exception Items
  const [exceptions, setExceptions] = useState<RiskException[]>([
    {
      id: "EXC-101",
      category: "Unmapped User",
      title: "3 New Hires Missing Department / Account Mapping",
      description: "Employee records created in Comcast account missing cost center and manager assignment.",
      severity: "High",
      moduleTarget: "Employee Directory",
      assignedTo: "Alena Batacan",
      daysPending: 3
    },
    {
      id: "EXC-102",
      category: "Pending Resignation",
      title: "Resignation Clearance Nearing Last Working Date",
      description: "Senior Agent John Doe (SIBS-8012) resignation effective in 3 days. Exit clearance pending manager signoff.",
      severity: "High",
      moduleTarget: "Resignation Management",
      assignedTo: "HR Operations",
      daysPending: 9
    },
    {
      id: "EXC-103",
      category: "Pending Leave",
      title: "Maternity Leave Request Pending Approval > 5 Days",
      description: "Maria Santos (SIBS-3341) leave request awaiting Executive signoff for 6 days.",
      severity: "Medium",
      moduleTarget: "Leaves Management",
      assignedTo: "David Chen",
      daysPending: 6
    },
    {
      id: "EXC-104",
      category: "Attendance Flag",
      title: "14 Timecard Biometric Variances Pending Review",
      description: "Night Shift timecards flagged for missing checkout punches requiring WFM validation.",
      severity: "Medium",
      moduleTarget: "Time & Attendance",
      assignedTo: "WFM Lead",
      daysPending: 2
    },
    {
      id: "EXC-105",
      category: "Stuck Approval",
      title: "Job Requisition #REQ-409 Awaiting Budget Signoff",
      description: "DevOps Engineer requisition pending Finance budget clearance for 8 days.",
      severity: "High",
      moduleTarget: "Action Items",
      assignedTo: "Samantha Reed",
      daysPending: 8
    },
    {
      id: "EXC-106",
      category: "Recruitment Action",
      title: "2 Candidate Offers Pending Acceptance > 7 Days",
      description: "Offer letters issued 7+ days ago with no candidate response recorded.",
      severity: "Low",
      moduleTarget: "Offers & Onboarding",
      assignedTo: "Marcus Vance",
      daysPending: 7
    }
  ]);

  // System & Module Activity Logs
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([
    {
      id: "LOG-501",
      timestamp: "2026-07-22 00:52",
      actor: "dulla13ralph@gmail.com",
      accessLevel: "7 - Super Admin",
      module: "Access Governance",
      action: "UPDATED_ADMIN_LEVEL",
      details: "Updated Alena Batacan access level to 3 - HR Admin.",
      status: "Success"
    },
    {
      id: "LOG-502",
      timestamp: "2026-07-21 23:14",
      actor: "alena.batacan@thesiblingssolutions.com",
      accessLevel: "3 - HR Admin",
      module: "Employee Directory",
      action: "UPDATED_EMPLOYEE_RECORD",
      details: "Assigned department code 'TECH-SUPP' to 12 new hires.",
      status: "Success"
    },
    {
      id: "LOG-503",
      timestamp: "2026-07-21 21:40",
      actor: "marcus.vance@thesiblingssolutions.com",
      accessLevel: "1 - TA",
      module: "Candidate Pipeline",
      action: "ISSUED_OFFER_LETTER",
      details: "Generated job offer letter for candidate 'Jerome Miller'.",
      status: "Success"
    },
    {
      id: "LOG-504",
      timestamp: "2026-07-21 19:05",
      actor: "s.reed@thesiblingssolutions.com",
      accessLevel: "4 - Finance",
      module: "Payroll",
      action: "APPROVED_PAYROLL_RUN",
      details: "Approved bi-monthly payroll summary for Verizon Tech account.",
      status: "Success"
    },
    {
      id: "LOG-505",
      timestamp: "2026-07-21 17:30",
      actor: "SYSTEM_VALIDATOR",
      accessLevel: "System",
      module: "Time & Attendance",
      action: "FLAGGED_ATTENDANCE_MISMATCH",
      details: "Identified 14 unverified biometric checkout records.",
      status: "Flagged"
    }
  ]);

  // Filtered Exception Items
  const filteredExceptions = useMemo(() => {
    return exceptions.filter((exc) => {
      const matchesSearch =
        exc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exc.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesModule =
        selectedModule === "All Modules" || exc.moduleTarget.includes(selectedModule);
      return matchesSearch && matchesModule;
    });
  }, [exceptions, searchTerm, selectedModule]);

  // Filtered Admin Accounts
  const filteredAdmins = useMemo(() => {
    return adminUsers.filter((adm) => {
      const matchesSearch =
        adm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        adm.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        adm.department.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLevel =
        selectedAccessLevel === "All Access Levels" || adm.accessLevel === selectedAccessLevel;
      const matchesAccount =
        selectedAccount === "All Accounts" || adm.accountGroup === selectedAccount;
      const matchesStatus =
        selectedStatus === "All Statuses" || adm.status === selectedStatus;
      return matchesSearch && matchesLevel && matchesAccount && matchesStatus;
    });
  }, [adminUsers, searchTerm, selectedAccessLevel, selectedAccount, selectedStatus]);

  // Filtered Activity Logs
  const filteredLogs = useMemo(() => {
    return activityLogs.filter((log) => {
      const matchesSearch =
        log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesModule =
        selectedModule === "All Modules" || log.module.includes(selectedModule);
      return matchesSearch && matchesModule;
    });
  }, [activityLogs, searchTerm, selectedModule]);

  // Add Admin Handler
  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminName || !newAdminEmail) return;

    const newAdmin: AdminAccount = {
      id: `ADM-${Math.floor(100 + Math.random() * 900)}`,
      name: newAdminName,
      email: newAdminEmail,
      accessLevel: newAdminLevel,
      department: newAdminDepartment,
      accountGroup: newAdminAccount,
      lastActive: "Just created",
      status: "Active"
    };

    setAdminUsers((prev) => [newAdmin, ...prev]);

    // Log Activity
    const newLog: ActivityLog = {
      id: `LOG-${Math.floor(500 + Math.random() * 500)}`,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
      actor: userEmail,
      accessLevel: "7 - Super Admin",
      module: "Access Governance",
      action: "CREATED_ADMIN_USER",
      details: `Provisioned ${newAdminLevel} permissions for ${newAdminEmail}.`,
      status: "Success"
    };
    setActivityLogs((prev) => [newLog, ...prev]);

    setNewAdminName("");
    setNewAdminEmail("");
    setIsAddAdminOpen(false);
    triggerToast(`Added administrator account for ${newAdminEmail}`);
  };

  // Resolve Exception Handler
  const handleResolveException = (id: string, title: string) => {
    setExceptions((prev) => prev.filter((e) => e.id !== id));
    triggerToast(`Resolved exception: "${title}"`);
  };

  return (
    <div className="w-full text-[#101828] select-none space-y-6 pb-12">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-8 z-50 bg-[#042C51] text-white px-5 py-3 rounded-xl shadow-2xl border border-blue-400 flex items-center gap-3 text-xs font-bold"
          >
            <Sparkles className="w-4 h-4 text-[#FF5C28]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================== 1. PAGE HEADER ==================== */}
      <div className="bg-white p-6 rounded-2xl border border-[#E6ECF2] shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-[#042C51] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-[#FF5C28]" />
                Super Admin Operations Dashboard
              </span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                System Governance Online
              </span>
            </div>
            <h1 className="text-2xl font-black text-[#042C51] tracking-tight">
              Whole-System HRIS Operations & Governance
            </h1>
            <p className="text-xs text-[#667085] leading-relaxed max-w-3xl">
              Cross-module visibility, user access role governance, risk exception monitoring, approval queue routing, and operational snapshots across HR, TA, OM, and Finance modules.
            </p>
          </div>

          {/* Top Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsAddAdminOpen(true)}
              className="px-3.5 py-2 bg-[#042C51] hover:bg-[#063866] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <UserPlus className="w-3.5 h-3.5 text-[#FF5C28]" />
              Add Admin / User
            </button>

            <button
              onClick={() => onSwitchModule?.("Employee Master Database")}
              className="px-3.5 py-2 bg-[#FF5C28] hover:bg-[#e04f20] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Users className="w-3.5 h-3.5" />
              Employee Directory
            </button>
          </div>
        </div>
      </div>

      {/* ==================== 2. TOP METRICS SUMMARY ==================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {/* Metric 1: Total Employees */}
        <div className="bg-white p-4 rounded-2xl border border-[#E6ECF2] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-[#667085] uppercase tracking-wider">
              Total Employees
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#042C51] flex items-center justify-center">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-xl font-black text-[#042C51]">2,840</span>
            <span className="text-[10px] font-bold text-emerald-600">+12% MoM</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Across 18 Active Depts</p>
        </div>

        {/* Metric 2: Active Admin Users */}
        <div className="bg-white p-4 rounded-2xl border border-[#E6ECF2] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-[#667085] uppercase tracking-wider">
              Active Admin Users
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-xl font-black text-[#042C51]">{adminUsers.length}</span>
            <span className="text-[10px] font-bold text-slate-400">7 Access Tiers</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">TA, HR, Finance & Execs</p>
        </div>

        {/* Metric 3: Pending Approvals */}
        <div className="bg-white p-4 rounded-2xl border border-[#E6ECF2] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-[#667085] uppercase tracking-wider">
              Pending Approvals
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-xl font-black text-[#042C51]">18</span>
            <span className="text-[10px] font-bold text-amber-600">Cross-Module</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Leaves, Offers & Reqs</p>
        </div>

        {/* Metric 4: Attendance Reviews */}
        <div className="bg-white p-4 rounded-2xl border border-[#E6ECF2] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-[#667085] uppercase tracking-wider">
              Attendance Flags
            </span>
            <div className="w-7 h-7 rounded-lg bg-orange-50 text-[#FF5C28] flex items-center justify-center">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-xl font-black text-[#042C51]">14</span>
            <span className="text-[10px] font-bold text-[#FF5C28]">Needs Review</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Biometric timecard check</p>
        </div>

        {/* Metric 5: Leaves & Resignations */}
        <div className="bg-white p-4 rounded-2xl border border-[#E6ECF2] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-[#667085] uppercase tracking-wider">
              Leaves & Resignations
            </span>
            <div className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
              <UserX className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-xl font-black text-[#042C51]">18</span>
            <span className="text-[10px] font-bold text-slate-400">14 Leave • 4 Resig</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Active clearance pipelines</p>
        </div>

        {/* Metric 6: Recruitment Pipeline */}
        <div className="bg-white p-4 rounded-2xl border border-[#E6ECF2] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-[#667085] uppercase tracking-wider">
              Recruitment Funnel
            </span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <Briefcase className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-xl font-black text-[#042C51]">142</span>
            <span className="text-[10px] font-bold text-indigo-600">8 Offers Pending</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">18 Open Requisitions</p>
        </div>
      </div>

      {/* ==================== 3. QUICK ACTIONS BAR ==================== */}
      <div className="bg-white p-4 rounded-2xl border border-[#E6ECF2] shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <span className="text-xs font-black text-[#042C51] uppercase tracking-wider flex items-center gap-1.5">
            <SlidersHorizontal className="w-4 h-4 text-[#FF5C28]" />
            Super Admin Operations Quick Actions
          </span>
          <span className="text-[10px] text-slate-400 font-bold">
            Direct Governance Links
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          <button
            onClick={() => onSwitchModule?.("Employee Master Database")}
            className="p-3 rounded-xl bg-[#F8FAFC] hover:bg-slate-100 border border-[#E6ECF2] text-left transition-all cursor-pointer group flex flex-col justify-between space-y-2"
          >
            <div className="w-7 h-7 rounded-lg bg-[#042C51] text-white flex items-center justify-center group-hover:bg-[#FF5C28] transition-colors">
              <UserPlus className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#042C51] block">Add Employee</span>
              <span className="text-[10px] text-slate-400">New hire profile entry</span>
            </div>
          </button>

          <button
            onClick={() => setIsAddAdminOpen(true)}
            className="p-3 rounded-xl bg-[#F8FAFC] hover:bg-slate-100 border border-[#E6ECF2] text-left transition-all cursor-pointer group flex flex-col justify-between space-y-2"
          >
            <div className="w-7 h-7 rounded-lg bg-[#042C51] text-white flex items-center justify-center group-hover:bg-[#FF5C28] transition-colors">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#042C51] block">Add Admin / User</span>
              <span className="text-[10px] text-slate-400">Set 7 access tiers</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab("access_roles")}
            className="p-3 rounded-xl bg-[#F8FAFC] hover:bg-slate-100 border border-[#E6ECF2] text-left transition-all cursor-pointer group flex flex-col justify-between space-y-2"
          >
            <div className="w-7 h-7 rounded-lg bg-[#042C51] text-white flex items-center justify-center group-hover:bg-[#FF5C28] transition-colors">
              <Lock className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#042C51] block">Manage Access</span>
              <span className="text-[10px] text-slate-400">Review role permissions</span>
            </div>
          </button>

          <button
            onClick={() => onSwitchModule?.("Action Items")}
            className="p-3 rounded-xl bg-[#F8FAFC] hover:bg-slate-100 border border-[#E6ECF2] text-left transition-all cursor-pointer group flex flex-col justify-between space-y-2"
          >
            <div className="w-7 h-7 rounded-lg bg-[#042C51] text-white flex items-center justify-center group-hover:bg-[#FF5C28] transition-colors">
              <CheckSquare className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#042C51] block">Open Approvals</span>
              <span className="text-[10px] text-slate-400">18 pending requests</span>
            </div>
          </button>

          <button
            onClick={() => onSwitchModule?.("Job Requisitions")}
            className="p-3 rounded-xl bg-[#F8FAFC] hover:bg-slate-100 border border-[#E6ECF2] text-left transition-all cursor-pointer group flex flex-col justify-between space-y-2"
          >
            <div className="w-7 h-7 rounded-lg bg-[#042C51] text-white flex items-center justify-center group-hover:bg-[#FF5C28] transition-colors">
              <Settings className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#042C51] block">Recruitment Setup</span>
              <span className="text-[10px] text-slate-400">Job reqs & available roles</span>
            </div>
          </button>

          <button
            onClick={() => triggerToast("Generating whole-system compliance summary analytics...")}
            className="p-3 rounded-xl bg-[#F8FAFC] hover:bg-slate-100 border border-[#E6ECF2] text-left transition-all cursor-pointer group flex flex-col justify-between space-y-2"
          >
            <div className="w-7 h-7 rounded-lg bg-[#042C51] text-white flex items-center justify-center group-hover:bg-[#FF5C28] transition-colors">
              <PieChart className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#042C51] block">View Reports</span>
              <span className="text-[10px] text-slate-400">Cross-module analytics</span>
            </div>
          </button>
        </div>
      </div>

      {/* ==================== 4. CENTRALIZED FILTERS ==================== */}
      <CentralizedFilters
        title="Filter Super Admin Operations, Roles & Exceptions"
        resetLabel="Reset All Filters"
        onReset={() => {
          setSearchTerm("");
          setSelectedAccessLevel("All Access Levels");
          setSelectedModule("All Modules");
          setSelectedStatus("All Statuses");
          setSelectedAccount("All Accounts");
        }}
        search={{
          label: "Search Command Center",
          placeholder: "Search employees, admin users, exceptions, or audit logs...",
          value: searchTerm,
          onChange: setSearchTerm
        }}
        selects={[
          {
            label: "Access Level (1-7)",
            value: selectedAccessLevel,
            onChange: setSelectedAccessLevel,
            options: [
              "All Access Levels",
              "1 - TA",
              "2 - HR",
              "3 - HR Admin",
              "4 - Finance",
              "5 - Manager",
              "6 - Executive",
              "7 - Super Admin"
            ]
          },
          {
            label: "Target Module",
            value: selectedModule,
            onChange: setSelectedModule,
            options: [
              "All Modules",
              "Employee Directory",
              "Resignation Management",
              "Leaves Management",
              "Time & Attendance",
              "Action Items",
              "Offers & Onboarding",
              "Candidate Pipeline",
              "Payroll"
            ]
          },
          {
            label: "Account Group",
            value: selectedAccount,
            onChange: setSelectedAccount,
            options: [
              "All Accounts",
              "Verizon Tech",
              "Comcast Support",
              "Aetna Health",
              "Internal HR Ops",
              "Global WFM"
            ]
          },
          {
            label: "Status Filter",
            value: selectedStatus,
            onChange: setSelectedStatus,
            options: ["All Statuses", "Active", "Pending Mapping", "Locked"]
          }
        ]}
      />

      {/* ==================== 5. NAVIGATION TABS ==================== */}
      <div className="bg-white rounded-2xl border border-[#E6ECF2] shadow-sm overflow-hidden">
        <div className="flex border-b border-[#E6ECF2] bg-[#F8FAFC] px-4 pt-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-5 py-3 text-xs font-black uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "overview"
                ? "border-[#FF5C28] text-[#042C51] bg-white rounded-t-xl"
                : "border-transparent text-slate-500 hover:text-[#042C51]"
            }`}
          >
            <Activity className="w-4 h-4 text-[#FF5C28]" />
            Overview & Telemetry
          </button>

          <button
            onClick={() => setActiveTab("exceptions")}
            className={`px-5 py-3 text-xs font-black uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "exceptions"
                ? "border-[#FF5C28] text-[#042C51] bg-white rounded-t-xl"
                : "border-transparent text-slate-500 hover:text-[#042C51]"
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-[#FF5C28]" />
            Risk & Exceptions Desk ({exceptions.length})
          </button>

          <button
            onClick={() => setActiveTab("access_roles")}
            className={`px-5 py-3 text-xs font-black uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "access_roles"
                ? "border-[#FF5C28] text-[#042C51] bg-white rounded-t-xl"
                : "border-transparent text-slate-500 hover:text-[#042C51]"
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-[#FF5C28]" />
            Access & Roles Governance ({adminUsers.length})
          </button>

          <button
            onClick={() => setActiveTab("ops_snapshot")}
            className={`px-5 py-3 text-xs font-black uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "ops_snapshot"
                ? "border-[#FF5C28] text-[#042C51] bg-white rounded-t-xl"
                : "border-transparent text-slate-500 hover:text-[#042C51]"
            }`}
          >
            <Layers className="w-4 h-4 text-[#FF5C28]" />
            Cross-Module Snapshot
          </button>

          <button
            onClick={() => setActiveTab("activity_logs")}
            className={`px-5 py-3 text-xs font-black uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "activity_logs"
                ? "border-[#FF5C28] text-[#042C51] bg-white rounded-t-xl"
                : "border-transparent text-slate-500 hover:text-[#042C51]"
            }`}
          >
            <FileText className="w-4 h-4 text-[#FF5C28]" />
            System & Module Activity
          </button>
        </div>

        {/* TAB CONTENTS */}
        <div className="p-6">
          {/* ==================== TAB 1: OVERVIEW & TELEMETRY ==================== */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Quick Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl border border-[#E6ECF2] bg-slate-50/50 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Core HR Scope
                  </span>
                  <div className="text-lg font-black text-[#042C51]">2,840 Active Staff</div>
                  <p className="text-xs text-slate-500">18 Departments • 14 Pending Leaves • 4 Resignations</p>
                  <button
                    onClick={() => onSwitchModule?.("Employee Master Database")}
                    className="text-xs font-bold text-[#FF5C28] hover:underline flex items-center gap-1 pt-1 cursor-pointer"
                  >
                    Open HR Directory <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-4 rounded-xl border border-[#E6ECF2] bg-slate-50/50 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Talent Acquisition (TA)
                  </span>
                  <div className="text-lg font-black text-[#042C51]">142 Candidates</div>
                  <p className="text-xs text-slate-500">18 Requisitions • 85 Talent Pool • 8 Offers Pending</p>
                  <button
                    onClick={() => onSwitchModule?.("Candidate Pipeline")}
                    className="text-xs font-bold text-[#FF5C28] hover:underline flex items-center gap-1 pt-1 cursor-pointer"
                  >
                    Open TA Pipeline <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-4 rounded-xl border border-[#E6ECF2] bg-slate-50/50 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Operations Management (OM)
                  </span>
                  <div className="text-lg font-black text-[#042C51]">5 Client Accounts</div>
                  <p className="text-xs text-slate-500">12 Hiring Needs • 4 Recruiters • 84% Shift Capacity</p>
                  <button
                    onClick={() => onSwitchModule?.("OM Overview")}
                    className="text-xs font-bold text-[#FF5C28] hover:underline flex items-center gap-1 pt-1 cursor-pointer"
                  >
                    Open OM Dashboard <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-4 rounded-xl border border-[#E6ECF2] bg-slate-50/50 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Finance & Payroll
                  </span>
                  <div className="text-lg font-black text-[#042C51]">2 Payroll Cycles</div>
                  <p className="text-xs text-slate-500">Approved for July 2026 • 3 Pending Budget Requests</p>
                  <button
                    onClick={() => onSwitchModule?.("Payroll")}
                    className="text-xs font-bold text-[#FF5C28] hover:underline flex items-center gap-1 pt-1 cursor-pointer"
                  >
                    Open Payroll Module <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Priority Attention Banner */}
              <div className="p-5 rounded-2xl bg-[#042C51] text-white space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-[#FF5C28]" />
                    <h3 className="text-sm font-bold uppercase tracking-wider">
                      Super Admin Operational Focus Items
                    </h3>
                  </div>
                  <span className="text-[10px] bg-white/10 px-2.5 py-0.5 rounded-full font-bold">
                    6 Active Desk Exceptions
                  </span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  There are currently 6 items flagged in the Risk & Exceptions Desk requiring Super Admin or HR Director resolution, including 3 unmapped new hire accounts and 1 job requisition awaiting budget signoff.
                </p>
                <div className="pt-1 flex gap-3">
                  <button
                    onClick={() => setActiveTab("exceptions")}
                    className="px-4 py-2 bg-[#FF5C28] hover:bg-[#e04f20] text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    View Risk Desk <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onSwitchModule?.("Action Items")}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    Review Approval Queue
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ==================== TAB 2: RISK & EXCEPTIONS DESK ==================== */}
          {activeTab === "exceptions" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#042C51] uppercase tracking-wide">
                    Risk & Exception Escalation Desk ({filteredExceptions.length})
                  </h3>
                  <p className="text-xs text-[#667085]">
                    System-wide exceptions: unmapped accounts, pending resignations near last working date, delayed leave approvals, and stuck requisitions.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {filteredExceptions.map((exc) => (
                  <div
                    key={exc.id}
                    className="p-4 rounded-xl border border-[#E6ECF2] bg-white hover:border-[#FF5C28]/40 transition-all shadow-2xs space-y-2"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            exc.severity === "High"
                              ? "bg-red-100 text-red-800"
                              : exc.severity === "Medium"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {exc.severity} Severity
                        </span>
                        <span className="text-xs font-black text-[#042C51]">{exc.title}</span>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                        <span>Target: <strong>{exc.moduleTarget}</strong></span>
                        <span>•</span>
                        <span>Pending: <strong className="text-amber-700">{exc.daysPending} days</strong></span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600">{exc.description}</p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <span className="text-[11px] text-slate-500 font-semibold">
                        Assigned: <strong className="text-[#042C51]">{exc.assignedTo}</strong>
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onSwitchModule?.(exc.moduleTarget)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-[#042C51] rounded-lg text-[10px] font-bold cursor-pointer"
                        >
                          Open Module
                        </button>
                        <button
                          onClick={() => handleResolveException(exc.id, exc.title)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold cursor-pointer"
                        >
                          Mark Resolved
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredExceptions.length === 0 && (
                  <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                    <p className="text-xs font-bold text-[#042C51]">No Risk Exceptions Found</p>
                    <p className="text-[11px] text-slate-400">All cross-module requests are within normal threshold times.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ==================== TAB 3: ACCESS & ROLES GOVERNANCE ==================== */}
          {activeTab === "access_roles" && (
            <div className="space-y-6">
              {/* Access Levels Legend */}
              <div className="bg-slate-50 p-4 rounded-xl border border-[#E6ECF2] space-y-3">
                <h3 className="text-xs font-black text-[#042C51] uppercase tracking-wider flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#FF5C28]" />
                  Grounded 7 Admin Access Levels Hierarchy
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-[10px] font-bold">
                  <div className="p-2 bg-white rounded-lg border border-slate-200 text-center">
                    <span className="block text-[#FF5C28]">1 - TA</span>
                    <span className="text-slate-500 font-medium">Recruitment & Sourcing</span>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200 text-center">
                    <span className="block text-[#042C51]">2 - HR</span>
                    <span className="text-slate-500 font-medium">HR Support & Tickets</span>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200 text-center">
                    <span className="block text-[#042C51]">3 - HR Admin</span>
                    <span className="text-slate-500 font-medium">Full HR Ops Control</span>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200 text-center">
                    <span className="block text-[#042C51]">4 - Finance</span>
                    <span className="text-slate-500 font-medium">Payroll & Costing</span>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200 text-center">
                    <span className="block text-[#042C51]">5 - Manager</span>
                    <span className="text-slate-500 font-medium">Team & Approval Head</span>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200 text-center">
                    <span className="block text-[#042C51]">6 - Executive</span>
                    <span className="text-slate-500 font-medium">Executive Reporting</span>
                  </div>
                  <div className="p-2 bg-[#042C51] text-white rounded-lg text-center">
                    <span className="block text-[#FF5C28]">7 - Super Admin</span>
                    <span className="text-slate-200 font-medium">Full System Oversight</span>
                  </div>
                </div>
              </div>

              {/* Admin Users Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#042C51] uppercase tracking-wide">
                    Admin Users & Access Levels ({filteredAdmins.length})
                  </h3>
                  <button
                    onClick={() => setIsAddAdminOpen(true)}
                    className="px-3 py-1.5 bg-[#042C51] text-white rounded-lg text-xs font-bold hover:bg-[#063866] flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    New Admin Account
                  </button>
                </div>

                <div className="overflow-x-auto border border-[#E6ECF2] rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F8FAFC] border-b border-[#E6ECF2] text-[10px] font-black text-[#667085] uppercase tracking-wider">
                      <tr>
                        <th className="py-3 px-4">User Name & Email</th>
                        <th className="py-3 px-4">Grounded Access Level</th>
                        <th className="py-3 px-4">Department</th>
                        <th className="py-3 px-4">Account Group</th>
                        <th className="py-3 px-4">Last Active</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E6ECF2] font-medium text-[#042C51]">
                      {filteredAdmins.map((adm) => (
                        <tr key={adm.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4">
                            <div className="font-bold text-xs">{adm.name}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{adm.email}</div>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                adm.accessLevel.includes("7")
                                  ? "bg-[#042C51] text-white"
                                  : adm.accessLevel.includes("3")
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-slate-100 text-slate-800"
                              }`}
                            >
                              {adm.accessLevel}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-semibold">{adm.department}</td>
                          <td className="py-3 px-4 text-slate-600">{adm.accountGroup}</td>
                          <td className="py-3 px-4 text-slate-400 text-[11px]">{adm.lastActive}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                adm.status === "Active"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {adm.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => triggerToast(`Opening access editor for ${adm.email}`)}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-[#042C51] rounded text-[10px] font-bold cursor-pointer"
                            >
                              Edit Access
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==================== TAB 4: CROSS-MODULE SNAPSHOT ==================== */}
          {activeTab === "ops_snapshot" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Module 1: HR Operations */}
                <div className="p-5 rounded-xl border border-[#E6ECF2] bg-white space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-black text-[#042C51] uppercase tracking-wider flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-[#FF5C28]" />
                      Core HR & Employee Operations
                    </span>
                    <button
                      onClick={() => onSwitchModule?.("Employee Master Database")}
                      className="text-[10px] font-bold text-[#FF5C28] hover:underline cursor-pointer"
                    >
                      Open Module →
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Master Headcount</span>
                      <strong className="text-base text-[#042C51]">2,840 Staff</strong>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Active Departments</span>
                      <strong className="text-base text-[#042C51]">18 Depts</strong>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Pending Leaves</span>
                      <strong className="text-base text-amber-600">14 Active</strong>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Resignation Queue</span>
                      <strong className="text-base text-red-600">4 Staff</strong>
                    </div>
                  </div>
                </div>

                {/* Module 2: Talent Acquisition */}
                <div className="p-5 rounded-xl border border-[#E6ECF2] bg-white space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-black text-[#042C51] uppercase tracking-wider flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4 text-[#FF5C28]" />
                      Talent Acquisition & Sourcing
                    </span>
                    <button
                      onClick={() => onSwitchModule?.("Candidate Pipeline")}
                      className="text-[10px] font-bold text-[#FF5C28] hover:underline cursor-pointer"
                    >
                      Open Module →
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Candidate Pipeline</span>
                      <strong className="text-base text-[#042C51]">142 Candidates</strong>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Open Requisitions</span>
                      <strong className="text-base text-[#042C51]">18 Positions</strong>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Offers Outstanding</span>
                      <strong className="text-base text-indigo-600">8 Issued</strong>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Active Onboarding</span>
                      <strong className="text-base text-emerald-600">15 In Progress</strong>
                    </div>
                  </div>
                </div>

                {/* Module 3: Operations Management */}
                <div className="p-5 rounded-xl border border-[#E6ECF2] bg-white space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-black text-[#042C51] uppercase tracking-wider flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-[#FF5C28]" />
                      Operations Management (OM)
                    </span>
                    <button
                      onClick={() => onSwitchModule?.("OM Overview")}
                      className="text-[10px] font-bold text-[#FF5C28] hover:underline cursor-pointer"
                    >
                      Open Module →
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Account Groups</span>
                      <strong className="text-base text-[#042C51]">5 Client Accounts</strong>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Hiring Needs</span>
                      <strong className="text-base text-[#042C51]">12 Requests</strong>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Recruiter Load</span>
                      <strong className="text-base text-slate-700">4 Active TA Leads</strong>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Operation Capacity</span>
                      <strong className="text-base text-emerald-600">84% Staffed</strong>
                    </div>
                  </div>
                </div>

                {/* Module 4: Finance & Payroll */}
                <div className="p-5 rounded-xl border border-[#E6ECF2] bg-white space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-black text-[#042C51] uppercase tracking-wider flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4 text-[#FF5C28]" />
                      Finance & Payroll Summary
                    </span>
                    <button
                      onClick={() => onSwitchModule?.("Payroll")}
                      className="text-[10px] font-bold text-[#FF5C28] hover:underline cursor-pointer"
                    >
                      Open Module →
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Current Payroll Cycle</span>
                      <strong className="text-base text-[#042C51]">July 16 - 31, 2026</strong>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Payroll Status</span>
                      <strong className="text-base text-emerald-600">Approved</strong>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Budget Requests</span>
                      <strong className="text-base text-amber-600">3 Pending Clearance</strong>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Reports & Audits</span>
                      <strong className="text-base text-[#042C51]">Monthly Summary Ready</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================== TAB 5: SYSTEM & MODULE ACTIVITY ==================== */}
          {activeTab === "activity_logs" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#042C51] uppercase tracking-wide">
                    System & Module Activity Audit Log ({filteredLogs.length})
                  </h3>
                  <p className="text-xs text-[#667085]">
                    Recorded user actions, approval request updates, and access level modifications.
                  </p>
                </div>
                <button
                  onClick={() => triggerToast("Activity log exported to CSV format.")}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#042C51] rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export Activity Log
                </button>
              </div>

              <div className="overflow-x-auto border border-[#E6ECF2] rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8FAFC] border-b border-[#E6ECF2] text-[10px] font-black text-[#667085] uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Timestamp</th>
                      <th className="py-3 px-4">User Actor</th>
                      <th className="py-3 px-4">Access Level</th>
                      <th className="py-3 px-4">Module</th>
                      <th className="py-3 px-4">Action Taken</th>
                      <th className="py-3 px-4">Log Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E6ECF2] font-medium text-[#042C51]">
                    {filteredLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-400">{log.timestamp}</td>
                        <td className="py-3 px-4 font-bold">{log.actor}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold text-slate-700">
                            {log.accessLevel}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-semibold text-[#042C51]">{log.module}</td>
                        <td className="py-3 px-4">
                          <span className="font-mono text-[11px] text-[#FF5C28] font-bold">{log.action}</span>
                        </td>
                        <td className="py-3 px-4 text-slate-600 text-[11px]">{log.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ==================== ADD ADMIN MODAL ==================== */}
      <AnimatePresence>
        {isAddAdminOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-[#FF5C28]" />
                  <h3 className="text-base font-bold text-[#042C51]">Add Admin User</h3>
                </div>
                <button
                  onClick={() => setIsAddAdminOpen(false)}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddAdmin} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maria Santos"
                    value={newAdminName}
                    onChange={(e) => setNewAdminName(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-[#E6ECF2] rounded-xl px-3 py-2 text-xs font-medium text-[#042C51] focus:outline-none focus:ring-2 focus:ring-[#FF5C28]/20"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Work Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. maria.s@thesiblingssolutions.com"
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-[#E6ECF2] rounded-xl px-3 py-2 text-xs font-medium text-[#042C51] focus:outline-none focus:ring-2 focus:ring-[#FF5C28]/20"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Grounded Access Level (1-7)
                  </label>
                  <select
                    value={newAdminLevel}
                    onChange={(e) => setNewAdminLevel(e.target.value as AdminAccessLevel)}
                    className="w-full bg-[#F8FAFC] border border-[#E6ECF2] rounded-xl px-3 py-2 text-xs font-bold text-[#042C51] focus:outline-none focus:ring-2 focus:ring-[#FF5C28]/20"
                  >
                    <option value="1 - TA">1 - TA (Talent Acquisition)</option>
                    <option value="2 - HR">2 - HR (HR Support)</option>
                    <option value="3 - HR Admin">3 - HR Admin (HR Ops Admin)</option>
                    <option value="4 - Finance">4 - Finance (Payroll & Finance)</option>
                    <option value="5 - Manager">5 - Manager (People Manager)</option>
                    <option value="6 - Executive">6 - Executive (Executive View)</option>
                    <option value="7 - Super Admin">7 - Super Admin (Whole-System Oversight)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={newAdminDepartment}
                    onChange={(e) => setNewAdminDepartment(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-[#E6ECF2] rounded-xl px-3 py-2 text-xs font-medium text-[#042C51] focus:outline-none focus:ring-2 focus:ring-[#FF5C28]/20"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Account Group
                  </label>
                  <select
                    value={newAdminAccount}
                    onChange={(e) => setNewAdminAccount(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-[#E6ECF2] rounded-xl px-3 py-2 text-xs font-bold text-[#042C51] focus:outline-none focus:ring-2 focus:ring-[#FF5C28]/20"
                  >
                    <option value="Verizon Tech">Verizon Tech</option>
                    <option value="Comcast Support">Comcast Support</option>
                    <option value="Aetna Health">Aetna Health</option>
                    <option value="Internal HR Ops">Internal HR Ops</option>
                    <option value="Global WFM">Global WFM</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsAddAdminOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[#042C51] rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#042C51] hover:bg-[#063866] text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Save Admin Account
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
