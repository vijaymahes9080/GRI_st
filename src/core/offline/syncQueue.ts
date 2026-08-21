import { getItem, setItem } from '../storage';
import { apiClient } from '../api';

export interface PendingSyncItem {
  id: string;
  endpoint: string;
  method: 'POST' | 'PUT' | 'DELETE';
  payload: any;
  timestamp: number;
  retries: number;
}

const QUEUE_STORAGE_KEY = 'offline_pending_sync_queue';

export const getSyncQueue = (): PendingSyncItem[] => {
  return getItem<PendingSyncItem[]>(QUEUE_STORAGE_KEY) || [];
};

export const enqueueOfflineAction = (endpoint: string, method: 'POST' | 'PUT' | 'DELETE', payload: any): void => {
  const queue = getSyncQueue();
  const newItem: PendingSyncItem = {
    id: `sync_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
    endpoint,
    method,
    payload,
    timestamp: Date.now(),
    retries: 0,
  };
  queue.push(newItem);
  setItem(QUEUE_STORAGE_KEY, queue);
};

export const processOfflineSyncQueue = async (): Promise<{ successCount: number; failCount: number }> => {
  const queue = getSyncQueue();
  if (queue.length === 0) return { successCount: 0, failCount: 0 };

  const remainingItems: PendingSyncItem[] = [];
  let successCount = 0;
  let failCount = 0;

  for (const item of queue) {
    try {
      if (item.method === 'POST') {
        await apiClient.post(item.endpoint, item.payload);
      } else if (item.method === 'PUT') {
        await apiClient.put(item.endpoint, item.payload);
      } else if (item.method === 'DELETE') {
        await apiClient.delete(item.endpoint);
      }
      successCount++;
    } catch {
      failCount++;
      if (item.retries < 5) {
        remainingItems.push({ ...item, retries: item.retries + 1 });
      } else {
        console.warn(`[SyncQueue] Dropping item after 5 failed retries: ${item.endpoint} (${item.id})`);
      }
    }
  }

  setItem(QUEUE_STORAGE_KEY, remainingItems);
  return { successCount, failCount };
};
