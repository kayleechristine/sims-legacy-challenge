# Sims Legacies

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-6DB33F?style=flat&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Flyway](https://img.shields.io/badge/Flyway-CC0200?style=flat&logo=flyway&logoColor=white)](https://flywaydb.org/)
[![Vue 3](https://img.shields.io/badge/Vue%203-4FC08D?style=flat&logo=vuedotjs&logoColor=white)](https://vuejs.org/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white)](https://www.python.org/)
[![Cloudflare R2](https://img.shields.io/badge/Cloudflare%20R2-F38020?style=flat&logo=cloudflare&logoColor=white)](https://developers.cloudflare.com/r2/)

A full-stack web app for tracking Sims 4 playthroughs. Players can create Sim character sheets, write posts, and track challenge runs. A public social feed lets users share and discover content. A Python mod bridge allows the Sims 4 game to post data directly to the app.

<div align="center">
<img src="https://media.giphy.com/media/mgEsgpEIBiSXe3Ydak/giphy.gif" align="center" style="width: 100%" />
</div>

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend API | Spring Boot (Java) |
| Database | PostgreSQL |
| Migrations | Flyway |
| Frontend | Vue 3 |
| Auth | Spring Security (session-based) |
| Mod Bridge | Python |
| Hosting | TBD |

---

## Architecture

The app runs on a single server with Nginx as a reverse proxy. Nginx routes `/api/*` traffic to the Spring Boot backend and serves the Vue 3 frontend as a static build. A Python sidecar process watches for Sim data exported by the Sims 4 mod and POSTs it to the Spring Boot API. Photos are stored in Cloudflare R2.

See [docs/architecture.md](docs/architecture.md) for the full architecture diagram and data flow.

---

## Documentation

| Doc | Description |
|---|---|
| [docs/tech-stack.md](docs/tech-stack.md) | Technology choices and rationale |
| [docs/architecture.md](docs/architecture.md) | System architecture and data flows |
| [docs/database-design.md](docs/database-design.md) | Data model, schema, indexes, and design decisions |
| [docs/api-guidelines.md](docs/api-guidelines.md) | REST conventions, response format, auth, and pagination |
| [docs/testing-strategy.md](docs/testing-strategy.md) | Test types, tooling, and coverage guidelines |
| [docs/coding-standards.md](docs/coding-standards.md) | Code style, git conventions, and standing rules |
