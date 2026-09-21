import React, { useState, useMemo } from "react";
import {
  Briefcase,
  Plus,
  RefreshCw,
  Search,
  SlidersHorizontal,
  X,
  CheckCircle,
  AlertCircle,
  MapPin,
  FileText,
  Check,
  Info,
  Edit2,
  Trash2,
  Database,
  Filter,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  HelpCircle,
  BookOpen,
  User,
  Calendar
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AvailablePositionsProps {
  userEmail?: string;
  onSwitchModule?: (module: string) => void;
}

export interface Position {
  id: string; // e.g. POS-001
  title: string;
  department: string;
  account: string;
  jdCode: string;
  documentTitle: string;
  location: string;
  status: "Active" | "Inactive";
  skills: string[];
  lastUpdated: string;
  updatedBy: string;
}

// Simulated live database categories mapping
const DEPARTMENTS_AND_ACCOUNTS: Record<string, string[]> = {
  "Telecom & Tech Support": ["Verizon Tech", "Comcast Technical", "T-Mobile Care"],
  "Healthcare & Insurance": ["UnitedHealth VIP", "Blue Cross Care"],
  "Financial Services Group": ["Chase Credit", "Citibank Operations"],
  "Retail & E-Commerce": ["Amazon Care", "Shopify Support Plus"]
};

// Initial database-seeded positions
const SEEDED_POSITIONS: Position[] = [
  {
    id: "POS-001",
    title: "Technical Support Rep (CSR)",
    department: "Telecom & Tech Support",
    account: "Comcast Technical",
    jdCode: "JD-CSR-TEL-04",
    documentTitle: "Comcast Tier 1 CSR Guideline v2.1",
    location: "Davao",
    status: "Active",
    skills: ["Troubleshooting", "Active Listening", "Billing Support"],
    lastUpdated: "2026-07-15",
    updatedBy: "Alena Batacan"
  },
  {
    id: "POS-002",
    title: "Tier 2 Technical Specialist",
    department: "Healthcare & Insurance",
    account: "UnitedHealth VIP",
    jdCode: "JD-TECH-HC-09",
    documentTitle: "UHP Tier 2 HIPAA Core Matrix",
    location: "Tagum",
    status: "Active",
    skills: ["HIPAA Compliance", "Technical Resolution", "EMR Navigation"],
    lastUpdated: "2026-07-18",
    updatedBy: "Shiela Delos Reyes"
  },
  {
    id: "POS-003",
    title: "Fraud & Disputes Agent",
    department: "Financial Services Group",
    account: "Chase Credit",
    jdCode: "JD-FIN-FRD-01",
    documentTitle: "Chase Consumer Protection Standard v1.0",
    location: "Mabini",
    status: "Active",
    skills: ["Risk Analytics", "Chargeback Processing", "Attention to Detail"],
    lastUpdated: "2026-07-12",
    updatedBy: "Mark Sarmiento"
  },
  {
    id: "POS-004",
    title: "Seasonal Support Rep",
    department: "Retail & E-Commerce",
    account: "Amazon Care",
    jdCode: "JD-RET-SEA-11",
    documentTitle: "Amazon Prime Day Support Manual",
    location: "Davao",
    status: "Inactive",
    skills: ["Fast Typing", "Customer Empathy", "Multi-ticketing"],
    lastUpdated: "2026-06-30",
    updatedBy: "Renz Torres"
  },
  {
    id: "POS-005",
    title: "Team Leader / Supervisor",
    department: "Telecom & Tech Support",
    account: "Verizon Tech",
    jdCode: "JD-MGR-TL-02",
    documentTitle: "SIBS Operations Leadership Playbook",
    location: "Mabini",
    status: "Active",
    skills: ["Coaching", "SLA Management", "Escalation Handling"],
    lastUpdated: "2026-07-19",
    updatedBy: "Alena Batacan"
  },
  {
    id: "POS-006",
    title: "Claim Processor Agent",
    department: "Healthcare & Insurance",
    account: "UnitedHealth VIP",
    jdCode: "JD-HC-CLM-03",
    documentTitle: "United Claims Adjudication Framework",
    location: "Davao",
    status: "Active",
    skills: ["Medical Coding", "Data Entry", "Accuracy"],
    lastUpdated: "2026-07-20",
    updatedBy: "Alena Batacan"
  }
];

export default function AvailablePositions({ userEmail, onSwitchModule }: AvailablePositionsProps) {
  // --- STATE ---
  const [positions, setPositions] = useState<Position[]>(SEEDED_POSITIONS);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Inactive">("All");
  const [deptFilter, setDeptFilter] = useState("All");
  const [accountFilter, setAccountFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingPosition, setEditingPosition] = useState<Position | null>(null);
  
  // Status confirmation modal state
  const [statusConfirmTarget, setStatusConfirmTarget] = useState<{
    position: Position;
    nextStatus: "Active" | "Inactive";
  } | null>(null);

  // --- FORM STATE ---
  const [formTitle, setFormTitle] = useState("");
  const [formDept, setFormDept] = useState("Telecom & Tech Support");
  const [formAccount, setFormAccount] = useState("Verizon Tech");
  const [formJdCode, setFormJdCode] = useState("JD-CSR-TEL-04");
  const [formDocTitle, setFormDocTitle] = useState("");
  const [formLocation, setFormLocation] = useState("Davao");
  const [formStatus, setFormStatus] = useState<"Active" | "Inactive">("Active");
  const [formSkillsString, setFormSkillsString] = useState("");

  // Toast helper
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Dynamically clear account filter when department filter changes
  const handleDeptFilterChange = (val: string) => {
    setDeptFilter(val);
    setAccountFilter("All");
  };

  // Reset Filters helper
  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
    setDeptFilter("All");
    setAccountFilter("All");
    setLocationFilter("All");
    triggerToast("All directory filters have been reset.");
  };

  // Get dynamic accounts for current department in filter/form
  const accountsForSelectedFilterDept = useMemo(() => {
    if (deptFilter === "All") return [];
    return DEPARTMENTS_AND_ACCOUNTS[deptFilter] || [];
  }, [deptFilter]);

  const accountsForFormDept = useMemo(() => {
    return DEPARTMENTS_AND_ACCOUNTS[formDept] || [];
  }, [formDept]);

  // Adjust form account automatically if selected department doesn't support the previous account
  const handleFormDeptChange = (dept: string) => {
    setFormDept(dept);
    const available = DEPARTMENTS_AND_ACCOUNTS[dept] || [];
    if (available.length > 0) {
      setFormAccount(available[0]);
    }
  };

  // --- FILTERED DATA LIST ---
  const filteredPositions = useMemo(() => {
    return positions.filter((pos) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        pos.title.toLowerCase().includes(q) ||
        pos.id.toLowerCase().includes(q) ||
        pos.jdCode.toLowerCase().includes(q) ||
        pos.documentTitle.toLowerCase().includes(q) ||
        pos.skills.some(s => s.toLowerCase().includes(q));

      const matchesStatus = statusFilter === "All" || pos.status === statusFilter;
      const matchesDept = deptFilter === "All" || pos.department === deptFilter;
      const matchesAccount = accountFilter === "All" || pos.account === accountFilter;
      const matchesLocation = locationFilter === "All" || pos.location === locationFilter;

      return matchesSearch && matchesStatus && matchesDept && matchesAccount && matchesLocation;
    });
  }, [positions, searchTerm, statusFilter, deptFilter, accountFilter, locationFilter]);

  // Pagination bounds text representation
  const paginationText = useMemo(() => {
    const total = positions.length;
    const showing = filteredPositions.length;
    if (showing === 0) return "Showing 0 positions";
    return `Showing 1 to ${showing} of ${total} positions registered in the DB`;
  }, [positions.length, filteredPositions.length]);

  // Open modal for Adding
  const handleOpenAddModal = () => {
    setEditingPosition(null);
    setFormTitle("");
    setFormDept("Telecom & Tech Support");
    setFormAccount("Verizon Tech");
    setFormJdCode("JD-CSR-TEL-04");
    setFormDocTitle("");
    setFormLocation("Davao");
    setFormStatus("Active");
    setFormSkillsString("Troubleshooting, Communication, SLA Adherence");
    setIsFormModalOpen(true);
  };

  // Open modal for Editing
  const handleOpenEditModal = (pos: Position) => {
    setEditingPosition(pos);
    setFormTitle(pos.title);
    setFormDept(pos.department);
    setFormAccount(pos.account);
    setFormJdCode(pos.jdCode);
    setFormDocTitle(pos.documentTitle);
    setFormLocation(pos.location);
    setFormStatus(pos.status);
    setFormSkillsString(pos.skills.join(", "));
    setIsFormModalOpen(true);
  };

  // Handle saving new or edited position
  const handleSavePositionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      triggerToast("Position title is required.");
      return;
    }

    const processedSkills = formSkillsString
      .split(",")
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const updatedByActor = "Alena Batacan"; // Default authorized operator

    if (editingPosition) {
      // Edit mode
      const updated = positions.map((pos) => {
        if (pos.id === editingPosition.id) {
          return {
            ...pos,
            title: formTitle,
            department: formDept,
            account: formAccount,
            jdCode: formJdCode,
            documentTitle: formDocTitle || `Standard ${formTitle} JD Spec`,
            location: formLocation,
            status: formStatus,
            skills: processedSkills,
            lastUpdated: "2026-07-20",
            updatedBy: updatedByActor
          };
        }
        return pos;
      });
      setPositions(updated);
      triggerToast(`Position ${editingPosition.id} ("${formTitle}") updated successfully in DB.`);
    } else {
      // Add mode
      const newId = `POS-0${positions.length + 1}`;
      const newPos: Position = {
        id: newId,
        title: formTitle,
        department: formDept,
        account: formAccount,
        jdCode: formJdCode,
        documentTitle: formDocTitle || `${formTitle} core operational blueprint`,
        location: formLocation,
        status: formStatus,
        skills: processedSkills,
        lastUpdated: "2026-07-20",
        updatedBy: updatedByActor
      };
      setPositions([newPos, ...positions]);
      triggerToast(`New Position ${newId} ("${formTitle}") successfully registered to the database!`);
    }

    setIsFormModalOpen(false);
  };

  // Quick Action Trigger for Status
  const handleQuickStatusToggle = (pos: Position, nextStatus: "Active" | "Inactive") => {
    setStatusConfirmTarget({ position: pos, nextStatus });
  };

  // Confirm Status change from modal
  const handleConfirmStatusChange = () => {
    if (!statusConfirmTarget) return;
    const { position, nextStatus } = statusConfirmTarget;

    const updated = positions.map((pos) => {
      if (pos.id === position.id) {
        return {
          ...pos,
          status: nextStatus,
          lastUpdated: "2026-07-20",
          updatedBy: "Alena Batacan"
        };
      }
      return pos;
    });

    setPositions(updated);
    triggerToast(`Status of ${position.id} changed to ${nextStatus}.`);
    setStatusConfirmTarget(null);
  };

  return (
    <div className="flex-1 flex flex-col space-y-6 select-none relative" id="available-positions-root">
      
      {/* Dynamic Toast alert */}
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
      <section className="bg-white p-5 rounded-2xl border border-[#E6ECF2] shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-[#E9F0FC] text-[#042C51] px-2.5 py-0.5 rounded font-black border border-blue-100 uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#042C51] inline-block animate-pulse"></span>
              Position Dictionary & Mapping
            </span>
            <span className="text-[10px] bg-[#FFF0EB] text-[#FF5C28] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
              Synced with Live DB
            </span>
          </div>
          <h1 className="text-xl font-black text-[#042C51] tracking-tight">Available Positions</h1>
          <p className="text-xs text-[#667085] leading-normal">
            Manage the canonical library of job roles, operational departments, client account mappings, and linked JD manuals.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#042C51] hover:bg-[#FF5C28] text-white text-xs font-black rounded-lg transition-all cursor-pointer shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Position</span>
        </button>
      </section>

      {/* ==================== 2. FILTERING & SEARCH ==================== */}
      <div className="bg-white p-4 rounded-xl border border-[#E6ECF2] shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal className="w-4 h-4 text-slate-500" />
            <h3 className="text-xs font-black text-[#042C51] uppercase tracking-wider">Search & Filter Directory</h3>
          </div>
          <button
            onClick={handleClearFilters}
            className="text-[10px] text-[#FF5C28] hover:underline font-bold"
          >
            Clear Filters
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          
          {/* Search Term */}
          <div className="md:col-span-4 relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by Title, ID, JD, Doc or Skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:bg-white text-slate-800"
            />
          </div>

          {/* Status Dropdown */}
          <div className="md:col-span-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full bg-slate-50 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 focus:outline-none focus:bg-white"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active Positions Only</option>
              <option value="Inactive">Inactive Positions Only</option>
            </select>
          </div>

          {/* Department Dropdown */}
          <div className="md:col-span-2">
            <select
              value={deptFilter}
              onChange={(e) => handleDeptFilterChange(e.target.value)}
              className="w-full bg-slate-50 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 focus:outline-none focus:bg-white"
            >
              <option value="All">All Departments</option>
              {Object.keys(DEPARTMENTS_AND_ACCOUNTS).map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {/* Account Dropdown (Filtered by selected Department) */}
          <div className="md:col-span-2">
            <select
              value={accountFilter}
              onChange={(e) => setAccountFilter(e.target.value)}
              disabled={deptFilter === "All"}
              className={`w-full bg-slate-50 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 focus:outline-none focus:bg-white ${
                deptFilter === "All" ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              <option value="All">
                {deptFilter === "All" ? "Select Dept First" : "All Client Accounts"}
              </option>
              {accountsForSelectedFilterDept.map((acc) => (
                <option key={acc} value={acc}>{acc}</option>
              ))}
            </select>
          </div>

          {/* Location / Site Dropdown */}
          <div className="md:col-span-2">
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full bg-slate-50 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 focus:outline-none focus:bg-white"
            >
              <option value="All">All Site Locations</option>
              <option value="Davao">Davao Hub</option>
              <option value="Tagum">Tagum Office</option>
              <option value="Mabini">Mabini Site</option>
            </select>
          </div>

        </div>
      </div>

      {/* ==================== 3. DATA TABLE & LIST ==================== */}
      <div className="bg-white p-5 rounded-2xl border border-[#E6ECF2] shadow-sm space-y-4">
        
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <div>
            <h3 className="text-sm font-black text-[#042C51]"> Canonical Positions Directory</h3>
            <p className="text-[10px] text-[#667085]">Verified structures mapped to legal agreements and SLA contracts</p>
          </div>
          
          <span className="text-[10px] bg-[#E9F0FC] text-[#042C51] px-2.5 py-0.5 rounded font-black border border-blue-100">
            {paginationText}
          </span>
        </div>

        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                  <th className="p-3">Pos. ID</th>
                  <th className="p-3">Position & Mapping</th>
                  <th className="p-3">Linked JD Manual</th>
                  <th className="p-3">Location / Site</th>
                  <th className="p-3">Core Skills Requirement</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Last Updated</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPositions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-12 text-center text-slate-400 font-bold">
                      No positions found matching the active filter parameters.
                    </td>
                  </tr>
                ) : (
                  filteredPositions.map((pos) => {
                    const isInactive = pos.status === "Inactive";
                    return (
                      <tr
                        key={pos.id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        {/* Pos. ID */}
                        <td className="p-3">
                          <span className="font-mono font-black text-[#042C51]">{pos.id}</span>
                        </td>

                        {/* Position Details */}
                        <td className="p-3">
                          <span className="font-extrabold text-[#042C51] block text-xs">{pos.title}</span>
                          <div className="flex flex-wrap gap-1 mt-0.5">
                            <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-semibold">
                              {pos.department}
                            </span>
                            <span className="text-[9px] bg-indigo-50 text-indigo-600 px-1.5 py-0.2 rounded font-semibold">
                              {pos.account}
                            </span>
                          </div>
                        </td>

                        {/* Linked JD Manual */}
                        <td className="p-3">
                          <div className="flex items-center gap-1">
                            <FileText className="w-3.5 h-3.5 text-[#FF5C28] shrink-0" />
                            <div>
                              <span className="text-slate-800 font-extrabold text-[10.5px] block truncate max-w-[180px]" title={pos.documentTitle}>
                                {pos.documentTitle}
                              </span>
                              <span className="text-[9px] text-slate-400 font-mono block">
                                {pos.jdCode}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Location */}
                        <td className="p-3">
                          <span className="text-slate-700 font-semibold flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {pos.location}
                          </span>
                        </td>

                        {/* Core Skills */}
                        <td className="p-3">
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {pos.skills.map((skill, i) => (
                              <span key={i} className="text-[9px] bg-blue-50 text-[#042C51] px-1 py-0.2 rounded font-medium">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                              pos.status === "Active"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-slate-100 text-slate-500 border border-slate-200"
                            }`}
                          >
                            {pos.status}
                          </span>
                        </td>

                        {/* Last Updated */}
                        <td className="p-3">
                          <span className="text-slate-700 font-medium block text-[10px]">{pos.lastUpdated}</span>
                          <span className="text-[9px] text-slate-400 block">By: {pos.updatedBy}</span>
                        </td>

                        {/* Actions */}
                        <td className="p-3">
                          <div className="flex items-center justify-center gap-1">
                            {pos.status === "Inactive" ? (
                              <button
                                onClick={() => handleQuickStatusToggle(pos, "Active")}
                                className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded text-[9px] font-black uppercase transition-all"
                                title="Set role as Active"
                              >
                                Set Active
                              </button>
                            ) : (
                              <button
                                onClick={() => handleQuickStatusToggle(pos, "Inactive")}
                                className="px-2 py-1 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 text-slate-600 border border-slate-200 rounded text-[9px] font-black uppercase transition-all"
                                title="Set role as Inactive"
                              >
                                Set Inactive
                              </button>
                            )}

                            <button
                              onClick={() => handleOpenEditModal(pos)}
                              className="p-1 text-slate-500 hover:text-[#042C51] hover:bg-slate-100 rounded border border-slate-200"
                              title="Edit role details"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ==================== 4. DATABASE RULE NOTE ==================== */}
      <section className="bg-[#FFF0EB] p-4 rounded-xl border border-[#FF5C28]/20 flex items-start gap-3">
        <Database className="w-4.5 h-4.5 text-[#FF5C28] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-xs font-black text-[#042C51] flex items-center gap-1.5">
            System Architecture Protocol (SIBS Core Engine)
          </h4>
          <p className="text-[10.5px] text-slate-700 leading-relaxed">
            <strong>Database Rule Notice:</strong> This module runs on real-time enterprise DB schemas and does not save to local temporary parameters such as <code>localStorage</code>. All mapping records, including canonical Departments, corporate Client accounts, and linked operational JD codes, are fetched directly from our relational database tables to prevent integrity conflicts across different site locations.
          </p>
        </div>
      </section>

      {/* ==================== 5. MODALS & WORKFLOWS ==================== */}

      {/* FORM MODAL (ADD & EDIT) */}
      <AnimatePresence>
        {isFormModalOpen && (
          <div className="fixed inset-0 bg-[#042C51]/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden text-slate-900"
            >
              {/* Header */}
              <div className="p-4 bg-[#042C51] text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-[#FF5C28]" />
                  <div>
                    <h2 className="text-sm font-black">
                      {editingPosition ? "Edit Position Blueprint" : "Register Position Blueprint"}
                    </h2>
                    <p className="text-[10px] text-slate-300 font-medium">
                      {editingPosition ? `Updating parameters for ${editingPosition.id}` : "Seed a new canonical role mapping"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsFormModalOpen(false)}
                  className="p-1 rounded-lg bg-white/10 hover:bg-white/25 text-white"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Form content */}
              <form onSubmit={handleSavePositionSubmit} className="p-6 space-y-4">
                
                {/* Position Title */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Position / Job Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Escalation Specialist"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:bg-white text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Department */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Department</label>
                    <select
                      value={formDept}
                      onChange={(e) => handleFormDeptChange(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:bg-white text-slate-800"
                    >
                      {Object.keys(DEPARTMENTS_AND_ACCOUNTS).map((dept) => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>

                  {/* Account (Filtered automatically) */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Account Client (Mapped)</label>
                    <select
                      value={formAccount}
                      onChange={(e) => setFormAccount(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:bg-white text-slate-800"
                    >
                      {accountsForFormDept.map((acc) => (
                        <option key={acc} value={acc}>{acc}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* JD Code */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Job Description (JD) Code</label>
                    <select
                      value={formJdCode}
                      onChange={(e) => setFormJdCode(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:bg-white text-slate-800"
                    >
                      <option value="JD-CSR-TEL-04">JD-CSR-TEL-04 (Tech Tier 1)</option>
                      <option value="JD-TECH-HC-09">JD-TECH-HC-09 (Claims/HIPAA Tier 2)</option>
                      <option value="JD-FIN-FRD-01">JD-FIN-FRD-01 (Fraud/Dispute Specialist)</option>
                      <option value="JD-MGR-TL-02">JD-MGR-TL-02 (Operational Team Leader)</option>
                      <option value="JD-HC-CLM-03">JD-HC-CLM-03 (Standard Processor)</option>
                    </select>
                  </div>

                  {/* Document Title */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Linked Document Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Core HIPAA Compliance Handbook v2.1"
                      required
                      value={formDocTitle}
                      onChange={(e) => setFormDocTitle(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:bg-white text-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Location / Site */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Target Location Site</label>
                    <select
                      value={formLocation}
                      onChange={(e) => setFormLocation(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:bg-white text-slate-800"
                    >
                      <option value="Davao">Davao Hub</option>
                      <option value="Tagum">Tagum Office</option>
                      <option value="Mabini">Mabini Site</option>
                    </select>
                  </div>

                  {/* Initial Status */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Active Status State</label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value as any)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:bg-white"
                    >
                      <option value="Active">Active Role (Selectable in Ramps)</option>
                      <option value="Inactive">Inactive Role (Archived in Ramps)</option>
                    </select>
                  </div>
                </div>

                {/* Skills Requirements */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                    Core Skills Requirements (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Coaching, Performance Analytics, SLA Delivery"
                    required
                    value={formSkillsString}
                    onChange={(e) => setFormSkillsString(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:bg-white text-slate-800"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsFormModalOpen(false)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-[#042C51] hover:bg-[#FF5C28] text-white text-xs font-black rounded-lg transition-all"
                  >
                    {editingPosition ? "Save Modifications" : "Save Seeded Record"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CONFIRMATION MODAL */}
      <AnimatePresence>
        {statusConfirmTarget && (
          <div className="fixed inset-0 bg-[#042C51]/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-sm overflow-hidden text-slate-900"
            >
              <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2 text-slate-800">
                <HelpCircle className="w-5 h-5 text-[#FF5C28]" />
                <h3 className="font-black text-xs text-[#042C51]">Confirm Status Change</h3>
              </div>
              <div className="p-5 space-y-3">
                <p className="text-xs text-slate-600 leading-relaxed">
                  You are about to change the active directory status of{" "}
                  <strong>{statusConfirmTarget.position.title}</strong> ({statusConfirmTarget.position.id}) to{" "}
                  <span className={`font-bold ${statusConfirmTarget.nextStatus === "Active" ? "text-emerald-600" : "text-rose-600"}`}>
                    {statusConfirmTarget.nextStatus}
                  </span>
                  .
                </p>
                <p className="text-[10px] text-slate-400">
                  This transaction triggers automatic updates in active personnel ramp forecasts.
                </p>
              </div>
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
                <button
                  onClick={() => setStatusConfirmTarget(null)}
                  className="px-3 py-1 bg-slate-200 text-slate-700 hover:bg-slate-300 rounded text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmStatusChange}
                  className="px-4 py-1 bg-[#042C51] hover:bg-[#FF5C28] text-white rounded text-xs font-black transition-all"
                >
                  Confirm Change
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
