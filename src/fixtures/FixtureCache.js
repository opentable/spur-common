module.exports = function (Promise, _) {
  class FixtureCache {

    constructor() {
      this.cache = {};

      _.bindAll(this, ['set', 'get', 'getOrPromise', 'setAsync']);
    }

    set(key, value) {
      this.cache[key] = value;
    }

    get(key) {
      return this.cache[key];
    }

    getOrPromise(key, fn) {
      const cacheHit = this.cache[key];

      if (cacheHit) {
        return Promise.resolve(cacheHit);
      }

      return fn().then((result) => {
        this.setAsync(key, result);
        return result;
      });
    }

    setAsync(key, value) {
      setTimeout(() => {
        this.set(key, value);
      });
    }
  }

  return new FixtureCache();
};
