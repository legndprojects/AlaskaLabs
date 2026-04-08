# Shop Pages & Full Storefront Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the complete AlaskaLabs storefront — product listing, product detail, cart, checkout, account pages, and static pages — on a light theme with conversion-optimized product pages.

**Architecture:** Server Components for data fetching (product listing, product detail), Client Components for interactive elements (buy box, cart, checkout forms). Medusa JS SDK fetches product/cart/customer data. Existing cart-context and auth-context provide client-side state. Adaptive navbar switches between dark (landing page) and light (shop pages).

**Tech Stack:** Next.js 16.2.2 (App Router), React 19, TypeScript, Tailwind CSS 4, @medusajs/js-sdk, Framer Motion

---

### Task 1: Footer component + layout integration

**Files:**
- Create: `src/components/Footer.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Create Footer.tsx**

Create `src/components/Footer.tsx`:

```tsx
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-white px-8 md:px-16 lg:px-24 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Logo */}
          <div>
            <Link
              href="/"
              className="text-2xl font-display tracking-[0.2em] uppercase"
            >
              AlaskaLabs
            </Link>
            <p className="text-sm text-gray-400 mt-4 font-sans leading-relaxed">
              The purest peptides, straight from the source.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-display text-sm tracking-[0.15em] uppercase mb-4">
              Shop
            </h4>
            <ul className="space-y-2 font-sans text-sm text-gray-400">
              <li>
                <Link href="/shop" className="hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-display text-sm tracking-[0.15em] uppercase mb-4">
              Company
            </h4>
            <ul className="space-y-2 font-sans text-sm text-gray-400">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-display text-sm tracking-[0.15em] uppercase mb-4">
              Legal
            </h4>
            <ul className="space-y-2 font-sans text-sm text-gray-400">
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer + Copyright */}
        <div className="border-t border-gray-700 pt-8">
          <p className="text-xs text-gray-500 font-sans mb-4">
            For research and laboratory use only. Not for human consumption. By
            using this website, you agree to our Terms of Service.
          </p>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-500 font-sans">
              &copy; {new Date().getFullYear()} AlaskaLabs. All rights reserved.
            </p>
            <div className="flex gap-3 text-xs text-gray-500 font-sans">
              <span>Visa</span>
              <span>Mastercard</span>
              <span>BTC</span>
              <span>ETH</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Add Footer to layout.tsx**

In `src/app/layout.tsx`, import and add Footer after the Providers wrapper:

Add import at top:
```typescript
import Footer from "@/components/Footer";
```

Update the body content:
```tsx
<body className="min-h-full">
  <Providers>{children}</Providers>
  <Footer />
</body>
```

- [ ] **Step 3: Verify build**

Run:
```bash
cd site && npm run build
```
Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/components/Footer.tsx src/app/layout.tsx
git commit -m "feat: add sitewide footer with nav links, disclaimer, and payment icons"
```

---

### Task 2: Adaptive Navbar for shop pages

**Files:**
- Modify: `src/components/Navbar.tsx`

- [ ] **Step 1: Update Navbar with route detection and shop links**

Replace `src/components/Navbar.tsx` with:

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import { useCart } from "@/lib/cart-context";

export default function Navbar() {
  const pathname = usePathname();
  const isLanding = pathname === "/";
  const { scrollYProgress } = useScroll();
  const { itemCount, openDrawer } = useCart();

  // Landing page: animated dark background
  const landingBg = useTransform(
    scrollYProgress,
    [0, 0.85, 0.95],
    ["rgba(5,13,26,0.3)", "rgba(5,13,26,0.3)", "rgba(139,0,0,0.4)"]
  );

  return (
    <motion.nav
      style={isLanding ? { backgroundColor: landingBg } : undefined}
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 backdrop-blur-xl ${
        isLanding
          ? "border-b border-white/10"
          : "bg-white border-b border-[#eee]"
      }`}
    >
      <Link
        href="/"
        className={`text-2xl font-display tracking-[0.2em] uppercase ${
          isLanding ? "text-white" : "text-[#1a1a1a]"
        }`}
      >
        AlaskaLabs
      </Link>

      <div className="flex items-center gap-6">
        {/* Shop links — hidden on landing page */}
        {!isLanding && (
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/shop"
              className={`text-sm font-sans transition-colors ${
                pathname.startsWith("/shop")
                  ? "text-[#0072BC]"
                  : "text-[#444] hover:text-[#1a1a1a]"
              }`}
            >
              Shop
            </Link>
            <Link
              href="/about"
              className={`text-sm font-sans transition-colors ${
                pathname === "/about"
                  ? "text-[#0072BC]"
                  : "text-[#444] hover:text-[#1a1a1a]"
              }`}
            >
              About
            </Link>
            <Link
              href="/faq"
              className={`text-sm font-sans transition-colors ${
                pathname === "/faq"
                  ? "text-[#0072BC]"
                  : "text-[#444] hover:text-[#1a1a1a]"
              }`}
            >
              FAQ
            </Link>
          </div>
        )}

        {/* Cart icon */}
        <button
          onClick={openDrawer}
          className={`relative transition-colors ${
            isLanding
              ? "text-white hover:text-prime-blue"
              : "text-[#1a1a1a] hover:text-[#0072BC]"
          }`}
          aria-label="Open cart"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
            />
          </svg>
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-prime-red text-white text-xs font-sans font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </button>

        {/* Shop Now (landing) or Account (shop pages) */}
        {isLanding ? (
          <Link
            href="/shop"
            className="px-6 py-2 text-sm font-display tracking-[0.15em] uppercase bg-white text-prime-blue rounded-full transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]"
          >
            Shop Now
          </Link>
        ) : (
          <Link
            href="/account"
            className="text-[#444] hover:text-[#1a1a1a] transition-colors"
            aria-label="Account"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
          </Link>
        )}
      </div>
    </motion.nav>
  );
}
```

- [ ] **Step 2: Verify build and dev server**

Run:
```bash
cd site && npm run build
```
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/Navbar.tsx
git commit -m "feat: adaptive navbar — dark on landing, white with shop links on other pages"
```

---

### Task 3: Shop page with product grid

**Files:**
- Create: `src/app/shop/page.tsx`
- Create: `src/components/ProductCard.tsx`

- [ ] **Step 1: Create ProductCard component**

Create `src/components/ProductCard.tsx`:

```tsx
import Link from "next/link";

interface ProductCardProps {
  handle: string;
  title: string;
  thumbnail: string | null;
  priceRange: string;
}

export default function ProductCard({
  handle,
  title,
  thumbnail,
  priceRange,
}: ProductCardProps) {
  return (
    <Link
      href={`/shop/${handle}`}
      className="group block bg-white rounded-xl border border-[#eee] overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
    >
      <div className="aspect-square bg-gradient-to-br from-[#f0f7ff] to-[#e8f4fd] flex items-center justify-center p-8">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          <div className="text-[#0072BC] text-center font-sans text-sm">
            Product Image
          </div>
        )}
      </div>
      <div className="p-6">
        <span className="text-xs font-sans uppercase tracking-[2px] text-[#0072BC] mb-2 block">
          Peptide
        </span>
        <h3 className="text-2xl font-display font-black uppercase text-[#1a1a1a] mb-2">
          {title}
        </h3>
        <p className="text-lg font-sans font-bold text-[#1a1a1a]">
          {priceRange}
        </p>
        <span className="inline-block mt-4 text-sm font-sans text-[#0072BC] group-hover:underline">
          View Product →
        </span>
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Create shop page**

Create `src/app/shop/page.tsx`:

```tsx
import { medusa } from "@/lib/medusa-client";
import ProductCard from "@/components/ProductCard";

export const metadata = {
  title: "Shop — AlaskaLabs",
  description: "Browse our collection of research peptides.",
};

function formatPriceRange(variants: any[]): string {
  if (!variants?.length) return "";
  const prices = variants
    .flatMap((v: any) => v.calculated_price?.calculated_amount ? [v.calculated_price.calculated_amount] : [])
    .filter(Boolean);
  if (!prices.length) {
    const fallbackPrices = variants
      .flatMap((v: any) => v.prices?.map((p: any) => p.amount) ?? [])
      .filter(Boolean);
    if (!fallbackPrices.length) return "";
    const min = Math.min(...fallbackPrices);
    const max = Math.max(...fallbackPrices);
    return min === max
      ? `$${(min / 100).toFixed(2)}`
      : `From $${(min / 100).toFixed(2)}`;
  }
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return min === max
    ? `$${(min / 100).toFixed(2)}`
    : `From $${(min / 100).toFixed(2)}`;
}

export default async function ShopPage() {
  let products: any[] = [];

  try {
    const response = await medusa.store.product.list({
      limit: 50,
      fields: "+variants.prices,+variants.calculated_price",
    });
    products = response.products || [];
  } catch {
    // Medusa might not be running — show empty state
  }

  return (
    <main className="min-h-screen bg-white pt-24 pb-16 px-8 md:px-16 lg:px-24">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-6xl md:text-8xl font-display font-black uppercase text-[#1a1a1a] mb-4">
          Shop
        </h1>
        <p className="text-lg font-sans text-[#888] mb-12">
          Research Peptides
        </p>

        {products.length === 0 ? (
          <p className="text-[#888] font-sans">
            No products available. Check back soon.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product: any) => (
              <ProductCard
                key={product.id}
                handle={product.handle}
                title={product.title}
                thumbnail={product.thumbnail}
                priceRange={formatPriceRange(product.variants)}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
```

- [ ] **Step 3: Verify build**

Run:
```bash
cd site && npm run build
```
Expected: Build succeeds. `/shop` route appears in the output.

- [ ] **Step 4: Verify in dev server**

Run:
```bash
cd site && npm run dev
```
Visit `http://localhost:3000/shop`. Expected: Page shows "Shop" heading with 3 product cards (BPC-157, TB-500, GHK-Cu) if Medusa is running, or "No products available" if not.

- [ ] **Step 5: Commit**

```bash
git add src/app/shop/page.tsx src/components/ProductCard.tsx
git commit -m "feat: add /shop page with product grid and ProductCard component"
```

---

### Task 4: Product detail page with buy box

**Files:**
- Create: `src/app/shop/[handle]/page.tsx`
- Create: `src/components/ProductDetail.tsx`
- Create: `src/components/VariantSelector.tsx`
- Create: `src/components/TrustBadges.tsx`

- [ ] **Step 1: Create TrustBadges component**

Create `src/components/TrustBadges.tsx`:

```tsx
export default function TrustBadges() {
  const badges = [
    { icon: "🔬", label: "Lab Tested" },
    { icon: "📋", label: "COA Included" },
    { icon: "🇺🇸", label: "USA Made" },
    { icon: "📦", label: "Discreet Ship" },
  ];

  return (
    <div className="grid grid-cols-2 gap-2">
      {badges.map((badge) => (
        <div
          key={badge.label}
          className="bg-[#f8f8f8] rounded px-3 py-2 text-center text-xs font-sans text-[#444]"
        >
          {badge.icon} {badge.label}
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Create VariantSelector component**

Create `src/components/VariantSelector.tsx`:

```tsx
"use client";

interface Variant {
  id: string;
  title: string;
  sku: string | null;
  options: Record<string, string> | null;
  calculated_price?: {
    calculated_amount: number;
    currency_code: string;
  } | null;
  prices?: { amount: number; currency_code: string }[];
}

interface VariantSelectorProps {
  variants: Variant[];
  selectedId: string | null;
  onSelect: (variantId: string) => void;
}

function getPrice(variant: Variant): number | null {
  if (variant.calculated_price?.calculated_amount != null) {
    return variant.calculated_price.calculated_amount;
  }
  if (variant.prices?.length) {
    return variant.prices[0].amount;
  }
  return null;
}

export default function VariantSelector({
  variants,
  selectedId,
  onSelect,
}: VariantSelectorProps) {
  return (
    <div>
      <p className="text-xs font-sans font-semibold text-[#666] uppercase tracking-wide mb-2">
        Select Size
      </p>
      <div className="flex gap-2">
        {variants.map((variant) => {
          const isSelected = variant.id === selectedId;
          const price = getPrice(variant);
          // Extract the size value from options
          const sizeValue = variant.options
            ? Object.values(variant.options)[0]
            : variant.title;

          return (
            <button
              key={variant.id}
              onClick={() => onSelect(variant.id)}
              className={`flex-1 border-2 rounded-lg px-4 py-3 text-center transition-all ${
                isSelected
                  ? "border-[#0072BC] bg-[rgba(0,114,188,0.05)] text-[#0072BC]"
                  : "border-[#ddd] text-[#666] hover:border-[#bbb]"
              }`}
            >
              <span className="block text-sm font-sans font-semibold">
                {sizeValue}
              </span>
              {price != null && (
                <span className="block text-xs font-sans mt-1">
                  ${(price / 100).toFixed(2)}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create ProductDetail (buy box) component**

Create `src/components/ProductDetail.tsx`:

```tsx
"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import VariantSelector from "./VariantSelector";
import TrustBadges from "./TrustBadges";

interface ProductDetailProps {
  product: any;
}

function getVariantPrice(variant: any): number | null {
  if (variant.calculated_price?.calculated_amount != null) {
    return variant.calculated_price.calculated_amount;
  }
  if (variant.prices?.length) {
    return variant.prices[0].amount;
  }
  return null;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const variants = product.variants || [];
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    variants[0]?.id || ""
  );
  const [isAdding, setIsAdding] = useState(false);
  const { addItem } = useCart();

  const selectedVariant = variants.find(
    (v: any) => v.id === selectedVariantId
  );
  const price = selectedVariant ? getVariantPrice(selectedVariant) : null;

  const handleAddToCart = async () => {
    if (!selectedVariantId) return;
    setIsAdding(true);
    try {
      await addItem(selectedVariantId, 1);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div>
      {/* Title */}
      <p className="text-xs font-sans uppercase tracking-[2px] text-[#0072BC] mb-1">
        Peptide
      </p>
      <h1 className="text-4xl md:text-5xl font-display font-black uppercase text-[#1a1a1a] mb-2">
        {product.title}
      </h1>
      <p className="text-sm font-sans text-[#888] mb-6">
        {product.subtitle || "Research Peptide"}
      </p>

      {/* Price */}
      {price != null && (
        <p className="text-3xl font-sans font-bold text-[#1a1a1a] mb-6">
          ${(price / 100).toFixed(2)}
        </p>
      )}

      {/* Variant Selector */}
      {variants.length > 1 && (
        <div className="mb-6">
          <VariantSelector
            variants={variants}
            selectedId={selectedVariantId}
            onSelect={setSelectedVariantId}
          />
        </div>
      )}

      {/* Add to Cart */}
      <button
        onClick={handleAddToCart}
        disabled={isAdding || !selectedVariantId}
        className="w-full bg-[#1a1a1a] text-white font-sans font-semibold text-sm tracking-wide py-4 rounded-lg transition-all hover:bg-[#333] disabled:opacity-50 disabled:cursor-not-allowed mb-4"
      >
        {isAdding
          ? "Adding..."
          : `ADD TO CART${price != null ? ` — $${(price / 100).toFixed(2)}` : ""}`}
      </button>

      {/* Trust Badges */}
      <div className="mb-6">
        <TrustBadges />
      </div>

      {/* Shipping note */}
      <div className="border-t border-[#eee] pt-4 text-sm font-sans text-[#888] space-y-1">
        <p>Free shipping on orders over $150</p>
        <p>Discreet packaging</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create the product detail page**

Create `src/app/shop/[handle]/page.tsx`:

```tsx
import { medusa } from "@/lib/medusa-client";
import ProductDetail from "@/components/ProductDetail";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  try {
    const { products } = await medusa.store.product.list({ handle });
    if (!products?.length) return { title: "Product Not Found — AlaskaLabs" };
    return {
      title: `${products[0].title} — AlaskaLabs`,
      description: products[0].description,
    };
  } catch {
    return { title: "Product — AlaskaLabs" };
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;

  let product: any = null;
  try {
    const { products } = await medusa.store.product.list({
      handle,
      fields: "+variants.prices,+variants.calculated_price",
    });
    product = products?.[0] || null;
  } catch {
    // Medusa not running
  }

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white pt-24 pb-16 px-8 md:px-16 lg:px-24">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Product Image */}
          <div className="aspect-square bg-gradient-to-br from-[#f0f7ff] to-[#e8f4fd] rounded-xl flex items-center justify-center p-12 relative">
            {product.thumbnail ? (
              <img
                src={product.thumbnail}
                alt={product.title}
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <div className="text-[#0072BC] text-center font-sans">
                Product Image
              </div>
            )}
          </div>

          {/* Right: Buy Box */}
          <div className="flex flex-col justify-center">
            <ProductDetail product={product} />
          </div>
        </div>

        {/* Below the fold */}
        <div className="mt-16 max-w-3xl">
          {/* Description */}
          {product.description && (
            <div className="mb-12">
              <h2 className="text-2xl font-display font-black uppercase text-[#1a1a1a] mb-4">
                About This Product
              </h2>
              <p className="text-base font-sans text-[#444] leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {/* COA Section */}
          <div className="mb-12 bg-[#f5f5f5] rounded-xl p-6">
            <h3 className="text-lg font-display font-black uppercase text-[#1a1a1a] mb-3">
              Purity & Testing
            </h3>
            <div className="flex flex-wrap gap-4 text-sm font-sans text-[#444] mb-4">
              <span className="bg-white px-3 py-1 rounded">
                Purity: ≥99%
              </span>
              <span className="bg-white px-3 py-1 rounded">
                Third-Party Tested
              </span>
              <span className="bg-white px-3 py-1 rounded">
                HPLC & Mass Spec Confirmed
              </span>
            </div>
            <button className="text-sm font-sans text-[#0072BC] hover:underline">
              View Certificate of Analysis (PDF) →
            </button>
          </div>

          {/* Research Disclaimer */}
          <div className="border border-[#eee] rounded-xl p-6">
            <p className="text-xs font-sans text-[#888] leading-relaxed">
              This product is intended for research and laboratory use only. Not
              for human consumption. By purchasing, you agree to our{" "}
              <a href="/terms" className="text-[#0072BC] hover:underline">
                Terms of Service
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 5: Verify build**

Run:
```bash
cd site && npm run build
```
Expected: Build succeeds. `/shop/[handle]` route appears.

- [ ] **Step 6: Verify in dev server**

Visit `http://localhost:3000/shop/bpc-157`. Expected: Product detail page with title, price, size selector, add to cart button, trust badges, description, COA section.

- [ ] **Step 7: Commit**

```bash
git add src/app/shop/[handle]/page.tsx src/components/ProductDetail.tsx src/components/VariantSelector.tsx src/components/TrustBadges.tsx
git commit -m "feat: add product detail page with buy box, variant selector, trust badges, COA section"
```

---

### Task 5: Cart drawer + cart page

**Files:**
- Create: `src/components/CartDrawer.tsx`
- Create: `src/components/CartLineItem.tsx`
- Create: `src/components/ShippingProgress.tsx`
- Create: `src/app/cart/page.tsx`

- [ ] **Step 1: Create CartLineItem component**

Create `src/components/CartLineItem.tsx`:

```tsx
"use client";

import { useCart } from "@/lib/cart-context";

interface CartLineItemProps {
  item: {
    id: string;
    variant_id: string;
    title: string;
    quantity: number;
    unit_price: number;
    thumbnail?: string;
  };
}

export default function CartLineItem({ item }: CartLineItemProps) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex gap-4 py-4 border-b border-[#eee]">
      {/* Thumbnail */}
      <div className="w-20 h-20 bg-[#f5f5f5] rounded-lg flex items-center justify-center flex-shrink-0">
        {item.thumbnail ? (
          <img
            src={item.thumbnail}
            alt={item.title}
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          <span className="text-xs text-[#888]">IMG</span>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-sans font-semibold text-[#1a1a1a] truncate">
          {item.title}
        </h4>
        <p className="text-sm font-sans text-[#888] mt-1">
          ${(item.unit_price / 100).toFixed(2)}
        </p>

        {/* Quantity controls */}
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => {
              if (item.quantity <= 1) {
                removeItem(item.id);
              } else {
                updateQuantity(item.id, item.quantity - 1);
              }
            }}
            className="w-7 h-7 rounded border border-[#ddd] flex items-center justify-center text-sm text-[#666] hover:bg-[#f5f5f5]"
          >
            −
          </button>
          <span className="text-sm font-sans font-medium text-[#1a1a1a] w-8 text-center">
            {item.quantity}
          </span>
          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="w-7 h-7 rounded border border-[#ddd] flex items-center justify-center text-sm text-[#666] hover:bg-[#f5f5f5]"
          >
            +
          </button>
        </div>
      </div>

      {/* Line total + remove */}
      <div className="flex flex-col items-end justify-between">
        <p className="text-sm font-sans font-bold text-[#1a1a1a]">
          ${((item.unit_price * item.quantity) / 100).toFixed(2)}
        </p>
        <button
          onClick={() => removeItem(item.id)}
          className="text-xs font-sans text-[#888] hover:text-[#E31C23] transition-colors"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create ShippingProgress component**

Create `src/components/ShippingProgress.tsx`:

```tsx
const FREE_SHIPPING_THRESHOLD = 15000; // $150.00 in cents

interface ShippingProgressProps {
  subtotalInCents: number;
}

export default function ShippingProgress({
  subtotalInCents,
}: ShippingProgressProps) {
  const remaining = FREE_SHIPPING_THRESHOLD - subtotalInCents;
  const progress = Math.min(
    (subtotalInCents / FREE_SHIPPING_THRESHOLD) * 100,
    100
  );
  const earned = remaining <= 0;

  return (
    <div className="bg-[#f5f5f5] rounded-lg p-4">
      {earned ? (
        <p className="text-sm font-sans text-[#0072BC] font-semibold text-center">
          ✓ You&apos;ve earned free shipping!
        </p>
      ) : (
        <p className="text-sm font-sans text-[#444] text-center mb-2">
          You&apos;re{" "}
          <span className="font-bold text-[#1a1a1a]">
            ${(remaining / 100).toFixed(2)}
          </span>{" "}
          away from free shipping!
        </p>
      )}
      <div className="w-full bg-[#ddd] rounded-full h-2 mt-2">
        <div
          className="bg-[#0072BC] h-2 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create CartDrawer component**

Create `src/components/CartDrawer.tsx`:

```tsx
"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import CartLineItem from "./CartLineItem";

export default function CartDrawer() {
  const { isDrawerOpen, closeDrawer, items, itemCount } = useCart();

  const subtotal = items.reduce(
    (sum, item) => sum + item.unit_price * item.quantity,
    0
  );

  return (
    <>
      {/* Backdrop */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-[60]"
          onClick={closeDrawer}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl transform transition-transform duration-300 ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#eee]">
            <h2 className="text-lg font-display font-black uppercase text-[#1a1a1a]">
              Cart ({itemCount})
            </h2>
            <button
              onClick={closeDrawer}
              className="text-[#888] hover:text-[#1a1a1a] transition-colors"
              aria-label="Close cart"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto px-6">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <p className="text-[#888] font-sans mb-4">
                  Your cart is empty
                </p>
                <Link
                  href="/shop"
                  onClick={closeDrawer}
                  className="text-sm font-sans text-[#0072BC] hover:underline"
                >
                  Continue Shopping →
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <CartLineItem key={item.id} item={item} />
              ))
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="px-6 py-4 border-t border-[#eee] space-y-3">
              <div className="flex justify-between text-sm font-sans">
                <span className="text-[#888]">Subtotal</span>
                <span className="font-bold text-[#1a1a1a]">
                  ${(subtotal / 100).toFixed(2)}
                </span>
              </div>
              <Link
                href="/cart"
                onClick={closeDrawer}
                className="block w-full text-center border border-[#1a1a1a] text-[#1a1a1a] font-sans font-semibold text-sm py-3 rounded-lg hover:bg-[#f5f5f5] transition-colors"
              >
                View Cart
              </Link>
              <Link
                href="/checkout"
                onClick={closeDrawer}
                className="block w-full text-center bg-[#1a1a1a] text-white font-sans font-semibold text-sm py-3 rounded-lg hover:bg-[#333] transition-colors"
              >
                Checkout
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
```

- [ ] **Step 4: Create cart page**

Create `src/app/cart/page.tsx`:

```tsx
"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import CartLineItem from "@/components/CartLineItem";
import ShippingProgress from "@/components/ShippingProgress";

export default function CartPage() {
  const { items, itemCount, isLoading } = useCart();

  const subtotal = items.reduce(
    (sum, item) => sum + item.unit_price * item.quantity,
    0
  );

  const shippingCost = subtotal >= 15000 ? 0 : 599; // $5.99 flat rate
  const total = subtotal + shippingCost;

  if (isLoading) {
    return (
      <main className="min-h-screen bg-white pt-24 pb-16 px-8 md:px-16 lg:px-24">
        <div className="max-w-3xl mx-auto">
          <p className="text-[#888] font-sans">Loading cart...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white pt-24 pb-16 px-8 md:px-16 lg:px-24">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-display font-black uppercase text-[#1a1a1a] mb-8">
          Your Cart
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg font-sans text-[#888] mb-6">
              Your cart is empty
            </p>
            <Link
              href="/shop"
              className="inline-block bg-[#1a1a1a] text-white font-sans font-semibold text-sm px-8 py-3 rounded-lg hover:bg-[#333] transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            {/* Shipping progress */}
            <div className="mb-8">
              <ShippingProgress subtotalInCents={subtotal} />
            </div>

            {/* Line items */}
            <div className="mb-8">
              {items.map((item) => (
                <CartLineItem key={item.id} item={item} />
              ))}
            </div>

            {/* Summary */}
            <div className="bg-[#f5f5f5] rounded-xl p-6 space-y-3">
              <div className="flex justify-between text-sm font-sans">
                <span className="text-[#888]">
                  Subtotal ({itemCount} items)
                </span>
                <span className="text-[#1a1a1a]">
                  ${(subtotal / 100).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-sans">
                <span className="text-[#888]">Shipping</span>
                <span className="text-[#1a1a1a]">
                  {shippingCost === 0 ? "Free" : `$${(shippingCost / 100).toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-sans font-bold border-t border-[#ddd] pt-3">
                <span className="text-[#1a1a1a]">Total</span>
                <span className="text-[#1a1a1a]">
                  ${(total / 100).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 space-y-3">
              <Link
                href="/checkout"
                className="block w-full text-center bg-[#1a1a1a] text-white font-sans font-semibold text-sm py-4 rounded-lg hover:bg-[#333] transition-colors"
              >
                Continue to Checkout
              </Link>
              <Link
                href="/shop"
                className="block w-full text-center text-sm font-sans text-[#0072BC] hover:underline"
              >
                ← Continue Shopping
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
```

- [ ] **Step 5: Add CartDrawer to Providers**

In `src/components/Providers.tsx`, import and add CartDrawer:

```tsx
"use client";

import type { ReactNode } from "react";
import { CartProvider } from "@/lib/cart-context";
import { AuthProvider } from "@/lib/auth-context";
import CartDrawer from "./CartDrawer";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        {children}
        <CartDrawer />
      </CartProvider>
    </AuthProvider>
  );
}
```

- [ ] **Step 6: Verify build**

Run:
```bash
cd site && npm run build
```
Expected: Build succeeds.

- [ ] **Step 7: Commit**

```bash
git add src/components/CartDrawer.tsx src/components/CartLineItem.tsx src/components/ShippingProgress.tsx src/app/cart/page.tsx src/components/Providers.tsx
git commit -m "feat: add cart drawer, cart page with line items and shipping progress bar"
```

---

### Task 6: Static pages (About, FAQ, Contact)

**Files:**
- Create: `src/app/about/page.tsx`
- Create: `src/app/faq/page.tsx`
- Create: `src/app/contact/page.tsx`

- [ ] **Step 1: Create About page**

Create `src/app/about/page.tsx`:

```tsx
export const metadata = {
  title: "About — AlaskaLabs",
  description: "Learn about AlaskaLabs and our commitment to purity.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white pt-24 pb-16 px-8 md:px-16 lg:px-24">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-6xl md:text-8xl font-display font-black uppercase text-[#1a1a1a] mb-8">
          About
        </h1>

        <div className="space-y-6 text-base font-sans text-[#444] leading-relaxed">
          <p>
            AlaskaLabs was founded with a single mission: deliver the purest
            research peptides available, with full transparency and zero
            compromise on quality.
          </p>
          <p>
            Every batch we produce undergoes rigorous third-party testing via
            HPLC and mass spectrometry analysis. We publish complete Certificates
            of Analysis for every product, so you always know exactly what
            you&apos;re getting.
          </p>
          <p>
            Our peptides are synthesized using solid-phase methodology in
            USA-based facilities, delivering consistent chain lengths and purity
            levels that exceed industry standards.
          </p>
          <p>
            We believe researchers deserve better than opaque sourcing and
            questionable quality. That&apos;s why we&apos;ve built AlaskaLabs from
            the ground up around transparency, testing, and trust.
          </p>
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Create FAQ page**

Create `src/app/faq/page.tsx`:

```tsx
"use client";

import { useState } from "react";

const faqs = [
  {
    category: "Products",
    questions: [
      {
        q: "What are peptides?",
        a: "Peptides are short chains of amino acids that serve as building blocks for proteins. They play crucial roles in various biological processes and are widely used in research settings.",
      },
      {
        q: "What is the purity of your peptides?",
        a: "All our peptides are ≥99% purity as verified by independent third-party HPLC and mass spectrometry analysis. We publish full Certificates of Analysis for every batch.",
      },
      {
        q: "Are these products for human consumption?",
        a: "No. All products sold by AlaskaLabs are intended for research and laboratory use only. They are not intended for human consumption.",
      },
    ],
  },
  {
    category: "Shipping",
    questions: [
      {
        q: "How long does shipping take?",
        a: "Most orders ship within 1 business day. Standard domestic delivery typically takes 3-5 business days.",
      },
      {
        q: "Do you offer free shipping?",
        a: "Yes! Orders over $150 qualify for free standard shipping within the United States.",
      },
      {
        q: "Is packaging discreet?",
        a: "Yes. All orders ship in plain, unmarked packaging with no product descriptions on the exterior.",
      },
    ],
  },
  {
    category: "Payments",
    questions: [
      {
        q: "What payment methods do you accept?",
        a: "We accept major credit/debit cards and cryptocurrency (BTC, ETH, LTC). Crypto payments receive a 5% discount.",
      },
      {
        q: "Is my payment information secure?",
        a: "Yes. Card payments are processed through PCI-compliant payment processors. Your card details never touch our servers.",
      },
    ],
  },
  {
    category: "Returns",
    questions: [
      {
        q: "What is your return policy?",
        a: "Due to the nature of our products, we cannot accept returns on opened items. Unopened items may be returned within 30 days of purchase for a full refund.",
      },
    ],
  },
];

export const metadata = {
  title: "FAQ — AlaskaLabs",
  description: "Frequently asked questions about AlaskaLabs products and services.",
};

function FAQItem({ q, a }: { q: string; a: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-[#eee]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 text-left"
      >
        <span className="text-base font-sans font-medium text-[#1a1a1a] pr-4">
          {q}
        </span>
        <span className="text-[#888] flex-shrink-0">{isOpen ? "−" : "+"}</span>
      </button>
      {isOpen && (
        <p className="pb-4 text-sm font-sans text-[#444] leading-relaxed">
          {a}
        </p>
      )}
    </div>
  );
}

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-white pt-24 pb-16 px-8 md:px-16 lg:px-24">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-6xl md:text-8xl font-display font-black uppercase text-[#1a1a1a] mb-8">
          FAQ
        </h1>

        <div className="space-y-10">
          {faqs.map((section) => (
            <div key={section.category}>
              <h2 className="text-xl font-display font-black uppercase text-[#1a1a1a] mb-4">
                {section.category}
              </h2>
              <div>
                {section.questions.map((faq) => (
                  <FAQItem key={faq.q} q={faq.q} a={faq.a} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 3: Create Contact page**

Create `src/app/contact/page.tsx`:

```tsx
export const metadata = {
  title: "Contact — AlaskaLabs",
  description: "Get in touch with AlaskaLabs.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white pt-24 pb-16 px-8 md:px-16 lg:px-24">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-6xl md:text-8xl font-display font-black uppercase text-[#1a1a1a] mb-8">
          Contact
        </h1>

        <div className="space-y-6 text-base font-sans text-[#444] leading-relaxed">
          <p>
            Have a question about our products or your order? We&apos;re here to
            help.
          </p>
          <div className="bg-[#f5f5f5] rounded-xl p-6">
            <h2 className="text-lg font-display font-black uppercase text-[#1a1a1a] mb-3">
              Email Us
            </h2>
            <a
              href="mailto:support@alaskalabs.is"
              className="text-[#0072BC] hover:underline font-sans"
            >
              support@alaskalabs.is
            </a>
            <p className="text-sm text-[#888] mt-2">
              We typically respond within 24 hours.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 4: Verify build**

Run:
```bash
cd site && npm run build
```
Expected: Build succeeds with `/about`, `/faq`, `/contact` routes.

- [ ] **Step 5: Commit**

```bash
git add src/app/about/page.tsx src/app/faq/page.tsx src/app/contact/page.tsx
git commit -m "feat: add About, FAQ, and Contact pages"
```

---

### Task 7: Account login page

**Files:**
- Create: `src/app/account/login/page.tsx`

- [ ] **Step 1: Create login/register page**

Create `src/app/account/login/page.tsx`:

```tsx
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, register } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/account";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(email, password, firstName, lastName);
      }
      router.push(redirect);
    } catch {
      setError(
        mode === "login"
          ? "Invalid email or password."
          : "Registration failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-white pt-24 pb-16 px-8 md:px-16 lg:px-24">
      <div className="max-w-md mx-auto">
        <h1 className="text-5xl font-display font-black uppercase text-[#1a1a1a] mb-8 text-center">
          Account
        </h1>

        {/* Tab toggle */}
        <div className="flex border border-[#eee] rounded-lg mb-8 overflow-hidden">
          <button
            onClick={() => { setMode("login"); setError(""); }}
            className={`flex-1 py-3 text-sm font-sans font-semibold transition-colors ${
              mode === "login"
                ? "bg-[#1a1a1a] text-white"
                : "bg-white text-[#888] hover:text-[#1a1a1a]"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setMode("register"); setError(""); }}
            className={`flex-1 py-3 text-sm font-sans font-semibold transition-colors ${
              mode === "register"
                ? "bg-[#1a1a1a] text-white"
                : "bg-white text-[#888] hover:text-[#1a1a1a]"
            }`}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-sans rounded-lg px-4 py-3 mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-sans font-semibold text-[#666] uppercase tracking-wide mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="w-full bg-[#f5f5f5] border-0 rounded-lg px-4 py-3 text-sm font-sans text-[#1a1a1a] focus:ring-2 focus:ring-[#0072BC] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-sans font-semibold text-[#666] uppercase tracking-wide mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="w-full bg-[#f5f5f5] border-0 rounded-lg px-4 py-3 text-sm font-sans text-[#1a1a1a] focus:ring-2 focus:ring-[#0072BC] focus:outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-sans font-semibold text-[#666] uppercase tracking-wide mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#f5f5f5] border-0 rounded-lg px-4 py-3 text-sm font-sans text-[#1a1a1a] focus:ring-2 focus:ring-[#0072BC] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-sans font-semibold text-[#666] uppercase tracking-wide mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full bg-[#f5f5f5] border-0 rounded-lg px-4 py-3 text-sm font-sans text-[#1a1a1a] focus:ring-2 focus:ring-[#0072BC] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#1a1a1a] text-white font-sans font-semibold text-sm py-4 rounded-lg hover:bg-[#333] transition-colors disabled:opacity-50"
          >
            {isSubmitting
              ? "Please wait..."
              : mode === "login"
              ? "Sign In"
              : "Create Account"}
          </button>
        </form>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Verify build**

Run:
```bash
cd site && npm run build
```

- [ ] **Step 3: Commit**

```bash
git add src/app/account/login/page.tsx
git commit -m "feat: add account login/register page with tab toggle"
```

---

### Task 8: Account dashboard and order pages

**Files:**
- Create: `src/app/account/page.tsx`
- Create: `src/app/account/orders/[id]/page.tsx`

- [ ] **Step 1: Create account dashboard**

Create `src/app/account/page.tsx`:

```tsx
"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const { customer, isLoading, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return (
      <main className="min-h-screen bg-white pt-24 pb-16 px-8 md:px-16 lg:px-24">
        <div className="max-w-3xl mx-auto">
          <p className="text-[#888] font-sans">Loading...</p>
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    router.push("/account/login");
    return null;
  }

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <main className="min-h-screen bg-white pt-24 pb-16 px-8 md:px-16 lg:px-24">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-5xl md:text-6xl font-display font-black uppercase text-[#1a1a1a]">
            Account
          </h1>
          <button
            onClick={handleLogout}
            className="text-sm font-sans text-[#888] hover:text-[#E31C23] transition-colors"
          >
            Log Out
          </button>
        </div>

        <p className="text-lg font-sans text-[#444] mb-8">
          Welcome back
          {customer?.first_name ? `, ${customer.first_name}` : ""}!
        </p>

        {/* Order history placeholder */}
        <div className="bg-[#f5f5f5] rounded-xl p-8 text-center">
          <h2 className="text-xl font-display font-black uppercase text-[#1a1a1a] mb-3">
            Order History
          </h2>
          <p className="text-sm font-sans text-[#888]">
            No orders yet.{" "}
            <Link href="/shop" className="text-[#0072BC] hover:underline">
              Start shopping →
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Create order detail page**

Create `src/app/account/orders/[id]/page.tsx`:

```tsx
export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-white pt-24 pb-16 px-8 md:px-16 lg:px-24">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-display font-black uppercase text-[#1a1a1a] mb-8">
          Order {id}
        </h1>
        <div className="bg-[#f5f5f5] rounded-xl p-8 text-center">
          <p className="text-sm font-sans text-[#888]">
            Order details will be available once checkout is implemented.
          </p>
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 3: Verify build**

Run:
```bash
cd site && npm run build
```

- [ ] **Step 4: Commit**

```bash
git add src/app/account/page.tsx src/app/account/orders/[id]/page.tsx
git commit -m "feat: add account dashboard and order detail page"
```

---

### Task 9: Checkout page (single-page accordion)

**Files:**
- Create: `src/app/checkout/page.tsx`
- Create: `src/app/checkout/success/page.tsx`

- [ ] **Step 1: Create checkout page**

Create `src/app/checkout/page.tsx`:

```tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";

type Step = "shipping" | "payment" | "review";

export default function CheckoutPage() {
  const { items, itemCount } = useCart();
  const [currentStep, setCurrentStep] = useState<Step>("shipping");
  const [shippingData, setShippingData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "US",
    phone: "",
  });

  const subtotal = items.reduce(
    (sum, item) => sum + item.unit_price * item.quantity,
    0
  );
  const shippingCost = subtotal >= 15000 ? 0 : 599;
  const total = subtotal + shippingCost;

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-white pt-24 pb-16 px-8 md:px-16 lg:px-24">
        <div className="max-w-2xl mx-auto text-center py-16">
          <h1 className="text-4xl font-display font-black uppercase text-[#1a1a1a] mb-4">
            Checkout
          </h1>
          <p className="text-[#888] font-sans mb-6">Your cart is empty.</p>
          <Link
            href="/shop"
            className="inline-block bg-[#1a1a1a] text-white font-sans font-semibold text-sm px-8 py-3 rounded-lg"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  const steps: { key: Step; label: string; number: number }[] = [
    { key: "shipping", label: "Shipping", number: 1 },
    { key: "payment", label: "Payment", number: 2 },
    { key: "review", label: "Review & Place Order", number: 3 },
  ];

  const currentIndex = steps.findIndex((s) => s.key === currentStep);

  return (
    <main className="min-h-screen bg-white pt-24 pb-16 px-8 md:px-16 lg:px-24">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-display font-black uppercase text-[#1a1a1a] mb-8">
          Checkout
        </h1>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-10">
          {steps.map((step, i) => (
            <div key={step.key} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-sans font-bold ${
                  i < currentIndex
                    ? "bg-[#0072BC] text-white"
                    : i === currentIndex
                    ? "bg-[#1a1a1a] text-white"
                    : "bg-[#eee] text-[#888]"
                }`}
              >
                {i < currentIndex ? "✓" : step.number}
              </div>
              <span
                className={`text-sm font-sans ${
                  i === currentIndex
                    ? "text-[#1a1a1a] font-semibold"
                    : "text-[#888]"
                }`}
              >
                {step.label}
              </span>
              {i < steps.length - 1 && (
                <div className="w-8 h-[1px] bg-[#ddd]" />
              )}
            </div>
          ))}
        </div>

        {/* Shipping step */}
        {currentStep === "shipping" && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-sans font-semibold text-[#666] uppercase tracking-wide mb-1">
                Email
              </label>
              <input
                type="email"
                value={shippingData.email}
                onChange={(e) =>
                  setShippingData({ ...shippingData, email: e.target.value })
                }
                required
                className="w-full bg-[#f5f5f5] border-0 rounded-lg px-4 py-3 text-sm font-sans text-[#1a1a1a] focus:ring-2 focus:ring-[#0072BC] focus:outline-none"
                placeholder="your@email.com"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-sans font-semibold text-[#666] uppercase tracking-wide mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={shippingData.firstName}
                  onChange={(e) =>
                    setShippingData({ ...shippingData, firstName: e.target.value })
                  }
                  required
                  className="w-full bg-[#f5f5f5] border-0 rounded-lg px-4 py-3 text-sm font-sans text-[#1a1a1a] focus:ring-2 focus:ring-[#0072BC] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-sans font-semibold text-[#666] uppercase tracking-wide mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={shippingData.lastName}
                  onChange={(e) =>
                    setShippingData({ ...shippingData, lastName: e.target.value })
                  }
                  required
                  className="w-full bg-[#f5f5f5] border-0 rounded-lg px-4 py-3 text-sm font-sans text-[#1a1a1a] focus:ring-2 focus:ring-[#0072BC] focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-sans font-semibold text-[#666] uppercase tracking-wide mb-1">
                Address
              </label>
              <input
                type="text"
                value={shippingData.address1}
                onChange={(e) =>
                  setShippingData({ ...shippingData, address1: e.target.value })
                }
                required
                className="w-full bg-[#f5f5f5] border-0 rounded-lg px-4 py-3 text-sm font-sans text-[#1a1a1a] focus:ring-2 focus:ring-[#0072BC] focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-sans font-semibold text-[#666] uppercase tracking-wide mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={shippingData.city}
                  onChange={(e) =>
                    setShippingData({ ...shippingData, city: e.target.value })
                  }
                  required
                  className="w-full bg-[#f5f5f5] border-0 rounded-lg px-4 py-3 text-sm font-sans text-[#1a1a1a] focus:ring-2 focus:ring-[#0072BC] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-sans font-semibold text-[#666] uppercase tracking-wide mb-1">
                  State
                </label>
                <input
                  type="text"
                  value={shippingData.state}
                  onChange={(e) =>
                    setShippingData({ ...shippingData, state: e.target.value })
                  }
                  required
                  className="w-full bg-[#f5f5f5] border-0 rounded-lg px-4 py-3 text-sm font-sans text-[#1a1a1a] focus:ring-2 focus:ring-[#0072BC] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-sans font-semibold text-[#666] uppercase tracking-wide mb-1">
                  ZIP
                </label>
                <input
                  type="text"
                  value={shippingData.postalCode}
                  onChange={(e) =>
                    setShippingData({ ...shippingData, postalCode: e.target.value })
                  }
                  required
                  className="w-full bg-[#f5f5f5] border-0 rounded-lg px-4 py-3 text-sm font-sans text-[#1a1a1a] focus:ring-2 focus:ring-[#0072BC] focus:outline-none"
                />
              </div>
            </div>
            <button
              onClick={() => setCurrentStep("payment")}
              className="w-full bg-[#1a1a1a] text-white font-sans font-semibold text-sm py-4 rounded-lg hover:bg-[#333] transition-colors mt-4"
            >
              Continue to Payment
            </button>
          </div>
        )}

        {/* Payment step */}
        {currentStep === "payment" && (
          <div>
            <div className="bg-[#f5f5f5] rounded-xl p-6 mb-6">
              <p className="text-sm font-sans text-[#444]">
                Payment processing will be available soon. For now, orders use
                manual payment confirmation.
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setCurrentStep("shipping")}
                className="flex-1 border border-[#ddd] text-[#666] font-sans font-semibold text-sm py-4 rounded-lg hover:bg-[#f5f5f5] transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setCurrentStep("review")}
                className="flex-1 bg-[#1a1a1a] text-white font-sans font-semibold text-sm py-4 rounded-lg hover:bg-[#333] transition-colors"
              >
                Continue to Review
              </button>
            </div>
          </div>
        )}

        {/* Review step */}
        {currentStep === "review" && (
          <div>
            {/* Order summary */}
            <div className="bg-[#f5f5f5] rounded-xl p-6 mb-6 space-y-3">
              <h3 className="text-sm font-sans font-semibold text-[#1a1a1a] uppercase">
                Order Summary
              </h3>
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm font-sans">
                  <span className="text-[#444]">
                    {item.title} × {item.quantity}
                  </span>
                  <span className="text-[#1a1a1a]">
                    ${((item.unit_price * item.quantity) / 100).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="border-t border-[#ddd] pt-3 flex justify-between text-sm font-sans">
                <span className="text-[#888]">Shipping</span>
                <span>{shippingCost === 0 ? "Free" : `$${(shippingCost / 100).toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between font-sans font-bold">
                <span>Total</span>
                <span>${(total / 100).toFixed(2)}</span>
              </div>
            </div>

            {/* Shipping summary */}
            <div className="bg-[#f5f5f5] rounded-xl p-6 mb-6">
              <h3 className="text-sm font-sans font-semibold text-[#1a1a1a] uppercase mb-2">
                Shipping To
              </h3>
              <p className="text-sm font-sans text-[#444]">
                {shippingData.firstName} {shippingData.lastName}
                <br />
                {shippingData.address1}
                <br />
                {shippingData.city}, {shippingData.state} {shippingData.postalCode}
              </p>
              <button
                onClick={() => setCurrentStep("shipping")}
                className="text-xs font-sans text-[#0072BC] hover:underline mt-2"
              >
                Edit
              </button>
            </div>

            {/* TOS */}
            <p className="text-xs font-sans text-[#888] mb-6">
              By placing this order, you agree to our{" "}
              <a href="/terms" className="text-[#0072BC] hover:underline">
                Terms of Service
              </a>{" "}
              and confirm these products are for research purposes only.
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => setCurrentStep("payment")}
                className="flex-1 border border-[#ddd] text-[#666] font-sans font-semibold text-sm py-4 rounded-lg hover:bg-[#f5f5f5] transition-colors"
              >
                Back
              </button>
              <Link
                href="/checkout/success"
                className="flex-1 bg-[#1a1a1a] text-white font-sans font-semibold text-sm py-4 rounded-lg hover:bg-[#333] transition-colors text-center"
              >
                Place Order
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Create checkout success page**

Create `src/app/checkout/success/page.tsx`:

```tsx
import Link from "next/link";

export const metadata = {
  title: "Order Confirmed — AlaskaLabs",
};

export default function CheckoutSuccessPage() {
  return (
    <main className="min-h-screen bg-white pt-24 pb-16 px-8 md:px-16 lg:px-24">
      <div className="max-w-2xl mx-auto text-center">
        <div className="text-6xl mb-6">✓</div>
        <h1 className="text-4xl md:text-5xl font-display font-black uppercase text-[#1a1a1a] mb-4">
          Thank You
        </h1>
        <p className="text-lg font-sans text-[#444] mb-2">
          Your order has been placed successfully.
        </p>
        <p className="text-sm font-sans text-[#888] mb-8">
          Most orders ship within 1 business day. You&apos;ll receive a
          confirmation email shortly.
        </p>

        <div className="space-y-3">
          <Link
            href="/shop"
            className="inline-block bg-[#1a1a1a] text-white font-sans font-semibold text-sm px-8 py-3 rounded-lg hover:bg-[#333] transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 3: Verify build**

Run:
```bash
cd site && npm run build
```

- [ ] **Step 4: Commit**

```bash
git add src/app/checkout/page.tsx src/app/checkout/success/page.tsx
git commit -m "feat: add checkout page with 3-step accordion and success page"
```

---

### Task 10: Final verification and tag

**Files:**
- None (verification only)

- [ ] **Step 1: Clean build**

Run:
```bash
cd site && rm -rf .next && npm run build
```
Expected: Build succeeds with all routes listed.

- [ ] **Step 2: Verify all routes in dev**

Start both servers:
```bash
# Terminal 1: Medusa
cd medusa && npx medusa develop

# Terminal 2: Next.js
cd site && npm run dev
```

Visit each route and verify:
- `http://localhost:3000` — Landing page (unchanged, dark navbar)
- `http://localhost:3000/shop` — Product grid (3 cards, white navbar)
- `http://localhost:3000/shop/bpc-157` — Product detail with buy box
- `http://localhost:3000/cart` — Cart page (empty state or with items)
- `http://localhost:3000/checkout` — Checkout accordion
- `http://localhost:3000/checkout/success` — Success page
- `http://localhost:3000/account/login` — Login/register
- `http://localhost:3000/account` — Dashboard (redirects to login if not authed)
- `http://localhost:3000/about` — About page
- `http://localhost:3000/faq` — FAQ with accordions
- `http://localhost:3000/contact` — Contact page

- [ ] **Step 3: Test the shopping flow**

1. Go to `/shop`
2. Click a product → lands on product detail
3. Select a variant, click "Add to Cart"
4. Cart drawer opens with the item
5. Click "View Cart" → cart page with shipping progress
6. Click "Continue to Checkout" → checkout page

- [ ] **Step 4: Tag the milestone**

```bash
cd site && git tag -a v0.4.0-storefront -m "Full storefront: shop, product detail, cart, checkout, account, about, FAQ, contact"
```
