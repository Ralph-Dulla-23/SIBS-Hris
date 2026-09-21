import React, { useState, useMemo } from "react";
import {
  Briefcase,
  Users,
  Plus,
  RefreshCw,
  Search,
  SlidersHorizontal,
  X,
  CheckCircle,
  AlertCircle,
  MapPin,
  FileText,
  Check,
  Info,
  ArrowRight,
  Layers,
  HelpCircle,
  TrendingUp,
  Inbox,
  Sparkles,
  Filter
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface HiringNeedsIntakeProps {
  userEmail?: string;
  onSwitchModule?: (module: string) => void;
}

interface PersonnelRequisition {
  id: string; // e.g., PR-2026-001
  requestType: "Requisition" | "Downsize";
  department: string;
  account: string;
  jobTitle: string;
  jdCode: string;
  headcount: number;
  reason: string;
  location: string;
  dateNeeded: string;
  status: "For Approval" | "Approved" | "Not Approved";
  filedBy: { name: string; role: string };
  remarks?: string;
  history: { date: string; action: string; actor: string; remarks?: string }[];
}

export default function HiringNeedsIntake({ userEmail, onSwitchModule }: HiringNeedsIntakeProps) {
  // --- STATE ---
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");
  const [reasonFilter, setReasonFilter] = useState("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedPR, setSelectedPR] = useState<PersonnelRequisition | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Simulation role selection to let user experience TL, OM, HR views
  const [userRoleContext, setUserRoleContext] = useState<"HR Admin" | "Operations Manager" | "Team Leader">("HR Admin");

  // Initial PR Data
  const [requisitions, setRequisitions] = useState<PersonnelRequisition[]>([
    {
      id: "PR-2026-001",
      requestType: "Requisition",
      department: "Telecom & Tech Support",
      account: "Comcast Technical",
      jobTitle: "Technical Support Rep (CSR)",
      jdCode: "JD-CSR-TEL-04",
      headcount: 25,
      reason: "Ramp-up",
      location: "Davao",
      dateNeeded: "2026-08-01",
      status: "Approved",
      filedBy: { name: "Shiela Delos Reyes", role: "Operations Manager" },
      remarks: "Approved as per client request for Q3 forecast expansion.",
      history: [
        { date: "2026-07-10", action: "Filed Requisition", actor: "Shiela Delos Reyes" },
        { date: "2026-07-12", action: "Approved PR Request", actor: "Alena Batacan", remarks: "Forecast validated and approved." }
      ]
    },
    {
      id: "PR-2026-002",
      requestType: "Requisition",
      department: "Healthcare & Insurance",
      account: "UnitedHealth VIP",
      jobTitle: "Tier 2 Technical Specialist",
      jdCode: "JD-TECH-HC-09",
      headcount: 10,
      reason: "Forecasted Growth",
      location: "Tagum",
      dateNeeded: "2026-08-15",
      status: "For Approval",
      filedBy: { name: "Renz Torres", role: "Team Leader" },
      history: [
        { date: "2026-07-15", action: "Filed Requisition", actor: "Renz Torres" }
      ]
    },
    {
      id: "PR-2026-003",
      requestType: "Requisition",
      department: "Financial Services Group",
      account: "Chase Credit",
      jobTitle: "Fraud & Disputes Specialist",
      jdCode: "JD-FIN-FRD-01",
      headcount: 5,
      reason: "Backfill",
      location: "Mabini",
      dateNeeded: "2026-07-28",
      status: "Approved",
      filedBy: { name: "Mark Sarmiento", role: "Team Leader" },
      remarks: "Immediate backfill to cover two sudden resignations last week.",
      history: [
        { date: "2026-07-11", action: "Filed Requisition", actor: "Mark Sarmiento" },
        { date: "2026-07-13", action: "Approved PR Request", actor: "Alena Batacan" }
      ]
    },
    {
      id: "PR-2026-004",
      requestType: "Downsize",
      department: "Retail & E-Commerce",
      account: "Amazon Care",
      jobTitle: "Seasonal Support Rep",
      jdCode: "JD-RET-SEA-11",
      headcount: 15,
      reason: "Forecasted Growth",
      location: "Davao",
      dateNeeded: "2026-09-01",
      status: "Not Approved",
      filedBy: { name: "Mark Sarmiento", role: "Team Leader" },
      remarks: "Declined. Seasonal ramping must terminate under standard contract terms without formal downsize logging.",
      history: [
        { date: "2026-07-12", action: "Filed Downsize Notification", actor: "Mark Sarmiento" },
        { date: "2026-07-14", action: "Declined Downsize", actor: "Alena Batacan", remarks: "Standard contract terms apply." }
      ]
    },
    {
      id: "PR-2026-005",
      requestType: "Requisition",
      department: "Telecom & Tech Support",
      account: "Verizon Tech",
      jobTitle: "Team Leader / Supervisor",
      jdCode: "JD-MGR-TL-02",
      headcount: 2,
      reason: "New Position",
      location: "Mabini",
      dateNeeded: "2026-08-10",
      status: "For Approval",
      filedBy: { name: "Shiela Delos Reyes", role: "Operations Manager" },
      history: [
        { date: "2026-07-18", action: "Filed Requisition", actor: "Shiela Delos Reyes" }
      ]
    },
    {
      id: "PR-2026-006",
      requestType: "Requisition",
      department: "Healthcare & Insurance",
      account: "UnitedHealth VIP",
      jobTitle: "Claim Processor Agent",
      jdCode: "JD-HC-CLM-03",
      headcount: 8,
      reason: "Ramp-up",
      location: "Davao",
      dateNeeded: "2026-08-12",
      status: "For Approval",
      filedBy: { name: "Renz Torres", role: "Team Leader" },
      history: [
        { date: "2026-07-19", action: "Filed Requisition", actor: "Renz Torres" }
      ]
    }
  ]);

  // --- FORM STATE ---
  const [newRequestType, setNewRequestType] = useState<"Requisition" | "Downsize">("Requisition");
  const [newDepartment, setNewDepartment] = useState("Telecom & Tech Support");
  const [newAccount, setNewAccount] = useState("Verizon Tech");
  const [newJobTitle, setNewJobTitle] = useState("");
  const [newJdCode, setNewJdCode] = useState("JD-CSR-TEL-04");
  const [newHeadcount, setNewHeadcount] = useState<number>(1);
  const [newReason, setNewReason] = useState("Ramp-up");
  const [newLocation, setNewLocation] = useState("Davao");
  const [newDateNeeded, setNewDateNeeded] = useState("2026-08-15");
  const [remarksInput, setRemarksInput] = useState("");

  // Toast Trigger
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // --- DERIVED METRICS ---
  const stats = useMemo(() => {
    let total = 0;
    let pending = 0;
    let approved = 0;
    let rejected = 0;

    let reqHiringReason: Record<string, number> = { "Ramp-up": 0, "Backfill": 0, "New Position": 0, "Forecasted Growth": 0 };
    let reqByDept: Record<string, number> = {
      "Telecom & Tech Support": 0,
      "Healthcare & Insurance": 0,
      "Financial Services Group": 0,
      "Retail & E-Commerce": 0
    };

    requisitions.forEach(r => {
      total++;
      if (r.status === "For Approval") pending++;
      else if (r.status === "Approved") approved++;
      else if (r.status === "Not Approved") rejected++;

      // Sum requested headcounts
      const count = r.headcount;
      if (r.requestType === "Requisition") {
        if (reqHiringReason[r.reason] !== undefined) {
          reqHiringReason[r.reason] += count;
        } else {
          reqHiringReason[r.reason] = count;
        }

        if (reqByDept[r.department] !== undefined) {
          reqByDept[r.department] += count;
        } else {
          reqByDept[r.department] = count;
        }
      }
    });

    return { total, pending, approved, rejected, reqHiringReason, reqByDept };
  }, [requisitions]);

  // Filtering Logic
  const filteredRequisitions = useMemo(() => {
    return requisitions.filter(pr => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        pr.id.toLowerCase().includes(q) ||
        pr.department.toLowerCase().includes(q) ||
        pr.account.toLowerCase().includes(q) ||
        pr.jobTitle.toLowerCase().includes(q) ||
        pr.reason.toLowerCase().includes(q);

      const matchesStatus = statusFilter === "All" || pr.status === statusFilter;
      const matchesLocation = locationFilter === "All" || pr.location === locationFilter;
      const matchesReason = reasonFilter === "All" || pr.reason === reasonFilter;

      // Role isolation: Team leader can only view their own requests, Ops Manager Telecom, HR Admin all
      if (userRoleContext === "Team Leader") {
        return matchesSearch && matchesStatus && matchesLocation && matchesReason && pr.filedBy.name === "Renz Torres";
      }
      if (userRoleContext === "Operations Manager") {
        return matchesSearch && matchesStatus && matchesLocation && matchesReason && pr.department === "Telecom & Tech Support";
      }

      return matchesSearch && matchesStatus && matchesLocation && matchesReason;
    });
  }, [requisitions, searchTerm, statusFilter, locationFilter, reasonFilter, userRoleContext]);

  // Form submit handler
  const handleCreatePR = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJobTitle) {
      triggerToast("Please input a Job Title.");
      return;
    }

    const nextId = `PR-2026-0${requisitions.length + 1}`;
    const actorName = userRoleContext === "HR Admin" ? "Alena Batacan" : userRoleContext === "Operations Manager" ? "Shiela Delos Reyes" : "Renz Torres";
    
    const newPR: PersonnelRequisition = {
      id: nextId,
      requestType: newRequestType,
      department: newDepartment,
      account: newAccount,
      jobTitle: newJobTitle,
      jdCode: newJdCode,
      headcount: Number(newHeadcount),
      reason: newReason,
      location: newLocation,
      dateNeeded: newDateNeeded,
      status: "For Approval",
      filedBy: { name: actorName, role: userRoleContext },
      history: [
        { date: "2026-07-20", action: `Filed ${newRequestType}`, actor: actorName }
      ]
    };

    setRequisitions([newPR, ...requisitions]);
    setIsAddModalOpen(false);
    triggerToast(`Personnel Requisition ${nextId} created for ${newJobTitle} (${newHeadcount} pax).`);

    // Reset Form
    setNewJobTitle("");
    setNewHeadcount(1);
    setNewDetails("");
  };

  // Helper Details/Narrative State for Form
  const [newDetails, setNewDetails] = useState("");

  // Approval actions
  const handleApprovePR = () => {
    if (!selectedPR) return;

    const updated = requisitions.map(pr => {
      if (pr.id === selectedPR.id) {
        return {
          ...pr,
          status: "Approved" as const,
          remarks: remarksInput || "PR request approved by HR Admin.",
          history: [
            ...pr.history,
            {
              date: "2026-07-20",
              action: "Approved PR Request",
              actor: "Alena Batacan",
              remarks: remarksInput || "SLA parameters verified."
            }
          ]
        };
      }
      return pr;
    });

    setRequisitions(updated);
    const targetItem = updated.find(p => p.id === selectedPR.id);
    if (targetItem) {
      setSelectedPR(targetItem);
    }
    setRemarksInput("");
    triggerToast(`Approved PR ${selectedPR.id} successfully!`);
  };

  const handleRejectPR = () => {
    if (!selectedPR) return;
    if (!remarksInput) {
      triggerToast("Remarks/Reasons for decline are required prior to rejecting.");
      return;
    }

    const updated = requisitions.map(pr => {
      if (pr.id === selectedPR.id) {
        return {
          ...pr,
          status: "Not Approved" as const,
          remarks: remarksInput,
          history: [
            ...pr.history,
            {
              date: "2026-07-20",
              action: "Declined PR Request",
              actor: "Alena Batacan",
              remarks: remarksInput
            }
          ]
        };
      }
      return pr;
    });

    setRequisitions(updated);
    const targetItem = updated.find(p => p.id === selectedPR.id);
    if (targetItem) {
      setSelectedPR(targetItem);
    }
    setRemarksInput("");
    triggerToast(`PR ${selectedPR.id} has been marked as Not Approved.`);
  };

  return (
    <div className="flex-1 flex flex-col space-y-6 select-none relative" id="hiring-needs-root">
      
      {/* Toast alert system */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 right-6 bg-[#042C51] border-l-4 border-[#FF5C28] text-white px-5 py-3 rounded-r-xl shadow-2xl z-50 flex items-center gap-3 text-xs font-semibold"
          >
            <CheckCircle className="w-4.5 h-4.5 text-[#FF5C28]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================== 1. HEADER & ACTIONS ==================== */}
      <section className="bg-white p-5 rounded-2xl border border-[#E6ECF2] shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-[#E9F0FC] text-[#042C51] px-2.5 py-0.5 rounded font-black border border-blue-100 uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#042C51] inline-block animate-pulse"></span>
              Personnel Requisition
            </span>

            {/* Simulated User Context Selector */}
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <span className="text-[9px] font-bold text-slate-500 px-1.5">Context:</span>
              {(["HR Admin", "Operations Manager", "Team Leader"] as const).map((role) => (
                <button
                  key={role}
                  onClick={() => {
                    setUserRoleContext(role);
                    triggerToast(`Switched view to ${role}`);
                  }}
                  className={`text-[9px] px-2 py-0.5 rounded font-black transition-all cursor-pointer ${
                    userRoleContext === role
                      ? "bg-white text-[#042C51] shadow-sm"
                      : "text-slate-500 hover:text-[#042C51]"
                  }`}
                >
                  {role.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>
          <h1 className="text-xl font-black text-[#042C51] tracking-tight">Hiring Needs Intake</h1>
          <p className="text-xs text-[#667085] leading-normal">
            Create, review, approve, and manage Personnel Requisition Forms (PRF) across SIBS operational hubs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              triggerToast("Hiring needs records synced.");
            }}
            className="p-2 text-slate-600 hover:text-[#042C51] bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer"
            title="Refresh Requisitions"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#042C51] hover:bg-[#FF5C28] text-white text-xs font-black rounded-lg transition-all cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>New Requisition Form</span>
          </button>
        </div>
      </section>

      {/* ==================== 2. STATS & SUMMARIES ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* PR Summary Table Box (Left) */}
        <div className="lg:col-span-4 bg-white p-4 rounded-xl border border-[#E6ECF2] shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-black text-[#042C51] uppercase tracking-wider">PR Summary Table</h3>
            <p className="text-[10px] text-slate-500">Personnel Requisitions Status</p>
          </div>

          <div className="space-y-2 my-2">
            <div className="flex justify-between items-center text-xs pb-1.5 border-b border-slate-100">
              <span className="font-bold text-slate-600">Total PRs Registered</span>
              <span className="font-black text-[#042C51]">{stats.total}</span>
            </div>
            <div className="flex justify-between items-center text-xs pb-1.5 border-b border-slate-100">
              <span className="font-bold text-amber-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                For Approval
              </span>
              <span className="font-black text-amber-600">{stats.pending}</span>
            </div>
            <div className="flex justify-between items-center text-xs pb-1.5 border-b border-slate-100">
              <span className="font-bold text-emerald-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Approved
              </span>
              <span className="font-black text-emerald-600">{stats.approved}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-rose-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                Not Approved
              </span>
              <span className="font-black text-rose-600">{stats.rejected}</span>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 bg-slate-50 p-2 rounded text-center font-semibold">
            All forms trigger automated SLA validation routines.
          </div>
        </div>

        {/* Reason for Hiring Summary (Middle) */}
        <div className="lg:col-span-4 bg-white p-4 rounded-xl border border-[#E6ECF2] shadow-sm space-y-3">
          <div>
            <h3 className="text-xs font-black text-[#042C51] uppercase tracking-wider">Headcount requested by Reason</h3>
            <p className="text-[10px] text-slate-500">Accumulated target slots needed</p>
          </div>

          <div className="space-y-3">
            {Object.entries(stats.reqHiringReason).map(([reason, count]) => {
              const maxCount = Math.max(...(Object.values(stats.reqHiringReason) as number[]), 1);
              const percentage = Math.min(((count as number) / maxCount) * 100, 100);

              return (
                <div key={reason} className="space-y-1">
                  <div className="flex justify-between text-[10px] font-black">
                    <span className="text-slate-600">{reason}</span>
                    <span className="text-[#042C51]">{count} slots</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#FF5C28] h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Requisition By Department Summary (Right) */}
        <div className="lg:col-span-4 bg-white p-4 rounded-xl border border-[#E6ECF2] shadow-sm space-y-3">
          <div>
            <h3 className="text-xs font-black text-[#042C51] uppercase tracking-wider">Requisition by Department</h3>
            <p className="text-[10px] text-slate-500">Active approved / pending request quota</p>
          </div>

          <div className="space-y-3">
            {Object.entries(stats.reqByDept).map(([dept, count]) => {
              const maxCount = Math.max(...(Object.values(stats.reqByDept) as number[]), 1);
              const percentage = Math.min(((count as number) / maxCount) * 100, 100);

              return (
                <div key={dept} className="space-y-1">
                  <div className="flex justify-between text-[10px] font-black">
                    <span className="text-slate-600 truncate max-w-[200px]" title={dept}>{dept}</span>
                    <span className="text-indigo-600">{count} slots</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#042C51] h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* ==================== 3. FILTERING & SEARCH ==================== */}
      <div className="bg-white p-4 rounded-xl border border-[#E6ECF2] shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by ID, Department, Account, Job Title, Reason..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[10px] font-bold text-slate-500">Filters:</span>
          </div>

          {/* Approval Status Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 focus:outline-none focus:bg-white"
          >
            <option value="All">All Statuses</option>
            <option value="For Approval">For Approval</option>
            <option value="Approved">Approved</option>
            <option value="Not Approved">Not Approved</option>
          </select>

          {/* Location / Site Dropdown */}
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="bg-slate-50 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 focus:outline-none focus:bg-white"
          >
            <option value="All">All Sites</option>
            <option value="Davao">Davao</option>
            <option value="Tagum">Tagum</option>
            <option value="Mabini">Mabini</option>
          </select>

          {/* Reason Dropdown */}
          <select
            value={reasonFilter}
            onChange={(e) => setReasonFilter(e.target.value)}
            className="bg-slate-50 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 focus:outline-none focus:bg-white"
          >
            <option value="All">All Reasons</option>
            <option value="Ramp-up">Ramp-up</option>
            <option value="Backfill">Backfill</option>
            <option value="New Position">New Position</option>
            <option value="Forecasted Growth">Forecasted Growth</option>
          </select>
        </div>
      </div>

      {/* ==================== 4. DATA TABLE & LIST ==================== */}
      <div className="bg-white p-5 rounded-2xl border border-[#E6ECF2] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <div>
            <h3 className="text-sm font-black text-[#042C51]">Personnel Requisitions Directory</h3>
            <p className="text-[10px] text-[#667085]">Reviewing intake pipeline specifications</p>
          </div>
          
          <span className="text-[10px] bg-[#E9F0FC] text-[#042C51] px-2.5 py-0.5 rounded font-black border border-blue-100">
            Showing {filteredRequisitions.length} records
          </span>
        </div>

        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                  <th className="p-3">ID / Request Type</th>
                  <th className="p-3">Department / Account</th>
                  <th className="p-3">Job Title & JD Specification</th>
                  <th className="p-3 text-center">Headcount</th>
                  <th className="p-3">Reason</th>
                  <th className="p-3">Location / Site</th>
                  <th className="p-3 text-center">Date Needed</th>
                  <th className="p-3">Approval Status</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRequisitions.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-12 text-center text-slate-400 font-bold">
                      No personnel requisitions match the selected criteria.
                    </td>
                  </tr>
                ) : (
                  filteredRequisitions.map((pr) => {
                    const isSelected = selectedPR?.id === pr.id;
                    return (
                      <tr
                        key={pr.id}
                        onClick={() => setSelectedPR(pr)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? "bg-[#FFF0EB]" : "hover:bg-slate-50"
                        }`}
                      >
                        <td className="p-3">
                          <span className="font-mono font-black text-[#042C51] block">{pr.id}</span>
                          <span
                            className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-black uppercase mt-0.5 ${
                              pr.requestType === "Downsize"
                                ? "bg-rose-50 text-rose-700 border border-rose-100"
                                : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            }`}
                          >
                            {pr.requestType}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="font-extrabold text-[#042C51] block">{pr.department}</span>
                          <span className="text-[10px] text-slate-500 font-medium">{pr.account}</span>
                        </td>
                        <td className="p-3">
                          <span className="font-extrabold text-[#042C51] block">{pr.jobTitle}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{pr.jdCode}</span>
                        </td>
                        <td className="p-3 text-center">
                          <span className="inline-block px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 font-extrabold font-mono text-[11px]">
                            {pr.headcount}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="text-slate-600 font-bold">{pr.reason}</span>
                        </td>
                        <td className="p-3">
                          <span className="text-slate-700 font-semibold flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {pr.location}
                          </span>
                        </td>
                        <td className="p-3 text-center text-slate-600 font-medium">{pr.dateNeeded}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                              pr.status === "Approved"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : pr.status === "For Approval"
                                ? "bg-amber-50 text-amber-700 border border-amber-200"
                                : "bg-rose-50 text-rose-700 border border-rose-200"
                            }`}
                          >
                            {pr.status}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPR(pr);
                            }}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-[#FFE0D5] hover:text-[#FF5C28] text-[#042C51] rounded text-[10px] font-extrabold border border-slate-200 transition-colors"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ==================== 5. PROCESS NOTE (EDUCATIONAL CONTEXT) ==================== */}
      <section className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 flex items-start gap-3">
        <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-xs font-black text-[#042C51]">Operational Routing & Personnel Requisition Protocol</h4>
          <p className="text-[10.5px] text-slate-600 leading-relaxed">
            This module tracks and executes Personnel Requisitions (PRs). Filed PRs must adhere strictly to agreed site capacity parameters and corporate budget models. 
            Once submitted, the system schedules automatic SLA timelines targeting fulfillment cycles. Direct modifications to active requirements undergo verification audits by regional HR directors.
          </p>
        </div>
      </section>

      {/* ==================== 6. MODALS & WORKFLOWS ==================== */}

      {/* ADD REQUISITION MODAL */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-[#042C51]/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden text-slate-900"
            >
              <div className="bg-[#042C51] text-white p-4 sm:p-5 flex items-center justify-between border-b border-[#063866]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 text-[#FF5C28] flex items-center justify-center shrink-0">
                    <Inbox className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-base font-black text-white tracking-tight">New Personnel Requisition</h2>
                    <p className="text-[11px] text-slate-300 font-medium">Log headcount additions or updates</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreatePR} className="p-6 space-y-4">
                
                <div className="grid grid-cols-2 gap-4">
                  {/* Request Type */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Request Type</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setNewRequestType("Requisition")}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-extrabold border transition-all ${
                          newRequestType === "Requisition"
                            ? "bg-[#042C51] text-white border-[#042C51]"
                            : "bg-slate-50 text-slate-600 border-slate-200"
                        }`}
                      >
                        Requisition (+ Headcount)
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewRequestType("Downsize")}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-extrabold border transition-all ${
                          newRequestType === "Downsize"
                            ? "bg-rose-50 text-rose-700 border-rose-300"
                            : "bg-slate-50 text-slate-600 border-slate-200"
                        }`}
                      >
                        Downsize (- Quota)
                      </button>
                    </div>
                  </div>

                  {/* Department */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Department</label>
                    <select
                      value={newDepartment}
                      onChange={(e) => setNewDepartment(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:bg-white"
                    >
                      <option value="Telecom & Tech Support">Telecom & Tech Support</option>
                      <option value="Healthcare & Insurance">Healthcare & Insurance</option>
                      <option value="Financial Services Group">Financial Services Group</option>
                      <option value="Retail & E-Commerce">Retail & E-Commerce</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Account */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Account client</label>
                    <select
                      value={newAccount}
                      onChange={(e) => setNewAccount(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:bg-white"
                    >
                      <option value="Verizon Tech">Verizon Tech</option>
                      <option value="Comcast Technical">Comcast Technical</option>
                      <option value="T-Mobile Care">T-Mobile Care</option>
                      <option value="UnitedHealth VIP">UnitedHealth VIP</option>
                      <option value="Chase Credit">Chase Credit</option>
                      <option value="Amazon Care">Amazon Care</option>
                    </select>
                  </div>

                  {/* Job Title */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Job Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Customer Service Representative"
                      required
                      value={newJobTitle}
                      onChange={(e) => setNewJobTitle(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* JD Code */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Job Description (JD) Code</label>
                    <select
                      value={newJdCode}
                      onChange={(e) => setNewJdCode(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:bg-white"
                    >
                      <option value="JD-CSR-TEL-04">JD-CSR-TEL-04 (Tech Specialist)</option>
                      <option value="JD-TECH-HC-09">JD-TECH-HC-09 (Tier 2)</option>
                      <option value="JD-FIN-FRD-01">JD-FIN-FRD-01 (Fraud)</option>
                      <option value="JD-MGR-TL-02">JD-MGR-TL-02 (Team Leader)</option>
                      <option value="JD-HC-CLM-03">JD-HC-CLM-03 (Claims)</option>
                    </select>
                  </div>

                  {/* Headcount */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Required Headcount (slots)</label>
                    <input
                      type="number"
                      min={1}
                      max={150}
                      required
                      value={newHeadcount}
                      onChange={(e) => setNewHeadcount(Number(e.target.value))}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:bg-white font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {/* Reason */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Reason for Hiring</label>
                    <select
                      value={newReason}
                      onChange={(e) => setNewReason(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:bg-white"
                    >
                      <option value="Ramp-up">Ramp-up</option>
                      <option value="Backfill">Backfill</option>
                      <option value="New Position">New Position</option>
                      <option value="Forecasted Growth">Forecasted Growth</option>
                    </select>
                  </div>

                  {/* Location */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Location / Site</label>
                    <select
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:bg-white"
                    >
                      <option value="Davao">Davao Hub</option>
                      <option value="Tagum">Tagum Office</option>
                      <option value="Mabini">Mabini Site</option>
                    </select>
                  </div>

                  {/* Date Needed */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Date Needed By</label>
                    <input
                      type="date"
                      value={newDateNeeded}
                      onChange={(e) => setNewDateNeeded(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:bg-white"
                    />
                  </div>
                </div>

                {/* Narrative Details */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Request Details / Context Remarks</label>
                  <textarea
                    rows={2}
                    placeholder="Briefly describe the specific request context, client goals, and target timeline expectations..."
                    value={newDetails}
                    onChange={(e) => setNewDetails(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:bg-white resize-none"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#042C51] hover:bg-[#FF5C28] text-white rounded-xl text-xs font-black transition-all shadow-xs cursor-pointer"
                  >
                    Submit Requisition
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* VIEW REQUISITION DETAILS MODAL */}
      <AnimatePresence>
        {selectedPR && (
          <div className="fixed inset-0 bg-[#042C51]/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden text-slate-900"
            >
              <div className="bg-[#042C51] text-white p-4 sm:p-5 flex items-center justify-between border-b border-[#063866]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 text-[#FF5C28] flex items-center justify-center shrink-0">
                    <FileText className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-base font-black text-white tracking-tight">Personnel Requisition Form Details</h2>
                    <p className="text-[11px] text-slate-300 font-mono font-bold">{selectedPR.id}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedPR(null)}
                  className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-5 overflow-y-auto max-h-[80vh]">
                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/60">
                  
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase block">Department</span>
                    <span className="text-xs font-extrabold text-[#042C51] block">{selectedPR.department}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase block">Account Client</span>
                    <span className="text-xs font-extrabold text-[#042C51] block">{selectedPR.account}</span>
                  </div>

                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase block">Job Title</span>
                    <span className="text-xs font-extrabold text-[#042C51] block">{selectedPR.jobTitle}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase block">JD Code / Specification</span>
                    <span className="text-xs font-bold text-[#FF5C28] font-mono block">{selectedPR.jdCode}</span>
                  </div>

                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase block">Headcount (Required Slots)</span>
                    <span className="text-sm font-black text-slate-800 font-mono block">{selectedPR.headcount} slots</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase block">Primary Reason</span>
                    <span className="text-xs font-bold text-indigo-600 block">{selectedPR.reason}</span>
                  </div>

                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase block">Location / Site Target</span>
                    <span className="text-xs font-semibold text-slate-700 block">{selectedPR.location} Site</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase block">Date Needed By</span>
                    <span className="text-xs font-bold text-indigo-600 block">{selectedPR.dateNeeded}</span>
                  </div>

                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase block">Filed By Operator</span>
                    <span className="text-xs font-bold text-slate-700 block">
                      {selectedPR.filedBy.name} ({selectedPR.filedBy.role})
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase block">Approval Status</span>
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[9px] font-black uppercase mt-1 ${
                        selectedPR.status === "Approved"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : selectedPR.status === "For Approval"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-rose-50 text-rose-700 border border-rose-200"
                      }`}
                    >
                      {selectedPR.status}
                    </span>
                  </div>

                </div>

                {selectedPR.remarks && (
                  <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-lg">
                    <span className="text-[9px] font-black text-indigo-600 uppercase tracking-wide block mb-0.5">HR/OM Remarks Context</span>
                    <p className="text-xs text-slate-700 leading-normal font-semibold">{selectedPR.remarks}</p>
                  </div>
                )}

                {/* History Timeline */}
                <div className="space-y-3">
                  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Form Action Audit Trail</h3>
                  <div className="space-y-3 pl-2">
                    {selectedPR.history.map((hist, idx) => (
                      <div key={idx} className="flex gap-3 relative">
                        {idx !== selectedPR.history.length - 1 && (
                          <div className="absolute top-5 left-2 bottom-0 w-[1px] bg-slate-200"></div>
                        )}
                        <div className="w-4 h-4 rounded-full bg-[#E9F0FC] border border-[#042C51] text-[#042C51] flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                        <div className="text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-[#042C51]">{hist.action}</span>
                            <span className="text-[9px] font-mono text-slate-400">{hist.date}</span>
                          </div>
                          <span className="text-[10px] text-slate-500 block">Actor: {hist.actor}</span>
                          {hist.remarks && <p className="text-[10px] text-slate-600 italic mt-0.5">"{hist.remarks}"</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* HR ADMIN SIGN-OFF ACTION CONTROLS */}
                {selectedPR.status === "For Approval" && userRoleContext === "HR Admin" && (
                  <div className="pt-4 border-t border-slate-100 space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                        Decline/Approve Remarks or Conditions
                      </label>
                      <input
                        type="text"
                        placeholder="Provide comments, constraints, or reasons for rejection..."
                        value={remarksInput}
                        onChange={(e) => setRemarksInput(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:bg-white"
                      />
                    </div>

                    <div className="flex items-center gap-2 justify-end">
                      <button
                        type="button"
                        onClick={handleRejectPR}
                        className="px-4 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-700 text-xs font-black rounded-lg transition-colors cursor-pointer"
                      >
                        Decline PR Request
                      </button>

                      <button
                        type="button"
                        onClick={handleApprovePR}
                        className="px-4 py-1.5 bg-[#042C51] hover:bg-[#FF5C28] text-white text-xs font-black rounded-lg transition-all cursor-pointer shadow-sm"
                      >
                        Approve Requisition
                      </button>
                    </div>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-100 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setSelectedPR(null)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors"
                  >
                    Close Panel
                  </button>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
