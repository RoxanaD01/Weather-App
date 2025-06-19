export const elements = {
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
}

export function update(data) {

  const mstoKmh = (data.wind.speed * 3.6).toFixed(1);

  const convertUnix = (unix, time) => {
    const localTime = new Date((unix + time) * 1000);
    return localTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // DOM update
    elements.cityName.textContent = data.name;
    elements.temperature.textContent = (data.main.temp - 273.15).toFixed(1);
    elements.humidity.textContent = data.main.humidity;
    elements.weather.textContent = data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1);
    elements.wind.textContent = mstoKmh;

    elements.sunrise.textContent = convertUnix(data.sys.sunrise, data.timezone);
    elements.sunset.textContent = convertUnix(data.sys.sunset, data.timezone);

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
}

export function showError(msg) {
  elements.error.textContent = msg;
  elements.error.classList.remove('hidden');
  elements.weatherBox.classList.add('hidden');
  elements.loading.classList.add('hidden');
}


