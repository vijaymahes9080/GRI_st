import React, { useState } from 'react';
import { useAppStore } from '../../core/store/appStore';
import { MessageSquareWarning, X, Send, Check } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, addGrievance } = useAppStore();
  const [type, setType] = useState<'BUG_REPORT' | 'FEATURE_REQUEST'>('BUG_REPORT');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Portal & UI');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    await addGrievance({
      category: type === 'BUG_REPORT' ? 'Bug Report' : 'Feature Request',
      subject: `[${type === 'BUG_REPORT' ? 'Bug' : 'Feature'}] ${subject}`,
      description: `${description}\n\n[Category: ${category}]`,
      submittedBy: `${currentUser.name} (${currentUser.regNumber || currentUser.email})`,
      role: currentUser.role,
      department: currentUser.department,
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setSubject('');
      setDescription('');
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
              <MessageSquareWarning className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Admin Portal Feedback</h3>
              <p className="text-xs text-gray-500">Report bugs or request new features</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-gray-900 dark:text-white text-sm">Feedback Sent to Admin Portal!</h4>
            <p className="text-xs text-gray-500">Thank you for helping us improve GRI digital services.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-gray-600 dark:text-gray-400 font-semibold mb-1">Feedback Type</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setType('BUG_REPORT')}
                  className={`py-2 px-3 rounded-xl font-bold border transition ${
                    type === 'BUG_REPORT'
                      ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800'
                      : 'bg-gray-50 text-gray-600 border-gray-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                  }`}
                >
                  Report a Bug
                </button>
                <button
                  type="button"
                  onClick={() => setType('FEATURE_REQUEST')}
                  className={`py-2 px-3 rounded-xl font-bold border transition ${
                    type === 'FEATURE_REQUEST'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800'
                      : 'bg-gray-50 text-gray-600 border-gray-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                  }`}
                >
                  Request Feature
                </button>
              </div>
            </div>

            <div>
              <label className="block text-gray-600 dark:text-gray-400 font-semibold mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-2.5 text-gray-900 dark:text-white outline-none focus:border-emerald-500"
              >
                <option value="Portal & UI">Portal & Mobile UI</option>
                <option value="Academics & ERP">Academics & Samarth ERP</option>
                <option value="Hostel & Mess">Hostel & Mess Facilities</option>
                <option value="Library">Library & Digital Archive</option>
                <option value="AI Assistant">RuralGPT AI Assistant</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-600 dark:text-gray-400 font-semibold mb-1">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief summary of issue or request..."
                required
                className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-2.5 text-gray-900 dark:text-white outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-gray-600 dark:text-gray-400 font-semibold mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Provide details, steps to reproduce, or desired functionality..."
                required
                className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-3 text-gray-900 dark:text-white outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-900/20"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit to Admin</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
