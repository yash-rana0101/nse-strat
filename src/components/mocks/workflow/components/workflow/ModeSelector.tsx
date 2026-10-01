import { useEffect, useRef, useState } from 'react';
import {
  PiCaretDown,
  PiCaretUp,
  PiCircleNotch,
  PiLightning,
  PiShieldCheck,
} from 'react-icons/pi';
import type { WorkflowController } from './useWorkflowDemo';

export default function ModeSelector({ demo }: { demo: WorkflowController }) {
  const { mode, selectMode, running, run } = demo;
  const [open, setOpen] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const menuTrigger = useRef<HTMLButtonElement>(null);
  const ModeIcon = mode === 'find' ? PiLightning : PiShieldCheck;
  const Caret = open ? PiCaretUp : PiCaretDown;

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: PointerEvent) => {
      if (!container.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', closeOutside);
    return () => document.removeEventListener('pointerdown', closeOutside);
  }, [open]);

  const choose = (nextMode: 'find' | 'verify') => {
    if (nextMode !== mode) selectMode(nextMode);
    setOpen(false);
    menuTrigger.current?.focus();
  };

  return (
    <div
      className="analysis-mode"
      ref={container}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && open) {
          setOpen(false);
          menuTrigger.current?.focus();
        }
      }}
    >
      <div className="analysis-mode-trigger">
        <button
          id="analysis-mode-trigger"
          className="analysis-mode-action"
          type="button"
          disabled={running}
          aria-busy={running && mode === 'find'}
          onClick={() => {
            if (mode === 'find') run('find');
            else
              document
                .querySelector<HTMLInputElement>('#verify-panel input')
                ?.focus();
          }}
        >
          {running && mode === 'find' ? (
            <PiCircleNotch
              className="analysis-mode-spinner"
              aria-hidden="true"
            />
          ) : (
            <ModeIcon aria-hidden="true" />
          )}
          {mode === 'find'
            ? running
              ? 'SCANNING MARKET…'
              : 'FIND TRADE'
            : 'VERIFY MY TRADE'}
        </button>
        <button
          ref={menuTrigger}
          className="analysis-mode-caret"
          type="button"
          aria-label="Choose analysis mode"
          aria-expanded={open}
          aria-controls="analysis-mode-options"
          disabled={running}
          onClick={() => setOpen(!open)}
        >
          <Caret aria-hidden="true" />
        </button>
      </div>
      {open && (
        <div
          id="analysis-mode-options"
          className="analysis-mode-options"
          aria-label="Analysis mode"
        >
          <button
            type="button"
            aria-pressed={mode === 'find'}
            onClick={() => choose('find')}
            disabled={running}
          >
            <PiLightning aria-hidden="true" />
            <span>
              Find a Trade Setup
              <small>Scans breakouts &amp; quant signals</small>
            </span>
          </button>
          <button
            type="button"
            aria-pressed={mode === 'verify'}
            onClick={() => choose('verify')}
            disabled={running}
          >
            <PiShieldCheck aria-hidden="true" />
            <span>
              Verify My Trade Idea
              <small>Co-pilot critical Risk Manager critique</small>
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
