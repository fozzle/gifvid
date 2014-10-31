;(function(exports) {
  /*
  * The classic, one large image with a montage of smaller background images
  *
  * @Giant
  */

  var Giant = function(el, bg, fg) {
    this.el = el;
    this.gifs = [bg, fg];

    this.render();
  }

  // Extend for future 'subclass'
  Giant.prototype = kutil.extend({}, {
    /*
    * Initialize dom as needed
    *
    * @method render
    */
    render: function() {
      this.el.style.backgroundImage = 'url(' + this.gifs[1].original.url + ')';
      this.el.style.backgroundSize = 'cover';
    },

    destroy: function() {
      this.el.innerHTML = '';
      this.el.style.backgroundImage = 'none';
      this.el.style.backgroundSize = 'auto';
    }
  });

  exports.giant = Giant;
})(Scenes);