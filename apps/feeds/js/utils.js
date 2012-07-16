'use script';
$.fn.sanitizeHTML = function() {
  var $children = $(this).children();
  $children.each(function() {
    if ($(this).not("b").not("i").not("p").not("br").length > 0) {
      $(this).replaceWith($(this).text());
    } else {
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
        console.log(threshold_y + "  " + current_y);
        if((threshold_y>current_y)){
            $down.addClass("active");
        }
        else {
            $down.removeClass("active");
        }
      });
  })(kinetic_slider, div_id, slider);

  return $(this);
};


