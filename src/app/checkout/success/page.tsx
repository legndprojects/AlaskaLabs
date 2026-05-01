import Link from "next/link";

export const metadata = {
  title: "Order Confirmed — AlaskaLabs",
};

export default function CheckoutSuccessPage() {
  return (
    <main className="min-h-screen bg-white pt-24 md:pt-36 pb-16 px-8 md:px-16 lg:px-24">
      <div className="max-w-2xl mx-auto text-center">
        <div className="text-6xl mb-6">✓</div>
        <h1 className="text-4xl md:text-5xl font-display font-black uppercase text-[#1a1a1a] mb-4">
          Thank You
        </h1>
        <p className="text-lg font-sans text-[#444] mb-2">
          Your order has been placed successfully.
        </p>
        <p className="text-sm font-sans text-[#888] mb-8">
          Most orders ship within 1 business day. You&apos;ll receive a
          confirmation email shortly.
        </p>
        <Link
          href="/shop"
          className="inline-block bg-[#1a1a1a] text-white font-sans font-semibold text-sm px-8 py-3 rounded-lg hover:bg-[#333] transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </main>
  );
}
