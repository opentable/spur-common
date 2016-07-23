import spurConfig from 'spur-config';

function iocRegistration(ioc, folderPath, configNameArg) {
  try {
    const configName = configNameArg || 'config';
    const configLoaderName = '${configName}Loader';

    const configLoader = spurConfig.load(folderPath);
    const config = configLoader.getConfig();

    const dependencies = {};
    dependencies[configLoaderName] = configLoader;
    dependencies[configName] = config;

    ioc.registerDependencies(dependencies);
  } catch (e) {
    console.error('Error registering config', e);
    throw e;
  }
}

export default iocRegistration;
