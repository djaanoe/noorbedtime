import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllThemes,
  getStoriesByTheme,
  themeToSlug,
  themeToLabel,
} from "@/lib/stories";
import StoryCard from "@/components/StoryCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Props {
  params: { theme: string };
}

export function generateStaticParams() {
  return getAllThemes().map((t) => ({ theme: themeToSlug(t) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const label = themeToLabel(params.theme);
  return {
    title: `Islamic Stories About ${label} for Kids`,
    description: `Discover NoorBedtime's Islamic bedtime stories about ${label.toLowerCase()} for Muslim children aged 3-12. Scholar-validated tales from the Quran and Prophet traditions.`,
    alternates: { canonical: `https://noorbedtime.com/themes/${params.theme}` },
    openGraph: {
      title: `Islamic Stories About ${label} for Kids — NoorBedtime`,
      description: `Beautiful Islamic stories teaching ${label.toLowerCase()} to Muslim children.`,
    },
  };
}

export default function ThemePage({ params }: Props) {
  const stories = getStoriesByTheme(params.theme);
  if (stories.length === 0) notFound();

  const label = themeToLabel(params.theme);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Islamic Stories About ${label} for Kids`,
    description: `Islamic bedtime stories teaching ${label.toLowerCase()} to Muslim children`,
    url: `https://noorbedtime.com/themes/${params.theme}`,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://noorbedtime.com" },
        { "@type": "ListItem", position: 2, name: "Library", item: "https://noorbedtime.com/library" },
        { "@type": "ListItem", position: 3, name: label, item: `https://noorbedtime.com/themes/${params.theme}` },
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
            <span className="text-gray-400">{label}</span>
          </nav>

          <div className="mb-10">
            <p className="text-gold text-xs tracking-widest uppercase mb-2">Theme</p>
            <h1
              className="text-3xl md:text-4xl font-bold text-white mb-4"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              Islamic Stories About {label}
            </h1>
            <p className="text-gray-400 max-w-2xl leading-relaxed">
              {stories.length} {stories.length === 1 ? "story" : "stories"} teaching{" "}
              {label.toLowerCase()} — drawn from the Quran and the traditions of the
              Prophet ﷺ, validated by Islamic scholars. Perfect for Muslim children
              aged 3–12.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {stories.map((story) => (
              <StoryCard key={story.slug} story={story} />
            ))}
          </div>

          <div className="mt-16 bg-navy-lighter rounded-2xl border border-gray-700/30 p-8 text-center">
            <p className="text-gray-400 text-sm mb-4">
              All 50+ Islamic bedtime stories are free — explore every value and theme with no account needed.
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
