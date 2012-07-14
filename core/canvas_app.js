"use strict";

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
    Canvas App Class
    @param folder_name Folder name where the app resides. Necessary to
    build the directory index.
    @param messages_enabled [optional] wether or not to enable
    certain messages to the parent frame.
*/
function CanvasApp(folder_name, messages_enabled) {
    this.name = folder_name;
    this.path = Canvas.APP_PATH + this.name + "/";
    this.config_path = Canvas.CONFIG_PATH + this.name + "/config.js";
    this.media_path = Canvas.MEDIA_PATH;
    this.config = undefined;
    this.report_action = true;
    // register events and trigger events
    var that = this;
    // Handle any uncaught errors.
    if ( messages_enabled === undefined ||
        (messages_enabled !== undefined && messages_enabled === true)) {
        window.onerror = function (msg, url, linenum) {
                that.criticalErrorEvt(msg, url, linenum);
                return true;
            };
        window.addEventListener("mousedown", function (e) {
            if (that.report_action) {
                window.parent.postMessage(new Canvas.Message(
                    Canvas.MSG_INTERACTION,
                    folder_name,
                    {"status": "up"}), "*");
            }
        }, false);
    }
}

/**
    Load the configuration file.
    @return false if the config could not be loaded.
*/
CanvasApp.prototype.loadConfig = function () {
    function urlToPath(aPath) {
        if (!aPath || !/^file:/.test(aPath)) {
            return;
        }
        var rv, ph = Components.classes[
            "@mozilla.org/network/protocol;1?name=file"]
            .createInstance(Components.interfaces.nsIFileProtocolHandler);
        rv = ph.getFileFromURLSpec(aPath).path;
        return rv;
    }

    function chromeToPath(aPath) {
        if (!aPath || !(/^chrome:/.test(aPath))) {
            return; //not a chrome url
        }
        var rv, ios, uri, cr;
   
        ios = Components.classes['@mozilla.org/network/io-service;1']
            .getService(Components.interfaces["nsIIOService"]);
        uri = ios.newURI(aPath, "UTF-8", null);
        cr = Components.classes['@mozilla.org/chrome/chrome-registry;1']
            .getService(Components.interfaces["nsIChromeRegistry"]);
        rv = cr.convertChromeURL(uri).spec;

        if (/^file:/.test(rv)) {
            rv = urlToPath(rv);
        } else {
            rv = urlToPath("file://" + rv);
        }
        return rv;
    }
    var file, output, fstream, sstream, path = chromeToPath(this.config_path);
    file = Components.classes["@mozilla.org/file/local;1"]
               .createInstance(Components.interfaces.nsILocalFile);
    fstream = Components.classes[
        "@mozilla.org/network/file-input-stream;1"]
        .createInstance(Components.interfaces.nsIFileInputStream);
    sstream = Components.classes[
        "@mozilla.org/scriptableinputstream;1"]
        .createInstance(Components.interfaces.nsIScriptableInputStream);
    file.initWithPath(path);
    if (file.exists() === false) {
        this.criticalError("Could not load config file.", this.name);
        return false;
    }
    fstream.init(file, 0x01, 0x00004, null);
    sstream.init(fstream);
    output = sstream.read(sstream.available());
    sstream.close();
    fstream.close();
    try {
        this.config = JSON.parse(output);
    } catch (err) {
        this.criticalError(err.message);
        return false;
    }
    return true;
};

/**
    Get the configuration data.
    @return JSON object.
*/
CanvasApp.prototype.getConfig = function () {
    return this.config;
};

/**
    Will report the launcher that this application is ready to be used.
*/
CanvasApp.prototype.ready = function () {
    var msg = new Canvas.Message(Canvas.MSG_READY,
        this.name,
        {});
    window.parent.postMessage(msg, "*");
};
/**
    Will report the laucnher that this application is about to exit.
*/
CanvasApp.prototype.exit = function () {
    var msg = new Canvas.Message(Canvas.MSG_EXIT,
        this.name,
        {});
    window.parent.postMessage(msg, "*");
};
/**
    Will report the launcher that an error happend and the application needs
    to be closed.
*/
CanvasApp.prototype.criticalError = function (msg) {
    var resp, message = "Fatal Error: " + msg;
    Canvas.log(message, this.name);
    resp = new Canvas.Message(Canvas.MSG_ERROR,
        this.name,
        { "msg": message});
    window.parent.postMessage(resp, "*");
};

CanvasApp.prototype.criticalErrorEvt = function (msg, url, linenum) {
    var resp, message = "Fatal Error: " + msg + "\nUrl: " + url +
        "\nLine: " + linenum;
    Canvas.log(message, this.name);
    resp = new Canvas.Message(Canvas.MSG_ERROR,
        this.name,
        { "msg": message});
    window.parent.postMessage(resp, "*");
};

/**
    Disable the timeout function from the launcher. Usefull for videos
    with lengths greater than the timeout.
*/
CanvasApp.prototype.interruptTimeout = function () {
    this.report_action = false;
    var msg = new Canvas.Message(Canvas.MSG_INTERACTION,
        this.name,
        {"status": "stop"});
    window.parent.postMessage(msg, "*");
};
/**
    Restart the timeout function from the launcher.
*/
CanvasApp.prototype.resumeTimeout = function () {
    this.report_action = true;
    var msg = new Canvas.Message(Canvas.MSG_INTERACTION,
        this.name,
        {"status": "start"});
    window.parent.postMessage(msg, "*");
};

/**
    Get the application's path.
*/
CanvasApp.prototype.getApplicationPath = function () {
    return this.path;
};
/**
    Get the application's config path
*/
CanvasApp.prototype.getApplicationConfigPath = function () {
    return this.config_path;
};
/**
    Get the media directory path.
*/
CanvasApp.prototype.getMediaPath = function () {
    return this.media_path;
};

/**
    Dynamically load a JS or CSS file.
*/
CanvasApp.loadResource = function (canvas_path,
        core_resource, type) {
    switch (type) {
    case CanvasApp.RT_JS:
        CanvasApp._load_js(canvas_path + core_resource);
        break;
    case CanvasApp.RT_CSS:
        CanvasApp._load_css(canvas_path + core_resource);
        break;
    default:
        Canvas.log("Unkown resource type requested to be \
                loaded: '" + core_resource + "'", this.name);
        break;
    }
};
// [INTERNAL] load JS file
CanvasApp._load_js = function (source) {
    var script = window.document.createElement("script");
    script.setAttribute("type", "text/javascript");
    script.setAttribute("src", source);
    window.document.getElementsByTagName("head")[0].appendChild(script);
};

// [INTERNAL] load CSS file
CanvasApp._load_css = function (source) {
    var css = window.document.createElement("link");
    css.setAttribute("type", "text/css");
    css.setAttribute("rel", "stylesheet");
    css.setAttribute("href", source);
    window.doc.getElementsByTagName("head")[0].appendChild(css);
};

CanvasApp.RT_JS = 0x01;
CanvasApp.RT_CSS = 0x02;

