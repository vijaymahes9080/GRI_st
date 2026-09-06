import React, { useState, useMemo } from 'react';
import { useAppStore } from '../../core/store/appStore';
import { 
  ShieldCheck, 
  Search, 
  Download, 
  Clock, 
  Activity,
  BarChart3,
  TrendingUp
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell
} from 'recharts';

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const breakdown = data.breakdown || {};
    const breakdownEntries = Object.entries(breakdown);

    return (
      <div className="bg-slate-950/95 border border-slate-700/80 p-3 rounded-xl shadow-2xl text-xs backdrop-blur-md min-w-[180px]">
        <div className="font-semibold text-slate-300 text-[11px] mb-1">
          {data.fullDateLabel}
        </div>
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-emerald-400 font-bold text-sm">
            {data.total} {data.total === 1 ? 'Action' : 'Actions'}
          </span>
        </div>
        {data.total > 0 && breakdownEntries.length > 0 ? (
          <div className="border-t border-slate-800 pt-2 space-y-1">
            {breakdownEntries.map(([act, count]) => (
              <div key={act} className="flex items-center justify-between text-[10px]">
                <span className="font-mono text-slate-400">{act}</span>
                <span className="font-bold text-slate-200">{count as number}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-[10px] text-slate-500 italic">No admin actions recorded</div>
        )}
      </div>
    );
  }
  return null;
};

export const AuditLogsViewer: React.FC = () => {
  const { auditLogs } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('ALL');
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');

  // Compute last 30 days data for Recharts
  const { chartData, total30d, activeDaysCount, peakDateLabel } = useMemo(() => {
    const days = 30;
    const data = [];
    const refDate = new Date();

    let totalActions = 0;
    let maxActions = 0;
    let peakLabel = 'None';

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(refDate);
      d.setDate(d.getDate() - i);
      const dateKey = d.toISOString().split('T')[0];
      const displayLabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const weekdayLabel = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

      const dayLogs = auditLogs.filter((log) => {
        if (!log.timestamp) return false;
        const logDate = new Date(log.timestamp);
        if (isNaN(logDate.getTime())) return false;
        return logDate.toISOString().split('T')[0] === dateKey;
      });

      const breakdown: Record<string, number> = {};
      dayLogs.forEach((log) => {
        const act = log.action || 'OTHER';
        breakdown[act] = (breakdown[act] || 0) + 1;
      });

      const dayTotal = dayLogs.length;
      totalActions += dayTotal;

      if (dayTotal > maxActions) {
        maxActions = dayTotal;
        peakLabel = `${displayLabel} (${dayTotal})`;
      }

      data.push({
        dateKey,
        label: displayLabel,
        fullDateLabel: weekdayLabel,
        total: dayTotal,
        breakdown,
      });
    }

    const activeDays = data.filter((d) => d.total > 0).length;

    return {
      chartData: data,
      total30d: totalActions,
      maxDaily: maxActions,
      activeDaysCount: activeDays,
      peakDateLabel: peakLabel,
    };
  }, [auditLogs]);

  const filteredLogs = auditLogs.filter((log) => {
    const matchesAction = actionFilter === 'ALL' || log.action === actionFilter;
    const entityType = ((log as any).entityType || (log as any).resourceType || '');
    const matchesSearch = 
      log.adminName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entityType.toLowerCase().includes(searchQuery.toLowerCase()) ||
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

      {/* 30-Day Activity Frequency Recharts Visualization */}
      <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white font-display">
                  30-Day Administrative Action Frequency
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800/80">
                  Last 30 Days
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Daily frequency distribution of institutional administrative events and security operations.
              </p>
            </div>
          </div>

          {/* Quick Metrics & Chart Toggle */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px]">
              <div>
                <span className="text-slate-500 mr-1">30d Total:</span>
                <span className="font-bold text-emerald-400 font-mono">{total30d}</span>
              </div>
              <div className="h-3 w-px bg-slate-800" />
              <div>
                <span className="text-slate-500 mr-1">Peak Day:</span>
                <span className="font-bold text-slate-200 font-mono">{peakDateLabel}</span>
              </div>
              <div className="h-3 w-px bg-slate-800" />
              <div>
                <span className="text-slate-500 mr-1">Active Days:</span>
                <span className="font-bold text-slate-200 font-mono">{activeDaysCount}/30</span>
              </div>
            </div>

            {/* Toggle Bar vs Line/Area */}
            <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800">
              <button
                type="button"
                onClick={() => setChartType('bar')}
                title="Bar Graph"
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                  chartType === 'bar'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span className="text-[11px] pr-0.5">Bar</span>
              </button>
              <button
                type="button"
                onClick={() => setChartType('line')}
                title="Line Trend"
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                  chartType === 'line'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span className="text-[11px] pr-0.5">Line</span>
              </button>
            </div>
          </div>
        </div>

        {/* Small Screen Metrics Bar */}
        <div className="flex lg:hidden items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px]">
          <div>
            <span className="text-slate-500 mr-1">Total:</span>
            <span className="font-bold text-emerald-400 font-mono">{total30d} actions</span>
          </div>
          <div>
            <span className="text-slate-500 mr-1">Peak:</span>
            <span className="font-bold text-slate-200 font-mono">{peakDateLabel}</span>
          </div>
          <div>
            <span className="text-slate-500 mr-1">Active:</span>
            <span className="font-bold text-slate-200 font-mono">{activeDaysCount}/30d</span>
          </div>
        </div>

        {/* Recharts Container */}
        <div className="h-44 sm:h-52 w-full pt-1">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'bar' ? (
              <BarChart data={chartData} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
                <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="label" 
                  stroke="#64748b" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={{ stroke: '#334155' }}
                  interval={3}
                />
                <YAxis 
                  allowDecimals={false} 
                  stroke="#64748b" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={{ stroke: '#334155' }} 
                />
                <Tooltip 
                  content={<CustomTooltip />} 
                  cursor={{ fill: 'rgba(51, 65, 85, 0.25)' }} 
                />
                <Bar 
                  dataKey="total" 
                  radius={[3, 3, 0, 0]} 
                  maxBarSize={22}
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`bar-cell-${index}`} 
                      fill={entry.total > 0 ? (entry.total >= 3 ? '#34d399' : '#10b981') : '#1e293b'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            ) : (
              <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
                <defs>
                  <linearGradient id="auditEmeraldGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="label" 
                  stroke="#64748b" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={{ stroke: '#334155' }}
                  interval={3}
                />
                <YAxis 
                  allowDecimals={false} 
                  stroke="#64748b" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={{ stroke: '#334155' }} 
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#10b981" 
                  strokeWidth={2} 
                  fillOpacity={1} 
                  fill="url(#auditEmeraldGrad)"
                  activeDot={{ r: 4.5, fill: '#34d399', stroke: '#064e3b', strokeWidth: 2 }}
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
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
          {['ALL', 'CREATE', 'UPDATE', 'DELETE', 'PUBLISH', 'CONFIG_CHANGE', 'APPROVE', 'DISPATCH'].map((act) => (
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
              filteredLogs.map((log) => {
                const entityType = ((log as any).entityType || (log as any).resourceType || 'ENTITY');
                return (
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
                        log.action === 'APPROVE' ? 'bg-teal-950 text-teal-400 border-teal-800' :
                        log.action === 'DISPATCH' ? 'bg-indigo-950 text-indigo-400 border-indigo-800' :
                        'bg-purple-950 text-purple-400 border-purple-800'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className="text-[10px] font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-slate-300">
                        {entityType}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-300 max-w-md">
                      <div>{log.details}</div>
                      {((log as any).entityId || (log as any).resourceId) && (
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                          ID: {(log as any).entityId || (log as any).resourceId}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

