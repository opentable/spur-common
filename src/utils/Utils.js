const _bindAll = require('lodash.bindall');
const _assignIn = require('lodash.assignin');

module.exports = function (Promise, fsPromise, JSON) {
  class Utils {

    constructor() {
      _bindAll(this, ['readFile', 'readJsonFile']);
    }

    prop(prop) { return (ob) => ob[prop]; }

    extendWith(ob1) { return (ob2) => _assignIn(ob2, ob1); }

    capitalize(str) {
      if (!str) {
        return '';
      }

      return str.charAt(0).toUpperCase() + str.substring(1);
    }

    identity(val) { return () => val; }

    mapObject(ob, fn) {
      const newOb = {};

      Object.keys(ob).forEach((key) => {
        newOb[key] = fn(ob[key]);
      });

      return newOb;
    }

    deepClone(ob) {
      return JSON.parse(JSON.stringify(ob));
    }

    promiseQueue(fns) {
      let queue = Promise.resolve(true);

      fns.forEach((fn) => {
        queue = queue.then(fn);
      });

      return queue;
    }

    readFile(filePath) {
      return fsPromise
        .readFileAsync(filePath, { encoding: 'utf8' });
    }

    readJsonFile(filePath) {
      return this.readFile(filePath)
        .then((data) => {
          try {
            return JSON.parse(data);
          } catch (err) {
            return Promise.reject(new Error(`Error Parsing JSON: ${err}`));
          }
        });
    }
  }

  return new Utils();
};
