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
                    $('#travel-info').append('<ul class="collapsible" data-collapsible="accordion" id="ul-"' + i);
                    $('#travel-info').append('<h4>' + "Route name: " + response.routes[i].name);
                    $('#travel-info').append('<ul id="travel-stats-' + i + '">')
                    $('#travel-stats-' + i).append('<li>' + "Distance: " + response.routes[i].distance + " miles");
                    $('#travel-stats-' + i).append('<li>' + "Current price: $" + response.routes[i].indicativePrices["0"].price + " USD");
                    $('#travel-stats-' + i).append('<li>' + "Price Range: $" + response.routes[i].indicativePrices["0"].priceLow + " - $" + response.routes["0"].indicativePrices["0"].priceHigh + " USD");
                    $('#travel-stats-' + i).append('<li>' + "Total Duration: " + response.routes[i].totalDuration + " minutes");

                }
                return false;

            })
        }
    });


});
