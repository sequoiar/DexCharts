dex.array = {};

////
//
// dex.array : This module provides routines dealing with arrays.
//
////

/**
 * 
 * Take a slice of an array.
 * 
 * @method dex.array.slice
 * @param
 */
dex.array.slice = function(array, rows)
{
	var slice = [];
	
	for (var i = 0; i<rows.length; i++)
	{
		slice.push(array[rows[i]]);
	}

	return slice;
};

dex.array.extent = function(array, indices)
{
	var values = getArrayValues(array, indices);
	var max = Math.max.apply(null, values);
	var min = Math.min.apply(null, values);
	console.log("EXTENT:");
	console.dir(values);
	console.dir([min, max]);
	return [ min, max ];
};
