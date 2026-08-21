# Enterprise Specification: Backend Architecture & Axios Client Integration

## 1. Microservice Ecosystem Overview
The React Native client communicates with backend Node.js / Python microservices orchestrated behind a **Kong API Gateway**.

```
                                  ┌───────────────────────────┐
                                  │      Kong API Gateway     │
                                  │ (Rate Limit · Auth · Logs)│
                                  └─────────────┬─────────────┘
                                                │
         ┌────────────────────────┬─────────────┴─────────────┬────────────────────────┐
         │                        │                           │                        │
┌────────▼─────────┐    ┌─────────▼────────┐        ┌─────────▼────────┐     ┌──────────▼───────────┐
│ Academic Service │    │ ERP Bridge Svc   │        │ Finance Gateway  │     │ AI RAG Microservice  │
│ (Node.js/TS)     │    │ (Python/FastAPI) │        │ (Node.js/TS)     │     │ (Python/FastAPI)     │
└────────┬─────────┘    └─────────┬────────┘        └─────────┬────────┘     └──────────┬───────────┘
         │                        │                           │                         │
┌────────▼────────────────────────▼───────────────────────────▼─────────────────────────▼───────────┐
│                         PostgreSQL 16 Cluster + Redis Cache + PGVector                            │
└───────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Axios Request Retry & Timeout Strategy
- **Client Timeout**: Default 10 seconds per API call.
- **Automatic Retry**: Retries failed GET requests 2 times using exponential backoff before throwing a UI error.
