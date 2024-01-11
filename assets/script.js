var APIKEY = "6b0dda0b663b325846af6befdb139837";

window.onload = function () {
    var weatherBoy = document.getElementById('weatherBoy');
    if (weatherBoy) {
        weatherBoy.classList.add('weatherBoyMoves');
    }
};

document.getElementById("coordinateForm").addEventListener("submit", function (event) {
    event.preventDefault();
    var cityName = document.getElementById("cityName").value;
    var stateCode = document.getElementById("stateCode").value;
    var countryCode = document.getElementById("countryCode").value;
    getCoordinates(cityName, stateCode, countryCode);
    saveSearch(cityName, stateCode, countryCode);
});

function getCoordinates(cityName, stateCode, countryCode) {
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName},${stateCode},${countryCode}&limit=1&appid=${APIKEY}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const { lat, lon } = data[0];
                fetchCurrentWeather(lat, lon);
                fetchWeeklyForecast(lat, lon);
            } else {
                throw new Error("Location not found");
            }
        })
        .catch(error => {
            window.alert('Error: ' + error.message);
        });
}

function fetchCurrentWeather(lat, lon) {
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKEY}&units=metric`;
    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            displayCurrentWeather(data);
        })
        .catch(error => {
            console.error('Error:', error);
            window.alert('Error fetching current weather: ' + error.message);
        });
}

function displayCurrentWeather(data) {
    const currentWeatherDiv = document.getElementById('weatherData');
    currentWeatherDiv.innerHTML = `
    <div id="weatherDisplay">
        <h3>${data.name}</h3>
        <p>🌡 ${data.main.temp} °C</p>
        <p>🌤 ${data.weather[0].description}</p>
        <p>☁ ${data.main.humidity}%</p>
        <p>🌫 ${data.wind.speed} m/s</p>
        </div>`;
}

function displayWeeklyForecast(data) {
    const weeklyForecastDiv = document.getElementById('weeklyData');
    weeklyForecastDiv.innerHTML = '<h2></h2>';

    // Object to hold the earliest forecast for each day
    let dailyForecasts = {};

    // Process each forecast
    data.list.forEach(forecast => {
        const date = new Date(forecast.dt * 1000);
        const dateString = date.toISOString().split('T')[0]; // Get date as 'YYYY-MM-DD'

        // If this date hasn't been added yet, or this forecast is earlier in the day
        if (!dailyForecasts[dateString] || date < new Date(dailyForecasts[dateString].dt * 1000)) {
            dailyForecasts[dateString] = forecast;
        }
    });

    // Display each day's forecast
    for (let date in dailyForecasts) {
        const forecast = dailyForecasts[date];
        weeklyForecastDiv.innerHTML += `
            <div class="dayData">
                <h3>${new Date(forecast.dt * 1000).toLocaleDateString()}</h3>
                <p>🌡 ${forecast.main.temp} °C</p>
                <p>🌤 ${forecast.weather[0].description}</p>
                <p>☁ ${forecast.main.humidity}%</p>
                <p>🌫 ${forecast.wind.speed} m/s</p>
            </div>`;
    }
}

function fetchWeeklyForecast(lat, lon) {
    const weeklyForecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKEY}&units=metric`;
    fetch(weeklyForecastUrl)
        .then(response => response.json())
        .then(data => {
            displayWeeklyForecast(data);
        })
        .catch(error => {
            console.error('Error:', error);
            window.alert('Error fetching weekly forecast: ' + error.message);
        });
}


function saveSearch(cityName, stateCode, countryCode) {
    const search = { cityName, stateCode, countryCode };
    pastSearches.push(search);
    updateSearchHistory();
}

function updateSearchHistory() {
    const historyContainer = document.getElementById('recentSearches');
    historyContainer.innerHTML = '';
    pastSearches.forEach(search => {
        const searchElement = document.createElement('div');
        searchElement.textContent = `${search.cityName} ${search.stateCode} ${search.countryCode}`;
        searchElement.className = 'savedSearch'; 
        searchElement.onclick = () => {
            getCoordinates(search.cityName, search.stateCode, search.countryCode);
        };
        historyContainer.appendChild(searchElement);
    });
}


let pastSearches = [];
