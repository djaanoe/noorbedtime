"""
NoorBedtime — Illustration Generator (fal.ai FLUX)
====================================================
Generates children's book illustrations using fal.ai FLUX models.
$1 free credit on signup (~333 images at $0.003/image with flux/schnell).

Setup:
  pip install fal-client requests
  1. Sign up at https://fal.ai
  2. Get API key at https://fal.ai/dashboard/keys
  3. export FAL_KEY="your-key-here"

Usage:
  python generate-illustrations-free.py                  # All stories without illustrations
  python generate-illustrations-free.py --story slug     # One story only (by slug)
  python generate-illustrations-free.py --start-from slug # Resume from this slug
  python generate-illustrations-free.py --limit 5        # Max 5 stories
  python generate-illustrations-free.py --yes            # Skip confirmation
  python generate-illustrations-free.py --model fal-ai/flux/dev  # Higher quality (~$0.025/img)

Models:
  fal-ai/flux/schnell  — fast, ~$0.003/image (default, good for bulk)
  fal-ai/flux/dev      — better quality, ~$0.025/image
  fal-ai/flux-realism  — photorealistic style
"""

import os, json, sys, time, hashlib, argparse
from pathlib import Path

try:
    import fal_client
except ImportError:
    print("Run: pip install fal-client")
    sys.exit(1)

try:
    import requests
except ImportError:
    print("Run: pip install requests")
    sys.exit(1)

STORIES_DIR = Path(__file__).parent.parent / "stories"
IMAGES_DIR = Path(__file__).parent.parent / "images"
DEFAULT_MODEL = "fal-ai/flux/schnell"

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


def slug_seed(slug: str) -> int:
    """Deterministic seed so characters stay visually consistent across pages."""
    return int(hashlib.sha256(slug.encode()).hexdigest()[:8], 16) % 1_000_000


def load_stories(story_slug=None):
    pattern = f"{story_slug}.json" if story_slug else "*.json"
    stories = []
    for json_file in sorted(STORIES_DIR.glob(pattern)):
        with open(json_file) as f:
            story = json.load(f)
            story["_filename"] = json_file.stem
            stories.append(story)
    return stories


def generate_image(prompt, story_slug, page_num, seed, model, retry_count=3):
    full_prompt = (STYLE_PREFIX + prompt)[:2000]
    image_path = IMAGES_DIR / story_slug / f"page-{page_num:02d}.png"

    if image_path.exists():
        print(f"  ⏭️  Page {page_num:02d} already exists, skipping.")
        return True

    image_path.parent.mkdir(parents=True, exist_ok=True)

    for attempt in range(retry_count):
        try:
            print(f"  🎨 Generating page {page_num:02d}...", end=" ", flush=True)
            result = fal_client.run(
                model,
                arguments={
                    "prompt": full_prompt,
                    "image_size": {"width": 1024, "height": 1536},
                    "num_images": 1,
                    "seed": seed,
                },
            )
            image_url = result["images"][0]["url"]
            resp = requests.get(image_url, timeout=60)
            resp.raise_for_status()
            with open(image_path, "wb") as f:
                f.write(resp.content)
            print(f"✅ {image_path.name}")
            return True
        except Exception as e:
            print(f"⚠️ Attempt {attempt + 1} failed: {e}")
            if attempt < retry_count - 1:
                wait = (attempt + 1) * 5
                print(f"  Retrying in {wait}s...")
                time.sleep(wait)
            else:
                print(f"  ❌ Failed after {retry_count} attempts")
                return False


def generate_cover(story, base_seed, model):
    cover_prompt = (
        f"Book cover illustration for a children's bedtime story called '{story['title']}'. "
        f"{story['description']} "
        f"Beautiful, inviting cover with the title area at the top. "
        f"Enchanting scene that makes children want to read this story."
    )
    return generate_image(cover_prompt, story["slug"], 0, base_seed, model)


def main():
    parser = argparse.ArgumentParser(description="NoorBedtime Illustration Generator (fal.ai FLUX)")
    parser.add_argument("--story", type=str, help="Generate for one story only (by slug)")
    parser.add_argument("--start-from", type=str, help="Resume from this slug")
    parser.add_argument("--limit", type=int, help="Max number of stories to process")
    parser.add_argument("--model", default=DEFAULT_MODEL, help=f"fal.ai model (default: {DEFAULT_MODEL})")
    parser.add_argument("--yes", action="store_true", help="Skip confirmation")
    args = parser.parse_args()

    fal_key = os.environ.get("FAL_KEY")
    if not fal_key:
        print("❌ FAL_KEY not set. To get one:")
        print("   1. Sign up at https://fal.ai  ($1 free credit = ~333 images)")
        print("   2. Get key at https://fal.ai/dashboard/keys")
        print("   3. export FAL_KEY='your-key-here'")
        sys.exit(1)

    os.environ["FAL_KEY"] = fal_key

    IMAGES_DIR.mkdir(parents=True, exist_ok=True)
    stories = load_stories(args.story)

    if not stories:
        print(f"❌ No story JSON files found{' for: ' + args.story if args.story else ''}")
        sys.exit(1)

    # Default: skip stories that already have an images folder
    if not args.story:
        stories = [s for s in stories if not (IMAGES_DIR / s["slug"]).exists()]

    if args.start_from:
        slugs = [s["_filename"] for s in stories]
        if args.start_from in slugs:
            stories = stories[slugs.index(args.start_from):]
        else:
            print(f"❌ Slug '{args.start_from}' not found.")
            sys.exit(1)

    if args.limit:
        stories = stories[:args.limit]

    if not stories:
        print("✅ All stories already have illustrations!")
        return

    total_images = sum(len(s["pages"]) + 1 for s in stories)
    cost_per_img = 0.025 if "dev" in args.model else 0.003
    est_cost = total_images * cost_per_img

    print(f"\n🌙 NoorBedtime Illustration Generator (fal.ai)")
    print(f"{'='*55}")
    print(f"Model: {args.model}")
    print(f"Stories: {len(stories)} | Images: {total_images}")
    print(f"Estimated cost: ~${est_cost:.2f}")
    print()

    if not args.yes:
        confirm = input("Proceed? (y/N): ").strip().lower()
        if confirm != "y":
            print("Cancelled.")
            return

    results = {"success": 0, "failed": 0}

    for story in stories:
        num_pages = len(story["pages"])
        print(f"\n📖 {story['title']} ({num_pages} pages + cover)")
        base_seed = slug_seed(story["slug"])

        ok = generate_cover(story, base_seed, args.model)
        results["success" if ok else "failed"] += 1
        time.sleep(1)

        for page in story["pages"]:
            seed = base_seed + page["page_number"]
            ok = generate_image(
                page["illustration_prompt"], story["slug"], page["page_number"], seed, args.model
            )
            results["success" if ok else "failed"] += 1
            time.sleep(1)

    print(f"\n{'='*55}")
    print(f"🌙 Done! ✅ {results['success']} success | ❌ {results['failed']} failed")
    print(f"Images saved to: {IMAGES_DIR}")


if __name__ == "__main__":
    main()
