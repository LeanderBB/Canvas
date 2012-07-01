//define(['backbone', 'models', 'views', 'controllers',
//    'settings', 'jquery', 'jsapi'], function($, google, Backbone){

    //(function(){
    AppNS.App.initialize = function(){


        google.load("feeds", "1"); // Load Google Feeds API

        /*
        $(".navigation").each(function(index,value){
            var element = $(this).get(0);
            var slider = new Slider({'div': element });
        });
        */
        var slider = new Slider({'div': 'navigation-subscriptions', 'slider':'subscriptions'});
        //Backbone.history.start();
    };
    //})(jQuery);

    /* ------------------------------------------------------------------ */
    /* APP INITIALIZATION CODE STARTS HERE */

    // setOnLoadCallback is a static function that registers the specified handler function
    // to be called once the page containing this call loads
    google.setOnLoadCallback(function(){
        var main_view = new AppNS.Views.Subscriptions();
        AppNS.App.initialize(); // App initialization function
    });
     
//});