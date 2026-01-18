/**
 * Tab Button Component
 * Individual tab button with icon, label, and active state indicator
 * Based on design reference navigation-bar.png
 */

import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { theme } from '../../theme';
import { TabIcon } from './TabIcon';

interface TabButtonProps {
  label: string;
  icon: string;
  active: boolean;
  onPress: () => void;
}

export const TabButton: React.FC<TabButtonProps> = ({
  label,
  icon,
  active,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        {/* Icon */}
        <TabIcon name={icon} active={active} />
        
        {/* Label */}
        <Text
          style={[
            styles.label,
            active ? styles.labelActive : styles.labelInactive,
          ]}
        >
          {label}
        </Text>
        
        {/* Active indicator - horizontal line/pill below */}
        {active && <View style={styles.activeIndicator} />}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing[2],
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  label: {
    ...theme.typography.styles.caption,
    marginTop: theme.spacing[1],
    fontSize: 11,
    fontWeight: '500',
  },
  labelActive: {
    color: theme.colors.primary.main,
  },
  labelInactive: {
    color: theme.colors.text.secondary,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -10,
    width: 40,
    height: 3,
    backgroundColor: theme.colors.primary.main,
    borderRadius: 1.5,
  },
});
