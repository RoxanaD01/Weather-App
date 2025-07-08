import {MOCK_DATA, FALLBACK_MOCK_DATA, CONFIG, API_ENDPOINTS, ERROR_MESSAGES} from "./config.js";
import { logger } from "./logger.js";


/**
 * Builds a complete API URL with default and specific query parameters.
 * 
 * @param {string} endpoint - API endpoint path (e.g., 'weather').
 * @param {Object} [params={}] - Additional query parameters (e.g., city, lat, lon).
 * @returns {string} - Fully constructed API URL.
 */
export const buildUrl = (endpoint, params = {}) => {
  const url = new URL(`${CONFIG.API_BASE_URL}/${endpoint}`);

  // must have params in all requests
  url.searchParams.set('appid', CONFIG.API_KEY)
  url.searchParams.set('units', CONFIG.DEFAULT_UNITS)
  url.searchParams.set('lang', CONFIG.DEFAULT_LANG)

  // Specific params(city, lat, lon)
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value)
    }
  })

  return url.toString()
}

/**
 * Makes an HTTP request to the specified URL and handles common HTTP errors.
 */
export const makeRequest = async (url) => {
  try {
    logger.info('Request started:', url);
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 10000);
    const response = await fetch(url, { signal: controller.signal });

    if (!response.ok) {
      logger.warn(`Request failed with status ${response.status} for URL: ${url}`);
      switch(response.status) {
        case 404:
          throw new Error(ERROR_MESSAGES.CITY_NOT_FOUND || 'City not found. Try again.');
        case 401:
          throw new Error(ERROR_MESSAGES.INVALID_KEY || 'Invalid API key');
        case 500: 
          throw new Error('Server error. Please try again later.');
        default:
          throw new Error(ERROR_MESSAGES.GENERAL_ERROR || 'An error occured. Please try again later.' )
      }
    }

    const data = await response.json();
    logger.info('Request succeeded:', url);
    return data;

  } catch (error) {
      if(error instanceof TypeError) {
        logger.error('Network error:', error.message);
        throw new Error(ERROR_MESSAGES.NETWORK_ERROR || 'Network error. Please check your internet connection.' )
      }
    logger.error('Request error:', error.message);
    throw new Error(error.message)
  }
}

/**
 * Attempts to fetch current weather data for a city. Falls back to mock data on failure.
*/
export const getCurrentWeatherWithFallback = async (city) => {
  try {
    return await getCurrentWeather(city) // Real API
  } catch (error) {
    logger.warn('Using fallback data due to:', error.message)
    return {   
      ...MOCK_DATA,
      isFallback: true,
      fallbackReason: error.message,
    }
  }
}

/**
 * Fetches current weather data for a given city using the API or mock data.
 * @async
 * @function getCurrentWeather
 * @param {string} city - The name of the city to fetch weather for.
 * @returns {Promise<Object>} Weather data for the specified city.
 * @throws {Error} If the city is invalid or the API request fails.
 */
export const getCurrentWeather = async (city) => {
  try {
    if (FALLBACK_MOCK_DATA) {
      await new Promise((res) => setTimeout(res, 1000));

      if (!city || city.trim() === "") {
        throw new Error("Invalid city name");
      }
      logger.info('Using mock data for city:', city);
      return {
        ...MOCK_DATA,
        name: city.trim(),
        isMock: true,
      };
    }

    if (!city || city.trim() === "") {
      throw new Error("City name is required");
    }

    const url = buildUrl(API_ENDPOINTS.CURRENT_WEATHER, { q: city });
    return await makeRequest(url);
  } catch (error) {
    logger.error("getCurrentWeather error:", error.message);
    throw error; 
  }
};

/**
 * Fetches current weather data by geographic coordinates.
 */
export const getWeatherByCoords = async (lat, lon) => {
  try {
    if (FALLBACK_MOCK_DATA) {
      await new Promise((res) => setTimeout(res, 1000));

      if (!lat || !lon) {
        throw new Error("Invalid coordinates");
      }

      return {
        ...MOCK_DATA,
        lat,
        lon,
        name: `lat ${lat} - lon ${lon}`,
        isMock: true,
      };
    }

    if (!lat || !lon) {
      throw new Error("Latitude and longitude are required");
    }

    const url = buildUrl(API_ENDPOINTS.CURRENT_WEATHER, { lat, lon });
    return await makeRequest(url);
  } catch (error) {
    logger.error("getWeatherByCoords error:", error.message);
    throw error;
  }
};

/**
 * Class for caching weather data with automatic expiration.
*/
class WeatherCache {
  /**
   * Creates a WeatherCache instance. Maximum age for cached data in milliseconds (default 10 minutes).
   */
  constructor(maxAge = 10 * 60 * 1000) {
    this.cache = new Map();
    this.maxAge = maxAge;
  }

  /**
   * Retrieves cached data if not expired.
   * 
   * @param {string} key - Unique key for cached data.
   * @returns {Object|null} - Cached data or null if not found or expired.
   */
  get(key) {
    const entry = this.cache.get(key);

    if (!entry) return null;

    const expiredData = Date.now() - entry.timestamp > this.maxAge;
    if (expiredData) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  set(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  cleanup() {
    const currentTime = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (currentTime - entry.timestamp > this.maxAge) {
        this.cache.delete(key);
      }
    }
  }
}

export const weatherCache = new WeatherCache()


