'use client';

import React from 'react';
import { useAppStore } from '@/store';
import {
  BarChart3,
  TrendingUp,
  FolderKanban,
  CheckCircle2,
  Download,
  Printer,
  FileText,
} from 'lucide-react';

export default function ReportsPage() {
  const { projects, tasks, expenses, budgets, getDashboardMetrics } = useAppStore();

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
            Performance metrics, milestone completion rates, and capital utilization across company projects.
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
    </div>
  );
}
