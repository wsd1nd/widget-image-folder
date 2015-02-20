if (typeof angular !== "undefined") {
  angular.module("risevision.common.i18n.config", [])
    .constant("LOCALES_PREFIX", "components/rv-common-i18n/dist/locales/translation_")
    .constant("LOCALES_SUFIX", ".json");

  angular.module("risevision.widget.common.storage-selector.config")
    .value("STORAGE_MODAL", "http://storage.risevision.com/~rvi/storage-client-rva-test/storage-modal.html#/files/");
}

/* global gadgets */
var RiseVision = RiseVision || {};
RiseVision.ImageFolder = {};

RiseVision.ImageFolder = (function (gadgets) {
  "use strict";

  var params,
    storage = null,
    slider = null,
    prefs = new gadgets.Prefs();

  /*
   *  Private Methods
   */
  function init() {
    var id = prefs.getString("id");

    params.width = prefs.getInt("rsW");
    params.height = prefs.getInt("rsH");
    storage = new RiseVision.ImageFolder.Storage(params);

    gadgets.rpc.register("rsparam_set_" + id, storage.getCompanyId);
    gadgets.rpc.call("", "rsparam_get", null, id, "companyId");
  }

  /*
   *  Public Methods
   */
  function setParams(names, values) {
    if (Array.isArray(names) && names.length > 0 && names[0] === "additionalParams") {
      if (Array.isArray(values) && values.length > 0) {
        params = JSON.parse(values[0]);

        document.getElementById("container").style.height = prefs.getInt("rsH") + "px";
        init();
      }
    }
  }

  function initSlider(urls) {
    if (slider === null) {
      slider = new RiseVision.ImageFolder.Slider(params);
      slider.init(urls);
    }
  }

  function ready() {
    gadgets.rpc.call("", "rsevent_ready", null, prefs.getString("id"), true,
      true, true, true, true);
  }

  function done() {
    gadgets.rpc.call("", "rsevent_done", null, prefs.getString("id"));
  }

  function play() {
    slider.play();
  }

  function pause() {
    slider.pause();
  }

  function stop() {
    pause();
  }

  return {
    "ready": ready,
    "done": done,
    "play": play,
    "pause": pause,
    "stop": stop,
    "setParams": setParams,
    "initSlider": initSlider
  };
})(gadgets);

var RiseVision = RiseVision || {};
RiseVision.ImageFolder = RiseVision.ImageFolder || {};

RiseVision.ImageFolder.Slider = function (params) {
  "use strict";

  var totalSlides = 0,
    api = null,
    navTimer = null,
    slideTimer = null,
    isLastSlide = false,
    isPaused = false,
    navTimeout = 3000;

  /*
   *  Private Methods
   */
  function addSlides(urls) {
    var list = document.querySelector(".tp-banner ul"),
      fragment = document.createDocumentFragment(),
      slides = [],
      slide = null,
      image = null,
      position = "";

    totalSlides = urls.length;

    urls.forEach(function(url) {
      slide = document.createElement("li");
      image = document.createElement("img");

      // Transition
      slide.setAttribute("data-transition", "fade");
      slide.setAttribute("data-masterspeed", 500);

      image.src = url;

      // Alignment
      switch (params.position) {
        case "top-left":
          position = "left top";
          break;
        case "top-center":
          position = "center top";
          break;
        case "top-right":
          position = "right top";
          break;
        case "middle-left":
          position = "left center";
          break;
        case "middle-center":
          position = "center center";
          break;
        case "middle-right":
          position = "right center";
          break;
        case "bottom-left":
          position = "left bottom";
          break;
        case "bottom-center":
          position = "center bottom";
          break;
        case "bottom-right":
          position = "right bottom";
          break;
        default:
          position = "left top";
      }

      image.setAttribute("data-bgposition", position);

      // Scale to Fit
      if (params.scaleToFit) {
        image.setAttribute("data-bgfit", "contain");
      }
      else {
        image.setAttribute("data-bgfit", "normal");
      }

      slide.appendChild(image);
      slides.push(slide);
    });

    slides.forEach(function(slide) {
      fragment.appendChild(slide);
    });

    list.appendChild(fragment);
  }

  // User has interacted with the slideshow.
  function handleUserActivity() {
    isPaused = true;
    clearTimeout(slideTimer);

    // Move to next slide and resume the slideshow after a delay.
    slideTimer = setTimeout(function() {
      isPaused = false;
      api.revnext();
      api.revresume();
    }, params.pause * 1000);

    hideNav();
  }

  // Hide the navigation after a delay.
  function hideNav() {
    if (params.autoHide) {
      clearTimeout(navTimer);

      navTimer = setTimeout(function() {
        $(".tp-leftarrow, .tp-rightarrow").addClass("hidearrows");
      }, navTimeout);
    }
  }

  /*
   *  Public Methods
   */
  function init(urls) {
    addSlides(urls);

    api = $(".tp-banner").revolution({
      "delay": params.duration * 1000,
      "hideThumbs": 0,
      "hideTimerBar": "on",
      "navigationType": "none",
      "onHoverStop": "off",
      "startwidth": params.width,
      "startheight": params.height
    });

    api.bind("revolution.slide.onloaded", function() {
      // Pause slideshow since it will autoplay and this is not configurable.
      api.revpause();
      RiseVision.ImageFolder.ready();
    });

    api.bind("revolution.slide.onchange", function (e, data) {
      if (isPaused) {
        api.revpause();
      }
      // Don't call "done" if user is interacting with the slideshow.
      else {
        if (isLastSlide) {
          isLastSlide = false;
          api.revpause();
          RiseVision.ImageFolder.done();
        }
      }

      if (data.slideIndex === totalSlides) {
        isLastSlide = true;
      }
    });

    // Swipe the slider.
    $("body").on("touchend", ".tp-banner", function() {
      handleUserActivity();
      $(".tp-leftarrow, .tp-rightarrow").removeClass("hidearrows");
    });

    // Touch the navigation arrows.
    $("body").on("touchend", ".tp-leftarrow, .tp-rightarrow", function() {
      handleUserActivity();
    });

    hideNav();
  }

  function play() {
    if (api) {
      api.revresume();
    }
  }

  function pause() {
    if (api) {
      api.revpause();
    }
  }

  return {
    "init": init,
    "play": play,
    "pause": pause
  };
};

var RiseVision = RiseVision || {};
RiseVision.ImageFolder = RiseVision.ImageFolder || {};

RiseVision.ImageFolder.Storage = function (params) {
  "use strict";

  var companyId = "";

  /*
   *  Private Methods
   */
  function init() {
    var storage = document.querySelector("rise-storage"),
      sort = "",
      sortDirection = "";

    storage.addEventListener("rise-storage-response", function(e) {
      RiseVision.ImageFolder.initSlider(e.detail);
    });

    storage.setAttribute("companyId", companyId);
    storage.setAttribute("folder", params.storage.folder);

    // Sorting
    switch (params.order) {
      case "alpha-asc":
        sort = "name";
        sortDirection = "asc";
        break;
      case "alpha-desc":
        sort = "name";
        sortDirection = "desc";
        break;
      case "date-asc":
        sort = "date";
        sortDirection = "asc";
        break;
      case "date-desc":
        sort = "date";
        sortDirection = "desc";
        break;
      case "random":
        sort = "random";
        break;
      default:
        sort = "name";
        sortDirection = "asc";
    }

    storage.setAttribute("sort", sort);
    storage.setAttribute("sortDirection", sortDirection);
    storage.go();
  }

  /*
   *  Public Methods
   */
  function getCompanyId(name, value) {
    if (name === "companyId") {
      companyId = value;
      init();
    }
  }

  return {
    "getCompanyId": getCompanyId
  };
};

/* global RiseVision, gadgets */
(function (window, document, gadgets) {
  "use strict";

  var id = new gadgets.Prefs().getString("id");

  window.oncontextmenu = function () {
    return false;
  };

  document.body.onmousedown = function() {
    return false;
  };

  function play() {
    RiseVision.ImageFolder.play();
  }

  function pause() {
    RiseVision.ImageFolder.pause();
  }

  $(document).ready(function() {
    gadgets.rpc.register("rscmd_play_" + id, play);
    gadgets.rpc.register("rscmd_pause_" + id, pause);

    gadgets.rpc.register("rsparam_set_" + id, RiseVision.ImageFolder.setParams);
    gadgets.rpc.call("", "rsparam_get", null, id, ["additionalParams"]);
  });
})(window, document, gadgets);

/* jshint ignore:start */
var _gaq = _gaq || [];

_gaq.push(['_setAccount', 'UA-57092159-5']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();
/* jshint ignore:end */
