/*
 *  This file is part of Canvas.
 * 
 *  Copyright (c) 2012 José Durães
 *  Copyright (c) 2012 Leander Beernaert
 *  Copyright (c) 2012 Tiago Oliveira
 * 
 *  Canvas is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  Canvas is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 * 
 *  You should have received a copy of the GNU General Public License
 *  along with Zeta.  If not, see <http://www.gnu.org/licenses/>.
 */
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
        $("#navigation-item").find("a").attr("href", "");
        $("#navigation-item").children().each(function(){
            $(this).attr("style", "");
        });

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
        AppNS.App.item_view.slider_object.scrollToPercentage(0, 0);
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
        AppNS.App.item_view.slider_object.scrollToPercentage(0, 0);

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
        //this.collection = new AppNS.Collections.Subscriptions(feed_subscriptions_configuration);
        window.app.loadConfig();
        this.collection = new AppNS.Collections.Subscriptions(window.app.getConfig()["feeds"]);
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
