import { useLayoutEffect, useRef, useState } from 'react';
import ArchitecturePanel from './components/workflow/ArchitecturePanel';
import PhoneBackendFlow from './components/workflow/PhoneBackendFlow';
import TerminalPanel from './components/workflow/TerminalPanel';
import {
  DemoBottomline,
  DemoTopline,
  LiveStatus,
} from './components/workflow/WorkflowChrome';
import { useWorkflowDemo } from './components/workflow/useWorkflowDemo';
import './workflow.css';

export default function Workflow() {
  const demo = useWorkflowDemo();
  const [layout, setLayout] = useState<HTMLDivElement | null>(null);
  const frame = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState({
    enabled: false,
    scale: 1,
    height: 0,
    left: 0,
  });

  useLayoutEffect(() => {
    const container = frame.current;
    if (!container || !layout) return;

    const update = () => {
      if (window.innerWidth <= 1200) {
        setFit((current) =>
          current.enabled
            ? { enabled: false, scale: 1, height: 0, left: 0 }
            : current
        );
        return;
      }

      const width = layout.offsetWidth;
      const height = layout.offsetHeight;
      if (!width || !height) return;

      const availableHeight = Math.max(520, window.innerHeight - 160);
      const scale = Math.min(
        1,
        container.clientWidth / width,
        availableHeight / height
      );
      const next = {
        enabled: true,
        scale,
        height: height * scale,
        left: Math.max(0, (container.clientWidth - width * scale) / 2),
      };
      setFit((current) =>
        current.enabled &&
        Math.abs(current.scale - next.scale) < 0.001 &&
        Math.abs(current.height - next.height) < 0.5 &&
        Math.abs(current.left - next.left) < 0.5
          ? current
          : next
      );
    };

    const observer = new ResizeObserver(update);
    observer.observe(container);
    observer.observe(layout);
    window.addEventListener('resize', update);
    update();
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', update);
    };
  }, [layout]);

  return (
    <div className="copilot-workflow">
      <div className="showcase" data-phase={demo.phase}>
        <section
          className="workflow-section"
          aria-label="Strat AI Co-Pilot interactive demo"
        >
          <DemoTopline />
          <div
            className="demo-layout-frame"
            ref={frame}
            style={fit.enabled ? { height: fit.height } : undefined}
          >
            <div
              className="demo-layout"
              ref={setLayout}
              style={
                fit.enabled
                  ? {
                      position: 'absolute',
                      left: fit.left,
                      transform: `scale(${fit.scale})`,
                    }
                  : undefined
              }
            >
              <div className="demo" aria-label="Strat AI Co-Pilot architecture">
                <div className="workspace">
                  <ArchitecturePanel demo={demo} />
                </div>
              </div>
              <aside
                className="phone-preview"
                aria-label="Strat Agent phone preview"
              >
                <TerminalPanel demo={demo} />
              </aside>
              <PhoneBackendFlow container={layout} demo={demo} />
            </div>
          </div>
          <DemoBottomline />
        </section>
        <LiveStatus demo={demo} />
      </div>
    </div>
  );
}
