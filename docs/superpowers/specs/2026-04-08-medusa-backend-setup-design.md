# Medusa Backend Setup Design

**Date:** 2026-04-08
**Status:** Approved
**Project:** AlaskaLabs Peptide Storefront
**Depends on:** Plan 1 (Frontend Foundation) — completed
**Blocks:** Plan 3 (Shop Pages & Checkout)

---

## Overview

Set up a Medusa v2 backend as a headless e-commerce engine in `AlaskaLabs/medusa/`, alongside the existing `AlaskaLabs/site/` frontend. Includes production-ready Redis configuration, seed data with product images for frontend development, and a dev Docker Compose for local Postgres + Redis.

**Deferred to separate plans:**
- Privacy module (HMAC hash columns, retention policy) — built before launch, after shop pages work
- Payment integration — Plan 4 (manual provider used for dev)
- Fulfillment (EasyPost) — built when API keys are available (manual fulfillment for now)

---

## 1. Project Structure

```
AlaskaLabs/
├── site/                              ← existing Next.js frontend
└── medusa/                            ← new Medusa v2 backend
    ├── medusa-config.ts               ← defineConfig — DB, Redis, modules, providers
    ├── package.json
    ├── tsconfig.json
    ├── docker-compose.dev.yml         ← Postgres + Redis for local dev
    ├── .env                           ← local secrets (gitignored)
    ├── .env.example                   ← template with all required vars
    ├── src/
    │   ├── subscribers/               ← event handlers (empty for now, privacy module adds these later)
    │   └── api/                       ← custom API routes (if needed later)
    ├── static/                        ← product images for seed data
    └── seed/
        └── seed.ts                    ← test products, shipping, admin user
```

Created via `npx create-medusa-app@latest medusa`, then customized.

---

## 2. Local Dev Infrastructure (docker-compose.dev.yml)

Instead of requiring manual PostgreSQL and Redis installs, a dev compose file spins up both:

```yaml
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: medusa
    ports:
      - "5432:5432"
    volumes:
      - medusa_pg_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  medusa_pg_data:
```

One command to start: `docker compose -f docker-compose.dev.yml up -d`

---

## 3. Configuration (medusa-config.ts)

### Database

PostgreSQL 16 via `DATABASE_URL` environment variable. Default for local dev: `postgres://postgres:postgres@localhost:5432/medusa`.

### Redis

Single `REDIS_URL` env var, used for four modules:

| Module | Purpose |
|--------|---------|
| `@medusajs/medusa/event-bus-redis` | Async event dispatch (order.placed, customer.created, etc.) |
| `@medusajs/caching-redis` | Product query caching, session data |
| `@medusajs/medusa/workflow-engine-redis` | Checkout flows, payment processing steps |
| `@medusajs/medusa/locking-redis` | Prevents double-processing of webhooks |

In-memory defaults work but lose state on restart. Redis is configured from day one for production readiness.

### Authentication

Session-based auth (cookies), not JWT. This is critical because:
- The Next.js proxy (`proxy.ts`) runs server-side and can only read cookies, not localStorage
- Session cookies are sent automatically with every request — no client-side token management needed
- Medusa sets an HTTP cookie on successful login

**Frontend fix required:** Update `site/src/lib/medusa-client.ts` to:
```typescript
export const medusa = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  debug: process.env.NODE_ENV === "development",
  auth: {
    type: "session",
  },
});
```

### CORS

```
STORE_CORS=http://localhost:3000
ADMIN_CORS=http://localhost:3000
AUTH_CORS=http://localhost:3000
```

Credentials must be allowed for session cookies to work cross-origin.

### Module Providers

**Payment:**
- Medusa's built-in manual payment provider (default, no config needed)
- Config structure set up so real providers slot into the `providers` array later (Plan 4)

**Fulfillment:**
- `@medusajs/medusa/fulfillment-manual` (default — works for dev, no custom code needed)

### Environment Variables (.env.example)

```
# Database
DATABASE_URL=postgres://postgres:postgres@localhost:5432/medusa

# Redis
REDIS_URL=redis://localhost:6379

# Admin
MEDUSA_ADMIN_EMAIL=admin@alaskalabs.is
MEDUSA_ADMIN_PASSWORD=

# CORS
STORE_CORS=http://localhost:3000
ADMIN_CORS=http://localhost:3000
AUTH_CORS=http://localhost:3000
```

---

## 4. Seed Data

Run via `npm run seed` or `npx medusa exec seed/seed.ts`. Idempotent — checks if data exists before creating.

### Products

| Product | Handle | Variants | Prices (USD) |
|---------|--------|----------|-------------|
| BPC-157 | bpc-157 | 5mg vial, 10mg vial | $12.00, $20.00 |
| TB-500 | tb-500 | 5mg vial, 10mg vial | $15.00, $25.00 |
| GHK-Cu | ghk-cu | 50mg vial | $30.00 |

Each product includes:
- Title, description, handle (URL slug)
- Thumbnail image (reuse existing `bottle-static.png` from `site/public/images/` for dev; real product photos added later)
- Tags: "peptide", "research"
- Variants with SKUs (e.g., `BPC157-5MG`), prices, inventory (100 units each)
- Weight and dimensions for shipping calculation

### Shipping

- Shipping profile: "Default"
- Shipping option: "Standard Shipping" — flat rate $5.99
- Fulfillment set linked to US region using manual fulfillment provider

### Region & Currency

- Region: United States
- Currency: USD
- Tax rate: 0% (research chemicals — operator adjusts later)

### Admin User

Created from `MEDUSA_ADMIN_EMAIL` and `MEDUSA_ADMIN_PASSWORD` env vars.

### What Seed Does NOT Create

- Payment configurations (manual provider works by default)
- Customer accounts (customers self-register)
- Discount codes (operator creates via admin dashboard)

---

## 5. Frontend Integration Notes

These changes to the frontend (`site/`) are required for the backend to work:

### medusa-client.ts

Add session auth config:
```typescript
export const medusa = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  debug: process.env.NODE_ENV === "development",
  auth: {
    type: "session",
  },
});
```

### proxy.ts

Verify the cookie name Medusa actually sets for session auth. It may be `connect.sid` rather than `_medusa_jwt`. Update the cookie check accordingly after testing.

### Cart Context API Verification

The current `cart-context.tsx` calls these SDK methods — verify they match the actual Medusa v2 JS SDK during implementation:
- `medusa.store.cart.create({})` — create new cart
- `medusa.store.cart.retrieve(id)` — get cart by ID
- `medusa.store.cart.createLineItem(id, { variant_id, quantity })` — add item
- `medusa.store.cart.deleteLineItem(cartId, lineItemId)` — remove item
- `medusa.store.cart.updateLineItem(cartId, lineItemId, { quantity })` — update quantity

If method names differ, update cart-context.tsx to match.

### CORS in Development

The frontend at `:3000` calls the backend at `:9000`. Session cookies require:
- Backend: `STORE_CORS=http://localhost:3000` with credentials allowed
- Frontend SDK: credentials included automatically when `auth.type = "session"`

---

## 6. Development Workflow

### First-time setup
```bash
cd medusa
docker compose -f docker-compose.dev.yml up -d   # Postgres + Redis
cp .env.example .env
# Edit .env — set MEDUSA_ADMIN_PASSWORD
npm install
npx medusa db:migrate
npm run seed
npx medusa develop
```

### Daily development
```bash
cd medusa
docker compose -f docker-compose.dev.yml up -d   # ensure DB + Redis are running
npx medusa develop                                # starts on :9000

# In another terminal:
cd site && npm run dev                            # starts on :3000
```

The frontend talks to the backend via the Medusa JS SDK. Products, cart, checkout, and auth all flow through the Medusa API.

---

## 7. What This Plan Produces

After execution, the system will have:
- A running Medusa v2 backend with admin dashboard at `localhost:9000/app`
- 3 products with variants visible via the Store API
- Session-based customer auth working end-to-end
- Cart and checkout flows functional (with manual payment + manual fulfillment)
- Dev Docker Compose for zero-friction local setup
- Seed data with product images for immediate frontend development

**What it does NOT produce (deferred to separate plans):**
- Privacy module — HMAC hash columns, retention policy (own mini-plan, before launch)
- Fulfillment — EasyPost integration (when API keys available)
- Real payment processing (Plan 4)
- Docker containerization for production (Plan 6)
- Production deployment (Plan 6)
- LUKS disk encryption (Plan 6)
- Monitoring and alerting (Plan 7)

---

## 8. Updated Master Roadmap Impact

This plan adds a new entry to the dependency graph:

```
Plan 1: Frontend Foundation ──────────────┐
                                          ├──→ Plan 3: Shop Pages & Checkout
Plan 2: Medusa Backend Setup ─────────────┘         │
  (THIS PLAN — Medusa v2, seed data,                │
   manual payment/fulfillment, Redis)               ├──→ Plan 4: Payment Integration
                                                    │
Plan 2.5: Privacy Module (NEW) ─────────────────────┘
  (HMAC hash columns, retention policy,      Must complete before launch,
   subscribers, scheduled anonymization)     but not needed for dev/testing
```

Plan 2.5 slots in after shop pages are working but before any real customer data exists.
