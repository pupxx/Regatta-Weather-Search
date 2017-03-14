console.log("Cheryln, you are doing great!  Keep Going!!");

// --------------Regatta Central Post Request for temp key--------------------
// --------------Regatta Central API Request--------------------

// --------------Weather Underground API--------------------

//   $.ajax({
//     url: `http://api.wunderground.com/api/98df7348c668dee6/conditions/q/${$state}/${$city}.json`,
//     method: 'Get'
//   }).then(function(data){
//     console.log(data);
//   }).catch(function(error){
//     alert('error', error);
//   });

// --------------------- On Submit --------------------


$('form').on('submit', function(e){
  e.preventDefault();
  $('#response-wrapper').children().remove();
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
//key returned and sent to RC with lat and lng info for list of regatta's
        var $tempKey = key.access_token;
        $('.spinner').show();
          $.ajax({
              type: "GET",
              url: `http://galvanize-cors-proxy.herokuapp.com/https://api.regattacentral.com/v4.0/regattas?country=US&latitude=${$lat}&longitude=${$lng}&distance=50&timeframe=upcoming`,
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
                    // $regattaDate = moment(regattaInfo.data[i].regattaDates[j]).format('LL');
                    // console.log(allDates);
                  }
                  var dates = '';
                  for (var k in allDates){
                    if(allDates.length === 1){
                      dates = `${moment(allDates[0]).format('LL')}`
                      console.log(dates);
                    }else if(k < allDates.length -1){
                      dates += `${moment(allDates[k]).format('LL')}, `;
                      console.log(dates + `${moment(allDates[k]).format('LL')}`);
                    }

                  }
                  // console.log(dates);
                  allDates =[];
                  // $('#response-wrapper').append(
                  // `<section class="row response">
                  //   <h5>${$regattaName}</h5>
                  //   <h6>Date: ${$regattaDate}</h6>
                  //   <h6>Venue: ${$regattaVenue}</h6>
                  // </section>`).hide().fadeIn(1000);
                }
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
