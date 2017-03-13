console.log("Cheryln, you are doing great!  Keep Going!!");

// --------------Regatta Central Post Request for temp key--------------------


$.ajax({
    type: "POST",
    url: 'http://galvanize-cors-proxy.herokuapp.com/https://api.regattacentral.com/oauth2/api/token',
    data: 'client_id=5523defb-1094-4648-9559-861c342e5872&client_secret=a299eb83-2f2b-4564-81c1-7c4d5354fbe1&username=cherylnbarber@gmail.com&password=4Bandit5#&grant_type=password'
  }).then(function(key){
    var $tempKey = key.access_token;
      console.log($tempKey);

      $.ajax({
          type: "GET",
          url: 'http://galvanize-cors-proxy.herokuapp.com/https://api.regattacentral.com/v4.0/regattas?country=US&latitude=47.6062095&longitude=-122.3320708&distance=50&timeframe=upcoming',
          headers: {"Authorization": $tempKey,
                    "Accept": "application/json"}
          }).then(function(data){
            console.log(data);

          }).catch(function(err){

            alert('Error processing request.');
          });


  }).catch(function(err){
    alert('Error processing request.', err);
  });

// --------------Regatta Central API Request--------------------





// --------------Weather Underground API--------------------



$('form').on('submit', function(e){
  e.preventDefault();
  $city = $('#city').val();
  $state = $('select option:selected').val();
  console.log($city);
  console.log($state);

  $.ajax({
    url: `http://api.wunderground.com/api/98df7348c668dee6/conditions/q/${$state}/${$city}.json`,
    method: 'Get'
  }).then(function(data){
    console.log(data);
  }).catch(function(error){
    alert('error', error);
  });
// --------------Geo-Code API--------------------
//the following request gets me the lat and lon co-ordinates
  $.ajax({
    method: 'GET',
    url: `https://maps.googleapis.com/maps/api/geocode/json?address=${$city},+${$state}&key= AIzaSyDtQjaGfe1ZrY5HeklfhoFFbc8PDN_L6yI`
  }).then(function(data){
    var $lat = data.results[0].geometry.location.lat;
    var $lng = data.results[0].geometry.location.lng;
    console.log($lat);
    console.log($lng);

  }).catch(function(err){
    console.log('the error is: ', err);
  });

});
