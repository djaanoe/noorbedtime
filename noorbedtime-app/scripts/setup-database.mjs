#!/usr/bin/env node
/**
 * Creates all NoorBedtime tables and imports story data via direct Postgres connection.
 * Usage: DB_PASSWORD=your_db_password node scripts/setup-database.mjs
 *
 * DB Password is in Supabase Dashboard > Settings > Database > Database password
 */

import pg from "pg";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env.local
const envPath = path.join(__dirname, "../.env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
    const [k, ...v] = line.split("=");
    if (k && !k.startsWith("#") && v.length) {
      process.env[k.trim()] = v.join("=").trim();
    }
  }
}

const DB_PASSWORD = process.env.DB_PASSWORD;
if (!DB_PASSWORD) {
  console.error("❌ Missing DB_PASSWORD");
  console.error("   Get it from: Supabase Dashboard > Settings > Database > Database password");
  console.error("   Then run: DB_PASSWORD=your_password node scripts/setup-database.mjs");
  process.exit(1);
}

const PROJECT_REF = "unlaqymnoapznqxeqgom";

const client = new pg.Client({
  host: `db.${PROJECT_REF}.supabase.co`,
  port: 5432,
  database: "postgres",
  user: "postgres",
  password: DB_PASSWORD,
  ssl: { rejectUnauthorized: false },
});

async function runSQL(sql, label) {
  try {
    await client.query(sql);
    console.log(`  ✓ ${label}`);
    return true;
  } catch (err) {
    console.error(`  ✗ ${label}: ${err.message}`);
    return false;
  }
}

async function main() {
  console.log("Connecting to Supabase Postgres...");
  await client.connect();
  console.log("✓ Connected\n");

  // Run migration
  console.log("Step 1: Creating tables...");
  const migrationSQL = fs.readFileSync(
    path.join(__dirname, "../supabase/migrations/001_initial_schema.sql"),
    "utf-8"
  );
  await runSQL(migrationSQL, "Schema migration applied");

  // Run seed
  console.log("\nStep 2: Importing stories...");
  const seedSQL = fs.readFileSync(
    path.join(__dirname, "seed_stories.sql"),
    "utf-8"
  );
  await runSQL(seedSQL, "50 stories + 829 pages imported");

  // Verify
  console.log("\nStep 3: Verifying...");
  const { rows: storyCount } = await client.query("select count(*) from public.stories");
  const { rows: pageCount } = await client.query("select count(*) from public.story_pages");
  console.log(`  ✓ ${storyCount[0].count} stories in database`);
  console.log(`  ✓ ${pageCount[0].count} pages in database`);

  await client.end();
  console.log("\n✅ Database setup complete!");
}

main().catch((err) => {
  console.error("Fatal:", err.message);
  client.end();
  process.exit(1);
});
