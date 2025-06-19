// Light/Dark Toggle

document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.querySelector("#theme-toggle");

  toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    const isDark = document.body.classList.contains("dark");
    toggleBtn.textContent = isDark ? "☀️ Light" : "🌙 Dark";
  });

});

// Weather Config
import { elements, showLoading, hideLoading, displayWeather, showError, clearInput } from './modules/ui-controller.js';
import { getCurrentWeather } from './modules/weather-service.js';

const setupEventListeners = () => {
  elements.searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    handleSearch();
  })

  elements.cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  })
}

const isValidCity = (city) => {
  return city.length >= 2 && /^[a-zA-ZăâîșțĂÂÎȘȚ\s-]+$/.test(city);
};


const handleSearch = async () => {
  const city = elements.cityInput.value.trim();

  if (!isValidCity(city)) {
    showError('Please enter a valid city name.');
    return;
  }

  showLoading();

  try {
    const data = await getCurrentWeather(city);
    displayWeather(data);
    clearInput()
  } catch (err) {
    showError(err.message || "Weather data could not be loaded.");
  } finally {
    hideLoading();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
});



