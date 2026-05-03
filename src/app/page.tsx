"use client";

import { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import HeroCanvas from "@/components/HeroCanvas";
import PostSequenceContent from "@/components/PostSequenceContent";
import PeptideShowcase from "@/components/PeptideShowcase";
import MobileProductGrid from "@/components/MobileProductGrid";

export default function Home() {
  const { scrollYProgress } = useScroll();
  const [introTextVisible, setIntroTextVisible] = useState(true);

  /* background: #050D1A stays solid until animation is done, then fades to light */
  const bg = useTransform(
    scrollYProgress,
    [0, 0.18, 0.22, 0.26],
    [
      "linear-gradient(180deg, #050D1A 0%, #050D1A 100%)",
      "linear-gradient(180deg, #050D1A 0%, #050D1A 100%)",
      "linear-gradient(180deg, #050D1A 0%, #f5f5f5 100%)",
      "linear-gradient(180deg, #f5f5f5 0%, #f5f5f5 100%)",
    ]
  );

  /* Dark curtain that fades IN over the hero as you scroll away from it */
  const curtainOpacity = useTransform(scrollYProgress, [0.22, 0.28], [0, 1]);

  return (
    <>
      {/* ── DESKTOP: full scroll animation experience ── */}
      <motion.div style={{ background: bg }} className="relative hidden md:block">
        {/* Dark overlay that covers the hero animation as you scroll past */}
        <motion.div
          style={{ opacity: curtainOpacity, zIndex: 5 }}
          className="fixed inset-0 bg-[#050D1A] pointer-events-none hidden md:block"
        />

        <HeroCanvas
          introTextVisible={introTextVisible}
          setIntroTextVisible={setIntroTextVisible}
        />
        <PostSequenceContent>
          <PeptideShowcase />
        </PostSequenceContent>
      </motion.div>

      {/* ── MOBILE: PeptideShowcase hero + product grid ── */}
      <div className="md:hidden bg-black">
        <PeptideShowcase />
        <MobileProductGrid />
        <PostSequenceContent />
      </div>
    </>
  );
}
