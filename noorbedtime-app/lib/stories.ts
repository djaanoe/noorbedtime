import fs from "fs";
import path from "path";
import { Story } from "@/types";

const STORIES_DIR = path.join(
  process.cwd(),
  "..",
  "stories"
);

const FREE_SLUGS = new Set([
  "little-ant-big-thank-you",
  "boy-shared-last-date",
  "light-of-patience-yusuf",
]);

export function getAllStories(): Story[] {
  try {
    const files = fs.readdirSync(STORIES_DIR).filter((f) => f.endsWith(".json"));
    return files.map((file) => {
      const raw = fs.readFileSync(path.join(STORIES_DIR, file), "utf-8");
      const story: Story = JSON.parse(raw);
      story.is_free = FREE_SLUGS.has(story.slug);
      return story;
    });
  } catch {
    return [];
  }
}

export function getStoryBySlug(slug: string): Story | null {
  try {
    const files = fs.readdirSync(STORIES_DIR).filter((f) => f.endsWith(".json"));
    for (const file of files) {
      const raw = fs.readFileSync(path.join(STORIES_DIR, file), "utf-8");
      const story: Story = JSON.parse(raw);
      if (story.slug === slug) {
        story.is_free = FREE_SLUGS.has(story.slug);
        return story;
      }
    }
    return null;
  } catch {
    return null;
  }
}

export function getStoriesByTier(tier: Story["age_tier"]): Story[] {
  return getAllStories().filter((s) => s.age_tier === tier);
}

export function getIllustrationUrl(slug: string, pageNumber: number): string {
  const padded = String(pageNumber).padStart(2, "0");
  return `/illustrations/${slug}/page-${padded}.webp`;
}

export const AGE_TIER_LABELS: Record<Story["age_tier"], string> = {
  little_stars: "Little Stars",
  rising_moons: "Rising Moons",
  young_explorers: "Young Explorers",
};

export const AGE_TIER_RANGES: Record<Story["age_tier"], string> = {
  little_stars: "Ages 3-5",
  rising_moons: "Ages 6-8",
  young_explorers: "Ages 9-12",
};
