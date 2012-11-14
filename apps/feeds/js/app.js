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

/* ------------------------------------------------------------------ */
/* APP INITIALIZATION CODE STARTS HERE */
$("div, ul").bind(CSS3_TRANSITION_END, function(){
    $(this).removeClass("animate");
});

$("#app_close").bind("mouseup", function(){
    window.app.exit();
});
// setOnLoadCallback is a static function that registers the specified handler function
// to be called once the page containing this call loads
google.setOnLoadCallback(function(){
    window.app = new CanvasApp("feeds");
    AppNS.App.main_view = new AppNS.Views.Subscriptions();
    AppNS.App.feed_view = new AppNS.Views.Feed();
    AppNS.App.item_view = new AppNS.Views.Item();

    window.app.ready();
});

