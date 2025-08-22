/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { ModelType } from './model-schema-adapter.js';

/**
 * Detect model type from model name string
 */
export function detectModelType(modelName: string): ModelType {
  const lowerModel = modelName.toLowerCase();
  
  // Claude/Anthropic models
  if (lowerModel.includes('claude') || 
      lowerModel.includes('sonnet') || 
      lowerModel.includes('haiku') || 
      lowerModel.includes('opus') ||
      lowerModel.includes('anthropic')) {
    return 'claude';
  }
  
  // Gemini models
  if (lowerModel.includes('gemini') || 
      lowerModel.includes('bison') ||
      lowerModel.includes('gecko') ||
      lowerModel.includes('palm')) {
    return 'gemini';
  }
  
  // Default to OpenAI for other models (GPT, etc.)
  return 'openai';
}

/**
 * Check if a model is Claude/Anthropic
 */
export function isClaudeModel(modelName: string): boolean {
  return detectModelType(modelName) === 'claude';
}

/**
 * Check if a model is Gemini
 */
export function isGeminiModel(modelName: string): boolean {
  return detectModelType(modelName) === 'gemini';
}

/**
 * Check if a model is OpenAI
 */
export function isOpenAIModel(modelName: string): boolean {
  return detectModelType(modelName) === 'openai';
}