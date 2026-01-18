/**
 * Feed Header Component
 * Header with title, filter buttons, and Videos/News toggle
 * Based on design reference feed-video.png and feed-news.png
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../../theme';

interface FeedHeaderProps {
  title?: string;
  selectedCountry?: string;
  selectedSport?: string;
  onCountryPress?: () => void;
  onSportPress?: () => void;
  activeTab?: 'videos' | 'news';
  onTabChange?: (tab: 'videos' | 'news') => void;
}

export const FeedHeader: React.FC<FeedHeaderProps> = ({
  title = 'FEED',
  selectedCountry = 'Country',
  selectedSport = 'From',
  onCountryPress,
  onSportPress,
  activeTab = 'videos',
  onTabChange,
}) => {
  return (
    <View style={styles.container}>
      {/* Title and Filter Buttons Row */}
      <View style={styles.topRow}>
        <Text style={styles.title}>{title}</Text>

        <View style={styles.filters}>
          {/* Country Filter */}
          <TouchableOpacity
            style={styles.filterButton}
            onPress={onCountryPress}
            activeOpacity={0.7}
          >
            <View style={styles.filterIcon} />
            <Text style={styles.filterText}>{selectedCountry}</Text>
            <View style={styles.filterDropdown} />
          </TouchableOpacity>

          {/* Sport/From Filter */}
          <TouchableOpacity
            style={styles.filterButton}
            onPress={onSportPress}
            activeOpacity={0.7}
          >
            <View style={styles.filterIcon} />
            <Text style={styles.filterText}>{selectedSport}</Text>
            <View style={styles.filterDropdown} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Videos/News Toggle */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            styles.toggleButtonLeft,
            activeTab === 'videos' && styles.toggleButtonActive,
          ]}
          onPress={() => onTabChange?.('videos')}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.toggleText,
              activeTab === 'videos' && styles.toggleTextActive,
            ]}
          >
            Videos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.toggleButton,
            styles.toggleButtonRight,
            activeTab === 'news' && styles.toggleButtonActive,
          ]}
          onPress={() => onTabChange?.('news')}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.toggleText,
              activeTab === 'news' && styles.toggleTextActive,
            ]}
          >
            News
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background.primary,
    paddingTop: theme.spacing[3],
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing[4],
    paddingBottom: theme.spacing[3],
  },
  title: {
    ...theme.typography.styles.h2,
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  filters: {
    flexDirection: 'row',
    gap: theme.spacing[2],
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.card,
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[2],
    borderRadius: theme.radius.full,
    gap: theme.spacing[1],
  },
  filterIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: theme.colors.text.secondary,
  },
  filterText: {
    ...theme.typography.styles.body,
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  filterDropdown: {
    width: 0,
    height: 0,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 5,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: theme.colors.text.secondary,
  },
  toggleContainer: {
    flexDirection: 'row',
    marginHorizontal: theme.spacing[4],
    marginBottom: theme.spacing[3],
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.radius.md,
    padding: 2,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: theme.spacing[2],
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.md,
  },
  toggleButtonLeft: {
    marginRight: 1,
  },
  toggleButtonRight: {
    marginLeft: 1,
  },
  toggleButtonActive: {
    backgroundColor: theme.colors.background.primary,
  },
  toggleText: {
    ...theme.typography.styles.body,
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text.secondary,
  },
  toggleTextActive: {
    color: theme.colors.text.primary,
  },
});
