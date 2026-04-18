# NoorBedtime Story Page SEO Checklist

Complete this checklist for every new story published on NoorBedtime.

---

## Pre-Publication Checklist

### URL Structure
- [ ] URL format: `/story/[kebab-case-story-title]`
- [ ] URL slug includes primary keyword where natural
- [ ] URL is descriptive and readable (avoid numbers or auto-generated IDs)
- [ ] URL is under 75 characters
- [ ] No duplicate URLs across collections
- [ ] 301 redirect set up if renaming existing story

### Title Tag
- [ ] Format: `[Story Title] — Islamic Bedtime Story for Kids | NoorBedtime`
- [ ] Length: 50-60 characters (optimal for SERPs)
- [ ] Includes primary keyword naturally
- [ ] No keyword stuffing
- [ ] Unique across all pages
- [ ] Example: `The Brave Heart of Bilal — Islamic Bedtime Story for Kids | NoorBedtime`

### Meta Description
- [ ] Length: 150-160 characters
- [ ] Includes primary keyword
- [ ] Clear call-to-action or hook
- [ ] Describes story value (moral lesson, character, theme)
- [ ] No duplicate descriptions
- [ ] Template: `Discover [Story Title], an Islamic bedtime story teaching [key value/lesson]. Perfect for Muslim kids ages [age range]. Read on NoorBedtime.`
- [ ] Example: `Discover the Brave Heart of Bilal, an Islamic bedtime story teaching courage and faith. Perfect for Muslim kids ages 5+. Read on NoorBedtime.`

### Heading Structure (H1/H2/H3)
- [ ] **One H1 only**: Story title (matches title tag)
- [ ] H1 includes primary keyword naturally
- [ ] H2s for story sections: "The Story", "Lesson & Values", "Discussion Questions", "More Stories Like This"
- [ ] H3s under each H2 for subsections (e.g., "What does Bilal teach us?")
- [ ] Logical hierarchy (no skipping levels: H1 → H2 → H3)
- [ ] At least 3-5 H2s for comprehensive coverage
- [ ] Keyword variations in H2/H3 where relevant

### Schema Markup
- [ ] Implement `Book` schema (JSON-LD)
- [ ] Include: name, author, description, image, datePublished, dateModified
- [ ] Add `Person` schema for prophet/companion featured
- [ ] Include `EducationalAlignment` (grade level)
- [ ] Add breadcrumb schema (Story > Collection > Library)
- [ ] Validate with Google's Rich Results Test
- [ ] Schema for age group targeting (Little Stars: 2-4, Rising Moons: 5-7, Young Explorers: 8-10)

### Image Optimization
- [ ] Hero image: 1200x800px minimum (16:9 ratio)
- [ ] All images compressed (target: <200KB per image)
- [ ] Alt text format: `[Character/Action] from [Story Title] — Islamic story for kids`
- [ ] Alt text includes keyword naturally (1-2 keywords max per image)
- [ ] No alt text keyword stuffing
- [ ] All images include descriptive filename: `bilal-brave-heart-story-illustration.jpg`
- [ ] Images formatted in WebP where supported, with JPG fallback
- [ ] No text embedded in images (use proper text instead)
- [ ] Decorative images have empty alt text (`alt=""`)

### Content Quality
- [ ] Minimum 1,000 words (story + lesson + discussion)
- [ ] Original, unique content (not copied from other sites)
- [ ] Readable font size: 16px+ body text
- [ ] Line spacing: 1.5-1.8 for readability
- [ ] Paragraph length: 3-5 sentences average
- [ ] Reading level: Age-appropriate (Flesch-Kincaid Grade 3-5 for target audience)
- [ ] One primary keyword targeted, 2-3 secondary keywords
- [ ] Natural keyword placement (no forcing)
- [ ] No keyword density stuffing (< 2.5% of content)

### Internal Linking
- [ ] 3-5 internal links minimum to other stories
- [ ] At least 1 link to `/library` hub page
- [ ] At least 1 link to relevant story collection (Little Stars/Rising Moons/Young Explorers)
- [ ] Anchor text is descriptive (avoid "click here", use `Related: [Story Title]`)
- [ ] Links to contextually related stories only
- [ ] No link to same story (avoid self-referential links)
- [ ] Link placement: Natural within content, not forced

### External Links
- [ ] Outbound links are authoritative and relevant
- [ ] Maximum 2-3 external links per story
- [ ] External links open in new tab (`target="_blank"`)
- [ ] Links are to Islamic education resources or trusted sources only

### Mobile & Page Speed
- [ ] Mobile-responsive design verified
- [ ] All images lazy-loaded
- [ ] Page load time: <3 seconds (test with PageSpeed Insights)
- [ ] Core Web Vitals: All "Good" (LCP, FID, CLS)
- [ ] No render-blocking resources
- [ ] Minified CSS/JavaScript

### Accessibility & User Experience
- [ ] Color contrast ratio: 4.5:1 minimum for text
- [ ] Button/link sizes: 44x44px minimum (mobile touch targets)
- [ ] Proper heading hierarchy for screen readers
- [ ] Image alt text is descriptive for visually impaired users
- [ ] No auto-playing audio/video
- [ ] Form fields have proper labels

---

## Publishing Checklist

### Content Sections Required
- [ ] **Story Title** (H1)
- [ ] **Age Group** badge/label (e.g., "For ages 5-7")
- [ ] **Reading Time** estimate
- [ ] **Key Values/Lessons** (bullet list above story)
- [ ] **The Story** section (H2) - main narrative
- [ ] **Lesson & Values** section (H2) - 2-3 key teachings
- [ ] **Discussion Questions** (H2) - 3-5 age-appropriate questions for parents/teachers
- [ ] **Related Stories** (H2) - 3-5 similar story links
- [ ] **Call-to-Action** - link to subscription or next story

### Collection Assignment
- [ ] Story assigned to correct collection (Little Stars/Rising Moons/Young Explorers)
- [ ] Collection based on age recommendation
- [ ] Story visible in collection page (manual verification)

### Social Metadata
- [ ] Open Graph title tag set
- [ ] Open Graph description set
- [ ] Open Graph image set (1200x630px)
- [ ] Twitter Card type: `summary_large_image`
- [ ] Twitter title, description, image set
- [ ] Verify with Social Media Meta Tags validator

### Canonical Tag
- [ ] Canonical URL set to self (prevents duplicate content issues)
- [ ] Format: `<link rel="canonical" href="https://noorbedtime.com/story/[slug]" />`

### Robots Meta Tags
- [ ] No `noindex` tag (story should be indexed)
- [ ] No `nofollow` for outbound links unless necessary
- [ ] `follow` tag set for internal links

---

## Post-Publication Verification

### Search Engine Submission
- [ ] Submitted to Google Search Console
- [ ] Submitted to Bing Webmaster Tools
- [ ] Sitemap updated (`/seo/sitemap.xml`)
- [ ] Submitted XML sitemap to Google Search Console

### Indexing Verification (24-48 hours)
- [ ] Story appears in Google Search (`site:noorbedtime.com/story/[slug]`)
- [ ] Story appears in Bing Search
- [ ] Google Rich Results Test shows schema markup correct
- [ ] Structured data validated without errors

### Performance Tracking Setup
- [ ] Google Analytics event tracking set up for story engagement
- [ ] Goal/conversion tracking if applicable
- [ ] Internal link tracking (where users go after reading)
- [ ] Time on page metric baseline recorded

### Link Building & Promotion
- [ ] Internal links added from relevant collection pages
- [ ] Story added to related stories section on older posts
- [ ] Social media promotion scheduled (Facebook, Instagram, TikTok)
- [ ] Email to subscriber list if applicable

---

## Ongoing Monitoring

### Weekly (First 4 Weeks)
- [ ] Google Search Console: Check impressions and clicks
- [ ] Google Analytics: Monitor bounce rate, time on page
- [ ] Identify internal linking opportunities from referring pages
- [ ] Fix any schema validation errors if discovered

### Monthly
- [ ] Review keyword ranking for primary/secondary keywords
- [ ] Check for indexing issues in Google Search Console
- [ ] Analyze user behavior metrics (scroll depth, click heatmap)
- [ ] Update `lastmod` date in sitemap if content updated

### Quarterly
- [ ] Audit internal link quality and anchor text
- [ ] Review and refresh outdated content
- [ ] Check for broken links (both internal and external)
- [ ] Compare performance against similar stories

---

## Common SEO Mistakes to Avoid

- ❌ Keyword stuffing in title, meta, or body
- ❌ Duplicate meta descriptions
- ❌ Broken internal links
- ❌ Missing or poor quality images
- ❌ Thin content (<500 words)
- ❌ No schema markup
- ❌ Mobile-unfriendly design
- ❌ Slow page load times
- ❌ Orphaned stories (no internal links)
- ❌ Auto-playing media
- ❌ Over-optimization of single keyword
- ❌ Inconsistent H1/H2 structure

---

## Tools & Resources

**SEO Validation**:
- Google Search Console: https://search.google.com/search-console
- Google Rich Results Test: https://search.google.com/test/rich-results
- PageSpeed Insights: https://pagespeed.web.dev/
- Lighthouse (Chrome DevTools)

**Keyword Research**:
- Google Keyword Planner
- SEMrush or Ahrefs (if available)
- Google Autocomplete
- Related searches on Google SERPs

**Content & Readability**:
- Hemingway Editor (readability check)
- Yoast SEO Readability Test
- Flesch-Kincaid Grade Level calculator

**Schema Validation**:
- Structured Data Testing Tool: https://schema.org/docs/schemas.html
- JSON-LD schema generator: https://jsonld.com/

**Performance**:
- Google PageSpeed Insights
- GTmetrix
- WebPageTest

---

## Template: Meta Description Examples

`Discover [STORY TITLE], an Islamic bedtime story about [MAIN CHARACTER]. Learn [KEY VALUE/LESSON] with this engaging tale perfect for Muslim kids ages [AGE RANGE]. Read free on NoorBedtime.`

**Examples**:
- "Discover the Brave Heart of Bilal, an Islamic bedtime story about courage and faith. Learn about this inspiring companion of Prophet Muhammad. Perfect for kids ages 5+. Read free on NoorBedtime."
- "Discover the Patience of Prophet Job, an Islamic story teaching perseverance and trust in Allah. Perfect for Muslim kids ages 6+. Read on NoorBedtime."
- "Discover Surah Al-Fil Explained, an Islamic story for kids about the elephant and divine protection. Engaging, age-appropriate, and teaching Quranic wisdom. Perfect for ages 5-8."

---

## Template: Story Schema Markup (JSON-LD)

```json
{
  "@context": "https://schema.org",
  "@type": "Book",
  "name": "[STORY TITLE]",
  "author": {
    "@type": "Organization",
    "name": "NoorBedtime"
  },
  "description": "[Meta description]",
  "image": "https://noorbedtime.com/images/[story-image].jpg",
  "datePublished": "[YYYY-MM-DD]",
  "dateModified": "[YYYY-MM-DD]",
  "publisher": {
    "@type": "Organization",
    "name": "NoorBedtime",
    "logo": "https://noorbedtime.com/logo.png"
  },
  "educationalAlignment": {
    "@type": "EducationalAlignment",
    "educationalFramework": "US K-12",
    "targetGrade": "[GRADE LEVEL: K-2, 3-5, etc.]"
  },
  "inLanguage": "en-US",
  "url": "https://noorbedtime.com/story/[slug]"
}
```

---

## Review Workflow (Before Publishing)

1. **Content Review**: Check story quality, age-appropriateness, Islamic accuracy
2. **SEO Review**: Verify title tag, meta description, H1/H2 structure, keywords
3. **Technical Review**: Validate schema, check mobile responsiveness, test images
4. **Link Review**: Ensure 3-5 internal links present and relevant
5. **Final Check**: Spelling, grammar, formatting, call-to-action clear
6. **Approval**: Sign-off before publication to Google/Bing

---

## Version Control

Last Updated: 2026-04-04
Version: 1.0
