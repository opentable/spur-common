describe('FixtureCache', function () {

  beforeEach(() => {
    injector()
      .inject((FixtureCache, Promise) => {
        this.FixtureCache = FixtureCache;
        this.Promise = Promise;
      });
  });

  it('should initialize with an empty cache', () => {
    expect(this.FixtureCache.cache).toEqual({});
  });

  describe('set', () => {
    beforeEach(() => {
      this.testSet = (name, value) => {
        this.FixtureCache.set(name, value);
        expect(this.FixtureCache.cache[name]).toEqual(value);
      };
    });
    it('should set integer', () => {
      this.testSet('test-int', 1234);
    });

    it('should set string', () => {
      this.testSet('test-string', 'my string');
    });

    it('should set bool', () => {
      this.testSet('test-bool-true', true);
      this.testSet('test-bool-false', false);
    });

    it('should set object', () => {
      this.testSet('test-object', { someValue: 'hi', second: { someProp: 'someValue' } });
    });

    it('should set date', () => {
      this.testSet('test-date', new Date());
    });
  });

  describe('get', () => {
    beforeEach(() => {
      this.expectedTestDate = new Date();
      this.FixtureCache.cache = {
        'test-int': 1234,
        'test-string': 'my string',
        'test-bool-true': true,
        'test-bool-false': false,
        'test-object': { someValue: 'hi', second: { someProp: 'someValue' } },
        'test-date': this.expectedTestDate
      };

      this.testGet = (name, value) => {
        const result = this.FixtureCache.get(name);
        expect(result).toEqual(value);
      };
    });
    it('should set integer', () => {
      this.testGet('test-int', 1234);
    });

    it('should set string', () => {
      this.testGet('test-string', 'my string');
    });

    it('should set bool', () => {
      this.testGet('test-bool-true', true);
      this.testGet('test-bool-false', false);
    });

    it('should set object', () => {
      this.testGet('test-object', { someValue: 'hi', second: { someProp: 'someValue' } });
    });

    it('should set date', () => {
      this.testGet('test-date', this.expectedTestDate);
    });
  });

  describe('getOrPromise', () => {
    beforeEach(() => {
      this.fetchCallback = () => { return this.Promise.resolve('non-cached value'); };
      jest.spyOn(this, 'fetchCallback');
    });

    it('should only make a cache hit when cache entry exists', () => {
      this.FixtureCache.cache.existingKeyEntry = 'cached value';
      return this.FixtureCache.getOrPromise('existingKeyEntry', this.fetchCallback)
        .then((result) => {
          expect(result).toBe('cached value');
          expect(this.fetchCallback).not.toHaveBeenCalled();
        });
    });

    it('should call fetch callback when entry is not in cache', () => {
      return this.FixtureCache.getOrPromise('existingKeyEntry', this.fetchCallback)
        .then((result) => {
          expect(result).toBe('non-cached value');
          expect(this.fetchCallback).toHaveBeenCalled();
        });
    });
  });
});
