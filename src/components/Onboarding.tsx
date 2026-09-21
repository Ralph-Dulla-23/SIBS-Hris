import React, { useState, useMemo, useEffect } from "react";
import { UserCheck, UserPlus, RefreshCw, CheckCircle2, ShieldCheck, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import OnboardingStats from "./onboarding/OnboardingStats";
import OnboardingOutcomeOverview from "./onboarding/OnboardingOutcomeOverview";
import OnboardingFilters from "./onboarding/OnboardingFilters";
import OnboardingTable from "./onboarding/OnboardingTable";
import OnboardingProcessNote from "./onboarding/OnboardingProcessNote";
import CreateOnboardingModal from "./onboarding/CreateOnboardingModal";
import OnboardingDetailsModal from "./onboarding/OnboardingDetailsModal";
import OutcomeModal from "./onboarding/OutcomeModal";
import {
  OnboardingRecord,
  OnboardingStatsData,
  AcceptedOfferOption,
  ShowStatus,
  FinalOutcome,
} from "./onboarding/types";

export const ONBOARDING_STORAGE_KEY = "onboarding_records_data";
export const OFFERS_STORAGE_KEY = "offers_management_data";

interface OnboardingProps {
  userEmail?: string;
  onSwitchModule?: (module: string) => void;
}

const INITIAL_RECORDS: OnboardingRecord[] = [
  {
    id: "ONB-2026-001",
    onboardingId: "ONB-2026-001",
    candidateName: "Theresa Mae Santos",
    candidateEmail: "theresa.mae@outlook.com",
    candidatePhone: "+63 917 554 1234",
    roleTitle: "Healthcare Support Specialist",
    account: "Elevance Health",
    location: "Davao",
    acceptedOfferDate: "2026-07-16",
    expectedStartDate: "2026-08-15",
    showStatus: "Pending",
    finalOutcome: "Pending Start",
    owner: "Alena Batacan",
    remarks: "Pre-employment welcome kit dispatched.",
  },
  {
    id: "ONB-2026-002",
    onboardingId: "ONB-2026-002",
    candidateName: "Kenji Sato",
    candidateEmail: "kenji.sato@gmail.com",
    candidatePhone: "+63 908 443 8910",
    roleTitle: "Customer Service Representative",
    account: "Chevron Support",
    location: "Tagum",
    acceptedOfferDate: "2026-07-15",
    expectedStartDate: "2026-08-18",
    showStatus: "Pending",
    finalOutcome: "Pending Start",
    owner: "Juan dela Cruz",
    remarks: "Medical clearance completed.",
  },
  {
    id: "ONB-2026-003",
    onboardingId: "ONB-2026-003",
    candidateName: "John Raymond Doe",
    candidateEmail: "jr.doe@gmail.com",
    candidatePhone: "+63 915 221 4590",
    roleTitle: "Customer Service Representative",
    account: "Citi Global",
    location: "Hybrid",
    acceptedOfferDate: "2026-07-10",
    expectedStartDate: "2026-07-18",
    actualStartDate: "2026-07-18",
    showStatus: "Show",
    finalOutcome: "True Hire",
    owner: "Alena Batacan",
    remarks: "Logged actual start. Converted to active employee in directory.",
  },
  {
    id: "ONB-2026-004",
    onboardingId: "ONB-2026-004",
    candidateName: "Mary Cruz Alcantara",
    candidateEmail: "mary_cruz99@outlook.ph",
    candidatePhone: "+63 918 332 7711",
    roleTitle: "Customer Service Representative",
    account: "Capital One Help",
    location: "Remote",
    acceptedOfferDate: "2026-07-08",
    expectedStartDate: "2026-07-15",
    showStatus: "No Show",
    finalOutcome: "No Show",
    owner: "Maria Santos",
    reasonCategory: "Accepted Other Offer",
    withdrawalReason: "Candidate accepted another offer providing work-from-home allowance.",
    remarks: "Failed to attend Day 1 orientation.",
  },
  {
    id: "ONB-2026-005",
    onboardingId: "ONB-2026-005",
    candidateName: "Daniel Padilla Flores",
    candidateEmail: "daniel_flores@live.com",
    candidatePhone: "+63 920 448 9912",
    roleTitle: "Healthcare Support Specialist",
    account: "Elevance Health",
    location: "Davao",
    acceptedOfferDate: "2026-07-05",
    expectedStartDate: "2026-07-15",
    actualStartDate: "2026-07-15",
    showStatus: "Show",
    finalOutcome: "True Hire",
    owner: "Juan dela Cruz",
    remarks: "Attended orientation. Added to active headcount.",
  },
  {
    id: "ONB-2026-006",
    onboardingId: "ONB-2026-006",
    candidateName: "Alex G. Rivera",
    candidateEmail: "alex_rivera93@gmail.com",
    candidatePhone: "+63 936 881 1290",
    roleTitle: "Technical Support Associate",
    account: "RingCentral Team",
    location: "Remote",
    acceptedOfferDate: "2026-06-28",
    expectedStartDate: "2026-07-12",
    showStatus: "Withdrawn",
    finalOutcome: "Pre-start Withdrawal",
    owner: "Alena Batacan",
    reasonCategory: "Location Issue",
    withdrawalReason: "Decided to accept a role closer to Manila residence due to transit limitations.",
    remarks: "Candidate sent formal withdrawal email prior to NHO.",
  },
];

export default function Onboarding({ userEmail = "alena.batacan@thesiblingssolutions.com" }: OnboardingProps) {
  // Load Onboarding Records from localStorage
  const [records, setRecords] = useState<OnboardingRecord[]>(() => {
    try {
      const saved = localStorage.getItem(ONBOARDING_STORAGE_KEY) || localStorage.getItem("ta_onboarding_records");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((r) => ({
            ...r,
            onboardingId: r.onboardingId || r.id,
            candidateName: r.candidateName || r.name || "Candidate",
            candidateEmail: r.candidateEmail || r.email || "email@example.com",
            roleTitle: r.roleTitle || r.role || "Healthcare Support Specialist",
            account: r.account || "Elevance Health",
            location: r.location || r.siteLocation || "Davao",
            acceptedOfferDate: r.acceptedOfferDate || r.offerAcceptedDate || "2026-07-15",
          }));
        }
      }
    } catch (e) {
      console.warn("Could not read onboarding records from localStorage", e);
    }
    return INITIAL_RECORDS;
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Banner State
  const [showRulesBanner, setShowRulesBanner] = useState(true);

  // Filters State
  const [searchTerm, setSearchTerm] = useState("");
  const [showStatusFilter, setShowStatusFilter] = useState("All");
  const [outcomeFilter, setOutcomeFilter] = useState("All");
  const [ownerFilter, setOwnerFilter] = useState("All");

  // Modals State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<OnboardingRecord | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [outcomeModalType, setOutcomeModalType] = useState<"Show" | "No Show" | "Withdrawn" | null>(null);

  // Event Listener for Cross-Tab / Cross-Module Updates
  useEffect(() => {
    const handleSync = () => {
      try {
        const saved = localStorage.getItem(ONBOARDING_STORAGE_KEY) || localStorage.getItem("ta_onboarding_records");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setRecords(parsed);
          }
        }
      } catch (e) {
        console.warn("Failed to sync onboarding state", e);
      }
    };

    window.addEventListener("ta-onboarding-updated", handleSync);
    window.addEventListener("ta-pipeline-candidates-updated", handleSync);
    return () => {
      window.removeEventListener("ta-onboarding-updated", handleSync);
      window.removeEventListener("ta-pipeline-candidates-updated", handleSync);
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Compute Statistics
  const stats = useMemo<OnboardingStatsData>(() => {
    const total = records.length;
    const trueHires = records.filter((r) => r.finalOutcome === "True Hire").length;
    const pending = records.filter(
      (r) => r.finalOutcome === "Pending Start" || r.showStatus === "Pending"
    ).length;
    const noShow = records.filter(
      (r) => r.finalOutcome === "No Show" || r.showStatus === "No Show"
    ).length;
    const withdrawals = records.filter(
      (r) => r.finalOutcome === "Pre-start Withdrawal" || r.showStatus === "Withdrawn"
    ).length;

    const resolvedTotal = total - pending;
    const showRate = resolvedTotal > 0 ? Math.round((trueHires / resolvedTotal) * 100) : 0;

    const trueHiresPct = total > 0 ? Math.round((trueHires / total) * 100) : 0;
    const pendingStartPct = total > 0 ? Math.round((pending / total) * 100) : 0;
    const noShowPct = total > 0 ? Math.round((noShow / total) * 100) : 0;
    const withdrawalPct = total > 0 ? Math.round((withdrawals / total) * 100) : 0;

    return {
      total,
      trueHires,
      pending,
      noShow,
      withdrawals,
      showRate,
      trueHiresPct,
      pendingStartPct,
      noShowPct,
      withdrawalPct,
    };
  }, [records]);

  // Read Owner Options dynamically from records
  const ownerOptions = useMemo(() => {
    const set = new Set<string>();
    records.forEach((r) => {
      if (r.owner) set.add(r.owner);
    });
    return Array.from(set);
  }, [records]);

  // Read Accepted Offers for Create Modal
  const acceptedOffers = useMemo<AcceptedOfferOption[]>(() => {
    const existingOfferIds = new Set(records.map((r) => r.offerId).filter(Boolean));
    const existingEmails = new Set(records.map((r) => r.candidateEmail?.toLowerCase()).filter(Boolean));

    let availableOffers: AcceptedOfferOption[] = [];

    try {
      const rawOffers = localStorage.getItem("ta_offer_records") || localStorage.getItem(OFFERS_STORAGE_KEY);
      if (rawOffers) {
        const parsed = JSON.parse(rawOffers);
        if (Array.isArray(parsed) && parsed.length > 0) {
          availableOffers = parsed
            .filter((o: any) => o.status === "Accepted" || o.status === "Approved" || o.status === "Signed")
            .map((o: any) => ({
              offerId: o.id || o.offerId || `OFF-${Math.floor(1000 + Math.random() * 9000)}`,
              candidateName: o.candidateName || o.name || "Accepted Candidate",
              candidateEmail: o.candidateEmail || o.email || "candidate@example.com",
              roleTitle: o.roleTitle || o.role || "Healthcare Support Specialist",
              account: o.account || "Elevance Health",
              acceptedOfferDate: o.acceptedOfferDate || o.acceptedDate || new Date().toISOString().split("T")[0],
              owner: o.owner || o.recruiter || "Alena Batacan",
            }));
        }
      }
    } catch (e) {
      console.warn("Error parsing offer records:", e);
    }

    if (availableOffers.length === 0) {
      availableOffers = [
        {
          offerId: "OFF-2026-881",
          candidateName: "Maria Clara Alonso",
          candidateEmail: "m.alonso@gmail.com",
          roleTitle: "Healthcare Support Specialist",
          account: "Elevance Health",
          acceptedOfferDate: "2026-08-10",
          owner: "Alena Batacan",
        },
        {
          offerId: "OFF-2026-882",
          candidateName: "Gabriel Ramos",
          candidateEmail: "gabriel.ramos@yahoo.com",
          roleTitle: "Customer Service Representative",
          account: "Chevron Support",
          acceptedOfferDate: "2026-08-11",
          owner: "Juan dela Cruz",
        },
      ];
    }

    return availableOffers.filter(
      (o) => !existingOfferIds.has(o.offerId) && !existingEmails.has(o.candidateEmail.toLowerCase())
    );
  }, [records]);

  // Filter Records
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const nameMatch = (r.candidateName || "").toLowerCase().includes(term);
        const idMatch = (r.onboardingId || r.id || "").toLowerCase().includes(term);
        const emailMatch = (r.candidateEmail || "").toLowerCase().includes(term);
        const roleMatch = (r.roleTitle || "").toLowerCase().includes(term);
        const accountMatch = (r.account || "").toLowerCase().includes(term);
        const ownerMatch = (r.owner || "").toLowerCase().includes(term);
        if (!nameMatch && !idMatch && !emailMatch && !roleMatch && !accountMatch && !ownerMatch) {
          return false;
        }
      }

      if (showStatusFilter !== "All" && r.showStatus !== showStatusFilter) {
        return false;
      }

      if (outcomeFilter !== "All" && r.finalOutcome !== outcomeFilter) {
        return false;
      }

      if (ownerFilter !== "All" && r.owner !== ownerFilter) {
        return false;
      }

      return true;
    });
  }, [records, searchTerm, showStatusFilter, outcomeFilter, ownerFilter]);

  const clearFilters = () => {
    setSearchTerm("");
    setShowStatusFilter("All");
    setOutcomeFilter("All");
    setOwnerFilter("All");
  };

  // Create Onboarding Record
  const handleSaveCreate = (recordData: Partial<OnboardingRecord>) => {
    const num = Math.floor(100 + Math.random() * 900);
    const newRecord: OnboardingRecord = {
      id: `ONB-2026-${num}`,
      onboardingId: `ONB-2026-${num}`,
      candidateName: recordData.candidateName || "Candidate",
      candidateEmail: recordData.candidateEmail || "email@example.com",
      roleTitle: recordData.roleTitle || "Associate",
      account: recordData.account || "General Account",
      location: recordData.location || "Davao",
      acceptedOfferDate: recordData.acceptedOfferDate || new Date().toISOString().split("T")[0],
      expectedStartDate: recordData.expectedStartDate || new Date().toISOString().split("T")[0],
      showStatus: "Pending",
      finalOutcome: "Pending Start",
      owner: recordData.owner || "TA Recruiter",
      remarks: recordData.remarks,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [newRecord, ...records];
    setRecords(updated);
    localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(updated));
    localStorage.setItem("ta_onboarding_records", JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("ta-onboarding-updated"));

    showToast("New onboarding record created successfully!");
  };

  // Save Outcome Update
  const handleSaveOutcome = (
    recordId: string,
    outcomeData: {
      showStatus: ShowStatus;
      finalOutcome: FinalOutcome;
      actualStartDate?: string;
      reasonCategory?: string;
      withdrawalReason?: string;
      experienceRating?: number;
      feedbackTag?: string;
      candidateFeedback?: string;
      remarks?: string;
    }
  ) => {
    const updated = records.map((r) => {
      if (r.id === recordId) {
        return {
          ...r,
          showStatus: outcomeData.showStatus,
          finalOutcome: outcomeData.finalOutcome,
          actualStartDate: outcomeData.actualStartDate || r.actualStartDate,
          reasonCategory: outcomeData.reasonCategory || r.reasonCategory,
          withdrawalReason: outcomeData.withdrawalReason || r.withdrawalReason,
          experienceRating: outcomeData.experienceRating || r.experienceRating,
          feedbackTag: outcomeData.feedbackTag || r.feedbackTag,
          candidateFeedback: outcomeData.candidateFeedback || r.candidateFeedback,
          remarks: outcomeData.remarks || r.remarks,
          updatedAt: new Date().toISOString(),
        };
      }
      return r;
    });

    setRecords(updated);
    localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(updated));
    localStorage.setItem("ta_onboarding_records", JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("ta-onboarding-updated"));

    if (selectedRecord && selectedRecord.id === recordId) {
      const fresh = updated.find((r) => r.id === recordId) || null;
      setSelectedRecord(fresh);
    }

    showToast(`Outcome updated to ${outcomeData.finalOutcome}!`);
  };

  const handleOpenDetails = (r: OnboardingRecord) => {
    setSelectedRecord(r);
    setIsDetailsModalOpen(true);
  };

  return (
    <div className="flex-1 flex flex-col space-y-6 select-none relative" id="onboarding-module-root">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#042C51] text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-2.5 text-xs font-bold animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header Bar */}
      <section className="bg-white p-5 rounded-2xl border border-[#E6ECF2] shadow-sm flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-[#E9F0FC] text-[#042C51] px-2.5 py-0.5 rounded font-black border border-blue-100 uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#042C51] inline-block animate-pulse"></span>
              Onboarding & True Hire Governance Hub
            </span>
            <span className="text-[10px] bg-[#FFF0EB] text-[#FF5C28] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
              Pipeline Real-Time Sync
            </span>
          </div>
          <h1 className="text-xl font-black text-[#042C51] tracking-tight">Onboarding Management</h1>
          <p className="text-xs text-[#667085] leading-normal">
            Track candidate transitions from Accepted Offers to Day 1 Show/No-Show outcomes, pre-start drop-offs, and True Hire placement verification.
          </p>
        </div>

        {/* Action Group */}
        <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto">
          {/* Active Mode Pill */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-[#042C51] text-white flex items-center gap-1 shadow-xs">
              <UserCheck className="w-3.5 h-3.5" />
              Onboarding View Mode
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              const saved = localStorage.getItem(ONBOARDING_STORAGE_KEY) || localStorage.getItem("ta_onboarding_records");
              if (saved) setRecords(JSON.parse(saved));
              showToast("Data refreshed!");
            }}
            className="p-2 text-slate-600 hover:text-[#042C51] bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="px-3.5 py-2 bg-[#FF5C28] hover:bg-[#E04B1D] text-white font-black text-xs rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-sm hover:shadow"
          >
            <UserPlus className="w-4 h-4" />
            Add Onboarding Record
          </button>
        </div>
      </section>

      {/* Contextual Governance Policy Banner */}
      <AnimatePresence>
        {showRulesBanner && (
          <motion.section
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="bg-gradient-to-r from-slate-900 via-[#042C51] to-slate-900 text-white p-4 rounded-2xl border border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-3"
          >
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 text-[#FF5C28] mt-0.5">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h2 className="text-xs font-black uppercase tracking-wider text-white">ONBOARDING GOVERNANCE POLICY</h2>
                  <span className="text-[9px] font-bold bg-[#FF5C28] text-white px-2 py-0.5 rounded-full">True Hire & Show Rule</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed max-w-4xl">
                  <strong>Onboarding Scope:</strong> Accepted Offers automatically generate Onboarding records. Onboarding determines if candidate becomes a <span className="text-emerald-300 font-bold">True Hire</span>. Only <span className="text-emerald-300 font-bold">Show</span> moves the candidate to Hired and updates requisition count.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
              <button
                type="button"
                onClick={() => setShowRulesBanner(false)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                title="Dismiss Banner"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* 6-Card Summary Section */}
      <OnboardingStats stats={stats} />

      {/* Search & Filters */}
      <OnboardingFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        showStatusFilter={showStatusFilter}
        setShowStatusFilter={setShowStatusFilter}
        outcomeFilter={outcomeFilter}
        setOutcomeFilter={setOutcomeFilter}
        ownerFilter={ownerFilter}
        setOwnerFilter={setOwnerFilter}
        ownerOptions={ownerOptions}
        clearFilters={clearFilters}
      />

      {/* Main Paginated Table */}
      <OnboardingTable
        records={filteredRecords}
        onViewRecord={handleOpenDetails}
      />

      {/* Onboarding Process Governance Note */}
      <OnboardingProcessNote />

      {/* Modals */}
      <CreateOnboardingModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        acceptedOffers={acceptedOffers}
        onSave={handleSaveCreate}
      />

      <OnboardingDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        record={selectedRecord}
        onOpenOutcomeModal={(type) => setOutcomeModalType(type)}
      />

      <OutcomeModal
        isOpen={outcomeModalType !== null}
        onClose={() => setOutcomeModalType(null)}
        record={selectedRecord}
        type={outcomeModalType || "Show"}
        onSaveOutcome={handleSaveOutcome}
      />
    </div>
  );
}
