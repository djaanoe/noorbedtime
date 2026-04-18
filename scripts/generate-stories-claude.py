"""
NoorBedtime — Batch Story Generator (Claude / Anthropic)
=======================================================
Same as generate-stories-batch.py but uses Claude API instead of OpenAI.
Claude tends to produce more nuanced, culturally sensitive stories.

Usage:
  pip install anthropic
  export ANTHROPIC_API_KEY="sk-ant-..."
  python generate-stories-claude.py                     # All ungenerated
  python generate-stories-claude.py --tier rising_moons  # One tier
  python generate-stories-claude.py --id 5               # One story
  python generate-stories-claude.py --dry-run             # Cost estimate
"""

import os, json, sys, time, argparse
from pathlib import Path

try:
    import anthropic
except ImportError:
    print("pip install anthropic"); sys.exit(1)

CATALOG_PATH = Path(__file__).parent / "story-catalog.json"
STORIES_DIR = Path(__file__).parent.parent / "stories"

TIER_CONFIG = {
    "little_stars":    {"pages": 16, "minutes": 10, "age": "3-5", "words_per_page": "25-40",  "lang": "Simple sentences. Warm vocabulary. 2-3 sentences per page. Gentle and reassuring tone."},
    "rising_moons":    {"pages": 20, "minutes": 15, "age": "6-8", "words_per_page": "40-60",  "lang": "Moderate vocabulary. Dialogue encouraged. 3-5 sentences per page. Adventure and wonder."},
    "young_explorers": {"pages": 24,"minutes": 20, "age": "9-12","words_per_page": "60-90", "lang": "Rich vocabulary. Historical context. Descriptive prose. 4-6 sentences per page."},
}

def build_prompt(entry):
    cfg = TIER_CONFIG[entry["age_tier"]]
    return f"""Write a complete bedtime story for the NoorBedtime Islamic children's app.

TITLE: {entry['title']}
AGE TIER: {entry['age_tier']} (ages {cfg['age']})
CATEGORY: {entry['category']}
THEME: {entry['theme']}
SOURCE: {entry['source_reference']} — {entry['source_detail']}
DESCRIPTION: {entry['description']}
PAGES: {cfg['pages']}
READING TIME: {cfg['minutes']} minutes
LANGUAGE: {cfg['lang']}
WORDS PER PAGE: {cfg['words_per_page']}

RULES:
1. Authentic to Islamic source. No invented Islamic facts.
2. Warm, gentle, wonder-filled tone. Perfect for bedtime.
3. NO fear, punishment, or scary content.
4. Peaceful, warm ending — child should feel safe.
5. Subtle moral. Show, don't tell. No lecturing.
6. Last page = gentle goodnight — calming, reflective.

ILLUSTRATION PROMPTS per page:
- Vibrant digital painting style with visible brushstrokes
- Color palette: lush greens, warm golds, deep blues, sunset oranges, soft pinks
- Regular children and companion characters: CAN have visible faces with big expressive cartoon eyes
- Prophets NEVER shown with visible faces. Only as radiant silhouettes, from behind, or in golden light.
- Animals/nature: full detail allowed. Rich detailed backgrounds.

Return ONLY valid JSON:
{{
  "title": "{entry['title']}",
  "slug": "{entry['slug']}",
  "age_tier": "{entry['age_tier']}",
  "age_range": "{cfg['age']}",
  "reading_time_minutes": {cfg['minutes']},
  "category": "{entry['category']}",
  "source_reference": "{entry['source_reference']}",
  "source_detail": "{entry['source_detail']}",
  "theme": "{entry['theme']}",
  "description": "{entry['description']}",
  "pages": [
    {{"page_number": 1, "text": "...", "illustration_prompt": "..."}}
  ]
}}"""


def generate_story(client, entry, model="claude-sonnet-4-20250514"):
    prompt = build_prompt(entry)
    msg = client.messages.create(
        model=model,
        max_tokens=8000,
        temperature=0.8,
        messages=[{"role": "user", "content": prompt}],
        system="You write Islamic children's bedtime stories. Return ONLY valid JSON. No markdown fences, no explanation."
    )
    text = msg.content[0].text.strip()
    if text.startswith("```"):
        text = text.split("\n", 1)[1]
        if text.endswith("```"):
            text = text[:-3]
    return json.loads(text)


def main():
    parser = argparse.ArgumentParser(description="NoorBedtime Story Generator (Claude)")
    parser.add_argument("--tier", choices=["little_stars","rising_moons","young_explorers"])
    parser.add_argument("--id", type=int)
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--model", default="claude-sonnet-4-20250514")
    args = parser.parse_args()

    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key and not args.dry_run:
        print("Set ANTHROPIC_API_KEY first"); sys.exit(1)

    with open(CATALOG_PATH) as f:
        catalog = json.load(f)

    stories = catalog
    if args.tier: stories = [s for s in stories if s["age_tier"] == args.tier]
    if args.id: stories = [s for s in stories if s["id"] == args.id]

    STORIES_DIR.mkdir(parents=True, exist_ok=True)
    to_generate = [s for s in stories if not (STORIES_DIR / f"{s['slug']}.json").exists()]

    print(f"\n🌙 NoorBedtime Story Generator (Claude)")
    print(f"{'='*50}")
    print(f"Catalog: {len(catalog)} | To generate: {len(to_generate)}")
    est_cost = len(to_generate) * 0.02  # ~$0.02 per story with Sonnet
    print(f"Estimated cost: ~${est_cost:.2f} ({args.model})")

    if args.dry_run or not to_generate:
        if not to_generate: print("\n✅ All done!")
        return

    confirm = input(f"\nGenerate {len(to_generate)} stories? (y/N): ").strip().lower()
    if confirm != "y": return

    client = anthropic.Anthropic(api_key=api_key)
    success, failed = 0, 0

    for i, entry in enumerate(to_generate):
        print(f"\n[{i+1}/{len(to_generate)}] {entry['title']} ({entry['age_tier']})")
        try:
            story = generate_story(client, entry, args.model)
            path = STORIES_DIR / f"{entry['slug']}.json"
            with open(path, "w") as f:
                json.dump(story, f, indent=2, ensure_ascii=False)
            print(f"  ✅ {path.name} ({len(story['pages'])} pages)")
            success += 1
        except Exception as e:
            print(f"  ❌ {e}")
            failed += 1
        time.sleep(1)

    print(f"\n{'='*50}")
    print(f"✅ {success} | ❌ {failed}")


if __name__ == "__main__":
    main()
