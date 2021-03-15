
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
function insertWeatherData( weather ) {
    // CURRENT DAY WEATHER DATA
    currentCityNameEl.innerHTML = userInput.value;
    currentDateEl.innerHTML = convertUnixDate(weather.current.dt);
    currentCityTempEl.innerHTML = weather.current.temp;
    currentCityHumEl.innerHTML = weather.current.humidity;
    currentCityWindEl.innerHTML = weather.current.wind_speed;
    currentCityUVEl.innerHTML = weather.current.uvi; // update text bg color based on value
    if (weather.current.uvi < 3) {
        currentCityUVEl.classList.add('uvLow')
    } else if (weather.current.uvi > 9) {
        currentCityUVEl.classList.add('uvHigh')
    } else {
        currentCityUVEl.classList.add('uvOK')
    }
    currentCityImgEl.innerHTML = '<img src="http://openweathermap.org/img/wn/' + weather.current.weather[0].icon + '@2x.png" alt="current weather">';
    // FIVE DAY DATE DATA 
    document.getElementById('dayOneDate').innerHTML = convertUnixDate(weather.daily[1].dt);
    document.getElementById('dayTwoDate').innerHTML = convertUnixDate(weather.daily[2].dt);
    document.getElementById('dayThreeDate').innerHTML = convertUnixDate(weather.daily[3].dt);
    document.getElementById('dayFourDate').innerHTML = convertUnixDate(weather.daily[4].dt);
    document.getElementById('dayFiveDate').innerHTML = convertUnixDate(weather.daily[5].dt);
    // FIVE DAY IMAGE DATA 
    document.getElementById('dayOneImg').innerHTML = '<img src="http://openweathermap.org/img/wn/' + weather.daily[1].weather[0].icon + '.png" alt="weather forecast">';
    document.getElementById('dayTwoImg').innerHTML = '<img src="http://openweathermap.org/img/wn/' + weather.daily[2].weather[0].icon + '.png" alt="weather forecast">';
    document.getElementById('dayThreeImg').innerHTML = '<img src="http://openweathermap.org/img/wn/' + weather.daily[3].weather[0].icon + '.png" alt="weather forecast">';
    document.getElementById('dayFourImg').innerHTML = '<img src="http://openweathermap.org/img/wn/' + weather.daily[4].weather[0].icon + '.png" alt="weather forecast">';
    document.getElementById('dayFiveImg').innerHTML = '<img src="http://openweathermap.org/img/wn/' + weather.daily[5].weather[0].icon + '.png" alt="weather forecast">';
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
// Use to convert UNIX date format to Human Date Format
function convertUnixDate (datecode) {
    return new Date(datecode * 1000).toLocaleDateString();
}
function getStoredCities() {
    for( i = 0 ; i < localStorage.length && i < 8 ; i++) {
        let newListItem = document.createElement('button');
        newListItem.classList.add('btn', 'btn-success', 'btn-lg', 'btn-block');
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