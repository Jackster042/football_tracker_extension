/**
 * Bottom Tab Bar Component
 * Main navigation bar with 5 tabs
 * Based on design reference navigation-bar.png
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '../../theme';
import { TabButton } from './TabButton';
import { TAB_CONFIG } from '../../navigation/config';
import { TabRoute } from '../../navigation/types';

interface BottomTabBarProps {
  activeRoute: TabRoute;
  onTabPress: (route: TabRoute) => void;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  activeRoute,
  onTabPress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {TAB_CONFIG.map((tab) => (
          <TabButton
            key={tab.name}
            label={tab.label}
            icon={tab.icon}
            active={activeRoute === tab.name}
            onPress={() => onTabPress(tab.name)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.subtle,
    ...theme.shadows.sm,
  },
  tabBar: {
    flexDirection: 'row',
    height: 60,
    alignItems: 'center',
    paddingHorizontal: theme.spacing[1],
    paddingBottom: theme.spacing[1],
  },
});
