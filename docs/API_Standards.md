# Enterprise Specification: API Standards & Axios Integration

## 1. Axios Client Setup (`@core/api`)
The application consumes microservices through a central **Axios instance** configured with timeout limits, default headers, and token refresh interceptors.

```typescript
import axios from 'axios';
import { mmkvStorage } from '@core/storage';

export const apiClient = axios.create({
  baseURL: 'https://api.ruraluniv.ac.in/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = mmkvStorage.getString('jwt_access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## 2. Standard Unified API Response Envelope

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Timetable retrieved successfully",
  "data": {
    "studentId": "GRI-2024-8841",
    "semester": 4,
    "schedule": []
  },
  "error": null,
  "meta": {
    "timestamp": "2026-08-07T17:45:00Z",
    "requestId": "req_8841a029f",
    "version": "v1"
  }
}
```
