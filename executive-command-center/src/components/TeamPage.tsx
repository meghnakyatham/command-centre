'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/store';
import { Mail, FolderKanban, Tag, Users, Edit2, Check, X, Plus, UserPlus, Trash2 } from 'lucide-react';

export default function TeamPage() {
  const { teamMembers, tasks, projects, updateTeamMember, addTeamMember, deleteTeamMember } = useAppStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editEmail, setEditEmail] = useState('');

  // Add Member Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newSkills, setNewSkills] = useState('');
  const [newCapacity, setNewCapacity] = useState('40');
  const [newNotes, setNewNotes] = useState('');
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);

  const handleStartEdit = (id: string, currentEmail: string) => {
    setEditingId(id);
    setEditEmail(currentEmail);
  };

  const handleSaveEmail = (id: string) => {
    if (!editEmail.trim()) return;
    updateTeamMember(id, { email: editEmail.trim() });
    setEditingId(null);
  };

  const handleCreateMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    addTeamMember({
      name: newName.trim(),
      role: newRole.trim() || 'Team Member',
      email: newEmail.trim(),
      avatar: '',
      projectIds: selectedProjectIds,
      skills: newSkills.split(',').map((s) => s.trim()).filter(Boolean),
      weeklyCapacityHours: parseInt(newCapacity, 10) || 40,
      notes: newNotes.trim() || 'No additional notes.',
      onTimeRate: 100,
      updateConsistency: 100,
    });

    // Reset form
    setNewName('');
    setNewRole('');
    setNewEmail('');
    setNewSkills('');
    setNewCapacity('40');
    setNewNotes('');
    setSelectedProjectIds([]);
    setIsAddModalOpen(false);
  };

  const toggleProjectSelection = (projId: string) => {
    setSelectedProjectIds((prev) =>
      prev.includes(projId) ? prev.filter((id) => id !== projId) : [...prev, projId]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="text-indigo-600" size={26} />
            Team Directory & Assigned Email Directory
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage team members, assigned emails, project allocations, and capacity.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all shadow-sm self-start sm:self-auto"
        >
          <UserPlus size={18} />
          Add Team Member
        </button>
      </div>

      {/* Member Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {teamMembers.map((member) => {
          const memberTasks = tasks.filter((t) => t.assignee === member.id);
          const activeTaskCount = memberTasks.filter((t) => t.status !== 'completed').length;
          const assignedProjects = projects.filter((p) => member.projectIds.includes(p.id));

          const isEditing = editingId === member.id;

          return (
            <div
              key={member.id}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 flex flex-col justify-between relative group"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-indigo-600 text-white font-bold text-base flex items-center justify-center shadow-inner">
                      {member.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{member.name}</h3>
                      <p className="text-xs text-indigo-600 font-semibold">{member.role}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-1 rounded bg-slate-100 text-slate-700">
                      {activeTaskCount} active tasks
                    </span>
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to remove ${member.name} from the team?`)) {
                          deleteTeamMember(member.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Remove Member"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Assigned Email Field with Edit Option */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1 text-xs">
                  <div className="flex items-center justify-between font-semibold text-slate-500 text-[11px]">
                    <span className="flex items-center gap-1">
                      <Mail size={13} className="text-indigo-600" /> Assigned Email Address
                    </span>
                    {!isEditing && (
                      <button
                        onClick={() => handleStartEdit(member.id, member.email)}
                        className="text-indigo-600 hover:underline flex items-center gap-1 font-medium"
                      >
                        <Edit2 size={11} /> Edit Email
                      </button>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="email"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        className="w-full bg-white border border-indigo-400 rounded-lg px-2.5 py-1 text-xs text-slate-900 focus:outline-none"
                      />
                      <button
                        onClick={() => handleSaveEmail(member.id)}
                        className="p-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                        title="Save Email"
                      >
                        <Check size={14} />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="p-1.5 rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300"
                        title="Cancel"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="font-mono text-slate-900 font-bold text-xs">{member.email}</div>
                  )}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {member.notes}
                </p>

                {/* Assigned Projects */}
                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <FolderKanban size={13} className="text-indigo-600" /> Assigned Projects
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {assignedProjects.length > 0 ? (
                      assignedProjects.map((p) => (
                        <span
                          key={p.id}
                          className="text-xs font-semibold px-2.5 py-1 rounded-md text-slate-700 bg-slate-100 border border-slate-200"
                        >
                          {p.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 italic">No assigned projects</span>
                    )}
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Tag size={13} className="text-indigo-600" /> Core Skills
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {member.skills.length > 0 ? (
                      member.skills.map((skill) => (
                        <span
                          key={skill}
                          className="text-[11px] font-medium px-2 py-0.5 rounded text-indigo-700 bg-indigo-50 border border-indigo-100"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 italic">No skills listed</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Team Member Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <UserPlus className="text-indigo-600" size={20} />
                Add New Team Member
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateMember} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Johnson"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Role / Designation</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Frontend Engineer"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Assigned Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="alex@deepfoldlabs.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Weekly Capacity (Hours)</label>
                <input
                  type="number"
                  min="1"
                  max="80"
                  value={newCapacity}
                  onChange={(e) => setNewCapacity(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Core Skills (comma separated)</label>
                <input
                  type="text"
                  placeholder="React, TypeScript, UI Design"
                  value={newSkills}
                  onChange={(e) => setNewSkills(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Assigned Projects</label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {projects.map((p) => {
                    const isSelected = selectedProjectIds.includes(p.id);
                    return (
                      <button
                        type="button"
                        key={p.id}
                        onClick={() => toggleProjectSelection(p.id)}
                        className={`px-2.5 py-1 rounded-lg font-medium border text-xs transition-all ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {p.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Notes / Description</label>
                <textarea
                  rows={2}
                  placeholder="Role responsibilities or context..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm"
                >
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
