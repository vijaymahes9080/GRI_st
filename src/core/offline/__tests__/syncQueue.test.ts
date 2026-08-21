import { getSyncQueue, enqueueOfflineAction } from '../syncQueue';

jest.mock('../../storage', () => {
  let mockStore: Record<string, any> = {};
  return {
    getItem: (key: string) => mockStore[key] || null,
    setItem: (key: string, val: any) => { mockStore[key] = val; },
    removeItem: (key: string) => { delete mockStore[key]; },
    storage: {
      getString: () => null,
      set: () => {},
      delete: () => {},
    },
    storageKeys: {},
  };
});

describe('Offline Sync Queue', () => {
  it('enqueues offline item correctly', () => {
    enqueueOfflineAction('/academics/attendance/ble', 'POST', { beaconId: 'BEACON-01' });

    const queue = getSyncQueue();
    expect(queue.length).toBe(1);
    expect(queue[0].endpoint).toBe('/academics/attendance/ble');
    expect(queue[0].payload.beaconId).toBe('BEACON-01');
  });
});
