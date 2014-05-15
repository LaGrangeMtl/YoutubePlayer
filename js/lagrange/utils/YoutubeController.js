/**

	Non revu 2014-04-14. Devra être testé lors de la prochaine utilisation

*/

(function (root, factory) {
	var nsParts = 'lagrange/utils/YoutubeController'.split('/');
	var name = nsParts.pop();
	var ns = nsParts.reduce(function(prev, part){
		return prev[part] = (prev[part] || {});
	}, root);
	if (typeof define === 'function' && define.amd) {
		define(
			'lagrange/utils/YoutubeController',//must be a string, not a var
			[
				'jquery',
				'lagrange/utils/YoutubePlayer',
				'lagrange/utils/MobileDetect',
				'vendor/jquery.scrollto'
			], function ($) {
			return (ns[name] = factory($, YoutubePlayer, MobileDetect));
		});
	} else {
		ns[name] = factory(root.jQuery, root.lagrange.utils.YoutubePlayer, root.lagrange.utils.MobileDetect);
	}
}(this, function ($, YoutubePlayer, MobileDetect) {
		
	var playing = false;
	
	var playerId;
	var youtubeId;
	var container;
	var placeholder;
	var togglingElements;
	var close;
	var origScroll;
	var player;
	
	var playVideo = function(wrapper, settings) {
		
		youtubeId = settings.youtubeId;
		
		if(playing && playing!=youtubeId){
			closeCurrent();
		}
		
		var targetScroll = wrapper.offset().top - (($(window).height() - settings.height) / 2);
		
		playing = youtubeId;
		
		origScroll = $(window).scrollTop();

		if(togglingElements) togglingElements.hide();
		
		playerId = 'yt_' + new Date().getTime();
		
		getContainer(playerId, settings.width, settings.height);
		
		wrapper.prepend(container);

		container.slideDown(200, function(){
			startVideo(settings, targetScroll);
		});
		
	};
	
	var getContainer = function(id, w, h) {
		container = $('<div class="youtubePlayer">');
		container.css({width:w, height:h});
		close = $('<div class="closeVideo">').appendTo(container);
		placeholder = $('<div id="'+id+'">').appendTo(container);
	}
			
	var startVideo = function(settings, targetScroll){
		
		
		targetScroll = targetScroll > 0 ? targetScroll : 0;
		$.scrollTo(targetScroll, 200);
		
		player = new YoutubePlayer({
			elementId : playerId,
			youtubeId : youtubeId,
			height: settings.height,
			width: settings.width,
			quality: settings.quality,
			onEnded : function(playerElement) {
				
				removeVideo();
				$.scrollTo(origScroll, 200);
				
				if(settings.onEnded){
					settings.onEnded();
				}
			}
		});
		
		//_gaq = _gaq || [];
		//_gaq.push(['_trackEvent', 'Youtube', 'View', youtubeId]);
		
		close.off('click.grangeYT').on('click.grangeYT', function(e){
			e.preventDefault();
			closeCurrent();
			$.scrollTo(origScroll, 200);
			return false;
		}).hide().fadeIn(200);
	}
	
	var removeVideo = function() {
		
		if(!playing) return;
		if(player) player.kill();
		
		container.remove();
		
		if(togglingElements) togglingElements.fadeIn(200);
		playerId = null;
		playing = false;
		
	};
	
	var closeCurrent = function() {
		if(!playerId) return;
		removeVideo();
	}
	
	var YoutubeController = {
		activateButton : function(el, settings) {
			el.off('.youtube').on('click.youtube', function(){
				if(MobileDetect.any()){
					window.open('http://www.youtube.com/watch?v='+settings.youtubeId);
					return;
				}
				console.log(this);
				togglingElements = $(this);
				
				if(settings.hideOnPlay){
					togglingElements = togglingElements.add($(settings.hideOnPlay));
				}
				
				playVideo($(this).parent(), settings);
			});
		},
		
		deactivateButton : function(el) {
			el.off('.youtube');
		},
		
		directPlay : function(wrapper, settings) {
			
			playVideo(wrapper, settings);
		},
		
		getOuterHeight : function() {
			if(container) {
				return container.outerHeight();
			}
			return 0;
		},
		
		killCurrentPlayer : function() {
			closeCurrent();
		}
	}
	
	return YoutubeController;

}));
