//define(['namespace', 'backbone', 'models', 'jquery', 'underscore'], function($, Backbone, underscore){
    /* ---------- */
    /* Backbone Views ----- */

    AppNS.Views.FeedItemDescription = Backbone.View.extend({
        tagName: "div",
        className: "feed-item-container",
        template: $("#feedTemplate").html(),

        render: function(){
            var tmpl = _.template(this.template);
            $(this.el).html(tmpl(this.model));
            return this;
        }
    });

    AppNS.Views.Feed = Backbone.View.extend({
        el : $("#feed"),
     
        initialize: function () {
            // Listen for UI Events
            var that = this;
            this.handleFeedSelectionEvent = _.bind(this.handleFeedSelectionEvent, that);
            AppNS.Events.bind("click_feed_selection", this.handleFeedSelectionEvent);
        },
     
        render: function(args) {

            $(this.el).html("");

            for(var i=0; i<args.length; i++){

                console.log(args[i]);
                var item = args[i][i];
                //console.log(item);
                var feedItemDescriptionView = new AppNS.Views.FeedItemDescription({
                    model: item
                });
                $(this.el).append(feedItemDescriptionView.render().el);
            }

        },

        handleFeedSelectionEvent: function(e){
            console.log("detected click_feed_selection");
            this.render(arguments);
        }
    });

    AppNS.Views.FeedDescription = Backbone.View.extend({
        tagName: "div",
        className: "feed-description-container",
        template: $("#subscriptionsTemplate").html(),

        initialize: function(){
            // Update the view whenever the model changes

            // The Underscore method "bind" makes sure that when we
            // call "this" in "render" it will always reference this instance
            this.render = _.bind(this.render, this);
            this.model.bind('change', this.render);
        },
        
        render: function () {
            var tmpl = _.template(this.template);
            $(this.el).html(tmpl(this.model.toJSON()));
            return this;
        },

        events: {
            //'click .feed-description-container' : 'cena'
            'click' : 'handleFeedSelection'

        },

        handleFeedSelection : function(e){
            console.log("clicked");
            var args = this.model.attributes.content;
            AppNS.Events.trigger("click_feed_selection", args);
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
//});