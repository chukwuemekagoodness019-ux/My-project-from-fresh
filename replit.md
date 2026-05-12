# AI Study System

A full-stack AI-powered study assistant with chat, quiz, exam, and admin features — built on React + Vite (frontend) and Express 5 (backend), backed by PostgreSQL.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/study-system run dev` — run the frontend (port 21318)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run typecheck:libs` — build composite libs (db, api-client-react, api-zod, integrations-openrouter-ai)
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string (auto-provisioned)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React 19 + Vite 7 + Wouter router, TailwindCSS v4, shadcn/ui, TanStack Query, Zustand
- API: Express 5, pino logger, cookie-based HMAC-signed sessions
- AI: OpenRouter (primary) → OpenAI → DeepSeek fallback chain; SSE streaming
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/study-system/src/` — React frontend (pages, components, hooks, contexts)
- `artifacts/api-server/src/` — Express backend (routes + libs)
- `lib/db/src/schema/` — DB schema (source of truth)
- `lib/api-spec/openapi.yaml` — OpenAPI spec (source of truth for API contracts)
- `lib/api-client-react/src/generated/` — generated React Query hooks (do not edit)
- `lib/api-zod/src/generated/` — generated Zod schemas (do not edit)
- `lib/integrations-openrouter-ai/src/` — OpenRouter AI client lib

## Architecture decisions

- Chat history is localStorage-only (7-day TTL) — no server-side conversation persistence; `conversations` and `messages` DB tables exist but are unused
- Feature flags, exam store, announcements, and error log are all in-memory (intentionally — lightweight, no DB needed)
- Admin auth is triple-factor (email + secretKey + password) with 4h in-memory token TTL
- AI provider fallback chain: OpenRouter → OpenAI → DeepSeek — configured via `OPENROUTER_API_KEY`, `OPENAI_API_KEY`, `DEEPSEEK_API_KEY`
- Session identity is cookie-based HMAC-signed (no external auth library)

## Product

- **Chat** (`/`): SSE-streaming AI chat with sidebar history (localStorage), file uploads (image/PDF), voice input, feedback button
- **Quiz** (`/quiz`): AI-generated multiple-choice quizzes by subject, scored and saved to DB
- **Exam** (`/exam`): Timed exam mode with in-memory exam store (survives until server restart)
- **Admin** (`/admin`): Manage users, payments, feature flags, announcements, error logs — triple-auth protected

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Do not run `pnpm dev` at workspace root — use workflow names or `pnpm --filter` commands
- After changing OpenAPI spec, run codegen before typechecking frontend
- DB push uses `drizzle-kit push` (not migrate) — for schema changes, run `pnpm --filter @workspace/db run push`
- Exam store and announcements reset on API server restart (by design)
- `conversations` and `messages` DB tables exist in schema but are not used by any backend route

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- All secrets are pre-configured: `SESSION_SECRET`, `OPENROUTER_API_KEY`, `OPENAI_API_KEY`, `DEEPSEEK_API_KEY`, `ADMIN_EMAIL`, `ADMIN_SECRET_KEY`, `ADMIN_PASSWORD`, `ACCOUNT_PROVIDER`, `ACCOUNT_NAME`, `ACCOUNT_NUMBER`
