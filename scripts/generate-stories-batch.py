"""
NoorBedtime — Batch Story Generator (OpenAI GPT-4)
==================================================
Reads story-catalog.json and generates full story content using OpenAI API.
Each story is saved as a JSON file in ../stories/{slug}.json

Usage:
  pip install openai
  export OPENAI_API_KEY="sk-..."
  python generate-stories-batch.py                     # All ungenerated stories
  python generate-stories-batch.py --tier little_stars  # One tier only
  python generate-stories-batch.py --id 5               # One story only
  python generate-stories-batch.py --dry-run             # Cost estimate only
"""

import os, json, sys, time, argparse
from pathlib import Path

try:
    from openai import OpenAI
except ImportError:
    print("pip install openai"); sys.exit(1)

CATALOG_PATH = Path(__file__).parent / "story-catalog.json"
STORIES_DIR = Path(__file__).parent.parent / "stories"

STYLE_PREFIX = (
    "Professional children's book illustration in vibrant digital painting style. "
    "Visible brushstrokes, saturated colors, warm magical atmosphere. "
    "Color palette: rich and varied — lush greens, warm golds, deep blues, sunset oranges, soft pinks. "
    "Characters have big expressive cartoon eyes, diverse skin tones, modest culturally diverse clothing. "
    "CRITICAL for PROPHET characters: No visible faces — shown as radiant silhouettes, from behind, or bathed in golden light. "
    "For regular children and companion characters: faces ARE visible with big expressive cartoon eyes. "
    "Rich detailed backgrounds — lush forests, starry night skies, colorful gardens, cozy interiors. "
    "Professional children's book quality, highly detailed, warm inviting mood. "
)

TIER_CONFIG = {
    "little_stars":    {"pages": 16, "minutes": 10, "age": "3-5", "words_per_page": "25-40",  "lang": "Simple sentences. Warm vocabulary. 2-3 sentences per page. Gentle and reassuring tone."},
    "rising_moons":    {"pages": 20, "minutes": 15, "age": "6-8", "words_per_page": "40-60",  "lang": "Moderate vocabulary. Dialogue encouraged. 3-5 sentences per page. Adventure and wonder."},
    "young_explorers": {"pages": 24,"minutes": 20, "age": "9-12","words_per_page": "60-90", "lang": "Rich vocabulary. Historical context. Descriptive prose. 4-6 sentences per page."},
}

def build_prompt(entry):
    cfg = TIER_CONFIG[entry["age_tier"]]
    return f"""You are a children's story writer for NoorBedtime, an Islamic bedtime story app.

Write a complete bedtime story based on this specification:

TITLE: {entry['title']}
AGE TIER: {entry['age_tier']} (ages {cfg['age']})
CATEGORY: {entry['category']}
THEME: {entry['theme']}
SOURCE: {entry['source_reference']} — {entry['source_detail']}
DESCRIPTION: {entry['description']}
PAGES: {cfg['pages']}
READING TIME: {cfg['minutes']} minutes
LANGUAGE LEVEL: {cfg['lang']}
WORDS PER PAGE: {cfg['words_per_page']} words

RULES:
1. Story must be AUTHENTIC to the Islamic source. Do not invent false Islamic facts.
2. Tone: warm, gentle, wonder-filled. Perfect for reading before sleep.
3. NO fear-based content. No punishment stories. No scary imagery.
4. End on a peaceful, warm note — child should feel safe and loved.
5. Include a subtle moral/lesson but do NOT lecture. Show, don't tell.
6. Last page should feel like a gentle goodnight — calming, reflective.

ILLUSTRATION PROMPTS:
For each page, write a detailed illustration prompt. The art style is vibrant digital painting with:
- Color palette: lush greens, warm golds, deep blues, sunset oranges, soft pinks
- Regular children and companion characters: CAN have visible faces with big expressive cartoon eyes
- Prophets: NEVER shown with visible faces. Only as radiant silhouettes, from behind, or bathed in golden light.
- Animals and nature: can be depicted normally with full detail.
- Rich, detailed backgrounds with visible brushstrokes.
- Mood: vibrant, warm, magical, inviting, bedtime-ready.

Return ONLY valid JSON in this exact format (no markdown, no explanation):
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
    {{
      "page_number": 1,
      "text": "Story text for this page...",
      "illustration_prompt": "Detailed illustration prompt for this scene..."
    }}
  ]
}}"""


def generate_story(client, entry, model="gpt-4o"):
    prompt = build_prompt(entry)
    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": "You write Islamic children's bedtime stories. Return ONLY valid JSON. No markdown fences."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.8,
        max_tokens=8000,
    )
    text = response.choices[0].message.content.strip()
    # Clean markdown fences if present
    if text.startswith("```"):
        text = text.split("\n", 1)[1]
        if text.endswith("```"):
            text = text[:-3]
    return json.loads(text)


def main():
    parser = argparse.ArgumentParser(description="NoorBedtime Story Generator (OpenAI)")
    parser.add_argument("--tier", choices=["little_stars","rising_moons","young_explorers"])
    parser.add_argument("--id", type=int, help="Generate only this story ID")
    parser.add_argument("--dry-run", action="store_true", help="Show cost estimate only")
    parser.add_argument("--model", default="gpt-4o", help="OpenAI model (default: gpt-4o)")
    args = parser.parse_args()

    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key and not args.dry_run:
        print("Set OPENAI_API_KEY first"); sys.exit(1)

    with open(CATALOG_PATH) as f:
        catalog = json.load(f)

    # Filter
    stories = catalog
    if args.tier:
        stories = [s for s in stories if s["age_tier"] == args.tier]
    if args.id:
        stories = [s for s in stories if s["id"] == args.id]

    # Check which are already generated
    STORIES_DIR.mkdir(parents=True, exist_ok=True)
    to_generate = []
    for s in stories:
        path = STORIES_DIR / f"{s['slug']}.json"
        if not path.exists():
            to_generate.append(s)

    print(f"\n🌙 NoorBedtime Story Generator")
    print(f"{'='*50}")
    print(f"Catalog: {len(catalog)} stories")
    print(f"Filtered: {len(stories)} | Already done: {len(stories)-len(to_generate)} | To generate: {len(to_generate)}")

    # Cost estimate (~$0.01-0.03 per story with gpt-4o)
    est_cost = len(to_generate) * 0.025
    print(f"Estimated cost: ~${est_cost:.2f} (GPT-4o)")

    if args.dry_run or not to_generate:
        if not to_generate: print("\n✅ All stories already generated!")
        return

    confirm = input(f"\nGenerate {len(to_generate)} stories? (y/N): ").strip().lower()
    if confirm != "y":
        print("Cancelled."); return

    client = OpenAI(api_key=api_key)
    success, failed = 0, 0

    for i, entry in enumerate(to_generate):
        print(f"\n[{i+1}/{len(to_generate)}] {entry['title']} ({entry['age_tier']})")
        try:
            story = generate_story(client, entry, args.model)
            path = STORIES_DIR / f"{entry['slug']}.json"
            with open(path, "w") as f:
                json.dump(story, f, indent=2, ensure_ascii=False)
            print(f"  ✅ Saved: {path.name} ({len(story['pages'])} pages)")
            success += 1
        except Exception as e:
            print(f"  ❌ Failed: {e}")
            failed += 1
        time.sleep(2)  # Rate limiting

    print(f"\n{'='*50}")
    print(f"✅ Success: {success} | ❌ Failed: {failed}")
    print(f"Stories saved to: {STORIES_DIR}")


if __name__ == "__main__":
    main()
