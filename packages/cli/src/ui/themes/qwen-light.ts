/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { type ColorsTheme, Theme } from './theme.js';

const qwenLightColors: ColorsTheme = {
  type: 'light',
  Background: '#f8f9fa',
  Foreground: '#5c6166',
  LightBlue: '#4682B4',  // Steel Blue
  AccentBlue: '#1E90FF',  // Dodger Blue
  AccentPurple: '#a37acc',
  AccentCyan: '#5F9EA0',  // Cadet Blue
  AccentGreen: '#48D1CC',  // Medium Turquoise
  AccentYellow: '#87CEEB',  // Sky Blue
  AccentRed: '#f07171',
  DiffAdded: '#48D1CC',
  DiffRemoved: '#f07171',
  Comment: '#ABADB1',
  Gray: '#CCCFD3',
  GradientColors: ['#1E90FF', '#00BFFF'],  // Dodger Blue to Deep Sky Blue gradient
};

export const QwenLight: Theme = new Theme(
  'Qwen Light',
  'light',
  {
    hljs: {
      display: 'block',
      overflowX: 'auto',
      padding: '0.5em',
      background: qwenLightColors.Background,
      color: qwenLightColors.Foreground,
    },
    'hljs-comment': {
      color: qwenLightColors.Comment,
      fontStyle: 'italic',
    },
    'hljs-quote': {
      color: qwenLightColors.AccentCyan,
      fontStyle: 'italic',
    },
    'hljs-string': {
      color: qwenLightColors.AccentGreen,
    },
    'hljs-constant': {
      color: qwenLightColors.AccentCyan,
    },
    'hljs-number': {
      color: qwenLightColors.AccentPurple,
    },
    'hljs-keyword': {
      color: qwenLightColors.AccentYellow,
    },
    'hljs-selector-tag': {
      color: qwenLightColors.AccentYellow,
    },
    'hljs-attribute': {
      color: qwenLightColors.AccentYellow,
    },
    'hljs-variable': {
      color: qwenLightColors.Foreground,
    },
    'hljs-variable.language': {
      color: qwenLightColors.LightBlue,
      fontStyle: 'italic',
    },
    'hljs-title': {
      color: qwenLightColors.AccentBlue,
    },
    'hljs-section': {
      color: qwenLightColors.AccentGreen,
      fontWeight: 'bold',
    },
    'hljs-type': {
      color: qwenLightColors.LightBlue,
    },
    'hljs-class .hljs-title': {
      color: qwenLightColors.AccentBlue,
    },
    'hljs-tag': {
      color: qwenLightColors.LightBlue,
    },
    'hljs-name': {
      color: qwenLightColors.AccentBlue,
    },
    'hljs-builtin-name': {
      color: qwenLightColors.AccentYellow,
    },
    'hljs-meta': {
      color: qwenLightColors.AccentYellow,
    },
    'hljs-symbol': {
      color: qwenLightColors.AccentRed,
    },
    'hljs-bullet': {
      color: qwenLightColors.AccentYellow,
    },
    'hljs-regexp': {
      color: qwenLightColors.AccentCyan,
    },
    'hljs-link': {
      color: qwenLightColors.LightBlue,
    },
    'hljs-deletion': {
      color: qwenLightColors.AccentRed,
    },
    'hljs-addition': {
      color: qwenLightColors.AccentGreen,
    },
    'hljs-emphasis': {
      fontStyle: 'italic',
    },
    'hljs-strong': {
      fontWeight: 'bold',
    },
    'hljs-literal': {
      color: qwenLightColors.AccentCyan,
    },
    'hljs-built_in': {
      color: qwenLightColors.AccentRed,
    },
    'hljs-doctag': {
      color: qwenLightColors.AccentRed,
    },
    'hljs-template-variable': {
      color: qwenLightColors.AccentCyan,
    },
    'hljs-selector-id': {
      color: qwenLightColors.AccentRed,
    },
  },
  qwenLightColors,
);
