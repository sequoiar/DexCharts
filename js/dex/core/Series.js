Series.prototype = new DexComponent();
Series.constructor = Series;

function Series(csv, userConfig)
{
  DexComponent.call(this, userConfig,
  {
  	// The parent container of this chart.
    'name'           : 'series',
    // Set these when you need to CSS style components independently.
    'id'               : 'Series',
    'class'            : 'Series',
    // Our data...
    'csv'              : csv
  });

  this.series = this;
}

Series.prototype.name = function()
{
	// If we need to call super:
	//DexComponent.prototype.update.call(this);
 	var series = this.series;
  var config = this.config;
  
  return config.name;
}

Series.prototype.csv = function()
{
  var config = this.config;
  
  return config.csv;
}

Series.prototype.dimensions = function()
{
  var csv = this.config.csv;
  console.log("CSV");
  console.dir(csv);
  return { "rows" : csv.data.length, "columns" : csv.header.length };
}

Series.prototype.value = function(rowIndex, columnIndex)
{
	var csv = this.config.csv;
	if (arguments.length == 2)
	{
	  return csv.data[rowIndex][columnIndex];
	}
	return csv.data[rowIndex];
}

Series.prototype.jsonValue = function(rowIndex, columnIndex)
{
	var csv = this.config.csv;
	if (arguments.length == 2)
	{
	  return dex.csv.toJson(csv, rowIndex, columnIndex);
	}
	else if (arguments.length == 1)
	{
	  return dex.csv.toJson(csv, rowIndex)
	}
	return dex.csv.toJson(csv);
}
