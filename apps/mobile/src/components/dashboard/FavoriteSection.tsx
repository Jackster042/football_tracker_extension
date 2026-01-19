/**
 * Favorite Section Component
 * Section header for favorite competitions
 * Based on design reference score-dashboard.png
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../theme';

interface FavoriteSectionProps {
  title?: string;
}

export const FavoriteSection: React.FC<FavoriteSectionProps> = ({
  title = 'FAVOURITE COMPETITIONS',
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[3],
    backgroundColor: theme.colors.background.primary,
  },
  title: {
    fontFamily: theme.typography.fonts.bold,
    fontSize: 12,
    color: theme.colors.accent.warning,
    letterSpacing: 0.5,
  },
});
