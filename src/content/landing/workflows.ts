import type { WorkflowsContent } from '@/types/landing';

/**
 * Where each surface fits across a trading session.
 *
 * Written strictly as terminal mechanics. No outcome language, no second-person
 * benefit claims, nothing implying suitability — BRAND_GUIDELINES 1 rules 1 and
 * 12, and the section 3 review checklist.
 *
 * Claims:
 * - Regime reported as an orthogonal pair; every ranging row is unfavourable —
 *   FEATURE_CATALOGUE 6.8
 * - Seven session phases, expiry override on afternoon and closing — 6.10
 * - Event risk only tightens — 6.11
 * - Opening range taken from the first fifteen candles — 6.7
 * - Volume profile POC and value area — 6.5
 * - Forming patterns with a progress estimate — 5.3
 * - VERIFY check order and reason tags — 8.2
 * - watch_price_condition suspends the run; the tool server watches live ticks
 *   and resumes when the level triggers — 3.4, 3.8
 * - Journal records, then scores target-first versus stop-first, and
 *   expectancy per setup type is a hard instruction to reduce conviction —
 *   14.1, 14.3
 * - Discipline metrics replaced performance metrics on the dashboard — 14.5
 */
export const workflows: WorkflowsContent = {
  intro: {
    id: 'workflows',
    badge: 'Where it fits',
    heading: 'One session, from pre-open to journal',
    body: 'Not a promise about outcomes. A description of which surface answers which question, in roughly the order a trading day tends to ask them.',
  },
  steps: [
    {
      phase: 'Pre-open',
      title: 'Establish the regime before the bell',
      body: 'Trend state is reported against volatility state as two separate readings, alongside the session phase ahead and whether a scheduled event falls inside the horizon. A ranging regime is classified unfavourable — which is information available before anyone has an opinion.',
      artefact: 'REGIME · SESSION · EVENT RISK',
    },
    {
      phase: 'Opening',
      title: 'Let the structure print',
      body: 'The opening range is taken from the first fifteen candles. Volume profile fills in the point of control and the value area, and the pattern pass reports what is still forming as well as what has completed.',
      artefact: 'OPENING RANGE · POC · FORMING PATTERNS',
    },
    {
      phase: 'Setup',
      title: 'Price the idea before committing to it',
      body: 'Entry, stop and target go into VERIFY. Either the arithmetic clears the 1.5× ATR floor and the reward-to-risk floor for that profile, or it returns rejected with the tag naming the check that failed.',
      artefact: 'VERIFY → PASSED / REJECTED',
    },
    {
      phase: 'In trade',
      title: 'Watch a level instead of a screen',
      body: 'A price condition can be armed, at which point the run suspends. The tool server watches live ticks and resumes the analysis when the level actually trades, so re-evaluation is triggered by the tape rather than by refreshing.',
      artefact: 'WATCHING · RESUME ON TRIGGER',
    },
    {
      phase: 'After',
      title: 'Find out whether the read held',
      body: 'Committed decisions are scored against the candles that followed — target first, or stop first. Expectancy accumulates per setup type, and a setup type showing negative expectancy is required to reduce conviction rather than merely noted somewhere.',
      artefact: 'AUDITED · REJECTED · FORCED HOLDS',
    },
  ],
  note: 'Every step above describes terminal behaviour. None of it is a recommendation, a signal, or a statement about what any trade will do.',
};
