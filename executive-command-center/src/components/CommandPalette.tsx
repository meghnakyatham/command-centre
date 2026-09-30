'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/store';
import { Search, FolderKanban, CheckSquare, FileText, IndianRupee, X, Plus } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenQuickAdd: () => void;
}

export default function CommandPalette({ isOpen, onClose, onOpenQuickAdd }: CommandPaletteProps) {
  const { projects, tasks, notes, setActivePage, setActiveProjectId } = useAppStore();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open palette handled by parent or state
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );
  const filteredTasks = tasks.filter((t) =>
    t.title.toLowerCase().includes(query.toLowerCase())
  );
  const filteredNotes = notes.filter((n) =>
    n.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-start justify-center z-50 pt-20 p-4">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 space-y-2">
        {/* Search input bar */}
        <div className="flex items-center px-4 border-b border-slate-100 py-3 gap-3">
          <Search size={18} className="text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Type a command or search projects, tasks, notes... (Ctrl + K)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-sm text-slate-900 placeholder-slate-400 bg-transparent focus:outline-none"
          />
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        {/* Quick Actions */}
        <div className="p-2 border-b border-slate-100 bg-slate-50 flex items-center gap-2 overflow-x-auto text-xs">
          <button
            onClick={() => {
              onClose();
              onOpenQuickAdd();
            }}
            className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-bold flex items-center gap-1.5 shadow-xs"
          >
            <Plus size={14} /> Quick Add Item (+)
          </button>
          <button
            onClick={() => {
              setActivePage('projects');
              onClose();
            }}
            className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium hover:bg-slate-100"
          >
            Go to Projects
          </button>
          <button
            onClick={() => {
              setActivePage('tasks');
              onClose();
            }}
            className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium hover:bg-slate-100"
          >
            Go to Tasks
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-3 space-y-4 text-xs">
          {/* Projects */}
          {filteredProjects.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">
                Projects
              </div>
              <div className="space-y-1">
                {filteredProjects.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      setActiveProjectId(p.id);
                      onClose();
                    }}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 cursor-pointer font-medium text-slate-800"
                  >
                    <div className="flex items-center gap-2">
                      <FolderKanban size={15} className="text-indigo-600" />
                      <span>{p.name}</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                      {p.status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tasks */}
          {filteredTasks.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">
                Tasks
              </div>
              <div className="space-y-1">
                {filteredTasks.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => {
                      setActivePage('tasks');
                      onClose();
                    }}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 cursor-pointer font-medium text-slate-800"
                  >
                    <div className="flex items-center gap-2">
                      <CheckSquare size={15} className="text-emerald-600" />
                      <span>{t.title}</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500">{t.dueDate}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {filteredNotes.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">
                Notes
              </div>
              <div className="space-y-1">
                {filteredNotes.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      setActivePage('notes');
                      onClose();
                    }}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 cursor-pointer font-medium text-slate-800"
                  >
                    <div className="flex items-center gap-2">
                      <FileText size={15} className="text-indigo-600" />
                      <span>{n.title}</span>
                    </div>
                    <span className="text-[10px] text-slate-400">{n.type}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
