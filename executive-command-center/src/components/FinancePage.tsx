'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/store';
import { PieChart, HorizontalBarChart } from '@/components/Charts';
import {
  Plus,
  X,
  IndianRupee,
  TrendingUp,
  TrendingDown,
  PieChart as PieIcon,
  Lock,
  Key,
  ShieldCheck,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Bell,
} from 'lucide-react';

export default function FinancePage() {
  const {
    expenses,
    revenues,
    budgets,
    projects,
    teamMembers,
    addExpense,
    userRole,
    financeUnlocked,
    toggleFinanceUnlocked,
  } = useAppStore();

  const [showModal, setShowModal] = useState(false);
  const [requested, setRequested] = useState(false);
  const [form, setForm] = useState({
    projectId: '',
    description: '',
    amount: 0,
    currency: 'INR',
    date: new Date().toISOString().split('T')[0],
    category: '',
    vendor: '',
    paymentStatus: 'pending' as const,
    approvalStatus: 'pending' as const,
  });

  // Locked state for Meghna when Finance is not unlocked by Owner
  const isLocked = userRole === 'member' && !financeUnlocked;

  if (isLocked) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
        <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center border border-slate-200">
          <Lock size={32} className="text-amber-600" />
        </div>

        <h2 className="text-xl font-bold text-slate-900">Financial Data Restricted</h2>

        <p className="text-sm text-slate-500 max-w-md leading-relaxed">
          Finance & Business Operations are locked by Saswat Sahu (Owner). Financial access is restricted by role as specified in company security protocols.
        </p>

        <div className="pt-2 flex items-center gap-3">
          {requested ? (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-lg flex items-center gap-1.5">
              <ShieldCheck size={16} /> Access Request Sent to Saswat
            </span>
          ) : (
            <button
              onClick={() => setRequested(true)}
              className="btn btn-primary text-xs flex items-center gap-1.5"
            >
              <Key size={14} /> Request Access
            </button>
          )}

          <button
            onClick={toggleFinanceUnlocked}
            className="btn btn-secondary text-xs"
          >
            (Owner Demo Unlock)
          </button>
        </div>
      </div>
    );
  }

  const totalBudget = budgets.reduce((s, b) => s + b.allocatedAmount, 0);
  const totalSpent = budgets.reduce((s, b) => s + b.spentAmount, 0);
  const totalRevenue = revenues.reduce((s, r) => s + r.amount, 0);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.description.trim()) return;
    addExpense({ ...form, amount: Number(form.amount) });
    setShowModal(false);
  };

  const getProjectName = (id?: string) => {
    if (!id) return 'Company Wide';
    return projects.find((p) => p.id === id)?.name || id;
  };

  // --- AUTOMATIC SALARY REMINDERS CALCULATION (REQ #2) ---
  const today = new Date();
  const currentDay = today.getDate();
  const monthName = today.toLocaleString('default', { month: 'long' });

  // Saswat: 1st to 5th of every month
  const isSaswatWindow = currentDay >= 1 && currentDay <= 5;
  // Meghna: 15th to 20th of every month
  const isMeghnaWindow = currentDay >= 15 && currentDay <= 20;

  const handleDisburseSalary = (personName: string, defaultAmount: number) => {
    addExpense({
      projectId: 'proj-3',
      description: `Monthly Salary Disbursement — ${personName} (${monthName})`,
      amount: defaultAmount,
      currency: 'INR',
      date: today.toISOString().split('T')[0],
      category: 'Salaries & Payroll',
      vendor: personName,
      paymentStatus: 'paid',
      approvalStatus: 'approved',
      approvedBy: 'tm-1',
    });

    alert(`Salary expense of ₹${defaultAmount.toLocaleString()} recorded for ${personName}!`);
  };

  // Chart Preparation
  const categoriesMap: Record<string, number> = {};
  expenses.forEach((e) => {
    const cat = e.category || 'General';
    categoriesMap[cat] = (categoriesMap[cat] || 0) + e.amount;
  });

  const categoryColors = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
  const categoryPieData = Object.entries(categoriesMap).map(([cat, amt], i) => ({
    label: cat,
    value: amt,
    color: categoryColors[i % categoryColors.length],
  }));

  const projectSpendBarData = budgets.map((b) => {
    const proj = projects.find((p) => p.id === b.projectId);
    return {
      label: proj ? proj.name : 'Unallocated',
      value: b.spentAmount,
      max: b.allocatedAmount,
      color: proj ? proj.color : '#4F46E5',
    };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <IndianRupee className="text-emerald-600" size={26} />
            Financial Overview & Automated Payroll
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Capital allocation, budget utilization, automated salary disbursement reminders, and expense logs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {userRole === 'member' && (
            <button
              onClick={toggleFinanceUnlocked}
              className="text-xs text-slate-500 hover:text-slate-800 underline font-medium"
            >
              Lock Section
            </button>
          )}
          <button
            onClick={() => setShowModal(true)}
            className="btn btn-primary text-xs flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700"
          >
            <Plus size={16} /> Log Expense
          </button>
        </div>
      </div>

      {/* AUTOMATIC SALARY & PAYROLL REMINDERS CARD (REQ #2) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Bell size={18} className="text-indigo-600" />
              Saswat's Permanent Monthly Salary & Payroll Reminders
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Automated recurring monthly disbursement windows configured for Saswat (Owner).
            </p>
          </div>
          <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-lg">
            Today: Day {currentDay} of {monthName}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Saswat's Team Salary Reminder (1st - 5th) */}
          <div
            className={`p-4 rounded-xl border transition-all space-y-3 ${
              isSaswatWindow
                ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-400/20'
                : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-extrabold text-slate-900 block">
                  Team Payroll (Bharat, Sagarika & Team)
                </span>
                <span className="text-[11px] font-semibold text-slate-500">
                  Window: 1st – 5th of every month (Reminder for Saswat)
                </span>
              </div>

              {isSaswatWindow ? (
                <span className="bg-amber-500 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                  <Clock size={12} /> Active Window Now
                </span>
              ) : (
                <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">
                  Scheduled 1st–5th
                </span>
              )}
            </div>

            <p className="text-xs text-slate-600">
              {isSaswatWindow
                ? `Salary disbursement window for Bharat & Sagarika is currently OPEN for ${monthName}.`
                : `Next team salary disbursement window (Bharat & Sagarika) opens on the 1st of next month.`}
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleDisburseSalary('Bharat Sahu', 65000)}
                className="flex-1 btn btn-primary text-xs bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center gap-1"
              >
                <CheckCircle2 size={13} /> Disburse Bharat (₹65,000)
              </button>
              <button
                onClick={() => handleDisburseSalary('Sagarika', 50000)}
                className="flex-1 btn btn-primary text-xs bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center gap-1"
              >
                <CheckCircle2 size={13} /> Disburse Sagarika (₹50,000)
              </button>
            </div>
          </div>

          {/* Meghna's Salary Reminder (15th - 20th) */}
          <div
            className={`p-4 rounded-xl border transition-all space-y-3 ${
              isMeghnaWindow
                ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-400/20'
                : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-extrabold text-slate-900 block">
                  Meghna Kyatham (Executive Operations)
                </span>
                <span className="text-[11px] font-semibold text-slate-500">
                  Window: 15th – 20th of every month (Reminder for Saswat)
                </span>
              </div>

              {isMeghnaWindow ? (
                <span className="bg-emerald-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                  <Clock size={12} /> Active Window Now
                </span>
              ) : (
                <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">
                  Scheduled 15th–20th
                </span>
              )}
            </div>

            <p className="text-xs text-slate-600">
              {isMeghnaWindow
                ? `Salary disbursement window for Meghna is currently OPEN for ${monthName}.`
                : `Next salary disbursement window for Meghna opens on the 15th of this month.`}
            </p>

            <button
              onClick={() => handleDisburseSalary('Meghna Kyatham', 85000)}
              className="w-full btn btn-primary text-xs bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 size={14} /> Disburse Meghna's Salary (₹85,000)
            </button>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="stat-card border-l-4 border-l-indigo-600">
          <div className="stat-card-title">Total Allocated Budget</div>
          <div className="stat-card-value text-indigo-600">
            ₹{(totalBudget / 100000).toFixed(2)} Lakhs
          </div>
          <div className="stat-card-subtitle">Across company projects</div>
        </div>

        <div className="stat-card border-l-4 border-l-rose-500">
          <div className="stat-card-title">Total Capital Spent</div>
          <div className="stat-card-value text-rose-600">
            ₹{(totalSpent / 100000).toFixed(2)} Lakhs
          </div>
          <div className="stat-card-subtitle">
            {totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0}% utilization rate
          </div>
        </div>

        <div className="stat-card border-l-4 border-l-emerald-600">
          <div className="stat-card-title">Recorded Revenue</div>
          <div className="stat-card-value text-emerald-600">
            ₹{(totalRevenue / 100000).toFixed(2)} Lakhs
          </div>
          <div className="stat-card-subtitle">Retainers & product revenue</div>
        </div>
      </div>

      {/* Visualizations Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <PieIcon size={18} className="text-indigo-600" />
              Expense Distribution by Category
            </h2>
            <span className="text-xs text-slate-400 font-medium">Categorization</span>
          </div>

          <PieChart
            data={categoryPieData}
            size={180}
            donut={true}
            centerText={`₹${(totalSpent / 1000).toFixed(0)}k`}
            centerSubtitle="Spent"
          />
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp size={18} className="text-emerald-600" />
              Project Spend vs Allocated Budget
            </h2>
            <span className="text-xs text-slate-400 font-medium">Capital Burn</span>
          </div>

          <HorizontalBarChart data={projectSpendBarData} />
        </div>
      </div>

      {/* Per Project Budget Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900">Project Budget Allocation Matrix</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px] font-bold">
              <tr>
                <th className="py-3 px-4">Project</th>
                <th className="py-3 px-4">Allocated Budget</th>
                <th className="py-3 px-4">Spent to Date</th>
                <th className="py-3 px-4">Burn Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {budgets.map((b) => {
                const projName = getProjectName(b.projectId);
                const pct = b.allocatedAmount > 0 ? Math.round((b.spentAmount / b.allocatedAmount) * 100) : 0;
                return (
                  <tr key={b.id} className="hover:bg-slate-50">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{projName}</td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-800">
                      ₹{b.allocatedAmount.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-rose-600">
                      ₹{b.spentAmount.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                          <div
                            className="h-full rounded-full bg-emerald-600"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="font-bold text-slate-900">{pct}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900">Recent Expense Log</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px] font-bold">
              <tr>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Project</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {expenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-slate-50">
                  <td className="py-3.5 px-4 font-semibold text-slate-900">{exp.description}</td>
                  <td className="py-3.5 px-4 font-medium text-slate-700">
                    {getProjectName(exp.projectId)}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{exp.category}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    ₹{exp.amount.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        exp.paymentStatus === 'paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {exp.paymentStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* LOG EXPENSE MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-lg shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <IndianRupee className="text-emerald-600" size={20} />
                Log Expense Item
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Server hosting renewal"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Project</label>
                  <select
                    value={form.projectId}
                    onChange={(e) => setForm({ ...form, projectId: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-600"
                  >
                    <option value="">Company Wide</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary text-xs bg-emerald-600 hover:bg-emerald-700">
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
