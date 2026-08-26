import React, { useState, useMemo } from 'react';
import { useAppStore } from '../../core/store/appStore';
import { NotificationTemplate, CircularCategory, UserRole, MessageChannel } from '../../types';
import {
  FileText,
  Search,
  X,
  Edit3,
  Trash2,
  Plus,
  Copy,
  Save,
  Check,
  Tag,
  Sparkles,
  BookmarkCheck,
  Share2,
  Mail,
  Smartphone,
  MessageSquare,
  Bell,
  AlertCircle,
  Clock,
  ChevronRight,
  RotateCcw,
  Download,
  Flame,
  CheckCircle2
} from 'lucide-react';

interface ManageTemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyTemplate?: (template: NotificationTemplate) => void;
}

export const ManageTemplatesModal: React.FC<ManageTemplatesModalProps> = ({
  isOpen,
  onClose,
  onApplyTemplate,
}) => {
  const { 
    notificationTemplates, 
    saveNotificationTemplate, 
    deleteNotificationTemplate,
    incrementTemplateUsage,
    currentUser 
  } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedRole, setSelectedRole] = useState<string>('ALL');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  // Editor mode state
  const [isEditing, setIsEditing] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  
  // Form fields for editing/creating
  const [formId, setFormId] = useState('');
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<CircularCategory>('ACADEMIC');
  const [formTargetRole, setFormTargetRole] = useState<UserRole | 'ALL'>('ALL');
  const [formTitleTemplate, setFormTitleTemplate] = useState('');
  const [formBodyTemplate, setFormBodyTemplate] = useState('');
  const [formChannels, setFormChannels] = useState<MessageChannel[]>(['IN_APP', 'EMAIL']);
  const [formIsImportant, setFormIsImportant] = useState(false);
  const [formTags, setFormTags] = useState('');
  
  // UI states
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const categories: { label: string; value: string }[] = [
    { label: 'All Categories', value: 'ALL' },
    { label: 'Exams & Timetables', value: 'EXAM' },
    { label: 'Administration & Orders', value: 'ADMIN' },
    { label: 'Academic & Research', value: 'ACADEMIC' },
    { label: 'Placements & Careers', value: 'CAREER' },
    { label: 'Admissions & CUET', value: 'ADMISSIONS' },
    { label: 'Rural Outreach & NSS', value: 'OUTREACH' },
    { label: 'General University', value: 'GENERAL' },
  ];

  const suggestedPlaceholders = [
    '[Date]',
    '[Deadline Date]',
    '[Semester/Batch]',
    '[Venue / Room]',
    '[Department Name]',
    '[Portal URL / Link]',
    '[Contact Officer]',
    '[Designation / CTC]',
  ];

  const filteredTemplates = useMemo(() => {
    return notificationTemplates.filter((tpl) => {
      const matchCategory = selectedCategory === 'ALL' || tpl.category === selectedCategory;
      const matchRole = selectedRole === 'ALL' || tpl.targetRole === 'ALL' || tpl.targetRole === selectedRole;
      
      const query = searchQuery.toLowerCase().trim();
      const matchSearch =
        !query ||
        tpl.name.toLowerCase().includes(query) ||
        tpl.titleTemplate.toLowerCase().includes(query) ||
        tpl.bodyTemplate.toLowerCase().includes(query) ||
        tpl.tags?.some((t) => t.toLowerCase().includes(query)) ||
        tpl.author?.toLowerCase().includes(query);

      return matchCategory && matchRole && matchSearch;
    });
  }, [notificationTemplates, selectedCategory, selectedRole, searchQuery]);

  const activeTemplate = useMemo(() => {
    if (!selectedTemplateId) {
      return filteredTemplates[0] || notificationTemplates[0] || null;
    }
    return notificationTemplates.find((t) => t.id === selectedTemplateId) || filteredTemplates[0] || null;
  }, [selectedTemplateId, filteredTemplates, notificationTemplates]);

  if (!isOpen) return null;

  const startEditTemplate = (tpl: NotificationTemplate) => {
    setFormId(tpl.id);
    setFormName(tpl.name);
    setFormCategory(tpl.category);
    setFormTargetRole(tpl.targetRole);
    setFormTitleTemplate(tpl.titleTemplate);
    setFormBodyTemplate(tpl.bodyTemplate);
    setFormChannels(tpl.channels || ['IN_APP', 'EMAIL']);
    setFormIsImportant(!!tpl.isImportant);
    setFormTags(tpl.tags?.join(', ') || '');
    setIsCreatingNew(false);
    setIsEditing(true);
    setFeedback(null);
  };

  const startCreateNewTemplate = () => {
    setFormId(`tpl-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`);
    setFormName('');
    setFormCategory('ACADEMIC');
    setFormTargetRole('ALL');
    setFormTitleTemplate('');
    setFormBodyTemplate('');
    setFormChannels(['IN_APP', 'EMAIL', 'WHATSAPP', 'SMS']);
    setFormIsImportant(false);
    setFormTags('circular, campus, notice');
    setIsCreatingNew(true);
    setIsEditing(true);
    setFeedback(null);
  };

  const handleDuplicate = (tpl: NotificationTemplate) => {
    setFormId(`tpl-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`);
    setFormName(`${tpl.name} (Copy)`);
    setFormCategory(tpl.category);
    setFormTargetRole(tpl.targetRole);
    setFormTitleTemplate(tpl.titleTemplate);
    setFormBodyTemplate(tpl.bodyTemplate);
    setFormChannels(tpl.channels || ['IN_APP', 'EMAIL']);
    setFormIsImportant(!!tpl.isImportant);
    setFormTags(tpl.tags ? `${tpl.tags.join(', ')}, copy` : 'copy');
    setIsCreatingNew(true);
    setIsEditing(true);
    setFeedback({ type: 'success', message: `Cloned "${tpl.name}". You can now customize and save it.` });
  };

  const handleToggleChannel = (ch: MessageChannel) => {
    if (formChannels.includes(ch)) {
      if (formChannels.length === 1) return; // Keep at least one
      setFormChannels(formChannels.filter((c) => c !== ch));
    } else {
      setFormChannels([...formChannels, ch]);
    }
  };

  const handleInsertPlaceholder = (token: string) => {
    setFormBodyTemplate((prev) => `${prev} ${token}`);
  };

  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formTitleTemplate.trim() || !formBodyTemplate.trim()) {
      setFeedback({ type: 'error', message: 'Please provide Template Name, Subject Title, and Message Body.' });
      return;
    }

    setIsSaving(true);
    setFeedback(null);

    try {
      const parsedTags = formTags
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      const existing = notificationTemplates.find((t) => t.id === formId);

      const templateToSave: NotificationTemplate = {
        id: formId,
        name: formName.trim(),
        category: formCategory,
        targetRole: formTargetRole,
        titleTemplate: formTitleTemplate.trim(),
        bodyTemplate: formBodyTemplate.trim(),
        channels: formChannels,
        isImportant: formIsImportant,
        visibility: 'AUTHENTICATED',
        tags: parsedTags.length > 0 ? parsedTags : ['custom', formCategory.toLowerCase()],
        author: existing?.author || currentUser.name || 'GRI Administrator',
        createdAt: existing?.createdAt || new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        isBuiltIn: !!existing?.isBuiltIn && !isCreatingNew,
        usageCount: existing?.usageCount || 0,
      };

      await saveNotificationTemplate(templateToSave);
      setSelectedTemplateId(templateToSave.id);
      setIsEditing(false);
      setIsCreatingNew(false);
      setFeedback({ type: 'success', message: `Template "${templateToSave.name}" saved successfully!` });
      setTimeout(() => setFeedback(null), 3500);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to save announcement template.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (templateId: string) => {
    try {
      const tpl = notificationTemplates.find((t) => t.id === templateId);
      await deleteNotificationTemplate(templateId);
      setConfirmDeleteId(null);
      if (selectedTemplateId === templateId) {
        setSelectedTemplateId(null);
      }
      setFeedback({ type: 'success', message: `Deleted template "${tpl?.name || templateId}".` });
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      setFeedback({ type: 'error', message: 'Failed to delete template.' });
    }
  };

  const handleApplyToComposer = (tpl: NotificationTemplate) => {
    incrementTemplateUsage(tpl.id);
    if (onApplyTemplate) {
      onApplyTemplate(tpl);
    }
    onClose();
  };

  const exportTemplatesJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(notificationTemplates, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `gri_notification_templates_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-6xl h-[90vh] max-h-[850px] flex flex-col overflow-hidden shadow-2xl text-slate-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-950/90 border border-indigo-700/60 flex items-center justify-center text-indigo-400">
              <BookmarkCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-base font-bold text-white font-display">
                  Manage Announcement & Notification Templates
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {notificationTemplates.length} Templates Saved
                </span>
              </div>
              <p className="text-xs text-slate-400">
                View, create, edit, customize, or delete reusable circular blueprints for campus broadcasts.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportTemplatesJSON}
              title="Export all templates as JSON backup"
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export JSON</span>
            </button>

            <button
              onClick={startCreateNewTemplate}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Create Template</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Feedback alert banner */}
        {feedback && (
          <div className={`px-6 py-2.5 text-xs font-semibold flex items-center justify-between animate-fadeIn border-b ${
            feedback.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-800 text-emerald-300'
              : 'bg-rose-950/90 border-rose-800 text-rose-300'
          }`}>
            <div className="flex items-center gap-2">
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400" />
              )}
              <span>{feedback.message}</span>
            </div>
            <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Main Work Area: 2 Columns */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 min-h-0 overflow-hidden">
          
          {/* Left Column (5 Cols): List & Filtering */}
          <div className="md:col-span-5 border-r border-slate-800 flex flex-col min-h-0 bg-slate-950/40">
            {/* Search and Filters */}
            <div className="p-3.5 border-b border-slate-800 space-y-2 bg-slate-900/60">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search templates by title, tag, or text..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-indigo-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-indigo-500"
                >
                  {categories.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-indigo-500"
                >
                  <option value="ALL">All Audiences</option>
                  <option value="STUDENT">Students Only</option>
                  <option value="FACULTY">Faculty Only</option>
                  <option value="STAFF">Staff Only</option>
                </select>
              </div>
            </div>

            {/* Template Card Items */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
              {filteredTemplates.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
                    <Search className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-slate-300">No matching templates</p>
                  <button
                    onClick={startCreateNewTemplate}
                    className="text-xs text-emerald-400 hover:underline inline-flex items-center gap-1 font-semibold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Create a new template now
                  </button>
                </div>
              ) : (
                filteredTemplates.map((template) => {
                  const isSelected = activeTemplate?.id === template.id;
                  return (
                    <div
                      key={template.id}
                      onClick={() => {
                        setSelectedTemplateId(template.id);
                        if (isEditing) setIsEditing(false);
                      }}
                      className={`p-3 rounded-2xl border transition cursor-pointer text-left relative group ${
                        isSelected
                          ? 'bg-indigo-950/70 border-indigo-500 shadow-md'
                          : 'bg-slate-900/70 border-slate-800/90 hover:border-slate-700 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-slate-800 text-slate-300 border border-slate-700 uppercase">
                            {template.category}
                          </span>
                          {template.isBuiltIn ? (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-950 text-blue-300 border border-blue-800">
                              Built-in
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                              Custom
                            </span>
                          )}
                          {template.isImportant && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-950 text-rose-300 border border-rose-800 flex items-center gap-0.5">
                              <Flame className="w-2.5 h-2.5 text-rose-400" />
                              Urgent
                            </span>
                          )}
                        </div>

                        {/* Card quick actions */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              startEditTemplate(template);
                            }}
                            title="Edit template"
                            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition opacity-80 group-hover:opacity-100"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDuplicate(template);
                            }}
                            title="Duplicate template"
                            className="p-1 rounded-lg text-slate-400 hover:text-indigo-300 hover:bg-slate-800 transition opacity-80 group-hover:opacity-100"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <h4 className="text-xs font-bold text-white mt-1.5 line-clamp-1">
                        {template.name}
                      </h4>

                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 font-sans">
                        {template.titleTemplate}
                      </p>

                      <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2 pt-1.5 border-t border-slate-800/80">
                        <span className="flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-400" />
                          Used {template.usageCount || 0} times
                        </span>
                        <span className="text-indigo-400 font-semibold flex items-center gap-0.5">
                          View details
                          <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column (7 Cols): Detailed Preview OR Inline Editor */}
          <div className="md:col-span-7 flex flex-col min-h-0 bg-slate-900/60 overflow-y-auto">
            {isEditing ? (
              /* --- EDIT / CREATE FORM MODE --- */
              <form onSubmit={handleSaveForm} className="p-6 space-y-4 text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-950 border border-emerald-700/60 flex items-center justify-center text-emerald-400">
                      {isCreatingNew ? <Plus className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white font-display">
                        {isCreatingNew ? 'Create New Announcement Template' : `Edit Template: ${formName || 'Untitled'}`}
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Define reusable subject headlines, message body placeholders, and dispatch channels.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Template Name */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Template Display Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g., ESE Semester Examinations Timetable Alert"
                    required
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-indigo-500 font-medium"
                  />
                </div>

                {/* Category & Target Audience */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Academic / Admin Category
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as CircularCategory)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-200 outline-none focus:border-indigo-500"
                    >
                      <option value="EXAM">EXAM (Examinations & COE)</option>
                      <option value="ADMIN">ADMIN (Administrative Orders)</option>
                      <option value="ACADEMIC">ACADEMIC (Curriculum & R&D)</option>
                      <option value="CAREER">CAREER (Placements & Drives)</option>
                      <option value="ADMISSIONS">ADMISSIONS (CUET & Spot)</option>
                      <option value="OUTREACH">OUTREACH (Shanti Sena & NSS)</option>
                      <option value="TENDER">TENDER (Procurement)</option>
                      <option value="GENERAL">GENERAL (Campus Events)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Target Audience
                    </label>
                    <select
                      value={formTargetRole}
                      onChange={(e) => setFormTargetRole(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-200 outline-none focus:border-indigo-500"
                    >
                      <option value="ALL">ALL (Entire University)</option>
                      <option value="STUDENT">STUDENT (UG, PG & Ph.D. Scholars)</option>
                      <option value="FACULTY">FACULTY (Teaching Staff & Supervisors)</option>
                      <option value="STAFF">STAFF (Administrative & Technical)</option>
                    </select>
                  </div>
                </div>

                {/* Announcement Subject Title */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Announcement Subject Line (Template) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formTitleTemplate}
                    onChange={(e) => setFormTitleTemplate(e.target.value)}
                    placeholder="e.g., End Semester Examinations (ESE) [Session] - Timetable & Hall Ticket Release"
                    required
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-indigo-500 font-medium"
                  />
                </div>

                {/* Message Body Template */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-slate-300 font-semibold">
                      Message Body Content (Template) <span className="text-rose-400">*</span>
                    </label>
                    <span className="text-[10px] text-slate-400">{formBodyTemplate.length} chars</span>
                  </div>
                  <textarea
                    value={formBodyTemplate}
                    onChange={(e) => setFormBodyTemplate(e.target.value)}
                    rows={6}
                    placeholder="Type official notification body text. Use placeholders like [Date], [Deadline], [Semester], [Venue]..."
                    required
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-indigo-500 font-sans leading-relaxed"
                  />
                </div>

                {/* Quick Placeholders Toolbar */}
                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>Quick Insert Placeholder Markers:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {suggestedPlaceholders.map((ph) => (
                      <button
                        key={ph}
                        type="button"
                        onClick={() => handleInsertPlaceholder(ph)}
                        className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-emerald-300 font-mono text-[10px] border border-slate-700 transition"
                      >
                        + {ph}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dispatch Channels Selection */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5 flex items-center gap-1">
                    <Share2 className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Default Dispatch Channels</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'IN_APP', label: 'In-App Notice', icon: Bell },
                      { id: 'EMAIL', label: 'Institutional Email', icon: Mail },
                      { id: 'SMS', label: 'SMS Gateway', icon: Smartphone },
                      { id: 'WHATSAPP', label: 'WhatsApp Alert', icon: MessageSquare },
                    ].map((ch) => {
                      const isChecked = formChannels.includes(ch.id as MessageChannel);
                      const Icon = ch.icon;
                      return (
                        <button
                          key={ch.id}
                          type="button"
                          onClick={() => handleToggleChannel(ch.id as MessageChannel)}
                          className={`p-2 rounded-xl border flex items-center gap-1.5 transition text-xs font-semibold ${
                            isChecked
                              ? 'bg-indigo-950/70 border-indigo-500 text-indigo-300'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{ch.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Priority & Tags */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1">
                      <Tag className="w-3 h-3 text-slate-400" />
                      <span>Search Tags (comma-separated)</span>
                    </label>
                    <input
                      type="text"
                      value={formTags}
                      onChange={(e) => setFormTags(e.target.value)}
                      placeholder="e.g. ese, exam, fee, samarth, timetable"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-slate-200 outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="flex items-center pt-5">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formIsImportant}
                        onChange={(e) => setFormIsImportant(e.target.checked)}
                        className="rounded border-slate-700 text-rose-600 focus:ring-rose-500 w-4 h-4"
                      />
                      <span className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-rose-500" />
                        Mark as Urgent / High Priority Alert
                      </span>
                    </label>
                  </div>
                </div>

                {/* Form Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    disabled={isSaving}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-2 transition shadow-lg shadow-emerald-950 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSaving ? 'Saving Template...' : 'Save Template Changes'}</span>
                  </button>
                </div>
              </form>
            ) : (
              /* --- VIEW / PREVIEW MODE --- */
              activeTemplate ? (
                <div className="p-6 flex flex-col justify-between h-full space-y-5">
                  <div className="space-y-4">
                    {/* Top Metadata Header */}
                    <div className="flex items-start justify-between flex-wrap gap-2 pb-3 border-b border-slate-800">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-950 text-indigo-300 border border-indigo-800 uppercase">
                            {activeTemplate.category}
                          </span>
                          <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                            Audience: {activeTemplate.targetRole || 'ALL'}
                          </span>
                          {activeTemplate.isBuiltIn ? (
                            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-950 text-blue-300 border border-blue-800">
                              Built-in University Blueprint
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                              Custom Saved Template
                            </span>
                          )}
                          {activeTemplate.isImportant && (
                            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-950 text-rose-300 border border-rose-800 flex items-center gap-1">
                              <Flame className="w-3 h-3 text-rose-400" />
                              High Priority
                            </span>
                          )}
                        </div>

                        <h3 className="text-base font-bold text-white mt-2">
                          {activeTemplate.name}
                        </h3>
                      </div>

                      {/* Header Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => startEditTemplate(activeTemplate)}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center gap-1.5 transition"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDuplicate(activeTemplate)}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center gap-1.5 transition"
                        >
                          <Copy className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Duplicate</span>
                        </button>
                        
                        {/* Delete custom template */}
                        {!activeTemplate.isBuiltIn && (
                          <button
                            onClick={() => setConfirmDeleteId(activeTemplate.id)}
                            className="px-3 py-1.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800 font-semibold text-xs flex items-center gap-1.5 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Delete Confirmation Prompt */}
                    {confirmDeleteId === activeTemplate.id && (
                      <div className="p-4 rounded-2xl bg-rose-950/90 border border-rose-700 text-rose-200 text-xs space-y-2 animate-fadeIn">
                        <div className="font-bold flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-rose-400" />
                          <span>Confirm Template Deletion</span>
                        </div>
                        <p>
                          Are you sure you want to permanently delete <strong>"{activeTemplate.name}"</strong>? This action cannot be undone.
                        </p>
                        <div className="flex items-center justify-end gap-2 pt-1">
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleDelete(activeTemplate.id)}
                            className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold"
                          >
                            Yes, Delete
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Subject Line Preview */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                        Announcement Subject Line (Template)
                      </label>
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-100">
                        {activeTemplate.titleTemplate}
                      </div>
                    </div>

                    {/* Body Preview */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                        Message Body Content
                      </label>
                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 whitespace-pre-line leading-relaxed max-h-64 overflow-y-auto font-sans">
                        {activeTemplate.bodyTemplate}
                      </div>
                    </div>

                    {/* Dispatch Channels and Tags Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1.5 flex items-center gap-1">
                          <Share2 className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Configured Dispatch Channels</span>
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {activeTemplate.channels?.map((ch) => (
                            <span
                              key={ch}
                              className="px-2 py-0.5 rounded-md bg-slate-950 text-slate-300 border border-slate-800 text-[10px] font-bold"
                            >
                              {ch}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1.5 flex items-center gap-1">
                          <Tag className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Keywords & Tags</span>
                        </label>
                        <div className="flex flex-wrap gap-1">
                          {activeTemplate.tags?.map((tg) => (
                            <span
                              key={tg}
                              className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px]"
                            >
                              #{tg}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Meta info */}
                    <div className="text-[11px] text-slate-500 pt-2 flex items-center justify-between border-t border-slate-800/80">
                      <span>Author: <strong className="text-slate-400">{activeTemplate.author || 'GRI Administrator'}</strong></span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Last modified: {activeTemplate.updatedAt || activeTemplate.createdAt || 'N/A'}
                      </span>
                    </div>
                  </div>

                  {/* Bottom Apply Action Bar */}
                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                    <div className="text-xs text-slate-400">
                      Populate circular composer with this announcement blueprint.
                    </div>
                    <button
                      type="button"
                      id="apply-template-btn"
                      onClick={() => handleApplyToComposer(activeTemplate)}
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 transition shadow-lg shadow-indigo-950"
                    >
                      <Check className="w-4 h-4" />
                      <span>Use This Template Now</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-28 space-y-3 text-slate-500">
                  <FileText className="w-12 h-12 mx-auto" />
                  <p className="text-sm font-semibold">Select a template from the list on the left to preview details</p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
