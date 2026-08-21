import { create } from 'zustand';
import { UserProfile, CircularItem, GrievanceTicket, DepartmentInfo, MultiChannelMessage, UserRole } from '../../types';
import { INITIAL_CIRCULARS, SAMPLE_USERS, INITIAL_DISPATCHED_MESSAGES, DEFAULT_GENERAL_PASSWORD } from '../data/griMasterData';
import {
  subscribeToCirculars,
  subscribeToUsers,
  subscribeToGrievances,
  subscribeToDispatchedMessages,
  addCircularToFirestore,
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
  auth
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

  // Circulars
  circulars: CircularItem[];
  addCircular: (circular: Omit<CircularItem, 'id'>) => Promise<void>;
  bookmarkedIds: string[];
  toggleBookmark: (id: string) => void;

  // Selected Department for deep view
  selectedDepartment: DepartmentInfo | null;
  setSelectedDepartment: (dept: DepartmentInfo | null) => void;

  // Global Search modal
  isSearchOpen: boolean;
  setSearchOpen: (open: boolean) => void;

  // Grievance tickets
  grievances: GrievanceTicket[];
  addGrievance: (ticket: Omit<GrievanceTicket, 'id' | 'submittedAt' | 'status'>) => Promise<void>;

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

  loginAsUser: (user) => {
    set({ currentUser: user, isAuthenticated: true });
    // Check if user requires mandatory password reset
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

  updateUserApproval: async (userId, status) => {
    if (status === 'approved') {
      await get().approveUserWithNotifications(userId);
      return;
    }

    // Optimistic local update for reject/suspend
    set((state) => ({
      usersList: state.usersList.map((u) => (u.id === userId ? { ...u, approvalStatus: status } : u)),
      currentUser: state.currentUser.id === userId ? { ...state.currentUser, approvalStatus: status } : state.currentUser,
    }));

    try {
      await updateUserApprovalStatus(userId, status);
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

    // 1. Optimistic local update
    set((state) => ({
      usersList: state.usersList.map((u) => (u.id === userId ? updatedUser : u)),
      currentUser: state.currentUser.id === userId ? updatedUser : state.currentUser,
    }));

    // 2. Call backend notification dispatch engine
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
          // Add dispatched messages to Firestore and local store
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

    // 3. Save updated user to Firestore
    try {
      await saveUserProfile(updatedUser);
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
      tempPassword: undefined, // Clear provisional password
    };

    // 1. Optimistic local update
    set((state) => ({
      currentUser: updatedUser,
      usersList: state.usersList.map((u) => (u.id === user.id ? updatedUser : u)),
      isPasswordChangeModalOpen: false,
    }));

    // 2. Call backend password change endpoint
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

    // 3. Save updated user to Firestore
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

    // Local update
    set((state) => ({
      usersList: state.usersList.map((u) => (u.id === userId ? updatedUser : u)),
      currentUser: state.currentUser.id === userId ? updatedUser : state.currentUser,
    }));

    // Backend notification dispatch
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

    // Save to Firestore
    try {
      await saveUserProfile(updatedUser);
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

    // 1. Local update
    set((state) => ({
      usersList: state.usersList.map((u) => (u.id === userId ? updatedUser : u)),
      currentUser: state.currentUser.id === userId ? updatedUser : state.currentUser,
    }));

    // 2. Call backend registration endpoint
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

    // 3. Save to Firestore
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

    // Save to Firestore
    try {
      await saveUserProfile(newUser);
    } catch (e) {
      console.warn('[Firestore] Add user by admin error:', e);
    }

    // If added as approved, dispatch approval credentials automatically
    if (newUser.approvalStatus === 'approved') {
      await get().approveUserWithNotifications(newUser.id, newUser.tempPassword);
    }
  },

  bulkImportUsers: async (payload) => {
    const defaultPassword = payload.defaultPassword || DEFAULT_GENERAL_PASSWORD;
    const autoApprove = payload.autoApprove !== false;
    const currentAdminName = get().currentUser.name || 'Central Admin';

    // 1. Call Backend Bulk Validation & Parsing API
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
      // Fallback local validation if server is busy
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
      // 2. Batch write to Firestore
      try {
        await batchInsertUsersToFirestore(validatedUsers);
      } catch (dbErr) {
        console.warn('[Firestore] Batch insert warning:', dbErr);
      }

      // 3. Update store usersList (deduplicating by email/id)
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
    set((state) => ({
      usersList: state.usersList.filter((u) => u.id !== userId),
    }));

    try {
      await deleteUserFromFirestore(userId);
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

  circulars: INITIAL_CIRCULARS,
  addCircular: async (circular) => {
    const newId = `circ-${Date.now()}`;
    const newCirc: CircularItem = {
      ...circular,
      id: newId,
    };

    // Optimistic local update
    set((state) => ({
      circulars: [newCirc, ...state.circulars],
    }));

    try {
      await addCircularToFirestore(circular);
    } catch (error) {
      console.warn('[Firestore] Add circular error:', error);
    }
  },

  bookmarkedIds: ['circ-101'],
  toggleBookmark: (id) =>
    set((state) => ({
      bookmarkedIds: state.bookmarkedIds.includes(id)
        ? state.bookmarkedIds.filter((item) => item !== id)
        : [...state.bookmarkedIds, id],
    })),

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

  initializeRealtimeSync: () => {
    // 1. Subscribe to circulars
    const unsubCirculars = subscribeToCirculars((updatedList) => {
      set({ circulars: updatedList, isFirestoreLive: true });
    });

    // 2. Subscribe to users
    const unsubUsers = subscribeToUsers((updatedUsers) => {
      set({ usersList: updatedUsers, isFirestoreLive: true });
      // Update current user if it exists in updated list
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

    // 3. Subscribe to dispatched multi-channel messages
    const unsubMessages = subscribeToDispatchedMessages((updatedMessages) => {
      if (updatedMessages && updatedMessages.length > 0) {
        set({ dispatchedMessages: updatedMessages });
      }
    });

    // 4. Subscribe to grievances
    const unsubGrievances = subscribeToGrievances((updatedGrievances) => {
      if (updatedGrievances && updatedGrievances.length > 0) {
        set({ grievances: updatedGrievances });
      }
    });

    // 5. Listen to Firebase Auth state
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
      unsubAuth();
    };
  },
}));
