import type { IconType } from 'react-icons';
import {
  PiSparkle,
  PiTrendUp,
  PiChartBar,
  PiChartLine,
  PiRobot,
  PiDatabase,
  PiShieldCheck,
  PiChatText,
  PiSquaresFour,
  PiChartLineUp,
  PiSlidersHorizontal,
  PiPaperPlaneTilt,
  PiArrowUpRight,
  PiCaretRight,
  PiPlus,
  PiMinus,
} from 'react-icons/pi';

const icons: Record<string, IconType> = {
  spark: PiSparkle,
  trend: PiTrendUp,
  volume: PiChartBar,
  levels: PiChartLine,
  agent: PiRobot,
  data: PiDatabase,
  shield: PiShieldCheck,
  chat: PiChatText,
  grid: PiSquaresFour,
  options: PiSlidersHorizontal,
  candles: PiChartLineUp,
  send: PiPaperPlaneTilt,
  external: PiArrowUpRight,
  next: PiCaretRight,
  plus: PiPlus,
  minus: PiMinus,
};

export default function Glyph({ kind }: { kind: string }) {
  const Icon = icons[kind] ?? PiSparkle;
  return <Icon className={`glyph ${kind}`} aria-hidden="true" />;
}
