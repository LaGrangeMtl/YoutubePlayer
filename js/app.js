
(function(ns){
	requirejs.config({
		paths:{
			'jquery' : 'vendor/jquery',
			'TweenMax' : 'vendor/greensock/TweenMax.min',
			'native.history' : 'vendor/native.history',
			'imagesloaded/imagesloaded' : 'vendor/imagesloaded',
			'lagrange' : '../js/lagrange',
			'neutrino' : 'lagrange/utils/neutrino.jquery'
		},
		shim: {
		
		}
	});

	requirejs(['jquery', 'YoutubePlayer/YoutubePlayer', 'vendor/es5-shim', 'vendor/es5-sham'], function($){

	});
	
})(window.lagrange = window.lagrange || {});