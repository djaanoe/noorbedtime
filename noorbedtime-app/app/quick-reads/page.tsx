import { Metadata } from "next";
import Link from "next/link";
import { getStoriesByReadingTime, CATEGORIES } from "@/lib/stories";
import StoryCard from "@/components/StoryCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Quick Islamic Bedtime Stories — 10 Minutes or Less",
  description:
    "Short Islamic bedtime stories for Muslim children that take just 10 minutes to read. Perfect for busy weeknights. All free, no account needed.",
  alternates: { canonical: "https://noorbedtime.com/quick-reads" },
};

export default function QuickReadsPage() {
  const stories = getStoriesByReadingTime(1, 10);
  const ageRanges = ["3-5", "6-8", "9-12"];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Quick Islamic Bedtime Stories — 10 Minutes or Less",
    description: "Short Islamic bedtime stories for Muslim children, 10 minutes or less",
    url: "https://noorbedtime.com/quick-reads",
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://noorbedtime.com" },
        { "@type": "ListItem", position: 2, name: "Library", item: "https://noorbedtime.com/library" },
        { "@type": "ListItem", position: 3, name: "Quick Reads", item: "https://noorbedtime.com/quick-reads" },
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
            <span className="text-gray-400">Quick Reads</span>
          </nav>

          <div className="mb-10">
            <p className="text-teal text-xs tracking-widest uppercase mb-2">⚡ Short Stories</p>
            <h1
              className="text-3xl md:text-4xl font-bold text-white mb-4"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              Quick Islamic Bedtime Stories
            </h1>
            <p className="text-gray-400 max-w-2xl leading-relaxed mb-5">
              {stories.length} short Islamic stories that take 10 minutes or less to read — perfect for busy weeknights, naptime, or when little ones need a quick story before bed. All drawn from the Quran and Prophet traditions, all completely free.
            </p>

            <div className="flex flex-wrap gap-2">
              {ageRanges.map((range) => (
                <Link
                  key={range}
                  href={`/quick-reads/ages/${range}`}
                  className="text-xs px-3 py-1.5 rounded-full border border-teal/40 text-teal/80 hover:bg-teal/10 hover:text-teal transition-colors"
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
              Want longer stories? Check out our full library or 15-minute bedtime reads.
            </p>
            <Link
              href="/bedtime-reads"
              className="inline-block text-gold hover:underline text-sm mr-6"
            >
              15-Minute Bedtime Reads →
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
