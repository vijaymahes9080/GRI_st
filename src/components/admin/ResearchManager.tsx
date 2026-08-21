import React, { useState } from 'react';
import { useAppStore } from '../../core/store/appStore';
import { ResearchItem } from '../../types';
import { 
  FlaskConical, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  Check, 
  X, 
  DollarSign, 
  Award, 
  Calendar,
  Building2
} from 'lucide-react';

export const ResearchManager: React.FC = () => {
  const { researchProjects, saveResearchProject, deleteResearchProject } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [pi, setPi] = useState('');
  const [fundingAgency, setFundingAgency] = useState('DST-SERB');
  const [grantAmount, setGrantAmount] = useState('');
  const [duration, setDuration] = useState('3 Years (2024-2027)');
  const [status, setStatus] = useState<'ONGOING' | 'COMPLETED' | 'SANCTIONED'>('ONGOING');
  const [department, setDepartment] = useState('Department of Chemistry');

  const filteredProjects = researchProjects.filter((r) => {
    return (
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.principalInvestigator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.fundingAgency.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.department && r.department.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const resetForm = () => {
    setTitle('');
    setPi('');
    setFundingAgency('DST-SERB');
    setGrantAmount('');
    setDuration('3 Years (2024-2027)');
    setStatus('ONGOING');
    setDepartment('Department of Chemistry');
    setIsEditing(false);
    setEditingId(null);
  };

  const handleStartEdit = (r: ResearchItem) => {
    setTitle(r.title);
    setPi(r.principalInvestigator);
    setFundingAgency(r.fundingAgency);
    setGrantAmount(r.grantAmount);
    setDuration(r.duration);
    setStatus(r.status || 'ONGOING');
    setDepartment(r.department || 'General');
    setEditingId(r.id);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !pi.trim()) return;

    const projectObj: ResearchItem = {
      id: editingId || `res-${Date.now()}`,
      title,
      principalInvestigator: pi,
      fundingAgency,
      grantAmount,
      duration,
      status,
      department,
    };

    await saveResearchProject(projectObj);
    setFeedback(`Research project grant saved.`);
    resetForm();
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Delete research project "${name}"?`)) {
      await deleteResearchProject(id);
      setFeedback(`Research project deleted.`);
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
            <FlaskConical className="w-5 h-5 text-emerald-400" />
            Sponsored Research Projects & Extramural Grants Control
          </h2>
          <p className="text-xs text-slate-400">
            Manage sanctioned research grants from DST, DBT, UGC, ICSSR, CSIR, and ISRO with Principal Investigators and funding budgets.
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
          <span>{isEditing ? 'Cancel Editor' : 'Add Funded Project'}</span>
        </button>
      </div>

      {/* Form */}
      {isEditing && (
        <form onSubmit={handleSubmit} className="bg-slate-900 p-6 rounded-3xl border border-emerald-500/40 shadow-2xl space-y-4 text-xs animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white font-display">
              {editingId ? 'Edit Research Project Grant' : 'Add New Sponsored Research Project'}
            </h3>
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Project Title / Investigation Charter</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Development of Biochar Nanocomposites for Heavy Metal Decontamination in Rural Water"
              required
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Principal Investigator (PI)</label>
              <input
                type="text"
                value={pi}
                onChange={(e) => setPi(e.target.value)}
                placeholder="Dr. S. Meenakshi"
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Funding Agency</label>
              <select
                value={fundingAgency}
                onChange={(e) => setFundingAgency(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500"
              >
                <option value="DST-SERB">DST-SERB (Dept of Science & Tech)</option>
                <option value="DBT">DBT (Dept of Biotechnology)</option>
                <option value="UGC-DAE">UGC-DAE Consortium</option>
                <option value="ICSSR">ICSSR (Social Science Research)</option>
                <option value="CSIR">CSIR New Delhi</option>
                <option value="ISRO-RESPOND">ISRO RESPOND</option>
                <option value="MNRE">MNRE (Renewable Energy)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Grant Budget (₹)</label>
              <input
                type="text"
                value={grantAmount}
                onChange={(e) => setGrantAmount(e.target.value)}
                placeholder="₹48,50,000"
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Academic Department</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="Department of Chemistry"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Project Duration</label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="3 Years (2024-2027)"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Project Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500"
              >
                <option value="ONGOING">Ongoing</option>
                <option value="COMPLETED">Completed</option>
                <option value="SANCTIONED">Sanctioned / Awaiting Funds</option>
              </select>
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
              Save Project
            </button>
          </div>
        </form>
      )}

      {/* Projects Table */}
      <div className="overflow-x-auto bg-slate-900 rounded-2xl border border-slate-800 shadow-xl">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-bold uppercase text-[11px]">
              <th className="p-3.5">Research Investigation Title</th>
              <th className="p-3.5">Principal Investigator</th>
              <th className="p-3.5">Funding Body</th>
              <th className="p-3.5">Grant Amount</th>
              <th className="p-3.5">Duration</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300">
            {filteredProjects.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-500">
                  No research project grants recorded.
                </td>
              </tr>
            ) : (
              filteredProjects.map((proj) => (
                <tr key={proj.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3.5 max-w-sm">
                    <div className="font-bold text-white text-xs">{proj.title}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{proj.department}</div>
                  </td>
                  <td className="p-3.5 font-semibold text-slate-200">
                    {proj.principalInvestigator}
                  </td>
                  <td className="p-3.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-950 text-sky-400 border border-slate-800">
                      {proj.fundingAgency}
                    </span>
                  </td>
                  <td className="p-3.5 font-bold text-emerald-400">
                    {proj.grantAmount}
                  </td>
                  <td className="p-3.5 text-slate-400">
                    {proj.duration}
                  </td>
                  <td className="p-3.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      proj.status === 'ONGOING' ? 'bg-emerald-950 text-emerald-400 border-emerald-800' :
                      proj.status === 'COMPLETED' ? 'bg-slate-800 text-slate-400 border-slate-700' :
                      'bg-amber-950 text-amber-400 border-amber-800'
                    }`}>
                      {proj.status || 'ONGOING'}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <div className="inline-flex items-center gap-1 justify-end">
                      <button
                        onClick={() => handleStartEdit(proj)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                        title="Edit Project"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(proj.id, proj.title)}
                        className="p-1.5 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-400 border border-rose-800 transition"
                        title="Delete Project"
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
