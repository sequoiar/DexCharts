dex.datagen = {};

dex.datagen.randomMatrix = function(spec)
{
  //{"rows":10, "columns": 4, "min", 0, "max":100})
  var matrix = [];
  var range = spec.max - spec.min;
  for (var ri = 0; ri<spec.rows; ri++)
  {
  	var row = [];

  	for (var ci=0; ci<spec.columns;ci++)
  	{
      row.push(Math.random() * range + spec.min);
  	}
  	matrix.push(row);
  }
  
  return matrix;
};
