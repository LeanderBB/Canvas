
window.onload = function(){
  g = new Gallery();
  g.init();
}

function Gallery(){
  this.menu_view = new Gallery.MenuView(this);
  this.model = new Gallery.Model();
  this.content = new Slider({div:"content", mode:Slider.SCROLL_HORIZONTAL,disable_events:true});
  var that = this;

  // arrow test
  var arrow_left = document.getElementById("main_arrow_left");
  var arrow_right = document.getElementById("main_arrow_right");
  var step = this.content.getView().parentNode.offsetWidth;
  arrow_left.addEventListener("click",function(e){
      var cur_pos = that.content.getScrollScalar();
      cur_pos.x -= step;
      that.content.setScrollPoint(cur_pos);
    },false);
  
  arrow_right.addEventListener("click",function(e){
      var cur_pos = that.content.getScrollScalar();
      cur_pos.x += step;
      that.content.setScrollPoint(cur_pos);

    },false);
}

Gallery.prototype.init = function(){
    this.model.init();
    var galleries = this.model.getGalleries();
    var i;
    for ( i in galleries ){
        this.menu_view.addElement(galleries[i]);
    }

    var content_view = this.content.getView();
    content_view.style.width = "auto";
    for( i=0; i < 8; i++){
        content_view.appendChild(this._createNewContentElement("../../media/"+i+".jpg"));
    }
}

Gallery.prototype._createNewMenuElement = function(thumb,title,item_count){
    var li = document.createElement("li");
    li.innerHTML = "<div></div><h1>"+title+"</h1><h2>"+item_count+" Items</h2>";
    return li;
}

Gallery.prototype._createNewContentElement = function(source){
    var div = document.createElement("div");
    div.style.backgroundImage = 'url("'+source+'")';
    div.style.backgroundSize = 'contain';
    div.style.backgroundPosition = 'center';
    div.style.backgroundRepeat = 'no-repeat';
    div.style.width = "90em";
    div.style.height = "100%";
    div.style.display = "inline-block";
    div.style.float = "left";
    return div;
}

Gallery.DataModels = {};
Gallery.ContentHandlers = {};

// ### Gallery Model #############################################

Gallery.Model = function (){
    this.galleries = [];
}

Gallery.Model.prototype.getGalleryCoubt = function(){
    return this.galleries.length;
}

Gallery.Model.prototype.getGalleries = function(){
    return this.galleries;
}

Gallery.Model.prototype.getGalleryAtIndex = function(index){
    return this.galleries[index]
}

Gallery.Model.prototype.init = function() {
    var item;
    for ( i in CONFIG.gallery){
        item = CONFIG.gallery[i];
        if ( Gallery.DataModels[item.type] === "undefined" || 
				typeof Gallery.DataModels[item.type] !== "function"){
            alert("data-model-not-found: "+item.type);
        }else{
            model = new Gallery.DataModels[item.type]();
            model.init(item);
            this.galleries.push(model);
        }
    }
}


// ### Gallery Standard Data Model ###############################

function StandardModel(){
    this.name = "";
    this.type = "standard";
    this.files = [];
    this.thumb_url = "";
}

StandardModel.prototype.getName = function() {
    return this.name;
}

StandardModel.prototype.getType = function() {
    return this.type;
}

StandardModel.prototype.getThumbUrl = function() {
    return this.thumb_url;
}

StandardModel.prototype.getItemCount = function() {
    return this.files.length;
}

StandardModel.prototype.getItem = function( index ){
    return this.files[index]; 
}

StandardModel.prototype.newElement = function(){
    return new StandardModel.Element();
}

StandardModel.prototype.init = function(data){
    this.name = data.name;
    this.thumb_url = data.thumb;
    for ( item in data.data){
        var element = this.newElement();
        element.init(item);
        this.files.push(element);
    }
}

StandardModel.Element = function(){
    this.url = "";
    this.thumb_url = "";
    this.item_type = "";
}

StandardModel.Element.prototype.getUrl = function () {
    return this.url;
}
StandardModel.Element.prototype.getThumbUrl = function () {
    return this.thumb_url;
}

StandardModel.Element.prototype.getItemType = function () {
    return this.item_type;
}

StandardModel.Element.prototype.getType = function () {
    return "standard.element";
}

StandardModel.Element.prototype.init = function (data) { 
    this.url = data.url;
    this.item_type = data.type;
    this.thumb_url = data.thumb;
}

Gallery.DataModels["standard"] = StandardModel;
// ### Gallery Menu View #########################################

Gallery.MenuView = function(gallery){
    this.controller = gallery;
    this.menu= new Slider({div:"menu",mode:Slider.SCROLL_VERTICAL});
    this.list = document.createElement("ul");
    this.list.classList.add("g_menu");
    this.menu.getView().appendChild(this.list);
    this.default_location = window.location;
    this.element_count=0;
}

Gallery.MenuView.prototype.addElement = function(element){
    var elem_view = document.createElement("li");
    elem_view.id=this.element_count;
    elem_view.innerHTML = '<div style="background-image=url(\''+
        element.getThumbUrl()+'\')"></div><h1>'+element.getName()+
        "</h1><h2>"+element.getItemCount()+" Items</h2>"
        this.list.appendChild(elem_view);
   this.element_count++;
}
