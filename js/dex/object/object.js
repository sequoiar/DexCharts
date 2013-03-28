dex.object = {};

////
//
// dex.object : This module provides routines dealing with basic javascript
//              objects.
//
////

dex.object.clone = function(obj)
{
	// Simple objects just return themselves.
  if (obj === null || typeof obj !== 'object')
  {
    return obj;
  }

  // Instantiate where we'll make the copy
  var clone = obj.constructor();

  // Iterate over properties.
  for (var key in obj)
  {
  	// Call this recursively to support deep cloning.
    clone[key] = dex.object.clone(obj[key]);
  }

  return clone;
}; 

  /**
   *
   * Overlay the top object on top of the bottom.  This method will first clone
   * the bottom object.  Then it will drop the values within the top object
   * into the clone.
   *
   * @method dex.object.overlay
   * @param {Object} top The object who's properties will be on top.
   * @param {Object} bottom The object who's properties will be on bottom.
   * @return {Object} The overlaid object where the properties in top override
   *                  properties in bottom.  The return object is a clone or
   *                  copy.
   *
   */

dex.object.overlay = function(top, bottom)
{
  // Make a clone of the bottom object.
  var overlay = dex.object.clone(bottom);

	// If we have parameters in the top object, overlay them on top
	// of the bottom object.
  if (top !== 'undefined')
  {
  	// Iterate over the props in top.
    for (var prop in top)
    {
    	// Arrays are special cases. [A] on top of [A,B] should give [A], not [A,B]
    	if (typeof top[prop] == 'object' && overlay[prop] != null &&
    	  !(top[prop] instanceof Array))
    	{
    		//console.log("PROP: " + prop + ", top=" + top + ", overlay=" + overlay);
        overlay[prop] = dex.object.overlay(top[prop], overlay[prop]);
      }
      // Simply overwrite for simple cases and arrays.
      else
      {
      	overlay[prop] = top[prop];
      }
    }
  }

  //console.dir(config);
  return overlay;
};

/**
 * 
 * This method returns a boolean representing whether obj is contained
 * within container.
 * 
 * @param {Object} container
 * @param {Object} obj
 * @return True if container contains obj.  False otherwise.
 */
dex.object.contains = function(container, obj)
{
  var i = container.length;
  while (i--)
  {
    if (container[i] === obj)
    {
      return true;
    }
  }
  return false;
}

dex.object.setHierarchical = function(hierarchy, name, value, delimiter)
{
	if (hierarchy == null)
	{
		hierarchy = {};
	}

	if (typeof hierarchy != 'object')
	{
		return hierarchy;
	}

  // Create an array of names by splitting delimiter, then call
  // this function in the 3 argument (Array of paths) context.
  if (arguments.length == 4)
  {
  	return dex.object.setHierarchical(hierarchy,
      name.split(delimiter), value);
  }
  // Array of paths context.
  else
  {
  	// This is the last variable name, just set the value.
  	if (name.length == 1)
  	{
  		hierarchy[name[0]] = value;
  	}
  	// We still have to traverse.
  	else
  	{
  		// Undefined container object, just create an empty.
  		if (!(name[0] in hierarchy))
  		{
  			hierarchy[name[0]] = {};
  		}

  		// Recursively traverse down the hierarchy.
 			dex.object.setHierarchical(hierarchy[name[0]],
 				name.splice(1), value);
  	}
  }
  return hierarchy;
}

dex.object.isNumeric = function(obj)
{
  return !isNaN(parseFloat(obj)) && isFinite(obj);
};