const _bindAll = require('lodash.bindall');

module.exports = function (path, Promise, fsPromise, FixtureCache, Logger) {
  class FixtureUtil {

    constructor(fixturesPath) {
      _bindAll(this, ['get', 'readAndProcessFile', 'startFileRead']);
      this.fixturesPath = fixturesPath;
      this.cache = FixtureCache;
    }

    setFixturesPath(fixturesPath) {
      this.fixturesPath = fixturesPath;
      Logger.log(`Fixtures path changed to: ${this.fixturesPath}`);
    }

    get(name) {
      const fetchCallback = () => this.readAndProcessFile(name);
      const returnPromise = this.cache.getOrPromise(name, fetchCallback);
      return returnPromise;
    }

    readAndProcessFile(name) {
      return this.startFileRead(name)
        .then(this.processText);
    }

    startFileRead(name) {
      if (!this.fixturesPath) {
        return Promise.reject(new Error('fixtures path is not defined'));
      }

      const filePath = path.join(this.fixturesPath, `${name}.json`);

      Logger.log(`Using file fixture: ${filePath}`);

      return fsPromise
        .readFileAsync(filePath, { encoding: 'utf8' })
        .catch(() => Promise.reject(new Error(`${filePath} not found`)));
    }

    processText(text) {
      if (text && text.length > 0) {
        return JSON.parse(text);
      }

      return {};
    }
  }

  return new FixtureUtil();
};
