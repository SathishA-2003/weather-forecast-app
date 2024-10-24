const temp = document.getElementById("temp"),
    date = document.getElementById("date-time"),
currentLocation = document.getElementById('location'),
condition = document.getElementById("condition"),
rain = document.getElementById("rain"),
mainIcon = document.getElementById("icon"),
uvIndex = document.querySelector('.uv-index'),
uvText = document.querySelector('.uv-text'),
windSpeed = document.querySelector('.wind-speed'),
sunRise = document.querySelector('.sun-rise'),
sunSet = document.querySelector('.sun-set'),
humidity = document.querySelector('.humidity'),
visibility = document.querySelector('.visibility'),
humidityStatus = document.querySelector('.humidity-status'),
airQuality = document.querySelector('.air-quality'),
airQualitystatus = document.querySelector('.air-quality-status'),
visibilityStatus = document.querySelector('.visibility-status');

let currentCity = "";
let currentUnit = "c";
let hourlyorWeek = "Week";

//Update Date Time
function getDateTime(){
    let now = new Date(),
    hour = now.getHours(),
    minute = now.getMinutes();

    let days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];

    hour = hour % 12;
    if(hour < 10){
        hour = "0" + hour;

    }
    if(minute < 10){
        minute = "0" + minute;
    }

    let dayString = days[now.getDay()];
    return `${dayString}, ${hour}:${minute}`;


}
date.innerText = getDateTime();

//update time every second
setInterval(()=>{
    date.innerText = getDateTime();
},1000);

//function to get public ip with fetch

function getPublicIp(){
    fetch("https://geolocation-db.com/json/", {
       method: "GET",
    })
    .then((response) => response.json())
    .then((data) => {
        console.log(data);
        
        currentCity = data.city;
         getWeatherData(data.city, currentUnit, hourlyorWeek )  
    });
}
getPublicIp();

//function to get weather data
function getWeatherData(city, unit, hourlyorWeek){
    fetch("https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=EJ6UBL2JEQGYB3AA4ENASN62J&contentType=json",
    {    
        method : "GEt",
    }
    )
    .then((response)=> response.json())
    .then((data)=> {
        /* console.log(data); */
        let today = data.currentConditions;
       if(unit === "c"){
        temp.innerText = today.temp;
       }else{
        temp.innerText = celciusToFahrenheit(today.temp);
       }
       currentLocation.innerText = data.resolvedAddress;
        condition.innerText = today.conditions;
        rain.innerText = "perc - " + today.precip + "%";
        uvIndex.innerText = today.uvindex;
        windSpeed.innerText = today.windspeed;
        humidity.innerText = today.humidity + "%";
        visibility.innerText = today.visibility;
        airQuality.innerText = today.winddir;
    });
};

function celciusToFahrenheit(temp){
    return ((temp * 9) / 5 + 32).toFixed(1);
}