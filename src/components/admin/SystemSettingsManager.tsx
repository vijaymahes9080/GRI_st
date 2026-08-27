import React, { useState } from 'react';
import { useAppStore } from '../../core/store/appStore';
import { 
  Sliders, 
  Sparkles, 
  Building2, 
  Image as ImageIcon, 
  Save, 
  Check, 
  X, 
  ShieldCheck, 
  Globe, 
  ToggleLeft, 
  ToggleRight, 
  Cpu,
  Mail,
  Phone,
  MapPin,
  Flame,
  Award,
  Palette,
  Sun,
  Moon
} from 'lucide-react';

export const SystemSettingsManager: React.FC = () => {
  const { 
    institutionProfile, 
    heroConfig, 
    featureFlags, 
    aiSettings, 
    saveInstitutionProfile, 
    saveHeroConfig, 
    saveFeatureFlags, 
    saveAiSettings 
  } = useAppStore();

  const [feedback, setFeedback] = useState<string | null>(null);

  // Institution Profile State
  const [instName, setInstName] = useState(institutionProfile.name);
  const [instTamilName, setInstTamilName] = useState(institutionProfile.tamilName || '');
  const [instTagline, setInstTagline] = useState(institutionProfile.tagline);
  const [instNaac, setInstNaac] = useState(institutionProfile.naacGrade);
  const [instNirf, setInstNirf] = useState(institutionProfile.nirfRank);
  const [instPhone, setInstPhone] = useState(institutionProfile.phone);
  const [instEmail, setInstEmail] = useState(institutionProfile.email);
  const [instAddress, setInstAddress] = useState(institutionProfile.address);
  const [instViceChancellor, setInstViceChancellor] = useState(institutionProfile.viceChancellor);
  const [instRegistrar, setInstRegistrar] = useState(institutionProfile.registrar);

  // Theme & Color Picker State
  const [primaryColor, setPrimaryColor] = useState(() => {
    return localStorage.getItem('gri_primary_color') || '#14532D';
  });
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('gri_theme_mode') as 'light' | 'dark') || 'light';
  });

  const handleColorChange = (color: string) => {
    setPrimaryColor(color);
    document.documentElement.style.setProperty('--primary', color);
    localStorage.setItem('gri_primary_color', color);
    setFeedback(`Primary brand color updated to ${color}`);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleThemeModeChange = (mode: 'light' | 'dark') => {
    setThemeMode(mode);
    localStorage.setItem('gri_theme_mode', mode);
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    setFeedback(`Portal theme mode switched to ${mode.toUpperCase()}`);
    setTimeout(() => setFeedback(null), 3000);
  };

  // Hero Banner State
  const [heroBadge, setHeroBadge] = useState(heroConfig.accreditationBadge);
  const [heroTitle, setHeroTitle] = useState(heroConfig.headline);
  const [heroSubtitle, setHeroSubtitle] = useState(heroConfig.description);
  const [heroCtaText, setHeroCtaText] = useState(heroConfig.primaryCtaText);
  const [heroCtaLink, setHeroCtaLink] = useState(heroConfig.primaryCtaTab);
  const [heroSecondaryCtaText, setHeroSecondaryCtaText] = useState(heroConfig.secondaryCtaText);
  const [heroSecondaryCtaLink, setHeroSecondaryCtaLink] = useState(heroConfig.secondaryCtaTab);
  const [heroLiveNotice, setHeroLiveNotice] = useState(heroConfig.urgentTickerText);

  // Feature Flags State
  const [flags, setFlags] = useState(featureFlags);

  // Gemini AI Config State
  const [aiModel, setAiModel] = useState(aiSettings.model);
  const [aiTemperature, setAiTemperature] = useState(aiSettings.temperature);
  const [aiSystemInstruction, setAiSystemInstruction] = useState(aiSettings.systemInstruction);
  const [aiGroundingThreshold, setAiGroundingThreshold] = useState(aiSettings.groundingThreshold);

  const handleSaveInstitution = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveInstitutionProfile({
      name: instName,
      tamilName: instTamilName,
      tagline: instTagline,
      naacGrade: instNaac,
      nirfRank: instNirf,
      phone: instPhone,
      email: instEmail,
      address: instAddress,
      viceChancellor: instViceChancellor,
      registrar: instRegistrar,
    });
    setFeedback('University institutional profile and branding updated.');
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleSaveHero = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveHeroConfig({
      badgeText: heroBadge,
      title: heroTitle,
      subtitle: heroSubtitle,
      ctaText: heroCtaText,
      ctaLink: heroCtaLink,
      secondaryCtaText: heroSecondaryCtaText,
      secondaryCtaLink: heroSecondaryCtaLink,
      liveNoticeTicker: heroLiveNotice,
    });
    setFeedback('Home screen hero banner & live broadcast ticker updated.');
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleToggleFlag = async (key: keyof typeof flags) => {
    const updated = { ...flags, [key]: !flags[key] };
    setFlags(updated);
    await saveFeatureFlags(updated);
    setFeedback(`Feature flag ${String(key)} set to ${updated[key] ? 'ENABLED' : 'DISABLED'}.`);
    setTimeout(() => setFeedback(null), 2500);
  };

  const handleSaveGemini = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveAiSettings({
      modelName: aiModel,
      temperature: Number(aiTemperature),
      systemInstruction: aiSystemInstruction,
      groundingThreshold: Number(aiGroundingThreshold),
    });
    setFeedback('Gemini AI Assistant parameters and institutional grounding prompt saved.');
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Feedback */}
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

      {/* SECTION: Portal Theme & Brand Color Customization */}
      <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-6 text-xs">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
              <Palette className="w-4 h-4 text-emerald-400" />
              Portal Theme & Brand Color Customization
            </h3>
            <p className="text-[11px] text-slate-400">
              Customize the primary brand color and switch between light and dark modes with dynamic CSS variable updates.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Primary Brand Color Picker */}
          <div className="space-y-3">
            <label className="block text-slate-300 font-bold">Primary Brand Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => handleColorChange(e.target.value)}
                className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-700 cursor-pointer p-1"
              />
              <div>
                <div className="text-white font-mono font-bold text-sm">{primaryColor}</div>
                <div className="text-[10px] text-slate-400">Click to pick custom hex color for buttons & highlights</div>
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              {['#14532D', '#518214', '#2563EB', '#7C3AED', '#DB2777', '#EA580C'].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handleColorChange(preset)}
                  style={{ backgroundColor: preset }}
                  className={`w-7 h-7 rounded-full border-2 transition ${primaryColor === preset ? 'border-white scale-110 shadow-md' : 'border-slate-700 hover:scale-105'}`}
                />
              ))}
            </div>
          </div>

          {/* Theme Mode Switcher (Light / Dark) */}
          <div className="space-y-3">
            <label className="block text-slate-300 font-bold">Appearance Theme (Light & Dark)</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => handleThemeModeChange('light')}
                className={`flex-1 p-3.5 rounded-2xl border flex items-center justify-center gap-2 transition ${
                  themeMode === 'light'
                    ? 'bg-white text-slate-900 border-emerald-500 shadow-md font-bold'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-900'
                }`}
              >
                <Sun className="w-4 h-4 text-amber-500" />
                <span>Light Mode</span>
              </button>
              <button
                type="button"
                onClick={() => handleThemeModeChange('dark')}
                className={`flex-1 p-3.5 rounded-2xl border flex items-center justify-center gap-2 transition ${
                  themeMode === 'dark'
                    ? 'bg-slate-950 text-white border-emerald-500 shadow-md font-bold'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-900'
                }`}
              >
                <Moon className="w-4 h-4 text-sky-400" />
                <span>Dark Mode</span>
              </button>
            </div>
            <div className="text-[10px] text-slate-400">
              Current mode: <span className="text-emerald-400 font-bold uppercase">{themeMode}</span>. Suitable contrast and color matching applied.
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 1: Institution Profile & Branding */}
      <form onSubmit={handleSaveInstitution} className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4 text-xs">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-400" />
              University Identity & Official Credentials
            </h3>
            <p className="text-[11px] text-slate-400">
              Configure institution legal name, NAAC grade, NIRF rank, Chancellor & Registrar names displayed across the app.
            </p>
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 shadow-md shadow-emerald-900/30"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Branding</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-400 font-semibold mb-1">University Name (English)</label>
            <input
              type="text"
              value={instName}
              onChange={(e) => setInstName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">University Name (Tamil / Regional)</label>
            <input
              type="text"
              value={instTamilName}
              onChange={(e) => setInstTamilName(e.target.value)}
              placeholder="காந்திகிராம கிராமிய நிறுவனம்"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-400 font-semibold mb-1">Institutional Motto / Tagline</label>
          <input
            type="text"
            value={instTagline}
            onChange={(e) => setInstTagline(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-slate-400 font-semibold mb-1">NAAC Grade</label>
            <input
              type="text"
              value={instNaac}
              onChange={(e) => setInstNaac(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">NIRF Rank / Band</label>
            <input
              type="text"
              value={instNirf}
              onChange={(e) => setInstNirf(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Vice-Chancellor</label>
            <input
              type="text"
              value={instViceChancellor}
              onChange={(e) => setInstViceChancellor(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Registrar</label>
            <input
              type="text"
              value={instRegistrar}
              onChange={(e) => setInstRegistrar(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Primary Helpdesk Phone</label>
            <input
              type="text"
              value={instPhone}
              onChange={(e) => setInstPhone(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Primary Official Email</label>
            <input
              type="email"
              value={instEmail}
              onChange={(e) => setInstEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Campus Physical Address</label>
            <input
              type="text"
              value={instAddress}
              onChange={(e) => setInstAddress(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </form>

      {/* SECTION 2: Hero Banner & Live Alert Broadcast */}
      <form onSubmit={handleSaveHero} className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4 text-xs">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-amber-400" />
              Homepage Hero Banner & Emergency Ticker Control
            </h3>
            <p className="text-[11px] text-slate-400">
              Customize call-to-action buttons, hero headings, and real-time live alert notice ticker.
            </p>
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold flex items-center gap-1.5 shadow-md shadow-amber-900/30"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Hero Layout</span>
          </button>
        </div>

        <div>
          <label className="block text-slate-400 font-semibold mb-1 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-rose-500" />
            <span>Live Ticker Alert Message (Scrolls in red on top of home screen)</span>
          </label>
          <input
            type="text"
            value={heroLiveNotice}
            onChange={(e) => setHeroLiveNotice(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-rose-300 font-semibold outline-none focus:border-rose-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Badge Text</label>
            <input
              type="text"
              value={heroBadge}
              onChange={(e) => setHeroBadge(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-amber-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-slate-400 font-semibold mb-1">Hero Main Title</label>
            <input
              type="text"
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-400 font-semibold mb-1">Hero Subtitle Paragraph</label>
          <textarea
            value={heroSubtitle}
            onChange={(e) => setHeroSubtitle(e.target.value)}
            rows={2}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-amber-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Primary CTA Label</label>
              <input
                type="text"
                value={heroCtaText}
                onChange={(e) => setHeroCtaText(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-slate-200 outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Primary CTA Target</label>
              <input
                type="text"
                value={heroCtaLink}
                onChange={(e) => setHeroCtaLink(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-slate-200 outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Secondary CTA Label</label>
              <input
                type="text"
                value={heroSecondaryCtaText}
                onChange={(e) => setHeroSecondaryCtaText(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-slate-200 outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Secondary CTA Target</label>
              <input
                type="text"
                value={heroSecondaryCtaLink}
                onChange={(e) => setHeroSecondaryCtaLink(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-slate-200 outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>
      </form>

      {/* SECTION 3: System Modular Feature Flags */}
      <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4 text-xs">
        <div className="border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
            <Sliders className="w-4 h-4 text-sky-400" />
            University Feature Flags & Service Toggles
          </h3>
          <p className="text-[11px] text-slate-400">
            Enable or disable major application features, modules, and third-party integrations instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { key: 'enableAiAssistant', label: 'GRI AI Assistant & RAG Chatbot', desc: 'Floating chat and Gemini reasoning assistance' },
            { key: 'enableSamarthIntegration', label: 'Samarth ERP Portal Gateway', desc: 'Single sign-on to central university ERP' },
            { key: 'enableHostelAllotment', label: 'Online Hostel Application Portal', desc: 'Student mess and room allotment booking' },
            { key: 'enableAlumniDirectory', label: 'Alumni Network & Giving Portal', desc: 'Distinguished alumni profiles and reunions' },
            { key: 'enableGrievanceRedressal', label: 'Student Grievance Redressal (UGC)', desc: 'Official dispute and complaints handling' },
            { key: 'enableFeePayment', label: 'Online Fee Gateway Integration', desc: 'Semester fee and examination dues payments' },
            { key: 'enableDigitalIdCards', label: 'Secure Digital Student ID & QR', desc: 'Campus library and gate access barcodes' },
            { key: 'enableLiveCampusMap', label: 'Interactive Campus GPS & Navigation', desc: 'Buildings, departments and hostel map' },
            { key: 'enableOfflineSync', label: 'Offline Caching & Low-Bandwidth Mode', desc: 'PWA service worker offline caching' },
          ].map(({ key, label, desc }) => {
            const isEnabled = !!(flags as any)[key];
            return (
              <div
                key={key}
                onClick={() => handleToggleFlag(key as any)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-center justify-between gap-3 ${
                  isEnabled ? 'bg-sky-950/40 border-sky-500/50' : 'bg-slate-950 border-slate-800 opacity-60 hover:opacity-80'
                }`}
              >
                <div>
                  <div className="font-bold text-white text-xs">{label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{desc}</div>
                </div>
                <div>
                  {isEnabled ? (
                    <ToggleRight className="w-7 h-7 text-sky-400 flex-shrink-0" />
                  ) : (
                    <ToggleLeft className="w-7 h-7 text-slate-600 flex-shrink-0" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 4: Gemini AI Model & Retrieval Control */}
      <form onSubmit={handleSaveGemini} className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4 text-xs">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
              <Cpu className="w-4 h-4 text-purple-400" />
              Gemini AI Engine & Institutional Grounding Prompt
            </h3>
            <p className="text-[11px] text-slate-400">
              Control the model temperature, system instructions, and confidence threshold for GRI Assistant.
            </p>
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold flex items-center gap-1.5 shadow-md shadow-purple-900/30"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save AI Engine</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Gemini AI Model Engine</label>
            <select
              value={aiModel}
              onChange={(e) => setAiModel(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:border-purple-500"
            >
              <option value="gemini-2.5-flash">Gemini 2.5 Flash (Ultra-fast, Recommended)</option>
              <option value="gemini-2.5-pro">Gemini 2.5 Pro (Deep Multimodal Reasoning)</option>
              <option value="gemini-1.5-flash">Gemini 1.5 Flash (Standard)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">
              Creativity / Temperature ({aiTemperature})
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={aiTemperature}
              onChange={(e) => setAiTemperature(Number(e.target.value))}
              className="w-full accent-purple-500 mt-2 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>0.0 (Strict Factual)</span>
              <span>1.0 (Creative)</span>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">
              Grounding Threshold ({aiGroundingThreshold})
            </label>
            <input
              type="range"
              min="0.5"
              max="0.95"
              step="0.05"
              value={aiGroundingThreshold}
              onChange={(e) => setAiGroundingThreshold(Number(e.target.value))}
              className="w-full accent-purple-500 mt-2 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>0.5 (Relaxed)</span>
              <span>0.95 (High Precision)</span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-slate-400 font-semibold mb-1">
            Institutional Master System Prompt (Defines Bot Persona & Factual Grounding)
          </label>
          <textarea
            value={aiSystemInstruction}
            onChange={(e) => setAiSystemInstruction(e.target.value)}
            rows={5}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 font-mono outline-none focus:border-purple-500"
          />
        </div>
      </form>
    </div>
  );
};
