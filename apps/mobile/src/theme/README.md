# Theme System Documentation

## Overview

The Football Tracker mobile app uses a **Premium Dark Theme** design system based on the visual references provided. This theme system provides a consistent, professional look across the entire application.

## Theme Structure

### 📁 File Organization

```
src/theme/
├── index.ts          # Main theme export
├── colors.ts         # Color palette
├── typography.ts     # Font styles and sizes
├── spacing.ts        # Spacing scale and layout
├── radius.ts         # Border radius values
└── shadows.ts        # Shadow styles (iOS & Android)
```

## Color Palette

### Background Colors
- **Primary**: `#0A0E27` - Main app background (deep navy/black)
- **Secondary**: `#121212` - Charcoal background
- **Card**: `#1A1F3A` - Card/component background
- **Elevated**: `#1E2440` - Modals and bottom sheets
- **Input**: `#161B33` - Input field background

### Primary Brand Colors
- **Main**: `#4F70F0` - Vibrant blue (active states, buttons)
- **Light**: `#6B88FF` - Lighter blue (hover states)
- **Dark**: `#3D5AC7` - Darker blue (pressed states)
- **Subtle**: `rgba(79, 112, 240, 0.1)` - Transparent backgrounds

### Accent Colors
- **Live**: `#E91E63` - Live/hot indicator
- **Success**: `#4CAF50` - Success states
- **Warning**: `#FFA726` - Warning states
- **Error**: `#EF5350` - Error states
- **Like**: `#FF2D55` - Like button color

### Text Colors
- **Primary**: `#FFFFFF` - High emphasis text
- **Secondary**: `#A0A0A0` - Medium emphasis (subtitles)
- **Tertiary**: `#6B7280` - Low emphasis (timestamps)
- **Disabled**: `#4B5563` - Disabled text

## Typography

### Font System
Uses system defaults (San Francisco on iOS, Roboto on Android) for optimal performance.

### Text Styles

#### Headings
- `h1`: 32px, bold, -0.5 letter spacing
- `h2`: 28px, bold, -0.3 letter spacing
- `h3`: 24px, semibold
- `h4`: 20px, semibold
- `h5`: 18px, semibold
- `h6`: 16px, semibold

#### Body Text
- `body`: 15px, regular
- `bodyLarge`: 16px, regular
- `bodySmall`: 13px, regular

#### Labels & Captions
- `label`: 15px, medium
- `labelSmall`: 13px, medium
- `caption`: 13px, regular
- `captionSmall`: 11px, regular

#### UI Text
- `button`: 15px, semibold, 0.3 letter spacing
- `tabLabel`: 11px, medium
- `time`: 11px, medium, 0.5 letter spacing

#### Scores & Numbers
- `scoreMain`: 20px, bold
- `scoreLarge`: 32px, bold

## Spacing System

Based on **4px base unit**:

```
0, 4, 8, 12, 16, 20, 24, 28, 32, 40, 48, 56, 64, 80, 96
```

### Common Layout Patterns
- **Screen Padding**: 16px (horizontal & vertical)
- **Card Padding**: 16px
- **Card Gap**: 12px
- **Section Gap**: 24px
- **List Item Gap**: 8px

### Component Heights
- **Bottom Navigation**: 60px
- **Top Bar**: 56px

## Border Radius

- **xs**: 4px
- **sm**: 6px
- **md**: 8px
- **lg**: 12px
- **xl**: 16px
- **2xl**: 20px
- **3xl**: 24px
- **full**: 9999px (fully rounded)

### Component-Specific
- **Cards**: 12px
- **Buttons**: 8px
- **Pills**: Full rounded
- **Modals**: 16px
- **Avatars**: Full rounded

## Shadows

Platform-specific shadows (iOS & Android):

- **sm**: Elevation 2 - Cards
- **md**: Elevation 4 - General use
- **lg**: Elevation 8 - FABs, Bottom nav
- **xl**: Elevation 12 - Modals
- **2xl**: Elevation 16 - Highest elevation

## Usage Examples

### Basic Usage

```typescript
import { theme } from './src/theme';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background.primary,
    padding: theme.spacing[4],
  },
  title: {
    ...theme.typography.styles.h1,
    color: theme.colors.text.primary,
  },
  card: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.componentRadius.card,
    padding: theme.spacing[4],
    ...theme.componentShadows.card,
  },
});
```

### Using Individual Modules

```typescript
import { colors, typography, spacing } from './src/theme';

const styles = {
  text: {
    fontSize: typography.sizes.md,
    color: colors.text.primary,
    marginBottom: spacing[3],
  },
};
```

### Creating Themed Components

```typescript
import { theme } from './src/theme';

const PrimaryButton = styled.TouchableOpacity`
  background-color: ${theme.colors.primary.main};
  padding: ${theme.spacing[3]}px ${theme.spacing[5]}px;
  border-radius: ${theme.componentRadius.button}px;
`;
```

## Design Principles

1. **Dark First**: Optimized for dark mode viewing
2. **High Contrast**: Ensures readability in all lighting conditions
3. **Consistent Spacing**: 4px base unit for predictable layouts
4. **Platform Native**: Uses system fonts for best performance
5. **Accessible**: Color contrast meets WCAG standards

## Visual References

All design screenshots are located in:
```
./design-refferences/
├── score-dashboard.png
├── navigation-bar.png
├── feed-news.png
├── feed-video.png
└── Screenshot 2026-01-18 232535.png
```

Refer to these images for exact spacing, colors, and component styles.

## Next Steps

- ✅ **Phase 1, Task 1.1**: Theme colors and base styles - COMPLETE
- 🔜 **Phase 1, Task 1.2**: Typography & reusable components (Pill, League Header)
- 🔜 **Phase 2**: Navigation architecture (Bottom nav, Top bar)
- 🔜 **Phase 3**: Home screen & score dashboard
- 🔜 **Phase 4**: Content feed (Video & News)
- 🔜 **Phase 5**: Interaction modals & filtering
