import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllCategories,
  getStoriesByCategory,
  CATEGORIES,
  AGE_TIER_LABELS,
} from "@/lib/stories";
import { Story } from "@/types";
import StoryCard from "@/components/StoryCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Props {
  params: { category: string; range: string };
}

const RANGE_TO_TIER: Record<string, Story["age_tier"]> = {
  "3-5": "little_stars",
  "6-8": "rising_moons",
  "9-12": "young_explorers",
};

const RANGE_LABELS: Record<string, string> = {
  "3-5": "Little Stars",
  "6-8": "Rising Moons",
  "9-12": "Young Explorers",
};

export function generateStaticParams() {
  const ages = ["3-5", "6-8", "9-12"];
  return getAllCategories().flatMap((category) =>
    ages.map((range) => ({ category, range }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const meta = CATEGORIES[params.category];
  const ageLabel = RANGE_LABELS[params.range];
  if (!meta || !ageLabel) return {};
  return {
    title: `${meta.label} Stories for Ages ${params.range} — ${ageLabel}`,
    description: `Islamic ${meta.label.toLowerCase()} stories for Muslim children aged ${params.range}. ${meta.description} Scholar-validated tales from the Quran and Prophet traditions.`,
    alternates: {
      canonical: `https://noorbedtime.com/${params.category}/ages/${params.range}`,
    },
    openGraph: {
      title: `${meta.label} Stories for Ages ${params.range} — NoorBedtime`,
      description: `${meta.label} Islamic stories for Muslim children aged ${params.range}.`,
    },
  };
}

export default function CategoryAgePage({ params }: Props) {
  const meta = CATEGORIES[params.category];
  const tier = RANGE_TO_TIER[params.range];
  if (!meta || !tier) notFound();

  const allCategoryStories = getStoriesByCategory(params.category);
  const stories = allCategoryStories.filter((s) => s.age_tier === tier);
  if (stories.length === 0) notFound();

  const ageLabel = RANGE_LABELS[params.range];
  const tierLabel = AGE_TIER_LABELS[tier];

  const otherAges = ["3-5", "6-8", "9-12"].filter((r) => r !== params.range);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${meta.label} Stories for Ages ${params.range}`,
    description: `Islamic ${meta.label.toLowerCase()} stories for Muslim children aged ${params.range}`,
    url: `https://noorbedtime.com/${params.category}/ages/${params.range}`,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://noorbedtime.com" },
        { "@type": "ListItem", position: 2, name: "Library", item: "https://noorbedtime.com/library" },
        { "@type": "ListItem", position: 3, name: meta.label, item: `https://noorbedtime.com/${params.category}` },
        {
          "@type": "ListItem",
          position: 4,
          name: `Ages ${params.range}`,
          item: `https://noorbedtime.com/${params.category}/ages/${params.range}`,
        },
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
      <main className="pt-20 min-h-screen bg-navy">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <nav className="text-xs text-gray-500 mb-8 flex items-center gap-2">
            <Link href="/" className="hover:text-gold transition-colors">Home</Link>
            <span>›</span>
            <Link href="/library" className="hover:text-gold transition-colors">Library</Link>
            <span>›</span>
            <Link href={`/${params.category}`} className="hover:text-gold transition-colors">
              {meta.label}
            </Link>
            <span>›</span>
            <span className="text-gray-400">Ages {params.range}</span>
          </nav>

          <div className="mb-10">
            <p className="text-gold text-xs tracking-widest uppercase mb-2">
              {meta.icon} {meta.label} · {ageLabel}
            </p>
            <h1
              className="text-3xl md:text-4xl font-bold text-white mb-4"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              {meta.label} Stories for Ages {params.range}
            </h1>
            <p className="text-gray-400 max-w-2xl leading-relaxed mb-5">
              {stories.length} {meta.label.toLowerCase()}{" "}
              {stories.length === 1 ? "story" : "stories"} for{" "}
              <strong className="text-gray-200">{tierLabel}</strong> (ages {params.range}) —
              drawn from the Quran and Prophet traditions, with age-appropriate language and
              pacing designed for Muslim children.
            </p>

            <div className="flex gap-2 flex-wrap">
              <Link
                href={`/${params.category}`}
                className="text-xs px-3 py-1.5 rounded-full border border-gray-600 text-gray-400 hover:border-gold/40 hover:text-gold transition-colors"
              >
                All ages ({allCategoryStories.length} stories)
              </Link>
              {otherAges.map((range) => {
                const count = allCategoryStories.filter(
                  (s) => s.age_range === range
                ).length;
                if (count === 0) return null;
                return (
                  <Link
                    key={range}
                    href={`/${params.category}/ages/${range}`}
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

          <div className="mt-16 bg-navy-lighter rounded-2xl border border-gray-700/30 p-8 text-center">
            <p className="text-gray-400 text-sm mb-4">
              All {allCategoryStories.length}+ {meta.label.toLowerCase()} stories are completely free — no account needed.
            </p>
            <Link
              href={`/${params.category}`}
              className="inline-block text-gold hover:underline text-sm mr-6"
            >
              ← All {meta.label} stories
            </Link>
            <Link
              href="/donate"
              className="inline-block bg-gold text-navy font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-gold-light transition-colors"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              ❤️ Support NoorBedtime — It&apos;s Free Forever
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
