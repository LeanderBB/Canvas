Signage
=============

This application acts as screen saver app which displays videos, images and feeds until somebody interacts with it. 
Configuration
-------------

The configuration of this application is pretty straightforward. In the "signage" section we supply a list
of files. These files are either videos or images and are identified by a type, "type", and their location
in the media folder, "url". The order of the files specified here, is the order in which they shall be displayed
while the application is running.

Feeds are displayed on the bottom of a screen, in the order they are specified in the list. The list contains 
a set of urls for each of the feeds to be displayed.

``` json
{
    "signage": [
        {
            "type": "vid",
            "url": "trailer.ogv"
        },
        {
            "type": "img",
            "url": "1.jpg"
        },
        {
            "type": "img",
            "url": "2.jpg"
        },     
        {
            "type": "img",
            "url": "3.jpg"
        }
    
    ],
    "footer":[
        "http://www.gizmodo.com/index.xml",
        "http://feeds.feedburner.com/publicoRSS"
    ]
}
```
