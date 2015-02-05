if (typeof angular !== "undefined") {
  angular.module("risevision.common.i18n.config", [])
    .constant("LOCALES_PREFIX", "components/rv-common-i18n/dist/locales/translation_")
    .constant("LOCALES_SUFIX", ".json");

  angular.module("risevision.widget.common.storage-selector.config")
    .value("STORAGE_MODAL", "http://storage.risevision.com/~rvi/storage-client-rva-test/storage-modal.html#/files/");
}

var RiseVision = RiseVision || {};
RiseVision.ImageFolder = {};

RiseVision.ImageFolder = (function () {
  "use strict";

})();

var RiseVision = RiseVision || {};
RiseVision.ImageFolder = RiseVision.ImageFolder || {};

RiseVision.ImageFolder.Storage = function () {
  "use strict";

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

  gadgets.rpc.register("rsparam_set_" + id, RiseVision.ImageFolder.getAdditionalParams);
  gadgets.rpc.call("", "rsparam_get", null, id, ["additionalParams"]);
})(window, document, gadgets);

/* jshint ignore:start */
var _gaq = _gaq || [];

_gaq.push(['_setAccount', 'UA-57092159-3']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();
/* jshint ignore:end */
