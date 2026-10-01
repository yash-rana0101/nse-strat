import { validateSetup, type TradeSetup } from './tradeSetup';
import { useEffect, useRef, useState } from 'react';
import {
  findResponses,
  verifyResponses,
  metrics,
  measurements,
  reply,
  pickResponse,
} from '../../sampleResponses';

export type WorkflowMode = 'find' | 'verify';
export type ConversationEntry = { q: string; a: string };

function questionToolIndex(question: string) {
  if (/volume|liquid|poc|option|candle|order flow/i.test(question)) return 3;
  if (/stop|risk|reward|wrong|invalid|support|resistance|atr/i.test(question))
    return 5;
  if (
    /\b(buy|sell|trade|trend|momentum|regime|strength|signal)\b|price action/i.test(
      question
    )
  )
    return 0;
  return null;
}

function getPhase(step: number, thinking: boolean) {
  if (thinking) return 4;
  if (step === -2) return -1;
  if (step < 0) return 0;
  if (step === 0) return 1;
  if (step < 9) return 2;
  if (step < 11) return 3;
  if (step === 11) return 4;
  return 5;
}

export function useWorkflowDemo() {
  const [setupNotes, setSetupNotes] = useState('');
  const [mode, setMode] = useState<WorkflowMode>('find');
  const [step, setStep] = useState(-2);
  const [running, setRunning] = useState(false);
  const [telemetry, setTelemetry] = useState(false);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const [questionStage, setQuestionStage] = useState<number | null>(null);
  const [questionTool, setQuestionTool] = useState<number | null>(null);
  const [pendingQuestion, setPendingQuestion] = useState('');
  const [thread, setThread] = useState<ConversationEntry[]>([]);
  const [trade, setTrade] = useState(findResponses[0]);
  const feed = useRef<HTMLDivElement>(null);
  const chat = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const result = metrics(trade);
  const data = measurements(trade);
  const phase = getPhase(step, thinking);
  const questions = [
    trade.side === 'BUY' ? 'Why a buy trade?' : 'Why a sell trade?',
    'Why this stop loss?',
    'What could go wrong?',
  ];

  useEffect(() => {
    if (!running) return;
    const scanTimer = setTimeout(
      () => {
        if (step >= 12) setRunning(false);
        else setStep((current) => current + 1);
      },
      step < 0 || step > 10 ? 650 : 480
    );
    return () => clearTimeout(scanTimer);
  }, [running, step]);

  useEffect(() => {
    if (!thinking || questionStage === null) return;
    const delay = questionStage === 2 ? 550 : 370;
    const questionTimer = setTimeout(() => {
      if (questionStage < 6) {
        setQuestionStage(
          questionStage === 1 && questionTool === null ? 4 : questionStage + 1
        );
        return;
      }
      setThread((current) => [
        ...current,
        { q: pendingQuestion, a: reply(pendingQuestion, trade, mode) },
      ]);
      setThinking(false);
      setQuestionStage(null);
    }, delay);
    return () => clearTimeout(questionTimer);
  }, [thinking, questionStage, questionTool, pendingQuestion, trade, mode]);

  useEffect(() => {
    const container = viewport.current;
    if (!container) return;
    // The desktop phone preview is scaled. Convert screen pixels back to
    // scroll pixels before positioning content inside its scroll area.
    const scale =
      container.getBoundingClientRect().height / container.offsetHeight || 1;
    const contentTop = (element: Element) =>
      container.scrollTop +
      (element.getBoundingClientRect().top -
        container.getBoundingClientRect().top) /
        scale;

    if (step === 12) {
      const plan = container.querySelector('.trade-plan');
      if (plan)
        container.scrollTo({
          top: Math.max(0, contentTop(plan) - 16),
          behavior: 'instant',
        });
      return;
    }

    const row = feed.current?.children[Math.min(step, 10)] as
      HTMLElement | undefined;
    if (row) {
      container.scrollTo({
        top: Math.max(
          0,
          contentTop(row) - container.clientHeight + row.offsetHeight + 45
        ),
        behavior: 'smooth',
      });
    }
  }, [step]);

  useEffect(() => {
    if ((thread.length > 0 || thinking) && viewport.current) {
      viewport.current.scrollTo({
        top: viewport.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [thread, thinking]);

  function run(nextMode: WorkflowMode, setup?: TradeSetup) {
    if (running || (setup && validateSetup(setup))) return;
    viewport.current?.scrollTo({ top: 0, behavior: 'instant' });
    setThinking(false);
    setQuestionStage(null);
    setMode(nextMode);
    setTrade(
      setup
        ? {
            ...trade,
            side: setup.side,
            entry: setup.entry,
            stop: setup.stop,
            target: setup.target,
          }
        : pickResponse(
            nextMode === 'find' ? findResponses : verifyResponses,
            trade.id
          )
    );
    setSetupNotes(setup?.notes ?? '');
    setTelemetry(false);
    setInput('');
    setStep(-1);
    setRunning(true);
    setThread([]);
  }

  function selectMode(nextMode: WorkflowMode) {
    if (running) return;
    viewport.current?.scrollTo({ top: 0, behavior: 'instant' });
    setMode(nextMode);
    setThinking(false);
    setQuestionStage(null);
    setStep(-2);
    setThread([]);
    setInput('');
    setTelemetry(false);
    setSetupNotes('');
  }

  function ask(question: string) {
    if (!question.trim() || thinking || running || step < 12) return;
    setInput('');
    setPendingQuestion(question.trim());
    setQuestionTool(questionToolIndex(question));
    setQuestionStage(0);
    setThinking(true);
  }

  return {
    mode,
    step,
    running,
    telemetry,
    setTelemetry,
    input,
    setInput,
    thinking,
    questionStage,
    questionTool,
    thread,
    feed,
    chat,
    viewport,
    trade,
    result,
    data,
    questions,
    phase,
    run,
    ask,
    selectMode,
    setupNotes,
  };
}

export type WorkflowController = ReturnType<typeof useWorkflowDemo>;
