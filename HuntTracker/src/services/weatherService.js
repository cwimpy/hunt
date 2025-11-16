import axios from 'axios';
import { Weather } from '../models/Hunt';

class WeatherService {
  constructor() {
    this.baseUrl = 'https://api.open-meteo.com/v1/forecast';
  }

  async getWeather(latitude, longitude, date = new Date()) {
    try {
      const dateStr = date.toISOString().split('T')[0];

      const params = {
        latitude,
        longitude,
        current: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m,visibility',
        daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max',
        temperature_unit: 'fahrenheit',
        wind_speed_unit: 'mph',
        precipitation_unit: 'inch',
        timezone: 'auto'
      };

      const response = await axios.get(this.baseUrl, { params });
      const data = response.data;

      // Map weather codes to descriptions
      const weatherCode = data.current.weather_code;
      const { conditions, description } = this.getWeatherDescription(weatherCode);

      return new Weather({
        temperature: Math.round(data.current.temperature_2m),
        feelsLike: Math.round(data.current.apparent_temperature),
        conditions,
        description,
        windSpeed: Math.round(data.current.wind_speed_10m),
        windDirection: this.getWindDirection(data.current.wind_direction_10m),
        pressure: data.current.pressure_msl,
        humidity: data.current.relative_humidity_2m,
        cloudCover: data.current.cloud_cover,
        precipitation: data.current.precipitation || 0,
        visibility: data.current.visibility ? Math.round(data.current.visibility / 1609.34) : null // Convert m to miles
      });
    } catch (error) {
      console.error('Error fetching weather:', error);
      throw error;
    }
  }

  getWeatherDescription(code) {
    const weatherCodes = {
      0: { conditions: 'Clear', description: 'Clear sky' },
      1: { conditions: 'Mostly Clear', description: 'Mainly clear' },
      2: { conditions: 'Partly Cloudy', description: 'Partly cloudy' },
      3: { conditions: 'Overcast', description: 'Overcast' },
      45: { conditions: 'Foggy', description: 'Fog' },
      48: { conditions: 'Foggy', description: 'Depositing rime fog' },
      51: { conditions: 'Drizzle', description: 'Light drizzle' },
      53: { conditions: 'Drizzle', description: 'Moderate drizzle' },
      55: { conditions: 'Drizzle', description: 'Dense drizzle' },
      61: { conditions: 'Rain', description: 'Slight rain' },
      63: { conditions: 'Rain', description: 'Moderate rain' },
      65: { conditions: 'Rain', description: 'Heavy rain' },
      71: { conditions: 'Snow', description: 'Slight snow' },
      73: { conditions: 'Snow', description: 'Moderate snow' },
      75: { conditions: 'Snow', description: 'Heavy snow' },
      77: { conditions: 'Snow', description: 'Snow grains' },
      80: { conditions: 'Rain Showers', description: 'Slight rain showers' },
      81: { conditions: 'Rain Showers', description: 'Moderate rain showers' },
      82: { conditions: 'Rain Showers', description: 'Violent rain showers' },
      85: { conditions: 'Snow Showers', description: 'Slight snow showers' },
      86: { conditions: 'Snow Showers', description: 'Heavy snow showers' },
      95: { conditions: 'Thunderstorm', description: 'Thunderstorm' },
      96: { conditions: 'Thunderstorm', description: 'Thunderstorm with slight hail' },
      99: { conditions: 'Thunderstorm', description: 'Thunderstorm with heavy hail' }
    };

    return weatherCodes[code] || { conditions: 'Unknown', description: 'Unknown conditions' };
  }

  getWindDirection(degrees) {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  }
}

export default new WeatherService();
