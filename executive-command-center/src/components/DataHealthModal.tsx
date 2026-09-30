'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/store';
import { X, ShieldCheck, AlertTriangle, CheckCircle2, RefreshCw, Wrench, FileSearch } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function DataHealthModal({ isOpen, onClose }: Props) {
  const { tasks, projects, updateTask, updateProject } = useAppStore();
  const [fixedIds, setFixedIds] = useState<string[]>([]);

  if (!isOpen) return null;

  // Scan items
  const missingAssigneeTasks = tasks.filter((t) => !t.assignee);
  const missingDueDateTasks = tasks.filter((t) => !t.dueDate);
  const impossibleDateTasks = tasks.filter((t) => t.startDate && t.dueDate && t.startDate > t.dueDate);

  const duplicateTitles = tasks
    .map((t) => t.title)
    .filter((title, idx, self) => self.indexOf(title) !== idx);

  const projectsMissingMilestones = projects.filter((p) => !p.workstreams || p.workstreams.length === 0);

  const totalIssuesCount =
    missingAssigneeTasks.length +
    missingDueDateTasks.length +
    impossibleDateTasks.length +
    projectsMissingMilestones.length -
    fixedIds.length;

  const handleFixAll = () => {
    // Automatically set default dates / assignees for any missing items
    missingAssigneeTasks.forEach((t) => {
      updateTask(t.id, { assignee: 'tm-1' });
    });
    missingDueDateTasks.forEach((t) => {
      updateTask(t.id, { dueDate: new Date().toISOString().split('T')[0] });
    });
    impossibleDateTasks.forEach((t) => {
      updateTask(t.id, { startDate: t.dueDate });
    });
    setFixedIds(['fixed-all']);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
              <FileSearch size={22} />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-indigo-600">Automated Audit Scanner</div>
              <h3 className="text-lg font-extrabold text-slate-900">Data Health & Integrity Scan</h3>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100">
            <X size={20} />
          </button>
        </div>

        {/* Audit Status Pill */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-medium">Scanner Result</div>
            <div className="text-xl font-extrabold text-slate-900 mt-0.5">
              {totalIssuesCount <= 0 ? '100% Data Integrity' : `${totalIssuesCount} Integrity Flags Found`}
            </div>
          </div>
          {totalIssuesCount <= 0 ? (
            <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <ShieldCheck size={14} /> Clean Audit
            </span>
          ) : (
            <button
              onClick={handleFixAll}
              className="text-xs font-bold px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Wrench size={14} /> Auto-Fix All ({totalIssuesCount})
            </button>
          )}
        </div>

        {/* Audit Issues List */}
        <div className="space-y-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-600" /> Missing Assignees Check
              </div>
              <div className="text-slate-500 text-[11px]">
                {missingAssigneeTasks.length > 0 ? `${missingAssigneeTasks.length} unassigned tasks found` : 'All tasks assigned to team members'}
              </div>
            </div>
            <span className="font-mono font-bold text-slate-700">{missingAssigneeTasks.length} Flags</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-600" /> Due Date Validity Scan
              </div>
              <div className="text-slate-500 text-[11px]">
                {missingDueDateTasks.length > 0 ? `${missingDueDateTasks.length} tasks without valid dates` : 'All tasks have valid deadline dates'}
              </div>
            </div>
            <span className="font-mono font-bold text-slate-700">{missingDueDateTasks.length} Flags</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-600" /> Date Sequence Integrity
              </div>
              <div className="text-slate-500 text-[11px]">
                {impossibleDateTasks.length > 0 ? `${impossibleDateTasks.length} start dates after due date` : 'No date sequence conflicts detected'}
              </div>
            </div>
            <span className="font-mono font-bold text-slate-700">{impossibleDateTasks.length} Flags</span>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-slate-100 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-slate-900 text-white rounded-xl font-semibold text-xs hover:bg-slate-800">
            Close Audit
          </button>
        </div>
      </div>
    </div>
  );
}
