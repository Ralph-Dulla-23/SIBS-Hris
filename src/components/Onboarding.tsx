import React, { useState, useMemo, useEffect } from "react";
import {
  UserCheck,
  Search,
  Filter,
  RefreshCw,
  Plus,
  Eye,
  CheckCircle,
  XCircle,
  FileText,
  User,
  Calendar,
  AlertCircle,
  ChevronRight,
  TrendingUp,
  X,
  Info,
  Clock,
  Briefcase,
  Layers,
  ArrowRight,
  Sparkles,
  Award,
  BookOpen,
  Settings,
  MoreVertical,
  Check,
  Star,
  Building2,
  MapPin,
  ExternalLink,
  UserPlus,
  AlertTriangle,
  ArrowUpRight,
  ShieldCheck,
  Users
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// ==========================================
// STORAGE KEYS FOR CROSS-MODULE SYNC
// ==========================================
export const ONBOARDING_STORAGE_KEY = "onboarding_records_data";
export const OFFERS_STORAGE_KEY = "offers_management_data";
export const PIPELINE_CANDIDATES_STORAGE_KEY = "pipeline_candidates_data";
export const EMPLOYEE_DIRECTORY_STORAGE_KEY = "employee_directory_records";
export const TALENT_POOL_STORAGE_KEY = "talent_pool_records";
export const PIPELINE_SYNC_EVENTS_KEY = "pipeline_sync_events";

interface OnboardingProps {
  userEmail?: string;
  onSwitchModule?: (module: string) => void;
}

export interface OnboardingRecord {
  id: string; // Onboarding ID (e.g. ONB-2026-001 or ONB-000142)
  name: string;
  email: string;
  phone: string;
  role: string;
  account: string;
  siteLocation: string; // e.g. Davao City, Manila (Ortigas), Manila (BGC), Cebu IT Park, Clark
  offerAcceptedDate: string;
  expectedStartDate: string;
  actualStartDate?: string;
  daysToStart?: number; // Pre-start calculation
  showStatus: "Pending" | "Show" | "No Show" | "Withdrawn";
  finalOutcome: "Pending Start" | "True Hire" | "No Show" | "Pre-start Withdrawal";
  owner: string; // Recruiter/Owner
  feedbackRating?: number; // 1 to 5 stars
  withdrawalReason?: string;
  withdrawalNotes?: string;
  convertedEmployeeId?: string; // SIB-2026-XXX ID when converted
  auditTrail: { date: string; action: string; user: string }[];
}

const INITIAL_ONBOARDING_RECORDS: OnboardingRecord[] = [
  {
    id: "ONB-2026-001",
    name: "Theresa Mae Santos",
    email: "theresa.mae@outlook.com",
    phone: "+63 917 554 1234",
    role: "Healthcare Support Specialist",
    account: "Elevance Health",
    siteLocation: "SiBS Davao",
    offerAcceptedDate: "2026-07-16",
    expectedStartDate: "2026-08-01",
    daysToStart: 16,
    showStatus: "Pending",
    finalOutcome: "Pending Start",
    owner: "Alena Batacan",
    feedbackRating: 5,
    auditTrail: [
      { date: "2026-07-16", action: "Imported from Candidate Pipeline (Offer Accepted)", user: "System" },
      { date: "2026-07-17", action: "Initial pre-employment welcome kit dispatched.", user: "Alena Batacan" }
    ]
  },
  {
    id: "ONB-2026-002",
    name: "Kenji Sato",
    email: "kenji.sato@gmail.com",
    phone: "+63 908 443 8910",
    role: "Customer Service Representative",
    account: "Chevron Support",
    siteLocation: "SiBS Tagum",
    offerAcceptedDate: "2026-07-15",
    expectedStartDate: "2026-07-27",
    daysToStart: 12,
    showStatus: "Pending",
    finalOutcome: "Pending Start",
    owner: "Juan dela Cruz",
    feedbackRating: 4,
    auditTrail: [
      { date: "2026-07-15", action: "Imported from Candidate Pipeline (Offer Accepted)", user: "System" },
      { date: "2026-07-18", action: "Pre-employment medical clearance completed.", user: "Juan dela Cruz" }
    ]
  },
  {
    id: "ONB-2026-003",
    name: "John Raymond Doe",
    email: "jr.doe@gmail.com",
    phone: "+63 915 221 4590",
    role: "Customer Service Representative",
    account: "Citi Global",
    siteLocation: "SiBS Mabini",
    offerAcceptedDate: "2026-07-10",
    expectedStartDate: "2026-07-18",
    actualStartDate: "2026-07-18",
    daysToStart: 8,
    showStatus: "Show",
    finalOutcome: "True Hire",
    owner: "Alena Batacan",
    convertedEmployeeId: "SIB-2026-088",
    feedbackRating: 5,
    auditTrail: [
      { date: "2026-07-10", action: "Imported from Candidate Pipeline (Offer Accepted)", user: "System" },
      { date: "2026-07-15", action: "Completed company-wide Day 1 induction.", user: "Alena Batacan" },
      { date: "2026-07-18", action: "Logged actual start. Converted to active employee #SIB-2026-088 in Employee Directory.", user: "Alena Batacan" }
    ]
  },
  {
    id: "ONB-2026-004",
    name: "Mary Cruz Alcantara",
    email: "mary_cruz99@outlook.ph",
    phone: "+63 918 332 7711",
    role: "Customer Service Representative",
    account: "Capital One Help",
    siteLocation: "SiBS Tagum",
    offerAcceptedDate: "2026-07-08",
    expectedStartDate: "2026-07-15",
    daysToStart: 7,
    showStatus: "No Show",
    finalOutcome: "No Show",
    owner: "Maria Santos",
    feedbackRating: 2,
    withdrawalReason: "Compensation Gap / Counter Offer",
    withdrawalNotes: "Candidate accepted another offer providing work-from-home allowance.",
    auditTrail: [
      { date: "2026-07-08", action: "Imported from Candidate Pipeline (Offer Accepted)", user: "System" },
      { date: "2026-07-15", action: "Failed to attend Day 1 orientation. Archived to Talent Pool.", user: "Maria Santos" }
    ]
  },
  {
    id: "ONB-2026-005",
    name: "Daniel Padilla Flores",
    email: "daniel_flores@live.com",
    phone: "+63 920 448 9912",
    role: "Healthcare Support Specialist",
    account: "Elevance Health",
    siteLocation: "Davao City",
    offerAcceptedDate: "2026-07-05",
    expectedStartDate: "2026-07-15",
    actualStartDate: "2026-07-15",
    daysToStart: 10,
    showStatus: "Show",
    finalOutcome: "True Hire",
    owner: "Juan dela Cruz",
    convertedEmployeeId: "SIB-2026-092",
    feedbackRating: 5,
    auditTrail: [
      { date: "2026-07-05", action: "Imported from Candidate Pipeline (Offer Accepted)", user: "System" },
      { date: "2026-07-15", action: "Attended orientation. Converted to Employee Directory profile.", user: "Juan dela Cruz" }
    ]
  },
  {
    id: "ONB-2026-006",
    name: "Alex G. Rivera",
    email: "alex_rivera93@gmail.com",
    phone: "+63 936 881 1290",
    role: "Technical Support Associate",
    account: "RingCentral Team",
    siteLocation: "Clark, Pampanga",
    offerAcceptedDate: "2026-06-28",
    expectedStartDate: "2026-07-12",
    daysToStart: 14,
    showStatus: "Withdrawn",
    finalOutcome: "Pre-start Withdrawal",
    owner: "Alena Batacan",
    feedbackRating: 3,
    withdrawalReason: "Location / Commute Issues",
    withdrawalNotes: "Decided to accept a role closer to Manila residence due to transit limitations.",
    auditTrail: [
      { date: "2026-06-28", action: "Imported from Candidate Pipeline (Offer Accepted)", user: "System" },
      { date: "2026-07-05", action: "Candidate sent formal withdrawal email. Archived to Talent Pool.", user: "Alena Batacan" }
    ]
  }
];

export default function Onboarding({ userEmail = "alena.batacan@thesiblingssolutions.com", onSwitchModule }: OnboardingProps) {
  // Load initial onboarding records from localStorage or default
  const [records, setRecords] = useState<OnboardingRecord[]>(() => {
    try {
      const saved = localStorage.getItem(ONBOARDING_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn("Could not read onboarding records from localStorage", e);
    }
    return INITIAL_ONBOARDING_RECORDS;
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Search & Filtering State
  const [searchTerm, setSearchTerm] = useState("");
  const [showStatusFilter, setShowStatusFilter] = useState("All");
  const [outcomeFilter, setOutcomeFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");
  const [ownerFilter, setOwnerFilter] = useState("All");

  // Selected Record Details Modal State
  const [selectedRecord, setSelectedRecord] = useState<OnboardingRecord | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // New Onboarding Form State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedAcceptedOfferId, setSelectedAcceptedOfferId] = useState<string>("");
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newRole, setNewRole] = useState("Customer Service Representative");
  const [newAccount, setNewAccount] = useState("Elevance Health");
  const [newSiteLocation, setNewSiteLocation] = useState("SiBS Tagum");
  const [newOfferAcceptedDate, setNewOfferAcceptedDate] = useState("2026-07-20");
  const [newExpectedStartDate, setNewExpectedStartDate] = useState("2026-08-01");
  const [newOwner, setNewOwner] = useState("Alena Batacan");

  // Pending Accepted Offers list (fetched from OFFERS_STORAGE_KEY or PIPELINE_CANDIDATES_STORAGE_KEY)
  const [pendingOffers, setPendingOffers] = useState<any[]>([]);

  // Outcome Workflow Modal State
  const [outcomeTargetRecord, setOutcomeTargetRecord] = useState<OnboardingRecord | null>(null);
  const [isOutcomeModalOpen, setIsOutcomeModalOpen] = useState(false);
  const [outcomeShowStatus, setOutcomeShowStatus] = useState<"Pending" | "Show" | "No Show" | "Withdrawn">("Show");
  const [outcomeActualDate, setOutcomeActualDate] = useState("2026-07-20");
  const [outcomeFeedbackRating, setOutcomeFeedbackRating] = useState<number>(5);
  const [outcomeWithdrawalReason, setOutcomeWithdrawalReason] = useState("Better compensation package elsewhere");
  const [outcomeWithdrawalNotes, setOutcomeWithdrawalNotes] = useState("");

  // Persist records to localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(records));
    } catch (e) {
      console.warn("Error saving onboarding records to localStorage", e);
    }
  }, [records]);

  // Sync accepted offers from Offers / Pipeline
  useEffect(() => {
    const fetchAcceptedOffers = () => {
      try {
        const rawOffers = localStorage.getItem(OFFERS_STORAGE_KEY);
        if (rawOffers) {
          const parsedOffers = JSON.parse(rawOffers);
          if (Array.isArray(parsedOffers)) {
            const accepted = parsedOffers.filter(
              (o: any) => o.status === "Approved" || o.status === "Signed" || o.status === "Accepted"
            );
            setPendingOffers(accepted);
          }
        }
      } catch (err) {
        console.warn("Could not parse accepted offers:", err);
      }
    };

    fetchAcceptedOffers();
    window.addEventListener("storage", fetchAcceptedOffers);
    return () => window.removeEventListener("storage", fetchAcceptedOffers);
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Helper values for unique recruiters/owners & locations
  const ownersList = useMemo(() => {
    const list = new Set<string>();
    records.forEach(r => list.add(r.owner));
    return ["All", ...Array.from(list)];
  }, [records]);

  const locationsList = useMemo(() => {
    const list = new Set<string>();
    records.forEach(r => {
      if (r.siteLocation) list.add(r.siteLocation);
    });
    return ["All", "SiBS Tagum", "SiBS Davao", "SiBS Mabini", ...Array.from(list)];
  }, [records]);

  // Calculations for Metrics Cards & Outcome Overview
  const metrics = useMemo(() => {
    const total = records.length;
    const trueHires = records.filter(r => r.finalOutcome === "True Hire").length;
    const pendingStart = records.filter(r => r.finalOutcome === "Pending Start").length;
    const noShow = records.filter(r => r.finalOutcome === "No Show").length;
    const withdrawal = records.filter(r => r.finalOutcome === "Pre-start Withdrawal").length;

    // Show Rate KPI % = (True Hires) / (True Hires + No Show + Pre-start Withdrawal)
    const totalResolved = trueHires + noShow + withdrawal;
    const showRate = totalResolved > 0 ? Math.round((trueHires / totalResolved) * 100) : 0;

    // Percentages for Outcome Analytics
    const trueHiresPct = total > 0 ? Math.round((trueHires / total) * 100) : 0;
    const pendingStartPct = total > 0 ? Math.round((pendingStart / total) * 100) : 0;
    const noShowPct = total > 0 ? Math.round((noShow / total) * 100) : 0;
    const withdrawalPct = total > 0 ? Math.round((withdrawal / total) * 100) : 0;

    // Average days to start calculation
    const recordsWithDays = records.filter(r => r.offerAcceptedDate && r.expectedStartDate);
    const avgDaysToStart = recordsWithDays.length > 0
      ? Math.round(
          recordsWithDays.reduce((acc, r) => {
            const start = new Date(r.expectedStartDate).getTime();
            const accept = new Date(r.offerAcceptedDate).getTime();
            const days = Math.max(0, Math.ceil((start - accept) / (1000 * 3600 * 24)));
            return acc + days;
          }, 0) / recordsWithDays.length
        )
      : 12;

    return {
      total,
      trueHires,
      pendingStart,
      noShow,
      withdrawal,
      showRate,
      trueHiresPct,
      pendingStartPct,
      noShowPct,
      withdrawalPct,
      avgDaysToStart
    };
  }, [records]);

  // Filtered Onboarding Records
  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      const matchSearch =
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.account.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.siteLocation && r.siteLocation.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchShowStatus = showStatusFilter === "All" ? true : r.showStatus === showStatusFilter;
      const matchOutcome = outcomeFilter === "All" ? true : r.finalOutcome === outcomeFilter;
      const matchLocation = locationFilter === "All" ? true : r.siteLocation === locationFilter;
      const matchOwner = ownerFilter === "All" ? true : r.owner === ownerFilter;

      return matchSearch && matchShowStatus && matchOutcome && matchLocation && matchOwner;
    });
  }, [records, searchTerm, showStatusFilter, outcomeFilter, locationFilter, ownerFilter]);

  // Handler: Selecting a pending offer from Create Modal
  const handleSelectPendingOffer = (offerId: string) => {
    setSelectedAcceptedOfferId(offerId);
    if (!offerId) return;

    const offer = pendingOffers.find(o => o.id === offerId);
    if (offer) {
      setNewName(offer.candidateName || "");
      setNewEmail(offer.email || `${offer.candidateName.toLowerCase().replace(/\s+/g, ".")}@gmail.com`);
      setNewPhone(offer.phone || "+63 917 123 4567");
      setNewRole(offer.appliedPosition || offer.role || "Customer Service Representative");
      setNewAccount(offer.account || "Elevance Health");
      if (offer.siteLocation) setNewSiteLocation(offer.siteLocation);
      if (offer.acceptedDate) setNewOfferAcceptedDate(offer.acceptedDate);
      if (offer.startDate) setNewExpectedStartDate(offer.startDate);
    }
  };

  // Create Manual or Imported Onboarding Record Handler
  const handleCreateOnboarding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim() || !newPhone.trim()) {
      triggerToast("Candidate name, email, and phone contact must be provided!");
      return;
    }

    const newNum = records.length + 101;
    const newId = `ONB-2026-${newNum < 100 ? "0" + newNum : newNum}`;

    // Compute days to start
    const startMs = new Date(newExpectedStartDate).getTime();
    const acceptMs = new Date(newOfferAcceptedDate).getTime();
    const computedDays = Math.max(0, Math.ceil((startMs - acceptMs) / (1000 * 3600 * 24)));

    const newRecord: OnboardingRecord = {
      id: newId,
      name: newName.trim(),
      email: newEmail.trim(),
      phone: newPhone.trim(),
      role: newRole,
      account: newAccount,
      siteLocation: newSiteLocation,
      offerAcceptedDate: newOfferAcceptedDate,
      expectedStartDate: newExpectedStartDate,
      daysToStart: computedDays,
      showStatus: "Pending",
      finalOutcome: "Pending Start",
      owner: newOwner || "Alena Batacan",
      feedbackRating: 5,
      auditTrail: [
        {
          date: new Date().toISOString().split("T")[0],
          action: selectedAcceptedOfferId
            ? `Enrolled from Accepted Offer #${selectedAcceptedOfferId}.`
            : "Enrolled manual candidate onboarding record.",
          user: userEmail.split("@")[0] || "Alena Batacan"
        }
      ]
    };

    setRecords([newRecord, ...records]);
    setIsCreateModalOpen(false);

    // Reset fields
    setSelectedAcceptedOfferId("");
    setNewName("");
    setNewEmail("");
    setNewPhone("");
    setNewRole("Customer Service Representative");
    setNewAccount("Elevance Health");
    setNewSiteLocation("Davao City");
    setNewOfferAcceptedDate("2026-07-20");
    setNewExpectedStartDate("2026-08-01");

    triggerToast(`Onboarding file ${newId} initialized for ${newRecord.name}!`);
  };

  // Open Outcome Resolution Modal
  const handleOpenOutcomeModal = (record: OnboardingRecord) => {
    setOutcomeTargetRecord(record);
    setOutcomeShowStatus(record.showStatus);
    setOutcomeActualDate(record.actualStartDate || record.expectedStartDate || new Date().toISOString().split("T")[0]);
    setOutcomeFeedbackRating(record.feedbackRating || 5);
    setOutcomeWithdrawalReason(record.withdrawalReason || "Compensation Gap / Counter Offer");
    setOutcomeWithdrawalNotes(record.withdrawalNotes || "");
    setIsOutcomeModalOpen(true);
  };

  // Save Outcome Resolution & Auto-Sync Downstream Systems (Employee Directory / Talent Pool)
  const handleSaveOutcome = () => {
    if (!outcomeTargetRecord) return;

    let finalOutcomeState: OnboardingRecord["finalOutcome"] = "Pending Start";
    if (outcomeShowStatus === "Show") {
      finalOutcomeState = "True Hire";
    } else if (outcomeShowStatus === "No Show") {
      finalOutcomeState = "No Show";
    } else if (outcomeShowStatus === "Withdrawn") {
      finalOutcomeState = "Pre-start Withdrawal";
    } else {
      finalOutcomeState = "Pending Start";
    }

    let generatedEmpId = outcomeTargetRecord.convertedEmployeeId;

    // DOWNSTREAM SYNC 1: If True Hire (Show), convert candidate to Employee Directory
    if (finalOutcomeState === "True Hire") {
      if (!generatedEmpId) {
        generatedEmpId = `SIB-2026-${Math.floor(100 + Math.random() * 900)}`;
      }

      try {
        const rawEmployees = localStorage.getItem(EMPLOYEE_DIRECTORY_STORAGE_KEY);
        let existingEmployees: any[] = rawEmployees ? JSON.parse(rawEmployees) : [];

        // Check if employee already exists
        const exists = existingEmployees.some((e: any) => e.email === outcomeTargetRecord.email || e.sibsId === generatedEmpId);
        if (!exists) {
          const nameParts = outcomeTargetRecord.name.trim().split(" ");
          const firstName = nameParts[0] || outcomeTargetRecord.name;
          const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";
          const middleName = nameParts.length > 2 ? nameParts.slice(1, -1).join(" ") : "";

          const newEmployeeRecord = {
            id: generatedEmpId,
            sibsId: generatedEmpId,
            firstName,
            middleName,
            lastName,
            nameExtension: "",
            preferredName: firstName,
            birthDate: "1997-05-15",
            placeOfBirth: outcomeTargetRecord.siteLocation || "Manila",
            gender: "Female",
            civilStatus: "Single",
            citizenship: "Filipino",
            bloodType: "O+",
            height: "165 cm",
            weight: "58 kg",
            email: outcomeTargetRecord.email,
            mobileNumber: outcomeTargetRecord.phone,
            telephone: "N/A",
            residentialAddress: `${outcomeTargetRecord.siteLocation || "Davao"}, Philippines`,
            permanentAddress: `${outcomeTargetRecord.siteLocation || "Davao"}, Philippines`,
            workSetup: "Onsite",
            gsis: "N/A",
            sss: "34-8901234-5",
            philhealth: "12-098765432-1",
            pagibig: "1211-4567-8901",
            tin: "456-789-012-000",
            department: "Operations",
            position: outcomeTargetRecord.role,
            account: outcomeTargetRecord.account,
            location: outcomeTargetRecord.siteLocation || "Davao City",
            status: "Active",
            hireDate: outcomeActualDate,
            spouse: {},
            parents: {},
            children: [],
            education: [],
            civilService: [],
            workExperience: [],
            voluntaryWork: [],
            trainings: [],
            otherSkills: [],
            references: []
          };

          existingEmployees.push(newEmployeeRecord);
          localStorage.setItem(EMPLOYEE_DIRECTORY_STORAGE_KEY, JSON.stringify(existingEmployees));
          
          // Dispatch sync event
          window.dispatchEvent(new Event("storage"));
        }
      } catch (err) {
        console.warn("Error syncing True Hire to Employee Directory:", err);
      }
    }

    // DOWNSTREAM SYNC 2: If No Show or Pre-start Withdrawal, archive candidate to Talent Pool
    if (finalOutcomeState === "No Show" || finalOutcomeState === "Pre-start Withdrawal") {
      try {
        const rawTalentPool = localStorage.getItem(TALENT_POOL_STORAGE_KEY);
        let existingCandidates: any[] = rawTalentPool ? JSON.parse(rawTalentPool) : [];

        const exists = existingCandidates.some((c: any) => c.email === outcomeTargetRecord.email);
        if (!exists) {
          const archivedCandidate = {
            id: `CAN-POOL-${Math.floor(1000 + Math.random() * 9000)}`,
            name: outcomeTargetRecord.name,
            email: outcomeTargetRecord.email,
            phone: outcomeTargetRecord.phone,
            appliedPosition: outcomeTargetRecord.role,
            skills: ["Customer Service", "BPO Operations", outcomeTargetRecord.account],
            preferredLocation: outcomeTargetRecord.siteLocation || "Davao City",
            finalAccount: outcomeTargetRecord.account,
            status: "Silver Pool",
            isPublicEntry: false,
            lastActivityDate: new Date().toISOString().split("T")[0],
            notes: `[Onboarding Drop-off] ${finalOutcomeState} - Reason: ${outcomeWithdrawalReason}. ${outcomeWithdrawalNotes}`,
            history: [
              {
                date: new Date().toISOString().split("T")[0],
                action: `Archived from Onboarding due to ${finalOutcomeState} (${outcomeWithdrawalReason})`,
                user: userEmail.split("@")[0] || "Alena Batacan"
              }
            ]
          };

          existingCandidates.push(archivedCandidate);
          localStorage.setItem(TALENT_POOL_STORAGE_KEY, JSON.stringify(existingCandidates));
          window.dispatchEvent(new Event("storage"));
        }
      } catch (err) {
        console.warn("Error syncing drop-off to Talent Pool:", err);
      }
    }

    // Update local state
    setRecords(prev =>
      prev.map(r => {
        if (r.id === outcomeTargetRecord.id) {
          const updatedAudit = [...r.auditTrail];
          let actionText = `Outcome resolved: Attendance [${outcomeShowStatus}], Outcome [${finalOutcomeState}]`;
          if (finalOutcomeState === "True Hire") {
            actionText += `. Converted to Employee Directory as #${generatedEmpId}.`;
          } else if (finalOutcomeState === "No Show" || finalOutcomeState === "Pre-start Withdrawal") {
            actionText += `. Reason: ${outcomeWithdrawalReason}. Archived to Talent Pool.`;
          }

          updatedAudit.push({
            date: new Date().toISOString().split("T")[0],
            action: actionText,
            user: userEmail.split("@")[0] || "Alena Batacan"
          });

          return {
            ...r,
            showStatus: outcomeShowStatus,
            finalOutcome: finalOutcomeState,
            actualStartDate: outcomeShowStatus === "Show" ? outcomeActualDate : undefined,
            feedbackRating: outcomeFeedbackRating,
            withdrawalReason: (outcomeShowStatus === "No Show" || outcomeShowStatus === "Withdrawn") ? outcomeWithdrawalReason : undefined,
            withdrawalNotes: (outcomeShowStatus === "No Show" || outcomeShowStatus === "Withdrawn") ? outcomeWithdrawalNotes : undefined,
            convertedEmployeeId: finalOutcomeState === "True Hire" ? generatedEmpId : r.convertedEmployeeId,
            auditTrail: updatedAudit
          };
        }
        return r;
      })
    );

    setIsOutcomeModalOpen(false);

    if (finalOutcomeState === "True Hire") {
      triggerToast(`True Hire confirmed! ${outcomeTargetRecord.name} converted to Employee Directory as #${generatedEmpId}`);
    } else if (finalOutcomeState === "No Show" || finalOutcomeState === "Pre-start Withdrawal") {
      triggerToast(`${finalOutcomeState} logged for ${outcomeTargetRecord.name}. Candidate archived to Talent Pool.`);
    } else {
      triggerToast(`Onboarding outcome updated for ${outcomeTargetRecord.name}!`);
    }
  };

  const handleResetDatabase = () => {
    setRecords(INITIAL_ONBOARDING_RECORDS);
    localStorage.removeItem(ONBOARDING_STORAGE_KEY);
    triggerToast("Onboarding database restored to default baseline metrics.");
  };

  return (
    <div className="flex-1 flex flex-col space-y-6 select-none relative" id="onboarding-module-root">
      
      {/* Toast Notification Banner */}
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

      {/* ==================== 1. HEADER & ACTIONS ==================== */}
      <section className="bg-white p-5 rounded-2xl border border-[#E6ECF2] shadow-sm flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-[#E9F0FC] text-[#042C51] px-2.5 py-0.5 rounded font-black border border-blue-100 uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5C28] inline-block animate-ping"></span>
              Onboarding Governance Hub
            </span>
            <span className="text-[10px] bg-[#FFF0EB] text-[#FF5C28] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
              Turnout & Show Rate Auditor
            </span>
          </div>
          <h1 className="text-xl font-black text-[#042C51] tracking-tight">Candidate Onboarding & True Hires Tracker</h1>
          <p className="text-xs text-[#667085] leading-normal">
            Track candidates from offer acceptance through pre-start tracking and Day 1 attendance. Convert True Hires to Employee Directory and archive drop-offs to Talent Pool.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto">
          <button
            onClick={handleResetDatabase}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Restore default onboarding dataset"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Data
          </button>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-[#FF5C28] hover:bg-[#E04B1D] text-white text-xs font-black rounded-xl shadow-md transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create Onboarding Record
          </button>
        </div>
      </section>

      {/* ==================== 2. SUMMARY METRIC CARDS ==================== */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Total Onboarding */}
        <div className="bg-white p-4 rounded-xl border border-[#E6ECF2] shadow-xs flex flex-col justify-between space-y-2">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-[10px] font-black uppercase tracking-wider">Total Onboarding</span>
            <UserCheck className="w-4 h-4 text-[#042C51]" />
          </div>
          <div>
            <span className="text-2xl font-black text-[#042C51]">{metrics.total}</span>
            <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Active candidates in pre-start</p>
          </div>
        </div>

        {/* Pending Start */}
        <div className="bg-white p-4 rounded-xl border border-[#E6ECF2] shadow-xs flex flex-col justify-between space-y-2">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-[10px] font-black uppercase tracking-wider text-blue-900">Pending Start</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <span className="text-2xl font-black text-blue-900">{metrics.pendingStart}</span>
            <p className="text-[10px] text-blue-600 font-semibold mt-0.5">Awaiting scheduled Day 1</p>
          </div>
        </div>

        {/* Show Rate % KPI */}
        <div className="bg-gradient-to-br from-[#042C51] to-[#0A467E] p-4 rounded-xl text-white shadow-sm flex flex-col justify-between space-y-2 relative overflow-hidden">
          <div className="absolute -right-2 -bottom-2 opacity-10">
            <TrendingUp className="w-20 h-20 text-white" />
          </div>
          <div className="flex justify-between items-center text-slate-200">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#FF5C28]">Show Rate KPI</span>
            <Sparkles className="w-4 h-4 text-[#FF5C28]" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-white">{metrics.showRate}%</span>
              <span className="text-[10px] text-emerald-400 font-bold">Target: 90%</span>
            </div>
            <p className="text-[10px] text-slate-300 font-medium mt-0.5">Day 1 attendance conversion</p>
          </div>
        </div>

        {/* True Hires */}
        <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-xs flex flex-col justify-between space-y-2 bg-emerald-50/20">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800">True Hires</span>
            <Award className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <span className="text-2xl font-black text-emerald-900">{metrics.trueHires}</span>
            <p className="text-[10px] text-emerald-700 font-semibold mt-0.5">Converted to Active Employees</p>
          </div>
        </div>

        {/* No Shows & Pre-start Drop-offs */}
        <div className="bg-white p-4 rounded-xl border border-rose-100 shadow-xs flex flex-col justify-between space-y-2 bg-rose-50/20">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-[10px] font-black uppercase tracking-wider text-rose-800">No Shows & Withdrawals</span>
            <XCircle className="w-4 h-4 text-rose-600" />
          </div>
          <div>
            <span className="text-2xl font-black text-rose-900">{metrics.noShow + metrics.withdrawal}</span>
            <p className="text-[10px] text-rose-700 font-semibold mt-0.5">{metrics.noShow} No-Show • {metrics.withdrawal} Withdrawn</p>
          </div>
        </div>
      </section>

      {/* ==================== 3. OUTCOME ANALYTICS & PROCESS GUIDE BANNER ==================== */}
      <section className="bg-white p-5 rounded-2xl border border-[#E6ECF2] shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-xs font-black text-[#042C51] uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#FF5C28]" />
              Onboarding Outcome Distribution & Pipeline Process Flow
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Visual breakdown of turnout resolution and pre-employment lifecycle progression.
            </p>
          </div>

          <div className="flex items-center gap-3 text-[10.5px] font-bold text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              True Hires ({metrics.trueHiresPct}%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              Pending Start ({metrics.pendingStartPct}%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              No Show ({metrics.noShowPct}%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              Withdrawn ({metrics.withdrawalPct}%)
            </span>
          </div>
        </div>

        {/* Visual Progress Bar Distribution */}
        <div className="space-y-1.5">
          <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
            <div style={{ width: `${metrics.trueHiresPct}%` }} className="bg-emerald-500 h-full transition-all duration-500" title={`True Hires: ${metrics.trueHiresPct}%`} />
            <div style={{ width: `${metrics.pendingStartPct}%` }} className="bg-blue-500 h-full transition-all duration-500" title={`Pending Start: ${metrics.pendingStartPct}%`} />
            <div style={{ width: `${metrics.noShowPct}%` }} className="bg-rose-500 h-full transition-all duration-500" title={`No Show: ${metrics.noShowPct}%`} />
            <div style={{ width: `${metrics.withdrawalPct}%` }} className="bg-amber-500 h-full transition-all duration-500" title={`Withdrawn: ${metrics.withdrawalPct}%`} />
          </div>
        </div>

        {/* Process Roadmap Steps */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5 pt-2">
          <div className="bg-blue-50/50 p-2.5 rounded-xl border border-blue-100/60 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#042C51] text-white flex items-center justify-center font-black text-xs shrink-0">1</div>
            <div>
              <p className="text-[10px] font-black uppercase text-[#042C51]">Enrollment</p>
              <p className="text-[9.5px] text-slate-500 leading-tight">Accepted offer creates ONB record with expected start.</p>
            </div>
          </div>

          <div className="bg-purple-50/50 p-2.5 rounded-xl border border-purple-100/60 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-purple-700 text-white flex items-center justify-center font-black text-xs shrink-0">2</div>
            <div>
              <p className="text-[10px] font-black uppercase text-purple-900">Pre-Start Tracking</p>
              <p className="text-[9.5px] text-slate-500 leading-tight">Calculates Days to Start ({metrics.avgDaysToStart} days avg) & clearances.</p>
            </div>
          </div>

          <div className="bg-amber-50/50 p-2.5 rounded-xl border border-amber-100/60 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center font-black text-xs shrink-0">3</div>
            <div>
              <p className="text-[10px] font-black uppercase text-amber-900">Day 1 Verification</p>
              <p className="text-[9.5px] text-slate-500 leading-tight">Verifies attendance: Show vs. No Show on orientation.</p>
            </div>
          </div>

          <div className="bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100/60 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black text-xs shrink-0">4</div>
            <div>
              <p className="text-[10px] font-black uppercase text-emerald-900">Outcome Resolution</p>
              <p className="text-[9.5px] text-slate-500 leading-tight">Syncs True Hires to Employee Directory; archives drop-offs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 4. CENTRALIZED SEARCH & FILTERS ==================== */}
      <section className="bg-white p-4 rounded-2xl border border-[#E6ECF2] shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by candidate name, ONB code, role, account, email, or site location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:bg-white focus:border-[#042C51] transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filters Group */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Show Attendance Status Filter */}
            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-[10px] font-black uppercase text-slate-400">Attendance:</span>
              <select
                value={showStatusFilter}
                onChange={(e) => setShowStatusFilter(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Show">Show</option>
                <option value="No Show">No Show</option>
                <option value="Withdrawn">Withdrawn</option>
              </select>
            </div>

            {/* Final Outcome Filter */}
            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200">
              <span className="text-[10px] font-black uppercase text-slate-400">Outcome:</span>
              <select
                value={outcomeFilter}
                onChange={(e) => setOutcomeFilter(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="All">All Outcomes</option>
                <option value="Pending Start">Pending Start</option>
                <option value="True Hire">True Hire</option>
                <option value="No Show">No Show</option>
                <option value="Pre-start Withdrawal">Pre-start Withdrawal</option>
              </select>
            </div>

            {/* Site Location Filter */}
            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-[10px] font-black uppercase text-slate-400">Site:</span>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
              >
                {locationsList.map(loc => (
                  <option key={loc} value={loc}>{loc === "All" ? "All Sites" : loc}</option>
                ))}
              </select>
            </div>

            {/* Owner/Recruiter Filter */}
            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200">
              <User className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-[10px] font-black uppercase text-slate-400">Owner:</span>
              <select
                value={ownerFilter}
                onChange={(e) => setOwnerFilter(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
              >
                {ownersList.map(o => (
                  <option key={o} value={o}>{o === "All" ? "All Recruiters" : o}</option>
                ))}
              </select>
            </div>

            {/* Reset Filters */}
            {(searchTerm || showStatusFilter !== "All" || outcomeFilter !== "All" || locationFilter !== "All" || ownerFilter !== "All") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setShowStatusFilter("All");
                  setOutcomeFilter("All");
                  setLocationFilter("All");
                  setOwnerFilter("All");
                }}
                className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ==================== 5. MAIN ONBOARDING DATA TABLE ==================== */}
      <section className="bg-white rounded-2xl border border-[#E6ECF2] shadow-sm overflow-hidden flex flex-col">
        {/* Table Header Controls */}
        <div className="px-5 py-3.5 bg-slate-50/80 border-b border-[#E6ECF2] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-[#042C51] uppercase tracking-wider">
              Onboarding Roster Directory
            </span>
            <span className="bg-[#042C51] text-white text-[10px] font-black px-2 py-0.5 rounded-full">
              {filteredRecords.length}
            </span>
          </div>

          <span className="text-[10.5px] font-semibold text-slate-500">
            Showing {filteredRecords.length} of {records.length} total candidate files
          </span>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          {filteredRecords.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <UserCheck className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-600">No onboarding records match your current criteria.</p>
              <p className="text-xs text-slate-400">Try adjusting your search terms or resetting the filter options above.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100/70 border-b border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-5">ONB Code / Candidate</th>
                  <th className="py-3 px-5">Role & Account</th>
                  <th className="py-3 px-5">Site Location</th>
                  <th className="py-3 px-5">Timeline & Days to Start</th>
                  <th className="py-3 px-5">Day 1 Attendance</th>
                  <th className="py-3 px-5">Final Outcome</th>
                  <th className="py-3 px-5">Recruiter Owner</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {filteredRecords.map((r) => {
                  // Compute Days to Start
                  const startMs = new Date(r.expectedStartDate).getTime();
                  const acceptMs = new Date(r.offerAcceptedDate).getTime();
                  const computedDays = Math.max(0, Math.ceil((startMs - acceptMs) / (1000 * 3600 * 24)));

                  return (
                    <tr key={r.id} className="hover:bg-slate-50/80 transition-colors group">
                      {/* ONB Code & Candidate Info */}
                      <td className="py-3.5 px-5">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-black text-[11px] text-[#042C51] bg-[#E9F0FC] px-1.5 py-0.5 rounded border border-blue-100">
                              {r.id}
                            </span>
                            <span className="font-extrabold text-slate-900 text-xs group-hover:text-[#FF5C28] transition-colors">
                              {r.name}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 font-medium">{r.email} • {r.phone}</p>
                        </div>
                      </td>

                      {/* Role & Account */}
                      <td className="py-3.5 px-5">
                        <div className="space-y-0.5">
                          <p className="font-bold text-slate-900">{r.role}</p>
                          <span className="inline-block text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">
                            {r.account}
                          </span>
                        </div>
                      </td>

                      {/* Site Location */}
                      <td className="py-3.5 px-5">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200/60">
                          <MapPin className="w-3 h-3 text-[#FF5C28]" />
                          {r.siteLocation || "Davao City"}
                        </span>
                      </td>

                      {/* Timeline & Days to Start */}
                      <td className="py-3.5 px-5">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-[10.5px]">
                            <span className="text-slate-400 font-semibold">Accepted:</span>
                            <span className="font-mono font-bold text-slate-700">{r.offerAcceptedDate}</span>
                          </div>
                          <div className="flex items-center gap-2 text-[10.5px]">
                            <span className="text-slate-400 font-semibold">Target Start:</span>
                            <span className="font-mono font-black text-blue-700">{r.expectedStartDate}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] font-black text-purple-800 bg-purple-50 px-2 py-0.5 rounded w-fit border border-purple-100">
                            <Clock className="w-3 h-3 text-purple-600" />
                            <span>Days to Start: {r.daysToStart || computedDays} days</span>
                          </div>
                        </div>
                      </td>

                      {/* Attendance Badge */}
                      <td className="py-3.5 px-5">
                        {r.showStatus === "Pending" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10.5px] font-black bg-blue-100/70 text-blue-900 border border-blue-200">
                            <Clock className="w-3 h-3 text-blue-600" />
                            Pending Start
                          </span>
                        )}
                        {r.showStatus === "Show" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10.5px] font-black bg-emerald-100/70 text-emerald-900 border border-emerald-200">
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                            Show (Reported)
                          </span>
                        )}
                        {r.showStatus === "No Show" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10.5px] font-black bg-rose-100/70 text-rose-900 border border-rose-200">
                            <XCircle className="w-3 h-3 text-rose-600" />
                            No Show
                          </span>
                        )}
                        {r.showStatus === "Withdrawn" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10.5px] font-black bg-amber-100/70 text-amber-900 border border-amber-200">
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                            Withdrawn
                          </span>
                        )}
                      </td>

                      {/* Final Outcome Badge */}
                      <td className="py-3.5 px-5">
                        {r.finalOutcome === "Pending Start" && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-extrabold bg-blue-50 text-blue-800 border border-blue-200">
                            Pending Start
                          </span>
                        )}
                        {r.finalOutcome === "True Hire" && (
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 text-emerald-900 uppercase tracking-wide border border-emerald-300">
                              <ShieldCheck className="w-3 h-3 text-emerald-700" />
                              True Hire
                            </span>
                            {r.convertedEmployeeId && (
                              <p className="text-[9.5px] font-mono text-emerald-800 font-bold">
                                #{r.convertedEmployeeId}
                              </p>
                            )}
                          </div>
                        )}
                        {r.finalOutcome === "No Show" && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-extrabold bg-rose-100 text-rose-900 border border-rose-200">
                            No Show Leakage
                          </span>
                        )}
                        {r.finalOutcome === "Pre-start Withdrawal" && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-200">
                            Pre-Start Withdraw
                          </span>
                        )}
                      </td>

                      {/* Recruiter Owner */}
                      <td className="py-3.5 px-5 text-slate-600 font-semibold text-[11px]">
                        {r.owner}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Outcome trigger button */}
                          {r.showStatus === "Pending" ? (
                            <button
                              onClick={() => handleOpenOutcomeModal(r)}
                              className="px-2.5 py-1 bg-[#FF5C28] hover:bg-[#E04B1D] text-white font-black text-[10.5px] rounded-lg transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
                            >
                              Set Outcome
                            </button>
                          ) : (
                            <button
                              onClick={() => handleOpenOutcomeModal(r)}
                              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              Modify Outcome
                            </button>
                          )}

                          {/* View Details Eye icon */}
                          <button
                            onClick={() => {
                              setSelectedRecord(r);
                              setIsDetailsModalOpen(true);
                            }}
                            className="p-1.5 text-slate-600 hover:text-[#042C51] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="View Full Record & Audit Logs"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Switch to Employee Directory if True Hire */}
                          {r.finalOutcome === "True Hire" && onSwitchModule && (
                            <button
                              onClick={() => onSwitchModule("Employee Directory")}
                              className="p-1.5 text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
                              title="Jump to Employee Directory"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* ==================== 6. SYSTEM PROCESS & AUDIT FOOTER NOTE ==================== */}
      <section className="bg-slate-50 border border-[#E6ECF2] p-5 rounded-2xl">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-[#042C51] shrink-0 mt-0.5" />
          <div className="space-y-1.5">
            <h4 className="text-xs font-black text-[#042C51] uppercase tracking-wider">
              Onboarding Process Governance & Real-Time Sync Policy
            </h4>
            <p className="text-[11px] text-[#667085] leading-relaxed">
              When an offer is accepted in the <strong>Offers Management</strong> module, candidates auto-enroll into this Onboarding roster in a <strong>Pending Start</strong> state. Resolving an outcome as <strong>True Hire</strong> immediately generates an active employee record in the <strong>Employee Directory</strong>. Conversely, logging a <strong>No Show</strong> or <strong>Pre-start Withdrawal</strong> archives the record to the <strong>Talent Pool</strong> with candidate feedback rating tags for recruitment leakage analysis.
            </p>
            <div className="pt-2 flex flex-wrap gap-x-5 gap-y-1 text-[10px] font-bold text-slate-600 font-mono">
              <span className="flex items-center gap-1 text-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Employee Directory Auto-Sync Active
              </span>
              <span className="flex items-center gap-1 text-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF5C28]"></span>
                Talent Pool Archival Linked
              </span>
              <span className="flex items-center gap-1 text-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                Active Auditor: {userEmail.split("@")[0]}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 7. MODALS & WORKFLOWS ==================== */}

      {/* MODAL: CREATE ONBOARDING RECORD */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="px-6 py-4 bg-[#042C51] text-white flex items-center justify-between">
                <div className="space-y-0.5">
                  <h3 className="text-sm font-black tracking-tight flex items-center gap-2">
                    <UserPlus className="w-4.5 h-4.5 text-[#FF5C28]" />
                    Register Candidate Onboarding Profile
                  </h3>
                  <p className="text-[10px] text-slate-300">Set up pre-start metrics and target start dates.</p>
                </div>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleCreateOnboarding} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                {/* Select from Pending Accepted Offers */}
                {pendingOffers.length > 0 && (
                  <div className="space-y-1 bg-blue-50/70 p-3 rounded-xl border border-blue-100">
                    <label className="text-[9.5px] font-black uppercase text-blue-900 tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-[#FF5C28]" />
                      Import Pending Accepted Offer (Optional)
                    </label>
                    <select
                      value={selectedAcceptedOfferId}
                      onChange={(e) => handleSelectPendingOffer(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-blue-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none"
                    >
                      <option value="">-- Select from accepted offer list --</option>
                      {pendingOffers.map((off) => (
                        <option key={off.id} value={off.id}>
                          {off.id} - {off.candidateName} ({off.appliedPosition || off.role} • {off.account})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="space-y-3">
                  {/* Candidate Name */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Candidate Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Maria Teresa Macapagal"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:bg-white"
                      required
                    />
                  </div>

                  {/* Email & Phone */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Email Address</label>
                      <input
                        type="email"
                        placeholder="e.g. maria.t@gmail.com"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:bg-white"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Contact Phone</label>
                      <input
                        type="text"
                        placeholder="e.g. +63 917 123 4567"
                        value={newPhone}
                        onChange={(e) => setNewPhone(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:bg-white"
                        required
                      />
                    </div>
                  </div>

                  {/* Account & Role */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Assigned Campaign Account</label>
                      <select
                        value={newAccount}
                        onChange={(e) => setNewAccount(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:bg-white"
                      >
                        <option value="Elevance Health">Elevance Health</option>
                        <option value="Chevron Support">Chevron Support</option>
                        <option value="Comcast Technical">Comcast Technical</option>
                        <option value="Citi Global">Citi Global</option>
                        <option value="Capital One Help">Capital One Help</option>
                        <option value="RingCentral Team">RingCentral Team</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Job Designation Role</label>
                      <select
                        value={newRole}
                        onChange={(e) => setNewRole(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:bg-white"
                      >
                        <option value="Customer Service Representative">Customer Service Representative</option>
                        <option value="Technical Support Associate">Technical Support Associate</option>
                        <option value="Healthcare Support Specialist">Healthcare Support Specialist</option>
                        <option value="Team Leader - BPO Operations">Team Leader - BPO Operations</option>
                      </select>
                    </div>
                  </div>

                  {/* Site Location */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Site Location</label>
                    <select
                      value={newSiteLocation}
                      onChange={(e) => setNewSiteLocation(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:bg-white"
                    >
                      <option value="SiBS Tagum">SiBS Tagum</option>
                      <option value="SiBS Davao">SiBS Davao</option>
                      <option value="SiBS Mabini">SiBS Mabini</option>
                    </select>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Offer Accepted Date</label>
                      <input
                        type="date"
                        value={newOfferAcceptedDate}
                        onChange={(e) => setNewOfferAcceptedDate(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-800 focus:outline-none focus:bg-white"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Target Start Date</label>
                      <input
                        type="date"
                        value={newExpectedStartDate}
                        onChange={(e) => setNewExpectedStartDate(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-800 focus:outline-none focus:bg-white"
                        required
                      />
                    </div>
                  </div>

                  {/* Owner */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Onboarding Recruiter / Owner</label>
                    <input
                      type="text"
                      value={newOwner}
                      onChange={(e) => setNewOwner(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600"
                    />
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#FF5C28] hover:bg-[#E04B1D] text-white font-black text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    Confirm Registration
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: ONBOARDING DETAILS & AUDIT TRAIL */}
      <AnimatePresence>
        {isDetailsModalOpen && selectedRecord && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="px-6 py-4 bg-[#042C51] text-white flex items-center justify-between">
                <div className="space-y-0.5">
                  <h3 className="text-sm font-black tracking-tight flex items-center gap-2">
                    <User className="w-4.5 h-4.5 text-[#FF5C28]" />
                    Onboarding File: {selectedRecord.id}
                  </h3>
                  <p className="text-[10px] text-slate-300">Auditable transitions timeline & profile overview.</p>
                </div>
                <button
                  onClick={() => setIsDetailsModalOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Profile Details Body */}
              <div className="p-6 space-y-4 overflow-y-auto max-h-[75vh]">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-base font-black text-[#042C51]">{selectedRecord.name}</h4>
                      <p className="text-xs text-slate-600 font-bold">{selectedRecord.role} • {selectedRecord.account}</p>
                      <span className="inline-flex items-center gap-1 text-[10px] text-slate-600 font-bold mt-1 bg-slate-200/60 px-2 py-0.5 rounded">
                        <MapPin className="w-3 h-3 text-[#FF5C28]" />
                        Site Location: {selectedRecord.siteLocation || "Davao City"}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono bg-[#E9F0FC] text-[#042C51] px-2.5 py-1 rounded-md font-black border border-blue-100">
                      Owner: {selectedRecord.owner}
                    </span>
                  </div>

                  <div className="border-t border-slate-200 my-2 pt-3 grid grid-cols-2 gap-y-2 text-xs text-slate-600 font-semibold">
                    <div>
                      <p className="text-[9px] uppercase text-slate-400 font-bold tracking-wider">Email Address</p>
                      <p className="text-slate-900 font-bold">{selectedRecord.email}</p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase text-slate-400 font-bold tracking-wider">Contact Phone</p>
                      <p className="text-slate-900 font-bold">{selectedRecord.phone}</p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase text-slate-400 font-bold tracking-wider">Offer Accepted On</p>
                      <p className="text-slate-900 font-mono font-bold">{selectedRecord.offerAcceptedDate}</p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase text-slate-400 font-bold tracking-wider">Target Start Date</p>
                      <p className="text-blue-700 font-mono font-black">{selectedRecord.expectedStartDate}</p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase text-slate-400 font-bold tracking-wider">Pre-Start Turnout Period</p>
                      <p className="text-purple-800 font-bold">{selectedRecord.daysToStart || 12} days to start</p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase text-slate-400 font-bold tracking-wider">Day 1 Attendance Status</p>
                      <p className="font-bold text-[#042C51]">{selectedRecord.showStatus}</p>
                    </div>
                  </div>

                  {/* Drop-off / Withdrawal Box if applicable */}
                  {(selectedRecord.showStatus === "No Show" || selectedRecord.showStatus === "Withdrawn") && (
                    <div className="border-t border-rose-100 pt-3 bg-rose-50/60 p-3 rounded-xl border border-rose-200 mt-2 space-y-1.5">
                      <p className="text-[9.5px] uppercase text-rose-900 font-black tracking-wider flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                        Pre-Start Drop-off Record
                      </p>
                      <p className="text-xs font-bold text-rose-900">Reason: {selectedRecord.withdrawalReason}</p>
                      {selectedRecord.feedbackRating && (
                        <div className="flex items-center gap-1 text-xs text-amber-600 font-bold">
                          <span>Feedback Rating:</span>
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star
                              key={star}
                              className={`w-3.5 h-3.5 ${
                                star <= selectedRecord.feedbackRating! ? "fill-amber-400 text-amber-400" : "text-slate-300"
                              }`}
                            />
                          ))}
                        </div>
                      )}
                      <p className="text-[11px] italic text-rose-800 bg-white/60 p-2 rounded border border-rose-100">
                        "{selectedRecord.withdrawalNotes || "No detailed notes captured."}"
                      </p>
                    </div>
                  )}

                  {/* True Hire Employee Link */}
                  {selectedRecord.finalOutcome === "True Hire" && (
                    <div className="border-t border-emerald-100 pt-3 bg-emerald-50/60 p-3 rounded-xl border border-emerald-200 mt-2 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] uppercase text-emerald-900 font-black tracking-wider flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          Converted Employee Profile
                        </p>
                        <p className="text-xs font-bold font-mono text-emerald-800">
                          Employee ID: #{selectedRecord.convertedEmployeeId || "SIB-2026-088"}
                        </p>
                      </div>
                      {onSwitchModule && (
                        <button
                          onClick={() => {
                            setIsDetailsModalOpen(false);
                            onSwitchModule("Employee Directory");
                          }}
                          className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          View Profile <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Audit Trail Log History */}
                <div className="space-y-2">
                  <h5 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                    Auditable Transition History
                  </h5>
                  <div className="border-l-2 border-slate-200 ml-2.5 pl-4 space-y-3.5">
                    {selectedRecord.auditTrail.map((log, i) => (
                      <div key={i} className="relative text-xs text-slate-700">
                        <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#042C51] border-2 border-white" />
                        <p className="font-bold text-[#042C51]">{log.action}</p>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5 font-semibold">
                          <span>{log.date}</span>
                          <span>•</span>
                          <span>Actor: {log.user}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Controls */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => {
                      setIsDetailsModalOpen(false);
                      handleOpenOutcomeModal(selectedRecord);
                    }}
                    className="px-3.5 py-2 bg-[#FF5C28] hover:bg-[#E04B1D] text-white font-extrabold text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    Set / Modify Outcome
                  </button>

                  <button
                    onClick={() => setIsDetailsModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    Dismiss Details
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: OUTCOME RESOLUTION DIALOG (SET SHOW/NO SHOW & SYNC) */}
      <AnimatePresence>
        {isOutcomeModalOpen && outcomeTargetRecord && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="px-6 py-4 bg-[#042C51] text-white flex items-center justify-between">
                <div className="space-y-0.5">
                  <h3 className="text-sm font-black tracking-tight flex items-center gap-2">
                    <Settings className="w-4.5 h-4.5 text-[#FF5C28]" />
                    Record Transition Outcome
                  </h3>
                  <p className="text-[10px] text-slate-300">Set Day 1 attendance & sync candidate profile.</p>
                </div>
                <button
                  onClick={() => setIsOutcomeModalOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form Body */}
              <div className="p-6 space-y-4">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-xs text-slate-700 space-y-1">
                  <p>Candidate: <strong className="text-[#042C51] font-black">{outcomeTargetRecord.name}</strong></p>
                  <p>Account & Role: <span className="font-bold">{outcomeTargetRecord.role} ({outcomeTargetRecord.account})</span></p>
                  <p>Target Start: <strong className="text-blue-700 font-mono font-bold">{outcomeTargetRecord.expectedStartDate}</strong></p>
                </div>

                {/* Show status selector */}
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Day 1 Attendance Status</label>
                  <select
                    value={outcomeShowStatus}
                    onChange={(e) => setOutcomeShowStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:bg-white"
                  >
                    <option value="Pending">Pending Start (Clearances Ongoing)</option>
                    <option value="Show">Show (Started Orientation / True Hire)</option>
                    <option value="No Show">No Show (Unexcused Absence on Day 1)</option>
                    <option value="Withdrawn">Withdrawn (Formal Resignation Pre-Start)</option>
                  </select>
                </div>

                {/* If SHOW -> Enter actual start date */}
                {outcomeShowStatus === "Show" && (
                  <div className="space-y-1 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                    <label className="text-[9px] font-black uppercase text-emerald-900 tracking-wider flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      Actual Start Date (Enrolls into Employee Directory)
                    </label>
                    <input
                      type="date"
                      value={outcomeActualDate}
                      onChange={(e) => setOutcomeActualDate(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold focus:outline-none text-slate-800"
                    />
                  </div>
                )}

                {/* Candidate Feedback Rating (Star Rating) */}
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Candidate Experience Feedback Rating</label>
                  <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setOutcomeFeedbackRating(star)}
                        className="p-1 hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= outcomeFeedbackRating ? "fill-amber-400 text-amber-400" : "text-slate-300"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-black text-slate-700 ml-2">{outcomeFeedbackRating} / 5 Stars</span>
                  </div>
                </div>

                {/* If NO SHOW or WITHDRAWN -> Record drop-off reasons and notes */}
                {(outcomeShowStatus === "No Show" || outcomeShowStatus === "Withdrawn") && (
                  <div className="space-y-3 bg-rose-50/40 p-3 rounded-xl border border-rose-200">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-rose-900 tracking-wider">Candidate Drop-off Reason Category</label>
                      <select
                        value={outcomeWithdrawalReason}
                        onChange={(e) => setOutcomeWithdrawalReason(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none"
                      >
                        <option value="Compensation Gap / Counter Offer">Compensation Gap / Counter Offer</option>
                        <option value="Location / Commute Issues">Location / Commute Issues</option>
                        <option value="No Response / Ghosted Day 1">No Response / Ghosted Day 1</option>
                        <option value="Personal / Family / Health Reasons">Personal / Family / Health Reasons</option>
                        <option value="Selected Competitor Role">Selected Competitor Role</option>
                        <option value="Failed Background Audit / Clearance">Failed Background Audit / Clearance</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-rose-900 tracking-wider">Decline & Feedback Audit Notes</label>
                      <textarea
                        rows={3}
                        placeholder="e.g. Candidate accepted another offer prior to expected start date. Uncontactable via mobile."
                        value={outcomeWithdrawalNotes}
                        onChange={(e) => setOutcomeWithdrawalNotes(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none placeholder-slate-400"
                      />
                    </div>
                  </div>
                )}

                {/* Controls */}
                <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                  <button
                    onClick={() => setIsOutcomeModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveOutcome}
                    className="px-4 py-2 bg-[#042C51] hover:bg-[#0a467e] text-white font-black text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-md"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-[#FF5C28]" />
                    Commit Outcome & Sync
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
