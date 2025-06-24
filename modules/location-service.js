export const getCoords = () => new Promise((resolve, reject) => {
    
    //Fallback funcion - in case geolocation fails
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
            reject(new Error('Could not determine location'));
        }
    }

    // The browser does not support geolocation.
    if(!navigator.geolocation) {
        return fallbackToIp();
    }

    // Geolocation
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
      console.warn('Geolocation failed:', error.message);
      fallbackToIp();
    },
  ),
    {
    timeout: 6000,               // waiting time         
    enableHighAccuracy: true,    
    maximumAge: 0                // Not ro reuse a cached location
    }
})

