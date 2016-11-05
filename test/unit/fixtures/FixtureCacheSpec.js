describe('FixtureCache', () => {
  beforeEach(function () {
    injector()
    .inject((FixtureCache, Promise) => {
      this.FixtureCache = FixtureCache;
      this.Promise = Promise;
    });
  });

  it('should initialize with an empty cache', function () {
    expect(this.FixtureCache.cache).to.deep.equal({});
  });

  describe('set', () => {
    beforeEach(function () {
      this.testSet = (name, value) => {
        this.FixtureCache.set(name, value);
        expect(this.FixtureCache.cache[name]).to.deep.equal(value);
      };
    });
    it('should set integer', function () {
      this.testSet('test-int', 1234);
    });

    it('should set string', function () {
      this.testSet('test-string', 'my string');
    });

    it('should set bool', function () {
      this.testSet('test-bool-true', true);
      this.testSet('test-bool-false', false);
    });

    it('should set object', function () {
      this.testSet('test-object', { someValue: 'hi', second: { someProp: 'someValue' } });
    });

    it('should set date', function () {
      this.testSet('test-date', new Date());
    });
  });

  describe('get', () => {
    beforeEach(function () {
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
        expect(result).to.deep.equal(value);
      };
    });
    it('should set integer', function () {
      this.testGet('test-int', 1234);
    });

    it('should set string', function () {
      this.testGet('test-string', 'my string');
    });

    it('should set bool', function () {
      this.testGet('test-bool-true', true);
      this.testGet('test-bool-false', false);
    });

    it('should set object', function () {
      this.testGet('test-object', { someValue: 'hi', second: { someProp: 'someValue' } });
    });

    it('should set date', function () {
      this.testGet('test-date', this.expectedTestDate);
    });
  });

  describe('getOrPromise', () => {
    beforeEach(function () {
      this.fetchCallback = () => { return this.Promise.resolve('non-cached value'); };
      sinon.spy(this, 'fetchCallback');
    });

    it('should only make a cache hit when cache entry exists', function () {
      this.FixtureCache.cache.existingKeyEntry = 'cached value';
      this.FixtureCache.getOrPromise('existingKeyEntry', this.fetchCallback)
        .then((result) => {
          expect(result).to.equal('cached value');
          expect(this.fetchCallback.notCalled).to.equal(true);
        });
    });

    it('should call fetch callback when entry is not in cache', function () {
      this.FixtureCache.getOrPromise('existingKeyEntry', this.fetchCallback)
        .then((result) => {
          expect(result).to.equal('non-cached value');
          expect(this.fetchCallback.called).to.equal(true);
        });
    });
  });
});
