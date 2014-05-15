/** 

	@author Martin Vézina, 2012-06

*/
(function (root, factory) {
	var nsParts = 'lagrange/content/AbstractMenus'.split('/');
	var name = nsParts.pop();
	var ns = nsParts.reduce(function(prev, part){
		return prev[part] = (prev[part] || {});
	}, root);
	if (typeof define === 'function' && define.amd) {
		define(
			'lagrange/content/AbstractMenus',//must be a string, not a var
			[
				'jquery'
			], function ($) {
			return (ns[name] = factory($));
		});
	} else {
		ns[name] = factory(root.$);
	}
}(this, function ($) {

	var ACTIVATE = 'activate';
	var REMOVE = 'remove';

	var queue = [];

	var activeMenus = (function(){
		var menus = [];

		return {
			setMenu : function(menu, bindClicks) {
				menus[menu.level] = menu;
				bindClicks(menu.element.find('a'));
			},

			getMenu : function(level){
				level = level || 0;
				return menus[level];
			},

			deleteMenu : function(level) {
				delete menus[level];
			},

			getDefinedLevels : function(){
				return menus.reduce(function(vals, menu, idx){
					vals.push(menu.level);
					return vals;
				}, []);
			}
			
		};

	}());

	var getNodeFromSelector = function(input, selector){
		var node = selector ? $(selector, input) : $('<div>').append(input);
		//si le node n'est pas trouvé avec le selector, il est possible que le node soit au premier niveau du jquery donné
		if(node.length == 0 && selector){
			node = input.filter(selector);
		}
		return node;
	};

	var setInitialState = function(bindClicks){
		if(!activeMenus.getMenu()) {
			queue.forEach(function(menu, i) {
				activeMenus.setMenu(menu, bindClicks);
				menu.instance.jumpToInState();
			});
			queue.length = 0;
		}
	};

	return {
		//default
		selectors : {
			menus :'nav',//the actual menus
			active : '.active',//active links in the loaded menus, to determine the page's place in the tree
			containers : '#menu_' //container's selector for each level. Level will be appended (0, 1, 2...)
		},

		setCurrent : function(context) {

			queue.length = 0;
			var menus = getNodeFromSelector(context, this.selectors.menus);
			var activeSelector = this.selectors.active;
			menus.each(function(i, el){
				var _self = $(el);
				var level = _self.data('level');
				var parentId = _self.data('parent');
				var thisLevelActive = activeMenus.getMenu(level);
				//menu for this level has changed
				if(!thisLevelActive || thisLevelActive.parent !== parentId) {
					queue.push({
						element : _self,
						//extended object (in client folder) only should be aware of the menu concrete types, as long as they are AbstractTransitions. This function is therefore the factory to create each menu.
						instance : this.instanciateMenu(_self),
						parent : parentId,
						level : level
					});
				//menu for this level has not changed. Only need to activate another link in it.
				} else {
					//console.log(_self);
					queue.push({
						level : level,
						action : ACTIVATE,
						activeId : _self.find(activeSelector).data('id')
					});
				}
			}.bind(this));

			//now make sure that each active menu level is to be activated/replaced by an item in the cue. Otherwise, we will detach the active menu.	
			activeMenus.getDefinedLevels().forEach(function(level){
				var isDefinedInQueue = queue.reduce(function(isFound, menu){
					return isFound || menu.level === level;
				}, false);
				if(!isDefinedInQueue){
					queue.push({
						level: level,
						action : REMOVE
					});
				}
			});
		
			//make sure queue is in the right order
			queue.sort(function(a, b){
				return a.level - b.level;
			});
		},

		/**
		This method, called by the app, activates each menu when changing from one page to the other. It is the most tricky part, as it has the responsability to remove irrelevent menus and attach the new ones in the dom, depending on the structure of the loaded page.
		*/
		activate : function(bindClicks){

			setInitialState(bindClicks);

			if(!queue.length) return;
			//console.log(queue);
			queue.forEach(function(item){
				var activeMenu = activeMenus.getMenu(item.level);

				//right menu for this level is already in the dom
				if(item.action === ACTIVATE) {	
					
					item.activeId && activeMenu.instance.activateLink(item.activeId);

				//page does not require this menu level
				} else if(item.action === REMOVE) {
					var onOut = activeMenu.instance.animateOut();
					onOut.then(function(){
						activeMenu.element.remove();
						activeMenus.deleteMenu(item.level);
					});

				//this level's menu needs to be replaced
				} else if(activeMenu) {
					var onOut = activeMenu.instance.animateOut();
					onOut.then(function(){
						activeMenu.element.replaceWith(item.element);
						activeMenus.setMenu(item, bindClicks);
						item.instance.animateIn();
					});
				
				//this level's menu simply does not exist, add it
				} else {
					var container = $(this.selectors.containers + item.level);
					container.append(item.element);
					item.instance.animateIn();
					activeMenus.setMenu(item, bindClicks);
				}
			}.bind(this));
			queue.length = 0;
		}

	};

}));