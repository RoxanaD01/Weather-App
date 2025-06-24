import {MOCK_DATA, FALLBACK_MOCK_DATA, CONFIG, API_ENDPOINTS, ERROR_MESSAGES} from "./config.js";


// URL construction
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

// API call - handle http error codes
export const makeRequest = async (url) => {
  try {
    const response = await fetch(url)

    if (!response.ok) {
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

    return await response.json()

  } catch (error) {
      if(error instanceof TypeError) {
        throw new Error(ERROR_MESSAGES.NETWORK_ERROR || 'Network error. Please check your internet connection.' )
      }
    throw new Error(error.message)
  }
}

// Fallback logic - If API fails it allows the app to continue 
export const getCurrentWeatherWithFallback = async (city) => {
  try {
    return await getCurrentWeather(city) // Real API
  } catch (error) {
    console.warn('Using fallback data due to:', error.message)
    return {   // Fallback data
      ...MOCK_DATA,
      isFallback: true,
      fallbackReason: error.message,
    }
  }
}

export const getCurrentWeather = async (city) => {
  try {
    if (FALLBACK_MOCK_DATA) {
      await new Promise((res) => setTimeout(res, 1000));

      if (!city || city.trim() === "") {
        throw new Error("Invalid city name");
      }

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
    console.error("getCurrentWeather error:", error.message);
    throw error; 
  }
};

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
    console.error("getWeatherByCoords error:", error.message);
    throw error;
  }
};



