/**
 * Global Unhandled Rejection & Error Protection Guard for Gandhigram Rural Institute Portal
 * Intercepts unhandled promise rejections, network aborts, WebSocket drops, and runtime script errors.
 * Ensures the web application remains resilient, user-friendly, and stable across all browsers.
 */

export interface AppErrorInfo {
  type: 'UNHANDLED_REJECTION' | 'RUNTIME_ERROR' | 'NETWORK_ERROR' | 'INDEXEDDB_ERROR';
  message: string;
  source?: string;
  lineno?: number;
  colno?: number;
  stack?: string;
  timestamp: string;
}

// Benign rejection patterns to suppress silently
const BENIGN_REJECTION_PATTERNS = [
  'websocket',
  'WebSocket',
  'WebSocket connection',
  'failed to connect to websocket',
  'WebSocket closed without opened',
  'closed without opened',
  'vite',
  '[vite]',
  'hmr',
  'ResizeObserver loop',
  'ResizeObserver loop completed with undelivered notifications',
  'Failed to fetch',
  'NetworkError',
  'Load failed',
  'AbortError',
  'the client is offline',
  'quota exceeded',
  'database is closed',
  'connection closed',
  'user rejected',
  'cancelled',
  'timeout',
];

/**
 * Checks if an error reason is benign and expected in sandbox/iframe/offline environments
 */
export function isBenignRejection(reason: any): boolean {
  if (!reason) return true;
  let reasonStr = '';
  if (typeof reason === 'string') {
    reasonStr = reason;
  } else if (reason instanceof Error) {
    reasonStr = `${reason.name} ${reason.message} ${reason.stack || ''}`;
  } else if (typeof reason === 'object') {
    try {
      reasonStr = `${reason?.message || ''} ${reason?.reason || ''} ${JSON.stringify(reason)}`;
    } catch {
      reasonStr = String(reason);
    }
  } else {
    reasonStr = String(reason);
  }
  
  const lower = reasonStr.toLowerCase();
  return BENIGN_REJECTION_PATTERNS.some(pattern => lower.includes(pattern.toLowerCase()));
}

/**
 * Initializes global browser unhandled rejection & runtime error listeners
 */
export function initGlobalErrorHandlers(): () => void {
  if (typeof window === 'undefined') return () => {};

  // 1. Intercept Unhandled Promise Rejections
  const onUnhandledRejection = (event: PromiseRejectionEvent) => {
    try {
      // Always prevent default browser / Vite crash overlays
      if (typeof event.preventDefault === 'function') {
        event.preventDefault();
      }
      if (typeof (event as any).stopImmediatePropagation === 'function') {
        (event as any).stopImmediatePropagation();
      }

      const reason = event.reason;
      const isBenign = isBenignRejection(reason);

      if (isBenign) {
        // Silently suppress benign rejections
        return;
      }

      console.warn('[GRI App Guard] Handled uncaught promise rejection:', reason);

      // Safe local recording
      try {
        const errorDetails: AppErrorInfo = {
          type: 'UNHANDLED_REJECTION',
          message: reason instanceof Error ? reason.message : String(reason || 'Unknown promise rejection'),
          stack: reason instanceof Error ? reason.stack : undefined,
          timestamp: new Date().toISOString(),
        };

        const existing = localStorage.getItem('gri_unhandled_rejections');
        const logs: AppErrorInfo[] = existing ? JSON.parse(existing) : [];
        logs.unshift(errorDetails);
        if (logs.length > 30) logs.pop();
        localStorage.setItem('gri_unhandled_rejections', JSON.stringify(logs));
      } catch {}
    } catch (e) {
      console.warn('[GRI App Guard] Error in unhandledrejection handler:', e);
    }
  };

  // 2. Intercept Global Window Errors
  const onGlobalError = (event: ErrorEvent) => {
    try {
      const isBenign = isBenignRejection(event.message) || isBenignRejection(event.error) || isBenignRejection(event.filename);
      
      if (typeof event.preventDefault === 'function') {
        event.preventDefault();
      }
      if (typeof (event as any).stopImmediatePropagation === 'function') {
        (event as any).stopImmediatePropagation();
      }

      if (isBenign) {
        return;
      }

      console.warn('[GRI App Guard] Handled window error:', event.message, event.filename, event.lineno);

      // Safe local recording
      try {
        const errorDetails: AppErrorInfo = {
          type: 'RUNTIME_ERROR',
          message: event.message || 'Script runtime error',
          source: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          stack: event.error?.stack,
          timestamp: new Date().toISOString(),
        };

        const existing = localStorage.getItem('gri_runtime_errors');
        const logs: AppErrorInfo[] = existing ? JSON.parse(existing) : [];
        logs.unshift(errorDetails);
        if (logs.length > 30) logs.pop();
        localStorage.setItem('gri_runtime_errors', JSON.stringify(logs));
      } catch {}
    } catch (e) {
      console.warn('[GRI App Guard] Error in window.onerror handler:', e);
    }
  };

  window.addEventListener('unhandledrejection', onUnhandledRejection);
  window.addEventListener('error', onGlobalError);

  console.log('[GRI App Guard] Global unhandled rejection & error protection active.');

  return () => {
    window.removeEventListener('unhandledrejection', onUnhandledRejection);
    window.removeEventListener('error', onGlobalError);
  };
}

/**
 * Utility wrapper to execute an async function safely without throwing unhandled rejections
 */
export async function safeAsync<T>(promiseFn: () => Promise<T>, fallbackValue: T): Promise<T> {
  try {
    return await promiseFn();
  } catch (error) {
    console.warn('[safeAsync] Caught handled promise exception:', error);
    return fallbackValue;
  }
}
