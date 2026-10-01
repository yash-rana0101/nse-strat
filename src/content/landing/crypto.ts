import type { CryptoContent } from '@/types/landing';

/**
 * Strat AI Crypto teaser.
 *
 * Explicitly an in-development notice with no feature claims and no date.
 * FEATURE_CATALOGUE lists crypto as out of scope for the shipped product, so
 * nothing here may read as available capability. BRAND_GUIDELINES section 3
 * also forbids any early-access framing that implies a delivery date.
 */
export const crypto: CryptoContent = {
  id: 'crypto',
  badge: 'Strat AI Crypto',
  status: 'In development',
  heading: 'The same engine, pointed at a market that never closes',
  body: 'A separate product rather than a region toggle. On-chain structure and perpetual funding behave nothing like an equity session, and a session engine built around a 09:15 open does not transfer for free.',
  points: [
    'Continuous sessions',
    'Separate microstructure research',
    'Distinct risk calibration',
  ],
  note: 'In development. No release date, no feature commitments, and nothing described here is available to use today. Strat AI currently covers Indian equities and equity derivatives only.',
  cta: {
    label: 'Talk to the team',
    href: '/contact',
  },
};
