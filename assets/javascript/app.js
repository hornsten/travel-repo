$(document).ready(function() {

    $('.carousel').carousel(); //carousel init

    $('.carousel.carousel-slider').slider({
        full_width: true
    }); //slider init

    // Next slide
    $('.carousel').carousel('next');
    $('.carousel').carousel('next', 3); // Move next n times.
    // Previous slide
    $('.carousel').carousel('prev');
    $('.carousel').carousel('prev', 4); // Move prev n times.
    // Set to nth slide
    $('.carousel').carousel('set', 4);

    var queryURL = "https://pixabay.com/api/videos/?key=3796838-b739bb7867b88767ec1631840&q=japan";

    $('#search').on('click', newWidget);

    function newWidget() {

        var place = $('#location-input').val().trim();

        $('#widget-area').html('<div class="pixabay_widget" data-image-type="photo" data-search="travel ' + place + '" data-max-rows="3"></div>');
        new initPixabayWidget();
        $('#location-input').val("");
        return false;
    };

    $.ajax({
        url: queryURL,
        method: 'GET'
    }).done(function(response) {


    });
});
