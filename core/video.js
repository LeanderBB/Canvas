'use strict';

/**
    Create a Video Player
    @params args Associative arary with options:
        div: Container where to load the video player, string id or
        dom element.[REQUIRED]
       
    @events:
        EvtReady - Fired when the video is ready to play, no data.
        EvtError - Fired when an error occurs.
        EvtEndend - Fired when the video reached the end.
*/
function VideoPlayer(options) {
    var that = this;
    this.video = document.createElement("video");
    this.video.addEventListener("mouseup", function () {
        if (that.isPlaying()) {
            that.pause();
        } else {
            that.play();
        }
    }, true);
    this.video.preload = "metadata";
    this.state = VideoPlayer.NO_SOURCE;
    this.EvtReady = new Event();
    this.EvtError = new Event();
    this.EvtEnded = new Event();
    this.EvtStateChange = new Event();
    // register video events
    function onPause(e) {
        that.pause();
    }
    function onLoadedMetadata(e) {
        that.state = VideoPlayer.READY | VideoPlayer.PAUSED;
        that.EvtStateChange.trigger(that.state);
        that.view.setProgress(0);
        that.EvtReady.trigger();
    }
    function onVideoEnd(e) {
        that.state |= VideoPlayer.ENDED;
        that.pause();
        that.EvtEnded.trigger();
        that.view.setProgress(0);
        that.video.currentTime = 0;
    }
    function onTimeUpdate(e) {
        var progress = parseInt(that.video.currentTime /
            that.video.duration * 100, 10);
        that.view.setProgress(progress, that.video.currentTime);
    }
    function onBuffering(e) {
        if (that.video.buffered.length !== 0) {
            if (that.video.currentTime >= that.video.buffered.end(0)) {
                that.state |= VideoPlayer.BUFFERING;
            } else {
                that.state &= ~VideoPlayer.BUFFERING;

            }
            that.EvtStateChange.trigger(that.state);
        }
    }

    function onError(e) {
        that.state = (that.state & ~VideoPlayer.READY) | VideoPlayer.ERROR;
        that.EvtStateChange.trigger(that.state);
        that.EvtError.trigger();
    }
    this.video.addEventListener('loadedmetadata', onLoadedMetadata, false);
    this.video.addEventListener('ended', onVideoEnd, false);
    this.video.addEventListener('timeupdate', onTimeUpdate, false);
    this.video.addEventListener('progress', onBuffering, false);
    this.video.addEventListener('pause', onPause, false);
    this.video.addEventListener('error', onError, false);
    this.view = new VideoPlayer.View(this, options);

}
/**
    Load a video
    @param url Video URL
    @param poster_url Video poster URL, use "" for none.
*/
VideoPlayer.prototype.setSource = function (url, poster_url) {
    this.state = VideoPlayer.LOADING;
    this.EvtStateChange.trigger(this.state);
    this.video.src = url;
    this.video.poster = poster_url;
    this.video.load();
};
/**
    Get the current time in the video in seconds.
*/
VideoPlayer.prototype.getElapsedTime = function () {
    if (this.state & VideoPlayer.READY) {
        return this.video.currentTime;
    }
};
/**
    Set the current time in the video.
    @parm time Time in seconds.
*/
VideoPlayer.prototype.setElapsedTime = function (time) {
    if (this.state & VideoPlayer.READY) {
        return this.video.currentTime = time;
    }

};
/**
    Set the current time in video.
    @param percentage Percentage of completion [0 - 1]
*/
VideoPlayer.prototype.setElapsedPercentage = function (percentage) {
    if (this.state & VideoPlayer.READY) {
        this.video.currentTime = this.video.duration * percentage;
    }
};
/**
    Get the duration of the video.
*/
VideoPlayer.prototype.getDuration = function () {
    if (this.state & VideoPlayer.READY) {
        return this.video.duration;
    }
};
/**
    Pause the video.
*/
VideoPlayer.prototype.pause = function () {
    if (this.state & VideoPlayer.PLAYING && this.state & VideoPlayer.READY) {
        this.video.pause();
        this.state = (this.state & ~VideoPlayer.PLAYING) | VideoPlayer.PAUSED;
        this.EvtStateChange.trigger(this.state);
    }
};

/**
    Play the video.
*/
VideoPlayer.prototype.play = function () {
    if (this.state & VideoPlayer.PAUSED && this.state & VideoPlayer.READY) {
        this.video.play();
        this.state = (this.state &
            ~(VideoPlayer.PAUSED | VideoPlayer.BUFFERING | VideoPlayer.ENDED))
            |VideoPlayer.PLAYING;
        this.EvtStateChange.trigger(this.state);
    }
};
/**
    Check whether the video is playing.
*/
VideoPlayer.prototype.isPlaying = function () {
    return this.state & VideoPlayer.PLAYING;
};
/**
    Get the video state flag.
*/
VideoPlayer.prototype.getState = function () {
    return this.state;
};

/** VideoPlayer States */
VideoPlayer.NO_SOURCE = 0x00;
VideoPlayer.LOADING = 0x01;
VideoPlayer.READY = 0x02;
VideoPlayer.ERROR = 0x04;
VideoPlayer.PLAYING = 0x08;
VideoPlayer.PAUSED = 0x10;
VideoPlayer.SEEKING = 0x20;
VideoPlayer.BUFFERING = 0x40;
VideoPlayer.ENDED = 0x80;

// ### VIEW ###################################
VideoPlayer.View = function (controller, options) {
    this.controller = controller;
    if (typeof(options.div) !== 'string') {
        this.container = options.div;
    } else {
        this.container = document.getElementById(options.div);
    }
    this.container.classList.add("c3_video_container");
    this.ui_elements = 0;
    this._setupInterface();
    this.controller.EvtStateChange.addListener(this, this._handleStateChange);
};

VideoPlayer.View.prototype._setupInterface = function () {
    var that = this;
    this.controls = document.createElement("div");
    this.controls.classList.add("c3_video_controls");
    this.bt_play = new VideoPlayer.View.BarButton({
            "style": "c3_video_play",
            "mouseup": function () {
                if (that.controller.isPlaying()) {
                    that.controller.pause();
                } else {
                    that.controller.play();
                }
            }
        });
    this.bt_progress = new VideoPlayer.View.Progress({
            "style": "c3_video_progress",
            "mouseup": function (progress) {
                that.controller.setElapsedPercentage(progress);
            }
        });
    this.bt_main = new VideoPlayer.View.MainButton(
        {
        "mouseup": function () {
            if (that.controller.isPlaying()) {
                that.controller.pause();
            } else {
                that.controller.play();
            }
        }
    });
    this.bt_duration = new VideoPlayer.View.Label({"text": "00:00:00"});
    this.bt_play.hide();
    this.container.appendChild(this.controller.video);
    this.controls.appendChild(this.bt_play.div);
    this.controls.appendChild(this.bt_progress.div);
    this.controls.appendChild(this.bt_duration.div);
    this.container.appendChild(this.controls);
    this.container.appendChild(this.bt_main.div);
};

VideoPlayer.View.prototype._handleStateChange = function (state) {
    if (state & VideoPlayer.ERROR) {
        this.bt_main.setStateError();
        this.bt_main.show();
        return;
    }

    
    if (state & VideoPlayer.LOADING) {
        this.bt_progress.setProgress(0);
        this.bt_main.setStateLoad();
        this.bt_play.setDisabled(true);
        this.bt_main.show();
    }

    if (state & VideoPlayer.READY) {
        this.bt_play.setDisabled(false);
        this.bt_main.setStatePlay();
    } else if (state & VideoPlayer.ERROR) {
        this.bt_main.show();
        this.bt_main.setStateError();
    }

    if (state & VideoPlayer.PLAYING) {
        this.bt_main.hide();
    }
    if (state & VideoPlayer.PAUSED && this.controller.getElapsedTime() !== 0) {
        if (state & VideoPlayer.BUFFERING) {
            this.bt_main.setStateLoad();
        } else {
            this.bt_main.setStatePlay();
        }
        this.bt_main.show();
    }

    
    if (state & VideoPlayer.ENDED) {
        this.bt_main.setStatePlay();
        this.bt_main.show();
    }
};

VideoPlayer.View.prototype.setProgress = function (progress, time) {
    this.bt_progress.setProgress(progress);
    if (time === undefined) {
        this.bt_duration.setText("00:00:00");
    } else {
        var seconds, minutes, hours;
        seconds = Math.floor(time % 60);
        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        minutes = Math.floor(time / 60);
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        hours = Math.floor(time / 60);

        if (hours < 10) {
            hours = "0" + hours;
        }
        this.bt_duration.setText(hours + ":" + minutes + ":" + seconds);
    }
};

VideoPlayer.View.UIElement = function (args) {
    this.div = document.createElement("div");
    if (args.style !== undefined) {
        this.div.classList.add(args.style);
    }
    this.disabled = false;
};

VideoPlayer.View.UIElement.prototype.isDisabled = function () {
    return this.disabled;
};
VideoPlayer.View.UIElement.prototype.setDisabled = function (state) {
    this.disabled = state;
};

VideoPlayer.View.UIElement.prototype.appendToDiv = function (dom_div) {
    dom_div.appendChild(this.div);
};


VideoPlayer.View.UIElement.prototype.hide = function () {
    this.div.style.MozTransition = "opacity 0.5s linear 0s, \
        visibility 0s linear 0.5s";
    this.div.style.opacity = 0;
    this.div.style.visibility = "hidden";
};

VideoPlayer.View.UIElement.prototype.show = function () {
    this.div.style.MozTransition = "opacity 0.5s linear 0s, \
        visibility 0s linear 0s";
    this.div.style.opacity = 1;
    this.div.style.visibility = "visible";
};

VideoPlayer.View.Button = function (args) {
    VideoPlayer.View.Button.super.constructor.call(this, args);
    this.div.classList.add("c3_video_icon_bg");
    if (args.mouseup !== undefined) {
        (function (disabled, callback, bt) {
            bt.onmouseup = function () {
                if (!disabled) {
                    callback();
                }
            };
        } (this.disabled, args.mouseup, this.div));
    }
};

OOP.extend(VideoPlayer.View.Button, VideoPlayer.View.UIElement);

VideoPlayer.View.BarButton = function (args) {
    VideoPlayer.View.BarButton.super.constructor.call(this, args);
    this.div.classList.add("c3_video_button");
};

OOP.extend(VideoPlayer.View.BarButton, VideoPlayer.View.Button);

VideoPlayer.View.Progress = function (args) {
    VideoPlayer.View.Progress.super.constructor.call(this, args);
    this.inner = document.createElement("div");
    this.div.appendChild(this.inner);
    var that = this;
    this.div.onmouseup = function (e) {
        var delta = e.clientX - that.div.getBoundingClientRect().left,
        progress = (delta / this.offsetWidth);
        if (args.mouseup !== undefined) {
            args.mouseup(progress);
        }
    };
};

VideoPlayer.View.Progress.prototype.setProgress = function (percentage) {
    this.inner.style.width = percentage + "%";
};

OOP.extend(VideoPlayer.View.Progress, VideoPlayer.View.UIElement);

VideoPlayer.View.MainButton = function (args) {
    VideoPlayer.View.MainButton.super.constructor.call(this, args);
    this.div.classList.add("c3_video_main_icon");
    this.div.classList.add("c3_video_icon_main_play");
};

VideoPlayer.View.MainButton.prototype.setStatePlay = function () {
    this.div.classList.remove("c3_video_icon_main_load");
    this.div.classList.remove("c3_video_icon_main_error");
    this.div.classList.add("c3_video_icon_main_play");
    this.setDisabled(false);
};

VideoPlayer.View.MainButton.prototype.setStateLoad = function () {
    this.div.classList.add("c3_video_icon_main_load");
    this.div.classList.remove("c3_video_icon_main_error");
    this.div.classList.remove("c3_video_icon_main_play");
    this.setDisabled(true);
};

VideoPlayer.View.MainButton.prototype.setStateError = function () {
    this.div.classList.remove("c3_video_icon_main_load");
    this.div.classList.remove("c3_video_icon_main_play");
    this.div.classList.add("c3_video_icon_main_error");
    this.setDisabled(true);
};

OOP.extend(VideoPlayer.View.MainButton, VideoPlayer.View.Button);



VideoPlayer.View.Label = function (args) {
    VideoPlayer.View.Label.super.constructor.call(this, args);
    this.div.classList.add("c3_video_duration");
    this.text = document.createElement("h1");
    this.div.appendChild(this.text);
    this.text.innerHTML = args.text || "";
};

VideoPlayer.View.Label.prototype.setText = function (text) {
    this.text.innerHTML = text;
};

OOP.extend(VideoPlayer.View.Label, VideoPlayer.View.UIElement);


