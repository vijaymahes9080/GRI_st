import React, { useState } from 'react';
import { useAppStore } from '../../core/store/appStore';
import { GrievanceTicket } from '../../types';
import { 
  AlertCircle, 
  Search, 
  Check, 
  X, 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  User,
  Building,
  Send
} from 'lucide-react';

export const GrievanceManager: React.FC = () => {
  const { grievances, updateGrievanceStatus, currentUser } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedTicket, setSelectedTicket] = useState<GrievanceTicket | null>(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [newStatus, setNewStatus] = useState<'PENDING' | 'IN_REVIEW' | 'RESOLVED' | 'REJECTED'>('IN_REVIEW');
  const [feedback, setFeedback] = useState<string | null>(null);

  const filteredGrievances = grievances.filter((g) => {
    const matchesStatus = statusFilter === 'ALL' || g.status === statusFilter;
    const matchesSearch = 
      g.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.studentRollNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleOpenTicket = (t: GrievanceTicket) => {
    setSelectedTicket(t);
    setNewStatus(t.status);
    setResponseMessage(t.officialResponse || '');
  };

  const handleSaveResolution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket) return;

    await updateGrievanceStatus(selectedTicket.id, newStatus, responseMessage);
    setFeedback(`Grievance ticket #${selectedTicket.id} updated with resolution.`);
    setSelectedTicket(null);
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="space-y-6">
      {feedback && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/90 border border-emerald-600/60 text-emerald-300 text-xs flex items-center justify-between shadow-lg animate-fadeIn">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{feedback}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-emerald-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
        <h2 className="text-lg font-bold text-white font-display flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-rose-400" />
          UGC Mandated Student Grievance Redressal & Support Desk
        </h2>
        <p className="text-xs text-slate-400">
          Review, investigate, assign, and officially resolve student grievances regarding hostels, examinations, scholarships, and campus facilities.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tickets by roll number, name, subject..."
            className="bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-emerald-500 w-full sm:w-80"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {['ALL', 'PENDING', 'IN_REVIEW', 'RESOLVED', 'REJECTED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                statusFilter === st
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Grievance Table */}
      <div className="overflow-x-auto bg-slate-900 rounded-2xl border border-slate-800 shadow-xl">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-bold uppercase text-[11px]">
              <th className="p-3.5">Ticket & Date</th>
              <th className="p-3.5">Student Info</th>
              <th className="p-3.5">Category & Subject</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300">
            {filteredGrievances.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">
                  No grievance tickets in this category.
                </td>
              </tr>
            ) : (
              filteredGrievances.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3.5 whitespace-nowrap">
                    <div className="font-mono text-xs font-bold text-white">#{ticket.id}</div>
                    <div className="text-[10px] text-slate-400">{ticket.createdAt}</div>
                  </td>
                  <td className="p-3.5">
                    <div className="font-bold text-slate-200">{ticket.studentName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{ticket.studentRollNumber} • {ticket.department}</div>
                  </td>
                  <td className="p-3.5 max-w-sm">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                        {ticket.category}
                      </span>
                    </div>
                    <div className="font-semibold text-white text-xs">{ticket.subject}</div>
                    <div className="text-[11px] text-slate-400 line-clamp-1">{ticket.description}</div>
                  </td>
                  <td className="p-3.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      ticket.status === 'RESOLVED' ? 'bg-emerald-950 text-emerald-400 border-emerald-800' :
                      ticket.status === 'IN_REVIEW' ? 'bg-sky-950 text-sky-400 border-sky-800' :
                      ticket.status === 'PENDING' ? 'bg-amber-950 text-amber-400 border-amber-800' :
                      'bg-rose-950 text-rose-400 border-rose-800'
                    }`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => handleOpenTicket(ticket)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-[11px] transition"
                    >
                      Process Ticket
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Ticket Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSaveResolution} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-xl w-full space-y-4 text-xs animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white font-display">
                  Grievance Redressal Ticket #{selectedTicket.id}
                </h3>
                <span className="text-[10px] text-slate-400">Filed on {selectedTicket.createdAt}</span>
              </div>
              <button type="button" onClick={() => setSelectedTicket(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Student: <strong>{selectedTicket.studentName}</strong> ({selectedTicket.studentRollNumber})</span>
                <span className="text-slate-400">Dept: <strong>{selectedTicket.department}</strong></span>
              </div>
              <div className="font-bold text-white text-xs">{selectedTicket.subject}</div>
              <p className="text-slate-300 text-xs leading-relaxed">{selectedTicket.description}</p>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Update Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500"
              >
                <option value="PENDING">Pending Initial Review</option>
                <option value="IN_REVIEW">Under Active Investigation</option>
                <option value="RESOLVED">Resolved / Redressed</option>
                <option value="REJECTED">Rejected / Ineligible</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Official Administrative Response / Redressal Note</label>
              <textarea
                value={responseMessage}
                onChange={(e) => setResponseMessage(e.target.value)}
                rows={4}
                placeholder="Provide official resolution remarks, action taken, and guidance for the student..."
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedTicket(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-900/40"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Save Resolution</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
