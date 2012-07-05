window.onload = function(){
    window.vid = new VideoPlayer({div:"vdc"});
    //vid.setSource("trailer.ogv","");
    vid.setSource("http://media.w3.org/2010/05/sintel/trailer.ogv","http://media.w3.org/2010/05/sintel/poster.png");
}

function VideoPlayer(options){
    var that = this;
    this.video = document.createElement("video");
    this.video.addEventListener("mouseup",function(){
        if (that.isPlaying()){
            that.pause();
        } else {
            that.play();
        }
    },true);
    this.video.preload="metadata";
    this.state = VideoPlayer.NO_SOURCE;
    this.callbacks = {
        "ready": options.fn_ready || null, 
        "error": options.fn_error || null,
        "ended": options.fn_ended || null,
    }

    //this.callbacks.ready=function(){alert("vid:ready");};
    //this.callbacks.error=function(){alert("vid:error");};
   // this.callbacks.ended=function(){alert("vid:ended");};
    this.EvtStateChange = new Event();
    // register video events
    this.video.addEventListener('loadedmetadata', onLoadedMetadata, false);
    this.video.addEventListener('ended', onVideoEnd, false);
    this.video.addEventListener('timeupdate', onTimeUpdate, false);
    this.video.addEventListener('progress', onBuffering, false);
    this.video.addEventListener('pause',onPause, false);
    this.view = new VideoPlayer.View(this,options);

    function onPause(e){
        that.pause();
    }
    function onLoadedMetadata(e)
    {
        //that.video.removeEventListener('loadedmetadata', onLoadedMetadata);
        that.state = VideoPlayer.READY | VideoPlayer.PAUSED; 
        that.EvtStateChange.trigger(that.state);
        that.view.setProgress(0);
        if (that.callbacks.ready != null){
            that.callbacks.ready();
        }
    }
    function onVideoEnd(e)
    {
        that.state |= VideoPlayer.ENDED;
        that.pause();
        if (that.callbacks.ended != null){
            that.callbacks.ended();
        }
        that.view.setProgress(0);
        that.video.currentTime = 0;
        // that.atTheEnd = true;
        // if(typeof(that.view.videoEnded) === 'function')
        //   that.view.videoEnded();
    }
    function onTimeUpdate(e)
    {
        var progress = parseInt(that.video.currentTime / that.video.duration * 100);
        that.view.setProgress(progress,that.video.currentTime);
    }
    function onBuffering(e)
    {
        if( that.video.buffered.length != 0){
            if( that.video.currentTime >= that.video.buffered.end(0)){
                that.state |= VideoPlayer.BUFFERING;
            }else{
                that.state &= ~VideoPlayer.BUFFERING;

            }
            that.EvtStateChange.trigger(that.state);
        }
    }

}

VideoPlayer.prototype.setSource = function(url,poster_url){
    this.state = VideoPlayer.LOADING;
    this.EvtStateChange.trigger(this.state);
    this.video.src = url;
    this.video.poster = poster_url; 
    this.video.load();
}

VideoPlayer.prototype.getElapsedTime = function(){
    if (this.state & VideoPlayer.READY) {
        return this.video.currentTime;
    }
}

VideoPlayer.prototype.setElapsedTime = function(time){
    if (this.state & VideoPlayer.READY) {
        return this.video.currentTime = time;
    }

}

VideoPlayer.prototype.setElapsedPercentage = function(percentage){
    if (this.state & VideoPlayer.READY) {
        this.video.currentTime = this.video.duration * percentage;
    }
}

VideoPlayer.prototype.getDuration = function(){
    if (this.state & VideoPlayer.READY) {
        return this.video.duration;
    }
}

VideoPlayer.prototype.pause = function(){
    if (this.state & (VideoPlayer.PLAYING | VideoPlayer.READY )) {
        this.video.pause();
        this.state = (this.state & ~VideoPlayer.PLAYING) | VideoPlayer.PAUSED;
        this.EvtStateChange.trigger(this.state);
    }
}

VideoPlayer.prototype.play = function(){
    if (this.state & (VideoPlayer.PAUSED | VideoPlayer.READY )) {
        this.video.play();
        this.state = (this.state &  ~(VideoPlayer.PAUSED | VideoPlayer.BUFFERING 
                    | VideoPlayer.ENDED))| VideoPlayer.PLAYING;
        this.EvtStateChange.trigger(this.state);
    }
}
VideoPlayer.prototype.isPlaying = function(){
    return this.state & VideoPlayer.PLAYING;
}
VideoPlayer.prototype.getState = function(){
    return this.state;
}

/** VideoPlayer States */
VideoPlayer.NO_SOURCE = 0x00;
VideoPlayer.LOADING = 0x01
VideoPlayer.READY = 0x02;
VideoPlayer.ERROR = 0x04;
VideoPlayer.PLAYING = 0x08;
VideoPlayer.PAUSED = 0x10;
VideoPlayer.SEEKING = 0x20;
VideoPlayer.BUFFERING = 0x40;
VideoPlayer.ENDED = 0x80;

// ### VIEW ###################################
VideoPlayer.View = function(controller,options){
    this.controller = controller;
    this.container = document.getElementById(options.div);
    this.ui_elements = 0;
    this._setupInterface();
    this.controller.EvtStateChange.addListener(this,this._handleStateChange);
}

VideoPlayer.View.prototype._setupInterface = function(){
    var that = this;
    this.controls = document.createElement("div");
    this.controls.classList.add("c3_video_controls");
    this.bt_play = new VideoPlayer.View.Button({
            "style": "c3_video_play",
            "callback": function(){
            if(that.controller.isPlaying()){
            that.controller.pause();
            }else{
            that.controller.play();
            }
            }
            });
    this.bt_progress = new VideoPlayer.View.Progress({
            "style": "c3_video_progress",
            "callback":function(progress){
                that.controller.setElapsedPercentage(progress);
            }
            });
    this.bt_main = new VideoPlayer.View.MainButton({});
    this.bt_duration = new VideoPlayer.View.Label({"text":"00:00:00"});
    this.bt_play.hide();
    this.container.appendChild(this.controller.video);
    this.controls.appendChild(this.bt_play.div);
    this.controls.appendChild(this.bt_progress.div);
    this.controls.appendChild(this.bt_duration.div);
    this.container.appendChild(this.controls);
    this.container.appendChild(this.bt_main.div);
}

VideoPlayer.View.prototype._handleStateChange = function(state){
    if (state & VideoPlayer.LOADING){
        this.bt_progress.setProgress(0);
        this.bt_main.setLoadState();
        this.bt_play.setDisabled(true);
        this.bt_main.show();
        return;
    }

    if(state & VideoPlayer.READY){
        this.bt_play.setDisabled(false);
        this.bt_main.setPlayState();
    }else if(state & VideoPlayer.ERROR) {
        this.bt_play.setDisabled(true);
        this.bt_main.show(); 
        //TODO: show error diag
    }

    if(state & VideoPlayer.PLAYING) {
        this.bt_main.hide();        
    }
    if(state & VideoPlayer.PAUSED && !this.controller.getElapsedTime() == 0) {
        if ( state & VideoPlayer.BUFFERING){
            this.bt_main.setLoadState();
        } else {
            this.bt_main.setPlayState();
        }
        this.bt_main.show();
    }

    if( state & VideoPlayer.ENDED) {
        this.bt_main.setPlayState();
        this.bt_main.show();
    }
}   

VideoPlayer.View.prototype.setProgress = function(progress,time){
    this.bt_progress.setProgress(progress);
    if( time == undefined){
        this.bt_duration.setText("00:00:00");
    }else{
        var seconds = Math.floor(time%60);
        if( seconds < 10){
            seconds= "0" + seconds;
        }
        var minutes = Math.floor(time/60);
        if( minutes < 10 ){
            minutes = "0" + minutes;
        }
        var hours = Math.floor(time/60);

        if ( hours < 10 ){
            hours = "0" + hours;
        }
        this.bt_duration.setText(hours+":"+minutes+":"+seconds);
    }
}

VideoPlayer.View.Button = function(args){
    this.div = document.createElement("div");
    this.div.classList.add(args.style);
    this.div.classList.add("c3_video_icon_bg");
    this.div.classList.add("c3_video_button");
    this.is_disabled = false;
    (function(disabled,callback,bt){
     bt.onmouseup = function(){
     if(!disabled){
     callback();
     }
     }
     })(this.disabled,args.callback,this.div);

}

VideoPlayer.View.Button.prototype.setDisabled = function (disabled){
    this.is_disabled = disabled;
}

VideoPlayer.View.Button.prototype.hide = function(){
    this.div.style.MozTransition = "opacity 0.5s linear 0s, visibility 0s linear 0.5s";
    this.div.style.opacity = 0;
    this.div.style.visibility = "hidden";
}

VideoPlayer.View.Button.prototype.show = function(){
    this.div.style.MozTransition = "opacity 0.5s linear 0s, visibility 0s linear 0s";
    this.div.style.opacity = 1;
    this.div.style.visibility = "visible";
}

VideoPlayer.View.Progress = function(args){
    var that = this;
    this.div = document.createElement("div");
    this.inner = document.createElement("div");
    this.div.classList.add(args.style);
    this.div.appendChild(this.inner);
    this.div.onmouseup = function(e){
       var delta = e.clientX - that.div.offsetLeft;
       var progress = (delta / this.offsetWidth);
       if(args.callback != undefined){args.callback(progress)};
    }
}

VideoPlayer.View.Progress.prototype.setProgress = function(percentage){
    this.inner.style.width= percentage+"%";
}

VideoPlayer.View.MainButton = function(args){
    this.div = document.createElement("div");
    this.div.classList.add("c3_video_icon_bg");
    this.div.classList.add("c3_video_main_icon");
    this.div.classList.add("c3_video_icon_main_play");
}

VideoPlayer.View.MainButton.prototype.setPlayState = function(){
    this.div.classList.remove("c3_video_icon_main_load");
    this.div.classList.add("c3_video_icon_main_play");
}

VideoPlayer.View.MainButton.prototype.setLoadState = function(){
    this.div.classList.add("c3_video_icon_main_load");
    this.div.classList.remove("c3_video_icon_main_play");
}

VideoPlayer.View.MainButton.prototype.hide = function(){
    this.div.style.MozTransition = "opacity 0.5s linear 0s, visibility 0s linear 0.5s";
    this.div.style.opacity = 0;
    this.div.style.visibility = "hidden";
}

VideoPlayer.View.MainButton.prototype.show = function(){
    this.div.style.MozTransition = "opacity 0.5s linear 0s, visibility 0s linear 0s";
    this.div.style.opacity = 1;
    this.div.style.visibility = "visible";
}

VideoPlayer.View.Label = function(args) {
    this.div = document.createElement("div");
    this.div.classList.add("c3_video_duration");
    this.div.innerHTML = args.text || "";
}

VideoPlayer.View.Label.prototype.setText = function(text){
    this.div.innerHTML = text;
}
