$(document).ready(function() {

    var search = $('#search-place-info');
    var articles = $('#article');
    var pics = $('#pics-area');
    var travel = $('#travel-div');

    // -------------------------------Main Process-----------------------------

    elementsHide();
    materializeEffects();


    // When "Click To Escape" button is pressed, get Place Info, Travel Options and YouTube Videos

    search.on('click', getPlaceInfo);
    search.on('click', getTravelOptions);
    search.on('click', getPics);
    search.on('click', function() {

        getVideos();

        // reveals Table of Contents
        $('#contents').show();
        return false;
    });

    // ----------------------------Functions------------------------------



    function getPlaceInfo() {
        $('#information').show();
        //Converts user input to Title Case so that Wiki article can be found

        function titleCase(str) {
            return str.toLowerCase().split(' ').map(function(word) {
                return (word.charAt(0).toUpperCase() + word.slice(1));
            }).join(' ');
        }

        var place = $("#destination").val().trim();

        // Makes a call to Wikipedia API

        $.ajax({
            type: "GET",
            url: "http://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page=" + place + "&callback=?",
            contentType: "application/json; charset=utf-8",
            async: false,
            dataType: "json",
            success: function(data, textStatus, jqXHR) {

                var markup = data.parse.text["*"];
                var blurb = $('<div id="blurb"></div>').html(markup);

                // remove links, as they will not work
                blurb.find('a').each(function() { $(this).replaceWith($(this).html()); });

                // remove any references
                blurb.find('sup').remove();

                // remove any images
                blurb.find('img').remove();
                blurb.find('jpeg').remove();
                blurb.find('jpg').remove();
                blurb.find('svg.png').remove();


                // remove cite error
                blurb.find('.mw-ext-cite-error').remove();
                $('#article').html($(blurb).find('p'));

            },
            error: function(errorMessage) {


            }
        });
    };

    function getVideos() {
        $('.progress').show();
        $('#vids').show();
        // API key and parameters
        var parameters = $('#destination').val().trim();
        var pathway = 'https://www.googleapis.com/youtube/v3/search?part=snippet&safesearch=strict&maxResults=6&controls=0&fs=0&length=short';
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
                $('#col-' + i).append('<div class="card center medium z-depth-3 hoverable" style="border-radius:2%" id="card-' + i + '">');
                $('#card-' + i).append('<div class="video-container" id="container-' + i + '">');
                $('#container-' + i).append('<object id="object-' + i + '" width="400" height="300" data="https://www.youtube.com/embed/' + response.items[i].id.videoId + '?controls=0"></object>');
                $('#card-' + i).append('<div class="card-content" id="content-' + i + '">');
                $('#content-' + i).append('<p class="teal-text text-darken-3">' + response.items[i].snippet.description)
                    .append('<div class="card-action"><a class="small teal-text text-accent-2" href="destination.html">Destination Info</a></div>');
            }

        });

        // Prevent user from seeing blank video players
        $.blockUI;

    };

    function getPics() {

        $('#pixabay').show();
        var place = $('#destination').val().trim();

        $('#pics-area').html('<div class="pixabay_widget" data-search="travel ' + place + '" data-max-rows="4"></div>');
        new initPixabayWidget();

    };

    function getTravelOptions() {
        $('#rome2rio').show();

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

                    // Converts duration of trip to hours
                    const getTime = (min) => {
                        var minutes = min % 60;
                        var u = minutes ? (minutes.toString() + ' minutes') : "";

                        var time = (min / 60).toFixed() + " hours " + u;
                        return time;
                    };

                    $('#travel-info').append('<div class="col s12 m6 left-align" id="info-' + i + '">');
                    $('#info-' + i).append('<ul class="collection with-header z-depth-3 hoverable" id="ul-' + i + '">');
                    $('#ul-' + i).append('<li class="collection-header teal-text teal-accent-4 teal lighten-5 center-align" id="' + i + '"><h5>' + response.routes[i].name);

                    if (response.routes[i].name.includes("Fly")) {

                        $('#' + i).prepend('<i class="material-icons" style="font-size: 30px;">airplanemode_active</i>')
                    } else if (response.routes[i].name.includes("Train")) {

                        $('#' + i).prepend('<i class="material-icons" style="font-size: 30px;">train</i>')
                    } else if (response.routes[i].name.includes("Bus") || response.routes[i].name.includes("bus")) {

                        $('#' + i).prepend('<i class="material-icons" style="font-size: 30px;">directions_bus</i>')
                    } else if (response.routes[i].name.includes("Drive")) {

                        $('#' + i).prepend('<i class="material-icons" style="font-size: 30px;">drive_eta</i>')

                    }

                    $('#ul-' + i).append('<ul id="travel-stats-' + i + '">')
                        .append('<li class="collection-item teal lighten-4" id="coll-' + i + '">Distance: ' + response.routes[i].distance + " miles")
                        .append('<li class="collection-item teal lighten-3" id="coll-' + i + '">Median price: $' + response.routes[i].indicativePrices[0].price + " USD");

                    //excludes "Drive" when writing price range data, since the API does not define this value
                    if (response.routes[i].name.includes("Drive") === false) {

                        $('#ul-' + i).append('<li class="collection-item teal lighten-2" id="coll-' + i + '">Price Range: $' + response.routes[i].indicativePrices[0].priceLow + " - $" + response.routes[i].indicativePrices[0].priceHigh + " USD")
                    }

                    $('#ul-' + i).append('<li class="collection-item teal lighten-1" id="coll-' + i + '">Total Duration: ' + getTime(response.routes[i].totalDuration))
                        .append('<li class="collection-item teal lighten-5" id="coll-' + i + '"><a href="takemeaway.html">Like this? Book it!</a>');
                }
            });

        }
    }

    function elementsHide() {
        // Hides elements
        $(".button-collapse").sideNav();
        $('.progress').hide();
        $('#contents').hide();
        $('#information').hide();
        $('#pixabay').hide();
        $('#vids').hide();
        $('#rome2rio').hide();

    }

    function materializeEffects() {

        // Enables Table of Contents Scroller
        $('.scrollspy').scrollSpy();

        //Keeps Table Of Contents in correct range

        $('#contents').pushpin({
            top: 550,
            bottom: 2500,
            offset: 200
        });

        // Expands Wiki Article on hover, truncates when not being read
        $('#article').hover(

            function() { $(this).removeClass('truncate'); },

            function() {
                $(this).addClass('truncate')
            });

    };
});
