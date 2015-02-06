var system = require("system");
var e2ePort = system.env.E2E_PORT || 8099;
var url = "http://localhost:"+e2ePort+"/src/widget-e2e.html";

casper.on("remote.message", function(message) {
  this.echo(message);
});

casper.test.begin("Image Folder Widget - e2e Testing", {
  test: function(test) {
    casper.start();

    casper.thenOpen(url, function () {
      test.assertTitle("Image Folder Widget", "Test page has loaded");
    });

    casper.then(function () {
      casper.waitFor(function waitForUI() {
        return this.evaluate(function loadSlides() {
          return document.querySelector(".tp-revslider-mainul .tp-revslider-slidesli:nth-child(1)").style.visibility = "inherit";
        });
      },
      function then() {
        test.assertEquals(this.getElementAttribute(".tp-bgimg", "data-bgfit"), "contain", "Scale to fit");
        test.assertEquals(this.getElementAttribute(".tp-bgimg", "data-bgposition"), "left top", "Alignment");

        test.comment("URLs");
        test.assertEquals(this.getElementAttribute(".tp-revslider-mainul .tp-revslider-slidesli:nth-child(1) .tp-bgimg", "src"),
          "https://url.to.circle.png", "First image URL");
        test.assertEquals(this.getElementAttribute(".tp-revslider-mainul .tp-revslider-slidesli:nth-child(2) .tp-bgimg", "src"),
          "https://url.to.home.jpg", "Second image URL");
        test.assertEquals(this.getElementAttribute(".tp-revslider-mainul .tp-revslider-slidesli:nth-child(3) .tp-bgimg", "src"),
          "https://url.to.my-image.bmp", "Third image URL");

        test.comment("Arrows");
        test.assertExists(".tp-leftarrow", "Left arrow");
        test.assertExists(".tp-rightarrow", "Right arrow");
      });
    });

    casper.run(function runTest() {
      test.done();
    });
  }
});
