# API Guidelines

## REST Conventions

- `GET /api/{resource}` — list or search
- `GET /api/{resource}/{id}` — get by ID
- `POST /api/{resource}` — create
- `PUT /api/{resource}/{id}` — full update
- `DELETE /api/{resource}/{id}` — delete

Resource names are plural nouns in kebab-case (e.g. `/api/challenge-runs`, `/api/post-photos`).

No API versioning. All endpoints are under `/api/`. Versioning can be introduced if a public API is ever exposed.

---

## Response Format

All responses are wrapped in a `Result` object:

```json
{
  "flag": true,
  "code": 200,
  "message": "Find All Success",
  "data": {}
}
```

Fields:

- `flag` — `true` for success, `false` for failure
- `code` — application-level status code (see Status Codes below)
- `message` — human-readable response message
- `data` — response payload (object, array, or null)

---

## JSON Naming

All JSON field names use **camelCase**. This matches the convention of the primary receiving system (Vue / JavaScript) and aligns with Spring Boot's default Jackson serialization behavior.

---

## Status Codes

| Code | Constant | Meaning |
|---|---|---|
| 200 | SUCCESS | Request succeeded |
| 400 | INVALID_ARGUMENT | Bad request (e.g. invalid params) |
| 401 | UNAUTHORIZED | Authentication failed |
| 403 | FORBIDDEN | No permission |
| 404 | NOT_FOUND | Resource not found |
| 409 | CONFLICT | Resource already exists |
| 423 | LOCKED | Resource is locked |
| 500 | INTERNAL_SERVER_ERROR | Server internal error |

---

## Error Handling

- Use `@RestControllerAdvice` to handle exceptions globally
- All exceptions must be caught and returned as `Result` objects
- Never let raw stack traces reach the client

Example error response:

```json
{
  "flag": false,
  "code": 404,
  "message": "Sim not found with id 42",
  "data": null
}
```

---

## Pagination

Use Spring Data's `Pageable` and `Page` for paginated endpoints.

- Clients pass pagination parameters as query params: `?page=0&size=10&sort=createdAt,desc`
- The `data` field in the `Result` contains the `Page` object:

```json
{
  "flag": true,
  "code": 200,
  "message": "Find All Success",
  "data": {
    "content": [],
    "totalElements": 50,
    "totalPages": 5,
    "number": 0,
    "size": 10
  }
}
```

---

## Authentication

This project uses session-based authentication via Spring Security.

### Browser clients (Vue frontend)

**Login:**
```
POST /api/auth/login
Content-Type: application/json

{
  "username": "simmer99",
  "password": "hunter2"
}
```

On success, Spring Security creates a server-side session and sets a session cookie in the response. The browser sends this cookie automatically with every subsequent request — no manual token handling required.

**Logout:**
```
POST /api/auth/logout
```

Invalidates the session server-side. The session cookie is cleared.

### Mod bridge (Python client)

The mod bridge cannot participate in browser-based session auth. It authenticates using a **user-scoped API key** passed in a request header:

```
X-API-Key: <api-key>
```

API keys are generated per user and stored in the database. The mod bridge obtains a key from the user's account settings page and includes it in every request to `/api/sims/import` and `/api/posts`.

Spring Security inspects the `X-API-Key` header on requests that include it and authenticates the request as the associated user. All access rules apply equally — the API key grants no elevated permissions.
