'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/store';
import { PieChart, HorizontalBarChart } from '@/components/Charts';
import {
  FolderKanban,
  AlertTriangle,
  Clock,
  HelpCircle,
  TrendingUp,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  IndianRupee,
  Layers,
  ChevronRight,
  FileText,
  PieChart as PieIcon,
  Plus,
  CheckSquare,
  User,
  Calendar,
  Sparkles,
  Zap,
  Check,
  History,
  Target,
  Flame,
  Filter,
} from 'lucide-react';

export default function DashboardPage() {
  const {
    projects,
    tasks,
    decisions,
    expenses,
    budgets,
    updates,
    getDashboardMetrics,
    setActivePage,
    setActiveProjectId,
    updateProject,
    updateTask,
  } = useAppStore();

  const metrics = getDashboardMetrics();

  // ADHD Hub Project Filter: 'all' or specific projectId
  const [hubProjectFilter, setHubProjectFilter] = useState<string>('all');

  // Selected Project for Deep Inspection Hub
  const [selectedHomeProjectId, setSelectedHomeProjectId] = useState<string>(
    projects[0]?.id || ''
  );

  const selectedProject = projects.find((p) => p.id === selectedHomeProjectId) || projects[0];
  const todayStr = new Date().toISOString().split('T')[0];

  const pendingDecisionsList = decisions.filter((d) => d.status === 'pending');
  const overdueTasksList = tasks.filter(
    (t) => t.dueDate < todayStr && t.status !== 'completed' && t.status !== 'cancelled'
  );

  // Projects to render in ADHD Executive Hub
  const hubProjects =
    hubProjectFilter === 'all'
      ? projects.slice(0, 3) // Top 3 main projects (Cosmora AI, Origna, Deepfold Labs)
      : projects.filter((p) => p.id === hubProjectFilter);

  // Chart Preparation
  const statusCounts = {
    on_track: projects.filter((p) => p.status === 'on_track').length,
    at_risk: projects.filter((p) => p.status === 'at_risk').length,
    delayed: projects.filter((p) => p.status === 'delayed').length,
    on_hold: projects.filter((p) => p.status === 'on_hold').length,
  };

  const projectStatusPieData = [
    { label: 'On Track', value: statusCounts.on_track, color: '#10B981' },
    { label: 'At Risk', value: statusCounts.at_risk, color: '#F59E0B' },
    { label: 'Delayed', value: statusCounts.delayed, color: '#EF4444' },
    { label: 'On Hold', value: statusCounts.on_hold, color: '#94A3B8' },
  ].filter((d) => d.value > 0);

  const taskStatusCounts = {
    completed: tasks.filter((t) => t.status === 'completed').length,
    in_progress: tasks.filter((t) => t.status === 'in_progress').length,
    blocked: tasks.filter((t) => t.status === 'blocked').length,
    planned: tasks.filter((t) => t.status === 'planned' || t.status === 'backlog').length,
  };

  const taskStatusPieData = [
    { label: 'Completed', value: taskStatusCounts.completed, color: '#10B981' },
    { label: 'In Progress', value: taskStatusCounts.in_progress, color: '#3B82F6' },
    { label: 'Blocked', value: taskStatusCounts.blocked, color: '#EF4444' },
    { label: 'Planned / Backlog', value: taskStatusCounts.planned, color: '#6366F1' },
  ].filter((d) => d.value > 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Executive Command Center
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Real-time operating picture for Saswat Sahu & Meghna Kyatham.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActivePage('tasks')}
            className="btn btn-secondary text-xs flex items-center gap-1.5"
          >
            <CheckSquare size={14} className="text-indigo-600" /> Deliverables ({tasks.length})
          </button>
          <button
            onClick={() => setActivePage('finance')}
            className="btn btn-primary text-xs flex items-center gap-1.5"
          >
            <IndianRupee size={14} /> Financials
          </button>
        </div>
      </div>

      {/* REQ #3: ADHD-FRIENDLY PROJECT-SEGREGATED EXECUTIVE STANDUP & MOMENTUM HUB */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Zap className="text-amber-500" size={20} />
              Executive Daily Standup & Forward Momentum Hub
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Structured, low-clutter, project-segregated operating picture: Yesterday's updates, today's goals, active momentum & risk delays.
            </p>
          </div>

          {/* Project Segregation Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setHubProjectFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                hubProjectFilter === 'all'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Projects
            </button>
            {projects.map((p) => (
              <button
                key={p.id}
                onClick={() => setHubProjectFilter(p.id)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  hubProjectFilter === p.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Project-Segregated Cards */}
        <div className="space-y-6">
          {hubProjects.map((proj) => {
            const projTasks = tasks.filter((t) => t.projectId === proj.id);
            const projUpdates = updates.filter((u) => u.projectId === proj.id);

            const todayProjTasks = projTasks.filter(
              (t) => (t.dueDate === todayStr || t.priority === 'P1') && t.status !== 'completed'
            );
            const overdueProjTasks = projTasks.filter(
              (t) => t.dueDate < todayStr && t.status !== 'completed'
            );
            const inProgressProjTasks = projTasks.filter(
              (t) => t.status === 'in_progress' || t.status === 'in_review'
            );
            const completedProjTasks = projTasks.filter((t) => t.status === 'completed');

            return (
              <div
                key={proj.id}
                className="bg-slate-50/80 border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs"
              >
                {/* Project Header Strip */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-3.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: proj.color }} />
                    <h3 className="text-base font-extrabold text-slate-900">{proj.name}</h3>
                    <span
                      className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                        proj.status === 'on_track'
                          ? 'bg-emerald-100 text-emerald-800'
                          : proj.status === 'at_risk'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {proj.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
                    <div>
                      Progress: <strong className="text-indigo-700">{proj.progress}%</strong>
                    </div>
                    <div>
                      Target: <strong className="text-slate-900">{proj.estimatedEndDate || proj.plannedEndDate || 'TBD'}</strong>
                    </div>
                  </div>
                </div>

                {/* 4 ADHD Columns Segregated for THIS Project */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  {/* Col 1: Today's Focus for this project */}
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between font-bold text-indigo-900 text-[11px] border-b border-slate-100 pb-1.5">
                      <span className="flex items-center gap-1">
                        <Target size={13} className="text-indigo-600" /> Today's Focus
                      </span>
                      <span className="bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded text-[10px]">
                        {todayProjTasks.length}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {todayProjTasks.length > 0 ? (
                        todayProjTasks.map((t) => (
                          <div key={t.id} className="p-2 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-[11px]">
                            <span className="font-semibold text-slate-900 line-clamp-1">{t.title}</span>
                            <button
                              onClick={() => updateTask(t.id, { status: 'completed' })}
                              className="text-slate-400 hover:text-emerald-600 shrink-0 ml-1"
                              title="Mark Complete"
                            >
                              <CheckCircle2 size={13} />
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="text-slate-400 text-[11px] py-2">No tasks due today.</div>
                      )}
                    </div>
                  </div>

                  {/* Col 2: Behind / Overdue for this project */}
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between font-bold text-rose-900 text-[11px] border-b border-slate-100 pb-1.5">
                      <span className="flex items-center gap-1">
                        <AlertTriangle size={13} className="text-rose-600" /> Behind / Overdue
                      </span>
                      <span className="bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded text-[10px]">
                        {overdueProjTasks.length}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {overdueProjTasks.length > 0 ? (
                        overdueProjTasks.map((t) => (
                          <div key={t.id} className="p-2 bg-rose-50 rounded-lg border border-rose-200 text-[11px]">
                            <div className="font-bold text-rose-900 line-clamp-1">{t.title}</div>
                            <div className="text-[10px] text-rose-600 font-semibold mt-0.5">Due: {t.dueDate}</div>
                          </div>
                        ))
                      ) : (
                        <div className="text-slate-400 text-[11px] py-2">🎉 No overdue delays!</div>
                      )}
                    </div>
                  </div>

                  {/* Col 3: Active Momentum for this project */}
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between font-bold text-emerald-900 text-[11px] border-b border-slate-100 pb-1.5">
                      <span className="flex items-center gap-1">
                        <Flame size={13} className="text-emerald-600" /> In Progress
                      </span>
                      <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded text-[10px]">
                        {inProgressProjTasks.length}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {inProgressProjTasks.length > 0 ? (
                        inProgressProjTasks.map((t) => (
                          <div key={t.id} className="p-2 bg-emerald-50/50 rounded-lg border border-emerald-200 text-[11px]">
                            <div className="font-semibold text-slate-900 line-clamp-1">{t.title}</div>
                            <div className="text-[10px] text-emerald-700 font-bold uppercase mt-0.5">{t.status}</div>
                          </div>
                        ))
                      ) : (
                        <div className="text-slate-400 text-[11px] py-2">No active tasks in progress.</div>
                      )}
                    </div>
                  </div>

                  {/* Col 4: Logged Activity for this project */}
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between font-bold text-slate-900 text-[11px] border-b border-slate-100 pb-1.5">
                      <span className="flex items-center gap-1">
                        <History size={13} className="text-indigo-600" /> Recent Activity
                      </span>
                      <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[10px]">
                        {completedProjTasks.length} Done
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {projUpdates.length > 0 ? (
                        projUpdates.slice(0, 2).map((u) => (
                          <div key={u.id} className="p-2 bg-slate-50 rounded-lg border border-slate-200 text-[11px] text-slate-700">
                            <div className="font-medium line-clamp-1">{u.content}</div>
                          </div>
                        ))
                      ) : (
                        <div className="text-slate-400 text-[11px] py-2">No recent log entries.</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card border-l-4 border-l-indigo-600">
          <div className="flex items-center justify-between">
            <span className="stat-card-title">Portfolio Projects</span>
            <FolderKanban size={18} className="text-indigo-600" />
          </div>
          <div className="stat-card-value">{projects.length}</div>
          <div className="stat-card-subtitle text-slate-500">
            {metrics.projectsAtRisk > 0 ? (
              <span className="text-amber-600 font-bold">{metrics.projectsAtRisk} projects at risk</span>
            ) : (
              'All projects on schedule'
            )}
          </div>
        </div>

        <div className="stat-card border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between">
            <span className="stat-card-title">Pending Decisions</span>
            <HelpCircle size={18} className="text-amber-500" />
          </div>
          <div className="stat-card-value text-amber-600">{pendingDecisionsList.length}</div>
          <div className="stat-card-subtitle text-slate-500">Awaiting leadership action</div>
        </div>

        <div className="stat-card border-l-4 border-l-rose-500">
          <div className="flex items-center justify-between">
            <span className="stat-card-title">Overdue Deliverables</span>
            <AlertTriangle size={18} className="text-rose-500" />
          </div>
          <div className="stat-card-value text-rose-600">{overdueTasksList.length}</div>
          <div className="stat-card-subtitle text-slate-500">Action items past due date</div>
        </div>

        <div className="stat-card border-l-4 border-l-emerald-600">
          <div className="flex items-center justify-between">
            <span className="stat-card-title">Monthly Capital Spent</span>
            <IndianRupee size={18} className="text-emerald-600" />
          </div>
          <div className="stat-card-value text-emerald-600">
            ₹{(metrics.totalSpendingThisMonth / 1000).toFixed(0)}k
          </div>
          <div className="stat-card-subtitle text-slate-500">
            Utilization efficiency {metrics.budgetUtilization}%
          </div>
        </div>
      </div>

      {/* Visualizations & Charts Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <PieIcon size={18} className="text-indigo-600" />
              Project Portfolio Health Breakdown
            </h2>
            <span className="text-xs text-slate-400">Status Ratio</span>
          </div>

          <PieChart
            data={projectStatusPieData}
            size={180}
            donut={true}
            centerText={`${projects.length}`}
            centerSubtitle="Total Projects"
          />
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <PieIcon size={18} className="text-emerald-600" />
              Task Execution Status Distribution
            </h2>
            <span className="text-xs text-slate-400">Deliverables Matrix</span>
          </div>

          <PieChart
            data={taskStatusPieData}
            size={180}
            donut={true}
            centerText={`${tasks.length}`}
            centerSubtitle="Total Tasks"
          />
        </div>
      </div>
    </div>
  );
}
