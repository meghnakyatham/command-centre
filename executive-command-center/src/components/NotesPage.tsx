'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/store';
import { Note, Decision } from '@/types';
import {
  FileText,
  Plus,
  X,
  Tag,
  CheckCircle2,
  Clock,
  AlertCircle,
  FolderKanban,
  User,
  Search,
  Check,
} from 'lucide-react';

export default function NotesPage() {
  const { notes, decisions, projects, teamMembers, addNote, addDecision, updateDecision } = useAppStore();
  const [activeTab, setActiveTab] = useState<'notes' | 'decisions'>('notes');
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Modal states
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showDecisionModal, setShowDecisionModal] = useState(false);

  // Form states - Note
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteType, setNoteType] = useState<Note['type']>('quick');
  const [noteProjectId, setNoteProjectId] = useState<string>('');
  const [noteTagsInput, setNoteTagsInput] = useState('');

  // Form states - Decision
  const [decTitle, setDecTitle] = useState('');
  const [decDescription, setDecDescription] = useState('');
  const [decContext, setDecContext] = useState('');
  const [decImpact, setDecImpact] = useState('');
  const [decDeadline, setDecDeadline] = useState('');
  const [decProjectId, setDecProjectId] = useState('');

  const getProjectName = (id?: string) => {
    if (!id) return null;
    return projects.find((p) => p.id === id)?.name;
  };

  const getMemberName = (id: string) => {
    return teamMembers.find((m) => m.id === id)?.name || id;
  };

  const allTags = Array.from(new Set(notes.flatMap((n) => n.tags)));

  const filteredNotes = notes.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase());
    const matchesTag = !selectedTag || n.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim()) return;

    addNote({
      title: noteTitle,
      content: noteContent,
      type: noteType,
      projectId: noteProjectId || undefined,
      tags: noteTagsInput.split(',').map((t) => t.trim()).filter(Boolean),
      createdBy: 'tm-2',
    });

    setNoteTitle('');
    setNoteContent('');
    setNoteTagsInput('');
    setShowNoteModal(false);
  };

  const handleCreateDecision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!decTitle.trim()) return;

    addDecision({
      title: decTitle,
      description: decDescription,
      context: decContext,
      impact: decImpact,
      deadline: decDeadline,
      owner: 'tm-1',
      projectId: decProjectId || undefined,
      status: 'pending',
    });

    setDecTitle('');
    setDecDescription('');
    setDecContext('');
    setDecImpact('');
    setDecDeadline('');
    setShowDecisionModal(false);
  };

  const pendingDecisions = decisions.filter((d) => d.status === 'pending');
  const decidedDecisions = decisions.filter((d) => d.status === 'decided');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="text-indigo-600" size={26} />
            Notes & Decisions Log
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Capture executive notes, meeting minutes, architecture decisions, and track pending approvals.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowNoteModal(true)}
            className="btn btn-secondary text-xs flex items-center gap-1.5"
          >
            <Plus size={16} /> New Note
          </button>
          <button
            onClick={() => setShowDecisionModal(true)}
            className="btn btn-primary text-xs flex items-center gap-1.5"
          >
            <Plus size={16} /> New Decision Item
          </button>
        </div>
      </div>

      {/* Navigation Tabs & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 p-3 rounded-xl shadow-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('notes')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'notes'
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Notes ({notes.length})
          </button>
          <button
            onClick={() => setActiveTab('decisions')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'decisions'
                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Decisions ({decisions.length})
            {pendingDecisions.length > 0 && (
              <span className="bg-amber-500 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-full">
                {pendingDecisions.length}
              </span>
            )}
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:border-indigo-600 w-48 md:w-64"
          />
        </div>
      </div>

      {/* TAB CONTENT: NOTES */}
      {activeTab === 'notes' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredNotes.map((note) => {
              const projName = getProjectName(note.projectId);
              return (
                <div
                  key={note.id}
                  className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {note.type}
                      </span>
                      {projName && (
                        <span className="text-xs text-slate-500 font-medium">{projName}</span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-slate-900">{note.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">
                      {note.content}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>{getMemberName(note.createdBy)}</span>
                    <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB CONTENT: DECISIONS */}
      {activeTab === 'decisions' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Clock size={20} className="text-amber-500" />
              Pending Executive Decisions
            </h2>

            <div className="space-y-3">
              {pendingDecisions.map((dec) => (
                <div
                  key={dec.id}
                  className="bg-amber-50/50 border border-amber-200 rounded-xl p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded">
                      Deadline: {dec.deadline}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateDecision(dec.id, { status: 'decided' })}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-xs"
                      >
                        <Check size={14} /> Decide
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900">{dec.title}</h3>
                    <p className="text-xs text-slate-700 mt-1">{dec.description}</p>
                  </div>

                  {dec.context && (
                    <div className="bg-white p-3 rounded-lg border border-amber-200 text-xs text-slate-600">
                      <strong>Context:</strong> {dec.context}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CREATE NOTE MODAL */}
      {showNoteModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-lg shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FileText className="text-indigo-600" size={20} />
                Create New Note
              </h2>
              <button
                onClick={() => setShowNoteModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateNote} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  placeholder="Note title..."
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Content</label>
                <textarea
                  rows={4}
                  placeholder="Note content..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNoteModal(false)}
                  className="btn btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary text-xs">
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE DECISION MODAL */}
      {showDecisionModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-lg shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Plus className="text-indigo-600" size={20} />
                Create Decision Requirement
              </h2>
              <button
                onClick={() => setShowDecisionModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateDecision} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Choose Website Host"
                  value={decTitle}
                  onChange={(e) => setDecTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  placeholder="Summary of decision..."
                  value={decDescription}
                  onChange={(e) => setDecDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Deadline</label>
                <input
                  type="date"
                  value={decDeadline}
                  onChange={(e) => setDecDeadline(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowDecisionModal(false)}
                  className="btn btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary text-xs">
                  Create Decision Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
