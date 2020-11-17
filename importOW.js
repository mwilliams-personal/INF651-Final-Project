import WEATHER_API_KEY from "./apikey.js";

console.log(WEATHER_API_KEY);

document.getElementById("ImportWeather").onclick = function(){
    ImportTest();
}

//Pull value from this via .value
const city = document.getElementById("cityName");
const state = document.getElementById("stateCode");
const zip = document.getElementById("zipCode");

async function ImportTest()
{
    console.log("eyyy, it works!");
    // Just City Name call
    // api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
    
    console.log(formatAPIURL());

    const response = await fetch(formatAPIURL());
    const theData = await response.json();

    console.log(theData);
    drawWeather(theData);
}

function formatAPIURL()
{
    return "https://api.openweathermap.org/data/2.5/weather?q=" + city.value + "&appid=" + WEATHER_API_KEY;
}

function drawWeather( weatherData ) 
{
	var celcius = Math.round(parseFloat(weatherData.main.temp)-273.15);
	var fahrenheit = Math.round(((parseFloat(weatherData.main.temp)-273.15)*1.8)+32); 
	
	document.getElementById('description').innerHTML = weatherData.weather[0].description;
	document.getElementById('temp').innerHTML = fahrenheit + '&deg;';
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