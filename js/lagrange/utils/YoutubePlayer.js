/**

	Non revu 2014-04-14. Devra être testé lors de la prochaine utilisation

*/

(function (root, factory) {
	var nsParts = 'lagrange/utils/YoutubePlayer'.split('/');
	var name = nsParts.pop();
	var ns = nsParts.reduce(function(prev, part){
		return prev[part] = (prev[part] || {});
	}, root);
	if (typeof define === 'function' && define.amd) {
		define(
			'lagrange/utils/YoutubePlayer',//must be a string, not a var
			[
				'jquery'
			], function ($) {
			return (ns[name] = factory($));
		});
	} else {
		ns[name] = factory(root.jQuery);
	}
}(this, function ($) {
		
	
	var YoutubeLoader = (function(){
		var youtubeLoaded;
		return function() {
			if(!youtubeLoaded) {
				youtubeLoaded = $.Deferred();
				window.onYouTubePlayerAPIReady = function() {
					youtubeLoaded.resolve();
				};/**/
				if (typeof require === 'function'){
					require(['http://www.youtube.com/iframe_api'], function(){});
				} else {
					var tag = document.createElement('script');
					tag.src = "https://www.youtube.com/iframe_api";
					var firstScriptTag = document.getElementsByTagName('script')[0];
					firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
				}
			}
			return youtubeLoaded.promise();
		};
	})();
	
	
	var YouTube = function(settings) {
		var defaultSettings = {
			height:800,
			width:1200,
			onAdded: function(){},
			onEnded: function(){}
		};
		
		settings = settings || defaultSettings;
		settings = $.extend(defaultSettings, settings);

		var player;
		var kill = this.kill = function() {
			
			if(!player) return;
			
			var domEl = $('iframe#'+settings.elementId);
			player.stopVideo();
			player = null;
			
			domEl.hide();
			domEl.remove();
			settings.onEnded(domEl);
			
		};
		
		var onPlayerReady = function(event) {
			settings.onAdded();
			event.target.playVideo();
		};
		
		var onPlayerStateChange = function(event) {
			//console.log(event.data);
			if (event.data == YT.PlayerState.ENDED) {
				kill();
			}
		};
		
		YoutubeLoader().done(function(){
			player = new YT.Player(settings.elementId, {
				height: settings.height,
				width: settings.width,
				videoId: settings.youtubeId,
				playerVars: {
					'showinfo' : 0,
					'rel' : 0,
					'theme' : 'light',
					'color' : 'white',
					'hd': 1,
					'vq' : settings.quality || 'default'
				},
				events: {
					'onReady': onPlayerReady,
					'onStateChange': onPlayerStateChange
				}
			});
			//_self.player.setPlaybackQuality(settings.quality || 'default');
		});
		
	};
	
	return YouTube;

}));