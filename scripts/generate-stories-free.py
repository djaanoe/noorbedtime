"""
NoorBedtime — Free Story Generator (Google Gemini Flash)
=========================================================
Drop-in replacement for generate-stories-batch.py using Google Gemini (free tier).
Reads story-catalog.json and generates full story content.
Each story is saved as a JSON file in ../stories/{slug}.json

Free tier limits: 15 RPM, 1M tokens/day (~125 stories/day)

Usage:
  pip install google-genai
  export GEMINI_API_KEY="AIza..."
  python generate-stories-free.py                        # All ungenerated stories
  python generate-stories-free.py --tier little_stars    # One tier only
  python generate-stories-free.py --id 51                # One story by catalog ID
  python generate-stories-free.py --limit 5              # Max 5 stories
  python generate-stories-free.py --dry-run              # Preview without generating
  python generate-stories-free.py --model gemini-2.5-flash
"""

import os, json, sys, time, argparse
from pathlib import Path

try:
    from google import genai
    from google.genai import types as genai_types
except ImportError:
    print("Run: pip install google-genai")
    sys.exit(1)

CATALOG_PATH = Path(__file__).parent / "story-catalog.json"
STORIES_DIR = Path(__file__).parent.parent / "stories"

TIER_CONFIG = {
    "little_stars":    {"pages": 16, "minutes": 10, "age": "3-5",  "words_per_page": "25-40",  "lang": "Simple sentences. Warm vocabulary. 2-3 sentences per page. Gentle and reassuring tone."},
    "rising_moons":    {"pages": 20, "minutes": 15, "age": "6-8",  "words_per_page": "40-60",  "lang": "Moderate vocabulary. Dialogue encouraged. 3-5 sentences per page. Adventure and wonder."},
    "young_explorers": {"pages": 24, "minutes": 20, "age": "9-12", "words_per_page": "60-90",  "lang": "Rich vocabulary. Historical context. Descriptive prose. 4-6 sentences per page."},
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


def generate_story(client, entry, model_name):
    prompt = build_prompt(entry)
    response = client.models.generate_content(
        model=model_name,
        contents=prompt,
        config=genai_types.GenerateContentConfig(
            temperature=0.8,
            max_output_tokens=8192,
            system_instruction="You write Islamic children's bedtime stories. Return ONLY valid JSON. No markdown fences.",
        ),
    )
    text = response.text.strip()
    if text.startswith("```"):
        lines = text.split("\n")
        text = "\n".join(lines[1:])
        if text.endswith("```"):
            text = text[:-3].rstrip()
    return json.loads(text)


def mark_generated(slug):
    with open(CATALOG_PATH) as f:
        catalog = json.load(f)
    for entry in catalog:
        if entry["slug"] == slug:
            entry["generated"] = True
            break
    with open(CATALOG_PATH, "w") as f:
        json.dump(catalog, f, indent=2, ensure_ascii=False)


def main():
    parser = argparse.ArgumentParser(description="NoorBedtime Story Generator (Gemini Flash — Free)")
    parser.add_argument("--tier", choices=["little_stars", "rising_moons", "young_explorers"])
    parser.add_argument("--id", type=int, help="Generate only this story catalog ID")
    parser.add_argument("--limit", type=int, help="Max number of stories to generate")
    parser.add_argument("--dry-run", action="store_true", help="Preview without generating")
    parser.add_argument("--model", default="gemini-2.5-flash", help="Gemini model (default: gemini-2.5-flash)")
    args = parser.parse_args()

    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key and not args.dry_run:
        print("❌ Set GEMINI_API_KEY first: export GEMINI_API_KEY='AIza...'")
        sys.exit(1)

    with open(CATALOG_PATH) as f:
        catalog = json.load(f)

    stories = catalog
    if args.tier:
        stories = [s for s in stories if s["age_tier"] == args.tier]
    if args.id:
        stories = [s for s in stories if s["id"] == args.id]

    STORIES_DIR.mkdir(parents=True, exist_ok=True)
    to_generate = [s for s in stories if not (STORIES_DIR / f"{s['slug']}.json").exists()]

    if args.limit:
        to_generate = to_generate[:args.limit]

    print(f"\n🌙 NoorBedtime Story Generator (Gemini Flash — Free)")
    print(f"{'='*55}")
    print(f"Catalog: {len(catalog)} stories")
    print(f"Filtered: {len(stories)} | Already done: {len(stories) - len(to_generate)} | To generate: {len(to_generate)}")
    print(f"Model: {args.model} | Cost: $0.00")

    if args.dry_run:
        print("\n📋 Would generate:")
        for s in to_generate:
            print(f"  [{s['id']}] {s['title']} ({s['age_tier']})")
        return

    if not to_generate:
        print("\n✅ All stories already generated!")
        return

    confirm = input(f"\nGenerate {len(to_generate)} stories with Gemini Flash? (y/N): ").strip().lower()
    if confirm != "y":
        print("Cancelled.")
        return

    client = genai.Client(api_key=api_key)
    success, failed = 0, 0

    for i, entry in enumerate(to_generate):
        print(f"\n[{i+1}/{len(to_generate)}] {entry['title']} ({entry['age_tier']})")
        try:
            story = generate_story(client, entry, args.model)
            path = STORIES_DIR / f"{entry['slug']}.json"
            with open(path, "w") as f:
                json.dump(story, f, indent=2, ensure_ascii=False)
            mark_generated(entry["slug"])
            print(f"  ✅ Saved: {path.name} ({len(story['pages'])} pages)")
            success += 1
        except Exception as e:
            print(f"  ❌ Failed: {e}")
            failed += 1
        if i < len(to_generate) - 1:
            time.sleep(4)  # Gemini free tier: 15 RPM

    print(f"\n{'='*55}")
    print(f"✅ Success: {success} | ❌ Failed: {failed}")
    print(f"Stories saved to: {STORIES_DIR}")


if __name__ == "__main__":
    main()
