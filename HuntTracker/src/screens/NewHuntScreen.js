import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Switch
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Hunt } from '../models/Hunt';
import locationService from '../services/locationService';
import weatherService from '../services/weatherService';
import solunarService from '../services/solunarService';
import storageService from '../services/storageService';

import HuntMap from '../components/HuntMap';
export default function NewHuntScreen({ navigation, route }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Auto-imported data
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);
  const [solunar, setSolunar] = useState(null);

  // Editable fields
  const [species, setSpecies] = useState('');
  const [success, setSuccess] = useState(false);
  const [notes, setNotes] = useState('');
  const [customLocation, setCustomLocation] = useState('');

  useEffect(() => {
    autoImportData();
  }, []);

  const autoImportData = async () => {
    try {
      // Check if data was passed from HomeScreen
      if (route.params?.location && route.params?.weather && route.params?.solunar) {
        setLocation(route.params.location);
        setWeather(route.params.weather);
        setSolunar(route.params.solunar);
        setCustomLocation(route.params.location.address || '');
      } else {
        // Auto-import fresh data
        const loc = await locationService.getCurrentLocation();
        setLocation(loc);
        setCustomLocation(loc.address || '');

        const w = await weatherService.getWeather(loc.latitude, loc.longitude);
        setWeather(w);

        const sol = solunarService.calculateSolunar(loc.latitude, loc.longitude);
        setSolunar(sol);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error auto-importing data:', error);
      Alert.alert('Error', 'Failed to import data. Please try again.');
      setLoading(false);
    }
  };

  const saveHunt = async () => {
    if (!location || !weather || !solunar) {
      Alert.alert('Error', 'Missing required data. Please retry importing.');
      return;
    }

    setSaving(true);

    try {
      const hunt = new Hunt({
        date: new Date(),
        location: {
          ...location,
          address: customLocation || location.address
        },
        weather,
        solunar,
        species,
        success,
        notes
      });

      await storageService.saveHunt(hunt);

      Alert.alert(
        'Success!',
        'Hunt logged successfully',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      console.error('Error saving hunt:', error);
      Alert.alert('Error', 'Failed to save hunt. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2e7d32" />
        <Text style={styles.loadingText}>Importing current conditions...</Text>
        <Text style={styles.loadingSubtext}>GPS, Weather, Solunar Data</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Auto-Imported Data</Text>
        <Text style={styles.sectionSubtitle}>Captured at {new Date().toLocaleTimeString()}</Text>
      </View>

      {/* Location */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="location" size={20} color="#2e7d32" />
          <Text style={styles.cardTitle}>Location</Text>
        </View>
        <TextInput
          style={styles.input}
          value={customLocation}
          onChangeText={setCustomLocation}
          placeholder="Enter location name..."
          placeholderTextColor="#999"
        />
        <Text style={styles.coordinates}>
          {location && locationService.formatCoordinates(location.latitude, location.longitude)}
        </Text>
        {location && <HuntMap location={location} height={180} />}
      </View>

      {/* Weather */}
      {weather && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="cloud" size={20} color="#1976d2" />
            <Text style={styles.cardTitle}>Weather Conditions</Text>
          </View>
          <View style={styles.weatherRow}>
            <Text style={styles.label}>Temperature:</Text>
            <Text style={styles.value}>{weather.temperature}°F (Feels like {weather.feelsLike}°F)</Text>
          </View>
          <View style={styles.weatherRow}>
            <Text style={styles.label}>Conditions:</Text>
            <Text style={styles.value}>{weather.description}</Text>
          </View>
          <View style={styles.weatherRow}>
            <Text style={styles.label}>Wind:</Text>
            <Text style={styles.value}>{weather.windSpeed} mph {weather.windDirection}</Text>
          </View>
          <View style={styles.weatherRow}>
            <Text style={styles.label}>Pressure:</Text>
            <Text style={styles.value}>{weather.pressure} inHg</Text>
          </View>
          <View style={styles.weatherRow}>
            <Text style={styles.label}>Humidity:</Text>
            <Text style={styles.value}>{weather.humidity}%</Text>
          </View>
        </View>
      )}

      {/* Solunar */}
      {solunar && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="moon" size={20} color="#7b1fa2" />
            <Text style={styles.cardTitle}>Solunar Data</Text>
          </View>
          <View style={styles.weatherRow}>
            <Text style={styles.label}>Activity Rating:</Text>
            <Text style={[styles.value, styles.rating]}>{solunar.rating}/10</Text>
          </View>
          <View style={styles.weatherRow}>
            <Text style={styles.label}>Moon Phase:</Text>
            <Text style={styles.value}>{solunar.getMoonPhaseName()} ({Math.round(solunar.moonIllumination * 100)}%)</Text>
          </View>
          <View style={styles.weatherRow}>
            <Text style={styles.label}>Sunrise/Sunset:</Text>
            <Text style={styles.value}>
              {solunarService.formatTime(solunar.sunrise)} / {solunarService.formatTime(solunar.sunset)}
            </Text>
          </View>
        </View>
      )}

      {/* Editable Fields */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hunt Details</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.fieldLabel}>Species</Text>
        <TextInput
          style={styles.input}
          value={species}
          onChangeText={setSpecies}
          placeholder="e.g., White-tailed Deer, Turkey, Duck..."
          placeholderTextColor="#999"
        />

        <View style={styles.successRow}>
          <Text style={styles.fieldLabel}>Successful Hunt?</Text>
          <Switch
            value={success}
            onValueChange={setSuccess}
            trackColor={{ false: '#ccc', true: '#81c784' }}
            thumbColor={success ? '#2e7d32' : '#f4f3f4'}
          />
        </View>

        <Text style={styles.fieldLabel}>Notes</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={notes}
          onChangeText={setNotes}
          placeholder="Add notes about stand location, animal behavior, conditions, etc..."
          placeholderTextColor="#999"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      {/* Save Button */}
      <TouchableOpacity
        style={[styles.saveButton, saving && styles.saveButtonDisabled]}
        onPress={saveHunt}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Ionicons name="checkmark-circle" size={24} color="#fff" />
            <Text style={styles.saveButtonText}>Save Hunt</Text>
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.cancelButtonText}>Cancel</Text>
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
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
    color: '#333',
    fontWeight: '600',
  },
  loadingSubtext: {
    marginTop: 4,
    fontSize: 14,
    color: '#666',
  },
  section: {
    padding: 16,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
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
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  coordinates: {
    marginTop: 8,
    fontSize: 12,
    color: '#666',
  },
  weatherRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  value: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },
  rating: {
    color: '#7b1fa2',
    fontWeight: 'bold',
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  successRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
  },
  saveButton: {
    backgroundColor: '#2e7d32',
    marginHorizontal: 16,
    marginTop: 8,
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
  saveButtonDisabled: {
    backgroundColor: '#a5d6a7',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  cancelButton: {
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
  },
});
