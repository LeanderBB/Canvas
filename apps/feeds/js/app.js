'use script';

/* ------------------------------------------------------------------ */
/* APP INITIALIZATION CODE STARTS HERE */
$("div, ul").bind(CSS3_TRANSITION_END, function(){
    $(this).removeClass("animate");
});

// setOnLoadCallback is a static function that registers the specified handler function
// to be called once the page containing this call loads
google.setOnLoadCallback(function(){
    window.app = new CanvasApp("feeds");
    AppNS.App.main_view = new AppNS.Views.Subscriptions();
    AppNS.App.feed_view = new AppNS.Views.Feed();
    AppNS.App.item_view = new AppNS.Views.Item();

    window.app.ready();
});

