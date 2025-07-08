# 🌤️ Weather App – A Modern JavaScript Weather Application

This is a fully featured weather application built with vanilla JavaScript, real-time API integration, and modern front-end best practices.

[🌐 Live Demo](https://roxanad01.github.io/Weather-App)  
[💻 Source Code](https://github.com/RoxanaD01/Weather-App)

## 🎯 About the Project

Weather App is a sleek and responsive web application that lets users check the weather anywhere in the world using OpenWeatherMap API. The project emphasizes performance, accessibility, and clean code through modular JavaScript, graceful error handling, and local storage-based persistence.
It’s designed as both a powerful learning experience and a production-level ready application showcasing real-world skills like data fetching, dynamic UI rendering, and user preference saving — all without any frameworks or libraries.

## ✨ Features

### Core Features

- **City Weather Search** - Easily retrieve current weather by city name
- **Auto Location Detection** - Uses GPS or IP-based geolocation to show weather instantly
- **Dark / Light 🌓 Theme Toggle** – Switch themes with one click, preference saved across sessions
- **Multi-language Support** – Includes English, Romanian, French, German, and Spanish
- **Unit Switcher** – Toggle between Celsius (°C) and Fahrenheit (°F)
- **Search History** – Persistent search log with clickable items and clear history option
- **Responsive Design**– Optimized for desktop, tablet, and mobile experiences

### Advanced Features

- **Smart Caching** – Saves weather data temporarily to avoid repeated API calls
- **Developer Tools Panel** – In-app logs for debugging + export logs to file
- **Graceful Error Handling** – Meaningful messages for invalid input, offline status, or API errors
- **Debounced Search** – Minimizes unnecessary calls during input for better UX
- **Fallback Mechanisms** – Uses mock or fallback data when APIs fail or time out
- **LocalStorage Preferences** – Saves language and unit preferences without login

### Technical Highlights

- **Modular JavaScript Architecture** – Each functionality is isolated in its own file/module
- **Service Layer Abstraction** – All APIs are managed via centralized, reusable services
- **Caching with Expiry** – Efficient memory use via in-memory cache with automatic cleanup
- **Singletons for Shared State** – Logger and history manager use the Singleton design pattern
- **Observer-based Events** – Clean event-driven UI updates based on user actions
- **Internationalization-ready** – Easily extendable language support with dynamic updates

## 🛠️ Tech Stack

### Frontend

- **Vanilla JavaScript (ES6+)** - Modular Architecture
- **CSS3** - Responsive and Modern Design
- **HTML5** - Semantic Structure

### APIs & Services

- **OpenWeatherMap API** - Real-time Weather Data
- **Geolocation API** - Automatic Location Detection
- **IP Geolocation API** - Location Fallback

### Tools & Workflow

- **Git/GitHub** - Version Control and Collaboration
- **VS Code** - Development Environment
- **GitHub Pages** - Free Hosting

## 🧠 Design Patterns

- **Modular Architecture** – clear separation of concerns
- **Service Layer** – reusable logic for external APIs
- **Observer Pattern** – event-based data updates
- **Singleton Pattern** – shared service instances like Logger and HistoryService
  
## 📸 Screenshots

| ☀️ Light Theme | 🌙 Dark Theme | 
| ![Light Theme](./screenshots/light-mode.png) | ![Dark Theme](./screenshots/dark-mode.png) | 

## 🔍 How It Works

1. Detects user's location using GPS or IP fallback
2. Fetches weather data from OpenWeatherMap
3. Renders UI dynamically based on user language and unit preferences
4. Saves history and preferences using LocalStorage
5. Logs key events in a developer panel for debugging

## 📦 Installation & Running

### Requirements
- A modern browser (Chrome, Edge, Firefox, Safari)
- Free API key from OpenWeatherMap

###  Local Setup

```bash
# Clone the repository
git clone https://github.com/RoxanaD01/Weather-App.git
cd weather-app

# Add your API key in config.js
# → edit /modules/config.js and replace API_KEY with your personal key
```
## 🔑 Getting Your API Key

You'll need a free API key from OpenWeatherMap:
1. Sign up at openweathermap.org
2. Go to API Keys
3. Copy your key
4. Open /modules/config.js and replace 

export const CONFIG = {
  API_KEY: 'your-key-here',
  ...
}

## 🧪 Testing

### Manual Testing
- Try multiple city searches
- Change temperature units (Celsius / Fahrenheit)
- Switch between themes
- Toggle languages
- Turn off GPS and validate IP fallback
- Clear and inspect logs in Developer Mode

### Browser Compatibility

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

## ⚙️ App Customization 
- 🌍 Add More Languages →  Update translation objects in `ui-controller.js` and update `index.html`
- 🖌️ Edit themes → Modify CSS variables and classes in `styles.css`
- 🔗 Extend APIs → Add endpoints such as air pollution or extended forecasts in `weather-service.js`

## 📚 Lessons Learned

### Technical Concepts

- Geolocation APIs and fallbacks
- LocalStorage for persistence
- Modular JS and design patterns
- API error handling and mock fallback
- Logging & export in JS

### Challenges Overcome
- Navigating API rate limits
- Handling offline or denied GPS access
- Keeping search history up-to-date and deduplicated

### Best Practices Applied
- DRY, KISS, and separation of concerns
- Accessibility & semantic HTML
- UX-focused error feedback

## 🗺️ Future Roadmap

- [ ] Add PWA Support
- [ ] Extended forecast (5 days)
- [ ] Weather maps integration
- [ ] Multiple locations tracking

## 👤 Author

Roxana Dejescu
- GitHub: https://github.com/RoxanaD01
- LinkedIn: https://www.linkedin.com/in/roxana-dejescu-1505651b2/
- Email: roxanadejescu@gmail.com

## 📄 License

This project is licensed under the MIT License

## 🙏 Acknowledgment

- [OpenWeatherMap](https://openweathermap.org/) for free real-time weather data
- [IP API](https://ipapi.co/) for location fallback
- Instructors and peers for feedback
