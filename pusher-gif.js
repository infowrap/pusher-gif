var pusherMake;

pusherMake = function(width, height) {
  var area, index, pixels, _i;
  area = width * height;
  pixels = new Array(area);
  for (index = _i = 1; _i < area; index = _i += 1) {
    pixels[_i] = 0;
  }
  return make_glif(width, height, pixels);
};

document.write("<img src=\"" + (pusherMake(300, 100)) + "\">");
