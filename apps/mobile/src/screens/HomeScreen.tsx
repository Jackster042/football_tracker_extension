/**
 * Home Screen
 * Main dashboard showing scores and matches
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { theme } from '../theme';
import { TopAppBar, DateScroller, SportsDropdownMenu, SPORTS_LIST } from '../components/common';
import type { Sport } from '../components/common';
import { 
  SortByHeader, 
  LeagueHeader, 
  MatchCard, 
  FavoriteSection 
} from '../components/dashboard';
import { CalendarModal } from '../components/modals';
import { 
  getFavoriteLeagues, 
  getOtherLeagues, 
  getTotalMatchCount, 
  getCompletedMatchCount,
  League 
} from '../data/mockMatches';

export const HomeScreen: React.FC = () => {
  const [expandedLeagues, setExpandedLeagues] = useState<Set<string>>(
    new Set(getFavoriteLeagues().map(l => l.id))
  );
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [sportsDropdownVisible, setSportsDropdownVisible] = useState(false);
  const [selectedSport, setSelectedSport] = useState<Sport>(SPORTS_LIST[0]); // Default to Football

  const favoriteLeagues = getFavoriteLeagues();
  const otherLeagues = getOtherLeagues();
  const totalMatches = getTotalMatchCount();
  const completedMatches = getCompletedMatchCount();

  // Generate mock match dates (dates with matches)
  const matchDates = [
    new Date(2025, 8, 2),  // Sep 2
    new Date(2025, 8, 4),  // Sep 4
    new Date(2025, 8, 5),  // Sep 5
    new Date(2025, 8, 11), // Sep 11
    new Date(2025, 8, 26), // Sep 26
    new Date(2025, 8, 30), // Sep 30
    new Date(2025, 8, 31), // Sep 31
  ];

  const handleProfilePress = () => {
    console.log('Profile pressed');
  };

  const handleSearchPress = () => {
    console.log('Search pressed');
  };

  const handleSportsDropdownPress = () => {
    setSportsDropdownVisible(!sportsDropdownVisible);
  };

  const handleSelectSport = (sport: Sport) => {
    console.log('Sport selected:', sport.name);
    setSelectedSport(sport);
  };

  const handleCloseSportsDropdown = () => {
    setSportsDropdownVisible(false);
  };

  const handleDateSelect = (date: Date) => {
    console.log('Date selected:', date);
    setSelectedDate(date);
  };

  const handleCalendarPress = () => {
    console.log('Calendar pressed');
    setCalendarVisible(true);
  };

  const handleCalendarDateSelect = (date: Date) => {
    console.log('Calendar date selected:', date);
    setSelectedDate(date);
    setCalendarVisible(false);
  };

  const handleCalendarClose = () => {
    setCalendarVisible(false);
  };

  const handleSortByPress = () => {
    console.log('Sort by pressed');
  };

  const handleLeagueToggle = (leagueId: string) => {
    setExpandedLeagues(prev => {
      const newSet = new Set(prev);
      if (newSet.has(leagueId)) {
        newSet.delete(leagueId);
      } else {
        newSet.add(leagueId);
      }
      return newSet;
    });
  };

  const handleMatchPress = (matchId: string) => {
    console.log('Match pressed:', matchId);
  };

  const renderLeagueSection = (league: League) => {
    const isExpanded = expandedLeagues.has(league.id);
    
    return (
      <View key={league.id}>
        <LeagueHeader
          country={league.country}
          leagueName={league.leagueName}
          matchCount={league.matches.length}
          flagEmoji={league.flagEmoji}
          isExpanded={isExpanded}
          onToggle={() => handleLeagueToggle(league.id)}
        />
        {isExpanded && league.matches.map(match => (
          <MatchCard
            key={match.id}
            homeTeam={match.homeTeam}
            awayTeam={match.awayTeam}
            homeScore={match.homeScore}
            awayScore={match.awayScore}
            time={match.time}
            status={match.status}
            homeTeamLogo={match.homeTeamLogo}
            awayTeamLogo={match.awayTeamLogo}
            onPress={() => handleMatchPress(match.id)}
          />
        ))}
      </View>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={handleCloseSportsDropdown}>
      <View style={styles.container}>
        {/* Top App Bar */}
        <TopAppBar
          onProfilePress={handleProfilePress}
          onSearchPress={handleSearchPress}
          onSportsDropdownPress={handleSportsDropdownPress}
          sportsDropdownActive={sportsDropdownVisible}
        />

        {/* Sports Dropdown Menu */}
        <SportsDropdownMenu
          visible={sportsDropdownVisible}
          selectedSportId={selectedSport.id}
          onSelectSport={handleSelectSport}
          onClose={handleCloseSportsDropdown}
        />

        {/* Date Scroller */}
        <DateScroller
          onDateSelect={handleDateSelect}
          onCalendarPress={handleCalendarPress}
        />

        {/* Main Content */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
        {/* Sort By Header */}
        <SortByHeader
          title="Sort By Time"
          matchCount={completedMatches}
          totalMatches={totalMatches}
          onPress={handleSortByPress}
        />

        {/* Favorite Competitions Section */}
        <FavoriteSection title="FAVOURITE COMPETITIONS" />
        
        {favoriteLeagues.map(league => renderLeagueSection(league))}

        {/* Other Competitions Section */}
        {otherLeagues.length > 0 && (
          <>
            <FavoriteSection title="OTHER COMPETITIONS (A-Z)" />
            {otherLeagues.map(league => renderLeagueSection(league))}
          </>
        )}
        </ScrollView>

        {/* Calendar Modal */}
        <CalendarModal
          visible={calendarVisible}
          selectedDate={selectedDate}
          matchDates={matchDates}
          onDateSelect={handleCalendarDateSelect}
          onClose={handleCalendarClose}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
});
