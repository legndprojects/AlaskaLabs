"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Navbar from "@/components/Navbar";
import HeroCanvas from "@/components/HeroCanvas";
import TextOverlays from "@/components/TextOverlays";
import TravelingBottle from "@/components/TravelingBottle";
import PostSequenceContent from "@/components/PostSequenceContent";

export default function Home() {
  const { scrollYProgress } = useScroll();

  /* background: #050D1A stays solid until animation is done, then fades to light */
  const bg = useTransform(
    scrollYProgress,
    [0, 0.84, 0.88, 0.92],
    [
      "linear-gradient(180deg, #050D1A 0%, #050D1A 100%)",
      "linear-gradient(180deg, #050D1A 0%, #050D1A 100%)",
      "linear-gradient(180deg, #050D1A 0%, #f5f5f5 100%)",
      "linear-gradient(180deg, #f5f5f5 0%, #f5f5f5 100%)",
    ]
  );

  return (
    <motion.div style={{ background: bg }} className="relative">
      <Navbar />

      {/* Phase 1: 192-frame scroll sequence + text overlays */}
      <div className="relative">
        <HeroCanvas />
        <TextOverlays />
      </div>

      {/* Phase 2: Traveling bottle (fixed, moves over content below) */}
      <TravelingBottle />

      {/* Phase 2 content: specs, lab tested, final CTA */}
      <PostSequenceContent />
    </motion.div>
  );
}
