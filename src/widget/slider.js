/* global _ */
var RiseVision = RiseVision || {};
RiseVision.ImageFolder = RiseVision.ImageFolder || {};

RiseVision.ImageFolder.Slider = function (params) {
  "use strict";

  var totalSlides = 0,
    $api = null,
    currentUrls = null,
    newUrls = null,
    navTimer = null,
    slideTimer = null,
    isLastSlide = false,
    refreshSlider = false,
    isLoading = true,
    isPaused = false,
    navTimeout = 3000;

  /*
   *  Private Methods
   */
  function addSlides() {
    var list = document.querySelector(".tp-banner ul"),
      fragment = document.createDocumentFragment(),
      slides = [],
      slide = null,
      image = null,
      position = "";

    totalSlides = currentUrls.length;

    currentUrls.forEach(function(url) {
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

  function onSlideChanged(data) {
    if (isPaused) {
      $api.revpause();
    }
    // Don't call "done" if user is interacting with the slideshow.
    else {
      if (isLastSlide) {
        isLastSlide = false;
        $api.revpause();
        RiseVision.ImageFolder.done();

        if (refreshSlider) {
          // Destroy and recreate the slider if the URLs have changed.
          if ($api) {
            destroySlider();
            init(newUrls);
          }

          refreshSlider = false;
        }
      }
    }

    if (data.slideIndex === totalSlides) {
      isLastSlide = true;
    }
  }

  function destroySlider() {
    // Remove event handlers.
    $("body").off("touchend");
    $api.off("revolution.slide.onloaded");
    $api.off("revolution.slide.onchange");

    // Let the slider clean up after itself.
    $api.revkill();
    $api = null;
  }

  // User has interacted with the slideshow.
  function handleUserActivity() {
    isPaused = true;
    clearTimeout(slideTimer);

    // Move to next slide and resume the slideshow after a delay.
    slideTimer = setTimeout(function() {
      isPaused = false;
      $api.revnext();
      $api.revresume();
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
   *  TODO: Test what happens when folder isn't found.
   */
  function init(urls) {
    var tpBannerContainer = document.querySelector(".tp-banner-container"),
      fragment = document.createDocumentFragment(),
      tpBanner = document.createElement("div"),
      ul = document.createElement("ul");

    tpBanner.setAttribute("class", "tp-banner");
    tpBanner.appendChild(ul);
    fragment.appendChild(tpBanner);
    tpBannerContainer.appendChild(fragment);

    currentUrls = urls;

    addSlides();

    $api = $(".tp-banner").revolution({
      "delay": params.duration * 1000,
      "hideThumbs": 0,
      "hideTimerBar": "on",
      "navigationType": "none",
      "onHoverStop": "off",
      "startwidth": params.width,
      "startheight": params.height
    });

    $api.on("revolution.slide.onloaded", function() {
      // Pause slideshow since it will autoplay and this is not configurable.
      if (isLoading) {
        $api.revpause();
        isLoading = false;
        RiseVision.ImageFolder.ready();
      }
    });

    $api.on("revolution.slide.onchange", function (e, data) {
      onSlideChanged(data);
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
    if ($api) {
      $api.revresume();
    }
  }

  function pause() {
    if ($api) {
      $api.revpause();
    }
  }

  function refresh(urls) {
    // Start preloading images right away.
    if (!_.isEqual(currentUrls, urls)) {
      RiseVision.Common.Utilities.preloadImages(urls);
      newUrls = urls;
      refreshSlider = true;
    }
  }

  return {
    "init": init,
    "play": play,
    "pause": pause,
    "refresh": refresh
  };
};
