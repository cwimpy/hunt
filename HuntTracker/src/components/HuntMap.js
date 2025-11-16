import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Dimensions, Text } from 'react-native';

const { width } = Dimensions.get('window');

export default function HuntMap({ location, height = 200 }) {
  const [MapView, setMapView] = useState(null);
  const [Marker, setMarker] = useState(null);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    // Try to load react-native-maps
    // This will work in custom dev builds but not in Expo Go
    const loadMaps = async () => {
      try {
        const maps = await import('react-native-maps');
        setMapView(() => maps.default);
        setMarker(() => maps.Marker);
      } catch (error) {
        console.log('Maps not available in Expo Go, showing coordinates instead');
        setMapError(true);
      }
    };
    loadMaps();
  }, []);

  if (!location || !location.latitude || !location.longitude) {
    return null;
  }

  // Show coordinates if maps aren't available (Expo Go)
  if (mapError || !MapView) {
    return (
      <View style={[styles.container, styles.fallbackContainer, { height }]}>
        <Text style={styles.fallbackTitle}>{location.name || "Hunt Location"}</Text>
        <Text style={styles.fallbackText}>
          📍 {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
        </Text>
        {location.address && (
          <Text style={styles.fallbackAddress}>{location.address}</Text>
        )}
        <Text style={styles.fallbackNote}>
          Maps require a custom build. Showing coordinates.
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { height }]}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation
        showsMyLocationButton
      >
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title={location.name || "Hunt Location"}
          description={location.address}
          pinColor="#2e7d32"
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width - 32,
    borderRadius: 12,
    overflow: 'hidden',
    marginVertical: 8,
  },
  map: {
    flex: 1,
  },
  fallbackContainer: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2e7d32',
    marginBottom: 8,
  },
  fallbackText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
    fontFamily: 'monospace',
  },
  fallbackAddress: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  fallbackNote: {
    fontSize: 11,
    color: '#999',
    fontStyle: 'italic',
    marginTop: 4,
  },
});
