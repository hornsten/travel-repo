  var map;
  var geocoder;

  function initialize() {
      var myLatlong = new google.maps.LatLng(48.856614, 2.3522219000000177);
      var myOptions = {
          zoom: 7,
          center: myLatlong,
          mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      map = new google.maps.Map(document.getElementById('map_canvas'), myOptions);
      geocoder = new google.maps.Geocoder();
  }

  //Yelp dom display function
  function cb(data) {
      $(".yelpBusiness").empty();
      for (i = 0; i < 5; i++) {

          var businessDiv = $('<div class="businessDiv">');

          // Retrieves the Rating Data
          // var busName = data.businesses[i].name;
          //console.log("Rating : "+ rating);
          var rating = data.businesses[i].rating;
          var phone = data.businesses[i].phone;
          var snippet = data.businesses[i].snippet_text;
          // var pOne = $('<p class= "business">').text(busName);
         var pOne = $('<p class="business">').append("<a href=' "+data.businesses[i].url +"' target='_blank'>"+ data.businesses[i].name);var pThree = $('<p class= "snippet">').text("Recent Review:" + snippet);
          var pTwo = $('<p class= "phone">').text(phone);
          var pFour = $('<p class= "phone">').text(phone);
          var address = data.businesses[i].location.display_address;
          var pAddress = $('<p class="address">').text("Address: " + address);
          var img = $('<img id="imgBus">');
          var img_url = data.businesses[i].image_url;
          img.attr({
              'src': img_url
          });
          // Displays the rrating
          businessDiv.append(pOne);
          businessDiv.append(img);
          businessDiv.append(pAddress);
          businessDiv.append(pTwo);
          businessDiv.append(pThree);

          var imgRat = $('<img id="ratingurl">');
          imgRat.attr({
              'src': data.businesses[i].rating_img_url,
          });
          businessDiv.append(imgRat);

          //  businessDiv.append(pFour);
          //  businessDiv.append(pClosed);
          $('.yelpBusiness').prepend(businessDiv);
      }
  } //close cb function

  //yelp auth details 
  var auth = {
      consumerKey: "Y6QjPZLYHJbMDYsEpHeMoA",
      consumerSecret: "xf8rW-beX_ZUmAr9obxI9xlzhhA",
      accessToken: "xpZ2l6Pp-9gkGFtWuJULv9maTfi9ibfE",
      // This example is a proof of concept, for how to use the Yelp v2 API with javascript.
      // You wouldn't actually want to expose your access token secret like this in a real application.
      accessTokenSecret: "__tuB-bp3QpqaVpHrn6jyFNqtEI",
      serviceProvider: {
          signatureMethod: "HMAC-SHA1"
      }
  };
  var accessor = {
      consumerSecret: auth.consumerSecret,
      tokenSecret: auth.accessTokenSecret
  };
  //------------yelp auth ends----------

  $(document).ready(function() {
    window.AutoOb = {
          resultOB: null,
          source: function(request, response) {
              geocoder.geocode({ 'address': request.term }, function(results) {
                      response($.map(results, function(item) {
                     AutoOb.resultOB = item;
                       return {
                                  label: item.formatted_address,
                                  value: item.formatted_address,
                                  latitude: item.geometry.location.lat(),
                                  longitude: item.geometry.location.lng(),
                              } //return ends

                          })) //response ends
                  }) //geocoder ends
          }, //source ends
          select: function(event, ui) {
            
              var location = new google.maps.LatLng(ui.item.latitude, ui.item.longitude);
              marker = new google.maps.Marker({
                  map: map,
                  draggable: true
              })
              marker.setPosition(location);
              map.setCenter(location);

              //yelp data grabbed here 
           
              console.log('resultOB', window.AutoOb.resultOB);
              console.log('AutoOb', window.AutoOb);
              // console.log("place "+near);
              var terms = 'food';
              //ajax call for yelp
               var near = AutoOb.resultOB.formatted_address;

              var parameters = [];
              parameters.push(['term', terms]);
              parameters.push(['location', near]);
              parameters.push(['callback', 'cb']);
              parameters.push(['oauth_consumer_key', auth.consumerKey]);
              parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
              parameters.push(['oauth_token', auth.accessToken]);
              parameters.push(['oauth_signature_method', 'HMAC-SHA1']);

              var message = {
                  'action': 'https://api.yelp.com/v2/search',
                  'method': 'GET',
                  'parameters': parameters
              };


              OAuth.setTimestampAndNonce(message);
              OAuth.SignatureMethod.sign(message, accessor);

              var parameterMap = OAuth.getParameterMap(message.parameters);
              //ajax call - yelp
              $.ajax({
                      'url': message.action,
                      'data': parameterMap,
                      'dataType': 'jsonp',
                      'jsonpCallback': 'cb',
                      'cache': true
                  })
                  .done(function(data, textStatus, jqXHR) {
                      // console.log('success[' + data + '], status[' + textStatus + '], jqXHR[' + JSON.stringify(jqXHR) + ']');
                      // console.log("***********jqhhr*********");
                  })
                  .fail(function(jqXHR, textStatus, errorThrown) {
                      console.log('error[' + errorThrown + '], status[' + textStatus + '], jqXHR[' + JSON.stringify(jqXHR) + ']');
                  });

              //yelp  -- ends here


              // //-------------------News api-------------------------

              $("#wellSection").empty();
              var newsKey = "cf7b4e9977ef4c48a3e784039784debb";
              console.log("news key " + near);
              var articleCounter = 0;
              var queryURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=" + newsKey + "&q=" + near;

              $.ajax({ url: queryURL, method: "GET" })
                  .done(function(NYTData) {

                      for (var i = 0; i < 3; i++) {
                          var wellSection = $("<div>");
                          wellSection.addClass('card-panel');
                          wellSection.attr('id', 'articleWell-' + i)
                          $('#wellSection').append(wellSection);
                          if (NYTData.response.docs[i].headline != "null") {
    
                              document.querySelector('.newsTitle').innerHTML = "Top news from " + AutoOb.resultOB.formatted_address;
                              $("#articleWell-" + i).append('<h5 class="articleHeadline"><strong>   ' + NYTData.response.docs[i].headline.main + "</strong></h5>");

                              // Log the first article's Headline to console.
                              console.log(NYTData.response.docs[i].headline.main);
                          }

                          // If the article has a Byline include the headline in the HTML
                          if (NYTData.response.docs[i].byline && NYTData.response.docs[i].byline.hasOwnProperty("original")) {
                              $("#articleWell-" + i).append('<p>' + NYTData.response.docs[i].byline.original + "</p>");

                              // Log the first article's Author to console.
                              console.log(NYTData.response.docs[i].byline.original);
                          }

                          // Then display the remaining fields in the HTML (Section Name, Date, URL)
                            $("#articleWell-" + i).append("<a href='" + NYTData.response.docs[i].web_url + "'>" + NYTData.response.docs[i].web_url + "</a>");

                          // Log the remaining fields to console as well
                          console.log(NYTData.response.docs[i].pub_date);
                          console.log(NYTData.response.docs[i].section_name);
                          console.log(NYTData.response.docs[i].web_url);
                      } //for loop
                  }); //done func

              //----------------------------------------------------

              //weatther  

              var weatherKey = "ad7a1f849c0e46f75a5ff8a3f8560be8";
              console.log("weather " + near);
              var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + near + "&units=imperial&appid=" + weatherKey;

              $.ajax({ url: queryURL, method: 'GET' })

              // We store all of the retrieved data inside of an object called "response"
              .done(function(response) {

                  // Log the queryURL
                  console.log(queryURL);

                  // Log the resulting object
                  console.log(response);

                  // Transfer content to HTML

                  $(".temp").html("<h4>" + response.main.temp + "</h4>");

                  $(".wind").html("Wind Speed: " + response.wind.speed);
                  $(".humidity").html("Humidity: " + response.main.humidity);

                  // Log the data in the console as well
                  console.log("Wind Speed: " + response.wind.speed);
                  console.log("Humidity: " + response.main.humidity);
                  console.log("Temperature (F): " + response.main.temp);
              });

              //-------------weather api call ends here ------------------

          }, //select function end
      };
      $("#autocomplete").autocomplete(window.AutoOb); //autocomplete ends
  }); //doc
