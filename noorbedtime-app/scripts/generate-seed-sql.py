#!/usr/bin/env python3
"""
Reads all story JSON files and generates a SQL seed file
to insert into Supabase via the SQL Editor.
"""
import json
import os
import re
from pathlib import Path

STORIES_DIR = Path(__file__).parent.parent.parent / "stories"
OUTPUT_SQL = Path(__file__).parent / "seed_stories.sql"

STORAGE_BASE = "https://unlaqymnoapznqxeqgom.supabase.co/storage/v1/object/public/illustrations"

FREE_SLUGS = {
    "little-ant-big-thank-you",
    "boy-shared-last-date",
    "light-of-patience-yusuf",
    "twin-butterflies",
    "rescued-gazelle",
}

def escape_sql(s):
    if s is None:
        return "NULL"
    return "'" + str(s).replace("'", "''") + "'"

def bool_sql(b):
    return "true" if b else "false"

def generate():
    files = sorted(STORIES_DIR.glob("*.json"))
    if not files:
        print(f"No JSON files found in {STORIES_DIR}")
        return

    lines = [
        "-- NoorBedtime Story Seed",
        "-- Generated automatically — run in Supabase Dashboard > SQL Editor",
        "",
        "-- Clear existing data (safe to re-run)",
        "delete from public.story_pages;",
        "delete from public.stories;",
        "",
    ]

    total_stories = 0
    total_pages = 0

    for path in files:
        with open(path) as f:
            story = json.load(f)

        slug = story["slug"]
        is_free = slug in FREE_SLUGS
        cover_url = f"{STORAGE_BASE}/{slug}/page-00.webp"

        # Insert story
        lines.append(f"-- {story['title']}")
        lines.append(
            f"insert into public.stories "
            f"(title, slug, age_tier, age_range, category, source_reference, source_detail, "
            f"theme, description, reading_time_minutes, is_free, cover_image_url) values ("
            f"{escape_sql(story['title'])}, "
            f"{escape_sql(slug)}, "
            f"{escape_sql(story['age_tier'])}, "
            f"{escape_sql(story.get('age_range'))}, "
            f"{escape_sql(story.get('category'))}, "
            f"{escape_sql(story.get('source_reference'))}, "
            f"{escape_sql(story.get('source_detail'))}, "
            f"{escape_sql(story.get('theme'))}, "
            f"{escape_sql(story.get('description'))}, "
            f"{story.get('reading_time_minutes', 10)}, "
            f"{bool_sql(is_free)}, "
            f"{escape_sql(cover_url)}"
            f") on conflict (slug) do update set "
            f"title=excluded.title, is_free=excluded.is_free, cover_image_url=excluded.cover_image_url;"
        )

        # Insert pages
        for page in story.get("pages", []):
            page_num = page["page_number"]
            padded = str(page_num).zfill(2)
            illus_url = f"{STORAGE_BASE}/{slug}/page-{padded}.webp"

            lines.append(
                f"insert into public.story_pages "
                f"(story_id, page_number, text_content, illustration_url) "
                f"select id, {page_num}, {escape_sql(page.get('text'))}, {escape_sql(illus_url)} "
                f"from public.stories where slug={escape_sql(slug)} "
                f"on conflict (story_id, page_number) do update set "
                f"text_content=excluded.text_content, illustration_url=excluded.illustration_url;"
            )
            total_pages += 1

        lines.append("")
        total_stories += 1

    lines.append(f"-- Done: {total_stories} stories, {total_pages} pages")

    OUTPUT_SQL.write_text("\n".join(lines))
    print(f"✓ Generated {OUTPUT_SQL}")
    print(f"  {total_stories} stories, {total_pages} total pages")

if __name__ == "__main__":
    generate()
