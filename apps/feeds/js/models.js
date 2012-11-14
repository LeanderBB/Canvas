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
'use script';
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
                /* Feed has been loaded. Update the model with the feed's content */
                that.set({'content': result.feed.entries });
        });
    },

    defaults: {
            title: "Default Feed Title", feed: null, content: null
    }

});
/* ---------- */
/* Backbone Collections ----- */
AppNS.Collections.Subscriptions = Backbone.Collection.extend({
    model : AppNS.Models.Feed
});
