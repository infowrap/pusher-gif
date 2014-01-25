angular.module("pusher-gif", [])
.factory("pusherGifService", () ->
  api = {}

  api.make = (width, height) ->
    area = width * height
    pixels = new Array area
    pixels[_i] = 0 for index in [1...area] by 1
    make_glif width, height, pixels

  api
).directive("pusherGif", ["pusherGifService", (pusherGifService) ->

  restrict:"A"
  compile: (tElem, tAttrs) ->

    width = +tAttrs.width
    height = +tAttrs.height

    tElem.attr('src', pusherGifService.make(width, height))

    return (scope, element, attrs) ->
      return
])
