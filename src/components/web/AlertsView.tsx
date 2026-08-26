import React, { useState } from 'react';
import { useAppStore } from '../../core/store/appStore';
import { Bell, MapPin, Search } from 'lucide-react';
import { INITIAL_EVENTS } from '../../core/data/griMasterData';

export const AlertsView: React.FC = () => {
  const { circulars } = useAppStore();
  const [tab, setTab] = useState<'notices' | 'events'>('notices');

  return (
    <div className="flex flex-col space-y-4 px-5 pt-4 pb-24  max-w-md mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Campus</h2>
        <p className="text-sm text-gray-500">Updates and happenings</p>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-gray-100 rounded-full">
        <button 
          onClick={() => setTab('notices')}
          className={`flex-1 py-2 text-sm font-bold rounded-full transition-colors ${tab === 'notices' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}
        >
          Notices
        </button>
        <button 
          onClick={() => setTab('events')}
          className={`flex-1 py-2 text-sm font-bold rounded-full transition-colors ${tab === 'events' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}
        >
          Events
        </button>
      </div>

      <div className="pt-2">
        {tab === 'notices' && (
          <div className="space-y-3">
            {circulars.map((circ) => (
              <div key={circ.id} className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                    circ.isImportant ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                  }`}>
                    {circ.category}
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium">{circ.publishDate}</span>
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">{circ.title}</h3>
                <p className="text-xs text-gray-500 line-clamp-2">{circ.description}</p>
              </div>
            ))}
          </div>
        )}

        {tab === 'events' && (
          <div className="space-y-4">
            {INITIAL_EVENTS.map((event) => (
              <div key={event.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                <div className="h-32 bg-emerald-900 relative">
                  {event.imageUrl && (
                    <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover opacity-80" />
                  )}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-emerald-900">
                    {event.date}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 text-base mb-1">{event.title}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{event.location} • {event.time}</span>
                  </div>
                  <button className="w-full py-2.5 rounded-2xl bg-gray-50 hover:bg-gray-100 text-emerald-700 font-bold text-xs transition-colors">
                    Register Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
