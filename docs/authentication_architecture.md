# Enterprise Authentication & Security Architecture
## Multi-Factor, Biometric, OAuth SSO & Session Management Specification
**Author**: Principal Security & Backend Architect (Vijay Mahes)  
**Version**: 1.0.0  

---

## 1. Enterprise Security Overview

The **Gandhigram Rural Institute (GRI)** mobile and web platform implements a defense-in-depth security model featuring:

- **OAuth 2.0 / OpenID Connect (OIDC)**: Single Sign-On (SSO) with **Google Workspace** & **Microsoft Entra ID / Azure AD**.
- **Multi-Factor Authentication (MFA)**: TOTP (Google Authenticator / Authy) + 6-digit SMS / Email OTP verification.
- **Biometric Local Authentication**: Native Face ID / Touch ID / Android Fingerprint unlock with hardware key storage.
- **Hardware & Device Binding**: Dynamic device fingerprinting (`device_hash`) to prevent token hijacking.
- **Token Management**: Short-lived JWT Access Tokens (24h) + Refresh Token Rotation with Redis blacklisting.
- **Role-Based Access Control (RBAC)**: Fine-grained scope checks (`student`, `faculty`, `parent`, `admin`, `warden`).
- **Audit Logging**: Immutable security audit trail logged to centralized monitoring.

---

## 2. Authentication Flow Diagram

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Mobile as Flutter App
    participant LocalAuth as Device Biometrics
    participant API as FastAPI Gateway
    participant Provider as Google/Microsoft SSO
    participant DB as PostgreSQL / Redis

    alt Biometric Local Unlock
        User->>Mobile: Touch ID / Face ID scan
        Mobile->>LocalAuth: Verify Biometric Prompt
        LocalAuth-->>Mobile: Hardware Verified (Device Hash Valid)
        Mobile->>API: GET /api/v1/auth/session (Bearer Token)
        API-->>Mobile: 200 OK (Session Active)
    else OAuth 2.0 SSO Flow
        User->>Mobile: Tap "Login with Google / Microsoft"
        Mobile->>Provider: Request Authorization Code
        Provider-->>Mobile: Return ID Token & Access Token
        Mobile->>API: POST /api/v1/oauth/sso (ID Token)
        API->>DB: Verify User & Check MFA Enabled?
        alt MFA Enabled
            API-->>Mobile: 200 OK (mfa_required: true, mfa_ticket)
            User->>Mobile: Enter TOTP Authenticator Code
            Mobile->>API: POST /api/v1/oauth/verify-mfa
        end
        API->>DB: Generate JWT Access & Refresh Token Pair
        API-->>Mobile: Return Bearer Tokens & User Profile
    end
```

---

## 3. RBAC Permission Matrix

| Role | Access Permissions |
|---|---|
| `student` | Read own grades, pay fees, view attendance, request hostel out-pass, query RAG AI Assistant |
| `faculty` | Mark classroom attendance, grade internal assignments, upload course material, view student roster |
| `parent` | View child attendance & grades, approve/reject hostel out-pass requests, pay tuition fees |
| `warden` | Manage hostel rooms, approve final gate passes, monitor night out-pass logs |
| `admin` | Full system access, manage user roles, audit security logs, configure feature flags |

---
*End of Enterprise Authentication Architecture Specification.*
