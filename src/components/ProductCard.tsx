"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import type { CatalogProduct } from "@/data/catalog";

interface ProductCardProps {
  product: CatalogProduct;
}

/**
 * Map every product to a generic kind label — never something specific to
 * what a peptide does in the body. Multi-peptide products are "BLENDS",
 * everything else is "COMPOUNDS". Mirrors the logic in
 * ProductShowcaseRows so the home-page grid and the /shop grid read the
 * same.
 */
function kindLabel(p: CatalogProduct): string {
  return p.category.toLowerCase() === "blends" ? "BLENDS" : "COMPOUNDS";
}

export default function ProductCard({ product: p }: ProductCardProps) {
  const { addItem, openDrawer } = useCart();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const onAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (adding) return;
    setAdding(true);
    try {
      await addItem(p.handle, 1);
      openDrawer();
      setAdded(true);
      setTimeout(() => setAdded(false), 1400);
    } catch {
      setAdded(true);
      setTimeout(() => setAdded(false), 1400);
    } finally {
      setAdding(false);
    }
  };

  return (
    <Link
      href={`/shop/${p.handle}`}
      className="group flex flex-col bg-white rounded-2xl border border-[#0072BC]/10 overflow-hidden transition-[border-color,box-shadow,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-[#0072BC]/35 hover:shadow-[0_24px_48px_-16px_rgba(0,114,188,0.25)] hover:-translate-y-1"
    >
      {/* image area: same aspect-[4/5] portrait + hover lift as the home page */}
      <div className="relative aspect-[4/5] bg-white overflow-hidden">
        <div
          className="absolute inset-0 bg-gradient-to-b from-white via-white to-[#f0f6fb] pointer-events-none"
          aria-hidden
        />
        <img
          src={p.thumbnail}
          alt={`${p.name} ${p.strength}`}
          draggable={false}
          className="relative w-full h-full object-contain px-4 py-5 select-none transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-2 group-hover:scale-[1.04]"
        />
      </div>

      {/* meta + cart */}
      <div className="flex flex-col flex-1 p-3 md:p-5">
        <p className="text-[9px] md:text-[10px] font-display tracking-[0.25em] uppercase text-[#0072BC]/70 mb-1">
          {kindLabel(p)} · 99%+
        </p>
        <h3 className="text-sm md:text-2xl font-display font-black uppercase text-[#1a1a1a] leading-tight">
          {p.name}
        </h3>
        <p className="text-[10px] md:text-xs font-sans text-[#1a1a1a]/60 mt-0.5 mb-2 md:mb-3">
          {p.strength} · {p.vial}
        </p>

        <div className="mt-auto flex items-end justify-between gap-3">
          <p className="text-base md:text-lg font-sans font-bold text-[#1a1a1a] leading-none">
            ${p.price.toFixed(2)}
          </p>
        </div>

        <button
          type="button"
          onClick={onAdd}
          disabled={adding}
          aria-label="Add to cart"
          className="group/btn relative overflow-hidden mt-2 md:mt-4 h-9 md:h-11 rounded-full bg-[#0072BC] text-white flex items-center justify-center gap-2 text-[10px] md:text-xs font-sans font-semibold tracking-[0.15em] md:tracking-[0.2em] uppercase transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.02] hover:shadow-[0_12px_30px_-8px_rgba(0,114,188,0.55)] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[#003E7E] origin-left scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]"
          />
          <span className="relative flex items-center gap-2">
            {adding ? (
              <span>Adding…</span>
            ) : added ? (
              <span>Added ✓</span>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                  />
                </svg>
                <span>Add to Cart</span>
              </>
            )}
          </span>
        </button>
      </div>
    </Link>
  );
}
