//define('namespace', 'backbone', 'jquery' , function($, Backbone){

    google.load("feeds", "1"); // Load Google Feeds API

    /* Backbone Models ----- */
    AppNS.Models.Feed = Backbone.Model.extend({

        validate: function( attributes ){
                if( attributes.content === null){
                    this.set('content','');
                }
        },

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

        defaults: {
                title: "Default Feed Title", feed: null, content: null
        },

        events: {
            'click .feed-description-container' : 'cena'
        },

        cena : function(e){
                console.log("clicked");
        }
        
    });

    /* ---------- */
    /* Backbone Collections ----- */
    AppNS.Collections.Subscriptions = Backbone.Collection.extend({
        model : AppNS.Models.Feed
    });

//});
