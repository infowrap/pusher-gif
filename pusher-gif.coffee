angular.module("pusher-gif", [])
.factory("pusherGifService", () ->

  # Reduce a fraction by finding the Greatest Common Divisor and dividing by it.
  # http://stackoverflow.com/a/4652513/3126175
  # helps keep the base64 string small as possible as well as minimizing cpu cycles to create the gif
  reduce = (numerator, denominator) ->
    gcd = gcd = (a, b) ->
      (if b then gcd(b, a % b) else a)

    gcd = gcd(numerator, denominator)
    [
      numerator / gcd
      denominator / gcd
    ]

  api = {}

  api.gifCache = {}

  api.make = (width, height) ->
    ratio = reduce(Math.floor(width), Math.floor(height))
    area = Math.floor(ratio[0] * ratio[1])
    areaKey = area.toString()
    if api.gifCache[areaKey]
      return api.gifCache[areaKey]
    else
      pixels = new Array area
      pixels[_i] = 0 for index in [1...area] by 1
      # cache base64 gif
      api.gifCache[areaKey] = make_glif ratio[0], ratio[1], pixels
      return api.gifCache[areaKey]

  api
).provider("pusherGifFPHelper", ->
  _fpHeaders = undefined
  setFPHeaders: (headers) ->
    _fpHeaders = headers

  $get: ["$q", "$http", ($q, $http) ->
    api = {}

    api.metaCache = {}

    api.metadata = (item) ->
      defer = $q.defer()
      if api.metaCache[item.url]
        defer.resolve(api.metaCache[item.url])
      else
        fpUrlParts = item.url.split('?')
        baseUrl = fpUrlParts[0]
        sigPolicy = ''
        if fpUrlParts.length > 1
          sigPolicy = "&#{fpUrlParts[1]}"
        # explicitly set 'X-Auth-Token' to undefined to strip the header in case project sets $http defaults
        # filepicker does not allow that header
        config =
          method:'GET'
          url:"#{baseUrl}/metadata?width=true&height=true#{sigPolicy}"
        if _fpHeaders
          config.headers = _fpHeaders

        $http(config).then (result) ->
          if result and result.data and result.data.width and result.data.height
            api.metaCache[item.url] =
              width: result.data.width
              height: result.data.height
            defer.resolve(api.metaCache[item.url])
      defer.promise

    api
  ]
).directive("pusherGif", ["pusherGifService", "pusherGifFPHelper", (pusherGifService, fpHelper) ->

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
          fpHelper.metadata(scope.fpFallback).then (dimensions) ->
            setElSrc(dimensions.width, dimensions.height)


])


