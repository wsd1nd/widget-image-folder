var RiseVision = RiseVision || {};
RiseVision.ImageFolder = RiseVision.ImageFolder || {};

RiseVision.ImageFolder.Storage = function (params) {
  "use strict";

  var companyId = "",
    isLoading = true;

  /*
   *  Private Methods
   */
  function init() {
    var storage = document.querySelector("rise-storage"),
      sort = "",
      sortDirection = "";

    storage.addEventListener("rise-storage-response", function(e) {
      if (isLoading) {
        RiseVision.ImageFolder.initSlider(e.detail);
        isLoading = false;
      }
      else {
        RiseVision.ImageFolder.refreshSlider(e.detail);
      }
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
