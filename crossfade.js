/* 
  TODO: add options to exnted when initializing object
  TODO add author option to crossfader 
*/
var Crossfade = Class.create();
Crossfade.prototype = {
	imagelinks: new Array(),
	timer: null,
	current: null,

	initialize: function(options) {
	  this.options = Object.extend({
			imagePath:  '#photofader img',
			caption:    'caption',
			author:     null,
			showLink:  null,
			fadeTime:   5,
			linkContainer: null
		}, options || {});

		this.caption = $(this.options.caption);
		this.author = $(this.options.author);
		this.showLink = $(this.options.showLink);
		this.linkContainer = $(this.options.linkContainer);
		this.current = 0;
		
		this.imagelinks = $$(this.options.imagePath);

		/*
		for(i = 0; i < this.imagelinks.length; i++) {
			if(i != 0) {
				Element.setOpacity(this.imagelinks[i], 0.0);
				Element.setStyle(this.imagelinks[i], { display: 'block' });
				
				//Element.hide(this.imagelinks[i]).setOpacity(0.0);
				//Element.setStyle(this.imagelinks[i], { display: 'none' });
			  
			}
		}
		*/
		//this.swapFade();
		this.initTimer();
	}, 
	
	fadeInto: function(next) {
		if (this.current == next) return;
		    
	  if (this.current != null) {
			Effect.Fade(this.imagelinks[this.current], { duration: 1, from: 1.0, to: 0, queue: { scope: 'fader'}});
		}
		
		Effect.Appear(this.imagelinks[next], { duration: 1, from: 0, to: 1.0, queue: { scope: 'fader'}});
		
		this.current = next;
		
		if (this.caption) {
		  var nextCaption = this.imagelinks[next].getAttribute('title');
		  if (nextCaption) {
  		  Element.update(this.caption, nextCaption);
  		} else {
  		  Element.update(this.caption, '');
  		}
		}
		if (this.author) {
		  var nextAuthor = this.imagelinks[next].getAttribute('author');
		  if (nextAuthor) {
  		  Element.update(this.author, nextAuthor);
  		} else {
  		  Element.update(this.author, '');
  		}
		}
		if (this.showLink) {
		  var nextUrl = this.imagelinks[next].parentNode.getAttribute('href');
		  if (nextUrl) {
		    this.showLink.href = nextUrl;
		  }
		}
		if (this.linkContainer) {
			this.highlightLink(next);
		}
	},

	goto: function(i) {
		this.stop();
	  this.fadeInto(i);
	},

	swapFade: function() {
		if(this.current + 1 == this.imagelinks.length) {
			next = 0;
		} else {
			next = this.current + 1;
		}

		this.fadeInto(next);
	},
	
	highlightLink: function(i) {
		var links = this.linkContainer.getElementsBySelector('a');
		var linkId = this.linkContainer.id;
		links.each(function(link) {
			link.removeClassName('selected');
		});
		var highlightLink = $(linkId+(i+1));
		if (highlightLink) highlightLink.addClassName('selected');
	},
	
	previous: function() {
	  this.stop(); // cancel pending timer
	  if(this.current == 0) {
			previous = this.imagelinks.length - 1;
		} else {
			previous = this.current - 1;
		}

    this.fadeInto(previous);
	},
	
	next: function() {
	  this.stop(); //cancel pending timer
	  this.swapFade();
	  this.startTimer(); //do a quick fade NOW and resume timer
	},
	
	stop: function() {
		if (this.timer) {
		  this.timer.stop();
		}
	},
	
	start: function () {
	  this.swapFade();
	  this.startTimer(); //do a quick fade NOW and resume timer
	},
	
	startStop: function() {
	  if (this.timer.timer == null) this.start();
	  else this.stop();
	},
	
	initTimer: function() {
		if (this.options.fadeTime) {
			this.timer = new PeriodicalExecuter(this.swapFade.bind(this), this.options.fadeTime);
		} else {
			this.timer = false;
		}
	},
	
	startTimer: function() {
	  this.timer.registerCallback();
	}	
}