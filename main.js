console.log("hi");

// --------------Regatta Central Post Request for temp key--------------------


// $.ajax({
//     type: "POST",
//     url: 'http://galvanize-cors-proxy.herokuapp.com/https://api.regattacentral.com/oauth2/api/token',
//     data: 'client_id=5523defb-1094-4648-9559-861c342e5872&client_secret=a299eb83-2f2b-4564-81c1-7c4d5354fbe1&username=cherylnbarber@gmail.com&password=4Bandit5#&grant_type=password',
//     success: function (data) {
//       var $tempKey = data.access_token;
//         console.log(data);
//     },
//     error: function () {
//         alert('Error processing request.');
//     }
// });

// --------------Regatta Central API Request--------------------


$.ajax({
    type: "GET",
    url: 'http://galvanize-cors-proxy.herokuapp.com/https://api.regattacentral.com/v4.0/regattas?country=US&latitude=47.6062095&longitude=-122.3320708&distance=50&timeframe=upcoming',
    headers: {"Authorization": "2f0bcc4766de8afd897a4a7d2bc767a6",
              "Accept": "application/json"}
    }).then(function(data){
      console.log(data);

    }).catch(function(err){

      alert('Error processing request.');
    });
  

// --------------Weather Underground API--------------------

// $.ajax({
//   url: 'http://api.wunderground.com/api/98df7348c668dee6/conditions/q/WA/Seattle.json',
//   method: 'Get'
// }).then(function(data){
//   console.log(data);
// }).catch(function(error){
//   alert('error', error)
// })

$.ajax({
  method: 'GET',
  url: 'https://maps.googleapis.com/maps/api/geocode/json?address=Seattle,+WA&key= AIzaSyDtQjaGfe1ZrY5HeklfhoFFbc8PDN_L6yI'
}).then(function(data){
  console.log(data);
}).catch(function(err){
  console.log('the error is: ', err);
});
