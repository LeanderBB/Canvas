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
