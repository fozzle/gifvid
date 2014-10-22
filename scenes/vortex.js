;(function(exports) {
  /*
  * The classic, one large image with a montage of smaller background images
  *
  * @Spotlight
  */

  var Vortex = function(el, bg, fg) {
    this.el = el;
    this.gifs = [bg, fg];

    this.render();
  }

  // Extend for future 'subclass'
  Vortex.prototype = kutil.extend({}, {
    /*
    * Initialize dom as needed
    *
    * @method render
    */
    render: function() {
      var core = document.createElement('div'),
        vortexRow,
        vortex,
        gifSwitch = 1,
        fragment = document.createDocumentFragment();

      core.className = 'vortex-core';
      core.style.backgroundImage = "url("+this.gifs[gifSwitch].fixed_width.url+")";
      core.style.height = this.gifs[gifSwitch].fixed_width.width + "px";
      core.style.width = this.gifs[gifSwitch].fixed_width.width + "px";
      gifSwitch = 0;

      for (var j = 0; j < 4; j++) {

        vortexRow = document.createElement('span');
        vortexRow.className = 'vortex-row';

        for (var i = 0; i < 4 + j*2; i++) {
          vortex = document.createElement('img');
          vortex.className = 'vortex';
          vortex.src = this.gifs[gifSwitch].fixed_width.url;
          vortexRow.appendChild(vortex);
        }

        fragment.appendChild(vortexRow);
        gifSwitch = gifSwitch ? 0 : 1;
      }

      this.el.appendChild(core);
      this.el.appendChild(fragment);
    },

    animate: function() {
      var vortexes = document.querySelectorAll(".vortex"),
      style,
      translation,
      rotation,
      values,
      el;

      for (var i in vortexes) {
        el = vortexes[i];
        style = getComputedStyle(el);
        if (!style) {
          continue;
        }
        values = kutil.splitMatrix(style["-webkit-transform"]);
        translation = values.slice(4);
        rotation = Math.round(Math.atan2(values[1], values[0]) * (180/Math.PI));

        // Normalize by adding to 180
        if (rotation < 0) rotation = -rotation + 180;

        rotation += 1000;

        el.style.webkitTransform = "translate("+ translation[0] +"px,"+ translation[1] +"px) rotate("+ rotation +"deg)";
      }
    },

    destroy: function() {
      this.el.innerHTML = '';
      this.el.style.backgroundImage = 'none';
    }
  });

  exports.vortex = Vortex;
})(Scenes);