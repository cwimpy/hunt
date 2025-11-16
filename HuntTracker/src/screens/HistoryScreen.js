import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import storageService from '../services/storageService';

export default function HistoryScreen({ navigation }) {
  const [hunts, setHunts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      loadHunts();
    }, [])
  );

  const loadHunts = async () => {
    try {
      const allHunts = await storageService.getAllHunts();
      // Sort by date descending (newest first)
      allHunts.sort((a, b) => b.date - a.date);
      setHunts(allHunts);
      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.error('Error loading hunts:', error);
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadHunts();
  };

  const renderHuntItem = ({ item }) => (
    <TouchableOpacity
      style={styles.huntCard}
      onPress={() => navigation.navigate('HuntDetails', { huntId: item.id })}
    >
      <View style={styles.huntHeader}>
        <View style={styles.huntHeaderLeft}>
          <Text style={styles.huntDate}>
            {item.date.toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </Text>
          <Text style={styles.huntTime}>
            {item.date.toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit'
            })}
          </Text>
        </View>
        {item.success && (
          <View style={styles.successBadge}>
            <Ionicons name="trophy" size={20} color="#f57c00" />
            <Text style={styles.successText}>Success</Text>
          </View>
        )}
      </View>

      {item.species && (
        <Text style={styles.species}>{item.species}</Text>
      )}

      {item.location && (
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={14} color="#666" />
          <Text style={styles.location}>{item.location.address || 'Unknown location'}</Text>
        </View>
      )}

      <View style={styles.conditionsRow}>
        {item.weather && (
          <>
            <View style={styles.condition}>
              <Ionicons name="thermometer-outline" size={14} color="#666" />
              <Text style={styles.conditionText}>{item.weather.temperature}°F</Text>
            </View>
            <View style={styles.condition}>
              <Ionicons name="cloud-outline" size={14} color="#666" />
              <Text style={styles.conditionText}>{item.weather.conditions}</Text>
            </View>
          </>
        )}
        {item.solunar && (
          <View style={styles.condition}>
            <Ionicons name="moon-outline" size={14} color="#666" />
            <Text style={styles.conditionText}>{item.solunar.getMoonPhaseName()}</Text>
          </View>
        )}
      </View>

      {item.notes && (
        <Text style={styles.notes} numberOfLines={2}>
          {item.notes}
        </Text>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2e7d32" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Hunt History</Text>
        <Text style={styles.headerSubtitle}>
          {hunts.length} hunt{hunts.length !== 1 ? 's' : ''} logged
          {hunts.filter(h => h.success).length > 0 &&
            ` • ${hunts.filter(h => h.success).length} successful`
          }
        </Text>
      </View>

      {hunts.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="calendar-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No hunts logged yet</Text>
          <Text style={styles.emptySubtext}>
            Tap "Log New Hunt" on the Today tab to get started
          </Text>
        </View>
      ) : (
        <FlatList
          data={hunts}
          renderItem={renderHuntItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
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
  listContent: {
    padding: 16,
  },
  huntCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  huntHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  huntHeaderLeft: {
    flex: 1,
  },
  huntDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  huntTime: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  successBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3e0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  successText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#f57c00',
    marginLeft: 4,
  },
  species: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2e7d32',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  conditionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  condition: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  conditionText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 4,
  },
  notes: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
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
