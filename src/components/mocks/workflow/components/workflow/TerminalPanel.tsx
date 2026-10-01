import SetupPanel from './SetupPanel';
import ModeSelector from './ModeSelector';
import { stages } from './constants';
import Glyph from './Glyph';
import ToolFeed from './ToolFeed';
import TradePlan from './TradePlan';
import FollowUpConversation from './FollowUpConversation';
import ReadyState from './ReadyState';
import type { WorkflowController } from './useWorkflowDemo';
export default function TerminalPanel({ demo }: { demo: WorkflowController }) {
  const { mode, running, trade, phase, step, thinking, setupNotes, viewport } =
    demo;
  return (
    <div className="terminal">
      <div className="app-status-bar" aria-hidden="true">
        <span>9:41</span>
        <span className="app-status-icons">
          <span className="app-signal" />
          <span className="app-wifi" />
          <span className="app-battery" />
        </span>
      </div>
      <header className="chat-product-header">
        <div className="app-brand-lockup">
          <img src="/strat.svg" alt="" />
          <div>
            <strong>Strat AI</strong>
            <small>MARKET CO-PILOT</small>
          </div>
        </div>
        <span className="app-demo-badge">
          <i /> SAMPLE REPLAY
        </span>
      </header>
      <ModeSelector demo={demo} />
      <div className="terminal-meta">
        <span>
          <i />
          {trade.symbol}
          <b>·</b> 10m <b>·</b> Intraday
        </span>
        <span className="replay-tag">
          SAMPLE {String(trade.id).padStart(2, '0')} / 10
        </span>
      </div>
      <div
        className="terminal-scroll"
        ref={viewport}
        tabIndex={0}
        role="region"
        aria-label="Scrollable trade analysis"
      >
        {mode === 'find' && step === -2 && <ReadyState />}
        {mode === 'verify' && <SetupPanel demo={demo} />}{' '}
        {step !== -2 && (
          <section
            className="chat-workflow"
            aria-label="Co-pilot chat workflow"
          >
            <div className="chat-workflow-heading">
              <span>
                <Glyph kind="agent" /> STRAT CO-PILOT
              </span>
              <small>
                {step === -2
                  ? 'Ready for your request'
                  : thinking
                    ? 'Reviewing your question'
                    : running
                      ? stages[Math.max(0, phase)]
                      : 'Analysis complete'}
              </small>
            </div>
            {step !== -2 && (
              <div className="chat-request">
                <Glyph kind="chat" />
                <span>
                  {mode === 'find'
                    ? `Find an intraday trade for ${trade.symbol}`
                    : `Verify my ${trade.symbol} ${trade.side === 'BUY' ? 'long' : 'short'} setup`}
                </span>
              </div>
            )}
            {setupNotes && (
              <p className="chat-setup-notes">Your rationale: {setupNotes}</p>
            )}
            <ToolFeed demo={demo} />
            <TradePlan demo={demo} />
            {step >= 12 && <FollowUpConversation demo={demo} />}
          </section>
        )}
      </div>
      <div className="terminal-footer">
        <i />
        Grounded in tools. Explained by AI.
      </div>
    </div>
  );
}
