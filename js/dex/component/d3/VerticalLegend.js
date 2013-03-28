VerticalLegend.prototype = new DexComponent();
VerticalLegend.constructor = VerticalLegend;

function VerticalLegend(userConfig)
{
  DexComponent.call(this, userConfig,
  {
    'labels'          : [ "A", "B", "C" ],
    'id'              : "VerticalLegend",
    'class'           : "VerticalLegend",
    'parent'          : null,
    'xoffset'         : 50,
    'yoffset'         : 30,
    'cellWidth'       : 30,
    'cellHeight'      : 20,
    'tickLength'      : 5,
    'caption'         : "Legend",
    'color'           : d3.scale.category20c(),
    'captionFontSize' : 14,
    'captionXOffset'  : -30,
    'captionYOffset'  : -20,
  });

  // Ugly, but my JavaScript is weak.  When in handler functions
  // this seems to be the only way to get linked back to the
  // this.x variables.
  this.chart = this;
}

VerticalLegend.prototype.render = function()
{
  this.update();
};

VerticalLegend.prototype.update = function()
{
	// If we need to call super:
	//DexComponent.prototype.update.call(this);
 	var chart = this.chart;
  var config = this.config;
  
  // Create our x scale
  var y = d3.scale.ordinal()
    .domain(config.labels)
    .range(d3.range(config.labels.length).map(function(i) { return i * config.cellHeight; }));

  // Create the x axis.
  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickSize(config.tickLength)
    .tickPadding(10)
    .tickValues(config.labels)
    .tickFormat(function(d) { return d; });

  // Append a graphics node to the supplied svg node.
  var chartContainer = config.parent.append("g")
    .attr("id", config["id"])
    .attr("class", config["class"])
    .attr("transform",
      "translate(" + config.xoffset + "," + config.yoffset + ")");

  // Draw a colored rectangle for each ordinal range.
  chartContainer.selectAll("rect")
    .data(config.labels)
    .enter().append("rect")
    .attr("height", config.cellHeight)
    .attr("y", function(d, i) { return y(i); })
    .attr("width", config.cellWidth)
    .style("fill", function(d, i)
    {
      return config.color(i);
    });

  // Add the caption.
  chartContainer.call(yAxis).append("text")
    .attr("class", "caption")
    .attr("y", config.captionYOffset)
    .attr("x", config.captionXOffset)
    .text(config.caption)
    .style("font-size", config.captionFontSize);
};
