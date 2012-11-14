Canvas - Interactive Digital Signage
====================================

Collaborators
-------------
* José Durães
* Tiago Oliveira - https://github.com/tfaoliveira


About
-----
This project started out with the objective of creating an interactive digital signage system for 
touch enabled displays and managment performed through a web based backend. Due to some complications 
and different interests of the parties involved in the project, we had to stop its development. 

The state of the application contained in this repository is as follows: The application contains a 
simple digital signage system which will activate on timeout and a set of simple Apps which allow a 
user to browse media, reed feeds and check the menu of the canteen (University of Minho). Overall, 
the application could be qualified as a beta version, since there are some minor quirks left to solve.



Starting Canvas
-------------------------------
To run the application, you need to configure the application's location in the file "chrome.manifest" and
update the line "content canvas file://C://canvas/" to match the current directory where all the files 
reside.

To launch the application, make sure you have the latest version of Firefox installed, and from a command line
or terminal excute the command "firefox -app [location to the canvas folder]/application.ini".

Configuring Canvas
-------------------
Detailed instruction will be added as soon as possible. In the mean time, you can look at the config folder to
get some idea of what is required.