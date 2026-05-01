"use client";
import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StoryCard from "@/components/StoryCard";
import { Story } from "@/types";

interface Props {
  stories: Story[];
}

const TIERS = [
  { id: "all", label: "All Stories" },
  { id: "little_stars", label: "⭐ Little Stars (3-5)" },
  { id: "rising_moons", label: "🌙 Rising Moons (6-8)" },
  { id: "young_explorers", label: "🦋 Young Explorers (9-12)" },
];

export default function LibraryClient({ stories }: Props) {
  const [activeTier, setActiveTier] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return stories.filter((s) => {
      const matchTier = activeTier === "all" || s.age_tier === activeTier;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        s.title.toLowerCase().includes(q) ||
        s.theme.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q);
      return matchTier && matchSearch;
    });
  }, [stories, activeTier, search]);

  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ fontFamily: "Outfit, sans-serif" }}>
              Story Library
            </h1>
            <p className="text-gray-400">
              {stories.length} illustrated Islamic stories for children aged 3-12
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <input
              type="text"
              placeholder="Search stories, themes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-navy-lighter border border-gray-700 rounded-xl px-4 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-gold/50 sm:w-64"
            />
            <div className="flex flex-wrap gap-2">
              {TIERS.map((tier) => (
                <button
                  key={tier.id}
                  onClick={() => setActiveTier(tier.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                    activeTier === tier.id
                      ? "bg-gold/15 text-gold border-gold"
                      : "border-gray-600 text-gray-400 hover:border-gray-400"
                  }`}
                >
                  {tier.label}
                </button>
              ))}
            </div>
          </div>

          {/* Count */}
          <p className="text-xs text-gray-500 mb-4">{filtered.length} stories</p>

          {filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-500">No stories found.</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filtered.map((story) => (
                <StoryCard key={story.slug} story={story} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
