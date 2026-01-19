/**
 * Date Scroller Component
 * Horizontal scrolling date selector with days of the week
 * Based on design reference score-dashboard.png
 */

import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../../theme';
import { CalendarIcon } from '../common/Icons';

interface DateItem {
  dayOfWeek: string;
  dayOfMonth: number;
  month: string;
  isToday: boolean;
  fullDate: Date;
}

interface DateScrollerProps {
  onDateSelect?: (date: Date) => void;
  onCalendarPress?: () => void;
}

export const DateScroller: React.FC<DateScrollerProps> = ({
  onDateSelect,
  onCalendarPress,
}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Generate dates for the scroller (3 days before, today, 3 days after)
  const generateDates = (): DateItem[] => {
    const dates: DateItem[] = [];
    const today = new Date();
    
    for (let i = -3; i <= 3; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      
      const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
      const dayOfMonth = date.getDate();
      const month = date.toLocaleDateString('en-US', { month: 'short' });
      const isToday = i === 0;
      
      dates.push({
        dayOfWeek,
        dayOfMonth,
        month,
        isToday,
        fullDate: date,
      });
    }
    
    return dates;
  };

  const dates = generateDates();

  const handleDatePress = (date: Date) => {
    setSelectedDate(date);
    onDateSelect?.(date);
  };

  const isDateSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {dates.map((dateItem, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dateItem,
              isDateSelected(dateItem.fullDate) && styles.dateItemActive,
            ]}
            onPress={() => handleDatePress(dateItem.fullDate)}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.dayOfWeek,
              isDateSelected(dateItem.fullDate) && styles.textActive,
            ]}>
              {dateItem.isToday ? 'TODAY' : dateItem.dayOfWeek}
            </Text>
            <Text style={[
              styles.dateText,
              isDateSelected(dateItem.fullDate) && styles.textActive,
            ]}>
              {dateItem.month} {dateItem.dayOfMonth}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      {/* Calendar Icon Button */}
      <TouchableOpacity
        style={styles.calendarButton}
        onPress={onCalendarPress}
        activeOpacity={0.7}
      >
        <CalendarIcon size={20} color={theme.colors.text.primary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.dateSection,
    paddingVertical: theme.spacing[2],
  },
  scrollContent: {
    paddingHorizontal: theme.spacing[2],
    gap: theme.spacing[1],
  },
  dateItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: theme.radius.sm,
    minWidth: 52,
  },
  dateItemActive: {
    backgroundColor: theme.colors.primary.main,
    borderRadius: theme.radius.md,
  },
  dayOfWeek: {
    fontSize: 10,
    fontWeight: '600',
    color: theme.colors.text.tertiary,
    marginBottom: 4,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  dateText: {
    fontSize: 13,
    fontWeight: '500',
    color: theme.colors.text.primary,
    lineHeight: 16,
  },
  textActive: {
    color: theme.colors.text.primary,
  },
  calendarButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.spacing[1],
    marginRight: theme.spacing[2],
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.background.dateSectionButton,
  },
});
