import React, { useState, useEffect, useMemo } from "react";
import {
  Users,
  Building2,
  Clock,
  Calendar,
  CreditCard,
  Plus,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Info,
  ChevronRight,
  X,
  Check,
  AlertCircle,
  Briefcase,
  FileText,
  DollarSign,
  UserCheck,
  UserPlus,
  ListFilter,
  Search,
  CheckCircle,
  XCircle,
  HelpCircle,
  ArrowRight,
  ShieldAlert,
  SlidersHorizontal,
  Mail,
  MapPin,
  MessageSquare,
  ShieldCheck,
  Activity,
  Layers,
  BarChart3,
  Award,
  Zap,
  Filter,
  Download,
  Eye,
  RefreshCw,
  PhoneCall,
  Headphones
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface HRDashboardProps {
  userEmail?: string;
  onSwitchModule?: (module: string) => void;
}

interface ActivityItem {
  id: string;
  time: string;
  type: "leave" | "attendance" | "hiring" | "system" | "department" | "employee";
  user: string;
  action: string;
  details: string;
}

interface NotificationItem {
  id: string;
  type: "warning" | "info" | "action";
  title: string;
  message: string;
  time: string;
  actionLabel?: string;
  onAction?: () => void;
}

interface EmployeeItem {
  id: string;
  name: string;
  department: string;
  role: string;
  status: "Present" | "On Leave" | "Off Duty" | "Late";
  email: string;
  shift: string;
}

interface DepartmentItem {
  id: string;
  name: string;
  head: string;
  headcount: number;
  budget: string;
  location: string;
  cluster: string;
}

export default function HRDashboard({ userEmail = "alena.batacan@thesiblingssolutions.com", onSwitchModule }: HRDashboardProps) {
  // --- REALTIME TIME STATE ---
  const [time, setTime] = useState<Date>(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // --- STATS & COUNTERS ---
  const [employeeCount, setEmployeeCount] = useState(4620);
  const [departmentCount, setDepartmentCount] = useState(12);
  const [attendanceCount, setAttendanceCount] = useState(4242);
  const [interviewsCount, setInterviewsCount] = useState(34);
  const [payrollCount, setPayrollCount] = useState(4620);
  
  const [activeModal, setActiveModal] = useState<
    | null
    | "employees"
    | "departments"
    | "attendance"
    | "interviews"
    | "payroll"
    | "add-employee"
    | "create-department"
    | "view-reports"
  >(null);

  const [toast, setToast] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Dynamic Lists with initial simulated values
  const [activities, setActivities] = useState<ActivityItem[]>([
    {
      id: "ACT-001",
      time: "10 mins ago",
      type: "leave",
      user: "CRISTER ALBERCA CANITAN",
      action: "filed a Vacation Leave request",
      details: "Request for Jul 22 - Jul 24 (3 days). Paid leave."
    },
    {
      id: "ACT-002",
      time: "45 mins ago",
      type: "employee",
      user: "ALENA MENDOZA BATACAN",
      action: "onboarded 5 new customer specialists",
      details: "Assigned to US Telecom & Tier-2 Support accounts."
    },
    {
      id: "ACT-003",
      time: "2 hours ago",
      type: "attendance",
      user: "ROLAND JAMES LABUS",
      action: "completed biometric sync",
      details: "WFM database synced. 99.1% shift schedule adherence achieved."
    },
    {
      id: "ACT-004",
      time: "4 hours ago",
      type: "hiring",
      user: "Talent Acquisition AI",
      action: "matched 18 candidates",
      details: "Recommended qualified voice & non-voice reps for interview queue."
    },
    {
      id: "ACT-005",
      time: "1 day ago",
      type: "department",
      user: "System Admin",
      action: "created department",
      details: "Strategic Client Operations department initialized successfully."
    }
  ]);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "NOT-001",
      type: "action",
      title: "Pending Leave Approvals",
      message: "4 new leave submissions require HR manager approval for WFM roster alignment.",
      time: "Just now",
      actionLabel: "Approve Leaves"
    },
    {
      id: "NOT-002",
      type: "warning",
      title: "Biometric Shift Sync Check",
      message: "Clock-in delta anomaly resolved for graveyard shift in Mandaluyong Bay A.",
      time: "2 hours ago",
      actionLabel: "Verify Log"
    },
    {
      id: "NOT-003",
      type: "info",
      title: "Quarterly Headcount Target",
      message: "95% of target staffing for the US Telecom & Tech cluster successfully met.",
      time: "4 hours ago",
      actionLabel: "View Analytics"
    }
  ]);

  const [employees, setEmployees] = useState<EmployeeItem[]>([
    { id: "EMP-6496", name: "CANITAN, CRISTER ALBERCA", department: "Telecom & Tech Support", role: "Support Team Lead", status: "Present", email: "crister.canitan@thesiblings.com", shift: "08:00 AM - 05:00 PM" },
    { id: "EMP-6099", name: "LABUS, ROLAND JAMES DIAGBEL", department: "Workforce Management", role: "WFM Director", status: "Present", email: "roland.labus@thesiblings.com", shift: "09:00 AM - 06:00 PM" },
    { id: "EMP-1024", name: "BATACAN, ALENA MENDOZA", department: "Core HR & Admin", role: "Operations Director", status: "Present", email: "alena.batacan@thesiblingssolutions.com", shift: "08:00 AM - 05:00 PM" },
    { id: "EMP-4112", name: "DELOS REYES, SHIELA MAE", department: "Talent Acquisition", role: "Senior Recruiter", status: "On Leave", email: "shiela.delosreyes@thesiblings.com", shift: "09:00 AM - 06:00 PM" },
    { id: "EMP-2354", name: "SARMIENTO, MARK GREGORY", department: "Financial Services", role: "Customer Solutions Rep", status: "Off Duty", email: "mark.sarmiento@thesiblings.com", shift: "10:00 PM - 07:00 AM" },
    { id: "EMP-3889", name: "VALENCIA, JESSICA MAE", department: "Healthcare & Insurance", role: "Insurance Claims Analyst", status: "Present", email: "jessica.valencia@thesiblings.com", shift: "08:00 AM - 05:00 PM" },
    { id: "EMP-1502", name: "TORRES, RENZ CHRISTOPHER", department: "Retail & E-Commerce", role: "Support Specialist", status: "Late", email: "renz.torres@thesiblings.com", shift: "09:00 AM - 06:00 PM" },
    { id: "EMP-5001", name: "RAMIREZ, PATRICIA ANN", department: "Workforce & Compliance", role: "Compliance Officer", status: "Present", email: "patricia.ramirez@thesiblings.com", shift: "08:00 AM - 05:00 PM" }
  ]);

  const [departments, setDepartments] = useState<DepartmentItem[]>([
    { id: "DEP-001", name: "Telecom & Tech Support", head: "Crister Alberca Canitan", headcount: 1450, budget: "$2.4M", location: "Building 3, Floor 4", cluster: "Voice & Technical" },
    { id: "DEP-002", name: "Financial Services Group", head: "Mark Gregory Sarmiento", headcount: 1120, budget: "$1.8M", location: "Building 2, Floor 2", cluster: "Back Office & Chat" },
    { id: "DEP-003", name: "Healthcare & Insurance", head: "Jessica Mae Valencia", headcount: 950, budget: "$1.5M", location: "Building 1, Floor 3", cluster: "Omnichannel Support" },
    { id: "DEP-004", name: "Retail & E-Commerce", head: "Renz Christopher Torres", headcount: 780, budget: "$1.1M", location: "Building 3, Floor 2", cluster: "Customer Care" },
    { id: "DEP-005", name: "Talent Acquisition", head: "Shiela Mae Delos Reyes", headcount: 45, budget: "$450K", location: "Building 1, Floor 1", cluster: "Corporate Services" },
    { id: "DEP-006", name: "Workforce & Compliance", head: "Patricia Ann Ramirez", headcount: 35, budget: "$320K", location: "Building 2, Floor 5", cluster: "Operations Command" },
    { id: "DEP-007", name: "Core Administration", head: "Alena Mendoza Batacan", headcount: 24, budget: "$500K", location: "Building 1, Floor 5", cluster: "Executive Leadership" }
  ]);

  const [interviews, setInterviews] = useState([
    { id: "INT-101", candidate: "Michael Jordan", time: "09:30 AM", position: "Telecom Support Engineer", interviewer: "Shiela Delos Reyes", status: "Scheduled" },
    { id: "INT-102", candidate: "Serena Williams", time: "11:00 AM", position: "WFM Realtime Analyst", interviewer: "Roland James Labus", status: "In Progress" },
    { id: "INT-103", candidate: "Lionel Messi", time: "01:30 PM", position: "Finance Solutions Specialist", interviewer: "Alena Batacan", status: "Scheduled" },
    { id: "INT-104", candidate: "LeBron James", time: "03:00 PM", position: "Retail Account Supervisor", interviewer: "Renz Christopher Torres", status: "Completed" },
    { id: "INT-105", candidate: "Taylor Swift", time: "04:30 PM", position: "Talent Engagement Lead", interviewer: "Shiela Delos Reyes", status: "Scheduled" }
  ]);

  // Form states
  const [newEmp, setNewEmp] = useState({
    name: "",
    department: "Telecom & Tech Support",
    role: "",
    email: "",
    shift: "08:00 AM - 05:00 PM",
    status: "Present" as const
  });

  const [newDept, setNewDept] = useState({
    name: "",
    head: "",
    budget: "",
    location: "",
    headcount: 0
  });

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // --- ACTIONS ---
  const handleAddEmployeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmp.name || !newEmp.role || !newEmp.email) {
      setToast("Please fill in all required fields.");
      return;
    }

    const empId = `EMP-${Math.floor(1000 + Math.random() * 9000)}`;
    const createdEmployee: EmployeeItem = {
      id: empId,
      name: newEmp.name.toUpperCase(),
      department: newEmp.department,
      role: newEmp.role,
      status: newEmp.status,
      email: newEmp.email.toLowerCase(),
      shift: newEmp.shift
    };

    setEmployees(prev => [createdEmployee, ...prev]);
    setEmployeeCount(prev => prev + 1);
    if (newEmp.status === "Present") setAttendanceCount(prev => prev + 1);

    // Log Activity
    const activityId = `ACT-${Math.floor(100 + Math.random() * 900)}`;
    setActivities(prev => [
      {
        id: activityId,
        time: "Just now",
        type: "employee",
        user: "ALENA MENDOZA BATACAN",
        action: `added employee ${createdEmployee.name}`,
        details: `Assigned as ${createdEmployee.role} in ${createdEmployee.department}.`
      },
      ...prev
    ]);

    setToast(`Employee ${createdEmployee.name} registered successfully!`);
    setActiveModal(null);
    setNewEmp({
      name: "",
      department: "Telecom & Tech Support",
      role: "",
      email: "",
      shift: "08:00 AM - 05:00 PM",
      status: "Present"
    });
  };

  const handleCreateDepartmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDept.name || !newDept.head || !newDept.budget || !newDept.location) {
      setToast("Please fill in all required fields.");
      return;
    }

    const deptId = `DEP-${Math.floor(100 + Math.random() * 900)}`;
    const createdDept: DepartmentItem = {
      id: deptId,
      name: newDept.name,
      head: newDept.head,
      budget: newDept.budget.startsWith("$") ? newDept.budget : `$${newDept.budget}`,
      location: newDept.location,
      headcount: newDept.headcount || 0,
      cluster: "Operations Support"
    };

    setDepartments(prev => [...prev, createdDept]);
    setDepartmentCount(prev => prev + 1);

    // Log Activity
    const activityId = `ACT-${Math.floor(100 + Math.random() * 900)}`;
    setActivities(prev => [
      {
        id: activityId,
        time: "Just now",
        type: "department",
        user: "ALENA MENDOZA BATACAN",
        action: `created department ${createdDept.name}`,
        details: `Led by ${createdDept.head}, budget: ${createdDept.budget}.`
      },
      ...prev
    ]);

    setToast(`Department "${createdDept.name}" created successfully!`);
    setActiveModal(null);
    setNewDept({
      name: "",
      head: "",
      budget: "",
      location: "",
      headcount: 0
    });
  };

  const handleNotificationAction = (notification: NotificationItem) => {
    if (notification.id === "NOT-001") {
      if (onSwitchModule) {
        onSwitchModule("Leaves & Time Off");
      } else {
        setToast("Navigating to Leaves & Time Off management...");
      }
    } else if (notification.id === "NOT-002") {
      setToast("Performing hot re-sync of biometric attendance databases...");
      setAttendanceCount(4245);
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
      const activityId = `ACT-${Math.floor(100 + Math.random() * 900)}`;
      setActivities(prev => [
        {
          id: activityId,
          time: "Just now",
          type: "system",
          user: "Biometric DB Sync",
          action: "Hot Sync Completed",
          details: "Recalculated clock logs for 1,250 personnel. Delta resolved."
        },
        ...prev
      ]);
    } else {
      setActiveModal("view-reports");
    }
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    setToast("Notification dismissed.");
  };

  const handleQuickAction = (action: string) => {
    if (action === "add-employee") {
      setActiveModal("add-employee");
    } else if (action === "create-department") {
      setActiveModal("create-department");
    } else if (action === "attendance") {
      if (onSwitchModule) {
        onSwitchModule("Time & Attendance");
      } else {
        setActiveModal("attendance");
      }
    } else if (action === "view-reports") {
      setActiveModal("view-reports");
    }
  };

  // Filters
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const matchesSearch = 
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "All" || emp.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [employees, searchTerm, statusFilter]);

  const filteredDepartments = useMemo(() => {
    return departments.filter(dept => 
      dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.head.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.cluster.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [departments, searchTerm]);

  return (
    <div className="flex-1 flex flex-col space-y-6 select-none relative font-sans" id="hr-admin-dashboard-root">
      
      {/* Toast Alert */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 right-6 bg-[#042C51] border-l-4 border-[#FF5C28] text-white px-5 py-3 rounded-r-xl shadow-2xl z-50 flex items-center gap-3 text-xs"
          >
            <Sparkles className="w-4 h-4 text-[#FF5C28] animate-spin" />
            <span className="font-bold">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================== 1. SIBS BRAND COMMAND HEADER ==================== */}
      <section className="bg-[#042C51] text-white p-6 sm:p-7 rounded-2xl border border-white/10 shadow-lg relative overflow-hidden flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        
        {/* Subtle Decorative Geometric Background Elements */}
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full border border-white/5 pointer-events-none" />
        <div className="absolute right-20 -bottom-24 w-80 h-80 rounded-full border border-[#FF5C28]/10 pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full bg-[#FF5C28]/5 blur-2xl pointer-events-none" />

        {/* Executive Info & Tagline */}
        <div className="space-y-3 z-10 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] bg-[#FF5C28] text-white px-2.5 py-0.5 rounded font-black tracking-wider uppercase inline-flex items-center gap-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              SiBS Enterprise HRIS
            </span>
            <span className="text-[10px] bg-white/10 text-white/90 border border-white/15 px-2.5 py-0.5 rounded font-bold uppercase tracking-wider">
              Executive HR Command
            </span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded font-bold uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              WFM Biometric Active
            </span>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              HR Administration & Workforce Operations
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
              Logged in as <span className="text-white font-bold underline decoration-[#FF5C28] decoration-2">BATACAN, ALENA MENDOZA</span> — Operations & HR Director
            </p>
          </div>

          <p className="text-xs text-slate-400 font-normal">
            Where global contact center expertise aligns with family-driven values — Managing <span className="text-[#FF5C28] font-bold">{employeeCount.toLocaleString()}</span> active personnel across 4 BPO clusters.
          </p>
        </div>

        {/* Realtime PST Clock & Quick Launchers */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-3 z-10 w-full lg:w-auto shrink-0">
          
          {/* PST Clock Card */}
          <div className="bg-black/25 backdrop-blur-md border border-white/10 px-4 py-2.5 rounded-xl flex items-center gap-3 w-full sm:w-auto justify-between">
            <div className="text-left">
              <span className="text-[9px] uppercase tracking-wider font-extrabold text-[#FF5C28] block">Philippine Standard Time</span>
              <div className="text-base sm:text-lg font-mono font-black text-white tracking-tight">
                {time.toLocaleTimeString("en-US", { timeZone: "Asia/Manila", hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>
            </div>
            <div className="text-right border-l border-white/10 pl-3">
              <span className="text-[9px] text-slate-400 block font-semibold">Today</span>
              <span className="text-[11px] font-bold text-slate-200">
                {time.toLocaleDateString("en-US", { timeZone: "Asia/Manila", month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          </div>

          {/* Quick Header CTA Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => handleQuickAction("add-employee")}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 bg-[#FF5C28] hover:bg-[#ff470d] text-white text-xs font-black rounded-xl shadow-md transition-all cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add Employee</span>
            </button>
            <button
              onClick={() => onSwitchModule?.("Employee Directory")}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/15 transition-all cursor-pointer"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Directory</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#FF5C28]" />
            </button>
          </div>

        </div>

      </section>

      {/* ==================== 2. CORE HR METRICS KPI CARDS ==================== */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        
        {/* Total Employees */}
        <div
          onClick={() => { setActiveModal("employees"); setSearchTerm(""); setStatusFilter("All"); }}
          className="bg-white p-4 rounded-2xl border border-[#E6ECF2] shadow-sm hover:border-[#FF5C28] hover:shadow-md cursor-pointer transition-all duration-200 relative overflow-hidden flex flex-col justify-between group select-none min-h-[125px]"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-[#042C51] tracking-wider">Total Headcount</span>
            <div className="w-8 h-8 rounded-xl bg-[#FFF0EB] flex items-center justify-center text-[#FF5C28] group-hover:bg-[#FF5C28] group-hover:text-white transition-colors">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-[#042C51] tracking-tight">{employeeCount.toLocaleString()}</div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 flex items-center gap-0.5">
                <TrendingUp className="w-2.5 h-2.5" /> +4.2% MoM
              </span>
              <span className="text-[9px] text-[#667085] font-semibold">Active Roster</span>
            </div>
          </div>
          <div className="absolute bottom-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-all transform translate-x-1 group-hover:translate-x-0">
            <ChevronRight className="w-4 h-4 text-[#FF5C28]" />
          </div>
        </div>

        {/* Departments */}
        <div
          onClick={() => { setActiveModal("departments"); setSearchTerm(""); }}
          className="bg-white p-4 rounded-2xl border border-[#E6ECF2] shadow-sm hover:border-[#FF5C28] hover:shadow-md cursor-pointer transition-all duration-200 relative overflow-hidden flex flex-col justify-between group select-none min-h-[125px]"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-[#042C51] tracking-wider">Departments</span>
            <div className="w-8 h-8 rounded-xl bg-[#E9F0FC] flex items-center justify-center text-[#042C51] group-hover:bg-[#042C51] group-hover:text-white transition-colors">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-[#042C51] tracking-tight">{departmentCount}</div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-[9px] font-bold text-[#042C51] bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                4 BPO Clusters
              </span>
              <span className="text-[9px] text-[#667085] font-semibold">Allocated</span>
            </div>
          </div>
          <div className="absolute bottom-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-all transform translate-x-1 group-hover:translate-x-0">
            <ChevronRight className="w-4 h-4 text-[#FF5C28]" />
          </div>
        </div>

        {/* Attendance */}
        <div
          onClick={() => { setActiveModal("attendance"); setSearchTerm(""); }}
          className="bg-white p-4 rounded-2xl border border-[#E6ECF2] shadow-sm hover:border-[#FF5C28] hover:shadow-md cursor-pointer transition-all duration-200 relative overflow-hidden flex flex-col justify-between group select-none min-h-[125px]"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider">Attendance Today</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-[#042C51] tracking-tight">{attendanceCount.toLocaleString()}</span>
              <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">91.8%</span>
            </div>
            <div className="text-[9px] text-emerald-700/80 font-bold mt-1 uppercase tracking-wide flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Biometric Live Sync
            </div>
          </div>
          <div className="absolute bottom-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-all transform translate-x-1 group-hover:translate-x-0">
            <ChevronRight className="w-4 h-4 text-[#FF5C28]" />
          </div>
        </div>

        {/* Scheduled Interviews */}
        <div
          onClick={() => setActiveModal("interviews")}
          className="bg-white p-4 rounded-2xl border border-[#E6ECF2] shadow-sm hover:border-[#FF5C28] hover:shadow-md cursor-pointer transition-all duration-200 relative overflow-hidden flex flex-col justify-between group select-none min-h-[125px]"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-[#042C51] tracking-wider">Interviews Queue</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-[#042C51] tracking-tight">{interviewsCount}</div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-[9px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200">
                5 Completed Today
              </span>
            </div>
          </div>
          <div className="absolute bottom-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-all transform translate-x-1 group-hover:translate-x-0">
            <ChevronRight className="w-4 h-4 text-[#FF5C28]" />
          </div>
        </div>

        {/* Payroll Records */}
        <div
          onClick={() => setActiveModal("payroll")}
          className="bg-white p-4 rounded-2xl border border-[#E6ECF2] shadow-sm hover:border-[#FF5C28] hover:shadow-md cursor-pointer transition-all duration-200 relative overflow-hidden flex flex-col justify-between group col-span-2 lg:col-span-1 select-none min-h-[125px]"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-[#042C51] tracking-wider">Payroll Disbursed</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-[#042C51] tracking-tight">{payrollCount.toLocaleString()}</div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                Validated 100%
              </span>
            </div>
          </div>
          <div className="absolute bottom-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-all transform translate-x-1 group-hover:translate-x-0">
            <ChevronRight className="w-4 h-4 text-[#FF5C28]" />
          </div>
        </div>

      </div>

      {/* ==================== 3. MAIN DASHBOARD PANELS (2-COLUMN GRID) ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: ACTIVITY, ALERTS & MANPOWER BREAKDOWN (8 COLS) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Recent Activity Audit Ledger */}
          <div className="bg-white rounded-2xl border border-[#E6ECF2] shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black text-[#042C51]">Recent Activity Audit Trail</h3>
                  <span className="px-2 py-0.5 bg-[#FFF0EB] text-[#FF5C28] text-[9px] font-black uppercase rounded-full">
                    Realtime Feed
                  </span>
                </div>
                <p className="text-[11px] text-[#667085]">Latest HR logs, shift adjustments, and personnel operations</p>
              </div>
              <button
                onClick={() => {
                  setToast("Refreshed all activity logs successfully.");
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#042C51] bg-[#F1F5F9] hover:bg-[#FFE0D5] hover:text-[#FF5C28] rounded-xl transition-colors border border-slate-200 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Sync Activity</span>
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {activities.map((act) => (
                <div key={act.id} className="py-3.5 flex items-start gap-3.5 group hover:bg-[#F8FAFC] px-2.5 rounded-xl transition-colors">
                  <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
                    act.type === "leave" ? "bg-amber-400" :
                    act.type === "employee" ? "bg-[#FF5C28]" :
                    act.type === "attendance" ? "bg-emerald-500" :
                    act.type === "hiring" ? "bg-indigo-500" : "bg-[#042C51]"
                  }`} />
                  <div className="flex-1 space-y-0.5">
                    <p className="text-xs text-[#042C51] leading-relaxed">
                      <span className="font-extrabold">{act.user}</span> <span className="text-[#344054] font-medium">{act.action}</span>
                    </p>
                    <p className="text-[11px] text-slate-500">{act.details}</p>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 shrink-0 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                    {act.time}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
              <span className="text-slate-400 text-[11px]">Showing latest 5 verified events</span>
              <button
                onClick={() => {
                  setToast("Loaded complete enterprise activity trail.");
                }}
                className="font-extrabold text-[#FF5C28] hover:text-[#042C51] flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>View all activity</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Pending HR Notifications & Approvals */}
          <div className="bg-white rounded-2xl border border-[#E6ECF2] shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-[#042C51]">Administrative Alerts & Compliance</h3>
                <p className="text-[11px] text-[#667085]">Important updates requiring approval or operational attention</p>
              </div>
              <span className="text-xs font-bold text-[#042C51] bg-[#F1F5F9] px-2.5 py-1 rounded-lg">
                {notifications.length} Pending
              </span>
            </div>

            <div className="space-y-3">
              {notifications.length === 0 ? (
                <div className="p-6 text-center bg-[#F8FAFC] rounded-xl border border-dashed border-slate-200">
                  <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  <p className="text-xs font-bold text-[#042C51]">All caught up!</p>
                  <p className="text-[10px] text-[#667085] mt-0.5">No new administrative notifications pending.</p>
                </div>
              ) : (
                notifications.map((not) => (
                  <div 
                    key={not.id} 
                    className={`p-4 rounded-xl border flex items-start gap-3.5 justify-between transition-all ${
                      not.type === "warning" ? "bg-amber-50/60 border-amber-200" :
                      not.type === "action" ? "bg-[#FFF0EB]/80 border-[#FFE0D5]" :
                      "bg-[#E9F0FC]/60 border-blue-200"
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className="mt-0.5">
                        {not.type === "warning" ? (
                          <AlertCircle className="w-4.5 h-4.5 text-amber-600 shrink-0" />
                        ) : not.type === "action" ? (
                          <ShieldAlert className="w-4.5 h-4.5 text-[#FF5C28] shrink-0" />
                        ) : (
                          <Info className="w-4.5 h-4.5 text-[#042C51] shrink-0" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-extrabold text-[#042C51]">{not.title}</h4>
                          <span className="text-[9px] font-bold text-slate-400">{not.time}</span>
                        </div>
                        <p className="text-xs text-[#344054] leading-relaxed max-w-xl">{not.message}</p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 justify-between shrink-0 self-stretch">
                      <button 
                        onClick={() => dismissNotification(not.id)}
                        className="text-slate-400 hover:text-[#FF5C28] p-1 rounded-md transition-colors cursor-pointer"
                        title="Dismiss"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      
                      {not.actionLabel && (
                        <button
                          onClick={() => handleNotificationAction(not)}
                          className={`px-3 py-1.5 text-[10px] font-black rounded-lg uppercase tracking-wider transition-all cursor-pointer shadow-sm ${
                            not.type === "warning" ? "bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300" :
                            not.type === "action" ? "bg-[#FF5C28] text-white hover:bg-[#ff470d]" :
                            "bg-[#042C51] hover:bg-[#031d36] text-white"
                          }`}
                        >
                          {not.actionLabel}
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Cluster Manpower Distribution */}
          <div className="bg-white rounded-2xl border border-[#E6ECF2] shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-[#042C51]">BPO Cluster Manpower Capacity</h3>
                <p className="text-[11px] text-[#667085]">Active staffing allocation across core service verticals</p>
              </div>
              <button
                onClick={() => setActiveModal("view-reports")}
                className="text-xs font-bold text-[#FF5C28] hover:text-[#042C51] flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>Analytics Report</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3.5 pt-1">
              
              {/* Telecom & Tech */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-[#042C51] flex items-center gap-2">
                    <Headphones className="w-3.5 h-3.5 text-[#042C51]" />
                    Telecom & Tech Support (Voice / Non-Voice)
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[#042C51]">1,450 Agents</span>
                    <span className="text-[10px] text-slate-400 font-semibold">(31.3%)</span>
                  </div>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#042C51] rounded-full" style={{ width: "31.3%" }} />
                </div>
              </div>

              {/* Financial Services */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-[#042C51] flex items-center gap-2">
                    <DollarSign className="w-3.5 h-3.5 text-indigo-600" />
                    Financial Services & Back-Office
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[#042C51]">1,120 Agents</span>
                    <span className="text-[10px] text-slate-400 font-semibold">(24.2%)</span>
                  </div>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 rounded-full" style={{ width: "24.2%" }} />
                </div>
              </div>

              {/* Healthcare & Insurance */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-[#042C51] flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-[#FF5C28]" />
                    Healthcare & Insurance Claims
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[#042C51]">950 Agents</span>
                    <span className="text-[10px] text-slate-400 font-semibold">(20.5%)</span>
                  </div>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#FF5C28] rounded-full" style={{ width: "20.5%" }} />
                </div>
              </div>

              {/* Retail & E-Commerce */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-[#042C51] flex items-center gap-2">
                    <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                    Retail & Omnichannel E-Commerce
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[#042C51]">780 Agents</span>
                    <span className="text-[10px] text-slate-400 font-semibold">(16.8%)</span>
                  </div>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: "16.8%" }} />
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: QUICK ACTIONS & BPO PERFORMANCE SCORECARD (4 COLS) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Quick Actions Panel */}
          <div className="bg-white rounded-2xl border border-[#E6ECF2] shadow-sm p-5 space-y-4">
            <div>
              <h3 className="text-sm font-black text-[#042C51]">HR Operations Command</h3>
              <p className="text-[11px] text-[#667085]">Instant shortcuts for everyday management</p>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              
              {/* Add Employee */}
              <button
                onClick={() => handleQuickAction("add-employee")}
                className="w-full p-3 bg-[#F8FAFC] hover:bg-[#FFF0EB] hover:border-[#FF5C28]/40 border border-[#E6ECF2] rounded-xl flex items-center gap-3.5 text-left transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-orange-50 group-hover:bg-[#FF5C28] text-[#FF5C28] group-hover:text-white flex items-center justify-center transition-colors shrink-0 shadow-xs">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold text-[#042C51] block group-hover:text-[#FF5C28] transition-colors">Add Employee Record</span>
                  <span className="text-[10px] text-[#667085] truncate block">Register employee & assign cluster</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#FF5C28] group-hover:translate-x-0.5 transition-all" />
              </button>

              {/* Create Department */}
              <button
                onClick={() => handleQuickAction("create-department")}
                className="w-full p-3 bg-[#F8FAFC] hover:bg-[#FFF0EB] hover:border-[#FF5C28]/40 border border-[#E6ECF2] rounded-xl flex items-center gap-3.5 text-left transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-orange-50 group-hover:bg-[#FF5C28] text-[#FF5C28] group-hover:text-white flex items-center justify-center transition-colors shrink-0 shadow-xs">
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold text-[#042C51] block group-hover:text-[#FF5C28] transition-colors">Create Department</span>
                  <span className="text-[10px] text-[#667085] truncate block">Configure budget & location</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#FF5C28] group-hover:translate-x-0.5 transition-all" />
              </button>

              {/* Attendance Tracker */}
              <button
                onClick={() => handleQuickAction("attendance")}
                className="w-full p-3 bg-[#F8FAFC] hover:bg-[#FFF0EB] hover:border-[#FF5C28]/40 border border-[#E6ECF2] rounded-xl flex items-center gap-3.5 text-left transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-orange-50 group-hover:bg-[#FF5C28] text-[#FF5C28] group-hover:text-white flex items-center justify-center transition-colors shrink-0 shadow-xs">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold text-[#042C51] block group-hover:text-[#FF5C28] transition-colors">Attendance Live Logs</span>
                  <span className="text-[10px] text-[#667085] truncate block">Realtime biometric shift sync</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#FF5C28] group-hover:translate-x-0.5 transition-all" />
              </button>

              {/* View Reports */}
              <button
                onClick={() => handleQuickAction("view-reports")}
                className="w-full p-3 bg-[#F8FAFC] hover:bg-[#FFF0EB] hover:border-[#FF5C28]/40 border border-[#E6ECF2] rounded-xl flex items-center gap-3.5 text-left transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-orange-50 group-hover:bg-[#FF5C28] text-[#FF5C28] group-hover:text-white flex items-center justify-center transition-colors shrink-0 shadow-xs">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold text-[#042C51] block group-hover:text-[#FF5C28] transition-colors">HR Intelligence & Reports</span>
                  <span className="text-[10px] text-[#667085] truncate block">Attrition, yield & SLA analytics</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#FF5C28] group-hover:translate-x-0.5 transition-all" />
              </button>

            </div>
          </div>

          {/* Real-time Workforce SLA & Quality Card */}
          <div className="bg-[#042C51] text-white p-5 rounded-2xl border border-white/10 shadow-md space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black uppercase tracking-wider bg-[#FF5C28] text-white px-2 py-0.5 rounded">
                Operational SLA
              </span>
              <Sparkles className="w-4 h-4 text-[#FF5C28]" />
            </div>
            
            <div className="space-y-1">
              <span className="text-xs font-medium text-slate-300 block">Workforce Utilization Rate</span>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-black text-[#FF5C28] tracking-tight">95.4%</span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                  Target: 92.0%
                </span>
              </div>
            </div>

            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-[#FF5C28] rounded-full" style={{ width: "95.4%" }} />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/10 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Schedule Adherence</span>
                <span className="font-extrabold text-white text-sm">99.1%</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Absenteeism Delta</span>
                <span className="font-extrabold text-emerald-400 text-sm">-4.7%</span>
              </div>
            </div>

            <p className="text-[10px] text-slate-300/80 leading-relaxed pt-1">
              All 4 clusters are operating within peak capacity standards. Graveyard coverage is secured at 100%.
            </p>
          </div>

          {/* Today's Scheduled Interviews Widget */}
          <div className="bg-white rounded-2xl border border-[#E6ECF2] shadow-sm p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-[#042C51] uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#FF5C28]" />
                <span>Interviews Today</span>
              </h3>
              <button
                onClick={() => setActiveModal("interviews")}
                className="text-[10px] font-bold text-[#FF5C28] hover:text-[#042C51]"
              >
                View All
              </button>
            </div>

            <div className="space-y-2">
              {interviews.slice(0, 3).map((item) => (
                <div key={item.id} className="p-2.5 rounded-xl bg-[#F8FAFC] border border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-[#042C51] block">{item.candidate}</span>
                    <span className="text-[10px] text-slate-500">{item.position}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-[10px] font-bold text-[#042C51] block">{item.time}</span>
                    <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                      item.status === "Completed" ? "bg-emerald-50 text-emerald-700" :
                      item.status === "In Progress" ? "bg-amber-50 text-amber-700" : "bg-blue-50 text-blue-700"
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* ==================== 4. MODALS (SIBS BRAND STYLED) ==================== */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 bg-[#042C51]/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl border border-[#E6ECF2] w-full max-w-4xl overflow-hidden max-h-[88vh] flex flex-col font-sans"
            >
              
              {/* Modal Header */}
              <div className="p-5 bg-[#042C51] text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="p-2 bg-[#FF5C28] rounded-xl text-white shadow-sm">
                    {activeModal === "employees" || activeModal === "add-employee" ? <Users className="w-5 h-5" /> :
                     activeModal === "departments" || activeModal === "create-department" ? <Building2 className="w-5 h-5" /> :
                     activeModal === "attendance" ? <Clock className="w-5 h-5" /> :
                     activeModal === "interviews" ? <Calendar className="w-5 h-5" /> :
                     activeModal === "payroll" ? <CreditCard className="w-5 h-5" /> :
                     <FileText className="w-5 h-5" />}
                  </span>
                  <div>
                    <h2 className="text-base font-extrabold text-white">
                      {activeModal === "employees" ? "Employee Roster Ledger" :
                       activeModal === "departments" ? "Active Departments & Clusters" :
                       activeModal === "attendance" ? "Attendance & Biometrics Tracker" :
                       activeModal === "interviews" ? "Interviews Schedule Planner" :
                       activeModal === "payroll" ? "Payroll Administration Console" :
                       activeModal === "add-employee" ? "Add Employee Record" :
                       activeModal === "create-department" ? "Create New Department Structure" :
                       "HR Intelligence & KPI Report"}
                    </h2>
                    <p className="text-xs text-slate-300">
                      {activeModal === "employees" ? "Search and manage all authenticated workforce profiles" :
                       activeModal === "departments" ? "Review departments, cluster units, and annual budget limits" :
                       activeModal === "attendance" ? "Realtime analysis of biometric clock-ins and shift adherence" :
                       activeModal === "interviews" ? "Pending and completed candidate recruitment pipeline" :
                       activeModal === "payroll" ? "Monthly payroll disbursements, validation & export" :
                       activeModal === "add-employee" ? "Register a new profile in the SiBS HR database" :
                       activeModal === "create-department" ? "Deploy a new departmental unit in the corporate hierarchy" :
                       "Workforce capacity, retention & conversion analytics"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => { setActiveModal(null); setSearchTerm(""); }}
                  className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto flex-1 text-[#101828]">
                
                {/* ---------------- 1. EMPLOYEES ROSTER LIST ---------------- */}
                {activeModal === "employees" && (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="relative flex-1">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                          type="text"
                          placeholder="Search employees by name, role, department or ID..."
                          value={searchTerm}
                          onChange={e => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] border border-[#E6ECF2] rounded-xl text-xs font-semibold focus:outline-none focus:bg-white focus:border-[#FF5C28]"
                        />
                      </div>
                      <select
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                        className="bg-[#F8FAFC] px-4 py-2.5 border border-[#E6ECF2] rounded-xl text-xs font-bold text-[#042C51] focus:outline-none focus:border-[#FF5C28]"
                      >
                        <option value="All">All Statuses</option>
                        <option value="Present">Present</option>
                        <option value="On Leave">On Leave</option>
                        <option value="Off Duty">Off Duty</option>
                        <option value="Late">Late</option>
                      </select>
                      <button
                        onClick={() => setActiveModal("add-employee")}
                        className="px-4 py-2.5 bg-[#FF5C28] hover:bg-[#ff470d] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
                      >
                        <UserPlus className="w-4 h-4" />
                        <span>Add New</span>
                      </button>
                    </div>

                    <div className="border border-[#E6ECF2] rounded-xl overflow-hidden shadow-xs">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-[#F8FAFC] border-b border-[#E6ECF2] text-[#042C51] font-extrabold uppercase text-[10px] tracking-wider">
                            <th className="p-3.5">ID</th>
                            <th className="p-3.5">Employee Name</th>
                            <th className="p-3.5">Department</th>
                            <th className="p-3.5">Designation</th>
                            <th className="p-3.5">Shift</th>
                            <th className="p-3.5">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredEmployees.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="p-8 text-center text-slate-400 font-bold">
                                No employees match this search criteria.
                              </td>
                            </tr>
                          ) : (
                            filteredEmployees.map(emp => (
                              <tr key={emp.id} className="hover:bg-[#F8FAFC]/80 transition-colors">
                                <td className="p-3.5 font-mono font-bold text-slate-500">{emp.id}</td>
                                <td className="p-3.5 font-bold text-[#042C51]">
                                  {emp.name}
                                  <span className="block text-[10px] text-slate-400 font-normal">{emp.email}</span>
                                </td>
                                <td className="p-3.5 font-semibold text-slate-700">{emp.department}</td>
                                <td className="p-3.5 text-slate-600 font-medium">{emp.role}</td>
                                <td className="p-3.5 text-slate-500 font-medium">{emp.shift}</td>
                                <td className="p-3.5">
                                  <span className={`px-2.5 py-1 rounded text-[10px] font-black uppercase ${
                                    emp.status === "Present" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                                    emp.status === "On Leave" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                                    emp.status === "Late" ? "bg-rose-50 text-rose-700 border border-rose-200" :
                                    "bg-slate-100 text-slate-600 border border-slate-200"
                                  }`}>
                                    {emp.status}
                                  </span>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* ---------------- 2. DEPARTMENTS LIST ---------------- */}
                {activeModal === "departments" && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center gap-3">
                      <div className="relative flex-1">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                          type="text"
                          placeholder="Search departments, cluster or lead managers..."
                          value={searchTerm}
                          onChange={e => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] border border-[#E6ECF2] rounded-xl text-xs font-semibold focus:outline-none focus:bg-white focus:border-[#FF5C28]"
                        />
                      </div>
                      <button
                        onClick={() => setActiveModal("create-department")}
                        className="px-4 py-2.5 bg-[#FF5C28] hover:bg-[#ff470d] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                      >
                        <Plus className="w-4 h-4" />
                        <span>New Department</span>
                      </button>
                    </div>

                    <div className="border border-[#E6ECF2] rounded-xl overflow-hidden shadow-xs">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-[#F8FAFC] border-b border-[#E6ECF2] text-[#042C51] font-extrabold uppercase text-[10px] tracking-wider">
                            <th className="p-3.5">ID</th>
                            <th className="p-3.5">Department Unit</th>
                            <th className="p-3.5">Cluster</th>
                            <th className="p-3.5">Lead Director</th>
                            <th className="p-3.5">Total Staff</th>
                            <th className="p-3.5">Annual Budget</th>
                            <th className="p-3.5">Facility Location</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredDepartments.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="p-8 text-center text-slate-400 font-bold">
                                No departments match this search criteria.
                              </td>
                            </tr>
                          ) : (
                            filteredDepartments.map(dept => (
                              <tr key={dept.id} className="hover:bg-[#F8FAFC]/80 transition-colors">
                                <td className="p-3.5 font-mono font-bold text-slate-500">{dept.id}</td>
                                <td className="p-3.5 font-bold text-[#042C51]">{dept.name}</td>
                                <td className="p-3.5">
                                  <span className="px-2 py-0.5 bg-[#E9F0FC] text-[#042C51] rounded text-[10px] font-bold">
                                    {dept.cluster}
                                  </span>
                                </td>
                                <td className="p-3.5 font-medium text-slate-700">{dept.head}</td>
                                <td className="p-3.5 font-extrabold text-[#042C51]">{dept.headcount.toLocaleString()}</td>
                                <td className="p-3.5 text-[#FF5C28] font-black">{dept.budget}</td>
                                <td className="p-3.5 text-slate-500 font-medium">{dept.location}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* ---------------- 3. ATTENDANCE & BIOMETRIC LOGS ---------------- */}
                {activeModal === "attendance" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-4 gap-4 text-center">
                      <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200">
                        <span className="text-[10px] uppercase font-black tracking-wider text-emerald-700">Present</span>
                        <p className="text-2xl font-black text-emerald-800 mt-1">{attendanceCount.toLocaleString()}</p>
                      </div>
                      <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200">
                        <span className="text-[10px] uppercase font-black tracking-wider text-amber-700">On Leave</span>
                        <p className="text-2xl font-black text-amber-800 mt-1">215</p>
                      </div>
                      <div className="bg-rose-50 p-4 rounded-2xl border border-rose-200">
                        <span className="text-[10px] uppercase font-black tracking-wider text-rose-700">Late / Grace</span>
                        <p className="text-2xl font-black text-rose-800 mt-1">68</p>
                      </div>
                      <div className="bg-slate-100 p-4 rounded-2xl border border-slate-200">
                        <span className="text-[10px] uppercase font-black tracking-wider text-slate-600">Off Duty</span>
                        <p className="text-2xl font-black text-slate-800 mt-1">95</p>
                      </div>
                    </div>

                    <div className="space-y-3 p-4 bg-[#F8FAFC] border border-[#E6ECF2] rounded-2xl">
                      <h4 className="text-xs font-black text-[#042C51] flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#FF5C28]" />
                        <span>Biometric Hardware Synchronization Details</span>
                      </h4>
                      <p className="text-xs text-[#667085] leading-relaxed">
                        Biometric turnstile and facial scanner stations in Mandaluyong HQ and Cebu Operations Hub are <span className="text-emerald-700 font-extrabold">ONLINE & SYNCHRONIZED</span>.
                      </p>
                    </div>

                    <div className="space-y-2 border border-[#E6ECF2] rounded-2xl p-4 bg-white font-semibold text-xs">
                      <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block mb-2">Shift Attendance Roster</span>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex justify-between py-1.5 border-b border-slate-100">
                          <span className="text-slate-500">Morning Shift (08:00 AM - 05:00 PM):</span>
                          <span className="text-[#042C51] font-bold">2,350 Employees</span>
                        </div>
                        <div className="flex justify-between py-1.5 border-b border-slate-100">
                          <span className="text-slate-500">Regular Shift (09:00 AM - 06:00 PM):</span>
                          <span className="text-[#042C51] font-bold">1,100 Employees</span>
                        </div>
                        <div className="flex justify-between py-1.5">
                          <span className="text-slate-500">Night / Graveyard Shift (10:00 PM - 07:00 AM):</span>
                          <span className="text-[#042C51] font-bold">792 Employees</span>
                        </div>
                        <div className="flex justify-between py-1.5">
                          <span className="text-slate-500">Standby Emergency Pool:</span>
                          <span className="text-[#FF5C28] font-bold">120 Employees</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ---------------- 4. INTERVIEWS SCHEDULER ---------------- */}
                {activeModal === "interviews" && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center bg-[#E9F0FC] border border-blue-200 p-3.5 rounded-xl">
                      <div className="flex gap-2.5">
                        <Calendar className="w-5 h-5 text-[#042C51] shrink-0 mt-0.5" />
                        <p className="text-xs text-[#042C51] leading-relaxed">
                          Real-time interviews queue linked with the <span className="font-extrabold text-[#FF5C28]">Talent Acquisition Pipeline</span>.
                        </p>
                      </div>
                    </div>

                    <div className="border border-[#E6ECF2] rounded-xl overflow-hidden shadow-xs">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-[#F8FAFC] border-b border-[#E6ECF2] text-[#042C51] font-extrabold uppercase text-[10px] tracking-wider">
                            <th className="p-3.5">Time</th>
                            <th className="p-3.5">Candidate</th>
                            <th className="p-3.5">Position</th>
                            <th className="p-3.5">Lead Interviewer</th>
                            <th className="p-3.5">Status</th>
                            <th className="p-3.5">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {interviews.map((int) => (
                            <tr key={int.id} className="hover:bg-[#F8FAFC]/80 transition-colors">
                              <td className="p-3.5 font-mono font-bold text-[#042C51]">{int.time}</td>
                              <td className="p-3.5 font-bold text-[#042C51]">{int.candidate}</td>
                              <td className="p-3.5 text-slate-700 font-medium">{int.position}</td>
                              <td className="p-3.5 text-slate-500">{int.interviewer}</td>
                              <td className="p-3.5">
                                <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase ${
                                  int.status === "Completed" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                                  int.status === "In Progress" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                                  "bg-blue-50 text-blue-700 border border-blue-200"
                                }`}>
                                  {int.status}
                                </span>
                              </td>
                              <td className="p-3.5">
                                <button
                                  onClick={() => {
                                    setInterviews(prev => prev.map(i => i.id === int.id ? { ...i, status: "Completed" } : i));
                                    setToast(`Marked ${int.candidate} interview as completed.`);
                                  }}
                                  disabled={int.status === "Completed"}
                                  className="text-xs font-bold text-[#FF5C28] hover:text-[#042C51] disabled:text-slate-300 disabled:cursor-not-allowed transition-colors"
                                >
                                  Complete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* ---------------- 5. PAYROLL ADMINISTRATION ---------------- */}
                {activeModal === "payroll" && (
                  <div className="space-y-6">
                    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-black tracking-wider text-emerald-700 block">Monthly Salary Disbursement</span>
                        <span className="text-3xl font-black text-[#042C51]">$14,250,450.00</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] uppercase font-bold text-slate-500 block">Funding Status</span>
                        <span className="px-3 py-1 bg-emerald-600 text-white text-xs font-black rounded-lg uppercase tracking-wider shadow-sm">
                          Cleared & Disbursed
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3 text-xs">
                      <h4 className="font-extrabold text-[#042C51]">Cluster Disbursement Breakdown</h4>
                      
                      <div className="space-y-2 border border-[#E6ECF2] rounded-2xl p-4 bg-[#F8FAFC] font-semibold">
                        <div className="flex justify-between py-2 border-b border-slate-200">
                          <span className="text-slate-600">Telecom & Tech Support (1,450 staff):</span>
                          <span className="text-[#042C51] font-bold">$4,850,000</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-200">
                          <span className="text-slate-600">Financial Services Group (1,120 staff):</span>
                          <span className="text-[#042C51] font-bold">$3,950,000</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-200">
                          <span className="text-slate-600">Healthcare & Insurance (950 staff):</span>
                          <span className="text-[#042C51] font-bold">$3,120,000</span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-slate-600">Retail & Omnichannel (780 staff):</span>
                          <span className="text-[#042C51] font-bold">$2,330,450</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-[#E9F0FC] border border-blue-200 rounded-2xl flex items-center justify-between">
                      <div className="flex gap-2.5">
                        <Info className="w-5 h-5 text-[#042C51] shrink-0" />
                        <p className="text-xs text-[#042C51] font-medium leading-relaxed">
                          Next scheduled payroll cutoff: <span className="font-bold text-[#042C51]">July 31, 2026</span>. Bank channels validated.
                        </p>
                      </div>
                      <button
                        onClick={() => setToast("Payroll ledger exported as CSV!")}
                        className="px-4 py-2 bg-[#042C51] hover:bg-[#FF5C28] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-colors shadow-sm"
                      >
                        Export CSV
                      </button>
                    </div>
                  </div>
                )}

                {/* ---------------- 6. ADD EMPLOYEE FORM ---------------- */}
                {activeModal === "add-employee" && (
                  <form onSubmit={handleAddEmployeeSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold text-[#042C51] uppercase tracking-wide block">Full Legal Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. DELA CRUZ, JUAN MIGUEL"
                          value={newEmp.name}
                          onChange={e => setNewEmp(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full bg-[#F8FAFC] border border-[#E6ECF2] p-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:bg-white focus:border-[#FF5C28]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold text-[#042C51] uppercase tracking-wide block">Corporate Email *</label>
                        <input
                          type="email"
                          required
                          placeholder="juan.delacruz@thesiblings.com"
                          value={newEmp.email}
                          onChange={e => setNewEmp(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full bg-[#F8FAFC] border border-[#E6ECF2] p-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:bg-white focus:border-[#FF5C28]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold text-[#042C51] uppercase tracking-wide block">Department / Cluster *</label>
                        <select
                          value={newEmp.department}
                          onChange={e => setNewEmp(prev => ({ ...prev, department: e.target.value }))}
                          className="w-full bg-[#F8FAFC] border border-[#E6ECF2] p-2.5 rounded-xl text-xs font-bold text-[#042C51] focus:outline-none focus:border-[#FF5C28]"
                        >
                          <option value="Telecom & Tech Support">Telecom & Tech Support</option>
                          <option value="Financial Services Group">Financial Services Group</option>
                          <option value="Healthcare & Insurance">Healthcare & Insurance</option>
                          <option value="Retail & E-Commerce">Retail & E-Commerce</option>
                          <option value="Workforce Management">Workforce Management</option>
                          <option value="Core HR & Admin">Core HR & Admin</option>
                          <option value="Talent Acquisition">Talent Acquisition</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold text-[#042C51] uppercase tracking-wide block">Role / Designation *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Customer Solutions Specialist"
                          value={newEmp.role}
                          onChange={e => setNewEmp(prev => ({ ...prev, role: e.target.value }))}
                          className="w-full bg-[#F8FAFC] border border-[#E6ECF2] p-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:bg-white focus:border-[#FF5C28]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold text-[#042C51] uppercase tracking-wide block">Assigned Shift *</label>
                        <select
                          value={newEmp.shift}
                          onChange={e => setNewEmp(prev => ({ ...prev, shift: e.target.value }))}
                          className="w-full bg-[#F8FAFC] border border-[#E6ECF2] p-2.5 rounded-xl text-xs font-bold text-[#042C51] focus:outline-none focus:border-[#FF5C28]"
                        >
                          <option value="08:00 AM - 05:00 PM">08:00 AM - 05:00 PM (Morning)</option>
                          <option value="09:00 AM - 06:00 PM">09:00 AM - 06:00 PM (Regular)</option>
                          <option value="01:00 PM - 10:00 PM">01:00 PM - 10:00 PM (Mid Shift)</option>
                          <option value="10:00 PM - 07:00 AM">10:00 PM - 07:00 AM (Graveyard)</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold text-[#042C51] uppercase tracking-wide block">Initial Status *</label>
                        <select
                          value={newEmp.status}
                          onChange={e => setNewEmp(prev => ({ ...prev, status: e.target.value as any }))}
                          className="w-full bg-[#F8FAFC] border border-[#E6ECF2] p-2.5 rounded-xl text-xs font-bold text-[#042C51] focus:outline-none focus:border-[#FF5C28]"
                        >
                          <option value="Present">Active & Present Today</option>
                          <option value="On Leave">Active & On Leave</option>
                          <option value="Off Duty">Active & Off Duty</option>
                          <option value="Late">Active & Late Today</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setActiveModal(null)}
                        className="px-4 py-2.5 text-xs font-bold bg-[#F1F5F9] hover:bg-slate-200 rounded-xl text-[#042C51] transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2.5 text-xs font-black bg-[#FF5C28] hover:bg-[#ff470d] text-white rounded-xl shadow-md transition-all cursor-pointer"
                      >
                        Create Employee Record
                      </button>
                    </div>
                  </form>
                )}

                {/* ---------------- 7. CREATE DEPARTMENT FORM ---------------- */}
                {activeModal === "create-department" && (
                  <form onSubmit={handleCreateDepartmentSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold text-[#042C51] uppercase tracking-wide block">Department Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Quality Assurance & Coaching"
                          value={newDept.name}
                          onChange={e => setNewDept(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full bg-[#F8FAFC] border border-[#E6ECF2] p-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:bg-white focus:border-[#FF5C28]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold text-[#042C51] uppercase tracking-wide block">Lead Director / Head *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. ALENA BATACAN"
                          value={newDept.head}
                          onChange={e => setNewDept(prev => ({ ...prev, head: e.target.value }))}
                          className="w-full bg-[#F8FAFC] border border-[#E6ECF2] p-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:bg-white focus:border-[#FF5C28]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold text-[#042C51] uppercase tracking-wide block">Annual Operating Budget ($) *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 550000"
                          value={newDept.budget}
                          onChange={e => setNewDept(prev => ({ ...prev, budget: e.target.value }))}
                          className="w-full bg-[#F8FAFC] border border-[#E6ECF2] p-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:bg-white focus:border-[#FF5C28]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold text-[#042C51] uppercase tracking-wide block">Facility Location Floor *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Building 2, Floor 4"
                          value={newDept.location}
                          onChange={e => setNewDept(prev => ({ ...prev, location: e.target.value }))}
                          className="w-full bg-[#F8FAFC] border border-[#E6ECF2] p-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:bg-white focus:border-[#FF5C28]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-[#042C51] uppercase tracking-wide block">Initial Staff Headcount</label>
                      <input
                        type="number"
                        placeholder="e.g. 20"
                        value={newDept.headcount || ""}
                        onChange={e => setNewDept(prev => ({ ...prev, headcount: parseInt(e.target.value) || 0 }))}
                        className="w-full bg-[#F8FAFC] border border-[#E6ECF2] p-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:bg-white focus:border-[#FF5C28]"
                      />
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setActiveModal(null)}
                        className="px-4 py-2.5 text-xs font-bold bg-[#F1F5F9] hover:bg-slate-200 rounded-xl text-[#042C51] transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2.5 text-xs font-black bg-[#FF5C28] hover:bg-[#ff470d] text-white rounded-xl shadow-md transition-all cursor-pointer"
                      >
                        Deploy Department Unit
                      </button>
                    </div>
                  </form>
                )}

                {/* ---------------- 8. REPORTS & STATISTICS PANEL ---------------- */}
                {activeModal === "view-reports" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* Department distribution */}
                      <div className="p-5 border border-[#E6ECF2] rounded-2xl bg-[#F8FAFC] space-y-3">
                        <span className="text-[10px] uppercase font-black tracking-wider text-slate-400">Headcount Share per Cluster</span>
                        <div className="space-y-2.5 text-xs font-semibold text-[#042C51]">
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <span>Telecom & Tech Support</span>
                              <span className="font-extrabold text-[#042C51]">31.3% (1,450)</span>
                            </div>
                            <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                              <div className="h-full bg-[#042C51] rounded-full" style={{ width: "31.3%" }} />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <span>Financial Services Group</span>
                              <span className="font-extrabold text-indigo-600">24.2% (1,120)</span>
                            </div>
                            <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-600 rounded-full" style={{ width: "24.2%" }} />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <span>Healthcare & Insurance</span>
                              <span className="font-extrabold text-[#FF5C28]">20.5% (950)</span>
                            </div>
                            <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                              <div className="h-full bg-[#FF5C28] rounded-full" style={{ width: "20.5%" }} />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <span>Retail & E-Commerce</span>
                              <span className="font-extrabold text-emerald-600">16.8% (780)</span>
                            </div>
                            <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-600 rounded-full" style={{ width: "16.8%" }} />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Recruitment Yield Funnel */}
                      <div className="p-5 border border-[#E6ECF2] rounded-2xl bg-[#F8FAFC] space-y-3">
                        <span className="text-[10px] uppercase font-black tracking-wider text-slate-400">Recruitment Yield & Conversion</span>
                        <div className="space-y-2 text-xs font-semibold text-[#042C51]">
                          <div className="flex justify-between items-center py-1.5 border-b border-slate-200">
                            <span className="text-slate-500">Accepted Job Offers:</span>
                            <span className="font-extrabold text-[#042C51]">420 Candidates</span>
                          </div>
                          <div className="flex justify-between items-center py-1.5 border-b border-slate-200">
                            <span className="text-slate-500">New Hire Orientation (NHO) Yield:</span>
                            <span className="font-extrabold text-[#FF5C28]">94.0%</span>
                          </div>
                          <div className="flex justify-between items-center py-1.5 border-b border-slate-200">
                            <span className="text-slate-500">Foundation Skills Training (FST):</span>
                            <span className="font-extrabold text-[#042C51]">83.3%</span>
                          </div>
                          <div className="flex justify-between items-center py-1.5">
                            <span className="text-slate-500">Annualized Attrition Factor:</span>
                            <span className="font-extrabold text-emerald-600">Low (3.2%)</span>
                          </div>
                        </div>
                      </div>

                    </div>

                    <div className="p-4 bg-[#E9F0FC] border border-blue-200 rounded-2xl flex gap-3 text-xs font-semibold text-[#042C51] leading-relaxed">
                      <Sparkles className="w-5 h-5 text-[#FF5C28] shrink-0 mt-0.5" />
                      <p>
                        Our machine learning workforce planning model indicates strong headcount buffers across all 4 operational clusters. Hiring velocity matches forecast demand for Q3/Q4 peak season.
                      </p>
                    </div>
                  </div>
                )}

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
