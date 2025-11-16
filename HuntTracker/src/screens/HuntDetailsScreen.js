import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import storageService from '../services/storageService';
import locationService from '../services/locationService';
import solunarService from '../services/solunarService';

export default function HuntDetailsScreen({ navigation, route }) {
  const [hunt, setHunt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHunt();
  }, []);

  const loadHunt = async () => {
    try {
      const { huntId } = route.params;
      const loadedHunt = await storageService.getHunt(huntId);
      setHunt(loadedHunt);
      setLoading(false);
    } catch (error) {
      console.error('Error loading hunt:', error);
      setLoading(false);
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      'Delete Hunt',
      'Are you sure you want to delete this hunt? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: deleteHunt
        }
      ]
    );
  };

  const deleteHunt = async () => {
    try {
      await storageService.deleteHunt(hunt.id);
      navigation.goBack();
    } catch (error) {
      console.error('Error deleting hunt:', error);
      Alert.alert('Error', 'Failed to delete hunt');
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2e7d32" />
      </View>
    );
  }

  if (!hunt) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Hunt not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.headerCard}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.dateText}>
              {hunt.date.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </Text>
            <Text style={styles.timeText}>
              {hunt.date.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit'
              })}
            </Text>
          </View>
          {hunt.success && (
            <View style={styles.successBadge}>
              <Ionicons name="trophy" size={32} color="#f57c00" />
            </View>
          )}
        </View>

        {hunt.species && (
          <Text style={styles.species}>{hunt.species}</Text>
        )}
      </View>

      {/* Location */}
      {hunt.location && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="location" size={20} color="#2e7d32" />
            <Text style={styles.cardTitle}>Location</Text>
          </View>
          <Text style={styles.cardText}>{hunt.location.address || 'Unknown'}</Text>
          <Text style={styles.cardSubtext}>
            {locationService.formatCoordinates(hunt.location.latitude, hunt.location.longitude)}
          </Text>
        </View>
      )}

      {/* Weather */}
      {hunt.weather && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="cloud" size={20} color="#1976d2" />
            <Text style={styles.cardTitle}>Weather Conditions</Text>
          </View>
          <View style={styles.weatherMain}>
            <Text style={styles.temperature}>{hunt.weather.temperature}°F</Text>
            <View>
              <Text style={styles.conditions}>{hunt.weather.conditions}</Text>
              <Text style={styles.feelsLike}>Feels like {hunt.weather.feelsLike}°F</Text>
            </View>
          </View>
          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Wind</Text>
              <Text style={styles.detailValue}>{hunt.weather.windSpeed} mph</Text>
              <Text style={styles.detailSubvalue}>{hunt.weather.windDirection}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Humidity</Text>
              <Text style={styles.detailValue}>{hunt.weather.humidity}%</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Pressure</Text>
              <Text style={styles.detailValue}>{hunt.weather.pressure}</Text>
              <Text style={styles.detailSubvalue}>inHg</Text>
            </View>
          </View>
        </View>
      )}

      {/* Solunar */}
      {hunt.solunar && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="moon" size={20} color="#7b1fa2" />
            <Text style={styles.cardTitle}>Solunar Data</Text>
          </View>
          <View style={styles.ratingBox}>
            <Text style={styles.ratingLabel}>Activity Rating</Text>
            <Text style={styles.rating}>{hunt.solunar.rating}/10</Text>
          </View>
          <View style={styles.moonInfo}>
            <Text style={styles.moonPhase}>{hunt.solunar.getMoonPhaseName()}</Text>
            <Text style={styles.moonIllumination}>
              {Math.round(hunt.solunar.moonIllumination * 100)}% illuminated
            </Text>
          </View>
          <View style={styles.timesGrid}>
            <View style={styles.timeItem}>
              <Text style={styles.timeLabel}>Sunrise</Text>
              <Text style={styles.timeValue}>{solunarService.formatTime(hunt.solunar.sunrise)}</Text>
            </View>
            <View style={styles.timeItem}>
              <Text style={styles.timeLabel}>Sunset</Text>
              <Text style={styles.timeValue}>{solunarService.formatTime(hunt.solunar.sunset)}</Text>
            </View>
          </View>
        </View>
      )}

      {/* Notes */}
      {hunt.notes && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="document-text" size={20} color="#666" />
            <Text style={styles.cardTitle}>Notes</Text>
          </View>
          <Text style={styles.notesText}>{hunt.notes}</Text>
        </View>
      )}

      {/* Delete Button */}
      <TouchableOpacity style={styles.deleteButton} onPress={confirmDelete}>
        <Ionicons name="trash" size={20} color="#d32f2f" />
        <Text style={styles.deleteButtonText}>Delete Hunt</Text>
      </TouchableOpacity>

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
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
  },
  headerCard: {
    backgroundColor: '#2e7d32',
    padding: 20,
    marginBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  dateText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  timeText: {
    fontSize: 16,
    color: '#fff',
    marginTop: 4,
    opacity: 0.9,
  },
  successBadge: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
  },
  species: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
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
  cardText: {
    fontSize: 16,
    color: '#333',
  },
  cardSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  weatherMain: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  temperature: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1976d2',
    marginRight: 16,
  },
  conditions: {
    fontSize: 18,
    color: '#333',
    fontWeight: '600',
  },
  feelsLike: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 12,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  detailSubvalue: {
    fontSize: 12,
    color: '#666',
  },
  ratingBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  ratingLabel: {
    fontSize: 16,
    color: '#666',
  },
  rating: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7b1fa2',
  },
  moonInfo: {
    marginBottom: 12,
  },
  moonPhase: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  moonIllumination: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  timesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 12,
  },
  timeItem: {
    alignItems: 'center',
  },
  timeLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  timeValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  notesText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: '#d32f2f',
    borderRadius: 12,
  },
  deleteButtonText: {
    color: '#d32f2f',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
