;(function(exports) {
  /*
  * Animation featuring alternating left scroll and right scroll panes
  *
  * @Pan
  */

  var Pan = function(el, gif1, gif2) {
    this.el = el;
    this.gifs = [gif1, gif2];
    this.classes = ["panLeft", "panRight"];

    this.render();
  }

  // Extend for future 'subclass'
  Pan.prototype = kutil.extend({}, {
    /*
    * Initialize dom as needed
    *
    * @method render
    */
    render: function() {
      // Fill entire height with "rows" and fill each row 2x width of gifs
      var containerHeight = this.el.clientHeight,
        containerWidth = this.el.clientWidth,
        totalHeight = 0,
        step = Math.round(Math.random()),
        fragment = new DocumentFragment(),
        row,
        gif;

      while (totalHeight < containerHeight * 2) {
        row = document.createElement('div');
        gif = this.gifs[step % this.gifs.length];

        row.style.height = gif.fixed_height.height + "px";
        row.style.backgroundImage = "url(" + gif.fixed_height.url + ")";
        row.className = this.classes[step % this.classes.length];

        fragment.appendChild(row);

        totalHeight += Number(gif.fixed_height.height);
        step++;
      }

      this.el.appendChild(fragment);

    },

    destroy: function() {
      this.el.innerHTML = '';
    }
  });

  exports.pan = Pan;
})(Scenes);