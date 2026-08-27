import { useAppStore } from '../store/appStore';

const platformOS = typeof window !== 'undefined' ? 'web' : 'server';

export interface MobileCrashReport {
  errorName: string;
  errorMessage: string;
  stackTrace?: string;
  componentStack?: string;
  moduleName: string;
  platformOS: string;
  timestamp: string;
  deviceInfo: string;
}

export class ErrorTracker {
  public static async captureCrash(error: Error, errorInfo?: { componentStack?: string }, moduleName = 'MobileView') {
    try {
      const deviceInfo = `Platform: ${platformOS}, UserAgent: ${typeof navigator !== 'undefined' ? navigator.userAgent : 'node'}`;
      
      const crashDetails: MobileCrashReport = {
        errorName: error?.name || 'ReactRuntimeError',
        errorMessage: error?.message || 'Content load failure',
        stackTrace: error?.stack,
        componentStack: errorInfo?.componentStack,
        moduleName,
        platformOS,
        timestamp: new Date().toISOString(),
        deviceInfo,
      };

      console.warn(`[ErrorTracker] Captured Crash in [${moduleName}]:`, error);

      // Send to Admin Audit Log via appStore
      try {
        const store = useAppStore.getState();
        if (store && store.logAdminAction) {
          await store.logAdminAction(
            'CRASH',
            'SYSTEM',
            `crash-${Date.now()}`,
            `App Crash: ${moduleName} (${platformOS})`,
            JSON.stringify({
              message: error?.message || 'Unknown',
              module: moduleName,
              platform: platformOS,
              stack: error?.stack?.slice(0, 300),
              componentStack: errorInfo?.componentStack?.slice(0, 300),
            })
          );
        }
      } catch {}

      // Also persist to local error history backup
      try {
        const existing = typeof localStorage !== 'undefined' ? localStorage.getItem('gri_mobile_crash_logs') : null;
        const logs = existing ? JSON.parse(existing) : [];
        logs.unshift(crashDetails);
        if (logs.length > 50) logs.pop();
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('gri_mobile_crash_logs', JSON.stringify(logs));
        }
      } catch {}

      return crashDetails;
    } catch (err) {
      console.warn('[ErrorTracker] Failed to record crash log:', err);
    }
  }

  public static getStoredCrashLogs(): MobileCrashReport[] {
    try {
      const existing = typeof localStorage !== 'undefined' ? localStorage.getItem('gri_mobile_crash_logs') : null;
      return existing ? JSON.parse(existing) : [];
    } catch {
      return [];
    }
  }
}


