/**

	Revoir : faire scroll avec greensock
	

*/

(function (root, factory) {
	var nsParts = 'lagrange/utils/WindowUtils'.split('/');
	var name = nsParts.pop();
	var ns = nsParts.reduce(function(prev, part){
		return prev[part] = (prev[part] || {});
	}, root);
	if (typeof define === 'function' && define.amd) {
		define(
			'lagrange/utils/WindowUtils',//must be a string, not a var
			['jquery'], function ($) {
			return (ns[name] = factory($));
		});
	} else {
		ns[name] = factory(root.jQuery);
	}
}(this, function ($) {

	var page, htmlWindow, htmlDocument, body;
	var getPage = function(){
		page = page || $("html, body");
		return page;
	};
	var getBody = function(){
		body = body || $("body");
		return body;
	};
	var getWindow = function(){
		htmlWindow = htmlWindow || $(window);
		return htmlWindow;
	};
	var getDocument = function(){
		htmlDocument = htmlDocument || $(document);
		return htmlDocument;
	};


	return {
		body : function(){
			return getBody();
		},
		scrollTopPage : function() {
			getPage().animate({ scrollTop: 0 }, 600, "easeOutExpo");
		},

		scrollBottomPage : function() {
			var windowHeight = getWindow().height();
			var documentHeight = getDocument().height();
			getPage().animate({ scrollTop: documentHeight - windowHeight }, 600, "easeOutExpo");
			return false;
		},

		hasHitBottom : function() {
			if(getDocument().height() == window.pageYOffset + window.innerHeight){
				return true;
			}
		},

		//retourne la pos du scroll
		getScroll : function() {
			return getDocument().scrollTop();
		},

		//retourne la pos du scroll
		getWinWidth : function() {
			return getWindow().width();
		},
		//retourne la pos du scroll
		getWinHeight : function() {
			return getWindow().height();
		},

		//indique si un element est visible dans la page dépendant du scroll.
		isElementVisible : function(el) {
			var elTop = el.position().top;
			var elBot = elTop + el.height();
			var minVisible = this.getScroll();
			var maxVisible = minVisible + getWindow().height();
			//console.log(elTop, '<', maxVisible, elBot, '>', minVisible);
			if(elTop < maxVisible && elBot > minVisible) {
				return true;
			}
			return false;
		}
	};

}));