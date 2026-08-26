import React, { useState, useMemo } from 'react';
import { useAppStore } from '../../core/store/appStore';
import { canAccessCircular } from '../../core/auth/permissions';
import { CircularItem } from '../../types';
import { 
  Bell, Search, Bookmark, BookmarkCheck, Download, 
  AlertCircle, Shield, Calendar
} from 'lucide-react';

export const AlertsView: React.FC = () => {
  const { circulars, bookmarkedIds, toggleBookmark, isFirestoreLive, currentUser, setLoginModalOpen } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedAudience, setSelectedAudience] = useState<string>('ALL');
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);

  const categories = ['ALL', 'EXAM', 'ADMISSIONS', 'ACADEMIC', 'OUTREACH', 'TENDER', 'CAREER', 'ADMIN'];

  const filteredCirculars = useMemo(() => {
    return circulars.filter((circ) => {
      const hasAccess = canAccessCircular(circ, currentUser);
      if (!hasAccess) return false;

      const matchQuery =
        circ.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        circ.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (circ.author && circ.author.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchCategory = selectedCategory === 'ALL' || circ.category === selectedCategory;
      const matchAudience = selectedAudience === 'ALL' || circ.targetRole === selectedAudience || circ.targetRole === 'ALL';
      const matchBookmark = !showBookmarksOnly || bookmarkedIds.includes(circ.id);

      return matchQuery && matchCategory && matchAudience && matchBookmark;
    });
  }, [circulars, searchQuery, selectedCategory, selectedAudience, showBookmarksOnly, bookmarkedIds, currentUser]);

  return (
    <div className="space-y-8 sm:space-y-12 pb-24 animate-fadeIn max-w-5xl mx-auto px-4 sm:px-6">
      
      {/* Editorial Header */}
      <div className="space-y-6">
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-medium text-[#1A1F1D] tracking-tight leading-[1.1]">
          Circulars & <br/>
          <span className="text-black/30">Notifications.</span>
        </h1>
        <p className="text-xl text-[#5C6661] font-light leading-relaxed max-w-2xl">
          Real-time administrative notices, examination guidelines, admission alerts, and official releases.
        </p>
      </div>

      {/* Guest Notice Banner */}
      {currentUser.role === 'guest' && (
        <div className="bg-[#E0F2FE] p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4">
            <Shield className="w-8 h-8 text-[#0369A1] flex-shrink-0" />
            <div>
              <p className="font-bold text-[#1A1F1D] text-lg">Public Institutional View</p>
              <p className="text-[#0369A1]">You are viewing open circulars. Department-specific internal circulars require verified login.</p>
            </div>
          </div>
          <button
            onClick={() => setLoginModalOpen(true)}
            className="px-6 py-3 rounded-full bg-white text-[#0369A1] font-bold whitespace-nowrap transition-colors shadow-sm hover:bg-[#FDFDFB]"
          >
            Staff / Student Login
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl sm:rounded-[2rem] border border-[#E5EAE7] space-y-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* Search box */}
          <div className="md:col-span-6 relative">
            <Search className="w-5 h-5 text-[#5C6661] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search circulars by subject, keyword..."
              className="w-full bg-[#F2F6F4] rounded-full pl-12 pr-6 py-4 text-[#1A1F1D] outline-none focus:ring-2 focus:ring-[#0F4C3A]/20"
            />
          </div>

          {/* Filters */}
          <div className="md:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-[#F2F6F4] rounded-full px-6 py-4 text-[#1A1F1D] font-medium outline-none focus:ring-2 focus:ring-[#0F4C3A]/20"
            >
              <option value="ALL">All Categories</option>
              <option value="EXAM">Examination</option>
              <option value="ADMISSIONS">Admissions</option>
              <option value="ACADEMIC">Academic</option>
              <option value="TENDER">Tenders</option>
              <option value="ADMIN">Administration</option>
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              value={selectedAudience}
              onChange={(e) => setSelectedAudience(e.target.value)}
              className="w-full bg-[#F2F6F4] rounded-full px-6 py-4 text-[#1A1F1D] font-medium outline-none focus:ring-2 focus:ring-[#0F4C3A]/20"
            >
              <option value="ALL">All Audiences</option>
              <option value="STUDENT">Students</option>
              <option value="FACULTY">Faculty</option>
              <option value="STAFF">Staff</option>
            </select>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#E5EAE7]">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#0F4C3A] text-white'
                    : 'bg-white text-[#5C6661] hover:bg-[#F2F6F4] border border-[#E5EAE7]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-colors ${
              showBookmarksOnly
                ? 'bg-[#FEF3C7] text-[#92400E]'
                : 'bg-white text-[#5C6661] hover:bg-[#F2F6F4] border border-[#E5EAE7]'
            }`}
          >
            <Bookmark className="w-4 h-4" /> Saved ({bookmarkedIds.length})
          </button>
        </div>
      </div>

      {/* Circulars List */}
      <div className="space-y-6">
        {filteredCirculars.map((circ) => {
          const isSaved = bookmarkedIds.includes(circ.id);
          return (
            <div
              key={circ.id}
              className={`p-6 sm:p-10 rounded-3xl sm:rounded-[2rem] bg-white border transition-all ${
                circ.isImportant ? 'border-[#BE123C] shadow-sm' : 'border-[#E5EAE7] shadow-sm hover:border-[#0F4C3A]'
              }`}
            >
              
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                <div className="flex-1 space-y-4">
                  
                  {/* Meta Badges */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-[#F2F6F4] text-[#5C6661]">
                      {circ.category}
                    </span>
                    {circ.targetRole && circ.targetRole !== 'ALL' && (
                      <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-[#E5F0EB] text-[#0F4C3A]">
                        Target: {circ.targetRole}
                      </span>
                    )}
                    {circ.isImportant && (
                      <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-[#FEF2F2] text-[#BE123C] flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> HIGH PRIORITY
                      </span>
                    )}
                  </div>

                  {/* Title & Body */}
                  <div>
                    <h3 className="text-2xl font-bold text-[#1A1F1D] leading-tight mb-3">
                      {circ.title}
                    </h3>
                    <p className="text-base text-[#5C6661] leading-relaxed">
                      {circ.description}
                    </p>
                  </div>

                  {/* Footer Meta */}
                  <div className="flex flex-wrap items-center gap-6 pt-4 text-sm text-[#5C6661]">
                    <span className="flex items-center gap-2 font-medium">
                      <Calendar className="w-4 h-4" /> {circ.publishDate}
                    </span>
                    {circ.author && (
                      <span>Issued by: <strong className="text-[#1A1F1D]">{circ.author}</strong></span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex sm:flex-col items-center gap-3">
                  <button
                    onClick={() => alert(`Notice ${circ.id} downloaded in official PDF format.`)}
                    className="w-12 h-12 flex items-center justify-center rounded-full bg-[#0F4C3A] text-white hover:bg-[#0A3327] transition-colors shadow-sm"
                    title="Download PDF"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => toggleBookmark(circ.id)}
                    className={`w-12 h-12 flex items-center justify-center rounded-full border transition-colors ${
                      isSaved
                        ? 'bg-[#FEF3C7] border-[#FEF3C7] text-[#92400E]'
                        : 'bg-white border-[#E5EAE7] text-[#5C6661] hover:bg-[#F2F6F4]'
                    }`}
                    title={isSaved ? 'Remove from Saved' : 'Save Notice'}
                  >
                    {isSaved ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                  </button>
                </div>
              </div>

            </div>
          );
        })}

        {filteredCirculars.length === 0 && (
          <div className="p-16 text-center bg-white rounded-3xl sm:rounded-[2rem] border border-[#E5EAE7] text-[#5C6661] space-y-4 shadow-sm">
            <Bell className="w-12 h-12 mx-auto text-[#E5EAE7]" />
            <h3 className="text-xl font-bold text-[#1A1F1D]">No circulars found.</h3>
            <p>Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};
