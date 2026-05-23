import { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StoryCard from "@/components/StoryCard";
import { getAllStories, CATEGORIES } from "@/lib/stories";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "NoorBedtime — Islamic Bedtime Stories for Muslim Kids | Quran & Prophet Tales",
  description:
    "Beautiful bedtime stories for Muslim children aged 3-12. Scholar-validated tales inspired by the Quran and Prophet traditions. All 50+ stories free — start reading tonight.",
  alternates: { canonical: "https://noorbedtime.com" },
  other: {
    "application/ld+json": JSON.stringify([
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "NoorBedtime",
        url: "https://noorbedtime.com",
        description: "Beautiful Islamic bedtime stories for Muslim children aged 3-12",
        potentialAction: {
          "@type": "SearchAction",
          target: "https://noorbedtime.com/library?q={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "What are Islamic bedtime stories for kids?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Islamic bedtime stories are short, gentle tales inspired by the Quran, Prophet traditions (Hadith), and Islamic history. They help Muslim children learn values like gratitude, patience, and kindness through the lives of prophets and companions.",
            },
          },
          {
            "@type": "Question",
            name: "How much does NoorBedtime cost?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "NoorBedtime is completely free. All 50+ stories are available to every family — no account needed, no payment required.",
            },
          },
          {
            "@type": "Question",
            name: "Are the stories appropriate for young children?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. Stories are organized by age tier: Little Stars (ages 3–5), Rising Moons (ages 6–8), and Young Explorers (ages 9–12). Each tier uses age-appropriate language, pacing, and themes.",
            },
          },
          {
            "@type": "Question",
            name: "Are the stories Islamically accurate?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Every story cites its Quranic or Hadith source and has been reviewed for Islamic accuracy. Illustrations follow respectful Islamic art traditions — no faces of prophets are depicted.",
            },
          },
          {
            "@type": "Question",
            name: "What devices can I use NoorBedtime on?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "NoorBedtime works on any device with a web browser — phones, tablets, and computers. No app download required.",
            },
          },
        ],
      },
    ]),
  },
};

export default function HomePage() {
  const allStories = getAllStories();
  const blogPosts = getAllPosts().slice(0, 3);

  const littleStars = allStories.filter((s) => s.age_tier === "little_stars").slice(0, 5);
  const risingMoons = allStories.filter((s) => s.age_tier === "rising_moons").slice(0, 5);
  const youngExplorers = allStories.filter((s) => s.age_tier === "young_explorers").slice(0, 5);

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <header className="relative pt-20 pb-10 px-4 overflow-hidden geo-pattern">
          <div className="absolute top-16 right-10 md:right-20 opacity-50 animate-float">
            <svg width="40" height="40" viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="40" fill="#D4A853" opacity=".9" />
              <circle cx="65" cy="40" r="35" fill="#0F1B2D" />
            </svg>
          </div>
          <div className="relative z-10 max-w-5xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-3" style={{ fontFamily: "Outfit, sans-serif" }}>
              Islamic Bedtime Stories<br />
              <span className="text-gold">Your Children Will Love</span>
            </h1>
            <p className="text-base md:text-lg text-gray-300 max-w-xl mx-auto mb-5">
              50+ illustrated stories from the Quran &amp; Prophetic traditions. Each story teaches a beautiful Islamic value. All free, always.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-400 mb-2">
              <span className="flex items-center gap-1"><span className="text-gold">★</span> 50+ Stories</span>
              <span className="flex items-center gap-1"><span className="text-teal">●</span> Ages 3-12</span>
              <span className="flex items-center gap-1"><span className="text-gold">✓</span> Scholar Validated</span>
              <span className="flex items-center gap-1"><span className="text-teal">♥</span> 100% Free</span>
            </div>
          </div>
        </header>

        {/* Story Library */}
        <section className="py-8 md:py-12 px-4" id="library">
          <div className="max-w-6xl mx-auto">

            {/* Little Stars */}
            <div className="mb-8">
              <h2 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2" style={{ fontFamily: "Outfit, sans-serif" }}>
                <span className="text-amber-300">⭐</span> Little Stars{" "}
                <span className="text-gray-500 text-sm font-normal">Ages 3-5</span>
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {littleStars.map((story) => (
                  <StoryCard key={story.slug} story={story} />
                ))}
              </div>
              <div className="mt-3 text-right">
                <Link href="/ages/3-5" className="text-gold/70 text-xs hover:text-gold transition-colors">
                  See all Little Stars stories →
                </Link>
              </div>
            </div>

            {/* Rising Moons */}
            <div className="mb-8">
              <h2 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2" style={{ fontFamily: "Outfit, sans-serif" }}>
                <span className="text-teal">🌙</span> Rising Moons{" "}
                <span className="text-gray-500 text-sm font-normal">Ages 6-8</span>
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {risingMoons.map((story) => (
                  <StoryCard key={story.slug} story={story} />
                ))}
              </div>
              <div className="mt-3 text-right">
                <Link href="/ages/6-8" className="text-teal/70 text-xs hover:text-teal transition-colors">
                  See all Rising Moons stories →
                </Link>
              </div>
            </div>

            {/* Young Explorers */}
            <div className="mb-8">
              <h2 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2" style={{ fontFamily: "Outfit, sans-serif" }}>
                <span className="text-lavender">🦋</span> Young Explorers{" "}
                <span className="text-gray-500 text-sm font-normal">Ages 9-12</span>
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {youngExplorers.map((story) => (
                  <StoryCard key={story.slug} story={story} />
                ))}
              </div>
              <div className="mt-3 text-right">
                <Link href="/ages/9-12" className="text-lavender/70 text-xs hover:text-lavender transition-colors">
                  See all Young Explorers stories →
                </Link>
              </div>
            </div>

            {/* Browse by Category */}
            <div className="mt-10 mb-4">
              <h2 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2" style={{ fontFamily: "Outfit, sans-serif" }}>
                <span className="text-gold">🗂</span> Browse by Category
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {Object.entries(CATEGORIES).map(([slug, cat]) => (
                  <Link
                    key={slug}
                    href={`/${slug}`}
                    className="bg-navy-lighter rounded-xl p-4 border border-gray-700/30 hover:border-gold/40 transition-colors group"
                  >
                    <div className="text-2xl mb-2">{cat.icon}</div>
                    <div className="text-sm font-semibold text-gray-200 group-hover:text-gold transition-colors" style={{ fontFamily: "Outfit, sans-serif" }}>
                      {cat.label}
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Browse by Prophet */}
            <div className="mt-6 mb-6">
              <h2 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2" style={{ fontFamily: "Outfit, sans-serif" }}>
                <span className="text-gold">✨</span> Browse by Prophet
              </h2>
              <div className="flex flex-wrap gap-2">
                {[
                  { slug: "prophet-muhammad", name: "Prophet Muhammad ﷺ" },
                  { slug: "prophet-yusuf", name: "Prophet Yusuf" },
                  { slug: "prophet-ibrahim", name: "Prophet Ibrahim" },
                  { slug: "prophet-musa", name: "Prophet Musa" },
                  { slug: "prophet-sulayman", name: "Prophet Sulayman" },
                ].map(({ slug, name }) => (
                  <Link
                    key={slug}
                    href={`/prophets/${slug}`}
                    className="text-sm px-4 py-2 rounded-full border border-gold/30 text-gold/80 hover:bg-gold/10 hover:text-gold transition-colors"
                  >
                    {name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="text-center mt-4">
              <Link href="/library" className="inline-block border-2 border-gold/50 text-gold font-semibold px-8 py-3 rounded-xl hover:bg-gold/10 transition-colors" style={{ fontFamily: "Outfit, sans-serif" }}>
                Browse All 50+ Stories →
              </Link>
            </div>

            {/* Blog teaser */}
            <div className="mt-12">
              <h2 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2" style={{ fontFamily: "Outfit, sans-serif" }}>
                <span className="text-gold">📝</span> For Muslim Parents
              </h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {blogPosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="bg-navy-lighter rounded-xl p-4 border border-gray-700/30 hover:border-gold/30 transition-colors group"
                  >
                    <p className="text-xs text-gray-500 mb-2">{post.readingTimeMinutes} min read</p>
                    <h3 className="text-sm font-semibold text-gray-200 group-hover:text-gold transition-colors leading-snug" style={{ fontFamily: "Outfit, sans-serif" }}>
                      {post.title}
                    </h3>
                  </Link>
                ))}
              </div>
              <div className="mt-3 text-right">
                <Link href="/blog" className="text-gold/70 text-xs hover:text-gold transition-colors">
                  See all articles →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Donate / Support */}
        <section className="py-12 md:py-20 px-4 bg-navy-light/50" id="support">
          <div className="max-w-md mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ fontFamily: "Outfit, sans-serif" }}>
              Free for Every Muslim Family
            </h2>
            <p className="text-gray-400 mb-8 text-sm">
              NoorBedtime is free forever. If these stories bring light to your home, consider supporting us so we can keep growing.
            </p>
            <div className="bg-gradient-to-br from-gold/10 to-navy-lighter rounded-2xl p-8 border border-gold/30 relative mb-3">
              <div className="text-3xl mb-4">💛</div>
              <p className="text-gray-300 text-sm mb-6">
                Every donation helps us create more illustrated Islamic stories for Muslim children everywhere.
              </p>
              <Link
                href="/donate"
                className="cta-glow block bg-gold text-navy font-bold py-3.5 rounded-xl hover:bg-gold-light transition-colors text-sm"
                style={{ fontFamily: "Outfit, sans-serif" }}
              >
                ❤️ Support NoorBedtime
              </Link>
            </div>
            <p className="text-teal text-xs">All 50+ stories are always free. No account needed.</p>
          </div>
        </section>

        {/* How it works */}
        <section className="py-12 md:py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-10" style={{ fontFamily: "Outfit, sans-serif" }}>
              Bedtime Made Beautiful
            </h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl mb-3">📖</div>
                <h3 className="text-base font-bold mb-2" style={{ fontFamily: "Outfit, sans-serif" }}>1. Pick a Story</h3>
                <p className="text-gray-400 text-sm">Browse by age, theme, or prophet. All 50+ stories are free — no signup needed.</p>
              </div>
              <div>
                <div className="text-3xl mb-3">🌙</div>
                <h3 className="text-base font-bold mb-2" style={{ fontFamily: "Outfit, sans-serif" }}>2. Read Together</h3>
                <p className="text-gray-400 text-sm">Beautiful illustrations, gentle pace, dark mode. Perfect for bedtime.</p>
              </div>
              <div>
                <div className="text-3xl mb-3">😴</div>
                <h3 className="text-base font-bold mb-2" style={{ fontFamily: "Outfit, sans-serif" }}>3. Sweet Dreams</h3>
                <p className="text-gray-400 text-sm">Every story ends warm and peaceful — designed to ease into sleep.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Trust badges */}
        <section className="py-12 md:py-16 px-4 bg-navy-light/50">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              {[
                { icon: "📖", title: "Quran & Hadith", desc: "Every story cites its source" },
                { icon: "✅", title: "Scholar Reviewed", desc: "Validated for accuracy" },
                { icon: "🆓", title: "Always Free", desc: "No account, no payment" },
                { icon: "✨", title: "Respectful Art", desc: "No face depictions" },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="bg-navy-lighter rounded-xl p-5 border border-gray-700/20">
                  <div className="text-2xl mb-2">{icon}</div>
                  <h3 className="font-bold text-sm mb-1" style={{ fontFamily: "Outfit, sans-serif" }}>{title}</h3>
                  <p className="text-gray-500 text-xs">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SEO content */}
        <section className="py-12 md:py-16 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl md:text-2xl font-bold text-center mb-6" style={{ fontFamily: "Outfit, sans-serif" }}>
              About Islamic Bedtime Stories for Kids
            </h2>
            <div className="text-gray-400 leading-relaxed space-y-4 text-sm">
              <p>
                Islamic bedtime stories help Muslim children connect with their faith through the timeless art of storytelling. At NoorBedtime, we bring the beauty of the Quran, the wisdom of Prophet Muhammad (peace be upon him), and the courage of Islamic heroes to life through short, illustrated stories designed for the moments before sleep.
              </p>
              <p>
                Our library of Muslim kids stories spans ages 3 to 12, covering prophet stories like the patience of Yusuf, the bravery of Ibrahim, and the compassion of Muhammad — alongside everyday tales of kindness, honesty, and gratitude rooted in Quranic teachings.
              </p>
              <p>
                Unlike generic children&apos;s story apps, NoorBedtime is built exclusively for Muslim families who want their children to hear stories that reflect their values. Our illustrations follow Islamic art traditions — no faces of prophets are depicted — creating a unique, respectful visual experience.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
