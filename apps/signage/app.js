'use strict';
window.onload = function () {
    window.app = new CanvasApp("signage");
   // window.g = new Gallery();
   // window.g.init();
    window.app.ready();
};

function Signage() {


}

Signage.ContentHandlers = {};
Signage.MediaDir = "../../media/";
Signage.ErrorImage = "resources/error.svg";

// ### Signage View ################################################

Signage.View = {};


// ### Signage ContentView Element #################################

Signage.View.IElement = function (parent, element) {
    this.src = element.getUrl();
    this.parent = parent;
    this.EvtReady = new Event();
    this.EvtError = new Event();
};

Signage.View.IElement.prototype.init = function () {
    throw new Error("Abstract Method");
};

Signage.View.IElement.prototype.onEnter = function () {
    // Do Nothing
};

Signage.View.IElement.prototype.onExit = function () {
    // Do Nothing
};

// ### Content Handlers ############################################

function IMGHandler(parent, element) {
    IMGHandler.super.constructor.call(this, parent, element);
}

IMGHandler.prototype.init = function () {
    var img = new Image(), that = this;
    img.addEventListener("load", function () {that.EvtReady.trigger(); },
        false);
    img.addEventListener("error", function () {
        that.parent.style.backgroundImage = 'url("' + Gallery.ErrorImage + '")';
        that.parent.style.backgroundSize = "30%";
        that.EvtError.trigger();
    }, false);
    img.src = this.src;
    this.parent.style.backgroundImage = 'url("' + this.src + '")';
    this.parent.style.backgroundSize = 'contain';
    this.parent.style.backgroundPosition = 'center';
    this.parent.style.backgroundRepeat = 'no-repeat';
    
};

OOP.extend(IMGHandler, Signage.View.IElement);

function VIDHandler(parent, element) {
    VIDHandler.super.constructor.call(this, parent, element);
    this.poster = element.getThumbUrl();
    this.vp = new VideoPlayer({"div": parent});
    this.EvtReady = this.vp.EvtReady;
    this.EvtError = this.vp.EvtError;

}

VIDHandler.prototype.init = function () {
    this.vp.EvtPlay.addListener(this, function () {
        window.app.interruptTimeout();
    });
    this.vp.EvtPause.addListener(this, function () {
        window.app.resumeTimeout();
    });
    this.vp.EvtEnded.addListener(this, function () {
        window.app.resumeTimeout();
    });
    this.vp.setSource(this.src, this.poster);
};

VIDHandler.prototype.onExit = function () {
    this.vp.pause();
};

OOP.extend(VIDHandler, Signage.View.IElement);

// Register handlers
Signage.ContentHandlers["img"] = IMGHandler;
Signage.ContentHandlers["vid"] = VIDHandler;
