import React, { useState } from 'react';
import { useAppStore } from '../../core/store/appStore';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  Download, 
  Clock, 
  User, 
  Layers, 
  Activity,
  Trash2
} from 'lucide-react';

export const AuditLogsViewer: React.FC = () => {
  const { auditLogs } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('ALL');

  const filteredLogs = auditLogs.filter((log) => {
    const matchesAction = actionFilter === 'ALL' || log.action === actionFilter;
    const matchesSearch = 
      log.adminName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.entityType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.adminEmail.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesAction && matchesSearch;
  });

  const exportAsJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(auditLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `gri_audit_trail_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white font-display flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            Administrative Security Audit Trail & Activity Logs
          </h2>
          <p className="text-xs text-slate-400">
            Immutable tracking of all content additions, modifications, deletions, broadcasts, and system configuration updates.
          </p>
        </div>

        <button
          onClick={exportAsJSON}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-2 transition"
        >
          <Download className="w-3.5 h-3.5 text-emerald-400" />
          <span>Export Audit Trail (JSON)</span>
        </button>
      </div>

      {/* Search and Action Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search audit trail by admin, action, target..."
            className="bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-emerald-500 w-full sm:w-80"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {['ALL', 'CREATE', 'UPDATE', 'DELETE', 'PUBLISH', 'CONFIG_CHANGE', 'CRASH'].map((act) => (
            <button
              key={act}
              onClick={() => setActionFilter(act)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                actionFilter === act
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {act}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="overflow-x-auto bg-slate-900 rounded-2xl border border-slate-800 shadow-xl">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-bold uppercase text-[11px]">
              <th className="p-3.5">Timestamp</th>
              <th className="p-3.5">Administrator</th>
              <th className="p-3.5">Action</th>
              <th className="p-3.5">Entity Type</th>
              <th className="p-3.5">Action Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">
                  No audit log entries matching criteria.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3.5 whitespace-nowrap text-slate-400 font-mono text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="p-3.5">
                    <div className="font-bold text-white text-xs">{log.adminName}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{log.adminEmail}</div>
                  </td>
                  <td className="p-3.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      log.action === 'CREATE' ? 'bg-emerald-950 text-emerald-400 border-emerald-800' :
                      log.action === 'UPDATE' ? 'bg-sky-950 text-sky-400 border-sky-800' :
                      log.action === 'DELETE' ? 'bg-rose-950 text-rose-400 border-rose-800' :
                      log.action === 'PUBLISH' ? 'bg-amber-950 text-amber-400 border-amber-800' :
                      'bg-purple-950 text-purple-400 border-purple-800'
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span className="text-[10px] font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-slate-300">
                      {log.entityType}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-300 max-w-md">
                    <div>{log.details}</div>
                    {log.entityId && (
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">ID: {log.entityId}</div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
