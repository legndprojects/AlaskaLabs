"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";

const TOTAL_FRAMES = 192;
/* Lock to a fixed reference size so frames with slightly different
   dimensions don't cause visible jumps during playback */
const REF_WIDTH = 3840;
const REF_HEIGHT = 2160;

function frameSrc(i: number) {
  const n = String(i).padStart(3, "0");
  return `/images/sequence/ezgif-frame-${n}.jpg`;
}

export default function HeroCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [loaded, setLoaded] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  /* fade out canvas when the sequence container is scrolled past */
  const canvasOpacity = useTransform(scrollYProgress, [0.92, 1], [1, 0]);

  /* map scroll to frame index (only first ~95% of container plays frames) */
  const frameIndex = useTransform(scrollYProgress, [0, 0.95], [0, TOTAL_FRAMES - 1]);

  /* preload all frames */
  useEffect(() => {
    let mounted = true;
    const imgs: HTMLImageElement[] = [];
    let count = 0;

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = frameSrc(i);
      img.onload = () => {
        count++;
        if (count === TOTAL_FRAMES && mounted) setLoaded(true);
      };
      imgs.push(img);
    }

    imagesRef.current = imgs;
    return () => {
      mounted = false;
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

  /* react to scroll */
  useMotionValueEvent(frameIndex, "change", (v) => {
    if (loaded) draw(Math.round(v));
  });

  /* draw first frame once loaded */
  useEffect(() => {
    if (loaded) draw(0);
  }, [loaded, draw]);

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
    <div ref={containerRef} className="relative" style={{ height: "1400vh" }}>
      <motion.div style={{ opacity: canvasOpacity }} className="fixed inset-0 w-screen h-screen" >
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ zIndex: 1 }}
        />
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
