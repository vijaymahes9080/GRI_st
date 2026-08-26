import React, { useState, useMemo } from 'react';
import { useAppStore } from '../../core/store/appStore';
import { NotificationTemplate } from '../../types';
import {
  FileText,
  Search,
  X,
  Check,
  Tag,
  Sparkles,
  Share2,
  Trash2,
  ChevronRight
} from 'lucide-react';

interface TemplateSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: NotificationTemplate) => void;
}

export const TemplateSelectorModal: React.FC<TemplateSelectorModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
}) => {
  const { notificationTemplates, incrementTemplateUsage, deleteNotificationTemplate } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedRole, setSelectedRole] = useState<string>('ALL');
  const [activePreviewId, setActivePreviewId] = useState<string | null>(null);

  const categories: { label: string; value: string }[] = [
    { label: 'All Categories', value: 'ALL' },
    { label: 'Exams & COE', value: 'EXAM' },
    { label: 'Administration', value: 'ADMIN' },
    { label: 'Academic & R&D', value: 'ACADEMIC' },
    { label: 'Placements & Jobs', value: 'CAREER' },
    { label: 'Admissions & CUET', value: 'ADMISSIONS' },
    { label: 'Rural Extension & NSS', value: 'OUTREACH' },
    { label: 'General / Events', value: 'GENERAL' },
  ];

  const roles: { label: string; value: string }[] = [
    { label: 'All Audiences', value: 'ALL' },
    { label: 'Students Only', value: 'STUDENT' },
    { label: 'Faculty & Research', value: 'FACULTY' },
    { label: 'Administrative Staff', value: 'STAFF' },
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
    if (!activePreviewId) {
      return filteredTemplates[0] || notificationTemplates[0] || null;
    }
    return notificationTemplates.find((t) => t.id === activePreviewId) || filteredTemplates[0] || null;
  }, [activePreviewId, filteredTemplates, notificationTemplates]);

  if (!isOpen) return null;

  const handleApply = (template: NotificationTemplate) => {
    incrementTemplateUsage(template.id);
    onSelectTemplate(template);
    onClose();
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this announcement template?')) {
      setDeletingId(id);
      await deleteNotificationTemplate(id);
      setDeletingId(null);
      if (activePreviewId === id) {
        setActivePreviewId(null);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl h-[88vh] max-h-[800px] flex flex-col overflow-hidden shadow-2xl text-slate-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-950/90 border border-indigo-700/60 flex items-center justify-center text-indigo-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-display">
                  Campus Announcement & Notification Templates
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {notificationTemplates.length} Available
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Choose a pre-formatted circular or recurring notification template to rapidly compose announcements.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters Bar */}
        <div className="px-6 py-3 border-b border-slate-800 bg-slate-900 flex flex-wrap items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keyword, tag (e.g. ESE, Fee, Holiday)..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-indigo-500"
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

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500"
          >
            {categories.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>

          {/* Role Filter */}
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500"
          >
            {roles.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        {/* Content Body (2 Columns: List on left, Rich Preview on right) */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 min-h-0 overflow-hidden">
          {/* Left Column: Template List */}
          <div className="md:col-span-5 border-r border-slate-800 overflow-y-auto p-4 space-y-2.5">
            {filteredTemplates.length === 0 ? (
              <div className="text-center py-12 px-4 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
                  <Search className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-slate-300">No matching templates found</p>
                <p className="text-xs text-slate-500">
                  Try adjusting your search keywords or category filters.
                </p>
              </div>
            ) : (
              filteredTemplates.map((template) => {
                const isSelected = activeTemplate?.id === template.id;
                return (
                  <div
                    key={template.id}
                    onClick={() => setActivePreviewId(template.id)}
                    className={`p-3.5 rounded-2xl border transition cursor-pointer text-left relative group ${
                      isSelected
                        ? 'bg-indigo-950/70 border-indigo-500 shadow-md'
                        : 'bg-slate-950/60 border-slate-800/90 hover:border-slate-700 hover:bg-slate-950'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700 uppercase">
                          {template.category}
                        </span>
                        {template.isBuiltIn ? (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800">
                            Built-in
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                            Custom
                          </span>
                        )}
                        {template.isImportant && (
                          <span className="w-2 h-2 rounded-full bg-rose-500" title="High Priority Alert" />
                        )}
                      </div>

                      {/* Delete custom template action */}
                      {!template.isBuiltIn && (
                        <button
                          onClick={(e) => handleDelete(template.id, e)}
                          title="Delete custom template"
                          className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <h4 className="text-xs font-bold text-white mt-2 line-clamp-1">
                      {template.name}
                    </h4>

                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                      {template.titleTemplate}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2.5 pt-2 border-t border-slate-800/80">
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        Used {template.usageCount || 0} times
                      </span>
                      <span className="flex items-center gap-1 text-indigo-400 font-semibold group-hover:translate-x-0.5 transition">
                        Select
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Column: Active Template Preview */}
          <div className="md:col-span-7 overflow-y-auto p-6 flex flex-col justify-between space-y-5 bg-slate-900/50">
            {activeTemplate ? (
              <div className="space-y-4">
                {/* Template Title & Metadata */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
                        {activeTemplate.category}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                        Target: {activeTemplate.targetRole || 'ALL'}
                      </span>
                      {activeTemplate.isImportant && (
                        <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-950 text-rose-300 border border-rose-800">
                          High Priority Alert
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-400">
                      Author: <strong className="text-slate-200">{activeTemplate.author || 'GRI Admin'}</strong>
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white">
                    {activeTemplate.name}
                  </h3>
                </div>

                {/* Subject Title Template Box */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Announcement Subject Title (Template)
                  </label>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-100">
                    {activeTemplate.titleTemplate}
                  </div>
                </div>

                {/* Message Body Template Box */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Message Body Template
                  </label>
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 whitespace-pre-line leading-relaxed max-h-72 overflow-y-auto font-sans">
                    {activeTemplate.bodyTemplate}
                  </div>
                </div>

                {/* Channels & Tags Preview */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1.5 flex items-center gap-1">
                      <Share2 className="w-3 h-3 text-indigo-400" />
                      <span>Default Dispatch Channels</span>
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
                      <Tag className="w-3 h-3 text-emerald-400" />
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
              </div>
            ) : (
              <div className="text-center py-24 space-y-2 text-slate-500">
                <FileText className="w-10 h-10 mx-auto" />
                <p className="text-sm">Select a template from the list to preview details</p>
              </div>
            )}

            {/* Bottom Apply Action Bar */}
            {activeTemplate && (
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <div className="text-xs text-slate-400">
                  Clicking <strong className="text-white">Apply Template</strong> will populate the composer form with this text.
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApply(activeTemplate)}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 transition shadow-lg shadow-indigo-950"
                  >
                    <Check className="w-4 h-4" />
                    <span>Apply This Template</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
