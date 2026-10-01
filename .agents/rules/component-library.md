# Component Library Rules

> Rules for using shadcn/ui, Starwind UI, and building the TRW component system.

---

## 1. Component Sources — Priority Order

When you need a UI component, follow this priority:

1. **Check `src/components/ui/`** — Does it already exist in the project?
2. **shadcn/ui** — Use `npx shadcn@latest add <component>` for interactive React components (forms, modals, dropdowns, dialogs)
3. **Starwind UI** — Use for Astro-native static components (avoids React islands for non-interactive elements)
4. **Build custom** — Only if the component doesn't exist in any library AND the pattern is project-specific

### ❌ Never

- Write a custom Button, Card, Input, Badge, or Modal from scratch when shadcn/ui or Starwind provides one
- Duplicate styling that a library component already handles
- Install additional UI libraries beyond shadcn/ui and Starwind UI without explicit approval

---

## 2. shadcn/ui Setup & Usage

### Installation

shadcn/ui components are added individually — never install the entire library:

```bash
# Add individual components as needed
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
npx shadcn@latest add input
npx shadcn@latest add badge
npx shadcn@latest add separator
npx shadcn@latest add sheet        # for mobile menu
npx shadcn@latest add form
npx shadcn@latest add dropdown-menu
npx shadcn@latest add tooltip
```

### When to Use shadcn/ui (React Islands)

Use shadcn/ui React components ONLY when the component requires client-side interactivity:

| Component | Use Case |
|-----------|----------|
| `Dialog` | Modal overlays requiring open/close state |
| `Sheet` | Mobile navigation slide-out |
| `DropdownMenu` | Navigation dropdowns with keyboard support |
| `Form` + `Input` | Form validation and submission |
| `Tooltip` | Hover/focus-triggered tooltips |
| `Tabs` | Interactive tab switching |
| `Accordion` | Expandable/collapsible content |
| `Toast` | Notification popups |

### When NOT to Use shadcn/ui

Do NOT use shadcn/ui (React) for static, non-interactive elements. Use Astro components instead:

| Element | Use Astro Component |
|---------|-------------------|
| Buttons that are just links | `Button.astro` wrapping `<a>` |
| Static cards | `Card.astro` |
| Badges / tags | `Badge.astro` |
| Avatars | `Avatar.astro` |
| Static lists | Native HTML |
| Section containers | `Container.astro` |

---

## 3. Astro Component Wrappers

For every shadcn/ui component you use, create an Astro wrapper in `src/components/ui/` that handles the island hydration:

```astro
---
// src/components/ui/MobileMenu.astro
import MobileMenuReact from './react/MobileMenu.tsx';
import type { NavigationItem } from '@/types/navigation';

interface Props {
  items: NavigationItem[];
}

const { items } = Astro.props;
---

<MobileMenuReact client:visible items={items} />
```

This keeps the island boundary explicit and the import pattern consistent across the project.

---

## 4. Component Registry — Required UI Primitives

The following components MUST exist in `src/components/ui/` before building any page. Create them as `.astro` files for static use or as React + Astro wrappers for interactive use.

### Static Primitives (Astro)

| Component | File | Purpose |
|-----------|------|---------|
| Button | `Button.astro` | Primary, secondary, ghost, text-link, icon variants |
| Card | `Card.astro` | Feature card, testimonial card, pricing card shells |
| FeatureCard | `FeatureCard.astro` | Icon + title + description card |
| TestimonialCard | `TestimonialCard.astro` | Avatar + quote + attribution |
| PricingCard | `PricingCard.astro` | Plan name + price + features + CTA |
| Badge | `Badge.astro` | Pill badges with color variants |
| Avatar | `Avatar.astro` | Circular image/initials avatar |
| Container | `Container.astro` | Max-width centered content wrapper |
| SectionHeading | `SectionHeading.astro` | Title + subtitle + optional badge |
| Icon | `Icon.astro` | SVG icon renderer |
| Divider | `Divider.astro` | Horizontal rule with optional label |
| Logo | `Logo.astro` | TRW brand logo |

### Interactive Primitives (React via shadcn/ui)

| Component | File | Purpose |
|-----------|------|---------|
| MobileMenu | `react/MobileMenu.tsx` | Hamburger menu using `Sheet` |
| ContactForm | `react/ContactForm.tsx` | Waitlist / contact form |
| NavDropdown | `react/NavDropdown.tsx` | Navigation dropdowns |

---

## 5. Component Composition Rules

### Props Over Children for Data

When a component displays structured data, use props:

```astro
<!-- ✅ Props for structured data -->
<FeatureCard
  icon="brain"
  title="AI Market Intelligence"
  description="Analyze market conditions using AI-powered insights."
/>
```

### Slots for Flexible Content

When a component wraps arbitrary content, use Astro slots:

```astro
<!-- ✅ Slots for flexible content -->
<Card variant="feature">
  <h3>Custom heading</h3>
  <p>Any content here</p>
</Card>
```

### Variant Props — Not Separate Components

Do NOT create separate components for visual variants. Use a `variant` prop:

```astro
---
// ✅ Single component with variants
interface Props {
  variant?: 'primary' | 'secondary' | 'ghost' | 'text-link';
}
---

<!-- ❌ Don't create PrimaryButton.astro, SecondaryButton.astro, etc. -->
```

---

## 6. Component File Template

Every Astro UI component should follow this structure:

```astro
---
/**
 * ComponentName — Brief description.
 *
 * @example
 * <ComponentName variant="primary" size="md">Label</ComponentName>
 */

interface Props {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  class?: string;
}

const { variant = 'primary', size = 'md', class: className } = Astro.props;

const variantClasses = {
  primary: 'bg-primary text-on-primary',
  secondary: 'bg-canvas text-ink border border-hairline',
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-6 py-3 text-lg',
};
---

<div
  class:list={[
    'component-base',
    variantClasses[variant],
    sizeClasses[size],
    className,
  ]}
>
  <slot />
</div>

<style>
  .component-base {
    /* Scoped styles using design tokens */
  }
</style>
```

---

## 7. Icon System

Use a single `Icon.astro` component that renders SVGs from a centralized icon set:

```astro
---
// src/components/ui/Icon.astro
interface Props {
  name: string;
  size?: number;
  class?: string;
}

const { name, size = 24, class: className } = Astro.props;
---

<svg
  width={size}
  height={size}
  class:list={['icon', className]}
  aria-hidden="true"
>
  <use href={`/icons/sprite.svg#${name}`} />
</svg>
```

- Store all SVG icons in `src/assets/icons/`
- Generate an SVG sprite or import icons individually
- Never inline raw SVG markup in page components
- Prefer Lucide icons (shadcn/ui default icon set) for consistency

---

## 8. Free Component Resources

When you need blocks or page sections beyond what shadcn/ui provides, check these free sources:

| Source | URL | What it offers |
|--------|-----|---------------|
| shadcn/ui | ui.shadcn.com | Core primitives + blocks |
| Shadcnblocks | shadcnblocks.com | 1500+ free blocks (hero, pricing, features, CTA) |
| 21st.dev | 21st.dev | Community shadcn components |
| Starwind UI | starwind.dev | Astro-native components |

Always adapt sourced blocks to match the TRW design system (design tokens, typography, spacing) rather than using them as-is.
