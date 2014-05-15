/** 
	@author Martin Vézina, 2012-06
	Loads content through AJAX and create it as an AsyncContentTransition. The definition of a transition must be included in a script with class "async", that sets

	

	This script will be injected in the dom and called immediately so as to extend the object with the defined transition.

*/
(function (root, factory) {
	var nsParts = 'lagrange/content/ContentFactory'.split('/');
	var name = nsParts.pop();
	var ns = nsParts.reduce(function(prev, part){
		return prev[part] = (prev[part] || {});
	}, root);
	if (typeof define === 'function' && define.amd) {
		define(
			'lagrange/content/ContentFactory',//must be a string, not a var
			[
				'jquery',
				'lagrange/content/Async'
			], function ($, Async) {
			return (ns[name] = factory($, Async));
		});
	} else {
		ns[name] = factory(root.$, root.lagrange.content.Async);
	}
}(this, function ($, Async) {


	var createLoadedContent = function(rawResponse, createParams, createContentCallback) {
			
		var title = rawResponse.filter('title').html();
		var asyncExtender = Async.getExtender(rawResponse);
		var noscriptResponse = asyncExtender.getFilteredResponse();
				
		createParams.title = title;
		var content = createContentCallback(noscriptResponse, createParams, noscriptResponse);
		content = asyncExtender.extend(content);
		
		return content;
	};

	var getFromAjax = function(path, createParams, selector, createContentCallback) {

		var ajax = $.ajax({
			url : path,
			dataType :'html'
		});
		var success = function(data, textStatus, jqXHR) {
			return createLoadedContent($(data), createParams, selector, createContentCallback);
		};

		var fail = function(jqXHR, textStatus, errorThrown) {
			console.log(textStatus, jqXHR.responseText);
		};

		var filtered = ajax.pipe(success, fail);
		
		return filtered.promise();
	};

	var getParams = function(path, title) {
		return {
			id : Async.getPagePart(path),
			path : path,
			title : title
		};
	};

	return {

		getNodeFromSelector : function(input, selector){
			var node = selector ? $(selector, input) : $('<div>').append(input);
			//si le node n'est pas trouvé avec le selector, il est possible que le node soit au premier niveau du jquery donné
			if(node.length == 0 && selector){
				node = input.filter(selector);
			}
			return node;
		},
		
		//si la page est celle affichée au load (donc pas par ajax) il faut quand meme la créer parce qu'elle doit exister pour la navigation. i.e. elle doit avoir le meme comportement qu'une page qui serait loadée par ajax
		createOriginalContent : function(path, title) {
			var createParams = getParams(path, title);
			var content = this.createContent(null, createParams);
			
			var asyncExtender = Async.getExtender();
			content = asyncExtender.extend(content);
			
			var deferred = $.Deferred();
			deferred.resolve(content);
			return content;
		},

		getPageId : function(path){
			var createParams = getParams(path);
			return createParams.id;
		},
	
		/** 
		ABSTRACT Crée l'objet de page. La fonction doit être overridée par les sous-classes pour crer d'autres types de contenus.
		*/
		createContent : function() {
			throw new Error('createContent is abstract');	
		},
		
		/**
		ABSTRACT
		*/
		load : function() {
			throw new Error('load is abstract');	
		},
		
		getLoadingDeferred : function(path){
			
			createParams = getParams(path);
			
			return getFromAjax(path, createParams, this.createContent.bind(this));

		}
	};

}));