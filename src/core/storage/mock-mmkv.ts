export class MMKV {
  constructor() {}
  set(key: string, value: string | number | boolean) {
    if (typeof window !== 'undefined') window.localStorage.setItem(key, String(value));
  }
  getString(key: string) {
    if (typeof window !== 'undefined') return window.localStorage.getItem(key) || undefined;
    return undefined;
  }
  getNumber(key: string) {
    if (typeof window !== 'undefined') {
      const val = window.localStorage.getItem(key);
      return val ? Number(val) : undefined;
    }
    return undefined;
  }
  getBoolean(key: string) {
    if (typeof window !== 'undefined') {
      const val = window.localStorage.getItem(key);
      return val === 'true';
    }
    return undefined;
  }
  delete(key: string) {
    if (typeof window !== 'undefined') window.localStorage.removeItem(key);
  }
  clearAll() {
    if (typeof window !== 'undefined') window.localStorage.clear();
  }
}
