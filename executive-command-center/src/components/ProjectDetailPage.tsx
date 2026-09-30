'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/store';
import {
  FolderKanban,
  ArrowLeft,
  Calendar,
  IndianRupee,
  User,
  CheckCircle2,
  Layers,
  FileText,
  Plus,
} from 'lucide-react';

export default function ProjectDetailPage() {
  const {
    activeProjectId,
    projects,
    tasks,
    teamMembers,
    expenses,
    notes,
    setActivePage,
    updateProject,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'workstreams' | 'tasks' | 'finance' | 'notes'>('overview');

  const project = projects.find((p) => p.id === activeProjectId) || projects[0];

  const projectTasks = tasks.filter((t) => t.projectId === project.id);
  const projectExpenses = expenses.filter((e) => e.projectId === project.id);
  const totalExpense = projectExpenses.reduce((acc, e) => acc + e.amount, 0);
  const projectNotes = notes.filter((n) => n.projectId === project.id);

  const ownerName = teamMembers.find((m) => m.id === project.owner)?.name || 'Saswat Sahu';

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => setActivePage('projects')}
        className="text-xs text-slate-500 hover:text-slate-800 font-semibold flex items-center gap-1.5 transition-colors"
      >
        <ArrowLeft size={14} /> Back to Projects
      </button>

      {/* Hero Header Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden space-y-4">
        <div
          className="absolute top-0 left-0 w-2 h-full"
          style={{ backgroundColor: project.color }}
        />

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span
                className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase ${
                  project.status === 'on_track'
                    ? 'bg-emerald-100 text-emerald-800'
                    : project.status === 'at_risk'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {project.status.replace('_', ' ')}
              </span>

              <span className="text-xs font-semibold text-slate-500">
                Priority: {project.priority.replace('_', ' ').toUpperCase()}
              </span>
            </div>

            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{project.name}</h1>
            <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">{project.description}</p>
          </div>

          <button
            onClick={() => {
              const newProgress = Math.min(100, project.progress + 10);
              updateProject(project.id, { progress: newProgress });
            }}
            className="btn btn-secondary text-xs shrink-0"
          >
            +10% Progress
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-slate-100 text-xs">
          <div>
            <div className="text-slate-500 mb-1 font-medium">Progress ({project.progress}%)</div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
              <div
                className="h-full rounded-full bg-indigo-600"
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <User size={16} className="text-indigo-600 shrink-0" />
            <div>
              <div className="text-slate-500">Lead</div>
              <div className="font-bold text-slate-900">{ownerName}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-indigo-600 shrink-0" />
            <div>
              <div className="text-slate-500">Target End</div>
              <div className="font-bold text-slate-900">
                {project.estimatedEndDate || project.plannedEndDate || 'TBD'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <IndianRupee size={16} className="text-indigo-600 shrink-0" />
            <div>
              <div className="text-slate-500">Capital Spent</div>
              <div className="font-bold text-emerald-700">
                ₹{(totalExpense / 1000).toFixed(0)}k / ₹{((project.budget || 0) / 1000).toFixed(0)}k
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-t-lg text-xs font-bold transition-all ${
            activeTab === 'overview'
              ? 'bg-white text-slate-900 border-t border-x border-slate-200 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Overview & Milestones
        </button>

        <button
          onClick={() => setActiveTab('tasks')}
          className={`px-4 py-2 rounded-t-lg text-xs font-bold transition-all ${
            activeTab === 'tasks'
              ? 'bg-white text-slate-900 border-t border-x border-slate-200 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Tasks ({projectTasks.length})
        </button>

        <button
          onClick={() => setActiveTab('finance')}
          className={`px-4 py-2 rounded-t-lg text-xs font-bold transition-all ${
            activeTab === 'finance'
              ? 'bg-white text-slate-900 border-t border-x border-slate-200 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Expenses ({projectExpenses.length})
        </button>

        <button
          onClick={() => setActiveTab('notes')}
          className={`px-4 py-2 rounded-t-lg text-xs font-bold transition-all ${
            activeTab === 'notes'
              ? 'bg-white text-slate-900 border-t border-x border-slate-200 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Notes ({projectNotes.length})
        </button>
      </div>

      {/* TAB: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Layers size={18} className="text-indigo-600" />
              Active Milestones
            </h3>

            <div className="space-y-3">
              {project.workstreams
                .flatMap((ws) => ws.milestones)
                .map((ms) => (
                  <div key={ms.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900">{ms.name}</span>
                      <span className="text-indigo-600 font-bold">{ms.progress}%</span>
                    </div>
                    <p className="text-xs text-slate-600">{ms.description}</p>
                  </div>
                ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-600" />
              Recent Deliverables
            </h3>

            <div className="space-y-2">
              {projectTasks.map((t) => (
                <div key={t.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex justify-between">
                  <span className="font-medium text-slate-900">{t.title}</span>
                  <span className="font-bold uppercase text-slate-600">{t.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB: TASKS */}
      {activeTab === 'tasks' && (
        <div className="space-y-2">
          {projectTasks.map((t) => (
            <div key={t.id} className="bg-white border border-slate-200 p-4 rounded-xl flex items-center justify-between text-xs shadow-xs">
              <div>
                <h4 className="font-bold text-slate-900">{t.title}</h4>
                <p className="text-slate-500 text-[11px]">{t.description}</p>
              </div>
              <span className="bg-slate-100 px-2.5 py-1 rounded text-slate-800 font-bold uppercase">
                {t.status}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* TAB: FINANCE */}
      {activeTab === 'finance' && (
        <div className="space-y-2">
          {projectExpenses.map((e) => (
            <div key={e.id} className="bg-white border border-slate-200 p-4 rounded-xl flex items-center justify-between text-xs shadow-xs">
              <div>
                <h4 className="font-bold text-slate-900">{e.description}</h4>
                <div className="text-slate-500 text-[11px]">{e.category} • {e.date}</div>
              </div>
              <span className="font-mono text-emerald-700 font-bold text-sm">
                ₹{e.amount.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* TAB: NOTES */}
      {activeTab === 'notes' && (
        <div className="space-y-3">
          {projectNotes.map((n) => (
            <div key={n.id} className="bg-white border border-slate-200 p-4 rounded-xl text-xs space-y-1 shadow-xs">
              <h4 className="font-bold text-slate-900 text-sm">{n.title}</h4>
              <p className="text-slate-600 leading-relaxed">{n.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
