
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

function processSearchBtn() {
    let city = userInput.value;
    findLatLon(city);
}
function storeCityLocal(city) {
    localStorage.setItem(city, city);
}
function findLatLon(city) {
    let key = '94a285a187fcf3f23d86661eee8a123d';
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
function getWeather( lat, lon ) {
    let key = '94a285a187fcf3f23d86661eee8a123d';
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
function insertWeatherData( weather ) {
    // CURRENT DAY WEATHER DATA
    currentCityNameEl.innerHTML = userInput.value;
    currentDateEl.innerHTML = convertUnixDate(weather.current.dt);
    currentCityTempEl.innerHTML = weather.current.temp;
    currentCityHumEl.innerHTML = weather.current.humidity;
    currentCityWindEl.innerHTML = weather.current.wind_speed;
    currentCityUVEl.innerHTML = weather.current.uvi; // update text bg color based on value
    currentCityImgEl.innerHTML = '<img src="http://openweathermap.org/img/wn/' + weather.current.weather[0].icon + '@2x.png" alt="current weather">';
    // FIVE DAY WEATHER DATA 
    document.getElementById('dayOneDate').innerHTML = convertUnixDate(weather.daily[1].dt);
}
// Use to convert UNIX date format to Human Date Format
function convertUnixDate (datecode) {
    return new Date(datecode * 1000).toLocaleDateString();
}
function getStoredCities() {
    for( i = 0 ; i < localStorage.length && i < 8 ; i++) {
        let newListItem = document.createElement('button');
        newListItem.classList.add('btn');
        newListItem.innerHTML = localStorage.key(i);
        citiesListEl.appendChild(newListItem);
        newListItem.addEventListener("click", function(){
            processCityClick(newListItem.innerHTML)}
        )
    }
}
function processCityClick( city ) {
    userInput.value = city;
    findLatLon(city);
}
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


// When user clicks buttons
// read the city name from input
// pass into searchSubmit fuction
// add to localStorage

// DAILY weather.daily[0-4].
// date (converted) convertUnixDate(weather.daily[0-4].dt)
// weather icon weather.daily[0-4].weather.icon http://openweathermap.org/img/wn/xxx.png use xxx2x.png for larger icon
// temp weather.daily[0-4].temp
// humidity weather.daily[0-4].humidity