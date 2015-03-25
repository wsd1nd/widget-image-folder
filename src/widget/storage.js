var RiseVision = RiseVision || {};
RiseVision.ImageFolder = RiseVision.ImageFolder || {};

RiseVision.ImageFolder.Storage = function (params) {
  "use strict";

  var isLoading = true;

  /*
   *  Public Methods
   */
  function init() {
    var storage = document.querySelector("rise-storage"),
      sort = "",
      sortDirection = "";

    storage.addEventListener("rise-storage-response", function(e) {
      var urls = [];

      e.detail.files.forEach(function(file) {
        urls.push(file.url);
      });

      if (isLoading) {
        RiseVision.ImageFolder.initSlider(urls);
        isLoading = false;
      }
      else {
        RiseVision.ImageFolder.refreshSlider(urls);
      }
    });

    storage.setAttribute("companyId", params.storage.companyId);
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

  return {
    "init": init
  };
};
