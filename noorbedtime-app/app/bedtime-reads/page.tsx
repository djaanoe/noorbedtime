import { Metadata } from "next";
import Link from "next/link";
import { getStoriesByReadingTime, CATEGORIES } from "@/lib/stories";
import StoryCard from "@/components/StoryCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Islamic Bedtime Stories — 15 Minutes (Perfect Length)",
  description:
    "Islamic bedtime stories for Muslim children that take exactly 15 minutes — the perfect length for a bedtime routine. All free, no account needed.",
  alternates: { canonical: "https://noorbedtime.com/bedtime-reads" },
};

export default function BedtimeReadsPage() {
  const stories = getStoriesByReadingTime(11, 15);
  const ageRanges = ["3-5", "6-8", "9-12"];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Islamic Bedtime Stories — 15 Minutes (Perfect Length)",
    description: "Islamic bedtime stories for Muslim children, 15-minute perfect bedtime length",
    url: "https://noorbedtime.com/bedtime-reads",
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://noorbedtime.com" },
        { "@type": "ListItem", position: 2, name: "Library", item: "https://noorbedtime.com/library" },
        { "@type": "ListItem", position: 3, name: "Bedtime Reads", item: "https://noorbedtime.com/bedtime-reads" },
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
            <Link href="/library" className="hover:text-gold transition-colors">Library</Link>
            <span>›</span>
            <span className="text-gray-400">Bedtime Reads</span>
          </nav>

          <div className="mb-10">
            <p className="text-gold text-xs tracking-widest uppercase mb-2">🌙 Perfect Bedtime Length</p>
            <h1
              className="text-3xl md:text-4xl font-bold text-white mb-4"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              Ideal Islamic Bedtime Stories
            </h1>
            <p className="text-gray-400 max-w-2xl leading-relaxed mb-5">
              {stories.length} Islamic stories at the perfect bedtime length — about 15 minutes each. Long enough to be immersive and meaningful, short enough to keep little ones engaged until they drift off to sleep. All drawn from the Quran and Prophet traditions.
            </p>

            <div className="flex flex-wrap gap-2">
              {ageRanges.map((range) => (
                <Link
                  key={range}
                  href={`/bedtime-reads/ages/${range}`}
                  className="text-xs px-3 py-1.5 rounded-full border border-gold/40 text-gold/80 hover:bg-gold/10 hover:text-gold transition-colors"
                >
                  Ages {range}
                </Link>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {stories.map((story) => (
              <StoryCard key={story.slug} story={story} />
            ))}
          </div>

          <div className="mt-12 mb-6">
            <h2
              className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-4"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              Browse by Category
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {Object.entries(CATEGORIES).map(([slug, cat]) => (
                <Link
                  key={slug}
                  href={`/${slug}`}
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
              Need something shorter? Check out our quick reads, or browse the full library.
            </p>
            <Link
              href="/quick-reads"
              className="inline-block text-gold hover:underline text-sm mr-6"
            >
              ← Quick Reads (10 min)
            </Link>
            <Link
              href="/library"
              className="inline-block bg-gold text-navy font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-gold-light transition-colors"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              Browse Full Library →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
