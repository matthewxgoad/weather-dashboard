
// GLOBAL VARIABLES //

let searchBtn = document.getElementById('search-btn');
let userInput = document.getElementById('search-input');
let citiesListEl = document.getElementById('citiesListEl');
let currentCityNameEl = document.getElementById('currentCityNameEl');
let currentDateEl = document.getElementById('currentDateEl');
let currentCityTempEl = document.getElementById('currentCityTempEl');
let currentCityHumEl = document.getElementById('currentCityHumEl');
let currentCityWindEl = document.getElementById('currentCityWindEl');
let currentCityUVEl = document.getElementById('currentCityUVEl');
let currentCityImgEl = document.getElementById('current-icon-container');
let fiveDayCardsEl = document.getElementById('fiveDayCardsEl');

// FUNCTIONS //

// Takes user input and sends it to findLatLon function
function processSearchBtn() {
    let city = userInput.value;
    findLatLon(city);
}
// Stores useer input to localStorage
function storeCityLocal(city) {
    localStorage.setItem(city, city);
}
// Retrieves latitude and longitude coordinates to send to OneCall API
// Validates that user input is a known city name
function findLatLon(city) {
    let key = '9425b5446dc273556c5b70a438f84526';
    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + key )
    .then(function(resp) { 
        return resp.json();  // Convert data to json
    })
    .then(function(data) {
        if (data.cod == 404) alert('Invalid city name.'); 
        // retreive lat and long and return for another function to use
        let cityLat = data.coord.lat;
        let cityLong = data.coord.lon;
        getWeather(cityLat, cityLong);
    })
}
// Uses lat and lon to retreive weather data and convert to json
// Removes previously created city buttons to prevent duplicates
// Sends weather data to insertWeatherData function
function getWeather( lat, lon ) {
    let key = '9425b5446dc273556c5b70a438f84526';
    fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&units=imperial' + '&appid=' + key )
    .then(function(resp) {
        return resp.json();
    })
    .then(function(data) {
        insertWeatherData(data);
    })
    storeCityLocal(userInput.value);
    removeButtons();
    getStoredCities();
}
// Inserts weeather data to id elements on index.html
function insertWeatherData( weather ) {
    // CURRENT DAY WEATHER DATA
    currentCityNameEl.innerHTML = userInput.value;
    currentDateEl.innerHTML = convertUnixDate(weather.current.dt);
    currentCityTempEl.innerHTML = weather.current.temp + "ºF";
    currentCityHumEl.innerHTML = weather.current.humidity + "&percnt;";
    currentCityWindEl.innerHTML = weather.current.wind_speed + "mph";
    currentCityUVEl.innerHTML = weather.current.uvi; // update text bg color based on value
    // changes UV element based on high, low, ok values
    if (weather.current.uvi < 3) {
        currentCityUVEl.classList.add('uvLow')
    } else if (weather.current.uvi > 9) {
        currentCityUVEl.classList.add('uvHigh')
    } else {
        currentCityUVEl.classList.add('uvOK')
    }
    currentCityImgEl.innerHTML = '<img src="https://openweathermap.org/img/wn/' + weather.current.weather[0].icon + '@2x.png" alt="current weather">';
    // FIVE DAY DATE DATA 
    document.getElementById('dayOneDate').innerHTML = convertUnixDate(weather.daily[1].dt);
    document.getElementById('dayTwoDate').innerHTML = convertUnixDate(weather.daily[2].dt);
    document.getElementById('dayThreeDate').innerHTML = convertUnixDate(weather.daily[3].dt);
    document.getElementById('dayFourDate').innerHTML = convertUnixDate(weather.daily[4].dt);
    document.getElementById('dayFiveDate').innerHTML = convertUnixDate(weather.daily[5].dt);
    // FIVE DAY IMAGE DATA 
    document.getElementById('dayOneImg').innerHTML = '<img src="https://openweathermap.org/img/wn/' + weather.daily[1].weather[0].icon + '.png" alt="weather forecast">';
    document.getElementById('dayTwoImg').innerHTML = '<img src="https://openweathermap.org/img/wn/' + weather.daily[2].weather[0].icon + '.png" alt="weather forecast">';
    document.getElementById('dayThreeImg').innerHTML = '<img src="https://openweathermap.org/img/wn/' + weather.daily[3].weather[0].icon + '.png" alt="weather forecast">';
    document.getElementById('dayFourImg').innerHTML = '<img src="https://openweathermap.org/img/wn/' + weather.daily[4].weather[0].icon + '.png" alt="weather forecast">';
    document.getElementById('dayFiveImg').innerHTML = '<img src="https://openweathermap.org/img/wn/' + weather.daily[5].weather[0].icon + '.png" alt="weather forecast">';
    // FIVE DAY TEMP DATA 
    document.getElementById('dayOneTemp').innerHTML = weather.daily[1].temp.day;
    document.getElementById('dayTwoTemp').innerHTML = weather.daily[2].temp.day;
    document.getElementById('dayThreeTemp').innerHTML = weather.daily[3].temp.day;
    document.getElementById('dayFourTemp').innerHTML = weather.daily[4].temp.day;
    document.getElementById('dayFiveTemp').innerHTML = weather.daily[5].temp.day;
    // FIVE DAY HUMIDITY DATA 
    document.getElementById('dayOneHum').innerHTML = weather.daily[1].humidity;
    document.getElementById('dayTwoHum').innerHTML = weather.daily[2].humidity;
    document.getElementById('dayThreeHum').innerHTML = weather.daily[3].humidity;
    document.getElementById('dayFourHum').innerHTML = weather.daily[4].humidity;
    document.getElementById('dayFiveHum').innerHTML = weather.daily[5].humidity;
}    
// Pulls previously input city names from local and creates buttons in sidebar
function getStoredCities() {
    for( i = 0 ; i < localStorage.length && i < 12 ; i++) { // maximum 12 buttons
        let newListItem = document.createElement('button');
        newListItem.classList.add('btn', 'btn-success', 'btn-lg', 'btn-block');
        newListItem.innerHTML = localStorage.key(i);
        citiesListEl.appendChild(newListItem);
        newListItem.addEventListener("click", function(){
            processCityClick(newListItem.innerHTML)}
        )
    }
}
// When user clicks city button in sidebar this starts the API calls again
function processCityClick( city ) {
    userInput.value = city;
    findLatLon(city);
}
// Utility function to convert UNIX date format to Human Date Format
function convertUnixDate (datecode) {
    return new Date(datecode * 1000).toLocaleDateString();
}
// Utility function used to remove existing buttons and prevent duplicates
function removeButtons() {
    while (citiesListEl.firstChild) {
        citiesListEl.removeChild(citiesListEl.firstChild);
    }
}
// EVENT LISTENERS //

searchBtn.addEventListener("click", processSearchBtn);
userInput.addEventListener("keypress", function(e) {
    if(e.key === 'Enter') 
    processSearchBtn(); 
});

document.onload = getStoredCities();
