import { Platform } from 'react-native';
import { useAppStore } from '../store/appStore';

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
  public static async captureCrash(error: Error, errorInfo?: { componentStack?: string }, moduleName: string = 'MobileView') {
    try {
      const platformOS = Platform.OS;
      const deviceInfo = `RN Platform: ${platformOS}, Version: ${Platform.Version || 'unknown'}, UserAgent: ${typeof navigator !== 'undefined' ? navigator.userAgent : 'native'}`;
      
      const crashDetails: MobileCrashReport = {
        errorName: error.name || 'ReactRuntimeError',
        errorMessage: error.message || 'Content load failure',
        stackTrace: error.stack,
        componentStack: errorInfo?.componentStack,
        moduleName,
        platformOS,
        timestamp: new Date().toISOString(),
        deviceInfo,
      };

      console.error(`[ErrorTracker] Captured Mobile Crash in [${moduleName}]:`, error);

      // Send to Admin Audit Log via appStore
      const store = useAppStore.getState();
      if (store && store.logAdminAction) {
        await store.logAdminAction(
          'CRASH',
          'SYSTEM',
          `crash-${Date.now()}`,
          `Mobile Crash: ${moduleName} (${platformOS})`,
          JSON.stringify({
            message: error.message,
            module: moduleName,
            platform: platformOS,
            stack: error.stack?.slice(0, 300),
            componentStack: errorInfo?.componentStack?.slice(0, 300),
          })
        );
      }

      // Also persist to local error history backup
      const existing = localStorage.getItem('gri_mobile_crash_logs');
      const logs = existing ? JSON.parse(existing) : [];
      logs.unshift(crashDetails);
      if (logs.length > 50) logs.pop();
      localStorage.setItem('gri_mobile_crash_logs', JSON.stringify(logs));

      return crashDetails;
    } catch (err) {
      console.error('[ErrorTracker] Failed to record crash log:', err);
    }
  }

  public static getStoredCrashLogs(): MobileCrashReport[] {
    try {
      const existing = localStorage.getItem('gri_mobile_crash_logs');
      return existing ? JSON.parse(existing) : [];
    } catch {
      return [];
    }
  }
}
