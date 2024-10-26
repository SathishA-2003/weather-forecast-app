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
visibilityStatus = document.querySelector('.visibility-status'),
weatherCards = document.querySelector("#weather-cards");

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
        measureUvIndex(today.uvindex);
        updateHumidityStatus(today.humidity);
        updateVisibilityStatus(today.visibility);
        updateAirQualityStatus(today.winddir);
        sunRise.innerText = convertTimeTo12HoursFormat(today.sunrise);
        sunSet.innerText = convertTimeTo12HoursFormat(today.sunset);
        mainIcon.src = getIcon(today.icon);
        if(hourlyorWeek === "hourly"){
            updateForecast(data.days[0].hours , unit , "day")
        }else{
            updateForecast(data.days, unit,"week")
        }
        
    });
};

function celciusToFahrenheit(temp){
    return ((temp * 9) / 5 + 32).toFixed(1);
}

//function to get uv index status
function measureUvIndex(uvIndex){
    if(uvIndex <= 2){
        uvText.innerText = "Low";
    }else if(uvIndex <= 5){
        uvText.innerText = "Moderate";
    }else if(uvIndex <= 7){
        uvText.innerText = "High";
    }else if(uvIndex <= 10){
        uvText.innerText = "Very High";
    }else{
        uvText.innerText = "Extreme";
    }
}

function updateHumidityStatus(){
    if(humidity <= 30){
        humidityStatus.innerText = "Low";
    }else if(humidity <= 60){
        humidityStatus.innerText = "Moderate";

    }else{
        humidityStatus.innerText = "High";
    }
}

function updateVisibilityStatus(){
    if(visibility <= 0.3){
        visibilityStatus.innerText = "Dense Fog";
    }
    else if(visibility <= 0.16){
        visibilityStatus.innerText = "Moderate Fog";
    } else if(visibility <= 0.35){
        visibilityStatus.innerText = "Light Fog";
    } else if(visibility <= 1.13){
        visibilityStatus.innerText = "Very Light Fog";
    } else if(visibility <= 2.26){
        visibilityStatus.innerText = "Light Mist";
    } else if(visibility <= 5.4){
        visibilityStatus.innerText = "Very Light Mist";
    } else if(visibility <= 10.8){
        visibilityStatus.innerText = "Clear Air";
    }else{
        visibilityStatus.innerText = "Very Clear Air";
    }
} 

function updateAirQualityStatus(){
    if(airQuality <= 50){
        airQualitystatus.innerText = "Good 👌";
    }else if(airQuality <= 100){
        airQualitystatus.innerText = "Moderate 😧";
    }else if(airQuality <= 150){
        airQualitystatus.innerText = "Unhealthy for Sensitive Groups 😷";
    }else if(airQuality <= 200){
        airQualitystatus.innerText = "Unhealthy 😷"
    }else if(airQuality <= 250){
        airQualitystatus.innerText = "Very Unhealthy 😨"
    }else{
        airQualitystatus.innerText = "Hazardous 😱"
    }
    
}

function convertTimeTo12HoursFormat(time){
    let hour =time.split(":") [0];
    let minute =time.split(":") [1];
    let ampm = hour >= 12 ? "pm" :"am";
    hour = hour & 12;
    hour = hour ? hour : 12; //the zero hour should be 12.
    hour = hour < 10 ? "0" + hour : hour; //add prefix zero if less than 10
    minute = minute < 10 ? "0" + minute : minute;
    let strTime = hour + ":" + minute + " " + ampm;
    return strTime;

}

function getIcon(condition){
    if(condition === "Partly-cloudly-day"){
        return "https://i.ibb.co/PZQXH8V/27.png";
        
    }else if(condition === "partly-cloudy-night"){
        return "https://i.ibb.co/Kzkk59k/15.png";
    }else if(condition === "rain"){
        return "https://i.ibb.co/kBd2NTS/39.png";
    }else if(condition === "clear-day"){
        return "https://i.ibb.co/rb4rrJL/26.png";
    }else if(condition === "clear-night"){
        return "https://i.ibb.co/1nxNGHL/10.png";
    }else{
        return "https://i.ibb.co/rb4rrJL/26.png";
    }    
}

function getDayName(date){
    let day = new Date(date);
    let days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];
    return days[day.getDay()];
}

function getHour(time){
    let hour = time.split(":")[0];
    let min = time.split(":")[1];
    if(hour > 12){
        hour = hour - 12;
        return `${hour}:${min} PM`
    }else{
         return `${hour}:${min} AM`;
    }
}

function updateForecast(data, unit, type){
    weatherCards.innerHTML = "";

    let day = 0;
    let numCards = 0;
    //24 cards if hourly weather and 7 for weekly
    if(type === "day"){
        numCards = 24;
    }else{
        numCards = 7;
    }
    for(let i=0; i < numCards; i++){
        let card =  document.createElement("div");
        card.classList.add("card");
        //hour if hourly weather and 7 for weekly
        let dayName = getHour(data[day].datetime);
        if(type === "week"){
            dayName = getDayName(data[day].datetime);
        }
        let dayTemp = data[day].temp;
        if(unit === "f"){
            dayTemp = celciusToFahrenheit(data[day].temp);
        }
        let iconCondition = data[day].icon;
        let iconSrc = getIcon(iconCondition);
        let tempUnit = "°C";
        if(unit === "f"){
            tempUnit = "°F";
        }
        card.innerHTML = `
            <h2 class="day-name">${dayName}</h2>
                <div class="card-icon">
                    <img src="${iconSrc}" alt="icon">
                </div>
                <div class="day-temp">
                    <h2 class="temp">${dayTemp}</h2>
                    <span class="temp-unit">${tempUnit}</span>
                </div>
        `;
            weatherCards.appendChild(card);
            day++;

        }
}
