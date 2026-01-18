/**
 * Typography System
 * Clean Sans-Serif based on Inter/Roboto style
 */

export const typography = {
  // Font Families
  fonts: {
    regular: 'System',      // React Native default (San Francisco on iOS, Roboto on Android)
    medium: 'System',
    semibold: 'System',
    bold: 'System',
  },

  // Font Weights
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    heavy: '800' as const,
  },

  // Font Sizes
  sizes: {
    xs: 11,
    sm: 13,
    base: 15,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
    '5xl': 36,
  },

  // Line Heights
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },

  // Text Styles (Presets)
  styles: {
    // Headings
    h1: {
      fontSize: 32,
      fontWeight: '700' as const,
      lineHeight: 38,
      letterSpacing: -0.5,
    },
    h2: {
      fontSize: 28,
      fontWeight: '700' as const,
      lineHeight: 34,
      letterSpacing: -0.3,
    },
    h3: {
      fontSize: 24,
      fontWeight: '600' as const,
      lineHeight: 30,
      letterSpacing: -0.2,
    },
    h4: {
      fontSize: 20,
      fontWeight: '600' as const,
      lineHeight: 26,
    },
    h5: {
      fontSize: 18,
      fontWeight: '600' as const,
      lineHeight: 24,
    },
    h6: {
      fontSize: 16,
      fontWeight: '600' as const,
      lineHeight: 22,
    },

    // Body Text
    body: {
      fontSize: 15,
      fontWeight: '400' as const,
      lineHeight: 22,
    },
    bodyLarge: {
      fontSize: 16,
      fontWeight: '400' as const,
      lineHeight: 24,
    },
    bodySmall: {
      fontSize: 13,
      fontWeight: '400' as const,
      lineHeight: 18,
    },

    // Labels & Captions
    label: {
      fontSize: 15,
      fontWeight: '500' as const,
      lineHeight: 20,
    },
    labelSmall: {
      fontSize: 13,
      fontWeight: '500' as const,
      lineHeight: 18,
    },
    caption: {
      fontSize: 13,
      fontWeight: '400' as const,
      lineHeight: 18,
    },
    captionSmall: {
      fontSize: 11,
      fontWeight: '400' as const,
      lineHeight: 14,
    },

    // UI Text
    button: {
      fontSize: 15,
      fontWeight: '600' as const,
      lineHeight: 20,
      letterSpacing: 0.3,
    },
    buttonSmall: {
      fontSize: 13,
      fontWeight: '600' as const,
      lineHeight: 18,
      letterSpacing: 0.3,
    },
    tabLabel: {
      fontSize: 11,
      fontWeight: '500' as const,
      lineHeight: 14,
    },

    // Scores & Numbers
    scoreMain: {
      fontSize: 20,
      fontWeight: '700' as const,
      lineHeight: 24,
    },
    scoreLarge: {
      fontSize: 32,
      fontWeight: '700' as const,
      lineHeight: 38,
    },
    time: {
      fontSize: 11,
      fontWeight: '500' as const,
      lineHeight: 14,
      letterSpacing: 0.5,
    },
  },
} as const;

export type Typography = typeof typography;
