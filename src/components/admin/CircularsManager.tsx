import React, { useState } from 'react';
import { useAppStore } from '../../core/store/appStore';
import { CircularItem } from '../../types';
import { 
  Bell, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  Check, 
  X, 
  AlertCircle, 
  Flame, 
  FileText, 
  Eye,
  Send,
  Calendar,
  Tag
} from 'lucide-react';

export const CircularsManager: React.FC = () => {
  const { circulars, addCircular, updateCircular, deleteCircular, currentUser } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'EXAM' | 'ADMISSIONS' | 'ACADEMIC' | 'OUTREACH' | 'TENDER' | 'CAREER' | 'ADMIN'>('ACADEMIC');
  const [description, setDescription] = useState('');
  const [targetRole, setTargetRole] = useState<'ALL' | 'STUDENT' | 'FACULTY' | 'STAFF'>('ALL');
  const [isImportant, setIsImportant] = useState(false);
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [status, setStatus] = useState<'PUBLISHED' | 'DRAFT' | 'ARCHIVED'>('PUBLISHED');
  const [feedback, setFeedback] = useState<string | null>(null);

  const filteredCirculars = circulars.filter((c) => {
    const matchesCategory = selectedCategory === 'ALL' || c.category === selectedCategory;
    const matchesSearch = 
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const resetForm = () => {
    setTitle('');
    setCategory('ACADEMIC');
    setDescription('');
    setTargetRole('ALL');
    setIsImportant(false);
    setAttachmentUrl('');
    setStatus('PUBLISHED');
    setIsEditing(false);
    setEditingId(null);
  };

  const handleStartEdit = (circ: CircularItem) => {
    setTitle(circ.title);
    setCategory(circ.category);
    setDescription(circ.description);
    setTargetRole(circ.targetRole || 'ALL');
    setIsImportant(!!circ.isImportant);
    setAttachmentUrl(circ.attachmentUrl || '');
    setStatus(circ.status || 'PUBLISHED');
    setEditingId(circ.id);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    if (isEditing && editingId) {
      await updateCircular(editingId, {
        title,
        category,
        description,
        targetRole,
        isImportant,
        attachmentUrl: attachmentUrl || undefined,
        status,
      });
      setFeedback(`Circular updated successfully.`);
    } else {
      await addCircular({
        title,
        category,
        description,
        publishDate: new Date().toISOString().split('T')[0],
        targetRole,
        isImportant,
        attachmentUrl: attachmentUrl || undefined,
        author: `${currentUser.name} (${currentUser.designation || currentUser.role})`,
        status,
      });
      setFeedback(`Circular broadcasted and published across GRI Portal.`);
    }

    resetForm();
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleDelete = async (id: string, itemTitle: string) => {
    if (window.confirm(`Are you sure you want to permanently delete circular: "${itemTitle}"?`)) {
      await deleteCircular(id);
      setFeedback(`Circular deleted.`);
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Feedback Banner */}
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

      {/* Top Header & Composer Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white font-display flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-400" />
            Official University Circulars & Announcements Control
          </h2>
          <p className="text-xs text-slate-400">
            Publish, edit, urgent-broadcast, and archive notices shown on homepage, student feeds, and SMS alerts.
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
          <span>{isEditing ? 'Cancel Editor' : 'Compose New Circular'}</span>
        </button>
      </div>

      {/* Circular Form Modal / Card (when isEditing is true) */}
      {isEditing && (
        <form onSubmit={handleSubmit} className="bg-slate-900 p-6 rounded-3xl border border-emerald-500/40 shadow-2xl space-y-4 text-xs animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-emerald-400" />
              <span>{editingId ? 'Edit Official Circular' : 'Create & Broadcast New Circular'}</span>
            </h3>
            <span className="text-[11px] text-slate-400">Author: {currentUser.name}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500"
              >
                <option value="EXAM">Examination (ESE)</option>
                <option value="ADMISSIONS">Admissions 2026-27</option>
                <option value="ACADEMIC">Academic & Curricula</option>
                <option value="OUTREACH">Shanti Sena / Outreach</option>
                <option value="TENDER">Tender Notice</option>
                <option value="CAREER">Career Recruitment</option>
                <option value="ADMIN">Administrative Order</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Target Audience</label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500"
              >
                <option value="ALL">Entire GRI Community (All)</option>
                <option value="STUDENT">Enrolled Students Only</option>
                <option value="FACULTY">Faculty & Research Scholars</option>
                <option value="STAFF">Administrative Staff</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Publishing Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500"
              >
                <option value="PUBLISHED">Published (Visible to All)</option>
                <option value="DRAFT">Draft (Admin Only)</option>
                <option value="ARCHIVED">Archived (Stored in Historical)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Circular Title / Subject Header</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., ESE April/May 2026 Regular & Arrear Examination Timetable"
              required
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Full Detailed Notification Body</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              placeholder="Provide comprehensive details, dates, venues, deadlines, reference circular number, and instructions..."
              required
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Attachment / PDF Official Document URL (Optional)</label>
            <input
              type="url"
              value={attachmentUrl}
              onChange={(e) => setAttachmentUrl(e.target.value)}
              placeholder="https://ruraluniv.ac.in/includes/circulars/ese_timetable_2026.pdf"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 placeholder-slate-500 outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800">
            <input
              type="checkbox"
              id="isImportantCheckbox"
              checked={isImportant}
              onChange={(e) => setIsImportant(e.target.checked)}
              className="w-4 h-4 rounded text-rose-600 focus:ring-0 accent-rose-600 cursor-pointer"
            />
            <label htmlFor="isImportantCheckbox" className="text-slate-300 font-semibold cursor-pointer flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-rose-500" />
              <span>Mark as High Priority / Urgent Notice (Displays on Live Banner Ticker & Top Alerts)</span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-2 shadow-lg shadow-emerald-900/40"
            >
              <Send className="w-4 h-4" />
              <span>{editingId ? 'Save Changes' : 'Publish Circular'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search circulars by title or keyword..."
            className="bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-emerald-500 w-full sm:w-72"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {['ALL', 'EXAM', 'ADMISSIONS', 'ACADEMIC', 'OUTREACH', 'TENDER', 'CAREER', 'ADMIN'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Circulars List Table */}
      <div className="overflow-x-auto bg-slate-900 rounded-2xl border border-slate-800 shadow-xl">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-bold uppercase text-[11px]">
              <th className="p-3.5">Title & Subject</th>
              <th className="p-3.5">Category</th>
              <th className="p-3.5">Date & Author</th>
              <th className="p-3.5">Target</th>
              <th className="p-3.5">Priority</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300">
            {filteredCirculars.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-500">
                  No circulars found matching your criteria.
                </td>
              </tr>
            ) : (
              filteredCirculars.map((circ) => (
                <tr key={circ.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3.5 max-w-sm">
                    <div className="font-bold text-white text-xs">{circ.title}</div>
                    <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{circ.description}</div>
                    {circ.attachmentUrl && (
                      <a 
                        href={circ.attachmentUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-[10px] text-emerald-400 hover:underline inline-flex items-center gap-1 mt-1"
                      >
                        <FileText className="w-3 h-3" />
                        <span>View Attachment PDF</span>
                      </a>
                    )}
                  </td>
                  <td className="p-3.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                      {circ.category}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <div className="text-slate-200">{circ.publishDate}</div>
                    <div className="text-[10px] text-slate-500">{circ.author || 'University Admin'}</div>
                  </td>
                  <td className="p-3.5">
                    <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                      {circ.targetRole || 'ALL'}
                    </span>
                  </td>
                  <td className="p-3.5">
                    {circ.isImportant ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800 flex items-center gap-1 w-fit">
                        <Flame className="w-3 h-3" />
                        URGENT
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500">Standard</span>
                    )}
                  </td>
                  <td className="p-3.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      circ.status === 'ARCHIVED' ? 'bg-slate-800 text-slate-400 border-slate-700' :
                      circ.status === 'DRAFT' ? 'bg-amber-950 text-amber-400 border-amber-800' :
                      'bg-emerald-950 text-emerald-400 border-emerald-800'
                    }`}>
                      {circ.status || 'PUBLISHED'}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <div className="inline-flex items-center gap-1 justify-end">
                      <button
                        onClick={() => handleStartEdit(circ)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                        title="Edit Circular"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(circ.id, circ.title)}
                        className="p-1.5 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-400 border border-rose-800 transition"
                        title="Delete Circular"
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
