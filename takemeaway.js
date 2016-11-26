skyscanner.load("snippets","2");
   function main(){
       var snippet = new skyscanner.snippets.SearchPanelControl();
       snippet.setShape("box300x250");
       snippet.setCulture("en-GB");
       snippet.setCurrency("USD");
       snippet.setColourScheme("classicbluedark");
       snippet.setProduct("flights","1");
       snippet.setProduct("hotels","2");
       snippet.setProduct("carhire","3");

       snippet.draw(document.getElementById("snippet_searchpanel"));
   }
   skyscanner.setOnLoadCallback(main);