"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { product } from "@/data/product";

/**
 * The static bottle that anchors the scene transition. It fades in just
 * before the SplitReveal cut, stays centered horizontally as the dark
 * panels split open around it, then settles for the final CTA.
 */
export default function TravelingBottle() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll();

  /* fade in just before the cut, stay solid through the reveal */
  const opacity = useTransform(
    scrollYProgress,
    [0.83, 0.86, 0.94, 1],
    [0, 1, 1, 1]
  );

  /* stay centered horizontally — the bottle is the divider */
  const x = useTransform(
    scrollYProgress,
    [0.83, 1],
    ["0%", "0%"]
  );

  /* very subtle straighten + scale during transition */
  const rotate = useTransform(
    scrollYProgress,
    [0.86, 0.94, 1],
    [-2, 0, 0]
  );

  const scale = useTransform(
    scrollYProgress,
    [0.86, 0.94, 1],
    [0.95, 1, 1.05]
  );

  /* very gentle vertical drift through the cut */
  const y = useTransform(
    scrollYProgress,
    [0.86, 0.94, 1],
    ["3%", "0%", "0%"]
  );

  return (
    <motion.div
      ref={containerRef}
      style={{ opacity, x, rotate, scale, y }}
      className="fixed inset-0 z-30 flex items-center justify-center pointer-events-none"
    >
      <img
        src={product.assets.staticBottle}
        alt={product.name}
        className="max-h-[65vh] w-auto object-contain drop-shadow-[0_25px_70px_rgba(0,0,0,0.25)]"
      />
    </motion.div>
  );
}
