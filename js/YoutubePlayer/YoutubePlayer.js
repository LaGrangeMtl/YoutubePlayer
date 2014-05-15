define(
    [
        'YoutubePlayer/NameSpace',
        'lagrange/utils/WindowUtils',
        'jquery',
        'lagrange/utils/YoutubePlayerEnhanced'
    ], 
    function(ns, WU, $, YoutubePlayerEnhanced) {

        $(document).ready(function(){
            var playerCtn = $('.player-ctn');
            new YoutubePlayerEnhanced('#player', {
                videoId: "BPRRAF8vNhU",
                customControls: {
                    muteButton: playerCtn.find('.player-mute'),
                    volumeControl: playerCtn.find('.player-volume'),
                    playPauseOverlay: playerCtn.find('.player-overlay'),
                    smallPlayPauseButton: playerCtn.find('.player-smallplaypause'),
                    playPauseButton: playerCtn.find('.player-playpause'),
                    progressBar: playerCtn.find('.player-progress'),
                    timeLeft: playerCtn.find('.player-timeleft')
                }
            });
        });

        return {            
            initialize : function(){

                this.activate(WU.body());

                return this;
            },

            activate : function(context) {

            },

            deactivate : function(context) {

            }
        };
    }
);