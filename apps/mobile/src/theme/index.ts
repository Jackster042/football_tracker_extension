/**
 * Theme System - Premium Dark Theme
 * 
 * Complete design system based on the visual references.
 * All colors, typography, spacing, and component styles.
 */

import { colors } from './colors';
import { typography } from './typography';
import { spacing, layout } from './spacing';
import { radius, componentRadius } from './radius';
import { shadows, componentShadows } from './shadows';

export const theme = {
  colors,
  typography,
  spacing,
  layout,
  radius,
  componentRadius,
  shadows,
  componentShadows,

  // Common animations
  animation: {
    duration: {
      fast: 150,
      normal: 250,
      slow: 350,
    },
    easing: {
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
    },
  },

  // Icon sizes
  iconSizes: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
    '2xl': 40,
  },
} as const;

export type Theme = typeof theme;

// Re-export individual modules for direct access
export { colors } from './colors';
export { typography } from './typography';
export { spacing, layout } from './spacing';
export { radius, componentRadius } from './radius';
export { shadows, componentShadows } from './shadows';

// Type exports
export type { Colors } from './colors';
export type { Typography } from './typography';
export type { Spacing, Layout } from './spacing';
export type { Radius, ComponentRadius } from './radius';
export type { Shadows, ComponentShadows } from './shadows';
