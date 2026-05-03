"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { product } from "@/data/product";
import FlipText from "./FlipText";

const TOTAL_FRAMES = 192;
const REF_WIDTH = 2560;
const REF_HEIGHT = 1440;

function frameSrc(i: number) {
  const n = String(i).padStart(3, "0");
  return `/images/sequence/ezgif-frame-${n}.jpg`;
}

export default function HeroCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.5", "end start"],
  });

  /*
   * With offset ["start 0.5", "end start"]:
   * Total scroll range = 350vh + 50vh = 400vh
   * Sticky begins when container top hits viewport top (scrollYProgress ~0.125)
   * Sticky range = 250vh of the 400vh total = ends at ~0.75
   * Map frames from when sticky begins through end of sticky range
   */
  const frameIndex = useTransform(scrollYProgress, [0.05, 0.72], [0, TOTAL_FRAMES - 1]);
  const textOpacity = useTransform(scrollYProgress, [0.08, 0.15, 0.35, 0.5], [0, 1, 1, 0]);

  /* detect when section enters viewport to trigger FlipText */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* preload frames */
  useEffect(() => {
    let mounted = true;
    let triggered = false;
    const imgs: HTMLImageElement[] = new Array(TOTAL_FRAMES);
    let count = 0;
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = frameSrc(i);
      img.onload = () => {
        count++;
        if (count >= 30 && mounted && !triggered) {
          triggered = true;
          setLoaded(true);
        }
      };
      imgs[i - 1] = img;
    }
    imagesRef.current = imgs;
    return () => { mounted = false; };
  }, []);

  /* draw a frame — HiDPI aware, cover logic */
  const draw = useCallback((idx: number) => {
    const canvas = canvasRef.current;
    const img = imagesRef.current[idx];
    if (!canvas || !img) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const el = canvas.parentElement;
    if (!el) return;
    const w = el.clientWidth;
    const h = el.clientHeight;

    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.scale(dpr, dpr);
    }

    ctx.clearRect(0, 0, w, h);

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

  /* scroll-driven playback */
  useMotionValueEvent(frameIndex, "change", (v) => {
    if (loaded) draw(Math.round(Math.min(v, TOTAL_FRAMES - 1)));
  });

  /* draw first frame when loaded */
  useEffect(() => {
    if (loaded) draw(0);
  }, [loaded, draw]);

  /* handle resize */
  useEffect(() => {
    const onResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = 0;
      canvas.height = 0;
      if (loaded) draw(Math.round(frameIndex.get()));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [loaded, draw, frameIndex]);

  return (
    <div ref={containerRef} style={{ height: "350vh" }}>
      {/* sticky keeps canvas pinned for 250vh of scrolling, then it
          naturally scrolls away — no dead space, no gap */}
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        <canvas ref={canvasRef} className="w-full h-full" />
        {/* Text overlay */}
        <motion.div
          style={{ opacity: textOpacity }}
          className="absolute inset-0 pointer-events-none flex items-center"
        >
          <div
            style={{
              position: "absolute",
              top: "100px",
              bottom: 0,
              left: "4vw",
              width: "min(36vw, 520px)",
              display: "flex",
              alignItems: "center",
            }}
          >
            <div className="w-full">
              <div
                className="font-display text-xs md:text-sm tracking-[0.35em] uppercase text-white/50 mb-4"
                style={{ textShadow: "0 2px 12px rgba(0,0,0,0.6)" }}
              >
                ALASKA LABS
              </div>
              <div className="h-px w-10 bg-white/40 mb-7" />
              <h2
                className="text-4xl md:text-6xl lg:text-7xl xl:text-[7rem] font-display font-black uppercase text-white leading-[0.85] tracking-tight"
                style={{ textShadow: "0 2px 24px rgba(0,0,0,0.55)" }}
              >
                {["THE GOLD", "STANDARD", "IN PURITY"].map((line, li) => (
                  <span key={li} className="block whitespace-nowrap">
                    <FlipText
                      text={line}
                      trigger={loaded && inView}
                      delay={li * 260}
                      stagger={28}
                      cycles={4}
                    />
                  </span>
                ))}
              </h2>
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
      </div>
    </div>
  );
}
