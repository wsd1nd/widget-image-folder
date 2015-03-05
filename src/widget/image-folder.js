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
    params.width = prefs.getInt("rsW");
    params.height = prefs.getInt("rsH");
    storage = new RiseVision.ImageFolder.Storage(params);
    storage.init();
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

  function refreshSlider(urls) {
    if (slider !== null) {
      slider.refresh(urls);
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
    "initSlider": initSlider,
    "refreshSlider": refreshSlider
  };
})(gadgets);
