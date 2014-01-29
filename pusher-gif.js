angular.module("pusher-gif", []).factory("pusherGifService", function() {
  var api;
  api = {};
  api.make = function(width, height) {
    var area, index, pixels, _i;
    area = Math.floor(width * height);
    pixels = new Array(area);
    for (index = _i = 1; _i < area; index = _i += 1) {
      pixels[_i] = 0;
    }
    return make_glif(width, height, pixels);
  };
  return api;
}).directive("pusherGif", [
  "pusherGifService", "$http", function(pusherGifService, $http) {
    return {
      restrict: "A",
      scope: {
        calcWidth: '@',
        calcHeight: '@',
        constrainWidth: '@',
        fpFallback: '=?'
      },
      compile: function(tElem, tAttrs) {
        var height, width;
        if (tAttrs.width && tAttrs.height) {
          width = +tAttrs.width;
          height = +tAttrs.height;
          tElem.attr('src', pusherGifService.make(width, height));
        }
        return function(scope, element, attrs) {
          var baseUrl, fpUrlParts, setElSrc, sigPolicy;
          setElSrc = function(calcWidth, calcHeight) {
            if (scope.constrainWidth) {
              width = +scope.constrainWidth;
              height = (+calcHeight / +calcWidth) * +scope.constrainWidth;
            } else {
              width = +calcWidth;
              height = +calcHeight;
            }
            return element.attr('src', pusherGifService.make(width, height));
          };
          if (_.isUndefined(element.attr('src'))) {
            if (scope.calcWidth && scope.calcHeight) {
              return setElSrc(scope.calcWidth, scope.calcHeight);
            } else if (scope.fpFallback) {
              fpUrlParts = scope.fpFallback.url.split('?');
              baseUrl = fpUrlParts[0];
              sigPolicy = '';
              if (fpUrlParts.length > 1) {
                sigPolicy = "&" + fpUrlParts[1];
              }
              return $http({
                method: 'GET',
                url: "" + baseUrl + "/metadata?width=true&height=true" + sigPolicy
              }).then(function(result) {
                if (result && result.width && result.height) {
                  return setElSrc(result.width, result.height);
                }
              });
            }
          }
        };
      }
    };
  }
]);
