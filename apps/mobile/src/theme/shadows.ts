/**
 * Shadow System
 * iOS and Android shadow styles
 */

import { Platform } from 'react-native';

const createShadow = (elevation: number) => {
  if (Platform.OS === 'android') {
    return {
      elevation,
    };
  }

  // iOS shadows
  const shadowOpacity = 0.15;
  const shadowRadius = elevation * 0.5;
  const shadowOffset = {
    width: 0,
    height: elevation * 0.5,
  };

  return {
    shadowColor: '#000000',
    shadowOffset,
    shadowOpacity,
    shadowRadius,
  };
};

export const shadows = {
  none: createShadow(0),
  sm: createShadow(2),
  md: createShadow(4),
  lg: createShadow(8),
  xl: createShadow(12),
  '2xl': createShadow(16),
} as const;

// Component-specific shadows
export const componentShadows = {
  card: shadows.sm,
  modal: shadows.xl,
  fab: shadows.lg,
  bottomNav: shadows.lg,
  topBar: shadows.sm,
} as const;

export type Shadows = typeof shadows;
export type ComponentShadows = typeof componentShadows;
