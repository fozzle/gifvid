var gifVid = (function() {
  var GIPHY_API_KEY = "dc6zaTOxFJmzC",
    GIPHY_URL = "http://api.giphy.com/v1/gifs/search",
    GIFSET = {
      "foreground": [],
      "background": []
    },
    SCENES = [Scenes.pan, Scenes.spotlight],
    deckScene,
    activeScene,
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
      GIFSET[position].push(response[i].images);
    }
  }

  /* If player is loaded, play the video and start the random images */
  var onPlayerReady = function(e) {
    e.target.playVideo();

    console.log(GIFSET);

    deckScene = new SCENES[Math.floor(Math.random() * SCENES.length)](document.querySelector('.ondeck'), GIFSET.background[Math.floor(Math.random() * GIFSET.background.length)], GIFSET.foreground[Math.floor(Math.random() * GIFSET.foreground.length)]);
    randomScene();

    var interval_length = Math.floor(Number(decoded_url.timing)) * 1000 || 4000;

    bgSwitcher = setInterval(randomScene, interval_length);
  }

  var onPlayerStateChange = function(e) {
    if (e.data === YT.PlayerState.ENDED) {
      clearInterval(bgSwitcher);
    }
  }

  /* Retrieve YT vid */
  var getYoutube = function(url) {
    /* Parse out our ID */
    var id = url.match(/(https?:\/\/)?youtu\.be\/([\w\-]+)/) || url.match(/(https?:\/\/)?www\.youtube\.com\/watch\?v=([\w\-]+)/),
      player;

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

  var randomScene = function() {
    // Switch out active and ondeck
    document.querySelector('.active').className = 'temp';
    document.querySelector('.ondeck').className = 'active';
    document.querySelector('.temp').className = 'ondeck';



    // Replace ondeck
    if (activeScene) activeScene.destroy();
    activeScene = deckScene;
    deckScene = new SCENES[Math.floor(Math.random() * SCENES.length)](document.querySelector('.ondeck'), GIFSET.background[Math.floor(Math.random() * GIFSET.background.length)], GIFSET.foreground[Math.floor(Math.random() * GIFSET.foreground.length)])
  }


  return {
    init: init
  }

})().init();