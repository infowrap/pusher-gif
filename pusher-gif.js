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
}).factory("pusherGifFPHelperService", [
  "$q", "$http", function($q, $http) {
    var api;
    api = {};
    api.metaCache = {};
    api.metadata = function(item) {
      var baseUrl, config, defer, fpUrlParts, sigPolicy;
      defer = $q.defer();
      if (api.metaCache[item.url]) {
        defer.resolve(api.metaCache[item.url]);
      } else {
        fpUrlParts = item.url.split('?');
        baseUrl = fpUrlParts[0];
        sigPolicy = '';
        if (fpUrlParts.length > 1) {
          sigPolicy = "&" + fpUrlParts[1];
        }
        config = {
          method: 'GET',
          url: "" + baseUrl + "/metadata?width=true&height=true" + sigPolicy,
          headers: {
            'X-Auth-Token': void 0
          }
        };
        $http(config).then(function(result) {
          if (result && result.data && result.data.width && result.data.height) {
            api.metaCache[item.url] = {
              width: result.data.width,
              height: result.data.height
            };
            return defer.resolve(api.metaCache[item.url]);
          }
        });
      }
      return defer.promise;
    };
    return api;
  }
]).directive("pusherGif", [
  "pusherGifService", "pusherGifFPHelperService", function(pusherGifService, fpHelper) {
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
          var setElSrc;
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
              return fpHelper.metadata(scope.fpFallback).then(function(dimensions) {
                return setElSrc(dimensions.width, dimensions.height);
              });
            }
          }
        };
      }
    };
  }
]);
