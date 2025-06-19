import { MOCK_DATA } from "./config.js";

export const getCurrentWeather = async (city) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if(!city || city.trim() === "") {
        throw new Error("Invalid city name")
    }

     return {
    ...MOCK_DATA,
    name: city.trim(),
  };
  } catch(err) {
    console.error("Error:", err.message);
    throw err;
  }
    
 
}

export const getWeatherByCoords = async (lat, lon) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if(!lat || !lon) {
        throw new Error("Invalid coordonates")
    }
  } catch (err) {
    console.error("Error", err.message);
    throw err;
  }

  return {
    ... MOCK_DATA,
    lat: lat,
    lon: lon,
    name: `lat ${lat} - lon ${lon}`
}
}
