/** Calendar  ****************************************************************/
var calendar_list = [
	"5ttsisforihpn2o3blhe3s4tlo@group.calendar.google.com",
//	"uinm3kojaoe3llod88ma22o78s@group.calendar.google.com",
//	"o1n262ugsh3tg96jn6t75f8fnc@group.calendar.google.com",
//	"l1suartp8gksjb6k0fosk7uo60@group.calendar.google.com"
]

/** Constants *****************************************************************/
var months = ["JANEIRO", "FEVEREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO", "JULHO",
              "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO"];

var day = ["SEGUNDA FEIRA", "TERÇA FEIRA", "QUARTA FEIRA", "QUINTA FEIRA", 
           "SEXTA FEIRA"];

/** Initial Set Up ************************************************************/
var menuController;

google.load("gdata", "2.x");
$(document).ready(function(){
	menuController = new MenuController();
});


/** Menu Controller ************************************************************
********************************************************************************
*******************************************************************************/
function MenuController(){
	this.menuview  = new MenuView();
	this.menumodel = new MenuModel(this);

	$(window).resize( $.proxy( function(){
		var w  = $(window).width();
		var h  = $(window).height();
		this.set_window_dimensions(w,h);
	}, this ));

}

/* actualize the necessary stuff when a resize occurs */
MenuController.prototype.set_window_dimensions = function(width,height) {
	this.menuview.set_window_dimensions(width,height);
}

/* */
MenuController.prototype.actualize_data = function(){
	if(this.menumodel.get_loaded_calendars() == calendar_list.length){
		var data = this.menumodel.get_calendar_data();
		this.menuview.set_calendar_data(data);
	}
}






/** Menu Model *****************************************************************
********************************************************************************
*******************************************************************************/
function MenuModel(parent){
	this.calendar_data     = {};
	this.controller        = parent;
   this.loaded_calendars  = 0;

	for( var c in calendar_list ){
		console.log(calendar_list[c]);
		this.load_calendar_by_address(calendar_list[c]);
	}
}

MenuModel.prototype.get_loaded_calendars = function(){
	return this.loaded_calendars;
}

/** @param {string} calendar_address is the email-style address for the calendar 
 */ 
MenuModel.prototype.load_calendar_by_address = function(calendar_address){
  var calendar_url = 'https://www.google.com/calendar/feeds/' + calendar_address + 
				        '/public/full';
  this.load_calendar(calendar_url);
}

/** @param {string} calendarUrl is the URL for a public calendar feed *********/  
MenuModel.prototype.load_calendar = function(calendar_url) {
	var service = new 
		google.gdata.calendar.CalendarService('gdata-js-client-samples-simple');

	var query = new google.gdata.calendar.CalendarEventQuery(calendar_url);
	query.setOrderBy('starttime');
	query.setSortOrder('descending');
	query.setMaxResults(30);
	//query.setFutureEvents(true); //TODO: uncomment this if commented

	service.getEventsFeed(query, $.proxy(this.handle_events, this), 
          							  $.proxy(this.handle_error,  this) );
}

/** @param {Error} e is an instance of an Error *******************************/
MenuModel.prototype.handle_error = function(error) {
  //TODO try again in moments and log the problem
  if (error instanceof Error) {
	 console.log('Error at line ' + error.lineNumber + ' in ' + error.fileName + '\n' + 
				    'Message: ' + error.message);
    console.log(error);
  }
}

/** @param {json} feedRoot is the root of the feed, containing all entries ****/ 
MenuModel.prototype.handle_events = function(feed_root) {
  var type    = feed_root.feed.title.getText();
  var entries = feed_root.feed.entry;
  var len     = entries.length;

  for (var i = 0; i < len; i++) {
	 var entry = entries[i];
	 var title = entry.getTitle().getText();
	 var times = entry.getTimes();
	 var startDateTime = null;
	 var startJSDate = null;

	 if (times.length > 0) {
		startDateTime = times[0].getStartTime();
		startJSDate = startDateTime.getDate();
	 }

    var year  = startJSDate.getFullYear();
    var week  = startJSDate.getWeek();
    var day   = startJSDate.getDay();
    var info  = title.split(";");

    if(info.length >= 2){
		info[0] = info[0].replace("S.","Sopa de ");
		info[0] = info[0].replace("C.","Creme de ");
	 }else{
		info[0] = "N/A";
		info[1] = "N/A";
	 }

    if(this.calendar_data[year] == undefined){ this.calendar_data[year] = {}; }
    if(this.calendar_data[year][week] == undefined){ this.calendar_data[year][week] = {}; }
    if(this.calendar_data[year][week][day] == undefined){ this.calendar_data[year][week][day] = {}; }

    this.calendar_data[year][week][day][type] = {"info1": info[0], "info2": info[1], "date": startJSDate};
  }

  this.loaded_calendars += 1;
  //TODO check concurrency model in js
  if(this.loaded_calendars == calendar_list.length){
    this.controller.actualize_data();
  }  
}

/* get calendar data */
MenuModel.prototype.get_calendar_data = function(){
	return this.calendar_data;
}




/** Menu View ******************************************************************
********************************************************************************
*******************************************************************************/
function MenuView(){
	this.width            = $(window).width();
	this.height           = $(window).height();
   this.sidebar_selected = "";
   this.calendar_data    = {};
   this.calendar_index   = [];

	this.menu_list = new Slider({div:"sidebar_table_container", slider: "sidebar_table", mode:Slider.SCROLL_VERTICAL});
	//this.content   = new Slider({div:"main_container", slider: "main_panel", mode:Slider.SCROLL_HORIZONTAL});

	this.menu_bind_animations();
}

MenuView.prototype.set_calendar_data = function(data){
	this.calendar_data = data;
	console.log(this.calendar_data);

	var cnt = 1;

	for( var year in this.calendar_data ){
		for( var week in this.calendar_data[year] ){
				this.add_sidebar_item("r"+cnt, 
											 this._get_first_month(this.calendar_data[year][week]),
											 this._get_last_month(this.calendar_data[year][week]),
											 this._get_first_day(this.calendar_data[year][week]),
											 this._get_last_day(this.calendar_data[year][week]));
				cnt++;

				this.calendar_index[cnt] = this.calendar_data[year][week];
				console.log("    cnt" + cnt);
		}
	}
}

MenuView.prototype._get_first_month = function(week){
	var month = 11;

	for( var day in week ){
		for( var type in week[day] ){
			var m = week[day][type].date.getMonth();
			if(month > m){
				month = m;
			}
		}
	}
	return months[month];
}

MenuView.prototype._get_last_month = function(week){
	var month = 0;

	for( var day in week ){
		for( var type in week[day] ){
			var m = week[day][type].date.getMonth();
			if(month < m){
				month = m;
			}
		}
	}
	return months[month];
}

MenuView.prototype._get_first_day = function(week){
	var _day   = 31;
   var _month = 11;

	for( var day in week ){
		for( var type in week[day] ){
			var d = week[day][type].date.getDate();
			var m = week[day][type].date.getMonth();

			if(_month > m && _day > d){
				_month = m;
				_day = d;
			}
		}
	}
	return _day;
}

MenuView.prototype._get_last_day = function(week){
	var _day = 0;

	for( var day in week ){
		for( var type in week[day] ){
			var d = week[day][type].date.getDate();
			_day = d;
		}
	}
	return _day;
}


MenuView.prototype.add_sidebar_item = function(id, first_month, last_month, begin_day, end_day){
	var ul = document.getElementById("sidebar_table");
   var li = this.create_sidebar_item(id, first_month, last_month, begin_day, end_day);
	ul.appendChild(li);

	this.menu_register_sidebar_click("#"+id);
}

MenuView.prototype.create_sidebar_item = function(id, first_month, last_month, begin_day, end_day){
	var li = document.createElement("li");
	li.id = id;
   li.innerHTML = "<h1> EMENTA " + first_month + "</h1> <h2>De " + begin_day + " a " + end_day + " de " + last_month + "</h2>";
   return li;
}



/* actualize window dimensions */
MenuView.prototype.set_window_dimensions = function(width,height){
	this.width = width;
	this.height = height;
	$("body").css("font-size", ((this.width * 100) / 1980)+"%" );
}


/* button close animation */
MenuView.prototype.menu_main_close = function(){
	if($("#main_menu").css("opacity") == 0){
		$("#main_menu").css("opacity","1");
	}else{
		$("#main_menu").css("opacity","0");
	}
}


/* menu right animation */
MenuView.prototype.menu_main_right = function(){
	var translate = this.width / 3.5;
	$("#main_panel").css("-moz-transform", "translateX(-"+translate+"px");
}


/* menu left animation */
MenuView.prototype.menu_main_left = function(){
	$("#main_panel").css("-moz-transform", "translateX(0px");
}

/* catch a sidebar click */
MenuView.prototype.menu_sidebar_click = function(event){
	var id = event.currentTarget.id;

	//TODO: remove this if
	if(this.sidebar_selected != ""){
		$("#"+this.sidebar_selected).css("background-color", "transparent");
		$("#"+this.sidebar_selected + "> h1").css("color", "#FFFFFF");
		$("#"+this.sidebar_selected + "> h2").css("color", "#FFFF00");
	}
	
	$("#"+id).css("background-color", "#FFFF00");
	$("#"+id + "> h1").css("color", "#000000");
	$("#"+id + "> h2").css("color", "#000000");

	this.sidebar_selected = id;
}

/* register li click */
MenuView.prototype.menu_register_sidebar_click = function(id){
	$(id).click( $.proxy( this.menu_sidebar_click, this) );	
}

/* bind animations */
MenuView.prototype.menu_bind_animations = function(){
	$("#main_close").click( $.proxy( this.menu_main_close, this) );
	$("#main_right").click( $.proxy( this.menu_main_right, this) );
	$("#main_left").click(  $.proxy( this.menu_main_left,  this) );
}


/** EOF ************************************************************************
*******************************************************************************/

Date.prototype.getWeek = function() {
	var onejan = new Date(this.getFullYear(),0,1);
	return Math.ceil((((this - onejan) / 86400000) + onejan.getDay()+1)/7);
}

