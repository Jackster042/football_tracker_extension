import React from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import { Match } from '@football-tracker/shared';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Text style={styles.title}>⚽ Football Tracker</Text>
      <Text style={styles.subtitle}>Mobile App</Text>
      <Text style={styles.description}>
        React Native / Expo placeholder
      </Text>
      <Text style={styles.note}>
        Ready to consume shared types from @football-tracker/shared
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 24,
    color: '#666',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#999',
    marginBottom: 10,
  },
  note: {
    fontSize: 14,
    color: '#4CAF50',
    textAlign: 'center',
    marginTop: 20,
  },
});
