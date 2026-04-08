"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import { useCart } from "@/lib/cart-context";

export default function Navbar() {
  const pathname = usePathname();
  const isLanding = pathname === "/";
  const { scrollYProgress } = useScroll();
  const { itemCount, openDrawer } = useCart();

  const landingBg = useTransform(
    scrollYProgress,
    [0, 0.85, 0.95],
    ["rgba(5,13,26,0.3)", "rgba(5,13,26,0.3)", "rgba(139,0,0,0.4)"]
  );

  return (
    <motion.nav
      style={isLanding ? { backgroundColor: landingBg } : undefined}
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 backdrop-blur-xl ${
        isLanding
          ? "border-b border-white/10"
          : "bg-white border-b border-[#eee]"
      }`}
    >
      <Link
        href="/"
        className={`text-2xl font-display tracking-[0.2em] uppercase ${
          isLanding ? "text-white" : "text-[#1a1a1a]"
        }`}
      >
        AlaskaLabs
      </Link>

      <div className="flex items-center gap-6">
        {!isLanding && (
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/shop"
              className={`text-sm font-sans transition-colors ${
                pathname.startsWith("/shop")
                  ? "text-[#0072BC]"
                  : "text-[#444] hover:text-[#1a1a1a]"
              }`}
            >
              Shop
            </Link>
            <Link
              href="/about"
              className={`text-sm font-sans transition-colors ${
                pathname === "/about"
                  ? "text-[#0072BC]"
                  : "text-[#444] hover:text-[#1a1a1a]"
              }`}
            >
              About
            </Link>
            <Link
              href="/faq"
              className={`text-sm font-sans transition-colors ${
                pathname === "/faq"
                  ? "text-[#0072BC]"
                  : "text-[#444] hover:text-[#1a1a1a]"
              }`}
            >
              FAQ
            </Link>
          </div>
        )}

        <button
          onClick={openDrawer}
          className={`relative transition-colors ${
            isLanding
              ? "text-white hover:text-prime-blue"
              : "text-[#1a1a1a] hover:text-[#0072BC]"
          }`}
          aria-label="Open cart"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
            />
          </svg>
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-prime-red text-white text-xs font-sans font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </button>

        {isLanding ? (
          <Link
            href="/shop"
            className="px-6 py-2 text-sm font-display tracking-[0.15em] uppercase bg-white text-prime-blue rounded-full transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]"
          >
            Shop Now
          </Link>
        ) : (
          <Link
            href="/account"
            className="text-[#444] hover:text-[#1a1a1a] transition-colors"
            aria-label="Account"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
          </Link>
        )}
      </div>
    </motion.nav>
  );
}
