"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useInView } from "framer-motion";

const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWER = "abcdefghijklmnopqrstuvwxyz";
const DIGITS = "0123456789";
const ALL_CHARS = UPPER + LOWER + DIGITS;

// Characters that don't flip — they just appear
const PASSTHROUGH = new Set(" .,;:!?'-—/()%<>≥≤=\"&+");

function randomChar(target: string): string {
  if (/[A-Z]/.test(target)) return UPPER[Math.floor(Math.random() * UPPER.length)];
  if (/[a-z]/.test(target)) return LOWER[Math.floor(Math.random() * LOWER.length)];
  if (/[0-9]/.test(target)) return DIGITS[Math.floor(Math.random() * DIGITS.length)];
  return ALL_CHARS[Math.floor(Math.random() * ALL_CHARS.length)];
}

interface FlipTextProps {
  text: string;
  className?: string;
  delay?: number;
  /** ms between character flips — lower = faster cascade */
  stagger?: number;
  /** ms between random char swaps */
  cycleSpeed?: number;
  /** number of random chars before settling */
  cycles?: number;
  /** if provided, animation starts when this becomes true (bypasses in-view detection) */
  trigger?: boolean;
}

export default function FlipText({
  text,
  className = "",
  delay = 0,
  stagger = 40,
  cycleSpeed = 30,
  cycles = 4,
  trigger,
}: FlipTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [displayed, setDisplayed] = useState<string[]>(() =>
    text.split("").map((ch) => (PASSTHROUGH.has(ch) ? ch : "\u00A0"))
  );
  const [settled, setSettled] = useState<boolean[]>(() =>
    text.split("").map((ch) => PASSTHROUGH.has(ch))
  );
  const hasStarted = useRef(false);

  const animate = useCallback(() => {
    const chars = text.split("");
    const cycleCount = new Array(chars.length).fill(0);
    const isSettled = chars.map((ch) => PASSTHROUGH.has(ch));
    const current = chars.map((ch) => (PASSTHROUGH.has(ch) ? ch : "\u00A0"));

    chars.forEach((targetChar, i) => {
      if (PASSTHROUGH.has(targetChar)) return;

      const charDelay = delay + i * stagger;

      setTimeout(() => {
        const interval = setInterval(() => {
          cycleCount[i]++;

          if (cycleCount[i] >= cycles) {
            current[i] = targetChar;
            isSettled[i] = true;
            clearInterval(interval);
          } else {
            current[i] = randomChar(targetChar);
          }

          setDisplayed([...current]);
          setSettled([...isSettled]);
        }, cycleSpeed);
      }, charDelay);
    });
  }, [text, delay, stagger, cycleSpeed, cycles]);

  useEffect(() => {
    const active = trigger !== undefined ? trigger : isInView;
    if (active && !hasStarted.current) {
      hasStarted.current = true;
      animate();
    }
  }, [isInView, trigger, animate]);

  return (
    <span ref={ref} className={className} aria-label={text}>
      {displayed.map((char, i) => (
        <span
          key={i}
          className={
            settled[i] ? "opacity-100" : "opacity-60"
          }
          style={{
            textShadow: !settled[i]
              ? "0 0 8px rgba(0,114,188,0.3)"
              : "none",
            transition: "opacity 0.15s, text-shadow 0.15s",
          }}
        >
          {char}
        </span>
      ))}
    </span>
  );
}
