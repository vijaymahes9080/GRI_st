# Enterprise Specification: Sentry Error Tracking & APM

## 1. Sentry React Native Android Setup
Sentry captures JavaScript exception stack traces, unhandled native crashes, and Android ANRs (Application Not Responding).

```typescript
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://exampleKey@o0.ingest.sentry.io/0',
  enableAutoSessionTracking: true,
  tracesSampleRate: 0.2,
});
```
