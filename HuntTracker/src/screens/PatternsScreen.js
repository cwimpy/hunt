import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import patternService from '../services/patternService';
import storageService from '../services/storageService';

export default function PatternsScreen() {
  const [patterns, setPatterns] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({ total: 0, successful: 0 });

  useFocusEffect(
    React.useCallback(() => {
      loadPatterns();
    }, [])
  );

  const loadPatterns = async () => {
    try {
      const analysisResults = await patternService.analyzePatterns();
      setPatterns(analysisResults);

      const allHunts = await storageService.getAllHunts();
      const successfulHunts = allHunts.filter(h => h.success);
      setStats({
        total: allHunts.length,
        successful: successfulHunts.length
      });

      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.error('Error loading patterns:', error);
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadPatterns();
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2e7d32" />
      </View>
    );
  }

  const successRate = stats.total > 0 ? Math.round((stats.successful / stats.total) * 100) : 0;

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Success Patterns</Text>
        <Text style={styles.headerSubtitle}>
          Insights from your successful hunts
        </Text>
      </View>

      {/* Stats */}
      <View style={styles.statsCard}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total Hunts</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, styles.successValue]}>{stats.successful}</Text>
          <Text style={styles.statLabel}>Successful</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, styles.rateValue]}>{successRate}%</Text>
          <Text style={styles.statLabel}>Success Rate</Text>
        </View>
      </View>

      {!patterns ? (
        <View style={styles.emptyState}>
          <Ionicons name="analytics-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>Not enough data yet</Text>
          <Text style={styles.emptySubtext}>
            Log more successful hunts to see patterns and insights
          </Text>
        </View>
      ) : (
        <>
          {/* Moon Phases */}
          {patterns.moonPhases && (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="moon" size={20} color="#7b1fa2" />
                <Text style={styles.cardTitle}>Moon Phase Pattern</Text>
              </View>
              <Text style={styles.patternText}>
                Most successful during: <Text style={styles.highlight}>{patterns.moonPhases.mostCommon}</Text>
              </Text>
            </View>
          )}

          {/* Temperature */}
          {patterns.temperatures && (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="thermometer" size={20} color="#d32f2f" />
                <Text style={styles.cardTitle}>Temperature Pattern</Text>
              </View>
              <View style={styles.tempStats}>
                <View style={styles.tempStat}>
                  <Text style={styles.tempLabel}>Average</Text>
                  <Text style={styles.tempValue}>{patterns.temperatures.average}°F</Text>
                </View>
                <View style={styles.tempStat}>
                  <Text style={styles.tempLabel}>Range</Text>
                  <Text style={styles.tempValue}>{patterns.temperatures.range}</Text>
                </View>
              </View>
            </View>
          )}

          {/* Weather Conditions */}
          {patterns.weatherConditions && patterns.weatherConditions.length > 0 && (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="cloud" size={20} color="#1976d2" />
                <Text style={styles.cardTitle}>Weather Conditions</Text>
              </View>
              {patterns.weatherConditions.slice(0, 3).map((item, index) => (
                <View key={index} style={styles.progressItem}>
                  <View style={styles.progressHeader}>
                    <Text style={styles.progressLabel}>{item.condition}</Text>
                    <Text style={styles.progressPercent}>{item.percentage}%</Text>
                  </View>
                  <View style={styles.progressBar}>
                    <View
                      style={[styles.progressFill, { width: `${item.percentage}%` }]}
                    />
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Time of Year */}
          {patterns.timeOfYear && patterns.timeOfYear.length > 0 && (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="calendar" size={20} color="#f57c00" />
                <Text style={styles.cardTitle}>Best Months</Text>
              </View>
              {patterns.timeOfYear.slice(0, 3).map((item, index) => (
                <View key={index} style={styles.progressItem}>
                  <View style={styles.progressHeader}>
                    <Text style={styles.progressLabel}>{item.month}</Text>
                    <Text style={styles.progressPercent}>
                      {item.count} hunt{item.count !== 1 ? 's' : ''} ({item.percentage}%)
                    </Text>
                  </View>
                  <View style={styles.progressBar}>
                    <View
                      style={[styles.progressFill, { width: `${item.percentage}%`, backgroundColor: '#f57c00' }]}
                    />
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Time of Day */}
          {patterns.timeOfDay && patterns.timeOfDay.length > 0 && (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="time" size={20} color="#2e7d32" />
                <Text style={styles.cardTitle}>Best Times</Text>
              </View>
              {patterns.timeOfDay.slice(0, 3).map((item, index) => (
                <View key={index} style={styles.progressItem}>
                  <View style={styles.progressHeader}>
                    <Text style={styles.progressLabel}>{item.time}</Text>
                    <Text style={styles.progressPercent}>{item.percentage}%</Text>
                  </View>
                  <View style={styles.progressBar}>
                    <View
                      style={[styles.progressFill, { width: `${item.percentage}%`, backgroundColor: '#2e7d32' }]}
                    />
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Wind Conditions */}
          {patterns.windConditions && (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="wind" size={20} color="#0288d1" />
                <Text style={styles.cardTitle}>Wind Pattern</Text>
              </View>
              <View style={styles.tempStats}>
                <View style={styles.tempStat}>
                  <Text style={styles.tempLabel}>Average</Text>
                  <Text style={styles.tempValue}>{patterns.windConditions.average} mph</Text>
                </View>
                <View style={styles.tempStat}>
                  <Text style={styles.tempLabel}>Range</Text>
                  <Text style={styles.tempValue}>
                    {patterns.windConditions.low}-{patterns.windConditions.high} mph
                  </Text>
                </View>
              </View>
            </View>
          )}
        </>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#2e7d32',
    padding: 20,
    paddingTop: 60,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    marginTop: 4,
    opacity: 0.9,
  },
  statsCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-around',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  successValue: {
    color: '#2e7d32',
  },
  rateValue: {
    color: '#f57c00',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#e0e0e0',
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#333',
  },
  patternText: {
    fontSize: 15,
    color: '#666',
  },
  highlight: {
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  tempStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  tempStat: {
    alignItems: 'center',
  },
  tempLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  tempValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  progressItem: {
    marginBottom: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  progressPercent: {
    fontSize: 14,
    color: '#666',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1976d2',
    borderRadius: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    marginTop: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#999',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
});
