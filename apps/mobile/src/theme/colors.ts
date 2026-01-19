/**
 * Color Palette - Premium Dark Theme
 * Based on design references in ./design-refferences/
 */

export const colors = {
  // Background Colors
  background: {
    primary: '#0A0E27',      // Main app background - deep navy/black
    secondary: '#121212',    // Secondary dark background - charcoal
    card: '#1A1F3A',        // Card/component background - dark blue-gray
    elevated: '#1E2440',    // Elevated elements (modals, sheets)
    input: '#161B33',       // Input fields background
    dateSection: '#1E222D', // Grayish background for date scroller
    dateSectionButton: '#2A2E3A', // Button background in date section
  },

  // Gradient Colors
  gradient: {
    topBar: ['#1A1F3A', '#12152A', '#0A0E27'], // Top app bar gradient
  },

  // Primary Brand Colors
  primary: {
    main: '#4F70F0',        // Vibrant blue - active states, buttons
    light: '#6B88FF',       // Lighter blue - hover states
    dark: '#3D5AC7',        // Darker blue - pressed states
    subtle: 'rgba(79, 112, 240, 0.1)', // Very transparent blue for backgrounds
  },

  // Accent Colors
  accent: {
    live: '#E91E63',        // Live/Hot indicator - pink/red
    success: '#4CAF50',     // Success states
    warning: '#FFA726',     // Warning states
    error: '#EF5350',       // Error states
    like: '#FF2D55',        // Like button color
  },

  // Text Colors
  text: {
    primary: '#FFFFFF',     // High emphasis text
    secondary: '#A0A0A0',   // Medium emphasis - subtitles
    tertiary: '#6B7280',    // Low emphasis - timestamps, meta
    disabled: '#4B5563',    // Disabled text
    inverse: '#0A0E27',     // Text on light backgrounds
  },

  // Border & Divider Colors
  border: {
    subtle: 'rgba(255, 255, 255, 0.08)',  // Very subtle borders
    medium: 'rgba(255, 255, 255, 0.12)',  // Medium borders
    strong: 'rgba(255, 255, 255, 0.2)',   // Strong borders
    focus: '#4F70F0',                      // Focus state borders
  },

  // Overlay Colors
  overlay: {
    light: 'rgba(0, 0, 0, 0.3)',
    medium: 'rgba(0, 0, 0, 0.5)',
    heavy: 'rgba(0, 0, 0, 0.75)',
  },

  // Status Bar
  statusBar: {
    style: 'light-content' as const,
    backgroundColor: '#0A0E27',
  },

  // Special Colors
  special: {
    gradient: {
      start: '#4F70F0',
      end: '#8B5CF6',
    },
    shimmer: 'rgba(255, 255, 255, 0.1)',
  },
} as const;

export type Colors = typeof colors;
