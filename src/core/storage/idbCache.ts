/**
 * IndexedDB Cache Utility for Critical Institutional Information
 * Allows storing and offline retrieval of institutional data, master directory, and circulars.
 */

const DB_NAME = 'GRI_OfflineDB';
const STORE_NAME = 'institutional_cache';
const DB_VERSION = 1;

export function openIndexedDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
}

export async function setCachedData(key: string, data: any): Promise<void> {
  try {
    const db = await openIndexedDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put({ data, timestamp: Date.now() }, key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn('[IndexedDB] Fallback write error:', err);
    try {
      localStorage.setItem(`gri_cache_${key}`, JSON.stringify({ data, timestamp: Date.now() }));
    } catch {}
  }
}

export async function getCachedData(key: string): Promise<any | null> {
  try {
    const db = await openIndexedDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(key);

      request.onsuccess = () => {
        const result = request.result;
        resolve(result ? result.data : null);
      };
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn('[IndexedDB] Fallback read error:', err);
    try {
      const item = localStorage.getItem(`gri_cache_${key}`);
      if (item) {
        const parsed = JSON.parse(item);
        return parsed.data;
      }
    } catch {}
    return null;
  }
}
