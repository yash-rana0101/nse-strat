import {
  demoQuestions,
  demoStages,
  type DemoMode,
  type DemoQuestion,
} from '@/content/landing/copilotDemo';
import { appendQuestion } from './conversation';
import { animateToolActivity, resetToolActivity } from './toolActivity';

class CopilotDemo extends HTMLElement {
  private timers = new Set<number>();
  private events?: AbortController;
  private mode: DemoMode | null = null;
  private busy = false;

  connectedCallback() {
    this.events?.abort();
    this.events = new AbortController();
    this.reset();
    this.addEventListener(
      'click',
      (event) => {
        const button = (event.target as HTMLElement).closest('button');
        if (!button || button.disabled) return;
        if (button.id === 'copilot-reset') return this.reset();
        if (this.busy) return;
        if (button.id === 'copilot-find') this.start('find');
        if (button.id === 'copilot-verify') this.start('verify');
        const question = demoQuestions.find(
          (item) => button.id === `copilot-q-${item.id}`
        );
        if (question && this.mode) this.start(this.mode, question);
      },
      { signal: this.events.signal }
    );
  }

  disconnectedCallback() {
    this.cancelTimers();
    this.events?.abort();
  }

  private el<T extends HTMLElement = HTMLElement>(selector: string) {
    return this.querySelector<T>(selector)!;
  }

  private text(selector: string, value: string) {
    this.el(selector).textContent = value;
  }

  private cancelTimers() {
    this.timers.forEach((timer) => window.clearTimeout(timer));
    this.timers.clear();
  }

  private later(callback: () => void, duration: number) {
    const timer = window.setTimeout(() => {
      this.timers.delete(timer);
      if (this.isConnected) callback();
    }, duration);
    this.timers.add(timer);
  }

  private controls() {
    this.el<HTMLButtonElement>('#copilot-find').disabled = this.busy;
    this.el<HTMLButtonElement>('#copilot-verify').disabled = this.busy;
    this.el<HTMLButtonElement>('#copilot-reset').disabled = false;
    demoQuestions.forEach((question) => {
      this.el<HTMLButtonElement>(`#copilot-q-${question.id}`).disabled =
        this.busy || !this.mode;
    });
  }

  private reset() {
    this.cancelTimers();
    this.mode = null;
    this.busy = false;
    this.dataset.phase = 'idle';
    this.removeAttribute('data-running');
    this.el('[data-empty]').hidden = false;
    [
      '[data-tool-feed]',
      '[data-result]',
      '[data-conversation]',
      '[data-footer]',
      '[data-qa]',
    ].forEach((selector) => {
      this.el(selector).hidden = true;
    });
    this.el('[data-conversation]').replaceChildren();
    this.el<HTMLDetailsElement>('.tool-telemetry').open = false;
    this.querySelectorAll('[data-stage-item]').forEach((item) => {
      item.removeAttribute('data-state');
      item.removeAttribute('aria-current');
    });
    this.text('[data-stage-title]', 'Ready when you are.');
    this.text(
      '[data-stage-detail]',
      'Choose Find my trade or Verify my trade to begin.'
    );
    this.text('[data-stage-count]', '00 / 06');
    this.text('[data-run-label]', 'AGENT READY');
    this.text(
      '[data-announcement]',
      'Demo reset. Choose Find my trade or Verify my trade.'
    );
    this.el('[data-terminal-body]').scrollTop = 0;
    this.controls();
    if (document.activeElement === this.el('#copilot-reset'))
      this.el('#copilot-find').focus({ preventScroll: true });
  }

  private start(mode: DemoMode, question?: DemoQuestion) {
    this.cancelTimers();
    this.mode = mode;
    this.busy = true;
    this.dataset.running = 'true';
    this.controls();
    this.el('[data-empty]').hidden = true;
    this.el('[data-tool-feed]').hidden = false;
    this.el('[data-result]').hidden = true;
    this.el('[data-conversation]').hidden = true;
    this.el('[data-footer]').hidden = false;
    this.el('[data-qa]').hidden = true;
    this.text('[data-run-label]', question ? 'FOLLOW-UP' : 'ANALYZING');
    this.text(
      '[data-trace-request]',
      question
        ? question.label
        : mode === 'find'
          ? 'Find an intraday setup for TMPV.'
          : 'Verify SELL · entry ₹290.45 · stop ₹291.55 · target ₹289.00'
    );
    resetToolActivity(this);
    if (question) {
      appendQuestion(this.el('[data-conversation]'), question);
      this.el('#copilot-reset').focus({ preventScroll: true });
    } else {
      this.el('[data-conversation]').replaceChildren();
      this.el<HTMLDetailsElement>('.tool-telemetry').open = false;
    }
    this.el('[data-terminal-body]').scrollTop = 0;
    this.advance(0, question);
  }

  private advance(index: number, question?: DemoQuestion) {
    const stage = demoStages[index];
    this.dataset.phase = stage.id;
    this.text('[data-stage-title]', stage.title);
    this.text(
      '[data-stage-detail]',
      index === 0 && question
        ? 'Your follow-up, saved plan and stock context re-enter the same loop.'
        : stage.detail
    );
    this.text(
      '[data-stage-count]',
      `${String(index + 1).padStart(2, '0')} / 06`
    );
    this.text('[data-announcement]', `Step ${index + 1} of 6. ${stage.title}`);
    this.querySelectorAll<HTMLElement>('[data-stage-item]').forEach(
      (item, i) => {
        item.dataset.state =
          i < index ? 'done' : i === index ? 'active' : 'waiting';
        if (i === index) item.setAttribute('aria-current', 'step');
        else item.removeAttribute('aria-current');
      }
    );
    if (stage.id === 'answer') return this.finish(question);
    const duration =
      stage.id === 'tools' || stage.id === 'data'
        ? animateToolActivity(
            this,
            stage.id === 'tools' ? 'calling' : 'done',
            (callback, delay) => this.later(callback, delay)
          )
        : 850;
    this.later(() => this.advance(index + 1, question), duration);
  }

  private scrollConversation() {
    const body = this.el('[data-terminal-body]');
    body.scrollTop = body.scrollHeight;
  }

  private finish(question?: DemoQuestion) {
    this.busy = false;
    this.removeAttribute('data-running');
    this.text(
      '[data-run-label]',
      question ? 'ANSWER READY' : 'ANALYSIS COMPLETE'
    );
    this.el('[data-tool-feed]').hidden = true;
    this.el('[data-result]').hidden = false;
    this.el('[data-qa]').hidden = false;
    this.el('[data-verification]').hidden = this.mode !== 'verify';
    this.text(
      '[data-plan-heading]',
      this.mode === 'verify' ? 'VERIFIED SAMPLE SETUP' : 'SAMPLE TRADE PLAN'
    );
    if (question) {
      const answer = this.el('[data-pending]');
      answer.textContent = question.answer;
      answer.removeAttribute('data-pending');
      this.el('[data-conversation]').hidden = false;
      this.scrollConversation();
    } else {
      this.el('[data-terminal-body]').scrollTop = 0;
    }
    this.text(
      '[data-announcement]',
      question
        ? question.answer
        : `Sample ${this.mode === 'verify' ? 'verification passed' : 'SELL plan ready'}. Entry ₹290.45, stop ₹291.55, target ₹289.00. Follow-up questions are available.`
    );
    this.controls();
    if (question && document.activeElement === this.el('#copilot-reset'))
      this.el(`#copilot-q-${question.id}`).focus({ preventScroll: true });
  }
}

if (!customElements.get('strat-copilot-demo')) {
  customElements.define('strat-copilot-demo', CopilotDemo);
}
