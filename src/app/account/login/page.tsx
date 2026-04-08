"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, register } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/account";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(email, password, firstName, lastName);
      }
      router.push(redirect);
    } catch {
      setError(
        mode === "login"
          ? "Invalid email or password."
          : "Registration failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-white pt-24 pb-16 px-8 md:px-16 lg:px-24">
      <div className="max-w-md mx-auto">
        <h1 className="text-5xl font-display font-black uppercase text-[#1a1a1a] mb-8 text-center">
          Account
        </h1>

        <div className="flex border border-[#eee] rounded-lg mb-8 overflow-hidden">
          <button
            onClick={() => { setMode("login"); setError(""); }}
            className={`flex-1 py-3 text-sm font-sans font-semibold transition-colors ${
              mode === "login"
                ? "bg-[#1a1a1a] text-white"
                : "bg-white text-[#888] hover:text-[#1a1a1a]"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setMode("register"); setError(""); }}
            className={`flex-1 py-3 text-sm font-sans font-semibold transition-colors ${
              mode === "register"
                ? "bg-[#1a1a1a] text-white"
                : "bg-white text-[#888] hover:text-[#1a1a1a]"
            }`}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-sans rounded-lg px-4 py-3 mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-sans font-semibold text-[#666] uppercase tracking-wide mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="w-full bg-[#f5f5f5] border-0 rounded-lg px-4 py-3 text-sm font-sans text-[#1a1a1a] focus:ring-2 focus:ring-[#0072BC] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-sans font-semibold text-[#666] uppercase tracking-wide mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="w-full bg-[#f5f5f5] border-0 rounded-lg px-4 py-3 text-sm font-sans text-[#1a1a1a] focus:ring-2 focus:ring-[#0072BC] focus:outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-sans font-semibold text-[#666] uppercase tracking-wide mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#f5f5f5] border-0 rounded-lg px-4 py-3 text-sm font-sans text-[#1a1a1a] focus:ring-2 focus:ring-[#0072BC] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-sans font-semibold text-[#666] uppercase tracking-wide mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full bg-[#f5f5f5] border-0 rounded-lg px-4 py-3 text-sm font-sans text-[#1a1a1a] focus:ring-2 focus:ring-[#0072BC] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#1a1a1a] text-white font-sans font-semibold text-sm py-4 rounded-lg hover:bg-[#333] transition-colors disabled:opacity-50"
          >
            {isSubmitting
              ? "Please wait..."
              : mode === "login"
              ? "Sign In"
              : "Create Account"}
          </button>
        </form>
      </div>
    </main>
  );
}
