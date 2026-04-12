"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { product } from "@/data/product";

type Theme = {
  start: string;
  mid: string;
  end: string;
  halo: string;
  accent: string;
  stageA: string;
  stageB: string;
};

type Peptide = {
  name: string;
  subtitle: string;
  description: string;
  price: string;
  stampL: string;
  stampR: string;
  theme: Theme;
};

const peptides: Peptide[] = [
  {
    name: "RETATRUTIDE",
    subtitle: "TRIPLE AGONIST \u00B7 GLP-1 / GIP / GCG",
    description:
      "A next-generation triple-receptor agonist in clinical research for metabolic regulation. Targets GLP-1, GIP, and glucagon pathways simultaneously for amplified effect on body composition.",
    price: "$149.00",
    stampL: "RETA",
    stampR: "LY3",
    theme: {
      start: "#0a1f4a",
      mid: "#1e3a8a",
      end: "#0f1e3d",
      halo: "rgba(147, 197, 253, 0.55)",
      accent: "#93c5fd",
      stageA: "rgba(59, 130, 246, 0.36)",
      stageB: "rgba(10, 31, 74, 0.42)",
    },
  },
  {
    name: "TIRZEPATIDE",
    subtitle: "DUAL AGONIST \u00B7 GLP-1 / GIP",
    description:
      "A dual glucose-dependent insulinotropic polypeptide and GLP-1 receptor agonist studied extensively for metabolic regulation, glycemic control, and weight management.",
    price: "$129.00",
    stampL: "TZP",
    stampR: "LY",
    theme: {
      start: "#0c1445",
      mid: "#1e40af",
      end: "#091033",
      halo: "rgba(129, 140, 248, 0.55)",
      accent: "#a5b4fc",
      stageA: "rgba(79, 70, 229, 0.34)",
      stageB: "rgba(12, 20, 69, 0.42)",
    },
  },
  {
    name: "SEMAGLUTIDE",
    subtitle: "GLP-1 RECEPTOR AGONIST",
    description:
      "A long-acting GLP-1 analogue investigated for its role in appetite regulation, glucose control, and metabolic health. Administered via weekly subcutaneous injection in research protocols.",
    price: "$109.00",
    stampL: "SEMA",
    stampR: "GLP",
    theme: {
      start: "#1e3a5f",
      mid: "#3b82f6",
      end: "#172b48",
      halo: "rgba(191, 219, 254, 0.55)",
      accent: "#bfdbfe",
      stageA: "rgba(96, 165, 250, 0.34)",
      stageB: "rgba(23, 43, 72, 0.42)",
    },
  },
  {
    name: "BPC-157",
    subtitle: "BODY PROTECTION COMPOUND",
    description:
      "A pentadecapeptide derived from a protein found in human gastric juice. Research suggests a role in wound healing, vascular function, and musculoskeletal recovery.",
    price: "$69.00",
    stampL: "BPC",
    stampR: "157",
    theme: {
      start: "#0b3a5a",
      mid: "#0e7490",
      end: "#082f46",
      halo: "rgba(125, 211, 252, 0.55)",
      accent: "#7dd3fc",
      stageA: "rgba(56, 182, 255, 0.34)",
      stageB: "rgba(8, 47, 73, 0.42)",
    },
  },
  {
    name: "TB-500",
    subtitle: "THYMOSIN BETA-4 \u00B7 REGENERATIVE",
    description:
      "A 17-amino-acid synthetic fragment of the naturally occurring Thymosin Beta-4 protein. Studied for its role in cellular migration, tissue repair, and recovery from injury.",
    price: "$89.00",
    stampL: "TB4",
    stampR: "500",
    theme: {
      start: "#0d2b5c",
      mid: "#2563eb",
      end: "#0a1f45",
      halo: "rgba(147, 197, 253, 0.55)",
      accent: "#60a5fa",
      stageA: "rgba(37, 99, 235, 0.34)",
      stageB: "rgba(13, 43, 92, 0.42)",
    },
  },
  {
    name: "CJC-1295",
    subtitle: "GHRH ANALOG \u00B7 LONG-ACTING",
    description:
      "A modified growth hormone-releasing hormone analog with an extended half-life. Research explores its effects on endogenous growth hormone secretion and IGF-1 levels.",
    price: "$79.00",
    stampL: "CJC",
    stampR: "1295",
    theme: {
      start: "#1e1b4b",
      mid: "#4338ca",
      end: "#151540",
      halo: "rgba(165, 180, 252, 0.55)",
      accent: "#a5b4fc",
      stageA: "rgba(99, 102, 241, 0.34)",
      stageB: "rgba(21, 21, 64, 0.42)",
    },
  },
  {
    name: "IPAMORELIN",
    subtitle: "SELECTIVE GH SECRETAGOGUE",
    description:
      "A pentapeptide ghrelin mimetic with selective growth hormone-releasing activity. Valued in research for its specificity and minimal impact on cortisol or prolactin.",
    price: "$75.00",
    stampL: "IPA",
    stampR: "MOR",
    theme: {
      start: "#164e63",
      mid: "#0891b2",
      end: "#0e3a4a",
      halo: "rgba(165, 243, 252, 0.55)",
      accent: "#67e8f9",
      stageA: "rgba(34, 211, 238, 0.32)",
      stageB: "rgba(14, 58, 74, 0.42)",
    },
  },
  {
    name: "GHK-Cu",
    subtitle: "COPPER TRIPEPTIDE",
    description:
      "A naturally occurring tripeptide with a high affinity for copper. Investigated for collagen synthesis, tissue remodeling, and skin regeneration.",
    price: "$79.00",
    stampL: "GHK",
    stampR: "Cu",
    theme: {
      start: "#0c4a6e",
      mid: "#0284c7",
      end: "#0a3856",
      halo: "rgba(186, 230, 253, 0.55)",
      accent: "#7dd3fc",
      stageA: "rgba(14, 165, 233, 0.34)",
      stageB: "rgba(10, 56, 86, 0.42)",
    },
  },
  {
    name: "EPITALON",
    subtitle: "PINEAL \u00B7 TELOMERE RESEARCH",
    description:
      "A synthetic tetrapeptide based on the natural pineal peptide Epithalamin. Studied for its influence on telomerase activity, circadian regulation, and cellular longevity.",
    price: "$99.00",
    stampL: "EPI",
    stampR: "T4",
    theme: {
      start: "#1e1e5c",
      mid: "#4c4dbf",
      end: "#14144a",
      halo: "rgba(196, 181, 253, 0.55)",
      accent: "#c4b5fd",
      stageA: "rgba(129, 140, 248, 0.34)",
      stageB: "rgba(20, 20, 74, 0.42)",
    },
  },
  {
    name: "PT-141",
    subtitle: "BREMELANOTIDE \u00B7 MELANOCORTIN",
    description:
      "A melanocortin receptor agonist derived from Melanotan II. Research focuses on its central nervous system effects, particularly on arousal and neurochemical pathways.",
    price: "$89.00",
    stampL: "PT",
    stampR: "141",
    theme: {
      start: "#0e3a4a",
      mid: "#0d9488",
      end: "#0a2d36",
      halo: "rgba(94, 234, 212, 0.55)",
      accent: "#5eead4",
      stageA: "rgba(20, 184, 166, 0.34)",
      stageB: "rgba(10, 45, 54, 0.42)",
    },
  },
];

export default function PeptideShowcase() {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const p = peptides[idx];

  const go = (delta: 1 | -1) => {
    setDir(delta);
    setIdx((i) => (i + delta + peptides.length) % peptides.length);
  };

  return (
    <section className="relative bg-white py-16 md:py-24 px-4 md:px-8 lg:px-16 flex items-center justify-center">
      {/* Color glow that spills onto the white background around the card */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: "1200px",
          height: "800px",
          background: `radial-gradient(ellipse at center, ${p.theme.mid}, transparent 70%)`,
          opacity: 0.5,
          filter: "blur(80px)",
          transition: "background 300ms ease, opacity 300ms ease",
        }}
      />

      <motion.div
        className="relative w-full max-w-[1280px] rounded-[36px] overflow-hidden"
        style={{
          aspectRatio: "16 / 10",
          background: `linear-gradient(145deg, ${p.theme.start} 0%, ${p.theme.mid} 50%, ${p.theme.end} 100%)`,
          boxShadow: `0 60px 120px -30px ${p.theme.halo}, 0 30px 60px -20px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -60px 120px rgba(0,0,0,0.35)`,
          transition:
            "background 300ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 300ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        {/* grain texture inside the card */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "3px 3px",
          }}
        />
        {/* inner radial glow behind bottle */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(60% 50% at 50% 55%, ${p.theme.halo}, transparent 70%)`,
            transition: "background 300ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        />

        {/* top-left brand + top-right cart */}
        <div className="absolute top-6 md:top-10 left-6 md:left-10 right-6 md:right-10 flex items-start justify-between z-20">
          <div className="flex items-center gap-3">
            <span
              className="font-display text-white text-lg md:text-xl tracking-[0.25em] uppercase"
              style={{ textShadow: "0 2px 12px rgba(0,0,0,0.35)" }}
            >
              AlaskaLabs
            </span>
            <span className="hidden md:inline-block h-px w-8 bg-white/40" />
            <span className="hidden md:inline text-white/60 text-[11px] tracking-[0.3em] uppercase font-display">
              Research Peptides
            </span>
          </div>

          <div className="flex items-center gap-4 text-white">
            <div className="flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase font-display">
              <span className="text-white/70">Cart</span>
              <em className="not-italic text-white/90">0</em>
            </div>
            <strong className="text-base md:text-lg font-display tracking-wider">
              {p.price}
            </strong>
          </div>
        </div>

        {/* vertical side menu */}
        <aside className="absolute left-6 md:left-10 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-20">
          {[
            { label: "Store" },
            { label: "Peptides", active: true },
            { label: "Labs" },
          ].map((item) => (
            <span
              key={item.label}
              className={`font-display text-[11px] tracking-[0.3em] uppercase ${
                item.active ? "text-white" : "text-white/45"
              }`}
              style={{
                textShadow: "0 2px 10px rgba(0,0,0,0.3)",
              }}
            >
              {item.label}
            </span>
          ))}
        </aside>

        {/* Big background stamps */}
        <span
          className="absolute top-[34%] left-[14%] select-none pointer-events-none font-display font-black uppercase leading-none"
          style={{
            fontSize: "clamp(60px, 11vw, 180px)",
            color: "rgba(255,255,255,0.08)",
            letterSpacing: "-0.02em",
          }}
        >
          {p.stampL}
        </span>
        <span
          className="absolute top-[34%] right-[14%] select-none pointer-events-none font-display font-black uppercase leading-none"
          style={{
            fontSize: "clamp(60px, 11vw, 180px)",
            color: "rgba(255,255,255,0.08)",
            letterSpacing: "-0.02em",
          }}
        >
          {p.stampR}
        </span>

        {/* Decorative plus marks */}
        <span
          className="absolute top-8 left-1/2 -translate-x-1/2 text-white/50 text-2xl z-10 font-display"
          aria-hidden
        >
          +
        </span>
        <span
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 text-2xl z-10 font-display"
          aria-hidden
        >
          +
        </span>

        {/* Centered bottle + crossfade between slides */}
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.img
              key={idx}
              src={product.assets.staticBottle}
              alt={p.name}
              custom={dir}
              initial={{ opacity: 0, x: dir * 80, scale: 0.94 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: dir * -80, scale: 0.94 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="max-h-[78%] w-auto object-contain"
              style={{
                filter: `drop-shadow(0 40px 80px ${p.theme.halo}) drop-shadow(0 0 30px ${p.theme.halo})`,
              }}
              draggable={false}
            />
          </AnimatePresence>
        </div>

        {/* Bottom-left copy */}
        <div className="absolute bottom-10 md:bottom-14 left-6 md:left-12 max-w-[420px] z-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
            >
              <div
                className="font-display text-[11px] md:text-xs tracking-[0.3em] uppercase mb-3"
                style={{ color: p.theme.accent }}
              >
                {p.subtitle}
              </div>
              <h2
                className="font-display font-black uppercase text-white leading-[0.85] mb-4"
                style={{
                  fontSize: "clamp(40px, 5.5vw, 88px)",
                  textShadow: "0 4px 24px rgba(0,0,0,0.4)",
                }}
              >
                {p.name}
              </h2>
              <p
                className="text-white/75 italic text-[13px] md:text-[14px] leading-[1.7] max-w-sm"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {p.description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom-right: more info + price */}
        <div className="absolute bottom-10 md:bottom-14 right-6 md:right-12 text-right z-20">
          <div className="font-display text-[11px] tracking-[0.3em] uppercase text-white/60 mb-2">
            More info
          </div>
          <strong
            className="font-display text-3xl md:text-5xl text-white"
            style={{ textShadow: "0 4px 24px rgba(0,0,0,0.4)" }}
          >
            {p.price}
          </strong>
        </div>

        {/* Nav controls */}
        <nav className="absolute bottom-10 md:bottom-14 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
          <button
            type="button"
            onClick={() => go(-1)}
            className="group w-12 h-12 md:w-14 md:h-14 rounded-full border border-white/25 backdrop-blur-sm bg-white/5 text-white flex items-center justify-center transition-all hover:border-white/60 hover:bg-white/10 hover:scale-105 active:scale-95"
            aria-label="Previous peptide"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 fill-none stroke-current stroke-[1.5]"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14.4 5.2L8.2 12l6.2 6.8" />
            </svg>
          </button>
          <div className="font-display text-xs tracking-[0.3em] text-white/70 px-2 tabular-nums">
            {String(idx + 1).padStart(2, "0")}{" / "}{String(peptides.length).padStart(2, "0")}
          </div>
          <button
            type="button"
            onClick={() => go(1)}
            className="group w-12 h-12 md:w-14 md:h-14 rounded-full border border-white/25 backdrop-blur-sm bg-white/5 text-white flex items-center justify-center transition-all hover:border-white/60 hover:bg-white/10 hover:scale-105 active:scale-95"
            aria-label="Next peptide"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 fill-none stroke-current stroke-[1.5]"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9.6 5.2L15.8 12 9.6 18.8" />
            </svg>
          </button>
        </nav>

        {/* Corner serial numbers (homage to helmetz "130" / "147") */}
        <span className="absolute top-6 md:top-10 left-1/2 -translate-x-1/2 font-display text-[11px] tracking-[0.3em] text-white/50 uppercase">
          {String(idx + 1).padStart(3, "0")}
        </span>
      </motion.div>
    </section>
  );
}
