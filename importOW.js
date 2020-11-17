import WEATHER_API_KEY from "./apikey.js";

console.log(WEATHER_API_KEY);

document.getElementById("ImportWeather").onclick = function()
{
    const city = document.getElementById("cityName").value;
    const state = document.getElementById("stateCode").value;
    const zip = document.getElementById("zipCode").value;
    
    const fetUrl = formatAPIURL(city, state, zip);
        
    if(fetUrl != "false")
    {
        ImportTest(fetUrl);
        console.log(fetUrl);
    }
}

async function ImportTest(URL)
{
    console.log("eyyy, it works!");
    
    const response = await fetch(URL);
    const theData = await response.json();

    drawWeather(theData);
}

function formatAPIURL(city, state, zip)
{
    console.log(city);
    console.log(state);
    console.log(zip);

    if(city != "" && state != "")
    {
        return "https://api.openweathermap.org/data/2.5/weather?q=" + city + "," + state + ",us&appid=" + WEATHER_API_KEY;
    }
    else if(city != "")
    {
        return "https://api.openweathermap.org/data/2.5/weather?q=" + city + ",us&appid=" + WEATHER_API_KEY;
    }
    else if(zip != "")
    {
        return "https://api.openweathermap.org/data/2.5/weather?zip=" + zip + ",us&appid=" + WEATHER_API_KEY;
    }
    else 
    {
        return "false";
    }
}

function drawWeather( weatherData ) 
{
    var fahrenheit = Math.round(((parseFloat(weatherData.main.temp)-273.15)*1.8)+32); 
    var lowfar = Math.round(((parseFloat(weatherData.main.temp_min)-273.15)*1.8)+32); 
    var maxfar = Math.round(((parseFloat(weatherData.main.temp_max)-273.15)*1.8)+32); 
	
	document.getElementById('description').innerHTML = weatherData.weather[0].description;
    document.getElementById('temp').innerHTML = fahrenheit + '&deg;';
    document.getElementById('humidity').innerHTML = weatherData.main.humidity + "%";
    document.getElementById('mintemp').innerHTML = "Low: " + lowfar + '&deg;';
    document.getElementById('maxtemp').innerHTML = "High: " + maxfar + '&deg;';
    document.getElementById('windspeed').innerHTML = weatherData.wind.speed + " mph";
    document.getElementById('location').innerHTML = weatherData.name;
    
    if(weatherData.weather[0].description.indexOf('rain') > 0 ) 
    {
        document.body.className = 'rainy';
    } 
    else if(weatherData.weather[0].description.indexOf('cloud') > 0 ) 
    {
        document.body.className = 'cloudy';
    } 
    else if(weatherData.weather[0].description.indexOf('sunny') > 0 ) 
    {
        document.body.className = 'sunny';
    }
}