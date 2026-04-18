"""
NoorBedtime — Single Story Illustration Generator
=================================================
Generate illustrations for just one story at a time.
Useful for testing with a single story before batch generating all.

Usage:
  export OPENAI_API_KEY="sk-your-key-here"
  python generate-single-story.py ../stories/story-little-ant.json
"""

import os
import json
import sys
import time
from pathlib import Path

try:
    from openai import OpenAI
except ImportError:
    print("❌ Run: pip install openai")
    sys.exit(1)

IMAGES_DIR = Path(__file__).parent.parent / "images"

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


def main():
    if len(sys.argv) < 2:
        print("Usage: python generate-single-story.py <story.json> [page_number]")
        print("  page_number: optional, generate only this page (0 = cover)")
        sys.exit(1)

    story_path = Path(sys.argv[1])
    single_page = int(sys.argv[2]) if len(sys.argv) > 2 else None

    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        print("❌ Set OPENAI_API_KEY first")
        sys.exit(1)

    with open(story_path) as f:
        story = json.load(f)

    client = OpenAI(api_key=api_key)
    slug = story["slug"]
    out_dir = IMAGES_DIR / slug
    out_dir.mkdir(parents=True, exist_ok=True)

    print(f"🌙 NoorBedtime — Generating illustrations for: {story['title']}")
    print(f"   Output: {out_dir}")

    pages_to_generate = []
    if single_page is not None:
        if single_page == 0:
            pages_to_generate = [{"page_number": 0, "illustration_prompt":
                f"Book cover for '{story['title']}'. {story['description']}. "
                f"Beautiful children's book cover, enchanting and inviting."}]
        else:
            pages_to_generate = [p for p in story["pages"] if p["page_number"] == single_page]
    else:
        # Cover + all pages
        pages_to_generate = [{"page_number": 0, "illustration_prompt":
            f"Book cover for '{story['title']}'. {story['description']}. "
            f"Beautiful children's book cover, enchanting and inviting."}]
        pages_to_generate.extend(story["pages"])

    for i, page in enumerate(pages_to_generate):
        pnum = page["page_number"]
        prompt = STYLE_PREFIX + page["illustration_prompt"]

        print(f"\n  🎨 Page {pnum}...", end=" ", flush=True)
        try:
            response = client.images.generate(
                model="gpt-image-1",
                prompt=prompt,
                size="1024x1536",
                quality="medium",
                n=1,
            )
            # gpt-image-1 returns base64-encoded images
            import base64
            image_b64 = response.data[0].b64_json
            image_bytes = base64.b64decode(image_b64)

            img_path = out_dir / f"page-{pnum:02d}.png"
            with open(img_path, "wb") as img_file:
                img_file.write(image_bytes)
            print(f"✅ {img_path.name}")

            # Save prompt metadata
            meta = out_dir / f"page-{pnum:02d}-prompt.txt"
            with open(meta, "w") as f:
                f.write(f"Original: {page['illustration_prompt']}")

        except Exception as e:
            print(f"❌ {e}")

        if i < len(pages_to_generate) - 1:
            time.sleep(9)

    print(f"\n✅ Done! Check {out_dir}")


if __name__ == "__main__":
    main()
