/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  BaseTool,
  ToolResult,
  ToolCallConfirmationDetails,
  ToolConfirmationOutcome,
  ToolMcpConfirmationDetails,
  Icon,
} from './tools.js';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { Tool, CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { ModelSchemaAdapter, ModelType } from './model-schema-adapter.js';

type ToolParams = Record<string, unknown>;

export class DiscoveredMCPTool extends BaseTool<ToolParams, ToolResult> {
  private static readonly allowlist: Set<string> = new Set();

  constructor(
    private readonly mcpClient: Client,
    private readonly mcpTool: Tool,
    readonly serverName: string,
    readonly timeout?: number,
    readonly trust?: boolean,
    nameOverride?: string,
  ) {
    const normalizedSchema = ModelSchemaAdapter.normalizeSchema(mcpTool.inputSchema) as any;
    super(
      nameOverride ?? generateValidName(mcpTool.name),
      `${mcpTool.name} (${serverName} MCP Server)`,
      mcpTool.description || '',
      Icon.Hammer,
      normalizedSchema,
      true, // isOutputMarkdown
      false, // canUpdateOutput
    );
  }

  get serverToolName(): string {
    return this.mcpTool.name;
  }

  get parameterSchemaJson(): unknown {
    return this.mcpTool.inputSchema;
  }

  asFullyQualifiedTool(): DiscoveredMCPTool {
    return new DiscoveredMCPTool(
      this.mcpClient,
      this.mcpTool,
      this.serverName,
      this.timeout,
      this.trust,
      `${this.serverName}__${this.serverToolName}`,
    );
  }

  /**
   * Get schema adapted for a specific model type
   */
  getSchemaForModel(modelType: ModelType): unknown {
    return ModelSchemaAdapter.adaptForModel(this.mcpTool, modelType);
  }

  async shouldConfirmExecute(
    _params: ToolParams,
    _abortSignal: AbortSignal,
  ): Promise<ToolCallConfirmationDetails | false> {
    const serverAllowListKey = this.serverName;
    const toolAllowListKey = `${this.serverName}.${this.serverToolName}`;

    if (this.trust) {
      return false; // server is trusted, no confirmation needed
    }

    if (
      DiscoveredMCPTool.allowlist.has(serverAllowListKey) ||
      DiscoveredMCPTool.allowlist.has(toolAllowListKey)
    ) {
      return false; // server and/or tool already allowlisted
    }

    const confirmationDetails: ToolMcpConfirmationDetails = {
      type: 'mcp',
      title: 'Confirm MCP Tool Execution',
      serverName: this.serverName,
      toolName: this.serverToolName, // Display original tool name in confirmation
      toolDisplayName: this.name, // Display global registry name exposed to model and user
      onConfirm: async (outcome: ToolConfirmationOutcome) => {
        if (outcome === ToolConfirmationOutcome.ProceedAlwaysServer) {
          DiscoveredMCPTool.allowlist.add(serverAllowListKey);
        } else if (outcome === ToolConfirmationOutcome.ProceedAlwaysTool) {
          DiscoveredMCPTool.allowlist.add(toolAllowListKey);
        }
      },
    };
    return confirmationDetails;
  }

  async execute(params: ToolParams): Promise<ToolResult> {
    try {
      const result = await this.mcpClient.callTool(
        {
          name: this.serverToolName,
          arguments: params,
        }
      ) as CallToolResult;

      // Convert MCP content to Gemini Part format for compatibility
      const llmContent: any[] = result.content.map((content: any) => {
        if (content.type === 'text') {
          return { text: content.text };
        }
        return content; // Pass through other content types as-is
      });

      return {
        llmContent,
        returnDisplay: formatMCPResponse(result),
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        llmContent: [{ text: `MCP Tool Error: ${errorMessage}` }],
        returnDisplay: `❌ MCP Tool Error: ${errorMessage}`,
      };
    }
  }
}

/**
 * Format MCP CallToolResult for display
 */
function formatMCPResponse(result: CallToolResult): string {
  if (!result?.content || result.content.length === 0) {
    return '```json\n[]\n```';
  }

  // If single text content, return directly
  if (result.content.length === 1 && result.content[0].type === 'text') {
    return result.content[0].text || '';
  }

  // For multiple content items or non-text content, format as JSON
  const processedContent = result.content.map(content => {
    if (content.type === 'text') {
      return content.text;
    }
    return content; // Return full object for non-text content
  });

  // If all content is text, join directly
  if (result.content.every(c => c.type === 'text')) {
    return processedContent.join('\n');
  }

  // Otherwise format as JSON
  return '```json\n' + JSON.stringify(processedContent, null, 2) + '\n```';
}

/** Visible for testing */
export function generateValidName(name: string) {
  // Replace invalid characters (based on 400 error message from Gemini API) with underscores
  let validToolname = name.replace(/[^a-zA-Z0-9_.-]/g, '_');

  // If longer than 63 characters, replace middle with '___'
  // (Gemini API says max length 64, but actual limit seems to be 63)
  if (validToolname.length > 63) {
    validToolname =
      validToolname.slice(0, 28) + '___' + validToolname.slice(-32);
  }
  return validToolname;
}
