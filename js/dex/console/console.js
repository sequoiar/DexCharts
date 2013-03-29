dex.console = {};

////
//
// dex.console : This module provides routines assisting with console output.
//
////

dex.console.log = function()
{
	for (var i=0; i<arguments.length; i++)
	{
		if (typeof arguments[i] == 'object')
		{
			console.dir(arguments[i]);
		}
		else
		{
		  console.log(arguments[i]);
		}
	}
  return this;
};