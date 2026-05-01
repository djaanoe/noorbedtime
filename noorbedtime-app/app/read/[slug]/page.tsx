"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Story } from "@/types";

export default function ReadPage() {
  const { slug } = useParams<{ slug: string }>();
  const [story, setStory] = useState<Story | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/stories/${slug}`)
      .then((r) => {
        if (r.status === 401) { window.location.href = "/auth"; return null; }
        if (r.status === 403) { window.location.href = "/credits"; return null; }
        return r.json();
      })
      .then((data) => { if (data) { setStory(data); setLoading(false); } })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="text-gold animate-pulse text-lg" style={{ fontFamily: "Outfit, sans-serif" }}>Loading story...</div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen bg-navy flex flex-col items-center justify-center gap-4">
        <p className="text-gray-400">Story not found.</p>
        <Link href="/library" className="text-gold hover:underline">Back to Library</Link>
      </div>
    );
  }

  const page = story.pages[currentPage];
  const totalPages = story.pages.length;
  const isFirst = currentPage === 0;
  const isLast = currentPage === totalPages - 1;

  return (
    <div className="min-h-screen bg-[#080F1A] flex flex-col">
      {/* Top bar */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-gray-800/60">
        <Link href={`/story/${slug}`} className="text-gray-400 hover:text-gold transition-colors text-sm flex items-center gap-1">
          ← Back
        </Link>
        <span className="text-xs text-gray-500" style={{ fontFamily: "Outfit, sans-serif" }}>
          {story.title}
        </span>
        <span className="text-xs text-gray-600">{currentPage + 1} / {totalPages}</span>
      </header>

      {/* Progress bar */}
      <div className="h-0.5 bg-gray-800">
        <div
          className="h-full bg-gold transition-all duration-500"
          style={{ width: `${((currentPage + 1) / totalPages) * 100}%` }}
        />
      </div>

      {/* Content */}
      <main className="flex-1 flex flex-col md:flex-row max-w-5xl mx-auto w-full px-4 py-6 gap-6">
        {/* Illustration */}
        <div className="md:w-1/2">
          <div className="relative aspect-[3/4] md:aspect-auto md:h-full min-h-[300px] rounded-2xl overflow-hidden bg-navy-lighter">
            <Image
              src={`/illustrations/${slug}/page-${String(page.page_number).padStart(2, "0")}.webp`}
              alt={`Page ${page.page_number}`}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Text */}
        <div className="md:w-1/2 flex flex-col justify-center">
          <p className="text-xs text-gray-500 mb-4 tracking-widest uppercase">
            Page {currentPage + 1}
          </p>
          <p className="text-xl md:text-2xl text-gray-100 leading-relaxed font-light">
            {page.text}
          </p>

          {isLast && (
            <div className="mt-8 bg-navy-lighter rounded-xl p-5 border border-gold/20">
              <p className="text-gold font-semibold mb-1" style={{ fontFamily: "Outfit, sans-serif" }}>
                The End 🌙
              </p>
              <p className="text-gray-400 text-sm">
                May Allah bless your family with sweet dreams.
              </p>
              <Link
                href="/library"
                className="mt-3 inline-block text-sm text-gold hover:underline"
              >
                Explore more stories →
              </Link>
            </div>
          )}
        </div>
      </main>

      {/* Navigation */}
      <footer className="border-t border-gray-800/60 px-4 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
            disabled={isFirst}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-700 text-gray-300 text-sm hover:border-gold hover:text-gold transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>

          <div className="flex gap-1.5">
            {story.pages.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === currentPage ? "bg-gold scale-125" : "bg-gray-700 hover:bg-gray-500"
                }`}
                aria-label={`Go to page ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={isLast}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold text-navy font-bold text-sm hover:bg-gold-light transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      </footer>
    </div>
  );
}
