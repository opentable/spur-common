module.exports = function (Promise) {
  class FixtureCache {

    constructor() {
      this.cache = {};

      this.get.bind(this);
      this.set.bind(this);
      this.setAsync.bind(this);
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
