
      var auth = {
                    consumerKey : "Y6QjPZLYHJbMDYsEpHeMoA",
                    consumerSecret : "xf8rW-beX_ZUmAr9obxI9xlzhhA",
                    accessToken : "xpZ2l6Pp-9gkGFtWuJULv9maTfi9ibfE",
                    accessTokenSecret : "__tuB-bp3QpqaVpHrn6jyFNqtEI",
                    serviceProvider : {
                        signatureMethod : "HMAC-SHA1"
                    }
                };

                var term = "";
                var near = $('#location-input');
                console.log(('#location-input').val().trim());
                var accessor = {
                    consumerSecret : auth.consumerSecret,
                    tokenSecret : auth.accessTokenSecret
                };

                var parameters = [];
                parameters.push(['term', terms]);
                parameters.push(['location', near]);
                parameters.push(['callback', 'cb']);
                parameters.push(['oauth_consumer_key', auth.consumerKey]);
                parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
                parameters.push(['oauth_token', auth.accessToken]);
                parameters.push(['oauth_signature_method', 'HMAC-SHA1']);
        
                var message = {
                    'action' : 'https://api.yelp.com/v2/search',
                    'method' : 'GET',
                    'parameters' : parameters
                };
        
                OAuth.setTimestampAndNonce(message);
                OAuth.SignatureMethod.sign(message, accessor);
        
                var parameterMap = OAuth.getParameterMap(message.parameters);
                    
                $.ajax({
                    'url' : message.action,
                    'data' : parameterMap,
                    'dataType' : 'jsonp',
                    'jsonpCallback' : 'cb',
                    'cache': true
                })
                .done(function(data, textStatus, jqXHR) {

                    var placeMap = $('<div id="placeMap">');
                    var imgMap = $('<img id="map">');


                    console.log("***********jqhhr*********");
                    console.log(JSON.stringify(jqXHR));

                    }
                )
                .fail(function(jqXHR, textStatus, errorThrown) {
                                     console.log('error[' + errorThrown + '], status[' + textStatus + '], jqXHR[' + JSON.stringify(jqXHR) + ']');
                        }
                );
    