import type { FaqContent } from '@/types/landing';

/**
 * FAQ, rewritten against FEATURE_CATALOGUE.md.
 *
 * Three answers here correct defects that were live on the previous page:
 * - the pattern count (26 across five categories, not 19 across three) — 5.1
 * - the conviction fusion, which is five rules including a 30/70 inversion
 *   above sentiment conviction 85, and an asymmetric conflict rule that pulls
 *   60% toward neutral rather than forcing a hard HOLD — 9
 * - the credential vault claim, which is unverified per 13.3 and is therefore
 *   absent from these answers entirely
 */
export const faq: FaqContent = {
  intro: {
    id: 'faq',
    badge: 'FAQ',
    heading: 'Frequently asked questions',
  },
  items: [
    {
      q: 'What exactly is Strat AI?',
      a: 'A market analysis and pre-trade risk terminal for Indian equities and equity derivatives (NSE/BSE F&O), built by the Trading & Research Wing. It evaluates setups, audits them against deterministic risk floors, decodes order flow and options positioning, and streams its reasoning while it works. It does not place orders, hold funds, or provide advice.',
    },
    {
      q: 'What can I ask the Co-Pilot, and what does it actually call?',
      a: 'Ask about a symbol in plain language. The reasoning loop has eighteen typed tools available over MCP: candles, a full indicator consensus, multi-timeframe trend, chart patterns, support and resistance, volume profile, news context, projections, market regime, relative strength, order flow, forecasts, session context, options analytics, event risk and its own track record — plus two control tools for arming a price watch and committing a decision. Every payload is contract-validated before the model is allowed to read it.',
    },
    {
      q: 'How does VERIFY decide a setup is unacceptable?',
      a: 'Five deterministic checks in a fixed order: levels present and finite, direction consistent with those levels, stop distance at least 1.5× ATR(14), and reward-to-risk at or above the floor for the profile — 1:2 for swing, investor and F&O, 1:1.3 for intraday. Checks stop at the first failure and return a stable reason tag. Setups below the floor are rejected outright, not silently resized. The validator is implemented twice, in Rust and in Python, with identical constants.',
    },
    {
      q: 'Why are there four Ghost Line models?',
      a: 'Because they answer slightly different questions, and disagreement between them is itself information. OLS is an unweighted straight-line fit. VWLR weights that same fit by traded volume. VWEPR fits a volume-weighted quadratic and surfaces its acceleration term. FCST is not a regression at all but a regime-conditioned drift forecast reporting an up-probability and an expected move in ATR units. All four use a fifty-bar window pinned to the same constant the agent’s tools use. R-squared is reported by the one dedicated model that computes it, on the ten-minute chart it was calibrated for.',
    },
    {
      q: 'How many chart patterns does the engine detect?',
      a: 'Twenty-six completed pattern labels across five categories: eight reversal, six continuation, four bilateral, five harmonic and three institutional. Each carries a confidence and a volume-validation verdict, and several detectors withhold a pattern entirely rather than emit it with a weaker score when it fails its volume filter. A separate pass reports patterns still forming, with a formation-progress estimate.',
    },
    {
      q: 'What does the conviction score mean?',
      a: 'It is a relative ranking of setup quality from 1 to 100 within our own framework. It is not a probability, a win rate, an expected return, or an instruction to buy or sell anything. The fusion is more than a single rule: the base blend weights technical momentum at 70% and news sentiment at 30%, but a sentiment conviction above 85 inverts that to 30/70, on the reasoning that strong news breaks technical patterns. A separate conflict rule pulls the blended score 60% toward neutral when a strongly bearish technical read meets strongly bullish news — that rule is asymmetric, applies only in that direction, and is suppressed while the inversion is active.',
    },
    {
      q: 'Is this financial advice, and can it trade for me?',
      a: 'No to both. Strat AI is analysis and risk tooling, and is not a SEBI-registered investment adviser. The broker seam is read-only: there is no order method to call, and a test asserts the absence of every order-placement name. A deterministic guardrail additionally refuses questions about your capital, holdings, position size, income or suitability before the model is invoked, because impersonal research is what the product is.',
    },
    {
      q: 'What happens when a data feed goes down?',
      a: 'The tool returns an explicit unavailable marker and the run reports it as unavailable. Unmeasurable numbers are emitted as null rather than zero, and a state that could not be computed reads UNAVAILABLE rather than NEUTRAL. Nothing is interpolated or substituted to keep a panel looking complete.',
    },
    {
      q: 'Do you publish win rates or backtests?',
      a: 'No. Total return, win rate, maximum drawdown and average conviction were deliberately removed from the dashboard, and no endpoint exposes them. What the terminal reports instead is discipline: setups audited, setups rejected, forced holds, and an em-dash wherever something has not been measured. Realised expectancy is still tracked internally, and is used to calibrate conviction downward on setup types that have not earned it.',
    },
  ],
};
