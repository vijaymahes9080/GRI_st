# Enterprise Specification: Analytics & User Telemetry

## 1. Analytics Hook Architecture
The app exports a unified telemetry hook (`useAnalytics`) that dispatches privacy-compliant events without student PII.

```typescript
export const useAnalytics = () => {
  const trackEvent = (eventName: string, properties?: Record<string, any>) => {
    // Log event to PostHog / Firebase Analytics
    console.log(`[Analytics] ${eventName}`, properties);
  };

  return { trackEvent };
};
```
