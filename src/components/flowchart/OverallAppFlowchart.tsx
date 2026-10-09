import React, { useState, useMemo } from "react";
import { 
  ShieldCheck, 
  Users, 
  UserCheck, 
  Briefcase, 
  Clock, 
  Calendar, 
  UserX, 
  LayoutDashboard, 
  Search, 
  ExternalLink, 
  CheckCircle2, 
  ArrowRight, 
  ArrowDown, 
  ChevronRight, 
  Sparkles, 
  FileText, 
  Inbox, 
  UserPlus, 
  Compass, 
  Network, 
  CheckSquare, 
  PieChart, 
  Mail, 
  BarChart3, 
  DollarSign, 
  CreditCard, 
  Building2, 
  MapPin, 
  Settings, 
  Key, 
  Play, 
  Pause, 
  RotateCcw, 
  X, 
  GitFork, 
  Layers, 
  Lock, 
  FileCheck, 
  AlertCircle,
  TrendingDown,
  ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import PersonnelRequisitionModal, { RequisitionFormData } from "../PersonnelRequisitionModal";

export type FlowSectionCategory = 
  | "all"
  | "access"
  | "core-hr"
  | "recruitment"
  | "communications"
  | "analytics"
  | "administration"
  | "settings";

export interface OverallFlowNode {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  section: "access" | "core-hr" | "recruitment" | "communications" | "analytics" | "administration" | "settings";
  sectionLabel: string;
  badge: string;
  badgeColor: string;
  icon: any;
  roles: string[];
  description: string;
  inputs: string[];
  outputs: string[];
  keyActions: string[];
  sla: string;
  moduleKey?: string;
  hasRequisitionModal?: boolean;
}

export const OVERALL_APP_NODES: OverallFlowNode[] = [
  // ==================== SECTION 1: ACCOUNT ACCESS LEVEL ====================
  {
    id: "acc-auth",
    code: "ACC-01",
    title: "Authentication & SSO Gateway",
    subtitle: "Identity Verification & Secure Session Handshake",
    section: "access",
    sectionLabel: "Account Access Level",
    badge: "Security Gate",
    badgeColor: "bg-[#042C51] text-white",
    icon: Key,
    roles: ["All Users", "Super Admin", "OM", "HR/TA", "Employee"],
    description: "Multi-factor authentication (MFA), Single Sign-On (SSO), and JWT token minting validating user identity against organizational directory before granting workspace entry.",
    inputs: ["Corporate Email", "SSO OAuth Token", "2FA OTP / Hardware Key"],
    outputs: ["Authenticated Session", "Decrypted User Claims", "Active Role Context"],
    keyActions: ["Credential Validation", "Session Expiry Guard", "Audit Log Entry"],
    sla: "Instant (<250ms)",
    moduleKey: "Account Settings"
  },
  {
    id: "acc-super-admin",
    code: "ACC-02",
    title: "Super Admin Access Level",
    subtitle: "Full Ecosystem Governance & Security Administration",
    section: "access",
    sectionLabel: "Account Access Level",
    badge: "Role Level 4",
    badgeColor: "bg-purple-700 text-white",
    icon: ShieldCheck,
    roles: ["Super Admin", "Executive Director"],
    description: "Highest authorization tier with unrestricted rights: department management, office locations, security policies, global system audit logs, and account-level overrides.",
    inputs: ["Executive Auth Credentials", "Security Clearance Policy"],
    outputs: ["Global Schema Changes", "Role Elevation Events", "Tenant Configs"],
    keyActions: ["Manage Departments & Sites", "Configure RBAC Matrix", "Audit System Activities"],
    sla: "Continuous / Always-on",
    moduleKey: "Super Admin Dashboard"
  },
  {
    id: "acc-ops-manager",
    code: "ACC-03",
    title: "Operations Manager (OM) Access Level",
    subtitle: "Department Leadership & Workforce Demand Routing",
    section: "access",
    sectionLabel: "Account Access Level",
    badge: "Role Level 3",
    badgeColor: "bg-[#1D68BD] text-white",
    icon: Briefcase,
    roles: ["Operations Manager (OM)", "Account Lead", "SOM"],
    description: "Operational leadership tier: initiates hiring needs requisitions, monitors campaign staffing ramps, approves shift schedules, endorses leave applications, and reviews resignations.",
    inputs: ["Account Capacity Targets", "Client SOW Commitments", "Campaign Rosters"],
    outputs: ["Approved Hiring Requisitions", "Shift Approvals", "Clearance Sign-offs"],
    keyActions: ["Submit Personnel Requisition", "Approve Attendance & Leaves", "Review Resignation Filings"],
    sla: "Daily Ops Shift Cycle",
    moduleKey: "OM Dashboard"
  },
  {
    id: "acc-ta-recruiter",
    code: "ACC-04",
    title: "HR & Talent Acquisition Access Level",
    subtitle: "End-to-End Talent Supply & Candidate Lifecycle Execution",
    section: "access",
    sectionLabel: "Account Access Level",
    badge: "Role Level 2",
    badgeColor: "bg-[#FF5C28] text-white",
    icon: Users,
    roles: ["TA Specialist", "Recruiter", "HR Officer", "Sourcing Specialist"],
    description: "Talent acquisition execution tier: manages job requisitions, sources applicant leads, screens talent pools, facilitates pipeline stages, extends offers, and prepares new hires for Day 1.",
    inputs: ["Approved Position Quotas", "Applicant Resumes", "Job Descriptions"],
    outputs: ["Hired Candidates", "Signed Offer Letters", "Onboarded Employee Profiles"],
    keyActions: ["Screen Candidate Applications", "Conduct Behavioral Interviews", "Draft Offer & Onboarding"],
    sla: "Candidate SLA (1-4 Days)",
    moduleKey: "TA Dashboard"
  },
  {
    id: "acc-employee",
    code: "ACC-05",
    title: "Employee Self-Service Access Level",
    subtitle: "Individual Employee Portal & Attendance Interaction",
    section: "access",
    sectionLabel: "Account Access Level",
    badge: "Role Level 1",
    badgeColor: "bg-[#0E8773] text-white",
    icon: UserCheck,
    roles: ["Core Employee", "Agent", "Team Lead"],
    description: "Standard employee self-service tier: view personal employment masterfile, clock biometric logs, view Daily Time Records (DTR), file leave requests, and submit voluntary resignations.",
    inputs: ["Employee SIBS ID", "Biometric Punch Device", "Leave Credits"],
    outputs: ["Daily DTR Entries", "Leave Applications", "Resignation Intent Letter"],
    keyActions: ["Clock Daily Attendance", "File Vacation/Sick Leaves", "Submit Resignation Notice"],
    sla: "Real-time Self-service",
    moduleKey: "HR Dashboard"
  },

  // ==================== SECTION 2: CORE HRIS PROCESSES ====================
  {
    id: "chr-dashboard",
    code: "CHR-01",
    title: "HR & Operational Dashboards",
    subtitle: "Central Command: Headcount, Attendance & Task Queues",
    section: "core-hr",
    sectionLabel: "Core HRIS Processes",
    badge: "Overview Hub",
    badgeColor: "bg-[#0E8773] text-white",
    icon: LayoutDashboard,
    roles: ["Super Admin", "HR Director", "OM", "TA Lead"],
    description: "Centralized real-time overview visualizing active headcount across multi-campus sites, daily clock-in compliance, pending leave requests, attrition metrics, and urgent action items.",
    inputs: ["Masterfile DB", "Biometric API Logs", "Workflow Pending Queues"],
    outputs: ["Executive KPI Tiles", "Attendance Summaries", "Real-Time Roster Status"],
    keyActions: ["Review Daily Headcount", "Action Urgent Approvals", "Export KPI Snapshots"],
    sla: "Live Updates (<5s)",
    moduleKey: "HR Dashboard"
  },
  {
    id: "chr-directory",
    code: "CHR-02",
    title: "Employee Directory & 201 Records",
    subtitle: "Employee Masterfile, Organizational Hierarchy & Employment Status",
    section: "core-hr",
    sectionLabel: "Core HRIS Processes",
    badge: "Master Database",
    badgeColor: "bg-[#0E8773] text-white",
    icon: Users,
    roles: ["HR Officers", "OM", "Super Admin"],
    description: "Comprehensive 201 digital archive containing employee demographics, department allocations, direct manager reporting structure, employment status (Probationary, Regular), and government IDs.",
    inputs: ["Completed Onboarding Form", "Signed Employment Contract", "201 Documents"],
    outputs: ["Active Employee SIBS Profile", "Department Org Hierarchy", "Payroll Reference ID"],
    keyActions: ["Search & Filter Workforce", "Update Job Designation", "Archive Separated Records"],
    sla: "Permanent Digital Record",
    moduleKey: "Employee Directory"
  },
  {
    id: "chr-attendance",
    code: "CHR-03",
    title: "Time & Attendance (DTR & Biometrics)",
    subtitle: "Daily Time Recording, Shift Schedules & Tardiness Resolution",
    section: "core-hr",
    sectionLabel: "Core HRIS Processes",
    badge: "Daily Operations",
    badgeColor: "bg-[#0E8773] text-white",
    icon: Clock,
    roles: ["Employees", "Supervisors", "Timekeeping Officers"],
    description: "Tracks biometric terminal logs, computes daily undertime/tardiness, handles shift schedule rotations, enables supervisor dispute resolution, and outputs verified hours for payroll.",
    inputs: ["Biometric Facial/Fingerprint Scans", "Official Shift Templates", "Manual Log Disputes"],
    outputs: ["Validated DTR Records", "Overtime Authorizations", "Payroll-ready Hours"],
    keyActions: ["Sync Biometric Terminal Logs", "Review Shift Discrepancies", "Approve Overtime Claims"],
    sla: "Cut-off Cycle (15th / 30th)",
    moduleKey: "Time & Attendance"
  },
  {
    id: "chr-leaves",
    code: "CHR-04",
    title: "Leaves & Time Off Management",
    subtitle: "Leave Balances, Application Filings & Multi-Level Approvals",
    section: "core-hr",
    sectionLabel: "Core HRIS Processes",
    badge: "Benefits & Policy",
    badgeColor: "bg-[#0E8773] text-white",
    icon: Calendar,
    roles: ["Employees", "Supervisors", "HR Officers"],
    description: "Automated leave credit calculation (Vacation, Sick, Emergency, Maternity/Paternity), self-service leave submission, multi-step supervisor approval workflow, and attendance calendar synchronization.",
    inputs: ["Employee Leave Request", "Medical Certificates", "Accrued Credit Balances"],
    outputs: ["Approved Leave Slips", "Adjusted DTR Records", "Roster Absence Flags"],
    keyActions: ["Submit Leave Request", "Validate Policy Compliance", "Approve/Reject Application"],
    sla: "24-48 Hours Approval Window",
    moduleKey: "Leaves & Time Off"
  },
  {
    id: "chr-resignation",
    code: "CHR-05",
    title: "Resignation & Separation Management",
    subtitle: "Notice Filing, 30-Day Transition, Multi-Dept Clearance & Exit",
    section: "core-hr",
    sectionLabel: "Core HRIS Processes",
    badge: "Attrition Trigger",
    badgeColor: "bg-rose-600 text-white",
    icon: UserX,
    roles: ["Resigning Employee", "OM / Supervisors", "IT Clearance", "HR Exit"],
    description: "Formal separation workflow tracking: employee resignation notice, 30-day rendering period, operational counter-offer evaluation, multi-department exit clearance (IT asset handover, finance liabilities), and vacancy trigger back to Recruitment.",
    inputs: ["Resignation Letter", "Exit Clearance Form", "Asset Return Checklist"],
    outputs: ["Cleared Separation Certificate", "COE & Final Pay Authorization", "Headcount Attrition Deficit -> Feeds Recruitment"],
    keyActions: ["File Resignation Notice", "Conduct Exit Interview", "Trigger Backfill Requisition"],
    sla: "30-Day Statutory Notice",
    moduleKey: "Resignation Management"
  },

  // ==================== SECTION 3: RECRUITMENT PROCESSES ====================
  {
    id: "rec-ramps",
    code: "REC-01",
    title: "Workforce & Hiring Plan (RAMPS)",
    subtitle: "Capacity Forecasting, Attrition Buffers & Hiring Curves",
    section: "recruitment",
    sectionLabel: "Recruitment & TA",
    badge: "Demand Planning",
    badgeColor: "bg-[#1D68BD] text-white",
    icon: Briefcase,
    roles: ["Workforce Planning (WFM)", "OM", "TA Director"],
    description: "Mathematical ramp modeling predicting future staffing requirements across business campaigns based on client SLAs, historical attrition, absenteeism buffers, and production targets.",
    inputs: ["Client SOW Headcount", "Core HR Resignation Rates", "Campaign Launch Dates"],
    outputs: ["Weekly Hiring Ramps", "Headcount Quota Allocations", "Buffer Variance Metrics"],
    keyActions: ["Model Ramp Scenarios", "Calculate Weekly Hiring Targets", "Establish Account Headcount Caps"],
    sla: "Weekly & Monthly Cadence",
    moduleKey: "Workforce Hiring"
  },
  {
    id: "rec-jd",
    code: "REC-02",
    title: "Job Description Repository",
    subtitle: "Role Specifications, Competencies, Salary Bands & Grade Levels",
    section: "recruitment",
    sectionLabel: "Recruitment & TA",
    badge: "Role Architecture",
    badgeColor: "bg-[#1D68BD] text-white",
    icon: FileText,
    roles: ["HR Officers", "Department Heads", "Compensation & Benefits"],
    description: "Master catalog of approved corporate job descriptions containing standard competency frameworks, educational/experience prerequisites, behavioral expectations, and approved compensation ranges.",
    inputs: ["Department Organizational Need", "Compensation Benchmark", "Job Grade Framework"],
    outputs: ["Approved JD Document", "Evaluation Rubric Template", "Public Vacancy Post Template"],
    keyActions: ["Draft Role Competencies", "Approve Salary Bands", "Attach Assessment Criteria"],
    sla: "Quarterly Review / On-demand",
    moduleKey: "Job Description"
  },
  {
    id: "rec-intake",
    code: "REC-03",
    title: "Hiring Needs Intake & Requisition",
    subtitle: "Split Process: Requisition (+ Headcount) vs. Downsizing (- Quota)",
    section: "recruitment",
    sectionLabel: "Recruitment & TA",
    badge: "Dual-Track Intake",
    badgeColor: "bg-[#FF5C28] text-white",
    icon: Inbox,
    roles: ["Hiring Manager (OM)", "WFM Reviewer", "Site Director"],
    description: "Official personnel requisition submission with dual-track architecture: Requisition Track (+ Headcount) for expansion/backfills, or Downsizing Track (- Quota) for capacity reduction. Features 1:1 modal intake with SIBS ID tracking.",
    inputs: ["Manager SIBS ID #6496", "Position & Headcount Count", "Reason & Target Start Date"],
    outputs: ["Signed Requisition Ticket", "Approved Headcount Slot", "WFM Roster Alignment"],
    keyActions: ["Submit 1:1 Personnel Form", "OM & SOM Sign-off", "WFM Roster Verification"],
    sla: "24-48 Hours Approval Window",
    moduleKey: "Hiring Needs Intake",
    hasRequisitionModal: true
  },
  {
    id: "rec-positions",
    code: "REC-04",
    title: "Available Positions & Publishing",
    subtitle: "Position Publishing, Headcount Allocation & Campus Distribution",
    section: "recruitment",
    sectionLabel: "Recruitment & TA",
    badge: "Active Vacancies",
    badgeColor: "bg-[#1D68BD] text-white",
    icon: Briefcase,
    roles: ["TA Lead", "Recruiter", "Marketing / Brand"],
    description: "Converts authorized personnel requisitions into published active position listings across physical campuses (Davao Hub, Tagum HQ, Mabini Campus) and internal careers portal.",
    inputs: ["Approved Personnel Requisition", "Standard Job Description", "Site Workstation Capacity"],
    outputs: ["Published Job Openings", "Public Application Links", "Tracking Requisition IDs"],
    keyActions: ["Publish Position Online", "Assign Dedicated Recruiter", "Set Application Form Schema"],
    sla: "Within 24h of Approval",
    moduleKey: "Available Positions"
  },
  {
    id: "rec-sourcing",
    code: "REC-05",
    title: "Sourcing Analytics & Applicant Leads",
    subtitle: "Multi-Channel Ingest: Job Boards, Social, Referrals & Walk-ins",
    section: "recruitment",
    sectionLabel: "Recruitment & TA",
    badge: "Lead Generation",
    badgeColor: "bg-[#1D68BD] text-white",
    icon: Compass,
    roles: ["Sourcing Specialists", "TA Officers", "Referral Coordinators"],
    description: "Inbound and outbound talent acquisition channels: resume parsing, applicant lead ingestion, source effectiveness attribution, employee referral tagging, and cost-per-lead analytics.",
    inputs: ["External Portals (JobStreet, Indeed)", "Employee Referrals", "Social Campaign Leads"],
    outputs: ["Normalized Applicant Leads", "Source Attribution Tag", "Parsed Resume Profiles"],
    keyActions: ["Ingest Candidate Profiles", "Deduplicate Applicant Records", "Measure Channel ROI"],
    sla: "Continuous Intake",
    moduleKey: "Sourcing Analytics"
  },
  {
    id: "rec-pool",
    code: "REC-06",
    title: "Talent Pool & Rediscovery",
    subtitle: "Pre-Screening Repository, Skill Matrix & Candidate Nurturing",
    section: "recruitment",
    sectionLabel: "Recruitment & TA",
    badge: "Talent Vault",
    badgeColor: "bg-[#1D68BD] text-white",
    icon: Users,
    roles: ["Recruiters", "Sourcing Coordinators"],
    description: "Comprehensive repository of qualified talent, past applicants, silver medalists, and rediscovery candidates categorized by core competencies, languages, and site availability.",
    inputs: ["Applicant Records", "Initial Qualification Scores", "Availability Status"],
    outputs: ["Pre-qualified Candidates", "Tagged Competency Sets", "Pipeline Shortlists"],
    keyActions: ["Initial Phone Screening", "Re-engage Silver Medalists", "Tag Candidate Skills"],
    sla: "Under 48 Hours to Triage",
    moduleKey: "Talent Pool"
  },
  {
    id: "rec-pipeline",
    code: "REC-07",
    title: "Candidate Pipeline & Assessment",
    subtitle: "Structured Interviews, Cognitive Tests, Ops Review & Scoring",
    section: "recruitment",
    sectionLabel: "Recruitment & TA",
    badge: "Evaluation Engine",
    badgeColor: "bg-purple-700 text-white",
    icon: Network,
    roles: ["HR Evaluators", "Operations Managers", "Account Supervisors"],
    description: "Multi-stage sequential assessment workflow: Initial HR Screening -> Technical & Language Evaluation -> Hiring Manager Interview -> Background Check with objective standardized scorecards.",
    inputs: ["Shortlisted Candidate Profile", "Role Evaluation Rubric", "Interview Feedback"],
    outputs: ["Weighted Scorecard Result", "Pass/Fail Recommendation", "Hiring Approval Decision"],
    keyActions: ["Schedule Panel Interviews", "Score Assessment Matrix", "Conduct Reference Checks"],
    sla: "3-5 Business Days Total",
    moduleKey: "Candidate Pipeline"
  },
  {
    id: "rec-offers",
    code: "REC-08",
    title: "Offers & Employment Terms",
    subtitle: "Compensation Packaging, Management Sign-off & E-Signature",
    section: "recruitment",
    sectionLabel: "Recruitment & TA",
    badge: "Contracting",
    badgeColor: "bg-[#042C51] text-white",
    icon: CheckSquare,
    roles: ["TA Lead", "Compensation & Benefits", "Selected Candidate"],
    description: "Generates tailored job offers aligned with approved compensation bands, initiates executive and OM approvals, delivers electronic offer letters, and tracks formal candidate contract acceptance.",
    inputs: ["Successful Candidate File", "Approved Salary Package", "Start Date Commitment"],
    outputs: ["Countersigned Offer Letter", "Pre-employment Checklist", "Locked Headcount Slot"],
    keyActions: ["Generate Offer Letter", "Negotiate Compensation", "Secure Digital E-Signature"],
    sla: "24-48 Hours Offer Window",
    moduleKey: "Offers"
  },
  {
    id: "rec-onboard",
    code: "REC-09",
    title: "Onboarding & Pre-Employment",
    subtitle: "Medical/201 Clearance, IT Provisioning & Day 1 Handover to Core HR",
    section: "recruitment",
    sectionLabel: "Recruitment & TA",
    badge: "Core HR Handshake",
    badgeColor: "bg-emerald-600 text-white",
    icon: UserCheck,
    roles: ["Onboarding Specialist", "IT Infrastructure", "Training & Admin"],
    description: "Guides candidate through mandatory pre-employment compliance (NBI, medical exam, SSS/TIN/PhilHealth), provisions corporate hardware/email, and on Day 1 creates formal employee record in Employee Directory!",
    inputs: ["Signed Contract", "201 Compliance Documents", "IT Access Requisition"],
    outputs: ["Provisioned Workstation & Email", "Day 1 Orientation Completed", "New Employee Directory Profile in Core HR!"],
    keyActions: ["Verify Compliance Docs", "Provision IT Credentials", "Complete Core HR Handover"],
    sla: "5-7 Days Pre-Day 1",
    moduleKey: "Onboarding"
  },
  {
    id: "rec-actions",
    code: "REC-10",
    title: "Action Items & SLA Guardrails",
    subtitle: "Recruiter Task Queues, Bottleneck Alerts & Expiring Requisitions",
    section: "recruitment",
    sectionLabel: "Recruitment & TA",
    badge: "Operations Radar",
    badgeColor: "bg-amber-600 text-white",
    icon: CheckSquare,
    roles: ["Recruitment Team", "TA Team Leads"],
    description: "Active task dispatcher tracking recruiter milestone SLAs, overdue candidate feedback, pending manager approvals, upcoming start date orientations, and requisition aging alerts.",
    inputs: ["Pipeline Event Timestamps", "Requisition Aging Records", "Interviewer Feedback Due"],
    outputs: ["Automated SLA Alerts", "Priority Action Lists", "Escalation Triggers"],
    keyActions: ["Track Daily SLA Deadlines", "Resolve Interview Bottlenecks", "Escalate Inactive Tickets"],
    sla: "Daily Morning Standup",
    moduleKey: "Action Items"
  },
  {
    id: "rec-reports",
    code: "REC-11",
    title: "Weekly Reports & TA Metrics",
    subtitle: "Executive Summary: Time-to-Fill, Pass Rates & Headcount Attainment",
    section: "recruitment",
    sectionLabel: "Recruitment & TA",
    badge: "Executive Intel",
    badgeColor: "bg-[#1D68BD] text-white",
    icon: PieChart,
    roles: ["TA Director", "Operations Executives", "Client Stakeholders"],
    description: "Weekly consolidated recruitment performance report breaking down candidate volume across sourcing channels, funnel conversion ratios, time-to-hire by department, and weekly target attainment.",
    inputs: ["Weekly Pipeline Data", "Workforce Target Numbers", "Interviewer Performance"],
    outputs: ["Consolidated Weekly Briefing", "Funnel Conversion Charts", "Client Ramp Reports"],
    keyActions: ["Generate Executive PDF/Report", "Analyze Pipeline Velocity", "Identify Funnel Drop-offs"],
    sla: "Weekly (Every Monday Morning)",
    moduleKey: "Weekly Reports"
  },
  {
    id: "rec-experience",
    code: "REC-12",
    title: "Candidate Experience & Feedback",
    subtitle: "CSAT/NPS Surveys, Recruiter Professionalism & Candidate Care",
    section: "recruitment",
    sectionLabel: "Recruitment & TA",
    badge: "Quality Assurance",
    badgeColor: "bg-indigo-600 text-white",
    icon: Sparkles,
    roles: ["Recruitment Quality Lead", "Candidates"],
    description: "Post-interview and post-onboarding candidate sentiment scoring measuring communication transparency, interview professionalism, facility impressions, and candidate NPS rating.",
    inputs: ["Completed Experience Surveys", "Candidate Sentiment Feedback", "Glassdoor Reviews"],
    outputs: ["Candidate NPS Score", "Recruiter Care Ratings", "Process Improvement Insights"],
    keyActions: ["Dispatch Post-stage Surveys", "Aggregate NPS Feedback", "Audit Interview Etiquette"],
    sla: "Automated Post-stage Dispatch",
    moduleKey: "Candidate Experience"
  },

  // ==================== SECTION 4: OTHER PROCESSES (DIVIDED BY SECTION) ====================
  // 4.1 COMMUNICATIONS
  {
    id: "com-email",
    code: "COM-01",
    title: "Email Logs & Communication Hub",
    subtitle: "System Mail Dispatcher, Automated Notifications & Delivery Logs",
    section: "communications",
    sectionLabel: "Communications",
    badge: "Messaging Audit",
    badgeColor: "bg-sky-600 text-white",
    icon: Mail,
    roles: ["System Dispatcher", "Recruiters", "HR Operations"],
    description: "Centralized communication log recording all outgoing system notifications, interview invitations, rejection notices, offer letter emails, and password resets with delivery status and timestamp history.",
    inputs: ["Recruitment Pipeline Triggers", "System Notification Templates", "Candidate Email Addresses"],
    outputs: ["Delivered SMTP Messages", "Read / Open Receipts", "Email Audit Trail"],
    keyActions: ["Audit Outgoing Candidate Comms", "Resend Failed Email Notices", "Configure System Templates"],
    sla: "Instant Real-time Dispatch",
    moduleKey: "Email Logs"
  },

  // 4.2 ANALYTICS & FINANCE
  {
    id: "ana-reports",
    code: "ANA-01",
    title: "Enterprise Reports & Census",
    subtitle: "Ad-Hoc Query Builder, Statutory Compliance & Census Exports",
    section: "analytics",
    sectionLabel: "Analytics",
    badge: "Data Reporting",
    badgeColor: "bg-amber-600 text-white",
    icon: BarChart3,
    roles: ["HR Analysts", "Auditors", "Compliance Officers"],
    description: "Flexible reporting engine generating workforce demographic reports, DOLE statutory compliance reports, headcount variance, seniority census, and custom CSV/Excel database exports.",
    inputs: ["Core HR DB Tables", "Timekeeping Archives", "Recruitment Records"],
    outputs: ["Custom Data Exports (CSV/XLS)", "Government Compliance Filings", "Census Summaries"],
    keyActions: ["Build Custom SQL/Ad-hoc Query", "Schedule Automated Reports", "Export Compliance Census"],
    sla: "On-demand & Monthly",
    moduleKey: "Reports"
  },
  {
    id: "ana-analytics",
    code: "ANA-02",
    title: "HR & Attrition Analytics",
    subtitle: "Predictive Turnover, Absenteeism Heatmaps & Workforce Health",
    section: "analytics",
    sectionLabel: "Analytics",
    badge: "Workforce Intel",
    badgeColor: "bg-amber-600 text-white",
    icon: PieChart,
    roles: ["Executive Leadership", "HR Director", "Operations Analysts"],
    description: "Deep statistical analytics visualizing attrition correlations, tenure decay curves, absenteeism heatmaps across accounts, team health indices, and retention forecasts.",
    inputs: ["Historical Separation Data", "Attendance Discrepancies", "Performance Ratings"],
    outputs: ["Attrition Risk Scores", "Tenure Survival Curves", "Workforce Health Dashboard"],
    keyActions: ["Identify High-Risk Accounts", "Analyze Root Causes of Turnover", "Optimize Retention Strategy"],
    sla: "Continuous Predictive Refresh",
    moduleKey: "Analytics"
  },
  {
    id: "ana-costs",
    code: "ANA-03",
    title: "Recruitment Costs & Budgeting",
    subtitle: "Cost-Per-Hire, Agency Fees, Job Board ROI & Expense Allocation",
    section: "analytics",
    sectionLabel: "Analytics",
    badge: "Financial Control",
    badgeColor: "bg-emerald-700 text-white",
    icon: DollarSign,
    roles: ["Finance Controller", "TA Director", "OM"],
    description: "Financial tracking module auditing all expenditures incurred in talent acquisition: job board subscriptions, external headhunter commissions, marketing spend, and cost-per-hire per department.",
    inputs: ["Vendor Invoices", "Job Board Receipts", "Candidate Hires by Source"],
    outputs: ["Cost-Per-Hire (CPH) Metrics", "Vendor Spend Allocation", "Campaign Financial ROI"],
    keyActions: ["Track Hiring Expenditures", "Allocate Costs to Account Budgets", "Evaluate Vendor Cost Efficiency"],
    sla: "Monthly Budget Reconciliation",
    moduleKey: "Costs"
  },
  {
    id: "ana-payroll",
    code: "ANA-04",
    title: "Payroll Computation & DTR Sync",
    subtitle: "Verified Hours, Overtime Adjustments, Deductions & Payslips",
    section: "analytics",
    sectionLabel: "Analytics",
    badge: "Compensation Engine",
    badgeColor: "bg-emerald-700 text-white",
    icon: CreditCard,
    roles: ["Payroll Specialists", "Finance Officers", "Employees"],
    description: "Integrates validated Time & Attendance DTR hours, approved leave credits, salary packages from Offers/Employee Directory, computes statutory deductions (tax, SSS, PhilHealth, Pag-IBIG), and generates payslips.",
    inputs: ["Approved DTR Cut-off Data", "Approved Leave Deductions", "Employee Base Salaries"],
    outputs: ["Bank Payroll File", "Digital Payslips", "Statutory Contribution Schedule"],
    keyActions: ["Compute Semi-monthly Payroll", "Resolve Attendance Disputes", "Distribute Payslips"],
    sla: "15th & 30th Payroll Cut-offs",
    moduleKey: "Payroll"
  },

  // 4.3 ADMINISTRATION
  {
    id: "adm-depts",
    code: "ADM-01",
    title: "Departments & Org Hierarchy",
    subtitle: "7 Division Structures, Cost Centers & Reporting Relationships",
    section: "administration",
    sectionLabel: "Administration",
    badge: "Org Architecture",
    badgeColor: "bg-slate-700 text-white",
    icon: Building2,
    roles: ["Super Admin", "HR Director", "Operations VP"],
    description: "Configures and maintains SiBS corporate divisions (Operations, Talent Acquisition, IT Infrastructure, Workforce Management, Quality Assurance, Training & Development, Finance) and parent-child cost centers.",
    inputs: ["Corporate Organization Chart", "Cost Center Codes", "Division Charters"],
    outputs: ["Active Department Master List", "Reporting Hierarchy Rules", "Cost Center Mapping"],
    keyActions: ["Add/Edit Departments", "Assign Department Leaders", "Set Approval Routing Rules"],
    sla: "Strategic Organizational Setup",
    moduleKey: "Departments"
  },
  {
    id: "adm-locations",
    code: "ADM-02",
    title: "Office Locations & Facilities",
    subtitle: "3 Multi-Campus Management: Davao Hub, Tagum HQ & Mabini Campus",
    section: "administration",
    sectionLabel: "Administration",
    badge: "Campus Network",
    badgeColor: "bg-slate-700 text-white",
    icon: MapPin,
    roles: ["Super Admin", "Facilities Manager", "Site Directors"],
    description: "Manages multi-site corporate infrastructure across Davao Hub (Corporate), Tagum HQ (Operations Center), and Mabini Campus (Support/Training), tracking seat capacities, IP subnets, and facility details.",
    inputs: ["Campus Facility Contracts", "Physical Desk Allocations", "Site Network Subnets"],
    outputs: ["Official Site Registry", "Workstation Capacity Caps", "Local Holiday Schedules"],
    keyActions: ["Monitor Seat Capacities", "Assign Employees to Sites", "Configure Campus Rules"],
    sla: "Facility Master Record",
    moduleKey: "Office Locations"
  },

  // 4.4 SETTINGS
  {
    id: "set-recruitment",
    code: "SET-01",
    title: "Recruitment Settings & Pipelines",
    subtitle: "Pipeline Stages, Questionnaires, Interview Rubrics & SLA Thresholds",
    section: "settings",
    sectionLabel: "Settings",
    badge: "System Rules",
    badgeColor: "bg-indigo-700 text-white",
    icon: Settings,
    roles: ["TA Operations Lead", "Super Admin"],
    description: "Defines hiring pipeline stages, custom job application questionnaires, standardized scoring rubrics, rejection reason taxonomy, automated SLA alert timers, and email dispatch triggers.",
    inputs: ["Hiring Process Guidelines", "Custom Questions Form", "Scoring Standards"],
    outputs: ["Configured Pipeline Workflows", "Published Application Form", "Standardized Scorecards"],
    keyActions: ["Customize Pipeline Stages", "Create Evaluation Questionnaires", "Set Rejection Reason Codes"],
    sla: "Administrative Configuration",
    moduleKey: "Recruitment Settings"
  },
  {
    id: "set-account",
    code: "SET-02",
    title: "Account Settings & RBAC Permissions",
    subtitle: "User Profiles, Security Policies, Session Timeouts & Audit Trails",
    section: "settings",
    sectionLabel: "Settings",
    badge: "Access Policy",
    badgeColor: "bg-indigo-700 text-white",
    icon: Lock,
    roles: ["Super Admin", "All Users"],
    description: "User profile maintenance, password policy enforcement, role permission assignment, session inactivity timeout parameters, and complete security audit log tracking.",
    inputs: ["User Account Credentials", "Security Policy Standards", "Role Mapping Matrix"],
    outputs: ["Updated User Profiles", "Active Permission Grants", "Security Event Logs"],
    keyActions: ["Update Security Credentials", "Assign User Roles", "Audit Login History"],
    sla: "Continuous Security Policy",
    moduleKey: "Account Settings"
  }
];

interface OverallAppFlowchartProps {
  onSwitchModule?: (moduleKey: string) => void;
}

export default function OverallAppFlowchart({ onSwitchModule }: OverallAppFlowchartProps) {
  const [selectedCategory, setSelectedCategory] = useState<FlowSectionCategory>("all");
  const [selectedNodeId, setSelectedNodeId] = useState<string>("acc-auth");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(true);
  const [isRequisitionModalOpen, setIsRequisitionModalOpen] = useState<boolean>(false);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationStepIndex, setSimulationStepIndex] = useState<number>(0);
  const [isAnimatedFlow, setIsAnimatedFlow] = useState<boolean>(true);
  const [showLogicLoops, setShowLogicLoops] = useState<boolean>(true);
  const [hiringSplitMode, setHiringSplitMode] = useState<"requisition" | "downsizing" | "both">("requisition");
  const [accessFlowMode, setAccessFlowMode] = useState<"branching" | "governance">("branching");
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  // Filtered Nodes
  const filteredNodes = useMemo(() => {
    return OVERALL_APP_NODES.filter(node => {
      const matchesCategory = 
        selectedCategory === "all" || 
        node.section === selectedCategory;
      
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !query ||
        node.title.toLowerCase().includes(query) ||
        node.subtitle.toLowerCase().includes(query) ||
        node.code.toLowerCase().includes(query) ||
        node.description.toLowerCase().includes(query) ||
        node.roles.some(r => r.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Selected Node Details
  const selectedNode = useMemo(() => {
    return OVERALL_APP_NODES.find(n => n.id === selectedNodeId) || OVERALL_APP_NODES[0];
  }, [selectedNodeId]);

  // Key simulation journey sequence
  const simulationSequence = useMemo(() => [
    "acc-auth",
    "acc-super-admin",
    "chr-dashboard",
    "chr-directory",
    "chr-resignation",
    "rec-ramps",
    "rec-intake",
    "rec-positions",
    "rec-sourcing",
    "rec-pipeline",
    "rec-offers",
    "rec-onboard",
    "chr-directory",
    "com-email",
    "ana-payroll",
    "ana-analytics"
  ], []);

  // Simulation timer
  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSimulating) {
      timer = setTimeout(() => {
        setSimulationStepIndex(prev => {
          const nextIndex = (prev + 1) % simulationSequence.length;
          setSelectedNodeId(simulationSequence[nextIndex]);
          return nextIndex;
        });
      }, 2200);
    }
    return () => clearTimeout(timer);
  }, [isSimulating, simulationStepIndex, simulationSequence]);

  const handleStartSimulation = () => {
    setSimulationStepIndex(0);
    setSelectedNodeId(simulationSequence[0]);
    setIsSimulating(true);
  };

  const handlePauseSimulation = () => {
    setIsSimulating(false);
  };

  const handleResetSimulation = () => {
    setIsSimulating(false);
    setSimulationStepIndex(0);
    setSelectedNodeId(simulationSequence[0]);
  };

  // Groups for display
  const accessNodes = useMemo(() => OVERALL_APP_NODES.filter(n => n.section === "access"), []);
  const coreHRNodes = useMemo(() => OVERALL_APP_NODES.filter(n => n.section === "core-hr"), []);
  const recruitmentNodes = useMemo(() => OVERALL_APP_NODES.filter(n => n.section === "recruitment"), []);
  const commsNodes = useMemo(() => OVERALL_APP_NODES.filter(n => n.section === "communications"), []);
  const analyticsNodes = useMemo(() => OVERALL_APP_NODES.filter(n => n.section === "analytics"), []);
  const adminNodes = useMemo(() => OVERALL_APP_NODES.filter(n => n.section === "administration"), []);
  const settingsNodes = useMemo(() => OVERALL_APP_NODES.filter(n => n.section === "settings"), []);

  // Map nodes for direct pipeline rendering
  const accAuth = OVERALL_APP_NODES.find(n => n.id === "acc-auth")!;
  const accSuperAdmin = OVERALL_APP_NODES.find(n => n.id === "acc-super-admin")!;
  const accOpsManager = OVERALL_APP_NODES.find(n => n.id === "acc-ops-manager")!;
  const accTaRecruiter = OVERALL_APP_NODES.find(n => n.id === "acc-ta-recruiter")!;
  const accEmployee = OVERALL_APP_NODES.find(n => n.id === "acc-employee")!;

  const chrDashboard = OVERALL_APP_NODES.find(n => n.id === "chr-dashboard")!;
  const chrDirectory = OVERALL_APP_NODES.find(n => n.id === "chr-directory")!;
  const chrAttendance = OVERALL_APP_NODES.find(n => n.id === "chr-attendance")!;
  const chrLeaves = OVERALL_APP_NODES.find(n => n.id === "chr-leaves")!;
  const chrResignation = OVERALL_APP_NODES.find(n => n.id === "chr-resignation")!;

  const recRamps = OVERALL_APP_NODES.find(n => n.id === "rec-ramps")!;
  const recJds = OVERALL_APP_NODES.find(n => n.id === "rec-jds")!;
  const recIntake = OVERALL_APP_NODES.find(n => n.id === "rec-intake")!;
  const recPositions = OVERALL_APP_NODES.find(n => n.id === "rec-positions")!;
  const recSourcing = OVERALL_APP_NODES.find(n => n.id === "rec-sourcing")!;
  const recLeads = OVERALL_APP_NODES.find(n => n.id === "rec-leads")!;
  const recPipeline = OVERALL_APP_NODES.find(n => n.id === "rec-pipeline")!;
  const recOffers = OVERALL_APP_NODES.find(n => n.id === "rec-offers")!;
  const recOnboard = OVERALL_APP_NODES.find(n => n.id === "rec-onboard")!;
  const recQa = OVERALL_APP_NODES.find(n => n.id === "rec-qa")!;

  const comEmail = OVERALL_APP_NODES.find(n => n.id === "com-email")!;
  const anaReports = OVERALL_APP_NODES.find(n => n.id === "ana-reports")!;
  const anaAnalytics = OVERALL_APP_NODES.find(n => n.id === "ana-analytics")!;
  const anaCosts = OVERALL_APP_NODES.find(n => n.id === "ana-costs")!;
  const anaPayroll = OVERALL_APP_NODES.find(n => n.id === "ana-payroll")!;
  const admDepts = OVERALL_APP_NODES.find(n => n.id === "adm-depts")!;
  const admSites = OVERALL_APP_NODES.find(n => n.id === "adm-sites")!;
  const setRecruitment = OVERALL_APP_NODES.find(n => n.id === "set-recruitment")!;
  const setAccount = OVERALL_APP_NODES.find(n => n.id === "set-account")!;

  // Render SVG Flow Arrow matching RecruitmentFlowchart (Image 1)
  const renderFlowArrow = (
    sourceId: string,
    targetId: string,
    label: string,
    color: "blue" | "teal" | "purple" | "orange" | "emerald" | "indigo" | "sky" | "amber" | "slate" = "blue",
    sublabel?: string
  ) => {
    const isSelected = selectedNodeId === targetId || selectedNodeId === sourceId;
    const isTarget = selectedNodeId === targetId;

    const colorMap = {
      slate: {
        badge: isSelected ? "bg-slate-700 text-white border-slate-800 shadow-2xs" : "bg-white text-slate-700 border-slate-300",
        stroke: isSelected ? "#334155" : "#64748B",
        glow: isSelected ? "drop-shadow-[0_0_6px_rgba(51,65,85,0.5)]" : "",
        particle: "#94A3B8"
      },
      blue: {
        badge: isSelected ? "bg-[#1D68BD] text-white border-blue-600 shadow-2xs" : "bg-white text-slate-700 border-slate-300",
        stroke: isSelected ? "#1D68BD" : "#64748B",
        glow: isSelected ? "drop-shadow-[0_0_6px_rgba(29,104,189,0.5)]" : "",
        particle: "#60A5FA"
      },
      teal: {
        badge: isSelected ? "bg-[#0E8773] text-white border-teal-700 shadow-2xs" : "bg-white text-slate-700 border-slate-300",
        stroke: isSelected ? "#0E8773" : "#64748B",
        glow: isSelected ? "drop-shadow-[0_0_6px_rgba(14,135,115,0.5)]" : "",
        particle: "#2DD4BF"
      },
      purple: {
        badge: isSelected ? "bg-[#6B21A8] text-white border-purple-800 shadow-2xs" : "bg-white text-slate-700 border-slate-300",
        stroke: isSelected ? "#6B21A8" : "#64748B",
        glow: isSelected ? "drop-shadow-[0_0_6px_rgba(107,33,168,0.5)]" : "",
        particle: "#C084FC"
      },
      orange: {
        badge: isSelected ? "bg-[#FF5C28] text-white border-orange-600 shadow-2xs" : "bg-white text-slate-700 border-slate-300",
        stroke: isSelected ? "#FF5C28" : "#64748B",
        glow: isSelected ? "drop-shadow-[0_0_6px_rgba(255,92,40,0.5)]" : "",
        particle: "#FDBA74"
      },
      emerald: {
        badge: isSelected ? "bg-emerald-600 text-white border-emerald-700 shadow-2xs" : "bg-white text-slate-700 border-slate-300",
        stroke: isSelected ? "#059669" : "#64748B",
        glow: isSelected ? "drop-shadow-[0_0_6px_rgba(5,150,105,0.5)]" : "",
        particle: "#6EE7B7"
      },
      indigo: {
        badge: isSelected ? "bg-[#4338CA] text-white border-indigo-700 shadow-2xs" : "bg-white text-slate-700 border-slate-300",
        stroke: isSelected ? "#4338CA" : "#64748B",
        glow: isSelected ? "drop-shadow-[0_0_6px_rgba(67,56,202,0.5)]" : "",
        particle: "#818CF8"
      },
      sky: {
        badge: isSelected ? "bg-sky-600 text-white border-sky-700 shadow-2xs" : "bg-white text-slate-700 border-slate-300",
        stroke: isSelected ? "#0284C7" : "#64748B",
        glow: isSelected ? "drop-shadow-[0_0_6px_rgba(2,132,199,0.5)]" : "",
        particle: "#38BDF8"
      },
      amber: {
        badge: isSelected ? "bg-amber-600 text-white border-amber-700 shadow-2xs" : "bg-white text-slate-700 border-slate-300",
        stroke: isSelected ? "#D97706" : "#64748B",
        glow: isSelected ? "drop-shadow-[0_0_6px_rgba(217,119,6,0.5)]" : "",
        particle: "#FCD34D"
      }
    };

    const c = colorMap[color];
    const markerId = `arrow-${sourceId}-${targetId}`;
    const labelLength = Math.max(label ? label.length : 0, sublabel ? sublabel.length * 0.85 : 0);
    const effectiveWidth = Math.max(54, Math.ceil(labelLength * 7.2) + 28);

    return (
      <div
        key={`arrow-${sourceId}-${targetId}`}
        onClick={() => {
          setSelectedNodeId(targetId);
          setIsInspectorOpen(true);
        }}
        style={{ width: `${effectiveWidth}px`, minWidth: `${effectiveWidth}px` }}
        className="flex flex-col items-center shrink-0 relative select-none pt-0.5 group cursor-pointer px-0.5"
        title={`Flow: ${sourceId} ➔ ${targetId} (${label})`}
      >
        {/* Badge */}
        <div
          className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider whitespace-nowrap shadow-2xs border transition-all duration-300 z-10 ${
            c.badge
          } ${isTarget ? "scale-105 ring-2 ring-orange-400" : "group-hover:scale-105"}`}
        >
          {label}
        </div>

        {/* SVG Arrow */}
        <div className="w-full h-4 flex items-center justify-center relative my-0.5">
          <svg
            viewBox={`0 0 ${effectiveWidth} 16`}
            style={{ width: `${effectiveWidth}px` }}
            className={`h-3.5 overflow-visible transition-all duration-300 ${c.glow}`}
          >
            <defs>
              <marker
                id={markerId}
                markerWidth="6"
                markerHeight="6"
                refX="5"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 6 3, 0 6" fill={c.stroke} />
              </marker>
            </defs>
            <line
              x1="4"
              y1="8"
              x2={effectiveWidth - 8}
              y2="8"
              stroke={c.stroke}
              strokeWidth={isSelected ? "3" : "2.5"}
              strokeLinecap="round"
              markerEnd={`url(#${markerId})`}
            />
            {isAnimatedFlow && (
              <circle r="2.5" cy="8" fill={isSelected ? c.particle : "#94A3B8"}>
                <animate
                  attributeName="cx"
                  from="6"
                  to={effectiveWidth - 11}
                  dur="1.2s"
                  repeatCount="indefinite"
                />
              </circle>
            )}
          </svg>
        </div>

        {/* Sublabel */}
        {sublabel && (
          <span
            style={{ maxWidth: `${effectiveWidth - 4}px` }}
            className="text-[7.5px] font-bold text-slate-400 truncate leading-none text-center block mt-0.5"
          >
            {sublabel}
          </span>
        )}
      </div>
    );
  };

  // Render Step Card matching RecruitmentFlowchart (Image 1)
  const renderStepCard = (node: OverallFlowNode) => {
    if (!node) return null;
    const isSelected = selectedNodeId === node.id;
    const isHighlighted = searchQuery.trim() !== "" && (
      node.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.code.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const Icon = node.icon;

    // Header background color matching section
    const headerBg = 
      node.section === "access" ? "bg-[#4338CA] text-white" :
      node.section === "core-hr" ? "bg-[#0E8773] text-white" :
      node.section === "recruitment" ? (
        node.id.includes("offers") || node.id.includes("onboard") ? "bg-[#FF5C28] text-white" :
        node.id.includes("sourcing") || node.id.includes("leads") || node.id.includes("pipeline") ? "bg-[#6B21A8] text-white" :
        "bg-[#1D68BD] text-white"
      ) :
      node.section === "communications" ? "bg-sky-700 text-white" :
      node.section === "analytics" ? "bg-amber-600 text-white" :
      node.section === "administration" ? "bg-slate-700 text-white" :
      "bg-indigo-700 text-white";

    const actionBtnClass = 
      node.section === "access" ? "bg-[#4338CA] hover:bg-indigo-800 text-white" :
      node.section === "core-hr" ? "bg-[#0E8773] hover:bg-teal-800 text-white" :
      node.section === "recruitment" ? (
        node.id.includes("offers") || node.id.includes("onboard") ? "bg-[#FF5C28] hover:bg-[#e04b1c] text-white" :
        node.id.includes("sourcing") || node.id.includes("leads") || node.id.includes("pipeline") ? "bg-[#6B21A8] hover:bg-purple-800 text-white" :
        "bg-[#1D68BD] hover:bg-blue-800 text-white"
      ) :
      node.section === "communications" ? "bg-sky-600 hover:bg-sky-700 text-white" :
      node.section === "analytics" ? "bg-amber-600 hover:bg-amber-700 text-white" :
      "bg-slate-700 hover:bg-slate-800 text-white";

    const bullets = node.keyActions || node.inputs || [];

    return (
      <div
        key={node.id}
        onClick={() => {
          setSelectedNodeId(node.id);
          setIsInspectorOpen(true);
        }}
        className={`group relative rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer h-full min-h-[350px] ${
          isSelected
            ? "ring-3 ring-[#FF5C28] shadow-xl scale-[1.02] z-10 border-[#FF5C28]"
            : isHighlighted
              ? "ring-2 ring-blue-500 shadow-md border-blue-400 bg-white"
              : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-md"
        }`}
      >
        {/* Header bar matching Image 1 */}
        <div className={`px-3 py-2.5 flex items-center justify-between gap-1.5 ${headerBg}`}>
          <div className="flex items-center gap-1.5 min-w-0">
            <div className="w-5 h-5 rounded-md bg-white/20 flex items-center justify-center shrink-0">
              <Icon className="w-3.5 h-3.5 text-white" />
            </div>
            <h3 className="text-[11px] font-black tracking-tight truncate">
              {node.title}
            </h3>
          </div>
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-black/20 shrink-0 font-mono">
            #{node.code}
          </span>
        </div>

        {/* Card Body matching Image 1 */}
        <div className="p-3 flex-1 flex flex-col justify-between space-y-2.5">
          <div>
            <div className="text-[10px] font-black text-slate-700 uppercase tracking-wider mb-1.5 border-b border-slate-100 pb-1">
              {node.subtitle}
            </div>

            {/* Bullet List matching Image 1 */}
            <ul className="space-y-1 text-[10px] text-slate-600 font-medium">
              {bullets.slice(0, 4).map((bullet, bIdx) => (
                <li key={bIdx} className="flex items-start gap-1 leading-tight">
                  <span className="text-slate-400 font-bold shrink-0">•</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Button & SLA status */}
          <div className="space-y-2 pt-1.5 border-t border-slate-100">
            <div className="flex items-center justify-between text-[9px] font-bold">
              <span className="text-slate-500 truncate max-w-[105px]">{node.roles[0]}</span>
              <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                {node.sla}
              </span>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedNodeId(node.id);
                setIsInspectorOpen(true);
                if (node.hasRequisitionModal) {
                  setIsRequisitionModalOpen(true);
                }
              }}
              className={`w-full py-1.5 px-2 rounded-lg text-[10px] font-black transition-all shadow-2xs cursor-pointer ${actionBtnClass}`}
            >
              {node.hasRequisitionModal ? "Open Personnel Form" : (node.moduleKey ? `View ${node.moduleKey}` : "Inspect Node")}
            </button>
          </div>
        </div>

        {/* Selected Indicator Bottom Stripe */}
        {isSelected && (
          <div className="h-1 w-full bg-[#FF5C28]"></div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* ==================== 1. FILTER BAR, CONTROLS & SEARCH ==================== */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Section Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-black scrollbar-none pb-1 lg:pb-0">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`px-3 py-1.5 rounded-xl transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === "all"
                ? "bg-[#042C51] text-white shadow-2xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All Sections (Overall Flow)</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory("access")}
            className={`px-3 py-1.5 rounded-xl transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === "access"
                ? "bg-[#4338CA] text-white shadow-2xs"
                : "bg-indigo-50 text-indigo-800 hover:bg-indigo-100"
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>1. Account Access Level</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory("core-hr")}
            className={`px-3 py-1.5 rounded-xl transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === "core-hr"
                ? "bg-[#0E8773] text-white shadow-2xs"
                : "bg-teal-50 text-[#0E8773] hover:bg-teal-100"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>2. Core HRIS Processes</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory("recruitment")}
            className={`px-3 py-1.5 rounded-xl transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === "recruitment"
                ? "bg-[#1D68BD] text-white shadow-2xs"
                : "bg-blue-50 text-[#1D68BD] hover:bg-blue-100"
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>3. Recruitment Processes</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory("communications")}
            className={`px-3 py-1.5 rounded-xl transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === "communications" || selectedCategory === "analytics" || selectedCategory === "administration" || selectedCategory === "settings"
                ? "bg-[#FF5C28] text-white shadow-2xs"
                : "bg-orange-50 text-[#FF5C28] hover:bg-orange-100"
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>4. Supporting Processes</span>
          </button>
        </div>

        {/* Search Input, Animation Toggles & Simulation controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Animated Flow Toggle */}
          <button
            type="button"
            onClick={() => setIsAnimatedFlow(!isAnimatedFlow)}
            className={`px-2.5 py-1 text-[11px] font-black rounded-xl border transition-all flex items-center gap-1 cursor-pointer ${
              isAnimatedFlow
                ? "bg-blue-50 border-blue-200 text-[#1D68BD]"
                : "bg-slate-50 border-slate-200 text-slate-400"
            }`}
            title="Toggle animated pulse along flow arrows"
          >
            <Sparkles className="w-3 h-3" />
            <span>Flow Pulses</span>
          </button>

          {/* Logic Loops Toggle */}
          <button
            type="button"
            onClick={() => setShowLogicLoops(!showLogicLoops)}
            className={`px-2.5 py-1 text-[11px] font-black rounded-xl border transition-all flex items-center gap-1 cursor-pointer ${
              showLogicLoops
                ? "bg-purple-50 border-purple-200 text-purple-700"
                : "bg-slate-50 border-slate-200 text-slate-400"
            }`}
            title="Toggle emphasized cross-system loopback callout cards"
          >
            <GitFork className="w-3 h-3" />
            <span>Logic Loops</span>
          </button>

          {/* Search Bar */}
          <div className="relative w-44 sm:w-52">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search nodes..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#FF5C28] transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Simulation Journey Player */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
            {!isSimulating ? (
              <button
                type="button"
                onClick={handleStartSimulation}
                className="px-2.5 py-1 bg-[#FF5C28] hover:bg-[#e04b1c] text-white text-[11px] font-black rounded-lg transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
                title="Walk through complete end-to-end system sequence"
              >
                <Play className="w-3 h-3 fill-white" />
                <span>Simulate Journey</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePauseSimulation}
                className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-black rounded-lg transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
                title="Pause Walkthrough"
              >
                <Pause className="w-3 h-3" />
                <span>Pause</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleResetSimulation}
              className="p-1 text-slate-600 hover:text-[#042C51] rounded-lg transition-colors cursor-pointer"
              title="Reset walkthrough to start"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ==================== 4 TOP PHASE CHEVRONS (MATCHING IMAGE 1) ==================== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 text-center select-none font-black text-xs">
        {/* Chevron 1: Account Access */}
        <div 
          onClick={() => setSelectedCategory("access")}
          className={`relative rounded-xl p-2.5 flex flex-col items-center justify-center shadow-2xs cursor-pointer transition-all ${
            selectedCategory === "access"
              ? "bg-[#4338CA] text-white ring-2 ring-indigo-300"
              : "bg-indigo-50 text-[#4338CA] border border-indigo-200 hover:bg-indigo-100"
          }`}
        >
          <div className="text-[11px] tracking-wide uppercase font-black">
            1. ACCOUNT ACCESS & ROLES
          </div>
          <div className={`text-[10px] ${selectedCategory === "access" ? "text-indigo-100" : "text-slate-600"} font-normal`}>
            SSO Gate & 4 Role Tiers
          </div>
        </div>

        {/* Chevron 2: Core HRIS */}
        <div 
          onClick={() => setSelectedCategory("core-hr")}
          className={`relative rounded-xl p-2.5 flex flex-col items-center justify-center shadow-2xs cursor-pointer transition-all ${
            selectedCategory === "core-hr"
              ? "bg-[#0E8773] text-white ring-2 ring-teal-300"
              : "bg-teal-50 text-[#0E8773] border border-teal-200 hover:bg-teal-100"
          }`}
        >
          <div className="text-[11px] tracking-wide uppercase font-black">
            2. CORE HRIS LIFECYCLE
          </div>
          <div className={`text-[10px] ${selectedCategory === "core-hr" ? "text-teal-100" : "text-slate-600"} font-normal`}>
            Directory, DTR, Leaves & Resignation
          </div>
        </div>

        {/* Chevron 3: Recruitment */}
        <div 
          onClick={() => setSelectedCategory("recruitment")}
          className={`relative rounded-xl p-2.5 flex flex-col items-center justify-center shadow-2xs cursor-pointer transition-all ${
            selectedCategory === "recruitment"
              ? "bg-[#1D68BD] text-white ring-2 ring-blue-300"
              : "bg-blue-50 text-[#1D68BD] border border-blue-200 hover:bg-blue-100"
          }`}
        >
          <div className="text-[11px] tracking-wide uppercase font-black">
            3. RECRUITMENT PIPELINE
          </div>
          <div className={`text-[10px] ${selectedCategory === "recruitment" ? "text-blue-100" : "text-slate-600"} font-normal`}>
            RAMPS, Intake, Screening to Day 1
          </div>
        </div>

        {/* Chevron 4: Supporting */}
        <div 
          onClick={() => setSelectedCategory("communications")}
          className={`relative rounded-xl p-2.5 flex flex-col items-center justify-center shadow-2xs cursor-pointer transition-all ${
            selectedCategory === "communications" || selectedCategory === "analytics" || selectedCategory === "administration" || selectedCategory === "settings"
              ? "bg-[#FF5C28] text-white ring-2 ring-orange-300"
              : "bg-orange-50 text-[#FF5C28] border border-orange-200 hover:bg-orange-100"
          }`}
        >
          <div className="text-[11px] tracking-wide uppercase font-black">
            4. SUPPORTING SYSTEMS
          </div>
          <div className={`text-[10px] ${selectedCategory === "communications" ? "text-orange-100" : "text-slate-600"} font-normal`}>
            Emails, Payroll, Admin & Governance
          </div>
        </div>
      </div>

      {/* ==================== 2. MAIN LAYOUT: FLOW PIPELINE CANVAS + INSPECTOR ==================== */}
      <div className="flex flex-col xl:flex-row gap-6 items-start">
        {/* FLOWCHART VIEWPORT CANVAS */}
        <div className="flex-1 w-full space-y-6">

          {/* ==================== SECTION 1: ACCOUNT ACCESS LEVEL PIPELINE ==================== */}
          {(selectedCategory === "all" || selectedCategory === "access") && (
            <div className="bg-white rounded-2xl border border-indigo-200/90 p-5 shadow-xs relative overflow-hidden">
              {/* Lane Header matching Image 1 */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-4 border-b border-indigo-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-700 to-indigo-900 text-white flex items-center justify-center shadow-xs">
                    <Key className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded">
                        SECTION 1 PIPELINE
                      </span>
                      <h3 className="text-sm font-black text-slate-900 tracking-tight">
                        Account Access Level & Identity Governance Flow
                      </h3>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                      Authentication gate, Single Sign-On (SSO) & Role-Based Access Control (RBAC) levels governing module permissions.
                    </p>
                  </div>
                </div>

                {/* Legend indicator pills & Mode Switcher */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1 bg-indigo-100/70 p-0.5 rounded-lg border border-indigo-200">
                    <button
                      type="button"
                      onClick={() => setAccessFlowMode("branching")}
                      className={`px-2 py-0.5 rounded text-[9.5px] font-black transition-all cursor-pointer flex items-center gap-1 ${
                        accessFlowMode === "branching"
                          ? "bg-[#4338CA] text-white shadow-2xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <GitFork className="w-3 h-3" />
                      <span>RBAC Role Branching (True Architecture)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAccessFlowMode("governance")}
                      className={`px-2 py-0.5 rounded text-[9.5px] font-black transition-all cursor-pointer flex items-center gap-1 ${
                        accessFlowMode === "governance"
                          ? "bg-[#4338CA] text-white shadow-2xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <ArrowRight className="w-3 h-3" />
                      <span>Governance Pipeline</span>
                    </button>
                  </div>
                  <span className="text-[9px] font-bold text-slate-500 flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#4338CA]"></span>
                    Primary Flow
                  </span>
                  <span className="text-[9px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                    4 Role Tiers
                  </span>
                </div>
              </div>

              {/* Horizontal Pipeline Track matching Image 1 */}
              <div className="overflow-x-auto pb-4 pt-1 flex items-start gap-1 sm:gap-2 select-none scrollbar-thin">
                {/* START Pill Indicator */}
                <div className="pt-2 flex flex-col items-center shrink-0">
                  <div className="px-3 py-1.5 bg-emerald-600 text-white rounded-full font-black text-[11px] uppercase tracking-widest shadow-md flex items-center gap-1.5 ring-2 ring-emerald-300">
                    <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                    START
                  </div>
                  <span className="text-[8px] font-black uppercase text-emerald-700 mt-1 tracking-wider">
                    IDENTITY GATEWAY
                  </span>
                </div>

                {renderFlowArrow("start", "acc-auth", "SSO Login", "indigo", "Authenticate")}

                {/* Step 1: Authentication Gateway */}
                <div className="flex-1 min-w-[210px] max-w-[240px]">
                  {renderStepCard(accAuth)}
                </div>

                {accessFlowMode === "branching" ? (
                  <>
                    {renderFlowArrow("acc-auth", "rbac-matrix", "Verify Claims", "indigo", "Token Dispatch")}

                    {/* RBAC Role-Based Access Matrix Dispatcher Node */}
                    <div 
                      onClick={() => { setSelectedNodeId("acc-auth"); setIsInspectorOpen(true); }}
                      className="shrink-0 w-[195px] bg-gradient-to-b from-indigo-900 to-slate-900 text-white rounded-2xl p-3 flex flex-col justify-between border border-indigo-700 shadow-sm min-h-[350px] cursor-pointer group hover:border-indigo-500 transition-all"
                    >
                      <div>
                        <div className="flex items-center justify-between pb-2 mb-2 border-b border-indigo-800/80">
                          <div className="flex items-center gap-1.5">
                            <Key className="w-3.5 h-3.5 text-amber-400" />
                            <span className="text-[10px] font-black uppercase tracking-wider text-amber-300">
                              RBAC Router
                            </span>
                          </div>
                          <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 font-bold">
                            OAuth 2.0
                          </span>
                        </div>
                        <p className="text-[9.5px] text-indigo-200 leading-snug mb-2.5 font-medium">
                          Validates JWT signature & decrypted role claims, dispatching the session into 4 authorized workspace tiers:
                        </p>
                        
                        <div className="space-y-1.5">
                          <div 
                            onClick={(e) => { e.stopPropagation(); setSelectedNodeId("acc-super-admin"); setIsInspectorOpen(true); }}
                            className="flex items-center justify-between p-1.5 rounded-lg bg-purple-950/70 border border-purple-500/40 hover:bg-purple-900/80 transition-colors"
                          >
                            <span className="text-[8.5px] font-black text-purple-200">🟣 Tier 4: Super Admin</span>
                            <span className="text-[7.5px] text-purple-300 font-bold">Executive</span>
                          </div>
                          <div 
                            onClick={(e) => { e.stopPropagation(); setSelectedNodeId("acc-ops-manager"); setIsInspectorOpen(true); }}
                            className="flex items-center justify-between p-1.5 rounded-lg bg-blue-950/70 border border-blue-500/40 hover:bg-blue-900/80 transition-colors"
                          >
                            <span className="text-[8.5px] font-black text-blue-200">🔵 Tier 3: Ops Manager</span>
                            <span className="text-[7.5px] text-blue-300 font-bold">Headcount</span>
                          </div>
                          <div 
                            onClick={(e) => { e.stopPropagation(); setSelectedNodeId("acc-ta-recruiter"); setIsInspectorOpen(true); }}
                            className="flex items-center justify-between p-1.5 rounded-lg bg-orange-950/70 border border-orange-500/40 hover:bg-orange-900/80 transition-colors"
                          >
                            <span className="text-[8.5px] font-black text-orange-200">🟠 Tier 2: HR & TA</span>
                            <span className="text-[7.5px] text-orange-300 font-bold">Sourcing</span>
                          </div>
                          <div 
                            onClick={(e) => { e.stopPropagation(); setSelectedNodeId("acc-employee"); setIsInspectorOpen(true); }}
                            className="flex items-center justify-between p-1.5 rounded-lg bg-teal-950/70 border border-teal-500/40 hover:bg-teal-900/80 transition-colors"
                          >
                            <span className="text-[8.5px] font-black text-teal-200">🟢 Tier 1: Core Staff</span>
                            <span className="text-[7.5px] text-teal-300 font-bold">201 DTR</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-indigo-800/80 text-[8.5px] text-indigo-300 flex items-center justify-between">
                        <span className="font-bold">Zero Trust Handshake</span>
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                    </div>

                    {renderFlowArrow("rbac-matrix", "acc-super-admin", "Role Tier 4", "purple", "Full Authority")}

                    {/* Step 2: Super Admin */}
                    <div className="flex-1 min-w-[210px] max-w-[240px]">
                      {renderStepCard(accSuperAdmin)}
                    </div>

                    {renderFlowArrow("rbac-matrix", "acc-ops-manager", "Role Tier 3", "blue", "Operations Scope")}

                    {/* Step 3: Operations Manager */}
                    <div className="flex-1 min-w-[210px] max-w-[240px]">
                      {renderStepCard(accOpsManager)}
                    </div>

                    {renderFlowArrow("rbac-matrix", "acc-ta-recruiter", "Role Tier 2", "orange", "Sourcing Scope")}

                    {/* Step 4: HR & TA */}
                    <div className="flex-1 min-w-[210px] max-w-[240px]">
                      {renderStepCard(accTaRecruiter)}
                    </div>

                    {renderFlowArrow("rbac-matrix", "acc-employee", "Role Tier 1", "teal", "Self-Service")}

                    {/* Step 5: Employee */}
                    <div className="flex-1 min-w-[210px] max-w-[240px]">
                      {renderStepCard(accEmployee)}
                    </div>
                  </>
                ) : (
                  <>
                    {renderFlowArrow("acc-auth", "acc-super-admin", "Tier 4 Access", "purple", "Executive")}

                    {/* Step 2: Super Admin */}
                    <div className="flex-1 min-w-[210px] max-w-[240px]">
                      {renderStepCard(accSuperAdmin)}
                    </div>

                    {renderFlowArrow("acc-super-admin", "acc-ops-manager", "Delegation", "blue", "Ops Governance")}

                    {/* Step 3: Operations Manager */}
                    <div className="flex-1 min-w-[210px] max-w-[240px]">
                      {renderStepCard(accOpsManager)}
                    </div>

                    {renderFlowArrow("acc-ops-manager", "acc-ta-recruiter", "Requisition", "orange", "Hiring Quotas")}

                    {/* Step 4: HR & TA */}
                    <div className="flex-1 min-w-[210px] max-w-[240px]">
                      {renderStepCard(accTaRecruiter)}
                    </div>

                    {renderFlowArrow("acc-ta-recruiter", "acc-employee", "Self-Service", "teal", "201 Portal")}

                    {/* Step 5: Employee */}
                    <div className="flex-1 min-w-[210px] max-w-[240px]">
                      {renderStepCard(accEmployee)}
                    </div>
                  </>
                )}
              </div>

              {/* Inter-Section Transition Gateway Box */}
              <div className="mt-3 pt-3 border-t border-dashed border-indigo-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-gradient-to-r from-indigo-50/70 via-teal-50/70 to-blue-50/70 p-3 rounded-xl border border-indigo-200">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-black text-slate-800">
                    Identity Clearance & Role Determination Complete
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600">
                  <span className="font-black text-indigo-700">Authenticated Session</span>
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
                  <span className="font-black text-[#0E8773]">Core HRIS (201, Attendance)</span>
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
                  <span className="font-black text-[#1D68BD]">Recruitment Pipeline</span>
                </div>
              </div>
            </div>
          )}

          {/* ==================== SECTION 2: CORE HRIS PROCESSES PIPELINE ==================== */}
          {(selectedCategory === "all" || selectedCategory === "core-hr") && (
            <div className="bg-white rounded-2xl border border-teal-200/90 p-5 shadow-xs relative overflow-hidden">
              {/* Lane Header matching Image 1 */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-4 border-b border-teal-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0E8773] to-teal-800 text-white flex items-center justify-center shadow-xs">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-teal-100 text-[#0E8773] px-2 py-0.5 rounded">
                        SECTION 2 PIPELINE
                      </span>
                      <h3 className="text-sm font-black text-slate-900 tracking-tight">
                        Core HRIS & Workforce Lifecycle Flow
                      </h3>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                      Matches Image 2: Dashboards, 201 Employee Directory, Biometric DTR, Leaves & Resignation Management.
                    </p>
                  </div>
                </div>

                {/* Legend indicator pills */}
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-bold text-slate-500 flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0E8773]"></span>
                    Primary Flow (Steps 1-5)
                  </span>
                  <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Real-Time DTR & Leaves
                  </span>
                </div>
              </div>

              {/* Horizontal Pipeline Track matching Image 1 */}
              <div className="overflow-x-auto pb-4 pt-1 flex items-start gap-1 sm:gap-2 select-none scrollbar-thin">
                {/* START Pill Indicator */}
                <div className="pt-2 flex flex-col items-center shrink-0">
                  <div className="px-3 py-1.5 bg-emerald-600 text-white rounded-full font-black text-[11px] uppercase tracking-widest shadow-md flex items-center gap-1.5 ring-2 ring-emerald-300">
                    <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                    START
                  </div>
                  <span className="text-[8px] font-black uppercase text-emerald-700 mt-1 tracking-wider">
                    ACTIVE WORKFORCE
                  </span>
                </div>

                {renderFlowArrow("start-chr", "chr-dashboard", "Live Feed", "teal", "Real-Time KPIs")}

                {/* Step 1: HR Dashboard */}
                <div className="flex-1 min-w-[210px] max-w-[240px]">
                  {renderStepCard(chrDashboard)}
                </div>

                {renderFlowArrow("chr-dashboard", "chr-directory", "Query 201", "teal", "Org Hierarchy")}

                {/* Step 2: Employee Directory */}
                <div className="flex-1 min-w-[210px] max-w-[240px]">
                  {renderStepCard(chrDirectory)}
                </div>

                {renderFlowArrow("chr-directory", "chr-attendance", "Daily Clock", "teal", "Biometric Punch")}

                {/* Step 3: Time & Attendance */}
                <div className="flex-1 min-w-[210px] max-w-[240px]">
                  {renderStepCard(chrAttendance)}
                </div>

                {renderFlowArrow("chr-attendance", "chr-leaves", "Time-Off", "teal", "Credit Deduction")}

                {/* Step 4: Leaves Management */}
                <div className="flex-1 min-w-[210px] max-w-[240px]">
                  {renderStepCard(chrLeaves)}
                </div>

                {renderFlowArrow("chr-leaves", "chr-resignation", "Separation", "orange", "30-Day Notice")}

                {/* Step 5: Resignation Management */}
                <div className="flex-1 min-w-[210px] max-w-[240px]">
                  {renderStepCard(chrResignation)}
                </div>
              </div>

              {/* Emphasized Logic Flow Boxes matching bottom rejection boxes in Image 1 */}
              {showLogicLoops && (
                <div className="mt-3.5 pt-3.5 border-t border-dashed border-teal-200 space-y-2.5">
                  {/* Logic Flow 1: Resignation -> Recruitment Attrition Deficit */}
                  <div className="p-3.5 rounded-xl border border-red-200 bg-gradient-to-r from-red-50/80 via-rose-50/60 to-orange-50/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-red-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                        <TrendingDown className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[9.5px] font-black uppercase tracking-wider bg-red-100 text-red-800 px-2 py-0.5 rounded">
                            EMPHASIZED LOGIC FLOW • ATTRITION DEFICIT LOOPBACK
                          </span>
                          <span className="text-[10px] font-bold text-red-600">CHR-05 ➔ REC-03</span>
                        </div>
                        <p className="text-xs text-slate-700 font-medium mt-1">
                          When an employee submits a resignation in <span className="font-black text-slate-900">CHR-05 (Resignation Management)</span> and begins the 30-day clearance, an automated <span className="font-black text-red-700">Attrition Deficit Signal</span> is emitted to Recruitment — pre-populating an open headcount requisition in <span className="font-black text-[#1D68BD]">REC-03 (Hiring Needs Intake)</span>.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedNodeId("rec-intake");
                        setIsInspectorOpen(true);
                        setIsRequisitionModalOpen(true);
                      }}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-[11px] font-black rounded-lg transition-all shadow-2xs shrink-0 cursor-pointer flex items-center gap-1.5 self-start md:self-center"
                    >
                      <GitFork className="w-3 h-3" />
                      <span>Trigger Backfill Requisition</span>
                    </button>
                  </div>

                  {/* Logic Flow 2: Biometric Cut-Off -> Payroll Computation */}
                  <div className="p-3.5 rounded-xl border border-teal-200 bg-gradient-to-r from-teal-50/80 via-emerald-50/60 to-blue-50/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-[#0E8773] text-white flex items-center justify-center shrink-0 mt-0.5">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[9.5px] font-black uppercase tracking-wider bg-teal-100 text-[#0E8773] px-2 py-0.5 rounded">
                            EMPHASIZED LOGIC FLOW • DTR TIMEKEEPING HANDSHAKE
                          </span>
                          <span className="text-[10px] font-bold text-teal-700">CHR-03 ➔ ANA-04</span>
                        </div>
                        <p className="text-xs text-slate-700 font-medium mt-1">
                          Every 15th and 30th cut-off, approved biometric work hours, night differentials, tardiness, and approved leaves from <span className="font-black text-slate-900">CHR-03 (Time & Attendance)</span> auto-aggregate into <span className="font-black text-amber-700">ANA-04 (Payroll Computation)</span> for salary release.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedNodeId("ana-payroll");
                        setIsInspectorOpen(true);
                      }}
                      className="px-3 py-1.5 bg-[#0E8773] hover:bg-teal-800 text-white text-[11px] font-black rounded-lg transition-all shadow-2xs shrink-0 cursor-pointer flex items-center gap-1.5 self-start md:self-center"
                    >
                      <DollarSign className="w-3 h-3" />
                      <span>Inspect DTR Payroll Sync</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==================== SECTION 3: RECRUITMENT PROCESSES PIPELINE ==================== */}
          {(selectedCategory === "all" || selectedCategory === "recruitment") && (
            <div className="bg-white rounded-2xl border border-blue-200/90 p-5 shadow-xs relative overflow-hidden">
              {/* Lane Header matching Image 1 */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-4 border-b border-blue-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#1D68BD] via-[#FF5C28] to-[#042C51] text-white flex items-center justify-center shadow-xs">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-blue-100 text-[#1D68BD] px-2 py-0.5 rounded">
                        SECTION 3 PIPELINE
                      </span>
                      <h3 className="text-sm font-black text-slate-900 tracking-tight">
                        End-to-End Talent Acquisition & Hiring Flow
                      </h3>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                      Matches Image 4: Workforce Plan (RAMPS), JDs, Intake Split, Available Positions, Sourcing, Talent Pool, Pipeline, Offers, and Onboarding.
                    </p>
                  </div>
                </div>

                {/* Process Split Selector Buttons matching Image 1 */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-[10px] font-black">
                    <button
                      type="button"
                      onClick={() => setHiringSplitMode("requisition")}
                      className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                        hiringSplitMode === "requisition"
                          ? "bg-white text-[#1D68BD] shadow-2xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      Requisition Track
                    </button>
                    <button
                      type="button"
                      onClick={() => setHiringSplitMode("downsizing")}
                      className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                        hiringSplitMode === "downsizing"
                          ? "bg-white text-red-600 shadow-2xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      Downsizing Track
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsRequisitionModalOpen(true)}
                    className="text-[10.5px] font-black bg-[#FF5C28] hover:bg-[#e04b1c] text-white px-2.5 py-1 rounded-lg transition-all shadow-2xs flex items-center gap-1 cursor-pointer"
                  >
                    <FileText className="w-3 h-3" />
                    <span>Personnel Requisition Form</span>
                  </button>
                </div>
              </div>

              {/* Sub-Lane A: Demand & Job Architecture (Steps 1-4) */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[9.5px] font-black text-blue-800 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    STAGE 1: CAPACITY & INTAKE GOVERNANCE
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    Establish headcount quota, draft job architecture and approve personnel demand
                  </span>
                </div>

                <div className="overflow-x-auto pb-3 pt-1 flex items-start gap-1 sm:gap-2 select-none scrollbar-thin">
                  {/* START Pill Indicator */}
                  <div className="pt-2 flex flex-col items-center shrink-0">
                    <div className="px-3 py-1.5 bg-emerald-600 text-white rounded-full font-black text-[11px] uppercase tracking-widest shadow-md flex items-center gap-1.5 ring-2 ring-emerald-300">
                      <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                      START
                    </div>
                    <span className="text-[8px] font-black uppercase text-emerald-700 mt-1 tracking-wider">
                      DEMAND INTAKE
                    </span>
                  </div>

                  {renderFlowArrow("start-rec", "rec-ramps", "Plan", "blue", "Capacity Targets")}

                  {/* Step 1: RAMPS */}
                  <div className="flex-1 min-w-[210px] max-w-[240px]">
                    {renderStepCard(recRamps)}
                  </div>

                  {renderFlowArrow("rec-ramps", "rec-jds", "Draft Specs", "blue", "Job Architecture")}

                  {/* Step 2: Job Descriptions */}
                  <div className="flex-1 min-w-[210px] max-w-[240px]">
                    {renderStepCard(recJds)}
                  </div>

                  {renderFlowArrow("rec-jds", "rec-intake", "Requisition", "blue", "OM / SOM Review")}

                  {/* Step 3: Hiring Needs Intake */}
                  <div className="flex-1 min-w-[210px] max-w-[240px]">
                    {renderStepCard(recIntake)}
                  </div>

                  {renderFlowArrow("rec-intake", "rec-positions", "Approved", "teal", "Open Headcount")}

                  {/* Step 4: Available Positions */}
                  <div className="flex-1 min-w-[210px] max-w-[240px]">
                    {renderStepCard(recPositions)}
                  </div>
                </div>
              </div>

              {/* Sub-Lane B: Sourcing, Candidate Pipeline & Onboarding (Steps 5-10) */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[9.5px] font-black text-purple-800 uppercase tracking-wider bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                    STAGE 2: CANDIDATE PIPELINE, SELECTION & DAY 1 ONBOARDING
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    Ingest applicant leads, evaluate interview stages, extend offers, and convert to employee
                  </span>
                </div>

                <div className="overflow-x-auto pb-3 pt-1 flex items-start gap-1 sm:gap-2 select-none scrollbar-thin">
                  {renderFlowArrow("rec-positions", "rec-sourcing", "Publish", "purple", "Job Portals")}

                  {/* Step 5: Sourcing Analytics */}
                  <div className="flex-1 min-w-[210px] max-w-[240px]">
                    {renderStepCard(recSourcing)}
                  </div>

                  {renderFlowArrow("rec-sourcing", "rec-leads", "Ingest", "purple", "Resume Parsing")}

                  {/* Step 6: Applicant Leads */}
                  <div className="flex-1 min-w-[210px] max-w-[240px]">
                    {renderStepCard(recLeads)}
                  </div>

                  {renderFlowArrow("rec-leads", "rec-pipeline", "Shortlist", "purple", "Interview Stages")}

                  {/* Step 7: Candidate Pipeline */}
                  <div className="flex-1 min-w-[210px] max-w-[240px]">
                    {renderStepCard(recPipeline)}
                  </div>

                  {renderFlowArrow("rec-pipeline", "rec-offers", "Passed", "orange", "Compensation Form")}

                  {/* Step 8: Job Offers */}
                  <div className="flex-1 min-w-[210px] max-w-[240px]">
                    {renderStepCard(recOffers)}
                  </div>

                  {renderFlowArrow("rec-offers", "rec-onboard", "Signed", "emerald", "Pre-Employment")}

                  {/* Step 9: Onboarding & Day 1 */}
                  <div className="flex-1 min-w-[210px] max-w-[240px]">
                    {renderStepCard(recOnboard)}
                  </div>

                  {renderFlowArrow("rec-onboard", "rec-qa", "Audit", "slate", "QA & Experience")}

                  {/* Step 10: QA & Action Items */}
                  <div className="flex-1 min-w-[210px] max-w-[240px]">
                    {renderStepCard(recQa)}
                  </div>
                </div>
              </div>

              {/* Emphasized Logic Flow Boxes matching bottom rejection boxes in Image 1 */}
              {showLogicLoops && (
                <div className="mt-3.5 pt-3.5 border-t border-dashed border-blue-200 space-y-2.5">
                  {/* Logic Flow 1: Onboarding Complete -> Provision Core HR Employee 201 & Payroll */}
                  <div className="p-3.5 rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50/80 via-teal-50/60 to-blue-50/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                        <UserCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[9.5px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                            EMPHASIZED LOGIC FLOW • CANDIDATE TO EMPLOYEE CONVERSION
                          </span>
                          <span className="text-[10px] font-bold text-emerald-700">REC-10 ➔ CHR-02 & ANA-04</span>
                        </div>
                        <p className="text-xs text-slate-700 font-medium mt-1">
                          Upon completing Day 1 Orientation in <span className="font-black text-slate-900">REC-10 (Employee Onboarding)</span>, candidate credentials and signed contracts are certified — automatically provisioning a new employee profile into <span className="font-black text-[#0E8773]">CHR-02 (Employee Directory 201)</span> and transmitting bank/tax info to <span className="font-black text-amber-700">ANA-04 (Payroll)</span>.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedNodeId("chr-directory");
                        setIsInspectorOpen(true);
                      }}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-black rounded-lg transition-all shadow-2xs shrink-0 cursor-pointer flex items-center gap-1.5 self-start md:self-center"
                    >
                      <UserCheck className="w-3 h-3" />
                      <span>Simulate Day 1 Employee Sync</span>
                    </button>
                  </div>

                  {/* Logic Flow 2: Pipeline Stage Transitions -> Automated Transactional Emails */}
                  <div className="p-3.5 rounded-xl border border-sky-200 bg-gradient-to-r from-sky-50/80 via-blue-50/60 to-indigo-50/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-sky-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[9.5px] font-black uppercase tracking-wider bg-sky-100 text-sky-800 px-2 py-0.5 rounded">
                            EMPHASIZED LOGIC FLOW • CANDIDATE EMAIL NOTIFICATIONS
                          </span>
                          <span className="text-[10px] font-bold text-sky-700">REC-07 ➔ COM-01</span>
                        </div>
                        <p className="text-xs text-slate-700 font-medium mt-1">
                          Every candidate stage transition (Screening, Technical Interview, Offer Issued, Regret) in <span className="font-black text-slate-900">REC-07 (Candidate Pipeline)</span> automatically triggers templated branded email notifications permanently tracked in <span className="font-black text-sky-700">COM-01 (Email Logs)</span>.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedNodeId("com-email");
                        setIsInspectorOpen(true);
                      }}
                      className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-[11px] font-black rounded-lg transition-all shadow-2xs shrink-0 cursor-pointer flex items-center gap-1.5 self-start md:self-center"
                    >
                      <Mail className="w-3 h-3" />
                      <span>View Email Logs</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==================== SECTION 4: SUPPORTING PROCESSES (DIVIDED BY SECTION) ==================== */}
          {(selectedCategory === "all" || selectedCategory === "communications" || selectedCategory === "analytics" || selectedCategory === "administration" || selectedCategory === "settings") && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-slate-800 text-white px-2 py-0.5 rounded">
                    SECTION 4 PIPELINES
                  </span>
                  <h3 className="text-sm font-black text-slate-900 tracking-tight">
                    Other Supporting Processes (Divided by Section — Image 3)
                  </h3>
                </div>
                <span className="text-[10px] text-slate-500 font-bold">
                  Communications • Analytics & Payroll • Administration • Settings
                </span>
              </div>

              {/* 4.1 COMMUNICATIONS PIPELINE */}
              {(selectedCategory === "all" || selectedCategory === "communications") && (
                <div className="bg-white rounded-2xl border border-sky-200/80 p-4 shadow-xs">
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-sky-100">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-sky-600" />
                      <h4 className="text-xs font-black text-sky-900 uppercase tracking-wider">
                        Communications Flow (Image 3)
                      </h4>
                      <span className="text-[10px] text-slate-400 font-medium">
                        Automated Candidate Dispatch & Delivery Auditing
                      </span>
                    </div>
                    <span className="text-[9px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                      SMTP Gateway
                    </span>
                  </div>

                  <div className="overflow-x-auto pb-2 pt-1 flex items-start gap-1 sm:gap-2 select-none scrollbar-thin">
                    <div className="pt-2 flex flex-col items-center shrink-0">
                      <div className="px-3 py-1.5 bg-emerald-600 text-white rounded-full font-black text-[11px] uppercase tracking-widest shadow-md flex items-center gap-1.5 ring-2 ring-emerald-300">
                        <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                        START
                      </div>
                      <span className="text-[8px] font-black uppercase text-emerald-700 mt-1 tracking-wider">
                        EMAIL TRIGGER
                      </span>
                    </div>

                    {renderFlowArrow("start-com", "com-email", "Dispatch", "sky", "SMTP Delivery")}

                    <div className="flex-1 min-w-[230px] max-w-[280px]">
                      {renderStepCard(comEmail)}
                    </div>

                    {renderFlowArrow("com-email", "end-com", "Logged", "sky", "Permanent Audit")}

                    <div className="pt-2 flex flex-col items-center shrink-0">
                      <div className="px-3 py-1.5 bg-slate-700 text-white rounded-full font-black text-[11px] uppercase tracking-widest shadow-md flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        AUDIT VERIFIED
                      </div>
                      <span className="text-[8px] font-black uppercase text-slate-500 mt-1 tracking-wider">
                        CANDIDATE INBOX
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* 4.2 ANALYTICS & PAYROLL PIPELINE */}
              {(selectedCategory === "all" || selectedCategory === "analytics") && (
                <div className="bg-white rounded-2xl border border-amber-200/80 p-4 shadow-xs">
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-amber-100">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-amber-600" />
                      <h4 className="text-xs font-black text-amber-900 uppercase tracking-wider">
                        Analytics & Payroll Pipeline Flow (Image 3)
                      </h4>
                      <span className="text-[10px] text-slate-400 font-medium">
                        Reports, Attrition Rate, Hiring Costs & Biometric Payroll
                      </span>
                    </div>
                    <span className="text-[9px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      Cut-Off 15th & 30th
                    </span>
                  </div>

                  <div className="overflow-x-auto pb-2 pt-1 flex items-start gap-1 sm:gap-2 select-none scrollbar-thin">
                    <div className="pt-2 flex flex-col items-center shrink-0">
                      <div className="px-3 py-1.5 bg-emerald-600 text-white rounded-full font-black text-[11px] uppercase tracking-widest shadow-md flex items-center gap-1.5 ring-2 ring-emerald-300">
                        <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                        START
                      </div>
                      <span className="text-[8px] font-black uppercase text-emerald-700 mt-1 tracking-wider">
                        METRICS DATA
                      </span>
                    </div>

                    {renderFlowArrow("start-ana", "ana-reports", "Aggregate", "amber", "Live Data")}

                    <div className="flex-1 min-w-[210px] max-w-[240px]">
                      {renderStepCard(anaReports)}
                    </div>

                    {renderFlowArrow("ana-reports", "ana-analytics", "Attrition", "amber", "Trend Analysis")}

                    <div className="flex-1 min-w-[210px] max-w-[240px]">
                      {renderStepCard(anaAnalytics)}
                    </div>

                    {renderFlowArrow("ana-analytics", "ana-costs", "Cost / Hire", "amber", "Budget Ledger")}

                    <div className="flex-1 min-w-[210px] max-w-[240px]">
                      {renderStepCard(anaCosts)}
                    </div>

                    {renderFlowArrow("ana-costs", "ana-payroll", "Cut-Off Sync", "amber", "Salary Release")}

                    <div className="flex-1 min-w-[210px] max-w-[240px]">
                      {renderStepCard(anaPayroll)}
                    </div>
                  </div>
                </div>
              )}

              {/* 4.3 ADMINISTRATION & SETTINGS PIPELINE */}
              {(selectedCategory === "all" || selectedCategory === "administration" || selectedCategory === "settings") && (
                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-slate-700" />
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                        Administration & Governance Flow (Image 3)
                      </h4>
                      <span className="text-[10px] text-slate-400 font-medium">
                        Corporate Divisions, Multi-Campuses (Davao, Tagum, Mabini), Pipeline Rubrics & Security
                      </span>
                    </div>
                    <span className="text-[9px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      Enterprise Config
                    </span>
                  </div>

                  <div className="overflow-x-auto pb-2 pt-1 flex items-start gap-1 sm:gap-2 select-none scrollbar-thin">
                    <div className="pt-2 flex flex-col items-center shrink-0">
                      <div className="px-3 py-1.5 bg-emerald-600 text-white rounded-full font-black text-[11px] uppercase tracking-widest shadow-md flex items-center gap-1.5 ring-2 ring-emerald-300">
                        <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                        START
                      </div>
                      <span className="text-[8px] font-black uppercase text-emerald-700 mt-1 tracking-wider">
                        GLOBAL CONFIG
                      </span>
                    </div>

                    {renderFlowArrow("start-adm", "adm-depts", "Divisions", "slate", "7 Departments")}

                    <div className="flex-1 min-w-[210px] max-w-[240px]">
                      {renderStepCard(admDepts)}
                    </div>

                    {renderFlowArrow("adm-depts", "adm-sites", "Locations", "slate", "3 Campuses")}

                    <div className="flex-1 min-w-[210px] max-w-[240px]">
                      {renderStepCard(admSites)}
                    </div>

                    {renderFlowArrow("adm-sites", "set-recruitment", "Rubrics", "indigo", "Pipeline SLA")}

                    <div className="flex-1 min-w-[210px] max-w-[240px]">
                      {renderStepCard(setRecruitment)}
                    </div>

                    {renderFlowArrow("set-recruitment", "set-account", "Security", "indigo", "RBAC Policies")}

                    <div className="flex-1 min-w-[210px] max-w-[240px]">
                      {renderStepCard(setAccount)}
                    </div>
                  </div>

                  {/* Logic Flow Box: Administration dictates ecosystem rules */}
                  {showLogicLoops && (
                    <div className="mt-3.5 pt-3.5 border-t border-dashed border-slate-200">
                      <div className="p-3 rounded-xl border border-indigo-200 bg-indigo-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Settings className="w-4 h-4 text-indigo-700" />
                          <span className="text-xs font-black text-slate-800">
                            Global Governance: Divisions, Sites, and Interview Rubrics dictate workflow routing across all modules.
                          </span>
                        </div>
                        <span className="text-[10px] font-black text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-200 shrink-0">
                          Active Policy Enforced
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

        </div>

        {/* ==================== 3. INTERACTIVE NODE INSPECTOR (RIGHT DRAWER) ==================== */}
        {isInspectorOpen && selectedNode && (
          <div className="w-full xl:w-[380px] bg-white rounded-2xl border border-slate-200 shadow-md p-5 shrink-0 sticky top-4 space-y-4">
            {/* Inspector Top Controls */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                  PROCESS INSPECTOR
                </span>
                <span className="text-xs font-mono font-bold text-[#1D68BD]">
                  {selectedNode.code}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${selectedNode.badgeColor}`}>
                  {selectedNode.sectionLabel}
                </span>
              </div>
            </div>

            {/* Title & Subtitle */}
            <div className="space-y-1">
              <h3 className="text-base font-black text-[#042C51] leading-tight">
                {selectedNode.title}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {selectedNode.subtitle}
              </p>
            </div>

            {/* Role Permissions */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                Authorized Role Access:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedNode.roles.map(role => (
                  <span
                    key={role}
                    className="text-[10.5px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>

            {/* Narrative Description */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-xs text-slate-700 leading-relaxed space-y-1">
              <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">
                Operational Description:
              </span>
              <p>{selectedNode.description}</p>
            </div>

            {/* Inputs & Outputs Grid */}
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-100 space-y-1">
                <div className="text-[9.5px] font-black uppercase text-blue-900 tracking-wider">
                  Inputs / Triggers:
                </div>
                <ul className="space-y-1 text-slate-600 font-medium">
                  {selectedNode.inputs.map((inp, idx) => (
                    <li key={idx} className="flex items-start gap-1">
                      <span className="text-blue-500">•</span>
                      <span>{inp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100 space-y-1">
                <div className="text-[9.5px] font-black uppercase text-emerald-900 tracking-wider">
                  Outputs / Artifacts:
                </div>
                <ul className="space-y-1 text-slate-600 font-medium">
                  {selectedNode.outputs.map((out, idx) => (
                    <li key={idx} className="flex items-start gap-1">
                      <span className="text-emerald-500">•</span>
                      <span>{out}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Key Action Checklist */}
            <div className="space-y-1.5 text-xs">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                Key Operations & SLAs:
              </span>
              <div className="space-y-1">
                {selectedNode.keyActions.map((action, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-slate-700 font-medium text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{action}</span>
                  </div>
                ))}
              </div>
              <div className="mt-2 text-[10.5px] font-black text-slate-600 flex items-center justify-between pt-1 border-t border-slate-100">
                <span className="text-slate-400 uppercase text-[9.5px]">Standard SLA:</span>
                <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {selectedNode.sla}
                </span>
              </div>
            </div>

            {/* Special Action: Hiring Needs Intake -> 1:1 Personnel Form Modal */}
            {selectedNode.hasRequisitionModal && (
              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsRequisitionModalOpen(true)}
                  className="w-full py-2 px-3 bg-[#FF5C28] hover:bg-[#e04b1c] text-white font-black text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>Open Personnel Requisition Form (1:1 Modal)</span>
                </button>
              </div>
            )}

            {/* Direct Module Launcher */}
            {selectedNode.moduleKey && onSwitchModule && (
              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => onSwitchModule(selectedNode.moduleKey!)}
                  className="w-full py-2.5 px-3 bg-[#1D68BD] hover:bg-[#155296] text-white font-black text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Switch to {selectedNode.moduleKey} Screen</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ==================== 4. PERSONNEL REQUISITION 1:1 MODAL ==================== */}
      <PersonnelRequisitionModal
        isOpen={isRequisitionModalOpen}
        onClose={() => setIsRequisitionModalOpen(false)}
        onSubmitSuccess={(data: RequisitionFormData) => {
          setSelectedNodeId("rec-positions");
        }}
      />
    </div>
  );
}
