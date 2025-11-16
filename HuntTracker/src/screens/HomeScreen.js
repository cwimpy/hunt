import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import locationService from '../services/locationService';
import weatherService from '../services/weatherService';
import solunarService from '../services/solunarService';
import patternService from '../services/patternService';

export default function HomeScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);
  const [solunar, setSolunar] = useState(null);
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setError(null);

      // Get current location
      const loc = await locationService.getCurrentLocation();
      setLocation(loc);

      // Get weather
      const w = await weatherService.getWeather(loc.latitude, loc.longitude);
      setWeather(w);

      // Get solunar data
      const sol = solunarService.calculateSolunar(loc.latitude, loc.longitude);
      setSolunar(sol);

      // Check for pattern matches with current conditions
      const currentConditions = {
        date: new Date(),
        location: loc,
        weather: w,
        solunar: sol
      };
      const m = await patternService.checkForMatches(currentConditions);
      setMatches(m);

      setLoading(false);
      setRefreshing(false);
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err.message);
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2e7d32" />
        <Text style={styles.loadingText}>Loading current conditions...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Ionicons name="alert-circle" size={48} color="#d32f2f" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadData}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { inMajor, inMinor } = solunar ? solunarService.isActiveNow(solunar.majorPeriods, solunar.minorPeriods) : { inMajor: false, inMinor: false };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Hunt Tracker</Text>
        <Text style={styles.headerSubtitle}>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Text>
      </View>

      {/* Quick Actions */}
      <TouchableOpacity
        style={styles.newHuntButton}
        onPress={() => navigation.navigate('NewHunt', { location, weather, solunar })}
      >
        <Ionicons name="add-circle" size={24} color="#fff" />
        <Text style={styles.newHuntButtonText}>Log New Hunt</Text>
      </TouchableOpacity>

      {/* Activity Status */}
      {(inMajor || inMinor) && (
        <View style={[styles.card, styles.activeAlert]}>
          <Ionicons name="time" size={24} color="#fff" />
          <View style={styles.activeAlertText}>
            <Text style={styles.activeAlertTitle}>
              {inMajor ? 'MAJOR FEEDING PERIOD!' : 'Minor Feeding Period'}
            </Text>
            <Text style={styles.activeAlertSubtitle}>Wildlife activity is high right now</Text>
          </View>
        </View>
      )}

      {/* Pattern Matches */}
      {matches.length > 0 && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="trophy" size={20} color="#f57c00" />
            <Text style={styles.cardTitle}>Similar to Past Success!</Text>
          </View>
          <Text style={styles.matchText}>
            Conditions are similar to {matches[0].hunt.date.toLocaleDateString()} when you successfully hunted {matches[0].hunt.species || 'game'}.
          </Text>
          <Text style={styles.matchFactors}>
            Matching: {matches[0].matchingFactors.join(', ')}
          </Text>
        </View>
      )}

      {/* Location */}
      {location && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="location" size={20} color="#2e7d32" />
            <Text style={styles.cardTitle}>Location</Text>
          </View>
          <Text style={styles.cardText}>{location.address || 'Unknown'}</Text>
          <Text style={styles.cardSubtext}>
            {locationService.formatCoordinates(location.latitude, location.longitude)}
          </Text>
        </View>
      )}

      {/* Weather */}
      {weather && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="cloud" size={20} color="#1976d2" />
            <Text style={styles.cardTitle}>Weather</Text>
          </View>
          <View style={styles.weatherMain}>
            <Text style={styles.temperature}>{weather.temperature}°F</Text>
            <View>
              <Text style={styles.conditions}>{weather.conditions}</Text>
              <Text style={styles.feelsLike}>Feels like {weather.feelsLike}°F</Text>
            </View>
          </View>
          <View style={styles.weatherDetails}>
            <View style={styles.weatherDetail}>
              <Ionicons name="wind" size={16} color="#666" />
              <Text style={styles.weatherDetailText}>{weather.windSpeed} mph {weather.windDirection}</Text>
            </View>
            <View style={styles.weatherDetail}>
              <Ionicons name="water" size={16} color="#666" />
              <Text style={styles.weatherDetailText}>{weather.humidity}%</Text>
            </View>
            <View style={styles.weatherDetail}>
              <Ionicons name="speedometer" size={16} color="#666" />
              <Text style={styles.weatherDetailText}>{weather.pressure} inHg</Text>
            </View>
          </View>
        </View>
      )}

      {/* Solunar */}
      {solunar && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="moon" size={20} color="#7b1fa2" />
            <Text style={styles.cardTitle}>Solunar Activity</Text>
          </View>
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingLabel}>Activity Rating</Text>
            <Text style={styles.rating}>{solunar.rating}/10</Text>
          </View>
          <View style={styles.moonInfo}>
            <Text style={styles.moonPhase}>{solunar.getMoonPhaseName()}</Text>
            <Text style={styles.moonIllumination}>{Math.round(solunar.moonIllumination * 100)}% illuminated</Text>
          </View>

          <View style={styles.timesSection}>
            <Text style={styles.timesTitle}>Sun Times</Text>
            <View style={styles.timeRow}>
              <Text style={styles.timeLabel}>Sunrise:</Text>
              <Text style={styles.timeValue}>{solunarService.formatTime(solunar.sunrise)}</Text>
            </View>
            <View style={styles.timeRow}>
              <Text style={styles.timeLabel}>Sunset:</Text>
              <Text style={styles.timeValue}>{solunarService.formatTime(solunar.sunset)}</Text>
            </View>
          </View>

          {solunar.majorPeriods.length > 0 && (
            <View style={styles.timesSection}>
              <Text style={styles.timesTitle}>Major Feeding Periods</Text>
              {solunar.majorPeriods.map((period, index) => (
                <View key={index} style={styles.timeRow}>
                  <Text style={styles.timeLabel}>{period.type}:</Text>
                  <Text style={styles.timeValue}>
                    {solunarService.formatTime(period.start)} - {solunarService.formatTime(period.end)}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {solunar.minorPeriods.length > 0 && (
            <View style={styles.timesSection}>
              <Text style={styles.timesTitle}>Minor Feeding Periods</Text>
              {solunar.minorPeriods.map((period, index) => (
                <View key={index} style={styles.timeRow}>
                  <Text style={styles.timeLabel}>{period.type}:</Text>
                  <Text style={styles.timeValue}>
                    {solunarService.formatTime(period.start)} - {solunarService.formatTime(period.end)}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}
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
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#2e7d32',
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
  newHuntButton: {
    backgroundColor: '#f57c00',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  newHuntButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  activeAlert: {
    backgroundColor: '#2e7d32',
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeAlertText: {
    flex: 1,
    marginLeft: 12,
  },
  activeAlertTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  activeAlertSubtitle: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
  },
  card: {
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 0,
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
  matchText: {
    fontSize: 15,
    color: '#333',
    marginBottom: 8,
  },
  matchFactors: {
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
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
  weatherDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 12,
  },
  weatherDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weatherDetailText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
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
    marginBottom: 16,
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
  timesSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  timesTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  timeLabel: {
    fontSize: 14,
    color: '#666',
  },
  timeValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
});
