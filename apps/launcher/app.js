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
}

Launcher.prototype.launchApp = function (app) {
    this.cur_app_ref = this.apps[app];
    if (this.cur_app_ref) {
        this.load_screen.setApplication(this.cur_app_ref);
        this.load_screen.show();
        this.app_frame.setApplication(this.cur_app_ref);
        this.startTimeout();
    } else {
        Canvas.log("Failed to open app " + app, "launcher");
    }
};

Launcher.prototype.startTimeout = function () {
    var that = this;
    this.timer = setTimeout(function () {
        that.closeApp();
    }, this.timeout_min * 60000);
};

Launcher.prototype.stopTimeout = function () {
    clearTimeout(this.timer);
    this.timer = null;
};


Launcher.prototype.closeApp = function () {
    if (this.cur_app_ref) {
        this.app_frame.hide();
        this.cur_app_ref = null;
        setTimeout(function () {
            window.l.app_frame.reset();
        }, 500);
    }
};


Launcher.prototype.handleMessage = function (message) {
    switch (message.type) {
    case Canvas.MSG_READY:
        this.load_screen.hide();
        this.app_frame.show();
        break;
    case Canvas.MSG_ERROR:
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
        if (message.data === "up") {
            this.stopTimeout();
            this.startTimeout();
        } else if (message.data === "stop") {
            this.stopTimeout();
        } else {
            this.startTimeout();
        }
        break;
    default:
        Canvas.log("Unknown type:\n"  + message, "launcher");
    }
};

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
    } else {
        // handle error
    }
};

// ### Application Object #####################################
Launcher.Application = function () {
    this.name = "";
    this.path = "";
    this.color = "";
    this.icon_path = "";
};

Launcher.Application.prototype.init = function (json) {
    this.name = json.name;
    this.path = json.path;
    this.color = json.color;
    this.icon_path = json.icon;
};

Launcher.Application.prototype.getName = function () {
    return this.name;
};

Launcher.Application.prototype.getPath = function () {
    return this.path;
};

Launcher.Application.prototype.getColor = function () {
    return this.color;
};

Launcher.Application.prototype.getIconPath = function () {
    return this.icon_path;
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
    this.reset();
};

Launcher.AppFrame.prototype.setApplication = function (application) {
    this.frame.src = Canvas.APP_PATH + application.getPath() + "/app.html";
};

Launcher.AppFrame.prototype.reset = function () {
    this.frame.src = "about:blank";
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


