const apiKey = '2088e031f3006e0690547d7d24801b74';

const quotes = {
  Clear: "It's a bright day — make it count! ☀️",
  Rain: "Let the rain wash away your worries. 🌧️",
  Snow: "Snowflakes are kisses from the sky ❄️",
  Clouds: "Clouds can't hide your inner sunshine ☁️",
  Thunderstorm: "Boom! Even nature speaks loudly ⚡",
  Default: "Every day has its own weather and wonder."
};

function speakWeather(text) {
  const synth = window.speechSynthesis;
  const utter = new SpeechSynthesisUtterance(text);
  synth.speak(utter);
}

function getIcon(code) {
  return `https://openweathermap.org/img/wn/${code}@2x.png`;
}

function getWeather() {
  const city = document.getElementById('cityInput').value;
  if (!city) return alert('Enter a city name');
  fetchWeather(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
  fetchForecast(city);
}

function useMyLocation() {
  navigator.geolocation.getCurrentPosition(position => {
    const { latitude, longitude } = position.coords;
    fetchWeather(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`);
    fetchForecastByCoords(latitude, longitude);
  }, () => alert("Couldn't fetch location"));
}

function fetchWeather(url) {
  fetch(url)
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById('weatherDisplay');
      const iconUrl = getIcon(data.weather[0].icon);
      const description = data.weather[0].main;
      container.innerHTML = `
        <img src="${iconUrl}" class="weather-icon" alt="icon">
        <h2>${data.name}, ${data.sys.country}</h2>
        <p>${Math.round(data.main.temp)}°C - ${description}</p>
        <p>Humidity: ${data.main.humidity}% | Wind: ${data.wind.speed} m/s</p>
      `;
      speakWeather(`The current weather in ${data.name} is ${description}, with a temperature of ${Math.round(data.main.temp)} degrees Celsius.`);
      document.getElementById('quote').textContent = quotes[description] || quotes.Default;
    })
    .catch(() => alert('City not found'));
}

function fetchForecast(city) {
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`)
    .then(res => res.json())
    .then(data => displayForecast(data.list));
}

function fetchForecastByCoords(lat, lon) {
  fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
    .then(res => res.json())
    .then(data => displayForecast(data.list));
}

function displayForecast(list) {
  const forecastEl = document.getElementById('forecast');
  forecastEl.innerHTML = '';
  const daily = list.filter(item => item.dt_txt.includes('12:00:00'));
  daily.slice(0, 5).forEach(day => {
    const icon = getIcon(day.weather[0].icon);
    forecastEl.innerHTML += `
      <div class="card">
        <img src="${icon}" alt="icon" width="50">
        <div>${new Date(day.dt_txt).toDateString().split(' ')[0]}</div>
        <div>${Math.round(day.main.temp)}°C</div>
      </div>
    `;
  });
}
