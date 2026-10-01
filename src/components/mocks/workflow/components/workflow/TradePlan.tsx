import Glyph from './Glyph';
import SamplePriceChart from './SamplePriceChart';
import { money, response } from '../../sampleResponses';
import { registry } from './constants';
import type { WorkflowController } from './useWorkflowDemo';

export default function TradePlan({ demo }: { demo: WorkflowController }) {
  const { step, trade, mode, result, telemetry, setTelemetry, data, running } =
    demo;
  if (mode === 'verify' && step === -2) return null;
  if (step < 12 && step !== -2) {
    return (
      <div className="empty-plan">
        <div className="empty-icon">
          <Glyph kind={running ? 'agent' : 'spark'} />
        </div>
        <h3>Building a plan from evidence…</h3>
        <p>Typed tools are validating the sample market data.</p>
        <span>MEASURE → VALIDATE → REASON</span>
      </div>
    );
  }
  return (
    <div className={`trade-plan ${trade.side === 'BUY' ? 'bullish' : ''}`}>
      <div className="response-topline">
        <span>
          <Glyph kind="agent" /> CO-PILOT RESPONSE
        </span>
        <small>
          <i /> {step === -2 ? 'Sample preview' : 'Just now'}
        </small>
      </div>
      <div className="response-body">
        <div className="response-summary">
          <div className="response-symbol">
            <strong>{trade.symbol}</strong>
            <span>10m</span>
            <span>{trade.side === 'BUY' ? 'Long' : 'Short'}</span>
          </div>
          <h3>
            {trade.side} / {trade.side === 'BUY' ? 'LONG' : 'SHORT'}
          </h3>
          <p className="sample-response">{response(trade, mode)}</p>
        </div>
        <div className="response-visual">
          <div className="score-badge">
            <Glyph kind="volume" />
            <strong>{trade.score}%</strong>
            <span>Conviction</span>
          </div>
          <SamplePriceChart trade={trade} />
        </div>
      </div>
      <div className="signal-tags">
        <span>Trend aligned</span>
        <span>Volume confirms</span>
        <span>
          {result.passed ? 'Clean structure' : 'Review stop distance'}
        </span>
      </div>
      <div className="execution-cards">
        <div>
          <Glyph kind="agent" />
          <span>
            Entry<strong>{money(trade.entry)}</strong>
          </span>
        </div>
        <div>
          <Glyph kind="shield" />
          <span>
            Stop loss<strong>{money(trade.stop)}</strong>
          </span>
        </div>
        <div>
          <Glyph kind="levels" />
          <span>
            Target<strong>{money(trade.target)}</strong>
          </span>
          <b>R:R {result.rr.toFixed(2)}</b>
        </div>
      </div>
      <div className={`validation ${!result.passed ? 'failed' : ''}`}>
        <Glyph kind="shield" /> Stop {money(result.risk)}{' '}
        {result.passed ? '≥' : '<'} ₹{result.floor.toFixed(3)}{' '}
        <span>(1.5 × ATR)</span>
        <b>{result.passed ? 'PASS' : 'FAIL'}</b>
      </div>
      <p className="invalidation">
        Invalidated {trade.side === 'BUY' ? 'below' : 'above'}{' '}
        {money(trade.stop)}. {trade.riskNote}
      </p>
      <button
        className="telemetry-toggle"
        onClick={() => setTelemetry(!telemetry)}
        aria-expanded={telemetry}
      >
        View raw measurements <Glyph kind={telemetry ? 'minus' : 'plus'} />
      </button>
      {telemetry && (
        <div className="telemetry">
          {data.map((measurement, index) => (
            <p key={measurement}>
              <code>{registry[index]}</code>
              <span>{measurement}</span>
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
