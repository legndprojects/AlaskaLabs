"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { product } from "@/data/product";
import FlipText from "./FlipText";

export default function PostSequenceContent() {
  return (
    <div className="relative z-20">
      {/* Section 1: Spec cards */}
      <SpecsSection />

      {/* Section 2: Lab Tested */}
      <LabTestedSection />

      {/* Final CTA */}
      <FinalSection />
    </div>
  );
}

function SpecsSection() {
  return (
    <section className="min-h-screen flex flex-col justify-center px-8 md:px-16 lg:px-24 bg-[#f5f5f5]">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h3 className="text-6xl md:text-8xl font-display font-black uppercase text-[#1a1a1a] mb-12 leading-[0.95]">
          <FlipText text={product.postSections[0].title} />
        </h3>

        <div className="grid grid-cols-2 gap-4 max-w-xl">
          {product.specs.map((spec, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-black/5"
            >
              <p className="text-4xl md:text-5xl font-display font-black text-[#1a1a1a] leading-none mb-1">
                <FlipText
                  text={spec.value}
                  stagger={35}
                  cycles={3}
                  delay={i * 100}
                />
              </p>
              <p className="text-xs md:text-sm font-sans tracking-wide text-[#666] uppercase">
                <FlipText
                  text={spec.label}
                  stagger={20}
                  cycleSpeed={25}
                  cycles={2}
                  delay={i * 100 + 200}
                />
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function LabTestedSection() {
  return (
    <section className="min-h-screen flex flex-col justify-center px-8 md:px-16 lg:px-24 bg-[#f5f5f5]">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-2xl"
      >
        <h3 className="text-6xl md:text-8xl font-display font-black uppercase text-[#1a1a1a] mb-8 leading-[0.95]">
          <FlipText text={product.postSections[1].title} />
        </h3>
        <p className="text-lg md:text-xl leading-relaxed text-[#444] font-sans max-w-xl">
          <FlipText
            text={product.postSections[1].description}
            stagger={8}
            cycleSpeed={20}
            cycles={2}
            delay={300}
          />
        </p>
      </motion.div>
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
        <h2 className="text-5xl md:text-7xl font-display font-black uppercase text-[#1a1a1a] leading-[0.95] max-w-4xl mb-8">
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
