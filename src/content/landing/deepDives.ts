import type {
  AnomalyMockContent,
  ChatMockContent,
  DeepDive,
  GhostLineMockContent,
  VerifyMockContent,
} from '@/types/landing';

/**
 * The four headline features, high level to low level.
 *
 * Order is deliberate: conversational analysis, then the risk audit, then the
 * projection models, then surveillance.
 *
 * Every claim below is traceable to FEATURE_CATALOGUE.md. Section numbers are
 * cited inline. Nothing here is a roadmap item, an outcome claim, or a
 * performance figure — see BRAND_GUIDELINES.md sections 1 and 3.
 */
export const deepDives: DeepDive[] = [
  /**
   * Catalogue 3.1 (reasoning nodes), 3.2 (four modes), 3.3 (deterministic
   * debate synthesis, CONTESTED_PENALTY = 25), 3.4 (18 tools),
   * 3.5 (three tool bindings), 3.7 (bounds and forced terminals).
   *
   * FIND, DEBATE and QA are RESEARCH SKU per catalogue 16 and may be named as
   * existing capability but not sold pre-registration — BRAND_GUIDELINES 3.
   * Hence the footnote rather than a call to action.
   */
  {
    id: 'copilot',
    index: '01',
    badge: 'Strat AI Co-Pilot',
    eyebrow: 'FIND · VERIFY · DEBATE · QA',
    heading: 'Ask in plain language. It answers with eighteen typed tools.',
    body: 'This is not a chat window bolted onto a chart. Your question enters a reasoning loop that calls deterministic quantitative tools over MCP — candles, a full indicator consensus, regime, order flow, options analytics, forecasts — and every result is contract-validated before the model is allowed to read it. The model reasons about measurements. It never authors them.',
    bullets: [
      {
        title: 'Four modes, one thread',
        body: 'FIND runs a fifteen-step setup scan. VERIFY audits levels you supply. DEBATE sets a Bull agent against a Bear with a Judge deciding. QA answers follow-ups from the same persisted context — and a decision already committed stays immutable while you interrogate it.',
      },
      {
        title: 'The debate is settled by arithmetic',
        body: 'Bull and Bear are language models. The verdict is not. Their stances are scored as integers and the consensus label — contested, lean or strong agreement — falls out of published thresholds whose boundaries are mutually exclusive, so the classification is never ambiguous. A debate where both sides argue strongly and neither pulls away is penalised a fixed twenty-five points, which makes real disagreement arithmetically incapable of reading as confidence.',
      },
      {
        title: 'Three separate tool bindings',
        body: 'The Bull, the Bear and the VERIFY critic are handed a read-only binding with the commit and watch tools removed, so they physically cannot open a position. Non-F&O workspaces lose the options tool altogether, because a tool that was never bound cannot be called.',
      },
      {
        title: 'It is allowed to reach no conclusion',
        body: 'The loop is bounded at six consecutive reasoning turns. On exhaustion it emits a HOLD carrying its best current read — directional bias and the levels that matter — instead of manufacturing a plan to fill the silence.',
      },
      {
        title: 'Watch it think',
        body: 'Every reasoning step and tool call streams to the terminal as a typed event. When a feed is down, the tool returns an explicit unavailable marker and the run reports it as unavailable.',
      },
    ],
    footnote:
      'FIND, DEBATE and QA are shown here as existing terminal capability. VERIFY is the mode you can point at your own levels today.',
    mock: 'chat',
    mediaSide: 'right',
  },

  /**
   * Catalogue 8.1 (constants, mirrored implementations), 8.2 (check order),
   * 8.3 (multi-leg validation), 3.1 (VERIFY devil's advocate returns a
   * message only).
   *
   * Catalogue 16 places "VERIFY maths on the user's own levels" in the
   * unregulated TERMINAL SKU, which is why this is the buyable hero.
   */
  {
    id: 'verify',
    index: '02',
    badge: 'Pre-Trade Risk Audit',
    eyebrow: 'VERIFY MODE',
    heading: 'Bring your own trade. It will try to break it.',
    body: 'Give it an entry, a stop and a target. Before any model reasons about your thesis, five deterministic checks run in a fixed order. A failure is a rejection with a machine-readable reason tag — not a softened suggestion, and not a silently resized position.',
    bullets: [
      {
        title: 'A stop floor no profile can relax',
        body: 'Your stop distance must be at least 1.5× ATR(14). That constant holds for intraday, swing, investor and F&O alike. A stop sitting inside normal market noise is rejected, not renegotiated.',
      },
      {
        title: 'Reward-to-risk floors that fit the session',
        body: '1:2 for swing, investor and F&O. 1:1.3 for intraday — because a swing-calibrated floor makes a defensible intraday bracket arithmetically impossible and yields nothing but perpetual holds.',
      },
      {
        title: 'Then something argues against you',
        body: 'A Bear agent runs against your own proposal, hunting for overhead VWAP capping the move, call open-interest walls above your target, volume-profile gaps and unfavourable session timing. It returns a critique and nothing else — it has no authority to decide.',
      },
      {
        title: 'Rejections you can act on',
        body: 'Eight stable failure tags, not prose: missing levels, inconsistent direction, stop too tight, reward-to-risk too low, leg fraction out of range, target ordering inconsistent, breakeven out of range, blended reward-to-risk too low.',
      },
      {
        title: 'Written twice, on purpose',
        body: 'The validator exists in Rust and again in Python with identical constants and identical reason tags. The arithmetic is not something a language model can talk its way around.',
      },
    ],
    footnote:
      'Multi-leg exit plans are validated as a whole: leg fractions must sum correctly, targets must order correctly, the breakeven trigger must sit between entry and first target, and the blended reward-to-risk must still clear the floor.',
    mock: 'verify',
    mediaSide: 'left',
  },

  /**
   * Catalogue 2 (all eight engines), 2.1 (the four browser engines and their
   * mathematics), 2.3 (post-processing), 2.4 (acceleration coefficient),
   * 2.5 (R-squared is computed only by the predictive service, hard-bound to
   * 10-minute candles).
   */
  {
    id: 'ghost-lines',
    index: '03',
    badge: 'Predictive Ghost Lines',
    eyebrow: 'OLS · VWLR · VWEPR · FCST',
    heading: 'Four projection models, free to disagree with each other.',
    body: 'Most terminals draw one forward line and let you assume it means something. Strat AI runs eight projection engines, four of them selectable directly on the chart, each using genuinely different mathematics. Switch model and the line changes — which is the entire point. A projection you cannot cross-examine is decoration.',
    bullets: [
      {
        title: 'OLS — unweighted least squares',
        body: 'A straight line fitted across a fifty-bar window, then re-anchored onto the last close. The baseline case, where every bar counts the same regardless of what traded.',
      },
      {
        title: 'VWLR — volume-weighted least squares',
        body: 'The same straight-line model, weighted by traded volume with weights floored at one, so bars where size genuinely changed hands pull the fit harder than quiet ones do.',
      },
      {
        title: 'VWEPR — volume-weighted quadratic',
        body: 'A curve rather than a line, solved by Gaussian elimination with partial pivoting and falling back to OLS if the system turns out singular. Quadratic and not cubic on purpose — a cubic flies off the screen. Its second-order term is surfaced as an acceleration coefficient.',
      },
      {
        title: 'FCST — regime-conditioned forecast',
        body: 'Not a regression at all. An exponentially weighted drift over log returns, then conditioned on the measured regime: amplified in a trending market, damped in a ranging one. It reports a direction, an up-probability, an expected move in ATR units and its own confidence.',
      },
    ],
    footnote:
      'The fifty-bar window is pinned to the same constant the agent’s own tools use, so the projection you see and the projection it reasons about cannot drift apart. R-squared is reported only by the dedicated predictive model that actually computes it, and only on the ten-minute chart it was calibrated for.',
    mock: 'ghostline',
    mediaSide: 'right',
  },

  /**
   * Catalogue 10.6 (2% absolute move trigger on the 10m candle stream, LLM
   * returns headline + analysis + sentiment, broadcast live, UI escalates
   * shading at 3%, third pattern engine with a pinned four-field contract).
   *
   * Deliberately does NOT claim sector volume surges: that appears in older
   * marketing copy but not in the catalogue.
   */
  {
    id: 'surveillance',
    index: '04',
    badge: 'Market Surveillance',
    eyebrow: 'ANOMALY COMMENTARY',
    heading: 'It notices the move before the newswire explains it.',
    body: 'A separate service watches ten-minute candles for a two percent absolute move. When one fires it asks a model for a cause, then publishes a headline, a written read and a sentiment assessment straight into the terminal — shaded harder once the move clears three percent.',
    bullets: [
      {
        title: 'Distinct from the news scorer',
        body: 'This is not headline sentiment wearing a different label. It triggers on price behaviour first and reaches for explanation second, which is why it can surface a move that has not reached a feed yet.',
      },
      {
        title: 'Its own structural pass',
        body: 'The same service runs a hundred-candle pattern engine against a pinned four-field contract: type, sentiment, description, and a confidence clamped between zero and one.',
      },
      {
        title: 'No cause, no story',
        body: 'When nothing explanatory can be found, it reports exactly that. It will not assemble a plausible narrative to keep the panel looking populated.',
      },
      {
        title: 'Pushed, not polled',
        body: 'Insights are broadcast to the terminal as they are produced, so the commentary lands while the candle still matters.',
      },
    ],
    mock: 'anomaly',
    mediaSide: 'left',
  },
];

/* ------------------------------------------------------------- mock content */

/**
 * Illustrative terminal states. Numbers are internally consistent and
 * demonstrate documented behaviour — including an honest-unavailable tool
 * result (catalogue 3.4) and a stand-aside decision (catalogue 3.7).
 */
export const chatMock: ChatMockContent = {
  frameLabel: 'STRAT_AI_COPILOT',
  status: 'STREAMING',
  promptLabel: 'You',
  prompt: 'Is RELIANCE worth a long here, or should I sit this one out?',
  events: [
    {
      kind: 'tool',
      label: 'get_multi_tf_trend',
      detail: '1H up · 4H up · 1D flat',
    },
    {
      kind: 'tool',
      label: 'get_consensus_report',
      detail: 'RSI 61.4 · MACD hist +2.10 · ATR 18.90',
    },
    {
      kind: 'tool',
      label: 'get_market_regime',
      detail: 'trending · normal volatility · favourable',
    },
    {
      kind: 'tool',
      label: 'get_volume_profile',
      detail: 'POC 1302.40 · price inside value area',
    },
    {
      kind: 'unavailable',
      label: 'get_order_flow',
      detail: 'unavailable — usable tick count below minimum',
    },
    {
      kind: 'reasoning',
      label: 'Reasoning',
      detail:
        'Macro is aligned and structure is constructive, but order flow could not be measured — so it is not counted as confirmation.',
    },
    {
      kind: 'decision',
      label: 'HOLD',
      detail: 'Best read: bias up, reference level 1302.40',
    },
  ],
  footnote:
    'Illustrative. A tool that cannot measure returns an unavailable marker, and the run is permitted to conclude with no trade.',
};

/**
 * A genuine rejection, not a pass.
 *
 * Risk = |1298.50 − 1291.00| = 7.50. Floor = 1.5 × ATR(14) 18.90 = 28.35.
 * 7.50 < 28.35, so check 3 fails with `stop-too-tight`. Checks run in fixed
 * order and stop at the first failure (catalogue 8.2), which is why the
 * reward-to-risk check is never reached.
 */
export const verifyMock: VerifyMockContent = {
  frameLabel: 'VERIFY — PRE-TRADE AUDIT',
  status: 'INTRADAY',
  inputsLabel: 'YOUR LEVELS',
  inputs: [
    { label: 'Direction', value: 'BUY' },
    { label: 'Entry', value: '1,298.50' },
    { label: 'Stop', value: '1,291.00' },
    { label: 'Target', value: '1,316.00' },
    { label: 'ATR(14)', value: '18.90' },
    { label: 'Floor (1.5× ATR)', value: '28.35' },
  ],
  checksLabel: 'DETERMINISTIC CHECKS',
  checks: [
    {
      label: 'Levels present and finite',
      state: 'pass',
      detail: 'OK',
    },
    {
      label: 'Direction ordering — stop < entry < target',
      state: 'pass',
      detail: 'OK',
    },
    {
      label: 'Stop distance ≥ 1.5× ATR(14)',
      state: 'fail',
      detail: '7.50 · needs 28.35',
    },
    {
      label: 'Reward-to-risk ≥ 1:1.3',
      state: 'skipped',
      detail: 'not reached',
    },
  ],
  verdict: {
    label: 'REJECTED',
    tag: 'stop-too-tight',
    note: 'A rejection is not a resize. The stop floor holds for every profile.',
  },
  critiqueLabel: 'BEAR AGENT CRITIQUE',
  critique: [
    'Overhead VWAP at 1,304.20 caps the path to your target',
    'Call open-interest wall concentrated at the 1,300 strike',
    'Midday session phase — historically thin and choppy',
  ],
  critiqueNote:
    'Advisory only. The Bear agent cannot commit, block, or override a decision.',
};

/** Catalogue 2.1 for the mathematics, 2.3 for projection length. */
export const ghostLineMock: GhostLineMockContent = {
  frameLabel: 'PROJECTION MODEL',
  status: 'RELIANCE · 10m',
  modes: [
    {
      id: 'ols',
      label: 'OLS',
      math: 'Unweighted least squares · straight line',
      window: '50 bars',
      rows: [
        { label: 'Fit basis', value: 'every bar equal' },
        { label: 'Re-anchored to', value: 'last close' },
        { label: 'Confidence', value: 'not reported' },
      ],
    },
    {
      id: 'vwlr',
      label: 'VWLR',
      math: 'Volume-weighted least squares · straight line',
      window: '50 bars',
      rows: [
        { label: 'Weights', value: 'max(volume, 1)' },
        { label: 'Degenerate guard', value: '|denom| < 1e-12' },
        { label: 'Confidence', value: 'not reported' },
      ],
    },
    {
      id: 'vwepr',
      label: 'VWEPR',
      math: 'Volume-weighted quadratic · a₀ + a₁x + a₂x²',
      window: '50 bars',
      rows: [
        { label: 'Solver', value: 'Gaussian, partial pivot' },
        { label: 'Singular fallback', value: 'reverts to OLS' },
        { label: 'Acceleration term', value: 'a₂ reported' },
      ],
    },
    {
      id: 'fcst',
      label: 'FCST',
      math: 'Regime-conditioned EWMA drift · geometric',
      window: '30-bar drift',
      rows: [
        { label: 'Trending weight', value: '1.5×' },
        { label: 'Ranging weight', value: '0.5×' },
        { label: 'Reports', value: 'up-probability, ATR move' },
      ],
    },
  ],
  projectionNote:
    'Projection length tracks zoom — twelve percent of visible bars, clamped between three and twenty, counted in actual bars so overnight and weekend gaps do not stretch it.',
  confidenceNote:
    'R-squared comes from the dedicated ten-minute predictive model, not from these four fits.',
};

/** Catalogue 10.6. */
export const anomalyMock: AnomalyMockContent = {
  frameLabel: 'MARKET SURVEILLANCE',
  status: 'LIVE',
  symbol: 'TATAMOTORS',
  move: '+2.34%',
  window: '10m candle',
  severity: 'TRIGGERED',
  headline: 'Bid steps up as volume expands off the value-area low',
  commentary:
    'Price cleared the prior ten-minute range on expanding volume, with no scheduled event inside the window and no matching headline on the feed yet.',
  sentiment: 'Bullish · 71',
  rows: [
    { label: 'Trigger threshold', value: '≥ 2.00% absolute' },
    { label: 'Escalated shading', value: '≥ 3.00%' },
    { label: 'Source stream', value: '10-minute candles' },
  ],
  footnote:
    'When no explanatory cause can be found, the panel reports that instead of generating a narrative.',
};
