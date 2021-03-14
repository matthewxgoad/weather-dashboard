
// GLOBAL VARIABLES //

let searchBtn = document.getElementById('search-btn');
let userInput = document.getElementById('search-input');
let citiesListEl = document.getElementById('citiesListEl');

let currentCityNameEL = document.getElementById('currentCityNameEl');
let currentCityTempEL = document.getElementById('currentCityTempEL');
let currentCityHumEL = document.getElementById('currentCityHumEL');
let currentCityWindEL = document.getElementById('currentCityWindEL');
let currentCityUVEL = document.getElementById('currentCityUVEL');

let fiveDayCardsEl = document.getElementById('fiveDayCardsEl');


// FUNCTIONS //

function searchSubmit( city ) {
    let key = '94a285a187fcf3f23d86661eee8a123d';
    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + key )
    .then(function(resp) { 
        // processSearchResponse
        console.log(resp);
        return resp.json()  // Convert data to json
    })
    .then(function(data) {
        console.log(data);
    })
    .catch(function() {
        // catch any errors
    })

    // localStorage.setItem(userInput);
}
function processSearchBtn() {
    let city = userInput.value;
    // validation
    // localStorage.setItem(city); // store city to local
    searchSubmit(city);
}





// EVENT LISTENERS //

searchBtn.addEventListener("click", processSearchBtn);
userInput.addEventListener("keypress", function(e) {
    if(e.key === 'Enter') 
    processSearchBtn(); 
});

// window.onload = function() {
//     searchSubmit('Memphis');
// }



// When user clicks buttons
// read the city name from input
// pass into searchSubmit fuction
// add to localStorage