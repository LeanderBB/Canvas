
window.onload = function(){
  g = new Gallery();
  g.init();
}

function Gallery(){
  this.menu_list = new Slider({div:"menu",mode:Slider.SCROLL_VERTICAL});
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
  var view = this.menu_list.getView();
  var list = document.createElement("ul");
  list.classList.add("g_menu");
  var i;
  for( i=0; i < 10; ++i){
    var element = this._createNewMenuElement("","ENTRY "+i,i);
    list.appendChild(element);
  }
  view.appendChild(list);

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
