import React, { useState } from 'react';
import { useAppStore } from '../../core/store/appStore';
import { QuickLinkItem } from '../../types';
import { 
  Link2, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  Check, 
  X, 
  ExternalLink,
  Globe
} from 'lucide-react';

export const QuickLinksManager: React.FC = () => {
  const { quickLinks, saveQuickLink, deleteQuickLink } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState<'PORTAL' | 'GOVT' | 'ACADEMIC' | 'SERVICES' | 'STUDENT'>('PORTAL');
  const [icon, setIcon] = useState('ExternalLink');
  const [description, setDescription] = useState('');
  const [order, setOrder] = useState(1);

  const filteredLinks = quickLinks.filter((l) => {
    const matchesCategory = selectedCategory === 'ALL' || l.category === selectedCategory;
    const matchesSearch = 
      l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.url.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const resetForm = () => {
    setTitle('');
    setUrl('');
    setCategory('PORTAL');
    setIcon('ExternalLink');
    setDescription('');
    setOrder(quickLinks.length + 1);
    setIsEditing(false);
    setEditingId(null);
  };

  const handleStartEdit = (link: QuickLinkItem) => {
    setTitle(link.title);
    setUrl(link.url);
    setCategory(link.category);
    setIcon(link.icon || 'ExternalLink');
    setDescription(link.description || '');
    setOrder(link.order || 1);
    setEditingId(link.id);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;

    const linkObj: QuickLinkItem = {
      id: editingId || `link-${Date.now()}`,
      title,
      url,
      category,
      icon,
      description: description || undefined,
      order: Number(order) || 1,
    };

    await saveQuickLink(linkObj);
    setFeedback(`Quick link saved.`);
    resetForm();
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Delete quick link "${name}"?`)) {
      await deleteQuickLink(id);
      setFeedback(`Quick link deleted.`);
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
            <Link2 className="w-5 h-5 text-emerald-400" />
            External Portals, Government Initiatives & Quick Links Control
          </h2>
          <p className="text-xs text-slate-400">
            Configure hyperlinks to Samarth ERP, Swayam/NPTEL, DigiLocker, NAD, AISHE, and MoE portals.
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
          <span>{isEditing ? 'Cancel Editor' : 'Add Quick Link'}</span>
        </button>
      </div>

      {/* Form */}
      {isEditing && (
        <form onSubmit={handleSubmit} className="bg-slate-900 p-6 rounded-3xl border border-emerald-500/40 shadow-2xl space-y-4 text-xs animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white font-display">
              {editingId ? 'Edit Quick Link' : 'Register External Portal Link'}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500"
              >
                <option value="PORTAL">University ERP & Portals</option>
                <option value="GOVT">Government / MoE / UGC</option>
                <option value="ACADEMIC">E-Learning & Digital Library</option>
                <option value="SERVICES">Student & Campus Services</option>
                <option value="STUDENT">Student Welfare</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Link Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Samarth E-Gov Portal"
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Display Order</label>
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Destination URL</label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://gri.samarth.ac.in"
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Description (Optional)</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Student and faculty academic management portal"
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
              Save Link
            </button>
          </div>
        </form>
      )}

      {/* Links Table */}
      <div className="overflow-x-auto bg-slate-900 rounded-2xl border border-slate-800 shadow-xl">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-bold uppercase text-[11px]">
              <th className="p-3.5">Title & Description</th>
              <th className="p-3.5">Category</th>
              <th className="p-3.5">Target Destination URL</th>
              <th className="p-3.5">Order</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300">
            {filteredLinks.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">
                  No quick links found.
                </td>
              </tr>
            ) : (
              filteredLinks.map((link) => (
                <tr key={link.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3.5">
                    <div className="font-bold text-white text-xs">{link.title}</div>
                    {link.description && <div className="text-[11px] text-slate-400 mt-0.5">{link.description}</div>}
                  </td>
                  <td className="p-3.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                      {link.category}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-400 hover:underline flex items-center gap-1 font-mono text-[11px]"
                    >
                      <span>{link.url}</span>
                      <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    </a>
                  </td>
                  <td className="p-3.5 text-slate-400">
                    #{link.order || 1}
                  </td>
                  <td className="p-3.5 text-right">
                    <div className="inline-flex items-center gap-1 justify-end">
                      <button
                        onClick={() => handleStartEdit(link)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                        title="Edit Link"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(link.id, link.title)}
                        className="p-1.5 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-400 border border-rose-800 transition"
                        title="Delete Link"
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
