import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './src/screens/HomeScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import PatternsScreen from './src/screens/PatternsScreen';

export default function App() {
  const [activeTab, setActiveTab] = useState('Today');

  const renderScreen = () => {
    switch (activeTab) {
      case 'Today':
        return <HomeScreen />;
      case 'History':
        return <HistoryScreen />;
      case 'Patterns':
        return <PatternsScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Screen Content */}
      <View style={styles.content}>
        {renderScreen()}
      </View>

      {/* Custom Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => setActiveTab('Today')}
        >
          <Ionicons
            name={activeTab === 'Today' ? 'home' : 'home-outline'}
            size={24}
            color={activeTab === 'Today' ? '#2e7d32' : 'gray'}
          />
          <Text style={[styles.tabText, activeTab === 'Today' && styles.activeTabText]}>
            Today
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tab}
          onPress={() => setActiveTab('History')}
        >
          <Ionicons
            name={activeTab === 'History' ? 'list' : 'list-outline'}
            size={24}
            color={activeTab === 'History' ? '#2e7d32' : 'gray'}
          />
          <Text style={[styles.tabText, activeTab === 'History' && styles.activeTabText]}>
            History
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tab}
          onPress={() => setActiveTab('Patterns')}
        >
          <Ionicons
            name={activeTab === 'Patterns' ? 'analytics' : 'analytics-outline'}
            size={24}
            color={activeTab === 'Patterns' ? '#2e7d32' : 'gray'}
          />
          <Text style={[styles.tabText, activeTab === 'Patterns' && styles.activeTabText]}>
            Patterns
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingBottom: 20,
    paddingTop: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  tabText: {
    fontSize: 12,
    marginTop: 4,
    color: 'gray',
  },
  activeTabText: {
    color: '#2e7d32',
    fontWeight: '600',
  },
});
