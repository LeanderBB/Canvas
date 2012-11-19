Feed Reader
=============

This application enables the user to read RSS feeds.

Configuration
-------------
The configuration for this application is pretty straight forward. The entry "feeds" has 
a list of feed objects which are made out of a "title" (name used to present the feed to the user) 
and an "url" (location on the internet). Each feed has third parameter, "content", which should
be left empty, as seen below.
``` json
{
    "feeds": [
        {
            "title": "Bitaites",
            "url": "http://feeds.feedburner.com/bitaites/blog",
            "content": ""
        },
        {
            "title": "Guardian",
            "url": "http://feeds.guardian.co.uk/theguardian/world/rss",
            "content": ""
        },
        {
            "title": "Público",
            "url": "http://feeds.feedburner.com/publicoRSS",
            "content": ""
        },
        {
            "title": "Dueling Analogs",
            "url": "http://feeds.feedburner.com/DuelingAnalogs",
            "content": ""
        }
    ]
}
```


