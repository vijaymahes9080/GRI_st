# Enterprise Specification: Security Architecture & OWASP Compliance

## 1. Android OWASP Mobile Security
- **ProGuard / R8 Obfuscation**: Enabled in `android/app/build.gradle` to obfuscate JavaScript bundle and native Java/Kotlin code.
- **Root Detection**: Integrates root check utilities to disable payment features on compromised devices.
- **SSL Certificate Pinning**: Enforces SHA-256 SSL certificate pinning inside Axios network layer.
- **Secure Encrypted Key-Value Store**: Sensitive user credentials are stored using **MMKV** encrypted via Android Keystore.

## 2. Backend Security & WAF Middleware (FastAPI)
- **Bcrypt Password Hashing**: Authentications verify password hashes (`verify_password`) using bcrypt to prevent credential exposure.
- **Rate Limiting & Memory Protection**: `RateLimiterWAFMiddleware` enforces 100 requests/minute per IP with automatic stale key eviction to eliminate memory leaks. Returns standard HTTP 429 JSON responses.
- **OWASP Security Headers**: Automatic injection of HSTS, CSP, X-Frame-Options: DENY, X-Content-Type-Options: nosniff, and Referrer Policy headers.
- **File Upload Limits**: File processing endpoints enforce a 10 MB file size cap (`MAX_FILE_SIZE_BYTES`) to prevent Denial of Service memory exhaustion.
- **AI RAG Prompt Guardrails**: AI query inputs are sanitized via `sanitize_rag_prompt()` and bounded in execution templates (`<<<...>>>`) to prevent prompt injection attacks.
