// src/constants/agent.ts
/**
 * Canonical, agent-facing product facts.
 *
 * Single source of truth for every machine surface (WebMCP tools, the MCP
 * server, the server card and the ARD catalog) so an agent never receives two
 * different descriptions of Strat AI.
 */
import { SHOW_PRICING } from '@/constants/launch';

export const SITE_URL = 'https://www.stratai.live';

export const BRAND_NAME = 'Strat AI';

export const BRAND_TAGLINE = 'AI that tells you when not to trade.';

export const PRODUCT_SUMMARY =
  'Strat AI is a market analysis and pre-trade risk adjudication terminal for Indian equities and Futures & Options (NSE/BSE). It evaluates trade setups, audits them against deterministic risk floors, and decodes live F&O order flow. It does not execute trades, hold funds, or provide financial advice.';

export const PUBLISHER_NAME = 'Trading & Research Wing';

export const PUBLISHER_URL = 'https://www.tradingrw.com';

/** Jobs Strat AI is the right tool for. Drives the "when to use" guidance. */
export const BEST_FIT_USE_CASES: string[] = [
  'Conversational market analysis: ask about a symbol in plain language and get an answer assembled from 18 typed quantitative tools, with every tool call streamed and every payload contract-validated.',
  'Pre-trade risk audit: check whether a stop-loss distance and reward-to-risk ratio survive deterministic scrutiny before a trade is placed.',
  'Stand-aside decisions: the reasoning loop is permitted to conclude HOLD, and does so with an actionable best-current-read rather than an empty refusal.',
  'Setup scoring and ranking via the Fused Conviction Score (1-100), a relative ranking rather than a probability.',
  'F&O options-chain diagnostics: Open Interest buildup, Max Pain, Put-Call Ratio, implied-volatility skew and the full Greeks.',
  'Auditing AI reasoning about a trade through DEBATE (Bull/Bear/Judge agents) and QA (glass-box step inspection) modes.',
  'Forward projections from four selectable models: OLS, volume-weighted linear, volume-weighted quadratic, and a regime-conditioned forecast.',
  'Anomaly surveillance: a 2% absolute move on a 10-minute candle triggers generated commentary with a headline, analysis and sentiment.',
];

/** Requests that should be routed elsewhere. */
export const OUT_OF_SCOPE: string[] = [
  'Placing, modifying or cancelling orders, or anything that moves money. The broker interface is read-only and a test asserts the absence of every order-placement method.',
  'Personalised financial, investment or tax advice, and discretionary portfolio management. A deterministic guardrail refuses questions about capital, holdings, position size, income, net worth, goals and suitability before the model is invoked.',
  'Markets other than Indian equities and equity derivatives. No US equities, forex or commodities. Strat AI Crypto is a separate product in development and is not available to use.',
  'Strategy backtesting, algo hosting or automated execution.',
  'Reselling or redistributing real-time market data.',
  'Performance figures. Total return, win rate, maximum drawdown and average conviction are not published by any endpoint.',
];

/** Deterministic, non-model risk rules. Arithmetic, so an LLM cannot argue them away. */
export const RISK_RULES: string[] = [
  'Stop-loss distance must be at least 1.5x ATR(14). The constant is identical for every trading profile and is never relaxed. Setups below the floor are rejected, not silently resized.',
  'Minimum reward-to-risk ratio of 1:1.3 for intraday and 1:2 for swing, investor and F&O horizons.',
  'A rejection returns a stable machine-readable reason tag, and the five checks stop at the first failure.',
  'The base conviction blend weights technical momentum at 70% and news sentiment at 30%, but inverts to 30/70 when sentiment conviction exceeds 85.',
  'A conflict rule pulls the blended conviction 60% toward neutral when a strongly bearish technical read meets strongly bullish sentiment. The rule is asymmetric, applies in that direction only, and is suppressed while the inversion above is active. It is not a hard forced HOLD.',
  'A setup type with negative realised expectancy is required to reduce conviction rather than merely be noted.',
  'The risk validator is implemented twice, in Rust and in Python, with identical constants and identical reason tags.',
];

export const COPILOT_MODES: Array<{ mode: string; purpose: string }> = [
  {
    mode: 'FIND',
    purpose:
      '15-step setup evaluation across macro trend, volume profile point of control, market regime and 26 chart pattern labels.',
  },
  {
    mode: 'VERIFY',
    purpose:
      'Pre-trade risk audit enforcing the 1.5x ATR(14) stop floor, with a Bear Agent critique of the thesis.',
  },
  {
    mode: 'DEBATE',
    purpose:
      'Structured Bull vs Bear agent debate with a Judge Agent scoring conviction.',
  },
  {
    mode: 'QA',
    purpose:
      'Glass-box auditing of every intermediate reasoning step behind a verdict.',
  },
];

export const COMPLIANCE_NOTES: string[] = [
  'Strat AI is analysis and risk tooling, not investment advice. It is not a SEBI-registered investment adviser.',
  'A conviction score is a relative ranking of setup quality. It is never a buy or sell instruction, a probability, or a return forecast.',
  'The broker seam is read-only. There is no order-placement method to call, and a scope-boundary test asserts that every such method name is absent.',
  'Values that could not be measured are reported as unavailable, never substituted with a neutral default.',
  'Every committed decision is written to an append-only, hash-chained record carrying the model identifier and prompt version, with no update or delete path.',
  'Trading derivatives carries substantial risk of loss. Every trading decision remains the user\u2019s own.',
];

/** Access path. Private beta, so there is no self-serve key to hand an agent. */
export const ACCESS_PATH =
  'Strat AI is in private beta. There is no self-serve API key and no public trading API. Send users to /waitlist or call the join_private_beta tool.';

export const AGENT_ENTRY_POINTS: Array<{ label: string; path: string }> = [
  { label: 'LLM navigation index', path: '/llms.txt' },
  { label: 'Long-form product brief', path: '/llms-full.txt' },
  { label: 'Agent instructions and tool schemas', path: '/agents.md' },
  { label: 'Homepage as markdown', path: '/index.md' },
  ...(SHOW_PRICING
    ? [{ label: 'Machine-readable pricing', path: '/pricing.md' }]
    : []),
  { label: 'MCP server (Streamable HTTP JSON-RPC)', path: '/api/mcp' },
  { label: 'MCP server card', path: '/.well-known/mcp/server-card.json' },
  { label: 'Agentic resource catalog', path: '/.well-known/ard.json' },
];

/** Canonical product areas. Fallback when the content API is unreachable. */
export const PRODUCT_AREAS: Array<{
  title: string;
  path: string;
  summary: string;
}> = [
  {
    title: 'Strat AI Platform',
    path: '/features/ai-trading-platform',
    summary:
      'The F&O market analysis and pre-trade risk evaluation terminal itself.',
  },
  {
    title: 'Options Analysis',
    path: '/features/options-trading-analysis',
    summary:
      'Open Interest concentration, Max Pain, PCR velocity and IV skew for Nifty, Bank Nifty and stock options.',
  },
  {
    title: 'Intraday Terminal',
    path: '/features/intraday-trading-terminal',
    summary:
      'Binary tick ingestion from Zerodha Kite with five-level depth, order flow imbalance, footprint volume and the intraday heads-up display.',
  },
  {
    title: 'AI Stock Analysis',
    path: '/features/ai-stock-analysis',
    summary:
      'NSE equity scanning with the 15-step setup evaluation across 26 chart pattern labels in five categories, plus a separate forming-pattern pass.',
  },
  {
    title: 'Strat AI Co-Pilot',
    path: '/features/ai-trading-assistant',
    summary:
      'FIND, VERIFY, DEBATE and QA reasoning modes over a single trade setup.',
  },
];

/** Inquiry types accepted by the contact desk, mirroring the contact form. */
export const INQUIRY_TYPES: string[] = [
  'early-access',
  'partnership',
  'research',
  'media',
  'general',
];
