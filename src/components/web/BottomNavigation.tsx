import React from 'react';
import { useAppStore, AppTab } from '../../core/store/appStore';
import { Home, Compass, MapPin, Grid, User } from 'lucide-react';

export const BottomNavigation: React.FC = () => {
  const { currentTab, setTab } = useAppStore();

  const navItems: { id: AppTab | 'campus'; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { id: 'explore', label: 'Academics', icon: <Compass className="w-5 h-5" /> },
    // Reusing 'services' as campus for now, or alerts. 
    // We'll map 'campus' to alerts temporarily, or just keep it as a tab if we add it. 
    // Let's use existing valid tabs.
    { id: 'alerts', label: 'Campus', icon: <MapPin className="w-5 h-5" /> },
    { id: 'services', label: 'Services', icon: <Grid className="w-5 h-5" /> },
    { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
      <div className="flex items-center justify-around px-2 h-16 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setTab(item.id as AppTab)}
              className="flex flex-col items-center justify-center w-16 h-full space-y-1 relative group"
            >
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${
                  isActive ? 'text-emerald-700 bg-emerald-50' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {item.icon}
              </div>
              <span
                className={`text-[10px] font-medium transition-colors duration-300 ${
                  isActive ? 'text-emerald-700' : 'text-gray-400 group-hover:text-gray-600'
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <div className="absolute top-0 w-8 h-0.5 bg-emerald-600 rounded-b-full transition-all duration-300" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
