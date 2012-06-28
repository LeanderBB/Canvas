/* ---------- Feeds App ---------- */
google.load("feeds", "1"); // Load Google Feeds API

// setOnLoadCallback is a static function that registers the specified handler function
// to be called once the page containing this call loads
google.setOnLoadCallback(function(){

(function($){

// Sample data
var feed_subscriptions_configuration = [
    { title: "Público", url: ("http://feeds.feedburner.com/publicoRSS"), content:'' },
    { title: "Jornal de Noticias", url: ("http://fastpshb.appspot.com/feed/1/fastpshb"), content: ''},
    { title: "Correio da Manhã", url: ("http://fastpshb.appspot.com/feed/1/fastpshb"), content: '' }
];

/* Namespaces ----- */
var AppNS = AppNS || {}; // The Application Namespace
AppNS.App = AppNS.App || {};
AppNS.Models = AppNS.Models || {};
AppNS.Views = AppNS.Views || {};
AppNS.Collections = AppNS.Collections || {};
/* ---------- */

/* Backbone Models ----- */
AppNS.Models.Feed = Backbone.Model.extend({

    validate: function( attributes ){
            if( attributes.content === null){
                this.set('content','');
            }
    },

    // move initialize from view to here
    initialize: function () {

        var that = this;
        // Download the feed from google servers. Calls the callback when done.
        var feed = new google.feeds.Feed(this.get('url'));
        feed.setNumEntries(10);
        feed.load(
            function(result) {
                console.log(result);
                /* Feed has been loaded. Update the model with the feed's content */
                //that.model.set({'content': result.feed.entries[0].content});
                that.set({'content': 'The Feed has been loaded'});
                //that.render();
        });
    },

    instanceProperty: 'title'},{
    instanceProperty: 'feed'},{
    instanceProperty: 'content'},{

    defaults: {
            title: "Default Feed Title", feed: null, content: null
    }
});

/* ---------- */
/* Backbone Collections ----- */
AppNS.Collections.Subscriptions = Backbone.Collection.extend({
    model : AppNS.Models.Feed
});
/* ---------- */

/* Backbone Views ----- */
AppNS.Views.FeedDescription = Backbone.View.extend({
    tagName: "div",
    className: "feed-description-container",
    template: $("#subscriptionsTemplate").html(),
 
    render: function () {
        var tmpl = _.template(this.template);
        $(this.el).html(tmpl(this.model.toJSON()));
        return this;
    }
});

AppNS.Views.Feed = Backbone.View.extend({
    tagName: "div",
    className: "feed-container",
    template: $("#feedTemplate").html(),

    render: function(){
        var tmpl = _.template(this.template);
        $(this.el).html(tmpl(this.model.toJSON()));
        return this;
    }
});

AppNS.Views.Subscriptions = Backbone.View.extend({
    el : $("#subscriptions"),
 
    initialize: function () {
        this.collection = new AppNS.Collections.Subscriptions(feed_subscriptions_configuration);
        this.render();
    },
 
    render: function () {
        var that = this;
        _.each(this.collection.models, function (item) {
            that.renderFeed(item);
        }, this);
    },
 
    renderFeed: function (item) {
        var feedDescriptionView = new AppNS.Views.FeedDescription({
            model: item
        });

        $(this.el).append(feedDescriptionView.render().el);
    }
});

/* ---------- */
/* Backbone Controllers/Routes ----- */
/*
var PageController = Backbone.Controller.extend({
    routes: {
    }
});
*/

/* ---------- */
/* Initialize the Views ----- */

var main_view = new AppNS.Views.Subscriptions();

})(jQuery);

});
