/**
 * Tab Icon Component
 * Simple icon representations using React Native components
 * Based on design reference navigation-bar.png
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '../../theme';

interface TabIconProps {
  name: string;
  active: boolean;
}

export const TabIcon: React.FC<TabIconProps> = ({ name, active }) => {
  const iconColor = active ? theme.colors.primary.main : theme.colors.text.secondary;

  // Simple icon representations using shapes
  // In a production app, you'd use a library like react-native-vector-icons
  const renderIcon = () => {
    switch (name) {
      case 'home':
        return (
          <View style={styles.iconContainer}>
            {/* House shape */}
            <View style={[styles.homeRoof, { borderBottomColor: iconColor }]} />
            <View style={[styles.homeBase, { backgroundColor: iconColor }]} />
          </View>
        );
      
      case 'star':
        return (
          <View style={styles.iconContainer}>
            {/* Star shape (simplified) */}
            <View style={[styles.star, { borderColor: iconColor }]} />
            {active && <View style={[styles.starFill, { backgroundColor: iconColor }]} />}
          </View>
        );
      
      case 'broadcast':
        return (
          <View style={styles.iconContainer}>
            {/* Radio/broadcast waves */}
            <View style={[styles.broadcastCenter, { backgroundColor: iconColor }]} />
            <View style={[styles.broadcastWave1, { borderColor: iconColor }]} />
            <View style={[styles.broadcastWave2, { borderColor: iconColor }]} />
          </View>
        );
      
      case 'trophy':
        return (
          <View style={styles.iconContainer}>
            {/* Trophy shape */}
            <View style={[styles.trophyCup, { borderColor: iconColor }]} />
            <View style={[styles.trophyBase, { backgroundColor: iconColor }]} />
          </View>
        );
      
      case 'grid':
        return (
          <View style={styles.iconContainer}>
            {/* Grid/Feed icon */}
            <View style={styles.gridContainer}>
              <View style={[styles.gridSquare, { backgroundColor: iconColor }]} />
              <View style={[styles.gridSquare, { backgroundColor: iconColor }]} />
              <View style={[styles.gridSquare, { backgroundColor: iconColor }]} />
              <View style={[styles.gridSquare, { backgroundColor: iconColor }]} />
            </View>
          </View>
        );
      
      default:
        return null;
    }
  };

  return <View style={styles.container}>{renderIcon()}</View>;
};

const styles = StyleSheet.create({
  container: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Home icon
  homeRoof: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginBottom: 1,
  },
  homeBase: {
    width: 14,
    height: 10,
    borderRadius: 1,
  },
  
  // Star icon
  star: {
    width: 18,
    height: 18,
    borderWidth: 2,
    transform: [{ rotate: '45deg' }],
  },
  starFill: {
    position: 'absolute',
    width: 12,
    height: 12,
    transform: [{ rotate: '45deg' }],
  },
  
  // Broadcast icon
  broadcastCenter: {
    width: 6,
    height: 6,
    borderRadius: 3,
    position: 'absolute',
  },
  broadcastWave1: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    position: 'absolute',
  },
  broadcastWave2: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    position: 'absolute',
  },
  
  // Trophy icon
  trophyCup: {
    width: 14,
    height: 10,
    borderWidth: 2,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    marginBottom: 2,
  },
  trophyBase: {
    width: 12,
    height: 3,
    borderRadius: 1,
  },
  
  // Grid icon
  gridContainer: {
    width: 18,
    height: 18,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridSquare: {
    width: 7,
    height: 7,
    borderRadius: 1,
    margin: 1,
  },
});
