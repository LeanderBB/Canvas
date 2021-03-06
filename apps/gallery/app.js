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
    window.app = new CanvasApp("gallery");
    window.g = new Gallery();
    window.g.init();
    Gallery.MediaDir = window.app.getMediaPath();
    window.app.ready();
};

function Gallery() {
    this.close = document.getElementById("app_close");
    this.close.addEventListener("mouseup", function () {
        window.app.exit();
    }, false);
    this.menu_view = new Gallery.MenuView(this);
    this.model = new Gallery.Model();
    this.content_view = new Gallery.ContentView(this);
    var that = this;
}

Gallery.prototype.init = function () {
    this.model.init();
    this.menu_view.load(this.model);
    this.menu_view.openGallery(0);
};

Gallery.prototype.openGallery = function (index) {
    var gallery = this.model.getGalleryAtIndex(index);
    this.content_view.displayGallery(gallery);
};

Gallery.DataModels = {};
Gallery.ContentHandlers = {};
Gallery.MediaDir = "../../media/";
Gallery.ErrorImage = "resources/error.svg";
// ### Gallery Model #############################################

Gallery.Model = function () {
    this.galleries = [];
};

Gallery.Model.prototype.getGalleryCount = function () {
    return this.galleries.length;
};

Gallery.Model.prototype.getGalleries = function () {
    return this.galleries;
};

Gallery.Model.prototype.getGalleryAtIndex = function (index) {
    return this.galleries[index];
};

Gallery.Model.prototype.init = function () {
    var item, i, model, config;
    window.app.loadConfig();
    config = window.app.getConfig();
    for (i in config.gallery) {
        item = config.gallery[i];
        if (Gallery.DataModels[item.type] === "undefined" ||
                typeof Gallery.DataModels[item.type] !== "function") {
            console.log("[Gallery] data-model-not-found: " + item.type);
        } else {
            model = new Gallery.DataModels[item.type]();
            model.init(item);
            this.galleries.push(model);
        }
    }
};


// ### Gallery Standard Data Model ###############################

Gallery.IDataModel = function () {
    this.name = "";
    this.type = "idatamodel";
    this.thumb_url = "";
};

Gallery.IDataModel.prototype.getName = function () {
    return this.name;
};

Gallery.IDataModel.prototype.getType = function () {
    return this.type;
};

Gallery.IDataModel.prototype.getThumbUrl = function () {
    return this.thumb_url;
};

Gallery.IDataModel.prototype.getItemCount = function () {
    throw new Error("Abstract method");
};
    
Gallery.IDataModel.prototype.getItem = function (index) {
    throw new Error("Abstract method");
};

Gallery.IDataModel.prototype.newElement = function () {
    throw new Error("Abstract method");
};

Gallery.IDataModel.prototype.init = function (data) {
    throw new Error("Abstract method");
};

Gallery.IDataModel.Element = function () {
    this.url = "";
    this.thumb_url = "";
    this.item_type = "";
    this.type = "idatamodel.element";
};

Gallery.IDataModel.Element.prototype.getUrl = function () {
    return  this.url;
};

Gallery.IDataModel.Element.prototype.getThumbUrl = function () {
    return  this.thumb_url;
};

Gallery.IDataModel.Element.getItemType = function () {
    return this.item_type;
};

Gallery.IDataModel.Element.getType = function () {
    return this.type;
};

Gallery.IDataModel.Element.init = function (data) {
    throw new Error("Abstract method");
};

function StandardModel() {
    StandardModel.super.constructor.call(this);
    this.type = "standard";
    this.files = [];
}

StandardModel.prototype.getThumbUrl = function () {
    return Gallery.MediaDir + this.thumb_url;
};

StandardModel.prototype.getItemCount = function () {
    return this.files.length;
};

StandardModel.prototype.getItem = function (index) {
    return this.files[index];
};

StandardModel.prototype.newElement = function () {
    return new StandardModel.Element();
};

StandardModel.prototype.init = function (data) {
    this.name = data.name;
    this.thumb_url = data.thumb;
    var i, element;
    for (i in data.data) {
        element = this.newElement();
        element.init(data.data[i]);
        this.files.push(element);
    }
};

OOP.extend(StandardModel, Gallery.IDataModel);

StandardModel.Element = function () {
    StandardModel.Element.super.constructor.call(this);
    this.type = "standard.element";
};

StandardModel.Element.prototype.getUrl = function () {
    return  Gallery.MediaDir + this.url;
};
StandardModel.Element.prototype.getThumbUrl = function () {
    return  Gallery.MediaDir + this.thumb_url;
};

StandardModel.Element.prototype.getItemType = function () {
    return this.item_type;
};

StandardModel.Element.prototype.getType = function () {
    return "standard.element";
};

StandardModel.Element.prototype.init = function (data) {
    this.url = data.url;
    this.item_type = data.type;
    this.thumb_url = data.thumb;
};

OOP.extend(StandardModel.Element, Gallery.IDataModel.Element);

Gallery.DataModels["standard"] = StandardModel;
// ### Gallery Menu View #########################################

Gallery.MenuView = function (gallery) {
    this.controller = gallery;
    this.menu = new Slider({div: "menu", mode: Slider.SCROLL_VERTICAL});
    this.list = document.createElement("ul");
    this.list.classList.add("g_menu");
    this.element_count = 0;
    this.icon_top = document.getElementById("menu_top");
    this.icon_bottom = document.getElementById("menu_bottom");
    this.current_element = null;
    this.elements = [];
};

Gallery.MenuView.prototype.handleScroll = function (scroll) {
    if (scroll.y > 50) {
        this.icon_top.style.visibility = "visible";
    } else {
        this.icon_top.style.visibility = "hidden";
    }

    if (scroll.y >= (this.menu._getLimit().y * -1 - 50)) {
        this.icon_bottom.style.visibility = "hidden";
    } else {
        this.icon_bottom.style.visibility = "visible";
    }
};

Gallery.MenuView.prototype.load = function (model) {
    var galleries = model.getGalleries(), i;
    this.menu.clear();
    this.menu.getView().appendChild(this.list);
    this.element_count = 0;
    this.icon_top.style.visibility = "hidden";
    this.icon_bottom.style.visibility = "hidden";
    for (i in galleries ) {
        this.addElement(galleries[i]);
    }
    if (this.menu.isSlidable()) {
        this.icon_bottom.style.visibility = "visible";
        this.menu.EvtScroll.addListener(this, this.handleScroll);
    }
};

Gallery.MenuView.prototype.addElement = function (element) {

    var elem_view = document.createElement("li"),
        that = this, count = this.element_count;
    elem_view.id = this.element_count;
    elem_view.innerHTML = '<div style="background-image: url(\'' +
        element.getThumbUrl() + '\')"></div><h1>' + element.getName() +
        "</h1><h2>" + element.getItemCount() + " Items</h2>";
    this.list.appendChild(elem_view);
    this.elements.push(elem_view);
    elem_view.addEventListener("mouseup", function () {
            that.openGallery(count);
        }, false);
    this.element_count++;
};

Gallery.MenuView.prototype.selectElement = function (index) {
    if (this.current_element !== null) {
        this.current_element.classList.remove("g_menu_active");
    }
    this.current_element = this.elements[index];
    this.current_element.classList.add("g_menu_active");
};

Gallery.MenuView.prototype.openGallery = function (gallery_index) {
    this.controller.openGallery(gallery_index);
    this.selectElement(gallery_index);
};

// ### Gallery Content View #######################################

Gallery.ContentView = function (gallery) {
    this.content = new Slider({div: "content",
        mode: Slider.SCROLL_HORIZONTAL,
        disable_events: true});
    this.controller = gallery;
    this.cur_gallery = null;
    this.cur_element = 0;
    this.arrow_left = document.getElementById("main_arrow_left");
    this.arrow_right = document.getElementById("main_arrow_right");
    this.load_view = document.getElementById("loading_dialog");
    var that = this;
    this.arrow_left.addEventListener("click", function (e) {
            that.prevElement();
        }, false);

    this.arrow_right.addEventListener("click", function (e) {
            that.nextElement();
        }, false);
    this.elements = [];
};

Gallery.ContentView.prototype.nextElement = function () {
    if (this.cur_element < this.cur_gallery.getItemCount()) {
        this.elements[this.cur_element].onExit();
        this.cur_element++;
        this.elements[this.cur_element].onEnter();
        this._update();
    }
};

Gallery.ContentView.prototype.prevElement = function () {
    if (this.cur_element !== 0) {
        this.elements[this.cur_element].onExit();
        this.cur_element--;
        this.elements[this.cur_element].onEnter();
        this._update();
    }
};

Gallery.ContentView.prototype._update = function () {
    if (this.cur_element === 0) {
        this.arrow_left.style.display = "none";
    } else {
        this.arrow_left.style.display = "block";
    }
    if (this.cur_element === (this.cur_gallery.getItemCount() - 1)) {
        this.arrow_right.style.display = "none";
    } else {
        this.arrow_right.style.display = "block";
    }
    var step = this.content.getView().parentNode.offsetWidth *
        this.cur_element;
    this.content.setScrollPoint(new Point2D(step, 0));
};

Gallery.ContentView.prototype.displayGallery = function (model) {
    this.cur_gallery = model;
    this.content.clear();
    this.elements = [];
    this.content.getView().style.visibility = "hidden";
    this.loaded_elements = 0;
    this.errored_elements = 0;
    this.load_view.style.visibility = "visible";
    var view = this.content.getView(), i,
        total = this.cur_gallery.getItemCount(),
        element, type, div, elem;
    for (i = 0; i < total; ++i) {
        element = this.cur_gallery.getItem(i);
        type = element.getItemType();
        if (Gallery.ContentHandlers[type] !== undefined) {
            div = document.createElement("div");
            div.style.width = "90em";
            div.style.height = "100%";
            div.style.display = "inline-block";
            elem = new Gallery.ContentHandlers[type](div, element);
            elem.EvtReady.addListener(this, this.elementLoaded);
            elem.EvtError.addListener(this, this.elementError);
            elem.init();
            view.appendChild(div);
            this.elements.push(elem);
        } else {
            this.elementError();
            console.log("[GALLERY] No media handler for" + type);
        }
    }
    this.cur_element = 0;
    this._update();
};

Gallery.ContentView.prototype.elementLoaded = function () {
    this.loaded_elements++;
    this._showContent();
};

Gallery.ContentView.prototype.elementError = function () {
    this.errored_elements++;
    this._showContent();
};

Gallery.ContentView.prototype._showContent = function () {
    if (this.loaded_elements + this.errored_elements >=
        this.cur_gallery.getItemCount()) {
        this.content.getView().style.visibility = "visible";
        this.load_view.style.visibility = "hidden";
    }
};


// ### Gallery ContentView Element #################################

Gallery.ContentView.IElement = function (parent, element) {
    this.src = element.getUrl();
    this.parent = parent;
    this.EvtReady = new Event();
    this.EvtError = new Event();
};

Gallery.ContentView.IElement.prototype.init = function () {
    throw new Error("Abstract Method");
};

Gallery.ContentView.IElement.prototype.onEnter = function () {
    // Do Nothing
};

Gallery.ContentView.IElement.prototype.onExit = function () {
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

OOP.extend(IMGHandler, Gallery.ContentView.IElement);

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

OOP.extend(VIDHandler, Gallery.ContentView.IElement);

// Register handlers
Gallery.ContentHandlers["img"] = IMGHandler;
Gallery.ContentHandlers["vid"] = VIDHandler;
