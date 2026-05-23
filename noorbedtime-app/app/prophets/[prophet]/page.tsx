import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllProphets, PROPHETS } from "@/lib/prophets";
import { getStoriesByProphet, themeToSlug, themeToLabel } from "@/lib/stories";
import StoryCard from "@/components/StoryCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Props {
  params: { prophet: string };
}

export function generateStaticParams() {
  return getAllProphets().map((p) => ({ prophet: p }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const meta = PROPHETS[params.prophet];
  if (!meta) return {};
  return {
    title: meta.title,
    description: meta.metaDescription,
    alternates: { canonical: `https://noorbedtime.com/prophets/${params.prophet}` },
    openGraph: {
      title: `${meta.name} — Islamic Stories for Muslim Children`,
      description: meta.metaDescription,
    },
  };
}

export default function ProphetPage({ params }: Props) {
  const meta = PROPHETS[params.prophet];
  if (!meta) notFound();

  const stories = getStoriesByProphet(params.prophet);

  const otherProphets = getAllProphets()
    .filter((p) => p !== params.prophet)
    .slice(0, 4);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Person",
      name: meta.name,
      description: meta.bio.slice(0, 200),
      url: `https://noorbedtime.com/prophets/${params.prophet}`,
      knowsAbout: meta.themes.map((t) => themeToLabel(t)),
    },
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: meta.title,
      description: meta.metaDescription,
      url: `https://noorbedtime.com/prophets/${params.prophet}`,
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://noorbedtime.com" },
          { "@type": "ListItem", position: 2, name: "Prophet Stories", item: "https://noorbedtime.com/prophet-stories" },
          { "@type": "ListItem", position: 3, name: meta.name, item: `https://noorbedtime.com/prophets/${params.prophet}` },
        ],
      },
      ...(stories.length > 0
        ? {
            hasPart: stories.map((s) => ({
              "@type": "Book",
              name: s.title,
              url: `https://noorbedtime.com/story/${s.slug}`,
            })),
          }
        : {}),
    },
  ];

  const bioParagraphs = meta.bio.split("\n\n").filter(Boolean);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main className="min-h-screen bg-navy">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <nav className="text-xs text-gray-500 mb-8 flex items-center gap-2">
            <Link href="/" className="hover:text-gold transition-colors">Home</Link>
            <span>›</span>
            <Link href="/prophet-stories" className="hover:text-gold transition-colors">
              Prophet Stories
            </Link>
            <span>›</span>
            <span className="text-gray-400">{meta.name}</span>
          </nav>

          <div className="mb-10">
            <p className="text-gold text-xs tracking-widest uppercase mb-2">✨ Prophet</p>
            <h1
              className="text-3xl md:text-4xl font-bold text-white mb-1"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              {meta.name}
            </h1>
            <p className="text-gold/60 text-lg mb-3" dir="rtl" lang="ar">
              {meta.arabicName}
            </p>
            <p className="text-gray-500 text-xs mb-6">{meta.quranicReference}</p>

            <div className="flex flex-wrap gap-2 mb-8">
              {meta.themes.map((theme) => (
                <Link
                  key={theme}
                  href={`/themes/${themeToSlug(theme)}`}
                  className="text-xs px-3 py-1 rounded-full bg-gold/10 text-gold/80 border border-gold/20 hover:bg-gold/20 transition-colors"
                >
                  {themeToLabel(theme)}
                </Link>
              ))}
            </div>
          </div>

          {/* Bio */}
          <div className="prose prose-invert max-w-none mb-12">
            <div className="space-y-5">
              {bioParagraphs.map((para, i) => (
                <p key={i} className="text-gray-300 leading-relaxed">
                  {para}
                </p>
              ))}
            </div>
          </div>

          {/* Stories */}
          {stories.length > 0 && (
            <div className="mb-12">
              <h2
                className="text-xl font-bold text-white mb-2"
                style={{ fontFamily: "Outfit, sans-serif" }}
              >
                NoorBedtime Stories About {meta.name}
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                {stories.length} {stories.length === 1 ? "story" : "stories"} — age-appropriate
                and scholar-validated
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {stories.map((story) => (
                  <StoryCard key={story.slug} story={story} />
                ))}
              </div>
            </div>
          )}

          {/* Other prophets */}
          <div className="mb-12">
            <h2
              className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-4"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              More Prophet Stories
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {otherProphets.map((prophetSlug) => {
                const p = PROPHETS[prophetSlug];
                return (
                  <Link
                    key={prophetSlug}
                    href={`/prophets/${prophetSlug}`}
                    className="bg-navy-lighter rounded-xl p-4 border border-gray-700/30 hover:border-gold/30 transition-colors"
                  >
                    <div className="text-sm font-semibold text-gray-200 mb-1">{p.name}</div>
                    <div className="text-xs text-gold/60" dir="rtl" lang="ar">{p.arabicName}</div>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="bg-navy-lighter rounded-2xl border border-gray-700/30 p-8 text-center">
            <p className="text-gray-400 text-sm mb-4">
              All 50+ Islamic bedtime stories are completely free — prophet tales, Quran stories, and more.
            </p>
            <Link
              href="/prophet-stories"
              className="inline-block text-gold hover:underline text-sm mr-6"
            >
              ← All Prophet Stories
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
