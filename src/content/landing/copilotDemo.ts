export const sampleTrade = {
  symbol: 'TMPV',
  entry: 290.45,
  stop: 291.55,
  target: 289,
  atr: 0.69,
  rewardRisk: '1.32',
} as const;

export const demoStages = [
  {
    id: 'context',
    short: 'Build context',
    title: 'First, give the model the right context.',
    detail:
      'Backend packages the system instructions, stock snapshot and tool contracts.',
  },
  {
    id: 'select',
    short: 'Select tools',
    title: 'The model asks. The agent orchestrates.',
    detail:
      'The model returns tool calls; the agent dispatches the selected read-only tools.',
  },
  {
    id: 'tools',
    short: 'Call tools',
    title: 'A question becomes a set of measurements.',
    detail:
      'Trend, market structure and risk tools request data from the backend.',
  },
  {
    id: 'data',
    short: 'Return data',
    title: 'Data comes back. Not guesswork.',
    detail:
      'Computed results are validated and returned to the agent. This replay uses fixed values.',
  },
  {
    id: 'reason',
    short: 'Reason',
    title: 'Now the model connects the evidence.',
    detail:
      'The model evaluates the tool results together, including risks and invalidation levels.',
  },
  {
    id: 'answer',
    short: 'Respond',
    title: 'A structured answer, with the risk attached.',
    detail:
      'The sample plan is ready. Ask a follow-up to replay the same reasoning loop.',
  },
] as const;

export type DemoPhase = 'idle' | (typeof demoStages)[number]['id'];
export type DemoMode = 'find' | 'verify';

export const demoQuestions = [
  {
    id: 'why',
    label: 'Why a sell trade?',
    answer:
      'In this sample, the 1H, 4H and daily trends all point down. Price at ₹290.45 is below VWAP ₹302.77 and the volume-profile POC ₹300.59. Together, these measurements support the illustrated short bias — they do not guarantee the next move.',
  },
  {
    id: 'stop',
    label: 'Why this stop loss?',
    answer:
      'The ₹291.55 stop is ₹1.10 above entry and above the ₹291.31 low-volume node. With ATR(14) at ₹0.69, the minimum stop distance is 1.5 × ₹0.69 = ₹1.035. The sample stop clears that floor; real fills and slippage can change the loss.',
  },
  {
    id: 'risk',
    label: 'What could go wrong?',
    answer:
      'A reversal can invalidate the bearish read. A move through ₹291.55 invalidates this sample plan; a gap or slippage can exceed the planned ₹1.10 risk. The ₹1.45 target is an example, not a promised return. Asking a follow-up does not change the saved plan.',
  },
] as const;

export type DemoQuestion = (typeof demoQuestions)[number];
