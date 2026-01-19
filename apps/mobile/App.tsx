import React, { useState } from 'react';
import { StyleSheet, View, StatusBar, SafeAreaView, ActivityIndicator } from 'react-native';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_900Black } from '@expo-google-fonts/inter';
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
  
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_900Black,
  });

  // Show loading indicator while fonts are loading
  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary.main} />
      </View>
    );
  }

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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background.primary,
  },
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
