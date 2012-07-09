"use strict";

function CanvasApp(folder_name) {
    this.name = folder_name;
    this.path = Canvas.APP_PATH + name + "/";
    this.config_path = Canvas.CONFIG_PATH + name + "/config.js";
    this.media_path = Canvas.MEDIA_PATH;
    this.config = undefined;
    // register events and trigger events
    var that = this;
    // Handle any uncaught errors.
    window.addEventListener("error", function (e) {
            that.criticalError(e.message);
        }, false);
    window.addEventListener("mousedown", function (e) {
        window.parent.postMessage(new Canvas.Message(
            Canvas.MSG_INTERACTION,
            folder_name,
            {}), "*");
    }, false);
}


CanvasApp.prototype.loadConfig = function () {
    //TODO: Error check!!!
    //xhr request to config file
    // JSON.Parse()
    // invoke callback
    Canvas.log(this._config_path, this.name);
    var request = new XMLHttpRequest();
    request.open('GET', this._config_path, false);
    request.send();
    this.config = JSON.parse(request.responseText);
};

CanvasApp.prototype.getConfig = function () {
    return this.config;
};


CanvasApp.prototype.ready = function () {
    var msg = new Canvas.Message(Canvas.MSG_READY,
        this.name,
        {});
    window.parent.postMessage(msg, "*");
};

CanvasApp.prototype.exit = function () {
    var msg = new Canvas.Message(Canvas.MSG_EXIT,
        this.name,
        {});
    window.parent.postMessage(msg, "*");
};

CanvasApp.prototype.criticalError = function (message) {
    Canvas.log("Fatal Error: " + message, this.name);
    var msg = new Canvas.Message(Canvas.MSG_ERROR,
        this.name,
        { "msg": message});
    window.parent.postMessage(msg, "*");
};

CanvasApp.prototype.getApplicationPath = function () {
    return this.path;
};

CanvasApp.prototype.getApplicationConfigPath = function () {
    return this.config_path;
};

CanvasApp.prototype.getMediaPath = function () {
    return this.media_path;
};


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

CanvasApp._load_js = function (source) {
    var script = window.document.createElement("script");
    script.setAttribute("type", "text/javascript");
    script.setAttribute("src", source);
    window.document.getElementsByTagName("head")[0].appendChild(script);
};

CanvasApp._load_css = function (source) {
    var css = window.document.createElement("link");
    css.setAttribute("type", "text/css");
    css.setAttribute("rel", "stylesheet");
    css.setAttribute("href", source);
    window.doc.getElementsByTagName("head")[0].appendChild(css);
};

CanvasApp.RT_JS = 0x01;
CanvasApp.RT_CSS = 0x02;

