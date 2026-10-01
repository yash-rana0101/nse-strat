import type { SampleTrade } from '../../sampleResponses';
export type TradeSetup = {
  side: SampleTrade['side'];
  entry: number;
  stop: number;
  target: number;
  notes: string;
};
export function validateSetup(s: TradeSetup) {
  if (![s.entry, s.stop, s.target].every((v) => Number.isFinite(v) && v > 0))
    return 'Enter valid positive prices for entry, stop loss, and take profit.';
  if (s.side === 'BUY' && !(s.stop < s.entry && s.target > s.entry))
    return 'Long setup: stop must be below entry and target above entry.';
  if (s.side === 'SELL' && !(s.stop > s.entry && s.target < s.entry))
    return 'Short setup: stop must be above entry and target below entry.';
  return '';
}
