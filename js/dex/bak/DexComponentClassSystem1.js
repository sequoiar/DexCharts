function DexComponent(userConfig, defaultConfig)
{
	// This holds our event registry.
  var registry = {};

	// Instantiate from another component
	if (userConfig instanceof DexComponent)
	{
 		this.config = getConfig(userConfig.config, defaultConfig);
 	}
 	else
 	{
    this.config = getConfig(userConfig, defaultConfig);
    //console.dir(this.config);
  }

  this.attr = function (name, value)
  {
    if (arguments.length == 1)
    {
      return this.config[name];
    }
    else if (arguments.length == 2)
    {
      this.config[name] = value;
    }
  };

  this.addListener = function(eventType, target)
  {
	  var targets;

    //console.log("REGISTERING TARGET: " + eventType + "="+ target);
 	  if (!registry.hasOwnProperty(eventType))
	  {
	    registry[eventType] = [];
    }

 	  registry[eventType].push(target);
    //console.log("REGISTRY");	
 	  //console.dir(eventRegistry);
  };
    
  this.notify = function(event)
  {
    var targets;

    //console.dir(registry);
    //console.log("notify: " + event.type);
	  if (!registry.hasOwnProperty(event.type))
 	  {
 		  return;
    }

    event.source = this;
    targets = registry[event.type];
    //console.log("TARGETS: " + targets.length);
    //console.dir(targets);
    for (var i=0; i<targets.length; i++)
    {
      //console.dir("Calling Target: " + targets[i]);
  	  targets[i](event);
    }
  };

  this.render = function()
  {
  	// console.log("Rendering component...");
  };
    
  this.update = function()
  {
  	//console.log("Updating component...");
  }
}