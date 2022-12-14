function formatDate(timestamp) {
  let now = new Date(timestamp);
  let hours = now.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = now.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[now.getDay()];
  return `${day} ${hours}:${minutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row forecast-row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `         
        <div class="col-2">
          <div class="forecast-date text">${formatDay(forecastDay.time)}</div>
          <div ><img class="forecast-icon" src="http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${
            forecastDay.condition.icon
          }.png" alt="${forecastDay.condition.description}" /></div>
          <div class="forecast-temp text"><span class="min-temp">${Math.round(
            forecastDay.temperature.minimum
          )}°</span> / <span class = "max-temp">${Math.round(
          forecastDay.temperature.maximum
        )}°</span></div>
        </div>
          `;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(city) {
  let apiKey = "244c95t3fo3db4e37613c8eecb30fba3";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=244c95t3fo3db4e37613c8eecb30fba3`;
  axios.get(apiUrl).then(displayForecast);
}

function updateWeather(response) {
  let city = document.querySelector("#city");
  let dateElement = document.querySelector("#date");
  let description = document.querySelector("#description");
  let temperatureElement = document.querySelector("#temperature");
  let humidity = document.querySelector("#humid");
  let windSpeed = document.querySelector("#wind");
  let iconElement = document.querySelector("#icon");

  celsiusTemperature = response.data.temperature.current;

  city.innerHTML = response.data.city;
  dateElement.innerHTML = formatDate(response.data.time * 1000);
  description.innerHTML = response.data.condition.description;
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
  humidity.innerHTML = `Humidity: ${response.data.temperature.humidity}%`;
  windSpeed.innerHTML = `${response.data.wind.speed} km/hr`;
  iconElement.setAttribute(
    "src",
    `http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${response.data.condition.icon}.png`
  );
  iconElement.setAttribute("alt", response.data.condition.description);

  getForecast(response.data.city);
}

function searchCity(city) {
  let apiKey = "244c95t3fo3db4e37613c8eecb30fba3";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=244c95t3fo3db4e37613c8eecb30fba3&units=metric`;
  axios.get(`${apiUrl}`).then(updateWeather);
}

function handleSubmit(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#city-input");
  let city = searchInput.value;

  searchCity(city);
}

function searchLocation(position) {
  let apiKey = "244c95t3fo3db4e37613c8eecb30fba3";
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiUrl = `https://api.shecodes.io/weather/v1/current?lon=${position.coords.longitude}&lat=${position.coords.latitude}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(updateWeather);
}

function getCurrentLocation() {
  navigator.geolocation.getCurrentPosition(searchLocation);
}

let currentLocationButton = document.querySelector("#current-city");
currentLocationButton.addEventListener("click", getCurrentLocation);

function displayFahrenheit(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
}
function displayCelsius(event) {
  event.preventDefault();
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
}

let celsiusTemperature = null;
let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", handleSubmit);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheit);
let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsius);

searchCity("Valencia");
