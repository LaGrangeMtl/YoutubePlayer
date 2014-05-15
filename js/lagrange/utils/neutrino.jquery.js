/*The MIT License (MIT)

Copyright (c) 2013 Nicolas Poirier-Barolet

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

;(function($) {
	// Polyfill for IE8
	if (typeof Object.create !== 'function') {
	    Object.create = function (o) {
	        function F() {}
	        F.prototype = o;
	        return new F();
	    };
	}

	var Neutrino = {
		//=====================================================================
		// init : Public Function
		//
		// @params : options
		//		Custom settings of the user. May be an empty object.
		//
		// @params : context
		//		Element that will be defined as the root of the slideshow
		//
		// This function initialize the slideshow process. Variables are set up 
		// here and the Parameters of the whole slideshow also. After the 
		// setting is done, it starts the timer.
		//=====================================================================
		init : function(options, context) {
			this.TWEENER = window.TweenMax;
			this.root = $(context);
			this.slides = this.root.find('.slide');

			// Default values
			this.options = {
				transitionType: 'slide',
				transitionTime: 0.75,
				slideWidth: this.slides.eq(0).width(),
				timer: 3500,
				hasArrows: false,
				hasNav: false,
				slidesPerPage: 1
			};

			this.options = $.extend({},this.options,options);

			if(this.slides.length <= 1){
				this.options.hasNav = false;
				this.options.hasArrows = false;
			}
			
			this._build();

			return this;
		},

		//=====================================================================
		// _build : Private Function
		//
		// Sets various properties to the Neutrino object that will be used
		// later. Creates Navigation and Arrows if needed and starts the slider
		// with a timer or not, depending of the options. 
		//=====================================================================
		_build : function() {
			this.arrows = this.root.find('.arrow');
			this.nav = this.root.find('nav');
			this.navButtons = undefined;
			this.timer = undefined;

			this.currentIndex = 0;
			this.direction = 1;

			// FAKE PAGINATION
			if(this.options.slidesPerPage > 1){
				this._paginate();
			}

			if(this.options.hasArrows) {
				this._createArrows();
			}

			if(this.options.hasNav) {
				this._createNav();
				this._updateNav();
			}

			if((this.options.timer > 0 || this.options == undefined) && this.slides.length > 1) {
				this._initSlides();
				this._setTimer();
			}
			else {
				this.options.timer = false;
				this._initSlides();
			}
		},

		//=====================================================================
		// _paginate : Private Function
		//
		// Paginates the slideshow if the options : slidesPerPage was changed
		// by the user. Will set slides in containers and deal with their width
		//=====================================================================
		_paginate : function(){
			this.slides.addClass('floating');
			var nSlideContainersNeeded = this.slides.length / this.options.slidesPerPage;
			var slidesTemp = [];
			var slideContainers = [];
			var slideContainerIndex = 0;
			var _height = this.slides.eq(0).height();
			var lastSlideContainerChildren;

			if(this.slides.length % this.options.slidesPerPage == 1)
				nSlideContainersNeeded = Math.floor(nSlideContainersNeeded) + 1;

			for (var i = 0; i < nSlideContainersNeeded; i++) {
				slideContainers.push($('<div class="slideContainer"></div>'));
			};

			for (var i = 0; i < this.slides.length; i++) {
				slidesTemp.push(this.slides[i]);

				if(((i + 1) % this.options.slidesPerPage == 0) || (i == this.slides.length - 1)){
					for (var j = 0; j < slidesTemp.length; j++) {
						var _slide = $(slidesTemp[j]);
						_slide.css({
							width:(100/this.options.slidesPerPage) + '%'
						});
						slideContainers[slideContainerIndex].append(_slide);
					};

					slideContainerIndex++;
					for(var k = 0; k < this.options.slidesPerPage; k++){
						slidesTemp.shift();
					}
				}
			};

			lastSlideContainerChildren = slideContainers[slideContainers.length - 1].children();
			if(lastSlideContainerChildren.length < this.options.slidesPerPage){
				for(var i = 0; i < lastSlideContainerChildren.length; i++){	
					lastSlideContainerChildren.css({
						width:(100/lastSlideContainerChildren.length) + '%'
					});
				}
			}

			this.root.append(slideContainers);
			this.slides = this.root.find('.slideContainer');
			this.slides.eq(0).show();
			this.options.slideWidth = this.slides.eq(0).outerWidth();
		},

		//=====================================================================
		// _setArrowEvents : Private Function
		//
		// Will set the click events on the arrows. Direction is set by the
		// data attribute on the tags.
		//=====================================================================
		_setArrowEvents : function() {
			var _self = this;
			this.arrows.on('click.neutrino', function(e){
				clearTimeout(_self.timer);

				_self.direction = $(e.target).data('direction');

				_self.arrows.off('.neutrino');
				_self._initSlides(e);
				_self._changeSlide();
			})
		},

		//=====================================================================
		// _createArrows : Private Function
		//
		// Creates the arrows for the slideshow. Uses <div> tags, 
		// and sets the direction by using the data attribute.
		//=====================================================================
		_createArrows : function(){
			var arrowsMarkup = '<div class="arrow left" data-direction="-1"></div>';
			arrowsMarkup += '<div class="arrow right" data-direction="1"></div>';

			this.root.append(arrowsMarkup);
			this.arrows = this.root.find('.arrow');

			this._setArrowEvents();
		},

		//=====================================================================
		// _setNavEvents : Private Function
		//
		// Will set the click events on the nav. If you click on an already
		// active slide, the function will return, thus making the whole
		// process wait for another click or the timer to change the slide.
		//=====================================================================
		_setNavEvents : function() {
			var _self = this;
			this.navButtons.on('click.neutrino', function(e){
				// If is already active, wait for the timer to change slide
				if($(e.target).hasClass('active')){
					return;
				}
				else {
					clearTimeout(_self.timer);

					_self.direction = 0;

					_self._initSlides(e);
					_self._changeSlide();
				}
			});
		},

		//=====================================================================
		// _updateNav : Private Function
		//
		// Updates the navButtons style.
		//=====================================================================
		_updateNav : function() {
			this.navButtons.removeClass('active');
			this.navButtons.eq(this.currentIndex).addClass('active');
		},

		//=====================================================================
		// _createNav : Private Function
		//
		// Creates the navigation for the slideshow. Uses <li> tags, 
		// and sets the width of the <ul> for it to be centered.
		//=====================================================================
		_createNav : function(){
			var nbOfSlides = this.slides.length;
			var nav = '<nav><ul>';

			for(var i=0; i < this.slides.length; i++) {
				nav += '<li></li>';
			}

			nav += '</ul></nav>';

			this.root.append(nav);
			this.nav = this.root.find('nav');
			this.navButtons = this.nav.find('li');

			var liWidth = this.navButtons.eq(0).width();
			var liMargin = this.navButtons.eq(1).css('margin-left');
			liMargin = liMargin.substring(0, liMargin.length - 2);

			this.nav.find('ul').css({width: (liWidth * nbOfSlides) + (liMargin * (nbOfSlides - 1)) + "px"})

			this._setNavEvents();
		},

		//=====================================================================
		// _initSlides : Private Function
		//
		// @params : e
		//		If not defined, it means no click event was done to get here
		//		therefore, the direction should be 1, which is equal to right
		//		to left. Please note that not all of the animations will make
		//		use of the direction parameter. i.e. Fade in/out
		//
		//		If e is defined, a click was made. If it was on the nav, the
		//		direction property will be of 0. The nextIndex will then become
		//		the targeted nav button. Otherwise, the direction will be equal
		//		to what the arrow event set it to [see _setArrowEvents()]
		//=====================================================================
		_initSlides : function(e){
			this.currentSlide = this.slides.eq(this.currentIndex);
			this.nextIndex = this.currentIndex + this.direction;

			if(e){
				// If this direction == 0, it means that we clicked on the nav
				// buttons
				if(this.direction == 0) {
					this.nextIndex = this.navButtons.index($(e.target));

					if(this.nextIndex < this.currentIndex)
						this.direction = -1;
					else
						this.direction = 1;
				}
			}
			else {
				this.direction = 1;
			}

			if(this.nextIndex >= this.slides.length)
				this.nextIndex = 0;
			else if (this.nextIndex < 0)
				this.nextIndex = this.slides.length - 1;

			this.nextSlide = this.slides.eq(this.nextIndex);

			switch(this.options.transitionType) {
				case 'slide': break;
				case 'fade': break;
				case 'slideFluid': this._setupSlideFluidHeight(); break;
				default: console.error('Neutrino: Unknown animation type.'); return;
			}

			this.slides.hide();
			this.currentSlide.show();
		},

		//=====================================================================
		// goToSlide : Public Function
		//
		// @params : slideIndex
		//		Index of the slide you want to go to.
		//
		// Go directly to a slide. The direction will be calculated depending
		// on the slide you want to go to.
		//=====================================================================
		goToSlide : function(slideIndex){
			clearTimeout(_self.timer);
			this.currentSlide = this.slides.eq(this.currentIndex);

			this.nextIndex = slideIndex;

			if(this.nextIndex >= this.slides.length)
				this.nextIndex = 0;
			else if (this.nextIndex < 0)
				this.nextIndex = this.slides.length - 1;

			if(this.nextIndex == this.currentIndex)
				return;
			
			this.nextSlide = this.slides.eq(this.nextIndex);
			this.direction = (this.nextIndex > this.currentIndex) ? 1 : -1;

			switch(this.options.transitionType) {
				case 'slide': break;
				case 'fade': break;
				case 'slideFluid': this._setupSlideFluidHeight(); break;
				default: console.error('Neutrino: Unknown animation type.'); return;
			}

			this._changeSlide();
		},

		//=====================================================================
		// _changeSlide : Private Function
		//
		// This is where the slides are changed. For the whole process, the 
		// arrows and the nav buttons will be disabled. They will be enabled
		// again after the animations are done. Depending on the transitionType
		// property of the slideshow, it will call the right animation function
		//=====================================================================
		_changeSlide : function(){
			var animation = $.Deferred();

			if(this.options.hasNav)
				this.navButtons.off('.neutrino');

			switch(this.options.transitionType) {
				case 'slide': animation = this._slide(); break;
				case 'slideFluid': animation = this._slideFluidHeight(); break;
				case 'fade': animation = this._fade(); break;
				default: console.error('Neutrino: Unknown animation type.'); return;
			}

			var _self = this;
			animation.done(function(){
				if(_self.options.hasNav){
					_self._updateNav();
					_self._setNavEvents();
				}

				if(_self.options.hasArrows)
					_self._setArrowEvents();
				
				if(_self.options.timer) {
					_self.direction = 1;
					_self._setTimer();
				}
			})
		},

		//=====================================================================
		// _fade : Private Function
		//
		// @returns : $.Deferred();
		//
		// Function to be called when the transitionType property is set to
		// 'fade'.
		//=====================================================================
		_fade : function(){
			var firstSlide = $.Deferred();
			var secondSlide = $.Deferred();
			var animationDeferred = $.Deferred();

			this.nextSlide.css({zIndex:1, opacity:0}).show();

			this.currentSlide.css({zIndex:2})

			var _self = this;
			this.TWEENER.to(this.currentSlide, this.options.transitionTime, {
				opacity: 0,
				
				onComplete:function(){
					firstSlide.resolve();

					_self.currentSlide.hide().css({zIndex:1});
				}
			});

			this.TWEENER.to(this.nextSlide, this.options.transitionTime, {
				opacity: 1,
				
				onComplete:function(){
					secondSlide.resolve();
				}
			});

			_self = this;
			$.when(firstSlide, secondSlide).then(function(){
				_self.currentIndex = _self.nextIndex;

				animationDeferred.resolve();
			});

			return animationDeferred;
		},

		//=====================================================================
		// _slide : Private Function
		//
		// @returns : $.Deferred();
		//
		// Function to be called when the transitionType property is set to
		// 'slide'.
		//=====================================================================
		_slide : function(){
			var firstSlide = $.Deferred();
			var secondSlide = $.Deferred();
			var animationDeferred = $.Deferred();

			this.nextSlide
				.css({left: (this.options.slideWidth * this.direction)})
				.show();

			var _self = this;
			this.TWEENER.to(this.currentSlide, this.options.transitionTime, {
				left: "+="+(this.options.slideWidth * (this.direction * -1)),
				
				onComplete:function(){
					firstSlide.resolve();

					_self.currentSlide
						.hide()
						.css({left:0});
				}
			});

			this.TWEENER.to(this.nextSlide, this.options.transitionTime, {
				left: 0,
				
				onComplete:function(){
					secondSlide.resolve();
				}
			});

			_self = this;
			$.when(firstSlide, secondSlide).then(function(){
				_self.currentIndex = _self.nextIndex;

				animationDeferred.resolve();
			});

			return animationDeferred;
		},

		//=====================================================================
		// _setupSlideFluidHeight : Private Function
		//
		// Sets up the height of the root to the current slide's height
		//=====================================================================
		_setupSlideFluidHeight: function(){
			this.slides.css("height", "auto");
			this.root.addClass("fluid");

			var h = this.currentSlide.outerHeight();
			this.TWEENER.to(this.root, 0, { height:h });
		},

		//=====================================================================
		// _slideFluidHeight : Private Function
		//
		// @returns : $.Deferred();
		//
		// Function to be called when the transitionType property is set to
		// 'slideFluid'.
		//=====================================================================
		_slideFluidHeight : function(){
			var firstSlide = $.Deferred();
			var secondSlide = $.Deferred();
			var animationDeferred = $.Deferred();

			this.nextSlide
				.css({left: (this.options.slideWidth * this.direction)})
				.show();
				
			var _self = this;

			this.TWEENER.to(this.currentSlide, this.options.transitionTime, {
				left: "+="+(this.options.slideWidth * (this.direction * -1)),
				ease: this.options.ease,
				delay: this.options.transitionTime / 2,
				onComplete:function(){
					firstSlide.resolve();

					_self.currentSlide
						.hide()
						.css({left:0});
				}
			});

			var h = this.nextSlide.outerHeight();

			var _self = this;
			this.nav.fadeOut(this.options.fadeInTransitionTime, function(){ _self.root.css('height', h); })
					.fadeIn(this.options.fadeInTransitionTime);
			this.TWEENER.to(this.nextSlide, this.options.transitionTime, {
				left: 0,
				delay: this.options.transitionTime / 2,
				
				onComplete:function(){
					secondSlide.resolve();
				}
			});
			_self.currentIndex = _self.nextIndex;
			this._updateNav();

			$.when(firstSlide, secondSlide).then(function(){

				animationDeferred.resolve();
			});

			return animationDeferred;
		},

		//=====================================================================
		// _setTimer : Private Function
		//
		// Sets the timeout function to call _initSlides after each tick.
		//=====================================================================
		_setTimer : function(){
			var _self = this;

			this.timer = setTimeout(function(){
				_self._initSlides();
				_self._changeSlide();
			}, this.options.timer);
		},

		//=====================================================================
		// resetTimer : Public Function
		//
		// Resets the timeout the timer
		//=====================================================================
		resetTimer : function(){
			var _self = this;
			clearTimeout(this.timer);
			this._setTimer();
		},

		//=====================================================================
		// stopTimer : Private Function
		//
		// Stops the timer
		//=====================================================================
		stopTimer : function(){
			var _self = this;
			clearTimeout(this.timer);
		}
	};

	$.fn.neutrino = function(options) {
		if(this.length) {
			return this.each(function(){
				var neutrino = Object.create(Neutrino);
				neutrino.init(options, this);
				$.data(this, 'neutrino', neutrino);
			})
		}
	};
})(jQuery)