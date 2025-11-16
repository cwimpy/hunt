# Hunt Tracker

A comprehensive React Native hunting app that helps hunters track conditions, log hunts, and discover success patterns.

## Features

### 🎯 Auto-Import Hunt Data
- **One-Tap Logging**: Create a new hunt and automatically capture:
  - GPS coordinates and location
  - Current weather conditions (temp, wind, pressure, humidity)
  - Solunar data (moon phase, sunrise/sunset, feeding periods)
- **Editable Fields**: All auto-imported data can be edited, plus add:
  - Species hunted
  - Success/failure
  - Notes and observations
  - Photos (planned)

### 🌤️ Real-Time Conditions Dashboard
- Current weather from Open-Meteo API (no API key required!)
- Solunar activity rating (1-10 scale)
- Major and minor feeding periods
- Moon phase and illumination
- Active period alerts

### 📊 Success Pattern Analysis
- Automatically analyzes successful hunts to find patterns:
  - Best moon phases
  - Ideal temperature ranges
  - Optimal weather conditions
  - Best months and times of day
  - Wind patterns
- **Smart Matching**: Get notified when current conditions match past successful hunts
- Success rate tracking and statistics

### 📱 Hunt History
- Chronological list of all logged hunts
- Quick view of key conditions
- Success indicators
- Search and filter (planned)

## Technology Stack

- **React Native** with Expo for cross-platform mobile development
- **Open-Meteo API** for weather data (free, no API key needed)
- **SunCalc** library for solunar calculations
- **AsyncStorage** for local data persistence
- **React Navigation** for navigation

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (will be installed automatically)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd HuntTracker
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on your device:
   - **iOS**: Scan QR code with Camera app, or press `i` to open iOS Simulator
   - **Android**: Scan QR code with Expo Go app, or press `a` to open Android Emulator
   - **Web**: Press `w` to open in web browser

## Project Structure

```
HuntTracker/
├── src/
│   ├── models/          # Data models (Hunt, Location, Weather, Solunar)
│   ├── services/        # Business logic services
│   │   ├── locationService.js    # GPS and geocoding
│   │   ├── weatherService.js     # Weather API integration
│   │   ├── solunarService.js     # Solunar calculations
│   │   ├── storageService.js     # AsyncStorage wrapper
│   │   └── patternService.js     # Success pattern analysis
│   ├── screens/         # App screens
│   │   ├── HomeScreen.js         # Today's conditions
│   │   ├── NewHuntScreen.js      # Log new hunt
│   │   ├── HuntDetailsScreen.js  # View hunt details
│   │   ├── HistoryScreen.js      # Hunt history
│   │   └── PatternsScreen.js     # Success patterns
│   ├── navigation/      # Navigation setup
│   └── components/      # Reusable components
├── App.js              # App entry point
├── app.json            # Expo configuration
└── package.json        # Dependencies
```

## How It Works

### Solunar Theory
The app uses solunar tables to predict peak wildlife activity based on:
- **Moon position**: Overhead and underfoot times
- **Moon phase**: New moon and full moon periods are typically most active
- **Sun position**: Sunrise and sunset periods
- **Major periods**: 2-hour windows around moon transit and rise/set
- **Minor periods**: 1.5-hour windows around sunrise and sunset

### Weather Integration
Current weather data is fetched from Open-Meteo API, which provides:
- Temperature and "feels like"
- Weather conditions (clear, cloudy, rain, etc.)
- Wind speed and direction
- Barometric pressure
- Humidity
- Cloud cover
- Visibility

### Pattern Matching Algorithm
The app analyzes successful hunts to find patterns:
1. Extracts conditions from each successful hunt
2. Calculates similarity scores between hunts (0-1 scale)
3. Identifies common factors (moon phase, temperature, weather, etc.)
4. Alerts when current conditions match past successes (70%+ similarity)

## Building for App Store

### iOS

1. Create an Apple Developer account
2. Configure bundle identifier in `app.json`
3. Build the app:
```bash
eas build --platform ios
```
4. Submit to App Store:
```bash
eas submit --platform ios
```

### Android

1. Create a Google Play Developer account
2. Configure package name in `app.json`
3. Build the app:
```bash
eas build --platform android
```
4. Submit to Play Store:
```bash
eas submit --platform android
```

## Planned Features

- [ ] Photo capture and storage
- [ ] Weather forecast (multi-day)
- [ ] Gear tracking
- [ ] Trophy management
- [ ] Export hunt logs (CSV, PDF)
- [ ] Cloud sync / backup
- [ ] Social features (share hunts)
- [ ] Maps integration
- [ ] Offline mode
- [ ] Push notifications for optimal conditions
- [ ] Advanced filtering and search
- [ ] Statistics dashboard

## APIs Used

- **Open-Meteo Weather API**: https://open-meteo.com
  - Free, no API key required
  - Accurate forecasts and historical data
  - Supports global locations

## License

MIT License - feel free to use and modify!

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues, questions, or feature requests, please open an issue on GitHub.

---

Happy hunting! 🦌🎯
