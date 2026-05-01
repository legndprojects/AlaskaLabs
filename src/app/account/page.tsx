"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const { customer, isLoading, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return (
      <main className="min-h-screen bg-white pt-24 md:pt-36 pb-16 px-8 md:px-16 lg:px-24">
        <div className="max-w-3xl mx-auto">
          <p className="text-[#888] font-sans">Loading...</p>
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    router.push("/account/login");
    return null;
  }

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <main className="min-h-screen bg-white pt-24 md:pt-36 pb-16 px-8 md:px-16 lg:px-24">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-5xl md:text-6xl font-display font-black uppercase text-[#1a1a1a]">
            Account
          </h1>
          <button
            onClick={handleLogout}
            className="text-sm font-sans text-[#888] hover:text-[#E31C23] transition-colors"
          >
            Log Out
          </button>
        </div>

        <p className="text-lg font-sans text-[#444] mb-8">
          Welcome back{customer?.first_name ? `, ${customer.first_name}` : ""}!
        </p>

        <div className="bg-[#f5f5f5] rounded-xl p-8 text-center">
          <h2 className="text-xl font-display font-black uppercase text-[#1a1a1a] mb-3">
            Order History
          </h2>
          <p className="text-sm font-sans text-[#888]">
            No orders yet.{" "}
            <Link href="/shop" className="text-[#0072BC] hover:underline">
              Start shopping →
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
