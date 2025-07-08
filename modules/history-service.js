import { CONFIG } from "./config.js";
import { logger } from "./logger.js";

/**
 * Service for managing the user's location search history using localStorage.
 */
export class HistoryService {
  constructor() {
    this.storageKey = CONFIG.STORAGE_KEYS.SEARCH_HISTORY
    this.maxItems = CONFIG.MAX_HISTORY_ITEMS
  }

    /**
   * Adds a new location to the search history or moves it to the top if it already exists.
   * Limits the number of stored items to `maxItems`.
   *
   * @param {Object} data - Weather/location data returned from the API.
   * @param {string} data.name - City name.
   * @param {Object} data.sys - System info (including country).
   * @param {string} data.sys.country - Country code.
   * @param {Object} data.coord - Coordinates.
   * @param {number} data.coord.lat - Latitude.
   * @param {number} data.coord.lon - Longitude.
   */

  addLocation(data) {
    const { name: city, sys, coord } = data;
    const country = sys.country;
    const coords= { lat: coord.lat, lon: coord.lon };
    const newLocation = { city, country, coords, timestamp: Date.now()}
    const history = this._loadFromStorage() // Load current history

    // Check for existing entry (case-insensitive match)
    const existingIndex = history.findIndex( 
        (item) => item.city.toLowerCase() === city.toLowerCase()
    )

    if (existingIndex !== -1) {
        // Move on top
        const [existing] = history.splice(existingIndex, 1)
        history.unshift(existing)
    } else {
        // Add new
        history.unshift(newLocation)
    }

    // Limit to maxItems
    if (history.length > this.maxItems) {
        history.length = this.maxItems
    }

    this._saveToStorage(history)
    logger.info(`Location: ${city}, ${country}`)
  }

  getHistory() {
    return this._loadFromStorage()
  }

  removeLocation(city) {
    const history = this._loadFromStorage();

    const update = history.filter(
    (item) => item.city.toLowerCase() !== city.toLowerCase()
    )

    this._saveToStorage(update)
  }

  clearHistory() {
    const clear = [];
    this._saveToStorage(clear);
  }

  
  _saveToStorage(history) {
    try {
        localStorage.setItem(this.storageKey, JSON.stringify(history))
    } catch (error) {
        logger.error('Failed to save to localStorage', error)
    }
  }

  _loadFromStorage() {
    try {
        const data = localStorage.getItem(this.storageKey)
        return data ? JSON.parse(data) : []
    } catch (error) {
        logger.error('Failed to load from localStorage', error)
        return []
    }
  }
}

/** Singleton instance of HistoryService */
export const historyService = new HistoryService()
