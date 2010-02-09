var Crossfade = Class.create();
Crossfade.prototype = {
  imagelinks: new Array(),
  timer: null,
  current: null,

  initialize: function(options) {
    this.options = Object.extend({
      imagePath:  '#photofader .photo',
      title:      '#photocaption',
      alt:        '#photoalt',
      showLink:   null,
      fadeTime:   5,
      linkContainer: null
    }, options || {});

    this.title = $(this.options.title);
    this.alt = $(this.options.alt);
    this.showLink = $(this.options.showLink);
    this.linkContainer = $(this.options.linkContainer);
    this.current = 0;

    this.imagelinks = $$(this.options.imagePath);

    for(i = 0; i < this.imagelinks.length; i++) {
      if(i != 0) {
        Element.hide(this.imagelinks[i]).setOpacity(0.0);        
      }
    }
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
    var nextImage = this.nextImage(next);
        
    if (this.title) {
      var nextTitle = nextImage.getAttribute('title');
      if (nextTitle) {
        Element.update(this.title, nextTitle);
      } else {
        Element.update(this.title, '');
      }
    }
    if (this.alt) {
      var nextAlt = nextImage.getAttribute('alt');
      if (nextAlt) {
        Element.update(this.alt, nextAlt);
      } else {
        Element.update(this.alt, '');
      }
    }
    
    if (this.showLink) {
      var nextUrl = nextImage.up('a').getAttribute('href');
      if (nextUrl) {
        this.showLink.href = nextUrl;
      }
    }
    
    if (this.linkContainer) {
      this.highlightLink(next);
    }
  },
  
  nextImage: function(next) {
    var element = this.imagelinks[next];
    return element.match('img') ? element : element.down('img');
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
    
    return false;
  },
  
  next: function() {
    this.stop(); //cancel pending timer
    this.swapFade();
    this.startTimer(); //do a quick fade NOW and resume timer
    
    return false;
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
    
    return false;
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