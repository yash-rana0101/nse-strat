import { PiCheckCircle, PiCircle, PiCircleNotch } from 'react-icons/pi';
import { names } from './constants';
import { toolPresentation } from '../../toolPresentation';
import type { WorkflowController } from './useWorkflowDemo';

export default function ToolFeed({ demo }: { demo: WorkflowController }) {
  const { mode, step, running, thinking, feed, result, data, trade } = demo;
  if (step === -2) return null;
  const visibleTools = names.slice(
    0,
    Math.max(0, Math.min(names.length, step + 1))
  );
  return (
    <div className="feed">
      <div className="feed-heading">
        <span>
          {mode === 'find' ? 'SETUP SCAN' : 'SAMPLE TRADE VALIDATION'}
        </span>
        <span>
          {step === -2
            ? 'READY'
            : running
              ? 'ANALYZING'
              : thinking
                ? 'REASONING'
                : '11 / 11 COMPLETE'}
        </span>
      </div>
      <div className="feed-rows" ref={feed}>
        {visibleTools.map((name, index) => {
          const Icon = toolPresentation[index].icon;
          const completed = step > index;
          const active = step === index;
          const failed = completed && index === 9 && !result.passed;
          return (
            <div
              key={name}
              className={`feed-row ${completed ? 'done' : active ? 'working' : 'pending'} ${failed ? 'check-failed' : ''}`}
            >
              <span className="chat-tool-icon">
                <Icon aria-hidden="true" />
              </span>
              <div className="chat-tool-copy">
                <span className="feed-tool-label">
                  {mode === 'verify' && index === 9
                    ? 'Verify supplied sample levels'
                    : `Read ${name}`}
                </span>
                <small>
                  {completed ? data[index] : `${trade.symbol} · 10m`}
                </small>
              </div>
              <span
                className="status-icon"
                aria-label={
                  failed
                    ? 'Validation failed'
                    : completed
                      ? 'Complete'
                      : active
                        ? 'Running'
                        : 'Pending'
                }
              >
                {completed ? (
                  <PiCheckCircle />
                ) : active ? (
                  <PiCircleNotch className="chat-spinner" />
                ) : (
                  <PiCircle />
                )}
              </span>
            </div>
          );
        })}
      </div>
      <div className="chat-working-status">
        <PiCircleNotch
          className={running || thinking ? 'chat-spinner' : ''}
          aria-hidden="true"
        />
        <span>
          {running
            ? 'Working…'
            : thinking
              ? 'Thinking…'
              : step === -2
                ? 'Ready to analyze'
                : 'Analysis complete'}
        </span>
      </div>
    </div>
  );
}
