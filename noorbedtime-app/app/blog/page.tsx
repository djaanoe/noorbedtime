import { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Islamic Parenting Blog — NoorBedtime",
  description:
    "Guides for Muslim parents on Islamic bedtime stories, prophet stories for children, teaching Islamic values through storytelling, and building a Muslim bedtime routine.",
  alternates: { canonical: "https://noorbedtime.com/blog" },
};

export default function BlogPage() {
  const posts = getAllPosts();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "NoorBedtime Islamic Parenting Blog",
    description: "Guides for Muslim parents on Islamic storytelling and children's faith development",
    url: "https://noorbedtime.com/blog",
    publisher: {
      "@type": "Organization",
      name: "NoorBedtime",
      url: "https://noorbedtime.com",
    },
    blogPost: posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      description: p.description,
      url: `https://noorbedtime.com/blog/${p.slug}`,
      datePublished: p.publishedAt,
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
        <div className="max-w-4xl mx-auto px-4 py-12">
          <nav className="text-xs text-gray-500 mb-8 flex items-center gap-2">
            <Link href="/" className="hover:text-gold transition-colors">Home</Link>
            <span>›</span>
            <span className="text-gray-400">Blog</span>
          </nav>

          <div className="mb-10">
            <p className="text-gold text-xs tracking-widest uppercase mb-2">📝 Islamic Parenting</p>
            <h1
              className="text-3xl md:text-4xl font-bold text-white mb-4"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              Guides for Muslim Parents
            </h1>
            <p className="text-gray-400 max-w-2xl leading-relaxed">
              Practical advice on Islamic storytelling, bedtime routines, and raising children
              with strong faith — grounded in Quran, Sunnah, and the wisdom of Muslim families.
            </p>
          </div>

          <div className="space-y-6">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="block bg-navy-lighter rounded-2xl p-6 border border-gray-700/30 hover:border-gold/30 transition-colors group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs text-gray-500">
                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                  <span className="text-gray-700">·</span>
                  <span className="text-xs text-gray-500">{post.readingTimeMinutes} min read</span>
                </div>
                <h2
                  className="text-lg font-bold text-white mb-2 group-hover:text-gold transition-colors"
                  style={{ fontFamily: "Outfit, sans-serif" }}
                >
                  {post.title}
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed">{post.description}</p>
                <span className="inline-block mt-3 text-gold text-xs font-semibold">
                  Read article →
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-16 bg-navy-lighter rounded-2xl border border-gray-700/30 p-8 text-center">
            <p className="text-gray-400 text-sm mb-4">
              Ready to start? Browse 50+ illustrated Islamic bedtime stories for Muslim children aged 3–12.
            </p>
            <Link
              href="/library"
              className="inline-block bg-gold text-navy font-bold text-sm px-6 py-3 rounded-xl hover:bg-gold-light transition-colors"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              Browse All Stories →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
