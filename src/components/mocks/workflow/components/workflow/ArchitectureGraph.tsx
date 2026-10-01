import GraphToolGroups from './GraphToolGroups';
import GraphIcon from './GraphIcon';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import type { WorkflowController } from './useWorkflowDemo';
const GRAPH_WIDTH = 1035;
function FlowWire({
  kind,
  path,
  active,
}: {
  kind: string;
  path: string;
  active: boolean;
}) {
  return (
    <>
      <path className={`wire ${kind}`} d={path} />
      {active && <path className="wire-data" d={path} />}
    </>
  );
}
export default function ArchitectureGraph({
  demo,
}: {
  demo: WorkflowController;
}) {
  const { phase, step, running, questionStage, questionTool } = demo;
  const scanFlow = questionStage === null;
  const questionGroup =
    questionTool === 3 ? 'purple' : questionTool === 5 ? 'yellow' : 'blue';
  const frame = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    if (!frame.current) return;
    const observer = new ResizeObserver(([entry]) => {
      const next = Math.min(1, entry.contentRect.width / GRAPH_WIDTH);
      setScale((current) =>
        Math.abs(current - next) < 0.001 ? current : next
      );
    });
    observer.observe(frame.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div
      className="graph-frame"
      ref={frame}
      style={{ height: 700 * scale, '--graph-scale': scale } as CSSProperties}
    >
      <div className="graph">
        <svg
          className="wires"
          viewBox="0 0 660 350"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="4"
              markerHeight="4"
              orient="auto"
            >
              <path d="m0 0 10 5-10 5" fill="context-stroke" />
            </marker>
          </defs>
          <FlowWire
            kind="context"
            active={scanFlow && phase === 0}
            path="M613 126V10Q613 0 603 0H102Q92 0 92 10V35"
          />
          <FlowWire
            kind="context"
            active={scanFlow && phase === 0}
            path="M77 75V126"
          />
          <FlowWire
            kind="agent"
            active={scanFlow && phase === 1}
            path="M124 173H172"
          />
          <FlowWire
            kind="blue"
            active={
              scanFlow
                ? running && [0, 1, 2, 6, 7].includes(step)
                : questionStage === 2 && questionGroup === 'blue'
            }
            path="M269 173C305 173 310 64 339 64"
          />
          <FlowWire
            kind="blue"
            active={scanFlow && running && [0, 1, 2, 6, 7].includes(step)}
            path="M543 64C575 64 580 110 580 137"
          />
          <FlowWire
            kind="purple"
            active={
              scanFlow
                ? running && [3, 8].includes(step)
                : questionStage === 2 && questionGroup === 'purple'
            }
            path="M269 173H339"
          />
          <FlowWire
            kind="purple"
            active={scanFlow && running && [3, 8].includes(step)}
            path="M543 173H573"
          />
          <FlowWire
            kind="yellow"
            active={
              scanFlow
                ? running && [4, 5, 9, 10].includes(step)
                : questionStage === 2 && questionGroup === 'yellow'
            }
            path="M269 173C305 173 310 280 339 280"
          />
          <FlowWire
            kind="yellow"
            active={scanFlow && running && [4, 5, 9, 10].includes(step)}
            path="M543 280C575 280 580 245 580 207"
          />
          {questionStage === 3 && (
            <path
              className="wire-data"
              d={
                questionGroup === 'blue'
                  ? 'M339 64C310 64 305 173 269 173'
                  : questionGroup === 'purple'
                    ? 'M339 173H269'
                    : 'M339 280C310 280 305 173 269 173'
              }
              markerEnd="url(#arrow)"
            />
          )}
          <FlowWire
            kind="returned"
            active={scanFlow ? phase === 3 : questionStage === 1}
            path="M613 221V320Q613 339 580 339H252Q220 339 220 310V221"
          />
          <FlowWire
            kind="response-to-model"
            active={scanFlow ? phase === 4 : questionStage === 4}
            path="M172 190H124"
          />
          <FlowWire
            kind="response-to-backend"
            active={scanFlow ? phase === 5 && running : questionStage === 5}
            path="M77 202V344Q77 365 99 365H608Q630 365 630 343V207"
          />
        </svg>
        <div className={'context-node ' + (phase === 0 ? 'active' : '')}>
          <GraphIcon kind="chat" />
          <span>
            System prompt
            <br />+ market context
          </span>
        </div>
        <div
          className={
            'graph-node llm ' +
            (scanFlow
              ? phase >= 4
                ? 'active'
                : ''
              : questionStage === 4 || questionStage === 5
                ? 'active'
                : '')
          }
        >
          <GraphIcon kind="chat" />
          <strong>
            Language
            <br />
            model
          </strong>
          <small>REASONING</small>
        </div>
        <div
          className={
            'graph-node agent-node ' +
            (scanFlow
              ? phase === 1 || phase === 4
                ? 'active'
                : ''
              : questionStage !== null &&
                  questionStage >= 1 &&
                  questionStage <= 4
                ? 'active'
                : '')
          }
        >
          <GraphIcon kind="agent" />
          <strong>Strat agent</strong>
          <small>ORCHESTRATION</small>
        </div>
        <GraphToolGroups demo={demo} />
        <div
          className={
            'graph-node backend ' +
            (scanFlow
              ? phase === 0 || phase === 3 || phase === 5
                ? 'active'
                : ''
              : questionStage === 0 ||
                  questionStage === 1 ||
                  questionStage === 5 ||
                  questionStage === 6
                ? 'active'
                : '')
          }
        >
          <GraphIcon kind="data" />
          <strong>
            Market
            <br />
            data
          </strong>
          <small>BACKEND</small>
        </div>
        <div className="return-label">
          VALIDATED MEASUREMENTS <span>✓</span>
        </div>
      </div>
    </div>
  );
}
