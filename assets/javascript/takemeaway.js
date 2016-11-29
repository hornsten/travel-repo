$(document).ready(function(){

    $('#flight-search').show();
    $('#cars-search').hide();
    $('#hotel-search').hide();
    $('#music-search').hide();

    $('#flights').on('click',function(){
        $('#cars-search').hide();
        $('#music-search').hide();
        $('#hotel-search').hide();

        $('#flight-search').show();
    })

    $('#cars').on('click',function(){
        $('#flight-search').hide();
        $('#hotel-search').hide();
        $('#music-search').hide();

        $('#cars-search').show();
        // displayFlightSearchOptions();
    });

    $('#accommodation').on('click',function(){
        $('#flight-search').hide();
        $('#cars-search').hide();
        $('#music-search').hide();

        $('#hotel-search').show();
    })

    $('#music').on('click',function(){
        $('#flight-search').hide();
        $('#cars-search').hide();
        $('#hotel-search').hide();

        $('#music-search').show();
    })

    $('#hotel-list').on('click',function(){
        getHotelList();
    })

    function getCheapFlight(){
        var pathway = 'http://partners.api.skyscanner.net/apiservices/browsequotes/v1.0/US/USD/en-US/' 
        var origin = $('#origin').val().trim();
        var destination = $('#destination').val().trim();
        var apiKey = '?apikey=no486939943820805016871712172889';

        var queryURL = pathway + query + apiKey;
        console.log(queryURL);

        $.ajax({
            url: queryURL,
            method: 'GET'
        }).done(function(response) {
            $('#hotel-info').append('<ul class="collection" id="collection-list"></ul>');
            for (var i = 0; i < response.items.length; i++){
                $('#collection-list').append('<li class="collection-item">' + response.display_name + '</li>');
            }
        })
    }
})   