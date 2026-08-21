import React, { useState } from 'react';
import { useAppStore } from '../../core/store/appStore';
import { AiKnowledgeSource } from '../../types';
import { 
  Brain, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  Check, 
  X, 
  RefreshCw, 
  FileText, 
  Globe, 
  Layers, 
  Database,
  Sparkles
} from 'lucide-react';

export const AiKnowledgeManager: React.FC = () => {
  const { aiKnowledgeSources, saveAiKnowledgeSource, deleteAiKnowledgeSource, currentUser } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'ADMISSION' | 'ACADEMIC' | 'GENERAL' | 'REGULATIONS' | 'EXAMS' | 'HOSTEL'>('ADMISSION');
  const [sourceType, setSourceType] = useState<'DOCUMENT' | 'WEBSITE' | 'CIRCULAR' | 'MANUAL_FAQ'>('DOCUMENT');
  const [url, setUrl] = useState('');
  const [rawText, setRawText] = useState('');

  const filteredSources = aiKnowledgeSources.filter((s) => {
    return (
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.rawText && s.rawText.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const resetForm = () => {
    setTitle('');
    setCategory('ADMISSION');
    setSourceType('DOCUMENT');
    setUrl('');
    setRawText('');
    setIsEditing(false);
    setEditingId(null);
  };

  const handleStartEdit = (source: AiKnowledgeSource) => {
    setTitle(source.title);
    setCategory(source.category);
    setSourceType(source.sourceType);
    setUrl(source.url || '');
    setRawText(source.rawText || '');
    setEditingId(source.id);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const sourceObj: AiKnowledgeSource = {
      id: editingId || `ai-src-${Date.now()}`,
      title,
      category,
      sourceType,
      url: url || undefined,
      rawText: rawText || undefined,
      vectorSyncStatus: 'INDEXED',
      lastSynced: new Date().toISOString().split('T')[0],
      totalChunks: Math.ceil((rawText.length || 500) / 400),
    };

    await saveAiKnowledgeSource(sourceObj);
    setFeedback(`AI Knowledge Source indexed & synced with RAG pipeline.`);
    resetForm();
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Delete AI knowledge source "${name}"? This removes it from chatbot embeddings.`)) {
      await deleteAiKnowledgeSource(id);
      setFeedback(`Source removed from vector store.`);
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const handleSyncEmbeddings = async (source: AiKnowledgeSource) => {
    setIsSyncing(source.id);
    // Simulate re-indexing
    await new Promise((resolve) => setTimeout(resolve, 1200));
    await saveAiKnowledgeSource({
      ...source,
      vectorSyncStatus: 'INDEXED',
      lastSynced: new Date().toISOString().split('T')[0],
    });
    setIsSyncing(null);
    setFeedback(`Embeddings re-calculated for "${source.title}".`);
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
      <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white font-display flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-400" />
            GRI AI Assistant — RAG Knowledge Base & Vector Indexing
          </h2>
          <p className="text-xs text-slate-400">
            Feed official documents, prospectuses, ordinances, and websites directly into the Gemini RAG retrieval pipeline.
          </p>
        </div>

        <button
          onClick={() => {
            if (isEditing) resetForm();
            else setIsEditing(true);
          }}
          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 transition shadow-md shadow-purple-900/40"
        >
          {isEditing ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          <span>{isEditing ? 'Cancel Editor' : 'Add Knowledge Source'}</span>
        </button>
      </div>

      {/* Form */}
      {isEditing && (
        <form onSubmit={handleSubmit} className="bg-slate-900 p-6 rounded-3xl border border-purple-500/40 shadow-2xl space-y-4 text-xs animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>{editingId ? 'Edit Knowledge Source' : 'Ingest New University Knowledge Source'}</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Knowledge Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-purple-500"
              >
                <option value="ADMISSION">Admissions & CUET Eligibility</option>
                <option value="ACADEMIC">Academic Curricula & Credits</option>
                <option value="REGULATIONS">Statutory Regulations & Acts</option>
                <option value="EXAMS">Examinations & Evaluation</option>
                <option value="HOSTEL">Hostel Life & Rules</option>
                <option value="GENERAL">General Institution History</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Source Ingestion Type</label>
              <select
                value={sourceType}
                onChange={(e) => setSourceType(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-purple-500"
              >
                <option value="DOCUMENT">PDF / Official Document</option>
                <option value="WEBSITE">Website Scraping URL</option>
                <option value="CIRCULAR">Administrative Circular</option>
                <option value="MANUAL_FAQ">Manual Curated Text / FAQs</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Source URL / PDF Link (Optional)</label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://ruraluniv.ac.in/prospectus.pdf"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Source Title / Reference Subject</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., GRI Admission Prospectus 2026-27 (Eligibility, Cut-offs & Fees)"
              required
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">
              Raw Knowledge Corpus Text (Used directly for Chunking & Semantic Vector Retrieval)
            </label>
            <textarea
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              rows={8}
              placeholder="Paste extracted text, regulations, guidelines, fees table, or syllabus overview..."
              required
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 font-mono outline-none focus:border-purple-500"
            />
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
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold flex items-center gap-1.5 shadow-lg shadow-purple-900/40"
            >
              <Database className="w-4 h-4" />
              <span>Index & Save to RAG</span>
            </button>
          </div>
        </form>
      )}

      {/* Sources Table */}
      <div className="overflow-x-auto bg-slate-900 rounded-2xl border border-slate-800 shadow-xl">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-bold uppercase text-[11px]">
              <th className="p-3.5">Knowledge Document Title</th>
              <th className="p-3.5">Category</th>
              <th className="p-3.5">Type</th>
              <th className="p-3.5">Chunks & Synced</th>
              <th className="p-3.5">Vector Status</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300">
            {filteredSources.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">
                  No knowledge sources ingested yet.
                </td>
              </tr>
            ) : (
              filteredSources.map((source) => (
                <tr key={source.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3.5 max-w-sm">
                    <div className="font-bold text-white text-xs">{source.title}</div>
                    {source.rawText && (
                      <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5 font-mono">
                        {source.rawText}
                      </div>
                    )}
                  </td>
                  <td className="p-3.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-950 text-purple-300 border border-slate-800">
                      {source.category}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-300">
                    {source.sourceType}
                  </td>
                  <td className="p-3.5">
                    <div className="text-slate-200">{source.totalChunks || 1} chunks</div>
                    <div className="text-[10px] text-slate-500">{source.lastSynced || 'Today'}</div>
                  </td>
                  <td className="p-3.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1 w-fit">
                      <Check className="w-3 h-3" />
                      {source.vectorSyncStatus || 'INDEXED'}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <div className="inline-flex items-center gap-1 justify-end">
                      <button
                        onClick={() => handleSyncEmbeddings(source)}
                        disabled={isSyncing === source.id}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-300 transition"
                        title="Re-calculate Embeddings"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isSyncing === source.id ? 'animate-spin' : ''}`} />
                      </button>
                      <button
                        onClick={() => handleStartEdit(source)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                        title="Edit Source"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(source.id, source.title)}
                        className="p-1.5 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-400 border border-rose-800 transition"
                        title="Delete Source"
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
