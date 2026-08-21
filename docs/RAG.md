# Enterprise Specification: RAG AI Knowledge Assistant System

## 1. System Overview
The AI assistant connects to a Python FastAPI backend powering a **Retrieval-Augmented Generation (RAG)** pipeline trained on GRI university statutes, syllabi, and hostel regulations with bilingual (Tamil & English) support.

---

## 2. React Native Query Hook for AI Chat (`useAiChat`)

```typescript
import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@core/api';

interface ChatPayload {
  message: string;
  language: 'en' | 'ta';
}

export const useAiChat = () => {
  return useMutation({
    mutationFn: async (payload: ChatPayload) => {
      const response = await apiClient.post('/ai/query', payload);
      return response.data.data;
    },
  });
};
```
