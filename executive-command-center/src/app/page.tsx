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

import { Search, Plus, UserCheck, Shield } from 'lucide-react';

export default function Home() {
  const { activePage, reminders, setActiveReminder, activeReminder, userRole, setUserRole } = useAppStore();

  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

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

            {/* Account Role Switcher (Spec Section 1 & 11) */}
            <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setUserRole('owner')}
                className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                  userRole === 'owner' ? 'bg-indigo-600 text-white shadow-xs font-bold' : 'text-slate-600'
                }`}
                title="Saswat Sahu (Owner - Full Access)"
              >
                <Shield size={12} /> Saswat (Owner)
              </button>
              <button
                onClick={() => setUserRole('member')}
                className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                  userRole === 'member' ? 'bg-indigo-600 text-white shadow-xs font-bold' : 'text-slate-600'
                }`}
                title="Meghna Kyatham (Member - Configurable Access)"
              >
                <UserCheck size={12} /> Meghna (Member)
              </button>
            </div>

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

      <ReminderModal />
    </div>
  );
}
