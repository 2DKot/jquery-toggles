(function( $ ){

  $.fn.toggles = function(opts) {
    opts = opts || {};
    var o = {
      dragable: true,
      clickable: true,
      ontext: 'ON',
      offtext: 'OFF',
      on: true,
      animtime: 300,
      click: this
    };
    for (var i in opts) {
      if (!opts.hasOwnProperty(i)) continue;
      // overwrite defaults
      o[i] = opts[i];
    }
    var transition = 'margin-left '+o.animtime/1000+'s ease-in-out';
    var transitions = {
      '-webkit-transition': transition,
      '-moz-transition': transition,
      'transition': transition
    };
    var notrans = {
      '-webkit-transition': '',
      '-moz-transition': '',
      'transition': ''
    };
    function toggle(slide,w,h) {
      var inner = slide.find('.inner');
      inner.css(transitions);
      var active = slide.toggleClass('active').hasClass('active');
      inner.css({
        marginLeft: (active) ? 0 : -w+h
      });
      if (o.checkbox) $(o.checkbox).attr('checked',active);
      setTimeout(function() {
        inner.css({
          marginLeft: (active) ? 0 : -w+h
        });
        inner.css(notrans);
      },o.animtime);
    }

    this.each(function() {
      var self = $(this);

      // we dont want the click handler to go on all the elements
      o.click = opts.click || self;


      var h = self.height(), w= self.width();
      if (h === 0 || w===0) {
        self.height(h = 20);
        self.width(w = 50);
      }
      var slide = $('<div class="slide" />'), inner = $('<div class="inner" />'),on = $('<div class="on" />'), off = $('<div class="off" />'), blob = $('<div class="blob" />');
      on
      .css({
        height:h,
        width: w-h/2,
        textAlign: 'center',
        textIndent: -h/2,
        lineHeight: h+'px'
      })
      .text(o.ontext);
      off
      .css({
        height:h,
        width: w-h/2,
        marginLeft: -h/2,
        textAlign: 'center',
        textIndent: h/2,
        lineHeight: h+'px'
      })
      .text(o.offtext);
      blob.css({
        height: h,
        width: h,
        marginLeft: -h/2
      });
      inner.css({
        width: w*2-h,
        marginLeft: (o.on) ? 0 : -w+h
      });
      if (o.on) {
        slide.addClass('active');
        if (o.checkbox) $(o.checkbox).attr('checked',true);
      }
      self.html('');
      self.append(slide.append(inner.append(on,blob,off)));
      var diff = 0, time;
      self.on('toggle', function() {
        toggle(slide,w,h);
      });
      if (o.clickable) {
        o.click.click(function(e) {
          if (e.target !=  blob[0] || !o.dragable) {
            self.trigger('toggle');
          }      
        });
      }
      function upleave(e) {
        self.off('mousemove touchmove');
        slide.off('mouseleave touchleave');
        blob.off('mouseup touchend');
        if (diff !== 0) {
        if (slide.hasClass('active')) {
          if (diff < (-w+h)/2) {
            self.trigger('toggle');
          }else{
            inner.animate({
              marginLeft: 0
            }, o.animtime/2);
          }
        }else{
          if (diff > (w-h)/2) {
            self.trigger('toggle');
          }else{
            inner.animate({
              marginLeft: -w+h
            },o.animtime/2);
          }
        }
      }else if (o.clickable && e.type != 'mouseleave' && e.type != 'touchleave') self.trigger('toggle');
      }
      if (o.dragable) {
        blob.on('mousedown touchstart',function(e) {
          diff = 0;
          blob.off('mouseup touchend');
          slide.off('mouseleave touchleave');
          var cursor = e.pageX;
          self.on('mousemove touchmove',blob,function(e) {
            diff = e.pageX - cursor;
            if (slide.hasClass('active')) {
              inner.css({
                marginLeft: (diff < 0) ? (diff < -w+h) ? -w+h : diff : 0
              });
            }else{
              inner.css({
                marginLeft: (diff > 0) ? (diff > w-h) ? 0 : diff-w+h :-w+h
              });
            }
          });
          blob.on('mouseup touchend',upleave);
          slide.on('mouseleave touchleave',upleave);
        });
      }
    });
};
})( jQuery );