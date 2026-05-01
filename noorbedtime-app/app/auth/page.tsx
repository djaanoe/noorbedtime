"use client";
import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });
      if (error) setMessage({ type: "error", text: error.message });
      else setMessage({ type: "success", text: "Check your email to confirm your account." });
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setMessage({ type: "error", text: error.message });
      } else {
        // Check if this email has a pending purchase and grant access if so
        await fetch("/api/auth/grant-pending", { method: "POST" });
        window.location.href = "/account";
      }
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-gold" style={{ fontFamily: "Outfit, sans-serif" }}>
            NoorBedtime
          </Link>
          <p className="text-gray-400 text-sm mt-2">Stories of Light, Before Goodnight</p>
        </div>

        <div className="bg-navy-lighter rounded-2xl border border-gray-700/30 p-8">
          {/* Mode toggle */}
          <div className="flex rounded-xl bg-navy border border-gray-700 p-1 mb-6">
            {(["signin", "signup"] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setMessage(null); }}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  mode === m ? "bg-gold text-navy" : "text-gray-400 hover:text-gray-200"
                }`}
              >
                {m === "signin" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Abu Abdullah"
                  className="w-full bg-navy border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-gold/50"
                />
              </div>
            )}
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full bg-navy border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-gold/50"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full bg-navy border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-gold/50"
              />
            </div>

            {message && (
              <div className={`text-xs p-3 rounded-lg ${message.type === "error" ? "bg-red-900/30 text-red-400 border border-red-800" : "bg-teal/20 text-teal border border-teal/30"}`}>
                {message.text}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold text-navy font-bold py-3 rounded-xl hover:bg-gold-light transition-colors disabled:opacity-60 text-sm"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              {loading ? "Loading..." : mode === "signin" ? "Sign In" : "Create Account"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-600 mt-6">
          By continuing, you agree to our{" "}
          <span className="text-gray-500 hover:text-gold cursor-pointer">Terms</span> &amp;{" "}
          <span className="text-gray-500 hover:text-gold cursor-pointer">Privacy Policy</span>
        </p>
      </div>
    </div>
  );
}
