import React, { useEffect } from 'react';
import { useAppStore } from './core/store/appStore';
import { initializeFirestoreData } from './core/firebase';
import { runServerDiagnostics } from './utils/serverDiagnostics';
import { getInstitutionalDataWithCache } from './core/services/institutionalData';
import { AppHeader } from './components/web/AppHeader';
import { BottomNavigation } from './components/web/BottomNavigation';
import { QuickSearchModal } from './components/web/QuickSearchModal';
import { DepartmentModal } from './components/web/DepartmentModal';
import { HomeView } from './components/web/HomeView';
import { ExploreView } from './components/web/ExploreView';
import { ServicesView } from './components/web/ServicesView';
import { AlertsView } from './components/web/AlertsView';
import { AiChatView } from './components/web/AiChatView';
import { AdminView } from './components/web/AdminView';
import { ProfileView } from './components/web/ProfileView';
import { ChangePasswordModal } from './components/common/ChangePasswordModal';
import { InstitutionalLoginModal } from './components/auth/InstitutionalLoginModal';
import { AccessRestricted } from './components/common/AccessRestricted';
import { motion, AnimatePresence } from 'motion/react';
import { usePermissions } from './core/auth/usePermissions';

export const App: React.FC = () => {
  const { 
    currentTab, 
    selectedDepartment, 
    setSelectedDepartment, 
    setTab, 
    initializeRealtimeSync,
    isLoginModalOpen,
    setLoginModalOpen,
    isAuthenticated
  } = useAppStore();

  const { can } = usePermissions();

  useEffect(() => {
    initializeFirestoreData();
    runServerDiagnostics();
    getInstitutionalDataWithCache().catch(() => {});
    const savedColor = localStorage.getItem('gri_primary_color');
    if (savedColor) {
      document.documentElement.style.setProperty('--primary', savedColor);
    }
    const savedTheme = localStorage.getItem('gri_theme_mode');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    }
    const unsubscribe = initializeRealtimeSync();
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center font-sans">
      <div className="w-full max-w-md bg-white min-h-screen shadow-2xl flex flex-col relative overflow-hidden">
        
        <AppHeader />

        <main className="flex-1 overflow-y-auto pb-20 scrollbar-hide bg-white overflow-x-hidden relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="min-h-full"
            >
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
                  <div className="p-5">
                    <AccessRestricted
                      title={!isAuthenticated ? "Authentication Required" : "Access Denied"}
                      message={!isAuthenticated 
                        ? "Please sign in to access." 
                        : "Your role does not have permission."}
                      resourceName="Admin Dashboard"
                      primaryActionText={!isAuthenticated ? "Sign In" : "Home"}
                      onPrimaryAction={() => !isAuthenticated ? setLoginModalOpen(true) : setTab('home')}
                    />
                  </div>
                )
              )}
              {currentTab === 'profile' && (
                can('tab.profile.view') ? (
                  <ProfileView />
                ) : (
                  <div className="p-5">
                    <AccessRestricted
                      title={!isAuthenticated ? "Authentication Required" : "Access Denied"}
                      message={!isAuthenticated 
                        ? "Please sign in to view your profile." 
                        : "Access denied."}
                      resourceName="User Profile"
                      primaryActionText={!isAuthenticated ? "Sign In" : "Home"}
                      onPrimaryAction={() => !isAuthenticated ? setLoginModalOpen(true) : setTab('home')}
                    />
                  </div>
                )
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        <BottomNavigation />

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
      </div>
    </div>
  );
};
