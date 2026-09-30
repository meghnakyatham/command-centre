// ============================================================
// Executive Command Center — Core Type Definitions (Full Spec)
// ============================================================

export type ProjectStatus = 'planning' | 'on_track' | 'needs_attention' | 'at_risk' | 'delayed' | 'on_hold' | 'completed' | 'archived';
export type ProjectPriority = 'P1' | 'P2' | 'P3' | 'P4';
export type TaskStatus = 'backlog' | 'planned' | 'in_progress' | 'blocked' | 'in_review' | 'completed' | 'cancelled';
export type TaskPriority = 'P1' | 'P2' | 'P3' | 'P4';
export type Sector = 'Research' | 'UX' | 'UI' | 'Branding' | 'Development' | 'Content' | 'Ops' | 'Finance' | 'Other';
export type UserRole = 'owner' | 'member'; // Saswat = owner, Meghna = member

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

// --- Health Score Signals ---
export interface HealthBreakdown {
  score: number; // 0 - 100
  scheduleGapPenalty: number;
  overduePenalty: number;
  backlogGrowthPenalty: number;
  blockerPenalty: number;
  missedMilestonesPenalty: number;
  budgetBurnPenalty: number;
  explanation: string;
}

export interface ProjectUpdateHistory {
  id: string;
  date: string;
  progress: number;
  status: ProjectStatus;
  doneToday: string;
  blocked: string;
  nextUp: string;
  confidence: 'High' | 'Medium' | 'Low';
  updatedBy: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  priority: ProjectPriority;
  status: ProjectStatus;
  progress: number; // 0-100
  healthScore: number; // 0-100
  healthHistory: number[]; // 14-day sparkline history
  owner: string; // user id
  startDate: string;
  plannedEndDate: string;
  baselineEndDate: string; // frozen plan date
  estimatedEndDate?: string;
  color: string;
  icon: string;
  budget?: number;
  actualSpending?: number;
  notionLink?: string;
  driveLink?: string;
  workstreams: Workstream[];
  updateHistory: ProjectUpdateHistory[];
  createdAt: string;
  updatedAt: string;
}

export interface Workstream {
  id: string;
  projectId: string;
  name: string;
  sector: Sector;
  milestones: Milestone[];
}

export interface Milestone {
  id: string;
  workstreamId: string;
  projectId: string;
  name: string;
  description: string;
  plannedStart: string;
  plannedEnd: string;
  weight: number; // weight toward progress
  status: ProjectStatus;
  progress: number;
  owner: string;
  dependencies: string[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  projectId: string;
  milestoneId?: string;
  workstreamId?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string; // user/team member id
  reporter: string;
  dueDate: string;
  startDate?: string;
  effortHours?: number;
  sector: Sector;
  dependencies: string[]; // "blocked by"
  unlocks: string[]; // "unlocks"
  blockerNote?: string;
  carriedOverCount: number;
  tags?: string[];
  subtasks: Subtask[];
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Comment {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar?: string;
  projectIds: string[];
  skills: string[];
  weeklyCapacityHours: number;
  notes: string;
  onTimeRate: number; // 0-100%
  updateConsistency: number; // 0-100%
  joinedDate: string;
}

export interface Budget {
  id: string;
  projectId: string;
  allocatedAmount: number;
  spentAmount: number;
  forecastedAmount: number;
  currency: string;
  period: string;
}

export interface Expense {
  id: string;
  projectId: string;
  description: string;
  amount: number;
  currency: string;
  date: string;
  category: string;
  vendor?: string;
  paymentStatus: 'pending' | 'paid' | 'overdue';
  approvalStatus: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  createdAt: string;
}

export interface Revenue {
  id: string;
  projectId?: string;
  description: string;
  amount: number;
  currency: string;
  date: string;
  status: 'received' | 'expected' | 'overdue';
  source: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time?: string;
  type: 'meeting' | 'deadline' | 'milestone' | 'reminder' | 'payment' | 'review' | 'focus';
  projectId?: string;
  color: string;
  attendees: string[];
}

export interface Reminder {
  id: string;
  title: string;
  description: string;
  dateTime: string;
  projectId?: string;
  taskId?: string;
  priority: TaskPriority;
  level: 'normal' | 'critical';
  acknowledged: boolean;
  owner: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  type: 'quick' | 'meeting' | 'decision' | 'document' | 'one_on_one';
  projectId?: string;
  isPrivate?: boolean;
  tags: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Decision {
  id: string;
  title: string;
  description: string;
  context: string;
  owner: string;
  deadline: string;
  projectId?: string;
  impact: string;
  status: 'pending' | 'decided' | 'deferred';
  createdAt: string;
}

export interface UpdateEntry {
  id: string;
  content: string;
  source: 'whatsapp' | 'manual' | 'system' | 'notion';
  projectId?: string;
  teamMemberId?: string;
  createdBy: string;
  createdAt: string;
  tags: string[];
}

export interface DashboardMetrics {
  activeProjects: number;
  projectsAtRisk: number;
  overdueTasks: number;
  tasksDueToday: number;
  pendingDecisions: number;
  budgetUtilization: number;
  totalSpendingThisMonth: number;
  revenueThisMonth: number;
}
