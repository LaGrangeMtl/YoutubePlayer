
(function (root, factory) {
	var nsParts = 'lagrange/utils/GConsole'.split('/');
	var name = nsParts.pop();
	var ns = nsParts.reduce(function(prev, part){
		return prev[part] = (prev[part] || {});
	}, root);
	if (typeof define === 'function' && define.amd) {
		define(
			'lagrange/utils/GConsole',//must be a string, not a var
			['jquery'], function ($) {
			return (ns[name] = factory($));
		});
	} else {
		ns[name] = factory(root.jQuery);
	}
}(this, function ($) {

	var widget = null;
	var createWidget = function(){
		if(widget) return;
		
		widget = $('<div style="position:fixed;z-index:50000;top:0;right:0;background:white;color:black;font-family:verdana;padding:4px;width:500px;height:120px;border:1px black solid;font-size:10px;line-height:12px;overflow:scroll;">').appendTo('body');
		
	};
	
	var getVar = function(toLog) {
		
		var t = typeof toLog;
		var op = null;
		switch(t) {
			case 'number':
			case 'string':
				op = toLog;
				break;
			case 'boolean':
				op = toLog ? 'true' : 'false';
				break;
			case 'object':
				var obj = [];
				var wrap = null;
				$.each(toLog, function(k, v){
					if(!wrap){
						wrap = typeof k == 'number' ? ['[ ',' ]'] : ['{ ', ' }'];
					}
					obj.push(k + ' : ' + getVar(v));
				});
				op = wrap[0] + obj.join() + wrap[1];
				break;
			case 'undefined':
				op = 'undefined';
				break;
			default:
				op = 'null';
				break;
		}
		return op;
	}

	GConsole = {
		
		log : function(){
			
			createWidget();
			var op = '';
			$.each(arguments, function(i, toLog){
				op += getVar(toLog) + ' ';
			});
			widget.append(op + '<br>');
			widget.prop('scrollTop', widget.prop('scrollHeight'));
			
		}
		
	};
	return GConsole;
}));