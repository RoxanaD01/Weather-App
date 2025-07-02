import {CONFIG } from "./config.js";

export const elements = ({
  cityInput: document.querySelector('#city-input'),
  searchBtn: document.querySelector('#search-btn'),
  cityName: document.querySelector('#city-name'),
  temperature: document.querySelector('#temperature'),
  humidity: document.querySelector('#humidity'),
  weather: document.querySelector('#weather-info'),
  wind: document.querySelector('#wind-speed'),
  sunrise: document.querySelector('#sunrise'),
  sunset: document.querySelector('#sunset'),
  error: document.querySelector('#error'),
  loading: document.querySelector('#loading'),
  weatherBox: document.querySelector('#weather-display'),
  weatherIcon: document.querySelector('#weather-icon'),

  unitSelect: document.querySelector('#unit-select'),
  langSelect: document.querySelector('#lang-select'),

  historySection: document.querySelector('#history-section'),
  historyList: document.querySelector('#history-list'),
  clearHistoryBtn: document.querySelector('#clear-history-btn'),
  devTools: document.querySelector('#dev-tools'),
  logDisplay: document.querySelector('#log-display'),
  clearLogsBtn: document.querySelector('#clear-logs-btn'),
  exportLogsBtn: document.querySelector('#export-logs-btn'),
})

export function displayWeather(data) {
  
  if (!data || !data.main || typeof data.main.temp === 'undefined') {
    showError('The weather data is incomplete or invalid.');
    console.error('Received weather data:', data);
    return;
  }

  const mstoKmh = (data.wind.speed * 3.6).toFixed(1);

  const convertUnix = (unix, ianaTimeZone) => {
  const localTime = new Date(unix * 1000);
  return localTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: ianaTimeZone
  });
};

  // DOM update
    elements.cityName.textContent = data.name;
    updateTemperatureDisplay(elements, Math.round(data.main.temp), CONFIG.DEFAULT_UNITS);
    elements.humidity.textContent = data.main.humidity;
    elements.weather.textContent = data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1);
    elements.wind.textContent = `${mstoKmh} km/h`;

    elements.sunrise.textContent = convertUnix(data.sys.sunrise, data.locationData);
    elements.sunset.textContent = convertUnix(data.sys.sunset, data.locationData);

    const iconImg = data.weather[0].icon;
    elements.weatherIcon.src = `https://openweathermap.org/img/wn/${iconImg}@2x.png`;
    elements.weatherIcon.alt = data.weather[0].description;

    elements.weatherBox.classList.remove('hidden');
    elements.error.classList.add('hidden');
}

// Loading and Error

export function showLoading() {
  elements.loading.classList.remove('hidden');
  elements.weatherBox.classList.add('hidden');
  elements.error.classList.add('hidden');
}

export function hideLoading() {
  elements.loading.classList.add('hidden');
  elements.loading.style.display = 'none';
}

export function showError(msg) {
  elements.error.textContent = msg;
  elements.error.classList.remove('hidden');
  elements.weatherBox.classList.add('hidden');
  elements.loading.classList.add('hidden');
}

export function clearInput() {
  elements.cityInput.value = '';
}

// Update temp symbol 
export const updateTemperatureDisplay = (elements, temperature, unit) => {
  const symbol = unit === 'imperial' ? '°F' : '°C';
  elements.temperature.textContent = `${temperature}${symbol}`
}

// Save user preferences
export const saveUserPreferences = (unit, lang) => {
  localStorage.setItem('appUnit', unit);
  localStorage.setItem('appLang', lang);
}

// Load user preferences
export const loadUserPreferences = () => {
  return {
    unit: localStorage.getItem('appUnit') || 'metric',
    lang: localStorage.getItem('appLang') || 'en',
  }
}

// History
export const showHistory = () => {
  elements.historySection.classList.remove('hidden')
}

export const hideHistory = () => {
  elements.historySection.classList.add('hidden')
}

export const renderHistory = (historyItems) => {
  if (historyItems.length === 0) {
    elements.historyList.innerHTML =
      '<p class="no-history">There are no recent searches</p>'
    return
  }

  const historyHTML = historyItems.map((item) => {
      const timeAgo = getTimeAgo(item.timestamp)
      return `
      <div class="history-item" data-city="${item.city}" data-lat="${item.coords.lat.toFixed(2)}" data-lon="${item.coords.lon.toFixed(2)}">
        <div class="history-location">
          <span class="city">${item.city}</span>
          <span class="country">${item.country}</span>
        </div>
        <div class="history-time">${timeAgo}</div>
      </div>
    `
    })
    .join('')

  elements.historyList.innerHTML = historyHTML;
}

// Helper function for relative time
const getTimeAgo = (timestamp) => {
  const now = Date.now()
  const diff = now - timestamp
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 60) return `${minutes} minutes ago`
  if (hours < 24) return `${hours} hours ago`
  return `${days} days ago`
}

export const addHistoryEventListeners = (onHistoryClick, onClearHistory) => {
  elements.historyList.addEventListener('click', (e) => {
    onHistoryClick(e)
  });

  elements.clearHistoryBtn.addEventListener('click', () => {
    onClearHistory();
  });

}
