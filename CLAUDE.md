# ForesightCS - Enterprise Architecture & Engineering Guidelines

## 🏢 Platform Overview

**ForesightCS** is a production-ready, highly scalable B2B SaaS platform that predicts customer churn for SMB software companies using a Heuristic (Rule-Based) Scoring Engine.

- **Frontend**: High-performance, premium SaaS UI (dark mode, glassmorphism, 3D spatial elements).
- **Backend**: Enterprise-grade, multi-tenant REST API built for high concurrency.

## 🛠️ Tech Stack

- **Frontend (`/frontend`)**: Next.js 14+ (App Router), TypeScript, Tailwind CSS, Framer Motion, `@react-three/fiber`, React Hook Form, Zod.
- **Backend (`/backend`)**: Django 5, Django REST Framework (DRF), PostgreSQL, `psycopg3`.
- **Tooling**: `ruff` (Python linting), `pytest` & `pytest-django`, `django-environ`, `drf-spectacular` (OpenAPI/Swagger docs).

## 🏗️ Core Architectural Rules (CRITICAL)

### 1. Logical Multi-Tenancy (Strict Data Isolation)

- EVERY customer, rule, user, and event belongs to an `Organization` (Tenant).
- **Data Leakage is a fatal error.** All database queries must automatically filter by the authenticated user's `organization_id` using custom Django Managers.
- **Super Admin Bypass**: Only users with `is_superuser=True` can view all organizations, access system-wide metrics, and globally suspend accounts.

### 2. The "Soft Delete" Standard

- NEVER physically delete records from the database using SQL `DELETE`.
- Use a `BaseModel` (inheriting from `models.Model`) containing `id` (UUID), `created_at`, `updated_at`, and `deleted_at`.
- DRF API views must strictly override `.get_queryset()` to only return records where `deleted_at IS NULL`.

### 3. Front-to-Back Symmetry & Idempotency

- Backend validation (DRF Serializers) MUST strictly mirror Frontend validation (Zod schemas).
- DRF must adhere to RESTful status codes: `201` for Create, `204` for Delete, `400` for Validation Errors, `404` for Not Found.
- Critical `POST` endpoints must utilize `Idempotency-Key` headers to prevent duplicate DB entries during network latency.
- JSON error payloads (`400 Bad Request`) must be easily parsable by the Next.js `apiClient.ts` utility for inline field error mapping.

### 4. DRY Principles & Modularity

- Zero code duplication. Use abstract base classes in Python and centralized UI components (`/components/ui/`) in Next.js.
- Ensure the frontend uses a single, unified `apiClient.ts` utility class for all network requests.

## 🧠 The Churn Scoring Engine (Business Logic)

- **Base Score**: Every `Customer` starts at 100.
- **Calculation Engine**: The system iterates through the Organization's `HealthRule`s. If a customer violates a rule (based on their `EventLog` telemetry), the rule's `weight` is subtracted from their score.
- **Tiers**:
  - 71-100: `Healthy`
  - 41-70: `At Risk`
  - 0-40: `Critical`

## 📋 Enterprise Engineering Standards (CI/CD Readiness)

1. **Strict Linting**: The codebase must be CI-ready at all times. Python code MUST pass `ruff check .` and `ruff format .` with zero errors. TS code MUST pass `npm run lint`.
2. **Test Coverage**: All backend APIs must have Pytest unit/integration tests (using `factory_boy` for mock data generation). Frontend business logic and forms must have Vitest/React Testing Library coverage.
3. **Phased Security Implementation**: During initial Core CRUD & ORM development phases, JWT Auth middleware may be bypassed for speed. However, models must be built assuming strict Role-Based Access Control (RBAC) will be enforced prior to staging deployment.
4. **Implementation Logs**: Maintain the `prompts.md` file in the root directory as an Architectural Decision Log (ADL) to track significant AI-generated logic for future engineering onboarding and SOC2 auditing.

## 🤖 Claude's Autonomy Directives (Senior Staff Level)

- **Proactive Engineering**: Act as a Lead Architect. If a critical production package is missing (e.g., `django-cors-headers`, CORS configuration, DB connection pooling), install and configure it autonomously.
- **Professional Polish**: Never use generic "AI-looking" Tailwind templates. Default to premium SaaS aesthetics (Linear/Vercel/Stripe style) with deep dark backgrounds (#0A0A0A), smooth Framer Motion transitions, and subtle 1px borders.
- **Terminal Commands**:
  - Start frontend: `cd frontend && npm run dev`
  - Start backend (single entrypoint — starts Postgres, migrates, seeds demo data, runs the server): `cd backend && python start.py`
  - Format python: `cd backend && ruff format . && ruff check --fix .`
