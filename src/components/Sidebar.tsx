import React, { useState, useEffect } from "react";
import { 
  Users, 
  Clock, 
  FileText, 
  Calendar, 
  Settings, 
  Building2, 
  ShieldCheck, 
  Briefcase, 
  Compass, 
  Sparkles, 
  PieChart, 
  LayoutDashboard, 
  UserX, 
  Mail, 
  MapPin, 
  DollarSign, 
  BarChart3, 
  CreditCard, 
  CheckSquare, 
  Network, 
  Inbox, 
  UserCheck, 
  X, 
  Info, 
  ExternalLink, 
  Headphones, 
  Globe2,
  LogOut 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SidebarProps {
  currentModule: string;
  onModuleChange?: (module: string) => void;
  activeTab?: "overview" | "plan";
  onTabChange?: (tab: "overview" | "plan") => void;
}

interface MenuItem {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  isEnabled: boolean;
  moduleKey?: string;
  tabKey?: "overview" | "plan";
  badge?: string;
}

export default function Sidebar({ currentModule, onModuleChange, activeTab, onTabChange }: SidebarProps) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto-dismiss toast
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const menuGroups: { title: string; items: MenuItem[] }[] = [
    {
      title: "Employee Access",
      items: [
        { id: "sibs-portal-login", name: "SiBS Portal & Login", icon: Globe2, isEnabled: true, moduleKey: "Login Page", badge: "Portal" },
        { id: "my-dashboard", name: "My Dashboard", icon: LayoutDashboard, isEnabled: true, moduleKey: "My Dashboard" },
        { id: "birthday-egg", name: "Birthday Easter Egg", icon: Sparkles, isEnabled: true, moduleKey: "Birthday Easter Egg", badge: "Easter Egg" },
        { id: "my-resignation", name: "My Resignation", icon: UserX, isEnabled: true, moduleKey: "My Resignation", badge: "Form" },
      ]
    },
    {
      title: "Core HR Operations",
      items: [
        { id: "hr-dashboard", name: "HR Dashboard", icon: LayoutDashboard, isEnabled: true, moduleKey: "HR Dashboard" },
        { id: "ta-dashboard", name: "TA Dashboard", icon: LayoutDashboard, isEnabled: true, moduleKey: "TA Dashboard" },
        { id: "om-dashboard", name: "OM Dashboard", icon: LayoutDashboard, isEnabled: true, moduleKey: "OM Dashboard" },
        { id: "employee-directory", name: "Employee Directory", icon: Users, isEnabled: true, moduleKey: "Employee Directory" },
        { id: "time-attendance", name: "Time & Attendance", icon: Clock, isEnabled: true, moduleKey: "Time & Attendance" },
        { id: "leaves-time-off", name: "Leaves & Time Off", icon: Calendar, isEnabled: true, moduleKey: "Leaves & Time Off", badge: "4 New" },
        { id: "resignation-mgmt", name: "Resignation Management", icon: UserX, isEnabled: true, moduleKey: "Resignation Management" },
      ]
    },
    {
      title: "Talent Acquisition & Ramps",
      items: [
        { id: "wf-overview", name: "Workforce & Hiring Overview", icon: Briefcase, isEnabled: true, moduleKey: "Workforce Hiring", tabKey: "overview", badge: "Ramps" },
        { id: "wf-plan", name: "Workforce & Hiring Plan", icon: Briefcase, isEnabled: true, moduleKey: "Workforce Hiring", tabKey: "plan" },
        { id: "job-desc", name: "Job Description", icon: FileText, isEnabled: true, moduleKey: "Job Description" },
        { id: "hiring-intake", name: "Hiring Needs Intake", icon: Inbox, isEnabled: true, moduleKey: "Hiring Needs Intake" },
        { id: "avail-pos", name: "Available Positions", icon: Briefcase, isEnabled: true, moduleKey: "Available Positions" },
        { id: "sourcing-analytics", name: "Sourcing Analytics", icon: Compass, isEnabled: true, moduleKey: "Sourcing Analytics" },
        { id: "talent-pool", name: "Talent Pool", icon: Users, isEnabled: true, moduleKey: "Talent Pool" },
        { id: "public-app", name: "Public Application Form", icon: ExternalLink, isEnabled: true, moduleKey: "Public Application Form", badge: "Apply" },
        { id: "candidate-pipeline", name: "Candidate Pipeline", icon: Network, isEnabled: true, moduleKey: "Candidate Pipeline", badge: "Stage" },
        { id: "offers", name: "Offers", icon: CheckSquare, isEnabled: true, moduleKey: "Offers" },
        { id: "onboarding", name: "Onboarding", icon: UserCheck, isEnabled: true, moduleKey: "Onboarding" },
        { id: "action-items", name: "Action Items", icon: CheckSquare, isEnabled: true, moduleKey: "Action Items" },
        { id: "weekly-reports", name: "Weekly Reports", icon: PieChart, isEnabled: true, moduleKey: "Weekly Reports" },
        { id: "candidate-exp", name: "Candidate Experience", icon: Sparkles, isEnabled: true, moduleKey: "Candidate Experience" },
        { id: "candidate-survey", name: "Public Survey Form", icon: ExternalLink, isEnabled: true, moduleKey: "Public Survey Form", badge: "Survey" },
      ]
    },
    {
      title: "Workflows & Approvals",
      items: [
        { id: "approvals", name: "Approval Requests", icon: ShieldCheck, isEnabled: false },
        { id: "email-logs", name: "Email Logs", icon: Mail, isEnabled: false },
      ]
    },
    {
      title: "Finance & Payroll",
      items: [
        { id: "exec-reports", name: "Executive Reports", icon: BarChart3, isEnabled: false },
        { id: "wf-analytics", name: "Workforce Analytics", icon: PieChart, isEnabled: false },
        { id: "cost-centers", name: "Cost Centers", icon: DollarSign, isEnabled: false },
        { id: "payroll-ops", name: "Payroll Operations", icon: CreditCard, isEnabled: false },
      ]
    },
    {
      title: "Enterprise Administration",
      items: [
        { id: "super-admin", name: "Super Admin Dashboard", icon: ShieldCheck, isEnabled: true, moduleKey: "Super Admin Dashboard", badge: "Admin" },
        { id: "depts", name: "Departments & Units", icon: Building2, isEnabled: false },
        { id: "offices", name: "Office Locations", icon: MapPin, isEnabled: false },
      ]
    },
    {
      title: "System Config",
      items: [
        { id: "recruitment-settings", name: "Recruitment Settings", icon: Settings, isEnabled: false },
        { id: "security-settings", name: "Security & Permissions", icon: Settings, isEnabled: false },
      ]
    }
  ];

  const handleItemClick = (item: MenuItem) => {
    if (!item.isEnabled) {
      setToastMessage(`"${item.name}" is simulated in this high-fidelity demonstration sandbox.`);
      return;
    }

    if (item.moduleKey && onModuleChange) {
      onModuleChange(item.moduleKey);
      if (item.moduleKey === "Workforce Hiring" && item.tabKey && onTabChange) {
        onTabChange(item.tabKey);
      }
    }
  };

  const isItemActive = (item: MenuItem): boolean => {
    if (!item.moduleKey) return false;
    
    if (item.moduleKey === "Workforce Hiring") {
      return currentModule === "Workforce Hiring" && activeTab === item.tabKey;
    }

    return currentModule === item.moduleKey;
  };

  return (
    <aside 
      className="w-72 bg-gradient-to-b from-[#042C51] via-[#032342] to-[#02182B] text-white flex flex-col h-screen fixed top-0 left-0 z-20 border-r border-[#083A69] select-none shadow-2xl" 
      id="sidebar-navigation"
    >
      {/* SiBS Contact Center Official Brand Header */}
      <div className="p-4 border-b border-[#083A69]/80 bg-[#03223F]/70 backdrop-blur-md">
        <div className="flex items-center gap-3">
          {/* SiBS Orange Brand Icon Badge */}
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#FF5C28] to-[#E04412] flex flex-col items-center justify-center shadow-lg shadow-[#FF5C28]/25 border border-white/20 shrink-0">
            <span className="text-xl font-black text-white tracking-tighter leading-none">Si</span>
            <span className="text-[9px] font-extrabold text-white/90 uppercase tracking-tight -mt-0.5">BS</span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-black tracking-tight text-white flex items-center">
                SiBS<span className="text-[#FF5C28] ml-0.5">.</span>
              </h1>
              <span className="text-[9px] font-black uppercase tracking-wider bg-[#FF5C28]/20 text-[#FF7A4D] px-1.5 py-0.5 rounded border border-[#FF5C28]/30">
                HRIS
              </span>
            </div>
            <p className="text-[10px] font-bold text-slate-300 tracking-wider uppercase truncate mt-0.5">
              Contact Center
            </p>
          </div>
        </div>

        {/* Brand Tagline & Status Banner */}
        <div className="mt-3 px-3 py-1.5 rounded-lg bg-[#053158]/80 border border-[#094175]/80 flex items-center justify-between text-[10px]">
          <div className="flex items-center gap-1.5 text-slate-300 min-w-0">
            <Globe2 className="w-3.5 h-3.5 text-[#FF5C28] shrink-0" />
            <span className="font-semibold text-slate-200 truncate">Global BPO Portal</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[9px] font-black text-emerald-400">PST Sync</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Items */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5 scrollbar-thin scrollbar-thumb-[#0A4378] scrollbar-track-transparent">
        {menuGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            <div className="px-3 flex items-center justify-between mb-1.5">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none flex items-center gap-1.5">
                <span className="w-1 h-2.5 bg-[#FF5C28] rounded-full"></span>
                {group.title}
              </h3>
            </div>

            <ul className="space-y-1">
              {group.items.map((item) => {
                const isActive = isItemActive(item);
                const isEnabled = item.isEnabled;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      id={`nav-item-${item.id}`}
                      onClick={() => handleItemClick(item)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 text-left relative group ${
                        isActive
                          ? "bg-[#FF5C28] text-white font-bold shadow-md shadow-[#FF5C28]/25 cursor-pointer ring-1 ring-white/20"
                          : isEnabled
                            ? "text-slate-300 hover:bg-[#073866] hover:text-white cursor-pointer"
                            : "text-slate-400/60 hover:text-slate-300/80 cursor-pointer"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 pr-1">
                        <item.icon className={`w-4 h-4 shrink-0 transition-colors duration-150 ${
                          isActive 
                            ? "text-white" 
                            : isEnabled 
                              ? "text-slate-300 group-hover:text-[#FF5C28]" 
                              : "text-slate-500/50"
                        }`} />
                        <span className={`text-[11.5px] leading-tight ${!isEnabled ? "opacity-70" : ""}`}>
                          {item.name}
                        </span>
                      </div>

                      {item.badge && (
                        <span className={`shrink-0 ml-1.5 px-2 py-0.5 text-[9px] font-black rounded-md uppercase tracking-wider transition-colors ${
                          isActive 
                            ? "bg-white text-[#FF5C28] shadow-xs" 
                            : "bg-[#063560] text-[#FF7A4D] border border-[#FF5C28]/30 group-hover:border-[#FF5C28]/60"
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
      <div className="p-3.5 border-t border-[#083A69] bg-[#02182B] space-y-3 relative">
        {/* Toast Notification */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="absolute bottom-full left-3 right-3 bg-[#0A3D6C] border border-[#FF5C28]/40 text-white p-3 rounded-xl shadow-2xl flex items-start gap-2.5 text-[11px] leading-relaxed z-30 mb-2"
            >
              <Info className="w-4 h-4 text-[#FF5C28] shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-bold text-[#FF5C28] block">Interactive Feature</span>
                <p className="text-slate-200 mt-0.5">{toastMessage}</p>
              </div>
              <button 
                onClick={() => setToastMessage(null)}
                className="text-slate-400 hover:text-white shrink-0 cursor-pointer p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SiBS Delivery Centers Card */}
        <div className="bg-[#05284B] p-2.5 rounded-xl border border-[#094175] flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-lg bg-[#FF5C28]/20 border border-[#FF5C28]/30 flex items-center justify-center text-[#FF5C28] shrink-0">
              <Headphones className="w-3 h-3" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-extrabold text-white truncate">SiBS Delivery Centers</p>
              <p className="text-[9px] text-slate-300/80 truncate">Manila • Clark • Cebu • US</p>
            </div>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
        </div>

        {/* User Account / Session Profile */}
        <div className="flex items-center justify-between pt-1 text-xs text-slate-300 font-medium">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#063E73] to-[#042C51] border border-[#FF5C28]/40 flex items-center justify-center text-white font-bold text-[10px] shadow-sm">
              AB
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-white truncate">Alena Batacan</p>
              <p className="text-[9px] text-[#FF7A4D] font-semibold truncate">Operations Director</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button 
              type="button"
              onClick={() => setToastMessage("Settings console is active in HR Administration.")}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-[#073866] rounded-lg transition-colors cursor-pointer"
              title="System Preferences"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button 
              type="button"
              onClick={() => onModuleChange?.("Login Page")}
              className="p-1.5 text-slate-400 hover:text-[#FF5C28] hover:bg-[#073866] rounded-lg transition-colors cursor-pointer"
              title="Sign Out / Return to SiBS Portal Landing Page"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
