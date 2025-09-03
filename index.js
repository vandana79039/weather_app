const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm  = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

let currentTab = userTab;
const API_KEY = "ab2c8dd68daa961f15b0185069cb3a7c";
currentTab.classList.add("current-tab");
getfromSessionStorage();
// switching tab
function switchTab(clickedTab){
    if(clickedTab!= currentTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");
        //   is searchform invisible  , if yes then make it visible
        if(!searchForm.classList.contains("active")){
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
        //    we are in serach tab but now want to visible ur weathe tab
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            // now we are on my weather tab then also display the weather , so let's check the local storage first
            // for coordinate , if we haved saved them there..
            getfromSessionStorage();
        }
    }
}
userTab.addEventListener('click',()=>{
    switchTab(userTab);
});

searchTab.addEventListener('click',()=>{
    switchTab(searchTab);

});

function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

 const errorContainer = document.querySelector(".error-container"); 
   function showError() {
  userInfoContainer.classList.remove("active");
  loadingScreen.classList.remove("active");
  grantAccessContainer.classList.remove("active");
   errorContainer.classList.add("active");
}
   function hideError() {
  errorContainer.classList.remove("active");
}

async function  fetchUserWeatherInfo(coordinates){
 hideError();
    const{lat,lon} = coordinates;
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");

    try{
        const response=await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );

        const data = await response.json();
        loadingScreen.classList.remove("active");

        if (data.cod === 404 || data.cod === "404") {
      showError(); // ✅ Show error if API says not found
       }
        else {
      hideError();
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
  }
    catch(err){
        loadingScreen.classList.remove("active");
         showError();

    }
}
function renderWeatherInfo(weatherInfo){
  const cityName = document.querySelector("[data-cityName]");
  const countryIcon = document.querySelector("[data-countryIcon]");
  const desc = document.querySelector("[data-weatherDesc]");
  const weatherIcon = document.querySelector("[data-weatherIcon]");
  const temp = document.querySelector("[data-temp]");
  const windspeed = document.querySelector("[data-windspeed]");
  const humidity = document.querySelector("[data-humidity]");
  const cloudiness = document.querySelector("[data-cloudiness]");

  cityName.innerText =   weatherInfo?.name;

countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
  desc.innerText = weatherInfo?.weather?.[0]?.description;
  weatherIcon.src =  weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
      temp.innerText = `${weatherInfo?.main?.temp}°C`;
    
    windspeed.innerText = `${weatherInfo?.wind?.speed}m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;

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
  const userCoordinates = {
   lat :position.coords.latitude,
  lon : position.coords.longitude,
};
  sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
  fetchUserWeatherInfo(userCoordinates);
}

  const grantAccessButton =document.querySelector("[data-grantAccess]");
  grantAccessButton.addEventListener("click",getLocation);


const searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityName = searchInput.value;
    if(cityName === "")
    return;
    else
        fetchSearchWeatherInfo(cityName);
    })



async function  fetchSearchWeatherInfo(city){
 hideError();
 loadingScreen.classList.add("active");
 userInfoContainer.classList.remove("active");
 grantAccessContainer.classList.remove("active");
 try {
        const response = await fetch(
             `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
          );
        const data = await response.json();
        loadingScreen.classList.remove("active");
  
 if (data.cod === 404 || data.cod === "404") {
      // City not found
      showError();
    } else {
      hideError();
      userInfoContainer.classList.add("active");
      renderWeatherInfo(data);
    }
    }
    catch(err) {
      loadingScreen.classList.remove("active");
    showError();
    }
  
}


  