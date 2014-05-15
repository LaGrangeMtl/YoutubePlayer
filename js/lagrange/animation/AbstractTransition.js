/*!
 * More info at http://lab.la-grange.ca
 * @author Martin Vézina <m.vezina@la-grange.ca>
 * @copyright 2014 Martin Vézina <m.vezina@la-grange.ca>
 * 
 * module pattern : https://github.com/umdjs/umd/blob/master/amdWebGlobal.js
*/
(function (root, factory) {
	var nsParts = 'lagrange/animation/AbstractTransition'.split('/');
	var name = nsParts.pop();
	var ns = nsParts.reduce(function(prev, part){
		return prev[part] = (prev[part] || {});
	}, root);
	if (typeof define === 'function' && define.amd) {
		define(
			'lagrange/animation/AbstractTransition',//must be a string, not a var
			[
				'jquery',
				'TweenMax'
			], function ($, TweenMax) {
			return (ns[name] = factory($, TweenMax));
		});
	} else {
		ns[name] = factory(root.$, root.TweenMax);
	}
}(this, function ($, TweenMax) {
	"use strict";

	var TweenLite = (window.GreenSockGlobals || window).TweenLite;
	var TimelineMax = (window.GreenSockGlobals || window).TimelineMax;

	var IN = 1;
	var OUT = -1;
	var STOPPED = 0;

	var noop = function(){};
	
	var AbstractTransition = function(){
		
		var root;
		var tl;
		// Time at which the in finishes and out starts
		var animateInFinishTime;
		var animateOutStartTime;
		// current animState (1/-1)
		var animState;
		var animDeferred;

		this.setupTransition = function(node) {
			root = (typeof node === 'string') ? $(node) : node;
			setTimeline.call(this);
			return this;
		};

		this.getAnimationRoot = function(){
			return root;
		};
		
		/**
		Creates TimelineMax for the animation
		*/
		var setTimeline = function(){
			if(!TimelineMax) throw new Error('TimelineMax not loaded');
			
			tl = new TimelineMax({
				onComplete : afterAnimateOut,
				onCompleteScope : this
			});

			tl.stop();

			this.setAnimation(tl, root, setAnimInFinishTime);

			tl.addCallback(afterAnimateIn, animateInFinishTime, null, this);

		};

		var afterAnimateOut = function(){
			if(animState === OUT){
				animDeferred && animDeferred.resolve();
				animState = STOPPED;
				(this.sleep || noop).call(this);
				animDeferred = null;
			}
		};

		var afterAnimateIn = function(){
			if(animState === IN){
				tl.stop();
				animDeferred && animDeferred.resolve();
				animState = STOPPED;
				(this.activate || noop).call(this);
				animDeferred = null;
			};
		};

		var setAnimInFinishTime = function(){
			animateInFinishTime = tl.totalDuration();
			tl.append( TweenLite.to({}, 1, {}) );
			animateOutStartTime = animateInFinishTime + 1;
			return animateOutStartTime;
		};

		/**
		Jumps directly to the IN state of the animation if it exists.
		*/
		this.jumpToInState = function() {
			this.cancelTransition();
			if(animateInFinishTime && tl) {
				tl.gotoAndStop(animateInFinishTime);
			}
			animState = STOPPED;
			(this.activate || noop).apply(this, arguments);
		};

		/** 
		Defaults to fadein/fadeout
		*/
		this.setAnimation = this.setAnimation || function(tl, rootNode, setInEndTime) {
			tl.append( TweenLite.from(rootNode, 1, {opacity:0, ease:Expo.easeIn}) );
			var animateInFinish = setInEndTime();
			tl.insert( TweenLite.to(rootNode, 1, {opacity:0, ease:Expo.easeOut}), animateInFinish);
			return tl;
		};

		this.cancelTransition = function() {
			if(animDeferred) {
				animDeferred.reject();
				animDeferred = null;
			}
		};
		
		this.animateIn = function(){
			if(animDeferred && animState === IN) return animDeferred;
			this.cancelTransition();
			(this.wakeup || noop).apply(this, arguments);//passes arguments to the beforeAnimateIn, if any
			animState = IN;
			tl.restart();
			animDeferred = $.Deferred();
			return animDeferred.promise();
		};

		this.animateOut = function(){
			if(animDeferred && animState === OUT) return animDeferred;
			this.cancelTransition();
			(this.deactivate || noop).apply(this, arguments);//passes arguments to the beforeAnimateOut, if any
			animState = OUT;
			tl.play(animateOutStartTime);
			animDeferred = $.Deferred();
			return animDeferred.promise();
		};

		return this;

	};

	AbstractTransition.factory = function(instance) {
		instance = instance || {};
		return AbstractTransition.call(instance);
	};

	return AbstractTransition;

}));


