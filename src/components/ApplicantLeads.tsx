import React, { useState, useMemo } from "react";
import * as XLSX from "xlsx";
import {
  UserPlus,
  Search,
  Filter,
  Plus,
  Download,
  Upload,
  RefreshCw,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  Calendar,
  CheckCircle,
  X,
  Edit2,
  Trash2,
  Send,
  ExternalLink,
  ChevronDown,
  Info,
  Clock,
  Sparkles,
  UserCheck,
  Building,
  FileSpreadsheet,
  BarChart2,
  MessageSquare,
  ArrowRight,
  MoreVertical,
  Check,
  Key,
  Eye,
  Database,
  Archive,
  RotateCcw,
  User,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import CandidateProfileModal from "./CandidateProfileModal";
import LeadApplicantProfileModal from "./LeadApplicantProfileModal";
import { Candidate } from "./TalentPool";
import {
  ApplicantLead,
  ArchivedTalentPoolLead,
  LeadHistoryItem,
  INITIAL_ACTIVE_LEADS,
  INITIAL_ARCHIVED_LEADS,
  createCandidateFromLead
} from "../data/recruitmentStore";

interface ApplicantLeadsProps {
  userEmail?: string;
  onSwitchModule?: (module: string) => void;
}

export default function ApplicantLeads({ userEmail, onSwitchModule }: ApplicantLeadsProps) {
  // Derive name of current user account
  const currentAccountName = useMemo(() => {
    if (!userEmail) return "CRISTER CANITAN";
    if (userEmail.includes("@")) {
      const handle = userEmail.split("@")[0];
      const parts = handle.split(".").map(p => p.toUpperCase());
      return parts.join(" ");
    }
    return userEmail.toUpperCase();
  }, [userEmail]);

  // --- STATE ---
  const [activeTab, setActiveTab] = useState<"active" | "archive" | "sources">("active");

  // Leads Lists
  const [leads, setLeads] = useState<ApplicantLead[]>(INITIAL_ACTIVE_LEADS);
  const [archivedLeads, setArchivedLeads] = useState<ArchivedTalentPoolLead[]>(INITIAL_ARCHIVED_LEADS);

  // Lead Profile Panel Modal State
  const [selectedLeadForProfile, setSelectedLeadForProfile] = useState<ApplicantLead | null>(null);
  const [isLeadProfileModalOpen, setIsLeadProfileModalOpen] = useState(false);
  const [isLeadProfileInitialEdit, setIsLeadProfileInitialEdit] = useState(false);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All Statuses");
  const [departmentFilter, setDepartmentFilter] = useState<string>("All Departments");
  const [siteFilter, setSiteFilter] = useState<string>("All Sites");

  // Modals & Drawers
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<ApplicantLead | null>(null);

  // Candidate Profile Modal (For opening talent pool profile from archive)
  const [selectedCandidateForProfile, setSelectedCandidateForProfile] = useState<Candidate | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Form Data State
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    suffix: "",
    cpNum: "",
    email: "",
    department: "Call Center Operations",
    specificAccount: "CD - Collect",
    source: "Walk-in" as ApplicantLead["source"],
    preferredSite: "Tagum City" as ApplicantLead["preferredSite"],
    status: "New Lead" as ApplicantLead["status"],
    notes: "",
    referralCode: ""
  });

  // Bulk Import State
  const [bulkFile, setBulkFile] = useState<File | null>(null);
  const [parsedLeads, setParsedLeads] = useState<ApplicantLead[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bulkError, setBulkError] = useState<string | null>(null);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Reset Filters
  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("All Statuses");
    setDepartmentFilter("All Departments");
    setSiteFilter("All Sites");
  };

  // Open Lead Profile Modal
  const handleOpenLeadProfile = (lead: ApplicantLead, initialEdit: boolean = false) => {
    setSelectedLeadForProfile(lead);
    setIsLeadProfileInitialEdit(initialEdit);
    setIsLeadProfileModalOpen(true);
  };

  // Handle Updates to a Lead from Profile Modal
  const handleUpdateLead = (updatedLead: ApplicantLead) => {
    setLeads(prev => prev.map(l => (l.id === updatedLead.id ? updatedLead : l)));
    setSelectedLeadForProfile(updatedLead);
    showToast(`Updated profile & history for ${updatedLead.fullName}`);
  };

  // Open Log New Lead Modal
  const handleOpenAddModal = () => {
    setEditingLead(null);
    setFormData({
      firstName: "",
      middleName: "",
      lastName: "",
      suffix: "",
      cpNum: "",
      email: "",
      department: "Call Center Operations",
      specificAccount: "CD - Collect",
      source: "Walk-in",
      preferredSite: "Tagum City",
      status: "New Lead",
      notes: "",
      referralCode: ""
    });
    setIsAddModalOpen(true);
  };

  // Open Edit Lead Modal
  const handleOpenEditModal = (lead: ApplicantLead) => {
    handleOpenLeadProfile(lead, true);
  };

  // Save or Update Lead
  const handleSaveLead = (e: React.FormEvent) => {
    e.preventDefault();

    const constructedFullName = `${formData.firstName} ${formData.middleName ? formData.middleName + " " : ""}${formData.lastName}${formData.suffix ? " " + formData.suffix : ""}`.trim();
    const currentDate = new Date().toISOString().split("T")[0];
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (editingLead) {
      const editHistItem: LeadHistoryItem = {
        id: `hist-${Date.now()}`,
        date: currentDate,
        time: currentTime,
        action: `Lead profile edited and updated by ${currentAccountName}.`,
        user: currentAccountName,
        type: "edit"
      };

      setLeads(prev =>
        prev.map(l =>
          l.id === editingLead.id
            ? {
                ...l,
                fullName: constructedFullName,
                firstName: formData.firstName,
                middleName: formData.middleName,
                lastName: formData.lastName,
                suffix: formData.suffix,
                cpNum: formData.cpNum,
                email: formData.email,
                department: formData.department,
                specificAccount: formData.specificAccount,
                source: formData.source,
                preferredSite: formData.preferredSite,
                status: formData.status,
                notes: formData.notes,
                referralCode: formData.referralCode,
                lastContactDate: currentDate,
                history: [editHistItem, ...(l.history || [])]
              }
            : l
        )
      );
      showToast(`Updated applicant lead for ${constructedFullName}`);
    } else {
      const nextNum = Math.floor(1000 + Math.random() * 9000);
      const initialHistItem: LeadHistoryItem = {
        id: `hist-${Date.now()}`,
        date: currentDate,
        time: currentTime,
        action: `Inbound applicant lead logged via ${formData.source} at ${formData.preferredSite} by ${currentAccountName}. Target Fit: ${formData.specificAccount}.`,
        user: currentAccountName,
        type: "create"
      };

      const newLead: ApplicantLead = {
        id: `LEAD-2026-${nextNum}`,
        fullName: constructedFullName,
        firstName: formData.firstName,
        middleName: formData.middleName,
        lastName: formData.lastName,
        suffix: formData.suffix,
        cpNum: formData.cpNum,
        email: formData.email,
        department: formData.department,
        specificAccount: formData.specificAccount,
        source: formData.source,
        preferredSite: formData.preferredSite,
        status: formData.status,
        inputtedBy: currentAccountName,
        dateLogged: currentDate,
        lastContactDate: currentDate,
        notes: formData.notes,
        referralCode: formData.referralCode,
        history: [initialHistItem]
      };

      setLeads(prev => [newLead, ...prev]);
      showToast(`Logged new applicant lead: ${constructedFullName}`);
    }

    setIsAddModalOpen(false);
  };

  // Move Lead to Talent Pool Archive and create Candidate Profile
  const handleMoveToTalentPool = (lead: ApplicantLead) => {
    const generatedTpId = `PUB-${new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14)}-${Math.floor(100 + Math.random() * 900)}RQV`;
    const currentDate = new Date().toISOString().split("T")[0];
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const transferHistItem: LeadHistoryItem = {
      id: `hist-${Date.now()}`,
      date: currentDate,
      time: currentTime,
      action: `Lead converted and transferred to Talent Pool Master Archive (Talent Pool ID: ${generatedTpId}) by ${currentAccountName}.`,
      user: currentAccountName,
      type: "transfer"
    };

    const newArchivedRecord: ArchivedTalentPoolLead = {
      leadId: lead.id,
      talentPoolId: generatedTpId,
      fullName: lead.fullName,
      cpNum: lead.cpNum,
      email: lead.email || "N/A",
      department: lead.department,
      specificAccount: lead.specificAccount || "CD - Collect",
      preferredSite: lead.preferredSite,
      source: lead.source,
      dateLogged: lead.dateLogged || currentDate,
      dateTransferred: currentDate,
      transferredBy: currentAccountName,
      status: "Archived in Talent Pool",
      notes: lead.notes || "Transferred from Applicant Lead intake roster to Talent Pool."
    };

    // Add to Archive list
    setArchivedLeads(prev => [newArchivedRecord, ...prev]);

    // Remove from Active Leads list
    setLeads(prev => prev.filter(l => l.id !== lead.id));

    if (selectedLeadForProfile?.id === lead.id) {
      setIsLeadProfileModalOpen(false);
    }

    showToast(`✨ Converted and transferred ${lead.fullName} to Talent Pool Archive (${generatedTpId})!`);
  };

  // Restore from Archive back to Active Leads
  const handleRestoreFromArchive = (archivedRecord: ArchivedTalentPoolLead) => {
    const currentDate = new Date().toISOString().split("T")[0];
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const restoreHistItem: LeadHistoryItem = {
      id: `hist-${Date.now()}`,
      date: currentDate,
      time: currentTime,
      action: `Restored from Talent Pool Archive back to Active Leads by ${currentAccountName}.`,
      user: currentAccountName,
      type: "status"
    };

    const restoredLead: ApplicantLead = {
      id: archivedRecord.leadId,
      fullName: archivedRecord.fullName,
      cpNum: archivedRecord.cpNum,
      email: archivedRecord.email === "N/A" ? "" : archivedRecord.email,
      department: archivedRecord.department,
      specificAccount: archivedRecord.specificAccount,
      source: archivedRecord.source as ApplicantLead["source"],
      preferredSite: archivedRecord.preferredSite as ApplicantLead["preferredSite"],
      status: "Contacted",
      inputtedBy: archivedRecord.transferredBy,
      dateLogged: archivedRecord.dateLogged,
      lastContactDate: currentDate,
      notes: `Restored from Talent Pool Archive on ${currentDate}. Original Notes: ${archivedRecord.notes}`,
      history: [restoreHistItem]
    };

    setLeads(prev => [restoredLead, ...prev]);
    setArchivedLeads(prev => prev.filter(a => a.leadId !== archivedRecord.leadId));

    showToast(`↩️ Restored ${archivedRecord.fullName} back to Active Leads roster!`);
  };

  // Delete Lead
  const handleDeleteLead = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove lead for ${name}?`)) {
      setLeads(prev => prev.filter(l => l.id !== id));
      if (selectedLeadForProfile?.id === id) {
        setIsLeadProfileModalOpen(false);
      }
      showToast(`Removed lead entry for ${name}.`);
    }
  };

  // Delete Archived Lead
  const handleDeleteArchivedLead = (leadId: string, name: string) => {
    if (confirm(`Remove archived record for ${name}?`)) {
      setArchivedLeads(prev => prev.filter(l => l.leadId !== leadId));
      showToast(`Removed archived record for ${name}.`);
    }
  };

  // Send Application Form Link via Email / SMS
  const handleSendLinkEmail = (lead: ApplicantLead) => {
    const currentDate = new Date().toISOString().split("T")[0];
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const linkHistItem: LeadHistoryItem = {
      id: `hist-${Date.now()}`,
      date: currentDate,
      time: currentTime,
      action: `Application form link dispatched via SMS & Email to ${lead.email || lead.cpNum} by ${currentAccountName}.`,
      user: currentAccountName,
      type: "sms"
    };

    const updatedLead: ApplicantLead = {
      ...lead,
      status: "Application Link Sent",
      lastContactDate: currentDate,
      history: [linkHistItem, ...(lead.history || [])]
    };

    setLeads(prev => prev.map(l => (l.id === lead.id ? updatedLead : l)));
    if (selectedLeadForProfile?.id === lead.id) {
      setSelectedLeadForProfile(updatedLead);
    }
    showToast(`📧 Application form link sent to ${lead.fullName} (${lead.email || lead.cpNum})!`);
  };

  // OPEN TALENT POOL PROFILE FOR ARCHIVED LEAD
  // Constructs full Candidate object and opens CandidateProfileModal
  const handleOpenTalentPoolProfile = (archivedRecord: ArchivedTalentPoolLead) => {
    // Check if matching lead or candidate object exists
    const mockLead: ApplicantLead = {
      id: archivedRecord.leadId,
      fullName: archivedRecord.fullName,
      cpNum: archivedRecord.cpNum,
      email: archivedRecord.email === "N/A" ? "applicant.lead@thesiblingssolutions.com" : archivedRecord.email,
      department: archivedRecord.department,
      specificAccount: archivedRecord.specificAccount,
      source: (archivedRecord.source || "Walk-in") as ApplicantLead["source"],
      preferredSite: (archivedRecord.preferredSite || "Tagum City") as ApplicantLead["preferredSite"],
      status: "Converted to Applicant",
      inputtedBy: archivedRecord.transferredBy,
      dateLogged: archivedRecord.dateLogged,
      notes: archivedRecord.notes
    };

    const candidateProfile: Candidate = createCandidateFromLead(
      mockLead,
      archivedRecord.transferredBy,
      archivedRecord.talentPoolId
    );

    // Set and open modal
    setSelectedCandidateForProfile(candidateProfile);
    setIsProfileModalOpen(true);
  };

  // Filtered Active Leads
  const filteredActiveLeads = useMemo(() => {
    return leads.filter(l => {
      const matchesSearch =
        l.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.cpNum.includes(searchTerm) ||
        l.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (l.specificAccount && l.specificAccount.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (l.inputtedBy && l.inputtedBy.toLowerCase().includes(searchTerm.toLowerCase())) ||
        l.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "All Statuses" || l.status === statusFilter;
      const matchesDept = departmentFilter === "All Departments" || l.department === departmentFilter;
      const matchesSite = siteFilter === "All Sites" || l.preferredSite === siteFilter;

      return matchesSearch && matchesStatus && matchesDept && matchesSite;
    });
  }, [leads, searchTerm, statusFilter, departmentFilter, siteFilter]);

  // Filtered Archived Leads
  const filteredArchivedLeads = useMemo(() => {
    return archivedLeads.filter(rec => {
      const matchesSearch =
        rec.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.leadId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.talentPoolId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.cpNum.includes(searchTerm) ||
        rec.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.specificAccount.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.transferredBy.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDept = departmentFilter === "All Departments" || rec.department === departmentFilter;
      const matchesSite = siteFilter === "All Sites" || rec.preferredSite === siteFilter;

      return matchesSearch && matchesDept && matchesSite;
    });
  }, [archivedLeads, searchTerm, departmentFilter, siteFilter]);

  // Metrics Calculations
  const totalInquiries = leads.length + archivedLeads.length;
  const newUncontacted = leads.filter(l => l.status === "New Lead").length;
  const appSent = leads.filter(l => l.status === "Application Link Sent").length;
  const convertedApplicants = archivedLeads.length;
  const conversionRate = totalInquiries > 0 ? ((convertedApplicants / totalInquiries) * 100).toFixed(1) : "0.0";

  // Handle Bulk Excel Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setBulkFile(file);
    setBulkError(null);
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = evt => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json<any>(ws);

        if (!data || data.length === 0) {
          setBulkError("The uploaded Excel file appears to be empty or unreadable.");
          setIsProcessing(false);
          return;
        }

        const newScannedLeads: ApplicantLead[] = data.map((row, idx) => {
          const rawName =
            row["Full Name"] ||
            row["FullName"] ||
            row["Name"] ||
            `${row["First Name"] || ""} ${row["Last Name"] || ""}`.trim() ||
            `Lead Candidate ${idx + 1}`;
          const rawCp = String(row["Cellphone Number"] || row["CP Number"] || row["Mobile"] || row["Phone"] || "0917-000-0000");
          const rawEmail = String(row["Email Address"] || row["Email"] || "");
          const rawDept = String(row["Department"] || row["Dept"] || "Call Center Operations");
          const rawAccount = String(row["Specific Account"] || row["Account"] || "CD - Collect");
          const rawSource = String(row["Source"] || row["Source Channel"] || "Walk-in");
          const rawSite = String(row["Preferred Site"] || row["Site"] || "Tagum City");

          const currentDate = new Date().toISOString().split("T")[0];
          const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const bulkHistItem: LeadHistoryItem = {
            id: `hist-${Date.now()}-${idx}`,
            date: currentDate,
            time: currentTime,
            action: `Bulk imported into Applicant Leads from spreadsheet file ${file.name} by ${currentAccountName}.`,
            user: currentAccountName,
            type: "create"
          };

          return {
            id: `LEAD-2026-X${Math.floor(1000 + Math.random() * 9000)}`,
            fullName: rawName,
            firstName: rawName.split(" ")[0] || "",
            lastName: rawName.split(" ").slice(-1)[0] || "",
            cpNum: rawCp,
            email: rawEmail,
            department: rawDept,
            specificAccount: rawAccount,
            source: (["Walk-in", "Job Fair", "Facebook / Social Media", "Phone Call Inquiry", "Employee Referral", "SMS Inquiry", "LinkedIn"].includes(rawSource)
              ? rawSource
              : "Walk-in") as ApplicantLead["source"],
            preferredSite: (["Tagum City", "Davao City", "Municipality of Mabini"].includes(rawSite) ? rawSite : "Tagum City") as ApplicantLead["preferredSite"],
            status: "New Lead",
            inputtedBy: currentAccountName,
            dateLogged: currentDate,
            lastContactDate: currentDate,
            notes: row["Notes"] || row["Remarks"] || `Imported via Bulk Excel file ${file.name}`,
            history: [bulkHistItem]
          };
        });

        setParsedLeads(newScannedLeads);
        setIsProcessing(false);
      } catch (err: any) {
        console.error("Excel parse error:", err);
        setBulkError("Failed to parse Excel file. Please make sure it is a valid .xlsx or .csv spreadsheet.");
        setIsProcessing(false);
      }
    };

    reader.readAsBinaryString(file);
  };

  const handleConfirmBulkImport = () => {
    if (parsedLeads.length === 0) return;
    setLeads(prev => [...parsedLeads, ...prev]);
    showToast(`Successfully imported ${parsedLeads.length} new applicant leads from Excel!`);
    setIsBulkModalOpen(false);
    setBulkFile(null);
    setParsedLeads([]);
  };

  // Status Badge Helper
  const getStatusBadge = (status: ApplicantLead["status"]) => {
    switch (status) {
      case "New Lead":
        return (
          <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200/80 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            New Lead
          </span>
        );
      case "Contacted":
        return (
          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200/80 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Contacted
          </span>
        );
      case "Application Link Sent":
        return (
          <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 border border-purple-200/80 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
            Application Link Sent
          </span>
        );
      case "Converted to Applicant":
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Moved to Talent Pool Archive
          </span>
        );
      case "On Hold":
        return (
          <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            On Hold
          </span>
        );
      case "Not Interested":
        return (
          <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            Not Interested
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="flex-1 flex flex-col space-y-6 select-none relative w-full pb-16" id="applicant-leads-root">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 right-5 z-50 bg-[#042C51] text-white px-4 py-3 rounded-xl shadow-xl border border-blue-400/30 text-xs font-bold flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#FF5C28]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================== 1. TOP HEADER BANNER ==================== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-50 text-[#FF5C28] text-[10px] font-extrabold tracking-wider border border-orange-200/60 uppercase mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5C28]"></span>
            RECRUITMENT VIEW
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#042C51] tracking-tight">
            Applicant Leads & Inquiries
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Capture walk-ins, calls, social inquiries, referrals, and job fair leads before converting them into full Talent Pool applicants.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {/* Refresh Button */}
          <button
            onClick={() => showToast("Applicant leads database refreshed.")}
            className="p-2.5 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 rounded-xl transition-all shadow-2xs cursor-pointer flex items-center justify-center"
            title="Refresh Leads Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Bulk Import Button */}
          <button
            onClick={() => setIsBulkModalOpen(true)}
            className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-[#042C51] text-xs font-bold rounded-xl transition-all shadow-2xs border border-slate-200 flex items-center gap-1.5 cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-[#042C51]" />
            <span>Bulk Import</span>
          </button>

          {/* Log New Lead Button */}
          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 bg-[#FF5C28] hover:bg-[#e04b1c] text-white text-xs font-black rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Log New Lead</span>
          </button>
        </div>
      </div>

      {/* ==================== 2. 5 METRICS KPI CARDS ==================== */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Card 1: Total Inquiries */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs space-y-1 flex flex-col justify-between">
          <span className="text-[10.5px] font-black uppercase text-slate-500 tracking-wider">
            Total Inquiries Logged
          </span>
          <div className="text-3xl font-black text-[#042C51] tracking-tight">{totalInquiries}</div>
          <div className="pt-1">
            <span className="inline-block bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded text-[10px]">
              Active Roster
            </span>
          </div>
        </div>

        {/* Card 2: New Uncontacted */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs space-y-1 flex flex-col justify-between">
          <span className="text-[10.5px] font-black uppercase text-slate-500 tracking-wider">
            New Uncontacted Leads
          </span>
          <div className="text-3xl font-black text-blue-600 tracking-tight">{newUncontacted}</div>
          <div className="pt-1">
            <span className="inline-block bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded text-[10px] border border-blue-100">
              Pending Call
            </span>
          </div>
        </div>

        {/* Card 3: Application Form Sent */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs space-y-1 flex flex-col justify-between">
          <span className="text-[10.5px] font-black uppercase text-slate-500 tracking-wider">
            Application Form Sent
          </span>
          <div className="text-3xl font-black text-purple-600 tracking-tight">{appSent}</div>
          <div className="pt-1">
            <span className="inline-block bg-purple-50 text-purple-700 font-bold px-2 py-0.5 rounded text-[10px] border border-purple-100">
              SMS / Email
            </span>
          </div>
        </div>

        {/* Card 4: Converted Applicants */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs space-y-1 flex flex-col justify-between">
          <span className="text-[10.5px] font-black uppercase text-slate-500 tracking-wider">
            Converted Applicants
          </span>
          <div className="text-3xl font-black text-emerald-600 tracking-tight">{convertedApplicants}</div>
          <div className="pt-1">
            <span className="inline-block bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded text-[10px] border border-emerald-100">
              Talent Pool
            </span>
          </div>
        </div>

        {/* Card 5: Conversion Rate */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs space-y-1 flex flex-col justify-between col-span-2 sm:col-span-1">
          <span className="text-[10.5px] font-black uppercase text-slate-500 tracking-wider">
            Conversion Rate
          </span>
          <div className="text-3xl font-black text-[#FF5C28] tracking-tight">{conversionRate}%</div>
          <div className="pt-1">
            <span className="inline-block bg-orange-50 text-[#FF5C28] font-bold px-2 py-0.5 rounded text-[10px] border border-orange-100">
              Lead Yield
            </span>
          </div>
        </div>
      </div>

      {/* ==================== 3. MAIN SECTION CONTAINER ==================== */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Section Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-[#042C51] tracking-tight">
              {activeTab === "active"
                ? "Applicant Lead Directory"
                : activeTab === "archive"
                ? "Moved to Talent Pool Archive"
                : "Channel Sources"}
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {activeTab === "active"
                ? "Search and filter pre-applicant inquiries by status, department, account, site, and recruiter account."
                : activeTab === "archive"
                ? "Historical repository of applicant leads converted and transferred to the Talent Pool module. Click any candidate to open their full Talent Pool Dossier."
                : "Review lead-generation source mix and account intake volume."}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold border border-slate-200">
              {activeTab === "active"
                ? `Showing ${filteredActiveLeads.length} of ${leads.length} leads`
                : activeTab === "archive"
                ? `Showing ${filteredArchivedLeads.length} of ${archivedLeads.length} archived`
                : `${totalInquiries} Total Leads Tracked`}
            </span>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="p-4 sm:p-5 bg-[#FBFDFF] border-b border-slate-200/80 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="flex-1 min-w-[260px]">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider block mb-1">
                Search
              </label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search active leads by candidate name, phone, email, account..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-4 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:border-[#042C51]"
                />
              </div>
            </div>

            {/* Status Filter */}
            {activeTab === "active" && (
              <div className="w-[180px]">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider block mb-1">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="w-full bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
                >
                  <option value="All Statuses">All Statuses</option>
                  <option value="New Lead">New Lead</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Application Link Sent">Application Link Sent</option>
                  <option value="Converted to Applicant">Converted to Applicant</option>
                  <option value="Not Interested">Not Interested</option>
                  <option value="On Hold">On Hold</option>
                </select>
              </div>
            )}

            {/* Department Filter */}
            <div className="w-[200px]">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider block mb-1">
                Department
              </label>
              <select
                value={departmentFilter}
                onChange={e => setDepartmentFilter(e.target.value)}
                className="w-full bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="All Departments">All Departments</option>
                <option value="Call Center Operations">Call Center Operations</option>
                <option value="Human Resource">Human Resource</option>
                <option value="Facility Management">Facility Management</option>
                <option value="IT (Information and Communications Technology)">IT (ICT)</option>
                <option value="Executive / Operations">Executive / Operations</option>
              </select>
            </div>

            {/* Site Filter */}
            <div className="w-[180px]">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider block mb-1">
                Site
              </label>
              <select
                value={siteFilter}
                onChange={e => setSiteFilter(e.target.value)}
                className="w-full bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="All Sites">All Sites</option>
                <option value="Tagum City">Tagum City</option>
                <option value="Davao City">Davao City</option>
                <option value="Municipality of Mabini">Municipality of Mabini</option>
              </select>
            </div>

            {/* Clear Filters Button */}
            <div className="self-end pb-0.5">
              <button
                onClick={handleClearFilters}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-all cursor-pointer"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation Bar */}
        <div className="flex border-b border-slate-200 px-4 sm:px-6 bg-white gap-2">
          <button
            onClick={() => setActiveTab("active")}
            className={`py-3 px-3 text-xs font-black tracking-wide flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === "active"
                ? "border-[#FF5C28] text-[#FF5C28]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <span>📋 ACTIVE LEADS</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                activeTab === "active" ? "bg-orange-100 text-[#FF5C28]" : "bg-slate-100 text-slate-600"
              }`}
            >
              {leads.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("archive")}
            className={`py-3 px-3 text-xs font-black tracking-wide flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === "archive"
                ? "border-[#FF5C28] text-[#FF5C28]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <span>📦 MOVED TO TALENT POOL ARCHIVE</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                activeTab === "archive" ? "bg-orange-100 text-[#FF5C28]" : "bg-slate-100 text-slate-600"
              }`}
            >
              {archivedLeads.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("sources")}
            className={`py-3 px-3 text-xs font-black tracking-wide flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === "sources"
                ? "border-[#FF5C28] text-[#FF5C28]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <span>📊 CHANNEL SOURCES</span>
          </button>
        </div>

        {/* ==================== TAB 1: ACTIVE LEADS TABLE ==================== */}
        {activeTab === "active" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-slate-200 text-slate-600 font-black text-[11px] uppercase tracking-wider">
                  <th className="py-3.5 px-4">Lead ID & Name</th>
                  <th className="py-3.5 px-4">CP Number / Email</th>
                  <th className="py-3.5 px-4">Department & Account / Client</th>
                  <th className="py-3.5 px-4">Site</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Inputted By Account</th>
                  <th className="py-3.5 px-4 text-right">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredActiveLeads.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      <UserPlus className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                      <p className="font-bold text-slate-600">No active applicant leads found</p>
                      <p className="text-xs text-slate-400">Try adjusting your filters or log a new applicant inquiry.</p>
                    </td>
                  </tr>
                ) : (
                  filteredActiveLeads.map(lead => (
                    <tr
                      key={lead.id}
                      onClick={() => handleOpenLeadProfile(lead, false)}
                      className="hover:bg-blue-50/40 transition-colors cursor-pointer group"
                    >
                      {/* Lead ID & Name */}
                      <td className="py-3.5 px-4">
                        <div className="font-black text-[#042C51] text-xs group-hover:text-[#FF5C28] transition-colors flex items-center gap-1.5">
                          <span>{lead.fullName}</span>
                          <span className="text-[10px] text-blue-600 underline font-normal hidden group-hover:inline">
                            (View Profile)
                          </span>
                        </div>
                        <div className="text-[10.5px] font-mono text-slate-400 mt-0.5">
                          LEAD ID: {lead.id}
                        </div>
                      </td>

                      {/* CP / Email */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800 flex items-center gap-1.5">
                          <Phone className="w-3 h-3 text-emerald-600" />
                          <span>{lead.cpNum}</span>
                        </div>
                        {lead.email && (
                          <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                            <Mail className="w-3 h-3 text-blue-500" />
                            <span>{lead.email}</span>
                          </div>
                        )}
                      </td>

                      {/* Department & Account */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800">{lead.department}</div>
                        <div className="text-[11px] font-bold text-[#FF5C28]">
                          Account: {lead.specificAccount || "CD - Collect"}
                        </div>
                      </td>

                      {/* Site */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1 text-slate-700 font-bold">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{lead.preferredSite}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">{getStatusBadge(lead.status)}</td>

                      {/* Inputted By */}
                      <td className="py-3.5 px-4">
                        <div className="font-black text-slate-800 flex items-center gap-1 uppercase">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span>{lead.inputtedBy}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          Logged: {lead.dateLogged}
                        </div>
                      </td>

                      {/* Quick Actions */}
                      <td className="py-3.5 px-4 text-right" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Profile */}
                          <button
                            onClick={() => handleOpenLeadProfile(lead, false)}
                            className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg border border-blue-200 transition-all cursor-pointer"
                            title="Open Lead Applicant Profile & History Logs"
                          >
                            <Eye className="w-3.5 h-3.5 text-blue-600" />
                          </button>

                          {/* Send Application Form Link */}
                          <button
                            onClick={() => handleSendLinkEmail(lead)}
                            className="p-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg border border-purple-200 transition-all cursor-pointer"
                            title="Send Application Form Link via SMS/Email"
                          >
                            <Mail className="w-3.5 h-3.5 text-purple-600" />
                          </button>

                          {/* Move to Talent Pool Archive */}
                          <button
                            onClick={() => handleMoveToTalentPool(lead)}
                            className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg border border-emerald-200 transition-all cursor-pointer flex items-center gap-1 font-bold text-[11px]"
                            title="Convert and Move to Talent Pool Archive"
                          >
                            <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="hidden xl:inline">To Talent Pool</span>
                          </button>

                          {/* Edit Lead on Button Click */}
                          <button
                            onClick={() => handleOpenLeadProfile(lead, true)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-all cursor-pointer"
                            title="Edit Lead Profile Details"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-slate-600" />
                          </button>

                          {/* Delete Lead */}
                          <button
                            onClick={() => handleDeleteLead(lead.id, lead.fullName)}
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg border border-rose-200 transition-all cursor-pointer"
                            title="Delete Lead"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Table Footer / Pagination */}
            <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <div>
                Showing {filteredActiveLeads.length} loaded applicant leads out of {leads.length}
              </div>
              <div className="flex items-center gap-1">
                <button
                  disabled={currentPage === 1}
                  className="px-2.5 py-1 rounded bg-slate-100 text-slate-600 font-bold disabled:opacity-50"
                >
                  &lt; Previous
                </button>
                <span className="px-2.5 py-1 bg-[#042C51] text-white font-bold rounded">1</span>
                <button
                  disabled
                  className="px-2.5 py-1 rounded bg-slate-100 text-slate-600 font-bold disabled:opacity-50"
                >
                  Next &gt;
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 2: MOVED TO TALENT POOL ARCHIVE ==================== */}
        {activeTab === "archive" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-slate-200 text-slate-600 font-black text-[11px] uppercase tracking-wider">
                  <th className="py-3.5 px-4">Lead ID & Name</th>
                  <th className="py-3.5 px-4">CP Number / Email</th>
                  <th className="py-3.5 px-4">Department & Account / Client</th>
                  <th className="py-3.5 px-4">Site</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Inputted By Account</th>
                  <th className="py-3.5 px-4 text-right">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredArchivedLeads.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      <Archive className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                      <p className="font-bold text-slate-600">No archived applicant leads</p>
                      <p className="text-xs text-slate-400">
                        When leads are transferred to the Talent Pool, they will appear in this archive repository.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredArchivedLeads.map(rec => (
                    <tr
                      key={rec.leadId}
                      className="hover:bg-blue-50/40 transition-colors cursor-pointer group"
                      onClick={() => handleOpenTalentPoolProfile(rec)}
                    >
                      {/* Lead ID & Name */}
                      <td className="py-3.5 px-4">
                        <div className="font-black text-[#042C51] text-xs group-hover:text-[#FF5C28] transition-colors flex items-center gap-1.5">
                          <span>{rec.fullName}</span>
                          <span className="text-[10px] text-blue-600 underline font-normal hidden group-hover:inline">
                            (Open Profile)
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5 text-[10.5px] font-mono mt-0.5">
                          <span className="text-slate-400">LEAD ID: {rec.leadId}</span>
                          <span className="text-slate-300">•</span>
                          <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 font-bold">
                            TP ID: {rec.talentPoolId}
                          </span>
                        </div>
                      </td>

                      {/* CP / Email */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800 flex items-center gap-1.5">
                          <Phone className="w-3 h-3 text-emerald-600" />
                          <span>{rec.cpNum}</span>
                        </div>
                        {rec.email && rec.email !== "N/A" && (
                          <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                            <Mail className="w-3 h-3 text-blue-500" />
                            <span>{rec.email}</span>
                          </div>
                        )}
                      </td>

                      {/* Department & Account */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800">{rec.department}</div>
                        <div className="text-[11px] font-bold text-[#FF5C28]">
                          Account: {rec.specificAccount || "CD - Collect"}
                        </div>
                      </td>

                      {/* Site */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1 text-slate-700 font-bold">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{rec.preferredSite}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          Moved to Talent Pool Archive
                        </span>
                      </td>

                      {/* Inputted By Account */}
                      <td className="py-3.5 px-4">
                        <div className="font-black text-slate-800 flex items-center gap-1 uppercase">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span>{rec.transferredBy}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          Transferred: {rec.dateTransferred}
                        </div>
                      </td>

                      {/* Quick Actions */}
                      <td className="py-3.5 px-4 text-right" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Open Talent Pool Profile Button */}
                          <button
                            onClick={() => handleOpenTalentPoolProfile(rec)}
                            className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg border border-blue-200 transition-all cursor-pointer flex items-center gap-1 font-bold text-[11px]"
                            title="Open Full Talent Pool Candidate Dossier"
                          >
                            <Eye className="w-3.5 h-3.5 text-blue-600" />
                            <span>Open Profile</span>
                          </button>

                          {/* Restore back to active leads */}
                          <button
                            onClick={() => handleRestoreFromArchive(rec)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-all cursor-pointer"
                            title="Restore lead back to Active Intake"
                          >
                            <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
                          </button>

                          {/* Delete from archive */}
                          <button
                            onClick={() => handleDeleteArchivedLead(rec.leadId, rec.fullName)}
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg border border-rose-200 transition-all cursor-pointer"
                            title="Delete Archived Record"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Archive Footer */}
            <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <div>
                Showing {filteredArchivedLeads.length} converted applicant leads out of {archivedLeads.length}
              </div>
              <div className="flex items-center gap-1">
                <button disabled className="px-2.5 py-1 rounded bg-slate-100 text-slate-600 font-bold disabled:opacity-50">
                  &lt; Previous
                </button>
                <span className="px-2.5 py-1 bg-[#042C51] text-white font-bold rounded">1</span>
                <button disabled className="px-2.5 py-1 rounded bg-slate-100 text-slate-600 font-bold disabled:opacity-50">
                  Next &gt;
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 3: CHANNEL SOURCES ==================== */}
        {activeTab === "sources" && (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Panel 1: Lead Generation Channel Breakdown */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <div>
                <h3 className="text-xs font-black text-[#042C51] uppercase tracking-wider">
                  Lead Generation Channel Breakdown
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Distribution of pre-applicant inquiries across recruitment channels.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                {[
                  { name: "Unassigned", count: 0, pct: 0, color: "bg-slate-400" },
                  { name: "Walk-in", count: 2, pct: 50, color: "bg-blue-600" },
                  { name: "Facebook / Social Media", count: 1, pct: 25, color: "bg-purple-600" },
                  { name: "Job Fair", count: 1, pct: 25, color: "bg-[#FF5C28]" },
                  { name: "Employee Referral", count: 0, pct: 0, color: "bg-emerald-600" },
                  { name: "Phone Call Inquiry", count: 0, pct: 0, color: "bg-amber-500" }
                ].map(item => (
                  <div key={item.name} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-700">
                      <span>{item.name}</span>
                      <span>
                        {item.count} leads ({item.pct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color}`} style={{ width: `${Math.max(item.pct, 2)}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Panel 2: Account Lead Intake Volume */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <div>
                <h3 className="text-xs font-black text-[#042C51] uppercase tracking-wider">
                  Account Lead Intake Volume
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Target account client demand from inbound leads.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                {[
                  { account: "CD - Collect", leads: 2, sub: "Target Account Client" },
                  { account: "CD - Teledentistry", leads: 1, sub: "Target Account Client" },
                  { account: "AHG Inbound/Outbound", leads: 1, sub: "Target Account Client" },
                  { account: "Bayshore Dental Studio", leads: 0, sub: "Target Account Client" }
                ].map(acc => (
                  <div
                    key={acc.account}
                    className="flex items-center justify-between p-3 bg-slate-50/80 rounded-xl border border-slate-200"
                  >
                    <div>
                      <div className="text-xs font-black text-[#042C51]">{acc.account}</div>
                      <div className="text-[10px] text-slate-400 font-medium">{acc.sub}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-black text-slate-800">{acc.leads}</div>
                      <div className="text-[10px] text-slate-400">Total Inquiries</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ==================== CANDIDATE PROFILE MODAL (From Archive) ==================== */}
      <CandidateProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        candidate={selectedCandidateForProfile}
        onMoveToPipeline={c => {
          setIsProfileModalOpen(false);
          onSwitchModule?.("Talent Pool");
        }}
      />

      {/* ==================== LEAD APPLICANT PROFILE MODAL & AUDIT HISTORY ==================== */}
      <LeadApplicantProfileModal
        isOpen={isLeadProfileModalOpen}
        lead={selectedLeadForProfile}
        currentUser={currentAccountName}
        onClose={() => setIsLeadProfileModalOpen(false)}
        onUpdateLead={handleUpdateLead}
        onMoveToTalentPool={handleMoveToTalentPool}
        onSendApplicationLink={handleSendLinkEmail}
        initialEditMode={isLeadProfileInitialEdit}
      />

      {/* ==================== LOG / EDIT LEAD MODAL ==================== */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white max-w-2xl w-full rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
            >
              {/* Header */}
              <div className="bg-[#042C51] text-white p-5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-400/30 flex items-center justify-center font-bold text-[#FF5C28]">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white">
                      {editingLead ? `Edit Applicant Lead: ${editingLead.fullName}` : "Log New Applicant Lead"}
                    </h3>
                    <p className="text-xs text-slate-300">
                      {editingLead ? `Lead ID: ${editingLead.id}` : `Recording lead by account: ${currentAccountName}`}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-slate-200 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSaveLead} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
                {/* Full Name Fields */}
                <div className="space-y-1">
                  <label className="font-extrabold text-[#042C51] uppercase tracking-wider text-[10px] block">
                    Applicant Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                    <input
                      type="text"
                      placeholder="First Name *"
                      value={formData.firstName}
                      onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                      required
                      className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-[#042C51] focus:bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Middle Name"
                      value={formData.middleName}
                      onChange={e => setFormData({ ...formData, middleName: e.target.value })}
                      className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-[#042C51] focus:bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Last Name *"
                      value={formData.lastName}
                      onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                      required
                      className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-[#042C51] focus:bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Suffix (Jr, III)"
                      value={formData.suffix}
                      onChange={e => setFormData({ ...formData, suffix: e.target.value })}
                      className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-[#042C51] focus:bg-white"
                    />
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-extrabold text-[#042C51] uppercase tracking-wider text-[10px] block mb-1">
                      Cellphone Number <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="098550486662"
                        value={formData.cpNum}
                        onChange={e => setFormData({ ...formData, cpNum: e.target.value })}
                        required
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:border-[#042C51] focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-extrabold text-[#042C51] uppercase tracking-wider text-[10px] block mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        placeholder="candidate@gmail.com"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-[#042C51] focus:bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Department & Account */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-extrabold text-[#042C51] uppercase tracking-wider text-[10px] block mb-1">
                      Department Position Category
                    </label>
                    <select
                      value={formData.department}
                      onChange={e => setFormData({ ...formData, department: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:border-[#042C51] focus:bg-white"
                    >
                      <option value="Call Center Operations">Call Center Operations</option>
                      <option value="Human Resource">Human Resource</option>
                      <option value="Facility Management">Facility Management</option>
                      <option value="IT (Information and Communications Technology)">IT (ICT)</option>
                      <option value="Executive / Operations">Executive / Operations</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-extrabold text-[#042C51] uppercase tracking-wider text-[10px] block mb-1">
                      Specific Target Account / Client
                    </label>
                    <select
                      value={formData.specificAccount}
                      onChange={e => setFormData({ ...formData, specificAccount: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:border-[#042C51] focus:bg-white"
                    >
                      <option value="CD - Collect">CD - Collect</option>
                      <option value="CD - Teledentistry">CD - Teledentistry</option>
                      <option value="AHG Inbound/Outbound">AHG Inbound/Outbound</option>
                      <option value="Bayshore Dental Studio">Bayshore Dental Studio</option>
                      <option value="AHG Auditor">AHG Auditor</option>
                      <option value="General Pool / Non-Voice">General Pool / Non-Voice</option>
                    </select>
                  </div>
                </div>

                {/* Source Channel & Preferred Site */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-extrabold text-[#042C51] uppercase tracking-wider text-[10px] block mb-1">
                      Lead Sourcing Channel
                    </label>
                    <select
                      value={formData.source}
                      onChange={e => setFormData({ ...formData, source: e.target.value as any })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:border-[#042C51] focus:bg-white"
                    >
                      <option value="Walk-in">Walk-in Inquiry</option>
                      <option value="Job Fair">Job Fair Booth</option>
                      <option value="Facebook / Social Media">Facebook / Social Media</option>
                      <option value="Phone Call Inquiry">Phone Call Inquiry</option>
                      <option value="Employee Referral">Employee Referral</option>
                      <option value="SMS Inquiry">SMS Inquiry</option>
                      <option value="LinkedIn">LinkedIn Outreach</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-extrabold text-[#042C51] uppercase tracking-wider text-[10px] block mb-1">
                      Preferred SiBS Site Location
                    </label>
                    <select
                      value={formData.preferredSite}
                      onChange={e => setFormData({ ...formData, preferredSite: e.target.value as any })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:border-[#042C51] focus:bg-white"
                    >
                      <option value="Tagum City">Tagum City Site (Main Hub)</option>
                      <option value="Davao City">Davao City Site</option>
                      <option value="Municipality of Mabini">Municipality of Mabini</option>
                    </select>
                  </div>
                </div>

                {/* Status Selection */}
                <div>
                  <label className="font-extrabold text-[#042C51] uppercase tracking-wider text-[10px] block mb-1">
                    Initial Lead Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:border-[#042C51] focus:bg-white"
                  >
                    <option value="New Lead">New Lead (Awaiting Contact)</option>
                    <option value="Contacted">Contacted (Spoke with applicant)</option>
                    <option value="Application Link Sent">Application Link Sent (SMS/Email Form)</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Not Interested">Not Interested</option>
                  </select>
                </div>

                {/* Notes */}
                <div>
                  <label className="font-extrabold text-[#042C51] uppercase tracking-wider text-[10px] block mb-1">
                    Initial Inquiry Notes & Background Remarks
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Provide details regarding the applicant's inquiry, previous experience, shift availability, etc."
                    value={formData.notes}
                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-[#042C51] focus:bg-white"
                  ></textarea>
                </div>

                {/* Footer Buttons */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#FF5C28] hover:bg-[#e04b1c] text-white font-black rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>{editingLead ? "Save Changes" : "Log Applicant Lead"}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================== BULK EXCEL IMPORT MODAL ==================== */}
      <AnimatePresence>
        {isBulkModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white max-w-xl w-full rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
            >
              <div className="bg-[#042C51] text-white p-5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Upload className="w-5 h-5 text-[#FF5C28]" />
                  <div>
                    <h3 className="text-base font-black text-white">Bulk Import Applicant Leads</h3>
                    <p className="text-xs text-slate-300">Upload .xlsx or .csv files with candidate lead rosters</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsBulkModalOpen(false)}
                  className="p-1 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4 text-xs">
                <div className="border-2 border-dashed border-slate-200 hover:border-[#042C51] rounded-2xl p-6 text-center bg-slate-50 transition-colors">
                  <FileSpreadsheet className="w-10 h-10 mx-auto text-blue-600 mb-2" />
                  <p className="font-black text-slate-800 text-sm">Select Excel / CSV Leads File</p>
                  <p className="text-xs text-slate-400 mt-0.5">Supports standard column headers (Full Name, Phone, Email, Account, etc.)</p>
                  <input
                    type="file"
                    accept=".xlsx, .xls, .csv"
                    onChange={handleFileUpload}
                    className="mt-4 text-xs text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#042C51] file:text-white hover:file:bg-[#FF5C28] file:cursor-pointer cursor-pointer"
                  />
                </div>

                {bulkError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-bold">
                    {bulkError}
                  </div>
                )}

                {parsedLeads.length > 0 && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                    <div className="flex items-center gap-2 text-emerald-800 font-black">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>Ready to import {parsedLeads.length} leads!</span>
                    </div>
                    <div className="max-h-32 overflow-y-auto divide-y divide-emerald-100 text-[11px] text-emerald-900 font-medium">
                      {parsedLeads.slice(0, 5).map((l, i) => (
                        <div key={i} className="py-1 flex justify-between">
                          <span>{l.fullName}</span>
                          <span className="font-mono text-emerald-700">{l.cpNum}</span>
                        </div>
                      ))}
                      {parsedLeads.length > 5 && (
                        <p className="text-[10px] text-emerald-600 pt-1 font-bold">
                          ...and {parsedLeads.length - 5} more records
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsBulkModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={parsedLeads.length === 0}
                    onClick={handleConfirmBulkImport}
                    className="px-5 py-2 bg-[#042C51] hover:bg-[#FF5C28] disabled:opacity-50 text-white font-black rounded-xl transition-all cursor-pointer"
                  >
                    Confirm Import ({parsedLeads.length})
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
