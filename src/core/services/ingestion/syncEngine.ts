import { NewsAdapter, EventsAdapter, DepartmentsAdapter, AdmissionsAdapter, ExaminationAdapter, BaseGriAdapter } from './griAdapters';
import { ContentEntity } from '../../types/content';
import { api } from '../../api/client';
import { setItem, getItem } from '../../storage';

export interface SyncEngineStatus {
  lastSyncTimestamp: string;
  totalEntitiesSynced: number;
  adaptersCount: number;
  errors: string[];
}

export class SyncEngine {
  private adapters: BaseGriAdapter[] = [
    new NewsAdapter(),
    new EventsAdapter(),
    new DepartmentsAdapter(),
    new AdmissionsAdapter(),
    new ExaminationAdapter(),
  ];

  public async runSync(): Promise<SyncEngineStatus> {
    const errors: string[] = [];
    let totalSynced = 0;
    const allEntities: Partial<ContentEntity>[] = [];

    for (const adapter of this.adapters) {
      try {
        const response = await api.get(adapter.targetUrl, { responseType: 'text' });
        const html = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
        const parsed = adapter.parse(html);
        totalSynced += parsed.length;
        allEntities.push(...parsed);
      } catch (err: any) {
        const errorMsg = `[SyncEngine] Adapter ${adapter.adapterName} failed: ${err?.message || 'Unknown network error'}`;
        console.warn(errorMsg);
        errors.push(errorMsg);
      }
    }

    if (allEntities.length > 0) {
      setItem('synced_content_entities', allEntities);
      setItem('last_sync_time', new Date().toISOString());
    }

    return {
      lastSyncTimestamp: new Date().toISOString(),
      totalEntitiesSynced: totalSynced,
      adaptersCount: this.adapters.length,
      errors,
    };
  }

  public getCachedEntities(entityType?: ContentEntity['entityType']): Partial<ContentEntity>[] {
    const cached = getItem<Partial<ContentEntity>[]>('synced_content_entities') || [];
    if (!entityType) return cached;
    return cached.filter((item) => item.entityType === entityType);
  }
}

export const syncEngine = new SyncEngine();
