'use client';

import React from 'react';
import { useAppStore } from '@/store';
import { Bell, Clock, CheckCircle2, X } from 'lucide-react';

export default function ReminderModal() {
  const { activeReminder, acknowledgeReminder, snoozeReminder, setActiveReminder } = useAppStore();

  if (!activeReminder) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4 animate-in fade-in zoom-in duration-150">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
            <Bell size={18} />
            Executive Reminder
          </div>
          <button
            onClick={() => setActiveReminder(null)}
            className="text-slate-400 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-2">
          <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2 py-0.5 rounded uppercase">
            Priority: {activeReminder.priority}
          </span>

          <h3 className="text-base font-bold text-slate-900">{activeReminder.title}</h3>

          <p className="text-xs text-slate-600 leading-relaxed">{activeReminder.description}</p>
        </div>

        <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <button
            onClick={() => snoozeReminder(activeReminder.id, 60)}
            className="btn btn-secondary text-xs flex items-center gap-1.5"
          >
            <Clock size={14} /> Snooze 1 Hr
          </button>

          <button
            onClick={() => acknowledgeReminder(activeReminder.id)}
            className="btn btn-primary text-xs flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700"
          >
            <CheckCircle2 size={14} /> Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
}
