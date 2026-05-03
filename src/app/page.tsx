"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import HeroCanvas from "@/components/HeroCanvas";
import PostSequenceContent from "@/components/PostSequenceContent";
import PeptideShowcase from "@/components/PeptideShowcase";
import MobileProductGrid from "@/components/MobileProductGrid";

export default function Home() {
  const { scrollYProgress } = useScroll();
  const [introTextVisible, setIntroTextVisible] = useState(true);
  const [showCurtain, setShowCurtain] = useState(true);

  /* Dismiss the dark curtain after the intro animation completes */
  useEffect(() => {
    const timer = setTimeout(() => setShowCurtain(false), 1800);
    return () => clearTimeout(timer);
  }, []);

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

  return (
    <>
      {/* ── DESKTOP: full scroll animation experience ── */}
      <motion.div style={{ background: bg }} className="relative hidden md:block">
        {/* Dark curtain that fades away after intro */}
        <AnimatePresence>
          {showCurtain && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-0 bg-[#050D1A] pointer-events-none"
              style={{ zIndex: 40 }}
            />
          )}
        </AnimatePresence>

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
