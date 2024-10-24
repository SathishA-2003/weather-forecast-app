const temp = document.getElementById("temp"),
    date = document.getElementById("date-time"),
currentLocation = document.getElementById('location'),
condition = document.getElementById("condition");

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
    });
};