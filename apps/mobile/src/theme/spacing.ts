/**
 * Spacing System
 * Based on 4px base unit
 */

export const spacing = {
  0: 0,
  1: 4,      // 4px
  2: 8,      // 8px
  3: 12,     // 12px
  4: 16,     // 16px
  5: 20,     // 20px
  6: 24,     // 24px
  7: 28,     // 28px
  8: 32,     // 32px
  10: 40,    // 40px
  12: 48,    // 48px
  14: 56,    // 56px
  16: 64,    // 64px
  20: 80,    // 80px
  24: 96,    // 96px
} as const;

// Common spacing patterns
export const layout = {
  // Screen padding
  screenPaddingHorizontal: spacing[4],  // 16px
  screenPaddingVertical: spacing[4],    // 16px

  // Card spacing
  cardPadding: spacing[4],              // 16px
  cardMargin: spacing[3],               // 12px
  cardGap: spacing[3],                  // 12px

  // Component spacing
  componentGap: spacing[3],             // 12px
  sectionGap: spacing[6],               // 24px

  // List spacing
  listItemPadding: spacing[4],          // 16px
  listItemGap: spacing[2],              // 8px

  // Bottom navigation
  bottomNavHeight: 60,
  bottomNavPaddingBottom: 8,

  // Top bar
  topBarHeight: 56,
  topBarPaddingHorizontal: spacing[4],

  // Pill/chip spacing
  pillPaddingHorizontal: spacing[3],    // 12px
  pillPaddingVertical: spacing[2],      // 8px
  pillGap: spacing[2],                  // 8px
} as const;

export type Spacing = typeof spacing;
export type Layout = typeof layout;
