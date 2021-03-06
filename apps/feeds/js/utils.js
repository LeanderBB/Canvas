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
'use script';
$.fn.sanitizeHTML = function() {
  var $children = $(this).children();
  $children.each(function() {
    if ($(this).is("a")){
      $(this).attr("href","");
    }
    //if ($(this).not("b").not("i").not("p").not("br").length > 0) {
      /*
      if($(this).is("img")){
        $(this).attr("style","");
      }
      else if ($(this).is("a")){
        $(this).attr("href","");
        $(this).attr("style","");
        var b = $("b").html($(this).html());
        $(this).replaceWith(b);
      }
      else {
        */
        //$(this).replaceWith($(this).text());
      //}
      /*
    }
    */
    
    else {
      $(this).sanitizeHTML();
    }
  });
  return $(this);
};


AppNS.Utils.matrixToArray = function(matrix) {
    return matrix.substr(7, matrix.length - 8).split(', ');
};

// cross-browser CSS3 transition-end events
CSS3_TRANSITION_END = "webkitTransitionEnd msTransitionEnd oTransitionEnd transitionEnd transitionend";

/*
  --- Need to document this ---
  options = {
    show_arrows: 'true'/'false';  // default=true
  }
*/
$.fn.KineticSlider = function(options) {
  // arrow dom elements should be instantiated here ...
  var show_arrows=true;
  if (options !== undefined){
    show_arrows = show_arrows || options.show_arrows;
  }

  var div_id = $(this).get(0).id;
  var slider = $(this).find('.slider').get(0);
  var slider_id = slider.id;
  kinetic_slider = new Slider({'div': div_id, 'slider': slider_id });

  (function(slider_obj, container_element_id, slider){
      slider_obj.EvtScroll.addListener(this, function(amount){
        var $up = $("#"+container_element_id).find(".gfx-arrow.up");
        var $down = $("#"+container_element_id).find(".gfx-arrow.down");
        if ((amount.y)>10) {
            $up.addClass("active");
        }
        else {
            $up.removeClass("active");
        }
        var threshold_y = Math.abs($(slider).height()-700);
        var current_y = Math.round(Math.abs(amount.y));
        if((threshold_y>current_y)){
            $down.addClass("active");
        }
        else {
            $down.removeClass("active");
        }
      });
  })(kinetic_slider, div_id, slider);

  return kinetic_slider;
};


