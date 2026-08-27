import React, { useState } from 'react';
import { useAppStore } from '../../core/store/appStore';
import { 
  Bell, 
  MapPin, 
  Search, 
  Filter, 
  Calendar, 
  Download, 
  Share2, 
  Bookmark, 
  BookmarkCheck, 
  Sliders, 
  CheckCircle2, 
  ChevronRight, 
  X, 
  FileText,
  AlertTriangle,
  Info,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { INITIAL_EVENTS } from '../../core/data/griMasterData';
import { ALL_NOTIFICATION_CATEGORIES, DEFAULT_SUBSCRIBED_CATEGORY_IDS, isCircularMatchingSubscriptions } from '../../core/data/notificationCategories';
import { CircularItem, EventItem } from '../../types';

export const AlertsView: React.FC = () => {
  const { circulars, currentUser, setTab, bookmarkedIds, toggleBookmark } = useAppStore();

  const userSubscribedIds = currentUser.notificationPreferences?.subscribedCategories || DEFAULT_SUBSCRIBED_CATEGORY_IDS;

  const [tab, setTabState] = useState<'notices' | 'events'>('notices');
  const [feedMode, setFeedMode] = useState<'subscribed' | 'all'>('subscribed');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Selected detail modals
  const [selectedNotice, setSelectedNotice] = useState<CircularItem | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [registeredEvents, setRegisteredEvents] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRegisterEvent = (eventId: string, eventTitle: string) => {
    if (registeredEvents.includes(eventId)) {
      showToast(`You are already registered for "${eventTitle}"`);
    } else {
      setRegisteredEvents([...registeredEvents, eventId]);
      showToast(`Registration confirmed for "${eventTitle}"! Hall pass sent to your email.`);
    }
  };

  // Filter circulars based on feedMode, selectedCategory, and searchQuery
  const filteredCirculars = circulars.filter((circ) => {
    // 1. Subscription filter
    if (feedMode === 'subscribed' && !isCircularMatchingSubscriptions(circ, userSubscribedIds)) {
      return false;
    }

    // 2. Category chip filter
    if (selectedCategory !== 'ALL') {
      const catDef = ALL_NOTIFICATION_CATEGORIES.find(c => c.id === selectedCategory);
      if (catDef) {
        const circCat = (circ.category || '').toUpperCase();
        const circTitle = (circ.title || '').toUpperCase();
        const matches = catDef.tags.some(tag => circCat.includes(tag) || circTitle.includes(tag));
        if (!matches) return false;
      }
    }

    // 3. Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = circ.title.toLowerCase().includes(q);
      const matchDesc = circ.description?.toLowerCase().includes(q);
      const matchCat = circ.category?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchCat) return false;
    }

    return true;
  });

  return (
    <div className="flex flex-col space-y-5 px-4 sm:px-6 pt-5 pb-24 max-w-3xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">Campus Notices & Alerts</h2>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
            Official circulars, examination updates, placements, and campus events.
          </p>
        </div>

        <button
          onClick={() => setTab('settings')}
          className="p-2 rounded-2xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 transition-colors flex items-center gap-1.5 text-xs font-bold"
          title="Notification Settings"
        >
          <Sliders className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="hidden sm:inline">Preferences</span>
        </button>
      </div>

      {/* Toast alert */}
      {toastMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 shadow-sm animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Primary Tabs (Notices vs Events) */}
      <div className="flex p-1.5 bg-gray-100 dark:bg-slate-800 rounded-2xl">
        <button 
          onClick={() => setTabState('notices')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            tab === 'notices' 
              ? 'bg-white dark:bg-slate-900 shadow-sm text-blue-600 dark:text-blue-400' 
              : 'text-gray-500 dark:text-slate-400 hover:text-gray-900'
          }`}
        >
          Institutional Circulars ({circulars.length})
        </button>
        <button 
          onClick={() => setTabState('events')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            tab === 'events' 
              ? 'bg-white dark:bg-slate-900 shadow-sm text-blue-600 dark:text-blue-400' 
              : 'text-gray-500 dark:text-slate-400 hover:text-gray-900'
          }`}
        >
          Campus Events ({INITIAL_EVENTS.length})
        </button>
      </div>

      {/* ========================================================= */}
      {/* NOTICES TAB */}
      {/* ========================================================= */}
      {tab === 'notices' && (
        <div className="space-y-4">
          
          {/* Subscription Filter Toggle Bar */}
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-3 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-700 dark:text-slate-300">Feed Scope:</span>
                <div className="flex bg-gray-100 dark:bg-slate-800 p-0.5 rounded-lg text-[11px] font-bold">
                  <button
                    onClick={() => setFeedMode('subscribed')}
                    className={`px-3 py-1 rounded-md transition-all ${
                      feedMode === 'subscribed'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-gray-600 dark:text-slate-400 hover:text-gray-900'
                    }`}
                  >
                    My Subscriptions ({userSubscribedIds.length} categories)
                  </button>
                  <button
                    onClick={() => setFeedMode('all')}
                    className={`px-3 py-1 rounded-md transition-all ${
                      feedMode === 'all'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-gray-600 dark:text-slate-400 hover:text-gray-900'
                    }`}
                  >
                    All Institutional Circulars
                  </button>
                </div>
              </div>

              <button
                onClick={() => setTab('settings')}
                className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline hidden sm:flex items-center gap-1"
              >
                Manage Categories <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search circulars by keyword, exam, department, or date..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800 text-xs focus:outline-none focus:border-blue-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
              <button
                onClick={() => setSelectedCategory('ALL')}
                className={`px-2.5 py-1 rounded-lg font-bold shrink-0 transition-all ${
                  selectedCategory === 'ALL'
                    ? 'bg-gray-900 text-white dark:bg-white dark:text-slate-900'
                    : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 hover:bg-gray-200'
                }`}
              >
                All Filter
              </button>
              {ALL_NOTIFICATION_CATEGORIES.map((c) => {
                const isSelected = selectedCategory === c.id;
                const isSub = userSubscribedIds.includes(c.id);
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.id)}
                    className={`px-2.5 py-1 rounded-lg font-bold shrink-0 transition-all flex items-center gap-1 ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-sm'
                        : isSub
                        ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                        : 'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400'
                    }`}
                  >
                    <span>{c.shortName}</span>
                    {isSub && <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Subscribed Status Banner */}
          {feedMode === 'subscribed' && (
            <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/60 text-xs text-blue-800 dark:text-blue-300">
              <div className="flex items-center gap-2">
                <Info className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Showing notices tailored to your <strong>{userSubscribedIds.length} subscribed categories</strong>.</span>
              </div>
              <button 
                onClick={() => setTab('settings')}
                className="font-bold text-[11px] underline shrink-0 hover:text-blue-900"
              >
                Edit in Settings
              </button>
            </div>
          )}

          {/* Circulars List */}
          <div className="space-y-3">
            {filteredCirculars.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 space-y-3">
                <Bell className="w-10 h-10 text-gray-300 mx-auto" />
                <h4 className="font-bold text-sm text-gray-900 dark:text-white">No notices match your current filters</h4>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Try switching to "All Institutional Circulars" or update your subscribed notification categories in Settings.
                </p>
                <button
                  onClick={() => { setFeedMode('all'); setSelectedCategory('ALL'); setSearchQuery(''); }}
                  className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-sm"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              filteredCirculars.map((circ) => {
                const isBookmarked = (bookmarkedIds || []).includes(circ.id);
                return (
                  <div 
                    key={circ.id}
                    id={`notice-card-${circ.id}`}
                    onClick={() => setSelectedNotice(circ)}
                    className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm hover:border-blue-400/60 dark:hover:border-blue-500/40 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-md ${
                          circ.isImportant 
                            ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300' 
                            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}>
                          {circ.category}
                        </span>

                        {circ.isImportant && (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-red-600 dark:text-red-400">
                            <AlertTriangle className="w-3 h-3" /> Urgent
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-gray-400 font-medium">
                          {circ.publishDate}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleBookmark(circ.id);
                            showToast(isBookmarked ? 'Removed from bookmarks' : 'Saved to bookmarks');
                          }}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          {isBookmarked ? (
                            <BookmarkCheck className="w-4 h-4 text-blue-600" />
                          ) : (
                            <Bookmark className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <h3 className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1">
                      {circ.title}
                    </h3>
                    
                    <p className="text-xs text-gray-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {circ.description}
                    </p>

                    <div className="flex items-center justify-between pt-3 mt-2 border-t border-gray-100 dark:border-slate-800/80 text-[11px]">
                      <span className="text-gray-400 font-medium">
                        Issuer: <span className="text-gray-700 dark:text-slate-300 font-semibold">{circ.author || 'Registrar / CoE'}</span>
                      </span>
                      <span className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                        Read Full Circular <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* EVENTS TAB */}
      {/* ========================================================= */}
      {tab === 'events' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {INITIAL_EVENTS.map((event) => {
              const isRegistered = registeredEvents.includes(event.id);
              return (
                <div 
                  key={event.id} 
                  id={`event-card-${event.id}`}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col justify-between"
                >
                  <div className="h-36 bg-slate-900 relative overflow-hidden">
                    {event.imageUrl ? (
                      <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover opacity-80" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-emerald-900 to-slate-900">
                        <Calendar className="w-10 h-10 text-emerald-400/60" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-emerald-800 dark:text-emerald-300 shadow-sm">
                      {event.date}
                    </div>
                    {event.category && (
                      <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase">
                        {event.category}
                      </div>
                    )}
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1 leading-snug">
                        {event.title}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-slate-400 line-clamp-2">
                        {event.description}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-slate-400">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span>{event.location} • {event.time}</span>
                      </div>

                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleRegisterEvent(event.id, event.title)}
                          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                            isRegistered 
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/20'
                          }`}
                        >
                          {isRegistered ? 'Registered ✓' : 'Register Now'}
                        </button>
                        <button
                          onClick={() => setSelectedEvent(event)}
                          className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-200 font-bold text-xs"
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* NOTICE DETAIL MODAL */}
      {/* ========================================================= */}
      {selectedNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 text-gray-900 dark:text-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-gray-200 dark:border-slate-800">
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-slate-850 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md ${
                  selectedNotice.isImportant 
                    ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300' 
                    : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                }`}>
                  {selectedNotice.category}
                </span>
                <span className="text-xs text-gray-400">Ref: GRI/NOTIF/{selectedNotice.id}</span>
              </div>
              <button 
                onClick={() => setSelectedNotice(null)}
                className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div>
                <h3 className="text-base font-black text-gray-900 dark:text-white leading-snug">
                  {selectedNotice.title}
                </h3>
                <div className="flex items-center gap-3 text-gray-400 text-[11px] mt-1">
                  <span>Published: <strong className="text-gray-700 dark:text-slate-300">{selectedNotice.publishDate}</strong></span>
                  <span>•</span>
                  <span>Issued By: <strong className="text-gray-700 dark:text-slate-300">{selectedNotice.author || 'University Administration'}</strong></span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-slate-800/60 border border-gray-100 dark:border-slate-800 space-y-3 leading-relaxed text-gray-700 dark:text-slate-200">
                <p>{selectedNotice.description}</p>
                <p className="text-[11px] text-gray-500 dark:text-slate-400 pt-2 border-t border-gray-200 dark:border-slate-700">
                  All concerned Deans, Heads of Departments, Centre Directors, and registered students are requested to note and comply accordingly.
                </p>
              </div>

              {selectedNotice.attachmentUrl && (
                <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white text-xs">Official Order / Circular Annexure (PDF)</p>
                      <p className="text-[10px] text-gray-500">GRI-Signed-Attestation.pdf (1.2 MB)</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => showToast('Downloading Official Circular PDF...')}
                    className="px-3 py-1.5 bg-blue-600 text-white rounded-xl font-bold text-xs flex items-center gap-1 hover:bg-blue-700"
                  >
                    <Download className="w-3.5 h-3.5" /> Download
                  </button>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-gray-50 dark:bg-slate-850 border-t border-gray-200 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={() => {
                  toggleBookmark(selectedNotice.id);
                  showToast('Bookmark status updated');
                }}
                className="px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5"
              >
                <Bookmark className="w-4 h-4" /> Save Notice
              </button>
              <button
                onClick={() => showToast('Share link copied to clipboard!')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5"
              >
                <Share2 className="w-4 h-4" /> Share Circular
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* EVENT DETAIL MODAL */}
      {/* ========================================================= */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 text-gray-900 dark:text-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-gray-200 dark:border-slate-800">
            <div className="px-6 py-4 bg-gray-50 dark:bg-slate-850 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">{selectedEvent.title}</h3>
              <button onClick={() => setSelectedEvent(null)} className="p-1 text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-3 text-xs">
              <p className="text-gray-600 dark:text-slate-300">{selectedEvent.description}</p>
              <div className="p-3 bg-gray-50 dark:bg-slate-800 rounded-2xl space-y-1">
                <p><strong>Date & Time:</strong> {selectedEvent.date} at {selectedEvent.time}</p>
                <p><strong>Venue:</strong> {selectedEvent.location}</p>
                <p><strong>Organizing Department:</strong> Gandhigram Rural Institute Central Coordination</p>
              </div>
              <button
                onClick={() => {
                  handleRegisterEvent(selectedEvent.id, selectedEvent.title);
                  setSelectedEvent(null);
                }}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold shadow-md shadow-emerald-600/20"
              >
                Confirm Event Registration
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
