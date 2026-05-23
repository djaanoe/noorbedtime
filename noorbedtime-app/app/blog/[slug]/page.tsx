import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug, BlogSection } from "@/lib/blog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdSlot from "@/components/AdSlot";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPostBySlug(params.slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `https://noorbedtime.com/blog/${params.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.publishedAt,
    },
  };
}

function renderSection(section: BlogSection, i: number) {
  switch (section.type) {
    case "h2":
      return (
        <h2
          key={i}
          className="text-xl md:text-2xl font-bold text-white mt-10 mb-4"
          style={{ fontFamily: "Outfit, sans-serif" }}
        >
          {section.text}
        </h2>
      );
    case "h3":
      return (
        <h3
          key={i}
          className="text-lg font-bold text-gold mt-7 mb-3"
          style={{ fontFamily: "Outfit, sans-serif" }}
        >
          {section.text}
        </h3>
      );
    case "p":
      return (
        <p key={i} className="text-gray-300 leading-relaxed mb-4">
          {section.text}
        </p>
      );
    case "ul":
      return (
        <ul key={i} className="space-y-2 mb-5 ml-1">
          {section.items?.map((item, j) => (
            <li key={j} className="flex items-start gap-2 text-gray-300 text-sm leading-relaxed">
              <span className="text-teal mt-1 shrink-0">✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol key={i} className="space-y-3 mb-5 ml-1">
          {section.items?.map((item, j) => (
            <li key={j} className="flex items-start gap-3 text-gray-300 text-sm leading-relaxed">
              <span className="text-gold font-bold shrink-0 w-5">{j + 1}.</span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      );
    case "cta-box":
      return (
        <div
          key={i}
          className="my-8 bg-gradient-to-br from-gold/10 to-navy-lighter rounded-2xl p-6 border border-gold/30 text-center"
        >
          <p className="text-gray-300 text-sm mb-4">{section.text}</p>
          <Link
            href={section.href ?? "/library"}
            className="inline-block bg-gold text-navy font-bold text-sm px-6 py-3 rounded-xl hover:bg-gold-light transition-colors"
            style={{ fontFamily: "Outfit, sans-serif" }}
          >
            {section.label}
          </Link>
        </div>
      );
    case "faq":
      return (
        <div key={i} className="space-y-4 mt-2">
          {section.questions?.map((faq, j) => (
            <div
              key={j}
              className="bg-navy-lighter rounded-xl p-5 border border-gray-700/30"
            >
              <h3
                className="font-semibold text-sm text-white mb-2"
                style={{ fontFamily: "Outfit, sans-serif" }}
              >
                {faq.q}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      );
    default:
      return null;
  }
}

export default function BlogPostPage({ params }: Props) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const allPosts = getAllPosts().filter((p) => p.slug !== params.slug);

  const faqItems = post.content
    .filter((s) => s.type === "faq")
    .flatMap((s) => s.questions ?? []);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      datePublished: post.publishedAt,
      url: `https://noorbedtime.com/blog/${post.slug}`,
      author: {
        "@type": "Organization",
        name: "NoorBedtime",
        url: "https://noorbedtime.com",
      },
      publisher: {
        "@type": "Organization",
        name: "NoorBedtime",
        url: "https://noorbedtime.com",
      },
      keywords: post.keyword,
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://noorbedtime.com" },
          { "@type": "ListItem", position: 2, name: "Blog", item: "https://noorbedtime.com/blog" },
          { "@type": "ListItem", position: 3, name: post.title, item: `https://noorbedtime.com/blog/${post.slug}` },
        ],
      },
    },
    ...(faqItems.length > 0
      ? [
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqItems.map((faq) => ({
              "@type": "Question",
              name: faq.q,
              acceptedAnswer: { "@type": "Answer", text: faq.a },
            })),
          },
        ]
      : []),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main className="pt-20 min-h-screen bg-navy">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <nav className="text-xs text-gray-500 mb-8 flex items-center gap-2">
            <Link href="/" className="hover:text-gold transition-colors">Home</Link>
            <span>›</span>
            <Link href="/blog" className="hover:text-gold transition-colors">Blog</Link>
            <span>›</span>
            <span className="text-gray-400 truncate max-w-[200px]">{post.title}</span>
          </nav>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
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
            <h1
              className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              {post.title}
            </h1>
            <p className="text-gray-400 leading-relaxed text-base">{post.description}</p>
          </div>

          <hr className="border-gray-700/40 mb-8" />

          <article>
            {post.content.map((section, i) => {
              const midpoint = Math.floor(post.content.length / 2);
              return (
                <>
                  {renderSection(section, i)}
                  {i === midpoint && (
                    <AdSlot key={`ad-mid-${i}`} id="blog-mid-article" format="in-article" className="my-6" />
                  )}
                </>
              );
            })}
          </article>

          <AdSlot id="blog-after-article" className="my-8" />

          <hr className="border-gray-700/40 mt-4 mb-8" />

          {/* More articles */}
          {allPosts.length > 0 && (
            <div>
              <h2
                className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-5"
                style={{ fontFamily: "Outfit, sans-serif" }}
              >
                More Guides for Muslim Parents
              </h2>
              <div className="space-y-4">
                {allPosts.slice(0, 3).map((p) => (
                  <Link
                    key={p.slug}
                    href={`/blog/${p.slug}`}
                    className="block bg-navy-lighter rounded-xl p-4 border border-gray-700/30 hover:border-gold/30 transition-colors group"
                  >
                    <h3
                      className="text-sm font-semibold text-gray-200 group-hover:text-gold transition-colors"
                      style={{ fontFamily: "Outfit, sans-serif" }}
                    >
                      {p.title}
                    </h3>
                    <p className="text-gray-500 text-xs mt-1">{p.readingTimeMinutes} min read</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
