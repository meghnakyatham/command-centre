'use client';

import React from 'react';
import { X, Info, HelpCircle, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';
import { Task } from '@/types';

export interface ExplainData {
  title: string;
  value: string | number;
  unit?: string;
  formula: string;
  description: string;
  breakdown: Array<{
    label: string;
    value: string | number;
    detail: string;
    status?: 'good' | 'warning' | 'bad' | 'neutral';
  }>;
  relatedTasks?: Array<{
    id: string;
    title: string;
    status: string;
    dueDate: string;
  }>;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  data: ExplainData | null;
}

export default function ExplainNumberModal({ isOpen, onClose, data }: Props) {
  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
              <HelpCircle size={22} />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-indigo-600">Explain This Number</div>
              <h3 className="text-lg font-extrabold text-slate-900">{data.title}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Main Score Pill */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-medium">Calculated Metric Result</div>
            <div className="text-3xl font-black text-slate-900 mt-0.5">
              {data.value} <span className="text-sm font-semibold text-slate-500">{data.unit}</span>
            </div>
          </div>
          <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
            <ShieldCheck size={14} /> Audit Verified
          </span>
        </div>

        {/* Formula Box */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Mathematical Formula
          </label>
          <div className="bg-slate-900 text-indigo-300 font-mono text-xs p-3 rounded-xl border border-slate-800 leading-relaxed overflow-x-auto">
            {data.formula}
          </div>
          <p className="text-xs text-slate-500 leading-relaxed pt-1">{data.description}</p>
        </div>

        {/* Factor Breakdown List */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Contributing Factors & Deductions
          </label>
          <div className="space-y-2">
            {data.breakdown.map((item, idx) => {
              const isBad = item.status === 'bad';
              const isWarn = item.status === 'warning';
              const isGood = item.status === 'good';

              return (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border text-xs flex items-start justify-between gap-3 ${
                    isBad
                      ? 'bg-rose-50/50 border-rose-200 text-rose-900'
                      : isWarn
                      ? 'bg-amber-50/50 border-amber-200 text-amber-900'
                      : isGood
                      ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900'
                      : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="font-bold flex items-center gap-1.5">
                      {isBad && <AlertTriangle size={14} className="text-rose-600" />}
                      {isWarn && <AlertTriangle size={14} className="text-amber-600" />}
                      {isGood && <CheckCircle2 size={14} className="text-emerald-600" />}
                      {item.label}
                    </div>
                    <div className="text-[11px] opacity-80">{item.detail}</div>
                  </div>
                  <span className="font-mono font-extrabold text-xs whitespace-nowrap">{item.value}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Related Underlying Tasks */}
        {data.relatedTasks && data.relatedTasks.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Underlying Tasks Driving This Score
            </label>
            <div className="space-y-1.5">
              {data.relatedTasks.map((t) => (
                <div
                  key={t.id}
                  className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs flex items-center justify-between"
                >
                  <span className="font-semibold text-slate-800 truncate max-w-[240px]">{t.title}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                      {t.status}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">Due {t.dueDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-2 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold text-xs transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
