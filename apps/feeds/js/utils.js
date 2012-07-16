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

// Listening for the transition-end event
// Adapted from the Modernizer source code
var transEndEventNames = {
  'WebkitTransition' : 'webkitTransitionEnd',
  'MozTransition'    : 'transitionend',
  //'OTransition'      : 'oTransitionEnd',
  //'msTransition'     : 'msTransitionEnd', // maybe?
  'transition'       : 'transitionEnd'
};
CSS3_TRANSITION_END = transEndEventNames[ Modernizr.prefixed('transition') ];
