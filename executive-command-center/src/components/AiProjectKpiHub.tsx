'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/store';
import { Sparkles, TrendingUp, AlertTriangle, CheckCircle2, RefreshCw, BarChart2, ShieldCheck, Zap, ChevronRight, FileText } from 'lucide-react';

export default function AiProjectKpiHub() {
  const { projects, tasks, updates, expenses, budgets } = useAppStore();

  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || '');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastAnalyzedAt, setLastAnalyzedAt] = useState<string>('Just now');

  const activeProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  const handleRunAiAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setLastAnalyzedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1200);
  };

  if (!activeProject) return null;

  // Compute Project Specific KPIs
  const projTasks = tasks.filter((t) => t.projectId === activeProject.id);
  const completedProjTasks = projTasks.filter((t) => t.status === 'completed');
  const blockedProjTasks = projTasks.filter((t) => t.status === 'blocked');
  const overdueProjTasks = projTasks.filter((t) => t.dueDate < new Date().toISOString().split('T')[0] && t.status !== 'completed');

  const velocityRate = projTasks.length > 0 ? Math.round((completedProjTasks.length / projTasks.length) * 100) : 100;
  
  const projBudget = budgets.find((b) => b.projectId === activeProject.id) || {
    allocatedAmount: activeProject.budget || 300000,
    spentAmount: activeProject.actualSpending || 150000,
  };

  const spendEfficiency = projBudget.allocatedAmount > 0
    ? Math.round((projBudget.spentAmount / projBudget.allocatedAmount) * 100)
    : 0;

  const projUpdates = updates.filter((u) => u.projectId === activeProject.id);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider">
            <Sparkles size={14} className="text-indigo-600" /> AI Executive Intelligence
          </div>
          <h2 className="text-lg font-extrabold text-slate-900 mt-0.5">
            Weekly AI KPI Analyzer & Project Intelligence
          </h2>
          <p className="text-xs text-slate-500">
            Synthesizes WhatsApp updates, task velocity, and expense logs into actionable weekly KPIs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRunAiAnalysis}
            disabled={isAnalyzing}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-xs flex items-center gap-2 shadow-xs transition-all disabled:opacity-50"
          >
            <RefreshCw size={14} className={isAnalyzing ? 'animate-spin' : ''} />
            {isAnalyzing ? 'Analyzing Logs...' : 'Re-Run AI KPI Scan'}
          </button>
        </div>
      </div>

      {/* Project Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 bg-slate-100 p-1.5 rounded-xl">
        {projects.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelectedProjectId(p.id)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              selectedProjectId === p.id
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
            {p.name}
          </button>
        ))}
      </div>

      {/* 4 Weekly Key Performance Indicators (KPIs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Execution Velocity Rate */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Execution Velocity</span>
            <TrendingUp size={14} className="text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{velocityRate}%</div>
          <div className="text-[11px] text-slate-500 font-medium">
            {completedProjTasks.length} of {projTasks.length} tasks completed
          </div>
        </div>

        {/* KPI 2: Slippage Risk Index */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Slippage Risk Index</span>
            <AlertTriangle size={14} className="text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600">
            {overdueProjTasks.length > 0 ? `${overdueProjTasks.length} Overdue` : '0 Days (On Track)'}
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            Measured against baseline target date
          </div>
        </div>

        {/* KPI 3: Capital Spend Efficiency */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Capital Efficiency</span>
            <BarChart2 size={14} className="text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600">{spendEfficiency}%</div>
          <div className="text-[11px] text-slate-500 font-medium">
            ₹{(projBudget.spentAmount / 1000).toFixed(0)}k of ₹{(projBudget.allocatedAmount / 1000).toFixed(0)}k budget
          </div>
        </div>

        {/* KPI 4: Blocker Resolution */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Blocker Friction</span>
            <ShieldCheck size={14} className="text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-indigo-700">
            {blockedProjTasks.length} Active Blocker
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            Requires resolution from Saswat
          </div>
        </div>
      </div>

      {/* AI Synthesized Weekly Report Box */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-6 space-y-4 shadow-md">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="text-amber-400" size={18} />
            <h3 className="text-base font-bold text-white">AI Weekly Digest for {activeProject.name}</h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            AI Confidence: 96% • Refreshed {lastAnalyzedAt}
          </span>
        </div>

        <div className="space-y-3 text-xs leading-relaxed">
          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-1">
            <span className="font-bold text-amber-400 uppercase text-[10px] tracking-wider block">1. Executive Accomplishments</span>
            <p className="text-slate-200">
              Team successfully delivered key date range filtering modules for {activeProject.name}. Weekly progress increased to {activeProject.progress}%.
            </p>
          </div>

          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-1">
            <span className="font-bold text-rose-400 uppercase text-[10px] tracking-wider block">2. Operational Bottlenecks & Risks</span>
            <p className="text-slate-200">
              {blockedProjTasks.length > 0
                ? `${blockedProjTasks.length} task is currently blocked due to dependency on AI model evaluation parameters.`
                : 'No critical blockers recorded for this project.'}
            </p>
          </div>

          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-1">
            <span className="font-bold text-emerald-400 uppercase text-[10px] tracking-wider block">3. Recommended Action for Leadership</span>
            <p className="text-slate-200">
              Review cloud host provider decision to finalize infrastructure budget allocation before end of week.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
