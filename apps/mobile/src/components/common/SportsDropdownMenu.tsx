/**
 * Sports Dropdown Menu Component
 * Inline dropdown menu for selecting sports
 * Based on design reference score-dashboard.png
 */

import React, { useEffect, useRef, useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Animated,
  Platform,
} from 'react-native';
import { theme } from '../../theme';

export interface Sport {
  id: string;
  name: string;
  emoji: string;
}

export const SPORTS_LIST: Sport[] = [
  { id: 'football', name: 'Football', emoji: '⚽' },
  { id: 'basketball', name: 'Basketball', emoji: '🏀' },
  { id: 'tennis', name: 'Tennis', emoji: '🎾' },
  { id: 'cricket', name: 'Cricket', emoji: '🏏' },
  { id: 'rugby', name: 'Rugby', emoji: '🏉' },
  { id: 'hockey', name: 'Hockey', emoji: '🏒' },
];

interface SportsDropdownMenuProps {
  visible: boolean;
  selectedSportId: string;
  onSelectSport: (sport: Sport) => void;
  onClose: () => void;
}

export const SportsDropdownMenu: React.FC<SportsDropdownMenuProps> = ({
  visible,
  selectedSportId,
  onSelectSport,
  onClose,
}) => {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const [shouldRender, setShouldRender] = useState(visible);

  useEffect(() => {
    if (visible) {
      setShouldRender(true);
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 1,
          tension: 100,
          friction: 10,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShouldRender(false);
      });
    }
  }, [visible]);

  if (!shouldRender) {
    return null;
  }

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-8, 0],
  });

  const scale = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.95, 1],
  });

  const handleSelectSport = (sport: Sport) => {
    onSelectSport(sport);
    onClose();
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: opacityAnim,
          transform: [{ translateY }, { scale }],
        },
      ]}
    >
      <View style={styles.menu}>
        {SPORTS_LIST.map((sport, index) => {
          const isSelected = sport.id === selectedSportId;
          const isFirst = index === 0;
          const isLast = index === SPORTS_LIST.length - 1;
          return (
            <TouchableOpacity
              key={sport.id}
              style={[
                styles.menuItem,
                isSelected && styles.menuItemSelected,
                isFirst && styles.menuItemFirst,
                isLast && styles.menuItemLast,
              ]}
              onPress={() => handleSelectSport(sport)}
              activeOpacity={0.6}
            >
              <Text style={styles.emoji}>{sport.emoji}</Text>
              <Text style={[
                styles.sportName,
                isSelected && styles.sportNameSelected,
              ]}>
                {sport.name}
              </Text>
              {isSelected && (
                <View style={styles.checkmark}>
                  <Text style={styles.checkmarkText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 52 : 60,
    right: theme.spacing[4],
    zIndex: 1000,
  },
  menu: {
    backgroundColor: theme.colors.background.elevated,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
    minWidth: 170,
    ...theme.shadows.lg,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.subtle,
  },
  menuItemFirst: {
    borderTopLeftRadius: theme.radius.lg - 1,
    borderTopRightRadius: theme.radius.lg - 1,
  },
  menuItemLast: {
    borderBottomWidth: 0,
    borderBottomLeftRadius: theme.radius.lg - 1,
    borderBottomRightRadius: theme.radius.lg - 1,
  },
  menuItemSelected: {
    backgroundColor: theme.colors.primary.subtle,
  },
  emoji: {
    fontSize: 18,
    width: 22,
    textAlign: 'center',
  },
  sportName: {
    fontFamily: theme.typography.fonts.medium,
    fontSize: 14,
    color: theme.colors.text.primary,
    flex: 1,
  },
  sportNameSelected: {
    fontFamily: theme.typography.fonts.semibold,
    color: theme.colors.primary.light,
  },
  checkmark: {
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    fontFamily: theme.typography.fonts.bold,
    fontSize: 14,
    color: theme.colors.primary.light,
  },
});
