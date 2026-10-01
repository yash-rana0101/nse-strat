import type { SampleTrade } from '../../sampleResponses';

const closes = [
  24, 19, 22, 28, 25, 36, 51, 45, 58, 74, 68, 83, 76, 63, 70, 58, 66, 79, 60,
  52, 58, 48, 53, 40, 46, 58,
];

export default function SamplePriceChart({ trade }: { trade: SampleTrade }) {
  const bullish = trade.side === 'BUY';
  return (
    <div
      className={`sample-chart ${bullish ? 'chart-bullish' : ''}`}
      role="img"
      aria-label={`Illustrative ${bullish ? 'bullish' : 'bearish'} candlestick pattern. Simulated chart, not live price data.`}
    >
      <div className="chart-zone" />
      <div className="chart-candles">
        {closes.map((close, index) => {
          const previous = index ? closes[index - 1] : 31;
          const top = Math.min(previous, close);
          const height = Math.max(3, Math.abs(close - previous));
          return (
            <div className="chart-column" key={index}>
              <i
                className="candle-wick"
                style={{ top: `${top - 6}%`, height: `${height + 13}%` }}
              />
              <span
                className={`candle-body ${close < previous ? 'up' : 'down'}`}
                style={{ top: `${top}%`, height: `${height}%` }}
              />
            </div>
          );
        })}
      </div>
      <div className="chart-projection" />
      <span className="chart-caption">ILLUSTRATIVE PRICE ACTION</span>
    </div>
  );
}
