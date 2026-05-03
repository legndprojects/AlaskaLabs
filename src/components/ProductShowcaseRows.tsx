"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { catalog, type CatalogProduct } from "@/data/catalog";
import { useCart } from "@/lib/cart-context";

/**
 * Map every product to a generic kind label — never something specific to
 * what a peptide does in the body. Multi-peptide products are "BLENDS",
 * everything else is "COMPOUNDS".
 */
function kindLabel(p: CatalogProduct): string {
  return p.category.toLowerCase() === "blends" ? "BLENDS" : "COMPOUNDS";
}

function Card({ p }: { p: CatalogProduct }) {
  const { addItem, openDrawer } = useCart();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const onAdd = async (e: React.MouseEvent) => {
    /* prevent the parent <Link> from navigating when the button is clicked */
    e.preventDefault();
    e.stopPropagation();
    if (adding) return;
    setAdding(true);
    try {
      await addItem(p.handle, 1);
      setAdded(true);
      openDrawer();
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
      {/* image area: slightly bigger, vial pops up on hover */}
      <div className="relative aspect-[4/5] bg-white overflow-hidden">
        <div
          className="absolute inset-0 bg-gradient-to-b from-white via-white to-[#f0f6fb] pointer-events-none"
          aria-hidden
        />
        <img
          src={p.thumbnail}
          alt={`${p.name} ${p.strength}`}
          draggable={false}
          style={{ filter: "drop-shadow(0 12px 20px rgba(0,0,0,0.35)) drop-shadow(0 4px 8px rgba(0,0,0,0.2))" }}
          className="relative w-full h-full object-contain px-4 py-5 select-none transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-2 group-hover:scale-[1.04]"
        />
      </div>

      {/* meta + cart */}
      <div className="flex flex-col flex-1 p-5">
        <p className="text-[10px] font-display tracking-[0.25em] uppercase text-[#0072BC]/70 mb-1.5">
          {kindLabel(p)} · 99%+
        </p>
        <h3 className="text-xl md:text-2xl font-display font-black uppercase text-[#1a1a1a] leading-tight">
          {p.name}
        </h3>
        <p className="text-xs font-sans text-[#1a1a1a]/60 mt-1 mb-3">
          {p.strength}
        </p>

        <div className="mt-auto flex items-end justify-between gap-3">
          <p className="text-lg font-sans font-bold text-[#1a1a1a] leading-none">
            ${p.price.toFixed(2)}
          </p>
        </div>

        <button
          type="button"
          onClick={onAdd}
          disabled={adding}
          aria-label="Add to cart"
          className="group/btn relative overflow-hidden mt-4 h-11 rounded-full bg-[#0072BC] text-white flex items-center justify-center gap-2 text-xs font-sans font-semibold tracking-[0.2em] uppercase transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.02] hover:shadow-[0_12px_30px_-8px_rgba(0,114,188,0.55)] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {/* dark-blue fill that sweeps in from the left on hover */}
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

export default function ProductShowcaseRows() {
  return (
    <section className="relative bg-[#f5f5f5] px-6 md:px-12 lg:px-20 pb-20 md:pb-28 hidden md:block">
      <div className="max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6"
        >
          <div>
            <div className="shimmer-line h-[2px] w-20 mb-5 rounded-full" />
            <h3 className="text-5xl md:text-6xl lg:text-7xl font-display font-black uppercase text-[#0072BC] leading-[0.9] tracking-tight mb-4">
              Research Peptides
            </h3>
            <p
              className="max-w-xl text-base md:text-lg leading-[1.8] text-[#0072BC]/75 italic"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Explore the full catalog. Every vial is HPLC-verified, analyzed,
              and accompanied by a Certificate of Analysis.
            </p>
          </div>

          <Link
            href="/shop"
            className="hidden md:inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#0072BC]/20 text-[#0072BC] text-xs font-display tracking-[0.25em] uppercase font-semibold transition-colors duration-200 hover:bg-[#0072BC] hover:text-white hover:border-[#0072BC]"
          >
            View All
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.05 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {catalog.slice(0, 8).map((p) => (
            <Card key={p.handle} p={p} />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="flex justify-center mt-14"
        >
          <Link
            href="/shop"
            aria-label="View all products"
            className="group/btn relative overflow-hidden h-12 px-10 rounded-full bg-[#0072BC] text-white inline-flex items-center justify-center gap-2 text-sm font-display font-semibold tracking-[0.25em] uppercase transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.02] hover:shadow-[0_16px_40px_-10px_rgba(0,114,188,0.55)] active:scale-[0.98]"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[#003E7E] origin-left scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]"
            />
            <span className="relative flex items-center gap-2">
              View All Products
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
