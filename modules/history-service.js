import { CONFIG } from "./config.js";
import { logger } from "./logger.js";

export class HistoryService {
  constructor() {
    this.storageKey = CONFIG.STORAGE_KEYS.SEARCH_HISTORY
    this.maxItems = CONFIG.MAX_HISTORY_ITEMS
  }

  addLocation(data) {
     const { name: city, sys, coord } = data;
     const country = sys.country;
     const coords= { lat: coord.lat, lon: coord.lon };

     const newLocation = { city, country, coords, timestamp: Date.now()}

    // Check if the location already exists (avoid duplicates)
    const history = this._loadFromStorage()

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

    // Save to localStorage
    this._saveToStorage(history)
    logger.info(`Location: ${city}, ${country}`)
  }

  getHistory() {
    return this._loadFromStorage()
  }

  removeLocation(city) {
    // Remove a specific location from history
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

export const historyService = new HistoryService()
