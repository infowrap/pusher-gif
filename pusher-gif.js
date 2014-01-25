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
      scope: {
        calcWidth: '@',
        calcHeight: '@',
        constrainWidth: '@'
      },
      compile: function(tElem, tAttrs) {
        var height, width;
        width = height = 0;
        if (tAttrs.width && tAttrs.height) {
          width = +tAttrs.width;
          height = +tAttrs.height;
          tElem.attr('src', pusherGifService.make(width, height));
        }
        return function(scope, element, attrs) {
          if (width === 0 && height === 0) {
            if (scope.calcWidth && scope.calcHeight) {
              if (scope.constrainWidth) {
                width = +scope.constrainWidth;
                height = (+scope.calcHeight / +scope.calcWidth) * +scope.constrainWidth;
              } else {
                width = +scope.calcWidth;
                height = +scope.calcHeight;
              }
              element.attr('src', pusherGifService.make(width, height));
            }
          }
        };
      }
    };
  }
]);
