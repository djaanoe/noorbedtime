import { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-dynamic";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StoryCard from "@/components/StoryCard";
import { getAllStories } from "@/lib/stories";
import { FOUNDER_PRODUCT } from "@/lib/credits";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  title: "NoorBedtime — Islamic Bedtime Stories for Muslim Kids | Quran & Prophet Tales",
  description:
    "Beautiful bedtime stories for Muslim children aged 3-12. Scholar-validated tales inspired by the Quran and Prophet traditions. 3 free stories — start reading tonight. Full library $4.99 one-time.",
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
              text: "NoorBedtime has 3 always-free stories — no account needed. Full access to all 50+ stories is a one-time payment of $4.99, forever. No subscription, no renewal.",
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

export default async function HomePage() {
  const allStories = getAllStories();

  let spotsLeft = FOUNDER_PRODUCT.founderLimit;
  try {
    const admin = createAdminClient();
    const { count } = await admin
      .from("users")
      .select("*", { count: "exact", head: true })
      .eq("lifetime_access", true);
    spotsLeft = Math.max(0, FOUNDER_PRODUCT.founderLimit - (count ?? 0));
  } catch { /* fallback to full spots */ }

  const founderActive = spotsLeft > 0;
  const activePrice = founderActive ? FOUNDER_PRODUCT.founderPrice : FOUNDER_PRODUCT.regularPrice;
  const activeUrl = founderActive ? FOUNDER_PRODUCT.founderGumroadUrl : FOUNDER_PRODUCT.regularGumroadUrl;
  const freeStories = allStories.filter((s) => s.is_free).slice(0, 3);
  const littleStars = allStories.filter((s) => s.age_tier === "little_stars" && !s.is_free).slice(0, 5);
  const risingMoons = allStories.filter((s) => s.age_tier === "rising_moons" && !s.is_free).slice(0, 5);
  const youngExplorers = allStories.filter((s) => s.age_tier === "young_explorers" && !s.is_free).slice(0, 5);

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
              50+ illustrated stories from the Quran &amp; Prophetic traditions. Each story teaches a beautiful Islamic value. 3 free forever.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-400 mb-2">
              <span className="flex items-center gap-1"><span className="text-gold">★</span> 50+ Stories</span>
              <span className="flex items-center gap-1"><span className="text-teal">●</span> Ages 3-12</span>
              <span className="flex items-center gap-1"><span className="text-gold">✓</span> Scholar Validated</span>
              <span className="flex items-center gap-1"><span className="text-teal">♥</span> No Ads</span>
            </div>
          </div>
        </header>

        {/* Story Library */}
        <section className="py-8 md:py-12 px-4" id="library">
          <div className="max-w-6xl mx-auto">

            {/* Free Stories */}
            <div className="mb-8">
              <h2 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2" style={{ fontFamily: "Outfit, sans-serif" }}>
                <span className="text-teal">★</span> Free Stories — Read Now
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {freeStories.map((story) => (
                  <StoryCard key={story.slug} story={story} />
                ))}
              </div>
            </div>

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

            <div className="text-center mt-4">
              <Link href="/library" className="inline-block border-2 border-gold/50 text-gold font-semibold px-8 py-3 rounded-xl hover:bg-gold/10 transition-colors" style={{ fontFamily: "Outfit, sans-serif" }}>
                Browse All 50+ Stories →
              </Link>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-12 md:py-20 px-4 bg-navy-light/50" id="credits">
          <div className="max-w-md mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ fontFamily: "Outfit, sans-serif" }}>
              Unlock the Full Library
            </h2>
            <p className="text-gray-400 mb-8 text-sm">
              One payment. All 50+ stories. Forever.
            </p>
            <div className="bg-gradient-to-br from-gold/10 to-navy-lighter rounded-2xl p-8 border border-gold/30 relative mb-3">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-navy text-[10px] font-bold px-3 py-0.5 rounded-full whitespace-nowrap">
                {founderActive ? `🔥 FOUNDER'S OFFER — ${spotsLeft} SPOTS LEFT` : "LIFETIME ACCESS"}
              </div>
              <div className="mb-1">
                {founderActive && (
                  <span className="text-gray-500 line-through text-xl mr-2">${FOUNDER_PRODUCT.regularPrice.toFixed(2)}</span>
                )}
                <span className="text-5xl font-extrabold text-cream" style={{ fontFamily: "Outfit, sans-serif" }}>
                  ${activePrice.toFixed(2)}
                </span>
              </div>
              <p className="text-gray-500 text-xs mb-5">
                {founderActive ? "one-time · founder's price" : "one-time · no subscription"}
              </p>
              <ul className="text-left space-y-1.5 text-sm text-gray-300 mb-7">
                <li className="flex items-center gap-2"><span className="text-teal">✓</span> All 50+ illustrated stories</li>
                <li className="flex items-center gap-2"><span className="text-teal">✓</span> All age tiers (3–5, 6–8, 9–12)</li>
                <li className="flex items-center gap-2"><span className="text-teal">✓</span> New stories included forever</li>
                <li className="flex items-center gap-2"><span className="text-teal">✓</span> Any device, no app needed</li>
              </ul>
              <a
                href={activeUrl}
                className="cta-glow block bg-gold text-navy font-bold py-3.5 rounded-xl hover:bg-gold-light transition-colors text-sm"
                style={{ fontFamily: "Outfit, sans-serif" }}
              >
                Get Lifetime Access — ${activePrice.toFixed(2)}
              </a>
            </div>
            {founderActive && (
              <p className="text-xs text-gray-500 mb-3">
                After {FOUNDER_PRODUCT.founderLimit} members, price returns to ${FOUNDER_PRODUCT.regularPrice.toFixed(2)}.{" "}
                <span className="text-gold">{spotsLeft} spots remaining.</span>
              </p>
            )}
            <p className="text-teal text-xs">3 stories are always free. No account needed to start.</p>
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
                <p className="text-gray-400 text-sm">Browse by age, theme, or prophet. 3 are free — no signup needed.</p>
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
                { icon: "🚫", title: "No Ads, Ever", desc: "Clean, distraction-free" },
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
