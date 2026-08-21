# Enterprise Cyber Security & Compliance Architecture
## OWASP Top 10 Mitigation, WAF, Encryption, Certificate Pinning & DPDP Compliance
**Author**: Chief Information Security Officer (CISO) (Vijay Mahes)  
**Version**: 1.0.0  

---

## 1. System Security Overview & OWASP Top 10 Mitigations

The **Gandhigram Rural Institute (GRI)** digital ecosystem enforces defense-in-depth cybersecurity across all architectural layers:

```mermaid
flowchart TD
    Client[Flutter App (Certificate Pinning)] --> WAF[Cloudflare / NGINX WAF]
    WAF --> SecurityMiddleware[FastAPI Security & Rate Limiting Middleware]
    
    SecurityMiddleware --> RBAC[Role-Based Access Control]
    RBAC --> KMS[AWS KMS / HashiCorp Vault]
    
    RBAC --> DB[(PostgreSQL 16 - AES-256 Encrypted at Rest)]
    
    SecurityMiddleware --> AuditLog[Immutable Security Audit Log]
```

| OWASP Threat (2025/2026) | Mitigation Strategy Implemented |
|---|---|
| **A01: Broken Access Control** | Scoped JWT tokens + PostgreSQL Row-Level Security (RLS) + RBAC middleware. |
| **A02: Cryptographic Failures** | E2E TLS 1.3 in transit, AES-256-GCM for sensitive fields (Aadhar, passwords). |
| **A03: Injection (SQL / XSS)** | SQLAlchemy parameterized queries + regex input sanitization middleware. |
| **A04: Insecure Design** | STRIDE threat modeling & automated security pipeline scanning (Bandit, Snyk). |
| **A05: Security Misconfiguration** | Strict Security Headers (HSTS, CSP, X-Frame-Options: DENY) + CORS restrict. |
| **A07: Identification & Auth** | OAuth 2.0 / OIDC + TOTP MFA + Biometric device binding + Refresh Token rotation. |
| **A08: Software & Data Integrity** | SHA-256 package checksum verification + signed GitHub Actions CI/CD builds. |
| **A09: Logging & Monitoring** | Prometheus metrics + Centralized Audit Logger + Sentry exception tracking. |
| **A10: Server-Side Request Forgery** | Egress whitelist proxy for external API integrations (Samarth ERP, Payment Gateway). |

---

## 2. Certificate Pinning & Key Management

### 2.1 SSL / TLS Certificate Pinning (Flutter App)
To mitigate Man-In-The-Middle (MITM) attacks on public Wi-Fi networks:
- Flutter Dio client pins the SHA-256 public key hash of `api.ruraluniv.ac.in`.
- Any proxy interception (e.g. Charles / Burp Suite) triggers an immediate app connection abort.

### 2.2 Key & Secrets Management
- All production API keys, DB passwords, and JWT secret keys are managed via **HashiCorp Vault / AWS Secrets Manager**.
- Hardcoded secrets in source code are strictly prevented via `git-secrets` & `trufflehog` pre-commit hooks.

---

## 3. Disaster Recovery & Backup Strategy

- **Recovery Point Objective (RPO)**: `< 5 minutes` (WAL streaming replication to S3 bucket).
- **Recovery Time Objective (RTO)**: `< 15 minutes` (Automated failover to secondary cloud availability zone).
- **Backups**: Daily full PostgreSQL snapshots with 30-day retention; hourly incremental WAL archives.

---

## 4. Privacy & Regulatory Compliance

- **Indian Digital Personal Data Protection (DPDP) Act, 2023**:
  - Right to Access & Erase Personal Data (Soft delete + automated purge workflow).
  - Explicit user consent prompts for geolocation and biometric access.
  - Data localization: All student data hosted exclusively in Indian AWS / GCP data centers (Mumbai / Hyderabad).

---
*End of GRI Security Architecture Specification.*
