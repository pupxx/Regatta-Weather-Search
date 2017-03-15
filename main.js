console.log("Cheryln, you are doing great!  Keep Going!!");

// --------------Regatta Central Post Request for temp key--------------------
// --------------Regatta Central API Request--------------------

// --------------Weather Underground API--------------------

  // $.ajax({
  //   url: `http://api.wunderground.com/api/98df7348c668dee6/conditions/q/${$state}/${$city}.json`,
  //   method: 'Get'
  // }).then(function(data){
  //   console.log(data);
  // }).catch(function(error){
  //   alert('error', error);
  // });

// --------------------- On Submit --------------------


$('form').on('submit', function(e){
  e.preventDefault();
  $('.weatherDay').children().remove();
  $('#response-wrapper').children().remove();
  $('.weatherDetail').children().remove();
  $city = $('#city').val();
  $state = $('select option:selected').val();
  console.log($city);
  console.log($state);
//

// --------------Geo-Code API--------------------
//the following request gets me the lat and lon co-ordinates
  var $googleKey = 'AIzaSyDtQjaGfe1ZrY5HeklfhoFFbc8PDN_L6yI';
  $.ajax({
    method: 'GET',
    url: `https://maps.googleapis.com/maps/api/geocode/json?address=${$city},+${$state}&key=${$googleKey}`
  }).then(function(data){
    var $lat = data.results[0].geometry.location.lat;
    var $lng = data.results[0].geometry.location.lng;

//req sent to RC for key
    $.ajax({
        type: "POST",
        url: 'http://galvanize-cors-proxy.herokuapp.com/https://api.regattacentral.com/oauth2/api/token',
        data: 'client_id=5523defb-1094-4648-9559-861c342e5872&client_secret=a299eb83-2f2b-4564-81c1-7c4d5354fbe1&username=cherylnbarber@gmail.com&password=4Bandit5#&grant_type=password'
      }).then(function(key){
//key returned sending RC with lat and lng info for list of regatta's and appending to the DOM
        var $tempKey = key.access_token;
        var $radioValue = $("input[name='sprint-head']:checked").val();
        $('.spinner').show();
          $.ajax({
              type: "GET",
              url: `http://galvanize-cors-proxy.herokuapp.com/https://api.regattacentral.com/v4.0/regattas?country=US&type=${$radioValue}&latitude=${$lat}&longitude=${$lng}&distance=50&timeframe=upcoming`,
              headers: {"Authorization": $tempKey,
                        "Accept": "application/json"}
              }).then(function(regattaInfo){
                $('.spinner').hide();
                console.log(regattaInfo);
                for (var i in regattaInfo.data){
                  $regattaName = regattaInfo.data[i].name;
                  $regattaVenue = regattaInfo.data[i].venue.name;
                  $regattaLat = regattaInfo.data[i].venue.latitude;
                  $regattaLng = regattaInfo.data[i].venue.longitude;

                  var allDates = [];
                  for (var j in regattaInfo.data[i].regattaDates){
                    allDates.push(regattaInfo.data[i].regattaDates[j]);
                  }

                  var $dates = '';
                  var $lastDate = '';
                  for (var k in allDates){
                    if(allDates.length === 1){
                      $dates = `${moment(allDates[0]).format('LL')}`;
                    }else if(k < allDates.length -1){
                      $lastDate = `${moment(allDates[k.length]).format('LL')}`;
                      $dates += `${moment(allDates[k]).format('LL')} -  ${$lastDate}`;
                    }

                  }
                  allDates =[];
                  $('#response-wrapper').append(
                  `<section class="row response">
                    <h5><a class="name" data-date="${$dates}">${$regattaName}</a></h5>
                    <h6>Date: ${$dates}</h6>
                    <h6>Venue: ${$regattaVenue}</h6>
                  </section>`).hide().fadeIn(1000);
                }

                $('.name').on('click', function(){
                  $('.weatherWrapper').children().remove();
                  $('.weatherDetail').children().remove();
                  $.ajax({
                    url:
                     `http://api.wunderground.com/api/98df7348c668dee6/forecast10day/q/${$state}/${$city}.json`,
                    method: 'Get'
                  }).then(function(forecast){
                    console.log(forecast);
                    var $tenDayForecast = forecast.forecast.simpleforecast.forecastday;
                    for(var i in $tenDayForecast){
                      $icon = $tenDayForecast[i].icon_url;
                      $day = $tenDayForecast[i].date.weekday_short;
                      $calendarDate = $tenDayForecast[i].date.day;
                      console.log($day);

                      $('.weatherWrapper').append(`
                      <section class="weatherDay col-xs-1">
                        <section>${$day}</section>
                        <img src="${$icon}" alt="">
                        <section class="day"><a>${$calendarDate}</a></section>
                      </section>`);
                    }  //end forcast loop


                    $('.weatherDay .day a').on('click', function(){
                      $('.weatherDetail').children().remove();
                      console.log($(this).text());
                      for (var j in $tenDayForecast){
                        if($(this).text() == $tenDayForecast[j].date.day){
                          $dayOfWeek = $tenDayForecast[j].date.weekday;
                          $conditions = $tenDayForecast[j].conditions;
                          console.log($conditions);
                          $high = $tenDayForecast[j].high.fahrenheit;
                          $low = $tenDayForecast[j].low.fahrenheit;
                          $avgWind = $tenDayForecast[j].avewind.mph;
                          $gusts = $tenDayForecast[j].maxwind.mph;

                          $('.weatherDetail').append(`
                          <section class=" weatherConditions col-xs-11">
                            <h4>The weather for ${$dayOfWeek} is:
                            <h6>conditions: ${$conditions}</h6>
                            <h6>high: ${$high}&#8457</h6>
                            <h6>low: ${$low}&#8457</h6>
                            <h6>Average Wind Speed: ${$avgWind}mph</h6>
                            <h6>Wind gusts up to: ${$gusts}mph</h6>

                          </section>`);
                        }
                      }
                    });

                  }).catch(function(error){
                    alert('error', error);
                  });


                });


              }).catch(function(err){
                alert('Error processing request.');
              });
      }).catch(function(err){
        alert('Error processing request.', err);
      });

  }).catch(function(err){
    console.log('the error is: ', err);
  });

}); //end on submit
