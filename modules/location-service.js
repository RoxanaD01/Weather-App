import { logger } from "./logger.js";
/**
 * Gets the user's geographic coordinates using the browser's geolocation
 * or, alternatively, the IP location service.
 *
 * @function
 * @returns {Promise<Object>} A promise that resolves to an object with location.
 * @returns {number} return.latitude - location latitude
 * @returns {number} return.longitude - location longitude.
 * @returns {string} return.source - Location source: "gps" or "ip".
 * @returns {string} return.accuracy - Location accuracy: "precise" or "city".
 */

export const getCoords = () => new Promise((resolve, reject) => {
   /**
   * Fallback for obtaining IP-based location if geolocation is unavailable or fails.
   */
    const fallbackToIp = async () => {
        try {
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();

            resolve({
                latitude: data.latitude,
                longitude: data.longitude,
                source: 'ip',
                accuracy: 'city',
            })

        } 
        catch (err) {
          logger.error('IP-based location failed', err);
          reject(new Error('Could not determine location'));
        }
    }

    // Check if the browser supports geolocation.
    if(!navigator.geolocation) {
      logger.warn('Geolocation not supported, falling back to IP location');
      return fallbackToIp();
    }

    // Try to get the location via GPS
    navigator.geolocation.getCurrentPosition(
    (position) => {
      resolve({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        source: 'gps',
        accuracy: 'precise'
      });
    },
    (error) => {
      logger.warn('Geolocation failed, falling back to IP location', error.message);
      fallbackToIp();
    },
  ),
    {
    timeout: 6000,               // max waiting time         
    enableHighAccuracy: true,    
    maximumAge: 0                // Not reuse a cached location
    }
})

