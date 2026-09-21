import React, { useState, useEffect } from "react";
import { 
  Users, 
  Clock, 
  FileText, 
  Award, 
  TrendingUp, 
  Calendar, 
  Settings, 
  HelpCircle, 
  Building2, 
  ShieldCheck, 
  Briefcase, 
  Compass, 
  LogOut,
  ChevronRight,
  Sparkles,
  PieChart,
  LayoutDashboard,
  User,
  UserX,
  Mail,
  MapPin,
  DollarSign,
  BarChart3,
  CreditCard,
  CheckSquare,
  Network,
  Inbox,
  Lock,
  UserCheck,
  UserPlus,
  X,
  Info,
  ExternalLink,
  ArrowRight,
  GitFork,
  Cpu
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SidebarProps {
  currentModule: string;
  onModuleChange?: (moduleKey: string) => void;
  activeTab?: "overview" | "plan";
  onTabChange?: (tab: "overview" | "plan") => void;
}

export default function Sidebar({ currentModule, onModuleChange, activeTab, onTabChange }: SidebarProps) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSettingsPopupOpen, setIsSettingsPopupOpen] = useState<boolean>(false);

  // Auto-dismiss toast
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const menuGroups = [
    {
      title: "Employee Access",
      items: [
        { name: "My Dashboard", icon: LayoutDashboard, isEnabled: false },
        { name: "My Profile", icon: User, isEnabled: false },
        { name: "My Attendance", icon: Clock, isEnabled: true, moduleKey: "Time & Attendance" },
        { name: "My Schedule", icon: Calendar, isEnabled: false },
        { name: "My Leaves", icon: Calendar, isEnabled: true, moduleKey: "Leaves & Time Off", badge: "4 New" },
      ]
    },
    {
      title: "Core HR",
      items: [
        { name: "HR Dashboard", icon: LayoutDashboard, isEnabled: true, moduleKey: "HR Dashboard" },
        { name: "TA Dashboard", icon: LayoutDashboard, isEnabled: true, moduleKey: "TA Dashboard" },
        { name: "OM Dashboard", icon: LayoutDashboard, isEnabled: true, moduleKey: "OM Dashboard" },
        { name: "Employee Directory", icon: Users, isEnabled: true, moduleKey: "Employee Directory" },
        { name: "Time & Attendance", icon: Clock, isEnabled: true, moduleKey: "Time & Attendance" },
        { name: "Leaves & Time Off", icon: Calendar, isEnabled: true, moduleKey: "Leaves & Time Off", badge: "4 New" },
        { name: "Resignation Management", icon: UserX, isEnabled: true, moduleKey: "Resignation Management" },
      ]
    },
    {
      title: "Recruitment",
      items: [
        { name: "Workforce & Hiring Overview", icon: Briefcase, isEnabled: true, moduleKey: "Workforce Hiring", tabKey: "overview", badge: "Ramps" },
        { name: "Workforce & Hiring Plan", icon: Briefcase, isEnabled: true, moduleKey: "Workforce Hiring", tabKey: "plan" },
        { name: "Job Description", icon: FileText, isEnabled: true, moduleKey: "Job Description" },
        { name: "Hiring Needs Intake", icon: Inbox, isEnabled: true, moduleKey: "Hiring Needs Intake" },
        { name: "Available Positions", icon: Briefcase, isEnabled: true, moduleKey: "Available Positions" },
        { name: "Sourcing Analytics", icon: Compass, isEnabled: true, moduleKey: "Sourcing Analytics" },
        { name: "Applicant Leads", icon: UserPlus, isEnabled: true, moduleKey: "Applicant Leads", badge: "Leads" },
        { name: "Talent Pool", icon: Users, isEnabled: true, moduleKey: "Talent Pool" },
        { name: "Public Application Form", icon: ExternalLink, isEnabled: true, moduleKey: "Public Application Form", badge: "Apply" },
        { name: "Candidate Pipeline", icon: Network, isEnabled: false },
        { name: "Offers", icon: CheckSquare, isEnabled: true, moduleKey: "Offers" },
        { name: "Onboarding", icon: UserCheck, isEnabled: true, moduleKey: "Onboarding" },
        { name: "Action Items", icon: CheckSquare, isEnabled: true, moduleKey: "Action Items" },
        { name: "Weekly Reports", icon: PieChart, isEnabled: true, moduleKey: "Weekly Reports" },
        { name: "Architecture Flowcharts", icon: GitFork, isEnabled: true, moduleKey: "Recruitment Flowchart", badge: "5 Flows" },
        { name: "Candidate Experience", icon: Sparkles, isEnabled: false },
      ]
    },
    {
      title: "Communication & Workflows",
      items: [
        { name: "Approval Requests", icon: ShieldCheck, isEnabled: false },
        { name: "Email Logs", icon: Mail, isEnabled: true, moduleKey: "Email Logs", badge: "Inbox" },
      ]
    },
    {
      title: "Analytics & Finance",
      items: [
        { name: "Reports", icon: BarChart3, isEnabled: false },
        { name: "Analytics", icon: PieChart, isEnabled: false },
        { name: "Costs", icon: DollarSign, isEnabled: false },
        { name: "Payroll", icon: CreditCard, isEnabled: false },
      ]
    },
    {
      title: "Administration",
      items: [
        { name: "Super Admin Dashboard", icon: ShieldCheck, isEnabled: true, moduleKey: "Super Admin Dashboard", badge: "Admin" },
        { name: "Departments", icon: Building2, isEnabled: true, moduleKey: "Departments", badge: "7 Units" },
        { name: "Office Locations", icon: MapPin, isEnabled: true, moduleKey: "Office Locations", badge: "3 Sites" },
      ]
    },
    {
      title: "Settings",
      items: [
        { name: "Recruitment Settings", icon: Settings, isEnabled: true, moduleKey: "Recruitment Settings", badge: "Setup" },
        { name: "Account Settings", icon: Settings, isEnabled: false },
      ]
    }
  ];

  const currentGroups = menuGroups;

  const handleItemClick = (item: { name: string; isEnabled: boolean; moduleKey?: string; tabKey?: string }) => {
    if (!item.isEnabled) {
      setToastMessage(`"${item.name}" is simulated in this high-fidelity demonstration sandbox.`);
      return;
    }

    if (item.moduleKey && onModuleChange) {
      onModuleChange(item.moduleKey);
      if (item.moduleKey === "Workforce Hiring" && item.tabKey && onTabChange) {
        onTabChange(item.tabKey as "overview" | "plan");
      }
    }
  };

  const isItemActive = (item: { name: string; moduleKey?: string; tabKey?: string }) => {
    if (!item.moduleKey) return false;
    
    if (item.moduleKey === "Workforce Hiring") {
      return currentModule === "Workforce Hiring" && activeTab === item.tabKey;
    }

    return currentModule === item.moduleKey;
  };

  return (
    <aside className="w-64 bg-[#042C51] text-white flex flex-col h-screen fixed top-0 left-0 z-20 border-r border-[#083a69] select-none shadow-xl" id="sidebar-navigation">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#083a69] flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#FF5C28] flex items-center justify-center shadow-lg shadow-[#ff5c28]/20">
          <span className="text-xl font-extrabold text-white tracking-tighter">Si</span>
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="text-lg font-bold tracking-tight text-white">SiBS HRIS</h1>
            <span className="text-[10px] font-semibold uppercase tracking-wider bg-[#FF5C28]/20 text-[#FF5C28] px-1.5 py-0.5 rounded">v2.5</span>
          </div>
          <p className="text-[11px] text-slate-300/80">Enterprise Workforce Desk</p>
        </div>
      </div>
      {/* Main Nav Items */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-700">
        {currentGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            <h3 className="px-3 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">
              {group.title}
            </h3>
            <ul className="space-y-0.5">
              {group.items.map((item, iIdx) => {
                const isActive = isItemActive(item);
                const isEnabled = item.isEnabled;
                return (
                  <li key={iIdx}>
                    <button
                      type="button"
                      onClick={() => handleItemClick(item)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-150 text-left ${
                        isActive
                          ? "bg-[#FF5C28] text-white font-bold shadow-md shadow-[#ff5c28]/15 cursor-pointer"
                          : isEnabled
                            ? "text-slate-300 hover:bg-[#063560] hover:text-white cursor-pointer"
                            : "text-slate-400/65 hover:text-slate-300/80 cursor-pointer"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <item.icon className={`w-4 h-4 shrink-0 ${
                          isActive 
                            ? "text-white" 
                            : isEnabled 
                              ? "text-slate-400" 
                              : "text-slate-500/50"
                        }`} />
                        <span className={!isEnabled ? "opacity-75" : ""}>{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded uppercase tracking-wider ${
                          isActive ? "bg-white text-[#FF5C28]" : "bg-[#063560] text-slate-300"
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Workspace Context & Footer */}
      <div className="p-4 border-t border-[#083a69] bg-[#032341] space-y-3.5 relative">
        {/* Toast Notification Container inside sidebar footer for premium feel */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="absolute bottom-full left-4 right-4 bg-[#0a467e] border border-blue-400/30 text-white p-2.5 rounded-xl shadow-2xl flex items-start gap-2 text-[10px] leading-relaxed z-30 mb-2"
            >
              <Info className="w-3.5 h-3.5 text-[#FF5C28] shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-bold text-[#FF5C28]">Simulation Mode</span>
                <p className="text-slate-200 mt-0.5">{toastMessage}</p>
              </div>
              <button 
                onClick={() => setToastMessage(null)}
                className="text-slate-400 hover:text-white shrink-0 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="bg-[#05315a] p-3 rounded-lg border border-[#093f73]">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-[#FF5C28]">
            <Sparkles className="w-3 h-3 text-[#FF5C28]" />
            <span>AI Studio Sandbox</span>
          </div>
          <p className="text-[10px] text-slate-300/80 mt-1 leading-relaxed">
            Role state synced. Showing dynamic sandbox scenarios.
          </p>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
            <span className="text-[11px]">System Online</span>
          </div>
          <button 
            id="sidebar-settings-btn"
            type="button"
            onClick={() => setIsSettingsPopupOpen(true)}
            className="text-slate-400 hover:text-white transition-colors duration-150 p-1.5 rounded-lg hover:bg-[#063560] cursor-pointer"
            title="System & Workflow Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

        {/* Settings Popup Modal with Flowchart Button */}
        <AnimatePresence>
          {isSettingsPopupOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="w-full max-w-md bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
              >
                {/* Modal Header */}
                <div className="bg-[#042C51] p-4 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#FF5C28] flex items-center justify-center text-white">
                      <Settings className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white leading-tight">
                        Settings & Architecture
                      </h3>
                      <p className="text-[10px] text-slate-300">
                        SiBS HRIS v2.5 Enterprise Workspace
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsSettingsPopupOpen(false)}
                    className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-5 space-y-4">
                  {/* Primary Highlighted Card: Architecture & Operational Flowcharts */}
                  <div className="bg-gradient-to-br from-orange-50 via-amber-50/50 to-blue-50 border-2 border-[#FF5C28] rounded-xl p-4 shadow-sm relative overflow-hidden">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[#FF5C28] text-white flex items-center justify-center shadow-md">
                          <GitFork className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-xs font-black text-[#042C51]">
                              Enterprise System Flowcharts
                            </h4>
                            <span className="px-1.5 py-0.5 rounded-full bg-[#FF5C28] text-white text-[9px] font-black uppercase tracking-wider">
                              5 WORKFLOWS
                            </span>
                          </div>
                          <p className="text-[10.5px] text-slate-600 font-medium mt-0.5">
                            Interactive Operational & Architectural Blueprints
                          </p>
                        </div>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-600 mt-2.5 leading-relaxed">
                      Explore the complete <strong>Information Architecture</strong>, <strong>Recruitment Pipeline</strong> (Steps 1–16), <strong>Workforce Planning Ramp</strong>, <strong>Core HR Lifecycle</strong>, and <strong>Organizational Governance</strong> with live simulators, Mermaid diagrams, and wireframe links.
                    </p>

                    {/* Prominent Flowchart Button */}
                    <button
                      id="open-flowchart-btn"
                      type="button"
                      onClick={() => {
                        setIsSettingsPopupOpen(false);
                        if (onModuleChange) {
                          onModuleChange("Recruitment Flowchart");
                        }
                      }}
                      className="mt-3.5 w-full py-2.5 px-4 bg-[#FF5C28] hover:bg-[#e04b1c] text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer group"
                    >
                      <span>Open Architecture & Process Flowcharts</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>

                  {/* Secondary Quick Settings Links */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                      Module Configurations
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          setIsSettingsPopupOpen(false);
                          if (onModuleChange) onModuleChange("Recruitment Settings");
                        }}
                        className="p-2.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-left transition-colors cursor-pointer flex flex-col"
                      >
                        <span className="font-bold text-[#042C51] text-[11px]">Recruitment Settings</span>
                        <span className="text-[10px] text-slate-400">SLAs, Scoring & Emails</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsSettingsPopupOpen(false);
                          if (onModuleChange) onModuleChange("Office Locations");
                        }}
                        className="p-2.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-left transition-colors cursor-pointer flex flex-col"
                      >
                        <span className="font-bold text-[#042C51] text-[11px]">Campuses / Sites</span>
                        <span className="text-[10px] text-slate-400">Davao, Tagum, Mabini</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsSettingsPopupOpen(false);
                          if (onModuleChange) onModuleChange("Departments");
                        }}
                        className="p-2.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-left transition-colors cursor-pointer flex flex-col"
                      >
                        <span className="font-bold text-[#042C51] text-[11px]">Departments</span>
                        <span className="text-[10px] text-slate-400">7 Corporate Units</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsSettingsPopupOpen(false);
                          if (onModuleChange) onModuleChange("Email Logs");
                        }}
                        className="p-2.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-left transition-colors cursor-pointer flex flex-col"
                      >
                        <span className="font-bold text-[#042C51] text-[11px]">Email Logs</span>
                        <span className="text-[10px] text-slate-400">Outbound Audit</span>
                      </button>
                    </div>
                  </div>

                  {/* System Diagnostic Footer */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-medium">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                      <span>Live Sync • Port 3000</span>
                    </div>
                    <span>Version 2.5 (2026)</span>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </aside>
  );
}

