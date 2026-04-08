"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";

type Step = "shipping" | "payment" | "review";

export default function CheckoutPage() {
  const { items } = useCart();
  const [currentStep, setCurrentStep] = useState<Step>("shipping");
  const [shippingData, setShippingData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address1: "",
    city: "",
    state: "",
    postalCode: "",
  });

  const subtotal = items.reduce(
    (sum, item) => sum + item.unit_price * item.quantity,
    0
  );
  const shippingCost = subtotal >= 15000 ? 0 : 599;
  const total = subtotal + shippingCost;

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-white pt-24 pb-16 px-8 md:px-16 lg:px-24">
        <div className="max-w-2xl mx-auto text-center py-16">
          <h1 className="text-4xl font-display font-black uppercase text-[#1a1a1a] mb-4">
            Checkout
          </h1>
          <p className="text-[#888] font-sans mb-6">Your cart is empty.</p>
          <Link
            href="/shop"
            className="inline-block bg-[#1a1a1a] text-white font-sans font-semibold text-sm px-8 py-3 rounded-lg"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  const steps: { key: Step; label: string; number: number }[] = [
    { key: "shipping", label: "Shipping", number: 1 },
    { key: "payment", label: "Payment", number: 2 },
    { key: "review", label: "Review & Place Order", number: 3 },
  ];

  const currentIndex = steps.findIndex((s) => s.key === currentStep);

  const inputClass =
    "w-full bg-[#f5f5f5] border-0 rounded-lg px-4 py-3 text-sm font-sans text-[#1a1a1a] focus:ring-2 focus:ring-[#0072BC] focus:outline-none";
  const labelClass =
    "block text-xs font-sans font-semibold text-[#666] uppercase tracking-wide mb-1";

  return (
    <main className="min-h-screen bg-white pt-24 pb-16 px-8 md:px-16 lg:px-24">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-display font-black uppercase text-[#1a1a1a] mb-8">
          Checkout
        </h1>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-10">
          {steps.map((step, i) => (
            <div key={step.key} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-sans font-bold ${
                  i < currentIndex
                    ? "bg-[#0072BC] text-white"
                    : i === currentIndex
                    ? "bg-[#1a1a1a] text-white"
                    : "bg-[#eee] text-[#888]"
                }`}
              >
                {i < currentIndex ? "✓" : step.number}
              </div>
              <span
                className={`text-sm font-sans ${
                  i === currentIndex
                    ? "text-[#1a1a1a] font-semibold"
                    : "text-[#888]"
                }`}
              >
                {step.label}
              </span>
              {i < steps.length - 1 && <div className="w-8 h-[1px] bg-[#ddd]" />}
            </div>
          ))}
        </div>

        {/* Shipping */}
        {currentStep === "shipping" && (
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Email</label>
              <input
                type="email"
                value={shippingData.email}
                onChange={(e) =>
                  setShippingData({ ...shippingData, email: e.target.value })
                }
                className={inputClass}
                placeholder="your@email.com"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>First Name</label>
                <input
                  type="text"
                  value={shippingData.firstName}
                  onChange={(e) =>
                    setShippingData({ ...shippingData, firstName: e.target.value })
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Last Name</label>
                <input
                  type="text"
                  value={shippingData.lastName}
                  onChange={(e) =>
                    setShippingData({ ...shippingData, lastName: e.target.value })
                  }
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Address</label>
              <input
                type="text"
                value={shippingData.address1}
                onChange={(e) =>
                  setShippingData({ ...shippingData, address1: e.target.value })
                }
                className={inputClass}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>City</label>
                <input
                  type="text"
                  value={shippingData.city}
                  onChange={(e) =>
                    setShippingData({ ...shippingData, city: e.target.value })
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>State</label>
                <input
                  type="text"
                  value={shippingData.state}
                  onChange={(e) =>
                    setShippingData({ ...shippingData, state: e.target.value })
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>ZIP</label>
                <input
                  type="text"
                  value={shippingData.postalCode}
                  onChange={(e) =>
                    setShippingData({ ...shippingData, postalCode: e.target.value })
                  }
                  className={inputClass}
                />
              </div>
            </div>
            <button
              onClick={() => setCurrentStep("payment")}
              className="w-full bg-[#1a1a1a] text-white font-sans font-semibold text-sm py-4 rounded-lg hover:bg-[#333] transition-colors mt-4"
            >
              Continue to Payment
            </button>
          </div>
        )}

        {/* Payment */}
        {currentStep === "payment" && (
          <div>
            <div className="bg-[#f5f5f5] rounded-xl p-6 mb-6">
              <p className="text-sm font-sans text-[#444]">
                Payment processing will be available soon. For now, orders use
                manual payment confirmation.
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setCurrentStep("shipping")}
                className="flex-1 border border-[#ddd] text-[#666] font-sans font-semibold text-sm py-4 rounded-lg hover:bg-[#f5f5f5] transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setCurrentStep("review")}
                className="flex-1 bg-[#1a1a1a] text-white font-sans font-semibold text-sm py-4 rounded-lg hover:bg-[#333] transition-colors"
              >
                Continue to Review
              </button>
            </div>
          </div>
        )}

        {/* Review */}
        {currentStep === "review" && (
          <div>
            <div className="bg-[#f5f5f5] rounded-xl p-6 mb-6 space-y-3">
              <h3 className="text-sm font-sans font-semibold text-[#1a1a1a] uppercase">
                Order Summary
              </h3>
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between text-sm font-sans"
                >
                  <span className="text-[#444]">
                    {item.title} × {item.quantity}
                  </span>
                  <span className="text-[#1a1a1a]">
                    ${((item.unit_price * item.quantity) / 100).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="border-t border-[#ddd] pt-3 flex justify-between text-sm font-sans">
                <span className="text-[#888]">Shipping</span>
                <span>
                  {shippingCost === 0
                    ? "Free"
                    : `$${(shippingCost / 100).toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between font-sans font-bold">
                <span>Total</span>
                <span>${(total / 100).toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-[#f5f5f5] rounded-xl p-6 mb-6">
              <h3 className="text-sm font-sans font-semibold text-[#1a1a1a] uppercase mb-2">
                Shipping To
              </h3>
              <p className="text-sm font-sans text-[#444]">
                {shippingData.firstName} {shippingData.lastName}
                <br />
                {shippingData.address1}
                <br />
                {shippingData.city}, {shippingData.state}{" "}
                {shippingData.postalCode}
              </p>
              <button
                onClick={() => setCurrentStep("shipping")}
                className="text-xs font-sans text-[#0072BC] hover:underline mt-2"
              >
                Edit
              </button>
            </div>

            <p className="text-xs font-sans text-[#888] mb-6">
              By placing this order, you agree to our{" "}
              <a href="/terms" className="text-[#0072BC] hover:underline">
                Terms of Service
              </a>{" "}
              and confirm these products are for research purposes only.
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => setCurrentStep("payment")}
                className="flex-1 border border-[#ddd] text-[#666] font-sans font-semibold text-sm py-4 rounded-lg hover:bg-[#f5f5f5] transition-colors"
              >
                Back
              </button>
              <Link
                href="/checkout/success"
                className="flex-1 bg-[#1a1a1a] text-white font-sans font-semibold text-sm py-4 rounded-lg hover:bg-[#333] transition-colors text-center"
              >
                Place Order
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
