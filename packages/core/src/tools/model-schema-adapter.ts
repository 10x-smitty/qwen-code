/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { Tool } from '@modelcontextprotocol/sdk/types.js';

export type ModelType = 'claude' | 'gemini' | 'openai';

export interface ClaudeToolSchema {
  name: string;
  description: string;
  input_schema: unknown;
}

export interface GeminiToolSchema {
  name: string;
  description: string;
  parametersJsonSchema: unknown;
}

export interface OpenAIToolSchema {
  name: string;
  description: string;
  parameters: unknown;
}

export type ModelToolSchema = ClaudeToolSchema | GeminiToolSchema | OpenAIToolSchema;

/**
 * Adapts MCP tool schemas to different AI model formats
 */
export class ModelSchemaAdapter {
  /**
   * Convert MCP tool schema to model-specific format
   */
  static adaptForModel(mcpTool: Tool, modelType: ModelType): ModelToolSchema {
    switch (modelType) {
      case 'claude':
        return {
          name: mcpTool.name,
          description: mcpTool.description || '',
          input_schema: mcpTool.inputSchema
        };
      case 'gemini':
        return {
          name: mcpTool.name,
          description: mcpTool.description || '',
          parametersJsonSchema: mcpTool.inputSchema
        };
      case 'openai':
        return {
          name: mcpTool.name,
          description: mcpTool.description || '',
          parameters: mcpTool.inputSchema
        };
      default:
        throw new Error(`Unsupported model type: ${modelType}`);
    }
  }

  /**
   * Convert array of MCP tools to model-specific format
   */
  static adaptToolsForModel(mcpTools: Tool[], modelType: ModelType): ModelToolSchema[] {
    return mcpTools.map(tool => this.adaptForModel(tool, modelType));
  }

  /**
   * Get the schema property name for a given model type
   */
  static getSchemaPropertyName(modelType: ModelType): string {
    switch (modelType) {
      case 'claude':
        return 'input_schema';
      case 'gemini':
        return 'parametersJsonSchema';
      case 'openai':
        return 'parameters';
      default:
        throw new Error(`Unsupported model type: ${modelType}`);
    }
  }

  /**
   * Check if a schema is compatible with a model type
   */
  static isSchemaCompatible(schema: unknown, modelType: ModelType): boolean {
    if (!schema || typeof schema !== 'object') {
      return false;
    }

    const schemaObj = schema as Record<string, unknown>;
    
    // All models expect JSON Schema format
    return schemaObj.type !== undefined;
  }

  /**
   * Normalize schema for cross-model compatibility
   */
  static normalizeSchema(schema: unknown): unknown {
    if (!schema || typeof schema !== 'object') {
      return { type: 'object', properties: {} };
    }

    const schemaObj = { ...schema } as Record<string, unknown>;

    // Remove model-specific properties that might cause issues
    delete schemaObj.$schema;
    delete schemaObj.$id;

    // Ensure we have a type
    if (!schemaObj.type) {
      schemaObj.type = 'object';
    }

    // Ensure properties exist for object type
    if (schemaObj.type === 'object' && !schemaObj.properties) {
      schemaObj.properties = {};
    }

    return schemaObj;
  }
}