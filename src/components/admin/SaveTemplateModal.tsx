import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../core/store/appStore';
import { NotificationTemplate, MessageChannel, CircularVisibility } from '../../types';
import { 
  BookmarkCheck, 
  X, 
  Save, 
  Tag, 
  Check, 
  Copy, 
  FileText, 
  Sparkles, 
  AlertCircle,
  Radio
} from 'lucide-react';

interface SaveTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentData: {
    title: string;
    body: string;
    category: any;
    targetRole: any;
    isImportant?: boolean;
    channels?: MessageChannel[];
    visibility?: CircularVisibility;
  };
  onSaved?: (template: NotificationTemplate) => void;
}

export const SaveTemplateModal: React.FC<SaveTemplateModalProps> = ({
  isOpen,
  onClose,
  currentData,
  onSaved,
}) => {
  const { notificationTemplates, saveNotificationTemplate, currentUser } = useAppStore();

  const [mode, setMode] = useState<'NEW' | 'OVERWRITE'>('NEW');
  const [templateName, setTemplateName] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [selectedOverwriteId, setSelectedOverwriteId] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Suggested placeholders list
  const suggestedPlaceholders = ['[Date]', '[Deadline]', '[Semester/Year]', '[Venue]', '[Portal URL]', '[Department]', '[Contact Info]'];

  useEffect(() => {
    if (isOpen) {
      // Pre-fill template name based on title
      const initialName = currentData.title
        ? currentData.title.length > 50
          ? `${currentData.title.substring(0, 47)}...`
          : currentData.title
        : 'Campus Notice Announcement Template';
      setTemplateName(initialName);

      // Default tags based on category
      setTagsInput(currentData.category ? `${currentData.category.toLowerCase()}, circular, notice` : 'notice, campus');
      setMode('NEW');
      setSelectedOverwriteId(notificationTemplates[0]?.id || '');
      setSuccessMsg(null);
      setErrorMsg(null);
    }
  }, [isOpen, currentData, notificationTemplates]);

  if (!isOpen) return null;

  const handleInsertPlaceholder = (token: string) => {
    // Add helper hint
    setTemplateName((prev) => (prev.includes(token) ? prev : `${prev}`));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!templateName.trim()) {
      setErrorMsg('Please provide a name for this announcement template.');
      return;
    }
    if (!currentData.title.trim() && !currentData.body.trim()) {
      setErrorMsg('Cannot save an empty notification template. Ensure title or message body is provided.');
      return;
    }

    setIsSaving(true);
    setErrorMsg(null);

    try {
      const parsedTags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      const targetId = mode === 'OVERWRITE' && selectedOverwriteId
        ? selectedOverwriteId
        : `tpl-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

      const existing = notificationTemplates.find((t) => t.id === targetId);

      const templateToSave: NotificationTemplate = {
        id: targetId,
        name: templateName.trim(),
        category: (currentData.category as any) || 'ACADEMIC',
        targetRole: (currentData.targetRole as any) || 'ALL',
        titleTemplate: currentData.title.trim(),
        bodyTemplate: currentData.body.trim(),
        channels: currentData.channels && currentData.channels.length > 0
          ? currentData.channels
          : ['EMAIL', 'SMS', 'WHATSAPP', 'IN_APP'],
        isImportant: !!currentData.isImportant,
        visibility: currentData.visibility || 'AUTHENTICATED',
        tags: parsedTags.length > 0 ? parsedTags : ['custom', currentData.category?.toLowerCase() || 'notice'],
        author: currentUser.name || 'GRI Administrator',
        createdAt: existing?.createdAt || new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        isBuiltIn: false,
        usageCount: existing?.usageCount || 0,
      };

      await saveNotificationTemplate(templateToSave);
      setSuccessMsg(`Template "${templateToSave.name}" saved successfully!`);
      if (onSaved) onSaved(templateToSave);

      setTimeout(() => {
        setIsSaving(false);
        onClose();
      }, 1200);
    } catch (err: any) {
      console.error('Error saving notification template:', err);
      setErrorMsg(err.message || 'Failed to save template. Please try again.');
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl space-y-5 p-6 text-slate-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-950/90 border border-emerald-700/60 flex items-center justify-center text-emerald-400">
              <BookmarkCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">Save Notification as Template</h3>
              <p className="text-xs text-slate-400">
                Reuse this announcement layout, format, and wording for recurring campus broadcasts.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback banners */}
        {successMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-950/90 border border-emerald-600/70 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-950/90 border border-rose-600/70 text-rose-300 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          {/* Mode Selector (New vs Overwrite) */}
          {notificationTemplates.length > 0 && (
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-2xl border border-slate-800">
              <button
                type="button"
                onClick={() => setMode('NEW')}
                className={`py-2 px-3 rounded-xl font-bold transition text-xs flex items-center justify-center gap-2 ${
                  mode === 'NEW'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Save as New Template</span>
              </button>
              <button
                type="button"
                onClick={() => setMode('OVERWRITE')}
                className={`py-2 px-3 rounded-xl font-bold transition text-xs flex items-center justify-center gap-2 ${
                  mode === 'OVERWRITE'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Update Existing</span>
              </button>
            </div>
          )}

          {/* Overwrite Selector */}
          {mode === 'OVERWRITE' && (
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Select Template to Update</label>
              <select
                value={selectedOverwriteId}
                onChange={(e) => {
                  setSelectedOverwriteId(e.target.value);
                  const selected = notificationTemplates.find((t) => t.id === e.target.value);
                  if (selected) {
                    setTemplateName(selected.name);
                    setTagsInput(selected.tags?.join(', ') || '');
                  }
                }}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500"
              >
                {notificationTemplates.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.category} • {t.isBuiltIn ? 'Built-in' : 'Custom'})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Template Name */}
          <div>
            <label className="block text-slate-400 font-semibold mb-1">
              Template Title / Label <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="e.g., ESE Semester Exam Timetable Announcement"
              required
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-emerald-500"
            />
          </div>

          {/* Category & Target Role preview pills */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Category Preset</label>
              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 font-medium">
                {currentData.category || 'ACADEMIC'}
              </div>
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Target Audience</label>
              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 font-medium">
                {currentData.targetRole || 'ALL'}
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-slate-400 font-semibold mb-1 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-emerald-400" />
              <span>Search Tags (comma separated)</span>
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g., exam, fee, emergency, holiday, rag, samarth"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-emerald-500"
            />
          </div>

          {/* Content Preview Box */}
          <div className="space-y-1.5 pt-1">
            <label className="block text-slate-400 font-semibold flex items-center justify-between">
              <span className="flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                Template Preview
              </span>
              <span className="text-[11px] text-slate-500">
                {currentData.body?.length || 0} characters
              </span>
            </label>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 max-h-48 overflow-y-auto">
              <div className="font-bold text-white text-xs border-b border-slate-800 pb-1.5">
                {currentData.title || '(No Subject Title specified)'}
              </div>
              <p className="text-slate-300 text-xs whitespace-pre-line leading-relaxed">
                {currentData.body || '(No Message Body content specified)'}
              </p>
            </div>
          </div>

          {/* Suggested Placeholders helper */}
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-1.5">
            <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Tip: You can use placeholder markers like:</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {suggestedPlaceholders.map((ph) => (
                <span
                  key={ph}
                  className="px-2 py-0.5 rounded-md bg-slate-800 text-emerald-400 font-mono text-[10px] border border-slate-700"
                >
                  {ph}
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
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
              <span>{isSaving ? 'Saving Template...' : 'Save Template'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
