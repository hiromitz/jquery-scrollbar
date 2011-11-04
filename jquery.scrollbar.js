/*!
 * Custom (Simple) Scrollbar plugin for jQuery
 *
 * Copyright (c) 2011 hiromitz
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Requires: 
 * 		jQuery 1.6+
 * TODO:
 * 		scroll horizontal & vertical combination
 */
!function($) {

var pluginName = 'scrollbar';

var Scrollbar = function(el, op) {
	// default options
	this.options = op = $.extend({}, {
		axis : 'y',
		wheel : 20,
		animate: false,
		fade: false,
		prefix: 'jsb-'
	}, op);
	
	var self = this,
		position = {
			start : 0,
			now : 0
		},
		mouse = {},
		scroll,
		enabled = false,
		
		wrapInner = '<div class="' + op.prefix + 'viewport"><div class="' + op.prefix + 'content"></div></div>',
		
		// elements
		$scrollbar = $('<div class="' + op.prefix + 'scrollbar" />'),
		$track = $('<div class="' + op.prefix + 'track" />'),
		$thumb = $('<div class="' + op.prefix + 'thumb" />'),
		
		// scrollbar elements
		$scroller = $scrollbar.append(
			$track.append($thumb)
		),
		
		axis = (op.axis === 'x'),
		direction = axis ? 'left' : 'top';
	
	// initialize
	$(el).css('position', 'relative')
		.wrapInner(wrapInner)
		.prepend($scroller);
	
	if(axis) {
		$scrollbar.addClass(op.prefix + 'scrollbar-x');
		$track.addClass(op.prefix + 'track-x');
		$thumb.addClass(op.prefix + 'thumb-x');
	}
	
	if(op.fade) {
		$scroller.hide();
		$(el).hover(
			function() { $scroller.fadeIn(); },
			function() { $scroller.fadeOut(); }
		);
	}
	
	var $viewport = $(el).find('.' + op.prefix + 'viewport'),
		$content = $(el).find('.' + op.prefix + 'content'),
		viewport = 0, content = 0, contentRatio = 0,
		track = 0, thumb = 0,
		scrollbar = {};
	
	function init() {
		update();
		
		$thumb.bind('mousedown.jsb', dragStart);
		$track.bind('mouseup.jsb', drag);
		
		// touch event for touch device
		$thumb[0].ontouchstart = function(e) {
			e.preventDefault();
			
			$thumb.unbind('mousedown.jsb');
			start(e.touches[0]);
			return false;
		};
		
		$(el).bind('mousewheel', wheel);
	}

	function update(s) {
		scroll = scroll || 0;
		track = viewport = axis ? $viewport.outerWidth() : $viewport.outerHeight();
		content = axis ? $content.outerWidth() : $content.outerHeight();
		
		contentRatio = viewport / content;
		
		thumb = Math.min(
			track,
			Math.max(0, (track * contentRatio))
		);
		scrollbar.ratio = (content / track);
		
		mouse = $thumb.offset()[direction];

		// set size
		var size = axis ? 'width' : 'height';
		$scrollbar.toggleClass('jsb-disable', contentRatio >= 1);
		$scrollbar.css(size, track);
		$track.css(size, track);
		$thumb.css(size, thumb);
		thum(scroll / scrollbar.ratio);
	}
	
	// private methods
	/**
	 * start
	 */
	function dragStart(e) {
		mouse = axis ? e.pageX : e.pageY;
		var thumbDir = parseInt($thumb.css(direction));
		
		position.start = thumbDir == 'auto' ? 0 : thumbDir;
		
		$(document).bind('mousemove.jsb', drag);
		// for touch device
		document.ontouchmove = function(ev) {
			$(document).unbind('mousemove.jsb');
			drag(ev.touches[0]);
		};
		
		$(document).bind('mouseup.jsb', dragEnd);
		$thumb.bind('mouseup.jsb', dragEnd);
		
		$thumb[0].ontouchend = document.ontouchend = function(oEvent) {
			$(document).unbind('mouseup.jsb');
			$thumb.unbind('mouseup.jsb');
			end(e.touches[0]);
		};
		return false;
	}

	/**
	 * drag end. delete all mouse events
	 */
	function dragEnd() {
		$(document).unbind('mousemove.jsb').unbind('mouseup.jsb');
		$thumb.unbind('mouseup.jsb');
		document.ontouchmove = $thumb[0].ontouchend = document.ontouchend = null;
		return false;
	}
	
	/**
	 * drag
	 */
	function drag(e) {
		if(contentRatio >= 1) return false;
		
		position.now = Math.min((track - thumb), Math.max(0, (position.start + (( axis ? e.pageX : e.pageY) - mouse))));
		scroll = position.now * scrollbar.ratio;

		scrollTo(direction, scroll);
		thum(position.now);
	}
	
	function thum(pos) {
		$thumb.css(direction, pos);
	}

	/**
	 * wheel event handler
	 */
	function wheel(e, delta, deltaX, deltaY) {
		if(!contentRatio > 0 || (axis ? deltaX : deltaY) === 0) return;
		e.preventDefault();
		
		var d = axis ? -deltaX : deltaY;
		
		scroll -= d * op.wheel;
		scroll = Math.min((content - viewport), Math.max(0, scroll));

		thum(scroll / scrollbar.ratio);
		
		scrollTo(direction, scroll);
	};

	function scrollTo(dir, delta) {
		if(dir === 'top') {
			scrollToY(delta);
		} else {
			scrollToX(delta);
		}
	}
	
	function scrollToX(delta) {
		if(op.animate) {
			$content.stop().animate({left: -delta});
		} else {
			$content.css('left', -delta);
		}
	}
	
	function scrollToY(delta) {
		if(op.animate) {
			$content.stop().animate({top: -delta});
		} else {
			$content.css('top', -delta);
		}
	}
	
	// public method
	/**
	 * update
	 */
	this.update = function(scroll) {
		update();
	};
	
	init();
};

$.fn.scrollbar = function( method, options ) {
	if(typeof method === "object") {
		options = method;
		method = null;
	}
	
	var res;
	this.each(function() {
		var inst = $.data(this, pluginName) || $.data(this, pluginName, new Scrollbar(this, options));
		if(method && typeof inst[method] === 'function') {
			res = inst[method](options);
		}
	});
	return res || this;
};

}(jQuery);