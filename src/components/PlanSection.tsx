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
  Flag,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  Download
} from "lucide-react";
import { 
  PlanStatus, 
  ActionItemStatus, 
  RiskLevel, 
  WorkforcePlan 
} from "../types";

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
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isKpiModalOpen, setIsKpiModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isViewPlanModalOpen, setIsViewPlanModalOpen] = useState(false);
  const [selectedWeekDetails, setSelectedWeekDetails] = useState<ForecastWeekData | null>(null);
  
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
            <thead className="bg-[#042C51] text-white text-[10px] font-bold uppercase tracking-wider sticky top-0 z-10">
              {/* Category Grouping Row 1 */}
              <tr className="border-b border-[#063b6b]">
                <th colSpan={2} className="px-3 py-2 bg-[#031B33] text-[#7DD3FC] border-r border-[#063b6b] text-center font-black">
                  1. FORECAST WEEK & PERIOD
                </th>
                <th colSpan={5} className="px-3 py-2 bg-[#042C51] text-[#A5F3FC] border-r border-[#063b6b] text-center font-black">
                  2. CAPACITY & SHORTFALL
                </th>
                <th colSpan={4} className="px-3 py-2 bg-[#031B33] text-[#7DD3FC] border-r border-[#063b6b] text-center font-black">
                  3. WEEKLY LOSS TELEMETRY
                </th>
                <th colSpan={5} className="px-3 py-2 bg-[#042C51] text-[#A5F3FC] border-r border-[#063b6b] text-center font-black">
                  4. TRAINING MILESTONE & CONVERSION PIPELINE
                </th>
                <th colSpan={2} className="px-3 py-2 bg-[#031B33] text-[#7DD3FC] text-center font-black">
                  5. YIELD & LEADS TARGET
                </th>
              </tr>

              {/* Individual Column Header Row 2 */}
              <tr className="bg-[#042C51] text-[10px]">
                <th className="px-3 py-2.5 border-r border-[#063b6b]">Forecast Week</th>
                <th className="px-3 py-2.5 border-r border-[#063b6b]">Date Range</th>

                <th className="px-3 py-2.5 text-right">Required HC</th>
                <th className="px-3 py-2.5 text-right">Actual HC</th>
                <th className="px-3 py-2.5 text-right">Net Actual HC</th>
                <th className="px-3 py-2.5 text-right">Buffer %</th>
                <th className="px-3 py-2.5 text-right border-r border-[#063b6b]">Hiring Needed</th>

                <th className="px-3 py-2.5 text-right">Absenteeism</th>
                <th className="px-3 py-2.5 text-right">Abs %</th>
                <th className="px-3 py-2.5 text-right">Attrition</th>
                <th className="px-3 py-2.5 text-right border-r border-[#063b6b]">Att %</th>

                <th className="px-3 py-2.5 text-right">Accepted JO</th>
                <th className="px-3 py-2.5 text-right">NHO Count</th>
                <th className="px-3 py-2.5 text-right">FST Count</th>
                <th className="px-3 py-2.5 text-right">PST Count</th>
                <th className="px-3 py-2.5 text-right border-r border-[#063b6b]">Go Live</th>

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
            <tfoot className="bg-[#042C51] text-white text-xs font-bold border-t-2 border-[#031B33]">
              <tr>
                <td colSpan={2} className="px-3 py-3 text-left font-black uppercase text-[#7DD3FC] border-r border-[#063b6b]">
                  6-WEEK TOTAL / AVERAGE
                </td>

                <td className="px-3 py-3 text-right font-mono font-black text-white">{forecastSummary.avgReq} (avg)</td>
                <td className="px-3 py-3 text-right font-mono text-slate-200">{forecastSummary.avgAct} (avg)</td>
                <td className="px-3 py-3 text-right font-mono font-black text-cyan-300">{forecastSummary.avgNetAct} (avg)</td>
                <td className={`px-3 py-3 text-right font-mono font-black ${forecastSummary.avgBuffer < 0 ? "text-rose-300" : "text-emerald-300"}`}>
                  {forecastSummary.avgBuffer}%
                </td>
                <td className="px-3 py-3 text-right font-mono font-black text-rose-300 border-r border-[#063b6b]">
                  {forecastSummary.hiringNeededSum} (tot)
                </td>

                <td className="px-3 py-3 text-right font-mono text-slate-200">{forecastSummary.absSum} (tot)</td>
                <td className="px-3 py-3 text-right font-mono font-black text-amber-300">{forecastSummary.avgAbsPct}%</td>
                <td className="px-3 py-3 text-right font-mono text-slate-200">{forecastSummary.attSum} (tot)</td>
                <td className="px-3 py-3 text-right font-mono font-black text-amber-300 border-r border-[#063b6b]">{forecastSummary.avgAttPct}%</td>

                <td className="px-3 py-3 text-right font-mono text-slate-200">{forecastSummary.accJOSum}</td>
                <td className="px-3 py-3 text-right font-mono text-slate-200">{forecastSummary.nhoSum}</td>
                <td className="px-3 py-3 text-right font-mono text-slate-200">{forecastSummary.fstSum}</td>
                <td className="px-3 py-3 text-right font-mono text-slate-200">{forecastSummary.pstSum}</td>
                <td className="px-3 py-3 text-right font-mono font-black text-emerald-300 border-r border-[#063b6b]">{forecastSummary.goLiveSum}</td>

                <td className="px-3 py-3 text-right font-mono text-slate-200">{forecastSummary.avgHiringRate}%</td>
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
            <thead className="bg-[#042C51] text-white text-[10px] font-bold uppercase tracking-wider sticky top-0 z-10">
              {/* Category Grouping Row 1 */}
              <tr className="border-b border-[#063b6b]">
                <th colSpan={2} className="px-3 py-2 bg-[#031B33] text-[#7DD3FC] border-r border-[#063b6b] text-center font-black">
                  1. IDENTIFICATION & SCOPE
                </th>
                <th colSpan={5} className="px-3 py-2 bg-[#042C51] text-[#A5F3FC] border-r border-[#063b6b] text-center font-black">
                  2. ACCOUNT CAPACITY & SHORTFALL AVERAGES
                </th>
                <th colSpan={4} className="px-3 py-2 bg-[#031B33] text-[#7DD3FC] border-r border-[#063b6b] text-center font-black">
                  3. 6-WEEK CUMULATIVE LOSS TELEMETRY
                </th>
                <th colSpan={6} className="px-3 py-2 bg-[#042C51] text-[#A5F3FC] border-r border-[#063b6b] text-center font-black">
                  4. ACCOUNT TRAINING FUNNEL & PLACEMENTS
                </th>
                <th colSpan={2} className="px-3 py-2 bg-[#031B33] text-[#7DD3FC] border-r border-[#063b6b] text-center font-black">
                  5. YIELD & LEADS TARGET
                </th>
                <th className="px-3 py-2 bg-[#042C51] text-[#A5F3FC] text-center font-black">
                  6. ACTIONS
                </th>
              </tr>

              {/* Individual Column Header Row 2 */}
              <tr className="bg-[#042C51] text-[10px]">
                <th className="px-3 py-2.5 border-r border-[#063b6b]">Cluster</th>
                <th className="px-3 py-2.5 border-r border-[#063b6b]">Account</th>

                <th className="px-3 py-2.5 text-right">Required HC</th>
                <th className="px-3 py-2.5 text-right">Actual HC</th>
                <th className="px-3 py-2.5 text-right">Buffer %</th>
                <th className="px-3 py-2.5 text-right">Net Actual HC</th>
                <th className="px-3 py-2.5 text-right border-r border-[#063b6b]">Hiring Needed</th>

                <th className="px-3 py-2.5 text-right">Absenteeism (6 Wks)</th>
                <th className="px-3 py-2.5 text-right">Abs Rate %</th>
                <th className="px-3 py-2.5 text-right">Attrition (6 Wks)</th>
                <th className="px-3 py-2.5 text-right border-r border-[#063b6b]">Att Rate %</th>

                <th className="px-3 py-2.5 text-right">Accepted JO</th>
                <th className="px-3 py-2.5 text-right">NHO Count</th>
                <th className="px-3 py-2.5 text-right">FST Count</th>
                <th className="px-3 py-2.5 text-right">PST Count</th>
                <th className="px-3 py-2.5 text-right text-emerald-300">Go Live</th>
                <th className="px-3 py-2.5 text-right text-emerald-300 border-r border-[#063b6b]">Hired Count</th>

                <th className="px-3 py-2.5 text-right">Hiring Rate %</th>
                <th className="px-3 py-2.5 text-right border-r border-[#063b6b]">Target Leads</th>

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
            <tfoot className="bg-[#042C51] text-white text-xs font-bold border-t-2 border-[#031B33]">
              <tr>
                <td colSpan={2} className="px-3 py-3 text-left font-black uppercase text-[#7DD3FC] border-r border-[#063b6b]">
                  TOTAL / AVERAGE ({filteredPlans.length} ACCOUNTS)
                </td>

                <td className="px-3 py-3 text-right font-mono font-black text-white">{accountsSummary.requiredHC}</td>
                <td className="px-3 py-3 text-right font-mono text-slate-200">{accountsSummary.actualHC}</td>
                <td className={`px-3 py-3 text-right font-mono font-black ${accountsSummary.bufferPct < 0 ? "text-rose-300" : "text-emerald-300"}`}>
                  {accountsSummary.bufferPct}%
                </td>
                <td className="px-3 py-3 text-right font-mono font-black text-cyan-300">{accountsSummary.netActualHC}</td>
                <td className="px-3 py-3 text-right font-mono font-black text-rose-300 border-r border-[#063b6b]">
                  {accountsSummary.hiringNeeded}
                </td>

                <td className="px-3 py-3 text-right font-mono text-slate-200">{accountsSummary.absenteeism6Wks}</td>
                <td className="px-3 py-3 text-right font-mono font-black text-amber-300">{accountsSummary.absenteeismRatePct}%</td>
                <td className="px-3 py-3 text-right font-mono text-slate-200">{accountsSummary.attrition6Wks}</td>
                <td className="px-3 py-3 text-right font-mono font-black text-amber-300 border-r border-[#063b6b]">{accountsSummary.attritionRatePct}%</td>

                <td className="px-3 py-3 text-right font-mono text-slate-200">{accountsSummary.acceptedJO}</td>
                <td className="px-3 py-3 text-right font-mono text-slate-200">{accountsSummary.nho}</td>
                <td className="px-3 py-3 text-right font-mono text-slate-200">{accountsSummary.fst}</td>
                <td className="px-3 py-3 text-right font-mono text-slate-200">{accountsSummary.pst}</td>
                <td className="px-3 py-3 text-right font-mono font-black text-emerald-300">{accountsSummary.goLive}</td>
                <td className="px-3 py-3 text-right font-mono font-black text-emerald-300 border-r border-[#063b6b]">{accountsSummary.hiredCount}</td>

                <td className="px-3 py-3 text-right font-mono text-slate-200">{accountsSummary.hiringRatePct}%</td>
                <td className="px-3 py-3 text-right font-mono font-black text-[#FF5C28] border-r border-[#063b6b]">{accountsSummary.leadsNeeded}</td>

                <td className="px-3.5 py-3 text-center">
                  <span className="px-2 py-0.5 text-[9px] font-black rounded uppercase bg-[#063b6b] text-white">
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
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
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
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
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
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#042C51] text-white px-5 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <span>{selectedWeekDetails.weekLabel} Unit-Level Account Drill-Down</span>
                  <span className="px-2 py-0.5 text-[9px] font-black bg-blue-500 text-white rounded">
                    {selectedWeekDetails.dateRange}
                  </span>
                </h3>
                <p className="text-[11px] text-slate-300 mt-0.5">Shift schedules, attendance roster & enrolled candidate cohorts.</p>
              </div>
              <button onClick={() => setSelectedWeekDetails(null)} className="text-slate-300 hover:text-white p-1.5 rounded-lg bg-slate-800">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Required</span>
                  <span className="text-base font-black text-[#042C51] font-mono">{selectedWeekDetails.requiredHC}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Actual Staff</span>
                  <span className="text-base font-black text-slate-800 font-mono">{selectedWeekDetails.actualHC}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Open Gap</span>
                  <span className="text-base font-black text-rose-600 font-mono">
                    {Math.max(0, selectedWeekDetails.requiredHC - (selectedWeekDetails.actualHC - selectedWeekDetails.absenteeismCount - selectedWeekDetails.attritionCount))}
                  </span>
                </div>
              </div>

              {/* Cohort Pipeline */}
              <div className="space-y-2">
                <h4 className="font-extrabold text-[#042C51]">Enrolled Milestone Cohorts ({selectedWeekDetails.weekLabel})</h4>
                <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
                  <div className="bg-blue-50 p-2.5 rounded-lg border border-blue-100">
                    <span className="text-slate-500 font-bold block">NHO</span>
                    <span className="text-sm font-black text-blue-900 font-mono">{selectedWeekDetails.nho}</span>
                  </div>
                  <div className="bg-purple-50 p-2.5 rounded-lg border border-purple-100">
                    <span className="text-slate-500 font-bold block">FST</span>
                    <span className="text-sm font-black text-purple-900 font-mono">{selectedWeekDetails.fst}</span>
                  </div>
                  <div className="bg-amber-50 p-2.5 rounded-lg border border-amber-100">
                    <span className="text-slate-500 font-bold block">PST</span>
                    <span className="text-sm font-black text-amber-900 font-mono">{selectedWeekDetails.pst}</span>
                  </div>
                  <div className="bg-emerald-50 p-2.5 rounded-lg border border-emerald-100">
                    <span className="text-slate-500 font-bold block">Go Live</span>
                    <span className="text-sm font-black text-emerald-900 font-mono">{selectedWeekDetails.goLive}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t flex justify-end">
                <button
                  onClick={() => setSelectedWeekDetails(null)}
                  className="px-4 py-2 bg-[#042C51] text-white font-bold rounded-xl"
                >
                  Close Inspection
                </button>
              </div>
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
    </div>
  );
}
