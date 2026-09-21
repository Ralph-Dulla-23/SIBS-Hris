import React, { useState, useMemo } from "react";
import { 
  Info, 
  TrendingUp, 
  TrendingDown, 
  ArrowRight, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  SlidersHorizontal, 
  FileSpreadsheet, 
  RefreshCw, 
  Layers, 
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  ArrowUpRight,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  Users,
  Calendar,
  Maximize2
} from "lucide-react";
import WorkforceHiringTrendDetailsModal from "./WorkforceHiringTrendDetailsModal";
import PipelineStageDropChart from "./PipelineStageDropChart";
import { 
  SummaryMetrics, 
  PipelineStage, 
  PipelineDropOff, 
  TrendPoint, 
  DetailRecord, 
  RiskLevel 
} from "../types";

interface OverviewProps {
  metrics: SummaryMetrics;
  pipelineStages: PipelineStage[];
  dropOffs: PipelineDropOff[];
  weeklyTrends: TrendPoint[];
  monthlyTrends: TrendPoint[];
  detailRecords: DetailRecord[];
  activeCluster: string;
  activeAccount: string;
  onRecordClick?: (account: string) => void;
  onRefresh?: () => void;
}

export default function OverviewSection({
  metrics,
  pipelineStages,
  dropOffs,
  weeklyTrends,
  monthlyTrends,
  detailRecords,
  activeCluster,
  activeAccount,
  onRecordClick,
  onRefresh
}: OverviewProps) {
  // Local state
  const [trendMode, setTrendMode] = useState<"weekly" | "monthly">("weekly");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClusterFilter, setSelectedClusterFilter] = useState("All");
  const [selectedRiskFilter, setSelectedRiskFilter] = useState("All");
  const [selectedMasterWeek, setSelectedMasterWeek] = useState<string>("Week 28");
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  // Helper to generate consistent 6-week historical metrics for any record
  const get6WeekHistoryForRecord = (rec: DetailRecord) => {
    const weeks = [
      { period: "Week 23", factor: 0.88, absOffset: -0.8, attOffset: -0.6, risk: RiskLevel.Healthy },
      { period: "Week 24", factor: 0.90, absOffset: -0.6, attOffset: -0.5, risk: RiskLevel.Healthy },
      { period: "Week 25", factor: 0.93, absOffset: +0.2, attOffset: -0.2, risk: rec.riskLevel === RiskLevel.Healthy ? RiskLevel.Healthy : RiskLevel.Watch },
      { period: "Week 26", factor: 0.95, absOffset: -0.3, attOffset: +0.1, risk: rec.riskLevel },
      { period: "Week 27", factor: 0.98, absOffset: +0.1, attOffset: +0.2, risk: rec.riskLevel },
      { period: "Week 28", factor: 1.0, absOffset: 0, attOffset: 0, risk: rec.riskLevel },
    ];

    return weeks.map(w => {
      const req = Math.round(rec.requiredHC * (0.95 + (w.factor - 0.88) * 0.4));
      const act = Math.round(rec.actualHC * w.factor);
      const absPct = Math.max(2, Number((rec.absenteeismPercentage + w.absOffset).toFixed(1)));
      const absCount = Math.round((act * absPct) / 100);
      const attPct = Math.max(1.5, Number((rec.attritionPercentage + w.attOffset).toFixed(1)));
      const attCount = Math.round((act * attPct) / 100);
      const netAct = act - absCount;
      const bufPct = req > 0 ? Number((((netAct - req) / req) * 100).toFixed(1)) : 0;
      const hNeed = Math.max(0, req - netAct);

      const jo = Math.round(rec.acceptedJO * w.factor);
      const nho = Math.round(rec.nho * w.factor);
      const fst = Math.round(rec.fst * w.factor);
      const pst = Math.round(rec.pst * w.factor);
      const goLive = Math.round(rec.goLive * w.factor);
      const hired = Math.round(rec.hiredCount * w.factor);
      const rate = jo > 0 ? Number(((hired / jo) * 100).toFixed(1)) : 0;

      return {
        period: w.period,
        requiredHC: req,
        actualHC: act,
        bufferPercentage: bufPct,
        absenteeismCount: absCount,
        absenteeismPercentage: absPct,
        attritionCount: attCount,
        attritionPercentage: attPct,
        netActualHC: netAct,
        hiringNeeded: hNeed,
        acceptedJO: jo,
        nho,
        fst,
        pst,
        goLive,
        hiredCount: hired,
        hiringRate: rate,
        riskLevel: w.risk
      };
    });
  };
  
  // Sorting state
  const [sortField, setSortField] = useState<keyof DetailRecord>("requiredHC");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Modal state for Trend Details
  const [isTrendDetailsModalOpen, setIsTrendDetailsModalOpen] = useState(false);

  // Active tooltip state for trend chart
  const [activeTrendIdx, setActiveTrendIdx] = useState<number | null>(null);

  // Tooltip helper state
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  // Export notification
  const [showExportToast, setShowExportToast] = useState(false);

  // Drag-to-scroll state for the 20+ column master grid
  const tableContainerRef = React.useRef<HTMLDivElement>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!tableContainerRef.current) return;
    setIsMouseDown(true);
    setStartX(e.pageX - tableContainerRef.current.offsetLeft);
    setScrollLeft(tableContainerRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsMouseDown(false);
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown || !tableContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - tableContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    tableContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const activeTrends = trendMode === "weekly" ? weeklyTrends : monthlyTrends;

  // Compute aggregated transitions reactively for the second dashboard column
  const aggregatedTransitions = useMemo(() => {
    const records = detailRecords.filter(rec => {
      if (activeCluster !== "All Clusters" && rec.cluster !== activeCluster) return false;
      if (activeAccount !== "All Accounts" && rec.account !== activeAccount) return false;
      return true;
    });

    const acceptedJO = records.reduce((sum, r) => sum + r.acceptedJO, 0);
    const nho = records.reduce((sum, r) => sum + r.nho, 0);
    const fst = records.reduce((sum, r) => sum + r.fst, 0);
    const pst = records.reduce((sum, r) => sum + r.pst, 0);
    const goLive = records.reduce((sum, r) => sum + r.goLive, 0);

    const joToNho = Math.max(0, acceptedJO - nho);
    const nhoToFst = Math.max(0, nho - fst);
    const fstToPst = Math.max(0, fst - pst);
    const pstToGoLive = Math.max(0, pst - goLive);
    
    // Total drop-offs aggregated from records
    const totalDrop = records.reduce((sum, r) => sum + r.dropOffCount, 0);
    const nhoToPst = Math.max(0, totalDrop - (joToNho + nhoToFst + fstToPst + pstToGoLive));

    return [
      { label: "Accepted JO ➔ NHO", count: joToNho, pct: acceptedJO > 0 ? (joToNho / acceptedJO) * 100 : 0 },
      { label: "NHO ➔ FST", count: nhoToFst, pct: nho > 0 ? (nhoToFst / nho) * 100 : 0 },
      { label: "FST ➔ PST", count: fstToPst, pct: fst > 0 ? (fstToPst / fst) * 100 : 0 },
      { label: "NHO ➔ PST (Side)", count: nhoToPst, pct: nho > 0 ? (nhoToPst / nho) * 100 : 0 },
      { label: "PST ➔ Go Live", count: pstToGoLive, pct: pst > 0 ? (pstToGoLive / pst) * 100 : 0 }
    ];
  }, [detailRecords, activeCluster, activeAccount]);

  // Filter & Search details
  const filteredRecords = useMemo(() => {
    return detailRecords.filter(rec => {
      // General Header filters
      if (activeCluster !== "All Clusters" && rec.cluster !== activeCluster) return false;
      if (activeAccount !== "All Accounts" && rec.account !== activeAccount) return false;

      // Section-level Table filters
      if (selectedClusterFilter !== "All" && rec.cluster !== selectedClusterFilter) return false;
      if (selectedRiskFilter !== "All" && rec.riskLevel !== selectedRiskFilter) return false;

      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        return (
          rec.account.toLowerCase().includes(query) ||
          rec.cluster.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [detailRecords, activeCluster, activeAccount, selectedClusterFilter, selectedRiskFilter, searchQuery]);

  // Transform records according to selected week (Week 23 - Week 28)
  const displayRecords = useMemo(() => {
    return filteredRecords.map(rec => {
      const history = get6WeekHistoryForRecord(rec);
      if (selectedMasterWeek === "All 6 Weeks") {
        return { ...rec, history };
      }
      const cleanWeek = selectedMasterWeek.replace(" (Current)", "").trim();
      const match = history.find(h => h.period.toLowerCase() === cleanWeek.toLowerCase());
      if (!match) return { ...rec, history };

      return {
        ...rec,
        requiredHC: match.requiredHC,
        actualHC: match.actualHC,
        bufferPercentage: match.bufferPercentage,
        absenteeismCount: match.absenteeismCount,
        absenteeismPercentage: match.absenteeismPercentage,
        attritionCount: match.attritionCount,
        attritionPercentage: match.attritionPercentage,
        netActualHC: match.netActualHC,
        hiringNeeded: match.hiringNeeded,
        acceptedJO: match.acceptedJO,
        nho: match.nho,
        fst: match.fst,
        pst: match.pst,
        goLive: match.goLive,
        dropOffCount: Math.max(0, match.acceptedJO - match.goLive),
        dropOffPercentage: match.acceptedJO > 0 ? Number((((match.acceptedJO - match.goLive) / match.acceptedJO) * 100).toFixed(1)) : 0,
        hiredCount: match.hiredCount,
        hiringRate: match.hiringRate,
        riskLevel: match.riskLevel,
        history
      };
    });
  }, [filteredRecords, selectedMasterWeek]);

  // Aggregated Summary Row calculations (Totals & Weighted Averages for the Table Footer)
  const summaryTotals = useMemo(() => {
    const count = displayRecords.length;
    if (count === 0) {
      return {
        requiredHC: 0,
        actualHC: 0,
        bufferPercentage: 0,
        absenteeismCount: 0,
        absenteeismPercentage: 0,
        attritionCount: 0,
        attritionPercentage: 0,
        netActualHC: 0,
        hiringNeeded: 0,
        acceptedJO: 0,
        nho: 0,
        fst: 0,
        pst: 0,
        goLive: 0,
        joToNhoLoss: 0,
        joToNhoRet: 0,
        nhoToFstLoss: 0,
        nhoToFstRet: 0,
        fstToPstLoss: 0,
        fstToPstRet: 0,
        pstToGoLiveLoss: 0,
        pstToGoLiveRet: 0,
        hiredCount: 0,
        hiringRate: 0,
      };
    }

    const req = displayRecords.reduce((s, r) => s + r.requiredHC, 0);
    const act = displayRecords.reduce((s, r) => s + r.actualHC, 0);
    const absCount = displayRecords.reduce((s, r) => s + r.absenteeismCount, 0);
    const attCount = displayRecords.reduce((s, r) => s + r.attritionCount, 0);
    const netAct = displayRecords.reduce((s, r) => s + r.netActualHC, 0);
    const hireNeed = displayRecords.reduce((s, r) => s + r.hiringNeeded, 0);

    const accJO = displayRecords.reduce((s, r) => s + r.acceptedJO, 0);
    const nho = displayRecords.reduce((s, r) => s + r.nho, 0);
    const fst = displayRecords.reduce((s, r) => s + r.fst, 0);
    const pst = displayRecords.reduce((s, r) => s + r.pst, 0);
    const goLive = displayRecords.reduce((s, r) => s + r.goLive, 0);
    const hired = displayRecords.reduce((s, r) => s + r.hiredCount, 0);

    const bufPct = req > 0 ? Number((((netAct - req) / req) * 100).toFixed(2)) : 0;
    const absPct = act > 0 ? Number(((absCount / act) * 100).toFixed(2)) : 0;
    const attPct = act > 0 ? Number(((attCount / act) * 100).toFixed(2)) : 0;

    const joToNhoLoss = Math.max(0, accJO - nho);
    const joToNhoRet = accJO > 0 ? Number(((nho / accJO) * 100).toFixed(1)) : 0;

    const nhoToFstLoss = Math.max(0, nho - fst);
    const nhoToFstRet = nho > 0 ? Number(((fst / nho) * 100).toFixed(1)) : 0;

    const fstToPstLoss = Math.max(0, fst - pst);
    const fstToPstRet = fst > 0 ? Number(((pst / fst) * 100).toFixed(1)) : 0;

    const pstToGoLiveLoss = Math.max(0, pst - goLive);
    const pstToGoLiveRet = pst > 0 ? Number(((goLive / pst) * 100).toFixed(1)) : 0;

    const hiringRate = accJO > 0 ? Number(((hired / accJO) * 100).toFixed(1)) : 0;

    return {
      requiredHC: req,
      actualHC: act,
      bufferPercentage: bufPct,
      absenteeismCount: absCount,
      absenteeismPercentage: absPct,
      attritionCount: attCount,
      attritionPercentage: attPct,
      netActualHC: netAct,
      hiringNeeded: hireNeed,
      acceptedJO: accJO,
      nho,
      fst,
      pst,
      goLive,
      joToNhoLoss,
      joToNhoRet,
      nhoToFstLoss,
      nhoToFstRet,
      fstToPstLoss,
      fstToPstRet,
      pstToGoLiveLoss,
      pstToGoLiveRet,
      hiredCount: hired,
      hiringRate,
    };
  }, [displayRecords]);

  // Sort records
  const sortedRecords = useMemo(() => {
    const sorted = [...displayRecords];
    sorted.sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      
      if (typeof valA === "number" && typeof valB === "number") {
        return sortDirection === "asc" ? valA - valB : valB - valA;
      }
      return sortDirection === "asc" 
        ? String(valA).localeCompare(String(valB)) 
        : String(valB).localeCompare(String(valA));
    });
    return sorted;
  }, [displayRecords, sortField, sortDirection]);

  // Paginated records
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return sortedRecords.slice(start, start + rowsPerPage);
  }, [sortedRecords, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(sortedRecords.length / rowsPerPage) || 1;

  const handleSort = (field: keyof DetailRecord) => {
    if (sortField === field) {
      setSortDirection(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const toggleRow = (id: string) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleExportTable = () => {
    setShowExportToast(true);
    setTimeout(() => setShowExportToast(false), 3000);
  };

  // SVG Chart Dimensions & Computations
  const chartHeight = 300;
  const chartWidth = 600;
  const paddingX = 42;
  const paddingY = 32;
  const chartStartX = 78; // Inset starting point to leave clean space after Y-axis line & labels
  const chartEndX = chartWidth - 30; // Inset ending point to prevent right-edge text clipping

  const chartPoints = useMemo(() => {
    if (activeTrends.length === 0) return [];
    
    // Find min and max for scaling
    const maxVal = 12; // percentage limit
    const minVal = -8; // buffer goes negative

    return activeTrends.map((pt, idx) => {
      const x = chartStartX + (idx / (activeTrends.length - 1)) * (chartEndX - chartStartX);
      
      // Scaling formula: y = height - paddingY - ((val - min) / (max - min)) * (height - paddingY * 2)
      const absY = chartHeight - paddingY - ((pt.absenteeism - minVal) / (maxVal - minVal)) * (chartHeight - paddingY * 2);
      const attY = chartHeight - paddingY - ((pt.attrition - minVal) / (maxVal - minVal)) * (chartHeight - paddingY * 2);
      const bufY = chartHeight - paddingY - ((pt.buffer - minVal) / (maxVal - minVal)) * (chartHeight - paddingY * 2);
      const zeroY = chartHeight - paddingY - ((0 - minVal) / (maxVal - minVal)) * (chartHeight - paddingY * 2);

      return {
        ...pt,
        x,
        absY,
        attY,
        bufY,
        zeroY
      };
    });
  }, [activeTrends]);

  // Compute trend averages dynamically for the third column
  const trendAverages = useMemo(() => {
    if (chartPoints.length === 0) return { absAvg: 0, attAvg: 0, bufAvg: 0 };
    const absSum = chartPoints.reduce((sum, p) => sum + p.absenteeism, 0);
    const attSum = chartPoints.reduce((sum, p) => sum + p.attrition, 0);
    const bufSum = chartPoints.reduce((sum, p) => sum + p.buffer, 0);
    const n = chartPoints.length;
    return {
      absAvg: parseFloat((absSum / n).toFixed(2)),
      attAvg: parseFloat((attSum / n).toFixed(2)),
      bufAvg: parseFloat((bufSum / n).toFixed(2))
    };
  }, [chartPoints]);

  return (
    <div className="space-y-6 min-w-0 max-w-full overflow-x-hidden">
      {/* Toast Notification */}
      {showExportToast && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#042C51] text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-[#E6ECF2] animate-bounce">
          <FileSpreadsheet className="w-5 h-5 text-[#FF5C28]" />
          <div>
            <p className="text-xs font-bold">Export Complete</p>
            <p className="text-[10px] text-slate-300">workforce_hiring_overview_export.csv downloaded successfully.</p>
          </div>
        </div>
      )}

      {/* ==================== SUMMARY METRICS (9 CARDS) ==================== */}
      <section className="space-y-2 select-none">
        <div className="space-y-0.5">
          <h2 className="text-xs font-black uppercase tracking-wider text-[#042C51] flex items-center gap-1.5">
            <span className="w-2 h-4.5 bg-[#FF5C28] rounded-sm"></span>
            Workforce Plan Overview (Aggregated)
          </h2>
          <p className="text-[11px] text-slate-500 font-semibold">
            Aggregated workforce hiring plan metrics based on the selected week, cluster, and account filters.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 2xl:grid-cols-9 gap-3.5 min-w-0">
          {/* Card 1: Required Headcount */}
          <div className="bg-white p-3.5 rounded-xl border border-[#E6ECF2] shadow-sm flex flex-col justify-between relative overflow-hidden h-[115px]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Required HC</span>
              <div className="w-7 h-7 rounded-full bg-[#E9F0FC] flex items-center justify-center text-[#042C51]">
                <Users className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-1.5">
              <div className="text-xl font-extrabold text-[#042C51] tracking-tight">{metrics.requiredHeadcount.toLocaleString()}</div>
              <div className="text-[9px] text-slate-400 font-bold mt-1 uppercase tracking-wide">Approved baseline</div>
            </div>
          </div>

          {/* Card 2: Actual Headcount */}
          <div className="bg-white p-3.5 rounded-xl border border-[#E6ECF2] shadow-sm flex flex-col justify-between relative overflow-hidden h-[115px]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Actual HC</span>
              <div className="w-7 h-7 rounded-full bg-[#E9F0FC] flex items-center justify-center text-[#042C51]">
                <Users className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-1.5">
              <div className="text-xl font-extrabold text-[#042C51] tracking-tight">{metrics.actualHeadcount.toLocaleString()}</div>
              <div className="text-[9px] text-slate-400 font-bold mt-1 uppercase tracking-wide">Roster count</div>
            </div>
          </div>

          {/* Card 3: Buffer Percentage */}
          <div className="bg-white p-3.5 rounded-xl border border-[#E6ECF2] shadow-sm flex flex-col justify-between relative overflow-hidden h-[115px]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Buffer %</span>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center ${metrics.bufferPercentage < 0 ? "bg-rose-50 text-[#E74C3C]" : "bg-emerald-50 text-emerald-600"}`}>
                <Info className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-1.5">
              <div className={`text-xl font-extrabold tracking-tight ${metrics.bufferPercentage < 0 ? "text-[#E74C3C]" : "text-emerald-600"}`}>
                {metrics.bufferPercentage}%
              </div>
              <div className="text-[9px] text-slate-400 font-bold mt-1 uppercase tracking-wide">vs Required HC</div>
            </div>
          </div>

          {/* Card 4: Absenteeism */}
          <div className="bg-white p-3.5 rounded-xl border border-[#E6ECF2] shadow-sm flex flex-col justify-between relative overflow-hidden h-[115px]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Absenteeism</span>
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-extrabold text-[#E67E22] bg-orange-50 px-1 py-0.2 rounded">
                  {metrics.absenteeismCount}
                </span>
                <div className="w-7 h-7 rounded-full bg-orange-50 flex items-center justify-center text-[#E67E22]">
                  <Calendar className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
            <div className="mt-1.5">
              <div className="text-xl font-extrabold text-[#E67E22] tracking-tight">
                {metrics.absenteeismPercentage}%
              </div>
              <div className="text-[9px] text-[#E67E22] font-bold mt-1 uppercase tracking-wide">Absenteeism %</div>
            </div>
          </div>

          {/* Card 5: Attrition */}
          <div className="bg-white p-3.5 rounded-xl border border-[#E6ECF2] shadow-sm flex flex-col justify-between relative overflow-hidden h-[115px]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Attrition</span>
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-extrabold text-[#E74C3C] bg-rose-50 px-1 py-0.2 rounded">
                  {metrics.attritionCount}
                </span>
                <div className="w-7 h-7 rounded-full bg-rose-50 flex items-center justify-center text-[#E74C3C]">
                  <X className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
            <div className="mt-1.5">
              <div className="text-xl font-extrabold text-[#E74C3C] tracking-tight">
                {metrics.attritionPercentage}%
              </div>
              <div className="text-[9px] text-[#E74C3C] font-bold mt-1 uppercase tracking-wide">Attrition %</div>
            </div>
          </div>

          {/* Card 6: Net Actual HC */}
          <div className="bg-white p-3.5 rounded-xl border border-[#E6ECF2] shadow-sm flex flex-col justify-between relative overflow-hidden h-[115px]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Net Actual HC</span>
              <div className="w-7 h-7 rounded-full bg-[#E9F0FC] flex items-center justify-center text-[#042C51]">
                <Users className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-1.5">
              <div className="text-xl font-extrabold text-[#042C51] tracking-tight">{metrics.netActualHC.toLocaleString()}</div>
              <div className="text-[9px] text-slate-400 font-bold mt-1 uppercase tracking-wide font-mono">Floor availability</div>
            </div>
          </div>

          {/* Card 7: Hiring Needed */}
          <div className="bg-white p-3.5 rounded-xl border border-[#E6ECF2] shadow-sm flex flex-col justify-between relative overflow-hidden h-[115px]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Hiring Needed</span>
              <div className="w-7 h-7 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-1.5">
              <div className="text-xl font-extrabold text-indigo-600 tracking-tight">{metrics.hiringNeeded.toLocaleString()}</div>
              <div className="text-[9px] text-slate-400 font-bold mt-1 uppercase tracking-wide">Total coverage gap</div>
            </div>
          </div>

          {/* Card 8: Hiring Rate */}
          <div className="bg-white p-3.5 rounded-xl border border-[#E6ECF2] shadow-sm flex flex-col justify-between relative overflow-hidden h-[115px]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Hiring Rate</span>
              <div className="w-7 h-7 rounded-full bg-teal-50 flex items-center justify-center text-teal-600">
                <TrendingUp className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-1.5">
              <div className="text-xl font-extrabold text-teal-600 tracking-tight">{metrics.hiringRate}%</div>
              <div className="text-[9px] text-slate-400 font-bold mt-1 uppercase tracking-wide font-mono">Leads to JO yield</div>
            </div>
          </div>

          {/* Card 9: Hired Count */}
          <div className="bg-white p-3.5 rounded-xl border border-[#E6ECF2] shadow-sm flex flex-col justify-between relative overflow-hidden h-[115px]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Hired Count</span>
              <div className="w-7 h-7 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                <CheckCircle className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-1.5">
              <div className="text-xl font-extrabold text-emerald-600 tracking-tight">{metrics.hiredCount}</div>
              <div className="text-[9px] text-slate-400 font-bold mt-1 uppercase tracking-wide">Deployed hires</div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SEQUENTIAL FLOW & STAGE DROP ATTRITION GRAPH ==================== */}
      <PipelineStageDropChart
        title="Pipeline Flow & Stage Drop Attrition Graph"
        subtitle="Visual representation of candidate volumes, stage connectors, and attrition drop counts (-Drop Count / % Attrition)."
        stages={[
          { name: "Accepted", shortName: "Job Offer", count: pipelineStages[0]?.count || 0, subtitle: "Accepted JO", color: "#042C51" },
          { name: "NHO", shortName: "Count", count: pipelineStages[1]?.count || 0, subtitle: "NHO Count", color: "#2563EB" },
          { name: "FST", shortName: "Count", count: pipelineStages[2]?.count || 0, subtitle: "FST Count", color: "#0D9488" },
          { name: "PST", shortName: "Count", count: pipelineStages[3]?.count || 0, subtitle: "PST Count", color: "#EA580C" },
          { name: "Go Live", shortName: "Count", count: pipelineStages[4]?.count || 0, subtitle: "Go Live", color: "#15803D" },
        ]}
      />

      {/* ==================== 3-COLUMN DASHBOARD ROW ==================== */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-6 select-none">
        {/* Column 1: PIPELINE FLOW - TOTAL (6 WEEKS) */}
        <div className="xl:col-span-4 bg-white p-4 rounded-2xl border border-[#E6ECF2] shadow-sm flex flex-col justify-between space-y-3">
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-[#042C51] flex items-center gap-1.5">
              <span className="w-1.5 h-3.5 bg-[#FF5C28] rounded-sm"></span>
              Pipeline Flow – Total (6 Weeks)
            </h3>
            <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
              Visual stacked funnel depicting active candidate volume and sequential conversion rates.
            </p>
          </div>

          {/* Stacked Funnel SVG Visualizer */}
          <div className="flex justify-center items-center py-2 px-2 bg-slate-50/60 rounded-xl border border-slate-200/80">
            <svg width="340" height="235" viewBox="0 0 340 235" className="w-full max-w-[230px] drop-shadow-sm select-none">
              {/* Level 1: Accepted JO */}
              <polygon points="10,10 330,10 305,50 35,50" fill="#042C51" />
              <text x="170" y="34" fill="#ffffff" fontSize="14" fontWeight="900" textAnchor="middle">
                Accepted JO: {pipelineStages[0]?.count || 0}
              </text>

              {/* Level 2: NHO */}
              <polygon points="38,54 302,54 277,94 63,94" fill="#2563EB" />
              <text x="170" y="78" fill="#ffffff" fontSize="14" fontWeight="900" textAnchor="middle">
                NHO: {pipelineStages[1]?.count || 0}
              </text>

              {/* Level 3: FST */}
              <polygon points="66,98 274,98 249,138 91,138" fill="#0D9488" />
              <text x="170" y="122" fill="#ffffff" fontSize="14" fontWeight="900" textAnchor="middle">
                FST: {pipelineStages[2]?.count || 0}
              </text>

              {/* Level 4: PST */}
              <polygon points="94,142 246,142 221,182 119,182" fill="#EA580C" />
              <text x="170" y="166" fill="#ffffff" fontSize="13" fontWeight="900" textAnchor="middle">
                PST: {pipelineStages[3]?.count || 0}
              </text>

              {/* Level 5: Go Live */}
              <polygon points="122,186 218,186 205,226 135,226" fill="#15803D" />
              <text x="170" y="210" fill="#ffffff" fontSize="13" fontWeight="900" textAnchor="middle">
                Live: {pipelineStages[4]?.count || 0}
              </text>
            </svg>
          </div>

          {/* Conversion Table */}
          <div className="border border-[#E6ECF2] rounded-lg overflow-hidden text-xs">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#E9F0FC] text-[#042C51] font-extrabold uppercase text-[9.5px]">
                <tr>
                  <th className="px-2.5 py-1">Stage</th>
                  <th className="px-2.5 py-1 text-right">Count</th>
                  <th className="px-2.5 py-1 text-right">Step Conv</th>
                  <th className="px-2.5 py-1 text-right">Cum Conv</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6ECF2] font-semibold text-slate-700 bg-white text-[11px]">
                {pipelineStages.map((stage, sIdx) => (
                  <tr key={sIdx} className="hover:bg-slate-50">
                    <td className="px-2.5 py-1 font-bold text-slate-800">{stage.name.split(" — ")[0]}</td>
                    <td className="px-2.5 py-1 text-right font-mono font-bold text-slate-900">{stage.count}</td>
                    <td className="px-2.5 py-1 text-right font-mono">
                      {sIdx === 0 ? "-" : `${stage.conversionFromPrevious}%`}
                    </td>
                    <td className="px-2.5 py-1 text-right font-mono font-black text-[#FF5C28]">
                      {stage.percentageOfJO}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pt-1.5 border-t border-[#E6ECF2] text-center">
            <span className="text-[10px] font-bold text-[#042C51]">
              Hiring Rate (Leads to JO): <strong className="text-[#FF5C28] text-xs font-black">{metrics.hiringRate}%</strong>
            </span>
          </div>
        </div>

        {/* Column 2: ATTRITION BY STAGE - TOTAL (6 WEEKS) */}
        <div className="xl:col-span-3 bg-white p-4 rounded-2xl border border-[#E6ECF2] shadow-sm flex flex-col justify-between space-y-3">
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-[#042C51] flex items-center gap-1.5">
              <span className="w-1.5 h-3.5 bg-[#FF5C28] rounded-sm"></span>
              Attrition by Stage – Total (6 Weeks)
            </h3>
            <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
              Identifies candidate drop-off metrics between consecutive milestone stages.
            </p>
          </div>

          {/* Structured Container for Stage Drop-offs */}
          <div className="bg-slate-50/60 p-2.5 rounded-xl border border-slate-200/80 flex-1 flex flex-col justify-around gap-2">
            {aggregatedTransitions.map((item, idx) => (
              <div key={idx} className="bg-white p-2 rounded-lg border border-[#E6ECF2] shadow-2xs flex flex-col gap-1 hover:border-slate-300 transition-all">
                <div className="flex items-center justify-between text-xs font-bold">
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E74C3C] shrink-0"></span>
                    <span className="text-slate-800 font-extrabold text-[10.5px] truncate max-w-[100px] sm:max-w-none">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-1 font-mono text-[10px] shrink-0">
                    <span className="text-slate-400 font-medium">Loss:</span>
                    <span className="text-[#E74C3C] font-black">{item.count}</span>
                    <span className="text-slate-300">|</span>
                    <span className="text-[#E74C3C] font-black">{item.pct.toFixed(1)}%</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden border border-slate-200/50">
                  <div 
                    className="bg-[#E74C3C] h-full rounded-full transition-all duration-300" 
                    style={{ width: `${Math.max(2, Math.min(100, item.pct))}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Attrition Total Summary Box */}
          <div className="bg-rose-50/60 p-2.5 rounded-xl border border-rose-100 flex items-center justify-between select-none">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-rose-100/80 flex items-center justify-center text-[#E74C3C] shrink-0">
                <X className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-[8.5px] font-extrabold text-rose-500/80 uppercase tracking-wider block">Total Attrition</span>
                <span className="text-[11px] font-black text-rose-950">Aggregate Loss</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-base font-black text-[#E74C3C] block leading-none">{metrics.attritionCount}</span>
              <span className="text-[9.5px] font-bold text-[#E74C3C]">{metrics.attritionPercentage}% rate</span>
            </div>
          </div>
        </div>

        {/* Column 3: 6-WEEK TRENDS */}
        <div className="xl:col-span-5 bg-white p-5 rounded-2xl border border-[#E6ECF2] shadow-sm flex flex-col justify-between space-y-4 relative">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-[#042C51] flex items-center gap-1.5">
                <span className="w-1.5 h-3.5 bg-[#FF5C28] rounded-sm"></span>
                6-Week Trends
              </h3>
              <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
                Historical trajectory of core operational metrics.
              </p>
            </div>

            {/* Action controls: View Trend Details + Weekly/Monthly Toggle */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setIsTrendDetailsModalOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-extrabold bg-[#042C51] text-white hover:bg-[#073d6f] rounded-lg shadow-2xs transition-all cursor-pointer"
                title="Open 6-Week Trend Details Diagnostic Center"
              >
                <Maximize2 className="w-3 h-3 text-[#FF5C28]" />
                <span className="hidden sm:inline">View Trend Details</span>
                <span className="sm:hidden">Details</span>
              </button>

              {/* Weekly/Monthly Toggle */}
              <div className="flex items-center bg-[#F1F5F9] p-0.5 rounded-lg border border-[#E6ECF2]">
                <button
                  onClick={() => { setTrendMode("weekly"); setActiveTrendIdx(null); }}
                  title="Weekly Rolling View (WK)"
                  className={`px-2 py-1 text-[9px] font-black rounded transition-all uppercase tracking-wider cursor-pointer ${
                    trendMode === "weekly" ? "bg-white text-[#042C51] shadow-sm" : "text-slate-500 hover:text-[#042C51]"
                  }`}
                >
                  Wk
                </button>
                <button
                  onClick={() => { setTrendMode("monthly"); setActiveTrendIdx(null); }}
                  title="Monthly Aggregated View (MO)"
                  className={`px-2 py-1 text-[9px] font-black rounded transition-all uppercase tracking-wider cursor-pointer ${
                    trendMode === "monthly" ? "bg-white text-[#042C51] shadow-sm" : "text-slate-500 hover:text-[#042C51]"
                  }`}
                >
                  Mo
                </button>
              </div>
            </div>
          </div>

          {/* Line Chart */}
          <div className="relative border border-slate-200/80 rounded-xl p-3 bg-slate-50/60 flex-1 flex flex-col justify-center">
            {/* Legend with Tooltips */}
            <div className="flex items-center gap-3.5 text-[10px] font-extrabold mb-2 justify-center shrink-0 uppercase tracking-wider">
              <span 
                className="flex items-center gap-1.5 text-slate-700 cursor-help hover:text-[#2563EB] transition-colors"
                title="Absenteeism Rate (ABS %): Percentage of scheduled workforce absent"
              >
                <span className="w-3 h-1 bg-[#2563EB] inline-block rounded-full"></span> ABS %
              </span>
              <span 
                className="flex items-center gap-1.5 text-slate-700 cursor-help hover:text-[#EA580C] transition-colors"
                title="Attrition Rate (ATT %): Percentage of total staff turnover"
              >
                <span className="w-3 h-1 bg-[#EA580C] inline-block rounded-full"></span> ATT %
              </span>
              <span 
                className="flex items-center gap-1.5 text-slate-700 cursor-help hover:text-[#16A34A] transition-colors"
                title="Buffer Cushion Percentage (BUF %): Headcount buffer variance relative to target required capacity"
              >
                <span className="w-3 h-1 bg-[#16A34A] inline-block rounded-full"></span> BUF %
              </span>
            </div>

            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto select-none overflow-visible">
              {/* Horizontal Y-Grid Lines (2% increments for finer guidelines) */}
              {[-8, -6, -4, -2, 0, 2, 4, 6, 8, 10, 12].map((yVal, i) => {
                const scaledY = chartHeight - paddingY - ((yVal - (-8)) / (12 - (-8))) * (chartHeight - paddingY * 2);
                const isZero = yVal === 0;
                const isMajor = yVal % 4 === 0;
                return (
                  <g key={i}>
                    <line
                      x1={paddingX}
                      y1={scaledY}
                      x2={chartWidth - paddingX}
                      y2={scaledY}
                      stroke={isZero ? "#E74C3C" : isMajor ? "#CBD5E1" : "#F1F5F9"}
                      strokeWidth={isZero ? 1.8 : isMajor ? 0.9 : 0.6}
                      strokeDasharray={isZero ? "none" : isMajor ? "3 3" : "2 2"}
                    />
                    {isMajor && (
                      <text
                        x={paddingX - 8}
                        y={scaledY + 3.5}
                        fill={isZero ? "#E74C3C" : "#64748B"}
                        fontSize="10"
                        fontWeight={isZero ? "bold" : "600"}
                        textAnchor="end"
                      >
                        {yVal}%
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Vertical Column Guidelines for each Period */}
              {chartPoints.map((pt, i) => (
                <line
                  key={`v-grid-${i}`}
                  x1={pt.x}
                  y1={paddingY}
                  x2={pt.x}
                  y2={chartHeight - paddingY}
                  stroke="#94A3B8"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                  opacity="0.4"
                />
              ))}

              {/* Axis Boundary Base Lines */}
              <line
                x1={paddingX}
                y1={paddingY}
                x2={paddingX}
                y2={chartHeight - paddingY}
                stroke="#042C51"
                strokeWidth="1.5"
              />
              <line
                x1={paddingX}
                y1={chartHeight - paddingY}
                x2={chartWidth - paddingX}
                y2={chartHeight - paddingY}
                stroke="#042C51"
                strokeWidth="1.5"
              />

              {/* Zero Target reference line for buffer */}
              <text 
                x={chartWidth - paddingX - 10} 
                y={chartHeight - paddingY - ((0 - (-8)) / (12 - (-8))) * (chartHeight - paddingY * 2) - 6} 
                fill="#E74C3C" 
                fontSize="9" 
                fontWeight="bold" 
                textAnchor="end"
              >
                TARGET BUFFER FLOOR (0%)
              </text>

              {/* Draw Lines */}
              {/* Absenteeism Line */}
              <path
                d={chartPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.absY}`).join(" ")}
                fill="none"
                stroke="#2563EB"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Attrition Line */}
              <path
                d={chartPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.attY}`).join(" ")}
                fill="none"
                stroke="#EA580C"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Buffer Line */}
              <path
                d={chartPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.bufY}`).join(" ")}
                fill="none"
                stroke="#16A34A"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Permanent Data Value Labels on Graph Points */}
              {chartPoints.map((pt, idx) => (
                <g key={`perm-label-${idx}`} className="pointer-events-none select-none">
                  {/* Absenteeism Label */}
                  <text
                    x={pt.x}
                    y={pt.absY - 8}
                    fill="#1D4ED8"
                    fontSize="9.5"
                    fontWeight="800"
                    textAnchor="middle"
                    className="drop-shadow-xs"
                  >
                    {pt.absenteeism}%
                  </text>
                  {/* Attrition Label */}
                  <text
                    x={pt.x}
                    y={pt.attY - 8}
                    fill="#C2410C"
                    fontSize="9.5"
                    fontWeight="800"
                    textAnchor="middle"
                    className="drop-shadow-xs"
                  >
                    {pt.attrition}%
                  </text>
                  {/* Buffer Label */}
                  <text
                    x={pt.x}
                    y={pt.bufY + 14}
                    fill={pt.buffer < 0 ? "#DC2626" : "#15803D"}
                    fontSize="9.5"
                    fontWeight="800"
                    textAnchor="middle"
                    className="drop-shadow-xs"
                  >
                    {pt.buffer}%
                  </text>
                </g>
              ))}

              {/* Active Hover Highlight Guidelines */}
              {activeTrendIdx !== null && chartPoints[activeTrendIdx] && (() => {
                const activePt = chartPoints[activeTrendIdx];
                return (
                  <g className="pointer-events-none">
                    <line
                      x1={activePt.x}
                      y1={paddingY}
                      x2={activePt.x}
                      y2={chartHeight - paddingY}
                      stroke="#042C51"
                      strokeWidth="1.5"
                      strokeDasharray="4 3"
                    />
                    <line
                      x1={paddingX}
                      y1={activePt.absY}
                      x2={activePt.x}
                      y2={activePt.absY}
                      stroke="#2563EB"
                      strokeWidth="1.2"
                      strokeDasharray="3 3"
                      opacity="0.8"
                    />
                    <line
                      x1={paddingX}
                      y1={activePt.attY}
                      x2={activePt.x}
                      y2={activePt.attY}
                      stroke="#EA580C"
                      strokeWidth="1.2"
                      strokeDasharray="3 3"
                      opacity="0.8"
                    />
                    <line
                      x1={paddingX}
                      y1={activePt.bufY}
                      x2={activePt.x}
                      y2={activePt.bufY}
                      stroke="#16A34A"
                      strokeWidth="1.2"
                      strokeDasharray="3 3"
                      opacity="0.8"
                    />
                  </g>
                );
              })()}

              {/* Render Dots & Tooltip Target Detectors */}
              {chartPoints.map((pt, idx) => {
                const isActive = activeTrendIdx === idx;
                return (
                  <g key={idx} className="cursor-pointer" onMouseEnter={() => setActiveTrendIdx(idx)}>
                    {/* Larger Dots */}
                    <circle cx={pt.x} cy={pt.absY} r={isActive ? 7 : 4.5} fill="#2563EB" stroke="#fff" strokeWidth="2" />
                    <circle cx={pt.x} cy={pt.attY} r={isActive ? 7 : 4.5} fill="#EA580C" stroke="#fff" strokeWidth="2" />
                    <circle cx={pt.x} cy={pt.bufY} r={isActive ? 7 : 4.5} fill="#16A34A" stroke="#fff" strokeWidth="2" />

                    {/* Interactive invisible detector area */}
                    <rect
                      x={pt.x - 25}
                      y={paddingY}
                      width="50"
                      height={chartHeight - paddingY * 2}
                      fill="transparent"
                    />

                    {/* X Axis label */}
                    <text
                      x={pt.x}
                      y={chartHeight - paddingY + 18}
                      fill="#475569"
                      fontSize="10.5"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {pt.period}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Non-overlapping floating tooltip box inside top right corner */}
            {activeTrendIdx !== null && chartPoints[activeTrendIdx] && (
              <div 
                className="absolute top-2 right-2 bg-[#042C51] text-white p-3 rounded-xl shadow-xl border border-slate-700/80 text-left z-20 w-48 animate-fade-in pointer-events-auto"
              >
                <div className="flex justify-between items-center border-b border-slate-700 pb-1 mb-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-300">
                    {chartPoints[activeTrendIdx].period} Breakdown
                  </span>
                  <button 
                    onClick={() => setActiveTrendIdx(null)}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between items-center" title="Absenteeism Rate (% of scheduled workforce absent)">
                    <span className="text-slate-300 font-medium">Absenteeism (ABS):</span>
                    <strong className="text-[#60A5FA] font-bold font-mono">{chartPoints[activeTrendIdx].absenteeism}%</strong>
                  </div>
                  <div className="flex justify-between items-center" title="Attrition Rate (% of total staff turnover)">
                    <span className="text-slate-300 font-medium">Attrition (ATT):</span>
                    <strong className="text-[#FB923C] font-bold font-mono">{chartPoints[activeTrendIdx].attrition}%</strong>
                  </div>
                  <div className="flex justify-between items-center" title="Buffer Cushion Percentage (headcount buffer variance relative to target)">
                    <span className="text-slate-300 font-medium">Buffer Cushion (BUF):</span>
                    <strong className={`${
                      chartPoints[activeTrendIdx].buffer < 0 ? "text-[#F87171]" : "text-[#4ADE80]"
                    } font-bold font-mono`}>
                      {chartPoints[activeTrendIdx].buffer}%
                    </strong>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Average Stats Boxes with Tooltips */}
          <div className="grid grid-cols-3 gap-2.5 pt-1">
            <div 
              className="bg-slate-50 p-2 rounded-lg border border-slate-100 text-center cursor-help hover:bg-blue-50/50 transition-colors"
              title="Absenteeism Average: Mean absenteeism rate across the selected rolling period"
            >
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider block">ABS AVG</span>
              <strong className="text-sm font-black text-[#2563EB] font-mono">{trendAverages.absAvg}%</strong>
            </div>
            <div 
              className="bg-slate-50 p-2 rounded-lg border border-slate-100 text-center cursor-help hover:bg-amber-50/50 transition-colors"
              title="Attrition Average: Mean attrition rate across the selected rolling period"
            >
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider block">ATT AVG</span>
              <strong className="text-sm font-black text-[#EA580C] font-mono">{trendAverages.attAvg}%</strong>
            </div>
            <div 
              className="bg-slate-50 p-2 rounded-lg border border-slate-100 text-center cursor-help hover:bg-emerald-50/50 transition-colors"
              title="Buffer Cushion Average: Mean buffer cushion percentage across the selected rolling period"
            >
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider block">BUFFER AVG</span>
              <strong className={`text-sm font-black font-mono ${trendAverages.bufAvg < 0 ? "text-rose-600" : "text-emerald-600"}`}>
                {trendAverages.bufAvg}%
              </strong>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== DETAILED PERFORMANCE BY CLUSTER / ACCOUNT MASTER GRID ==================== */}
      <section className="bg-white rounded-2xl border border-[#E6ECF2] shadow-sm overflow-hidden space-y-4 p-5">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-[#042C51] flex items-center gap-2">
              <span className="w-1.5 h-3.5 bg-[#FF5C28] rounded-sm"></span>
              Detailed Performance by Cluster / Account (6-Week Multi-Week Ledger)
            </h3>
            <p className="text-xs text-[#667085]">
              Master unit-level capacity ledger breaking down 6-week historical metrics (Weeks 23–28), contracted requirements, buffer cushion, loss rates, and 5-stage training milestone conversion metrics for every Cluster and Account.
            </p>
          </div>

          {/* Quick Table Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* 6-Week Selector Pills */}
            <div className="flex items-center gap-1 bg-[#F1F5F9] p-1 rounded-xl border border-[#E6ECF2]">
              <span className="text-[10px] font-black text-[#042C51] px-2 flex items-center gap-1 uppercase tracking-wider">
                <Calendar className="w-3 h-3 text-[#FF5C28]" />
                Period:
              </span>
              {["Week 23", "Week 24", "Week 25", "Week 26", "Week 27", "Week 28 (Current)", "All 6 Weeks"].map(w => (
                <button
                  key={w}
                  onClick={() => { setSelectedMasterWeek(w); setCurrentPage(1); }}
                  className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-all ${
                    selectedMasterWeek === w
                      ? "bg-[#042C51] text-white shadow-xs"
                      : "text-slate-600 hover:text-[#042C51] hover:bg-slate-200/60"
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <span className="absolute inset-y-0 left-2.5 flex items-center pointer-events-none">
                <Search className="w-3.5 h-3.5 text-slate-400" />
              </span>
              <input
                type="text"
                placeholder="Search account/cluster..."
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="pl-8 pr-3 py-1.5 bg-[#F1F5F9] border border-transparent rounded-lg text-xs font-semibold focus:outline-none focus:bg-white focus:border-[#042C51] transition-all"
              />
            </div>

            {/* Local Cluster filter */}
            <div className="flex items-center gap-1 bg-[#F1F5F9] px-2 py-1.5 rounded-lg border border-transparent">
              <Filter className="w-3 h-3 text-slate-500" />
              <select
                value={selectedClusterFilter}
                onChange={e => { setSelectedClusterFilter(e.target.value); setCurrentPage(1); }}
                className="bg-transparent border-none text-xs font-bold text-[#042C51] focus:outline-none cursor-pointer"
              >
                <option value="All">All Clusters</option>
                <option value="Telecom & Tech">Telecom & Tech</option>
                <option value="Financial Services">Financial Services</option>
                <option value="Healthcare & Ins.">Healthcare & Ins.</option>
                <option value="Retail & E-Commerce">Retail & E-Commerce</option>
              </select>
            </div>

            {/* Local Risk filter */}
            <select
              value={selectedRiskFilter}
              onChange={e => { setSelectedRiskFilter(e.target.value); setCurrentPage(1); }}
              className="bg-[#F1F5F9] px-2.5 py-1.5 rounded-lg text-xs font-bold text-[#042C51] focus:outline-none cursor-pointer"
            >
              <option value="All">All Risks</option>
              <option value="Healthy">Healthy</option>
              <option value="Watch">Watch</option>
              <option value="At Risk">At Risk</option>
              <option value="Critical">Critical</option>
            </select>

            <button
              onClick={handleExportTable}
              className="px-3 py-1.5 text-xs font-bold bg-[#E9F0FC] hover:bg-blue-100 text-[#042C51] rounded-lg flex items-center gap-1.5 transition-all"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Export Ledger</span>
            </button>
          </div>
        </div>

        {/* Master Ledger Table with Drag-Scroll Capability */}
        <div 
          ref={tableContainerRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className={`w-full max-w-full min-w-0 overflow-x-auto border border-[#E6ECF2] rounded-xl relative select-none cursor-grab ${
            isMouseDown ? "cursor-grabbing" : ""
          }`}
        >
          <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
            <thead className="bg-[#F8FAFC] text-[#042C51] text-[10px] font-bold uppercase tracking-wider sticky top-0 z-10 border-b border-[#CBD5E1] shadow-2xs">
              {/* Category Grouping Row 1 */}
              <tr className="border-b border-[#CBD5E1]">
                <th colSpan={3} className="px-3 py-2 bg-[#E2EBF4] text-[#042C51] border-r border-[#CBD5E1] text-center font-black">
                  1. IDENTIFICATION & SCOPE
                </th>
                <th colSpan={5} className="px-3 py-2 bg-[#EEF4FB] text-[#042C51] border-r border-[#CBD5E1] text-center font-black">
                  2. CAPACITY & BUFFER METRICS
                </th>
                <th colSpan={4} className="px-3 py-2 bg-[#E2EBF4] text-[#042C51] border-r border-[#CBD5E1] text-center font-black">
                  3. CURRENT WEEK LOSS
                </th>
                <th colSpan={5} className="px-3 py-2 bg-[#EEF4FB] text-[#042C51] border-r border-[#CBD5E1] text-center font-black">
                  4. POST-OFFER FUNNEL COUNTS
                </th>
                <th colSpan={4} className="px-3 py-2 bg-[#E2EBF4] text-[#042C51] border-r border-[#CBD5E1] text-center font-black">
                  5. STAGE CONVERSION & RETENTION
                </th>
                <th colSpan={3} className="px-3 py-2 bg-[#EEF4FB] text-[#042C51] text-center font-black">
                  6. YIELD & RISK AUDIT
                </th>
              </tr>

              {/* Individual Column Header Row 2 */}
              <tr className="bg-[#F8FAFC] text-[10px] text-[#042C51]">
                <th className="px-2 py-2.5 text-center w-8 border-r border-[#CBD5E1]">#</th>
                <th className="px-3 py-2.5 cursor-pointer hover:bg-[#E2E8F0] border-r border-[#CBD5E1] transition-colors" onClick={() => handleSort("cluster")}>
                  Cluster {sortField === "cluster" && (sortDirection === "asc" ? "▲" : "▼")}
                </th>
                <th className="px-3 py-2.5 cursor-pointer hover:bg-[#E2E8F0] border-r border-[#CBD5E1] transition-colors" onClick={() => handleSort("account")}>
                  Account {sortField === "account" && (sortDirection === "asc" ? "▲" : "▼")}
                </th>

                <th className="px-3 py-2.5 text-right cursor-pointer hover:bg-[#E2E8F0] transition-colors" onClick={() => handleSort("requiredHC")}>
                  Required HC {sortField === "requiredHC" && (sortDirection === "asc" ? "▲" : "▼")}
                </th>
                <th className="px-3 py-2.5 text-right cursor-pointer hover:bg-[#E2E8F0] transition-colors" onClick={() => handleSort("actualHC")}>
                  Actual HC {sortField === "actualHC" && (sortDirection === "asc" ? "▲" : "▼")}
                </th>
                <th className="px-3 py-2.5 text-right cursor-pointer hover:bg-[#E2E8F0] transition-colors" onClick={() => handleSort("bufferPercentage")}>
                  Buffer % {sortField === "bufferPercentage" && (sortDirection === "asc" ? "▲" : "▼")}
                </th>
                <th className="px-3 py-2.5 text-right cursor-pointer hover:bg-[#E2E8F0] transition-colors" onClick={() => handleSort("netActualHC")}>
                  Net Actual {sortField === "netActualHC" && (sortDirection === "asc" ? "▲" : "▼")}
                </th>
                <th className="px-3 py-2.5 text-right cursor-pointer hover:bg-[#E2E8F0] border-r border-[#CBD5E1] transition-colors" onClick={() => handleSort("hiringNeeded")}>
                  Hiring Needed {sortField === "hiringNeeded" && (sortDirection === "asc" ? "▲" : "▼")}
                </th>

                <th className="px-3 py-2.5 text-right cursor-pointer hover:bg-[#E2E8F0] transition-colors" onClick={() => handleSort("absenteeismCount")}>
                  Absenteeism {sortField === "absenteeismCount" && (sortDirection === "asc" ? "▲" : "▼")}
                </th>
                <th className="px-3 py-2.5 text-right cursor-pointer hover:bg-[#E2E8F0] transition-colors" onClick={() => handleSort("absenteeismPercentage")}>
                  Abs % {sortField === "absenteeismPercentage" && (sortDirection === "asc" ? "▲" : "▼")}
                </th>
                <th className="px-3 py-2.5 text-right cursor-pointer hover:bg-[#E2E8F0] transition-colors" onClick={() => handleSort("attritionCount")}>
                  Attrition {sortField === "attritionCount" && (sortDirection === "asc" ? "▲" : "▼")}
                </th>
                <th className="px-3 py-2.5 text-right cursor-pointer hover:bg-[#E2E8F0] border-r border-[#CBD5E1] transition-colors" onClick={() => handleSort("attritionPercentage")}>
                  Att % {sortField === "attritionPercentage" && (sortDirection === "asc" ? "▲" : "▼")}
                </th>

                <th className="px-3 py-2.5 text-right cursor-pointer hover:bg-[#E2E8F0] transition-colors" onClick={() => handleSort("acceptedJO")}>
                  Accepted JO {sortField === "acceptedJO" && (sortDirection === "asc" ? "▲" : "▼")}
                </th>
                <th className="px-3 py-2.5 text-right cursor-pointer hover:bg-[#E2E8F0] transition-colors" onClick={() => handleSort("nho")}>
                  NHO Count {sortField === "nho" && (sortDirection === "asc" ? "▲" : "▼")}
                </th>
                <th className="px-3 py-2.5 text-right cursor-pointer hover:bg-[#E2E8F0] transition-colors" onClick={() => handleSort("fst")}>
                  FST Count {sortField === "fst" && (sortDirection === "asc" ? "▲" : "▼")}
                </th>
                <th className="px-3 py-2.5 text-right cursor-pointer hover:bg-[#E2E8F0] transition-colors" onClick={() => handleSort("pst")}>
                  PST Count {sortField === "pst" && (sortDirection === "asc" ? "▲" : "▼")}
                </th>
                <th className="px-3 py-2.5 text-right cursor-pointer hover:bg-[#E2E8F0] border-r border-[#CBD5E1] transition-colors" onClick={() => handleSort("goLive")}>
                  Go Live {sortField === "goLive" && (sortDirection === "asc" ? "▲" : "▼")}
                </th>

                <th className="px-3 py-2.5 text-center border-r border-[#CBD5E1]/60">JO ➔ NHO (Drop / Ret%)</th>
                <th className="px-3 py-2.5 text-center border-r border-[#CBD5E1]/60">NHO ➔ FST (Drop / Ret%)</th>
                <th className="px-3 py-2.5 text-center border-r border-[#CBD5E1]/60">FST ➔ PST (Drop / Ret%)</th>
                <th className="px-3 py-2.5 text-center border-r border-[#CBD5E1]">PST ➔ Go Live (Drop / Ret%)</th>

                <th className="px-3 py-2.5 text-right cursor-pointer hover:bg-[#E2E8F0] transition-colors" onClick={() => handleSort("hiredCount")}>
                  Hired Count {sortField === "hiredCount" && (sortDirection === "asc" ? "▲" : "▼")}
                </th>
                <th className="px-3 py-2.5 text-right cursor-pointer hover:bg-[#E2E8F0] transition-colors" onClick={() => handleSort("hiringRate")}>
                  Hiring Rate % {sortField === "hiringRate" && (sortDirection === "asc" ? "▲" : "▼")}
                </th>
                <th className="px-3.5 py-2.5 text-center">Hiring Risk</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-[#E6ECF2] bg-white font-medium">
              {paginatedRecords.length === 0 ? (
                <tr>
                  <td colSpan={24} className="text-center py-10 text-slate-400 font-bold">
                    No matching records found. Try clearing your search or filters.
                  </td>
                </tr>
              ) : (
                paginatedRecords.map(rec => {
                  const isExpanded = expandedRows[rec.id];
                  
                  // Stage transition loss & retention calculations
                  const joToNhoLoss = Math.max(0, rec.acceptedJO - rec.nho);
                  const joToNhoRet = rec.acceptedJO > 0 ? ((rec.nho / rec.acceptedJO) * 100).toFixed(0) : "0";

                  const nhoToFstLoss = Math.max(0, rec.nho - rec.fst);
                  const nhoToFstRet = rec.nho > 0 ? ((rec.fst / rec.nho) * 100).toFixed(0) : "0";

                  const fstToPstLoss = Math.max(0, rec.fst - rec.pst);
                  const fstToPstRet = rec.fst > 0 ? ((rec.pst / rec.fst) * 100).toFixed(0) : "0";

                  const pstToGoLiveLoss = Math.max(0, rec.pst - rec.goLive);
                  const pstToGoLiveRet = rec.pst > 0 ? ((rec.goLive / rec.pst) * 100).toFixed(0) : "0";

                  // Color codes for risk badges
                  let badgeStyle = "bg-emerald-50 text-emerald-700 border-emerald-100";
                  if (rec.riskLevel === RiskLevel.Watch) badgeStyle = "bg-blue-50 text-blue-700 border-blue-100";
                  if (rec.riskLevel === RiskLevel.AtRisk) badgeStyle = "bg-amber-50 text-amber-700 border-amber-100";
                  if (rec.riskLevel === RiskLevel.Critical) badgeStyle = "bg-rose-50 text-rose-700 border-rose-100 animate-pulse";

                  return (
                    <React.Fragment key={rec.id}>
                      <tr className={`hover:bg-[#F1F5F9]/60 transition-colors ${isExpanded ? "bg-[#E9F0FC]/30" : ""}`}>
                        {/* Accordion trigger */}
                        <td className="px-2 py-3 text-center border-r border-[#E6ECF2]">
                          <button
                            onClick={() => toggleRow(rec.id)}
                            className="p-1 rounded hover:bg-slate-200/80 text-slate-500 focus:outline-none transition-colors"
                          >
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                        </td>

                        {/* Cluster */}
                        <td className="px-3 py-3 font-semibold text-slate-500 max-w-[120px] truncate border-r border-[#E6ECF2]">{rec.cluster}</td>

                        {/* Account */}
                        <td className="px-3 py-3 text-[#042C51] font-bold border-r border-[#E6ECF2]">
                          <button
                            onClick={() => onRecordClick && onRecordClick(rec.account)}
                            className="hover:underline hover:text-[#FF5C28] text-left focus:outline-none font-extrabold"
                          >
                            {rec.account}
                          </button>
                        </td>

                        {/* Capacity Metrics */}
                        <td className="px-3 py-3 text-right font-mono font-bold text-slate-700">{rec.requiredHC}</td>
                        <td className="px-3 py-3 text-right font-mono text-slate-600">{rec.actualHC}</td>
                        <td className={`px-3 py-3 text-right font-mono font-bold ${rec.bufferPercentage < 0 ? "text-[#E74C3C]" : "text-[#2ECC71]"}`}>
                          {rec.bufferPercentage}%
                        </td>
                        <td className="px-3 py-3 text-right font-mono font-bold text-[#042C51]">{rec.netActualHC}</td>
                        <td className={`px-3 py-3 text-right font-mono font-bold border-r border-[#E6ECF2] ${rec.hiringNeeded > 0 ? "text-[#E74C3C]" : "text-slate-700"}`}>
                          {rec.hiringNeeded > 0 ? (
                            <span className="bg-rose-50 text-[#E74C3C] px-1.5 py-0.5 rounded font-black border border-rose-100">
                              {rec.hiringNeeded}
                            </span>
                          ) : (
                            0
                          )}
                        </td>

                        {/* Current Week Loss */}
                        <td className="px-3 py-3 text-right font-mono text-slate-700">{rec.absenteeismCount}</td>
                        <td className="px-3 py-3 text-right font-mono font-bold text-slate-800">{rec.absenteeismPercentage}%</td>
                        <td className="px-3 py-3 text-right font-mono text-slate-700">{rec.attritionCount}</td>
                        <td className="px-3 py-3 text-right font-mono font-bold text-slate-800 border-r border-[#E6ECF2]">{rec.attritionPercentage}%</td>

                        {/* Funnel Counts */}
                        <td className="px-3 py-3 text-right font-mono font-bold text-slate-800">{rec.acceptedJO}</td>
                        <td className="px-3 py-3 text-right font-mono text-slate-700">{rec.nho}</td>
                        <td className="px-3 py-3 text-right font-mono text-slate-700">{rec.fst}</td>
                        <td className="px-3 py-3 text-right font-mono text-slate-700">{rec.pst}</td>
                        <td className="px-3 py-3 text-right font-mono font-bold text-emerald-600 border-r border-[#E6ECF2]">{rec.goLive}</td>

                        {/* Stage Conversion & Drop-off */}
                        <td className="px-3 py-3 text-center font-mono">
                          <span className="text-[#E74C3C] font-bold">-{joToNhoLoss}</span>
                          <span className="text-slate-400 text-[10px] ml-1">({joToNhoRet}%)</span>
                        </td>
                        <td className="px-3 py-3 text-center font-mono">
                          <span className="text-[#E74C3C] font-bold">-{nhoToFstLoss}</span>
                          <span className="text-slate-400 text-[10px] ml-1">({nhoToFstRet}%)</span>
                        </td>
                        <td className="px-3 py-3 text-center font-mono">
                          <span className="text-[#E74C3C] font-bold">-{fstToPstLoss}</span>
                          <span className="text-slate-400 text-[10px] ml-1">({fstToPstRet}%)</span>
                        </td>
                        <td className="px-3 py-3 text-center font-mono border-r border-[#E6ECF2]">
                          <span className="text-[#E74C3C] font-bold">-{pstToGoLiveLoss}</span>
                          <span className="text-slate-400 text-[10px] ml-1">({pstToGoLiveRet}%)</span>
                        </td>

                        {/* Yield & Risk */}
                        <td className="px-3 py-3 text-right font-mono font-black text-[#042C51]">{rec.hiredCount}</td>
                        <td className="px-3 py-3 text-right font-mono font-black text-[#FF5C28]">{rec.hiringRate}%</td>
                        <td className="px-3.5 py-3 text-center">
                          <span className={`px-2.5 py-1 text-[10px] font-extrabold rounded-full border ${badgeStyle}`}>
                            {rec.riskLevel}
                          </span>
                        </td>
                      </tr>

                      {/* Expandable row containing detailed 6-week historical breakdown and pipeline metrics */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={24} className="bg-slate-50/90 p-4 border-l-4 border-[#FF5C28]">
                            <div className="space-y-4 text-xs whitespace-normal">
                              {/* 6-Week Historical Ledger Header */}
                              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200">
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4 text-[#FF5C28]" />
                                  <h4 className="font-extrabold text-[#042C51] text-xs uppercase tracking-wider">
                                    6-Week Historical Performance Breakdown — {rec.account} ({rec.cluster})
                                  </h4>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-bold bg-[#042C51] text-white px-2.5 py-0.5 rounded-full">
                                    6-Week Trajectory (Week 23 – Week 28)
                                  </span>
                                  <button
                                    onClick={() => onRecordClick && onRecordClick(rec.account)}
                                    className="px-2.5 py-1 bg-[#FF5C28] hover:bg-[#e04b1a] text-white text-[10px] font-extrabold rounded-md uppercase tracking-wider transition-all cursor-pointer"
                                  >
                                    Workspace Plan
                                  </button>
                                </div>
                              </div>

                              {/* Sub-table displaying 6-Week Breakdown */}
                              <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs">
                                <table className="w-full text-left text-[11px] border-collapse font-medium">
                                  <thead className="bg-[#042C51] text-white text-[9px] font-black uppercase tracking-wider">
                                    <tr>
                                      <th className="p-2 border-r border-[#063b6b]">Week Period</th>
                                      <th className="p-2 text-right">Req HC</th>
                                      <th className="p-2 text-right">Act HC</th>
                                      <th className="p-2 text-right">Buffer %</th>
                                      <th className="p-2 text-right">Abs Count (%)</th>
                                      <th className="p-2 text-right border-r border-[#063b6b]">Att Count (%)</th>
                                      <th className="p-2 text-right">Net Actual</th>
                                      <th className="p-2 text-right border-r border-[#063b6b]">Hiring Needed</th>
                                      <th className="p-2 text-right">Accepted JO</th>
                                      <th className="p-2 text-right">NHO</th>
                                      <th className="p-2 text-right">FST</th>
                                      <th className="p-2 text-right">PST</th>
                                      <th className="p-2 text-right border-r border-[#063b6b]">Go Live</th>
                                      <th className="p-2 text-right">Hired Count</th>
                                      <th className="p-2 text-right">Yield Rate %</th>
                                      <th className="p-2 text-center">Risk Status</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100 font-mono">
                                    {rec.history?.map((w, wIdx) => {
                                      const isCurrentWk = w.period.includes("28") || selectedMasterWeek.includes(w.period);
                                      let rBadge = "bg-emerald-100 text-emerald-800 border-emerald-200";
                                      if (w.riskLevel === RiskLevel.Watch) rBadge = "bg-blue-100 text-blue-800 border-blue-200";
                                      if (w.riskLevel === RiskLevel.AtRisk) rBadge = "bg-amber-100 text-amber-800 border-amber-200";
                                      if (w.riskLevel === RiskLevel.Critical) rBadge = "bg-rose-100 text-rose-800 border-rose-200";

                                      return (
                                        <tr key={wIdx} className={`hover:bg-blue-50/50 transition-colors ${isCurrentWk ? "bg-blue-50/80 font-bold" : ""}`}>
                                          <td className="p-2 font-sans font-extrabold text-[#042C51] border-r border-slate-200 flex items-center justify-between">
                                            <span>{w.period}</span>
                                            {isCurrentWk && <span className="text-[8px] bg-blue-600 text-white px-1.5 py-0.5 rounded uppercase font-black">Active</span>}
                                          </td>
                                          <td className="p-2 text-right text-slate-700">{w.requiredHC}</td>
                                          <td className="p-2 text-right text-slate-700">{w.actualHC}</td>
                                          <td className={`p-2 text-right font-bold ${w.bufferPercentage < 0 ? "text-rose-600" : "text-emerald-600"}`}>
                                            {w.bufferPercentage}%
                                          </td>
                                          <td className="p-2 text-right text-slate-600">{w.absenteeismCount} ({w.absenteeismPercentage}%)</td>
                                          <td className="p-2 text-right text-slate-600 border-r border-slate-200">{w.attritionCount} ({w.attritionPercentage}%)</td>
                                          <td className="p-2 text-right font-bold text-[#042C51]">{w.netActualHC}</td>
                                          <td className={`p-2 text-right font-bold border-r border-slate-200 ${w.hiringNeeded > 0 ? "text-rose-600" : "text-slate-600"}`}>
                                            {w.hiringNeeded}
                                          </td>
                                          <td className="p-2 text-right text-slate-800">{w.acceptedJO}</td>
                                          <td className="p-2 text-right text-slate-700">{w.nho}</td>
                                          <td className="p-2 text-right text-slate-700">{w.fst}</td>
                                          <td className="p-2 text-right text-slate-700">{w.pst}</td>
                                          <td className="p-2 text-right font-bold text-emerald-600 border-r border-slate-200">{w.goLive}</td>
                                          <td className="p-2 text-right font-bold text-[#042C51]">{w.hiredCount}</td>
                                          <td className="p-2 text-right font-bold text-[#FF5C28]">{w.hiringRate}%</td>
                                          <td className="p-2 text-center font-sans">
                                            <span className={`px-2 py-0.5 text-[9px] font-extrabold rounded-full border ${rBadge}`}>
                                              {w.riskLevel}
                                            </span>
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>

                              {/* 3 Summary Cards below table */}
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                                <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1 shadow-2xs">
                                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">6-Week Headcount Ramp</span>
                                  <div className="flex items-baseline justify-between">
                                    <strong className="text-sm font-black text-[#042C51] font-mono">
                                      {rec.history?.[0]?.actualHC || 0} ➔ {rec.history?.[5]?.actualHC || 0}
                                    </strong>
                                    <span className="text-xs font-bold text-emerald-600 font-mono">
                                      +{(rec.history?.[5]?.actualHC || 0) - (rec.history?.[0]?.actualHC || 0)} agents
                                    </span>
                                  </div>
                                </div>

                                <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1 shadow-2xs">
                                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">6-Week Cumulative Hires</span>
                                  <div className="flex items-baseline justify-between">
                                    <strong className="text-sm font-black text-[#FF5C28] font-mono">
                                      {rec.history?.reduce((sum, h) => sum + h.hiredCount, 0) || 0} hired
                                    </strong>
                                    <span className="text-xs font-bold text-slate-500 font-mono">
                                      {rec.history?.reduce((sum, h) => sum + h.goLive, 0) || 0} deployed
                                    </span>
                                  </div>
                                </div>

                                <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1 shadow-2xs">
                                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">6-Week Buffer Trajectory</span>
                                  <div className="flex items-baseline justify-between">
                                    <strong className={`text-sm font-black font-mono ${(rec.history?.[5]?.bufferPercentage || 0) < 0 ? "text-rose-600" : "text-emerald-600"}`}>
                                      {rec.history?.[0]?.bufferPercentage}% ➔ {rec.history?.[5]?.bufferPercentage}%
                                    </strong>
                                    <span className="text-xs font-bold text-slate-500 font-mono">
                                      {((rec.history?.[5]?.bufferPercentage || 0) - (rec.history?.[0]?.bufferPercentage || 0)).toFixed(1)}% shift
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>

            {/* Table Summary Row (TOTAL / AVERAGE) */}
            <tfoot className="bg-[#E2EBF4] text-[#042C51] text-xs font-bold border-t-2 border-[#CBD5E1]">
              <tr>
                <td colSpan={3} className="px-3 py-3 text-left font-black uppercase text-[#042C51] border-r border-[#CBD5E1]">
                  TOTAL / AVERAGE ({filteredRecords.length} ACCOUNTS)
                </td>

                <td className="px-3 py-3 text-right font-mono font-black text-[#042C51]">{summaryTotals.requiredHC}</td>
                <td className="px-3 py-3 text-right font-mono text-slate-700">{summaryTotals.actualHC}</td>
                <td className={`px-3 py-3 text-right font-mono font-black ${summaryTotals.bufferPercentage < 0 ? "text-[#E74C3C]" : "text-[#2ECC71]"}`}>
                  {summaryTotals.bufferPercentage}%
                </td>
                <td className="px-3 py-3 text-right font-mono font-black text-[#042C51]">{summaryTotals.netActualHC}</td>
                <td className="px-3 py-3 text-right font-mono font-black text-[#E74C3C] border-r border-[#CBD5E1]">
                  {summaryTotals.hiringNeeded}
                </td>

                <td className="px-3 py-3 text-right font-mono text-slate-700">{summaryTotals.absenteeismCount}</td>
                <td className="px-3 py-3 text-right font-mono font-black text-[#042C51]">{summaryTotals.absenteeismPercentage}%</td>
                <td className="px-3 py-3 text-right font-mono text-slate-700">{summaryTotals.attritionCount}</td>
                <td className="px-3 py-3 text-right font-mono font-black text-[#042C51] border-r border-[#CBD5E1]">{summaryTotals.attritionPercentage}%</td>

                <td className="px-3 py-3 text-right font-mono font-black text-[#042C51]">{summaryTotals.acceptedJO}</td>
                <td className="px-3 py-3 text-right font-mono text-slate-700">{summaryTotals.nho}</td>
                <td className="px-3 py-3 text-right font-mono text-slate-700">{summaryTotals.fst}</td>
                <td className="px-3 py-3 text-right font-mono text-slate-700">{summaryTotals.pst}</td>
                <td className="px-3 py-3 text-right font-mono font-black text-emerald-700 border-r border-[#CBD5E1]">{summaryTotals.goLive}</td>

                <td className="px-3 py-3 text-center font-mono text-[#E74C3C]">
                  -{summaryTotals.joToNhoLoss} ({summaryTotals.joToNhoRet}%)
                </td>
                <td className="px-3 py-3 text-center font-mono text-[#E74C3C]">
                  -{summaryTotals.nhoToFstLoss} ({summaryTotals.nhoToFstRet}%)
                </td>
                <td className="px-3 py-3 text-center font-mono text-[#E74C3C]">
                  -{summaryTotals.fstToPstLoss} ({summaryTotals.fstToPstRet}%)
                </td>
                <td className="px-3 py-3 text-center font-mono text-[#E74C3C] border-r border-[#CBD5E1]">
                  -{summaryTotals.pstToGoLiveLoss} ({summaryTotals.pstToGoLiveRet}%)
                </td>

                <td className="px-3 py-3 text-right font-mono font-black text-[#042C51]">{summaryTotals.hiredCount}</td>
                <td className="px-3 py-3 text-right font-mono font-black text-[#FF5C28]">{summaryTotals.hiringRate}%</td>
                <td className="px-3 py-3 text-center">
                  <span className="px-2 py-0.5 text-[9px] font-black rounded uppercase bg-[#042C51] text-white">
                    Summary
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Dense pagination footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 pt-2 border-t border-slate-100 select-none">
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <select
              value={rowsPerPage}
              onChange={e => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}
              className="bg-slate-100 border-none font-bold text-[#042C51] px-2 py-1 rounded focus:outline-none cursor-pointer"
            >
              <option value={5}>5 rows</option>
              <option value={10}>10 rows</option>
              <option value={15}>15 rows</option>
            </select>
            <span>Showing {Math.min(filteredRecords.length, (currentPage - 1) * rowsPerPage + 1)}-{Math.min(filteredRecords.length, currentPage * rowsPerPage)} of {filteredRecords.length} records</span>
          </div>

          <div className="flex items-center gap-1.5 self-end sm:self-auto">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-1.5 bg-slate-100 hover:bg-slate-200/80 text-slate-600 rounded disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-extrabold text-[#042C51] px-2">Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 bg-slate-100 hover:bg-slate-200/80 text-slate-600 rounded disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Workforce & Hiring 6-Week Trend Details Diagnostic Center Modal */}
      <WorkforceHiringTrendDetailsModal
        isOpen={isTrendDetailsModalOpen}
        onClose={() => setIsTrendDetailsModalOpen(false)}
        weeklyTrends={weeklyTrends}
        detailRecords={detailRecords}
        initialCluster={selectedClusterFilter}
        initialAccount="All"
      />
    </div>
  );
}
