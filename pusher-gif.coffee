angular.module("pusher-gif", [])
.factory("pusherGifService", () ->
  api = {}

  api.make = (width, height) ->
    area = Math.floor(width * height)
    pixels = new Array area
    pixels[_i] = 0 for index in [1...area] by 1
    make_glif width, height, pixels

  api
).directive("pusherGif", ["pusherGifService", (pusherGifService) ->

  restrict:"A"
  scope:
    calcWidth:'@'
    calcHeight:'@'
    constrainWidth:'@'
  compile: (tElem, tAttrs) ->
    if tAttrs.width and tAttrs.height
      width = +tAttrs.width
      height = +tAttrs.height
      tElem.attr('src', pusherGifService.make(width, height))

    return (scope, element, attrs) ->
      if scope.calcWidth and scope.calcHeight
        # width came from a binding
        if scope.constrainWidth
          width = +scope.constrainWidth
          height = (+scope.calcHeight/+scope.calcWidth) * +scope.constrainWidth
        else
          width = +scope.calcWidth
          height = +scope.calcHeight
        element.attr('src', pusherGifService.make(width, height))
])
