angular.module("pusher-gif", [])
.factory("pusherGifService", () ->
  api = {}

  api.make = (width, height) ->
    area = Math.floor(width * height)
    pixels = new Array area
    pixels[_i] = 0 for index in [1...area] by 1
    make_glif width, height, pixels

  api
).directive("pusherGif", ["pusherGifService", "$http", (pusherGifService, $http) ->

  restrict:"A"
  scope:
    calcWidth:'@'
    calcHeight:'@'
    constrainWidth:'@'
    fpFallback:'=?'
  compile: (tElem, tAttrs) ->
    if tAttrs.width and tAttrs.height
      width = +tAttrs.width
      height = +tAttrs.height
      tElem.attr('src', pusherGifService.make(width, height))

    return (scope, element, attrs) ->
      # linking function only used if src wasnt set by compile function above
      # usually the case when calcWidth/calcHeight is being used (dynamic bindings)

      setElSrc = (calcWidth, calcHeight) ->
        if scope.constrainWidth
          width = +scope.constrainWidth
          height = (+calcHeight/+calcWidth) * +scope.constrainWidth
        else
          width = +calcWidth
          height = +calcHeight
        element.attr('src', pusherGifService.make(width, height))

      if _.isUndefined(element.attr('src'))
        if scope.calcWidth and scope.calcHeight
          # width came from a binding
          setElSrc(scope.calcWidth, scope.calcHeight)
        else if scope.fpFallback
          # NOTE: Advanced and specific usage for integrations with filepicker (https://www.inkfilepicker.com/)
          # if calcWidth and calcHeight were undefined and the 'src' is still not set, then the dimensions were not known
          # we must get them via a 'metadata' call to filepicker
          # fpFallback should be an object with a 'url' property
          fpUrlParts = scope.fpFallback.url.split('?')
          baseUrl = fpUrlParts[0]
          sigPolicy = ''
          if fpUrlParts.length > 1
            sigPolicy = "&#{fpUrlParts[1]}"
          # explicitly set 'X-Auth-Token' to undefined to strip the header in case project sets $http defaults
          # filepicker does not allow that header
          config =
            method:'GET'
            url:"#{baseUrl}/metadata?width=true&height=true#{sigPolicy}"
            headers:
              'X-Auth-Token':undefined
          $http(config).then (result) ->
            if result and result.data and result.data.width and result.data.height
              setElSrc(result.data.width, result.data.height)


])


