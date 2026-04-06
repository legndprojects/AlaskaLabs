"use client";

import { motion, useScroll, useTransform } from "framer-motion";

export default function Navbar() {
  const { scrollYProgress } = useScroll();
  const bg = useTransform(
    scrollYProgress,
    [0, 0.85, 0.95],
    ["rgba(5,13,26,0.3)", "rgba(5,13,26,0.3)", "rgba(139,0,0,0.4)"]
  );

  return (
    <motion.nav
      style={{ backgroundColor: bg }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 backdrop-blur-xl border-b border-white/10"
    >
      <span className="text-2xl font-display tracking-[0.2em] text-white uppercase">
        AlaskaLabs
      </span>
      <a
        href="#shop"
        className="px-6 py-2 text-sm font-display tracking-[0.15em] uppercase bg-white text-prime-blue rounded-full transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]"
      >
        Shop Now
      </a>
    </motion.nav>
  );
}
