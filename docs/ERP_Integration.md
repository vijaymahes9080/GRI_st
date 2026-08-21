# Enterprise Specification: Legacy ERP Integration Architecture

## 1. ERP Integration Overview
The **ERP Bridge Microservice** exposes sanitized JSON REST endpoints converting legacy university SOAP/XML requests into modern API models consumed via TanStack Query hooks in React Native.

---

## 2. TanStack Query Hook Example for ERP Exam Results

```typescript
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@core/api';

export const useExamResults = (semester: number) => {
  return useQuery({
    queryKey: ['erp', 'results', semester],
    queryFn: async () => {
      const response = await apiClient.get(`/erp/results?semester=${semester}`);
      return response.data.data;
    },
    staleTime: 1000 * 60 * 60 * 24, // Cache for 24 hours
  });
};
```
