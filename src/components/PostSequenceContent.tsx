"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { product } from "@/data/product";
import FlipText from "./FlipText";

export default function PostSequenceContent() {
  return (
    <div className="relative z-20">
      {/* Combined: Maximum Purity (left) + Lab Tested (right) */}
      <SpecsAndLabSection />

      {/* Final CTA */}
      <FinalSection />
    </div>
  );
}

function SpecsAndLabSection() {
  return (
    <section className="relative px-8 md:px-12 lg:px-20 py-20 md:py-28 bg-[#f5f5f5] overflow-hidden">
      <div className="relative max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12">
        {/* ── LEFT: Maximum Purity ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="font-display text-xs md:text-sm tracking-[0.35em] uppercase text-[#0072BC]/70 mb-4">
            {product.postSections[0].eyebrow}
          </div>
          <div className="h-px w-10 bg-[#0072BC]/40 mb-5" />
          <h3 className="text-5xl md:text-6xl lg:text-7xl font-display font-black uppercase text-[#0072BC] leading-[0.85] tracking-tight mb-5">
            <FlipText text={product.postSections[0].title} />
          </h3>
          <p
            className="max-w-md text-[13px] md:text-[14px] leading-[1.7] text-[#0072BC]/75 italic mb-8"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {product.postSections[0].description}
          </p>

          {/* Spec cards 2×2 */}
          <div className="grid grid-cols-2 gap-3">
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
                className="group relative bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-[#0072BC]/10 overflow-hidden cursor-default transition-[box-shadow,border-color] duration-400 hover:border-[#0072BC]/35 hover:shadow-[0_24px_48px_-16px_rgba(0,114,188,0.3)]"
              >
                {/* hover sheen */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                  style={{
                    background:
                      "radial-gradient(300px 160px at 50% 0%, rgba(0,114,188,0.12), transparent 60%)",
                  }}
                />
                <p className="relative text-3xl md:text-4xl font-display font-black text-[#0072BC] leading-none mb-1.5 transition-transform duration-400 group-hover:-translate-y-0.5">
                  <FlipText text={spec.value} stagger={35} cycles={3} delay={i * 100} />
                </p>
                <p className="relative text-[10px] md:text-[11px] tracking-[0.18em] text-[#0072BC]/70 uppercase font-display">
                  <FlipText text={spec.label} stagger={20} cycleSpeed={25} cycles={2} delay={i * 100 + 200} />
                </p>
                {/* corner dot */}
                <div className="pointer-events-none absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-[#0072BC]/25 group-hover:bg-[#0072BC] transition-colors duration-400" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── RIGHT: Lab Tested ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="font-display text-xs md:text-sm tracking-[0.35em] uppercase text-[#0072BC]/70 mb-4">
            {product.postSections[1].eyebrow}
          </div>
          <div className="h-px w-10 bg-[#0072BC]/40 mb-5" />
          <h3 className="text-5xl md:text-6xl lg:text-7xl font-display font-black uppercase text-[#0072BC] leading-[0.85] tracking-tight mb-5">
            <FlipText text={product.postSections[1].title} />
          </h3>
          <p
            className="max-w-lg text-[13px] md:text-[14px] leading-[1.75] text-[#0072BC]/75 italic"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {product.postSections[1].description}
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function FinalSection() {
  return (
    <section
      id="shop"
      className="min-h-screen flex flex-col items-center justify-end px-8 pb-24 relative bg-[#f5f5f5]"
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="text-center mt-auto"
      >
        <h2 className="text-5xl md:text-7xl font-display font-black uppercase text-[#0072BC] leading-[0.95] max-w-4xl mb-8">
          <FlipText text={product.assets.finalTagline} stagger={25} />
        </h2>
        <Link
          href="/shop"
          className="inline-block px-12 py-4 text-xl font-display tracking-[0.2em] uppercase bg-[#1a1a1a] text-white rounded-full transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(0,0,0,0.2)]"
        >
          <FlipText text="Buy Now" stagger={50} cycles={5} delay={400} />
        </Link>
      </motion.div>
    </section>
  );
}
