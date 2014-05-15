
/** 

	Note : easel is not loaded by require, but rather from a conditionnal in the html, as the script is bundled by r.js and easel throws errors just by loading in ie8-

*/

(function (root, factory) {
	var nsParts = 'lagrange/animation/MaskedSprite'.split('/');
	var name = nsParts.pop();
	var ns = nsParts.reduce(function(prev, part){
		return prev[part] = (prev[part] || {});
	}, root);
	if (typeof define === 'function' && define.amd) {
		define(
			'lagrange/animation/MaskedSprite',//must be a string, not a var
			[
				'jquery',
				'createjs'
			], function ($, createjs) {
			return (ns[name] = factory($, createjs));
		});
	} else {
		ns[name] = factory(root.$, root.createjs);
	}
}(this, function ($, createjs) {
		
	var isAvailable = !!(window.createjs.Filter);
	
	var MaskedSprite = function(rootNode, animationSettings) {
		this.ready = $.Deferred();
		var maskImg = $('.alpha', rootNode).hide();
		var spriteImg = $('img.spritesheet', rootNode).hide();
		if(!isAvailable) {
			this.ready.resolve();
			return;
		}
						
		var _self = this;
		
		this.bmpAnim = null;		
		this.mask = null;
		this.canvas = document.createElement('canvas');
		this.stage = new createjs.Stage(this.canvas);
		
		rootNode.imagesLoaded(allLoaded);
		
		var defaultAnimSettings = {
			frames : null,
			autoStart : true
		};
		
		animationSettings = $.extend(defaultAnimSettings, animationSettings);
		
		function allLoaded() {
			
			var spriteSheet;
			
			spriteImg.show();
			maskImg.show();
			
			var w = spriteImg.data('width');
			var h = spriteImg.data('height');
			
			var ssW = spriteImg.width();
			var ssH = spriteImg.height();
			
			var spriteSource = spriteImg.get(0);
			
			//setup canvas
			_self.canvas.width = w;
			_self.canvas.height = h;
			rootNode.append(_self.canvas);
			
			//if animation is not specifically defined, make a loop
			if(!animationSettings.frames) {
				
				var nFrames = spriteImg.data('nframes') || Math.floor(ssW / w) * Math.floor(ssH / h);
				
				animationSettings.frames = {
					animIn:[0, nFrames-1]
				};
				
			}
			
			
			//finds a PNG that has the alpha channel
			if(maskImg) {
				//is the mask a sprite or a single frame?
				//mask img is same size as sprite
				if(maskImg.width() == ssW) {
					spriteSource = createjs.SpriteSheetUtils.mergeAlpha(spriteSource, maskImg.get(0));
				} else {
					_self.mask = new createjs.AlphaMaskFilter(maskImg.get(0));
				}
			}
			
			// create spritesheet and assign the associated data.
			spriteSheet  = new createjs.SpriteSheet({
				images: [spriteSource],
				frames: {width:w, height:h, regX:0, regY:0},
				animations: animationSettings.frames
			});

			

			// create a BitmapAnimation instance to display and play back the sprite sheet:
			_self.bmpAnim = new createjs.BitmapAnimation(spriteSheet);
			
			if(spriteImg.data('flipped') == 'x') {
				_self.bmpAnim.scaleX = -1;
				_self.bmpAnim.regX = w;
			}
			
			_self.stage.addChild(_self.bmpAnim);

			
			//now remove images from container
			$('img', rootNode).remove();
			_self.ready.resolve();
			animationSettings.autoStart ? _self.start() : _self.reset();
			
		}

	};
	
	MaskedSprite.prototype.getReady = function() {
		return ready.promise();
	};
		
	MaskedSprite.prototype.reset = function(){
		if(this.bmpAnim) this.bmpAnim.gotoAndStop(0);
		this.tick();
	};
		
	MaskedSprite.prototype.start = function(){
		createjs.Ticker.addListener(this);
		if(this.bmpAnim) this.bmpAnim.gotoAndPlay('animIn');
	};
	
	MaskedSprite.prototype.stop = function(){
		createjs.Ticker.removeListener(this);
		if(this.bmpAnim) this.bmpAnim.stop();
	};
	
	MaskedSprite.prototype.tick = function(){
		this.stage.update();
		if(this.mask) this.mask.applyFilter(this.canvas.getContext("2d"), 0, 0, this.canvas.width, this.canvas.height);
	};
	
	if(!isAvailable) {
		var noop = function(){};
		$.each(MaskedSprite.prototype, function(k, f){
			MaskedSprite.prototype[k] = noop;
		})
	}
	
	return MaskedSprite;
		
}));