import React, { useState, useMemo } from "react";
import {
  CheckSquare,
  AlertTriangle,
  Clock,
  User,
  Plus,
  Search,
  Filter,
  ShieldAlert,
  Sparkles,
  Layers,
  Compass,
  Network,
  Briefcase,
  ArrowRight,
  Eye,
  RefreshCw,
  BookOpen,
  Info,
  Trash2,
  X,
  ChevronRight,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Activity,
  UserCheck
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ActionItemsProps {
  userEmail?: string;
  onSwitchModule?: (module: string) => void;
}

export interface ActionItem {
  id: string; // e.g. ACT-001
  sourceType: "Manual" | "System";
  description: string;
  module: "Sourcing" | "Pipeline" | "Offers" | "Onboarding" | "General";
  role: string;
  account: string;
  owner: string;
  deadline: string; // Date
  status: "Planned" | "Ongoing" | "Completed" | "Cancelled";
  risk: "Low" | "Medium" | "High";
  gap: "Low Sourcing Volume" | "Aging PRF" | "High Drop-off Rate" | "Delayed Medical Clearance" | "SLA At Risk" | "Contract Issue" | "None";
  longDescription?: string;
  notes?: string;
  history: { date: string; action: string; user: string }[];
}

export interface ModuleSignal {
  id: string;
  title: string;
  module: "Sourcing" | "Pipeline" | "Offers" | "Onboarding";
  severity: "Low" | "Medium" | "High";
  metric: string;
  description: string;
  suggestedAction: string;
}

const INITIAL_ACTION_ITEMS: ActionItem[] = [
  {
    id: "ACT-001",
    sourceType: "System",
    description: "Launch urgent social media boosting for Elevance Health candidates",
    module: "Sourcing",
    role: "Healthcare Support Specialist",
    account: "Elevance Health",
    owner: "Alena Batacan",
    deadline: "2026-07-23",
    status: "Ongoing",
    risk: "High",
    gap: "Low Sourcing Volume",
    longDescription: "System detected a 35% drop in Elevance Health applicants this week. BPO campaign SLA requires 25 profiles weekly.",
    notes: "Allocated budget of Php 5,000 for localized Facebook and TikTok target ads.",
    history: [
      { date: "2026-07-19", action: "System generated signal: Sourcing volume is below threshold.", user: "System" },
      { date: "2026-07-20", action: "Campaign approved and assigned to Alena.", user: "Alena Batacan" }
    ]
  },
  {
    id: "ACT-002",
    sourceType: "System",
    description: "Audit aging candidate files in Stage 2 (Technical Interview) for Chevron Support",
    module: "Pipeline",
    role: "Customer Service Representative",
    account: "Chevron Support",
    owner: "Juan dela Cruz",
    deadline: "2026-07-22",
    status: "Planned",
    risk: "Medium",
    gap: "Aging PRF",
    longDescription: "There are currently 12 candidates sitting in Technical Assessment phase for more than 4 business days. High SLA compliance risk.",
    notes: "Requires coordination with Chevron Operations team for calibration.",
    history: [
      { date: "2026-07-18", action: "System identified aging pipeline items (>3 days).", user: "System" }
    ]
  },
  {
    id: "ACT-003",
    sourceType: "Manual",
    description: "Re-negotiate premium medical allowance cap structure with Citi Global finance",
    module: "Offers",
    role: "Team Leader - BPO Operations",
    account: "Citi Global",
    owner: "Maria Santos",
    deadline: "2026-07-21",
    status: "Ongoing",
    risk: "High",
    gap: "Contract Issue",
    longDescription: "Candidates are dropping out due to medical allowance disparity. Standard cap is Php 2,500, competitors are offering Php 4,000.",
    notes: "Preparing comparative compensation deck to justify increase.",
    history: [
      { date: "2026-07-15", action: "Manual action item created due to candidate exit feedback.", user: "Maria Santos" },
      { date: "2026-07-17", action: "Drafted proposal deck for BPO leadership approval.", user: "Maria Santos" }
    ]
  },
  {
    id: "ACT-004",
    sourceType: "System",
    description: "Follow up with Elevance medical provider on delayed laboratory clearances",
    module: "Onboarding",
    role: "Healthcare Support Specialist",
    account: "Elevance Health",
    owner: "Alena Batacan",
    deadline: "2026-07-25",
    status: "Planned",
    risk: "Medium",
    gap: "Delayed Medical Clearance",
    longDescription: "Three candidates (including Theresa Mae Santos) are waiting for physical exam results. Expected start date is fast approaching.",
    notes: "Contacted clinical admin. Turnaround delayed due to system upgrade on their side.",
    history: [
      { date: "2026-07-20", action: "Auto-triggered based on upcoming expected start date.", user: "System" }
    ]
  },
  {
    id: "ACT-005",
    sourceType: "Manual",
    description: "Execute bulk SMS broadcast to passive tech profiles in Talent Pool",
    module: "Sourcing",
    role: "Technical Support Associate",
    account: "RingCentral Team",
    owner: "Juan dela Cruz",
    deadline: "2026-07-28",
    status: "Completed",
    risk: "Low",
    gap: "None",
    longDescription: "Blast custom message about weekend hiring events to 500 passive candidates from high-affinity technical backgrounds.",
    notes: "Broadcast successfully sent on July 19th. Generated 42 walk-in applications.",
    history: [
      { date: "2026-07-18", action: "Action item registered for campaign enhancement.", user: "Juan dela Cruz" },
      { date: "2026-07-19", action: "SMS blast completed via Gateway API.", user: "Juan dela Cruz" },
      { date: "2026-07-19", action: "Marked task as completed.", user: "Juan dela Cruz" }
    ]
  },
  {
    id: "ACT-006",
    sourceType: "System",
    description: "Review high pre-start withdrawal spike (15% drop-off) in Comcast Technical campaign",
    module: "Onboarding",
    role: "Technical Support Associate",
    account: "Comcast Technical",
    owner: "Alena Batacan",
    deadline: "2026-07-18",
    status: "Ongoing",
    risk: "High",
    gap: "High Drop-off Rate",
    longDescription: "Comcast campaign experiencing unusually high attrition between offer sign-off and actual Day 1 orientation. Target max is 5%. Task is overdue.",
    notes: "Investigating whether sign-on bonus is being paid too late compared to rivals.",
    history: [
      { date: "2026-07-14", action: "System alert: Attrition rate has breached 10% critical threshold.", user: "System" },
      { date: "2026-07-15", action: "Initiated survey to withdrawn candidates.", user: "Alena Batacan" }
    ]
  }
];

const INITIAL_MODULE_SIGNALS: ModuleSignal[] = [
  {
    id: "SIG-001",
    title: "Low Applicant Density Alert",
    module: "Sourcing",
    severity: "High",
    metric: "2.4 applicants / position",
    description: "The Elevance Healthcare Support campaign has only registered 12 applicants against a requirement of 25 profiles this cycle.",
    suggestedAction: "Trigger Facebook local targeted paid ads or run text-blast on passive medical database."
  },
  {
    id: "SIG-002",
    title: "Candidate Staleness Warning",
    module: "Pipeline",
    severity: "Medium",
    metric: "Avg. 5.2 days idle",
    description: "Chevron Customer Support technical assessment has 12 candidates waiting over 4 business days.",
    suggestedAction: "Follow up with operations hiring manager for assessment scoring submission."
  },
  {
    id: "SIG-003",
    title: "Onboarding Pipeline Leakage",
    module: "Onboarding",
    severity: "High",
    metric: "15.4% pre-start withdrawal",
    description: "Comcast Technical Associate campaign has experienced an escalation in pre-employment withdrawals.",
    suggestedAction: "Evaluate and consider implementing virtual orientation or advance uniform fitting kits."
  },
  {
    id: "SIG-004",
    title: "Offer SLA Warning",
    module: "Offers",
    severity: "Low",
    metric: "SLA compliance at 83%",
    description: "Citi Global operations are taking longer than standard 24-hour turnaround to issue written offers post-final pass.",
    suggestedAction: "Review approval workflow delays in the Offer generation pipeline."
  }
];

export default function ActionItems({ userEmail = "alena.batacan@thesiblingssolutions.com", onSwitchModule }: ActionItemsProps) {
  const [items, setItems] = useState<ActionItem[]>(INITIAL_ACTION_ITEMS);
  const [signals] = useState<ModuleSignal[]>(INITIAL_MODULE_SIGNALS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Search & Filtering State
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [riskFilter, setRiskFilter] = useState("All");
  const [moduleFilter, setModuleFilter] = useState("All");
  const [gapFilter, setGapFilter] = useState("All");
  const [ownerFilter, setOwnerFilter] = useState("All");

  // Selected Action Item Details Modal State
  const [selectedItem, setSelectedItem] = useState<ActionItem | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // New Action Item Form State (Create Modal)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newDescription, setNewDescription] = useState("");
  const [newModule, setNewModule] = useState<ActionItem["module"]>("General");
  const [newRole, setNewRole] = useState("Customer Service Representative");
  const [newAccount, setNewAccount] = useState("Elevance Health");
  const [newOwner, setNewOwner] = useState("Alena Batacan");
  const [newDeadline, setNewDeadline] = useState("2026-07-25");
  const [newRisk, setNewRisk] = useState<ActionItem["risk"]>("Medium");
  const [newGap, setNewGap] = useState<ActionItem["gap"]>("None");
  const [newLongDescription, setNewLongDescription] = useState("");
  const [newNotes, setNewNotes] = useState("");

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleResetDatabase = () => {
    setItems(INITIAL_ACTION_ITEMS);
    triggerToast("Action Items registry successfully restored to baseline.");
  };

  // List of unique recruiter owners for filters
  const ownersList = useMemo(() => {
    const set = new Set<string>();
    items.forEach(it => set.add(it.owner));
    return ["All", ...Array.from(set)];
  }, [items]);

  // List of unique gaps for filters
  const gapsList = useMemo(() => {
    const set = new Set<string>();
    items.forEach(it => {
      if (it.gap && it.gap !== "None") set.add(it.gap);
    });
    return ["All", ...Array.from(set)];
  }, [items]);

  // Calculate current date to find overdue items
  // Current metadata says 2026-07-20
  const CURRENT_DATE_STR = "2026-07-20";
  const currentDate = new Date(CURRENT_DATE_STR);

  // Calculations for Metrics Cards
  const metrics = useMemo(() => {
    const total = items.length;
    const active = items.filter(it => it.status === "Ongoing").length;
    const planned = items.filter(it => it.status === "Planned").length;
    const completed = items.filter(it => it.status === "Completed").length;
    const highRisk = items.filter(it => it.risk === "High" && it.status !== "Completed" && it.status !== "Cancelled").length;
    
    // Calculate Overdue (Deadline in the past and not completed/cancelled)
    const overdue = items.filter(it => {
      if (it.status === "Completed" || it.status === "Cancelled") return false;
      return new Date(it.deadline) < currentDate;
    }).length;

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    const totalSignals = signals.length;

    // Percentages for Progress Bars (Action Health)
    const activePct = total > 0 ? Math.round((active / total) * 100) : 0;
    const plannedPct = total > 0 ? Math.round((planned / total) * 100) : 0;
    const completedPct = total > 0 ? Math.round((completed / total) * 100) : 0;
    const highRiskPct = total > 0 ? Math.round((highRisk / total) * 100) : 0;
    const overduePct = total > 0 ? Math.round((overdue / total) * 100) : 0;

    return {
      total,
      active,
      planned,
      completed,
      highRisk,
      overdue,
      completionRate,
      totalSignals,
      activePct,
      plannedPct,
      completedPct,
      highRiskPct,
      overduePct
    };
  }, [items, signals]);

  // Calculate Days Left helper
  const getDaysLeftText = (deadlineStr: string) => {
    const dDate = new Date(deadlineStr);
    const diffTime = dDate.getTime() - currentDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { text: `${Math.abs(diffDays)} days overdue`, colorClass: "text-rose-600 font-bold" };
    } else if (diffDays === 0) {
      return { text: "Due today", colorClass: "text-amber-600 font-bold" };
    } else {
      return { text: `${diffDays} days left`, colorClass: "text-emerald-600 font-semibold" };
    }
  };

  // Filtered Action Items
  const filteredItems = useMemo(() => {
    return items.filter(it => {
      const matchSearch =
        it.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        it.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        it.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        it.account.toLowerCase().includes(searchTerm.toLowerCase()) ||
        it.owner.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = statusFilter === "All" ? true : it.status === statusFilter;
      const matchRisk = riskFilter === "All" ? true : it.risk === riskFilter;
      const matchModule = moduleFilter === "All" ? true : it.module === moduleFilter;
      const matchGap = gapFilter === "All" ? true : it.gap === gapFilter;
      const matchOwner = ownerFilter === "All" ? true : it.owner === ownerFilter;

      return matchSearch && matchStatus && matchRisk && matchModule && matchGap && matchOwner;
    });
  }, [items, searchTerm, statusFilter, riskFilter, moduleFilter, gapFilter, ownerFilter]);

  // Priority Watchlist - high risk open items sorted by nearest deadline
  const priorityWatchlist = useMemo(() => {
    return items
      .filter(it => it.status !== "Completed" && it.status !== "Cancelled" && (it.risk === "High" || it.risk === "Medium"))
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
      .slice(0, 3);
  }, [items]);

  // Create Manual Action Item
  const handleCreateActionItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDescription.trim()) {
      triggerToast("Please provide an action item description!");
      return;
    }

    const newId = `ACT-0${items.length + 1}`;
    const newItem: ActionItem = {
      id: newId,
      sourceType: "Manual",
      description: newDescription.trim(),
      module: newModule,
      role: newRole,
      account: newAccount,
      owner: newOwner,
      deadline: newDeadline,
      status: "Planned",
      risk: newRisk,
      gap: newGap,
      longDescription: newLongDescription.trim() || "Manual operational item created by recruiter.",
      notes: newNotes.trim() || undefined,
      history: [
        { date: CURRENT_DATE_STR, action: "Manual action item created.", user: "Alena Batacan" }
      ]
    };

    setItems([newItem, ...items]);
    setIsCreateModalOpen(false);

    // Reset Form Fields
    setNewDescription("");
    setNewModule("General");
    setNewRole("Customer Service Representative");
    setNewAccount("Elevance Health");
    setNewDeadline("2026-07-25");
    setNewRisk("Medium");
    setNewGap("None");
    setNewLongDescription("");
    setNewNotes("");

    triggerToast(`Custom task ${newId} has been successfully assigned to ${newItem.owner}!`);
  };

  // Complete/Modify Action Item status
  const handleUpdateStatus = (itemId: string, newStatus: ActionItem["status"]) => {
    setItems(prev =>
      prev.map(it => {
        if (it.id === itemId) {
          const updatedHist = [...it.history];
          updatedHist.push({
            date: CURRENT_DATE_STR,
            action: `Status modified from [${it.status}] to [${newStatus}]`,
            user: "Alena Batacan"
          });
          return {
            ...it,
            status: newStatus,
            history: updatedHist
          };
        }
        return it;
      })
    );
    // If details modal is open, also sync state
    if (selectedItem && selectedItem.id === itemId) {
      setSelectedItem(prev => prev ? { ...prev, status: newStatus } : null);
    }
    triggerToast(`Task status updated to ${newStatus}!`);
  };

  // Add notes from within the Details Modal
  const [tempNotesInput, setTempNotesInput] = useState("");
  const handleAddModalNotes = () => {
    if (!selectedItem || !tempNotesInput.trim()) return;

    setItems(prev =>
      prev.map(it => {
        if (it.id === selectedItem.id) {
          const updatedHist = [...it.history];
          updatedHist.push({
            date: CURRENT_DATE_STR,
            action: `Added operational progress notes.`,
            user: "Alena Batacan"
          });
          return {
            ...it,
            notes: tempNotesInput.trim(),
            history: updatedHist
          };
        }
        return it;
      })
    );

    setSelectedItem(prev => prev ? { ...prev, notes: tempNotesInput.trim() } : null);
    setTempNotesInput("");
    triggerToast("Notes updated successfully.");
  };

  return (
    <div className="flex-1 flex flex-col space-y-6 select-none relative" id="action-items-module-root">
      
      {/* Toast Banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 right-6 bg-[#042C51] border-l-4 border-[#FF5C28] text-white px-5 py-3 rounded-r-xl shadow-2xl z-50 flex items-center gap-3 text-xs font-semibold animate-pulse"
          >
            <CheckCircle2 className="w-4.5 h-4.5 text-[#FF5C28]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================== 1. HEADER & ACTIONS ==================== */}
      <section className="bg-white p-5 rounded-2xl border border-[#E6ECF2] shadow-sm flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-[#E9F0FC] text-[#042C51] px-2.5 py-0.5 rounded font-black border border-blue-100 uppercase tracking-wider flex items-center gap-1">
              <Activity className="w-3 h-3 text-[#FF5C28]" />
              Strategic Risk Shield
            </span>
            <span className="text-[10px] bg-[#FFF0EB] text-[#FF5C28] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
              Recruitment SLA Auditor
            </span>
          </div>
          <h1 className="text-xl font-black text-[#042C51] tracking-tight">Recruitment Action Items & Blockers</h1>
          <p className="text-xs text-[#667085] leading-normal">
            Track and manage recruitment activities, blockers, and system-suggested actions to shield campaign SLA parameters.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto">
          <button
            onClick={handleResetDatabase}
            className="p-2 text-slate-600 hover:text-[#042C51] bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer"
            title="Restore default test items"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-3.5 py-2 bg-[#FF5C28] hover:bg-[#E04B1D] text-white font-black text-xs rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-sm hover:shadow"
          >
            <Plus className="w-4 h-4" />
            Add Action Item
          </button>
        </div>
      </section>

      {/* ==================== 2. ACTION ITEMS SUMMARY (METRICS) ==================== */}
      <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {/* Total Actions */}
        <div className="bg-white p-3.5 rounded-xl border border-[#E6ECF2] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[9px] font-black uppercase tracking-wider">Total Actions</span>
            <CheckSquare className="w-4 h-4 text-[#042C51]" />
          </div>
          <div className="mt-2">
            <h3 className="text-lg font-black text-[#042C51] tracking-tight">{metrics.total}</h3>
            <p className="text-[8px] text-[#667085] mt-0.5">Manual + Auto tasks</p>
          </div>
        </div>

        {/* Active Tasks */}
        <div className="bg-white p-3.5 rounded-xl border border-amber-100 bg-amber-50/10 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-500">
            <span className="text-[9px] font-black uppercase tracking-wider text-amber-800">Active</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2">
            <h3 className="text-lg font-black text-amber-800 tracking-tight">{metrics.active}</h3>
            <p className="text-[8px] text-amber-600 mt-0.5">Currently Ongoing</p>
          </div>
        </div>

        {/* Planned (Not Started) */}
        <div className="bg-white p-3.5 rounded-xl border border-blue-100 bg-blue-50/10 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-blue-500">
            <span className="text-[9px] font-black uppercase tracking-wider text-blue-800">Planned</span>
            <Layers className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2">
            <h3 className="text-lg font-black text-blue-800 tracking-tight">{metrics.planned}</h3>
            <p className="text-[8px] text-blue-600 mt-0.5">Not yet started</p>
          </div>
        </div>

        {/* Completed & Completion Rate */}
        <div className="bg-white p-3.5 rounded-xl border border-emerald-100 bg-emerald-50/10 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-500">
            <span className="text-[9px] font-black uppercase tracking-wider text-emerald-800">Completed</span>
            <span className="text-[9px] font-mono font-black text-emerald-600 bg-emerald-50 px-1 py-0.5 rounded">
              {metrics.completionRate}%
            </span>
          </div>
          <div className="mt-2">
            <h3 className="text-lg font-black text-emerald-800 tracking-tight">{metrics.completed}</h3>
            <p className="text-[8px] text-emerald-600 mt-0.5">Resolved items</p>
          </div>
        </div>

        {/* High Risk */}
        <div className="bg-white p-3.5 rounded-xl border border-rose-100 bg-rose-50/10 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-rose-500">
            <span className="text-[9px] font-black uppercase tracking-wider text-rose-800">High Risk</span>
            <ShieldAlert className="w-4 h-4 text-rose-600" />
          </div>
          <div className="mt-2">
            <h3 className="text-lg font-black text-rose-800 tracking-tight">{metrics.highRisk}</h3>
            <p className="text-[8px] text-rose-600 mt-0.5">Immediate threat</p>
          </div>
        </div>

        {/* Overdue */}
        <div className="bg-white p-3.5 rounded-xl border border-purple-100 bg-purple-50/10 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-purple-500">
            <span className="text-[9px] font-black uppercase tracking-wider text-purple-800">Overdue</span>
            <AlertTriangle className="w-4 h-4 text-purple-600" />
          </div>
          <div className="mt-2">
            <h3 className="text-lg font-black text-purple-800 tracking-tight">{metrics.overdue}</h3>
            <p className="text-[8px] text-purple-600 mt-0.5">Past deadline</p>
          </div>
        </div>

        {/* Module Signals Count */}
        <div className="bg-gradient-to-br from-[#042C51] to-[#0a467e] p-3.5 rounded-xl shadow-sm flex flex-col justify-between text-white">
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-[9px] font-black uppercase tracking-wider text-white">Signals</span>
            <Sparkles className="w-3.5 h-3.5 text-[#FF5C28]" />
          </div>
          <div className="mt-2">
            <h3 className="text-lg font-black text-white tracking-tight">{metrics.totalSignals}</h3>
            <p className="text-[8px] text-slate-200 mt-0.5">Data-driven flags</p>
          </div>
        </div>
      </section>

      {/* Grid of Priority Watchlist, Recruitment Action Health, and Module Signals */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* ==================== 3. RECRUITMENT ACTION HEALTH & 4. PRIORITY WATCHLIST ==================== */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Recruitment Action Health progress section */}
          <div className="bg-white p-5 rounded-2xl border border-[#E6ECF2] shadow-sm space-y-4">
            <div>
              <h2 className="text-xs font-black text-[#042C51] uppercase tracking-wider">Recruitment Action Health Profile</h2>
              <p className="text-[11px] text-slate-500">Proportion of planned, active, completed, high risk, and overdue tasks in current campaign sprints.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
              {/* Planned */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-slate-600">Planned</span>
                  <span className="font-mono">{metrics.plannedPct}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${metrics.plannedPct}%` }}
                    className="h-full bg-blue-400 rounded-full"
                  />
                </div>
                <p className="text-[9px] text-slate-400">Queue stage</p>
              </div>

              {/* Ongoing */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-amber-700">Ongoing</span>
                  <span className="font-mono">{metrics.activePct}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${metrics.activePct}%` }}
                    className="h-full bg-amber-500 rounded-full"
                  />
                </div>
                <p className="text-[9px] text-slate-400">Active engagement</p>
              </div>

              {/* Completed */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-emerald-700">Completed</span>
                  <span className="font-mono">{metrics.completedPct}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${metrics.completedPct}%` }}
                    className="h-full bg-emerald-500 rounded-full"
                  />
                </div>
                <p className="text-[9px] text-slate-400">SLA closed</p>
              </div>

              {/* High Risk */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-rose-700">High Risk</span>
                  <span className="font-mono">{metrics.highRiskPct}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${metrics.highRiskPct}%` }}
                    className="h-full bg-rose-500 rounded-full"
                  />
                </div>
                <p className="text-[9px] text-slate-400">Threat vectors</p>
              </div>

              {/* Overdue */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-purple-700">Overdue</span>
                  <span className="font-mono">{metrics.overduePct}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${metrics.overduePct}%` }}
                    className="h-full bg-purple-600 rounded-full"
                  />
                </div>
                <p className="text-[9px] text-slate-400">SLA breached</p>
              </div>
            </div>
          </div>

          {/* Priority Watchlist Section */}
          <div className="bg-white p-5 rounded-2xl border border-[#E6ECF2] shadow-sm space-y-3.5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-black text-[#042C51] uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-[#FF5C28]" />
                  Priority Watchlist (SLA-At-Risk)
                </h3>
                <p className="text-[11px] text-slate-500">Most urgent open items that require immediate resolution.</p>
              </div>
              <span className="text-[9px] bg-rose-50 text-rose-800 font-extrabold px-2 py-0.5 rounded border border-rose-100 uppercase tracking-wider">
                Action Required
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {priorityWatchlist.map(it => {
                const daysInfo = getDaysLeftText(it.deadline);
                return (
                  <div key={it.id} className="py-2.5 flex items-start justify-between gap-3 text-xs">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold text-[#042C51] bg-slate-100 px-1.5 py-0.5 rounded">
                          {it.id}
                        </span>
                        <span className="font-black text-slate-700 truncate max-w-[320px] block">
                          {it.description}
                        </span>
                        <span className={`text-[9px] font-black uppercase px-2 py-0.2 rounded ${
                          it.risk === "High" ? "bg-rose-50 text-rose-700" : "bg-amber-50 text-amber-700"
                        }`}>
                          {it.risk} Risk
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-slate-400">
                        <span className="font-bold text-[#042C51]">{it.account}</span>
                        <span>•</span>
                        <span>Role: {it.role}</span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5 text-slate-500 font-medium">
                          <User className="w-3 h-3" /> Owner: {it.owner}
                        </span>
                      </div>
                    </div>

                    <div className="text-right space-y-1">
                      <p className="font-mono font-bold text-slate-500 text-[10px]">Deadline: {it.deadline}</p>
                      <p className={`text-[10px] font-black ${daysInfo.colorClass}`}>{daysInfo.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* ==================== 5. RECRUITMENT MODULE SIGNALS ==================== */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-[#E6ECF2] shadow-sm flex flex-col space-y-4">
          <div>
            <h2 className="text-xs font-black text-[#042C51] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#FF5C28]" />
              Data-Driven Module Signals
            </h2>
            <p className="text-[11px] text-slate-500">Auto-detected bottlenecks extracted directly from operational modules.</p>
          </div>

          <div className="flex-1 flex flex-col gap-3.5 overflow-y-auto max-h-[340px] pr-1">
            {signals.map(sig => (
              <div
                key={sig.id}
                className={`p-3 rounded-xl border flex flex-col justify-between gap-1.5 transition-all text-xs ${
                  sig.severity === "High" 
                    ? "bg-rose-50/40 border-rose-100 hover:bg-rose-50/60" 
                    : sig.severity === "Medium"
                    ? "bg-amber-50/40 border-amber-100 hover:bg-amber-50/60"
                    : "bg-blue-50/40 border-blue-100 hover:bg-blue-50/60"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className={`text-[8.5px] font-black uppercase px-2 py-0.5 rounded ${
                    sig.severity === "High"
                      ? "bg-rose-500 text-white"
                      : sig.severity === "Medium"
                      ? "bg-amber-500 text-white"
                      : "bg-blue-500 text-white"
                  }`}>
                    {sig.module} ({sig.severity})
                  </span>
                  <span className="font-mono text-[9px] text-[#042C51] font-bold bg-white/80 px-1.5 py-0.5 rounded border border-slate-200">
                    {sig.metric}
                  </span>
                </div>

                <div className="space-y-0.5">
                  <h4 className="font-extrabold text-[#042C51] text-[11px]">{sig.title}</h4>
                  <p className="text-[10px] text-[#667085] leading-normal">{sig.description}</p>
                </div>

                <div className="pt-1.5 border-t border-dashed border-slate-200 flex items-center justify-between text-[9px] font-bold">
                  <span className="text-[#FF5C28]">Suggested Action:</span>
                  <span className="text-slate-700 underline truncate max-w-[180px]" title={sig.suggestedAction}>
                    {sig.suggestedAction}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ==================== 6. FILTERING & SEARCH ==================== */}
      <section className="bg-white p-4 rounded-xl border border-[#E6ECF2] shadow-sm flex flex-wrap items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search action items, ID, BPO role, or recruiters..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#042C51] focus:bg-white text-slate-800 placeholder-slate-400"
          />
        </div>

        {/* Status Dropdown */}
        <div className="w-full sm:w-36">
          <div className="relative">
            <span className="absolute left-2 text-[8px] font-black uppercase text-slate-400 tracking-wider top-1">Status</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-2 pr-8 pt-4 pb-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-extrabold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#042C51] focus:bg-white appearance-none cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Planned">Planned</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
              <ChevronRight className="w-3 h-3 rotate-90" />
            </div>
          </div>
        </div>

        {/* Risk Dropdown */}
        <div className="w-full sm:w-32">
          <div className="relative">
            <span className="absolute left-2 text-[8px] font-black uppercase text-slate-400 tracking-wider top-1">Risk Level</span>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="w-full pl-2 pr-8 pt-4 pb-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-extrabold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#042C51] focus:bg-white appearance-none cursor-pointer"
            >
              <option value="All">All Risks</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
              <ChevronRight className="w-3 h-3 rotate-90" />
            </div>
          </div>
        </div>

        {/* Module Dropdown */}
        <div className="w-full sm:w-36">
          <div className="relative">
            <span className="absolute left-2 text-[8px] font-black uppercase text-slate-400 tracking-wider top-1">Module Source</span>
            <select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              className="w-full pl-2 pr-8 pt-4 pb-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-extrabold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#042C51] focus:bg-white appearance-none cursor-pointer"
            >
              <option value="All">All Modules</option>
              <option value="Sourcing">Sourcing</option>
              <option value="Pipeline">Pipeline</option>
              <option value="Offers">Offers</option>
              <option value="Onboarding">Onboarding</option>
              <option value="General">General</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
              <ChevronRight className="w-3 h-3 rotate-90" />
            </div>
          </div>
        </div>

        {/* Gap Dropdown */}
        <div className="w-full sm:w-44">
          <div className="relative">
            <span className="absolute left-2 text-[8px] font-black uppercase text-slate-400 tracking-wider top-1">Identified Gap</span>
            <select
              value={gapFilter}
              onChange={(e) => setGapFilter(e.target.value)}
              className="w-full pl-2 pr-8 pt-4 pb-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-extrabold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#042C51] focus:bg-white appearance-none cursor-pointer"
            >
              {gapsList.map(g => (
                <option key={g} value={g}>
                  {g === "All" ? "All Gaps" : g}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
              <ChevronRight className="w-3 h-3 rotate-90" />
            </div>
          </div>
        </div>

        {/* Owner Dropdown */}
        <div className="w-full sm:w-44">
          <div className="relative">
            <span className="absolute left-2 text-[8px] font-black uppercase text-slate-400 tracking-wider top-1">Assigned Recruiter</span>
            <select
              value={ownerFilter}
              onChange={(e) => setOwnerFilter(e.target.value)}
              className="w-full pl-2 pr-8 pt-4 pb-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-extrabold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#042C51] focus:bg-white appearance-none cursor-pointer"
            >
              {ownersList.map(o => (
                <option key={o} value={o}>
                  {o === "All" ? "All Recruiters" : o}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
              <ChevronRight className="w-3 h-3 rotate-90" />
            </div>
          </div>
        </div>

        {/* Clear Filters */}
        {(searchTerm || statusFilter !== "All" || riskFilter !== "All" || moduleFilter !== "All" || gapFilter !== "All" || ownerFilter !== "All") && (
          <button
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("All");
              setRiskFilter("All");
              setModuleFilter("All");
              setGapFilter("All");
              setOwnerFilter("All");
            }}
            className="text-xs text-[#FF5C28] hover:underline font-bold px-2 py-1 shrink-0 cursor-pointer"
          >
            Clear Filters
          </button>
        )}
      </section>

      {/* ==================== 7. ACTION ITEMS LIST (DATA TABLE) ==================== */}
      <section className="bg-white rounded-2xl border border-[#E6ECF2] shadow-sm overflow-hidden">
        
        {/* Table header ledger metrics */}
        <div className="px-5 py-3.5 bg-slate-50 border-b border-[#E6ECF2] flex items-center justify-between">
          <span className="text-[11px] font-black tracking-wide text-[#042C51] uppercase">
            Recruitment SLA Mitigation Ledger
          </span>
          <span className="text-[10px] text-slate-500 font-mono font-bold bg-white px-2.5 py-0.5 rounded-md border border-slate-200">
            Showing {filteredItems.length} Records
          </span>
        </div>

        {/* Table itself */}
        <div className="overflow-x-auto">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <p className="text-xs font-bold">No tactical action items found matching your filter criteria.</p>
              <p className="text-[10px] text-slate-400">Add a manual task or loosen your filter parameters.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E6ECF2] bg-slate-50/50 text-[10px] uppercase text-[#667085] font-black">
                  <th className="py-3 px-5">Action ID</th>
                  <th className="py-3 px-5">Action Item</th>
                  <th className="py-3 px-5">Module</th>
                  <th className="py-3 px-5">Role & Account</th>
                  <th className="py-3 px-5">Owner</th>
                  <th className="py-3 px-5">Deadline</th>
                  <th className="py-3 px-5">Status</th>
                  <th className="py-3 px-5">Risk</th>
                  <th className="py-3 px-5">Gap Identified</th>
                  <th className="py-3 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6ECF2]">
                {filteredItems.map(it => {
                  const daysInfo = getDaysLeftText(it.deadline);
                  return (
                    <tr key={it.id} className="hover:bg-slate-50/40 transition-colors text-xs text-slate-700">
                      {/* Action ID & Source */}
                      <td className="py-3 px-5">
                        <div className="space-y-0.5">
                          <p className="font-mono font-bold text-[#042C51]">{it.id}</p>
                          <p className={`text-[8px] font-black uppercase px-1 rounded inline-block ${
                            it.sourceType === "System" 
                              ? "bg-purple-50 text-purple-700 border border-purple-100" 
                              : "bg-blue-50 text-blue-700 border border-blue-100"
                          }`}>
                            {it.sourceType}
                          </p>
                        </div>
                      </td>

                      {/* Action Item Description */}
                      <td className="py-3 px-5 max-w-[280px]">
                        <p className="font-extrabold text-[#042C51] truncate" title={it.description}>
                          {it.description}
                        </p>
                      </td>

                      {/* Module Badge */}
                      <td className="py-3 px-5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-black bg-slate-100 text-[#042C51] border border-slate-200 uppercase">
                          {it.module}
                        </span>
                      </td>

                      {/* Role / Account */}
                      <td className="py-3 px-5">
                        <div className="space-y-0.5">
                          <p className="font-bold text-[#042C51]">{it.account}</p>
                          <p className="text-[10px] text-slate-500 font-semibold">{it.role}</p>
                        </div>
                      </td>

                      {/* Owner */}
                      <td className="py-3 px-5 text-slate-600 font-bold">
                        {it.owner}
                      </td>

                      {/* Deadline & Days Left */}
                      <td className="py-3 px-5">
                        <div className="space-y-0.5 font-mono text-[10.5px]">
                          <p className="text-slate-600 font-semibold">{it.deadline}</p>
                          <p className={`text-[9.5px] font-black ${daysInfo.colorClass}`}>{daysInfo.text}</p>
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3 px-5">
                        {it.status === "Planned" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-50 text-blue-800 border border-blue-200">
                            Planned
                          </span>
                        )}
                        {it.status === "Ongoing" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-50 text-amber-800 border border-amber-200">
                            Ongoing
                          </span>
                        )}
                        {it.status === "Completed" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-800 border border-emerald-200">
                            Completed
                          </span>
                        )}
                        {it.status === "Cancelled" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-slate-100 text-slate-500 border border-slate-200">
                            Cancelled
                          </span>
                        )}
                      </td>

                      {/* Risk Badge */}
                      <td className="py-3 px-5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                          it.risk === "High" 
                            ? "bg-rose-50 text-rose-800 border border-rose-200" 
                            : it.risk === "Medium"
                            ? "bg-amber-50 text-amber-800 border border-amber-200"
                            : "bg-blue-50 text-blue-800 border border-blue-200"
                        }`}>
                          {it.risk}
                        </span>
                      </td>

                      {/* Gap Identified Badge */}
                      <td className="py-3 px-5">
                        {it.gap !== "None" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#FFF0EB] text-[#FF5C28] border border-orange-100">
                            {it.gap}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">None</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {it.status !== "Completed" && (
                            <button
                              onClick={() => handleUpdateStatus(it.id, "Completed")}
                              className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10px] rounded transition-colors flex items-center gap-1 cursor-pointer"
                              title="Resolve Action Item"
                            >
                              Resolve
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setSelectedItem(it);
                              setIsDetailsModalOpen(true);
                            }}
                            className="p-1.5 text-slate-600 hover:text-[#042C51] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="View Action Trail & Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* ==================== 8. ACTION ITEMS DESIGN NOTE ==================== */}
      <section className="bg-slate-50 border border-[#E6ECF2] p-5 rounded-xl">
        <div className="flex gap-3">
          <BookOpen className="w-5 h-5 text-[#042C51] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-black text-[#042C51] uppercase tracking-wider">
              Recruitment SLA Guard & Signal Integration Note
            </h4>
            <p className="text-[11px] text-[#667085] leading-relaxed">
              <strong>System-Suggested Items</strong> are dynamically generated via scheduled metrics sweeps across recruitment modules, tracking specific bottlenecks (such as aging talent pools, low sourcing yields, and high pre-start attrition). <strong>Manual Items</strong> are logged by recruiters to document direct campaign roadblocks like allowance re-negotiations or regional medical provider scheduling conflicts. Completing items ensures recruitment metrics maintain optimum pipeline health.
            </p>
            <div className="pt-2 flex flex-wrap gap-x-4 gap-y-1.5 text-[10px] font-bold text-slate-600 font-mono">
              <span className="flex items-center gap-1 text-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Dynamic Threshold Monitoring: Active
              </span>
              <span className="flex items-center gap-1 text-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                SLA Compliance Safe Target: 90%
              </span>
              <span className="flex items-center gap-1 text-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                Auditor Session: {userEmail.split("@")[0]}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 9. MODALS & WORKFLOWS ==================== */}

      {/* MODAL: ADD MANUAL ACTION ITEM */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="px-6 py-4 bg-[#042C51] text-white flex items-center justify-between">
                <div className="space-y-0.5">
                  <h3 className="text-sm font-black tracking-tight flex items-center gap-2">
                    <CheckSquare className="w-4.5 h-4.5 text-[#FF5C28]" />
                    Create Tactical Action Item
                  </h3>
                  <p className="text-[10px] text-slate-300 font-medium">Log manual blockers, tasks, and SLA mitigation work.</p>
                </div>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleCreateActionItem} className="p-6 space-y-4">
                
                {/* Description */}
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Action Description</label>
                  <input
                    type="text"
                    placeholder="e.g. Schedule calibration with Elevance Operations Director"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:bg-white text-slate-800"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Module Source */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Module Category</label>
                    <select
                      value={newModule}
                      onChange={(e) => setNewModule(e.target.value as ActionItem["module"])}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:bg-white text-slate-800 cursor-pointer"
                    >
                      <option value="Sourcing">Sourcing</option>
                      <option value="Pipeline">Pipeline</option>
                      <option value="Offers">Offers</option>
                      <option value="Onboarding">Onboarding</option>
                      <option value="General">General</option>
                    </select>
                  </div>

                  {/* Risk Level */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Risk Severity</label>
                    <select
                      value={newRisk}
                      onChange={(e) => setNewRisk(e.target.value as ActionItem["risk"])}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:bg-white text-slate-800 cursor-pointer"
                    >
                      <option value="Low">Low Risk</option>
                      <option value="Medium">Medium Risk</option>
                      <option value="High">High Risk (SLA-At-Risk)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Campaign Account */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider">BPO Account</label>
                    <select
                      value={newAccount}
                      onChange={(e) => setNewAccount(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:bg-white text-slate-800 cursor-pointer"
                    >
                      <option value="Elevance Health">Elevance Health</option>
                      <option value="Chevron Support">Chevron Support</option>
                      <option value="Citi Global">Citi Global</option>
                      <option value="Capital One Help">Capital One Help</option>
                      <option value="RingCentral Team">RingCentral Team</option>
                    </select>
                  </div>

                  {/* Target Designation Role */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Campaign Target Role</label>
                    <select
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:bg-white text-slate-800 cursor-pointer"
                    >
                      <option value="Customer Service Representative">Customer Service Representative</option>
                      <option value="Technical Support Associate">Technical Support Associate</option>
                      <option value="Healthcare Support Specialist">Healthcare Support Specialist</option>
                      <option value="Team Leader - BPO Operations">Team Leader - BPO Operations</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Deadline Date */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Deadline Target Date</label>
                    <input
                      type="date"
                      value={newDeadline}
                      onChange={(e) => setNewDeadline(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:bg-white text-slate-800"
                      required
                    />
                  </div>

                  {/* Owner */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Assigned Recruiter Owner</label>
                    <input
                      type="text"
                      value={newOwner}
                      onChange={(e) => setNewOwner(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:bg-white text-slate-800"
                      required
                    />
                  </div>
                </div>

                {/* Gap Dropdown */}
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Identified Leakage Gap</label>
                  <select
                    value={newGap}
                    onChange={(e) => setNewGap(e.target.value as ActionItem["gap"])}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:bg-white text-slate-800 cursor-pointer"
                  >
                    <option value="None">None / General Task</option>
                    <option value="Low Sourcing Volume">Low Sourcing Volume</option>
                    <option value="Aging PRF">Aging PRF (Pending Roster Request)</option>
                    <option value="High Drop-off Rate">High Drop-off Rate</option>
                    <option value="Delayed Medical Clearance">Delayed Medical Clearance</option>
                    <option value="SLA At Risk">SLA At Risk</option>
                    <option value="Contract Issue">Contract Issue</option>
                  </select>
                </div>

                {/* Long Description */}
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Detailed Context & Blocker Breakdown</label>
                  <textarea
                    rows={2}
                    placeholder="Describe specific roadblocks and why this action item is necessary to preserve the hiring campaign timeline."
                    value={newLongDescription}
                    onChange={(e) => setNewLongDescription(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:bg-white text-slate-800 resize-none"
                  />
                </div>

                {/* Save & Cancel buttons */}
                <div className="pt-3 border-t border-slate-100 flex justify-end gap-2 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#FF5C28] hover:bg-[#E04B1D] text-white rounded-lg transition-colors cursor-pointer"
                  >
                    Save Action Item
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: ACTION ITEM DETAILS & OPERATIONS DIALOG */}
      <AnimatePresence>
        {isDetailsModalOpen && selectedItem && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="px-6 py-4 bg-[#042C51] text-white flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-black bg-[#FF5C28] text-white px-1.5 py-0.5 rounded">
                      {selectedItem.id}
                    </span>
                    <span className="text-[10px] uppercase font-black tracking-wider text-slate-300">
                      {selectedItem.sourceType} Source Action Item
                    </span>
                  </div>
                  <h3 className="text-sm font-black tracking-tight mt-1">{selectedItem.description}</h3>
                </div>
                <button
                  onClick={() => {
                    setIsDetailsModalOpen(false);
                    setSelectedItem(null);
                  }}
                  className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-5 overflow-y-auto max-h-[500px]">
                
                {/* Meta details grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Module Source</p>
                    <p className="text-xs font-black text-[#042C51]">{selectedItem.module}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Risk Level</p>
                    <p className="text-xs font-black text-[#042C51]">{selectedItem.risk}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Assigned Owner</p>
                    <p className="text-xs font-extrabold text-[#042C51]">{selectedItem.owner}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Deadline Date</p>
                    <p className="text-xs font-mono font-bold text-slate-700">{selectedItem.deadline}</p>
                  </div>
                </div>

                {/* Campaign context block */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Assigned Campaign Account</p>
                    <p className="text-xs font-extrabold text-[#042C51]">{selectedItem.account}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Target Campaign Role</p>
                    <p className="text-xs font-extrabold text-[#042C51]">{selectedItem.role}</p>
                  </div>
                </div>

                {/* Detailed Context */}
                <div className="space-y-1.5">
                  <p className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Detailed Context & Roadblocks</p>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs text-slate-600 leading-relaxed font-semibold">
                    {selectedItem.longDescription}
                  </div>
                </div>

                {/* Identified Leakage Gap */}
                <div className="space-y-1 flex items-center justify-between border-t border-slate-100 pt-3">
                  <p className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Identified SLA Leakage Gap</p>
                  <span className="text-xs font-black text-[#FF5C28] bg-orange-50 px-3 py-1 rounded border border-orange-100">
                    {selectedItem.gap}
                  </span>
                </div>

                {/* Status management block */}
                <div className="space-y-2 border-t border-slate-100 pt-3">
                  <p className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Modify Current Status</p>
                  <div className="flex flex-wrap gap-1.5 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(selectedItem.id, "Planned")}
                      className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                        selectedItem.status === "Planned" ? "bg-blue-600 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                      }`}
                    >
                      Planned
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(selectedItem.id, "Ongoing")}
                      className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                        selectedItem.status === "Ongoing" ? "bg-amber-500 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                      }`}
                    >
                      Ongoing
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(selectedItem.id, "Completed")}
                      className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                        selectedItem.status === "Completed" ? "bg-emerald-600 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                      }`}
                    >
                      Completed
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(selectedItem.id, "Cancelled")}
                      className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                        selectedItem.status === "Cancelled" ? "bg-slate-600 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                      }`}
                    >
                      Cancelled
                    </button>
                  </div>
                </div>

                {/* Progress notes */}
                <div className="space-y-2 border-t border-slate-100 pt-3">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">Add / Update Operational Progress Notes</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type a new operational progress note or mitigation update..."
                      value={tempNotesInput}
                      onChange={(e) => setTempNotesInput(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:bg-white text-slate-800"
                    />
                    <button
                      type="button"
                      onClick={handleAddModalNotes}
                      className="px-4 py-1.5 bg-[#042C51] hover:bg-[#0a467e] text-white font-black text-xs rounded-lg transition-colors cursor-pointer shrink-0"
                    >
                      Update Note
                    </button>
                  </div>
                  {selectedItem.notes && (
                    <div className="bg-orange-50/50 p-2.5 rounded-lg border border-orange-100 text-[11px] text-slate-600 font-medium">
                      <strong className="text-[#FF5C28]">Current Notes:</strong> {selectedItem.notes}
                    </div>
                  )}
                </div>

                {/* History trail */}
                <div className="space-y-2 border-t border-slate-100 pt-3">
                  <p className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Audit & History Trail</p>
                  <div className="bg-slate-50 rounded-lg border border-slate-100 divide-y divide-slate-200">
                    {selectedItem.history.map((hist, hIdx) => (
                      <div key={hIdx} className="p-2.5 flex items-start justify-between text-[10px]">
                        <div className="space-y-0.5">
                          <p className="font-extrabold text-[#042C51]">{hist.action}</p>
                          <p className="text-slate-400">Triggered by: {hist.user}</p>
                        </div>
                        <span className="font-mono text-slate-400 font-semibold">{hist.date}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setIsDetailsModalOpen(false);
                    setSelectedItem(null);
                  }}
                  className="px-5 py-1.5 bg-[#042C51] text-white font-black text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Close Portal
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
