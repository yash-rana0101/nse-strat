# Design System Rules

> Maps the TRW design specification (from `design.md`) into enforceable development rules.

---

## 1. Design Token Source of Truth

The full design specification lives in [design.md](../../design.md) at the project root. This file documents:

- Colors (brand, surface, text, semantic)
- Typography (font families, size scale, weight, letter-spacing)
- Spacing (4px base unit, section rhythm)
- Border radius (hierarchical scale)
- Elevation (shadow levels)
- Component specifications
- Responsive breakpoints

**All design decisions must reference `design.md`.** Do not invent new colors, type sizes, or spacing values.

---

## 2. CSS Custom Properties

All design tokens must be defined as CSS custom properties in `src/styles/global.css` and referenced by name — never by raw hex or pixel values.

### Colors

```css
:root {
  /* Brand */
  --color-primary: #111111;
  --color-primary-active: #242424;
  --color-brand-accent: #3b82f6;

  /* Surface */
  --color-canvas: #ffffff;
  --color-surface-soft: #f8f9fa;
  --color-surface-card: #f5f5f5;
  --color-surface-strong: #e5e7eb;
  --color-surface-dark: #101010;
  --color-surface-dark-elevated: #1a1a1a;

  /* Borders */
  --color-hairline: #e5e7eb;
  --color-hairline-soft: #f3f4f6;

  /* Text */
  --color-ink: #111111;
  --color-body: #374151;
  --color-muted: #6b7280;
  --color-muted-soft: #898989;
  --color-on-primary: #ffffff;
  --color-on-dark: #ffffff;
  --color-on-dark-soft: #a1a1aa;

  /* Badge Pastels */
  --color-badge-orange: #fb923c;
  --color-badge-pink: #ec4899;
  --color-badge-violet: #8b5cf6;
  --color-badge-emerald: #34d399;

  /* Semantic */
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
}
```

### ❌ Never inline hex values

```css
/* ❌ Wrong */
.button { background: #111111; }

/* ✅ Correct */
.button { background: var(--color-primary); }
```

---

## 3. Typography

### Font Families

- **Display headings (h1, h2, h3):** Manrope weight 600 with negative letter-spacing (Cal Sans substitute)
- **Body, UI, buttons, nav:** Inter weight 400–600

```css
:root {
  --font-display: 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-code: 'JetBrains Mono', monospace;
}
```

### Type Scale

Map these as CSS custom properties or Tailwind extensions:

| Token | Size | Weight | Line Height | Letter Spacing | Font |
|-------|------|--------|-------------|----------------|------|
| `--type-display-xl` | 64px | 600 | 1.05 | -2px | Display |
| `--type-display-lg` | 48px | 600 | 1.1 | -1.5px | Display |
| `--type-display-md` | 36px | 600 | 1.15 | -1px | Display |
| `--type-display-sm` | 28px | 600 | 1.2 | -0.5px | Display |
| `--type-title-lg` | 22px | 600 | 1.3 | -0.3px | Body |
| `--type-title-md` | 18px | 600 | 1.4 | 0 | Body |
| `--type-title-sm` | 16px | 600 | 1.4 | 0 | Body |
| `--type-body-md` | 16px | 400 | 1.5 | 0 | Body |
| `--type-body-sm` | 14px | 400 | 1.5 | 0 | Body |
| `--type-caption` | 13px | 500 | 1.4 | 0 | Body |
| `--type-button` | 14px | 600 | 1.0 | 0 | Body |
| `--type-nav` | 14px | 500 | 1.4 | 0 | Body |

### Rules

- Display weight is always **600** — never 700, never 500
- Negative letter-spacing on display sizes is **mandatory** (-0.5px to -2px)
- Never use the display font for body text
- Never use the body font for display headings

---

## 4. Spacing

### Base Unit: 4px

```css
:root {
  --spacing-xxs: 4px;
  --spacing-xs: 8px;
  --spacing-sm: 12px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-xxl: 48px;
  --spacing-section: 96px;
}
```

### Usage Rules

- **Section vertical padding:** `--spacing-section` (96px) between major page bands
- **Card internal padding:** `--spacing-xl` (32px) for feature/pricing cards; `--spacing-lg` (24px) for testimonial/mockup cards
- **Grid gutters:** `--spacing-lg` (24px) between cards; `--spacing-md` (16px) inside footer columns
- Never use arbitrary pixel values — always reference a spacing token

---

## 5. Border Radius

```css
:root {
  --rounded-xs: 4px;
  --rounded-sm: 6px;
  --rounded-md: 8px;     /* Buttons, inputs */
  --rounded-lg: 12px;    /* Content cards */
  --rounded-xl: 16px;    /* Hero mockup card */
  --rounded-pill: 9999px; /* Badges, nav pills */
  --rounded-full: 9999px; /* Avatars */
}
```

- Buttons and inputs: `--rounded-md` (8px)
- Content cards: `--rounded-lg` (12px)
- Hero mockup: `--rounded-xl` (16px)
- Never exceed `--rounded-xl` on cards

---

## 6. Elevation

```css
:root {
  --shadow-subtle: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-card: 0 4px 12px rgba(0, 0, 0, 0.08);
}
```

- Most cards use **no shadow** — just `--color-surface-card` background
- Pricing cards and hover states use `--shadow-card`
- No heavy shadows, no neumorphism, no glassmorphism

---

## 7. Responsive Breakpoints

```css
/* Mobile first */
/* Tablet: min-width 768px */
/* Desktop: min-width 1024px */
/* Wide: min-width 1440px (max-width caps at 1200px) */
```

| Breakpoint | Grid Changes |
|-----------|-------------|
| Mobile (< 768px) | Hamburger nav, single column, h1 scales to 32px |
| Tablet (768–1024px) | 2-up cards, tighter nav |
| Desktop (1024–1440px) | 3-up features, 4-up pricing, full nav |
| Wide (> 1440px) | Same as desktop, max-width 1200px container |

---

## 8. Brand Voice — Visual Rules

From `design.md` Do's and Don'ts:

### DO

- Reserve `--color-primary` for primary CTAs and display type only
- Use display font for every headline; body font for everything else
- Apply negative letter-spacing on display sizes
- End every page with the dark footer
- Alternate surface modes between sections (white → card → white → dark)

### DON'T

- Use accent colors on primary CTAs (system is monochrome at action layer)
- Bold display weight beyond 600
- Use border radius beyond 16px on cards
- Place dark surface cards anywhere except footer and featured pricing
- Repeat the same surface mode in two consecutive sections
