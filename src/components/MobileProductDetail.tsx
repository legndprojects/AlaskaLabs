"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/lib/cart-context";
import { catalog, type CatalogProduct } from "@/data/catalog";

function kindLabel(p: CatalogProduct): string {
  return p.category.toLowerCase() === "blends" ? "BLENDS" : "COMPOUNDS";
}

/**
 * Pick two related products to surface as a "Frequently Researched Together"
 * bundle on the mobile product page. Same-category items rank first; we
 * fill the rest from the broader catalog. The current product is excluded.
 */
function pickBundle(current: CatalogProduct): CatalogProduct[] {
  const others = catalog.filter((p) => p.handle !== current.handle);
  const sameCat = others.filter((p) => p.category === current.category);
  const diffCat = others.filter((p) => p.category !== current.category);
  return [...sameCat, ...diffCat].slice(0, 2);
}

function CartIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
      />
    </svg>
  );
}

function BundleRow({
  p,
  highlighted = false,
}: {
  p: CatalogProduct;
  highlighted?: boolean;
}) {
  return (
    <li className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
            highlighted ? "bg-[#0072BC]" : "bg-[#1a1a1a]/30"
          }`}
        />
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-display font-bold uppercase text-[#1a1a1a] truncate leading-tight">
            {p.name} {p.strength}
          </p>
          <p className="text-[10px] font-sans text-[#1a1a1a]/55">
            {kindLabel(p) === "BLENDS" ? "Blend" : "Compound"}
          </p>
        </div>
      </div>
      <p className="text-sm font-sans font-bold text-[#1a1a1a] shrink-0">
        ${p.price.toFixed(2)}
      </p>
    </li>
  );
}

export default function MobileProductDetail({
  product,
}: {
  product: CatalogProduct;
}) {
  const { addItem, openDrawer } = useCart();
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [bundleAdding, setBundleAdding] = useState(false);
  const [showSticky, setShowSticky] = useState(true);

  const inlineCartRef = useRef<HTMLDivElement>(null);

  const bundle = pickBundle(product);
  const bundleTotal =
    product.price + bundle.reduce((sum, p) => sum + p.price, 0);

  /* Sticky bar: visible whenever the inline Add to Cart button is OUT of
     view (on initial load + after the user scrolls past it). Hides while
     the inline button is on-screen so the two never duplicate. */
  useEffect(() => {
    const target = inlineCartRef.current;
    if (!target) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowSticky(!entry.isIntersecting),
      { rootMargin: "0px" }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const onAdd = async () => {
    if (adding) return;
    setAdding(true);
    try {
      await addItem(product.handle, qty);
      openDrawer();
      setAdded(true);
      setTimeout(() => setAdded(false), 1400);
    } finally {
      setAdding(false);
    }
  };

  const onAddBundle = async () => {
    if (bundleAdding) return;
    setBundleAdding(true);
    try {
      await addItem(product.handle, 1);
      for (const p of bundle) {
        await addItem(p.handle, 1);
      }
      openDrawer();
    } finally {
      setBundleAdding(false);
    }
  };

  return (
    <div className="md:hidden bg-white">
      {/* Image */}
      <div className="relative aspect-square bg-white overflow-hidden">
        <div
          className="absolute inset-0 bg-gradient-to-b from-white via-white to-[#f0f6fb] pointer-events-none"
          aria-hidden
        />
        <img
          src={product.thumbnail}
          alt={`${product.name} ${product.strength}`}
          style={{ filter: "drop-shadow(0 12px 20px rgba(0,0,0,0.35)) drop-shadow(0 4px 8px rgba(0,0,0,0.2))" }}
          className="relative w-full h-full object-contain px-6 py-8"
          draggable={false}
        />
        <div className="absolute top-4 left-4">
          <span className="bg-[#1a1a1a] text-white text-[10px] tracking-[0.25em] uppercase font-display font-semibold px-3 py-1.5 rounded-full">
            {kindLabel(product)}
          </span>
        </div>
      </div>

      <div className="px-5 pt-6 pb-32">
        {/* Header */}
        <p className="text-[10px] font-display tracking-[0.25em] uppercase text-[#0072BC]/70 mb-2">
          {kindLabel(product)} · 99%+
        </p>
        <h1 className="text-3xl font-display font-black uppercase text-[#1a1a1a] leading-tight mb-1">
          {product.name}
        </h1>
        <p className="text-sm font-sans text-[#1a1a1a]/60 mb-5">
          {product.strength}
        </p>
        <div className="flex items-center gap-3 mb-4">
          <p className="text-2xl font-sans font-bold text-[#1a1a1a]">
            ${product.price.toFixed(2)}
          </p>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-sans font-semibold text-[#0a8a4a] tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0a8a4a]" />
            In Stock
          </span>
        </div>

        {/* Description */}
        <p className="text-sm font-sans text-[#444] leading-relaxed mb-7">
          {product.description}
        </p>

        {/* Quantity */}
        <p className="text-[10px] font-display tracking-[0.25em] uppercase text-[#1a1a1a]/60 mb-2 font-semibold">
          Quantity
        </p>
        <div className="inline-flex items-center bg-[#f5f5f5] rounded-full mb-6">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={qty <= 1}
            className="w-11 h-11 flex items-center justify-center text-lg text-[#1a1a1a] disabled:opacity-30"
          >
            −
          </button>
          <span className="w-10 text-center font-sans font-semibold text-[#1a1a1a] text-base">
            {qty}
          </span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQty((q) => q + 1)}
            className="w-11 h-11 flex items-center justify-center text-lg text-[#1a1a1a]"
          >
            +
          </button>
        </div>

        {/* Inline Add to Cart */}
        <div ref={inlineCartRef}>
          <button
            type="button"
            onClick={onAdd}
            disabled={adding}
            aria-label="Add to cart"
            className="group/btn relative overflow-hidden w-full h-12 rounded-full bg-[#0072BC] text-white flex items-center justify-center gap-2 text-xs font-sans font-semibold tracking-[0.2em] uppercase transition-transform duration-300 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[#003E7E] origin-left scale-x-0 group-active/btn:scale-x-100 transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]"
            />
            <span className="relative flex items-center gap-2">
              {adding ? (
                <span>Adding…</span>
              ) : added ? (
                <span>Added ✓</span>
              ) : (
                <>
                  <CartIcon />
                  <span>
                    Add to Cart — ${(product.price * qty).toFixed(2)}
                  </span>
                </>
              )}
            </span>
          </button>
        </div>

        {/* Frequently researched together */}
        {bundle.length > 0 && (
          <div className="mt-7 border border-[#0072BC]/15 rounded-2xl p-5 bg-[#f5f5f5]">
            <h3 className="text-[10px] font-display tracking-[0.25em] uppercase text-[#1a1a1a]/80 mb-4 font-semibold">
              Frequently Researched Together
            </h3>
            <ul className="space-y-3 mb-5">
              <BundleRow p={product} highlighted />
              {bundle.map((p) => (
                <BundleRow key={p.handle} p={p} />
              ))}
            </ul>
            <div className="flex items-center justify-between gap-4 pt-4 border-t border-black/10">
              <div>
                <p className="text-[9px] font-display tracking-[0.25em] uppercase text-[#1a1a1a]/60 font-semibold">
                  Bundle Total
                </p>
                <p className="text-xl font-sans font-bold text-[#1a1a1a] leading-none mt-1">
                  ${bundleTotal.toFixed(2)}
                </p>
              </div>
              <button
                type="button"
                onClick={onAddBundle}
                disabled={bundleAdding}
                className="px-4 h-10 rounded-full bg-[#0072BC] text-white text-[10px] font-sans font-semibold tracking-[0.2em] uppercase flex items-center gap-1.5 active:scale-[0.98] disabled:opacity-60"
              >
                <CartIcon className="w-3.5 h-3.5" />
                {bundleAdding ? "Adding…" : "Add All"}
              </button>
            </div>
          </div>
        )}

        {/* About */}
        <div className="mt-8">
          <h2 className="text-[10px] font-display tracking-[0.25em] uppercase text-[#1a1a1a]/60 mb-3 font-semibold">
            About this product
          </h2>
          <p className="text-sm font-sans text-[#444] leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Purity & Testing */}
        <div className="mt-7 bg-[#f5f5f5] rounded-2xl p-5">
          <h3 className="text-[10px] font-display tracking-[0.25em] uppercase text-[#1a1a1a]/80 mb-3 font-semibold">
            Purity &amp; Testing
          </h3>
          <div className="flex flex-wrap gap-2">
            <span className="bg-white text-xs font-sans px-3 py-1.5 rounded-full text-[#444]">
              Purity ≥99%
            </span>
            <span className="bg-white text-xs font-sans px-3 py-1.5 rounded-full text-[#444]">
              HPLC &amp; MS
            </span>
            <span className="bg-white text-xs font-sans px-3 py-1.5 rounded-full text-[#444]">
              COA Available
            </span>
          </div>
        </div>

        {/* Research use only */}
        <div className="mt-5 border border-[#eee] rounded-2xl p-5">
          <p className="text-[10px] font-display tracking-[0.25em] uppercase text-[#0072BC]/70 mb-2 font-semibold">
            Research Use Only
          </p>
          <p className="text-xs font-sans text-[#666] leading-relaxed">
            This product is intended strictly for research and laboratory
            use. Not for human consumption, medical use, or diagnostic
            purposes. By purchasing, you agree to our{" "}
            <Link href="/terms" className="text-[#0072BC] underline">
              Terms
            </Link>
            .
          </p>
        </div>
      </div>

      {/* Sticky bottom Add to Cart bar (mobile-only) */}
      <div
        aria-hidden={!showSticky}
        className={`md:hidden fixed bottom-0 left-0 right-0 z-40 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          showSticky ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="bg-white border-t border-black/5 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] flex items-center gap-2.5 shadow-[0_-12px_28px_-12px_rgba(0,0,0,0.18)]">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-display tracking-[0.2em] uppercase text-[#1a1a1a]/60 leading-none truncate">
              {product.name} {product.strength}
            </p>
            <p className="text-base font-sans font-bold text-[#1a1a1a] leading-tight mt-0.5">
              ${(product.price * qty).toFixed(2)}
            </p>
          </div>
          <div className="flex items-center bg-[#f5f5f5] rounded-full shrink-0">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              disabled={qty <= 1}
              className="w-9 h-9 flex items-center justify-center text-sm text-[#1a1a1a] disabled:opacity-30"
            >
              −
            </button>
            <span className="w-6 text-center font-sans font-semibold text-[#1a1a1a] text-sm">
              {qty}
            </span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => setQty((q) => q + 1)}
              className="w-9 h-9 flex items-center justify-center text-sm text-[#1a1a1a]"
            >
              +
            </button>
          </div>
          <button
            type="button"
            onClick={onAdd}
            disabled={adding}
            aria-label="Add to cart"
            className="group/btn relative overflow-hidden h-11 px-5 rounded-full bg-[#0072BC] text-white flex items-center gap-2 text-xs font-sans font-semibold tracking-[0.15em] uppercase active:scale-[0.97] disabled:opacity-60"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[#003E7E] origin-left scale-x-0 group-active/btn:scale-x-100 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
            />
            <span className="relative flex items-center gap-2">
              {adding ? (
                <span>Adding…</span>
              ) : added ? (
                <span>Added ✓</span>
              ) : (
                <>
                  <CartIcon />
                  Add to Cart
                </>
              )}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
