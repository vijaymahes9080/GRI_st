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
    <div className="min-h-screen bg-[#FDFDFB] text-[#1A1F1D] flex flex-col font-sans selection:bg-[#E5F0EB] selection:text-[#0F4C3A]">
      {/* Top Main Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
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
      <footer className="bg-[#0F4C3A] text-white/80 text-xs mt-auto rounded-t-[2.5rem] mt-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            {/* University Bio */}
            <div className="space-y-4 pr-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white font-bold backdrop-blur-md">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-white text-base leading-tight">
                  The Gandhigram<br/>Rural Institute
                </h3>
              </div>
              <p className="text-white/60 leading-relaxed text-xs">
                {INSTITUTION_INFO.subName} • {INSTITUTION_INFO.accreditation}. Founded in 1956 by Dr. T.S. Soundram and Dr. G. Ramachandran under the guidance of Mahatma Gandhi.
              </p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E5F0EB]/10 border border-[#E5F0EB]/20 text-[#E5F0EB] text-[10px] font-semibold tracking-wide uppercase">
                <Award className="w-3.5 h-3.5" />
                <span>NAAC 'A++' Grade (CGPA: 3.61)</span>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="font-bold uppercase tracking-wider text-white text-xs opacity-90">
                Academic & Admissions
              </h4>
              <ul className="space-y-2.5 text-xs opacity-70 font-medium">
                <li>
                  <button onClick={() => setTab('services')} className="hover:text-white transition">
                    Admissions 2026-27 (Samarth Portal)
                  </button>
                </li>
                <li>
                  <button onClick={() => setTab('explore')} className="hover:text-white transition">
                    Schools of Study & 28+ Departments
                  </button>
                </li>
                <li>
                  <button onClick={() => setTab('services')} className="hover:text-white transition">
                    End Semester Examination (ESE) Schedule
                  </button>
                </li>
                <li>
                  <button onClick={() => setTab('services')} className="hover:text-white transition">
                    e-Sanad Verification & Transcripts
                  </button>
                </li>
                <li>
                  <button onClick={() => setTab('services')} className="hover:text-white transition">
                    Dr. Radhakrishnan Central Library OPAC
                  </button>
                </li>
              </ul>
            </div>

            {/* Gandhian Pillars */}
            <div className="space-y-4">
              <h4 className="font-bold uppercase tracking-wider text-white text-xs opacity-90">
                Gandhian Outreach
              </h4>
              <ul className="space-y-2.5 text-xs opacity-70 font-medium">
                <li>
                  <span className="hover:text-white cursor-pointer transition">Shanti Sena (Peace Brigade)</span>
                </li>
                <li>
                  <span className="hover:text-white cursor-pointer transition">Nai Talim (Work-Based Learning)</span>
                </li>
                <li>
                  <span className="hover:text-white cursor-pointer transition">Unnat Bharat Abhiyan (UBA Regional Cell)</span>
                </li>
                <li>
                  <span className="hover:text-white cursor-pointer transition">Krishi Vigyan Kendra (ICAR-KVK)</span>
                </li>
                <li>
                  <span className="hover:text-white cursor-pointer transition">Village Field Placement Scheme</span>
                </li>
              </ul>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h4 className="font-bold uppercase tracking-wider text-white text-xs opacity-90">
                University Campus
              </h4>
              <div className="space-y-3 text-xs opacity-70 font-medium">
                <div className="flex items-start gap-2.5 group cursor-pointer hover:text-white transition">
                  <MapPin className="w-4 h-4 mt-0.5 opacity-80" />
                  <span className="leading-relaxed">{INSTITUTION_INFO.location}</span>
                </div>
                <div className="flex items-center gap-2.5 group cursor-pointer hover:text-white transition">
                  <Phone className="w-4 h-4 opacity-80" />
                  <span>{INSTITUTION_INFO.phone}</span>
                </div>
                <div className="flex items-center gap-2.5 group cursor-pointer hover:text-white transition">
                  <Mail className="w-4 h-4 opacity-80" />
                  <span>{INSTITUTION_INFO.email}</span>
                </div>
                <div className="flex items-center gap-2.5 group cursor-pointer hover:text-white transition">
                  <Globe className="w-4 h-4 opacity-80" />
                  <a href={INSTITUTION_INFO.website} target="_blank" rel="noreferrer">
                    {INSTITUTION_INFO.website}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom copyright */}
          <div className="mt-16 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] opacity-60 font-medium">
            <div>
              © 2026 The Gandhigram Rural Institute (Deemed to be University). All rights reserved.
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <span>Anti-Ragging Helpline: 1800-180-5522</span>
              <span className="hidden sm:inline">•</span>
              <span>Grievance Cell: samadhan@ruraluniv.ac.in</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
