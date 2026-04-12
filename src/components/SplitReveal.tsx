"use client";

import { motion, useScroll, useTransform } from "framer-motion";

/**
 * SplitReveal — premium scene-transition between the dark hero scroll
 * sequence and the white SpecsSection beneath it.
 *
 * Choreography (driven by full-page scroll progress):
 *   1. Anticipation: a thin horizontal accent line draws across the
 *      viewport at the bottle's vertical center.
 *   2. The cut: two dark panels (top half + bottom half) split apart
 *      vertically — top slides up, bottom slides down — like opening a
 *      horizontal blind. The bottle (TravelingBottle, z-30) stays
 *      anchored in the gap.
 *   3. The reveal: SpecsSection underneath becomes visible through the
 *      growing gap, then the panels exit fully off-screen.
 */
export default function SplitReveal() {
  const { scrollYProgress } = useScroll();

  /* panels start fully closed at 0.86, fully open by 0.94 */
  const topY = useTransform(
    scrollYProgress,
    [0.86, 0.94],
    ["0%", "-100%"]
  );
  const bottomY = useTransform(
    scrollYProgress,
    [0.86, 0.94],
    ["0%", "100%"]
  );

  /* the accent line draws first (anticipation), persists, then fades */
  const lineScaleX = useTransform(
    scrollYProgress,
    [0.83, 0.86, 0.94],
    [0, 1, 1]
  );
  const lineOpacity = useTransform(
    scrollYProgress,
    [0.83, 0.86, 0.93, 0.95],
    [0, 1, 1, 0]
  );

  /* the entire reveal layer is invisible outside the transition zone so it
     doesn't sit on top of the hero canvas and hide everything. Fades in
     just before the cut and out once the panels have moved off-screen. */
  const containerOpacity = useTransform(
    scrollYProgress,
    [0, 0.84, 0.86, 0.94, 0.96],
    [0, 0, 1, 1, 0]
  );

  return (
    <motion.div
      style={{ opacity: containerOpacity }}
      className="fixed inset-0 z-20 pointer-events-none overflow-hidden"
    >
      {/* top dark panel */}
      <motion.div
        style={{ y: topY }}
        className="absolute left-0 right-0 top-0 h-1/2 bg-[#050D1A]"
      />
      {/* bottom dark panel */}
      <motion.div
        style={{ y: bottomY }}
        className="absolute left-0 right-0 bottom-0 h-1/2 bg-[#050D1A]"
      />
      {/* center accent rule that draws horizontally as the cut begins */}
      <motion.div
        style={{
          scaleX: lineScaleX,
          opacity: lineOpacity,
          transformOrigin: "center",
        }}
        className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-white/50"
      />
    </motion.div>
  );
}
