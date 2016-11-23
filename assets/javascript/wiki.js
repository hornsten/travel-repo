$(document).ready(function() {

    $('#search-travel-info').on('click', getPlaceInfo);

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
            error: function(errorMessage) {}
        });

    };
});
