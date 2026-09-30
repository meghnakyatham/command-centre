'use client';

import React, { useEffect, useState } from 'react';
import { useAppStore } from '@/store';

import Sidebar from '@/components/Sidebar';
import DashboardPage from '@/components/DashboardPage';
import ProjectsPage from '@/components/ProjectsPage';
import TasksPage from '@/components/TasksPage';
import TeamPage from '@/components/TeamPage';
import FinancePage from '@/components/FinancePage';
import CalendarPage from '@/components/CalendarPage';
import NotesPage from '@/components/NotesPage';
import UpdatesPage from '@/components/UpdatesPage';
import ReportsPage from '@/components/ReportsPage';
import SettingsPage from '@/components/SettingsPage';
import ProjectDetailPage from '@/components/ProjectDetailPage';
import ReminderModal from '@/components/ReminderModal';
import CommandPalette from '@/components/CommandPalette';
import QuickAddSheet from '@/components/QuickAddSheet';
import UserProfileModal from '@/components/UserProfileModal';
import DataHealthModal from '@/components/DataHealthModal';

import { Search, Plus, UserCheck, Shield, FileSearch, Pin, ChevronRight } from 'lucide-react';

export default function Home() {
  const { activePage, reminders, setActiveReminder, activeReminder, userRole, setUserRole } = useAppStore();

  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isHealthOpen, setIsHealthOpen] = useState(false);

  useEffect(() => {
    const unack = reminders.find((r) => !r.acknowledged);
    if (unack && !activeReminder) {
      setActiveReminder(unack);
    }
  }, [reminders, activeReminder, setActiveReminder]);

  const renderActivePage = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'projects':
        return <ProjectsPage />;
      case 'tasks':
        return <TasksPage />;
      case 'team':
        return <TeamPage />;
      case 'finance':
        return <FinancePage />;
      case 'calendar':
        return <CalendarPage />;
      case 'notes':
        return <NotesPage />;
      case 'updates':
        return <UpdatesPage />;
      case 'reports':
        return <ReportsPage />;
      case 'settings':
        return <SettingsPage />;
      case 'project-detail':
        return <ProjectDetailPage />;
      default:
        return <DashboardPage />;
    }
  };

  const isOwner = userRole === 'owner';

  return (
    <div className="app-container">
      <Sidebar />

      <main className="main-content relative">
        <header className="header border-b border-slate-200 bg-white">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Executive Command Center
            </h2>
            <span className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-0.5 rounded-full font-bold">
              Deepfold Labs
            </span>
          </div>

          <div className="header-actions flex items-center gap-3">
            {/* Global Search / Command Palette Bar */}
            <button
              onClick={() => setIsPaletteOpen(true)}
              className="hidden sm:flex items-center gap-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-3 py-1.5 rounded-xl text-xs text-slate-600 font-medium transition-colors"
            >
              <Search size={14} className="text-slate-400" />
              <span>Search or Ctrl + K</span>
            </button>

            {/* Automated Data Health Audit Scan Trigger */}
            <button
              onClick={() => setIsHealthOpen(true)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Automated Data Health & Integrity Scan"
            >
              <FileSearch size={16} className="text-indigo-600" />
              <span className="hidden md:inline">Data Health</span>
            </button>

            {/* Signed-in Executive Profile Button (PDF Spec Section 1 & 2) */}
            <button
              onClick={() => setIsProfileOpen(true)}
              className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 p-1 pr-3 rounded-xl text-xs font-semibold transition-all"
            >
              <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                {isOwner ? 'SS' : 'MK'}
              </div>
              <span className="text-slate-800 font-bold hidden sm:inline">
                {isOwner ? 'Saswat (Owner)' : 'Meghna (Member)'}
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                2FA Verified
              </span>
            </button>

            {/* "+" Quick Add Button */}
            <button
              onClick={() => setIsQuickAddOpen(true)}
              className="w-9 h-9 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-xs transition-transform active:scale-95"
              title="Quick Add (+) Sheet"
            >
              <Plus size={18} />
            </button>
          </div>
        </header>

        {/* SIR'S PICK / BOSS'S PRIORITY BANNER (PDF SPEC SECTION 4 & 5) */}
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white px-6 py-2.5 flex items-center justify-between text-xs font-semibold shadow-xs">
          <div className="flex items-center gap-2">
            <Pin size={14} className="text-amber-200 shrink-0 animate-bounce" />
            <span className="font-bold uppercase tracking-wider text-[11px] text-amber-200">Sir's Pick:</span>
            <span>Finalize CRM Analytics Dashboard filters and review cloud infrastructure allocation for Cosmora AI.</span>
          </div>
          <span className="text-[10px] text-amber-100 font-mono hidden md:inline">Pinned by Saswat Sahu</span>
        </div>

        <div className="page-content">{renderActivePage()}</div>
      </main>

      {/* Floating Action Button (FAB) for Mobile / Quick Add */}
      <button
        onClick={() => setIsQuickAddOpen(true)}
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-2xl hover:bg-indigo-700 z-40 transition-transform active:scale-90 sm:hidden"
        title="Quick Add"
      >
        <Plus size={24} />
      </button>

      {/* Modals & Command Palette */}
      <CommandPalette
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
        onOpenQuickAdd={() => setIsQuickAddOpen(true)}
      />

      <QuickAddSheet
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
      />

      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

      <DataHealthModal
        isOpen={isHealthOpen}
        onClose={() => setIsHealthOpen(false)}
      />

      {activeReminder && <ReminderModal />}
    </div>
  );
}
