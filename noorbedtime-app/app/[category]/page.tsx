import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllCategories,
  getStoriesByCategory,
  CATEGORIES,
  AGE_TIER_LABELS,
  AGE_TIER_RANGES,
} from "@/lib/stories";
import StoryCard from "@/components/StoryCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Props {
  params: { category: string };
}

export function generateStaticParams() {
  return getAllCategories().map((c) => ({ category: c }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const meta = CATEGORIES[params.category];
  if (!meta) return {};
  return {
    title: `${meta.label} Islamic Stories for Muslim Kids`,
    description: meta.description,
    alternates: { canonical: `https://noorbedtime.com/${params.category}` },
    openGraph: {
      title: `${meta.label} Islamic Stories — NoorBedtime`,
      description: meta.description,
    },
  };
}

export default function CategoryPage({ params }: Props) {
  const meta = CATEGORIES[params.category];
  if (!meta) notFound();

  const stories = getStoriesByCategory(params.category);
  if (stories.length === 0) notFound();

  const ageRanges = ["3-5", "6-8", "9-12"] as const;
  const ageLabels: Record<string, string> = {
    "3-5": AGE_TIER_LABELS["little_stars"],
    "6-8": AGE_TIER_LABELS["rising_moons"],
    "9-12": AGE_TIER_LABELS["young_explorers"],
  };

  const relatedCategories = Object.entries(CATEGORIES)
    .filter(([slug]) => slug !== params.category)
    .slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${meta.label} Islamic Stories for Muslim Kids`,
    description: meta.description,
    url: `https://noorbedtime.com/${params.category}`,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://noorbedtime.com" },
        { "@type": "ListItem", position: 2, name: "Library", item: "https://noorbedtime.com/library" },
        { "@type": "ListItem", position: 3, name: meta.label, item: `https://noorbedtime.com/${params.category}` },
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
          <nav className="text-xs text-gray-500 mb-8 flex items-center gap-2">
            <Link href="/" className="hover:text-gold transition-colors">Home</Link>
            <span>›</span>
            <Link href="/library" className="hover:text-gold transition-colors">Library</Link>
            <span>›</span>
            <span className="text-gray-400">{meta.label}</span>
          </nav>

          <div className="mb-10">
            <p className="text-gold text-xs tracking-widest uppercase mb-2">
              {meta.icon} Category
            </p>
            <h1
              className="text-3xl md:text-4xl font-bold text-white mb-4"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              {meta.label} Stories for Muslim Kids
            </h1>
            <p className="text-gray-400 max-w-2xl leading-relaxed mb-6">{meta.intro}</p>

            <div className="flex flex-wrap gap-2">
              {ageRanges.map((range) => {
                const count = stories.filter(
                  (s) => s.age_range === range
                ).length;
                if (count === 0) return null;
                return (
                  <Link
                    key={range}
                    href={`/${params.category}/ages/${range}`}
                    className="text-xs px-3 py-1.5 rounded-full border border-gold/40 text-gold/80 hover:bg-gold/10 hover:text-gold transition-colors"
                  >
                    {ageLabels[range]} (Ages {range}) — {count} {count === 1 ? "story" : "stories"}
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

          {/* Related categories */}
          <div className="mt-16">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-4">
              Explore More Story Collections
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {relatedCategories.map(([slug, cat]) => (
                <Link
                  key={slug}
                  href={`/${slug}`}
                  className="bg-navy-lighter rounded-xl p-4 border border-gray-700/30 hover:border-gold/30 transition-colors"
                >
                  <div className="text-xl mb-1">{cat.icon}</div>
                  <div className="text-sm font-semibold text-gray-200">{cat.label}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{cat.description.slice(0, 50)}…</div>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-10 bg-navy-lighter rounded-2xl border border-gray-700/30 p-8 text-center">
            <p className="text-gray-400 text-sm mb-4">
              Explore all 50+ Islamic bedtime stories across 5 categories and 27 values.
            </p>
            <Link
              href="/library"
              className="inline-block text-gold hover:underline text-sm mr-6"
            >
              ← Browse all stories
            </Link>
            <Link
              href="/credits"
              className="inline-block bg-gold text-navy font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-gold-light transition-colors"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              Unlock All Stories — $4.99
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
