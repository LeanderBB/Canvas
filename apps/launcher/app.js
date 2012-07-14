"use strict";
window.onload = function () {
    // Fix aspect ratio
    var body = document.getElementsByTagName('body')[0],
    height = heightForWidth16By9(body.offsetWidth),
    margin = ((body.offsetHeight - height) * 0.5);
    if (margin > 0) {
        Canvas.log("Adjusting Height", "launcher");
        body.style.marginTop = margin + "px";
        body.style.height = "-moz-calc(100% - " + (2 * margin) + "px)";
    }
    window.app = new CanvasApp("launcher", false);
    window.l = new Launcher();
    window.l.init();
};


function Launcher() {
    
    this.app_frame = new Launcher.AppFrame();
    this.load_screen = new Launcher.LoadScreen();
    this.apps = {};
    this.cur_app_ref = null;
    this.timeout_min = 5;
    this.timer = null;
    // handle messages from the frame
    window.addEventListener("message", function (e) {
        window.l.handleMessage(e.data);
    }, false);
    this.app_frame.hide();
    this.load_screen.hide();
    this.view = new Launcher.View(this);
    this.timed_out = false;
}

Launcher.prototype.init = function () {
    if (window.app.loadConfig()) {
        var config = window.app.getConfig(), app_entry, app;
        for (app in config.apps) {
            app_entry = new Launcher.Application();
            app_entry.init(config.apps[app]);
            this.apps[app] = app_entry;
        }

        if (config.timeout !== undefined) {
            this.timeout_min = config.timeout;
        }
        this.timeout_action = config["timeout-action"] || "nothing";
        if (config["launch_timeout"] !== undefined) {
            this.app_frame.setTimeoutSeconds(config["launch_timeout"]);
        }
        this.view.init();
    } else {
        // handle error
    }

    window.addEventListener("mouseup", function (e) {
        window.parent.postMessage(new Canvas.Message(
                    Canvas.MSG_INTERACTION,
                    "launcher",
                    {"status": "up"}), "*");
   }, false);
};

Launcher.prototype.launchApp = function (app) {
    this.cur_app_ref = this.apps[app];
    if (this.cur_app_ref) {
        this.load_screen.setApplication(this.cur_app_ref);
        this.load_screen.show();
        this.app_frame.setApplication(this.cur_app_ref);
        this.restartTimeout();
    } else {
        Canvas.log("Failed to open app " + app, "launcher");
    }
};

Launcher.prototype.restartTimeout = function () {
    Canvas.log("RESTART","TIMEOUT");
    clearTimeout(this.timer);
    var that = this;
    this.timer = setTimeout(function () {
        that.onTimeout();
    }, this.timeout_min * 60000);
};

Launcher.prototype.stopTimeout = function () {
    Canvas.log("STOP","TIMEOUT");
    clearTimeout(this.timer);
    this.timer = null;
};

Launcher.prototype.onTimeout = function () {
    Canvas.log("Application timed out","launcher");
    this.timed_out = true;
    if (this.app_frame.isVisible()) {
        this.closeApp();
    } else {
        this.handleTimeout();
    }
};

Launcher.prototype.handleTimeout = function () {
    if (this.timed_out && this.timeout_action !== "nothing") {
        this.launchApp(this.timeout_action);
    }
    this.timed_out = false;
};

Launcher.prototype.closeApp = function () {
    function on_close_trigger (e) {
        window.l.app_frame.reset();
        e.target.removeEventListener("transitionend", on_close_trigger, false);
        window.l.handleTimeout();
    }
    if (this.cur_app_ref) {
        this.app_frame.hide();
        this.load_screen.hide();
        this.cur_app_ref = null;    
        this.app_frame.getFrame().addEventListener("transitionend",
            on_close_trigger, false);
    }
};


Launcher.prototype.handleMessage = function (message) {
    switch (message.type) {
    case Canvas.MSG_READY:
        this.load_screen.hide();
        this.app_frame.show();
        break;
    case Canvas.MSG_ERROR:
        Canvas.log(message.data.msg,"ERROR");
        this.closeApp();
        this.load_screen.hide();
        this.cur_app_ref = null;
        // display erro notification
        break;
    case Canvas.MSG_EXIT:
        this.closeApp();
        this.cur_app_ref = null;
        break;
    case Canvas.MSG_INTERACTION:
        if (message.data.status === "up") {
            this.restartTimeout();
        } else if (message.data.status === "stop") {
            this.stopTimeout();
        } else {
            this.restartTimeout();
        }
        break;
    default:
        Canvas.log("Unknown type:\n"  + message, "launcher");
    }
};


Launcher.prototype.getApplications = function () {
    return this.apps;
};
// ### Application Object #####################################
Launcher.Application = function () {
    this.name = "";
    this.path = "";
    this.color = "";
    this.icon_path = "";
    this.hidden = true;
};

Launcher.Application.prototype.init = function (json) {
    this.name = json.name;
    this.path = json.path;
    this.color = json.color;
    this.icon_path = json.icon;
    if (json.hidden !== undefined) {
        this.hidden = json.hidden;
    }
};

Launcher.Application.prototype.getName = function () {
    return this.name;
};

Launcher.Application.prototype.getPath = function () {
    return Canvas.APP_PATH + this.path + "/app.html";
};

Launcher.Application.prototype.getColor = function () {
    return this.color;
};

Launcher.Application.prototype.getIconPath = function () {
    return Canvas.APP_PATH + this.path + "/" + this.icon_path;
};

Launcher.Application.prototype.isHidden = function () {
    return this.hidden;
};

// ### Loading Screen #########################################
Launcher.LoadScreen = function () {
    this.div = document.getElementById("load_screen");
    this.app_icon = document.getElementById("app_image");
    this.loader = document.getElementById("loader_bar");
};

Launcher.LoadScreen.prototype.setApplication = function (application) {
    this.loader.style.backgroundColor = application.getColor();
    this.app_icon.style.backgroundImage = "url('" +
        application.getIconPath() + "')";
};

Launcher.LoadScreen.prototype.show = function () {
    this.div.style.MozTransition = "opacity 0.5s linear, \
    visibility 0s linear 0s";
    this.div.style.opacity = 1;
    this.div.style.visibility = "visible";
};

Launcher.LoadScreen.prototype.hide = function () {
    this.div.style.MozTransition = "opacity 0.5s linear, \
    visibility 0s linear 0.5s";
    this.div.style.opacity = 0;
    this.div.style.visibility = "hidden";
};

// ### Application Frame ######################################
Launcher.AppFrame = function () {
    this.frame = document.getElementById("app_frame");
    this.timer = null;
    var that = this;
    this.timeout_sec = 30;
    this.time_func = function () {
        Canvas.log("TIMER " + that.isVisible(), "APPFRAME");
        if (that.isVisible() === false) {
            window.postMessage(new Canvas.Message(Canvas.MSG_ERROR,
                "AppFrame",
                {"msg": "Timeout - Failed to open the application."}),"*");
        }
    }
    this.reset();
};

Launcher.AppFrame.prototype.startTimeout = function () {
    clearTimeout(this.timer);
    this.timer = setTimeout(this.time_func, this.timeout_sec * 1000);
};

Launcher.AppFrame.prototype.setTimeoutSeconds = function (sec) {
    this.timeout_sec = sec;
};

Launcher.AppFrame.prototype.getFrame = function () {
    return this.frame;
};

Launcher.AppFrame.prototype.isVisible = function () {
    return this.frame.style.visibility === "visible";
};

Launcher.AppFrame.prototype.setApplication = function (application) {
    this.frame.src = application.getPath();
    // Does not work for some reason!!
    //this.startTimeout();
};

Launcher.AppFrame.prototype.reset = function () {
    this.frame.src = "about:blank";
    clearTimeout(this.timer);
};

Launcher.AppFrame.prototype.show = function () {
    this.frame.style.MozTransition = "opacity 0.5s linear, \
    visibility 0s linear 0s";
    this.frame.style.opacity = 1;
    this.frame.style.visibility = "visible";
};

Launcher.AppFrame.prototype.hide = function () {
    this.frame.style.MozTransition = "opacity 0.5s linear, \
    visibility 0s linear 0.5s";
    this.frame.style.opacity = 0;
    this.frame.style.visibility = "hidden";
};


// ### Application View ######################################
Launcher.View = function (controller) {
    this.controller = controller;
    this.list = document.getElementById("app_list");
};

Launcher.View.prototype.init = function () {
    var cur_app, app, applications = this.controller.getApplications();
    for (app in applications) {
        cur_app = applications[app];
        if (!cur_app.isHidden()) {
            this.list.appendChild(this._newElement(app, cur_app));
        }
    }
};

Launcher.View.prototype._newElement = function (key, app) {
    var div = document.createElement("div"),
    li = document.createElement("li"),
    that = this;
    div.style.backgroundImage = "url('" + app.getIconPath() + "')";
    li.appendChild(div);
    li.innerHTML += app.getName();

    li.addEventListener("mousedown", function () {
        this.style.color = app.getColor();
    }, false);

    li.addEventListener("mouseup", function () {
        this.style.color = "inherit";
        that.controller.launchApp(key);
    }, false);
    return li;
};
