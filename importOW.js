const WEATHER_API_KEY = "7ea5590e4a6f42e2125ce4350764445b";

document.getElementById("ImportWeather").onclick = function()
{
    const city = document.getElementById("cityName").value;
    const state = document.getElementById("stateCode").value;
    const zip = document.getElementById("zipCode").value;
    
    const fetCurrUrl = formatCurrAPIURL(city, state, zip);
        
    if(fetCurrUrl != "false")
    {
        console.log(fetCurrUrl);
        ImportCurrent(fetCurrUrl);
    }
}

async function ImportCurrent(URL)
{
    const response = await fetch(URL);
    const theData = await response.json();

    drawCurrentWeather(theData);
    ImportExtended(theData.coord.lat,theData.coord.lon);
}

async function ImportExtended(lat, lon)
{
    const URL = 'https://api.openweathermap.org/data/2.5/onecall?lat='+lat +'&lon='+lon+'&exclude=minutely,hourly,alerts&units=imperial&appid=' + WEATHER_API_KEY;
    console.log(URL);
    const response = await fetch(URL);
    const theData = await response.json();

    drawFiveDayWeather(theData);
}

function formatCurrAPIURL(city, state, zip)
{
    if(city != "" && state != "")
    {
        return "https://api.openweathermap.org/data/2.5/weather?q=" + city + "," + state + ",us&units=imperial&appid=" + WEATHER_API_KEY;
    }
    else if(city != "")
    {
        return "https://api.openweathermap.org/data/2.5/weather?q=" + city + ",us&units=imperial&appid=" + WEATHER_API_KEY;
    }
    else if(zip != "")
    {
        return "https://api.openweathermap.org/data/2.5/weather?zip=" + zip + ",us&units=imperial&appid=" + WEATHER_API_KEY;
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
    const iconSource = "http://openweathermap.org/img/wn/" + weatherData.weather[0].icon + "@2x.png";
    newImage.setAttribute('alt', weatherData.weather.description); 
    newImage.setAttribute('src', iconSource);
    newImage.setAttribute('style', "width: 10vh;");
    document.getElementById('current-image').appendChild(newImage);

    document.getElementById('temp').innerHTML = "Current: " + parseInt(weatherData.main.temp) + '&deg;';
    document.getElementById('humidity').innerHTML = "Humidity: " + weatherData.main.humidity + "%";
    document.getElementById('mintemp').innerHTML = "Low: " + parseInt(weatherData.main.temp_min) + '&deg;';
    document.getElementById('maxtemp').innerHTML = "High: " + parseInt(weatherData.main.temp_max) + '&deg;';
    document.getElementById('windspeed').innerHTML = "Wind speed: " + weatherData.wind.speed + " mph";
    document.getElementById('location').innerHTML = "Location: " + weatherData.name;
}

function drawFiveDayWeather(weatherData)
{
    /*<div id="div-ext-1" class="five-day-iconAndText">
                    <div id="ext-1-img"></div>
                    <h3 id="ext-1-low"></h3>
                    <h3 id="ext-1-high"></h3>
                    <h3 id="ext-1-day"></h3>
                </div>*/

    //

    //Day 1
    document.getElementById('ext-1-low').innerHTML = "Low: " + parseInt(weatherData.daily[0].temp.min) + '&deg;';
    document.getElementById('ext-1-high').innerHTML = "High: " + parseInt(weatherData.daily[0].temp.max) + '&deg;';
    document.getElementById('ext-1-day').innerHTML = DayOfTheWeek(1);
    
    //Day 2
    document.getElementById('ext-2-low').innerHTML = "Low: " + parseInt(weatherData.daily[1].temp.min) + '&deg;';
    document.getElementById('ext-2-high').innerHTML = "High: " + parseInt(weatherData.daily[1].temp.max) + '&deg;';
    document.getElementById('ext-2-day').innerHTML = DayOfTheWeek(2);
    
    //Day 3
    document.getElementById('ext-3-low').innerHTML = "Low: " + parseInt(weatherData.daily[2].temp.min) + '&deg;';
    document.getElementById('ext-3-high').innerHTML = "High: " + parseInt(weatherData.daily[2].temp.max) + '&deg;';
    document.getElementById('ext-3-day').innerHTML = DayOfTheWeek(3);
    
    //Day 4
    document.getElementById('ext-4-low').innerHTML = "Low: " + parseInt(weatherData.daily[3].temp.min) + '&deg;';
    document.getElementById('ext-4-high').innerHTML = "High: " + parseInt(weatherData.daily[3].temp.max) + '&deg;';
    document.getElementById('ext-4-day').innerHTML = DayOfTheWeek(4);
    
    //Day 5
    document.getElementById('ext-5-low').innerHTML = "Low: " + parseInt(weatherData.daily[4].temp.min) + '&deg;';
    document.getElementById('ext-5-high').innerHTML = "High: " + parseInt(weatherData.daily[4].temp.max) + '&deg;';
    document.getElementById('ext-5-day').innerHTML = DayOfTheWeek(5);
}

function DayOfTheWeek(day)
{
    var d = new Date();
    var weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    if(d.getDay() + day > 6)
    {
        return weekday[(d.getDay() + day) - 6];
    }
    else
    {
        return weekday[d.getDay() + day];
    }
}