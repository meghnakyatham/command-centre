'use client';

import React from 'react';
import { useAppStore } from '@/store';
import { X, ShieldCheck, Key, LogOut, User, Lock, Sparkles, Shield } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserProfileModal({ isOpen, onClose }: Props) {
  const { userRole, setUserRole, currentUserId, teamMembers, financeUnlocked, toggleFinanceUnlocked } = useAppStore();

  if (!isOpen) return null;

  const isOwner = userRole === 'owner';
  const currentUser = isOwner
    ? { name: 'Saswat Sahu', role: 'Founder & Owner', email: 'saswat@deepfoldlabs.com', avatar: 'SS' }
    : { name: 'Meghna Kyatham', role: 'Executive Operations', email: 'meghna@deepfoldlabs.com', avatar: 'MK' };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-start justify-end p-4 sm:p-6 z-50 animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-sm p-6 shadow-2xl space-y-5 mt-14">
        {/* Profile Card Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-indigo-600 text-white font-black text-base flex items-center justify-center shadow-md">
              {currentUser.avatar}
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">{currentUser.name}</h3>
              <p className="text-xs text-indigo-600 font-semibold">{currentUser.role}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>

        {/* Security & 2FA Status */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Authentication Method</span>
            <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
              <ShieldCheck size={12} /> 2FA Hardware Key Active
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Assigned Account Email</span>
            <span className="font-mono text-slate-900 font-bold text-[11px]">{currentUser.email}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Financial Data Access</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              isOwner || financeUnlocked ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }`}>
              {isOwner || financeUnlocked ? 'Unlocked' : 'Restricted (Locked)'}
            </span>
          </div>
        </div>

        {/* Demo Account Switcher (PDF Spec Section 1 & 11) */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Executive Account Switcher
          </label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => {
                setUserRole('owner');
                onClose();
              }}
              className={`p-2.5 rounded-xl border text-left font-bold transition-all flex items-center gap-2 ${
                userRole === 'owner'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Shield size={14} /> Saswat (Owner)
            </button>
            <button
              onClick={() => {
                setUserRole('member');
                onClose();
              }}
              className={`p-2.5 rounded-xl border text-left font-bold transition-all flex items-center gap-2 ${
                userRole === 'member'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <User size={14} /> Meghna (Member)
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => {
              toggleFinanceUnlocked();
            }}
            className="text-xs font-semibold text-slate-600 hover:text-indigo-600 flex items-center gap-1.5"
          >
            <Lock size={13} /> Toggle Finance Vault
          </button>

          <button
            onClick={() => {
              alert('Signed out securely. Session ended.');
              onClose();
            }}
            className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1.5"
          >
            <LogOut size={13} /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
