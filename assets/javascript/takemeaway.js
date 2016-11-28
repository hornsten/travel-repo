$(document).ready(function(){

    // Add sections to the main content area dynamically----------

    $('#flights').on('click', function(){

        var getFlightSearch = '<blockquote><h3 class="teal-text teal-accent-4">Get your flights on</h3></blockquote><div id="flight-info"><div id="snippet_searchpanel" style="width: auto; height:auto;"></div></div>';

        $('#main-content').empty();
        $('#main-content').append(getFlightSearch);
    })

    $('#cars').on('click', function(){

        var getCarsSearch = '<blockquote><h3 class="teal-text teal-accent-4">Need a car?</h3></blockquote><div id="cars-info"></div>';

        $('#main-content').empty();
        $('#main-content').append(getCarsSearch);
    })

    $('#accommodation').on('click', function(){

        var getStaySearch = '<blockquote><h3 class="teal-text teal-accent-4">Where to stay</h3></blockquote><div id="stay-info"></div>'
        $('#main-content').empty();
        $('#main-content').append(getStaySearch);
    })

    $('#music').on('click', function(){

        var getMusicSearch = '<blockquote><h3 class="teal-text teal-accent-4">Music for the road</h3></blockquote><div id="music-info"></div>';

        $('#main-content').empty();
        $('#main-content').append(getMusicSearch);
    })

    // Load Skycanner API------------------------------------------
    $('#flights').on('click', function(){
            skyscanner.load("snippets","2");
                function main(){
                    var snippet = new skyscanner.snippets.SearchPanelControl();
                    snippet.setShape("box300x250");
                    snippet.setCulture("enGB");
                    snippet.setCurrency("USD");
                    snippet.setColourScheme("classicbluedark");
                    snippet.setProduct("flights","1");
                    snippet.setProduct("hotels","2");
                    snippet.setProduct("carhire","3");
             
                    snippet.draw(document.getElementById("snippet_searchpanel"));
                }
            skyscanner.setOnLoadCallback(main); 

    })

    


});