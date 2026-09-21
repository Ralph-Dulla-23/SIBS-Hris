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
  Sparkles
} from "lucide-react";

interface HeaderProps {
  userEmail: string;
  onOpenCalendar?: () => void;
}

export default function Header({ userEmail, onOpenCalendar }: HeaderProps) {
  const [timeStr, setTimeStr] = useState("2026-07-29 22:40:05 GMT+8");
  
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
    <header className="h-16 bg-white border-b border-[#E6ECF2] flex items-center justify-between px-6 fixed top-0 right-0 left-64 z-10 select-none shadow-sm">
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
        {/* Clickable Environment time & schedule launcher */}
        <button
          onClick={onOpenCalendar}
          title="Click to view and adjust HR & Talent Acquisition calendar"
          className="flex items-center gap-2 text-xs font-semibold text-[#042C51] bg-[#E9F0FC]/70 hover:bg-[#042C51] hover:text-white border border-[#4B9DFE]/30 px-3 py-1.5 rounded-xl transition-all duration-200 cursor-pointer shadow-2xs group active:scale-95"
        >
          <Calendar className="w-4 h-4 text-[#FF5C28] group-hover:text-white transition-colors" />
          <span className="hidden sm:inline font-mono text-[11px] font-bold tracking-tight">
            {timeStr}
          </span>
          <span className="px-1.5 py-0.5 rounded-full bg-[#042C51] text-white text-[9.5px] font-extrabold uppercase tracking-wide group-hover:bg-[#FF5C28] transition-all">
            Calendar
          </span>
        </button>

        {/* Action icons */}
        <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
          <button className="p-2 text-slate-400 hover:text-[#042C51] hover:bg-[#F1F5F9] rounded-lg transition-all relative">
            <Bell className="w-4.5 h-4.5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FF5C28] rounded-full ring-2 ring-white"></span>
          </button>
          
          <button className="p-2 text-slate-400 hover:text-[#042C51] hover:bg-[#F1F5F9] rounded-lg transition-all hidden sm:flex">
            <Globe className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* User Account Menu */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-[#E9F0FC] border border-[#E6ECF2] flex items-center justify-center text-[#042C51] font-bold text-xs shadow-inner uppercase">
            {userEmail === "alena.batacan@thesiblingssolutions.com" ? "A" : (userEmail ? userEmail.slice(0, 2) : "HR")}
          </div>
          <div className="hidden md:block text-left">
            <div className="flex items-center gap-1">
              <span className="text-xs font-semibold text-[#101828] max-w-[180px] truncate">
                {userEmail === "alena.batacan@thesiblingssolutions.com" ? "BATACAN, ALENA MENDOZA" : (userEmail || "WFM Administrator")}
              </span>
              <ChevronDown className="w-3 h-3 text-[#667085]" />
            </div>
            <span className="text-[9px] font-bold text-[#FF5C28] uppercase tracking-wider block">
              {userEmail === "alena.batacan@thesiblingssolutions.com" ? "alena.batacan@thesiblingssolutions.com" : "Operations Director"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
