"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import CartLineItem from "@/components/CartLineItem";
import ShippingProgress from "@/components/ShippingProgress";

export default function CartPage() {
  const { items, itemCount, isLoading } = useCart();

  const subtotal = items.reduce(
    (sum, item) => sum + item.unit_price * item.quantity,
    0
  );
  const shippingCost = subtotal >= 15000 ? 0 : 599;
  const total = subtotal + shippingCost;

  if (isLoading) {
    return (
      <main className="min-h-screen bg-white pt-24 pb-16 px-8 md:px-16 lg:px-24">
        <div className="max-w-3xl mx-auto">
          <p className="text-[#888] font-sans">Loading cart...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white pt-24 pb-16 px-8 md:px-16 lg:px-24">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-display font-black uppercase text-[#1a1a1a] mb-8">
          Your Cart
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg font-sans text-[#888] mb-6">
              Your cart is empty
            </p>
            <Link
              href="/shop"
              className="inline-block bg-[#1a1a1a] text-white font-sans font-semibold text-sm px-8 py-3 rounded-lg hover:bg-[#333] transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <ShippingProgress subtotalInCents={subtotal} />
            </div>

            <div className="mb-8">
              {items.map((item) => (
                <CartLineItem key={item.id} item={item} />
              ))}
            </div>

            <div className="bg-[#f5f5f5] rounded-xl p-6 space-y-3">
              <div className="flex justify-between text-sm font-sans">
                <span className="text-[#888]">Subtotal ({itemCount} items)</span>
                <span className="text-[#1a1a1a]">${(subtotal / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-sans">
                <span className="text-[#888]">Shipping</span>
                <span className="text-[#1a1a1a]">
                  {shippingCost === 0 ? "Free" : `$${(shippingCost / 100).toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-sans font-bold border-t border-[#ddd] pt-3">
                <span className="text-[#1a1a1a]">Total</span>
                <span className="text-[#1a1a1a]">${(total / 100).toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <Link
                href="/checkout"
                className="block w-full text-center bg-[#1a1a1a] text-white font-sans font-semibold text-sm py-4 rounded-lg hover:bg-[#333] transition-colors"
              >
                Continue to Checkout
              </Link>
              <Link
                href="/shop"
                className="block w-full text-center text-sm font-sans text-[#0072BC] hover:underline"
              >
                ← Continue Shopping
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
