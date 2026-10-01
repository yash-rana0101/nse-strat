import type { ConstraintsContent } from '@/types/landing';

/**
 * Engineered constraints. Design parameters only — never performance figures.
 *
 * Claims:
 * - 1.5x ATR(14) stop floor applies to every profile and is never relaxed —
 *   FEATURE_CATALOGUE 8.1
 * - 26 pattern labels across five categories, plus a separate forming pass —
 *   5.1, 5.3
 * - 18 typed tools, each payload contract-validated — 3.4
 * - Eight projection engines, four selectable in the browser — 2
 *
 * Deliberately omitted, and why:
 * - "60 FPS": catalogue 17 item 19 records that rendering is
 *   requestAnimationFrame driven with no fixed cap; 60 FPS is a load-test
 *   target, not a guarantee.
 * - "Sub-50ms ticks": catalogue 1.5 records that no measured end-to-end
 *   latency exists anywhere in the code.
 * - "5 years of history": catalogue 1.5 records a default start of one year.
 */
export const constraints: ConstraintsContent = {
  intro: {
    id: 'constraints',
    badge: 'By the numbers',
    heading: 'Engineered constraints, not results',
  },
  stats: [
    {
      value: '1.5× ATR',
      title: 'Stop floor',
      detail: 'Every profile. Never relaxed.',
    },
    {
      value: '26',
      title: 'Pattern labels',
      detail: 'Five categories, plus a forming pass',
    },
    {
      value: '18',
      title: 'Typed tools',
      detail: 'Contract-checked before the model reads them',
    },
    {
      value: '8',
      title: 'Projection engines',
      detail: 'Four selectable on the chart',
    },
  ],
  callout: {
    label: 'Glass-box by default',
    quote:
      'Watch it think — every tool call, every number, every reason, streamed live to your screen. When data is missing, the system reports it as unavailable rather than filling the gap with a guess.',
    initials: 'GB',
    attribution: 'Strat AI engineering standard',
    attributionDetail: 'Typed tool contracts and streaming reasoning',
  },
  disclaimer:
    'These are design constraints, not performance figures. Strat AI is a market analysis and pre-trade risk research tool: it does not execute trades, manage funds, or provide personalised financial advice, and nothing it produces forecasts a return.',
};
