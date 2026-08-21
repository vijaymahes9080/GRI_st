import React from 'react';
import { useAppStore, AppTab } from '../../core/store/appStore';
import { 
  Home, 
  Compass, 
  Layers, 
  Bell, 
  Bot, 
  ShieldCheck, 
  User, 
  Search, 
  Smartphone, 
  Monitor,
  GraduationCap,
  Sparkles,
  Menu,
  X
} from 'lucide-react';
import { INSTITUTION_INFO } from '../../core/data/griMasterData';

export const Navbar: React.FC = () => {
  const { currentTab, setTab, viewMode, toggleViewMode, currentUser, setSearchOpen, circulars, isFirestoreLive } = useAppStore();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const unreadAlerts = circulars.filter(c => c.isImportant).length;

  const navItems: { id: AppTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { id: 'explore', label: 'Academics & Schools', icon: <Compass className="w-4 h-4" /> },
    { id: 'services', label: 'Student & ESE Services', icon: <Layers className="w-4 h-4" /> },
    { id: 'alerts', label: 'Circulars', icon: <Bell className="w-4 h-4" />, badge: unreadAlerts },
    { id: 'ai_chat', label: 'GRI AI Assistant', icon: <Bot className="w-4 h-4" /> },
    { id: 'admin', label: 'Admin Panel', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'profile', label: 'Portal ID', icon: <User className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100">
      {/* Top utility bar */}
      <div className="bg-slate-950/80 px-4 py-1.5 border-b border-slate-800/80 text-xs flex items-center justify-between">
        <div className="flex items-center space-x-3 text-slate-400">
          <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            NAAC "A++" (3.61 CGPA)
          </span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden sm:inline">{INSTITUTION_INFO.ministry}</span>
          <span className="hidden md:inline text-slate-600">|</span>
          <span className="hidden md:inline italic text-amber-300/90 font-serif">"{INSTITUTION_INFO.mottoTamil} — {INSTITUTION_INFO.mottoEnglish}"</span>
        </div>

        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/80 text-[10px] text-emerald-400">
            <span className={`w-1.5 h-1.5 rounded-full ${isFirestoreLive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
            <span>{isFirestoreLive ? 'Firestore Live' : 'Connecting'}</span>
          </div>

          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 transition"
            title="Search Portal (Ctrl + K)"
          >
            <Search className="w-3 h-3 text-slate-400" />
            <span className="hidden sm:inline">Search portal...</span>
            <kbd className="hidden sm:inline-block px-1 py-0.2 text-[10px] bg-slate-900 text-slate-400 rounded border border-slate-700 font-mono">⌘K</kbd>
          </button>

          <button
            onClick={toggleViewMode}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-600/40 text-emerald-300 hover:bg-emerald-900/60 text-xs transition"
          >
            {viewMode === 'desktop' ? (
              <>
                <Smartphone className="w-3 h-3" />
                <span>Mobile View</span>
              </>
            ) : (
              <>
                <Monitor className="w-3 h-3" />
                <span>Full Web View</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & University Branding */}
          <div 
            onClick={() => setTab('home')} 
            className="flex items-center space-x-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-amber-700 flex items-center justify-center shadow-lg shadow-emerald-900/40 border border-emerald-500/30 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-bold text-base sm:text-lg tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                  GANDHIGRAM RURAL INSTITUTE
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded">
                  Deemed Univ
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Estd. 1956 • Gandhigram, Dindigul, Tamil Nadu
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setTab(item.id)}
                  className={`relative flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 shadow-inner'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                  {item.badge && item.badge > 0 ? (
                    <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold bg-rose-600 text-white rounded-full animate-bounce">
                      {item.badge}
                    </span>
                  ) : null}
                  {item.id === 'ai_chat' && (
                    <Sparkles className="w-3 h-3 text-amber-400 animate-pulse ml-0.5" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* User Status / Profile Switcher Button */}
          <div className="hidden sm:flex items-center space-x-2">
            <button
              onClick={() => setTab('profile')}
              className="flex items-center space-x-2.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 transition"
            >
              {currentUser.avatarUrl ? (
                <img 
                  src={currentUser.avatarUrl} 
                  alt={currentUser.name} 
                  className="w-7 h-7 rounded-full object-cover border border-emerald-500" 
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-emerald-700 flex items-center justify-center text-xs font-bold text-white border border-emerald-500">
                  {currentUser.name.charAt(0)}
                </div>
              )}
              <div className="text-left leading-tight">
                <div className="text-xs font-semibold text-slate-200 truncate max-w-[120px]">{currentUser.name}</div>
                <div className="text-[10px] text-emerald-400 capitalize">{currentUser.role}</div>
              </div>
            </button>
          </div>

          {/* Mobile menu toggle */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge && item.badge > 0 ? (
                  <span className="px-1.5 py-0.5 text-xs font-bold bg-rose-600 text-white rounded-full">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
