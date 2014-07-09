var kutil = (function() {
  // DOM class utilities from http://gomakethings.com/ditching-jquery-for-vanilla-js/
  var hasClass = function (elem, className) {
      return new RegExp(' ' + className + ' ').test(' ' + elem.className + ' ');
  };

  var addClass = function (elem, className) {
      if (!hasClass(elem, className)) {
          elem.className += ' ' + className;
      }
  };

  var removeClass = function (elem, className) {
      var newClass = ' ' + elem.className.replace( /[\t\r\n]/g, ' ') + ' ';
      if (hasClass(elem, className)) {
          while (newClass.indexOf(' ' + className + ' ') >= 0 ) {
              newClass = newClass.replace(' ' + className + ' ', ' ');
          }
          elem.className = newClass.replace(/^\s+|\s+$/g, '');
      }
  };

  var parseQS = function() {
    var raw_params = window.location.search;

    // trim fat
    raw_params = raw_params.slice(-1) === "/" ? window.location.search.slice(1,-1) : window.location.search.substr(1);

    if (!raw_params) {
      return null
    }

    return raw_params.split('&').reduce(function(prev, param) {
      var parts = param.replace(/\+/g, ' ').split('=');
      prev[parts[0]] = parts[1] === undefined ? null : decodeURIComponent(parts[1]);
      return prev;
    }, {});

  };

  var param = function(obj) {
    var res = '';
    Object.keys(obj).forEach(function(key) {
      res += encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]) + "&";
    });

    return res.slice(0, -1);
  };

  return {
    hasClass: hasClass,
    addClass: addClass,
    removeClass: removeClass,
    parseQS: parseQS,
    param: param
  }
})();

var kjax = (function() {
  /*
  * XMLHttpRequest with Promises
  */

  /*
  * Make get request
  *
  * @method get
  */
  function get(url, params) {
    var promise = new Promise(function(resolve, reject) {
      var req = new XMLHttpRequest();
      if (params) url += "?" + kutil.param(params);
      req.open('GET', url);

      req.onload = function() {
        if (req.status >= 200 && req.status < 300) {
          resolve(req.response);
        } else {
          reject(Error(req.statusText));
        }
      };

      req.onerror = function() {
        reject(Error("Network error"));
      };

      req.send();
    });

    return promise;
  }

  /*
  * Make get request and parse json
  *
  * @method getJSON
  */
  function getJSON(url, params) {
    return get(url, params).then(JSON.parse);
  }


  return {
    get: get,
    getJSON: getJSON
  }
})();

var gifVid = (function() {
  var GIPHY_API_KEY = "dc6zaTOxFJmzC",
    GIPHY_URL = "http://api.giphy.com/v1/gifs/search",
    GIFSET = {
      "foreground": [],
      "background": []
    },
    player,
    controls = document.querySelector("#controls"),
    decoded_url,
    bgSwitcher;



  var init = function() {
    /* Look for url params, if so, do the stuff */
    decoded_url = kutil.parseQS();

    if (decoded_url) {
      console.log(decoded_url);
      getTag(decoded_url.background, "background").then(function(data) {
        setGifs(data, "background");

        getTag(decoded_url.foreground, "foreground").then(function(data) {
          setGifs(data, "foreground");
          getYoutube(decoded_url.music);
        });
      });
    }

    controls.querySelector('.hide').addEventListener('click', function() {
      console.log("hide click");
    });
  }

  var getTag = function(tag, position, callback) {
    var req = kjax.getJSON(GIPHY_URL, {
        api_key: GIPHY_API_KEY,
        q: tag,
        limit: 100
      });

    return req;
  }

  var setGifs = function(data, position) {
    var response = data.data;
    for (var i = 0; i < response.length; i++) {
      GIFSET[position].push(response[i].images.original.url);
    }
  }

  /* If player is loaded, play the video and start the random images */
  var onPlayerReady = function(e) {
    e.target.playVideo();

    console.log(GIFSET);

    document.querySelector('.ondeck > .background').style.backgroundImage = 'url(' + GIFSET.background[Math.floor(Math.random() * GIFSET.background.length)] + ')';
    document.querySelector('.ondeck > .foreground').style.backgroundImage = 'url(' + GIFSET.foreground[Math.floor(Math.random() * GIFSET.foreground.length)] + ')';
    randomGifs();

    var interval_length = Math.floor(Number(decoded_url.timing)) * 1000 || 10000;

    bgSwitcher = setInterval(randomGifs, interval_length);
  }

  var onPlayerStateChange = function(e) {
    if (e.data === YT.PlayerState.ENDED) {
      clearInterval(bgSwitcher);
    }
  }

  /* Retrieve YT vid */
  var getYoutube = function(url) {
    /* Parse out our ID */
    var id = url.match(/(https?:\/\/)?youtu\.be\/([\w\-]+)/) || url.match(/(https?:\/\/)?www\.youtube\.com\/watch\?v=([\w\-]+)/);

    /* Get YT vid */
    if (id) {
      id = id[2];
      player = new YT.Player('player', {
        height: '390',
        width: '640',
        videoId: id,
        origin: '*',
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange
        }
      });
    } else {
      alert('You did not provide a recognizable youtube url.');
    }

  }

  var randomGifs = function() {
    // Switch out active and ondeck
    document.querySelector('.active').className = 'temp';
    document.querySelector('.ondeck').className = 'active';
    document.querySelector('.temp').className = 'ondeck';

    // Replace ondeck
    document.querySelector('.ondeck > .background').style.backgroundImage = 'url(' + GIFSET.background[Math.floor(Math.random() * GIFSET.background.length)] + ')';
    document.querySelector('.ondeck > .foreground').style.backgroundImage = 'url(' + GIFSET.foreground[Math.floor(Math.random() * GIFSET.foreground.length)] + ')';
  }


  return {
    init: init
  }

})().init();