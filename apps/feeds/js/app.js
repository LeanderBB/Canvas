//define(['backbone', 'models', 'views', 'controllers',
//    'settings', 'jquery', 'jsapi'], function($, google, Backbone){

    AppNS.App.initialize = function(){

        google.load("feeds", "1"); // Load Google Feeds API
        /*
        $(".navigation").each(function(index,value){
            var element = $(this).get(0);
            var slider = new Slider({'div': element });
        });
        */
        var slider1 = new Slider({'div': 'navigation-subscriptions', 'slider': 'subscriptions' });
        var slider2 = new Slider({'div': 'navigation-feed', 'slider': 'feed' });
        var slider3 = new Slider({'div': 'navigation-item', 'slider': 'item' });
        //Backbone.history.start();
    };

    /* ------------------------------------------------------------------ */
    /* APP INITIALIZATION CODE STARTS HERE */

    // setOnLoadCallback is a static function that registers the specified handler function
    // to be called once the page containing this call loads
    google.setOnLoadCallback(function(){
        var main_view = new AppNS.Views.Subscriptions();
        var feed_view = new AppNS.Views.Feed();
        var item_view = new AppNS.Views.Item();

        AppNS.App.initialize(); // App initialization function
    });
//});