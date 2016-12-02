// VARIABLES========================================

// variables for cheapest flight API
var originSkyCode = "";
var destinationSkyCode = "";

var carrierInfo = [];
var quotes = [];

var directflights = [];
var indirectflights = [];

var directPrices = [];
var indirectPrices = [];

var minDirectPrice = [];
var minIndirectPrice = [];

var minDirectFlight = [];
var minIndirectFlight = [];

// variables for music API
// set global arrays to store the lists of top tracks at origin and destination

var topTracksOrigin = [];
var topTracksDestination = [];

var playlistID = [];



// FUNCTIONS========================================

function getCheapFlights() {

    $('#progress-1').show();

    var pathwayFindSkyCode = 'http://partners.api.skyscanner.net/apiservices/xd/autosuggest/v1.0/US/USD/en-GB/?query='
    var originInput = $('#origin').val().trim();
    var destinationInput = $('#destination').val().trim();
    var apiKey = 'apiKey=no486939943820805016871712172889';

    var pathwayFindPrice = 'http://partners.api.skyscanner.net/apiservices/xd/browsequotes/v1.0/US/USD/en-GB'

    // empty out the div that contains the cards
    $('#cheap-flight-info').empty();

    //reset all the flight variables before working with them
    resetFlightVariables();

    // API call to get the Skyscanner location codes for origin and destination
    var originQueryURLCode = pathwayFindSkyCode + originInput + "&" + apiKey;
    console.log(originQueryURLCode);

    // start grabbing the Skycanner code for user's destination
    $.ajax({
        url: originQueryURLCode,
        crossDomain: true,
        contentType: 'application/json',
        type: 'GET',
        dataType: 'jsonp',
        jsonpCallback: 'jsonp',

    }).done(function(response) {
        console.log("Origin Place Information");
        console.log(response);

        // record the Skyscanner code into the global variable destinationSkyCode
        originSkyCode = response.Places[0].PlaceId;
        console.log("Origin Skyscanner Code: " + originSkyCode);

    }).done(function() {
        var destinationQueryURLCode = pathwayFindSkyCode + destinationInput + "&" + apiKey;
        console.log(destinationQueryURLCode);

        // start grabbing the Skycanner code for user's destination
        $.ajax({
            url: destinationQueryURLCode,
            crossDomain: true,
            contentType: 'application/json',
            type: 'GET',
            dataType: 'jsonp',
            jsonpCallback: 'jsonp',

        }).done(function(response) {
            console.log("Destination Place Information");
            console.log(response);

            // record the Skyscanner code into the global variable destinationSkyCode
            destinationSkyCode = response.Places[0].PlaceId;
            console.log("Destination Skyscanner Code: " + destinationSkyCode);

        }).done(function() {

            // start finding the cheapest price within the next year using the newly acquired Skyscanner codes for locations

            var queryURL = pathwayFindPrice + "/" + originSkyCode + "/" + destinationSkyCode + '/anytime/anytime?' + apiKey;
            console.log(queryURL);

            // grab information from Skyscanner given the user's origin and destination's Skyscanner IDs
            $.ajax({
                url: queryURL,
                crossDomain: true,
                contentType: 'application/json',
                type: 'GET',
                dataType: 'jsonp',
                jsonpCallback: 'jsonp',

            }).done(function(response) {
                console.log(response);

                // store information about the available carriers into a global variable to reference carrierID and carrierName later
                for (var i = 0; i < response.Carriers.length - 1; i++) {
                    carrierInfo.push(new Object(
                        carriers = {
                            carrierId: response.Carriers[i].CarrierId,
                            carrierName: response.Carriers[i].Name,
                        }
                    ));
                    console.log("Carriers Information");
                    console.log(carrierInfo);

                };

                // store information about the quotes into a global variable
                for (var i = 0; i < response.Quotes.length - 1; i++) {
                    quotes.push(new Object(
                        quotesInfo = {
                            direct: response.Quotes[i].Direct,
                            outboundCarrierID: response.Quotes[i].OutboundLeg.CarrierIds[0],
                            outboundDate: moment(response.Quotes[i].OutboundLeg.DepartureDate).format('MMMM Do YYYY'),
                            inboundCarrierID: response.Quotes[i].InboundLeg.CarrierIds[0],
                            inboundDate: moment(response.Quotes[i].InboundLeg.DepartureDate).format('MMMM Do YYYY'),
                            minPrice: response.Quotes[i].MinPrice,
                            quoteID: response.Quotes[i].QuoteId,
                        }
                    ))
                    console.log("Quotes");
                    console.log(quotes);
                };

            }).done(function() {
                // sort the quotes by direct and indirect flights
                for (var i = 0; i < quotes.length - 1; i++) {
                    if (quotes[i].direct === true) {
                        directflights.push(quotes[i]);
                    }

                    if (quotes[i].direct === false) {
                        indirectflights.push(quotes[i]);
                    }
                }

            }).done(function() {
                console.log("Direct Flights");
                console.log(directflights);
                console.log("Indirect Flights");
                console.log(indirectflights);

                // grab the direct flights' minimum prices and store them into a global array
                for (var i = 0; i < directflights.length - 1; i++) {
                    directPrices.push(directflights[i].minPrice);
                }

                // grab the indirect flights' minimum prices and store them into a global array
                for (var i = 0; i < indirectflights.length - 1; i++) {
                    indirectPrices.push(indirectflights[i].minPrice);
                }

            }).done(function() {
                console.log("Direct Flight Prices");
                console.log(directPrices);
                console.log("Indirect Flight Prices");
                console.log(indirectPrices);

                // after we have the arrays of minimum direct prices and minimum indirect prices
                // we find the minimum values in those arrays, a.k.a the lowest price possible
                minDirectPrice = Math.min.apply(Math, directPrices);
                minIndirectPrice = Math.min.apply(Math, indirectPrices);
                console.log("Minimum Direct Flight Prices");
                console.log(minDirectPrice);
                console.log("Minimum Indirect Flight Prices");
                console.log(minIndirectPrice);

            }).done(function() {
                // look for the flight with that lowest price in the directflights array, a.k.a the colelction of all direct flights
                // if there's a match, push all information of that flight into an empty global array
                for (var i = 0; i < directflights.length - 1; i++) {
                    if (minDirectPrice === directflights[i].minPrice) {
                        minDirectFlight.push(directflights[i]);
                    }
                }

                // look for the flight with that lowest price in the indirectflights array, a.k.a the colelction of all indirect flights
                // if there's a match, push all information of that flight into an empty global array
                for (var i = 0; i < indirectflights.length - 1; i++) {
                    if (minIndirectPrice === indirectflights[i].minPrice) {
                        minIndirectFlight.push(indirectflights[i]);
                    }
                }

            }).done(function() {
                console.log("Direct flight with the lowest price");
                console.log(minDirectFlight);
                console.log("Indirect flight with the lowest price");
                console.log(minIndirectFlight);

                // at this point, we finish processing all information
                // hide the progress bar
                $('#progress-1').hide();

                // check if there is a direct flight for that route at all (some routes don't)
                if (minDirectFlight.length > 0) {
                    var outboundCarrier = '';
                    var inboundCarrier = '';

                    // match carrierName with carrierId so we can display that information on the cards
                    function a() {
                        for (var i = 0; i < minDirectFlight.length; i++) {

                            for (var m = 0; m < carrierInfo.length - 1; m++) {
                                if (minDirectFlight[i].outboundCarrierID === carrierInfo[m].carrierId) {
                                    outboundCarrier = carrierInfo[m].carrierName;
                                }

                                if (minDirectFlight[i].inboundCarrierID === carrierInfo[m].carrierId) {
                                    inboundCarrier = carrierInfo[m].carrierName;
                                }
                            }
                        }
                    }

                    // call the functions
                    a();

                    // when it's done
                    $.when(a).done(function() {

                        // creating direct flight cards
                        for (var i = 0; i < minDirectFlight.length; i++) {
                            $('#cheap-flight-info').append('<div class="col s12 m6 l6 left-align" style="padding: 0px" id="di-col-' + i + '">');
                            $('#di-col-' + i).append('<div class="card" id="di-card-' + i + '">');
                            $('#di-card-' + i).append('<div class="card-image" id="di-image-' + i + '">');
                            $('#di-card-' + i).append('<div class="card-content" id="di-content-' + i + '" style="background-color: #b2dfdb">');
                            $('#di-image-' + i).append('<img src="assets/images/instagram-travel-nonstop.jpg">'); //Add image
                            $('#di-image-' + i).append('<span class="card-title white-text" style="clear:both" id="di-title-' + i + 'a">Non-stop<br><b>$' + minDirectFlight[i].minPrice + '</b></span>');

                            $('#di-content-' + i).append('<div style="clear:both"><p><b>' + outboundCarrier + '</b></p></div>');
                            $('#di-content-' + i).append('<div style="clear:both"><i class="material-icons right">arrow_forward</i><p>' + minDirectFlight[i].outboundDate + '</p></div>');
                            $('#di-content-' + i).append('<br><div style="clear:both"><p><b>' + inboundCarrier + '</b></p></div>');
                            $('#di-content-' + i).append('<div style="clear:both"><i class="material-icons right">arrow_back</i><p>' + minDirectFlight[i].inboundDate + '</p></div>');

                        }
                    })
                }

                // check if there is an indirect flight for that route at all (some routes may not do)
                if (minIndirectFlight.length > 0) {
                    var outboundCarrier = '';
                    var inboundCarrier = '';

                    // match carrierName with carrierId so we can display that information on the cards
                    function a() {
                        for (var i = 0; i < minIndirectFlight.length; i++) {

                            for (var m = 0; m < carrierInfo.length - 1; m++) {
                                if (minIndirectFlight[i].outboundCarrierID === carrierInfo[m].carrierId) {
                                    outboundCarrier = carrierInfo[m].carrierName;
                                }

                                if (minIndirectFlight[i].inboundCarrierID === carrierInfo[m].carrierId) {
                                    inboundCarrier = carrierInfo[m].carrierName;
                                }
                            }
                        }
                    }

                    // call the functions
                    a();

                    // when it's done
                    $.when(a).done(function() {

                        // creating indirect flight cards
                        for (var i = 0; i < minIndirectFlight.length; i++) {
                            $('#cheap-flight-info').append('<div class="col s12 m6 l6 left-align" style="padding: 0px" id="in-col-' + i + '">');
                            $('#in-col-' + i).append('<div class="card" id="in-card-' + i + '">');
                            $('#in-card-' + i).append('<div class="card-image" id="in-image-' + i + '">');
                            $('#in-card-' + i).append('<div class="card-content" id="in-content-' + i + '" style="background-color: #f8bbd0">');
                            $('#in-image-' + i).append('<img src="assets/images/instagram-travel-with-stops.jpg">'); //Add image
                            $('#in-image-' + i).append('<span class="card-title white-text" style="clear:both" id="in-title-' + i + 'a">With stops<br><b>$' + minIndirectFlight[i].minPrice + '</b></span>');

                            $('#in-content-' + i).append('<div style="clear:both"><p><b>' + outboundCarrier + '</b></p></div>');
                            $('#in-content-' + i).append('<div style="clear:both"><i class="material-icons right">arrow_forward</i><p>' + minIndirectFlight[i].outboundDate + '</p></div>');
                            $('#in-content-' + i).append('<br><div style="clear:both"><p><b>' + inboundCarrier + '</b></p></div>');
                            $('#in-content-' + i).append('<div style="clear:both"><i class="material-icons right">arrow_back</i><p>' + minIndirectFlight[i].inboundDate + '</p></div>');
                        }
                    })
                }

            })
        })
    })
}


function showDJButton() {
    $('#function-button').empty();
    $('#start-music-button').empty();
    $('#reset-button').empty();

    var b = $('<button>');
    b.addClass('btn waves-effect waves-light');
    b.attr('type', 'submit');
    b.attr('id', 'my-dj');
    b.html('Be my DJ<i class="material-icons right">library_music</i>');

    $('#function-button').append(b);
}


function getMusicPlaylist() {

    // grab user input
    var from = $('#music-from').val().trim();
    var fromGeocode = '';
    var fromCity = '';
    var fromCountry = '';

    var to = $('#music-to').val().trim();
    var toGeocode = '';
    var toCity = '';
    var toCountry = '';

    // set global variables for distance and duration
    var tripDistance = '';
    var tripDuration = '';

    // API Keys
    var distanceAPIKey = 'AIzaSyD8yfN8avGIICVxTXUIusodRoJkZ8M9JYI';
    var geocodeAPIKey = 'AIzaSyA1cvHrEC_9dqhiDlkhlDHrXnQ_0snE4E0';
    var lastfmAPIKey = 'a8345b407ab8e1a33136ed558452d9e7';

    // get general distance & duration information
    var distancePathway = 'https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=' + from + '&destinations=' + to + '&key=' + distanceAPIKey;
    console.log(distancePathway);

    $.ajax({
        url: distancePathway,
        method: 'GET'
    }).done(function(response) {
        console.log(response);

        tripDistance = response.rows[0].elements[0].distance.value;
        console.log(tripDistance);

        duration = response.rows[0].elements[0].duration.value;
        console.log(tripDuration);
    })


    // get country and city information of origin and destination
    var geocodeFromPathway = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + from + '&key=' + geocodeAPIKey;
    console.log(geocodeFromPathway);

    var geocodeToPathway = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + to + '&key=' + geocodeAPIKey;
    console.log(geocodeToPathway);

    // get information of the origin
    function ajaxForID() {
        $.ajax({
            url: geocodeFromPathway,
            method: 'GET'
        }).done(function(response) {
            console.log('Geocode Origin');
            console.log(response);

            // function x to be called later, this is for generating fromCountry information
            function x() {
                fromCity = response.results[0].address_components[0].long_name;
                console.log('FromCity ' + fromCity);

                // testing the conditions in the API response, because depending on countries, the country information maybe placed in different orders
                if (response.results[0].address_components[3]) {
                    if (response.results[0].address_components[3].long_name) {
                        fromCountry = response.results[0].address_components[3].long_name;
                        console.log('fromCountry ' + fromCountry);
                    } else if (response.results[0].address_components[2]) {
                        if (response.results[0].address_components[2].long_name) {
                            fromCountry = response.results[0].address_components[2].long_name;
                            console.log('fromCountry ' + fromCountry);
                        } else if (response.results[0].address_components[1]) {
                            fromCountry = response.results[0].address_components[1].long_name;
                            console.log('toCountry ' + toCountry);
                        }
                    }

                } else if (response.results[0].address_components[2]) {
                    if (response.results[0].address_components[2].long_name) {
                        fromCountry = response.results[0].address_components[2].long_name;
                        console.log('fromCountry ' + fromCountry);
                    } else if (response.results[0].address_components[1]) {
                        fromCountry = response.results[0].address_components[1].long_name;
                        console.log('toCountry ' + toCountry);
                    }
                } else if (response.results[0].address_components[1]) {
                    fromCountry = response.results[0].address_components[1].long_name;
                    console.log('toCountry ' + toCountry);
                }
            }

            // call the x function here, then pass another function when x finishes executing
            x();
            $.when(x).done(function() {

                // grab top tracks at the origin using last.fm API
                var pathFromToptracks = 'http://ws.audioscrobbler.com/2.0/?method=geo.gettoptracks&country=' + fromCountry + '&location=' + fromCity + '&limit=25&api_key=' + lastfmAPIKey + '&format=json';
                console.log("pathFromTopTracks " + pathFromToptracks);
                $.ajax({
                    url: pathFromToptracks,
                    method: 'GET'
                }).done(function(response) {
                    console.log('Top Tracks at Origin');
                    console.log(response);

                    function hey() {
                        for (var m = 0; m < response.tracks.track.length; m++) {
                            if (topTracksOrigin.indexOf(response.tracks.track[m].name) === -1) {
                                topTracksOrigin.push(response.tracks.track[m].name);
                                console.log('topTracksOrigin Array');
                                console.log(topTracksOrigin)
                            }
                        }
                    }
                    hey();
                    $.when(hey).done(function() {
                        // display the list of popular tracks at origin on the DOM
                        for (var m = 0; m < topTracksOrigin.length; m++) {
                            // var b = $('<tr><td></td></tr>');
                            var b = $('<li>');
                            b.addClass('collection-item');
                            b.text(topTracksOrigin[m]);
                            $('#origin-song-body').append(b);
                        }
                    })


                    // get information of the destination
                    $.ajax({
                        url: geocodeToPathway,
                        method: 'GET'
                    }).done(function(response) {
                        console.log('Geocode Destination');
                        console.log(response);
                        toCity = response.results[0].address_components[0].long_name;
                        console.log('toCity ' + toCity);

                        function x() {
                            if (response.results[0].address_components[3]) {
                                if (response.results[0].address_components[3].long_name) {
                                    toCountry = response.results[0].address_components[3].long_name;
                                    console.log('toCountry ' + toCountry);
                                } else if (response.results[0].address_components[2]) {
                                    if (response.results[0].address_components[2].long_name) {
                                        toCountry = response.results[0].address_components[2].long_name;
                                        console.log('toCountry ' + toCountry);
                                    } else if (response.results[0].address_components[1]) {
                                        toCountry = response.results[0].address_components[1].long_name;
                                        console.log('toCountry ' + toCountry);
                                    }
                                }

                            } else if (response.results[0].address_components[2]) {
                                if (response.results[0].address_components[2].long_name) {
                                    toCountry = response.results[0].address_components[2].long_name;
                                    console.log('toCountry ' + toCountry);
                                } else if (response.results[0].address_components[1]) {
                                    toCountry = response.results[0].address_components[1].long_name;
                                    console.log('toCountry ' + toCountry);
                                }
                            } else if (response.results[0].address_components[1]) {
                                toCountry = response.results[0].address_components[1].long_name;
                                console.log('toCountry ' + toCountry);
                            }
                        }

                        x();
                        $.when(x).done(function() {
                            // grab top tracks at the destination using last.fm API
                            var pathToToptracks = 'http://ws.audioscrobbler.com/2.0/?method=geo.gettoptracks&country=' + toCountry + '&location=' + toCity + '&limit=25&api_key=' + lastfmAPIKey + '&format=json';
                            $.ajax({
                                url: pathToToptracks,
                                method: 'GET'
                            }).done(function(response) {
                                console.log('Top Tracks at Destination');
                                console.log(response);

                                function a() {
                                    for (var m = 0; m < response.tracks.track.length; m++) {
                                        if (topTracksDestination.indexOf(response.tracks.track[m].name) === -1) {
                                            topTracksDestination.push(response.tracks.track[m].name);
                                            console.log('topTracksDestination Array');
                                            console.log(topTracksDestination);
                                        }
                                    }
                                }

                                a();
                                $.when(a).done(function() {

                                    // display the list of popular tracks at destination `on the DOM
                                    for (var m = 0; m < topTracksDestination.length; m++) {
                                        // var s = $('<tr><td></td></tr>');
                                        var s = $('<li>');
                                        s.addClass('collection-item')
                                        s.text(topTracksDestination[m]);
                                        $('#destination-song-body').append(s);
                                    }

                                    // finally, now that we have all the information we need, we can finally call the Spotify API to get the songs' IDs
                                    getSongIDs();
                                }).done(function() {
                                    $('#progress-2').hide();
                                })

                            })
                        })
                    })
                })
            })

        })
    }


    // showing the elements on the page
    // commands to show the start music player button
    var b = $('<button>');
    b.addClass('btn waves-effect waves-light');
    b.attr('type', 'submit');
    b.attr('id', 'start-music');
    b.html('Start Music Player<i class="material-icons right">library_music</i>');

    // commands to show the reset form button
    var a = $('<button>');
    a.addClass('btn waves-effect waves-light');
    a.attr('type', 'submit');
    a.attr('id', 'reset-form');
    a.html('Reset Form<i class="material-icons right">settings_backup_restore</i>')

    //empty out the divs to prevent unnecessary appending
    $('#function-button').empty();
    $('#start-music-button').empty();
    $('#reset-button').empty();

    $('#start-music-button').append(b);
    $('#reset-button').append(a);
    $('#playlist-tables').show();
    $('#status-bar').show();

    //add the elements
    ajaxForID();
}

function getSongIDs() {

    for (var i = 0; i < topTracksOrigin.length; i++) {

        var queryURL = 'https://api.spotify.com/v1/search?q=' + topTracksOrigin[i] + '&type=track';
        $.ajax({ url: queryURL, method: 'GET' }).done(function(response) {

            // Record the track ID into an array
            if (playlistID.indexOf(response.tracks.items[0].id) === -1) {
                playlistID.push(response.tracks.items[0].id);
            }

        })
    }

    for (var m = 0; m < topTracksDestination.length; m++) {

        var queryURL2 = 'https://api.spotify.com/v1/search?q=' + topTracksDestination[m] + '&type=track';
        $.ajax({
                url: queryURL2,
                method: 'GET'
            })
            .done(function(response) {

                if (playlistID.indexOf(response.tracks.items[0].id) === -1) {
                    playlistID.push(response.tracks.items[0].id);
                    console.log('this is playlistID:');
                    console.log(playlistID);
                }


            })
    }

}



function shuffleSongs() {

    var player = '<iframe src="https://embed.spotify.com/?uri=spotify:trackset:' + playlistID + ' width="300" height="380" frameborder="0" allowtransparency="true" style="margin-top:10px"></iframe>';
    console.log(player);
    // Appends the new player into the HTML
    $('#music-player').empty();
    $('#music-player').append(player);
}

function resetMusic() {
    $('#music-from').val('');
    $('#music-to').val('');
    $('#music-player').empty();
    playlistID = [];
    topTracksOrigin = [];
    topTracksDestination = [];

    $('#origin-song-body').empty();
    $('#destination-song-body').empty();

    showDJButton();
    $('#playlist-tables').hide();

}

function resetCheapestFlight() {
    $('#origin').val('');
    $('#destination').val('');
    $('#cheap-flight-info').empty();
    $('#reset-cheapest-flight').hide();
    $('#cheapest-flight').prop('disabled', false);
    resetFlightVariables();
}

function resetFlightVariables() {
    originSkyCode = "";
    destinationSkyCode = "";

    carrierInfo = [];
    quotes = [];

    directflights = [];
    indirectflights = [];

    directPrices = [];
    indirectPrices = [];

    minDirectPrice = [];
    minIndirectPrice = [];

    minDirectFlight = [];
    minIndirectFlight = [];
}

// MAIN PROCESS============================================

$(document).ready(function() {

    $('#flight-search').show();
    $('#cars-search').hide();
    $('#hotel-search').hide();
    $('#music-search').hide();
    $('#progress-1').hide();
    $('#reset-cheapest-flight').hide();



    $('#flights').on('click', function() {
        $('#cars-search').hide();
        $('#music-search').hide();
        $('#hotel-search').hide();

        $('#flight-search').show();
        $('#progress-1').hide();
        $('#reset-cheapest-flight').hide();
    })

    $('#cars').on('click', function() {
        $('#flight-search').hide();
        $('#hotel-search').hide();
        $('#music-search').hide();

        $('#cars-search').show();
    });

    $('#accommodation').on('click', function() {
        $('#flight-search').hide();
        $('#cars-search').hide();
        $('#music-search').hide();

        $('#hotel-search').show();
    })

    $('#music').on('click', function() {
        $('#flight-search').hide();
        $('#cars-search').hide();
        $('#hotel-search').hide();

        $('#music-search').show();

        $('#progress-2').hide();
        resetMusic();


    })

    $('#cheapest-flight').on('click', function() {
        var flightFrom = $('#origin').val().trim();
        var flightTo = $('#destination').val().trim();
        if (flightFrom === '' || flightTo === '') {
            Materialize.toast('Please tell me where you want to go!', 4000, 'red lighten-1 rounded');
        } else {
            $('progress-1').show();
            $('#cheapest-flight').prop('disabled', true);
            $('#reset-cheapest-flight').show();
            getCheapFlights();
        }
    })

    $('#reset-cheapest-flight').on('click', function() {
        resetCheapestFlight();
    })

    $('#function-button').on('click', function() {
        var musicFrom = $('#music-from').val().trim();
        var musicTo = $('#music-to').val().trim();

        if (musicFrom === '' || musicTo === '') {
            Materialize.toast('Please tell me where you want to go!', 4000, 'red lighten-1 rounded');
        } else {
            // show progress bar that we are loading data
            $('#progress-2').show();
            getMusicPlaylist();
        }
    })

    $('#start-music-button').on('click', function() {
        $('#start-music').prop('disabled', true);
        shuffleSongs();
    })

    $('#reset-button').on('click', function() {
        $('#start-music').prop('disabled', false)
        resetMusic();
        $('#progress-2').hide();
    })


})
