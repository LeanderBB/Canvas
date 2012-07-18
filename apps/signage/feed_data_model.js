'use strict';

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
    this.content = undefined;
    this.title = "No Title";
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
            that.title = result.feed.title;
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
    if (this.content!==undefined){
        return this.content[index]; }
    else return undefined;
};


/* -------------------- */
/* APP INITIALIZATION CODE STARTS HERE */

//google.load("feeds","1"); // Load Google Feeds API
//ifeedmodel = new IFeedModel("http://feeds.feedburner.com/publicoRSS"); // example url provided
// setOnLoadCallback is a static function that registers the specified handler function
// to be called once the page containing this call loads
//google.setOnLoadCallback(function(){
//    ifeedmodel.init(callback);
//});

