/**
 * Typography System
 * Using Inter font family for clean, modern UI
 */

export const typography = {
  // Font Families - Inter from Google Fonts
  fonts: {
    regular: 'Inter_400Regular',
    medium: 'Inter_500Medium',
    semibold: 'Inter_600SemiBold',
    bold: 'Inter_700Bold',
    black: 'Inter_900Black',
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

  // Text Styles (Presets) - Using Inter font family
  styles: {
    // Headings
    h1: {
      fontFamily: 'Inter_700Bold',
      fontSize: 32,
      lineHeight: 38,
      letterSpacing: -0.5,
    },
    h2: {
      fontFamily: 'Inter_700Bold',
      fontSize: 28,
      lineHeight: 34,
      letterSpacing: -0.3,
    },
    h3: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 24,
      lineHeight: 30,
      letterSpacing: -0.2,
    },
    h4: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 20,
      lineHeight: 26,
    },
    h5: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 18,
      lineHeight: 24,
    },
    h6: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 16,
      lineHeight: 22,
    },

    // Body Text
    body: {
      fontFamily: 'Inter_400Regular',
      fontSize: 15,
      lineHeight: 22,
    },
    bodyLarge: {
      fontFamily: 'Inter_400Regular',
      fontSize: 16,
      lineHeight: 24,
    },
    bodySmall: {
      fontFamily: 'Inter_400Regular',
      fontSize: 13,
      lineHeight: 18,
    },

    // Labels & Captions
    label: {
      fontFamily: 'Inter_500Medium',
      fontSize: 15,
      lineHeight: 20,
    },
    labelSmall: {
      fontFamily: 'Inter_500Medium',
      fontSize: 13,
      lineHeight: 18,
    },
    caption: {
      fontFamily: 'Inter_400Regular',
      fontSize: 13,
      lineHeight: 18,
    },
    captionSmall: {
      fontFamily: 'Inter_400Regular',
      fontSize: 11,
      lineHeight: 14,
    },

    // UI Text
    button: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 15,
      lineHeight: 20,
      letterSpacing: 0.3,
    },
    buttonSmall: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 13,
      lineHeight: 18,
      letterSpacing: 0.3,
    },
    tabLabel: {
      fontFamily: 'Inter_500Medium',
      fontSize: 11,
      lineHeight: 14,
    },

    // Scores & Numbers
    scoreMain: {
      fontFamily: 'Inter_700Bold',
      fontSize: 20,
      lineHeight: 24,
    },
    scoreLarge: {
      fontFamily: 'Inter_700Bold',
      fontSize: 32,
      lineHeight: 38,
    },
    time: {
      fontFamily: 'Inter_500Medium',
      fontSize: 11,
      lineHeight: 14,
      letterSpacing: 0.5,
    },
  },
} as const;

export type Typography = typeof typography;
