import { useState } from 'react';
import type { SampleTrade } from '../../sampleResponses';
import Glyph from './Glyph';
import { validateSetup } from './tradeSetup';
import type { WorkflowController } from './useWorkflowDemo';

type Side = SampleTrade['side'];
type Draft = { entry: string; stop: string; target: string; notes: string };

function sampleDraft(trade: SampleTrade, side: Side): Draft {
  if (side === trade.side) {
    return {
      entry: String(trade.entry),
      stop: String(trade.stop),
      target: String(trade.target),
      notes: trade.reason,
    };
  }

  const risk = Math.abs(trade.entry - trade.stop);
  const reward = Math.abs(trade.target - trade.entry);
  return {
    entry: String(trade.entry),
    stop: (trade.entry + (side === 'BUY' ? -risk : risk)).toFixed(2),
    target: (trade.entry + (side === 'BUY' ? reward : -reward)).toFixed(2),
    notes: `Sample ${side === 'BUY' ? 'long' : 'short'} idea for ${trade.symbol}. Check whether market measurements support it.`,
  };
}

export default function SetupPanel({ demo }: { demo: WorkflowController }) {
  const { trade, running, run } = demo;
  const [side, setSide] = useState<Side>(trade.side);
  const [drafts, setDrafts] = useState<Record<Side, Draft>>(() => ({
    BUY: sampleDraft(trade, 'BUY'),
    SELL: sampleDraft(trade, 'SELL'),
  }));
  const [error, setError] = useState('');
  const draft = drafts[side];

  function chooseSide(next: Side) {
    setSide(next);
    setError('');
  }

  function update(field: keyof Draft, value: string) {
    setDrafts((current) => ({
      ...current,
      [side]: { ...current[side], [field]: value },
    }));
    setError('');
  }

  return (
    <form
      className="setup-panel"
      role="region"
      id="verify-panel"
      aria-labelledby="analysis-mode-trigger"
      onSubmit={(event) => {
        event.preventDefault();
        const setup = {
          side,
          entry: Number(draft.entry),
          stop: Number(draft.stop),
          target: Number(draft.target),
          notes: draft.notes.trim(),
        };
        const message = validateSetup(setup);
        setError(message);
        if (!message) run('verify', setup);
      }}
    >
      <div className="setup-heading">
        <h3>CONFIGURE SETUP</h3>
        <span>{trade.symbol} · Sample context</span>
      </div>
      <fieldset disabled={running}>
        <legend className="sr-only">Trade direction</legend>
        <div className="setup-directions">
          <button
            type="button"
            aria-pressed={side === 'BUY'}
            className={side === 'BUY' ? 'chosen' : ''}
            onClick={() => chooseSide('BUY')}
          >
            BUY / LONG
          </button>
          <button
            type="button"
            aria-pressed={side === 'SELL'}
            className={side === 'SELL' ? 'chosen short' : ''}
            onClick={() => chooseSide('SELL')}
          >
            SELL / SHORT
          </button>
        </div>
        <div className="setup-prices">
          <label>
            ENTRY PRICE
            <input
              aria-label="Entry price"
              type="number"
              min="0.01"
              step="any"
              required
              value={draft.entry}
              onChange={(event) => update('entry', event.target.value)}
            />
          </label>
          <label>
            STOP LOSS
            <input
              aria-label="Stop loss"
              type="number"
              min="0.01"
              step="any"
              required
              value={draft.stop}
              onChange={(event) => update('stop', event.target.value)}
            />
          </label>
          <label>
            TAKE PROFIT
            <input
              aria-label="Take profit"
              type="number"
              min="0.01"
              step="any"
              required
              value={draft.target}
              onChange={(event) => update('target', event.target.value)}
            />
          </label>
        </div>
        <label className="setup-notes">
          MY ANALYSIS NOTES / SETUP RATIONALE
          <textarea
            rows={3}
            maxLength={1000}
            placeholder="E.g. Support held on the 10m chart; expecting a move toward resistance…"
            value={draft.notes}
            onChange={(event) => update('notes', event.target.value)}
          />
        </label>
        {error && (
          <p className="setup-error" role="alert">
            {error}
          </p>
        )}
        <button type="submit" className="setup-submit">
          <Glyph kind="shield" />
          {running ? 'VERIFYING…' : 'VERIFY MY SETUP'}
        </button>
      </fieldset>
      <p className="setup-disclaimer">
        Checks your levels against simulated measurements. No live prices.
      </p>
    </form>
  );
}
