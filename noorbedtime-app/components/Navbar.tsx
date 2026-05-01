"use client";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-navy/90 backdrop-blur-md border-b border-gray-800/50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold text-gold tracking-wide" style={{ fontFamily: "Outfit, sans-serif" }}>
          NoorBedtime
        </Link>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1 text-sm">
            <Link href="/library" className="text-gray-300 hover:text-gold text-xs font-medium px-3 py-1 transition-colors">
              Library
            </Link>
            <Link href="/credits" className="text-gold text-xs font-semibold border border-gold/40 px-3 py-1 rounded-full hover:bg-gold/10 transition-colors">
              Unlock Stories
            </Link>
          </div>
          <Link href="/auth" className="bg-gold text-navy text-xs font-bold px-4 py-1.5 rounded-full hover:bg-gold-light transition-colors">
            Sign In
          </Link>
          <button
            className="sm:hidden text-gray-400 hover:text-gold"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="sm:hidden bg-navy-light border-t border-gray-800 px-4 py-3 flex flex-col gap-2">
          <Link href="/library" className="text-gray-300 hover:text-gold text-sm py-1" onClick={() => setMenuOpen(false)}>Library</Link>
          <Link href="/credits" className="text-gold text-sm py-1" onClick={() => setMenuOpen(false)}>Unlock Stories</Link>
          <Link href="/account" className="text-gray-300 hover:text-gold text-sm py-1" onClick={() => setMenuOpen(false)}>Account</Link>
        </div>
      )}
    </nav>
  );
}
