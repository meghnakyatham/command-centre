'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/store';
import AiProjectKpiHub from '@/components/AiProjectKpiHub';
import {
  BarChart3,
  TrendingUp,
  FolderKanban,
  CheckCircle2,
  Download,
  Printer,
  FileText,
  Sparkles,
  Flame,
  ChevronLeft,
  ChevronRight,
  Target,
  AlertTriangle,
  Zap,
} from 'lucide-react';

export default function ReportsPage() {
  const { projects, tasks, expenses, budgets, getDashboardMetrics } = useAppStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'ai-kpis'>('overview');
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);

  const metrics = getDashboardMetrics();

  const avgProgress =
    projects.length > 0
      ? Math.round(projects.reduce((acc, p) => acc + p.progress, 0) / projects.length)
      : 0;

  const totalBudget = budgets.reduce((acc, b) => acc + b.allocatedAmount, 0);
  const totalSpent = budgets.reduce((acc, b) => acc + b.spentAmount, 0);
  const budgetUtilization = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  const totalTasksCount = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const taskCompletionRate =
    totalTasksCount > 0 ? Math.round((completedTasks / totalTasksCount) * 100) : 0;

  const stories = [
    {
      title: "This Week's Executive Wins",
      badge: "Wins & Milestones",
      color: "from-indigo-600 to-purple-700",
      mainStat: `${completedTasks} Tasks Completed`,
      description: "CRM Analytics Dashboard Filters components finalized. Origna UX handoff reached 68% milestone progress.",
      icon: Sparkles,
    },
    {
      title: "Biggest Slip & Risk Factor",
      badge: "Risk & Delays",
      color: "from-amber-600 to-rose-700",
      mainStat: "Cosmora AI at Risk",
      description: "Blocked on AI performance evaluation data. Target finish date updated to Nov 15, 2026.",
      icon: AlertTriangle,
    },
    {
      title: "Best Day & Peak Velocity",
      badge: "Velocity",
      color: "from-emerald-600 to-teal-700",
      mainStat: "Wednesday (Sep 28)",
      description: "3 major code commits and ₹45k infrastructure expense approved without bottleneck.",
      icon: Flame,
    },
    {
      title: "Next Week's Primary Focus",
      badge: "Strategy",
      color: "from-slate-800 to-slate-900",
      mainStat: "AI Integration Module",
      description: "Unblock analytics filters, execute cloud provider decision, and disburse team payroll.",
      icon: Target,
    },
  ];

  const currentStory = stories[activeStoryIndex];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="text-indigo-600" size={26} />
            Executive Reports & Portfolio Analytics
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Performance metrics, AI weekly KPI digests, and capital utilization across company projects.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="btn btn-secondary flex items-center gap-2 text-xs"
          >
            <Printer size={14} /> Print Summary
          </button>
          <button className="btn btn-primary flex items-center gap-2 text-xs">
            <Download size={14} /> Export PDF
          </button>
        </div>
      </div>

      {/* TABS SWITCHER */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'overview'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <BarChart3 size={15} /> Portfolio Performance & Week Wrapped
        </button>

        <button
          onClick={() => setActiveTab('ai-kpis')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'ai-kpis'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Sparkles size={15} className="text-amber-400" /> AI Project KPI & Digest Engine
        </button>
      </div>

      {activeTab === 'ai-kpis' ? (
        <AiProjectKpiHub />
      ) : (
        <>
          {/* WEEK WRAPPED STORY CARDS */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles size={14} /> Weekly Ritual
                </div>
                <h2 className="text-lg font-extrabold text-slate-900">Monday "Week Wrapped" Executive Brief</h2>
              </div>

              {/* Story Navigation Controls */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">
                  {activeStoryIndex + 1} of {stories.length}
                </span>
                <button
                  onClick={() => setActiveStoryIndex((prev) => (prev > 0 ? prev - 1 : stories.length - 1))}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => setActiveStoryIndex((prev) => (prev < stories.length - 1 ? prev + 1 : 0))}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Story Card Box */}
            <div className={`bg-gradient-to-r ${currentStory.color} text-white p-6 rounded-2xl shadow-lg space-y-3 transition-all duration-300`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full backdrop-blur-xs">
                  {currentStory.badge}
                </span>
                <currentStory.icon size={24} className="text-white/80" />
              </div>

              <h3 className="text-xl font-black">{currentStory.title}</h3>
              <div className="text-3xl font-extrabold tracking-tight">{currentStory.mainStat}</div>
              <p className="text-xs text-white/90 leading-relaxed max-w-xl">{currentStory.description}</p>
            </div>
          </div>

          {/* Overview Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="stat-card border-l-4 border-l-indigo-600">
              <div className="stat-card-title">Portfolio Completion</div>
              <div className="stat-card-value text-indigo-600">{avgProgress}%</div>
              <div className="stat-card-subtitle">{projects.length} active initiatives</div>
            </div>

            <div className="stat-card border-l-4 border-l-emerald-600">
              <div className="stat-card-title">Task Completion Rate</div>
              <div className="stat-card-value text-emerald-600">{taskCompletionRate}%</div>
              <div className="stat-card-subtitle">
                {completedTasks} of {totalTasksCount} finished
              </div>
            </div>

            <div className="stat-card border-l-4 border-l-blue-600">
              <div className="stat-card-title">Capital Burn Efficiency</div>
              <div className="stat-card-value text-blue-600">{budgetUtilization}%</div>
              <div className="stat-card-subtitle">
                ₹{(totalSpent / 100000).toFixed(2)}L spent of ₹{(totalBudget / 100000).toFixed(2)}L
              </div>
            </div>

            <div className="stat-card border-l-4 border-l-amber-500">
              <div className="stat-card-title">Projects At Risk</div>
              <div className="stat-card-value text-amber-600">{metrics.projectsAtRisk}</div>
              <div className="stat-card-subtitle">Requiring review</div>
            </div>
          </div>

          {/* Project Matrix Table */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900">Project Performance Breakdown</h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px] font-bold">
                  <tr>
                    <th className="py-3.5 px-4">Project</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Progress</th>
                    <th className="py-3.5 px-4">Budget Spent</th>
                    <th className="py-3.5 px-4">Est. Target Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {projects.map((proj) => (
                    <tr key={proj.id} className="hover:bg-slate-50">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{proj.name}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            proj.status === 'on_track'
                              ? 'bg-emerald-100 text-emerald-800'
                              : proj.status === 'at_risk'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {proj.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-indigo-600">{proj.progress}%</td>
                      <td className="py-3.5 px-4 font-mono">
                        ₹{((proj.actualSpending || 0) / 1000).toFixed(0)}k / ₹
                        {((proj.budget || 0) / 1000).toFixed(0)}k
                      </td>
                      <td className="py-3.5 px-4">{proj.estimatedEndDate || proj.plannedEndDate || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
