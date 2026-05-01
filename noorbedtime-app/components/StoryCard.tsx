import Link from "next/link";
import Image from "next/image";
import { Story } from "@/types";

const TIER_COLORS: Record<string, string> = {
  little_stars: "text-amber-300",
  rising_moons: "text-teal",
  young_explorers: "text-lavender",
};

const TIER_BG: Record<string, string> = {
  little_stars: "bg-amber-500/20 text-amber-300",
  rising_moons: "bg-teal/20 text-teal",
  young_explorers: "bg-lavender/20 text-lavender",
};

const TIER_BORDER_HOVER: Record<string, string> = {
  little_stars: "hover:border-gold/40",
  rising_moons: "hover:border-teal/40",
  young_explorers: "hover:border-lavender/40",
};

interface Props {
  story: Story;
}

export default function StoryCard({ story }: Props) {
  const illustrationUrl = `/illustrations/${story.slug}/page-00.webp`;
  const borderHover = TIER_BORDER_HOVER[story.age_tier] ?? "hover:border-gold/40";

  return (
    <Link
      href={`/story/${story.slug}`}
      className={`story-card block rounded-xl overflow-hidden bg-navy-lighter border border-gray-700/30 ${borderHover} relative`}
    >
      {story.is_free ? (
        <span className="free-badge">FREE</span>
      ) : (
        <span className="credit-badge">Unlock</span>
      )}
      <div className="aspect-[3/4] relative bg-gradient-to-br from-amber-900/20 to-navy flex items-center justify-center overflow-hidden">
        <Image
          src={illustrationUrl}
          alt={story.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-3">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${TIER_BG[story.age_tier]}`}>
          Ages {story.age_range}
        </span>
        <h3 className="font-bold text-xs mt-2 leading-tight" style={{ fontFamily: "Outfit, sans-serif" }}>
          {story.title}
        </h3>
        <p className={`text-[10px] mt-1 capitalize ${TIER_COLORS[story.age_tier] ?? "text-gold/60"} opacity-70`}>
          {story.theme}
        </p>
      </div>
    </Link>
  );
}

export { TIER_COLORS, TIER_BG, TIER_BORDER_HOVER };
