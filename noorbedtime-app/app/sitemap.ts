import { MetadataRoute } from "next";
import { getAllStories, getAllThemes, getAllCategories, themeToSlug } from "@/lib/stories";
import { getAllProphets } from "@/lib/prophets";
import { getAllPosts } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const stories = getAllStories();
  const themes = getAllThemes();
  const categories = getAllCategories();
  const prophets = getAllProphets();
  const posts = getAllPosts();
  const ageRanges = ["3-5", "6-8", "9-12"];

  const staticPages: MetadataRoute.Sitemap = [
    { url: "https://noorbedtime.com", priority: 1.0, changeFrequency: "daily" },
    { url: "https://noorbedtime.com/library", priority: 0.9, changeFrequency: "daily" },
    { url: "https://noorbedtime.com/credits", priority: 0.7, changeFrequency: "monthly" },
  ];

  const agePages: MetadataRoute.Sitemap = ageRanges.map((range) => ({
    url: `https://noorbedtime.com/ages/${range}`,
    priority: 0.85,
    changeFrequency: "weekly",
  }));

  const themePages: MetadataRoute.Sitemap = themes.map((t) => ({
    url: `https://noorbedtime.com/themes/${themeToSlug(t)}`,
    priority: 0.75,
    changeFrequency: "weekly",
  }));

  const categoryPages: MetadataRoute.Sitemap = categories.map((slug) => ({
    url: `https://noorbedtime.com/${slug}`,
    priority: 0.8,
    changeFrequency: "weekly",
  }));

  const categoryAgePages: MetadataRoute.Sitemap = categories.flatMap((slug) =>
    ageRanges.map((range) => ({
      url: `https://noorbedtime.com/${slug}/ages/${range}`,
      priority: 0.7,
      changeFrequency: "weekly",
    }))
  );

  const prophetPages: MetadataRoute.Sitemap = prophets.map((slug) => ({
    url: `https://noorbedtime.com/prophets/${slug}`,
    priority: 0.8,
    changeFrequency: "monthly",
  }));

  const blogPages: MetadataRoute.Sitemap = [
    { url: "https://noorbedtime.com/blog", priority: 0.8, changeFrequency: "weekly" },
    ...posts.map((p) => ({
      url: `https://noorbedtime.com/blog/${p.slug}`,
      priority: 0.75,
      changeFrequency: "monthly" as const,
      lastModified: new Date(p.publishedAt),
    })),
  ];

  const storyPages: MetadataRoute.Sitemap = stories.map((s) => ({
    url: `https://noorbedtime.com/story/${s.slug}`,
    priority: s.is_free ? 0.9 : 0.8,
    changeFrequency: "weekly",
    lastModified: new Date(),
  }));

  return [
    ...staticPages,
    ...agePages,
    ...categoryPages,
    ...themePages,
    ...prophetPages,
    ...blogPages,
    ...categoryAgePages,
    ...storyPages,
  ];
}
