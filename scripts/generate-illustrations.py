"""
NoorBedtime — Illustration Generator
===================================
Automatically generates illustrations for all stories using OpenAI gpt-image-1 API.
Each story JSON file contains illustration_prompt per page — this script reads them
and generates images, saving them alongside the stories.

Usage:
  1. Install: pip install openai
  2. Set your API key: export OPENAI_API_KEY="sk-your-key-here"
  3. Run: python generate-illustrations.py

Cost estimate: ~$0.034 per image (1024x1536, medium quality)
Total for ~60 pages across stories: ~$2.00-$3.50
"""

import os
import json
import time
import sys
from pathlib import Path

try:
    from openai import OpenAI
except ImportError:
    print("❌ OpenAI package not installed. Run: pip install openai")
    sys.exit(1)

# Configuration
STORIES_DIR = Path(__file__).parent.parent / "stories"
IMAGES_DIR = Path(__file__).parent.parent / "images"
IMAGE_SIZE = "1024x1536"  # Options: 1024x1024, 1024x1536, 1536x1024
IMAGE_QUALITY = "medium"  # "low" ($0.011), "medium" ($0.034), "high" ($0.167)
MODEL = "gpt-image-1"

# NoorBedtime art style prefix (prepended to every prompt for consistency)
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


def load_stories():
    """Load all story JSON files from the stories directory."""
    stories = []
    for json_file in sorted(STORIES_DIR.glob("*.json")):
        with open(json_file, "r") as f:
            story = json.load(f)
            story["_filename"] = json_file.stem
            stories.append(story)
    return stories


def generate_image(client, prompt, story_slug, page_num, retry_count=3):
    """Generate a single illustration using gpt-image-1."""
    full_prompt = STYLE_PREFIX + prompt

    image_path = IMAGES_DIR / story_slug / f"page-{page_num:02d}.png"
    if image_path.exists():
        print(f"  ⏭️  Page {page_num} already exists, skipping.")
        return str(image_path)

    for attempt in range(retry_count):
        try:
            print(f"  🎨 Generating page {page_num}...", end=" ", flush=True)
            response = client.images.generate(
                model=MODEL,
                prompt=full_prompt,
                size=IMAGE_SIZE,
                quality=IMAGE_QUALITY,
                n=1,
            )

            # gpt-image-1 returns base64-encoded images
            import base64
            image_b64 = response.data[0].b64_json
            image_bytes = base64.b64decode(image_b64)

            image_path.parent.mkdir(parents=True, exist_ok=True)
            with open(image_path, "wb") as img_file:
                img_file.write(image_bytes)

            print(f"✅ Saved to {image_path.name}")

            # Save the prompt for reference
            meta_path = IMAGES_DIR / story_slug / f"page-{page_num:02d}-prompt.txt"
            with open(meta_path, "w") as f:
                f.write(f"Original prompt:\n{prompt}")

            return str(image_path)

        except Exception as e:
            print(f"⚠️ Attempt {attempt + 1} failed: {e}")
            if attempt < retry_count - 1:
                wait_time = (attempt + 1) * 5
                print(f"  Retrying in {wait_time}s...")
                time.sleep(wait_time)
            else:
                print(f"  ❌ Failed after {retry_count} attempts")
                return None


def generate_cover(client, story):
    """Generate a cover image for the story."""
    cover_prompt = (
        f"Book cover illustration for a children's bedtime story called '{story['title']}'. "
        f"{story['description']} "
        f"Beautiful, inviting cover with the title area at the top. "
        f"Enchanting scene that makes children want to read this story."
    )
    return generate_image(client, cover_prompt, story["slug"], 0)


def main():
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--limit", type=int, default=None, help="Limit number of stories to process")
    parser.add_argument("--yes", action="store_true", help="Skip confirmation prompt")
    parser.add_argument("--start-from", type=str, default=None, help="Start from story slug (e.g. seed-of-change)")
    args = parser.parse_args()

    # Check API key
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        print("❌ OPENAI_API_KEY not set!")
        print("   Run: export OPENAI_API_KEY='sk-your-key-here'")
        print("   Get your key at: https://platform.openai.com/api-keys")
        sys.exit(1)

    client = OpenAI(api_key=api_key)

    # Create output directory
    IMAGES_DIR.mkdir(parents=True, exist_ok=True)

    # Load stories
    stories = load_stories()
    if not stories:
        print(f"❌ No story JSON files found in {STORIES_DIR}")
        sys.exit(1)

    if args.start_from:
        slugs = [s["_filename"] for s in stories]
        if args.start_from in slugs:
            stories = stories[slugs.index(args.start_from):]
        else:
            print(f"❌ Story slug '{args.start_from}' not found.")
            sys.exit(1)

    if args.limit:
        stories = stories[:args.limit]

    print(f"\n🌙 NoorBedtime Illustration Generator")
    print(f"{'=' * 50}")
    print(f"Found {len(stories)} stories")

    total_pages = sum(len(s["pages"]) for s in stories)
    total_images = total_pages + len(stories)  # pages + covers
    est_cost_low = total_images * 0.034  # medium quality
    est_cost_high = total_images * 0.167  # high quality

    print(f"Total images to generate: {total_images} ({total_pages} pages + {len(stories)} covers)")
    print(f"Estimated cost: ${est_cost_low:.2f} - ${est_cost_high:.2f}")
    print(f"Image size: {IMAGE_SIZE}, Quality: {IMAGE_QUALITY}")
    print()

    # Ask for confirmation
    if not args.yes:
        confirm = input("Proceed? (y/N): ").strip().lower()
        if confirm != "y":
            print("Cancelled.")
            sys.exit(0)

    # Generate illustrations
    results = {"success": 0, "failed": 0}

    for story in stories:
        print(f"\n📖 {story['title']} ({len(story['pages'])} pages)")
        print(f"   Age tier: {story['age_tier']}")
        print(f"   Source: {story['source_reference']}")
        print()

        # Generate cover
        print("  📕 Generating cover...")
        cover_path = generate_cover(client, story)
        if cover_path:
            results["success"] += 1
        else:
            results["failed"] += 1

        # Generate page illustrations
        for page in story["pages"]:
            path = generate_image(
                client,
                page["illustration_prompt"],
                story["slug"],
                page["page_number"],
            )
            if path:
                results["success"] += 1
            else:
                results["failed"] += 1

            # Rate limiting — gpt-image-1 allows ~7 images/min on free tier
            time.sleep(9)

    # Summary
    print(f"\n{'=' * 50}")
    print(f"🌙 Generation Complete!")
    print(f"   ✅ Success: {results['success']}")
    print(f"   ❌ Failed: {results['failed']}")
    print(f"   📁 Images saved to: {IMAGES_DIR}")


if __name__ == "__main__":
    main()
