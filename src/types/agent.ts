// src/types/agent.ts
/**
 * Types for the WebMCP (W3C draft) in-page tool surface.
 * agentic website done
 * Mirrors the shape Chrome exposes on `document.modelContext`:
 * https://developer.chrome.com/docs/ai/webmcp/imperative-api
 */

export type JsonSchemaType = 'string' | 'number' | 'integer' | 'boolean';

export interface JsonSchemaProperty {
  type: JsonSchemaType;
  description?: string;
  enum?: string[];
  minimum?: number;
  maximum?: number;
  default?: string | number | boolean;
}

export interface ToolInputSchema {
  type: 'object';
  properties: Record<string, JsonSchemaProperty>;
  required?: string[];
}

/**
 * Behavioural hints. `readOnlyHint: false` tells an agent to seek user
 * confirmation before calling; `destructiveHint` marks irreversible effects.
 */
export interface ToolAnnotations {
  readOnlyHint?: boolean;
  destructiveHint?: boolean;
  idempotentHint?: boolean;
  openWorldHint?: boolean;
  untrustedContentHint?: boolean;
}

export type ToolArguments = Record<string, unknown>;

export interface ToolExecutionContext {
  signal?: AbortSignal;
}

export interface WebMcpTool {
  name: string;
  description: string;
  inputSchema: ToolInputSchema;
  annotations?: ToolAnnotations;
  execute: (
    args: ToolArguments,
    context?: ToolExecutionContext
  ) => Promise<string>;
}

export interface ModelContextRegisterOptions {
  signal?: AbortSignal;
  exposedTo?: string[];
}

export interface ModelContext {
  registerTool: (
    tool: WebMcpTool,
    options?: ModelContextRegisterOptions
  ) => Promise<void> | void;
}

declare global {
  interface Document {
    modelContext?: ModelContext;
  }

  interface Navigator {
    modelContext?: ModelContext;
  }

  /**
   * WebMCP declarative API attributes. These turn a plain HTML form into a tool
   * that agents can discover from server-rendered markup, without JavaScript.
   * https://developer.chrome.com/docs/ai/webmcp/declarative-api
   */
  namespace astroHTML.JSX {
    interface FormHTMLAttributes {
      toolname?: string;
      tooldescription?: string;
      toolautosubmit?: boolean;
    }
  }
}
