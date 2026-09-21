import React, { useState } from "react";
import { 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Building2, 
  Users, 
  Clock, 
  Briefcase, 
  Calendar, 
  HelpCircle, 
  ExternalLink,
  ChevronRight,
  Headphones,
  Award,
  Globe2,
  KeyRound,
  Info,
  X
} from "lucide-react";

export interface LoginUser {
  id: string;
  sibsId: string;
  name: string;
  email: string;
  role: string;
  department: string;
  account: string;
  avatarText: string;
}

export const DEMO_USERS: LoginUser[] = [
  {
    id: "user-alena",
    sibsId: "6784",
    name: "Batacan, Alena Mendoza",
    email: "alena.batacan@thesiblingssolutions.com",
    role: "Operations Specialist",
    department: "Telecom & Tech Support",
    account: "Verizon Tech",
    avatarText: "AB"
  },
  {
    id: "user-ralph",
    sibsId: "1001",
    name: "Dulla, Ralph",
    email: "dulla13ralph@gmail.com",
    role: "Super Admin & HR Director",
    department: "Executive Leadership",
    account: "Corporate",
    avatarText: "RD"
  },
  {
    id: "user-sarah",
    sibsId: "4201",
    name: "Jenkins, Sarah",
    email: "sarah.jenkins@thesiblingssolutions.com",
    role: "WFM Principal Analyst",
    department: "Workforce Management",
    account: "All Accounts",
    avatarText: "SJ"
  },
  {
    id: "user-christian",
    sibsId: "3105",
    name: "Reyes, Christian",
    email: "christian.reyes@thesiblingssolutions.com",
    role: "Talent Acquisition Lead",
    department: "Human Resources",
    account: "Talent Acquisition",
    avatarText: "CR"
  }
];

interface SibsLoginLandingPageProps {
  onLogin: (user: LoginUser) => void;
  onNavigateToPublicApp?: () => void;
  onNavigateToSurvey?: () => void;
}

export default function SibsLoginLandingPage({
  onLogin,
  onNavigateToPublicApp,
  onNavigateToSurvey
}: SibsLoginLandingPageProps) {
  const [sibsId, setSibsId] = useState("6784");
  const [password, setPassword] = useState("••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [authSuccessMessage, setAuthSuccessMessage] = useState<string | null>(null);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [activeFeatureTab, setActiveFeatureTab] = useState<"wfm" | "attendance" | "talent" | "culture">("wfm");

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    const cleanId = sibsId.trim().toUpperCase().replace("SIBS-", "");
    if (!cleanId) {
      setErrorMessage("Please enter your SIBS ID to continue.");
      return;
    }

    setIsLoading(true);

    // Simulate enterprise authentication
    setTimeout(() => {
      const matchedUser = DEMO_USERS.find(
        u => u.sibsId === cleanId || u.sibsId === sibsId.trim()
      ) || {
        id: `user-${cleanId}`,
        sibsId: cleanId,
        name: cleanId === "6784" ? "Batacan, Alena Mendoza" : `Employee #${cleanId}`,
        email: cleanId === "6784" ? "alena.batacan@thesiblingssolutions.com" : `employee.${cleanId}@thesiblingssolutions.com`,
        role: "Operations Specialist",
        department: "Operations & Contact Center",
        account: "Verizon Tech",
        avatarText: "SB"
      };

      setAuthSuccessMessage(`Credentials verified. Welcome back, ${matchedUser.name}!`);
      
      setTimeout(() => {
        setIsLoading(false);
        onLogin(matchedUser);
      }, 700);
    }, 600);
  };

  const handleSelectDemoUser = (user: LoginUser) => {
    setSibsId(user.sibsId);
    setPassword("••••••••");
    setErrorMessage(null);
  };

  return (
    <div 
      id="sibs-login-landing-page"
      className="min-h-screen w-full relative overflow-x-hidden text-white font-sans flex flex-col justify-between selection:bg-[#FF5C28] selection:text-white"
      style={{
        background: "linear-gradient(135deg, #051B33 0%, #0A2D54 32%, #183C66 54%, #7C3A2B 78%, #D34B19 92%, #FF5C28 100%)"
      }}
    >
      {/* Subtle Atmospheric Lighting / Mesh Orbs */}
      <div className="absolute top-0 left-0 w-[550px] h-[550px] bg-[#0055A5]/25 rounded-full blur-3xl pointer-events-none -translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 right-0 w-[650px] h-[650px] bg-[#FF5C28]/20 rounded-full blur-3xl pointer-events-none translate-x-1/4 translate-y-1/4" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-950/20 rounded-full blur-[140px] pointer-events-none" />

      {/* ==================== 1. TOP LANDING NAVBAR ==================== */}
      <header className="relative z-20 w-full border-b border-white/10 bg-slate-950/30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
          
          {/* Logo & Portal Badge */}
          <div className="flex items-center gap-3">
            <div className="flex items-baseline gap-1 select-none">
              <span className="text-2xl sm:text-3xl font-black tracking-tight text-white font-sans drop-shadow-sm">
                S<span className="text-[#FF5C28]">i</span>BS
              </span>
            </div>
            <div className="h-5 w-px bg-white/20 hidden sm:block" />
            <div className="hidden sm:flex flex-col">
              <span className="text-[11px] font-bold text-slate-200 uppercase tracking-wider leading-tight">
                Human Resource Information System
              </span>
              <span className="text-[9px] text-orange-200 font-medium tracking-wide">
                Enterprise Portal v2.6 • Global Delivery
              </span>
            </div>
          </div>

          {/* Quick Hubs & External Links */}
          <div className="flex items-center gap-2 sm:gap-4 text-xs font-semibold">
            {/* Live System Status */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>HRIS Online • 99.98% SLA</span>
            </div>

            {/* Candidate Portal Shortcut */}
            {onNavigateToPublicApp && (
              <button
                type="button"
                onClick={onNavigateToPublicApp}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-all border border-white/10 text-[11px]"
              >
                <Briefcase className="w-3.5 h-3.5 text-[#FFC72C]" />
                <span>Careers & Talent Pool</span>
              </button>
            )}

            {/* Candidate Experience Survey */}
            {onNavigateToSurvey && (
              <button
                type="button"
                onClick={onNavigateToSurvey}
                className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-all border border-white/10 text-[11px]"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#FF5C28]" />
                <span>Candidate Survey</span>
              </button>
            )}

            {/* Need Help Button */}
            <button
              type="button"
              onClick={() => setShowHelpModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-all border border-white/10 text-xs font-medium cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-orange-300" />
              <span className="hidden sm:inline">IT Support</span>
            </button>
          </div>
        </div>
      </header>

      {/* ==================== 2. MAIN HERO & LOGIN SHOWCASE ==================== */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-14 w-full flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* LEFT COLUMN: LANDING PAGE HERO STORY & ENTERPRISE VALUE */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            
            {/* Tagline / Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#FF5C28]" />
              <span className="text-xs font-bold text-slate-200 tracking-wide uppercase">
                SiBS Contact Center & BPO Solutions
              </span>
            </div>

            {/* Display Headline */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-5xl xl:text-6xl font-black text-white tracking-tight leading-[1.12]">
                Your Partner for{" "}
                <span className="relative inline-block text-white">
                  <span className="relative z-10">Extraordinary</span>
                  <span className="absolute bottom-1.5 left-0 right-0 h-3 sm:h-4 bg-[#FF5C28]/80 -rotate-1 rounded-sm -z-0 opacity-90" />
                </span>{" "}
                Workforce & Operations.
              </h1>
              
              <p className="text-base sm:text-lg text-slate-200/90 font-normal leading-relaxed max-w-2xl pt-1">
                The centralized single-sign-on portal for SiBS employees, operations managers, and leadership. 
                Track live attendance, review weekly headcount ramps, process leaves, and manage recruitment pipelines across global delivery centers.
              </p>
            </div>

            {/* Enterprise Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              <div className="p-3.5 rounded-2xl bg-slate-900/40 border border-white/15 backdrop-blur-md">
                <div className="text-xl sm:text-2xl font-black text-white">5,200+</div>
                <div className="text-[11px] font-medium text-slate-300 mt-0.5">Active Workforce</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900/40 border border-white/15 backdrop-blur-md">
                <div className="text-xl sm:text-2xl font-black text-[#FFC72C]">6 Hubs</div>
                <div className="text-[11px] font-medium text-slate-300 mt-0.5">Delivery Centers</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900/40 border border-white/15 backdrop-blur-md">
                <div className="text-xl sm:text-2xl font-black text-emerald-400">99.4%</div>
                <div className="text-[11px] font-medium text-slate-300 mt-0.5">Attendance SLA</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900/40 border border-white/15 backdrop-blur-md">
                <div className="text-xl sm:text-2xl font-black text-[#FF5C28]">&lt; 24h</div>
                <div className="text-[11px] font-medium text-slate-300 mt-0.5">Talent Fast-Track</div>
              </div>
            </div>

            {/* Interactive Feature Explorer Pills */}
            <div className="space-y-2.5 pt-1">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#FF5C28]" />
                <span>Integrated HRIS Ecosystem</span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setActiveFeatureTab("wfm")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeFeatureTab === "wfm" 
                      ? "bg-[#FF5C28] text-white shadow-md shadow-[#FF5C28]/30" 
                      : "bg-white/10 text-slate-200 hover:bg-white/20 border border-white/10"
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Workforce Ramps & PRF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFeatureTab("attendance")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeFeatureTab === "attendance" 
                      ? "bg-[#FF5C28] text-white shadow-md shadow-[#FF5C28]/30" 
                      : "bg-white/10 text-slate-200 hover:bg-white/20 border border-white/10"
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Time, Shift & Overtime</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFeatureTab("talent")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeFeatureTab === "talent" 
                      ? "bg-[#FF5C28] text-white shadow-md shadow-[#FF5C28]/30" 
                      : "bg-white/10 text-slate-200 hover:bg-white/20 border border-white/10"
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Talent Pool & Pipeline</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFeatureTab("culture")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeFeatureTab === "culture" 
                      ? "bg-[#FF5C28] text-white shadow-md shadow-[#FF5C28]/30" 
                      : "bg-white/10 text-slate-200 hover:bg-white/20 border border-white/10"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Employee Perks & Celebrations</span>
                </button>
              </div>

              {/* Dynamic Feature Context Card */}
              <div className="p-4 rounded-2xl bg-slate-900/50 border border-white/15 backdrop-blur-md text-xs leading-relaxed text-slate-200">
                {activeFeatureTab === "wfm" && (
                  <p>
                    <strong className="text-white font-bold">WFM & Capacity Planning:</strong> Real-time headcount tracking against OPS PRF targets, buffer monitoring, absenteeism/attrition gap analysis, and one-click action plan formulation for Q3 2026.
                  </p>
                )}
                {activeFeatureTab === "attendance" && (
                  <p>
                    <strong className="text-white font-bold">Live Biometrics & Overtime:</strong> Automatic syncing with physical turnstiles in Mandaluyong, Alabang, Clark, and Cebu delivery sites. Instant leave filing and manager sign-offs.
                  </p>
                )}
                {activeFeatureTab === "talent" && (
                  <p>
                    <strong className="text-white font-bold">Recruitment & VoC:</strong> Master candidate application portal with voice screening, dynamic Kanban pipeline tracking from NHO to Go-Live, and automated Voice of Candidate surveys.
                  </p>
                )}
                {activeFeatureTab === "culture" && (
                  <p>
                    <strong className="text-white font-bold">SiBS Family Perks:</strong> Birthday recognition celebrations, milestone anniversary awards, digital self-service request desk, and transparent career advancement tracking.
                  </p>
                )}
              </div>
            </div>

            {/* Live Operational Bulletin */}
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF5C28] shrink-0 animate-ping" />
              <span className="font-semibold text-slate-200 truncate">
                <span className="text-[#FFC72C] font-bold">Live Bulletin:</span> Q3 2026 Ramp active across Telecom & Tech clusters. Biometric clock synchronization online.
              </span>
            </div>
          </div>

          {/* RIGHT COLUMN: REVAMPED GLASSMORPHISM LOGIN CARD FROM THE IMAGE */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-md relative">
              
              {/* Card Ambient Glow Behind */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#0055A5]/30 to-[#FF5C28]/40 rounded-[32px] blur-xl opacity-75 group-hover:opacity-100 transition duration-1000 -z-10" />

              {/* Frosted Glass Card Container */}
              <div className="relative rounded-[28px] bg-[#1E293B]/80 sm:bg-[#0F2236]/80 backdrop-blur-2xl border border-white/20 p-7 sm:p-9 shadow-2xl shadow-black/60 text-white">
                
                {/* Brand Header Inside Card - Match Exact Stylization from Image */}
                <div className="text-center space-y-1.5 pb-6">
                  <div className="inline-block">
                    <span className="text-4xl sm:text-5xl font-black tracking-tight text-white font-sans drop-shadow-md">
                      S<span className="text-[#FF5C28]">i</span>BS
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-[#FF5C28] tracking-wide uppercase drop-shadow-sm">
                    Human Resource Information System
                  </p>
                  <p className="text-[11px] text-slate-300 font-medium pt-0.5">
                    Sign in with your enterprise credentials
                  </p>
                </div>

                {/* Quick 1-Click Demo Profiles Bar */}
                <div className="mb-5 p-2.5 rounded-xl bg-slate-900/60 border border-white/10 space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
                    <span>Quick Demo Sign-In:</span>
                    <span className="text-[#FFC72C]">Auto-Fills Form</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {DEMO_USERS.slice(0, 2).map(user => (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => handleSelectDemoUser(user)}
                        className={`p-1.5 rounded-lg text-left text-[11px] transition-all border cursor-pointer ${
                          sibsId === user.sibsId 
                            ? "bg-[#FF5C28]/20 border-[#FF5C28] text-white font-bold" 
                            : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        <div className="truncate font-semibold">{user.name.split(",")[0]}</div>
                        <div className="text-[9px] text-slate-400">ID: {user.sibsId}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  {/* SIBS ID Field */}
                  <div className="space-y-1.5">
                    <label 
                      htmlFor="input-sibs-id" 
                      className="block text-xs font-bold text-slate-200 uppercase tracking-wide"
                    >
                      SIBS ID
                    </label>
                    <div className="relative">
                      <input
                        id="input-sibs-id"
                        type="text"
                        value={sibsId}
                        onChange={e => {
                          setSibsId(e.target.value);
                          setErrorMessage(null);
                        }}
                        placeholder="e.g. 6784"
                        disabled={isLoading}
                        className="w-full px-4 py-3 bg-[#E8F0FE] text-[#042C51] font-bold text-sm sm:text-base rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#FF5C28] focus:bg-white transition-all shadow-inner placeholder-slate-400"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 bg-white/80 px-2 py-0.5 rounded border border-slate-200">
                        EMP
                      </div>
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label 
                        htmlFor="input-password" 
                        className="block text-xs font-bold text-slate-200 uppercase tracking-wide"
                      >
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowHelpModal(true)}
                        className="text-[11px] text-orange-300 hover:text-white font-medium transition-colors cursor-pointer"
                      >
                        Forgot?
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        id="input-password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={e => {
                          setPassword(e.target.value);
                          setErrorMessage(null);
                        }}
                        placeholder="Enter password"
                        disabled={isLoading}
                        className="w-full pl-4 pr-11 py-3 bg-[#E8F0FE] text-[#042C51] font-bold text-sm sm:text-base rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#FF5C28] focus:bg-white transition-all shadow-inner placeholder-slate-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-[#042C51] p-1 rounded transition-colors cursor-pointer"
                        title={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me & Security Status */}
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={e => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded text-[#FF5C28] bg-white/10 border-white/30 focus:ring-[#FF5C28] focus:ring-offset-0 cursor-pointer accent-[#FF5C28]"
                      />
                      <span>Remember my SIBS ID</span>
                    </label>

                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Lock className="w-3 h-3 text-emerald-400" />
                      SSL 256-bit
                    </span>
                  </div>

                  {/* Feedback / Error / Success Messages */}
                  {errorMessage && (
                    <div className="p-3 rounded-xl bg-red-500/20 border border-red-400/40 text-red-200 text-xs flex items-center gap-2 animate-shake">
                      <X className="w-4 h-4 text-red-400 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {authSuccessMessage && (
                    <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{authSuccessMessage}</span>
                    </div>
                  )}

                  {/* Login Button (Solid Radiant Orange like in the image) */}
                  <button
                    type="submit"
                    id="btn-sibs-login"
                    disabled={isLoading}
                    className="w-full mt-2 py-3.5 px-6 rounded-xl font-extrabold text-base text-white bg-[#FF5C28] hover:bg-[#E04412] active:scale-[0.99] transition-all shadow-lg shadow-[#FF5C28]/40 hover:shadow-[#FF5C28]/60 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-wait"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Verifying SIBS ID...</span>
                      </>
                    ) : (
                      <>
                        <span>Login</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </>
                    )}
                  </button>
                </form>

                {/* Card Sub-Links: Public Forms */}
                <div className="mt-6 pt-5 border-t border-white/10 space-y-2 text-center text-xs text-slate-300">
                  {onNavigateToPublicApp && (
                    <p>
                      Applying for an open BPO role?{" "}
                      <button
                        type="button"
                        onClick={onNavigateToPublicApp}
                        className="text-[#FFC72C] hover:text-white font-bold underline underline-offset-2 transition-colors cursor-pointer"
                      >
                        Submit to Talent Pool →
                      </button>
                    </p>
                  )}
                  {onNavigateToSurvey && (
                    <p className="text-[11px] text-slate-400">
                      Attended a candidate interview?{" "}
                      <button
                        type="button"
                        onClick={onNavigateToSurvey}
                        className="text-orange-300 hover:text-white font-semibold transition-colors cursor-pointer"
                      >
                        Candidate Feedback Survey
                      </button>
                    </p>
                  )}
                </div>

                {/* Footer Security Badge */}
                <div className="mt-4 text-center">
                  <span className="text-[10px] text-slate-400/80 font-mono uppercase tracking-wider">
                    Authorized SiBS Personnel Only • Enterprise Biometric HRIS
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ==================== 3. LANDING PAGE FOOTER ==================== */}
      <footer className="relative z-20 w-full border-t border-white/10 bg-slate-950/40 backdrop-blur-md py-4 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">SiBS</span>
            <span>• The Siblings Solutions Inc. © 2026. All Rights Reserved.</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-300">
            <span>Mandaluyong</span>
            <span>•</span>
            <span>Alabang</span>
            <span>•</span>
            <span>Clark</span>
            <span>•</span>
            <span>Cebu</span>
            <span>•</span>
            <span>Davao</span>
            <span>•</span>
            <span>Remote</span>
          </div>
        </div>
      </footer>

      {/* ==================== HELP & RECOVERY MODAL ==================== */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0A2D54] border border-white/20 rounded-2xl max-w-md w-full p-6 text-white shadow-2xl relative">
            <button
              onClick={() => setShowHelpModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#FF5C28]/20 border border-[#FF5C28]/40 flex items-center justify-center text-[#FF5C28]">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">SIBS ID & Password Help</h3>
                <p className="text-xs text-slate-300">IT Helpdesk & Corporate Recovery</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-200 leading-relaxed">
              <p>
                Your <strong className="text-white">SIBS ID</strong> is the 4-to-6 digit identification number issued by Human Resources during your onboarding (e.g. <span className="font-mono text-[#FFC72C] font-bold">6784</span>).
              </p>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/10 space-y-1">
                <div className="font-bold text-slate-100 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-[#FF5C28]" />
                  <span>Demo Accounts Available:</span>
                </div>
                <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-300 pt-1">
                  <li><strong className="text-white">6784</strong> - Batacan, Alena Mendoza (Operations)</li>
                  <li><strong className="text-white">1001</strong> - Dulla, Ralph (Super Admin)</li>
                  <li><strong className="text-white">4201</strong> - Jenkins, Sarah (WFM Principal)</li>
                  <li><strong className="text-white">3105</strong> - Reyes, Christian (Talent Acquisition)</li>
                </ul>
              </div>
              <p className="text-[11px] text-slate-400">
                If your account is locked due to multiple failed biometric or password attempts, contact your local Site IT Service Desk at <span className="text-orange-300 underline font-mono">helpdesk@thesiblingssolutions.com</span> or local extension 1102.
              </p>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setSibsId("6784");
                  setPassword("••••••••");
                  setShowHelpModal(false);
                }}
                className="px-4 py-2 bg-[#FF5C28] hover:bg-[#E04412] text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Use Demo ID 6784
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
