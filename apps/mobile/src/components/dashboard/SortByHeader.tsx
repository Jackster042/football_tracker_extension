/**
 * Sort By Header Component
 * Header with time icon, title, and match count
 * Based on design reference score-dashboard.png
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../../theme';

interface SortByHeaderProps {
  title?: string;
  matchCount?: number;
  totalMatches?: number;
  onPress?: () => void;
}

export const SortByHeader: React.FC<SortByHeaderProps> = ({
  title = 'Sort By Time',
  matchCount = 38,
  totalMatches = 120,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.leftSection}>
        {/* Clock Icon */}
        <View style={styles.clockIcon}>
          <View style={styles.clockCircle} />
          <View style={styles.clockHand} />
        </View>
        
        <Text style={styles.title}>{title}</Text>
      </View>

      <View style={styles.rightSection}>
        <Text style={styles.count}>
          <Text style={styles.countCurrent}>{matchCount}</Text>
          <Text style={styles.countTotal}>/{totalMatches}</Text>
        </Text>
        
        {/* Chevron Icon */}
        <View style={styles.chevron} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[3],
    backgroundColor: theme.colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.subtle,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
  },
  clockIcon: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  clockCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: theme.colors.text.primary,
  },
  clockHand: {
    position: 'absolute',
    width: 2,
    height: 6,
    backgroundColor: theme.colors.text.primary,
    top: 5,
  },
  title: {
    fontFamily: theme.typography.fonts.semibold,
    fontSize: 16,
    color: theme.colors.text.primary,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
  },
  count: {
    fontFamily: theme.typography.fonts.regular,
    fontSize: 14,
  },
  countCurrent: {
    fontFamily: theme.typography.fonts.bold,
    color: theme.colors.accent.live,
  },
  countTotal: {
    color: theme.colors.text.tertiary,
  },
  chevron: {
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: theme.colors.text.secondary,
    transform: [{ rotate: '90deg' }],
  },
});
