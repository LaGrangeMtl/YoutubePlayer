/**

	Non revu 2014-04-14. Devra être testé lors de la prochaine utilisation

*/
(function (root, factory) {
	var nsParts = 'lagrange/content/Async'.split('/');
	var name = nsParts.pop();
	var ns = nsParts.reduce(function(prev, part){
		return prev[part] = (prev[part] || {});
	}, root);
	if (typeof define === 'function' && define.amd) {
		define(
			'lagrange/content/Async',//must be a string, not a var
			['jquery', 'lagrange/utils/WindowUtils'], function ($, WU) {
			return (ns[name] = factory($, WU));
		});
	} else {
		ns[name] = factory(root.jQuery, root.lagrange.utils.WindowUtils);
	}
}(this, function($, WU) {
	var AsyncExtender = (function(asyncNs) {
		/** 

		Quand un element de DOM est loadé et doit devenir un objet, certains de ses comportements sont définis dans un tag scriptprésent dans le node loadé. AsyncExtender a la responsabilité de trouver ces scripts (qui doivent avoir la classe async) et d'extender un objet avec les définitiuons comprises dans ce script.

		*/
		var scriptSelector = 'script.async';

		var AsyncExtender = function(jqEl) {
			
			//scripts loadés par ajax ne sont pas exécutés car ils sont déplacés dans le head, qu'on ne place pas dans la page. On doit les trouver à part. Si pas de jq setté, on cherche les scripts dans le html général (on peut être au load original de la page)
			//
			if(jqEl) {
				this.script = jqEl.filter(scriptSelector);
				//append le script async loadé au body pour l'exécuter. Il settera ns.bufferedDefinition, qui extend le AsyncContentTransition créé
				WU.body().append(this.script);
			} else {
				this.script = $(scriptSelector);
			}
			
			this.getFilteredResponse = function(){
				return jqEl && jqEl.not(this.script);
			}
			
			
			this.extend = function(content) {
				
				this.script.each(function(i, scr){
					var id = $(scr).attr('id');
					//est-ce que ce script est unedéfinition async? Si oui, le script a un ID et sette un objet [id] dans le namespace, qui est une fonction qui retourne la définition de l'objet
					if(id && asyncNs[id]){
						var extendDefinition = asyncNs[id]();
						$.extend(content, extendDefinition);
						delete asyncNs[id];
					}
				});
				return content;
				
			}
			
		};
		return AsyncExtender;
	})(window.grangeAsync = window.grangeAsync || {});
	
					
	/* =============================================================================
	MAIN OBJECT
	========================================================================== */
	return {
		/**
		retourne la partie "page" de l'url
		*/
		getPagePart : function(url) {
			var a = document.createElement('a');
			a.href = url;
			var part = a.pathname;
			if(a.search) {
				part += a.search;
			}
			//console.log(url, part);
			return part;
		},
		
		getExtender : function(content) {
			
			return new AsyncExtender(content);				
		}
		
	};
}));

