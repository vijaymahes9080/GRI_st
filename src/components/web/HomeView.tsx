import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../core/store/appStore';
import { 
  Calendar, BookOpen, Clock, FileText, Bell, 
  ChevronRight, ArrowRight, ArrowUpRight, GraduationCap, MapPin, Play
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const { setTab, circulars, currentUser } = useAppStore();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  const importantCirculars = circulars.filter(c => c.isImportant).slice(0, 3);

  return (
    <div className="flex flex-col space-y-6 pb-24  px-5 pt-4 max-w-md mx-auto">
      
      {/* 1. Academic Summary / Attendance Card */}
      {currentUser.role !== 'guest' && (
        <div className="bg-emerald-900 rounded-3xl p-5 text-white shadow-xl shadow-emerald-900/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500 opacity-20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-emerald-100 text-xs font-medium uppercase tracking-wider mb-1">Overall Attendance</p>
              <h2 className="text-3xl font-bold">{currentUser.attendance || 84}%</h2>
            </div>
            <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
          </div>

          <div className="bg-emerald-800/50 backdrop-blur-md rounded-2xl p-4 border border-emerald-700/50 flex items-center justify-between">
            <div>
              <p className="text-xs text-emerald-200 mb-0.5">Next Class • 10:00 AM</p>
              <p className="text-sm font-bold">Data Structures</p>
              <p className="text-xs text-emerald-300 flex items-center gap-1 mt-1">
                <MapPin className="w-3 h-3" /> Room C-204
              </p>
            </div>
            <button className="w-8 h-8 bg-white text-emerald-900 rounded-full flex items-center justify-center shadow-md">
              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
            </button>
          </div>
        </div>
      )}

      {/* Guest Banner */}
      {currentUser.role === 'guest' && (
        <div className="relative h-48 rounded-3xl overflow-hidden group shadow-md" onClick={() => setTab('explore')}>
          <img 
            src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800" 
            alt="Campus" 
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-[5s] ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-900/60 to-transparent" />
          <div className="absolute bottom-0 left-0 p-5">
            <h2 className="text-xl font-bold text-white leading-tight mb-2">
              Education for<br/>rural transformation.
            </h2>
            <button className="text-xs font-bold text-emerald-200 uppercase tracking-wider flex items-center gap-1">
              Explore Campus <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* 2. Quick Actions Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-gray-900">Services</h3>
          <button onClick={() => setTab('services')} className="text-sm font-semibold text-emerald-600">See All</button>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {[
            { id: 'timetable', title: 'Schedule', icon: <Clock className="w-5 h-5" />, bg: 'bg-amber-50', text: 'text-amber-600' },
            { id: 'results', title: 'Results', icon: <GraduationCap className="w-5 h-5" />, bg: 'bg-blue-50', text: 'text-blue-600' },
            { id: 'library', title: 'Library', icon: <BookOpen className="w-5 h-5" />, bg: 'bg-purple-50', text: 'text-purple-600' },
            { id: 'notices', title: 'Notices', icon: <Bell className="w-5 h-5" />, bg: 'bg-rose-50', text: 'text-rose-600' },
          ].map((service) => (
            <div 
              key={service.id}
              onClick={() => setTab('services')}
              className="flex flex-col items-center gap-2 cursor-pointer group"
            >
              <div className={`w-14 h-14 rounded-2xl ${service.bg} ${service.text} flex items-center justify-center transition-transform group-hover:scale-95`}>
                {service.icon}
              </div>
              <span className="text-xs font-medium text-gray-600">{service.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Upcoming Assignments/Tasks */}
      {currentUser.role !== 'guest' && (
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-3">Pending Tasks</h3>
          <div className="bg-gray-50 border border-gray-100 rounded-3xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100">
                <FileText className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">3 Assignments</h4>
                <p className="text-xs text-gray-500">Due this week</p>
              </div>
            </div>
            <button onClick={() => setTab('services')} className="w-8 h-8 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 4. Important Notices */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-gray-900">Recent Notices</h3>
          <button onClick={() => setTab('alerts')} className="text-sm font-semibold text-emerald-600">See All</button>
        </div>
        <div className="space-y-3">
          {importantCirculars.length > 0 ? importantCirculars.map((circ) => (
            <div 
              key={circ.id}
              onClick={() => setTab('alerts')}
              className="bg-white border border-gray-100 rounded-3xl p-4 flex gap-4 cursor-pointer hover:border-emerald-200 transition-colors shadow-sm"
            >
              <div className="w-10 h-10 rounded-2xl bg-rose-50 flex items-center justify-center shrink-0">
                <Bell className="w-5 h-5 text-rose-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                    {circ.category}
                  </span>
                  <span className="text-[10px] text-gray-400">{circ.publishDate}</span>
                </div>
                <h4 className="font-bold text-gray-900 text-sm leading-snug truncate">{circ.title}</h4>
              </div>
            </div>
          )) : (
            <div className="bg-gray-50 border border-gray-100 rounded-3xl p-6 text-center">
              <p className="text-sm text-gray-500">No new notices.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
