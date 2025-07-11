import { ENV_CONFIG } from "./environment.js"

/**
* Main configuration for the weather app
* @type {Object}
*/
export const CONFIG = {
  API_KEY: ENV_CONFIG.API_KEY, 
  API_BASE_URL: 'https://api.openweathermap.org/data/2.5',
  DEFAULT_UNITS: 'metric', 
  DEFAULT_LANG: 'en', 
  MAX_HISTORY_ITEMS: 10,

  STORAGE_KEYS: {
    SEARCH_HISTORY: 'weather_search_history',
    USER_PREFERENCES: 'weather_user_prefs',
  },

  LOGGING: {
    ENABLED: ENV_CONFIG.ENABLE_LOGGING,
    LEVEL: ENV_CONFIG.DEBUG ? 'debug' : 'info',    
    MAX_LOGS: 100,
  },
  
  DEBUG_MODE: ENV_CONFIG.DEBUG,
  CACHE_TTL: ENV_CONFIG.CACHE_TTL,
}

/** Endpoint organization*/
export const API_ENDPOINTS = {
  CURRENT_WEATHER: 'weather',
  FORECAST: 'forecast',
  AIR_POLLUTION: 'air_pollution', 
  GEO_CODING: 'geo/1.0/direct',     // find location after name      
  REVERSE_GEO: 'geo/1.0/reverse',    // city coordonates
}

export const ERROR_MESSAGES = {
  CITY_NOT_FOUND: 'City not found. Try again.',
  NETWORK_ERROR: 'Network error. Please check your internet connection.',
  INVALID_KEY: 'Invalid API key',
  GENERAL_ERROR: 'An error occured. Please try again later.' 
}

export const FALLBACK_MOCK_DATA = false;

export const MOCK_DATA = {
 "coord": {
      "lon": 7.367,
      "lat": 45.133
   },
   "weather": [
      {
         "id": 501,
         "main": "Rain",
         "description": "moderate rain",
         "icon": "10d"
      }
   ],
   "base": "stations",
   "main": {
      "temp": 284.2,
      "feels_like": 282.93,
      "temp_min": 283.06,
      "temp_max": 286.82,
      "pressure": 1021,
      "humidity": 60,
      "sea_level": 1021,
      "grnd_level": 910
   },
   "visibility": 10000,
   "wind": {
      "speed": 4.09,
      "deg": 121,
      "gust": 3.47
   },
   "rain": {
      "1h": 2.73
   },
   "clouds": {
      "all": 83
   },
   "dt": 1726660758,
   "sys": {
      "type": 1,
      "id": 6736,
      "country": "IT",
      "sunrise": 1726636384,
      "sunset": 1726680975
   },
   "timezone": 7200,
   "id": 3165523,
   "name": "Province of Turin",
   "cod": 200
}