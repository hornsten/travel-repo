$(document).ready(function() {
    // Function to get input value.
    $('#search-travel-info').click(function() {
        var originCity = $("#origin").val().trim();
        var destinationCity = $("#destination").val().trim();
        if (originCity == '' || destinationCity == '') {
            alert("Enter Some Text In Input Field");
        } else {
            $('#travel-info').empty();
            var pathway = 'http://free.rome2rio.com/api/1.4/json/Search?key=';
            var apiKey = 'lbLJEgTs';
            var origin = '&oName=' + originCity;
            var destination = '&dName=' + destinationCity;
            var rideshare = '&noRideshare';

            var queryURL = pathway + apiKey + origin + destination + rideshare;
            console.log(queryURL);
            $.ajax({
                url: queryURL,
                method: 'GET'
            }).done(function(response) {
                console.log(response);
                for (var i = 0; i < response.routes.length; i++) {
                    $('#travel-info').append('<div class="col s12 m6" id="info-' + i + '">');
                    $('#info-' + i).append('<ul class="collection with-header" id="ul-' + i + '">');
                    $('#ul-' + i).append('<li class="collection-header" id="' + i + '"><h4>Route name: ' + response.routes[i].name)
                        .append('<ul id="travel-stats-' + i + '">')
                        .append('<li class="collection-item" id="coll-' + i + '">Distance: ' + response.routes[i].distance + " miles")
                        .append('<li class="collection-item" id="coll-' + i + '">Current price: $' + response.routes[i].indicativePrices["0"].price + " USD")
                        .append('<li class="collection-item" id="coll-' + i + '">Price Range: $' + response.routes[i].indicativePrices["0"].priceLow + " - $" + response.routes["0"].indicativePrices["0"].priceHigh + " USD")
                        .append('<li class="collection-item" id="coll-' + i + '">Total Duration: ' + response.routes[i].totalDuration + " minutes");

                }
                return false;

            })
        }
    });


});
