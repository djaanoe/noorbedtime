#!/usr/bin/env python3
"""
Upload all WebP illustrations from images-compressed/ to Supabase Storage.
Bucket: illustrations (must be public)

Requirements: pip3 install httpx
Usage: python3 scripts/upload-illustrations.py
"""
import os
import sys
import time
from pathlib import Path

try:
    import httpx
except ImportError:
    print("Installing httpx...")
    os.system("pip3 install httpx -q")
    import httpx

SUPABASE_URL = "https://unlaqymnoapznqxeqgom.supabase.co"
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_KEY") or os.environ.get(
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "sb_publishable_eLMd3ATdRXTrSNUl9ovIwg_uyC1Fnkx"
)
BUCKET = "illustrations"
IMAGES_DIR = Path(__file__).parent.parent.parent / "images-compressed"

HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
}

def ensure_bucket(client: httpx.Client):
    resp = client.get(f"{SUPABASE_URL}/storage/v1/bucket/{BUCKET}", headers=HEADERS)
    if resp.status_code == 404:
        print(f"Creating bucket '{BUCKET}'...")
        r = client.post(
            f"{SUPABASE_URL}/storage/v1/bucket",
            headers=HEADERS,
            json={"id": BUCKET, "name": BUCKET, "public": True},
        )
        if r.status_code not in (200, 201):
            print(f"  ✗ Could not create bucket: {r.text}")
            print("  → Create bucket manually in Supabase Dashboard > Storage")
            return False
        print(f"  ✓ Bucket '{BUCKET}' created (public)")
    elif resp.status_code == 200:
        print(f"  ✓ Bucket '{BUCKET}' already exists")
    else:
        print(f"  ⚠ Bucket check returned {resp.status_code}: {resp.text[:200]}")
        print("  → Ensure bucket exists in Supabase Dashboard > Storage")
    return True

def upload_file(client: httpx.Client, local_path: Path, storage_path: str) -> bool:
    with open(local_path, "rb") as f:
        data = f.read()

    upload_headers = {
        **HEADERS,
        "Content-Type": "image/webp",
        "x-upsert": "true",
    }
    resp = client.post(
        f"{SUPABASE_URL}/storage/v1/object/{BUCKET}/{storage_path}",
        headers=upload_headers,
        content=data,
        timeout=30,
    )
    return resp.status_code in (200, 201)

def main():
    webp_files = sorted(IMAGES_DIR.rglob("*.webp"))
    if not webp_files:
        print(f"No WebP files found in {IMAGES_DIR}")
        sys.exit(1)

    print(f"Found {len(webp_files)} WebP files in {IMAGES_DIR}")
    print(f"Uploading to Supabase Storage bucket '{BUCKET}'...\n")

    with httpx.Client() as client:
        bucket_ok = ensure_bucket(client)
        if not bucket_ok:
            print("\n⚠ Proceeding anyway — uploads may fail without bucket.")

        success = 0
        failed = []

        for i, path in enumerate(webp_files, 1):
            # storage path: story-slug/page-00.webp
            relative = path.relative_to(IMAGES_DIR)
            storage_path = str(relative).replace("\\", "/")

            ok = upload_file(client, path, storage_path)
            if ok:
                success += 1
                if i % 50 == 0 or i == len(webp_files):
                    print(f"  [{i}/{len(webp_files)}] ✓ {success} uploaded, {len(failed)} failed")
            else:
                failed.append(storage_path)
                print(f"  [{i}/{len(webp_files)}] ✗ Failed: {storage_path}")

            # Small delay every 100 files to avoid rate limits
            if i % 100 == 0:
                time.sleep(1)

    print(f"\n{'='*50}")
    print(f"✓ {success}/{len(webp_files)} illustrations uploaded")
    if failed:
        print(f"✗ {len(failed)} failed:")
        for f in failed[:10]:
            print(f"  - {f}")
        if len(failed) > 10:
            print(f"  ... and {len(failed)-10} more")
    else:
        print("All illustrations uploaded successfully!")
    print(f"\nPublic URL base:")
    print(f"  {SUPABASE_URL}/storage/v1/object/public/{BUCKET}/{{slug}}/page-00.webp")

if __name__ == "__main__":
    main()
