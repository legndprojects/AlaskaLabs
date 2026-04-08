# Shop Pages & Full Storefront Design

**Date:** 2026-04-08
**Status:** Approved
**Project:** AlaskaLabs Peptide Storefront
**Depends on:** Plan 1 (Frontend Foundation) + Plan 2 (Medusa Backend Setup)
**Blocks:** Plan 4 (Payment Integration)

---

## Overview

Build the complete storefront for AlaskaLabs: product listing, product detail pages, cart, checkout, account pages, and static content pages. Light theme (white background, dark text, arctic blue accents) on all shop pages. The existing landing page remains unchanged.

---

## 1. Pages & Routes

| Route | Type | Purpose |
|-------|------|---------|
| `/shop` | Server Component | Product grid — all products with cards |
| `/shop/[handle]` | Server + Client hybrid | Product detail — conversion-optimized Layout B |
| `/cart` | Client Component | Cart page — line items, quantities, shipping progress bar |
| `/checkout` | Client Component | Single-page accordion: Shipping → Payment → Review |
| `/checkout/success` | Server Component | Order confirmation + optional account creation |
| `/account/login` | Client Component | Login + register forms |
| `/account` | Client Component | Dashboard — order history |
| `/account/orders/[id]` | Server + Client hybrid | Order detail |
| `/about` | Server Component | Brand story |
| `/faq` | Server Component | Common questions accordion |
| `/contact` | Client Component | Contact form |

---

## 2. Design System (Light Theme)

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| Background | `#ffffff` | Page backgrounds |
| Surface | `#f5f5f5` | Cards, sections, input backgrounds |
| Text primary | `#1a1a1a` | Headings, important text |
| Text body | `#444444` | Body text, descriptions |
| Text secondary | `#888888` | Labels, captions, metadata |
| Accent | `#0072BC` | Links, selected states, badges, secondary CTAs |
| CTA | `#1a1a1a` | Primary buttons (black with white text) |
| Trust badge bg | `#f0f7ff` | Light blue background for trust indicators |
| Trust badge text | `#0072BC` | Blue text in trust badges |
| Danger | `#E31C23` | Errors, required fields, sale prices |
| Border | `#eeeeee` | Dividers, card borders |

### Typography

- **Headings:** Bebas Neue (`font-display`) — product titles, section headers, page titles
- **Body:** System sans-serif (`font-sans`) — descriptions, forms, UI text
- **Uppercase tracking:** Applied to category labels and small badges (`tracking-[2px]` or `tracking-[3px]`)

### Components

- **Primary CTA:** Black (`#1a1a1a`), white text, `rounded-lg` (8px), medium padding. Price shown in button text where applicable.
- **Secondary CTA:** Arctic blue (`#0072BC`), white text, `rounded-lg`.
- **Outline button:** White bg, `#ddd` border, dark text. Used for unselected variant options.
- **Selected variant:** `#0072BC` border, light blue bg (`rgba(0,114,188,0.05)`), blue text.
- **Cards:** White bg, `rounded-xl` (12px), subtle shadow or `#eee` border.
- **Trust badges:** `#f0f7ff` bg, `#0072BC` text, `rounded` (4px), small text.
- **Inputs:** `#f5f5f5` bg, `rounded-lg`, dark text, `#0072BC` focus ring.

### Navbar (Adaptive)

The Navbar component detects the current route:
- **Landing page (`/`):** Current dark/transparent style with backdrop blur (unchanged)
- **All other pages:** White background, dark text (`#1a1a1a`), arctic blue cart icon and links. Bottom border `#eee`.

Links on shop navbar: AlaskaLabs (logo/home), Shop, About, FAQ, Cart icon with count, Account icon.

### Footer (New — Sitewide)

Present on every page. Contains:
- AlaskaLabs logo
- Navigation: Shop, About, FAQ, Contact
- "For research and laboratory use only. Not for human consumption." disclaimer
- Payment method icons (placeholder — Visa, MC, BTC, ETH)
- Copyright line

---

## 3. Product Listing Page (`/shop`)

### Data Fetching

Server Component. Fetches products from Medusa Store API:
```
medusa.store.product.list({ limit: 50 })
```

Requires `x-publishable-api-key` header (handled by SDK config).

### Layout

- Page title: "Shop" (Bebas Neue)
- Subtitle: "Research Peptides" (secondary text)
- Product grid: 3 columns on desktop, 2 on tablet, 1 on mobile
- No filtering or search (only 3 products — not needed)

### ProductCard Component

Each card shows:
- Product thumbnail (or placeholder bottle image)
- Product title (Bebas Neue)
- Price range ("From $12.00") derived from variant prices
- Category badge ("Peptide")
- "View Product" link → `/shop/[handle]`

Cards have hover effect: subtle shadow increase + slight scale.

---

## 4. Product Detail Page (`/shop/[handle]`)

### Data Fetching

Server Component fetches product by handle:
```
medusa.store.product.list({ handle })
```

Page uses Next.js 16 async params pattern:
```typescript
async function Page({ params }: { params: Promise<{ handle: string }> })
```

### Layout: Conversion-Optimized (Layout B)

Two-column on desktop (image left, buy box right). Single column stacked on mobile.

**Left column — Product Image:**
- Large product image on light blue gradient background (`#f0f7ff` to `#e8f4fd`)
- "BEST SELLER" badge if applicable (top-left, blue bg, white text)
- Placeholder: existing bottle-static.png until real product photos

**Right column — Buy Box:**
- Product title (Bebas Neue, large)
- Price (bold, large) with optional strikethrough for sale prices
- **Size selector** — bordered pills showing each variant with its price visible:
  - Unselected: gray border, gray text
  - Selected: `#0072BC` border, blue text, light blue bg
- **CTA button:** "ADD TO CART — $20.00" (black bg, white text, full-width, rounded)
  - Price updates when variant changes
- **Trust badge grid** (2x2):
  - 🔬 Lab Tested
  - 📋 COA Included
  - 🇺🇸 USA Made
  - 📦 Discreet Shipping
- **Shipping note:** "Free shipping over $150" + "Discreet packaging"

**Below the fold (full-width):**

- **COA Section:**
  - Inline stats: "Purity: ≥99% | Third-Party Tested | Lot #: [current]"
  - "View Certificate of Analysis (PDF)" button
  - (Placeholder for now — actual COA PDFs added when available)

- **Education Accordions** (collapsible):
  - "How It Works" — mechanism of action
  - "Research" — citations and links
  - "Handling & Storage" — reconstitution, temperature, shelf life

- **Research Disclaimer:**
  - Styled box: "This product is intended for research and laboratory use only. Not for human consumption. By purchasing, you agree to our Terms of Service."

### Sticky Add-to-Cart (Mobile)

When the primary CTA scrolls out of view on mobile, a sticky bottom bar appears with:
- Product title (truncated)
- Price
- "Add to Cart" button

---

## 5. Cart Page (`/cart`)

### Data Source

Client Component. Uses `cart-context.tsx` (already built). Cart state from Medusa via SDK.

### Layout

- Page title: "Your Cart"
- **Line items list:** Each item shows thumbnail, title, variant (size), unit price, quantity selector (- / count / +), line total, remove button
- **Free shipping progress bar:** Shows progress toward $150 threshold. "You're $X away from free shipping!" or "You've earned free shipping!" with a filled progress bar.
- **Cart summary:** Subtotal, shipping estimate, total
- **"Continue to Checkout"** CTA button (black, full-width)
- **"Continue Shopping"** secondary link back to `/shop`
- **Empty cart state:** "Your cart is empty" message with link to shop

### Cart Drawer

Already wired in `cart-context.tsx` with `isDrawerOpen` state. The drawer slides in from the right when an item is added. Shows a mini version of the cart (items + subtotal + "View Cart" + "Checkout" buttons).

---

## 6. Checkout Page (`/checkout`)

### Layout: Single-Page Accordion

Three collapsible sections on one page. Each section collapses to a summary line after completion. Step indicator at top: `Shipping → Payment → Review & Place Order`.

**Section 1 — Shipping:**
- Email (first field — for abandoned cart recovery potential)
- First name, Last name
- Address line 1, Address line 2
- City, State/Province, Postal code, Country (US default)
- Phone (optional)
- Shipping method selector: "Standard Shipping — $5.99" (or "Free" if over $150)
- "Continue to Payment" button

**Section 2 — Payment:**
- Manual payment for dev (shows "Payment will be processed" message)
- Payment method selector structure ready for real providers (Plan 4)
- "Continue to Review" button

**Section 3 — Review & Place Order:**
- Order summary: all items, shipping, total
- Shipping address summary
- Payment method summary
- TOS agreement line: "By placing this order, you agree to our Terms of Service and confirm these products are for research purposes only."
- "Place Order" CTA button (black, full-width, large)

### Guest Checkout

No account required. Email is collected for order communication. After successful checkout, the success page offers optional account creation.

---

## 7. Checkout Success (`/checkout/success`)

- Order confirmation number
- "Thank you for your order" message
- Order summary (items, total, shipping address)
- Estimated delivery: "Most orders ship within 1 business day"
- **Post-purchase account creation:** "Want to track your order? Set a password:" — single password field + button. Pre-filled with checkout email.
- "Continue Shopping" link

---

## 8. Account Pages

### `/account/login`

- Tab toggle: "Sign In" | "Create Account"
- **Sign In:** Email + Password + Submit + "Forgot password?" link
- **Create Account:** First name + Last name + Email + Password + Submit
- After login/register: redirect to `/account` (or to the `redirect` query param from proxy.ts)

### `/account`

- Welcome message with customer name
- **Order history:** List of past orders (order number, date, total, status)
- Each order links to `/account/orders/[id]`
- "Log Out" button

### `/account/orders/[id]`

- Order details: items, quantities, prices
- Shipping address
- Order status
- Tracking number (when available — manual fulfillment shows "Processing")

---

## 9. Static Pages

### `/about`

- Brand story — AlaskaLabs origin, mission, quality commitment
- Uses Bebas Neue headings, clean typography
- Placeholder content that operator can customize later

### `/faq`

- Accordion-style Q&A sections:
  - **Products:** What are peptides? What is BPC-157? Are these safe?
  - **Shipping:** How long does shipping take? Do you ship internationally? Discreet packaging?
  - **Payments:** What payment methods do you accept? Do you offer crypto discounts?
  - **Returns:** What is your return policy?

### `/contact`

- Contact form: Name, Email, Subject, Message, Submit
- Or alternatively: just an email address and/or contact info
- Form submissions can be stored or emailed (implementation detail)

---

## 10. Data Flow Summary

| Page | Data Source | Rendering |
|------|-----------|-----------|
| `/shop` | `medusa.store.product.list()` | Server Component |
| `/shop/[handle]` | `medusa.store.product.list({ handle })` | Server Component + Client island for buy box |
| `/cart` | `cart-context.tsx` → Medusa Cart API | Client Component |
| `/checkout` | Cart context + Medusa checkout API | Client Component |
| `/checkout/success` | Order data from URL params or server fetch | Server Component |
| `/account/*` | `auth-context.tsx` → Medusa Customer API | Client Components |
| Static pages | Hardcoded content | Server Components |

---

## 11. New Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `ProductCard` | `src/components/ProductCard.tsx` | Grid card for `/shop` |
| `ProductDetail` | `src/components/ProductDetail.tsx` | Buy box (client island) |
| `VariantSelector` | `src/components/VariantSelector.tsx` | Size pills with prices |
| `TrustBadges` | `src/components/TrustBadges.tsx` | 2x2 trust grid |
| `COASection` | `src/components/COASection.tsx` | Certificate of Analysis display |
| `EducationAccordion` | `src/components/EducationAccordion.tsx` | Collapsible info sections |
| `ResearchDisclaimer` | `src/components/ResearchDisclaimer.tsx` | "Research use only" text |
| `StickyAddToCart` | `src/components/StickyAddToCart.tsx` | Mobile sticky CTA |
| `CartDrawer` | `src/components/CartDrawer.tsx` | Slide-out mini cart |
| `CartLineItem` | `src/components/CartLineItem.tsx` | Cart item row |
| `ShippingProgress` | `src/components/ShippingProgress.tsx` | Free shipping progress bar |
| `CheckoutAccordion` | `src/components/CheckoutAccordion.tsx` | 3-step checkout form |
| `Footer` | `src/components/Footer.tsx` | Sitewide footer |

---

## 12. Existing Code Changes

| File | Change |
|------|--------|
| `Navbar.tsx` | Add route detection: dark on `/`, white on all other routes. Add Shop/About/FAQ/Account links. |
| `layout.tsx` | Add Footer component below Providers children |
| `medusa-client.ts` | Already updated with session auth + publishable key (done in Plan 2) |

---

## 13. What This Does NOT Include

- Real payment processing (manual provider — Plan 4)
- Real shipping labels (manual fulfillment)
- Real product images (placeholder bottle until photos available)
- Customer reviews (not in scope)
- Search/filtering on `/shop` (only 3 products)
- Subscribe-and-save (post-launch)
- Privacy module / HMAC hashing (Plan 2.5)
- Internationalization / multi-currency
