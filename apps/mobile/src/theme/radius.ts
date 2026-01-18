/**
 * Border Radius System
 */

export const radius = {
  none: 0,
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  full: 9999,
} as const;

// Component-specific radius
export const componentRadius = {
  card: radius.lg,          // 12px - Match cards
  button: radius.md,        // 8px - Buttons
  pill: radius.full,        // Full rounded - Filter pills
  input: radius.md,         // 8px - Input fields
  modal: radius.xl,         // 16px - Modals and bottom sheets
  avatar: radius.full,      // Full rounded - User avatars
  badge: radius.sm,         // 6px - Small badges
} as const;

export type Radius = typeof radius;
export type ComponentRadius = typeof componentRadius;
