import type { RefusalsContent } from '@/types/landing';

/**
 * What the product cannot do, and the code that makes that true.
 *
 * Claims:
 * - The broker layer exposes quote, instruments and search only, with no order
 *   paths; a scope-boundary test maintains a denylist of order-placement names
 *   asserted absent, so read-only is enforced by test rather than convention —
 *   FEATURE_CATALOGUE 12.1
 * - Unmeasurable indicator values are emitted as NaN and reach the wire as
 *   JSON null; UNAVAILABLE consensus states exist precisely to separate
 *   "measured and unremarkable" from "could not be measured" — 4.1, 4.2
 * - The personalisation guardrail is pure, total, deterministic and runs
 *   pre-LLM across eight ordered categories, with NFKC normalisation — 15
 * - Total return, win rate, max drawdown and average conviction were removed
 *   from the dashboard and replaced with discipline metrics rendering an
 *   em-dash for anything unmeasured; no endpoint exposes journal statistics —
 *   14.5
 * - Committed decisions are written to hash-chained, append-only records
 *   carrying the model id and prompt hash, with no update or delete path — 15
 *
 * NOT CLAIMED HERE, deliberately: the Argon2id / AES-256 / Tauri Stronghold
 * credential vault. Catalogue 13.3 finds zero occurrences of `stronghold` or
 * `argon2` in the repository and instructs treating the claim as unverified
 * until the unchecked-out `src-tauri` submodule is inspected. Catalogue 17
 * ranks it a High-consequence divergence. Do not reinstate it here without
 * that verification.
 */
export const refusals: RefusalsContent = {
  intro: {
    id: 'security',
    badge: 'What it refuses to do',
    heading:
      'The most useful thing about this terminal is the list of things it cannot do',
    body: 'Most of what makes an analytics tool trustworthy is capability its authors deliberately did not build. Ours is enforced in code and asserted by tests, rather than promised in a policy document.',
  },
  pills: [
    { icon: 'shield-check', label: 'No order path', accent: 'emerald' },
    { icon: 'layers', label: 'Read-only broker seam', accent: 'orange' },
    { icon: 'zap', label: 'Honest failure', accent: 'violet' },
  ],
  refusals: [
    {
      title: 'It cannot place an order',
      body: 'The broker layer exposes quotes, instruments and search. There is no order method to call. A test maintains a denylist — place order, execute trade, cancel order, modify order, submit order, close position, square off — and asserts every one of those names is absent, so the boundary fails the build the moment it is crossed.',
    },
    {
      title: 'It cannot fill a gap with a guess',
      body: 'Values that could not be measured are emitted as null, never as zero. A momentum state that could not be computed reads UNAVAILABLE rather than NEUTRAL, because "measured and unremarkable" and "could not be measured" are different findings, and both the interface and the model read the answer as one.',
    },
    {
      title: 'It cannot answer a question about you',
      body: 'A deterministic guardrail runs before the model is invoked and refuses eight categories outright: position sizing, holdings, capital, income, net worth, goals, third-party requests and suitability. Because that refusal is arithmetic rather than a line in a prompt, it cannot be talked around and it reproduces identically years later.',
    },
    {
      title: 'It cannot show you a win rate',
      body: 'Total return, win rate, maximum drawdown and average conviction were removed from the dashboard. What replaced them is setups audited, setups rejected and forced holds — with an em-dash wherever a number has not actually been measured. The internal calibration loop still tracks expectancy; no endpoint publishes it.',
    },
    {
      title: 'It cannot quietly change its mind',
      body: 'Every committed decision is written to an append-only, hash-chained record carrying the model identifier and the prompt version that produced it. There is no update or delete path, so any output can be replayed later and shown to be unaltered.',
    },
  ],
};
