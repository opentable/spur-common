module.exports = function (P) {
  const PromiseCtor = P || Promise;

  class FixtureCache {
    constructor() {
      this.cache = new Map();
      this.inflight = new Map();
    }

    set(key, value) {
      this.cache.set(key, value);
    }

    get(key) {
      return this.cache.get(key);
    }

    getOrPromise(key, fn) {
      if (this.cache.has(key)) {
        return PromiseCtor.resolve(this.cache.get(key));
      }

      if (this.inflight.has(key)) {
        return this.inflight.get(key);
      }

      const p = PromiseCtor.resolve()
        .then(fn)
        .then((result) => {
          this.setAsync(key, result);
          this.inflight.delete(key);
          return result;
        })
        .catch((err) => {
          this.inflight.delete(key);
          throw err;
        });

      this.inflight.set(key, p);
      return p;
    }

    setAsync(key, value) {
      setTimeout(() => this.set(key, value), 0);
    }
  }

  return new FixtureCache();
};
