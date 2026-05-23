import { MetadataRoute } from "next";
import {
  getAllStories,
  getAllThemes,
  getAllCategories,
  themeToSlug,
  getStoriesByTheme,
  getStoriesByReadingTime,
} from "@/lib/stories";
import { getAllProphets } from "@/lib/prophets";
import { getAllPosts } from "@/lib/blog";
import { Story } from "@/types";

export default function sitemap(): MetadataRoute.Sitemap {
  const stories = getAllStories();
  const themes = getAllThemes();
  const categories = getAllCategories();
  const prophets = getAllProphets();
  const posts = getAllPosts();
  const ageRanges = ["3-5", "6-8", "9-12"];

  const tierMap: Record<string, Story["age_tier"]> = {
    "3-5": "little_stars",
    "6-8": "rising_moons",
    "9-12": "young_explorers",
  };

  const staticPages: MetadataRoute.Sitemap = [
    { url: "https://noorbedtime.com", priority: 1.0, changeFrequency: "daily" },
    { url: "https://noorbedtime.com/library", priority: 0.9, changeFrequency: "daily" },
    { url: "https://noorbedtime.com/donate", priority: 0.7, changeFrequency: "monthly" },
    { url: "https://noorbedtime.com/quick-reads", priority: 0.8, changeFrequency: "weekly" },
    { url: "https://noorbedtime.com/bedtime-reads", priority: 0.8, changeFrequency: "weekly" },
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

  const themeAgePages: MetadataRoute.Sitemap = themes.flatMap((t) => {
    const themeSlug = themeToSlug(t);
    const themeStories = getStoriesByTheme(themeSlug);
    return ageRanges
      .filter((range) => {
        const tier = tierMap[range];
        return themeStories.some((s) => s.age_tier === tier);
      })
      .map((range) => ({
        url: `https://noorbedtime.com/themes/${themeSlug}/ages/${range}`,
        priority: 0.65,
        changeFrequency: "weekly" as const,
      }));
  });

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

  const readingTimeAgePages: MetadataRoute.Sitemap = ageRanges.flatMap((range) => {
    const tier = tierMap[range];
    const hasQuick = getStoriesByReadingTime(1, 10).some((s) => s.age_tier === tier);
    const hasBedtime = getStoriesByReadingTime(11, 15).some((s) => s.age_tier === tier);
    const pages: MetadataRoute.Sitemap = [];
    if (hasQuick) pages.push({
      url: `https://noorbedtime.com/quick-reads/ages/${range}`,
      priority: 0.7,
      changeFrequency: "weekly",
    });
    if (hasBedtime) pages.push({
      url: `https://noorbedtime.com/bedtime-reads/ages/${range}`,
      priority: 0.7,
      changeFrequency: "weekly",
    });
    return pages;
  });

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
    priority: 0.85,
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
    ...themeAgePages,
    ...readingTimeAgePages,
    ...storyPages,
  ];
}
