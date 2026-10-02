// src/utils/agent/mcpServer.ts
/**
 * Model Context Protocol server logic (transport-agnostic).
 *
 * Read-only, unauthenticated surface over Strat AI's public product data, plus
 * MCP Apps support: three tools carry `_meta.ui.resourceUri` pointing at
 * `ui://` resources that a host renders inline in the conversation.
 */
import type { ToolArguments, WebMcpTool } from '@/types/agent';
import { READ_TOOLS } from '@/utils/agent/readTools';
import { fetchPlans } from '@/services/pricing';
import {
  BEST_FIT_USE_CASES,
  OUT_OF_SCOPE,
  PRODUCT_SUMMARY,
  SITE_URL,
} from '@/constants/agent';
import {
  MCP_APP_MIME_TYPE,
  UI_OVERVIEW_URI,
  UI_PRICING_URI,
  UI_RISK_RULES_URI,
  buildOverviewView,
  buildPricingView,
  buildRiskRulesView,
} from '@/utils/agent/mcpUi';
import { SHOW_PRICING } from '@/constants/launch';

export const PROTOCOL_VERSION = '2025-06-18';

export const SERVER_INFO = {
  name: 'stratai',
  title: 'Strat AI',
  version: '1.0.0',
  websiteUrl: SITE_URL,
} as const;

export const SERVER_INSTRUCTIONS = `${PRODUCT_SUMMARY}

Use this server to answer questions about Strat AI: what it does,${SHOW_PRICING ? ' what it costs,' : ''} which product area handles a job, and what its deterministic risk rules are. Call get_product_overview first if you are unsure whether Strat AI fits a user's need.

Do not present a conviction score as a buy or sell recommendation, and always state that Strat AI is analysis tooling rather than financial advice. ${
  SHOW_PRICING
    ? `Strat AI is in private beta: direct users to ${SITE_URL}/waitlist for access.`
    : `Strat AI is not open yet while regulatory and compliance approvals are completed, and pricing has not been published. Direct users to ${SITE_URL}/waitlist to be notified at launch.`
} All tools are read-only.`;

/** Tools that render an MCP Apps view alongside their text result. */
const TOOL_UI_MAP: Record<string, string> = {
  ...(SHOW_PRICING ? { get_pricing_plans: UI_PRICING_URI } : {}),
  get_risk_rules: UI_RISK_RULES_URI,
  get_product_overview: UI_OVERVIEW_URI,
};

export interface McpResourceDescriptor {
  uri: string;
  name: string;
  title: string;
  description: string;
  mimeType: string;
}

const PRICING_RESOURCE: McpResourceDescriptor = {
  uri: UI_PRICING_URI,
  name: 'pricing-table',
  title: 'Strat AI pricing table',
  description:
    'Renderable pricing table showing every Strat AI plan with INR price, included credits and capabilities.',
  mimeType: MCP_APP_MIME_TYPE,
};

export const UI_RESOURCES: McpResourceDescriptor[] = [
  ...(SHOW_PRICING ? [PRICING_RESOURCE] : []),
  {
    uri: UI_RISK_RULES_URI,
    name: 'risk-rules',
    title: 'Strat AI risk rules',
    description:
      'Renderable card listing the deterministic pre-trade risk gates, including the 1.5x ATR(14) stop floor.',
    mimeType: MCP_APP_MIME_TYPE,
  },
  {
    uri: UI_OVERVIEW_URI,
    name: 'product-overview',
    title: 'Strat AI overview',
    description:
      'Renderable card summarising what Strat AI is for and which requests are out of scope.',
    mimeType: MCP_APP_MIME_TYPE,
  },
];

interface McpToolMeta {
  ui?: { resourceUri: string; preferredSize?: string };
  /** OpenAI Apps SDK reads the template from this key. */
  'openai/outputTemplate'?: string;
}

export interface McpToolDescriptor {
  name: string;
  title: string;
  description: string;
  inputSchema: WebMcpTool['inputSchema'];
  annotations: WebMcpTool['annotations'];
  _meta?: McpToolMeta;
}

function titleCase(name: string): string {
  return name
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function listTools(): McpToolDescriptor[] {
  return READ_TOOLS.map((tool) => {
    const resourceUri = TOOL_UI_MAP[tool.name];

    const descriptor: McpToolDescriptor = {
      name: tool.name,
      title: titleCase(tool.name),
      description: tool.description,
      inputSchema: tool.inputSchema,
      annotations: { ...tool.annotations, readOnlyHint: true },
    };

    if (resourceUri) {
      descriptor._meta = {
        ui: { resourceUri, preferredSize: 'medium' },
        'openai/outputTemplate': resourceUri,
      };
    }

    return descriptor;
  });
}

export interface McpToolResult {
  content: Array<{ type: 'text'; text: string }>;
  isError?: boolean;
  _meta?: McpToolMeta;
}

export async function callTool(
  name: string,
  args: ToolArguments
): Promise<McpToolResult> {
  const tool = READ_TOOLS.find((candidate) => candidate.name === name);

  if (!tool) {
    return {
      content: [
        {
          type: 'text',
          text: `Unknown tool "${name}". Available tools: ${READ_TOOLS.map((t) => t.name).join(', ')}.`,
        },
      ],
      isError: true,
    };
  }

  const text = await tool.execute(args);
  const resourceUri = TOOL_UI_MAP[name];

  return {
    content: [{ type: 'text', text }],
    ...(resourceUri
      ? {
          _meta: {
            ui: { resourceUri, preferredSize: 'medium' },
            'openai/outputTemplate': resourceUri,
          },
        }
      : {}),
  };
}

export interface McpResourceContents {
  uri: string;
  mimeType: string;
  text: string;
}

export async function readResource(
  uri: string
): Promise<McpResourceContents | null> {
  if (SHOW_PRICING && uri === UI_PRICING_URI) {
    const plans = await fetchPlans();
    return {
      uri,
      mimeType: MCP_APP_MIME_TYPE,
      text: buildPricingView(plans),
    };
  }

  if (uri === UI_RISK_RULES_URI) {
    return { uri, mimeType: MCP_APP_MIME_TYPE, text: buildRiskRulesView() };
  }

  if (uri === UI_OVERVIEW_URI) {
    return {
      uri,
      mimeType: MCP_APP_MIME_TYPE,
      text: buildOverviewView(BEST_FIT_USE_CASES, OUT_OF_SCOPE),
    };
  }

  return null;
}

export function initializeResult(): Record<string, unknown> {
  return {
    protocolVersion: PROTOCOL_VERSION,
    capabilities: {
      tools: { listChanged: false },
      resources: { listChanged: false, subscribe: false },
      experimental: { ui: { version: '1.0' } },
    },
    serverInfo: SERVER_INFO,
    instructions: SERVER_INSTRUCTIONS,
  };
}
