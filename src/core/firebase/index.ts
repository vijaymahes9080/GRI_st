import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as fbSignOut
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  getDocs,
  serverTimestamp,
  Firestore
} from 'firebase/firestore';
import firebaseConfig from '../../../firebase-applet-config.json';
import { CircularItem, GrievanceTicket, UserProfile, MultiChannelMessage } from '../../types';
import { INITIAL_CIRCULARS, SAMPLE_USERS, INITIAL_DISPATCHED_MESSAGES } from '../data/griMasterData';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// If a custom firestoreDatabaseId is provided, pass it to getFirestore
export const db: Firestore = (firebaseConfig as any).firestoreDatabaseId
  ? getFirestore(app, (firebaseConfig as any).firestoreDatabaseId)
  : getFirestore(app);

// Collection References
export const CIRCULARS_COLLECTION = 'circulars';
export const USERS_COLLECTION = 'users';
export const GRIEVANCES_COLLECTION = 'grievances';
export const CHAT_MESSAGES_COLLECTION = 'chat_messages';
export const DISPATCHED_MESSAGES_COLLECTION = 'dispatched_messages';

/**
 * Strips all keys with `undefined` values from an object before sending to Firestore.
 * Firestore will reject any write containing `undefined`.
 */
export function cleanFirestoreData<T extends Record<string, any>>(data: T): Record<string, any> {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      if (value !== null && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date) && !(value?.constructor?.name === 'FieldValue')) {
        result[key] = cleanFirestoreData(value);
      } else {
        result[key] = value;
      }
    }
  }
  return result;
}

/**
 * Seed initial university circulars, users, and message logs to Firestore if empty
 */
export async function initializeFirestoreData() {
  try {
    const circularsSnap = await getDocs(collection(db, CIRCULARS_COLLECTION));
    if (circularsSnap.empty) {
      console.log('[Firestore] Seeding initial university circulars...');
      for (const circ of INITIAL_CIRCULARS) {
        await setDoc(doc(db, CIRCULARS_COLLECTION, circ.id), cleanFirestoreData({
          ...circ,
          createdAt: serverTimestamp(),
        }));
      }
    }

    const usersSnap = await getDocs(collection(db, USERS_COLLECTION));
    if (usersSnap.empty) {
      console.log('[Firestore] Seeding sample institutional users...');
      for (const user of SAMPLE_USERS) {
        await setDoc(doc(db, USERS_COLLECTION, user.id), cleanFirestoreData({
          ...user,
          createdAt: serverTimestamp(),
        }));
      }
    }

    const messagesSnap = await getDocs(collection(db, DISPATCHED_MESSAGES_COLLECTION));
    if (messagesSnap.empty) {
      console.log('[Firestore] Seeding initial dispatched multi-channel messages...');
      for (const msg of INITIAL_DISPATCHED_MESSAGES) {
        await setDoc(doc(db, DISPATCHED_MESSAGES_COLLECTION, msg.id), cleanFirestoreData({
          ...msg,
          createdAt: serverTimestamp(),
        }));
      }
    }
  } catch (error) {
    console.warn('[Firestore] Auto-seed warning:', error);
  }
}

/**
 * Real-time Circulars Listener
 */
export function subscribeToCirculars(callback: (circulars: CircularItem[]) => void) {
  const colRef = collection(db, CIRCULARS_COLLECTION);
  return onSnapshot(colRef, (snapshot) => {
    if (snapshot.empty) {
      callback(INITIAL_CIRCULARS);
      return;
    }
    const items: CircularItem[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      items.push({
        id: docSnap.id,
        title: data.title || '',
        category: data.category || 'ACADEMIC',
        publishDate: data.publishDate || '',
        isImportant: !!data.isImportant,
        description: data.description || '',
        fileUrl: data.fileUrl || '',
        targetRole: data.targetRole || 'ALL',
        author: data.author || 'GRI Central Administration',
      });
    });
    // Sort so important or latest are first
    items.sort((a, b) => (b.publishDate || '').localeCompare(a.publishDate || ''));
    callback(items);
  }, (err) => {
    console.error('[Firestore] Circulars subscription error:', err);
    callback(INITIAL_CIRCULARS);
  });
}

/**
 * Add a new circular to Firestore (triggers real-time update to all clients)
 */
export async function addCircularToFirestore(circular: Omit<CircularItem, 'id'>) {
  const docRef = await addDoc(collection(db, CIRCULARS_COLLECTION), cleanFirestoreData({
    ...circular,
    createdAt: serverTimestamp(),
  }));
  return docRef.id;
}

/**
 * Real-time Users List Listener
 */
export function subscribeToUsers(callback: (users: UserProfile[]) => void) {
  const colRef = collection(db, USERS_COLLECTION);
  return onSnapshot(colRef, (snapshot) => {
    if (snapshot.empty) {
      callback(SAMPLE_USERS);
      return;
    }
    const items: UserProfile[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      items.push({
        id: docSnap.id,
        name: data.name || 'GRI Member',
        email: data.email || '',
        role: data.role || 'student',
        department: data.department || 'General Academic',
        regNumber: data.regNumber || undefined,
        designation: data.designation || undefined,
        approvalStatus: data.approvalStatus || 'approved',
        avatarUrl: data.avatarUrl || undefined,
        phone: data.phone || undefined,
        attendance: typeof data.attendance === 'number' ? data.attendance : 90,
        cgpa: typeof data.cgpa === 'number' ? data.cgpa : 8.5,
        semester: typeof data.semester === 'number' ? data.semester : 1,
        passwordStatus: data.passwordStatus || (data.approvalStatus === 'approved' ? 'user_defined' : 'default_temp'),
        mustChangePasswordOnLogin: !!data.mustChangePasswordOnLogin,
        tempPassword: data.tempPassword || undefined,
        passwordUpdatedAt: data.passwordUpdatedAt || undefined,
        approvedAt: data.approvedAt || undefined,
        approvedBy: data.approvedBy || undefined,
      });
    });
    callback(items);
  }, (err) => {
    console.error('[Firestore] Users subscription error:', err);
    callback(SAMPLE_USERS);
  });
}

/**
 * Save / Update User Profile in Firestore
 */
export async function saveUserProfile(user: UserProfile) {
  const sanitizedUser = cleanFirestoreData({
    id: user.id,
    name: user.name || 'GRI Member',
    email: user.email || '',
    role: user.role || 'student',
    department: user.department || 'General Academic',
    regNumber: user.regNumber || null,
    designation: user.designation || null,
    approvalStatus: user.approvalStatus || 'approved',
    avatarUrl: user.avatarUrl || null,
    phone: user.phone || null,
    attendance: typeof user.attendance === 'number' ? user.attendance : 90,
    cgpa: typeof user.cgpa === 'number' ? user.cgpa : 8.5,
    semester: typeof user.semester === 'number' ? user.semester : 1,
    passwordStatus: user.passwordStatus || 'default_temp',
    mustChangePasswordOnLogin: !!user.mustChangePasswordOnLogin,
    tempPassword: user.tempPassword || null,
    passwordUpdatedAt: user.passwordUpdatedAt || null,
    approvedAt: user.approvedAt || null,
    approvedBy: user.approvedBy || null,
    updatedAt: serverTimestamp(),
  });

  await setDoc(doc(db, USERS_COLLECTION, user.id), sanitizedUser, { merge: true });
}

/**
 * Bulk / Batch Insert Users to Firestore using writeBatch
 */
export async function batchInsertUsersToFirestore(users: UserProfile[]): Promise<void> {
  if (!users || users.length === 0) return;
  const batch = writeBatch(db);
  for (const u of users) {
    const userRef = doc(db, USERS_COLLECTION, u.id);
    const sanitized = cleanFirestoreData({
      id: u.id,
      name: u.name || 'GRI Member',
      email: u.email || '',
      role: u.role || 'student',
      department: u.department || 'General Academic',
      regNumber: u.regNumber || null,
      designation: u.designation || null,
      approvalStatus: u.approvalStatus || 'approved',
      avatarUrl: u.avatarUrl || null,
      phone: u.phone || null,
      attendance: typeof u.attendance === 'number' ? u.attendance : 90,
      cgpa: typeof u.cgpa === 'number' ? u.cgpa : 8.5,
      semester: typeof u.semester === 'number' ? u.semester : 1,
      passwordStatus: u.passwordStatus || 'default_temp',
      mustChangePasswordOnLogin: u.mustChangePasswordOnLogin !== false,
      tempPassword: u.tempPassword || 'GRI@Admin2026',
      passwordUpdatedAt: u.passwordUpdatedAt || null,
      approvedAt: u.approvedAt || new Date().toISOString(),
      approvedBy: u.approvedBy || 'Admin JSON Bulk Import',
      phoneVerified: u.phoneVerified !== false,
      emailVerified: u.emailVerified !== false,
      smsAlertsEnabled: u.smsAlertsEnabled !== false,
      whatsappAlertsEnabled: u.whatsappAlertsEnabled !== false,
      emailCircularsEnabled: u.emailCircularsEnabled !== false,
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    });
    batch.set(userRef, sanitized, { merge: true });
  }
  await batch.commit();
}

/**
 * Real-time Dispatched Multi-Channel Messages Listener
 */
export function subscribeToDispatchedMessages(callback: (messages: MultiChannelMessage[]) => void) {
  const colRef = collection(db, DISPATCHED_MESSAGES_COLLECTION);
  return onSnapshot(colRef, (snapshot) => {
    if (snapshot.empty) {
      callback(INITIAL_DISPATCHED_MESSAGES);
      return;
    }
    const items: MultiChannelMessage[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      items.push({
        id: docSnap.id,
        userId: data.userId || '',
        userName: data.userName || '',
        recipientEmail: data.recipientEmail || undefined,
        recipientPhone: data.recipientPhone || undefined,
        channel: data.channel || 'IN_APP',
        type: data.type || 'APPROVAL_NOTICE',
        title: data.title || '',
        body: data.body || '',
        status: data.status || 'DELIVERED',
        sentAt: data.sentAt || new Date().toISOString(),
        metadata: data.metadata || undefined,
      });
    });
    // Sort descending by time
    items.sort((a, b) => (b.sentAt || '').localeCompare(a.sentAt || ''));
    callback(items);
  }, (err) => {
    console.error('[Firestore] Dispatched messages subscription error:', err);
    callback(INITIAL_DISPATCHED_MESSAGES);
  });
}

/**
 * Add Dispatched Message record to Firestore
 */
export async function addDispatchedMessageToFirestore(message: Omit<MultiChannelMessage, 'id'>) {
  const docRef = await addDoc(collection(db, DISPATCHED_MESSAGES_COLLECTION), cleanFirestoreData({
    ...message,
    sentAt: message.sentAt || new Date().toISOString(),
    createdAt: serverTimestamp(),
  }));
  return docRef.id;
}

/**
 * Update user verification / approval status
 */
export async function updateUserApprovalStatus(userId: string, status: 'approved' | 'rejected' | 'suspended') {
  await updateDoc(doc(db, USERS_COLLECTION, userId), {
    approvalStatus: status,
    approvedAt: serverTimestamp(),
  });
}

/**
 * Delete a user from Firestore
 */
export async function deleteUserFromFirestore(userId: string) {
  await deleteDoc(doc(db, USERS_COLLECTION, userId));
}

/**
 * Bulk update users verification / status
 */
export async function bulkUpdateUsersStatusInFirestore(userIds: string[], status: 'approved' | 'rejected' | 'suspended') {
  const promises = userIds.map((id) =>
    updateDoc(doc(db, USERS_COLLECTION, id), {
      approvalStatus: status,
      approvedAt: serverTimestamp(),
    })
  );
  await Promise.all(promises);
}

/**
 * Bulk delete users from Firestore
 */
export async function bulkDeleteUsersFromFirestore(userIds: string[]) {
  const promises = userIds.map((id) => deleteDoc(doc(db, USERS_COLLECTION, id)));
  await Promise.all(promises);
}

/**
 * Real-time Grievances Listener
 */
export function subscribeToGrievances(callback: (grievances: GrievanceTicket[]) => void) {
  const colRef = collection(db, GRIEVANCES_COLLECTION);
  return onSnapshot(colRef, (snapshot) => {
    const items: GrievanceTicket[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      items.push({
        id: docSnap.id,
        category: data.category || 'General',
        subject: data.subject || '',
        description: data.description || '',
        submittedBy: data.submittedBy || '',
        role: data.role || 'Student',
        submittedAt: data.submittedAt || '',
        status: data.status || 'PENDING',
        response: data.response || undefined,
      });
    });
    callback(items);
  }, (err) => {
    console.error('[Firestore] Grievances subscription error:', err);
  });
}

/**
 * Add Grievance
 */
export async function addGrievanceToFirestore(ticket: Omit<GrievanceTicket, 'id' | 'submittedAt' | 'status'>) {
  const docRef = await addDoc(collection(db, GRIEVANCES_COLLECTION), cleanFirestoreData({
    ...ticket,
    submittedAt: new Date().toISOString().split('T')[0],
    status: 'PENDING',
    createdAt: serverTimestamp(),
  }));
  return docRef.id;
}

/**
 * Google Sign-In with Firebase Auth
 */
export async function signInWithGoogle(): Promise<UserProfile> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const fbUser = result.user;
    const userProfile: UserProfile = {
      id: fbUser.uid,
      name: fbUser.displayName || 'GRI Scholar',
      email: fbUser.email || '',
      role: fbUser.email?.includes('admin') ? 'admin' : (fbUser.email?.includes('faculty') ? 'faculty' : 'student'),
      department: 'School of Sciences',
      approvalStatus: 'approved',
      avatarUrl: fbUser.photoURL || undefined,
      phone: fbUser.phoneNumber || undefined,
      attendance: 94.5,
      cgpa: 8.92,
      semester: 4,
    };
    await saveUserProfile(userProfile);
    return userProfile;
  } catch (error: any) {
    console.error('[Firebase Auth] Google Sign-In Error:', error);
    throw error;
  }
}

/**
 * Sign out
 */
export async function signOutUser() {
  await fbSignOut(auth);
}
