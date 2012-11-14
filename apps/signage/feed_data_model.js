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

/*
@params
url

[OPTIONAL]
options:
    { num_entries: INTEGER } || number of feed entries to fetch
*/
function IFeedModel(url, options) {
    if (options === undefined) {
        options = {};
    }
    this.url = url;
    this.num_entries = options.num_entries || 10;
    this.content = undefined;
    this.title = "No Title";
}

IFeedModel.prototype.init = function (callback) {
    var that = this, feed = new google.feeds.Feed(this.url);
    feed.setNumEntries(this.num_entries);
    feed.load(
        function (result) {
            if (!result.error) {
                /* Feed has been loaded. Update the model with the
                feed's content */
                that.content = result.feed.entries;
                that.title = result.feed.title;
            } else {
                that.title = "Error";
                that.content = IFeedModel.DummyContent;
            }
            callback();
        });
};

IFeedModel.prototype.getItemCount = function () {
    if (this.content !== undefined) {
        return this.content.length;
    } else {
        return 0;
    }
};

IFeedModel.prototype.getTitle = function () {
    return this.title;
};

IFeedModel.prototype.getItems = function () {
    return this.content;
};

IFeedModel.prototype.getItemAtIndex = function (index) {
    if (this.content !== undefined) {
        return this.content[index];
    } else {
        return undefined;
    }
};

IFeedModel.DummyContent = [{"title": "Could not load the request feed. \
    Please verify tat the url is correct and that you have network \
    connectivity."}];

/* -------------------- */
/* APP INITIALIZATION CODE STARTS HERE */

//google.load("feeds","1"); // Load Google Feeds API
//ifeedmodel = new IFeedModel("http://feeds.feedburner.com/publicoRSS");
// example url provided
// setOnLoadCallback is a static function that registers the specified
// handler function
// to be called once the page containing this call loads
//google.setOnLoadCallback(function(){
//    ifeedmodel.init(callback);
//});

