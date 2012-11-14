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
//'use strict';

/*
@params
url

[OPTIONAL]
options:
    { num_entries: INTEGER } || number of feed entries to fetch
*/
function IFeedModel(url, options) {
    if (options === undefined) options={};

    this.url = url;
    this.num_entries = options.num_entries || 10;
    this.content=undefined;
}

IFeedModel.prototype.init = function(callback) {
    var that = this;
    // Download the feed from google servers. Calls the callback when done.
    var feed = new google.feeds.Feed(this.url);
    feed.setNumEntries(this.num_entries);
    feed.load(
        function(result) {
            /* Feed has been loaded. Update the model with the feed's content */
            that.content = result.feed.entries;
            callback();
    });
};

IFeedModel.prototype.getItemCount = function () {
    if (this.content!==undefined) { 
        return this.content.length; }
    else return 0;
};

IFeedModel.prototype.getItems = function () {
        return this.content;
};

IFeedModel.prototype.getItemAtIndex = function (index) {
    if (this.content!==undefined){
        return this.content[index]; }
    else return undefined;
};

/* -------------------- */
/*  Callback function - feed has been loaded and model is up-to-date */
var callback = function(){
    // ... //
};

/* -------------------- */
/* APP INITIALIZATION CODE STARTS HERE */

google.load("feeds","1"); // Load Google Feeds API
ifeedmodel = new IFeedModel("http://feeds.feedburner.com/publicoRSS"); // example url provided
// setOnLoadCallback is a static function that registers the specified handler function
// to be called once the page containing this call loads
google.setOnLoadCallback(function(){
    ifeedmodel.init(callback);
});

