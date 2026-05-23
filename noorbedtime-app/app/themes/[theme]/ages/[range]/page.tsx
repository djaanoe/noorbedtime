import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllThemes,
  getStoriesByTheme,
  themeToSlug,
  themeToLabel,
  CATEGORIES,
} from "@/lib/stories";
import { Story } from "@/types";
import StoryCard from "@/components/StoryCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Props {
  params: { theme: string; range: string };
}

const RANGE_TO_TIER: Record<string, Story["age_tier"]> = {
  "3-5": "little_stars",
  "6-8": "rising_moons",
  "9-12": "young_explorers",
};

const RANGE_LABELS: Record<string, string> = {
  "3-5": "Little Stars (Ages 3–5)",
  "6-8": "Rising Moons (Ages 6–8)",
  "9-12": "Young Explorers (Ages 9–12)",
};

const AGE_DESCRIPTIONS: Record<string, string> = {
  "3-5": "short, joyful stories perfect for toddlers and young children aged 3 to 5",
  "6-8": "engaging stories with deeper themes, ideal for readers aged 6 to 8",
  "9-12": "thoughtful stories exploring justice and wisdom, for preteens aged 9 to 12",
};

export function generateStaticParams() {
  const themes = getAllThemes();
  const ages = ["3-5", "6-8", "9-12"];
  const tierMap: Record<string, Story["age_tier"]> = {
    "3-5": "little_stars",
    "6-8": "rising_moons",
    "9-12": "young_explorers",
  };

  const params: { theme: string; range: string }[] = [];
  themes.forEach((t) => {
    const themeSlug = themeToSlug(t);
    const stories = getStoriesByTheme(themeSlug);
    ages.forEach((range) => {
      const tier = tierMap[range];
      if (stories.some((s) => s.age_tier === tier)) {
        params.push({ theme: themeSlug, range });
      }
    });
  });
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const label = themeToLabel(params.theme);
  const ageLabel = RANGE_LABELS[params.range];
  if (!ageLabel) return {};
  return {
    title: `Islamic ${label} Stories for Ages ${params.range}`,
    description: `Islamic bedtime stories about ${label.toLowerCase()} for Muslim children aged ${params.range}. Scholar-validated tales from the Quran and Prophet traditions — all free.`,
    alternates: {
      canonical: `https://noorbedtime.com/themes/${params.theme}/ages/${params.range}`,
    },
  };
}

export default function ThemeAgePage({ params }: Props) {
  const tier = RANGE_TO_TIER[params.range];
  const ageLabel = RANGE_LABELS[params.range];
  if (!tier || !ageLabel) notFound();

  const allThemeStories = getStoriesByTheme(params.theme);
  const stories = allThemeStories.filter((s) => s.age_tier === tier);
  if (stories.length === 0) notFound();

  const label = themeToLabel(params.theme);
  const ageDesc = AGE_DESCRIPTIONS[params.range];

  const otherAges = ["3-5", "6-8", "9-12"].filter((r) => r !== params.range);
  const relatedCategories = Object.entries(CATEGORIES).slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Islamic ${label} Stories for Ages ${params.range}`,
    description: `Islamic stories about ${label.toLowerCase()} for Muslim children aged ${params.range}`,
    url: `https://noorbedtime.com/themes/${params.theme}/ages/${params.range}`,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://noorbedtime.com" },
        { "@type": "ListItem", position: 2, name: "Library", item: "https://noorbedtime.com/library" },
        { "@type": "ListItem", position: 3, name: label, item: `https://noorbedtime.com/themes/${params.theme}` },
        { "@type": "ListItem", position: 4, name: `Ages ${params.range}`, item: `https://noorbedtime.com/themes/${params.theme}/ages/${params.range}` },
      ],
    },
    hasPart: stories.map((s) => ({
      "@type": "Book",
      name: s.title,
      url: `https://noorbedtime.com/story/${s.slug}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main className="min-h-screen bg-navy">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <nav className="text-xs text-gray-500 mb-8 flex items-center gap-2 flex-wrap">
            <Link href="/" className="hover:text-gold transition-colors">Home</Link>
            <span>›</span>
            <Link href="/library" className="hover:text-gold transition-colors">Library</Link>
            <span>›</span>
            <Link href={`/themes/${params.theme}`} className="hover:text-gold transition-colors">{label}</Link>
            <span>›</span>
            <span className="text-gray-400">Ages {params.range}</span>
          </nav>

          <div className="mb-10">
            <p className="text-gold text-xs tracking-widest uppercase mb-2">Theme · {ageLabel}</p>
            <h1
              className="text-3xl md:text-4xl font-bold text-white mb-4"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              {label} Stories for Ages {params.range}
            </h1>
            <p className="text-gray-400 max-w-2xl leading-relaxed mb-5">
              {stories.length} Islamic {label.toLowerCase()}{" "}
              {stories.length === 1 ? "story" : "stories"} — {ageDesc}. These scholar-validated
              tales are drawn from the Quran and Prophet traditions, teaching the beautiful value of{" "}
              {label.toLowerCase()} in an age-appropriate way.
            </p>

            <div className="flex flex-wrap gap-2">
              <Link
                href={`/themes/${params.theme}`}
                className="text-xs px-3 py-1.5 rounded-full border border-gray-600 text-gray-400 hover:border-gold/40 hover:text-gold transition-colors"
              >
                All ages ({allThemeStories.length} stories)
              </Link>
              {otherAges.map((range) => {
                const rangeTier = RANGE_TO_TIER[range];
                const count = allThemeStories.filter((s) => s.age_tier === rangeTier).length;
                if (count === 0) return null;
                return (
                  <Link
                    key={range}
                    href={`/themes/${params.theme}/ages/${range}`}
                    className="text-xs px-3 py-1.5 rounded-full border border-gray-600 text-gray-400 hover:border-gold/40 hover:text-gold transition-colors"
                  >
                    Ages {range} ({count})
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {stories.map((story) => (
              <StoryCard key={story.slug} story={story} />
            ))}
          </div>

          {stories.length === 1 && (
            <div className="mt-8 bg-navy-lighter rounded-xl p-6 border border-gray-700/30">
              <h2
                className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4"
                style={{ fontFamily: "Outfit, sans-serif" }}
              >
                More {label} Stories Across Age Groups
              </h2>
              <p className="text-gray-400 text-sm mb-4">
                Looking for more {label.toLowerCase()} stories? Explore them across all age tiers in our full {label} collection.
              </p>
              <Link
                href={`/themes/${params.theme}`}
                className="inline-block text-gold text-sm hover:underline"
              >
                View all {allThemeStories.length} {label.toLowerCase()} stories →
              </Link>
            </div>
          )}

          <div className="mt-10 mb-4">
            <h2
              className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-4"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              Browse by Category
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {relatedCategories.map(([slug, cat]) => (
                <Link
                  key={slug}
                  href={`/${slug}/ages/${params.range}`}
                  className="bg-navy-lighter rounded-xl p-3 border border-gray-700/30 hover:border-gold/30 transition-colors"
                >
                  <div className="text-lg mb-1">{cat.icon}</div>
                  <div className="text-xs font-semibold text-gray-300">{cat.label}</div>
                  <div className="text-xs text-gray-500 mt-0.5">Ages {params.range}</div>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-8 bg-navy-lighter rounded-2xl border border-gray-700/30 p-8 text-center">
            <p className="text-gray-400 text-sm mb-4">
              All 50+ Islamic bedtime stories are free — no account needed.
            </p>
            <Link
              href={`/themes/${params.theme}`}
              className="inline-block text-gold hover:underline text-sm mr-6"
            >
              ← All {label} stories
            </Link>
            <Link
              href="/donate"
              className="inline-block bg-gold text-navy font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-gold-light transition-colors"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              ❤️ Support NoorBedtime
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
