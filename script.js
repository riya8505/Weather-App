const apiKey = "ff7f2207ca966c01f55e64845aff24c7";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric";


const searchBox = document.querySelector(".search input");
const searchButton = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");


async function checkWeather(city) {
  const response = await fetch(`${apiUrl}&q=${city}&appid=${apiKey}`);
  const data = await response.json();

  if (response.status === 404 || data.cod === "404") {
    document.querySelector(".error").style.display = "block";
    document.querySelector(".weather").classList.remove("show");
    return;
  }

  updateUI(data);
}


async function checkWeatherByCoords(lat, lon) {
  const response = await fetch(`${apiUrl}&lat=${lat}&lon=${lon}&appid=${apiKey}`);
  const data = await response.json();

  if (data.cod !== 200) {
    checkWeather("New York"); // fallback
    return;
  }

  updateUI(data);
}


function updateUI(data) {
  document.querySelector(".city").innerHTML = data.name;
  document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
  document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
  document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";

  const weatherMain = data.weather[0].main;
  if (weatherMain === "Clouds") {
    weatherIcon.src = "images/clouds.png";
  } else if (weatherMain === "Clear") {
    weatherIcon.src = "images/clear.png";
  } else if (weatherMain === "Rain") {
    weatherIcon.src = "images/rain.png";
  } else if (weatherMain === "Drizzle") {
    weatherIcon.src = "images/drizzle.png";
  } else if (weatherMain === "Mist") {
    weatherIcon.src = "images/mist.png";
  } else {
    weatherIcon.src = "images/default.png";
  }

  document.querySelector(".weather").classList.add("show");
  document.querySelector(".error").style.display = "none";
}


searchButton.addEventListener("click", () => {
  const city = searchBox.value.trim();
  if (city) checkWeather(city);
});


window.onload = function () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        checkWeatherByCoords(position.coords.latitude, position.coords.longitude);
      },
      error => {
        checkWeather("New York"); // fallback
      }
    );
  } else {
    checkWeather("New York"); // fallback
  }
};
