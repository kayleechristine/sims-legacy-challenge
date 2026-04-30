# Testing Strategy

## Scope

- Backend only (Spring Boot)
- Frontend testing is not in scope at this time

---

## Test Types

### Unit Tests

- Test individual classes in isolation
- Use JUnit 5 and Mockito
- Mock dependencies (repositories, other services)
- Focus on service layer business logic

### Integration Tests

- Test layers working together with a running Spring context
- Use `@SpringBootTest` for full context tests
- Use `@WebMvcTest` for controller layer tests
- Use Testcontainers to run a real PostgreSQL instance
- Verify end-to-end request/response flow, including JSON structure

---

## Test Database

- Use Testcontainers to spin up a real PostgreSQL container for all integration tests
- Flyway migrations run against the container on startup — the same scripts used in production
- Container is torn down after tests complete
- Configure via `application-test.yml`
- Spring profile: `test`
- Do not use `spring.jpa.hibernate.ddl-auto` — schema is managed exclusively by Flyway

**Why not H2:** This project uses PostgreSQL-specific features (JSONB columns, TIMESTAMPTZ) that H2 cannot emulate. Using a real PostgreSQL instance ensures tests run against the same database engine as production.

**Requirements:** Docker must be available in the local development environment and CI pipeline.

---

## What to Test

| Layer | Test Type | What to Verify |
|---|---|---|
| Service | Unit | Business logic, validation, edge cases, exceptions |
| Repository | Integration | Custom queries, data persistence |
| Controller | Integration | Request mapping, response format, status codes |

---

## Naming Convention

- Test class: `{ClassName}Test` for unit tests, `{ClassName}IntegrationTest` for integration tests
- Test method: `should_ExpectedResult_When_Condition`
- Example: `should_ThrowNotFoundException_When_UserIdNotFound`

---

## Coverage Guidelines

- Service layer: aim for high coverage (business logic is the priority)
- Controller layer: cover happy path and key error scenarios
- Repository layer: cover custom query methods only (skip standard CRUD)

---

## Running Tests

```bash
./mvnw test
```
