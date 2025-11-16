/**
 * Hunt Data Model
 * Represents a single hunting session with all relevant data
 */

export class Hunt {
  constructor({
    id = null,
    date = new Date(),
    location = null,
    weather = null,
    solunar = null,
    species = '',
    success = false,
    notes = '',
    photos = [],
    tags = [],
    createdAt = new Date(),
    updatedAt = new Date()
  } = {}) {
    this.id = id || this.generateId();
    this.date = date instanceof Date ? date : new Date(date);
    this.location = location;
    this.weather = weather;
    this.solunar = solunar;
    this.species = species;
    this.success = success;
    this.notes = notes;
    this.photos = photos;
    this.tags = tags;
    this.createdAt = createdAt instanceof Date ? createdAt : new Date(createdAt);
    this.updatedAt = updatedAt instanceof Date ? updatedAt : new Date(updatedAt);
  }

  generateId() {
    return `hunt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  toJSON() {
    return {
      id: this.id,
      date: this.date.toISOString(),
      location: this.location,
      weather: this.weather,
      solunar: this.solunar,
      species: this.species,
      success: this.success,
      notes: this.notes,
      photos: this.photos,
      tags: this.tags,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString()
    };
  }

  static fromJSON(json) {
    return new Hunt({
      ...json,
      date: new Date(json.date),
      createdAt: new Date(json.createdAt),
      updatedAt: new Date(json.updatedAt)
    });
  }
}

/**
 * Location data structure
 */
export class Location {
  constructor(latitude, longitude, address = '', name = '') {
    this.latitude = latitude;
    this.longitude = longitude;
    this.address = address;
    this.name = name;
  }
}

/**
 * Weather data structure
 */
export class Weather {
  constructor({
    temperature,
    feelsLike,
    conditions,
    description,
    windSpeed,
    windDirection,
    pressure,
    humidity,
    cloudCover,
    precipitation,
    visibility
  }) {
    this.temperature = temperature;
    this.feelsLike = feelsLike;
    this.conditions = conditions;
    this.description = description;
    this.windSpeed = windSpeed;
    this.windDirection = windDirection;
    this.pressure = pressure;
    this.humidity = humidity;
    this.cloudCover = cloudCover;
    this.precipitation = precipitation;
    this.visibility = visibility;
  }
}

/**
 * Solunar data structure
 */
export class Solunar {
  constructor({
    sunrise,
    sunset,
    moonrise,
    moonset,
    moonPhase,
    moonIllumination,
    majorPeriods = [],
    minorPeriods = [],
    rating
  }) {
    this.sunrise = sunrise;
    this.sunset = sunset;
    this.moonrise = moonrise;
    this.moonset = moonset;
    this.moonPhase = moonPhase;
    this.moonIllumination = moonIllumination;
    this.majorPeriods = majorPeriods;
    this.minorPeriods = minorPeriods;
    this.rating = rating;
  }

  getMoonPhaseName() {
    const phase = this.moonPhase;
    if (phase < 0.05) return 'New Moon';
    if (phase < 0.25) return 'Waxing Crescent';
    if (phase < 0.30) return 'First Quarter';
    if (phase < 0.50) return 'Waxing Gibbous';
    if (phase < 0.55) return 'Full Moon';
    if (phase < 0.75) return 'Waning Gibbous';
    if (phase < 0.80) return 'Last Quarter';
    if (phase < 1.00) return 'Waning Crescent';
    return 'New Moon';
  }
}
