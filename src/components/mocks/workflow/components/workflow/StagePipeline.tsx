import { stages } from './constants';
import type { WorkflowController } from './useWorkflowDemo';
export default function StagePipeline({ demo }: { demo: WorkflowController }) {
  const { phase } = demo;
  return (
    <div className="pipeline">
      <div className="tiny-label">
        THE AGENTIC LOOP <span>6 COORDINATED STAGES</span>
      </div>
      <ol>
        {stages.map((s, i) => (
          <li
            key={s}
            className={phase === i ? 'current' : phase > i ? 'complete' : ''}
          >
            <span>{phase > i ? '✓' : `0${i + 1}`}</span>
            <small>{s}</small>
          </li>
        ))}
      </ol>
    </div>
  );
}
