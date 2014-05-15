/** 
	
	@author Martin Vézina, 2012-06

	Base class for content that is intended to be loaded by an Ajax call. Will load its images and resolve a $.Deffered when ready.

*/
(function (root, factory) {
	var nsParts = 'lagrange/content/AsyncContent'.split('/');
	var name = nsParts.pop();
	var ns = nsParts.reduce(function(prev, part){
		return prev[part] = (prev[part] || {});
	}, root);
	if (typeof define === 'function' && define.amd) {
		define(
			'lagrange/content/AsyncContent',//must be a string, not a var
			[
				'jquery',
				'lagrange/animation/AbstractTransition',
				'imagesloaded/imagesloaded'
			], function ($, AbstractTransition, imagesloaded) {
			return (ns[name] = factory($, AbstractTransition, imagesloaded));
		});
	} else {
		ns[name] = factory(root.$, root.lagrange.animation.AbstractTransition, imagesloaded);
	}
}(this, function ($, AbstractTransition, imagesLoaded) {


	var AsyncContent = function(){
		/** 
		Initializes the content. At this point, by requirement, the node has already been set. The node is set before the content is added to the dom, and this init is called only when injected in the dom.
		*/

		var node;
		var asyncContentPromise;
		var title;
		var id;

		this.initAsyncContent = function(idParam, titleParam){
			id = idParam;
			title = titleParam;
		};

		this.setContentNode = function(data) {
			node = $(data);
		};

		this.getContentNode = function() {
			return node;
		};

		this.getId = function() {
				return id;
		};
		this.getTitle = function() {
			return title;
		};
		
		this.onAddedToDOM = function() {
			
			if(asyncContentPromise) {
				return asyncContentPromise;
			}
			
			var imagesDeferred = node.imagesLoaded();
			
			//Some images can be included in the content because they are used as css backgrounds and we still want to wait for them to be loaded before resolving. We need to remove these images when they are loaded, as their purpose is only to know when they are ready.
			imagesDeferred.always(function(){
				node.find('img.bgLoader').remove();
			});
			
			var wholeDeferred = $.Deferred();
			var afterDeferred = this.afterAdded();
			
			var resolveWhole = function() {
				wholeDeferred.resolve();
			};
			
			//we want to resolve even if some images are broken
			imagesDeferred.fail(function(){
				afterDeferred.then(resolveWhole);
			});
			
			$.when(imagesDeferred, afterDeferred).then(resolveWhole);
			
			asyncContentPromise = wholeDeferred.promise();
			return asyncContentPromise;
		};
		
		//this function can be overridden by the concrete class, if some actions are to be performed and for which we might have to wait before the content is ready
		this.afterAdded = this.afterAdded || function() {
			return $.Deferred().resolve();
		};

		return this;
	};

	AsyncContent.factory = function(instance) {
		instance = instance || {};
		instance = AbstractTransition.factory(instance);
		return AsyncContent.call(instance);
	};

	return AsyncContent;

}));
