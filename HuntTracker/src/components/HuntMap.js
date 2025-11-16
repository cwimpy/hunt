import React from 'react';
import { StyleSheet, View, Dimensions, Text } from 'react-native';

const { width } = Dimensions.get('window');

export default function HuntMap({ location, height = 200 }) {
  if (!location || !location.latitude || !location.longitude) {
    return null;
  }

  // For now, always show coordinates fallback in Expo Go
  // Maps will work when you create a custom development build with EAS
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
        Maps require a custom development build
      </Text>
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
