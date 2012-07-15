AppNS.App.initialize = function(){

    google.load("feeds", "1"); // Load Google Feeds API
  
    var slider1 = new Slider({'div': 'navigation-subscriptions', 'slider': 'subscriptions' });
    var slider2 = new Slider({'div': 'navigation-feed', 'slider': 'feed' });
    var slider3 = new Slider({'div': 'navigation-item', 'slider': 'item' });
    //Backbone.history.start();

    var that = this;

    /*
    (function(slider, container_element_id, slider_element_id){
        slider2.EvtScroll.addListener(this, function(){

            array = AppNS.Utils.matrixToArray($(slider_element_id).css("-moz-transform"));
            if (array.length >= 4) {
                y_value = array[5];
                console.log(y_value);
                var e = $(container_element_id).find(".gfx-arrow.up");
                if ((y_value)<-40) {
                    e.addClass("active");
                }
                else {
                    e.removeClass("active");
                }
            }
        });
    })(slider2, "#navigation-feed", "#feed");
    */
};

/* ------------------------------------------------------------------ */
/* APP INITIALIZATION CODE STARTS HERE */

// setOnLoadCallback is a static function that registers the specified handler function
// to be called once the page containing this call loads
var coiso = google.setOnLoadCallback(function(){
    var main_view = new AppNS.Views.Subscriptions();
    var feed_view = new AppNS.Views.Feed();
    var item_view = new AppNS.Views.Item();

    AppNS.App.initialize(); // App initialization function
});

