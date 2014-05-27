var gifVid = (function() {
  var GIPHY_API_KEY = "dc6zaTOxFJmzC",
    GIPHY_URL = "http://api.giphy.com/v1/gifs/search",
    GIFSET = {
      "foreground": [],
      "background": []
    },
    player,
    decoded_url,
    bgSwitcher;

  

  var init = function() {
    /* Look for url params, if so, do the stuff */
    decoded_url = decodeURL();

    if (decoded_url) {
      console.log(decoded_url);
      getTag(decoded_url.background, "background", function() {
        getTag(decoded_url.foreground, "foreground", function() {
          getYoutube(decoded_url.music);
        });
      });
    } 

    $(".controls").on('click', '.hide', function() {
      console.log("hide click");
    });

    $(".controls").on('click', '.show', function() {
      console.log("show click");
    });


  }

  var decodeURL = function() {
    var raw_params = window.location.search;

    raw_params = window.location.search.replace(/^\?/, '')

    if (!raw_params) {
      return null
    }

    return raw_params.split('&').reduce(function(prev, param) { 
      var parts = param.replace(/\+/g, ' ').split('='); 
      prev[parts[0]] = parts[1] === undefined ? null : decodeURIComponent(parts[1]); 
      return prev; 
    }, {});

  }

  var getTag = function(tag, position, callback) {
    $.getJSON(GIPHY_URL + "?&api_key=" + GIPHY_API_KEY + "&q=" + encodeURIComponent(tag) + "&limit=100&callback=?", 
      function(data) {
        setGifs(data, position);
        if (callback) {
          callback();
        }
      });
  }

  var setGifs = function(data, position) {
    var response = data.response;
    for (var i = 0; i < response.length; i++) {
      var gifUrl = getGif(response[i]);
      if (gifUrl) {
        GIFSET[position].push(gifUrl);
      }
    }
  }

  var getGif = function(post) {
    var photos = post.photos;
    if (post.type === "photo") {
      for (var i = 0; i < photos.length; i++) {
        if (photos[i].original_size.url.match(/.gif/)) {
          return photos[i].original_size.url;
        }
      }
    }

    return false;
  }

  /* If player is loaded, play the video and start the random images */
  var onPlayerReady = function(e) {
    e.target.playVideo();

    console.log(GIFSET);

    $('.ondeck .background').css('background-image', 'url(' + GIFSET.background[Math.floor(Math.random() * GIFSET.background.length)] + ')');
    $('.ondeck .foreground').css('background-image', 'url(' + GIFSET.foreground[Math.floor(Math.random() * GIFSET.foreground.length)] + ')');
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
    var id = url.match(/https?:\/\/youtu\.be\/([\w\-]+)/) || url.match(/https?:\/\/www\.youtube\.com\/watch\?v=([\w\-]+)/);

    /* Get YT vid */
    if (id) {
      id = id[1];
      player = new YT.Player('player', {
        height: '390',
        width: '640',
        videoId: id,
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
    $('.active').removeClass('active').addClass('temp');
    $('.ondeck').removeClass('ondeck').addClass('active');
    $('.temp').removeClass('temp').addClass('ondeck');

    // Replace ondeck
    $('.ondeck .background').css('background-image', 'url(' + GIFSET.background[Math.floor(Math.random() * GIFSET.background.length)] + ')');
    $('.ondeck .foreground').css('background-image', 'url(' + GIFSET.foreground[Math.floor(Math.random() * GIFSET.foreground.length)] + ')');
  }


  return {
    init: init
  }

})();

$(document).ready(function() {
  gifVid.init();
});