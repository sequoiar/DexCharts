ParallelCoordinates.prototype = new DexComponent();
ParallelCoordinates.constructor = ParallelCoordinates;

function ParallelCoordinates(userConfig)
{
  DexComponent.call(this, userConfig,
  {
    'id'                 : "ParallelCoordinates",
    'class'              : "ParallelCoordinates",
    'parent'             : null,
    'height'             : 400,
    'width'              : 600,
    'opacity'            : 100,
    'strokeWidth'        : 4,
    'axisFontSize'       : 16,
    'fontSize'           : 12,
    'color'              : d3.scale.category20(),
    'title'              : '',
    'csv'                :
    {
      'header' : [ "X", "Y" ],
      'data'   : [[0,0],[1,1],[2,4],[3,9],[4,16]]
    },
    'rows'               : 0,
    'columns'            : [],
    'xoffset'            : 0,
    'yoffset'            : 0,
    'normalize'          : false,
    'axisLabels'         :
    {
    	'stagger'          : false,
    	'yoffset'          : -9,
    	'staggeredYOffset' : -18
    }
  });

  this.chart = this;
}

ParallelCoordinates.prototype.render = function()
{
  this.update();
};

ParallelCoordinates.prototype.update = function()
{
 	var chart  = this.chart;
  var config = this.config;
  var csv    = config.csv;

  var numericColumns =
    dex.csv.getNumericColumnNames(csv);

  var jsonData = dex.csv.toJson(csv);

  var x = d3.scale.ordinal()
      .rangePoints([0, config.width], 1);

  var y = {};

  var line = d3.svg.line();
  var axis = d3.svg.axis().orient("left");
  // Holds unselected paths.
  var background;
  // Holds selected paths.
  var foreground;
  // Will hold our column names.
  var dimensions;

  var chartContainer = config.parent.append("g")
    .attr("id", config["id"])
    .attr("class", config["class"])
    .attr("transform",
      "translate(" + config.xoffset + "," + config.yoffset + ")");

    // Extract the list of dimensions and create a scale for each.
    //x.domain(dimensions = d3.keys(cars[0]).filter(function(d)
    //{
    //  return d != "name" && (y[d] = d3.scale.linear()
    //    .domain(d3.extent(cars, function(p) { return +p[d]; }))
    //    .range([height, 0]));
    //}));
    var allExtents = []

    numericColumns.forEach(function(d)
    {
      allExtents = allExtents.concat(d3.extent(jsonData, function(p) { return +p[d]; }));
    });
    
    var normalizedExtent = d3.extent(allExtents);

    // REM: Figure out how to switch over to consistent extends.  Snapping.
    x.domain(dimensions = d3.keys(jsonData[0]).filter(function(d)
    {
      if(d === "name") return false;

      if(dex.object.contains(numericColumns, d))
      {
        var extent = d3.extent(jsonData, function(p) { return +p[d]; });
        if (config.normalize)
        {
          extent = normalizedExtent;
        }
        
        y[d] = d3.scale.linear()
          .domain(extent)
          .range([config.height, 0]);
        allExtents.concat(extent);
      }
      else
      {
        y[d] = d3.scale.ordinal()
          .domain(jsonData.map(function(p) { return p[d]; }))
          .rangePoints([config.height, 0]);
      }

      return true;
    }));

    // Add grey background lines for context.
    background = chartContainer.append("g")
      .attr("class", "background")
      .selectAll("path")
      .data(jsonData)
      .enter().append("path")
      .attr("d", path)
      .attr("id", "fillpath");

    foreground = chartContainer.append("g")
      .attr("fill", "none")
      .attr("stroke-opacity", config.opacity/100.0)
      .selectAll("path")
      .data(jsonData)
      .enter().append("path")
      .attr("d", path)
      .attr("stroke", function(d, i) { return config.color(i); })
      .attr("stroke-width", config.strokeWidth)
      .attr("title", function(d, i)
      {
        var info = "<table border=\"1\">";
        for (var key in jsonData[i])
        {
          info += "<tr><td><b><i>" + key + "</i></b></td><td>" + jsonData[i][key] + "</td></tr>"
        }
        return info + "</table>";
      })
      .on("mouseover", function()
      {
        d3.select(this)
          .style("stroke-width", config.strokeWidth + (config.strokeWidth/3))
          .style("stroke-opacity", config.opacity/100.0);
      })
      .on("mouseout", function()
      {
        d3.select(this)
          .style("stroke-width", config.strokeWidth)
          .style("stroke-opacity", config.opacity/100);
      });

    // Add a group element for each dimension.
    var g = chartContainer.selectAll(".dimension")
      .data(dimensions)
      .enter().append("g")
      .attr("font-size", config.fontSize)
      .attr("class", "dimension")
      .attr("transform", function(d) { return "translate(" + x(d) + ")"; });

    // Add an axis and title.
    g.append("g")
      .attr("class", "axis")
      .each(function(d) { d3.select(this).call(axis.scale(y[d])); })
      .append("text")
      .attr("text-anchor", "middle")
      .attr("y", function(d,i)
      {
      	if (config.axisLabels.stagger)
      	{
      		if (i%2==1)
      		{
      		  return config.axisLabels.staggeredYOffset;
      		}
      	}

      	return config.axisLabels.yoffset;
      })
      .attr("font-size", config.axisFontSize)
      .text(String);

    // Add and store a brush for each axis.
    g.append("g")
      .attr("class", "brush")
      .each(function(d)
      {
        d3.select(this).call(y[d].brush =
        	d3.svg.brush().y(y[d])
        	.on("brush", brush)
        	.on("brushend", brushend));
      })
      .selectAll("rect")
      .attr("x", -8)
      .attr("width", 16);

  // Returns the path for a given data point.
  function path(d)
  {
    return line(dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
  }

  // Handles a brush event, toggling the display of foreground lines.
  function brush()
  {
  	// Get a list of our active brushes.
    var actives = dimensions.filter(function(p) { return !y[p].brush.empty(); }),
    
    // Get an array of min/max values for each brush constraint.
    extents = actives.map(function(p) { return y[p].brush.extent(); });

    foreground.style("display", function(d)
    {
      return actives.every(
        // P is column name, i is an index
        function(p, i)
        {
          // Categorical
          //console.log("P: " + p + ", I: " + i);
          if (!dex.object.contains(numericColumns, p))
          {
            return extents[i][0] <= y[p](d[p]) && y[p](d[p]) <= extents[i][1];
          }
          // Numeric
          else
          {
            return extents[i][0] <= d[p] && d[p] <= extents[i][1];
          }
        }) ? null : "none";
    });
  }
  
  // Handles a brush event, toggling the display of foreground lines.
  function brushend()
  {
    //dex.console.log("chart: ", chart);
    var activeData = [];

    // WARNING:
    //
    // Can't find an elegant way to get back at the data so I am getting
    // at the data in an inelegant manner instead.  Mike Bostock ever
    // changes the __data__ convention and this will break.
    for (var i=0; i<foreground[0].length; i++)
    {
    	if (!(foreground[0][i]["style"]["display"] == "none"))
    	{
    		activeData.push(foreground[0][i]['__data__']);
    	}
    }

    //dex.console.log("Selected: ", dex.json.toCsv(activeData, dimensions));
    chart.notify({ "type" : "select", "selected" : dex.json.toCsv(activeData, dimensions)});
  }
};


