/**
 * Top App Bar Component
 * Header with profile icon (left) and action icons (right)
 * Based on design reference score-dashboard.png
 */

import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../theme';
import { ProfileIcon, SearchIcon, SportsDropdownIcon } from '../common/Icons';

interface TopAppBarProps {
  onProfilePress?: () => void;
  onSearchPress?: () => void;
  onSportsDropdownPress?: () => void;
  sportsDropdownActive?: boolean;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  onProfilePress,
  onSearchPress,
  onSportsDropdownPress,
  sportsDropdownActive = false,
}) => {
  return (
    <LinearGradient
      colors={theme.colors.gradient.topBar}
      locations={[0, 0.5, 1]}
      style={styles.container}
    >
      {/* Left side - Profile Icon */}
      <TouchableOpacity
        style={styles.profileButton}
        onPress={onProfilePress}
        activeOpacity={0.7}
      >
        <ProfileIcon size={32} color={theme.colors.text.primary} />
      </TouchableOpacity>

      {/* Spacer */}
      <View style={styles.spacer} />

      {/* Right side - Action Icons */}
      <View style={styles.rightActions}>
        {/* Search Button */}
        <TouchableOpacity
          style={styles.searchButton}
          onPress={onSearchPress}
          activeOpacity={0.7}
        >
          <SearchIcon size={20} color={theme.colors.text.primary} />
        </TouchableOpacity>

        {/* Sports Dropdown Button - Contained style */}
        <TouchableOpacity
          style={[
            styles.dropdownButton,
            sportsDropdownActive && styles.dropdownButtonActive,
          ]}
          onPress={onSportsDropdownPress}
          activeOpacity={0.7}
        >
          <SportsDropdownIcon 
            size={20} 
            color={theme.colors.text.primary} 
          />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing[4],
    paddingTop: Platform.OS === 'ios' ? theme.spacing[1] : theme.spacing[3],
    paddingBottom: theme.spacing[3],
  },
  spacer: {
    flex: 1,
  },
  profileButton: {
    padding: theme.spacing[1],
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
  },
  searchButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border.medium,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.card,
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[2],
    borderRadius: theme.radius.full,
    gap: theme.spacing[1],
  },
  dropdownButtonActive: {
    backgroundColor: theme.colors.primary.subtle,
    borderWidth: 1,
    borderColor: theme.colors.primary.main,
  },
});
