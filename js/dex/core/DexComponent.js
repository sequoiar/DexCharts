function DexComponent(userConfig, defaultConfig)
{
	// This holds our event registry.
	this.registry = {};
	this.debug = false;

	//console.log("Instantiating dex component...");

	// Instantiate from another component
	if (userConfig instanceof DexComponent)
	{
 		this.config = dex.object.overlay(userConfig.config, defaultConfig);
 	}
 	else
 	{
    this.config = dex.object.overlay(userConfig, defaultConfig);
    //console.dir(this.config);
  }
}

DexComponent.prototype.attr = function(name, value)
{
  if (arguments.length == 1)
  {
    return this.config[name];
  }
  else if (arguments.length == 2)
  {
  	//console.log("Setting Hieararchical: " + name + "=" + value);
  	//console.dir(this.config);

  	// This will handle the setting of a single attribute
    dex.object.setHierarchical(this.config, name, value, '.');

    //console.dir(this.config);
  }
  return this;
};

DexComponent.prototype.dump = function(message)
{
	console.log("========================");
	if (arguments.length == 1)
	{ 	
	  console.log(message);
	  console.log("========================");
	}
	console.log("=== CONFIG ===");
	console.dir(this.config);
	console.log("=== REGISTRY ===");
	console.dir(this.registry);
};

DexComponent.prototype.addListener = function(eventType, target, method)
{
  var targets;

  if (this.debug)
  {
    console.log("Registering Target: " + eventType + "="+ target);
  }
  if (!this.registry.hasOwnProperty(eventType))
  {
    this.registry[eventType] = [];
  }

  this.registry[eventType].push({ target : target, method : method });
  //console.log("this.registry");	
  //console.dir(eventthis.registry);
};

DexComponent.prototype.notify = function(event)
{
  var targets;

  if (this.debug)
  {
    console.log("notify: " + event.type);
  }
  
  if (!this.registry.hasOwnProperty(event.type))
  {
    return;
  }

  event.source = this;
  targets = this.registry[event.type];
  //console.log("TARGETS: " + targets.length);
  //console.dir(targets);
  for (var i=0; i<targets.length; i++)
  {
    //console.dir("Calling Target: " + targets[i]["target"]);
	  targets[i]["method"](event, targets[i]["target"]);
  }
};

DexComponent.prototype.render = function()
{
  console.log("Rendering component...");
};

DexComponent.prototype.update = function()
{
	console.log("Updating component...");
};