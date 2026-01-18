import React, { useState } from 'react';
import { StyleSheet, View, StatusBar, SafeAreaView } from 'react-native';
import { theme } from './src/theme';
import { BottomTabBar } from './src/components/navigation';
import { TabRoute } from './src/navigation/types';
import {
  HomeScreen,
  FavoritesScreen,
  LiveScreen,
  LeaguesScreen,
  FeedScreen,
} from './src/screens';

export default function App() {
  const [activeRoute, setActiveRoute] = useState<TabRoute>('Home');

  const renderScreen = () => {
    switch (activeRoute) {
      case 'Home':
        return <HomeScreen />;
      case 'Favorites':
        return <FavoritesScreen />;
      case 'Live':
        return <LiveScreen />;
      case 'Leagues':
        return <LeaguesScreen />;
      case 'Feed':
        return <FeedScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <StatusBar 
          barStyle={theme.colors.statusBar.style} 
          backgroundColor={theme.colors.statusBar.backgroundColor} 
        />
        
        {/* Main content area */}
        <View style={styles.content}>
          {renderScreen()}
        </View>
        
        {/* Bottom navigation bar */}
        <BottomTabBar
          activeRoute={activeRoute}
          onTabPress={setActiveRoute}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  content: {
    flex: 1,
  },
});
