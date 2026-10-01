import GraphIcon, { type GraphIconKind } from './GraphIcon';
import { registry } from './constants';
import { toolPresentation } from '../../toolPresentation';
import type { WorkflowController } from './useWorkflowDemo';

const groups = [
  {
    title: 'Trend analysis',
    color: 'blue',
    icon: 'trend' as const,
    tools: [0, 1, 2, 6, 7, 15],
  },
  {
    title: 'Volume profile',
    color: 'purple',
    icon: 'volume' as const,
    tools: [3, 8, 11, 12, 13, 14],
  },
  {
    title: 'Support & resistance',
    color: 'yellow',
    icon: 'levels' as const,
    tools: [4, 5, 9, 10, 16, 17],
  },
];

const toolIcons: GraphIconKind[] = [
  'timeframes',
  'consensus',
  'regime',
  'volumeProfile',
  'support',
  'volatility',
  'momentum',
  'strength',
  'liquidity',
  'validation',
  'riskReward',
  'optionsChain',
  'greeks',
  'candles',
  'orderFlow',
  'priceAction',
  'setContext',
  'response',
];

export default function GraphToolGroups({
  demo,
}: {
  demo: WorkflowController;
}) {
  const { phase, step, questionStage, questionTool } = demo;
  // Replay tool indices match the chat feed; control bindings surround the scan.
  const activeTool =
    questionStage !== null
      ? questionStage === 2 || questionStage === 3
        ? (questionTool ?? -1)
        : -1
      : phase === 0
        ? 16
        : phase === 5
          ? 17
          : step >= 0 && step <= 10
            ? step
            : -1;
  return (
    <>
      {groups.map((group) => (
        <div
          key={group.color}
          className={`tool-node tool-group ${group.color} ${group.tools.includes(activeTool) ? 'active' : ''}`}
        >
          <div className="tool-group-heading">
            <GraphIcon kind={group.icon} />
            <strong>{group.title}</strong>
            <b>{group.tools.length}</b>
          </div>
          <ul className="graph-tool-list">
            {group.tools.map((index) => {
              const { label } = toolPresentation[index];
              const active = index === activeTool;
              const completed = index < 11 && step > index;
              return (
                <li
                  key={registry[index]}
                  className={active ? 'executing' : completed ? 'executed' : ''}
                  title={registry[index]}
                  aria-current={active ? 'step' : undefined}
                >
                  <GraphIcon kind={toolIcons[index]} />
                  <span>{label}</span>
                  <small>
                    {active
                      ? 'ACTIVE'
                      : completed
                        ? '✓'
                        : index < 11
                          ? 'REPLAY'
                          : index < 16
                            ? 'ANALYSIS'
                            : 'CONTROL'}
                  </small>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </>
  );
}
