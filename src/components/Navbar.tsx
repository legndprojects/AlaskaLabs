"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { useCart } from "@/lib/cart-context";
import { catalog, type CatalogProduct } from "@/data/catalog";

const NAV_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
  { label: "FAQs", href: "/faq" },
  { label: "Wholesale", href: "/wholesale" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { itemCount, openDrawer } = useCart();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const formRef = useRef<HTMLFormElement>(null);

  /* Sync shake with PeptideShowcase nav */
  const navShake = useAnimation();
  useEffect(() => {
    if (pathname !== "/") return;
    const handler = (e: Event) => {
      const dir = (e as CustomEvent).detail?.dir as number;
      navShake.start({
        x: [0, dir * -8, 0],
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
      });
    };
    window.addEventListener("peptide-nav", handler);
    return () => window.removeEventListener("peptide-nav", handler);
  }, [pathname, navShake]);

  /* live suggestions: prioritize by *product name* prefix match — that is
     what the user types when looking for a specific peptide. blends like
     GLOW / KLOW used to surface for "bp" or "tb" because their tags
     contain BPC-157 / TB-500; tags are no longer used for prefix
     matching. ranking:
       1. name/handle starts with q (highest)
       2. any name word starts with q
       3. name/handle contains q as a substring
     tags are only consulted as a last-resort substring fallback when
     nothing else matches, and only when q is at least 3 chars to avoid
     short queries (like "bp") pulling in blends. */
  const suggestions = useMemo<CatalogProduct[]>(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 1) return [];

    const scored = catalog
      .map((p) => {
        const name = p.name.toLowerCase();
        const handle = p.handle.toLowerCase();
        const handleWords = handle.replace(/-/g, " ");
        const nameWords = name.split(/\s+/);
        const tagsHay = [p.category, ...p.tags].join(" ").toLowerCase();

        let score = 0;
        if (name.startsWith(q) || handle.startsWith(q) || handleWords.startsWith(q)) {
          /* whole name/handle starts with the query — strongest hit */
          score = 100;
        } else if (nameWords.some((w) => w.startsWith(q))) {
          /* any word inside the name starts with the query */
          score = 80;
        } else if (name.includes(q) || handle.includes(q)) {
          /* name/handle contains the query as a substring */
          score = 60;
        } else if (tagsHay.includes(q)) {
          /* fallback: a tag or category contains the query — these are
             the secondary matches (e.g. GLOW / KLOW for "bp") and rank
             below all direct name matches so they always appear last. */
          score = 30;
        }
        return { p, score };
      })
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((s) => s.p);

    return scored.slice(0, 8);
  }, [query]);

  /* close the dropdown on outside click */
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (!formRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  const go = (handle: string) => {
    setOpen(false);
    setQuery("");
    router.push(`/shop/${handle}`);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    /* if a suggestion is highlighted, go to it; otherwise run a search */
    if (activeIdx >= 0 && suggestions[activeIdx]) {
      go(suggestions[activeIdx].handle);
      return;
    }
    const q = query.trim();
    if (!q) return;
    setOpen(false);
    router.push(`/shop?q=${encodeURIComponent(q)}`);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!suggestions.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => (i + 1) % suggestions.length);
      setOpen(true);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
      setOpen(true);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <motion.nav animate={navShake} className={`fixed top-0 left-0 right-0 z-50 ${
      pathname === "/"
        ? "bg-transparent md:bg-white md:backdrop-blur-xl md:border-b md:border-black/5 border-b-0 md:border-b"
        : "bg-white backdrop-blur-xl border-b border-black/5"
    }`}>
      <div className="flex items-center gap-4 md:gap-8 px-6 md:px-10 py-6 md:py-7 max-w-[1600px] mx-auto">
        {/* Brand */}
        <Link
          href="/"
          className={`text-xl md:text-2xl font-display tracking-[0.2em] uppercase whitespace-nowrap shrink-0 ${
            pathname === "/" ? "text-white md:text-[#1a1a1a]" : "text-[#1a1a1a]"
          }`}
        >
          AlaskaLabs
        </Link>

        {/* Search bar */}
        <form
          ref={formRef}
          onSubmit={onSubmit}
          className="relative flex-1 max-w-md"
        >
          <div className={`flex items-center gap-2 rounded-full px-4 py-2 transition-all ${
            pathname === "/"
              ? "bg-white/15 border border-white/20 focus-within:bg-white/25 focus-within:border-white/40 md:bg-[#f2f4f7] md:border-black/5 md:focus-within:border-[#0072BC]/40 md:focus-within:bg-white md:focus-within:shadow-[0_0_0_4px_rgba(0,114,188,0.08)]"
              : "bg-[#f2f4f7] border border-black/5 focus-within:border-[#0072BC]/40 focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(0,114,188,0.08)]"
          }`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
              className={`w-4 h-4 shrink-0 ${pathname === "/" ? "text-white/60 md:text-[#888]" : "text-[#888]"}`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setOpen(true);
                setActiveIdx(-1);
              }}
              onFocus={() => setOpen(true)}
              onKeyDown={onKeyDown}
              placeholder="Search peptides…"
              className={`flex-1 bg-transparent outline-none text-sm font-sans ${
                pathname === "/" ? "text-white placeholder:text-white/50 md:text-[#1a1a1a] md:placeholder:text-[#888]" : "text-[#1a1a1a] placeholder:text-[#888]"
              }`}
              aria-label="Search peptides"
              aria-autocomplete="list"
              aria-expanded={open && suggestions.length > 0}
            />
          </div>

          {open && query.trim().length > 0 && (
            <div
              role="listbox"
              className="absolute left-0 top-[calc(100%+8px)] w-[min(620px,93vw)] bg-white border border-black/5 rounded-2xl shadow-[0_28px_56px_-12px_rgba(0,0,0,0.22)] overflow-hidden z-50"
            >
              {suggestions.length === 0 ? (
                <div className="px-4 py-3 text-sm font-sans text-[#888]">
                  No peptides match “{query}”.
                </div>
              ) : (
                <ul className="max-h-[70vh] overflow-y-auto py-2">
                  {suggestions.map((p, i) => (
                    <li key={p.handle}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={i === activeIdx}
                        onMouseEnter={() => setActiveIdx(i)}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => go(p.handle)}
                        className={`w-full flex items-center gap-4 px-4 py-3 text-left transition-colors ${
                          i === activeIdx ? "bg-[#0072BC]/8" : "hover:bg-[#f2f4f7]"
                        }`}
                      >
                        <div className="w-24 h-24 shrink-0 bg-white rounded-xl border border-black/5 overflow-hidden flex items-center justify-center">
                          <img
                            src={p.thumbnail}
                            alt=""
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xl font-display font-black uppercase text-[#1a1a1a] truncate leading-tight">
                            {p.name} {p.strength}
                          </p>
                          <p className="text-[13px] font-sans text-[#888] truncate mt-0.5">
                            {p.category} · {p.vial}
                          </p>
                        </div>
                        <span className="text-lg font-sans font-bold text-[#1a1a1a] shrink-0">
                          ${p.price.toFixed(2)}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </form>

        {/* Nav links */}
        <div className="hidden lg:flex items-center gap-7">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-sans font-medium transition-colors whitespace-nowrap ${
                  active
                    ? "text-[#0072BC]"
                    : "text-[#444] hover:text-[#0072BC]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right-side icons */}
        <div className={`flex items-center gap-4 md:gap-5 ml-auto lg:ml-0 ${
          pathname === "/" ? "text-white md:text-[#444]" : ""
        }`}>
          <Link
            href="/account"
            className={`${pathname === "/" ? "text-white/90 md:text-[#444]" : "text-[#444]"} hover:text-[#0072BC] transition-colors`}
            aria-label="Account"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.6}
              stroke="currentColor"
              className="w-5 h-5 md:w-6 md:h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
          </Link>

          <button
            onClick={openDrawer}
            className={`relative ${pathname === "/" ? "text-white/90 md:text-[#444]" : "text-[#444]"} hover:text-[#0072BC] transition-colors`}
            aria-label="Open cart"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.6}
              stroke="currentColor"
              className="w-5 h-5 md:w-6 md:h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#0072BC] text-white text-[10px] font-sans font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>

          <Link
            href="/shop"
            className="hidden md:inline-block px-5 py-2 text-xs font-display tracking-[0.2em] uppercase bg-[#0072BC] text-white rounded-full transition-all duration-300 hover:scale-105 hover:shadow-[0_10px_30px_-8px_rgba(0,114,188,0.5)]"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
