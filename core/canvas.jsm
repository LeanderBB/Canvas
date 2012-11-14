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

"use strict";
var EXPORTED_SYMBOLS = ["Canvas"];

/* Chrome definitions, not to be exported. */
var CHROME_HOME_PATH = "chrome://canvas/content/";
var CHROME_CONFIG_PATH = "chrome://canvas/content/config/";
var CHROME_APP_PATH = "chrome://canvas/content/apps/";
var CHROME_CORE_PATH = "chrome://canvas/content/core/";
var CHROME_MEDIA_PATH = "chrome://canvas/content/media/";
var CHROME_EXT_PATH = "chrome://canvas/content/ext/"

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
//Canvas.CONFIG_PATH = (Canvas.Mode === Canvas.MODE_RELEASE) ?
//    CHROME_CONFIG_PATH : Canvas.HOME_PATH + "../config/";
Canvas.CONFIG_PATH = CHROME_CONFIG_PATH;
Canvas.MEDIA_PATH = (Canvas.Mode === Canvas.MODE_RELEASE) ?
    CHROME_MEDIA_PATH: Canvas.HOME_PATH + "../media/";
//Canvas.APP_PATH = (Canvas.Mode === Canvas.MODE_RELEASE) ?
//    CHROME_APP_PATH : "../apps/";
Canvas.APP_PATH = CHROME_APP_PATH;
Canvas.CORE_PATH = (Canvas.Mode === Canvas.MODE_RELEASE) ?
    CHROME_CORE_PATH : "../../core/";
Canvas.EXT_PATH = (Canvas.Mode === Canvas.MODE_RELEASE) ?
    CHROME_EXT_PATH : "../../ext/";

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
Canvas.MSG_ERROR = 0x0008;
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
