# Mobile Landing Page Redesign — Design Spec

**Date:** 2026-04-28
**Status:** Approved
**Scope:** Mobile-only changes to the landing page. Desktop unchanged.

---

## Overview

On mobile (< 768px), replace the scroll-driven frame animation with the existing PeptideShowcase as the hero section. Add a Vylix-style 2-column product grid below it. Desktop remains exactly as-is.

## Mobile Layout (top to bottom)

1. **PeptideShowcase** — already built, becomes the hero on mobile. Full-width, draggable vials, color themes, add to cart, prev/next nav. No changes to the component itself.
2. **Product Grid** — 2-column grid of product cards. AlaskaLabs color scheme (#f5f5f5 background, white cards, #0072BC accents). Shows 6 products. Vylix-style sizing: large product image, category tag with purity badge, product name, strength, price, Add to Cart button.
3. **"View All" button** — links to /shop. Centered below the grid.
4. **Specs & Lab Tested section** — existing SpecsAndLabSection, unchanged.
5. **Final CTA** — existing FinalSection, unchanged.

## Desktop Layout

No changes. Scroll animation (HeroCanvas + TextOverlays) → PeptideShowcase → ProductShowcaseRows → Specs → Final CTA.

## Implementation

### page.tsx changes
- Detect mobile via CSS (Tailwind `hidden md:block` / `block md:hidden`)
- Desktop: render HeroCanvas + TextOverlays + PeptideShowcase + PostSequenceContent (current behavior)
- Mobile: render PeptideShowcase + MobileProductGrid + PostSequenceContent (skip HeroCanvas + TextOverlays)
- The scroll-based background gradient only applies on desktop

### New component: MobileProductGrid
- Renders 6 products from catalog in a 2-column CSS grid
- Card structure: product image (large, centered), category + "99%+" badge, product name, strength, price, "Add to Cart" button
- Colors: #f5f5f5 section background, white cards with subtle border, #0072BC accent text
- "View All" button below grid links to /shop
- Only rendered on mobile (< 768px)

### PeptideShowcase changes
- On mobile, remove the 16:10 aspect ratio constraint so it fills more vertical space
- Adjust text sizing for mobile readability if needed
- No functional changes

## Breakpoint

- Mobile: < 768px (Tailwind `md:` prefix)
- Desktop: >= 768px
