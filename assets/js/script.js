var searchLogContainer = document.querySelector("#search-log-container")
var todayForecastContainerEl = document.querySelector("#today-forecast-container");
var fiveForecastContainerEl = document.querySelector("#5-day-forecast-container");

var getForecast = function(city) {

    // format the OpenWeather API url
    var apiURL = "api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=2ced79eefc96c12374c91b18299a5bd7";

    // make a request to the URL
    fetch(apiURL)
        .then(function(response) {
            // request was successful
            if (response.ok) {
                response.json().then(function(data) {
                    // console log to test
                    console.log(data);
                    
                })
            }
        })
}

var userFormEl = document.querySelector("")

var formSubmitHandler = function(event) {
    event.preventDefault();

    // Get value from input element
    var city
}