# Medusa Backend Automation System — Design Spec (v2)

**Date:** 2026-04-27
**Status:** Draft
**Scope:** Backend automation for AlaskaLabs Medusa v2 — order lifecycle, customer management, emails, evidence capture, and future-proofing for third-party fraud/chargeback tools

---

## Guiding Principle

Medusa is the single source of truth for everything: orders, customers, carts, inventory, emails, and order evidence. No external CRM. No duplicate data stores. Every customer interaction flows through Medusa, even guest checkouts. Third-party tools (Disputifier, MaxMind, payment processor) plug into Medusa via adapters — Medusa stays the hub.

---

## Overview

### What We're Building

1. **Order Lifecycle** — Full state machine: placed → confirmed → shipped → delivered, with automated triggers at each stage
2. **Customer Resolution** — Every guest order auto-creates/links a backend customer record by email. Full order history for every email address, whether they have an account or not.
3. **Transactional Emails** — Automated emails at every order stage (Resend in production, console logger in dev)
4. **Evidence Capture** — Lightweight per-order metadata (IP, user agent, emails sent, tracking, delivery proof) for chargeback disputes
5. **Customer Tagging** — Auto-segment customers (new, repeat, VIP)
6. **Abandoned Cart Recovery** — Single recovery email for carts with an email that go stale (build in week 2-3)
7. **Reorder Reminders** — Peptide cycle-timed follow-up (build in month 2-3 once you have real data)

### What We're NOT Building

- ~~Custom fraud scoring engine~~ — Disputifier and your payment processor handle this. They have network-level data across thousands of merchants. Building your own at low volume is wasted effort.
- ~~Fraud rules engine / blocklist tables~~ — Processor + Disputifier manage blocking. When they're connected, their webhooks can feed into Medusa order metadata.
- ~~Fraud log module~~ — Disputifier tracks this. Evidence capture covers what you need on your side.

### Fraud & Chargeback Strategy (No Custom Code Needed)

These are configured at the processor/service level, not built in Medusa:

| Protection | Where It Lives | Cost |
|------------|---------------|------|
| AVS + CVV enforcement | Payment processor gateway settings | Free |
| 3D Secure (3DS) | Payment processor gateway settings | Free — shifts liability to card issuer |
| Clear billing descriptor | Processor account config ("ALASKALABS") | Free |
| Chargeback alerts (Verifi/Ethoca) | Disputifier | Pay-per-alert or bundled |
| Automated dispute responses | Disputifier | 20% of won chargebacks, capped $250 |
| Fraud scoring | Disputifier fraud prevention or MaxMind | Included or ~$0.005/query |

When Disputifier/processor send webhooks (chargeback filed, fraud flagged), a Medusa subscriber catches them and updates the order metadata. That's the only fraud-related code we write.

---

## Architecture

```
Events (Medusa core)
    |
    v
Subscribers (src/subscribers/)
    |
    v
Workflows (src/workflows/)
    |
    v
Medusa Core APIs + Email Provider
```

No custom data modules. Everything uses Medusa's built-in order metadata, customer metadata, and customer groups for storage. This keeps the codebase simple and leverages what Medusa already provides.

### Subscribers (event listeners)

| Subscriber | Trigger Event | What It Does |
|------------|--------------|--------------|
| `order-placed.ts` | `order.placed` | Customer resolve → customer tag → confirmation email → evidence capture |
| `order-shipped.ts` | `order.fulfillment_created` | Shipping email → update order metadata with tracking |
| `order-delivered.ts` | Custom event or manual trigger | Delivery email → schedule reorder reminder |
| `cart-updated.ts` | `cart.updated` | Tracks last-updated timestamp for abandonment detection |

### Workflows

| Workflow | Purpose |
|----------|---------|
| `customer-resolve` | Find or create customer record from order email |
| `customer-tagging` | Auto-apply tags based on order history |
| `send-transactional-email` | Send email via provider + log to order metadata |
| `order-evidence-capture` | Store IP, user agent, timestamps as order metadata |
| `abandoned-cart-recovery` | Send recovery email for stale carts |
| `reorder-reminder` | Send replenishment email based on delivery date |

### Jobs (scheduled)

| Job | Schedule | Purpose |
|-----|----------|---------|
| `cart-cleanup` | Every 15 min | Find abandoned carts, trigger recovery email |
| `reorder-scan` | Daily 10am | Find orders due for reorder reminder |

---

## System 1: Order Lifecycle

### State Flow

```
order.placed
    |
    v
order confirmed (auto — payment captured by processor)
    |
    v
order.fulfillment_created (you ship it, add tracking)
    |
    v
order.delivered (tracking webhook or manual update)
```

Every state transition fires a Medusa event. Subscribers react to each event and trigger the appropriate workflows (email, evidence update, tagging, etc.).

No custom fraud hold/approve flow. The processor and Disputifier handle fraud decisions before the charge even reaches Medusa. If payment succeeds, the order is legit as far as Medusa is concerned.

---

## System 2: Customer Resolution

### The Rule

**Every email that places an order gets a customer record in Medusa.** No exceptions, no orphaned guest orders.

### Workflow: customer-resolve

Triggered by `order.placed`:

1. Extract email from order
2. Query Medusa: does a customer with this email exist?
3. **If no** → create customer record:
   - `email`: from order
   - `first_name`, `last_name`: from shipping address
   - No password (guest record)
   - `metadata.source`: "guest_checkout"
   - `metadata.first_order_date`: now
4. **If yes** → link order to existing customer
5. Update customer `metadata.last_order_date`: now
6. Update customer `metadata.total_orders`: increment
7. Update customer `metadata.lifetime_spend`: add order total

### Account Registration Later

When a guest later creates an account with the same email:
- Medusa's auth system creates credentials for the existing customer record
- All previous orders are already linked
- No data migration needed

### What This Gives You

- Full order history per email in Medusa admin
- Customer lifetime value tracking
- Ability to look up any customer's complete history by email
- Seamless guest-to-registered upgrade path

---

## System 3: Transactional Emails

### Email Provider

**Development:** `console` provider — logs email to stdout (subject, to, data). No third-party dependency needed to build and test.

**Production:** Resend (3,000/mo free tier, $20/mo after that). Drop-in swap via environment variable.

```typescript
// Provider interface
interface EmailProvider {
  send(input: {
    to: string
    subject: string
    template: string
    data: Record<string, any>
  }): Promise<{ success: boolean; messageId?: string }>
}
```

### Email Flows

**Order Confirmed** — trigger: `order.placed`
- Subject: "AlaskaLabs — Order #{{display_id}} Confirmed"
- Data: items, totals, shipping address
- Also includes: billing descriptor reminder ("You'll see ALASKALABS on your statement")

**Order Shipped** — trigger: `order.fulfillment_created`
- Subject: "AlaskaLabs — Order #{{display_id}} Shipped"
- Data: tracking number, carrier, tracking URL

**Order Delivered** — trigger: delivery event
- Subject: "AlaskaLabs — Order #{{display_id}} Delivered"
- Data: delivery date, link to support/contact page

**Abandoned Cart** — trigger: `cart-cleanup` job (build week 2-3)
- Subject: "AlaskaLabs — You Left Something Behind"
- Data: cart items, link back to cart
- Rules: 1 email max per cart. Email must exist on cart. Cart inactive 1+ hour.

**Reorder Reminder** — trigger: `reorder-scan` job (build month 2-3)
- Subject: "AlaskaLabs — Time to Restock?"
- Data: previous items, direct product links
- Rules: 1 reminder per order. 25 days post-delivery. Skip if already reordered.

### Email Evidence Logging

Every email sent gets logged to the order's metadata:

```json
{
  "emails_sent": [
    { "type": "order_confirmed", "sent_at": "2026-04-27T14:30:00Z", "message_id": "re_abc123" },
    { "type": "order_shipped", "sent_at": "2026-04-28T09:15:00Z", "message_id": "re_def456" }
  ]
}
```

This serves as evidence for chargeback disputes — proof the customer was communicated with.

---

## System 4: Evidence Capture

### Approach

No custom module. All evidence stored as **order metadata** in Medusa's built-in order system. Simple, no extra tables, queryable via Medusa admin API.

### What Gets Captured

**At order.placed:**
```json
{
  "evidence": {
    "ip_address": "203.0.113.42",
    "user_agent": "Mozilla/5.0 ...",
    "accept_language": "en-US",
    "checkout_completed_at": "2026-04-27T14:30:00Z"
  }
}
```

**At fulfillment (shipping):**
```json
{
  "evidence": {
    "shipping_carrier": "USPS",
    "tracking_number": "9400111899223456789012",
    "shipped_at": "2026-04-28T09:15:00Z"
  }
}
```

**At delivery:**
```json
{
  "evidence": {
    "delivered_at": "2026-04-30T14:00:00Z",
    "delivery_proof": "https://tools.usps.com/..."
  }
}
```

**Emails sent** (from System 3) are also in order metadata.

### Why This Is Enough

For a chargeback dispute, you need to show:
1. The customer placed the order (IP, timestamp)
2. You communicated with them (email log)
3. You shipped it (carrier, tracking)
4. It was delivered (delivery proof)

All of this lives on the order record. When a dispute comes in, you pull the order from Medusa and you have everything. No separate vault needed.

---

## System 5: Customer Tagging

### Workflow: customer-tagging

Triggered by `order.placed` (after customer-resolve):

| Tag | Condition | Stored As |
|-----|-----------|-----------|
| `new_customer` | First order from this email | Customer group |
| `repeat_customer` | 2+ orders | Customer group (replaces `new_customer`) |
| `vip` | Lifetime spend > $500 | Customer group |

Three tags. That's it. Clean, useful, not over-engineered.

### What This Gives You

- Filter customers by segment in Medusa admin
- Target email campaigns by group (when you build marketing emails later)
- Quickly identify your best customers

---

## System 6: Abandoned Cart Recovery (Week 2-3)

### Job: cart-cleanup (runs every 15 minutes)

1. Query carts where:
   - `email` is set
   - Has at least 1 line item
   - `updated_at` is more than 1 hour ago
   - No completed order linked
   - `metadata.recovery_email_sent` is not true
2. For each: send abandoned cart email, set `metadata.recovery_email_sent: true`

### Rules
- 1 email per cart. No drip sequence.
- Respects the customer — one gentle nudge, not harassment.

---

## System 7: Reorder Reminders (Month 2-3)

### Job: reorder-scan (runs daily)

1. Query orders where:
   - Status is delivered
   - `metadata.evidence.delivered_at` is ~25 days ago
   - `metadata.reorder_reminder_sent` is not true
2. For each: check if customer has ordered same products since delivery
3. If no → send reorder reminder, set `metadata.reorder_reminder_sent: true`

### Why Wait

You need real delivery data to calibrate timing. 25 days is a guess based on typical peptide research cycles. After a couple months of real orders, you'll know if it should be 20 or 30.

---

## Frontend Requirements

For the backend to work, the checkout flow must pass to Medusa:

| Data | How | Why |
|------|-----|-----|
| `email` | Required checkout field (captured first) | Customer resolution, emails, cart recovery |
| `ip_address` | Server-side from request headers | Evidence capture |
| `user_agent` | Server-side from request headers | Evidence capture |
| `accept_language` | Server-side from request headers | Evidence capture |

These get stored as order metadata. This is a small frontend change — a separate spec covers the full frontend wiring.

---

## Build Phases

### Phase 1: Core Backend (Build Now)
- Order lifecycle subscribers (placed, shipped, delivered)
- Customer resolution workflow (guest email → customer record)
- Customer tagging workflow (new, repeat, VIP)
- Evidence capture (order metadata)
- Transactional email workflow with console provider
- Email templates (confirmed, shipped, delivered)

### Phase 2: Email Provider (When Ready)
- Swap console provider for Resend
- Test real email delivery
- Configure billing descriptor with processor

### Phase 3: Cart Recovery (Week 2-3)
- Cart cleanup job
- Abandoned cart email template
- Test with real carts

### Phase 4: Reorder Reminders (Month 2-3)
- Reorder scan job
- Reorder email template
- Calibrate timing from real data

### Phase 5: Third-Party Integrations (When Approved)
- Disputifier webhook subscriber (catches chargeback/fraud events, updates order metadata)
- Payment processor module (MAC Payments gateway — depends on which gateway they assign)
- AVS/CVV/3DS configuration at gateway level

---

## File Structure

```
medusa/src/
  workflows/
    customer-resolve/
      index.ts                    # Find or create customer from order email
      steps/
        find-or-create-customer.ts
        link-order-to-customer.ts
        update-customer-stats.ts
    customer-tagging/
      index.ts                    # Apply tags based on order history
      steps/
        calculate-tags.ts
        apply-tags.ts
    send-email/
      index.ts                    # Send email + log to order metadata
      steps/
        send-via-provider.ts
        log-email-to-order.ts
    evidence-capture/
      index.ts                    # Store request data as order metadata
      steps/
        extract-request-data.ts
        save-to-order-metadata.ts
    cart-recovery/                 # Phase 3
      index.ts
      steps/
        find-abandoned-carts.ts
        send-recovery-email.ts
    reorder-reminder/              # Phase 4
      index.ts
      steps/
        find-due-orders.ts
        check-reorder-status.ts
        send-reminder-email.ts
  subscribers/
    order-placed.ts               # Orchestrates: resolve → tag → evidence → email
    order-shipped.ts              # Evidence update (tracking) + shipping email
    order-delivered.ts            # Evidence update (delivery) + delivery email
  jobs/
    cart-cleanup.ts               # Phase 3: abandoned cart scanner
    reorder-scan.ts               # Phase 4: reorder reminder scanner
  email/
    providers/
      console.ts                  # Dev: logs to stdout
      resend.ts                   # Prod: sends via Resend API
    templates/
      order-confirmed.ts
      order-shipped.ts
      order-delivered.ts
      cart-recovery.ts            # Phase 3
      reorder-reminder.ts         # Phase 4
```

---

## Configuration

| Setting | Default | Location |
|---------|---------|----------|
| Email provider | `console` | env: `EMAIL_PROVIDER` |
| Resend API key | — | env: `RESEND_API_KEY` |
| From address | `orders@alaskalabs.is` | env: `EMAIL_FROM` |
| Abandoned cart delay | 60 min | env: `CART_ABANDON_DELAY_MIN` |
| Reorder reminder delay | 25 days | env: `REORDER_REMINDER_DAYS` |
| VIP spend threshold | $500 | env: `VIP_SPEND_THRESHOLD` |
