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
