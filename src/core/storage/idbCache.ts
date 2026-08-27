/**
 * IndexedDB Cache Utility for Critical Institutional Information
 * Allows storing and offline retrieval of institutional data, master directory, and circulars.
 */

const DB_NAME = 'GRI_OfflineDB';
const STORE_NAME = 'institutional_cache';
const PENDING_REG_STORE = 'pending_registrations';
const DB_VERSION = 2;

export function openIndexedDB(): Promise<IDBDatabase | null> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      resolve(null);
      return;
    }

    try {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.info('[IndexedDB] Database open notice (falling back to localStorage)');
        resolve(null);
      };

      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        try {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME);
          }
          if (!db.objectStoreNames.contains(PENDING_REG_STORE)) {
            db.createObjectStore(PENDING_REG_STORE, { keyPath: 'id', autoIncrement: true });
          }
        } catch (e) {
          console.warn('[IndexedDB] Upgrade error:', e);
        }
      };

      request.onblocked = () => {
        console.warn('[IndexedDB] Open request blocked by another tab');
        resolve(null);
      };
    } catch (e) {
      console.warn('[IndexedDB] Initialization exception:', e);
      resolve(null);
    }
  });
}

export async function queuePendingRegistration(registrationData: any): Promise<void> {
  try {
    const db = await openIndexedDB();
    if (db) {
      return new Promise((resolve) => {
        try {
          const transaction = db.transaction(PENDING_REG_STORE, 'readwrite');
          const store = transaction.objectStore(PENDING_REG_STORE);
          const request = store.add({ ...registrationData, queuedAt: Date.now() });

          request.onsuccess = () => resolve();
          request.onerror = () => {
            savePendingToLocalStorage(registrationData);
            resolve();
          };
        } catch {
          savePendingToLocalStorage(registrationData);
          resolve();
        }
      });
    }
  } catch (err) {
    console.warn('[IndexedDB] Queue pending registration notice:', err);
  }
  savePendingToLocalStorage(registrationData);
}

function savePendingToLocalStorage(registrationData: any) {
  try {
    const existing = JSON.parse(localStorage.getItem('gri_pending_registrations') || '[]');
    existing.push({ ...registrationData, queuedAt: Date.now() });
    localStorage.setItem('gri_pending_registrations', JSON.stringify(existing));
  } catch {}
}

export async function getPendingRegistrations(): Promise<any[]> {
  try {
    const db = await openIndexedDB();
    if (db) {
      return new Promise((resolve) => {
        try {
          const transaction = db.transaction(PENDING_REG_STORE, 'readonly');
          const store = transaction.objectStore(PENDING_REG_STORE);
          const request = store.getAll();

          request.onsuccess = () => resolve(request.result || []);
          request.onerror = () => {
            resolve(getPendingFromLocalStorage());
          };
        } catch {
          resolve(getPendingFromLocalStorage());
        }
      });
    }
  } catch (err) {
    console.warn('[IndexedDB] Get pending registrations notice:', err);
  }
  return getPendingFromLocalStorage();
}

function getPendingFromLocalStorage(): any[] {
  try {
    return JSON.parse(localStorage.getItem('gri_pending_registrations') || '[]');
  } catch {
    return [];
  }
}

export async function clearPendingRegistrations(): Promise<void> {
  try {
    const db = await openIndexedDB();
    if (db) {
      return new Promise((resolve) => {
        try {
          const transaction = db.transaction(PENDING_REG_STORE, 'readwrite');
          const store = transaction.objectStore(PENDING_REG_STORE);
          const request = store.clear();

          request.onsuccess = () => resolve();
          request.onerror = () => resolve();
        } catch {
          resolve();
        }
      });
    }
  } catch {}
  try {
    localStorage.removeItem('gri_pending_registrations');
  } catch {}
}

export async function setCachedData(key: string, data: any): Promise<void> {
  try {
    const db = await openIndexedDB();
    if (db) {
      return new Promise((resolve) => {
        try {
          const transaction = db.transaction(STORE_NAME, 'readwrite');
          const store = transaction.objectStore(STORE_NAME);
          const request = store.put({ data, timestamp: Date.now() }, key);

          request.onsuccess = () => resolve();
          request.onerror = () => {
            setLocalStorageCache(key, data);
            resolve();
          };
        } catch {
          setLocalStorageCache(key, data);
          resolve();
        }
      });
    }
  } catch (err) {
    console.warn('[IndexedDB] Fallback cache notice:', err);
  }
  setLocalStorageCache(key, data);
}

function setLocalStorageCache(key: string, data: any) {
  try {
    localStorage.setItem(`gri_cache_${key}`, JSON.stringify({ data, timestamp: Date.now() }));
  } catch {}
}

export async function getCachedData(key: string): Promise<any | null> {
  try {
    const db = await openIndexedDB();
    if (db) {
      return new Promise((resolve) => {
        try {
          const transaction = db.transaction(STORE_NAME, 'readonly');
          const store = transaction.objectStore(STORE_NAME);
          const request = store.get(key);

          request.onsuccess = () => {
            const result = request.result;
            resolve(result ? result.data : getLocalStorageCache(key));
          };
          request.onerror = () => {
            resolve(getLocalStorageCache(key));
          };
        } catch {
          resolve(getLocalStorageCache(key));
        }
      });
    }
  } catch (err) {
    console.warn('[IndexedDB] Fallback cache read notice:', err);
  }
  return getLocalStorageCache(key);
}

function getLocalStorageCache(key: string): any | null {
  try {
    const item = localStorage.getItem(`gri_cache_${key}`);
    if (item) {
      const parsed = JSON.parse(item);
      return parsed.data;
    }
  } catch {}
  return null;
}

