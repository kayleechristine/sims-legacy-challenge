# Tech Stack

## Backend
**Spring Boot (Java)**
Serves as the REST API layer — handles all business logic, database access, and authentication. Exposes JSON endpoints consumed by the Vue frontend and the Python mod bridge.

## Database
**PostgreSQL**
Primary data store. Chosen over MySQL for native JSONB support (used by fields like `traits` and `rules`) and built-in full-text search. Runs locally in development and on a managed host in production.

## Migrations
**Flyway**
SQL-first database migration tool. Migration scripts live in version-controlled `.sql` files and are applied automatically on application startup. Provides a reliable, auditable history of schema changes.

## Frontend
**Vue 3 + Vuetify 3**
Single-page application (SPA) that calls the Spring Boot REST API. Runs as a separate service from the backend. No SSR framework (Nuxt) — SEO is not a priority for this community-facing app. Vuetify 3 serves as the UI component library.

## Authentication
**Spring Security — session-based**
After login, the server creates a session and the browser stores a session cookie. The server validates the session on each request. Chosen over JWT because:
- Logout is immediate and reliable
- No token expiry or refresh logic needed
- Scale requirements do not demand stateless auth

## Mod Bridge
**Python (file-watcher)**
A separate Python process watches for Sim data exported by the Sims 4 mod and POSTs it to the Spring Boot API endpoint `/api/sims/import`. Runs as a sidecar service alongside the main application.

## Hosting
TBD
