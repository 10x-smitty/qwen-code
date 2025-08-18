/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import figlet from 'figlet';

export interface FigletConfig {
  text: string;
  font?: string;
  horizontalLayout?:
    | 'default'
    | 'full'
    | 'fitted'
    | 'controlled smushing'
    | 'universal smushing';
  verticalLayout?:
    | 'default'
    | 'full'
    | 'fitted'
    | 'controlled smushing'
    | 'universal smushing';
  width?: number;
  whitespaceBreak?: boolean;
}

/**
 * Default figlet configuration
 */
const DEFAULT_CONFIG: FigletConfig = {
  text: 'ORB',
  font: 'Alpha',
  horizontalLayout: 'fitted',
  verticalLayout: 'fitted',
  width: 80,
  whitespaceBreak: false,
};

/**
 * Generates ASCII art using figlet with the specified configuration
 */
export function generateFigletArt(config: Partial<FigletConfig> = {}): string {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  try {
    return figlet.textSync(finalConfig.text, {
      font: finalConfig.font as any,
      horizontalLayout: finalConfig.horizontalLayout as any,
      verticalLayout: finalConfig.verticalLayout as any,
      width: finalConfig.width,
      whitespaceBreak: finalConfig.whitespaceBreak,
    });
  } catch (error) {
    console.warn(
      'Failed to generate figlet art, falling back to plain text:',
      error,
    );
    return finalConfig.text;
  }
}

/**
 * Get available figlet fonts
 */
export function getAvailableFonts(): string[] {
  return figlet.fontsSync();
}

/**
 * Generate ASCII art for different terminal widths
 */
export const shortAsciiLogo = generateFigletArt({
  text: 'ORB',
  font: 'Alpha',
  width: 40,
});

export const longAsciiLogo = generateFigletArt({
  text: 'ORB',
  font: 'Alpha',
  width: 80,
});
