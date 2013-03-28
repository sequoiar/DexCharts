dex.csv = {};

dex.csv.csv = function(header, data)
{
	return { "header" : header, "data" : data };
}

dex.csv.createMap = function(csv, keyIndex)
{
	var map = {};
	
	for (var ri=0; ri<csv.data.length; ri++)
	{
		if (csv.data[ri].length == csv.header.length)
		{
			var rowMap = {};
			for (var ci=0; ci<csv.header.length; ci++)
			{
				rowMap[csv.header[ci]] = csv.data[ri][ci];
			}
			map[csv.data[ri][keyIndex]] = rowMap;
		}
	}
	return map;
};

dex.csv.toJson = function(csv, rowIndex, columnIndex)
{
	var jsonData = [];

  if (arguments.length == 3)
  {
  	var jsonRow = {};
	  jsonRow[csv.header[columnIndex]] = csv.data[rowIndex][columnIndex];
		return jsonRow;
  }
  else if (arguments.length == 2)
  {
  	var jsonRow = {};
		for (var ci=0; ci<csv.header.length; ci++)
		{
		  jsonRow[csv.header[ci]] = csv.data[rowIndex][ci];
		}
		return jsonRow;
  }
  else
  {
	  for (var ri=0; ri<csv.data.length; ri++)
	  {
		  var jsonRow = {};
		  for (var ci=0; ci<csv.header.length; ci++)
		  {
			  jsonRow[csv.header[ci]] = csv.data[ri][ci];
		  }
		  jsonData.push(jsonRow);
	  }
  }	
	return jsonData;
};

dex.csv.createRowMap = function(csv, keyIndex)
{
	var map = {};
	
	for (var ri=0; ri<csv.data.length; ri++)
	{
		if (csv.data[ri].length == csv.header.length)
		{
			map[csv.data[ri][keyIndex]] = csv.data[ri];
    }
	}
	return map;
}

dex.csv.getNumericColumnNames = function(csv)
{
  var possibleNumeric = {};
  var i, j;
  var numericColumns = [];

  for (i=0; i<csv.header.length; i++)
  {
    possibleNumeric[csv.header[i]] = true;
  }
  
  // Iterate thru the data, skip the header.
  for (ri=0; ri<csv.data.length; ri++)
  {
    for (ci=0; ci<csv.data[ri].length && ci<csv.header.length; ci++)
	  {
	    if (possibleNumeric[csv.header[ci]] && !dex.object.isNumeric(csv.data[ri][ci]))
	    {
        possibleNumeric[csv.header[ci]] = false;
	    }
	  }
  }

  for (ci=0; ci<csv.header.length; ci++)
  {
    if (possibleNumeric[csv.header[ci]])
	  {
      numericColumns.push(csv.header[ci]);
	  }
  }

  return numericColumns;
}

dex.csv.getNumericIndices = function(csv)
{
  var possibleNumeric = {};
  var i, j;
  var numericIndices = [];

  for (i=0; i<csv.header.length; i++)
  {
    possibleNumeric[csv.header[i]] = true;
  }
  
  // Iterate thru the data, skip the header.
  for (i=1; i<csv.data.length; i++)
  {
	  for (j=0; j<csv.data[i].length && j<csv.header.length; j++)
	  {
	    if (possibleNumeric[csv.header[j]] && !dex.object.isNumeric(csv.data[i][j]))
	    {
		    possibleNumeric[csv.header[j]] = false;
	    }
	  }
  }
  
  for (i=0; i<csv.header.length; i++)
  {
	  if (possibleNumeric[csv.header[i]])
	  {
	    numericIndices.push(i);
	  }
  }

  return numericIndices;
};

dex.csv.isColumnNumeric = function(csv, columnNum)
{
  for (var i=0; i<csv.data.length; i++)
  {
	  if (!dex.object.isNumeric(csv.data[i][columnNum]))
	  {
	    return false;
	  }
  }
  return true;
};

dex.csv.toMapArray = function(csv)
{
  var mapArray = [];
  
  for (var i=0; i<csv.data.length; i++)
  {
	  var row = {};
    for (var j=0; j<csv.header.length; j++)
  	{
      row[csv.header[j]] = csv.data[i][j]
    }
    mapArray.push(row);
  }
  
  return mapArray;
};