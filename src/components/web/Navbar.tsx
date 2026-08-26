import React from 'react';
import { useAppStore, AppTab } from '../../core/store/appStore';
import { GRIEmblem } from '../common/GRIEmblem';
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
  Sparkles,
  Menu,
  X,
  LogOut
} from 'lucide-react';
import { INSTITUTION_INFO } from '../../core/data/griMasterData';

export const Navbar: React.FC = () => {
  const { 
    currentTab, 
    setTab, 
    viewMode, 
    toggleViewMode, 
    currentUser, 
    setSearchOpen, 
    setLoginModalOpen,
    doLogout,
    circulars, 
    isFirestoreLive 
  } = useAppStore();
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
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-[#E5EAE7] text-[#1A1F1D]">
      {/* Top utility bar */}
      <div className="bg-[#0F4C3A] px-4 py-2 text-[11px] flex items-center justify-between text-white/90 font-medium">
        <div className="flex items-center space-x-4">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-pulse"></span>
            NAAC "A++" (3.61 CGPA)
          </span>
          <span className="hidden sm:inline opacity-40">|</span>
          <span className="hidden sm:inline">{INSTITUTION_INFO.ministry}</span>
          <span className="hidden md:inline opacity-40">|</span>
          <span className="hidden md:inline italic font-serif">"{INSTITUTION_INFO.mottoTamil} — {INSTITUTION_INFO.mottoEnglish}"</span>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full ${isFirestoreLive ? 'bg-[#34D399] animate-pulse' : 'bg-[#FBBF24]'}`}></span>
            <span>{isFirestoreLive ? 'System Online' : 'Connecting'}</span>
          </div>

          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            title="Search Portal (Ctrl + K)"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-white">Search</span>
            <kbd className="hidden sm:inline-block opacity-60 font-mono">⌘K</kbd>
          </button>

          <button
            onClick={toggleViewMode}
            className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            {viewMode === 'desktop' ? (
              <>
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mobile</span>
              </>
            ) : (
              <>
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Desktop</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & University Branding */}
          <div 
            onClick={() => setTab('home')} 
            className="flex items-center space-x-4 cursor-pointer group select-none"
          >
            <GRIEmblem className="w-12 h-12 transition-transform duration-500 ease-out group-hover:scale-105" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-lg sm:text-xl tracking-tight text-[#1A1F1D]">
                  GANDHIGRAM RURAL INSTITUTE
                </span>
              </div>
              <p className="text-[11px] text-[#5C6661] font-medium hidden sm:block mt-0.5 uppercase tracking-wider">
                Deemed to be University • Estd. 1956
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center space-x-2">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setTab(item.id)}
                  className={`relative flex items-center space-x-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    isActive
                      ? 'bg-[#0F4C3A] text-white shadow-md shadow-[#0F4C3A]/20'
                      : 'text-[#4A5550] hover:text-[#0F4C3A] hover:bg-[#F2F6F4]'
                  }`}
                >
                  <span className={`${isActive ? 'opacity-100' : 'opacity-70'}`}>{item.icon}</span>
                  <span>{item.label}</span>
                  {item.badge && item.badge > 0 ? (
                    <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold bg-[#EF4444] text-white rounded-full">
                      {item.badge}
                    </span>
                  ) : null}
                  {item.id === 'ai_chat' && !isActive && (
                    <Sparkles className="w-3.5 h-3.5 text-[#0F4C3A] animate-pulse ml-0.5" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* User Status / Profile Switcher Button */}
          <div className="hidden sm:flex items-center space-x-3">
            {currentUser.role === 'guest' ? (
              <button
                id="btn-navbar-guest-login"
                onClick={() => setLoginModalOpen(true)}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#0F4C3A] hover:bg-[#16604B] text-white font-semibold text-sm transition-all shadow-md shadow-[#0F4C3A]/20"
              >
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  id="btn-navbar-profile"
                  onClick={() => setLoginModalOpen(true)}
                  title="Switch identity or update institutional profile"
                  className="flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-[#F2F6F4] transition-colors"
                >
                  {currentUser.avatarUrl ? (
                    <img 
                      src={currentUser.avatarUrl} 
                      alt={currentUser.name} 
                      referrerPolicy="no-referrer"
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-[#0F4C3A]/10" 
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-[#E5F0EB] flex items-center justify-center text-sm font-bold text-[#0F4C3A] ring-2 ring-[#0F4C3A]/10">
                      {currentUser.name.charAt(0)}
                    </div>
                  )}
                  <div className="text-left leading-tight">
                    <div className="text-sm font-bold text-[#1A1F1D] truncate max-w-[130px]">{currentUser.name}</div>
                    <div className="text-[10px] text-[#5C6661] uppercase tracking-wider font-semibold">{currentUser.role}</div>
                  </div>
                </button>

                <button
                  id="btn-navbar-logout"
                  onClick={() => doLogout()}
                  title="Sign out & Purge session data"
                  className="p-2.5 rounded-xl text-[#5C6661] hover:text-[#EF4444] hover:bg-[#FEF2F2] transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-[#1A1F1D] hover:bg-[#F2F6F4]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute left-0 right-0 top-full max-h-[80vh] overflow-y-auto bg-white border-b border-[#E5EAE7] px-4 pt-2 pb-6 space-y-3 shadow-2xl">
          {currentUser.role !== 'guest' && (
            <div className="p-4 bg-[#F8FAF9] rounded-2xl flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-[#1A1F1D]">{currentUser.name}</div>
                <div className="text-[10px] text-[#5C6661] uppercase tracking-wider font-semibold mt-1">{currentUser.role}</div>
              </div>
              <button
                onClick={() => {
                  doLogout();
                  setMobileMenuOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-white border border-[#E5EAE7] text-[#EF4444] text-xs font-bold flex items-center gap-2 shadow-sm"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}

          <div className="space-y-1 mt-2">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-[#0F4C3A] text-white'
                      : 'text-[#4A5550] hover:bg-[#F2F6F4]'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className={`${isActive ? 'opacity-100' : 'opacity-60'}`}>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && item.badge > 0 ? (
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-[#EF4444] text-white rounded-full">
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
