import storageService from './storageService';

class PatternService {
  /**
   * Analyze successful hunts and find patterns
   */
  async analyzePatterns() {
    const successfulHunts = await storageService.getSuccessfulHunts();

    if (successfulHunts.length === 0) {
      return null;
    }

    const patterns = {
      moonPhases: this.analyzeMoonPhases(successfulHunts),
      temperatures: this.analyzeTemperatures(successfulHunts),
      weatherConditions: this.analyzeWeatherConditions(successfulHunts),
      timeOfYear: this.analyzeTimeOfYear(successfulHunts),
      timeOfDay: this.analyzeTimeOfDay(successfulHunts),
      windConditions: this.analyzeWindConditions(successfulHunts)
    };

    return patterns;
  }

  /**
   * Check if current conditions match past successful hunts
   */
  async checkForMatches(currentHunt) {
    const successfulHunts = await storageService.getSuccessfulHunts();

    if (successfulHunts.length === 0) {
      return [];
    }

    const matches = [];

    for (const pastHunt of successfulHunts) {
      const score = this.calculateSimilarityScore(currentHunt, pastHunt);

      if (score >= 0.7) { // 70% similarity threshold
        matches.push({
          hunt: pastHunt,
          score,
          matchingFactors: this.getMatchingFactors(currentHunt, pastHunt)
        });
      }
    }

    // Sort by score descending
    matches.sort((a, b) => b.score - a.score);

    return matches;
  }

  calculateSimilarityScore(hunt1, hunt2) {
    let score = 0;
    let factors = 0;

    // Time of year similarity (same month)
    if (hunt1.date.getMonth() === hunt2.date.getMonth()) {
      score += 0.2;
    }
    factors++;

    // Moon phase similarity (within 0.1)
    if (hunt1.solunar && hunt2.solunar) {
      const phaseDiff = Math.abs(hunt1.solunar.moonPhase - hunt2.solunar.moonPhase);
      if (phaseDiff < 0.1) {
        score += 0.2;
      }
      factors++;
    }

    // Temperature similarity (within 10 degrees)
    if (hunt1.weather && hunt2.weather) {
      const tempDiff = Math.abs(hunt1.weather.temperature - hunt2.weather.temperature);
      if (tempDiff <= 10) {
        score += 0.15;
      }
      factors++;

      // Weather conditions match
      if (hunt1.weather.conditions === hunt2.weather.conditions) {
        score += 0.15;
      }
      factors++;

      // Wind similarity (within 5 mph)
      const windDiff = Math.abs(hunt1.weather.windSpeed - hunt2.weather.windSpeed);
      if (windDiff <= 5) {
        score += 0.1;
      }
      factors++;

      // Pressure similarity (within 0.2 inHg)
      const pressureDiff = Math.abs(hunt1.weather.pressure - hunt2.weather.pressure);
      if (pressureDiff <= 0.2) {
        score += 0.1;
      }
      factors++;
    }

    // Solunar rating similarity
    if (hunt1.solunar && hunt2.solunar) {
      const ratingDiff = Math.abs(hunt1.solunar.rating - hunt2.solunar.rating);
      if (ratingDiff <= 2) {
        score += 0.1;
      }
      factors++;
    }

    return score;
  }

  getMatchingFactors(hunt1, hunt2) {
    const factors = [];

    if (hunt1.date.getMonth() === hunt2.date.getMonth()) {
      factors.push(`Same month (${hunt1.date.toLocaleString('default', { month: 'long' })})`);
    }

    if (hunt1.solunar && hunt2.solunar) {
      const phaseDiff = Math.abs(hunt1.solunar.moonPhase - hunt2.solunar.moonPhase);
      if (phaseDiff < 0.1) {
        factors.push(`Similar moon phase (${hunt1.solunar.getMoonPhaseName()})`);
      }
    }

    if (hunt1.weather && hunt2.weather) {
      const tempDiff = Math.abs(hunt1.weather.temperature - hunt2.weather.temperature);
      if (tempDiff <= 10) {
        factors.push(`Similar temperature (~${hunt1.weather.temperature}°F)`);
      }

      if (hunt1.weather.conditions === hunt2.weather.conditions) {
        factors.push(`Same weather (${hunt1.weather.conditions})`);
      }
    }

    return factors;
  }

  analyzeMoonPhases(hunts) {
    const phases = hunts.map(h => h.solunar?.moonPhase).filter(p => p !== undefined);

    if (phases.length === 0) return null;

    const avg = phases.reduce((a, b) => a + b, 0) / phases.length;

    return {
      average: avg,
      mostCommon: this.getMostCommonMoonPhase(phases)
    };
  }

  getMostCommonMoonPhase(phases) {
    // Group into phase categories
    const categories = phases.map(p => {
      if (p < 0.1 || p > 0.9) return 'New Moon';
      if (p >= 0.1 && p < 0.3) return 'Waxing Crescent';
      if (p >= 0.3 && p < 0.4) return 'First Quarter';
      if (p >= 0.4 && p < 0.6) return 'Full Moon';
      if (p >= 0.6 && p < 0.7) return 'Last Quarter';
      return 'Waning Crescent';
    });

    const counts = {};
    categories.forEach(c => {
      counts[c] = (counts[c] || 0) + 1;
    });

    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
  }

  analyzeTemperatures(hunts) {
    const temps = hunts.map(h => h.weather?.temperature).filter(t => t !== undefined);

    if (temps.length === 0) return null;

    const avg = temps.reduce((a, b) => a + b, 0) / temps.length;
    const min = Math.min(...temps);
    const max = Math.max(...temps);

    return {
      average: Math.round(avg),
      min,
      max,
      range: `${min}°F - ${max}°F`
    };
  }

  analyzeWeatherConditions(hunts) {
    const conditions = hunts.map(h => h.weather?.conditions).filter(c => c);

    const counts = {};
    conditions.forEach(c => {
      counts[c] = (counts[c] || 0) + 1;
    });

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([condition, count]) => ({
        condition,
        count,
        percentage: Math.round((count / conditions.length) * 100)
      }));
  }

  analyzeTimeOfYear(hunts) {
    const months = hunts.map(h => h.date.getMonth());

    const counts = {};
    months.forEach(m => {
      counts[m] = (counts[m] || 0) + 1;
    });

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([month, count]) => ({
        month: monthNames[month],
        count,
        percentage: Math.round((count / months.length) * 100)
      }));
  }

  analyzeTimeOfDay(hunts) {
    const hours = hunts.map(h => h.date.getHours());

    const counts = {
      'Early Morning (4-7am)': 0,
      'Morning (7-10am)': 0,
      'Midday (10am-2pm)': 0,
      'Afternoon (2-5pm)': 0,
      'Evening (5-8pm)': 0,
      'Night (8pm-4am)': 0
    };

    hours.forEach(h => {
      if (h >= 4 && h < 7) counts['Early Morning (4-7am)']++;
      else if (h >= 7 && h < 10) counts['Morning (7-10am)']++;
      else if (h >= 10 && h < 14) counts['Midday (10am-2pm)']++;
      else if (h >= 14 && h < 17) counts['Afternoon (2-5pm)']++;
      else if (h >= 17 && h < 20) counts['Evening (5-8pm)']++;
      else counts['Night (8pm-4am)']++;
    });

    return Object.entries(counts)
      .filter(([_, count]) => count > 0)
      .sort((a, b) => b[1] - a[1])
      .map(([time, count]) => ({
        time,
        count,
        percentage: Math.round((count / hours.length) * 100)
      }));
  }

  analyzeWindConditions(hunts) {
    const winds = hunts.map(h => h.weather?.windSpeed).filter(w => w !== undefined);

    if (winds.length === 0) return null;

    const avg = winds.reduce((a, b) => a + b, 0) / winds.length;

    return {
      average: Math.round(avg),
      low: Math.min(...winds),
      high: Math.max(...winds)
    };
  }
}

export default new PatternService();
