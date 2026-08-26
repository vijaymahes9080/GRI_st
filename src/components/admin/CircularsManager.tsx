import React, { useState } from 'react';
import { useAppStore } from '../../core/store/appStore';
import { CircularItem, NotificationTemplate, MessageChannel } from '../../types';
import { SaveTemplateModal } from './SaveTemplateModal';
import { TemplateSelectorModal } from './TemplateSelectorModal';
import { ManageTemplatesModal } from './ManageTemplatesModal';
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
  Tag,
  BookmarkCheck,
  Sparkles,
  Layers,
  Smartphone,
  MessageSquare,
  Mail,
  Share2,
  Sliders
} from 'lucide-react';

export const CircularsManager: React.FC = () => {
  const { circulars, addCircular, updateCircular, deleteCircular, currentUser, addDispatchedMessage } = useAppStore();

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
  const [selectedChannels, setSelectedChannels] = useState<MessageChannel[]>(['IN_APP', 'EMAIL']);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Template Modals State
  const [isSaveTemplateOpen, setIsSaveTemplateOpen] = useState(false);
  const [isTemplateSelectorOpen, setIsTemplateSelectorOpen] = useState(false);
  const [isManageTemplatesOpen, setIsManageTemplatesOpen] = useState(false);
  const [appliedTemplateName, setAppliedTemplateName] = useState<string | null>(null);

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
    setSelectedChannels(['IN_APP', 'EMAIL']);
    setIsEditing(false);
    setEditingId(null);
    setAppliedTemplateName(null);
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
    setAppliedTemplateName(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApplyTemplate = (template: NotificationTemplate) => {
    setTitle(template.titleTemplate);
    setDescription(template.bodyTemplate);
    if (template.category && ['EXAM', 'ADMISSIONS', 'ACADEMIC', 'OUTREACH', 'TENDER', 'CAREER', 'ADMIN'].includes(template.category)) {
      setCategory(template.category as any);
    }
    if (template.targetRole && ['ALL', 'STUDENT', 'FACULTY', 'STAFF'].includes(template.targetRole)) {
      setTargetRole(template.targetRole as any);
    }
    setIsImportant(!!template.isImportant);
    if (template.channels && template.channels.length > 0) {
      setSelectedChannels(template.channels);
    }
    setAppliedTemplateName(template.name);
    setIsEditing(true);
    setFeedback(`Loaded announcement template: "${template.name}". You can now customize details.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const toggleChannel = (ch: MessageChannel) => {
    if (selectedChannels.includes(ch)) {
      if (selectedChannels.length === 1) return; // keep at least 1
      setSelectedChannels(selectedChannels.filter((c) => c !== ch));
    } else {
      setSelectedChannels([...selectedChannels, ch]);
    }
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

      // Also log multi-channel broadcasts if selected
      if (selectedChannels.includes('SMS') || selectedChannels.includes('WHATSAPP') || selectedChannels.includes('EMAIL')) {
        for (const ch of selectedChannels) {
          await addDispatchedMessage({
            userId: 'broadcast-target',
            userName: `Target Audience: ${targetRole}`,
            recipientEmail: targetRole === 'ALL' ? 'all-campus@ruraluniv.ac.in' : `${targetRole.toLowerCase()}s@ruraluniv.ac.in`,
            recipientPhone: '+91-94431-XXXXX',
            channel: ch,
            type: 'CIRCULAR_ALERT' as any,
            title: `[GRI Broadcast] ${title}`,
            body: description.length > 300 ? `${description.substring(0, 297)}...` : description,
            status: 'DELIVERED',
            sentAt: new Date().toISOString(),
          });
        }
      }

      setFeedback(`Circular broadcasted and published across GRI Portal via ${selectedChannels.join(', ')}.`);
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

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Manage Templates button */}
          <button
            type="button"
            id="manage-templates-btn"
            onClick={() => setIsManageTemplatesOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-indigo-950/80 hover:bg-indigo-900 text-indigo-200 border border-indigo-600/60 font-bold text-xs flex items-center gap-2 transition shadow-sm"
            title="Manage, edit, or delete announcement templates"
          >
            <Sliders className="w-4 h-4 text-indigo-400" />
            <span>Manage Templates</span>
          </button>

          {/* Template library button */}
          <button
            type="button"
            onClick={() => setIsTemplateSelectorOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-2 transition shadow-sm"
            title="Browse and select saved announcement templates"
          >
            <BookmarkCheck className="w-4 h-4 text-indigo-400" />
            <span>Templates Library</span>
          </button>

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
      </div>

      {/* Circular Form Modal / Card (when isEditing is true) */}
      {isEditing && (
        <form onSubmit={handleSubmit} className="bg-slate-900 p-6 rounded-3xl border border-emerald-500/40 shadow-2xl space-y-4 text-xs animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-950 flex items-center justify-center text-emerald-400 border border-emerald-700/50">
                <Edit3 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white font-display">
                  {editingId ? 'Edit Official Circular' : 'Create & Broadcast New Campus Circular'}
                </h3>
                {appliedTemplateName && (
                  <span className="text-[11px] text-indigo-300 font-medium flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-indigo-400" />
                    Loaded from template: <strong>{appliedTemplateName}</strong>
                  </span>
                )}
              </div>
            </div>

            {/* Quick Load & Manage Templates button within form */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsManageTemplatesOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center gap-1.5 transition"
                title="Manage all templates (view, edit, delete)"
              >
                <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                <span>Manage</span>
              </button>
              <button
                type="button"
                onClick={() => setIsTemplateSelectorOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-indigo-950/80 hover:bg-indigo-900/90 text-indigo-300 border border-indigo-700/60 font-semibold text-xs flex items-center gap-1.5 transition"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Load Template</span>
              </button>
              <span className="text-[11px] text-slate-400">Author: {currentUser.name}</span>
            </div>
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
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-emerald-500 font-sans"
            />
          </div>

          {/* Dispatch Channels */}
          <div>
            <label className="block text-slate-400 font-semibold mb-1.5 flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Broadcast Dispatch Channels</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'IN_APP', label: 'In-App Notice', icon: Bell },
                { id: 'EMAIL', label: 'Institutional Email', icon: Mail },
                { id: 'SMS', label: 'SMS Gateway', icon: Smartphone },
                { id: 'WHATSAPP', label: 'WhatsApp Alert', icon: MessageSquare },
              ].map((ch) => {
                const isSelected = selectedChannels.includes(ch.id as MessageChannel);
                const Icon = ch.icon;
                return (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => toggleChannel(ch.id as MessageChannel)}
                    className={`p-2.5 rounded-xl border flex items-center gap-2 transition text-xs font-semibold ${
                      isSelected
                        ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{ch.label}</span>
                  </button>
                );
              })}
            </div>
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

          {/* Form Actions (including Save as Template) */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800">
            {/* Save as Template Button */}
            <button
              type="button"
              id="save-as-template-button"
              onClick={() => {
                if (!title.trim() && !description.trim()) {
                  alert('Please enter a title or message body before saving as a template.');
                  return;
                }
                setIsSaveTemplateOpen(true);
              }}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-indigo-500/40 font-bold text-xs flex items-center justify-center gap-2 transition hover:border-indigo-400"
              title="Save current notice layout and wording as a reusable announcement template"
            >
              <BookmarkCheck className="w-4 h-4 text-indigo-400" />
              <span>Save as Template</span>
            </button>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-900/40 transition"
              >
                <Send className="w-4 h-4" />
                <span>{editingId ? 'Save Changes' : 'Publish & Broadcast Circular'}</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Save Template Modal */}
      <SaveTemplateModal
        isOpen={isSaveTemplateOpen}
        onClose={() => setIsSaveTemplateOpen(false)}
        currentData={{
          title,
          body: description,
          category,
          targetRole,
          isImportant,
          channels: selectedChannels,
        }}
        onSaved={(tpl) => {
          setFeedback(`Template "${tpl.name}" saved! You can load it anytime from Templates Library.`);
          setTimeout(() => setFeedback(null), 4000);
        }}
      />

      {/* Template Selector Modal */}
      <TemplateSelectorModal
        isOpen={isTemplateSelectorOpen}
        onClose={() => setIsTemplateSelectorOpen(false)}
        onSelectTemplate={handleApplyTemplate}
      />

      {/* Manage Templates Modal (Full View, Edit, Delete, Create) */}
      <ManageTemplatesModal
        isOpen={isManageTemplatesOpen}
        onClose={() => setIsManageTemplatesOpen(false)}
        onApplyTemplate={handleApplyTemplate}
      />

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
          <tbody className="divide-y divide-slate-800/60">
            {filteredCirculars.map((circ) => (
              <tr key={circ.id} className="hover:bg-slate-800/40 transition">
                <td className="p-3.5">
                  <div className="font-bold text-slate-100 flex items-center gap-2">
                    {circ.isImportant && <Flame className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />}
                    <span>{circ.title}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                    {circ.description}
                  </div>
                </td>
                <td className="p-3.5">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                    {circ.category}
                  </span>
                </td>
                <td className="p-3.5 text-slate-400">
                  <div>{circ.publishDate}</div>
                  <div className="text-[10px] text-slate-500">{circ.author}</div>
                </td>
                <td className="p-3.5">
                  <span className="text-[11px] font-semibold text-slate-300">
                    {circ.targetRole || 'ALL'}
                  </span>
                </td>
                <td className="p-3.5">
                  {circ.isImportant ? (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800">
                      URGENT
                    </span>
                  ) : (
                    <span className="text-slate-500 text-[11px]">Normal</span>
                  )}
                </td>
                <td className="p-3.5">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                    circ.status === 'PUBLISHED' 
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : circ.status === 'DRAFT'
                      ? 'bg-amber-950 text-amber-300 border border-amber-800'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {circ.status || 'PUBLISHED'}
                  </span>
                </td>
                <td className="p-3.5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleStartEdit(circ)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                      title="Edit circular"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(circ.id, circ.title)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition"
                      title="Delete circular"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
