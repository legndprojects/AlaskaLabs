# AlaskaLabs E-Commerce Platform — Master Roadmap

> This document outlines all implementation plans and their dependencies. Each plan is a separate document that produces working, testable software independently.

**Spec:** `docs/superpowers/specs/2026-04-06-alaskalabs-ecommerce-platform-design.md`

---

## Plan Dependency Graph

```
Plan 1: Frontend Foundation ──────────────┐
  (Next.js config, Providers, middleware)  │
                                           ├──→ Plan 3: Shop Pages & Checkout
Plan 2: Medusa Backend Setup ─────────────┘         (product catalog, cart, checkout UI)
  (Medusa v2, custom modules, DB)                            │
                                                             ├──→ Plan 4: Payment Integration
Plan 5: Agent System (INDEPENDENT) ◄─────── Can start NOW   │     (card processor + crypto)
  (pm-agent, frontend-agent, backend-agent)                  │
                                                             │
Plan 6: Infrastructure & Docker ─────────────────────────────┘
  (Vultr VPS, Docker Compose, Nginx,              │
   Cloudflare, WireGuard, backups)                 │
                                                   ├──→ Plan 7: Production Monitoring
                                                          (Uptime Kuma, GlitchTip, fail2ban,
                                                           cron scripts, synthetic checks)
```

## Plans

### Plan 5: Agent System ✅ WRITTEN — `2026-04-06-agent-system.md`
- **Status:** Ready to execute
- **Dependencies:** None — can start immediately
- **Produces:** PM orchestrator + frontend/backend review agents in `.claude/agents/`
- **Time estimate:** N/A

### Plan 1: Frontend Foundation — `2026-04-06-frontend-foundation.md`
- **Status:** Ready to execute
- **Dependencies:** None — can start immediately (parallel with Plan 5)
- **Produces:** Next.js SSR config, Providers.tsx, medusa-client, middleware, Google Fonts migration, Navbar updates
- **Scope:** Config changes + foundational components. NO shop pages yet.

### Plan 2: Medusa Backend Setup
- **Status:** Not yet written
- **Dependencies:** None (can develop locally without VPS)
- **Produces:** Medusa v2 project, custom module providers (payment-crypto adapter, payment-merchant, fulfillment-easypost, privacy-module), database schema with HMAC columns
- **Scope:** Full backend — ready to accept API calls from frontend

### Plan 3: Shop Pages & Checkout
- **Status:** Not yet written
- **Dependencies:** Plan 1 (frontend foundation) + Plan 2 (Medusa backend running)
- **Produces:** /shop, /shop/[handle], /cart, /checkout, /checkout/success, /account/*, /about, /faq, /contact pages + all e-commerce components
- **Scope:** Complete storefront UI connected to Medusa API

### Plan 4: Payment Integration
- **Status:** Not yet written — blocked on operator selecting card processor and crypto provider
- **Dependencies:** Plan 2 (Medusa) + Plan 3 (checkout UI)
- **Produces:** Working card and crypto payment flows end-to-end
- **Scope:** Payment module providers + checkout integration

### Plan 6: Infrastructure & Docker
- **Status:** Not yet written
- **Dependencies:** Plans 1-4 complete (need working app to containerize)
- **Produces:** Docker Compose stacks, Nginx config, Cloudflare setup, WireGuard VPN, LUKS encryption, backup scripts, `.env.example`
- **Scope:** Everything needed to deploy to Vultr VPS

### Plan 7: Production Monitoring
- **Status:** Not yet written
- **Dependencies:** Plan 6 (infrastructure deployed)
- **Produces:** Uptime Kuma, GlitchTip, fail2ban config, cron monitoring scripts, synthetic transaction checks, alert routing
- **Scope:** All production monitoring and alerting

---

## Recommended Execution Order

**Phase 1 (Now — parallel):**
- Plan 5: Agent System
- Plan 1: Frontend Foundation

**Phase 2 (After Phase 1):**
- Plan 2: Medusa Backend Setup

**Phase 3 (After Phase 2):**
- Plan 3: Shop Pages & Checkout

**Phase 4 (After operator selects payment providers):**
- Plan 4: Payment Integration

**Phase 5 (After working app):**
- Plan 6: Infrastructure & Docker

**Phase 6 (After deployment):**
- Plan 7: Production Monitoring
