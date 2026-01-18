/**
 * Match Card Component
 * Displays match information with teams, scores, and time
 * Based on design reference score-dashboard.png
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../../theme';

export interface MatchCardProps {
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  time?: string;
  status?: 'FT' | 'HT' | 'LIVE' | 'SCHEDULED';
  homeTeamLogo?: string;
  awayTeamLogo?: string;
  onPress?: () => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({
  homeTeam,
  awayTeam,
  homeScore,
  awayScore,
  time = '15:00',
  status = 'SCHEDULED',
  homeTeamLogo,
  awayTeamLogo,
  onPress,
}) => {
  const isFinished = status === 'FT' || status === 'HT';
  const isLive = status === 'LIVE';

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Time and Status Section */}
      <View style={styles.timeSection}>
        <Text style={styles.time}>{time}</Text>
        {isFinished && (
          <Text style={styles.status}>{status}</Text>
        )}
        {isLive && (
          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
          </View>
        )}
      </View>

      {/* Match Info Section */}
      <View style={styles.matchSection}>
        {/* Home Team */}
        <View style={styles.teamRow}>
          <View style={styles.teamInfo}>
            {homeTeamLogo ? (
              <Text style={styles.logo}>{homeTeamLogo}</Text>
            ) : (
              <View style={styles.logoPlaceholder} />
            )}
            <Text style={styles.teamName} numberOfLines={1}>
              {homeTeam}
            </Text>
          </View>
          {homeScore !== undefined && (
            <Text style={styles.score}>{homeScore}</Text>
          )}
        </View>

        {/* Away Team */}
        <View style={styles.teamRow}>
          <View style={styles.teamInfo}>
            {awayTeamLogo ? (
              <Text style={styles.logo}>{awayTeamLogo}</Text>
            ) : (
              <View style={styles.logoPlaceholder} />
            )}
            <Text style={styles.teamName} numberOfLines={1}>
              {awayTeam}
            </Text>
          </View>
          {awayScore !== undefined && (
            <Text style={styles.score}>{awayScore}</Text>
          )}
        </View>
      </View>

      {/* Stats Icon */}
      <View style={styles.statsSection}>
        <View style={styles.statsIcon}>
          <View style={styles.statsBar} />
          <View style={[styles.statsBar, styles.statsBarShort]} />
          <View style={styles.statsBar} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[3],
    backgroundColor: theme.colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.subtle,
  },
  timeSection: {
    width: 50,
    marginRight: theme.spacing[3],
  },
  time: {
    ...theme.typography.styles.caption,
    fontSize: 12,
    color: theme.colors.text.secondary,
    marginBottom: 2,
  },
  status: {
    ...theme.typography.styles.caption,
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.text.tertiary,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.accent.live,
  },
  matchSection: {
    flex: 1,
    gap: theme.spacing[2],
  },
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  teamInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
    flex: 1,
  },
  logo: {
    fontSize: 20,
    width: 24,
    height: 24,
    textAlign: 'center',
  },
  logoPlaceholder: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.background.card,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
  },
  teamName: {
    ...theme.typography.styles.body,
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text.primary,
    flex: 1,
  },
  score: {
    ...theme.typography.styles.body,
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    minWidth: 20,
    textAlign: 'right',
  },
  statsSection: {
    marginLeft: theme.spacing[3],
    width: 24,
    alignItems: 'center',
  },
  statsIcon: {
    width: 16,
    height: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statsBar: {
    width: 16,
    height: 2,
    backgroundColor: theme.colors.text.tertiary,
    borderRadius: 1,
  },
  statsBarShort: {
    width: 12,
  },
});
