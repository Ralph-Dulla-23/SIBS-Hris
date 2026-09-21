import React, { useState, useMemo, useRef } from "react";
import {
  Briefcase,
  User,
  GraduationCap,
  ShieldCheck,
  Users,
  Volume2,
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  RefreshCw,
  Send,
  Sparkles,
  MapPin,
  Calendar,
  Phone,
  Mail,
  HelpCircle,
  Info,
  Check,
  ChevronDown,
  X,
  Play,
  Pause,
  Award,
  Search,
  Building2,
  FileCheck,
  CheckSquare,
  Globe2,
  Clock,
  ChevronRight,
  Shield,
  Headphones,
  FileSpreadsheet,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Candidate, WorkExperience } from "./TalentPool";

interface PublicTalentPoolApplicationPageProps {
  onAddCandidate?: (candidate: Candidate) => void;
  onNavigateToTalentPool?: () => void;
}

const SOURCES_LIST = [
  "Employee Referral Program",
  "Social Media Pages (Facebook/LinkedIn/TikTok)",
  "Social Media Ads",
  "Online Job Portals (JobStreet/Indeed/Kalibrr)",
  "Walk-In Applicant",
  "Print Ads (Billboards, Brochures, Posters)",
  "Institutional Partnership / University Tie-up",
  "External Referral Network",
  "Job Fairs & Career Caravans",
  "Word of Mouth / Alumni",
  "Employee Retention / Re-hire Program",
  "Other Sourcing Channels"
];

const OPEN_POSITIONS = [
  { id: "POS-001", title: "Customer Care Representative", dept: "Retail & E-Commerce Support", loc: "Alabang Site", shift: "24/7 Shifting", opening: "15 Openings" },
  { id: "POS-002", title: "Technical Support Rep (CSR)", dept: "Telecom & Cloud Operations", loc: "Alabang Site", shift: "Graveyard Shift", opening: "20 Openings" },
  { id: "POS-003", title: "Healthcare Support Specialist", dept: "Healthcare & Insurance", loc: "Davao Matina IT Park", shift: "US Night Shift", opening: "12 Openings" },
  { id: "POS-004", title: "Financial Services Specialist", dept: "Banking & Financial Services", loc: "Clark Freeport Zone", shift: "Day / Mid Shift", opening: "8 Openings" },
  { id: "POS-005", title: "Multi-Channel Chat & Email Support", dept: "Retail & Consumer Tech", loc: "Cebu IT Park Site", shift: "24/7 Shifting", opening: "25 Openings" },
  { id: "POS-006", title: "Billing & Claims Representative", dept: "Healthcare Accounts", loc: "Remote / Work From Home", shift: "Fixed US Hours", opening: "10 Openings" },
  { id: "POS-007", title: "Retention Specialist - Telecom", dept: "Telecom & Subscriptions", loc: "Alabang Site", shift: "Graveyard Shift", opening: "6 Openings" },
  { id: "POS-008", title: "Escalations Lead / TL Trainee", dept: "Operations Leadership", loc: "Alabang Site", shift: "Flexible / Rotation", opening: "4 Openings" }
];

const CERTIFICATIONS_LIST = [
  "TESDA NC II (Customer Service / Contact Center)",
  "Lean Six Sigma (Yellow / Green Belt)",
  "LPT (Licensed Professional Teacher)",
  "CPA (Certified Public Accountant)",
  "Registered Nurse (RN) / Medical License",
  "BOSH / COSH (DOLE Safety Officer)",
  "First Aid & BLS Certification",
  "Master's / Doctorate Degree",
  "Other License / Professional Certification"
];

export default function PublicTalentPoolApplicationPage({
  onAddCandidate,
  onNavigateToTalentPool
}: PublicTalentPoolApplicationPageProps) {
  // Step Navigation Tracking
  const [activeStepTab, setActiveStepTab] = useState<number>(1);

  // 1️⃣ Application Source & Position
  const [selectedSources, setSelectedSources] = useState<string[]>(["Online Job Portals (JobStreet/Indeed/Kalibrr)"]);
  const [referrerName, setReferrerName] = useState("");
  const [referrerContact, setReferrerContact] = useState("");
  const [appliedPosition, setAppliedPosition] = useState("Customer Care Representative");
  const [positionSearchTerm, setPositionSearchTerm] = useState("");
  const [isPositionDropdownOpen, setIsPositionDropdownOpen] = useState(false);
  const [nickname, setNickname] = useState("");
  const [targetLocation, setTargetLocation] = useState("Alabang Site");

  // 2️⃣ Personal Information
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [suffix, setSuffix] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [phone1, setPhone1] = useState("");
  const [phone2, setPhone2] = useState("");
  const [address, setAddress] = useState("");

  // 3️⃣ Work Experience
  const [workExpCategory, setWorkExpCategory] = useState("With Work Experience");
  const [workExpList, setWorkExpList] = useState<
    Array<{
      id: string;
      position: string;
      company: string;
      industry: string;
      monthlySalary: string;
      tenure: string;
      reasonForLeaving: string;
    }>
  >([
    {
      id: "exp-1",
      position: "",
      company: "",
      industry: "BPO / Call Center",
      monthlySalary: "",
      tenure: "",
      reasonForLeaving: ""
    }
  ]);

  // 4️⃣ Education, Affiliations, and Training
  const [educationalAttainment, setEducationalAttainment] = useState("College Graduate");
  const [schoolName, setSchoolName] = useState("");
  const [degreeCourse, setDegreeCourse] = useState("");
  const [gradYear, setGradYear] = useState("");
  const [schoolAddress, setSchoolAddress] = useState("");
  const [selectedCertifications, setSelectedCertifications] = useState<string[]>([]);
  const [customCert, setCustomCert] = useState("");
  const [trainingsAttended, setTrainingsAttended] = useState("");

  // 5️⃣ Work Readiness Questions
  const [isVaccinated, setIsVaccinated] = useState("Yes");
  const [isComfortableOnsite, setIsComfortableOnsite] = useState("Yes");
  const [isGraveyardWilling, setIsGraveyardWilling] = useState("Yes");
  const [employmentPreference, setEmploymentPreference] = useState("Full-time");
  const [hasRemoteAccess, setHasRemoteAccess] = useState("Yes");
  const [isDrugTestWilling, setIsDrugTestWilling] = useState("Yes");
  const [isBackgroundCheckWilling, setIsBackgroundCheckWilling] = useState("Yes");

  // 6️⃣ Character References
  const [ref1Name, setRef1Name] = useState("");
  const [ref1Phone, setRef1Phone] = useState("");
  const [ref1Title, setRef1Title] = useState("");
  const [ref2Name, setRef2Name] = useState("");
  const [ref2Phone, setRef2Phone] = useState("");
  const [ref2Title, setRef2Title] = useState("");
  const [ref3Name, setRef3Name] = useState("");
  const [ref3Phone, setRef3Phone] = useState("");
  const [ref3Title, setRef3Title] = useState("");

  // 7️⃣ Audio and Supporting File Upload
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioFileName, setAudioFileName] = useState("");
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeFileName, setResumeFileName] = useState("");

  // 8️⃣ Terms & Privacy
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // UI States
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedCandidateId, setSubmittedCandidateId] = useState<string | null>(null);

  const audioInputRef = useRef<HTMLInputElement | null>(null);
  const resumeInputRef = useRef<HTMLInputElement | null>(null);

  // Filter positions by search
  const filteredPositions = useMemo(() => {
    if (!positionSearchTerm) return OPEN_POSITIONS;
    return OPEN_POSITIONS.filter(
      (p) =>
        p.title.toLowerCase().includes(positionSearchTerm.toLowerCase()) ||
        p.dept.toLowerCase().includes(positionSearchTerm.toLowerCase()) ||
        p.loc.toLowerCase().includes(positionSearchTerm.toLowerCase())
    );
  }, [positionSearchTerm]);

  // Source checkbox handler
  const handleToggleSource = (source: string) => {
    if (selectedSources.includes(source)) {
      setSelectedSources(selectedSources.filter((s) => s !== source));
    } else {
      setSelectedSources([...selectedSources, source]);
    }
  };

  // Add/Remove Work Experience
  const handleAddWorkExp = () => {
    setWorkExpList([
      ...workExpList,
      {
        id: `exp-${Date.now()}`,
        position: "",
        company: "",
        industry: "BPO / Call Center",
        monthlySalary: "",
        tenure: "",
        reasonForLeaving: ""
      }
    ]);
  };

  const handleRemoveWorkExp = (id: string) => {
    if (workExpList.length <= 1) return;
    setWorkExpList(workExpList.filter((item) => item.id !== id));
  };

  const handleUpdateWorkExp = (id: string, field: string, val: string) => {
    setWorkExpList(
      workExpList.map((item) => (item.id === id ? { ...item, [field]: val } : item))
    );
  };

  // Certifications checkbox
  const handleToggleCert = (cert: string) => {
    if (selectedCertifications.includes(cert)) {
      setSelectedCertifications(selectedCertifications.filter((c) => c !== cert));
    } else {
      setSelectedCertifications([...selectedCertifications, cert]);
    }
  };

  // Handle Audio Upload
  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAudioFile(file);
      setAudioFileName(file.name);
    }
  };

  // Handle Resume Upload
  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setResumeFile(file);
      setResumeFileName(file.name);
    }
  };

  // Reset form
  const handleResetForm = () => {
    if (window.confirm("Are you sure you want to reset all form fields?")) {
      setSelectedSources(["Online Job Portals (JobStreet/Indeed/Kalibrr)"]);
      setReferrerName("");
      setReferrerContact("");
      setAppliedPosition("Customer Care Representative");
      setPositionSearchTerm("");
      setNickname("");
      setTargetLocation("Alabang Site");

      setFirstName("");
      setMiddleName("");
      setLastName("");
      setSuffix("");
      setDob("");
      setEmail("");
      setPhone1("");
      setPhone2("");
      setAddress("");

      setWorkExpCategory("With Work Experience");
      setWorkExpList([
        {
          id: `exp-${Date.now()}`,
          position: "",
          company: "",
          industry: "BPO / Call Center",
          monthlySalary: "",
          tenure: "",
          reasonForLeaving: ""
        }
      ]);

      setEducationalAttainment("College Graduate");
      setSchoolName("");
      setDegreeCourse("");
      setGradYear("");
      setSchoolAddress("");
      setSelectedCertifications([]);
      setCustomCert("");
      setTrainingsAttended("");

      setIsVaccinated("Yes");
      setIsComfortableOnsite("Yes");
      setIsGraveyardWilling("Yes");
      setEmploymentPreference("Full-time");
      setHasRemoteAccess("Yes");
      setIsDrugTestWilling("Yes");
      setIsBackgroundCheckWilling("Yes");

      setRef1Name("");
      setRef1Phone("");
      setRef1Title("");
      setRef2Name("");
      setRef2Phone("");
      setRef2Title("");
      setRef3Name("");
      setRef3Phone("");
      setRef3Title("");

      setAudioFile(null);
      setAudioFileName("");
      setResumeFile(null);
      setResumeFileName("");

      setAgreedToTerms(false);
      setFormErrors([]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Form Validation & Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: string[] = [];

    if (!appliedPosition) errors.push("Please select an open position you are applying for.");
    if (!targetLocation) errors.push("Please select a target office location.");
    if (!firstName.trim()) errors.push("First Name is required.");
    if (!lastName.trim()) errors.push("Last Name is required.");
    if (!dob) errors.push("Date of Birth is required.");
    if (!email.trim()) errors.push("Email address is required.");
    if (!phone1.trim()) errors.push("Primary Phone Number (Phone 1) is required.");
    if (!address.trim()) errors.push("Physical Home Address is required.");

    if (workExpCategory !== "Fresh Graduate / No Experience") {
      if (!workExpList[0]?.company?.trim() || !workExpList[0]?.position?.trim()) {
        errors.push("Please fill in at least one work experience entry (Role & Company).");
      }
    }

    if (!schoolName.trim()) errors.push("School / Institution Name is required.");
    if (!gradYear.trim()) errors.push("Year Graduated / Completed is required.");

    if (!ref1Name.trim() || !ref1Phone.trim()) errors.push("Character Reference 1 (Name & Phone) is required.");
    if (!ref2Name.trim() || !ref2Phone.trim()) errors.push("Character Reference 2 (Name & Phone) is required.");
    if (!ref3Name.trim() || !ref3Phone.trim()) errors.push("Character Reference 3 (Name & Phone) is required.");

    if (!audioFileName) errors.push("Mandatory Voice Audio Recording file is required.");
    if (!resumeFileName) errors.push("Mandatory Supporting Resume / CV file is required.");

    if (!agreedToTerms) errors.push("You must agree to the Terms & Conditions and Privacy Consent to submit.");

    if (errors.length > 0) {
      setFormErrors(errors);
      window.scrollTo({ top: 150, behavior: "smooth" });
      return;
    }

    setFormErrors([]);
    setIsSubmitting(true);

    // Simulate API network submission
    setTimeout(() => {
      const generatedId = `SIBS-CAN-${Math.floor(1000 + Math.random() * 9000)}`;

      // Calculate age
      let age = 24;
      if (dob) {
        const birthYear = new Date(dob).getFullYear();
        if (!isNaN(birthYear)) age = Math.max(18, 2026 - birthYear);
      }

      // Map affiliations
      const certs = [...selectedCertifications];
      if (customCert.trim()) certs.push(customCert.trim());

      // Format work experience array
      const mappedWorkExp: WorkExperience[] =
        workExpCategory === "Fresh Graduate / No Experience"
          ? []
          : workExpList.map((item) => ({
              company: item.company || "N/A",
              position: item.position || "N/A",
              industry: item.industry || "BPO / Call Center",
              tenure: item.tenure || "1 Year",
              monthlySalary: item.monthlySalary ? `₱${item.monthlySalary}` : "₱25,000",
              reasonForLeaving: item.reasonForLeaving || "Career growth & advancement"
            }));

      const newCandidate: Candidate = {
        id: generatedId,
        name: `${firstName} ${middleName ? middleName + " " : ""}${lastName}${
          suffix ? " " + suffix : ""
        }`,
        email: email,
        phone: phone1,
        appliedPosition: appliedPosition,
        department:
          OPEN_POSITIONS.find((p) => p.title === appliedPosition)?.dept ||
          "Contact Center Operations",
        accountFit: targetLocation,
        sourcingChannel:
          selectedSources.length > 0 ? selectedSources.join(", ") : "Public Web Portal",
        recruiter: "Public Applicant (Self-Registered)",
        applicationDate: new Date().toISOString().split("T")[0],
        status: "New Applicant",
        isPublicEntry: true,
        lastActivityDate: new Date().toISOString().split("T")[0],
        notes: `Registered via Public Talent Pool Application Form. Preferred Nickname: ${
          nickname || "N/A"
        }. Assigned Site: ${targetLocation}.`,

        address: address,
        dob: dob,
        age: age,
        gender: "Prefer not to say",
        civilStatus: "Single",
        citizenship: "Filipino",

        workExperience: mappedWorkExp,
        education: [
          {
            level: educationalAttainment === "High School" ? "High School" :
                   educationalAttainment === "Senior High" ? "Senior High" :
                   educationalAttainment === "Vocational" ? "Vocational" :
                   educationalAttainment === "Master's Degree" ? "Master's" :
                   educationalAttainment === "Doctorate Degree" ? "Doctorate" : "College",
            schoolName: schoolName,
            degreeCourse: degreeCourse || "Secondary / General Studies",
            gradYear: gradYear,
            address: schoolAddress || "Philippines"
          }
        ],

        skills: [
          appliedPosition,
          "Customer Experience Management",
          "Effective Communication",
          "Problem Solving",
          "Active Listening"
        ],

        vaccinationStatus: isVaccinated === "Yes" ? "Fully Vaccinated" : "Not Vaccinated",
        willingOnSite: isComfortableOnsite === "Yes",
        graveyardShiftReadiness: isGraveyardWilling === "Yes",
        employmentInterest: employmentPreference,

        characterReferences: [
          {
            name: ref1Name,
            company: ref1Title || "Professional Reference 1",
            title: "Supervisor / Colleague",
            contactNumber: ref1Phone,
            email: ""
          },
          {
            name: ref2Name,
            company: ref2Title || "Professional Reference 2",
            title: "Supervisor / Colleague",
            contactNumber: ref2Phone,
            email: ""
          },
          {
            name: ref3Name,
            company: ref3Title || "Professional Reference 3",
            title: "Academic / Personal Reference",
            contactNumber: ref3Phone,
            email: ""
          }
        ],

        hasVoiceRecording: true,
        audioFileName: audioFileName || "Applicant_VoiceIntro.mp3",
        resumeFileName: resumeFileName || "Applicant_Resume.pdf",

        requirements: {
          torDiploma: "Pending",
          nbiClearance: "Pending",
          medicalCheck: "Pending",
          bir2316: "Pending",
          sssNo: "Pending",
          philHealthNo: "Pending",
          pagIbigNo: "Pending"
        },

        history: [
          {
            date: new Date().toLocaleString(),
            action: "Application Submitted via Public Portal",
            user: "Candidate Self-Registration"
          }
        ]
      };

      if (onAddCandidate) {
        onAddCandidate(newCandidate);
      }

      setIsSubmitting(false);
      setSubmittedCandidateId(generatedId);
    }, 1200);
  };

  // Completion calculation for header progress bar
  const completionPercentage = useMemo(() => {
    let filled = 0;
    const total = 14;

    if (appliedPosition) filled++;
    if (firstName) filled++;
    if (lastName) filled++;
    if (dob) filled++;
    if (email) filled++;
    if (phone1) filled++;
    if (address) filled++;
    if (schoolName) filled++;
    if (gradYear) filled++;
    if (ref1Name && ref1Phone) filled++;
    if (ref2Name && ref2Phone) filled++;
    if (ref3Name && ref3Phone) filled++;
    if (audioFileName) filled++;
    if (resumeFileName) filled++;

    return Math.round((filled / total) * 100);
  }, [
    appliedPosition,
    firstName,
    lastName,
    dob,
    email,
    phone1,
    address,
    schoolName,
    gradYear,
    ref1Name,
    ref1Phone,
    ref2Name,
    ref2Phone,
    ref3Name,
    ref3Phone,
    audioFileName,
    resumeFileName
  ]);

  const scrollToSection = (id: string, stepNum: number) => {
    setActiveStepTab(stepNum);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -120;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const stepsList = [
    { num: 1, id: "sec-source", label: "Position" },
    { num: 2, id: "sec-personal", label: "Personal" },
    { num: 3, id: "sec-experience", label: "Experience" },
    { num: 4, id: "sec-education", label: "Education" },
    { num: 5, id: "sec-readiness", label: "Readiness" },
    { num: 6, id: "sec-references", label: "References" },
    { num: 7, id: "sec-files", label: "Audio & CV" },
    { num: 8, id: "sec-consent", label: "Consent" }
  ];

  return (
    <div className="min-h-screen bg-[#FAF7EE] text-[#101828] font-sans pb-24 selection:bg-[#042C51] selection:text-white" id="public-application-root">
      
      {/* ==================== 1. SIBS WEBSITE BRAND NAVBAR ==================== */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          
          {/* SiBS Logo */}
          <div className="flex items-center gap-3">
            <span className="text-3xl font-black tracking-tight text-[#042C51] font-sans">
              SiBS
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {onNavigateToTalentPool && (
              <button
                type="button"
                id="btn-return-talent-pool"
                onClick={onNavigateToTalentPool}
                className="px-3.5 py-1.5 bg-[#042C51] hover:bg-[#063b6d] text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Users className="w-3.5 h-3.5 text-[#FFC72C]" />
                <span className="hidden sm:inline">Talent Pool Dashboard</span>
              </button>
            )}
            
            <div className="flex items-center gap-2 bg-emerald-50/80 border border-emerald-200 px-3 py-1.5 rounded-lg text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-emerald-800 text-[11px] font-bold hidden sm:inline">
                Direct Queue
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* ==================== 2. AUTHENTIC SIBS HERO SECTION ==================== */}
      <section className="bg-[#FAF7EE] border-b border-[#EAE5D8] pt-10 sm:pt-14 pb-12 sm:pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl space-y-5">
            
            {/* Display Headline with Authentic Yellow Highlight Stroke */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#042C51] tracking-tight leading-[1.12]">
              <span className="relative inline-block mr-3">
                <span className="relative z-10">Your Partner</span>
                <span className="absolute bottom-1 sm:bottom-2 left-0 right-0 h-3.5 sm:h-4.5 bg-[#FFC72C] z-0"></span>
              </span>
              <span>for</span>
              <span className="block mt-1">Extraordinary</span>
              <span className="block mt-1">Outsourcing Solutions</span>
            </h1>

            {/* Sub-headline */}
            <p className="text-base sm:text-lg text-slate-700 font-normal leading-relaxed max-w-2xl pt-1">
              Welcome to the SiBS Talent Pool. Complete your master application form, submit your voice introduction, and get directly queued for active recruitment ramps across our global delivery centers.
            </p>

            {/* Quick Badges */}
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-semibold text-slate-700">
              <span className="flex items-center gap-1.5 bg-[#EFEADF] px-3 py-1.5 rounded-lg text-slate-800 border border-[#E2DCCE]">
                <MapPin className="w-3.5 h-3.5 text-[#042C51]" />
                Mandaluyong • Alabang • Clark • Cebu • Davao • Remote
              </span>
              <span className="flex items-center gap-1.5 bg-[#EFEADF] px-3 py-1.5 rounded-lg text-slate-800 border border-[#E2DCCE]">
                <Clock className="w-3.5 h-3.5 text-[#042C51]" />
                24-Hour Review Turnaround
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 3. SECTION NAVIGATION & PROGRESS BAR ==================== */}
      <div className="bg-[#FAF7EE]/95 backdrop-blur-md border-b border-[#EAE5D8] sticky top-[69px] z-30 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
          {/* Steps List */}
          <div className="overflow-x-auto scrollbar-none flex items-center gap-2 py-0.5">
            {stepsList.map((step) => {
              const isActive = activeStepTab === step.num;
              return (
                <button
                  key={step.num}
                  type="button"
                  onClick={() => scrollToSection(step.id, step.num)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? "bg-[#042C51] text-white shadow-xs"
                      : "bg-[#EFEADF] text-slate-700 hover:bg-[#E5DFD2] hover:text-[#042C51]"
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full text-[9px] flex items-center justify-center font-black ${
                    isActive ? "bg-[#FFC72C] text-[#042C51]" : "bg-[#DDD7C8] text-slate-700"
                  }`}>
                    {step.num}
                  </span>
                  <span>{step.label}</span>
                </button>
              );
            })}
          </div>

          {/* Mini Completion Indicator */}
          <div className="hidden lg:flex items-center gap-2.5 shrink-0 pl-3 border-l border-[#EAE5D8]">
            <span className="text-[11px] font-bold text-slate-600">Progress:</span>
            <div className="w-20 bg-[#EFEADF] h-2 rounded-full overflow-hidden border border-[#E2DCCE]">
              <div
                className="bg-[#FFC72C] h-full transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
            <span className="text-xs font-black text-[#042C51]">{completionPercentage}%</span>
          </div>
        </div>
      </div>

      {/* ==================== 4. APPLICATION FORM CONTAINER ==================== */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-8">

        {/* Validation Errors Banner */}
        {formErrors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-rose-50 border-2 border-rose-300 text-rose-900 p-5 rounded-2xl mb-8 shadow-md space-y-2"
          >
            <div className="flex items-center gap-2 font-black text-xs text-rose-800 uppercase tracking-wide">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>Please complete the missing required fields ({formErrors.length}):</span>
            </div>
            <ul className="list-disc list-inside text-xs space-y-1 text-rose-700 font-semibold pl-1">
              {formErrors.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* ==================== APPLICATION FORM ==================== */}
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* SECTION 1: Sourcing & Open Position */}
          <section id="sec-source" className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E6ECF2] shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#042C51] text-white flex items-center justify-center font-black text-sm shadow-md">
                  1
                </div>
                <div>
                  <h3 className="text-sm font-black text-[#042C51] uppercase tracking-wide flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-[#FF5C28]" />
                    Sourcing Channel & Applied Position
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">Tell us where you found us and what role matches your expertise.</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">Step 1 of 8</span>
            </div>

            {/* Sourcing Channel Multi-select */}
            <div className="space-y-2">
              <label className="block text-xs font-black text-[#042C51] uppercase tracking-wider">
                How did you first hear about SiBS Contact Center? <span className="text-[#FF5C28]">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 bg-[#F8FAFC] p-4 rounded-2xl border border-slate-200">
                {SOURCES_LIST.map((source) => {
                  const isChecked = selectedSources.includes(source);
                  return (
                    <label
                      key={source}
                      className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all duration-150 ${
                        isChecked
                          ? "bg-[#FFF5F2] border-[#FF5C28] text-[#042C51] font-bold shadow-xs"
                          : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleSource(source)}
                        className="mt-0.5 text-[#FF5C28] focus:ring-[#FF5C28] rounded cursor-pointer"
                      />
                      <span className="leading-tight">{source}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Referrer Details if Employee Referral */}
            {selectedSources.includes("Employee Referral Program") && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#FFF5F2] p-5 rounded-2xl border border-[#FF5C28]/30"
              >
                <div>
                  <label className="block text-xs font-black text-[#042C51] mb-1">
                    Referrer Employee Full Name <span className="text-[#FF5C28]">*</span>
                  </label>
                  <input
                    type="text"
                    value={referrerName}
                    onChange={(e) => setReferrerName(e.target.value)}
                    placeholder="e.g. Alena Batacan (Operations)"
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:border-[#FF5C28] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-[#042C51] mb-1">
                    Referrer Employee Email or Contact <span className="text-[#FF5C28]">*</span>
                  </label>
                  <input
                    type="text"
                    value={referrerContact}
                    onChange={(e) => setReferrerContact(e.target.value)}
                    placeholder="e.g. alena.b@thesiblingssolutions.com"
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:border-[#FF5C28] outline-none"
                  />
                </div>
              </motion.div>
            )}

            {/* Searchable Position Selector & Target Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="relative">
                <label className="block text-xs font-black text-[#042C51] uppercase tracking-wider mb-1">
                  Target Open Position <span className="text-[#FF5C28]">*</span>
                </label>
                
                <div
                  onClick={() => setIsPositionDropdownOpen(!isPositionDropdownOpen)}
                  className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-slate-200 rounded-xl text-xs font-bold text-slate-800 flex items-center justify-between cursor-pointer hover:bg-white hover:border-[#042C51] transition-all"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Briefcase className="w-4 h-4 text-[#FF5C28] shrink-0" />
                    <span className={appliedPosition ? "text-[#042C51] truncate" : "text-slate-400 font-normal"}>
                      {appliedPosition || "Select position from active ramps..."}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                </div>

                {isPositionDropdownOpen && (
                  <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-2xl z-30 p-2.5 space-y-2 max-h-72 overflow-y-auto">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                      <input
                        type="text"
                        value={positionSearchTerm}
                        onChange={(e) => setPositionSearchTerm(e.target.value)}
                        placeholder="Search positions, accounts, skills..."
                        className="w-full pl-9 pr-3 py-2 bg-[#F8FAFC] border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-[#042C51]"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      {filteredPositions.map((pos) => (
                        <div
                          key={pos.id}
                          onClick={() => {
                            setAppliedPosition(pos.title);
                            setIsPositionDropdownOpen(false);
                          }}
                          className={`p-3 rounded-xl text-xs cursor-pointer transition-colors flex items-center justify-between ${
                            appliedPosition === pos.title 
                              ? "bg-[#FFF5F2] font-bold text-[#042C51] border border-[#FF5C28]/40" 
                              : "hover:bg-slate-50 text-slate-700"
                          }`}
                        >
                          <div>
                            <p className="font-bold text-[#042C51]">{pos.title}</p>
                            <p className="text-[10px] text-slate-500 font-medium">{pos.dept} • {pos.loc} • {pos.shift}</p>
                          </div>
                          {appliedPosition === pos.title && <Check className="w-4 h-4 text-[#FF5C28]" />}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Target Location / Site Preference */}
              <div>
                <label className="block text-xs font-black text-[#042C51] uppercase tracking-wider mb-1">
                  Primary Delivery Site Preference <span className="text-[#FF5C28]">*</span>
                </label>
                <select
                  value={targetLocation}
                  onChange={(e) => setTargetLocation(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:border-[#042C51] outline-none transition-all cursor-pointer"
                >
                  <option value="Alabang Site">Alabang Site (Muntinlupa City, Metro Manila)</option>
                  <option value="Cebu IT Park Site">Cebu IT Park Site (Cebu City)</option>
                  <option value="Clark Freeport Zone Site">Clark Freeport Zone Site (Pampanga)</option>
                  <option value="Davao Matina IT Park Site">Davao Matina IT Park Site (Davao City)</option>
                  <option value="Remote / Work From Home">Remote / Work From Home</option>
                  <option value="Flexible / Anywhere">Flexible / Any Site</option>
                </select>
              </div>

              {/* Preferred Nickname */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-black text-[#042C51] uppercase tracking-wider mb-1">
                  Preferred Nickname (Optional)
                </label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="e.g. Ralph / Althea"
                  className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-[#042C51] outline-none"
                />
              </div>
            </div>
          </section>

          {/* SECTION 2: Personal Information */}
          <section id="sec-personal" className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E6ECF2] shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#042C51] text-white flex items-center justify-center font-black text-sm shadow-md">
                  2
                </div>
                <div>
                  <h3 className="text-sm font-black text-[#042C51] uppercase tracking-wide flex items-center gap-2">
                    <User className="w-4 h-4 text-[#FF5C28]" />
                    Personal Information & Contact Details
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">Please provide accurate contact information for assessment invitations.</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">Step 2 of 8</span>
            </div>

            {/* Name Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
              <div>
                <label className="block text-xs font-black text-[#042C51] mb-1">
                  First Name <span className="text-[#FF5C28]">*</span>
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g. Ralph Joseph"
                  className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-[#042C51] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#042C51] mb-1">Middle Name</label>
                <input
                  type="text"
                  value={middleName}
                  onChange={(e) => setMiddleName(e.target.value)}
                  placeholder="e.g. Santos"
                  className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-[#042C51] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#042C51] mb-1">
                  Last Name <span className="text-[#FF5C28]">*</span>
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="e.g. Dulla"
                  className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-[#042C51] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#042C51] mb-1">Suffix</label>
                <input
                  type="text"
                  value={suffix}
                  onChange={(e) => setSuffix(e.target.value)}
                  placeholder="e.g. Jr. / III"
                  className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-[#042C51] outline-none"
                />
              </div>
            </div>

            {/* DOB & Contacts Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-xs font-black text-[#042C51] mb-1">
                  Date of Birth <span className="text-[#FF5C28]">*</span>
                </label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-[#042C51] outline-none cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#042C51] mb-1">
                  Email Address <span className="text-[#FF5C28]">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. applicant@gmail.com"
                  className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-[#042C51] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#042C51] mb-1">
                  Phone 1 (Primary SMS) <span className="text-[#FF5C28]">*</span>
                </label>
                <input
                  type="text"
                  value={phone1}
                  onChange={(e) => setPhone1(e.target.value)}
                  placeholder="e.g. 09171234567"
                  className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-slate-200 rounded-xl text-xs font-mono font-medium focus:bg-white focus:border-[#042C51] outline-none"
                />
              </div>
            </div>

            {/* Secondary Phone & Physical Address */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-xs font-black text-[#042C51] mb-1">Phone 2 (Secondary / Optional)</label>
                <input
                  type="text"
                  value={phone2}
                  onChange={(e) => setPhone2(e.target.value)}
                  placeholder="e.g. 09209876543"
                  className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-slate-200 rounded-xl text-xs font-mono font-medium focus:bg-white focus:border-[#042C51] outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-black text-[#042C51] mb-1">
                  Complete Residential Address <span className="text-[#FF5C28]">*</span>
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street, Barangay, City, Province / Zip Code"
                  className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-[#042C51] outline-none"
                />
              </div>
            </div>
          </section>

          {/* SECTION 3: Work Experience History */}
          <section id="sec-experience" className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E6ECF2] shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#042C51] text-white flex items-center justify-center font-black text-sm shadow-md">
                  3
                </div>
                <div>
                  <h3 className="text-sm font-black text-[#042C51] uppercase tracking-wide flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#FF5C28]" />
                    Work Experience History
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">Include your recent BPO, corporate, or customer-facing roles.</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">Step 3 of 8</span>
            </div>

            {/* Experience Category Selector */}
            <div>
              <label className="block text-xs font-black text-[#042C51] uppercase tracking-wider mb-2">
                Work Experience Level <span className="text-[#FF5C28]">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  "Fresh Graduate / No Experience",
                  "With Work Experience",
                  "1-2 Years BPO",
                  "3-5 Years BPO",
                  "5+ Years (Leadership/SME)"
                ].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setWorkExpCategory(cat)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      workExpCategory === cat
                        ? "bg-[#042C51] text-white shadow-sm"
                        : "bg-[#F8FAFC] text-slate-700 hover:bg-slate-100 border border-slate-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Work Experience Cards */}
            {workExpCategory !== "Fresh Graduate / No Experience" && (
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[#042C51] uppercase tracking-wider">
                    Employment Record Cards ({workExpList.length})
                  </span>
                  <button
                    type="button"
                    onClick={handleAddWorkExp}
                    className="px-3.5 py-1.5 bg-[#FF5C28] hover:bg-[#E04412] text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Another Work Experience</span>
                  </button>
                </div>

                <div className="space-y-3.5">
                  {workExpList.map((item, index) => (
                    <div
                      key={item.id}
                      className="bg-[#F8FAFC] p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4 relative"
                    >
                      <div className="flex justify-between items-center border-b border-slate-200 pb-2.5">
                        <span className="text-[10px] font-black bg-[#042C51] text-white px-3 py-1 rounded-full uppercase tracking-wider">
                          Employment #{index + 1}
                        </span>
                        {workExpList.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveWorkExp(item.id)}
                            className="text-rose-600 hover:text-rose-800 p-1.5 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
                            title="Remove Experience"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                        <div>
                          <label className="block text-xs font-black text-[#042C51] mb-1">
                            Role / Position Title <span className="text-[#FF5C28]">*</span>
                          </label>
                          <input
                            type="text"
                            value={item.position}
                            onChange={(e) => handleUpdateWorkExp(item.id, "position", e.target.value)}
                            placeholder="e.g. Customer Support Rep"
                            className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:border-[#042C51] outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-black text-[#042C51] mb-1">
                            Company Name <span className="text-[#FF5C28]">*</span>
                          </label>
                          <input
                            type="text"
                            value={item.company}
                            onChange={(e) => handleUpdateWorkExp(item.id, "company", e.target.value)}
                            placeholder="e.g. Teleperformance / Concentrix"
                            className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:border-[#042C51] outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-black text-[#042C51] mb-1">Industry</label>
                          <select
                            value={item.industry}
                            onChange={(e) => handleUpdateWorkExp(item.id, "industry", e.target.value)}
                            className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:border-[#042C51] outline-none cursor-pointer"
                          >
                            <option value="BPO / Call Center">BPO / Call Center</option>
                            <option value="Healthcare & Nursing">Healthcare & Insurance</option>
                            <option value="Information Technology">Information Technology</option>
                            <option value="Financial & Banking">Financial & Banking</option>
                            <option value="Retail & E-Commerce">Retail & E-Commerce</option>
                            <option value="Telecom & Cable">Telecom & Cable</option>
                            <option value="Others">Others</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                        <div>
                          <label className="block text-xs font-black text-[#042C51] mb-1">Monthly Salary (PHP)</label>
                          <input
                            type="text"
                            value={item.monthlySalary}
                            onChange={(e) => handleUpdateWorkExp(item.id, "monthlySalary", e.target.value)}
                            placeholder="e.g. 26000"
                            className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-semibold focus:border-[#042C51] outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-black text-[#042C51] mb-1">Length of Tenure</label>
                          <input
                            type="text"
                            value={item.tenure}
                            onChange={(e) => handleUpdateWorkExp(item.id, "tenure", e.target.value)}
                            placeholder="e.g. 1 yr 6 mos"
                            className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:border-[#042C51] outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-black text-[#042C51] mb-1">Reason for Leaving</label>
                          <input
                            type="text"
                            value={item.reasonForLeaving}
                            onChange={(e) => handleUpdateWorkExp(item.id, "reasonForLeaving", e.target.value)}
                            placeholder="e.g. Career growth"
                            className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:border-[#042C51] outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* SECTION 4: Education, Affiliations, and Training */}
          <section id="sec-education" className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E6ECF2] shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#042C51] text-white flex items-center justify-center font-black text-sm shadow-md">
                  4
                </div>
                <div>
                  <h3 className="text-sm font-black text-[#042C51] uppercase tracking-wide flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-[#FF5C28]" />
                    Education, Affiliations & Certifications
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">Educational background and professional licenses.</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">Step 4 of 8</span>
            </div>

            {/* Educational Attainment Select */}
            <div>
              <label className="block text-xs font-black text-[#042C51] uppercase tracking-wider mb-1">
                Highest Educational Attainment <span className="text-[#FF5C28]">*</span>
              </label>
              <select
                value={educationalAttainment}
                onChange={(e) => setEducationalAttainment(e.target.value)}
                className="w-full max-w-md px-4 py-2.5 bg-[#F8FAFC] border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:border-[#042C51] outline-none cursor-pointer"
              >
                <option value="High School">High School (Old Curriculum)</option>
                <option value="Senior High">Senior High School (K-12)</option>
                <option value="College Level">College Undergraduate (Completed at least 2 years)</option>
                <option value="College Graduate">College Bachelor's Degree Graduate</option>
                <option value="Vocational">Vocational / TESDA NC Holder</option>
                <option value="Master's Degree">Master's Degree</option>
                <option value="Doctorate Degree">Doctorate Degree</option>
              </select>
            </div>

            {/* School Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5 bg-[#F8FAFC] p-5 rounded-2xl border border-slate-200">
              <div className="sm:col-span-2">
                <label className="block text-xs font-black text-[#042C51] mb-1">
                  School / University Name <span className="text-[#FF5C28]">*</span>
                </label>
                <input
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  placeholder="e.g. Polytechnic University of the Philippines"
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:border-[#042C51] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#042C51] mb-1">Course / Degree</label>
                <input
                  type="text"
                  value={degreeCourse}
                  onChange={(e) => setDegreeCourse(e.target.value)}
                  placeholder="e.g. BS Information Tech"
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:border-[#042C51] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#042C51] mb-1">
                  Year Graduated <span className="text-[#FF5C28]">*</span>
                </label>
                <input
                  type="text"
                  value={gradYear}
                  onChange={(e) => setGradYear(e.target.value)}
                  placeholder="e.g. 2023"
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:border-[#042C51] outline-none"
                />
              </div>
            </div>

            {/* Affiliations & Certifications Chips */}
            <div className="space-y-2">
              <label className="block text-xs font-black text-[#042C51] uppercase tracking-wider">
                Affiliations and Certifications (Check all that apply)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 bg-[#F8FAFC] p-4 rounded-2xl border border-slate-200">
                {CERTIFICATIONS_LIST.map((cert) => {
                  const isChecked = selectedCertifications.includes(cert);
                  return (
                    <label
                      key={cert}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                        isChecked
                          ? "bg-[#FFF5F2] border-[#FF5C28] text-[#042C51] font-bold shadow-xs"
                          : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleCert(cert)}
                        className="text-[#FF5C28] focus:ring-[#FF5C28] rounded cursor-pointer"
                      />
                      <span>{cert}</span>
                    </label>
                  );
                })}
              </div>

              {selectedCertifications.includes("Other License / Professional Certification") && (
                <div className="pt-2">
                  <input
                    type="text"
                    value={customCert}
                    onChange={(e) => setCustomCert(e.target.value)}
                    placeholder="Specify license / certification (e.g. US RN License / CompTIA / Cisco CCNA)"
                    className="w-full px-4 py-2.5 bg-white border border-[#FF5C28] rounded-xl text-xs font-bold text-slate-800 outline-none"
                  />
                </div>
              )}
            </div>

            {/* Trainings and Seminars */}
            <div>
              <label className="block text-xs font-black text-[#042C51] uppercase tracking-wider mb-1">
                Trainings & Professional Seminars Attended
              </label>
              <textarea
                rows={2}
                value={trainingsAttended}
                onChange={(e) => setTrainingsAttended(e.target.value)}
                placeholder="List any BPO training, customer service workshops, technical bootcamps, or leadership seminars..."
                className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-[#042C51] outline-none leading-relaxed"
              />
            </div>
          </section>

          {/* SECTION 5: Work Readiness Questions */}
          <section id="sec-readiness" className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E6ECF2] shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#042C51] text-white flex items-center justify-center font-black text-sm shadow-md">
                  5
                </div>
                <div>
                  <h3 className="text-sm font-black text-[#042C51] uppercase tracking-wide flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#FF5C28]" />
                    Work Readiness & Shift Alignment
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">Verify your readiness for 24/7 BPO shift schedules and operational standards.</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">Step 5 of 8</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Question 1 */}
              <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-slate-200 space-y-2.5">
                <label className="block text-xs font-black text-[#042C51]">
                  Are you fully vaccinated? <span className="text-[#FF5C28]">*</span>
                </label>
                <div className="flex items-center gap-4">
                  {["Yes", "No"].map((opt) => (
                    <label key={opt} className="flex items-center gap-1.5 cursor-pointer font-bold text-slate-800 text-xs">
                      <input
                        type="radio"
                        name="vac_pub"
                        value={opt}
                        checked={isVaccinated === opt}
                        onChange={(e) => setIsVaccinated(e.target.value)}
                        className="text-[#FF5C28] focus:ring-[#FF5C28]"
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Question 2 */}
              <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-slate-200 space-y-2.5">
                <label className="block text-xs font-black text-[#042C51]">
                  Are you comfortable working on-site? <span className="text-[#FF5C28]">*</span>
                </label>
                <div className="flex items-center gap-4">
                  {["Yes", "No"].map((opt) => (
                    <label key={opt} className="flex items-center gap-1.5 cursor-pointer font-bold text-slate-800 text-xs">
                      <input
                        type="radio"
                        name="onsite_pub"
                        value={opt}
                        checked={isComfortableOnsite === opt}
                        onChange={(e) => setIsComfortableOnsite(e.target.value)}
                        className="text-[#FF5C28] focus:ring-[#FF5C28]"
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Question 3 */}
              <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-slate-200 space-y-2.5">
                <label className="block text-xs font-black text-[#042C51]">
                  Are you willing to work in a graveyard shift? <span className="text-[#FF5C28]">*</span>
                </label>
                <div className="flex items-center gap-4">
                  {["Yes", "No"].map((opt) => (
                    <label key={opt} className="flex items-center gap-1.5 cursor-pointer font-bold text-slate-800 text-xs">
                      <input
                        type="radio"
                        name="grave_pub"
                        value={opt}
                        checked={isGraveyardWilling === opt}
                        onChange={(e) => setIsGraveyardWilling(e.target.value)}
                        className="text-[#FF5C28] focus:ring-[#FF5C28]"
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Question 4 */}
              <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-slate-200 space-y-2.5">
                <label className="block text-xs font-black text-[#042C51]">
                  Employment preference: <span className="text-[#FF5C28]">*</span>
                </label>
                <div className="flex items-center gap-4">
                  {["Full-time", "Part-time", "Either"].map((opt) => (
                    <label key={opt} className="flex items-center gap-1.5 cursor-pointer font-bold text-slate-800 text-xs">
                      <input
                        type="radio"
                        name="emp_pref"
                        value={opt}
                        checked={employmentPreference === opt}
                        onChange={(e) => setEmploymentPreference(e.target.value)}
                        className="text-[#FF5C28] focus:ring-[#FF5C28]"
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Question 5 */}
              <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-slate-200 space-y-2.5 sm:col-span-2">
                <label className="block text-xs font-black text-[#042C51]">
                  If assigned to a remote / hybrid setup, do you have access to a dedicated PC, stable Internet, and private workspace? <span className="text-[#FF5C28]">*</span>
                </label>
                <div className="flex items-center gap-4">
                  {["Yes", "No"].map((opt) => (
                    <label key={opt} className="flex items-center gap-1.5 cursor-pointer font-bold text-slate-800 text-xs">
                      <input
                        type="radio"
                        name="remote_access"
                        value={opt}
                        checked={hasRemoteAccess === opt}
                        onChange={(e) => setHasRemoteAccess(e.target.value)}
                        className="text-[#FF5C28] focus:ring-[#FF5C28]"
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Question 6 */}
              <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-slate-200 space-y-2.5">
                <label className="block text-xs font-black text-[#042C51]">
                  Are you willing to undergo a drug test as part of hiring? <span className="text-[#FF5C28]">*</span>
                </label>
                <div className="flex items-center gap-4">
                  {["Yes", "No"].map((opt) => (
                    <label key={opt} className="flex items-center gap-1.5 cursor-pointer font-bold text-slate-800 text-xs">
                      <input
                        type="radio"
                        name="drug_test"
                        value={opt}
                        checked={isDrugTestWilling === opt}
                        onChange={(e) => setIsDrugTestWilling(e.target.value)}
                        className="text-[#FF5C28] focus:ring-[#FF5C28]"
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Question 7 */}
              <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-slate-200 space-y-2.5">
                <label className="block text-xs font-black text-[#042C51]">
                  Are you willing to undergo a background check? <span className="text-[#FF5C28]">*</span>
                </label>
                <div className="flex items-center gap-4">
                  {["Yes", "No"].map((opt) => (
                    <label key={opt} className="flex items-center gap-1.5 cursor-pointer font-bold text-slate-800 text-xs">
                      <input
                        type="radio"
                        name="bg_check"
                        value={opt}
                        checked={isBackgroundCheckWilling === opt}
                        onChange={(e) => setIsBackgroundCheckWilling(e.target.value)}
                        className="text-[#FF5C28] focus:ring-[#FF5C28]"
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 6: Character References */}
          <section id="sec-references" className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E6ECF2] shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#042C51] text-white flex items-center justify-center font-black text-sm shadow-md">
                  6
                </div>
                <div>
                  <h3 className="text-sm font-black text-[#042C51] uppercase tracking-wide flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#FF5C28]" />
                    Character & Professional References
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">Provide 3 references (Supervisors, colleagues, or academic advisors).</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">Step 6 of 8</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Ref 1 */}
              <div className="bg-[#F8FAFC] p-4.5 rounded-2xl border border-slate-200 space-y-3">
                <span className="text-[10px] font-black bg-[#042C51] text-white px-2.5 py-0.5 rounded-full uppercase tracking-wider block w-fit">
                  Reference 1 *
                </span>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={ref1Name}
                    onChange={(e) => setRef1Name(e.target.value)}
                    placeholder="e.g. Maria Santos"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:border-[#042C51] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Company / Relationship</label>
                  <input
                    type="text"
                    value={ref1Title}
                    onChange={(e) => setRef1Title(e.target.value)}
                    placeholder="e.g. Former Team Leader"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:border-[#042C51] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="text"
                    value={ref1Phone}
                    onChange={(e) => setRef1Phone(e.target.value)}
                    placeholder="e.g. 09178889900"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-semibold focus:border-[#042C51] outline-none"
                  />
                </div>
              </div>

              {/* Ref 2 */}
              <div className="bg-[#F8FAFC] p-4.5 rounded-2xl border border-slate-200 space-y-3">
                <span className="text-[10px] font-black bg-[#042C51] text-white px-2.5 py-0.5 rounded-full uppercase tracking-wider block w-fit">
                  Reference 2 *
                </span>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={ref2Name}
                    onChange={(e) => setRef2Name(e.target.value)}
                    placeholder="e.g. Carlos Mendoza"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:border-[#042C51] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Company / Relationship</label>
                  <input
                    type="text"
                    value={ref2Title}
                    onChange={(e) => setRef2Title(e.target.value)}
                    placeholder="e.g. Senior QA Analyst"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:border-[#042C51] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="text"
                    value={ref2Phone}
                    onChange={(e) => setRef2Phone(e.target.value)}
                    placeholder="e.g. 09201112233"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-semibold focus:border-[#042C51] outline-none"
                  />
                </div>
              </div>

              {/* Ref 3 */}
              <div className="bg-[#F8FAFC] p-4.5 rounded-2xl border border-slate-200 space-y-3">
                <span className="text-[10px] font-black bg-[#042C51] text-white px-2.5 py-0.5 rounded-full uppercase tracking-wider block w-fit">
                  Reference 3 *
                </span>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={ref3Name}
                    onChange={(e) => setRef3Name(e.target.value)}
                    placeholder="e.g. Prof. Angela Cruz"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:border-[#042C51] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Company / Relationship</label>
                  <input
                    type="text"
                    value={ref3Title}
                    onChange={(e) => setRef3Title(e.target.value)}
                    placeholder="e.g. Department Head"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:border-[#042C51] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="text"
                    value={ref3Phone}
                    onChange={(e) => setRef3Phone(e.target.value)}
                    placeholder="e.g. 09187776655"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-semibold focus:border-[#042C51] outline-none"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 7: Audio Recording & Resume File Upload */}
          <section id="sec-files" className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E6ECF2] shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#042C51] text-white flex items-center justify-center font-black text-sm shadow-md">
                  7
                </div>
                <div>
                  <h3 className="text-sm font-black text-[#042C51] uppercase tracking-wide flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-[#FF5C28]" />
                    Mandatory Voice Audio & Supporting Resume
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">Record a short voice introduction answering the key questions below.</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">Step 7 of 8</span>
            </div>

            {/* Audio Instructions Callout */}
            <div className="bg-gradient-to-br from-[#FFF5F2] to-[#FFEFEA] border-2 border-[#FF5C28]/40 p-5 rounded-2xl space-y-2.5">
              <div className="flex items-center gap-2 font-black text-[#042C51] text-xs uppercase tracking-wide">
                <Headphones className="w-4 h-4 text-[#FF5C28]" />
                <span>Mandatory Voice Audio Recording Instructions (1-2 minutes)</span>
              </div>
              <p className="text-xs text-slate-700 font-semibold leading-relaxed">
                Please record your clear voice in conversational English addressing the four required points:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold text-[#042C51] bg-white p-3 rounded-xl border border-[#FF5C28]/20">
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-[#FF5C28] text-white text-[10px] flex items-center justify-center shrink-0 mt-0.5">1</span>
                  <span>Why did you apply for this position?</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-[#FF5C28] text-white text-[10px] flex items-center justify-center shrink-0 mt-0.5">2</span>
                  <span>Why do you want to work with SiBS?</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-[#FF5C28] text-white text-[10px] flex items-center justify-center shrink-0 mt-0.5">3</span>
                  <span>How does this role fit your career goals?</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-[#FF5C28] text-white text-[10px] flex items-center justify-center shrink-0 mt-0.5">4</span>
                  <span>Tell us briefly about your customer background.</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Audio File Dropzone */}
              <div className="bg-[#F8FAFC] p-5 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-[#042C51] uppercase tracking-wide flex items-center gap-1.5">
                    <Volume2 className="w-4 h-4 text-[#FF5C28]" />
                    Upload Audio Recording <span className="text-[#FF5C28]">*</span>
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">Max 25MB</span>
                </div>

                <input
                  type="file"
                  ref={audioInputRef}
                  onChange={handleAudioChange}
                  accept=".mp3,.wav,.m4a,.aac,.ogg,.webm,.mp4,.flac,.amr"
                  className="hidden"
                />

                <div
                  onClick={() => audioInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-[#FF5C28] p-6 rounded-2xl text-center bg-white cursor-pointer transition-all hover:bg-orange-50/20 group"
                >
                  <Upload className="w-7 h-7 text-slate-400 group-hover:text-[#FF5C28] mx-auto mb-2 transition-colors" />
                  <p className="text-xs font-black text-[#042C51]">
                    {audioFileName ? audioFileName : "Click or Drag Audio Voice Recording Here"}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Supported: MP3, WAV, M4A, AAC, OGG, WebM
                  </p>
                </div>

                {audioFileName && (
                  <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-emerald-900 font-bold truncate max-w-[180px]">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="truncate">{audioFileName}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[10px] flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      {isPlayingAudio ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                      <span>{isPlayingAudio ? "Pause" : "Test Play"}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Resume File Dropzone */}
              <div className="bg-[#F8FAFC] p-5 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-[#042C51] uppercase tracking-wide flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-[#042C51]" />
                    Upload Supporting Resume / CV <span className="text-[#FF5C28]">*</span>
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">Max 15MB</span>
                </div>

                <input
                  type="file"
                  ref={resumeInputRef}
                  onChange={handleResumeChange}
                  accept=".pdf,.doc,.docx,.jpg,.png"
                  className="hidden"
                />

                <div
                  onClick={() => resumeInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-[#042C51] p-6 rounded-2xl text-center bg-white cursor-pointer transition-all hover:bg-slate-50 group"
                >
                  <Upload className="w-7 h-7 text-slate-400 group-hover:text-[#042C51] mx-auto mb-2 transition-colors" />
                  <p className="text-xs font-black text-[#042C51]">
                    {resumeFileName ? resumeFileName : "Click or Drag Resume / CV Document Here"}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Supported: PDF, DOC, DOCX, JPG, PNG
                  </p>
                </div>

                {resumeFileName && (
                  <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-[#042C51] font-bold truncate max-w-[200px]">
                      <FileCheck className="w-4 h-4 text-blue-600 shrink-0" />
                      <span className="truncate">{resumeFileName}</span>
                    </div>
                    <span className="text-[10px] font-black text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md uppercase">
                      Ready
                    </span>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* SECTION 8: Terms & Privacy Consent */}
          <section id="sec-consent" className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E6ECF2] shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#042C51] text-white flex items-center justify-center font-black text-sm shadow-md">
                  8
                </div>
                <div>
                  <h3 className="text-sm font-black text-[#042C51] uppercase tracking-wide flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#FF5C28]" />
                    Data Privacy Consent & Terms Compliance
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">Philippine Republic Act No. 10173 (Data Privacy Act of 2012).</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">Step 8 of 8</span>
            </div>

            <div className="bg-[#F8FAFC] p-5 rounded-2xl border border-slate-200">
              <label className="flex items-start gap-3.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1 w-5 h-5 text-[#FF5C28] focus:ring-[#FF5C28] rounded cursor-pointer shrink-0"
                />
                <span className="text-xs text-slate-700 font-semibold leading-relaxed">
                  I hereby authorize SiBS Contact Center (The Siblings Solutions) to collect, process, and retain my submitted personal data, employment history, voice recordings, and references solely for recruitment, hiring evaluation, and workforce planning in accordance with Philippine Republic Act No. 10173 (Data Privacy Act of 2012). By providing my phone number and email, I consent to receive SMS notifications and emails regarding my application status and interview schedules. <span className="text-[#FF5C28] font-black">*</span>
                </span>
              </label>
            </div>
          </section>

          {/* Form Actions Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
            <button
              type="button"
              onClick={handleResetForm}
              className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-2xl transition-colors flex items-center justify-center gap-2 cursor-pointer border border-slate-300 shadow-sm"
            >
              <RefreshCw className="w-4 h-4 text-slate-500" />
              <span>Reset Form</span>
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-10 py-3.5 bg-gradient-to-r from-[#FF5C28] to-[#E04412] hover:from-[#e04b1a] hover:to-[#c73809] text-white font-black text-sm rounded-2xl shadow-xl shadow-[#FF5C28]/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Registering to SiBS Talent Pool...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Master Application</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* ==================== 5. SUCCESS CONFIRMATION MODAL ==================== */}
      <AnimatePresence>
        {submittedCandidateId && (
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white max-w-lg w-full rounded-3xl p-7 shadow-2xl border border-slate-200 text-center space-y-5"
            >
              {/* Success Badge Icon */}
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner border border-emerald-200">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="bg-[#FFF5F2] text-[#FF5C28] text-[10px] font-black px-3 py-1 rounded-full uppercase border border-[#FF5C28]/30 tracking-wider">
                  Profile Registered In SiBS Database
                </span>
                <h3 className="text-2xl font-black text-[#042C51] mt-2">
                  Welcome to SiBS, {firstName}!
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Your master application and voice recording have been logged into our active Talent Acquisition pipeline.
                </p>
              </div>

              {/* Reference ID Card */}
              <div className="bg-[#F8FAFC] p-4.5 rounded-2xl border border-slate-200 text-left space-y-2.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-bold uppercase">Candidate Reference ID:</span>
                  <span className="font-mono font-black text-[#042C51] bg-[#E9F0FC] px-2.5 py-1 rounded-lg border border-[#042C51]/20">
                    {submittedCandidateId}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-bold uppercase">Applied Position:</span>
                  <span className="font-bold text-slate-800">{appliedPosition}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-bold uppercase">Site Location:</span>
                  <span className="font-bold text-slate-800">{targetLocation}</span>
                </div>
              </div>

              {/* Hiring Next Steps Roadmap */}
              <div className="bg-[#042C51] text-white p-4 rounded-2xl text-left space-y-2">
                <p className="text-[10px] font-black text-[#FF7A4D] uppercase tracking-wider">
                  Next Recruitment Steps
                </p>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-200">
                  <div className="flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-[#FF5C28] text-white text-[9px] font-bold flex items-center justify-center">1</span>
                    <span>AI Voice Screening</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-[#063560] text-slate-300 text-[9px] font-bold flex items-center justify-center">2</span>
                    <span>Initial Phone Interview</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-[#063560] text-slate-300 text-[9px] font-bold flex items-center justify-center">3</span>
                    <span>Operations Assessment</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-[#063560] text-slate-300 text-[9px] font-bold flex items-center justify-center">4</span>
                    <span>Job Offer & Contract</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                {onNavigateToTalentPool && (
                  <button
                    onClick={() => {
                      setSubmittedCandidateId(null);
                      onNavigateToTalentPool();
                    }}
                    className="flex-1 py-3 bg-[#042C51] hover:bg-[#073A6B] text-white font-black text-xs rounded-xl transition-colors cursor-pointer shadow-md"
                  >
                    View in Talent Pool Database
                  </button>
                )}
                <button
                  onClick={() => {
                    setSubmittedCandidateId(null);
                    handleResetForm();
                  }}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors cursor-pointer border border-slate-200"
                >
                  Submit Another Response
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
