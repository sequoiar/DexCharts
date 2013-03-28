PieChart.prototype = new DexComponent();
PieChart.constructor = PieChart;

function PieChart(userConfig)
{
  DexComponent.call(this, userConfig,
  {
    'parent'             : null,
    'id'                 : "PieChart",
    'class'              : "PieChart",
    'csv'                :
    {
 	    'header' : [ "X", "Y" ],
      'data'    : [[0,0],[1,1],[2,4],[3,9],[4,16]]
    },
    'xi'                 : 0,
    'yi'                 : 2,
    'xoffset'            : 0,
    'yoffset'            : 0,
    'colors'             : d3.scale.category20(),
    'innerRadius'        : 0,
    'outerRadius'        : 190,
    'radius'             : 200,
    'label'              :
    {
    	'fontSize'         : 16,
    	'textAnchor'       : 'middle'
    },
    'caption'            :
    {
    	'text'             : '',
    	'fontSize'         : 24,
    	'textAnchor'       : 'middle'
    }
  });

  // Ugly, but my JavaScript is weak.  When in handler functions
  // this seems to be the only way to get linked back to the
  // this.x variables.
  this.chart = this;
}

PieChart.prototype.render = function()
{
  this.update();
};

PieChart.prototype.update = function()
{
	// If we need to call super:
	//DexComponent.prototype.update.call(this);
 	var chart  = this.chart;
  var config = this.config;
  var csv    = config.csv;
  
//  var radius = Math.min(config.width, config.height) / 2;

  var color = d3.scale.ordinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

  var arc = d3.svg.arc()
    .outerRadius(config.outerRadius)
    .innerRadius(config.innerRadius);

  var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d[config.yi]; });

  var chartContainer = config.parent.append("g")
    .attr("id", config["id"])
    .attr("class", config["class"])
    .attr("transform",
      "translate(" + config.xoffset + "," + config.yoffset + ")");

  var data = csv.data;

  // Convert all y values to numerics.
  data.forEach(function(d)
  {
    d[config.yi] = +d[config.yi];
  });

  var g = chartContainer.selectAll(".arc")
    .data(pie(data, function(d) { return d[config.yi]; }))
    .enter().append("g")
    .attr("class", function(d) { return "arc";});

  g.append("path")
    .attr("d", arc)
    .style("fill", function(d, i) { return config.colors(i); });

  g.append("text")
      .attr("transform", function(d)
        {
        	return "translate(" + arc.centroid(d) + ")";
        })
      .attr("dy", ".35em")
      .style("text-anchor", config.label.textAnchor)
      .style("font-size", config.label.fontSize)
      .text(function(d) { return d.data[config.xi]; });

  chartContainer.append("text")
    //.attr("dy", ".35em")
    .attr("y", -config.radius)
    .style("font-size", config.caption.fontSize)
    .style("text-anchor", config.caption.textAnchor)
    .text(config.caption.text);
};
