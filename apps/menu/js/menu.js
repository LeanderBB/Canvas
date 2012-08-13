"use strict";

/** Calendar  ****************************************************************/
var calendar_list = [
	"5ttsisforihpn2o3blhe3s4tlo@group.calendar.google.com",
	"uinm3kojaoe3llod88ma22o78s@group.calendar.google.com",
	"o1n262ugsh3tg96jn6t75f8fnc@group.calendar.google.com",
	"l1suartp8gksjb6k0fosk7uo60@group.calendar.google.com"
];

/** Constants *****************************************************************/
var months = [
	"JANEIRO",  "FEVEREIRO", "MARÇO",    "ABRIL",
	"MAIO",     "JUNHO",     "JULHO",    "AGOSTO",
	"SETEMBRO", "OUTUBRO",   "NOVEMBRO", "DEZEMBRO"
];

var days = [
	"DOMINGO",      "SEGUNDA FEIRA", "TERÇA FEIRA", "QUARTA FEIRA",
	"QUINTA FEIRA", "SEXTA FEIRA",   "SÁBADO"
];

/** Initial Set Up ************************************************************/
var menuController;

google.load("gdata", "2.x");

$(document).ready(function () {
	window.app = new CanvasApp("menu");
	menuController = new MenuController();
});





/** Menu Controller ************************************************************
********************************************************************************
*******************************************************************************/
function MenuController() {
	this.menuview  = new MenuView();
	this.menumodel = new MenuModel(this);
	this.set_window_dimensions($(window).width(), $(window).height());

	$(window).resize($.proxy(function () {
		this.set_window_dimensions($(window).width(), $(window).height());
	}, this));
}

/* actualize the necessary stuff when a resize occurs */
MenuController.prototype.set_window_dimensions = function (width, height) {
	this.menuview.set_window_dimensions(width, height);
};

/* actualize data (calendars are all loaded) */
MenuController.prototype.actualize_data = function () {
	var data = this.menumodel.get_calendar_data();
	this.menuview.set_calendar_data(data);
	this.menuview.actualize_interface();
	window.app.ready();
};

/* error has happened (some or all calendars are not loaded) */
MenuController.prototype.error_has_happened = function () {
	this.menumodel.error_has_happened = true;
	this.menuview.error_has_happened();
};





/** Menu Model *****************************************************************
********************************************************************************
*******************************************************************************/
function MenuModel(parent) {
	this.calendar_data      = {};
	this.controller         = parent;
	this.loaded_calendars   = 0;
	this.error_has_happened = false;

	for (var c in calendar_list) {
		console.log(calendar_list[c]);
		this.load_calendar_by_address(calendar_list[c]);
	}
}

/* get calendars */
MenuModel.prototype.get_loaded_calendars = function () {
	return this.loaded_calendars;
};

/* calendar_address is the email-style address for the calendar */
MenuModel.prototype.load_calendar_by_address = function (calendar_address) {
	var calendar_url = 'https://www.google.com/calendar/feeds/' +
							calendar_address +
							'/public/full';
	this.load_calendar(calendar_url);
};

/* calendarUrl is the URL for a public calendar feed */
MenuModel.prototype.load_calendar = function (calendar_url) {
	var query, service, date;

	date    = new google.gdata.DateTime(new Date(), true);
	service = new
		google.gdata.calendar.CalendarService('gdata-js-client-samples-simple');

	query = new google.gdata.calendar.CalendarEventQuery(calendar_url);
	query.setOrderBy('starttime');
	query.setSortOrder('ascending');
	query.setMinimumStartTime(date);

	service.getEventsFeed(query, $.proxy(this.handle_events, this),
											$.proxy(this.handle_error,  this));
};

/** e is an instance of an Error */
MenuModel.prototype.handle_error = function (error) {

	if (this.error_has_happened === false) {
		this.controller.error_has_happened();
	}
	
	if (error instanceof Error) {
		console.log('Error at line ' + error.lineNumber + ' in ' +
						error.fileName + '\n' + 'Message: ' + error.message);
		console.log(error);
	}
};

/* feedRoot is the root of the feed, containing all entries */
MenuModel.prototype.handle_events = function (feed_root) {

	if (this.error_has_happened === true) {
		return;
	}

	var type, entries, len, entry, title, times, startDateTime, startJSDate,
		year, week, day, info, i;

	type    = feed_root.feed.title.getText();
	entries = feed_root.feed.entry;
	len     = entries.length;

	for (i = 0; i < len; i++) {
		entry = entries[i];
		title = entry.getTitle().getText();
		times = entry.getTimes();
		startDateTime = null;
		startJSDate = null;

		if (times.length > 0) {
			startDateTime = times[0].getStartTime();
			startJSDate = startDateTime.getDate();
		}

		year  = startJSDate.getFullYear();
		week  = startJSDate.getWeek();
		day   = startJSDate.getDay();
		info  = title.split(";");

		if (info.length >= 2) {
			info[0] = info[0].replace("S.", "Sopa de ");
			info[0] = info[0].replace("C.", "Creme de ");
		} else {
			info[0] = "N/A";
			info[1] = "N/A";
		}

		if (this.calendar_data[year] === undefined) {
			this.calendar_data[year] = {};
		}

		if (this.calendar_data[year][week] === undefined) {
			this.calendar_data[year][week] = {};
		}

		if (this.calendar_data[year][week][day] === undefined) {
			this.calendar_data[year][week][day] = {};
		}

		this.calendar_data[year][week][day][type] = {
			"info1": info[0],
			"info2": info[1],
			"date": startJSDate
		};
	}

	this.loaded_calendars += 1;

	if (this.loaded_calendars === calendar_list.length) {
		this.controller.actualize_data();
	}
};

/* get calendar data */
MenuModel.prototype.get_calendar_data = function () {
	return this.calendar_data;
};





/** Menu View ******************************************************************
********************************************************************************
*******************************************************************************/
function MenuView() {
	this.width                 = $(window).width();
	this.height                = $(window).height();
	this.sidebar_selected      = "";
	this.sidebar_selected_ac   = "";

	this.sidebar_position      = 0;
	this.sidebar_increment     = 300;
	this.sidebar_max           = 0;

	this.calendar_data         = {};
	this.calendar_index        = [];

	this.entries_count         = 0;
	this.main_translate_offset = 0;

	this.menu_list = new Slider({div: "sidebar_table_container",
		slider: "sidebar_table", mode: Slider.SCROLL_VERTICAL});
	this.menu_bind_animations();
}

/* actualize interface */
MenuView.prototype.actualize_interface = function () {
	if (this.entries_count > 0) {
		this.sidebar_selected = "r0";
		$("#r0").css("background-color", "#FFE503");
		$("#r0> h1").css("color", "#000000");
		$("#r0> h2").css("color", "#000000");
	}
	this.sidebar_increment = this.height * 0.55;
	this.sidebar_max       = this.entries_count * this.height * 0.09;
};

MenuView.prototype.set_calendar_data = function (data) {
	this.calendar_data = data;
	var i = 0, year, week, d_text, d_number, m_text, ln1, ln2, lv1, lv2, dn1,
		dn2, dv1, dv2, is_today;

	for (year in this.calendar_data) {
		for (week in this.calendar_data[year]) {
			this.add_sidebar_item("r" + this.entries_count,
				this._get_first_month(this.calendar_data[year][week]),
				this._get_last_month(this.calendar_data[year][week]),
				this._get_first_day(this.calendar_data[year][week]),
				this._get_last_day(this.calendar_data[year][week]));

			this.calendar_index[this.entries_count] =
				this.calendar_data[year][week];
			this.entries_count++;

			for (i = 1; i <= 5; i++) {
				d_text   = days[i];
				if (this.calendar_data[year][week][i] !== undefined) {
					d_number = this._get_day(this.calendar_data[year][week][i]);
					m_text   = months[this._get_month(
						this.calendar_data[year][week][i])];
					ln1      = this._get_meal('A', 'info1',
						this.calendar_data[year][week][i]);
					ln2      = this._get_meal('A', 'info2',
						this.calendar_data[year][week][i]);
					lv1      = this._get_meal('AV', 'info1',
						this.calendar_data[year][week][i]);
					lv2      = this._get_meal('AV', 'info2',
						this.calendar_data[year][week][i]);
					dn1      = this._get_meal('J', 'info1',
						this.calendar_data[year][week][i]);
					dn2      = this._get_meal('J', 'info2',
						this.calendar_data[year][week][i]);
					dv1      = this._get_meal('JV', 'info1',
						this.calendar_data[year][week][i]);
					dv2      = this._get_meal('JV', 'info2',
						this.calendar_data[year][week][i]);
					is_today = this._is_today(
						this.calendar_data[year][week][i]);

					this.create_box_item(is_today, d_text, d_number, m_text,
						ln1, ln2, lv1, lv2, dn1, dn2, dv1, dv2);
				}
			}
			this.create_clear_box_item();
		}
	}
};

/* if meal is not defined return meal */
MenuView.prototype._get_meal = function (type, line, day) {
	if (day[type] !== undefined) {
		return day[type][line];
	} else {
		return "N/A";
	}
};

/* check if today is the day */
MenuView.prototype._is_today = function (day) {
	for (var type in day) {
		return day[type].date.toDateString() === (new Date()).toDateString();
	}
};

/* get day of month */
MenuView.prototype._get_day = function (day) {
	for (var type in day) {
		return day[type].date.getDate();
	}
};

/* get month */
MenuView.prototype._get_month = function (day) {
	for (var type in day) {
		return day[type].date.getMonth();
	}
};

/* get first month of the week */
MenuView.prototype._get_first_month = function (week) {
	var month = 11, day, type, m;
	for (day in week) {
		for (type in week[day]) {
			m = week[day][type].date.getMonth();
			if (month > m) {
				month = m;
			}
		}
	}
	return months[month];
};

/* get last month of the week */
MenuView.prototype._get_last_month = function (week) {
	var month = 0, day, type, m;
	for (day in week) {
		for (type in week[day]) {
			m = week[day][type].date.getMonth();
			if (month < m) {
				month = m;
			}
		}
	}
	return months[month];
};

/* get first day number of week */
MenuView.prototype._get_first_day = function (week) {
	var day = 1, type, day_number;
	while (week[day] === undefined && day < 6) {
		day++;
	}

	if (week[day] !== undefined) {
		for (type in week[day]) {
			day_number = week[day][type].date.getDate();
			return day_number;
		}
	}
	return "";
};

/* get last day number of week */
MenuView.prototype._get_last_day = function (week) {
	var day = 5, type, day_number;
	while (week[day] === undefined && day > 0) {
		day--;
	}

	if (week[day] !== undefined) {
		for (type in week[day]) {
			day_number = week[day][type].date.getDate();
			return day_number;
		}
	}
	return "";
};

/* add sidebar item */
MenuView.prototype.add_sidebar_item = function (id, first_month, last_month,
	begin_day, end_day) {
	var ul, li;
	ul = document.getElementById("sidebar_table");
	li = this.create_sidebar_item(id, first_month, last_month,
		begin_day, end_day);
	ul.appendChild(li);
	this.menu_register_sidebar_click("#" + id);
};

/* create sidebar item */
MenuView.prototype.create_sidebar_item = function (id, first_month,
	last_month, begin_day, end_day) {
	var li = document.createElement("li");
	li.id = id;
	li.innerHTML = "<h1> EMENTA " + first_month + "</h1> <h2>De " +
	begin_day + " a " + end_day + " de " + last_month + "</h2>";
	return li;
};


/* add box item */
MenuView.prototype.create_box_item = function (is_today, day_text,
	day_number, month, ln1, ln2, lv1, lv2, dn1, dn2, dv1, dv2) {
	var div, header, lunch, sep, dinner, box, class_name;

	div = document.getElementById("main_panel");
	header = this.create_box_header(day_text, day_number, month);
	lunch  = this.create_box_meal("Almoço", ln1, ln2, lv1, lv2);
	sep    = this.create_box_separator();
	dinner = this.create_box_meal("Jantar", dn1, dn2, dv1, dv2);
	box    = document.createElement("div");

	class_name = "";
	if (is_today) {
		class_name = "main_box main_box_today";
	} else {
		class_name = "main_box";
	}

	box.className = class_name;
	box.appendChild(header);
	box.appendChild(lunch);
	box.appendChild(sep);
	box.appendChild(dinner);
	div.appendChild(box);
};

/* add clear both div */
MenuView.prototype.create_clear_box_item = function () {
	var div, clear;
	div   = document.getElementById("main_panel");
	clear = document.createElement("div");
	clear.style.clear = "both";
	div.appendChild(clear);
};


/* create box header */
MenuView.prototype.create_box_header = function (day_text, day_number, month) {
	var div = document.createElement("div");
	div.className = "main_box_header";
	div.innerHTML = "<h1>" + day_text + "</h1> <h2>" + day_number + " " +
		month + "</h2>";
	return div;
};

/* create box header */
MenuView.prototype.create_box_separator = function () {
	var div = document.createElement("div");
	div.className = "main_box_separator";
	div.innerHTML = "<h2>~</h2>";
	return div;
};

/* create box meal */
MenuView.prototype.create_box_meal = function (header, en1, en2, ev1, ev2) {
	var div = document.createElement("div");
	div.className = "main_box_meal";
	div.innerHTML = "<h1>" + header + "</h1>" +
						"<h2>" + en1 + "</h2>    <h2>" + en2 + "</h2>" +
						"<div class=\"main_box_meal_separator\"></div>" +
						"<h2>" + ev1 + "</h2><h2>" + ev2 + "</h2>";
	return div;
};

/* actualize window dimensions */
MenuView.prototype.set_window_dimensions = function (width, height) {
	this.width = width;
	this.height = height;
	$("body").css("font-size", ((this.width * 100) / 1980) + "%");
};

/* button close animation */
MenuView.prototype.menu_main_close = function () {

    window.app.exit();	
	/*
	if ($("#main_menu").css("opacity") === 0) {
		$("#main_menu").css("opacity", "1");
	} else {
		$("#main_menu").css("opacity", "0");
	}
	*/

};


/* menu right animation */
MenuView.prototype.menu_main_right = function () {
	var translate = this.width / 2.5;
	$("#main_panel").css("-moz-transform",
		"translate(-" + translate + ",-" + this.main_translate_offset + "px)");
	$("#main_right").css("opacity", "0.2");
	$("#main_left").css("opacity", "1");
};

/* menu left animation */
MenuView.prototype.menu_main_left = function () {
	$("#main_panel").css("-moz-transform",
		"translate(0px,-" + this.main_translate_offset + "px)");
	$("#main_right").css("opacity", "1");
	$("#main_left").css("opacity", "0.2");
};

/* sidebar up animation */
MenuView.prototype.sidebar_up = function () {
	if (this.sidebar_position <= this.sidebar_increment * -1) {
		this.sidebar_position += this.sidebar_increment;
		$("#sidebar_table").css("-moz-transform",
			"translateY(" + this.sidebar_position + "px");
		if (this.sidebar_position === 0) {
			$("#sidebar_up").css("opacity", "0.2");
		}
	} else {
		$("#sidebar_up").css("opacity", "0.2");
		$("#sidebar_table").css("-moz-transform", "translateY(0px");
	}
	$("#sidebar_down").css("opacity", "1");
};

/* sidebar down animation */
MenuView.prototype.sidebar_down = function () {
	if ((this.sidebar_position * -1) <=
		(this.sidebar_max - this.sidebar_increment)) {

		this.sidebar_position -= this.sidebar_increment;
		$("#sidebar_table").css("-moz-transform",
			"translateY(" + this.sidebar_position + "px)");

	} else {

		this.sidebar_position = this.sidebar_max * -1;
		$("#sidebar_table").css("-moz-transform",
			"translateY(" + this.sidebar_position + "px)");
		$("#sidebar_down").css("opacity", "0.2");

	}
	$("#sidebar_up").css("opacity", "1");
};

/* catch a sidebar click */
MenuView.prototype.menu_sidebar_click = function (event) {
	var id, clean_id;
	id = event.currentTarget.id;

	$("#" + this.sidebar_selected).css("background-color", "transparent");
	$("#" + this.sidebar_selected + "> h1").css("color", "#FFFFFF");
	$("#" + this.sidebar_selected + "> h2").css("color", "#FFE503");
	
	$("#" + id).css("background-color", "#FFE503");
	$("#" + id + "> h1").css("color", "#000000");
	$("#" + id + "> h2").css("color", "#000000");

	clean_id = id.replace("r", "");
	this.translate_main_content(parseInt(clean_id, 10));
	this.sidebar_selected = id;

	if (this.sidebar_selected_ac.length >= 32) {
		if (this.sidebar_selected_ac === "01100110011101010110001101101011") {
			//call a fucking cool animation
		}
		this.sidebar_selected_ac = "";
	}
	this.sidebar_selected_ac += clean_id;
};

/* translate main content */
MenuView.prototype.translate_main_content = function (id) {
	this.main_translate_offset = this.height * 0.825 * id;
	$("#main_panel").css("-moz-transform", "translateY(-" +
		this.main_translate_offset + "px)");
	$("#main_right").css("opacity", "1");
	$("#main_left").css("opacity", "0.2");
};

/* register li click */
MenuView.prototype.menu_register_sidebar_click = function (id) {
	$(id).mouseup($.proxy(this.menu_sidebar_click, this));
};

/* bind animations */
MenuView.prototype.menu_bind_animations = function () {
	$("#main_close").click($.proxy(this.menu_main_close, this));
	$("#main_right").mouseup($.proxy(this.menu_main_right, this));
	$("#main_left").mouseup($.proxy(this.menu_main_left, this));
	//$("#sidebar_up").mouseup($.proxy(this.sidebar_up, this));
	//$("#sidebar_down").mouseup($.proxy(this.sidebar_down, this));
};

MenuView.prototype.error_has_happened = function () {
	window.app.ready();
	$("#main_error").css("visibility", "visible");
	$("#main_error").click($.proxy(this.menu_main_close, this));
};

Date.prototype.getWeek = function () {
	var onejan = new Date(this.getFullYear(), 0, 1);
	return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
};

/** EOF ************************************************************************
*******************************************************************************/

