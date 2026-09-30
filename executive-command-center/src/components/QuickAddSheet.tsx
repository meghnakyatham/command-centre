'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/store';
import { Task, Sector, UpdateEntry } from '@/types';
import { X, Plus, CheckSquare, MessageSquare, FileText, Bell, Zap, Check } from 'lucide-react';

interface QuickAddSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickAddSheet({ isOpen, onClose }: QuickAddSheetProps) {
  const { projects, teamMembers, addTask, addUpdate, addNote, addReminder } = useAppStore();
  const [tab, setTab] = useState<'task' | 'whatsapp' | 'note' | 'reminder'>('task');

  // Task form
  const [taskTitle, setTaskTitle] = useState('');
  const [taskProjId, setTaskProjId] = useState(projects[0]?.id || '');
  const [taskAssignee, setTaskAssignee] = useState('tm-2');
  const [taskDueDate, setTaskDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [taskSector, setTaskSector] = useState<Sector>('Development');

  // WhatsApp Parser form
  const [waText, setWaText] = useState('');
  const [waSender, setWaSender] = useState('tm-2');
  const [waProjId, setWaProjId] = useState(projects[0]?.id || '');
  const [parsedItems, setParsedItems] = useState<{ done: string[]; inProgress: string[]; blocked: string[] } | null>(null);

  // Note form
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');

  // Reminder form
  const [remTitle, setRemTitle] = useState('');
  const [remDate, setRemDate] = useState(new Date().toISOString().split('T')[0]);

  if (!isOpen) return null;

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    addTask({
      title: taskTitle,
      description: '',
      projectId: taskProjId,
      assignee: taskAssignee,
      reporter: 'tm-1',
      priority: 'P1',
      status: 'planned',
      dueDate: taskDueDate,
      sector: taskSector,
      tags: ['deliverable'],
      dependencies: [],
      unlocks: [],
      carriedOverCount: 0,
    });

    setTaskTitle('');
    onClose();
  };

  const handleParseWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!waText.trim()) return;

    // Simple robust line parser
    const lines = waText.split('\n');
    const done: string[] = [];
    const inProgress: string[] = [];
    const blocked: string[] = [];

    lines.forEach((line) => {
      const l = line.toLowerCase().trim();
      if (!l) return;
      if (l.includes('done') || l.includes('completed') || l.includes('finished')) {
        done.push(line);
      } else if (l.includes('block') || l.includes('stuck') || l.includes('waiting')) {
        blocked.push(line);
      } else {
        inProgress.push(line);
      }
    });

    setParsedItems({ done, inProgress, blocked });
  };

  const handleConfirmWhatsApp = () => {
    addUpdate({
      content: waText,
      source: 'whatsapp',
      projectId: waProjId || undefined,
      teamMemberId: waSender,
      createdBy: waSender,
      tags: ['daily-log'],
    });

    setWaText('');
    setParsedItems(null);
    onClose();
  };

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim()) return;

    addNote({
      title: noteTitle,
      content: noteContent,
      type: 'quick',
      projectId: taskProjId || undefined,
      tags: ['quick-note'],
      createdBy: 'tm-2',
    });

    setNoteTitle('');
    setNoteContent('');
    onClose();
  };

  const handleCreateReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!remTitle.trim()) return;

    addReminder({
      title: remTitle,
      description: 'Quick reminder set from Executive Command Center',
      dateTime: remDate,
      priority: 'P1',
      level: 'normal',
      acknowledged: false,
      owner: 'tm-1',
    });

    setRemTitle('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-base">
            <Plus size={20} />
            Quick Add Sheet
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setTab('task')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              tab === 'task' ? 'bg-white text-indigo-700 shadow-xs font-bold' : 'text-slate-600'
            }`}
          >
            + Task
          </button>
          <button
            onClick={() => setTab('whatsapp')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              tab === 'whatsapp' ? 'bg-white text-emerald-700 shadow-xs font-bold' : 'text-slate-600'
            }`}
          >
            📱 WhatsApp Log
          </button>
          <button
            onClick={() => setTab('note')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              tab === 'note' ? 'bg-white text-indigo-700 shadow-xs font-bold' : 'text-slate-600'
            }`}
          >
            + Note
          </button>
          <button
            onClick={() => setTab('reminder')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              tab === 'reminder' ? 'bg-white text-amber-700 shadow-xs font-bold' : 'text-slate-600'
            }`}
          >
            + Reminder
          </button>
        </div>

        {/* TAB 1: ADD TASK */}
        {tab === 'task' && (
          <form onSubmit={handleCreateTask} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Task Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Wireframes for Origna launch"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Project</label>
                <select
                  value={taskProjId}
                  onChange={(e) => setTaskProjId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-indigo-600"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assignee</label>
                <select
                  value={taskAssignee}
                  onChange={(e) => setTaskAssignee(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-indigo-600"
                >
                  {teamMembers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Sector</label>
                <select
                  value={taskSector}
                  onChange={(e) => setTaskSector(e.target.value as Sector)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-indigo-600"
                >
                  <option value="Research">Research</option>
                  <option value="UX">UX Design</option>
                  <option value="UI">UI Design</option>
                  <option value="Branding">Branding</option>
                  <option value="Development">Development</option>
                  <option value="Ops">Operations</option>
                  <option value="Finance">Finance</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Due Date</label>
                <input
                  type="date"
                  value={taskDueDate}
                  onChange={(e) => setTaskDueDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button type="button" onClick={onClose} className="btn btn-secondary text-xs">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary text-xs">
                Create Task
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: WHATSAPP PARSER */}
        {tab === 'whatsapp' && (
          <div className="space-y-3 text-xs">
            {!parsedItems ? (
              <form onSubmit={handleParseWhatsApp} className="space-y-3">
                <p className="text-slate-500">
                  Paste raw WhatsApp update message. The parser will split it into Done, In-Progress, and Blocked items.
                </p>

                <textarea
                  rows={4}
                  required
                  placeholder="Paste WhatsApp update text here..."
                  value={waText}
                  onChange={(e) => setWaText(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-indigo-600"
                />

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Team Member</label>
                    <select
                      value={waSender}
                      onChange={(e) => setWaSender(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900"
                    >
                      {teamMembers.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Target Project</label>
                    <select
                      value={waProjId}
                      onChange={(e) => setWaProjId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900"
                    >
                      {projects.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button type="submit" className="btn btn-primary text-xs bg-emerald-600 hover:bg-emerald-700">
                    Parse WhatsApp Update
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-3">
                <div className="font-bold text-slate-900">Parsed Breakdown Confirmation:</div>

                {parsedItems.done.length > 0 && (
                  <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200">
                    <span className="font-bold text-emerald-800">✅ Completed ({parsedItems.done.length})</span>
                    {parsedItems.done.map((d, i) => (
                      <div key={i} className="text-slate-700 mt-1">• {d}</div>
                    ))}
                  </div>
                )}

                {parsedItems.blocked.length > 0 && (
                  <div className="p-2.5 bg-rose-50 rounded-lg border border-rose-200">
                    <span className="font-bold text-rose-800">⚠️ Blocked ({parsedItems.blocked.length})</span>
                    {parsedItems.blocked.map((b, i) => (
                      <div key={i} className="text-slate-700 mt-1">• {b}</div>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button onClick={() => setParsedItems(null)} className="btn btn-secondary text-xs">
                    Re-edit Text
                  </button>
                  <button onClick={handleConfirmWhatsApp} className="btn btn-primary text-xs bg-emerald-600 hover:bg-emerald-700">
                    Confirm & Attach to Feed
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: NOTE */}
        {tab === 'note' && (
          <form onSubmit={handleCreateNote} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Note Title *</label>
              <input
                type="text"
                required
                placeholder="Note title..."
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-indigo-600"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Content</label>
              <textarea
                rows={4}
                placeholder="Note content..."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-indigo-600"
              />
            </div>
            <div className="flex justify-end pt-2">
              <button type="submit" className="btn btn-primary text-xs">
                Save Note
              </button>
            </div>
          </form>
        )}

        {/* TAB 4: REMINDER */}
        {tab === 'reminder' && (
          <form onSubmit={handleCreateReminder} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Reminder Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Check Cosmora AI PRD Review"
                value={remTitle}
                onChange={(e) => setRemTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-indigo-600"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Reminder Date</label>
              <input
                type="date"
                value={remDate}
                onChange={(e) => setRemDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-indigo-600"
              />
            </div>
            <div className="flex justify-end pt-2">
              <button type="submit" className="btn btn-primary text-xs bg-amber-600 hover:bg-amber-700">
                Set Reminder
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
