import * as ExpoLocation from 'expo-location';
import { Location } from '../models/Hunt';

class LocationService {
  async requestPermissions() {
    const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Location permission not granted');
    }
    return true;
  }

  async getCurrentLocation() {
    try {
      await this.requestPermissions();

      const location = await ExpoLocation.getCurrentPositionAsync({
        accuracy: ExpoLocation.Accuracy.High
      });

      const { latitude, longitude } = location.coords;

      // Get address from coordinates
      let address = '';
      let name = '';
      try {
        const reverseGeocode = await ExpoLocation.reverseGeocodeAsync({
          latitude,
          longitude
        });

        if (reverseGeocode.length > 0) {
          const addr = reverseGeocode[0];
          address = `${addr.city || ''}, ${addr.region || ''} ${addr.postalCode || ''}`.trim();
          name = addr.name || addr.street || '';
        }
      } catch (error) {
        console.log('Reverse geocoding failed:', error);
      }

      return new Location(latitude, longitude, address, name);
    } catch (error) {
      console.error('Error getting location:', error);
      throw error;
    }
  }

  // Format coordinates for display
  formatCoordinates(latitude, longitude) {
    const latDir = latitude >= 0 ? 'N' : 'S';
    const lonDir = longitude >= 0 ? 'E' : 'W';
    return `${Math.abs(latitude).toFixed(5)}°${latDir}, ${Math.abs(longitude).toFixed(5)}°${lonDir}`;
  }
}

export default new LocationService();
