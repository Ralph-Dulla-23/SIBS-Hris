import { 
  PlanStatus, 
  ActionItemStatus, 
  RiskLevel, 
  SummaryMetrics, 
  PipelineStage, 
  PipelineDropOff, 
  TrendPoint, 
  DetailRecord, 
  WorkforcePlan,
  ActionItem 
} from "./types";

// Static definitions of clusters and accounts
export const CLUSTERS = [
  "All Clusters",
  "Telecom & Tech",
  "Financial Services",
  "Healthcare & Ins.",
  "Retail & E-Commerce"
];

export const ACCOUNTS_BY_CLUSTER: { [key: string]: string[] } = {
  "Telecom & Tech": ["T-Mobile Care", "Verizon Tech", "AT&T Support", "Comcast Technical"],
  "Financial Services": ["Chase Credit", "Citi Global", "Capital One Help", "Wells Fargo CS"],
  "Healthcare & Ins.": ["UnitedHealth VIP", "Aetna Core", "Humana Support", "Blue Shield Direct"],
  "Retail & E-Commerce": ["Amazon Care", "Target Guest", "Wayfair Support", "Walmart Online"]
};

export const ALL_ACCOUNTS = Object.values(ACCOUNTS_BY_CLUSTER).flat();

// Initial summary metrics for overview
export const INITIAL_SUMMARY_METRICS: SummaryMetrics = {
  requiredHeadcount: 4850,
  actualHeadcount: 4620,
  bufferPercentage: -4.7, // (Actual - Required) / Required * 100
  absenteeismCount: 378,
  absenteeismPercentage: 8.18, // absenteeismCount / actualHeadcount * 100
  attritionCount: 215,
  attritionPercentage: 4.65,
  netActualHC: 4242, // actualHeadcount - absenteeismCount
  hiringNeeded: 608, // requiredHeadcount - netActualHC
  hiringRate: 68.5, // FST / Interview
  hiredCount: 380,
  leadsToInterview: 1250
};

// Pipeline Stages
export const INITIAL_PIPELINE_STAGES: PipelineStage[] = [
  { name: "Accepted Job Offer", count: 420, percentageOfJO: 100, conversionFromPrevious: 100, targetCount: 450, isWarning: false },
  { name: "NHO — New Hire Orientation", count: 395, percentageOfJO: 94.0, conversionFromPrevious: 94.0, targetCount: 420, isWarning: false },
  { name: "FST — Foundation Skills Training", count: 350, percentageOfJO: 83.3, conversionFromPrevious: 88.6, targetCount: 380, isWarning: false },
  { name: "PST — Product Specific Training", count: 310, percentageOfJO: 73.8, conversionFromPrevious: 88.5, targetCount: 350, isWarning: true },
  { name: "Go Live", count: 285, percentageOfJO: 67.8, conversionFromPrevious: 91.9, targetCount: 320, isWarning: true }
];

// Pipeline Drop-offs
export const INITIAL_DROP_OFFS: PipelineDropOff[] = [
  { fromStage: "Accepted JO", toStage: "NHO", count: 25, percentage: 5.9, retainedCount: 395, warningSeverity: "low" },
  { fromStage: "NHO", toStage: "FST", count: 45, percentage: 11.4, retainedCount: 350, warningSeverity: "medium" },
  { fromStage: "FST", toStage: "PST", count: 40, percentage: 11.4, retainedCount: 310, warningSeverity: "medium" },
  { fromStage: "NHO", toStage: "PST", count: 85, percentage: 21.5, retainedCount: 310, warningSeverity: "high" }, // alternate path
  { fromStage: "PST", toStage: "Go Live", count: 25, percentage: 8.1, retainedCount: 285, warningSeverity: "low" }
];

// Trends (Weekly and Monthly support)
export const WEEKLY_TRENDS: TrendPoint[] = [
  { period: "Week 23", absenteeism: 6.8, attrition: 3.5, buffer: -2.8 },
  { period: "Week 24", absenteeism: 7.2, attrition: 3.8, buffer: -3.5 },
  { period: "Week 25", absenteeism: 8.5, attrition: 4.1, buffer: -4.2 },
  { period: "Week 26", absenteeism: 7.9, attrition: 4.5, buffer: -4.9 },
  { period: "Week 27", absenteeism: 8.2, attrition: 4.8, buffer: -5.1 },
  { period: "Week 28", absenteeism: 8.18, attrition: 4.65, buffer: -4.7 }
];

export const MONTHLY_TRENDS: TrendPoint[] = [
  { period: "Mar 2026", absenteeism: 6.8, attrition: 3.5, buffer: 2.1 },
  { period: "Apr 2026", absenteeism: 7.4, attrition: 4.2, buffer: 0.5 },
  { period: "May 2026", absenteeism: 8.1, attrition: 4.8, buffer: -2.3 },
  { period: "Jun 2026", absenteeism: 8.4, attrition: 5.1, buffer: -4.1 },
  { period: "Jul 2026", absenteeism: 8.18, attrition: 4.65, buffer: -4.7 }
];

// Details record per Cluster and Account
export const INITIAL_DETAIL_RECORDS: DetailRecord[] = [
  {
    id: "rec-1",
    cluster: "Telecom & Tech",
    account: "T-Mobile Care",
    requiredHC: 650,
    actualHC: 620,
    bufferPercentage: -4.6,
    absenteeismCount: 52,
    absenteeismPercentage: 8.38,
    attritionCount: 31,
    attritionPercentage: 5.0,
    netActualHC: 568,
    hiringNeeded: 82,
    acceptedJO: 60,
    nho: 56,
    fst: 50,
    pst: 45,
    goLive: 42,
    dropOffCount: 18,
    dropOffPercentage: 30.0,
    hiredCount: 55,
    hiringRate: 70.0,
    riskLevel: RiskLevel.Watch
  },
  {
    id: "rec-2",
    cluster: "Telecom & Tech",
    account: "Verizon Tech",
    requiredHC: 550,
    actualHC: 520,
    bufferPercentage: -5.4,
    absenteeismCount: 48,
    absenteeismPercentage: 9.23,
    attritionCount: 28,
    attritionPercentage: 5.38,
    netActualHC: 472,
    hiringNeeded: 78,
    acceptedJO: 50,
    nho: 45,
    fst: 38,
    pst: 32,
    goLive: 30,
    dropOffCount: 20,
    dropOffPercentage: 40.0,
    hiredCount: 42,
    hiringRate: 60.0,
    riskLevel: RiskLevel.AtRisk
  },
  {
    id: "rec-3",
    cluster: "Telecom & Tech",
    account: "AT&T Support",
    requiredHC: 450,
    actualHC: 440,
    bufferPercentage: -2.2,
    absenteeismCount: 30,
    absenteeismPercentage: 6.81,
    attritionCount: 15,
    attritionPercentage: 3.4,
    netActualHC: 410,
    hiringNeeded: 40,
    acceptedJO: 35,
    nho: 34,
    fst: 32,
    pst: 30,
    goLive: 28,
    dropOffCount: 7,
    dropOffPercentage: 20.0,
    hiredCount: 31,
    hiringRate: 80.0,
    riskLevel: RiskLevel.Healthy
  },
  {
    id: "rec-4",
    cluster: "Telecom & Tech",
    account: "Comcast Technical",
    requiredHC: 400,
    actualHC: 360,
    bufferPercentage: -10.0,
    absenteeismCount: 38,
    absenteeismPercentage: 10.55,
    attritionCount: 24,
    attritionPercentage: 6.67,
    netActualHC: 322,
    hiringNeeded: 78,
    acceptedJO: 45,
    nho: 40,
    fst: 32,
    pst: 26,
    goLive: 24,
    dropOffCount: 21,
    dropOffPercentage: 46.7,
    hiredCount: 32,
    hiringRate: 53.3,
    riskLevel: RiskLevel.Critical
  },
  {
    id: "rec-5",
    cluster: "Financial Services",
    account: "Chase Credit",
    requiredHC: 500,
    actualHC: 485,
    bufferPercentage: -3.0,
    absenteeismCount: 35,
    absenteeismPercentage: 7.21,
    attritionCount: 18,
    attritionPercentage: 3.71,
    netActualHC: 450,
    hiringNeeded: 50,
    acceptedJO: 45,
    nho: 43,
    fst: 40,
    pst: 37,
    goLive: 35,
    dropOffCount: 10,
    dropOffPercentage: 22.2,
    hiredCount: 42,
    hiringRate: 77.8,
    riskLevel: RiskLevel.Healthy
  },
  {
    id: "rec-6",
    cluster: "Financial Services",
    account: "Citi Global",
    requiredHC: 480,
    actualHC: 445,
    bufferPercentage: -7.2,
    absenteeismCount: 42,
    absenteeismPercentage: 9.43,
    attritionCount: 25,
    attritionPercentage: 5.61,
    netActualHC: 403,
    hiringNeeded: 77,
    acceptedJO: 52,
    nho: 48,
    fst: 42,
    pst: 36,
    goLive: 32,
    dropOffCount: 20,
    dropOffPercentage: 38.4,
    hiredCount: 38,
    hiringRate: 61.5,
    riskLevel: RiskLevel.AtRisk
  },
  {
    id: "rec-7",
    cluster: "Financial Services",
    account: "Capital One Help",
    requiredHC: 400,
    actualHC: 390,
    bufferPercentage: -2.5,
    absenteeismCount: 28,
    absenteeismPercentage: 7.17,
    attritionCount: 12,
    attritionPercentage: 3.07,
    netActualHC: 362,
    hiringNeeded: 38,
    acceptedJO: 30,
    nho: 28,
    fst: 26,
    pst: 25,
    goLive: 24,
    dropOffCount: 6,
    dropOffPercentage: 20.0,
    hiredCount: 27,
    hiringRate: 80.0,
    riskLevel: RiskLevel.Healthy
  },
  {
    id: "rec-8",
    cluster: "Healthcare & Ins.",
    account: "UnitedHealth VIP",
    requiredHC: 420,
    actualHC: 405,
    bufferPercentage: -3.5,
    absenteeismCount: 32,
    absenteeismPercentage: 7.9,
    attritionCount: 15,
    attritionPercentage: 3.7,
    netActualHC: 373,
    hiringNeeded: 47,
    acceptedJO: 38,
    nho: 36,
    fst: 33,
    pst: 30,
    goLive: 28,
    dropOffCount: 10,
    dropOffPercentage: 26.3,
    hiredCount: 32,
    hiringRate: 73.7,
    riskLevel: RiskLevel.Watch
  },
  {
    id: "rec-9",
    cluster: "Healthcare & Ins.",
    account: "Aetna Core",
    requiredHC: 350,
    actualHC: 310,
    bufferPercentage: -11.4,
    absenteeismCount: 35,
    absenteeismPercentage: 11.29,
    attritionCount: 22,
    attritionPercentage: 7.09,
    netActualHC: 275,
    hiringNeeded: 75,
    acceptedJO: 45,
    nho: 40,
    fst: 31,
    pst: 25,
    goLive: 22,
    dropOffCount: 23,
    dropOffPercentage: 51.1,
    hiredCount: 26,
    hiringRate: 48.8,
    riskLevel: RiskLevel.Critical
  },
  {
    id: "rec-10",
    cluster: "Retail & E-Commerce",
    account: "Amazon Care",
    requiredHC: 500,
    actualHC: 495,
    bufferPercentage: -1.0,
    absenteeismCount: 30,
    absenteeismPercentage: 6.06,
    attritionCount: 16,
    attritionPercentage: 3.23,
    netActualHC: 465,
    hiringNeeded: 35,
    acceptedJO: 40,
    nho: 38,
    fst: 35,
    pst: 33,
    goLive: 31,
    dropOffCount: 9,
    dropOffPercentage: 22.5,
    hiredCount: 36,
    hiringRate: 77.5,
    riskLevel: RiskLevel.Healthy
  },
  {
    id: "rec-11",
    cluster: "Retail & E-Commerce",
    account: "Target Guest",
    requiredHC: 450,
    actualHC: 420,
    bufferPercentage: -6.6,
    absenteeismCount: 38,
    absenteeismPercentage: 9.05,
    attritionCount: 22,
    attritionPercentage: 5.23,
    netActualHC: 382,
    hiringNeeded: 68,
    acceptedJO: 45,
    nho: 41,
    fst: 36,
    pst: 30,
    goLive: 27,
    dropOffCount: 18,
    dropOffPercentage: 40.0,
    hiredCount: 33,
    hiringRate: 60.0,
    riskLevel: RiskLevel.AtRisk
  }
];

// Mock action items
export const INITIAL_ACTION_ITEMS: ActionItem[] = [
  {
    id: "act-1",
    workforcePlanId: "plan-1",
    taskDescription: "Launch local sourcing caravan in Bulacan region to increase candidate pipeline volume.",
    assignee: "Regina Phalange (Sourcing)",
    targetDate: "2026-07-25",
    status: ActionItemStatus.InProgress,
    priority: "High",
    createdAt: "2026-07-15",
    updatedAt: "2026-07-15"
  },
  {
    id: "act-2",
    workforcePlanId: "plan-1",
    taskDescription: "Revise FST curriculum with operations stakeholders to address NHO to FST leakage.",
    assignee: "Marcus Aurelius (Training)",
    targetDate: "2026-07-29",
    status: ActionItemStatus.NotStarted,
    priority: "Medium",
    createdAt: "2026-07-16",
    updatedAt: "2026-07-16"
  },
  {
    id: "act-3",
    workforcePlanId: "plan-1",
    taskDescription: "Align shift requirements with the client to relax night differential requirements during orientation.",
    assignee: "Clara Oswald (Account Manager)",
    targetDate: "2026-07-20",
    status: ActionItemStatus.Completed,
    priority: "High",
    createdAt: "2026-07-10",
    updatedAt: "2026-07-18"
  },
  {
    id: "act-4",
    workforcePlanId: "plan-2",
    taskDescription: "Conduct focus group discussion for PST trainers to investigate drop-off before Go-Live.",
    assignee: "Arthur Pendragon (Training Lead)",
    targetDate: "2026-07-28",
    status: ActionItemStatus.InProgress,
    priority: "Medium",
    createdAt: "2026-07-17",
    updatedAt: "2026-07-18"
  },
  {
    id: "act-5",
    workforcePlanId: "plan-2",
    taskDescription: "Partner with Recruitment Marketing to push social media referrals for Comcast technical agents.",
    assignee: "Gwen Stacy (Marketing)",
    targetDate: "2026-07-22",
    status: ActionItemStatus.Blocked,
    priority: "High",
    createdAt: "2026-07-14",
    updatedAt: "2026-07-19"
  },
  {
    id: "act-6",
    workforcePlanId: "plan-3",
    taskDescription: "Validate PRF count with corporate operations for Aetna Core Q3 ramp.",
    assignee: "John Watson (WFM Manager)",
    targetDate: "2026-08-05",
    status: ActionItemStatus.NotStarted,
    priority: "Low",
    createdAt: "2026-07-19",
    updatedAt: "2026-07-19"
  }
];

// Initial Workforce Plans matching the table data
export const INITIAL_PLANS: WorkforcePlan[] = [
  {
    id: "plan-1",
    cluster: "Telecom & Tech",
    account: "Verizon Tech",
    planPeriod: "Q3 2026 Ramp",
    requiredHeadcount: 550,
    actualHeadcount: 520,
    hiredCount: 42,
    hiringNeeded: 78,
    hiringRate: 60.0, // FST / Interview
    leadsNeeded: 216,
    interviewCount: 130,
    fstCount: 78,
    status: PlanStatus.Active,
    owner: "Sarah Jenkins (WFM Principal)",
    approvedBy: "James Carter (Operations VP)",
    createdAt: "2026-07-12",
    updatedAt: "2026-07-18",
    kpiSnapshot: {
      bufferPercentage: -5.4,
      absenteeismCount: 48,
      absenteeismPercentage: 9.23,
      attritionCount: 28,
      attritionPercentage: 5.38,
      acceptedJO: 50,
      nho: 45,
      fst: 38,
      pst: 32,
      goLive: 30,
      hiredCount: 42,
      hiringRate: 60.0
    },
    pipeline: {
      acceptedJO: 50,
      nho: 45,
      fst: 38,
      pst: 32,
      goLive: 30,
      dropOffs: {
        joToNho: 5,
        nhoToFst: 7,
        fstToPst: 6,
        nhoToPst: 13,
        pstToGoLive: 2
      }
    },
    actionItems: [
      {
        id: "act-4",
        workforcePlanId: "plan-1",
        taskDescription: "Conduct focus group discussion for PST trainers to investigate drop-off before Go-Live.",
        assignee: "Arthur Pendragon (Training Lead)",
        targetDate: "2026-07-28",
        status: ActionItemStatus.InProgress,
        priority: "Medium",
        createdAt: "2026-07-17",
        updatedAt: "2026-07-18"
      }
    ],
    activityHistory: [
      { id: "h-1", date: "2026-07-18 10:30", user: "Sarah Jenkins", action: "Updated plan pipeline status", details: "Changed Go Live count from 28 to 30 following training sign-off." },
      { id: "h-2", date: "2026-07-15 14:15", user: "James Carter", action: "Plan approved", details: "Approved the initial ramp projections for Comcast and Verizon Tech." },
      { id: "h-3", date: "2026-07-12 09:00", user: "Sarah Jenkins", action: "Plan created", details: "Drafted plan for Verizon Tech Q3 2026." }
    ]
  },
  {
    id: "plan-2",
    cluster: "Telecom & Tech",
    account: "Comcast Technical",
    planPeriod: "Q3 2026 Ramp",
    requiredHeadcount: 400,
    actualHeadcount: 360,
    hiredCount: 32,
    hiringNeeded: 78,
    hiringRate: 53.3,
    leadsNeeded: 245,
    interviewCount: 150,
    fstCount: 80,
    status: PlanStatus.ForReview,
    owner: "Peter Parker (Recruitment Lead)",
    approvedBy: "Unassigned",
    createdAt: "2026-07-14",
    updatedAt: "2026-07-19",
    kpiSnapshot: {
      bufferPercentage: -10.0,
      absenteeismCount: 38,
      absenteeismPercentage: 10.55,
      attritionCount: 24,
      attritionPercentage: 6.67,
      acceptedJO: 45,
      nho: 40,
      fst: 32,
      pst: 26,
      goLive: 24,
      hiredCount: 32,
      hiringRate: 53.3
    },
    pipeline: {
      acceptedJO: 45,
      nho: 40,
      fst: 32,
      pst: 26,
      goLive: 24,
      dropOffs: {
        joToNho: 5,
        nhoToFst: 8,
        fstToPst: 6,
        nhoToPst: 14,
        pstToGoLive: 2
      }
    },
    actionItems: [
      {
        id: "act-5",
        workforcePlanId: "plan-2",
        taskDescription: "Partner with Recruitment Marketing to push social media referrals for Comcast technical agents.",
        assignee: "Gwen Stacy (Marketing)",
        targetDate: "2026-07-22",
        status: ActionItemStatus.Blocked,
        priority: "High",
        createdAt: "2026-07-14",
        updatedAt: "2026-07-19"
      }
    ],
    activityHistory: [
      { id: "h-4", date: "2026-07-19 16:45", user: "Peter Parker", action: "Submitted for Review", details: "Moved Comcast Technical plan to Review status after adding sitemap referrals." },
      { id: "h-5", date: "2026-07-14 11:20", user: "Peter Parker", action: "Plan created", details: "Drafted Comcast Technical hiring ramp." }
    ]
  },
  {
    id: "plan-3",
    cluster: "Healthcare & Ins.",
    account: "Aetna Core",
    planPeriod: "Q3 2026 Ramp",
    requiredHeadcount: 350,
    actualHeadcount: 310,
    hiredCount: 26,
    hiringNeeded: 75,
    hiringRate: 48.8,
    leadsNeeded: 310,
    interviewCount: 180,
    fstCount: 88,
    status: PlanStatus.Active,
    owner: "Sarah Jenkins (WFM Principal)",
    approvedBy: "James Carter (Operations VP)",
    createdAt: "2026-07-11",
    updatedAt: "2026-07-19",
    kpiSnapshot: {
      bufferPercentage: -11.4,
      absenteeismCount: 35,
      absenteeismPercentage: 11.29,
      attritionCount: 22,
      attritionPercentage: 7.09,
      acceptedJO: 45,
      nho: 40,
      fst: 31,
      pst: 25,
      goLive: 22,
      hiredCount: 26,
      hiringRate: 48.8
    },
    pipeline: {
      acceptedJO: 45,
      nho: 40,
      fst: 31,
      pst: 25,
      goLive: 22,
      dropOffs: {
        joToNho: 5,
        nhoToFst: 9,
        fstToPst: 6,
        nhoToPst: 15,
        pstToGoLive: 3
      }
    },
    actionItems: [
      {
        id: "act-6",
        workforcePlanId: "plan-3",
        taskDescription: "Validate PRF count with corporate operations for Aetna Core Q3 ramp.",
        assignee: "John Watson (WFM Manager)",
        targetDate: "2026-08-05",
        status: ActionItemStatus.NotStarted,
        priority: "Low",
        createdAt: "2026-07-19",
        updatedAt: "2026-07-19"
      }
    ],
    activityHistory: [
      { id: "h-6", date: "2026-07-19 12:00", user: "Sarah Jenkins", action: "Updated snapshot metrics", details: "Synchronized active database with current WFM metrics." }
    ]
  },
  {
    id: "plan-4",
    cluster: "Telecom & Tech",
    account: "T-Mobile Care",
    planPeriod: "Q3 2026 Ramp",
    requiredHeadcount: 650,
    actualHeadcount: 620,
    hiredCount: 55,
    hiringNeeded: 82,
    hiringRate: 70.0,
    leadsNeeded: 120,
    interviewCount: 100,
    fstCount: 70,
    status: PlanStatus.Draft,
    owner: "Sarah Jenkins (WFM Principal)",
    createdAt: "2026-07-18",
    updatedAt: "2026-07-18",
    kpiSnapshot: {
      bufferPercentage: -4.6,
      absenteeismCount: 52,
      absenteeismPercentage: 8.38,
      attritionCount: 31,
      attritionPercentage: 5.0,
      acceptedJO: 60,
      nho: 56,
      fst: 50,
      pst: 45,
      goLive: 42,
      hiredCount: 55,
      hiringRate: 70.0
    },
    pipeline: {
      acceptedJO: 60,
      nho: 56,
      fst: 50,
      pst: 45,
      goLive: 42,
      dropOffs: {
        joToNho: 4,
        nhoToFst: 6,
        fstToPst: 5,
        nhoToPst: 11,
        pstToGoLive: 3
      }
    },
    actionItems: [],
    activityHistory: [
      { id: "h-7", date: "2026-07-18 08:30", user: "Sarah Jenkins", action: "Draft initialized", details: "Initialized draft for T-Mobile Care ramping up for Q3." }
    ]
  }
];

export const INITIAL_RESIGNATIONS: any[] = [
  {
    id: "RES-2026-001",
    sibsId: "SIBS-8429",
    employeeName: "Alena Batacan",
    position: "Senior Operations Specialist",
    department: "Telecom & Tech Support",
    account: "Verizon Tech",
    cluster: "Telecom & Tech",
    type: "Formal",
    submissionDate: "2026-07-05",
    resignationDate: "2026-07-05",
    lastWorkingDate: "2026-08-04",
    status: "Pending Approval",
    reason: "Career Change / Advancement",
    otherReasonDetails: "",
    remarks: "Seeking growth opportunities in cloud architecture. Handing over project docs to Renz.",
    attachments: [
      { name: "Resignation_Letter_Alena_Batacan.pdf", size: "245 KB", type: "application/pdf" }
    ],
    rejectionReason: "",
    retractionReason: "",
    extensionReason: "",
    hrNotes: "",
    approvalHistory: [
      { stage: "Employee Submission", approver: "Alena Batacan", status: "Approved", date: "2026-07-05 09:15", notes: "Formal notice submitted with 30-day period." },
      { stage: "Team Leader Review", approver: "Renz Torres", status: "Pending", date: "2026-07-05 09:15" },
      { stage: "HR Admin Review", approver: "Shiela Delos Reyes", status: "Pending", date: "2026-07-05 09:15" }
    ]
  },
  {
    id: "RES-2026-002",
    sibsId: "SIBS-3910",
    employeeName: "Samantha Cruz",
    position: "Tier 2 Customer Support Lead",
    department: "Healthcare & Ins.",
    account: "UnitedHealth VIP",
    cluster: "Healthcare & Ins.",
    type: "Immediate",
    submissionDate: "2026-07-18",
    resignationDate: "2026-07-18",
    lastWorkingDate: "2026-07-20",
    status: "Notice Period",
    reason: "Health",
    otherReasonDetails: "",
    remarks: "Persistent back issues requiring immediate medical therapy and prolonged rest.",
    attachments: [
      { name: "Medical_Certificate_Samantha_Cruz.pdf", size: "1.2 MB", type: "application/pdf" }
    ],
    rejectionReason: "",
    retractionReason: "",
    extensionReason: "",
    hrNotes: "Approved immediate notice upon presentation of official hospital diagnosis.",
    approvalHistory: [
      { stage: "Employee Submission", approver: "Samantha Cruz", status: "Approved", date: "2026-07-18 11:30" },
      { stage: "Immediate Policy Waiver", approver: "Samantha Cruz", status: "Approved", date: "2026-07-18 11:32", notes: "Policy acknowledged." },
      { stage: "HR Admin Review", approver: "Shiela Delos Reyes", status: "Approved", date: "2026-07-19 14:00" }
    ]
  },
  {
    id: "RES-2026-003",
    sibsId: "SIBS-1205",
    employeeName: "Marcus Aurelio",
    position: "Financial Analyst",
    department: "Financial Services",
    account: "Chase Credit",
    cluster: "Financial Services",
    type: "Formal",
    submissionDate: "2026-06-15",
    resignationDate: "2026-06-15",
    lastWorkingDate: "2026-07-15",
    status: "Completed",
    reason: "Relocation",
    otherReasonDetails: "",
    remarks: "Family relocating to Iloilo City permanently.",
    attachments: [
      { name: "Formal_Resignation_Marcus.docx", size: "180 KB", type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }
    ],
    rejectionReason: "",
    retractionReason: "",
    extensionReason: "",
    hrNotes: "Clearance completed and final pay issued.",
    approvalHistory: [
      { stage: "Employee Submission", approver: "Marcus Aurelio", status: "Approved", date: "2026-06-15 10:00" },
      { stage: "HR Admin Review", approver: "Shiela Delos Reyes", status: "Approved", date: "2026-06-16 09:30" }
    ]
  }
];
