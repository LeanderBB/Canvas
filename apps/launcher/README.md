Launcher
=============

The launcher application is the heart of the Canvas system. It manages the life cycle of the other applications
as well as which applications to display to the user.

Configuration
-------------

Below you can find a sample configuration for the launcher. 
``` json
{
    "apps": {

        "gallery": {
            "name": "Gallery",
            "path": "gallery",
            "icon": "icon_launcher.svg",
            "color": "RGB(190,22,34)",
            "hidden": false
},
        "reader": {
            "name": "Reader",
            "path": "feeds",
            "icon": "icon_launcher.svg",
            "color": "RGB(255,154,0)",
            "hidden": false
        },
        "menu": {
            "name": "Menu",
            "path": "menu",
            "icon": "icon_launcher.svg",
            "color": "RGB(255,229,3)",
            "hidden": false
        },
        
        "signage": {
            "name": "Signage",
            "path": "signage",
            "icon": "icon_launcher.svg",
            "color": "#390458",
            "hidden": true
        }
    },

    "timeout" : 5,   
    "timeout-action": "signage",
    "launch_timeout": 2 
}
```

Each application is declared in the section "apps" in 
the form of "key -> value". Each value contains the following properties:
* name - Name of the application displayed to the user.
* path - Name of the folder containing the application data.
* icon - Icon for the application.
* color - Color to be applied to the progress bar when the application is loading.
* hidden - Set this property to true if you wish the application to be inaccessible to the user.

Afterwards there are three properties which need to defined:
* timeout - The number of minutes the application should go without any interaction before launching the application defined in "timeout-action". 
* timeout-action - The application to be launched when a timeout occurs. The value should be one of the keys specified in the "apps" section.
* launch_timeout - The number of minutes the Launcher should wait before killing an application that is loading. This is useful for cases
when an unexpected errors occur while loading the application. 
