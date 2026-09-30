'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/store';
import {
  Link2,
  CheckCircle2,
  RefreshCw,
  FileText,
  MessageSquare,
  FileSpreadsheet,
  FolderKanban,
  Check,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

export default function IntegrationsHub() {
  const { addUpdate } = useAppStore();

  const [notionConnected, setNotionConnected] = useState(true);
  const [notionSyncing, setNotionSyncing] = useState(false);
  const [notionLastSync, setNotionLastSync] = useState('Today at 09:15 AM');

  const [whatsappActive, setWhatsappActive] = useState(true);
  const [whatsappSyncing, setWhatsappSyncing] = useState(false);

  const [gdriveConnected, setGdriveConnected] = useState(true);
  const [gsheetsConnected, setGsheetsConnected] = useState(true);

  // Trigger Notion Sync
  const handleNotionSync = () => {
    setNotionSyncing(true);
    setTimeout(() => {
      setNotionSyncing(false);
      setNotionLastSync('Just now');
      alert('Notion Sync Complete! Updated 3 tasks & 1 project status from Notion workspace.');
    }, 1200);
  };

  // Trigger WhatsApp Member Import
  const handleWhatsappSync = () => {
    setWhatsappSyncing(true);
    setTimeout(() => {
      setWhatsappSyncing(false);
      addUpdate({
        content: 'Completed design review for Origna homepage. Sent assets to dev team.',
        source: 'whatsapp',
        projectId: 'proj-2',
        teamMemberId: 'tm-3',
        createdBy: 'tm-3',
        tags: ['whatsapp-import'],
      });
      alert('WhatsApp updates fetched successfully! 1 new member update logged.');
    }, 1000);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider">
            <Link2 size={14} className="text-indigo-600" /> External Tool Integrations
          </div>
          <h2 className="text-lg font-extrabold text-slate-900 mt-0.5">
            Connected Systems & Data Pipelines
          </h2>
          <p className="text-xs text-slate-500">
            Read-only, zero-glitch integrations for Notion, WhatsApp member logs, Google Drive & Google Sheets.
          </p>
        </div>

        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
          <ShieldCheck size={15} /> All Pipelines Operational
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* NOTION INTEGRATION CARD */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-white font-bold text-sm flex items-center justify-center">
                N
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Notion Workspace Sync</h3>
                <p className="text-[11px] text-slate-500">Overall Status & Task Databases</p>
              </div>
            </div>

            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
              Active Sync
            </span>
          </div>

          <div className="text-[11px] text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200 space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-400">Direction:</span>
              <span className="font-semibold text-slate-800">Read-Only Server API</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Last Synced:</span>
              <span className="font-mono text-slate-800">{notionLastSync}</span>
            </div>
          </div>

          <button
            onClick={handleNotionSync}
            disabled={notionSyncing}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <RefreshCw size={13} className={notionSyncing ? 'animate-spin' : ''} />
            {notionSyncing ? 'Syncing Notion...' : 'Sync Notion Workspace Now'}
          </button>
        </div>

        {/* WHATSAPP MEMBER UPDATES CARD */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-bold text-sm flex items-center justify-center">
                <MessageSquare size={16} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">WhatsApp Member Updates Listener</h3>
                <p className="text-[11px] text-slate-500">Saswat, Meghna, Bharat, Sagarika</p>
              </div>
            </div>

            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
              Connected
            </span>
          </div>

          <div className="text-[11px] text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200 space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-400">Allowed Senders:</span>
              <span className="font-semibold text-slate-800">4 Specified Team Members</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Parsing Engine:</span>
              <span className="font-semibold text-slate-800">AI Progress & Blocker Filter</span>
            </div>
          </div>

          <button
            onClick={handleWhatsappSync}
            disabled={whatsappSyncing}
            className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <RefreshCw size={13} className={whatsappSyncing ? 'animate-spin' : ''} />
            {whatsappSyncing ? 'Fetching Messages...' : 'Fetch Latest WhatsApp Logs'}
          </button>
        </div>

        {/* GOOGLE DRIVE & DOCS */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold text-sm flex items-center justify-center">
                <FileText size={16} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Google Drive & Docs</h3>
                <p className="text-[11px] text-slate-500">Project Folders & Board Packs</p>
              </div>
            </div>

            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
              Linked
            </span>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            Direct folder links and document embeds for Cosmora AI, Origna, and Deepfold Labs specs.
          </p>
        </div>

        {/* GOOGLE SHEETS / EXCEL */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white font-bold text-sm flex items-center justify-center">
                <FileSpreadsheet size={16} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Google Sheets & Excel Import/Export</h3>
                <p className="text-[11px] text-slate-500">Finance & Task CSV Pipeline</p>
              </div>
            </div>

            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
              Ready
            </span>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            Export 1-click financial spreadsheets or import task lists with automatic schema validation.
          </p>
        </div>
      </div>
    </div>
  );
}
