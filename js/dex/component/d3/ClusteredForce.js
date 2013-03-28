ClusteredForce.prototype = new DexComponent();
ClusteredForce.constructor = ClusteredForce;

function ClusteredForce(userConfig)
{
  DexComponent.call(this, userConfig,
  {
    'parent'             : null,
    'id'                 : "ClusteredForce",
    'class'              : "ClusteredForce",
    'height'             : 600,
    'width'              : 600,
    'csv'                :
    {
    	'header' : [ "X", "Y" ],
    	'data'   : [[0,0],[1,1],[2,4],[3,9],[4,16]]
    },
    'xi'                 : 0,
    'yi'                 : 2,
    'xoffset'            : 0,
    'yoffset'            : 0,
    'color'              : d3.scale.category20(),
    'padding'            : 0,
    'sizingFunction'     : function() { return d3.scale.linear() },
    'minRadius'          : 1,
    'maxRadius'          : 20,
    'gravity'            : 100,
    'charge'             : 0,
    'scaleColumns'       : true
  });

  this.chart = this;
}

ClusteredForce.prototype.render = function()
{
  this.update();
};

ClusteredForce.prototype.update = function()
{
	// If we need to call super:
	//DexComponent.prototype.update.call(this);
 	var chart  = this.chart;
  var config = this.config;
  var csv    = config.csv;

  var numericHeaders = dex.csv.getNumericColumnNames(csv);
  var numericIndices = dex.csv.getNumericIndices(csv);

  var i;

  var m = numericHeaders.length,
    radius = d3.scale.sqrt().range([0, 12]);
 
  var n = (dex.length - 1) * numericHeaders.length;

  var minValue, maxValue;

  if (!config.scaleColumns)
  {
    minValue = dex.matrix.min(csv.data, numericIndices[0]);
    maxValue = dex.matrix.max(csv.data, numericIndices[0]);
    for (i=1; i<numericIndices.length; i++)
    {
      minValue = Math.min(minValue, dex.matrix.min(csv.data, numericIndices[i]));
      maxValue = Math.max(maxValue, dex.matric.max(csv.data, numericIndices[i]));
    }
  }

  var nodes = [];

  this.scaleNodes = function(minRadius, maxRadius)
  {
    var numericScales = [];

    for (i=0; i<numericIndices.length; i++)
    {
      if (config.scaleColumns)
      {
        minValue = dex.matrix.min(csv.data, numericIndices[i]);
        maxValue = dex.matrix.max(csv.data, numericIndices[i]);
      }

      //console.log("I: " + i + ", MIN: " + minValue + ", MAX: " + maxValue);
  
      numericScales.push(config.sizingFunction()
        .domain([minValue, maxValue]).range([config.minRadius, config.maxRadius]));
    }

    if (nodes.length == 0)
    {
      nodes = new Array((csv.data.length-1) * numericIndices.length);
    }

    for (var ri=1; ri<csv.data.length; ri++)
    {
      for (var ci=0; ci<numericIndices.length; ci++)
      {
        var label = "<table border='1'>";
        for (var hi=0; hi<csv.data[ri].length; hi++)
        {
          if (hi == numericIndices[ci])
          {
            label += "<tr><td><b>" + csv.data[0][hi] + "</b></td><td><b>" + csv.data[ri][hi] + "</b></td></tr>";
          }
          else
          {
            label += "<tr><td>" + csv.data[0][hi] + "</td><td>" + csv.data[ri][hi] + "</td></tr>";
          }
        }
        label += "</table>";
 
        nodes[(ri-1) * numericIndices.length + ci] =
        {
          radius: numericScales[ci](csv.data[ri][numericIndices[ci]]),
          //radius: radius(0.1),
          color: config.color(ci),
          text: label
        };
      }
    }
  }

  this.scaleNodes(config.minRadius, config.maxRadius);

  force = d3.layout.force()
    .nodes(nodes)
    .size([config.width, config.height])
    .gravity(config.gravity/100.0)
    .charge(config.charge/100.0)
    .on("tick", tick)
    .start();

  var chartContainer = config.parent.append("g")
    .attr("id", config["id"])
    .attr("class", config["class"])
    .attr("transform", "translate(" + config.xoffset + "," + config.yoffset + ")");

  var circle = chartContainer.selectAll("circle")
    .data(nodes)
    .enter().append("circle")
    .attr("r", function(d) { return (dex.object.isNumeric(d.radius) ? d.radius : 1); })
    .style("fill", function(d) { return d.color; })
    .attr("title", function(d) { return d.text; })
    .call(force.drag);

function tick(e) {
  circle
      .each(cluster(10 * e.alpha * e.alpha))
      .each(collide(.5))
      .attr("radius", function(d) { return (dex.object.isNumeric(d.radius) ? d.radius : 1); })
      .attr("cx", function(d) { return (dex.object.isNumeric(d.x) ? d.x : 0); })
      .attr("cy", function(d) { return (dex.object.isNumeric(d.y) ? d.y : 0); });
}

// Move d to be adjacent to the cluster node.
function cluster(alpha) {
  var max = {};

  // Find the largest node for each cluster.
  nodes.forEach(function(d) {
    if (!(d.color in max) || (d.radius > max[d.color].radius)) {
      max[d.color] = d;
    }
  });

  return function(d) {
    var node = max[d.color],
        l,
        r,
        x,
        y,
        i = -1;

    if (node == d) return;

    x = d.x - node.x;
    y = d.y - node.y;
    l = Math.sqrt(x * x + y * y);
    r = d.radius + node.radius;
    if (l != r) {
      l = (l - r) / l * alpha;
      d.x -= x *= l;
      d.y -= y *= l;
      node.x += x;
      node.y += y;
    }
  };
}

// Resolves collisions between d and all other circles.
function collide(alpha) {
  var quadtree = d3.geom.quadtree(nodes);
  return function(d) {
    var r = d.radius + radius.domain()[1] + config.padding,
        nx1 = d.x - r,
        nx2 = d.x + r,
        ny1 = d.y - r,
        ny2 = d.y + r;
    quadtree.visit(function(quad, x1, y1, x2, y2) {
      if (quad.point && (quad.point !== d)) {
        var x = d.x - quad.point.x,
            y = d.y - quad.point.y,
            l = Math.sqrt(x * x + y * y),
            r = d.radius + quad.point.radius + (d.color !== quad.point.color) * config.padding;
        if (l < r) {
          l = (l - r) / l * alpha;
          d.x -= x *= l;
          d.y -= y *= l;
          quad.point.x += x;
          quad.point.y += y;
        }
      }
      return x1 > nx2
          || x2 < nx1
          || y1 > ny2
          || y2 < ny1;
    });
  };
}
};
