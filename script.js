var images = [{
  "name": "thunderstorm",
  "image-url": "https://upload.wikimedia.org/wikipedia/commons/a/a4/Cloud_to_ground_lightning_strikes_south-west_of_Wagga_Wagga.jpg"
}, {
  "name": "drizzle",
  "image-url": "https://img07.deviantart.net/ea88/i/2012/198/6/b/drizzle__by_niki91-d57kcpt.jpg"
}, {
  "name": "rain",
  "image-url": "https://booknvolume.files.wordpress.com/2014/03/the-rain.jpg"
}, {
  "name": "snow",
  "image-url": "https://f.fwallpapers.com/images/snowing-city.jpg"
}, {
  "name": "mist",
  "image-url": "https://orchardparkway.files.wordpress.com/2015/02/foggy-pa-field.jpg"
}, {
  "name": "dust",
  "image-url": "https://upload.wikimedia.org/wikipedia/commons/5/57/Sydney_harbour_bridge_duststorm.jpg"
}, {
  "name": "tornado",
  "image-url": "https://kids.nationalgeographic.com/content/dam/kids/photos/articles/Science/Q-Z/tornado.jpg"
}, {
  "name": "clear",
  "image-url": "https://i.pinimg.com/originals/42/d1/af/42d1af20a492fcf3d7a9ce600e397516.jpg"
}, {
  "name": "cloudy",
  "image-url": "https://cdn.c.photoshelter.com/img-get2/I0000eAMGqRkGZxU/fit=1000x750/NYC-TF-002.jpg"
}, {
  "name": "wind",
  "image-url": "http://cdn.lightgalleries.net/4d8bbc1bd5a39/images/65th-08-MuhaO-03-1.jpg"
}, {
  "name": "hot",
  "image-url": "https://stevepowellautomotive.com/wp-content/uploads/2014/06/too-hot.jpg"
}, {
  "name": "night",
  "image-url": "https://cdn.wallpapersafari.com/72/42/wvM6e9.jpg"
}];

function findurl(weather) {
  for (var i = 0; i < images.length; i++) {
    if (images[i].name === weather) {
      return images[i]["image-url"];
    }
  }
  return "https://newevolutiondesigns.com/images/freebies/nature-hd-background-10.jpg";
}

function updateValues(weather) {
  /** This is the part where we update the values **/
  var location = "";
  if(weather.city !== "")
    location += weather.city + ", ";
  if(weather.region !== "")
    location += weather.region + ", ";
  if(weather.country !== "")
    location += weather.country;
  $("#location").html(location);
  $("#value").html(weather.temp_cel.toFixed(1));
  $("#description").html(weather.description);
  /*********************************************/

  $("#wrapper").css("background-image", "url(" + weather.imageUrl + ")");
  $("body").fadeIn(500);
  /****************************************************/

  /** This part focusess on toggling in between celcius and Fahrenheit scales **/
  $("#symbol").on("click", function() {
      if ($("#symbol").text() === 'C') {

        $("#value").text(weather.temp_far.toFixed(1));
        $("#symbol").text('F');
      } else {

        $("#value").text(weather.temp_cel.toFixed(1));
        $("#symbol").text('C');
      }
    })
    /*******************************************/
}

function getWeather(latitude, longitude, city, region, country) {

  var weather = {}
  weather.city = city;
  weather.region = region;
  weather.country = country;

  var weatherApiCall = "https://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon=" + longitude + "&appid=34bfb4a69984b0ea7adeb8a5ad1578f2";

  $.getJSON(weatherApiCall, function(result) {

    weather.main = result.weather[0].main;

    /** This part is for calculating temperature**/
    weather.temp_kel = result.main.temp;
    weather.temp_cel = weather.temp_kel - 273.15;
    weather.temp_far = weather.temp_cel * 9 / 5 + 32;
    /*************************************/

    /** This part is for determining which image to choose**/
    var flag = false;
    if (weather.temp_cel >= 35) {
      weather.imageUrl = findurl("hot");
      flag = true;
    }
    var cur_time = Math.round(new Date().getTime() / 1000);
    //console.log(cur_time + " " + result.sys.sunset + " " + result.sys.sunrise);
    if (cur_time > result.sys.sunset || cur_time < result.sys.sunrise) {
      weather.imageUrl = findurl("night");
      flag = true;
    }
    if (flag === false) {
      weather.imageUrl = findurl(weather.main.toLowerCase());
    }
    /*****************************************************/

    // this statement gets the description
    weather.description = result.weather[0].description;

    updateValues(weather);
  });
}

function getLocation() {
  var locationApiCall = "https://ipinfo.io";
  $.getJSON(
    locationApiCall,
    function(response) {
      var location = response.loc.split(',');
      getWeather(location[0], location[1], response.city, response.region, response.country);
    }
  );
}

$(document).ready(function() {
  $("body").hide();
  getLocation();
});