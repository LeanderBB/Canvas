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

'use strict';
/* Toolkit.js - Classes and methods useful to be used throughout our
 * applications should be added here and use the model as seen below.
 */

/* == Resolution Calculation =============================================*/
function heightForWidth16By9(width) {
    return (9 /  16) * width;
}
/* == OOP METHODS =========================================================*/
var OOP = {};
OOP.extend = function (child, parent) {
    for (var method in parent.prototype) {
        if (child.prototype[method] === undefined) {
            child.prototype[method] = parent.prototype[method];
        }
    }
    child.prototype.constructor = child;
    child.super = parent.prototype;
};
/* == POINT 2D CLASS ======================================================*/
/** Point arithemtic abstraction */
function Point2D(x, y) {
    this.x = x;
    this.y = y;
}
/** Subtract two points and create a new one with the result*/
Point2D.subPoint = function (point1, point2) {
    return new Point2D(point1.x - point2.x, point1.y - point2.y);
};
/** Add two points and create a new one with the result*/
Point2D.addPoint = function (point1, point2) {
    return new Point2D(point1.x + point2.x, point1.y + point2.y);
};
/** Divide two points and create a new one with the result*/
Point2D.divPoint = function (point1, point2) {
    return new Point2D(point1.x / point2.x, point1.y / point2.y);
};
/** Multiply two points and create a new one with the result*/
Point2D.multPoint = function (point1, point2) {
    return new Point2D(point1.x * point2.x, point1.y * point2.y);
};
/** Subtract a points and a scalar, and create a new one with the result*/
Point2D.subScalar = function (point, value) {
    return new Point2D(point.x - value, point.y - value);
};
/** Add a points and a scalar, and create a new one with the result*/
Point2D.addScalar = function (point, value) {
    return new Point2D(point.x + value, point.y + value);
};
/** Divide a points and a scalar, and create a new one with the result*/
Point2D.divScalar = function (point, value) {
    return new Point2D(point.x / value, point.y / value);
};
/** Multiply a points and a scalar, and create a new one with the result*/
Point2D.multScalar = function (point, value) {
    return new Point2D(point.x * value, point.y * value);
};
/** Subtract a points and a scalar, and create a new one with the result*/
Point2D.subScalarXY = function (point, x, y) {
    return new Point2D(point.x - x, point.y - y);
};
/** Add a points and a scalar, and create a new one with the result*/
Point2D.addScalarXY = function (point, x, y) {
    return new Point2D(point.x + x, point.y + y);
};
/** Divide a points and a scalar, and create a new one with the result*/
Point2D.divScalarXY = function (point, x, y) {
    return new Point2D(point.x / x, point.y / y);
};
/** Multiply a points and a scalar, and create a new one with the result*/
Point2D.multScalarXY = function (point, x, y) {
    return new Point2D(point.x * x, point.y * y);
};

/** Subtract the value of a point to self*/
Point2D.prototype.subPoint = function (point) {
    this.x -= point.x;
    this.y -= point.y;
};
/** Add the value of a point to self*/
Point2D.prototype.addPoint = function (point) {
    this.x += point.x;
    this.y += point.y;
};
/** Divide the value of a point to self*/
Point2D.prototype.divPoint = function (point) {
    this.x /= point.x;
    this.y /= point.y;
};
/** Multiply the value of a point to self*/
Point2D.prototype.multPoint = function (point) {
    this.x *= point.x;
    this.y *= point.y;
};
/** Subtract the value of a scalar to self*/
Point2D.prototype.subScalar = function (value) {
    this.x -= value;
    this.y -= value;
};
/** Add the value of a scalar to self*/
Point2D.prototype.addScalar = function (value) {
    this.x += value;
    this.y += value;
};
/** Divide the value of a scalar to self*/
Point2D.prototype.divScalar = function (value) {
    this.x /= value;
    this.y /= value;
};
/** Multiply the value of a scalar to self*/
Point2D.prototype.multScalar = function (value) {
    this.x *= value;
    this.y *= value;
};

/** Subtract the value of a scalar to self*/
Point2D.prototype.subScalarXY = function (x, y) {
    this.x -= x;
    this.y -= y;
};
/** Add the value of a scalar to self*/
Point2D.prototype.addScalarXY = function (x, y) {
    this.x += x;
    this.y += y;
};
/** Divide the value of a scalar to self*/
Point2D.prototype.divScalarXY = function (x, y) {
    this.x /= x;
    this.y /= y;
};
/** Multiply the value of a scalar to self*/
Point2D.prototype.multScalarXY = function (x, y) {
    this.x *= x;
    this.y *= y;
};


/** Limit the points values in a certain range defined by two point.
  @param point_begin Lower limit.
  @param point_end Upper limit.
 */
Point2D.prototype.limitPoint = function (point_begin, point_end) {
    if (this.y > point_end.y) {
        this.y = point_end.y;
    } else if (this.y < point_begin.y) {
        this.y = point_begin.y;
    }
    if (this.x > point_end.x) {
        this.x = point_end.x;
    } else if (this.x < point_begin.x) {
        this.x = point_begin.x;
    }
};
/** Set the value from another Point2D*/
Point2D.prototype.setPoint = function (point) {
    this.x = point.x;
    this.y = point.y;
};
/**Set the value from scalar values */
Point2D.prototype.setScalar = function (x, y) {
    this.x = x;
    this.y = y;
};
/** Return a copy of the current Point2D */
Point2D.prototype.clone = function () {
    return new Point2D(this.x, this.y);
};
/* == EVENT CLASS =======================================================*/
/**
  Create the event object
 */
function Event() {
    this.listeners = [];
}

/** Add a new event listener
  @param handle Callback function
 */
Event.prototype.addListener = function (context, handle) {
    this.listeners.push([context, handle]);
};


/** Remove all event listeners */
Event.prototype.RemoveAllListeners = function () {
    delete this.listeners;
    this.listeners = [];
};
/** Remove an event listener
  @param handle Callback function.
 */
Event.prototype.removeListener = function (handle) {
    var listeners = this.listeners, i;
    for (i = 0; i < listeners.length; ++i) {
        if (listeners[i][0] === handle) {
            listeners.splice(i, 1);
            break;
        }
    }
};
/**
  Trigger the event.
  @param args Arguments for the listeners
 */
Event.prototype.trigger = function (args) {
    var listeners = this.listeners, i;
    for (i = 0; i < listeners.length; ++i) {
    //try {
        listeners[i][1].call(listeners[i][0], args);
        /*} catch(ex) {
          console.log('[ERR] Event "' + listeners[i][1].toString() +
          '" with message: "' + ex.message + '"');
          }*/
    }
};

/* == SLIDER CLASS ======================================================*/
/**
    Add kinetic slide options to a div.
    @param options Associative array:
        div: Slider container div, either the id as string or the Dom Element.
        [REQUIRED]
        slider: Container that will be moved inside the outer contaier.
        [OPTIONAL] If no slider is specified, an empty div shall be created.
        mode: Slider mode, SCROLL_HORIZONTAL, SCROLL_VERTICAL or SCROLL_BOTH.
        [OPTIONAL]By default SCROLL_VERIICAL is used.

    @event EvtScroll Event fired each time the scroll bar moves.
 */
function Slider(options) {
    if (typeof(options.div) !== 'string') {
        this.div = options.div;
    } else {
        this.div = document.getElementById(options.div);
    }

    if (options.slider === undefined) {
        this.slider = document.createElement("div");
        this.div.appendChild(this.slider);
    } else {
        this.slider = document.getElementById(options.slider);
    }
    this.slider.style.minWidth = "100%";
    this.slider.style.minHeight = "100%";
    this.slider.style.MozTransition = "-moz-transform 0.5s ease-out";
    if (options.mode !== undefined) {
        this.mode = new Point2D(options.mode & Slider.SCROLL_HORIZONTAL,
                options.mode & Slider.SCROLL_VERTICAL ? 1 : 0);
    } else {
        this.mode = new Point2D(0, 1);
    }
    if (this.mode.x) {
        this.slider.style.whiteSpace = "nowrap";
        this.slider.style.cssFloat = "left";
        this.slider.style.clear = "left";
    }
    this.current_offset = new Point2D(0, 0);
    //kinetic data
    this.last_points = [];
    this.last_time = [];
    this.max_sampling = 5;
    //scroll event
    this.EvtScroll = new Event();

    var that = this;
    this.handleMouseDown = function (evt_down) {
        // start point collecting
        that.slider.style.MozTransition = undefined;
        that.last_points = [new Point2D(evt_down.clientX, evt_down.clientY)];
        that.last_time = [new Date().getTime()];
        //evt_down.stopPropagation();
        evt_down.preventDefault();
        that.div.addEventListener("mousemove", handleMouseMove, true);
        that.div.addEventListener("mouseup", handleMouseUp, true);

        var delta = 0, ismoving = false;
        function handleMouseMove(evt_move) {
            ismoving = true;
            evt_move.stopPropagation();
            evt_move.preventDefault();
            if (that.last_points.length > 1) {
                ismoving = true;
            }
            var cur_point = new Point2D(evt_move.clientX, evt_move.clientY);
            // move slider
            delta = Point2D.subPoint(cur_point,
                that.last_points[that.last_points.length - 1]);
            that.current_offset.addPoint(delta);
            that._update();
            // add current point to point list
            that.last_points.push(cur_point);
            that.last_time.push(new Date().getTime());
            // check if we are sill in the maximum allowed limit
            if (that.last_points.length >= that.max_sampling) {
                that.last_points.shift();
                that.last_time.shift();
            }
        }

        function handleMouseUp(evt_up) {
            if (ismoving) {
                evt_up.preventDefault();
                evt_up.stopPropagation();
            }
            // check boundries
            var slide_limit, first_point, first_time, cur_point, diff_time,
                velocity, diff_point;
            slide_limit = that._getLimit();
            // final adjustments
            first_point = that.last_points[0];
            first_time = that.last_time[0];
            cur_point = new Point2D(evt_up.clientX, evt_up.clientY);
            diff_point = Point2D.subPoint(cur_point, first_point);
            diff_time = (new Date().getTime() - first_time) / 1000;
            velocity = Point2D.divScalar(diff_point, diff_time);
            that.current_offset.addPoint(velocity);
            // check boundries
            that.current_offset.limitPoint(slide_limit, new Point2D(0, 0));
            that.slider.style.MozTransition = "-moz-transform 0.5s ease-out";
            that._update();
            that.div.removeEventListener("mousemove", handleMouseMove, true);
            that.div.removeEventListener("mouseup", handleMouseUp, true);
        }

    };
    if (options.disable_events === undefined) {
        this.div.addEventListener("mousedown", this.handleMouseDown, true);
    }
}

/*[INTERNAL] update the position of the slider */
Slider.prototype._update = function () {
    this.EvtScroll.trigger(Point2D.multScalar(this.current_offset, -1));
    this.slider.style.MozTransform = "translate(" + (this.current_offset.x *
                this.mode.x) + "px," +
                (this.current_offset.y * this.mode.y) + "px)";
};
/* [INTERNAL] get slider's limit, made a function to account on the fly
    updates. could be optimized */
Slider.prototype._getLimit = function () {
    return new Point2D(-(this.slider.offsetWidth - this.div.offsetWidth),
            - (this.slider.offsetHeight - this.div.offsetHeight));
};
/** Get the data container.*/
Slider.prototype.getView = function () {
    return this.slider;
};
/** Clear the data container and reset the slider */
Slider.prototype.clear = function () {
    while (this.slider.hasChildNodes()) {
        this.slider.removeChild(this.slider.lastChild);
    }
    this.current_offset.setScalar(0, 0);
};
/** Scroll to the an offset defined defined by a point */
Slider.prototype.setScrollPoint = function (point) {
    point.multScalar(-1);
    this.current_offset.setPoint(point);
    this.current_offset.limitPoint(this._getLimit(), new Point2D(0, 0));
    this._update();
};
/** Scroll to the an offset defined by scalars */
Slider.prototype.setScrollScalar = function (x, y) {
    this.current_offset.setScalar(x * -1, y * -1);
    this.current_offset.limitPoint(this._getLimit(), new Point2D(0, 0));
    this._update();
};
/** Scroll to percentage */
Slider.prototype.scrollToPercentage = function (x, y) {
    var limit = this._getLimit();
    this.current_offset.setPoint(Point2D.multScalarXY(limit, x, y));
    this.current_offset.limitPoint(limit, new Point2D(0, 0));
    this._update();
};

/** Scroll to percentage */
Slider.prototype.setScrollPercentage = function (x, y) {
    var limit = this._getLimit();
    this.current_offset.setPoint(Point2D.multScalarXY(limit, x, y));
    this.current_offset.limitPoint(limit, new Point2D(0, 0));
    this._update();
};

/** Return the current scroll offset with scalar values */
Slider.prototype.getScrollScalar = function () {
    var res = this.current_offset.clone();
    res.multScalar(-1);
    return res;
};

/** Return the curren scroll offset in percentage */
Slider.prototype.getScrollPercentage = function () {
    return Point2D.divPoint(this.current_offset, this._getLimit());
};

/** Whether the slider can scroll or not. In other words, the content exceeds
  the viewing area */
Slider.prototype.isSlidable = function () {
    return (this.slider.offsetWidth > this.div.offsetWidth && this.mode.x) ||
        (this.slider.offsetHeight > this.div.offsetHeight && this.mode.y);
};



Slider.SCROLL_HORIZONTAL = 0x01;
Slider.SCROLL_VERTICAL = 0x02;
Slider.SCROLL_BOTH = 0x03;
