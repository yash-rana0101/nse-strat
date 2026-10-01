import type { ReactNode } from 'react';

export type GraphIconKind =
  | 'chat'
  | 'agent'
  | 'data'
  | 'trend'
  | 'volume'
  | 'levels'
  | 'timeframes'
  | 'consensus'
  | 'regime'
  | 'volumeProfile'
  | 'support'
  | 'volatility'
  | 'momentum'
  | 'strength'
  | 'liquidity'
  | 'validation'
  | 'riskReward'
  | 'optionsChain'
  | 'greeks'
  | 'candles'
  | 'orderFlow'
  | 'priceAction'
  | 'setContext'
  | 'response';

const artwork: Record<GraphIconKind, ReactNode> = {
  chat: (
    <>
      <path d="M5 5.5h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H10l-5 3v-3a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2Z" />
      <path d="M7 10h10M7 14h7" />
    </>
  ),
  agent: (
    <>
      <path d="M12 3v3M9.5 3h5M5 9a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v9a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V9ZM3 12v4M21 12v4" />
      <circle cx="9" cy="12" r="1" />
      <circle cx="15" cy="12" r="1" />
      <path d="M9 17h6" />
    </>
  ),
  data: (
    <>
      <ellipse cx="12" cy="5.5" rx="8" ry="3" />
      <path d="M4 5.5v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6M4 11.5v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
    </>
  ),
  trend: (
    <>
      <path d="M3 19h18M4 16l5-5 4 3 7-8M16 6h4v4" />
    </>
  ),
  volume: (
    <>
      <path d="M3 20h18M5 16h3v4H5zM10 11h3v9h-3zM15 5h3v15h-3z" />
    </>
  ),
  levels: (
    <>
      <path d="M3 7h18M3 17h18M5 12l4-2 4 3 6-3" />
      <circle cx="9" cy="10" r="1" />
      <circle cx="13" cy="13" r="1" />
    </>
  ),
  timeframes: (
    <>
      <path d="M3 4v16h18M5 10l3-3 3 2 3-4M5 17l4-2 3 1 5-5 3 1" />
    </>
  ),
  consensus: (
    <>
      <path d="M4 7h10M4 12h10M4 17h10M16 7l2 2 3-4M16 12l2 2 3-4M16 17l2 2 3-4" />
    </>
  ),
  regime: (
    <>
      <circle cx="12" cy="12" r="2.5" />
      <path d="M12 9.5V4h7M14.5 12H20v7M9.5 12H4v7M19 4l2 2-2 2M20 19l-2-2M4 19l2-2" />
    </>
  ),
  volumeProfile: (
    <>
      <path d="M4 4v16h16M4 7h7M4 10h11M4 13h16M4 16h10M4 19h5" />
    </>
  ),
  support: (
    <>
      <path d="M3 6h18M3 18h18M5 13l4-3 4 3 5-4 2 2" />
      <circle cx="9" cy="10" r="1" />
    </>
  ),
  volatility: (
    <>
      <path d="M3 12h3l2-6 4 12 3-8 2 3h4M4 4v16M20 4v16" />
    </>
  ),
  momentum: (
    <>
      <path d="M5 17h4l3-12 3 8h4M17 4l3 3-3 3" />
    </>
  ),
  strength: (
    <>
      <path d="M3 19h18M4 16l5-3 4 1 6-9M4 19l5-2 4-1 6-5" />
    </>
  ),
  liquidity: (
    <>
      <path d="M12 3c-2.5 3.5-6 7-6 11a6 6 0 0 0 12 0c0-4-3.5-7.5-6-11Z" />
      <path d="M9 16c.7 1 1.7 1.5 3 1.5" />
    </>
  ),
  validation: (
    <>
      <path d="M12 3 20 6v6c0 5-3.5 7.7-8 9-4.5-1.3-8-4-8-9V6l8-3Z" />
      <path d="m8.5 12 2.3 2.3 4.7-4.7" />
    </>
  ),
  riskReward: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M4 12h5M15 12h5M6 9l-3 3 3 3M18 9l3 3-3 3M12 3v5M12 16v5" />
    </>
  ),
  optionsChain: (
    <>
      <rect x="3" y="4" width="7" height="6" rx="1" />
      <rect x="14" y="4" width="7" height="6" rx="1" />
      <rect x="3" y="14" width="7" height="6" rx="1" />
      <rect x="14" y="14" width="7" height="6" rx="1" />
      <path d="M10 7h4M10 17h4M6.5 10v4M17.5 10v4" />
    </>
  ),
  greeks: (
    <>
      <path d="M3 19 9 5l6 14H3ZM6 14h6M17 6h4M19 4v8M17 17h4M19 15v4" />
    </>
  ),
  candles: (
    <>
      <path d="M5 3v18M12 3v18M19 3v18" />
      <rect x="3" y="7" width="4" height="7" rx=".5" />
      <rect x="10" y="10" width="4" height="6" rx=".5" />
      <rect x="17" y="5" width="4" height="9" rx=".5" />
    </>
  ),
  orderFlow: (
    <>
      <circle cx="5" cy="5" r="2" />
      <circle cx="19" cy="9" r="2" />
      <circle cx="5" cy="19" r="2" />
      <path d="M7 5h5a4 4 0 0 1 4 4h1M12 9v6a4 4 0 0 1-4 4H7M13 13l-2-2 2-2" />
    </>
  ),
  priceAction: (
    <>
      <path d="M3 19h18M4 15l4-4 3 2 4-7 4 3M16 6h3v3" />
      <circle cx="8" cy="11" r=".8" />
      <circle cx="15" cy="6" r=".8" />
    </>
  ),
  setContext: (
    <>
      <path d="M4 6h16M4 12h16M4 18h16" />
      <circle cx="9" cy="6" r="2" fill="currentColor" stroke="none" />
      <circle cx="16" cy="12" r="2" fill="currentColor" stroke="none" />
      <circle cx="11" cy="18" r="2" fill="currentColor" stroke="none" />
    </>
  ),
  response: (
    <>
      <path d="M4 5h16v12H9l-5 4V5Z" />
      <path d="M8 11h7M13 8l3 3-3 3" />
    </>
  ),
};

export default function GraphIcon({ kind }: { kind: GraphIconKind }) {
  return (
    <svg
      className={`glyph graph-icon graph-icon-${kind}`}
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {artwork[kind]}
    </svg>
  );
}
