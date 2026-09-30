'use client';

import React, { useState } from 'react';
import { useAppStore, calculateProjectHealth } from '@/store';
import { PieChart } from '@/components/Charts';
import ExplainNumberModal, { ExplainData } from '@/components/ExplainNumberModal';
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
  ShieldCheck,
  PauseCircle,
  Info,
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

  // Project Filter: 'all' or specific projectId
  const [hubProjectFilter, setHubProjectFilter] = useState<string>('all');

  // Explain This Number Modal State
  const [explainData, setExplainData] = useState<ExplainData | null>(null);
  const [isExplainOpen, setIsExplainOpen] = useState(false);

  // Confetti Win Burst trigger state
  const [showWinBurst, setShowWinBurst] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];

  const pendingDecisionsList = decisions.filter((d) => d.status === 'pending');
  const overdueTasksList = tasks.filter(
    (t) => t.dueDate < todayStr && t.status !== 'completed' && t.status !== 'cancelled'
  );

  // Projects to render in Executive Hub
  const hubProjects =
    hubProjectFilter === 'all'
      ? projects
      : projects.filter((p) => p.id === hubProjectFilter);

  // Handle Mark Task Completed with Win Burst
  const handleTaskComplete = (taskId: string, isP1: boolean) => {
    updateTask(taskId, { status: 'completed' });
    if (isP1) {
      setShowWinBurst(true);
      setTimeout(() => setShowWinBurst(false), 3000);
    }
  };

  // Trigger Explain Number for Health Score
  const openHealthExplain = (projId: string) => {
    const proj = projects.find((p) => p.id === projId);
    if (!proj) return;
    const hb = calculateProjectHealth(proj, tasks);

    setExplainData({
      title: `${proj.name} Health Score Breakdown`,
      value: hb.score,
      unit: '/ 100',
      formula: 'Health = 100 - (ScheduleGap + Overdue + Backlog + Blockers + MissedMilestones + BudgetBurn)',
      description: hb.explanation,
      breakdown: [
        { label: 'Schedule Gap Penalty', value: `-${hb.scheduleGapPenalty}`, detail: `Status: ${proj.status}`, status: hb.scheduleGapPenalty > 0 ? 'warning' : 'good' },
        { label: 'Overdue Tasks Penalty', value: `-${hb.overduePenalty}`, detail: 'Overdue task count penalty', status: hb.overduePenalty > 0 ? 'bad' : 'good' },
        { label: 'Backlog Growth Penalty', value: `-${hb.backlogGrowthPenalty}`, detail: 'High unstarted task accumulation', status: hb.backlogGrowthPenalty > 0 ? 'warning' : 'good' },
        { label: 'Blocker Penalty', value: `-${hb.blockerPenalty}`, detail: 'Active blocked work items', status: hb.blockerPenalty > 0 ? 'bad' : 'good' },
        { label: 'Missed Milestones', value: `-${hb.missedMilestonesPenalty}`, detail: 'Milestones past planned date', status: hb.missedMilestonesPenalty > 0 ? 'bad' : 'good' },
        { label: 'Budget Burn Penalty', value: `-${hb.budgetBurnPenalty}`, detail: 'Spending exceeding allocated budget', status: hb.budgetBurnPenalty > 0 ? 'bad' : 'good' },
      ],
      relatedTasks: tasks.filter((t) => t.projectId === proj.id && t.status !== 'completed'),
    });
    setIsExplainOpen(true);
  };

  // Trigger Explain Number for Utilization Efficiency
  const openUtilizationExplain = () => {
    const totalAllocated = budgets.reduce((s, b) => s + b.allocatedAmount, 0);
    const totalSpent = budgets.reduce((s, b) => s + b.spentAmount, 0);

    setExplainData({
      title: 'Budget Utilization Efficiency Formula',
      value: `${metrics.budgetUtilization}%`,
      unit: 'Utilization',
      formula: 'Utilization % = (Total Actual Spent / Total Allocated Budget) * 100',
      description: 'Calculates the proportion of allocated company capital currently utilized across all active FY2026 projects.',
      breakdown: [
        { label: 'Total Allocated FY2026 Capital', value: `₹${totalAllocated.toLocaleString()}`, detail: 'Combined budget across 5 projects', status: 'good' },
        { label: 'Total Actual Capital Spent', value: `₹${totalSpent.toLocaleString()}`, detail: 'Recorded paid & approved expenses', status: 'neutral' },
        { label: 'Remaining Capital Cushion', value: `₹${(totalAllocated - totalSpent).toLocaleString()}`, detail: 'Available runway for operational execution', status: 'good' },
      ],
    });
    setIsExplainOpen(true);
  };

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
    { label: 'On Hold (Paused)', value: statusCounts.on_hold, color: '#94A3B8' },
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

  // Today's Mission Priorities
  const p1Tasks = tasks.filter((t) => t.priority === 'P1' && t.status !== 'completed');
  const missionCompletedCount = tasks.filter((t) => t.priority === 'P1' && t.status === 'completed').length;
  const missionTotalCount = p1Tasks.length + missionCompletedCount;
  const missionPercent = missionTotalCount > 0 ? Math.round((missionCompletedCount / missionTotalCount) * 100) : 100;

  return (
    <div className="space-y-6 relative">
      {/* Win Burst Banner */}
      {showWinBurst && (
        <div className="bg-gradient-to-r from-amber-500 via-emerald-500 to-indigo-600 text-white p-4 rounded-2xl shadow-xl flex items-center justify-between animate-bounce">
          <div className="flex items-center gap-3">
            <Sparkles size={24} className="animate-spin" />
            <div>
              <div className="font-extrabold text-sm">🎉 P1 Goal Completed!</div>
              <div className="text-xs opacity-90">Momentum streak updated! Great progress towards company goals.</div>
            </div>
          </div>
          <button onClick={() => setShowWinBurst(false)} className="text-white/80 hover:text-white text-xs font-bold px-2 py-1">
            Dismiss
          </button>
        </div>
      )}

      {/* REQ #4: TODAY'S MISSION & MOMENTUM STREAK HERO CARD */}
      <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 text-white p-6 rounded-2xl shadow-md border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <Zap size={14} /> Morning Executive Ritual
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight mt-1">Today's Operating Mission</h1>
            <p className="text-slate-400 text-xs mt-1 max-w-xl">
              Focus on the high-impact deliverables required to advance company projects today.
            </p>
          </div>

          <div className="flex items-center gap-4 self-start md:self-auto">
            {/* Flame Streak Badge */}
            <div className="bg-slate-800/80 border border-slate-700/80 px-3 py-2 rounded-xl flex items-center gap-2">
              <Flame size={20} className="text-amber-500 animate-pulse" />
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">Momentum Streak</div>
                <div className="text-xs font-extrabold text-amber-400">14 Days (0 P1 Delays)</div>
              </div>
            </div>

            {/* Mission Progress Ring Box */}
            <div className="bg-slate-800/80 border border-slate-700/80 px-4 py-2 rounded-xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border-4 border-indigo-500 border-t-emerald-400 flex items-center justify-center font-extrabold text-xs">
                {missionPercent}%
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">P1 Targets Done</div>
                <div className="text-xs font-bold text-slate-200">
                  {missionCompletedCount} of {missionTotalCount} Completed
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Top Priority Items for Today */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {p1Tasks.slice(0, 3).map((t) => (
            <div key={t.id} className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-3 space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-mono text-amber-400 font-bold uppercase">{t.priority} • {t.sector}</span>
                  <span className="text-slate-400 text-[10px]">Due {t.dueDate}</span>
                </div>
                <div className="font-bold text-xs text-slate-100 mt-1 line-clamp-2">{t.title}</div>
              </div>

              <button
                onClick={() => handleTaskComplete(t.id, true)}
                className="w-full mt-2 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <CheckCircle2 size={13} /> Mark P1 Complete
              </button>
            </div>
          ))}

          {p1Tasks.length === 0 && (
            <div className="col-span-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl p-4 text-center text-xs text-emerald-300 font-semibold">
              🎉 All P1 priority targets for today are completed! Team momentum is strong.
            </div>
          )}
        </div>
      </div>

      {/* EXECUTIVE STANDUP & FORWARD MOMENTUM HUB */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Zap className="text-amber-500" size={20} />
              Executive Daily Standup & Forward Momentum Hub
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Structured, project-segregated operating picture: Yesterday's updates, today's goals, active momentum & delays.
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
              All Projects ({projects.length})
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

            const isPaused = proj.status === 'on_hold';

            return (
              <div
                key={proj.id}
                className={`border rounded-xl p-5 space-y-4 shadow-xs transition-all ${
                  isPaused ? 'bg-slate-100/70 border-slate-300 opacity-80' : 'bg-slate-50/80 border-slate-200'
                }`}
              >
                {/* Project Header Strip */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-3.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: proj.color }} />
                    <h3 className="text-base font-extrabold text-slate-900">{proj.name}</h3>
                    
                    <span
                      className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase flex items-center gap-1 ${
                        proj.status === 'on_track'
                          ? 'bg-emerald-100 text-emerald-800'
                          : proj.status === 'at_risk'
                          ? 'bg-amber-100 text-amber-800'
                          : proj.status === 'on_hold'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {isPaused && <PauseCircle size={11} />}
                      {proj.status.replace('_', ' ')}
                    </span>

                    {/* Clickable Health Chip (Explain Number) */}
                    <button
                      onClick={() => openHealthExplain(proj.id)}
                      className="px-2 py-0.5 rounded-md bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 text-[11px] font-bold flex items-center gap-1 transition-colors"
                      title="Click to explain health score formula"
                    >
                      Health: {proj.healthScore}/100 <Info size={11} />
                    </button>
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

                {/* 4 Columns Segregated for THIS Project */}
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
                              onClick={() => handleTaskComplete(t.id, t.priority === 'P1')}
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

      {/* KPI Metric Cards with Explain-This-Number Triggers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card border-l-4 border-l-indigo-600 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="stat-card-title">Portfolio Projects</span>
            <FolderKanban size={18} className="text-indigo-600" />
          </div>
          <div className="stat-card-value">{projects.length}</div>
          <div className="stat-card-subtitle text-slate-500">
            {metrics.projectsAtRisk > 0 ? (
              <span className="text-amber-600 font-bold">{metrics.projectsAtRisk} projects requiring attention</span>
            ) : (
              'All projects on schedule'
            )}
          </div>
        </div>

        <div className="stat-card border-l-4 border-l-amber-500 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="stat-card-title">Pending Decisions</span>
            <HelpCircle size={18} className="text-amber-500" />
          </div>
          <div className="stat-card-value text-amber-600">{pendingDecisionsList.length}</div>
          <div className="stat-card-subtitle text-slate-500">Awaiting leadership action</div>
        </div>

        <div className="stat-card border-l-4 border-l-rose-500 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="stat-card-title">Overdue Deliverables</span>
            <AlertTriangle size={18} className="text-rose-500" />
          </div>
          <div className="stat-card-value text-rose-600">{overdueTasksList.length}</div>
          <div className="stat-card-subtitle text-slate-500">Action items past due date</div>
        </div>

        <div
          onClick={openUtilizationExplain}
          className="stat-card border-l-4 border-l-emerald-600 cursor-pointer hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center justify-between">
            <span className="stat-card-title flex items-center gap-1">
              Monthly Capital Spent <Info size={12} className="text-emerald-600 group-hover:scale-110 transition-transform" />
            </span>
            <IndianRupee size={18} className="text-emerald-600" />
          </div>
          <div className="stat-card-value text-emerald-600">
            ₹{(metrics.totalSpendingThisMonth / 1000).toFixed(0)}k
          </div>
          <div className="stat-card-subtitle text-slate-500">
            Utilization efficiency <strong className="text-indigo-600">{metrics.budgetUtilization}%</strong> (Tap to explain)
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

      {/* Explain This Number Modal */}
      <ExplainNumberModal
        isOpen={isExplainOpen}
        onClose={() => setIsExplainOpen(false)}
        data={explainData}
      />
    </div>
  );
}
