Canvas - Interactive Digital Signage
====================================

Collaborators
-------------
* José Durães
* Tiago Oliveira - https://github.com/tfaoliveira


About
-----
This project started out with the objective of creating an interactive digital signage system for 
touch enabled displays and management performed through a web based backend. Due to some complications 
and different interests of the parties involved in the project, we had to stop its development. 

The application consists of a 
simple digital signage system which will activate on timeout and a set of simple Apps which allow a 
user to browse media, reed feeds and check the menu of the canteen at the University of Minho. Overall, 
the application could be qualified as a beta version, since there are some minor quirks left to solve.


Canvas Overview
-------------------
The canvas environment by itself is nothing more than Xulrunner displaying an HTML page. Therefore, we introduced
the concept of applications. Each application is a self contained HTML page which introduces a given feature to the system. Each
application must follow the established conventions, detailed further ahead, in order to integrate with the system.

In order to enable the execution of various applications, we developed a special application called _Launcher_. This application is in charge
of displaying the list of available applications as well as managing their lifecycle. Furthermore, it is also able of 
launching an application to act as a screensaver.

Folder Conventions
-------------------

Canvas abides by the following folder layout:
* apps - All applications are contained in this folder.
* config - All application configurations are contained within this folder under the same name as the folder contained
in the "apps" folder. See each application for more details.
* core - Set of core files used by the canvas environment.
* defaults - Xulrunner / Firefox extension configuration files.
* ext - External JS libraries and files used with the project.
* extension - Files to create a Firefox extension. This is available due to the fact that debugging HTML in Xulrunner is no
easy task. To help with the development we used Firefox and its built-in debugging tools to accomplish this. For safety concerns,
do not use this extension actively if you use Firefox as your default browser. 
* gfx - Images and designs for Canvas and its applications.
* media - All media resources should be placed in this folder and can be organised as the user sees fit. Applications will search
this folder for the required media resources.
* tests - Contains some user interface elements test samples.
* tools - Contains development tools (e.g.: code checking).

The reason for the fragmentation between media, applications and configuration is due to the future possibility of packaging
each app as jar/zip folder. These could later be signed in order to assure the authenticity of an application. Since the 
configuration files and media are usually supplied externally, we decided it would be better to separate these elements from 
each application.

Application Conventions
-----------------------

This section details the basic conventions each application should abide by. To successfully integrate with the _Launcher_
application, each application must have an html page named "app.html" which creates an instance of the _CanvasApp_ object. To do so, we must first import the
canvas javascript module (Firefox only feature) and the "canvas_app.js" file.
``` html
<html>
  <head>
    <script> 
      Components.utils.import("resource://canvas_module/canvas.jsm");
    </script>
    <script src="../../core/canvas_app.js"></script>
  </head>
  ...
</html>
```
In one of your javascript files we must create a new instance of the _CanvasApp_ object. This object's
constructor require one parameter: the name of the application's folder. This is later used to retrieve the
configuration file. The code below shows how the object is created for the _Gallery_ application.
``` javascript
window.app = new CanvasApp("gallery");
// when the application has loaded all it's data
app.ready();
...
// when an interaction occurs that closes the application
app.exit();
```
As you can see above, we also present two methods, which indicate that the app is ready to be displayed and ready to be closed.
These methods communicate with the _Launcher_ application and notify it accordingly. The _CanvasApp_ object also 
subscribes to some events in order to track unexpected errors. This will enable the _Launcher_ to close the application
without leaving the entire system inoperable.

Finally to access the application's configuration, use the methods below. First, attempt to load the configuration. Next,
access the loaded configuration. If the configuration fails to load, the first method whill return false. The configuration
object returned byt the "getConfig()" method is a parsed JSON object.
``` javascript
if(app.loadConfig()) {
    var config = app.getConfig();
    // do something with the config
}
```


Starting Canvas
-------------------------------
To run the application, you need to configure the application's location in the file "chrome.manifest" and
update the line "content canvas file://C://canvas/" to match the current directory where all the files 
reside.

To launch the application, make sure you have the latest version of Firefox installed, and from a command line
or terminal execute the command "firefox -app [location to the canvas folder]/application.ini". For instance, 
if the canvas folder is located in "C:\\canvas" (windows), the command should be 
"[location to firefox]\\firefox.exe -app c:\\canvas\\application.ini".


This project started out with the objective of creating an interactive digital signage system for 
touch enabled displays and management performed through a web based backend. Due to some complications 
and different interests of the parties involved in the project, we had to stop its development. 

The application consists of a 
simple digital signage system which will activate on timeout and a set of simple Apps which allow a 
user to browse media, reed feeds and check the menu of the canteen at the University of Minho. Overall, 
the application could be qualified as a beta version, since there are some minor quirks left to solve.


Canvas Overview
-------------------
The canvas environment by itself is nothing more than Xulrunner displaying an HTML page. Therefore, we introduced
the concept of applications. Each application is a self contained HTML page which introduces a given feature to the system. Each
application must follow the established conventions, detailed further ahead, in order to integrate with the system.

In order to enable the execution of various applications, we developed a special application called _Launcher_. This application is in charge
of displaying the list of available applications as well as managing their lifecycle. Furthermore, it is also able of 
launching an application to act as a screensaver.

Folder Conventions
-------------------

Canvas abides by the following folder layout:
* apps - All applications are contained in this folder.
* config - All application configurations are contained within this folder under the same name as the folder contained
in the "apps" folder. See each application for more details.
* core - Set of core files used by the canvas environment.
* defaults - Xulrunner / Firefox extension configuration files.
* ext - External JS libraries and files used with the project.
* extension - Files to create a Firefox extension. This is available due to the fact that debugging HTML in Xulrunner is no
easy task. To help with the development we used Firefox and its built-in debugging tools to accomplish this. For safety concerns,
do not use this extension actively if you use Firefox as your default browser. 
* gfx - Images and designs for Canvas and its applications.
* media - All media resources should be placed in this folder and can be organised as the user sees fit. Applications will search
this folder for the required media resources.
* tests - Contains some user interface elements test samples.
* tools - Contains development tools (e.g.: code checking).

The reason for the fragmentation between media, applications and configuration is due to the future possibility of packaging
each app as jar/zip folder. These could later be signed in order to assure the authenticity of an application. Since the 
configuration files and media are usually supplied externally, we decided it would be better to separate these elements from 
each application.

Application Conventions
-----------------------

This section details the basic conventions each application should abide by. To successfully integrate with the _Launcher_
application, each application must have an html page named "app.html" which creates an instance of the _CanvasApp_ object. To do so, we must first import the
canvas javascript module (Firefox only feature) and the "canvas_app.js" file.
``` html
<html>
  <head>
    <script> 
      Components.utils.import("resource://canvas_module/canvas.jsm");
    </script>
    <script src="../../core/canvas_app.js"></script>
  </head>
  ...
</html>
```
In one of your javascript files we must create a new instance of the _CanvasApp_ object. This object's
constructor require one parameter: the name of the application's folder. This is later used to retrieve the
configuration file. The code below shows how the object is created for the _Gallery_ application.
``` javascript
window.app = new CanvasApp("gallery");
// when the application has loaded all it's data
app.ready();
...
// when an interaction occurs that closes the application
app.exit();
```
As you can see above, we also present two methods, which indicate that the app is ready to be displayed and ready to be closed.
These methods communicate with the _Launcher_ application and notify it accordingly. The _CanvasApp_ object also 
subscribes to some events in order to track unexpected errors. This will enable the _Launcher_ to close the application
without leaving the entire system inoperable.

Finally to access the application's configuration, use the methods below. First, attempt to load the configuration. Next,
access the loaded configuration. If the configuration fails to load, the first method whill return false. The configuration
object returned byt the "getConfig()" method is a parsed JSON object.
``` javascript
if(app.loadConfig()) {
    var config = app.getConfig();
    // do something with the config
}
```


Starting Canvas
-------------------------------
To run the application, you need to configure the application's location in the file "chrome.manifest" and
update the line "content canvas file://C://canvas/" to match the current directory where all the files 
reside.

To launch the application, make sure you have the latest version of Firefox installed, and from a command line
or terminal execute the command "firefox -app [location to the canvas folder]/application.ini". For instance, 
if the canvas folder is located in "C:\\canvas" (windows), the command should be 
"[location to firefox]\\firefox.exe -app c:\\canvas\\application.ini".

