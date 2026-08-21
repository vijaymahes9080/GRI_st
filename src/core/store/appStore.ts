import { create } from 'zustand';
import { 
  UserProfile, 
  CircularItem, 
  GrievanceTicket, 
  DepartmentInfo, 
  MultiChannelMessage, 
  UserRole,
  SchoolInfo,
  EventItem,
  PlacementItem,
  ResearchItem,
  DocumentItem,
  FaqItem,
  QuickLinkItem,
  DynamicPage,
  HeroBannerConfig,
  InstitutionProfile,
  FeatureFlags,
  AiKnowledgeSource,
  AiSettingsConfig,
  AuditLogEntry,
  FacultyMember,
  ProgrammeItem
} from '../../types';
import { 
  INITIAL_CIRCULARS, 
  SAMPLE_USERS, 
  INITIAL_DISPATCHED_MESSAGES, 
  DEFAULT_GENERAL_PASSWORD,
  SCHOOLS_DATA,
  INSTITUTION_INFO,
  DEFAULT_HERO_CONFIG,
  DEFAULT_FEATURE_FLAGS,
  DEFAULT_AI_SETTINGS,
  INITIAL_AI_KNOWLEDGE_SOURCES,
  INITIAL_EVENTS,
  INITIAL_PLACEMENTS,
  INITIAL_RESEARCH_PROJECTS,
  INITIAL_DOCUMENTS,
  INITIAL_FAQS,
  INITIAL_QUICK_LINKS,
  INITIAL_DYNAMIC_PAGES,
  INITIAL_AUDIT_LOGS
} from '../data/griMasterData';
import {
  subscribeToCirculars,
  subscribeToUsers,
  subscribeToGrievances,
  subscribeToDispatchedMessages,
  subscribeToSchools,
  subscribeToEvents,
  subscribeToPlacements,
  subscribeToResearchProjects,
  subscribeToDocuments,
  subscribeToFaqs,
  subscribeToQuickLinks,
  subscribeToDynamicPages,
  subscribeToAiKnowledgeSources,
  subscribeToAuditLogs,
  subscribeToSystemConfig,
  addCircularToFirestore,
  updateCircularInFirestore,
  deleteCircularFromFirestore,
  saveSchoolToFirestore,
  deleteSchoolFromFirestore,
  saveEntityToFirestore,
  deleteEntityFromFirestore,
  saveSystemConfigDoc,
  addAuditLogToFirestore,
  updateGrievanceStatusInFirestore,
  saveUserProfile,
  batchInsertUsersToFirestore,
  updateUserApprovalStatus,
  deleteUserFromFirestore,
  bulkUpdateUsersStatusInFirestore,
  bulkDeleteUsersFromFirestore,
  addGrievanceToFirestore,
  addDispatchedMessageToFirestore,
  signInWithGoogle,
  signOutUser,
  auth,
  EVENTS_COLLECTION,
  PLACEMENTS_COLLECTION,
  RESEARCH_COLLECTION,
  DOCUMENTS_COLLECTION,
  FAQS_COLLECTION,
  QUICK_LINKS_COLLECTION,
  DYNAMIC_PAGES_COLLECTION,
  AI_KNOWLEDGE_COLLECTION
} from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

export type AppTab = 'home' | 'explore' | 'services' | 'alerts' | 'ai_chat' | 'admin' | 'profile';

interface AppState {
  currentTab: AppTab;
  setTab: (tab: AppTab) => void;
  
  viewMode: 'desktop' | 'mobile_sim';
  toggleViewMode: () => void;
  
  // Real-time Database status
  isFirestoreLive: boolean;
  setFirestoreLive: (live: boolean) => void;

  // Auth state & Firebase Auth
  currentUser: UserProfile;
  isAuthenticated: boolean;
  usersList: UserProfile[];
  loginAsUser: (user: UserProfile) => void;
  loginWithGoogleAuth: () => Promise<void>;
  logout: () => void;
  
  // User & Approval Management
  updateUserApproval: (userId: string, status: 'approved' | 'rejected' | 'suspended') => Promise<void>;
  approveUserWithNotifications: (userId: string, customTempPass?: string) => Promise<void>;
  bulkUpdateUserApproval: (userIds: string[], status: 'approved' | 'rejected' | 'suspended') => Promise<void>;
  bulkApproveUsersWithNotifications: (userIds: string[]) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  bulkDeleteUsers: (userIds: string[]) => Promise<void>;
  registerPendingUser: (user: Omit<UserProfile, 'id' | 'approvalStatus'>) => Promise<void>;
  addNewUserByAdmin: (userData: Partial<UserProfile> & { name: string; email: string; role: UserRole; department: string }) => Promise<void>;
  bulkImportUsers: (payload: { users: any[]; autoApprove?: boolean; defaultPassword?: string }) => Promise<{ success: boolean; totalRecords: number; validCount: number; errorCount: number; errors: any[]; importedUsers: UserProfile[] }>;
  updateUserRole: (userId: string, newRole: UserRole) => Promise<void>;
  updateUserContactChannels: (userId: string, data: { phone: string; email: string; alternateEmail?: string; smsAlertsEnabled?: boolean; whatsappAlertsEnabled?: boolean; emailCircularsEnabled?: boolean }) => Promise<void>;
  sendTestChannelVerification: (userId: string, channel: 'SMS' | 'WHATSAPP' | 'EMAIL', targetValue?: string) => Promise<void>;
  
  // Password & Security Lifecycle
  isPasswordChangeModalOpen: boolean;
  setPasswordChangeModalOpen: (open: boolean) => void;
  changeUserPassword: (newPassword: string) => Promise<void>;
  resetUserPasswordByAdmin: (userId: string, customTempPass?: string) => Promise<void>;
  resendApprovalMessages: (userId: string) => Promise<void>;

  // Multi-Channel Notifications (SMS, WhatsApp, Email, In-App)
  dispatchedMessages: MultiChannelMessage[];
  addDispatchedMessage: (message: Omit<MultiChannelMessage, 'id'>) => Promise<void>;

  // Circulars & Notices Management
  circulars: CircularItem[];
  addCircular: (circular: Omit<CircularItem, 'id'>) => Promise<void>;
  updateCircular: (id: string, updates: Partial<CircularItem>) => Promise<void>;
  deleteCircular: (id: string) => Promise<void>;
  bookmarkedIds: string[];
  toggleBookmark: (id: string) => void;

  // Schools & Departments Management
  schools: SchoolInfo[];
  saveSchool: (school: SchoolInfo) => Promise<void>;
  deleteSchool: (schoolId: string) => Promise<void>;
  saveDepartment: (schoolId: string, dept: DepartmentInfo) => Promise<void>;
  deleteDepartment: (schoolId: string, deptId: string) => Promise<void>;
  saveFacultyMember: (schoolId: string, deptId: string, faculty: FacultyMember) => Promise<void>;
  deleteFacultyMember: (schoolId: string, deptId: string, facultyId: string) => Promise<void>;
  saveProgramme: (schoolId: string, deptId: string, programme: ProgrammeItem) => Promise<void>;
  deleteProgramme: (schoolId: string, deptId: string, progCode: string) => Promise<void>;

  // Events Management
  events: EventItem[];
  saveEvent: (event: EventItem) => Promise<void>;
  deleteEvent: (eventId: string) => Promise<void>;

  // Placements Management
  placements: PlacementItem[];
  savePlacement: (placement: PlacementItem) => Promise<void>;
  deletePlacement: (placementId: string) => Promise<void>;

  // Research Projects Management
  researchProjects: ResearchItem[];
  saveResearchProject: (project: ResearchItem) => Promise<void>;
  deleteResearchProject: (projectId: string) => Promise<void>;

  // Documents & Regulations Management
  documents: DocumentItem[];
  saveDocument: (docItem: DocumentItem) => Promise<void>;
  deleteDocument: (docId: string) => Promise<void>;

  // FAQs Management
  faqs: FaqItem[];
  saveFaq: (faq: FaqItem) => Promise<void>;
  deleteFaq: (faqId: string) => Promise<void>;

  // Quick Links Management
  quickLinks: QuickLinkItem[];
  saveQuickLink: (link: QuickLinkItem) => Promise<void>;
  deleteQuickLink: (linkId: string) => Promise<void>;

  // Dynamic CMS Pages Management
  dynamicPages: DynamicPage[];
  saveDynamicPage: (page: DynamicPage) => Promise<void>;
  deleteDynamicPage: (pageId: string) => Promise<void>;

  // AI Knowledge Sources Management
  aiKnowledgeSources: AiKnowledgeSource[];
  saveAiKnowledgeSource: (source: AiKnowledgeSource) => Promise<void>;
  deleteAiKnowledgeSource: (sourceId: string) => Promise<void>;

  // Institution Profile & System Configuration
  institutionProfile: InstitutionProfile;
  saveInstitutionProfile: (profile: Partial<InstitutionProfile>) => Promise<void>;

  heroConfig: HeroBannerConfig;
  saveHeroConfig: (config: Partial<HeroBannerConfig>) => Promise<void>;

  featureFlags: FeatureFlags;
  saveFeatureFlags: (flags: Partial<FeatureFlags>) => Promise<void>;

  aiSettings: AiSettingsConfig;
  saveAiSettings: (settings: Partial<AiSettingsConfig>) => Promise<void>;

  // Audit Logs
  auditLogs: AuditLogEntry[];
  logAdminAction: (action: 'CREATE' | 'UPDATE' | 'DELETE' | 'PUBLISH' | 'UNPUBLISH' | 'APPROVE' | 'REJECT', resourceType: string, resourceId: string, resourceTitle: string, details?: string) => Promise<void>;

  // Selected Department for deep view
  selectedDepartment: DepartmentInfo | null;
  setSelectedDepartment: (dept: DepartmentInfo | null) => void;

  // Global Search modal
  isSearchOpen: boolean;
  setSearchOpen: (open: boolean) => void;

  // Grievance tickets
  grievances: GrievanceTicket[];
  addGrievance: (ticket: Omit<GrievanceTicket, 'id' | 'submittedAt' | 'status'>) => Promise<void>;
  updateGrievanceStatus: (id: string, status: 'PENDING' | 'UNDER_REVIEW' | 'RESOLVED', response?: string) => Promise<void>;

  // Initialize Real-time Subscriptions
  initializeRealtimeSync: () => () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  currentTab: 'home',
  setTab: (tab) => set({ currentTab: tab }),

  viewMode: 'desktop',
  toggleViewMode: () => set((state) => ({ viewMode: state.viewMode === 'desktop' ? 'mobile_sim' : 'desktop' })),

  isFirestoreLive: false,
  setFirestoreLive: (live) => set({ isFirestoreLive: live }),

  currentUser: SAMPLE_USERS[0], // Default student
  isAuthenticated: true,
  usersList: SAMPLE_USERS,

  isPasswordChangeModalOpen: false,
  setPasswordChangeModalOpen: (open) => set({ isPasswordChangeModalOpen: open }),

  dispatchedMessages: INITIAL_DISPATCHED_MESSAGES,
  schools: SCHOOLS_DATA,
  events: INITIAL_EVENTS,
  placements: INITIAL_PLACEMENTS,
  researchProjects: INITIAL_RESEARCH_PROJECTS,
  documents: INITIAL_DOCUMENTS,
  faqs: INITIAL_FAQS,
  quickLinks: INITIAL_QUICK_LINKS,
  dynamicPages: INITIAL_DYNAMIC_PAGES,
  aiKnowledgeSources: INITIAL_AI_KNOWLEDGE_SOURCES,
  auditLogs: INITIAL_AUDIT_LOGS,
  institutionProfile: INSTITUTION_INFO,
  heroConfig: DEFAULT_HERO_CONFIG,
  featureFlags: DEFAULT_FEATURE_FLAGS,
  aiSettings: DEFAULT_AI_SETTINGS,

  loginAsUser: (user) => {
    set({ currentUser: user, isAuthenticated: true });
    if (user.approvalStatus === 'approved' && user.mustChangePasswordOnLogin) {
      set({ isPasswordChangeModalOpen: true });
    }
    saveUserProfile(user).catch((e) => console.warn('User profile sync to firestore:', e));
  },

  loginWithGoogleAuth: async () => {
    try {
      const profile = await signInWithGoogle();
      set({ currentUser: profile, isAuthenticated: true });
    } catch (error) {
      console.error('Google Sign-In Failed:', error);
      throw error;
    }
  },

  logout: () => {
    signOutUser().catch(() => {});
    set({ 
      isAuthenticated: false, 
      currentUser: { ...SAMPLE_USERS[0], role: 'guest' as any, name: 'Guest Visitor', email: 'guest@ruraluniv.ac.in' },
      isPasswordChangeModalOpen: false,
    });
  },

  // Audit Logger Helper
  logAdminAction: async (action, resourceType, resourceId, resourceTitle, details) => {
    const admin = get().currentUser;
    const entry: Omit<AuditLogEntry, 'id' | 'timestamp'> = {
      adminEmail: admin.email || 'admin@ruraluniv.ac.in',
      adminName: admin.name || 'Admin',
      action,
      resourceType,
      resourceId,
      resourceTitle,
      details: details || `${action} on ${resourceType}: ${resourceTitle}`,
    };

    const newLog: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...entry,
    };

    set((state) => ({
      auditLogs: [newLog, ...state.auditLogs],
    }));

    await addAuditLogToFirestore(entry);
  },

  updateUserApproval: async (userId, status) => {
    if (status === 'approved') {
      await get().approveUserWithNotifications(userId);
      return;
    }

    set((state) => ({
      usersList: state.usersList.map((u) => (u.id === userId ? { ...u, approvalStatus: status } : u)),
      currentUser: state.currentUser.id === userId ? { ...state.currentUser, approvalStatus: status } : state.currentUser,
    }));

    try {
      await updateUserApprovalStatus(userId, status);
      await get().logAdminAction(status === 'rejected' ? 'REJECT' : 'UPDATE', 'USER', userId, `User Status: ${status}`);
    } catch (error) {
      console.warn('[Firestore] Update user approval error:', error);
    }
  },

  approveUserWithNotifications: async (userId, customTempPass) => {
    const targetUser = get().usersList.find((u) => u.id === userId);
    if (!targetUser) return;

    const tempPassword = customTempPass || targetUser.tempPassword || DEFAULT_GENERAL_PASSWORD;
    const nowISO = new Date().toISOString();

    const updatedUser: UserProfile = {
      ...targetUser,
      approvalStatus: 'approved',
      mustChangePasswordOnLogin: true,
      passwordStatus: 'default_temp',
      tempPassword,
      approvedAt: nowISO,
      approvedBy: get().currentUser.name || 'GRI Central Administration',
    };

    set((state) => ({
      usersList: state.usersList.map((u) => (u.id === userId ? updatedUser : u)),
      currentUser: state.currentUser.id === userId ? updatedUser : state.currentUser,
    }));

    try {
      const response = await fetch('/api/v1/notifications/dispatch-approval', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: updatedUser,
          defaultPassword: tempPassword,
          approvedBy: get().currentUser.name,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.messages && Array.isArray(data.messages)) {
          for (const msg of data.messages) {
            await addDispatchedMessageToFirestore(msg).catch(() => {});
          }
          set((state) => ({
            dispatchedMessages: [...data.messages, ...state.dispatchedMessages],
          }));
        }
      }
    } catch (apiErr) {
      console.warn('[API Warning] Notification endpoint dispatch failed:', apiErr);
    }

    try {
      await saveUserProfile(updatedUser);
      await get().logAdminAction('APPROVE', 'USER', updatedUser.id, updatedUser.name, `Approved user account and dispatched credentials.`);
    } catch (dbErr) {
      console.warn('[Firestore] Save approved user error:', dbErr);
    }
  },

  bulkUpdateUserApproval: async (userIds, status) => {
    if (status === 'approved') {
      await get().bulkApproveUsersWithNotifications(userIds);
      return;
    }

    const idSet = new Set(userIds);
    set((state) => ({
      usersList: state.usersList.map((u) => (idSet.has(u.id) ? { ...u, approvalStatus: status } : u)),
      currentUser: idSet.has(state.currentUser.id) ? { ...state.currentUser, approvalStatus: status } : state.currentUser,
    }));

    try {
      await bulkUpdateUsersStatusInFirestore(userIds, status);
      await get().logAdminAction('UPDATE', 'USER_BULK', `${userIds.length} users`, `Bulk set status to ${status}`);
    } catch (error) {
      console.warn('[Firestore] Bulk update users error:', error);
    }
  },

  bulkApproveUsersWithNotifications: async (userIds) => {
    for (const id of userIds) {
      await get().approveUserWithNotifications(id);
    }
  },

  changeUserPassword: async (newPassword) => {
    const user = get().currentUser;
    if (!user || !user.id) return;

    const nowISO = new Date().toISOString();
    const updatedUser: UserProfile = {
      ...user,
      passwordStatus: 'user_defined',
      mustChangePasswordOnLogin: false,
      passwordUpdatedAt: nowISO,
      tempPassword: undefined,
    };

    set((state) => ({
      currentUser: updatedUser,
      usersList: state.usersList.map((u) => (u.id === user.id ? updatedUser : u)),
      isPasswordChangeModalOpen: false,
    }));

    try {
      const response = await fetch('/api/v1/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          newPassword,
          user: updatedUser,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.confirmationMessages && Array.isArray(data.confirmationMessages)) {
          for (const msg of data.confirmationMessages) {
            await addDispatchedMessageToFirestore(msg).catch(() => {});
          }
          set((state) => ({
            dispatchedMessages: [...data.confirmationMessages, ...state.dispatchedMessages],
          }));
        }
      }
    } catch (apiErr) {
      console.warn('[API Warning] Password change notification failed:', apiErr);
    }

    try {
      await saveUserProfile(updatedUser);
    } catch (dbErr) {
      console.warn('[Firestore] Save user after password change error:', dbErr);
    }
  },

  resetUserPasswordByAdmin: async (userId, customTempPass) => {
    const targetUser = get().usersList.find((u) => u.id === userId);
    if (!targetUser) return;

    const tempPassword = customTempPass || DEFAULT_GENERAL_PASSWORD;
    const updatedUser: UserProfile = {
      ...targetUser,
      passwordStatus: 'default_temp',
      mustChangePasswordOnLogin: true,
      tempPassword,
    };

    set((state) => ({
      usersList: state.usersList.map((u) => (u.id === userId ? updatedUser : u)),
      currentUser: state.currentUser.id === userId ? updatedUser : state.currentUser,
    }));

    try {
      const response = await fetch('/api/v1/users/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: updatedUser,
          defaultPassword: tempPassword,
          adminName: get().currentUser.name,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.resetMessages && Array.isArray(data.resetMessages)) {
          for (const msg of data.resetMessages) {
            await addDispatchedMessageToFirestore(msg).catch(() => {});
          }
          set((state) => ({
            dispatchedMessages: [...data.resetMessages, ...state.dispatchedMessages],
          }));
        }
      }
    } catch (e) {
      console.warn('[API] Reset password notification error:', e);
    }

    try {
      await saveUserProfile(updatedUser);
      await get().logAdminAction('UPDATE', 'USER_SECURITY', targetUser.id, targetUser.name, 'Admin reset user password and re-sent credentials.');
    } catch (e) {
      console.warn('[Firestore] Reset password user update error:', e);
    }
  },

  resendApprovalMessages: async (userId) => {
    const targetUser = get().usersList.find((u) => u.id === userId);
    if (!targetUser) return;
    await get().approveUserWithNotifications(userId, targetUser.tempPassword || DEFAULT_GENERAL_PASSWORD);
  },

  updateUserRole: async (userId, newRole) => {
    const targetUser = get().usersList.find((u) => u.id === userId);
    if (!targetUser) return;

    const updatedUser: UserProfile = {
      ...targetUser,
      role: newRole,
    };

    set((state) => ({
      usersList: state.usersList.map((u) => (u.id === userId ? updatedUser : u)),
      currentUser: state.currentUser.id === userId ? updatedUser : state.currentUser,
    }));

    try {
      await saveUserProfile(updatedUser);
      await get().logAdminAction('UPDATE', 'USER_ROLE', targetUser.id, targetUser.name, `Changed role to ${newRole}`);
    } catch (e) {
      console.warn('[Firestore] Update user role error:', e);
    }
  },

  updateUserContactChannels: async (userId, data) => {
    const targetUser = get().usersList.find((u) => u.id === userId) || (get().currentUser.id === userId ? get().currentUser : null);
    if (!targetUser) return;

    const updatedUser: UserProfile = {
      ...targetUser,
      phone: data.phone,
      email: data.email,
      alternateEmail: data.alternateEmail || undefined,
      phoneVerified: true,
      emailVerified: true,
      smsAlertsEnabled: data.smsAlertsEnabled !== false,
      whatsappAlertsEnabled: data.whatsappAlertsEnabled !== false,
      emailCircularsEnabled: data.emailCircularsEnabled !== false,
    };

    set((state) => ({
      usersList: state.usersList.map((u) => (u.id === userId ? updatedUser : u)),
      currentUser: state.currentUser.id === userId ? updatedUser : state.currentUser,
    }));

    try {
      const response = await fetch('/api/v1/users/register-contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          userName: updatedUser.name,
          phone: data.phone,
          email: data.email,
          alternateEmail: data.alternateEmail,
          smsAlertsEnabled: data.smsAlertsEnabled,
          whatsappAlertsEnabled: data.whatsappAlertsEnabled,
          emailCircularsEnabled: data.emailCircularsEnabled,
        }),
      });

      if (response.ok) {
        const resData = await response.json();
        if (resData.confirmationMessages && Array.isArray(resData.confirmationMessages)) {
          for (const msg of resData.confirmationMessages) {
            await addDispatchedMessageToFirestore(msg).catch(() => {});
          }
          set((state) => ({
            dispatchedMessages: [...resData.confirmationMessages, ...state.dispatchedMessages],
          }));
        }
      }
    } catch (err) {
      console.warn('[API Warning] Contact registration dispatch failed:', err);
    }

    try {
      await saveUserProfile(updatedUser);
    } catch (e) {
      console.warn('[Firestore] Update user contacts error:', e);
    }
  },

  sendTestChannelVerification: async (userId, channel, targetValue) => {
    const user = get().usersList.find((u) => u.id === userId) || get().currentUser;
    const phone = channel === 'EMAIL' ? undefined : (targetValue || user.phone || '+91 98421 77321');
    const email = channel === 'EMAIL' ? (targetValue || user.email || 'user@ruraluniv.ac.in') : undefined;

    try {
      const response = await fetch('/api/notifications/test-channel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          userName: user.name,
          channel,
          phone,
          email,
        }),
      });

      if (response.ok) {
        const resData = await response.json();
        if (resData.testMessage) {
          await addDispatchedMessageToFirestore(resData.testMessage).catch(() => {});
          set((state) => ({
            dispatchedMessages: [resData.testMessage, ...state.dispatchedMessages],
          }));
        }
      }
    } catch (err) {
      console.warn('[API Warning] Channel test verification ping failed:', err);
    }
  },

  addNewUserByAdmin: async (userData) => {
    const newId = `usr-${Date.now()}`;
    const newUser: UserProfile = {
      id: newId,
      name: userData.name,
      email: userData.email,
      role: userData.role || 'student',
      department: userData.department || 'General Academic',
      regNumber: userData.regNumber || undefined,
      designation: userData.designation || undefined,
      phone: userData.phone || '+91 98421 77321',
      approvalStatus: userData.approvalStatus || 'approved',
      passwordStatus: 'default_temp',
      mustChangePasswordOnLogin: true,
      tempPassword: userData.tempPassword || DEFAULT_GENERAL_PASSWORD,
      attendance: 90,
      cgpa: 8.5,
      semester: 1,
      approvedAt: new Date().toISOString(),
      approvedBy: get().currentUser.name || 'Central Admin',
    };

    set((state) => ({
      usersList: [newUser, ...state.usersList],
    }));

    try {
      await saveUserProfile(newUser);
      await get().logAdminAction('CREATE', 'USER', newUser.id, newUser.name, `Added institutional account (${newUser.role})`);
    } catch (e) {
      console.warn('[Firestore] Add user by admin error:', e);
    }

    if (newUser.approvalStatus === 'approved') {
      await get().approveUserWithNotifications(newUser.id, newUser.tempPassword);
    }
  },

  bulkImportUsers: async (payload) => {
    const defaultPassword = payload.defaultPassword || DEFAULT_GENERAL_PASSWORD;
    const autoApprove = payload.autoApprove !== false;
    const currentAdminName = get().currentUser.name || 'Central Admin';

    let validationResult: any;
    try {
      const response = await fetch('/api/v1/users/bulk-import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          users: payload.users,
          autoApprove,
          defaultPassword,
          importedBy: currentAdminName,
        }),
      });

      if (response.ok) {
        validationResult = await response.json();
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Bulk import validation failed.' }));
        throw new Error(errorData.error || 'Server validation error.');
      }
    } catch (apiErr: any) {
      console.warn('[API Warning] Using local client-side validation fallback:', apiErr);
      const validated: UserProfile[] = [];
      const errs: any[] = [];
      const seen = new Set<string>();
      const validRoles: UserRole[] = ['student', 'faculty', 'admin', 'staff', 'scholar', 'alumni', 'super_admin'];

      payload.users.forEach((raw: any, idx: number) => {
        const name = (raw.name || '').trim();
        const email = (raw.email || '').trim().toLowerCase();
        const role = (raw.role || '').toString().trim().toLowerCase() as UserRole;
        const department = (raw.department || '').trim();

        if (!name || name.length < 2) {
          errs.push({ index: idx, message: `Row ${idx + 1}: Name is required.` });
          return;
        }
        if (!email || !email.includes('@')) {
          errs.push({ index: idx, message: `Row ${idx + 1}: Invalid email address.` });
          return;
        }
        if (seen.has(email)) {
          errs.push({ index: idx, message: `Row ${idx + 1}: Duplicate email "${email}".` });
          return;
        }
        seen.add(email);
        if (!validRoles.includes(role)) {
          errs.push({ index: idx, message: `Row ${idx + 1}: Invalid role "${role}".` });
          return;
        }
        if (!department) {
          errs.push({ index: idx, message: `Row ${idx + 1}: Department is required.` });
          return;
        }

        validated.push({
          id: raw.id || `USER-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          name,
          email,
          role,
          department,
          phone: raw.phone || '+91 98421 00000',
          regNumber: raw.regNumber || raw.rollNumber || undefined,
          designation: raw.designation || (role === 'faculty' ? 'Assistant Professor' : undefined),
          approvalStatus: autoApprove ? 'approved' : 'pending',
          passwordStatus: 'default_temp',
          mustChangePasswordOnLogin: true,
          tempPassword: raw.password || raw.tempPassword || defaultPassword,
          phoneVerified: true,
          emailVerified: true,
          smsAlertsEnabled: true,
          whatsappAlertsEnabled: true,
          emailCircularsEnabled: true,
          attendance: 90,
          cgpa: role === 'student' ? 8.5 : undefined,
          semester: role === 'student' ? 1 : undefined,
          approvedAt: autoApprove ? new Date().toISOString() : undefined,
          approvedBy: autoApprove ? currentAdminName : undefined,
        });
      });

      validationResult = {
        success: errs.length === 0,
        totalRecords: payload.users.length,
        validCount: validated.length,
        errorCount: errs.length,
        validatedUsers: validated,
        errors: errs,
      };
    }

    const validatedUsers: UserProfile[] = validationResult.validatedUsers || [];

    if (validatedUsers.length > 0) {
      try {
        await batchInsertUsersToFirestore(validatedUsers);
        await get().logAdminAction('CREATE', 'USER_BATCH', `${validatedUsers.length} users`, `Bulk imported ${validatedUsers.length} institutional accounts`);
      } catch (dbErr) {
        console.warn('[Firestore] Batch insert warning:', dbErr);
      }

      set((state) => {
        const existingEmails = new Set(validatedUsers.map((u) => u.email.toLowerCase()));
        const filteredOld = state.usersList.filter((u) => !existingEmails.has(u.email.toLowerCase()));
        return {
          usersList: [...validatedUsers, ...filteredOld],
        };
      });
    }

    return {
      success: validationResult.success,
      totalRecords: validationResult.totalRecords,
      validCount: validationResult.validCount,
      errorCount: validationResult.errorCount,
      errors: validationResult.errors || [],
      importedUsers: validatedUsers,
    };
  },

  deleteUser: async (userId) => {
    const user = get().usersList.find((u) => u.id === userId);
    set((state) => ({
      usersList: state.usersList.filter((u) => u.id !== userId),
    }));

    try {
      await deleteUserFromFirestore(userId);
      await get().logAdminAction('DELETE', 'USER', userId, user?.name || userId, 'Permanently removed user record.');
    } catch (error) {
      console.warn('[Firestore] Delete user error:', error);
    }
  },

  bulkDeleteUsers: async (userIds) => {
    const idSet = new Set(userIds);
    set((state) => ({
      usersList: state.usersList.filter((u) => !idSet.has(u.id)),
    }));

    try {
      await bulkDeleteUsersFromFirestore(userIds);
      await get().logAdminAction('DELETE', 'USER_BULK', `${userIds.length} users`, `Bulk deleted ${userIds.length} accounts`);
    } catch (error) {
      console.warn('[Firestore] Bulk delete users error:', error);
    }
  },

  registerPendingUser: async (user) => {
    const newUser: UserProfile = {
      ...user,
      id: `usr-${Date.now()}`,
      approvalStatus: 'pending',
      passwordStatus: 'default_temp',
      mustChangePasswordOnLogin: true,
      tempPassword: DEFAULT_GENERAL_PASSWORD,
      attendance: 90,
      cgpa: 8.5,
      semester: 1,
    };

    set((state) => ({
      usersList: [...state.usersList, newUser],
    }));

    try {
      await saveUserProfile(newUser);
    } catch (error) {
      console.warn('[Firestore] Save pending user error:', error);
    }
  },

  addDispatchedMessage: async (message) => {
    const newId = `MSG-${Date.now()}`;
    const newMsg: MultiChannelMessage = {
      ...message,
      id: newId,
      sentAt: message.sentAt || new Date().toISOString(),
    };

    set((state) => ({
      dispatchedMessages: [newMsg, ...state.dispatchedMessages],
    }));

    try {
      await addDispatchedMessageToFirestore(message);
    } catch (e) {
      console.warn('[Firestore] Add message log error:', e);
    }
  },

  // Circulars Management
  circulars: INITIAL_CIRCULARS,
  addCircular: async (circular) => {
    const newId = `circ-${Date.now()}`;
    const newCirc: CircularItem = {
      ...circular,
      id: newId,
      status: circular.status || 'PUBLISHED',
      viewsCount: 0,
    };

    set((state) => ({
      circulars: [newCirc, ...state.circulars],
    }));

    try {
      await addCircularToFirestore(circular);
      await get().logAdminAction('CREATE', 'CIRCULAR', newId, circular.title, `Published circular in category ${circular.category}`);
    } catch (error) {
      console.warn('[Firestore] Add circular error:', error);
    }
  },

  updateCircular: async (id, updates) => {
    set((state) => ({
      circulars: state.circulars.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    }));

    try {
      await updateCircularInFirestore(id, updates);
      await get().logAdminAction('UPDATE', 'CIRCULAR', id, updates.title || id, 'Updated circular content/status.');
    } catch (error) {
      console.warn('[Firestore] Update circular error:', error);
    }
  },

  deleteCircular: async (id) => {
    const circ = get().circulars.find((c) => c.id === id);
    set((state) => ({
      circulars: state.circulars.filter((c) => c.id !== id),
    }));

    try {
      await deleteCircularFromFirestore(id);
      await get().logAdminAction('DELETE', 'CIRCULAR', id, circ?.title || id, 'Deleted official university notification.');
    } catch (error) {
      console.warn('[Firestore] Delete circular error:', error);
    }
  },

  bookmarkedIds: ['circ-101'],
  toggleBookmark: (id) =>
    set((state) => ({
      bookmarkedIds: state.bookmarkedIds.includes(id)
        ? state.bookmarkedIds.filter((item) => item !== id)
        : [...state.bookmarkedIds, id],
    })),

  // Schools, Departments, Faculty, Programmes Management
  saveSchool: async (school) => {
    set((state) => {
      const exists = state.schools.some((s) => s.id === school.id);
      return {
        schools: exists ? state.schools.map((s) => (s.id === school.id ? school : s)) : [...state.schools, school],
      };
    });

    try {
      await saveSchoolToFirestore(school);
      await get().logAdminAction('UPDATE', 'SCHOOL', school.id, school.name, `Saved school details with ${school.departments?.length || 0} departments`);
    } catch (e) {
      console.warn('[Firestore] Save school error:', e);
    }
  },

  deleteSchool: async (schoolId) => {
    const school = get().schools.find((s) => s.id === schoolId);
    set((state) => ({
      schools: state.schools.filter((s) => s.id !== schoolId),
    }));

    try {
      await deleteSchoolFromFirestore(schoolId);
      await get().logAdminAction('DELETE', 'SCHOOL', schoolId, school?.name || schoolId, 'Deleted school record.');
    } catch (e) {
      console.warn('[Firestore] Delete school error:', e);
    }
  },

  saveDepartment: async (schoolId, dept) => {
    const currentSchools = get().schools;
    const targetSchool = currentSchools.find((s) => s.id === schoolId);
    if (!targetSchool) return;

    const deptExists = targetSchool.departments.some((d) => d.id === dept.id);
    const updatedDepartments = deptExists
      ? targetSchool.departments.map((d) => (d.id === dept.id ? dept : d))
      : [...targetSchool.departments, dept];

    const updatedSchool: SchoolInfo = {
      ...targetSchool,
      departments: updatedDepartments,
    };

    await get().saveSchool(updatedSchool);
    await get().logAdminAction(deptExists ? 'UPDATE' : 'CREATE', 'DEPARTMENT', dept.id, dept.name, `Saved department under ${targetSchool.name}`);
  },

  deleteDepartment: async (schoolId, deptId) => {
    const targetSchool = get().schools.find((s) => s.id === schoolId);
    if (!targetSchool) return;

    const dept = targetSchool.departments.find((d) => d.id === deptId);
    const updatedSchool: SchoolInfo = {
      ...targetSchool,
      departments: targetSchool.departments.filter((d) => d.id !== deptId),
    };

    await get().saveSchool(updatedSchool);
    await get().logAdminAction('DELETE', 'DEPARTMENT', deptId, dept?.name || deptId, `Deleted department from ${targetSchool.name}`);
  },

  saveFacultyMember: async (schoolId, deptId, faculty) => {
    const targetSchool = get().schools.find((s) => s.id === schoolId);
    if (!targetSchool) return;

    const targetDept = targetSchool.departments.find((d) => d.id === deptId);
    if (!targetDept) return;

    const facultyExists = targetDept.faculty.some((f) => f.id === faculty.id);
    const updatedFaculty = facultyExists
      ? targetDept.faculty.map((f) => (f.id === faculty.id ? faculty : f))
      : [...targetDept.faculty, faculty];

    const updatedDept: DepartmentInfo = {
      ...targetDept,
      faculty: updatedFaculty,
    };

    await get().saveDepartment(schoolId, updatedDept);
    await get().logAdminAction(facultyExists ? 'UPDATE' : 'CREATE', 'FACULTY', faculty.id, faculty.name, `Saved faculty profile in ${targetDept.name}`);
  },

  deleteFacultyMember: async (schoolId, deptId, facultyId) => {
    const targetSchool = get().schools.find((s) => s.id === schoolId);
    if (!targetSchool) return;

    const targetDept = targetSchool.departments.find((d) => d.id === deptId);
    if (!targetDept) return;

    const faculty = targetDept.faculty.find((f) => f.id === facultyId);
    const updatedDept: DepartmentInfo = {
      ...targetDept,
      faculty: targetDept.faculty.filter((f) => f.id !== facultyId),
    };

    await get().saveDepartment(schoolId, updatedDept);
    await get().logAdminAction('DELETE', 'FACULTY', facultyId, faculty?.name || facultyId, `Removed faculty from ${targetDept.name}`);
  },

  saveProgramme: async (schoolId, deptId, programme) => {
    const targetSchool = get().schools.find((s) => s.id === schoolId);
    if (!targetSchool) return;

    const targetDept = targetSchool.departments.find((d) => d.id === deptId);
    if (!targetDept) return;

    const progExists = targetDept.programmes.some((p) => p.code === programme.code);
    const updatedProgrammes = progExists
      ? targetDept.programmes.map((p) => (p.code === programme.code ? programme : p))
      : [...targetDept.programmes, programme];

    const updatedDept: DepartmentInfo = {
      ...targetDept,
      programmes: updatedProgrammes,
    };

    await get().saveDepartment(schoolId, updatedDept);
    await get().logAdminAction(progExists ? 'UPDATE' : 'CREATE', 'PROGRAMME', programme.code, programme.name, `Saved programme under ${targetDept.name}`);
  },

  deleteProgramme: async (schoolId, deptId, progCode) => {
    const targetSchool = get().schools.find((s) => s.id === schoolId);
    if (!targetSchool) return;

    const targetDept = targetSchool.departments.find((d) => d.id === deptId);
    if (!targetDept) return;

    const prog = targetDept.programmes.find((p) => p.code === progCode);
    const updatedDept: DepartmentInfo = {
      ...targetDept,
      programmes: targetDept.programmes.filter((p) => p.code !== progCode),
    };

    await get().saveDepartment(schoolId, updatedDept);
    await get().logAdminAction('DELETE', 'PROGRAMME', progCode, prog?.name || progCode, `Deleted programme from ${targetDept.name}`);
  },

  // Events
  saveEvent: async (event) => {
    set((state) => {
      const exists = state.events.some((e) => e.id === event.id);
      return {
        events: exists ? state.events.map((e) => (e.id === event.id ? event : e)) : [event, ...state.events],
      };
    });

    try {
      await saveEntityToFirestore(EVENTS_COLLECTION, event);
      await get().logAdminAction('UPDATE', 'EVENT', event.id, event.title, `Saved event (${event.date})`);
    } catch (e) {
      console.warn('[Firestore] Save event error:', e);
    }
  },

  deleteEvent: async (eventId) => {
    const evt = get().events.find((e) => e.id === eventId);
    set((state) => ({
      events: state.events.filter((e) => e.id !== eventId),
    }));

    try {
      await deleteEntityFromFirestore(EVENTS_COLLECTION, eventId);
      await get().logAdminAction('DELETE', 'EVENT', eventId, evt?.title || eventId, 'Deleted event entry.');
    } catch (e) {
      console.warn('[Firestore] Delete event error:', e);
    }
  },

  // Placements
  savePlacement: async (placement) => {
    set((state) => {
      const exists = state.placements.some((p) => p.id === placement.id);
      return {
        placements: exists ? state.placements.map((p) => (p.id === placement.id ? placement : p)) : [placement, ...state.placements],
      };
    });

    try {
      await saveEntityToFirestore(PLACEMENTS_COLLECTION, placement);
      await get().logAdminAction('UPDATE', 'PLACEMENT', placement.id, placement.companyName, `Saved placement drive for ${placement.role}`);
    } catch (e) {
      console.warn('[Firestore] Save placement error:', e);
    }
  },

  deletePlacement: async (placementId) => {
    const plc = get().placements.find((p) => p.id === placementId);
    set((state) => ({
      placements: state.placements.filter((p) => p.id !== placementId),
    }));

    try {
      await deleteEntityFromFirestore(PLACEMENTS_COLLECTION, placementId);
      await get().logAdminAction('DELETE', 'PLACEMENT', placementId, plc?.companyName || placementId, 'Deleted placement listing.');
    } catch (e) {
      console.warn('[Firestore] Delete placement error:', e);
    }
  },

  // Research Projects
  saveResearchProject: async (project) => {
    set((state) => {
      const exists = state.researchProjects.some((r) => r.id === project.id);
      return {
        researchProjects: exists ? state.researchProjects.map((r) => (r.id === project.id ? project : r)) : [project, ...state.researchProjects],
      };
    });

    try {
      await saveEntityToFirestore(RESEARCH_COLLECTION, project);
      await get().logAdminAction('UPDATE', 'RESEARCH', project.id, project.title, `Saved research project grant by ${project.fundingAgency}`);
    } catch (e) {
      console.warn('[Firestore] Save research project error:', e);
    }
  },

  deleteResearchProject: async (projectId) => {
    const res = get().researchProjects.find((r) => r.id === projectId);
    set((state) => ({
      researchProjects: state.researchProjects.filter((r) => r.id !== projectId),
    }));

    try {
      await deleteEntityFromFirestore(RESEARCH_COLLECTION, projectId);
      await get().logAdminAction('DELETE', 'RESEARCH', projectId, res?.title || projectId, 'Deleted research project.');
    } catch (e) {
      console.warn('[Firestore] Delete research project error:', e);
    }
  },

  // Documents
  saveDocument: async (docItem) => {
    set((state) => {
      const exists = state.documents.some((d) => d.id === docItem.id);
      return {
        documents: exists ? state.documents.map((d) => (d.id === docItem.id ? docItem : d)) : [docItem, ...state.documents],
      };
    });

    try {
      await saveEntityToFirestore(DOCUMENTS_COLLECTION, docItem);
      await get().logAdminAction('UPDATE', 'DOCUMENT', docItem.id, docItem.title, `Saved repository document in ${docItem.category}`);
    } catch (e) {
      console.warn('[Firestore] Save document error:', e);
    }
  },

  deleteDocument: async (docId) => {
    const docItem = get().documents.find((d) => d.id === docId);
    set((state) => ({
      documents: state.documents.filter((d) => d.id !== docId),
    }));

    try {
      await deleteEntityFromFirestore(DOCUMENTS_COLLECTION, docId);
      await get().logAdminAction('DELETE', 'DOCUMENT', docId, docItem?.title || docId, 'Removed document from official archive.');
    } catch (e) {
      console.warn('[Firestore] Delete document error:', e);
    }
  },

  // FAQs
  saveFaq: async (faq) => {
    set((state) => {
      const exists = state.faqs.some((f) => f.id === faq.id);
      const updated = exists ? state.faqs.map((f) => (f.id === faq.id ? faq : f)) : [...state.faqs, faq];
      return { faqs: updated.sort((a, b) => a.order - b.order) };
    });

    try {
      await saveEntityToFirestore(FAQS_COLLECTION, faq);
      await get().logAdminAction('UPDATE', 'FAQ', faq.id, faq.question, `Saved FAQ entry`);
    } catch (e) {
      console.warn('[Firestore] Save FAQ error:', e);
    }
  },

  deleteFaq: async (faqId) => {
    const faq = get().faqs.find((f) => f.id === faqId);
    set((state) => ({
      faqs: state.faqs.filter((f) => f.id !== faqId),
    }));

    try {
      await deleteEntityFromFirestore(FAQS_COLLECTION, faqId);
      await get().logAdminAction('DELETE', 'FAQ', faqId, faq?.question || faqId, 'Deleted FAQ question.');
    } catch (e) {
      console.warn('[Firestore] Delete FAQ error:', e);
    }
  },

  // Quick Links
  saveQuickLink: async (link) => {
    set((state) => {
      const exists = state.quickLinks.some((q) => q.id === link.id);
      const updated = exists ? state.quickLinks.map((q) => (q.id === link.id ? link : q)) : [...state.quickLinks, link];
      return { quickLinks: updated.sort((a, b) => a.order - b.order) };
    });

    try {
      await saveEntityToFirestore(QUICK_LINKS_COLLECTION, link);
      await get().logAdminAction('UPDATE', 'QUICK_LINK', link.id, link.title, `Saved quick link URL: ${link.url}`);
    } catch (e) {
      console.warn('[Firestore] Save quick link error:', e);
    }
  },

  deleteQuickLink: async (linkId) => {
    const link = get().quickLinks.find((q) => q.id === linkId);
    set((state) => ({
      quickLinks: state.quickLinks.filter((q) => q.id !== linkId),
    }));

    try {
      await deleteEntityFromFirestore(QUICK_LINKS_COLLECTION, linkId);
      await get().logAdminAction('DELETE', 'QUICK_LINK', linkId, link?.title || linkId, 'Deleted quick link navigation.');
    } catch (e) {
      console.warn('[Firestore] Delete quick link error:', e);
    }
  },

  // Dynamic CMS Pages
  saveDynamicPage: async (page) => {
    set((state) => {
      const exists = state.dynamicPages.some((p) => p.id === page.id);
      return {
        dynamicPages: exists ? state.dynamicPages.map((p) => (p.id === page.id ? page : p)) : [...state.dynamicPages, page],
      };
    });

    try {
      await saveEntityToFirestore(DYNAMIC_PAGES_COLLECTION, page);
      await get().logAdminAction(page.published ? 'PUBLISH' : 'UPDATE', 'CMS_PAGE', page.id, page.title, `Published custom CMS page at /page/${page.slug}`);
    } catch (e) {
      console.warn('[Firestore] Save dynamic page error:', e);
    }
  },

  deleteDynamicPage: async (pageId) => {
    const page = get().dynamicPages.find((p) => p.id === pageId);
    set((state) => ({
      dynamicPages: state.dynamicPages.filter((p) => p.id !== pageId),
    }));

    try {
      await deleteEntityFromFirestore(DYNAMIC_PAGES_COLLECTION, pageId);
      await get().logAdminAction('DELETE', 'CMS_PAGE', pageId, page?.title || pageId, 'Deleted dynamic CMS page.');
    } catch (e) {
      console.warn('[Firestore] Delete dynamic page error:', e);
    }
  },

  // AI Knowledge Sources
  saveAiKnowledgeSource: async (source) => {
    set((state) => {
      const exists = state.aiKnowledgeSources.some((s) => s.id === source.id);
      return {
        aiKnowledgeSources: exists ? state.aiKnowledgeSources.map((s) => (s.id === source.id ? source : s)) : [source, ...state.aiKnowledgeSources],
      };
    });

    try {
      await saveEntityToFirestore(AI_KNOWLEDGE_COLLECTION, source);
      await get().logAdminAction('UPDATE', 'AI_KNOWLEDGE', source.id, source.title, `Synchronized knowledge vector index`);
    } catch (e) {
      console.warn('[Firestore] Save AI knowledge source error:', e);
    }
  },

  deleteAiKnowledgeSource: async (sourceId) => {
    const source = get().aiKnowledgeSources.find((s) => s.id === sourceId);
    set((state) => ({
      aiKnowledgeSources: state.aiKnowledgeSources.filter((s) => s.id !== sourceId),
    }));

    try {
      await deleteEntityFromFirestore(AI_KNOWLEDGE_COLLECTION, sourceId);
      await get().logAdminAction('DELETE', 'AI_KNOWLEDGE', sourceId, source?.title || sourceId, 'Removed source from AI index.');
    } catch (e) {
      console.warn('[Firestore] Delete AI knowledge source error:', e);
    }
  },

  // Institution Profile & System Settings
  saveInstitutionProfile: async (profile) => {
    const updated = { ...get().institutionProfile, ...profile };
    set({ institutionProfile: updated });

    try {
      await saveSystemConfigDoc('institution_profile', updated);
      await get().logAdminAction('UPDATE', 'INSTITUTION_PROFILE', 'gri-main', updated.name, 'Updated university branding and contacts.');
    } catch (e) {
      console.warn('[Firestore] Save institution profile error:', e);
    }
  },

  saveHeroConfig: async (config) => {
    const updated = { ...get().heroConfig, ...config };
    set({ heroConfig: updated });

    try {
      await saveSystemConfigDoc('hero_banner', updated);
      await get().logAdminAction('UPDATE', 'HERO_BANNER', 'main_hero', updated.headline, 'Updated home hero banner and tagline.');
    } catch (e) {
      console.warn('[Firestore] Save hero banner error:', e);
    }
  },

  saveFeatureFlags: async (flags) => {
    const updated = { ...get().featureFlags, ...flags };
    set({ featureFlags: updated });

    try {
      await saveSystemConfigDoc('feature_flags', updated);
      await get().logAdminAction('UPDATE', 'FEATURE_FLAGS', 'global', 'App Module Switches', `Toggled features: ${Object.keys(flags).join(', ')}`);
    } catch (e) {
      console.warn('[Firestore] Save feature flags error:', e);
    }
  },

  saveAiSettings: async (settings) => {
    const updated = { ...get().aiSettings, ...settings };
    set({ aiSettings: updated });

    try {
      await saveSystemConfigDoc('ai_settings', updated);
      await get().logAdminAction('UPDATE', 'AI_SETTINGS', 'gemini_config', updated.modelName, 'Updated Gemini AI system prompt & model settings.');
    } catch (e) {
      console.warn('[Firestore] Save AI settings error:', e);
    }
  },

  selectedDepartment: null,
  setSelectedDepartment: (dept) => set({ selectedDepartment: dept }),

  isSearchOpen: false,
  setSearchOpen: (open) => set({ isSearchOpen: open }),

  grievances: [
    {
      id: 'GRV-2026-001',
      category: 'Academic',
      subject: 'Correction in Semester 3 Internal CIA Marksheet',
      description: 'The internal mark for MCA-302 shows 18 instead of 23 on Samarth portal.',
      submittedBy: 'Karthik Subramanian (2024GRI1042)',
      role: 'Student',
      submittedAt: '2026-08-12',
      status: 'RESOLVED',
      response: 'Verified with HoD CS. Mark updated to 23 in Samarth ERP database.',
    },
    {
      id: 'GRV-2026-002',
      category: 'Hostel & Mess',
      subject: 'Wi-Fi speed optimization in Kaveri Hostel Block B',
      description: 'Access point signal drops intermittently in 2nd floor rooms.',
      submittedBy: 'Karthik Subramanian (2024GRI1042)',
      role: 'Student',
      submittedAt: '2026-08-15',
      status: 'UNDER_REVIEW',
      response: 'Computer Centre technicians scheduled for AP antenna re-alignment on Aug 21.',
    },
  ],

  addGrievance: async (ticket) => {
    const newId = `GRV-2026-${String(get().grievances.length + 1).padStart(3, '0')}`;
    const newTicket: GrievanceTicket = {
      ...ticket,
      id: newId,
      submittedAt: new Date().toISOString().split('T')[0],
      status: 'PENDING',
    };

    set((state) => ({
      grievances: [newTicket, ...state.grievances],
    }));

    try {
      await addGrievanceToFirestore(ticket);
    } catch (error) {
      console.warn('[Firestore] Add grievance error:', error);
    }
  },

  updateGrievanceStatus: async (id, status, response) => {
    set((state) => ({
      grievances: state.grievances.map((g) => (g.id === id ? { ...g, status, response: response || g.response } : g)),
    }));

    try {
      await updateGrievanceStatusInFirestore(id, status, response);
      await get().logAdminAction('UPDATE', 'GRIEVANCE', id, `Ticket ${id}`, `Status changed to ${status}`);
    } catch (e) {
      console.warn('[Firestore] Update grievance error:', e);
    }
  },

  initializeRealtimeSync: () => {
    const unsubCirculars = subscribeToCirculars((updatedList) => {
      set({ circulars: updatedList, isFirestoreLive: true });
    });

    const unsubUsers = subscribeToUsers((updatedUsers) => {
      set({ usersList: updatedUsers, isFirestoreLive: true });
      const curr = get().currentUser;
      if (curr && curr.id) {
        const found = updatedUsers.find((u) => u.id === curr.id);
        if (found) {
          set({ currentUser: found });
          if (found.approvalStatus === 'approved' && found.mustChangePasswordOnLogin && !get().isPasswordChangeModalOpen) {
            set({ isPasswordChangeModalOpen: true });
          }
        }
      }
    });

    const unsubMessages = subscribeToDispatchedMessages((updatedMessages) => {
      if (updatedMessages && updatedMessages.length > 0) {
        set({ dispatchedMessages: updatedMessages });
      }
    });

    const unsubGrievances = subscribeToGrievances((updatedGrievances) => {
      if (updatedGrievances && updatedGrievances.length > 0) {
        set({ grievances: updatedGrievances });
      }
    });

    const unsubSchools = subscribeToSchools((updatedSchools) => {
      if (updatedSchools && updatedSchools.length > 0) {
        set({ schools: updatedSchools });
      }
    });

    const unsubEvents = subscribeToEvents((updatedEvents) => {
      if (updatedEvents && updatedEvents.length > 0) {
        set({ events: updatedEvents });
      }
    });

    const unsubPlacements = subscribeToPlacements((updatedPlacements) => {
      if (updatedPlacements && updatedPlacements.length > 0) {
        set({ placements: updatedPlacements });
      }
    });

    const unsubResearch = subscribeToResearchProjects((updatedResearch) => {
      if (updatedResearch && updatedResearch.length > 0) {
        set({ researchProjects: updatedResearch });
      }
    });

    const unsubDocuments = subscribeToDocuments((updatedDocs) => {
      if (updatedDocs && updatedDocs.length > 0) {
        set({ documents: updatedDocs });
      }
    });

    const unsubFaqs = subscribeToFaqs((updatedFaqs) => {
      if (updatedFaqs && updatedFaqs.length > 0) {
        set({ faqs: updatedFaqs });
      }
    });

    const unsubQuickLinks = subscribeToQuickLinks((updatedLinks) => {
      if (updatedLinks && updatedLinks.length > 0) {
        set({ quickLinks: updatedLinks });
      }
    });

    const unsubDynamicPages = subscribeToDynamicPages((updatedPages) => {
      if (updatedPages && updatedPages.length > 0) {
        set({ dynamicPages: updatedPages });
      }
    });

    const unsubAiKnowledge = subscribeToAiKnowledgeSources((updatedAi) => {
      if (updatedAi && updatedAi.length > 0) {
        set({ aiKnowledgeSources: updatedAi });
      }
    });

    const unsubAuditLogs = subscribeToAuditLogs((updatedLogs) => {
      if (updatedLogs && updatedLogs.length > 0) {
        set({ auditLogs: updatedLogs });
      }
    });

    const unsubConfig = subscribeToSystemConfig({
      onHeroChange: (hero) => set({ heroConfig: hero }),
      onFlagsChange: (flags) => set({ featureFlags: flags }),
      onAiSettingsChange: (ai) => set({ aiSettings: ai }),
      onProfileChange: (prof) => set({ institutionProfile: prof }),
    });

    const unsubAuth = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        const existing = get().usersList.find((u) => u.id === fbUser.uid);
        if (existing) {
          set({ currentUser: existing, isAuthenticated: true });
          if (existing.approvalStatus === 'approved' && existing.mustChangePasswordOnLogin) {
            set({ isPasswordChangeModalOpen: true });
          }
        } else {
          const profile: UserProfile = {
            id: fbUser.uid,
            name: fbUser.displayName || 'GRI Scholar',
            email: fbUser.email || '',
            role: fbUser.email?.includes('admin') ? 'admin' : (fbUser.email?.includes('faculty') ? 'faculty' : 'student'),
            department: 'Department of Computer Science & Applications',
            approvalStatus: 'approved',
            avatarUrl: fbUser.photoURL || undefined,
            phone: fbUser.phoneNumber || undefined,
            attendance: 92.5,
            cgpa: 8.75,
            semester: 4,
            passwordStatus: 'user_defined',
            mustChangePasswordOnLogin: false,
          };
          set({ currentUser: profile, isAuthenticated: true });
          saveUserProfile(profile).catch((err) => console.warn('[Firestore Auth sync warning]:', err));
        }
      }
    });

    return () => {
      unsubCirculars();
      unsubUsers();
      unsubMessages();
      unsubGrievances();
      unsubSchools();
      unsubEvents();
      unsubPlacements();
      unsubResearch();
      unsubDocuments();
      unsubFaqs();
      unsubQuickLinks();
      unsubDynamicPages();
      unsubAiKnowledge();
      unsubAuditLogs();
      unsubConfig();
      unsubAuth();
    };
  },
}));
