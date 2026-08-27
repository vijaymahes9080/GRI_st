import React, { useState } from 'react';
import { useAppStore } from '../../core/store/appStore';
import { useTheme } from '../../core/theme/ThemeContext';
import { 
  Settings, 
  Bell, 
  Sun, 
  Moon, 
  Shield, 
  Lock, 
  Smartphone, 
  Mail, 
  MessageSquare, 
  Database, 
  RefreshCw, 
  Info, 
  Check, 
  LogOut, 
  Palette, 
  Volume2,
  ChevronRight,
  Globe,
  Sliders,
  CheckCircle2,
  FileText,
  Briefcase,
  BookOpen,
  DollarSign,
  Calendar,
  Building,
  Bus,
  AlertTriangle,
  Sparkles,
  Layers
} from 'lucide-react';
import { ALL_NOTIFICATION_CATEGORIES, DEFAULT_SUBSCRIBED_CATEGORY_IDS } from '../../core/data/notificationCategories';

export const SettingsView: React.FC = () => {
  const { currentUser, doLogout, setTab, setLoginModalOpen, updateNotificationPreferences } = useAppStore();
  const { isDark, toggleTheme } = useTheme();

  const userPrefs = currentUser.notificationPreferences || {
    subscribedCategories: DEFAULT_SUBSCRIBED_CATEGORY_IDS,
    pushEnabled: true,
    emailAlerts: true,
    whatsappAlerts: true,
    soundEffects: true,
  };

  // Local preferences state initialized from user profile
  const [subscribedCategories, setSubscribedCategories] = useState<string[]>(
    userPrefs.subscribedCategories && userPrefs.subscribedCategories.length > 0 
      ? userPrefs.subscribedCategories 
      : DEFAULT_SUBSCRIBED_CATEGORY_IDS
  );
  const [pushEnabled, setPushEnabled] = useState(userPrefs.pushEnabled !== false);
  const [emailAlerts, setEmailAlerts] = useState(userPrefs.emailAlerts !== false);
  const [whatsappAlerts, setWhatsappAlerts] = useState(userPrefs.whatsappAlerts !== false);
  const [soundEffects, setSoundEffects] = useState(userPrefs.soundEffects !== false);
  const [biometricLock, setBiometricLock] = useState(false);
  const [accentColor, setAccentColor] = useState(
    typeof window !== 'undefined' ? localStorage.getItem('gri_primary_color') || '#0F4C3A' : '#0F4C3A'
  );
  const [feedbackSaved, setFeedbackSaved] = useState<string | null>(null);

  const showSaveToast = (msg: string) => {
    setFeedbackSaved(msg);
    setTimeout(() => setFeedbackSaved(null), 3000);
  };

  const handleCategoryToggle = async (categoryId: string) => {
    let updated: string[];
    if (subscribedCategories.includes(categoryId)) {
      // Prevent unselecting all (keep at least 1)
      if (subscribedCategories.length === 1) {
        showSaveToast('You must stay subscribed to at least 1 notification category.');
        return;
      }
      updated = subscribedCategories.filter(id => id !== categoryId);
    } else {
      updated = [...subscribedCategories, categoryId];
    }
    setSubscribedCategories(updated);
    
    await updateNotificationPreferences({
      subscribedCategories: updated,
      pushEnabled,
      emailAlerts,
      whatsappAlerts,
      soundEffects,
    });

    const catName = ALL_NOTIFICATION_CATEGORIES.find(c => c.id === categoryId)?.shortName || categoryId;
    const isNowSubscribed = updated.includes(categoryId);
    showSaveToast(isNowSubscribed ? `Subscribed to ${catName} alerts.` : `Unsubscribed from ${catName} alerts.`);
  };

  const handleSelectAllCategories = async () => {
    const allIds = ALL_NOTIFICATION_CATEGORIES.map(c => c.id);
    setSubscribedCategories(allIds);
    await updateNotificationPreferences({
      subscribedCategories: allIds,
      pushEnabled,
      emailAlerts,
      whatsappAlerts,
      soundEffects,
    });
    showSaveToast('Subscribed to all notification categories.');
  };

  const handleSelectEssentialOnly = async () => {
    const essentials = ['exam', 'academic', 'fees', 'emergency'];
    setSubscribedCategories(essentials);
    await updateNotificationPreferences({
      subscribedCategories: essentials,
      pushEnabled,
      emailAlerts,
      whatsappAlerts,
      soundEffects,
    });
    showSaveToast('Subscribed to essential academic & exam categories only.');
  };

  const handleTogglePush = async () => {
    const newVal = !pushEnabled;
    setPushEnabled(newVal);
    await updateNotificationPreferences({ pushEnabled: newVal });
    showSaveToast(newVal ? 'Push notifications enabled.' : 'Push notifications disabled.');
  };

  const handleToggleEmail = async () => {
    const newVal = !emailAlerts;
    setEmailAlerts(newVal);
    await updateNotificationPreferences({ emailAlerts: newVal });
    showSaveToast(newVal ? 'Email circular alerts enabled.' : 'Email circular alerts disabled.');
  };

  const handleToggleWhatsapp = async () => {
    const newVal = !whatsappAlerts;
    setWhatsappAlerts(newVal);
    await updateNotificationPreferences({ whatsappAlerts: newVal });
    showSaveToast(newVal ? 'WhatsApp academic alerts enabled.' : 'WhatsApp academic alerts disabled.');
  };

  const handleToggleSound = async () => {
    const newVal = !soundEffects;
    setSoundEffects(newVal);
    await updateNotificationPreferences({ soundEffects: newVal });
    showSaveToast(newVal ? 'Audio feedback enabled.' : 'Audio feedback silenced.');
  };

  const handleAccentChange = (color: string) => {
    setAccentColor(color);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('gri_primary_color', color);
    }
    document.documentElement.style.setProperty('--primary', color);
    showSaveToast('Accent theme updated successfully.');
  };

  const handleClearCache = () => {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('gri_offline_delta');
    }
    showSaveToast('Local IndexedDB & offline cache purged and re-indexed.');
  };

  const renderCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'FileText': return <FileText className="w-4 h-4" />;
      case 'Briefcase': return <Briefcase className="w-4 h-4" />;
      case 'BookOpen': return <BookOpen className="w-4 h-4" />;
      case 'DollarSign': return <DollarSign className="w-4 h-4" />;
      case 'Calendar': return <Calendar className="w-4 h-4" />;
      case 'Building': return <Building className="w-4 h-4" />;
      case 'Bus': return <Bus className="w-4 h-4" />;
      case 'AlertTriangle': return <AlertTriangle className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6 pb-24 p-4 sm:p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-1">
            <Sliders className="w-3.5 h-3.5" />
            Portal Preferences
          </div>
          <h2 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">Settings & Subscriptions</h2>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
            Configure notification categories, broadcast channels, visual appearance, and security.
          </p>
        </div>
      </div>

      {feedbackSaved && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center justify-between shadow-sm animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="font-semibold">{feedbackSaved}</span>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* FEATURE: CATEGORY-BASED NOTIFICATION SUBSCRIPTIONS */}
      {/* ========================================================= */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-gray-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Subscribed Notification Categories
            </h3>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
              Select which notice categories you want to receive on your feed and push channels.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSelectAllCategories}
              className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 hover:bg-blue-100 transition-colors"
            >
              Select All
            </button>
            <button
              onClick={handleSelectEssentialOnly}
              className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-200 transition-colors"
            >
              Essentials Only
            </button>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {ALL_NOTIFICATION_CATEGORIES.map((cat) => {
            const isSubscribed = subscribedCategories.includes(cat.id);
            return (
              <div
                key={cat.id}
                id={`pref-category-${cat.id}`}
                onClick={() => handleCategoryToggle(cat.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                  isSubscribed
                    ? 'border-blue-500/60 bg-blue-50/40 dark:bg-blue-950/20 shadow-sm'
                    : 'border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-850/50 opacity-70 hover:opacity-100'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    isSubscribed 
                      ? 'bg-blue-600 text-white shadow-sm' 
                      : 'bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-slate-400'
                  }`}>
                    {renderCategoryIcon(cat.iconName)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-gray-900 dark:text-white">
                        {cat.shortName}
                      </span>
                      {isSubscribed && (
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-slate-400 leading-tight mt-0.5">
                      {cat.description}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 mt-1">
                  <input
                    type="checkbox"
                    checked={isSubscribed}
                    onChange={() => {}} // Handled by container click
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-2 flex items-center justify-between text-xs text-gray-500 dark:text-slate-400 border-t border-gray-100 dark:border-slate-800">
          <span>Active Subscriptions: <strong className="text-blue-600 dark:text-blue-400">{subscribedCategories.length}</strong> of {ALL_NOTIFICATION_CATEGORIES.length} Categories</span>
          <button 
            onClick={() => setTab('circulars')}
            className="font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            View Subscribed Feed <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SECTION: BROADCAST CHANNELS */}
      {/* ========================================================= */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-amber-500" />
          Broadcast Channels & Alerts
        </h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between py-1.5">
            <div className="flex items-center gap-2.5">
              <Smartphone className="w-4 h-4 text-gray-400" />
              <div>
                <div className="text-xs font-bold text-gray-800 dark:text-slate-200">Push Notifications</div>
                <div className="text-[11px] text-gray-500 dark:text-slate-400">Receive real-time alerts for exams, results & timetable changes</div>
              </div>
            </div>
            <button
              onClick={handleTogglePush}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                pushEnabled ? 'bg-emerald-600' : 'bg-gray-300 dark:bg-slate-700'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                pushEnabled ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between py-1.5 border-t border-gray-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-gray-400" />
              <div>
                <div className="text-xs font-bold text-gray-800 dark:text-slate-200">Institutional Email Alerts</div>
                <div className="text-[11px] text-gray-500 dark:text-slate-400">Official circulars and fee receipts sent to {currentUser.email}</div>
              </div>
            </div>
            <button
              onClick={handleToggleEmail}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                emailAlerts ? 'bg-emerald-600' : 'bg-gray-300 dark:bg-slate-700'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                emailAlerts ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between py-1.5 border-t border-gray-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <MessageSquare className="w-4 h-4 text-gray-400" />
              <div>
                <div className="text-xs font-bold text-gray-800 dark:text-slate-200">WhatsApp Academic Broadcasts</div>
                <div className="text-[11px] text-gray-500 dark:text-slate-400">Instant reminder alerts on {currentUser.phone || '+91 98421 77321'}</div>
              </div>
            </div>
            <button
              onClick={handleToggleWhatsapp}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                whatsappAlerts ? 'bg-emerald-600' : 'bg-gray-300 dark:bg-slate-700'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                whatsappAlerts ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between py-1.5 border-t border-gray-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <Volume2 className="w-4 h-4 text-gray-400" />
              <div>
                <div className="text-xs font-bold text-gray-800 dark:text-slate-200">In-App Sound Feedback</div>
                <div className="text-[11px] text-gray-500 dark:text-slate-400">Audio cues for successful payments, scans, and submissions</div>
              </div>
            </div>
            <button
              onClick={handleToggleSound}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                soundEffects ? 'bg-emerald-600' : 'bg-gray-300 dark:bg-slate-700'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                soundEffects ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SECTION: APPEARANCE & THEME */}
      {/* ========================================================= */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Palette className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          Appearance & Theme
        </h3>
        
        <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-slate-800">
          <div>
            <div className="text-xs font-bold text-gray-800 dark:text-slate-200">Dark Mode Interface</div>
            <div className="text-[11px] text-gray-500 dark:text-slate-400">Switch between light day mode and dark twilight mode</div>
          </div>
          <button
            onClick={toggleTheme}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isDark ? 'bg-emerald-600' : 'bg-gray-300 dark:bg-slate-700'
            }`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              isDark ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>

        <div className="pt-1">
          <div className="text-xs font-bold text-gray-800 dark:text-slate-200 mb-2">Institutional Accent Theme</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { name: 'Forest Green', color: '#0F4C3A' },
              { name: 'Khadi Gold', color: '#D97706' },
              { name: 'Royal Blue', color: '#1E3A8A' },
              { name: 'Crimson Red', color: '#991B1B' },
            ].map((item) => (
              <button
                key={item.color}
                onClick={() => handleAccentChange(item.color)}
                className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-bold border transition-all ${
                  accentColor === item.color 
                    ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 shadow-sm' 
                    : 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800'
                }`}
              >
                <span className="w-3.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span>{item.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SECTION: STORAGE & SECURITY */}
      {/* ========================================================= */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Shield className="w-4 h-4 text-indigo-500" />
          Account & Security
        </h3>

        <div className="space-y-3">
          <button 
            onClick={() => setTab('profile')}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 dark:bg-slate-800/80 hover:bg-gray-100 dark:hover:bg-slate-750 transition-colors text-left"
          >
            <div>
              <div className="text-xs font-bold text-gray-800 dark:text-slate-200">View Academic Profile & Digital ID</div>
              <div className="text-[11px] text-gray-500 dark:text-slate-400">Department records, attendance heatmaps & QR student card</div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>

          <button 
            onClick={handleClearCache}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 dark:bg-slate-800/80 hover:bg-gray-100 dark:hover:bg-slate-750 transition-colors text-left"
          >
            <div className="flex items-center gap-2.5">
              <Database className="w-4 h-4 text-gray-500" />
              <div>
                <div className="text-xs font-bold text-gray-800 dark:text-slate-200">Clear Offline Cache & Re-index</div>
                <div className="text-[11px] text-gray-500 dark:text-slate-400">Purge local IndexedDB temporary files</div>
              </div>
            </div>
            <RefreshCw className="w-4 h-4 text-gray-400" />
          </button>

          <button 
            onClick={() => { doLogout(); setTab('home'); }}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors text-red-600 dark:text-red-400"
          >
            <div className="flex items-center gap-2.5 font-bold text-xs">
              <LogOut className="w-4 h-4" />
              <span>Sign Out of G-Track Account</span>
            </div>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};
