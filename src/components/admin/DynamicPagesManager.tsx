import React, { useState } from 'react';
import { useAppStore } from '../../core/store/appStore';
import { DynamicPageItem } from '../../types';
import { 
  Layout, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  Check, 
  X, 
  Globe, 
  Eye,
  FileCode,
  CheckCircle2,
  Calendar
} from 'lucide-react';

export const DynamicPagesManager: React.FC = () => {
  const { dynamicPages, saveDynamicPage, deleteDynamicPage, currentUser } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Form states
  const [slug, setSlug] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('About');
  const [content, setContent] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [isPublished, setIsPublished] = useState(true);

  const filteredPages = dynamicPages.filter((p) => {
    return (
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const resetForm = () => {
    setSlug('');
    setTitle('');
    setCategory('About');
    setContent('');
    setMetaDescription('');
    setIsPublished(true);
    setIsEditing(false);
    setEditingSlug(null);
  };

  const handleStartEdit = (page: DynamicPageItem) => {
    setSlug(page.slug);
    setTitle(page.title);
    setCategory(page.category || 'General');
    setContent(page.content);
    setMetaDescription(page.metaDescription || '');
    setIsPublished(page.isPublished);
    setEditingSlug(page.slug);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug.trim() || !title.trim() || !content.trim()) return;

    // Normalize slug to lowercase without spaces
    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-_]/g, '-');

    const pageObj: DynamicPageItem = {
      slug: cleanSlug,
      title,
      category,
      content,
      metaDescription: metaDescription || undefined,
      isPublished,
      lastUpdated: new Date().toISOString().split('T')[0],
      updatedBy: `${currentUser.name} (${currentUser.role})`,
    };

    await saveDynamicPage(pageObj);
    setFeedback(`Dynamic CMS Page saved successfully.`);
    resetForm();
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleDelete = async (targetSlug: string, pageTitle: string) => {
    if (window.confirm(`Are you sure you want to delete custom dynamic page: "${pageTitle}" (/page/${targetSlug})?`)) {
      await deleteDynamicPage(targetSlug);
      setFeedback(`Dynamic page deleted.`);
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
            <Layout className="w-5 h-5 text-emerald-400" />
            Custom Dynamic CMS Pages & Subsections Control
          </h2>
          <p className="text-xs text-slate-400">
            Create and maintain custom dynamic pages without rebuilding the app (e.g. Anti-Ragging, NIRF, Shanti Sena, IQAC).
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
          <span>{isEditing ? 'Cancel Editor' : 'Create Dynamic Page'}</span>
        </button>
      </div>

      {/* Form */}
      {isEditing && (
        <form onSubmit={handleSubmit} className="bg-slate-900 p-6 rounded-3xl border border-emerald-500/40 shadow-2xl space-y-4 text-xs animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white font-display">
              {editingSlug ? 'Edit Dynamic Page' : 'Create Custom Dynamic CMS Page'}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Page Slug (Unique Identifier)</label>
              <div className="flex items-center">
                <span className="bg-slate-950 border border-r-0 border-slate-700 rounded-l-xl px-2.5 py-2.5 text-slate-500 text-xs">
                  /page/
                </span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="iqac-overview"
                  required
                  disabled={!!editingSlug}
                  className="w-full bg-slate-950 border border-slate-700 rounded-r-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500 disabled:opacity-60"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Page Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Internal Quality Assurance Cell (IQAC)"
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Category / Grouping</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Governance / IQAC / Centers"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Meta Description / Summary</label>
            <input
              type="text"
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              placeholder="Short description for search engines and cards..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Page Content (Supports Markdown & HTML Formatting)</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              placeholder="## Overview&#10;&#10;The Gandhigram Rural Institute...&#10;&#10;### Objectives&#10;- Quality sustenance&#10;- Rural innovation"
              required
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 font-mono outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800">
            <input
              type="checkbox"
              id="isPublishedCheckbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-0 accent-emerald-600 cursor-pointer"
            />
            <label htmlFor="isPublishedCheckbox" className="text-slate-300 font-semibold cursor-pointer">
              Publish Page Immediately (Accessible by users via search and dynamic routing)
            </label>
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
              Save Dynamic Page
            </button>
          </div>
        </form>
      )}

      {/* Pages Table */}
      <div className="overflow-x-auto bg-slate-900 rounded-2xl border border-slate-800 shadow-xl">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-bold uppercase text-[11px]">
              <th className="p-3.5">Page Title & Slug</th>
              <th className="p-3.5">Category</th>
              <th className="p-3.5">Last Updated & Author</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300">
            {filteredPages.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">
                  No dynamic pages registered yet.
                </td>
              </tr>
            ) : (
              filteredPages.map((page) => (
                <tr key={page.slug} className="hover:bg-slate-800/40 transition">
                  <td className="p-3.5">
                    <div className="font-bold text-white text-xs">{page.title}</div>
                    <div className="text-[11px] font-mono text-emerald-400 mt-0.5">
                      /page/{page.slug}
                    </div>
                  </td>
                  <td className="p-3.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                      {page.category || 'General'}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <div className="text-slate-200">{page.lastUpdated}</div>
                    <div className="text-[10px] text-slate-500">{page.updatedBy || 'Administrator'}</div>
                  </td>
                  <td className="p-3.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      page.isPublished ? 'bg-emerald-950 text-emerald-400 border-emerald-800' : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      {page.isPublished ? 'Live' : 'Draft'}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <div className="inline-flex items-center gap-1 justify-end">
                      <button
                        onClick={() => handleStartEdit(page)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                        title="Edit Page"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(page.slug, page.title)}
                        className="p-1.5 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-400 border border-rose-800 transition"
                        title="Delete Page"
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
