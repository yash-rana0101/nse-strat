/**
 * Shape of the landing page content library.
 *
 * Copy lives in `src/content/landing/`; sections are thin renderers over it.
 * Factual claims in the content modules cite their FEATURE_CATALOGUE.md
 * section so a later edit can be re-verified rather than trusted.
 */

/** Accent ramp available to cards and pills. Maps to badge tokens in global.css. */
export type Accent = 'emerald' | 'violet' | 'orange' | 'pink';

/** Shared heading block: eyebrow badge, h2, optional standfirst. */
export interface SectionIntro {
  id: string;
  badge: string;
  heading: string;
  body?: string;
}

export interface LinkTarget {
  label: string;
  href: string;
}

/* ------------------------------------------------------------------ hero */

export interface HeroContent {
  attribution: {
    prefix: string;
    label: string;
    href: string;
  };
  heading: string;
  body: string;
  primaryCta: LinkTarget;
  secondaryCta: LinkTarget;
  note: string;
}

/* ------------------------------------------------------- feature deep dives */

/** Which mock component renders alongside a deep dive. */
export type MockName = 'chat' | 'verify' | 'ghostline' | 'anomaly';

export interface DeepDiveBullet {
  title: string;
  body: string;
}

export interface DeepDive {
  id: string;
  /** Display ordinal, e.g. "01". */
  index: string;
  badge: string;
  /** Short monospace kicker above the heading. */
  eyebrow: string;
  heading: string;
  body: string;
  bullets: DeepDiveBullet[];
  footnote?: string;
  mock: MockName;
  /** Which side the mock sits on at desktop widths. */
  mediaSide: 'left' | 'right';
}

/* -------------------------------------------------------------- mock data */

export type ChatEventKind = 'tool' | 'unavailable' | 'reasoning' | 'decision';

export interface ChatEvent {
  kind: ChatEventKind;
  label: string;
  detail: string;
}

export interface ChatMockContent {
  frameLabel: string;
  status: string;
  promptLabel: string;
  prompt: string;
  events: ChatEvent[];
  footnote: string;
}

export type CheckState = 'pass' | 'fail' | 'skipped';

export interface VerifyCheck {
  label: string;
  state: CheckState;
  detail: string;
}

export interface VerifyMockContent {
  frameLabel: string;
  status: string;
  inputsLabel: string;
  inputs: Array<{ label: string; value: string }>;
  checksLabel: string;
  checks: VerifyCheck[];
  verdict: {
    label: string;
    tag: string;
    note: string;
  };
  critiqueLabel: string;
  critique: string[];
  critiqueNote: string;
}

export interface GhostLineMode {
  id: string;
  label: string;
  math: string;
  window: string;
  rows: Array<{ label: string; value: string }>;
}

export interface GhostLineMockContent {
  frameLabel: string;
  status: string;
  modes: GhostLineMode[];
  projectionNote: string;
  confidenceNote: string;
}

export interface AnomalyMockContent {
  frameLabel: string;
  status: string;
  symbol: string;
  move: string;
  window: string;
  severity: string;
  headline: string;
  commentary: string;
  sentiment: string;
  rows: Array<{ label: string; value: string }>;
  footnote: string;
}

/* ------------------------------------------------------------ engine layers */

export interface EngineLayer {
  index: string;
  label: string;
  heading: string;
  body: string;
  chips: string[];
}

export interface EngineContent {
  intro: SectionIntro;
  layers: EngineLayer[];
  punchline: {
    label: string;
    heading: string;
    body: string;
  };
}

/* ---------------------------------------------------------- platform grid */

export interface PlatformFeature {
  icon: string;
  accent: Accent;
  title: string;
  body: string;
  href?: string;
}

export interface PlatformContent {
  intro: SectionIntro;
  features: PlatformFeature[];
}

/* -------------------------------------------------------------- workflows */

export interface WorkflowStep {
  phase: string;
  title: string;
  body: string;
  artefact: string;
}

export interface WorkflowsContent {
  intro: SectionIntro;
  steps: WorkflowStep[];
  note: string;
}

/* ------------------------------------------------------------ constraints */

export interface ConstraintStat {
  value: string;
  title: string;
  detail: string;
}

export interface ConstraintsContent {
  intro: SectionIntro;
  stats: ConstraintStat[];
  callout: {
    label: string;
    quote: string;
    initials: string;
    attribution: string;
    attributionDetail: string;
  };
  disclaimer: string;
}

/* -------------------------------------------------------------- refusals */

export interface Refusal {
  title: string;
  body: string;
}

export interface RefusalsContent {
  intro: SectionIntro;
  pills: Array<{ icon: string; label: string; accent: Accent }>;
  refusals: Refusal[];
}

/* ---------------------------------------------------------------- crypto */

export interface CryptoContent {
  id: string;
  badge: string;
  status: string;
  heading: string;
  body: string;
  points: string[];
  note: string;
  cta: LinkTarget;
}

/* ------------------------------------------------------------- faq & cta */

export interface FaqItem {
  q: string;
  a: string;
}

export interface FaqContent {
  intro: SectionIntro;
  items: FaqItem[];
}

export interface CtaContent {
  id: string;
  badge: string;
  heading: string;
  body: string;
  primary: LinkTarget;
  secondary: LinkTarget;
}
