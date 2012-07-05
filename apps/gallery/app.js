
window.onload = function () {
    g = new Gallery();
    g.init();
};

function Gallery() {
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
// ### Gallery Model #############################################

Gallery.Model = function () {
    this.galleries = [];
};

Gallery.Model.prototype.getGalleryCoubt = function () {
    return this.galleries.length;
};

Gallery.Model.prototype.getGalleries = function () {
    return this.galleries;
};

Gallery.Model.prototype.getGalleryAtIndex = function (index) {
    return this.galleries[index];
};

Gallery.Model.prototype.init = function () {
    var item, i, model;
    for (i in CONFIG.gallery) {
        item = CONFIG.gallery[i];
        if (Gallery.DataModels[item.type] === "undefined" ||
                typeof Gallery.DataModels[item.type] !== "function") {
            alert("data-model-not-found: " + item.type);
        } else {
            model = new Gallery.DataModels[item.type]();
            model.init(item);
            this.galleries.push(model);
        }
    }
};


// ### Gallery Standard Data Model ###############################

function StandardModel() {
    this.name = "";
    this.type = "standard";
    this.files = [];
    this.thumb_url = "";
}

StandardModel.prototype.getName = function () {
    return this.name;
};

StandardModel.prototype.getType = function () {
    return this.type;
};

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

StandardModel.Element = function () {
    this.url = "";
    this.thumb_url = "";
    this.item_type = "";
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
};

Gallery.ContentView.prototype.nextElement = function () {
    if (this.cur_element < this.cur_gallery.getItemCount()) {
        this.cur_element++;
        this._update();
    }
};

Gallery.ContentView.prototype.prevElement = function () {
    if (this.cur_element !== 0) {
        this.cur_element--;
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
    this.content.getView().style.visibility = "hidden";
    this.loaded_elements = 0;
    this.errored_elements = 0;
    this.load_view.style.visibility = "visible";
    var view = this.content.getView(), i,
        total = this.cur_gallery.getItemCount(),
        element, type, div;
    for (i = 0; i < total; ++i) {
        element = this.cur_gallery.getItem(i);
        type = element.getItemType();
        if (Gallery.ContentHandlers[type] !== undefined) {
            div = document.createElement("div");
            div.style.width = "90em";
            div.style.height = "100%";
            div.style.display = "inline-block";
            Gallery.ContentHandlers[type](element, div, this);
            view.appendChild(div);
        } else {
            alert("NO HANDLER FOR " + type);
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

// ### Content Handlers ############################################
Gallery.ContentHandlers["img"] = function (element, parent_div, callbacks) {
    var img = new Image();
    img.addEventListener("load", function () {callbacks.elementLoaded(); },
        false);
    img.addEventListener("error", function () {callbacks.elementError(); },
        false);
    img.src = element.getUrl();
    parent_div.style.backgroundImage = 'url("' + element.getUrl() + '")';
    parent_div.style.backgroundSize = 'contain';
    parent_div.style.backgroundPosition = 'center';
    parent_div.style.backgroundRepeat = 'no-repeat';
};

Gallery.ContentHandlers["vid"] = function (element, parent_div, callbacks) {
    var vp = new VideoPlayer({"div": parent_div});
    vp.EvtReady.addListener(this, function () {callbacks.elementLoaded(); });
    vp.EvtError.addListener(this, function () {callbacks.elementError(); });
    vp.setSource(element.getUrl(), element.getThumbUrl());
};
