LineChart.prototype = new DexComponent();
LineChart.constructor = LineChart;

function LineChart(userConfig)
{
  DexComponent.call(this, userConfig,
  {
    'parent'     : null,
    'csv'        :
    {
      'header' : [ "X", "Y" ],
      'data'   : [[0,0],[1,1],[2,4],[3,9],[4,16]]
    },
    'width'       : 600,
    'height'      : 400,
    'xi'          : 0,
    'yi'          : [1],
    'xoffset'     : 0,
    'yoffset'     : 0,
    'pointColors' : d3.scale.category20(),
    'lineColors'  : d3.scale.category20()
  });

  // Ugly, but my JavaScript is weak.  When in handler functions
  // this seems to be the only way to get linked back to the
  // this.x variables.
  this.chart = this;
}

LineChart.prototype.render = function()
{
  this.update();
};

LineChart.prototype.update = function()
{
	// If we need to call super:
	//DexComponent.prototype.update.call(this);
 	var chart = this.chart;
  var config = this.config;
  var csv    = config.csv;

  //console.dir(config);
  // Use a linear scale for x, map the value range to the pixel range.
  var x = d3.scale.linear()
    .domain(d3.extent(csv.data, function(d) { return +d[config.xi]; }))
    .range([0, config.width]);

  // Use a linear scale for y, map the value range to the pixel range.
  var y = d3.scale.linear()
    .domain(d3.extent(
      dex.matrix.flatten(dex.matrix.slice(csv.data, config.yi))))
    .range([config.height, 0]);

  // I hate this kind of stuff, but it's necessary to share
  // with mouseOver function.  There's probably a better way to do
  // it but I don't feel like blowing a couple hours figuring it out.
  this.x = x;
  this.y = y;

  // Create the x axis at the bottom.
  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

  // Create the y axis to the left.
  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

  var lines = [];

  for(var i=0; i<config.yi.length; i++)
  {
    // Define a function to draw the line.
    var line = d3.svg.line()
      .x(function(d) { return x(+d[config.xi]); })
      .y(function(d) { return y(+d[config.yi[i]]); });
    lines.push(line);
  }

  // Append a graphics node to the parent, all drawing will be relative
  // to the supplied offsets.  This encapsulating transform simplifies
  // the offsets within the child nodes.
  //config.parent.select("#lineChartContainer").remove();
  var chartContainer = config.parent.append("g")
    .attr("id", "lineChartContainer")
    .attr("transform", "translate(" + config.xoffset + "," + config.yoffset + ")");

  // Draw the x axis.
  chartContainer.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + config.height + ")")
    .call(xAxis);

  // Draw the y axis.
  chartContainer.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text(dex.array.slice(csv.header, config.yi).join(" "));

  // Draw each of the lines.
  for (var i=0; i<lines.length; i++)
  {
    chartContainer.append("path")
      .datum(csv.data)
      .attr("class", "line")
      .attr("d", lines[i])
      .style("stroke", config.lineColors(i));
  }

  // We handle mouseover with transparent rectangles.  This will calculate
  // the width of each rectangle.
  var rectalWidth = (csv.data.length > 1) ?
    x(csv.data[1][config.xi]) - x(csv.data[0][config.xi]) : 0;

  // Add the transparent rectangles for our mouseover events.
  chartContainer.selectAll("rect")
    .data(csv.data.map(function(d) { return d; }))
    .enter().append("rect")
    .attr("class", "overlay")
    .attr("transform", function(d,i) { return "translate(" + x(d[config.xi]) + ",0)"; })
    .attr("opacity", 0.0)
    .attr("width", rectalWidth)
    .attr("height", config.height)
    .on("mouseover", function(d)
    {
       var chartEvent =
         {
         	 type: "mouseover",
           data: d
         };
       chart.mouseOverHandler(chartEvent);
       chart.notify(chartEvent);
    });
    
  this.chartContainer = chartContainer;
};

LineChart.prototype.mouseOverHandler = function(chartEvent, targetChart)
{
	var chart;

  if (arguments.length === 2)
  {
  	chart = targetChart;
  }
  else
  {
  	chart = this.chart;
  }

  var config = chart.config;
  var x = chart.x;
  var y = chart.y;

  var chartContainer = chart.chartContainer;
  //console.log("Chart Container: " + typeof chart);
  //console.dir(chart);
  // Remove any old circles.
  chartContainer.selectAll("circle").remove();
  chartContainer.selectAll("#circleLabel").remove();

  // Draw a small red circle over the mouseover point.
  for (var i=0; i<config.yi.length; i++)
  {
  	//console.log("I: " + y);
    var circle = chartContainer.append("circle")
      .attr("fill", config.pointColors(i))
      .attr("r", 4)
      .attr("cx", x(chartEvent.data[config.xi]))
      .attr("cy", y(chartEvent.data[config.yi[i]]));

    chartContainer.append("text")
      .attr("id", "circleLabel")
      .attr("x", x(chartEvent.data[config.xi]))
      .attr("y", y(chartEvent.data[config.yi[i]]) - 10)
      .attr("dy", ".35m")
      .style("font-size", 14)
      .attr("text-anchor", "top")
      .attr("fill", "black")
      .text(function(d) { return chartEvent.data[config.yi[i]];});
  }
};

