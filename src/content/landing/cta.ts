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
  badge: 'Launching soon',
  heading: 'Audit a setup before you fund it',
  body: 'Strat AI will open once our regulatory and compliance approvals are complete. Join the waitlist and we will notify you as soon as we launch.',
  primary: {
    label: 'Join the waitlist',
    href: '/waitlist',
  },
  secondary: {
    label: 'Read the pre-trade audit',
    href: '#verify',
  },
};
