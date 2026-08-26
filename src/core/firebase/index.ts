import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
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
  writeBatch,
  Firestore
} from 'firebase/firestore';
import firebaseConfig from '../../../firebase-applet-config.json';
import { 
  CircularItem, 
  GrievanceTicket, 
  UserProfile, 
  MultiChannelMessage,
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
  NotificationTemplate
} from '../../types';
import { 
  INITIAL_CIRCULARS, 
  SAMPLE_USERS, 
  INITIAL_DISPATCHED_MESSAGES,
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
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATION_TEMPLATES,
  DEFAULT_GENERAL_PASSWORD
} from '../data/griMasterData';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

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
export const SCHOOLS_COLLECTION = 'schools';
export const EVENTS_COLLECTION = 'events';
export const PLACEMENTS_COLLECTION = 'placements';
export const RESEARCH_COLLECTION = 'research_projects';
export const DOCUMENTS_COLLECTION = 'documents';
export const FAQS_COLLECTION = 'faqs';
export const QUICK_LINKS_COLLECTION = 'quick_links';
export const DYNAMIC_PAGES_COLLECTION = 'dynamic_pages';
export const AI_KNOWLEDGE_COLLECTION = 'ai_knowledge_sources';
export const NOTIFICATION_TEMPLATES_COLLECTION = 'notification_templates';
export const AUDIT_LOGS_COLLECTION = 'audit_logs';
export const SYSTEM_CONFIG_COLLECTION = 'system_config';

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
 * Seed initial university data to Firestore if empty
 */
export async function initializeFirestoreData() {
  try {
    const circularsSnap = await getDocs(collection(db, CIRCULARS_COLLECTION));
    if (circularsSnap.empty) {
      for (const circ of INITIAL_CIRCULARS) {
        await setDoc(doc(db, CIRCULARS_COLLECTION, circ.id), cleanFirestoreData({
          ...circ,
          createdAt: serverTimestamp(),
        }));
      }
    }

    const usersSnap = await getDocs(collection(db, USERS_COLLECTION));
    if (usersSnap.empty) {
      for (const user of SAMPLE_USERS) {
        await setDoc(doc(db, USERS_COLLECTION, user.id), cleanFirestoreData({
          ...user,
          createdAt: serverTimestamp(),
        }));
      }
    }

    const messagesSnap = await getDocs(collection(db, DISPATCHED_MESSAGES_COLLECTION));
    if (messagesSnap.empty) {
      for (const msg of INITIAL_DISPATCHED_MESSAGES) {
        await setDoc(doc(db, DISPATCHED_MESSAGES_COLLECTION, msg.id), cleanFirestoreData({
          ...msg,
          createdAt: serverTimestamp(),
        }));
      }
    }

    const schoolsSnap = await getDocs(collection(db, SCHOOLS_COLLECTION));
    if (schoolsSnap.empty) {
      for (const sch of SCHOOLS_DATA) {
        await setDoc(doc(db, SCHOOLS_COLLECTION, sch.id), cleanFirestoreData({
          ...sch,
          createdAt: serverTimestamp(),
        }));
      }
    }

    const eventsSnap = await getDocs(collection(db, EVENTS_COLLECTION));
    if (eventsSnap.empty) {
      for (const evt of INITIAL_EVENTS) {
        await setDoc(doc(db, EVENTS_COLLECTION, evt.id), cleanFirestoreData({
          ...evt,
          createdAt: serverTimestamp(),
        }));
      }
    }

    const placementsSnap = await getDocs(collection(db, PLACEMENTS_COLLECTION));
    if (placementsSnap.empty) {
      for (const plc of INITIAL_PLACEMENTS) {
        await setDoc(doc(db, PLACEMENTS_COLLECTION, plc.id), cleanFirestoreData({
          ...plc,
          createdAt: serverTimestamp(),
        }));
      }
    }

    const researchSnap = await getDocs(collection(db, RESEARCH_COLLECTION));
    if (researchSnap.empty) {
      for (const res of INITIAL_RESEARCH_PROJECTS) {
        await setDoc(doc(db, RESEARCH_COLLECTION, res.id), cleanFirestoreData({
          ...res,
          createdAt: serverTimestamp(),
        }));
      }
    }

    const docsSnap = await getDocs(collection(db, DOCUMENTS_COLLECTION));
    if (docsSnap.empty) {
      for (const d of INITIAL_DOCUMENTS) {
        await setDoc(doc(db, DOCUMENTS_COLLECTION, d.id), cleanFirestoreData({
          ...d,
          createdAt: serverTimestamp(),
        }));
      }
    }

    const faqsSnap = await getDocs(collection(db, FAQS_COLLECTION));
    if (faqsSnap.empty) {
      for (const f of INITIAL_FAQS) {
        await setDoc(doc(db, FAQS_COLLECTION, f.id), cleanFirestoreData({
          ...f,
          createdAt: serverTimestamp(),
        }));
      }
    }

    const quickLinksSnap = await getDocs(collection(db, QUICK_LINKS_COLLECTION));
    if (quickLinksSnap.empty) {
      for (const q of INITIAL_QUICK_LINKS) {
        await setDoc(doc(db, QUICK_LINKS_COLLECTION, q.id), cleanFirestoreData({
          ...q,
          createdAt: serverTimestamp(),
        }));
      }
    }

    const dynamicPagesSnap = await getDocs(collection(db, DYNAMIC_PAGES_COLLECTION));
    if (dynamicPagesSnap.empty) {
      for (const p of INITIAL_DYNAMIC_PAGES) {
        await setDoc(doc(db, DYNAMIC_PAGES_COLLECTION, p.id), cleanFirestoreData({
          ...p,
          createdAt: serverTimestamp(),
        }));
      }
    }

    const aiKnowledgeSnap = await getDocs(collection(db, AI_KNOWLEDGE_COLLECTION));
    if (aiKnowledgeSnap.empty) {
      for (const ak of INITIAL_AI_KNOWLEDGE_SOURCES) {
        await setDoc(doc(db, AI_KNOWLEDGE_COLLECTION, ak.id), cleanFirestoreData({
          ...ak,
          createdAt: serverTimestamp(),
        }));
      }
    }

    const auditSnap = await getDocs(collection(db, AUDIT_LOGS_COLLECTION));
    if (auditSnap.empty) {
      for (const al of INITIAL_AUDIT_LOGS) {
        await setDoc(doc(db, AUDIT_LOGS_COLLECTION, al.id), cleanFirestoreData({
          ...al,
          createdAt: serverTimestamp(),
        }));
      }
    }

    const templatesSnap = await getDocs(collection(db, NOTIFICATION_TEMPLATES_COLLECTION));
    if (templatesSnap.empty) {
      for (const tpl of INITIAL_NOTIFICATION_TEMPLATES) {
        await setDoc(doc(db, NOTIFICATION_TEMPLATES_COLLECTION, tpl.id), cleanFirestoreData({
          ...tpl,
          createdAt: serverTimestamp(),
        }));
      }
    }

    // System Settings & Config Defaults
    const heroRef = doc(db, SYSTEM_CONFIG_COLLECTION, 'hero_banner');
    await setDoc(heroRef, cleanFirestoreData(DEFAULT_HERO_CONFIG), { merge: true });

    const flagsRef = doc(db, SYSTEM_CONFIG_COLLECTION, 'feature_flags');
    await setDoc(flagsRef, cleanFirestoreData(DEFAULT_FEATURE_FLAGS), { merge: true });

    const aiConfigRef = doc(db, SYSTEM_CONFIG_COLLECTION, 'ai_settings');
    await setDoc(aiConfigRef, cleanFirestoreData(DEFAULT_AI_SETTINGS), { merge: true });

    const profileRef = doc(db, SYSTEM_CONFIG_COLLECTION, 'institution_profile');
    await setDoc(profileRef, cleanFirestoreData(INSTITUTION_INFO), { merge: true });

  } catch (error) {
    console.warn('[Firestore] Auto-seed warning:', error);
  }
}

/**
 * Generic Document CRUD Helpers
 */
export async function saveEntityToFirestore<T extends { id: string }>(collectionName: string, entity: T) {
  const sanitized = cleanFirestoreData({
    ...entity,
    updatedAt: serverTimestamp(),
  });
  await setDoc(doc(db, collectionName, entity.id), sanitized, { merge: true });
}

export async function deleteEntityFromFirestore(collectionName: string, entityId: string) {
  await deleteDoc(doc(db, collectionName, entityId));
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
        status: data.status || 'PUBLISHED',
        viewsCount: typeof data.viewsCount === 'number' ? data.viewsCount : 0,
      });
    });
    items.sort((a, b) => (b.publishDate || '').localeCompare(a.publishDate || ''));
    callback(items);
  }, (err) => {
    console.error('[Firestore] Circulars subscription error:', err);
    callback(INITIAL_CIRCULARS);
  });
}

export async function addCircularToFirestore(circular: Omit<CircularItem, 'id'>) {
  const docRef = await addDoc(collection(db, CIRCULARS_COLLECTION), cleanFirestoreData({
    ...circular,
    status: circular.status || 'PUBLISHED',
    createdAt: serverTimestamp(),
  }));
  return docRef.id;
}

export async function updateCircularInFirestore(id: string, updates: Partial<CircularItem>) {
  await updateDoc(doc(db, CIRCULARS_COLLECTION, id), cleanFirestoreData({
    ...updates,
    updatedAt: serverTimestamp(),
  }));
}

export async function deleteCircularFromFirestore(id: string) {
  await deleteDoc(doc(db, CIRCULARS_COLLECTION, id));
}

/**
 * Real-time Schools / Departments Listener
 */
export function subscribeToSchools(callback: (schools: SchoolInfo[]) => void) {
  const colRef = collection(db, SCHOOLS_COLLECTION);
  return onSnapshot(colRef, (snapshot) => {
    if (snapshot.empty) {
      callback(SCHOOLS_DATA);
      return;
    }
    const items: SchoolInfo[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      items.push({
        id: docSnap.id,
        name: data.name || '',
        deanName: data.deanName || '',
        description: data.description || '',
        departments: Array.isArray(data.departments) ? data.departments : [],
      });
    });
    callback(items);
  }, (err) => {
    console.error('[Firestore] Schools subscription error:', err);
    callback(SCHOOLS_DATA);
  });
}

export async function saveSchoolToFirestore(school: SchoolInfo) {
  await setDoc(doc(db, SCHOOLS_COLLECTION, school.id), cleanFirestoreData(school), { merge: true });
}

export async function deleteSchoolFromFirestore(schoolId: string) {
  await deleteDoc(doc(db, SCHOOLS_COLLECTION, schoolId));
}

/**
 * Real-time Events Listener
 */
export function subscribeToEvents(callback: (events: EventItem[]) => void) {
  const colRef = collection(db, EVENTS_COLLECTION);
  return onSnapshot(colRef, (snapshot) => {
    if (snapshot.empty) {
      callback(INITIAL_EVENTS);
      return;
    }
    const items: EventItem[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      items.push({
        id: docSnap.id,
        title: data.title || '',
        description: data.description || '',
        date: data.date || '',
        time: data.time || '',
        venue: data.venue || '',
        organizer: data.organizer || '',
        category: data.category || 'SEMINAR',
        registrationUrl: data.registrationUrl || '',
        imageUrl: data.imageUrl || '',
        status: data.status || 'UPCOMING',
        targetAudience: data.targetAudience || '',
      });
    });
    items.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    callback(items);
  }, (err) => {
    console.error('[Firestore] Events subscription error:', err);
    callback(INITIAL_EVENTS);
  });
}

/**
 * Real-time Placements Listener
 */
export function subscribeToPlacements(callback: (placements: PlacementItem[]) => void) {
  const colRef = collection(db, PLACEMENTS_COLLECTION);
  return onSnapshot(colRef, (snapshot) => {
    if (snapshot.empty) {
      callback(INITIAL_PLACEMENTS);
      return;
    }
    const items: PlacementItem[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      items.push({
        id: docSnap.id,
        companyName: data.companyName || '',
        role: data.role || '',
        ctc: data.ctc || '',
        driveDate: data.driveDate || '',
        deadline: data.deadline || '',
        eligibleCourses: Array.isArray(data.eligibleCourses) ? data.eligibleCourses : [],
        minCgpa: typeof data.minCgpa === 'number' ? data.minCgpa : 6.0,
        location: data.location || '',
        description: data.description || '',
        applyLink: data.applyLink || '',
        status: data.status || 'OPEN',
      });
    });
    callback(items);
  }, (err) => {
    console.error('[Firestore] Placements subscription error:', err);
    callback(INITIAL_PLACEMENTS);
  });
}

/**
 * Real-time Research Projects Listener
 */
export function subscribeToResearchProjects(callback: (projects: ResearchItem[]) => void) {
  const colRef = collection(db, RESEARCH_COLLECTION);
  return onSnapshot(colRef, (snapshot) => {
    if (snapshot.empty) {
      callback(INITIAL_RESEARCH_PROJECTS);
      return;
    }
    const items: ResearchItem[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      items.push({
        id: docSnap.id,
        title: data.title || '',
        piName: data.piName || '',
        department: data.department || '',
        fundingAgency: data.fundingAgency || 'DST',
        grantAmount: data.grantAmount || '',
        sanctionYear: data.sanctionYear || '',
        status: data.status || 'ONGOING',
        thrustArea: data.thrustArea || '',
        publicationsCount: typeof data.publicationsCount === 'number' ? data.publicationsCount : 0,
      });
    });
    callback(items);
  }, (err) => {
    console.error('[Firestore] Research projects subscription error:', err);
    callback(INITIAL_RESEARCH_PROJECTS);
  });
}

/**
 * Real-time Documents Listener
 */
export function subscribeToDocuments(callback: (docs: DocumentItem[]) => void) {
  const colRef = collection(db, DOCUMENTS_COLLECTION);
  return onSnapshot(colRef, (snapshot) => {
    if (snapshot.empty) {
      callback(INITIAL_DOCUMENTS);
      return;
    }
    const items: DocumentItem[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      items.push({
        id: docSnap.id,
        title: data.title || '',
        category: data.category || 'REGULATION',
        fileUrl: data.fileUrl || '',
        fileSize: data.fileSize || '1.0 MB',
        fileType: data.fileType || 'PDF',
        uploadDate: data.uploadDate || '',
        uploadedBy: data.uploadedBy || 'Administration',
        downloadCount: typeof data.downloadCount === 'number' ? data.downloadCount : 0,
        status: data.status || 'ACTIVE',
      });
    });
    callback(items);
  }, (err) => {
    console.error('[Firestore] Documents subscription error:', err);
    callback(INITIAL_DOCUMENTS);
  });
}

/**
 * Real-time FAQs Listener
 */
export function subscribeToFaqs(callback: (faqs: FaqItem[]) => void) {
  const colRef = collection(db, FAQS_COLLECTION);
  return onSnapshot(colRef, (snapshot) => {
    if (snapshot.empty) {
      callback(INITIAL_FAQS);
      return;
    }
    const items: FaqItem[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      items.push({
        id: docSnap.id,
        question: data.question || '',
        answer: data.answer || '',
        category: data.category || 'GENERAL',
        order: typeof data.order === 'number' ? data.order : 0,
        isPublished: data.isPublished !== false,
      });
    });
    items.sort((a, b) => a.order - b.order);
    callback(items);
  }, (err) => {
    console.error('[Firestore] FAQs subscription error:', err);
    callback(INITIAL_FAQS);
  });
}

/**
 * Real-time Quick Links Listener
 */
export function subscribeToQuickLinks(callback: (links: QuickLinkItem[]) => void) {
  const colRef = collection(db, QUICK_LINKS_COLLECTION);
  return onSnapshot(colRef, (snapshot) => {
    if (snapshot.empty) {
      callback(INITIAL_QUICK_LINKS);
      return;
    }
    const items: QuickLinkItem[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      items.push({
        id: docSnap.id,
        title: data.title || '',
        url: data.url || '',
        category: data.category || 'PORTAL',
        iconName: data.iconName || 'Link',
        description: data.description || '',
        isExternal: data.isExternal !== false,
        order: typeof data.order === 'number' ? data.order : 0,
      });
    });
    items.sort((a, b) => a.order - b.order);
    callback(items);
  }, (err) => {
    console.error('[Firestore] Quick links subscription error:', err);
    callback(INITIAL_QUICK_LINKS);
  });
}

/**
 * Real-time Dynamic Pages Listener
 */
export function subscribeToDynamicPages(callback: (pages: DynamicPage[]) => void) {
  const colRef = collection(db, DYNAMIC_PAGES_COLLECTION);
  return onSnapshot(colRef, (snapshot) => {
    if (snapshot.empty) {
      callback(INITIAL_DYNAMIC_PAGES);
      return;
    }
    const items: DynamicPage[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      items.push({
        id: docSnap.id,
        slug: data.slug || '',
        title: data.title || '',
        subtitle: data.subtitle || '',
        category: data.category || 'CUSTOM',
        contentMarkdown: data.contentMarkdown || '',
        bannerImage: data.bannerImage || '',
        published: data.published !== false,
        lastUpdated: data.lastUpdated || '',
        author: data.author || 'GRI Administration',
      });
    });
    callback(items);
  }, (err) => {
    console.error('[Firestore] Dynamic pages subscription error:', err);
    callback(INITIAL_DYNAMIC_PAGES);
  });
}

/**
 * Real-time AI Knowledge Sources Listener
 */
export function subscribeToAiKnowledgeSources(callback: (sources: AiKnowledgeSource[]) => void) {
  const colRef = collection(db, AI_KNOWLEDGE_COLLECTION);
  return onSnapshot(colRef, (snapshot) => {
    if (snapshot.empty) {
      callback(INITIAL_AI_KNOWLEDGE_SOURCES);
      return;
    }
    const items: AiKnowledgeSource[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      items.push({
        id: docSnap.id,
        title: data.title || '',
        category: data.category || 'GENERAL',
        sourceUrl: data.sourceUrl || '',
        contentSnippet: data.contentSnippet || '',
        status: data.status || 'INDEXED',
        chunkCount: typeof data.chunkCount === 'number' ? data.chunkCount : 10,
        lastSynced: data.lastSynced || '',
      });
    });
    callback(items);
  }, (err) => {
    console.error('[Firestore] AI knowledge subscription error:', err);
    callback(INITIAL_AI_KNOWLEDGE_SOURCES);
  });
}

/**
 * Real-time Audit Logs Listener
 */
export function subscribeToAuditLogs(callback: (logs: AuditLogEntry[]) => void) {
  const colRef = collection(db, AUDIT_LOGS_COLLECTION);
  return onSnapshot(colRef, (snapshot) => {
    if (snapshot.empty) {
      callback(INITIAL_AUDIT_LOGS);
      return;
    }
    const items: AuditLogEntry[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      items.push({
        id: docSnap.id,
        timestamp: data.timestamp || new Date().toISOString(),
        adminEmail: data.adminEmail || '',
        adminName: data.adminName || 'Admin',
        action: data.action || 'UPDATE',
        resourceType: data.resourceType || 'SETTINGS',
        resourceId: data.resourceId || '',
        resourceTitle: data.resourceTitle || '',
        details: data.details || '',
      });
    });
    items.sort((a, b) => (b.timestamp || '').localeCompare(a.timestamp || ''));
    callback(items);
  }, (err) => {
    console.error('[Firestore] Audit logs subscription error:', err);
    callback(INITIAL_AUDIT_LOGS);
  });
}

/**
 * Real-time Notification Templates Listener
 */
export function subscribeToNotificationTemplates(callback: (templates: NotificationTemplate[]) => void) {
  const colRef = collection(db, NOTIFICATION_TEMPLATES_COLLECTION);
  return onSnapshot(colRef, (snapshot) => {
    if (snapshot.empty) {
      callback(INITIAL_NOTIFICATION_TEMPLATES);
      return;
    }
    const items: NotificationTemplate[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      items.push({
        id: docSnap.id,
        name: data.name || '',
        category: data.category || 'ACADEMIC',
        targetRole: data.targetRole || 'ALL',
        titleTemplate: data.titleTemplate || '',
        bodyTemplate: data.bodyTemplate || '',
        channels: data.channels || ['EMAIL', 'IN_APP'],
        isImportant: !!data.isImportant,
        visibility: data.visibility || 'AUTHENTICATED',
        tags: Array.isArray(data.tags) ? data.tags : [],
        createdAt: data.createdAt || '',
        updatedAt: data.updatedAt || '',
        author: data.author || 'GRI Administrator',
        isBuiltIn: !!data.isBuiltIn,
        usageCount: typeof data.usageCount === 'number' ? data.usageCount : 0,
      });
    });
    // Sort built-in first or by name
    items.sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0));
    callback(items);
  }, (err) => {
    console.error('[Firestore] Notification templates subscription error:', err);
    callback(INITIAL_NOTIFICATION_TEMPLATES);
  });
}

export async function saveNotificationTemplateToFirestore(template: NotificationTemplate) {
  await setDoc(doc(db, NOTIFICATION_TEMPLATES_COLLECTION, template.id), cleanFirestoreData({
    ...template,
    updatedAt: new Date().toISOString(),
    serverModified: serverTimestamp(),
  }), { merge: true });
}

export async function deleteNotificationTemplateFromFirestore(templateId: string) {
  await deleteDoc(doc(db, NOTIFICATION_TEMPLATES_COLLECTION, templateId));
}

/**
 * Add an audit log entry to Firestore
 */
export async function addAuditLogToFirestore(log: Omit<AuditLogEntry, 'id' | 'timestamp'>) {
  try {
    const entry: AuditLogEntry = {
      id: `aud-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      ...log,
    };
    await setDoc(doc(db, AUDIT_LOGS_COLLECTION, entry.id), cleanFirestoreData({
      ...entry,
      createdAt: serverTimestamp(),
    }));
  } catch (error) {
    console.warn('[Firestore] Audit log save warning:', error);
  }
}

/**
 * Real-time System Config Listeners (Hero, Feature Flags, AI Config, Profile)
 */
export function subscribeToSystemConfig(callbacks: {
  onHeroChange?: (config: HeroBannerConfig) => void;
  onFlagsChange?: (flags: FeatureFlags) => void;
  onAiSettingsChange?: (ai: AiSettingsConfig) => void;
  onProfileChange?: (profile: InstitutionProfile) => void;
}) {
  const colRef = collection(db, SYSTEM_CONFIG_COLLECTION);
  return onSnapshot(colRef, (snapshot) => {
    snapshot.forEach((docSnap) => {
      const id = docSnap.id;
      const data = docSnap.data();
      if (id === 'hero_banner' && callbacks.onHeroChange) {
        callbacks.onHeroChange({ ...DEFAULT_HERO_CONFIG, ...data });
      } else if (id === 'feature_flags' && callbacks.onFlagsChange) {
        callbacks.onFlagsChange({ ...DEFAULT_FEATURE_FLAGS, ...data });
      } else if (id === 'ai_settings' && callbacks.onAiSettingsChange) {
        callbacks.onAiSettingsChange({ ...DEFAULT_AI_SETTINGS, ...data });
      } else if (id === 'institution_profile' && callbacks.onProfileChange) {
        callbacks.onProfileChange({ ...INSTITUTION_INFO, ...data });
      }
    });
  }, (err) => {
    console.error('[Firestore] System config subscription error:', err);
  });
}

export async function saveSystemConfigDoc(docId: 'hero_banner' | 'feature_flags' | 'ai_settings' | 'institution_profile', data: Record<string, any>) {
  await setDoc(doc(db, SYSTEM_CONFIG_COLLECTION, docId), cleanFirestoreData({
    ...data,
    updatedAt: serverTimestamp(),
  }), { merge: true });
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
        createdAt: data.createdAt || undefined,
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

export async function updateGrievanceStatusInFirestore(id: string, status: 'PENDING' | 'UNDER_REVIEW' | 'RESOLVED', response?: string) {
  await updateDoc(doc(db, GRIEVANCES_COLLECTION, id), cleanFirestoreData({
    status,
    response: response || null,
    updatedAt: serverTimestamp(),
  }));
}

/**
 * Institutional Authentication with Verified Identity
 */

/**
 * Sign out
 */
export async function signOutUser() {
  await fbSignOut(auth);
}
