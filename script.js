var APIKEY = "6b0dda0b663b325846af6befdb139837"

window.onload = function() {
    var weatherBoy = document.getElementById('weatherBoy');
    if (weatherBoy) {
        weatherBoy.classList.add('weatherBoyMoves');
    }
};


document.getElementById("coordinateForm").addEventListener("submit", function(event) {
    event.preventDefault(); 
    var cityName = document.getElementById("cityName").value;
    var stateCode = document.getElementById("stateCode").value;
    var countryCode = document.getElementById("countryCode").value;
    getCoordinates(cityName, stateCode, countryCode);
});

function getCoordinates(cityName, stateCode, countryCode) {
    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName},${stateCode},${countryCode}&limit=1&appid=${APIKEY}`;

    fetch(url)
    .then(response => response.json())
    .then(data => {
        document.getElementById('weatherData').textContent = JSON.stringify(forecastData);
        .then(forecastData => {
            let displayText = '';
            forecastData.list.forEach(item => {
                displayText += `Date: ${item.dt_txt}, Temp: ${item.main.temp}°C, Weather: ${item.weather[0].description}\n`;
            });
            document.getElementById('weatherData').textContent = displayText;
        })
    })
    .catch(error => {
        window.alert('Error:', error);
    });
}

let pastSearches = []

document.getElementById