"use client";

import { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Navbar from "@/components/Navbar";
import HeroCanvas from "@/components/HeroCanvas";
import TextOverlays from "@/components/TextOverlays";
import TravelingBottle from "@/components/TravelingBottle";
import SplitReveal from "@/components/SplitReveal";
import PostSequenceContent from "@/components/PostSequenceContent";

export default function Home() {
  const { scrollYProgress } = useScroll();
  const [introTextVisible, setIntroTextVisible] = useState(true);

  /* background stays dark until the SplitReveal panels have moved off,
     then snaps to light. The reveal handles the visible transition. */
  const bg = useTransform(
    scrollYProgress,
    [0, 0.93, 0.96],
    [
      "linear-gradient(180deg, #050D1A 0%, #050D1A 100%)",
      "linear-gradient(180deg, #050D1A 0%, #050D1A 100%)",
      "linear-gradient(180deg, #f5f5f5 0%, #f5f5f5 100%)",
    ]
  );

  return (
    <motion.div style={{ background: bg }} className="relative">
      <Navbar />

      {/* Phase 1: 192-frame scroll sequence + text overlays */}
      <div className="relative">
        <HeroCanvas
          introTextVisible={introTextVisible}
          setIntroTextVisible={setIntroTextVisible}
        />
        <TextOverlays introTextVisible={introTextVisible} />
      </div>

      {/* Premium scene transition: thin rule draws, then dark panels split
          apart vertically to reveal the white world beneath */}
      <SplitReveal />

      {/* Phase 2: Traveling bottle (fixed, moves over content below) */}
      <TravelingBottle />

      {/* Phase 2 content: specs, lab tested, final CTA */}
      <PostSequenceContent />
    </motion.div>
  );
}
