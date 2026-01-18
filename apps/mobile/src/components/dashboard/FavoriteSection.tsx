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
    ...theme.typography.styles.body,
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.accent.warning,
    letterSpacing: 0.5,
  },
});
