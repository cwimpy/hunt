import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function HomeScreen() {
  console.log('HomeScreenSimple rendering...');
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Screen Works!</Text>
      <Text style={styles.subtitle}>Navigation is functional</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2e7d32',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
  },
});
