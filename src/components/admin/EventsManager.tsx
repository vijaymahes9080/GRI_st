import React, { useState } from 'react';
import { useAppStore } from '../../core/store/appStore';
import { EventItem } from '../../types';
import { 
  Calendar, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  Check, 
  X, 
  MapPin, 
  ExternalLink,
  Tag,
  Clock,
  CheckCircle2
} from 'lucide-react';

export const EventsManager: React.FC = () => {
  const { events, saveEvent, deleteEvent } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [venue, setVenue] = useState('');
  const [category, setCategory] = useState<'WORKSHOP' | 'SEMINAR' | 'CONFERENCE' | 'CULTURAL' | 'SPORTS' | 'EXAMINATION'>('WORKSHOP');
  const [description, setDescription] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [registrationUrl, setRegistrationUrl] = useState('');
  const [isUpcoming, setIsUpcoming] = useState(true);

  const filteredEvents = events.filter((e) => {
    const matchesCategory = selectedCategory === 'ALL' || e.category === selectedCategory;
    const matchesSearch = 
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.organizer && e.organizer.toLowerCase().includes(searchQuery.toLowerCase())) ||
      e.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const resetForm = () => {
    setTitle('');
    setDate('');
    setTime('');
    setVenue('');
    setCategory('WORKSHOP');
    setDescription('');
    setOrganizer('');
    setRegistrationUrl('');
    setIsUpcoming(true);
    setIsEditing(false);
    setEditingId(null);
  };

  const handleStartEdit = (evt: EventItem) => {
    setTitle(evt.title);
    setDate(evt.date);
    setTime(evt.time || '');
    setVenue(evt.venue);
    setCategory(evt.category);
    setDescription(evt.description);
    setOrganizer(evt.organizer || '');
    setRegistrationUrl(evt.registrationUrl || '');
    setIsUpcoming(evt.isUpcoming !== false);
    setEditingId(evt.id);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date.trim()) return;

    const eventObj: EventItem = {
      id: editingId || `evt-${Date.now()}`,
      title,
      date,
      time: time || undefined,
      venue,
      category,
      description,
      organizer: organizer || undefined,
      registrationUrl: registrationUrl || undefined,
      isUpcoming,
    };

    await saveEvent(eventObj);
    setFeedback(`Event saved successfully.`);
    resetForm();
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleDelete = async (id: string, itemTitle: string) => {
    if (window.confirm(`Are you sure you want to delete event "${itemTitle}"?`)) {
      await deleteEvent(id);
      setFeedback(`Event deleted.`);
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

      {/* Top Header */}
      <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white font-display flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-400" />
            Events, Conferences & Academic Calendar Control
          </h2>
          <p className="text-xs text-slate-400">
            Publish university symposia, national workshops, cultural fests, and examination schedules.
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
          <span>{isEditing ? 'Cancel Editor' : 'Schedule New Event'}</span>
        </button>
      </div>

      {/* Editor Form */}
      {isEditing && (
        <form onSubmit={handleSubmit} className="bg-slate-900 p-6 rounded-3xl border border-emerald-500/40 shadow-2xl space-y-4 text-xs animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white font-display">
              {editingId ? 'Edit Event Schedule' : 'Schedule New University Event'}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Event Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500"
              >
                <option value="WORKSHOP">Workshop / Hands-On</option>
                <option value="SEMINAR">National Seminar</option>
                <option value="CONFERENCE">International Conference</option>
                <option value="CULTURAL">Cultural Festival / Gandhi Jayanti</option>
                <option value="SPORTS">Sports & Athletics</option>
                <option value="EXAMINATION">Examination Schedule</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Date</label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="e.g., 2026-09-15"
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Time (Optional)</label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="e.g., 10:00 AM - 04:30 PM"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Event Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., National Conference on Organic Farming and Bio-Pesticides"
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Venue / Location</label>
              <input
                type="text"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="e.g., Dr. Radhakrishnan Auditorium / Seminar Hall A"
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Organizing Department / Centre</label>
              <input
                type="text"
                value={organizer}
                onChange={(e) => setOrganizer(e.target.value)}
                placeholder="e.g., Department of Agriculture & Computer Centre"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Online Registration URL (Optional)</label>
              <input
                type="url"
                value={registrationUrl}
                onChange={(e) => setRegistrationUrl(e.target.value)}
                placeholder="https://ruraluniv.ac.in/events/register/conf2026"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Event Summary & Agenda</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Detailed description, keynote speakers, target participants, and fees..."
              required
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800">
            <input
              type="checkbox"
              id="isUpcomingCheckbox"
              checked={isUpcoming}
              onChange={(e) => setIsUpcoming(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-0 accent-emerald-600 cursor-pointer"
            />
            <label htmlFor="isUpcomingCheckbox" className="text-slate-300 font-semibold cursor-pointer">
              Active / Upcoming Event (Displays on public calendars and countdown cards)
            </label>
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
              Save Event
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
            placeholder="Search events by title, venue, organizer..."
            className="bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-emerald-500 w-full sm:w-72"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {['ALL', 'WORKSHOP', 'SEMINAR', 'CONFERENCE', 'CULTURAL', 'SPORTS', 'EXAMINATION'].map((cat) => (
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

      {/* Events Table */}
      <div className="overflow-x-auto bg-slate-900 rounded-2xl border border-slate-800 shadow-xl">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-bold uppercase text-[11px]">
              <th className="p-3.5">Date & Time</th>
              <th className="p-3.5">Event Title & Venue</th>
              <th className="p-3.5">Category</th>
              <th className="p-3.5">Organizer</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300">
            {filteredEvents.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">
                  No university events found.
                </td>
              </tr>
            ) : (
              filteredEvents.map((evt) => (
                <tr key={evt.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3.5 whitespace-nowrap">
                    <div className="font-bold text-white text-xs">{evt.date}</div>
                    <div className="text-[10px] text-slate-400">{evt.time || 'All Day'}</div>
                  </td>
                  <td className="p-3.5 max-w-sm">
                    <div className="font-bold text-white text-xs">{evt.title}</div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-500 flex-shrink-0" />
                      <span>{evt.venue}</span>
                    </div>
                    {evt.registrationUrl && (
                      <a
                        href={evt.registrationUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] text-emerald-400 hover:underline inline-flex items-center gap-1 mt-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Registration Link</span>
                      </a>
                    )}
                  </td>
                  <td className="p-3.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                      {evt.category}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-300">
                    {evt.organizer || 'GRI Academic Council'}
                  </td>
                  <td className="p-3.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      evt.isUpcoming !== false
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      {evt.isUpcoming !== false ? 'Upcoming' : 'Concluded'}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <div className="inline-flex items-center gap-1 justify-end">
                      <button
                        onClick={() => handleStartEdit(evt)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                        title="Edit Event"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(evt.id, evt.title)}
                        className="p-1.5 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-400 border border-rose-800 transition"
                        title="Delete Event"
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
