(function (root, factory) {
	var nsParts = 'lagrange/social/TwitterShare'.split('/');
	var name = nsParts.pop();
	var ns = nsParts.reduce(function(prev, part){
		return prev[part] = (prev[part] || {});
	}, root);
	if (typeof define === 'function' && define.amd) {
		define(
			'lagrange/social/TwitterShare',//must be a string, not a var
			['jquery'], function ($) {
			return (ns[name] = factory($));
		});
	} else {
		ns[name] = factory(root.jQuery);
	}
}(this, function ($) {
	var parseAttempt = function() {
		var twttr = window.twttr || null;
		if(twttr) {
			twttr.widgets.load();
			return;
		}
		setTimeout(parseAttempt, 100);
	}
//
	var TwitterShare = {
		
		putButton : function(url, selector, attr) {
			
			var lnk = '<a href="https://twitter.com/share" class="twitter-share-button" data-url="' + url +'"';
			$.each(attr, function(k, v){
				lnk += ' data-' + k + '="' + v + '"';
			});
			
			lnk += '>Tweet</a>';
			
			var container = $(selector);
			container.empty().html(lnk);
			parseAttempt();
		}
		
	};
	
	return TwitterShare;
	
}));