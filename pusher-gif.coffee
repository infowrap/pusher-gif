pusherMake = (width, height) ->

  area = width * height
  pixels = new Array area
  pixels[_i] = 0 for index in [1...area] by 1
  make_glif width, height, pixels

document.write """<img src="#{pusherMake 300, 100}">"""
