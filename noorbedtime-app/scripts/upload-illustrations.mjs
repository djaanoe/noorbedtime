#!/usr/bin/env node
/**
 * Upload all WebP illustrations to Supabase Storage.
 * Run AFTER creating the 'illustrations' bucket in Supabase Dashboard.
 *
 * Usage:
 *   SUPABASE_SERVICE_KEY=your_service_role_key node scripts/upload-illustrations.mjs
 *
 * Or set it in .env.local as SUPABASE_SERVICE_KEY=...
 */

import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env.local manually
const envPath = path.join(__dirname, "../.env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
    const [k, ...v] = line.split("=");
    if (k && !k.startsWith("#") && v.length) {
      process.env[k.trim()] = v.join("=").trim();
    }
  }
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY =
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const BUCKET = "illustrations";
const IMAGES_DIR = path.join(__dirname, "../../images-compressed");

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

function walkDir(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walkDir(full));
    else if (entry.name.endsWith(".webp")) files.push(full);
  }
  return files;
}

async function ensureBucket() {
  const { data, error } = await supabase.storage.getBucket(BUCKET);
  if (error?.message?.includes("not found") || !data) {
    console.log(`Creating bucket '${BUCKET}'...`);
    const { error: createErr } = await supabase.storage.createBucket(BUCKET, {
      public: true,
      allowedMimeTypes: ["image/webp"],
    });
    if (createErr) {
      console.error(`✗ Could not create bucket: ${createErr.message}`);
      console.log(
        "\n→ Please create bucket manually in Supabase Dashboard > Storage:\n" +
          "  Name: illustrations\n  Public: ON\n"
      );
      return false;
    }
    console.log(`✓ Bucket '${BUCKET}' created`);
  } else {
    console.log(`✓ Bucket '${BUCKET}' already exists`);
  }
  return true;
}

async function main() {
  if (!fs.existsSync(IMAGES_DIR)) {
    console.error(`Images directory not found: ${IMAGES_DIR}`);
    process.exit(1);
  }

  const files = walkDir(IMAGES_DIR);
  console.log(`Found ${files.length} WebP files\n`);

  await ensureBucket();

  let success = 0;
  const failed = [];
  const CONCURRENCY = 5;

  async function uploadFile(filePath) {
    const storagePath = path.relative(IMAGES_DIR, filePath).replace(/\\/g, "/");
    const buffer = fs.readFileSync(filePath);

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, buffer, {
        contentType: "image/webp",
        upsert: true,
      });

    if (error) {
      failed.push({ path: storagePath, error: error.message });
      return false;
    }
    return true;
  }

  // Upload in batches
  for (let i = 0; i < files.length; i += CONCURRENCY) {
    const batch = files.slice(i, i + CONCURRENCY);
    const results = await Promise.all(batch.map(uploadFile));
    success += results.filter(Boolean).length;

    if ((i + CONCURRENCY) % 50 === 0 || i + CONCURRENCY >= files.length) {
      const done = Math.min(i + CONCURRENCY, files.length);
      process.stdout.write(
        `\r  [${done}/${files.length}] ✓ ${success} uploaded, ✗ ${failed.length} failed`
      );
    }
  }

  console.log(`\n\n${"=".repeat(50)}`);
  console.log(`✓ ${success}/${files.length} illustrations uploaded to Supabase Storage`);

  if (failed.length > 0) {
    console.log(`\n✗ Failed (${failed.length}):`);
    failed.slice(0, 10).forEach((f) => console.log(`  - ${f.path}: ${f.error}`));
    if (failed.length > 10) console.log(`  ... and ${failed.length - 10} more`);
  }

  console.log(`\nPublic URL format:`);
  console.log(`  ${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/{slug}/page-00.webp`);
}

main().catch(console.error);
