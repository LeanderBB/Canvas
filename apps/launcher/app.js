window.onload=function(){
  var body = document.getElementsByTagName('body')[0];
  var height = heightForWidth16By9(body.offsetWidth);
  var margin = ((body.offsetHeight - height) * 0.5);
  if( margin > 0) {
    body.style.marginTop=margin+"px";
    body.style.height="-moz-calc(100% - "+(2 * margin)+"px)";
  }
}
