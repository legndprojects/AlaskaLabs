"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { product } from "@/data/product";
import { catalog } from "@/data/catalog";
import FlipText from "./FlipText";
import ProductShowcaseRows from "./ProductShowcaseRows";

export default function PostSequenceContent() {
  return (
    <div className="relative z-20">
      {/* Mobile: specs first, then horizontal scroll catalog */}
      <div className="md:hidden">
        <SpecsAndLabSection />
        <MobileHorizontalCatalog />
      </div>

      {/* Desktop: vertical card grid */}
      <ProductShowcaseRows />

      {/* Desktop: specs after catalog */}
      <div className="hidden md:block">
        <SpecsAndLabSection />
      </div>

      {/* Final CTA */}
      <FinalSection />
    </div>
  );
}

function SpecsAndLabSection() {
  return (
    <section className="relative px-8 md:px-12 lg:px-20 py-20 md:py-28 bg-[#f5f5f5] overflow-hidden">
      <div className="relative max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
        {/* ── LEFT: Maximum Purity ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col justify-center"
        >
          <div className="font-display text-sm md:text-base tracking-[0.35em] uppercase text-[#0072BC]/70 mb-5">
            {product.postSections[0].eyebrow}
          </div>
          <div className="shimmer-line h-[2px] w-20 mb-6 rounded-full" />
          <h3 className="text-6xl md:text-7xl lg:text-8xl font-display font-black uppercase text-[#0072BC] leading-[0.85] tracking-tight mb-6">
            <FlipText text={product.postSections[0].title} />
          </h3>
          <p
            className="max-w-lg text-base md:text-lg leading-[1.8] text-[#0072BC]/80 italic"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {product.postSections[0].description}
          </p>
        </motion.div>

        {/* ── RIGHT: Spec Cards 2×2 ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center"
        >
          <div className="grid grid-cols-2 gap-4 w-full">
            {product.specs.map((spec, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.7,
                  delay: 0.15 + i * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{
                  y: -5,
                  scale: 1.02,
                  transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
                }}
                className="group relative bg-white/70 backdrop-blur-sm rounded-2xl p-7 md:p-8 border border-[#0072BC]/10 overflow-hidden cursor-default transition-[box-shadow,border-color] duration-400 hover:border-[#0072BC]/35 hover:shadow-[0_24px_48px_-16px_rgba(0,114,188,0.3)]"
              >
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                  style={{
                    background:
                      "radial-gradient(300px 160px at 50% 0%, rgba(0,114,188,0.12), transparent 60%)",
                  }}
                />
                <p className="relative text-4xl md:text-5xl font-display font-black text-[#0072BC] leading-none mb-2 transition-transform duration-400 group-hover:-translate-y-0.5">
                  <FlipText text={spec.value} stagger={35} cycles={3} delay={i * 100} />
                </p>
                <p className="relative text-[10px] md:text-[11px] tracking-[0.1em] text-[#0072BC]/70 uppercase font-display">
                  <FlipText text={spec.label} stagger={20} cycleSpeed={25} cycles={2} delay={i * 100 + 200} />
                </p>
                <div className="pointer-events-none absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-[#0072BC]/25 group-hover:bg-[#0072BC] transition-colors duration-400" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function FinalSection() {
  return (
    <section
      id="shop"
      className="flex flex-col items-center justify-center px-8 pt-4 pb-24 relative bg-[#f5f5f5]"
    >
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="text-5xl md:text-7xl font-display font-black uppercase text-[#0072BC] leading-[0.95] max-w-4xl mb-8 mx-auto">
            The Purest Peptides You Can Get.
          </h2>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link
            href="/shop"
            className="inline-block px-12 py-4 text-xl font-display tracking-[0.2em] uppercase bg-[#1a1a1a] text-white rounded-full transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(0,0,0,0.2)]"
          >
            Shop Now
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function MobileHorizontalCatalog() {
  return (
    <section className="bg-[#f5f5f5] py-10 overflow-hidden">
      <div className="px-5 mb-6">
        <p className="text-[11px] tracking-[0.3em] uppercase text-[#0072BC]/60 font-display mb-2">
          Catalog
        </p>
        <div className="flex items-end justify-between">
          <h3 className="text-3xl font-display font-black uppercase text-[#0072BC] leading-[0.95]">
            Research Peptides
          </h3>
          <Link
            href="/shop"
            className="text-[11px] font-display tracking-[0.15em] uppercase text-[#0072BC]/70 hover:text-[#0072BC]"
          >
            View All →
          </Link>
        </div>
      </div>

      <div
        className="flex gap-4 overflow-x-auto px-5 pb-4"
        style={{
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {catalog.map((p) => (
          <Link
            key={p.handle}
            href={`/shop/${p.handle}`}
            className="shrink-0 w-[220px] bg-white rounded-2xl border border-[#0072BC]/8 overflow-hidden flex flex-col"
          >
            <div className="aspect-[4/5] bg-gradient-to-b from-[#f0f4f8] to-[#e8ecf0] overflow-hidden">
              <img
                src={p.thumbnail}
                alt={p.name}
                style={{ filter: "drop-shadow(0 12px 20px rgba(0,0,0,0.35)) drop-shadow(0 4px 8px rgba(0,0,0,0.2))" }}
                className="w-full h-full object-contain p-3"
                draggable={false}
              />
            </div>
            <div className="p-4 flex flex-col flex-1">
              <p className="text-[11px] tracking-[0.12em] uppercase text-[#0072BC]/60 font-display mb-1.5">
                99%+ PURITY
              </p>
              <h4 className="font-display font-bold text-xl text-[#0b1a3a] leading-tight mb-1">
                {p.name}
              </h4>
              <p className="text-sm text-[#0b1a3a]/50 mb-2">{p.strength}</p>
              <span className="mt-auto font-display font-bold text-2xl text-[#0072BC]">
                ${p.price.toFixed(2)}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
