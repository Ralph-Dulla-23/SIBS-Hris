import React, { useState, useMemo } from "react";
import { 
  Calendar, 
  ChevronDown, 
  RefreshCw, 
  FileSpreadsheet, 
  Sparkles, 
  Smartphone, 
  Monitor, 
  Tablet, 
  Layers, 
  Sliders,
  Filter,
  CheckCircle,
  Clock,
  Layers3,
  HelpCircle
} from "lucide-react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import OverviewSection from "./components/OverviewSection";
import PlanSection from "./components/PlanSection";
import ViewPlanDrawer from "./components/ViewPlanDrawer";
import EmployeeDirectory from "./components/EmployeeDirectory";
import TimeAndAttendance from "./components/TimeAndAttendance";
import LeavesManagement from "./components/LeavesManagement";
import HRDashboard from "./components/HRDashboard";
import TADashboard from "./components/TADashboard";
import OMDashboard from "./components/OMDashboard";
import ResignationManagement from "./components/ResignationManagement";
import HiringNeedsIntake from "./components/HiringNeedsIntake";
import AvailablePositions from "./components/AvailablePositions";
import SourcingAnalytics from "./components/SourcingAnalytics";
import ApplicantLeads from "./components/ApplicantLeads";
import TalentPool from "./components/TalentPool";
import PublicTalentPoolApplicationPage from "./components/PublicTalentPoolApplicationPage";
import Offers from "./components/Offers";
import Onboarding from "./components/Onboarding";
import ActionItems from "./components/ActionItems";
import SuperAdminDashboard from "./components/SuperAdminDashboard";
import JobDescriptionPage from "./components/JobDescriptionPage";
import WeeklyReports from "./components/WeeklyReports";
import SchedulesCalendarModal from "./components/SchedulesCalendarModal";
import Departments from "./components/Departments";
import OfficeLocations from "./components/OfficeLocations";
import RecruitmentSettings from "./components/RecruitmentSettings";
import EmailLogs from "./components/EmailLogs";
import RecruitmentFlowchart from "./components/RecruitmentFlowchart";

import { 
  INITIAL_SUMMARY_METRICS, 
  INITIAL_PIPELINE_STAGES, 
  INITIAL_DROP_OFFS, 
  WEEKLY_TRENDS, 
  MONTHLY_TRENDS, 
  INITIAL_DETAIL_RECORDS, 
  INITIAL_PLANS,
  INITIAL_SCHEDULES,
  CLUSTERS,
  ACCOUNTS_BY_CLUSTER
} from "./data";
import { 
  WorkforcePlan, 
  PlanStatus, 
  ActionItemStatus, 
  DetailRecord, 
  ActionItem,
  ScheduleItem
} from "./types";

export default function App() {
  // Shared States (making the whole application interactive and mutable!)
  const [currentModule, setCurrentModule] = useState<string>("HR Dashboard");
  const [activeTab, setActiveTab] = useState<"overview" | "plan">("overview");
  const [clusterFilter, setClusterFilter] = useState("All Clusters");
  const [accountFilter, setAccountFilter] = useState("All Accounts");
  const [dateRange, setDateRange] = useState("Q3 2026 Ramp (Jul-Sep)");
  const [lastUpdated, setLastUpdated] = useState("Just now");
  
  // Roster detail list, Sourcing plans & Schedules
  const [detailRecords, setDetailRecords] = useState<DetailRecord[]>(INITIAL_DETAIL_RECORDS);
  const [plans, setPlans] = useState<WorkforcePlan[]>(INITIAL_PLANS);
  const [schedules, setSchedules] = useState<ScheduleItem[]>(INITIAL_SCHEDULES);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
  // View Plan Drawer state
  const [selectedPlan, setSelectedPlan] = useState<WorkforcePlan | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Handle schedule mutations
  const handleSaveSchedule = (updatedSchedule: ScheduleItem) => {
    setSchedules(prev => {
      const exists = prev.some(s => s.id === updatedSchedule.id);
      if (exists) {
        return prev.map(s => s.id === updatedSchedule.id ? updatedSchedule : s);
      }
      return [updatedSchedule, ...prev];
    });
  };

  const handleDeleteSchedule = (id: string) => {
    setSchedules(prev => prev.filter(s => s.id !== id));
  };

  // Device view simulation (Allows desktop users to preview exact tablet and mobile responsive layouts)
  const [deviceView, setDeviceView] = useState<"desktop" | "tablet" | "mobile">("desktop");

  // Filter list of accounts depending on cluster
  const currentAccountsList = useMemo(() => {
    if (clusterFilter === "All Clusters") {
      return ["All Accounts", ...Object.values(ACCOUNTS_BY_CLUSTER).flat()];
    }
    return ["All Accounts", ...(ACCOUNTS_BY_CLUSTER[clusterFilter] || [])];
  }, [clusterFilter]);

  // Handle plan mutations (e.g. updating an action item inside a plan)
  const handleUpdatePlan = (updatedPlan: WorkforcePlan) => {
    setPlans(prev => prev.map(p => p.id === updatedPlan.id ? updatedPlan : p));
    setSelectedPlan(updatedPlan);

    // Sync metrics in detail ledger if applicable
    setDetailRecords(prev => prev.map(rec => {
      if (rec.account === updatedPlan.account) {
        return {
          ...rec,
          hiredCount: updatedPlan.hiredCount,
          hiringNeeded: updatedPlan.hiringNeeded,
          requiredHC: updatedPlan.requiredHeadcount,
          actualHC: updatedPlan.actualHeadcount,
          bufferPercentage: updatedPlan.kpiSnapshot.bufferPercentage
        };
      }
      return rec;
    }));
  };

  // Handle creating a plan from standard forms
  const handleCreatePlan = (newPlanData: Omit<WorkforcePlan, "id" | "actionItems" | "activityHistory" | "createdAt" | "updatedAt">) => {
    const newId = `plan-${Date.now()}`;
    const completePlan: WorkforcePlan = {
      ...newPlanData,
      id: newId,
      actionItems: [],
      activityHistory: [
        {
          id: `hist-${Date.now()}`,
          date: "2026-07-19 22:40",
          user: "dulla13ralph@gmail.com",
          action: "Draft created",
          details: `Hiring parameters set up for ${newPlanData.account}.`
        }
      ],
      createdAt: "2026-07-19",
      updatedAt: "2026-07-19"
    };

    setPlans(prev => [completePlan, ...prev]);
  };

  const handleRefresh = () => {
    setLastUpdated(new Date().toLocaleTimeString());
  };

  // Helper: Open a plan from account name (used when clicking accounts in the overview table)
  const handleOpenPlanByAccount = (accountName: string) => {
    // Find if a plan already exists
    let existingPlan = plans.find(p => p.account === accountName);
    if (!existingPlan) {
      // If none, create a default template plan reactively
      const correspondingRecord = detailRecords.find(r => r.account === accountName);
      const req = correspondingRecord ? correspondingRecord.requiredHC : 400;
      const act = correspondingRecord ? correspondingRecord.actualHC : 380;
      const hired = correspondingRecord ? correspondingRecord.hiredCount : 20;
      const rate = correspondingRecord ? correspondingRecord.hiringRate : 60;
      
      const newPlan: WorkforcePlan = {
        id: `plan-gen-${Date.now()}`,
        cluster: correspondingRecord ? correspondingRecord.cluster : "Telecom & Tech",
        account: accountName,
        planPeriod: "Q3 2026 Ramp",
        requiredHeadcount: req,
        actualHeadcount: act,
        hiredCount: hired,
        hiringNeeded: Math.max(0, req - act),
        hiringRate: rate,
        leadsNeeded: Math.round(Math.max(0, req - act) / (rate / 100)),
        interviewCount: 150,
        fstCount: 90,
        status: PlanStatus.Draft,
        owner: "Sarah Jenkins (WFM Principal)",
        createdAt: "2026-07-19",
        updatedAt: "2026-07-19",
        kpiSnapshot: {
          bufferPercentage: correspondingRecord ? correspondingRecord.bufferPercentage : -5.0,
          absenteeismCount: correspondingRecord ? correspondingRecord.absenteeismCount : 30,
          absenteeismPercentage: correspondingRecord ? correspondingRecord.absenteeismPercentage : 8.0,
          attritionCount: correspondingRecord ? correspondingRecord.attritionCount : 20,
          attritionPercentage: correspondingRecord ? correspondingRecord.attritionPercentage : 4.0,
          acceptedJO: correspondingRecord ? correspondingRecord.acceptedJO : 30,
          nho: correspondingRecord ? correspondingRecord.nho : 28,
          fst: correspondingRecord ? correspondingRecord.fst : 25,
          pst: correspondingRecord ? correspondingRecord.pst : 22,
          goLive: correspondingRecord ? correspondingRecord.goLive : 20,
          hiredCount: hired,
          hiringRate: rate
        },
        pipeline: {
          acceptedJO: 45,
          nho: 40,
          fst: 35,
          pst: 30,
          goLive: 28,
          dropOffs: {
            joToNho: 5,
            nhoToFst: 5,
            fstToPst: 5,
            nhoToPst: 10,
            pstToGoLive: 2
          }
        },
        actionItems: [
          {
            id: `act-gen-${Date.now()}`,
            workforcePlanId: "",
            taskDescription: `Review initial training drops for ${accountName} cohort.`,
            assignee: "Sarah Jenkins (WFM Principal)",
            targetDate: "2026-07-28",
            status: ActionItemStatus.NotStarted,
            priority: "Medium",
            createdAt: "2026-07-19",
            updatedAt: "2026-07-19"
          }
        ],
        activityHistory: []
      };

      existingPlan = newPlan;
      setPlans(prev => [newPlan, ...prev]);
    }

    setSelectedPlan(existingPlan);
    setIsDrawerOpen(true);
  };

  // Trigger exact pre-loaded states to generate the requested high-fidelity screens
  const triggerFidelityScreen = (screenId: number) => {
    // Reset defaults first
    setIsDrawerOpen(false);
    setDeviceView("desktop");

    switch(screenId) {
      case 1: // 1. Workforce Hiring Overview — full dashboard
        setActiveTab("overview");
        setClusterFilter("All Clusters");
        setAccountFilter("All Accounts");
        break;
      
      case 2: // 2. Workforce Hiring Overview — account details table expanded
        setActiveTab("overview");
        setClusterFilter("All Clusters");
        setAccountFilter("All Accounts");
        // Expand the Verizon Tech (rec-2) row
        setTimeout(() => {
          const tableExpandBtn = document.querySelector('button[title="View Sourcing details"]');
          // Programmatic toggle
          const verizonId = "rec-2";
          const el = document.getElementById("ledger-section");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 100);
        // We will pass down verizon to be auto expanded in Overview
        break;

      case 3: // 3. Workforce Hiring Plan — accounts table
        setActiveTab("plan");
        setClusterFilter("All Clusters");
        break;

      case 4: // 4. View Plan account-specific detail drawer
        setActiveTab("plan");
        const verizonPlan = plans.find(p => p.account === "Verizon Tech") || plans[0];
        setSelectedPlan(verizonPlan);
        setIsDrawerOpen(true);
        break;

      case 5: // 5. View Plan with Action Items
        setActiveTab("plan");
        const comcastPlan = plans.find(p => p.account === "Comcast Technical") || plans[1];
        setSelectedPlan(comcastPlan);
        setIsDrawerOpen(true);
        break;

      case 6: // 6. Create or Edit Action Item state
        setActiveTab("plan");
        const aetnaPlan = plans.find(p => p.account === "Aetna Core") || plans[2];
        setSelectedPlan(aetnaPlan);
        setIsDrawerOpen(true);
        break;

      case 7: // 7. Mobile Workforce Hiring Overview
        setActiveTab("overview");
        setDeviceView("mobile");
        break;

      case 8: // 8. Mobile Workforce Hiring Plan
        setActiveTab("plan");
        setDeviceView("mobile");
        break;
    }
  };

  // Compute metrics in real-time according to current cluster filters
  const currentSummaryMetrics = useMemo(() => {
    if (clusterFilter === "All Clusters") {
      return INITIAL_SUMMARY_METRICS;
    }
    
    // Aggregate over selected cluster
    const clusterRecords = detailRecords.filter(r => r.cluster === clusterFilter);
    if (clusterRecords.length === 0) return INITIAL_SUMMARY_METRICS;

    const req = clusterRecords.reduce((acc, r) => acc + r.requiredHC, 0);
    const act = clusterRecords.reduce((acc, r) => acc + r.actualHC, 0);
    const abs = clusterRecords.reduce((acc, r) => acc + r.absenteeismCount, 0);
    const att = clusterRecords.reduce((acc, r) => acc + r.attritionCount, 0);
    const hired = clusterRecords.reduce((acc, r) => acc + r.hiredCount, 0);

    const net = act - abs;
    const gap = req - net;

    return {
      requiredHeadcount: req,
      actualHeadcount: act,
      bufferPercentage: parseFloat((((act - req) / req) * 100).toFixed(1)),
      absenteeismCount: abs,
      absenteeismPercentage: parseFloat(((abs / act) * 100).toFixed(2)),
      attritionCount: att,
      attritionPercentage: parseFloat(((att / act) * 100).toFixed(2)),
      netActualHC: net,
      hiringNeeded: gap,
      hiringRate: parseFloat((clusterRecords.reduce((acc, r) => acc + r.hiringRate, 0) / clusterRecords.length).toFixed(1)),
      hiredCount: hired,
      leadsToInterview: Math.round(gap * 2.2)
    };
  }, [clusterFilter, detailRecords]);

  return (
    <div className="min-h-screen bg-[#DDE4EC] flex text-[#101828] max-w-full overflow-x-hidden">
      
      {/* Dynamic Sidebar */}
      <Sidebar 
        currentModule={currentModule} 
        onModuleChange={setCurrentModule} 
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main Panel Content (Shifted left to accommodate fixed Sidebar) */}
      <div className="flex-1 pl-64 flex flex-col min-h-screen pb-10 min-w-0 max-w-full overflow-x-hidden">
        
        {/* Unchanging top header */}
        <Header 
          userEmail="alena.batacan@thesiblingssolutions.com" 
          onOpenCalendar={() => setIsCalendarOpen(true)}
        />

        {currentModule === "Employee Directory" ? (
          <div className={`mt-20 px-6 flex-1 flex flex-col ${
            deviceView === "mobile" 
              ? "max-w-[420px] mx-auto w-full border-12 border-slate-900 rounded-[40px] shadow-2xl overflow-hidden bg-[#DDE4EC] min-h-[750px] p-4 relative"
              : deviceView === "tablet"
                ? "max-w-[820px] mx-auto w-full border-12 border-slate-900 rounded-[30px] shadow-2xl overflow-hidden bg-[#DDE4EC] min-h-[900px] p-5 relative"
                : "w-full"
          }`}>
            {deviceView === "mobile" && (
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-32 h-4 bg-slate-900 rounded-full z-30 flex items-center justify-center text-[8px] text-slate-500 font-bold">
                SiBS Mobile HRIS
              </div>
            )}
            <EmployeeDirectory 
              onBackToDashboard={() => {
                setCurrentModule("Workforce Hiring");
                setDeviceView("desktop");
              }}
              simulatedDevice={deviceView}
              onChangeDeviceView={setDeviceView}
            />
          </div>
        ) : currentModule === "Time & Attendance" ? (
          <div className="mt-20 px-6 flex-1 flex flex-col w-full">
            <TimeAndAttendance />
          </div>
        ) : currentModule === "Leaves & Time Off" ? (
          <div className="mt-20 px-6 flex-1 flex flex-col w-full">
            <LeavesManagement />
          </div>
        ) : currentModule === "HR Dashboard" ? (
          <div className="mt-20 px-6 flex-1 flex flex-col w-full">
            <HRDashboard userEmail="alena.batacan@thesiblingssolutions.com" onSwitchModule={setCurrentModule} />
          </div>
        ) : currentModule === "TA Dashboard" ? (
          <div className="mt-20 px-6 flex-1 flex flex-col w-full">
            <TADashboard userEmail="alena.batacan@thesiblingssolutions.com" onSwitchModule={setCurrentModule} />
          </div>
        ) : currentModule === "OM Dashboard" ? (
          <div className="mt-20 px-6 flex-1 flex flex-col w-full">
            <OMDashboard userEmail="alena.batacan@thesiblingssolutions.com" onSwitchModule={setCurrentModule} />
          </div>
        ) : currentModule === "Resignation Management" ? (
          <div className="mt-20 px-6 flex-1 flex flex-col w-full">
            <ResignationManagement userEmail="alena.batacan@thesiblingssolutions.com" onSwitchModule={setCurrentModule} />
          </div>
        ) : currentModule === "Hiring Needs Intake" ? (
          <div className="mt-20 px-6 flex-1 flex flex-col w-full">
            <HiringNeedsIntake userEmail="alena.batacan@thesiblingssolutions.com" onSwitchModule={setCurrentModule} />
          </div>
        ) : currentModule === "Available Positions" ? (
          <div className="mt-20 px-6 flex-1 flex flex-col w-full">
            <AvailablePositions userEmail="alena.batacan@thesiblingssolutions.com" onSwitchModule={setCurrentModule} />
          </div>
        ) : currentModule === "Sourcing Analytics" ? (
          <div className="mt-20 px-6 flex-1 flex flex-col w-full">
            <SourcingAnalytics userEmail="alena.batacan@thesiblingssolutions.com" onSwitchModule={setCurrentModule} />
          </div>
        ) : currentModule === "Applicant Leads" ? (
          <div className="mt-20 px-6 flex-1 flex flex-col w-full">
            <ApplicantLeads userEmail="alena.batacan@thesiblingssolutions.com" onSwitchModule={setCurrentModule} />
          </div>
        ) : currentModule === "Talent Pool" ? (
          <div className="mt-20 px-6 flex-1 flex flex-col w-full">
            <TalentPool userEmail="alena.batacan@thesiblingssolutions.com" onSwitchModule={setCurrentModule} />
          </div>
        ) : currentModule === "Public Application Form" ? (
          <div className="mt-20 px-6 flex-1 flex flex-col w-full">
            <PublicTalentPoolApplicationPage onNavigateToTalentPool={() => setCurrentModule("Talent Pool")} />
          </div>
        ) : currentModule === "Offers" ? (
          <div className="mt-20 px-6 flex-1 flex flex-col w-full">
            <Offers userEmail="alena.batacan@thesiblingssolutions.com" onSwitchModule={setCurrentModule} />
          </div>
        ) : currentModule === "Onboarding" ? (
          <div className="mt-20 px-6 flex-1 flex flex-col w-full">
            <Onboarding userEmail="alena.batacan@thesiblingssolutions.com" onSwitchModule={setCurrentModule} />
          </div>
        ) : currentModule === "Action Items" ? (
          <div className="mt-20 px-6 flex-1 flex flex-col w-full">
            <ActionItems userEmail="alena.batacan@thesiblingssolutions.com" onSwitchModule={setCurrentModule} />
          </div>
        ) : currentModule === "Job Description" ? (
          <div className="mt-20 px-6 flex-1 flex flex-col w-full">
            <JobDescriptionPage onSwitchModule={setCurrentModule} />
          </div>
        ) : currentModule === "Super Admin Dashboard" ? (
          <div className="mt-20 px-6 flex-1 flex flex-col w-full">
            <SuperAdminDashboard userEmail="dulla13ralph@gmail.com" onSwitchModule={setCurrentModule} />
          </div>
        ) : currentModule === "Weekly Reports" ? (
          <div className="mt-20 px-6 flex-1 flex flex-col w-full">
            <WeeklyReports userEmail="alena.batacan@thesiblingssolutions.com" onSwitchModule={setCurrentModule} />
          </div>
        ) : currentModule === "Departments" ? (
          <div className="mt-20 px-6 flex-1 flex flex-col w-full">
            <Departments onSwitchModule={setCurrentModule} />
          </div>
        ) : currentModule === "Office Locations" ? (
          <div className="mt-20 px-6 flex-1 flex flex-col w-full">
            <OfficeLocations onSwitchModule={setCurrentModule} />
          </div>
        ) : currentModule === "Recruitment Settings" ? (
          <div className="mt-20 px-6 flex-1 flex flex-col w-full">
            <RecruitmentSettings userEmail="alena.batacan@thesiblingssolutions.com" onSwitchModule={setCurrentModule} />
          </div>
        ) : currentModule === "Email Logs" ? (
          <div className="mt-20 px-6 flex-1 flex flex-col w-full">
            <EmailLogs userEmail="alena.batacan@thesiblingssolutions.com" onSwitchModule={setCurrentModule} />
          </div>
        ) : currentModule === "Recruitment Flowchart" ? (
          <div className="mt-16 flex-1 flex flex-col w-full">
            <RecruitmentFlowchart 
              onSwitchModule={setCurrentModule} 
              onClose={() => setCurrentModule("Workforce Hiring")}
            />
          </div>
        ) : (
          <>
            {/* ==================== EXACT FIDELITY SCREEN SELECTOR BAR ==================== */}
        <div className="mt-20 mx-6 px-4 py-2.5 bg-[#042C51] text-white rounded-xl shadow-lg flex flex-col lg:flex-row lg:items-center justify-between gap-3 select-none border border-blue-400">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#FF5C28] text-[11px] font-black animate-pulse text-white">
              S
            </span>
            <div>
              <p className="text-xs font-black tracking-wide text-white">Fidelity Screen Scenarios Controller</p>
              <p className="text-[10px] text-slate-300">Quickly toggle state parameters to inspect each of the 8 required screens.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-extrabold text-slate-300">
            <button 
              onClick={() => setCurrentModule("Recruitment Flowchart")}
              className="px-2.5 py-1 rounded-lg bg-[#FF5C28] text-white hover:bg-[#e04b1c] transition-all font-black text-[10px] shadow-sm flex items-center gap-1 cursor-pointer"
              title="Open Recruitment Flowchart"
            >
              <Sparkles className="w-3 h-3" />
              <span>Flowchart Process Map</span>
            </button>
            <button 
              onClick={() => triggerFidelityScreen(1)}
              className="px-2 py-1 rounded bg-slate-800 hover:bg-[#FF5C28] hover:text-white transition-all border border-slate-700 text-[10px]"
            >
              1. Full Overview
            </button>
            <button 
              onClick={() => triggerFidelityScreen(2)}
              className="px-2 py-1 rounded bg-slate-800 hover:bg-[#FF5C28] hover:text-white transition-all border border-slate-700 text-[10px]"
            >
              2. Row Expanded
            </button>
            <button 
              onClick={() => triggerFidelityScreen(3)}
              className="px-2 py-1 rounded bg-slate-800 hover:bg-[#FF5C28] hover:text-white transition-all border border-slate-700 text-[10px]"
            >
              3. Plans Ledger
            </button>
            <button 
              onClick={() => triggerFidelityScreen(4)}
              className="px-2 py-1 rounded bg-slate-800 hover:bg-[#FF5C28] hover:text-white transition-all border border-slate-700 text-[10px]"
            >
              4. View Plan Drawer
            </button>
            <button 
              onClick={() => triggerFidelityScreen(5)}
              className="px-2 py-1 rounded bg-slate-800 hover:bg-[#FF5C28] hover:text-white transition-all border border-slate-700 text-[10px]"
            >
              5. Plan & Tasks
            </button>
            <button 
              onClick={() => triggerFidelityScreen(6)}
              className="px-2 py-1 rounded bg-slate-800 hover:bg-[#FF5C28] hover:text-white transition-all border border-slate-700 text-[10px]"
            >
              6. Task Form State
            </button>
            <button 
              onClick={() => triggerFidelityScreen(7)}
              className="px-2 py-1 rounded bg-slate-800 hover:bg-[#FF5C28] hover:text-white transition-all border border-slate-700 text-[10px] flex items-center gap-1"
            >
              <Smartphone className="w-3 h-3" /> 7. Mobile Overview
            </button>
            <button 
              onClick={() => triggerFidelityScreen(8)}
              className="px-2 py-1 rounded bg-slate-800 hover:bg-[#FF5C28] hover:text-white transition-all border border-slate-700 text-[10px] flex items-center gap-1"
            >
              <Smartphone className="w-3 h-3" /> 8. Mobile Plan
            </button>
          </div>
        </div>

        {/* Device view switcher simulation frame container */}
        <div className={`mt-6 px-6 flex-1 flex flex-col ${
          deviceView === "mobile" 
            ? "max-w-[420px] mx-auto w-full border-12 border-slate-900 rounded-[40px] shadow-2xl overflow-hidden bg-[#DDE4EC] min-h-[750px] p-4 relative"
            : deviceView === "tablet"
              ? "max-w-[820px] mx-auto w-full border-12 border-slate-900 rounded-[30px] shadow-2xl overflow-hidden bg-[#DDE4EC] min-h-[900px] p-5 relative"
              : "w-full"
        }`}>
          
          {/* Simulated Mobile Home bar / notches */}
          {deviceView === "mobile" && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-32 h-4 bg-slate-900 rounded-full z-30 flex items-center justify-center text-[8px] text-slate-500 font-bold">
              SiBS Mobile HRIS
            </div>
          )}

          {/* ==================== WORKFORCE HIRING COMPACT PAGE HEADER ==================== */}
          <section className="bg-white p-5 rounded-2xl border border-[#E6ECF2] shadow-sm mb-6 space-y-4 select-none">
            
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              {/* Title & Description */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-[#E9F0FC] text-[#042C51] px-2.5 py-0.5 rounded font-black border border-blue-100 uppercase tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF5C28] inline-block"></span>
                    Recruitment
                  </span>
                </div>
                <h1 className="text-xl font-black text-[#042C51] tracking-tight">Workforce Hiring Dashboard</h1>
                <p className="text-xs text-[#667085] leading-normal max-w-2xl">
                  Manage weekly manpower requirement, OPS PRF, hiring plan percentage, leads needed, and action items.
                </p>
              </div>

              {/* Date & Filter controls - structured with labels on top as requested */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Weekly Version Dropdown */}
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Weekly Version</span>
                  <select
                    value={dateRange}
                    onChange={e => setDateRange(e.target.value)}
                    className="bg-[#F1F5F9] px-3 py-1.5 rounded-lg text-xs font-bold text-[#042C51] focus:outline-none cursor-pointer border border-[#E6ECF2] hover:bg-slate-100 transition-colors"
                  >
                    <option value="Q3 2026 Ramp (Jul-Sep)">2026 - Week 30 | Jul 20 - Jul 26, 2026</option>
                    <option value="2026 - Week 29">2026 - Week 29 | Jul 13 - Jul 19, 2026</option>
                    <option value="2026 - Week 28">2026 - Week 28 | Jul 06 - Jul 12, 2026</option>
                    <option value="Full Fiscal Year 2026">Full Fiscal Year 2026</option>
                  </select>
                </div>

                {/* Cluster Dropdown */}
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Cluster</span>
                  <select
                    value={clusterFilter}
                    onChange={e => { setClusterFilter(e.target.value); setAccountFilter("All Accounts"); }}
                    className="bg-[#F1F5F9] px-3 py-1.5 rounded-lg text-xs font-bold text-[#042C51] focus:outline-none cursor-pointer border border-[#E6ECF2] hover:bg-slate-100 transition-colors"
                  >
                    {CLUSTERS.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Account Dropdown */}
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Account</span>
                  <select
                    value={accountFilter}
                    onChange={e => setAccountFilter(e.target.value)}
                    className="bg-[#F1F5F9] px-3 py-1.5 rounded-lg text-xs font-bold text-[#042C51] focus:outline-none cursor-pointer border border-[#E6ECF2] hover:bg-slate-100 transition-colors"
                  >
                    {currentAccountsList.map(acc => (
                      <option key={acc} value={acc}>{acc}</option>
                    ))}
                  </select>
                </div>

                {/* Refresh and Export buttons */}
                <div className="flex flex-col gap-1 self-end">
                  <span className="text-[10px] font-bold text-transparent select-none uppercase tracking-wide">Refresh</span>
                  <button
                    onClick={handleRefresh}
                    title="Force DB Refresh"
                    className="p-2 bg-slate-100 hover:bg-[#E9F0FC] rounded-lg text-slate-600 hover:text-[#042C51] transition-all border border-transparent hover:border-[#E6ECF2]"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Last Updated indicator */}
            <div className="text-[10px] text-slate-400 font-semibold flex items-center justify-between pt-2 border-t border-[#E6ECF2]">
              <span>Operations Database Sync: Active</span>
              <span>Last updated: <strong>{lastUpdated}</strong></span>
            </div>

            {/* ==================== MODULE TABS NAVIGATION ==================== */}
            <div className="flex border-b border-[#E6ECF2] pt-2 select-none">
              <button
                onClick={() => setActiveTab("overview")}
                aria-selected={activeTab === "overview"}
                className={`px-5 py-2.5 text-xs font-black tracking-wide uppercase transition-all duration-150 relative ${
                  activeTab === "overview" 
                    ? "text-[#042C51]" 
                    : "text-slate-400 hover:text-slate-700"
                }`}
              >
                <span>Overview Dashboard</span>
                {activeTab === "overview" && (
                  <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#042C51] rounded-t-full"></span>
                )}
              </button>

              <button
                onClick={() => setActiveTab("plan")}
                aria-selected={activeTab === "plan"}
                className={`px-5 py-2.5 text-xs font-black tracking-wide uppercase transition-all duration-150 relative ${
                  activeTab === "plan" 
                    ? "text-[#042C51]" 
                    : "text-slate-400 hover:text-slate-700"
                }`}
              >
                <span>Workforce Plan</span>
                {activeTab === "plan" && (
                  <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#042C51] rounded-t-full"></span>
                )}
              </button>
            </div>
          </section>

          {/* ==================== ACTIVE VIEWPORT ROUTER ==================== */}
          <main className="flex-1 min-h-0">
            {activeTab === "overview" ? (
              <OverviewSection 
                metrics={currentSummaryMetrics}
                pipelineStages={INITIAL_PIPELINE_STAGES}
                dropOffs={INITIAL_DROP_OFFS}
                weeklyTrends={WEEKLY_TRENDS}
                monthlyTrends={MONTHLY_TRENDS}
                detailRecords={detailRecords}
                activeCluster={clusterFilter}
                activeAccount={accountFilter}
                onRecordClick={handleOpenPlanByAccount}
                onRefresh={handleRefresh}
              />
            ) : (
              <PlanSection 
                plans={plans}
                activeCluster={clusterFilter}
                activeAccount={accountFilter}
                onViewPlan={(p) => { setSelectedPlan(p); setIsDrawerOpen(true); }}
                onCreatePlan={handleCreatePlan}
                onAddActionItem={(id) => {
                  const targetPlan = plans.find(p => p.id === id);
                  if (targetPlan) {
                    setSelectedPlan(targetPlan);
                    setIsDrawerOpen(true);
                    setTimeout(() => {
                      // auto open assign inline form
                      const taskBtn = document.querySelector('button[title="Assign Task"]');
                      if (taskBtn) (taskBtn as HTMLButtonElement).click();
                    }, 200);
                  }
                }}
              />
            )}
          </main>
        </div>
      </>
    )}

        {/* View Plan Modal / Drawer overlay */}
        <ViewPlanDrawer 
          plan={selectedPlan}
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          onUpdatePlan={handleUpdatePlan}
        />

        {/* HR & TA Schedules Calendar Modal */}
        <SchedulesCalendarModal
          isOpen={isCalendarOpen}
          onClose={() => setIsCalendarOpen(false)}
          schedules={schedules}
          onSaveSchedule={handleSaveSchedule}
          onDeleteSchedule={handleDeleteSchedule}
          userEmail="alena.batacan@thesiblingssolutions.com"
        />
      </div>
    </div>
  );
}
