/**
 * Simple Icon Components
 * Basic icon implementations for header
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '../../theme';

interface IconProps {
  size?: number;
  color?: string;
}

// Profile Icon - Circle with person silhouette
export const ProfileIcon: React.FC<IconProps> = ({ 
  size = 24, 
  color = theme.colors.text.primary 
}) => {
  return (
    <View style={[styles.profileContainer, { width: size, height: size, borderColor: color }]}>
      <View style={[styles.profileHead, { backgroundColor: color }]} />
      <View style={[styles.profileBody, { borderTopColor: color }]} />
    </View>
  );
};

// Search Icon - Magnifying glass
export const SearchIcon: React.FC<IconProps> = ({ 
  size = 24, 
  color = theme.colors.text.primary 
}) => {
  return (
    <View style={[styles.searchContainer, { width: size, height: size }]}>
      <View style={[styles.searchCircle, { borderColor: color }]} />
      <View style={[styles.searchHandle, { backgroundColor: color }]} />
    </View>
  );
};

// Settings Icon - Gear/cog
export const SettingsIcon: React.FC<IconProps> = ({ 
  size = 24, 
  color = theme.colors.text.primary 
}) => {
  return (
    <View style={[styles.settingsContainer, { width: size, height: size }]}>
      <View style={[styles.settingsOuter, { borderColor: color }]} />
      <View style={[styles.settingsInner, { backgroundColor: color }]} />
    </View>
  );
};

// Calendar Icon - Simple calendar grid
export const CalendarIcon: React.FC<IconProps> = ({ 
  size = 24, 
  color = theme.colors.text.primary 
}) => {
  return (
    <View style={[styles.calendarContainer, { width: size, height: size, borderColor: color }]}>
      <View style={[styles.calendarHeader, { backgroundColor: color }]} />
      <View style={styles.calendarGrid}>
        <View style={[styles.calendarDot, { backgroundColor: color }]} />
        <View style={[styles.calendarDot, { backgroundColor: color }]} />
        <View style={[styles.calendarDot, { backgroundColor: color }]} />
        <View style={[styles.calendarDot, { backgroundColor: color }]} />
      </View>
    </View>
  );
};

// Menu Icon - Three dots
export const MenuIcon: React.FC<IconProps> = ({ 
  size = 24, 
  color = theme.colors.text.primary 
}) => {
  return (
    <View style={[styles.menuContainer, { width: size, height: size }]}>
      <View style={[styles.menuDot, { backgroundColor: color }]} />
      <View style={[styles.menuDot, { backgroundColor: color }]} />
      <View style={[styles.menuDot, { backgroundColor: color }]} />
    </View>
  );
};

// Sports Dropdown Icon - Settings gear with chevron down (combined button)
export const SportsDropdownIcon: React.FC<IconProps> = ({ 
  size = 24, 
  color = theme.colors.text.primary 
}) => {
  return (
    <View style={[styles.sportsDropdownContainer, { height: size }]}>
      {/* Gear/Cog Icon */}
      <View style={styles.gearWrapper}>
        <View style={[styles.gearOuter, { borderColor: color }]} />
        <View style={[styles.gearInner, { backgroundColor: color }]} />
      </View>
      {/* Chevron Down */}
      <View style={[styles.dropdownChevron, { 
        borderTopColor: color,
      }]} />
    </View>
  );
};

// Chevron Down Icon - Simple chevron (standalone)
export const ChevronDownIcon: React.FC<IconProps> = ({ 
  size = 24, 
  color = theme.colors.text.primary 
}) => {
  return (
    <View style={[styles.chevronContainer, { width: size, height: size }]}>
      <View style={[styles.chevronTriangle, { 
        borderTopColor: color,
      }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  // Profile Icon
  profileContainer: {
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  profileHead: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 3,
  },
  profileBody: {
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginTop: 2,
  },
  
  // Search Icon
  searchContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  searchCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    position: 'absolute',
    top: 2,
    left: 2,
  },
  searchHandle: {
    width: 2,
    height: 8,
    transform: [{ rotate: '45deg' }],
    position: 'absolute',
    bottom: 2,
    right: 2,
  },
  
  // Settings Icon
  settingsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
  },
  settingsInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    position: 'absolute',
  },
  
  // Calendar Icon
  calendarContainer: {
    borderRadius: 3,
    borderWidth: 2,
    overflow: 'hidden',
  },
  calendarHeader: {
    height: 4,
    width: '100%',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 2,
    gap: 2,
  },
  calendarDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
  },
  
  // Menu Icon
  menuContainer: {
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 4,
  },
  menuDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  
  // Sports Dropdown Icon
  sportsDropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  gearWrapper: {
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gearOuter: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
  },
  gearInner: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    position: 'absolute',
  },
  dropdownChevron: {
    width: 0,
    height: 0,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 5,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  
  // Chevron Icon
  chevronContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  chevronTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
});
