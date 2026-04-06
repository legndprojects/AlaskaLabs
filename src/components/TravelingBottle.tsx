"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { product } from "@/data/product";

export default function TravelingBottle() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll();

  /* appear when white sections start, semi-transparent over cards, solid at end */
  const opacity = useTransform(
    scrollYProgress,
    [0.85, 0.87, 0.88, 0.96, 0.98, 1],
    [0, 0.8, 0.4, 0.4, 0.85, 1]
  );

  /* start far right overlapping the cards, then drift left, settle center at final */
  const x = useTransform(
    scrollYProgress,
    [0.86, 0.89, 0.92, 0.96, 1],
    ["35%", "25%", "10%", "-8%", "0%"]
  );

  /* rotation: tilted like reference, straighten at end */
  const rotate = useTransform(
    scrollYProgress,
    [0.86, 0.90, 0.96, 1],
    [-10, -6, 4, 0]
  );

  /* scale */
  const scale = useTransform(
    scrollYProgress,
    [0.86, 0.93, 1],
    [0.95, 0.95, 1.05]
  );

  /* vertical: start slightly below center (near the cards), rise to center */
  const y = useTransform(
    scrollYProgress,
    [0.86, 0.93, 1],
    ["12%", "6%", "0%"]
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
        className="max-h-[65vh] w-auto object-contain drop-shadow-[0_20px_60px_rgba(0,0,0,0.15)]"
      />
    </motion.div>
  );
}
