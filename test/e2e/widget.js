var system = require("system");
var e2ePort = system.env.E2E_PORT || 8099;
var url = "http://localhost:"+e2ePort+"/src/widget-e2e.html";

casper.test.begin("Image Folder Widget - e2e Testing", {
  test: function(test) {
    casper.start();

    casper.thenOpen(url, function () {
      test.assertTitle("Image Folder Widget", "Test page has loaded");
    });

    casper.then(function () {
    });

    casper.run(function runTest() {
      test.done();
    });
  }
});
