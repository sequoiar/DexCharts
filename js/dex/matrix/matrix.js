dex.matrix = {};

dex.matrix.slice = function(matrix, columns, rows)
{
	var slice = [];
	
	if (arguments.length === 3)
	{
    for (var ri=0; ri < rows.length; ri++)
	  {
		  slice.push(dex.array.slice(matrix[rows[ri]]));
	  }
	}
	else
	{
		for (var ri=0; ri < matrix.length; ri++)
	  {
	  	//console.log("RI: " + ri);
	  	//console.dir(dex.array.slice(matrix[ri], columns));
		  slice.push(dex.array.slice(matrix[ri], columns));
	  }
	}
	return slice;
}

dex.matrix.flatten = function(matrix)
{
	var array = [];
	for (var ri=0; ri<matrix.length; ri++)
	{
		for (var ci=0; ci<matrix[ri].length;ci++)
		{
			array.push(matrix[ri][ci]);
		}
	}
  return array;
}

dex.matrix.extent = function(data, indices)
{
	var values = data;
	if (arguments.length === 2)
	{
		values = dex.matrix.slice(data, indices);
		return d3.extent(dex.matrix.flatten(values));
	}
}

// Combine each column in matrix1 with each column in matrix2. 
dex.matrix.combine = function(matrix1, matrix2)
{
	var result = [];
	
	// Iterate over the rows in matrix1:
	for (var ri=0; ri<matrix1.length; ri++)
	{
		// Iterate over the columns in matrix2:
		for (var oci=0; oci<matrix1[ri].length; oci++)
		{
			// Iterate over the columns in matrix2:
			for (var ici=0; ici<matrix2[ri].length; ici++)
			{
				result.push([matrix1[ri][oci], matrix2[ri][ici], oci, ici]);
			}
		}
	}
	return result;
}

dex.matrix.isColumnNumeric = function(data, columnNum)
{
  for (var i=1; i<data.length; i++)
  {
	  if (!dex.object.isNumeric(data[i][columnNum]))
	  {
	    return false;
	  }
  }
  return true;
}

dex.matrix.max = function(data, columnNum)
{
  var maxValue = data[0][columnNum];

  if (dex.matrix.isColumnNumeric(data, columnNum))
  {
	  maxValue = parseFloat(data[0][columnNum]);
	  for (var i=1; i<data.length; i++)
    {
      if (maxValue < parseFloat(data[i][columnNum]))
      {
        maxValue = parseFloat(data[i][columnNum]);
      }
    }
  }
  else
  {
    for (var i=1; i<data.length; i++)
    {
      if (maxValue < data[i][columnNum])
      {
        maxValue = data[i][columnNum];
      }
    }
  }
  
  return maxValue;
}

dex.matrix.min = function(data, columnNum)
{
  var minValue = data[0][columnNum];

  if (dex.matrix.isColumnNumeric(data, columnNum))
  {
	  minValue = parseFloat(data[0][columnNum]);
	  for (var i=1; i<data.length; i++)
    {
      if (minValue > parseFloat(data[i][columnNum]))
      {
        minValue = parseFloat(data[i][columnNum]);
      }
    }
  }
  else
  {
    for (var i=1; i<data.length; i++)
    {
      if (minValue > data[i][columnNum])
      {
        minValue = data[i][columnNum];
      }
    }
  }
  
  return minValue;
}