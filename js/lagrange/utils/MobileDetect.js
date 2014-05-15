(function (root, factory) {
	var nsParts = 'lagrange/utils/MobileDetect'.split('/');
	var name = nsParts.pop();
	var ns = nsParts.reduce(function(prev, part){
		return prev[part] = (prev[part] || {});
	}, root);
	if (typeof define === 'function' && define.amd) {
		define(
			'lagrange/utils/MobileDetect',//must be a string, not a var
			[], function () {
			return (ns[name] = factory());
		});
	} else {
		ns[name] = factory();
	}
}(this, function ($) {

	var MobileDetect = {
		Android: function() {
			return navigator.userAgent.match(/Android/i) ? true : false;
		},
		BlackBerry: function() {
			return navigator.userAgent.match(/BlackBerry/i) ? true : false;
		},
		iOS: function() {
			return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false;
		},
		Windows: function() {
			return navigator.userAgent.match(/IEMobile/i) ? true : false;
		},
		any: function() {
			//return true;
			return (MobileDetect.Android() || MobileDetect.BlackBerry() || MobileDetect.iOS() || MobileDetect.Windows());
		}
	};
	
	return MobileDetect;
	
}));