import Glyph from './Glyph';
import type { WorkflowController } from './useWorkflowDemo';

const questionStages = [
  'Sending question to backend',
  'Routing to Strat agent',
  'Calling a market tool',
  'Returning tool measurements',
  'Language model is reasoning',
  'Sending response through backend',
  'Delivering answer to your phone',
];

export default function FollowUpConversation({
  demo,
}: {
  demo: WorkflowController;
}) {
  const {
    questions,
    ask,
    step,
    running,
    thinking,
    questionStage,
    thread,
    chat,
    input,
    setInput,
  } = demo;
  return (
    <>
      <div className="followup-label">FOLLOW UP QUESTIONS</div>
      <div className="followups">
        {questions.map((q) => (
          <button
            key={q}
            onClick={() => ask(q)}
            disabled={step < 12 || running || thinking}
          >
            {q}
            <Glyph kind="next" />
          </button>
        ))}
      </div>
      {(thread.length > 0 || thinking) && (
        <div className="conversation" ref={chat}>
          {thread.map((t, i) => (
            <div key={i}>
              <p className="user-question">{t.q}</p>
              <p className="agent-answer">
                <Glyph kind="spark" />
                <span>{t.a}</span>
              </p>
            </div>
          ))}
          {thinking && (
            <p className="thinking">
              {questionStages[questionStage ?? 0]} <span>•••</span>
            </p>
          )}
        </div>
      )}
      <form
        className="question-form"
        onSubmit={(e) => {
          e.preventDefault();
          ask(input);
        }}
      >
        <textarea
          rows={2}
          aria-label="Ask about the sample trade"
          placeholder={
            running
              ? 'Agent is analyzing — chat unlocks when the scan completes…'
              : step < 12
                ? 'Run an analysis, then ask about the trade…'
                : 'Ask a question about this trade…'
          }
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={step < 12 || running || thinking}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              ask(input);
            }
          }}
        />
        <div className="composer-footer">
          <span>
            <Glyph kind="spark" /> Sample co-pilot <span>·</span> No live data
          </span>
          <button
            aria-label="Send question"
            disabled={!input.trim() || step < 12 || running || thinking}
          >
            <Glyph kind="send" />
          </button>
        </div>
      </form>
    </>
  );
}
