dex.color = {};

dex.color.toHex = function(color)
{
  if (color.substr(0, 1) === '#')
  {
    return color;
  }
  //console.log("COLOR: " + color)
  var digits = /rgb\((\d+),(\d+),(\d+)\)/.exec(color);
  //console.log("DIGITS: " + digits);
  var red = parseInt(digits[1]);
  var green = parseInt(digits[2]);
  var blue = parseInt(digits[3]);
    
  var rgb = blue | (green << 8) | (red << 16);
  return '#' + rgb.toString(16);
};

dex.color.colorScheme = function(colorScheme, numColors)
{
  if (colorScheme == "1")
  {
   return d3.scale.category10();
  }
  else if (colorScheme == "2")
  {
    return d3.scale.category20();
  }
  else if (colorScheme == "3")
  {
    return d3.scale.category20b();
  }
  else if (colorScheme == "4")
  {
    return d3.scale.category20c();
  }
  else if (colorScheme == "HiContrast")
  {
    return d3.scale.ordinal().range(colorbrewer[colorScheme][9]);
  }
  else if (colorScheme in colorbrewer)
  {
    //console.log("LENGTH: " + len);
    
    var effColors = Math.pow(2, Math.ceil(Math.log(numColors) / Math.log(2)));
    //console.log("EFF LENGTH: " + len);

    // Find the best cmap:
    if (effColors > 128)
    {
      effColors = 256;
    }

    for (var c=effColors; c >= 2; c--)
    {
      if (colorbrewer[colorScheme][c])
      {
        return d3.scale.ordinal().range(colorbrewer[colorScheme][c]);
      }
    }
    for (var c=effColors; c <= 256; c++)
    {
      if (colorbrewer[colorScheme][c])
      {
        return d3.scale.ordinal().range(colorbrewer[colorScheme][c]);
      }
    }
    return d3.scale.category20();
  }
  else
  {
    return d3.scale.category20();
  }
};
