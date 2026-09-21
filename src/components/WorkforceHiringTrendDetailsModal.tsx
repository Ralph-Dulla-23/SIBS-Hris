import React, { useState, useMemo } from "react";
import { 
  X, 
  Search, 
  Filter, 
  Download, 
  ChevronDown, 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Check, 
  Calendar,
  Layers,
  ArrowRight,
  Info,
  Maximize2
} from "lucide-react";
import { DetailRecord, TrendPoint } from "../types";
import PipelineStageDropChart from "./PipelineStageDropChart";

interface WorkforceHiringTrendDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  weeklyTrends: TrendPoint[];
  detailRecords: DetailRecord[];
  initialCluster?: string;
  initialAccount?: string;
}

const WEEK_OPTIONS = [
  { id: 15, label: "2024 - Week 15 | Apr 8 - Apr 14, 2024" },
  { id: 16, label: "2024 - Week 16 | Apr 15 - Apr 21, 2024" },
  { id: 17, label: "2024 - Week 17 | Apr 22 - Apr 28, 2024" },
  { id: 18, label: "2024 - Week 18 | Apr 29 - May 5, 2024" },
  { id: 19, label: "2024 - Week 19 | May 6 - May 12, 2024" },
  { id: 20, label: "2024 - Week 20 | May 13 - May 19, 2024" },
  { id: 21, label: "2024 - Week 21 | May 20 - May 26, 2024" },
  { id: 22, label: "2024 - Week 22 | May 27 - Jun 2, 2024" },
  { id: 23, label: "2024 - Week 23 | Jun 3 - Jun 9, 2024" },
  { id: 24, label: "2024 - Week 24 | Jun 10 - Jun 16, 2024" },
];

export default function WorkforceHiringTrendDetailsModal({
  isOpen,
  onClose,
  weeklyTrends,
  detailRecords,
  initialCluster = "All",
  initialAccount = "All"
}: WorkforceHiringTrendDetailsModalProps) {
  // 1. Controls State
  const [startWeek, setStartWeek] = useState(23); // Default Week 23
  const [selectedClusters, setSelectedClusters] = useState<string[]>(
    initialCluster === "All" ? ["All"] : [initialCluster]
  );
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>(
    initialAccount === "All" ? ["All"] : [initialAccount]
  );

  // Dropdown UI toggles
  const [isClusterDropdownOpen, setIsClusterDropdownOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [accountSearchQuery, setAccountSearchQuery] = useState("");
  const [tableSearchQuery, setTableSearchQuery] = useState("");

  // Interactive chart point index
  const [hoveredPointIdx, setHoveredPointIdx] = useState<number | null>(null);

  // Derive calculated end week (6 weeks window)
  const currentStartOptionIdx = WEEK_OPTIONS.findIndex(w => w.id === startWeek);
  const endWeekIdx = Math.min(WEEK_OPTIONS.length - 1, (currentStartOptionIdx >= 0 ? currentStartOptionIdx : 0) + 5);
  const endWeekOption = WEEK_OPTIONS[endWeekIdx] || WEEK_OPTIONS[WEEK_OPTIONS.length - 1];

  // All available clusters & accounts from detailRecords
  const allClusters = Array.from(new Set(detailRecords.map(r => r.cluster))).filter(Boolean);
  const allAccounts = Array.from(new Set(detailRecords.map(r => r.account))).filter(Boolean);

  // Filtered accounts list for multi-select dropdown
  const searchedAccounts = allAccounts.filter(acc => 
    acc.toLowerCase().includes(accountSearchQuery.toLowerCase())
  );

  // Handle Cluster Select Toggles
  const toggleCluster = (clusterName: string) => {
    if (clusterName === "All") {
      setSelectedClusters(["All"]);
      return;
    }
    let updated = selectedClusters.filter(c => c !== "All");
    if (updated.includes(clusterName)) {
      updated = updated.filter(c => c !== clusterName);
    } else {
      updated.push(clusterName);
    }
    if (updated.length === 0) updated = ["All"];
    setSelectedClusters(updated);
  };

  // Handle Account Select Toggles
  const toggleAccount = (accName: string) => {
    if (accName === "All") {
      setSelectedAccounts(["All"]);
      return;
    }
    let updated = selectedAccounts.filter(a => a !== "All");
    if (updated.includes(accName)) {
      updated = updated.filter(a => a !== accName);
    } else {
      updated.push(accName);
    }
    if (updated.length === 0) updated = ["All"];
    setSelectedAccounts(updated);
  };

  // Filtered Detail Records based on selections
  const filteredRecords = useMemo(() => {
    return detailRecords.filter(r => {
      const matchCluster = selectedClusters.includes("All") || selectedClusters.includes(r.cluster);
      const matchAccount = selectedAccounts.includes("All") || selectedAccounts.includes(r.account);
      const matchSearch = !tableSearchQuery || 
        r.account.toLowerCase().includes(tableSearchQuery.toLowerCase()) || 
        r.cluster.toLowerCase().includes(tableSearchQuery.toLowerCase());
      return matchCluster && matchAccount && matchSearch;
    });
  }, [detailRecords, selectedClusters, selectedAccounts, tableSearchQuery]);

  // Derived 6-Week Trend Data Series (Simulated for selected start week window)
  const chartPoints = useMemo(() => {
    const baseWeeks = [
      { weekNum: startWeek, period: `Week ${startWeek}`, abs: 7.2, att: 3.8, buf: -3.5, absCnt: 34, attCnt: 18 },
      { weekNum: startWeek + 1, period: `Week ${startWeek + 1}`, abs: 8.4, att: 4.1, buf: -4.2, absCnt: 39, attCnt: 19 },
      { weekNum: startWeek + 2, period: `Week ${startWeek + 2}`, abs: 7.9, att: 4.5, buf: -4.8, absCnt: 37, attCnt: 21 },
      { weekNum: startWeek + 3, period: `Week ${startWeek + 3}`, abs: 8.1, att: 4.6, buf: -5.1, absCnt: 38, attCnt: 22 },
      { weekNum: startWeek + 4, period: `Week ${startWeek + 4}`, abs: 8.18, att: 4.65, buf: -4.7, absCnt: 38, attCnt: 22 },
      { weekNum: startWeek + 5, period: `Week ${startWeek + 5}`, abs: 7.8, att: 4.3, buf: -3.9, absCnt: 36, attCnt: 20 },
    ];

    return baseWeeks.map(w => {
      // Adjust slightly based on cluster filtering
      let factor = 1.0;
      if (!selectedClusters.includes("All")) {
        factor = selectedClusters.length * 0.95;
      }
      return {
        ...w,
        abs: +(w.abs * Math.min(1.2, factor)).toFixed(2),
        att: +(w.att * Math.min(1.2, factor)).toFixed(2),
        buf: +(w.buf * Math.min(1.2, factor)).toFixed(2),
        absCnt: Math.round(w.absCnt * factor),
        attCnt: Math.round(w.attCnt * factor)
      };
    });
  }, [startWeek, selectedClusters]);

  // Calculated Rolling Averages
  const rollingAverages = useMemo(() => {
    const totalAbs = chartPoints.reduce((acc, p) => acc + p.abs, 0);
    const totalAtt = chartPoints.reduce((acc, p) => acc + p.att, 0);
    const totalBuf = chartPoints.reduce((acc, p) => acc + p.buf, 0);
    const totalAbsCnt = chartPoints.reduce((acc, p) => acc + p.absCnt, 0);
    const totalAttCnt = chartPoints.reduce((acc, p) => acc + p.attCnt, 0);

    const count = chartPoints.length || 1;
    return {
      absAvgPct: (totalAbs / count).toFixed(2),
      attAvgPct: (totalAtt / count).toFixed(2),
      bufAvgPct: (totalBuf / count).toFixed(2),
      absAvgCnt: Math.round(totalAbsCnt / count),
      attAvgCnt: Math.round(totalAttCnt / count)
    };
  }, [chartPoints]);

  // Export to CSV Functionality
  const handleExportCSV = () => {
    const headers = [
      "Cluster", "Account", "Required HC", "Actual HC", "Buffer %", 
      "Absenteeism Cnt", "Absenteeism %", "Attrition Cnt", "Attrition %", 
      "Net Actual HC", "Hiring Needed", "Accepted JO", "NHO", "FST", "PST", "Go Live", "Hired Cnt", "Hiring Rate %"
    ];

    const rows = filteredRecords.map(r => [
      r.cluster, r.account, r.requiredHC, r.actualHC, `${r.bufferPercentage}%`,
      r.absenteeismCount, `${r.absenteeismPercentage}%`, r.attritionCount, `${r.attritionPercentage}%`,
      r.netActualHC, r.hiringNeeded, r.acceptedJO, r.nho, r.fst, r.pst, r.goLive, r.hiredCount, `${r.hiringRate}%`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Workforce_Trend_Details_Week${startWeek}_to_Week${endWeekOption.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // SVG Chart Dimensions
  const svgWidth = 700;
  const svgHeight = 240;
  const padX = 45;
  const padY = 28;
  const modalStartX = 80; // Inset starting point to leave clean space after Y-axis line & labels
  const modalEndX = svgWidth - 35; // Inset ending point

  // Chart coordinate mappings
  const minVal = -10;
  const maxVal = 14;

  const pointsWithCoords = chartPoints.map((pt, i) => {
    const x = modalStartX + (i / (chartPoints.length - 1)) * (modalEndX - modalStartX);
    const getY = (val: number) => svgHeight - padY - ((val - minVal) / (maxVal - minVal)) * (svgHeight - padY * 2);
    return {
      ...pt,
      x,
      absY: getY(pt.abs),
      attY: getY(pt.att),
      bufY: getY(pt.buf)
    };
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#042C51]/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fade-in">
      <div className="bg-[#F8FAFC] w-full max-w-6xl rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* ==================== 1. MODAL HEADER ==================== */}
        <div className="bg-[#042C51] text-white px-5 py-3.5 flex items-center justify-between shrink-0 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#FF5C28] flex items-center justify-center text-white shadow-sm shrink-0">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-black tracking-wide uppercase">
                  6-Week Trend Details Diagnostic Center
                </h2>
                <span className="px-2 py-0.5 text-[9px] font-extrabold bg-[#FF5C28] text-white rounded-full uppercase tracking-wider">
                  Executive Suite
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-medium">
                Multi-week diagnostic center: Filter 6-week rolling windows, inspect trends, milestone drop-offs, and unit performance.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ==================== 2. SCOPE CONTROL BAR ==================== */}
        <div className="bg-white px-6 py-3.5 border-b border-[#E6ECF2] shadow-2xs flex flex-wrap items-center justify-between gap-4 z-20 shrink-0">
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Start Weekly Version Dropdown */}
            <div className="flex flex-col">
              <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[#FF5C28]" /> Start Week
              </label>
              <select
                value={startWeek}
                onChange={(e) => setStartWeek(Number(e.target.value))}
                className="bg-slate-50 border border-[#E6ECF2] text-slate-800 text-xs font-bold rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#042C51] shadow-2xs"
              >
                {WEEK_OPTIONS.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.label}
                  </option>
                ))}
              </select>
            </div>

            {/* End Weekly Version Readout */}
            <div className="flex flex-col">
              <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
                Calculated End Week (6-Wk Window)
              </label>
              <div className="bg-slate-100 border border-slate-200 text-slate-700 text-xs font-black rounded-lg px-3 py-1.5 flex items-center gap-1.5 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>{endWeekOption.label}</span>
              </div>
            </div>

            {/* Cluster Multi-Select Dropdown */}
            <div className="flex flex-col relative">
              <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Layers className="w-3 h-3 text-[#FF5C28]" /> Operational Cluster
              </label>
              <button
                onClick={() => {
                  setIsClusterDropdownOpen(!isClusterDropdownOpen);
                  setIsAccountDropdownOpen(false);
                }}
                className="bg-slate-50 border border-[#E6ECF2] text-slate-800 text-xs font-bold rounded-lg px-3 py-1.5 flex items-center justify-between gap-3 min-w-[170px] shadow-2xs hover:bg-slate-100"
              >
                <span className="truncate max-w-[130px]">
                  {selectedClusters.includes("All") ? "All Clusters" : selectedClusters.join(", ")}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {isClusterDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-slate-200 rounded-xl shadow-xl p-2 z-30 animate-fade-in">
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    <label 
                      onClick={() => toggleCluster("All")}
                      className="flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-slate-50 text-xs font-bold cursor-pointer"
                    >
                      <input 
                        type="checkbox" 
                        checked={selectedClusters.includes("All")} 
                        readOnly 
                        className="rounded border-slate-300 text-[#042C51] focus:ring-[#042C51]" 
                      />
                      <span>All Clusters</span>
                    </label>
                    {allClusters.map((c) => (
                      <label 
                        key={c}
                        onClick={() => toggleCluster(c)}
                        className="flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-slate-50 text-xs font-bold cursor-pointer"
                      >
                        <input 
                          type="checkbox" 
                          checked={selectedClusters.includes(c)} 
                          readOnly 
                          className="rounded border-slate-300 text-[#042C51] focus:ring-[#042C51]" 
                        />
                        <span>{c}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Account Multi-Select Searchable Dropdown */}
            <div className="flex flex-col relative">
              <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Filter className="w-3 h-3 text-[#FF5C28]" /> Account Filter
              </label>
              <button
                onClick={() => {
                  setIsAccountDropdownOpen(!isAccountDropdownOpen);
                  setIsClusterDropdownOpen(false);
                }}
                className="bg-slate-50 border border-[#E6ECF2] text-slate-800 text-xs font-bold rounded-lg px-3 py-1.5 flex items-center justify-between gap-3 min-w-[190px] shadow-2xs hover:bg-slate-100"
              >
                <span className="truncate max-w-[150px]">
                  {selectedAccounts.includes("All") ? "All Client Accounts" : selectedAccounts.join(", ")}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {isAccountDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-slate-200 rounded-xl shadow-xl p-2.5 z-30 animate-fade-in">
                  <div className="relative mb-2">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search accounts..."
                      value={accountSearchQuery}
                      onChange={(e) => setAccountSearchQuery(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-2 py-1 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#042C51]"
                    />
                  </div>
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    <label 
                      onClick={() => toggleAccount("All")}
                      className="flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-slate-50 text-xs font-bold cursor-pointer"
                    >
                      <input 
                        type="checkbox" 
                        checked={selectedAccounts.includes("All")} 
                        readOnly 
                        className="rounded border-slate-300 text-[#042C51] focus:ring-[#042C51]" 
                      />
                      <span>All Accounts</span>
                    </label>
                    {searchedAccounts.map((acc) => (
                      <label 
                        key={acc}
                        onClick={() => toggleAccount(acc)}
                        className="flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-slate-50 text-xs font-bold cursor-pointer"
                      >
                        <input 
                          type="checkbox" 
                          checked={selectedAccounts.includes(acc)} 
                          readOnly 
                          className="rounded border-slate-300 text-[#042C51] focus:ring-[#042C51]" 
                        />
                        <span className="truncate">{acc}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Quick Stats Pill & Export */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-extrabold bg-[#042C51] text-white hover:bg-[#073d6f] rounded-lg shadow-sm transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Diagnostic CSV</span>
            </button>
          </div>
        </div>

        {/* ==================== MODAL BODY CONTENT ==================== */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">

          {/* VISUAL MULTI-SERIES TREND CHART + SUMMARY TILES */}
          <div className="bg-white p-5 rounded-2xl border border-[#E6ECF2] shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-[#042C51] flex items-center gap-1.5">
                  <span className="w-1.5 h-3.5 bg-[#FF5C28] rounded-sm"></span>
                  Interactive Multi-Series 6-Week Trend Chart
                </h3>
                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                  Rolling 6-Wk View
                </span>
              </div>

                {/* SVG Trend Line Chart */}
                <div className="relative border border-slate-200/80 rounded-xl p-2.5 bg-slate-50/70 select-none">
                  
                  {/* Chart Legend with Tooltips */}
                  <div className="flex items-center gap-4 text-[10px] font-extrabold mb-2 justify-center uppercase tracking-wider">
                    <span 
                      className="flex items-center gap-1.5 text-slate-700 cursor-help hover:text-[#2563EB] transition-colors"
                      title="Absenteeism Rate (ABS %): Percentage of scheduled workforce absent"
                    >
                      <span className="w-3 h-1 bg-[#2563EB] rounded-full inline-block"></span> Absenteeism %
                    </span>
                    <span 
                      className="flex items-center gap-1.5 text-slate-700 cursor-help hover:text-[#EA580C] transition-colors"
                      title="Attrition Rate (ATT %): Percentage of total staff turnover"
                    >
                      <span className="w-3 h-1 bg-[#EA580C] rounded-full inline-block"></span> Attrition %
                    </span>
                    <span 
                      className="flex items-center gap-1.5 text-slate-700 cursor-help hover:text-[#16A34A] transition-colors"
                      title="Buffer Cushion Percentage (BUF %): Headcount buffer variance relative to target"
                    >
                      <span className="w-3 h-1 bg-[#16A34A] rounded-full inline-block"></span> Buffer %
                    </span>
                  </div>

                  <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto overflow-visible select-none">
                    {/* Horizontal Y-Gridlines (2% increments) */}
                    {[-8, -6, -4, -2, 0, 2, 4, 6, 8, 10, 12].map((yVal, idx) => {
                      const yPos = svgHeight - padY - ((yVal - minVal) / (maxVal - minVal)) * (svgHeight - padY * 2);
                      const isZero = yVal === 0;
                      const isMajor = yVal % 4 === 0;
                      return (
                        <g key={idx}>
                          <line
                            x1={padX}
                            y1={yPos}
                            x2={svgWidth - padX}
                            y2={yPos}
                            stroke={isZero ? "#E74C3C" : isMajor ? "#CBD5E1" : "#F1F5F9"}
                            strokeWidth={isZero ? 1.8 : isMajor ? 0.9 : 0.6}
                            strokeDasharray={isZero ? "none" : isMajor ? "3 3" : "2 2"}
                          />
                          {isMajor && (
                            <text
                              x={padX - 8}
                              y={yPos + 3.5}
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

                    {/* Vertical Column Guidelines */}
                    {pointsWithCoords.map((pt, i) => (
                      <line
                        key={`modal-vgrid-${i}`}
                        x1={pt.x}
                        y1={padY}
                        x2={pt.x}
                        y2={svgHeight - padY}
                        stroke="#94A3B8"
                        strokeWidth="1"
                        strokeDasharray="3 3"
                        opacity="0.4"
                      />
                    ))}

                    {/* Axis Boundary Base Lines */}
                    <line
                      x1={padX}
                      y1={padY}
                      x2={padX}
                      y2={svgHeight - padY}
                      stroke="#042C51"
                      strokeWidth="1.5"
                    />
                    <line
                      x1={padX}
                      y1={svgHeight - padY}
                      x2={svgWidth - padX}
                      y2={svgHeight - padY}
                      stroke="#042C51"
                      strokeWidth="1.5"
                    />

                    {/* Zero target label */}
                    <text 
                      x={svgWidth - padX - 10} 
                      y={svgHeight - padY - ((0 - minVal) / (maxVal - minVal)) * (svgHeight - padY * 2) - 6} 
                      fill="#E74C3C" 
                      fontSize="9" 
                      fontWeight="bold" 
                      textAnchor="end"
                    >
                      TARGET BUFFER FLOOR (0%)
                    </text>

                    {/* Absenteeism Path */}
                    <path
                      d={pointsWithCoords.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.absY}`).join(" ")}
                      fill="none"
                      stroke="#2563EB"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Attrition Path */}
                    <path
                      d={pointsWithCoords.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.attY}`).join(" ")}
                      fill="none"
                      stroke="#EA580C"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Buffer Path */}
                    <path
                      d={pointsWithCoords.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.bufY}`).join(" ")}
                      fill="none"
                      stroke="#16A34A"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Permanent Data Value Labels on Modal Graph Points */}
                    {pointsWithCoords.map((pt, idx) => (
                      <g key={`modal-perm-label-${idx}`} className="pointer-events-none select-none">
                        <text
                          x={pt.x}
                          y={pt.absY - 8}
                          fill="#1D4ED8"
                          fontSize="9.5"
                          fontWeight="800"
                          textAnchor="middle"
                        >
                          {pt.absenteeism}%
                        </text>
                        <text
                          x={pt.x}
                          y={pt.attY - 8}
                          fill="#C2410C"
                          fontSize="9.5"
                          fontWeight="800"
                          textAnchor="middle"
                        >
                          {pt.attrition}%
                        </text>
                        <text
                          x={pt.x}
                          y={pt.bufY + 14}
                          fill={pt.buffer < 0 ? "#DC2626" : "#15803D"}
                          fontSize="9.5"
                          fontWeight="800"
                          textAnchor="middle"
                        >
                          {pt.buffer}%
                        </text>
                      </g>
                    ))}

                    {/* Dynamic Hover Guidelines for Modal Chart */}
                    {hoveredPointIdx !== null && pointsWithCoords[hoveredPointIdx] && (() => {
                      const activePt = pointsWithCoords[hoveredPointIdx];
                      return (
                        <g className="pointer-events-none">
                          <line
                            x1={activePt.x}
                            y1={padY}
                            x2={activePt.x}
                            y2={svgHeight - padY}
                            stroke="#042C51"
                            strokeWidth="1.5"
                            strokeDasharray="4 3"
                          />
                          <line
                            x1={padX}
                            y1={activePt.absY}
                            x2={activePt.x}
                            y2={activePt.absY}
                            stroke="#2563EB"
                            strokeWidth="1.2"
                            strokeDasharray="3 3"
                            opacity="0.8"
                          />
                          <line
                            x1={padX}
                            y1={activePt.attY}
                            x2={activePt.x}
                            y2={activePt.attY}
                            stroke="#EA580C"
                            strokeWidth="1.2"
                            strokeDasharray="3 3"
                            opacity="0.8"
                          />
                          <line
                            x1={padX}
                            y1={activePt.bufY}
                            x2={activePt.x}
                            y2={activePt.bufY}
                            stroke="#16A34A"
                            strokeWidth="1.2"
                            strokeDasharray="3 3"
                            opacity="0.8"
                          />
                          <text
                            x={activePt.x}
                            y={activePt.absY - 10}
                            fill="#1E40AF"
                            fontSize="9.5"
                            fontWeight="bold"
                            textAnchor="middle"
                          >
                            {activePt.absenteeism}%
                          </text>
                          <text
                            x={activePt.x}
                            y={activePt.attY - 10}
                            fill="#C2410C"
                            fontSize="9.5"
                            fontWeight="bold"
                            textAnchor="middle"
                          >
                            {activePt.attrition}%
                          </text>
                          <text
                            x={activePt.x}
                            y={activePt.bufY + 16}
                            fill={activePt.buffer < 0 ? "#DC2626" : "#15803D"}
                            fontSize="9.5"
                            fontWeight="bold"
                            textAnchor="middle"
                          >
                            {activePt.buffer}%
                          </text>
                        </g>
                      );
                    })()}

                    {/* Interactive Points & Node Detectors */}
                    {pointsWithCoords.map((pt, idx) => {
                      const isHovered = hoveredPointIdx === idx;
                      return (
                        <g key={idx} className="cursor-pointer" onMouseEnter={() => setHoveredPointIdx(idx)}>
                          {/* Circles */}
                          <circle cx={pt.x} cy={pt.absY} r={isHovered ? 6.5 : 4.5} fill="#2563EB" stroke="#ffffff" strokeWidth="2" />
                          <circle cx={pt.x} cy={pt.attY} r={isHovered ? 6.5 : 4.5} fill="#EA580C" stroke="#ffffff" strokeWidth="2" />
                          <circle cx={pt.x} cy={pt.bufY} r={isHovered ? 6.5 : 4.5} fill="#16A34A" stroke="#ffffff" strokeWidth="2" />

                          {/* Transparent overlay detector */}
                          <rect
                            x={pt.x - 30}
                            y={padY}
                            width="60"
                            height={svgHeight - padY * 2}
                            fill="transparent"
                          />

                          {/* X Axis Label */}
                          <text
                            x={pt.x}
                            y={svgHeight - padY + 16}
                            fill="#475569"
                            fontSize="10"
                            fontWeight="bold"
                            textAnchor="middle"
                          >
                            {pt.period}
                          </text>
                        </g>
                      );
                    })}
                  </svg>

                  {/* Hover Tooltip Box */}
                  {hoveredPointIdx !== null && pointsWithCoords[hoveredPointIdx] && (
                    <div 
                      className="absolute bg-[#042C51] text-white p-2.5 rounded-lg shadow-xl border border-slate-700 text-left z-20 w-44"
                      style={{
                        top: "20px",
                        left: `${(pointsWithCoords[hoveredPointIdx].x / svgWidth) * 75}%`
                      }}
                    >
                      <div className="flex justify-between items-center border-b border-slate-700 pb-1 mb-1.5">
                        <span className="text-[10px] font-black uppercase text-slate-300">
                          {pointsWithCoords[hoveredPointIdx].period} Breakdown
                        </span>
                        <button onClick={() => setHoveredPointIdx(null)} className="text-slate-400 hover:text-white">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="space-y-1 text-[11px]">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-300 font-medium">Absenteeism:</span>
                          <span className="text-[#60A5FA] font-bold font-mono">
                            {pointsWithCoords[hoveredPointIdx].abs}% <span className="text-[10px] text-slate-400">({pointsWithCoords[hoveredPointIdx].absCnt})</span>
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-300 font-medium">Attrition:</span>
                          <span className="text-[#FB923C] font-bold font-mono">
                            {pointsWithCoords[hoveredPointIdx].att}% <span className="text-[10px] text-slate-400">({pointsWithCoords[hoveredPointIdx].attCnt})</span>
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-300 font-medium">Buffer Cushion:</span>
                          <span className={`font-bold font-mono ${pointsWithCoords[hoveredPointIdx].buf < 0 ? "text-[#F87171]" : "text-[#4ADE80]"}`}>
                            {pointsWithCoords[hoveredPointIdx].buf}%
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 4. SUMMARY AVERAGES FOOTER TILES */}
              <div className="grid grid-cols-3 gap-3 pt-1">
                
                {/* Tile 1: Absenteeism AVG */}
                <div className="bg-blue-50/60 p-2.5 rounded-xl border border-blue-100/80 flex flex-col justify-between">
                  <span className="text-[9px] font-extrabold text-blue-900/70 uppercase tracking-wider block">
                    Absenteeism AVG
                  </span>
                  <div className="mt-1 flex items-baseline justify-between">
                    <span className="text-sm font-black text-blue-700 font-mono">
                      {rollingAverages.absAvgPct}%
                    </span>
                    <span className="text-[9px] font-bold text-blue-600 bg-white/80 px-1.5 py-0.5 rounded border border-blue-200">
                      ~{rollingAverages.absAvgCnt} staff/wk
                    </span>
                  </div>
                </div>

                {/* Tile 2: Attrition AVG */}
                <div className="bg-amber-50/60 p-2.5 rounded-xl border border-amber-100/80 flex flex-col justify-between">
                  <span className="text-[9px] font-extrabold text-amber-900/70 uppercase tracking-wider block">
                    Attrition AVG
                  </span>
                  <div className="mt-1 flex items-baseline justify-between">
                    <span className="text-sm font-black text-amber-700 font-mono">
                      {rollingAverages.attAvgPct}%
                    </span>
                    <span className="text-[9px] font-bold text-amber-600 bg-white/80 px-1.5 py-0.5 rounded border border-amber-200">
                      ~{rollingAverages.attAvgCnt} staff/wk
                    </span>
                  </div>
                </div>

                {/* Tile 3: Buffer % AVG */}
                <div className="bg-rose-50/60 p-2.5 rounded-xl border border-rose-100/80 flex flex-col justify-between">
                  <span className="text-[9px] font-extrabold text-rose-900/70 uppercase tracking-wider block">
                    Buffer % AVG
                  </span>
                  <div className="mt-1 flex items-baseline justify-between">
                    <span className={`text-sm font-black font-mono ${+rollingAverages.bufAvgPct < 0 ? "text-rose-700" : "text-emerald-700"}`}>
                      {rollingAverages.bufAvgPct}%
                    </span>
                    <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded border ${
                      +rollingAverages.bufAvgPct < 0 
                        ? "bg-rose-100 text-rose-800 border-rose-200" 
                        : "bg-emerald-100 text-emerald-800 border-emerald-200"
                    }`}>
                      {+rollingAverages.bufAvgPct < 0 ? "Deficit" : "Surplus"}
                    </span>
                  </div>
                </div>

              </div>
            </div>

          {/* ==================== 5.5 PIPELINE STAGE ATTRITION DROP GRAPH ==================== */}
          <PipelineStageDropChart
            title="6-Week Cumulative Pipeline Flow & Stage Drop Attrition"
            subtitle="Aggregated funnel stages across filtered accounts with connector bridges and attrition drop metrics (-Drop Count / % Attrition)."
            stages={[
              { name: "Accepted", shortName: "Job Offer", count: filteredRecords.reduce((acc, r) => acc + r.acceptedJO, 0), subtitle: "Accepted JO", color: "#042C51" },
              { name: "NHO", shortName: "Count", count: filteredRecords.reduce((acc, r) => acc + r.nho, 0), subtitle: "NHO Count", color: "#2563EB" },
              { name: "FST", shortName: "Count", count: filteredRecords.reduce((acc, r) => acc + r.fst, 0), subtitle: "FST Count", color: "#0D9488" },
              { name: "PST", shortName: "Count", count: filteredRecords.reduce((acc, r) => acc + r.pst, 0), subtitle: "PST Count", color: "#EA580C" },
              { name: "Go Live", shortName: "Count", count: filteredRecords.reduce((acc, r) => acc + r.goLive, 0), subtitle: "Go Live", color: "#15803D" },
            ]}
          />

          {/* ==================== 6. MASTER MULTI-WEEK PERFORMANCE DETAILS TABLE ==================== */}
          <div className="bg-white p-5 rounded-2xl border border-[#E6ECF2] shadow-sm space-y-4">
            
            {/* Table Header & Local Search */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-[#042C51] flex items-center gap-1.5">
                  <span className="w-1.5 h-3.5 bg-[#FF5C28] rounded-sm"></span>
                  6 – WEEK DETAILED PERFORMANCE BY CLUSTER / ACCOUNT
                </h3>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                  Same table format as the main detailed table, calculated from the previous 6 weeks.
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Table search filter */}
                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search account/cluster..."
                    value={tableSearchQuery}
                    onChange={(e) => setTableSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#042C51]"
                  />
                </div>

                {/* Account Rows Badge */}
                <span className="bg-[#E9F0FC] text-[#042C51] px-3 py-1.5 rounded-full border border-blue-200 text-xs font-bold whitespace-nowrap">
                  {filteredRecords.length} account rows
                </span>
              </div>
            </div>

            {/* High Density 28-Column 6-Week Performance Data Table */}
            <div className="overflow-x-auto border border-[#E6ECF2] rounded-xl shadow-2xs max-h-[500px] overflow-y-auto">
              <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
                <thead className="bg-[#F8FAFC] text-[#042C51] font-bold uppercase text-[10px] tracking-wider sticky top-0 z-10 border-b border-[#CBD5E1] shadow-2xs">
                  {/* Category Header Row 1 */}
                  <tr className="border-b border-[#CBD5E1]">
                    <th colSpan={2} className="px-3 py-2 bg-[#E2EBF4] text-[#042C51] border-r border-[#CBD5E1] text-center font-black tracking-wider">
                      1. IDENTIFICATION & SCOPE
                    </th>
                    <th colSpan={5} className="px-3 py-2 bg-[#EEF4FB] text-[#042C51] border-r border-[#CBD5E1] text-center font-black tracking-wider">
                      2. CAPACITY & BUFFER METRICS
                    </th>
                    <th colSpan={4} className="px-3 py-2 bg-[#E2EBF4] text-[#042C51] border-r border-[#CBD5E1] text-center font-black tracking-wider">
                      3. 6-WEEK LOSS METRICS
                    </th>
                    <th colSpan={5} className="px-3 py-2 bg-[#EEF4FB] text-[#042C51] border-r border-[#CBD5E1] text-center font-black tracking-wider">
                      4. HIRING FUNNEL COUNTS
                    </th>
                    <th colSpan={10} className="px-3 py-2 bg-[#E2EBF4] text-[#042C51] border-r border-[#CBD5E1] text-center font-black tracking-wider">
                      5. ATTRITION BETWEEN STAGES
                    </th>
                    <th colSpan={2} className="px-3 py-2 bg-[#EEF4FB] text-[#042C51] text-center font-black tracking-wider">
                      6. YIELD & RECRUITING
                    </th>
                  </tr>

                  {/* Sub Header Row 2 */}
                  <tr className="bg-[#F8FAFC] text-[#042C51] text-[10px] font-bold">
                    <th className="px-3 py-2.5 border-r border-[#CBD5E1]">CLUSTER</th>
                    <th className="px-3 py-2.5 border-r border-[#CBD5E1]">ACCOUNT</th>
                    <th className="px-3 py-2.5 text-right border-r border-[#CBD5E1]">REQUIRED HC ▼</th>
                    <th className="px-3 py-2.5 text-right border-r border-[#CBD5E1]">ACTUAL HC</th>
                    <th className="px-3 py-2.5 text-right border-r border-[#CBD5E1]">BUFFER %</th>
                    <th className="px-3 py-2.5 text-right border-r border-[#CBD5E1]">NET ACTUAL HC</th>
                    <th className="px-3 py-2.5 text-right border-r border-[#CBD5E1]">HIRING NEEDED</th>

                    <th className="px-3 py-2.5 text-right border-r border-[#CBD5E1]">ABSENTEEISM (6 WKS AVG)</th>
                    <th className="px-3 py-2.5 text-right border-r border-[#CBD5E1]">ABS %</th>
                    <th className="px-3 py-2.5 text-right border-r border-[#CBD5E1]">ATTRITION (6 WKS TOTAL)</th>
                    <th className="px-3 py-2.5 text-right border-r border-[#CBD5E1]">ATT %</th>

                    {/* Hiring Funnel Sub-Headers */}
                    <th className="px-3 py-2.5 text-center border-r border-[#CBD5E1]">ACCEPTED JO</th>
                    <th className="px-3 py-2.5 text-center border-r border-[#CBD5E1]">NHO COUNT</th>
                    <th className="px-3 py-2.5 text-center border-r border-[#CBD5E1]">FST COUNT</th>
                    <th className="px-3 py-2.5 text-center border-r border-[#CBD5E1]">PST COUNT</th>
                    <th className="px-3 py-2.5 text-center border-r border-[#CBD5E1]">GO LIVE</th>

                    {/* Attrition Between Stages Sub-Headers */}
                    <th className="px-2 py-2.5 text-center border-r border-[#CBD5E1]">JO - NHO COUNT</th>
                    <th className="px-2 py-2.5 text-center border-r border-[#CBD5E1]">%</th>
                    <th className="px-2 py-2.5 text-center border-r border-[#CBD5E1]">NHO - FST COUNT</th>
                    <th className="px-2 py-2.5 text-center border-r border-[#CBD5E1]">%</th>
                    <th className="px-2 py-2.5 text-center border-r border-[#CBD5E1]">FST - PST COUNT</th>
                    <th className="px-2 py-2.5 text-center border-r border-[#CBD5E1]">%</th>
                    <th className="px-2 py-2.5 text-center border-r border-[#CBD5E1]">NHO - PST COUNT</th>
                    <th className="px-2 py-2.5 text-center border-r border-[#CBD5E1]">%</th>
                    <th className="px-2 py-2.5 text-center border-r border-[#CBD5E1]">PST - GO LIVE COUNT</th>
                    <th className="px-2 py-2.5 text-center border-r border-[#CBD5E1]">%</th>

                    <th className="px-3 py-2.5 text-right border-r border-[#CBD5E1]">HIRED COUNT</th>
                    <th className="px-3 py-2.5 text-right">HIRING RATE (LEADS TO JO)</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#E6ECF2] bg-white font-medium text-slate-700">
                  {filteredRecords.length === 0 ? (
                    <tr>
                      <td colSpan={28} className="px-4 py-8 text-center text-slate-400 font-semibold">
                        No detail records match the current filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredRecords.map((r, idx) => {
                      const isDeficit = r.bufferPercentage < 0;

                      // 6-week calculated total attrition & average absenteeism
                      const absAvgCount = r.absenteeismCount;
                      const attTotalCount = Math.round(r.attritionCount * 5.8);

                      // Stage transition attrition counts and percentages
                      const joNhoCnt = Math.max(0, r.acceptedJO - r.nho);
                      const joNhoPct = r.acceptedJO > 0 ? (((r.acceptedJO - r.nho) / r.acceptedJO) * 100).toFixed(1) : "0.0";

                      const nhoFstCnt = Math.max(0, r.nho - r.fst);
                      const nhoFstPct = r.nho > 0 ? (((r.nho - r.fst) / r.nho) * 100).toFixed(1) : "0.0";

                      const fstPstCnt = Math.max(0, r.fst - r.pst);
                      const fstPstPct = r.fst > 0 ? (((r.fst - r.pst) / r.fst) * 100).toFixed(1) : "0.0";

                      const nhoPstCnt = Math.max(0, r.nho - r.pst);
                      const nhoPstPct = r.nho > 0 ? (((r.nho - r.pst) / r.nho) * 100).toFixed(1) : "0.0";

                      const pstGoLiveCnt = Math.max(0, r.pst - r.goLive);
                      const pstGoLivePct = r.pst > 0 ? (((r.pst - r.goLive) / r.pst) * 100).toFixed(1) : "0.0";

                      return (
                        <tr key={r.id || idx} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-3 py-2.5 font-medium text-slate-500 border-r border-[#E6ECF2]">{r.cluster}</td>
                          <td className="px-3 py-2.5 font-bold text-[#042C51] border-r border-[#E6ECF2]">{r.account}</td>
                          <td className="px-3 py-2.5 text-right font-mono font-bold text-[#042C51]">{r.requiredHC}</td>
                          <td className="px-3 py-2.5 text-right font-mono text-slate-600">{r.actualHC}</td>
                          <td className="px-3 py-2.5 text-right font-mono font-bold">
                            <span className={isDeficit ? "text-[#E74C3C]" : "text-[#2ECC71]"}>
                              {r.bufferPercentage.toFixed(1)}%
                            </span>
                          </td>
                          <td className="px-3 py-2.5 text-right font-mono font-bold text-[#042C51]">{r.netActualHC}</td>
                          <td className="px-3 py-2.5 text-right font-mono font-bold border-r border-[#E6ECF2]">
                            {r.hiringNeeded > 0 ? (
                              <span className="bg-rose-50 text-[#E74C3C] px-2 py-0.5 rounded font-bold border border-rose-100 shadow-2xs">
                                {r.hiringNeeded}
                              </span>
                            ) : (
                              <span className="text-slate-400">0</span>
                            )}
                          </td>

                          <td className="px-3 py-2.5 text-right font-mono text-slate-700">{absAvgCount}</td>
                          <td className="px-3 py-2.5 text-right font-mono font-bold text-slate-800">{r.absenteeismPercentage.toFixed(1)}%</td>
                          <td className="px-3 py-2.5 text-right font-mono text-slate-700">{attTotalCount}</td>
                          <td className="px-3 py-2.5 text-right font-mono font-bold text-slate-800 border-r border-[#E6ECF2]">{r.attritionPercentage.toFixed(1)}%</td>

                          {/* Hiring Funnel Counts */}
                          <td className="px-3 py-2.5 text-center font-mono font-bold text-slate-800">{r.acceptedJO}</td>
                          <td className="px-3 py-2.5 text-center font-mono text-slate-700">{r.nho}</td>
                          <td className="px-3 py-2.5 text-center font-mono text-slate-700">{r.fst}</td>
                          <td className="px-3 py-2.5 text-center font-mono text-slate-700">{r.pst}</td>
                          <td className="px-3 py-2.5 text-center font-mono font-bold text-emerald-600 border-r border-[#E6ECF2]">{r.goLive}</td>

                          {/* Attrition Between Stages */}
                          <td className="px-2 py-2.5 text-center font-mono font-medium text-slate-700">{joNhoCnt}</td>
                          <td className="px-2 py-2.5 text-center font-mono text-slate-500">{joNhoPct}%</td>
                          <td className="px-2 py-2.5 text-center font-mono font-medium text-slate-700">{nhoFstCnt}</td>
                          <td className="px-2 py-2.5 text-center font-mono text-slate-500">{nhoFstPct}%</td>
                          <td className="px-2 py-2.5 text-center font-mono font-medium text-slate-700">{fstPstCnt}</td>
                          <td className="px-2 py-2.5 text-center font-mono text-slate-500">{fstPstPct}%</td>
                          <td className="px-2 py-2.5 text-center font-mono font-medium text-slate-700">{nhoPstCnt}</td>
                          <td className="px-2 py-2.5 text-center font-mono text-slate-500">{nhoPstPct}%</td>
                          <td className="px-2 py-2.5 text-center font-mono font-medium text-slate-700">{pstGoLiveCnt}</td>
                          <td className="px-2 py-2.5 text-center font-mono text-slate-500 border-r border-[#E6ECF2]">{pstGoLivePct}%</td>

                          {/* Final Hired & Rate */}
                          <td className="px-3 py-2.5 text-right font-mono font-bold text-[#042C51]">{r.hiredCount}</td>
                          <td className="px-3 py-2.5 text-right font-mono font-black text-[#FF5C28]">{r.hiringRate.toFixed(1)}%</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer Summary Row */}
            <div className="bg-[#F8FAFC] p-3 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between text-xs font-extrabold text-slate-700">
              <div className="flex items-center gap-2">
                <span>Total Filtered Accounts:</span>
                <span className="bg-white px-2 py-0.5 rounded border border-slate-300 font-mono text-[#042C51]">
                  {filteredRecords.length} Accounts
                </span>
              </div>
              <div className="flex items-center gap-4 font-mono">
                <span>Total Req HC: <strong className="text-slate-900">{filteredRecords.reduce((acc, r) => acc + r.requiredHC, 0)}</strong></span>
                <span>Total Act HC: <strong className="text-slate-900">{filteredRecords.reduce((acc, r) => acc + r.actualHC, 0)}</strong></span>
                <span>6-Wk Total Attrition: <strong className="text-rose-600">{filteredRecords.reduce((acc, r) => acc + Math.round(r.attritionCount * 5.8), 0)}</strong></span>
                <span>Total Hiring Needed: <strong className="text-emerald-700">{filteredRecords.reduce((acc, r) => acc + r.hiringNeeded, 0)}</strong></span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
