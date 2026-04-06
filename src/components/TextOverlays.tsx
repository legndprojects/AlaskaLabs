"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { product } from "@/data/product";

export default function TextOverlays() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  /* stagger 3 sections across first ~45% of scroll */
  const sections = product.storySections;
  const sectionDuration = 0.13;
  const gap = 0.02;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 2, height: "1400vh" }}
    >
      {sections.map((text, i) => {
        const start = 0.05 + i * (sectionDuration + gap);
        const fadeIn = start;
        const hold = start + 0.03;
        const holdEnd = start + sectionDuration - 0.03;
        const fadeOut = start + sectionDuration;

        return (
          <TextSection
            key={i}
            text={text}
            scrollYProgress={scrollYProgress}
            fadeIn={fadeIn}
            hold={hold}
            holdEnd={holdEnd}
            fadeOut={fadeOut}
          />
        );
      })}
    </div>
  );
}

function TextSection({
  text,
  scrollYProgress,
  fadeIn,
  hold,
  holdEnd,
  fadeOut,
}: {
  text: string;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
  fadeIn: number;
  hold: number;
  holdEnd: number;
  fadeOut: number;
}) {
  const opacity = useTransform(
    scrollYProgress,
    [fadeIn, hold, holdEnd, fadeOut],
    [0, 1, 1, 0]
  );
  const y = useTransform(
    scrollYProgress,
    [fadeIn, hold, holdEnd, fadeOut],
    [40, 0, 0, -40]
  );
  const scale = useTransform(
    scrollYProgress,
    [fadeIn, hold],
    [0.92, 1]
  );

  return (
    <motion.div
      style={{ opacity, y, scale, position: "fixed", inset: 0 }}
      className="flex items-center justify-center text-center px-8"
    >
      <h2
        className="text-7xl md:text-9xl font-display font-black uppercase text-white leading-[0.95] max-w-5xl"
        style={{
          textShadow: "0 4px 60px rgba(0,0,0,0.5), 0 2px 10px rgba(0,0,0,0.3)",
        }}
      >
        {text}
      </h2>
    </motion.div>
  );
}
