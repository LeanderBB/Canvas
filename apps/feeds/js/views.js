//define(['namespace', 'backbone', 'models', 'jquery', 'underscore'], function($, Backbone, underscore){
    /* ---------- */
    /* Backbone Views ----- */

    AppNS.Views.Item = Backbone.View.extend({
        el : $("#item"),
        tagName: "div",
        className: "item-container",
        template: $("#itemTemplate").html(),
        
        initialize: function(){
            // Listen for UI Events
            this.itemSelectionListener = _.bind(this.itemSelectionListener, this);
            AppNS.Events.bind("click_item_selection", this.itemSelectionListener);
        },

        render: function () {
            var tmpl = _.template(this.template);
            $(this.el).html(tmpl(this.model.toJSON()));
            return this;
        },

        itemSelectionListener: function(){
            console.log("item selected");
            console.log(this);
        }

    });

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
            this.feedSelectionListener = _.bind(this.feedSelectionListener, this);
            AppNS.Events.bind("click_feed_selection", this.feedSelectionListener);

            this.itemSelectionDispatcher = _.bind(this.itemSelectionDispatcher, this);
        },
     
        render: function(args) {

            $(this.el).html("");

            for(var i=0; i<args[0].length; i++){

                var item = args[0][i];
                var feedItemDescriptionView = new AppNS.Views.FeedItemDescription({
                    model: item
                });
                $(this.el).append(feedItemDescriptionView.render().el);
            }

        },

        feedSelectionListener: function(e){
            this.render(arguments);
        },

        events: {
            'click': 'itemSelectionDispatcher'
        },

        itemSelectionDispatcher: function(e){
            //var args = this.model.attributes.content;
            var args=arguments;
            AppNS.Events.trigger("click_item_selection", e);
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
            'click' : 'feedSelectionDispatcher'
        },

        feedSelectionDispatcher : function(e){
            $(".feed-description-container.active").removeClass("active");
            $(e.currentTarget).addClass("active");
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