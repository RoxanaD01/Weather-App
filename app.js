//Light/Dark Toggle

document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.querySelector("#theme-toggle");

  toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    const isDark = document.body.classList.contains("dark");
    toggleBtn.textContent = isDark ? "☀️ Light" : "🌙 Dark";
  });

});

// Weather Config
import {getCoords} from './modules/location-service.js';
import {getCurrentWeather, getWeatherByCoords} from './modules/weather-service.js';
import {
  elements, 
  showLoading, 
  hideLoading, 
  displayWeather, 
  showError, 
  clearInput, 
  loadUserPreferences, 
  saveUserPreferences,
  renderHistory,
  showHistory,
  addHistoryEventListeners,
} from './modules/ui-controller.js';
import { logger } from './modules/logger.js';
import { historyService } from './modules/history-service.js';
import { CONFIG } from './modules/config.js';

//App initialization
const initializeApp = async () => {
  logger.info('Weather App starting...')
  const { unit, lang } = loadUserPreferences();
  CONFIG.DEFAULT_UNITS = unit;
  CONFIG.DEFAULT_LANG = lang;
  elements.unitSelect.value = unit;
  elements.langSelect.value = lang;

  setupEventListeners();
  loadHistoryOnStart();

  logger.info('Weather App initialized successfully');

  await handleLocationSearch();
};

// Load search history at start
const loadHistoryOnStart = () => {
  const weatherHistory = historyService.getHistory();
  if (weatherHistory.length > 0) {
    renderHistory(weatherHistory);
    showHistory();
    logger.info(`Loaded ${weatherHistory.length} items from history`);
  }
};

// Handle weather search by city name
const handleSearch = async () => {
  const city = elements.cityInput.value.trim();
  logger.debug('Search initiated', { city });

  if (!isValidCity(city)) {
    const errorMsg = 'Please enter a valid city name.';
    showError(errorMsg);
    logger.warn('Invalid city input', { city });
    return;
  }

  showLoading();

  try {
    logger.info('Fetching weather data', { city });
    const data = await getCurrentWeather(city);

    // Save to history
    historyService.addLocation(data);

    displayWeather(data);
    clearInput();

    // Reload history
    const updatedHistory = historyService.getHistory();
    renderHistory(updatedHistory);
    showHistory();

    logger.info('Weather data displayed successfully', {
      city: data.name,
      temp: data.main.temp,
    });
  } catch (err) {
    showError(err.message || "Weather data could not be loaded.");
    logger.error('Failed to fetch weather data', err);
  } finally {
    hideLoading();
  }
};

// Load weather from current location or IP adress
const handleLocationSearch = async () => {
  try {
    showLoading(elements, 'Detecting location...');
    const coords = await getCoords();
  
    if (!coords || !coords.latitude || !coords.longitude) {
      throw new Error('Missing coordinates. Check location permissions.');
    }

    if (coords.source === 'ip') {
      console.warn('Approximate location via IP');
    }

    showLoading(elements, 'Loading weather...')
    const weather = await getWeatherByCoords(coords.latitude, coords.longitude);
    
    displayWeather(weather);
  } catch (error) {
    showError(`The location could not be determined: ${error.message}`);
  } finally {
    hideLoading();
  }
};

// Load weather from clicked history item
const handleHistoryClick = async (event) => {
  const item = event.target.closest('.history-item');
  if (!item) return;

  const city = item.dataset.city;
  const lat = parseFloat(item.dataset.lat);
  const lon = parseFloat(item.dataset.lon);

  logger.info('History item clicked', { city, lat, lon });

  try {
    showLoading();

    const data = await getWeatherByCoords(lat, lon);

    // Move city to top of history
    historyService.addLocation(data);

    displayWeather(data);

    const updatedHistory = historyService.getHistory();
    renderHistory(updatedHistory);

    logger.info('Weather loaded from history', { city });
  } catch (error) {
    showError('Could not load weather from history.');
    logger.error('Failed to load weather from history', error);
  } finally {
    hideLoading();
  }
};

// Clear search history
const handleClearHistory = () => {
  if (confirm('Are you sure you want to clear the entire search history?')) {
    historyService.clearHistory();
    renderHistory([]);
    logger.info('Search history cleared');
  }
};

// City name validation
const isValidCity = (city) => {
  return city.length >= 2 && /^[a-zA-ZăâîșțĂÂÎȘȚ\s-]+$/.test(city);
};

// Event Handling
const setupEventListeners = () => {

  // Search city
  elements.searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    handleSearch();
  });

  elements.cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  });

  // Unit change (Celsius/Fahrenheit)
  elements.unitSelect.addEventListener('change', async (e) => {
    const newUnit = e.target.value;
    CONFIG.DEFAULT_UNITS = newUnit;

    // Save preference
    const currentPrefs = loadUserPreferences();
    saveUserPreferences(newUnit, currentPrefs.lang);

    // If there is already data displayed, reload the weather
    if (!elements.weatherBox.classList.contains('hidden')) {
      await handleLocationSearch();
    }
  });

  // Language change
  elements.langSelect.addEventListener('change', async (e) => {
    const newLang = e.target.value;
    CONFIG.DEFAULT_LANG = newLang;

    const currentPrefs = loadUserPreferences();
    saveUserPreferences(currentPrefs.unit, newLang);

    if (!elements.weatherBox.classList.contains('hidden')) {
      await handleLocationSearch();
    }
  });

   addHistoryEventListeners(handleHistoryClick, handleClearHistory);
};

document.addEventListener("DOMContentLoaded", initializeApp);

console.log('History:', localStorage.getItem('weather_search_history'))


