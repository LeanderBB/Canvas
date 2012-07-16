'use strict';
/* Backbone Views ----- */

AppNS.Views.Item = Backbone.View.extend({
    el : $("#item"),
    tagName: "div",
    className: "item-container",
    template: $("#itemTemplate").html(),
    
    initialize: function() {
        // Listen for UI Events
        this.itemSelectionListener = _.bind(this.itemSelectionListener, this);
        AppNS.Events.bind("click_item_selection", this.itemSelectionListener);
    },

    render: function (content) {
        $("#navigation-item").addClass("animate");
        var c = $(content).sanitizeHTML();
        $(this.el).html(c);
        return this;
    },

    itemSelectionListener: function(content){
        this.render(content);
    }
});

AppNS.Views.FeedItemDescription = Backbone.View.extend({
    tagName: "div",
    className: "feed-item-container",
    template: $("#feedTemplate").html(),

    render: function(){
        var tmpl = _.template(this.template);
        var ct = $(this.model.content).find("img").get(0);
        var thumbnail_src = "";
        if (ct !== undefined){
            thumbnail_src = $(ct).attr("src"); }
        this.model["thumbnail_src"] = thumbnail_src;
        $(this.el).html(tmpl(this.model));
        return this;
    },

    events : {
        'mouseup' : 'itemSelectionDispatcher'
    },

    itemSelectionDispatcher: function(e){
        AppNS.Events.trigger("click_item_selection", this.model.content);
    }
});

AppNS.Views.Feed = Backbone.View.extend({
    el : $("#feed"),

    initialize: function () {
        // Listen for UI Events
        this.feedSelectionListener = _.bind(this.feedSelectionListener, this);
        AppNS.Events.bind("click_feed_selection", this.feedSelectionListener);

        this.feedSelectionListener = _.bind(this.feedSelectionListener, this);

    },
 
    render: function(args) {

        $("#navigation-feed").removeClass("my_hidden").addClass("animate");
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
    }
});

AppNS.Views.FeedDescription = Backbone.View.extend({
    tagName: "li",
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
        'mouseup' : 'feedSelectionDispatcher'
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
        $("#subscriptions").addClass("animate");
    },
 
    renderFeed: function (item) {
        var feedDescriptionView = new AppNS.Views.FeedDescription({
            model: item
        });

        $(this.el).append(feedDescriptionView.render().el);
    }
});
