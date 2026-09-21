import React, { useState, useMemo, useRef } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  FileSpreadsheet, 
  Sparkles,
  Bot,
  Send,
  CheckCircle, 
  CheckCircle2,
  AlertTriangle, 
  AlertCircle,
  Layers, 
  Eye, 
  PlusCircle, 
  Calendar,
  TrendingUp, 
  TrendingDown, 
  X, 
  ChevronRight,
  Info,
  Clock,
  Briefcase,
  BarChart2,
  User,
  Users,
  Flag,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  Download,
  BookOpen,
  Workflow,
  Code,
  Database,
  Network,
  Cpu,
  ShieldAlert,
  GitBranch,
  Terminal,
  Sliders,
  Settings,
  ChevronDown
} from "lucide-react";
import { 
  PlanStatus, 
  ActionItemStatus, 
  RiskLevel, 
  WorkforcePlan,
  DetailRecord
} from "../types";
import { INITIAL_DETAIL_RECORDS } from "../data";
import PipelineStageDropChart from "./PipelineStageDropChart";
import LeadsToInterviewTrendChart from "./LeadsToInterviewTrendChart";
import HiringRateTrendChart from "./HiringRateTrendChart";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine
} from "recharts";

interface PlanSectionProps {
  plans: WorkforcePlan[];
  activeCluster: string;
  activeAccount: string;
  onViewPlan: (plan: WorkforcePlan) => void;
  onEditPlan?: (plan: WorkforcePlan) => void;
  onAddActionItem?: (planId: string) => void;
  onCreatePlan: (newPlan: Omit<WorkforcePlan, "id" | "actionItems" | "activityHistory" | "createdAt" | "updatedAt">) => void;
}

// Interface for 6-Week Forecast Data Row
interface ForecastWeekData {
  id: string;
  weekLabel: string;
  dateRange: string;
  requiredHC: number;
  actualHC: number;
  absenteeismCount: number;
  absenteeismPct: number;
  attritionCount: number;
  attritionPct: number;
  acceptedJO: number;
  nho: number;
  fst: number;
  pst: number;
  goLive: number;
  hiringRatePct: number;
}

export default function PlanSection({
  plans,
  activeCluster,
  activeAccount,
  onViewPlan,
  onAddActionItem,
  onCreatePlan
}: PlanSectionProps) {
  // Versioning & Scope Controls
  const [selectedVersion, setSelectedVersion] = useState("2024 - Week 20 | May 13 - May 19");
  const [selectedCluster, setSelectedCluster] = useState("All");
  const [selectedAccount, setSelectedAccount] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [isArchitectureModalOpen, setIsArchitectureModalOpen] = useState(false);
  const [activeArchTab, setActiveArchTab] = useState<"process" | "relationships" | "api" | "formulas" | "filters" | "audit">("process");
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isKpiModalOpen, setIsKpiModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isViewPlanModalOpen, setIsViewPlanModalOpen] = useState(false);
  const [selectedWeekDetails, setSelectedWeekDetails] = useState<ForecastWeekData | null>(null);
  const [modalSearchQuery, setModalSearchQuery] = useState("");

  // Filtered account/cluster detail records for the Forecast Week modal
  const filteredModalRecords = useMemo(() => {
    return INITIAL_DETAIL_RECORDS.filter(r => {
      const matchCluster = selectedCluster === "All" || r.cluster === selectedCluster;
      const matchAccount = selectedAccount === "All" || r.account === selectedAccount;
      const matchSearch = !modalSearchQuery.trim() || 
        r.account.toLowerCase().includes(modalSearchQuery.toLowerCase()) || 
        r.cluster.toLowerCase().includes(modalSearchQuery.toLowerCase());
      return matchCluster && matchAccount && matchSearch;
    });
  }, [selectedCluster, selectedAccount, modalSearchQuery]);
  
  // Action Item Setup Modal
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [actionForm, setActionForm] = useState({
    title: "",
    targetAccount: "Verizon Tech",
    assignee: "Sarah Jenkins (WFM Principal)",
    priority: "High" as "High" | "Medium" | "Low",
    targetDate: "2026-08-15"
  });

  // Status Modal Feedback
  const [statusModal, setStatusModal] = useState<{
    isOpen: boolean;
    type: "success" | "warning" | "error";
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: "success",
    title: "",
    message: ""
  });

  // Graph Series Active Toggles
  const [activeSeries, setActiveSeries] = useState({
    required: true,
    actual: true,
    absenteeism: true,
    attrition: true
  });

  // AI Modal Interactive Chat State
  const [aiChatInput, setAiChatInput] = useState("");
  const [aiMessages, setAiMessages] = useState<Array<{ sender: "ai" | "user"; text: string; time: string }>>([
    {
      sender: "ai",
      text: "Hello! I am your SiBS AI Workforce Intelligence Advisor. I have analyzed your 6-Week Forecast Headcount Plan for Week 20 - Week 25. Noticeable capacity risks exist in Telecom & Tech (Account: Verizon Tech & Comcast Core) due to an upcoming 12.4% attrition spike in Week 22. How can I assist you with scenario planning today?",
      time: "Just now"
    }
  ]);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const showStatus = (type: "success" | "warning" | "error", title: string, message: string) => {
    setStatusModal({ isOpen: true, type, title, message });
  };

  // Drag-to-Scroll refs and handlers for Table 1 (Forecast Plan)
  const table1Ref = useRef<HTMLDivElement>(null);
  const [isMouseDown1, setIsMouseDown1] = useState(false);
  const [startX1, setStartX1] = useState(0);
  const [scrollLeft1, setScrollLeft1] = useState(0);

  const handleMouseDown1 = (e: React.MouseEvent) => {
    if (!table1Ref.current) return;
    setIsMouseDown1(true);
    setStartX1(e.pageX - table1Ref.current.offsetLeft);
    setScrollLeft1(table1Ref.current.scrollLeft);
  };
  const handleMouseLeave1 = () => setIsMouseDown1(false);
  const handleMouseUp1 = () => setIsMouseDown1(false);
  const handleMouseMove1 = (e: React.MouseEvent) => {
    if (!isMouseDown1 || !table1Ref.current) return;
    e.preventDefault();
    const x = e.pageX - table1Ref.current.offsetLeft;
    const walk = (x - startX1) * 1.5;
    table1Ref.current.scrollLeft = scrollLeft1 - walk;
  };

  // Drag-to-Scroll refs and handlers for Table 2 (Accounts Plan)
  const table2Ref = useRef<HTMLDivElement>(null);
  const [isMouseDown2, setIsMouseDown2] = useState(false);
  const [startX2, setStartX2] = useState(0);
  const [scrollLeft2, setScrollLeft2] = useState(0);

  const handleMouseDown2 = (e: React.MouseEvent) => {
    if (!table2Ref.current) return;
    setIsMouseDown2(true);
    setStartX2(e.pageX - table2Ref.current.offsetLeft);
    setScrollLeft2(table2Ref.current.scrollLeft);
  };
  const handleMouseLeave2 = () => setIsMouseDown2(false);
  const handleMouseUp2 = () => setIsMouseDown2(false);
  const handleMouseMove2 = (e: React.MouseEvent) => {
    if (!isMouseDown2 || !table2Ref.current) return;
    e.preventDefault();
    const x = e.pageX - table2Ref.current.offsetLeft;
    const walk = (x - startX2) * 1.5;
    table2Ref.current.scrollLeft = scrollLeft2 - walk;
  };

  // Mock 6-Week Forecast Horizon Data
  const forecastWeeks: ForecastWeekData[] = useMemo(() => {
    return [
      {
        id: "w20",
        weekLabel: "Week 20",
        dateRange: "May 13 - May 19, 2024",
        requiredHC: 1250,
        actualHC: 1180,
        absenteeismCount: 62,
        absenteeismPct: 5.25,
        attritionCount: 48,
        attritionPct: 4.07,
        acceptedJO: 145,
        nho: 130,
        fst: 115,
        pst: 102,
        goLive: 95,
        hiringRatePct: 65.5
      },
      {
        id: "w21",
        weekLabel: "Week 21",
        dateRange: "May 20 - May 26, 2024",
        requiredHC: 1280,
        actualHC: 1205,
        absenteeismCount: 68,
        absenteeismPct: 5.64,
        attritionCount: 52,
        attritionPct: 4.32,
        acceptedJO: 160,
        nho: 142,
        fst: 128,
        pst: 114,
        goLive: 105,
        hiringRatePct: 65.6
      },
      {
        id: "w22",
        weekLabel: "Week 22",
        dateRange: "May 27 - Jun 02, 2024",
        requiredHC: 1310,
        actualHC: 1210,
        absenteeismCount: 74,
        absenteeismPct: 6.12,
        attritionCount: 65,
        attritionPct: 5.37,
        acceptedJO: 180,
        nho: 158,
        fst: 140,
        pst: 122,
        goLive: 110,
        hiringRatePct: 61.1
      },
      {
        id: "w23",
        weekLabel: "Week 23",
        dateRange: "Jun 03 - Jun 09, 2024",
        requiredHC: 1350,
        actualHC: 1245,
        absenteeismCount: 71,
        absenteeismPct: 5.70,
        attritionCount: 58,
        attritionPct: 4.66,
        acceptedJO: 195,
        nho: 172,
        fst: 155,
        pst: 138,
        goLive: 125,
        hiringRatePct: 64.1
      },
      {
        id: "w24",
        weekLabel: "Week 24",
        dateRange: "Jun 10 - Jun 16, 2024",
        requiredHC: 1380,
        actualHC: 1290,
        absenteeismCount: 70,
        absenteeismPct: 5.43,
        attritionCount: 50,
        attritionPct: 3.88,
        acceptedJO: 210,
        nho: 188,
        fst: 168,
        pst: 150,
        goLive: 138,
        hiringRatePct: 65.7
      },
      {
        id: "w25",
        weekLabel: "Week 25",
        dateRange: "Jun 17 - Jun 23, 2024",
        requiredHC: 1400,
        actualHC: 1340,
        absenteeismCount: 65,
        absenteeismPct: 4.85,
        attritionCount: 45,
        attritionPct: 3.36,
        acceptedJO: 220,
        nho: 200,
        fst: 180,
        pst: 165,
        goLive: 152,
        hiringRatePct: 69.1
      }
    ];
  }, []);

  // Executive Summary Calculation for Top Metric Cards
  const topMetrics = useMemo(() => {
    const totalReq = forecastWeeks[0].requiredHC;
    const totalAct = forecastWeeks[0].actualHC;
    const abs = forecastWeeks[0].absenteeismCount;
    const att = forecastWeeks[0].attritionCount;
    const netAct = totalAct - abs - att;
    const bufferPct = Number((((netAct - totalReq) / totalReq) * 100).toFixed(1));
    const hiringNeeded = Math.max(0, totalReq - netAct);
    const hiredCount = forecastWeeks[0].goLive;
    const hiringRate = forecastWeeks[0].hiringRatePct;
    const targetLeads = Math.round(hiringNeeded / (hiringRate / 100));

    return {
      totalReq,
      totalAct,
      netAct,
      bufferPct,
      hiringNeeded,
      abs,
      att,
      hiredCount,
      targetLeads
    };
  }, [forecastWeeks]);

  // Summary calculation for Table 1 (6-Week Totals / Averages)
  const forecastSummary = useMemo(() => {
    const count = forecastWeeks.length;
    const reqSum = forecastWeeks.reduce((acc, w) => acc + w.requiredHC, 0);
    const actSum = forecastWeeks.reduce((acc, w) => acc + w.actualHC, 0);
    const absSum = forecastWeeks.reduce((acc, w) => acc + w.absenteeismCount, 0);
    const attSum = forecastWeeks.reduce((acc, w) => acc + w.attritionCount, 0);

    const netActSum = forecastWeeks.reduce((acc, w) => {
      const net = w.actualHC - w.absenteeismCount - w.attritionCount;
      return acc + net;
    }, 0);

    const hiringNeededSum = forecastWeeks.reduce((acc, w) => {
      const net = w.actualHC - w.absenteeismCount - w.attritionCount;
      return acc + Math.max(0, w.requiredHC - net);
    }, 0);

    const accJOSum = forecastWeeks.reduce((acc, w) => acc + w.acceptedJO, 0);
    const nhoSum = forecastWeeks.reduce((acc, w) => acc + w.nho, 0);
    const fstSum = forecastWeeks.reduce((acc, w) => acc + w.fst, 0);
    const pstSum = forecastWeeks.reduce((acc, w) => acc + w.pst, 0);
    const goLiveSum = forecastWeeks.reduce((acc, w) => acc + w.goLive, 0);

    const avgReq = Math.round(reqSum / count);
    const avgAct = Math.round(actSum / count);
    const avgNetAct = Math.round(netActSum / count);
    const avgBuffer = avgReq > 0 ? Number((((avgNetAct - avgReq) / avgReq) * 100).toFixed(2)) : 0;
    const avgAbsPct = avgAct > 0 ? Number((((absSum / count) / avgAct) * 100).toFixed(2)) : 0;
    const avgAttPct = avgAct > 0 ? Number((((attSum / count) / avgAct) * 100).toFixed(2)) : 0;
    const avgHiringRate = Number((forecastWeeks.reduce((acc, w) => acc + w.hiringRatePct, 0) / count).toFixed(1));
    const totalLeadsNeeded = Math.round(hiringNeededSum / (avgHiringRate / 100));

    return {
      avgReq,
      avgAct,
      avgNetAct,
      avgBuffer,
      hiringNeededSum,
      absSum,
      avgAbsPct,
      attSum,
      avgAttPct,
      accJOSum,
      nhoSum,
      fstSum,
      pstSum,
      goLiveSum,
      avgHiringRate,
      totalLeadsNeeded
    };
  }, [forecastWeeks]);

  // Filter Account Plans for Table 2
  const filteredPlans = useMemo(() => {
    return plans.filter(p => {
      if (activeCluster !== "All Clusters" && p.cluster !== activeCluster) return false;
      if (activeAccount !== "All Accounts" && p.account !== activeAccount) return false;
      if (selectedCluster !== "All" && p.cluster !== selectedCluster) return false;
      if (selectedAccount !== "All" && p.account !== selectedAccount) return false;

      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        return (
          p.account.toLowerCase().includes(query) ||
          p.cluster.toLowerCase().includes(query) ||
          p.owner.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [plans, activeCluster, activeAccount, selectedCluster, selectedAccount, searchQuery]);

  // Summary totals for Table 2 (Details by Cluster / Account)
  const accountsSummary = useMemo(() => {
    const count = filteredPlans.length;
    if (count === 0) {
      return {
        requiredHC: 0,
        actualHC: 0,
        bufferPct: 0,
        netActualHC: 0,
        hiringNeeded: 0,
        absenteeism6Wks: 0,
        absenteeismRatePct: 0,
        attrition6Wks: 0,
        attritionRatePct: 0,
        acceptedJO: 0,
        nho: 0,
        fst: 0,
        pst: 0,
        goLive: 0,
        hiredCount: 0,
        hiringRatePct: 0,
        leadsNeeded: 0
      };
    }

    const req = filteredPlans.reduce((s, p) => s + p.requiredHeadcount, 0);
    const act = filteredPlans.reduce((s, p) => s + p.actualHeadcount, 0);
    const abs6Wks = filteredPlans.reduce((s, p) => s + (p.kpiSnapshot.absenteeismCount * 6), 0);
    const att6Wks = filteredPlans.reduce((s, p) => s + (p.kpiSnapshot.attritionCount * 6), 0);

    const netAct = filteredPlans.reduce((s, p) => {
      const net = p.actualHeadcount - p.kpiSnapshot.absenteeismCount - p.kpiSnapshot.attritionCount;
      return s + net;
    }, 0);

    const hireNeed = filteredPlans.reduce((s, p) => s + p.hiringNeeded, 0);
    const accJO = filteredPlans.reduce((s, p) => s + p.kpiSnapshot.acceptedJO, 0);
    const nho = filteredPlans.reduce((s, p) => s + p.kpiSnapshot.nho, 0);
    const fst = filteredPlans.reduce((s, p) => s + p.kpiSnapshot.fst, 0);
    const pst = filteredPlans.reduce((s, p) => s + p.kpiSnapshot.pst, 0);
    const goLive = filteredPlans.reduce((s, p) => s + p.kpiSnapshot.goLive, 0);
    const hired = filteredPlans.reduce((s, p) => s + p.hiredCount, 0);
    const leads = filteredPlans.reduce((s, p) => s + p.leadsNeeded, 0);

    const bufPct = req > 0 ? Number((((netAct - req) / req) * 100).toFixed(2)) : 0;
    const absRate = act > 0 ? Number((((abs6Wks / 6) / act) * 100).toFixed(2)) : 0;
    const attRate = act > 0 ? Number((((att6Wks / 6) / act) * 100).toFixed(2)) : 0;
    const avgHireRate = Number((filteredPlans.reduce((s, p) => s + p.hiringRate, 0) / count).toFixed(1));

    return {
      requiredHC: req,
      actualHC: act,
      bufferPct: bufPct,
      netActualHC: netAct,
      hiringNeeded: hireNeed,
      absenteeism6Wks: abs6Wks,
      absenteeismRatePct: absRate,
      attrition6Wks: att6Wks,
      attritionRatePct: attRate,
      acceptedJO: accJO,
      nho,
      fst,
      pst,
      goLive,
      hiredCount: hired,
      hiringRatePct: avgHireRate,
      leadsNeeded: leads
    };
  }, [filteredPlans]);

  // Create Plan Form Handler
  const [newCluster, setNewCluster] = useState("Telecom & Tech");
  const [newAccount, setNewAccount] = useState("");
  const [newPeriod, setNewPeriod] = useState("Q3 2026 Ramp");
  const [newReq, setNewReq] = useState(400);
  const [newAct, setNewAct] = useState(380);
  const [newHired, setNewHired] = useState(15);
  const [newHiringRate, setNewHiringRate] = useState(65);

  const handleSubmitPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccount.trim()) {
      alert("Please specify a valid Account Name.");
      return;
    }

    const hiringNeeded = Math.max(0, newReq - newAct);
    const leadsNeeded = Math.round(hiringNeeded / (newHiringRate / 100));

    onCreatePlan({
      cluster: newCluster,
      account: newAccount,
      planPeriod: newPeriod,
      requiredHeadcount: newReq,
      actualHeadcount: newAct,
      hiredCount: newHired,
      hiringNeeded,
      hiringRate: newHiringRate,
      leadsNeeded,
      interviewCount: Math.round(leadsNeeded * 0.8),
      fstCount: Math.round(leadsNeeded * 0.5),
      status: PlanStatus.Draft,
      owner: "Sarah Jenkins (WFM Principal)",
      approvedBy: "Pending Operations Review",
      kpiSnapshot: {
        bufferPercentage: parseFloat((((newAct - newReq) / newReq) * 100).toFixed(1)),
        absenteeismCount: Math.round(newAct * 0.08),
        absenteeismPercentage: 8.0,
        attritionCount: Math.round(newAct * 0.04),
        attritionPercentage: 4.0,
        acceptedJO: Math.round(hiringNeeded * 1.2),
        nho: Math.round(hiringNeeded * 1.1),
        fst: Math.round(hiringNeeded * 0.95),
        pst: Math.round(hiringNeeded * 0.85),
        goLive: Math.round(hiringNeeded * 0.8),
        hiredCount: newHired,
        hiringRate: newHiringRate
      },
      pipeline: {
        acceptedJO: Math.round(hiringNeeded * 1.2),
        nho: Math.round(hiringNeeded * 1.1),
        fst: Math.round(hiringNeeded * 0.95),
        pst: Math.round(hiringNeeded * 0.85),
        goLive: Math.round(hiringNeeded * 0.8),
        dropOffs: {
          joToNho: Math.round(hiringNeeded * 0.1),
          nhoToFst: Math.round(hiringNeeded * 0.15),
          fstToPst: Math.round(hiringNeeded * 0.1),
          nhoToPst: Math.round(hiringNeeded * 0.25),
          pstToGoLive: Math.round(hiringNeeded * 0.05)
        }
      }
    });

    setIsCreating(false);
    setNewAccount("");
    showStatus("success", "Workforce Hiring Plan Draft Created", `Draft plan initialized for ${newAccount} under ${newCluster}.`);
  };

  // Action Item Setup Form Handler
  const handleCreateActionItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actionForm.title.trim()) return;

    setIsActionModalOpen(false);
    showStatus(
      "success",
      "Operational Action Item Assigned",
      `Task "${actionForm.title}" assigned to ${actionForm.assignee} for ${actionForm.targetAccount}.`
    );
    setActionForm({
      title: "",
      targetAccount: "Verizon Tech",
      assignee: "Sarah Jenkins (WFM Principal)",
      priority: "High",
      targetDate: "2026-08-15"
    });
  };

  // AI Chat send message
  const handleSendAiMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiChatInput.trim()) return;

    const userText = aiChatInput;
    setAiMessages(prev => [...prev, { sender: "user", text: userText, time: "Just now" }]);
    setAiChatInput("");

    setTimeout(() => {
      let responseText = "Based on current WFM telemetry, adjusting the FST training start date for Week 22 by 5 days allows 18 additional candidates to pass background checks, reducing the net deficit from 192 to 14 slots.";
      if (userText.toLowerCase().includes("telecom") || userText.toLowerCase().includes("verizon")) {
        responseText = "For Telecom & Tech (Verizon), I recommend opening an accelerated 25-agent FST batch on May 20 (Week 21) to offset the predicted Week 22 spike in attrition.";
      } else if (userText.toLowerCase().includes("batch") || userText.toLowerCase().includes("class")) {
        responseText = "To maximize training yield, schedule NHO on Mondays, FST on Wednesdays, and PST on the following Monday. This schedule historically reduces drop-off by 8.4%.";
      }

      setAiMessages(prev => [...prev, { sender: "ai", text: responseText, time: "Just now" }]);
    }, 600);
  };

  return (
    <div className="space-y-6 min-w-0 max-w-full overflow-x-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#042C51] text-white px-4 py-3 rounded-xl shadow-2xl border border-[#E6ECF2] flex items-center gap-2 animate-bounce">
          <CheckCircle className="w-5 h-5 text-[#2ECC71]" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* ==================== TOP COMMAND & VERSIONING CONTROL BAR ==================== */}
      <div className="bg-white p-4.5 rounded-2xl border border-[#E6ECF2] shadow-sm flex flex-col xl:flex-row xl:items-center justify-between gap-4 select-none min-w-0">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-4 bg-[#FF5C28] rounded-sm"></span>
            <h2 className="text-sm font-black text-[#042C51] tracking-wider uppercase">
              Workforce & Hiring Plan (Operational Capacity & Forecasting)
            </h2>
            <span className="px-2.5 py-0.5 text-[10px] font-extrabold bg-[#E9F0FC] text-[#042C51] rounded-full border border-blue-200">
              Workforce Control Center
            </span>
          </div>
          <p className="text-xs text-[#667085] mt-1">
            Weekly forecasting matrix, batch scheduling, account capacity limits, and AI-assisted scenario modeling.
          </p>
        </div>

        {/* Scope Controls & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Weekly Version Selector */}
          <div className="flex items-center gap-1.5 bg-[#F1F5F9] px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-[#042C51]">
            <Calendar className="w-3.5 h-3.5 text-[#FF5C28]" />
            <span>Version:</span>
            <select
              value={selectedVersion}
              onChange={e => setSelectedVersion(e.target.value)}
              className="bg-transparent font-extrabold focus:outline-none cursor-pointer"
            >
              <option value="2024 - Week 20 | May 13 - May 19">2024 - Week 20 | May 13 - May 19</option>
              <option value="2024 - Week 21 | May 20 - May 26">2024 - Week 21 | May 20 - May 26</option>
              <option value="2024 - Week 22 | May 27 - Jun 02">2024 - Week 22 | May 27 - Jun 02</option>
              <option value="2024 - Week 23 | Jun 03 - Jun 09">2024 - Week 23 | Jun 03 - Jun 09</option>
            </select>
          </div>

          {/* Technical Specs & System Architecture Modal Trigger */}
          <button
            onClick={() => setIsArchitectureModalOpen(true)}
            className="px-3.5 py-2 text-xs font-black bg-[#042C51] hover:bg-[#063b6b] text-white rounded-xl shadow-md flex items-center gap-1.5 transition-all border border-[#063b6b]"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#7DD3FC]" />
            <span>System Specs & Architecture</span>
            <span className="px-1.5 py-0.5 text-[9px] font-black bg-[#FF5C28] text-white rounded">V2.4</span>
          </button>

          {/* AI Workforce Intelligence Advisor Trigger Button */}
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="px-3.5 py-2 text-xs font-black bg-gradient-to-r from-[#042C51] to-[#0A4B82] hover:opacity-95 text-white rounded-xl shadow-md flex items-center gap-1.5 transition-all border border-blue-400/30"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>Ask AI Insights</span>
          </button>

          {/* KPI Snapshot Modal Trigger Button */}
          <button
            onClick={() => setIsKpiModalOpen(true)}
            className="px-3 py-2 text-xs font-bold bg-[#E9F0FC] hover:bg-blue-100 text-[#042C51] rounded-xl flex items-center gap-1.5 border border-blue-200 transition-all"
          >
            <Info className="w-3.5 h-3.5 text-[#042C51]" />
            <span>KPI Snapshot</span>
          </button>

          {/* View Full Plan Details */}
          <button
            onClick={() => setIsViewPlanModalOpen(true)}
            className="px-3 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-[#042C51] rounded-xl flex items-center gap-1.5 border border-slate-200 transition-all"
          >
            <FileText className="w-3.5 h-3.5 text-[#042C51]" />
            <span>View Plan Details</span>
          </button>

          {/* Add Action Item Modal Trigger */}
          <button
            onClick={() => setIsActionModalOpen(true)}
            className="px-3 py-2 text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl flex items-center gap-1.5 border border-amber-200 transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>Add Action Item</span>
          </button>

          {/* Create Hiring Plan Button */}
          <button
            onClick={() => setIsCreating(true)}
            className="px-3.5 py-2 text-xs font-extrabold bg-[#FF5C28] hover:bg-[#e04f20] text-white rounded-xl shadow-md flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Plan</span>
          </button>
        </div>
      </div>

      {/* ==================== LIVE OPERATIONAL FORMULAS & WORKFLOW STRIP ==================== */}
      <div className="bg-[#042C51] text-white p-3 rounded-2xl border border-[#063b6b] shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <Code className="w-4 h-4 text-[#7DD3FC]" />
          <span className="font-extrabold tracking-wide uppercase text-[11px] text-[#7DD3FC]">Verified Formulas & Pipeline:</span>
          <span className="text-[11px] text-slate-200 font-mono bg-[#031B33] px-2 py-0.5 rounded border border-[#063b6b]" title="Net Actual HC = Actual HC - Absenteeism">Net HC = Actual - Abs</span>
          <span className="text-[11px] text-slate-200 font-mono bg-[#031B33] px-2 py-0.5 rounded border border-[#063b6b]" title="Buffer Cushion % = ((Net Actual - Required) / Required) * 100">Buffer % = ((Net - Req)/Req)*100</span>
          <span className="text-[11px] text-slate-200 font-mono bg-[#031B33] px-2 py-0.5 rounded border border-[#063b6b]" title="Hiring Needed = Math.max(0, Required - Net Actual)">Hiring Needed = Math.max(0, Req - Net)</span>
          <span className="text-[11px] text-emerald-300 font-mono bg-[#031B33] px-2 py-0.5 rounded border border-[#063b6b]" title="5 Training Milestones">JO ➔ NHO ➔ FST ➔ PST ➔ Go Live</span>
        </div>
        <button
          onClick={() => setIsArchitectureModalOpen(true)}
          className="text-[10px] font-extrabold text-[#7DD3FC] hover:text-white flex items-center gap-1 underline transition-colors"
        >
          <span>Open Full Technical Review & API Contracts</span>
          <ChevronRight className="w-3.5 h-3.5 text-[#FF5C28]" />
        </button>
      </div>

      {/* ==================== 3. EXECUTIVE KPI SUMMARY CARDS ==================== */}
      {/* Component: ForecastWorkforceHiringOverview */}
      <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 2xl:grid-cols-9 gap-3 min-w-0">
        {/* Required Headcount */}
        <div className="bg-white p-3.5 rounded-2xl border border-[#E6ECF2] shadow-xs flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Required HC</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-lg font-black text-[#042C51] font-mono">{topMetrics.totalReq.toLocaleString()}</span>
            <span className="px-1.5 py-0.5 text-[9px] font-bold bg-blue-50 text-blue-700 rounded border border-blue-100">
              Contract
            </span>
          </div>
        </div>

        {/* Actual Headcount */}
        <div className="bg-white p-3.5 rounded-2xl border border-[#E6ECF2] shadow-xs flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Actual HC</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-lg font-black text-slate-800 font-mono">{topMetrics.totalAct.toLocaleString()}</span>
            <span className="px-1.5 py-0.5 text-[9px] font-bold bg-slate-100 text-slate-600 rounded">
              Active
            </span>
          </div>
        </div>

        {/* Net Actual HC */}
        <div className="bg-white p-3.5 rounded-2xl border border-[#E6ECF2] shadow-xs flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Net Actual HC</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-lg font-black text-[#042C51] font-mono">{topMetrics.netAct.toLocaleString()}</span>
            <span className="px-1.5 py-0.5 text-[9px] font-bold bg-navy-900 bg-[#042C51] text-white rounded">
              Effective
            </span>
          </div>
        </div>

        {/* Buffer % */}
        <div className="bg-white p-3.5 rounded-2xl border border-[#E6ECF2] shadow-xs flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Buffer %</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className={`text-lg font-black font-mono ${topMetrics.bufferPct < 0 ? "text-[#E74C3C]" : "text-[#2ECC71]"}`}>
              {topMetrics.bufferPct}%
            </span>
            <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded ${topMetrics.bufferPct < 0 ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"}`}>
              {topMetrics.bufferPct < 0 ? "Deficit" : "Surplus"}
            </span>
          </div>
        </div>

        {/* Hiring Needed */}
        <div className="bg-white p-3.5 rounded-2xl border border-[#E6ECF2] shadow-xs flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Hiring Needed</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-lg font-black text-[#E74C3C] font-mono">{topMetrics.hiringNeeded}</span>
            <span className="px-1.5 py-0.5 text-[9px] font-bold bg-rose-100 text-rose-800 rounded">
              Open Gap
            </span>
          </div>
        </div>

        {/* Absenteeism */}
        <div className="bg-white p-3.5 rounded-2xl border border-[#E6ECF2] shadow-xs flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Absenteeism</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-lg font-black text-blue-600 font-mono">{topMetrics.abs}</span>
            <span className="text-[10px] font-semibold text-slate-400">5.25%</span>
          </div>
        </div>

        {/* Attrition */}
        <div className="bg-white p-3.5 rounded-2xl border border-[#E6ECF2] shadow-xs flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Attrition</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-lg font-black text-rose-600 font-mono">{topMetrics.att}</span>
            <span className="text-[10px] font-semibold text-slate-400">4.07%</span>
          </div>
        </div>

        {/* Hired Count */}
        <div className="bg-white p-3.5 rounded-2xl border border-[#E6ECF2] shadow-xs flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Hired Deployed</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-lg font-black text-emerald-600 font-mono">{topMetrics.hiredCount}</span>
            <span className="px-1.5 py-0.5 text-[9px] font-bold bg-emerald-50 text-emerald-700 rounded border border-emerald-100">
              Live
            </span>
          </div>
        </div>

        {/* Target Leads */}
        <div className="bg-white p-3.5 rounded-2xl border border-[#E6ECF2] shadow-xs flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Target Leads</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-lg font-black text-purple-700 font-mono">{topMetrics.targetLeads}</span>
            <span className="px-1.5 py-0.5 text-[9px] font-bold bg-purple-50 text-purple-700 rounded border border-purple-100">
              Sourcing
            </span>
          </div>
        </div>
      </section>

      {/* ==================== 6-WEEK PIPELINE & TREND HIGHLIGHTS CARDS ==================== */}
      <section className="space-y-4 select-none">
        {/* Top Row: Pipeline Flow (70%) + Attrition by Stage (30%) */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">
          {/* Card 1: Pipeline Flow – Total (6 Weeks) */}
          <div className="lg:col-span-7 bg-white p-4 rounded-2xl border border-[#E6ECF2] shadow-sm flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-[#042C51] text-white rounded-lg">
                  <Workflow className="w-4 h-4 text-[#7DD3FC]" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-[#042C51]">Pipeline Flow – Total (6 Weeks)</h4>
                  <p className="text-[10px] text-slate-400 font-medium">6-Week Cumulative Training Funnel</p>
                </div>
              </div>
              <span className="px-2 py-0.5 text-[9px] font-black bg-blue-50 text-blue-700 rounded-full border border-blue-100">
                270 JO
              </span>
            </div>

            <div className="py-1 overflow-x-auto">
              <PipelineStageDropChart
                hideCardWrapper={true}
                stages={[
                  { name: "Accepted", shortName: "Job Offer", count: 270, subtitle: "Accepted JO", color: "#042C51" },
                  { name: "NHO", shortName: "Count", count: 252, subtitle: "NHO Count", color: "#2563EB" },
                  { name: "FST", shortName: "Count", count: 230, subtitle: "FST Count", color: "#0D9488" },
                  { name: "PST", shortName: "Count", count: 210, subtitle: "PST Count", color: "#EA580C" },
                  { name: "Go Live", shortName: "Count", count: 192, subtitle: "Go Live", color: "#15803D" },
                ]}
              />
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-100">
              <span>Overall Conversion:</span>
              <strong className="text-[#FF5C28] font-mono font-black">71.1% (JO to Live)</strong>
            </div>
          </div>

          {/* Card 2: Attrition by Stage – Total (6 Weeks) */}
          <div className="lg:col-span-3 bg-white p-4 rounded-2xl border border-[#E6ECF2] shadow-sm flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-rose-50 text-rose-600 rounded-lg">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-[#042C51]">Attrition by Stage – Total (6 Weeks)</h4>
                  <p className="text-[10px] text-slate-400 font-medium">Stage Drop-off Loss Breakdown</p>
                </div>
              </div>
              <span className="px-2 py-0.5 text-[9px] font-black bg-rose-50 text-rose-700 rounded-full border border-rose-100">
                78 Losses
              </span>
            </div>

            <div className="space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between p-1 bg-slate-50 rounded border border-slate-100">
                <span className="font-semibold text-slate-600">JO ➔ NHO:</span>
                <span className="font-mono font-bold text-rose-600">18 candidates (6.7%)</span>
              </div>
              <div className="flex items-center justify-between p-1 bg-slate-50 rounded border border-slate-100">
                <span className="font-semibold text-slate-600">NHO ➔ FST:</span>
                <span className="font-mono font-bold text-rose-600">22 candidates (8.7%)</span>
              </div>
              <div className="flex items-center justify-between p-1 bg-slate-50 rounded border border-slate-100">
                <span className="font-semibold text-slate-600">FST ➔ PST:</span>
                <span className="font-mono font-bold text-rose-600">20 candidates (8.7%)</span>
              </div>
              <div className="flex items-center justify-between p-1 bg-slate-50 rounded border border-slate-100">
                <span className="font-semibold text-slate-600">PST ➔ Go Live:</span>
                <span className="font-mono font-bold text-rose-600">18 candidates (8.6%)</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-100">
              <span>Cumulative Loss Rate:</span>
              <strong className="text-rose-600 font-mono font-black">28.9% Total Drop</strong>
            </div>
          </div>
        </div>

        {/* Bottom Row: 2 Trend Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 3: Leads to Interview Trend */}
          <div className="bg-white p-4 rounded-2xl border border-[#E6ECF2] shadow-sm flex flex-col justify-between space-y-3 select-none">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-[#042C51]">Leads to Interview Trend</h4>
                  <p className="text-[10px] text-slate-400 font-medium">6-Week Sourcing Volume & Yield</p>
                </div>
              </div>
              <span className="px-2 py-0.5 text-[9px] font-black bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100">
                1,250 Leads
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-baseline justify-between mb-1">
                <div>
                  <span className="text-xl font-black text-[#042C51] font-mono">480</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase ml-1">Interviews</span>
                </div>
                <span className="text-xs font-mono font-extrabold text-indigo-600">38.4% Avg Yield</span>
              </div>

              {/* Custom SVG Overview-Style Chart */}
              <LeadsToInterviewTrendChart />
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-100">
              <span>Weekly Avg Sourcing:</span>
              <strong className="text-indigo-700 font-mono font-black">208 Leads / Wk</strong>
            </div>
          </div>

          {/* Card 4: Hiring Rate Trend */}
          <div className="bg-white p-4 rounded-2xl border border-[#E6ECF2] shadow-sm flex flex-col justify-between space-y-3 select-none">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-teal-50 text-teal-600 rounded-lg">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-[#042C51]">Hiring Rate Trend</h4>
                  <p className="text-[10px] text-slate-400 font-medium">6-Week Lead-to-JO Yield %</p>
                </div>
              </div>
              <span className="px-2 py-0.5 text-[9px] font-black bg-teal-50 text-teal-700 rounded-full border border-teal-100">
                21.6% Avg
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-baseline justify-between mb-1">
                <div>
                  <span className="text-xl font-black text-teal-600 font-mono">21.6%</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase ml-1">JO Yield</span>
                </div>
                <span className="text-xs font-mono font-extrabold text-emerald-600">192 Deployed</span>
              </div>

              {/* Custom SVG Overview-Style Chart */}
              <HiringRateTrendChart />
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-100">
              <span>6-Wk Target Status:</span>
              <strong className="text-teal-700 font-mono font-black">On Target (≥ 20%)</strong>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== TABLE 1: 6-WEEK FORECAST HEADCOUNT PLAN ==================== */}
      {/* Component: ForecastHeadcountPlanTables */}
      <section className="bg-white p-5 rounded-2xl border border-[#E6ECF2] shadow-sm space-y-4 select-none">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-black text-[#042C51] flex items-center gap-2">
              <span className="w-1.5 h-3.5 bg-[#FF5C28] rounded-sm"></span>
              6-Week Forecast Headcount Plan (Weekly Capacities & Milestones)
            </h3>
            <p className="text-xs text-[#667085] mt-0.5">
              Multi-week forecasting matrix mapping headcount requirements, capacity shortfalls, absenteeism, turnover, and milestone class start dates across 6 rolling weeks. <strong className="text-[#042C51]">Click any row to view unit-level week details.</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-extrabold text-[#042C51] bg-[#E9F0FC] px-2.5 py-1 rounded-full border border-blue-200">
              <span>↔ Drag or scroll horizontally to view all 17 columns</span>
            </span>
          </div>
        </div>

        {/* Forecast Table 1 Container with Drag-Scroll */}
        <div
          ref={table1Ref}
          onMouseDown={handleMouseDown1}
          onMouseLeave={handleMouseLeave1}
          onMouseUp={handleMouseUp1}
          onMouseMove={handleMouseMove1}
          className={`overflow-x-auto border border-[#E6ECF2] rounded-xl relative select-none cursor-grab ${
            isMouseDown1 ? "cursor-grabbing" : ""
          }`}
        >
          <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
            <thead className="bg-[#F8FAFC] text-[#042C51] text-[10px] font-bold uppercase tracking-wider sticky top-0 z-10 border-b border-[#CBD5E1] shadow-2xs">
              {/* Category Grouping Row 1 */}
              <tr className="border-b border-[#CBD5E1]">
                <th colSpan={2} className="px-3 py-2 bg-[#E2EBF4] text-[#042C51] border-r border-[#CBD5E1] text-center font-black">
                  1. FORECAST WEEK & PERIOD
                </th>
                <th colSpan={5} className="px-3 py-2 bg-[#EEF4FB] text-[#042C51] border-r border-[#CBD5E1] text-center font-black">
                  2. CAPACITY & SHORTFALL
                </th>
                <th colSpan={4} className="px-3 py-2 bg-[#E2EBF4] text-[#042C51] border-r border-[#CBD5E1] text-center font-black">
                  3. WEEKLY LOSS TELEMETRY
                </th>
                <th colSpan={5} className="px-3 py-2 bg-[#EEF4FB] text-[#042C51] border-r border-[#CBD5E1] text-center font-black">
                  4. TRAINING MILESTONE & CONVERSION PIPELINE
                </th>
                <th colSpan={2} className="px-3 py-2 bg-[#E2EBF4] text-[#042C51] text-center font-black">
                  5. YIELD & LEADS TARGET
                </th>
              </tr>

              {/* Individual Column Header Row 2 */}
              <tr className="bg-[#F8FAFC] text-[10px] text-[#042C51]">
                <th className="px-3 py-2.5 border-r border-[#CBD5E1]">Forecast Week</th>
                <th className="px-3 py-2.5 border-r border-[#CBD5E1]">Date Range</th>

                <th className="px-3 py-2.5 text-right">Required HC</th>
                <th className="px-3 py-2.5 text-right">Actual HC</th>
                <th className="px-3 py-2.5 text-right">Net Actual HC</th>
                <th className="px-3 py-2.5 text-right">Buffer %</th>
                <th className="px-3 py-2.5 text-right border-r border-[#CBD5E1]">Hiring Needed</th>

                <th className="px-3 py-2.5 text-right">Absenteeism</th>
                <th className="px-3 py-2.5 text-right">Abs %</th>
                <th className="px-3 py-2.5 text-right">Attrition</th>
                <th className="px-3 py-2.5 text-right border-r border-[#CBD5E1]">Att %</th>

                <th className="px-3 py-2.5 text-right">Accepted JO</th>
                <th className="px-3 py-2.5 text-right">NHO Count</th>
                <th className="px-3 py-2.5 text-right">FST Count</th>
                <th className="px-3 py-2.5 text-right">PST Count</th>
                <th className="px-3 py-2.5 text-right border-r border-[#CBD5E1]">Go Live</th>

                <th className="px-3 py-2.5 text-right">Hiring Rate %</th>
                <th className="px-3.5 py-2.5 text-right">Leads Needed</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#E6ECF2] font-medium bg-white">
              {forecastWeeks.map((fw) => {
                const netActual = fw.actualHC - fw.absenteeismCount - fw.attritionCount;
                const bufferPct = Number((((netActual - fw.requiredHC) / fw.requiredHC) * 100).toFixed(2));
                const hiringNeeded = Math.max(0, fw.requiredHC - netActual);
                const leadsNeeded = Math.round(hiringNeeded / (fw.hiringRatePct / 100));

                return (
                  <tr 
                    key={fw.id} 
                    onClick={() => setSelectedWeekDetails(fw)}
                    className="hover:bg-[#E9F0FC]/80 cursor-pointer transition-colors group"
                  >
                    {/* Forecast Week */}
                    <td className="px-3 py-3 font-extrabold text-[#042C51] border-r border-[#E6ECF2] flex items-center justify-between">
                      <span>{fw.weekLabel}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#FF5C28] transition-colors" />
                    </td>

                    {/* Date Range */}
                    <td className="px-3 py-3 text-slate-500 border-r border-[#E6ECF2] text-[11px] font-semibold">{fw.dateRange}</td>

                    {/* Required HC */}
                    <td className="px-3 py-3 text-right font-mono font-bold text-slate-700">{fw.requiredHC}</td>

                    {/* Actual HC */}
                    <td className="px-3 py-3 text-right font-mono text-slate-600">{fw.actualHC}</td>

                    {/* Net Actual HC */}
                    <td className="px-3 py-3 text-right font-mono font-bold text-[#042C51]">{netActual}</td>

                    {/* Buffer % */}
                    <td className={`px-3 py-3 text-right font-mono font-bold ${bufferPct < 0 ? "text-[#E74C3C]" : "text-[#2ECC71]"}`}>
                      {bufferPct}%
                    </td>

                    {/* Hiring Needed */}
                    <td className="px-3 py-3 text-right font-mono font-bold border-r border-[#E6ECF2]">
                      {hiringNeeded > 0 ? (
                        <span className="bg-rose-50 text-[#E74C3C] px-2 py-0.5 rounded font-black border border-rose-100">
                          {hiringNeeded}
                        </span>
                      ) : (
                        <span className="text-emerald-600 font-bold">0</span>
                      )}
                    </td>

                    {/* Loss Telemetry */}
                    <td className="px-3 py-3 text-right font-mono text-slate-700">{fw.absenteeismCount}</td>
                    <td className="px-3 py-3 text-right font-mono font-bold text-slate-800">{fw.absenteeismPct}%</td>
                    <td className="px-3 py-3 text-right font-mono text-slate-700">{fw.attritionCount}</td>
                    <td className="px-3 py-3 text-right font-mono font-bold text-slate-800 border-r border-[#E6ECF2]">{fw.attritionPct}%</td>

                    {/* Training Funnel */}
                    <td className="px-3 py-3 text-right font-mono font-bold text-slate-800">{fw.acceptedJO}</td>
                    <td className="px-3 py-3 text-right font-mono text-slate-700">{fw.nho}</td>
                    <td className="px-3 py-3 text-right font-mono text-slate-700">{fw.fst}</td>
                    <td className="px-3 py-3 text-right font-mono text-slate-700">{fw.pst}</td>
                    <td className="px-3 py-3 text-right font-mono font-bold text-emerald-600 border-r border-[#E6ECF2]">{fw.goLive}</td>

                    {/* Yield & Leads */}
                    <td className="px-3 py-3 text-right font-mono text-slate-700">{fw.hiringRatePct}%</td>
                    <td className="px-3.5 py-3 text-right font-mono font-black text-[#FF5C28]">{leadsNeeded}</td>
                  </tr>
                );
              })}
            </tbody>

            {/* Table 1 Summary Row (TOTAL / AVERAGE) */}
            <tfoot className="bg-[#E2EBF4] text-[#042C51] text-xs font-bold border-t-2 border-[#CBD5E1]">
              <tr>
                <td colSpan={2} className="px-3 py-3 text-left font-black uppercase text-[#042C51] border-r border-[#CBD5E1]">
                  6-WEEK TOTAL / AVERAGE
                </td>

                <td className="px-3 py-3 text-right font-mono font-black text-[#042C51]">{forecastSummary.avgReq} (avg)</td>
                <td className="px-3 py-3 text-right font-mono text-slate-700">{forecastSummary.avgAct} (avg)</td>
                <td className="px-3 py-3 text-right font-mono font-black text-[#042C51]">{forecastSummary.avgNetAct} (avg)</td>
                <td className={`px-3 py-3 text-right font-mono font-black ${forecastSummary.avgBuffer < 0 ? "text-[#E74C3C]" : "text-[#2ECC71]"}`}>
                  {forecastSummary.avgBuffer}%
                </td>
                <td className="px-3 py-3 text-right font-mono font-black text-[#E74C3C] border-r border-[#CBD5E1]">
                  {forecastSummary.hiringNeededSum} (tot)
                </td>

                <td className="px-3 py-3 text-right font-mono text-slate-700">{forecastSummary.absSum} (tot)</td>
                <td className="px-3 py-3 text-right font-mono font-black text-[#042C51]">{forecastSummary.avgAbsPct}%</td>
                <td className="px-3 py-3 text-right font-mono text-slate-700">{forecastSummary.attSum} (tot)</td>
                <td className="px-3 py-3 text-right font-mono font-black text-[#042C51] border-r border-[#CBD5E1]">{forecastSummary.avgAttPct}%</td>

                <td className="px-3 py-3 text-right font-mono text-slate-700">{forecastSummary.accJOSum}</td>
                <td className="px-3 py-3 text-right font-mono text-slate-700">{forecastSummary.nhoSum}</td>
                <td className="px-3 py-3 text-right font-mono text-slate-700">{forecastSummary.fstSum}</td>
                <td className="px-3 py-3 text-right font-mono text-slate-700">{forecastSummary.pstSum}</td>
                <td className="px-3 py-3 text-right font-mono font-black text-emerald-700 border-r border-[#CBD5E1]">{forecastSummary.goLiveSum}</td>

                <td className="px-3 py-3 text-right font-mono text-slate-700">{forecastSummary.avgHiringRate}%</td>
                <td className="px-3.5 py-3 text-right font-mono font-black text-[#FF5C28]">{forecastSummary.totalLeadsNeeded}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>

      {/* ==================== 5. MULTI-SERIES FORECAST GRAPH ==================== */}
      {/* Component: ForecastBottomGraph */}
      <section className="bg-white p-5 rounded-2xl border border-[#E6ECF2] shadow-sm space-y-4 select-none">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-black text-[#042C51] flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-[#FF5C28]" />
              Multi-Series Capacity & Loss Forecast Trendlines (6-Week Horizon)
            </h3>
            <p className="text-xs text-[#667085] mt-0.5">
              Comparative multi-series trajectory mapping Required Headcount, Actual Working Staff, Absenteeism Rate (%), and Attrition Rate (%).
            </p>
          </div>

          {/* Series Visibility Toggles */}
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold">
            <button
              onClick={() => setActiveSeries(p => ({ ...p, required: !p.required }))}
              className={`px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1.5 ${
                activeSeries.required ? "bg-blue-50 text-blue-800 border-blue-300" : "bg-slate-50 text-slate-400 border-slate-200"
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#042C51]"></span>
              Required HC
            </button>

            <button
              onClick={() => setActiveSeries(p => ({ ...p, actual: !p.actual }))}
              className={`px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1.5 ${
                activeSeries.actual ? "bg-emerald-50 text-emerald-800 border-emerald-300" : "bg-slate-50 text-slate-400 border-slate-200"
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#2ECC71]"></span>
              Actual Staff
            </button>

            <button
              onClick={() => setActiveSeries(p => ({ ...p, absenteeism: !p.absenteeism }))}
              className={`px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1.5 ${
                activeSeries.absenteeism ? "bg-amber-50 text-amber-800 border-amber-300" : "bg-slate-50 text-slate-400 border-slate-200"
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#F39C12]"></span>
              Abs %
            </button>

            <button
              onClick={() => setActiveSeries(p => ({ ...p, attrition: !p.attrition }))}
              className={`px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1.5 ${
                activeSeries.attrition ? "bg-rose-50 text-rose-800 border-rose-300" : "bg-slate-50 text-slate-400 border-slate-200"
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#E74C3C]"></span>
              Att %
            </button>
          </div>
        </div>

        {/* Multi-Series SVG Line Chart */}
        <div className="bg-[#F8FAFC] p-4 rounded-xl border border-slate-200 relative">
          <svg className="w-full h-56 overflow-visible" viewBox="0 0 700 200">
            {/* Horizontal Gridlines */}
            <line x1="40" y1="20" x2="680" y2="20" stroke="#E2E8F0" strokeDasharray="3 3" />
            <line x1="40" y1="60" x2="680" y2="60" stroke="#E2E8F0" strokeDasharray="3 3" />
            <line x1="40" y1="100" x2="680" y2="100" stroke="#E2E8F0" strokeDasharray="3 3" />
            <line x1="40" y1="140" x2="680" y2="140" stroke="#E2E8F0" strokeDasharray="3 3" />
            <line x1="40" y1="180" x2="680" y2="180" stroke="#CBD5E1" strokeWidth="1.5" />

            {/* Y-Axis Left (Headcount scale: 1100 to 1450) */}
            <text x="10" y="25" className="fill-slate-400 text-[9px] font-mono">1,400</text>
            <text x="10" y="75" className="fill-slate-400 text-[9px] font-mono">1,300</text>
            <text x="10" y="125" className="fill-slate-400 text-[9px] font-mono">1,200</text>
            <text x="10" y="175" className="fill-slate-400 text-[9px] font-mono">1,100</text>

            {/* Required Headcount Line (Target Line - Dark Navy) */}
            {activeSeries.required && (
              <polyline
                fill="none"
                stroke="#042C51"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="70,100  180,84  290,68  400,46  510,30  620,20"
              />
            )}

            {/* Actual Staff Line (Emerald Green) */}
            {activeSeries.actual && (
              <polyline
                fill="none"
                stroke="#2ECC71"
                strokeWidth="3"
                strokeDasharray="4 2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="70,137  180,124  290,121  400,103  510,79  620,53"
              />
            )}

            {/* Absenteeism Rate % (Amber - mapped on percentage scale) */}
            {activeSeries.absenteeism && (
              <polyline
                fill="none"
                stroke="#F39C12"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="70,147  180,141  290,134  400,140  510,144  620,152"
              />
            )}

            {/* Attrition Rate % (Rose Red - mapped on percentage scale) */}
            {activeSeries.attrition && (
              <polyline
                fill="none"
                stroke="#E74C3C"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="70,164  180,160  290,145  400,155  510,167  620,175"
              />
            )}

            {/* Node Points for Forecast Weeks */}
            {forecastWeeks.map((w, idx) => {
              const xPos = 70 + idx * 110;
              return (
                <g key={w.id} className="cursor-pointer group">
                  {/* Vertical Guide Line on Hover */}
                  <line x1={xPos} y1="20" x2={xPos} y2="180" stroke="#CBD5E1" strokeDasharray="2 2" className="opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Required Dot */}
                  {activeSeries.required && (
                    <circle cx={xPos} cy={100 - idx * 16} r="4.5" className="fill-[#042C51] stroke-white stroke-2" />
                  )}

                  {/* Actual Dot */}
                  {activeSeries.actual && (
                    <circle cx={xPos} cy={137 - idx * 16} r="4.5" className="fill-[#2ECC71] stroke-white stroke-2" />
                  )}

                  {/* Week Label */}
                  <text x={xPos} y="195" textAnchor="middle" className="fill-slate-600 text-[10px] font-bold">
                    {w.weekLabel}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </section>

      {/* ==================== TABLE 2: DETAILS BY CLUSTER / ACCOUNT ==================== */}
      {/* Component: WorkforceHiringAccountsTable */}
      <section className="bg-white p-5 rounded-2xl border border-[#E6ECF2] shadow-sm space-y-4 select-none">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-black text-[#042C51] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#FF5C28]" />
              Details by Cluster / Account (6-Week Forecast Average Plan)
            </h3>
            <p className="text-xs text-[#667085] mt-0.5">
              Account-level breakdown aggregating 6-week forecast averages for every individual Cluster and Client Account.
            </p>
          </div>

          {/* Search, Cluster & Account Filter */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <span className="absolute inset-y-0 left-2.5 flex items-center pointer-events-none">
                <Search className="w-3.5 h-3.5 text-slate-400" />
              </span>
              <input
                type="text"
                placeholder="Search account or cluster..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-[#F1F5F9] border border-transparent rounded-lg text-xs font-semibold focus:outline-none focus:bg-white focus:border-[#042C51] transition-all"
              />
            </div>

            <select
              value={selectedCluster}
              onChange={e => { setSelectedCluster(e.target.value); setSelectedAccount("All"); }}
              className="bg-[#F1F5F9] px-2.5 py-1.5 rounded-lg text-xs font-bold text-[#042C51] focus:outline-none cursor-pointer"
            >
              <option value="All">All Clusters</option>
              <option value="Telecom & Tech">Telecom & Tech</option>
              <option value="Financial Services">Financial Services</option>
              <option value="Healthcare & Ins.">Healthcare & Ins.</option>
              <option value="Retail & E-Commerce">Retail & E-Commerce</option>
            </select>

            <select
              value={selectedAccount}
              onChange={e => setSelectedAccount(e.target.value)}
              className="bg-[#F1F5F9] px-2.5 py-1.5 rounded-lg text-xs font-bold text-[#042C51] focus:outline-none cursor-pointer"
            >
              <option value="All">All Accounts</option>
              <option value="Verizon Tech">Verizon Tech</option>
              <option value="Comcast Technical">Comcast Technical</option>
              <option value="Aetna Core">Aetna Core</option>
              <option value="Citi Premier">Citi Premier</option>
            </select>
          </div>
        </div>

        {/* Forecast Table 2 Container with Drag-Scroll */}
        <div
          ref={table2Ref}
          onMouseDown={handleMouseDown2}
          onMouseLeave={handleMouseLeave2}
          onMouseUp={handleMouseUp2}
          onMouseMove={handleMouseMove2}
          className={`overflow-x-auto border border-[#E6ECF2] rounded-xl relative select-none cursor-grab ${
            isMouseDown2 ? "cursor-grabbing" : ""
          }`}
        >
          <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
            <thead className="bg-[#F8FAFC] text-[#042C51] text-[10px] font-bold uppercase tracking-wider sticky top-0 z-10 border-b border-[#CBD5E1] shadow-2xs">
              {/* Category Grouping Row 1 */}
              <tr className="border-b border-[#CBD5E1]">
                <th colSpan={2} className="px-3 py-2 bg-[#E2EBF4] text-[#042C51] border-r border-[#CBD5E1] text-center font-black">
                  1. IDENTIFICATION & SCOPE
                </th>
                <th colSpan={5} className="px-3 py-2 bg-[#EEF4FB] text-[#042C51] border-r border-[#CBD5E1] text-center font-black">
                  2. ACCOUNT CAPACITY & SHORTFALL AVERAGES
                </th>
                <th colSpan={4} className="px-3 py-2 bg-[#E2EBF4] text-[#042C51] border-r border-[#CBD5E1] text-center font-black">
                  3. 6-WEEK CUMULATIVE LOSS TELEMETRY
                </th>
                <th colSpan={6} className="px-3 py-2 bg-[#EEF4FB] text-[#042C51] border-r border-[#CBD5E1] text-center font-black">
                  4. ACCOUNT TRAINING FUNNEL & PLACEMENTS
                </th>
                <th colSpan={2} className="px-3 py-2 bg-[#E2EBF4] text-[#042C51] border-r border-[#CBD5E1] text-center font-black">
                  5. YIELD & LEADS TARGET
                </th>
                <th className="px-3 py-2 bg-[#EEF4FB] text-[#042C51] text-center font-black">
                  6. ACTIONS
                </th>
              </tr>

              {/* Individual Column Header Row 2 */}
              <tr className="bg-[#F8FAFC] text-[10px] text-[#042C51]">
                <th className="px-3 py-2.5 border-r border-[#CBD5E1]">Cluster</th>
                <th className="px-3 py-2.5 border-r border-[#CBD5E1]">Account</th>

                <th className="px-3 py-2.5 text-right">Required HC</th>
                <th className="px-3 py-2.5 text-right">Actual HC</th>
                <th className="px-3 py-2.5 text-right">Buffer %</th>
                <th className="px-3 py-2.5 text-right">Net Actual HC</th>
                <th className="px-3 py-2.5 text-right border-r border-[#CBD5E1]">Hiring Needed</th>

                <th className="px-3 py-2.5 text-right">Absenteeism (6 Wks)</th>
                <th className="px-3 py-2.5 text-right">Abs Rate %</th>
                <th className="px-3 py-2.5 text-right">Attrition (6 Wks)</th>
                <th className="px-3 py-2.5 text-right border-r border-[#CBD5E1]">Att Rate %</th>

                <th className="px-3 py-2.5 text-right">Accepted JO</th>
                <th className="px-3 py-2.5 text-right">NHO Count</th>
                <th className="px-3 py-2.5 text-right">FST Count</th>
                <th className="px-3 py-2.5 text-right">PST Count</th>
                <th className="px-3 py-2.5 text-right font-bold text-emerald-700">Go Live</th>
                <th className="px-3 py-2.5 text-right font-bold text-emerald-700 border-r border-[#CBD5E1]">Hired Count</th>

                <th className="px-3 py-2.5 text-right">Hiring Rate %</th>
                <th className="px-3 py-2.5 text-right border-r border-[#CBD5E1]">Target Leads</th>

                <th className="px-3.5 py-2.5 text-center">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#E6ECF2] font-medium bg-white">
              {filteredPlans.length === 0 ? (
                <tr>
                  <td colSpan={20} className="text-center py-10 text-slate-400 font-bold">
                    No active account plans matching parameters.
                  </td>
                </tr>
              ) : (
                filteredPlans.map(plan => {
                  const absenteeism6Wks = plan.kpiSnapshot.absenteeismCount * 6;
                  const attrition6Wks = plan.kpiSnapshot.attritionCount * 6;
                  const netActual = plan.actualHeadcount - plan.kpiSnapshot.absenteeismCount - plan.kpiSnapshot.attritionCount;
                  const bufferPct = plan.kpiSnapshot.bufferPercentage;

                  return (
                    <tr key={plan.id} className="hover:bg-[#F1F5F9]/60 transition-colors">
                      {/* Cluster */}
                      <td className="px-3 py-3 font-semibold text-slate-500 border-r border-[#E6ECF2]">{plan.cluster}</td>

                      {/* Account */}
                      <td className="px-3 py-3 text-[#042C51] font-extrabold border-r border-[#E6ECF2]">
                        <button
                          onClick={() => onViewPlan(plan)}
                          className="hover:underline hover:text-[#FF5C28] text-left focus:outline-none"
                        >
                          {plan.account}
                        </button>
                      </td>

                      {/* Capacity Metrics */}
                      <td className="px-3 py-3 text-right font-mono font-bold text-slate-700">{plan.requiredHeadcount}</td>
                      <td className="px-3 py-3 text-right font-mono text-slate-600">{plan.actualHeadcount}</td>
                      <td className={`px-3 py-3 text-right font-mono font-bold ${bufferPct < 0 ? "text-[#E74C3C]" : "text-[#2ECC71]"}`}>
                        {bufferPct}%
                      </td>
                      <td className="px-3 py-3 text-right font-mono font-bold text-[#042C51]">{netActual}</td>
                      <td className="px-3 py-3 text-right font-mono font-bold border-r border-[#E6ECF2]">
                        {plan.hiringNeeded > 0 ? (
                          <span className="bg-rose-50 text-[#E74C3C] px-2 py-0.5 rounded font-black border border-rose-100">
                            {plan.hiringNeeded}
                          </span>
                        ) : (
                          <span className="text-emerald-600 font-bold">0</span>
                        )}
                      </td>

                      {/* 6-Week Cumulative Loss */}
                      <td className="px-3 py-3 text-right font-mono text-slate-700">{absenteeism6Wks}</td>
                      <td className="px-3 py-3 text-right font-mono font-bold text-slate-800">{plan.kpiSnapshot.absenteeismPercentage}%</td>
                      <td className="px-3 py-3 text-right font-mono text-slate-700">{attrition6Wks}</td>
                      <td className="px-3 py-3 text-right font-mono font-bold text-slate-800 border-r border-[#E6ECF2]">{plan.kpiSnapshot.attritionPercentage}%</td>

                      {/* Funnel & Placements */}
                      <td className="px-3 py-3 text-right font-mono text-slate-800">{plan.kpiSnapshot.acceptedJO}</td>
                      <td className="px-3 py-3 text-right font-mono text-slate-700">{plan.kpiSnapshot.nho}</td>
                      <td className="px-3 py-3 text-right font-mono text-slate-700">{plan.kpiSnapshot.fst}</td>
                      <td className="px-3 py-3 text-right font-mono text-slate-700">{plan.kpiSnapshot.pst}</td>
                      <td className="px-3 py-3 text-right font-mono font-bold text-emerald-600">{plan.kpiSnapshot.goLive}</td>
                      <td className="px-3 py-3 text-right font-mono font-black text-emerald-600 bg-emerald-50/50 border-r border-[#E6ECF2]">{plan.hiredCount}</td>

                      {/* Yield & Leads */}
                      <td className="px-3 py-3 text-right font-mono text-slate-700">{plan.hiringRate}%</td>
                      <td className="px-3 py-3 text-right font-mono font-black text-[#FF5C28] border-r border-[#E6ECF2]">{plan.leadsNeeded}</td>

                      {/* Action */}
                      <td className="px-3.5 py-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => onViewPlan(plan)}
                            title="View Account Hiring Plan"
                            className="p-1.5 bg-[#E9F0FC] hover:bg-blue-100 text-[#042C51] rounded-lg transition-all"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onAddActionItem && onAddActionItem(plan.id)}
                            title="Add Task"
                            className="p-1.5 bg-slate-100 hover:bg-[#FF5C28]/10 text-[#FF5C28] rounded-lg transition-all"
                          >
                            <PlusCircle className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>

            {/* Table 2 Summary Row (TOTAL / AVERAGE) */}
            <tfoot className="bg-[#E2EBF4] text-[#042C51] text-xs font-bold border-t-2 border-[#CBD5E1]">
              <tr>
                <td colSpan={2} className="px-3 py-3 text-left font-black uppercase text-[#042C51] border-r border-[#CBD5E1]">
                  TOTAL / AVERAGE ({filteredPlans.length} ACCOUNTS)
                </td>

                <td className="px-3 py-3 text-right font-mono font-black text-[#042C51]">{accountsSummary.requiredHC}</td>
                <td className="px-3 py-3 text-right font-mono text-slate-700">{accountsSummary.actualHC}</td>
                <td className={`px-3 py-3 text-right font-mono font-black ${accountsSummary.bufferPct < 0 ? "text-[#E74C3C]" : "text-[#2ECC71]"}`}>
                  {accountsSummary.bufferPct}%
                </td>
                <td className="px-3 py-3 text-right font-mono font-black text-[#042C51]">{accountsSummary.netActualHC}</td>
                <td className="px-3 py-3 text-right font-mono font-black text-[#E74C3C] border-r border-[#CBD5E1]">
                  {accountsSummary.hiringNeeded}
                </td>

                <td className="px-3 py-3 text-right font-mono text-slate-700">{accountsSummary.absenteeism6Wks}</td>
                <td className="px-3 py-3 text-right font-mono font-black text-[#042C51]">{accountsSummary.absenteeismRatePct}%</td>
                <td className="px-3 py-3 text-right font-mono text-slate-700">{accountsSummary.attrition6Wks}</td>
                <td className="px-3 py-3 text-right font-mono font-black text-[#042C51] border-r border-[#CBD5E1]">{accountsSummary.attritionRatePct}%</td>

                <td className="px-3 py-3 text-right font-mono text-slate-700">{accountsSummary.acceptedJO}</td>
                <td className="px-3 py-3 text-right font-mono text-slate-700">{accountsSummary.nho}</td>
                <td className="px-3 py-3 text-right font-mono text-slate-700">{accountsSummary.fst}</td>
                <td className="px-3 py-3 text-right font-mono text-slate-700">{accountsSummary.pst}</td>
                <td className="px-3 py-3 text-right font-mono font-black text-emerald-700">{accountsSummary.goLive}</td>
                <td className="px-3 py-3 text-right font-mono font-black text-emerald-700 border-r border-[#CBD5E1]">{accountsSummary.hiredCount}</td>

                <td className="px-3 py-3 text-right font-mono text-slate-700">{accountsSummary.hiringRatePct}%</td>
                <td className="px-3 py-3 text-right font-mono font-black text-[#FF5C28] border-r border-[#CBD5E1]">{accountsSummary.leadsNeeded}</td>

                <td className="px-3.5 py-3 text-center">
                  <span className="px-2 py-0.5 text-[9px] font-black rounded uppercase bg-[#042C51] text-white">
                    Summary
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>

      {/* ==================== 1. AI WORKFORCE INTELLIGENCE ADVISOR MODAL ==================== */}
      {/* Component: AIInsightModal */}
      {isAiModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="bg-[#042C51] text-white px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-gradient-to-tr from-[#FF5C28] to-amber-500 rounded-xl shadow-md">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold flex items-center gap-2">
                    AI Workforce Intelligence Advisor
                    <span className="px-2 py-0.5 text-[9px] font-black bg-amber-400 text-[#042C51] rounded-full uppercase">
                      Live Telemetry
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-300 mt-0.5">Automated capacity deficit modeling & batch scheduling recommendations.</p>
                </div>
              </div>
              <button 
                onClick={() => setIsAiModalOpen(false)} 
                className="text-slate-300 hover:text-white p-1.5 rounded-lg bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content / Chat */}
            <div className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
              {/* Executive Alert Banner */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1 text-amber-900">
                  <strong className="block font-bold">Capacity Deficit Risk Alert (Week 22 - Week 24)</strong>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    Telecom & Tech accounts show a projected 192-slot gap before the Go-Live target on June 17. The primary loss driver is a 36-candidate drop-off between Accepted JO and NHO.
                  </p>
                </div>
              </div>

              {/* Strategic AI Recommendations */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5 space-y-2">
                <strong className="text-xs font-bold text-[#042C51] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Recommended Mitigation Actions
                </strong>
                <ul className="list-disc pl-4 text-[11px] text-slate-700 space-y-1">
                  <li>Accelerate FST batch start date for Verizon Tech by 3 days.</li>
                  <li>Over-hire Accepted JOs by 18% in Week 21 to buffer NHO drop-offs.</li>
                  <li>Reallocate 12 cross-trained PST agents from Comcast Support.</li>
                </ul>
              </div>

              {/* Chat Thread */}
              <div className="space-y-3 pt-2">
                {aiMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed text-xs shadow-xs ${
                        msg.sender === "user"
                          ? "bg-[#FF5C28] text-white rounded-br-none"
                          : "bg-slate-100 text-slate-800 border border-slate-200 rounded-bl-none"
                      }`}
                    >
                      <p>{msg.text}</p>
                      <span className={`block text-[9px] mt-1.5 text-right font-bold ${msg.sender === "user" ? "text-amber-100" : "text-slate-400"}`}>
                        {msg.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Chat Form */}
            <form onSubmit={handleSendAiMessage} className="p-4 bg-slate-50 border-t border-slate-200 flex items-center gap-2">
              <input
                type="text"
                placeholder="Ask AI Advisor follow-up questions (e.g. How to mitigate Week 22 deficit?)..."
                value={aiChatInput}
                onChange={e => setAiChatInput(e.target.value)}
                className="flex-1 bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-semibold focus:outline-none focus:border-[#042C51] transition-all"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#042C51] hover:bg-[#063b6b] text-white font-bold rounded-xl flex items-center gap-1.5 shadow transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Ask</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ==================== 2. KPI SNAPSHOT MODAL ==================== */}
      {/* Component: KPISnapshotModal */}
      {isKpiModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#042C51] text-white px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-[#7DD3FC]" />
                <div>
                  <h3 className="text-sm font-bold">Week 20 Operational KPI Snapshot</h3>
                  <p className="text-[11px] text-slate-300 mt-0.5">High-level capacity floors, absenteeism, turnover & class start dates.</p>
                </div>
              </div>
              <button 
                onClick={() => setIsKpiModalOpen(false)} 
                className="text-slate-300 hover:text-white p-1 rounded bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                  <span className="block text-[10px] text-slate-500 font-bold uppercase">Required HC Floor</span>
                  <span className="text-base font-black text-[#042C51]">1,250</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                  <span className="block text-[10px] text-slate-500 font-bold uppercase">Net Active HC</span>
                  <span className="text-base font-black text-slate-800">1,070</span>
                </div>
                <div className="bg-rose-50 p-3 rounded-xl border border-rose-200 text-center">
                  <span className="block text-[10px] text-rose-700 font-bold uppercase">Net Hiring Gap</span>
                  <span className="text-base font-black text-[#E74C3C]">180 Slots</span>
                </div>
                <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-center">
                  <span className="block text-[10px] text-emerald-700 font-bold uppercase">Target Go Live</span>
                  <span className="text-base font-black text-emerald-800">95 Agents</span>
                </div>
              </div>

              {/* Class Schedule Dates */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                <h4 className="font-extrabold text-[#042C51] flex items-center justify-between">
                  <span>Class Start Dates & Milestone Schedule</span>
                  <Clock className="w-3.5 h-3.5 text-[#FF5C28]" />
                </h4>
                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  <div className="flex justify-between border-b pb-1">
                    <span className="text-slate-500 font-medium">NHO Orientation Date:</span>
                    <strong className="text-slate-800 font-mono">May 13, 2024</strong>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="text-slate-500 font-medium">FST Skills Start Date:</span>
                    <strong className="text-slate-800 font-mono">May 20, 2024</strong>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="text-slate-500 font-medium">PST Product Start Date:</span>
                    <strong className="text-slate-800 font-mono">May 27, 2024</strong>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="text-slate-500 font-medium">Go-Live Launch Date:</span>
                    <strong className="text-emerald-600 font-bold font-mono">June 10, 2024</strong>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setIsKpiModalOpen(false)}
                  className="px-4 py-2 bg-[#042C51] text-white font-bold rounded-xl hover:bg-[#063b6b] transition-all"
                >
                  Close Snapshot
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 3. VIEW PLAN DETAILS AUDIT MODAL ==================== */}
      {/* Component: ViewPlanModal */}
      {isViewPlanModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-4xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
            <div className="bg-[#042C51] text-white px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#7DD3FC]" />
                <div>
                  <h3 className="text-sm font-bold">Comprehensive Hiring Plan Audit Log</h3>
                  <p className="text-[11px] text-slate-300 mt-0.5">Account breakdown, historical performance & training timeline audit logs.</p>
                </div>
              </div>
              <button onClick={() => setIsViewPlanModalOpen(false)} className="text-slate-300 hover:text-white p-1.5 rounded-lg bg-slate-800">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-xs">
              <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <strong className="text-sm font-black text-[#042C51]">Master Fiscal Planning Scope</strong>
                  <p className="text-slate-500 mt-0.5">Aggregate statistics across active accounts & clusters.</p>
                </div>
                <button 
                  onClick={() => showToast("Full Audit Log exported as CSV / PDF report!")}
                  className="px-3 py-2 bg-[#042C51] text-white font-bold rounded-lg flex items-center gap-1.5 hover:bg-[#063b6b]"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Report</span>
                </button>
              </div>

              {/* Historical Audit Logs */}
              <div className="space-y-3">
                <h4 className="font-extrabold text-[#042C51] uppercase text-[11px] tracking-wide">Historical Week-Over-Week Logs</h4>
                <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden bg-white">
                  {plans.map(p => (
                    <div key={p.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50">
                      <div>
                        <span className="font-bold text-[#042C51] text-xs">{p.account}</span>
                        <span className="text-slate-400 text-[10px] ml-2">({p.cluster})</span>
                        <p className="text-[11px] text-slate-500 mt-0.5">Owner: {p.owner} • Status: <strong className="text-emerald-600">{p.status}</strong></p>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-slate-700 block">{p.requiredHeadcount} Req / {p.actualHeadcount} Act</span>
                        <span className="text-[10px] text-slate-400">Updated: {p.updatedAt}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setIsViewPlanModalOpen(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 font-bold text-slate-700 rounded-xl"
              >
                Close Audit View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 4. WEEKLY ACCOUNT DRILL-DOWN MODAL ==================== */}
      {/* Component: ForecastWeekAccountDetailsModal */}
      {selectedWeekDetails && (
        <div className="fixed inset-0 bg-[#042C51]/80 backdrop-blur-md flex items-center justify-center z-50 p-3 sm:p-5 overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
          <div className="bg-[#F8FAFC] w-full max-w-7xl rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="bg-[#042C51] text-white px-6 py-4 flex flex-wrap items-center justify-between shrink-0 border-b border-slate-700 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FF5C28] flex items-center justify-center text-white shadow-md shrink-0">
                  <BarChart2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="text-base font-black tracking-wide uppercase text-white">
                      Forecast Week Details
                    </h3>
                    <span className="text-slate-400 font-bold">|</span>
                    <span className="text-xs font-bold text-slate-300">
                      Account / Cluster Breakdown
                    </span>
                    <span className="px-2.5 py-0.5 text-[10px] font-black bg-[#FF5C28] text-white rounded-full uppercase tracking-wider shadow-2xs">
                      {filteredModalRecords.length} of {INITIAL_DETAIL_RECORDS.length} rows
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-300 mt-1">
                    <span className="font-extrabold text-blue-300">{selectedWeekDetails.weekLabel} | {selectedWeekDetails.dateRange}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-300 font-medium text-[11px]">Forecast basis: 2026-06-01 to 2026-07-06</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedWeekDetails(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all cursor-pointer"
                title="Close Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Banner & Search Control Bar */}
            <div className="bg-white px-6 py-3 border-b border-[#E6ECF2] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2 text-xs font-black text-[#042C51] uppercase tracking-wider">
                <Info className="w-4 h-4 text-[#FF5C28] shrink-0" />
                <span>CLICKED FORECAST WEEK ROWS ARE SHOWN PER ACCOUNT AND CLUSTER.</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative w-full sm:w-72">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search cluster or account..."
                    value={modalSearchQuery}
                    onChange={(e) => setModalSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-8 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#042C51] transition-all"
                  />
                  {modalSearchQuery && (
                    <button
                      onClick={() => setModalSearchQuery("")}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Body: Scrollable Table Container */}
            <div className="p-5 overflow-y-auto space-y-4 flex-1">
              <div className="overflow-x-auto border border-[#E6ECF2] rounded-2xl shadow-2xs max-h-[55vh] overflow-y-auto bg-white">
                <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
                  <thead className="bg-[#F8FAFC] text-[#042C51] font-bold uppercase text-[10px] tracking-wider sticky top-0 z-10 border-b border-[#CBD5E1] shadow-2xs">
                    <tr>
                      <th className="px-3.5 py-3 border-r border-[#CBD5E1]">CLUSTER</th>
                      <th className="px-3.5 py-3 border-r border-[#CBD5E1]">ACCOUNT</th>
                      <th className="px-3 py-3 text-right border-r border-[#CBD5E1]">REQUIRED HC</th>
                      <th className="px-3 py-3 text-right border-r border-[#CBD5E1]">ACTUAL HC</th>
                      <th className="px-3 py-3 text-right border-r border-[#CBD5E1]">BUFFER %</th>
                      <th className="px-3.5 py-3 text-right border-r border-[#CBD5E1]">ABSENTEEISM</th>
                      <th className="px-3.5 py-3 text-right border-r border-[#CBD5E1]">ATTRITION</th>
                      <th className="px-3 py-3 text-right border-r border-[#CBD5E1]">NET ACTUAL HC</th>
                      <th className="px-3 py-3 text-right border-r border-[#CBD5E1]">HIRING NEEDED</th>
                      <th className="px-3 py-3 text-center border-r border-[#CBD5E1]">ACCEPTED JO</th>
                      <th className="px-3 py-3 text-center border-r border-[#CBD5E1]">NHO COUNT</th>
                      <th className="px-3 py-3 text-center border-r border-[#CBD5E1]">FST COUNT</th>
                      <th className="px-3 py-3 text-center border-r border-[#CBD5E1]">PST COUNT</th>
                      <th className="px-3 py-3 text-center border-r border-[#CBD5E1]">GO LIVE</th>
                      <th className="px-3 py-3 text-right">HIRED COUNT</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#E6ECF2] bg-white font-medium text-slate-700">
                    {filteredModalRecords.length === 0 ? (
                      <tr>
                        <td colSpan={15} className="px-4 py-12 text-center text-slate-400 font-semibold">
                          No matching account or cluster records found for "{modalSearchQuery}".
                        </td>
                      </tr>
                    ) : (
                      filteredModalRecords.map((rec, idx) => {
                        const isDeficit = rec.bufferPercentage < 0;
                        return (
                          <tr key={rec.id || idx} className="hover:bg-slate-50/80 transition-colors">
                            <td className="px-3.5 py-2.5 font-semibold text-slate-600 border-r border-[#E6ECF2]">
                              {rec.cluster}
                            </td>
                            <td className="px-3.5 py-2.5 font-bold text-[#042C51] border-r border-[#E6ECF2]">
                              {rec.account}
                            </td>
                            <td className="px-3 py-2.5 text-right font-mono font-bold text-[#042C51] border-r border-[#E6ECF2]">
                              {rec.requiredHC}
                            </td>
                            <td className="px-3 py-2.5 text-right font-mono text-slate-700 border-r border-[#E6ECF2]">
                              {rec.actualHC}
                            </td>
                            <td className="px-3 py-2.5 text-right font-mono font-bold border-r border-[#E6ECF2]">
                              <span className={isDeficit ? "text-rose-600 font-black" : "text-emerald-600 font-black"}>
                                {rec.bufferPercentage.toFixed(2)}%
                              </span>
                            </td>
                            <td className="px-3.5 py-2.5 text-right font-mono text-slate-700 border-r border-[#E6ECF2]">
                              {rec.absenteeismCount} <span className="text-[10px] text-slate-400">({rec.absenteeismPercentage.toFixed(1)}%)</span>
                            </td>
                            <td className="px-3.5 py-2.5 text-right font-mono text-slate-700 border-r border-[#E6ECF2]">
                              {rec.attritionCount} <span className="text-[10px] text-slate-400">({rec.attritionPercentage.toFixed(1)}%)</span>
                            </td>
                            <td className="px-3 py-2.5 text-right font-mono font-black text-[#042C51] border-r border-[#E6ECF2]">
                              {rec.netActualHC}
                            </td>
                            <td className="px-3 py-2.5 text-right font-mono font-bold border-r border-[#E6ECF2]">
                              {rec.hiringNeeded > 0 ? (
                                <span className="bg-rose-50 text-rose-600 px-2 py-0.5 rounded font-black border border-rose-100 shadow-2xs">
                                  {rec.hiringNeeded}
                                </span>
                              ) : (
                                <span className="text-slate-400">0</span>
                              )}
                            </td>
                            <td className="px-3 py-2.5 text-center font-mono font-bold text-slate-800 border-r border-[#E6ECF2]">
                              {rec.acceptedJO}
                            </td>
                            <td className="px-3 py-2.5 text-center font-mono text-slate-700 border-r border-[#E6ECF2]">
                              {rec.nho}
                            </td>
                            <td className="px-3 py-2.5 text-center font-mono text-slate-700 border-r border-[#E6ECF2]">
                              {rec.fst}
                            </td>
                            <td className="px-3 py-2.5 text-center font-mono text-slate-700 border-r border-[#E6ECF2]">
                              {rec.pst}
                            </td>
                            <td className="px-3 py-2.5 text-center font-mono font-bold text-emerald-600 border-r border-[#E6ECF2]">
                              {rec.goLive}
                            </td>
                            <td className="px-3 py-2.5 text-right font-mono font-extrabold text-[#042C51]">
                              {rec.hiredCount}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Footer Summary Card */}
              <div className="bg-[#F8FAFC] p-3.5 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between text-xs font-extrabold text-slate-700 gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-bold">Total Filtered Accounts:</span>
                  <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-300 font-mono font-black text-[#042C51]">
                    {filteredModalRecords.length} Accounts
                  </span>
                </div>
                <div className="flex items-center gap-4 font-mono text-[11px] flex-wrap">
                  <span>Total Req HC: <strong className="text-[#042C51] text-xs font-black">{filteredModalRecords.reduce((acc, r) => acc + r.requiredHC, 0)}</strong></span>
                  <span>Total Act HC: <strong className="text-slate-800 text-xs font-black">{filteredModalRecords.reduce((acc, r) => acc + r.actualHC, 0)}</strong></span>
                  <span>Net Act HC: <strong className="text-[#042C51] text-xs font-black">{filteredModalRecords.reduce((acc, r) => acc + r.netActualHC, 0)}</strong></span>
                  <span>Hiring Needed: <strong className="text-rose-600 text-xs font-black">{filteredModalRecords.reduce((acc, r) => acc + r.hiringNeeded, 0)}</strong></span>
                  <span>Total Deployed: <strong className="text-emerald-700 text-xs font-black">{filteredModalRecords.reduce((acc, r) => acc + r.goLive, 0)}</strong></span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-white px-6 py-3 border-t border-slate-200 flex items-center justify-between shrink-0">
              <span className="text-xs text-slate-400 font-medium">
                SiBS Headcount Intelligence • {selectedWeekDetails.weekLabel} Breakdown
              </span>
              <button
                onClick={() => setSelectedWeekDetails(null)}
                className="px-5 py-2 bg-[#042C51] hover:bg-[#031d36] text-white font-bold rounded-xl text-xs transition-colors shadow-md cursor-pointer"
              >
                Close Inspection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 5. OPERATIONAL ACTION ITEM SETUP MODAL ==================== */}
      {/* Component: ActionItemModal */}
      {isActionModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#042C51] text-white px-5 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold">Assign Operational Action Item</h3>
                <p className="text-[11px] text-slate-300 mt-0.5">Assign mitigation tasks to WFM or Operations leads.</p>
              </div>
              <button onClick={() => setIsActionModalOpen(false)} className="text-slate-300 hover:text-white font-bold text-xs p-1.5 rounded-lg bg-slate-800">✕</button>
            </div>

            <form onSubmit={handleCreateActionItem} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-[#667085] font-bold mb-1">Task Title / Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Schedule emergency FST batch for Verizon"
                  value={actionForm.title}
                  onChange={e => setActionForm(p => ({ ...p, title: e.target.value }))}
                  className="w-full bg-[#F1F5F9] border border-transparent rounded-lg p-2.5 font-semibold text-slate-800 focus:outline-none focus:bg-white focus:border-[#042C51]"
                />
              </div>

              <div>
                <label className="block text-[#667085] font-bold mb-1">Target Account</label>
                <select
                  value={actionForm.targetAccount}
                  onChange={e => setActionForm(p => ({ ...p, targetAccount: e.target.value }))}
                  className="w-full bg-[#F1F5F9] border border-transparent rounded-lg p-2 font-semibold text-[#042C51] focus:outline-none focus:bg-white focus:border-[#042C51]"
                >
                  <option value="Verizon Tech">Verizon Tech</option>
                  <option value="Comcast Technical">Comcast Technical</option>
                  <option value="Aetna Core">Aetna Core</option>
                  <option value="Citi Premier">Citi Premier</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#667085] font-bold mb-1">Assignee</label>
                  <input
                    type="text"
                    required
                    value={actionForm.assignee}
                    onChange={e => setActionForm(p => ({ ...p, assignee: e.target.value }))}
                    className="w-full bg-[#F1F5F9] border border-transparent rounded-lg p-2 font-semibold text-slate-800 focus:outline-none focus:bg-white focus:border-[#042C51]"
                  />
                </div>

                <div>
                  <label className="block text-[#667085] font-bold mb-1">Priority Level</label>
                  <select
                    value={actionForm.priority}
                    onChange={e => setActionForm(p => ({ ...p, priority: e.target.value as "High" | "Medium" | "Low" }))}
                    className="w-full bg-[#F1F5F9] border border-transparent rounded-lg p-2 font-semibold text-[#042C51] focus:outline-none focus:bg-white focus:border-[#042C51]"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#667085] font-bold mb-1">Target Resolution Date</label>
                <input
                  type="date"
                  required
                  value={actionForm.targetDate}
                  onChange={e => setActionForm(p => ({ ...p, targetDate: e.target.value }))}
                  className="w-full bg-[#F1F5F9] border border-transparent rounded-lg p-2 font-semibold text-slate-800 focus:outline-none focus:bg-white focus:border-[#042C51]"
                />
              </div>

              <div className="pt-3 border-t flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsActionModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-lg transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#FF5C28] hover:bg-[#e04f20] text-white font-bold rounded-lg shadow transition-all"
                >
                  Assign Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== 6. OPERATION STATUS & FEEDBACK MODAL ==================== */}
      {/* Component: StatusModal */}
      {statusModal.isOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-sm w-full p-5 text-center space-y-3 animate-in fade-in zoom-in-95 duration-150">
            <div className="mx-auto w-12 h-12 rounded-full flex items-center justify-center bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-black text-[#042C51]">{statusModal.title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{statusModal.message}</p>
            <button
              onClick={() => setStatusModal(p => ({ ...p, isOpen: false }))}
              className="w-full py-2 bg-[#042C51] hover:bg-[#063b6b] text-white font-bold text-xs rounded-xl shadow transition-all"
            >
              Acknowledge
            </button>
          </div>
        </div>
      )}

      {/* ==================== CREATE PLAN MODAL ==================== */}
      {isCreating && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#042C51] text-white px-5 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold">Initialize Workforce Hiring Plan</h3>
                <p className="text-[11px] text-slate-300 mt-0.5">Define target headcounts to dynamically generate pipeline sourcing requirements.</p>
              </div>
              <button onClick={() => setIsCreating(false)} className="text-slate-300 hover:text-white font-bold text-xs p-1.5 rounded-lg bg-slate-800">✕</button>
            </div>

            <form onSubmit={handleSubmitPlan} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#667085] font-bold mb-1">Target Cluster</label>
                  <select
                    value={newCluster}
                    onChange={e => setNewCluster(e.target.value)}
                    className="w-full bg-[#F1F5F9] border border-transparent rounded-lg p-2 font-semibold text-[#042C51] focus:outline-none focus:bg-white focus:border-[#042C51]"
                  >
                    <option value="Telecom & Tech">Telecom & Tech</option>
                    <option value="Financial Services">Financial Services</option>
                    <option value="Healthcare & Ins.">Healthcare & Ins.</option>
                    <option value="Retail & E-Commerce">Retail & E-Commerce</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#667085] font-bold mb-1">Account Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Comcast Core"
                    value={newAccount}
                    onChange={e => setNewAccount(e.target.value)}
                    className="w-full bg-[#F1F5F9] border border-transparent rounded-lg p-2 font-semibold text-slate-800 focus:outline-none focus:bg-white focus:border-[#042C51]"
                  />
                </div>

                <div>
                  <label className="block text-[#667085] font-bold mb-1">Ramp Period</label>
                  <input
                    type="text"
                    required
                    value={newPeriod}
                    onChange={e => setNewPeriod(e.target.value)}
                    className="w-full bg-[#F1F5F9] border border-transparent rounded-lg p-2 font-semibold text-slate-800 focus:outline-none focus:bg-white focus:border-[#042C51]"
                  />
                </div>

                <div>
                  <label className="block text-[#667085] font-bold mb-1">Required Headcount</label>
                  <input
                    type="number"
                    required
                    min={10}
                    value={newReq}
                    onChange={e => setNewReq(Number(e.target.value))}
                    className="w-full bg-[#F1F5F9] border border-transparent rounded-lg p-2 font-semibold text-slate-800 focus:outline-none focus:bg-white focus:border-[#042C51]"
                  />
                </div>

                <div>
                  <label className="block text-[#667085] font-bold mb-1">Current Actual Headcount</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={newAct}
                    onChange={e => setNewAct(Number(e.target.value))}
                    className="w-full bg-[#F1F5F9] border border-transparent rounded-lg p-2 font-semibold text-slate-800 focus:outline-none focus:bg-white focus:border-[#042C51]"
                  />
                </div>

                <div>
                  <label className="block text-[#667085] font-bold mb-1">Hired Year-to-Date</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={newHired}
                    onChange={e => setNewHired(Number(e.target.value))}
                    className="w-full bg-[#F1F5F9] border border-transparent rounded-lg p-2 font-semibold text-slate-800 focus:outline-none focus:bg-white focus:border-[#042C51]"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-[#667085] font-bold mb-1">Target Sourcing Hiring Rate (%)</label>
                  <input
                    type="number"
                    required
                    min={5}
                    max={100}
                    value={newHiringRate}
                    onChange={e => setNewHiringRate(Number(e.target.value))}
                    className="w-full bg-[#F1F5F9] border border-transparent rounded-lg p-2 font-semibold text-slate-800 focus:outline-none focus:bg-white focus:border-[#042C51]"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">Yield used to compute Required Leads (Interview / Hiring Rate)</span>
                </div>
              </div>

              <div className="pt-4 border-t flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-lg transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#FF5C28] hover:bg-[#e04f20] text-white font-bold rounded-lg shadow transition-all"
                >
                  Save Draft Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== TECHNICAL REVIEW & SYSTEM ARCHITECTURE MODAL ==================== */}
      {isArchitectureModalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-5">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-5xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="bg-[#042C51] text-white px-6 py-4 flex items-center justify-between border-b border-[#063b6b] shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-tr from-[#FF5C28] to-amber-500 rounded-xl shadow-md">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black tracking-wide text-white">
                      Workforce & Hiring Plan — Technical Review & System Architecture
                    </h3>
                    <span className="px-2 py-0.5 text-[9px] font-black bg-[#FF5C28] text-white rounded-full uppercase tracking-wider">
                      v2.4 Spec
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Operational workflows, cross-system data flows, metric formulas, API contracts & architectural audit.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsArchitectureModalOpen(false)}
                className="text-slate-300 hover:text-white p-2 rounded-xl bg-[#031B33] border border-[#063b6b] hover:border-slate-500 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-[#031B33] px-6 py-2 border-b border-[#063b6b] flex flex-wrap items-center gap-2 shrink-0">
              <button
                onClick={() => setActiveArchTab("process")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeArchTab === "process"
                    ? "bg-[#FF5C28] text-white shadow-sm"
                    : "text-slate-300 hover:bg-[#042C51] hover:text-white"
                }`}
              >
                <Workflow className="w-3.5 h-3.5" />
                <span>1. Process & Purpose</span>
              </button>

              <button
                onClick={() => setActiveArchTab("relationships")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeArchTab === "relationships"
                    ? "bg-[#FF5C28] text-white shadow-sm"
                    : "text-slate-300 hover:bg-[#042C51] hover:text-white"
                }`}
              >
                <Network className="w-3.5 h-3.5" />
                <span>2. Cross-System Map</span>
              </button>

              <button
                onClick={() => setActiveArchTab("api")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeArchTab === "api"
                    ? "bg-[#FF5C28] text-white shadow-sm"
                    : "text-slate-300 hover:bg-[#042C51] hover:text-white"
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>3. API Contracts</span>
              </button>

              <button
                onClick={() => setActiveArchTab("formulas")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeArchTab === "formulas"
                    ? "bg-[#FF5C28] text-white shadow-sm"
                    : "text-slate-300 hover:bg-[#042C51] hover:text-white"
                }`}
              >
                <BarChart2 className="w-3.5 h-3.5" />
                <span>4. Metric Catalog</span>
              </button>

              <button
                onClick={() => setActiveArchTab("filters")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeArchTab === "filters"
                    ? "bg-[#FF5C28] text-white shadow-sm"
                    : "text-slate-300 hover:bg-[#042C51] hover:text-white"
                }`}
              >
                <Filter className="w-3.5 h-3.5" />
                <span>5. Filters & Tables</span>
              </button>

              <button
                onClick={() => setActiveArchTab("audit")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeArchTab === "audit"
                    ? "bg-[#FF5C28] text-white shadow-sm"
                    : "text-slate-300 hover:bg-[#042C51] hover:text-white"
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>6. Modals & Tech Audit</span>
              </button>
            </div>

            {/* Modal Body Content */}
            <div className="p-6 overflow-y-auto flex-1 text-xs space-y-6 bg-[#F8FAFC]">
              {/* TAB 1: PROCESS & PURPOSE */}
              {activeArchTab === "process" && (
                <div className="space-y-5 animate-in fade-in duration-150">
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                    <h4 className="text-sm font-black text-[#042C51] flex items-center gap-2">
                      <Workflow className="w-4 h-4 text-[#FF5C28]" />
                      Core Operational Purpose
                    </h4>
                    <p className="text-slate-600 leading-relaxed text-xs">
                      The Workforce & Hiring Plan module serves as the primary operational forecasting engine for contact center capacity, staffing gaps, training pipeline throughput, and recruitment sourcing targets.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <strong className="text-[#042C51] font-bold block mb-1">1. Contractual vs. Floor Capacity</strong>
                        <p className="text-slate-600 text-[11px]">Compares approved client headcount baselines (Required HC) against live agent availability (Actual Roster) less floor absenteeism.</p>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <strong className="text-[#042C51] font-bold block mb-1">2. Shortfall & Buffer Modeling</strong>
                        <p className="text-slate-600 text-[11px]">Computes Net Actual HC and Buffer % Cushion to trigger immediate hiring shortfall alerts (Hiring Needed).</p>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <strong className="text-[#042C51] font-bold block mb-1">3. 5-Stage Training Pipeline</strong>
                        <p className="text-slate-600 text-[11px]">Tracks candidate conversion through: Accepted JO ➔ NHO ➔ FST ➔ PST ➔ Go Live Deployed.</p>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <strong className="text-[#042C51] font-bold block mb-1">4. Yield-Based Lead Targets</strong>
                        <p className="text-slate-600 text-[11px]">Calculates required applicant lead volumes (Target Leads Needed) based on historical recruitment yield rates.</p>
                      </div>
                    </div>
                  </div>

                  {/* End-to-End Operational Workflow Diagram */}
                  <div className="bg-[#042C51] text-white p-5 rounded-xl border border-[#063b6b] space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-wider text-[#7DD3FC] flex items-center gap-2">
                      <GitBranch className="w-4 h-4 text-[#FF5C28]" />
                      End-to-End Operational Workflow Process Diagram
                    </h4>

                    <div className="space-y-3 font-mono text-[11px]">
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="bg-[#031B33] px-3 py-2 rounded-lg border border-[#063b6b] text-sky-300 font-bold">
                          [A] Capacity Baseline (Required HC)
                        </div>
                        <span className="text-amber-400 font-bold">➔</span>
                        <div className="bg-[#031B33] px-3 py-2 rounded-lg border border-[#063b6b] text-white font-bold">
                          [B] Active Roster Count (Actual HC)
                        </div>
                        <span className="text-amber-400 font-bold">➔</span>
                        <div className="bg-[#031B33] px-3 py-2 rounded-lg border border-[#063b6b] text-rose-300 font-bold">
                          [C] Less Absenteeism Count
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-amber-400 font-bold">➔</span>
                        <div className="bg-[#031B33] px-3 py-2 rounded-lg border border-[#063b6b] text-emerald-300 font-bold">
                          [D] Net Actual HC = Actual - Abs
                        </div>
                        <span className="text-amber-400 font-bold">➔</span>
                        <div className="bg-[#031B33] px-3 py-2 rounded-lg border border-[#063b6b] text-purple-300 font-bold">
                          [E] Buffer % Cushion = ((Net - Req)/Req)*100
                        </div>
                      </div>

                      <div className="p-3 bg-[#031B33] rounded-lg border border-[#063b6b] text-slate-200">
                        <span className="text-amber-400 font-bold block mb-1">[F] Shortfall Evaluation Logic:</span>
                        <p className="text-slate-300">
                          If Net Actual &lt; Required HC ➔ <span className="text-rose-400 font-bold">Hiring Needed = Required HC - Net Actual</span><br />
                          Else ➔ <span className="text-emerald-400 font-bold">Hiring Needed = 0 (Surplus / Compliant)</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap pt-1">
                        <div className="bg-[#031B33] px-3 py-2 rounded-lg border border-[#063b6b] text-amber-300 font-bold">
                          [G] 5-Stage Training Pipeline: JO ➔ NHO ➔ FST ➔ PST ➔ Go Live
                        </div>
                        <span className="text-amber-400 font-bold">➔</span>
                        <div className="bg-[#031B33] px-3 py-2 rounded-lg border border-[#063b6b] text-purple-300 font-bold">
                          [H] Target Leads = Required Hires / Yield Rate
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: CROSS-SYSTEM MAP */}
              {activeArchTab === "relationships" && (
                <div className="space-y-5 animate-in fade-in duration-150">
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                    <h4 className="text-sm font-black text-[#042C51] flex items-center gap-2">
                      <Network className="w-4 h-4 text-[#FF5C28]" />
                      Cross-Module Data Flow &amp; Inter-Module System Relationships
                    </h4>
                    <p className="text-slate-600 leading-relaxed text-xs">
                      The Workforce &amp; Hiring Plan interacts continuously with six adjacent HR and Talent Acquisition modules across the application architecture:
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                      <div className="p-3.5 bg-[#F1F5F9] rounded-xl border border-slate-200 space-y-1">
                        <span className="text-[10px] font-black uppercase text-[#042C51] bg-blue-100 px-2 py-0.5 rounded">
                          Hiring Needs Intake / Requisitions
                        </span>
                        <h5 className="font-bold text-slate-800 text-xs mt-1">Target Capacity Baseline</h5>
                        <p className="text-slate-600 text-[11px]">Supplies the target capacity demand (<strong className="text-[#042C51]">Required HC</strong>) agreed upon in client SOWs.</p>
                      </div>

                      <div className="p-3.5 bg-[#F1F5F9] rounded-xl border border-slate-200 space-y-1">
                        <span className="text-[10px] font-black uppercase text-[#042C51] bg-amber-100 px-2 py-0.5 rounded">
                          Employee Directory &amp; Attendance
                        </span>
                        <h5 className="font-bold text-slate-800 text-xs mt-1">Live Active Roster &amp; Telemetry</h5>
                        <p className="text-slate-600 text-[11px]">Feeds active agent headcount (<strong className="text-[#042C51]">Actual HC</strong>) and daily floor absence records (<strong className="text-[#042C51]">Absenteeism</strong>).</p>
                      </div>

                      <div className="p-3.5 bg-[#F1F5F9] rounded-xl border border-slate-200 space-y-1">
                        <span className="text-[10px] font-black uppercase text-[#042C51] bg-purple-100 px-2 py-0.5 rounded">
                          Candidate Pipeline &amp; Talent Pool
                        </span>
                        <h5 className="font-bold text-slate-800 text-xs mt-1">Training Pipeline Telemetry</h5>
                        <p className="text-slate-600 text-[11px]">Feeds conversion counts (<strong className="text-[#042C51]">Accepted JO, NHO, FST, PST, Go Live</strong>) to measure stage drop-offs.</p>
                      </div>

                      <div className="p-3.5 bg-[#F1F5F9] rounded-xl border border-slate-200 space-y-1">
                        <span className="text-[10px] font-black uppercase text-[#042C51] bg-rose-100 px-2 py-0.5 rounded">
                          Resignation &amp; Attrition Management
                        </span>
                        <h5 className="font-bold text-slate-800 text-xs mt-1">Agent Exit Telemetry</h5>
                        <p className="text-slate-600 text-[11px]">Reports headcount losses (<strong className="text-rose-700">Attrition Count &amp; %</strong>) from agent exits during production or training.</p>
                      </div>

                      <div className="p-3.5 bg-[#F1F5F9] rounded-xl border border-slate-200 space-y-1">
                        <span className="text-[10px] font-black uppercase text-[#042C51] bg-emerald-100 px-2 py-0.5 rounded">
                          Action Items &amp; Task Management
                        </span>
                        <h5 className="font-bold text-slate-800 text-xs mt-1">Remediation Scheduling</h5>
                        <p className="text-slate-600 text-[11px]">Integrates via <strong className="text-[#042C51]">ActionItemModal</strong> to assign tasks to leads when buffer thresholds are violated.</p>
                      </div>

                      <div className="p-3.5 bg-[#F1F5F9] rounded-xl border border-slate-200 space-y-1">
                        <span className="text-[10px] font-black uppercase text-[#042C51] bg-sky-100 px-2 py-0.5 rounded">
                          Weekly Reports &amp; Executive Analytics
                        </span>
                        <h5 className="font-bold text-slate-800 text-xs mt-1">Snapshot Aggregation</h5>
                        <p className="text-slate-600 text-[11px]">Consolidates locked 6-week forecast snapshots into executive dashboards for C-level workforce reporting.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: API CONTRACTS */}
              {activeArchTab === "api" && (
                <div className="space-y-5 animate-in fade-in duration-150">
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                    <h4 className="text-sm font-black text-[#042C51] flex items-center gap-2">
                      <Code className="w-4 h-4 text-[#FF5C28]" />
                      Data Flow Architecture &amp; Backend API Endpoint Contracts
                    </h4>
                    <p className="text-slate-600 leading-relaxed text-xs">
                      Fetched via endpoint adapters in <code className="bg-slate-100 px-1 py-0.5 rounded text-[#042C51] font-mono">src/lib/axios/getWorkforceHiringPlan.js</code> using cookie-authenticated Axios:
                    </p>

                    <div className="space-y-3 pt-1">
                      {/* Contract 1 */}
                      <div className="bg-[#031B33] text-slate-200 p-3.5 rounded-xl border border-[#063b6b] font-mono text-[11px] space-y-1">
                        <div className="flex items-center justify-between text-amber-300">
                          <span className="font-bold">1. GET /api/weekly-hiring-plan/weeks</span>
                          <span className="text-[10px] bg-[#042C51] px-2 py-0.5 rounded text-white font-sans">Available Weeks</span>
                        </div>
                        <p className="text-slate-400 text-[10px]">Returns available 6-week forecast version windows.</p>
                        <pre className="text-emerald-300 text-[10px] bg-[#021224] p-2 rounded border border-[#063b6b] overflow-x-auto">
{`{ data: [{ id: "w20", label: "2024 - Week 20 | May 13 - May 19", startDate: "2024-05-13", endDate: "2024-05-19", year: 2024, weekNumber: 20 }] }`}
                        </pre>
                      </div>

                      {/* Contract 2 */}
                      <div className="bg-[#031B33] text-slate-200 p-3.5 rounded-xl border border-[#063b6b] font-mono text-[11px] space-y-1">
                        <div className="flex items-center justify-between text-amber-300">
                          <span className="font-bold">2. GET /api/weekly-hiring-plan/accounts?cluster={"{cluster}"}&amp;startDate={"{startDate}"}</span>
                          <span className="text-[10px] bg-[#042C51] px-2 py-0.5 rounded text-white font-sans">Account Ledger</span>
                        </div>
                        <p className="text-slate-400 text-[10px]">Returns cluster and account headcount ledgers with training pipeline metrics.</p>
                        <pre className="text-emerald-300 text-[10px] bg-[#021224] p-2 rounded border border-[#063b6b] overflow-x-auto">
{`{ data: [{ account: "Verizon Tech", requiredHeadcount: 1250, actualHeadcount: 1070, bufferPercentage: -14.4, netActualHeadcount: 1000 }] }`}
                        </pre>
                      </div>

                      {/* Contract 3 */}
                      <div className="bg-[#031B33] text-slate-200 p-3.5 rounded-xl border border-[#063b6b] font-mono text-[11px] space-y-1">
                        <div className="flex items-center justify-between text-amber-300">
                          <span className="font-bold">3. POST /api/weekly-hiring-plan/headcount/action-item</span>
                          <span className="text-[10px] bg-[#042C51] px-2 py-0.5 rounded text-white font-sans">Create Action Item</span>
                        </div>
                        <p className="text-slate-400 text-[10px]">Saves mitigation tasks assigned to cluster leads.</p>
                        <pre className="text-emerald-300 text-[10px] bg-[#021224] p-2 rounded border border-[#063b6b] overflow-x-auto">
{`// Payload: { title: "Accelerate FST batch", assignee: "Sarah Jenkins", priority: "High", targetDate: "2026-08-15", account: "Verizon Tech" }`}
                        </pre>
                      </div>
                    </div>

                    {/* Normalization snippet */}
                    <div className="bg-[#021224] text-slate-200 p-4 rounded-xl border border-[#063b6b] space-y-2">
                      <h5 className="text-xs font-bold text-[#7DD3FC] flex items-center gap-2">
                        <Code className="w-3.5 h-3.5 text-[#FF5C28]" />
                        Data Normalization Adapter Layer (WorkforceHiringContextAdapter.jsx)
                      </h5>
                      <pre className="font-mono text-[10px] text-amber-200 overflow-x-auto leading-relaxed">
{`export function buildSummary(totals) {
  const requiredHeadcount = cleanNumber(totals?.requiredHeadcount);
  const actualHeadcount = cleanNumber(totals?.actualHeadcount);
  const absenteeismCount = cleanNumber(totals?.absenteeismCount);
  const netActualHeadcount = Math.max(0, actualHeadcount - absenteeismCount);
  
  const bufferPercentage = requiredHeadcount > 0 
    ? ((netActualHeadcount - requiredHeadcount) / requiredHeadcount) * 100 
    : 0;

  return {
    requiredHeadcount,
    actualHeadcount,
    netActualHeadcount,
    bufferPercentage: Number(bufferPercentage.toFixed(2)),
    hiringNeeded: Math.max(0, requiredHeadcount - netActualHeadcount),
  };
}`}
                      </pre>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: METRIC CATALOG */}
              {activeArchTab === "formulas" && (
                <div className="space-y-5 animate-in fade-in duration-150">
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                    <h4 className="text-sm font-black text-[#042C51] flex items-center gap-2">
                      <BarChart2 className="w-4 h-4 text-[#FF5C28]" />
                      Detailed Metric Catalog &amp; Display Formulas
                    </h4>
                    <p className="text-slate-600 text-xs">
                      Official metric definitions, data sources, and mathematical logic implemented across overview cards, ledgers, and modals:
                    </p>

                    <div className="overflow-x-auto rounded-xl border border-slate-200">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead className="bg-[#042C51] text-white text-[10px] font-bold uppercase tracking-wider">
                          <tr>
                            <th className="px-3 py-2.5">Metric Name</th>
                            <th className="px-3 py-2.5">Data Source</th>
                            <th className="px-3 py-2.5">Mathematical Formula / Logic</th>
                            <th className="px-3 py-2.5">UI Location</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white text-[11px]">
                          <tr className="hover:bg-slate-50">
                            <td className="px-3 py-2 font-bold text-[#042C51]">Required Headcount (HC)</td>
                            <td className="px-3 py-2 text-slate-600">Requisitions DB</td>
                            <td className="px-3 py-2 font-mono text-slate-700">Sum(Approved Requisition Baseline)</td>
                            <td className="px-3 py-2 text-slate-500">Overview, Tables 1 &amp; 2, KPI Modal</td>
                          </tr>
                          <tr className="hover:bg-slate-50">
                            <td className="px-3 py-2 font-bold text-[#042C51]">Actual Headcount (HC)</td>
                            <td className="px-3 py-2 text-slate-600">Active Directory</td>
                            <td className="px-3 py-2 font-mono text-slate-700">Sum(Active Roster Employees)</td>
                            <td className="px-3 py-2 text-slate-500">Overview, Tables 1 &amp; 2, KPI Modal</td>
                          </tr>
                          <tr className="hover:bg-slate-50">
                            <td className="px-3 py-2 font-bold text-[#042C51]">Net Actual Headcount</td>
                            <td className="px-3 py-2 text-slate-600">Computed</td>
                            <td className="px-3 py-2 font-mono text-slate-700">Math.max(0, Actual HC - Absenteeism)</td>
                            <td className="px-3 py-2 text-slate-500">Overview, Tables 1 &amp; 2</td>
                          </tr>
                          <tr className="hover:bg-slate-50">
                            <td className="px-3 py-2 font-bold text-[#042C51]">Buffer Cushion %</td>
                            <td className="px-3 py-2 text-slate-600">Computed</td>
                            <td className="px-3 py-2 font-mono text-slate-700">((Net Actual - Required) / Required) * 100</td>
                            <td className="px-3 py-2 text-slate-500">Overview Cards, Tables 1 &amp; 2, Trend Svg</td>
                          </tr>
                          <tr className="hover:bg-slate-50">
                            <td className="px-3 py-2 font-bold text-[#042C51]">Hiring Needed</td>
                            <td className="px-3 py-2 text-slate-600">Computed Shortfall</td>
                            <td className="px-3 py-2 font-mono text-slate-700">Math.max(0, Required HC - Net Actual)</td>
                            <td className="px-3 py-2 text-slate-500">Overview, Tables 1 &amp; 2, KPI Modal</td>
                          </tr>
                          <tr className="hover:bg-slate-50">
                            <td className="px-3 py-2 font-bold text-[#042C51]">Absenteeism %</td>
                            <td className="px-3 py-2 text-slate-600">Floor Attendance</td>
                            <td className="px-3 py-2 font-mono text-slate-700">(Absenteeism Count / Actual HC) * 100</td>
                            <td className="px-3 py-2 text-slate-500">Tables 1 &amp; 2, Trend Svg</td>
                          </tr>
                          <tr className="hover:bg-slate-50">
                            <td className="px-3 py-2 font-bold text-[#042C51]">Attrition %</td>
                            <td className="px-3 py-2 text-slate-600">Resignation DB</td>
                            <td className="px-3 py-2 font-mono text-slate-700">(Attrition Count / Actual HC) * 100</td>
                            <td className="px-3 py-2 text-slate-500">Tables 1 &amp; 2, Attrition Card</td>
                          </tr>
                          <tr className="hover:bg-slate-50">
                            <td className="px-3 py-2 font-bold text-[#042C51]">5 Training Pipeline Stages</td>
                            <td className="px-3 py-2 text-slate-600">Candidate Funnel</td>
                            <td className="px-3 py-2 font-mono text-slate-700">Accepted JO ➔ NHO ➔ FST ➔ PST ➔ Go Live</td>
                            <td className="px-3 py-2 text-slate-500">Training Pipeline, Tables 1 &amp; 2</td>
                          </tr>
                          <tr className="hover:bg-slate-50">
                            <td className="px-3 py-2 font-bold text-[#042C51]">Target Leads Needed</td>
                            <td className="px-3 py-2 text-slate-600">Yield Engine</td>
                            <td className="px-3 py-2 font-mono text-slate-700">Required Go Live / Historical Yield Rate</td>
                            <td className="px-3 py-2 text-slate-500">Tables 1 &amp; 2, KPI Modal</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: FILTERS & TABLES */}
              {activeArchTab === "filters" && (
                <div className="space-y-5 animate-in fade-in duration-150">
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                    <h4 className="text-sm font-black text-[#042C51] flex items-center gap-2">
                      <Filter className="w-4 h-4 text-[#FF5C28]" />
                      Filter Engine Mechanics &amp; Cascading Behaviors
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                        <strong className="text-xs font-bold text-[#042C51]">1. Weekly Version Filter</strong>
                        <p className="text-slate-600 text-[11px]">Sorted chronologically descending (newest 2026 week at index 0). Re-fetches 6-week trend data and resets cluster/account filters.</p>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                        <strong className="text-xs font-bold text-[#042C51]">2. Cluster Filter</strong>
                        <p className="text-slate-600 text-[11px]">Multi-select dropdown. Dynamically narrows available client accounts to match selected operational cluster.</p>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                        <strong className="text-xs font-bold text-[#042C51]">3. Account Filter</strong>
                        <p className="text-slate-600 text-[11px]">Multi-select dropdown with real-time text search. Instantly filters table ledger rows and recalculates summary totals.</p>
                      </div>
                    </div>

                    <div className="border-t pt-3 space-y-3">
                      <h5 className="font-extrabold text-xs text-[#042C51]">Table Group Bandings &amp; Column Layouts</h5>
                      
                      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                        <span className="text-[10px] font-black uppercase text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
                          Table 1: 6-Week Forecast &amp; Weekly Capacity Ledger
                        </span>
                        <p className="text-slate-600 text-[11px]">Tracks week-by-week rolling capacity projections across 6 forecast weeks.</p>
                        <ul className="list-disc pl-4 text-[11px] text-slate-700 space-y-0.5 font-mono">
                          <li>1. FORECAST WEEK &amp; PERIOD (Forecast Week, Date Range)</li>
                          <li>2. CAPACITY &amp; SHORTFALL (Required HC, Actual HC, Net Actual, Buffer %, Hiring Needed)</li>
                          <li>3. WEEKLY LOSS TELEMETRY (Absenteeism Count/%, Attrition Count/%)</li>
                          <li>4. TRAINING MILESTONE &amp; CONVERSION PIPELINE (Accepted JO, NHO, FST, PST, Go Live)</li>
                          <li>5. YIELD &amp; LEADS TARGET (Hiring Rate %, Target Leads Needed)</li>
                        </ul>
                      </div>

                      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                        <span className="text-[10px] font-black uppercase text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                          Table 2: Multi-Account Capacity &amp; Training Funnel Ledger
                        </span>
                        <p className="text-slate-600 text-[11px]">Unit-by-unit master view comparing all client accounts across operational clusters.</p>
                        <ul className="list-disc pl-4 text-[11px] text-slate-700 space-y-0.5 font-mono">
                          <li>1. IDENTIFICATION &amp; SCOPE (Cluster, Account)</li>
                          <li>2. ACCOUNT CAPACITY &amp; SHORTFALL (Required, Actual, Buffer %, Net Actual, Hiring Needed)</li>
                          <li>3. 6-WEEK CUMULATIVE LOSS TELEMETRY (Absenteeism 6 Wks, Abs Rate %, Attrition 6 Wks, Att Rate %)</li>
                          <li>4. ACCOUNT TRAINING FUNNEL &amp; PLACEMENTS (Accepted JO, NHO, FST, PST, Go Live, Hired Count)</li>
                          <li>5. YIELD &amp; LEADS TARGET (Hiring Rate %, Target Leads)</li>
                          <li>6. ACTIONS (Deep-Dive Inspector trigger button)</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: MODALS & AUDIT */}
              {activeArchTab === "audit" && (
                <div className="space-y-5 animate-in fade-in duration-150">
                  {/* Modal Catalog */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                    <h4 className="text-sm font-black text-[#042C51] flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#FF5C28]" />
                      Interactive Modals &amp; Specification Index
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                        <strong className="text-xs font-bold text-[#042C51]">AIInsightModal</strong>
                        <p className="text-slate-600 text-[11px]">Interactive AI advisor analyzing capacity shortfalls, attrition risk drivers, and batch scheduling recommendations with live Q&amp;A chat.</p>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                        <strong className="text-xs font-bold text-[#042C51]">KPISnapshotModal</strong>
                        <p className="text-slate-600 text-[11px]">Executive metric cards displaying high-level capacity floors (Required HC, Actual HC, Buffer Cushion %, Attrition %, Target Leads) and class start dates.</p>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                        <strong className="text-xs font-bold text-[#042C51]">ViewPlanModal</strong>
                        <p className="text-slate-600 text-[11px]">Full-screen comprehensive audit view presenting historical week-over-week hiring plan logs with export capability.</p>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                        <strong className="text-xs font-bold text-[#042C51]">ForecastWeekAccountDetailsModal</strong>
                        <p className="text-slate-600 text-[11px]">Deep-dive inspector triggered from Table 2 rows showing week-by-week 6-week trajectory and milestone cohort counts.</p>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                        <strong className="text-xs font-bold text-[#042C51]">ActionItemModal</strong>
                        <p className="text-slate-600 text-[11px]">Form modal for creating remediation tasks with Title, Target Account, Assignee, Priority (High/Medium/Low), and Resolution Date.</p>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                        <strong className="text-xs font-bold text-[#042C51]">StatusModal</strong>
                        <p className="text-slate-600 text-[11px]">Toast/dialog feedback confirmation for operational actions (saving plans, exporting reports, assigning tasks).</p>
                      </div>
                    </div>
                  </div>

                  {/* Codebase Risks & Technical Audit */}
                  <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl space-y-3">
                    <h4 className="text-xs font-black uppercase text-rose-900 tracking-wider flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-rose-600" />
                      Codebase Risks, Technical Debt &amp; Architectural Audit Items
                    </h4>

                    <div className="space-y-2 text-[11px] text-rose-900">
                      <div className="p-2.5 bg-white/80 rounded-lg border border-rose-200 space-y-0.5">
                        <strong className="font-bold block text-rose-800">1. Authorization Logic Duplication</strong>
                        <p className="text-slate-700">Route protection uses accessControl.js, navigation uses numeric adminAccess, and local component checks handle action buttons. All three must be kept in sync when adding new features.</p>
                      </div>

                      <div className="p-2.5 bg-white/80 rounded-lg border border-rose-200 space-y-0.5">
                        <strong className="font-bold block text-rose-800">2. Global Provider Mount Cost</strong>
                        <p className="text-slate-700">WorkforceHiringProvider is mounted globally in providers.jsx. Initial fetch effects run on app load; ensure polling or window focus listeners are properly debounced.</p>
                      </div>

                      <div className="p-2.5 bg-white/80 rounded-lg border border-rose-200 space-y-0.5">
                        <strong className="font-bold block text-rose-800">3. Session Expiry Storage Key Divergence</strong>
                        <p className="text-slate-700">Session expiry keys vary across legacy helpers (localStorage.token_expires_at vs sessionStorage.accessTokenExpiresAt).</p>
                      </div>

                      <div className="p-2.5 bg-white/80 rounded-lg border border-rose-200 space-y-0.5">
                        <strong className="font-bold block text-rose-800">4. Bundle Optimization Opportunity</strong>
                        <p className="text-slate-700">The main client bundle can be optimized using React.lazy dynamic imports for secondary modals and audit inspection drawers.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#031B33] border-t border-[#063b6b] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-mono">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>100% Architecture Audit Compliant • Production Ready</span>
              </div>
              <button
                onClick={() => setIsArchitectureModalOpen(false)}
                className="px-5 py-2 bg-[#FF5C28] hover:bg-[#e04f20] text-white font-extrabold text-xs rounded-xl shadow transition-all"
              >
                Close Architecture Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
