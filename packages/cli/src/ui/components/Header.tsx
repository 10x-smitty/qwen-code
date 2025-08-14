/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Box, Text } from 'ink';
import Gradient from 'ink-gradient';
import { Colors } from '../colors.js';
import {
  shortAsciiLogo,
  longAsciiLogo,
  generateFigletArt,
  FigletConfig,
} from './AsciiArt.js';
import { getAsciiArtWidth } from '../utils/textUtils.js';
import { FigletSettings } from '../../config/settings.js';

interface HeaderProps {
  customAsciiArt?: string; // For user-defined ASCII art
  figletSettings?: FigletSettings; // For configurable figlet settings
  terminalWidth: number; // For responsive logo
  version: string;
  nightly: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  customAsciiArt,
  figletSettings,
  terminalWidth,
  version,
  nightly,
}) => {
  let displayTitle;

  if (customAsciiArt) {
    displayTitle = customAsciiArt;
  } else if (figletSettings) {
    // Generate figlet art with user settings
    const shouldUseShortForm = terminalWidth < 60; // Threshold for short form
    const defaultText = shouldUseShortForm ? 'ID8' : 'ID8';
    const defaultFont = shouldUseShortForm ? 'Small' : 'Alpha';
    const defaultWidth = shouldUseShortForm ? 40 : 80;

    displayTitle = generateFigletArt({
      text: figletSettings.text || defaultText,
      font: figletSettings.font || defaultFont,
      horizontalLayout: figletSettings.horizontalLayout,
      verticalLayout: figletSettings.verticalLayout,
      width: figletSettings.width || defaultWidth,
      whitespaceBreak: figletSettings.whitespaceBreak,
    });
  } else {
    // Use default figlet-generated logos
    const widthOfLongLogo = getAsciiArtWidth(longAsciiLogo);
    displayTitle =
      terminalWidth >= widthOfLongLogo ? longAsciiLogo : shortAsciiLogo;
  }

  const artWidth = getAsciiArtWidth(displayTitle);

  return (
    <Box
      alignItems="flex-start"
      width={artWidth}
      flexShrink={0}
      flexDirection="column"
    >
      {Colors.GradientColors ? (
        <Gradient colors={Colors.GradientColors}>
          <Text>{displayTitle}</Text>
        </Gradient>
      ) : (
        <Text>{displayTitle}</Text>
      )}
      {nightly && (
        <Box width="100%" flexDirection="row" justifyContent="flex-end">
          <Gradient colors={Colors.GradientColors}>
            <Text>v{version}</Text>
          </Gradient>
        </Box>
      )}
    </Box>
  );
};
