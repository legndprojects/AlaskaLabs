"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";

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

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/shop?q=${encodeURIComponent(q)}`);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-black/5 backdrop-blur-xl">
      <div className="flex items-center gap-4 md:gap-8 px-6 md:px-10 py-4 max-w-[1600px] mx-auto">
        {/* Brand */}
        <Link
          href="/"
          className="text-xl md:text-2xl font-display tracking-[0.2em] uppercase text-[#1a1a1a] whitespace-nowrap shrink-0"
        >
          AlaskaLabs
        </Link>

        {/* Search bar */}
        <form
          onSubmit={onSubmit}
          className="flex-1 max-w-md hidden md:flex items-center gap-2 bg-[#f2f4f7] border border-black/5 rounded-full px-4 py-2 focus-within:border-[#0072BC]/40 focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(0,114,188,0.08)] transition-all"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            className="w-4 h-4 text-[#888] shrink-0"
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
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search peptides…"
            className="flex-1 bg-transparent outline-none text-sm font-sans text-[#1a1a1a] placeholder:text-[#888]"
            aria-label="Search peptides"
          />
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
        <div className="flex items-center gap-4 md:gap-5 ml-auto lg:ml-0">
          <Link
            href="/account"
            className="text-[#444] hover:text-[#0072BC] transition-colors"
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
            className="relative text-[#444] hover:text-[#0072BC] transition-colors"
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
    </nav>
  );
}
