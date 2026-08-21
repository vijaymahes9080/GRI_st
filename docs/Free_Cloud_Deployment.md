# ☁️ GRI One — Free Cloud Deployment Architecture

This document specifies the zero-cost, high-availability production cloud infrastructure for **GRI One — Gandhigram Rural Institute Unified Digital University Application**.

---

## 🛠️ Free Cloud Stack Overview

| Service | Purpose | Plan / Tier | Integration Point |
|---|---|:---:|---|
| **GitHub** | Source Code & Version Control | Free Public/Private Repo | `github.com/vijaymahes9080/GRI` |
| **GitHub Actions** | Automated CI/CD Pipeline | 2,000 Free Build Mins/mo | `.github/workflows/deploy_free_stack.yml` |
| **Cloudflare** | DNS Routing, SSL & Global CDN | Free Tier | DNS CNAMEs & DDoS Protection |
| **Supabase** | PostgreSQL Database + Auth + Storage | Free Tier (500MB DB, 1GB Storage) | `database/schema.sql` (9 Schemas + pgvector) |
| **Railway** | FastAPI Backend Microservices | $5 Free Monthly Credit | `backend/Dockerfile` + `railway.json` |
| **Firebase** | FCM Push Notification Engine | Spark Plan (Unlimited Push) | `Expo Notifications` + FCM v1 HTTP API |
| **Vercel** | Admin Web Portal Hosting | Hobby Free Tier | `vercel.json` Static Admin Deployment |
| **Docker** | Microservices Containerization | Multi-stage Dockerfile | `backend/Dockerfile` & `docker-compose.yml` |
| **Uptime Kuma** | Real-time Uptime Monitoring | Self-Hosted / Free Cloud Node | `deploy/monitoring/uptime_kuma_config.json` |

---

## 🏗️ Deployment Architecture Diagram

```
                                  ┌───────────────────────────────────────────┐
                                  │           Cloudflare CDN & DNS            │
                                  │      SSL Encryption & WAF Protection      │
                                  └─────────────────────┬─────────────────────┘
                                                        │
                      ┌─────────────────────────────────┴─────────────────────────────────┐
                      │                                                                   │
           ┌──────────▼──────────┐                                             ┌──────────▼──────────┐
           │   Vercel Hosting    │                                             │   Railway Hosting   │
           │  (Admin Web Portal) │                                             │  (FastAPI Backend)  │
           └─────────────────────┘                                             └──────────┬──────────┘
                                                                                          │
                                            ┌─────────────────────────────────────────────┼─────────────────────────────────────────────┐
                                            │                                             │                                             │
                                 ┌──────────▼──────────┐                       ┌──────────▼──────────┐                       ┌──────────▼──────────┐
                                 │   Supabase Cloud    │                       │  Firebase FCM Engine│                       │ Uptime Kuma Monitor │
                                 │ (PostgreSQL+Vector) │                       │ (Push Notifications)│                       │ (Uptime Health Check)│
                                 └─────────────────────┘                       └─────────────────────┘                       └─────────────────────┘
```

---

## ⚙️ Step-by-Step Setup Guide

### 1. Database & Storage: Supabase / Online PostgreSQL Setup
1. Create a free project at [supabase.com](https://supabase.com) or [railway.app](https://railway.app).
2. Execute the 3 PostgreSQL database schema scripts in order:
   - `database/schema.sql` (Initializes core schemas `core`, `academic`, `exam`, `campus`, `finance`, `placement`, `research`, `ai`, `infra`).
   - `database/schema_v2_extension.sql` (Adds `core.app_config`, `core.feature_flags`, `core.navigation_nodes`, `content.entities`).
   - `database/schema_auth_extension.sql` (Adds `approval_status`, multi-role seeds, `core.sessions`, `core.audit_log`, `core.staff_profiles`).
3. Copy the PostgreSQL connection URL into your root [`.env`](file:///d:/current%20project/GRI/.env) file:
   ```env
   DATABASE_URL="postgresql://postgres:YOUR_SUPABASE_PASSWORD@db.YOUR_PROJECT.supabase.co:5432/postgres"
   ADMIN_REGISTER_SECRET="GRI_ADMIN_SECRET_2026_CHANGE_ME"
   ```

### 2. Backend Microservices: Railway Setup
1. Link your GitHub repository at [railway.app](https://railway.app).
2. Configure build strategy to **Dockerfile** using `backend/Dockerfile`.
3. Set Environment Variables (`DATABASE_URL`, `REDIS_HOST`, `SECRET_KEY`, `ADMIN_REGISTER_SECRET`).
4. Railway will automatically build and expose `https://api.ruraluniv-app.railway.app`.

### 3. Web Admin Dashboard: Vercel Setup
1. Import repository on [vercel.com](https://vercel.com).
2. Set Root Directory to `admin/`.
3. Vercel automatically deploys the static Admin Control Panel UI.
