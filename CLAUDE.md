# Sims Legacies — Agent Guide

A full-stack web app for tracking Sims 4 playthroughs. Players create Sim character sheets, write posts, and track challenge runs. A public social feed lets users share and discover content. A Python mod bridge allows the Sims 4 game to post data directly to the app.

---

## Reference Docs

All project decisions are documented in [`docs/`](docs/). Read the relevant doc before starting work in that area.

| Doc | When to read |
|---|---|
| [docs/tech-stack.md](docs/tech-stack.md) | Before any implementation work |
| [docs/architecture.md](docs/architecture.md) | Before adding services, routes, or new components |
| [docs/database-design.md](docs/database-design.md) | Before touching the database, writing migrations, or designing queries |
| [docs/api-guidelines.md](docs/api-guidelines.md) | Before adding or modifying any API endpoint |
| [docs/testing-strategy.md](docs/testing-strategy.md) | Before writing any tests |
| [docs/coding-standards.md](docs/coding-standards.md) | Always |

---

## Standing Instructions

- Follow [docs/coding-standards.md](docs/coding-standards.md) at all times
- Never use field injection in Spring Boot — constructor injection only
- Never expose raw stack traces to the client — all exceptions return a `Result` object
- Nothing is exclusive to the mod bridge — every action must also be possible via the web app
- Households and family tree are stretch goals — do not implement until explicitly instructed
