
const API_KEY = "ab2c8dd68daa961f15b0185069cb3a7c";

function renderWeatherInfo(data) {
  let newPara = document.createElement("p");
  //  newPara.textContent = `${data?.main?.temp.toFixed(2)} °C`;
   newPara.textContent = `${ (data.main.temp - 273.15).toFixed(2)} °C`; 
  
  document.body.appendChild(newPara);
}
async function fetchWeatherDetails(){
  try{
       let city = "goa";
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);
         const data = await response.json();
         console.log("weather data:->" , data);
      renderWeatherInfo(data);
}
catch(err){
     console.log("error found",err);
}
}

async function getCustomWeatherDetails(){
  try{
    let latitude = 17.633;
    let longitude = 18.333;
    let result =  await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`);
    let data = await result.json();
    console.log(data);
  }
  catch(err){
    console.log("Error found",err);
  }
}


function getLocation(){
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(showPosition);
  }
  else{
    console.log("No geolocation Support");
  }
}
function showPosition(position){
  let lat = position.coords.latitude;
  let longi = position.coords.longitude;
  console.log(lat);
  console.log(longi);
}
