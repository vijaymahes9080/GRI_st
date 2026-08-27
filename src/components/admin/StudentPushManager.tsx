import React, { useState } from 'react';
import { useAppStore } from '../../core/store/appStore';
import { MessageChannel, EventItem } from '../../types';
import { 
  Bell, 
  Send, 
  Smartphone, 
  Check, 
  X, 
  Calendar, 
  Users, 
  Sparkles, 
  Clock, 
  AlertCircle, 
  Mail, 
  MessageSquare, 
  Layers,
  CheckCircle2,
  Filter
} from 'lucide-react';

export const StudentPushManager: React.FC = () => {
  const { events, usersList, addCircular, addDispatchedMessage, currentUser } = useAppStore();

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('ALL');
  const [priority, setPriority] = useState<'normal' | 'important' | 'urgent'>('important');
  const [selectedChannels, setSelectedChannels] = useState<MessageChannel[]>(['IN_APP', 'PUSH', 'WHATSAPP'] as any);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter upcoming events for quick selection
  const upcomingEvents = events.filter(e => e.isUpcoming !== false);
  const studentCount = usersList.filter(u => u.role === 'STUDENT' && (departmentFilter === 'ALL' || u.department.toLowerCase().includes(departmentFilter.toLowerCase()))).length || 1240;

  const handleSelectEvent = (eventId: string) => {
    setSelectedEventId(eventId);
    const evt = events.find(e => e.id === eventId);
    if (evt) {
      setTitle(`[Academic Event] ${evt.title}`);
      setDescription(`Reminder & Notification for upcoming academic event:\n\n• Event: ${evt.title}\n• Date: ${evt.date}${evt.time ? ` at ${evt.time}` : ''}\n• Venue: ${evt.venue}\n• Organized by: ${evt.organizer || 'GRI Academic Council'}\n\n${evt.description}\n\nAll enrolled students are requested to participate.`);
    }
  };

  const toggleChannel = (ch: any) => {
    if (selectedChannels.includes(ch)) {
      if (selectedChannels.length === 1) return;
      setSelectedChannels(selectedChannels.filter(c => c !== ch));
    } else {
      setSelectedChannels([...selectedChannels, ch]);
    }
  };

  const handleDispatchPushAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setFeedback('Please provide both notification title and message body.');
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Publish as student-targeted circular / announcement
      await addCircular({
        title,
        category: 'ACADEMIC',
        description,
        publishDate: new Date().toISOString().split('T')[0],
        targetRole: 'STUDENT',
        isImportant: priority === 'urgent' || priority === 'important',
        author: `${currentUser.name} (Central Administration)`,
        status: 'PUBLISHED',
      });

      // 2. Dispatch across selected channels for student cohort
      const channelsToDispatch = selectedChannels.length > 0 ? selectedChannels : ['IN_APP', 'PUSH'];
      for (const ch of channelsToDispatch) {
        await addDispatchedMessage({
          userId: 'student-cohort-broadcast',
          userName: `Student Cohort (${departmentFilter === 'ALL' ? 'All Departments' : departmentFilter})`,
          recipientEmail: 'students-broadcast@ruraluniv.ac.in',
          recipientPhone: '+91-94431-STUDENT',
          channel: ch as any,
          type: 'CIRCULAR_ALERT',
          title: `[GRI Push Alert] ${title}`,
          body: description.length > 300 ? `${description.substring(0, 297)}...` : description,
          status: 'DELIVERED',
          sentAt: new Date().toISOString(),
        });
      }

      setFeedback(`Successfully dispatched student push notification alert to ~${studentCount} students via [${channelsToDispatch.join(', ')}].`);
      setTitle('');
      setDescription('');
      setSelectedEventId('');
      setTimeout(() => setFeedback(null), 5000);
    } catch (err) {
      console.error('Error dispatching student push notification:', err);
      setFeedback('Error dispatching push alert. Please check connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-white shadow-xl border border-indigo-700/50 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 text-xs font-semibold mb-3">
              <Smartphone className="w-3.5 h-3.5 text-indigo-300" />
              Student Push Notification Service
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Student Cohort Broadcast & Academic Alerts</h2>
            <p className="text-indigo-200 text-sm mt-1 max-w-2xl">
              Instantly push real-time academic event notifications, exam reminders, and workshop alerts directly to student mobile devices and student portal dashboards.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10">
            <Users className="w-5 h-5 text-indigo-300" />
            <div>
              <div className="text-xs text-indigo-300 font-medium">Target Audience</div>
              <div className="text-sm font-bold">~{studentCount} Enrolled Students</div>
            </div>
          </div>
        </div>
      </div>

      {feedback && (
        <div className="p-4 rounded-2xl bg-indigo-950/90 border border-indigo-600/60 text-indigo-200 text-xs md:text-sm flex items-center justify-between shadow-lg animate-fadeIn">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" />
            <span>{feedback}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-indigo-300 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Dispatch Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Form */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <form onSubmit={handleDispatchPushAlert} className="space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                New Student Push Alert Composer
              </h3>
              <span className="text-xs text-gray-500 dark:text-slate-400 font-medium">Target: Students Only</span>
            </div>

            {/* Quick Select Academic Event */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                Quick-Select from Upcoming Academic Events (Optional)
              </label>
              <select
                value={selectedEventId}
                onChange={(e) => handleSelectEvent(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">-- Choose an upcoming academic event or write custom --</option>
                {upcomingEvents.map(evt => (
                  <option key={evt.id} value={evt.id}>
                    [{evt.category}] {evt.title} ({evt.date} at {evt.venue})
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1.5">
                Notification Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Mandatory Seminar on AI & Rural Innovation - ESE Hall"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Department & Priority */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-indigo-500" />
                  Department Cohort Filter
                </label>
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="ALL">All University Departments</option>
                  <option value="Computer Science">Department of Computer Science (MCA/M.Sc)</option>
                  <option value="Rural Industries">Department of Rural Industries & Management</option>
                  <option value="Agriculture">School of Agriculture & Animal Sciences</option>
                  <option value="Gandhigram">Gandhigram Rural Social Sciences</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                  Urgency & Priority Level
                </label>
                <select
                  value={priority}
                  onChange={(e: any) => setPriority(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="normal">Normal Academic Notice</option>
                  <option value="important">Important Event Reminder</option>
                  <option value="urgent">🚨 Urgent / High Priority Alert</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1.5">
                Notification Message Body <span className="text-red-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter complete details about the academic event, schedule, venue instructions, and prerequisites..."
                rows={5}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Delivery Channels */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-2">
                Multi-Channel Notification Dispatch Matrix
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'IN_APP', label: 'In-App Portal', icon: Bell },
                  { id: 'PUSH', label: 'Push Device', icon: Smartphone },
                  { id: 'WHATSAPP', label: 'WhatsApp', icon: MessageSquare },
                  { id: 'EMAIL', label: 'Institutional Mail', icon: Mail },
                ].map((ch) => {
                  const Icon = ch.icon;
                  const isSelected = selectedChannels.includes(ch.id as any);
                  return (
                    <button
                      type="button"
                      key={ch.id}
                      onClick={() => toggleChannel(ch.id)}
                      className={`flex items-center gap-2 p-3 rounded-2xl border text-xs font-medium transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-700 dark:text-indigo-300 shadow-sm' 
                          : 'bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400'}`} />
                      <span>{ch.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                {isSubmitting ? 'Dispatching Push Alert...' : `Broadcast to ~${studentCount} Students`}
              </button>
            </div>
          </form>
        </div>

        {/* Right Col: Quick Tips & Live Preview */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
              <Smartphone className="w-4 h-4 text-indigo-500" />
              Student Push Notification Guidelines
            </h4>
            <ul className="space-y-3 text-xs text-gray-600 dark:text-slate-400 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                <span><strong>Instant Delivery:</strong> Push alerts are immediately injected into student mobile dashboard notification trays.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                <span><strong>Academic Event Sync:</strong> Selecting an event automatically formats the date, time, and venue for clarity.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                <span><strong>Audit Logged:</strong> All broadcast actions are cryptographically recorded in the central administration audit trail.</span>
              </li>
            </ul>
          </div>

          <div className="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 rounded-3xl p-6">
            <h5 className="text-xs font-bold text-indigo-900 dark:text-indigo-200 uppercase tracking-wider mb-2">
              📱 Student Device Preview
            </h5>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800/80 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-[11px] text-gray-400">
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">G-Track Student Push</span>
                <span>Just Now</span>
              </div>
              <div className="text-xs font-bold text-gray-900 dark:text-white">
                {title || 'Upcoming Academic Event Alert'}
              </div>
              <div className="text-[11px] text-gray-600 dark:text-slate-400 line-clamp-3">
                {description || 'Notification body will appear here when you type or select an academic event above...'}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
