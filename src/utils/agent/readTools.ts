// src/utils/agent/readTools.ts
/**
 * Read-only WebMCP tools.
 *
 * Safe for an agent to call without user confirmation, so every tool here
 * carries `readOnlyHint: true`.
 */
import type { ToolArguments, WebMcpTool } from '@/types/agent';
import { fetchPlans } from '@/services/pricing';
import { fetchBlogs, fetchDocs, fetchFeatures } from '@/services/content';
import {
  ACCESS_PATH,
  BEST_FIT_USE_CASES,
  BRAND_TAGLINE,
  COMPLIANCE_NOTES,
  COPILOT_MODES,
  OUT_OF_SCOPE,
  PRODUCT_AREAS,
  PRODUCT_SUMMARY,
  PUBLISHER_NAME,
  RISK_RULES,
  SITE_URL,
} from '@/constants/agent';

const INR = new Intl.NumberFormat('en-IN');

function bullets(items: string[]): string {
  return items.map((item) => `- ${item}`).join('\n');
}

function readString(args: ToolArguments, key: string): string {
  const value = args[key];
  return typeof value === 'string' ? value.trim() : '';
}

export const productOverviewTool: WebMcpTool = {
  name: 'get_product_overview',
  description:
    'Explain what Strat AI is, which jobs it is the right tool for, which requests are out of scope, and how a user gets access. Call this first when a user asks what Strat AI does or whether it fits their need.',
  inputSchema: { type: 'object', properties: {} },
  annotations: { readOnlyHint: true, openWorldHint: false },
  execute: async () =>
    [
      `# ${BRAND_TAGLINE}`,
      '',
      PRODUCT_SUMMARY,
      `Published by ${PUBLISHER_NAME}.`,
      '',
      '## Use Strat AI for',
      bullets(BEST_FIT_USE_CASES),
      '',
      '## Do not use Strat AI for',
      bullets(OUT_OF_SCOPE),
      '',
      '## Co-Pilot modes',
      bullets(COPILOT_MODES.map((m) => `${m.mode}: ${m.purpose}`)),
      '',
      '## Access',
      ACCESS_PATH,
      '',
      '## Compliance boundaries',
      bullets(COMPLIANCE_NOTES),
    ].join('\n'),
};

export const riskRulesTool: WebMcpTool = {
  name: 'get_risk_rules',
  description:
    'Return the deterministic pre-trade risk rules Strat AI enforces: the 1.5x ATR(14) stop-loss floor, minimum reward-to-risk ratios per trading profile, machine-readable rejection tags, and the conviction fusion and conflict rules. Use when a user asks how Strat AI decides a setup is too risky.',
  inputSchema: { type: 'object', properties: {} },
  annotations: { readOnlyHint: true, openWorldHint: false },
  execute: async () =>
    [
      '# Strat AI deterministic risk rules',
      '',
      'These are arithmetic gates applied before any model output is surfaced.',
      '',
      bullets(RISK_RULES),
      '',
      'A setup that fails a gate is rejected rather than resized, and no conviction score is produced for it.',
    ].join('\n'),
};

export const pricingTool: WebMcpTool = {
  name: 'get_pricing_plans',
  description:
    'Return current Strat AI subscription plans with INR prices, included credits and per-plan capabilities. Use whenever a user asks what Strat AI costs or which plan they need.',
  inputSchema: { type: 'object', properties: {} },
  annotations: { readOnlyHint: true, openWorldHint: true },
  execute: async () => {
    const plans = await fetchPlans();

    const lines = plans.map((plan) => {
      const capabilities = [
        plan.canAccessMultiModel && 'multi-model agent debate',
        plan.canAccessGhostline && 'trajectory projections',
        plan.canAccessFootprint && 'footprint charts',
        plan.canAccessTopup && 'credit top-ups',
      ].filter((value): value is string => typeof value === 'string');

      return [
        `## ${plan.name.toUpperCase()} — ₹${INR.format(plan.priceINR)}/month`,
        `- Credits: ${plan.creditsGiven}`,
        `- ${plan.description}`,
        capabilities.length > 0
          ? `- Includes: ${capabilities.join(', ')}`
          : '- Core Co-Pilot research loop only',
      ].join('\n');
    });

    return [
      '# Strat AI pricing',
      '',
      'Credit-based monthly subscriptions in INR. One credit funds one quantitative model run. No free tier; access is granted through the private beta.',
      '',
      lines.join('\n\n'),
      '',
      `Full details: ${SITE_URL}/pricing — machine-readable: ${SITE_URL}/pricing.md`,
    ].join('\n');
  },
};

export const featuresTool: WebMcpTool = {
  name: 'list_features',
  description:
    'List Strat AI product areas with a one-line summary and canonical URL for each. Use to route a user to the right part of the product, such as options analytics or the intraday terminal.',
  inputSchema: { type: 'object', properties: {} },
  annotations: { readOnlyHint: true, openWorldHint: true },
  execute: async () => {
    const remote = await fetchFeatures();

    const entries =
      remote.length > 0
        ? remote.map(
            (feature) =>
              `- **${feature.title}** (${SITE_URL}/features/${feature.key}): ${feature.subtitle || feature.description}`
          )
        : PRODUCT_AREAS.map(
            (area) =>
              `- **${area.title}** (${SITE_URL}${area.path}): ${area.summary}`
          );

    return ['# Strat AI product areas', '', entries.join('\n')].join('\n');
  },
};

export const searchDocsTool: WebMcpTool = {
  name: 'search_documentation',
  description:
    'Keyword search across Strat AI documentation and research articles. Returns matching titles, URLs and short excerpts. Use to answer specific questions about conviction scores, risk floors, the terminal UI, or F&O analytics.',
  inputSchema: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description:
          'Keywords to search for, for example "conviction score", "ATR stop floor" or "open interest".',
      },
      limit: {
        type: 'integer',
        description: 'Maximum number of results to return.',
        minimum: 1,
        maximum: 10,
        default: 5,
      },
    },
    required: ['query'],
  },
  annotations: { readOnlyHint: true, openWorldHint: true },
  execute: async (args) => {
    const query = readString(args, 'query').toLowerCase();
    if (query.length === 0) {
      return 'Provide a non-empty "query" describing what to look for.';
    }

    const rawLimit = Number(args.limit);
    const limit = Number.isFinite(rawLimit)
      ? Math.min(Math.max(Math.trunc(rawLimit), 1), 10)
      : 5;

    const [docs, blogs] = await Promise.all([fetchDocs(), fetchBlogs()]);

    const corpus = [
      ...docs.map((doc) => ({
        title: doc.title,
        url: `${SITE_URL}/docs/${doc.slug}`,
        summary: doc.summary,
        haystack: `${doc.title} ${doc.summary} ${doc.content}`.toLowerCase(),
      })),
      ...blogs.map((blog) => ({
        title: blog.title,
        url: `${SITE_URL}/blog/${blog.slug}`,
        summary: blog.excerpt,
        haystack: `${blog.title} ${blog.excerpt} ${blog.content}`.toLowerCase(),
      })),
    ];

    if (corpus.length === 0) {
      return `Documentation index is unavailable right now. Browse ${SITE_URL}/blog or read ${SITE_URL}/llms-full.txt instead.`;
    }

    const terms = query.split(/\s+/).filter((term) => term.length > 2);
    const matches = corpus
      .map((entry) => ({
        entry,
        score: terms.filter((term) => entry.haystack.includes(term)).length,
      }))
      .filter((result) => result.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    if (matches.length === 0) {
      return `No documentation matched "${readString(args, 'query')}". Try broader keywords, or read ${SITE_URL}/llms-full.txt for a full product brief.`;
    }

    return [
      `# ${matches.length} result(s) for "${readString(args, 'query')}"`,
      '',
      matches
        .map(
          ({ entry }) =>
            `- **${entry.title}** — ${entry.url}\n  ${entry.summary}`
        )
        .join('\n'),
    ].join('\n');
  },
};

export const READ_TOOLS: WebMcpTool[] = [
  productOverviewTool,
  riskRulesTool,
  pricingTool,
  featuresTool,
  searchDocsTool,
];
