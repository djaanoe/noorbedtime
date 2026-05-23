import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getStoriesByTier, AGE_TIER_LABELS, CATEGORIES } from "@/lib/stories";
import StoryCard from "@/components/StoryCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Story } from "@/types";

const RANGE_TO_TIER: Record<string, Story["age_tier"]> = {
  "3-5": "little_stars",
  "6-8": "rising_moons",
  "9-12": "young_explorers",
};

const AGE_DESCRIPTIONS: Record<string, string> = {
  "3-5":
    "Short, joyful stories with big lessons — perfect for little ones at bedtime. Each tale is simple, visual, and rooted in Islamic values your toddler can understand.",
  "6-8":
    "Engaging stories with deeper themes for growing readers. Ideal for reading together or independently, building your child's connection to Islam through relatable characters.",
  "9-12":
    "Thoughtful stories exploring justice, wisdom, and trust in Allah — perfect for preteens building their Islamic identity and moral reasoning.",
};

interface Props {
  params: { range: string };
}

export function generateStaticParams() {
  return [{ range: "3-5" }, { range: "6-8" }, { range: "9-12" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tier = RANGE_TO_TIER[params.range];
  if (!tier) return {};
  const label = AGE_TIER_LABELS[tier];
  return {
    title: `Islamic Bedtime Stories for Ages ${params.range} — ${label}`,
    description: `Beautiful Islamic bedtime stories for Muslim children aged ${params.range}. The ${label} collection features scholar-validated tales from the Quran and Prophet traditions.`,
    alternates: { canonical: `https://noorbedtime.com/ages/${params.range}` },
    openGraph: {
      title: `Islamic Stories for Ages ${params.range} — NoorBedtime`,
      description: `${label} collection: Islamic bedtime stories for Muslim children aged ${params.range}.`,
    },
  };
}

export default function AgePage({ params }: Props) {
  const tier = RANGE_TO_TIER[params.range];
  if (!tier) notFound();

  const stories = getStoriesByTier(tier);
  const label = AGE_TIER_LABELS[tier];
  const description = AGE_DESCRIPTIONS[params.range];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Islamic Bedtime Stories for Ages ${params.range}`,
    description,
    url: `https://noorbedtime.com/ages/${params.range}`,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://noorbedtime.com" },
        { "@type": "ListItem", position: 2, name: "Library", item: "https://noorbedtime.com/library" },
        { "@type": "ListItem", position: 3, name: `Ages ${params.range}`, item: `https://noorbedtime.com/ages/${params.range}` },
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
            <span className="text-gray-400">Ages {params.range}</span>
          </nav>

          <div className="mb-10">
            <p className="text-teal text-xs tracking-widest uppercase mb-2">{label}</p>
            <h1
              className="text-3xl md:text-4xl font-bold text-white mb-4"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              Islamic Bedtime Stories for Ages {params.range}
            </h1>
            <p className="text-gray-400 max-w-2xl leading-relaxed">{description}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {stories.map((story) => (
              <StoryCard key={story.slug} story={story} />
            ))}
          </div>

          {/* Browse by category for this age */}
          <div className="mt-12 mb-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-4">
              Browse {label} Stories by Category
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {Object.entries(CATEGORIES).map(([slug, cat]) => (
                <Link
                  key={slug}
                  href={`/${slug}/ages/${params.range}`}
                  className="bg-navy-lighter rounded-xl p-3 border border-gray-700/30 hover:border-gold/30 transition-colors"
                >
                  <div className="text-lg mb-1">{cat.icon}</div>
                  <div className="text-xs font-semibold text-gray-300">{cat.label}</div>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-6 bg-navy-lighter rounded-2xl border border-gray-700/30 p-8 text-center">
            <p className="text-gray-400 text-sm mb-4">
              All {stories.length}+ stories in the {label} collection are completely free — no account needed.
            </p>
            <Link
              href="/library"
              className="inline-block text-gold hover:underline text-sm mr-6"
            >
              ← Browse all stories
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
