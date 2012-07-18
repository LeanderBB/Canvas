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

        this.slider_object = $("#navigation-item").KineticSlider();
    },

    render: function (model) {
        var tmpl = _.template(this.template);
        $("#navigation-item").addClass("animate");
        //var c = $(model.content).sanitizeHTML();
        //$(this.el).html(c);
        var output = {
            title: model.title,
            content: model.content
        };
        $(this.el).html(tmpl(output));

        $("#item").bind("click",function(e){
            e.stopPropagation();
            e.preventDefault();
        })
        $("#navigation-item").addClass("active");

        return this;
    },

    itemSelectionListener: function(model){
        this.render(model);
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
        $(".feed-item-container.active").removeClass("active");
        this.$el.addClass("active");
        AppNS.Events.trigger("click_item_selection", this.model);
    }
});

AppNS.Views.Feed = Backbone.View.extend({
    el : $("#feed"),

    initialize: function () {
        // Listen for UI Events
        this.feedSelectionListener = _.bind(this.feedSelectionListener, this);
        AppNS.Events.bind("click_feed_selection", this.feedSelectionListener);

        this.feedSelectionListener = _.bind(this.feedSelectionListener, this);

        this.slider_object = $("#navigation-feed").KineticSlider();
    },
 
    render: function(args) {

        // ANIMATION
        $("#navigation-feed").removeClass("my_hidden").addClass("animate");
        // -----
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
        $("#navigation-item").removeClass("active");
        $("#item").html("");
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

        AppNS.App.feed_view.slider_object.scrollToPercentage(0, 0);
        $("#navigation-subscriptions").removeClass("new");
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

        this.slider_object = $("#navigation-subscriptions").KineticSlider();
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
