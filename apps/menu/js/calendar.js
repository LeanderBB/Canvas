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
var calendar_data;

/* Loads the Google data JavaScript client library */
google.load("gdata", "2.x");

function init() {
  // init the Google data JS client library with an error handler
  google.gdata.client.init(handleGDError);
}

/**
 * Adds a leading zero to a single-digit number.  Used for displaying dates.
 */
function padNumber(num) {
  if (num <= 9) {
    return "0" + num;
  }
  return num;
}

/**
 * Determines the full calendarUrl based upon the calendarAddress
 * argument and calls loadCalendar with the calendarUrl value.
 *
 * @param {string} calendarAddress is the email-style address for the calendar
 */ 
function loadCalendarByAddress(calendarAddress) {
  var calendarUrl = 'https://www.google.com/calendar/feeds/' +
                    calendarAddress + 
                    '/public/full';
  loadCalendar(calendarUrl);
}


/**
 * Uses Google data JS client library to retrieve a calendar feed from the specified
 * URL.  The feed is controlled by several query parameters and a callback 
 * function is called to process the feed results.
 *
 * @param {string} calendarUrl is the URL for a public calendar feed
 */  
function loadCalendar(calendarUrl) {
  var service = new 
      google.gdata.calendar.CalendarService('gdata-js-client-samples-simple');
  var query = new google.gdata.calendar.CalendarEventQuery(calendarUrl);
  query.setOrderBy('starttime');
  query.setSortOrder('ascending');
  query.setFutureEvents(true);
  query.setSingleEvents(true);
  //query.setMaxResults(10);

  service.getEventsFeed(query, listEvents, handleGDError);
}

/**
 * Callback function for the Google data JS client library to call when an error
 * occurs during the retrieval of the feed.  Details available depend partly
 * on the web browser, but this shows a few basic examples. In the case of
 * a privileged environment using ClientLogin authentication, there may also
 * be an e.type attribute in some cases.
 *
 * @param {Error} e is an instance of an Error 
 */
function handleGDError(e) {
  document.getElementById('jsSourceFinal').setAttribute('style', 'display:none');
  if (e instanceof Error) {
    /* alert with the error line number, file and message */

	 //TODO: send the error to us.
    //alert('Error at line ' + e.lineNumber + ' in ' + e.fileName + '\n' + 'Message: ' + e.message);

    /* if available, output HTTP error code and status text */
    if (e.cause) {
      var status = e.cause.status;
      var statusText = e.cause.statusText;

	   //TODO: send the error to us.
      //alert('Root cause: HTTP error ' + status + ' with status text of: ' + statusText);

    }
  } else {
	 //TODO: send the error to us.
    // alert(e.toString());
  }
}

/**
 * Callback function for the Google data JS client library to call with a feed 
 * of events retrieved.
 *
 * Creates an unordered list of events in a human-readable form.  This list of
 * events is added into a div called 'events'.  The title for the calendar is
 * placed in a div called 'calendarTitle'
 *
 * @param {json} feedRoot is the root of the feed, containing all entries 
 */ 
function listEvents(feedRoot) {
  var entries = feedRoot.feed.getEntries();
  var eventDiv = document.getElementById('sidebar_table');

  if (eventDiv.childNodes.length > 0) {
    eventDiv.removeChild(eventDiv.childNodes[0]);
  }	  
  /* create a new unordered list */
  var ul = document.createElement('ul');

  /* set the calendarTitle div with the name of the calendar */
  //document.getElementById('calendarTitle').innerHTML = "Calendar: " + feedRoot.feed.title.$t;

  /* loop through each event in the feed */
  var len = entries.length;
  for (var i = 0; i < len; i++) {
    var entry = entries[i];
    var title = entry.getTitle().getText();
    var startDateTime = null;
    var startJSDate = null;
    var times = entry.getTimes();
    if (times.length > 0) {
      startDateTime = times[0].getStartTime();
      startJSDate = startDateTime.getDate();
    }
    var entryLinkHref = null;
    if (entry.getHtmlLink() != null) {
      entryLinkHref = entry.getHtmlLink().getHref();
    }

		//
//			calendar_data[startJSDate.getDay()]
		//
    var dateString = (startJSDate.getMonth() + 1) + "/" + startJSDate.getDate();
    if (!startDateTime.isDateOnly()) {
      dateString += " " + startJSDate.getHours() + ":" + 
          padNumber(startJSDate.getMinutes());
    }
    var li = document.createElement('li');

    /* if we have a link to the event, create an 'a' element */
    if (entryLinkHref != null) {
      entryLink = document.createElement('a');
      entryLink.setAttribute('href', entryLinkHref);
      entryLink.appendChild(document.createTextNode(title));
      li.appendChild(entryLink);
      li.appendChild(document.createTextNode(' - ' + dateString));
    } else {
      li.appendChild(document.createTextNode(title + ' - ' + dateString));
    }

    /* append the list item onto the unordered list */
    ul.appendChild(li);
  }
  eventDiv.appendChild(ul);
}
google.setOnLoadCallback(init);
