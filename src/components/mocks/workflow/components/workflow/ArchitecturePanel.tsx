import ArchitectureGraph from './ArchitectureGraph';

import type { WorkflowController } from './useWorkflowDemo';
export default function ArchitecturePanel({
  demo,
}: {
  demo: WorkflowController;
}) {
  return (
    <div className="architecture">
      <div className="panel-title">
        <div>
          <span className="tiny-label">THE ARCHITECTURE</span>
          <h2>
            Not a chatbot. <span>A co-pilot.</span>
          </h2>
        </div>
        <span className="mcp-badge">MCP CONNECTED</span>
      </div>
      <p className="panel-description">
        The model reasons. The tools measure. You decide.
      </p>
      <ArchitectureGraph demo={demo} />
    </div>
  );
}
