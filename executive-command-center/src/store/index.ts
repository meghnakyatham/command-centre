'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Project,
  Task,
  TeamMember,
  Expense,
  Revenue,
  Budget,
  CalendarEvent,
  Reminder,
  Note,
  Decision,
  UpdateEntry,
  DashboardMetrics,
  UserRole,
  Sector,
  HealthBreakdown,
} from '@/types';

// --- Helper ---
const genId = () => Math.random().toString(36).substring(2, 11);

// ============================================================
// HEALTH SCORE ALGORITHM ENGINE (SPEC SECTION 9)
// Health = 100 - (S + O + B + K + M + F)
// ============================================================
export function calculateProjectHealth(project: Project, tasks: Task[]): HealthBreakdown {
  const projTasks = tasks.filter((t) => t.projectId === project.id);
  const todayStr = new Date().toISOString().split('T')[0];

  // S: Schedule gap (0 - 35 max penalty)
  const scheduleGapPenalty = project.status === 'delayed' ? 35 : project.status === 'at_risk' ? 20 : 5;

  // O: Overdue work (0 - 25 max penalty)
  const overdueTasks = projTasks.filter((t) => t.dueDate < todayStr && t.status !== 'completed');
  const overduePenalty = Math.min(25, overdueTasks.length * 8);

  // B: Backlog growth (0 - 15 max penalty)
  const backlogTasks = projTasks.filter((t) => t.status === 'backlog' || t.status === 'planned');
  const backlogGrowthPenalty = Math.min(15, backlogTasks.length * 3);

  // K: Blockers (0 - 10 max penalty)
  const blockedTasks = projTasks.filter((t) => t.status === 'blocked');
  const blockerPenalty = Math.min(10, blockedTasks.length * 5);

  // M: Missed Milestones (0 - 10 max penalty)
  const milestones = project.workstreams.flatMap((w) => w.milestones);
  const missedMilestones = milestones.filter((m) => m.plannedEnd < todayStr && m.progress < 100);
  const missedMilestonesPenalty = Math.min(10, missedMilestones.length * 5);

  // F: Budget burn (0 - 5 max penalty)
  const budgetBurnPenalty = (project.actualSpending || 0) > (project.budget || 0) ? 5 : 0;

  const totalPenalty =
    scheduleGapPenalty +
    overduePenalty +
    backlogGrowthPenalty +
    blockerPenalty +
    missedMilestonesPenalty +
    budgetBurnPenalty;

  const score = Math.max(0, 100 - totalPenalty);

  let explanation = `${project.name} health is ${score}/100. `;
  if (overdueTasks.length > 0) explanation += `${overdueTasks.length} tasks overdue. `;
  if (blockedTasks.length > 0) explanation += `${blockedTasks.length} tasks blocked. `;
  if (score >= 80) explanation += 'Project is on track.';
  else if (score >= 60) explanation += 'Project requires attention.';
  else explanation += 'Project is significantly delayed.';

  return {
    score,
    scheduleGapPenalty,
    overduePenalty,
    backlogGrowthPenalty,
    blockerPenalty,
    missedMilestonesPenalty,
    budgetBurnPenalty,
    explanation,
  };
}

// ============================================================
// DEMO DATA — Realistic seed for the Executive Command Center
// ============================================================

const DEMO_TEAM: TeamMember[] = [
  {
    id: 'tm-1',
    name: 'Saswat Sahu',
    role: 'Founder & Owner',
    email: 'saswat@deepfoldlabs.com',
    avatar: '',
    projectIds: ['proj-1', 'proj-2', 'proj-3', 'proj-4', 'proj-5'],
    skills: ['Strategy', 'Product', 'Business Development', 'Leadership'],
    weeklyCapacityHours: 40,
    notes: 'Primary administrator of the Executive Command Center.',
    onTimeRate: 94,
    updateConsistency: 100,
    joinedDate: '2023-01-01',
  },
  {
    id: 'tm-2',
    name: 'Meghna Kyatham',
    role: 'Executive Operations',
    email: 'meghna@deepfoldlabs.com',
    avatar: '',
    projectIds: ['proj-1', 'proj-2', 'proj-3'],
    skills: ['Project Management', 'Operations', 'Coordination', 'Documentation'],
    weeklyCapacityHours: 40,
    notes: 'Manages execution, task tracking, planning, and reporting.',
    onTimeRate: 88,
    updateConsistency: 95,
    joinedDate: '2023-06-15',
  },
  {
    id: 'tm-3',
    name: 'Bharat Sahu',
    role: 'UX Designer',
    email: 'bharat@deepfoldlabs.com',
    avatar: '',
    projectIds: ['proj-1', 'proj-2'],
    skills: ['UI/UX Design', 'Figma', 'Prototyping', 'Branding'],
    weeklyCapacityHours: 35,
    notes: 'Handles design work across Cosmora AI and Origna.',
    onTimeRate: 82,
    updateConsistency: 90,
    joinedDate: '2023-09-01',
  },
  {
    id: 'tm-4',
    name: 'Sagarika',
    role: 'Cross-Project Support',
    email: 'sagarika@deepfoldlabs.com',
    avatar: '',
    projectIds: ['proj-1', 'proj-2', 'proj-3'],
    skills: ['Research', 'Content', 'Support', 'Documentation'],
    weeklyCapacityHours: 30,
    notes: 'Provides cross-project assistance and research support.',
    onTimeRate: 90,
    updateConsistency: 85,
    joinedDate: '2024-02-01',
  },
];

const DEMO_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    name: 'Cosmora AI',
    description: 'AI-powered CRM and business intelligence platform. Primary product under active development.',
    priority: 'P1',
    status: 'at_risk',
    progress: 55,
    healthScore: 72,
    healthHistory: [85, 84, 82, 80, 78, 75, 74, 76, 75, 73, 72, 72, 72, 72],
    owner: 'tm-1',
    startDate: '2026-03-01',
    plannedEndDate: '2026-10-31',
    baselineEndDate: '2026-10-31',
    estimatedEndDate: '2026-11-15',
    color: '#4F46E5',
    icon: 'FolderKanban',
    budget: 500000,
    actualSpending: 285000,
    notionLink: 'https://notion.so/cosmora-ai',
    driveLink: 'https://drive.google.com/cosmora',
    workstreams: [
      {
        id: 'ws-1',
        projectId: 'proj-1',
        name: 'Product Development',
        sector: 'Development',
        milestones: [
          {
            id: 'ms-1',
            workstreamId: 'ws-1',
            projectId: 'proj-1',
            name: 'CRM Dashboard MVP',
            description: 'Complete the analytics dashboard with filtering capabilities',
            plannedStart: '2026-09-01',
            plannedEnd: '2026-10-15',
            weight: 40,
            status: 'needs_attention',
            progress: 72,
            owner: 'tm-2',
            dependencies: [],
          },
          {
            id: 'ms-2',
            workstreamId: 'ws-1',
            projectId: 'proj-1',
            name: 'AI Integration Module',
            description: 'Integrate intelligent insights and recommendations',
            plannedStart: '2026-10-16',
            plannedEnd: '2026-12-31',
            weight: 60,
            status: 'planning',
            progress: 30,
            owner: 'tm-1',
            dependencies: ['ms-1'],
          },
        ],
      },
    ],
    updateHistory: [
      {
        id: 'puh-1',
        date: '2026-09-30',
        progress: 55,
        status: 'at_risk',
        doneToday: 'Completed date range filter components for dashboard',
        blocked: 'Blocked on AI performance evaluation data',
        nextUp: 'Finalize segment filtering logic',
        confidence: 'Medium',
        updatedBy: 'tm-2',
      },
    ],
    createdAt: '2026-03-01T00:00:00Z',
    updatedAt: '2026-09-30T00:00:00Z',
  },
  {
    id: 'proj-2',
    name: 'Origna',
    description: 'Premium branding and e-commerce design platform.',
    priority: 'P2',
    status: 'on_track',
    progress: 65,
    healthScore: 88,
    healthHistory: [70, 72, 75, 78, 80, 82, 85, 86, 88, 88, 88, 88, 88, 88],
    owner: 'tm-1',
    startDate: '2026-04-15',
    plannedEndDate: '2026-11-30',
    baselineEndDate: '2026-11-30',
    color: '#0EA5E9',
    icon: 'FolderKanban',
    budget: 300000,
    actualSpending: 178000,
    workstreams: [
      {
        id: 'ws-2',
        projectId: 'proj-2',
        name: 'Brand & UX',
        sector: 'UX',
        milestones: [
          {
            id: 'ms-3',
            workstreamId: 'ws-2',
            projectId: 'proj-2',
            name: 'Website Launch',
            description: 'Complete Origna website with all product pages',
            plannedStart: '2026-09-01',
            plannedEnd: '2026-11-30',
            weight: 50,
            status: 'on_track',
            progress: 68,
            owner: 'tm-3',
            dependencies: [],
          },
        ],
      },
    ],
    updateHistory: [],
    createdAt: '2026-04-15T00:00:00Z',
    updatedAt: '2026-09-30T00:00:00Z',
  },
  {
    id: 'proj-3',
    name: 'Deepfold Labs',
    description: 'Parent company operations, strategy, coordination, and shared infrastructure.',
    priority: 'P3',
    status: 'needs_attention',
    progress: 40,
    healthScore: 78,
    healthHistory: [80, 80, 79, 78, 78, 78, 78, 78, 78, 78, 78, 78, 78, 78],
    owner: 'tm-1',
    startDate: '2026-01-01',
    plannedEndDate: '2026-12-31',
    baselineEndDate: '2026-12-31',
    color: '#10B981',
    icon: 'FolderKanban',
    budget: 200000,
    actualSpending: 92000,
    workstreams: [],
    updateHistory: [],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-09-30T00:00:00Z',
  },
  {
    id: 'proj-4',
    name: 'Luxora',
    description: 'Luxury lifestyle recommendation engine (Paused).',
    priority: 'P4',
    status: 'on_hold',
    progress: 25,
    healthScore: 85,
    healthHistory: [85, 85, 85, 85, 85],
    owner: 'tm-1',
    startDate: '2026-02-01',
    plannedEndDate: '2026-12-31',
    baselineEndDate: '2026-12-31',
    color: '#8B5CF6',
    icon: 'FolderKanban',
    budget: 150000,
    actualSpending: 45000,
    workstreams: [],
    updateHistory: [],
    createdAt: '2026-02-01T00:00:00Z',
    updatedAt: '2026-09-30T00:00:00Z',
  },
  {
    id: 'proj-5',
    name: 'Trukky AI',
    description: 'Automated logistics & freight intelligence engine (Paused).',
    priority: 'P4',
    status: 'on_hold',
    progress: 15,
    healthScore: 82,
    healthHistory: [82, 82, 82, 82, 82],
    owner: 'tm-1',
    startDate: '2026-03-15',
    plannedEndDate: '2026-12-31',
    baselineEndDate: '2026-12-31',
    color: '#F59E0B',
    icon: 'FolderKanban',
    budget: 180000,
    actualSpending: 30000,
    workstreams: [],
    updateHistory: [],
    createdAt: '2026-03-15T00:00:00Z',
    updatedAt: '2026-09-30T00:00:00Z',
  },
];

const DEMO_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Complete Analytics Dashboard Filters',
    description: 'Implement advanced filtering for the CRM analytics dashboard.',
    projectId: 'proj-1',
    milestoneId: 'ms-1',
    workstreamId: 'ws-1',
    status: 'in_progress',
    priority: 'P1',
    assignee: 'tm-2',
    reporter: 'tm-1',
    dueDate: '2026-10-05',
    startDate: '2026-09-20',
    sector: 'Development',
    effortHours: 18,
    dependencies: [],
    unlocks: ['task-4'],
    carriedOverCount: 0,
    subtasks: [
      { id: 'st-1', title: 'Design filter UI components', completed: true },
      { id: 'st-2', title: 'Implement date range picker', completed: true },
      { id: 'st-3', title: 'Add segment filtering logic', completed: false },
    ],
    comments: [],
    createdAt: '2026-09-15T00:00:00Z',
    updatedAt: '2026-09-30T00:00:00Z',
  },
  {
    id: 'task-2',
    title: 'Finalize Origna Product Listing UX',
    description: 'Complete the product listing page design and handoff.',
    projectId: 'proj-2',
    milestoneId: 'ms-3',
    workstreamId: 'ws-2',
    status: 'in_review',
    priority: 'P2',
    assignee: 'tm-3',
    reporter: 'tm-2',
    dueDate: '2026-10-08',
    startDate: '2026-09-15',
    sector: 'UX',
    effortHours: 14,
    dependencies: [],
    unlocks: ['task-5'],
    carriedOverCount: 0,
    subtasks: [],
    comments: [],
    createdAt: '2026-09-10T00:00:00Z',
    updatedAt: '2026-09-30T00:00:00Z',
  },
  {
    id: 'task-4',
    title: 'Review AI Performance Metrics',
    description: 'Evaluate model accuracy for CRM insights module.',
    projectId: 'proj-1',
    milestoneId: 'ms-2',
    workstreamId: 'ws-1',
    status: 'blocked',
    priority: 'P1',
    assignee: 'tm-1',
    reporter: 'tm-2',
    dueDate: '2026-10-12',
    sector: 'Research',
    effortHours: 12,
    dependencies: ['task-1'],
    unlocks: [],
    blockerNote: 'Blocked until analytics dashboard filters are complete.',
    carriedOverCount: 1,
    subtasks: [],
    comments: [],
    createdAt: '2026-09-20T00:00:00Z',
    updatedAt: '2026-09-30T00:00:00Z',
  },
  {
    id: 'task-5',
    title: 'Deepfold Shared Infrastructure Audit',
    description: 'Review cross-project server configurations and security policies.',
    projectId: 'proj-3',
    status: 'in_progress',
    priority: 'P3',
    assignee: 'tm-4',
    reporter: 'tm-1',
    dueDate: '2026-10-15',
    startDate: '2026-09-25',
    sector: 'Ops',
    effortHours: 16,
    dependencies: [],
    unlocks: [],
    carriedOverCount: 0,
    subtasks: [],
    comments: [],
    createdAt: '2026-09-25T00:00:00Z',
    updatedAt: '2026-09-30T00:00:00Z',
  },
];

const DEMO_EXPENSES: Expense[] = [
  {
    id: 'exp-1',
    projectId: 'proj-1',
    description: 'Cloud Infrastructure (AWS)',
    amount: 45000,
    currency: 'INR',
    date: '2026-09-28',
    category: 'Infrastructure',
    vendor: 'AWS',
    paymentStatus: 'paid',
    approvalStatus: 'approved',
    approvedBy: 'tm-1',
    createdAt: '2026-09-28T00:00:00Z',
  },
  {
    id: 'exp-2',
    projectId: 'proj-2',
    description: 'Design Tools (Figma)',
    amount: 12000,
    currency: 'INR',
    date: '2026-09-29',
    category: 'Software',
    vendor: 'Figma',
    paymentStatus: 'paid',
    approvalStatus: 'approved',
    approvedBy: 'tm-1',
    createdAt: '2026-09-29T00:00:00Z',
  },
];

const DEMO_REVENUE: Revenue[] = [
  {
    id: 'rev-1',
    projectId: 'proj-2',
    description: 'Origna Consulting Retainer',
    amount: 120000,
    currency: 'INR',
    date: '2026-09-25',
    status: 'received',
    source: 'Client Retainer',
  },
];

const DEMO_BUDGETS: Budget[] = [
  { id: 'bud-1', projectId: 'proj-1', allocatedAmount: 500000, spentAmount: 285000, forecastedAmount: 520000, currency: 'INR', period: '2026-FY' },
  { id: 'bud-2', projectId: 'proj-2', allocatedAmount: 300000, spentAmount: 178000, forecastedAmount: 290000, currency: 'INR', period: '2026-FY' },
  { id: 'bud-3', projectId: 'proj-3', allocatedAmount: 200000, spentAmount: 92000, forecastedAmount: 195000, currency: 'INR', period: '2026-FY' },
  { id: 'bud-4', projectId: 'proj-4', allocatedAmount: 150000, spentAmount: 45000, forecastedAmount: 150000, currency: 'INR', period: '2026-FY' },
  { id: 'bud-5', projectId: 'proj-5', allocatedAmount: 180000, spentAmount: 30000, forecastedAmount: 180000, currency: 'INR', period: '2026-FY' },
];

const DEMO_CALENDAR: CalendarEvent[] = [
  {
    id: 'cal-1',
    title: 'Cosmora AI Sprint Review',
    description: 'Bi-weekly sprint review and planning session.',
    date: '2026-10-04',
    time: '10:00',
    type: 'meeting',
    projectId: 'proj-1',
    color: '#4F46E5',
    attendees: ['tm-1', 'tm-2'],
  },
  {
    id: 'cal-2',
    title: 'CRM Dashboard MVP Deadline',
    description: 'Milestone target date.',
    date: '2026-10-15',
    type: 'deadline',
    projectId: 'proj-1',
    color: '#EF4444',
    attendees: [],
  },
];

const DEMO_REMINDERS: Reminder[] = [
  {
    id: 'rem-1',
    title: 'Follow up on Cosmora AI milestone',
    description: 'CRM Dashboard MVP deadline is approaching.',
    dateTime: '2026-10-04T09:00:00Z',
    projectId: 'proj-1',
    priority: 'P1',
    level: 'normal',
    acknowledged: false,
    owner: 'tm-2',
  },
];

const DEMO_NOTES: Note[] = [
  {
    id: 'note-1',
    title: 'Cosmora AI Architecture Decision',
    content: 'Decided to use microservices architecture for the insights engine.',
    type: 'decision',
    projectId: 'proj-1',
    tags: ['architecture'],
    createdBy: 'tm-1',
    createdAt: '2026-09-15T00:00:00Z',
    updatedAt: '2026-09-15T00:00:00Z',
  },
];

const DEMO_DECISIONS: Decision[] = [
  {
    id: 'dec-1',
    title: 'Choose Cloud Host Provider',
    description: 'Select between AWS, GCP, or Hetzner for the Cosmora core deployment.',
    context: 'We need high uptime and low API latency.',
    owner: 'tm-1',
    deadline: '2026-10-10',
    projectId: 'proj-1',
    impact: 'Determines monthly infrastructure burn.',
    status: 'pending',
    createdAt: '2026-09-25T00:00:00Z',
  },
];

const DEMO_UPDATES: UpdateEntry[] = [
  {
    id: 'upd-1',
    content: 'Completed date range filter components for Cosmora dashboard.',
    source: 'whatsapp',
    projectId: 'proj-1',
    teamMemberId: 'tm-2',
    createdBy: 'tm-2',
    createdAt: '2026-09-30T09:30:00Z',
    tags: ['progress'],
  },
];

// ============================================================
// STORE INTERFACE & IMPLEMENTATION
// ============================================================

interface AppState {
  // Roles & Permissions
  currentUserId: string;
  userRole: UserRole; // 'owner' | 'member'
  financeUnlocked: boolean;

  // Navigation
  activePage: string;
  activeProjectId: string | null;
  sidebarCollapsed: boolean;

  // Data
  projects: Project[];
  tasks: Task[];
  teamMembers: TeamMember[];
  expenses: Expense[];
  revenues: Revenue[];
  budgets: Budget[];
  calendarEvents: CalendarEvent[];
  reminders: Reminder[];
  notes: Note[];
  decisions: Decision[];
  updates: UpdateEntry[];

  // Reminder modal
  activeReminder: Reminder | null;

  // Actions
  setUserRole: (role: UserRole) => void;
  toggleFinanceUnlocked: () => void;
  setActivePage: (page: string) => void;
  setActiveProjectId: (id: string | null) => void;
  toggleSidebar: () => void;

  // Crud actions
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'workstreams' | 'healthScore' | 'healthHistory' | 'baselineEndDate' | 'updateHistory'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  updateTeamMember: (id: string, updates: Partial<TeamMember>) => void;
  addTeamMember: (member: Omit<TeamMember, 'id' | 'joinedDate'>) => void;
  deleteTeamMember: (id: string) => void;

  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'comments' | 'subtasks'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;

  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  addDecision: (decision: Omit<Decision, 'id' | 'createdAt'>) => void;
  updateDecision: (id: string, updates: Partial<Decision>) => void;
  addUpdate: (update: Omit<UpdateEntry, 'id' | 'createdAt'>) => void;

  addCalendarEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  addReminder: (reminder: Omit<Reminder, 'id'>) => void;
  acknowledgeReminder: (id: string) => void;
  snoozeReminder: (id: string, minutes: number) => void;
  setActiveReminder: (reminder: Reminder | null) => void;

  getDashboardMetrics: () => DashboardMetrics;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUserId: 'tm-2',
      userRole: 'member', // Meghna by default
      financeUnlocked: false, // Locked by default for Meghna as per spec

      activePage: 'dashboard',
      activeProjectId: null,
      sidebarCollapsed: false,

      projects: DEMO_PROJECTS,
      tasks: DEMO_TASKS,
      teamMembers: DEMO_TEAM,
      expenses: DEMO_EXPENSES,
      revenues: DEMO_REVENUE,
      budgets: DEMO_BUDGETS,
      calendarEvents: DEMO_CALENDAR,
      reminders: DEMO_REMINDERS,
      notes: DEMO_NOTES,
      decisions: DEMO_DECISIONS,
      updates: DEMO_UPDATES,

      activeReminder: null,

      setUserRole: (role) => set({ userRole: role, financeUnlocked: role === 'owner' }),
      toggleFinanceUnlocked: () => set((s) => ({ financeUnlocked: !s.financeUnlocked })),

      setActivePage: (page) => set({ activePage: page, activeProjectId: null }),
      setActiveProjectId: (id) => set({ activeProjectId: id, activePage: 'project-detail' }),
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

      addProject: (p) =>
        set((s) => {
          const newProj: Project = {
            ...p,
            id: `proj-${genId()}`,
            healthScore: 90,
            healthHistory: [90, 90, 90, 90, 90],
            baselineEndDate: p.plannedEndDate,
            workstreams: [],
            updateHistory: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          return { projects: [...s.projects, newProj] };
        }),

      updateProject: (id, updates) =>
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
          ),
        })),

      deleteProject: (id) =>
        set((s) => ({
          projects: s.projects.filter((p) => p.id !== id),
          tasks: s.tasks.filter((t) => t.projectId !== id),
        })),

      updateTeamMember: (id, updates) =>
        set((s) => ({
          teamMembers: s.teamMembers.map((m) => (m.id === id ? { ...m, ...updates } : m)),
        })),
      addTeamMember: (member) =>
        set((s) => ({
          teamMembers: [
            ...s.teamMembers,
            {
              ...member,
              id: `tm-${genId()}`,
              joinedDate: new Date().toISOString().split('T')[0],
            },
          ],
        })),



      deleteTeamMember: (id) => set((s) => ({ teamMembers: s.teamMembers.filter((m) => m.id !== id) })),

      addTask: (task) =>
        set((s) => ({
          tasks: [
            ...s.tasks,
            {
              ...task,
              id: `task-${genId()}`,
              subtasks: [],
              comments: [],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
        })),

      updateTask: (id, updates) =>
        set((s) => ({
          tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t)),
        })),

      deleteTask: (id) =>
        set((s) => ({
          tasks: s.tasks.filter((t) => t.id !== id),
        })),

      addExpense: (exp) =>
        set((s) => ({
          expenses: [...s.expenses, { ...exp, id: `exp-${genId()}`, createdAt: new Date().toISOString() }],
        })),

      addNote: (n) =>
        set((s) => ({
          notes: [
            ...s.notes,
            {
              ...n,
              id: `note-${genId()}`,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
        })),

      addDecision: (d) =>
        set((s) => ({
          decisions: [...s.decisions, { ...d, id: `dec-${genId()}`, createdAt: new Date().toISOString() }],
        })),

      updateDecision: (id, updates) =>
        set((s) => ({
          decisions: s.decisions.map((d) => (d.id === id ? { ...d, ...updates } : d)),
        })),

      addUpdate: (u) =>
        set((s) => ({
          updates: [...s.updates, { ...u, id: `upd-${genId()}`, createdAt: new Date().toISOString() }],
        })),

      addCalendarEvent: (ev) =>
        set((s) => ({
          calendarEvents: [...s.calendarEvents, { ...ev, id: `cal-${genId()}` }],
        })),

      addReminder: (r) =>
        set((s) => ({
          reminders: [...s.reminders, { ...r, id: `rem-${genId()}` }],
        })),

      acknowledgeReminder: (id) =>
        set((s) => ({
          reminders: s.reminders.map((r) => (r.id === id ? { ...r, acknowledged: true } : r)),
          activeReminder: null,
        })),

      snoozeReminder: (id, minutes) =>
        set((s) => ({
          activeReminder: null,
        })),

      setActiveReminder: (r) => set({ activeReminder: r }),

      getDashboardMetrics: () => {
        const { projects, tasks, expenses, revenues, budgets, decisions } = get();
        const todayStr = new Date().toISOString().split('T')[0];

        const activeProjects = projects.filter((p) => p.status !== 'completed' && p.status !== 'archived').length;
        const projectsAtRisk = projects.filter((p) => p.status === 'at_risk' || p.status === 'delayed').length;
        const overdueTasks = tasks.filter((t) => t.dueDate < todayStr && t.status !== 'completed').length;
        const tasksDueToday = tasks.filter((t) => t.dueDate === todayStr && t.status !== 'completed').length;
        const pendingDecisions = decisions.filter((d) => d.status === 'pending').length;

        const totalAllocated = budgets.reduce((s, b) => s + b.allocatedAmount, 0);
        const totalSpent = budgets.reduce((s, b) => s + b.spentAmount, 0);
        const budgetUtilization = totalAllocated > 0 ? Math.round((totalSpent / totalAllocated) * 100) : 0;

        const totalSpendingThisMonth = expenses.reduce((s, e) => s + e.amount, 0);
        const revenueThisMonth = revenues.reduce((s, r) => s + r.amount, 0);

        return {
          activeProjects,
          projectsAtRisk,
          overdueTasks,
          tasksDueToday,
          pendingDecisions,
          budgetUtilization,
          totalSpendingThisMonth,
          revenueThisMonth,
        };
      },
    }),
    { name: 'executive-command-center-store' }
  )
);
