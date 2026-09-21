import React, { useState, useEffect } from "react";
import { 
  Bell, 
  Search, 
  Globe, 
  Database, 
  ChevronDown, 
  User, 
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  LogOut,
  ShieldAlert
} from "lucide-react";

interface HeaderProps {
  userEmail: string;
  userName?: string;
  sibsId?: string;
  onTriggerBirthday?: () => void;
  onNavigateBirthday?: () => void;
  onLogout?: () => void;
  onNavigateModule?: (module: string) => void;
}

export default function Header({ 
  userEmail, 
  userName,
  sibsId,
  onTriggerBirthday, 
  onNavigateBirthday,
  onLogout,
  onNavigateModule
}: HeaderProps) {
  const [timeStr, setTimeStr] = useState("2026-07-19 22:40:05 PST");
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  useEffect(() => {
    // Keep a simulated clock updating slightly
    const interval = setInterval(() => {
      const now = new Date();
      setTimeStr(now.toLocaleString("en-US", { 
        year: "numeric", 
        month: "short", 
        day: "2-digit", 
        hour: "2-digit", 
        minute: "2-digit", 
        second: "2-digit", 
        hour12: false 
      }) + " GMT+8");
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-[#E6ECF2] flex items-center justify-between px-6 fixed top-0 right-0 left-72 z-10 select-none shadow-sm">
      {/* Search Bar / Fast Switcher */}
      <div className="flex items-center gap-4">
        <div className="relative w-80">
          <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-slate-400" />
          </span>
          <input
            type="text"
            placeholder="Search accounts, clusters, and plans..."
            className="w-full pl-9 pr-4 py-1.5 bg-[#F1F5F9] border border-transparent rounded-lg text-xs font-medium text-[#101828] placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#042C51] transition-all duration-150"
          />
        </div>
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full border border-emerald-100">
          <Database className="w-3 h-3" />
          <span>Operations DB Sync: Ok</span>
        </div>
      </div>

      {/* Utilities & User Actions */}
      <div className="flex items-center gap-4">
        {/* Environment status indicator */}
        <div className="hidden xl:flex items-center gap-2 text-xs text-[#667085] font-medium border-r border-slate-200 pr-4">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{timeStr}</span>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-2">
          {onTriggerBirthday && (
            <button
              onClick={onTriggerBirthday}
              title="Today is your birthday! Click to view greeting"
              className="px-2.5 py-1 bg-orange-50 hover:bg-orange-100 text-[#FF5C28] border border-orange-200 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Happy Birthday!</span>
            </button>
          )}

          <button className="p-2 text-slate-400 hover:text-[#042C51] hover:bg-[#F1F5F9] rounded-lg transition-all relative">
            <Bell className="w-4.5 h-4.5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FF5C28] rounded-full ring-2 ring-white"></span>
          </button>
          
          <button className="p-2 text-slate-400 hover:text-[#042C51] hover:bg-[#F1F5F9] rounded-lg transition-all hidden sm:flex">
            <Globe className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* User Account Menu with Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2.5 pl-2 border-l border-slate-200 hover:opacity-90 transition-opacity cursor-pointer select-none text-left"
          >
            <div className="w-8 h-8 rounded-full bg-[#E9F0FC] border border-[#E6ECF2] flex items-center justify-center text-[#042C51] font-bold text-xs shadow-inner uppercase">
              {userName ? userName.split(",")[0].trim().slice(0, 2) : (userEmail === "alena.batacan@thesiblingssolutions.com" ? "AB" : "HR")}
            </div>
            <div className="hidden md:block text-left">
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-[#101828] max-w-[180px] truncate">
                  {userName || (userEmail === "alena.batacan@thesiblingssolutions.com" ? "BATACAN, ALENA MENDOZA" : (userEmail || "WFM Administrator"))}
                </span>
                <ChevronDown className={`w-3 h-3 text-[#667085] transition-transform ${isUserMenuOpen ? "rotate-180" : ""}`} />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-bold text-[#FF5C28] uppercase tracking-wider block">
                  {sibsId ? `SIBS ID: ${sibsId}` : (userEmail === "alena.batacan@thesiblingssolutions.com" ? "SIBS ID: 6784" : "HR Staff")}
                </span>
                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                <span className="text-[9px] text-slate-400 font-medium">Online</span>
              </div>
            </div>
          </button>

          {/* Dropdown Menu */}
          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 text-xs">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="font-bold text-[#042C51] truncate">
                  {userName || "BATACAN, ALENA MENDOZA"}
                </p>
                <p className="text-[11px] text-slate-500 truncate">{userEmail}</p>
                <div className="mt-1 flex items-center gap-1.5 text-[10px] text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-200/80 font-mono">
                  <span>Badge ID: <strong>{sibsId || "6784"}</strong></span>
                  <span>•</span>
                  <span>Telecom & Tech</span>
                </div>
              </div>

              <div className="py-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    onNavigateModule?.("My Dashboard");
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 font-medium flex items-center justify-between cursor-pointer"
                >
                  <span>My Employee Dashboard</span>
                  <span className="text-[10px] text-slate-400">View</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    onNavigateModule?.("Workforce Hiring");
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 font-medium flex items-center justify-between cursor-pointer"
                >
                  <span>Workforce & Hiring Overview</span>
                  <span className="text-[10px] text-slate-400">Ramps</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    onNavigateModule?.("Public Application Form");
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 font-medium flex items-center justify-between cursor-pointer"
                >
                  <span>Public Careers / Talent Pool</span>
                  <span className="text-[10px] text-emerald-600 font-bold">Live</span>
                </button>
              </div>

              <div className="pt-1 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    if (onLogout) onLogout();
                    else onNavigateModule?.("Login Page");
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-orange-50 text-[#FF5C28] font-bold flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-[#FF5C28]" />
                  <span>Sign Out to SiBS Portal Landing</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
