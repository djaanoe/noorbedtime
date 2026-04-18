# NoorBedtime — Setup & Execution Guide (Updated)

**Strategy:** Direct-to-product (no waitlist), SEO/SEM-first GTM, 50 stories at launch.

---

## Quick Start — What to Do RIGHT NOW

### Step 1: Preview the Homepage
```bash
open "landing-page/index.html"   # Mac
# or just double-click the file in Finder
```

### Step 2: Generate All 50 Stories (~$1.25 total)
```bash
# Install dependencies
pip install openai anthropic

# Option A: OpenAI GPT-4o (~$0.025/story = $1.25 total)
export OPENAI_API_KEY="sk-..."
cd scripts
python generate-stories-batch.py --dry-run    # See cost estimate first
python generate-stories-batch.py              # Generate all 50

# Option B: Claude Sonnet (~$0.02/story = $1.00 total)
export ANTHROPIC_API_KEY="sk-ant-..."
python generate-stories-claude.py
```

### Step 3: Generate All Illustrations (~$8-15 total)
```bash
# After stories are generated:
export OPENAI_API_KEY="sk-..."
python generate-illustrations.py

# Or test with one story first:
python generate-single-story.py "../stories/the-little-ants-big-thank-you.json" 1
```

### Step 4: Deploy to Cloudflare Pages (Free — commercial use allowed!)
```bash
# Option A: Wrangler CLI
npm install -g wrangler
wrangler login
# Then deploy via Cloudflare Pages dashboard (connect GitHub repo)

# Option B: Dashboard (RECOMMENDED for non-technical)
# Go to dash.cloudflare.com → Workers & Pages → Create → Pages
# Connect GitHub → select "noorbedtime" repo → set build output to "landing-page"
# Deploy → get URL like https://noorbedtime.pages.dev
```

### Step 5: Buy Domain
Check availability: noorbedtime.com / noorbedtime.app
Registrar: Namecheap or Cloudflare (~$10-15/year)
Connect in Cloudflare Pages → Custom domains (if DNS already on Cloudflare, it's instant!)

---

## Full Pipeline: From Catalog to Live Stories

```
story-catalog.json (50 story ideas)
       │
       ▼  generate-stories-batch.py or generate-stories-claude.py
stories/*.json (50 full stories with text + illustration prompts)
       │
       ▼  generate-illustrations.py
images/{slug}/*.png (illustrations for all pages)
       │
       ▼  Deploy with Next.js app (Phase 2)
Live website with all stories readable
```

---

## Cost Summary

| Item | Cost |
|------|------|
| 50 story texts (GPT-4o) | ~$1.25 |
| 50 story texts (Claude) | ~$1.00 |
| ~400 illustrations (gpt-image-1 medium) | ~$13.60 |
| ~400 illustrations (gpt-image-1 high) | ~$66.80 |
| Domain (yearly) | ~$12.00 |
| Cloudflare Pages hosting | Free |
| Supabase (free tier) | Free |
| **Total to launch** | **~$30-45** |

---

## SEO Setup After Deploy

1. Submit sitemap to Google Search Console: `seo/sitemap.xml`
2. Add `seo/robots.txt` to site root
3. Schema markup is already embedded in `index.html`
4. Follow `seo/seo-checklist.md` for every new story page
5. Use `seo/keyword-strategy.md` for blog post planning

---

## Next Phase: Build Full Next.js App

After deploying the landing page and generating content:

1. Open VS Code + Claude Code terminal
2. Tell Claude Code: "Set up a Next.js 14 project with Supabase, Tailwind, and Lemon Squeezy for the NoorBedtime app. The landing page HTML is in landing-page/index.html, stories are in stories/*.json, and illustrations in images/."
3. Claude Code will scaffold the full app
4. Key pages to build: /library, /story/[slug], /read/[slug], /auth, /credits, /account

---

## Folder Structure

```
Moslem Kids Stories/
├── DEVELOPMENT-PLAN.md              ← Master strategic plan
├── ART-STYLE-GUIDE.md               ← Illustration guidelines
├── SETUP-GUIDE.md                   ← This file
├── landing-page/
│   └── index.html                   ← Homepage (deploy this first)
├── stories/
│   ├── story-little-ant.json        ← 3 sample stories (already done)
│   ├── story-sharing-date.json
│   ├── story-young-yusuf.json
│   └── ... (47 more after batch generation)
├── scripts/
│   ├── story-catalog.json           ← 50 story ideas with metadata
│   ├── generate-stories-batch.py    ← Generate stories via OpenAI
│   ├── generate-stories-claude.py   ← Generate stories via Claude
│   ├── generate-illustrations.py    ← Generate all illustrations
│   └── generate-single-story.py     ← Generate for one story
├── seo/
│   ├── sitemap.xml                  ← XML sitemap for Google
│   ├── robots.txt                   ← Crawler rules
│   ├── keyword-strategy.md          ← Full keyword research
│   └── seo-checklist.md             ← Per-page SEO checklist
└── images/                          ← Generated illustrations
```
