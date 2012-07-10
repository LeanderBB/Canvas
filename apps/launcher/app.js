window.onload = function () {
    // Fix aspect ratio 
    var body = document.getElementsByTagName('body')[0];
    var height = heightForWidth16By9(body.offsetWidth);
    var margin = ((body.offsetHeight - height) * 0.5);
    if( margin > 0) {
        body.style.marginTop=margin+"px";
        body.style.height="-moz-calc(100% - "+(2 * margin)+"px)";
    }
    window.app = new CanvasApp("launcher",false);
    window.l = new Launcher();
    window.l.init();
}


function Launcher() {
    this.frame = document.getElementById("app_frame");
    this.apps = {}
    this.cur_app_ref = null;
    this.timeout_min = 5;
    this.timer = null;
    // handle messages from the frame
    window.addEventListener("message",function(e){
        window.l.handleMessage(e.data);
            },false);

}

Launcher.prototype.handleMessage = function (message) {
    switch (message.type) {
    case Canvas.MSG_READY:
        // show frame
        break;
    case Canvas.MSG_ERROR:
        // hide frame
        // display erro notification
        break;
    case Canvas.MSG_EXIT:
        // hide frame
        break;
    case Canvas.MSG_INTERACTION:
        if (message.data === "up") {
            // reset timer
        } else if (message.data === "stop") {
            // stop timer
        } else {
            // start timer again
        }
        break;
    default: 
        Canvas.log("Unknown message:\n"  + message, "launcher");
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
}

// ### Application Object #####################################
Launcher.Application = function() {
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
