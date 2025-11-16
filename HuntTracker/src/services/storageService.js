import AsyncStorage from '@react-native-async-storage/async-storage';
import { Hunt } from '../models/Hunt';

class StorageService {
  constructor() {
    this.HUNTS_KEY = '@hunt_tracker_hunts';
    this.SETTINGS_KEY = '@hunt_tracker_settings';
  }

  // Hunt CRUD operations
  async saveHunt(hunt) {
    try {
      const hunts = await this.getAllHunts();
      const existingIndex = hunts.findIndex(h => h.id === hunt.id);

      if (existingIndex >= 0) {
        // Update existing hunt
        hunt.updatedAt = new Date();
        hunts[existingIndex] = hunt;
      } else {
        // Add new hunt
        hunts.push(hunt);
      }

      await AsyncStorage.setItem(this.HUNTS_KEY, JSON.stringify(hunts.map(h => h.toJSON())));
      return hunt;
    } catch (error) {
      console.error('Error saving hunt:', error);
      throw error;
    }
  }

  async getAllHunts() {
    try {
      const huntsJson = await AsyncStorage.getItem(this.HUNTS_KEY);
      if (!huntsJson) return [];

      const huntsData = JSON.parse(huntsJson);
      return huntsData.map(data => Hunt.fromJSON(data));
    } catch (error) {
      console.error('Error getting hunts:', error);
      return [];
    }
  }

  async getHunt(id) {
    try {
      const hunts = await this.getAllHunts();
      return hunts.find(h => h.id === id);
    } catch (error) {
      console.error('Error getting hunt:', error);
      return null;
    }
  }

  async deleteHunt(id) {
    try {
      const hunts = await this.getAllHunts();
      const filtered = hunts.filter(h => h.id !== id);
      await AsyncStorage.setItem(this.HUNTS_KEY, JSON.stringify(filtered.map(h => h.toJSON())));
      return true;
    } catch (error) {
      console.error('Error deleting hunt:', error);
      return false;
    }
  }

  async getSuccessfulHunts() {
    try {
      const hunts = await this.getAllHunts();
      return hunts.filter(h => h.success);
    } catch (error) {
      console.error('Error getting successful hunts:', error);
      return [];
    }
  }

  async getHuntsByDateRange(startDate, endDate) {
    try {
      const hunts = await this.getAllHunts();
      return hunts.filter(h => h.date >= startDate && h.date <= endDate);
    } catch (error) {
      console.error('Error getting hunts by date range:', error);
      return [];
    }
  }

  // Settings
  async saveSetting(key, value) {
    try {
      const settings = await this.getSettings();
      settings[key] = value;
      await AsyncStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
      return true;
    } catch (error) {
      console.error('Error saving setting:', error);
      return false;
    }
  }

  async getSettings() {
    try {
      const settingsJson = await AsyncStorage.getItem(this.SETTINGS_KEY);
      return settingsJson ? JSON.parse(settingsJson) : {};
    } catch (error) {
      console.error('Error getting settings:', error);
      return {};
    }
  }

  async clearAllData() {
    try {
      await AsyncStorage.multiRemove([this.HUNTS_KEY, this.SETTINGS_KEY]);
      return true;
    } catch (error) {
      console.error('Error clearing data:', error);
      return false;
    }
  }
}

export default new StorageService();
