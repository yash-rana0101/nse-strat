// src/utils/agent/webmcp.ts
/**
 * WebMCP registration.
 *
 * Exposes Strat AI's in-page tools to browser-resident agents through the W3C
 * draft WebMCP interface. Chrome exposes this as `document.modelContext`;
 * `navigator.modelContext` is the deprecated pre-Chrome-150 alias and is used
 * only as a fallback.
 *
 * Registration is idempotent: Astro view transitions keep the same document
 * alive across navigations, and re-registering a tool name is an error.
 */
import type { ModelContext, WebMcpTool } from '@/types/agent';
import { READ_TOOLS } from '@/utils/agent/readTools';
import { ACTION_TOOLS } from '@/utils/agent/actionTools';

const REGISTRY_FLAG = '__stratAiWebMcpRegistered';

export const WEBMCP_TOOLS: WebMcpTool[] = [...READ_TOOLS, ...ACTION_TOOLS];

function resolveModelContext(): ModelContext | null {
  if (typeof document === 'undefined') return null;

  if (document.modelContext) return document.modelContext;

  // Deprecated alias, still shipped by pre-Chrome-150 clients.
  if (typeof navigator !== 'undefined' && navigator.modelContext) {
    return navigator.modelContext;
  }

  return null;
}

function alreadyRegistered(): boolean {
  return (
    typeof window !== 'undefined' && Reflect.get(window, REGISTRY_FLAG) === true
  );
}

function markRegistered(): void {
  if (typeof window !== 'undefined') {
    Reflect.set(window, REGISTRY_FLAG, true);
  }
}

/**
 * Register every Strat AI tool with the browser's model context.
 * No-op when the browser does not implement WebMCP, or when already registered.
 */
export async function registerWebMcpTools(): Promise<void> {
  if (alreadyRegistered()) return;

  const modelContext = resolveModelContext();
  if (!modelContext) return;

  // Claim the flag before awaiting so concurrent callers cannot double-register.
  markRegistered();

  for (const tool of WEBMCP_TOOLS) {
    try {
      await modelContext.registerTool(tool);
    } catch (error) {
      console.warn(`[WebMCP] Could not register tool "${tool.name}":`, error);
    }
  }
}

/**
 * Entry point used by the base layout. Waits for WebMCP to appear when the
 * script runs before the interface is installed.
 */
export function initWebMcp(): void {
  if (typeof document === 'undefined') return;

  void registerWebMcpTools();

  if (!resolveModelContext()) {
    document.addEventListener(
      'modelcontextready',
      () => void registerWebMcpTools(),
      { once: true }
    );
  }
}
