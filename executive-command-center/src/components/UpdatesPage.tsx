'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/store';
import { UpdateEntry } from '@/types';
import {
  MessageSquare,
  Send,
  FolderKanban,
  User,
  Clock,
  CheckCircle2,
  Zap,
} from 'lucide-react';

export default function UpdatesPage() {
  const { updates, projects, teamMembers, addUpdate } = useAppStore();

  const [message, setMessage] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [selectedMemberId, setSelectedMemberId] = useState<string>('tm-2');
  const [source, setSource] = useState<UpdateEntry['source']>('whatsapp');
  const [filterProject, setFilterProject] = useState<string>('');

  const getMemberName = (id?: string) => {
    if (!id) return 'Unknown Member';
    return teamMembers.find((m) => m.id === id)?.name || id;
  };

  const getMemberRole = (id?: string) => {
    if (!id) return '';
    return teamMembers.find((m) => m.id === id)?.role || '';
  };

  const getProjectName = (id?: string) => {
    if (!id) return null;
    return projects.find((p) => p.id === id)?.name;
  };

  const handlePostUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    addUpdate({
      content: message,
      source: source,
      projectId: selectedProjectId || undefined,
      teamMemberId: selectedMemberId,
      createdBy: selectedMemberId,
      tags: ['status-update'],
    });

    setMessage('');
  };

  const filteredUpdates = updates.filter((u) => {
    if (!filterProject) return true;
    return u.projectId === filterProject;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <MessageSquare className="text-indigo-600" size={26} />
            Daily Executive Feed & Work Activity Logs
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Capture status updates, WhatsApp messages, and team progress notes in one centralized timeline.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Ingest Form & Feed */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Post Box */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Zap className="text-indigo-600" size={18} />
                Post Work Status Update
              </span>
              <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded font-semibold">
                Live Feed
              </span>
            </div>

            <form onSubmit={handlePostUpdate} className="space-y-3">
              <textarea
                rows={3}
                required
                placeholder="e.g. 'Completed testing for the CRM dashboard MVP. Moving to user review today...'"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600"
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Sender
                  </label>
                  <select
                    value={selectedMemberId}
                    onChange={(e) => setSelectedMemberId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-600"
                  >
                    {teamMembers.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Project
                  </label>
                  <select
                    value={selectedProjectId}
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-600"
                  >
                    <option value="">(Company Feed)</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Channel
                  </label>
                  <select
                    value={source}
                    onChange={(e) => setSource(e.target.value as UpdateEntry['source'])}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-600"
                  >
                    <option value="whatsapp">📱 WhatsApp</option>
                    <option value="manual">✍️ Direct Log</option>
                    <option value="system">⚙️ System Alert</option>
                    <option value="notion">📝 Notion Sync</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end pt-2">
                <button type="submit" className="btn btn-primary text-xs flex items-center gap-1.5">
                  <Send size={14} /> Post Update
                </button>
              </div>
            </form>
          </div>

          {/* Feed List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Clock size={18} className="text-indigo-600" />
                Live Status Timeline
              </h2>

              <select
                value={filterProject}
                onChange={(e) => setFilterProject(e.target.value)}
                className="bg-white border border-slate-200 text-xs text-slate-700 rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-600 font-medium"
              >
                <option value="">All Projects</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              {filteredUpdates.map((update) => {
                const projName = getProjectName(update.projectId);
                const memberName = getMemberName(update.teamMemberId);
                const memberRole = getMemberRole(update.teamMemberId);
                return (
                  <div
                    key={update.id}
                    className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                          {memberName.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900">{memberName}</span>
                          {memberRole && <span className="text-slate-500 ml-1">({memberRole})</span>}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {projName && (
                          <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded font-semibold text-[11px]">
                            {projName}
                          </span>
                        )}
                        <span className="text-slate-400 text-[11px]">
                          {new Date(update.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-800 pl-9 leading-relaxed font-medium">
                      {update.content}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Summary & Channels */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Today's Operating Highlights</h3>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1">
                <div className="font-bold flex items-center gap-1">
                  <CheckCircle2 size={13} /> Cosmora Progress
                </div>
                <p className="text-slate-600">
                  Analytics dashboard filters completed. Progressing on data segments.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-900 space-y-1">
                <div className="font-bold flex items-center gap-1">
                  <CheckCircle2 size={13} /> Origna Designs
                </div>
                <p className="text-slate-600">Product page layouts finalized and ready for review.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
