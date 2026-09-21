import React, { useState, useMemo } from "react";
import CentralizedFilters from "./CentralizedFilters";
import { 
  ChevronLeft, 
  Edit3, 
  Check, 
  X, 
  Upload, 
  Download, 
  Trash2, 
  FileText, 
  Plus, 
  Phone, 
  Mail, 
  MapPin, 
  Briefcase, 
  Calendar, 
  GraduationCap, 
  Award, 
  BookOpen, 
  Heart, 
  Shield, 
  Activity, 
  FileCheck, 
  ExternalLink, 
  File, 
  MoreVertical, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  Smartphone,
  Monitor,
  Tablet,
  FileCheck2,
  Lock,
  User,
  Clock,
  PlusCircle,
  Users,
  Search,
  Filter,
  ArrowRight,
  UserCheck,
  Building2,
  ChevronRight
} from "lucide-react";

// ==========================================
// TYPES DEFINITIONS
// ==========================================
export interface EmployeeData {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  nameExtension: string;
  preferredName: string;
  birthDate: string;
  placeOfBirth: string;
  gender: string;
  civilStatus: string;
  citizenship: string;
  bloodType: string;
  height: string;
  weight: string;

  // Contact
  email: string;
  mobileNumber: string;
  telephone: string;

  // Address
  residentialAddress: string;
  permanentAddress: string;
  workSetup: "Onsite" | "Hybrid" | "Remote";

  // Government IDs
  gsis: string;
  sss: string;
  philhealth: string;
  pagibig: string;
  tin: string;

  // Header Context
  department: string;
  position: string;
  sibsId: string;
  status: "Active" | "Inactive" | "Suspended";
  hireDate: string;
  account: string;
  location: string;

  // Family
  spouse: {
    surname: string;
    firstName: string;
    middleName: string;
    occupation: string;
    employer: string;
    telephone: string;
    businessAddress: string;
  };
  father: {
    surname: string;
    firstName: string;
    middleName: string;
  };
  mother: {
    maidenSurname: string;
    firstName: string;
    middleName: string;
  };
  children: { id: string; name: string; birthDate: string }[];
  emergencyContact: {
    name: string;
    relationship: string;
    phoneNumber: string;
    email: string;
  };

  // Education
  education: {
    id: string;
    level: "Elementary" | "Secondary" | "Vocational" | "College" | "Graduate Studies";
    schoolName: string;
    degreeCourse: string;
    fromYear: string;
    toYear: string;
    highestLevelUnits: string;
    yearGraduated: string;
    honorsReceived: string;
  }[];

  // Eligibility
  eligibility: {
    id: string;
    licenseName: string;
    rating: string;
    examDate: string;
    examPlace: string;
    licenseNumber: string;
    validityDate: string;
  }[];

  // Experience
  experience: {
    id: string;
    from: string;
    to: string;
    positionTitle: string;
    company: string;
    monthlySalary: string;
    salaryGrade: string;
    statusOfAppointment: string;
    govService: "Y" | "N";
    duties: string;
  }[];

  // Training
  training: {
    id: string;
    title: string;
    from: string;
    to: string;
    hours: number;
    typeOfLd: string;
    sponsoredBy: string;
  }[];

  // Skills & Awards
  skills: string[];
  recognitions: string[];
  organizations: string[];

  // References
  references: {
    id: string;
    name: string;
    address: string;
    telephone: string;
  }[];

  // Application
  application: {
    overview: string;
    pipeline: string;
    assessment: { subject: string; score: string }[];
    statusHistory: {
      id: string;
      date: string;
      status: string;
      stage: string;
      remarks: string;
    }[];
  };

  // Documents
  documents: {
    id: string;
    name: string;
    type: string;
    size: string;
    uploadedAt: string;
    uploadedBy: string;
  }[];

  // Notes
  notes: string;
}

// ==========================================
// INITIAL REALISTIC DATA FOR ALENA BATACAN
// ==========================================
const INITIAL_ALENA_DATA: EmployeeData = {
  id: "emp-101",
  firstName: "Alena",
  middleName: "Mendoza",
  lastName: "Batacan",
  nameExtension: "",
  preferredName: "Aly",
  birthDate: "1994-11-23",
  placeOfBirth: "Manila, Philippines",
  gender: "Female",
  civilStatus: "Married",
  citizenship: "Filipino",
  bloodType: "O+",
  height: "162 cm",
  weight: "54 kg",

  // Contact
  email: "alena.batacan@thesiblingssolutions.com",
  mobileNumber: "+63 917 555 1234",
  telephone: "+63 2 8123 4567",

  // Address
  residentialAddress: "Block 12 Lot 15, Springvale Subd., Brgy. San Isidro, Antipolo City, Rizal",
  permanentAddress: "Block 12 Lot 15, Springvale Subd., Brgy. San Isidro, Antipolo City, Rizal",
  workSetup: "Hybrid",

  // Government IDs
  gsis: "12-3456789-0",
  sss: "34-5678901-2",
  philhealth: "12-003456789-4",
  pagibig: "1210-3456-7890",
  tin: "123-456-789-000",

  // Header Context
  department: "Workforce Management (WFM)",
  position: "Sr. WFM Specialist / Team Lead",
  sibsId: "SIBS-ID-2024-819",
  status: "Active",
  hireDate: "2024-03-01",
  account: "Verizon Tech",
  location: "Manila Corporate HQ",

  // Family
  spouse: {
    surname: "Batacan",
    firstName: "Roberto",
    middleName: "Santiago",
    occupation: "Software Engineer",
    employer: "TechSolutions Inc.",
    telephone: "+63 918 444 5678",
    businessAddress: "12F Cyberpod One, Ortigas Center, Pasig City"
  },
  father: {
    surname: "Mendoza",
    firstName: "Guillermo",
    middleName: "Santos"
  },
  mother: {
    maidenSurname: "Santos",
    firstName: "Maria Clara",
    middleName: "Reyes"
  },
  children: [
    { id: "c-1", name: "Sophia Batacan", birthDate: "2020-04-12" },
    { id: "c-2", name: "Liam Batacan", birthDate: "2023-09-05" }
  ],
  emergencyContact: {
    name: "Roberto Batacan",
    relationship: "Spouse",
    phoneNumber: "+63 918 444 5678",
    email: "roberto@techsolutions.com"
  },

  // Education
  education: [
    {
      id: "edu-1",
      level: "College",
      schoolName: "University of the Philippines Diliman",
      degreeCourse: "BS Business Administration",
      fromYear: "2012",
      toYear: "2016",
      highestLevelUnits: "Graduated",
      yearGraduated: "2016",
      honorsReceived: "Cum Laude"
    },
    {
      id: "edu-2",
      level: "Secondary",
      schoolName: "Antipolo National High School",
      degreeCourse: "High School Diploma",
      fromYear: "2008",
      toYear: "2012",
      highestLevelUnits: "Graduated",
      yearGraduated: "2012",
      honorsReceived: "Valedictorian"
    }
  ],

  // Eligibility
  eligibility: [
    {
      id: "el-1",
      licenseName: "Civil Service Professional Eligible",
      rating: "86.4%",
      examDate: "2017-05-14",
      examPlace: "Quezon City",
      licenseNumber: "CS-2017-0489",
      validityDate: "Lifetime"
    }
  ],

  // Experience
  experience: [
    {
      id: "exp-1",
      from: "2024-03-01",
      to: "Present",
      positionTitle: "Sr. WFM Specialist / Team Lead",
      company: "The Siblings Solutions (SiBS)",
      monthlySalary: "₱68,000",
      salaryGrade: "Grade 8",
      statusOfAppointment: "Permanent",
      govService: "N",
      duties: "Lead the real-time scheduling, forecasting, and seat allocation for telecom and healthcare accounts. Conduct risk assessment on absenteeism."
    },
    {
      id: "exp-2",
      from: "2019-06-15",
      to: "2024-02-28",
      positionTitle: "WFM Scheduler",
      company: "Sykes Philippines",
      monthlySalary: "₱42,000",
      salaryGrade: "Grade 5",
      statusOfAppointment: "Permanent",
      govService: "N",
      duties: "Monitored queue management and generated performance reporting for international travel accounts."
    }
  ],

  // Training
  training: [
    {
      id: "tr-1",
      title: "Advanced Workforce Forecasting & Capacity Planning",
      from: "2024-04-10",
      to: "2024-04-14",
      hours: 40,
      typeOfLd: "Technical",
      sponsoredBy: "Society of Workforce Planning Professionals (SWPP)"
    },
    {
      id: "tr-2",
      title: "Agile Leadership and Team Synergies",
      from: "2025-02-18",
      to: "2025-02-20",
      hours: 24,
      typeOfLd: "Leadership",
      sponsoredBy: "SiBS Leadership Institute"
    }
  ],

  // Skills
  skills: [
    "Workforce Forecasting",
    "Queue Theory (Erlang C)",
    "Capacity Planning",
    "Recharts & Data Visualization",
    "Excel Advanced",
    "SQL Database Querying"
  ],
  recognitions: [
    "SiBS WFM Expert of the Year (2025)",
    "Perfect Attendance Award (Q1 2026)"
  ],
  organizations: [
    "Philippine Society of WFM Professionals (Active Member)",
    "UP Alumni Association"
  ],

  // References
  references: [
    {
      id: "ref-1",
      name: "Michael Corpuz",
      address: "WFM Director, SiBS HR",
      telephone: "+63 919 123 4567"
    },
    {
      id: "ref-2",
      name: "Sarah Jenkins",
      address: "WFM Principal Advisor",
      telephone: "+63 920 987 6543"
    }
  ],

  // Application
  application: {
    overview: "Recruited via Direct Headhunting for the Lead WFM vacancy to support the expansion of the Healthcare & Ins. cluster.",
    pipeline: "Vetting Complete",
    assessment: [
      { subject: "WFM Technical Case Study", score: "98/100" },
      { subject: "Aptitude & Logical Reasoning", score: "94/100" },
      { subject: "Leadership Assessment Panel", score: "92/100" }
    ],
    statusHistory: [
      { id: "h-4", date: "2024-01-28", status: "Hired", stage: "Job Offer", remarks: "Offer accepted. Onboarding set for March 1, 2024." },
      { id: "h-3", date: "2024-01-20", status: "Passed", stage: "Interview Panel", remarks: "Endorsed by WFM leadership. High situational aptitude." },
      { id: "h-2", date: "2024-01-15", status: "Completed", stage: "Technical Assessment", remarks: "Case study score 98/100. Excellent Erlang C logic." },
      { id: "h-1", date: "2024-01-10", status: "Applied", stage: "Sourcing / Screening", remarks: "CV reviewed and endorsed for technical interview." }
    ]
  },

  // Documents
  documents: [
    { id: "doc-1", name: "COE_Sykes_Batacan.pdf", type: "PDF", size: "1.8 MB", uploadedAt: "2024-03-01", uploadedBy: "Alena Batacan" },
    { id: "doc-2", name: "TIN_Verification_Slip.pdf", type: "PDF", size: "850 KB", uploadedAt: "2024-03-02", uploadedBy: "System Admin" },
    { id: "doc-3", name: "NBI_Clearance_2026.pdf", type: "PDF", size: "2.1 MB", uploadedAt: "2026-01-15", uploadedBy: "Alena Batacan" }
  ],

  // Notes
  notes: "Highly dedicated team member with zero escalations since joining. Selected for the WFM Lead position for her remarkable capacity to balance roster requirements with agent preferences."
};

// ==========================================
// MOCK DIRECTORY DATABASE RECORDS
// ==========================================
export const MOCK_EMPLOYEES = [
  {
    id: "emp-101",
    sibsId: "SIBS-ID-2024-819",
    firstName: "Alena",
    middleName: "Mendoza",
    lastName: "Batacan",
    preferredName: "Aly",
    email: "alena.batacan@thesiblingssolutions.com",
    gender: "Female",
    birthDate: "1994-11-23",
    civilStatus: "Married",
    account: "Verizon Tech",
    site: "Manila Corporate HQ",
    accountManager: "Michael Corpuz",
    department: "Workforce Management (WFM)",
    position: "Sr. WFM Specialist / Team Lead",
    contact: "+63 917 555 1234",
    hireDate: "2024-03-01",
    status: "Active"
  },
  {
    id: "emp-102",
    sibsId: "SIBS-ID-2023-442",
    firstName: "Roberto",
    middleName: "Santiago",
    lastName: "Batacan",
    preferredName: "Rob",
    email: "roberto.batacan@thesiblingssolutions.com",
    gender: "Male",
    birthDate: "1992-05-14",
    civilStatus: "Married",
    account: "Internal Systems",
    site: "Manila Corporate HQ",
    accountManager: "Sarah Jenkins",
    department: "Information Technology (IT)",
    position: "Senior Software Engineer",
    contact: "+63 918 444 5678",
    hireDate: "2023-08-16",
    status: "Active"
  },
  {
    id: "emp-103",
    sibsId: "SIBS-ID-2025-104",
    firstName: "Maria Clara",
    middleName: "Reyes",
    lastName: "Santos",
    preferredName: "Clara",
    email: "clara.santos@thesiblingssolutions.com",
    gender: "Female",
    birthDate: "1996-08-10",
    civilStatus: "Single",
    account: "Comcast Technical",
    site: "Ortigas Site",
    accountManager: "Michael Corpuz",
    department: "Operations",
    position: "Customer Support Advocate",
    contact: "+63 915 222 3456",
    hireDate: "2025-01-10",
    status: "Active"
  },
  {
    id: "emp-104",
    sibsId: "SIBS-ID-2022-012",
    firstName: "Michael",
    middleName: "Valeriano",
    lastName: "Corpuz",
    preferredName: "Mike",
    email: "michael.corpuz@thesiblingssolutions.com",
    gender: "Male",
    birthDate: "1988-12-04",
    civilStatus: "Married",
    account: "Global WFM",
    site: "Manila Corporate HQ",
    accountManager: "Sarah Jenkins",
    department: "Workforce Management (WFM)",
    position: "WFM Director",
    contact: "+63 919 123 4567",
    hireDate: "2022-04-01",
    status: "Active"
  },
  {
    id: "emp-105",
    sibsId: "SIBS-ID-2025-991",
    firstName: "Juan",
    middleName: "Dela",
    lastName: "Cruz",
    preferredName: "Juan",
    email: "juan.delacruz@thesiblingssolutions.com",
    gender: "Male",
    birthDate: "1995-07-21",
    civilStatus: "Single",
    account: "Aetna Core",
    site: "Quezon City Hub",
    accountManager: "Alena Batacan",
    department: "Healthcare Operations",
    position: "Medical Intake Specialist",
    contact: "+63 917 888 9911",
    hireDate: "2025-03-15",
    status: "Active"
  },
  {
    id: "emp-106",
    sibsId: "SIBS-ID-2021-002",
    firstName: "Sarah",
    middleName: "Marie",
    lastName: "Jenkins",
    preferredName: "Sarah",
    email: "sarah.jenkins@thesiblingssolutions.com",
    gender: "Female",
    birthDate: "1985-02-18",
    civilStatus: "Married",
    account: "Executive Suite",
    site: "Manila Corporate HQ",
    accountManager: "Board of Directors",
    department: "HR & Admin",
    position: "VP of Human Resources",
    contact: "+63 920 987 6543",
    hireDate: "2021-09-01",
    status: "Active"
  }
];

export const MOCK_ACCESS_REQUESTS = [
  {
    id: "REQ-2026-904",
    employeeName: "Juan Dela Cruz",
    areaRequested: "Quezon City Hub - 5th Floor Server Room Biometric Access",
    status: "Pending",
    requestedDate: "2026-07-20"
  },
  {
    id: "REQ-2026-903",
    employeeName: "Maria Clara Santos",
    areaRequested: "Ortigas Site - Parking Gate RFID Badge Access",
    status: "Approved",
    requestedDate: "2026-07-19"
  },
  {
    id: "REQ-2026-902",
    employeeName: "Alena Batacan",
    areaRequested: "Manila Corporate HQ - Executive Boardroom Access",
    status: "Approved",
    requestedDate: "2026-07-18"
  },
  {
    id: "REQ-2026-901",
    employeeName: "Roberto Batacan",
    areaRequested: "Manila Corporate HQ - Production VPC SSH Key Authorization",
    status: "Pending",
    requestedDate: "2026-07-20"
  }
];

export const MOCK_CHWCP_RECORDS = [
  {
    id: "CHWCP-101",
    employeeName: "Alena Batacan",
    apeStatus: "Certified (Fit to Work)",
    drugTest: "Negative",
    certificateNumber: "CHWCP-2026-819",
    expiryDate: "2027-03-01"
  },
  {
    id: "CHWCP-102",
    employeeName: "Roberto Batacan",
    apeStatus: "Certified (Fit to Work)",
    drugTest: "Negative",
    certificateNumber: "CHWCP-2026-442",
    expiryDate: "2027-08-16"
  },
  {
    id: "CHWCP-103",
    employeeName: "Maria Clara Santos",
    apeStatus: "Pending (Chest X-Ray Retake)",
    drugTest: "Negative",
    certificateNumber: "CHWCP-2026-104",
    expiryDate: "2026-10-10"
  },
  {
    id: "CHWCP-104",
    employeeName: "Juan Dela Cruz",
    apeStatus: "Certified (Fit to Work)",
    drugTest: "Negative",
    certificateNumber: "CHWCP-2026-991",
    expiryDate: "2027-03-15"
  }
];

export const generateEmployeeProfile = (base: EmployeeData, info: typeof MOCK_EMPLOYEES[0]): EmployeeData => {
  return {
    ...base,
    id: info.id,
    firstName: info.firstName,
    middleName: info.middleName,
    lastName: info.lastName,
    sibsId: info.sibsId,
    preferredName: info.preferredName,
    email: info.email,
    gender: info.gender,
    birthDate: info.birthDate,
    civilStatus: info.civilStatus,
    account: info.account,
    location: info.site,
    department: info.department,
    position: info.position,
    mobileNumber: info.contact,
    hireDate: info.hireDate,
    status: info.status as any,
    emergencyContact: {
      ...base.emergencyContact,
      name: info.id === "emp-101" ? "Roberto Batacan" : "Alena Batacan",
    },
    experience: [
      {
        id: "exp-custom-1",
        from: info.hireDate,
        to: "Present",
        positionTitle: info.position,
        company: "The Siblings Solutions (SiBS)",
        monthlySalary: info.id === "emp-101" ? "₱68,000" : "₱55,000",
        salaryGrade: "Grade 6",
        statusOfAppointment: "Permanent",
        govService: "N",
        duties: `Responsibilities inside the ${info.department} department as a ${info.position}.`
      },
      ...base.experience.slice(1)
    ]
  };
};

interface EmployeeDirectoryProps {
  onBackToDashboard?: () => void;
  initialScenario?: number;
  simulatedDevice?: "desktop" | "tablet" | "mobile";
  onChangeDeviceView?: (view: "desktop" | "tablet" | "mobile") => void;
}

export default function EmployeeDirectory({ 
  onBackToDashboard,
  initialScenario = 1,
  simulatedDevice = "desktop",
  onChangeDeviceView
}: EmployeeDirectoryProps) {
  // Current active profile data state
  const [employee, setEmployee] = useState<EmployeeData>(INITIAL_ALENA_DATA);
  const [tempEmployee, setTempEmployee] = useState<EmployeeData>(INITIAL_ALENA_DATA);
  const [isEditing, setIsEditing] = useState(false);

  // Active Main Topic Tab
  const [activeTab, setActiveTab] = useState<
    "Personal" | "Family" | "Education" | "Eligibility" | "Experience" | "Training" | "Skills" | "References" | "Application" | "Documents" | "Notes"
  >("Personal");

  // Subtopic Sub-tabs (depending on the active main tab)
  const [activeSubtopic, setActiveSubtopic] = useState<string>("Basic Info");

  // Notifications feedback states
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Document upload state Simulation
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  // New Child input state simulation
  const [newChildName, setNewChildName] = useState("");
  const [newChildBirth, setNewChildBirth] = useState("");

  // Directory & Navigation states
  const [viewingEmployeeId, setViewingEmployeeId] = useState<string | null>(null);
  const [directoryTab, setDirectoryTab] = useState<"employees" | "access" | "chwcp">("employees");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("All Departments");
  const [selectedAcc, setSelectedAcc] = useState("All Accounts");

  const handleViewEmployee = (empId: string) => {
    const info = MOCK_EMPLOYEES.find(e => e.id === empId);
    if (info) {
      const fullProfile = generateEmployeeProfile(INITIAL_ALENA_DATA, info);
      setEmployee(fullProfile);
      setTempEmployee(fullProfile);
      setNotesDraft(fullProfile.notes);
      setViewingEmployeeId(empId);
      showToast(`Loading 201 File Dossier: ${info.lastName.toUpperCase()}, ${info.firstName}`);
    }
  };

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Switch tabs & trigger correct subtopics automatically
  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    if (tab === "Personal") setActiveSubtopic("Basic Info");
    else if (tab === "Family") setActiveSubtopic("Spouse");
    else if (tab === "Skills") setActiveSubtopic("Skills");
    else if (tab === "Application") setActiveSubtopic("Overview");
    else setActiveSubtopic("");
  };

  // Screen scenario helper - configures states immediately
  const triggerScenario = (scenarioId: number) => {
    setIsEditing(false);
    if (onChangeDeviceView) onChangeDeviceView("desktop");

    switch(scenarioId) {
      case 1: // 1. Redesigned Personal > Basic Info view
        setActiveTab("Personal");
        setActiveSubtopic("Basic Info");
        setIsEditing(false);
        break;
      case 2: // 2. Redesigned Personal > Basic Info edit mode
        setActiveTab("Personal");
        setActiveSubtopic("Basic Info");
        setTempEmployee({ ...employee });
        setIsEditing(true);
        break;
      case 3: // 3. Education section
        setActiveTab("Education");
        setActiveSubtopic("");
        break;
      case 4: // 4. Experience section
        setActiveTab("Experience");
        setActiveSubtopic("");
        break;
      case 5: // 5. Application > Status History
        setActiveTab("Application");
        setActiveSubtopic("Status History");
        break;
      case 6: // 6. Documents section
        setActiveTab("Documents");
        setActiveSubtopic("");
        break;
      case 7: // 7. Mobile responsive version
        setActiveTab("Personal");
        setActiveSubtopic("Basic Info");
        if (onChangeDeviceView) {
          onChangeDeviceView("mobile");
        }
        break;
    }
    showToast(`Triggered Scenario ${scenarioId}: ${getScenarioName(scenarioId)}`, "success");
  };

  const getScenarioName = (id: number) => {
    switch(id) {
      case 1: return "Personal > Basic Info (Read Mode)";
      case 2: return "Personal > Basic Info (Edit Mode)";
      case 3: return "Education History View";
      case 4: return "Experience Timeline";
      case 5: return "Application > Status History Timeline";
      case 6: return "Documents File Management";
      case 7: return "Mobile Responsive Simulation";
      default: return "";
    }
  };

  // Editable Form handler for simple input updates
  const handleInputChange = (path: string, value: any) => {
    setTempEmployee(prev => {
      const keys = path.split(".");
      if (keys.length === 1) {
        return { ...prev, [keys[0]]: value };
      } else if (keys.length === 2) {
        const key1 = keys[0] as keyof EmployeeData;
        const key2 = keys[1];
        const subObj = prev[key1] as any;
        return {
          ...prev,
          [key1]: { ...subObj, [key2]: value }
        };
      }
      return prev;
    });
  };

  // Save changes
  const saveProfileData = () => {
    setEmployee(tempEmployee);
    setIsEditing(false);
    showToast("Employee Profile records updated successfully!");
  };

  // Cancel edit mode
  const cancelEditing = () => {
    setTempEmployee(employee);
    setIsEditing(false);
    showToast("Editing cancelled. Retained original data.", "error");
  };

  // Documents Mock Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const simulateFileUpload = (fileName: string) => {
    setUploadProgress(10);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev === null) return null;
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            const newDoc = {
              id: `doc-${Date.now()}`,
              name: fileName || "Onboarding_Compliance_Form.pdf",
              type: "PDF",
              size: "1.4 MB",
              uploadedAt: new Date().toISOString().split("T")[0],
              uploadedBy: "Alena Batacan"
            };
            setEmployee(prevEmp => ({
              ...prevEmp,
              documents: [newDoc, ...prevEmp.documents]
            }));
            setUploadProgress(null);
            showToast("Document attached and encrypted securely.");
          }, 300);
          return 100;
        }
        return prev + 30;
      });
    }, 150);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      simulateFileUpload(e.dataTransfer.files[0].name);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      simulateFileUpload(e.target.files[0].name);
    }
  };

  const deleteDocument = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete file "${name}" permanently from this record?`)) {
      setEmployee(prev => ({
        ...prev,
        documents: prev.documents.filter(d => d.id !== id)
      }));
      showToast("Document removed successfully.", "error");
    }
  };

  // Notes Save Handler
  const [notesDraft, setNotesDraft] = useState(employee.notes);
  const saveNotes = () => {
    setEmployee(prev => ({ ...prev, notes: notesDraft }));
    showToast("Private notes committed to dossier.");
  };

  // Compute profile completion percentage
  const profileCompletionScore = useMemo(() => {
    let score = 75; // Baseline
    if (employee.spouse?.surname) score += 5;
    if (employee.education.length > 0) score += 5;
    if (employee.experience.length > 0) score += 5;
    if (employee.eligibility.length > 0) score += 5;
    if (employee.documents.length > 3) score += 5;
    return Math.min(100, score);
  }, [employee]);

  // Compute metrics dynamically
  const totalEmployeesCount = MOCK_EMPLOYEES.length;
  const pendingRequestsCount = MOCK_ACCESS_REQUESTS.filter(r => r.status === "Pending").length;
  const certifiedChwcpCount = MOCK_CHWCP_RECORDS.filter(c => c.apeStatus.includes("Certified")).length;

  const filteredEmployees = useMemo(() => {
    return MOCK_EMPLOYEES.filter(emp => {
      const fullName = `${emp.lastName}, ${emp.firstName} ${emp.middleName}`.toLowerCase();
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        fullName.includes(query) || 
        emp.sibsId.toLowerCase().includes(query) ||
        emp.position.toLowerCase().includes(query) ||
        emp.email.toLowerCase().includes(query);
        
      const matchesDept = selectedDept === "All Departments" || emp.department === selectedDept;
      const matchesAcc = selectedAcc === "All Accounts" || emp.account === selectedAcc;
      
      return matchesSearch && matchesDept && matchesAcc;
    });
  }, [searchQuery, selectedDept, selectedAcc]);

  const filteredAccessRequests = useMemo(() => {
    return MOCK_ACCESS_REQUESTS.filter(req => {
      const query = searchQuery.toLowerCase();
      return (
        req.id.toLowerCase().includes(query) ||
        req.employeeName.toLowerCase().includes(query) ||
        req.areaRequested.toLowerCase().includes(query)
      );
    });
  }, [searchQuery]);

  const filteredCHWCP = useMemo(() => {
    return MOCK_CHWCP_RECORDS.filter(rec => {
      const query = searchQuery.toLowerCase();
      return (
        rec.id.toLowerCase().includes(query) ||
        rec.employeeName.toLowerCase().includes(query) ||
        rec.certificateNumber.toLowerCase().includes(query)
      );
    });
  }, [searchQuery]);

  if (viewingEmployeeId) {
    return (
      <div className="w-full text-[#101828] select-none">
        
        {/* Toast Feedback */}
        {toast && (
          <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border transition-all duration-300 transform translate-y-0 ${
            toast.type === "success" 
              ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
              : "bg-orange-50 text-orange-800 border-orange-200"
          }`}>
            <div className={`w-2 h-2 rounded-full ${toast.type === "success" ? "bg-emerald-500 animate-ping" : "bg-orange-500 animate-pulse"}`}></div>
            <span className="text-xs font-bold">{toast.message}</span>
          </div>
        )}
  
        {/* ==================== TOP UTILITY ROW ==================== */}
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={() => setViewingEmployeeId(null)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#E6ECF2] hover:bg-slate-50 text-[#042C51] text-xs font-bold transition-all shadow-sm"
          >
            <ChevronLeft className="w-4 h-4 text-[#FF5C28]" />
            <span>Back to Employees</span>
          </button>

        {/* Breadcrumb indicator */}
        <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-semibold text-[#667085]">
          <span className="hover:text-[#042C51] cursor-pointer">SiBS HRIS Portal</span>
          <span>/</span>
          <span className="hover:text-[#042C51] cursor-pointer">Employee Directory</span>
          <span>/</span>
          <span className="text-[#042C51] font-black">{employee.lastName.toUpperCase()}, {employee.firstName.toUpperCase()}</span>
        </div>
      </div>

      {/* ==================== COMPACT EMPLOYEE SUMMARY HEADER ==================== */}
      <div className="bg-white p-4 rounded-2xl border border-[#E6ECF2] shadow-sm mb-6 relative overflow-hidden">
        {/* Subtle accent border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#042C51] via-[#FF5C28] to-[#042C51]"></div>
        
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-5 mt-1">
          {/* Main info block */}
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#042C51] to-[#084782] flex items-center justify-center text-white text-xl font-extrabold shadow-md relative">
              {employee.firstName.slice(0,1)}{employee.lastName.slice(0,1)}
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center" title="Active Account">
                <span className="w-1.5 h-1.5 rounded-full bg-white block"></span>
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-lg font-black text-[#042C51] tracking-tight">
                  {employee.lastName.toUpperCase()}, {employee.firstName} {employee.middleName}
                </h2>
                <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 block"></span>
                  {employee.status}
                </span>
                <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase bg-[#E9F0FC] text-[#042C51] border border-blue-100 rounded-full">
                  {employee.sibsId}
                </span>
              </div>

              <p className="text-xs font-semibold text-[#FF5C28] mt-0.5">{employee.position}</p>
              
              {/* Core attributes block */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 text-[10px] text-[#667085] font-semibold mt-2">
                <span className="flex items-center gap-1"><Briefcase className="w-3 h-3 text-[#042C51]" /> {employee.department}</span>
                <span className="hidden md:inline text-slate-300">•</span>
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-[#042C51]" /> Hired: {employee.hireDate}</span>
                <span className="hidden md:inline text-slate-300">•</span>
                <span className="flex items-center gap-1"><FileCheck className="w-3 h-3 text-[#042C51]" /> Account: {employee.account}</span>
                <span className="hidden md:inline text-slate-300">•</span>
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-[#042C51]" /> {employee.location}</span>
              </div>
            </div>
          </div>

          {/* Header Action states */}
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <button 
                  onClick={saveProfileData}
                  className="flex items-center gap-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-black transition-all shadow-sm"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Profile</span>
                </button>
                <button 
                  onClick={cancelEditing}
                  className="flex items-center gap-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-[#667085] rounded-lg text-xs font-black transition-all"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Cancel</span>
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => {
                    setTempEmployee({ ...employee });
                    setIsEditing(true);
                    showToast("Switched to Profile Editing Mode.", "success");
                  }}
                  className="flex items-center gap-1 px-3 py-2 bg-[#042C51] hover:bg-[#083e70] text-white rounded-lg text-xs font-black transition-all shadow-sm"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#FF5C28]" />
                  <span>Edit Profile Record</span>
                </button>
                <button 
                  onClick={() => showToast("Exported Employee dossier to 201 File PDF.", "success")}
                  className="px-2.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                  title="More Dossier Actions"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ==================== REDESIGNED PROFILE NAVIGATION ==================== */}
      <div className="bg-white p-2.5 rounded-2xl border border-[#E6ECF2] shadow-sm mb-6">
        {/* Main Topic Tab Strip */}
        <div className="flex items-center overflow-x-auto gap-1 pb-1 scrollbar-thin scrollbar-thumb-slate-200">
          {[
            { id: "Personal", label: "Personal Info", icon: User },
            { id: "Family", label: "Family / Kin", icon: Heart },
            { id: "Education", label: "Education", icon: GraduationCap },
            { id: "Eligibility", label: "Credentials", icon: Award },
            { id: "Experience", label: "Experience", icon: Briefcase },
            { id: "Training", label: "Trainings", icon: BookOpen },
            { id: "Skills", label: "Skills / Awards", icon: Sparkles },
            { id: "References", label: "References", icon: Phone },
            { id: "Application", label: "Application & HR", icon: FileCheck2 },
            { id: "Documents", label: "Documents", icon: FileText },
            { id: "Notes", label: "Dossier Notes", icon: Lock }
          ].map((tabObj) => {
            const isTabActive = activeTab === tabObj.id;
            return (
              <button
                key={tabObj.id}
                onClick={() => handleTabChange(tabObj.id as any)}
                aria-current={isTabActive ? "page" : undefined}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all shrink-0 ${
                  isTabActive 
                    ? "bg-[#E9F0FC] text-[#042C51] font-black border border-[#bfd3f2]" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-transparent"
                }`}
              >
                <tabObj.icon className={`w-3.5 h-3.5 ${isTabActive ? "text-[#FF5C28]" : "text-slate-400"}`} />
                <span>{tabObj.label}</span>
              </button>
            );
          })}
        </div>

        {/* Secondary Subtopic Navigation Layer */}
        {["Personal", "Family", "Skills", "Application"].includes(activeTab) && (
          <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-[#F1F5F9] overflow-x-auto">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-2 select-none">SUBSECTIONS:</span>
            {activeTab === "Personal" && ["Basic Info", "Contact", "Address", "Government IDs"].map((sub) => (
              <button
                key={sub}
                onClick={() => { setActiveSubtopic(sub); setIsEditing(false); }}
                className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${
                  activeSubtopic === sub 
                    ? "bg-[#042C51] text-white" 
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {sub}
              </button>
            ))}

            {activeTab === "Family" && ["Spouse", "Parents", "Children", "Emergency Contact"].map((sub) => (
              <button
                key={sub}
                onClick={() => { setActiveSubtopic(sub); setIsEditing(false); }}
                className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${
                  activeSubtopic === sub 
                    ? "bg-[#042C51] text-white" 
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {sub}
              </button>
            ))}

            {activeTab === "Skills" && ["Skills", "Recognition", "Organizations"].map((sub) => (
              <button
                key={sub}
                onClick={() => { setActiveSubtopic(sub); setIsEditing(false); }}
                className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${
                  activeSubtopic === sub 
                    ? "bg-[#042C51] text-white" 
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {sub}
              </button>
            ))}

            {activeTab === "Application" && ["Overview", "Pipeline", "Assessment", "Status History"].map((sub) => (
              <button
                key={sub}
                onClick={() => { setActiveSubtopic(sub); setIsEditing(false); }}
                className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${
                  activeSubtopic === sub 
                    ? "bg-[#042C51] text-white" 
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ==================== MAIN CONTENT WORKSPACE (GRID SPLIT) ==================== */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        
        {/* Left 2/3 Main Form Card */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-[#E6ECF2] shadow-sm min-h-[450px]">
            
            {/* Active section title context */}
            <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9] mb-5">
              <div>
                <h3 className="text-sm font-black text-[#042C51] uppercase tracking-wider">
                  {activeTab} {activeSubtopic ? `> ${activeSubtopic}` : ""}
                </h3>
                <p className="text-[10px] text-slate-400 font-semibold">
                  {isEditing ? "Editable input mode. Press 'Save Profile' in the header to lock updates." : "Secure read-only state. Values shown as recorded in WFM database."}
                </p>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${isEditing ? "bg-amber-400 animate-pulse" : "bg-[#042C51]"}`}></span>
                <span className="text-[10px] font-bold uppercase text-slate-500">
                  {isEditing ? "Modified Draft" : "Official Dossier Record"}
                </span>
              </div>
            </div>

            {/* ==================================================== */}
            {/* TAB CONTENT: PERSONAL */}
            {/* ==================================================== */}
            {activeTab === "Personal" && (
              <div>
                {/* 1.1 BASIC INFO */}
                {activeSubtopic === "Basic Info" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {renderField("First Name", "firstName", "text")}
                    {renderField("Middle Name", "middleName", "text")}
                    {renderField("Last Name", "lastName", "text")}
                    {renderField("Name Extension (Jr/III)", "nameExtension", "text")}
                    {renderField("Preferred Name", "preferredName", "text")}
                    {renderField("Birth Date", "birthDate", "date")}
                    {renderField("Place of Birth", "placeOfBirth", "text")}
                    {renderField("Gender", "gender", "select", ["Female", "Male", "Other"])}
                    {renderField("Civil Status", "civilStatus", "select", ["Single", "Married", "Divorced", "Widowed"])}
                    {renderField("Citizenship", "citizenship", "text")}
                    {renderField("Blood Type", "bloodType", "text")}
                    {renderField("Height", "height", "text")}
                    {renderField("Weight", "weight", "text")}
                  </div>
                )}

                {/* 1.2 CONTACT */}
                {activeSubtopic === "Contact" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {renderField("Email Address", "email", "email")}
                    {renderField("Mobile Number", "mobileNumber", "text")}
                    {renderField("Telephone Number", "telephone", "text")}
                  </div>
                )}

                {/* 1.3 ADDRESS */}
                {activeSubtopic === "Address" && (
                  <div className="space-y-4">
                    {renderField("Residential Address", "residentialAddress", "textarea")}
                    {renderField("Permanent Address", "permanentAddress", "textarea")}
                    <div className="w-1/2">
                      {renderField("Work Setup", "workSetup", "select", ["Onsite", "Hybrid", "Remote"])}
                    </div>
                  </div>
                )}

                {/* 1.4 GOVERNMENT IDS */}
                {activeSubtopic === "Government IDs" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {renderField("GSIS ID", "gsis", "text")}
                    {renderField("SSS Number", "sss", "text")}
                    {renderField("PhilHealth PIN", "philhealth", "text")}
                    {renderField("PAG-IBIG / HDMF MID", "pagibig", "text")}
                    {renderField("Taxpayer TIN", "tin", "text")}
                  </div>
                )}
              </div>
            )}

            {/* ==================================================== */}
            {/* TAB CONTENT: FAMILY */}
            {/* ==================================================== */}
            {activeTab === "Family" && (
              <div>
                {/* 2.1 SPOUSE */}
                {activeSubtopic === "Spouse" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {renderField("Spouse Last Name", "spouse.surname", "text")}
                    {renderField("Spouse First Name", "spouse.firstName", "text")}
                    {renderField("Spouse Middle Name", "spouse.middleName", "text")}
                    {renderField("Spouse Occupation", "spouse.occupation", "text")}
                    {renderField("Spouse Employer", "spouse.employer", "text")}
                    {renderField("Contact Phone", "spouse.telephone", "text")}
                    <div className="sm:col-span-2">
                      {renderField("Spouse Business Address", "spouse.businessAddress", "textarea")}
                    </div>
                  </div>
                )}

                {/* 2.2 PARENTS */}
                {activeSubtopic === "Parents" && (
                  <div className="space-y-6">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <h4 className="text-[11px] font-black text-[#042C51] mb-3 uppercase tracking-wider">FATHER'S RECORD</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {renderField("Father Last Name", "father.surname", "text")}
                        {renderField("Father First Name", "father.firstName", "text")}
                        {renderField("Father Middle Name", "father.middleName", "text")}
                      </div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <h4 className="text-[11px] font-black text-[#042C51] mb-3 uppercase tracking-wider">MOTHER'S RECORD (Maiden Name)</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {renderField("Mother Maiden Surname", "mother.maidenSurname", "text")}
                        {renderField("Mother First Name", "mother.firstName", "text")}
                        {renderField("Mother Middle Name", "mother.middleName", "text")}
                      </div>
                    </div>
                  </div>
                )}

                {/* 2.3 CHILDREN */}
                {activeSubtopic === "Children" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      {employee.children.length === 0 ? (
                        <p className="text-xs text-slate-400 font-semibold italic">No child dependents declared.</p>
                      ) : (
                        employee.children.map((child, idx) => (
                          <div key={child.id} className="flex items-center justify-between p-3 bg-[#F1F5F9] rounded-xl border border-slate-200">
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-[#E9F0FC] text-[#042C51] text-[10px] font-bold flex items-center justify-center">
                                {idx + 1}
                              </span>
                              <div>
                                <p className="text-xs font-bold text-[#042C51]">{child.name}</p>
                                <p className="text-[10px] text-slate-500">Birth Date: {child.birthDate}</p>
                              </div>
                            </div>
                            <button 
                              onClick={() => {
                                setEmployee(prev => ({
                                  ...prev,
                                  children: prev.children.filter(c => c.id !== child.id)
                                }));
                                showToast("Dependent record deleted.", "error");
                              }}
                              className="p-1 hover:bg-orange-100 text-orange-600 rounded transition-colors"
                              title="Delete dependent"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-xl border border-[#E6ECF2]">
                      <h4 className="text-[10px] font-bold text-[#042C51] mb-2 uppercase tracking-wider">ADD NEW CHILD DEPENDENT</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 block mb-1">Full Name</label>
                          <input 
                            type="text" 
                            placeholder="e.g. Christian Batacan"
                            value={newChildName}
                            onChange={e => setNewChildName(e.target.value)}
                            className="w-full bg-white px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-slate-200"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 block mb-1">Birth Date</label>
                          <input 
                            type="date" 
                            value={newChildBirth}
                            onChange={e => setNewChildBirth(e.target.value)}
                            className="w-full bg-white px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-slate-200"
                          />
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          if (!newChildName || !newChildBirth) {
                            showToast("Dependent Name and Birth Date required.", "error");
                            return;
                          }
                          const newKid = {
                            id: `child-${Date.now()}`,
                            name: newChildName,
                            birthDate: newChildBirth
                          };
                          setEmployee(prev => ({
                            ...prev,
                            children: [...prev.children, newKid]
                          }));
                          setNewChildName("");
                          setNewChildBirth("");
                          showToast("Dependent registered successfully.");
                        }}
                        className="mt-3 flex items-center gap-1.5 px-3 py-1.5 bg-[#042C51] text-white text-[11px] font-black rounded-lg hover:bg-slate-800 transition-colors"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>Register Dependent</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* 2.4 EMERGENCY CONTACT */}
                {activeSubtopic === "Emergency Contact" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {renderField("Emergency Contact Name", "emergencyContact.name", "text")}
                    {renderField("Relationship to Employee", "emergencyContact.relationship", "text")}
                    {renderField("Contact Phone Number", "emergencyContact.phoneNumber", "text")}
                    {renderField("Contact Email Address", "emergencyContact.email", "email")}
                  </div>
                )}
              </div>
            )}

            {/* ==================================================== */}
            {/* TAB CONTENT: EDUCATION */}
            {/* ==================================================== */}
            {activeTab === "Education" && (
              <div className="space-y-4">
                {employee.education.map((edu, idx) => (
                  <div key={edu.id} className="relative bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#E9F0FC] text-[#042C51] flex items-center justify-center shrink-0">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex flex-wrap items-center justify-between gap-1">
                        <span className="text-[10px] font-extrabold text-[#FF5C28] uppercase bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-full">
                          {edu.level}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold">
                          Period: {edu.fromYear} — {edu.toYear}
                        </span>
                      </div>
                      <h4 className="text-xs font-black text-[#042C51]">{edu.schoolName}</h4>
                      <p className="text-xs text-slate-600 font-semibold">{edu.degreeCourse}</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1.5 mt-1 border-t border-[#F1F5F9] text-[10px] text-slate-500">
                        <p><strong>Highest Level:</strong> {edu.highestLevelUnits || "—"}</p>
                        <p><strong>Year Graduated:</strong> {edu.yearGraduated || "—"}</p>
                        <p><strong>Honors Received:</strong> {edu.honorsReceived || "—"}</p>
                      </div>
                    </div>
                  </div>
                ))}

                <button 
                  onClick={() => showToast("Database Schema write limits active. Only Admin can append new Educational Degrees.", "error")}
                  className="w-full py-3 border-2 border-dashed border-slate-200 hover:border-[#042C51] text-slate-400 hover:text-[#042C51] text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Append Educational Degree / School record</span>
                </button>
              </div>
            )}

            {/* ==================================================== */}
            {/* TAB CONTENT: ELIGIBILITY */}
            {/* ==================================================== */}
            {activeTab === "Eligibility" && (
              <div className="space-y-4">
                {employee.eligibility.map((el) => (
                  <div key={el.id} className="bg-[#F8FAFC] p-4 rounded-xl border border-slate-200 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#E9F0FC] text-[#042C51] flex items-center justify-center shrink-0">
                      <Award className="w-5 h-5" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black text-[#042C51]">{el.licenseName}</h4>
                        <span className="text-xs font-black text-[#FF5C28]">Rating: {el.rating}</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 pt-2 text-[10px] text-slate-500 font-semibold">
                        <p><strong>License No:</strong> {el.licenseNumber}</p>
                        <p><strong>Exam Date:</strong> {el.examDate}</p>
                        <p><strong>Exam Place:</strong> {el.examPlace}</p>
                        <p><strong>Validity:</strong> {el.validityDate}</p>
                      </div>
                    </div>
                  </div>
                ))}
                
                <button 
                  onClick={() => showToast("Add credentials request forwarded to Compliance Admin.", "success")}
                  className="w-full py-2.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-bold rounded-xl flex items-center justify-center gap-1 transition-all"
                >
                  <Plus className="w-4 h-4 text-[#FF5C28]" />
                  <span>Request Credentials Annexation</span>
                </button>
              </div>
            )}

            {/* ==================================================== */}
            {/* TAB CONTENT: EXPERIENCE */}
            {/* ==================================================== */}
            {activeTab === "Experience" && (
              <div className="relative pl-6 space-y-6 before:absolute before:top-2 before:bottom-2 before:left-2.5 before:w-0.5 before:bg-[#E6ECF2]">
                {employee.experience.map((exp) => (
                  <div key={exp.id} className="relative bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    {/* Circle marker on timeline */}
                    <div className="absolute top-4 -left-[22px] w-3.5 h-3.5 rounded-full bg-white border-4 border-[#042C51] flex items-center justify-center"></div>

                    <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] text-[#667085] font-extrabold uppercase tracking-wider flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#FF5C28]" />
                        {exp.from} — {exp.to}
                      </span>
                      <span className="text-[9px] font-bold bg-[#E9F0FC] text-[#042C51] border border-blue-100 px-2 py-0.5 rounded">
                        Salary Grade: {exp.salaryGrade}
                      </span>
                    </div>

                    <h4 className="text-xs font-black text-[#042C51]">{exp.positionTitle}</h4>
                    <p className="text-xs text-slate-500 font-bold">{exp.company}</p>

                    <div className="mt-3 p-2.5 bg-slate-50 rounded-lg text-[10px] text-slate-600 space-y-1.5 border border-slate-100">
                      <p><strong>Monthly Compensation:</strong> {exp.monthlySalary}</p>
                      <p><strong>Appointment Status:</strong> {exp.statusOfAppointment}</p>
                      <p><strong>Duties & Responsibilities:</strong> {exp.duties}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ==================================================== */}
            {/* TAB CONTENT: TRAINING */}
            {/* ==================================================== */}
            {activeTab === "Training" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {employee.training.map((tr) => (
                  <div key={tr.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-[9px] font-black uppercase text-[#FF5C28] bg-orange-50 px-2 py-0.5 rounded">
                        {tr.typeOfLd}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">
                        Hours: {tr.hours} hrs
                      </span>
                    </div>
                    <h4 className="text-xs font-black text-[#042C51] leading-tight">{tr.title}</h4>
                    <p className="text-[10px] text-slate-400 font-semibold">Period: {tr.from} to {tr.to}</p>
                    <p className="text-[10px] text-slate-500 font-semibold pt-1 border-t border-slate-100 mt-2">
                      <strong>Sponsored By:</strong> {tr.sponsoredBy}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* ==================================================== */}
            {/* TAB CONTENT: SKILLS */}
            {/* ==================================================== */}
            {activeTab === "Skills" && (
              <div className="space-y-6">
                {activeSubtopic === "Skills" && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-black text-[#042C51]">Technical Skills & Proficiencies</h4>
                    <div className="flex flex-wrap gap-2">
                      {employee.skills.map((skill, i) => (
                        <span key={i} className="px-3 py-1.5 bg-[#E9F0FC] text-[#042C51] text-xs font-bold rounded-lg border border-blue-100 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#FF5C28]" />
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {activeSubtopic === "Recognition" && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-black text-[#042C51]">Corporate Awards & Distinctions</h4>
                    <div className="space-y-2">
                      {employee.recognitions.map((rec, i) => (
                        <div key={i} className="p-3 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl flex items-center gap-2">
                          <Award className="w-4 h-4 text-[#FF5C28]" />
                          <span className="text-xs font-bold">{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeSubtopic === "Organizations" && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-black text-[#042C51]">Affiliated Professional Societies</h4>
                    <div className="space-y-2">
                      {employee.organizations.map((org, i) => (
                        <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2 text-slate-700">
                          <Shield className="w-4 h-4 text-[#042C51]" />
                          <span className="text-xs font-bold">{org}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ==================================================== */}
            {/* TAB CONTENT: REFERENCES */}
            {/* ==================================================== */}
            {activeTab === "References" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {employee.references.map((ref) => (
                  <div key={ref.id} className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded bg-slate-100 flex items-center justify-center text-[#042C51] font-bold text-xs">
                        {ref.name.slice(0,2).toUpperCase()}
                      </div>
                      <h4 className="text-xs font-black text-[#042C51]">{ref.name}</h4>
                    </div>
                    <p className="text-[10px] text-slate-500 font-semibold">{ref.address}</p>
                    <p className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                      <Phone className="w-3 h-3 text-[#FF5C28]" /> {ref.telephone}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* ==================================================== */}
            {/* TAB CONTENT: APPLICATION */}
            {/* ==================================================== */}
            {activeTab === "Application" && (
              <div>
                {/* 9.1 OVERVIEW */}
                {activeSubtopic === "Overview" && (
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <h4 className="text-xs font-black text-[#042C51] mb-2 uppercase tracking-wider">Recruitment Details Summary</h4>
                      <p className="text-xs text-slate-600 font-semibold leading-relaxed">{employee.application.overview}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-[#E9F0FC] rounded-xl border border-blue-100">
                        <span className="text-[9px] font-bold text-slate-400 block uppercase">Pipeline Status</span>
                        <span className="text-xs font-black text-[#042C51]">{employee.application.pipeline}</span>
                      </div>
                      <div className="p-3 bg-orange-50 rounded-xl border border-orange-100">
                        <span className="text-[9px] font-bold text-slate-400 block uppercase">Position Selected</span>
                        <span className="text-xs font-black text-[#FF5C28]">{employee.position}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 9.2 PIPELINE */}
                {activeSubtopic === "Pipeline" && (
                  <div className="p-4 bg-[#F8FAFC] border border-slate-200 rounded-xl text-center py-10 space-y-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto text-emerald-600">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h4 className="text-xs font-black text-[#042C51]">Vetting Process Completed</h4>
                    <p className="text-[10px] text-slate-500 max-w-sm mx-auto">This dossier has satisfied all required background checks, security references, and physical/intellectual exam metrics.</p>
                  </div>
                )}

                {/* 9.3 ASSESSMENT */}
                {activeSubtopic === "Assessment" && (
                  <div className="space-y-3">
                    {employee.application.assessment.map((as, i) => (
                      <div key={i} className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700">{as.subject}</span>
                        <span className="text-xs font-black text-[#042C51] bg-[#F1F5F9] px-2.5 py-1 rounded-lg">
                          Score: {as.score}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* 9.4 STATUS HISTORY */}
                {activeSubtopic === "Status History" && (
                  <div className="relative pl-6 space-y-6 before:absolute before:top-2 before:bottom-2 before:left-2.5 before:w-0.5 before:bg-[#E6ECF2]">
                    {employee.application.statusHistory.map((hist) => (
                      <div key={hist.id} className="relative bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                        {/* Circle timeline marker */}
                        <div className="absolute top-4.5 -left-[22px] w-3.5 h-3.5 rounded-full bg-white border-4 border-[#FF5C28] flex items-center justify-center"></div>

                        <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1">
                          <span className="text-[10px] font-black uppercase text-[#042C51] bg-[#E9F0FC] px-2 py-0.5 rounded border border-blue-100">
                            {hist.stage}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold">
                            Date: {hist.date}
                          </span>
                        </div>

                        <h4 className="text-xs font-black text-slate-800">
                          Status: <span className="text-emerald-600 font-extrabold">{hist.status}</span>
                        </h4>
                        <p className="text-[10px] text-slate-500 font-semibold mt-1 bg-slate-50 p-2 rounded">
                          <strong>Remarks:</strong> {hist.remarks}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ==================================================== */}
            {/* TAB CONTENT: DOCUMENTS */}
            {/* ==================================================== */}
            {activeTab === "Documents" && (
              <div className="space-y-5">
                {/* Drag and Drop Area */}
                <div 
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleFileDrop}
                  className={`border-2 border-dashed rounded-2xl p-5 text-center transition-all relative ${
                    dragActive 
                      ? "border-[#FF5C28] bg-[#FFF8F5]" 
                      : "border-slate-200 bg-[#F8FAFC] hover:border-[#042C51] hover:bg-[#F1F5F9]"
                  }`}
                >
                  <input 
                    type="file" 
                    id="document_upload" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileSelect}
                  />
                  <div className="space-y-2 pointer-events-none">
                    <div className="w-10 h-10 rounded-full bg-[#E9F0FC] flex items-center justify-center mx-auto text-[#042C51]">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-[#042C51]">Drag & drop candidate documentation or click to browse</p>
                      <p className="text-[10px] text-slate-400">PDF, JPG, PNG or DOCX up to 10MB sizes. Files are auto-encrypted.</p>
                    </div>
                  </div>
                </div>

                {/* Simulated progress bar */}
                {uploadProgress !== null && (
                  <div className="p-3 bg-[#E9F0FC] rounded-xl border border-blue-100 space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-[#042C51] font-bold">
                      <span>Encrypting and uploading file...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#FF5C28] h-full transition-all duration-150" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                  </div>
                )}

                {/* File Ledger List */}
                <div className="space-y-2.5">
                  <h4 className="text-[11px] font-black text-[#042C51] uppercase tracking-wider">SECURE DIGITAL ASSETS (201 RECORD FILE)</h4>
                  
                  {employee.documents.map((doc) => (
                    <div key={doc.id} className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between shadow-sm hover:border-slate-300 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                          <File className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#042C51] truncate max-w-[220px] sm:max-w-md">{doc.name}</p>
                          <p className="text-[9px] text-slate-400 font-bold">
                            Size: {doc.size} • Uploaded {doc.uploadedAt} by {doc.uploadedBy}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => showToast(`Downloading ${doc.name} to local downloads directory.`, "success")}
                          className="p-1.5 hover:bg-[#E9F0FC] text-[#042C51] rounded-lg transition-colors"
                          title="Download document"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => deleteDocument(doc.id, doc.name)}
                          className="p-1.5 hover:bg-orange-100 text-orange-600 rounded-lg transition-colors"
                          title="Delete document permanently"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ==================================================== */}
            {/* TAB CONTENT: NOTES */}
            {/* ==================================================== */}
            {activeTab === "Notes" && (
              <div className="space-y-4">
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2 text-amber-900 mb-2">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-black">CONFIDENTIAL dossier access logged</p>
                    <p className="text-[9px] text-amber-800 leading-normal">These notes represent internal HR administration remarks and are strictly withheld from employee self-service view sheets.</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 block uppercase">Employee Dossier remarks</label>
                  <textarea 
                    value={notesDraft}
                    onChange={e => setNotesDraft(e.target.value)}
                    className="w-full min-h-[140px] bg-[#F1F5F9] border border-[#E6ECF2] p-3 rounded-xl text-xs font-semibold focus:outline-none focus:bg-white focus:border-[#042C51] transition-all leading-relaxed text-[#101828]"
                    placeholder="Enter confidential notes, compliance concerns, or career trajectory updates..."
                  />
                </div>

                <div className="flex justify-end">
                  <button 
                    onClick={saveNotes}
                    className="px-4 py-2 bg-[#042C51] hover:bg-slate-800 text-white rounded-lg text-xs font-black transition-all shadow-sm flex items-center gap-1"
                  >
                    <Check className="w-4 h-4 text-[#FF5C28]" />
                    <span>Commit Notes to Dossier</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Right 1/3 Side Summary Panel */}
        <div className="space-y-6">
          
          {/* Profile Completion Card */}
          <div className="bg-white p-4 rounded-2xl border border-[#E6ECF2] shadow-sm text-center space-y-4">
            <h4 className="text-[11px] font-black text-[#042C51] uppercase tracking-wider text-left pb-2 border-b border-[#F1F5F9]">
              Dossier Health Check
            </h4>

            {/* Circular Ring Progress */}
            <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle 
                  cx="56" cy="56" r="48" 
                  className="stroke-slate-100 fill-transparent" 
                  strokeWidth="8"
                />
                <circle 
                  cx="56" cy="56" r="48" 
                  className="stroke-[#042C51] fill-transparent transition-all duration-500" 
                  strokeWidth="8" 
                  strokeDasharray={`${2 * Math.PI * 48}`}
                  strokeDashoffset={`${2 * Math.PI * 48 * (1 - profileCompletionScore / 100)}`}
                />
              </svg>
              <div className="absolute text-center">
                <p className="text-xl font-black text-[#042C51]">{profileCompletionScore}%</p>
                <p className="text-[8px] text-slate-400 font-black uppercase">COMPLETED</p>
              </div>
            </div>

            <div className="text-xs text-slate-500 font-semibold space-y-1 bg-[#F8FAFC] p-2.5 rounded-xl border border-slate-100">
              <p className="text-[#042C51] font-bold">Primary records complete</p>
              <p className="text-[10px] text-slate-400">All mandatory 201 filing documents attached and verified.</p>
            </div>
          </div>

          {/* HR Quick Actions Card */}
          <div className="bg-white p-4 rounded-2xl border border-[#E6ECF2] shadow-sm space-y-3">
            <h4 className="text-[11px] font-black text-[#042C51] uppercase tracking-wider pb-2 border-b border-[#F1F5F9]">
              Dossier Quick Actions
            </h4>

            <div className="space-y-1.5">
              <button 
                onClick={() => showToast("Request for COE dispatched to verification team.", "success")}
                className="w-full py-2 px-3 text-left bg-[#F1F5F9] hover:bg-[#E9F0FC] rounded-lg text-[11px] font-bold text-[#042C51] transition-all flex items-center justify-between"
              >
                <span>Request COE (Certificate of Employment)</span>
                <ChevronLeft className="w-3.5 h-3.5 text-[#FF5C28] rotate-180" />
              </button>
              <button 
                onClick={() => showToast("Downloading encrypted ZIP 201 dossier pack.", "success")}
                className="w-full py-2 px-3 text-left bg-[#F1F5F9] hover:bg-[#E9F0FC] rounded-lg text-[11px] font-bold text-[#042C51] transition-all flex items-center justify-between"
              >
                <span>Export Sealed Dossier ZIP</span>
                <ChevronLeft className="w-3.5 h-3.5 text-[#FF5C28] rotate-180" />
              </button>
              <button 
                onClick={() => showToast("Dispatched updated biometric configuration to site turnstiles.", "success")}
                className="w-full py-2 px-3 text-left bg-[#F1F5F9] hover:bg-[#E9F0FC] rounded-lg text-[11px] font-bold text-[#042C51] transition-all flex items-center justify-between"
              >
                <span>Synchronize Biometric Access Cards</span>
                <ChevronLeft className="w-3.5 h-3.5 text-[#FF5C28] rotate-180" />
              </button>
              <button 
                onClick={() => showToast("Bi-annual performance audit record requested.", "success")}
                className="w-full py-2 px-3 text-left bg-[#F1F5F9] hover:bg-[#E9F0FC] rounded-lg text-[11px] font-bold text-[#042C51] transition-all flex items-center justify-between"
              >
                <span>Generate Performance Snapshot</span>
                <ChevronLeft className="w-3.5 h-3.5 text-[#FF5C28] rotate-180" />
              </button>
            </div>
          </div>

          {/* Dossier Access logs */}
          <div className="bg-white p-4 rounded-2xl border border-[#E6ECF2] shadow-sm space-y-3">
            <h4 className="text-[11px] font-black text-[#042C51] uppercase tracking-wider pb-2 border-b border-[#F1F5F9]">
              Audit Trail logs
            </h4>

            <div className="space-y-2.5 text-[9px] text-[#667085] font-semibold">
              <div className="flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF5C28] mt-1"></span>
                <div>
                  <p className="text-slate-800 font-bold">Employee Record Edited</p>
                  <p className="text-slate-400">Today, 23:15 by dulla13ralph@gmail.com</p>
                </div>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1"></span>
                <div>
                  <p className="text-slate-800 font-bold">Dossier Notes Opened</p>
                  <p className="text-slate-400">Today, 21:04 by alena.batacan@thesiblingssolutions.com</p>
                </div>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1"></span>
                <div>
                  <p className="text-slate-800 font-bold">NBI Clearance Document Verified</p>
                  <p className="text-slate-400">June 15, 2026 by HR Compliance System</p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

  // --- START OF GENERAL DIRECTORY LIST VIEW ---

  return (
    <div className="w-full text-[#101828] select-none space-y-6">
      
      {/* Toast Feedback */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border transition-all duration-300 transform translate-y-0 ${
          toast.type === "success" 
            ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
            : "bg-orange-50 text-orange-800 border-orange-200"
        }`}>
          <div className={`w-2 h-2 rounded-full ${toast.type === "success" ? "bg-emerald-500 animate-ping" : "bg-orange-500 animate-pulse"}`}></div>
          <span className="text-xs font-bold">{toast.message}</span>
        </div>
      )}

      {/* 1. HEADER & ACTIONS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#042C51] tracking-tight">Employees</h1>
          <p className="text-xs text-slate-500 font-bold mt-1">Manage employees, access requests, and CHWCP records</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={onBackToDashboard}
            className="px-3.5 py-2 rounded-xl bg-white border border-[#E6ECF2] hover:bg-slate-50 text-[#042C51] text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
          >
            <ChevronLeft className="w-4 h-4 text-[#FF5C28]" />
            <span>WFM Dashboard</span>
          </button>
          <button 
            onClick={() => showToast("Admin database connection is ready to intake new hires.", "success")}
            className="px-3.5 py-2 rounded-xl bg-[#042C51] text-white hover:bg-[#03223f] text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 text-[#FF5C28]" />
            <span>Add Employee</span>
          </button>
          <button 
            onClick={() => showToast(`Exporting filtered ${directoryTab} list to CSV format...`, "success")}
            className="p-2 rounded-xl bg-white border border-[#E6ECF2] hover:bg-slate-50 text-slate-600 transition-all shadow-sm"
            title="Export Roster"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. EMPLOYEE SUMMARY (METRICS CARDS) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Total Employees Metric Card */}
        <div className="bg-white p-4 rounded-xl border border-[#E6ECF2] shadow-sm flex flex-col justify-between relative overflow-hidden h-[115px] transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Total Employees</span>
            <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center text-[#042C51]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-1">
            <div className="text-2xl font-extrabold text-[#042C51] tracking-tight">
              {totalEmployeesCount} <span className="text-xs font-bold text-emerald-500">Active</span>
            </div>
            <div className="text-[9px] text-slate-400 font-bold mt-1 uppercase tracking-wide">
              Global SiBS Headcount Roster
            </div>
          </div>
        </div>

        {/* Access Requests Metric Card */}
        <div className="bg-white p-4 rounded-xl border border-[#E6ECF2] shadow-sm flex flex-col justify-between relative overflow-hidden h-[115px] transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Access Requests</span>
            <div className="w-8 h-8 bg-orange-50 rounded-full flex items-center justify-center text-[#FF5C28]">
              <Lock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-1">
            <div className="text-2xl font-extrabold text-[#042C51] tracking-tight">
              {pendingRequestsCount} <span className="text-xs font-bold text-orange-500">Pending</span>
            </div>
            <div className="text-[9px] text-slate-400 font-bold mt-1 uppercase tracking-wide">
              Biometric & Card Provisioning Requests
            </div>
          </div>
        </div>

        {/* CHWCP Metric Card */}
        <div className="bg-white p-4 rounded-xl border border-[#E6ECF2] shadow-sm flex flex-col justify-between relative overflow-hidden h-[115px] transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">CHWCP Compliance</span>
            <div className="w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-1">
            <div className="text-2xl font-extrabold text-[#042C51] tracking-tight">
              {certifiedChwcpCount} <span className="text-xs font-bold text-emerald-500">Certified</span>
            </div>
            <div className="text-[9px] text-slate-400 font-bold mt-1 uppercase tracking-wide">
              Annual health & compliance clearances
            </div>
          </div>
        </div>

      </div>

      {/* 3. DIRECTORY NAVIGATION (TABS) */}
      <div className="border-b border-[#E6ECF2]">
        <nav className="-mb-px flex space-x-6" aria-label="Directory Navigation">
          <button
            onClick={() => { setDirectoryTab("employees"); setSearchQuery(""); }}
            className={`pb-4 px-1 border-b-2 font-bold text-sm transition-all flex items-center gap-2 ${
              directoryTab === "employees"
                ? "border-[#FF5C28] text-[#FF5C28]"
                : "border-transparent text-slate-400 hover:text-[#042C51]"
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Employees</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
              directoryTab === "employees" ? "bg-[#FF5C28]/10 text-[#FF5C28]" : "bg-slate-100 text-slate-400"
            }`}>
              {totalEmployeesCount}
            </span>
          </button>

          <button
            onClick={() => { setDirectoryTab("access"); setSearchQuery(""); }}
            className={`pb-4 px-1 border-b-2 font-bold text-sm transition-all flex items-center gap-2 ${
              directoryTab === "access"
                ? "border-[#FF5C28] text-[#FF5C28]"
                : "border-transparent text-slate-400 hover:text-[#042C51]"
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Access Requests</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
              directoryTab === "access" ? "bg-[#FF5C28]/10 text-[#FF5C28]" : "bg-slate-100 text-slate-400"
            }`}>
              {MOCK_ACCESS_REQUESTS.length}
            </span>
          </button>

          <button
            onClick={() => { setDirectoryTab("chwcp"); setSearchQuery(""); }}
            className={`pb-4 px-1 border-b-2 font-bold text-sm transition-all flex items-center gap-2 ${
              directoryTab === "chwcp"
                ? "border-[#FF5C28] text-[#FF5C28]"
                : "border-transparent text-slate-400 hover:text-[#042C51]"
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>CHWCP Profile</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
              directoryTab === "chwcp" ? "bg-[#FF5C28]/10 text-[#FF5C28]" : "bg-slate-100 text-slate-400"
            }`}>
              {MOCK_CHWCP_RECORDS.length}
            </span>
          </button>
        </nav>
      </div>

      {/* 4. FILTERING & SEARCH */}
      <CentralizedFilters
        title="Refine Directory Filters"
        onReset={() => {
          setSearchQuery("");
          setSelectedDept("All Departments");
          setSelectedAcc("All Accounts");
        }}
        search={{
          label: "Search Roster",
          placeholder:
            directoryTab === "employees"
              ? "Search employees by name, ID, position..."
              : directoryTab === "access"
                ? "Search requests..."
                : "Search certifications...",
          value: searchQuery,
          onChange: setSearchQuery,
        }}
        selects={
          directoryTab === "employees"
            ? [
                {
                  label: "Department",
                  value: selectedDept,
                  onChange: setSelectedDept,
                  options: [
                    "All Departments",
                    "Workforce Management (WFM)",
                    "Information Technology (IT)",
                    "Operations",
                    "Healthcare Operations",
                    "HR & Admin",
                  ],
                },
                {
                  label: "Account",
                  value: selectedAcc,
                  onChange: setSelectedAcc,
                  options: [
                    "All Accounts",
                    "Verizon Tech",
                    "Internal Systems",
                    "Comcast Technical",
                    "Global WFM",
                    "Aetna Core",
                    "Executive Suite",
                  ],
                },
              ]
            : []
        }
      />

      {/* 5. DATA TABLES */}
      <div className="overflow-hidden bg-white border border-[#E6ECF2] rounded-xl shadow-sm">
        
        {/* EMPLOYEES TAB LIST */}
        {directoryTab === "employees" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50 border-b border-[#E6ECF2] text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  <th className="py-3 px-4">SiBS ID</th>
                  <th className="py-3 px-4">Employee Name</th>
                  <th className="py-3 px-4">Account / Site</th>
                  <th className="py-3 px-4">Department / Position</th>
                  <th className="py-3 px-4">Contact & Email</th>
                  <th className="py-3 px-4">HR Metadata</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9] text-xs font-semibold">
                {filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400 font-bold">
                      No employees match your active filters.
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((emp) => {
                    const initials = `${emp.firstName[0]}${emp.lastName[0]}`;
                    const bgColors = [
                      "bg-blue-50 text-[#042C51]",
                      "bg-orange-50 text-[#FF5C28]",
                      "bg-purple-50 text-[#5c28ff]",
                      "bg-emerald-50 text-emerald-800",
                      "bg-pink-50 text-pink-700"
                    ];
                    const colorIndex = (emp.firstName.charCodeAt(0) + emp.lastName.charCodeAt(0)) % bgColors.length;
                    const avatarStyle = bgColors[colorIndex];

                    return (
                      <tr 
                        key={emp.id}
                        onClick={() => handleViewEmployee(emp.id)}
                        className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                      >
                        {/* SiBS ID */}
                        <td className="py-3.5 px-4 font-mono text-slate-500 font-bold">
                          <span className="text-[#FF5C28] font-extrabold">{emp.sibsId}</span>
                        </td>
                        
                        {/* Employee Name (Profile Avatar + Name) */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs shadow-inner ${avatarStyle}`}>
                              {initials}
                            </div>
                            <div>
                              <div className="font-bold text-[#042C51] group-hover:text-[#FF5C28] transition-colors leading-tight">
                                {emp.lastName.toUpperCase()}, {emp.firstName} {emp.middleName}
                              </div>
                              <div className="text-[10px] text-slate-400 font-bold mt-0.5">
                                Preferred: {emp.preferredName}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Account & Site */}
                        <td className="py-3.5 px-4">
                          <div>
                            <span className="inline-block px-2 py-0.5 rounded bg-blue-50 border border-blue-100 text-[#042C51] text-[9px] font-bold uppercase tracking-wider">
                              {emp.account}
                            </span>
                            <div className="text-[10px] text-slate-500 font-semibold mt-1 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              <span>{emp.site}</span>
                            </div>
                          </div>
                        </td>

                        {/* Department / Position */}
                        <td className="py-3.5 px-4">
                          <div>
                            <div className="text-[#042C51] font-bold">{emp.position}</div>
                            <div className="text-[10px] text-slate-400 font-bold mt-0.5">{emp.department}</div>
                          </div>
                        </td>

                        {/* Contact & Email */}
                        <td className="py-3.5 px-4">
                          <div className="space-y-0.5 font-semibold text-[11px] text-slate-600">
                            <div className="flex items-center gap-1">
                              <Mail className="w-3 h-3 text-slate-400" />
                              <span>{emp.email}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="w-3 h-3 text-slate-400" />
                              <span>{emp.contact}</span>
                            </div>
                          </div>
                        </td>

                        {/* HR Metadata (Gender, Birthdate, Status) */}
                        <td className="py-3.5 px-4">
                          <div className="text-[10px] text-slate-500 font-semibold space-y-0.5">
                            <div><span className="text-slate-400">Gender:</span> {emp.gender}</div>
                            <div><span className="text-slate-400">Civil:</span> {emp.civilStatus}</div>
                            <div><span className="text-slate-400">Hired:</span> <span className="font-mono">{emp.hireDate}</span></div>
                          </div>
                        </td>

                        {/* Action - View Profile Indicator */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                            <span className="text-[9px] text-[#042C51] font-black uppercase tracking-wider hidden group-hover:inline">View 201 File</span>
                            <div className="w-7 h-7 bg-white border border-[#E6ECF2] hover:border-[#FF5C28] rounded-lg flex items-center justify-center text-[#FF5C28] shadow-sm transition-all">
                              <ChevronRight className="w-4 h-4" />
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ACCESS REQUESTS TAB LIST */}
        {directoryTab === "access" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50 border-b border-[#E6ECF2] text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  <th className="py-3 px-4">Request ID</th>
                  <th className="py-3 px-4">Requester Name</th>
                  <th className="py-3 px-4">Area & Access Scope Requested</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Requested Date</th>
                  <th className="py-3 px-4 text-right">Provisioning Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9] text-xs font-semibold text-slate-700">
                {filteredAccessRequests.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400 font-bold">
                      No matching access requests found.
                    </td>
                  </tr>
                ) : (
                  filteredAccessRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#FF5C28]">{req.id}</td>
                      <td className="py-3.5 px-4 font-bold text-[#042C51]">{req.employeeName}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-600">{req.areaRequested}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          req.status === "Approved" 
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                            : "bg-amber-50 text-amber-700 border border-amber-200 animate-pulse"
                        }`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-500">{req.requestedDate}</td>
                      <td className="py-3.5 px-4 text-right">
                        {req.status === "Pending" ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button 
                              onClick={() => showToast(`Access granted for ${req.employeeName}. Credentials sent.`, "success")}
                              className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded text-[10px] font-black uppercase transition-all shadow-sm"
                            >
                              Approve
                            </button>
                            <button 
                              onClick={() => showToast(`Access request denied and archived.`, "error")}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded text-[10px] font-black uppercase transition-all"
                            >
                              Deny
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center justify-end gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            <span>Granted</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* CHWCP CERTIFICATIONS TAB LIST */}
        {directoryTab === "chwcp" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50 border-b border-[#E6ECF2] text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  <th className="py-3 px-4">Profile ID</th>
                  <th className="py-3 px-4">Employee Name</th>
                  <th className="py-3 px-4">Annual Physical Exam (APE)</th>
                  <th className="py-3 px-4">Compliance Drug Screening</th>
                  <th className="py-3 px-4">CHWCP License Code</th>
                  <th className="py-3 px-4">Clearance Expiration</th>
                  <th className="py-3 px-4 text-right">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9] text-xs font-semibold text-slate-700">
                {filteredCHWCP.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400 font-bold">
                      No matching CHWCP records found.
                    </td>
                  </tr>
                ) : (
                  filteredCHWCP.map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#042C51]">{rec.id}</td>
                      <td className="py-3.5 px-4 font-bold text-[#042C51]">{rec.employeeName}</td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          rec.apeStatus.includes("Certified") 
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                            : "bg-orange-50 text-orange-700 border border-orange-100"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${rec.apeStatus.includes("Certified") ? "bg-emerald-500" : "bg-orange-500"}`}></span>
                          <span>{rec.apeStatus}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-extrabold uppercase tracking-wide">
                          {rec.drugTest}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-500">{rec.certificateNumber}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#042C51]">{rec.expiryDate}</td>
                      <td className="py-3.5 px-4 text-right">
                        <button 
                          onClick={() => showToast(`Audit trail cleared for ${rec.employeeName}. Certification is valid.`, "success")}
                          className="px-2.5 py-1 bg-white border border-[#E6ECF2] hover:border-[#FF5C28] text-slate-600 hover:text-[#FF5C28] rounded text-[10px] font-black uppercase tracking-wider transition-all shadow-sm"
                        >
                          Audit Clearance
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

      </div>

    </div>
  );

  // Helper Field Rendering Component supporting both Read and Edit views beautifully
  function renderField(
    label: string, 
    fieldPath: string, 
    type: "text" | "email" | "date" | "textarea" | "select", 
    selectOptions?: string[]
  ) {
    const keys = fieldPath.split(".");
    let value = "";
    if (isEditing) {
      if (keys.length === 1) {
        value = (tempEmployee as any)[keys[0]] || "";
      } else if (keys.length === 2) {
        value = (tempEmployee as any)[keys[0]]?.[keys[1]] || "";
      }
    } else {
      if (keys.length === 1) {
        value = (employee as any)[keys[0]] || "";
      } else if (keys.length === 2) {
        value = (employee as any)[keys[0]]?.[keys[1]] || "";
      }
    }

    const formattedValue = value ? value : "—";

    return (
      <div className="flex flex-col gap-1 w-full text-left">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
          {label}
        </label>
        
        {isEditing ? (
          <div>
            {type === "textarea" ? (
              <textarea
                value={value}
                onChange={e => handleInputChange(fieldPath, e.target.value)}
                className="w-full bg-[#F1F5F9] border border-[#E6ECF2] hover:border-slate-300 rounded-lg p-2 text-xs font-semibold focus:outline-none focus:bg-white focus:border-[#042C51] transition-all min-h-[60px]"
              />
            ) : type === "select" ? (
              <select
                value={value}
                onChange={e => handleInputChange(fieldPath, e.target.value)}
                className="w-full bg-[#F1F5F9] border border-[#E6ECF2] hover:border-slate-300 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none focus:bg-white focus:border-[#042C51] transition-all cursor-pointer"
              >
                <option value="">-- Choose Option --</option>
                {selectOptions?.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            ) : (
              <input
                type={type}
                value={value}
                onChange={e => handleInputChange(fieldPath, e.target.value)}
                className="w-full bg-[#F1F5F9] border border-[#E6ECF2] hover:border-slate-300 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none focus:bg-white focus:border-[#042C51] transition-all"
              />
            )}
          </div>
        ) : (
          <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl min-h-[38px] flex items-center">
            <span className="text-xs font-semibold text-[#101828] leading-normal break-all">
              {formattedValue}
            </span>
          </div>
        )}
      </div>
    );
  }
}
