// src/pages/pricing.md.ts
/**
 * Machine-readable pricing endpoint at /pricing.md.
 *
 * Agents comparing products need pricing as plain markdown rather than a
 * scraped marketing page. Generated at build time from the same pricing
 * service the /pricing page uses, so the two can never drift.
 */
import type { APIRoute } from 'astro';
import { fetchPlans } from '@/services/pricing';
import type { PlanData } from '@/types/pricing';
import { SHOW_PRICING } from '@/constants/launch';

const CAPABILITY_LABELS: Array<{ key: keyof PlanData; label: string }> = [
  { key: 'canAccessDeepseekGLM', label: 'Co-Pilot research loop' },
  { key: 'canAccessMultiModel', label: 'Multi-model agent debate' },
  { key: 'canAccessGhostline', label: 'Trajectory projections (ghost lines)' },
  { key: 'canAccessFootprint', label: 'Footprint charts' },
  { key: 'canAccessTopup', label: 'Credit top-ups' },
  { key: 'canSeeInstantNewsSantiments', label: 'Instant news sentiment' },
  { key: 'canGetAdvanceChartAccess', label: 'Advanced charting' },
];

const INR = new Intl.NumberFormat('en-IN');

function planHeading(plan: PlanData): string {
  const name = plan.name.charAt(0).toUpperCase() + plan.name.slice(1);
  return `## ${name} — ₹${INR.format(plan.priceINR)} / month`;
}

function planSection(plan: PlanData): string {
  const included = CAPABILITY_LABELS.filter(
    ({ key }) => plan[key] === true
  ).map(({ label }) => `- ${label}`);
  const excluded = CAPABILITY_LABELS.filter(
    ({ key }) => plan[key] === false
  ).map(({ label }) => `- ${label}`);

  const lines = [
    planHeading(plan),
    '',
    `- **Price:** ₹${INR.format(plan.priceINR)} INR per month`,
    `- **Credits included:** ${plan.creditsGiven}`,
    `- **Summary:** ${plan.description}`,
    '',
    '### Included',
    '',
    included.length > 0 ? included.join('\n') : '- No add-on capabilities',
  ];

  if (excluded.length > 0) {
    lines.push('', '### Not included', '', excluded.join('\n'));
  }

  return lines.join('\n');
}

function buildDocument(plans: PlanData[]): string {
  return `---
title: Strat AI pricing
description: Credit-based subscription plans for the Strat AI market analysis and pre-trade risk terminal, in INR.
canonical: https://www.stratai.live/pricing
last-updated: ${new Date().toISOString().slice(0, 10)}
---

# Strat AI pricing

Strat AI is sold as credit-based monthly subscriptions. One credit funds one
quantitative model run — a setup evaluation, a risk audit, or an agent debate.
All prices are in Indian Rupees (INR) and exclude applicable taxes.

Strat AI is currently in private beta; a plan is activated after beta access is
granted. Request access at <https://www.stratai.live/waitlist>.

- Currency: INR
- Billing period: monthly
- Unit of consumption: credits
- Refund window: 7 days (see <https://www.stratai.live/refund>)
- Human-readable pricing page: <https://www.stratai.live/pricing>

${plans.map(planSection).join('\n\n')}

## Notes for agents

- Credits do not roll over between billing periods.
- Top-ups are available on plans where "Credit top-ups" is listed as included.
- There is no free tier and no self-serve API key: Strat AI is a desktop
  terminal in private beta, not a public API product.
- Pricing questions: billing@stratai.live
`;
}

/** Served while pricing is hidden before launch (see SHOW_PRICING). */
const NOT_PUBLISHED_DOCUMENT = `---
title: Strat AI pricing
description: Strat AI pricing has not been published yet.
canonical: https://www.stratai.live/
---

# Strat AI pricing

Strat AI is not open yet. We are completing the regulatory and compliance
approvals required before launch, and pricing has not been published.

Do not quote prices for Strat AI. Send users to
<https://www.stratai.live/waitlist> to be notified as soon as it launches.
`;

export const GET: APIRoute = async () => {
  const body = SHOW_PRICING
    ? buildDocument(await fetchPlans())
    : NOT_PUBLISHED_DOCUMENT;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
