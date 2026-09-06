import React, { useState, useEffect, useCallback } from 'react';
import { useAppStore } from '../../core/store/appStore';
import { useTheme } from '../../core/theme/ThemeContext';
import { Bell, Search, Sparkles, Sun, Moon, Settings, WifiOff, RefreshCw, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AppHeader: React.FC = () => {
  const { 
    currentUser, 
    setLoginModalOpen, 
    setTab, 
    setSearchOpen, 
    circulars,
    setIsOnline,
    resyncFirestoreState
  } = useAppStore();

  const unreadAlerts = circulars.filter(c => c.isImportant).length;
  const { isDark, toggleTheme } = useTheme();

  const [isOnlineLocal, setIsOnlineLocal] = useState<boolean>(() => 
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced'>('idle');
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  const performSync = useCallback(async () => {
    setSyncStatus('syncing');
    setSyncFeedback('Syncing state...');
    try {
      const res = await resyncFirestoreState();
      setSyncStatus('synced');
      if (res && res.successCount > 0) {
        setSyncFeedback(`Synced ${res.successCount} action${res.successCount > 1 ? 's' : ''}`);
      } else {
        setSyncFeedback('State synchronized');
      }
      const timer = setTimeout(() => {
        setSyncStatus('idle');
        setSyncFeedback(null);
      }, 2500);
      return () => clearTimeout(timer);
    } catch (error) {
      console.warn('[AppHeader] Sync error:', error);
      setSyncStatus('idle');
      setSyncFeedback(null);
    }
  }, [resyncFirestoreState]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnlineLocal(true);
      setIsOnline(true);
      performSync();
    };

    const handleOffline = () => {
      setIsOnlineLocal(false);
      setIsOnline(false);
      setSyncStatus('idle');
      setSyncFeedback(null);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setIsOnline, performSync]);

  return (
    <header id="main-app-header" className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-gray-100 dark:border-slate-800">
      <div className="flex items-center justify-between px-5 py-3">
        {/* Left: Identity, Greeting & Offline Status */}
        <div className="flex items-center gap-3">
          <div 
            id="header-user-avatar"
            onClick={() => currentUser.role !== 'guest' ? setTab('profile') : setLoginModalOpen(true)}
            className="cursor-pointer transition-transform active:scale-95"
          >
            {currentUser.avatarUrl ? (
              <img 
                src={currentUser.avatarUrl} 
                alt={currentUser.name} 
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100 dark:ring-slate-800" 
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-800 dark:text-emerald-300 font-bold text-sm ring-2 ring-gray-100 dark:ring-slate-800">
                {currentUser.name.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wide">
                {currentUser.role === 'guest' ? 'Welcome to GRI' : 'Good Morning'}
              </p>

              {/* Subtle Offline Mode / Syncing / Synced Badge */}
              <AnimatePresence>
                {!isOnlineLocal && (
                  <motion.button
                    id="offline-mode-badge"
                    type="button"
                    initial={{ opacity: 0, scale: 0.88, y: -1 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.88, y: -1 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    onClick={performSync}
                    title="Offline Mode: Viewing local cached data. Tap to retry connection & sync."
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 dark:bg-amber-400/10 text-amber-700 dark:text-amber-300 border border-amber-300/40 dark:border-amber-700/40 text-[10px] font-semibold tracking-tight hover:bg-amber-500/20 active:scale-95 transition-all cursor-pointer select-none"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    <WifiOff className="w-2.5 h-2.5" />
                    <span>Offline Mode</span>
                  </motion.button>
                )}

                {syncStatus === 'syncing' && (
                  <motion.div
                    id="syncing-state-badge"
                    initial={{ opacity: 0, scale: 0.88, y: -1 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.88, y: -1 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 dark:bg-emerald-400/10 text-emerald-700 dark:text-emerald-300 border border-emerald-300/40 dark:border-emerald-700/40 text-[10px] font-semibold tracking-tight select-none"
                    title="Re-synchronizing Firestore database state..."
                  >
                    <RefreshCw className="w-2.5 h-2.5 animate-spin text-emerald-600 dark:text-emerald-400" />
                    <span>Syncing...</span>
                  </motion.div>
                )}

                {syncStatus === 'synced' && (
                  <motion.div
                    id="synced-state-badge"
                    initial={{ opacity: 0, scale: 0.88, y: -1 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.88, y: -1 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 dark:bg-emerald-400/10 text-emerald-700 dark:text-emerald-300 border border-emerald-300/40 dark:border-emerald-700/40 text-[10px] font-semibold tracking-tight select-none"
                    title={syncFeedback || 'State synchronized'}
                  >
                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" />
                    <span>{syncFeedback || 'Synced'}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <h1 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
              {currentUser.role === 'guest' ? 'Guest Visitor' : currentUser.name.split(' ')[0]}
            </h1>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5">
          <button 
            id="header-btn-ai-chat"
            onClick={() => setTab('ai_chat')}
            className="relative p-2 rounded-full text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            title="GRI AI Assistant"
          >
            <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </button>
          <button 
            id="header-btn-search"
            onClick={() => setSearchOpen(true)}
            className="p-2 rounded-full text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            title="Quick Search"
          >
            <Search className="w-5 h-5" />
          </button>
          <button 
            id="header-btn-theme"
            onClick={toggleTheme}
            className="p-2 rounded-full text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
          </button>
          <button 
            id="header-btn-alerts"
            onClick={() => setTab('alerts')}
            className="relative p-2 rounded-full text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            title="Alerts & Circulars"
          >
            <Bell className="w-5 h-5" />
            {unreadAlerts > 0 && (
              <span className="absolute top-1 right-1.5 w-2 h-2 rounded-full bg-red-500 border-2 border-white dark:border-slate-900" />
            )}
          </button>
          <button 
            id="header-btn-settings"
            onClick={() => setTab('settings')}
            className="p-2 rounded-full text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            title="System Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
