var cityHistory = $("#city-history");
var forecastCardsSection = $("#forecast-cards");
var detailsBoard = $("#details-board");
var cityHistoryBtnsArr = [];
var cityInput = $("#search");
var date = new Date();

function populateCityHistory(cityName) {
  $(".history-btn").remove();

  if (cityName !== $(".city-history").children().innerText) {
    cityHistoryBtnsArr.unshift(cityName);
  }

  for (var i = 0; i < cityHistoryBtnsArr.length; i++) {
    var cityHistoryBtns = $("<button></button>")
      .text(cityHistoryBtnsArr[i])
      .attr("id", "history-btn" + i)
      .addClass("history-btn btn btn-secondary col-10 ");
    cityHistory.append(cityHistoryBtns);
  }

  saveHistory();
}

function printCurrentWeather(
  cityName,
  currentTemp,
  currentWind,
  currentHumidity,
  currentUVI,
  currentWeatherType
) {
  var detailsChildren = detailsBoard.children();
  detailsChildren.remove();

  var cityNamePrint = $(
    "<h1>" + cityName + " " + date.toDateString() + "</h1>"
  );
  var currentTempPrint = $("<h4>Temp: " + currentTemp + `°F</h4>`);
  var currentWindPrint = $("<h4>Wind Speed: " + currentWind + " MPH</h4>");
  var currentHumidityPrint = $("<h4>Humidity: " + currentHumidity + "%</h4>");

  /* else if statement to determine UV rating */
  if (currentUVI < 3) {
    var currentUVIPrint = $(
      `<h4>UVI: ` + `<span class="good">` + currentUVI + "</span></h4>"
    );
  } else if (currentUVI < 6) {
    var currentUVIPrint = $(
      `<h4">UVI: ` + `<span class="moderate">` + currentUVI + "</span></h4>"
    );
  } else if (currentUVI < 8) {
    var currentUVIPrint = $(
      `<h4>UVI: ` + `<span class="high">` + currentUVI + "</span></h4>"
    );
  } else if (currentUVI < 11) {
    var currentUVIPrint = $(
      `<h4>UVI: ` + `<span class="very-high">` + currentUVI + "</span></h4>"
    );
  } else if (currentUVI >= 11) {
    var currentUVIPrint = $(
      `<h4>UVI: ` + `<span class="extreme">` + currentUVI + "</span></h4>"
    );
  }

  // var currentUVIPrint = $("<h4>UVI: " + currentUVI + "</h4>");
  var currentWeatherTypePrint = $("<h4>" + currentWeatherType + "</h4>")
    .addClass("current-weather-type")
    .attr("id", "current-weather-type");

  if (currentWeatherType == "Clouds") {
    var cloudyIcon = $('<ion-icon name="cloudy-outline"></ion-icon>');
    currentWeatherTypePrint.append(cloudyIcon);
  } else if (currentWeatherType == "Rain") {
    var rainIcon = $('<ion-icon name="rainy-outline"></ion-icon>');
    currentWeatherTypePrint.append(rainIcon);
  } else if (currentWeatherType == "Clear") {
    var clearIcon = $('<ion-icon name="sunny-outline"></ion-icon>');
    currentWeatherTypePrint.append(clearIcon);
  } else {
    var otherIcon = $('<ion-icon name="partly-sunny-outline"></ion-icon>');
    currentWeatherTypePrint.append(otherIcon);
  }

  detailsBoard.append(
    cityNamePrint,
    currentTempPrint,
    currentWindPrint,
    currentHumidityPrint,
    currentUVIPrint,
    currentWeatherTypePrint
  );
}
/* API call to get lat and lon to use in openweatherAPI call */

var getLocation = function (cityInput) {
  var cityName = cityInput.val();
  populateCityHistory(cityName);
  fetch(
    "https://api.opencagedata.com/geocode/v1/json?q=" +
      cityName +
      "&key=03629b132abc454eadfbd6bcd074abf8"
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const lat = data.results[0].bounds.northeast.lat;
      const lon = data.results[0].bounds.northeast.lng;
      const cityNameData = data.results[0].components.city;

      getData(lat, lon, cityNameData);
    });
};

/* end API call for lat and lon


/* API call to get weather data */

var getData = function (lat, lon, cityNameData) {
  fetch(
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
      lat +
      "&lon=" +
      lon +
      "&exclude=minutely,hourly&units=imperial&appid=2ced79eefc96c12374c91b18299a5bd7"
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const currentTemp = data.current.temp;
      const currentWind = data.current.wind_speed;
      const currentHumidity = data.current.humidity;
      const currentUVI = data.current.uvi;
      const currentWeatherType = data.current.weather[0].main;
      printCurrentWeather(
        cityNameData,
        currentTemp,
        currentWind,
        currentHumidity,
        currentUVI,
        currentWeatherType
      );

      for (var i = 1; i < 6; i++) {
        var date = data.daily[i].dt;
        var utcDate = new Date(date * 1000);
        var options = {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        };
        var finalDate = utcDate.toLocaleDateString("en-US", options);
        const currentTemp = parseInt(data.daily[i].temp.day);
        const currentWind = parseInt(data.daily[i].wind_speed);
        const currentHumidity = data.daily[i].humidity;
        const currentUVI = data.daily[i].uvi;
        const currentWeatherType = data.daily[i].weather[0].main;
        createForecastCards(
          finalDate,
          currentTemp,
          currentWind,
          currentHumidity,
          currentUVI,
          currentWeatherType
        );
      }
    });
};

/* end of API call to get openweather data */

/* function to create forecast cards */

var createForecastCards = function (
  finalDate,
  currentTemp,
  currentWind,
  currentHumidity,
  currentUVI,
  currentWeatherType,
  containerChildren,
  cardContainer
) {
  var cardContainer = $('<li class="">').addClass("forecast-card");
  var date = $("<strong>" + finalDate + "</strong>");
  var dailyTempPrint = $("<p>Temp: " + currentTemp + "°F</p>");
  var dailyWindPrint = $("<p>Wind: " + currentWind + " MPH</p>");
  var dailyHumidityPrint = $("<p>Humidity: " + currentHumidity + "%</p>");
  var dailyWeatherTypePrint = $("<p>" + currentWeatherType + "</p>")
    .addClass("current-weather-type")
    .attr("id", "current-weather-type");

  if (currentWeatherType == "Clouds") {
    var cloudyIcon = $('<ion-icon name="cloudy-outline"></ion-icon>');
    dailyWeatherTypePrint.append(cloudyIcon);
  } else if (currentWeatherType == "Rain") {
    var rainIcon = $('<ion-icon name="rainy-outline"></ion-icon>');
    dailyWeatherTypePrint.append(rainIcon);
  } else if (currentWeatherType == "Clear") {
    var clearIcon = $('<ion-icon name="sunny-outline"></ion-icon>');
    dailyWeatherTypePrint.append(clearIcon);
  } else {
    var otherIcon = $('<ion-icon name="partly-sunny-outline"></ion-icon>');
    dailyWeatherTypePrint.append(otherIcon);
  }
  cardContainer.append(
    date,
    dailyTempPrint,
    dailyWindPrint,
    dailyHumidityPrint,
    dailyWeatherTypePrint
  );
  forecastCardsSection.append(cardContainer);
};

/* end of function to create forecast cards */

var saveHistory = function () {
  localStorage.setItem("city-history", JSON.stringify(cityHistoryBtnsArr));
};

var loadHistory = function () {
  var savedHistory = localStorage.getItem("city-history");

  if (!savedHistory) {
    return false;
  }

  savedHistory = JSON.parse(savedHistory);

  for (var i = 0; i < savedHistory.length; i++) {
    cityHistoryBtnsArr[i] = savedHistory[i];
  }

  for (var i = 0; i < cityHistoryBtnsArr.length; i++) {
    var cityHistoryBtns = $("<button></button>")
      .text(cityHistoryBtnsArr[i])
      .attr("id", "history-btn" + i)
      .addClass("history-btn btn btn-secondary col-9 p-2");
    cityHistory.append(cityHistoryBtns);
  }
};

$("#search-btn").on("click", function () {
  $(".card-container").remove();
  getLocation(cityInput);
});

$("#city-history").on("click", function (event) {
  $(".history-btn").remove();
  var value = event.target.innerText.trim();
  $(".search-bar").val(value);
  var containerChildren = forecastCardsSection.children();
  containerChildren.remove();
  getLocation(cityInput);
});

$("#clear-btn").click(function () {
  cityHistoryBtnsArr = [];
  saveHistory();
  populateCityHistory();
});

loadHistory();
