import React, { useState } from 'react';
import { useAppStore } from '../../core/store/appStore';
import { UniversityDocument } from '../../types';
import { 
  FileText, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  Check, 
  X, 
  ExternalLink,
  Download,
  FolderOpen
} from 'lucide-react';

export const DocumentsManager: React.FC = () => {
  const { documents, saveDocument, deleteDocument } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'PROSPECTUS' | 'ACTS_STATUTES' | 'ANNUAL_REPORT' | 'REGULATIONS' | 'FORMS' | 'SYLLABUS'>('PROSPECTUS');
  const [fileUrl, setFileUrl] = useState('');
  const [academicYear, setAcademicYear] = useState('2026-27');
  const [fileSize, setFileSize] = useState('2.4 MB');
  const [version, setVersion] = useState('v1.0');

  const filteredDocs = documents.filter((d) => {
    const matchesCategory = selectedCategory === 'ALL' || d.category === selectedCategory;
    const matchesSearch = 
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const resetForm = () => {
    setTitle('');
    setCategory('PROSPECTUS');
    setFileUrl('');
    setAcademicYear('2026-27');
    setFileSize('2.4 MB');
    setVersion('v1.0');
    setIsEditing(false);
    setEditingId(null);
  };

  const handleStartEdit = (doc: UniversityDocument) => {
    setTitle(doc.title);
    setCategory(doc.category);
    setFileUrl(doc.fileUrl);
    setAcademicYear(doc.academicYear || '2026-27');
    setFileSize(doc.fileSize || '1.5 MB');
    setVersion(doc.version || 'v1.0');
    setEditingId(doc.id);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !fileUrl.trim()) return;

    const docObj: UniversityDocument = {
      id: editingId || `doc-${Date.now()}`,
      title,
      category,
      fileUrl,
      academicYear,
      fileSize,
      version,
      uploadDate: new Date().toISOString().split('T')[0],
    };

    await saveDocument(docObj);
    setFeedback(`Document repository entry saved.`);
    resetForm();
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Delete document "${name}"?`)) {
      await deleteDocument(id);
      setFeedback(`Document deleted.`);
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
            <FolderOpen className="w-5 h-5 text-emerald-400" />
            University Document Archive & Regulations Control
          </h2>
          <p className="text-xs text-slate-400">
            Publish official GRI Acts, Statutes, Prospectus, Academic Ordinances, Handbooks, and Downloadable Forms.
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
          <span>{isEditing ? 'Cancel Editor' : 'Upload Document Record'}</span>
        </button>
      </div>

      {/* Form */}
      {isEditing && (
        <form onSubmit={handleSubmit} className="bg-slate-900 p-6 rounded-3xl border border-emerald-500/40 shadow-2xl space-y-4 text-xs animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white font-display">
              {editingId ? 'Edit Document Entry' : 'Register New University Document'}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Document Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500"
              >
                <option value="PROSPECTUS">Admission Prospectus</option>
                <option value="ACTS_STATUTES">Acts & Statutes of GRI</option>
                <option value="ANNUAL_REPORT">Annual Report</option>
                <option value="REGULATIONS">Academic Regulations & Ordinances</option>
                <option value="FORMS">Official Administrative Forms</option>
                <option value="SYLLABUS">CBCS Curriculum & Syllabus</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Academic Year</label>
              <input
                type="text"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                placeholder="2026-27"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">File Size / Version</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={fileSize}
                  onChange={(e) => setFileSize(e.target.value)}
                  placeholder="3.2 MB"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-slate-200 outline-none focus:border-emerald-500"
                />
                <input
                  type="text"
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                  placeholder="v2.1"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-slate-200 outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Document Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., GRI Academic Regulations & Ordinances 2026"
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Direct PDF / Asset Download URL</label>
              <input
                type="url"
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                placeholder="https://ruraluniv.ac.in/includes/downloads/gri_regulations.pdf"
                required
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
              Save Document
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
            placeholder="Search documents by title or category..."
            className="bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-emerald-500 w-full sm:w-72"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {['ALL', 'PROSPECTUS', 'ACTS_STATUTES', 'ANNUAL_REPORT', 'REGULATIONS', 'FORMS', 'SYLLABUS'].map((cat) => (
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

      {/* Documents Table */}
      <div className="overflow-x-auto bg-slate-900 rounded-2xl border border-slate-800 shadow-xl">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-bold uppercase text-[11px]">
              <th className="p-3.5">Document Title</th>
              <th className="p-3.5">Category</th>
              <th className="p-3.5">Academic Year</th>
              <th className="p-3.5">File Metadata</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300">
            {filteredDocs.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">
                  No documents found in the archive.
                </td>
              </tr>
            ) : (
              filteredDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3.5 max-w-sm">
                    <div className="font-bold text-white text-xs">{doc.title}</div>
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] text-emerald-400 hover:underline inline-flex items-center gap-1 mt-0.5"
                    >
                      <Download className="w-3 h-3" />
                      <span>{doc.fileUrl}</span>
                    </a>
                  </td>
                  <td className="p-3.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                      {doc.category}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-200">
                    {doc.academicYear || 'Permanent'}
                  </td>
                  <td className="p-3.5 text-slate-400">
                    {doc.fileSize || 'PDF'} • {doc.version || 'v1.0'}
                  </td>
                  <td className="p-3.5 text-right">
                    <div className="inline-flex items-center gap-1 justify-end">
                      <button
                        onClick={() => handleStartEdit(doc)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                        title="Edit Document"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(doc.id, doc.title)}
                        className="p-1.5 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-400 border border-rose-800 transition"
                        title="Delete Document"
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
