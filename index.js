// console.log('shubam is typing');

// function PrintOnUI(data){
// let mydiv = document.createElement('p');
// mydiv.textContent=`${data?.main?.temp.toFixed(2)} This is temp of ${city}`;
// document.body.appendChild(mydiv);
// }

// let city="Belagavi";
// let APIkey='d13d16157c2c02a010c24f60755b285a';

// async function getapi(){
// let response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIkey}&units=metric`);
// let data = await response.json();
// PrintOnUI(data);
// // console.log(data);
// }

// let target=document.querySelector('#gofor');
// target.addEventListener('click',getapi);


const usertab = document.querySelector("[data-userweather]");
const searchtab = document.querySelector("[data-searchweather]");
const usercontainer = document.querySelector(".weathercontainer");

const grantaccesscontainer= document.querySelector(".grant-location-container");
const searchform = document.querySelector("[data-searchform]");
const loadingscreen = document.querySelector(".loading-container") ;
const userInfocontainer = document.querySelector(".user-info-container");

let currenttab = usertab;
const APIkey = "d13d16157c2c02a010c24f60755b285a";
currenttab.classList.add("current-tab");
getfromsessionstorage();

function switchfun(clickedtab){
    if(clickedtab!=currenttab){
        currenttab.classList.remove("current-tab");
        currenttab=clickedtab;
        currenttab.classList.add("current-tab");

        if(!searchform.classList.contains("active")){
            userInfocontainer.classList.remove("active");
            grantaccesscontainer.classList.remove("active");
            searchform.classList.add("active");
        }
        else{
            searchform.classList.remove("active");
            userInfocontainer.classList.remove("active");
            getfromsessionstorage();
        }
    }
}

function getfromsessionstorage(){
    let localcoordinates = sessionStorage.getItem("user-coordinates");
    if(!localcoordinates){
        grantaccesscontainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localcoordinates);
        fetchuserweatherinfo(coordinates);  
    }
}

async function fetchuserweatherinfo(coordinates){
        const lat = coordinates.lat;
        const lon = coordinates.lon;

        grantaccesscontainer.classList.remove("active");
        // loading screen will be activated ;
        loadingscreen.classList.add("active");

        let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIkey}&units=metric`);
        let data = await response.json();
        //after the response is there with us we can remove the loading screen ;
        loadingscreen.classList.remove("active");
        userInfocontainer.classList.add("active");
        renderweatherinfo(data);
}

function renderweatherinfo(weatherinfo){

    // first we have to fetch the elements in which we are renderring the data
    const cityname = document.querySelector("[data-cityname]");
    const countryicon = document.querySelector("[data-countryicon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weathericon = document.querySelector("[data-weathericon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    cityname.textContent = weatherinfo?.name;
    countryicon.src = `https://flagcdn.com/144x108/${weatherinfo?.sys?.country.toLowerCase()}.png`;
    desc.textContent = weatherinfo?.weather?.[0]?.description;;
    weathericon.src = `http://openweathermap.org/img/w/${weatherinfo?.weather?.[0]?.icon}.png`;
    temp.textContent = `${weatherinfo?.main?.temp} °C`;
    windspeed.textContent = `${weatherinfo?.wind?.speed} m/s`;
    humidity.textContent = `${weatherinfo?.main?.humidity} %`;
    cloudiness.textContent = `${weatherinfo?.clouds?.all} %`;

}

function getlocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showposition);
    }
}

function showposition(position){
    const usercoordintes ={
         lat : position.coords.latitude,
         lon : position.coords.longitude,
    }
    sessionStorage.setItem('user-coordinates',JSON.stringify(usercoordintes));
    fetchuserweatherinfo(usercoordintes);
}

async function fetchsearhweatherinfo(city){
    loadingscreen.classList.add("active");
    userInfocontainer.classList.remove("active");
    grantaccesscontainer.classList.remove("active");

    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIkey}&units=metric`);
    const data = await response.json();
    loadingscreen.classList.remove("active");
    userInfocontainer.classList.add ("active");
    renderweatherinfo(data);
}


const grantaccessbutton = document.querySelector("[data-grantaccess]");
grantaccessbutton.addEventListener('click',getlocation);

const searchinput = document.querySelector("[data-searchinput]");
searchform.addEventListener('submit',(e)=>{
    e.preventDefault();
    if(searchinput === '')return;
    fetchsearhweatherinfo(searchinput.value);
});

usertab.addEventListener('click',()=>{
    switchfun(usertab);
});
searchtab.addEventListener('click',()=>{
    switchfun(searchtab);
});