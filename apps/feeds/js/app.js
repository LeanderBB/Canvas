AppNS.App.initialize = function(){
    $("#navigation-subscriptions, #navigation-feed, #navigation-item").each(function(){
        $(this).KineticSlider();
    });
    //Backbone.history.start();
};

/* ------------------------------------------------------------------ */
/* APP INITIALIZATION CODE STARTS HERE */
$("div, ul").bind(CSS3_TRANSITION_END, function(){
    $(this).removeClass("animate");
});

// setOnLoadCallback is a static function that registers the specified handler function
// to be called once the page containing this call loads
google.setOnLoadCallback(function(){
    var main_view = new AppNS.Views.Subscriptions();
    var feed_view = new AppNS.Views.Feed();
    var item_view = new AppNS.Views.Item();

    AppNS.App.initialize(); // App initialization function
});

