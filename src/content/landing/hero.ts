import type { HeroContent } from '@/types/landing';

/**
 * Hero copy.
 *
 * Claims used here:
 * - 18 typed tools bound to the reasoning loop — FEATURE_CATALOGUE 3.4
 * - Tool payloads pass validate_contract, no tool may fabricate — 3.4
 * - "tells you when not to trade" is the approved positioning line —
 *   BRAND_GUIDELINES 2
 */
export const hero: HeroContent = {
  attribution: {
    prefix: 'Built by',
    label: 'Trading & Research Wing',
    href: 'https://www.tradingrw.com/',
  },
  heading: 'Ask the market. Every number is computed, not guessed.',
  body: 'Strat AI is a market analysis and pre-trade risk terminal for the NSE. Ask about a symbol in plain language and it calls eighteen typed quantitative tools over MCP, streams every call to your screen as it happens, and tells you when not to trade.',
  primaryCta: {
    label: 'Join the waitlist',
    href: '/waitlist',
  },
  secondaryCta: {
    label: 'See the pre-trade audit',
    href: '#verify',
  },
  note: 'Analysis and pre-trade risk research only. Strat AI does not place orders, hold funds, or provide financial advice.',
};
