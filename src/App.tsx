import React, { useEffect } from 'react';
import { useAppStore } from './core/store/appStore';
import { initializeFirestoreData } from './core/firebase';
import { Navbar } from './components/web/Navbar';
import { QuickSearchModal } from './components/web/QuickSearchModal';
import { DepartmentModal } from './components/web/DepartmentModal';
import { HomeView } from './components/web/HomeView';
import { ExploreView } from './components/web/ExploreView';
import { ServicesView } from './components/web/ServicesView';
import { AlertsView } from './components/web/AlertsView';
import { AiChatView } from './components/web/AiChatView';
import { AdminView } from './components/web/AdminView';
import { ProfileView } from './components/web/ProfileView';
import { MobileSimulator } from './components/web/MobileSimulator';
import { ChangePasswordModal } from './components/common/ChangePasswordModal';
import { InstitutionalLoginModal } from './components/auth/InstitutionalLoginModal';
import { AccessRestricted } from './components/common/AccessRestricted';
import { usePermissions } from './core/auth/usePermissions';
import { INSTITUTION_INFO } from './core/data/griMasterData';
import { 
  GraduationCap, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Award, 
  Heart,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export const App: React.FC = () => {
  const { 
    currentTab, 
    viewMode, 
    selectedDepartment, 
    setSelectedDepartment, 
    setTab, 
    initializeRealtimeSync,
    isLoginModalOpen,
    setLoginModalOpen,
    isAuthenticated,
    currentUser
  } = useAppStore();

  const { can } = usePermissions();

  useEffect(() => {
    // Seed initial collections in Firestore if needed
    initializeFirestoreData();
    // Subscribe to live Firestore changes across devices
    const unsubscribe = initializeRealtimeSync();
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Main Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {viewMode === 'mobile_sim' ? (
          <MobileSimulator />
        ) : (
          <>
            {currentTab === 'home' && <HomeView />}
            {currentTab === 'explore' && <ExploreView />}
            {currentTab === 'services' && <ServicesView />}
            {currentTab === 'alerts' && <AlertsView />}
            {currentTab === 'ai_chat' && <AiChatView />}
            
            {/* Protected Routes */}
            {currentTab === 'admin' && (
              can('tab.admin.view') ? (
                <AdminView />
              ) : (
                <AccessRestricted
                  title={!isAuthenticated ? "Authentication Required" : "Access Denied"}
                  message={!isAuthenticated 
                    ? "You must be signed in with your institutional credentials to access the Administration Control Center." 
                    : "Your current role does not have permission to view the Administration Control Center."}
                  resourceName="Admin Dashboard"
                  primaryActionText={!isAuthenticated ? "Sign In" : "Return to Home"}
                  onPrimaryAction={() => !isAuthenticated ? setLoginModalOpen(true) : setTab('home')}
                  secondaryActionText="Return to Home"
                  onSecondaryAction={() => setTab('home')}
                />
              )
            )}
            {currentTab === 'profile' && (
              can('tab.profile.view') ? (
                <ProfileView />
              ) : (
                <AccessRestricted
                  title={!isAuthenticated ? "Authentication Required" : "Access Denied"}
                  message={!isAuthenticated 
                    ? "You must be signed in with your institutional credentials to access your personal profile and account settings." 
                    : "Your current role does not have permission to view the profile section."}
                  resourceName="User Profile"
                  primaryActionText={!isAuthenticated ? "Sign In" : "Return to Home"}
                  onPrimaryAction={() => !isAuthenticated ? setLoginModalOpen(true) : setTab('home')}
                  secondaryActionText="Return to Home"
                  onSecondaryAction={() => setTab('home')}
                />
              )
            )}
          </>
        )}
      </main>

      {/* Global Modals */}
      <QuickSearchModal />
      <DepartmentModal
        department={selectedDepartment}
        onClose={() => setSelectedDepartment(null)}
      />
      <ChangePasswordModal />
      <InstitutionalLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />

      {/* Institutional Enterprise Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* University Bio */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h3 className="font-display font-bold text-white text-sm">
                  The Gandhigram Rural Institute
                </h3>
              </div>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                {INSTITUTION_INFO.subName} • {INSTITUTION_INFO.accreditation}. Founded in 1956 by Dr. T.S. Soundram and Dr. G. Ramachandran under the guidance of Mahatma Gandhi.
              </p>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-950/80 border border-emerald-800 text-emerald-400 text-[10px] font-semibold">
                <Award className="w-3 h-3" />
                <span>NAAC 'A++' Grade (CGPA: 3.61)</span>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-3">
              <h4 className="font-bold uppercase tracking-wider text-slate-200 text-xs">
                Academic & Admissions
              </h4>
              <ul className="space-y-1.5 text-[11px]">
                <li>
                  <button onClick={() => setTab('services')} className="hover:text-emerald-400 transition">
                    Admissions 2026-27 (Samarth Portal)
                  </button>
                </li>
                <li>
                  <button onClick={() => setTab('explore')} className="hover:text-emerald-400 transition">
                    Schools of Study & 28+ Departments
                  </button>
                </li>
                <li>
                  <button onClick={() => setTab('services')} className="hover:text-emerald-400 transition">
                    End Semester Examination (ESE) Schedule
                  </button>
                </li>
                <li>
                  <button onClick={() => setTab('services')} className="hover:text-emerald-400 transition">
                    e-Sanad Verification & Transcripts
                  </button>
                </li>
                <li>
                  <button onClick={() => setTab('services')} className="hover:text-emerald-400 transition">
                    Dr. Radhakrishnan Central Library OPAC
                  </button>
                </li>
              </ul>
            </div>

            {/* Gandhian Pillars */}
            <div className="space-y-3">
              <h4 className="font-bold uppercase tracking-wider text-slate-200 text-xs">
                Gandhian Outreach
              </h4>
              <ul className="space-y-1.5 text-[11px]">
                <li>
                  <span className="text-slate-300 font-medium">Shanti Sena (Peace Brigade)</span>
                </li>
                <li>
                  <span className="text-slate-300 font-medium">Nai Talim (Work-Based Learning)</span>
                </li>
                <li>
                  <span className="text-slate-300 font-medium">Unnat Bharat Abhiyan (UBA Regional Cell)</span>
                </li>
                <li>
                  <span className="text-slate-300 font-medium">Krishi Vigyan Kendra (ICAR-KVK)</span>
                </li>
                <li>
                  <span className="text-slate-300 font-medium">Village Field Placement Scheme</span>
                </li>
              </ul>
            </div>

            {/* Contact Information */}
            <div className="space-y-3">
              <h4 className="font-bold uppercase tracking-wider text-slate-200 text-xs">
                University Campus
              </h4>
              <div className="space-y-2 text-[11px]">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>{INSTITUTION_INFO.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{INSTITUTION_INFO.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{INSTITUTION_INFO.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <a href={INSTITUTION_INFO.website} target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">
                    {INSTITUTION_INFO.website}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom copyright */}
          <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
            <div>
              © 2026 The Gandhigram Rural Institute (Deemed to be University). All rights reserved.
            </div>
            <div className="flex items-center space-x-4 text-slate-400">
              <span>Anti-Ragging Helpline: 1800-180-5522</span>
              <span>•</span>
              <span>Grievance Cell: samadhan@ruraluniv.ac.in</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
