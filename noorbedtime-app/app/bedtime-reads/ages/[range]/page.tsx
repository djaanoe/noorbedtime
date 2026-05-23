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
    title: `15-Minute Islamic Stories for Ages ${params.range} — Perfect Bedtime`,
    description: `Islamic bedtime stories for Muslim children aged ${params.range} at the perfect 15-minute length. Ideal for a nightly bedtime routine — free, no account needed.`,
    alternates: { canonical: `https://noorbedtime.com/bedtime-reads/ages/${params.range}` },
  };
}

export default function BedtimeReadsAgePage({ params }: Props) {
  const tier = RANGE_TO_TIER[params.range];
  const label = RANGE_LABELS[params.range];
  if (!tier || !label) notFound();

  const stories = getStoriesByReadingTime(11, 15).filter((s) => s.age_tier === tier);
  if (stories.length === 0) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `15-Minute Islamic Stories for Ages ${params.range}`,
    description: `Islamic bedtime stories for Muslim children aged ${params.range} at the ideal 15-minute bedtime length`,
    url: `https://noorbedtime.com/bedtime-reads/ages/${params.range}`,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://noorbedtime.com" },
        { "@type": "ListItem", position: 2, name: "Bedtime Reads", item: "https://noorbedtime.com/bedtime-reads" },
        { "@type": "ListItem", position: 3, name: `Ages ${params.range}`, item: `https://noorbedtime.com/bedtime-reads/ages/${params.range}` },
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
      <main className="pt-20 min-h-screen bg-navy">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <nav className="text-xs text-gray-500 mb-8 flex items-center gap-2">
            <Link href="/" className="hover:text-gold transition-colors">Home</Link>
            <span>›</span>
            <Link href="/bedtime-reads" className="hover:text-gold transition-colors">Bedtime Reads</Link>
            <span>›</span>
            <span className="text-gray-400">Ages {params.range}</span>
          </nav>

          <div className="mb-10">
            <p className="text-gold text-xs tracking-widest uppercase mb-2">🌙 {label} · 15-Minute Reads</p>
            <h1
              className="text-3xl md:text-4xl font-bold text-white mb-4"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              Bedtime Islamic Stories for Ages {params.range}
            </h1>
            <p className="text-gray-400 max-w-2xl leading-relaxed">
              {stories.length} Islamic {label.toLowerCase()} stories at the perfect bedtime length — about 15 minutes each. Immersive enough to transport your child, calming enough to ease them into sleep. All drawn from the Quran and Prophet traditions, all completely free.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {stories.map((story) => (
              <StoryCard key={story.slug} story={story} />
            ))}
          </div>

          <div className="mt-12 bg-navy-lighter rounded-2xl border border-gray-700/30 p-8 text-center">
            <p className="text-gray-400 text-sm mb-4">
              Browse shorter stories or the full {label} collection.
            </p>
            <Link
              href={`/quick-reads/ages/${params.range}`}
              className="inline-block text-gold hover:underline text-sm mr-6"
            >
              Quick Reads for Ages {params.range} →
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
