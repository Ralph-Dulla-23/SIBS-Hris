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
  RefreshCw,
  BookOpen,
  Info,
  X,
  ChevronRight,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Activity,
  ExternalLink,
  Calendar,
  Building,
  UserCheck,
  FileText,
  RotateCcw,
  Zap,
  Target,
  ArrowRight,
  Mail,
  Send,
  Download,
  Printer,
  Share2,
  Paperclip,
  Eye,
  Copy,
  Check
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
  cluster?: string;
  owner: string;
  deadline: string; // Date
  status: "Planned" | "Ongoing" | "Completed" | "Cancelled";
  risk: "Low" | "Medium" | "High";
  gap: "Low Sourcing Volume" | "Aging PRF" | "High Drop-off Rate" | "Delayed Medical Clearance" | "SLA At Risk" | "Contract Issue" | "None" | string;
  requirement?: number;
  filled?: number;
  remainingGap?: number;
  createdDate?: string;
  completedDate?: string;
  longDescription?: string;
  notes?: string;
  history: { date: string; action: string; user: string }[];

  // Linkage metadata for weekly reporting & source tracking
  weeklyPlanItemId?: string;
  hiringNeedId?: string;
  sourceModule?: string;
  sourceRecordId?: string;
  currentStatusRowId?: string;
  roleAccountKey?: string;
  reportingWeek?: string;
  atRiskReason?: string;
  latestStatusNote?: string;
}

export interface ActionFormState {
  weeklyPlanItemId: string;
  hiringNeedId: string;
  sourceModule: string;
  sourceRecordId: string;
  currentStatusRowId: string;
  roleAccountKey: string;
  cluster: string;
  reportingWeek: string;

  roleAccount: string;
  roleTitle: string;
  account: string;
  requirement: number;
  filled: number;

  actionItem: string;
  owner: string;
  deadline: string;
  status: "Planned" | "Ongoing" | "Completed";
  riskLevel: "High" | "Medium" | "Low";
  linkedGap: string;
  remarks: string;

  atRiskReason: string;
  latestStatusNote: string;
}

export const EMPTY_ACTION_FORM: ActionFormState = {
  weeklyPlanItemId: "",
  hiringNeedId: "",
  sourceModule: "Workforce Hiring Plan",
  sourceRecordId: "",
  currentStatusRowId: "",
  roleAccountKey: "",
  cluster: "General",
  reportingWeek: "W29 (Jul 14 - Jul 20)",

  roleAccount: "",
  roleTitle: "",
  account: "",
  requirement: 0,
  filled: 0,

  actionItem: "",
  owner: "Alena Batacan",
  deadline: "2026-07-25",
  status: "Planned",
  riskLevel: "Medium",
  linkedGap: "Pipeline",
  remarks: "",

  atRiskReason: "",
  latestStatusNote: "",
};

const OWNER_OPTIONS = [
  "Alena Batacan",
  "Rhea Torres",
  "Mark Anthony",
  "Sarah Jenkins",
  "Devon Vance",
  "Maria Santos"
];

const LINKED_GAP_OPTIONS = [
  "Pipeline",
  "Screening",
  "Interview",
  "Offer",
  "JD",
  "Approval",
  "Capacity / Manpower",
  "Onboarding",
  "Reporting",
  "Low Sourcing Volume",
  "Aging PRF",
  "High Drop-off Rate",
  "Delayed Medical Clearance",
  "SLA At Risk",
  "Contract Issue",
  "None"
];

export interface ModuleSignal {
  id: string;
  title: string;
  module: "Sourcing" | "Pipeline" | "Offers" | "Onboarding";
  severity: "Low" | "Medium" | "High";
  metric: string;
  description: string;
  suggestedAction: string;
}

export interface WeeklyPerformanceRecord {
  id: string;
  role: string;
  account: string;
  cluster: string;
  weekCovered: string;
  startingPipeline: number | null;
  newSourced: number | null;
  screened: number | null;
  interviewed: number | null;
  offers: number | null;
  accepted: number | null;
  hired: number | null;
  dropOffs: number | null;
  targetHires: number | null;
  keyIssueLastWeek: string;
  hasHistoricalData: boolean;
}

export interface CurrentStatusRecord {
  id: string;
  role: string;
  account: string;
  cluster: string;
  taOwner: string;
  openDate: string;
  dueDate: string;
  requiredHiring: number;
  qualifiedPipeline: number;
  screened: number;
  interviewed: number;
  offers: number;
  accepted: number;
  atRisk: boolean;
  reason?: string;
  latestStatusNotes: string;

  weeklyPlanItemId?: string;
  hiringNeedId?: string;
  sourceModule?: string;
  sourceRecordId?: string;
  roleAccountKey?: string;
  reportingWeek?: string;
  suggestedRisk?: "High" | "Medium" | "Low";
  suggestedGap?: string;
}

const INITIAL_WEEKLY_PERFORMANCE: WeeklyPerformanceRecord[] = [
  {
    id: "WP-001",
    role: "Healthcare Support Specialist",
    account: "Elevance Health",
    cluster: "Healthcare & Ins.",
    weekCovered: "Week 32 (Aug 3 - Aug 9, 2026)",
    startingPipeline: 28,
    newSourced: 25,
    screened: 18,
    interviewed: 12,
    offers: 8,
    accepted: 6,
    hired: 4,
    dropOffs: 2,
    targetHires: 10,
    keyIssueLastWeek: "High drop-off during medical clearance assessment stage",
    hasHistoricalData: true
  },
  {
    id: "WP-002",
    role: "Customer Service Representative",
    account: "Chevron Support",
    cluster: "Telecom & Tech",
    weekCovered: "Week 32 (Aug 3 - Aug 9, 2026)",
    startingPipeline: 45,
    newSourced: 40,
    screened: 30,
    interviewed: 22,
    offers: 18,
    accepted: 15,
    hired: 12,
    dropOffs: 3,
    targetHires: 16,
    keyIssueLastWeek: "Technical assessment turnaround delays (avg 5.2 days)",
    hasHistoricalData: true
  },
  {
    id: "WP-003",
    role: "Team Leader - BPO Operations",
    account: "Citi Global",
    cluster: "Financial Services",
    weekCovered: "Week 32 (Aug 3 - Aug 9, 2026)",
    startingPipeline: 12,
    newSourced: 15,
    screened: 10,
    interviewed: 6,
    offers: 4,
    accepted: 3,
    hired: 2,
    dropOffs: 1,
    targetHires: 5,
    keyIssueLastWeek: "Medical allowance disparity vs competitors causing offer rejections",
    hasHistoricalData: true
  },
  {
    id: "WP-004",
    role: "Technical Support Associate",
    account: "Comcast Technical",
    cluster: "Telecom & Tech",
    weekCovered: "Week 32 (Aug 3 - Aug 9, 2026)",
    startingPipeline: 50,
    newSourced: 42,
    screened: 32,
    interviewed: 24,
    offers: 18,
    accepted: 14,
    hired: 10,
    dropOffs: 6,
    targetHires: 18,
    keyIssueLastWeek: "15% pre-start withdrawal spike between JO and NHO",
    hasHistoricalData: true
  },
  {
    id: "WP-005",
    role: "Financial Specialist",
    account: "Chase Credit",
    cluster: "Financial Services",
    weekCovered: "Week 32 (Aug 3 - Aug 9, 2026)",
    startingPipeline: 30,
    newSourced: 22,
    screened: 16,
    interviewed: 12,
    offers: 9,
    accepted: 7,
    hired: 5,
    dropOffs: 2,
    targetHires: 12,
    keyIssueLastWeek: "Background check clearance backlog at external verification vendor",
    hasHistoricalData: true
  },
  {
    id: "WP-006",
    role: "Customer Service Representative",
    account: "T-Mobile Care",
    cluster: "Telecom & Tech",
    weekCovered: "Week 32 (Aug 3 - Aug 9, 2026)",
    startingPipeline: 65,
    newSourced: 50,
    screened: 40,
    interviewed: 32,
    offers: 28,
    accepted: 25,
    hired: 22,
    dropOffs: 3,
    targetHires: 25,
    keyIssueLastWeek: "Client approval pending for night shift training schedule",
    hasHistoricalData: true
  },
  {
    id: "WP-007",
    role: "Account Specialist",
    account: "Coast Dental",
    cluster: "Coast Dental",
    weekCovered: "Week 32 (Aug 3 - Aug 9, 2026)",
    startingPipeline: 18,
    newSourced: 14,
    screened: 10,
    interviewed: 8,
    offers: 6,
    accepted: 5,
    hired: 4,
    dropOffs: 1,
    targetHires: 8,
    keyIssueLastWeek: "Sourcing yield low for bilingual dental billers",
    hasHistoricalData: true
  },
  {
    id: "WP-008",
    role: "Back Office Associate",
    account: "Corporate Admin",
    cluster: "Corporate",
    weekCovered: "Week 32 (Aug 3 - Aug 9, 2026)",
    startingPipeline: null,
    newSourced: null,
    screened: null,
    interviewed: null,
    offers: null,
    accepted: null,
    hired: null,
    dropOffs: null,
    targetHires: 4,
    keyIssueLastWeek: "Role unstaffed in current sprint; historical tracking pending",
    hasHistoricalData: false
  }
];

const INITIAL_CURRENT_STATUS: CurrentStatusRecord[] = [
  {
    id: "CS-001",
    role: "Healthcare Support Specialist",
    account: "Elevance Health",
    cluster: "Healthcare & Ins.",
    taOwner: "Alena Batacan",
    openDate: "2026-06-01",
    dueDate: "2026-08-15",
    requiredHiring: 12,
    qualifiedPipeline: 18,
    screened: 18,
    interviewed: 12,
    offers: 8,
    accepted: 6,
    atRisk: true,
    reason: "Delayed medical clearance & low sourcing volume",
    latestStatusNotes: "6 candidates accepted, 3 pending lab clearances from Elevance clinic."
  },
  {
    id: "CS-002",
    role: "Customer Service Representative",
    account: "Chevron Support",
    cluster: "Telecom & Tech",
    taOwner: "Juan dela Cruz",
    openDate: "2026-06-10",
    dueDate: "2026-08-20",
    requiredHiring: 16,
    qualifiedPipeline: 22,
    screened: 30,
    interviewed: 22,
    offers: 18,
    accepted: 15,
    atRisk: true,
    reason: "Interview feedback delayed",
    latestStatusNotes: "Aging candidate files (>4 days) sitting in Technical Assessment phase."
  },
  {
    id: "CS-003",
    role: "Team Leader - BPO Operations",
    account: "Citi Global",
    cluster: "Financial Services",
    taOwner: "Maria Santos",
    openDate: "2026-06-15",
    dueDate: "2026-08-10",
    requiredHiring: 5,
    qualifiedPipeline: 8,
    screened: 10,
    interviewed: 6,
    offers: 4,
    accepted: 3,
    atRisk: true,
    reason: "Offer acceptance below requirement",
    latestStatusNotes: "Medical allowance cap re-negotiation underway with finance."
  },
  {
    id: "CS-004",
    role: "Technical Support Associate",
    account: "Comcast Technical",
    cluster: "Telecom & Tech",
    taOwner: "Alena Batacan",
    openDate: "2026-05-20",
    dueDate: "2026-08-01",
    requiredHiring: 18,
    qualifiedPipeline: 25,
    screened: 32,
    interviewed: 24,
    offers: 18,
    accepted: 14,
    atRisk: true,
    reason: "Replacement required due to attrition",
    latestStatusNotes: "Overdue requirement with 15% pre-start withdrawal spike."
  },
  {
    id: "CS-005",
    role: "Financial Specialist",
    account: "Chase Credit",
    cluster: "Financial Services",
    taOwner: "David Lee",
    openDate: "2026-06-05",
    dueDate: "2026-08-12",
    requiredHiring: 12,
    qualifiedPipeline: 12,
    screened: 16,
    interviewed: 12,
    offers: 9,
    accepted: 7,
    atRisk: true,
    reason: "Insufficient qualified pipeline",
    latestStatusNotes: "Only 7 accepted against 12 required. No active action item assigned!"
  },
  {
    id: "CS-006",
    role: "Healthcare Support Specialist",
    account: "Aetna Core",
    cluster: "Healthcare & Ins.",
    taOwner: "Sarah Tan",
    openDate: "2026-06-12",
    dueDate: "2026-08-18",
    requiredHiring: 15,
    qualifiedPipeline: 10,
    screened: 14,
    interviewed: 8,
    offers: 6,
    accepted: 6,
    atRisk: true,
    reason: "PST or onboarding failure risk",
    latestStatusNotes: "Sourcing volume shortfall. 6 accepted vs 15 required. Needs urgent action!"
  },
  {
    id: "CS-007",
    role: "Customer Service Representative",
    account: "T-Mobile Care",
    cluster: "Telecom & Tech",
    taOwner: "Juan dela Cruz",
    openDate: "2026-05-15",
    dueDate: "2026-08-25",
    requiredHiring: 20,
    qualifiedPipeline: 35,
    screened: 40,
    interviewed: 32,
    offers: 28,
    accepted: 25,
    atRisk: false,
    reason: undefined,
    latestStatusNotes: "25 accepted against 20 required (125% fill rate). High health pipeline."
  },
  {
    id: "CS-008",
    role: "Account Specialist",
    account: "Coast Dental",
    cluster: "Coast Dental",
    taOwner: "Alena Batacan",
    openDate: "2026-06-20",
    dueDate: "2026-08-30",
    requiredHiring: 8,
    qualifiedPipeline: 12,
    screened: 10,
    interviewed: 8,
    offers: 6,
    accepted: 5,
    atRisk: false,
    reason: undefined,
    latestStatusNotes: "On track to reach 8 hires before go-live date."
  }
];

const INITIAL_ACTION_ITEMS: ActionItem[] = [
  {
    id: "ACT-001",
    sourceType: "System",
    description: "Launch urgent social media boosting for Elevance Health candidates",
    module: "Sourcing",
    role: "Healthcare Support Specialist",
    account: "Elevance Health",
    cluster: "Healthcare & Ins.",
    owner: "Alena Batacan",
    deadline: "2026-07-23",
    status: "Ongoing",
    risk: "High",
    gap: "Low Sourcing Volume",
    requirement: 12,
    filled: 6,
    remainingGap: 6,
    createdDate: "2026-07-19",
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
    description: "Audit aging candidate files in Stage 2 (Technical Assessment) for Chevron Support",
    module: "Pipeline",
    role: "Customer Service Representative",
    account: "Chevron Support",
    cluster: "Telecom & Tech",
    owner: "Juan dela Cruz",
    deadline: "2026-07-22",
    status: "Planned",
    risk: "Medium",
    gap: "Aging PRF",
    requirement: 16,
    filled: 15,
    remainingGap: 1,
    createdDate: "2026-07-18",
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
    cluster: "Financial Services",
    owner: "Maria Santos",
    deadline: "2026-07-21",
    status: "Ongoing",
    risk: "High",
    gap: "Contract Issue",
    requirement: 5,
    filled: 3,
    remainingGap: 2,
    createdDate: "2026-07-15",
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
    cluster: "Healthcare & Ins.",
    owner: "Alena Batacan",
    deadline: "2026-07-25",
    status: "Planned",
    risk: "Medium",
    gap: "Delayed Medical Clearance",
    requirement: 12,
    filled: 6,
    remainingGap: 6,
    createdDate: "2026-07-20",
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
    cluster: "Telecom & Tech",
    owner: "Juan dela Cruz",
    deadline: "2026-07-28",
    status: "Completed",
    risk: "Low",
    gap: "None",
    requirement: 10,
    filled: 10,
    remainingGap: 0,
    createdDate: "2026-07-18",
    completedDate: "2026-07-19",
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
    cluster: "Telecom & Tech",
    owner: "Alena Batacan",
    deadline: "2026-07-18",
    status: "Ongoing",
    risk: "High",
    gap: "High Drop-off Rate",
    requirement: 18,
    filled: 14,
    remainingGap: 4,
    createdDate: "2026-07-14",
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
  // Data States
  const [weeklyRecords, setWeeklyRecords] = useState<WeeklyPerformanceRecord[]>(INITIAL_WEEKLY_PERFORMANCE);
  const [currentStatusRecords] = useState<CurrentStatusRecord[]>(INITIAL_CURRENT_STATUS);
  const [items, setItems] = useState<ActionItem[]>(INITIAL_ACTION_ITEMS);
  const [signals] = useState<ModuleSignal[]>(INITIAL_MODULE_SIGNALS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Add Weekly Performance Modal State
  const [isAddWeeklyModalOpen, setIsAddWeeklyModalOpen] = useState(false);
  const [newWeeklyForm, setNewWeeklyForm] = useState({
    role: "Healthcare Support Specialist",
    account: "Elevance Health",
    cluster: "Healthcare & Ins.",
    weekCovered: "Week 33 (Aug 10 - Aug 16, 2026)",
    startingPipeline: 30,
    newSourced: 20,
    screened: 15,
    interviewed: 10,
    offers: 6,
    accepted: 5,
    hired: 4,
    dropOffs: 2,
    targetHires: 8,
    keyIssueLastWeek: "",
  });

  const handleAddWeeklyRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWeeklyForm.role.trim() || !newWeeklyForm.account.trim()) {
      triggerToast("Please provide both Role Title and Account Name!");
      return;
    }

    const newRecord: WeeklyPerformanceRecord = {
      id: `WP-00${weeklyRecords.length + 1}`,
      role: newWeeklyForm.role.trim(),
      account: newWeeklyForm.account.trim(),
      cluster: newWeeklyForm.cluster.trim() || "General",
      weekCovered: newWeeklyForm.weekCovered,
      startingPipeline: Number(newWeeklyForm.startingPipeline) || 0,
      newSourced: Number(newWeeklyForm.newSourced) || 0,
      screened: Number(newWeeklyForm.screened) || 0,
      interviewed: Number(newWeeklyForm.interviewed) || 0,
      offers: Number(newWeeklyForm.offers) || 0,
      accepted: Number(newWeeklyForm.accepted) || 0,
      hired: Number(newWeeklyForm.hired) || 0,
      dropOffs: Number(newWeeklyForm.dropOffs) || 0,
      targetHires: Number(newWeeklyForm.targetHires) || 0,
      keyIssueLastWeek: newWeeklyForm.keyIssueLastWeek.trim() || "None reported",
      hasHistoricalData: true
    };

    setWeeklyRecords([newRecord, ...weeklyRecords]);
    setIsAddWeeklyModalOpen(false);
    triggerToast(`Added weekly performance record for [${newRecord.account}] ${newRecord.role}!`);
  };

  // Scope Filters State (Controls Section A, B, and C)
  const [scopeWeek, setScopeWeek] = useState("Week 33 (Aug 10 - Aug 16, 2026)");
  const [scopePrevWeek] = useState("Week 32 (Aug 3 - Aug 9, 2026)");
  const [scopeCluster, setScopeCluster] = useState("All");
  const [scopeAccount, setScopeAccount] = useState("All");
  const [scopeRole, setScopeRole] = useState("All");
  const [scopeOwner, setScopeOwner] = useState("All");
  const [scopeAtRiskOnly, setScopeAtRiskOnly] = useState(false);

  // Selected row from Section A or Section B
  const [selectedRoleAccount, setSelectedRoleAccount] = useState<{ role: string; account: string } | null>(null);

  // Search & Filtering State inside Section C
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [riskFilter, setRiskFilter] = useState("All");
  const [moduleFilter, setModuleFilter] = useState("All");
  const [gapFilter, setGapFilter] = useState("All");
  const [ownerFilter, setOwnerFilter] = useState("All");

  // Selected Action Item Details Modal State
  const [selectedItem, setSelectedItem] = useState<ActionItem | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Email Report Modal State
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailTo, setEmailTo] = useState("recruitment-reports@sibs.com, hr-executives@sibs.com");
  const [emailCc, setEmailCc] = useState("dulla13ralph@gmail.com");
  const [emailSubject, setEmailSubject] = useState(`[TA-HRIS Report] Weekly Recruitment Execution & Action Items (W29)`);
  const [emailNote, setEmailNote] = useState("Hi Team, please find attached the weekly recruitment execution report including Section A (Weekly Performance Snapshot), Section B (Current Account Hiring Status), and Section C (Action Items & JIT Blockers) for management review.");
  const [emailTab, setEmailTab] = useState<"formatted" | "plain">("formatted");
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);

  // New Action Item Form State (Create Modal)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isOpenedFromCurrentStatus, setIsOpenedFromCurrentStatus] = useState(false);
  const [initialPrefilledForm, setInitialPrefilledForm] = useState<ActionFormState | null>(null);
  const [showDuplicateConfirm, setShowDuplicateConfirm] = useState(false);

  const [formState, setFormState] = useState<ActionFormState>({
    weeklyPlanItemId: "",
    hiringNeedId: "",
    sourceModule: "Workforce Hiring Plan",
    sourceRecordId: "",
    currentStatusRowId: "",
    roleAccountKey: "",
    cluster: "General",
    reportingWeek: "W29 (Jul 14 - Jul 20)",

    roleAccount: "",
    roleTitle: "",
    account: "",
    requirement: 0,
    filled: 0,

    actionItem: "",
    owner: "Alena Batacan",
    deadline: "2026-07-25",
    status: "Planned",
    riskLevel: "Medium",
    linkedGap: "Pipeline",
    remarks: "",

    atRiskReason: "",
    latestStatusNote: "",
  });

  const CURRENT_DATE_STR = "2026-07-20";
  const currentDate = new Date(CURRENT_DATE_STR);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleResetFilters = () => {
    setScopeCluster("All");
    setScopeAccount("All");
    setScopeRole("All");
    setScopeOwner("All");
    setScopeAtRiskOnly(false);
    setSelectedRoleAccount(null);
    setSearchTerm("");
    setStatusFilter("All");
    setRiskFilter("All");
    setModuleFilter("All");
    setGapFilter("All");
    setOwnerFilter("All");
    triggerToast("Reporting scope and filters cleared.");
  };

  // Unique Dropdown Option Lists
  const clustersList = useMemo(() => {
    const set = new Set<string>();
    currentStatusRecords.forEach(r => set.add(r.cluster));
    return ["All", ...Array.from(set)];
  }, [currentStatusRecords]);

  const accountsList = useMemo(() => {
    const set = new Set<string>();
    currentStatusRecords.forEach(r => set.add(r.account));
    return ["All", ...Array.from(set)];
  }, [currentStatusRecords]);

  const rolesList = useMemo(() => {
    const set = new Set<string>();
    currentStatusRecords.forEach(r => set.add(r.role));
    return ["All", ...Array.from(set)];
  }, [currentStatusRecords]);

  const ownersList = useMemo(() => {
    const set = new Set<string>();
    currentStatusRecords.forEach(r => set.add(r.taOwner));
    items.forEach(it => set.add(it.owner));
    return ["All", ...Array.from(set)];
  }, [currentStatusRecords, items]);

  const gapsList = useMemo(() => {
    const set = new Set<string>();
    items.forEach(it => {
      if (it.gap && it.gap !== "None") set.add(it.gap);
    });
    return ["All", ...Array.from(set)];
  }, [items]);

  // Check if an open action exists for a given role/account
  const hasActiveActionForItem = (role: string, account: string) => {
    return items.some(
      it =>
        it.role.toLowerCase() === role.toLowerCase() &&
        it.account.toLowerCase() === account.toLowerCase() &&
        it.status !== "Completed" &&
        it.status !== "Cancelled"
    );
  };

  // Metric Cards Calculations (Prioritizing Execution Metrics)
  const metrics = useMemo(() => {
    // Distinct accounts at risk
    const atRiskAccountsSet = new Set<string>();
    currentStatusRecords.forEach(r => {
      if (r.atRisk) atRiskAccountsSet.add(r.account);
    });
    items.forEach(it => {
      if (it.risk === "High" && it.status !== "Completed" && it.status !== "Cancelled") {
        atRiskAccountsSet.add(it.account);
      }
    });

    // Accounts missing an active action
    const missingActionAccountsSet = new Set<string>();
    currentStatusRecords.forEach(r => {
      if (r.atRisk && !hasActiveActionForItem(r.role, r.account)) {
        missingActionAccountsSet.add(r.account);
      }
    });

    const planned = items.filter(it => it.status === "Planned").length;
    const ongoing = items.filter(it => it.status === "Ongoing").length;
    const completed = items.filter(it => it.status === "Completed").length;

    const overdue = items.filter(it => {
      if (it.status === "Completed" || it.status === "Cancelled") return false;
      return new Date(it.deadline) < currentDate;
    }).length;

    const systemSuggested = items.filter(it => it.sourceType === "System").length + signals.length;

    return {
      atRiskAccounts: atRiskAccountsSet.size,
      missingActionAccounts: missingActionAccountsSet.size,
      planned,
      ongoing,
      overdue,
      completed,
      systemSuggested
    };
  }, [currentStatusRecords, items, signals]);

  // Section A: Filtered Weekly Performance Records
  const filteredWeeklyRecords = useMemo(() => {
    return weeklyRecords.filter(r => {
      const matchCluster = scopeCluster === "All" || r.cluster === scopeCluster;
      const matchAccount = scopeAccount === "All" || r.account === scopeAccount;
      const matchRole = scopeRole === "All" || r.role === scopeRole;
      const matchSelected = !selectedRoleAccount || (r.role === selectedRoleAccount.role && r.account === selectedRoleAccount.account);
      return matchCluster && matchAccount && matchRole && matchSelected;
    });
  }, [weeklyRecords, scopeCluster, scopeAccount, scopeRole, selectedRoleAccount]);

  // Section B: Filtered Current Status Records
  const filteredCurrentStatusRecords = useMemo(() => {
    return currentStatusRecords.filter(r => {
      const matchCluster = scopeCluster === "All" || r.cluster === scopeCluster;
      const matchAccount = scopeAccount === "All" || r.account === scopeAccount;
      const matchRole = scopeRole === "All" || r.role === scopeRole;
      const matchOwner = scopeOwner === "All" || r.taOwner === scopeOwner;
      const matchAtRisk = !scopeAtRiskOnly || r.atRisk;
      const matchSelected = !selectedRoleAccount || (r.role === selectedRoleAccount.role && r.account === selectedRoleAccount.account);
      return matchCluster && matchAccount && matchRole && matchOwner && matchAtRisk && matchSelected;
    });
  }, [currentStatusRecords, scopeCluster, scopeAccount, scopeRole, scopeOwner, scopeAtRiskOnly, selectedRoleAccount]);

  // Section C: Filtered Action Items
  const filteredActionItems = useMemo(() => {
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
      const matchOwner = ownerFilter === "All" || scopeOwner === "All" ? (ownerFilter === "All" ? true : it.owner === ownerFilter) : it.owner === scopeOwner;
      const matchCluster = scopeCluster === "All" || (it.cluster && it.cluster === scopeCluster);
      const matchAccount = scopeAccount === "All" || it.account === scopeAccount;
      const matchRole = scopeRole === "All" || it.role === scopeRole;
      const matchAtRisk = !scopeAtRiskOnly || it.risk === "High";
      const matchSelected = !selectedRoleAccount || (it.role === selectedRoleAccount.role && it.account === selectedRoleAccount.account);

      return matchSearch && matchStatus && matchRisk && matchModule && matchGap && matchOwner && matchCluster && matchAccount && matchRole && matchAtRisk && matchSelected;
    });
  }, [
    items,
    searchTerm,
    statusFilter,
    riskFilter,
    moduleFilter,
    gapFilter,
    ownerFilter,
    scopeCluster,
    scopeAccount,
    scopeRole,
    scopeOwner,
    scopeAtRiskOnly,
    selectedRoleAccount
  ]);

  // Days left helper
  const getDaysLeftText = (deadlineStr: string) => {
    const dDate = new Date(deadlineStr);
    const diffTime = dDate.getTime() - currentDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: `${Math.abs(diffDays)}d overdue`, colorClass: "text-rose-600 font-bold" };
    } else if (diffDays === 0) {
      return { text: "Due today", colorClass: "text-amber-600 font-bold" };
    } else {
      return { text: `${diffDays}d left`, colorClass: "text-emerald-600 font-semibold" };
    }
  };

  // Calculate Days Open for Current Status
  const getDaysOpen = (openDateStr: string) => {
    const oDate = new Date(openDateStr);
    const diffTime = currentDate.getTime() - oDate.getTime();
    return Math.max(1, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
  };

  // Dynamic Filled/Accepted Label based on source module
  const dynamicFilledLabel = useMemo(() => {
    if (formState.sourceModule?.includes("Onboarding")) return "Confirmed Hired";
    if (formState.sourceModule?.includes("Current Status")) return "Accepted";
    if (formState.sourceModule?.includes("Needs")) return "Current Filled";
    return "Current Filled / Accepted";
  }, [formState.sourceModule]);

  // Live count of open (Planned or Ongoing) actions for the selected role/account
  const openActionsForCurrentRoleCount = useMemo(() => {
    return items.filter(
      it =>
        it.role === formState.roleTitle &&
        it.account === formState.account &&
        (it.status === "Planned" || it.status === "Ongoing")
    ).length;
  }, [items, formState.roleTitle, formState.account]);

  // Current Fill Rate calculation
  const currentFillRate = useMemo(() => {
    if (formState.requirement <= 0) return 0;
    return Math.round((formState.filled / formState.requirement) * 100);
  }, [formState.requirement, formState.filled]);

  // Trigger Add Action Modal pre-populated from Current Status row
  const handleOpenAddActionForRecord = (record: CurrentStatusRecord) => {
    setIsOpenedFromCurrentStatus(true);
    setShowDuplicateConfirm(false);

    let suggestedGap = "SLA At Risk";
    if (record.reason?.includes("sourcing")) suggestedGap = "Low Sourcing Volume";
    else if (record.reason?.includes("medical")) suggestedGap = "Delayed Medical Clearance";
    else if (record.reason?.includes("feedback")) suggestedGap = "Aging PRF";
    else if (record.reason?.includes("attrition")) suggestedGap = "High Drop-off Rate";
    else if (record.reason?.includes("offer")) suggestedGap = "Contract Issue";

    const initial: ActionFormState = {
      weeklyPlanItemId: record.weeklyPlanItemId || "",
      hiringNeedId: record.hiringNeedId || "",
      sourceModule: record.sourceModule || "Workforce Hiring Plan",
      sourceRecordId: record.sourceRecordId || "",
      currentStatusRowId: record.id,
      roleAccountKey: record.roleAccountKey,
      cluster: record.cluster || "General",
      reportingWeek: record.reportingWeek || "W29 (Jul 14 - Jul 20)",

      roleAccount: `${record.role} - ${record.account}`,
      roleTitle: record.role,
      account: record.account,
      requirement: record.requiredHiring,
      filled: record.accepted,

      actionItem: `Address ${record.reason || "hiring gap"} for ${record.account} ${record.role}`,
      owner: record.taOwner || "Alena Batacan",
      deadline: "2026-07-25",
      status: "Planned",
      riskLevel: record.suggestedRisk || "High",
      linkedGap: record.suggestedGap || suggestedGap,
      remarks: record.latestStatusNotes || "",

      atRiskReason: record.reason || "",
      latestStatusNote: record.latestStatusNotes || "",
    };

    setFormState(initial);
    setInitialPrefilledForm(initial);
    setIsCreateModalOpen(true);
  };

  // Open Add Action Modal from Global Header Button
  const handleOpenGlobalAddAction = () => {
    setIsOpenedFromCurrentStatus(false);
    setShowDuplicateConfirm(false);

    const firstRec = currentStatusRecords[0];
    const initial: ActionFormState = {
      weeklyPlanItemId: firstRec?.weeklyPlanItemId || "",
      hiringNeedId: firstRec?.hiringNeedId || "",
      sourceModule: firstRec?.sourceModule || "Workforce Hiring Plan",
      sourceRecordId: firstRec?.sourceRecordId || "",
      currentStatusRowId: firstRec?.id || "",
      roleAccountKey: firstRec?.roleAccountKey || "",
      cluster: firstRec?.cluster || "General",
      reportingWeek: firstRec?.reportingWeek || "W29 (Jul 14 - Jul 20)",

      roleAccount: firstRec ? `${firstRec.role} - ${firstRec.account}` : "Customer Service Representative - Elevance Health",
      roleTitle: firstRec?.role || "Customer Service Representative",
      account: firstRec?.account || "Elevance Health",
      requirement: firstRec?.requiredHiring || 10,
      filled: firstRec?.accepted || 5,

      actionItem: "",
      owner: firstRec?.taOwner || "Alena Batacan",
      deadline: "2026-07-25",
      status: "Planned",
      riskLevel: "Medium",
      linkedGap: "Pipeline",
      remarks: "",

      atRiskReason: firstRec?.reason || "",
      latestStatusNote: firstRec?.latestStatusNotes || "",
    };

    setFormState(initial);
    setInitialPrefilledForm(null);
    setIsCreateModalOpen(true);
  };

  // Reset Create Modal Form depending on open context
  const handleResetCreateForm = () => {
    setShowDuplicateConfirm(false);
    if (isOpenedFromCurrentStatus && initialPrefilledForm) {
      setFormState({
        ...initialPrefilledForm,
        actionItem: `Address ${initialPrefilledForm.atRiskReason || "hiring gap"} for ${initialPrefilledForm.account} ${initialPrefilledForm.roleTitle}`,
        deadline: "2026-07-25",
        status: "Planned",
        riskLevel: initialPrefilledForm.riskLevel,
        linkedGap: initialPrefilledForm.linkedGap,
        remarks: initialPrefilledForm.latestStatusNote || "",
      });
    } else {
      const firstRec = currentStatusRecords[0];
      setFormState({
        weeklyPlanItemId: firstRec?.weeklyPlanItemId || "",
        hiringNeedId: firstRec?.hiringNeedId || "",
        sourceModule: firstRec?.sourceModule || "Workforce Hiring Plan",
        sourceRecordId: firstRec?.sourceRecordId || "",
        currentStatusRowId: firstRec?.id || "",
        roleAccountKey: firstRec?.roleAccountKey || "",
        cluster: firstRec?.cluster || "General",
        reportingWeek: firstRec?.reportingWeek || "W29 (Jul 14 - Jul 20)",

        roleAccount: firstRec ? `${firstRec.role} - ${firstRec.account}` : "",
        roleTitle: firstRec?.role || "Customer Service Representative",
        account: firstRec?.account || "Elevance Health",
        requirement: firstRec?.requiredHiring || 10,
        filled: firstRec?.accepted || 5,

        actionItem: "",
        owner: firstRec?.taOwner || "Alena Batacan",
        deadline: "2026-07-25",
        status: "Planned",
        riskLevel: "Medium",
        linkedGap: "Pipeline",
        remarks: "",

        atRiskReason: firstRec?.reason || "",
        latestStatusNote: firstRec?.latestStatusNotes || "",
      });
    }
  };

  // Create Manual Action Item
  const handleCreateActionItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.actionItem.trim()) {
      triggerToast("Please provide an action item description!");
      return;
    }
    if (!formState.owner.trim()) {
      triggerToast("Please select an accountable owner!");
      return;
    }
    if (!formState.deadline) {
      triggerToast("Please specify a target deadline date!");
      return;
    }

    // Check for duplicate active action item
    const existingDuplicate = items.find(
      it =>
        it.role === formState.roleTitle &&
        it.account === formState.account &&
        it.gap === formState.linkedGap &&
        (it.status === "Planned" || it.status === "Ongoing")
    );

    if (existingDuplicate && !showDuplicateConfirm) {
      setShowDuplicateConfirm(true);
      return;
    }

    const newId = `ACT-0${items.length + 1}`;
    const remGap = Math.max(0, formState.requirement - formState.filled);

    // Determine module category based on linked gap
    let moduleCat: ActionItem["module"] = "General";
    if (["Pipeline", "Screening", "Interview"].includes(formState.linkedGap)) moduleCat = "Pipeline";
    else if (["Offer", "Contract Issue"].includes(formState.linkedGap)) moduleCat = "Offers";
    else if (["Onboarding", "Delayed Medical Clearance"].includes(formState.linkedGap)) moduleCat = "Onboarding";
    else if (["Low Sourcing Volume"].includes(formState.linkedGap)) moduleCat = "Sourcing";

    const newItem: ActionItem = {
      id: newId,
      sourceType: "Manual",
      description: formState.actionItem.trim(),
      module: moduleCat,
      role: formState.roleTitle,
      account: formState.account,
      cluster: formState.cluster || "General",
      owner: formState.owner,
      deadline: formState.deadline,
      status: formState.status,
      risk: formState.riskLevel,
      gap: formState.linkedGap as ActionItem["gap"],
      requirement: formState.requirement,
      filled: formState.filled,
      remainingGap: remGap,
      createdDate: CURRENT_DATE_STR,
      longDescription: formState.atRiskReason
        ? `Manual action item created to address: ${formState.atRiskReason}. Current status note: ${formState.latestStatusNote || 'None'}`
        : "Manual recruitment action item.",
      notes: formState.remarks.trim() || undefined,
      history: [
        { date: CURRENT_DATE_STR, action: `Manual action item created (${formState.status}).`, user: userEmail.split("@")[0] }
      ],

      // Source Linkage Metadata
      weeklyPlanItemId: formState.weeklyPlanItemId,
      hiringNeedId: formState.hiringNeedId,
      sourceModule: formState.sourceModule,
      sourceRecordId: formState.sourceRecordId,
      currentStatusRowId: formState.currentStatusRowId,
      roleAccountKey: formState.roleAccountKey,
      reportingWeek: formState.reportingWeek,
      atRiskReason: formState.atRiskReason,
      latestStatusNote: formState.latestStatusNote,
    };

    setItems([newItem, ...items]);
    setIsCreateModalOpen(false);
    setShowDuplicateConfirm(false);

    triggerToast(`Action Item ${newId} saved! Current Status coverage updated to Covered.`);
  };

  // Plain Text Report Generator for Email / Gmail
  const generatePlainTextReport = () => {
    const totalReq = filteredCurrentStatusRecords.reduce((s, r) => s + r.requiredHiring, 0);
    const totalAccepted = filteredCurrentStatusRecords.reduce((s, r) => s + r.accepted, 0);
    const fillRate = totalReq > 0 ? Math.round((totalAccepted / totalReq) * 100) : 0;
    const openActionsCount = filteredActionItems.filter(i => i.status !== "Completed" && i.status !== "Cancelled").length;

    let text = `RECRUITMENT SLA & EXECUTION REPORT\n`;
    text += `Reporting Week: ${scopeWeek}\n`;
    text += `Scope: Cluster [${scopeCluster}] | Account [${scopeAccount}] | Role [${scopeRole}]\n`;
    text += `Generated Date: ${CURRENT_DATE_STR}\n\n`;

    if (emailNote) {
      text += `NOTE FROM SENDER:\n${emailNote}\n\n`;
    }

    text += `==========================================\n`;
    text += `EXECUTIVE SUMMARY\n`;
    text += `==========================================\n`;
    text += `• Total Roles / Accounts Monitored: ${filteredCurrentStatusRecords.length}\n`;
    text += `• Required Hires Target: ${totalReq}\n`;
    text += `• Hires Accepted / Confirmed: ${totalAccepted} (${fillRate}% Fill Rate)\n`;
    text += `• Active Open Action Items: ${openActionsCount}\n\n`;

    text += `==========================================\n`;
    text += `SECTION A: WEEKLY PERFORMANCE SNAPSHOT\n`;
    text += `==========================================\n`;
    filteredWeeklyRecords.forEach((r, idx) => {
      text += `${idx + 1}. [${r.account}] ${r.role} (${r.cluster})\n`;
      text += `   Pipeline Start: ${r.startingPipeline} | New Sourced: ${r.newSourced} | Screened: ${r.screened} | Interviewed: ${r.interviewed}\n`;
      text += `   Offers Extended: ${r.offersExtended} | Accepted: ${r.offersAccepted} | Hired: ${r.hired} | Drop-offs: ${r.dropOffs}\n`;
      text += `   Target Hires: ${r.targetHires} | Key Issues: ${r.keyIssues || "None"}\n\n`;
    });

    text += `==========================================\n`;
    text += `SECTION B: CURRENT ACCOUNT HIRING STATUS\n`;
    text += `==========================================\n`;
    filteredCurrentStatusRecords.forEach((r, idx) => {
      const rate = r.requiredHiring > 0 ? Math.round((r.accepted / r.requiredHiring) * 100) : 0;
      text += `${idx + 1}. [${r.account}] ${r.role}\n`;
      text += `   Owner: ${r.taOwner} | Required: ${r.requiredHiring} | Accepted: ${r.accepted} (${rate}% Fill Rate)\n`;
      text += `   Status: ${r.atRisk ? "AT RISK (" + (r.reason || "Hiring Gap") + ")" : "ON TRACK"}\n`;
      text += `   Latest Status Notes: ${r.latestStatusNotes || "N/A"}\n\n`;
    });

    text += `==========================================\n`;
    text += `SECTION C: ACTION ITEMS — JIT DELIVERY FOCUS\n`;
    text += `==========================================\n`;
    filteredActionItems.forEach((a, idx) => {
      text += `${idx + 1}. [${a.id}] ${a.description}\n`;
      text += `   Role & Account: ${a.role} (${a.account}) | Owner: ${a.owner}\n`;
      text += `   Deadline: ${a.deadline} | Risk: ${a.risk} | Status: ${a.status} | Gap: ${a.gap}\n`;
      if (a.notes) text += `   Remarks: ${a.notes}\n`;
      text += `\n`;
    });

    return text;
  };

  // Launch Gmail Compose Window
  const handleLaunchGmail = () => {
    const plainText = generatePlainTextReport();
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(emailTo)}&cc=${encodeURIComponent(emailCc)}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(plainText)}`;
    window.open(gmailUrl, "_blank");
    triggerToast("Launched Gmail compose window with report draft!");
  };

  // Printable PDF Report Generator
  const handlePrintPdfReport = () => {
    const totalReq = filteredCurrentStatusRecords.reduce((s, r) => s + r.requiredHiring, 0);
    const totalAccepted = filteredCurrentStatusRecords.reduce((s, r) => s + r.accepted, 0);
    const fillRate = totalReq > 0 ? Math.round((totalAccepted / totalReq) * 100) : 0;

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      triggerToast("Please allow popups to generate the PDF report.");
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Recruitment Report - ${scopeWeek}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 20px; color: #0f172a; font-size: 10px; line-height: 1.3; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #042C51; padding-bottom: 10px; margin-bottom: 14px; }
            .logo { font-size: 16px; font-weight: 900; color: #042C51; text-transform: uppercase; letter-spacing: -0.5px; }
            .badge { background: #FF5C28; color: white; padding: 3px 8px; border-radius: 4px; font-weight: 800; font-size: 10px; font-family: monospace; }
            .meta { margin-bottom: 14px; background: #f8fafc; padding: 10px 12px; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 10px; }
            
            .card-section { background: white; border: 1px solid #E6ECF2; border-radius: 8px; overflow: hidden; margin-bottom: 16px; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
            .card-header { background: #042C51; color: white; padding: 8px 12px; display: flex; justify-content: space-between; align-items: center; }
            .card-title { font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px; display: flex; align-items: center; gap: 6px; }
            .dot-red { width: 6px; height: 6px; background: #FF5C28; border-radius: 50%; display: inline-block; }
            .dot-amber { width: 6px; height: 6px; background: #fbbf24; border-radius: 50%; display: inline-block; }
            .dot-blue { width: 6px; height: 6px; background: #60a5fa; border-radius: 50%; display: inline-block; }
            .count-badge { background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.2); padding: 2px 6px; border-radius: 4px; font-size: 9px; font-family: monospace; font-weight: 700; color: white; }

            table { width: 100%; border-collapse: collapse; font-size: 9.5px; }
            th { background: #F8FAFC; color: #042C51; padding: 6px 6px; text-align: left; font-weight: 900; text-transform: uppercase; font-size: 8.5px; border-bottom: 1px solid #CBD5E1; border-right: 1px solid #CBD5E1; }
            th:last-child { border-right: none; }
            td { padding: 6px 6px; border-bottom: 1px solid #E6ECF2; border-right: 1px solid #E6ECF2; }
            td:last-child { border-right: none; }
            tr:nth-child(even) { background: #fafafa; }
            
            .role-title { font-weight: 900; color: #042C51; }
            .role-sub { font-size: 8.5px; color: #64748b; font-weight: 600; }
            .num-cell { font-family: monospace; text-align: center; }
            .val-sourced { color: #1d4ed8; font-weight: 700; }
            .val-hired { color: #047857; font-weight: 900; }
            .val-drop { color: #dc2626; font-weight: 700; }
            
            .pill-progress { background: #fffbeb; color: #92400e; border: 1px solid #fde68a; padding: 2px 5px; border-radius: 4px; font-weight: 900; font-family: monospace; font-size: 8.5px; display: inline-block; }
            .risk-high { background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; padding: 2px 5px; border-radius: 4px; font-weight: 800; font-size: 8.5px; }
            .risk-low { background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; padding: 2px 5px; border-radius: 4px; font-weight: 800; font-size: 8.5px; }
            
            .summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 14px; }
            .stat-card { background: #f8fafc; padding: 8px; border-radius: 6px; text-align: center; border: 1px solid #e2e8f0; }
            .stat-val { font-size: 15px; font-weight: 900; color: #042C51; font-family: monospace; }
            .stat-lbl { font-size: 8px; color: #64748b; font-weight: 700; text-transform: uppercase; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="logo">SiBS TA Executive Recruitment SLA Report</div>
              <div style="color: #042C51; font-weight: 700; margin-top:2px;">Scope: Cluster [${scopeCluster}] | Account [${scopeAccount}] | Role [${scopeRole}]</div>
            </div>
            <div>
              <span class="badge">${scopeWeek}</span>
            </div>
          </div>

          <div class="meta">
            <strong>Recipients:</strong> ${emailTo}<br/>
            <strong>CC:</strong> ${emailCc}<br/>
            <strong>Generated Date:</strong> ${CURRENT_DATE_STR}<br/>
            ${emailNote ? `<div style="margin-top:4px; color:#334155;"><strong>Note:</strong> ${emailNote}</div>` : ''}
          </div>

          <div class="summary-grid">
            <div class="stat-card"><div class="stat-lbl">Active Roles</div><div class="stat-val">${filteredCurrentStatusRecords.length}</div></div>
            <div class="stat-card"><div class="stat-lbl">Required Hires</div><div class="stat-val">${totalReq}</div></div>
            <div class="stat-card"><div class="stat-lbl">Accepted Hires</div><div class="stat-val" style="color:#047857;">${totalAccepted}</div></div>
            <div class="stat-card"><div class="stat-lbl">Fill Rate</div><div class="stat-val">${fillRate}%</div></div>
          </div>

          <!-- Section A Card -->
          <div class="card-section">
            <div class="card-header">
              <div class="card-title">
                <span class="dot-red"></span>
                A. WEEKLY PERFORMANCE (PREVIOUS SPRINT RESULTS)
              </div>
              <span class="count-badge">${filteredWeeklyRecords.length} Role / Account Rows</span>
            </div>
            <table>
              <thead>
                <tr>
                  <th>ROLE / ACCOUNT</th>
                  <th>WEEK COVERED</th>
                  <th style="text-align:center;">STARTING</th>
                  <th style="text-align:center;">SOURCED</th>
                  <th style="text-align:center;">SCREENED</th>
                  <th style="text-align:center;">INTERVIEW</th>
                  <th style="text-align:center;">OFFERS</th>
                  <th style="text-align:center;">ACCEPTED</th>
                  <th style="text-align:center;">HIRED</th>
                  <th style="text-align:center;">DROP-OFFS</th>
                  <th style="text-align:center;">ENDING</th>
                  <th style="text-align:center;">TARGET</th>
                  <th style="text-align:center;">PROGRESS VS PLAN</th>
                  <th>KEY ISSUE LAST WEEK</th>
                </tr>
              </thead>
              <tbody>
                ${filteredWeeklyRecords.map(r => `
                  <tr>
                    <td>
                      <div class="role-title">${r.account}</div>
                      <div class="role-sub">${r.role}</div>
                    </td>
                    <td style="font-family:monospace; color:#475569;">${r.weekCovered.split("(")[0]}</td>
                    <td class="num-cell">${r.startingPipeline ?? '—'}</td>
                    <td class="num-cell val-sourced">+${r.newSourced ?? 0}</td>
                    <td class="num-cell">${r.screened ?? 0}</td>
                    <td class="num-cell">${r.interviewed ?? 0}</td>
                    <td class="num-cell">${r.offersExtended ?? 0}</td>
                    <td class="num-cell" style="font-weight:700;">${r.offersAccepted ?? 0}</td>
                    <td class="num-cell val-hired">${r.hired ?? 0}</td>
                    <td class="num-cell val-drop">-${r.dropOffs ?? 0}</td>
                    <td class="num-cell" style="font-weight:900; color:#042C51;">${r.hasHistoricalData ? (r.startingPipeline + r.newSourced - r.hired - r.dropOffs) : '—'}</td>
                    <td class="num-cell">${r.targetHires ?? '—'}</td>
                    <td style="text-align:center;">
                      ${r.hasHistoricalData ? `<span class="pill-progress">Target: ${r.targetHires}, Actual: ${r.hired}</span>` : '<span style="color:#94a3b8; font-style:italic;">— No data</span>'}
                    </td>
                    <td style="color:#475569;">${r.keyIssueLastWeek || '-'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <!-- Section B Card -->
          <div class="card-section">
            <div class="card-header">
              <div class="card-title">
                <span class="dot-amber"></span>
                B. CURRENT STATUS (ACTIVE OPEN REQUIREMENTS)
              </div>
              <span class="count-badge">${filteredCurrentStatusRecords.length} Active Requisitions</span>
            </div>
            <table>
              <thead>
                <tr>
                  <th>ROLE / ACCOUNT</th>
                  <th>TA OWNER</th>
                  <th style="text-align:center;">REQUIRED HIRING</th>
                  <th style="text-align:center;">ACCEPTED</th>
                  <th style="text-align:center;">FILL RATE</th>
                  <th>STATUS / RISK</th>
                  <th>LATEST STATUS / NOTES & ACTION TRIGGER</th>
                </tr>
              </thead>
              <tbody>
                ${filteredCurrentStatusRecords.map(r => {
                  const rate = r.requiredHiring > 0 ? Math.round((r.accepted / r.requiredHiring) * 100) : 0;
                  return `
                    <tr>
                      <td>
                        <div class="role-title">${r.account}</div>
                        <div class="role-sub">${r.role}</div>
                      </td>
                      <td style="font-weight:600; color:#334155;">${r.taOwner}</td>
                      <td class="num-cell" style="font-weight:700;">${r.requiredHiring}</td>
                      <td class="num-cell val-hired">${r.accepted}</td>
                      <td class="num-cell" style="font-weight:900; color:#042C51;">${rate}%</td>
                      <td>
                        ${r.atRisk ? `<span class="risk-high">AT RISK (${r.reason || 'Gap'})</span>` : `<span class="risk-low">ON TRACK</span>`}
                      </td>
                      <td style="color:#475569;">${r.latestStatusNotes || '-'}</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>

          <!-- Section C Card -->
          <div class="card-section">
            <div class="card-header">
              <div class="card-title">
                <span class="dot-blue"></span>
                C. ACTION ITEMS — JIT DELIVERY FOCUS
              </div>
              <span class="count-badge">${filteredActionItems.length} Action Items</span>
            </div>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>ACTION ITEM DESCRIPTION</th>
                  <th>ROLE & ACCOUNT</th>
                  <th>OWNER</th>
                  <th>DEADLINE</th>
                  <th>RISK</th>
                  <th>STATUS</th>
                  <th>LINKED GAP / REMARKS</th>
                </tr>
              </thead>
              <tbody>
                ${filteredActionItems.map(a => `
                  <tr>
                    <td style="font-family:monospace; font-weight:800; color:#042C51;">${a.id}</td>
                    <td style="font-weight:700; color:#1e293b;">${a.description}</td>
                    <td>
                      <div class="role-title">${a.role}</div>
                      <div class="role-sub">${a.account}</div>
                    </td>
                    <td style="font-weight:600; color:#334155;">${a.owner}</td>
                    <td style="font-family:monospace; color:#475569;">${a.deadline}</td>
                    <td><span class="${a.risk === 'High' ? 'risk-high' : 'risk-low'}">${a.risk}</span></td>
                    <td style="font-weight:800; color:#042C51;">${a.status}</td>
                    <td style="color:#475569;">${a.gap}${a.notes ? ' — ' + a.notes : ''}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div style="margin-top: 24px; border-top: 1px solid #cbd5e1; padding-top: 8px; font-size: 8.5px; color: #94a3b8; text-align: center;">
            Confidential Talent Acquisition Management Report • Generated automatically via SiBS HRIS Control Center
          </div>

          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Simulate System Direct Email Dispatch
  const handleSimulateSendEmail = () => {
    if (!emailTo.trim()) {
      triggerToast("Please provide recipient email address!");
      return;
    }
    setIsSendingEmail(true);

    setTimeout(() => {
      setIsSendingEmail(false);
      setIsEmailModalOpen(false);
      triggerToast(`Report successfully dispatched to ${emailTo}! Logged in activity history.`);
    }, 1200);
  };

  // Copy Plain Text Report to Clipboard
  const handleCopyPlainText = () => {
    const text = generatePlainTextReport();
    navigator.clipboard.writeText(text);
    setEmailCopied(true);
    triggerToast("Report text copied to clipboard!");
    setTimeout(() => setEmailCopied(false), 2500);
  };

  // Status update
  const handleUpdateStatus = (itemId: string, newStatus: ActionItem["status"]) => {
    setItems(prev =>
      prev.map(it => {
        if (it.id === itemId) {
          const updatedHist = [...it.history];
          updatedHist.push({
            date: CURRENT_DATE_STR,
            action: `Status modified from [${it.status}] to [${newStatus}]`,
            user: userEmail.split("@")[0]
          });
          return {
            ...it,
            status: newStatus,
            completedDate: newStatus === "Completed" ? CURRENT_DATE_STR : it.completedDate,
            history: updatedHist
          };
        }
        return it;
      })
    );
    if (selectedItem && selectedItem.id === itemId) {
      setSelectedItem(prev => prev ? { ...prev, status: newStatus, completedDate: newStatus === "Completed" ? CURRENT_DATE_STR : prev.completedDate } : null);
    }
    triggerToast(`Task status updated to ${newStatus}!`);
  };

  // Notes update in Modal
  const [tempNotesInput, setTempNotesInput] = useState("");
  const handleAddModalNotes = () => {
    if (!selectedItem || !tempNotesInput.trim()) return;

    setItems(prev =>
      prev.map(it => {
        if (it.id === selectedItem.id) {
          const updatedHist = [...it.history];
          updatedHist.push({
            date: CURRENT_DATE_STR,
            action: "Added operational progress notes.",
            user: userEmail.split("@")[0]
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
    triggerToast("Progress note recorded.");
  };

  // Route to module source
  const handleViewSourceRecord = (itemModule: string) => {
    if (!onSwitchModule) return;
    let target = "overview";
    if (itemModule === "Sourcing" || itemModule === "Job Description") target = "hiring-needs";
    else if (itemModule === "Pipeline") target = "candidate-pipeline";
    else if (itemModule === "Offers") target = "offer-management";
    else if (itemModule === "Onboarding") target = "onboarding";
    else if (itemModule === "Workforce Hiring Plan") target = "overview";
    
    setIsDetailsModalOpen(false);
    onSwitchModule(target);
  };

  return (
    <div className="flex-1 flex flex-col space-y-6 select-none relative" id="action-items-module-root">
      
      {/* Toast Notification */}
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

      {/* ==================== 1. PAGE HEADER & REPORTING SCOPE ==================== */}
      <section className="bg-white p-5 rounded-2xl border border-[#E6ECF2] shadow-sm space-y-4">
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-[#E9F0FC] text-[#042C51] px-2.5 py-0.5 rounded font-black border border-blue-100 uppercase tracking-wider flex items-center gap-1">
                <Activity className="w-3 h-3 text-[#FF5C28]" />
                Execution Control Center
              </span>
              <span className="text-[10px] bg-[#FFF0EB] text-[#FF5C28] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                Recruitment SLA Auditor
              </span>
            </div>
            <h1 className="text-xl font-black text-[#042C51] tracking-tight">Recruitment Action Items & Blockers</h1>
            <p className="text-xs text-[#667085]">
              Executive workforce report: weekly performance results, current account hiring statuses, and JIT action delivery.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto">
            <button
              onClick={() => setIsEmailModalOpen(true)}
              className="px-3.5 py-2 bg-[#042C51] hover:bg-[#073966] text-white font-extrabold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs hover:shadow border border-[#042C51]"
            >
              <Mail className="w-3.5 h-3.5 text-[#FF5C28]" />
              Send Report via Email
            </button>

            <button
              onClick={() => triggerToast("Refreshed latest operational signals across modules.")}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-[#042C51] font-extrabold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer border border-slate-200"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#FF5C28]" />
              Refresh Signals
            </button>

            <button
              onClick={handleOpenGlobalAddAction}
              className="px-4 py-2 bg-[#FF5C28] hover:bg-[#E04B1D] text-white font-black text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm hover:shadow"
            >
              <Plus className="w-4 h-4" />
              Add Action Item
            </button>
          </div>
        </div>

        {/* Reporting Scope Controls Bar */}
        <div className="pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-xs">
          {/* Reporting Week */}
          <div className="space-y-0.5">
            <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Reporting Week</label>
            <select
              value={scopeWeek}
              onChange={(e) => setScopeWeek(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-bold text-[#042C51] focus:outline-none cursor-pointer"
            >
              <option value="Week 33 (Aug 10 - Aug 16, 2026)">Week 33 (Aug 10 - Aug 16)</option>
              <option value="Week 32 (Aug 3 - Aug 9, 2026)">Week 32 (Aug 3 - Aug 9)</option>
              <option value="Week 31 (Jul 27 - Aug 2, 2026)">Week 31 (Jul 27 - Aug 2)</option>
            </select>
          </div>

          {/* Previous Week */}
          <div className="space-y-0.5">
            <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Previous Week</label>
            <div className="bg-slate-100 border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-500 font-mono">
              {scopePrevWeek.split(" ")[0]} ({scopePrevWeek.split("(")[1]?.replace(")", "") || ""})
            </div>
          </div>

          {/* Cluster */}
          <div className="space-y-0.5">
            <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Cluster</label>
            <select
              value={scopeCluster}
              onChange={(e) => setScopeCluster(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              {clustersList.map(c => (
                <option key={c} value={c}>{c === "All" ? "All Clusters" : c}</option>
              ))}
            </select>
          </div>

          {/* Account */}
          <div className="space-y-0.5">
            <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Account</label>
            <select
              value={scopeAccount}
              onChange={(e) => setScopeAccount(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              {accountsList.map(a => (
                <option key={a} value={a}>{a === "All" ? "All Accounts" : a}</option>
              ))}
            </select>
          </div>

          {/* Role */}
          <div className="space-y-0.5">
            <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Role</label>
            <select
              value={scopeRole}
              onChange={(e) => setScopeRole(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              {rolesList.map(r => (
                <option key={r} value={r}>{r === "All" ? "All Roles" : r}</option>
              ))}
            </select>
          </div>

          {/* TA Owner */}
          <div className="space-y-0.5">
            <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">TA Owner</label>
            <select
              value={scopeOwner}
              onChange={(e) => setScopeOwner(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              {ownersList.map(o => (
                <option key={o} value={o}>{o === "All" ? "All TA Owners" : o}</option>
              ))}
            </select>
          </div>

          {/* At Risk Only Toggle */}
          <div className="space-y-0.5 flex flex-col justify-end">
            <button
              type="button"
              onClick={() => setScopeAtRiskOnly(!scopeAtRiskOnly)}
              className={`w-full py-1.5 px-2 rounded-lg text-[11px] font-black border transition-all cursor-pointer flex items-center justify-center gap-1 ${
                scopeAtRiskOnly 
                  ? "bg-rose-50 text-rose-700 border-rose-300 shadow-2xs" 
                  : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <AlertTriangle className={`w-3 h-3 ${scopeAtRiskOnly ? "text-rose-600" : "text-slate-400"}`} />
              {scopeAtRiskOnly ? "At Risk Only [ON]" : "At Risk Only"}
            </button>
          </div>

          {/* Clear Selection */}
          <div className="space-y-0.5 flex flex-col justify-end">
            <button
              type="button"
              onClick={handleResetFilters}
              className="w-full py-1.5 px-2 rounded-lg text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer border border-slate-200 text-center"
            >
              Clear Selection
            </button>
          </div>
        </div>
      </section>

      {/* ==================== 2. COMPACT ACTION SUMMARY (EXECUTION METRICS) ==================== */}
      <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {/* At-Risk Accounts */}
        <div className="bg-white p-3.5 rounded-xl border border-rose-200 bg-rose-50/20 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-rose-600">
            <span className="text-[9px] font-black uppercase tracking-wider text-rose-800">At-Risk Accounts</span>
            <ShieldAlert className="w-4 h-4 text-rose-600" />
          </div>
          <div className="mt-2">
            <h3 className="text-xl font-black text-rose-700 tracking-tight">{metrics.atRiskAccounts}</h3>
            <p className="text-[8px] text-rose-600 font-bold mt-0.5">Critical attention</p>
          </div>
        </div>

        {/* Accounts Missing an Action */}
        <div className="bg-white p-3.5 rounded-xl border border-orange-200 bg-orange-50/20 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-orange-600">
            <span className="text-[9px] font-black uppercase tracking-wider text-orange-900">Missing Action</span>
            <AlertCircle className="w-4 h-4 text-[#FF5C28]" />
          </div>
          <div className="mt-2">
            <h3 className="text-xl font-black text-[#FF5C28] tracking-tight">{metrics.missingActionAccounts}</h3>
            <p className="text-[8px] text-orange-700 font-bold mt-0.5">Unassigned gap</p>
          </div>
        </div>

        {/* Planned */}
        <div className="bg-white p-3.5 rounded-xl border border-blue-200 bg-blue-50/20 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-blue-600">
            <span className="text-[9px] font-black uppercase tracking-wider text-blue-900">Planned</span>
            <Layers className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2">
            <h3 className="text-xl font-black text-blue-900 tracking-tight">{metrics.planned}</h3>
            <p className="text-[8px] text-blue-600 font-bold mt-0.5">Queue stage</p>
          </div>
        </div>

        {/* Ongoing */}
        <div className="bg-white p-3.5 rounded-xl border border-amber-200 bg-amber-50/20 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-600">
            <span className="text-[9px] font-black uppercase tracking-wider text-amber-900">Ongoing</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2">
            <h3 className="text-xl font-black text-amber-900 tracking-tight">{metrics.ongoing}</h3>
            <p className="text-[8px] text-amber-600 font-bold mt-0.5">In progress</p>
          </div>
        </div>

        {/* Overdue */}
        <div className="bg-white p-3.5 rounded-xl border border-purple-200 bg-purple-50/20 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-purple-600">
            <span className="text-[9px] font-black uppercase tracking-wider text-purple-900">Overdue</span>
            <AlertTriangle className="w-4 h-4 text-purple-600" />
          </div>
          <div className="mt-2">
            <h3 className="text-xl font-black text-purple-900 tracking-tight">{metrics.overdue}</h3>
            <p className="text-[8px] text-purple-600 font-bold mt-0.5">Breached deadline</p>
          </div>
        </div>

        {/* Completed */}
        <div className="bg-white p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/20 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-600">
            <span className="text-[9px] font-black uppercase tracking-wider text-emerald-900">Completed</span>
            <CheckSquare className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2">
            <h3 className="text-xl font-black text-emerald-900 tracking-tight">{metrics.completed}</h3>
            <p className="text-[8px] text-emerald-600 font-bold mt-0.5">SLA resolved</p>
          </div>
        </div>

        {/* System Suggested */}
        <div className="bg-gradient-to-br from-[#042C51] to-[#083b6b] p-3.5 rounded-xl text-white shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-[9px] font-black uppercase tracking-wider text-white">System Suggested</span>
            <Sparkles className="w-4 h-4 text-[#FF5C28]" />
          </div>
          <div className="mt-2">
            <h3 className="text-xl font-black text-white tracking-tight">{metrics.systemSuggested}</h3>
            <p className="text-[8px] text-slate-300 font-medium mt-0.5">Signals & auto-tasks</p>
          </div>
        </div>
      </section>

      {/* Selected Filter Chip Indicator */}
      {selectedRoleAccount && (
        <div className="bg-blue-50 border border-blue-200 px-4 py-2 rounded-xl flex items-center justify-between text-xs text-[#042C51] font-bold shadow-2xs">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#FF5C28]" />
            <span>
              Viewing Filter: <strong>{selectedRoleAccount.role}</strong> ({selectedRoleAccount.account})
            </span>
          </div>
          <button
            onClick={() => setSelectedRoleAccount(null)}
            className="text-xs text-rose-600 hover:underline font-extrabold flex items-center gap-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" /> Clear Filter
          </button>
        </div>
      )}

      {/* ==================== A. WEEKLY PERFORMANCE SECTION ==================== */}
      <section className="bg-white p-5 rounded-2xl border border-[#E6ECF2] shadow-sm space-y-4">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-black text-[#042C51] flex items-center gap-2">
              <span className="w-1.5 h-3.5 bg-[#FF5C28] rounded-sm"></span>
              A. Weekly Performance (Previous Sprint Results)
            </h3>
            <p className="text-xs text-[#667085] mt-0.5">
              Explains candidate movement and delivery during last week. Click any row to filter Current Status and Action Items.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsAddWeeklyModalOpen(true)}
              className="px-3 py-1.5 bg-[#FF5C28] hover:bg-[#E04B1D] text-white font-black text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs hover:shadow"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Weekly Performance
            </button>
            <span className="text-[10px] font-mono font-bold bg-[#E9F0FC] text-[#042C51] px-2.5 py-1 rounded-full border border-blue-200 shrink-0">
              {filteredWeeklyRecords.length} Role / Account Rows
            </span>
          </div>
        </div>

        <div className="overflow-x-auto border border-[#E6ECF2] rounded-xl">
          <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
            <thead>
              <tr className="border-b border-[#CBD5E1] bg-[#F8FAFC] text-[10px] uppercase text-[#042C51] font-black">
                <th className="py-3 px-3.5 border-r border-[#CBD5E1]">ROLE / ACCOUNT</th>
                <th className="py-3 px-3 border-r border-[#CBD5E1]">WEEK COVERED</th>
                <th className="py-3 px-2.5 text-center border-r border-[#CBD5E1]">STARTING PIPELINE</th>
                <th className="py-3 px-2.5 text-center border-r border-[#CBD5E1]">NEW SOURCED</th>
                <th className="py-3 px-2.5 text-center border-r border-[#CBD5E1]">SCREENED</th>
                <th className="py-3 px-2.5 text-center border-r border-[#CBD5E1]">INTERVIEWED</th>
                <th className="py-3 px-2.5 text-center border-r border-[#CBD5E1]">OFFERS</th>
                <th className="py-3 px-2.5 text-center border-r border-[#CBD5E1]">ACCEPTED</th>
                <th className="py-3 px-2.5 text-center border-r border-[#CBD5E1]">HIRED</th>
                <th className="py-3 px-2.5 text-center border-r border-[#CBD5E1]">DROP-OFFS</th>
                <th className="py-3 px-2.5 text-center border-r border-[#CBD5E1]">ENDING PIPELINE</th>
                <th className="py-3 px-2.5 text-center border-r border-[#CBD5E1]">TARGET HIRES</th>
                <th className="py-3 px-3 text-center border-r border-[#CBD5E1]">PROGRESS VS PLAN</th>
                <th className="py-3 px-3.5">KEY ISSUE LAST WEEK</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6ECF2] text-slate-700 font-medium">
              {filteredWeeklyRecords.length === 0 ? (
                <tr>
                  <td colSpan={14} className="py-8 text-center text-slate-400 font-semibold">
                    No weekly performance records found matching your selected criteria.
                  </td>
                </tr>
              ) : (
                filteredWeeklyRecords.map(rec => {
                  const isSelected = selectedRoleAccount?.role === rec.role && selectedRoleAccount?.account === rec.account;
                  
                  // Calculation
                  let endingPipelineText = "— No historical data";
                  let progressText = "— No historical data";

                  if (rec.hasHistoricalData && rec.startingPipeline !== null && rec.newSourced !== null && rec.hired !== null && rec.dropOffs !== null && rec.targetHires !== null) {
                    const endingPipeline = rec.startingPipeline + rec.newSourced - rec.hired - rec.dropOffs;
                    endingPipelineText = endingPipeline.toString();
                    progressText = `Target: ${rec.targetHires}, Actual: ${rec.hired}`;
                  }

                  return (
                    <tr
                      key={rec.id}
                      onClick={() => {
                        if (isSelected) setSelectedRoleAccount(null);
                        else setSelectedRoleAccount({ role: rec.role, account: rec.account });
                      }}
                      className={`cursor-pointer transition-colors ${
                        isSelected 
                          ? "bg-blue-50/90 border-l-4 border-l-[#FF5C28] font-bold" 
                          : "hover:bg-slate-50/80"
                      }`}
                    >
                      {/* Role / Account */}
                      <td className="py-2.5 px-3.5 border-r border-[#E6ECF2]">
                        <div className="space-y-0.5">
                          <p className="font-extrabold text-[#042C51]">{rec.account}</p>
                          <p className="text-[10px] text-slate-500 font-semibold">{rec.role}</p>
                        </div>
                      </td>

                      {/* Week Covered */}
                      <td className="py-2.5 px-3 font-mono text-[10.5px] text-slate-600 border-r border-[#E6ECF2]">
                        {rec.weekCovered.split("(")[0]}
                      </td>

                      {/* Numerical Pipeline Columns */}
                      {!rec.hasHistoricalData ? (
                        <td colSpan={10} className="py-2.5 px-3 text-center text-slate-400 italic bg-slate-50/50 border-r border-[#E6ECF2]">
                          — No historical data
                        </td>
                      ) : (
                        <>
                          <td className="py-2.5 px-2.5 text-center font-mono border-r border-[#E6ECF2]">{rec.startingPipeline}</td>
                          <td className="py-2.5 px-2.5 text-center font-mono border-r border-[#E6ECF2] text-blue-700 font-bold">+{rec.newSourced}</td>
                          <td className="py-2.5 px-2.5 text-center font-mono border-r border-[#E6ECF2]">{rec.screened}</td>
                          <td className="py-2.5 px-2.5 text-center font-mono border-r border-[#E6ECF2]">{rec.interviewed}</td>
                          <td className="py-2.5 px-2.5 text-center font-mono border-r border-[#E6ECF2]">{rec.offers}</td>
                          <td className="py-2.5 px-2.5 text-center font-mono border-r border-[#E6ECF2] font-bold text-slate-800">{rec.accepted}</td>
                          <td className="py-2.5 px-2.5 text-center font-mono border-r border-[#E6ECF2] font-black text-emerald-700">{rec.hired}</td>
                          <td className="py-2.5 px-2.5 text-center font-mono border-r border-[#E6ECF2] font-bold text-rose-600">-{rec.dropOffs}</td>
                          <td className="py-2.5 px-2.5 text-center font-mono border-r border-[#E6ECF2] font-black text-[#042C51]">{endingPipelineText}</td>
                          <td className="py-2.5 px-2.5 text-center font-mono border-r border-[#E6ECF2] font-bold text-slate-600">{rec.targetHires}</td>
                        </>
                      )}

                      {/* Progress vs Plan */}
                      <td className="py-2.5 px-3 text-center font-mono text-[11px] border-r border-[#E6ECF2]">
                        {rec.hasHistoricalData ? (
                          <span className={`px-2 py-0.5 rounded font-black ${
                            (rec.hired || 0) >= (rec.targetHires || 0)
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-amber-50 text-amber-800 border border-amber-200"
                          }`}>
                            {progressText}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">— No historical data</span>
                        )}
                      </td>

                      {/* Key Issue Last Week */}
                      <td className="py-2.5 px-3.5 text-slate-600 text-[11px] font-medium max-w-xs truncate" title={rec.keyIssueLastWeek}>
                        {rec.keyIssueLastWeek}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ==================== B. CURRENT STATUS SECTION ==================== */}
      <section className="bg-white p-5 rounded-2xl border border-[#E6ECF2] shadow-sm space-y-4">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-black text-[#042C51] flex items-center gap-2">
              <span className="w-1.5 h-3.5 bg-[#FF5C28] rounded-sm"></span>
              B. Current Status (Active Open Requirements)
            </h3>
            <p className="text-xs text-[#667085] mt-0.5">
              Explains open requisitions, fill rates, at-risk flags, and missing action triggers.
            </p>
          </div>
          <span className="text-[10px] font-mono font-bold bg-[#E9F0FC] text-[#042C51] px-2.5 py-1 rounded-full border border-blue-200 shrink-0">
            {filteredCurrentStatusRecords.length} Active Requisitions
          </span>
        </div>

        <div className="overflow-x-auto border border-[#E6ECF2] rounded-xl">
          <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
            <thead>
              <tr className="border-b border-[#CBD5E1] bg-[#F8FAFC] text-[10px] uppercase text-[#042C51] font-black">
                <th className="py-3 px-3.5 border-r border-[#CBD5E1]">ROLE / ACCOUNT</th>
                <th className="py-3 px-2.5 border-r border-[#CBD5E1]">OPEN DATE</th>
                <th className="py-3 px-2.5 border-r border-[#CBD5E1]">DUE DATE</th>
                <th className="py-3 px-2.5 text-right border-r border-[#CBD5E1]">REQUIRED HIRING</th>
                <th className="py-3 px-2.5 text-right border-r border-[#CBD5E1]">FILL RATE</th>
                <th className="py-3 px-2.5 text-right border-r border-[#CBD5E1]">DAYS OPEN</th>
                <th className="py-3 px-2.5 text-center border-r border-[#CBD5E1]">QUALIFIED PIPELINE</th>
                <th className="py-3 px-2.5 text-center border-r border-[#CBD5E1]">SCREENED</th>
                <th className="py-3 px-2.5 text-center border-r border-[#CBD5E1]">INTERVIEWED</th>
                <th className="py-3 px-2.5 text-center border-r border-[#CBD5E1]">OFFERS</th>
                <th className="py-3 px-2.5 text-center border-r border-[#CBD5E1]">ACCEPTED</th>
                <th className="py-3 px-2.5 text-center border-r border-[#CBD5E1]">AT RISK</th>
                <th className="py-3 px-3 border-r border-[#CBD5E1]">REASON</th>
                <th className="py-3 px-3.5">LATEST STATUS / NOTES & ACTION TRIGGER</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6ECF2] text-slate-700 font-medium">
              {filteredCurrentStatusRecords.length === 0 ? (
                <tr>
                  <td colSpan={14} className="py-8 text-center text-slate-400 font-semibold">
                    No active requisitions found matching your filter scope.
                  </td>
                </tr>
              ) : (
                filteredCurrentStatusRecords.map(rec => {
                  const fillRateVal = Math.round((rec.accepted / rec.requiredHiring) * 100);
                  const daysOpenVal = getDaysOpen(rec.openDate);
                  const activeActionExists = hasActiveActionForItem(rec.role, rec.account);
                  const isMissingAction = rec.atRisk && !activeActionExists;

                  return (
                    <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Role / Account */}
                      <td className="py-2.5 px-3.5 border-r border-[#E6ECF2]">
                        <div className="space-y-0.5">
                          <p className="font-extrabold text-[#042C51]">{rec.account}</p>
                          <p className="text-[10px] text-slate-500 font-semibold">{rec.role}</p>
                          <p className="text-[9px] text-slate-400">TA: {rec.taOwner}</p>
                        </div>
                      </td>

                      {/* Dates */}
                      <td className="py-2.5 px-2.5 font-mono text-[10.5px] border-r border-[#E6ECF2]">{rec.openDate}</td>
                      <td className="py-2.5 px-2.5 font-mono text-[10.5px] border-r border-[#E6ECF2]">{rec.dueDate}</td>

                      {/* Required Hiring */}
                      <td className="py-2.5 px-2.5 text-right font-mono font-bold text-[#042C51] border-r border-[#E6ECF2]">
                        {rec.requiredHiring}
                      </td>

                      {/* Fill Rate */}
                      <td className="py-2.5 px-2.5 text-right font-mono border-r border-[#E6ECF2]">
                        <span className={`font-black px-1.5 py-0.5 rounded ${
                          fillRateVal >= 100 
                            ? "bg-emerald-50 text-emerald-700" 
                            : fillRateVal >= 70 
                            ? "bg-blue-50 text-blue-700" 
                            : "bg-rose-50 text-rose-600"
                        }`}>
                          {fillRateVal}%
                        </span>
                      </td>

                      {/* Days Open */}
                      <td className="py-2.5 px-2.5 text-right font-mono border-r border-[#E6ECF2] text-slate-600 font-bold">
                        {daysOpenVal} days
                      </td>

                      {/* Pipeline details */}
                      <td className="py-2.5 px-2.5 text-center font-mono border-r border-[#E6ECF2]">{rec.qualifiedPipeline}</td>
                      <td className="py-2.5 px-2.5 text-center font-mono border-r border-[#E6ECF2]">{rec.screened}</td>
                      <td className="py-2.5 px-2.5 text-center font-mono border-r border-[#E6ECF2]">{rec.interviewed}</td>
                      <td className="py-2.5 px-2.5 text-center font-mono border-r border-[#E6ECF2]">{rec.offers}</td>
                      <td className="py-2.5 px-2.5 text-center font-mono border-r border-[#E6ECF2] font-black text-[#042C51]">{rec.accepted}</td>

                      {/* At Risk */}
                      <td className="py-2.5 px-2.5 text-center border-r border-[#E6ECF2]">
                        {rec.atRisk ? (
                          <span className="bg-rose-500 text-white font-black px-2 py-0.5 rounded text-[10px] uppercase shadow-2xs">
                            Y
                          </span>
                        ) : (
                          <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px] uppercase">
                            N
                          </span>
                        )}
                      </td>

                      {/* Reason */}
                      <td className="py-2.5 px-3 border-r border-[#E6ECF2]">
                        {rec.reason ? (
                          <span className="text-rose-700 font-bold text-[11px] block max-w-xs leading-tight">
                            {rec.reason}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic text-[10px]">No risk triggers</span>
                        )}
                      </td>

                      {/* Latest Status / Notes & Missing Action Button */}
                      <td className="py-2.5 px-3.5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <p className="text-[11px] text-slate-600 leading-tight max-w-md truncate" title={rec.latestStatusNotes}>
                            {rec.latestStatusNotes}
                          </p>

                          {/* Missing Action Rule Execution */}
                          {isMissingAction ? (
                            <button
                              onClick={() => handleOpenAddActionForRecord(rec)}
                              className="px-2.5 py-1 bg-[#FF5C28] hover:bg-[#E04B1D] text-white font-black text-[10px] rounded-lg transition-all flex items-center gap-1 shrink-0 cursor-pointer shadow-2xs"
                              title="No active action item exists for this at-risk requisition! Click to create one."
                            >
                              <Plus className="w-3 h-3" />
                              Missing Action
                            </button>
                          ) : activeActionExists ? (
                            <span className="text-[9.5px] font-black bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100 shrink-0">
                              Action Assigned
                            </span>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ==================== C. ACTION ITEMS — JIT DELIVERY FOCUS ==================== */}
      <section className="bg-white p-5 rounded-2xl border border-[#E6ECF2] shadow-sm space-y-4">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-black text-[#042C51] flex items-center gap-2">
              <span className="w-1.5 h-3.5 bg-[#FF5C28] rounded-sm"></span>
              C. Action Items — JIT Delivery Focus Registry
            </h3>
            <p className="text-xs text-[#667085] mt-0.5">
              Tactical SLA mitigation registry. Click any item to inspect details or update progress notes.
            </p>
          </div>
          <span className="text-[10px] font-mono font-bold bg-[#E9F0FC] text-[#042C51] px-2.5 py-1 rounded-full border border-blue-200 shrink-0">
            Showing {filteredActionItems.length} Actions
          </span>
        </div>

        <div className="border border-[#E6ECF2] rounded-xl overflow-hidden">
          {/* Secondary Search & Filter Toolbar inside Section C */}
          <div className="p-3 bg-slate-50/70 border-b border-[#E6ECF2] flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Filter action registry..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-bold text-slate-800"
          >
            <option value="All">All Statuses</option>
            <option value="Planned">Planned</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-bold text-slate-800"
          >
            <option value="All">All Risk Levels</option>
            <option value="Low">Low Risk</option>
            <option value="Medium">Medium Risk</option>
            <option value="High">High Risk</option>
          </select>
        </div>

        {/* Action Items Table */}
        <div className="overflow-x-auto">
          {filteredActionItems.length === 0 ? (
            <div className="text-center py-10 text-slate-400 space-y-1">
              <p className="text-xs font-bold">No action items found in the JIT delivery registry.</p>
              <p className="text-[10px]">Create an action or adjust your filter selection.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
              <thead>
                <tr className="border-b border-[#CBD5E1] bg-[#F8FAFC] text-[10px] uppercase text-[#042C51] font-black">
                  <th className="py-3 px-4 border-r border-[#CBD5E1]">ACTION ITEM</th>
                  <th className="py-3 px-3.5 border-r border-[#CBD5E1]">ROLE / ACCOUNT</th>
                  <th className="py-3 px-3 border-r border-[#CBD5E1]">OWNER</th>
                  <th className="py-3 px-3 border-r border-[#CBD5E1]">DEADLINE</th>
                  <th className="py-3 px-3 border-r border-[#CBD5E1]">STATUS</th>
                  <th className="py-3 px-3 border-r border-[#CBD5E1]">RISK LEVEL</th>
                  <th className="py-3 px-4 border-r border-[#CBD5E1]">REMARKS / NOTES</th>
                  <th className="py-3 px-3 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6ECF2] text-slate-700">
                {filteredActionItems.map(it => {
                  const daysInfo = getDaysLeftText(it.deadline);
                  return (
                    <tr
                      key={it.id}
                      onClick={() => {
                        setSelectedItem(it);
                        setIsDetailsModalOpen(true);
                      }}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                    >
                      {/* Action Item & Source Badge */}
                      <td className="py-3 px-4 border-r border-[#E6ECF2]">
                        <div className="space-y-0.5 max-w-xs">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-[9px] font-extrabold text-[#042C51] bg-slate-100 px-1.5 py-0.2 rounded">
                              {it.id}
                            </span>
                            <span className={`text-[8px] font-black uppercase px-1 rounded ${
                              it.sourceType === "System" 
                                ? "bg-purple-50 text-purple-700 border border-purple-100" 
                                : "bg-blue-50 text-blue-700 border border-blue-100"
                            }`}>
                              {it.sourceType}
                            </span>
                          </div>
                          <p className="font-extrabold text-[#042C51] truncate" title={it.description}>
                            {it.description}
                          </p>
                        </div>
                      </td>

                      {/* Role / Account */}
                      <td className="py-3 px-3.5 border-r border-[#E6ECF2]">
                        <div className="space-y-0.5">
                          <p className="font-bold text-[#042C51]">{it.account}</p>
                          <p className="text-[10px] text-slate-500 font-semibold">{it.role}</p>
                        </div>
                      </td>

                      {/* Owner */}
                      <td className="py-3 px-3 font-bold text-slate-700 border-r border-[#E6ECF2]">
                        {it.owner}
                      </td>

                      {/* Deadline */}
                      <td className="py-3 px-3 font-mono border-r border-[#E6ECF2]">
                        <p className="text-slate-600 font-semibold">{it.deadline}</p>
                        <p className={`text-[9.5px] font-black ${daysInfo.colorClass}`}>{daysInfo.text}</p>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3 border-r border-[#E6ECF2]">
                        {it.status === "Planned" && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-50 text-blue-800 border border-blue-200">
                            Planned
                          </span>
                        )}
                        {it.status === "Ongoing" && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-50 text-amber-800 border border-amber-200">
                            Ongoing
                          </span>
                        )}
                        {it.status === "Completed" && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-800 border border-emerald-200">
                            Completed
                          </span>
                        )}
                        {it.status === "Cancelled" && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-100 text-slate-500 border border-slate-200">
                            Cancelled
                          </span>
                        )}
                      </td>

                      {/* Risk Level */}
                      <td className="py-3 px-3 border-r border-[#E6ECF2]">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                          it.risk === "High" 
                            ? "bg-rose-50 text-rose-800 border border-rose-200" 
                            : it.risk === "Medium"
                            ? "bg-amber-50 text-amber-800 border border-amber-200"
                            : "bg-blue-50 text-blue-800 border border-blue-200"
                        }`}>
                          {it.risk}
                        </span>
                      </td>

                      {/* Remarks / Notes */}
                      <td className="py-3 px-4 border-r border-[#E6ECF2] max-w-xs truncate">
                        {it.notes ? (
                          <span className="text-[11px] text-slate-600 font-medium" title={it.notes}>
                            {it.notes}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic text-[10px]">No notes logged</span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                          {it.sourceType === "Manual" && it.status !== "Completed" && (
                            <button
                              onClick={() => handleUpdateStatus(it.id, "Completed")}
                              className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10px] rounded transition-colors cursor-pointer"
                              title="Mark Completed"
                            >
                              Resolve
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setSelectedItem(it);
                              setIsDetailsModalOpen(true);
                            }}
                            className="px-2 py-1 bg-[#042C51] hover:bg-[#031d36] text-white font-bold text-[10px] rounded transition-colors cursor-pointer"
                          >
                            Details
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
      </div>
    </section>

      {/* ==================== SUPPORTING DASHBOARD SECTIONS (OPERATIONAL INSIGHTS) ==================== */}
      <section className="bg-white p-5 rounded-2xl border border-[#E6ECF2] shadow-sm space-y-5">
        <div>
          <h2 className="text-xs font-black text-[#042C51] uppercase tracking-wider flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-[#FF5C28]" />
            Operational Insights & Supporting Analytics
          </h2>
          <p className="text-[11px] text-slate-500">
            Secondary health profiles, SLA watchlist, and system signals monitoring overall campaign health.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Priority Watchlist & Health Profile */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-extrabold text-[#042C51] uppercase flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  Priority Watchlist (SLA-At-Risk)
                </h3>
                <span className="text-[9px] bg-rose-50 text-rose-800 font-bold px-2 py-0.5 rounded border border-rose-200 uppercase">
                  Action Required
                </span>
              </div>

              <div className="divide-y divide-slate-200 text-xs">
                {items
                  .filter(it => it.risk === "High" && it.status !== "Completed")
                  .slice(0, 3)
                  .map(it => (
                    <div key={it.id} className="py-2 flex items-center justify-between gap-2">
                      <div className="space-y-0.5">
                        <p className="font-bold text-[#042C51]">{it.description}</p>
                        <p className="text-[10px] text-slate-500">{it.account} • {it.role} • Owner: {it.owner}</p>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded shrink-0">
                        {it.deadline}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Module Signals */}
          <div className="lg:col-span-5 p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-[#042C51] uppercase flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#FF5C28]" />
                Recruitment Module Signals
              </h3>
              <span className="text-[9px] bg-blue-50 text-blue-800 font-bold px-2 py-0.5 rounded border border-blue-200">
                Auto-Detected
              </span>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {signals.map(sig => (
                <div key={sig.id} className="p-2.5 bg-white rounded-lg border border-slate-200 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-[#042C51]">{sig.title}</span>
                    <span className="text-[9px] font-mono font-bold bg-slate-100 px-1.5 py-0.5 rounded">{sig.module}</span>
                  </div>
                  <p className="text-[10px] text-slate-500">{sig.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== MODALS ==================== */}

      {/* ADD RECRUITMENT ACTION ITEM MODAL */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col my-auto"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 bg-[#042C51] text-white flex items-center justify-between border-b border-slate-700">
                <div className="space-y-0.5">
                  <h3 className="text-base font-black tracking-tight flex items-center gap-2">
                    <CheckSquare className="w-5 h-5 text-[#FF5C28]" />
                    Add Recruitment Action Item
                  </h3>
                  <p className="text-xs text-slate-300">
                    Link a hiring gap to one accountable owner, deadline, risk level, and follow-up action.
                  </p>
                </div>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Close Modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Body - 2 Column Layout */}
              <form onSubmit={handleCreateActionItem} className="flex flex-col flex-1">
                <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs bg-slate-50/50">
                  
                  {/* LEFT PANEL: Source Record & Hiring Context */}
                  <div className="space-y-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                        <h4 className="font-extrabold text-[#042C51] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-[#FF5C28]" />
                          Source Record & Hiring Context
                        </h4>
                        <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-600 rounded-md font-bold text-[10px]">
                          {isOpenedFromCurrentStatus ? "Pre-filled from Current Status" : "Global Creation"}
                        </span>
                      </div>

                      {/* Source Module & Reporting Week */}
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div className="space-y-1">
                          <label className="text-[9px] font-black uppercase text-slate-500">Source Module</label>
                          <input
                            type="text"
                            readOnly
                            value={formState.sourceModule || "Workforce Hiring Plan"}
                            className="w-full px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg font-semibold text-slate-700"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-black uppercase text-slate-500">Reporting Week</label>
                          <input
                            type="text"
                            readOnly
                            value={formState.reportingWeek || "W29 (Jul 14 - Jul 20)"}
                            className="w-full px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg font-mono font-bold text-slate-700"
                          />
                        </div>
                      </div>

                      {/* Cluster & Target Role/Account */}
                      <div className="space-y-3 mb-3">
                        <div className="grid grid-cols-3 gap-3">
                          <div className="col-span-1 space-y-1">
                            <label className="text-[9px] font-black uppercase text-slate-500">Cluster</label>
                            <input
                              type="text"
                              readOnly
                              value={formState.cluster || "General"}
                              className="w-full px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg font-semibold text-slate-700"
                            />
                          </div>
                          <div className="col-span-2 space-y-1">
                            <label className="text-[9px] font-black uppercase text-slate-500">Role / Account Target</label>
                            {isOpenedFromCurrentStatus ? (
                              <input
                                type="text"
                                readOnly
                                value={`${formState.roleTitle} (${formState.account})`}
                                className="w-full px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg font-bold text-[#042C51]"
                              />
                            ) : (
                              <select
                                value={`${formState.roleTitle} - ${formState.account}`}
                                onChange={(e) => {
                                  const [r, a] = e.target.value.split(" - ");
                                  const matchingRec = currentStatusRecords.find(rec => rec.role === r && rec.account === a);
                                  setFormState(prev => ({
                                    ...prev,
                                    roleAccount: e.target.value,
                                    roleTitle: r || prev.roleTitle,
                                    account: a || prev.account,
                                    requirement: matchingRec?.requiredHiring || prev.requirement,
                                    filled: matchingRec?.accepted || prev.filled,
                                    cluster: matchingRec?.cluster || prev.cluster,
                                    atRiskReason: matchingRec?.reason || "",
                                    latestStatusNote: matchingRec?.latestStatusNotes || "",
                                  }));
                                }}
                                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-[#042C51]"
                              >
                                {currentStatusRecords.map(rec => (
                                  <option key={rec.id} value={`${rec.role} - ${rec.account}`}>
                                    {rec.role} — {rec.account} ({rec.cluster})
                                  </option>
                                ))}
                              </select>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Hiring Metric Summary Cards */}
                      <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 mb-3">
                        <div className="text-center">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Requirement</span>
                          <span className="text-base font-black text-[#042C51] font-mono">{formState.requirement}</span>
                        </div>
                        <div className="text-center border-x border-slate-200 px-1">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">{dynamicFilledLabel}</span>
                          <span className="text-base font-black text-emerald-600 font-mono">{formState.filled}</span>
                        </div>
                        <div className="text-center">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Remaining Gap</span>
                          <span className="text-base font-black text-rose-600 font-mono">
                            {Math.max(0, formState.requirement - formState.filled)}
                          </span>
                        </div>
                      </div>

                      {/* Fill Rate Progress Bar */}
                      <div className="space-y-1 mb-4">
                        <div className="flex justify-between items-center text-[10px] font-bold">
                          <span className="text-slate-500">Current Fill Rate Progress</span>
                          <span className={currentFillRate >= 80 ? "text-emerald-600" : currentFillRate >= 50 ? "text-amber-600" : "text-rose-600"}>
                            {currentFillRate}%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                          <div
                            className={`h-full transition-all duration-300 ${
                              currentFillRate >= 80 ? "bg-emerald-500" : currentFillRate >= 50 ? "bg-amber-500" : "bg-rose-500"
                            }`}
                            style={{ width: `${Math.min(100, currentFillRate)}%` }}
                          />
                        </div>
                      </div>

                      {/* Source Risk Context (if available) */}
                      {formState.atRiskReason && (
                        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-1 mb-3 text-[11px]">
                          <div className="flex items-center gap-1.5 text-rose-700 font-black">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>Source Risk Trigger:</span>
                          </div>
                          <p className="text-rose-900 font-semibold">{formState.atRiskReason}</p>
                        </div>
                      )}

                      {/* Source Status Notes */}
                      {formState.latestStatusNote && (
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-[11px]">
                          <span className="text-[9px] font-black text-slate-500 uppercase">Latest Status Note:</span>
                          <p className="text-slate-700 italic font-medium">{formState.latestStatusNote}</p>
                        </div>
                      )}
                    </div>

                    {/* Action Coverage Status Badge */}
                    <div className="pt-3 border-t border-slate-100">
                      <div className="flex items-center justify-between p-2.5 rounded-lg border bg-slate-50">
                        <span className="text-[10px] font-black uppercase text-slate-500">Action Coverage Status:</span>
                        {openActionsForCurrentRoleCount > 0 ? (
                          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-full font-black text-[10px] flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Covered ({openActionsForCurrentRoleCount} Active Action{openActionsForCurrentRoleCount > 1 ? 's' : ''})
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 bg-amber-100 text-amber-800 border border-amber-300 rounded-full font-black text-[10px] flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                            Missing Action (Coverage Required)
                          </span>
                        )}
                      </div>
                    </div>

                  </div>

                  {/* RIGHT PANEL: Action Definition & Assignment */}
                  <div className="space-y-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
                    <div className="space-y-3.5">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <h4 className="font-extrabold text-[#042C51] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                          <CheckSquare className="w-3.5 h-3.5 text-[#FF5C28]" />
                          Action Definition & Assignment
                        </h4>
                        <span className="text-[10px] text-slate-400 font-semibold">* Required fields</span>
                      </div>

                      {/* Action Description */}
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase text-slate-500 flex items-center gap-1">
                          Action Item Description <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Define concrete action (e.g., Expedite medical clearance for 3 candidates...)"
                          value={formState.actionItem}
                          onChange={(e) => setFormState(prev => ({ ...prev, actionItem: e.target.value }))}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold focus:bg-white focus:border-[#042C51] outline-none text-slate-800"
                          required
                        />
                      </div>

                      {/* Accountable Owner & Target Deadline */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[9px] font-black uppercase text-slate-500 flex items-center gap-1">
                            Accountable Owner <span className="text-rose-500">*</span>
                          </label>
                          <select
                            value={formState.owner}
                            onChange={(e) => setFormState(prev => ({ ...prev, owner: e.target.value }))}
                            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800"
                            required
                          >
                            {OWNER_OPTIONS.map(owner => (
                              <option key={owner} value={owner}>{owner}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-black uppercase text-slate-500 flex items-center gap-1">
                            Target Deadline <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="date"
                            value={formState.deadline}
                            onChange={(e) => setFormState(prev => ({ ...prev, deadline: e.target.value }))}
                            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-slate-800"
                            required
                          />
                        </div>
                      </div>

                      {/* Status & Risk Level */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[9px] font-black uppercase text-slate-500">Initial Status</label>
                          <select
                            value={formState.status}
                            onChange={(e) => setFormState(prev => ({ ...prev, status: e.target.value as "Planned" | "Ongoing" | "Completed" }))}
                            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-[#042C51]"
                          >
                            <option value="Planned">Planned</option>
                            <option value="Ongoing">Ongoing</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-black uppercase text-slate-500">Assigned Risk Level</label>
                          <select
                            value={formState.riskLevel}
                            onChange={(e) => setFormState(prev => ({ ...prev, riskLevel: e.target.value as "High" | "Medium" | "Low" }))}
                            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-[#042C51]"
                          >
                            <option value="High">High Risk</option>
                            <option value="Medium">Medium Risk</option>
                            <option value="Low">Low Risk</option>
                          </select>
                        </div>
                      </div>

                      {/* Linked Gap Category */}
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase text-slate-500">Linked Gap Category</label>
                        <select
                          value={formState.linkedGap}
                          onChange={(e) => setFormState(prev => ({ ...prev, linkedGap: e.target.value }))}
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-[#042C51]"
                        >
                          {LINKED_GAP_OPTIONS.map(gap => (
                            <option key={gap} value={gap}>{gap}</option>
                          ))}
                        </select>
                      </div>

                      {/* Follow-up Remarks */}
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase text-slate-500">Follow-up Remarks / Action Plan Notes</label>
                        <textarea
                          rows={3}
                          placeholder="Add details regarding root cause, candidate names, or specific escalation steps..."
                          value={formState.remarks}
                          onChange={(e) => setFormState(prev => ({ ...prev, remarks: e.target.value }))}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-800 resize-none focus:bg-white outline-none"
                        />
                      </div>
                    </div>

                    {/* Duplicate Action Confirmation Warning */}
                    {showDuplicateConfirm && (
                      <div className="p-3 bg-amber-50 border-2 border-amber-300 rounded-xl space-y-2 mt-2">
                        <div className="flex items-start gap-2 text-amber-900 font-bold text-[11px]">
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-extrabold text-amber-950">Active Action Already Exists</p>
                            <p className="font-medium text-amber-800 text-[10px]">
                              An active ({formState.linkedGap}) action is already logged for {formState.roleTitle} - {formState.account}.
                              Do you want to create an additional action item?
                            </p>
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-1 border-t border-amber-200/60 font-bold text-[10px]">
                          <button
                            type="button"
                            onClick={() => setShowDuplicateConfirm(false)}
                            className="px-2.5 py-1 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-md cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-md cursor-pointer"
                          >
                            Proceed & Save Anyway
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                </div>

                {/* Footer Controls & Rules */}
                <div className="px-6 py-4 bg-slate-100 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={handleResetCreateForm}
                      className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-200/60 text-slate-700 font-bold rounded-lg transition-colors cursor-pointer text-[11px] flex items-center gap-1.5 shrink-0"
                      title={isOpenedFromCurrentStatus ? "Restore original Current Status pre-filled values" : "Reset form to default state"}
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                      Reset Form
                    </button>

                    <div className="hidden md:flex items-center gap-1.5 text-[10px] text-slate-500 font-medium max-w-md">
                      <Info className="w-3.5 h-3.5 text-[#042C51] shrink-0" />
                      <span>
                        Rule: Every role where Current Filled &lt; Requirement must have at least one active action item.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end font-bold">
                    <button
                      type="button"
                      onClick={() => setIsCreateModalOpen(false)}
                      className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-[#FF5C28] hover:bg-[#E04B1D] text-white rounded-xl transition-all cursor-pointer shadow-sm hover:shadow text-xs flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Save Action Item
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DETAILS & SECONDARY INFORMATION MODAL */}
      <AnimatePresence>
        {isDetailsModalOpen && selectedItem && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col"
            >
              <div className="px-6 py-4 bg-[#042C51] text-white flex items-center justify-between">
                <div>
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
                  className="p-1 rounded-full text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-4 overflow-y-auto max-h-[500px] text-xs">
                {/* Secondary Info Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div>
                    <p className="text-[9px] font-black uppercase text-slate-400">Source Type</p>
                    <p className="font-black text-[#042C51]">{selectedItem.sourceType}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase text-slate-400">Module</p>
                    <p className="font-black text-[#042C51]">{selectedItem.module}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase text-slate-400">Requirement</p>
                    <p className="font-mono font-bold text-slate-800">{selectedItem.requirement ?? "—"}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase text-slate-400">Filled / Remaining</p>
                    <p className="font-mono font-bold text-slate-800">
                      {selectedItem.filled ?? 0} / <span className="text-rose-600 font-black">{selectedItem.remainingGap ?? 0} gap</span>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div>
                    <p className="text-[9px] font-black uppercase text-slate-400">Created Date</p>
                    <p className="font-mono text-slate-600">{selectedItem.createdDate || "2026-07-18"}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase text-slate-400">Completed Date</p>
                    <p className="font-mono text-emerald-700 font-bold">{selectedItem.completedDate || "N/A (Open)"}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase text-slate-400">Assigned Owner</p>
                    <p className="font-bold text-[#042C51]">{selectedItem.owner}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase text-slate-400">Deadline</p>
                    <p className="font-mono text-slate-700 font-bold">{selectedItem.deadline}</p>
                  </div>
                </div>

                {/* Campaign context */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[9px] font-black uppercase text-slate-400">Account</p>
                    <p className="font-bold text-[#042C51]">{selectedItem.account}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase text-slate-400">Role</p>
                    <p className="font-bold text-[#042C51]">{selectedItem.role}</p>
                  </div>
                </div>

                {/* Detailed Context */}
                <div className="space-y-1">
                  <p className="text-[9px] font-black uppercase text-slate-400">Detailed Context</p>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-slate-600 leading-relaxed font-semibold">
                    {selectedItem.longDescription}
                  </div>
                </div>

                {/* Status controls */}
                <div className="space-y-1.5 border-t border-slate-100 pt-3">
                  <p className="text-[9px] font-black uppercase text-slate-400">Update Status</p>
                  {selectedItem.sourceType === "System" ? (
                    <p className="text-[10px] text-purple-700 font-semibold bg-purple-50 p-2 rounded border border-purple-100">
                      System-suggested actions remain controlled by their source conditions and resolve automatically once condition clears.
                    </p>
                  ) : (
                    <div className="flex gap-1.5 font-bold">
                      {(["Planned", "Ongoing", "Completed", "Cancelled"] as const).map(st => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => handleUpdateStatus(selectedItem.id, st)}
                          className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                            selectedItem.status === st ? "bg-[#042C51] text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Route back to Source module */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-[9px] font-black uppercase text-slate-400">Source Module Link</p>
                    <p className="font-bold text-[#042C51]">{selectedItem.module}</p>
                  </div>

                  {onSwitchModule && (
                    <button
                      type="button"
                      onClick={() => handleViewSourceRecord(selectedItem.module)}
                      className="px-3.5 py-1.5 bg-[#FF5C28] hover:bg-[#E04B1D] text-white font-black text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      View Source Record ({selectedItem.module})
                    </button>
                  )}
                </div>

                {/* Operational Progress Notes */}
                <div className="space-y-1.5 border-t border-slate-100 pt-3">
                  <label className="text-[9px] font-black uppercase text-slate-400">Add Operational Progress Note</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type note..."
                      value={tempNotesInput}
                      onChange={(e) => setTempNotesInput(e.target.value)}
                      className="flex-1 px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={handleAddModalNotes}
                      className="px-3 py-1 bg-[#042C51] text-white font-bold rounded-lg cursor-pointer"
                    >
                      Add Note
                    </button>
                  </div>
                  {selectedItem.notes && (
                    <div className="bg-orange-50 p-2 rounded-lg border border-orange-100 text-slate-700">
                      <strong>Remarks:</strong> {selectedItem.notes}
                    </div>
                  )}
                </div>

                {/* Audit Trail */}
                <div className="space-y-1.5 border-t border-slate-100 pt-3">
                  <p className="text-[9px] font-black uppercase text-slate-400">History Trail</p>
                  <div className="bg-slate-50 rounded-lg border border-slate-100 divide-y divide-slate-200">
                    {selectedItem.history.map((h, i) => (
                      <div key={i} className="p-2 flex justify-between text-[10px]">
                        <div>
                          <p className="font-bold text-[#042C51]">{h.action}</p>
                          <p className="text-slate-400">By: {h.user}</p>
                        </div>
                        <span className="font-mono text-slate-400">{h.date}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setIsDetailsModalOpen(false);
                    setSelectedItem(null);
                  }}
                  className="px-4 py-1.5 bg-[#042C51] text-white font-bold rounded-lg cursor-pointer"
                >
                  Close Details
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SEND RECRUITMENT REPORT VIA EMAIL MODAL */}
      <AnimatePresence>
        {isEmailModalOpen && (
          <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col my-auto max-h-[92vh]"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 bg-[#042C51] text-white flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#FF5C28]/20 rounded-xl border border-[#FF5C28]/30">
                    <Mail className="w-5 h-5 text-[#FF5C28]" />
                  </div>
                  <div>
                    <h3 className="text-base font-black tracking-tight flex items-center gap-2">
                      Send Recruitment Report by Email & PDF
                    </h3>
                    <p className="text-xs text-slate-300">
                      Dispatches Sections A (Weekly), B (Current Status), and C (Action Items) based on active scope filters ({scopeWeek}).
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEmailModalOpen(false)}
                  className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body: Two Column */}
              <div className="flex-1 overflow-y-auto p-6 bg-slate-50/60 grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
                
                {/* LEFT 5 COLUMNS: Composition & Launchers */}
                <div className="lg:col-span-5 space-y-4">
                  
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <span className="font-extrabold text-[#042C51] text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                        <Send className="w-3.5 h-3.5 text-[#FF5C28]" />
                        Email Dispatch Details
                      </span>
                      <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold border border-blue-100">
                        {scopeWeek}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-slate-500">To Recipients</label>
                      <input
                        type="text"
                        value={emailTo}
                        onChange={(e) => setEmailTo(e.target.value)}
                        placeholder="recipients@company.com"
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-slate-500">CC</label>
                      <input
                        type="text"
                        value={emailCc}
                        onChange={(e) => setEmailCc(e.target.value)}
                        placeholder="manager@company.com"
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-slate-500">Subject Line</label>
                      <input
                        type="text"
                        value={emailSubject}
                        onChange={(e) => setEmailSubject(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-[#042C51]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-slate-500">Intro Message Note</label>
                      <textarea
                        rows={3}
                        value={emailNote}
                        onChange={(e) => setEmailNote(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-800 resize-none"
                      />
                    </div>
                  </div>

                  {/* Dispatch Action Options */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
                    <span className="font-extrabold text-[#042C51] text-[11px] uppercase tracking-wider block border-b border-slate-100 pb-2">
                      Dispatch Methods
                    </span>

                    <button
                      onClick={handleLaunchGmail}
                      className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Launch Gmail Web Compose</span>
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={handlePrintPdfReport}
                        className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-[#042C51] font-bold rounded-xl border border-slate-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer text-[11px]"
                      >
                        <Printer className="w-3.5 h-3.5 text-[#FF5C28]" />
                        <span>Download PDF / Print</span>
                      </button>

                      <button
                        onClick={handleCopyPlainText}
                        className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-[#042C51] font-bold rounded-xl border border-slate-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer text-[11px]"
                      >
                        {emailCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-600" />}
                        <span>{emailCopied ? "Copied!" : "Copy Text"}</span>
                      </button>
                    </div>

                    <button
                      onClick={handleSimulateSendEmail}
                      disabled={isSendingEmail}
                      className="w-full py-2.5 px-4 bg-[#FF5C28] hover:bg-[#E04B1D] disabled:opacity-50 text-white font-black rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                    >
                      {isSendingEmail ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Dispatching Email...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Send System Email</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Active Scope Context */}
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-1 text-[10px] text-blue-900">
                    <span className="font-extrabold uppercase block">Active Scope Context</span>
                    <p>
                      Cluster: <strong>{scopeCluster}</strong> | Account: <strong>{scopeAccount}</strong> | Role: <strong>{scopeRole}</strong> | Owner: <strong>{scopeOwner}</strong>
                    </p>
                  </div>

                </div>

                {/* RIGHT 7 COLUMNS: Live Report Preview */}
                <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col overflow-hidden">
                  
                  {/* Tab Selector */}
                  <div className="px-4 py-2.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-extrabold text-slate-700">
                      <Eye className="w-3.5 h-3.5 text-[#FF5C28]" />
                      <span>Report Live Preview</span>
                    </div>

                    <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200">
                      <button
                        onClick={() => setEmailTab("formatted")}
                        className={`px-2.5 py-1 rounded-md text-[10px] font-bold cursor-pointer transition-colors ${
                          emailTab === "formatted" ? "bg-[#042C51] text-white" : "text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        Formatted Email & PDF
                      </button>
                      <button
                        onClick={() => setEmailTab("plain")}
                        className={`px-2.5 py-1 rounded-md text-[10px] font-bold cursor-pointer transition-colors ${
                          emailTab === "plain" ? "bg-[#042C51] text-white" : "text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        Plain Text Draft
                      </button>
                    </div>
                  </div>

                  {/* Preview Container */}
                  <div className="p-4 flex-1 overflow-y-auto max-h-[550px]">
                    {emailTab === "formatted" ? (
                      <div className="space-y-5 text-slate-800">
                        
                        {/* Report Header */}
                        <div className="p-4 bg-[#042C51] text-white rounded-xl flex items-center justify-between">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-[#FF5C28] tracking-wider block">SiBS Talent Acquisition</span>
                            <h2 className="text-sm font-black">Weekly Recruitment SLA & Execution Report</h2>
                            <p className="text-[10px] text-slate-300">Generated for {scopeWeek} • Confidential Management Report</p>
                          </div>
                          <span className="px-2.5 py-1 bg-[#FF5C28] text-white rounded font-mono font-bold text-[10px]">
                            {scopeWeek}
                          </span>
                        </div>

                        {/* Note Callout */}
                        {emailNote && (
                          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-[11px] font-medium">
                            <strong className="font-extrabold block text-amber-950 mb-0.5">Note from Sender:</strong>
                            {emailNote}
                          </div>
                        )}

                        {/* Executive Summary Cards */}
                        <div className="grid grid-cols-4 gap-2 text-center font-mono">
                          <div className="p-2 bg-slate-100 rounded-lg border border-slate-200">
                            <span className="text-[8px] font-black uppercase text-slate-400 block font-sans">Active Roles</span>
                            <span className="text-sm font-black text-[#042C51]">{filteredCurrentStatusRecords.length}</span>
                          </div>
                          <div className="p-2 bg-slate-100 rounded-lg border border-slate-200">
                            <span className="text-[8px] font-black uppercase text-slate-400 block font-sans">Required Hires</span>
                            <span className="text-sm font-black text-[#042C51]">
                              {filteredCurrentStatusRecords.reduce((s, r) => s + r.requiredHiring, 0)}
                            </span>
                          </div>
                          <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-200">
                            <span className="text-[8px] font-black uppercase text-emerald-600 block font-sans">Accepted</span>
                            <span className="text-sm font-black text-emerald-700">
                              {filteredCurrentStatusRecords.reduce((s, r) => s + r.accepted, 0)}
                            </span>
                          </div>
                          <div className="p-2 bg-slate-100 rounded-lg border border-slate-200">
                            <span className="text-[8px] font-black uppercase text-slate-400 block font-sans">Fill Rate</span>
                            <span className="text-sm font-black text-[#042C51]">
                              {filteredCurrentStatusRecords.reduce((s, r) => s + r.requiredHiring, 0) > 0
                                ? Math.round((filteredCurrentStatusRecords.reduce((s, r) => s + r.accepted, 0) / filteredCurrentStatusRecords.reduce((s, r) => s + r.requiredHiring, 0)) * 100)
                                : 0}%
                            </span>
                          </div>
                        </div>

                        {/* Section A Table */}
                        <section className="bg-white p-4 rounded-xl border border-[#E6ECF2] shadow-2xs space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-black text-[#042C51] flex items-center gap-2">
                              <span className="w-1.5 h-3 bg-[#FF5C28] rounded-sm"></span>
                              Section A: Weekly Performance Snapshot
                            </h4>
                            <span className="text-[9px] font-mono font-bold bg-[#E9F0FC] text-[#042C51] px-2 py-0.5 rounded-full border border-blue-200">
                              {filteredWeeklyRecords.length} Rows
                            </span>
                          </div>
                          <div className="overflow-x-auto border border-[#E6ECF2] rounded-lg">
                            <table className="w-full text-left border-collapse text-[9.5px] whitespace-nowrap">
                              <thead>
                                <tr className="border-b border-[#CBD5E1] bg-[#F8FAFC] text-[8.5px] uppercase text-[#042C51] font-black">
                                  <th className="py-2 px-2.5 border-r border-[#CBD5E1]">ROLE / ACCOUNT</th>
                                  <th className="py-2 px-2 border-r border-[#CBD5E1]">WEEK</th>
                                  <th className="py-2 px-1.5 text-center border-r border-[#CBD5E1]">STARTING</th>
                                  <th className="py-2 px-1.5 text-center border-r border-[#CBD5E1]">SOURCED</th>
                                  <th className="py-2 px-1.5 text-center border-r border-[#CBD5E1]">SCREENED</th>
                                  <th className="py-2 px-1.5 text-center border-r border-[#CBD5E1]">INTERVIEW</th>
                                  <th className="py-2 px-1.5 text-center border-r border-[#CBD5E1]">OFFERS</th>
                                  <th className="py-2 px-1.5 text-center border-r border-[#CBD5E1]">ACCEPTED</th>
                                  <th className="py-2 px-1.5 text-center border-r border-[#CBD5E1]">HIRED</th>
                                  <th className="py-2 px-1.5 text-center border-r border-[#CBD5E1]">DROP-OFFS</th>
                                  <th className="py-2 px-1.5 text-center border-r border-[#CBD5E1]">ENDING</th>
                                  <th className="py-2 px-1.5 text-center border-r border-[#CBD5E1]">TARGET</th>
                                  <th className="py-2 px-2 text-center border-r border-[#CBD5E1]">PROGRESS VS PLAN</th>
                                  <th className="py-2 px-2.5">KEY ISSUE</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-[#E6ECF2] text-slate-700 font-medium">
                                {filteredWeeklyRecords.map((r, i) => (
                                  <tr key={i} className="hover:bg-slate-50/80">
                                    <td className="py-1.5 px-2.5 border-r border-[#E6ECF2]">
                                      <p className="font-extrabold text-[#042C51]">{r.account}</p>
                                      <p className="text-[8.5px] text-slate-500 font-semibold">{r.role}</p>
                                    </td>
                                    <td className="py-1.5 px-2 font-mono text-[9px] text-slate-600 border-r border-[#E6ECF2]">{r.weekCovered.split("(")[0]}</td>
                                    <td className="py-1.5 px-1.5 text-center font-mono border-r border-[#E6ECF2]">{r.startingPipeline ?? '—'}</td>
                                    <td className="py-1.5 px-1.5 text-center font-mono border-r border-[#E6ECF2] text-blue-700 font-bold">+{r.newSourced ?? 0}</td>
                                    <td className="py-1.5 px-1.5 text-center font-mono border-r border-[#E6ECF2]">{r.screened ?? 0}</td>
                                    <td className="py-1.5 px-1.5 text-center font-mono border-r border-[#E6ECF2]">{r.interviewed ?? 0}</td>
                                    <td className="py-1.5 px-1.5 text-center font-mono border-r border-[#E6ECF2]">{r.offersExtended ?? 0}</td>
                                    <td className="py-1.5 px-1.5 text-center font-mono border-r border-[#E6ECF2] font-bold text-slate-800">{r.offersAccepted ?? 0}</td>
                                    <td className="py-1.5 px-1.5 text-center font-mono border-r border-[#E6ECF2] font-black text-emerald-700">{r.hired ?? 0}</td>
                                    <td className="py-1.5 px-1.5 text-center font-mono border-r border-[#E6ECF2] font-bold text-rose-600">-{r.dropOffs ?? 0}</td>
                                    <td className="py-1.5 px-1.5 text-center font-mono border-r border-[#E6ECF2] font-black text-[#042C51]">
                                      {r.hasHistoricalData ? (r.startingPipeline + r.newSourced - r.hired - r.dropOffs) : '—'}
                                    </td>
                                    <td className="py-1.5 px-1.5 text-center font-mono border-r border-[#E6ECF2] font-bold text-slate-600">{r.targetHires ?? '—'}</td>
                                    <td className="py-1.5 px-2 text-center font-mono text-[8.5px] border-r border-[#E6ECF2]">
                                      {r.hasHistoricalData ? (
                                        <span className="px-1.5 py-0.5 rounded font-black bg-amber-50 text-amber-800 border border-amber-200">
                                          Target: {r.targetHires}, Actual: {r.hired}
                                        </span>
                                      ) : (
                                        <span className="text-slate-400 italic">— No data</span>
                                      )}
                                    </td>
                                    <td className="py-1.5 px-2.5 text-slate-600 text-[9px] font-medium max-w-xs truncate" title={r.keyIssueLastWeek}>
                                      {r.keyIssueLastWeek || '—'}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </section>

                        {/* Section B Table */}
                        <section className="bg-white p-4 rounded-xl border border-[#E6ECF2] shadow-2xs space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-black text-[#042C51] flex items-center gap-2">
                              <span className="w-1.5 h-3 bg-[#FF5C28] rounded-sm"></span>
                              Section B: Current Account Hiring Status
                            </h4>
                            <span className="text-[9px] font-mono font-bold bg-[#E9F0FC] text-[#042C51] px-2 py-0.5 rounded-full border border-blue-200">
                              {filteredCurrentStatusRecords.length} Requisitions
                            </span>
                          </div>
                          <div className="overflow-x-auto border border-[#E6ECF2] rounded-lg">
                            <table className="w-full text-left border-collapse text-[9.5px] whitespace-nowrap">
                              <thead>
                                <tr className="border-b border-[#CBD5E1] bg-[#F8FAFC] text-[8.5px] uppercase text-[#042C51] font-black">
                                  <th className="py-2 px-2.5 border-r border-[#CBD5E1]">ROLE / ACCOUNT</th>
                                  <th className="py-2 px-2 border-r border-[#CBD5E1]">TA OWNER</th>
                                  <th className="py-2 px-2 text-center border-r border-[#CBD5E1]">TARGET</th>
                                  <th className="py-2 px-2 text-center border-r border-[#CBD5E1]">ACCEPTED</th>
                                  <th className="py-2 px-2 text-center border-r border-[#CBD5E1]">FILL RATE</th>
                                  <th className="py-2 px-2 border-r border-[#CBD5E1]">STATUS / RISK</th>
                                  <th className="py-2 px-2.5">LATEST STATUS NOTES</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-[#E6ECF2] text-slate-700 font-medium">
                                {filteredCurrentStatusRecords.map((r, i) => {
                                  const rate = r.requiredHiring > 0 ? Math.round((r.accepted / r.requiredHiring) * 100) : 0;
                                  return (
                                    <tr key={i} className="hover:bg-slate-50/80">
                                      <td className="py-1.5 px-2.5 border-r border-[#E6ECF2]">
                                        <p className="font-extrabold text-[#042C51]">{r.account}</p>
                                        <p className="text-[8.5px] text-slate-500 font-semibold">{r.role}</p>
                                      </td>
                                      <td className="py-1.5 px-2 font-semibold text-slate-700 border-r border-[#E6ECF2]">{r.taOwner}</td>
                                      <td className="py-1.5 px-2 text-center font-mono font-bold border-r border-[#E6ECF2]">{r.requiredHiring}</td>
                                      <td className="py-1.5 px-2 text-center font-mono font-bold text-emerald-600 border-r border-[#E6ECF2]">{r.accepted}</td>
                                      <td className="py-1.5 px-2 text-center font-mono font-black text-[#042C51] border-r border-[#E6ECF2]">{rate}%</td>
                                      <td className="py-1.5 px-2 border-r border-[#E6ECF2]">
                                        {r.atRisk ? (
                                          <span className="px-1.5 py-0.5 bg-rose-50 text-rose-800 border border-rose-200 rounded font-bold text-[8.5px]">
                                            AT RISK ({r.reason || 'Gap'})
                                          </span>
                                        ) : (
                                          <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded font-bold text-[8.5px]">
                                            ON TRACK
                                          </span>
                                        )}
                                      </td>
                                      <td className="py-1.5 px-2.5 text-slate-600 text-[9px] font-medium max-w-xs truncate" title={r.latestStatusNotes}>
                                        {r.latestStatusNotes || '—'}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </section>

                        {/* Section C Table */}
                        <section className="bg-white p-4 rounded-xl border border-[#E6ECF2] shadow-2xs space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-black text-[#042C51] flex items-center gap-2">
                              <span className="w-1.5 h-3 bg-[#FF5C28] rounded-sm"></span>
                              Section C: Action Items — JIT Delivery Focus
                            </h4>
                            <span className="text-[9px] font-mono font-bold bg-[#E9F0FC] text-[#042C51] px-2 py-0.5 rounded-full border border-blue-200">
                              {filteredActionItems.length} Actions
                            </span>
                          </div>
                          <div className="overflow-x-auto border border-[#E6ECF2] rounded-lg">
                            <table className="w-full text-left border-collapse text-[9.5px] whitespace-nowrap">
                              <thead>
                                <tr className="border-b border-[#CBD5E1] bg-[#F8FAFC] text-[8.5px] uppercase text-[#042C51] font-black">
                                  <th className="py-2 px-2 border-r border-[#CBD5E1]">ID</th>
                                  <th className="py-2 px-2.5 border-r border-[#CBD5E1]">ACTION ITEM</th>
                                  <th className="py-2 px-2.5 border-r border-[#CBD5E1]">ROLE & ACCOUNT</th>
                                  <th className="py-2 px-2 border-r border-[#CBD5E1]">OWNER</th>
                                  <th className="py-2 px-2 border-r border-[#CBD5E1]">DEADLINE</th>
                                  <th className="py-2 px-2 border-r border-[#CBD5E1]">RISK</th>
                                  <th className="py-2 px-2 border-r border-[#CBD5E1]">STATUS</th>
                                  <th className="py-2 px-2.5">GAP / REMARKS</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-[#E6ECF2] text-slate-700 font-medium">
                                {filteredActionItems.map((a, i) => (
                                  <tr key={i} className="hover:bg-slate-50/80">
                                    <td className="py-1.5 px-2 font-mono font-bold text-[#042C51] border-r border-[#E6ECF2]">{a.id}</td>
                                    <td className="py-1.5 px-2.5 font-semibold text-slate-800 border-r border-[#E6ECF2]">{a.description}</td>
                                    <td className="py-1.5 px-2.5 border-r border-[#E6ECF2]">
                                      <p className="font-extrabold text-[#042C51]">{a.account}</p>
                                      <p className="text-[8.5px] text-slate-500 font-semibold">{a.role}</p>
                                    </td>
                                    <td className="py-1.5 px-2 font-semibold text-slate-700 border-r border-[#E6ECF2]">{a.owner}</td>
                                    <td className="py-1.5 px-2 font-mono text-slate-700 border-r border-[#E6ECF2]">{a.deadline}</td>
                                    <td className="py-1.5 px-2 border-r border-[#E6ECF2]">
                                      <span className={`px-1.5 py-0.5 rounded font-bold text-[8.5px] ${
                                        a.risk === 'High' ? 'bg-rose-50 text-rose-800 border border-rose-200' : 'bg-slate-100 text-slate-700 border border-slate-200'
                                      }`}>
                                        {a.risk}
                                      </span>
                                    </td>
                                    <td className="py-1.5 px-2 font-bold text-[#042C51] border-r border-[#E6ECF2]">{a.status}</td>
                                    <td className="py-1.5 px-2.5 text-slate-600 text-[9px] font-medium max-w-xs truncate" title={`${a.gap} ${a.notes ? '— ' + a.notes : ''}`}>
                                      {a.gap}{a.notes ? ' — ' + a.notes : ''}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </section>

                      </div>
                    ) : (
                      <pre className="text-[10px] font-mono bg-slate-900 text-emerald-400 p-4 rounded-xl overflow-x-auto whitespace-pre-wrap leading-relaxed select-all">
                        {generatePlainTextReport()}
                      </pre>
                    )}
                  </div>

                </div>

              </div>

              {/* Modal Footer */}
              <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex justify-between items-center text-xs">
                <span className="text-[10px] text-slate-500 font-medium">
                  Report dynamically filtered by {filteredWeeklyRecords.length} weekly records, {filteredCurrentStatusRecords.length} status rows, and {filteredActionItems.length} action items.
                </span>
                <button
                  type="button"
                  onClick={() => setIsEmailModalOpen(false)}
                  className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-lg cursor-pointer transition-colors"
                >
                  Close
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================== ADD WEEKLY PERFORMANCE MODAL ==================== */}
      <AnimatePresence>
        {isAddWeeklyModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden my-8"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 bg-[#042C51] text-white flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#FF5C28]"></span>
                    Add Weekly Performance Snapshot Record
                  </h3>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Log sprint delivery metrics and candidate movement for a role / account.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddWeeklyModalOpen(false)}
                  className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleAddWeeklyRecord} className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Account Name *</label>
                    <input
                      type="text"
                      required
                      value={newWeeklyForm.account}
                      onChange={(e) => setNewWeeklyForm({ ...newWeeklyForm, account: e.target.value })}
                      placeholder="e.g. Elevance Health"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#042C51]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Role Title *</label>
                    <input
                      type="text"
                      required
                      value={newWeeklyForm.role}
                      onChange={(e) => setNewWeeklyForm({ ...newWeeklyForm, role: e.target.value })}
                      placeholder="e.g. Healthcare Support Specialist"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#042C51]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Cluster</label>
                    <input
                      type="text"
                      value={newWeeklyForm.cluster}
                      onChange={(e) => setNewWeeklyForm({ ...newWeeklyForm, cluster: e.target.value })}
                      placeholder="e.g. Healthcare & Ins."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#042C51]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Week Covered</label>
                  <input
                    type="text"
                    value={newWeeklyForm.weekCovered}
                    onChange={(e) => setNewWeeklyForm({ ...newWeeklyForm, weekCovered: e.target.value })}
                    placeholder="e.g. Week 33 (Aug 10 - Aug 16, 2026)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#042C51]"
                  />
                </div>

                {/* Candidate Funnel Metrics */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <h4 className="text-[11px] font-extrabold text-[#042C51] uppercase tracking-wider">Candidate Movement Funnel</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 mb-0.5">Starting Pipeline</label>
                      <input
                        type="number"
                        min="0"
                        value={newWeeklyForm.startingPipeline}
                        onChange={(e) => setNewWeeklyForm({ ...newWeeklyForm, startingPipeline: parseInt(e.target.value) || 0 })}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-mono text-xs text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 mb-0.5">New Sourced</label>
                      <input
                        type="number"
                        min="0"
                        value={newWeeklyForm.newSourced}
                        onChange={(e) => setNewWeeklyForm({ ...newWeeklyForm, newSourced: parseInt(e.target.value) || 0 })}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-mono text-xs text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 mb-0.5">Screened</label>
                      <input
                        type="number"
                        min="0"
                        value={newWeeklyForm.screened}
                        onChange={(e) => setNewWeeklyForm({ ...newWeeklyForm, screened: parseInt(e.target.value) || 0 })}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-mono text-xs text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 mb-0.5">Interviewed</label>
                      <input
                        type="number"
                        min="0"
                        value={newWeeklyForm.interviewed}
                        onChange={(e) => setNewWeeklyForm({ ...newWeeklyForm, interviewed: parseInt(e.target.value) || 0 })}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-mono text-xs text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 mb-0.5">Offers Extended</label>
                      <input
                        type="number"
                        min="0"
                        value={newWeeklyForm.offers}
                        onChange={(e) => setNewWeeklyForm({ ...newWeeklyForm, offers: parseInt(e.target.value) || 0 })}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-mono text-xs text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 mb-0.5">Offers Accepted</label>
                      <input
                        type="number"
                        min="0"
                        value={newWeeklyForm.accepted}
                        onChange={(e) => setNewWeeklyForm({ ...newWeeklyForm, accepted: parseInt(e.target.value) || 0 })}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-mono text-xs text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-emerald-700 mb-0.5">Hired</label>
                      <input
                        type="number"
                        min="0"
                        value={newWeeklyForm.hired}
                        onChange={(e) => setNewWeeklyForm({ ...newWeeklyForm, hired: parseInt(e.target.value) || 0 })}
                        className="w-full bg-white border border-emerald-300 rounded-lg px-2.5 py-1.5 font-mono text-xs font-bold text-emerald-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-rose-600 mb-0.5">Drop-offs</label>
                      <input
                        type="number"
                        min="0"
                        value={newWeeklyForm.dropOffs}
                        onChange={(e) => setNewWeeklyForm({ ...newWeeklyForm, dropOffs: parseInt(e.target.value) || 0 })}
                        className="w-full bg-white border border-rose-200 rounded-lg px-2.5 py-1.5 font-mono text-xs font-bold text-rose-700"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Target Hires</label>
                    <input
                      type="number"
                      min="0"
                      value={newWeeklyForm.targetHires}
                      onChange={(e) => setNewWeeklyForm({ ...newWeeklyForm, targetHires: parseInt(e.target.value) || 0 })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Key Issue Last Week</label>
                    <input
                      type="text"
                      value={newWeeklyForm.keyIssueLastWeek}
                      onChange={(e) => setNewWeeklyForm({ ...newWeeklyForm, keyIssueLastWeek: e.target.value })}
                      placeholder="e.g. Delays in background check verification"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800"
                    />
                  </div>
                </div>

                {/* Form Action Buttons */}
                <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddWeeklyModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#FF5C28] hover:bg-[#E04B1D] text-white font-black text-xs rounded-xl transition-all shadow-sm hover:shadow cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    Save Weekly Record
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
