import React, { useState, useMemo } from 'react';
import { useAppStore } from '../../core/store/appStore';
import { CircularItem } from '../../types';
import { 
  Bell, 
  Search, 
  Bookmark, 
  BookmarkCheck, 
  Download, 
  Share2, 
  Filter, 
  Sparkles,
  Calendar,
  AlertCircle,
  FileText
} from 'lucide-react';

export const AlertsView: React.FC = () => {
  const { circulars, bookmarkedIds, toggleBookmark, isFirestoreLive } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedAudience, setSelectedAudience] = useState<string>('ALL');
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);

  const categories = ['ALL', 'EXAM', 'ADMISSIONS', 'ACADEMIC', 'OUTREACH', 'TENDER', 'CAREER', 'ADMIN'];

  const filteredCirculars = useMemo(() => {
    return circulars.filter((circ) => {
      const matchQuery =
        circ.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        circ.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (circ.author && circ.author.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchCategory = selectedCategory === 'ALL' || circ.category === selectedCategory;
      const matchAudience = selectedAudience === 'ALL' || circ.targetRole === selectedAudience || circ.targetRole === 'ALL';
      const matchBookmark = !showBookmarksOnly || bookmarkedIds.includes(circ.id);

      return matchQuery && matchCategory && matchAudience && matchBookmark;
    });
  }, [circulars, searchQuery, selectedCategory, selectedAudience, showBookmarksOnly, bookmarkedIds]);

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/80 border border-rose-600/40 text-rose-400 text-xs font-semibold">
            <Bell className="w-3.5 h-3.5" />
            <span>Official University Bulletin</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
            Circulars, Notifications & Press Releases
          </h1>
          <p className="text-sm text-slate-400">
            Real-time administrative notices, examination guidelines, admission alerts, and holiday calendars.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <span className={`w-2 h-2 rounded-full ${isFirestoreLive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
            <span>Firestore: <strong className="text-emerald-400">{isFirestoreLive ? 'Live Sync' : 'Ready'}</strong></span>
          </div>

          <button
            onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition ${
              showBookmarksOnly
                ? 'bg-amber-600/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Saved Notices ({bookmarkedIds.length})</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search box */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search circulars by subject, keyword, or authority..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-emerald-500"
            />
          </div>

          {/* Category Selector */}
          <div className="md:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-emerald-500"
            >
              <option value="ALL">All Categories</option>
              <option value="EXAM">Examination (ESE)</option>
              <option value="ADMISSIONS">Admissions 2026-27</option>
              <option value="ACADEMIC">Academic & Syllabus</option>
              <option value="OUTREACH">Shanti Sena / Outreach</option>
              <option value="TENDER">Tenders & Procurement</option>
              <option value="CAREER">Recruitment / Careers</option>
              <option value="ADMIN">Administration</option>
            </select>
          </div>

          {/* Audience Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedAudience}
              onChange={(e) => setSelectedAudience(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-emerald-500"
            >
              <option value="ALL">Target Audience: All</option>
              <option value="STUDENT">Students Only</option>
              <option value="FACULTY">Faculty & Researchers</option>
              <option value="STAFF">Administrative Staff</option>
            </select>
          </div>
        </div>

        {/* Quick Category Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Circulars List */}
      <div className="space-y-4">
        {filteredCirculars.map((circ) => {
          const isSaved = bookmarkedIds.includes(circ.id);
          return (
            <div
              key={circ.id}
              className={`p-5 rounded-2xl bg-slate-900 border transition space-y-3 ${
                circ.isImportant ? 'border-rose-900/60 bg-gradient-to-r from-slate-900 via-slate-900 to-rose-950/20' : 'border-slate-800'
              }`}
            >
              {/* Header tags */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                    circ.category === 'EXAM' ? 'bg-rose-950 text-rose-300 border-rose-800' :
                    circ.category === 'ADMISSIONS' ? 'bg-amber-950 text-amber-300 border-amber-800' :
                    circ.category === 'TENDER' ? 'bg-sky-950 text-sky-300 border-sky-800' :
                    'bg-slate-800 text-slate-300 border-slate-700'
                  }`}>
                    {circ.category}
                  </span>

                  {circ.targetRole && circ.targetRole !== 'ALL' && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                      Target: {circ.targetRole}
                    </span>
                  )}

                  {circ.isImportant && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-600 text-white flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      HIGH PRIORITY
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toggleBookmark(circ.id)}
                    className={`p-1.5 rounded-lg border transition ${
                      isSaved
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                        : 'bg-slate-800 text-slate-400 hover:text-white border-slate-700'
                    }`}
                    title={isSaved ? 'Remove from Saved' : 'Save Notice'}
                  >
                    {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Title & Body */}
              <div>
                <h3 className="text-base font-bold text-white leading-snug">
                  {circ.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  {circ.description}
                </p>
              </div>

              {/* Meta & Download CTA */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 border-t border-slate-800/80 text-xs text-slate-400">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 font-medium text-slate-300">
                    <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                    Published: {circ.publishDate}
                  </span>
                  {circ.author && (
                    <span className="text-slate-400">Issued by: <strong>{circ.author}</strong></span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => alert(`Notice ${circ.id} downloaded in official PDF format.`)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Download Official Circular PDF</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredCirculars.length === 0 && (
          <div className="p-12 text-center bg-slate-900 rounded-2xl border border-slate-800 text-slate-400 space-y-3">
            <Bell className="w-8 h-8 mx-auto text-slate-600" />
            <h3 className="text-base font-semibold text-slate-300">No circulars match your search criteria</h3>
            <p className="text-xs">Try resetting your filters or search keywords.</p>
          </div>
        )}
      </div>
    </div>
  );
};
