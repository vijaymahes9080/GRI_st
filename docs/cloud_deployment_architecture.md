# FOSS & Open-Source Cloud Deployment Architecture
## Zero-Cost Infrastructure via Coolify, Supabase, Cloudflare, MinIO & Firebase
**Author**: Cloud & Infrastructure Architect (Vijay Mahes)  
**Version**: 1.0.0  

---

## 1. Free & Open-Source Infrastructure Map

The **GRI Digital Ecosystem** is designed to run entirely on **Free and Open-Source Software (FOSS)** and free-tier infrastructure without cloud vendor lock-in:

```mermaid
flowchart TD
    User[App / Web Users] --> Cloudflare[Cloudflare DNS & Free Global CDN / DDoS Shield]
    
    Cloudflare --> FirebaseHosting[Firebase Hosting (Flutter Web - Free Tier)]
    Cloudflare --> CoolifyPaaS[Coolify Self-Hosted PaaS (Hetzner / Oracle Cloud Free VPS)]
    
    subgraph Coolify Open-Source Server Node
        CoolifyPaaS --> NginxProxy[NGINX Gateway]
        NginxProxy --> FastAPIApp[FastAPI Backend Containers]
        
        FastAPIApp --> SupabaseDB[(PostgreSQL 16 / Supabase DB)]
        FastAPIApp --> RedisCache[(Redis Cache)]
        FastAPIApp --> MinIOStore[(MinIO S3 Object Storage)]
        
        FastAPIApp --> PromServer[Prometheus Metrics]
        PromServer --> GrafanaDash[Grafana Dashboard :3000]
    end
    
    FastAPIApp --> FCM[Firebase Cloud Messaging (FCM Push - Free)]
```

---

## 2. Infrastructure Component Matrix

| Infrastructure Role | Selected FOSS Tool | Free Tier / Self-Hosted Specs | Cost Model |
|---|---|---|---|
| **PaaS / App Orchestration** | **Coolify** (Open-Source Heroku) | Unlimited Apps & DBs on single VPS | **$0 / month** (Self-hosted) |
| **Edge CDN & DNS** | **Cloudflare** | SSL/TLS, DDoS Protection, Global Edge Caching | **$0 / month** (Free Plan) |
| **Relational Database** | **Supabase / PostgreSQL 16** | 500MB DB storage + pgvector extension | **$0 / month** (Free / Self-hosted) |
| **Object Storage (S3)** | **MinIO** | Self-hosted S3 API for documents & photos | **$0 / month** (Self-hosted) |
| **Web Hosting** | **Firebase Hosting** | 10 GB storage + 360 MB/day transfer | **$0 / month** (Free Spark Plan) |
| **Push Notifications** | **Firebase FCM** | Unlimited push notifications | **$0 / month** (Free) |
| **Cache & Sessions** | **Redis 7 (Alpine)** | In-memory key-value cache | **$0 / month** (Self-hosted) |
| **Observability** | **Prometheus + Grafana** | HTTP metrics, latency, CPU/RAM charts | **$0 / month** (Self-hosted) |

---
*End of GRI FOSS Deployment Architecture Specification.*
