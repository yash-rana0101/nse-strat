// src/utils/agent/mcpUi.ts
/**
 * MCP Apps `ui://` resource builders.
 *
 * These return self-contained HTML documents that an MCP host (ChatGPT, Claude)
 * renders inline in the conversation. Data is baked in at read time, so the
 * views need no client-side script at all — which lets the embedded CSP stay
 * tight (`script-src 'none'`).
 */
import type { PlanData } from '@/types/pricing';
import { RISK_RULES, SITE_URL } from '@/constants/agent';

export const MCP_APP_MIME_TYPE = 'text/html;profile=mcp-app';

export const UI_PRICING_URI = 'ui://stratai/pricing-table';
export const UI_RISK_RULES_URI = 'ui://stratai/risk-rules';
export const UI_OVERVIEW_URI = 'ui://stratai/product-overview';

const INR = new Intl.NumberFormat('en-IN');

/**
 * Content-Security-Policy for the embedded view. Scoped for the ChatGPT and
 * Claude sandboxes: they must be allowed as frame ancestors or the UI silently
 * fails to render.
 */
const VIEW_CSP = [
  "default-src 'none'",
  `connect-src ${SITE_URL}`,
  "img-src 'self' data:",
  "script-src 'none'",
  "style-src 'unsafe-inline'",
  "font-src 'self'",
  `form-action ${SITE_URL}`,
  'frame-ancestors https://chatgpt.com https://chat.openai.com https://claude.ai',
  "base-uri 'none'",
].join('; ');

const STYLES = `
:root { color-scheme: light dark; --bg: #ffffff; --fg: #0b1220; --muted: #5b6577; --line: #e3e7ee; --accent: #0f9d6e; --card: #f7f9fb; }
@media (prefers-color-scheme: dark) {
  :root { --bg: #0b0f14; --fg: #e8edf4; --muted: #97a2b4; --line: #1e2733; --accent: #10b981; --card: #111823; }
}
* { box-sizing: border-box; }
body { margin: 0; padding: 20px; background: var(--bg); color: var(--fg);
  font: 15px/1.55 ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; }
h1 { margin: 0 0 6px; font-size: 19px; letter-spacing: -0.01em; }
h2 { margin: 0 0 4px; font-size: 15px; }
p { margin: 0 0 14px; color: var(--muted); font-size: 13px; }
ul { margin: 0; padding-left: 18px; }
li { margin-bottom: 8px; }
.grid { display: grid; gap: 12px; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); }
.card { border: 1px solid var(--line); border-radius: 12px; padding: 14px; background: var(--card); }
.price { font-size: 22px; font-weight: 700; color: var(--accent); margin: 6px 0 2px; }
.credits { font-size: 12px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.06em; }
.desc { font-size: 13px; color: var(--muted); margin-top: 8px; }
.tag { display: inline-block; font-size: 11px; border: 1px solid var(--line); border-radius: 999px;
  padding: 2px 8px; margin: 3px 3px 0 0; color: var(--muted); }
.note { margin-top: 16px; font-size: 12px; color: var(--muted); border-top: 1px solid var(--line); padding-top: 12px; }
a { color: var(--accent); }
`;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function document_(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light dark">
<meta http-equiv="Content-Security-Policy" content="${escapeHtml(VIEW_CSP)}">
<title>${escapeHtml(title)}</title>
<style>${STYLES}</style>
</head>
<body>
${body}
</body>
</html>`;
}

/** Interactive-looking pricing table for in-conversation rendering. */
export function buildPricingView(plans: PlanData[]): string {
  const cards = plans
    .map((plan) => {
      const tags = [
        plan.canAccessMultiModel && 'Multi-model debate',
        plan.canAccessGhostline && 'Trajectory projections',
        plan.canAccessFootprint && 'Footprint charts',
        plan.canAccessTopup && 'Credit top-ups',
        plan.canGetAdvanceChartAccess && 'Advanced charting',
      ]
        .filter((tag): tag is string => typeof tag === 'string')
        .map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`)
        .join('');

      return `<div class="card">
  <h2>${escapeHtml(plan.name.toUpperCase())}</h2>
  <div class="price">&#8377;${escapeHtml(INR.format(plan.priceINR))}<span class="credits"> / mo</span></div>
  <div class="credits">${plan.creditsGiven} credits</div>
  <div class="desc">${escapeHtml(plan.description)}</div>
  <div>${tags}</div>
</div>`;
    })
    .join('\n');

  return document_(
    'Strat AI pricing',
    `<h1>Strat AI pricing</h1>
<p>Credit-based monthly subscriptions in INR. One credit funds one quantitative model run. No free tier &mdash; access is granted through the private beta.</p>
<div class="grid">
${cards}
</div>
<div class="note">Prices exclude applicable taxes. 7-day refund window.
Request beta access at <a href="${SITE_URL}/waitlist">${SITE_URL}/waitlist</a>.</div>`
  );
}

/** Risk-rule card explaining the deterministic gates. */
export function buildRiskRulesView(): string {
  const items = RISK_RULES.map((rule) => `<li>${escapeHtml(rule)}</li>`).join(
    '\n'
  );

  return document_(
    'Strat AI risk rules',
    `<h1>Deterministic pre-trade risk rules</h1>
<p>Arithmetic gates applied before any model output reaches the user. A setup that fails a gate is rejected, not resized.</p>
<div class="card"><ul>
${items}
</ul></div>
<div class="note">Strat AI is analysis and risk tooling, not investment advice, and cannot place orders.
Full disclosure: <a href="${SITE_URL}/ai-disclosure">${SITE_URL}/ai-disclosure</a>.</div>`
  );
}

/** Product overview card with scope boundaries. */
export function buildOverviewView(
  useCases: string[],
  outOfScope: string[]
): string {
  const list = (items: string[]): string =>
    items.map((item) => `<li>${escapeHtml(item)}</li>`).join('\n');

  return document_(
    'Strat AI overview',
    `<h1>Strat AI</h1>
<p>Market analysis and pre-trade risk adjudication terminal for Indian equities and F&amp;O (NSE/BSE). It does not execute trades, hold funds, or give financial advice.</p>
<div class="grid">
  <div class="card"><h2>Use it for</h2><ul>${list(useCases)}</ul></div>
  <div class="card"><h2>Not for</h2><ul>${list(outOfScope)}</ul></div>
</div>
<div class="note">More: <a href="${SITE_URL}/llms.txt">llms.txt</a> &middot;
<a href="${SITE_URL}/agents.md">agents.md</a> &middot;
<a href="${SITE_URL}/waitlist">Join the private beta</a></div>`
  );
}
