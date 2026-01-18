/**
 * Calendar Modal Component
 * Bottom sheet modal for date selection with calendar grid
 * Based on design reference score-dashboard.png
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { theme } from '../../theme';

interface CalendarModalProps {
  visible: boolean;
  selectedDate?: Date;
  matchDates?: Date[];
  onDateSelect?: (date: Date) => void;
  onClose: () => void;
}

export const CalendarModal: React.FC<CalendarModalProps> = ({
  visible,
  selectedDate = new Date(),
  matchDates = [],
  onDateSelect,
  onClose,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate));
  const [selectedDay, setSelectedDay] = useState(selectedDate);

  const getDaysInMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (date: Date): boolean => {
    return (
      date.getDate() === selectedDay.getDate() &&
      date.getMonth() === selectedDay.getMonth() &&
      date.getFullYear() === selectedDay.getFullYear()
    );
  };

  const hasMatches = (date: Date): boolean => {
    return matchDates.some(
      matchDate =>
        matchDate.getDate() === date.getDate() &&
        matchDate.getMonth() === date.getMonth() &&
        matchDate.getFullYear() === date.getFullYear()
    );
  };

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const handleDayPress = (day: number) => {
    const newDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    setSelectedDay(newDate);
    onDateSelect?.(newDate);
    onClose();
  };

  const renderCalendarGrid = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days: (number | null)[] = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add actual days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return (
      <View style={styles.calendarGrid}>
        {/* Weekday headers */}
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
          <View key={`header-${index}`} style={styles.weekdayHeader}>
            <Text style={styles.weekdayText}>{day}</Text>
          </View>
        ))}

        {/* Calendar days */}
        {days.map((day, index) => {
          if (day === null) {
            return <View key={`empty-${index}`} style={styles.dayCell} />;
          }

          const cellDate = new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth(),
            day
          );

          return (
            <TouchableOpacity
              key={`day-${day}`}
              style={[
                styles.dayCell,
                isSelected(cellDate) && styles.dayCellSelected,
              ]}
              onPress={() => handleDayPress(day)}
              activeOpacity={0.7}
            >
              <View style={styles.dayContent}>
                <Text
                  style={[
                    styles.dayText,
                    isToday(cellDate) && styles.dayTextToday,
                    isSelected(cellDate) && styles.dayTextSelected,
                  ]}
                >
                  {day}
                </Text>
                {hasMatches(cellDate) && (
                  <View style={styles.matchIndicator}>
                    <Text style={styles.matchStar}>★</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const monthName = currentMonth.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });

  const todayLabel = isToday(selectedDay) ? 'TODAY' : '';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.todayLabel}>{todayLabel || ' '}</Text>
            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>

          {/* Month Navigation */}
          <View style={styles.monthNavigation}>
            <TouchableOpacity
              onPress={handlePrevMonth}
              style={styles.navButton}
              activeOpacity={0.7}
            >
              <View style={styles.chevronLeft} />
            </TouchableOpacity>

            <Text style={styles.monthText}>{monthName}</Text>

            <TouchableOpacity
              onPress={handleNextMonth}
              style={styles.navButton}
              activeOpacity={0.7}
            >
              <View style={styles.chevronRight} />
            </TouchableOpacity>
          </View>

          {/* Calendar Grid */}
          {renderCalendarGrid()}
        </View>
      </View>
    </Modal>
  );
};

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.overlay.heavy,
  },
  modalContent: {
    backgroundColor: theme.colors.background.elevated,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    paddingBottom: theme.spacing[6],
    maxHeight: height * 0.8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing[5],
    paddingTop: theme.spacing[5],
    paddingBottom: theme.spacing[3],
  },
  todayLabel: {
    ...theme.typography.styles.body,
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  cancelButton: {
    padding: theme.spacing[2],
  },
  cancelText: {
    ...theme.typography.styles.body,
    fontSize: 16,
    color: theme.colors.text.secondary,
  },
  monthNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing[5],
    paddingVertical: theme.spacing[4],
  },
  navButton: {
    padding: theme.spacing[2],
  },
  chevronLeft: {
    width: 0,
    height: 0,
    borderRightWidth: 8,
    borderTopWidth: 6,
    borderBottomWidth: 6,
    borderRightColor: theme.colors.text.primary,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  chevronRight: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderTopWidth: 6,
    borderBottomWidth: 6,
    borderLeftColor: theme.colors.text.primary,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  monthText: {
    ...theme.typography.styles.h3,
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: theme.spacing[3],
  },
  weekdayHeader: {
    width: `${100 / 7}%`,
    paddingVertical: theme.spacing[2],
    alignItems: 'center',
  },
  weekdayText: {
    ...theme.typography.styles.caption,
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.text.tertiary,
  },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    padding: theme.spacing[1],
  },
  dayCellSelected: {
    backgroundColor: 'transparent',
  },
  dayContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderRadius: theme.radius.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  dayText: {
    ...theme.typography.styles.body,
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text.primary,
  },
  dayTextToday: {
    fontWeight: 'bold',
    color: theme.colors.primary.main,
  },
  dayTextSelected: {
    fontWeight: 'bold',
  },
  matchIndicator: {
    position: 'absolute',
    bottom: 2,
  },
  matchStar: {
    fontSize: 10,
    color: theme.colors.accent.warning,
  },
});
