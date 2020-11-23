const WEATHER_API_KEY = "7ea5590e4a6f42e2125ce4350764445b";

defaultLoad();

document.getElementById("ImportWeather").onclick = function()
{
    LoadBasedOnEntry();
}

document.getElementById("cityName").addEventListener('keypress', function (e) 
{
    if (e.key === 'Enter') 
    {
        LoadBasedOnEntry();
    }
});

document.getElementById("stateCode").addEventListener('keypress', function (e) 
{
    if (e.key === 'Enter') 
    {
        LoadBasedOnEntry();
    }
});

document.getElementById("zipCode").addEventListener('keypress', function (e) 
{
    if (e.key === 'Enter') 
    {
        LoadBasedOnEntry();
    }
});

function LoadBasedOnEntry()
{
    const city = document.getElementById("cityName").value;
    const state = document.getElementById("stateCode").value;
    const zip = document.getElementById("zipCode").value;
    
    const fetCurrUrl = formatCurrAPIURL(city, state, zip);
        
    if(fetCurrUrl != "false")
    {
        ImportCurrent(fetCurrUrl);
        if(localStorage.getItem('LOCATIONSAVED') == null)
        {
            document.getElementById('DefaultSave').setAttribute('aria-label', "Save " + myStorage.getItem('LOCATIONRECENT') + " as default location");
        }
    }
}

document.getElementById("DefaultSave").onclick = function()
{
    myStorage = window.localStorage;

    if(document.getElementById('DefaultSave').innerHTML === "Save as default location")
    {
        //Need to save the default location
        const city = document.getElementById("cityName").value;
        const state = document.getElementById("stateCode").value;
        const zip = document.getElementById("zipCode").value;
        
        const fetCurrUrl = formatCurrAPIURL(city, state, zip);
        
        console.log("test");

        //Now save the fetCurrUrl as local data
        localStorage.setItem(URL, fetCurrUrl);
        localStorage.setItem('LOCATIONSAVED', city+state+zip);
        document.getElementById('DefaultSave').innerHTML = "Clear default location";
        document.getElementById('DefaultSave').setAttribute('aria-label', "Clear default location, currently set to" + localStorage.getItem('LOCATIONSAVED'));
    }
    else
    {
        document.getElementById('DefaultSave').innerHTML = "Save as default location";
        document.getElementById('DefaultSave').setAttribute('aria-label', "Save " + myStorage.getItem('LOCATIONRECENT') + " as default location");
        localStorage.clear();
    }
}

function defaultLoad()
{
    //Pull out the default location on page load and make the call if one is set
    //Load the local data saved by the Default Save on click
    myStorage = window.localStorage;
    const defURL = localStorage.getItem(URL);

    if(defURL != null)
    {
        ImportCurrent(defURL);
        document.getElementById('DefaultSave').innerHTML = "Clear default location";
        document.getElementById('DefaultSave').setAttribute('aria-label', "Clear default location, currently set to" + localStorage.getItem('LOCATIONSAVED'));
    }
    else
    {
        document.getElementById('DefaultSave').innerHTML = "Save as default location";
        document.getElementById('DefaultSave').setAttribute('aria-label', "Save " + myStorage.getItem('LOCATIONRECENT') + " as default location");
    }
}

async function ImportCurrent(URL)
{
    try
    {
        const response = await fetch(URL);
        const theData = await response.json();

        drawCurrentWeather(theData);
        ImportExtended(theData.coord.lat,theData.coord.lon);

        [].forEach.call(document.querySelectorAll('.warningVis'), function (el) {
            el.style.display = 'none';
        });
    }
    catch(error)
    {
        [].forEach.call(document.querySelectorAll('.warningVis'), function (el) {
            el.style.display = 'block';
        });
    }
}

async function ImportExtended(lat, lon)
{
    const URL = 'https://api.openweathermap.org/data/2.5/onecall?lat='+lat +'&lon='+lon+'&exclude=minutely,hourly,alerts&units=imperial&appid=' + WEATHER_API_KEY;
    const response = await fetch(URL);
    const theData = await response.json();

    drawFiveDayWeather(theData);
}

function formatCurrAPIURL(city, state, zip)
{
    localStorage.setItem('LOCATIONRECENT', city+state+zip);
    
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
    const newImage = document.createElement('img');
    const iconSource = "https://openweathermap.org/img/wn/" + weatherData.weather[0].icon + "@2x.png";
    document.getElementById('current-image').innerHTML = "";
    newImage.setAttribute('alt', weatherData.weather[0].description); 
    newImage.setAttribute('title', weatherData.weather[0].description); 
    newImage.setAttribute('src', iconSource);
    newImage.setAttribute('style', "width: 10vh;");
    document.getElementById('current-image').appendChild(newImage);

    //Current temp
    document.getElementById('temp').innerHTML = "Current: " + Math.round(weatherData.main.temp) + '&deg;';
    document.getElementById('temp').setAttribute('aria-label', "Current temperature: " + Math.round(weatherData.main.temp) + ' degrees');
    //Humidity
    document.getElementById('humidity').innerHTML = "Humidity: " + weatherData.main.humidity + "%";
    document.getElementById('humidity').setAttribute('aria-label', "Current Humidity: " + weatherData.main.humidity + "  percent");
    //Windspeed
    document.getElementById('windspeed').innerHTML = "Wind speed: " + weatherData.wind.speed + " mph";
    document.getElementById('windspeed').setAttribute('aria-label', "Current Wind speed: " + weatherData.wind.speed + " miles per hour");
    //Location
    document.getElementById('location').innerHTML = "Location: " + weatherData.name;
    document.getElementById('location').setAttribute('aria-label', "Location: " + weatherData.name);

    if(document.getElementById('temp').innerHTML != "")
    {
        [].forEach.call(document.querySelectorAll('.visibility'), function (el) {
            el.style.display = 'block';
        });
    }
}

function drawFiveDayWeather(weatherData)
{
    //Current Day Low Temp
    document.getElementById('mintemp').innerHTML = "Low: " + Math.round(weatherData.daily[0].temp.min) + '&deg;';
    document.getElementById('mintemp').setAttribute('aria-label', "Today's Low Temperature: " + Math.round(weatherData.daily[0].temp.min) + ' degrees');
    //Curremt Day High Temp
    document.getElementById('maxtemp').innerHTML = "High: " + Math.round(weatherData.daily[0].temp.max) + '&deg;';
    document.getElementById('maxtemp').setAttribute('aria-label', "Today's High Temperature: " + Math.round(weatherData.daily[0].temp.max) + ' degrees');

    for(let i = 1; i <= 5; i++)
    {
        //Image
        document.getElementById("ext-"+i+"-img").innerHTML = "";
        document.getElementById("ext-"+i+"-img").appendChild(setImageExt(i, weatherData));
        //Low Temp
        document.getElementById("ext-"+i+"-low").innerHTML = "Low: " + Math.round(weatherData.daily[i].temp.min) + '&deg;';
        document.getElementById("ext-"+i+"-low").setAttribute('aria-label', "Low: " + Math.round(weatherData.daily[i].temp.min) + ' degrees');
        //High Temp
        document.getElementById("ext-"+i+"-high").innerHTML = "High: " + Math.round(weatherData.daily[i].temp.max) + '&deg;';
        document.getElementById("ext-"+i+"-high").setAttribute('aria-label', "High: " + Math.round(weatherData.daily[i].temp.max) + ' degrees');
        //Day of the week
        document.getElementById("ext-"+i+"-day").innerHTML = DayOfTheWeek(i);
        document.getElementById("ext-"+i+"-day").setAttribute('alt', DayOfTheWeekFull(i));
        document.getElementById("ext-"+i+"-day").setAttribute('aria-label', DayOfTheWeekFull(i));
    }
}

function setImageExt(count, weatherData)
{
    const newImage = document.createElement('img');
    const iconSource = "https://openweathermap.org/img/wn/" + weatherData.daily[count].weather[0].icon + "@2x.png";
    newImage.setAttribute('alt', weatherData.daily[count].weather[0].description); 
    newImage.setAttribute('title', weatherData.daily[count].weather[0].description);
    newImage.setAttribute('src', iconSource);
    newImage.setAttribute('style', "width: 10vh;");
    return newImage;
}

function DayOfTheWeek(day)
{
    var d = new Date();
    var weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    if(d.getDay() + day > 6)
    {
        return weekday[(d.getDay() + day) - 6];
    }
    else
    {
        return weekday[d.getDay() + day];
    }
}

function DayOfTheWeekFull(day)
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