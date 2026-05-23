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

export function getAllThemes(): string[] {
  return Array.from(new Set(getAllStories().map((s) => s.theme))).sort();
}

export function getStoriesByTheme(themeSlug: string): Story[] {
  const normalized = themeSlug.replace(/-/g, "_");
  return getAllStories().filter(
    (s) => s.theme === themeSlug || s.theme === normalized
  );
}

export function themeToSlug(theme: string): string {
  return theme.replace(/_/g, "-");
}

export function themeToLabel(theme: string): string {
  return theme
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export interface CategoryMeta {
  label: string;
  categoryValue: string;
  description: string;
  intro: string;
  icon: string;
}

export const CATEGORIES: Record<string, CategoryMeta> = {
  "character-building": {
    label: "Character Building",
    categoryValue: "character_building",
    description: "Islamic stories that build honesty, patience, and responsibility in Muslim children.",
    intro: "These stories grow great character — honesty, patience, responsibility — through relatable moments from everyday Muslim life and the examples of our Prophets and companions. Each tale gives children a model to look up to and a value to carry with them.",
    icon: "🌱",
  },
  "daily-life": {
    label: "Daily Life",
    categoryValue: "daily_life",
    description: "Islamic stories set in everyday moments, showing Muslim children how faith guides every part of life.",
    intro: "From the morning Bismillah to bedtime du'a, Islam is woven through every moment of the day. These stories show Muslim children that their daily life — meals, play, helping at home — is full of opportunities to live their faith beautifully.",
    icon: "🏠",
  },
  "islamic-history": {
    label: "Islamic History",
    categoryValue: "islamic_history",
    description: "Age-appropriate stories from Islamic civilization for Muslim children aged 3-12.",
    intro: "The Muslim world has a rich and inspiring history. These age-appropriate stories introduce children to the scholars, leaders, and communities that shaped Islamic civilization — sparking curiosity and pride in their heritage.",
    icon: "🕌",
  },
  "prophet-stories": {
    label: "Prophet Stories",
    categoryValue: "prophet_story",
    description: "Authentic stories of the Prophets from the Quran and Sunnah for Muslim children.",
    intro: "The stories of the Prophets ﷺ are the most beloved in Islam — full of courage, patience, and unshakeable trust in Allah. Each tale is drawn directly from the Quran and authentic hadith, making them safe and spiritually enriching for young Muslim readers.",
    icon: "✨",
  },
  "quran-stories": {
    label: "Quran Stories",
    categoryValue: "quran_inspired",
    description: "Bedtime stories for Muslim children inspired by the wisdom of the Holy Quran.",
    intro: "The Quran is a book of timeless wisdom, stories, and guidance. These tales bring its lessons to life for young readers — making the Quran accessible, beautiful, and relevant to a child's everyday experience.",
    icon: "📖",
  },
};

export function getAllCategories(): string[] {
  return Object.keys(CATEGORIES);
}

export function getStoriesByCategory(categorySlug: string): Story[] {
  const cat = CATEGORIES[categorySlug];
  if (!cat) return [];
  return getAllStories().filter((s) => s.category === cat.categoryValue);
}

const PROPHET_KEYWORDS: Record<string, string[]> = {
  "prophet-yusuf": ["Yusuf"],
  "prophet-ibrahim": ["Ibrahim"],
  "prophet-sulayman": ["Sulayman"],
  "prophet-musa": ["Musa"],
  "prophet-muhammad": ["Muhammad"],
};

export function getStoriesByProphet(prophetSlug: string): Story[] {
  const keywords = PROPHET_KEYWORDS[prophetSlug];
  if (!keywords) return [];
  return getAllStories().filter((s) =>
    keywords.some(
      (kw) => s.source_detail?.includes(kw) || s.title.includes(kw)
    )
  );
}

export function getStoriesByReadingTime(minMin: number, maxMin: number): Story[] {
  return getAllStories().filter(
    (s) => s.reading_time_minutes >= minMin && s.reading_time_minutes <= maxMin
  );
}
