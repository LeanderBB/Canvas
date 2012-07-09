"use strict";
var EXPORTED_SYMBOLS = ["Canvas"];

/* Chrome definitions, not to be exported. */
var CHROME_HOME_PATH = "chrome://canvas/content/";
var CHROME_CONFIG_PATH = "chrome://canvas/content/configs/";
var CHROME_APP_PATH = "chrome://canvas/content/apps/";
var CHROME_CORE_PATH = "chrome://canvas/content/core/";
var CHROME_MEDIA_PATH = "chrome://canvas/content/media/";

var Canvas = {};

// Mode enums
Canvas.MODE_RELEASE = 0x01;
Canvas.MODE_DEVELOPMENT = 0x02;

// Figure out where we are running, as an extension or in
// Xulrunner
var prefs = Components.classes["@mozilla.org/preferences-service;1"]
.getService(Components.interfaces.nsIPrefService);
var canvas_prefs = prefs.getBranch("com.3code.canvas.");


var is_development = canvas_prefs.getBoolPref("developmentMode");
Canvas.Mode = (!is_development) ? Canvas.MODE_RELEASE :
    Canvas.MODE_DEVELOPMENT;

/* Canvas default paths */
Canvas.HOME_PATH = (Canvas.Mode === Canvas.MODE_RELEASE) ?
    CHROME_HOME_PATH : "../";
Canvas.CONFIG_PATH = (Canvas.Mode === Canvas.MODE_RELEASE) ?
    CHROME_CONFIG_PATH : Canvas.HOME_PATH + "../configs/";
Canvas.MEDIA_PATH = (Canvas.Mode === Canvas.MODE_RELEASE) ?
    CHROME_MEDIA_PATH: Canvas.HomePath + "../media/";
Canvas.APP_PATH = (Canvas.Mode === Canvas.MODE_RELEASE) ?
    CHROME_APP_PATH : "../apps/";
Canvas.CORE_PATH = (Canvas.Mode === Canvas.MODE_RELEASE) ?
    CHROME_CORE_PATH : "../../core/";
/**
 * Log method. Automatically adjustes to the current mode. In release mode
 * prints to stdout and in development mode to the js console.
 */
Canvas.log = function (message, origin) {
    var header = origin || "LOG";
    if (Canvas.Mode === Canvas.MODE_RELEASE) {
        dump("[" + header + "] " + message + "\n");
    } else {
        console.log("[" + header + "] " + message);
    }
};

/**
 * Restart the Canvas
 */
Canvas.restart = function () {
    var components = Components.classes["@mozilla.org/toolkit/app-startup;1"],
        boot;
    boot = components.getService(Components.interfaces.nsIAppStartup);
    boot.quit(Components.interfaces.nsIAppStartup.eForceQuit |
        Components.interfaces.nsIAppStartup.eRestart);
};


// Canvas status messages
Canvas.MSG_ERROR = 0x0000;
Canvas.MSG_READY = 0x0001;
Canvas.MSG_EXIT = 0x0002;
Canvas.MSG_INTERACTION = 0x0004;

Canvas.Message = function (type, origin, data) {
    this.type = type;
    this.origin = origin;
    this.data = data || {};
};

Canvas.Message.getType = function () {
    return this.type;
};

Canvas.Message.getOrigin = function () {
    return this.origin;
};

Canvas.Message.getData = function () {
    return this.data;
};
