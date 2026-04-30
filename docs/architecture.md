# Architecture

## Overview

Sims Legacies is deployed as a single server with Nginx acting as a reverse proxy in front of two services: the Spring Boot API and the Vue 3 frontend (served as static files). A Python sidecar process runs alongside and handles mod data imports. Photo assets are stored in Cloudflare R2 object storage.

```
Browser
  └── Nginx (same domain)
        ├── /api/* → Spring Boot (Java)
        │     ├── PostgreSQL (data)
        │     ├── Flyway (migrations)
        │     └── Cloudflare R2 (photo uploads)
        └── /* → Vue 3 (static build)

Python mod bridge (sidecar)
  └── watches exported JSON file → POST /api/sims/import → Spring Boot
```

---

## Components

### Nginx (Reverse Proxy)
Sits in front of all traffic on the server. Routes requests by path:
- `/api/*` — proxied to the Spring Boot application
- everything else — served from the Vue 3 static build

This keeps the frontend and backend on the same domain, eliminating CORS configuration.

### Spring Boot (Backend API)
The core of the application. Responsible for:
- All business logic
- REST endpoints consumed by the Vue frontend and Python mod bridge
- Session-based authentication via Spring Security
- Database access via PostgreSQL
- Photo upload handling — receives files, uploads to Cloudflare R2, stores the resulting URL in the database

### PostgreSQL (Database)
Primary data store. Managed by Flyway migrations. Stores all application data including user accounts, Sim character sheets, households, diary entries, life events, challenge runs, and photo URLs.

### Flyway (Migrations)
Manages the PostgreSQL schema via versioned SQL migration scripts. Migrations are applied automatically on Spring Boot startup. Scripts are version-controlled alongside the application code.

### Vue 3 (Frontend)
Single-page application served as a static build. Communicates with Spring Boot exclusively via HTTP requests to `/api/*`. Handles all UI rendering, routing, and state management client-side.

### Cloudflare R2 (Photo Storage)
Object storage for user-uploaded photos (Sim character sheets, diary entries, life events). Spring Boot handles upload requests, transfers files to R2, and persists the public URL in PostgreSQL. R2 serves photos directly to the browser. Chosen for its free egress — users are not charged for viewing photos.

### Python Mod Bridge (Sidecar)
A separate Python process that runs alongside the main application. Watches a local directory for JSON files exported by the Sims 4 mod. When a new file is detected, it POSTs the data to `/api/sims/import` on the Spring Boot API. Handles retries and logs import results.

---

## Data Flow

### User request (standard)
1. Browser sends request to Nginx
2. Nginx routes to Vue static build or Spring Boot API depending on path
3. Spring Boot validates the session, processes the request, queries PostgreSQL
4. Response returned to browser

### Photo upload
1. User selects a photo in the Vue frontend
2. Vue POSTs the file to `/api/upload` on Spring Boot
3. Spring Boot uploads the file to Cloudflare R2
4. Spring Boot stores the R2 URL in PostgreSQL and returns it to the frontend
5. Vue renders the photo via the R2 URL

### Mod import
1. Sims 4 mod exports Sim data as a JSON file to a watched directory
2. Python mod bridge detects the new file
3. Python POSTs the JSON payload to `/api/sims/import`
4. Spring Boot validates and persists the imported Sim data to PostgreSQL
