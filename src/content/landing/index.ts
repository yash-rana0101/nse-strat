/**
 * Landing page content library.
 *
 * Single import surface for every trader-visible string on the home page.
 * Sections under `src/components/sections/` render this data and hold no copy
 * of their own.
 *
 * Provenance rule: every factual claim in these modules cites the
 * FEATURE_CATALOGUE.md section it came from. FEATURE_CATALOGUE.md is
 * source-verified and supersedes the other product docs in this repository
 * wherever they disagree.
 */
export { hero } from './hero';
export {
  deepDives,
  chatMock,
  verifyMock,
  ghostLineMock,
  anomalyMock,
} from './deepDives';
export { engine } from './engine';
export { platform } from './platform';
export { workflows } from './workflows';
export { constraints } from './constraints';
export { refusals } from './refusals';
export { crypto } from './crypto';
export { faq } from './faq';
export { cta } from './cta';
