;(function(exports) {
  /*
  * The classic, one large image with a montage of smaller background images
  *
  * @cube
  */

  var Cube = function(el, bg, fg) {
    this.el = el;
    this.gifs = [bg, fg];
    this.cubeContainers = [];

    this.render();
  }

  // Extend for future 'subclass'
  Cube.prototype = kutil.extend({}, {
    /*
    * Initialize dom as needed
    *
    * @method render
    */
    render: function() {
      var currentHeight = 0, currentColumn = 0;
      while (currentHeight < this.el.clientHeight) {
        console.log("cube render loop", currentColumn, currentHeight);
        this.createCube(currentColumn * 200, currentHeight)
        currentColumn = (currentColumn + 1) % Math.ceil(this.el.clientWidth / 200 );
        if (currentColumn === 0) {
          currentHeight += 200;
        }
      }

    },

    createCube: function(x, y) {
      var cubeContainer, face, i;

      this.el.style.background = 'black';
      kutil.addClass(this.el, "cubeContainer");
      // Create cube container
      var cubeContainer = document.createElement('div');
      cubeContainer.className = 'cube';

      for (i = 0; i < 6; i++) {
        face = document.createElement('div');
        kutil.addClass(face, 'cubeFace');

        // Top bottom get diff gif
        if (i < 4) {
          face.style.backgroundImage = 'url(' + this.gifs[0].original.url + ')';
        } else {
          face.style.backgroundImage = 'url(' + this.gifs[1].original.url + ')';
        }

        cubeContainer.appendChild(face);
      }
      this.cubeContainers.push(cubeContainer); // Save for animation
      cubeContainer.style.left = x + "px";
      cubeContainer.style.top = y + "px";



      this.el.appendChild(cubeContainer);
    },

    animate: function() {
      var classes = ['spinOne', 'spinTwo'];

      var theClass = classes[Math.floor(Math.random() * classes.length)];
      for (var i = 0; i < this.cubeContainers.length; i++) {
        kutil.addClass(this.cubeContainers[i], theClass);
      }

    },

    destroy: function() {
      clearInterval(this.animationInterval);
      this.el.innerHTML = '';
      kutil.removeClass(this.el, "cubeContainer");
      this.el.style.background = 'none';
    }
  });

  exports.cube = Cube;
})(Scenes);