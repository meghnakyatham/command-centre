'use client';

import React from 'react';
import { useAppStore } from '@/store';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  IndianRupee,
  Calendar,
  FileText,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  MessageSquare,
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Executive Overview', icon: LayoutDashboard },
  { id: 'projects', label: 'Projects & Operations', icon: FolderKanban },
  { id: 'tasks', label: 'Tasks & Deliverables', icon: CheckSquare },
  { id: 'team', label: 'Team Allocation', icon: Users },
  { id: 'finance', label: 'Financial Tracking', icon: IndianRupee },
  { id: 'calendar', label: 'Calendar & Schedule', icon: Calendar },
  { id: 'notes', label: 'Notes & Decisions', icon: FileText },
  { id: 'updates', label: 'Activity Feed', icon: MessageSquare },
  { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const { activePage, setActivePage, sidebarCollapsed, toggleSidebar, decisions, tasks } = useAppStore();

  const pendingDecisions = decisions.filter((d) => d.status === 'pending').length;
  const overdueTasks = tasks.filter(
    (t) => t.dueDate < new Date().toISOString().split('T')[0] && t.status !== 'completed' && t.status !== 'cancelled'
  ).length;

  const getBadge = (id: string): number | undefined => {
    if (id === 'tasks' && overdueTasks > 0) return overdueTasks;
    if (id === 'notes' && pendingDecisions > 0) return pendingDecisions;
    return undefined;
  };

  return (
    <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
      {/* Header */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <Briefcase size={20} color="white" />
        </div>
        {!sidebarCollapsed && (
          <div>
            <div className="sidebar-title">Command Center</div>
            <div className="sidebar-subtitle">Deepfold Labs</div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="nav-section-label">Overview</div>
        {NAV_ITEMS.slice(0, 1).map((item) => {
          const Icon = item.icon;
          const badge = getBadge(item.id);
          return (
            <div
              key={item.id}
              className={`nav-item ${activePage === item.id ? 'active' : ''}`}
              onClick={() => setActivePage(item.id)}
              title={sidebarCollapsed ? item.label : undefined}
            >
              <div className="nav-item-icon">
                <Icon size={18} />
              </div>
              <span className="nav-item-label">{item.label}</span>
              {badge !== undefined && <span className="nav-badge">{badge}</span>}
            </div>
          );
        })}

        <div className="nav-section-label">Operations</div>
        {NAV_ITEMS.slice(1, 6).map((item) => {
          const Icon = item.icon;
          const badge = getBadge(item.id);
          return (
            <div
              key={item.id}
              className={`nav-item ${activePage === item.id ? 'active' : ''}`}
              onClick={() => setActivePage(item.id)}
              title={sidebarCollapsed ? item.label : undefined}
            >
              <div className="nav-item-icon">
                <Icon size={18} />
              </div>
              <span className="nav-item-label">{item.label}</span>
              {badge !== undefined && <span className="nav-badge">{badge}</span>}
            </div>
          );
        })}

        <div className="nav-section-label">Strategy & Logs</div>
        {NAV_ITEMS.slice(6).map((item) => {
          const Icon = item.icon;
          const badge = getBadge(item.id);
          return (
            <div
              key={item.id}
              className={`nav-item ${activePage === item.id ? 'active' : ''}`}
              onClick={() => setActivePage(item.id)}
              title={sidebarCollapsed ? item.label : undefined}
            >
              <div className="nav-item-icon">
                <Icon size={18} />
              </div>
              <span className="nav-item-label">{item.label}</span>
              {badge !== undefined && <span className="nav-badge">{badge}</span>}
            </div>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <div style={{ padding: '8px 12px' }}>
        <div className="nav-item" onClick={toggleSidebar}>
          <div className="nav-item-icon">
            {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </div>
          <span className="nav-item-label">{sidebarCollapsed ? '' : 'Collapse Menu'}</span>
        </div>
      </div>

      {/* User */}
      <div className="sidebar-footer">
        <div className="user-pill">
          <div className="user-avatar">MK</div>
          {!sidebarCollapsed && (
            <div className="user-info">
              <div className="user-name">Meghna Kyatham</div>
              <div className="user-role">Operations Lead</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
