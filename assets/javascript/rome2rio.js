$(document).ready(function() {

    // -------------------------------Main Process-----------------------------
    //Hides the progress bar 
    $('.progress').hide();
    $('#contents').hide();

    // Creates parallax effect
    $('.parallax').parallax();

    $('.scrollspy').scrollSpy();

    // When "Click To Escape" button is pressed, get Information, Travel Options and YouTube Videos
    $('#search-place-info').on('click', getTravelOptions);
    $('#search-place-info').on('click', getPlaceInfo);
    $('#search-place-info').on('click', function() {

        getVideos();
        // empties input fields
        $('#origin').val("");
        $('#destination').val("");

        // reveals table of contents
        $('#contents').show();

    });

    // ----------------------------Functions------------------------------

    function getTravelOptions() {
        var originCity = $("#origin").val().trim();
        var destinationCity = $("#destination").val().trim();
        if (originCity == '' || destinationCity == '') {

            // Pops up a subtle reminder if the user leaves the inputs blank

            Materialize.toast('Please tell me where you want to go!', 4000, 'red lighten-1 rounded');

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
                    $('#info-' + i).append('<ul class="collection with-header z-depth-5" id="ul-' + i + '">');
                    $('#ul-' + i).append('<li class="collection-header teal-text teal-accent-4 teal lighten-5 center-align" id="' + i + '"><h5>' + response.routes[i].name)
                        .append('<ul id="travel-stats-' + i + '">')
                        .append('<li class="collection-item teal lighten-4" id="coll-' + i + '">Distance: ' + response.routes[i].distance + " miles")
                        .append('<li class="collection-item teal lighten-3" id="coll-' + i + '">Median price: $' + response.routes[i].indicativePrices[0].price + " USD")
                        .append('<li class="collection-item teal lighten-2" id="coll-' + i + '">Price Range: $' + response.routes[i].indicativePrices[0].priceLow + " - $" + response.routes[i].indicativePrices[0].priceHigh + " USD")
                        .append('<li class="collection-item teal lighten-1" id="coll-' + i + '">Total Duration: ' + response.routes[i].totalDuration + " minutes");
                }
            });
        }

    };

    function getPlaceInfo() {
        var place = $("#destination").val();
        $.ajax({
            type: "GET",
            url: "http://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page=" + place + "&callback=?",
            contentType: "application/json; charset=utf-8",
            async: false,
            dataType: "json",
            success: function(data, textStatus, jqXHR) {

                var markup = data.parse.text["*"];
                var blurb = $('<div id="blurb"></div>').html(markup);

                // remove links as they will not work
                blurb.find('a').each(function() { $(this).replaceWith($(this).html()); });

                // remove any references
                blurb.find('sup').remove();

                // remove cite error
                blurb.find('.mw-ext-cite-error').remove();
                $('#article').html($(blurb).find('p'));

            },
            error: function(errorMessage) {

                $('#blurb').html("There is no information available for that city");
            }
        });
    };


    function getVideos() {
        $('.progress').show();
        // API key and parameters
        var parameters = $('#destination').val().trim();
        var pathway = 'https://www.googleapis.com/youtube/v3/search?part=snippet&safesearch=strict&maxResults=6&length=short';
        var apiKey = '&key=AIzaSyDcpRXHyPmdHfd_j7uIwLH5XZ1uk9V5E1k&q=';

        var queryURL = pathway + apiKey + 'travel' + parameters + '&type=video';

        // Ajax call to access YouTube API
        $.ajax({
            url: queryURL,
            method: 'GET'
        }).done(function(response) {

            // Empty out video div to prevent blank cards
            $('.progress').hide();
            $('#videos').empty();

            // Loop through the API call to get Video IDs and descriptive paragraph.
            for (var i = 0; i < response.items.length; i++) {

                $('#videos').append('<div class="col s12 m4" id="col-' + i + '">');
                $('#col-' + i).append('<div class="card center medium" style="border-radius:2%" id="card-' + i + '">');
                $('#card-' + i).append('<div class="video-container materialboxed" id="container-' + i + '">');
                $('#container-' + i).append('<object id="object-' + i + '" width="400" height="300" data="https://www.youtube.com/embed/' + response.items[i].id.videoId + '?controls=0"></object>');
                $('#card-' + i).append('<div class="card-content" id="content-' + i + '">');
                $('#content-' + i).append('<p class="teal-text text-darken-3">' + response.items[i].snippet.description);
            }

        });

        // Prevent user from seeing ugly blank video players
        $.blockUI;

        //Empty the search field and keep results within the app

        // getVideos.preventDefault();
    };

});
