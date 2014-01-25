angular.module("pusher-gif", []).factory("pusherGifService", function() {
  var api;
  api = {};
  api.make = function(width, height) {
    var area, index, pixels, _i;
    area = width * height;
    pixels = new Array(area);
    for (index = _i = 1; _i < area; index = _i += 1) {
      pixels[_i] = 0;
    }
    return make_glif(width, height, pixels);
  };
  return api;
}).directive("pusherGif", [
  "pusherGifService", function(pusherGifService) {
    return {
      restrict: "A",
      compile: function(tElem, tAttrs) {
        var height, width;
        width = +tAttrs.width;
        height = +tAttrs.height;
        tElem.attr('src', pusherGifService.make(width, height));
        return function(scope, element, attrs) {};
      }
    };
  }
]);
