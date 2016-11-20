$(document).ready(function() {
    $('.progress').hide();
    // Creates parallax effect
    $('.parallax').parallax();

    // When button is pressed, grab the user input to start our search

    $('#search').on('click', function() {
        $('.progress').show();
        // API key and parameters
        var parameters = $('#location-input').val().trim();
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
                $('#container-' + i).append('<object id="object-' + i + '" width="400" height="300" data="http://www.youtube.com/embed/' + response.items[i].id.videoId + '?controls=0"></object>');
                $('#card-' + i).append('<div class="card-content" id="content-' + i + '">');
                $('#content-' + i).append('<p class="teal-text text-darken-3">' + response.items[i].snippet.description);

            }

        });
        // Prevent user from seeing ugly blank video players
        $.blockUI;

        //Empty the search field and keep results within the app
        $('#location-input').val("");
        return false;
    })


});
