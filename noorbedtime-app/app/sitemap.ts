import { MetadataRoute } from "next";
import { getAllStories, getAllThemes, themeToSlug } from "@/lib/stories";

export default function sitemap(): MetadataRoute.Sitemap {
  const stories = getAllStories();
  const themes = getAllThemes();

  const staticPages: MetadataRoute.Sitemap = [
    { url: "https://noorbedtime.com", priority: 1.0, changeFrequency: "daily" },
    { url: "https://noorbedtime.com/library", priority: 0.9, changeFrequency: "daily" },
    { url: "https://noorbedtime.com/credits", priority: 0.7, changeFrequency: "monthly" },
  ];

  const agePages: MetadataRoute.Sitemap = ["3-5", "6-8", "9-12"].map((range) => ({
    url: `https://noorbedtime.com/ages/${range}`,
    priority: 0.85,
    changeFrequency: "weekly",
  }));

  const themePages: MetadataRoute.Sitemap = themes.map((t) => ({
    url: `https://noorbedtime.com/themes/${themeToSlug(t)}`,
    priority: 0.75,
    changeFrequency: "weekly",
  }));

  const storyPages: MetadataRoute.Sitemap = stories.map((s) => ({
    url: `https://noorbedtime.com/story/${s.slug}`,
    priority: s.is_free ? 0.9 : 0.8,
    changeFrequency: "weekly",
    lastModified: new Date(),
  }));

  return [...staticPages, ...agePages, ...themePages, ...storyPages];
}
