# Astro Best Practices

> Astro-specific development patterns for the TRW project.

---

## 1. Project Structure

```
src/
├── assets/              # Static assets (images, fonts, SVGs)
│   ├── images/
│   ├── fonts/
│   └── icons/
├── components/
│   ├── ui/              # Design system primitives (Button, Card, Badge, etc.)
│   ├── sections/        # Page-level sections (Hero, Features, Pricing, CTA, etc.)
│   ├── navigation/      # Navbar, Footer, MobileMenu, NavPillGroup
│   └── shared/          # Cross-cutting (SEO, Schema, ScrollToTop)
├── constants/           # Static data arrays, navigation config, pricing data
├── hooks/               # React hooks (for interactive islands only)
├── layouts/             # Page layouts (BaseLayout, MarketingLayout)
├── pages/               # Astro pages (file-based routing)
├── services/            # API calls, external service integrations
├── styles/              # Global CSS, Tailwind config, design tokens
├── types/               # TypeScript type definitions
└── utils/               # Pure utility functions
```

---

## 2. Page Architecture

Pages should be thin orchestration layers — NOT containers for UI code.

### ✅ Correct Page Pattern

```astro
---
// src/pages/index.astro
import BaseLayout from '@/layouts/BaseLayout.astro';
import Hero from '@/components/sections/Hero.astro';
import Features from '@/components/sections/Features.astro';
import Product from '@/components/sections/Product.astro';
import CTA from '@/components/sections/CTA.astro';
---

<BaseLayout title="TRW — Trading Intelligence, Built on Research">
  <Hero />
  <Features />
  <Product />
  <CTA />
</BaseLayout>
```

Pages should typically be **under 50 lines**.

---

## 3. Layout Architecture

Layouts handle the page shell: `<html>`, `<head>`, global navigation, and footer.

```astro
---
// src/layouts/BaseLayout.astro
import '@/styles/global.css';
import Navbar from '@/components/navigation/Navbar.astro';
import Footer from '@/components/navigation/Footer.astro';
import SEO from '@/components/shared/SEO.astro';

interface Props {
  title: string;
  description?: string;
}

const { title, description } = Astro.props;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <SEO title={title} description={description} />
  </head>
  <body>
    <Navbar />
    <main>
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

---

## 4. Component Patterns

### Static Components (`.astro`)

Use `.astro` components for everything that does NOT require client-side interactivity:

- Navigation bars, footers, hero sections
- Cards, badges, buttons (when they're just links)
- Content sections, typography elements
- Layout containers

### Interactive Islands (React `.tsx`)

Use React components ONLY when client-side JavaScript is required:

- Mobile menu toggle (hamburger open/close)
- Form validation and submission
- Animated counters or scroll-triggered animations
- Modals, dropdowns, tooltips
- Any component requiring `useState`, `useEffect`, or event handlers beyond links

### Hydration Directives

Always use the most restrictive hydration directive:

```astro
<!-- Load JS only when visible in viewport (preferred for most cases) -->
<MobileMenu client:visible />

<!-- Load JS on page idle (for above-fold interactive elements) -->
<ContactForm client:idle />

<!-- Load JS immediately (AVOID — only for critical interactivity) -->
<CriticalWidget client:load />

<!-- Never hydrate — renders server-only HTML -->
<StaticCard />
```

**Default to NO hydration.** Only add `client:*` when the component genuinely needs JavaScript.

---

## 5. Content Management

### Static Data in Constants

For marketing pages, store content data in `src/constants/`:

```typescript
// src/constants/features.ts
import type { Feature } from '@/types/feature';

export const FEATURES: Feature[] = [
  {
    icon: 'brain',
    title: 'AI Market Intelligence',
    description: 'Analyze market conditions using AI-powered insights.',
  },
  // ...
];
```

Then consume in components:

```astro
---
import { FEATURES } from '@/constants/features';
import FeatureCard from '@/components/ui/FeatureCard.astro';
---

<div class="features-grid">
  {FEATURES.map((feature) => (
    <FeatureCard {...feature} />
  ))}
</div>
```

---

## 6. Styling Rules

### Scoped Styles

Use `<style>` blocks in Astro components for component-scoped CSS. These are automatically scoped by Astro:

```astro
<style>
  .hero {
    padding: var(--spacing-section) 0;
  }
</style>
```

### Global Styles

Global styles and CSS custom properties live in `src/styles/global.css`:

```css
:root {
  --color-primary: #111111;
  --color-canvas: #ffffff;
  --color-surface-card: #f5f5f5;
  /* ... design tokens from design.md */
}
```

### Tailwind Integration

- Use Tailwind utility classes for layout, spacing, and responsive behavior
- Use CSS custom properties (design tokens) for colors, typography, and brand values
- Prefer `class:list` for conditional classes:

```astro
<button class:list={[
  'btn',
  { 'btn-primary': variant === 'primary' },
  { 'btn-secondary': variant === 'secondary' },
  className,
]}>
  <slot />
</button>
```

---

## 7. Image Optimization

Always use Astro's built-in `<Image>` component for optimized images:

```astro
---
import { Image } from 'astro:assets';
import heroImage from '@/assets/images/hero.png';
---

<Image src={heroImage} alt="Strat AI Dashboard" width={600} height={400} />
```

- Import images as modules for automatic optimization
- Always provide `alt` text
- Specify `width` and `height` to prevent layout shift
- Use `loading="lazy"` for below-fold images (Astro does this by default)

---

## 8. SEO Requirements

Every page MUST include:

- Unique `<title>` tag with format: `Page Name — TRW`
- Meta description (compelling, under 160 characters)
- Open Graph tags (`og:title`, `og:description`, `og:image`)
- Canonical URL
- Single `<h1>` per page
- Proper heading hierarchy (h1 → h2 → h3, never skip levels)
- Semantic HTML (`<header>`, `<main>`, `<footer>`, `<section>`, `<nav>`, `<article>`)

Use the shared `SEO.astro` component in layouts:

```astro
<SEO
  title="Strat AI — AI-Powered Trading Intelligence"
  description="AI-driven market intelligence for the Indian financial markets."
  ogImage="/og-image.png"
/>
```

---

## 9. Performance Rules

- **Zero unnecessary JS**: Default to static Astro components. Only use islands for interactivity.
- **Font loading**: Use `font-display: swap` and preload critical fonts.
- **Critical CSS**: Keep above-fold CSS minimal; Astro handles this via scoped styles.
- **Asset loading**: Use `loading="lazy"` and `decoding="async"` for images below the fold.
- **No blocking scripts**: Never use `<script>` without `type="module"` or `defer`.

---

## 10. Accessibility

- All interactive elements must be keyboard-navigable
- Use `aria-label` on icon-only buttons
- Ensure color contrast ratios meet WCAG 2.1 AA (4.5:1 for text, 3:1 for large text)
- Provide `alt` text on all images
- Use semantic HTML elements over `<div>` when a more specific element exists
- Focus states must be visible on all interactive elements
