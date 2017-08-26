describe('FixtureCache', () => {
  const base = this;

  beforeEach(function () {
    injector()
    .inject(function (FixtureCache, Promise) {
      base.FixtureCache = FixtureCache;
      base.Promise = Promise;
    });
  });

  it('should initialize with an empty cache', function () {
    expect(base.FixtureCache.cache).to.deep.equal({});
  });

  describe('set', () => {
    beforeEach(function () {
      base.testSet = (name, value) => {
        base.FixtureCache.set(name, value);
        expect(base.FixtureCache.cache[name]).to.deep.equal(value);
      };
    });
    it('should set integer', function () {
      base.testSet('test-int', 1234);
    });

    it('should set string', function () {
      base.testSet('test-string', 'my string');
    });

    it('should set bool', function () {
      base.testSet('test-bool-true', true);
      base.testSet('test-bool-false', false);
    });

    it('should set object', function () {
      base.testSet('test-object', { someValue: 'hi', second: { someProp: 'someValue' } });
    });

    it('should set date', function () {
      base.testSet('test-date', new Date());
    });
  });

  describe('get', () => {
    beforeEach(function () {
      base.expectedTestDate = new Date();
      base.FixtureCache.cache = {
        'test-int': 1234,
        'test-string': 'my string',
        'test-bool-true': true,
        'test-bool-false': false,
        'test-object': { someValue: 'hi', second: { someProp: 'someValue' } },
        'test-date': base.expectedTestDate
      };

      base.testGet = (name, value) => {
        const result = base.FixtureCache.get(name);
        expect(result).to.deep.equal(value);
      };
    });
    it('should set integer', function () {
      base.testGet('test-int', 1234);
    });

    it('should set string', function () {
      base.testGet('test-string', 'my string');
    });

    it('should set bool', function () {
      base.testGet('test-bool-true', true);
      base.testGet('test-bool-false', false);
    });

    it('should set object', function () {
      base.testGet('test-object', { someValue: 'hi', second: { someProp: 'someValue' } });
    });

    it('should set date', function () {
      base.testGet('test-date', base.expectedTestDate);
    });
  });

  describe('getOrPromise', () => {
    beforeEach(function () {
      base.fetchCallback = () => { return base.Promise.resolve('non-cached value'); };
      sinon.spy(base, 'fetchCallback');
    });

    it('should only make a cache hit when cache entry exists', function () {
      base.FixtureCache.cache.existingKeyEntry = 'cached value';
      base.FixtureCache.getOrPromise('existingKeyEntry', base.fetchCallback)
        .then((result) => {
          expect(result).to.equal('cached value');
          expect(base.fetchCallback.notCalled).to.equal(true);
        });
    });

    it('should call fetch callback when entry is not in cache', function () {
      base.FixtureCache.getOrPromise('existingKeyEntry', base.fetchCallback)
        .then((result) => {
          expect(result).to.equal('non-cached value');
          expect(base.fetchCallback.called).to.equal(true);
        });
    });
  });
});
