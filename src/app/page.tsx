"use client";

import HeroCanvas from "@/components/HeroCanvas";
import PostSequenceContent from "@/components/PostSequenceContent";
import PeptideShowcase from "@/components/PeptideShowcase";
import MobileProductGrid from "@/components/MobileProductGrid";

export default function Home() {
  return (
    <>
      {/* ── DESKTOP: PeptideShowcase hero, then products, then animation ── */}
      <div className="relative hidden md:block">
        <PeptideShowcase />
        <PostSequenceContent>
          <HeroCanvas />
        </PostSequenceContent>
      </div>

      {/* ── MOBILE: PeptideShowcase hero + product grid ── */}
      <div className="md:hidden bg-black">
        <PeptideShowcase />
        <MobileProductGrid />
        <PostSequenceContent />
      </div>
    </>
  );
}
