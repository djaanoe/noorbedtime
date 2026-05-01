import { MetadataRoute } from "next";
import { getAllStories } from "@/lib/stories";

export default function sitemap(): MetadataRoute.Sitemap {
  const stories = getAllStories();

  const staticPages: MetadataRoute.Sitemap = [
    { url: "https://noorbedtime.com", priority: 1.0, changeFrequency: "daily" },
    { url: "https://noorbedtime.com/library", priority: 0.9, changeFrequency: "daily" },
    { url: "https://noorbedtime.com/library/little-stars", priority: 0.8, changeFrequency: "weekly" },
    { url: "https://noorbedtime.com/library/rising-moons", priority: 0.8, changeFrequency: "weekly" },
    { url: "https://noorbedtime.com/library/young-explorers", priority: 0.8, changeFrequency: "weekly" },
    { url: "https://noorbedtime.com/credits", priority: 0.7, changeFrequency: "monthly" },
  ];

  const storyPages: MetadataRoute.Sitemap = stories.map((s) => ({
    url: `https://noorbedtime.com/story/${s.slug}`,
    priority: s.is_free ? 0.9 : 0.8,
    changeFrequency: "weekly",
    lastModified: new Date(),
  }));

  return [...staticPages, ...storyPages];
}
