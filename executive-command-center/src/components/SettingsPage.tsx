'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/store';
import { Settings, User, Shield, Bell, Database, Download, Check } from 'lucide-react';

export default function SettingsPage() {
  const { currentUserId, teamMembers, projects, tasks, expenses, decisions, notes } = useAppStore();
  const [saved, setSaved] = useState(false);

  const currentUser = teamMembers.find((m) => m.id === currentUserId) || teamMembers[1];

  const handleExportData = () => {
    const data = {
      projects,
      tasks,
      teamMembers,
      expenses,
      decisions,
      notes,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `executive-command-center-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Settings className="text-indigo-600" size={26} />
          Settings & System Access
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Manage user profiles, privacy enforcement, and data export configuration.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* User Profile */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            <User size={20} className="text-indigo-600" />
            Active User Profile
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">User Name</label>
              <input
                type="text"
                disabled
                value={currentUser.name}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-medium cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Role</label>
              <input
                type="text"
                disabled
                value={`${currentUser.role} (Admin)`}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-medium cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Data Backup */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            <Database size={20} className="text-indigo-600" />
            Data Export & Backup
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Download Full JSON Backup</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Export all projects, tasks, expenses, notes, and decisions into a local JSON file.
              </p>
            </div>

            <button
              type="button"
              onClick={handleExportData}
              className="btn btn-secondary text-xs flex items-center gap-2 shrink-0"
            >
              <Download size={14} /> Download Backup
            </button>
          </div>
        </div>

        {/* Save */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          {saved && (
            <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
              <Check size={14} /> Settings Saved
            </span>
          )}
          <button type="submit" className="btn btn-primary text-xs">
            Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
}
