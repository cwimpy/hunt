import SunCalc from 'suncalc';
import { Solunar } from '../models/Hunt';

class SolunarService {
  calculateSolunar(latitude, longitude, date = new Date()) {
    // Get sun times
    const sunTimes = SunCalc.getTimes(date, latitude, longitude);

    // Get moon times
    const moonTimes = SunCalc.getMoonTimes(date, latitude, longitude);

    // Get moon illumination
    const moonIllumination = SunCalc.getMoonIllumination(date);

    // Calculate major and minor feeding periods
    const { majorPeriods, minorPeriods } = this.calculateFeedingPeriods(
      date,
      sunTimes,
      moonTimes,
      latitude,
      longitude
    );

    // Calculate activity rating (1-10)
    const rating = this.calculateActivityRating(moonIllumination.phase, majorPeriods, minorPeriods);

    return new Solunar({
      sunrise: sunTimes.sunrise,
      sunset: sunTimes.sunset,
      moonrise: moonTimes.rise,
      moonset: moonTimes.set,
      moonPhase: moonIllumination.phase,
      moonIllumination: moonIllumination.fraction,
      majorPeriods,
      minorPeriods,
      rating
    });
  }

  calculateFeedingPeriods(date, sunTimes, moonTimes, latitude, longitude) {
    const majorPeriods = [];
    const minorPeriods = [];

    // Major periods occur during moonrise and moonset (approximately 2 hours each)
    if (moonTimes.rise) {
      majorPeriods.push({
        start: new Date(moonTimes.rise.getTime() - 60 * 60 * 1000),
        end: new Date(moonTimes.rise.getTime() + 60 * 60 * 1000),
        type: 'moonrise'
      });
    }

    if (moonTimes.set) {
      majorPeriods.push({
        start: new Date(moonTimes.set.getTime() - 60 * 60 * 1000),
        end: new Date(moonTimes.set.getTime() + 60 * 60 * 1000),
        type: 'moonset'
      });
    }

    // Minor periods occur during sunrise and sunset (approximately 1.5 hours each)
    if (sunTimes.sunrise) {
      minorPeriods.push({
        start: new Date(sunTimes.sunrise.getTime() - 45 * 60 * 1000),
        end: new Date(sunTimes.sunrise.getTime() + 45 * 60 * 1000),
        type: 'sunrise'
      });
    }

    if (sunTimes.sunset) {
      minorPeriods.push({
        start: new Date(sunTimes.sunset.getTime() - 45 * 60 * 1000),
        end: new Date(sunTimes.sunset.getTime() + 45 * 60 * 1000),
        type: 'sunset'
      });
    }

    // Calculate moon transit (overhead and underfoot) for additional major periods
    const moonPosition = SunCalc.getMoonPosition(date, latitude, longitude);
    const transitTime = this.calculateMoonTransit(date, latitude, longitude);

    if (transitTime.overhead) {
      majorPeriods.push({
        start: new Date(transitTime.overhead.getTime() - 60 * 60 * 1000),
        end: new Date(transitTime.overhead.getTime() + 60 * 60 * 1000),
        type: 'moon overhead'
      });
    }

    if (transitTime.underfoot) {
      majorPeriods.push({
        start: new Date(transitTime.underfoot.getTime() - 60 * 60 * 1000),
        end: new Date(transitTime.underfoot.getTime() + 60 * 60 * 1000),
        type: 'moon underfoot'
      });
    }

    return { majorPeriods, minorPeriods };
  }

  calculateMoonTransit(date, latitude, longitude) {
    // Find when moon is at highest point (transit) and lowest point
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    let maxAltitude = -Infinity;
    let minAltitude = Infinity;
    let overhead = null;
    let underfoot = null;

    // Check moon position every 15 minutes throughout the day
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const checkTime = new Date(startOfDay);
        checkTime.setHours(hour, minute);

        const moonPos = SunCalc.getMoonPosition(checkTime, latitude, longitude);

        if (moonPos.altitude > maxAltitude) {
          maxAltitude = moonPos.altitude;
          overhead = checkTime;
        }

        if (moonPos.altitude < minAltitude) {
          minAltitude = moonPos.altitude;
          underfoot = checkTime;
        }
      }
    }

    return { overhead, underfoot };
  }

  calculateActivityRating(moonPhase, majorPeriods, minorPeriods) {
    let rating = 5; // Base rating

    // New moon and full moon periods are best (add up to 3 points)
    const phaseScore = 1 - Math.abs(moonPhase - 0.5) * 2; // Peaks at 0 (new) and 1 (full)
    rating += phaseScore * 3;

    // More feeding periods = better (add up to 2 points)
    const periodScore = Math.min((majorPeriods.length + minorPeriods.length * 0.5) / 4, 1);
    rating += periodScore * 2;

    return Math.round(Math.max(1, Math.min(10, rating)));
  }

  formatTime(date) {
    if (!date || !(date instanceof Date) || isNaN(date)) {
      return 'N/A';
    }
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }

  isActiveNow(majorPeriods, minorPeriods) {
    const now = new Date();

    const inMajor = majorPeriods.some(period =>
      now >= period.start && now <= period.end
    );

    const inMinor = minorPeriods.some(period =>
      now >= period.start && now <= period.end
    );

    return { inMajor, inMinor };
  }
}

export default new SolunarService();
