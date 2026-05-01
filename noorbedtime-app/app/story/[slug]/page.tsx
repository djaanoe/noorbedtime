import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getAllStories, getStoryBySlug, AGE_TIER_LABELS, AGE_TIER_RANGES } from "@/lib/stories";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const stories = getAllStories();
  return stories.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const story = getStoryBySlug(slug);
  if (!story) return {};
  return {
    title: story.title,
    description: story.description,
    alternates: { canonical: `https://noorbedtime.com/story/${slug}` },
    openGraph: {
      title: story.title,
      description: story.description,
      type: "article",
      images: [{ url: `/illustrations/${slug}/page-00.webp`, width: 1200, height: 800 }],
    },
  };
}

export default async function StoryPage({ params }: Props) {
  const { slug } = await params;
  const story = getStoryBySlug(slug);
  if (!story) notFound();

  const previewPages = story.pages.slice(0, 2);

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "Book",
      name: story.title,
      description: story.description,
      genre: "Children's Story",
      audience: { "@type": "Audience", audienceType: `Children ${story.age_range}` },
      about: story.theme,
      citation: story.source_reference,
      url: `https://noorbedtime.com/story/${slug}`,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://noorbedtime.com" },
        { "@type": "ListItem", position: 2, name: "Library", item: "https://noorbedtime.com/library" },
        { "@type": "ListItem", position: 3, name: story.title, item: `https://noorbedtime.com/story/${slug}` },
      ],
    },
  ];

  return (
    <>
      <Navbar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <main className="pt-20 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="text-xs text-gray-500 mb-6 flex items-center gap-2">
            <Link href="/library" className="hover:text-gold transition-colors">Library</Link>
            <span>/</span>
            <span className="text-gray-300">{story.title}</span>
          </nav>

          <div className="grid md:grid-cols-[280px_1fr] gap-8">
            {/* Cover */}
            <div>
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-navy-lighter border border-gray-700/30">
                <Image
                  src={`/illustrations/${slug}/page-00.webp`}
                  alt={story.title}
                  fill
                  className="object-cover"
                  priority
                />
                {story.is_free && (
                  <div className="absolute top-3 left-3 bg-teal text-white text-xs font-bold px-3 py-1 rounded-full">
                    FREE
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="bg-gold/20 text-gold text-xs font-bold px-3 py-1 rounded-full">
                  {AGE_TIER_LABELS[story.age_tier]}
                </span>
                <span className="bg-navy-lighter text-gray-400 text-xs px-3 py-1 rounded-full border border-gray-700">
                  {AGE_TIER_RANGES[story.age_tier]}
                </span>
                <span className="bg-navy-lighter text-gray-400 text-xs px-3 py-1 rounded-full border border-gray-700">
                  {story.reading_time_minutes} min read
                </span>
              </div>

              <h1 className="text-2xl md:text-3xl font-bold mb-3" style={{ fontFamily: "Outfit, sans-serif" }}>
                {story.title}
              </h1>
              <p className="text-gray-400 mb-4 leading-relaxed">{story.description}</p>

              <div className="bg-navy-lighter rounded-xl p-4 border border-gray-700/30 mb-6">
                <div className="flex items-start gap-3">
                  <span className="text-gold text-lg">📖</span>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Islamic Source</p>
                    <p className="text-sm font-semibold text-gold">{story.source_reference}</p>
                    {story.source_detail && (
                      <p className="text-xs text-gray-400 mt-1 italic">{story.source_detail}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                {story.is_free ? (
                  <Link
                    href={`/read/${slug}`}
                    className="flex-1 bg-gold text-navy font-bold text-center py-3 rounded-xl hover:bg-gold-light transition-colors"
                    style={{ fontFamily: "Outfit, sans-serif" }}
                  >
                    Read Free Story →
                  </Link>
                ) : (
                  <Link
                    href="/credits"
                    className="flex-1 cta-glow bg-gold text-navy font-bold text-center py-3 rounded-xl hover:bg-gold-light transition-colors"
                    style={{ fontFamily: "Outfit, sans-serif" }}
                  >
                    Unlock All Stories — $4.99
                  </Link>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>Theme: <span className="text-gray-300 capitalize">{story.theme}</span></span>
                <span>·</span>
                <span>{story.pages.length} pages</span>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="mt-12">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ fontFamily: "Outfit, sans-serif" }}>
              <span className="text-gold">✨</span> Preview — First 2 Pages
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {previewPages.map((page) => (
                <div
                  key={page.page_number}
                  className="bg-navy-lighter rounded-xl overflow-hidden border border-gray-700/30"
                >
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={`/illustrations/${slug}/page-${String(page.page_number).padStart(2, "0")}.webp`}
                      alt={`Page ${page.page_number}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-300 leading-relaxed">{page.text}</p>
                  </div>
                </div>
              ))}
            </div>
            {!story.is_free && (
              <div className="mt-4 text-center py-8 border border-dashed border-gray-700 rounded-xl">
                <p className="text-gray-500 text-sm mb-3">Unlock all 50+ stories for a one-time payment</p>
                <Link
                  href="/credits"
                  className="inline-block cta-glow bg-gold text-navy font-bold px-6 py-2.5 rounded-xl hover:bg-gold-light transition-colors text-sm"
                >
                  Get Lifetime Access — $4.99
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
