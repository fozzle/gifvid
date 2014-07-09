;(function(exports) {
  /*
  * The classic, one large image with a montage of smaller background images
  *
  * @Spotlight
  */

  var Spotlight = function(el, gif1, gif2) {
    this.el = el;
    this.gifs = [gif1, gif2];

    this.render();
  }

  // Extend for future 'subclass'
  Spotlight.prototype = kutil.extend({}, {
    /*
    * Initialize dom as needed
    *
    * @method render
    */
    render: function() {
      var fg = document.createElement('div');
      fg.className = 'spotlight';
      fg.style.backgroundImage = 'url(' + this.gifs[0].original.url + ')';
      this.el.appendChild(fg);
      this.el.style.backgroundImage = 'url(' + this.gifs[1].fixed_height.url + ')';
    },

    destroy: function() {
      this.el.innerHTML = '';
      this.el.style.backgroundImage = 'none';
    }
  });

  exports.spotlight = Spotlight;
})(Scenes);