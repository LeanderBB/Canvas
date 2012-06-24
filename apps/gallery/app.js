
function Gallery(){
  this.menu_list = new Slider({div:"menu",mode:Slider.SCROLL_VERTICAL});
  this.content = new Slider({div:"content", mode:Slider.SCROLL_HORIZONTAL});
}


Gallery.prototype.init = function(){
  var view = this.menu_list.getView();
  var list = document.createElement("ul");
  list.classList.add("g_menu");
  var i;
  for( i=0; i < 10; ++i){
    var element = this._createNewMenuElement("","ENTRY "+i,i);
    list.appendChild(element);
  }
  view.appendChild(list);
}

Gallery.prototype._createNewMenuElement = function(thumb,title,item_count){
   var li = document.createElement("li");
   li.innerHTML = "<div></div><h1>"+title+"</h1><h2>"+item_count+" Items</h2>";
   return li;
}
