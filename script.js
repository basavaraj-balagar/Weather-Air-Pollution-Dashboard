const apiKey = "9c4b6b93-8466-43b8-a8a2-940d78dee653";
const countrySelect = document.getElementById("country");
const stateSelect = document.getElementById("state");
const citySelect = document.getElementById("city");
const applyButton = document.getElementById("apply-button");
const weatherDataDiv = document.getElementById("weather-data");

async function fetchData(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

async function loadCountries() {
    const url = `https://api.airvisual.com/v2/countries?key=${apiKey}`;
    const data = await fetchData(url);
    // console.log(data.data.message);
    if (data && data.status === "success") {
        countrySelect.innerHTML = '<option value="">Select Country</option>';
        data.data.forEach(country => {
            countrySelect.innerHTML += `<option value="${country.country}">${country.country}</option>`;
        });
    }
    else if (data.status === "fail" && data.data.message == "Too Many Requests") {
        alert("As Free version of the API is being used in this project, Wail 10 seconds & refresh the page.")
    }
}

async function loadStates() {
    const country = countrySelect.value;
    if (!country) return "County value error";

    const url = `https://api.airvisual.com/v2/states?country=${country}&key=${apiKey}`;
    const data = await fetchData(url);
    // console.log(data.data.message);
    if (data && data.status === "success") {
        stateSelect.innerHTML = '<option value="">Select State</option>';
        data.data.forEach(state => {
            stateSelect.innerHTML += `<option value="${state.state}">${state.state}</option>`;
        });
    }
    else if (data.status === "fail" && data.data.message == "Too Many Requests") {
        alert("As Free version of the API is being used in this project, Wail 10 seconds & refresh the page.")
    }
}

async function loadCities() {
    const country = countrySelect.value;
    const state = stateSelect.value;
    if (!state) return;

    const url = `https://api.airvisual.com/v2/cities?state=${state}&country=${country}&key=${apiKey}`;
    const data = await fetchData(url);
    // console.log(data.data.message);
    if (data && data.status === "success") {
        citySelect.innerHTML = '<option value="">Select City</option>';
        data.data.forEach(city => {
            citySelect.innerHTML += `<option value="${city.city}">${city.city}</option>`;
        });
    }
    else if (data.status === "fail" && data.data == `{"message":"Too Many Requests"}`) {
        alert("As Free version of the API is being used in this project, Wail 10 seconds & refresh the page.")
    }
}

async function fetchCityData() {
    const country = countrySelect.value;
    const state = stateSelect.value;
    const city = citySelect.value;
    if (!city) return;

    const url = `https://api.airvisual.com/v2/city?city=${city}&state=${state}&country=${country}&key=${apiKey}`;
    const data = await fetchData(url);

    if (data && data.status === "success") {
        const location = data.data.location;
        const pollution = data.data.current.pollution;
        const weather = data.data.current.weather;

        document.getElementById("city-name").textContent = `City: ${data.data.city}`;
        document.getElementById("state-name").textContent = `State: ${data.data.state}`;
        document.getElementById("country-name").textContent = `Country: ${data.data.country}`;
        document.getElementById("coordinates").textContent = `Coordinates: ${location.coordinates[0]}, ${location.coordinates[1]}`;

        document.getElementById("aqius").textContent = `AQI (US): ${pollution.aqius}`;
        document.getElementById("mainus").textContent = `Main Pollutant (US): ${pollution.mainus}`;
        document.getElementById("aqicn").textContent = `AQI (CN): ${pollution.aqicn}`;
        document.getElementById("maincn").textContent = `Main Pollutant (CN): ${pollution.maincn}`;

        document.getElementById("ts").textContent = `Last Updated: ${weather.ts}`;
        document.getElementById("tp").textContent = `Temperature: ${weather.tp}°C`;
        document.getElementById("pr").textContent = `Pressure: ${weather.pr} hPa`;
        document.getElementById("hu").textContent = `Humidity: ${weather.hu}%`;
        document.getElementById("ws").textContent = `Wind Speed: ${weather.ws} m/s`;
        document.getElementById("wd").textContent = `Wind Direction: ${weather.wd}°`;
        document.getElementById("ic").textContent = `Weather Icon: ${weather.ic}`;

        weatherDataDiv.style.display = "block";
        generateCharts(weather, pollution);
    }
}

function generateCharts(weather, pollution) {
    const weatherCtx = document.getElementById("weather-chart").getContext("2d");
    const pollutionCtx = document.getElementById("pollution-chart").getContext("2d");

    new Chart(weatherCtx, {
        type: "bar",
        data: {
            labels: ["Temperature (°C)", "Humidity (%)", "Pressure (hPa)", "Wind Speed (m/s)"],
            datasets: [{
                label: "Weather Data",
                data: [weather.tp, weather.hu, weather.pr, weather.ws],
                backgroundColor: ["#3498db", "#2ecc71", "#f39c12", "#e74c3c"],
                borderWidth: 1
            }]
        }
    });

    new Chart(pollutionCtx, {
        type: "doughnut",
        data: {
            labels: ["AQI (US)", "AQI (CN)"],
            datasets: [{
                label: "Pollution Data",
                data: [pollution.aqius, pollution.aqicn],
                backgroundColor: ["#8e44ad", "#e67e22"],
                borderWidth: 1
            }]
        }
    });
}

countrySelect.addEventListener("change", loadStates);
stateSelect.addEventListener("change", loadCities);
applyButton.addEventListener("click", fetchCityData);

loadCountries();

