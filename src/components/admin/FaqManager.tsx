import React, { useState } from 'react';
import { useAppStore } from '../../core/store/appStore';
import { FaqItem } from '../../types';
import { 
  HelpCircle, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  Check, 
  X, 
  ArrowUpDown,
  Tag
} from 'lucide-react';

export const FaqManager: React.FC = () => {
  const { faqs, saveFaq, deleteFaq } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Form states
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState<'ADMISSIONS' | 'EXAMINATIONS' | 'HOSTEL' | 'SCHOLARSHIP' | 'GENERAL' | 'CAMPUS_LIFE'>('ADMISSIONS');
  const [order, setOrder] = useState(1);

  const filteredFaqs = faqs.filter((f) => {
    const matchesCategory = selectedCategory === 'ALL' || f.category === selectedCategory;
    const matchesSearch = 
      f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const resetForm = () => {
    setQuestion('');
    setAnswer('');
    setCategory('ADMISSIONS');
    setOrder(faqs.length + 1);
    setIsEditing(false);
    setEditingId(null);
  };

  const handleStartEdit = (f: FaqItem) => {
    setQuestion(f.question);
    setAnswer(f.answer);
    setCategory(f.category);
    setOrder(f.order || 1);
    setEditingId(f.id);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;

    const faqObj: FaqItem = {
      id: editingId || `faq-${Date.now()}`,
      question,
      answer,
      category,
      order: Number(order) || 1,
    };

    await saveFaq(faqObj);
    setFeedback(`FAQ saved successfully.`);
    resetForm();
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleDelete = async (id: string, q: string) => {
    if (window.confirm(`Delete FAQ: "${q}"?`)) {
      await deleteFaq(id);
      setFeedback(`FAQ deleted.`);
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
            <HelpCircle className="w-5 h-5 text-emerald-400" />
            Frequently Asked Questions (FAQ) & Knowledge Base Control
          </h2>
          <p className="text-xs text-slate-400">
            Maintain curated responses for admissions, hostel allotments, scholarships, and academic rules.
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
          <span>{isEditing ? 'Cancel Editor' : 'Add New FAQ'}</span>
        </button>
      </div>

      {/* Form */}
      {isEditing && (
        <form onSubmit={handleSubmit} className="bg-slate-900 p-6 rounded-3xl border border-emerald-500/40 shadow-2xl space-y-4 text-xs animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white font-display">
              {editingId ? 'Edit FAQ Item' : 'Add New Frequently Asked Question'}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500"
              >
                <option value="ADMISSIONS">Admissions & Eligibility</option>
                <option value="EXAMINATIONS">Examinations & Hall Tickets</option>
                <option value="HOSTEL">Hostel & Dining</option>
                <option value="SCHOLARSHIP">Scholarships & Fee Concessions</option>
                <option value="GENERAL">General Information</option>
                <option value="CAMPUS_LIFE">Campus Life & Shanti Sena</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Display Sort Order</label>
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Question</label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g., What are the documents required during physical certificate verification for PG admissions?"
              required
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Answer</label>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={4}
              placeholder="Provide a clear, detailed, authoritative response..."
              required
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500"
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
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
            >
              Save FAQ
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
            placeholder="Search FAQs by keywords..."
            className="bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-emerald-500 w-full sm:w-72"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {['ALL', 'ADMISSIONS', 'EXAMINATIONS', 'HOSTEL', 'SCHOLARSHIP', 'GENERAL', 'CAMPUS_LIFE'].map((cat) => (
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

      {/* FAQs List */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 text-center text-slate-500 text-xs">
            No FAQs found matching your criteria.
          </div>
        ) : (
          filteredFaqs.map((f) => (
            <div key={f.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                      {f.category}
                    </span>
                    <span className="text-[10px] text-slate-500">Order #{f.order || 1}</span>
                  </div>
                  <h4 className="font-bold text-white text-sm">{f.question}</h4>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleStartEdit(f)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                    title="Edit FAQ"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(f.id, f.question)}
                    className="p-1.5 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-400 border border-rose-800 transition"
                    title="Delete FAQ"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-slate-400 bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 leading-relaxed">
                {f.answer}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
