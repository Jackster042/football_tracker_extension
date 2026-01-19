/**
 * League Header Component
 * Collapsible league section header with flag, name, and match count
 * Based on design reference score-dashboard.png
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../../theme';

interface LeagueHeaderProps {
  country: string;
  leagueName: string;
  matchCount?: number;
  flagEmoji?: string;
  isExpanded?: boolean;
  onToggle?: (expanded: boolean) => void;
}

export const LeagueHeader: React.FC<LeagueHeaderProps> = ({
  country,
  leagueName,
  matchCount,
  flagEmoji,
  isExpanded: controlledExpanded,
  onToggle,
}) => {
  const [internalExpanded, setInternalExpanded] = useState(true);
  
  const isExpanded = controlledExpanded !== undefined ? controlledExpanded : internalExpanded;

  const handlePress = () => {
    const newExpanded = !isExpanded;
    if (controlledExpanded === undefined) {
      setInternalExpanded(newExpanded);
    }
    onToggle?.(newExpanded);
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.leftSection}>
        {/* Flag or Country Indicator */}
        {flagEmoji ? (
          <Text style={styles.flag}>{flagEmoji}</Text>
        ) : (
          <View style={styles.flagPlaceholder}>
            <Text style={styles.flagText}>{country.substring(0, 2).toUpperCase()}</Text>
          </View>
        )}
        
        <View style={styles.textContainer}>
          <Text style={styles.country}>{country.toUpperCase()}</Text>
          <Text style={styles.leagueName}>{leagueName}</Text>
        </View>
      </View>

      <View style={styles.rightSection}>
        {matchCount !== undefined && (
          <Text style={styles.matchCount}>/{matchCount}</Text>
        )}
        
        {/* Chevron Icon */}
        <View style={[
          styles.chevron,
          isExpanded && styles.chevronExpanded,
        ]} />
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
    backgroundColor: theme.colors.background.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.subtle,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[3],
    flex: 1,
  },
  flag: {
    fontSize: 24,
    width: 32,
    height: 32,
    textAlign: 'center',
    lineHeight: 32,
  },
  flagPlaceholder: {
    width: 32,
    height: 24,
    borderRadius: 2,
    backgroundColor: theme.colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flagText: {
    fontFamily: theme.typography.fonts.bold,
    fontSize: 10,
    color: theme.colors.text.primary,
  },
  textContainer: {
    flex: 1,
  },
  country: {
    fontFamily: theme.typography.fonts.semibold,
    fontSize: 10,
    color: theme.colors.text.tertiary,
    marginBottom: 2,
  },
  leagueName: {
    fontFamily: theme.typography.fonts.semibold,
    fontSize: 15,
    color: theme.colors.text.primary,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
  },
  matchCount: {
    fontFamily: theme.typography.fonts.semibold,
    fontSize: 13,
    color: theme.colors.accent.live,
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
  chevronExpanded: {
    transform: [{ rotate: '270deg' }],
  },
});
