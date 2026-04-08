# Medusa Backend Setup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Set up a running Medusa v2 backend with Redis, session auth, seed data (3 peptide products), and a dev Docker Compose for Postgres + Redis — ready for the frontend to build shop pages against.

**Architecture:** Medusa v2 project in `AlaskaLabs/medusa/` created via `create-medusa-app`, configured with Redis for event bus/caching/workflows/locking, session-based auth for cookie compatibility with the Next.js proxy, and a seed script using `createProductsWorkflow` to populate products. Dev infrastructure runs via `docker-compose.dev.yml`.

**Tech Stack:** Medusa.js v2, PostgreSQL 16, Redis 7, Docker Compose, TypeScript

---

### Task 1: Create dev Docker Compose for Postgres + Redis

**Files:**
- Create: `medusa/docker-compose.dev.yml`

- [ ] **Step 1: Create the medusa directory**

Run:
```bash
mkdir -p /c/Users/legnd/Documents/git/AlaskaLabs/medusa
```

- [ ] **Step 2: Write docker-compose.dev.yml**

Create `medusa/docker-compose.dev.yml`:

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
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  medusa_pg_data:
```

- [ ] **Step 3: Start the containers**

Run:
```bash
cd /c/Users/legnd/Documents/git/AlaskaLabs/medusa && docker compose -f docker-compose.dev.yml up -d
```

Expected: Both containers start and become healthy.

- [ ] **Step 4: Verify connectivity**

Run:
```bash
docker exec -it medusa-postgres-1 pg_isready -U postgres
docker exec -it medusa-redis-1 redis-cli ping
```

Expected: `accepting connections` and `PONG`.

- [ ] **Step 5: Commit**

```bash
cd /c/Users/legnd/Documents/git/AlaskaLabs && git add medusa/docker-compose.dev.yml && git commit -m "chore: add dev Docker Compose for Postgres + Redis"
```

---

### Task 2: Scaffold the Medusa v2 project

**Files:**
- Create: `medusa/` (entire Medusa project via create-medusa-app)

- [ ] **Step 1: Run create-medusa-app**

Run:
```bash
cd /c/Users/legnd/Documents/git/AlaskaLabs && npx create-medusa-app@latest medusa --db-url "postgres://postgres:postgres@localhost:5432/medusa" --no-browser
```

When prompted:
- Project name: `medusa` (or accept default if it asks)
- PostgreSQL connection: use `postgres://postgres:postgres@localhost:5432/medusa`
- Skip storefront installation if prompted

If `create-medusa-app` fails because the `medusa/` directory already exists (from Task 1), run:
```bash
cd /c/Users/legnd/Documents/git/AlaskaLabs && npx create-medusa-app@latest medusa-tmp --db-url "postgres://postgres:postgres@localhost:5432/medusa" --no-browser
```
Then move the contents (excluding docker-compose.dev.yml) into `medusa/`.

- [ ] **Step 2: Verify the project structure**

Run:
```bash
ls /c/Users/legnd/Documents/git/AlaskaLabs/medusa/
```

Expected: `medusa-config.ts`, `package.json`, `tsconfig.json`, `src/`, `node_modules/`, etc.

- [ ] **Step 3: Verify the dev server starts**

Run:
```bash
cd /c/Users/legnd/Documents/git/AlaskaLabs/medusa && npx medusa develop
```

Expected: Server starts on `http://localhost:9000`. Admin dashboard available at `http://localhost:9000/app`. Kill the server after confirming (Ctrl+C).

- [ ] **Step 4: Add .gitignore entries**

Verify `medusa/.gitignore` includes at minimum:
```
node_modules/
.medusa/
.env
dist/
```

If `.gitignore` doesn't exist or is missing entries, create/update it.

- [ ] **Step 5: Commit**

```bash
cd /c/Users/legnd/Documents/git/AlaskaLabs && git add medusa/ && git commit -m "feat: scaffold Medusa v2 project"
```

> **Note:** This commit will be large (full Medusa scaffold). That's expected.

---

### Task 3: Configure Redis modules for production readiness

**Files:**
- Modify: `medusa/medusa-config.ts`
- Modify: `medusa/.env` (add REDIS_URL)

- [ ] **Step 1: Read the current medusa-config.ts**

Read the file to understand the default structure before modifying:
```bash
cat /c/Users/legnd/Documents/git/AlaskaLabs/medusa/medusa-config.ts
```

- [ ] **Step 2: Add REDIS_URL to .env**

Append to `medusa/.env`:
```
REDIS_URL=redis://localhost:6379
```

- [ ] **Step 3: Add REDIS_URL to .env.example**

Create or update `medusa/.env.example` with all required variables:
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

- [ ] **Step 4: Update medusa-config.ts with Redis modules**

Add the following modules to the `modules` array in `medusa-config.ts`. Keep all existing config — only add the Redis module entries:

```typescript
import { defineConfig, Modules } from "@medusajs/framework/utils"

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    http: {
      storeCors: process.env.STORE_CORS || "http://localhost:3000",
      adminCors: process.env.ADMIN_CORS || "http://localhost:3000",
      authCors: process.env.AUTH_CORS || "http://localhost:3000",
    },
  },
  modules: [
    {
      resolve: "@medusajs/medusa/event-bus-redis",
      options: {
        redisUrl: process.env.REDIS_URL,
      },
    },
    {
      resolve: "@medusajs/medusa/caching",
      options: {
        providers: [
          {
            resolve: "@medusajs/caching-redis",
            id: "caching-redis",
            is_default: true,
            options: {
              redisUrl: process.env.REDIS_URL,
            },
          },
        ],
      },
    },
    {
      resolve: "@medusajs/medusa/workflow-engine-redis",
      options: {
        redis: {
          redisUrl: process.env.REDIS_URL,
        },
      },
    },
    {
      resolve: "@medusajs/medusa/locking",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/locking-redis",
            id: "locking-redis",
            is_default: true,
            options: {
              redisUrl: process.env.REDIS_URL,
            },
          },
        ],
      },
    },
  ],
})
```

> **Important:** Merge this with whatever `create-medusa-app` generated. Keep any existing `projectConfig` values. The key additions are the 4 Redis module entries and the CORS config.

- [ ] **Step 5: Install Redis packages if not already present**

Run:
```bash
cd /c/Users/legnd/Documents/git/AlaskaLabs/medusa && npm install @medusajs/caching-redis
```

> `event-bus-redis`, `workflow-engine-redis`, and `locking-redis` are part of `@medusajs/medusa` — only `caching-redis` needs a separate install.

- [ ] **Step 6: Verify the server starts with Redis**

Run:
```bash
cd /c/Users/legnd/Documents/git/AlaskaLabs/medusa && npx medusa develop
```

Expected: Server starts without errors. Check logs for Redis connection messages. Kill after confirming.

- [ ] **Step 7: Commit**

```bash
cd /c/Users/legnd/Documents/git/AlaskaLabs && git add medusa/medusa-config.ts medusa/.env.example && git commit -m "feat: configure Redis for event bus, caching, workflows, and locking"
```

> Do NOT commit `medusa/.env` — it contains local secrets.

---

### Task 4: Create the seed script with product data

**Files:**
- Create: `medusa/src/scripts/seed.ts`

- [ ] **Step 1: Create the scripts directory**

Run:
```bash
mkdir -p /c/Users/legnd/Documents/git/AlaskaLabs/medusa/src/scripts
```

- [ ] **Step 2: Write the seed script**

Create `medusa/src/scripts/seed.ts`:

```typescript
import { ExecArgs } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils"
import {
  createProductsWorkflow,
  createInventoryLevelsWorkflow,
  createShippingProfilesWorkflow,
  createRegionsWorkflow,
  createShippingOptionsWorkflow,
  createSalesChannelsWorkflow,
} from "@medusajs/medusa/core-flows"

export default async function seed({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const salesChannelService = container.resolve(Modules.SALES_CHANNEL)
  const stockLocationService = container.resolve(Modules.STOCK_LOCATION)
  const fulfillmentService = container.resolve(Modules.FULFILLMENT)

  logger.info("Starting AlaskaLabs seed...")

  // --- Sales Channel ---
  let salesChannels = await salesChannelService.listSalesChannels({
    name: "Default Sales Channel",
  })

  if (!salesChannels.length) {
    const { result } = await createSalesChannelsWorkflow(container).run({
      input: {
        salesChannelsData: [{ name: "Default Sales Channel" }],
      },
    })
    salesChannels = result
    logger.info("Created default sales channel.")
  }

  const salesChannelId = salesChannels[0].id

  // --- Stock Location ---
  let stockLocations = await stockLocationService.listStockLocations({
    name: "Default Warehouse",
  })

  let stockLocationId: string
  if (!stockLocations.length) {
    const stockLocation = await stockLocationService.createStockLocations({
      name: "Default Warehouse",
    })
    stockLocationId = stockLocation.id
    logger.info("Created default stock location.")
  } else {
    stockLocationId = stockLocations[0].id
  }

  // --- Shipping Profile ---
  const { result: shippingProfiles } = await createShippingProfilesWorkflow(
    container
  ).run({
    input: {
      data: [{ name: "Default", type: "default" }],
    },
  })
  const shippingProfileId = shippingProfiles[0].id
  logger.info("Created shipping profile.")

  // --- Region ---
  const { result: regions } = await createRegionsWorkflow(container).run({
    input: {
      data: [
        {
          name: "United States",
          currency_code: "usd",
          countries: ["us"],
          payment_providers: ["pp_system_default"],
        },
      ],
    },
  })
  const regionId = regions[0].id
  logger.info("Created US region.")

  // --- Fulfillment Set + Shipping Option ---
  const fulfillmentSets = await fulfillmentService.listFulfillmentSets({})
  let fulfillmentSetId: string

  if (!fulfillmentSets.length) {
    const fulfillmentSet = await fulfillmentService.createFulfillmentSets({
      name: "Default Fulfillment Set",
      type: "shipping",
    })
    fulfillmentSetId = fulfillmentSet.id
  } else {
    fulfillmentSetId = fulfillmentSets[0].id
  }

  // --- Products ---
  const productsData = [
    {
      title: "BPC-157",
      handle: "bpc-157",
      description:
        "Body Protection Compound-157 is a pentadecapeptide composed of 15 amino acids. It is a partial sequence of body protection compound (BPC) derived from human gastric juice. Research suggests BPC-157 may promote wound healing, protect organs, and support recovery from musculoskeletal injuries.",
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfileId,
      sales_channels: [{ id: salesChannelId }],
      images: [{ url: "/static/bottle-static.png" }],
      thumbnail: "/static/bottle-static.png",
      options: [
        {
          title: "Size",
          values: ["5mg", "10mg"],
        },
      ],
      variants: [
        {
          title: "5mg Vial",
          sku: "BPC157-5MG",
          options: { Size: "5mg" },
          manage_inventory: true,
          prices: [{ amount: 1200, currency_code: "usd" }],
        },
        {
          title: "10mg Vial",
          sku: "BPC157-10MG",
          options: { Size: "10mg" },
          manage_inventory: true,
          prices: [{ amount: 2000, currency_code: "usd" }],
        },
      ],
    },
    {
      title: "TB-500",
      handle: "tb-500",
      description:
        "Thymosin Beta-4 (TB-500) is a naturally occurring peptide present in almost all animal and human cells. Research indicates TB-500 plays a vital role in tissue repair, cell migration, and angiogenesis. Studies suggest it may accelerate healing of muscles, tendons, and ligaments.",
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfileId,
      sales_channels: [{ id: salesChannelId }],
      images: [{ url: "/static/bottle-static.png" }],
      thumbnail: "/static/bottle-static.png",
      options: [
        {
          title: "Size",
          values: ["5mg", "10mg"],
        },
      ],
      variants: [
        {
          title: "5mg Vial",
          sku: "TB500-5MG",
          options: { Size: "5mg" },
          manage_inventory: true,
          prices: [{ amount: 1500, currency_code: "usd" }],
        },
        {
          title: "10mg Vial",
          sku: "TB500-10MG",
          options: { Size: "10mg" },
          manage_inventory: true,
          prices: [{ amount: 2500, currency_code: "usd" }],
        },
      ],
    },
    {
      title: "GHK-Cu",
      handle: "ghk-cu",
      description:
        "GHK-Cu (copper peptide) is a naturally occurring tripeptide with a high affinity for copper ions. Research suggests GHK-Cu may promote collagen synthesis, skin regeneration, wound healing, and anti-inflammatory responses. It has been extensively studied for its potential in tissue remodeling.",
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfileId,
      sales_channels: [{ id: salesChannelId }],
      images: [{ url: "/static/bottle-static.png" }],
      thumbnail: "/static/bottle-static.png",
      options: [
        {
          title: "Size",
          values: ["50mg"],
        },
      ],
      variants: [
        {
          title: "50mg Vial",
          sku: "GHKCU-50MG",
          options: { Size: "50mg" },
          manage_inventory: true,
          prices: [{ amount: 3000, currency_code: "usd" }],
        },
      ],
    },
  ]

  const { result: products } = await createProductsWorkflow(container).run({
    input: { products: productsData },
  })

  logger.info(`Seeded ${products.length} products.`)

  // --- Inventory Levels (100 units each) ---
  const inventoryData: {
    location_id: string
    inventory_item_id: string
    stocked_quantity: number
  }[] = []

  for (const product of products) {
    const { data: variants } = await query.graph({
      entity: "product_variant",
      filters: { product_id: product.id },
      fields: ["id", "inventory_items.inventory_item_id"],
    })

    for (const variant of variants) {
      if (variant.inventory_items?.length) {
        for (const item of variant.inventory_items) {
          inventoryData.push({
            location_id: stockLocationId,
            inventory_item_id: item.inventory_item_id,
            stocked_quantity: 100,
          })
        }
      }
    }
  }

  if (inventoryData.length) {
    await createInventoryLevelsWorkflow(container).run({
      input: inventoryData,
    })
    logger.info(`Set inventory levels for ${inventoryData.length} variants.`)
  }

  logger.info("AlaskaLabs seed complete!")
}
```

- [ ] **Step 3: Add a seed npm script**

In `medusa/package.json`, add to the `"scripts"` section:

```json
"seed": "medusa exec ./src/scripts/seed.ts"
```

- [ ] **Step 4: Run the seed script**

Run:
```bash
cd /c/Users/legnd/Documents/git/AlaskaLabs/medusa && npm run seed
```

Expected output:
```
Starting AlaskaLabs seed...
Created default sales channel.
Created default stock location.
Created shipping profile.
Created US region.
Seeded 3 products.
Set inventory levels for 5 variants.
AlaskaLabs seed complete!
```

- [ ] **Step 5: Verify products via API**

Run:
```bash
cd /c/Users/legnd/Documents/git/AlaskaLabs/medusa && npx medusa develop &
sleep 10
curl http://localhost:9000/store/products | python3 -m json.tool | head -30
```

Expected: JSON response containing the 3 seeded products with titles "BPC-157", "TB-500", and "GHK-Cu". Kill the dev server after confirming.

- [ ] **Step 6: Commit**

```bash
cd /c/Users/legnd/Documents/git/AlaskaLabs && git add medusa/src/scripts/seed.ts medusa/package.json && git commit -m "feat: add seed script with BPC-157, TB-500, GHK-Cu products"
```

---

### Task 5: Create admin user

**Files:**
- None (CLI command only)

- [ ] **Step 1: Create the admin user**

Run:
```bash
cd /c/Users/legnd/Documents/git/AlaskaLabs/medusa && npx medusa user -e admin@alaskalabs.is -p <choose-a-password>
```

Replace `<choose-a-password>` with a real password. This creates the admin account for the Medusa dashboard.

- [ ] **Step 2: Verify admin login**

Run:
```bash
cd /c/Users/legnd/Documents/git/AlaskaLabs/medusa && npx medusa develop
```

Open `http://localhost:9000/app` in a browser. Log in with:
- Email: `admin@alaskalabs.is`
- Password: the password you chose

Expected: Admin dashboard loads, showing the 3 seeded products in Products section.

- [ ] **Step 3: Kill the dev server**

Ctrl+C to stop the Medusa server.

---

### Task 6: Update the frontend medusa-client for session auth

**Files:**
- Modify: `site/src/lib/medusa-client.ts`

- [ ] **Step 1: Read the current file**

```bash
cat /c/Users/legnd/Documents/git/AlaskaLabs/site/src/lib/medusa-client.ts
```

- [ ] **Step 2: Update to session auth**

Replace the contents of `site/src/lib/medusa-client.ts` with:

```typescript
import Medusa from "@medusajs/js-sdk";

const MEDUSA_BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000";

export const medusa = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  debug: process.env.NODE_ENV === "development",
  auth: {
    type: "session",
  },
});
```

- [ ] **Step 3: Verify the frontend still builds**

Run:
```bash
cd /c/Users/legnd/Documents/git/AlaskaLabs/site && npm run build
```

Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
cd /c/Users/legnd/Documents/git/AlaskaLabs && git add site/src/lib/medusa-client.ts && git commit -m "feat: switch medusa-client to session auth for cookie-based authentication"
```

---

### Task 7: Verify proxy.ts cookie name against Medusa session

**Files:**
- Modify: `site/src/proxy.ts` (if cookie name needs changing)

- [ ] **Step 1: Start both servers**

Run in two terminals:
```bash
# Terminal 1:
cd /c/Users/legnd/Documents/git/AlaskaLabs/medusa && npx medusa develop

# Terminal 2:
cd /c/Users/legnd/Documents/git/AlaskaLabs/site && npm run dev
```

- [ ] **Step 2: Test the auth flow and check cookie name**

Open browser DevTools (Application → Cookies tab). Navigate to `http://localhost:3000`.

Use the browser console to test login against the Medusa Store API:
```javascript
// This simulates what auth-context.tsx does
const response = await fetch('http://localhost:9000/auth/customer/emailpass', {
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'test@test.com', password: 'test1234' })
});
```

> Note: This will fail (no customer account exists), but check the response headers and any cookies set on the Medusa origin. You can also create a test customer via the admin dashboard first, then test login.

Check which cookie Medusa sets. Look for:
- `connect.sid` (Express session default)
- `_medusa_jwt`
- Or another name

- [ ] **Step 3: Update proxy.ts if needed**

If the cookie name is NOT `_medusa_jwt`, update `site/src/proxy.ts`:

```typescript
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/account") && pathname !== "/account/login") {
    // Update cookie name to match what Medusa actually sets
    const authToken = request.cookies.get("connect.sid"); // <-- update this
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

- [ ] **Step 4: Verify build**

Run:
```bash
cd /c/Users/legnd/Documents/git/AlaskaLabs/site && npm run build
```

Expected: Build succeeds.

- [ ] **Step 5: Commit (if changes were made)**

```bash
cd /c/Users/legnd/Documents/git/AlaskaLabs && git add site/src/proxy.ts && git commit -m "fix: update proxy cookie name to match Medusa session auth"
```

---

### Task 8: Final verification and tag

**Files:**
- None (verification only)

- [ ] **Step 1: Start everything from scratch**

```bash
# Ensure Docker services are running
cd /c/Users/legnd/Documents/git/AlaskaLabs/medusa && docker compose -f docker-compose.dev.yml up -d

# Start Medusa
cd /c/Users/legnd/Documents/git/AlaskaLabs/medusa && npx medusa develop
```

In another terminal:
```bash
cd /c/Users/legnd/Documents/git/AlaskaLabs/site && npm run dev
```

- [ ] **Step 2: Verify the Store API returns products**

Run:
```bash
curl -s http://localhost:9000/store/products | python3 -m json.tool | head -50
```

Expected: JSON with 3 products (BPC-157, TB-500, GHK-Cu), each with variants and prices.

- [ ] **Step 3: Verify the admin dashboard**

Open `http://localhost:9000/app`. Log in with admin credentials. Verify:
- Products section shows 3 products
- Each product has correct variants and prices
- Inventory shows 100 units per variant

- [ ] **Step 4: Verify the frontend landing page still works**

Open `http://localhost:3000`. Verify:
- Landing page renders identically to before
- Scroll animation works
- FlipText animations work
- Cart icon in navbar
- No critical console errors (Medusa API errors in console are OK — the landing page doesn't fetch from Medusa yet)

- [ ] **Step 5: Check git status**

Run:
```bash
cd /c/Users/legnd/Documents/git/AlaskaLabs && git status
```

Expected: Working tree clean (or only untracked files like `.env`, `node_modules/`, `.medusa/`).

- [ ] **Step 6: Tag the milestone**

```bash
cd /c/Users/legnd/Documents/git/AlaskaLabs && git tag -a v0.3.0-medusa-backend -m "Medusa v2 backend: Redis, session auth, seed data (BPC-157, TB-500, GHK-Cu)"
```

---

### Task 9: Update implementation progress memory

**Files:**
- Update: memory/project_implementation_progress.md

- [ ] **Step 1: Update the progress file**

Update the implementation progress memory to reflect:
- Plan 2 (Medusa Backend Setup) is COMPLETE
- Next up: Plan 3 (Shop Pages & Checkout) — build /shop, /shop/[handle], /cart, /checkout pages
- Privacy module (Plan 2.5) is deferred to pre-launch
- Reference the e-commerce UX research findings for Plan 3

- [ ] **Step 2: Update the master roadmap**

In `site/docs/superpowers/plans/2026-04-06-master-roadmap.md`, mark Plan 2 as complete and add Plan 2.5 to the dependency graph.
