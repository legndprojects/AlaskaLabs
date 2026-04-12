"use client";

import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import { useRef, useState } from "react";
import { product } from "@/data/product";
import FlipText from "./FlipText";

export default function TextOverlays({
  introTextVisible,
}: {
  introTextVisible: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  /* stagger 3 sections across first ~45% of scroll */
  const sections = product.storySections;
  const sectionDuration = 0.13;
  const gap = 0.02;

  /* alternate sides: left, right, left */
  const sides: Array<"left" | "right"> = ["left", "right", "left"];

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none transition-opacity duration-700 ease-out"
      style={{
        zIndex: 2,
        height: "1400vh",
        /* suppress while the intro copy is still on screen so section 2
           ("EXCEPTIONAL STANDARDS") doesn't bleed through at the intro's
           resting scroll position */
        opacity: introTextVisible ? 0 : 1,
      }}
    >
      {sections.map((section, i) => {
        const start = 0.05 + i * (sectionDuration + gap);
        const fadeIn = start;
        const hold = start + 0.03;
        const holdEnd = start + sectionDuration - 0.03;
        const fadeOut = start + sectionDuration;

        return (
          <TextSection
            key={i}
            eyebrow={section.eyebrow}
            headline={section.headline}
            description={section.description}
            side={sides[i % sides.length]}
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
  eyebrow,
  headline,
  description,
  side,
  scrollYProgress,
  fadeIn,
  hold,
  holdEnd,
  fadeOut,
}: {
  eyebrow: string;
  headline: string;
  description: string;
  side: "left" | "right";
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

  /* fire the FlipText scramble once the scroll crosses this section's fadeIn */
  const [triggered, setTriggered] = useState(false);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (!triggered && v >= fadeIn) setTriggered(true);
  });

  const sideStyles =
    side === "left"
      ? { left: "4vw", width: "38vw" }
      : { right: "4vw", width: "38vw" };

  const alignClass = side === "left" ? "text-left" : "text-right";
  const ruleAlignClass = side === "right" ? "ml-auto" : "";

  return (
    <motion.div
      style={{
        opacity,
        position: "fixed",
        top: 0,
        bottom: 0,
        ...sideStyles,
      }}
      className="flex items-center pointer-events-none"
    >
      <div className={`w-full ${alignClass}`}>
        {/* eyebrow tag */}
        <div
          className="font-display text-xs md:text-sm tracking-[0.35em] uppercase text-white/50 mb-5"
          style={{ textShadow: "0 2px 12px rgba(0,0,0,0.6)" }}
        >
          {eyebrow}
        </div>

        {/* thin accent rule */}
        <div className={`h-px w-10 bg-white/40 mb-7 ${ruleAlignClass}`} />

        {/* headline */}
        <h2
          className="text-5xl md:text-7xl lg:text-8xl xl:text-[8.5rem] font-display font-black uppercase text-white leading-[0.85] tracking-tight"
          style={{
            textShadow: "0 2px 24px rgba(0,0,0,0.55)",
          }}
        >
          {headline.split("\n").map((line, li) => (
            <span key={li} className="block whitespace-nowrap">
              <FlipText
                text={line}
                trigger={triggered}
                delay={li * 260}
                stagger={28}
                cycles={4}
              />
            </span>
          ))}
        </h2>

        {/* description */}
        <p
          className={`mt-8 max-w-md text-[13px] md:text-[15px] leading-[1.65] text-white/70 italic ${
            side === "right" ? "ml-auto" : ""
          }`}
          style={{
            fontFamily: "var(--font-serif)",
            textShadow: "0 2px 14px rgba(0,0,0,0.55)",
          }}
        >
          {description}
        </p>
      </div>
    </motion.div>
  );
}
