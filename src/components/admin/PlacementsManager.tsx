import React, { useState } from 'react';
import { useAppStore } from '../../core/store/appStore';
import { PlacementItem } from '../../types';
import { 
  Briefcase, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  Check, 
  X, 
  DollarSign, 
  Building, 
  Calendar,
  ExternalLink,
  Users
} from 'lucide-react';

export const PlacementsManager: React.FC = () => {
  const { placements, savePlacement, deletePlacement } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Form states
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState('');
  const [packageLPA, setPackageLPA] = useState('');
  const [eligibility, setEligibility] = useState('');
  const [deadline, setDeadline] = useState('');
  const [driveDate, setDriveDate] = useState('');
  const [location, setLocation] = useState('');
  const [applyUrl, setApplyUrl] = useState('');
  const [status, setStatus] = useState<'UPCOMING' | 'ONGOING' | 'COMPLETED'>('UPCOMING');

  const filteredPlacements = placements.filter((p) => {
    return (
      p.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.eligibility.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const resetForm = () => {
    setCompanyName('');
    setRole('');
    setPackageLPA('');
    setEligibility('');
    setDeadline('');
    setDriveDate('');
    setLocation('');
    setApplyUrl('');
    setStatus('UPCOMING');
    setIsEditing(false);
    setEditingId(null);
  };

  const handleStartEdit = (p: PlacementItem) => {
    setCompanyName(p.companyName);
    setRole(p.role);
    setPackageLPA(p.packageLPA);
    setEligibility(p.eligibility);
    setDeadline(p.deadline);
    setDriveDate(p.driveDate || '');
    setLocation(p.location || '');
    setApplyUrl(p.applyUrl || '');
    setStatus(p.status || 'UPCOMING');
    setEditingId(p.id);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !role.trim()) return;

    const placementObj: PlacementItem = {
      id: editingId || `plc-${Date.now()}`,
      companyName,
      role,
      packageLPA,
      eligibility,
      deadline,
      driveDate: driveDate || undefined,
      location: location || undefined,
      applyUrl: applyUrl || undefined,
      status,
    };

    await savePlacement(placementObj);
    setFeedback(`Placement drive record saved.`);
    resetForm();
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Delete recruitment drive listing for "${name}"?`)) {
      await deletePlacement(id);
      setFeedback(`Placement drive deleted.`);
      setTimeout(() => setFeedback(null), 3000);
    }
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
      <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white font-display flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-emerald-400" />
            Placement Bureau & Corporate Drives Control
          </h2>
          <p className="text-xs text-slate-400">
            Publish campus recruitment drives, eligibility criteria, CTC compensation packages, and application links.
          </p>
        </div>

        <button
          onClick={() => {
            if (isEditing) resetForm();
            else setIsEditing(true);
          }}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 transition shadow-md shadow-emerald-900/40"
        >
          {isEditing ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          <span>{isEditing ? 'Cancel Editor' : 'Post Placement Drive'}</span>
        </button>
      </div>

      {/* Editor Form */}
      {isEditing && (
        <form onSubmit={handleSubmit} className="bg-slate-900 p-6 rounded-3xl border border-emerald-500/40 shadow-2xl space-y-4 text-xs animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white font-display">
              {editingId ? 'Edit Placement Drive' : 'Post New Campus Recruitment Drive'}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Company / Recruiting Organization</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g., Tata Consultancy Services (TCS)"
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Job Role / Profile</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g., Software Development Engineer (SDE)"
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">CTC Compensation Package</label>
              <input
                type="text"
                value={packageLPA}
                onChange={(e) => setPackageLPA(e.target.value)}
                placeholder="e.g., ₹7.5 LPA - ₹9.0 LPA"
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Application Deadline</label>
              <input
                type="text"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                placeholder="e.g., 2026-09-20"
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Drive Date / Schedule</label>
              <input
                type="text"
                value={driveDate}
                onChange={(e) => setDriveDate(e.target.value)}
                placeholder="e.g., 2026-09-28"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500"
              >
                <option value="UPCOMING">Upcoming Drive</option>
                <option value="ONGOING">Ongoing Assessments</option>
                <option value="COMPLETED">Drive Concluded</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Eligibility Criteria</label>
              <input
                type="text"
                value={eligibility}
                onChange={(e) => setEligibility(e.target.value)}
                placeholder="e.g., B.Tech / MCA / M.Sc CS with 60%+ in 10th, 12th & Degree"
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Application / Portal Link</label>
              <input
                type="url"
                value={applyUrl}
                onChange={(e) => setApplyUrl(e.target.value)}
                placeholder="https://tcs.careers/campus/register"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
            >
              Save Placement Listing
            </button>
          </div>
        </form>
      )}

      {/* Placements Table */}
      <div className="overflow-x-auto bg-slate-900 rounded-2xl border border-slate-800 shadow-xl">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-bold uppercase text-[11px]">
              <th className="p-3.5">Company & Role</th>
              <th className="p-3.5">CTC Package</th>
              <th className="p-3.5">Eligibility</th>
              <th className="p-3.5">Deadline & Drive Date</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300">
            {filteredPlacements.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">
                  No placement records available.
                </td>
              </tr>
            ) : (
              filteredPlacements.map((plc) => (
                <tr key={plc.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3.5">
                    <div className="font-bold text-white text-xs">{plc.companyName}</div>
                    <div className="text-[11px] text-emerald-400 font-medium">{plc.role}</div>
                    {plc.applyUrl && (
                      <a
                        href={plc.applyUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] text-sky-400 hover:underline inline-flex items-center gap-1 mt-0.5"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Registration Link</span>
                      </a>
                    )}
                  </td>
                  <td className="p-3.5 font-bold text-amber-300">
                    {plc.packageLPA}
                  </td>
                  <td className="p-3.5 max-w-xs text-slate-300">
                    {plc.eligibility}
                  </td>
                  <td className="p-3.5">
                    <div className="text-slate-200">Deadline: <strong>{plc.deadline}</strong></div>
                    {plc.driveDate && <div className="text-[10px] text-slate-400">Drive: {plc.driveDate}</div>}
                  </td>
                  <td className="p-3.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      plc.status === 'UPCOMING' ? 'bg-emerald-950 text-emerald-400 border-emerald-800' :
                      plc.status === 'ONGOING' ? 'bg-amber-950 text-amber-400 border-amber-800' :
                      'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      {plc.status || 'UPCOMING'}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <div className="inline-flex items-center gap-1 justify-end">
                      <button
                        onClick={() => handleStartEdit(plc)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                        title="Edit Drive"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(plc.id, plc.companyName)}
                        className="p-1.5 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-400 border border-rose-800 transition"
                        title="Delete Drive"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
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
