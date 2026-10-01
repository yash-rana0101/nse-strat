import { useLayoutEffect, useState } from 'react';
import type { WorkflowController } from './useWorkflowDemo';

type FlowPosition = {
  width: number;
  height: number;
  backendX: number;
  phoneX: number;
  requestY: number;
  responseY: number;
};

export default function PhoneBackendFlow({
  container,
  demo,
}: {
  container: HTMLDivElement | null;
  demo: WorkflowController;
}) {
  const [position, setPosition] = useState<FlowPosition | null>(null);

  useLayoutEffect(() => {
    const backend = container?.querySelector<HTMLElement>('.graph .backend');
    const graphFrame = container?.querySelector<HTMLElement>('.graph-frame');
    const phone = container?.querySelector<HTMLElement>('.phone-preview');
    if (!container || !backend || !phone) return;

    const update = () => {
      const bounds = container.getBoundingClientRect();
      const backendBounds = backend.getBoundingClientRect();
      const phoneBounds = phone.getBoundingClientRect();
      const scale = bounds.width / container.offsetWidth;
      const backendX = (backendBounds.right - bounds.left) / scale;
      const phoneX = (phoneBounds.left - bounds.left) / scale;
      if (phoneX - backendX < 20) {
        setPosition(null);
        return;
      }
      const next = {
        width: container.offsetWidth,
        height: container.offsetHeight,
        backendX,
        phoneX,
        requestY:
          (backendBounds.top + backendBounds.height * 0.35 - bounds.top) /
          scale,
        responseY:
          (backendBounds.top + backendBounds.height * 0.7 - bounds.top) / scale,
      };
      setPosition((current) =>
        current &&
        Object.keys(next).every(
          (key) =>
            Math.abs(
              current[key as keyof FlowPosition] -
                next[key as keyof FlowPosition]
            ) < 0.5
        )
          ? current
          : next
      );
    };

    const observer = new ResizeObserver(update);
    observer.observe(container);
    observer.observe(backend);
    if (graphFrame) observer.observe(graphFrame);
    observer.observe(phone);
    window.addEventListener('resize', update);
    update();
    const frame = requestAnimationFrame(update);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', update);
      cancelAnimationFrame(frame);
    };
  }, [container]);

  if (!position) return null;
  const request = `M${position.phoneX} ${position.requestY}H${position.backendX}`;
  const response = `M${position.backendX} ${position.responseY}H${position.phoneX}`;
  return (
    <svg
      className="phone-backend-flow"
      viewBox={`0 0 ${position.width} ${position.height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <marker
          id="phone-backend-arrow"
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
      <path className="phone-backend-link" d={request} />
      {((demo.running && demo.phase === 0) || demo.questionStage === 0) && (
        <path className="phone-backend-packet" d={request} />
      )}
      <path className="phone-backend-link" d={response} />
      {((demo.running && demo.phase === 5) || demo.questionStage === 6) && (
        <path className="phone-backend-packet" d={response} />
      )}
    </svg>
  );
}
