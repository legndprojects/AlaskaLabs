"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import CartLineItem from "./CartLineItem";

export default function CartDrawer() {
  const { isDrawerOpen, closeDrawer, items, itemCount } = useCart();

  const subtotal = items.reduce(
    (sum, item) => sum + item.unit_price * item.quantity,
    0
  );

  return (
    <>
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-[60]"
          onClick={closeDrawer}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl transform transition-transform duration-300 ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#eee]">
            <h2 className="text-lg font-display font-black uppercase text-[#1a1a1a]">
              Cart ({itemCount})
            </h2>
            <button
              onClick={closeDrawer}
              className="text-[#888] hover:text-[#1a1a1a] transition-colors"
              aria-label="Close cart"
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
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <p className="text-[#888] font-sans mb-4">
                  Your cart is empty
                </p>
                <Link
                  href="/shop"
                  onClick={closeDrawer}
                  className="text-sm font-sans text-[#0072BC] hover:underline"
                >
                  Continue Shopping →
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <CartLineItem key={item.id} item={item} />
              ))
            )}
          </div>

          {items.length > 0 && (
            <div className="px-6 py-4 border-t border-[#eee] space-y-3">
              <div className="flex justify-between text-sm font-sans">
                <span className="text-[#888]">Subtotal</span>
                <span className="font-bold text-[#1a1a1a]">
                  ${(subtotal / 100).toFixed(2)}
                </span>
              </div>
              <Link
                href="/cart"
                onClick={closeDrawer}
                className="block w-full text-center border border-[#1a1a1a] text-[#1a1a1a] font-sans font-semibold text-sm py-3 rounded-lg hover:bg-[#f5f5f5] transition-colors"
              >
                View Cart
              </Link>
              <Link
                href="/checkout"
                onClick={closeDrawer}
                className="block w-full text-center bg-[#1a1a1a] text-white font-sans font-semibold text-sm py-3 rounded-lg hover:bg-[#333] transition-colors"
              >
                Checkout
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
