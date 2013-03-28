BarChart.prototype = new DexComponent();
BarChart.constructor = BarChart;

function BarChart(userConfig)
{
  DexComponent.call(this, userConfig,
  {
  	// The parent container of this chart.
    'parent'           : null,
    // Set these when you need to CSS style components independently.
    'id'               : 'BarChart',
    'class'            : 'BarChart',
    // Our data...
    'csv'              :
    {
    	// Give folks without data something to look at anyhow.
    	'header'         : [ "X", "Y" ],
    	'data'           : [[0,0],[1,1],[2,4],[3,9],[4,16]]
    },
    // width and height of our bar chart.
    'width'            : 600,
    'height'           : 400,
    // The x an y indexes to chart.
    'xi'               : 0,
    'yi'               : [1],
    'xoffset'          : 20,
    'yoffset'          : 0,
    'color'            : d3.scale.category20(),
    xmin               : null,
    ymin               : null,
    'xaxis' :
    {
    	'format'      : function() { return d3.format(",.2f"); },
    	'orient'      : "bottom",
    	'label' :
    	{
    		'x'         : 300,
    		'y'         : 30,
    		'rotate'    : -90,
    		'dy'        : ".71em",
    		'font'      :
    		{
    			'size'    : 18,
    			'family'  : 'sans-serif',
    			'style'   : 'normal',
    			'variant' : 'normal',
    			'weight'  : 'normal'
    		},
    		'text'      : 'X Axis',
    		'anchor'    : 'end',
    		'color'     : 'black'
    	}
    },
    'yaxis' :
    {
    	'format'      : function() { return d3.format(",d"); },
    	'orient'      : "left",
    	'label'       :
    	{
    		'x'         : 0,
    		'y'         : -50,
    		'rotate'    : -90,
    		'dy'        : ".71em",
    		'font'      :
    		{
    			'size'    : 18,
    			'family'  : 'sans-serif',
    			'style'   : 'normal',
    			'variant' : 'normal',
    			'weight'  : 'normal'
    		},
    		'text'      : 'Y Axis',
    		'anchor'    : 'end',
    		'color'     : 'black'
    	}
    }
  });

  // Font Families: serif, sans-serif, cursive, fantasy, monospace
  // Font Style   : normal, italic, oblique
  // Font Variant : normal, small-caps
  // Font Weight  : normal, bold, 100, 200 ... 900

  // Ugly, but my JavaScript is weak.  When in handler functions
  // this seems to be the only way to get linked back to the
  // this.x variables.
  this.chart = this;
}

BarChart.prototype.render = function()
{
  this.update();
};

BarChart.prototype.update = function()
{
	// If we need to call super:
	//DexComponent.prototype.update.call(this);
 	var chart = this.chart;
  var config = this.config;

  if (config.debug)
  {
    console.log("===== Barchart Configuration =====");
    console.dir(config);
  }
  
  var yaxisFormat = d3.format(config.yaxisFormat);

  // X domain across groups.
  var x = d3.scale.ordinal()
    .domain(d3.range(config.csv.data.length))
    .rangeBands([0, config.width], .1);

  // X domain within groups.
  var x1 = d3.scale.ordinal()
    .domain(d3.range(config.yi.length))
    .rangeBands([0, x.rangeBand()]);

  // Y domain.
  var y = d3.scale.linear()
    .range([config.height, 0]);

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient(config.xaxis.orient)
    .tickFormat(config.xaxis.format());

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient(config.yaxis.orient)
    .tickFormat(config.yaxis.format());

  var chartContainer = config.parent.append("g")
    .attr("id", config.id)
    .attr("transform", "translate(" + config.xoffset + "," + config.yoffset + ")");

  var data = config.csv.data;

  // Translate all of the y data columns to numerics.
  data.forEach(function(d)
  {
  	config.yi.forEach(function(c)
  	{
  		d[c] = +d[c];
  	});
  });

  var yextent = dex.matrix.extent(data, config.yi);
  x.domain(data.map(function(d) { return d[config.xi]; }));
  //y.domain([0, d3.max(data, function(d) { return d[1]; })]);

  if (config.ymin != null)
  {
    yextent[0] = config.ymin;
  }
  if (config.ymax != null)
  {
    yextent[1] = config.ymax;
  }

  // Establish the domain of the y axis.
  y.domain(yextent);

  // X Axis
  chartContainer.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + config.height + ")")
      .call(xAxis)
    .append("text")
      .attr("x", config.xaxis.label.x)
      .attr("y", config.xaxis.label.y)
      .attr("dy", config.xaxis.label.dy)
      .attr("fill", config.xaxis.label.color)
      .style("text-anchor", config.xaxis.label.anchor)
      .attr("font-family", config.xaxis.label.font.family)
      .attr("font-weight", config.xaxis.label.font.weight)
      .attr("font-style", config.xaxis.label.font.style)
      .style("font-size", config.xaxis.label.font.size)
      .text(config.xaxis.label.text);

  // Y Axis
  chartContainer.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(" + config.yaxis.label.rotate + ")")
      .attr("y", config.yaxis.label.y)
      .attr("x", config.yaxis.label.x)
      .attr("dy", config.yaxis.label.dy)
      .attr("fill", config.yaxis.label.color)
      .style("text-anchor", config.yaxis.label.anchor)
      .attr("font-family", config.yaxis.label.font.family)
      .attr("font-weight", config.yaxis.label.font.weight)
      .attr("font-style", config.yaxis.label.font.style)
      .style("font-size", config.yaxis.label.font.size)
      .text(config.yaxis.label.text);

  var barData = dex.matrix.combine(
      	dex.matrix.slice(data, [config.xi]),
      	dex.matrix.slice(data, config.yi)
     );

  console.log("BarChart().BarData()")
  console.dir(data);
  console.dir(dex.matrix.slice(data, [config.xi]));
  console.dir(dex.matrix.slice(data, config.yi));
  console.dir(barData);

  //console.dir(dex.matrix.slice(data, config.yi));
  //console.dir(x.rangeBand());

  chartContainer.selectAll(".bar")
      .data(barData)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { //console.dir(d);
      	 return x(d[0]) + x1(d[3]) })
      .style("fill", function(d) { console.log(d[3]); return config.color(d[3]);})
      .attr("width", x.rangeBand()/config.yi.length)
      .attr("y", function(d) { console.log("Y:" + d); return y(d[1]); })
      .attr("height", function(d) { return config.height - y(d[1]); });
      
  // Add Text Labels
  /*
  chartContainer.selectAll(".label")
    .data(barData)
    .enter().append("text")
    .attr("x", function(d) { return x(d[0]) + x1(d[3]) })
    .attr("y", function(d) { return y(d[1]); })
    .attr("text-anchor", "end")
    //.attr("transform", "rotate(90)")
    .attr("dy", ".71em")
    .style("font-size", 12)
    .text(function(d) { console.log("TEXTD: " + d); return config.labels[d[3]]; });
  */
};
