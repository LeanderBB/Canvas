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
    };
};

function Signage() {
    window.app.loadConfig();

    this.footer_model = new Signage.Model.Footer();
    this.footer_model.init();
    this.content_model = new Signage.Model.Content();
    this.content_model.init();
    this.footer_view = new Signage.View.Footer(this);
    this.content_view = new Signage.View.Content(this);
    this.content_view.init();
}

Signage.prototype.init = function () {
    this.footer_model.loadNextFeed();
};

Signage.ContentHandlers = {};
Signage.MediaDir = "../../media/";
Signage.ErrorImage = "resources/error.svg";


// ### Signage Model ##############################################

Signage.Model = {};


Signage.Model.Content = function () {
    this.files = [];
};

Signage.Model.Content.prototype.init = function () {
    this.files = window.app.getConfig().signage;
};

Signage.Model.Content.prototype.getItemCount = function () {
    return this.files.length;
};

Signage.Model.Content.prototype.getItemAtIndex = function (index) {
    return this.files[index];
};


Signage.Model.Footer = function () {
    this.current_data = null;
    this.feed_list = [];
    this.current_feed_index = 0;
    this.EvtFeedLoaded = new Event();
};

Signage.Model.Footer.prototype.init = function () {
    var config =  window.app.getConfig();
    this.feed_list = config.footer;
    this.current_feed_index = 0;
};

Signage.Model.Footer.prototype.loadNextFeed = function () {
    this.current_data = new IFeedModel(
        this.feed_list[this.current_feed_index]);
    this.current_feed_index = (this.current_feed_index + 1) %
        this.feed_list.length;
    var that = this;
    this.current_data.init(function () {
        that.EvtFeedLoaded.trigger();
    });
};

Signage.Model.Footer.prototype.getData = function () {
    return this.current_data;
};


// ### Signage View ################################################

Signage.View = {};

Signage.View.Content = function (controller) {
    this.div = document.getElementById("content");
    this.controller = controller;
    this.elements = [];
    this.timer = null;
    this.loader = document.getElementById("main_loading");
    this.cur_element_index = -1;
    this.elements_error = 0;
    this.elements_loaded = 0;
};


Signage.View.Content.prototype.init = function () {
    this.hide();
    var element_count, item, element, i;
    element_count = this.controller.content_model.getItemCount();
    for (i = 0; i < element_count; i++) {
        element = new Signage.View.Content.Element(this);
        item = this.controller.content_model.getItemAtIndex(i);
        element.init(item.type, item.url);
        this.elements.push(element);
    }
};


Signage.View.Content.prototype.show = function () {
    if ((this.elements_error + this.elements_loaded) ===
            this.controller.content_model.getItemCount()) {
        this.loader.style.opacity = 0;
        this.div.style.opacity = 1;
        var i;
        for (i in this.elements) {
            if (!this.elements[i].error) {
                this.div.appendChild(this.elements[i].div);
            }
        }
        this.showNextElement();
    }
};

Signage.View.Content.prototype.hide = function () {
    this.loader.style.opacity = 1;
    this.div.style.opacity = 0;
};

Signage.View.Content.prototype.showNextElement = function () {
    if (this.cur_element_index !== -1) {
        this.elements[this.cur_element_index].hide();
    }
    do {
        this.cur_element_index = (this.cur_element_index + 1) %
            (this.elements.length);
    } while (this.elements[this.cur_element_index].error);
    this.elements[this.cur_element_index].show();
};


Signage.View.Content.Element = function (view) {
    this.view = view;
    this.div = document.createElement("div");
    this.div.classList.add("s_main_item");
    this.handler = null;
    this.error = false;
};

Signage.View.Content.Element.prototype.init = function (type, url) {
    var elem = new Signage.ContentHandlers[type](this.div, url);
    elem.EvtReady.addListener(this, this.elementLoaded);
    elem.EvtError.addListener(this, this.elementError);
    elem.EvtTimeout.addListener(this.view, this.view.showNextElement);
    elem.init();
    this.handler = elem;
};

Signage.View.Content.Element.prototype.elementLoaded = function () {
    this.hide();
    this.view.elements_loaded++;
    this.view.show();
};

Signage.View.Content.Element.prototype.elementError = function () {
    this.hide();
    this.error = true;
    this.view.elements_error++;
    this.view.show();
};

Signage.View.Content.Element.prototype.show = function () {
    this.div.style.opacity = 1;
    this.div.style.MozTransform = "translateX(0)";
    this.handler.timeout();
};

Signage.View.Content.Element.prototype.hide = function () {
    this.div.style.opacity = 0;
    this.div.style.MozTransform = "translateX(100%)";
};

// ### Signage Footer View #########################################

Signage.View.Footer = function (controller) {
    this.controller = controller;
    this.feed_list = document.getElementById("feed_titles");
    this.div = document.getElementById("entries");
    this.feed_group = document.getElementById("feed_name");
    this.loader = document.getElementById("footer_loading");
    var that = this;
    this.controller.footer_model.EvtFeedLoaded.addListener(this,
        this.presentFeed);

   
    this.feed_list.addEventListener("transitionend", function () {
        that.feed_list.style.MozTransition = undefined;
        that.feed_list.style.visiblity = "hidden";
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
    
    var elements, entry, i;
    this.feed_group.innerHTML =
        this.controller.footer_model.getData().getTitle();
    elements = this.controller.footer_model.getData().getItems();
    for (i = 0; i < elements.length; ++i) {
        entry = this._new_feed_element(elements[i].title);
        this.feed_list.appendChild(entry);
    }
    this.feed_list.style.MozTransform = "translateX(" +
        this.div.offsetWidth + ")";
    this.feed_list.style.MozTransition = "-moz-transform " +
        parseInt((this.feed_list.offsetWidth + this.div.offsetWidth) *
        Signage.View.Footer.RATIO, 10) + "s linear";
    this.feed_list.style.visiblity = "visible";
    this.feed_list.style.MozTransform = "translateX(-100%)";
    this.hideLoader();
};

Signage.View.Footer.prototype.showLoader = function () {
    this.loader.style.opacity = 1;
};

Signage.View.Footer.prototype.hideLoader = function () {
    this.loader.style.opacity = 0;
};


// ### Signage ContentView Element #################################

Signage.View.IElement = function (parent, element) {
    this.src = Signage.MediaDir + element;
    this.parent = parent;
    this.EvtReady = new Event();
    this.EvtError = new Event();
    this.EvtTimeout = new Event();
};

Signage.View.IElement.prototype.init = function () {
    throw new Error("Abstract Method");
};

Signage.View.IElement.prototype.timeout = function () {
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
        that.EvtError.trigger();
    }, false);
    img.src = this.src;
    this.parent.style.backgroundImage = 'url("' + this.src + '")';
    this.parent.style.backgroundSize = 'contain';
    this.parent.style.backgroundPosition = 'center';
    this.parent.style.backgroundRepeat = 'no-repeat';
    
};

IMGHandler.prototype.timeout = function () {
    var that = this;
    setTimeout(function () {
        that.EvtTimeout.trigger();
    }, 15000);
};

OOP.extend(IMGHandler, Signage.View.IElement);

function VIDHandler(parent, element) {
    VIDHandler.super.constructor.call(this, parent, element);
    this.poster = undefined;
    this.vp = new VideoPlayer({"div": parent, "automatic": true});
    this.EvtReady = this.vp.EvtReady;
    this.EvtError = this.vp.EvtError;

}

VIDHandler.prototype.init = function () {
    this.vp.setSource(this.src);
    this.vp.EvtEnded.addListener(this, function () {
        this.EvtTimeout.trigger();
    });
};

VIDHandler.prototype.onExit = function () {
    this.vp.pause();
};

VIDHandler.prototype.timeout = function () {
    this.vp.play();
};

OOP.extend(VIDHandler, Signage.View.IElement);

// Register handlers
Signage.ContentHandlers["img"] = IMGHandler;
Signage.ContentHandlers["vid"] = VIDHandler;
