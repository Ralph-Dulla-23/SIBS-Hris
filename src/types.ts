export enum PlanStatus {
  Draft = "Draft",
  Active = "Active",
  ForReview = "For Review",
  Approved = "Approved",
  Completed = "Completed",
  Archived = "Archived"
}

export enum ActionItemStatus {
  NotStarted = "Not Started",
  InProgress = "In Progress",
  Blocked = "Blocked",
  Completed = "Completed",
  Cancelled = "Cancelled"
}

export enum RiskLevel {
  Healthy = "Healthy",
  Watch = "Watch",
  AtRisk = "At Risk",
  Critical = "Critical"
}

export interface SummaryMetrics {
  requiredHeadcount: number;
  actualHeadcount: number;
  bufferPercentage: number;
  absenteeismCount: number;
  absenteeismPercentage: number;
  attritionCount: number;
  attritionPercentage: number;
  netActualHC: number;
  hiringNeeded: number;
  hiringRate: number; // Leads to JO
  hiredCount: number;
  leadsToInterview: number;
}

export interface PipelineStage {
  name: string;
  count: number;
  percentageOfJO: number;
  conversionFromPrevious: number;
  targetCount: number;
  isWarning: boolean;
}

export interface PipelineDropOff {
  fromStage: string;
  toStage: string;
  count: number;
  percentage: number;
  retainedCount: number;
  warningSeverity: "low" | "medium" | "high";
}

export interface TrendPoint {
  period: string; // e.g. "Week 1", "Jul 2026"
  absenteeism: number; // percentage or count
  attrition: number; // percentage or count
  buffer: number; // percentage
}

export interface DetailRecord {
  id: string;
  cluster: string;
  account: string;
  requiredHC: number;
  actualHC: number;
  bufferPercentage: number;
  absenteeismCount: number;
  absenteeismPercentage: number;
  attritionCount: number;
  attritionPercentage: number;
  netActualHC: number;
  hiringNeeded: number;
  acceptedJO: number;
  nho: number;
  fst: number;
  pst: number;
  goLive: number;
  dropOffCount: number;
  dropOffPercentage: number;
  hiredCount: number;
  hiringRate: number;
  riskLevel: RiskLevel;
}

export interface ActionItem {
  id: string;
  workforcePlanId: string;
  taskDescription: string;
  assignee: string;
  targetDate: string;
  status: ActionItemStatus;
  priority: "Low" | "Medium" | "High";
  createdAt: string;
  updatedAt: string;
}

export interface WorkforcePlan {
  id: string;
  cluster: string;
  account: string;
  planPeriod: string;
  requiredHeadcount: number;
  actualHeadcount: number;
  hiredCount: number;
  hiringNeeded: number; // Coverage + PRF - Hired
  hiringRate: number; // FST / Interview
  leadsNeeded: number; // Interview / HiringRate
  interviewCount: number;
  fstCount: number;
  status: PlanStatus;
  owner: string;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
  kpiSnapshot: {
    bufferPercentage: number;
    absenteeismCount: number;
    absenteeismPercentage: number;
    attritionCount: number;
    attritionPercentage: number;
    acceptedJO: number;
    nho: number;
    fst: number;
    pst: number;
    goLive: number;
    hiredCount: number;
    hiringRate: number;
  };
  pipeline: {
    acceptedJO: number;
    nho: number;
    fst: number;
    pst: number;
    goLive: number;
    dropOffs: {
      joToNho: number;
      nhoToFst: number;
      fstToPst: number;
      nhoToPst: number;
      pstToGoLive: number;
    };
  };
  actionItems: ActionItem[];
  activityHistory: {
    id: string;
    date: string;
    user: string;
    action: string;
    details: string;
  }[];
}

export type ResignationType = "Formal" | "Immediate";

export type ResignationStatus = 
  | "Pending Approval" 
  | "Notice Period" 
  | "Approved" 
  | "Declined" 
  | "Retracted" 
  | "Completed";

export type ResignationReason =
  | "Career Change / Advancement"
  | "Health"
  | "Greener Pasture"
  | "Relocation"
  | "Studies / School"
  | "Family"
  | "Grievance"
  | "Personal - Transportation"
  | "Other";

export interface ResignationAttachment {
  name: string;
  url?: string;
  size?: string;
  type?: string;
}

export interface ApprovalHistoryItem {
  stage: string;
  approver: string;
  status: "Pending" | "Approved" | "Declined" | "Retracted" | "Cancelled";
  date: string;
  notes?: string;
}

export interface ResignationRecord {
  id: string;
  sibsId: string;
  employeeName: string;
  position: string;
  department: string;
  account: string;
  cluster: string;
  type: ResignationType;
  submissionDate: string;
  resignationDate: string;
  lastWorkingDate: string;
  status: ResignationStatus;
  reason: ResignationReason | string;
  otherReasonDetails?: string;
  remarks?: string;
  attachments: ResignationAttachment[];
  rejectionReason?: string;
  retractionReason?: string;
  extensionReason?: string;
  hrNotes?: string;
  approvalHistory: ApprovalHistoryItem[];
}
