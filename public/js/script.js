import uilities from "./utils/utils.js";

let weather = {
  fetchWeather: function (city) {
    const url = `/weatherData?city=${city}`;
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          alert("some thing went wrong, please try again ...");
        } else {
          return response.json();
        }
      })
      .then((data) => {
        if (data.cod == 404) {
          alert(`No weather data found for the city ${city}`);
        } else {
          this.displayWeather(data);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred while fetching weather data.");
      });
  },
  displayWeather: function (data) {
    const { name } = data;
    const { icon, description } = data.weather[0];
    const { temp, humidity } = data.main;
    const { speed } = data.wind;
    const urlSpecifiedDescription =
      uilities.replaceEmptySpaceString(description);
    document.querySelector(".city").innerText = "Weather in " + name;
    document.querySelector(".icon").src =
      "https://openweathermap.org/img/wn/" + icon + ".png";
    document.querySelector(".description").innerText = description;
    document.querySelector(".temp").innerText = temp + "°C";
    document.querySelector(".humidity").innerText =
      "Humidity: " + humidity + "%";
    document.querySelector(".wind").innerText =
      "Wind speed: " + speed + " km/h";
    document.querySelector(".weather").classList.remove("loading");
    console.log(
      "https://source.unsplash.com/1600x900/?" + urlSpecifiedDescription
    );
    document.body.style.backgroundImage =
      "url('https://source.unsplash.com/1600x900/?" +
      urlSpecifiedDescription +
      "')";
  },
  search: function () {
    this.fetchWeather(document.querySelector(".search-bar")?.value);
  },
};

document.querySelector(".search button").addEventListener("click", function () {
  weather.search();
});

document
  .querySelector(".search-bar")
  .addEventListener("keyup", function (event) {
    if (event.key == "Enter") {
      weather.search();
    }
  });

// weather.fetchWeather("Denver");

const startupWeb = () => {
  fetch("/preconnect")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      if (data?.preconnect_city) {
        weather.fetchWeather(data.preconnect_city);
      } else if (data?.preconnect_city === undefined) {
        weather.fetchWeather("Denver");
      } else {
        alert("something went wrong...");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("An error occurred while fetching weather data.");
    });
};
startupWeb();
