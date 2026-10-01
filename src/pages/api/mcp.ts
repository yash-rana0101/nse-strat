// src/pages/api/mcp.ts
/**
 * MCP endpoint — Streamable HTTP transport, JSON-RPC 2.0.
 *
 * Read-only and unauthenticated. Rendered on demand rather than prerendered so
 * tool results reflect live pricing and content.
 */
import type { APIRoute } from 'astro';
import type { ToolArguments } from '@/types/agent';
import {
  PROTOCOL_VERSION,
  SERVER_INFO,
  SERVER_INSTRUCTIONS,
  UI_RESOURCES,
  callTool,
  initializeResult,
  listTools,
  readResource,
} from '@/utils/agent/mcpServer';

export const prerender = false;

type JsonRpcId = string | number | null;

interface JsonRpcRequest {
  jsonrpc?: string;
  id?: JsonRpcId;
  method?: string;
  params?: Record<string, unknown>;
}

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers':
    'Content-Type, Accept, Authorization, Mcp-Session-Id, MCP-Protocol-Version, Last-Event-ID',
  'Access-Control-Expose-Headers': 'Mcp-Session-Id, MCP-Protocol-Version',
  'Access-Control-Max-Age': '86400',
};

const JSON_HEADERS: Record<string, string> = {
  ...CORS_HEADERS,
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
  'MCP-Protocol-Version': PROTOCOL_VERSION,
};

function success(id: JsonRpcId, result: unknown): Record<string, unknown> {
  return { jsonrpc: '2.0', id, result };
}

function failure(
  id: JsonRpcId,
  code: number,
  message: string,
  data?: unknown
): Record<string, unknown> {
  return {
    jsonrpc: '2.0',
    id,
    error: { code, message, ...(data === undefined ? {} : { data }) },
  };
}

function asArguments(
  params: Record<string, unknown> | undefined
): ToolArguments {
  const args = params?.arguments;
  return args !== null && typeof args === 'object'
    ? (args as ToolArguments)
    : {};
}

async function dispatch(
  request: JsonRpcRequest
): Promise<Record<string, unknown> | null> {
  const id = request.id ?? null;
  const { method, params } = request;

  if (typeof method !== 'string') {
    return failure(id, -32600, 'Invalid Request: "method" must be a string');
  }

  // Notifications carry no id and expect no response body.
  const isNotification = request.id === undefined || request.id === null;

  switch (method) {
    case 'initialize':
      return success(id, initializeResult());

    case 'notifications/initialized':
    case 'notifications/cancelled':
      return null;

    case 'ping':
      return success(id, {});

    case 'tools/list':
      return success(id, { tools: listTools() });

    case 'tools/call': {
      const name = params?.name;
      if (typeof name !== 'string') {
        return failure(
          id,
          -32602,
          'Invalid params: "name" is required and must be a string'
        );
      }
      try {
        return success(id, await callTool(name, asArguments(params)));
      } catch (error) {
        return failure(
          id,
          -32603,
          'Tool execution failed',
          error instanceof Error ? error.message : String(error)
        );
      }
    }

    case 'resources/list':
      return success(id, { resources: UI_RESOURCES });

    case 'resources/templates/list':
      return success(id, { resourceTemplates: [] });

    case 'resources/read': {
      const uri = params?.uri;
      if (typeof uri !== 'string') {
        return failure(
          id,
          -32602,
          'Invalid params: "uri" is required and must be a string'
        );
      }
      const resource = await readResource(uri);
      if (!resource) {
        return failure(id, -32602, `Resource not found: ${uri}`, {
          available: UI_RESOURCES.map((entry) => entry.uri),
        });
      }
      return success(id, { contents: [resource] });
    }

    case 'prompts/list':
      return success(id, { prompts: [] });

    default:
      return isNotification
        ? null
        : failure(id, -32601, `Method not found: ${method}`);
  }
}

export const POST: APIRoute = async ({ request }) => {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return new Response(
      JSON.stringify(
        failure(null, -32700, 'Parse error: body is not valid JSON')
      ),
      { status: 400, headers: JSON_HEADERS }
    );
  }

  if (Array.isArray(payload)) {
    const responses = await Promise.all(
      payload.map((entry) => dispatch(entry as JsonRpcRequest))
    );
    const body = responses.filter(
      (entry): entry is Record<string, unknown> => entry !== null
    );

    return body.length === 0
      ? new Response(null, { status: 202, headers: CORS_HEADERS })
      : new Response(JSON.stringify(body), {
          status: 200,
          headers: JSON_HEADERS,
        });
  }

  if (payload === null || typeof payload !== 'object') {
    return new Response(
      JSON.stringify(
        failure(null, -32600, 'Invalid Request: expected a JSON object')
      ),
      { status: 400, headers: JSON_HEADERS }
    );
  }

  const response = await dispatch(payload as JsonRpcRequest);

  return response === null
    ? new Response(null, { status: 202, headers: CORS_HEADERS })
    : new Response(JSON.stringify(response), {
        status: 200,
        headers: JSON_HEADERS,
      });
};

/**
 * The Streamable HTTP spec reserves GET for opening an SSE stream. This server
 * is stateless and pushes nothing, so an SSE request gets 405. A plain GET
 * returns a description instead, so a browser or scanner sees something useful.
 */
export const GET: APIRoute = async ({ request }) => {
  if ((request.headers.get('accept') ?? '').includes('text/event-stream')) {
    return new Response(
      JSON.stringify(
        failure(
          null,
          -32000,
          'This server does not offer a server-initiated SSE stream'
        )
      ),
      { status: 405, headers: { ...JSON_HEADERS, Allow: 'POST, OPTIONS' } }
    );
  }

  return new Response(
    JSON.stringify({
      ...SERVER_INFO,
      protocolVersion: PROTOCOL_VERSION,
      transport: 'streamable-http',
      instructions: SERVER_INSTRUCTIONS,
      authentication: 'none',
      tools: listTools().map((tool) => tool.name),
      resources: UI_RESOURCES.map((resource) => resource.uri),
      usage: {
        method: 'POST',
        contentType: 'application/json',
        example: { jsonrpc: '2.0', id: 1, method: 'tools/list' },
      },
      serverCard: '/.well-known/mcp/server-card.json',
    }),
    { status: 200, headers: JSON_HEADERS }
  );
};

export const OPTIONS: APIRoute = async () =>
  new Response(null, { status: 204, headers: CORS_HEADERS });
