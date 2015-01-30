var spurConfig = require("spur-config");

module.exports = function(ioc, folderPath, configName){
  try {
    var configName = configName || "config";
    var configLoaderName = configName + "Loader";

    var configLoader = spurConfig.load(folderPath);
    var config = configLoader.getConfig();

    var dependencies = {};
    dependencies[configLoaderName] = configLoader
    dependencies[configName] = config

    ioc.registerDependencies(dependencies);
  } catch (e){
    console.error("Error registering config", e)
    throw e
  }
};