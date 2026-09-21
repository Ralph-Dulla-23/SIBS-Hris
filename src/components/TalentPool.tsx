import React, { useState, useMemo, useRef } from "react";
import CentralizedFilters from "./CentralizedFilters";
import AddCandidateModal from "./AddCandidateModal";
import CandidateProfileModal from "./CandidateProfileModal";
import PublicTalentPoolApplicationPage from "./PublicTalentPoolApplicationPage";
import {
  Users,
  Search,
  Filter,
  RefreshCw,
  Download,
  Upload,
  Plus,
  ExternalLink,
  ChevronDown,
  Info,
  CheckCircle,
  X,
  User,
  Mail,
  Phone,
  Briefcase,
  MapPin,
  Tag,
  Clock,
  ArrowRight,
  Database,
  SlidersHorizontal,
  ChevronLeft,
  ChevronsRight,
  AlertTriangle,
  Award,
  Settings,
  HelpCircle,
  FileText,
  GraduationCap,
  Volume2,
  Play,
  Pause,
  RotateCcw,
  UserCheck,
  ShieldAlert,
  Building,
  Calendar,
  Layers,
  Sparkles,
  Check,
  FileCheck,
  Trash2,
  Send,
  Radio,
  FileSpreadsheet
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// ==================== TYPES & INTERFACES ====================

export interface WorkExperience {
  company: string;
  position: string;
  industry: string;
  tenure: string;
  monthlySalary: string;
  reasonForLeaving: string;
}

export interface EducationRecord {
  level: "Elementary" | "High School" | "Senior High" | "College" | "Vocational" | "Master's" | "Doctorate";
  schoolName: string;
  degreeCourse: string;
  gradYear: string;
  address: string;
}

export interface LicenseRecord {
  title: string;
  licenseNo: string;
  rating: string;
  validity: string;
}

export interface TrainingRecord {
  title: string;
  date: string;
  sponsor: string;
}

export interface CharacterReference {
  name: string;
  company: string;
  title: string;
  contactNumber: string;
  email: string;
}

export interface PreEmploymentRequirements {
  torDiploma: "Submitted" | "Pending" | "Verified";
  nbiClearance: "Submitted" | "Pending" | "Verified";
  medicalCheck: "Submitted" | "Pending" | "Verified";
  bir2316: "Submitted" | "Pending" | "Verified";
  sssNo: "Submitted" | "Pending" | "Verified";
  philHealthNo: "Submitted" | "Pending" | "Verified";
  pagIbigNo: "Submitted" | "Pending" | "Verified";
}

export interface DropOffInfo {
  dropOffStage: string;
  dropOffReason: string;
  date: string;
  notes: string;
}

export interface Candidate {
  id: string; // e.g. SIBS-CAN-9021
  name: string;
  email: string;
  phone: string;
  appliedPosition: string;
  department: string;
  accountFit: string;
  sourcingChannel: string;
  recruiter: string;
  applicationDate: string;
  status: "New Applicant" | "Silver Pool" | "Recyclable" | "Do Not Reprocess" | "Hired / Active" | "Initial Screening" | "Active" | "Drop-off";
  isPublicEntry: boolean;
  lastActivityDate: string;
  notes: string;

  // Personal Details
  address?: string;
  dob?: string;
  age?: number;
  gender?: string;
  civilStatus?: string;
  citizenship?: string;

  // Work Experience
  workExperience?: WorkExperience[];

  // Educational Background
  education?: EducationRecord[];

  // Eligibility & Licenses
  licenses?: LicenseRecord[];

  // Trainings & Seminars
  trainings?: TrainingRecord[];

  // Skills & Recognitions
  skills: string[];
  languages?: string[];
  awards?: string[];
  affiliations?: string[];

  // Assessment Results
  assessmentStatus?: string;
  testScore?: string;
  overallResult?: "Passed" | "Conditional" | "Failed";
  assessmentRemarks?: string;

  // Readiness & Compliance
  vaccinationStatus?: string;
  willingOnSite?: boolean;
  graveyardShiftReadiness?: boolean;
  employmentInterest?: string;

  // Character References
  characterReferences?: CharacterReference[];

  // Audio & Files
  hasVoiceRecording?: boolean;
  audioFileName?: string;
  resumeFileName?: string;

  // NHO / Pre-employment Requirements
  requirements?: PreEmploymentRequirements;

  // Drop-off Info
  dropOffDetails?: DropOffInfo;

  // Audit Logs
  history: Array<{ date: string; action: string; user: string }>;
}

// ==================== INITIAL SEED DATA ====================

const INITIAL_CANDIDATES: Candidate[] = [
  {
    id: "SIBS-CAN-9021",
    name: "Althea Rose Vergara",
    email: "althea.vergara@gmail.com",
    phone: "+63 917 123 4567",
    appliedPosition: "Healthcare Support Specialist",
    department: "Healthcare & Life Sciences",
    accountFit: "UnitedHealth Group",
    sourcingChannel: "Facebook Ads / Social",
    recruiter: "Alena Batacan",
    applicationDate: "2026-07-10",
    status: "Silver Pool",
    isPublicEntry: true,
    lastActivityDate: "2026-07-18",
    notes: "Passed final client interview for UHG Account. Slot filled due to capacity limit. Highly recommended for future healthcare waves.",
    
    address: "124 Matina Enclaves, Davao City, Davao del Sur",
    dob: "1998-05-14",
    age: 28,
    gender: "Female",
    civilStatus: "Single",
    citizenship: "Filipino",

    workExperience: [
      {
        company: "Teleperformance PH",
        position: "Customer Care Specialist",
        industry: "BPO / Call Center",
        tenure: "2 years 4 months",
        monthlySalary: "₱24,000",
        reasonForLeaving: "Career advancement in healthcare niche"
      },
      {
        company: "Davao Doctors Hospital",
        position: "Medical Records Assistant",
        industry: "Healthcare",
        tenure: "1 year 2 months",
        monthlySalary: "₱18,000",
        reasonForLeaving: "Transitioned to BPO industry"
      }
    ],

    education: [
      {
        level: "College",
        schoolName: "Ateneo de Davao University",
        degreeCourse: "BS Nursing",
        gradYear: "2020",
        address: "E. Jacinto St, Davao City"
      },
      {
        level: "Senior High",
        schoolName: "Davao City National High School",
        degreeCourse: "STEM Strand",
        gradYear: "2016",
        address: "F. Torres St, Davao City"
      }
    ],

    licenses: [
      {
        title: "Registered Nurse (PNLE)",
        licenseNo: "RN-0884920",
        rating: "84.60%",
        validity: "2028-05-14"
      }
    ],

    trainings: [
      {
        title: "HIPAA & US Healthcare Compliance Training",
        date: "2025-11-10",
        sponsor: "BPO Industry Association PH"
      }
    ],

    skills: ["Medical Terminology", "HIPAA Compliance", "SVAR 62/80", "Empathy & Active Listening", "EHR System Navigation"],
    languages: ["English (Native C1)", "Filipino", "Cebuano"],
    awards: ["Top Quality CSR - Q1 2025 (Teleperformance)"],
    affiliations: ["Philippine Nurses Association (PNA)"],

    assessmentStatus: "Completed",
    testScore: "88/100 (SVAR Level 6)",
    overallResult: "Passed",
    assessmentRemarks: "Flawless American accent modulation and strong medical vocabulary retention.",

    vaccinationStatus: "Fully Vaccinated + 2 Boosters",
    willingOnSite: true,
    graveyardShiftReadiness: true,
    employmentInterest: "Full-Time On-Site BPO",

    characterReferences: [
      {
        name: "Dr. Roberto Santos",
        company: "Davao Doctors Hospital",
        title: "Head of Medical Records",
        contactNumber: "+63 917 888 9900",
        email: "r.santos@ddh.com.ph"
      },
      {
        name: "Clarissa Ocampo",
        company: "Teleperformance",
        title: "Team Leader - Operations",
        contactNumber: "+63 920 444 5566",
        email: "clarissa.o@teleperformance.com"
      }
    ],

    hasVoiceRecording: true,
    audioFileName: "Althea_Vergara_VoiceIntro_SVAR.mp3",
    resumeFileName: "Althea_Rose_Vergara_CV_2026.pdf",

    requirements: {
      torDiploma: "Verified",
      nbiClearance: "Verified",
      medicalCheck: "Verified",
      bir2316: "Submitted",
      sssNo: "Verified",
      philHealthNo: "Verified",
      pagIbigNo: "Verified"
    },

    history: [
      { date: "2026-07-10", action: "Public web form application submitted", user: "Public Candidate Portal" },
      { date: "2026-07-15", action: "Passed Ops & Client Interview Assessment", user: "Clara G." },
      { date: "2026-07-18", action: "Moved to Silver Pool due to ramp capacity limit", user: "Alena Batacan" }
    ]
  },
  {
    id: "SIBS-CAN-9022",
    name: "John Benedict Reyes",
    email: "jb.reyes@yahoo.com",
    phone: "+63 918 234 5678",
    appliedPosition: "Technical Support Associate",
    department: "Information Technology & Telecom",
    accountFit: "Comcast Cable",
    sourcingChannel: "JobStreet / Online Job Portal",
    recruiter: "Mark Ramos",
    applicationDate: "2026-07-05",
    status: "Recyclable",
    isPublicEntry: false,
    lastActivityDate: "2026-07-19",
    notes: "Communications score 7.5/10. Technical score is solid (Linux & Router Debug). Needs 2 weeks accent modulation training. Re-evaluate for next wave.",

    address: "Block 12 Lot 5, Buhangin, Davao City",
    dob: "1999-11-20",
    age: 26,
    gender: "Male",
    civilStatus: "Single",
    citizenship: "Filipino",

    workExperience: [
      {
        company: "Concentrix PH",
        position: "Tier 1 Tech Support Representative",
        industry: "Telecom BPO",
        tenure: "1 year 8 months",
        monthlySalary: "₱22,000",
        reasonForLeaving: "Sought higher salary package"
      }
    ],

    education: [
      {
        level: "College",
        schoolName: "University of Southeastern Philippines",
        degreeCourse: "BS Information Technology",
        gradYear: "2022",
        address: "Inigo St, Obrero, Davao City"
      }
    ],

    skills: ["Linux Console", "TCP/IP Networking", "Router Configuration", "Hardware Troubleshooting"],
    languages: ["English (Conversational B2)", "Filipino", "Cebuano"],

    assessmentStatus: "Completed",
    testScore: "76/100 (Tech Assessment Passed)",
    overallResult: "Conditional",
    assessmentRemarks: "Strong technical skills; recommended for 5-day accent enhancement boot camp.",

    vaccinationStatus: "Fully Vaccinated",
    willingOnSite: true,
    graveyardShiftReadiness: true,
    employmentInterest: "Full-Time On-Site BPO",

    characterReferences: [
      {
        name: "Engr. Manuel Tan",
        company: "Concentrix PH",
        title: "Technical Support Manager",
        contactNumber: "+63 918 111 2233",
        email: "mtan@concentrix.com"
      }
    ],

    hasVoiceRecording: true,
    audioFileName: "JB_Reyes_TechSample.mp3",
    resumeFileName: "John_Benedict_Reyes_Resume.pdf",

    requirements: {
      torDiploma: "Verified",
      nbiClearance: "Submitted",
      medicalCheck: "Pending",
      bir2316: "Pending",
      sssNo: "Verified",
      philHealthNo: "Verified",
      pagIbigNo: "Verified"
    },

    history: [
      { date: "2026-07-05", action: "Manual candidate profile registered", user: "Alena Batacan" },
      { date: "2026-07-19", action: "Assessed and marked as Recyclable for next Tech wave", user: "Mark Ramos" }
    ]
  },
  {
    id: "SIBS-CAN-9023",
    name: "Maricar Salvatierra",
    email: "maricar.salva@outlook.com",
    phone: "+63 920 345 6789",
    appliedPosition: "Financial Account Expert",
    department: "Finance & Accounting BPO",
    accountFit: "Capital One Finance",
    sourcingChannel: "Employee Referral (Referrer: Juan D.)",
    recruiter: "Alena Batacan",
    applicationDate: "2026-07-12",
    status: "Hired / Active",
    isPublicEntry: true,
    lastActivityDate: "2026-07-20",
    notes: "Onboarded for Capital One wave starting August 1. High aptitude scores in General Ledger and Fraud Check.",

    address: "77 Pioneer Ave, Tagum City, Davao del Norte",
    dob: "1996-03-08",
    age: 30,
    gender: "Female",
    civilStatus: "Married",
    citizenship: "Filipino",

    workExperience: [
      {
        company: "JPMorgan Chase & Co.",
        position: "Financial Care Specialist",
        industry: "Financial Services BPO",
        tenure: "3 years 11 months",
        monthlySalary: "₱32,000",
        reasonForLeaving: "Relocated closer to family in Tagum"
      }
    ],

    education: [
      {
        level: "College",
        schoolName: "UM Tagum College",
        degreeCourse: "BS Accountancy",
        gradYear: "2018",
        address: "Mabini St, Tagum City"
      }
    ],

    skills: ["General Ledger", "Credit Fraud Check", "Excel Pivot Tables", "US Financial Regulations"],
    languages: ["English (Fluent C1)", "Filipino"],

    assessmentStatus: "Completed",
    testScore: "94/100 (Financial Aptitude Top 5%)",
    overallResult: "Passed",
    assessmentRemarks: "Exemplary financial analysis skills and customer resolution experience.",

    vaccinationStatus: "Fully Vaccinated + Booster",
    willingOnSite: true,
    graveyardShiftReadiness: true,
    employmentInterest: "Full-Time On-Site",

    hasVoiceRecording: true,
    audioFileName: "Maricar_Salvatierra_AudioIntro.wav",
    resumeFileName: "Maricar_Salvatierra_CV.pdf",

    requirements: {
      torDiploma: "Verified",
      nbiClearance: "Verified",
      medicalCheck: "Verified",
      bir2316: "Verified",
      sssNo: "Verified",
      philHealthNo: "Verified",
      pagIbigNo: "Verified"
    },

    history: [
      { date: "2026-07-12", action: "Public form application received via Referral", user: "System Portal" },
      { date: "2026-07-16", action: "Passed Final Interview & Mock Fraud Calls", user: "Sourcing Bot" },
      { date: "2026-07-20", action: "Status updated to Hired / Active", user: "Alena Batacan" }
    ]
  },
  {
    id: "SIBS-CAN-9024",
    name: "Dexter James Alcala",
    email: "dexter.alcala@gmail.com",
    phone: "+63 908 456 7890",
    appliedPosition: "Customer Service Representative",
    department: "Customer Operations",
    accountFit: "T-Mobile USA",
    sourcingChannel: "CSV Bulk Import Lead",
    recruiter: "Recruiter Admin",
    applicationDate: "2026-07-11",
    status: "Do Not Reprocess",
    isPublicEntry: false,
    lastActivityDate: "2026-07-14",
    notes: "Candidate failed background checks (undisclosed prior termination for serious breach of company policy). Marked Do Not Reprocess.",

    address: "Toril, Davao City",
    dob: "1997-08-22",
    age: 28,
    gender: "Male",
    civilStatus: "Single",
    citizenship: "Filipino",

    skills: ["Customer Service", "Retail Sales"],
    assessmentStatus: "Failed",
    testScore: "45/100",
    overallResult: "Failed",
    assessmentRemarks: "Red flags during Background Investigation (BGC).",

    hasVoiceRecording: false,
    resumeFileName: "Dexter_Alcala_Draft.pdf",

    history: [
      { date: "2026-07-11", action: "Profile uploaded via CSV bulk leads", user: "Recruiter Admin" },
      { date: "2026-07-14", action: "Background investigation returned red flag. Marked Do Not Reprocess.", user: "Security Officer" }
    ]
  },
  {
    id: "SIBS-CAN-9025",
    name: "Janelle Beatrice Santos",
    email: "janelle.santos@gmail.com",
    phone: "+63 927 567 8901",
    appliedPosition: "Healthcare Support Specialist",
    department: "Healthcare & Life Sciences",
    accountFit: "Humana Healthcare",
    sourcingChannel: "Public Application Form",
    recruiter: "Alena Batacan",
    applicationDate: "2026-07-09",
    status: "New Applicant",
    isPublicEntry: true,
    lastActivityDate: "2026-07-17",
    notes: "Fresh applicant submission via website landing form. High SVAR audio sample quality.",

    address: "Lanang, Davao City",
    dob: "2001-01-30",
    age: 25,
    gender: "Female",
    civilStatus: "Single",
    citizenship: "Filipino",

    education: [
      {
        level: "College",
        schoolName: "San Pedro College",
        degreeCourse: "BS Medical Technology",
        gradYear: "2023",
        address: "Guzman St, Davao City"
      }
    ],

    skills: ["Medical Terminology", "SVAR 60", "Customer Care"],
    languages: ["English (Fluent)", "Filipino"],

    assessmentStatus: "Pending",
    testScore: "Pending Initial Screener",

    hasVoiceRecording: true,
    audioFileName: "Janelle_Santos_Voice.mp3",
    resumeFileName: "Janelle_Santos_MedTech_CV.pdf",

    history: [
      { date: "2026-07-09", action: "Public form application submitted", user: "Public Portal" }
    ]
  },
  {
    id: "SIBS-CAN-9028",
    name: "Gabriel Mendoza",
    email: "gab.mendoza@gmail.com",
    phone: "+63 917 999 8877",
    appliedPosition: "Technical Support Associate",
    department: "Information Technology & Telecom",
    accountFit: "Apple iOS Account",
    sourcingChannel: "LinkedIn Direct Outreach",
    recruiter: "Mark Ramos",
    applicationDate: "2026-07-01",
    status: "Drop-off",
    isPublicEntry: false,
    lastActivityDate: "2026-07-16",
    notes: "Withdrew during Client Final Interview stage after receiving competing offer from local tech firm.",

    address: "Catalunan Grande, Davao City",
    dob: "1995-12-05",
    age: 30,
    gender: "Male",
    civilStatus: "Married",
    citizenship: "Filipino",

    skills: ["iOS Debugging", "Hardware Diagnostics", "Mac OS Support"],

    dropOffDetails: {
      dropOffStage: "Client Final Interview",
      dropOffReason: "Accepted Competing Offer Elsewhere",
      date: "2026-07-16",
      notes: "Candidate verbally informed recruiter that competing offer provided work-from-home arrangement."
    },

    history: [
      { date: "2026-07-01", action: "Sourced via LinkedIn and registered profile", user: "Mark Ramos" },
      { date: "2026-07-12", action: "Passed Technical Screening & SVAR", user: "Mark Ramos" },
      { date: "2026-07-16", action: "Marked as Drop-off: Withdrew at Client Interview stage", user: "Mark Ramos" }
    ]
  },
  {
    id: "SIBS-CAN-9029",
    name: "Kristine Mae Soriano",
    email: "kristine.soriano@yahoo.com",
    phone: "+63 922 444 3322",
    appliedPosition: "Healthcare Support Specialist",
    department: "Healthcare & Life Sciences",
    accountFit: "Humana Healthcare",
    sourcingChannel: "Walk-in Applicant",
    recruiter: "Clara G.",
    applicationDate: "2026-07-08",
    status: "Drop-off",
    isPublicEntry: false,
    lastActivityDate: "2026-07-15",
    notes: "Failed SVAR pronunciation check at Initial Screening stage. Invited to re-apply after accent training.",

    address: "Panabo City, Davao del Norte",
    dob: "2000-04-18",
    age: 26,
    gender: "Female",
    civilStatus: "Single",
    citizenship: "Filipino",

    skills: ["Medical Transcription", "Customer Service"],

    dropOffDetails: {
      dropOffStage: "Initial Screening (SVAR Check)",
      dropOffReason: "Failed SVAR / Language Assessment Threshold",
      date: "2026-07-15",
      notes: "SVAR score recorded as 48/80 (below 55 benchmark requirement)."
    },

    history: [
      { date: "2026-07-08", action: "Walk-in profile created at Davao Recruitment Center", user: "Clara G." },
      { date: "2026-07-15", action: "Marked as Drop-off: Failed SVAR threshold requirement", user: "Clara G." }
    ]
  }
];

export default function TalentPool({
  userEmail,
  onSwitchModule
}: {
  userEmail?: string;
  onSwitchModule?: (module: string) => void;
}) {
  // --- STATE ---
  const [candidates, setCandidates] = useState<Candidate[]>(INITIAL_CANDIDATES);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [positionFilter, setPositionFilter] = useState<string>("All");
  const [departmentFilter, setDepartmentFilter] = useState<string>("All");
  const [sourceFilter, setSourceFilter] = useState<string>("All");
  const [dateFromFilter, setDateFromFilter] = useState<string>("");
  const [dateToFilter, setDateToFilter] = useState<string>("");

  // Modals & Drawers
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [isPublicFormModalOpen, setIsPublicFormModalOpen] = useState(false);

  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [activeProfileTab, setActiveProfileTab] = useState<
    "personal" | "experience" | "skills" | "assessment" | "media" | "nho" | "history"
  >("personal");

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // File Upload Reference
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Voice Intro Simulation Player State
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Status Change State
  const [newStatus, setNewStatus] = useState<Candidate["status"]>("Silver Pool");
  const [statusChangeRemarks, setStatusChangeRemarks] = useState("");

  // Move to Pipeline State
  const [targetAccount, setTargetAccount] = useState("");
  const [targetPositionRequirement, setTargetPositionRequirement] = useState("Healthcare Support Specialist (PRF-2026-041)");
  const [matchedEvaluationTemplate, setMatchedEvaluationTemplate] = useState("Healthcare Voice & Terminology Assessment Standard");
  const [moveNotes, setMoveNotes] = useState("");

  // Toast Helper
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3800);
  };

  // --- DERIVED METRICS ---
  const metrics = useMemo(() => {
    const total = candidates.length;
    const silver = candidates.filter((c) => c.status === "Silver Pool").length;
    const recyclable = candidates.filter((c) => c.status === "Recyclable").length;
    const block = candidates.filter((c) => c.status === "Do Not Reprocess").length;
    const active = candidates.filter((c) => c.status === "Hired / Active").length;
    const publicCount = candidates.filter((c) => c.isPublicEntry).length;
    const dropOffCount = candidates.filter((c) => c.status === "Drop-off").length;

    return { total, silver, recyclable, block, active, publicCount, dropOffCount };
  }, [candidates]);

  // Distinct Filter Options
  const distinctPositions = useMemo(() => {
    const set = new Set<string>();
    candidates.forEach((c) => set.add(c.appliedPosition));
    return Array.from(set);
  }, [candidates]);

  const distinctDepartments = useMemo(() => {
    const set = new Set<string>();
    candidates.forEach((c) => {
      if (c.department) set.add(c.department);
    });
    return Array.from(set);
  }, [candidates]);

  const distinctSources = useMemo(() => {
    const set = new Set<string>();
    candidates.forEach((c) => {
      if (c.sourcingChannel) set.add(c.sourcingChannel);
    });
    return Array.from(set);
  }, [candidates]);

  // --- FILTERING LOGIC ---
  const activeCandidates = useMemo(() => {
    return candidates.filter((c) => c.status !== "Drop-off");
  }, [candidates]);

  const dropOffCandidates = useMemo(() => {
    return candidates.filter((c) => c.status === "Drop-off");
  }, [candidates]);

  const filteredCandidates = useMemo(() => {
    return candidates.filter((c) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        c.appliedPosition.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        (c.department && c.department.toLowerCase().includes(q));

      const matchesStatus = statusFilter === "All" || c.status === statusFilter;
      const matchesPosition = positionFilter === "All" || c.appliedPosition === positionFilter;
      const matchesDepartment = departmentFilter === "All" || c.department === departmentFilter;
      const matchesSource = sourceFilter === "All" || c.sourcingChannel === sourceFilter;

      let matchesDate = true;
      if (dateFromFilter) {
        matchesDate = matchesDate && c.applicationDate >= dateFromFilter;
      }
      if (dateToFilter) {
        matchesDate = matchesDate && c.applicationDate <= dateToFilter;
      }

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPosition &&
        matchesDepartment &&
        matchesSource &&
        matchesDate
      );
    });
  }, [
    candidates,
    searchTerm,
    statusFilter,
    positionFilter,
    departmentFilter,
    sourceFilter,
    dateFromFilter,
    dateToFilter
  ]);

  // Pagination bounds
  const paginatedCandidates = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCandidates.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCandidates, currentPage]);

  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage) || 1;

  // Clear filters
  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
    setPositionFilter("All");
    setDepartmentFilter("All");
    setSourceFilter("All");
    setDateFromFilter("");
    setDateToFilter("");
    setCurrentPage(1);
    triggerToast("Talent pool filters successfully cleared.");
  };

  // --- HANDLERS ---

  // 1. Download CSV template
  const handleDownloadTemplate = () => {
    const headers =
      "Candidate ID,Full Name,Email Address,Mobile Phone,Applied Position,Department,Sourcing Channel,Status,Key Skills,Notes\n";
    const sample1 =
      "SIBS-CAN-9101,Maria Clara Santos,maria.clara@gmail.com,+639171112233,Healthcare Support Specialist,Healthcare & Life Sciences,JobStreet,Silver Pool,\"Medical Billing, HIPAA, SVAR 60\",Passed interview waiting for wave slot\n";
    const sample2 =
      "SIBS-CAN-9102,Alexander Hamilton,alex.h@outlook.com,+639203334455,Financial Account Expert,Finance & Accounting,Facebook Ads,Recyclable,\"General Ledger, Fraud Check\",Needs 1 week accent training\n";

    const blob = new Blob([headers + sample1 + sample2], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "siblings_talent_pool_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast("Talent pool CSV upload template downloaded successfully.");
  };

  // 2. CSV Upload Leads Action
  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const text = evt.target?.result as string;
        const lines = text.split("\n");
        if (lines.length <= 1) {
          triggerToast("CSV file is empty or missing headers.");
          return;
        }

        const parsed: Candidate[] = [];
        let count = 0;

        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;

          const columns = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
          if (columns.length < 3) continue;

          const rawName = columns[1]?.replace(/"/g, "").trim() || columns[0]?.replace(/"/g, "").trim();
          const rawEmail = columns[2]?.replace(/"/g, "").trim() || `${rawName.toLowerCase().replace(" ", ".")}@imported.ph`;
          const rawPhone = columns[3]?.replace(/"/g, "").trim() || "+63 917 000 0000";
          const rawPos = columns[4]?.replace(/"/g, "").trim() || "Customer Service Representative";
          const rawDept = columns[5]?.replace(/"/g, "").trim() || "Customer Operations";
          const rawSource = columns[6]?.replace(/"/g, "").trim() || "CSV Bulk Leads Upload";
          const rawSkills = columns[8]?.replace(/"/g, "").trim() || "Customer Care";

          if (!rawName) continue;

          const skillsArray = rawSkills ? rawSkills.split(";").map((s) => s.trim()) : ["BPO Fundamentals"];

          const nextId = `SIBS-CAN-9${Math.floor(1000 + Math.random() * 9000)}`;
          const newCand: Candidate = {
            id: nextId,
            name: rawName,
            email: rawEmail,
            phone: rawPhone,
            appliedPosition: rawPos,
            department: rawDept,
            accountFit: "Pending Wave Alignment",
            sourcingChannel: rawSource,
            recruiter: userEmail || "Alena Batacan",
            applicationDate: new Date().toISOString().split("T")[0],
            status: "Silver Pool",
            isPublicEntry: false,
            lastActivityDate: new Date().toISOString().split("T")[0],
            notes: "Imported via bulk CSV candidate lead parsing engine.",
            skills: skillsArray,
            history: [
              {
                date: new Date().toISOString().split("T")[0],
                action: "Imported via CSV bulk leads template",
                user: userEmail || "Alena Batacan"
              }
            ]
          };

          parsed.push(newCand);
          count++;
        }

        if (parsed.length > 0) {
          setCandidates((prev) => [...parsed, ...prev]);
          triggerToast(`Successfully parsed and imported ${count} candidate profiles!`);
        } else {
          triggerToast("Could not find valid candidate records in the uploaded CSV file.");
        }
      } catch (err) {
        triggerToast("Failed to parse CSV file. Ensure the structure conforms to the template.");
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // 3. Restore Candidate from Drop-off
  const handleRestoreCandidate = (cand: Candidate) => {
    const updated = candidates.map((c) => {
      if (c.id === cand.id) {
        return {
          ...c,
          status: "Silver Pool" as const,
          lastActivityDate: new Date().toISOString().split("T")[0],
          history: [
            ...c.history,
            {
              date: new Date().toISOString().split("T")[0],
              action: `Restored from Drop-off section to Silver Pool for active reconsiderations.`,
              user: userEmail || "Alena Batacan"
            }
          ]
        };
      }
      return c;
    });

    setCandidates(updated);
    triggerToast(`Restored ${cand.name} (${cand.id}) to active Silver Pool!`);
  };

  // 4. Update Status Submit
  const handleStatusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCandidate) return;

    const oldStatus = selectedCandidate.status;
    const updated = candidates.map((c) => {
      if (c.id === selectedCandidate.id) {
        const isDropOff = newStatus === "Drop-off";
        return {
          ...c,
          status: newStatus,
          lastActivityDate: new Date().toISOString().split("T")[0],
          dropOffDetails: isDropOff
            ? {
                dropOffStage: "Recruiter Manual Status Update",
                dropOffReason: statusChangeRemarks || "Marked as Drop-off during pool re-classification.",
                date: new Date().toISOString().split("T")[0],
                notes: statusChangeRemarks || "Status changed to Drop-off."
              }
            : c.dropOffDetails,
          history: [
            ...c.history,
            {
              date: new Date().toISOString().split("T")[0],
              action: `Status re-aligned: ${oldStatus} ➔ ${newStatus}. Remarks: ${
                statusChangeRemarks || "No remark provided"
              }`,
              user: userEmail || "Alena Batacan"
            }
          ]
        };
      }
      return c;
    });

    setCandidates(updated);

    const currentLive = updated.find((c) => c.id === selectedCandidate.id);
    if (currentLive) {
      setSelectedCandidate(currentLive);
    }

    setIsStatusModalOpen(false);
    setStatusChangeRemarks("");
    triggerToast(`Re-aligned ${selectedCandidate.name} pool status to ${newStatus}.`);
  };

  // 5. Move Candidate to Recruitment Pipeline Submit
  const handleMoveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCandidate) return;
    if (!targetAccount) {
      triggerToast("Please input or select a target corporate client account.");
      return;
    }

    const updated = candidates.map((c) => {
      if (c.id === selectedCandidate.id) {
        return {
          ...c,
          status: "Hired / Active" as const,
          accountFit: targetAccount,
          lastActivityDate: new Date().toISOString().split("T")[0],
          history: [
            ...c.history,
            {
              date: new Date().toISOString().split("T")[0],
              action: `Endorsed & moved from Talent Pool to Active Pipeline for ${targetAccount} (${targetPositionRequirement}). Evaluation form matched: ${matchedEvaluationTemplate}. Notes: ${
                moveNotes || "Initiated wave endorsement."
              }`,
              user: userEmail || "Alena Batacan"
            }
          ]
        };
      }
      return c;
    });

    setCandidates(updated);

    const currentLive = updated.find((c) => c.id === selectedCandidate.id);
    if (currentLive) {
      setSelectedCandidate(currentLive);
    }

    setIsMoveModalOpen(false);
    setTargetAccount("");
    setMoveNotes("");
    triggerToast(
      `Pushed ${selectedCandidate.name} to active pipeline wave for ${targetAccount}!`
    );
  };

  return (
    <div className="flex-1 flex flex-col space-y-6 select-none relative" id="talent-pool-root">
      {/* Toast Alert Banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 right-6 bg-[#042C51] border-l-4 border-[#FF5C28] text-white px-5 py-3 rounded-r-xl shadow-2xl z-50 flex items-center gap-3 text-xs font-semibold"
          >
            <CheckCircle className="w-4.5 h-4.5 text-[#FF5C28]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================== 1. TOP ACTION BAR & HEADER ==================== */}
      <section className="bg-white p-5 rounded-2xl border border-[#E6ECF2] shadow-xs flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-[#E9F0FC] text-[#042C51] px-2.5 py-0.5 rounded font-black border border-blue-100 uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#042C51] inline-block animate-pulse"></span>
              Reusable Candidate Repository
            </span>
            <span className="text-[10px] bg-[#FFF0EB] text-[#FF5C28] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
              Talent Pool Master Database
            </span>
          </div>
          <h1 className="text-xl font-black text-[#042C51] tracking-tight">
            Talent Pool / Candidate Database
          </h1>
          <p className="text-xs text-[#667085] leading-normal max-w-4xl">
            Central repository for qualified BPO candidates, public application entries, lead imports, and drop-off restoration. Transfer candidates directly into active PRF requirement pipelines with matched evaluation forms.
          </p>
        </div>

        {/* Action Group */}
        <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto">
          {/* Refresh Action Button */}
          <button
            onClick={() => {
              triggerToast("Database candidate pool synced and validated.");
            }}
            className="p-2 text-slate-600 hover:text-[#042C51] bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer"
            title="Refresh Pool Database"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Public Form Direct Web Link */}
          <button
            onClick={() => setIsPublicFormModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E9F0FC] hover:bg-blue-100 text-[#042C51] text-xs font-bold rounded-lg border border-blue-200 transition-all cursor-pointer"
            title="Open direct external candidate application form portal"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#FF5C28]" />
            <span>Public Application Form</span>
          </button>

          {/* CSV Template Download Action */}
          <button
            onClick={handleDownloadTemplate}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-[#042C51] text-xs font-bold rounded-lg border border-slate-200 transition-all cursor-pointer"
            title="Download standard CSV upload format"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>CSV Template</span>
          </button>

          {/* Hidden File Input for CSV */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleCSVUpload}
            accept=".csv"
            className="hidden"
          />

          {/* Upload CSV Leads Action */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-extrabold rounded-lg border border-emerald-200 transition-all cursor-pointer"
            title="Import candidate lead lists in bulk (.csv)"
          >
            <Upload className="w-3.5 h-3.5 text-emerald-600" />
            <span>Upload CSV Leads</span>
          </button>

          {/* Add Candidate Manual Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#042C51] hover:bg-[#FF5C28] text-white text-xs font-black rounded-lg transition-all cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Candidate</span>
          </button>
        </div>
      </section>

      {/* ==================== 2. SUMMARY STATISTICS BAR (TalentPoolStats) ==================== */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Total Candidates */}
        <div className="bg-white p-4 rounded-xl border border-[#E6ECF2] shadow-xs flex flex-col justify-between space-y-1">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-slate-500 font-bold uppercase">Total Profiles</span>
            <div className="p-1 rounded bg-slate-50">
              <Database className="w-3.5 h-3.5 text-[#042C51]" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-black text-[#042C51] tracking-tight">{metrics.total}</h2>
            <p className="text-[9px] text-slate-400 font-bold">Candidates stored</p>
          </div>
        </div>

        {/* Silver Pool */}
        <div className="bg-white p-4 rounded-xl border border-[#E6ECF2] shadow-xs flex flex-col justify-between space-y-1">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-indigo-600 font-bold uppercase">Silver Pool</span>
            <div className="p-1 rounded bg-indigo-50">
              <Award className="w-3.5 h-3.5 text-indigo-600" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-black text-indigo-600 tracking-tight">{metrics.silver}</h2>
            <p className="text-[9px] text-indigo-500/80 font-bold">Qualified, no opening</p>
          </div>
        </div>

        {/* Recyclable */}
        <div className="bg-white p-4 rounded-xl border border-[#E6ECF2] shadow-xs flex flex-col justify-between space-y-1">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-[#FF5C28] font-bold uppercase">Recyclable</span>
            <div className="p-1 rounded bg-[#FFF0EB]">
              <Clock className="w-3.5 h-3.5 text-[#FF5C28]" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-black text-[#FF5C28] tracking-tight">{metrics.recyclable}</h2>
            <p className="text-[9px] text-orange-500/80 font-bold">Reconsider for wave</p>
          </div>
        </div>

        {/* Do Not Reprocess */}
        <div className="bg-white p-4 rounded-xl border border-[#E6ECF2] shadow-xs flex flex-col justify-between space-y-1">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-rose-600 font-bold uppercase">Do Not Reprocess</span>
            <div className="p-1 rounded bg-rose-50">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-black text-rose-600 tracking-tight">{metrics.block}</h2>
            <p className="text-[9px] text-rose-500/80 font-bold">Unfit / Blacklisted</p>
          </div>
        </div>

        {/* Hired / Active */}
        <div className="bg-white p-4 rounded-xl border border-[#E6ECF2] shadow-xs flex flex-col justify-between space-y-1">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-emerald-600 font-bold uppercase">Hired / Active</span>
            <div className="p-1 rounded bg-emerald-50">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-black text-emerald-600 tracking-tight">{metrics.active}</h2>
            <p className="text-[9px] text-emerald-500/80 font-bold">Placed in operations</p>
          </div>
        </div>

        {/* Public Entries */}
        <div className="bg-white p-4 rounded-xl border border-[#E6ECF2] shadow-xs flex flex-col justify-between space-y-1">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-slate-500 font-bold uppercase">Public Portal</span>
            <div className="p-1 rounded bg-slate-50">
              <User className="w-3.5 h-3.5 text-slate-600" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">{metrics.publicCount}</h2>
            <p className="text-[9px] text-slate-500 font-bold">Public web form leads</p>
          </div>
        </div>
      </div>

      {/* ==================== 3. FILTERS & SEARCH BAR (TalentPoolFilters) ==================== */}
      <CentralizedFilters
        title="Search & Filter Talent Pool Database"
        resetLabel="Reset All Filters"
        onReset={handleClearFilters}
        search={{
          label: "Candidate Lookup",
          placeholder: "Search candidate Name, Primary Email, Phone Number, or SIBS ID...",
          value: searchTerm,
          onChange: (val) => {
            setSearchTerm(val);
            setCurrentPage(1);
          }
        }}
        selects={[
          {
            label: "Current Status",
            value: statusFilter,
            onChange: (val) => {
              setStatusFilter(val);
              setCurrentPage(1);
            },
            options: [
              { label: "All Statuses", value: "All" },
              { label: "New Applicant", value: "New Applicant" },
              { label: "Silver Pool", value: "Silver Pool" },
              { label: "Recyclable", value: "Recyclable" },
              { label: "Do Not Reprocess", value: "Do Not Reprocess" },
              { label: "Hired / Active", value: "Hired / Active" },
              { label: "Initial Screening", value: "Initial Screening" },
              { label: "Drop-off", value: "Drop-off" }
            ]
          },
          {
            label: "Target Position",
            value: positionFilter,
            onChange: (val) => {
              setPositionFilter(val);
              setCurrentPage(1);
            },
            options: [
              { label: `All Applied Positions (${distinctPositions.length})`, value: "All" },
              ...distinctPositions.map((p) => ({ label: p, value: p }))
            ]
          },
          {
            label: "Department",
            value: departmentFilter,
            onChange: (val) => {
              setDepartmentFilter(val);
              setCurrentPage(1);
            },
            options: [
              { label: "All Departments", value: "All" },
              ...distinctDepartments.map((d) => ({ label: d, value: d }))
            ]
          },
          {
            label: "Source Channel",
            value: sourceFilter,
            onChange: (val) => {
              setSourceFilter(val);
              setCurrentPage(1);
            },
            options: [
              { label: "All Sourcing Channels", value: "All" },
              ...distinctSources.map((s) => ({ label: s, value: s }))
            ]
          }
        ]}
        dateFrom={{
          label: "Applied Date From",
          value: dateFromFilter,
          onChange: (val) => setDateFromFilter(val)
        }}
        dateTo={{
          label: "Applied Date To",
          value: dateToFilter,
          onChange: (val) => setDateToFilter(val)
        }}
      />

      {/* ==================== 4. MAIN DATA TABLE (TalentPoolTable) ==================== */}
      <div className="bg-white p-5 rounded-2xl border border-[#E6ECF2] shadow-xs space-y-4">
        {/* Table Notice & Page Stats */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <div>
            <h3 className="text-sm font-black text-[#042C51] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#FF5C28]" />
              Master Candidate Database Registry
            </h3>
            <p className="text-[10px] text-[#667085]">
              Showing{" "}
              <span className="font-bold text-[#FF5C28]">
                {filteredCandidates.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
              </span>{" "}
              to{" "}
              <span className="font-bold text-[#FF5C28]">
                {Math.min(currentPage * itemsPerPage, filteredCandidates.length)}
              </span>{" "}
              of <span className="font-bold text-[#042C51]">{filteredCandidates.length}</span> candidates
            </p>
          </div>

          <span className="text-[10px] text-slate-500 font-mono font-bold bg-slate-100 px-3 py-1 rounded-md border border-slate-200">
            Page {currentPage} of {totalPages}
          </span>
        </div>

        {/* Data Table */}
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-extrabold select-none uppercase text-[10px]">
                  <th className="p-3">Candidate Name & SIBS ID</th>
                  <th className="p-3">Contact Information</th>
                  <th className="p-3">Target Position & Department</th>
                  <th className="p-3">Sourcing & Recruiter</th>
                  <th className="p-3 text-center">Application Date</th>
                  <th className="p-3 text-center">Current Status</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedCandidates.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-slate-400 font-bold">
                      No candidate master records match the active search or filter criteria.
                    </td>
                  </tr>
                ) : (
                  paginatedCandidates.map((cand) => (
                    <tr
                      key={cand.id}
                      onClick={() => {
                        setSelectedCandidate(cand);
                        setActiveProfileTab("personal");
                        setIsProfileModalOpen(true);
                      }}
                      className={`cursor-pointer hover:bg-slate-50 transition-colors ${
                        selectedCandidate?.id === cand.id ? "bg-[#FFF0EB]/60" : ""
                      }`}
                    >
                      {/* Name & ID */}
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-[#042C51] block text-xs hover:underline">
                            {cand.name}
                          </span>
                          {cand.isPublicEntry && (
                            <span className="text-[8px] font-black bg-blue-100 text-[#042C51] px-1.5 py-0.2 rounded uppercase border border-blue-200">
                              Public Entry
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5 text-[9.5px] text-slate-500 font-mono font-bold">
                          <span>{cand.id}</span>
                        </div>
                      </td>

                      {/* Contact Info */}
                      <td className="p-3 space-y-0.5">
                        <div className="flex items-center gap-1 text-slate-700 font-mono font-bold text-[11px]">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span className="truncate max-w-[150px]">{cand.email}</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-500 text-[10px]">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{cand.phone}</span>
                        </div>
                      </td>

                      {/* Target Position & Department */}
                      <td className="p-3">
                        <span className="text-slate-800 font-extrabold block">{cand.appliedPosition}</span>
                        <span className="text-[9.5px] text-slate-500 font-semibold block">
                          Dept: {cand.department || "Customer Operations"}
                        </span>
                        {cand.accountFit && (
                          <span className="text-[9px] font-mono font-bold text-[#042C51] bg-[#E9F0FC] px-1.5 py-0.2 rounded inline-block mt-0.5">
                            Fit: {cand.accountFit}
                          </span>
                        )}
                      </td>

                      {/* Sourcing & Recruiter */}
                      <td className="p-3">
                        <span className="text-slate-700 font-bold block">{cand.sourcingChannel}</span>
                        <span className="text-[9.5px] text-slate-500">Recruiter: {cand.recruiter}</span>
                      </td>

                      {/* Application Date */}
                      <td className="p-3 text-center text-slate-600 font-mono font-bold text-[11px]">
                        {cand.applicationDate}
                      </td>

                      {/* Current Status Badge */}
                      <td className="p-3 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded text-[9.5px] font-black uppercase ${
                            cand.status === "Silver Pool"
                              ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                              : cand.status === "Recyclable"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : cand.status === "Do Not Reprocess"
                              ? "bg-rose-50 text-rose-700 border border-rose-200"
                              : cand.status === "Hired / Active"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : cand.status === "Drop-off"
                              ? "bg-slate-200 text-slate-700 border border-slate-300"
                              : "bg-blue-50 text-blue-700 border border-blue-200"
                          }`}
                        >
                          {cand.status}
                        </span>
                      </td>

                      {/* Action Buttons */}
                      <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1">
                          {/* 👁️ View Profile */}
                          <button
                            onClick={() => {
                              setSelectedCandidate(cand);
                              setActiveProfileTab("personal");
                              setIsProfileModalOpen(true);
                            }}
                            className="p-1.5 text-slate-600 hover:text-[#042C51] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="👁️ View Candidate Master Profile"
                          >
                            <User className="w-4 h-4 text-[#042C51]" />
                          </button>

                          {/* 🚀 Move to Pipeline */}
                          <button
                            onClick={() => {
                              setSelectedCandidate(cand);
                              setTargetAccount(
                                cand.accountFit && cand.accountFit !== "Pending Wave Alignment"
                                  ? cand.accountFit
                                  : "UnitedHealth Group"
                              );
                              setIsMoveModalOpen(true);
                            }}
                            className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                            title="🚀 Endorse & Move to Active Recruitment Pipeline"
                          >
                            <Send className="w-4 h-4 text-emerald-600" />
                          </button>

                          {/* 🔄 Update Status */}
                          <button
                            onClick={() => {
                              setSelectedCandidate(cand);
                              setNewStatus(cand.status);
                              setIsStatusModalOpen(true);
                            }}
                            className="p-1.5 text-slate-600 hover:text-[#FF5C28] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="🔄 Update Candidate Status"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Standard Pagination Controls */}
        <div className="flex items-center justify-between pt-2 select-none">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="flex items-center gap-1 px-3 py-1 text-xs font-bold text-slate-600 hover:text-[#042C51] bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 disabled:opacity-50 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <span className="text-xs text-slate-500 font-semibold">
            Page <strong className="text-[#042C51]">{currentPage}</strong> of{" "}
            <strong className="text-[#042C51]">{totalPages}</strong>
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="flex items-center gap-1 px-3 py-1 text-xs font-bold text-slate-600 hover:text-[#042C51] bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 disabled:opacity-50 transition-colors cursor-pointer"
          >
            <span>Next</span>
            <ChevronsRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ==================== 5. DROP-OFF CANDIDATES SECTION (DropOffListSection) ==================== */}
      <section className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-rose-100 rounded-lg text-rose-700">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">
                Drop-Off Candidates Repository
              </h3>
              <p className="text-[11px] text-slate-500">
                Collects candidates who withdrew, failed assessments, or dropped off during pipeline stages so recruiters can review and restore them into consideration.
              </p>
            </div>
          </div>
          <span className="text-xs font-bold bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded-full">
            {dropOffCandidates.length} Drop-Offs Recorded
          </span>
        </div>

        {dropOffCandidates.length === 0 ? (
          <div className="bg-white p-6 rounded-xl border border-slate-200 text-center text-slate-400 font-semibold text-xs">
            No candidates currently flagged as drop-off.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {dropOffCandidates.map((cand) => (
              <div
                key={cand.id}
                className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-extrabold text-[#042C51]">{cand.name}</h4>
                      <p className="text-[10px] text-slate-500 font-mono">{cand.id} • {cand.appliedPosition}</p>
                    </div>
                    <span className="text-[9px] font-bold bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded">
                      Drop-off Stage
                    </span>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-[11px] space-y-1">
                    <p className="text-slate-700">
                      <strong>Failed/Withdrew Stage:</strong>{" "}
                      <span className="text-rose-700 font-bold">
                        {cand.dropOffDetails?.dropOffStage || "Pipeline Evaluation"}
                      </span>
                    </p>
                    <p className="text-slate-600">
                      <strong>Reason:</strong> {cand.dropOffDetails?.dropOffReason || cand.notes}
                    </p>
                    <p className="text-slate-400 text-[9.5px]">Recorded Date: {cand.dropOffDetails?.date || cand.lastActivityDate}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => {
                      setSelectedCandidate(cand);
                      setActiveProfileTab("personal");
                      setIsProfileModalOpen(true);
                    }}
                    className="text-xs font-bold text-[#042C51] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5" />
                    View Details
                  </button>

                  <button
                    onClick={() => handleRestoreCandidate(cand)}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Restore to Active Pool
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ==================== 6. MODALS ==================== */}

      {/* MODAL 1: CANDIDATE PROFILE VIEW MODAL (CandidateProfileModal) */}
      <CandidateProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        candidate={selectedCandidate}
        onUpdateCandidate={(updated) => {
          setCandidates((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
          setSelectedCandidate(updated);
        }}
        onMoveToPipeline={(cand) => {
          setSelectedCandidate(cand);
          setTargetAccount(cand.accountFit && cand.accountFit !== "Pending Wave Alignment" ? cand.accountFit : "UnitedHealth Group");
          setIsMoveModalOpen(true);
        }}
        onChangeStatus={(cand) => {
          setSelectedCandidate(cand);
          setNewStatus(cand.status);
          setIsStatusModalOpen(true);
        }}
      />

      {/* MODAL 2: ADD CANDIDATE MODAL (AddCandidateModal) */}
      <AddCandidateModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSaveCandidate={(newCandidate) => {
          setCandidates((prev) => [newCandidate, ...prev]);
          triggerToast(`Candidate ${newCandidate.name} added to Talent Pool!`);
        }}
        userEmail={userEmail}
      />

      {/* MODAL 3: MOVE TO PIPELINE MODAL (MoveToPipelineModal) */}
      <AnimatePresence>
        {isMoveModalOpen && selectedCandidate && (
          <div className="fixed inset-0 bg-[#042C51]/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden text-slate-900"
            >
              <div className="p-4 bg-[#042C51] text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Send className="w-5 h-5 text-[#FF5C28]" />
                  <div>
                    <h2 className="text-sm font-black">Move Candidate to Active Pipeline</h2>
                    <p className="text-[10px] text-slate-300">Endorse {selectedCandidate.name} to active PRF position requirement</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMoveModalOpen(false)}
                  className="p-1 rounded-lg bg-white/10 hover:bg-white/25 text-white cursor-pointer"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              <form onSubmit={handleMoveSubmit} className="p-6 space-y-4 text-xs">
                {/* Position Selection */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Target Active PRF Requirement Position *</label>
                  <select
                    value={targetPositionRequirement}
                    onChange={(e) => {
                      setTargetPositionRequirement(e.target.value);
                      if (e.target.value.includes("Healthcare")) {
                        setMatchedEvaluationTemplate("Healthcare Voice & Terminology Assessment Standard");
                      } else if (e.target.value.includes("Tech")) {
                        setMatchedEvaluationTemplate("Technical Debugging & Network Troubleshooting Form");
                      } else {
                        setMatchedEvaluationTemplate("Customer Care Communication & Empathy Standard");
                      }
                    }}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800"
                  >
                    <option value="Healthcare Support Specialist (PRF-2026-041)">Healthcare Support Specialist (PRF-2026-041)</option>
                    <option value="Technical Support Associate (PRF-2026-042)">Technical Support Associate (PRF-2026-042)</option>
                    <option value="Financial Account Expert (PRF-2026-043)">Financial Account Expert (PRF-2026-043)</option>
                  </select>
                </div>

                {/* Interview Form Matching */}
                <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-200 text-xs space-y-1">
                  <span className="text-[9.5px] font-extrabold text-blue-900 uppercase block">
                    ✓ Matched Interview Evaluation Form
                  </span>
                  <p className="font-bold text-[#042C51]">{matchedEvaluationTemplate}</p>
                  <p className="text-[10px] text-slate-600">
                    Automatically pairs candidate with this assessment rubric when transferred into pipeline.
                  </p>
                </div>

                {/* Target Corporate Client Account */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Target Corporate Client Account *</label>
                  <input
                    type="text"
                    required
                    value={targetAccount}
                    onChange={(e) => setTargetAccount(e.target.value)}
                    placeholder="e.g. UnitedHealth Group"
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold font-mono text-slate-800"
                  />
                </div>

                {/* Endorsement Notes */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Endorsement Remarks for Hiring Team</label>
                  <textarea
                    rows={2}
                    value={moveNotes}
                    onChange={(e) => setMoveNotes(e.target.value)}
                    placeholder="Provide endorsement notes regarding candidate competencies..."
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 resize-none"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsMoveModalOpen(false)}
                    className="px-3 py-1.5 bg-slate-100 text-slate-700 font-bold rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-lg cursor-pointer"
                  >
                    Initiate Endorsement
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 4: UPDATE STATUS MODAL (UpdateStatusModal) */}
      <AnimatePresence>
        {isStatusModalOpen && selectedCandidate && (
          <div className="fixed inset-0 bg-[#042C51]/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden text-slate-900"
            >
              <div className="p-4 bg-[#042C51] text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tag className="w-5 h-5 text-[#FF5C28]" />
                  <div>
                    <h2 className="text-sm font-black">Update Candidate Status</h2>
                    <p className="text-[10px] text-slate-300">Modifying classification status for {selectedCandidate.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsStatusModalOpen(false)}
                  className="p-1 rounded-lg bg-white/10 hover:bg-white/25 text-white cursor-pointer"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              <form onSubmit={handleStatusSubmit} className="p-6 space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Current Status</label>
                  <p className="font-extrabold text-[#042C51] bg-slate-100 p-2 rounded-lg border border-slate-200">
                    {selectedCandidate.status}
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">New Target Status Category *</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as Candidate["status"])}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800"
                  >
                    <option value="New Applicant">New Applicant</option>
                    <option value="Silver Pool">Silver Pool (Passed, waiting slots)</option>
                    <option value="Recyclable">Recyclable (Re-evaluate later)</option>
                    <option value="Do Not Reprocess">Do Not Reprocess (Unfit / Failed BGC)</option>
                    <option value="Hired / Active">Hired / Active (Placed)</option>
                    <option value="Initial Screening">Initial Screening</option>
                    <option value="Drop-off">Drop-off (Withdrawn / Failed)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Update Notes / Audit Remarks</label>
                  <textarea
                    rows={2}
                    value={statusChangeRemarks}
                    onChange={(e) => setStatusChangeRemarks(e.target.value)}
                    placeholder="Enter status update remarks..."
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 resize-none"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsStatusModalOpen(false)}
                    className="px-3 py-1.5 bg-slate-100 text-slate-700 font-bold rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-[#042C51] hover:bg-[#FF5C28] text-white font-black rounded-lg cursor-pointer"
                  >
                    Confirm Status Change
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 5: PUBLIC APPLICATION WEB FORM MODAL */}
      <AnimatePresence>
        {isPublicFormModalOpen && (
          <div className="fixed inset-0 bg-[#042C51]/90 backdrop-blur-md z-50 overflow-y-auto">
            <div className="relative min-h-screen bg-[#F4F7FB]">
              <PublicTalentPoolApplicationPage
                onAddCandidate={(newCand) => {
                  setCandidates((prev) => [newCand, ...prev]);
                  triggerToast(`Public application received from ${newCand.name}!`);
                }}
                onNavigateToTalentPool={() => setIsPublicFormModalOpen(false)}
              />
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
