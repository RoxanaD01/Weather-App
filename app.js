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
import { 
  getCurrentWeather,
  getWeatherByCoords, 
  } from './modules/weather-service.js';
import {
   elements, 
   showLoading, 
   hideLoading, 
   displayWeather, 
   showError, 
   clearInput, 
   loadUserPreferences, 
   saveUserPreferences,
   } from './modules/ui-controller.js';

import { CONFIG } from './modules/config.js';

const preferences = async () => {
  const { unit, lang } = loadUserPreferences();
  CONFIG.DEFAULT_UNITS = unit;
  CONFIG.DEFAULT_LANG = lang;
  elements.unitSelect.value = unit;
  elements.langSelect.value = lang;

  setupEventListeners();
  await handleLocationSearch();
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

// Load weather after city name
const handleSearch = async () => {
  const city = elements.cityInput.value.trim();
  if (!isValidCity(city)) {
    showError('Please enter a valid city name.');
    return;
  }

  showLoading();
  try {
    const data = await getCurrentWeather(city);
    displayWeather(data);
    clearInput();
  } catch (err) {
    showError(err.message || "Weather data could not be loaded.");
  } finally {
    hideLoading();
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
};

document.addEventListener("DOMContentLoaded", preferences);




