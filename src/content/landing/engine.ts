import type { EngineContent } from '@/types/landing';

/**
 * The three-layer explanation of why the model never authors a number.
 *
 * Claims:
 * - Kite binary frame decoding, mode inferred from packet length, five-level
 *   depth in full mode, open interest kept as an optional and never
 *   fabricated as zero — FEATURE_CATALOGUE 1.1
 * - Dual sink topology and bounded channel — 1.2
 * - Pure property-tested quant modules; NaN on the wire becomes JSON null;
 *   UNAVAILABLE is a distinct consensus state from NEUTRAL — 4.1, 4.2
 * - 26 pattern labels across five categories — 5.1
 * - Volume profile POC / VAH / VAL — 6.5
 * - 1.5x ATR validator mirrored in two languages — 8.1
 * - 18 typed tools, validate_contract on every payload, three distinct tool
 *   bindings — 3.4, 3.5
 * - Glass-box typed event stream — 3.1
 */
export const engine: EngineContent = {
  intro: {
    id: 'engine',
    badge: 'How the numbers reach the model',
    heading: 'Three layers, and the middle one is arithmetic',
    body: 'A language model asked to read a chart will produce a confident number whether or not one exists. So it is never asked to. Measurement and reasoning are separate layers here, and the boundary between them is a typed tool contract.',
  },
  layers: [
    {
      index: '01',
      label: 'Market',
      heading: 'Ingested raw, decoded in Rust',
      body: 'Exchange binary frames are decoded field by field — no JSON, no REST polling — with five levels of book depth in full mode. Open interest stays an optional value and is reported absent on packets that never carried it, rather than defaulted to zero.',
      chips: [
        'BINARY TICK FRAMES',
        'FIVE-LEVEL DEPTH',
        'DUAL SINK',
        'OPTION CHAIN SNAPSHOTS',
      ],
    },
    {
      index: '02',
      label: 'Quant',
      heading: 'Deterministic functions do the arithmetic',
      body: 'Indicators, pivots, volume profile, the pattern engine, the projection fits and the risk validators are pure, property-tested modules. A value that could not be measured is emitted as null, and a state that could not be measured reads UNAVAILABLE — which is a different finding from NEUTRAL.',
      chips: [
        '26 PATTERN LABELS',
        'POC · VAH · VAL',
        '1.5× ATR VALIDATOR',
        'UNAVAILABLE ≠ NEUTRAL',
      ],
    },
    {
      index: '03',
      label: 'Model',
      heading: 'MCP hands those numbers to the reasoning layer',
      body: 'Each computation is exposed as a typed tool. The agent calls it and reasons about what comes back, and every payload is contract-checked on the way through — so a tool cannot return an invented value even when a model would prefer one.',
      chips: [
        '18 TYPED TOOLS',
        'CONTRACT VALIDATION',
        'THREE TOOL BINDINGS',
        'GLASS-BOX STREAM',
      ],
    },
  ],
  punchline: {
    label: 'The point of all this',
    heading: 'The model never invents a number.',
    body: 'Every figure the terminal puts on screen came out of a deterministic function and reached the model as a typed tool result. That is why a missing feed shows up as unavailable instead of as a plausible-looking value, and why the reasoning can be audited line by line rather than taken on trust.',
  },
};
