export interface StoryPage {
  page_number: number;
  text: string;
  illustration_prompt?: string;
}

export interface Story {
  title: string;
  slug: string;
  age_tier: "little_stars" | "rising_moons" | "young_explorers";
  age_range: string;
  reading_time_minutes: number;
  category: string;
  source_reference: string;
  source_detail?: string;
  theme: string;
  description: string;
  is_free?: boolean;
  pages: StoryPage[];
}

export interface User {
  id: string;
  email: string;
  name?: string;
  lifetime_access: boolean;
}
