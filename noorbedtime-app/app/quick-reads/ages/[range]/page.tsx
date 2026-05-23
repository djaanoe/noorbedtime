import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getStoriesByReadingTime } from "@/lib/stories";
import { Story } from "@/types";
import StoryCard from "@/components/StoryCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Props {
  params: { range: string };
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
  return [{ range: "3-5" }, { range: "6-8" }, { range: "9-12" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const label = RANGE_LABELS[params.range];
  if (!label) return {};
  return {
    title: `Quick Islamic Stories for Ages ${params.range} — 10 Min or Less`,
    description: `Short Islamic bedtime stories for Muslim children aged ${params.range} that take 10 minutes or less. Perfect for busy weeknights — free, no account needed.`,
    alternates: { canonical: `https://noorbedtime.com/quick-reads/ages/${params.range}` },
  };
}

export default function QuickReadsAgePage({ params }: Props) {
  const tier = RANGE_TO_TIER[params.range];
  const label = RANGE_LABELS[params.range];
  if (!tier || !label) notFound();

  const stories = getStoriesByReadingTime(1, 10).filter((s) => s.age_tier === tier);
  if (stories.length === 0) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Quick Islamic Stories for Ages ${params.range}`,
    description: `Short Islamic bedtime stories for Muslim children aged ${params.range}, 10 minutes or less`,
    url: `https://noorbedtime.com/quick-reads/ages/${params.range}`,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://noorbedtime.com" },
        { "@type": "ListItem", position: 2, name: "Quick Reads", item: "https://noorbedtime.com/quick-reads" },
        { "@type": "ListItem", position: 3, name: `Ages ${params.range}`, item: `https://noorbedtime.com/quick-reads/ages/${params.range}` },
      ],
    },
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
            <Link href="/quick-reads" className="hover:text-gold transition-colors">Quick Reads</Link>
            <span>›</span>
            <span className="text-gray-400">Ages {params.range}</span>
          </nav>

          <div className="mb-10">
            <p className="text-teal text-xs tracking-widest uppercase mb-2">⚡ {label} · Quick Reads</p>
            <h1
              className="text-3xl md:text-4xl font-bold text-white mb-4"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              Quick Islamic Stories for Ages {params.range}
            </h1>
            <p className="text-gray-400 max-w-2xl leading-relaxed">
              {stories.length} short Islamic {label.toLowerCase()} stories — each 10 minutes or less. Perfect for busy weeknights, quick naptime reads, or whenever your child wants a fast Islamic story. All completely free, no account needed.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {stories.map((story) => (
              <StoryCard key={story.slug} story={story} />
            ))}
          </div>

          <div className="mt-12 bg-navy-lighter rounded-2xl border border-gray-700/30 p-8 text-center">
            <p className="text-gray-400 text-sm mb-4">
              Want longer stories? Browse our 15-minute bedtime reads or the full {label} collection.
            </p>
            <Link
              href={`/bedtime-reads/ages/${params.range}`}
              className="inline-block text-gold hover:underline text-sm mr-6"
            >
              15-Min Reads for Ages {params.range} →
            </Link>
            <Link
              href={`/ages/${params.range}`}
              className="inline-block bg-gold text-navy font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-gold-light transition-colors"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              All {label} Stories →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
