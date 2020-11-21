const WEATHER_API_KEY = "7ea5590e4a6f42e2125ce4350764445b";

document.getElementById("ImportWeather").onclick = function()
{
    const city = document.getElementById("cityName").value;
    const state = document.getElementById("stateCode").value;
    const zip = document.getElementById("zipCode").value;
    
    const fetUrl = formatAPIURL(city, state, zip);
        
    if(fetUrl != "false")
    {
        console.log(fetUrl);
        ImportTest(fetUrl);
    }
}

async function ImportTest(URL)
{
    const response = await fetch(URL);
    const theData = await response.json();

    drawCurrentWeather(theData);
}

function formatAPIURL(city, state, zip)
{
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

function drawCurrentWeather(weatherData) 
{
    document.getElementById('current-image').innerHTML = "";
    const newImage = document.createElement('img');
    //create img src url
    const iconSource = "http://openweathermap.org/img/wn/" + weatherData.weather[0].icon + "@2x.png";
    //set img attributes
    newImage.setAttribute('alt', weatherData.weather.description); 
    newImage.setAttribute('src', iconSource);
    newImage.setAttribute('style', "width: 10vh;");
    //append image to the parent div
    document.getElementById('current-image').appendChild(newImage);

    var fahrenheit = Math.round(((parseFloat(weatherData.main.temp)-273.15)*1.8)+32); 
    var lowfar = Math.round(((parseFloat(weatherData.main.temp_min)-273.15)*1.8)+32); 
    var maxfar = Math.round(((parseFloat(weatherData.main.temp_max)-273.15)*1.8)+32); 

    document.getElementById('temp').innerHTML = "Current: " + fahrenheit + '&deg;';
    document.getElementById('humidity').innerHTML = "Humidity: " + weatherData.main.humidity + "%";
    document.getElementById('mintemp').innerHTML = "Low: " + lowfar + '&deg;';
    document.getElementById('maxtemp').innerHTML = "High: " + maxfar + '&deg;';
    document.getElementById('windspeed').innerHTML = "Wind speed: " + weatherData.wind.speed + " mph";
    document.getElementById('location').innerHTML = "Location: " + weatherData.name;
}

drawFiveDayWeather(weatherData)
{
    
}