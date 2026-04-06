# AlaskaLabs E-Commerce Platform Design

**Date:** 2026-04-06
**Status:** Approved (revised after agent review)
**Project:** AlaskaLabs Peptide Storefront

---

## Overview

Transform the existing AlaskaLabs Next.js landing page into a full-featured, self-hosted e-commerce platform for selling peptides. The platform prioritizes operator privacy, full infrastructure control, and a premium user experience that extends the existing scroll-driven landing page aesthetic.

---

## 1. Infrastructure & Deployment

### Hosting

- **Provider:** Vultr VPS (paid with crypto)
- **Spec:** 4 vCPU / 8GB RAM / **320GB NVMe SSD (~$96/mo)** — required to accommodate crypto node data, PostgreSQL, Docker images, logs, and growth headroom
- **OS:** Ubuntu 22.04 LTS with `unattended-upgrades` enabled (security-only auto-updates)
- **Firewall:** Vultr firewall — only ports 80/443 open to Cloudflare IPs, SSH restricted to operator IP only
- **Cloudflare IP sync:** Cron job polls `https://www.cloudflare.com/ips/` weekly and updates Vultr firewall rules to stay in sync with Cloudflare's CIDR ranges

### CDN & DNS

- **Cloudflare** proxies all traffic (orange cloud mode)
- `.is` domain DNS hosted on Cloudflare
- Full SSL strict mode — Cloudflare Origin Certificate on Nginx
- WAF rules, bot protection, DDoS mitigation enabled
- Static asset caching (images, JS, CSS)
- Origin IP never publicly exposed
- **No MX records pointing to the VPS** — use a separate mail provider to avoid origin IP leakage via DNS

### Docker Compose Stack

Two compose files: the **application stack** and the **crypto payment sub-stack**, network-bridged together.

**Application Stack (`docker-compose.yml`):**

| Container | Purpose | Internal Port |
|-----------|---------|---------------|
| `nginx` | Reverse proxy, SSL termination, rate limiting | 80, 443 |
| `frontend` | Next.js storefront (SSR, `output: "standalone"`) | 3000 |
| `medusa-backend` | Medusa.js v2 API + admin dashboard | 9000 |
| `app-postgres` | PostgreSQL 16 (LUKS-encrypted volume) | 5432 |
| `redis` | Sessions, caching, Medusa event queue (`requirepass` enabled, AOF persistence) | 6379 |
| `uptime-kuma` | Uptime monitoring dashboard | 3001 |
| `glitchtip` | Self-hosted error tracking (frontend + backend) | 8000 |

**Crypto Payment Sub-Stack (`docker-compose.btcpay.yml`):**

| Container | Purpose | Internal Port |
|-----------|---------|---------------|
| `btcpayserver` | BTCPay Server application | 23001 |
| `nbxplorer` | Blockchain indexer for BTCPay | 24445 |
| `bitcoind` | Bitcoin Core (pruned node) | 8333 |
| `lnd` | Lightning Network daemon | 9735 |
| `litecoind` | Litecoin Core (if LTC enabled) | 9333 |
| `btcpay-postgres` | BTCPay's own PostgreSQL instance (separate from app DB) | 5433 |

> **Note:** The crypto payment provider is subject to change. The operator may substitute BTCPay with a different provider (NOWPayments, CoinGate, or other) depending on coin support needs (especially ETH and SOL). The `medusa-payment-crypto` module provider must be designed with an adapter interface so swapping providers doesn't require rewriting checkout logic.

**Network bridging:** Both stacks share a Docker network (`payment-bridge`) so `medusa-backend` can reach `btcpayserver` by hostname. No crypto containers are exposed to the public network.

**Container configuration requirements:**
- All containers: `restart: unless-stopped`
- Health checks on all services (`healthcheck:` directives)
- Startup ordering via `depends_on: condition: service_healthy` — PostgreSQL and Redis must be healthy before Medusa starts
- fail2ban runs on the **host** (not in a container), with Nginx log volume mounted to host path for access
- Nginx logs written to a host-mounted volume at `/var/log/nginx/` for fail2ban access
- fail2ban configured with `chain = DOCKER-USER` (not `INPUT`) to correctly interact with Docker's iptables rules

**Nginx routing:**
- `/` → `frontend:3000` (Next.js)
- `/store/*`, `/auth/*` → `medusa-backend:9000` (Medusa storefront API — no prefix rewrite needed, these are Medusa's native routes)
- `/app` → `medusa-backend:9000/app` (Medusa v2 admin dashboard, IP-restricted)
- `/btcpay/*` → `btcpayserver:23001` (IP-restricted)
- `/status` → `uptime-kuma:3001` (IP-restricted)
- `/errors` → `glitchtip:8000` (IP-restricted)

**Key change from current setup:** Next.js moves from `output: "export"` (static/GitHub Pages) to `output: "standalone"` for SSR + Docker deployment. The `images: { unoptimized: true }` flag is also removed to enable Next.js Image Optimization.

### Environment Variables

A `.env.example` file must be created with all required secrets:

```
# PostgreSQL (application)
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=medusa

# Redis
REDIS_URL=redis://:password@redis:6379
REDIS_PASSWORD=

# Medusa
MEDUSA_BACKEND_URL=https://yourdomain.is
JWT_SECRET=
COOKIE_SECRET=
MEDUSA_ADMIN_EMAIL=
MEDUSA_ADMIN_PASSWORD=

# Crypto payments (adapter — values depend on provider)
CRYPTO_PROVIDER=btcpay  # or: nowpayments, coingate
BTCPAY_URL=http://btcpayserver:23001
BTCPAY_API_KEY=
BTCPAY_STORE_ID=
BTCPAY_WEBHOOK_SECRET=

# Card payments
MERCHANT_PROCESSOR_API_KEY=
MERCHANT_PROCESSOR_WEBHOOK_SECRET=

# Shipping
EASYPOST_API_KEY=

# PII encryption
PII_HMAC_KEY=

# Backup encryption (age public key — private key stays offline)
BACKUP_AGE_RECIPIENT=

# Error tracking
GLITCHTIP_DSN=

# Frontend
NEXT_PUBLIC_MEDUSA_URL=https://yourdomain.is
NEXT_PUBLIC_GLITCHTIP_DSN=
```

### Backups

- Daily automated PostgreSQL dumps encrypted with `age` (asymmetric encryption — public key on server, **private key only on operator's local machine**)
- Weekly Vultr VPS snapshots
- BTCPay wallet backup stored encrypted offline with operator-held key
- Backup files stored locally with `600` permissions, rotated (keep 7 daily, 4 weekly)
- `.env` files have `600` permissions, owned by root, excluded from all backups and git

---

## 2. E-Commerce Architecture

### Backend: Medusa.js v2

Medusa.js v2 serves as the headless e-commerce engine. The Next.js frontend communicates with it via REST API. All custom extensions use **Medusa v2's module provider architecture** (not v1 plugin conventions).

**Core modules used out of the box:**
- **Products** — catalog with variants (different peptides, quantities, concentrations)
- **Cart & Checkout** — session-based cart, guest + registered checkout flows
- **Customers** — optional accounts, password auth
- **Orders** — order lifecycle (placed → processing → shipped → delivered)
- **Inventory** — stock tracking per variant, low-stock alerts
- **Discounts** — percentage/fixed discount codes, usage limits, expiry dates
- **Shipping** — shipping profiles, calculated rates via EasyPost
- **Notifications** — order confirmation, shipping updates via email

### Custom Medusa v2 Module Providers

All custom modules follow Medusa v2's module provider pattern: `src/index.ts` exporting a `MedusaModule`, provider classes extending abstract base classes (e.g., `AbstractPaymentProvider`), registered in `medusa-config.ts` under the `modules` key.

| Module Provider | Purpose |
|----------------|---------|
| `payment-merchant` | Extends `AbstractPaymentProvider`. Integrates high-risk card processor API. Verifies webhook HMAC signatures on every incoming payment confirmation. |
| `payment-crypto` | Extends `AbstractPaymentProvider`. Adapter interface for crypto payments (default: BTCPay Server). Verifies `BTCPay-Sig1` HMAC-SHA256 webhook signatures. Designed with provider abstraction so swapping to NOWPayments/CoinGate requires only a new adapter, not checkout rewrites. |
| `fulfillment-easypost` | Extends `AbstractFulfillmentProvider`. Label generation + tracking number creation via EasyPost API. |
| `privacy-module` | Custom Medusa module for PII protection. See Data Privacy section below. |

### Payment Flow

**Card payments:**
Customer selects card → redirected to merchant processor hosted payment page → processor handles card data (PCI compliant, card data never touches our server) → **HMAC-signed webhook** confirms payment → Medusa verifies signature → creates order

**Crypto payments:**
Customer selects crypto + coin → crypto provider creates invoice → invoice displayed on checkout page → customer pays from wallet → **HMAC-signed webhook** confirms payment → Medusa verifies signature → creates order

> **Supported coins depend on provider choice.** BTCPay natively supports BTC + LTC. ETH requires a community plugin + Ethereum node. SOL is not supported by BTCPay. If ETH/SOL are required, a multi-provider approach or a different provider (NOWPayments, CoinGate) is needed. Operator to decide before checkout implementation.

### Admin Dashboard

Medusa v2's built-in admin UI accessible at `/app` (proxied via Nginx at `/app`, **IP-restricted**).

Capabilities:
- Add/edit products and inventory
- Process orders and generate shipping labels
- View revenue, issue refunds
- Manage discount codes
- View customer data (PII decrypted only in dashboard context)
- **Strong password required, MFA enabled, login rate-limited**

### Database (PostgreSQL 16)

Medusa manages its own schema for products, orders, carts, customers, etc.

**Data privacy approach (replaces app-level AES-256 — see agent review findings):**

- **LUKS full-volume encryption** on the PostgreSQL data volume — protects against stolen disks and backup theft without breaking SQL query semantics
- **HMAC-keyed hash columns** alongside PII fields (name, address, email) — enables exact-match lookups (e.g., customer login by email, admin search by email) without decrypting. Hash is indexed, encrypted value is stored alongside it
- **Searchable fields:** `email_hash`, `name_hash` columns indexed for lookups. LIKE/partial match is not supported (acceptable tradeoff for privacy)
- **Retention policy table** tracking records eligible for auto-purge (default: 12 months, anonymizes PII but retains order totals for accounting)
- Crypto payment transaction records linked to Medusa orders via custom entity extension (Medusa v2's MikroORM entity extension pattern, not raw SQL migrations)

**Key management:**
- HMAC key stored as environment variable, loaded at boot, never written to disk beyond `.env` (which has `600` permissions)
- LUKS volume key entered at boot or stored in a separate secrets partition
- Backup encryption uses `age` asymmetric encryption — public key on server, private key only on operator's offline machine
- Key rotation: new HMAC key → re-hash all records in a migration, old key retired. New `age` keypair → old backups still decryptable with old private key

---

## 3. Frontend Architecture

### Approach

Expand the existing Next.js 16 landing page into a full storefront. The current scroll-driven animation page remains untouched as the homepage. New e-commerce pages are added around it.

### Critical Next.js 16 Requirements

These must be followed for all new code (per `AGENTS.md` — Next.js 16.2.2 has breaking changes):

1. **`output: "standalone"`** in `next.config.ts` (replaces `output: "export"`) — required for SSR + Docker
2. **`params` is fully async** — all dynamic route pages (`/shop/[handle]`, `/account/orders/[id]`) must use `async function Page({ params }: { params: Promise<{ handle: string }> })` and `await params`
3. **`searchParams` is fully async** — same pattern for `/shop` filtering/sorting
4. **Read `node_modules/next/dist/docs/` before writing any Next.js code** — the bundled docs are the source of truth for this version
5. **Use `@medusajs/js-sdk`** (fetch-based, no React dependency) — NOT `medusa-react` (React 18 only, incompatible with React 19)

### Page Structure

| Route | Purpose |
|-------|---------|
| `/` | Existing landing page (hero animation, specs, CTA) — "Buy Now" links to `/shop` via `<Link>` |
| `/shop` | Product catalog grid with filtering/sorting |
| `/shop/[handle]` | Product detail page — images, description, variants, add to cart |
| `/cart` | Cart page — line items, quantities, discount code input, subtotal |
| `/checkout` | Multi-step checkout — shipping → payment → review → confirm |
| `/checkout/success` | Order confirmation with order number (order ID passed via URL param) |
| `/account` | Customer dashboard — order history, saved addresses, settings |
| `/account/login` | Login / register page |
| `/account/orders/[id]` | Order detail with tracking |
| `/about` | Company story, lab certifications, trust signals |
| `/faq` | Common questions about peptides, shipping, payments |
| `/contact` | Contact form or encrypted email |

### Component Architecture

```
src/
├── app/
│   ├── page.tsx                        # Existing landing page ("use client", untouched)
│   ├── layout.tsx                      # Root Server Component layout — imports Providers
│   ├── middleware.ts                   # Auth route protection for /account/**, /checkout
│   ├── shop/
│   │   ├── page.tsx                    # Product catalog (async searchParams)
│   │   ├── loading.tsx                 # Suspense fallback
│   │   ├── error.tsx                   # Error boundary
│   │   └── [handle]/
│   │       ├── page.tsx                # Product detail (async params)
│   │       ├── loading.tsx
│   │       ├── error.tsx
│   │       └── not-found.tsx           # 404 for invalid product handle
│   ├── cart/
│   │   ├── page.tsx
│   │   └── loading.tsx
│   ├── checkout/
│   │   ├── page.tsx                    # Redirects to /shop if cart empty
│   │   ├── loading.tsx
│   │   ├── error.tsx
│   │   └── success/page.tsx            # Reads order ID from URL params
│   ├── account/
│   │   ├── page.tsx                    # Protected by middleware
│   │   ├── login/page.tsx
│   │   └── orders/[id]/
│   │       ├── page.tsx                # Async params
│   │       └── loading.tsx
│   ├── about/page.tsx
│   ├── faq/page.tsx
│   └── contact/page.tsx
├── components/
│   ├── Providers.tsx                   # "use client" — wraps CartProvider + AuthProvider + CartDrawer
│   ├── Navbar.tsx                      # Updated — cart icon with count, href="/shop" (not #shop)
│   ├── HeroCanvas.tsx                  # Existing (untouched)
│   ├── TextOverlays.tsx                # Existing (untouched)
│   ├── TravelingBottle.tsx             # Existing (untouched)
│   ├── PostSequenceContent.tsx         # Existing (updated: href="/shop" instead of #shop)
│   ├── shop/
│   │   ├── ProductCard.tsx
│   │   ├── ProductGallery.tsx
│   │   ├── VariantSelector.tsx
│   │   └── AddToCartButton.tsx
│   ├── cart/
│   │   ├── CartDrawer.tsx              # Rendered in Providers.tsx at root level
│   │   ├── CartItem.tsx
│   │   └── CartSummary.tsx
│   ├── checkout/
│   │   ├── ShippingForm.tsx            # With validation error states
│   │   ├── PaymentSelector.tsx         # Card vs crypto toggle
│   │   ├── CryptoPayment.tsx           # Crypto provider invoice embed/redirect
│   │   ├── OrderReview.tsx
│   │   └── PaymentFailure.tsx          # Error state for failed payments
│   └── account/
│       ├── OrderHistory.tsx
│       └── AddressBook.tsx
├── lib/
│   ├── medusa-client.ts                # @medusajs/js-sdk configured for API
│   ├── cart-context.tsx                # React context — hydrates from Medusa cookie on mount
│   └── auth-context.tsx                # React context for customer sessions
└── data/
    └── product.ts                      # Existing (keep for landing page — acknowledged tech debt: price may diverge from Medusa)
```

### Design Language

- Consistent with existing landing page — dark theme (`#050D1A`), Bebas Neue for **headings only**, arctic blue accents (`#0072BC`)
- **Body text, form inputs, and prose use `font-sans`** (Tailwind system sans-serif) — Bebas Neue is display-only, not for form fields or paragraphs
- **Google Fonts import removed from `globals.css`** — migrate to `next/font/google` in `layout.tsx` for self-hosted font loading (no requests to Google servers, consistent with privacy posture)
- Framer Motion page transitions and micro-animations on shop pages
- Mobile-first responsive design (Tailwind `md:` / `lg:` breakpoints)
- Scrollbar hiding remains on landing page; **shop/checkout pages may re-enable visible scrollbars** for usability on long product lists and order tables

### Key Frontend Behaviors

- Cart state persists via Medusa session (server-side) + local React context (hydrated from Medusa cart cookie on mount via `useEffect`)
- Product data fetched server-side (Next.js SSR) for SEO
- Checkout form validates client-side, submits to Medusa API
- Crypto payment displayed based on provider (inline embed, modal, or redirect depending on chosen provider). **CSP `frame-src` must explicitly allow crypto provider origin if using iframe/modal**
- Guest checkout is the default — "Create account" offered after order confirmation
- `middleware.ts` redirects unauthenticated users from `/account/**` to `/account/login` and from `/checkout` if cart is empty to `/shop`
- Crypto invoice expiry handling: countdown timer shown, re-invoice flow if expired

---

## 4. Agent System

### Development Agents (Claude Code)

Agent definitions stored in `.claude/agents/` as Markdown files with YAML frontmatter.

#### Frontend Agent (`frontend-agent`) — Subagent
- Reviews UI component code for consistency with design language
- Checks responsive breakpoints
- Validates new pages follow existing component patterns and Next.js 16 async params pattern
- Checks accessibility basics (alt text, form labels, contrast)
- Runs `next build` to catch compile errors
- Reports issues with severity levels (critical, warning, info)

#### Backend Agent (`backend-agent`) — Subagent
- Reviews Medusa v2 module providers and custom modules
- Validates API routes return correct response shapes
- Checks database queries for N+1 problems and missing indexes
- Reviews security — input validation, auth checks on protected routes, webhook HMAC verification
- Runs backend tests
- Checks Docker configuration for exposed ports or misconfigurations

#### Project Manager Agent (`pm-agent`) — **Main-thread agent** (not a subagent)

> **Architecture note:** Claude Code subagents cannot spawn other subagents. The PM agent must be a **main-thread agent** launched via `claude --agent pm-agent` (or equivalent). As a main-thread agent, it can use the `Agent` tool to dispatch `frontend-agent` and `backend-agent` as subagents in parallel.

- Launched via `claude --agent pm-agent`
- Has `tools: Agent, Read, Bash, Glob, Grep` in its frontmatter
- Dispatches Frontend Agent and Backend Agent in parallel via the `Agent` tool
- Aggregates their reports into a single status summary
- Tracks what changed since last review (git diff based)
- Flags cross-cutting concerns (e.g., frontend expects an API field that backend doesn't provide)
- Maintains a running checklist of project health
- Primary agent the operator interacts with

**Agent interaction flow:**
```
Operator runs: claude --agent pm-agent
    │
    ├── Agent(frontend-agent) dispatched (parallel)
    │   └── Reviews src/app/**, src/components/**
    │
    ├── Agent(backend-agent) dispatched (parallel)
    │   └── Reviews medusa modules, API routes, Docker config
    │
    └── Collects both reports
        └── Presents unified status:
            "Frontend: 2 issues (1 warning, 1 info)
             Backend: 1 issue (1 critical — missing auth on /app route)
             Cross-check: ✓ API contract matches frontend expectations"
```

### Production Monitoring (Services on VPS)

#### Uptime Monitor (Uptime Kuma container)
- Checks frontend (`https://yourdomain.is`) every 60 seconds
- Checks Medusa API (`/store/products`) every 60 seconds
- Checks crypto payment provider status every 5 minutes
- Alerts via Discord webhook, email, or Telegram on downtime
- Dashboard accessible only from operator IP
- **External backup monitor:** A free external service (e.g., UptimeRobot free tier or Cloudflare Workers health check) monitors the site independently — if the entire VPS is down, Uptime Kuma can't alert, so this external check is the last-resort "VPS unreachable" alarm

#### Error Tracking (GlitchTip container)
- Self-hosted Sentry-compatible error tracking
- Captures JavaScript exceptions on the Next.js frontend (checkout errors that don't cause 5xx)
- Captures backend exceptions in Medusa (failed payment webhooks, database errors)
- Dashboard accessible only from operator IP

#### Security Monitor (fail2ban on host + custom cron scripts)
- fail2ban on the **host OS** (not containerized) reads Nginx logs from host-mounted volume
- fail2ban uses `chain = DOCKER-USER` for correct Docker iptables integration
- **Two log paths:** raw Nginx access log (full IPs, short retention, for fail2ban) + sanitized log (last octet stripped, longer retention, for debugging)
- Monitors SSH login attempts — auto-bans brute force
- Daily cron checks SSL cert expiry
- Weekly cron scans for unexpected open ports (`ss -tlnp` compared against expected list)
- Container audit: `docker ps` compared against expected container list (no Docker socket mounting — runs from host cron)
- **Disk usage alerting:** cron alerts at 80% disk utilization
- Log rotation to prevent disk fill

#### Order/Payment Monitor (custom cron + Medusa webhooks)
- Cron every 15 minutes checks for orders stuck in "payment_pending" > 1 hour
- Monitors crypto provider webhook delivery — alerts if webhooks stop arriving
- Daily summary: orders placed, revenue, failed payments, low inventory alerts
- Immediate alert if merchant processor returns errors on multiple consecutive transactions
- **PostgreSQL slow query log enabled** — alerts on queries exceeding 1 second

#### Synthetic Transaction Monitor (cron script)
- Periodic health check that verifies the full purchase flow works:
  - Fetch product list from Medusa API
  - Create a test cart, add item
  - Verify checkout page loads
  - (Does NOT complete payment — just verifies the flow up to payment selection)
- Alerts if any step fails

### Alert Routing

| Severity | Examples | Channel | Timing |
|----------|----------|---------|--------|
| Critical | Site down, payment broken, disk >90% | Discord/Telegram + Email + External monitor | Immediate |
| Warning | Stuck order, high error rate, low inventory, slow queries, disk >80% | Discord | Within 15 minutes |
| Info | Daily summary, cert expiry in 30 days | Email digest | Daily |

---

## 5. Security & Privacy

### Network Security Layers

| Layer | Protection |
|-------|-----------|
| Cloudflare | DDoS mitigation, WAF rules, bot protection, origin IP hidden |
| Vultr Firewall | Only 80/443 to Cloudflare IPs (auto-synced). SSH restricted to operator IP |
| Nginx | Rate limiting, request size limits, full security headers (see below) |
| Docker | Each service in its own network. Only Nginx exposed. Postgres/Redis have no public access |
| Redis | `requirepass` enabled — no unauthenticated access |
| fail2ban | Host-level, reads raw Nginx logs, `DOCKER-USER` chain, auto-bans malicious IPs |

### Nginx Security Headers

```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; frame-src <crypto-provider-origin>; img-src 'self' data: blob:;
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
Cross-Origin-Opener-Policy: same-origin
server_tokens off;
```

> **Note:** `frame-src` must be updated to match the chosen crypto payment provider's origin if using iframe/modal checkout.

### Admin Access Lockdown

- Medusa admin (`/app`) — Nginx IP restriction to operator only + strong password + **MFA enabled** + login rate-limited
- Uptime Kuma dashboard — IP-restricted
- GlitchTip dashboard — IP-restricted
- Crypto payment provider admin — IP-restricted + **2FA enabled** (critical — direct financial asset)
- SSH — key-only auth (no passwords), operator IP only, non-standard port
- **WireGuard VPN** on the VPS for remote admin access when operator IP changes. Admin interfaces restricted to VPN subnet (`10.x.x.x`) as primary, with operator static IP as fallback

### Data Privacy

| Data | Protection |
|------|-----------|
| Customer PII (name, address, email) | LUKS volume encryption at rest + HMAC-keyed hash columns for searchable lookups |
| Passwords | bcrypt hashed (Medusa default) |
| Payment card data | Never touches server — handled by merchant processor (PCI compliant) |
| Crypto payments | Self-hosted or privacy-respecting provider — funds go to operator wallets |
| Order history | Auto-purge default 12 months (anonymize name/address, retain order totals for accounting) |
| Server logs | Two paths: raw (full IPs, short retention, fail2ban only) + sanitized (last octet stripped, longer retention, debugging) |

### Operator Privacy

- Vultr paid with crypto — no direct financial link to operator
- `.is` domain — Iceland doesn't publish WHOIS for individuals
- Cloudflare proxies all traffic — origin IP undiscoverable from domain
- No Google Analytics, Facebook pixels, or third-party tracking scripts
- **Google Fonts self-hosted via `next/font/google`** — no outbound requests to Google
- Privacy-respecting transactional email provider (e.g., Postal self-hosted, or Forwardemail) — **not** self-hosted Postfix (deliverability too difficult)
- Admin access IP-restricted — login pages not publicly visible
- `.env` files: `600` permissions, owned by root, never committed to git, excluded from backups

### Known OPSEC Tradeoffs (acknowledged, not solvable in software)

- **Shipping API (EasyPost):** Requires account with real identity for label generation. Return address on labels is a physical OPSEC concern. Operator accepts this tradeoff.
- **Card payment processor:** High-risk merchant accounts require KYC/KYB documentation. Operator identity is known to the processor.
- **Cloudflare account:** Tied to an email. If subpoenaed, origin IP discoverable from account records. Acceptable residual risk.

### SSL/TLS

- Cloudflare handles public SSL (automatic, free)
- Cloudflare Origin Certificate on Nginx (encrypted Cloudflare ↔ server), TLS 1.2+ enforced, modern cipher suites only
- Internal Docker services communicate over internal network (no TLS needed between containers on same host)

### Incident Response

- Suspected breach: snapshot server immediately for forensics, spin up fresh VPS from last clean backup, rotate all credentials
- Crypto wallet seeds stored encrypted offline with operator-held key — recoverable even if server compromised
- Database backups encrypted with `age` — public key on server encrypts, private key only on operator's offline machine decrypts. Stolen backup useless without private key.

---

## Technology Summary

| Component | Technology |
|-----------|-----------|
| Frontend | Next.js 16 (`output: "standalone"`), React 19, TypeScript, Tailwind CSS 4, Framer Motion |
| Backend | Medusa.js v2 (headless e-commerce, module provider architecture) |
| Database | PostgreSQL 16 (LUKS-encrypted volume, HMAC hash columns for PII search) |
| Cache/Queue | Redis (AOF persistence, `requirepass` enabled) |
| Crypto Payments | Provider TBD — BTCPay Server (BTC + LTC native), or NOWPayments/CoinGate for broader coin support. Adapter interface in Medusa module allows swapping. |
| Card Payments | High-risk merchant processor (operator to select before checkout feature is built) |
| Shipping | EasyPost API |
| Hosting | Vultr VPS 320GB NVMe (Docker Compose) |
| CDN/Security | Cloudflare (WAF, DDoS, DNS, CDN) |
| Monitoring | Uptime Kuma + external backup monitor, GlitchTip (error tracking), fail2ban, custom cron scripts, synthetic transaction checks |
| Dev Agents | Claude Code custom agents: `pm-agent` (main-thread), `frontend-agent` (subagent), `backend-agent` (subagent) |
| Domain | `.is` TLD via Cloudflare DNS |
| VPN | WireGuard (for remote admin access) |
| Backups | `age` asymmetric encryption, daily DB dumps, weekly VPS snapshots |
