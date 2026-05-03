"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { product } from "@/data/product";
import FlipText from "./FlipText";

const TOTAL_FRAMES = 192;
const INTRO_END_FRAME = 48; // 0-indexed, i.e. frame 049
const INTRO_DURATION_MS = 1400;
const FRAME_SCROLL_RANGE = 0.95; // must match the useTransform mapping below
/* Lock to a fixed reference size so frames with slightly different
   dimensions don't cause visible jumps during playback */
const REF_WIDTH = 2560;
const REF_HEIGHT = 1440;

function frameSrc(i: number) {
  const n = String(i).padStart(3, "0");
  return `/images/sequence/ezgif-frame-${n}.jpg`;
}

export default function HeroCanvas({
  introTextVisible,
  setIntroTextVisible,
}: {
  introTextVisible: boolean;
  setIntroTextVisible: (v: boolean) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const introActiveRef = useRef(true);
  const minScrollRef = useRef(0);
  const [loaded, setLoaded] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  /* fade out canvas when the sequence container is scrolled past */
  const canvasOpacity = useTransform(scrollYProgress, [0.85, 0.95], [1, 0]);

  /* map scroll to frame index (only first ~95% of container plays frames) */
  const frameIndex = useTransform(scrollYProgress, [0, FRAME_SCROLL_RANGE], [0, TOTAL_FRAMES - 1]);

  /* preload frames — show page after intro frames load, rest loads in background */
  useEffect(() => {
    let mounted = true;
    const imgs: HTMLImageElement[] = new Array(TOTAL_FRAMES);
    const PRIORITY_FRAMES = INTRO_END_FRAME + 5; // load enough for intro + buffer
    let priorityCount = 0;

    // Load priority frames first (1 through PRIORITY_FRAMES)
    for (let i = 1; i <= PRIORITY_FRAMES; i++) {
      const img = new Image();
      img.src = frameSrc(i);
      img.onload = () => {
        priorityCount++;
        if (priorityCount === PRIORITY_FRAMES && mounted) setLoaded(true);
      };
      imgs[i - 1] = img;
    }

    // Load remaining frames in background after a short delay
    const loadRest = () => {
      for (let i = PRIORITY_FRAMES + 1; i <= TOTAL_FRAMES; i++) {
        const img = new Image();
        img.src = frameSrc(i);
        imgs[i - 1] = img;
      }
    };
    const timer = setTimeout(loadRest, 100);

    imagesRef.current = imgs;
    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, []);

  /* draw a frame — HiDPI aware, "contain" logic */
  const draw = useCallback((idx: number) => {
    const canvas = canvasRef.current;
    const img = imagesRef.current[idx];
    if (!canvas || !img) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;

    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.scale(dpr, dpr);
    }

    ctx.clearRect(0, 0, w, h);

    /* cover — always fill the entire screen, no gaps or white lines */
    const imgRatio = REF_WIDTH / REF_HEIGHT;
    const canvasRatio = w / h;
    let dw: number, dh: number, dx: number, dy: number;

    if (imgRatio > canvasRatio) {
      dh = h;
      dw = h * imgRatio;
      dx = (w - dw) / 2;
      dy = 0;
    } else {
      dw = w;
      dh = w / imgRatio;
      dx = 0;
      dy = (h - dh) / 2;
    }

    ctx.drawImage(img, dx, dy, dw, dh);
  }, []);

  /* react to scroll (suppressed while the intro animation is running) */
  useMotionValueEvent(frameIndex, "change", (v) => {
    if (loaded && !introActiveRef.current) draw(Math.round(v));
  });

  /* intro animation: auto-play frames 0 → INTRO_END_FRAME on load, then
     jump the page scroll to the position that corresponds to the end frame so
     scroll-driven playback picks up seamlessly. Scrolling back up still
     reaches frame 1 since the scroll→frame mapping is unchanged. */
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!loaded) return;

    window.scrollTo(0, 0);

    let raf = 0;
    let cancelled = false;
    const start = performance.now();

    let restScrollY = 0;

    const finishToScroll = () => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const containerTopAbs = window.scrollY + rect.top;
      const scrollableLen = container.offsetHeight;
      const targetProgress =
        (INTRO_END_FRAME / (TOTAL_FRAMES - 1)) * FRAME_SCROLL_RANGE;
      const targetY = containerTopAbs + targetProgress * scrollableLen;
      window.scrollTo(0, targetY);
      restScrollY = Math.round(window.scrollY);
      minScrollRef.current = restScrollY;
    };

    const tick = (now: number) => {
      if (cancelled) return;
      const t = Math.min((now - start) / INTRO_DURATION_MS, 1);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      const idx = Math.round(eased * INTRO_END_FRAME);
      draw(idx);
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        /* jump scroll first, then release the intro gate a couple of frames
           later so the settling scroll events don't redraw a slightly
           lower rounded frame (the "snap-back" the user was seeing). */
        finishToScroll();
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (!cancelled) introActiveRef.current = false;
          });
        });
        /* keep the intro copy visible — it only fades when the user
           actually starts scrolling (handled in cancelIntro). */
      }
    };

    const cancelIntro = () => {
      if (cancelled) return;
      cancelled = true;
      cancelAnimationFrame(raf);
      finishToScroll();
      introActiveRef.current = false;
      draw(Math.round(frameIndex.get()));
    };

    /* Once intro finishes, let scroll position drive text visibility */
    const onScroll = () => {
      if (introActiveRef.current) return;
      const distance = window.scrollY - restScrollY;
      /* show text when near the landing point, fade when scrolled 200px+ away */
      setIntroTextVisible(distance < 200);
    };

    window.addEventListener("wheel", cancelIntro, { passive: true });
    window.addEventListener("touchstart", cancelIntro, { passive: true });
    window.addEventListener("keydown", cancelIntro);
    window.addEventListener("scroll", onScroll, { passive: true });

    /* draw initial frame then kick off the intro */
    draw(0);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("wheel", cancelIntro);
      window.removeEventListener("touchstart", cancelIntro);
      window.removeEventListener("keydown", cancelIntro);
      window.removeEventListener("scroll", onScroll);
    };
  }, [loaded, draw, frameIndex, setIntroTextVisible]);

  /* Clamp scroll: never let user scroll above the intro landing point */
  useEffect(() => {
    const clamp = () => {
      const min = minScrollRef.current;
      if (min > 0 && window.scrollY < min) {
        window.scrollTo(0, min);
      }
    };
    window.addEventListener("scroll", clamp, { passive: false });
    return () => window.removeEventListener("scroll", clamp);
  }, []);

  /* handle resize */
  useEffect(() => {
    const onResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      /* reset so next draw recalculates */
      canvas.width = 0;
      canvas.height = 0;
      if (loaded) draw(Math.round(frameIndex.get()));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [loaded, draw, frameIndex]);

  return (
    <div ref={containerRef} className="relative" style={{ height: "250vh" }}>
      <motion.div
        style={{ opacity: canvasOpacity }}
        className="fixed inset-0 w-screen h-screen"
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ zIndex: 1 }}
        />
        {/* Intro section — editorial hierarchy: eyebrow, rule, headline,
            description. Anchored left so it never overlaps the bottle. */}
        <div
          className="absolute pointer-events-none transition-opacity duration-700 ease-out flex items-center"
          style={{
            opacity: loaded && introTextVisible ? 1 : 0,
            zIndex: 2,
            top: "100px",
            bottom: 0,
            left: "4vw",
            width: "min(36vw, 520px)",
          }}
        >
          <div className="w-full">
            {/* eyebrow tag */}
            <div
              className="font-display text-xs md:text-sm tracking-[0.35em] uppercase text-white/50 mb-4"
              style={{ textShadow: "0 2px 12px rgba(0,0,0,0.6)" }}
            >
              ALASKA LABS
            </div>

            {/* thin accent rule */}
            <div className="h-px w-10 bg-white/40 mb-7" />

            {/* headline */}
            <h1
              className="text-4xl md:text-6xl lg:text-7xl xl:text-[7rem] font-display font-black uppercase text-white leading-[0.85] tracking-tight"
              style={{
                textShadow: "0 2px 24px rgba(0,0,0,0.55)",
              }}
            >
              {["THE GOLD", "STANDARD", "IN PURITY"].map((line, li) => (
                  <span key={li} className="block whitespace-nowrap">
                    <FlipText
                      text={line}
                      trigger={loaded}
                      delay={li * 260}
                      stagger={28}
                      cycles={4}
                    />
                  </span>
                ))}
            </h1>

            {/* description */}
            <p
              className="mt-8 max-w-md text-[13px] md:text-[15px] leading-[1.65] text-white/70 italic"
              style={{
                fontFamily: "var(--font-serif)",
                textShadow: "0 2px 14px rgba(0,0,0,0.55)",
              }}
            >
              Every batch undergoes LC-MS and HPLC testing for identity, purity, endotoxins, residual solvents, bioburden, and elemental impurities — going beyond basic pass/fail to deliver research-grade confidence with every lot.
            </p>
          </div>
        </div>
      </motion.div>
      {!loaded && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-[#050D1A]">
          <div className="text-white text-2xl font-display tracking-[0.3em] animate-pulse">
            LOADING
          </div>
        </div>
      )}
    </div>
  );
}
