(function (root, factory) {

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery', 'neutrino'], function ($) {
            // Also create a global in case some scripts
            // that are loaded still are looking for
            // a global even when an AMD loader is in use.
            return (root.YoutubePlayer = factory($));
        });
    } else {
        // Browser globals
        root.YoutubePlayer = factory(root.jQuery);
    }
}(this, function ($) {
    'use strict';

    window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame    ||
              function( callback ){
                window.setTimeout(callback, 1000 / 60);
              };
    })();

    var NUM_SLIDES = 3;

    var youtubeLoaded = $.Deferred();
    window.onYouTubePlayerAPIReady = function() {
        youtubeLoaded.resolve();
    };/**/
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    var YoutubePlayer = function(el, opt) {
        this.opt = {
            width: 896,
            height: 504,
            videos: [], //{id:"",img:"",title:"",desc:""}
            onReady: function(){},
            onStateChange: function(){},
            playerVars: {
                'modestBranding': 1,
                'theme': 'light',
                'color': 'white',
                'autoplay': 1,
                'showinfo': 0,
                'rel': 0,
                'autohide': 1,
                'videoId':'',
                'preneutrino': null,
                'customControls': null,
                /*
                {
                    muteButton: null,
                    volumeControl: null,
                    playPauseOverlay: null,
                    smallPlayPauseButton: null,
                    playPauseButton: null,
                    progressBar: null,
                    timeLeft: null
                }
                */
                'controls':2
            }
        };
        var _self = this;
        youtubeLoaded.done(function() {
            _self.init(el,opt);
        });
        this.youtubeLoaded = youtubeLoaded;
    };

    YoutubePlayer.prototype = {
        init: function(el, opt) {
            this.el = $(el);
            this.id = this.el.attr("id") || "ytp_"+ new Date().getTime();
            this.el.attr("id", this.id);
            this.el.addClass("ytp");
            this.opt = $.extend({},this.opt,opt);

            this.hasPlaylist = false;

            this.prevideo = this.el;
            var _self = this;

            if(this.opt.customControls != null){
                this.opt.playerVars.controls = 0;
            }

            if (this.el.attr('data-xml')) {
                this.hasPlaylist = true;
                var def = $.ajax({
                    type: "GET",
                    url: this.el.attr('data-xml'),
                    dataType: "xml"
                });

                var _self = this;
                def.done(function(xml){
                    var videos = [];
                    $(xml).find('videos').each(function(i, el){
                        el = $(el);
                        videos.push({
                            id: el.find('link').text(),
                            img: el.find('thumbnail').text(),
                            title: el.find('titre').text(),
                            desc: el.find('contenu').text()
                        });
                    });
                    _self.opt.videos = videos;

                    if(_self.opt.videos.length > 1){
                        _self.initPlaylist();
                    }
                });
            } else {
                _self.playVideo(this.opt.videoId);
            }
        },
        initPlaylist: function(){
            this.playlist = $("<div id='ytp_playlist_"+this.id+"' class='ytp_playlist'>");
            this.playlist.insertAfter("#"+this.id);
            var l = this.opt.videos.length;
            var video, item;
            var _self = this;
            var getClickThumbnail = function(id, item){
                return function(){
                    _self.playVideo(id);
                    _self.playlist.find('.ytp_thumb').removeClass("active");
                    item.addClass('active');
                };
            };
            for (var i = 0; i < l; i++) {
                video = this.opt.videos[i];
                item = $('<div class="ytp_thumb"/>');
                item.append("<img src='"+video.img+"'/>");
                item.append("<p class='title'>"+video.title+"</p>");
                item.append("<p>"+video.desc+"</p>");
                item.attr('data-id', video.id);
                item.on('click.ytp', getClickThumbnail(video.id, item));
                this.playlist.append(item);
            }
            $('.ytp_thumb').addClass("slide");
            this.playlistNeutrino = $('.ytp_playlist').neutrino({
                hasArrows: true,
                slidesPerPage: NUM_SLIDES,
                timer:0
            });
        },
        onReady:function(){
            if(this.opt.customControls != null){
                this.setupCustomControls();
            }
        },
        setupCustomControls: function (){
            var cc = this.opt.customControls;
            if(cc.playPauseButton) {
                var ppBtn = cc.playPauseButton;
                this.bigPlayPauseButton = new BigPlayPauseButton(ppBtn, this.player);
            }
            if(cc.progressBar) {
                var pb = cc.progressBar;
                this.progressBar = new ProgressBar(pb, this.player);
            }
            if(cc.playPauseOverlay) {
                var ppo = cc.playPauseOverlay;
                this.playPauseOverlay = new PlayPauseOverlay(ppo, this.player);
            }
            if(cc.muteButton) {
                var mb = cc.muteButton;
                this.muteButton = new MuteButton(mb, this.player);
            }
            if(cc.volumeControl) {
                var vc = cc.volumeControl;
                this.volumeControl = new VolumeControl(vc, this.player);
            }
            if(cc.smallPlayPauseButton) {
                var ppb = cc.smallPlayPauseButton;
                this.smallPlayPauseButton = new SmallPlayPauseButton(ppb, this.player);
            }
            if(cc.timeLeft) {
                var tl = cc.timeLeft;
                this.timeLeft = new TimeLeft(tl, this.player);
            }
        },
        playVideo: function(vid){
            if(this.opt.preneutrino) {
                this.opt.preneutrino.data("neutrino").stopTimer();
            }
            if(this.player) {
                this.player.loadVideoById(vid);
            } else {
                var _self = this;
                var YT = window.YT;
                this.player = new YT.Player(this.id, {
                    height: this.opt.height,
                    width: this.opt.width,
                    videoId: vid,
                    events: {
                        onReady:function(e){
                            _self.onReady();
                            _self.opt.onReady(e);
                        },
                        onStateChange:function(e){
                            if(e.data === YT.PlayerState.ENDED) {
                                _self.onVideoEnded();
                            }
                            _self.opt.onStateChange();
                        },
                    },
                    playerVars: this.opt.playerVars
                });
            }
            this.el = $('iframe#'+this.id);
        },
        onVideoEnded: function(){
            if(this.hasPlaylist){
                var btns = this.playlist.find('.ytp_thumb');
                var curBtn = btns.filter('.active');
                var nextBtn = btns.index(curBtn) + 1;
                var slide = (nextBtn+1) % NUM_SLIDES;
                nextBtn = (nextBtn >= this.opt.videos.length) ? [] : btns.eq(nextBtn);
                if(nextBtn.length > 0) {
                    nextBtn.trigger('click');
                    this.playlistNeutrino.data("neutrino").goToSlide(slide);
                } else {
                    this.killPlayer();
                }
            }
        },
        killPlayer: function() {
            var domEl = $('iframe#'+this.id);
            domEl.before(this.prevideo);
            if(this.opt.preneutrino) {
                this.opt.preneutrino.data("neutrino").resetTimer();
            }
            this.player.stopVideo();
            this.player = null;
            
            domEl.hide();
            domEl.remove();
        }
    };




    /**
    ***   VolumeControl
    **/

    var VolumeControl = function(el, player){
        this.el = $(el);
        this.player = player;

        this.mute = this.el.find('.mute');
        this.isMuted = this.player.isMuted();
        this.updateMuteState();

        this.isHorizontal = this.el.hasClass('horizontal');

        this.volume = this.player.getVolume();
        this.volumeBg = this.el.find('.volume-bg');
        this.volumeFill = this.el.find('.volume-fill');
        this.volumeHotSpot = this.el.find('.volume-hotspot');

        this.volumeHotSpot.on('click.yte', $.proxy(this.onClickVolumeBG, this));
        this.mute.on('click.yte', $.proxy(this.onClickVolumeControlMute, this));
    };

    VolumeControl.prototype = {
        onClickVolumeBG:function(e){
            var fill;
            var h = this.volumeHotSpot.height();
            var w = this.volumeHotSpot.width();
            if(this.isHorizontal){
                fill = e.offsetX / this.volumeBg.width() * 100;
                this.volumeFill.width(e.offsetX);
                this.player.setVolume(fill);
            } else {
                fill = e.offsetY / this.volumeBg.height() * 100;
                this.volumeFill.height(h - e.offsetY);
                this.player.setVolume(100 - fill);
            }
        },
        onClickVolumeControlMute: function(e){
            if(this.player.isMuted()){
                this.player.unMute();
                this.isMuted = false;
            } else {
                this.player.mute();
                this.isMuted = true;
            }
            this.updateMuteState();
        },
        updateMuteState: function(){
            if(this.isMuted){
                this.mute.addClass('muted');
            } else {
                this.mute.removeClass('muted');
            }
        }
    };




    /**
    ***   MuteButton
    **/

    var MuteButton = function(el, player){
        this.el = $(el);
        this.player = player;

        this.isMuted = this.player.isMuted();
        this.updateState();

        this.el.on('click.yte', $.proxy(this.onClickMuteButton, this));
    };

    MuteButton.prototype = {
        onClickMuteButton: function(e){
            if(this.player.isMuted()){
                this.player.unMute();
                this.isMuted = false;
            } else {
                this.player.mute();
                this.isMuted = true;
            }
            this.updateState();
        },
        updateState: function(){
            if(this.isMuted){
                this.el.addClass('muted');
            } else {
                this.el.removeClass('muted');
            }
        }
    };




    /**
    ***   PlayPauseOverlay
    **/

    var PlayPauseOverlay = function(el, player){
        this.el = $(el);
        this.player = player;

        this.el.on('click.yte', $.proxy(this.onClickPlayPauseOverlay, this));
        this.player.addEventListener('onStateChange', $.proxy(this.onPlayerStateChange, this));
    };

    PlayPauseOverlay.prototype = {
        onClickPlayPauseOverlay: function(e){
            switch(this.player.getPlayerState()){
                case 1:
                    this.player.pauseVideo();
                    this.el.addClass("paused");
                    break;
                case 2:
                    this.player.playVideo();
                    this.el.removeClass("paused");
                    break;
            }
        },
        onPlayerStateChange: function(e){
            if(e.data === 1){
                this.el.removeClass("paused");
            } else if ( e.data === 2 ){
                this.el.addClass('paused');
            }
        }
    };




    /**
    ***   SmallPlayPauseButton
    **/

    var SmallPlayPauseButton = function(el, player){
        this.el = $(el);
        this.player = player;

        this.el.on('click.yte', $.proxy(this.onClickSmallPlayPauseButton, this));
        this.player.addEventListener('onStateChange', $.proxy(this.onPlayerStateChange, this));
    };

    SmallPlayPauseButton.prototype = {
        onClickSmallPlayPauseButton: function(e){
            switch(this.player.getPlayerState()){
                case 1:
                    this.player.pauseVideo();
                    this.el.addClass("paused");
                    break;
                case 2:
                    this.player.playVideo();
                    this.el.removeClass("paused");
                    break;
            }
        },
        onPlayerStateChange: function(e){
            if(e.data === 1){
                this.el.removeClass("paused");
            } else if ( e.data === 2 ){
                this.el.addClass('paused');
            }
        }
    };




    /**
    ***   ProgressBar
    **/

    var ProgressBar = function(el, player){
        this.el = $(el);
        this.player = player;
        this.elapsed = this.el.find('.player-elapsed');

        this.duration = this.player.getDuration();
        this.elapsedTime = 0;

        this.el.on('click.yte', $.proxy(this.onClickProgressBar, this));

        this.onTick();
    };

    ProgressBar.prototype = {
        onTick:function(){
            this.elapsedTime = this.player.getCurrentTime();
            if(this.player.getPlayerState() === 0){
                this.elapsedTime = this.duration;
            }
            this.elapsed.css('width', (this.elapsedTime / this.duration * 100) + "%" );
            requestAnimFrame($.proxy(this.onTick, this));
        },
        onClickProgressBar: function(e){
            var p = e.offsetX / this.el.width();
            this.player.seekTo( p * this.duration );
        }
    };




    /**
    ***   TimeLeft
    **/

    var TimeLeft = function(el, player){
        this.el = $(el);
        this.player = player;

        this.duration = this.player.getDuration();
        this.stringDuration = this.secondsToString(this.duration);
        this.elapsedTime = 0;

        this.onTick();
    };

    TimeLeft.prototype = {
        onTick:function(){
            this.elapsedTime = this.player.getCurrentTime();
            if(this.player.getPlayerState() === 0){
                this.elapsedTime = this.duration;
            }
            this.el.text(this.secondsToString(this.elapsedTime) + " / " + this.stringDuration);
            requestAnimFrame($.proxy(this.onTick, this));
        },
        secondsToString: function (secs) {
            var d = new Date(secs*1000);
            if(d.getUTCHours() == 0)
                return d.getUTCMinutes() + ":" + this.leadingZero(d.getUTCSeconds());
            else
                return d.getUTCHours() + ":" + this.leadingZero(d.getUTCMinutes()) + ":" + this.leadingZero(d.getUTCSeconds());
        },
        leadingZero: function(n){
            return (n < 10) ? "0" + n : n;
        }
    };

    


    /**
    ***   BigPlayPausebutton
    **/

    var BigPlayPauseButton = function(el, player){
        this.el = $(el);
        this.player = player;

        this.el.addClass('pause');
        this.el.on('click.yte', $.proxy(this.onBigPlayClick, this));

        this.player.addEventListener('onStateChange', $.proxy(this.onPlayerStateChange, this));
    };

    BigPlayPauseButton.prototype = {
        onBigPlayClick: function(e){
            switch(this.player.getPlayerState()){
                case 1:
                    this.player.pauseVideo();
                    break;
                case 2:
                    this.player.playVideo();
                    break;
            }
        },
        onPlayerStateChange: function(e){
            if(e.data === 1){
                this.el.removeClass('play').addClass('pause');
            } else if ( e.data === 2 ){
                this.el.removeClass('pause').addClass('play');
            }
        }
    };

    return YoutubePlayer;
}));