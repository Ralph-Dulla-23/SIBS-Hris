import React from "react";
import { 
  BarChart2, 
  Users, 
  Building2, 
  Settings, 
  ExternalLink, 
  CheckCircle2, 
  Sparkles,
  ArrowRight
} from "lucide-react";
import { SYSTEM_MODULES_SUMMARY } from "./flowchartData";

interface SummaryMatrixProps {
  onSwitchModule?: (moduleKey: string) => void;
}

export default function SystemModulesMatrix({ onSwitchModule }: SummaryMatrixProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "BarChart2":
        return <BarChart2 className="w-4 h-4 text-[#FF5C28]" />;
      case "Users":
        return <Users className="w-4 h-4 text-[#6B21A8]" />;
      case "Building2":
        return <Building2 className="w-4 h-4 text-[#1D68BD]" />;
      default:
        return <Settings className="w-4 h-4 text-slate-700" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider">
              OPERATIONAL MAPPING
            </span>
            <h2 className="text-base font-black text-[#042C51]">
              Summary of System Modules & Wireframe Matrix
            </h2>
          </div>
          <p className="text-xs text-slate-600 font-medium mt-1">
            Official operational mapping connecting Functional Areas to Primary Screens, Actions, Outputs, and wireframe launch points.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
          <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-xl border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>4 Core Functional Areas Fully Mapped</span>
          </span>
        </div>
      </div>

      {/* Structured Matrix Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-black text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-5">Functional Area</th>
                <th className="py-3.5 px-5">Primary Screens / Views</th>
                <th className="py-3.5 px-5">Key Actions & Outputs</th>
                <th className="py-3.5 px-5 text-right">Quick Navigation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              {SYSTEM_MODULES_SUMMARY.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  {/* Functional Area */}
                  <td className="py-4 px-5 align-top">
                    <div className="flex items-start gap-2.5">
                      <div className="p-2 rounded-xl bg-slate-100 shrink-0 mt-0.5">
                        {getIcon(item.icon)}
                      </div>
                      <div>
                        <span className="font-black text-sm text-[#042C51] block">
                          {item.area}
                        </span>
                        <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-black mt-1 border ${item.badgeColor}`}>
                          {item.primaryScreens.length} Active Screens
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Primary Screens */}
                  <td className="py-4 px-5 align-top">
                    <div className="flex flex-wrap gap-1.5 max-w-sm">
                      {item.primaryScreens.map((screen, sIdx) => (
                        <span
                          key={sIdx}
                          onClick={() => {
                            if (onSwitchModule) {
                              // map screen name to module key
                              if (screen.includes("Overview") || screen.includes("Plan")) {
                                onSwitchModule("Workforce Hiring");
                              } else if (screen.includes("Job Description")) {
                                onSwitchModule("Job Description");
                              } else if (screen.includes("Intake")) {
                                onSwitchModule("Hiring Needs Intake");
                              } else if (screen.includes("Available")) {
                                onSwitchModule("Available Positions");
                              } else if (screen.includes("Sourcing")) {
                                onSwitchModule("Sourcing Analytics");
                              } else if (screen.includes("Leads")) {
                                onSwitchModule("Applicant Leads");
                              } else if (screen.includes("Public")) {
                                onSwitchModule("Public Application Form");
                              } else if (screen.includes("Talent Pool")) {
                                onSwitchModule("Talent Pool");
                              } else if (screen.includes("Offers")) {
                                onSwitchModule("Offers");
                              } else if (screen.includes("Onboarding")) {
                                onSwitchModule("Onboarding");
                              } else if (screen.includes("Time & Attendance")) {
                                onSwitchModule("Time & Attendance");
                              } else if (screen.includes("Leaves")) {
                                onSwitchModule("Leaves & Time Off");
                              } else if (screen.includes("Resignations")) {
                                onSwitchModule("Resignation Management");
                              } else if (screen.includes("Super Admin")) {
                                onSwitchModule("Super Admin Dashboard");
                              } else if (screen.includes("Departments")) {
                                onSwitchModule("Departments");
                              } else if (screen.includes("Office Locations")) {
                                onSwitchModule("Office Locations");
                              } else if (screen.includes("Recruitment Settings")) {
                                onSwitchModule("Recruitment Settings");
                              } else if (screen.includes("Email Logs")) {
                                onSwitchModule("Email Logs");
                              } else {
                                onSwitchModule(item.primaryModuleKey);
                              }
                            }
                          }}
                          className="px-2 py-1 bg-slate-100 hover:bg-[#1D68BD] hover:text-white rounded-lg text-[10.5px] font-extrabold text-[#042C51] border border-slate-200 transition-all cursor-pointer shadow-2xs"
                          title={`Click to launch ${screen}`}
                        >
                          {screen}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Key Actions & Outputs */}
                  <td className="py-4 px-5 align-top">
                    <ul className="space-y-1 text-[11px] text-slate-600 list-disc list-inside">
                      {item.keyActions.map((action, aIdx) => (
                        <li key={aIdx} className="leading-snug">
                          {action}
                        </li>
                      ))}
                    </ul>
                  </td>

                  {/* Launch */}
                  <td className="py-4 px-5 align-top text-right">
                    {onSwitchModule && (
                      <button
                        onClick={() => onSwitchModule(item.primaryModuleKey)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#042C51] hover:bg-[#1D68BD] text-white text-xs font-bold rounded-xl transition-all shadow-2xs cursor-pointer"
                        title={`Open ${item.area}`}
                      >
                        <span>Launch Area</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
