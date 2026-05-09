# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Bun Todo API** is a RESTful todo application backend built with:
- **Runtime**: Bun (TypeScript-first)
- **Framework**: Express.js
- **Database**: SQLite (via `bun:sqlite` native binding, no ORM)
- **Validation**: Zod v4
- **Authentication**: HTTP-only cookie sessions

The codebase follows **Clean Architecture** principles with layered separation: controllers → services → repositories, plus interface-based contracts for dependency inversion (SOLID - DIP).

---

## Quick Start Commands

```bash
# Development (with file watch)
bun run dev

# Build for production
bun run build

# Run production build
bun run start

# Database initialization (run this first)
bun run db:init

# Run migrations manually
bun run db:migrate

# Run all tests
bun test

# Run tests in watch mode
bun test --watch

# Type checking (no emit)
bunx tsc --noEmit
```

The API runs on `http://localhost:3000` by default (configurable via `PORT` env var).

---

## Architecture Overview

### Layered Structure

```
Controllers
  ↓ (coordinate HTTP, validation, delegate to)
Services
  ↓ (business logic, delegate persistence to)
Repositories (implement contracts via SQLite)
  ↓
Database (bun:sqlite)
```

### Key Directories

- **`src/controllers/`**: HTTP handlers (auth & todo). Parse/validate request body, call use-cases, send response.
- **`src/use-cases/auth/`**: One class per auth operation (`RegisterUseCase`, `LoginUseCase`, `LogoutUseCase`, `GetSessionUserUseCase`). Shared session helpers in `session.helper.ts`.
- **`src/use-cases/todo/`**: One class per todo operation (`CreateTodoUseCase`, `ListTodosUseCase`, `UpdateTodoStatusUseCase`, `DeleteTodoUseCase`).
- **`src/factories/`**: Wire use-cases into controllers (`makeAuthController`, `makeTodoController`, `makeGetSessionUserUseCase`). Swap repositories here when changing persistence layer.
- **`src/repositories/`**: SQLite data access via interfaces (`contracts/`). Raw SQL queries, no query builder.
- **`src/routes/`**: Express route setup via factory functions.
- **`src/middlewares/`**: Auth (validates cookie session via `GetSessionUserUseCase`) and error handling (catches `AppError` & `ZodError`, returns standardized JSON).
- **`src/entities/`**: TypeScript interfaces representing database row shapes.
- **`src/contracts/`**: Repository interfaces (e.g., `IUserRepository`, `ITodoRepository`). Use-cases depend on contracts, not implementations.
- **`src/validations/`**: Zod schemas for input validation (auth register/login, todo create/update).
- **`src/config/`**: Environment configuration with Zod schema validation.
- **`src/types/express/`**: TypeScript declaration extending Express `Request` with `user` and `sessionToken` properties.
- **`migrations/`**: Numbered SQL files (001, 002, 003) for schema versioning.
- **`scripts/`**: Database setup (`init-db.ts` runs migrations; `migrate.ts` executes migration files).

### Key Design Patterns

1. **Use-Case Pattern**: Each operation is its own class with a single `execute()` method. Depends on repository contracts via constructor injection.

2. **Factory Functions**: `src/factories/` creates controllers by composing use-cases with their repository dependencies. To swap persistence (e.g., SQLite → Prisma), only the factory and repository implementation change.

3. **Repository Pattern**: `IUserRepository`, `ITodoRepository`, `ISessionRepository` interfaces isolate data access. Implementations (`SqliteUserRepository`, etc.) handle SQL.

4. **Error Handling**: Custom `AppError` class with `statusCode`, `code`, and optional `details`. Error middleware catches `AppError` + `ZodError` and returns standardized JSON error format.

5. **ID Generation**: 
   - UUIDs v7 for entities (via `uuid` package) → temporal ordering + distributed uniqueness
   - CUID2 for session tokens (via `@paralleldrive/cuid2`) → short, URL-safe tokens

6. **HTTP Response Format**: All responses (success & error) use standardized envelope:
   ```json
   {
     "success": true,
     "message": "...",
     "data": { ... }
   }
   ```

---

## Database & Migrations

**Schema**: Three tables with foreign key constraints enabled (`PRAGMA foreign_keys = ON`).

- **users**: id (TEXT, UUID v7), email (UNIQUE), password_hash, created_at, updated_at
- **sessions**: id, user_id (FK), token (UNIQUE, CUID2), expires_at, created_at
- **todos**: id, user_id (FK), title, description, status (pending|completed), created_at, updated_at, completed_at

**Migration Tracking**: Schema changes recorded in `schema_migrations` table (auto-created). Each migration is run once, in alphabetical order.

To add a new migration:
1. Create `migrations/00X_description.sql`
2. Run `bun run db:migrate` (auto-detects and applies new files)

---

## Authentication & Authorization

**Cookie-based sessions**:
- User registers/logs in → `AuthService` creates session (token stored in DB, expires after `SESSION_TTL_HOURS`)
- Response sets HTTP-only cookie with token
- Subsequent requests validated by `createAuthMiddleware` (reads cookie, looks up valid session, attaches `user` to Express `Request`)
- Protected routes apply auth middleware before controller

**Session validation** happens in `AuthService.getUserBySessionToken()`:
- Rejects invalid/expired tokens
- Returns public user data (id, email, created_at, updated_at — password_hash never sent)

---

## Environment Variables

Defined in `.env` (copy from `.env.example`):
```
NODE_ENV=development     # development|test|production
PORT=3000               # Server port
DATABASE_PATH=./database.sqlite
COOKIE_NAME=session_token
SESSION_TTL_HOURS=24    # Session validity
```

All vars are validated on startup via Zod schema in `src/config/env.ts`. Invalid config stops the server.

---

## Testing

**Framework**: Bun's native test runner (`bun:test`).

**Approach**: Use-cases and controllers tested with mock repositories/responses. No integration tests in the repo yet.

Example test files:
- `tests/use-cases/auth/register.use-case.test.ts` — mocks `IUserRepository` and `ISessionRepository`, tests `useCase.execute()`
- `tests/use-cases/todo/create-todo.use-case.test.ts` — mocks `ITodoRepository`
- `tests/controllers/auth-controller.test.ts` — mocks each use-case individually (`loginUseCase.execute`)

Mock helper: `tests/helpers/http-mocks.ts` provides `createMockResponse()` for controller testing.

To run a single test file:
```bash
bun test tests/use-cases/auth/register.use-case.test.ts
```

---

## Important Notes

### TypeScript & Bun

- **Path alias**: `@/*` maps to `src/*` (defined in `tsconfig.json`)
- **Module system**: ESNext (Bun natively supports ESM)
- **Types**: Bun types + Node types included; no need to manually install `@types` beyond what's in `package.json`

### API Conventions

- Snake_case column names in database (e.g., `created_at`, `user_id`)
- Base path for all routes: `/api/v1`
- HTTP status codes: 201 (created), 200 (ok), 400+ (errors)
- No pagination implemented yet

### Important Files to Know

- `src/app.ts`: Creates Express app, wires up DI via factories (repositories → use-cases → controllers)
- `src/server.ts`: Entry point (imports app, calls `.listen()`)
- `src/middlewares/error-middleware.ts`: Global error handler (must be last middleware)
- `src/utils/http-response.ts`: `successResponse()` helper for consistent response format
- `package.json` scripts: All available commands

---

## Contribution

- Branch from `main`
- Keep layer separation: controllers stay thin, services hold logic, repositories handle SQL
- Run `bun run typecheck` + `bun test` before opening PR
- Maintain snake_case SQL column names and UUID v7 for new entities
