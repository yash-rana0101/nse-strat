import Glyph from './Glyph';
import { stages } from './constants';
import type { WorkflowController } from './useWorkflowDemo';
export function PageHeader() {
  return (
    <header className="page-header">
      <a className="brand" href="#">
        <img className="brand-mark" src="/strat.svg" alt="" />
        Strat <span>AI</span>
      </a>
      <span className="header-label">INTELLIGENCE, WITH EVIDENCE.</span>
      <a className="header-link" href="#workflow">
        Explore the co-pilot <Glyph kind="external" />
      </a>
    </header>
  );
}
export function WorkflowIntro() {
  return (
    <section className="intro">
      <div className="eyebrow">
        <i /> FEATURE DEEP DIVE / 01
      </div>
      <h1>
        Your edge. <span>Orchestrated.</span>
      </h1>
      <p>
        One question. A team of quantitative tools.
        <br className="mobile-break" /> A trade plan grounded in market data.
      </p>
    </section>
  );
}
export function DemoTopline() {
  return (
    <div className="topline">
      <span>
        <img className="topline-mark" src="/strat.svg" alt="" /> STRAT AI
        CO-PILOT <span className="explained-badge">EXPLAINED</span>
      </span>
      <span>
        <i /> INTERACTIVE DEMO <b>/</b> NO LIVE DATA
      </span>
    </div>
  );
}
export function DemoBottomline() {
  return (
    <div className="bottomline">
      <span>
        <Glyph kind="shield" /> SIMULATED DATA. REAL ARCHITECTURE.
      </span>
      <p>
        For illustration only. Not investment advice. Trading involves risk.
      </p>
    </div>
  );
}
export function PageFooter() {
  return (
    <footer className="page-footer">
      <span>BUILT FOR TRADERS WHO ASK WHY.</span>
      <span>
        YOUR JUDGMENT. AMPLIFIED. <Glyph kind="spark" />
      </span>
    </footer>
  );
}
export function LiveStatus({ demo }: { demo: WorkflowController }) {
  const { thinking, step, phase, running, thread } = demo;
  return (
    <div className="sr-only" role="status" aria-live="polite">
      {thinking
        ? 'Reviewing measurements'
        : step === -2
          ? 'Demo ready'
          : `${stages[Math.max(0, phase)]}. ${running ? 'Analysis in progress.' : 'Sample plan ready.'}`}
      {!thinking && thread.length > 0 ? thread[thread.length - 1].a : ''}
    </div>
  );
}
