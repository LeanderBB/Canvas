Media Gallery
=============

This application enables the user to view certain media files. Currently it is only 
possible to view videos (depends on the HTML5 video formats supported by Firefox) and images. The gallery has been designed to be easily extendable
with content types and locations. For instance, we can easily integrate pictures from 
Flickr by developing a virtual folder, which retrieves its data from Flickr or audio files.
For more information on this please look into the app.js file.

Configuration
-------------
The gallery contains a set of virtual folders, each with a set of media files. The root
of the configuration file starts out with the "gallery" entry.
``` json
{
    "gallery":[
        ...
    ]
}
```
Inside the gallery object, we find an array of virtual folders. Each virtual folder is 
defined by:
* name - Name of the virtual folder. 
* type - Implementation keyword defined in app.js 
* thumb - Thumbnail to be used for the gallery, relative location in the media folder.
* data - Array of files to be presented. The data contained here is dependent on the type
op the virtual folder.

Typically, a virtual folder is defined as:
``` json
{
    "name": "Test Gallery 1",
    "type": "standard",
    "thumb": "nobg.jpg",
    "data": [ ... ]
}
```

For the "standard" virtual folder, each data element must have the following fields.
* url - Location of the file relative in the media folder.
* type - Type of the file. Currently the supported types are **img** and **vid**.
* thumb - Thumbnail to be used for this file. For instance, in the case of videos, the thumbnails is a poster
picture to be used while the video is loading up.

``` json
{
    "url": "somefolder/prettyimage.jpg",
    "thumb": "somefolder/prettyimage_thumb.jpg",
    "type": "img"
}
```

Example Config
---------------------
Below you can find an example configuration file for a virtual folder named "Cool stuff" with two files: an image and a video.

``` json
{
    "gallery":[
        {
            "name": "Cool stuff",
            "type": "standard",
            "thumb": "cool_stuff/thumb.jpg",
            "data": [
                {
                    "url": "cool_stuff/images/jump.png",
                    "thumb": "cool_stuff/images/jump_small.png",
                    "type": "img"
                },
                {
                    "url": "cool_stuff/video/parkour.ogv",
                    "thumb": "cool_stuff/videos/parkour_poster.jpg",
                    "type": "vid"
                }
            ]
        }
    ]
}
```


