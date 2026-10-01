# Frontend Code Standard

> Mandatory rules for every file in the TRW codebase. These are enforced on every code generation.

---

## 1. File Size — Hard Limit

```
Maximum: 300 lines per file (including imports, comments, whitespace)
Warning threshold: 250 lines
```

When a file approaches **250 lines**, immediately extract:

- Sub-components → `src/components/`
- Custom hooks → `src/hooks/`
- Utility functions → `src/utils/`
- Service/API calls → `src/services/`
- TypeScript types/interfaces → `src/types/`
- Constants/config → `src/constants/`

**If a file exceeds 300 lines, STOP. Refactor first. Generate code second.**

---

## 2. No Inline Components

Never write component markup inline inside a page or parent component when:

- The element is a standard UI primitive (Button, Card, Input, Badge, etc.)
- The element will be used more than once anywhere in the project
- The element has its own visual identity or behavior

### ❌ Forbidden

```astro
<!-- Writing a button directly in a page -->
<button class="bg-primary text-white px-5 py-2 rounded-md font-semibold text-sm">
  Join Waitlist
</button>
```

### ✅ Required

```astro
---
import Button from '@/components/ui/Button.astro';
---
<Button variant="primary">Join Waitlist</Button>
```

---

## 3. Component Reuse — Mandatory

Before writing ANY UI element, check:

```
Does this component already exist in src/components/ui/?
```

If YES → **import and use it**. Never duplicate.

If NO and the element is a common pattern → **create the reusable component first**, then use it.

### UI primitives that MUST be reusable components

These must live in `src/components/ui/` and must NEVER be written inline:

- `Button.astro` — All button variants (primary, secondary, text-link, icon)
- `Card.astro` — Feature cards, testimonial cards, pricing cards
- `Badge.astro` — Pill badges, status tags
- `Input.astro` — Text inputs, email inputs
- `Avatar.astro` — Circular avatar with image or initials
- `Icon.astro` — SVG icon wrapper
- `Container.astro` — Max-width centered container
- `SectionHeading.astro` — Section title + subtitle pattern
- `Divider.astro` — Section dividers

---

## 4. Separation of Concerns

### Business Logic vs UI

- **Pages** (`src/pages/`) — Only routing, layout selection, and data fetching. No UI markup beyond layout wrappers.
- **Layouts** (`src/layouts/`) — Page shells (head, nav, footer). No feature-specific markup.
- **Components** (`src/components/`) — All visual UI. Further split by domain:
  - `ui/` — Design system primitives (Button, Card, Input, Badge, etc.)
  - `sections/` — Page sections (HeroSection, FeaturesSection, PricingSection, etc.)
  - `navigation/` — Navbar, MobileMenu, Footer, NavPillGroup
  - `shared/` — Cross-cutting components (SEO, Analytics, ScrollToTop, etc.)

### Data & Logic

- **Types** (`src/types/`) — All TypeScript interfaces and type definitions
- **Constants** (`src/constants/`) — Static data, navigation items, feature lists, pricing tiers
- **Utils** (`src/utils/`) — Pure utility functions
- **Services** (`src/services/`) — API calls, external integrations
- **Hooks** (`src/hooks/`) — Reusable React hooks (for interactive islands only)

---

## 5. No God Components

The following patterns are **forbidden**:

```
❌ HomePage.astro = 800 lines (entire page in one file)
❌ Features.astro = 500 lines (all features in one component)
❌ Navbar.astro = 400 lines (nav + mobile menu + all dropdowns)
```

Instead, decompose into focused, single-responsibility components:

```
✅ src/pages/index.astro          (~30 lines — imports + layout)
✅ src/components/sections/Hero.astro     (~80 lines)
✅ src/components/sections/Features.astro (~60 lines)
✅ src/components/ui/FeatureCard.astro    (~50 lines)
```

---

## 6. Import Path Aliases

Always use the `@/` path alias (mapped to `src/`):

```astro
---
// ✅ Correct
import Button from '@/components/ui/Button.astro';
import { NAVIGATION_ITEMS } from '@/constants/navigation';

// ❌ Wrong
import Button from '../../components/ui/Button.astro';
---
```

---

## 7. Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| Components | PascalCase | `FeatureCard.astro` |
| Pages | kebab-case | `about-us.astro` |
| Types | PascalCase | `NavigationItem.ts` |
| Constants | SCREAMING_SNAKE_CASE | `PRICING_TIERS` |
| Utils | camelCase | `formatCurrency.ts` |
| CSS classes | kebab-case | `feature-card` |
| Astro props | camelCase | `buttonVariant` |

---

## 8. Props & TypeScript

Every component must define its props with TypeScript:

```astro
---
interface Props {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  class?: string;
}

const { variant = 'primary', size = 'md', href, class: className } = Astro.props;
---
```

- All props must have explicit types
- Use union types for variant props
- Provide sensible defaults
- Allow `class` passthrough for composition

---

## 9. Self-Review Checklist

Before returning any code, verify:

```
✓ File under 300 lines
✓ No duplicated UI patterns
✓ All reusable components imported from src/components/ui/
✓ Services separated from components
✓ Types defined in src/types/
✓ Business logic separated from UI
✓ Follows project folder structure
✓ Responsive design included
✓ TypeScript types on all props
✓ No inline component definitions for standard UI elements
```

---

## 10. Anti-Patterns — Explicitly Banned

| Anti-Pattern | Why It's Banned |
|-------------|----------------|
| Inline styles | Use Tailwind classes or CSS custom properties |
| `any` type | Always provide explicit types |
| Magic numbers | Extract to constants or design tokens |
| Copy-pasted markup | Extract to a shared component |
| Direct DOM manipulation | Use Astro's reactive patterns or React islands |
| Barrel exports (`index.ts` re-exporting everything) | Hurts tree-shaking in Astro |
| CSS-in-JS | Use Tailwind or scoped `<style>` blocks |
