import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const { width } = Dimensions.get('window');

export default function HuntMap({ location, height = 200 }) {
  if (!location || !location.latitude || !location.longitude) {
    return null;
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
});
