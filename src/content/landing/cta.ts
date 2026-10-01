import type { CtaContent } from '@/types/landing';

/**
 * Closing conversion block.
 *
 * Carries no date, no scarcity device and no outcome claim — BRAND_GUIDELINES
 * section 1 rule 8 and the section 3 licence screen, which forbids any
 * early-access framing implying a delivery date.
 */
export const cta: CtaContent = {
  id: 'cta',
  badge: 'Private beta',
  heading: 'Audit a setup before you fund it',
  body: 'Strat AI is in private beta with a deliberately small group of traders working the Indian markets. If you care more about why than what, we want you in it.',
  primary: {
    label: 'Join the private beta',
    href: '/waitlist',
  },
  secondary: {
    label: 'Read the pre-trade audit',
    href: '#verify',
  },
};
