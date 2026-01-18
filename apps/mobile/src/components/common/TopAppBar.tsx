/**
 * Top App Bar Component
 * Header with profile icon (left) and action icons (right)
 * Based on design reference score-dashboard.png
 */

import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { theme } from '../../theme';
import { ProfileIcon, SearchIcon, SettingsIcon, MenuIcon } from '../common/Icons';

interface TopAppBarProps {
  onProfilePress?: () => void;
  onSearchPress?: () => void;
  onSettingsPress?: () => void;
  onMenuPress?: () => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  onProfilePress,
  onSearchPress,
  onSettingsPress,
  onMenuPress,
}) => {
  return (
    <View style={styles.container}>
      {/* Left side - Profile Icon */}
      <TouchableOpacity
        style={styles.iconButton}
        onPress={onProfilePress}
        activeOpacity={0.7}
      >
        <ProfileIcon size={28} color={theme.colors.text.primary} />
      </TouchableOpacity>

      {/* Spacer */}
      <View style={styles.spacer} />

      {/* Right side - Action Icons */}
      <View style={styles.rightActions}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onSearchPress}
          activeOpacity={0.7}
        >
          <SearchIcon size={22} color={theme.colors.text.primary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={onSettingsPress}
          activeOpacity={0.7}
        >
          <SettingsIcon size={22} color={theme.colors.text.primary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={onMenuPress}
          activeOpacity={0.7}
        >
          <MenuIcon size={22} color={theme.colors.text.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.primary,
    paddingHorizontal: theme.spacing[4],
    paddingTop: Platform.OS === 'ios' ? theme.spacing[2] : theme.spacing[4],
    paddingBottom: theme.spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.subtle,
  },
  spacer: {
    flex: 1,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[3],
  },
  iconButton: {
    padding: theme.spacing[2],
  },
});
