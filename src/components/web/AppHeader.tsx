import React from 'react';
import { useAppStore } from '../../core/store/appStore';
import { Bell, Search, Sparkles } from 'lucide-react';
import { GRIEmblem } from '../common/GRIEmblem';

export const AppHeader: React.FC = () => {
  const { currentUser, setLoginModalOpen, setTab, setSearchOpen, circulars } = useAppStore();
  const unreadAlerts = circulars.filter(c => c.isImportant).length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-gray-100">
      <div className="flex items-center justify-between px-5 py-3">
        {/* Left: Identity & Greeting */}
        <div className="flex items-center gap-3">
          <div 
            onClick={() => currentUser.role !== 'guest' ? setTab('profile') : setLoginModalOpen(true)}
            className="cursor-pointer"
          >
            {currentUser.avatarUrl ? (
              <img 
                src={currentUser.avatarUrl} 
                alt={currentUser.name} 
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100" 
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 font-bold text-sm ring-2 ring-gray-100">
                {currentUser.name.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              {currentUser.role === 'guest' ? 'Welcome to GRI' : 'Good Morning'}
            </p>
            <h1 className="text-lg font-bold text-gray-900 leading-tight">
              {currentUser.role === 'guest' ? 'Guest Visitor' : currentUser.name.split(' ')[0]}
            </h1>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setTab('ai_chat')}
            className="relative p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <Sparkles className="w-5 h-5 text-emerald-600" />
          </button>
          <button 
            onClick={() => setSearchOpen(true)}
            className="p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setTab('alerts')}
            className="relative p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadAlerts > 0 && (
              <span className="absolute top-1 right-1.5 w-2 h-2 rounded-full bg-red-500 border-2 border-white" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
