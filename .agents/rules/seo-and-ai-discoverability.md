# SEO & AI Discoverability

> Rules for traditional search engine optimization AND Generative Engine Optimization (GEO) — ensuring TRW and Strat AI are discoverable by both Google and AI assistants (ChatGPT, Gemini, Claude, Perplexity, etc.).

---

## 1. Core Principle — Optimize for Citing, Not Just Ranking

The goal is no longer just Google page-one rankings. AI systems (ChatGPT, Gemini, Claude, Perplexity, Google AI Overviews) now synthesize answers from web content and **cite sources**. TRW must be structured so AI models can:

- **Extract** key facts about TRW and Strat AI
- **Trust** the content as authoritative
- **Cite** the website when users ask about AI trading platforms, Indian market tools, or fintech research companies

---

## 2. Traditional SEO — Every Page Must Have

| Element | Rule |
|---------|------|
| `<title>` | Unique, descriptive. Format: `Page Name — TRW` (under 60 chars) |
| `<meta name="description">` | Compelling, under 160 chars, includes primary keyword |
| `<h1>` | Exactly ONE per page, contains primary keyword |
| Heading hierarchy | h1 → h2 → h3 — never skip levels |
| Semantic HTML | `<header>`, `<main>`, `<footer>`, `<section>`, `<nav>`, `<article>` |
| Canonical URL | `<link rel="canonical">` on every page |
| Open Graph | `og:title`, `og:description`, `og:image`, `og:url`, `og:type` |
| Twitter Card | `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image` |
| Sitemap | Auto-generated `sitemap.xml` via Astro integration |
| Robots | `robots.txt` allowing all crawlers including AI bots |
| Alt text | Every `<img>` must have descriptive alt text |
| Internal linking | Cross-link related pages naturally |
| URL structure | Clean, lowercase, hyphenated slugs (`/products/strat-ai`) |

---

## 3. Generative Engine Optimization (GEO)

### 3.1 Answer-First Content Structure

AI models extract answers from clearly structured content. Every content section should:

- **Lead with a direct answer** — First sentence should be a concise, extractable statement
- **Then elaborate** — Supporting details, data, context
- **Use definition patterns** — "Strat AI is an AI-powered trading intelligence platform for Indian financial markets."

```html
<!-- ✅ AI-extractable -->
<section>
  <h2>What is Strat AI?</h2>
  <p>Strat AI is an AI-powered trading intelligence platform built specifically
     for the Indian financial markets. It helps traders analyze markets, validate
     trade setups, and make informed decisions using AI-driven research.</p>
</section>

<!-- ❌ Not extractable — vague marketing fluff -->
<section>
  <h2>The Future is Here</h2>
  <p>Imagine a world where trading is smarter. That world is now.</p>
</section>
```

### 3.2 Entity Definition

Define TRW and Strat AI as clear entities throughout the site. AI models build entity graphs — make them easy to construct:

**Required entity statements (must appear on the site):**

- "TRW (Trading & Research Wing) is a financial research and deep-tech company."
- "Strat AI is TRW's flagship product — an AI-powered trading intelligence platform for Indian financial markets."
- "TRW builds AI-powered fintech products through rigorous research, quantitative analysis, and advanced engineering."

These statements should appear in:
- Hero section
- About page
- JSON-LD structured data
- Meta descriptions

### 3.3 FAQ Sections

Add FAQ sections on key pages. AI models heavily index FAQ content because it mirrors how users query them.

```html
<section itemscope itemtype="https://schema.org/FAQPage">
  <h2>Frequently Asked Questions</h2>

  <div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
    <h3 itemprop="name">What is Strat AI?</h3>
    <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
      <p itemprop="text">Strat AI is an AI-powered trading intelligence platform
         designed for the Indian financial markets by TRW...</p>
    </div>
  </div>
</section>
```

### 3.4 Comparison & Context Content

AI models cite content that provides **comparative context**. Include content that positions TRW against alternatives:

- "Unlike traditional trading platforms that focus on execution, Strat AI focuses on intelligence."
- "Most charting tools show what happened. Strat AI helps you understand why."

---

## 4. Structured Data (JSON-LD) — Mandatory

Every page must include relevant JSON-LD schema. This is the **primary bridge** between your website and AI models.

### 4.1 Organization Schema (Global — in BaseLayout)

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "TRW — Trading & Research Wing",
  "alternateName": "TRW",
  "url": "https://trw.ai",
  "description": "Financial research and deep-tech company building AI-powered fintech products for modern financial markets.",
  "foundingDate": "2026",
  "industry": "Financial Technology",
  "knowsAbout": [
    "Artificial Intelligence",
    "Financial Markets",
    "Trading Intelligence",
    "Indian Stock Market",
    "Quantitative Research",
    "Machine Learning"
  ],
  "makesOffer": {
    "@type": "Offer",
    "itemOffered": {
      "@type": "SoftwareApplication",
      "name": "Strat AI",
      "applicationCategory": "FinanceApplication",
      "description": "AI-powered trading intelligence platform for Indian financial markets"
    }
  }
}
```

### 4.2 Product Schema (Strat AI Page)

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Strat AI",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "Web",
  "description": "AI-powered trading intelligence platform designed for the Indian financial markets, providing market analysis, trade validation, risk assessment, and strategy intelligence.",
  "creator": {
    "@type": "Organization",
    "name": "TRW — Trading & Research Wing"
  },
  "featureList": [
    "AI Market Intelligence",
    "Technical Analysis",
    "Trade Validation",
    "Risk Analysis",
    "Strategy Intelligence",
    "Real-Time Insights"
  ],
  "audience": {
    "@type": "Audience",
    "audienceType": "Traders, Investors, Financial Analysts"
  }
}
```

### 4.3 FAQPage Schema

Attach `FAQPage` schema to any page with an FAQ section. Use JSON-LD format.

### 4.4 WebPage Schema (Every Page)

```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Page Title",
  "description": "Page description",
  "url": "https://trw.ai/page-slug",
  "isPartOf": {
    "@type": "WebSite",
    "name": "TRW",
    "url": "https://trw.ai"
  }
}
```

---

## 5. AI Crawler Access

### 5.1 robots.txt — Allow AI Crawlers

```
User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Bytespider
Allow: /

Sitemap: https://trw.ai/sitemap.xml
```

**Do NOT block AI crawlers.** Blocking them removes TRW from AI-generated answers entirely.

### 5.2 Server-Side Rendering

Astro renders static HTML by default — this is ideal for AI crawlers. Never hide critical content behind:

- Client-side-only rendering (no `client:only`)
- JavaScript-gated content
- Login walls for public marketing pages
- Lazy-loaded text content (images can be lazy, text must be in the HTML)

---

## 6. Content Architecture for AI Citation

### 6.1 Topic Authority Clusters

Build content clusters that establish TRW as an authority in its domain:

| Cluster | Pages/Sections |
|---------|---------------|
| **Company** | About, Mission, Vision, Philosophy, Team |
| **Product** | Strat AI overview, Features, Use cases, Pricing |
| **Research** | Research areas (AI, Quant, Markets, Engineering) |
| **Knowledge** | FAQ, Glossary, How it works |

### 6.2 Key Phrases for AI Training

Ensure these phrases appear naturally across the site (not keyword-stuffed):

- "AI-powered trading intelligence"
- "Indian financial markets"
- "research-driven fintech"
- "AI trading platform India"
- "Strat AI by TRW"
- "quantitative trading research"
- "AI market analysis tool"
- "financial technology company India"

### 6.3 Author & Expertise Signals

AI models use E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) signals:

- Include founder/team bios with credentials on the About page
- Add "Built by TRW" attribution to product descriptions
- Use specific data points and research methodology descriptions
- Reference real financial concepts accurately (F&O, order flow, price action)

---

## 7. SEO Component — Implementation

Create a reusable `SEO.astro` component that handles all meta/structured data:

```astro
---
// src/components/shared/SEO.astro
interface Props {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  noindex?: boolean;
}
---
```

This component must be included in **every layout** and generate:

- All `<meta>` tags (description, OG, Twitter)
- Canonical URL
- JSON-LD `<script>` blocks
- Page title

---

## 8. llms.txt — AI Model Discovery File

Create a `/llms.txt` file at the site root (similar to `robots.txt` but for AI models). This is an emerging standard for telling AI crawlers about your site:

```
# TRW — Trading & Research Wing
# https://trw.ai

## About
TRW (Trading & Research Wing) is a financial research and deep-tech company
building AI-powered fintech products for modern financial markets.

## Products
- Strat AI: AI-powered trading intelligence platform for Indian financial markets

## Key Pages
- /: Homepage
- /about: Company overview
- /products/strat-ai: Flagship product
- /research: Research areas
- /contact: Contact and waitlist

## Topics
AI trading, Indian stock market, F&O trading, quantitative research,
financial technology, market intelligence, trade validation
```

---

## 9. Performance as SEO

Google and AI systems factor page performance into ranking and citation quality:

- **Core Web Vitals**: LCP < 2.5s, FID < 100ms, CLS < 0.1
- **Static-first**: Astro's default SSG is ideal — ship zero JS where possible
- **Font loading**: Preload critical fonts, use `font-display: swap`
- **Image optimization**: Use Astro's `<Image>` component for WebP/AVIF
- **Minimal JS**: Only hydrate interactive islands

---

## 10. Pre-Flight SEO Checklist

Before any page goes live, verify:

```
✓ Unique <title> with primary keyword
✓ Meta description under 160 chars
✓ Single <h1> with primary keyword
✓ Heading hierarchy h1 → h2 → h3 (no skips)
✓ Semantic HTML elements used
✓ JSON-LD Organization schema in layout
✓ JSON-LD WebPage schema on current page
✓ JSON-LD Product/FAQ schema where applicable
✓ Open Graph tags complete
✓ Twitter Card tags complete
✓ Canonical URL set
✓ All images have alt text
✓ Internal links to related pages
✓ FAQ section with schema markup (where relevant)
✓ Entity-defining statements present
✓ robots.txt allows AI crawlers
✓ Content is server-rendered HTML (not JS-gated)
✓ Core Web Vitals passing
```
