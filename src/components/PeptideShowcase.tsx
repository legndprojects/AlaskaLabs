"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { findByHandle } from "@/data/catalog";
import { useCart } from "@/lib/cart-context";

type Theme = {
  start: string;
  mid: string;
  end: string;
  halo: string;
  accent: string;
  stageA: string;
  stageB: string;
};

type SlideMeta = {
  handle: string;
  name: string;
  subtitle: string;
  description?: string;
  shortDesc: string;
  stampL: string;
  stampR: string;
  theme: Theme;
};

type Peptide = {
  handle: string;
  name: string;
  subtitle: string;
  description: string;
  shortDesc: string;
  price: string;
  thumbnail: string;
  stampL: string;
  stampR: string;
  theme: Theme;
};

const THEMES: Record<string, Theme> = {
  royal: {
    start: "#0a1f4a",
    mid: "#1e3a8a",
    end: "#0f1e3d",
    halo: "rgba(147, 197, 253, 0.55)",
    accent: "#93c5fd",
    stageA: "rgba(59, 130, 246, 0.36)",
    stageB: "rgba(10, 31, 74, 0.42)",
  },
  indigo: {
    start: "#0c1445",
    mid: "#1e40af",
    end: "#091033",
    halo: "rgba(129, 140, 248, 0.55)",
    accent: "#a5b4fc",
    stageA: "rgba(79, 70, 229, 0.34)",
    stageB: "rgba(12, 20, 69, 0.42)",
  },
  sky: {
    start: "#1e3a5f",
    mid: "#3b82f6",
    end: "#172b48",
    halo: "rgba(191, 219, 254, 0.55)",
    accent: "#bfdbfe",
    stageA: "rgba(96, 165, 250, 0.34)",
    stageB: "rgba(23, 43, 72, 0.42)",
  },
  teal: {
    start: "#0b3a5a",
    mid: "#0e7490",
    end: "#082f46",
    halo: "rgba(125, 211, 252, 0.55)",
    accent: "#7dd3fc",
    stageA: "rgba(56, 182, 255, 0.34)",
    stageB: "rgba(8, 47, 73, 0.42)",
  },
  cobalt: {
    start: "#0d2b5c",
    mid: "#2563eb",
    end: "#0a1f45",
    halo: "rgba(147, 197, 253, 0.55)",
    accent: "#60a5fa",
    stageA: "rgba(37, 99, 235, 0.34)",
    stageB: "rgba(13, 43, 92, 0.42)",
  },
  violet: {
    start: "#1e1b4b",
    mid: "#4338ca",
    end: "#151540",
    halo: "rgba(165, 180, 252, 0.55)",
    accent: "#a5b4fc",
    stageA: "rgba(99, 102, 241, 0.34)",
    stageB: "rgba(21, 21, 64, 0.42)",
  },
  cyan: {
    start: "#164e63",
    mid: "#0891b2",
    end: "#0e3a4a",
    halo: "rgba(165, 243, 252, 0.55)",
    accent: "#67e8f9",
    stageA: "rgba(34, 211, 238, 0.32)",
    stageB: "rgba(14, 58, 74, 0.42)",
  },
  ocean: {
    start: "#0c4a6e",
    mid: "#0284c7",
    end: "#0a3856",
    halo: "rgba(186, 230, 253, 0.55)",
    accent: "#7dd3fc",
    stageA: "rgba(14, 165, 233, 0.34)",
    stageB: "rgba(10, 56, 86, 0.42)",
  },
};

const SLIDE_META: SlideMeta[] = [
  {
    handle: "retatrutide-10mg",
    name: "RETATRUTIDE",
    subtitle: "TRIPLE AGONIST · GLP-1 / GIP / GCG",
    shortDesc: "GLP-1 / GIP / Glucagon receptor agonist",
    description:
      "A unimolecular triple agonist with concurrent activity at GLP-1, GIP, and glucagon receptors. Studied in published trials for dose-dependent shifts in body weight and energy expenditure.",
    stampL: "RETA",
    stampR: "10MG",
    theme: THEMES.royal,
  },
  {
    handle: "retatrutide-20mg",
    name: "RETATRUTIDE",
    subtitle: "TRIPLE AGONIST · HIGH-STRENGTH",
    shortDesc: "High-strength triple receptor agonist",
    description:
      "High-strength presentation of the GLP-1 / GIP / glucagon triple agonist for extended research protocols. Lyophilized powder for in-vitro reconstitution.",
    stampL: "RETA",
    stampR: "20MG",
    theme: THEMES.indigo,
  },
  {
    handle: "glow-70mg",
    name: "GLOW",
    subtitle: "BPC-157 · TB-500 · GHK-CU BLEND",
    shortDesc: "BPC-157 + TB-500 + GHK-Cu tri-blend",
    description:
      "A tri-peptide research blend of BPC-157, TB-500, and GHK-Cu — three compounds widely referenced in cytoprotective, actin-dynamics, and matrix-remodeling literature.",
    stampL: "GLOW",
    stampR: "70MG",
    theme: THEMES.sky,
  },
  {
    handle: "klow-80mg",
    name: "KLOW",
    subtitle: "BPC · TB-500 · GHK-CU · KPV",
    shortDesc: "BPC-157 + TB-500 + GHK-Cu + KPV quad-blend",
    description:
      "Four-peptide blend pairing the regenerative profile of BPC-157, TB-500, and GHK-Cu with KPV — the C-terminal tripeptide of α-MSH studied for anti-inflammatory signaling.",
    stampL: "KLOW",
    stampR: "80MG",
    theme: THEMES.cobalt,
  },
  {
    handle: "tesamorelin-10mg",
    name: "TESAMORELIN",
    subtitle: "STABILIZED GHRH(1–44) ANALOG",
    shortDesc: "Stabilized GHRH(1-44) analog",
    description:
      "A stabilized GHRH(1–44) analog binding the pituitary GHRH receptor to modulate pulsatile growth hormone release. Referenced in randomized trials on visceral adipose dynamics.",
    stampL: "TESA",
    stampR: "GHRH",
    theme: THEMES.teal,
  },
  {
    handle: "bpc-157-10mg",
    name: "BPC-157",
    subtitle: "BODY PROTECTION COMPOUND",
    shortDesc: "15-amino-acid gastric-derived peptide",
    description:
      "A 15-amino-acid partial sequence derived from human gastric juice body protection compound. Reviewed in preclinical literature for cytoprotective and angiogenic pathways.",
    stampL: "BPC",
    stampR: "157",
    theme: THEMES.ocean,
  },
  {
    handle: "mots-c-10mg",
    name: "MOTS-C",
    subtitle: "MITOCHONDRIAL-DERIVED PEPTIDE",
    shortDesc: "16-amino-acid mitochondrial peptide",
    description:
      "A 16-amino-acid peptide encoded within the mitochondrial 12S rRNA. Studied as a mitochondrial-derived peptide acting on AMPK signaling and glucose homeostasis.",
    stampL: "MOTS",
    stampR: "MTDP",
    theme: THEMES.cyan,
  },
  {
    handle: "slu-pp-332-5mg",
    name: "SLU-PP-332",
    subtitle: "ERR PAN-AGONIST · EXERCISE MIMETIC",
    shortDesc: "ERRα/β/γ pan-agonist compound",
    description:
      "A pan-agonist of the estrogen-related receptors (ERRα/β/γ). Characterized in murine models as an exercise-mimetic compound altering oxidative muscle composition and endurance.",
    stampL: "SLU",
    stampR: "332",
    theme: THEMES.violet,
  },
  {
    handle: "ipamorelin-10mg",
    name: "IPAMORELIN",
    subtitle: "SELECTIVE GH SECRETAGOGUE",
    shortDesc: "Pentapeptide GHS-R1a agonist",
    description:
      "A pentapeptide ghrelin-receptor agonist (GHS-R1a) developed as a selective GH secretagogue. Reported with limited effect on ACTH, cortisol, and prolactin in study cohorts.",
    stampL: "IPA",
    stampR: "MOR",
    theme: THEMES.sky,
  },
  {
    handle: "cjc-1295-10mg",
    name: "CJC-1295",
    subtitle: "GHRH ANALOG · LONG-ACTING",
    shortDesc: "Modified GHRH(1-29) analog",
    description:
      "A synthetic GHRH analog with substitutions enhancing metabolic stability versus native GHRH(1–29). Referenced for pulsatile somatotroph stimulation and IGF-1 dynamics.",
    stampL: "CJC",
    stampR: "1295",
    theme: THEMES.indigo,
  },
  {
    handle: "ghk-cu-100mg",
    name: "GHK-CU",
    subtitle: "COPPER TRIPEPTIDE",
    shortDesc: "Gly-His-Lys copper-bound tripeptide",
    description:
      "A copper-bound tripeptide (Gly-His-Lys) endogenously present in plasma. Reviewed extensively for matrix metalloproteinase regulation and antioxidant signaling pathways.",
    stampL: "GHK",
    stampR: "CU29",
    theme: THEMES.ocean,
  },
  {
    handle: "tb-500-10mg",
    name: "TB-500",
    subtitle: "THYMOSIN BETA-4 · REGENERATIVE",
    shortDesc: "Thymosin β4 active fragment",
    description:
      "An active fragment of Thymosin β4, the primary actin-sequestering peptide in mammalian cells. Documented in cell migration, angiogenesis, and tissue-remodeling research.",
    stampL: "TB4",
    stampR: "500",
    theme: THEMES.cobalt,
  },
  {
    handle: "bpc-157-tb-500-blend-20mg",
    name: "BPC-157 + TB-500",
    subtitle: "1:1 REPAIR BLEND",
    shortDesc: "BPC-157 + TB-500 1:1 lyophilized blend",
    description:
      "A 1:1 research blend pairing BPC-157's angiogenic and cytoprotective profile with TB-500's actin-dynamics and tissue-remodeling activity. Lyophilized for reconstitution.",
    stampL: "BPC",
    stampR: "TB500",
    theme: THEMES.teal,
  },
  {
    handle: "semax-10mg",
    name: "SEMAX",
    subtitle: "NOOTROPIC · ACTH(4–10) ANALOG",
    shortDesc: "Synthetic ACTH(4-10) heptapeptide",
    description:
      "A synthetic heptapeptide modeled after an ACTH fragment, characterized in published research for effects on BDNF and NGF expression and on attention, working memory, and cortical neuroplasticity in animal models.",
    stampL: "SEMA",
    stampR: "ACTH",
    theme: THEMES.violet,
  },
  {
    handle: "selank-10mg",
    name: "SELANK",
    subtitle: "NOOTROPIC · TUFTSIN ANALOG",
    shortDesc: "Stabilized tuftsin analog heptapeptide",
    description:
      "A synthetic tuftsin analog studied for anxiolytic-like activity, GABAergic modulation, and effects on enkephalin and monoamine pathways in rodent behavioral models. Stabilized with a Pro-Gly-Pro tail.",
    stampL: "SLK",
    stampR: "TUFT",
    theme: THEMES.cyan,
  },
  {
    handle: "melanotan-ii-10mg",
    name: "MELANOTAN II",
    subtitle: "α-MSH · MELANOCORTIN AGONIST",
    shortDesc: "Cyclic α-MSH analog · MC1R–MC5R",
    description:
      "A cyclic α-MSH analog and non-selective agonist at MC1R–MC5R. Referenced in early-phase literature for melanogenesis via MC1R and centrally mediated endpoints through MC3 and MC4 receptors.",
    stampL: "MT2",
    stampR: "α-MSH",
    theme: THEMES.sky,
  },
];

const peptides: Peptide[] = SLIDE_META.map((meta) => {
  const cat = findByHandle(meta.handle);
  return {
    handle: meta.handle,
    name: meta.name,
    subtitle: meta.subtitle,
    description: meta.description ?? cat?.description ?? "",
    shortDesc: meta.shortDesc,
    price: cat ? `$${cat.price.toFixed(2)}` : "",
    thumbnail: cat?.thumbnail ?? "",
    stampL: meta.stampL,
    stampR: meta.stampR,
    theme: meta.theme,
  };
});


export default function PeptideShowcase() {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const [addingHandle, setAddingHandle] = useState<string | null>(null);
  const [addedHandle, setAddedHandle] = useState<string | null>(null);
  const { addItem, openDrawer } = useCart();
  const bgShake = useAnimation();
  const p = peptides[idx];

  /* Broadcast current theme so Navbar menu can match */
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("peptide-theme", { detail: { start: p.theme.start, mid: p.theme.mid, end: p.theme.end } }));
  }, [p.theme]);

  const go = (delta: 1 | -1) => {
    setDir(delta);
    setIdx((i) => (i + delta + peptides.length) % peptides.length);
    // Subtle background shake — shifts opposite to swipe direction then settles
    bgShake.start({
      x: [0, delta * -4, 0],
      scale: [1, 0.992, 1],
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    });
    window.dispatchEvent(new CustomEvent("peptide-nav", { detail: { dir: delta } }));
  };

  const onAddToCart = async () => {
    if (addingHandle) return;
    setAddingHandle(p.handle);
    try {
      await addItem(p.handle, 1);
      openDrawer();
      setAddedHandle(p.handle);
      setTimeout(() => setAddedHandle(null), 1400);
    } finally {
      setAddingHandle(null);
    }
  };

  return (
    <section data-dark-section className="relative bg-black pt-2 pb-2 px-2 md:p-3 flex items-center justify-center overflow-hidden min-h-svh md:h-svh md:flex-col">
      {/* Primary ambient glow — wide horizontal spread (desktop only) */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block"
        style={{
          width: "200vw",
          height: "160%",
          background: `radial-gradient(ellipse 60% 50% at 50% 50%, ${p.theme.mid}88 0%, ${p.theme.mid}55 20%, ${p.theme.mid}22 45%, transparent 70%)`,
          opacity: 1,
          filter: "blur(30px)",
          transition: "background 400ms ease",
        }}
      />

      {/* Bottom bleed — dark wash below (desktop only) */}
      <div
        className="pointer-events-none absolute hidden md:block"
        style={{
          bottom: "-200px",
          left: "-20vw",
          right: "-20vw",
          height: "500px",
          background: `radial-gradient(ellipse 70% 80% at 50% 0%, ${p.theme.mid}66 0%, ${p.theme.mid}33 25%, ${p.theme.mid}15 50%, transparent 75%)`,
          opacity: 1,
          filter: "blur(30px)",
          transition: "background 400ms ease",
        }}
      />

      {/* Top bleed — dark wash above (desktop only) */}
      <div
        className="pointer-events-none absolute hidden md:block"
        style={{
          top: "-150px",
          left: "-10vw",
          right: "-10vw",
          height: "350px",
          background: `radial-gradient(ellipse 70% 80% at 50% 100%, ${p.theme.mid}66 0%, ${p.theme.mid}28 40%, transparent 70%)`,
          opacity: 1,
          filter: "blur(30px)",
          transition: "background 400ms ease",
        }}
      />

      <motion.div
        animate={bgShake}
        className="relative w-full max-w-[1280px] md:max-w-none rounded-[16px] md:rounded-[24px] overflow-hidden min-h-[98svh] md:min-h-0 md:flex-1"
        style={{
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

        {/* top-left brand + top-right cart — desktop only, pushed below navbar */}
        <div className="absolute top-6 md:top-20 left-6 md:left-10 right-6 md:right-10 hidden md:flex items-start justify-between z-20">
          <div className="flex items-center gap-4">
            <img
              src="/images/alaska-logo.png"
              alt="AlaskaLabs"
              className="h-16 md:h-24 w-auto object-contain"
              draggable={false}
              style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.3))", marginTop: "-8px", marginBottom: "-16px" }}
            />
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

        {/* vertical side menu — desktop only */}
        <aside className="absolute left-6 md:left-10 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-3 z-20">
          {[
            { label: "About Us", href: "/about" },
            { label: "Contact Us", href: "/contact" },
            { label: "FAQ", href: "/faq" },
            { label: "Wholesale", href: "/wholesale" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="font-display text-[11px] tracking-[0.3em] uppercase text-white/45 hover:text-white transition-colors"
              style={{
                textShadow: "0 2px 10px rgba(0,0,0,0.3)",
              }}
            >
              {item.label}
            </a>
          ))}
        </aside>

        {/* Big background stamps */}
        <span
          className="absolute top-[34%] left-[5%] md:left-[14%] select-none pointer-events-none font-display font-black uppercase leading-none"
          style={{
            fontSize: "clamp(60px, 11vw, 180px)",
            color: "rgba(255,255,255,0.08)",
            letterSpacing: "-0.02em",
          }}
        >
          {p.stampL}
        </span>
        <span
          className="absolute top-[34%] right-[5%] md:right-[14%] select-none pointer-events-none font-display font-black uppercase leading-none"
          style={{
            fontSize: "clamp(60px, 11vw, 180px)",
            color: "rgba(255,255,255,0.08)",
            letterSpacing: "-0.02em",
          }}
        >
          {p.stampR}
        </span>


        {/* Centered bottle + crossfade between slides */}
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          {/* Static glow underlay — wide elliptical soft blob behind the
              bottle, painted once and never re-rasterized. Replaces the
              drop-shadow filter that used to live on the animated <img>;
              that filter forced the browser to repaint a colored shadow
              for every frame of the rotation, which was the source of the
              softness. With the glow on a static sibling, the foreground
              bottle has no filter and stays perfectly crisp during the
              float animation. */}
          <div
            aria-hidden
            className="absolute pointer-events-none"
            style={{
              width: "min(560px, 70%)",
              height: "min(560px, 70%)",
              borderRadius: "50%",
              background: `radial-gradient(closest-side, ${p.theme.halo} 0%, ${p.theme.halo} 20%, transparent 72%)`,
              filter: "blur(40px)",
              transform: "translateZ(0)",
              transition: "background 300ms ease",
            }}
          />
          <AnimatePresence mode="wait" custom={dir}>
            <motion.img
              key={idx}
              src={p.thumbnail}
              alt={p.name}
              custom={dir}
              variants={{
                enter: (d: 1 | -1) => ({
                  opacity: 0,
                  x: d * 80,
                  rotate: 0,
                  scale: 0.94,
                }),
                center: {
                  opacity: 1,
                  x: 0,
                  rotate: [-1, 1, -1],
                  scale: [1, 1.008, 1],
                  transition: {
                    opacity: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
                    x: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
                    rotate: {
                      duration: 7,
                      ease: "easeInOut",
                      repeat: Infinity,
                      repeatType: "mirror",
                    },
                    scale: {
                      duration: 5.6,
                      ease: "easeInOut",
                      repeat: Infinity,
                      repeatType: "mirror",
                    },
                  },
                },
                exit: (d: 1 | -1) => ({
                  opacity: 0,
                  x: d * -80,
                  rotate: 0,
                  scale: 0.94,
                }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="max-h-[55%] md:max-h-[78%] w-auto object-contain pointer-events-auto cursor-grab active:cursor-grabbing select-none touch-none relative"
              style={{
                /* no filter on the animated image — the colored glow lives
                   on the static sibling above so this layer can rotate and
                   scale without re-rasterizing a shadow each frame. */
                willChange: "transform",
                backfaceVisibility: "hidden",
              }}
              draggable={false}
              drag
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
              dragElastic={0.5}
              dragMomentum={false}
              dragTransition={{
                bounceStiffness: 320,
                bounceDamping: 18,
              }}
              onDragEnd={(_, info) => {
                /* swipe to next/previous when released after a
                   meaningful horizontal drag or a quick flick. */
                const SWIPE_DIST = 80;
                const SWIPE_VELOCITY = 450;
                const { offset, velocity } = info;
                if (offset.x < -SWIPE_DIST || velocity.x < -SWIPE_VELOCITY) {
                  go(1);
                } else if (offset.x > SWIPE_DIST || velocity.x > SWIPE_VELOCITY) {
                  go(-1);
                }
              }}
              whileTap={{ scale: 0.98 }}
            />
          </AnimatePresence>
        </div>

        {/* Bottom copy */}
        <div className="absolute bottom-24 md:bottom-14 left-5 md:left-12 right-5 md:right-auto max-w-none md:max-w-[420px] z-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Mobile layout */}
              <div className="md:hidden">
                <div
                  className="font-display text-[10px] tracking-[0.3em] uppercase mb-2"
                  style={{ color: p.theme.accent }}
                >
                  {p.subtitle}
                </div>
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <h2
                      className="font-display font-black uppercase text-white leading-[0.85] text-4xl"
                      style={{ textShadow: "0 4px 24px rgba(0,0,0,0.4)" }}
                    >
                      {p.name}
                    </h2>
                    <p className="text-white/45 text-[11px] mt-1.5 font-display tracking-wide">
                      {p.shortDesc}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <strong className="font-display text-3xl text-white" style={{ textShadow: "0 4px 24px rgba(0,0,0,0.4)" }}>
                      {p.price}
                    </strong>
                    <button
                      type="button"
                      onClick={onAddToCart}
                      disabled={!!addingHandle}
                      className="px-5 py-2.5 rounded-full bg-white/95 text-[#0b1a3a] text-[11px] font-display tracking-[0.2em] uppercase font-semibold shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] active:scale-[0.97] disabled:opacity-60"
                    >
                      {addingHandle === p.handle ? "Adding…" : addedHandle === p.handle ? "Added ✓" : "Add to Cart"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Desktop layout: unchanged */}
              <div className="hidden md:block">
                <div
                  className="font-display text-xs tracking-[0.3em] uppercase mb-3"
                  style={{ color: p.theme.accent }}
                >
                  {p.subtitle}
                </div>
                <h2
                  className="font-display font-black uppercase text-white leading-[0.85] mb-4 text-[clamp(40px,5.5vw,88px)]"
                  style={{
                    textShadow: "0 4px 24px rgba(0,0,0,0.4)",
                  }}
                >
                  {p.name}
                </h2>
                <p
                  className="text-white/75 italic text-[14px] leading-[1.7] max-w-sm"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {p.description}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom-right: add-to-cart + price — desktop only */}
        <div className="absolute bottom-10 md:bottom-14 right-6 md:right-12 z-20 hidden md:flex items-end gap-4 md:gap-5">
          <button
            type="button"
            onClick={onAddToCart}
            disabled={!!addingHandle}
            className="group/cart relative overflow-hidden px-5 md:px-6 py-3 md:py-3.5 rounded-full bg-white/95 text-[#0b1a3a] text-[11px] md:text-xs font-display tracking-[0.25em] uppercase font-semibold backdrop-blur-sm shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] ring-1 ring-white/60 transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-white hover:ring-white active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {/* expanding ink fill: a circle that scales from the bottom up
                on hover, replacing the white background with the slide's
                deep theme color while the text flips to white. */}
            <span
              aria-hidden
              className="pointer-events-none absolute left-1/2 bottom-0 -translate-x-1/2 w-[140%] aspect-square rounded-full origin-bottom scale-y-0 group-hover/cart:scale-y-100 transition-transform duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ backgroundColor: p.theme.end }}
            />
            <span className="relative">
              {addingHandle === p.handle
                ? "Adding…"
                : addedHandle === p.handle
                ? "Added ✓"
                : "Add to Cart"}
            </span>
          </button>
          <div className="text-right">
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
        </div>

        {/* Nav controls — sides on mobile, bottom center on desktop */}
        {/* Mobile: left arrow */}
        <button
          type="button"
          onClick={() => go(-1)}
          className="md:hidden absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full border border-white/25 backdrop-blur-sm bg-white/5 text-white flex items-center justify-center active:scale-90"
          aria-label="Previous peptide"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-[1.5]" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.4 5.2L8.2 12l6.2 6.8" />
          </svg>
        </button>
        {/* Mobile: right arrow */}
        <button
          type="button"
          onClick={() => go(1)}
          className="md:hidden absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full border border-white/25 backdrop-blur-sm bg-white/5 text-white flex items-center justify-center active:scale-90"
          aria-label="Next peptide"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-[1.5]" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9.6 5.2L15.8 12 9.6 18.8" />
          </svg>
        </button>
        {/* Mobile: slide counter */}
        <div className="md:hidden absolute bottom-4 left-1/2 -translate-x-1/2 z-20 font-display text-xs tracking-[0.3em] text-white/70 tabular-nums">
          {String(idx + 1).padStart(2, "0")}{" / "}{String(peptides.length).padStart(2, "0")}
        </div>

        {/* Desktop: bottom center nav */}
        <nav className="absolute bottom-14 left-1/2 -translate-x-1/2 hidden md:flex items-center gap-3 z-20">
          <button
            type="button"
            onClick={() => go(-1)}
            className="group w-14 h-14 rounded-full border border-white/25 backdrop-blur-sm bg-white/5 text-white flex items-center justify-center transition-all hover:border-white/60 hover:bg-white/10 hover:scale-105 active:scale-95"
            aria-label="Previous peptide"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-[1.5]" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.4 5.2L8.2 12l6.2 6.8" />
            </svg>
          </button>
          <div className="font-display text-xs tracking-[0.3em] text-white/70 px-2 tabular-nums">
            {String(idx + 1).padStart(2, "0")}{" / "}{String(peptides.length).padStart(2, "0")}
          </div>
          <button
            type="button"
            onClick={() => go(1)}
            className="group w-14 h-14 rounded-full border border-white/25 backdrop-blur-sm bg-white/5 text-white flex items-center justify-center transition-all hover:border-white/60 hover:bg-white/10 hover:scale-105 active:scale-95"
            aria-label="Next peptide"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-[1.5]" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9.6 5.2L15.8 12 9.6 18.8" />
            </svg>
          </button>
        </nav>

        {/* Corner serial numbers — desktop only */}
        <span className="absolute top-6 md:top-16 left-1/2 -translate-x-1/2 font-display text-[11px] tracking-[0.3em] text-white/50 uppercase hidden md:block">
          {String(idx + 1).padStart(3, "0")}
        </span>
      </motion.div>
    </section>
  );
}
