# Frontend Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the existing Next.js site from static export to SSR mode, add foundational components (Providers, medusa-client, middleware, auth/cart contexts), fix privacy issues (Google Fonts), and update navigation links — preparing the codebase for e-commerce page development.

**Architecture:** Convert `output: "export"` to `output: "standalone"`, create a `Providers.tsx` client component wrapper for contexts, add `middleware.ts` for route protection, configure the Medusa JS SDK client, and migrate Google Fonts to `next/font/google` for self-hosting.

**Tech Stack:** Next.js 16.2.2, React 19, TypeScript, Tailwind CSS 4, `@medusajs/js-sdk`

---

### Task 1: Switch Next.js from static export to SSR standalone

**Files:**
- Modify: `next.config.ts`

- [ ] **Step 1: Update next.config.ts**

Replace the contents of `next.config.ts` with:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
};

export default nextConfig;
```

This removes `output: "export"` (static site) and `images: { unoptimized: true }`, enabling SSR and Next.js Image Optimization.

- [ ] **Step 2: Verify the build still works**

Run:
```bash
cd site && npm run build
```
Expected: Build succeeds. The output directory changes from `out/` to `.next/` with a `standalone/` folder.

- [ ] **Step 3: Verify the dev server starts**

Run:
```bash
cd site && npm run dev
```
Visit `http://localhost:3000` — the existing landing page should render identically. The scroll animation, canvas, and all Framer Motion transitions should work exactly as before. Kill the dev server after confirming.

- [ ] **Step 4: Commit**

```bash
cd site && git add next.config.ts
git commit -m "feat: switch from static export to SSR standalone mode for e-commerce"
```

---

### Task 2: Migrate Google Fonts to next/font/google

**Files:**
- Modify: `src/app/globals.css` (line 1 — remove Google Fonts import)
- Modify: `src/app/layout.tsx` (add next/font/google import)

This eliminates outbound requests to Google servers, consistent with the privacy posture.

- [ ] **Step 1: Read the Next.js 16 font docs**

Before writing code, check the bundled docs for any breaking changes:

Run:
```bash
ls site/node_modules/next/dist/docs/ 2>/dev/null || echo "No docs dir"
```

If docs exist, read the font-related sections. Next.js 16 may have changes to the `next/font` API.

- [ ] **Step 2: Remove the Google Fonts CSS import from globals.css**

In `src/app/globals.css`, remove line 1:
```css
@import url("https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap");
```

The file should now start with:
```css
@import "tailwindcss";

@theme inline {
  --color-prime-blue: #0072BC;
```

- [ ] **Step 3: Add next/font/google to layout.tsx**

Replace the contents of `src/app/layout.tsx` with:

```typescript
import type { Metadata } from "next";
import { Bebas_Neue } from "next/font/google";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Prime Ice Pop — AlaskaLabs",
  description: "The purest peptide, straight from the source.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`h-full antialiased ${bebasNeue.variable}`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
```

This self-hosts the Bebas Neue font at build time via Next.js — no runtime requests to Google.

- [ ] **Step 4: Update globals.css font-family to use the CSS variable**

In `src/app/globals.css`, change the body font-family from the hardcoded string to the CSS variable:

```css
body {
  overflow-x: hidden;
  background: #050D1A;
  color: #ffffff;
  font-family: var(--font-display), sans-serif;
}
```

- [ ] **Step 5: Verify the font still renders**

Run:
```bash
cd site && npm run dev
```
Visit `http://localhost:3000`. Bebas Neue should render identically to before. Check the Network tab in browser DevTools — there should be NO requests to `fonts.googleapis.com`. The font should be served from the same origin.

- [ ] **Step 6: Verify the build**

Run:
```bash
cd site && npm run build
```
Expected: Build succeeds with no font-related warnings.

- [ ] **Step 7: Commit**

```bash
cd site && git add src/app/globals.css src/app/layout.tsx
git commit -m "feat: self-host Bebas Neue via next/font/google — no outbound Google requests"
```

---

### Task 3: Install the Medusa JS SDK

**Files:**
- Modify: `package.json` (via npm install)
- Create: `src/lib/medusa-client.ts`

- [ ] **Step 1: Install @medusajs/js-sdk**

Run:
```bash
cd site && npm install @medusajs/js-sdk
```

> **CRITICAL:** Do NOT install `medusa-react` — it's React 18 only and incompatible with React 19.

- [ ] **Step 2: Create the Medusa client module**

Create `src/lib/medusa-client.ts`:

```typescript
import Medusa from "@medusajs/js-sdk";

const MEDUSA_BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000";

export const medusa = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  debug: process.env.NODE_ENV === "development",
});
```

- [ ] **Step 3: Verify it compiles**

Run:
```bash
cd site && npm run build
```
Expected: Build succeeds. The medusa client is tree-shaken if not yet imported anywhere.

- [ ] **Step 4: Commit**

```bash
cd site && git add package.json package-lock.json src/lib/medusa-client.ts
git commit -m "feat: add @medusajs/js-sdk client for Medusa v2 API communication"
```

---

### Task 4: Create the cart context

**Files:**
- Create: `src/lib/cart-context.tsx`

- [ ] **Step 1: Create the cart context provider**

Create `src/lib/cart-context.tsx`:

```typescript
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { medusa } from "./medusa-client";

interface CartItem {
  id: string;
  variant_id: string;
  title: string;
  quantity: number;
  unit_price: number;
  thumbnail?: string;
}

interface CartContextValue {
  cartId: string | null;
  items: CartItem[];
  itemCount: number;
  isLoading: boolean;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  addItem: (variantId: string, quantity?: number) => Promise<void>;
  removeItem: (lineItemId: string) => Promise<void>;
  updateQuantity: (lineItemId: string, quantity: number) => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}

const CART_ID_KEY = "alaskalabs_cart_id";

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartId, setCartId] = useState<string | null>(null);
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);

  const refreshCart = useCallback(async () => {
    const storedId = localStorage.getItem(CART_ID_KEY);
    if (!storedId) {
      setIsLoading(false);
      return;
    }

    try {
      const { cart } = await medusa.store.cart.retrieve(storedId);
      setCartId(cart.id);
      setItems(
        (cart.items ?? []).map((item: any) => ({
          id: item.id,
          variant_id: item.variant_id,
          title: item.title,
          quantity: item.quantity,
          unit_price: item.unit_price,
          thumbnail: item.thumbnail,
        }))
      );
    } catch {
      // Cart expired or invalid — clear it
      localStorage.removeItem(CART_ID_KEY);
      setCartId(null);
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const ensureCart = useCallback(async (): Promise<string> => {
    if (cartId) return cartId;

    const { cart } = await medusa.store.cart.create({});
    localStorage.setItem(CART_ID_KEY, cart.id);
    setCartId(cart.id);
    return cart.id;
  }, [cartId]);

  const addItem = useCallback(
    async (variantId: string, quantity = 1) => {
      setIsLoading(true);
      try {
        const id = await ensureCart();
        await medusa.store.cart.createLineItem(id, {
          variant_id: variantId,
          quantity,
        });
        await refreshCart();
        openDrawer();
      } finally {
        setIsLoading(false);
      }
    },
    [ensureCart, refreshCart, openDrawer]
  );

  const removeItem = useCallback(
    async (lineItemId: string) => {
      if (!cartId) return;
      setIsLoading(true);
      try {
        await medusa.store.cart.deleteLineItem(cartId, lineItemId);
        await refreshCart();
      } finally {
        setIsLoading(false);
      }
    },
    [cartId, refreshCart]
  );

  const updateQuantity = useCallback(
    async (lineItemId: string, quantity: number) => {
      if (!cartId) return;
      setIsLoading(true);
      try {
        await medusa.store.cart.updateLineItem(cartId, lineItemId, {
          quantity,
        });
        await refreshCart();
      } finally {
        setIsLoading(false);
      }
    },
    [cartId, refreshCart]
  );

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartId,
        items,
        itemCount,
        isLoading,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
        addItem,
        removeItem,
        updateQuantity,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
```

- [ ] **Step 2: Verify it compiles**

Run:
```bash
cd site && npm run build
```
Expected: Build succeeds. Cart context is defined but not yet used.

- [ ] **Step 3: Commit**

```bash
cd site && git add src/lib/cart-context.tsx
git commit -m "feat: add cart context with Medusa session integration"
```

---

### Task 5: Create the auth context

**Files:**
- Create: `src/lib/auth-context.tsx`

- [ ] **Step 1: Create the auth context provider**

Create `src/lib/auth-context.tsx`:

```typescript
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { medusa } from "./medusa-client";

interface Customer {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

interface AuthContextValue {
  customer: Customer | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<void>;
  refreshCustomer: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshCustomer = useCallback(async () => {
    try {
      const { customer: data } = await medusa.store.customer.retrieve();
      setCustomer({
        id: data.id,
        email: data.email,
        first_name: data.first_name ?? undefined,
        last_name: data.last_name ?? undefined,
      });
    } catch {
      setCustomer(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCustomer();
  }, [refreshCustomer]);

  const login = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      try {
        await medusa.auth.login("customer", "emailpass", {
          email,
          password,
        });
        await refreshCustomer();
      } finally {
        setIsLoading(false);
      }
    },
    [refreshCustomer]
  );

  const logout = useCallback(async () => {
    await medusa.auth.logout();
    setCustomer(null);
  }, []);

  const register = useCallback(
    async (
      email: string,
      password: string,
      firstName: string,
      lastName: string
    ) => {
      setIsLoading(true);
      try {
        await medusa.auth.register("customer", "emailpass", {
          email,
          password,
        });
        await medusa.auth.login("customer", "emailpass", {
          email,
          password,
        });
        await medusa.store.customer.update({
          first_name: firstName,
          last_name: lastName,
        });
        await refreshCustomer();
      } finally {
        setIsLoading(false);
      }
    },
    [refreshCustomer]
  );

  return (
    <AuthContext.Provider
      value={{
        customer,
        isLoading,
        isAuthenticated: !!customer,
        login,
        logout,
        register,
        refreshCustomer,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
```

- [ ] **Step 2: Verify it compiles**

Run:
```bash
cd site && npm run build
```

- [ ] **Step 3: Commit**

```bash
cd site && git add src/lib/auth-context.tsx
git commit -m "feat: add auth context with Medusa customer session integration"
```

---

### Task 6: Create the Providers wrapper component

**Files:**
- Create: `src/components/Providers.tsx`
- Modify: `src/app/layout.tsx`

The root `layout.tsx` is a Server Component. React Context providers are client-only. This wrapper bridges the gap.

- [ ] **Step 1: Create Providers.tsx**

Create `src/components/Providers.tsx`:

```typescript
"use client";

import type { ReactNode } from "react";
import { CartProvider } from "@/lib/cart-context";
import { AuthProvider } from "@/lib/auth-context";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>{children}</CartProvider>
    </AuthProvider>
  );
}
```

- [ ] **Step 2: Update layout.tsx to use Providers**

Replace the contents of `src/app/layout.tsx` with:

```typescript
import type { Metadata } from "next";
import { Bebas_Neue } from "next/font/google";
import Providers from "@/components/Providers";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Prime Ice Pop — AlaskaLabs",
  description: "The purest peptide, straight from the source.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`h-full antialiased ${bebasNeue.variable}`}>
      <body className="min-h-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Verify the build and dev server**

Run:
```bash
cd site && npm run build
```
Expected: Build succeeds.

Run:
```bash
cd site && npm run dev
```
Visit `http://localhost:3000`. The landing page should render identically. The Providers wrapper should not affect the existing page (cart and auth contexts are available but not consumed by the landing page). Check browser console for errors — there should be none critical (Medusa API calls will fail since there's no backend, but these are caught silently by the context providers).

- [ ] **Step 4: Commit**

```bash
cd site && git add src/components/Providers.tsx src/app/layout.tsx
git commit -m "feat: add Providers wrapper for cart and auth contexts in Server Component layout"
```

---

### Task 7: Update navigation links from anchors to routes

**Files:**
- Modify: `src/components/Navbar.tsx` (line 21-24)
- Modify: `src/components/PostSequenceContent.tsx` (line 95-100)

- [ ] **Step 1: Update Navbar.tsx**

Replace the contents of `src/components/Navbar.tsx` with:

```typescript
"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useCart } from "@/lib/cart-context";

export default function Navbar() {
  const { scrollYProgress } = useScroll();
  const bg = useTransform(
    scrollYProgress,
    [0, 0.85, 0.95],
    ["rgba(5,13,26,0.3)", "rgba(5,13,26,0.3)", "rgba(139,0,0,0.4)"]
  );
  const { itemCount, openDrawer } = useCart();

  return (
    <motion.nav
      style={{ backgroundColor: bg }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 backdrop-blur-xl border-b border-white/10"
    >
      <Link
        href="/"
        className="text-2xl font-display tracking-[0.2em] text-white uppercase"
      >
        AlaskaLabs
      </Link>
      <div className="flex items-center gap-4">
        <button
          onClick={openDrawer}
          className="relative text-white hover:text-prime-blue transition-colors"
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
        <Link
          href="/shop"
          className="px-6 py-2 text-sm font-display tracking-[0.15em] uppercase bg-white text-prime-blue rounded-full transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]"
        >
          Shop Now
        </Link>
      </div>
    </motion.nav>
  );
}
```

Changes from original:
- `<a href="#shop">` → `<Link href="/shop">`
- Added `<Link href="/">` on the logo
- Added cart icon button with item count badge
- Imported `useCart` for cart state and drawer toggle

- [ ] **Step 2: Update PostSequenceContent.tsx FinalSection CTA**

In `src/components/PostSequenceContent.tsx`, add the Link import at the top (after the existing imports):

```typescript
import Link from "next/link";
```

Then replace the `<a>` tag in FinalSection (lines 95-100):

Old:
```typescript
        <a
          href="#shop"
          className="inline-block px-12 py-4 text-xl font-display tracking-[0.2em] uppercase bg-[#1a1a1a] text-white rounded-full transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(0,0,0,0.2)]"
        >
          Buy Now
        </a>
```

New:
```typescript
        <Link
          href="/shop"
          className="inline-block px-12 py-4 text-xl font-display tracking-[0.2em] uppercase bg-[#1a1a1a] text-white rounded-full transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(0,0,0,0.2)]"
        >
          Buy Now
        </Link>
```

- [ ] **Step 3: Verify the build**

Run:
```bash
cd site && npm run build
```
Expected: Build succeeds.

- [ ] **Step 4: Verify in dev server**

Run:
```bash
cd site && npm run dev
```
Visit `http://localhost:3000`. The "Shop Now" button in the navbar and "Buy Now" CTA should now navigate to `/shop` (which will 404 for now — that's expected). The cart icon should appear in the navbar. The landing page scroll animations should work identically to before.

- [ ] **Step 5: Commit**

```bash
cd site && git add src/components/Navbar.tsx src/components/PostSequenceContent.tsx
git commit -m "feat: update nav links from anchors to routes, add cart icon to navbar"
```

---

### Task 8: Create auth middleware

**Files:**
- Create: `src/middleware.ts`

- [ ] **Step 1: Read Next.js 16 middleware docs**

Check for breaking changes in middleware for Next.js 16:

Run:
```bash
find site/node_modules/next/dist/docs -name "*middleware*" -o -name "*Middleware*" 2>/dev/null
```

Read any relevant files before writing the middleware.

- [ ] **Step 2: Create the middleware**

Create `src/middleware.ts`:

```typescript
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /account routes (except /account/login)
  if (pathname.startsWith("/account") && pathname !== "/account/login") {
    // Check for Medusa auth token in cookies
    const authToken = request.cookies.get("_medusa_jwt");
    if (!authToken) {
      const loginUrl = new URL("/account/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*", "/checkout/:path*"],
};
```

- [ ] **Step 3: Verify the build**

Run:
```bash
cd site && npm run build
```
Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
cd site && git add src/middleware.ts
git commit -m "feat: add auth middleware for /account and /checkout route protection"
```

---

### Task 9: Final verification and tag

**Files:**
- None (verification only)

- [ ] **Step 1: Run a clean build**

Run:
```bash
cd site && rm -rf .next && npm run build
```
Expected: Clean build succeeds with no errors.

- [ ] **Step 2: Start dev server and verify landing page**

Run:
```bash
cd site && npm run dev
```
Verify:
- Landing page loads at `http://localhost:3000`
- Scroll animation works identically to before
- Bebas Neue font renders correctly
- No requests to `fonts.googleapis.com` in Network tab
- Cart icon appears in navbar (count shows 0)
- "Shop Now" and "Buy Now" navigate to `/shop` (404 expected)
- No critical console errors

- [ ] **Step 3: Check git status**

Run:
```bash
cd site && git status
```
Expected: working tree clean

- [ ] **Step 4: Verify all files were created**

Run:
```bash
ls -la site/src/lib/
ls -la site/src/components/Providers.tsx
ls -la site/src/middleware.ts
```

Expected files:
- `src/lib/medusa-client.ts`
- `src/lib/cart-context.tsx`
- `src/lib/auth-context.tsx`
- `src/components/Providers.tsx`
- `src/middleware.ts`

- [ ] **Step 5: Tag the milestone**

```bash
cd site && git tag -a v0.2.0-frontend-foundation -m "Frontend foundation: SSR, Providers, medusa client, auth middleware, self-hosted fonts"
```
