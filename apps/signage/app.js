'use strict';
window.onload = function () {
     window.app = new CanvasApp("signage");
     window.s = new Signage();
     window.s.init();
     window.app.ready();
     window.app.interruptTimeout();
     window.onmousedown = function () {
        window.app.resumeTimeout();
        window.app.exit();
     }
};

function Signage() {
    window.app.loadConfig();

    this.footer_model = new Signage.Model.Footer();
    this.footer_model.init();
    this.footer_view = new Signage.View.Footer(this);
}

Signage.prototype.init = function () {
    this.footer_model.loadNextFeed();
}

Signage.ContentHandlers = {};
Signage.MediaDir = "../../media/";
Signage.ErrorImage = "resources/error.svg";


// ### Signage Model ##############################################

Signage.Model = {}

Signage.Model.Footer = function () {
    this.current_data = null;
    this.feed_list = [];
    this.current_feed_index = 0;
    this.EvtFeedLoaded = new Event();
};

Signage.Model.Footer.prototype.init = function() {
    var config =  window.app.getConfig();
    this.feed_list = config.footer;
    this.current_feed_index = 0;
}

Signage.Model.Footer.prototype.loadNextFeed = function() {
    this.current_data = new IFeedModel(
        this.feed_list[this.current_feed_index]);
    this.current_feed_index = (this.current_feed_index + 1) % 
        this.feed_list.length;
    var that = this;
    this.current_data.init(function () {
        that.EvtFeedLoaded.trigger();
    });
}

Signage.Model.Footer.prototype.getData = function () {
    return this.current_data;
}


// ### Signage View ################################################

Signage.View = {};



// ### Signage Footer View #########################################

Signage.View.Footer = function(controller) {
    this.controller = controller;
    this.feed_list = document.getElementById("feed_titles");
    this.feed_group = document.getElementById("feed_name");
    this.loader = document.getElementById("footer_loading");
    var that = this;
    this.controller.footer_model.EvtFeedLoaded.addListener(this,
        this.presentFeed);

   
    this.feed_list.addEventListener("transitionend", function () {
         that.feed_list.style.MozTransition = undefined;
         that.feed_list.style.visiblity = "hidden";
         that.feed_list.style.MozTransform = "translateX(0)";
         that.controller.footer_model.loadNextFeed();
    }, false);
    this.showLoader();
};
Signage.View.Footer.RATIO = (120 / 21202);
Signage.View.Footer.prototype._new_feed_element = function (text) {
    var li = document.createElement("li");
    li.innerHTML = text;
    return li;
};


Signage.View.Footer.prototype.presentFeed = function () {
    while (this.feed_list.hasChildNodes()) {
        this.feed_list.removeChild(this.feed_list.lastChild);
    }
    
    var elements, entry,i;
    this.feed_group.innerHTML = this.controller.
        footer_model.getData().getTitle();
    elements = this.controller.footer_model.getData().getItems();
    for (i = 0; i < elements.length; ++i) {
        entry = this._new_feed_element(elements[i].title);
        this.feed_list.appendChild(entry);
    }
    this.feed_list.style.MozTransition = "-moz-transform " + 
        parseInt(this.feed_list.offsetWidth * Signage.View.Footer.RATIO) +
        "s linear";
    this.feed_list.style.visiblity = "visible";
    this.feed_list.style.MozTransform = "translateX(-100%)";
    this.hideLoader();
}

Signage.View.Footer.prototype.showLoader = function () {
     this.loader.style.opacity = 1;
}

Signage.View.Footer.prototype.hideLoader = function () {
     this.loader.style.opacity = 0;
}


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
